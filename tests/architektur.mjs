// Prüfungen für die Architektur-Regel aus CLAUDE.md.
//
// „Fachlogik und Inhalte gehören in utils/ — ohne UI-Importe, mit blankem
// `node` prüfbar." Diese Regel steht bisher nur in der Dokumentation. Hier
// wird sie nachgeprüft, damit sie beim Wachsen der App nicht still erodiert:
//
//   1. Keine Datei in utils/ oder tests/ zieht React, React Native oder Expo.
//   2. Jede Datei in utils/ lädt sich mit blankem `node`.
//   3. Alle Verweise innerhalb der App zeigen auf vorhandene Dateien.
//   4. Es sind keine neuen npm-Pakete dazugekommen (Vorgabe des Betreibers).
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const projekt = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Pakete, die die App laut CLAUDE.md benutzen darf. */
const ERLAUBTE_PAKETE = [
  '@react-native-async-storage/async-storage',
  'expo',
  'expo-status-bar',
  'react',
  'react-native',
  'react-native-safe-area-context',
  'react-native-svg',
];

/** Alles, was in utils/ und tests/ nichts zu suchen hat. */
const UI_PAKETE = ['react', 'react-native', 'react-native-svg', 'react-native-safe-area-context', 'expo', 'expo-status-bar', '@react-native-async-storage/async-storage'];

/** Sammelt alle Quelldateien eines Ordners (rekursiv). */
function dateienIn(ordner, endung) {
  const ort = path.join(projekt, ordner);
  if (!existsSync(ort)) return [];
  const gefunden = [];
  const gehe = (jetzt) => {
    for (const eintrag of readdirSync(jetzt)) {
      const voll = path.join(jetzt, eintrag);
      if (statSync(voll).isDirectory()) gehe(voll);
      else if (eintrag.endsWith(endung)) gefunden.push(path.relative(projekt, voll));
    }
  };
  gehe(ort);
  return gefunden;
}

/** Alle Modulpfade, die eine Datei per import oder require lädt. */
function importeVon(datei) {
  const inhalt = readFileSync(path.join(projekt, datei), 'utf8');
  const pfade = [];
  const muster = [
    /(?:^|[^\w.])import\s[^;]*?from\s+['"]([^'"]+)['"]/g,
    /(?:^|[^\w.])import\s+['"]([^'"]+)['"]/g,
    /\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];
  for (const regel of muster) {
    let treffer = regel.exec(inhalt);
    while (treffer) {
      pfade.push(treffer[1]);
      treffer = regel.exec(inhalt);
    }
  }
  return pfade;
}

/**
 * Die benannten Importe einer Datei aus lokalen Modulen.
 *
 * Erfasst `import { a, b as c } from './x'` — Standard-Importe und
 * `import * as` bleiben außen vor, die lassen sich so nicht prüfen.
 *
 * @returns {Array<{pfad: string, namen: string[]}>}
 */
function benannteImporte(datei) {
  const inhalt = readFileSync(path.join(projekt, datei), 'utf8');
  const muster = /import\s*\{([^}]+)\}\s*from\s*['"](\.[^'"]+)['"]/g;
  const gefunden = [];
  let treffer = muster.exec(inhalt);
  while (treffer) {
    const namen = treffer[1]
      .split(',')
      .map((stueck) => stueck.trim().split(/\s+as\s+/)[0].trim())
      .filter((name) => name.length > 0 && name !== 'default');
    gefunden.push({ pfad: treffer[2], namen });
    treffer = muster.exec(inhalt);
  }
  return gefunden;
}

/** Löst einen relativen Importpfad in eine Datei auf. */
function loeseAuf(vonDatei, pfad) {
  const basis = path.resolve(projekt, path.dirname(vonDatei), pfad);
  for (const kandidat of [basis, `${basis}.js`, path.join(basis, 'index.js')]) {
    if (existsSync(kandidat) && statSync(kandidat).isFile()) return kandidat;
  }
  return null;
}

/**
 * @param {(name: string, ok: boolean) => void} pruefe Prüf-Funktion des Rahmens
 */
export function laufe(pruefe) {
  // --- 1. utils/ und tests/ bleiben frei von UI --------------------------
  const fachlogik = [...dateienIn('utils', '.js'), ...dateienIn('tests', '.mjs')];
  pruefe('Architektur: es gibt Fachlogik-Dateien zu prüfen', fachlogik.length > 0);

  for (const datei of fachlogik) {
    const fremd = importeVon(datei).filter((pfad) => UI_PAKETE.includes(pfad));
    pruefe(`Architektur: ${datei} ohne UI-Importe`, fremd.length === 0);
  }

  // --- 2. utils/ lädt mit blankem node ----------------------------------
  for (const datei of dateienIn('utils', '.js')) {
    let geladen = false;
    try {
      require(path.join(projekt, datei));
      geladen = true;
    } catch (fehler) {
      geladen = false;
    }
    pruefe(`Architektur: ${datei} lädt mit blankem node`, geladen);
  }

  // --- 3. Alle Verweise zeigen auf vorhandene Dateien --------------------
  // Ein Tippfehler im Importpfad fällt sonst erst auf dem Handy auf.
  const quellen = ['App.js', 'index.js', ...dateienIn('components', '.js'), ...dateienIn('screens', '.js'), ...dateienIn('utils', '.js')];
  for (const datei of quellen) {
    for (const pfad of importeVon(datei)) {
      if (!pfad.startsWith('.')) continue;
      const basis = path.resolve(projekt, path.dirname(datei), pfad);
      const gefunden =
        existsSync(basis) ||
        existsSync(`${basis}.js`) ||
        existsSync(path.join(basis, 'index.js'));
      pruefe(`Architektur: ${datei} findet „${pfad}"`, gefunden);
    }
  }

  // --- 3b. Benannte Importe müssen es im Ziel auch geben -----------------
  // Ein vertippter Name (`perspektivFarbe` statt `perspektivfarbe`) fällt
  // sonst erst zur Laufzeit auf dem Gerät auf — als undefined.
  for (const datei of quellen) {
    for (const { pfad, namen } of benannteImporte(datei)) {
      const ziel = loeseAuf(datei, pfad);
      if (!ziel) continue; // fehlende Datei meldet bereits Punkt 3
      const zielInhalt = readFileSync(ziel, 'utf8');
      for (const name of namen) {
        const exportiert =
          new RegExp(`export\\s+(?:const|function|class|let)\\s+${name}\\b`).test(zielInhalt) ||
          new RegExp(`export\\s*\\{[^}]*\\b${name}\\b[^}]*\\}`).test(zielInhalt) ||
          new RegExp(`module\\.exports\\s*=\\s*\\{[^}]*\\b${name}\\b[^}]*\\}`, 's').test(zielInhalt);
        pruefe(`Architektur: „${name}" aus „${pfad}" ist dort exportiert (${datei})`, exportiert);
      }
    }
  }

  // --- 4. Keine neuen Pakete --------------------------------------------
  const paket = JSON.parse(readFileSync(path.join(projekt, 'package.json'), 'utf8'));
  const abhaengigkeiten = Object.keys(paket.dependencies || {}).sort();
  pruefe(
    'Architektur: die Abhängigkeiten sind unverändert',
    abhaengigkeiten.join(',') === ERLAUBTE_PAKETE.slice().sort().join(','),
  );
  pruefe('Architektur: keine devDependencies dazugekommen', !paket.devDependencies);

  // Und keine Quelldatei zieht ein Paket, das gar nicht installiert ist.
  for (const datei of quellen) {
    for (const pfad of importeVon(datei)) {
      if (pfad.startsWith('.') || pfad.startsWith('node:')) continue;
      const paketname = pfad.startsWith('@') ? pfad.split('/').slice(0, 2).join('/') : pfad.split('/')[0];
      pruefe(`Architektur: ${datei} nutzt nur bekannte Pakete („${paketname}")`, ERLAUBTE_PAKETE.includes(paketname));
    }
  }

  // --- 5. Die Screens des Lernformats sind vorhanden ---------------------
  const erwarteteDateien = [
    'screens/Themenuebersicht.js',
    'screens/Kapitel.js',
    'components/abschnitte/AufhaengerAbschnitt.js',
    'components/abschnitte/PerspektivenAbschnitt.js',
    'components/abschnitte/SyntheseAbschnitt.js',
    'components/abschnitte/UrteilAbschnitt.js',
    'components/abschnitte/QuizAbschnitt.js',
  ];
  for (const datei of erwarteteDateien) {
    pruefe(`Architektur: ${datei} existiert`, existsSync(path.join(projekt, datei)));
  }
}
