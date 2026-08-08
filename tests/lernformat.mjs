// Prüfungen für utils/lernformat.js — die Abschnitte eines Kapitels.
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe:
// läuft mit blankem `node`.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { ABSCHNITTE, abschnitteFuer, begrenze } = require('../utils/lernformat.js');
const { alleThemen, themaNachId } = require('../utils/themen/index.js');

/**
 * @param {(name: string, ok: boolean) => void} pruefe Prüf-Funktion des Rahmens
 */
export function laufe(pruefe) {
  // --- Die Reihenfolge aus CLAUDE.md -------------------------------------
  const erwartet = ['aufhaenger', 'karte', 'perspektiven', 'synthese', 'urteil', 'quiz'];
  pruefe(
    'Lernformat: Abschnitte stehen in der Reihenfolge aus CLAUDE.md',
    ABSCHNITTE.map((a) => a.id).join(',') === erwartet.join(','),
  );
  pruefe('Lernformat: jeder Abschnitt hat einen Anzeigenamen', ABSCHNITTE.every((a) => a.name.length > 0));
  pruefe('Lernformat: jeder Abschnitt hat eine Kurzform für die Schrittleiste', ABSCHNITTE.every((a) => a.kurz.length > 0));

  // --- Abschnitte eines konkreten Themas ---------------------------------
  const rom = themaNachId('roemisches-reich');
  const romAbschnitte = abschnitteFuer(rom);
  pruefe('Lernformat: „Römisches Reich" hat alle sechs Abschnitte', romAbschnitte.length === 6);
  pruefe(
    'Lernformat: die zurückgegebenen Abschnitte tragen keine Prüffunktion mit',
    romAbschnitte.every((a) => typeof a.hatInhalt === 'undefined'),
  );

  // Ein Thema ohne Inhalt darf keine leeren Abschnitte erzeugen.
  pruefe('Lernformat: ein leeres Thema hat keine Abschnitte', abschnitteFuer({}).length === 0);
  pruefe('Lernformat: fehlendes Thema hat keine Abschnitte', abschnitteFuer(undefined).length === 0);
  pruefe(
    'Lernformat: ein Thema ohne Quiz zeigt keinen Quiz-Abschnitt',
    !abschnitteFuer({ ...rom, quiz: [] }).some((a) => a.id === 'quiz'),
  );
  pruefe(
    'Lernformat: ein Thema ohne Synthese zeigt keinen Synthese-Abschnitt',
    !abschnitteFuer({ ...rom, synthese: '  ' }).some((a) => a.id === 'synthese'),
  );

  // Jedes registrierte Thema muss die volle Strecke anbieten — sonst fehlt
  // Inhalt, den das Lernformat vorsieht. „Geschichte in Bewegung" ist dabei
  // die eine Ausnahme: eine Karte darf ein Thema (noch) nicht haben.
  const PFLICHT = ABSCHNITTE.filter((a) => a.id !== 'karte').map((a) => a.id);
  for (const thema of alleThemen) {
    const habe = abschnitteFuer(thema).map((a) => a.id);
    pruefe(
      `Lernformat: „${thema.id}" bietet alle Pflicht-Abschnitte`,
      PFLICHT.every((id) => habe.includes(id)),
    );
  }

  // --- Blättern ----------------------------------------------------------
  pruefe('Lernformat: Blättern über das Ende hinaus bleibt am Ende stehen', begrenze(9, 5) === 4);
  pruefe('Lernformat: Blättern vor den Anfang bleibt am Anfang stehen', begrenze(-3, 5) === 0);
  pruefe('Lernformat: gültiger Schritt bleibt unverändert', begrenze(2, 5) === 2);
  pruefe('Lernformat: ohne Abschnitte ist der Schritt 0', begrenze(3, 0) === 0);
  pruefe('Lernformat: Nicht-Zahlen ergeben 0', begrenze(undefined, 5) === 0);
}
