// Wegwerf-Werkzeug für die Karte „Der Aufstieg Asiens und die Zukunft des
// Westens".
//
// Nicht Teil von `npm test` (siehe CLAUDE.md — die Kartentests liegen in
// tests/). Dieses Skript beantwortet vier Fragen, die man vor dem Schreiben
// des Tests wissen muss und beim Gegenlesen am Gerät wieder braucht:
//
//   1. Liegen die Orte, die das Kapitel nennt, in den Flächen, in denen sie
//      liegen sollen? (Punkt-im-Vieleck, alle drei Phasen)
//   2. Wie weit liegen bekannte Küstenorte von der gezeichneten Küste
//      entfernt — und liegt im Binnenland oder auf offener See keine?
//   3. Wie groß sind die Flächen je Phase?
//   4. Überlappen sich Beschriftungen und Ortsnamen auf dem Bild?
//
// Aufruf: `node tools/pruef-aufstieg-asiens.mjs`
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const karte = require('../utils/themen/karten/aufstieg-asiens.js');
const { erstelleProjektion } = require('../utils/karte-geo.js');

const RAHMEN = { minLon: -10, maxLon: 145, minLat: -10, maxLat: 58, breite: 700 };
const geo = erstelleProjektion(RAHMEN);
const EINHEITEN_JE_GRAD = RAHMEN.breite / (RAHMEN.maxLon - RAHMEN.minLon);

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
  ['Frankfurt', 8.68, 50.11],
  ['Paris', 2.35, 48.86],
  ['Rom', 12.5, 41.9],
  ['Leipzig', 12.37, 51.34],
  ['Berlin', 13.4, 52.52],
  ['Wien', 16.37, 48.21],
  ['Bern', 7.45, 46.95],
  ['Madrid', -3.7, 40.42],
  ['London', -0.13, 51.51],
  ['Warschau', 21.0, 52.23],
  ['Tokio', 139.69, 35.69],
  ['Osaka', 135.5, 34.7],
  ['Sapporo', 141.35, 43.06],
  ['Seoul', 126.98, 37.57],
  ['Pjoengjang', 125.75, 39.03],
  ['Peking', 116.4, 39.9],
  ['Chengdu', 104.07, 30.67],
  ['Urumqi', 87.6, 43.8],
  ['Lhasa', 91.1, 29.65],
  ['Ulaanbaatar', 106.9, 47.9],
  ['Hanoi', 105.85, 21.03],
  ['Ho-Chi-Minh-Stadt', 106.7, 10.78],
  ['Bangkok', 100.5, 13.75],
  ['Delhi', 77.2, 28.6],
  ['Bengaluru', 77.59, 12.97],
  ['Dhaka', 90.4, 23.8],
  ['Kathmandu', 85.3, 27.7],
  ['Islamabad', 73.06, 33.7],
  ['Taipeh', 121.56, 25.03],
  ['Moskau', 37.62, 55.75],
];

const muster = [
  ['EUROPA', /Gründerstaaten|Europäische Wirtschaftsgemeinschaft/],
  ['DDR', /^Deutsche Demokratische/],
  ['JAPAN', /^Japan/],
  ['CHINA', /^Volksrepublik China/],
  ['INDIEN', /^Indien/],
  ['KOREA', /^Republik Korea/],
  ['TAIWAN', /^Taiwan/],
  ['VIETNAM', /^Vietnam/],
  ['HONGKONG', /^Hongkong/],
  ['SINGAPUR', /^Singapur/],
];

console.log('--- Punkt im Vieleck (1955–1968 | 1990 | 2024) ---');
for (const [name, lon, lat] of orte) {
  const zeilen = karte.phasen.map(
    (phase) =>
      muster
        .filter(([, m]) => liegtIn(phase, m, lon, lat))
        .map(([kurz]) => kurz)
        .join('+') || '—',
  );
  console.log(name.padEnd(20), zeilen.map((z) => z.padEnd(14)).join(' '));
}

console.log('\n--- Die zweite Lage (die zweitgrößte Volkswirtschaft) ---');
for (const [name, lon, lat] of [
  ['Frankfurt', 8.68, 50.11],
  ['Tokio', 139.69, 35.69],
  ['Peking', 116.4, 39.9],
  ['Paris', 2.35, 48.86],
]) {
  console.log(
    name.padEnd(12),
    karte.phasen.map((phase) => (liegtIn(phase, /zweite Lage/, lon, lat) ? 'ja' : 'nein')).join(' | '),
  );
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

console.log('\n--- Atlas-Gegenprobe: Abstand zur gezeichneten Küste ---');
const kuestenpunkte = karte.basis
  .filter((teil) => teil.art === 'land')
  .flatMap((teil) => eckpunkte(teil.d));
const abstand = (lon, lat) => {
  const [x, y] = geo.punkt(lon, lat);
  return kuestenpunkte.reduce((m, [a, b]) => Math.min(m, Math.hypot(a - x, b - y)), Infinity);
};
const landmarken = [
  ['Lissabon', -9.14, 38.71],
  ['Brest', -4.49, 48.39],
  ['Rotterdam', 4.29, 51.92],
  ['Venedig', 12.34, 45.44],
  ['Izmir', 27.14, 38.42],
  ['Alexandria', 29.92, 31.2],
  ['Aden', 45.03, 12.78],
  ['Karatschi', 67.0, 24.85],
  ['Chennai', 80.27, 13.08],
  ['Rangun', 96.2, 16.8],
  ['Singapur', 103.85, 1.29],
  ['Hongkong', 114.17, 22.3],
  ['Schanghai', 121.7, 31.3],
  ['Busan', 129.1, 35.1],
  ['Tokio-Bucht', 139.85, 35.4],
  ['Manila-Bucht', 120.6, 14.4],
  ['Jakarta', 106.8, -6.1],
  ['Mombasa', 39.67, -4.05],
];
for (const [name, lon, lat] of landmarken) {
  const d = abstand(lon, lat);
  console.log(
    `  ${name.padEnd(14)} ${d.toFixed(2).padStart(7)}  ${d < EINHEITEN_JE_GRAD ? 'auf der Küste' : 'WEIT WEG'}`,
  );
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
