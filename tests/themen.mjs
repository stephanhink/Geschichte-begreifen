// Prüfungen für die Themen-Module in utils/themen/.
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe:
// läuft mit blankem `node`.
//
// Geprüft wird zweierlei:
//   1. Der Prüfer selbst (pruefeThema) — findet er Mängel überhaupt?
//   2. Jedes registrierte Thema — erfüllt es das Schema vollständig?
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { pruefeThema, istSlug } = require('../utils/themen/schema.js');
const {
  alleThemen,
  themaNachId,
  perspektiveNachId,
  themenUebersicht,
} = require('../utils/themen/index.js');

/**
 * @param {(name: string, ok: boolean) => void} pruefe Prüf-Funktion des Rahmens
 */
export function laufe(pruefe) {
  // --- 1. Der Prüfer muss Mängel auch wirklich finden -------------------
  // Ein Schema-Prüfer, der alles durchwinkt, ist wertlos. Deshalb erst
  // absichtlich kaputte Themen durchschicken.
  pruefe('Schema-Prüfer meldet ein leeres Thema', pruefeThema({}).length > 0);
  pruefe('Schema-Prüfer meldet Nicht-Objekte', pruefeThema(null).length > 0);

  const gutesThema = {
    id: 'test-thema',
    titel: 'Testthema',
    epoche: 'Testzeit',
    aufhaenger: { frage: 'Eine Frage?', text: 'Ein Einstiegstext.' },
    perspektiven: [
      {
        id: 'eine-sicht',
        name: 'Eine Sicht',
        stimme: 'Opus',
        text: 'Ein Perspektiventext, der lang genug ist, um kein Platzhalter zu sein.',
      },
    ],
    synthese: 'Eine Synthese, die lang genug ist, um nicht als Platzhalter zu gelten.',
    urteil: { frage: 'Was meinst du?' },
    quiz: [
      { frage: 'A?', antworten: ['ja', 'nein'], richtig: 0, erklaerung: 'weil.' },
      { frage: 'B?', antworten: ['ja', 'nein'], richtig: 1, erklaerung: 'weil.' },
      { frage: 'C?', antworten: ['ja', 'nein'], richtig: 0, erklaerung: 'weil.' },
    ],
  };
  pruefe('Schema-Prüfer lässt ein vollständiges Thema durch', pruefeThema(gutesThema).length === 0);

  // Jeder einzelne Mangel muss auffallen.
  const mitFehler = (aenderung) => {
    const kopie = JSON.parse(JSON.stringify(gutesThema));
    aenderung(kopie);
    return pruefeThema(kopie).length > 0;
  };
  pruefe('Schema-Prüfer meldet fehlende id', mitFehler((t) => { delete t.id; }));
  pruefe('Schema-Prüfer meldet id mit Umlaut', mitFehler((t) => { t.id = 'roemisches-reich-ä'; }));
  pruefe('Schema-Prüfer meldet leere perspektiven', mitFehler((t) => { t.perspektiven = []; }));
  pruefe('Schema-Prüfer meldet fehlende stimme', mitFehler((t) => { delete t.perspektiven[0].stimme; }));
  pruefe('Schema-Prüfer meldet doppelte Perspektiven-id', mitFehler((t) => {
    t.perspektiven.push({ ...t.perspektiven[0] });
  }));
  pruefe('Schema-Prüfer meldet fehlende synthese', mitFehler((t) => { delete t.synthese; }));
  pruefe('Schema-Prüfer meldet fehlende Urteilsfrage', mitFehler((t) => { delete t.urteil; }));
  pruefe('Schema-Prüfer meldet zu kurzes Quiz', mitFehler((t) => { t.quiz = t.quiz.slice(0, 2); }));
  pruefe('Schema-Prüfer meldet Antwort-Index außerhalb des Bereichs', mitFehler((t) => { t.quiz[0].richtig = 7; }));
  pruefe('Schema-Prüfer meldet negativen Antwort-Index', mitFehler((t) => { t.quiz[0].richtig = -1; }));
  pruefe('Schema-Prüfer meldet fehlenden Antwort-Index', mitFehler((t) => { delete t.quiz[0].richtig; }));
  pruefe('Schema-Prüfer meldet fehlende Erklärung', mitFehler((t) => { delete t.quiz[0].erklaerung; }));

  // --- 2. Die Registrierung ---------------------------------------------
  pruefe('utils/themen/index.js registriert mindestens ein Thema', Array.isArray(alleThemen) && alleThemen.length > 0);

  const idsGesehen = new Set();
  for (const thema of alleThemen) {
    if (istSlug(thema && thema.id)) {
      pruefe(`Thema-id „${thema.id}" ist eindeutig`, !idsGesehen.has(thema.id));
      idsGesehen.add(thema.id);
    }
  }

  // --- 3. Jedes registrierte Thema erfüllt das Schema --------------------
  for (const thema of alleThemen) {
    const fehler = pruefeThema(thema);
    if (fehler.length > 0) {
      for (const meldung of fehler) pruefe(`Schema: ${meldung}`, false);
    } else {
      pruefe(`Thema „${thema.id}" erfüllt das Schema`, true);
    }
  }

  // --- 4. Zugriffsfunktionen --------------------------------------------
  pruefe('themaNachId findet „roemisches-reich"', themaNachId('roemisches-reich') !== undefined);
  pruefe('themaNachId gibt bei unbekannter id undefined', themaNachId('gibt-es-nicht') === undefined);
  pruefe(
    'perspektiveNachId findet die europäische Sichtweise',
    (perspektiveNachId('roemisches-reich', 'europaeisch') || {}).stimme === 'Opus',
  );
  pruefe(
    'perspektiveNachId gibt bei unbekanntem Thema undefined',
    perspektiveNachId('gibt-es-nicht', 'europaeisch') === undefined,
  );

  const uebersicht = themenUebersicht();
  pruefe('themenUebersicht liefert einen Eintrag je Thema', uebersicht.length === alleThemen.length);
  pruefe(
    'themenUebersicht enthält Titel und Aufhänger-Frage',
    uebersicht.every((e) => e.titel.length > 0 && e.frage.includes('?')),
  );

  // --- 5. Multiperspektivität: das Modul „Römisches Reich" ---------------
  // Das Thema aus Runde 1 hat vorerst nur die westliche Sicht (Stimme:
  // Opus). Sobald Hermes die chinesische Sichtweise ergänzt, deckt der Test
  // oben sie automatisch mit ab.
  const rom = themaNachId('roemisches-reich');
  pruefe('„Römisches Reich" hat eine Perspektive mit Stimme „Opus"',
    rom.perspektiven.some((p) => p.stimme === 'Opus'));
  pruefe('„Römisches Reich" hat 3 bis 5 Quizfragen',
    rom.quiz.length >= 3 && rom.quiz.length <= 5);
  pruefe('„Römisches Reich": jede Quizfrage hat eine gültige richtige Antwort',
    rom.quiz.every((f) => typeof f.antworten[f.richtig] === 'string'));
}
