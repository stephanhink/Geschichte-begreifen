// Wegwerf-Werkzeug für Runde 11: prüft die Karte „Die Eroberung Amerikas"
// gegen den Atlas und zeigt die Flächengrößen der Phasen. Nicht Teil von
// `npm test` — der Aufruf lautet `node tools/pruef-eroberung-amerikas.mjs`.
//
// Es beantwortet drei Fragen, die man beim Bauen einer Karte ständig hat:
//   1. Wie weit liegt eine bekannte Landmarke von der nächsten gezeichneten
//      Küstenecke entfernt (in SVG-Einheiten und in Längengraden)?
//   2. Liegt im Binnenland oder auf offener See wirklich keine Küste?
//   3. Wie groß sind die Flächen der Phasen — und stimmen die Größenverhält-
//      nisse mit dem, was das Kapitel erzählt?
//   4. Stehen zwei Beschriftungen so dicht beieinander, dass sie sich auf dem
//      Gerät überlappen könnten?
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const karte = require('../utils/themen/karten/eroberung-amerikas.js');
const { pruefeKarte } = require('../utils/themen/schema.js');
const { erstelleProjektion } = require('../utils/karte-geo.js');

const RAHMEN = { minLon: -115, maxLon: -5, minLat: -20, maxLat: 45, breite: 700 };
const geo = erstelleProjektion(RAHMEN);
const EJG = RAHMEN.breite / (RAHMEN.maxLon - RAHMEN.minLon);

console.log('breite × hoehe:', karte.breite, '×', karte.hoehe, '| erwartet:', geo.breite, '×', geo.hoehe);
const fehler = pruefeKarte(karte);
console.log('Schema:', fehler.length === 0 ? 'in Ordnung' : fehler);
console.log('Einheiten je Längengrad:', EJG.toFixed(3));

function eckpunkte(d) {
  const zahlen = (d.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  const paare = [];
  for (let i = 0; i + 1 < zahlen.length; i += 2) paare.push([zahlen[i], zahlen[i + 1]]);
  return paare.filter((_, i) => i % 3 === 0);
}

const kuesten = karte.basis
  .filter((teil) => teil.art === 'land')
  .flatMap((teil) => eckpunkte(teil.d));
console.log('Küstenecken:', kuesten.length);

const abstand = (lon, lat) => {
  const [x, y] = geo.punkt(lon, lat);
  return kuesten.reduce((m, [kx, ky]) => Math.min(m, Math.hypot(kx - x, ky - y)), Infinity);
};

// Dieselbe Liste wie in tests/karte-eroberung-amerikas.mjs. Keiner dieser Orte
// steht als Eckpunkt im Kartenmodul — die Spalte „Abstand zum Eckpunkt" unten
// muss überall mindestens 0,1 Grad zeigen, sonst prüft der Test die
// abgeschriebene Zahl statt der gezeichneten Linie.
const landmarken = [
  ['Ensenada in Niederkalifornien', -116.62, 31.86],
  ['die Bucht von Magdalena', -112.1, 24.6],
  ['Zihuatanejo an der Pazifikküste Mexikos', -101.55, 17.64],
  ['Campeche am Golf von Mexiko', -90.53, 19.85],
  ['Cozumel vor Yucatán', -86.95, 20.51],
  ['La Ceiba in Honduras', -86.79, 15.78],
  ['Bluefields an der Moskitoküste', -83.77, 12.01],
  ['Colón auf der Karibikseite des Isthmus', -79.9, 9.35],
  ['Santa Marta in Kolumbien', -74.2, 11.24],
  ['Paramaribo an der Guayanaküste', -55.17, 5.85],
  ['Maceió in Brasilien', -35.74, -9.67],
  ['Ilhéus in Bahia', -39.04, -14.79],
  ['Cabo Frio bei Rio de Janeiro', -42.02, -22.88],
  ['Paita an der Nordküste Perus', -81.11, -5.09],
  ['Salaverry bei Trujillo', -79.03, -8.23],
  ['Matanzas an der Nordküste Kubas', -81.58, 23.05],
  ['Santiago de Cuba', -75.82, 19.97],
  ['Cap-Haïtien auf Hispaniola', -72.2, 19.76],
  ['Mayagüez auf Puerto Rico', -67.14, 18.2],
  ['Kingston auf Jamaika', -76.79, 17.99],
  ['Santa Cruz auf Teneriffa', -16.25, 28.47],
  ['Arrecife auf Lanzarote', -13.55, 28.96],
  ['Vigo an der galicischen Küste', -8.72, 42.24],
  ['Gijón an der Nordküste Spaniens', -5.66, 43.54],
  ['Porto an der Douromündung', -8.68, 41.15],
  ['Tanger an der Straße von Gibraltar', -5.8, 35.79],
  ['Nouakchott in Mauretanien', -15.98, 18.08],
  ['Monrovia in Westafrika', -10.8, 6.3],
  ['Key West an der Südspitze Floridas', -81.78, 24.55],
  ['Norfolk an der Chesapeake Bay', -76.29, 36.85],
  ['die Mündung des Hudson bei New York', -74.02, 40.7],
  ['Boston an der Massachusetts Bay', -71.05, 42.36],
  ['die Bucht von Tampa', -82.55, 27.75],
  ['Savannah in Georgia', -81.09, 32.08],
  ['die Galveston Bay in Texas', -94.95, 29.55],
  ['die Mündung des Mississippi', -89.25, 29.15],
];

/** Abstand in Grad zum nächsten Eckpunkt — die Probe auf „nicht abgeschrieben". */
const eckpunkteGeo = karte.basis
  .filter((teil) => teil.art === 'land')
  .flatMap((teil) => eckpunkte(teil.d))
  .map(([x, y]) => [x / EJG + RAHMEN.minLon, RAHMEN.maxLat - (y / karte.hoehe) * (RAHMEN.maxLat - RAHMEN.minLat)]);
const gradAbstand = (lon, lat) =>
  eckpunkteGeo.reduce((m, [l, b]) => Math.min(m, Math.hypot(l - lon, b - lat)), Infinity);

console.log('\n--- Landmarken (Toleranz ' + EJG.toFixed(2) + ' Einheiten = 1 Längengrad) ---');
for (const [name, lon, lat] of landmarken) {
  const d = abstand(lon, lat);
  const g = gradAbstand(lon, lat);
  const ok = d < EJG && g >= 0.1;
  console.log(`${ok ? 'ok  ' : 'FEHL'} ${name}: ${d.toFixed(2)} Einheiten (${(d / EJG).toFixed(2)}°), Eckpunktabstand ${g.toFixed(3)}°`);
}

const abseits = [
  ['mitten im Atlantik', -45, 25],
  ['mitten im Pazifik', -105, 10],
  ['in der Sahara', -8, 25],
  ['im Amazonasbecken', -60, -5],
  ['auf der Hochebene von Mexiko', -101, 20.5],
  ['im Golf von Mexiko', -91, 25],
  ['im Karibischen Meer', -75, 15],
  ['auf der kastilischen Meseta', -5.5, 41.0],
  ['in den Anden bei Cusco', -72, -13.5],
  ['in der Prärie Nordamerikas', -95, 40],
];

console.log('\n--- Kontrollpunkte (müssen > ' + (2 * EJG).toFixed(2) + ' sein) ---');
for (const [name, lon, lat] of abseits) {
  const d = abstand(lon, lat);
  console.log(`${d > 2 * EJG ? 'ok  ' : 'FEHL'} ${name}: ${d.toFixed(2)} (${(d / EJG).toFixed(2)}°)`);
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

console.log('\n--- Phasen ---');
for (const phase of karte.phasen) {
  console.log(`${phase.id} (${phase.label})`);
  for (const f of phase.flaechen) {
    console.log('   ', flaecheninhalt(eckpunkte(f.d)).toFixed(0).padStart(7), f.titel);
  }
}

console.log('\n--- Punkte ---');
for (const punkt of karte.punkte) {
  console.log(`${punkt.id.padEnd(16)} x=${String(punkt.x).padStart(6)} y=${String(punkt.y).padStart(6)} ${punkt.text.length} Zeichen`);
}

console.log('\n--- Bewegungen ---');
for (const b of karte.bewegungen) {
  console.log(`${b.id.padEnd(10)} ${JSON.stringify(b.von)} -> ${JSON.stringify(b.nach)} ${b.text.length} Zeichen`);
}

console.log('\n--- mögliche Überlappungen der Beschriftungen ---');
const marken = [
  ...karte.beschriftungen.map((b) => ({ text: b.text, x: b.x, y: b.y })),
  ...karte.punkte.map((p) => ({ text: p.name, x: p.x, y: p.y })),
];
let treffer = 0;
for (let i = 0; i < marken.length; i += 1) {
  for (let j = i + 1; j < marken.length; j += 1) {
    const dx = Math.abs(marken[i].x - marken[j].x);
    const dy = Math.abs(marken[i].y - marken[j].y);
    const breite = (marken[i].text.length + marken[j].text.length) * 1.9;
    if (dy < 11 && dx < breite) {
      console.log(`  ${marken[i].text} / ${marken[j].text}  (dx ${dx.toFixed(1)}, dy ${dy.toFixed(1)})`);
      treffer += 1;
    }
  }
}
if (treffer === 0) console.log('  keine');
