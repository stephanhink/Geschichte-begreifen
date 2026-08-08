// Test-Einstieg: hier werden alle Testdateien registriert (wie bei "Mathe
// begreifen"). Neue Testdateien MÜSSEN hier importiert werden, sonst zählt
// `npm test` sie nicht.
//
// Stand: Smoke-Tests für die App-Dateien + Prüfungen der Themen-Module.
// Die echten Prüfungen wachsen mit der Fachlogik in utils/.
//
// Eine registrierte Testdatei exportiert `laufe(pruefe)` und meldet ihre
// Ergebnisse über die übergebene Prüf-Funktion.
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { laufe as laufeThemen } from './themen.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const projekt = path.join(root, '..');

let fehler = 0;
function pruefe(name, ok) {
  if (ok) {
    console.log('ok: ' + name);
  } else {
    console.error('FEHLER: ' + name);
    fehler += 1;
  }
}

pruefe('App.js existiert', existsSync(path.join(projekt, 'App.js')));
pruefe('index.js existiert', existsSync(path.join(projekt, 'index.js')));
pruefe('app.json existiert', existsSync(path.join(projekt, 'app.json')));

// Registrierte Testdateien:
laufeThemen(pruefe);

if (fehler > 0) {
  console.error(`${fehler} Prüfung(en) fehlgeschlagen.`);
  process.exit(1);
}
console.log('Alle Prüfungen bestanden.');
