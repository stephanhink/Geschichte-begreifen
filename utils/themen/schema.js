// Schema für Themen-Module — die Form, die jedes Kapitel der App hat.
//
// Architektur-Regel (CLAUDE.md): Inhalte liegen als reine Daten in utils/ —
// keine UI-Importe, mit blankem `node` prüfbar. Deshalb CommonJS
// (module.exports) und nicht ESM: package.json hat kein "type": "module",
// also lädt node .js-Dateien als CommonJS. Metro/Babel versteht CommonJS in
// React Native ebenso — dieselbe Datei läuft im Test und in der App.
//
// ---------------------------------------------------------------------------
// Aufbau eines Themen-Moduls (entspricht dem Lernformat aus CLAUDE.md)
// ---------------------------------------------------------------------------
//
//   {
//     id:      'roemisches-reich',   // ASCII-Slug, Kleinbuchstaben, Bindestrich
//                                    //   getrennt — Dateiname = id + '.js'
//     titel:   'Das Römische Reich',
//     epoche:  'Antike (ca. 753 v. Chr. – 476 n. Chr.)',
//
//     // 1. Aufhänger — eine spannende Frage statt Datenwüste.
//     aufhaenger: {
//       frage: 'Ein Reich, das halb Europa umspannte — wie hält man das
//               zusammen?',
//       text:  'Kurzer Einstiegstext, der neugierig macht.',
//     },
//
//     // 3. Zwei (oder mehr) Blickwinkel — der Kern der App.
//     //    Mehrere Perspektiven pro Thema sind ausdrücklich vorgesehen:
//     //    Opus schreibt die westliche Sicht, Hermes ergänzt die
//     //    chinesische. Weitere Stimmen können jederzeit dazukommen.
//     perspektiven: [
//       {
//         id:     'europaeisch',            // ASCII-Slug, im Thema eindeutig
//         name:   'Europäische Sichtweise', // Anzeigename in der App
//         stimme: 'Opus',                   // Attribution: wer hat sie
//                                           //   verfasst (Repo-Ebene)
//         text:   'Die Erzählung aus diesem Blickwinkel.',
//       },
//     ],
//
//     // 4. Synthese — benennt Übereinstimmungen UND Widersprüche der
//     //    Perspektiven, ohne zu werten. Sagt nie „so war es".
//     synthese: 'Wo die Sichtweisen sich treffen, wo sie auseinandergehen.',
//
//     // 5. Dein Urteil — offene Frage, kein Richtig oder Falsch.
//     urteil: {
//       frage:   'Die offene Frage an die Lernenden.',
//       hinweis: 'Optionaler Denkanstoß.',   // darf fehlen
//     },
//
//     // 6. „Stimmt's?" — lockere Quizfragen, kein Zeitdruck, keine Noten.
//     quiz: [
//       {
//         frage:      'Stimmt es, dass …?',
//         antworten:  ['Antwort A', 'Antwort B', 'Antwort C'],
//         richtig:    1,            // Index in `antworten` (0-basiert)
//         erklaerung: 'Kurz und freundlich erklärt, warum.',
//       },
//     ],
//
//     // 2. „Geschichte in Bewegung" — OPTIONAL. Bringt ein Thema dieses
//     //    Feld mit, erscheint der Karten-Abschnitt zwischen Aufhänger und
//     //    Blickwinkeln; fehlt es, wird er übersprungen.
//     //    Alle Koordinaten sind SVG-Koordinaten innerhalb von
//     //    breite × hoehe (die ViewBox). Die Themen-Module rechnen sie aus
//     //    echten Längen-/Breitengraden aus — siehe utils/karte-geo.js.
//     karte: {
//       breite: 700,
//       hoehe:  548.3,
//
//       // Der statische Untergrund: Meer, Landmassen, Flüsse.
//       basis: [
//         { art: 'land', d: 'M …', fill: '#F3E6CD', stroke: '#D2BB92',
//           strokeWidth: 1 },
//       ],
//
//       // Die Epochen, zwischen denen der Umschalter wechselt (mind. 2).
//       phasen: [
//         {
//           id:    'hoehepunkt',        // ASCII-Slug, in der Karte eindeutig
//           label: '117 n. Chr.',       // Beschriftung des Umschalters
//           hinweis: 'Ein Satz dazu.',  // optional
//           flaechen: [{ titel: 'Britannien', d: 'M …' }],
//         },
//       ],
//
//       // Die anklickbaren Info-Punkte — hier lebt das Hintergrundwissen.
//       punkte: [
//         { id: 'rom', name: 'Rom', typ: 'stadt', x: 285.8, y: 245.2,
//           text: 'Der lange Text, der im Popup erscheint.' },
//       ],
//
//       // Routen (Völkerwanderung) — optional, aber wenn da, dann vollständig.
//       bewegungen: [
//         { id: 'hunnen', name: 'Hunnen', von: [682.5, 129.5],
//           ueber: [[606.7, 144.7]],       // optional: Zwischenpunkte
//           nach: [367.5, 167.5], text: 'Was dort passiert ist.' },
//       ],
//
//       // Landschafts- und Meeresnamen — optional.
//       beschriftungen: [
//         { text: 'Mittelmeer', art: 'meer', x: 315, y: 380, drehung: 0 },
//       ],
//     },
//   }
//
// Weitere Felder (z. B. Zeitleisten) dürfen später ergänzt werden — die
// Prüfung unten stört sich nicht daran.

/** Erlaubte Form eines Slugs: ASCII, klein, Bindestrich-getrennt. */
const SLUG_MUSTER = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Mindestlänge, ab der ein Text als „ausgefüllt" gilt (keine Platzhalter). */
const MINDESTLAENGE_TEXT = 40;

/** Was ein Info-Punkt auf der Karte darstellen kann. */
const KARTEN_PUNKT_TYPEN = ['stadt', 'ereignis', 'grenze'];

/** Wofür eine Beschriftung steht — davon hängt ihre Farbe in der App ab. */
const KARTEN_BESCHRIFTUNG_ARTEN = ['land', 'meer'];

function istSlug(wert) {
  return typeof wert === 'string' && SLUG_MUSTER.test(wert);
}

function istText(wert) {
  return typeof wert === 'string' && wert.trim().length > 0;
}

/** Eine echte, endliche Zahl (NaN und Infinity zählen nicht). */
function istZahl(wert) {
  return typeof wert === 'number' && Number.isFinite(wert);
}

/**
 * Prüft eine Karte für „Geschichte in Bewegung".
 *
 * Getrennt von pruefeThema, damit der Test die Karte auch für sich prüfen
 * kann. Gibt wie pruefeThema eine Liste von Meldungen zurück — leer heißt:
 * alles in Ordnung.
 *
 * @param {object} karte
 * @returns {string[]} Fehlermeldungen (leer = fehlerfrei)
 */
function pruefeKarte(karte) {
  const fehler = [];
  const melde = (text) => fehler.push(`karte: ${text}`);

  if (!karte || typeof karte !== 'object' || Array.isArray(karte)) {
    return ['karte ist kein Objekt.'];
  }

  // --- ViewBox -----------------------------------------------------------
  // Ohne gültige Maße lässt sich keine Koordinate einordnen, deshalb zuerst.
  const breiteOk = istZahl(karte.breite) && karte.breite > 0;
  const hoeheOk = istZahl(karte.hoehe) && karte.hoehe > 0;
  if (!breiteOk) melde('breite fehlt oder ist keine positive Zahl.');
  if (!hoeheOk) melde('hoehe fehlt oder ist keine positive Zahl.');

  /**
   * Prüft ein Koordinatenpaar: Zahlen, und innerhalb der ViewBox.
   *
   * Ein Punkt außerhalb wäre auf dem Gerät unsichtbar — das fällt sonst
   * erst auf, wenn jemand vergeblich darauf tippt.
   */
  const pruefeKoordinaten = (wo, x, y) => {
    if (!istZahl(x) || !istZahl(y)) {
      melde(`${wo}: x und y müssen Zahlen sein.`);
      return;
    }
    if (breiteOk && (x < 0 || x > karte.breite)) {
      melde(`${wo}: x (${x}) liegt außerhalb der Karte (0…${karte.breite}).`);
    }
    if (hoeheOk && (y < 0 || y > karte.hoehe)) {
      melde(`${wo}: y (${y}) liegt außerhalb der Karte (0…${karte.hoehe}).`);
    }
  };

  // --- Untergrund --------------------------------------------------------
  if (!Array.isArray(karte.basis) || karte.basis.length === 0) {
    melde('basis fehlt oder ist leer — ohne Untergrund keine erkennbare Karte.');
  } else {
    karte.basis.forEach((teil, i) => {
      const wo = `basis[${i}]`;
      if (!teil || typeof teil !== 'object') {
        melde(`${wo} ist kein Objekt.`);
        return;
      }
      if (!istText(teil.d)) melde(`${wo}.d fehlt oder ist leer.`);
      if (!istText(teil.fill)) melde(`${wo}.fill fehlt — auch „none" muss dastehen.`);
      if (!istText(teil.stroke)) melde(`${wo}.stroke fehlt — auch „none" muss dastehen.`);
      if (!istZahl(teil.strokeWidth) || teil.strokeWidth < 0) {
        melde(`${wo}.strokeWidth fehlt oder ist keine Zahl ≥ 0.`);
      }
    });
  }

  // --- Phasen ------------------------------------------------------------
  // Weniger als zwei Phasen wäre keine Bewegung, sondern ein Standbild.
  if (!Array.isArray(karte.phasen) || karte.phasen.length < 2) {
    melde('phasen fehlen oder sind weniger als 2 — ohne Wechsel keine Bewegung.');
  } else {
    const gesehen = new Set();
    karte.phasen.forEach((phase, i) => {
      const wo = `phasen[${i}]`;
      if (!phase || typeof phase !== 'object') {
        melde(`${wo} ist kein Objekt.`);
        return;
      }
      if (!istSlug(phase.id)) {
        melde(`${wo}.id fehlt oder ist kein ASCII-Slug.`);
      } else if (gesehen.has(phase.id)) {
        melde(`${wo}.id „${phase.id}" kommt doppelt vor.`);
      } else {
        gesehen.add(phase.id);
      }
      if (!istText(phase.label)) melde(`${wo}.label fehlt — der Umschalter braucht eine Beschriftung.`);
      if (phase.hinweis !== undefined && !istText(phase.hinweis)) {
        melde(`${wo}.hinweis ist vorhanden, aber leer.`);
      }
      if (!Array.isArray(phase.flaechen) || phase.flaechen.length === 0) {
        melde(`${wo}.flaechen fehlt oder ist leer — jede Phase zeigt Gebiet.`);
        return;
      }
      phase.flaechen.forEach((flaeche, j) => {
        const woF = `${wo}.flaechen[${j}]`;
        if (!flaeche || typeof flaeche !== 'object') {
          melde(`${woF} ist kein Objekt.`);
          return;
        }
        if (!istText(flaeche.d)) melde(`${woF}.d fehlt oder ist leer.`);
        if (!istText(flaeche.titel)) melde(`${woF}.titel fehlt oder ist leer.`);
      });
    });
  }

  // --- Info-Punkte -------------------------------------------------------
  // Hier lebt das Hintergrundwissen: ein Punkt ohne Text hätte nichts zu
  // erzählen und wäre nur ein Fleck auf der Karte.
  if (!Array.isArray(karte.punkte) || karte.punkte.length === 0) {
    melde('punkte fehlen oder sind leer — die Karte trägt die Texte.');
  } else {
    const gesehen = new Set();
    karte.punkte.forEach((punkt, i) => {
      const wo = `punkte[${i}]`;
      if (!punkt || typeof punkt !== 'object') {
        melde(`${wo} ist kein Objekt.`);
        return;
      }
      if (!istSlug(punkt.id)) {
        melde(`${wo}.id fehlt oder ist kein ASCII-Slug.`);
      } else if (gesehen.has(punkt.id)) {
        melde(`${wo}.id „${punkt.id}" kommt doppelt vor.`);
      } else {
        gesehen.add(punkt.id);
      }
      if (!istText(punkt.name)) melde(`${wo}.name fehlt oder ist leer.`);
      if (!KARTEN_PUNKT_TYPEN.includes(punkt.typ)) {
        melde(`${wo}.typ „${punkt.typ}" ist unbekannt (erlaubt: ${KARTEN_PUNKT_TYPEN.join(', ')}).`);
      }
      pruefeKoordinaten(wo, punkt.x, punkt.y);
      if (!istText(punkt.text)) {
        melde(`${wo}.text fehlt oder ist leer.`);
      } else if (punkt.text.trim().length < MINDESTLAENGE_TEXT) {
        melde(`${wo}.text wirkt wie ein Platzhalter (unter ${MINDESTLAENGE_TEXT} Zeichen).`);
      }
    });
  }

  // --- Bewegungen --------------------------------------------------------
  // Optional: nicht jedes Thema hat Wanderungsrouten. Wenn aber welche da
  // sind, müssen sie vollständig sein.
  if (karte.bewegungen !== undefined) {
    if (!Array.isArray(karte.bewegungen)) {
      melde('bewegungen ist vorhanden, aber keine Liste.');
    } else {
      const gesehen = new Set();
      karte.bewegungen.forEach((bewegung, i) => {
        const wo = `bewegungen[${i}]`;
        if (!bewegung || typeof bewegung !== 'object') {
          melde(`${wo} ist kein Objekt.`);
          return;
        }
        if (!istSlug(bewegung.id)) {
          melde(`${wo}.id fehlt oder ist kein ASCII-Slug.`);
        } else if (gesehen.has(bewegung.id)) {
          melde(`${wo}.id „${bewegung.id}" kommt doppelt vor.`);
        } else {
          gesehen.add(bewegung.id);
        }
        if (!istText(bewegung.name)) melde(`${wo}.name fehlt oder ist leer.`);

        const paar = (feld, wert) => {
          if (!Array.isArray(wert) || wert.length !== 2) {
            melde(`${wo}.${feld} muss ein Paar [x, y] sein.`);
            return false;
          }
          pruefeKoordinaten(`${wo}.${feld}`, wert[0], wert[1]);
          return istZahl(wert[0]) && istZahl(wert[1]);
        };
        const vonOk = paar('von', bewegung.von);
        const nachOk = paar('nach', bewegung.nach);
        // Start gleich Ziel ergäbe einen Pfeil ohne Richtung.
        if (
          vonOk && nachOk &&
          bewegung.von[0] === bewegung.nach[0] &&
          bewegung.von[1] === bewegung.nach[1]
        ) {
          melde(`${wo}: von und nach sind derselbe Punkt — daraus wird kein Pfeil.`);
        }
        if (bewegung.ueber !== undefined) {
          if (!Array.isArray(bewegung.ueber)) {
            melde(`${wo}.ueber ist vorhanden, aber keine Liste.`);
          } else {
            bewegung.ueber.forEach((punkt, j) => {
              if (!Array.isArray(punkt) || punkt.length !== 2) {
                melde(`${wo}.ueber[${j}] muss ein Paar [x, y] sein.`);
                return;
              }
              pruefeKoordinaten(`${wo}.ueber[${j}]`, punkt[0], punkt[1]);
            });
          }
        }
        if (!istText(bewegung.text)) {
          melde(`${wo}.text fehlt oder ist leer.`);
        } else if (bewegung.text.trim().length < MINDESTLAENGE_TEXT) {
          melde(`${wo}.text wirkt wie ein Platzhalter (unter ${MINDESTLAENGE_TEXT} Zeichen).`);
        }
      });
    }
  }

  // --- Beschriftungen ----------------------------------------------------
  if (karte.beschriftungen !== undefined) {
    if (!Array.isArray(karte.beschriftungen)) {
      melde('beschriftungen ist vorhanden, aber keine Liste.');
    } else {
      karte.beschriftungen.forEach((beschriftung, i) => {
        const wo = `beschriftungen[${i}]`;
        if (!beschriftung || typeof beschriftung !== 'object') {
          melde(`${wo} ist kein Objekt.`);
          return;
        }
        if (!istText(beschriftung.text)) melde(`${wo}.text fehlt oder ist leer.`);
        if (!KARTEN_BESCHRIFTUNG_ARTEN.includes(beschriftung.art)) {
          melde(`${wo}.art „${beschriftung.art}" ist unbekannt (erlaubt: ${KARTEN_BESCHRIFTUNG_ARTEN.join(', ')}).`);
        }
        pruefeKoordinaten(wo, beschriftung.x, beschriftung.y);
        if (beschriftung.drehung !== undefined && !istZahl(beschriftung.drehung)) {
          melde(`${wo}.drehung ist vorhanden, aber keine Zahl.`);
        }
      });
    }
  }

  return fehler;
}

/**
 * Prüft ein einzelnes Themen-Modul gegen das Schema.
 *
 * Gibt eine Liste von Fehlermeldungen zurück — leer heißt: alles in Ordnung.
 * Bewusst keine Exception: der Testrahmen sammelt so alle Mängel auf einmal.
 *
 * @param {object} thema
 * @returns {string[]} Fehlermeldungen (leer = fehlerfrei)
 */
function pruefeThema(thema) {
  const fehler = [];

  if (!thema || typeof thema !== 'object' || Array.isArray(thema)) {
    return ['Thema ist kein Objekt.'];
  }

  const name = istSlug(thema.id) ? thema.id : '(ohne gültige id)';
  const melde = (text) => fehler.push(`${name}: ${text}`);

  // --- Kopfdaten ---------------------------------------------------------
  if (!istSlug(thema.id)) {
    melde(`id fehlt oder ist kein ASCII-Slug (erhalten: ${JSON.stringify(thema.id)}).`);
  }
  if (!istText(thema.titel)) melde('titel fehlt oder ist leer.');
  if (!istText(thema.epoche)) melde('epoche fehlt oder ist leer.');

  // --- Aufhänger ---------------------------------------------------------
  const aufhaenger = thema.aufhaenger;
  if (!aufhaenger || typeof aufhaenger !== 'object') {
    melde('aufhaenger fehlt.');
  } else {
    if (!istText(aufhaenger.frage)) melde('aufhaenger.frage fehlt oder ist leer.');
    else if (!aufhaenger.frage.includes('?')) melde('aufhaenger.frage ist keine Frage (kein „?").');
    if (!istText(aufhaenger.text)) melde('aufhaenger.text fehlt oder ist leer.');
  }

  // --- Perspektiven ------------------------------------------------------
  if (!Array.isArray(thema.perspektiven) || thema.perspektiven.length === 0) {
    melde('perspektiven fehlen oder sind leer — jedes Thema braucht mindestens eine Sichtweise.');
  } else {
    const gesehen = new Set();
    thema.perspektiven.forEach((perspektive, i) => {
      const wo = `perspektiven[${i}]`;
      if (!perspektive || typeof perspektive !== 'object') {
        melde(`${wo} ist kein Objekt.`);
        return;
      }
      if (!istSlug(perspektive.id)) {
        melde(`${wo}.id fehlt oder ist kein ASCII-Slug.`);
      } else if (gesehen.has(perspektive.id)) {
        melde(`${wo}.id „${perspektive.id}" kommt doppelt vor.`);
      } else {
        gesehen.add(perspektive.id);
      }
      if (!istText(perspektive.name)) melde(`${wo}.name fehlt oder ist leer.`);
      // Attribution: welche Stimme hat diese Perspektive verfasst.
      if (!istText(perspektive.stimme)) melde(`${wo}.stimme fehlt — jede Perspektive braucht eine Attribution.`);
      if (!istText(perspektive.text)) {
        melde(`${wo}.text fehlt oder ist leer.`);
      } else if (perspektive.text.trim().length < MINDESTLAENGE_TEXT) {
        melde(`${wo}.text wirkt wie ein Platzhalter (unter ${MINDESTLAENGE_TEXT} Zeichen).`);
      }
    });
  }

  // --- Synthese ----------------------------------------------------------
  if (!istText(thema.synthese)) {
    melde('synthese fehlt oder ist leer.');
  } else if (thema.synthese.trim().length < MINDESTLAENGE_TEXT) {
    melde(`synthese wirkt wie ein Platzhalter (unter ${MINDESTLAENGE_TEXT} Zeichen).`);
  }

  // --- Dein Urteil -------------------------------------------------------
  if (!thema.urteil || typeof thema.urteil !== 'object') {
    melde('urteil fehlt.');
  } else if (!istText(thema.urteil.frage)) {
    melde('urteil.frage fehlt oder ist leer.');
  } else if (!thema.urteil.frage.includes('?')) {
    melde('urteil.frage ist keine offene Frage (kein „?").');
  }

  // --- Quiz („Stimmt's?") ------------------------------------------------
  if (!Array.isArray(thema.quiz) || thema.quiz.length < 3) {
    melde('quiz fehlt oder hat weniger als 3 Fragen.');
  } else {
    thema.quiz.forEach((frage, i) => {
      const wo = `quiz[${i}]`;
      if (!frage || typeof frage !== 'object') {
        melde(`${wo} ist kein Objekt.`);
        return;
      }
      if (!istText(frage.frage)) melde(`${wo}.frage fehlt oder ist leer.`);
      if (!Array.isArray(frage.antworten) || frage.antworten.length < 2) {
        melde(`${wo}.antworten braucht mindestens 2 Auswahlmöglichkeiten.`);
      } else if (!frage.antworten.every(istText)) {
        melde(`${wo}.antworten enthält leere Einträge.`);
      }
      if (!Number.isInteger(frage.richtig)) {
        melde(`${wo}.richtig fehlt oder ist keine ganze Zahl.`);
      } else if (
        !Array.isArray(frage.antworten) ||
        frage.richtig < 0 ||
        frage.richtig >= frage.antworten.length
      ) {
        melde(`${wo}.richtig (${frage.richtig}) zeigt auf keine vorhandene Antwort.`);
      }
      if (!istText(frage.erklaerung)) melde(`${wo}.erklaerung fehlt oder ist leer.`);
    });
  }

  // --- „Geschichte in Bewegung" (optional) -------------------------------
  // Fehlt die Karte, ist das kein Mangel — der Abschnitt entfällt dann in
  // der App. Ist sie da, wird sie vollständig geprüft.
  if (thema.karte !== undefined) {
    for (const meldung of pruefeKarte(thema.karte)) melde(meldung);
  }

  return fehler;
}

module.exports = {
  SLUG_MUSTER,
  MINDESTLAENGE_TEXT,
  KARTEN_PUNKT_TYPEN,
  KARTEN_BESCHRIFTUNG_ARTEN,
  istSlug,
  istText,
  istZahl,
  pruefeKarte,
  pruefeThema,
};
