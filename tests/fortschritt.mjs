// Prüfungen für utils/fortschritt.js — Lernfortschritt und „Dein Urteil".
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe
// und kein async-storage: Der Speicher wird hier durch ein Fake ersetzt —
// genau dafür nimmt erstelleFortschritt() ihn als Argument entgegen.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  SCHLUESSEL_PRAEFIX,
  schluessel,
  leererStand,
  normalisiereStand,
  hatUrteil,
  istErforscht,
  stufe,
  stufenText,
  erstelleFortschritt,
} = require('../utils/fortschritt.js');
const { themaNachId } = require('../utils/themen/index.js');

/**
 * Ein Speicher-Fake mit derselben Schnittstelle wie AsyncStorage.
 *
 * `kaputt` lässt jeden Zugriff scheitern — damit lässt sich prüfen, dass ein
 * defekter Gerätespeicher die App nicht mit in den Abgrund reißt.
 */
function fakeSpeicher(start = {}, kaputt = false) {
  const inhalt = new Map(Object.entries(start));
  return {
    inhalt,
    async getItem(k) {
      if (kaputt) throw new Error('Speicher nicht lesbar');
      return inhalt.has(k) ? inhalt.get(k) : null;
    },
    async setItem(k, v) {
      if (kaputt) throw new Error('Speicher nicht beschreibbar');
      inhalt.set(k, v);
    },
    async removeItem(k) {
      if (kaputt) throw new Error('Speicher nicht löschbar');
      inhalt.delete(k);
    },
  };
}

/**
 * @param {(name: string, ok: boolean) => void} pruefe Prüf-Funktion des Rahmens
 * @returns {Promise<void>} die asynchronen Prüfungen (tests/alle.mjs wartet darauf)
 */
export async function laufe(pruefe) {
  const quiz = [
    { frage: 'A?', antworten: ['a', 'b'], richtig: 0, erklaerung: '.' },
    { frage: 'B?', antworten: ['a', 'b'], richtig: 1, erklaerung: '.' },
  ];

  // --- Schlüssel ---------------------------------------------------------
  pruefe('Fortschritt: Schlüssel trägt den Namensraum', schluessel('rom').startsWith(SCHLUESSEL_PRAEFIX));
  pruefe('Fortschritt: Schlüssel enthält die Thema-id', schluessel('rom').endsWith('rom'));
  pruefe('Fortschritt: verschiedene Themen, verschiedene Schlüssel', schluessel('a') !== schluessel('b'));

  // --- Leerer Stand ------------------------------------------------------
  const leer = leererStand();
  pruefe('Fortschritt: leerer Stand ist unbesucht', leer.besucht === false);
  pruefe('Fortschritt: leerer Stand hat kein Urteil', leer.urteil === '');
  pruefe('Fortschritt: leerer Stand hat keine Quizantworten', Object.keys(leer.quizAntworten).length === 0);
  pruefe('Fortschritt: leererStand liefert jedes Mal ein frisches Objekt', leererStand() !== leererStand());

  // --- Normalisieren (ein kaputter Eintrag darf nie stören) --------------
  pruefe('Fortschritt: null wird zum leeren Stand', normalisiereStand(null).urteil === '');
  pruefe('Fortschritt: Zeichenkette wird zum leeren Stand', normalisiereStand('kaputt').besucht === false);
  pruefe('Fortschritt: Array wird zum leeren Stand', normalisiereStand([1, 2]).besucht === false);
  pruefe('Fortschritt: Urteil als Zahl wird verworfen', normalisiereStand({ urteil: 42 }).urteil === '');
  pruefe(
    'Fortschritt: unsinnige Quizantworten werden verworfen',
    Object.keys(normalisiereStand({ quizAntworten: { a: 1, 0: 'x', 1: -3 } }).quizAntworten).length === 0,
  );
  pruefe(
    'Fortschritt: gültige Quizantworten bleiben erhalten',
    normalisiereStand({ quizAntworten: { 0: 1 } }).quizAntworten['0'] === 1,
  );
  pruefe(
    'Fortschritt: wer ein Urteil hat, gilt als besucht',
    normalisiereStand({ urteil: 'Meine Sicht.' }).besucht === true,
  );
  pruefe(
    'Fortschritt: wer eine Quizfrage beantwortet hat, gilt als besucht',
    normalisiereStand({ quizAntworten: { 0: 0 } }).besucht === true,
  );

  // --- Urteil und Stufen -------------------------------------------------
  pruefe('Fortschritt: leeres Urteil zählt nicht', hatUrteil({ urteil: '   ' }) === false);
  pruefe('Fortschritt: geschriebenes Urteil zählt', hatUrteil({ urteil: 'Ich finde …' }) === true);
  pruefe('Fortschritt: fehlender Stand hat kein Urteil', hatUrteil(undefined) === false);

  const unberuehrt = leererStand();
  const angefangen = { ...leererStand(), besucht: true };
  const mitUrteil = { ...leererStand(), besucht: true, urteil: 'Ich finde, Rom war beides.' };
  const quizFertig = { ...leererStand(), besucht: true, quizAntworten: { 0: 0, 1: 1 } };
  const quizHalb = { ...leererStand(), besucht: true, quizAntworten: { 0: 0 } };

  pruefe('Fortschritt: unberührtes Thema ist „neu"', stufe(unberuehrt, quiz) === 'neu');
  pruefe('Fortschritt: geöffnetes Thema ist „entdeckt"', stufe(angefangen, quiz) === 'entdeckt');
  pruefe('Fortschritt: halbes Quiz bleibt „entdeckt"', stufe(quizHalb, quiz) === 'entdeckt');
  pruefe('Fortschritt: geschriebenes Urteil macht „erforscht"', stufe(mitUrteil, quiz) === 'erforscht');
  pruefe('Fortschritt: vollständiges Quiz macht „erforscht"', stufe(quizFertig, quiz) === 'erforscht');
  pruefe('Fortschritt: istErforscht stimmt mit der Stufe überein', istErforscht(mitUrteil, quiz) === true);
  pruefe('Fortschritt: istErforscht bei halbem Stand false', istErforscht(quizHalb, quiz) === false);
  pruefe('Fortschritt: Stufen haben eine Beschriftung', stufenText('erforscht') === 'Erforscht');
  pruefe('Fortschritt: unbekannte Stufe fällt auf „neu" zurück', stufenText('gibt-es-nicht') === stufenText('neu'));

  // --- Laden und Speichern über den Fake-Speicher ------------------------
  const speicher = fakeSpeicher();
  const fortschritt = erstelleFortschritt(speicher);

  const frisch = await fortschritt.lade('roemisches-reich');
  pruefe('Speicher: unbekanntes Thema ergibt einen leeren Stand', frisch.urteil === '' && frisch.besucht === false);

  await fortschritt.speichere('roemisches-reich', { besucht: true, urteil: 'Mehr Gewinn, aber nicht für alle.' });
  const geladen = await fortschritt.lade('roemisches-reich');
  pruefe('Speicher: gespeichertes Urteil kommt zurück', geladen.urteil === 'Mehr Gewinn, aber nicht für alle.');
  pruefe('Speicher: gespeicherter Stand ist besucht', geladen.besucht === true);
  pruefe(
    'Speicher: es landet genau ein Eintrag unter dem erwarteten Schlüssel',
    speicher.inhalt.size === 1 && speicher.inhalt.has(schluessel('roemisches-reich')),
  );
  pruefe(
    'Speicher: gespeichert wird lesbares JSON',
    JSON.parse(speicher.inhalt.get(schluessel('roemisches-reich'))).urteil.length > 0,
  );

  // Teiländerungen dürfen den Rest nicht wegwerfen.
  await fortschritt.aktualisiere('roemisches-reich', { quizAntworten: { 0: 1 } });
  const ergaenzt = await fortschritt.lade('roemisches-reich');
  pruefe('Speicher: aktualisiere behält das Urteil', ergaenzt.urteil === 'Mehr Gewinn, aber nicht für alle.');
  pruefe('Speicher: aktualisiere schreibt die Quizantwort', ergaenzt.quizAntworten['0'] === 1);

  // Themen dürfen sich nicht gegenseitig überschreiben.
  await fortschritt.speichere('mittelalter', { besucht: true });
  const staende = await fortschritt.ladeAlle(['roemisches-reich', 'mittelalter', 'gibt-es-nicht']);
  pruefe('Speicher: ladeAlle liefert einen Eintrag je angefragtem Thema', Object.keys(staende).length === 3);
  pruefe('Speicher: ladeAlle trennt die Themen sauber', staende['mittelalter'].urteil === '');
  pruefe('Speicher: ladeAlle liefert für Unbekanntes einen leeren Stand', staende['gibt-es-nicht'].besucht === false);
  pruefe('Speicher: ladeAlle ohne Argumente ergibt ein leeres Ergebnis', Object.keys(await fortschritt.ladeAlle()).length === 0);

  await fortschritt.vergiss('roemisches-reich');
  pruefe('Speicher: vergiss löscht den Stand', (await fortschritt.lade('roemisches-reich')).urteil === '');
  pruefe('Speicher: vergiss lässt andere Themen in Ruhe', speicher.inhalt.has(schluessel('mittelalter')));

  // --- Robustheit --------------------------------------------------------
  const mitMuell = erstelleFortschritt(fakeSpeicher({ [schluessel('rom')]: '{kein json' }));
  pruefe('Speicher: unlesbarer Eintrag ergibt einen leeren Stand', (await mitMuell.lade('rom')).urteil === '');

  const defekt = erstelleFortschritt(fakeSpeicher({}, true));
  pruefe('Speicher: defektes Lesen wirft nicht', (await defekt.lade('rom')).besucht === false);
  pruefe('Speicher: defektes Schreiben wirft nicht', (await defekt.speichere('rom', { urteil: 'x' })).urteil === 'x');
  pruefe('Speicher: defektes Löschen wirft nicht', (await defekt.vergiss('rom')).urteil === '');

  let ohneSpeicherGemeckert = false;
  try {
    erstelleFortschritt(null);
  } catch (fehler) {
    ohneSpeicherGemeckert = true;
  }
  pruefe('Speicher: erstelleFortschritt verlangt einen Speicher', ohneSpeicherGemeckert);

  // --- Zusammenspiel mit einem echten Thema ------------------------------
  const rom = themaNachId('roemisches-reich');
  const romFertig = { besucht: true, urteil: '', quizAntworten: {} };
  rom.quiz.forEach((frage, i) => {
    romFertig.quizAntworten[i] = frage.richtig;
  });
  pruefe('Fortschritt: „Römisches Reich" gilt nach dem ganzen Quiz als erforscht', stufe(romFertig, rom.quiz) === 'erforscht');
  pruefe(
    'Fortschritt: „Römisches Reich" gilt allein durch das Urteil als erforscht',
    stufe({ besucht: true, urteil: 'Kommt darauf an, wen man fragt.', quizAntworten: {} }, rom.quiz) === 'erforscht',
  );
}
