// Lernfortschritt und „Dein Urteil" — was auf dem Gerät bleibt.
//
// Keine Accounts, kein Netzwerk (CLAUDE.md): Alles liegt lokal im
// Schlüssel-Wert-Speicher. In der App ist das
// @react-native-async-storage/async-storage, im Test ein Fake — deshalb
// bekommt erstelleFortschritt() den Speicher übergeben, statt ihn selbst zu
// importieren. So bleibt diese Datei ohne UI- und ohne Plattform-Import und
// ist mit blankem `node` prüfbar (Architektur-Regel).
//
// Erwartete Speicher-Schnittstelle (das kann AsyncStorage von Haus aus):
//
//   getItem(schluessel)          -> Promise<string|null>
//   setItem(schluessel, wert)    -> Promise<void>
//   removeItem(schluessel)       -> Promise<void>
//
// ---------------------------------------------------------------------------
// Der Stand eines Themas
// ---------------------------------------------------------------------------
//
//   {
//     besucht:       true,      // Thema wurde schon einmal geöffnet
//     urteil:        '…',       // die eigene Antwort auf die Urteilsfrage
//     quizAntworten: { '0': 1 } // Fragennummer -> angetippte Antwort
//   }
//
// Drei Stufen ergeben sich daraus (siehe stufe()):
//   'neu'       — noch nicht geöffnet
//   'entdeckt'  — geöffnet, aber noch nicht durchgearbeitet
//   'erforscht' — Urteil geschrieben ODER alle Quizfragen erkundet

const { alleErkundet } = require('./quiz');

/** Namensraum im Speicher — die Version erlaubt später einen sauberen Schnitt. */
const SCHLUESSEL_PRAEFIX = 'geschichte-begreifen:v1:thema:';

/** Beschriftungen der Stufen für die Übersicht. */
const STUFEN_TEXTE = {
  neu: 'Noch nicht geöffnet',
  entdeckt: 'Entdeckt',
  erforscht: 'Erforscht',
};

/**
 * Speicherschlüssel eines Themas.
 *
 * @param {string} themaId
 * @returns {string}
 */
function schluessel(themaId) {
  return SCHLUESSEL_PRAEFIX + themaId;
}

/**
 * Ein frischer, leerer Stand.
 *
 * @returns {{besucht: boolean, urteil: string, quizAntworten: object}}
 */
function leererStand() {
  return { besucht: false, urteil: '', quizAntworten: {} };
}

/**
 * Bringt einen (womöglich alten oder beschädigten) Stand in die erwartete Form.
 *
 * Fehlende oder falsch getippte Felder werden still ersetzt — ein kaputter
 * Eintrag darf die App nie am Starten hindern.
 *
 * @param {*} roh
 * @returns {{besucht: boolean, urteil: string, quizAntworten: object}}
 */
function normalisiereStand(roh) {
  const stand = leererStand();
  if (!roh || typeof roh !== 'object' || Array.isArray(roh)) return stand;

  stand.besucht = roh.besucht === true;
  if (typeof roh.urteil === 'string') stand.urteil = roh.urteil;

  if (roh.quizAntworten && typeof roh.quizAntworten === 'object' && !Array.isArray(roh.quizAntworten)) {
    for (const [frage, antwort] of Object.entries(roh.quizAntworten)) {
      if (/^\d+$/.test(frage) && Number.isInteger(antwort) && antwort >= 0) {
        stand.quizAntworten[frage] = antwort;
      }
    }
  }

  // Ein Stand mit Inhalt ist zwangsläufig auch besucht worden.
  if (stand.urteil.trim().length > 0 || Object.keys(stand.quizAntworten).length > 0) {
    stand.besucht = true;
  }

  return stand;
}

/**
 * Hat die Schülerin/der Schüler ein Urteil geschrieben?
 *
 * @param {object} stand
 * @returns {boolean}
 */
function hatUrteil(stand) {
  return Boolean(stand && typeof stand.urteil === 'string' && stand.urteil.trim().length > 0);
}

/**
 * Gilt das Thema als durchgearbeitet?
 *
 * Es genügt eines von beidem: ein geschriebenes Urteil oder alle erkundeten
 * Quizfragen. Niemand muss alles machen, um „erforscht" zu sein — es geht
 * ums Erforschen, nicht ums Abhaken.
 *
 * @param {object} stand
 * @param {Array<object>} quiz Quizfragen des Themas
 * @returns {boolean}
 */
function istErforscht(stand, quiz) {
  if (!stand) return false;
  return hatUrteil(stand) || alleErkundet(quiz, stand.quizAntworten);
}

/**
 * Stufe eines Themas: 'neu', 'entdeckt' oder 'erforscht'.
 *
 * @param {object} stand
 * @param {Array<object>} quiz
 * @returns {'neu'|'entdeckt'|'erforscht'}
 */
function stufe(stand, quiz) {
  if (istErforscht(stand, quiz)) return 'erforscht';
  if (stand && stand.besucht) return 'entdeckt';
  return 'neu';
}

/**
 * Beschriftung einer Stufe für die Übersicht.
 *
 * @param {string} stufenName
 * @returns {string}
 */
function stufenText(stufenName) {
  return STUFEN_TEXTE[stufenName] || STUFEN_TEXTE.neu;
}

/**
 * Baut die Lade-/Speicher-Helfer um einen Schlüssel-Wert-Speicher herum.
 *
 * @param {{getItem: Function, setItem: Function, removeItem?: Function}} speicher
 * @returns {{lade: Function, ladeAlle: Function, speichere: Function,
 *            aktualisiere: Function, vergiss: Function}}
 */
function erstelleFortschritt(speicher) {
  if (!speicher || typeof speicher.getItem !== 'function' || typeof speicher.setItem !== 'function') {
    throw new Error('erstelleFortschritt braucht einen Speicher mit getItem und setItem.');
  }

  /**
   * Lädt den Stand eines Themas. Fehlt er oder ist er unlesbar, kommt ein
   * leerer Stand zurück — nie ein Fehler.
   *
   * @param {string} themaId
   * @returns {Promise<object>}
   */
  async function lade(themaId) {
    try {
      const roh = await speicher.getItem(schluessel(themaId));
      if (!roh) return leererStand();
      return normalisiereStand(JSON.parse(roh));
    } catch (fehler) {
      return leererStand();
    }
  }

  /**
   * Lädt die Stände mehrerer Themen auf einmal.
   *
   * @param {Array<string>} themaIds
   * @returns {Promise<object>} Zuordnung themaId -> Stand
   */
  async function ladeAlle(themaIds) {
    const ids = Array.isArray(themaIds) ? themaIds : [];
    const staende = await Promise.all(ids.map((id) => lade(id)));
    const ergebnis = {};
    ids.forEach((id, i) => {
      ergebnis[id] = staende[i];
    });
    return ergebnis;
  }

  /**
   * Schreibt einen Stand. Der geschriebene (normalisierte) Stand kommt zurück,
   * damit die UI genau das anzeigt, was auch auf dem Gerät liegt.
   *
   * @param {string} themaId
   * @param {object} stand
   * @returns {Promise<object>}
   */
  async function speichere(themaId, stand) {
    const sauber = normalisiereStand(stand);
    try {
      await speicher.setItem(schluessel(themaId), JSON.stringify(sauber));
    } catch (fehler) {
      // Speichern darf nie den Lernfluss unterbrechen — der Stand bleibt
      // dann eben nur für diese Sitzung im Arbeitsspeicher.
    }
    return sauber;
  }

  /**
   * Ändert einzelne Felder eines Standes und schreibt ihn zurück.
   *
   * @param {string} themaId
   * @param {object} aenderung Felder, die überschrieben werden
   * @returns {Promise<object>} der neue Stand
   */
  async function aktualisiere(themaId, aenderung) {
    const alt = await lade(themaId);
    return speichere(themaId, { ...alt, ...aenderung });
  }

  /**
   * Löscht den Stand eines Themas (für einen echten Neuanfang).
   *
   * @param {string} themaId
   * @returns {Promise<object>} der nun leere Stand
   */
  async function vergiss(themaId) {
    try {
      if (typeof speicher.removeItem === 'function') {
        await speicher.removeItem(schluessel(themaId));
      } else {
        await speicher.setItem(schluessel(themaId), JSON.stringify(leererStand()));
      }
    } catch (fehler) {
      // siehe speichere(): ein fehlgeschlagenes Löschen bleibt folgenlos
    }
    return leererStand();
  }

  return { lade, ladeAlle, speichere, aktualisiere, vergiss };
}

module.exports = {
  SCHLUESSEL_PRAEFIX,
  STUFEN_TEXTE,
  schluessel,
  leererStand,
  normalisiereStand,
  hatUrteil,
  istErforscht,
  stufe,
  stufenText,
  erstelleFortschritt,
};
