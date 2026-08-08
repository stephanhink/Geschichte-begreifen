// Ein sehr kleiner Markdown-Zerleger — gerade so viel, wie die Themen-Texte
// brauchen.
//
// Warum überhaupt? Die Texte in utils/themen/ sind menschenlesbar im Repo
// abgelegt: harte Zeilenumbrüche bei ~72 Zeichen, Leerzeilen zwischen den
// Absätzen, Überschriften mit „## ", Aufzählungen mit „- " und Hervorhebungen
// mit „**…**". Die App darf diese Umbrüche nicht einfach anzeigen — sie muss
// wieder fließenden Text daraus machen.
//
// Kein npm-Paket dafür (Regel aus CLAUDE.md: keine neuen Pakete), keine
// UI-Importe (Architektur-Regel) — reine Textumformung, mit blankem `node`
// prüfbar. Die Komponente components/MarkdownText.js macht daraus Ansichten.
//
// ---------------------------------------------------------------------------
// Ergebnisform von zerlegeMarkdown(): eine Liste von Blöcken
// ---------------------------------------------------------------------------
//
//   { art: 'ueberschrift', ebene: 2, text: 'Aus einem Dorf wird ein Weltreich' }
//   { art: 'absatz',       text: 'Rom beginnt klein. …' }
//   { art: 'liste',        punkte: ['Das Reich war zu groß …', '…'] }
//
// Ergebnisform von zerlegeInline(): eine Liste von Textstücken
//
//   [{ text: 'Die Straßen.', fett: true }, { text: ' Rund 80 000 …', fett: false }]

/** Zeile ist eine Überschrift: „# " bis „###### ". */
const UEBERSCHRIFT_MUSTER = /^(#{1,6})\s+(.*)$/;

/** Zeile beginnt einen Aufzählungspunkt: „- " oder „* ". */
const LISTENPUNKT_MUSTER = /^[-*]\s+(.*)$/;

/** Hervorhebung: **fett**. */
const FETT_MUSTER = /\*\*([^*]+)\*\*/g;

/**
 * Zerlegt einen Themen-Text in Blöcke (Überschriften, Absätze, Listen).
 *
 * Harte Zeilenumbrüche innerhalb eines Absatzes werden zu Leerzeichen — der
 * Text fließt danach in der Breite, die das Gerät hergibt. Leerzeilen trennen
 * Blöcke.
 *
 * @param {string} text Markdown-artiger Text aus einem Themen-Modul
 * @returns {Array<object>} Blöcke in der Reihenfolge des Textes
 */
function zerlegeMarkdown(text) {
  if (typeof text !== 'string' || text.trim().length === 0) return [];

  const bloecke = [];
  let offen = null; // der Block, an den die nächste Zeile angehängt wird

  const schliesse = () => {
    if (offen) bloecke.push(offen);
    offen = null;
  };

  for (const roheZeile of text.split('\n')) {
    const zeile = roheZeile.trim();

    // Leerzeile: beendet den laufenden Block.
    if (zeile.length === 0) {
      schliesse();
      continue;
    }

    const ueberschrift = UEBERSCHRIFT_MUSTER.exec(zeile);
    if (ueberschrift) {
      schliesse();
      bloecke.push({
        art: 'ueberschrift',
        ebene: ueberschrift[1].length,
        text: ueberschrift[2].trim(),
      });
      continue;
    }

    const listenpunkt = LISTENPUNKT_MUSTER.exec(zeile);
    if (listenpunkt) {
      if (!offen || offen.art !== 'liste') {
        schliesse();
        offen = { art: 'liste', punkte: [] };
      }
      offen.punkte.push(listenpunkt[1].trim());
      continue;
    }

    // Gewöhnliche Zeile: Fortsetzung des laufenden Blocks …
    if (offen && offen.art === 'liste') {
      // eingerückte Folgezeile eines Aufzählungspunkts
      const letzter = offen.punkte.length - 1;
      offen.punkte[letzter] = `${offen.punkte[letzter]} ${zeile}`.trim();
    } else if (offen && offen.art === 'absatz') {
      offen.text = `${offen.text} ${zeile}`;
    } else {
      // … oder ein neuer Absatz.
      offen = { art: 'absatz', text: zeile };
    }
  }

  schliesse();
  return bloecke;
}

/**
 * Zerlegt einen Absatz in fette und normale Textstücke.
 *
 * Gibt immer mindestens ein Stück zurück (auch bei leerem Text), damit die
 * UI nicht auf leere Listen prüfen muss.
 *
 * @param {string} text
 * @returns {Array<{text: string, fett: boolean}>}
 */
function zerlegeInline(text) {
  if (typeof text !== 'string' || text.length === 0) {
    return [{ text: '', fett: false }];
  }

  const stuecke = [];
  let position = 0;

  FETT_MUSTER.lastIndex = 0;
  let treffer = FETT_MUSTER.exec(text);
  while (treffer) {
    if (treffer.index > position) {
      stuecke.push({ text: text.slice(position, treffer.index), fett: false });
    }
    stuecke.push({ text: treffer[1], fett: true });
    position = treffer.index + treffer[0].length;
    treffer = FETT_MUSTER.exec(text);
  }

  if (position < text.length) {
    stuecke.push({ text: text.slice(position), fett: false });
  }

  return stuecke.length > 0 ? stuecke : [{ text, fett: false }];
}

/**
 * Erste Sätze eines Textes — für Vorschauen (z. B. Karten in der Übersicht).
 *
 * Nimmt den ersten Absatz und kürzt ihn an einer Wortgrenze.
 *
 * @param {string} text
 * @param {number} [maximum] Höchstlänge in Zeichen
 * @returns {string} Vorschautext (ggf. mit „…" am Ende), sonst leer
 */
function vorschau(text, maximum = 160) {
  const bloecke = zerlegeMarkdown(text);
  const ersterAbsatz = bloecke.find((block) => block.art === 'absatz');
  if (!ersterAbsatz) return '';

  // Hervorhebungen in der Vorschau als reiner Text.
  const klartext = zerlegeInline(ersterAbsatz.text)
    .map((stueck) => stueck.text)
    .join('');

  if (klartext.length <= maximum) return klartext;

  const gekuerzt = klartext.slice(0, maximum);
  const letztesLeerzeichen = gekuerzt.lastIndexOf(' ');
  const basis = letztesLeerzeichen > 0 ? gekuerzt.slice(0, letztesLeerzeichen) : gekuerzt;
  return `${basis.replace(/[,;:.\s]+$/, '')} …`;
}

module.exports = {
  zerlegeMarkdown,
  zerlegeInline,
  vorschau,
};
