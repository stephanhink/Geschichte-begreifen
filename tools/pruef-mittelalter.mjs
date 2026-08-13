// Wegwerf-Prüfskript für die Mittelalter-Karte (nicht Teil von npm test).
//
// Es prüft dasselbe wie tools/pruef-koenigreiche.mjs: Atlas-Treue der Küsten,
// Größenverhältnisse der Phasen — und näherungsweise, ob sich Beschriftungen
// überlappen oder aus dem Bild laufen. Das Letzte kann `npm test` nicht
// entscheiden, weil es von Schriftgröße und Gerät abhängt; das Skript gibt nur
// einen Hinweis, wo man auf dem Handy genauer hinsehen sollte.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const karte = require('../utils/themen/karten/mittelalter.js');
const { pruefeKarte } = require('../utils/themen/schema.js');
const { erstelleProjektion } = require('../utils/karte-geo.js');

const RAHMEN = { minLon: -11, maxLon: 44, minLat: 30, maxLat: 58, breite: 700 };
const geo = erstelleProjektion(RAHMEN);
const JE_GRAD = RAHMEN.breite / (RAHMEN.maxLon - RAHMEN.minLon);
console.log('Maße:', karte.breite, 'x', karte.hoehe, ' Einheiten/Grad:', JE_GRAD.toFixed(2));
console.log('Schema-Fehler:', pruefeKarte(karte));

function eckpunkte(d) {
  const zahlen = (d.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  const paare = [];
  for (let i = 0; i + 1 < zahlen.length; i += 2) paare.push([zahlen[i], zahlen[i + 1]]);
  return paare.filter((_, i) => i % 3 === 0);
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

const kueste = karte.basis
  .filter((t) => t.art === 'land' || t.art === 'wasser')
  .flatMap((t) => eckpunkte(t.d));
console.log('Küstenpunkte:', kueste.length);
const abstand = (lon, lat) => {
  const [x, y] = geo.punkt(lon, lat);
  return kueste.reduce((m, [kx, ky]) => Math.min(m, Math.hypot(kx - x, ky - y)), Infinity);
};
const TOL = JE_GRAD * 0.6;
console.log('Toleranz:', TOL.toFixed(1));
const landmarken = [
  ["Land's End", -5.71, 50.07],
  ['Firth of Forth', -2.7, 56.1],
  ['Belfast Lough', -5.7, 54.7],
  ['Themsemuendung', 0.8, 51.45],
  ['Ostende', 2.92, 51.23],
  ['Le Havre', 0.1, 49.49],
  ['Bremerhaven', 8.58, 53.55],
  ['Esbjerg', 8.45, 55.47],
  ['Stettiner Haff', 14.25, 53.92],
  ['Danzig', 18.65, 54.35],
  ['Brest (Bretagne)', -4.5, 48.38],
  ['Becken von Arcachon', -1.17, 44.66],
  ['Porto', -8.68, 41.15],
  ['Tejomuendung/Lissabon', -9.15, 38.7],
  ['Kap Trafalgar', -6.03, 36.18],
  ['Valencia', -0.33, 39.47],
  ['Barcelona', 2.18, 41.38],
  ['Marseille', 5.37, 43.3],
  ['Genua', 8.95, 44.4],
  ['Neapel', 14.25, 40.85],
  ['Bari', 16.87, 41.13],
  ['Venedig', 12.34, 45.44],
  ['Split', 16.44, 43.5],
  ['Kap Matapan', 22.48, 36.39],
  ['Thessaloniki', 22.95, 40.62],
  ['Izmir/Smyrna', 27.14, 38.42],
  ['Bosporus/Konstantinopel', 28.98, 41.02],
  ['Varna', 27.92, 43.2],
  ['Donaudelta', 29.6, 45.2],
  ['Odessa', 30.75, 46.48],
  ['Sewastopol', 33.53, 44.6],
  ['Trapezunt', 39.72, 41.0],
  ['Sinope', 35.15, 42.03],
  ['Antiochia/Seleukia', 35.9, 36.1],
  ['Beirut', 35.5, 33.9],
  ['Gaza', 34.47, 31.52],
  ['Nildelta/Alexandria', 29.9, 31.2],
  ['Tunis/Karthago', 10.32, 36.95],
  ['Algier', 3.06, 36.78],
  ['Tanger', -5.8, 35.79],
  ['Palermo', 13.36, 38.13],
  ['Cagliari', 9.1, 39.2],
  ['Zypern/Paphos', 32.42, 34.75],
];
for (const [n, lon, lat] of landmarken) {
  const a = abstand(lon, lat);
  console.log((a < TOL ? '  ok  ' : ' FEHL ') + n.padEnd(26) + a.toFixed(1) + '  ' + (a / JE_GRAD).toFixed(2) + '°');
}
console.log('--- Gegenprobe (muss > ' + (TOL * 2).toFixed(1) + ' sein) ---');
const abseits = [
  ['mitten in Gallien', 3.0, 47.0],
  ['in Sachsen', 10.5, 52.0],
  ['auf der Meseta', -4.0, 40.8],
  ['in der ungarischen Tiefebene', 19.5, 46.8],
  ['in Polen', 20.0, 52.0],
  ['in Anatolien', 33.0, 39.0],
  ['in der Sahara', 8.0, 31.0],
  ['mitten in der Nordsee', 3.5, 55.6],
  ['mitten in der Ostsee', 18.0, 56.6],
  ['im Golf von Biskaya', -5.0, 45.5],
  ['im Tyrrhenischen Meer', 12.0, 39.6],
  ['im Ionischen Meer', 19.5, 37.5],
  ['im Schwarzen Meer', 34.0, 43.3],
  ['im oestlichen Mittelmeer', 30.0, 34.0],
];
for (const [n, lon, lat] of abseits) {
  const a = abstand(lon, lat);
  console.log((a > TOL * 2 ? '  ok  ' : ' FEHL ') + n.padEnd(26) + a.toFixed(1));
}

console.log('--- Flaechen je Phase ---');
for (const phase of karte.phasen) {
  console.log(phase.label, phase.flaechen.length);
  for (const f of phase.flaechen) {
    console.log('   ', flaecheninhalt(eckpunkte(f.d)).toFixed(0).padStart(7), f.titel);
  }
}

console.log('--- Ueberlappung von Schrift (Naeherung ueber Rechtecke) ---');
// Beschriftungen: textAnchor middle, fontSize 20 (land) / 19 (meer).
// Ortsnamen: linksbuendig bei x+11, fontSize 18, fett.
const kaesten = [];
for (const b of karte.beschriftungen) {
  const gr = b.art === 'meer' ? 19 : 20;
  const w = b.text.length * 0.52 * gr;
  kaesten.push(['Text  ' + b.text, b.x - w / 2, b.x + w / 2, b.y - gr * 0.75, b.y + gr * 0.3]);
}
for (const pt of karte.punkte) {
  const w = pt.name.length * 0.56 * 18;
  kaesten.push(['Ort   ' + pt.name, pt.x - 9, pt.x + 11 + w, pt.y - 9, pt.y + 9]);
}
for (let i = 0; i < kaesten.length; i += 1) {
  for (let j = i + 1; j < kaesten.length; j += 1) {
    const a = kaesten[i];
    const b = kaesten[j];
    if (a[1] < b[2] && b[1] < a[2] && a[3] < b[4] && b[3] < a[4]) {
      console.log('   ueberlappt:', a[0], '<->', b[0]);
    }
  }
}
console.log('--- Schrift ausserhalb des Bildes ---');
for (const k of kaesten) {
  if (k[1] < 0 || k[2] > karte.breite || k[3] < 0 || k[4] > karte.hoehe) {
    console.log('   raus:', k[0], k[1].toFixed(0), k[2].toFixed(0), k[3].toFixed(0), k[4].toFixed(0));
  }
}
