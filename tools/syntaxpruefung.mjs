// Einmal-Werkzeug: prüft alle .js-Dateien der App auf Syntaxfehler.
//
// Nicht Teil von `npm test` — der Prüfrahmen soll ohne node_modules laufen,
// und @babel/parser kommt nur als Beipack von Expo mit. Zum Nachprüfen nach
// größeren UI-Änderungen:  node tools/syntaxpruefung.mjs

import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const { parse } = await import(path.join(wurzel, 'node_modules/@babel/parser/lib/index.js'));

const dateien = ['App.js', 'index.js'];

function sammle(ort) {
  for (const eintrag of readdirSync(ort)) {
    const voll = path.join(ort, eintrag);
    if (statSync(voll).isDirectory()) sammle(voll);
    else if (eintrag.endsWith('.js')) dateien.push(path.relative(wurzel, voll));
  }
}
for (const ordner of ['components', 'screens', 'utils']) sammle(path.join(wurzel, ordner));

let fehler = 0;
for (const datei of dateien) {
  try {
    parse(readFileSync(path.join(wurzel, datei), 'utf8'), {
      sourceType: 'unambiguous',
      plugins: ['jsx'],
    });
    console.log('ok:  ' + datei);
  } catch (ausnahme) {
    fehler += 1;
    console.error('FEHLER: ' + datei + ' -> ' + ausnahme.message);
  }
}

if (fehler > 0) process.exit(1);
console.log(`${dateien.length} Dateien ohne Syntaxfehler.`);
