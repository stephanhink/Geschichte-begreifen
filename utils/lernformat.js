// Das Lernformat als Daten: welche Abschnitte ein Kapitel hat und in welcher
// Reihenfolge sie durchblättert werden.
//
// Die Reihenfolge stammt aus CLAUDE.md („Lernformat"): Aufhänger →
// Geschichte in Bewegung → Blickwinkel → Synthese → Dein Urteil →
// „Stimmt's?". Sie steht hier und nicht in der UI, damit sie ohne React
// prüfbar bleibt (Architektur-Regel) und der Betreiber sie an einer Stelle
// nachlesen kann.
//
// „Geschichte in Bewegung" ist seit Runde 3 gebaut, aber optional: Der
// Abschnitt erscheint nur bei Themen, die eine `karte` mitbringen. Themen
// ohne Karte überspringen ihn — die übrigen Abschnitte rücken auf.

/** Alle Abschnitte des Lernformats in ihrer festen Reihenfolge. */
const ABSCHNITTE = [
  {
    id: 'aufhaenger',
    name: 'Aufhänger',
    kurz: 'Frage',
    // Ein Abschnitt erscheint nur, wenn das Thema Inhalt dafür mitbringt.
    hatInhalt: (thema) => Boolean(thema && thema.aufhaenger && thema.aufhaenger.frage),
  },
  {
    id: 'karte',
    name: 'Geschichte in Bewegung',
    kurz: 'Karte',
    // Eine Karte ohne mindestens zwei Phasen hätte nichts zu bewegen.
    hatInhalt: (thema) =>
      Boolean(
        thema &&
          thema.karte &&
          Array.isArray(thema.karte.phasen) &&
          thema.karte.phasen.length >= 2,
      ),
  },
  {
    id: 'perspektiven',
    name: 'Blickwinkel',
    kurz: 'Sichten',
    hatInhalt: (thema) => Boolean(thema && Array.isArray(thema.perspektiven) && thema.perspektiven.length > 0),
  },
  {
    id: 'synthese',
    name: 'Synthese',
    kurz: 'Synthese',
    hatInhalt: (thema) => Boolean(thema && typeof thema.synthese === 'string' && thema.synthese.trim().length > 0),
  },
  {
    id: 'urteil',
    name: 'Dein Urteil',
    kurz: 'Urteil',
    hatInhalt: (thema) => Boolean(thema && thema.urteil && thema.urteil.frage),
  },
  {
    id: 'quiz',
    name: 'Stimmt’s?',
    kurz: 'Quiz',
    hatInhalt: (thema) => Boolean(thema && Array.isArray(thema.quiz) && thema.quiz.length > 0),
  },
];

/**
 * Die Abschnitte, die für ein konkretes Thema tatsächlich Inhalt haben.
 *
 * @param {object} thema
 * @returns {Array<{id: string, name: string, kurz: string}>}
 */
function abschnitteFuer(thema) {
  return ABSCHNITTE.filter((abschnitt) => abschnitt.hatInhalt(thema)).map(({ id, name, kurz }) => ({
    id,
    name,
    kurz,
  }));
}

/**
 * Begrenzt einen Schritt-Index auf den gültigen Bereich.
 *
 * Damit braucht die UI beim Blättern keine Sonderfälle: „vor" am Ende und
 * „zurück" am Anfang bleiben einfach stehen.
 *
 * @param {number} index
 * @param {number} anzahl
 * @returns {number}
 */
function begrenze(index, anzahl) {
  if (!Number.isInteger(index) || anzahl <= 0) return 0;
  if (index < 0) return 0;
  if (index >= anzahl) return anzahl - 1;
  return index;
}

module.exports = {
  ABSCHNITTE,
  abschnitteFuer,
  begrenze,
};
