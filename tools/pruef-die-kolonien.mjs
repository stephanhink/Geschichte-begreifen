// Wegwerf-Werkzeug: Wo könnten sich auf der Karte zum Thema „Die Kolonien"
// Beschriftungen überlappen?
//
// NICHT Teil von `npm test` — die Frage, ob eine Schrift auf einem Handy
// wirklich stört, entscheidet das Gerät und nicht die Rechnung. Das Skript
// schätzt nur die Kästen ab, in denen Text steht, und meldet Überschneidungen.
// Aufruf: `node tools/pruef-die-kolonien.mjs`
//
// Die Maße stammen aus components/abschnitte/KarteAbschnitt.js: Landnamen
// 20 Einheiten hoch und mittig gesetzt, Meeresnamen 19, Ortsnamen 18 und
// linksbündig 11 Einheiten rechts neben dem Punkt.
//
// Anders als die älteren Skripte dieser Art rechnet dieses die Drehung mit:
// Ein um mehr als 45 Grad gedrehter Name (Rotes Meer, Kaspisches Meer, Nil,
// Namib) steht hochkant und ist dann schmal, nicht breit. Ohne diese
// Unterscheidung meldet die Abschätzung auf einer so weiten Karte lauter
// Überlappungen, die es gar nicht gibt.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const karte = require('../utils/themen/karten/die-kolonien.js');

/** Grobe Breite eines Zeichens im Verhältnis zur Schriftgröße. */
const ZEICHENBREITE = 0.55;

/** Die Kästen aller Beschriftungen und Ortsnamen. */
const kaesten = [];

for (const b of karte.beschriftungen || []) {
  const groesse = b.art === 'meer' ? 19 : 20;
  const laenge = b.text.length * groesse * ZEICHENBREITE;
  // Hochkant gedreht: Länge und Höhe tauschen die Rolle.
  const hochkant = Math.abs(b.drehung || 0) > 45;
  const breite = hochkant ? groesse : laenge;
  const hoehe = hochkant ? laenge : groesse;
  kaesten.push({
    name: `Beschriftung „${b.text}"`,
    x1: b.x - breite / 2,
    x2: b.x + breite / 2,
    y1: b.y - hoehe * 0.55,
    y2: b.y + hoehe * 0.55,
  });
}

for (const punkt of karte.punkte) {
  const breite = punkt.name.length * 18 * ZEICHENBREITE;
  kaesten.push({
    name: `Ortsname „${punkt.name}"`,
    x1: punkt.x - 8,
    x2: punkt.x + 11 + breite,
    y1: punkt.y - 8,
    y2: punkt.y + 12,
  });
}

const ueberlappt = (a, b) => a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2;

let treffer = 0;
for (let i = 0; i < kaesten.length; i += 1) {
  for (let j = i + 1; j < kaesten.length; j += 1) {
    if (ueberlappt(kaesten[i], kaesten[j])) {
      treffer += 1;
      console.log(`mögliche Überlappung: ${kaesten[i].name} / ${kaesten[j].name}`);
    }
  }
}

const ausserhalb = kaesten.filter((k) => k.x1 < 0 || k.x2 > karte.breite);
for (const k of ausserhalb) {
  console.log(`ragt über den Bildrand hinaus: ${k.name} (${k.x1.toFixed(0)}…${k.x2.toFixed(0)})`);
}

console.log(
  `\n${kaesten.length} Beschriftungen geprüft, ${treffer} mögliche Überlappung(en), ` +
    `${ausserhalb.length} über dem Rand.`,
);
