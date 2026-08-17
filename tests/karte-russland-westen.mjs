// Prüfungen für die Karte zum Thema „Russland und der Westen" — und für das,
// was das Themen-Modul an der Karte hängen hat.
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe:
// läuft mit blankem `node`.
//
//   1. Vollständigkeit und Aufbau (Phasen, Punkte, Bewegungen, Beschriftungen).
//   2. Atlas-Gegenprobe: Liegen bekannte Küstenorte von Lissabon bis
//      Machatschkala auf der gezeichneten Küste? Und liegt mitten im
//      Binnenland oder auf offener See keine? Die Landmarken liegen bewusst
//      NICHT auf den Eckpunkten des Kartenmoduls — geprüft wird die
//      gezeichnete Linie und nicht die abgeschriebene Zahl (nachrechenbar mit
//      `node tools/pruef-russland-westen.mjs`).
//   3. Die Aussage steckt in der Geometrie: Die NATO wächst über alle drei
//      Zustände, Russland bleibt gleich groß, die von Kyjiw kontrollierte
//      Ukraine schrumpft; die Krim taucht erst 2014 als eigene Fläche auf und
//      trägt beide Angaben im Titel — wer sie kontrolliert und wem sie
//      völkerrechtlich zugerechnet wird.
//   4. Die Bewegungen hängen an den Info-Punkten: die Erweiterungen beginnen
//      in Brüssel, der Angriff von 2022 endet in Kyjiw, die nordische
//      Erweiterung läuft in die Gegenrichtung.
//   5. TONE-REGEL für sensible Themen (CLAUDE.md) und Betreiber-Vorgabe
//      „wirklich objektiv": Die Perspektive muss ihre unbequemen Stellen
//      selbst benennen (Baker-Zusage, Triumphalismus, Schocktherapie, Kosovo,
//      Irak, Bukarest 2008, Nord Stream), sie muss über Russland unter Putin
//      BEIDE Hälften mit Zahlen erzählen — Stabilisierung UND autoritäre
//      Wende —, sie muss die Beweggründe der russischen Seite fair
//      wiedergeben, und sie muss den 24. Februar 2022 beim Namen nennen.
//      Keine Quizfrage darf nach Schuld fragen.
//   6. Der Test ist zustandstolerant: Er ist mit dem Zwischenstand (nur die
//      Sicht des Westens) grün und bleibt es, wenn Hermes weitere Stimmen und
//      die endgültige Synthese ergänzt (Muster der Runden 8–20).
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { pruefeKarte, KARTEN_PUNKT_TYPEN } = require('../utils/themen/schema.js');
const { erstelleProjektion } = require('../utils/karte-geo.js');
const { themaNachId, alleThemen } = require('../utils/themen/index.js');
const { abschnitteFuer } = require('../utils/lernformat.js');

/**
 * Der Kartenausschnitt, wie ihn utils/themen/karten/russland-westen.js
 * aufspannt. Steht hier noch einmal, damit die Atlas-Gegenprobe rechnen kann —
 * dass er stimmt, prüft der Test über die daraus folgende Höhe.
 */
const RAHMEN = { minLon: -10, maxLon: 48, minLat: 34, maxLat: 62, breite: 700 };

/** Wie viele SVG-Einheiten ein Längengrad breit ist — der Maßstab der Probe. */
const EINHEITEN_JE_GRAD = RAHMEN.breite / (RAHMEN.maxLon - RAHMEN.minLon);

/** Die Eckpunkte eines Pfades aus seinem `d`-Attribut. */
function eckpunkte(d) {
  const zahlen = (d.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  const paare = [];
  for (let i = 0; i + 1 < zahlen.length; i += 2) paare.push([zahlen[i], zahlen[i + 1]]);
  return paare.filter((_, i) => i % 3 === 0);
}

/**
 * Die einzelnen geschlossenen Ringe eines Pfades.
 *
 * Auf dieser Karte ist das die Regel und nicht die Ausnahme: Die NATO ist eine
 * Fläche aus über zwanzig Ringen (siehe Kopf der Kartendatei, Punkt 3).
 */
function ringe(d) {
  return d
    .split('M')
    .slice(1)
    .map((teil) => eckpunkte(`M${teil}`));
}

/** Flächeninhalt eines Vielecks (Gaußsche Trapezformel), immer positiv. */
function flaecheninhalt(punkte) {
  let summe = 0;
  for (let i = 0; i < punkte.length; i += 1) {
    const [x1, y1] = punkte[i];
    const [x2, y2] = punkte[(i + 1) % punkte.length];
    summe += x1 * y2 - x2 * y1;
  }
  return Math.abs(summe) / 2;
}

/** Der Flächeninhalt aller Flächen einer Phase, deren Titel passt. */
function groesseVon(phase, muster) {
  return phase.flaechen
    .filter((f) => muster.test(f.titel))
    .reduce((summe, f) => summe + ringe(f.d).reduce((t, r) => t + flaecheninhalt(r), 0), 0);
}

/** Liegt ein Punkt in einem Vieleck? (Strahlensatz-Verfahren) */
function imVieleck([x, y], ring) {
  let drin = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) drin = !drin;
  }
  return drin;
}

/**
 * @param {(name: string, ok: boolean) => void} pruefe Prüf-Funktion des Rahmens
 */
export function laufe(pruefe) {
  const thema = themaNachId('russland-westen');
  pruefe('„Russland und der Westen" ist als Thema registriert', Boolean(thema));
  const karte = thema.karte;
  pruefe('„Russland und der Westen" bringt eine Karte mit', Boolean(karte));

  // --- 1. Aufbau ---------------------------------------------------------
  pruefe('Russland-Westen-Karte: erfüllt das Karten-Schema', pruefeKarte(karte).length === 0);
  pruefe('Russland-Westen-Karte: hat genau 3 Phasen — 1999, 2014, 2022–2024',
    karte.phasen.length === 3);
  pruefe('Russland-Westen-Karte: hat 6 bis 8 Info-Punkte',
    karte.punkte.length >= 6 && karte.punkte.length <= 8);
  pruefe('Russland-Westen-Karte: hat 3 bis 4 Bewegungen',
    karte.bewegungen.length >= 3 && karte.bewegungen.length <= 4);
  pruefe('Russland-Westen-Karte: jeder Punkt-Typ ist ein bekannter',
    karte.punkte.every((punkt) => KARTEN_PUNKT_TYPEN.includes(punkt.typ)));
  pruefe('Russland-Westen-Karte: jeder Info-Punkt hat einen ausgeführten Text',
    karte.punkte.every((punkt) => punkt.text.trim().length > 200));
  pruefe('Russland-Westen-Karte: jede Bewegung hat einen ausgeführten Text',
    karte.bewegungen.every((b) => b.text.trim().length > 200));
  pruefe('Russland-Westen-Karte: jede Phase erklärt sich in einem Hinweis',
    karte.phasen.every((p) => typeof p.hinweis === 'string' && p.hinweis.length > 40));
  pruefe('Russland-Westen-Karte: die Phasen-ids sind eindeutig',
    new Set(karte.phasen.map((p) => p.id)).size === karte.phasen.length);

  const labels = karte.phasen.map((p) => p.label).join(' | ');
  for (const jahr of ['1999', '2014', '2022']) {
    pruefe(`Russland-Westen-Karte: die Jahreszahl ${jahr} steht auf dem Umschalter`,
      labels.includes(jahr));
  }

  const imBild = ([x, y]) => x >= 0 && x <= karte.breite && y >= 0 && y <= karte.hoehe;
  pruefe('Russland-Westen-Karte: alle Info-Punkte liegen im Bild',
    karte.punkte.every((punkt) => imBild([punkt.x, punkt.y])));
  pruefe('Russland-Westen-Karte: alle Bewegungen liegen im Bild',
    karte.bewegungen.every((b) => [b.von, b.nach, ...(b.ueber || [])].every(imBild)));
  pruefe('Russland-Westen-Karte: alle Beschriftungen liegen im Bild',
    (karte.beschriftungen || []).every((b) => imBild([b.x, b.y])));

  // --- 2. Die Erzählung steckt in der Geometrie --------------------------
  const [phase1999, phase2014, phase2022] = karte.phasen;

  // Die NATO wächst dreimal — das ist die Aussage dieses Kapitels als Rechnung.
  const nato = karte.phasen.map((p) => groesseVon(p, /NATO in Europa/));
  pruefe('Russland-Westen-Karte: die NATO steht auf jeder Phase', nato.every((n) => n > 0));
  pruefe('Russland-Westen-Karte: die NATO ist 2014 größer als 1999 (Beitritte 2004 und 2009)',
    nato[1] > nato[0] * 1.05);
  pruefe('Russland-Westen-Karte: die NATO ist 2024 größer als 2014 (Finnland und Schweden)',
    nato[2] > nato[1] * 1.05);

  // Russlands Staatsgebiet ändert sich auf dieser Karte nicht — was sich
  // ändert, sind die Flächen daneben.
  const russland = karte.phasen.map((p) => groesseVon(p, /^Russische Föderation \(\d+\)$/));
  pruefe('Russland-Westen-Karte: Russland steht auf jeder Phase', russland.every((r) => r > 0));
  pruefe('Russland-Westen-Karte: Russlands Fläche bleibt über alle drei Zustände gleich',
    Math.abs(russland[1] - russland[0]) < 0.01 && Math.abs(russland[2] - russland[0]) < 0.01);
  // Die zweite Lage ist Absicht und trägt das im Titel (Kopf der Datei, Punkt 4).
  pruefe('Russland-Westen-Karte: die zweite Lage Russlands erklärt sich im Titel',
    karte.phasen.every((p) => p.flaechen.some((f) => /zweite Lage/.test(f.titel))));

  // Die Ukraine verliert Gebiet — erst die Krim, dann die besetzten Gebiete.
  const ukraine = karte.phasen.map((p) => groesseVon(p, /^Ukraine/));
  pruefe('Russland-Westen-Karte: die Ukraine steht auf jeder Phase', ukraine.every((u) => u > 0));
  pruefe('Russland-Westen-Karte: die Ukraine ist 2014 kleiner als 1999 (die Krim fehlt)',
    ukraine[1] < ukraine[0]);
  pruefe('Russland-Westen-Karte: die Ukraine ist 2024 deutlich kleiner als 2014',
    ukraine[2] < ukraine[1] * 0.95);

  const krim = karte.phasen.map((p) => groesseVon(p, /^Krim —/));
  pruefe('Russland-Westen-Karte: die Krim ist erst ab 2014 eine eigene Fläche',
    krim[0] === 0 && krim[1] > 0 && krim[2] > 0);
  pruefe('Russland-Westen-Karte: die Krim ist 2014 und 2024 gleich groß',
    Math.abs(krim[2] - krim[1]) < 0.01);

  const besetzt = karte.phasen.map((p) => groesseVon(p, /besetzte Gebiete|Separatisten/));
  pruefe('Russland-Westen-Karte: 1999 gibt es keine besetzten Gebiete', besetzt[0] === 0);
  pruefe('Russland-Westen-Karte: das besetzte Gebiet ist 2024 deutlich größer als 2014',
    besetzt[2] > besetzt[1] * 2);

  // Das Baltikum steht 1999 für sich und geht danach in der NATO auf.
  const baltikum = karte.phasen.map((p) => groesseVon(p, /^Estland, Lettland/));
  pruefe('Russland-Westen-Karte: das Baltikum steht nur 1999 als eigene Fläche da',
    baltikum[0] > 0 && baltikum[1] === 0 && baltikum[2] === 0);

  // Belarus und Georgien stehen auf jeder Phase.
  pruefe('Russland-Westen-Karte: Belarus steht auf jeder Phase',
    karte.phasen.every((p) => groesseVon(p, /^Belarus/) > 0));
  pruefe('Russland-Westen-Karte: Georgien steht auf jeder Phase',
    karte.phasen.every((p) => groesseVon(p, /^Georgien/) > 0));

  // Die Titel datieren und bewerten nicht (Kopf der Kartendatei, Punkt 1).
  const titel1999 = phase1999.flaechen.map((f) => f.titel).join(' | ');
  const titel2014 = phase2014.flaechen.map((f) => f.titel).join(' | ');
  const titel2022 = phase2022.flaechen.map((f) => f.titel).join(' | ');
  const alleTitel = `${titel1999} | ${titel2014} | ${titel2022}`;
  pruefe('Russland-Westen-Karte: 1999 nennt die Beitritte vom 12. März 1999',
    titel1999.includes('12. März 1999'));
  pruefe('Russland-Westen-Karte: 2014 nennt die Beitritte von 2004 und 2009',
    titel2014.includes('2004') && titel2014.includes('2009'));
  pruefe('Russland-Westen-Karte: 2024 nennt Finnland 2023 und Schweden 2024',
    titel2022.includes('2023') && titel2022.includes('2024'));
  pruefe('Russland-Westen-Karte: die Krim trägt Kontrolle UND Völkerrechtslage im Titel',
    /annektiert/.test(titel2014) && /völkerrechtlich weiter Ukraine/.test(titel2014));
  pruefe('Russland-Westen-Karte: die Krim nennt die UN-Resolution mit Datum',
    titel2014.includes('68/262') && titel2014.includes('27. März 2014'));
  pruefe('Russland-Westen-Karte: die besetzten Gebiete sind als völkerrechtlich ukrainisch gekennzeichnet',
    /besetzte Gebiete der Ukraine.*völkerrechtlich Ukraine/.test(titel2022));
  pruefe('Russland-Westen-Karte: die Front von 2024 ist im Titel als angenähert gekennzeichnet',
    /angenäherter Stand/.test(titel2022));
  pruefe('Russland-Westen-Karte: keine Fläche heißt „Westen" oder „Feindstaat"',
    !/freie Welt|Feindstaat|Reich des Bösen/i.test(alleTitel));

  // --- 3. Die Festlegungen als Rechnung ----------------------------------
  const geo = erstelleProjektion(RAHMEN);
  pruefe('Russland-Westen-Karte: die Höhe passt zum angenommenen Ausschnitt', geo.hoehe === karte.hoehe);
  pruefe('Russland-Westen-Karte: die Breite passt zum angenommenen Ausschnitt', geo.breite === karte.breite);

  /** Liegt ein geografischer Ort in einer Fläche dieser Phase? */
  const liegtIn = (phase, muster, lon, lat) => {
    const punkt = geo.punkt(lon, lat);
    return phase.flaechen
      .filter((f) => muster.test(f.titel))
      .some((f) => ringe(f.d).some((ring) => imVieleck(punkt, ring)));
  };

  const NATO = /NATO in Europa/;
  const RUS = /^Russische Föderation \(\d+\)$/;

  // Geprüft wird mit Orten im Landesinneren: Küstenstädte liegen auf der
  // gezeichneten Grenzlinie selbst und ergäben Zufallstreffer.
  pruefe('Russland-Westen-Karte: Warschau, Prag und Budapest liegen in jeder Phase in der NATO',
    karte.phasen.every((p) => liegtIn(p, NATO, 21.0, 52.23)) &&
    karte.phasen.every((p) => liegtIn(p, NATO, 14.42, 50.09)) &&
    karte.phasen.every((p) => liegtIn(p, NATO, 19.04, 47.5)));
  pruefe('Russland-Westen-Karte: Berlin, Paris und Madrid liegen in jeder Phase in der NATO',
    karte.phasen.every((p) => liegtIn(p, NATO, 13.4, 52.52)) &&
    karte.phasen.every((p) => liegtIn(p, NATO, 2.35, 48.86)) &&
    karte.phasen.every((p) => liegtIn(p, NATO, -3.7, 40.42)));
  pruefe('Russland-Westen-Karte: Riga, Tallinn und Vilnius liegen 1999 NICHT in der NATO',
    !liegtIn(phase1999, NATO, 24.1, 56.95) && !liegtIn(phase1999, NATO, 24.75, 59.3) &&
    !liegtIn(phase1999, NATO, 25.28, 54.69));
  pruefe('Russland-Westen-Karte: Riga, Tallinn und Vilnius liegen 1999 im eigenständigen Baltikum',
    liegtIn(phase1999, /^Estland, Lettland/, 24.1, 56.95) &&
    liegtIn(phase1999, /^Estland, Lettland/, 24.75, 59.3) &&
    liegtIn(phase1999, /^Estland, Lettland/, 25.28, 54.69));
  pruefe('Russland-Westen-Karte: Riga, Tallinn und Vilnius liegen 2014 und 2024 in der NATO',
    liegtIn(phase2014, NATO, 24.1, 56.95) && liegtIn(phase2022, NATO, 24.1, 56.95) &&
    liegtIn(phase2014, NATO, 24.75, 59.3) && liegtIn(phase2022, NATO, 25.28, 54.69));
  pruefe('Russland-Westen-Karte: Bukarest, Sofia und Bratislava kommen erst 2004 dazu',
    !liegtIn(phase1999, NATO, 26.1, 44.43) && !liegtIn(phase1999, NATO, 23.32, 42.7) &&
    !liegtIn(phase1999, NATO, 17.11, 48.15) &&
    liegtIn(phase2014, NATO, 26.1, 44.43) && liegtIn(phase2014, NATO, 23.32, 42.7) &&
    liegtIn(phase2014, NATO, 17.11, 48.15));
  pruefe('Russland-Westen-Karte: Zagreb und Ljubljana liegen 2014 in der NATO, 1999 nicht',
    !liegtIn(phase1999, NATO, 15.98, 45.81) && liegtIn(phase2014, NATO, 15.98, 45.81) &&
    !liegtIn(phase1999, NATO, 14.5, 46.05) && liegtIn(phase2014, NATO, 14.5, 46.05));
  pruefe('Russland-Westen-Karte: Podgorica und Skopje liegen erst 2024 in der NATO',
    !liegtIn(phase2014, NATO, 19.26, 42.44) && liegtIn(phase2022, NATO, 19.26, 42.44) &&
    !liegtIn(phase2014, NATO, 21.43, 41.99) && liegtIn(phase2022, NATO, 21.43, 41.99));
  // Die Aussage der letzten Phase: Finnland und Schweden. Tampere und Örebro
  // liegen im Binnenland, also nicht auf der gezeichneten Küste.
  pruefe('Russland-Westen-Karte: Tampere und Örebro liegen 1999 und 2014 NICHT in der NATO',
    !liegtIn(phase1999, NATO, 23.76, 61.5) && !liegtIn(phase2014, NATO, 23.76, 61.5) &&
    !liegtIn(phase1999, NATO, 15.21, 59.27) && !liegtIn(phase2014, NATO, 15.21, 59.27));
  pruefe('Russland-Westen-Karte: Tampere und Örebro liegen 2024 in der NATO',
    liegtIn(phase2022, NATO, 23.76, 61.5) && liegtIn(phase2022, NATO, 15.21, 59.27));

  // Wer zu keiner der beiden Seiten gehört, gehört auf dieser Karte zu keiner.
  for (const [name, lon, lat] of [
    ['Wien', 16.37, 48.21],
    ['Bern', 7.45, 46.95],
    ['Dublin', -6.27, 53.35],
    ['Belgrad', 20.46, 44.82],
    ['Sarajevo', 18.41, 43.86],
    ['Chișinău', 28.86, 47.01],
  ]) {
    pruefe(`Russland-Westen-Karte: ${name} liegt in keiner Phase in der NATO`,
      karte.phasen.every((p) => !liegtIn(p, NATO, lon, lat)));
    pruefe(`Russland-Westen-Karte: ${name} liegt in keiner Phase in Russland`,
      karte.phasen.every((p) => !liegtIn(p, RUS, lon, lat)));
  }

  // Russland, Belarus, die Ukraine — und was sich zwischen ihnen verschob.
  pruefe('Russland-Westen-Karte: Moskau und St. Petersburg liegen in jeder Phase in Russland',
    karte.phasen.every((p) => liegtIn(p, RUS, 37.62, 55.75)) &&
    karte.phasen.every((p) => liegtIn(p, RUS, 30.31, 59.94)));
  pruefe('Russland-Westen-Karte: Kaliningrad liegt als Exklave in jeder Phase in Russland',
    karte.phasen.every((p) => liegtIn(p, RUS, 20.5, 54.71)));
  pruefe('Russland-Westen-Karte: Moskau liegt in keiner Phase in der NATO',
    karte.phasen.every((p) => !liegtIn(p, NATO, 37.62, 55.75)));
  pruefe('Russland-Westen-Karte: Minsk liegt in jeder Phase in Belarus und in keiner in der NATO',
    karte.phasen.every((p) => liegtIn(p, /^Belarus/, 27.57, 53.9)) &&
    karte.phasen.every((p) => !liegtIn(p, NATO, 27.57, 53.9)));
  pruefe('Russland-Westen-Karte: Kyjiw liegt in jeder Phase in der Ukraine',
    karte.phasen.every((p) => liegtIn(p, /^Ukraine/, 30.52, 50.45)));
  pruefe('Russland-Westen-Karte: Kyjiw liegt in keiner Phase in Russland oder in der NATO',
    karte.phasen.every((p) => !liegtIn(p, RUS, 30.52, 50.45)) &&
    karte.phasen.every((p) => !liegtIn(p, NATO, 30.52, 50.45)));
  pruefe('Russland-Westen-Karte: Lwiw und Charkiw bleiben in jeder Phase ukrainisch',
    karte.phasen.every((p) => liegtIn(p, /^Ukraine/, 24.03, 49.84)) &&
    karte.phasen.every((p) => liegtIn(p, /^Ukraine/, 36.23, 49.99)));
  pruefe('Russland-Westen-Karte: Simferopol und Sewastopol liegen 1999 in der Ukraine',
    liegtIn(phase1999, /^Ukraine/, 34.1, 44.95) && liegtIn(phase1999, /^Ukraine/, 33.53, 44.62));
  pruefe('Russland-Westen-Karte: Simferopol und Sewastopol liegen ab 2014 auf der Krim-Fläche',
    liegtIn(phase2014, /^Krim —/, 34.1, 44.95) && liegtIn(phase2022, /^Krim —/, 33.53, 44.62));
  pruefe('Russland-Westen-Karte: die Krim gehört ab 2014 nicht mehr zur Ukraine-Fläche',
    !liegtIn(phase2014, /^Ukraine/, 34.1, 44.95) && !liegtIn(phase2022, /^Ukraine/, 33.53, 44.62));
  pruefe('Russland-Westen-Karte: Donezk und Luhansk liegen 2014 im Separatistengebiet',
    liegtIn(phase2014, /Separatisten/, 37.8, 48.0) && liegtIn(phase2014, /Separatisten/, 39.33, 48.57));
  pruefe('Russland-Westen-Karte: Mariupol und Melitopol liegen 2014 noch nicht im Separatistengebiet',
    !liegtIn(phase2014, /Separatisten/, 37.55, 47.1) && !liegtIn(phase2014, /Separatisten/, 35.37, 46.85));
  pruefe('Russland-Westen-Karte: Mariupol und Melitopol liegen 2024 im besetzten Gebiet',
    liegtIn(phase2022, /besetzte Gebiete/, 37.55, 47.1) &&
    liegtIn(phase2022, /besetzte Gebiete/, 35.37, 46.85));
  pruefe('Russland-Westen-Karte: Donezk liegt 2024 nicht mehr im von Kyjiw kontrollierten Teil',
    !liegtIn(phase2022, /^Ukraine/, 37.8, 48.0));
  pruefe('Russland-Westen-Karte: Kramatorsk und Cherson bleiben 2024 im kontrollierten Teil',
    liegtIn(phase2022, /^Ukraine/, 37.55, 48.73) && liegtIn(phase2022, /^Ukraine/, 32.62, 46.63));
  pruefe('Russland-Westen-Karte: Tiflis liegt in jeder Phase in Georgien und in keiner in Russland',
    karte.phasen.every((p) => liegtIn(p, /^Georgien/, 44.79, 41.72)) &&
    karte.phasen.every((p) => !liegtIn(p, RUS, 44.79, 41.72)));
  pruefe('Russland-Westen-Karte: Georgiens Titel nennt ab 2014 den Krieg vom August 2008',
    /August 2008/.test(titel2014) && /August 2008/.test(titel2022) && !/August 2008/.test(titel1999));

  // --- 4. Atlas-Gegenprobe -----------------------------------------------
  const kuestenpunkte = karte.basis
    .filter((teil) => teil.art === 'land')
    .flatMap((teil) => eckpunkte(teil.d));
  pruefe('Russland-Westen-Karte: es gibt Küstenlinien zu prüfen', kuestenpunkte.length > 400);

  /** Abstand einer geografischen Landmarke zur nächsten gezeichneten Küste. */
  const abstandZurKueste = (lon, lat) => {
    const [x, y] = geo.punkt(lon, lat);
    return kuestenpunkte.reduce(
      (naechster, [kx, ky]) => Math.min(naechster, Math.hypot(kx - x, ky - y)),
      Infinity,
    );
  };

  // Toleranz ein voller Längengrad — 12,1 SVG-Einheiten bei diesem Maßstab,
  // wie bei den Karten zum Ersten Weltkrieg und zum Kalten Krieg.
  const TOLERANZ = EINHEITEN_JE_GRAD;
  const landmarken = [
    ['Lissabon', -9.14, 38.71],
    ['Kap Trafalgar', -6.03, 36.18],
    ['Bilbao', -2.93, 43.26],
    ['Brest in der Bretagne', -4.49, 48.39],
    ['Rotterdam', 4.29, 51.92],
    ['Dover', 1.31, 51.13],
    ['der Firth of Forth bei Edinburgh', -3.0, 56.02],
    ['Cork in Irland', -8.47, 51.85],
    ['die Küste bei Kiel', 10.3, 54.4],
    ['Malmö', 13.0, 55.6],
    ['die Küste bei Göteborg', 11.9, 57.6],
    ['der Oslofjord bei Moss', 10.66, 59.43],
    ['die Küste bei Nynäshamn', 17.95, 58.9],
    ['die Küste bei Sundsvall', 17.3, 62.3],
    ['die Küste bei Ålesund', 6.1, 62.4],
    ['die finnische Küste bei Vaasa', 21.4, 62.3],
    ['die Küste westlich von Hanko', 22.7, 59.85],
    ['die Küste bei Kotka', 26.5, 60.42],
    ['die Küste bei Danzig', 18.8, 54.5],
    ['Palanga in Litauen', 21.06, 55.92],
    ['Riga', 24.3, 56.9],
    ['Tallinn', 24.9, 59.3],
    ['die Newabucht bei St. Petersburg', 30.1, 59.8],
    ['Venedig', 12.34, 45.44],
    ['Zadar an der dalmatinischen Küste', 15.23, 44.12],
    ['die Küste bei Ulcinj', 19.25, 41.93],
    ['die thessalische Küste bei Larisa', 22.8, 39.7],
    ['Koroni auf der Peloponnes', 21.95, 36.8],
    ['Izmir', 27.14, 38.42],
    ['Alanya an der türkischen Südküste', 32.0, 36.55],
    ['Samsun', 36.2, 41.4],
    ['Nessebar bei Warna', 27.73, 42.66],
    ['Odessa', 30.6, 46.4],
    ['Jalta auf der Krim', 34.17, 44.5],
    ['die Straße von Kertsch', 36.3, 45.3],
    ['Berdjansk am Asowschen Meer', 36.8, 46.75],
    ['Anapa am Schwarzen Meer', 37.32, 44.9],
    ['die Küste bei Suchumi', 41.02, 42.99],
    ['die Küste bei Batumi', 41.6, 41.65],
    ['die Kaspi-Küste südlich von Derbent', 47.4, 42.4],
    ['die Kaspi-Küste nördlich von Machatschkala', 47.3, 44.3],
    ['die Kaspi-Küste bei Astrachan', 47.9, 45.95],
    ['Tanger', -5.8, 35.79],
  ];
  for (const [name, lon, lat] of landmarken) {
    pruefe(`Russland-Westen-Karte: ${name} liegt auf der gezeichneten Küste`,
      abstandZurKueste(lon, lat) < TOLERANZ);
  }

  // Und die Gegenprobe zur Gegenprobe: Keiner dieser Orte darf zugleich ein
  // Eckpunkt des Kartenmoduls sein, sonst prüft der Test seine eigene Vorlage.
  pruefe('Russland-Westen-Karte: keine Landmarke ist als Eckpunkt abgeschrieben',
    landmarken.every(([, lon, lat]) => abstandZurKueste(lon, lat) > EINHEITEN_JE_GRAD * 0.1));

  // Im Binnenland und auf offener See darf keine Küste liegen, sonst wäre der
  // Test durch schiere Punktdichte immer erfüllt.
  const abseits = [
    ['mitten in Frankreich', 2.5, 46.5],
    ['mitten in Deutschland', 10.5, 51.0],
    ['mitten in Böhmen', 14.5, 50.0],
    ['mitten in Ungarn', 19.5, 47.0],
    ['mitten in Polen', 20.0, 52.0],
    ['mitten in Weißrussland', 27.5, 53.5],
    ['bei Nowgorod', 31.5, 58.0],
    ['bei Smolensk', 33.0, 54.5],
    ['bei Woronesch', 39.0, 51.0],
    ['in der Wolgasteppe', 45.0, 50.0],
    ['mitten in der Ostukraine', 36.0, 49.0],
    ['mitten in Rumänien', 25.0, 45.8],
    ['mitten in Serbien', 20.5, 44.0],
    ['mitten in Anatolien', 33.0, 39.0],
    ['mitten in Spanien', -4.0, 40.0],
    ['mitten in Schweden', 15.0, 59.5],
    ['mitten im offenen Atlantik', -8.0, 47.0],
    ['mitten im offenen Mittelmeer', 6.0, 38.5],
    ['mitten in der Nordsee', 3.0, 55.0],
  ];
  for (const [wo, lon, lat] of abseits) {
    pruefe(`Russland-Westen-Karte: ${wo} liegt keine Küste`,
      abstandZurKueste(lon, lat) > TOLERANZ * 2);
  }

  // --- 5. Der Untergrund ---------------------------------------------------
  pruefe('Russland-Westen-Karte: jede Landmasse ist ein geschlossener Pfad',
    karte.basis.filter((teil) => teil.art === 'land').every((teil) => teil.d.trim().endsWith('Z')));
  pruefe('Russland-Westen-Karte: mindestens zwölf Landmassen und Inseln sind gezeichnet',
    karte.basis.filter((teil) => teil.art === 'land').length >= 12);
  pruefe('Russland-Westen-Karte: mindestens acht Flüsse sind gezeichnet',
    karte.basis.filter((teil) => teil.art === 'fluss').length >= 8);
  const grund = karte.basis[0];
  pruefe('Russland-Westen-Karte: das Meer liegt als Untergrund unter allem',
    grund.art === 'grund' && grund.d.includes(String(karte.breite)));

  // --- 6. Die Info-Punkte --------------------------------------------------
  const punkte = Object.fromEntries(karte.punkte.map((punkt) => [punkt.id, punkt]));
  for (const id of ['moskau', 'kyjiw', 'bruessel', 'sewastopol', 'warschau', 'tiflis', 'helsinki']) {
    pruefe(`Russland-Westen-Karte: „${id}" ist ein Info-Punkt`, Boolean(punkte[id]));
  }
  pruefe('Russland-Westen-Karte: Moskau nennt den Einbruch der neunziger Jahre mit Zahl',
    punkte.moskau.text.includes('40 Prozent') && punkte.moskau.text.includes('1998'));
  pruefe('Russland-Westen-Karte: Moskau kündigt beide Hälften der Putin-Jahre an',
    punkte.moskau.text.includes('Stabilisierung') && punkte.moskau.text.includes('autoritäre Wende'));
  pruefe('Russland-Westen-Karte: Kyjiw nennt das Referendum von 1991 und das Budapester Memorandum',
    punkte.kyjiw.text.includes('90 Prozent') && punkte.kyjiw.text.includes('Budapester Memorandum'));
  pruefe('Russland-Westen-Karte: Kyjiw nennt den 24. Februar 2022',
    punkte.kyjiw.text.includes('24. Februar 2022'));
  pruefe('Russland-Westen-Karte: Brüssel erklärt die offene Tür nach Artikel 10',
    punkte.bruessel.text.includes('Artikel 10') && punkte.bruessel.text.includes('offene Tür'));
  pruefe('Russland-Westen-Karte: Brüssel nennt Grundakte und NATO-Russland-Rat',
    punkte.bruessel.text.includes('Grundakte') && punkte.bruessel.text.includes('NATO-Russland-Rat'));
  pruefe('Russland-Westen-Karte: Brüssel lässt die Streitfrage ausdrücklich offen',
    punkte.bruessel.text.includes('beide Antworten haben ernst zu nehmende Gründe'));
  pruefe('Russland-Westen-Karte: Sewastopol nennt die Flottenverträge und die UN-Abstimmung',
    punkte.sewastopol.text.includes('2042') && punkte.sewastopol.text.includes('100 gegen 11'));
  pruefe('Russland-Westen-Karte: Warschau erklärt die eigenen Gründe für den Beitritt',
    punkte.warschau.text.includes('gewählten Parlaments') && punkte.warschau.text.includes('1939'));
  pruefe('Russland-Westen-Karte: Warschau gibt die russische Sicht daneben fair wieder',
    punkte.warschau.text.includes('Sicherheitslage eines Nachbarn'));
  pruefe('Russland-Westen-Karte: Tiflis gibt den Tagliavini-Bericht in beiden Richtungen wieder',
    punkte.tiflis.text.includes('Tagliavini') &&
    punkte.tiflis.text.includes('nicht zu rechtfertigen') &&
    punkte.tiflis.text.includes('Verhältnismäßige'));
  pruefe('Russland-Westen-Karte: Tiflis nennt den Gipfel von Bukarest 2008',
    punkte.tiflis.text.includes('Bukarest') && punkte.tiflis.text.includes('2008'));
  pruefe('Russland-Westen-Karte: Helsinki nennt die Grenzlänge und den Beitritt 2023',
    punkte.helsinki.text.includes('1 340') && punkte.helsinki.text.includes('4. April 2023'));

  // --- 7. Die Bewegungen ----------------------------------------------------
  const bewegung = Object.fromEntries(karte.bewegungen.map((b) => [b.id, b]));
  for (const id of ['erweiterung-1999', 'erweiterung-2004', 'angriff-2022', 'nordische-erweiterung']) {
    pruefe(`Russland-Westen-Karte: die Bewegung „${id}" ist da`, Boolean(bewegung[id]));
  }
  const beiPunkt = (paar, id) =>
    Math.hypot(paar[0] - punkte[id].x, paar[1] - punkte[id].y) < 1;

  pruefe('Russland-Westen-Karte: die Erweiterung 1999 beginnt in Brüssel und endet in Warschau',
    beiPunkt(bewegung['erweiterung-1999'].von, 'bruessel') &&
    beiPunkt(bewegung['erweiterung-1999'].nach, 'warschau'));
  pruefe('Russland-Westen-Karte: die Erweiterung 1999 läuft nach Osten',
    bewegung['erweiterung-1999'].nach[0] > bewegung['erweiterung-1999'].von[0]);
  pruefe('Russland-Westen-Karte: die Erweiterung 1999 benennt die eigene Entscheidung der Beitretenden',
    bewegung['erweiterung-1999'].text.includes('selbst beantragt'));
  pruefe('Russland-Westen-Karte: die Erweiterung 1999 gibt auch die russische Lesart wieder',
    bewegung['erweiterung-1999'].text.includes('aus russischer Sicht'));

  pruefe('Russland-Westen-Karte: die Erweiterung 2004 beginnt in Brüssel und läuft nach Osten',
    beiPunkt(bewegung['erweiterung-2004'].von, 'bruessel') &&
    bewegung['erweiterung-2004'].nach[0] > bewegung['erweiterung-2004'].von[0]);
  pruefe('Russland-Westen-Karte: die Erweiterung 2004 nennt das Datum und die Landgrenze',
    bewegung['erweiterung-2004'].text.includes('29. März 2004') &&
    bewegung['erweiterung-2004'].text.includes('Landgrenze'));

  pruefe('Russland-Westen-Karte: der Angriff von 2022 endet in Kyjiw',
    beiPunkt(bewegung['angriff-2022'].nach, 'kyjiw'));
  pruefe('Russland-Westen-Karte: der Angriff von 2022 läuft von Norden nach Süden',
    bewegung['angriff-2022'].nach[1] > bewegung['angriff-2022'].von[1]);
  pruefe('Russland-Westen-Karte: der Angriff von 2022 wird beim Namen genannt',
    bewegung['angriff-2022'].text.includes('groß angelegte russische Angriff'));
  pruefe('Russland-Westen-Karte: der Angriff von 2022 nennt die UN-Abstimmung vom 2. März',
    bewegung['angriff-2022'].text.includes('141 gegen 5'));

  pruefe('Russland-Westen-Karte: die nordische Erweiterung beginnt in Helsinki und endet in Brüssel',
    beiPunkt(bewegung['nordische-erweiterung'].von, 'helsinki') &&
    beiPunkt(bewegung['nordische-erweiterung'].nach, 'bruessel'));
  pruefe('Russland-Westen-Karte: die nordische Erweiterung läuft nach Westen — in die Gegenrichtung',
    bewegung['nordische-erweiterung'].nach[0] < bewegung['nordische-erweiterung'].von[0]);
  pruefe('Russland-Westen-Karte: die nordische Erweiterung nennt beide Beitrittsdaten',
    bewegung['nordische-erweiterung'].text.includes('4. April 2023') &&
    bewegung['nordische-erweiterung'].text.includes('7. März 2024'));

  // --- 8. Beschriftungen -----------------------------------------------------
  const beschriftungen = karte.beschriftungen || [];
  const texte = beschriftungen.map((b) => b.text);
  for (const name of [
    'Atlantik', 'Nordsee', 'Ostsee', 'Mittelmeer', 'Schwarzes Meer',
    'Kaspisches Meer', 'NATO', 'Russland', 'Ukraine', 'Belarus',
  ]) {
    pruefe(`Russland-Westen-Karte: „${name}" ist beschriftet`, texte.includes(name));
  }
  pruefe('Russland-Westen-Karte: es gibt Beschriftungen für Land und Meer',
    beschriftungen.some((b) => b.art === 'land') && beschriftungen.some((b) => b.art === 'meer'));

  // --- 9. Zusammenspiel mit dem Lernformat -----------------------------------
  pruefe('Lernformat: „Russland und der Westen" zeigt den Karten-Abschnitt',
    abschnitteFuer(thema).some((a) => a.id === 'karte'));
  pruefe('Lernformat: der Karten-Abschnitt steht direkt hinter dem Aufhänger',
    abschnitteFuer(thema).findIndex((a) => a.id === 'karte') === 1);

  // --- 10. Das Modul selbst -------------------------------------------------
  // Runde 21 legt nur die Sicht des Westens an (Opus); die Sicht Russlands
  // ergänzt Hermes danach, möglicherweise mit einer dritten Stimme. Der
  // generische Schema-Test in tests/themen.mjs nimmt alle Perspektiven
  // automatisch mit — hier steht nur, was für dieses Thema besonders gilt.
  const westen = thema.perspektiven.find((p) => p.id === 'westen-sicht');
  /**
   * Die Perspektive als Fließtext — Zeilenumbrüche zu einfachen Leerzeichen.
   *
   * Die Texte in utils/themen/ sind als Zeilen-Array notiert und mit \n
   * zusammengesetzt; ein gesuchter Begriff kann also mitten im Umbruch
   * stehen („Charta von\nParis"). Geprüft wird deshalb der Fließtext — an
   * der Frage, ob ein Wort im Text vorkommt, ändert das nichts.
   */
  const fliesstext = westen.text.replace(/\s+/g, ' ');
  pruefe('„Russland und der Westen": die Sicht des Westens ist da und stammt von Opus',
    Boolean(westen) && westen.stimme === 'Opus');
  pruefe('„Russland und der Westen": die Perspektive nennt sich gleichwertig zu den anderen Stimmen',
    fliesstext.includes('gleichwertig'));
  pruefe('„Russland und der Westen": die Reihenfolge wird ausdrücklich nicht als Rangfolge ausgegeben',
    fliesstext.includes('keine Rangfolge'));
  pruefe('„Russland und der Westen": die Perspektive öffnet die Tür zu den weiteren Stimmen',
    fliesstext.includes('Sicht Russlands') && fliesstext.includes('Hermes'));
  pruefe('„Russland und der Westen": die Perspektive sagt selbst, dass sie über eine laufende Geschichte schreibt',
    fliesstext.includes('nicht abgeschlossen') && fliesstext.includes('selbst Partei'));

  // Die Stationen des Kapitels (Betreiber-Vorgaben, notizen/kapitel-planung.md).
  for (const stichwort of [
    'Charta von Paris', 'Partnerschaft für den Frieden', 'NATO-Russland-Grundakte',
    'NATO-Russland-Rat', 'Schocktherapie', 'Oligarchen', '17. August 1998',
    'Tschetschenien', 'Grosny', 'James Baker', 'not one inch eastward',
    'Genscher', 'National Security Archive', 'Zwei-plus-Vier-Vertrag',
    'Artikel 6', 'Gorbatschow', '12. März 1999', '29. März 2004',
    'George F. Kennan', 'William Burns', 'Bukarest', 'Ölpreis',
    'Chodorkowski', 'Politkowskaja', 'Litwinenko', 'Nemzow', 'Nawalny',
    'ausländische Agenten', 'Tagliavini', 'Krim', 'MH17', 'Minsk',
    '24. Februar 2022', 'Butscha', 'Internationale', 'Finnland', 'Schweden',
    'Kosovo', 'Irak', 'Libyen', 'Nord Stream', 'Münchner Sicherheitskonferenz',
    'Sanktionen',
  ]) {
    pruefe(`„Russland und der Westen": die Perspektive erzählt von „${stichwort}"`,
      fliesstext.includes(stichwort));
  }

  // Die NATO-Osterweiterung ist nach Betreiber-Vorgabe das Herzstück — mit
  // beiden Sichtweisen fair nebeneinander.
  pruefe('„Russland und der Westen": die Osterweiterung hat einen eigenen Abschnitt',
    fliesstext.includes('## Das Herzstück: die NATO-Osterweiterung'));
  pruefe('„Russland und der Westen": die vier Fragen zur Osterweiterung werden alle gestellt',
    fliesstext.includes('Was wurde 1990 gesagt?') &&
    fliesstext.includes('Wurde daraus ein Vertrag?') &&
    fliesstext.includes('Warum kamen die neuen Mitglieder trotzdem?') &&
    fliesstext.includes('Was hat der Westen dabei falsch gemacht?'));
  pruefe('„Russland und der Westen": die Baker-Zusage wird mit Datum und Wortlaut genannt',
    fliesstext.includes('9. Februar 1990') && fliesstext.includes('keinen Zoll nach Osten'));
  pruefe('„Russland und der Westen": es steht ausdrücklich da, dass daraus kein Vertrag wurde',
    fliesstext.includes('Es gibt kein Dokument, in dem sich die NATO verpflichtet'));
  pruefe('„Russland und der Westen": Artikel 6 des 2+4-Vertrags wird im Wortlaut zitiert',
    fliesstext.includes('Bündnissen mit allen sich daraus ergebenden'));
  pruefe('„Russland und der Westen": Gorbatschows spätere Aussage wird in beiden Hälften wiedergegeben',
    fliesstext.includes('überhaupt') && fliesstext.includes('nicht verhandelt worden') &&
    fliesstext.includes('Geist'));
  pruefe('„Russland und der Westen": die russische Sicht auf die Erweiterung steht in der Perspektive selbst',
    fliesstext.includes('### Und die russische Sicht?'));
  pruefe('„Russland und der Westen": die russische Wahrnehmung wird nicht für erfunden erklärt',
    fliesstext.includes('keine Propagandaerfindung'));
  pruefe('„Russland und der Westen": das Recht der freien Bündniswahl wird belegt',
    fliesstext.includes('Bündnisse frei zu wählen') && fliesstext.includes('Charta von Istanbul'));

  // Betreiber-Vorgabe „WIRKLICH OBJEKTIV": beide Hälften der Putin-Jahre, mit
  // Zahlen, nebeneinander — ohne Dämonisierung und ohne Beschönigung.
  pruefe('„Russland und der Westen": der Abschnitt über Putin kündigt beide Hälften an',
    fliesstext.includes('## Russland unter Putin — beide Hälften, mit Zahlen'));
  pruefe('„Russland und der Westen": die Stabilisierung steht mit Zahlen da',
    fliesstext.includes('sieben') && fliesstext.includes('Realeinkommen') &&
    fliesstext.includes('Armutsquote'));
  pruefe('„Russland und der Westen": der Ölpreis wird als Ursache eingeordnet',
    fliesstext.includes('12 Dollar') && fliesstext.includes('140'));
  pruefe('„Russland und der Westen": die autoritäre Wende steht mit Namen und Daten da',
    fliesstext.includes('7. Oktober 2006') && fliesstext.includes('27. Februar 2015') &&
    fliesstext.includes('16. Februar') && fliesstext.includes('2036'));
  pruefe('„Russland und der Westen": beide Listen werden ausdrücklich nicht gegeneinander aufgerechnet',
    fliesstext.includes('keine hebt die andere'));
  pruefe('„Russland und der Westen": die Perspektive warnt vor beiden Einseitigkeiten',
    fliesstext.includes('erzählt Werbung') && fliesstext.includes('erzählt eine Karikatur'));

  // Der Krieg wird beim Namen genannt (Betreiber-Vorgabe).
  pruefe('„Russland und der Westen": der 24. Februar 2022 heißt Angriffskrieg, nicht Konflikt',
    fliesstext.includes('groß angelegten Angriffskrieg') &&
    fliesstext.includes('nicht „Konflikt" zu sagen'));
  pruefe('„Russland und der Westen": die UN-Abstimmung vom 2. März 2022 wird genannt',
    fliesstext.includes('2. März 2022') && fliesstext.includes('141 gegen 5'));

  // TONE-REGEL: Die eigene Erzählung benennt ihre unbequemen Stellen selbst.
  pruefe('„Russland und der Westen": die Perspektive benennt den eigenen Anteil an der Schocktherapie',
    fliesstext.includes('beraten und') && fliesstext.includes('10,2 Milliarden'));
  pruefe('„Russland und der Westen": die Perspektive benennt den Triumphalismus selbst',
    fliesstext.includes('Triumphalismus') && fliesstext.includes('Ende der Geschichte'));
  pruefe('„Russland und der Westen": die Perspektive benennt die Doppeldeutigkeit von 1990',
    fliesstext.includes('Doppeldeutigkeit von 1990'));
  pruefe('„Russland und der Westen": die Perspektive benennt die überhörten eigenen Warnungen',
    fliesstext.includes('verhängnisvollsten Fehler') && fliesstext.includes('Njet heißt njet'));
  pruefe('„Russland und der Westen": die Perspektive benennt Bukarest 2008 als eigenen Fehler',
    fliesstext.includes('schlechteste aller'));
  pruefe('„Russland und der Westen": die Perspektive misst sich am eigenen Maßstab',
    fliesstext.includes('## Die unbequemste Stelle: das eigene Maß'));
  pruefe('„Russland und der Westen": Kosovo und Irak werden als eigene Verstöße benannt',
    fliesstext.includes('ohne') && fliesstext.includes('Mandat des UN-Sicherheitsrats') &&
    fliesstext.includes('als falsch'));
  pruefe('„Russland und der Westen": die Perspektive benennt Nord Stream und „Wandel durch Handel"',
    fliesstext.includes('Wandel durch Handel') && fliesstext.includes('Warnungen Polens'));
  pruefe('„Russland und der Westen": die Perspektive benennt, dass Putins Rede von 2007 überhört wurde',
    fliesstext.includes('Es war eine Ankündigung'));
  pruefe('„Russland und der Westen": die Perspektive benennt die Kritik des globalen Südens an den Sanktionen',
    fliesstext.includes('nicht unbegründet'));
  pruefe('„Russland und der Westen": die Perspektive benennt ihren eigenen blinden Fleck',
    fliesstext.includes('## Was diese Sicht nicht sehen kann') &&
    fliesstext.includes('blinde Fleck'));

  // Und sie gibt die Gegenseite fair wieder, ohne sie zu rechtfertigen.
  pruefe('„Russland und der Westen": die russischen Beweggründe werden nachvollziehbar gemacht',
    fliesstext.includes('warum in Russland später Ordnung mehr galt als Freiheit'));
  pruefe('„Russland und der Westen": fair und gerechtfertigt werden ausdrücklich unterschieden',
    fliesstext.includes('Fair wiedergeben heißt nachvollziehbar machen, nicht rechtfertigen'));
  pruefe('„Russland und der Westen": der Tagliavini-Befund wird auch gegen die eigene Erzählung wiedergegeben',
    fliesstext.includes('auch wenn seine erste Hälfte der westlichen Erzählung widerspricht'));
  pruefe('„Russland und der Westen": die frühen Jahre der Zusammenarbeit werden nicht unterschlagen',
    fliesstext.includes('erste ausländische') && fliesstext.includes('Deutschen Bundestag'));

  // Solange nur eine Stimme dasteht, muss die Synthese das sagen. Die Prüfung
  // ist zustandstolerant: Sie akzeptiert den Zwischenstand ebenso wie die
  // spätere Fassung, die die Stimmen zusammenführt (Muster der Runden 8–20).
  const weitereStimme = thema.perspektiven.find((p) => p.stimme !== 'Opus');
  if (!weitereStimme) {
    pruefe('„Russland und der Westen": die Synthese sagt offen, dass eine Sicht noch fehlt',
      thema.synthese.includes('fehlt noch') && thema.synthese.includes('Sicht Russlands'));
    pruefe('„Russland und der Westen": die Synthese benennt schon jetzt die Bruchstellen',
      thema.synthese.includes('Bruchstellen'));
  } else {
    pruefe('„Russland und der Westen": die Synthese führt die Sichtweisen zusammen',
      /Westen/.test(thema.synthese) && /Russland|Ukraine/.test(thema.synthese));
  }
  pruefe('„Russland und der Westen": die Synthese hält fest, dass die App nicht aufrechnet',
    thema.synthese.includes('rechnet nicht auf'));

  pruefe('„Russland und der Westen" hat 5 Quizfragen', thema.quiz.length === 5);
  pruefe('„Russland und der Westen": jede Quizfrage hat eine gültige richtige Antwort',
    thema.quiz.every((f) => typeof f.antworten[f.richtig] === 'string'));
  pruefe('„Russland und der Westen": jede Quizfrage wird erklärt',
    thema.quiz.every((f) => f.erklaerung.trim().length > 40));
  // Die Quizfragen bleiben Wissensfragen: keine Schuldfrage — auch das Wort
  // selbst darf im Quiz nicht vorkommen (Zusatzregel für sensible Themen).
  const quizText = thema.quiz.map((f) => `${f.frage} ${f.antworten.join(' ')} ${f.erklaerung}`).join(' ');
  pruefe('„Russland und der Westen": keine Quizfrage (und keine Erklärung) nennt das Wort „Schuld"',
    !/[Ss]chuld/.test(quizText));
  pruefe('„Russland und der Westen": das Quiz fragt nach der Baker-Zusage und nach Artikel 6',
    quizText.includes('keinen Zoll nach Osten') && quizText.includes('Artikel 6'));
  pruefe('„Russland und der Westen": das Quiz fragt nach beiden Hälften der russischen Wirtschaft',
    quizText.includes('40 Prozent') && quizText.includes('sieben Prozent'));
  pruefe('„Russland und der Westen": das Urteil ist offen gestellt', thema.urteil.frage.includes('?'));
  pruefe('„Russland und der Westen": das Urteil fragt nicht nach Schuld',
    !/[Ss]chuld/.test(thema.urteil.frage));
  pruefe('„Russland und der Westen": das Urteil bekommt einen Denkanstoß mit beiden Seiten',
    typeof thema.urteil.hinweis === 'string' && thema.urteil.hinweis.length > 40 &&
    thema.urteil.hinweis.includes('Die einen sagen') && thema.urteil.hinweis.includes('Die anderen sagen'));

  pruefe('„Russland und der Westen" steht als Modul 19 hinter dem Kalten Krieg',
    alleThemen[18] === thema && alleThemen[17].id === 'kalter-krieg');
}
