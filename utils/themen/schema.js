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
//   }
//
// Weitere Felder (z. B. Zeitleisten oder Karten für „Geschichte in Bewegung")
// dürfen später ergänzt werden — die Prüfung unten stört sich nicht daran.

/** Erlaubte Form eines Slugs: ASCII, klein, Bindestrich-getrennt. */
const SLUG_MUSTER = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Mindestlänge, ab der ein Text als „ausgefüllt" gilt (keine Platzhalter). */
const MINDESTLAENGE_TEXT = 40;

function istSlug(wert) {
  return typeof wert === 'string' && SLUG_MUSTER.test(wert);
}

function istText(wert) {
  return typeof wert === 'string' && wert.trim().length > 0;
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

  return fehler;
}

module.exports = {
  SLUG_MUSTER,
  MINDESTLAENGE_TEXT,
  istSlug,
  istText,
  pruefeThema,
};
