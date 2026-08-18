// Wegwerf-Werkzeug: rechnet die Aussagen der Karte zu „Die neue Weltordnung
// und der Kalte Krieg" nach, bevor sie als Prüfungen in tests/ festgeschrieben
// werden. Nicht Teil von `npm test` — wie tools/pruef-mittelalter.mjs und die
// übrigen Skripte dieser Art.
//
//   node tools/pruef-kalter-krieg.mjs
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const karte = require('../utils/themen/karten/kalter-krieg.js');
const { erstelleProjektion } = require('../utils/karte-geo.js');

const RAHMEN = { minLon: -10, maxLon: 45, minLat: 34, maxLat: 61, breite: 700 };
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

function groesseVon(phase, muster) {
  return phase.flaechen
    .filter((f) => muster.test(f.titel))
    .reduce((summe, f) => summe + ringe(f.d).reduce((t, r) => t + flaecheninhalt(r), 0), 0);
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

const [p1, p2, p3] = karte.phasen;

const brd = karte.phasen.map((p) => groesseVon(p, /Bundesrepublik/));
const ddr = karte.phasen.map((p) => groesseVon(p, /Demokratische Republik/));
const de = karte.phasen.map((p) => groesseVon(p, /^Deutschland —/));
const nato = karte.phasen.map((p) => groesseVon(p, /NATO in Europa/));

console.log('BRD  ', brd.map((v) => Math.round(v)).join(' | '));
console.log('DDR  ', ddr.map((v) => Math.round(v)).join(' | '));
console.log('DE   ', de.map((v) => Math.round(v)).join(' | '));
console.log('NATO ', nato.map((v) => Math.round(v)).join(' | '));
console.log(
  'BRD+DDR vs vereintes Deutschland:',
  Math.round(brd[0] + ddr[0]),
  'gegen',
  Math.round(de[2]),
  `(Abweichung ${(((de[2] - (brd[0] + ddr[0])) / de[2]) * 100).toFixed(2)} %)`,
);

const proben = [
  ['Bonn liegt 1949 in der Bundesrepublik', liegtIn(p1, /Bundesrepublik/, 7.1, 50.73)],
  ['Bonn liegt 1961 in der Bundesrepublik', liegtIn(p2, /Bundesrepublik/, 7.1, 50.73)],
  ['Bonn liegt 1990 in Deutschland', liegtIn(p3, /^Deutschland —/, 7.1, 50.73)],
  ['München liegt in der Bundesrepublik', liegtIn(p1, /Bundesrepublik/, 11.58, 48.14)],
  ['Hamburg liegt in der Bundesrepublik', liegtIn(p1, /Bundesrepublik/, 10.0, 53.55)],
  ['Leipzig liegt 1949 in der DDR', liegtIn(p1, /Demokratische Republik/, 12.37, 51.34)],
  ['Leipzig liegt 1949 NICHT in der Bundesrepublik', !liegtIn(p1, /Bundesrepublik/, 12.37, 51.34)],
  ['Leipzig liegt 1990 in Deutschland', liegtIn(p3, /^Deutschland —/, 12.37, 51.34)],
  ['Rostock liegt 1961 in der DDR', liegtIn(p2, /Demokratische Republik/, 12.1, 54.0)],
  ['Spandau liegt 1949 in West-Berlin', liegtIn(p1, /West-Berlin/, 13.2, 52.53)],
  ['Spandau liegt 1961 in West-Berlin', liegtIn(p2, /West-Berlin/, 13.2, 52.53)],
  ['Spandau liegt NICHT in Ost-Berlin', !liegtIn(p1, /Ost-Berlin/, 13.2, 52.53)],
  ['Lichtenberg liegt in Ost-Berlin', liegtIn(p1, /Ost-Berlin/, 13.5, 52.52)],
  ['Lichtenberg liegt NICHT in West-Berlin', !liegtIn(p1, /West-Berlin/, 13.5, 52.52)],
  ['Spandau liegt 1990 in Berlin', liegtIn(p3, /^Berlin —/, 13.2, 52.53)],
  ['Lichtenberg liegt 1990 in Berlin', liegtIn(p3, /^Berlin —/, 13.5, 52.52)],
  ['Prag liegt 1949 im sowjetischen Einflussbereich', liegtIn(p1, /Polen, Tschechoslowakei/, 14.42, 50.09)],
  ['Prag liegt 1961 im Warschauer Pakt', liegtIn(p2, /Polen, Tschechoslowakei/, 14.42, 50.09)],
  ['Prag liegt 1991 im ehemaligen Warschauer Pakt', liegtIn(p3, /Polen, Tschechoslowakei/, 14.42, 50.09)],
  ['Warschau liegt 1949 im sowjetischen Einflussbereich', liegtIn(p1, /Polen, Tschechoslowakei/, 21.0, 52.23)],
  ['Budapest liegt 1961 im Warschauer Pakt', liegtIn(p2, /Polen, Tschechoslowakei/, 19.04, 47.5)],
  ['Bukarest liegt 1961 im Warschauer Pakt', liegtIn(p2, /Polen, Tschechoslowakei/, 26.1, 44.43)],
  ['Sofia liegt 1961 im Warschauer Pakt', liegtIn(p2, /Polen, Tschechoslowakei/, 23.32, 42.7)],
  ['Wien liegt in jeder Phase in Österreich', karte.phasen.every((p) => liegtIn(p, /Österreich/, 16.37, 48.21))],
  ['Wien liegt 1961 NICHT in der NATO', !liegtIn(p2, /NATO in Europa/, 16.37, 48.21)],
  ['Wien liegt 1961 NICHT im Warschauer Pakt', !liegtIn(p2, /Polen, Tschechoslowakei/, 16.37, 48.21)],
  ['Belgrad liegt in jeder Phase in Jugoslawien', karte.phasen.every((p) => liegtIn(p, /Jugoslawien/, 20.46, 44.82))],
  ['Belgrad liegt 1961 NICHT im Warschauer Pakt', !liegtIn(p2, /Polen, Tschechoslowakei/, 20.46, 44.82)],
  // Für die Punkt-im-Vieleck-Proben werden Orte im Landesinneren genommen:
  // Küstenstädte wie Helsinki, Stockholm oder Dublin liegen auf der Grenzlinie
  // selbst, und dort ist die Antwort eine Frage der Rundung.
  ['Lahti in Finnland liegt 1949 bei den Neutralen', liegtIn(p1, /Neutrale/, 25.66, 60.98)],
  ['Lahti in Finnland liegt 1991 bei den Neutralen', liegtIn(p3, /Neutrale/, 25.66, 60.98)],
  ['Lahti liegt NICHT in der Sowjetunion', !liegtIn(p1, /Sowjetunion/, 25.66, 60.98)],
  ['Örebro in Schweden liegt bei den Neutralen', liegtIn(p2, /Neutrale/, 15.21, 59.27)],
  ['Bern liegt bei den Neutralen', liegtIn(p2, /Neutrale/, 7.45, 46.95)],
  ['Athlone in Irland liegt bei den Neutralen', liegtIn(p2, /Neutrale/, -7.94, 53.42)],
  ['Athlone liegt NICHT in der NATO', !liegtIn(p2, /NATO in Europa/, -7.94, 53.42)],
  ['Belfast liegt in der NATO', liegtIn(p2, /NATO in Europa/, -5.93, 54.6)],
  ['Moskau liegt 1949 in der Sowjetunion', liegtIn(p1, /Sowjetunion/, 37.62, 55.75)],
  ['Moskau liegt 1991 in der Sowjetunion', liegtIn(p3, /Sowjetunion/, 37.62, 55.75)],
  ['Kiew liegt in der Sowjetunion', liegtIn(p1, /Sowjetunion/, 30.52, 50.45)],
  ['Riga liegt 1949 in der Sowjetunion', liegtIn(p1, /Sowjetunion/, 24.1, 56.95)],
  ['Riga liegt 1991 NICHT mehr in der Sowjetunion', !liegtIn(p3, /Sowjetunion/, 24.1, 56.95)],
  ['Riga liegt 1991 im Baltikum', liegtIn(p3, /Estland/, 24.1, 56.95)],
  ['Vilnius liegt 1991 im Baltikum', liegtIn(p3, /Estland/, 25.28, 54.69)],
  ['Tallinn liegt 1991 im Baltikum', liegtIn(p3, /Estland/, 24.75, 59.3)],
  ['Königsberg/Kaliningrad bleibt 1991 sowjetisch', liegtIn(p3, /Sowjetunion/, 20.5, 54.7)],
  ['Paris liegt in der NATO', liegtIn(p1, /NATO in Europa/, 2.35, 48.86)],
  ['Rom liegt in der NATO', liegtIn(p1, /NATO in Europa/, 12.48, 41.9)],
  ['London liegt in der NATO', liegtIn(p1, /NATO in Europa/, -0.13, 51.51)],
  ['Oslo liegt in der NATO', liegtIn(p1, /NATO in Europa/, 10.75, 59.91)],
  ['Kopenhagen liegt in der NATO', liegtIn(p1, /NATO in Europa/, 12.57, 55.68)],
  ['Lissabon liegt in der NATO', liegtIn(p1, /NATO in Europa/, -9.14, 38.71)],
  ['Brüssel liegt in der NATO', liegtIn(p1, /NATO in Europa/, 4.35, 50.85)],
  ['Amsterdam liegt in der NATO', liegtIn(p1, /NATO in Europa/, 4.9, 52.37)],
  ['Athen liegt 1949 NICHT in der NATO', !liegtIn(p1, /NATO in Europa/, 23.73, 37.98)],
  ['Athen liegt 1949 in der Truman-Doktrin-Fläche', liegtIn(p1, /Truman-Doktrin/, 23.73, 37.98)],
  ['Ankara liegt 1949 in der Truman-Doktrin-Fläche', liegtIn(p1, /Truman-Doktrin/, 32.85, 39.93)],
  ['Athen liegt 1961 in der NATO', liegtIn(p2, /NATO in Europa/, 23.73, 37.98)],
  ['Ankara liegt 1961 in der NATO', liegtIn(p2, /NATO in Europa/, 32.85, 39.93)],
  ['Izmir liegt 1961 in der NATO', liegtIn(p2, /NATO in Europa/, 27.14, 38.42)],
  ['Istanbul liegt 1961 in der NATO', liegtIn(p2, /NATO in Europa/, 28.98, 41.02)],
  ['Madrid liegt 1961 NICHT in der NATO', !liegtIn(p2, /NATO in Europa/, -3.7, 40.42)],
  ['Madrid liegt in Spanien', liegtIn(p2, /Spanien/, -3.7, 40.42)],
  ['Lissabon liegt NICHT in Spanien', !liegtIn(p1, /Spanien/, -9.14, 38.71)],
  ['Tirana liegt in Albanien', liegtIn(p2, /Albanien/, 19.82, 41.33)],
  ['Zypern liegt NICHT in der NATO', !liegtIn(p2, /NATO in Europa/, 33.4, 35.17)],
];

let fehler = 0;
for (const [name, ok] of proben) {
  if (!ok) {
    console.log('FEHLT:', name);
    fehler += 1;
  }
}
console.log(fehler === 0 ? `alle ${proben.length} Punktproben in Ordnung` : `${fehler} Proben fehlgeschlagen`);

// --- Atlas-Gegenprobe ------------------------------------------------------
const kuestenpunkte = karte.basis
  .filter((teil) => teil.art === 'land')
  .flatMap((teil) => eckpunkte(teil.d));

const abstandZurKueste = (lon, lat) => {
  const [x, y] = geo.punkt(lon, lat);
  return kuestenpunkte.reduce((n, [kx, ky]) => Math.min(n, Math.hypot(kx - x, ky - y)), Infinity);
};

const landmarken = [
  ['Lissabon', -9.14, 38.71],
  ['Kap Trafalgar', -6.03, 36.18],
  ['Bilbao', -2.93, 43.26],
  ['Brest in der Bretagne', -4.49, 48.39],
  ['Rotterdam', 4.29, 51.92],
  ['Dover', 1.31, 51.13],
  ['der Firth of Forth bei Edinburgh', -3.0, 56.02],
  ['Cork in Irland', -8.47, 51.85],
  ['Kiel-Nähe', 10.3, 54.4],
  ['Malmö', 13.0, 55.6],
  ['die Küste bei Göteborg', 11.9, 57.6],
  ['der Oslofjord bei Moss', 10.66, 59.43],
  ['die Küste bei Nynäshamn', 17.95, 58.9],
  ['Porkkala westlich von Helsinki', 24.4, 60.05],
  ['Danzig-Nähe', 18.8, 54.5],
  ['Riga', 24.3, 56.9],
  ['Tallinn', 24.9, 59.3],
  ['die Newabucht bei Leningrad', 30.1, 59.8],
  ['Venedig', 12.34, 45.44],
  ['Zadar an der dalmatinischen Küste', 15.23, 44.12],
  ['die Küste bei Ulcinj', 19.25, 41.93],
  ['die thessalische Küste bei Larisa', 22.8, 39.7],
  ['Koroni auf der Peloponnes', 21.95, 36.8],
  ['Izmir', 27.14, 38.42],
  ['Alanya an der türkischen Südküste', 32.0, 36.55],
  ['Samsun', 36.2, 41.4],
  ['Nessebar bei Warna', 27.73, 42.66],
  ['Sewastopol auf der Krim', 33.53, 44.62],
  ['Odessa-Nähe', 30.6, 46.4],
  ['Tanger', -5.8, 35.79],
];

let landFehler = 0;
for (const [name, lon, lat] of landmarken) {
  const d = abstandZurKueste(lon, lat);
  if (d >= EINHEITEN_JE_GRAD) {
    console.log(`ZU WEIT: ${name} — ${d.toFixed(1)} Einheiten`);
    landFehler += 1;
  } else if (d <= EINHEITEN_JE_GRAD * 0.1) {
    console.log(`ABGESCHRIEBEN: ${name} — nur ${d.toFixed(2)} Einheiten vom Eckpunkt`);
    landFehler += 1;
  }
}
console.log(landFehler === 0 ? `alle ${landmarken.length} Landmarken in Ordnung` : `${landFehler} Landmarken auffällig`);

const abseits = [
  ['mitten in Frankreich', 2.5, 46.5],
  ['mitten in Deutschland', 10.5, 51.0],
  ['mitten in Böhmen', 14.5, 50.0],
  ['mitten in Ungarn', 19.5, 47.0],
  ['mitten in Russland', 32.0, 55.0],
  ['mitten im offenen Atlantik', -8.0, 47.0],
  ['mitten im offenen Mittelmeer', 6.0, 38.5],
  ['mitten in der Nordsee', 3.0, 55.0],
  ['mitten in Anatolien', 33.0, 39.0],
  ['mitten in Polen', 20.0, 52.0],
  ['in Bayern', 11.5, 48.8],
  ['mitten in Rumänien', 25.0, 45.8],
  ['mitten in Weißrussland', 27.5, 53.5],
  ['mitten in Schweden', 15.0, 59.5],
  ['mitten in Spanien', -4.0, 40.0],
  ['mitten in Serbien', 20.5, 44.0],
];
let abseitsFehler = 0;
for (const [wo, lon, lat] of abseits) {
  const d = abstandZurKueste(lon, lat);
  if (d <= EINHEITEN_JE_GRAD * 2) {
    console.log(`ZU NAH AN EINER KÜSTE: ${wo} — ${d.toFixed(1)} Einheiten`);
    abseitsFehler += 1;
  }
}
console.log(abseitsFehler === 0 ? `alle ${abseits.length} Kontrollpunkte in Ordnung` : `${abseitsFehler} Kontrollpunkte auffällig`);
