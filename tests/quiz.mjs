// Prüfungen für utils/quiz.js — die Auswertung von „Stimmt's?".
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe:
// läuft mit blankem `node`.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  pruefeAntwort,
  istBeantwortet,
  gegebeneAntwort,
  anzahlBeantwortet,
  anzahlRichtig,
  alleErkundet,
  ersteOffeneFrage,
  abschlusstext,
} = require('../utils/quiz.js');
const { alleThemen, themaNachId } = require('../utils/themen/index.js');

/**
 * @param {(name: string, ok: boolean) => void} pruefe Prüf-Funktion des Rahmens
 */
export function laufe(pruefe) {
  const quiz = [
    { frage: 'A?', antworten: ['falsch', 'richtig'], richtig: 1, erklaerung: 'weil A.' },
    { frage: 'B?', antworten: ['richtig', 'falsch'], richtig: 0, erklaerung: 'weil B.' },
    { frage: 'C?', antworten: ['falsch', 'falsch', 'richtig'], richtig: 2, erklaerung: 'weil C.' },
  ];

  // --- Einzelne Antwort prüfen -------------------------------------------
  const treffer = pruefeAntwort(quiz[0], 1);
  pruefe('Quiz: richtige Antwort wird als richtig erkannt', treffer.richtig === true);
  pruefe('Quiz: Ergebnis nennt die Erklärung', treffer.erklaerung === 'weil A.');

  const daneben = pruefeAntwort(quiz[0], 0);
  pruefe('Quiz: falsche Antwort wird als falsch erkannt', daneben.richtig === false);
  pruefe('Quiz: bei falscher Antwort steht die richtige im Ergebnis', daneben.richtigeAntwort === 'richtig');
  pruefe('Quiz: bei falscher Antwort kommt trotzdem die Erklärung', daneben.erklaerung === 'weil A.');

  // Unsinn-Eingaben dürfen die App nicht zum Absturz bringen.
  pruefe('Quiz: Index außerhalb des Bereichs gilt als ungültig', pruefeAntwort(quiz[0], 9).gueltig === false);
  pruefe('Quiz: negativer Index gilt als ungültig', pruefeAntwort(quiz[0], -1).gueltig === false);
  pruefe('Quiz: ungültige Antwort gilt nie als richtig', pruefeAntwort(quiz[0], 9).richtig === false);
  pruefe('Quiz: fehlende Frage ergibt ein leeres Ergebnis', pruefeAntwort(undefined, 0).gueltig === false);

  // --- Gegebene Antworten ------------------------------------------------
  // Gespeichert wird als JSON-Objekt, die Schlüssel sind darum Zeichenketten.
  const antworten = { 0: 1, 1: 1 };
  pruefe('Quiz: beantwortete Frage wird erkannt', istBeantwortet(antworten, 0) === true);
  pruefe('Quiz: offene Frage wird erkannt', istBeantwortet(antworten, 2) === false);
  pruefe('Quiz: Zeichenketten-Schlüssel aus JSON werden erkannt', istBeantwortet({ '2': 0 }, 2) === true);
  pruefe('Quiz: fehlende Antwortsammlung ist unproblematisch', istBeantwortet(undefined, 0) === false);
  pruefe('Quiz: gegebeneAntwort liefert den Index', gegebeneAntwort(antworten, 1) === 1);
  pruefe('Quiz: gegebeneAntwort liefert null, wenn nichts da ist', gegebeneAntwort(antworten, 2) === null);
  pruefe('Quiz: gegebene Antwort 0 gilt nicht als „nichts"', gegebeneAntwort({ 0: 0 }, 0) === 0);

  // --- Zählen ------------------------------------------------------------
  pruefe('Quiz: zwei von drei Fragen sind beantwortet', anzahlBeantwortet(quiz, antworten) === 2);
  pruefe('Quiz: davon war eine richtig', anzahlRichtig(quiz, antworten) === 1);
  pruefe('Quiz: ohne Antworten ist nichts beantwortet', anzahlBeantwortet(quiz, {}) === 0);
  pruefe('Quiz: ohne Antworten ist nichts richtig', anzahlRichtig(quiz, {}) === 0);

  // --- Vollständigkeit und Einstieg --------------------------------------
  pruefe('Quiz: teilweise beantwortet gilt nicht als erkundet', alleErkundet(quiz, antworten) === false);
  pruefe('Quiz: alle beantwortet gilt als erkundet', alleErkundet(quiz, { 0: 1, 1: 0, 2: 2 }) === true);
  pruefe('Quiz: auch falsche Antworten zählen als erkundet', alleErkundet(quiz, { 0: 0, 1: 1, 2: 0 }) === true);
  pruefe('Quiz: leeres Quiz gilt nicht als erkundet', alleErkundet([], {}) === false);
  pruefe('Quiz: fehlendes Quiz gilt nicht als erkundet', alleErkundet(undefined, {}) === false);

  pruefe('Quiz: Einstieg ist die erste offene Frage', ersteOffeneFrage(quiz, antworten) === 2);
  pruefe('Quiz: ohne Antworten beginnt es bei Frage 0', ersteOffeneFrage(quiz, {}) === 0);
  pruefe('Quiz: Lücke in der Mitte wird gefunden', ersteOffeneFrage(quiz, { 0: 1, 2: 2 }) === 1);
  pruefe('Quiz: ist alles beantwortet, kommt 0 zurück', ersteOffeneFrage(quiz, { 0: 1, 1: 0, 2: 2 }) === 0);

  // --- Abschluss ---------------------------------------------------------
  // Kein Zeitdruck, keine Noten: Der Abschluss lobt oder tadelt nicht.
  const alleRichtig = abschlusstext(quiz, { 0: 1, 1: 0, 2: 2 });
  const keineRichtig = abschlusstext(quiz, { 0: 0, 1: 1, 2: 0 });
  const gemischt = abschlusstext(quiz, { 0: 1, 1: 1, 2: 2 });
  pruefe('Abschluss: bei allen richtig freundlich', alleRichtig.length > 0 && alleRichtig.includes('erkundet'));
  pruefe('Abschluss: bei keiner richtig ohne Tadel', keineRichtig.includes('erkundet') && !/falsch|leider|schade/i.test(keineRichtig));
  pruefe('Abschluss: gemischt nennt die Zahl der Treffer', gemischt.includes('2 von 3'));
  pruefe('Abschluss: keine Note und kein Prozentwert', [alleRichtig, keineRichtig, gemischt].every((t) => !/%|Note|Punkte/.test(t)));

  // --- Die echten Quizfragen ---------------------------------------------
  // Für jede Frage jedes registrierten Themas muss genau eine Antwort als
  // richtig gelten — sonst stimmt entweder das Modul oder die Auswertung nicht.
  for (const thema of alleThemen) {
    const alleTreffen = thema.quiz.every((frage) =>
      frage.antworten.every((_antwort, i) => pruefeAntwort(frage, i).richtig === (i === frage.richtig)),
    );
    pruefe(`Quiz in „${thema.id}": genau eine Antwort je Frage ist richtig`, alleTreffen);
  }

  const rom = themaNachId('roemisches-reich');
  const romAlle = {};
  rom.quiz.forEach((frage, i) => {
    romAlle[i] = frage.richtig;
  });
  pruefe('Quiz „Römisches Reich": alle richtig beantwortet gilt als erkundet', alleErkundet(rom.quiz, romAlle) === true);
  pruefe('Quiz „Römisches Reich": alle richtig ergibt volle Trefferzahl', anzahlRichtig(rom.quiz, romAlle) === rom.quiz.length);
}
