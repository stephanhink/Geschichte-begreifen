// Test-Einstieg: hier werden alle Testdateien registriert (wie bei "Mathe
// begreifen"). Neue Testdateien MÜSSEN hier importiert werden, sonst zählt
// `npm test` sie nicht.
//
// Stand: Smoke-Tests für die App-Dateien + Prüfungen der Fachlogik in utils/
// (Themen-Module, Karten, Markdown, Quiz, Fortschritt, Lernformat).
//
// Eine registrierte Testdatei exportiert `laufe(pruefe)` und meldet ihre
// Ergebnisse über die übergebene Prüf-Funktion. `laufe` darf auch
// asynchron sein — hier unten wird darauf gewartet.
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { laufe as laufeThemen } from './themen.mjs';
import { laufe as laufeKarte } from './karte.mjs';
import { laufe as laufeKarteChina } from './karte-china.mjs';
import { laufe as laufeKarteDschingis } from './karte-dschingis.mjs';
import { laufe as laufeKarteJapan } from './karte-japan.mjs';
import { laufe as laufeKarteIsraelPalaestina } from './karte-israel-palaestina.mjs';
import { laufe as laufeKarteGermanen } from './karte-germanen.mjs';
import { laufe as laufeKarteKoenigreiche } from './karte-koenigreiche.mjs';
import { laufe as laufeKarteMittelalter } from './karte-mittelalter.mjs';
import { laufe as laufeKarteEroberungAmerikas } from './karte-eroberung-amerikas.mjs';
import { laufe as laufeKarteDreissigjaehrigerKrieg } from './karte-dreissigjaehriger-krieg.mjs';
import { laufe as laufeKarteUsaUnabhaengigkeit } from './karte-usa-unabhaengigkeit.mjs';
import { laufe as laufeKarteRevolutionUndNapoleon } from './karte-revolution-und-napoleon.mjs';
import { laufe as laufeKarteDieKolonien } from './karte-die-kolonien.mjs';
import { laufe as laufeKarteWegZumErstenWeltkrieg } from './karte-weg-zum-ersten-weltkrieg.mjs';
import { laufe as laufeKarteUsaWeltmacht } from './karte-usa-weltmacht.mjs';
import { laufe as laufeKarteWeimarNs } from './karte-weimar-ns.mjs';
import { laufe as laufeKarteZweiterWeltkrieg } from './karte-zweiter-weltkrieg.mjs';
import { laufe as laufeKarteKalterKrieg } from './karte-kalter-krieg.mjs';
import { laufe as laufeKarteRusslandWesten } from './karte-russland-westen.mjs';
import { laufe as laufeMarkdown } from './markdown.mjs';
import { laufe as laufeQuiz } from './quiz.mjs';
import { laufe as laufeFortschritt } from './fortschritt.mjs';
import { laufe as laufeLernformat } from './lernformat.mjs';
import { laufe as laufeArchitektur } from './architektur.mjs';

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
laufeKarte(pruefe);
laufeKarteChina(pruefe);
laufeKarteDschingis(pruefe);
laufeKarteJapan(pruefe);
laufeKarteIsraelPalaestina(pruefe);
laufeKarteGermanen(pruefe);
laufeKarteKoenigreiche(pruefe);
laufeKarteMittelalter(pruefe);
laufeKarteEroberungAmerikas(pruefe);
laufeKarteDreissigjaehrigerKrieg(pruefe);
laufeKarteUsaUnabhaengigkeit(pruefe);
laufeKarteRevolutionUndNapoleon(pruefe);
laufeKarteDieKolonien(pruefe);
laufeKarteWegZumErstenWeltkrieg(pruefe);
laufeKarteUsaWeltmacht(pruefe);
laufeKarteWeimarNs(pruefe);
laufeKarteZweiterWeltkrieg(pruefe);
laufeKarteKalterKrieg(pruefe);
laufeKarteRusslandWesten(pruefe);
laufeMarkdown(pruefe);
laufeQuiz(pruefe);
laufeLernformat(pruefe);
laufeArchitektur(pruefe);
await laufeFortschritt(pruefe);

if (fehler > 0) {
  console.error(`${fehler} Prüfung(en) fehlgeschlagen.`);
  process.exit(1);
}
console.log('Alle Prüfungen bestanden.');
