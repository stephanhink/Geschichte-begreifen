// Wegwerf-Werkzeug für die Karte „Russland und der Westen".
//
// Nicht Teil von `npm test` (siehe CLAUDE.md — die Kartentests liegen in
// tests/). Dieses Skript beantwortet drei Fragen, die man vor dem Schreiben
// des Tests wissen muss und die man später beim Gegenlesen wieder braucht:
//
//   1. Liegen die Orte, die das Kapitel behauptet, wirklich in den Flächen,
//      in denen sie liegen sollen? (Punkt-im-Vieleck, alle drei Phasen)
//   2. Wie groß sind die Flächen je Phase? (wächst die NATO, schrumpft die
//      von Kyjiw kontrollierte Ukraine?)
//   3. Überlappen sich Beschriftungen und Ortsnamen auf dem Bild?
//
// Aufruf: `node tools/pruef-russland-westen.mjs`
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const karte = require('../utils/themen/karten/russland-westen.js');
const { erstelleProjektion } = require('../utils/karte-geo.js');

const RAHMEN = { minLon: -10, maxLon: 48, minLat: 34, maxLat: 62, breite: 700 };
const geo = erstelleProjektion(RAHMEN);

function eckpunkte(d) {
  const zahlen = (d.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  const paare = [];
  for (let i = 0; i + 1 < zahlen.length; i += 2) paare.push([zahlen[i], zahlen[i + 1]]);
  return paare.filter((_, i) => i % 3 === 0);
}

function ringe(d) {
  return d.split('M').slice(1).map((teil) => eckpunkte(`M${teil}`));
}

function flaecheninhalt(punkte) {
  let summe = 0;
  for (let i = 0; i < punkte.length; i += 1) {
    const [x1, y1] = punkte[i];
    const [x2, y2] = punkte[(i + 1) % punkte.length];
    summe += x1 * y2 - x2 * y1;
  }
  return Math.abs(summe) / 2;
}

function imVieleck([x, y], ring) {
  let drin = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) drin = !drin;
  }
  return drin;
}

const liegtIn = (phase, muster, lon, lat) => {
  const punkt = geo.punkt(lon, lat);
  return phase.flaechen
    .filter((f) => muster.test(f.titel))
    .some((f) => ringe(f.d).some((ring) => imVieleck(punkt, ring)));
};

const orte = [
  ['Warschau', 21.0, 52.23],
  ['Prag', 14.42, 50.09],
  ['Budapest', 19.04, 47.5],
  ['Berlin', 13.4, 52.52],
  ['Riga', 24.1, 56.95],
  ['Tallinn', 24.75, 59.3],
  ['Vilnius', 25.28, 54.69],
  ['Bukarest', 26.1, 44.43],
  ['Sofia', 23.32, 42.7],
  ['Bratislava', 17.11, 48.15],
  ['Ljubljana', 14.5, 46.05],
  ['Zagreb', 15.98, 45.81],
  ['Sarajevo', 18.41, 43.86],
  ['Belgrad', 20.46, 44.82],
  ['Podgorica', 19.26, 42.44],
  ['Skopje', 21.43, 41.99],
  ['Tirana', 19.82, 41.33],
  ['Helsinki', 24.94, 60.17],
  ['Stockholm', 18.07, 59.33],
  ['Bern', 7.45, 46.95],
  ['Wien', 16.37, 48.21],
  ['Dublin', -6.27, 53.35],
  ['Moskau', 37.62, 55.75],
  ['St. Petersburg', 30.31, 59.94],
  ['Kaliningrad', 20.5, 54.71],
  ['Minsk', 27.57, 53.9],
  ['Kyjiw', 30.52, 50.45],
  ['Lwiw', 24.03, 49.84],
  ['Charkiw', 36.23, 49.99],
  ['Odessa', 30.73, 46.48],
  ['Dnipro', 35.05, 48.45],
  ['Simferopol', 34.1, 44.95],
  ['Sewastopol', 33.53, 44.62],
  ['Donezk', 37.8, 48.0],
  ['Luhansk', 39.33, 48.57],
  ['Mariupol', 37.55, 47.1],
  ['Melitopol', 35.37, 46.85],
  ['Kramatorsk', 37.55, 48.73],
  ['Cherson', 32.62, 46.63],
  ['Chisinau', 28.86, 47.01],
  ['Tiflis', 44.79, 41.72],
  ['Ankara', 32.85, 39.93],
];

const muster = [
  ['NATO', /NATO in Europa/],
  ['RUS', /^Russische Föderation \(\d+\)$/],
  ['UKR', /^Ukraine/],
  ['KRIM', /^Krim —/],
  ['BESETZT', /besetzte Gebiete|Separatisten/],
  ['BLR', /^Belarus/],
  ['BALT', /^Estland, Lettland/],
  ['GEO', /^Georgien/],
];

console.log('--- Punkt im Vieleck (1999 | 2014 | 2022) ---');
for (const [name, lon, lat] of orte) {
  const zeilen = karte.phasen.map((phase) =>
    muster
      .filter(([, m]) => liegtIn(phase, m, lon, lat))
      .map(([kurz]) => kurz)
      .join('+') || '—',
  );
  console.log(name.padEnd(16), zeilen.map((z) => z.padEnd(12)).join(' '));
}

console.log('\n--- Flächeninhalte je Phase ---');
for (const [kurz, m] of muster) {
  const werte = karte.phasen.map((phase) =>
    Math.round(
      phase.flaechen
        .filter((f) => m.test(f.titel))
        .reduce((s, f) => s + ringe(f.d).reduce((t, r) => t + flaecheninhalt(r), 0), 0),
    ),
  );
  console.log(kurz.padEnd(10), werte.map((w) => String(w).padStart(8)).join(' '));
}

console.log('\n--- Beschriftungen und Ortsnamen: mögliche Überlappungen ---');
const schrift = [
  ...karte.punkte.map((punkt) => ({ text: punkt.name, x: punkt.x, y: punkt.y, hoehe: 11, drehung: 0 })),
  ...karte.beschriftungen.map((b) => ({ text: b.text, x: b.x, y: b.y, hoehe: 13, drehung: b.drehung || 0 })),
];
const kasten = (s) => {
  const breite = s.text.length * s.hoehe * 0.52;
  const gedreht = Math.abs(s.drehung % 180) > 45;
  const w = gedreht ? s.hoehe : breite;
  const h = gedreht ? breite : s.hoehe;
  return { x1: s.x - w / 2, x2: s.x + w / 2, y1: s.y - h / 2, y2: s.y + h / 2 };
};
let treffer = 0;
for (let i = 0; i < schrift.length; i += 1) {
  for (let j = i + 1; j < schrift.length; j += 1) {
    const a = kasten(schrift[i]);
    const b = kasten(schrift[j]);
    if (a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2) {
      console.log(`  ${schrift[i].text} ↔ ${schrift[j].text}`);
      treffer += 1;
    }
  }
}
console.log(treffer === 0 ? '  keine' : `  ${treffer} mögliche Überlappung(en)`);

console.log('\n--- Punkte über dem Bildrand? ---');
for (const punkt of karte.punkte) {
  if (punkt.x < 0 || punkt.x > karte.breite || punkt.y < 0 || punkt.y > karte.hoehe) {
    console.log('  außerhalb:', punkt.name, punkt.x, punkt.y);
  }
}
console.log('  geprüft:', karte.punkte.length, 'Punkte auf', karte.breite, '×', karte.hoehe);
