// Auswertung für „Stimmt's?" — die lockeren Quizfragen eines Themas.
//
// Kein Zeitdruck, keine Noten (CLAUDE.md): Diese Datei zählt deshalb keine
// Punkte und kennt kein „bestanden". Sie beantwortet nur die Fragen, die die
// UI stellt: Ist die angetippte Antwort die richtige? Welche wäre es gewesen?
// Welche Frage ist als Nächstes dran? Sind alle erkundet?
//
// Reine Fachlogik — keine UI-Importe, mit blankem `node` prüfbar
// (Architektur-Regel). CommonJS wie die Themen-Module.
//
// Die gegebenen Antworten werden als schlichtes Objekt gehalten, damit sie
// sich unverändert als JSON speichern lassen (siehe utils/fortschritt.js):
//
//   { '0': 1, '1': 2 }   // Frage 0 → Antwort 1 angetippt, Frage 1 → Antwort 2

/**
 * Prüft eine angetippte Antwort gegen die Quizfrage.
 *
 * Gibt immer ein vollständiges Ergebnis zurück — auch bei Unsinn-Eingaben,
 * damit die UI keine Sonderfälle behandeln muss.
 *
 * @param {object} frage Quizfrage nach dem Schema (antworten, richtig, erklaerung)
 * @param {number} gewaehlt Index der angetippten Antwort
 * @returns {{gueltig: boolean, richtig: boolean, gewaehlt: number,
 *            richtigerIndex: number, richtigeAntwort: string,
 *            erklaerung: string}}
 */
function pruefeAntwort(frage, gewaehlt) {
  const antworten = frage && Array.isArray(frage.antworten) ? frage.antworten : [];
  const richtigerIndex = frage && Number.isInteger(frage.richtig) ? frage.richtig : -1;
  const gueltig =
    Number.isInteger(gewaehlt) && gewaehlt >= 0 && gewaehlt < antworten.length;

  return {
    gueltig,
    richtig: gueltig && gewaehlt === richtigerIndex,
    gewaehlt,
    richtigerIndex,
    richtigeAntwort: antworten[richtigerIndex] || '',
    erklaerung: (frage && frage.erklaerung) || '',
  };
}

/**
 * Wurde diese Frage schon beantwortet?
 *
 * @param {object} antworten gegebene Antworten (Index → gewählter Index)
 * @param {number} index Nummer der Frage
 * @returns {boolean}
 */
function istBeantwortet(antworten, index) {
  if (!antworten || typeof antworten !== 'object') return false;
  return Number.isInteger(antworten[index]) || Number.isInteger(antworten[String(index)]);
}

/**
 * Die zu einer Frage gegebene Antwort — oder null, wenn noch keine da ist.
 *
 * @param {object} antworten
 * @param {number} index
 * @returns {number|null}
 */
function gegebeneAntwort(antworten, index) {
  if (!antworten || typeof antworten !== 'object') return null;
  const wert = Number.isInteger(antworten[index]) ? antworten[index] : antworten[String(index)];
  return Number.isInteger(wert) ? wert : null;
}

/**
 * Zählt, wie viele Fragen eines Quiz schon erkundet wurden.
 *
 * @param {Array<object>} quiz
 * @param {object} antworten
 * @returns {number}
 */
function anzahlBeantwortet(quiz, antworten) {
  if (!Array.isArray(quiz)) return 0;
  return quiz.reduce((summe, _frage, index) => summe + (istBeantwortet(antworten, index) ? 1 : 0), 0);
}

/**
 * Zählt die richtig beantworteten Fragen.
 *
 * Nur für einen freundlichen Abschlusssatz gedacht — keine Note.
 *
 * @param {Array<object>} quiz
 * @param {object} antworten
 * @returns {number}
 */
function anzahlRichtig(quiz, antworten) {
  if (!Array.isArray(quiz)) return 0;
  return quiz.reduce((summe, frage, index) => {
    const gegeben = gegebeneAntwort(antworten, index);
    if (gegeben === null) return summe;
    return summe + (pruefeAntwort(frage, gegeben).richtig ? 1 : 0);
  }, 0);
}

/**
 * Sind alle Fragen erkundet?
 *
 * Ein leeres Quiz gilt nicht als vollständig — sonst wäre ein Thema ohne
 * Quiz sofort „durchgearbeitet".
 *
 * @param {Array<object>} quiz
 * @param {object} antworten
 * @returns {boolean}
 */
function alleErkundet(quiz, antworten) {
  if (!Array.isArray(quiz) || quiz.length === 0) return false;
  return anzahlBeantwortet(quiz, antworten) >= quiz.length;
}

/**
 * Index der ersten noch offenen Frage — der Einstiegspunkt beim Öffnen.
 *
 * Ist alles beantwortet, kommt 0 zurück (die UI zeigt dann den Abschluss).
 *
 * @param {Array<object>} quiz
 * @param {object} antworten
 * @returns {number}
 */
function ersteOffeneFrage(quiz, antworten) {
  if (!Array.isArray(quiz)) return 0;
  const index = quiz.findIndex((_frage, i) => !istBeantwortet(antworten, i));
  return index === -1 ? 0 : index;
}

/**
 * Ein freundlicher Abschlusssatz — nie tadelnd, nie benotend.
 *
 * @param {Array<object>} quiz
 * @param {object} antworten
 * @returns {string}
 */
function abschlusstext(quiz, antworten) {
  const gesamt = Array.isArray(quiz) ? quiz.length : 0;
  const richtig = anzahlRichtig(quiz, antworten);

  if (gesamt === 0) return 'Zu diesem Thema gibt es keine Fragen — nur deine eigenen.';
  if (richtig === gesamt) {
    return 'Du hast alle Fragen erkundet — und jede auf Anhieb getroffen. Stark!';
  }
  if (richtig === 0) {
    return 'Du hast alle Fragen erkundet. Die Erklärungen sind hier das Spannende — mit denen bist du jetzt schlauer als vorher.';
  }
  return `Du hast alle Fragen erkundet — ${richtig} von ${gesamt} auf Anhieb getroffen. Der Rest steckt in den Erklärungen.`;
}

module.exports = {
  pruefeAntwort,
  istBeantwortet,
  gegebeneAntwort,
  anzahlBeantwortet,
  anzahlRichtig,
  alleErkundet,
  ersteOffeneFrage,
  abschlusstext,
};
