// Prüfungen für die Karte zum Thema „Die neue Weltordnung und der Kalte
// Krieg" — und für das, was das Themen-Modul an der Karte hängen hat.
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe:
// läuft mit blankem `node`.
//
//   1. Vollständigkeit und Aufbau (Phasen, Punkte, Bewegungen, Beschriftungen).
//   2. Atlas-Gegenprobe: Liegen bekannte Küstenorte von Lissabon bis Leningrad
//      auf der gezeichneten Küste? Und liegt mitten im Binnenland oder auf
//      offener See keine? Die Landmarken liegen bewusst NICHT auf den
//      Eckpunkten des Kartenmoduls — geprüft wird die gezeichnete Linie und
//      nicht die abgeschriebene Zahl (nachrechenbar mit
//      `node tools/pruef-kalter-krieg.mjs`).
//   3. Die Aussage steckt in der Geometrie: Zwei deutsche Staaten stehen 1949
//      und 1961 auf der Karte und 1990 einer, dessen Fläche genau ihrer Summe
//      entspricht; West-Berlin verschwindet als eigene Fläche; die NATO wächst
//      1949→1961 um Griechenland und die Türkei; einen „Warschauer Pakt" gibt
//      es 1949 noch nicht; das Baltikum taucht erst 1991 auf.
//   4. Die Bewegungen hängen an den Info-Punkten: die Luftbrücke endet in
//      Berlin, der Weg über Ungarn beginnt in Budapest, der Truppenabzug
//      endet in Moskau.
//   5. TONE-REGEL für sensible Themen (CLAUDE.md): Die Perspektive muss ihre
//      unbequemen Stellen selbst benennen (McCarthy-Ära, Vietnam, die
//      Unterstützung von Diktaturen, der Rüstungswettlauf), die Beweggründe
//      der anderen Seite fair wiedergeben (die sowjetische Einkreisungsangst)
//      — und keine Quizfrage darf nach Schuld fragen.
//   6. Der Zwei-plus-Vier-Vertrag steht nach Betreiber-Vorgabe prominent im
//      Text, mit seiner Bedeutung und der Frage, ob er eingehalten wurde.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { pruefeKarte, KARTEN_PUNKT_TYPEN } = require('../utils/themen/schema.js');
const { erstelleProjektion } = require('../utils/karte-geo.js');
const { themaNachId, alleThemen } = require('../utils/themen/index.js');
const { abschnitteFuer } = require('../utils/lernformat.js');

/**
 * Der Kartenausschnitt, wie ihn utils/themen/karten/kalter-krieg.js aufspannt.
 * Steht hier noch einmal, damit die Atlas-Gegenprobe rechnen kann — dass er
 * stimmt, prüft der Test über die daraus folgende Höhe.
 */
const RAHMEN = { minLon: -10, maxLon: 45, minLat: 34, maxLat: 61, breite: 700 };

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
 * Auf dieser Karte ist das die Regel und nicht die Ausnahme: Ein Block ist
 * eine Fläche aus einem Dutzend Ringen (siehe Kopf der Kartendatei, Punkt 3).
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
  const thema = themaNachId('kalter-krieg');
  pruefe('„Die neue Weltordnung und der Kalte Krieg" ist als Thema registriert', Boolean(thema));
  const karte = thema.karte;
  pruefe('„Die neue Weltordnung und der Kalte Krieg" bringt eine Karte mit', Boolean(karte));

  // --- 1. Aufbau ---------------------------------------------------------
  pruefe('Kalter-Krieg-Karte: erfüllt das Karten-Schema', pruefeKarte(karte).length === 0);
  pruefe('Kalter-Krieg-Karte: hat mindestens 3 Phasen', karte.phasen.length >= 3);
  pruefe('Kalter-Krieg-Karte: hat genau 3 Phasen — 1949, 1961/62, 1989–1991', karte.phasen.length === 3);
  pruefe('Kalter-Krieg-Karte: hat 6 bis 7 Info-Punkte',
    karte.punkte.length >= 6 && karte.punkte.length <= 7);
  pruefe('Kalter-Krieg-Karte: hat 2 bis 4 Bewegungen',
    karte.bewegungen.length >= 2 && karte.bewegungen.length <= 4);
  pruefe('Kalter-Krieg-Karte: jeder Punkt-Typ ist ein bekannter',
    karte.punkte.every((punkt) => KARTEN_PUNKT_TYPEN.includes(punkt.typ)));
  pruefe('Kalter-Krieg-Karte: jeder Info-Punkt hat einen ausgeführten Text',
    karte.punkte.every((punkt) => punkt.text.trim().length > 200));
  pruefe('Kalter-Krieg-Karte: jede Bewegung hat einen ausgeführten Text',
    karte.bewegungen.every((b) => b.text.trim().length > 200));
  pruefe('Kalter-Krieg-Karte: jede Phase erklärt sich in einem Hinweis',
    karte.phasen.every((p) => typeof p.hinweis === 'string' && p.hinweis.length > 40));
  pruefe('Kalter-Krieg-Karte: die Phasen-ids sind eindeutig',
    new Set(karte.phasen.map((p) => p.id)).size === karte.phasen.length);

  const labels = karte.phasen.map((p) => p.label).join(' | ');
  for (const jahr of ['1949', '1961', '1989', '1991']) {
    pruefe(`Kalter-Krieg-Karte: die Jahreszahl ${jahr} steht auf dem Umschalter`, labels.includes(jahr));
  }

  const imBild = ([x, y]) => x >= 0 && x <= karte.breite && y >= 0 && y <= karte.hoehe;
  pruefe('Kalter-Krieg-Karte: alle Info-Punkte liegen im Bild',
    karte.punkte.every((punkt) => imBild([punkt.x, punkt.y])));
  pruefe('Kalter-Krieg-Karte: alle Bewegungen liegen im Bild',
    karte.bewegungen.every((b) => [b.von, b.nach, ...(b.ueber || [])].every(imBild)));
  pruefe('Kalter-Krieg-Karte: alle Beschriftungen liegen im Bild',
    (karte.beschriftungen || []).every((b) => imBild([b.x, b.y])));

  // --- 2. Die Erzählung steckt in der Geometrie --------------------------
  const [phase1949, phase1961, phase1990] = karte.phasen;

  const brd = karte.phasen.map((p) => groesseVon(p, /Bundesrepublik/));
  const ddr = karte.phasen.map((p) => groesseVon(p, /Demokratische Republik/));
  const vereint = karte.phasen.map((p) => groesseVon(p, /^Deutschland —/));

  pruefe('Kalter-Krieg-Karte: 1949 und 1961 stehen zwei deutsche Staaten auf der Karte',
    brd[0] > 0 && brd[1] > 0 && ddr[0] > 0 && ddr[1] > 0);
  pruefe('Kalter-Krieg-Karte: die beiden deutschen Staaten sind 1949 und 1961 gleich groß (die Grenze änderte sich nicht)',
    Math.abs(brd[1] - brd[0]) < 0.01 && Math.abs(ddr[1] - ddr[0]) < 0.01);
  pruefe('Kalter-Krieg-Karte: die Bundesrepublik ist größer als die DDR', brd[0] > ddr[0]);
  pruefe('Kalter-Krieg-Karte: 1990 gibt es keine zwei deutschen Staaten mehr',
    brd[2] === 0 && ddr[2] === 0);
  pruefe('Kalter-Krieg-Karte: das vereinte Deutschland steht nur auf der letzten Phase',
    vereint[0] === 0 && vereint[1] === 0 && vereint[2] > 0);
  // Die Aussage des 3. Oktober 1990 als Rechnung: Das vereinte Deutschland ist
  // genau die Summe der beiden Staaten, die es vorher gab — nicht mehr.
  pruefe('Kalter-Krieg-Karte: das vereinte Deutschland ist so groß wie Bundesrepublik und DDR zusammen',
    Math.abs(vereint[2] - (brd[0] + ddr[0])) < (brd[0] + ddr[0]) * 0.02);

  // Berlin: zwei Flächen, solange die Stadt geteilt ist — danach eine.
  const westBerlin = karte.phasen.map((p) => groesseVon(p, /West-Berlin/));
  const ostBerlin = karte.phasen.map((p) => groesseVon(p, /Ost-Berlin/));
  const berlinGanz = karte.phasen.map((p) => groesseVon(p, /^Berlin —/));
  pruefe('Kalter-Krieg-Karte: West-Berlin ist 1949 und 1961 eine eigene Fläche',
    westBerlin[0] > 0 && westBerlin[1] > 0);
  pruefe('Kalter-Krieg-Karte: Ost-Berlin ist 1949 und 1961 eine eigene Fläche',
    ostBerlin[0] > 0 && ostBerlin[1] > 0);
  pruefe('Kalter-Krieg-Karte: 1990 ist Berlin nur noch eine Fläche',
    westBerlin[2] === 0 && ostBerlin[2] === 0 && berlinGanz[2] > 0);
  pruefe('Kalter-Krieg-Karte: das ganze Berlin ist so groß wie seine beiden Hälften zusammen',
    Math.abs(berlinGanz[2] - (westBerlin[0] + ostBerlin[0])) < berlinGanz[2] * 0.05);

  // Die NATO wächst 1952 um Griechenland und die Türkei und bleibt danach gleich.
  const nato = karte.phasen.map((p) => groesseVon(p, /NATO in Europa/));
  pruefe('Kalter-Krieg-Karte: die NATO steht auf jeder Phase', nato.every((n) => n > 0));
  pruefe('Kalter-Krieg-Karte: die NATO ist 1961 deutlich größer als 1949 (Griechenland und die Türkei)',
    nato[1] > nato[0] * 1.2);
  pruefe('Kalter-Krieg-Karte: die NATO-Fläche bleibt 1961 und 1991 gleich groß',
    Math.abs(nato[2] - nato[1]) < nato[1] * 0.01);

  // Den Warschauer Pakt gab es 1949 noch nicht — deshalb heißt 1949 keine
  // Fläche so, und 1991 trägt sie das Wort „aufgelöst".
  const titel1949 = phase1949.flaechen.map((f) => f.titel).join(' | ');
  const titel1961 = phase1961.flaechen.map((f) => f.titel).join(' | ');
  const titel1990 = phase1990.flaechen.map((f) => f.titel).join(' | ');
  pruefe('Kalter-Krieg-Karte: 1949 trägt keine Fläche den Namen „Warschauer Pakt"',
    !titel1949.includes('Warschauer Pakt'));
  pruefe('Kalter-Krieg-Karte: 1949 heißt der Osten „Im sowjetischen Einflussbereich"',
    titel1949.includes('Im sowjetischen Einflussbereich'));
  pruefe('Kalter-Krieg-Karte: 1961 gibt es den Warschauer Pakt mit seinem Gründungsdatum',
    titel1961.includes('Warschauer Pakt') && titel1961.includes('14. Mai 1955'));
  pruefe('Kalter-Krieg-Karte: 1991 ist der Warschauer Pakt als aufgelöst gekennzeichnet',
    titel1990.includes('aufgelöst am 1. Juli 1991'));
  pruefe('Kalter-Krieg-Karte: 1991 trägt die Sowjetunion ihr Enddatum im Titel',
    titel1990.includes('aufgelöst am 25. Dezember 1991'));
  pruefe('Kalter-Krieg-Karte: die deutsche Einheit trägt ihr Datum im Titel',
    titel1990.includes('3. Oktober 1990'));
  pruefe('Kalter-Krieg-Karte: der Mauerbau steht mit Datum im Titel der zweiten Phase',
    titel1961.includes('13. August 1961'));
  // Keine Fläche trägt ein Werturteil im Namen (siehe Kopf der Kartendatei).
  const alleTitel = `${titel1949} | ${titel1961} | ${titel1990}`;
  pruefe('Kalter-Krieg-Karte: keine Fläche heißt „Ostblock" oder „freie Welt"',
    !/Ostblock|freie Welt/i.test(alleTitel));

  // Das Baltikum taucht erst 1991 auf — der Zerfall der Sowjetunion als Rechnung.
  const baltikum = karte.phasen.map((p) => groesseVon(p, /Estland, Lettland und Litauen/));
  pruefe('Kalter-Krieg-Karte: die baltischen Staaten stehen erst 1991 auf der Karte',
    baltikum[0] === 0 && baltikum[1] === 0 && baltikum[2] > 0);
  const udssr = karte.phasen.map((p) => groesseVon(p, /Sowjetunion/));
  pruefe('Kalter-Krieg-Karte: die Sowjetunion ist 1991 kleiner als vorher (das Baltikum fehlt)',
    udssr[0] > 0 && udssr[2] < udssr[0]);

  // Jugoslawien und die Neutralen stehen auf jeder Phase.
  pruefe('Kalter-Krieg-Karte: Jugoslawien steht auf jeder Phase',
    karte.phasen.every((p) => groesseVon(p, /Jugoslawien/) > 0));
  pruefe('Kalter-Krieg-Karte: Jugoslawiens Titel nennt 1949 den Bruch mit Moskau von 1948',
    titel1949.includes('Bruch mit Moskau 1948'));
  pruefe('Kalter-Krieg-Karte: die Neutralen stehen auf jeder Phase',
    karte.phasen.every((p) => groesseVon(p, /Neutrale/) > 0));
  pruefe('Kalter-Krieg-Karte: Österreich ist 1949 als besetzt und 1961 als neutral gekennzeichnet',
    titel1949.includes('von den vier Siegermächten besetzt') && titel1961.includes('1955 neutral'));
  pruefe('Kalter-Krieg-Karte: Griechenland und die Türkei tragen 1949 die Truman-Doktrin im Titel',
    titel1949.includes('Truman-Doktrin'));
  pruefe('Kalter-Krieg-Karte: Spanien tritt der NATO erst 1982 bei',
    titel1949.includes('kein NATO-Mitglied') && titel1990.includes('NATO-Mitglied seit 1982'));

  // --- 3. Die zentrale Festlegung als Rechnung ---------------------------
  const geo = erstelleProjektion(RAHMEN);
  pruefe('Kalter-Krieg-Karte: die Höhe passt zum angenommenen Ausschnitt', geo.hoehe === karte.hoehe);
  pruefe('Kalter-Krieg-Karte: die Breite passt zum angenommenen Ausschnitt', geo.breite === karte.breite);

  /** Liegt ein geografischer Ort in einer Fläche dieser Phase? */
  const liegtIn = (phase, muster, lon, lat) => {
    const punkt = geo.punkt(lon, lat);
    return phase.flaechen
      .filter((f) => muster.test(f.titel))
      .some((f) => ringe(f.d).some((ring) => imVieleck(punkt, ring)));
  };

  // Die geteilte Stadt und das geteilte Land. Geprüft wird mit Orten im
  // Landesinneren: Küstenstädte liegen auf der Grenzlinie selbst.
  pruefe('Kalter-Krieg-Karte: Bonn liegt 1949 und 1961 in der Bundesrepublik',
    liegtIn(phase1949, /Bundesrepublik/, 7.1, 50.73) && liegtIn(phase1961, /Bundesrepublik/, 7.1, 50.73));
  pruefe('Kalter-Krieg-Karte: München liegt in der Bundesrepublik',
    liegtIn(phase1949, /Bundesrepublik/, 11.58, 48.14));
  pruefe('Kalter-Krieg-Karte: Leipzig liegt 1949 und 1961 in der DDR',
    liegtIn(phase1949, /Demokratische Republik/, 12.37, 51.34) &&
    liegtIn(phase1961, /Demokratische Republik/, 12.37, 51.34));
  pruefe('Kalter-Krieg-Karte: Leipzig liegt NICHT in der Bundesrepublik',
    !liegtIn(phase1949, /Bundesrepublik/, 12.37, 51.34));
  pruefe('Kalter-Krieg-Karte: Bonn und Leipzig liegen 1990 im selben Staat',
    liegtIn(phase1990, /^Deutschland —/, 7.1, 50.73) && liegtIn(phase1990, /^Deutschland —/, 12.37, 51.34));
  pruefe('Kalter-Krieg-Karte: Spandau liegt in West-Berlin, Lichtenberg nicht',
    liegtIn(phase1961, /West-Berlin/, 13.2, 52.53) && !liegtIn(phase1961, /West-Berlin/, 13.5, 52.52));
  pruefe('Kalter-Krieg-Karte: Lichtenberg liegt in Ost-Berlin, Spandau nicht',
    liegtIn(phase1961, /Ost-Berlin/, 13.5, 52.52) && !liegtIn(phase1961, /Ost-Berlin/, 13.2, 52.53));
  pruefe('Kalter-Krieg-Karte: 1990 liegen beide Stadthälften in einem Berlin',
    liegtIn(phase1990, /^Berlin —/, 13.2, 52.53) && liegtIn(phase1990, /^Berlin —/, 13.5, 52.52));

  // Die beiden Blöcke.
  const OSTEN = /Polen, Tschechoslowakei/;
  pruefe('Kalter-Krieg-Karte: Prag liegt in jeder Phase im östlichen Block',
    karte.phasen.every((p) => liegtIn(p, OSTEN, 14.42, 50.09)));
  pruefe('Kalter-Krieg-Karte: Warschau, Budapest, Bukarest und Sofia liegen im Warschauer Pakt',
    liegtIn(phase1961, OSTEN, 21.0, 52.23) && liegtIn(phase1961, OSTEN, 19.04, 47.5) &&
    liegtIn(phase1961, OSTEN, 26.1, 44.43) && liegtIn(phase1961, OSTEN, 23.32, 42.7));
  pruefe('Kalter-Krieg-Karte: Paris, Rom und London liegen in der NATO',
    liegtIn(phase1949, /NATO in Europa/, 2.35, 48.86) &&
    liegtIn(phase1949, /NATO in Europa/, 12.48, 41.9) &&
    liegtIn(phase1949, /NATO in Europa/, -0.13, 51.51));
  pruefe('Kalter-Krieg-Karte: Oslo und Kopenhagen liegen in der NATO',
    liegtIn(phase1949, /NATO in Europa/, 10.75, 59.91) && liegtIn(phase1949, /NATO in Europa/, 12.57, 55.68));
  pruefe('Kalter-Krieg-Karte: Lissabon liegt 1949 in der NATO (Portugal war Gründungsmitglied)',
    liegtIn(phase1949, /NATO in Europa/, -9.14, 38.71));
  pruefe('Kalter-Krieg-Karte: Athen und Ankara liegen 1949 NICHT in der NATO, aber 1961 schon',
    !liegtIn(phase1949, /NATO in Europa/, 23.73, 37.98) &&
    !liegtIn(phase1949, /NATO in Europa/, 32.85, 39.93) &&
    liegtIn(phase1961, /NATO in Europa/, 23.73, 37.98) &&
    liegtIn(phase1961, /NATO in Europa/, 32.85, 39.93));
  pruefe('Kalter-Krieg-Karte: Izmir liegt 1961 in der NATO — dort standen die Jupiter-Raketen',
    liegtIn(phase1961, /NATO in Europa/, 27.14, 38.42));
  pruefe('Kalter-Krieg-Karte: Madrid liegt 1961 NICHT in der NATO',
    !liegtIn(phase1961, /NATO in Europa/, -3.7, 40.42) && liegtIn(phase1961, /Spanien/, -3.7, 40.42));

  // Wer zu keinem Block gehörte, gehört auch auf der Karte zu keinem.
  pruefe('Kalter-Krieg-Karte: Wien liegt in jeder Phase in Österreich',
    karte.phasen.every((p) => liegtIn(p, /Österreich/, 16.37, 48.21)));
  pruefe('Kalter-Krieg-Karte: Wien liegt weder in der NATO noch im Warschauer Pakt',
    !liegtIn(phase1961, /NATO in Europa/, 16.37, 48.21) && !liegtIn(phase1961, OSTEN, 16.37, 48.21));
  pruefe('Kalter-Krieg-Karte: Belgrad liegt in jeder Phase in Jugoslawien',
    karte.phasen.every((p) => liegtIn(p, /Jugoslawien/, 20.46, 44.82)));
  pruefe('Kalter-Krieg-Karte: Belgrad liegt in keinem der beiden Blöcke',
    !liegtIn(phase1961, OSTEN, 20.46, 44.82) && !liegtIn(phase1961, /NATO in Europa/, 20.46, 44.82));
  pruefe('Kalter-Krieg-Karte: Finnland, Schweden und Irland liegen bei den Neutralen',
    liegtIn(phase1961, /Neutrale/, 25.66, 60.98) && liegtIn(phase1961, /Neutrale/, 15.21, 59.27) &&
    liegtIn(phase1961, /Neutrale/, -7.94, 53.42));
  pruefe('Kalter-Krieg-Karte: Finnland gehört nicht zur Sowjetunion',
    !liegtIn(phase1949, /Sowjetunion/, 25.66, 60.98));

  // Der Zerfall der Sowjetunion, Punkt für Punkt.
  pruefe('Kalter-Krieg-Karte: Moskau liegt in jeder Phase in der Sowjetunion',
    karte.phasen.every((p) => liegtIn(p, /Sowjetunion/, 37.62, 55.75)));
  pruefe('Kalter-Krieg-Karte: Kiew liegt in der Sowjetunion',
    liegtIn(phase1949, /Sowjetunion/, 30.52, 50.45));
  pruefe('Kalter-Krieg-Karte: Riga liegt 1949 in der Sowjetunion und 1991 nicht mehr',
    liegtIn(phase1949, /Sowjetunion/, 24.1, 56.95) && !liegtIn(phase1990, /Sowjetunion/, 24.1, 56.95));
  pruefe('Kalter-Krieg-Karte: Riga, Vilnius und Tallinn liegen 1991 im wieder unabhängigen Baltikum',
    liegtIn(phase1990, /Estland/, 24.1, 56.95) && liegtIn(phase1990, /Estland/, 25.28, 54.69) &&
    liegtIn(phase1990, /Estland/, 24.75, 59.3));
  pruefe('Kalter-Krieg-Karte: Kaliningrad bleibt 1991 sowjetisch',
    liegtIn(phase1990, /Sowjetunion/, 20.5, 54.7));

  // --- 4. Atlas-Gegenprobe -----------------------------------------------
  const kuestenpunkte = karte.basis
    .filter((teil) => teil.art === 'land')
    .flatMap((teil) => eckpunkte(teil.d));
  pruefe('Kalter-Krieg-Karte: es gibt Küstenlinien zu prüfen', kuestenpunkte.length > 400);

  /** Abstand einer geografischen Landmarke zur nächsten gezeichneten Küste. */
  const abstandZurKueste = (lon, lat) => {
    const [x, y] = geo.punkt(lon, lat);
    return kuestenpunkte.reduce(
      (naechster, [kx, ky]) => Math.min(naechster, Math.hypot(kx - x, ky - y)),
      Infinity,
    );
  };

  // Toleranz ein voller Längengrad — wie bei der Karte zum Ersten Weltkrieg,
  // deren Rahmen diese Karte übernimmt (12,7 Einheiten je Grad).
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
  for (const [name, lon, lat] of landmarken) {
    pruefe(`Kalter-Krieg-Karte: ${name} liegt auf der gezeichneten Küste`,
      abstandZurKueste(lon, lat) < TOLERANZ);
  }

  // Und die Gegenprobe zur Gegenprobe: Keiner dieser Orte darf zugleich ein
  // Eckpunkt des Kartenmoduls sein, sonst prüft der Test seine eigene Vorlage.
  pruefe('Kalter-Krieg-Karte: keine Landmarke ist als Eckpunkt abgeschrieben',
    landmarken.every(([, lon, lat]) => abstandZurKueste(lon, lat) > EINHEITEN_JE_GRAD * 0.1));

  // Im Binnenland und auf offener See darf keine Küste liegen, sonst wäre der
  // Test durch schiere Punktdichte immer erfüllt.
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
  for (const [wo, lon, lat] of abseits) {
    pruefe(`Kalter-Krieg-Karte: ${wo} liegt keine Küste`,
      abstandZurKueste(lon, lat) > TOLERANZ * 2);
  }

  // --- 5. Der Untergrund ---------------------------------------------------
  pruefe('Kalter-Krieg-Karte: jede Landmasse ist ein geschlossener Pfad',
    karte.basis.filter((teil) => teil.art === 'land').every((teil) => teil.d.trim().endsWith('Z')));
  pruefe('Kalter-Krieg-Karte: mindestens zwölf Landmassen und Inseln sind gezeichnet',
    karte.basis.filter((teil) => teil.art === 'land').length >= 12);
  pruefe('Kalter-Krieg-Karte: mindestens fünf Flüsse sind gezeichnet',
    karte.basis.filter((teil) => teil.art === 'fluss').length >= 5);
  const grund = karte.basis[0];
  pruefe('Kalter-Krieg-Karte: das Meer liegt als Untergrund unter allem',
    grund.art === 'grund' && grund.d.includes(String(karte.breite)));
  // Der Eiserne Vorhang ist eine Linie im Untergrund und bleibt auf allen
  // Phasen stehen — auch auf der letzten (siehe Kopf der Kartendatei).
  const vorhang = karte.basis.filter((teil) => teil.art === 'grenze');
  pruefe('Kalter-Krieg-Karte: der Eiserne Vorhang liegt als Linie im Untergrund', vorhang.length === 1);
  pruefe('Kalter-Krieg-Karte: der Eiserne Vorhang ist eine offene Linie, keine Fläche',
    vorhang[0].fill === 'none' && !vorhang[0].d.trim().endsWith('Z'));

  // --- 6. Die Info-Punkte --------------------------------------------------
  const punkte = Object.fromEntries(karte.punkte.map((punkt) => [punkt.id, punkt]));
  for (const id of ['berlin', 'bonn', 'moskau', 'prag', 'leipzig', 'budapest', 'helsinki']) {
    pruefe(`Kalter-Krieg-Karte: „${id}" ist ein Info-Punkt`, Boolean(punkte[id]));
  }
  pruefe('Kalter-Krieg-Karte: Berlin nennt Luftbrücke, Mauerbau und Mauerfall mit Datum',
    punkte.berlin.text.includes('24. Juni 1948') &&
    punkte.berlin.text.includes('13. August') &&
    punkte.berlin.text.includes('9. November 1989'));
  pruefe('Kalter-Krieg-Karte: Bonn wird als provisorische Hauptstadt erklärt',
    punkte.bonn.text.includes('provisorisch'));
  pruefe('Kalter-Krieg-Karte: Moskau gibt die sowjetischen Beweggründe fair wieder',
    punkte.moskau.text.includes('27 Millionen') && punkte.moskau.text.includes('Einkreisung') &&
    punkte.moskau.text.includes('erfunden war'));
  pruefe('Kalter-Krieg-Karte: Moskau nennt den Zwei-plus-Vier-Vertrag mit Datum',
    punkte.moskau.text.includes('12. September 1990'));
  pruefe('Kalter-Krieg-Karte: Prag nennt den Prager Frühling und die Samtene Revolution',
    punkte.prag.text.includes('Prager Frühling') && punkte.prag.text.includes('Samtene Revolution'));
  pruefe('Kalter-Krieg-Karte: Prag benennt, dass der Westen 1968 nicht eingriff',
    punkte.prag.text.includes('griff nicht ein'));
  pruefe('Kalter-Krieg-Karte: Leipzig nennt die Montagsdemonstration vom 9. Oktober 1989',
    punkte.leipzig.text.includes('9. Oktober 1989') && punkte.leipzig.text.includes('Wir sind das Volk'));
  pruefe('Kalter-Krieg-Karte: Budapest nennt 1956 und den Grenzabbau von 1989',
    punkte.budapest.text.includes('1956') && punkte.budapest.text.includes('Paneuropäische'));
  pruefe('Kalter-Krieg-Karte: Budapest benennt, dass der Westen 1956 zusah',
    punkte.budapest.text.includes('sah zu'));
  pruefe('Kalter-Krieg-Karte: Helsinki erklärt die KSZE-Schlussakte und ihre Hebelwirkung',
    punkte.helsinki.text.includes('1. August 1975') && punkte.helsinki.text.includes('35 Staaten') &&
    punkte.helsinki.text.includes('Helsinki-Gruppe'));

  // --- 7. Die Bewegungen ----------------------------------------------------
  const bewegung = Object.fromEntries(karte.bewegungen.map((b) => [b.id, b]));
  for (const id of ['luftbruecke', 'flucht-aus-der-ddr', 'oeffnung-1989', 'truppenabzug']) {
    pruefe(`Kalter-Krieg-Karte: die Bewegung „${id}" ist da`, Boolean(bewegung[id]));
  }
  const beiPunkt = (paar, id) =>
    Math.hypot(paar[0] - punkte[id].x, paar[1] - punkte[id].y) < 1;

  pruefe('Kalter-Krieg-Karte: die Luftbrücke endet in Berlin', beiPunkt(bewegung.luftbruecke.nach, 'berlin'));
  pruefe('Kalter-Krieg-Karte: die Luftbrücke führt von Westen nach Osten',
    bewegung.luftbruecke.nach[0] > bewegung.luftbruecke.von[0]);
  pruefe('Kalter-Krieg-Karte: die Luftbrücke nennt die Korridore und die Rosinenbomber',
    bewegung.luftbruecke.text.includes('Korridor') && bewegung.luftbruecke.text.includes('Rosinenbomber'));
  pruefe('Kalter-Krieg-Karte: die Luftbrücke benennt den eigenen politischen Nutzen',
    bewegung.luftbruecke.text.includes('politischer Erfolg'));

  pruefe('Kalter-Krieg-Karte: die Fluchtbewegung führt nach Westen',
    bewegung['flucht-aus-der-ddr'].nach[0] < bewegung['flucht-aus-der-ddr'].von[0]);
  pruefe('Kalter-Krieg-Karte: die Fluchtbewegung nennt die Zahl und den Mauerbau',
    bewegung['flucht-aus-der-ddr'].text.includes('2,7 Millionen') &&
    bewegung['flucht-aus-der-ddr'].text.includes('13. August 1961'));

  pruefe('Kalter-Krieg-Karte: der Weg über Ungarn beginnt in Budapest',
    beiPunkt(bewegung['oeffnung-1989'].von, 'budapest'));
  pruefe('Kalter-Krieg-Karte: der Weg über Ungarn führt nach Westen',
    bewegung['oeffnung-1989'].nach[0] < bewegung['oeffnung-1989'].von[0]);
  pruefe('Kalter-Krieg-Karte: der Weg über Ungarn nennt Sopron und den 11. September 1989',
    bewegung['oeffnung-1989'].text.includes('Sopron') &&
    bewegung['oeffnung-1989'].text.includes('11. September'));

  pruefe('Kalter-Krieg-Karte: der Truppenabzug endet in Moskau',
    beiPunkt(bewegung.truppenabzug.nach, 'moskau'));
  pruefe('Kalter-Krieg-Karte: der Truppenabzug nennt Artikel 4 und den 31. August 1994',
    bewegung.truppenabzug.text.includes('Artikel 4') &&
    bewegung.truppenabzug.text.includes('31. August 1994'));

  // --- 8. Beschriftungen -----------------------------------------------------
  const beschriftungen = karte.beschriftungen || [];
  const texte = beschriftungen.map((b) => b.text);
  for (const name of [
    'Atlantik', 'Nordsee', 'Ostsee', 'Mittelmeer', 'Schwarzes Meer', 'NATO',
    'Warschauer Pakt', 'Eiserner Vorhang', 'Neutrale', 'Sowjetunion', 'Jugoslawien',
  ]) {
    pruefe(`Kalter-Krieg-Karte: „${name}" ist beschriftet`, texte.includes(name));
  }
  pruefe('Kalter-Krieg-Karte: es gibt Beschriftungen für Land und Meer',
    beschriftungen.some((b) => b.art === 'land') && beschriftungen.some((b) => b.art === 'meer'));

  // --- 9. Zusammenspiel mit dem Lernformat -----------------------------------
  pruefe('Lernformat: „Die neue Weltordnung und der Kalte Krieg" zeigt den Karten-Abschnitt',
    abschnitteFuer(thema).some((a) => a.id === 'karte'));
  pruefe('Lernformat: der Karten-Abschnitt steht direkt hinter dem Aufhänger',
    abschnitteFuer(thema).findIndex((a) => a.id === 'karte') === 1);

  // --- 10. Das Modul selbst -------------------------------------------------
  // Runde 20 legt nur die Sicht des Westens an (Opus); die Sicht des Ostens
  // ergänzt Hermes danach. Der generische Schema-Test in tests/themen.mjs
  // nimmt alle Perspektiven automatisch mit — hier steht nur, was für dieses
  // Thema besonders gilt.
  const westen = thema.perspektiven.find((p) => p.id === 'westen-sicht');
  pruefe('„Kalter Krieg": die Sicht des Westens ist da und stammt von Opus',
    Boolean(westen) && westen.stimme === 'Opus');
  pruefe('„Kalter Krieg": die Perspektive nennt sich gleichwertig zu den anderen Stimmen',
    westen.text.includes('gleichwertig'));
  pruefe('„Kalter Krieg": die Reihenfolge wird ausdrücklich nicht als Rangfolge ausgegeben',
    westen.text.includes('keine Rangfolge'));
  pruefe('„Kalter Krieg": die Perspektive öffnet die Tür zu den weiteren Stimmen',
    westen.text.includes('Sicht des Ostens') && westen.text.includes('Hermes'));

  // Die Stationen des Kapitels (Betreiber-Vorgaben, notizen/kapitel-planung.md).
  for (const stichwort of [
    'Jalta', 'Potsdam', 'Eiserner Vorhang', 'Containment', 'Truman-Doktrin',
    'Marshallplan', 'Luftbrücke', 'Rosinenbomber', 'Gail Halvorsen',
    '4. April 1949', 'Warschauer Pakt', '14. Mai 1955', '13. August 1961',
    'Kubakrise', 'ExComm', 'Jupiter', 'B-59', 'Helsinki', 'KSZE',
    'Willy Brandt', 'Ostverträge', 'Planwirtschaft', 'Ölpreis',
    'Gorbatschow', 'Perestroika', 'Glasnost', '9. November 1989',
    'Zwei-plus-Vier-Vertrag', '12. September 1990', 'Oder-Neiße',
    '3. Oktober 1990', '25. Dezember 1991',
  ]) {
    pruefe(`„Kalter Krieg": die Perspektive erzählt von „${stichwort}"`,
      westen.text.includes(stichwort));
  }

  // Der 2+4-Vertrag steht nach Betreiber-Vorgabe prominent — mit seiner
  // Bedeutung UND der Frage, ob er eingehalten wurde.
  pruefe('„Kalter Krieg": der 2+4-Vertrag wird mit seinem vollen Namen genannt',
    westen.text.includes('Vertrag über die abschließende Regelung in Bezug auf Deutschland'));
  pruefe('„Kalter Krieg": der 2+4-Vertrag nennt die volle Souveränität und das Ende der Vier-Mächte-Rechte',
    westen.text.includes('volle Souveränität') && westen.text.includes('Artikel 7'));
  pruefe('„Kalter Krieg": der 2+4-Vertrag nennt den Verzicht auf ABC-Waffen und den Truppenabzug bis 1994',
    westen.text.includes('atomare, biologische und chemische Waffen') && westen.text.includes('bis Ende 1994'));
  pruefe('„Kalter Krieg": Artikel 6 wird als die Bestimmung über die Bündnismitgliedschaft benannt',
    westen.text.includes('Artikel 6') && westen.text.includes('Bündnissen anzugehören'));
  pruefe('„Kalter Krieg": die Frage nach der Einhaltung wird gestellt und formal mit ja beantwortet',
    westen.text.includes('Wurde der Vertrag eingehalten?') && westen.text.includes('Formal lautet die Antwort: ja'));
  pruefe('„Kalter Krieg": die Osterweiterungs-Debatte wird an das nächste Kapitel verwiesen',
    westen.text.includes('Russland und der Westen') && westen.text.includes('Geist'));

  // Warum der Ostblock zusammenbrach (Betreiber-Vorgabe, ausführlich).
  pruefe('„Kalter Krieg": der Abschnitt über den Zusammenbruch des Ostblocks ist da',
    westen.text.includes('## Warum der Ostblock zusammenbrach'));
  for (const grund2 of ['Planwirtschaft', 'technologische Rückstand', 'Rüstungslast', 'Ölpreisverfall 1986', 'Reformen']) {
    pruefe(`„Kalter Krieg": der Zusammenbruch nennt „${grund2}" als Ursache`, westen.text.includes(grund2));
  }
  pruefe('„Kalter Krieg": die westliche Lieblingserklärung („totgerüstet") wird ausdrücklich verworfen',
    westen.text.includes('totgerüstet') && westen.text.includes('Der Westen hat diesen Zusammenbruch nicht'));

  // TONE-REGEL für sensible Themen (CLAUDE.md): Die eigene Erzählung muss ihre
  // unbequemen Stellen selbst benennen, statt sie der Gegenstimme zu
  // überlassen — und sie darf die andere Seite nicht verunglimpfen.
  pruefe('„Kalter Krieg": die Perspektive benennt die McCarthy-Ära selbst',
    westen.text.includes('McCarthy-Ära') && westen.text.includes('hat jahrelang Meinungen verfolgt'));
  pruefe('„Kalter Krieg": die Perspektive benennt Vietnam als eigene Wunde',
    westen.text.includes('Vietnam') && westen.text.includes('eigene Wunde') && westen.text.includes('My Lai'));
  pruefe('„Kalter Krieg": die Perspektive benennt die Unterstützung von Diktaturen',
    westen.text.includes('Mossadeghs') && westen.text.includes('Pinochets') && westen.text.includes('Obristen'));
  pruefe('„Kalter Krieg": die Perspektive benennt den Rüstungswettlauf und Eisenhowers Warnung',
    westen.text.includes('Rüstungswettlauf') && westen.text.includes('militärisch-industriellen Komplex'));
  pruefe('„Kalter Krieg": die Perspektive benennt, dass 1953, 1956 und 1968 niemand zu Hilfe kam',
    westen.text.includes('sah zu, wie Menschen, die genau darauf vertraut hatten'));
  pruefe('„Kalter Krieg": die Perspektive benennt den Geheimteil des Kuba-Handels als unbequeme Stelle',
    westen.text.includes('verschwiegen wurde, was man selbst zugestanden hatte'));
  pruefe('„Kalter Krieg": die Perspektive benennt, dass der Marshallplan auch Machtpolitik war',
    westen.text.includes('Er war auch Machtpolitik'));

  // Und sie erklärt die Gegenseite nicht zu bloßen Statisten: Die Beweggründe
  // der Sowjetunion werden ausdrücklich fair wiedergegeben.
  pruefe('„Kalter Krieg": die sowjetische Einkreisungsangst wird fair eingeordnet',
    westen.text.includes('27 Millionen') && westen.text.includes('Einkreisung') &&
    westen.text.includes('Erfunden war sie'));
  pruefe('„Kalter Krieg": die sowjetische Ablehnung des Marshallplans wird nachvollziehbar gemacht',
    westen.text.includes('nachvollziehbarer Gedanke, kein bloßer Trotz'));
  pruefe('„Kalter Krieg": die sowjetische Sicht auf die Währungsreform von 1948 wird anerkannt',
    westen.text.includes('diese Lesart ist nicht'));
  pruefe('„Kalter Krieg": die sowjetische Sicht auf die Raketen in der Türkei wird gespiegelt',
    westen.text.includes('unerträglich nah'));
  pruefe('„Kalter Krieg": Österreich 1955 steht als Gegenbeispiel im Text',
    westen.text.includes('dieses Beispiel gehört in eine faire') ||
    westen.text.includes('Dieses Beispiel gehört in eine faire'));

  // Die Siegerfrage wird gestellt — und selbst unbequem beantwortet.
  pruefe('„Kalter Krieg": die Frage nach dem Sieger wird gestellt',
    westen.text.includes('Wer hat den Kalten Krieg gewonnen?'));
  pruefe('„Kalter Krieg": die Antwort nennt den Zusammenbruch statt eines Sieges',
    westen.text.includes('weniger ein Sieg als ein Zusammenbruch'));
  pruefe('„Kalter Krieg": die Antwort sagt, dass 1989 im Osten nicht überall als Befreiung erlebt wurde',
    westen.text.includes('nicht überall als Befreiung erlebt'));

  // Solange nur eine Stimme dasteht, muss die Synthese das sagen. Die Prüfung
  // ist zustandstolerant: Sie akzeptiert den Zwischenstand ebenso wie die
  // spätere Fassung, die die Stimmen zusammenführt (Muster der Runden 8–19).
  const weitereStimme = thema.perspektiven.find((p) => p.stimme !== 'Opus');
  if (!weitereStimme) {
    pruefe('„Kalter Krieg": die Synthese sagt offen, dass eine Sicht noch fehlt',
      thema.synthese.includes('fehlt noch') && thema.synthese.includes('Sicht des Ostens'));
    pruefe('„Kalter Krieg": die Synthese benennt schon jetzt die Bruchstellen',
      thema.synthese.includes('Bruchstellen'));
  } else {
    pruefe('„Kalter Krieg": die Synthese führt die Sichtweisen zusammen',
      /Westen/.test(thema.synthese) && /Osten|Sowjetunion|DDR/.test(thema.synthese));
  }

  pruefe('„Kalter Krieg" hat 3 bis 5 Quizfragen', thema.quiz.length >= 3 && thema.quiz.length <= 5);
  pruefe('„Kalter Krieg": jede Quizfrage hat eine gültige richtige Antwort',
    thema.quiz.every((f) => typeof f.antworten[f.richtig] === 'string'));
  pruefe('„Kalter Krieg": jede Quizfrage wird erklärt',
    thema.quiz.every((f) => f.erklaerung.trim().length > 40));
  // Die Quizfragen bleiben Wissensfragen: keine Schuldfrage — auch das Wort
  // selbst darf im Quiz nicht vorkommen (Zusatzregel für sensible Themen).
  const quizText = thema.quiz.map((f) => `${f.frage} ${f.antworten.join(' ')} ${f.erklaerung}`).join(' ');
  pruefe('„Kalter Krieg": keine Quizfrage (und keine Erklärung) nennt das Wort „Schuld"',
    !/[Ss]chuld/.test(quizText));
  pruefe('„Kalter Krieg": das Quiz fragt nach dem Zwei-plus-Vier-Vertrag',
    quizText.includes('Zwei-plus-Vier-Vertrag'));
  pruefe('„Kalter Krieg": das Urteil ist offen gestellt', thema.urteil.frage.includes('?'));
  pruefe('„Kalter Krieg": das Urteil fragt nicht nach Schuld', !/[Ss]chuld/.test(thema.urteil.frage));
  pruefe('„Kalter Krieg": das Urteil bekommt einen Denkanstoß mit beiden Seiten',
    typeof thema.urteil.hinweis === 'string' && thema.urteil.hinweis.length > 40 &&
    thema.urteil.hinweis.includes('Die einen sagen') && thema.urteil.hinweis.includes('Die anderen sagen'));

  pruefe('„Die neue Weltordnung und der Kalte Krieg" steht als Modul 18 hinter dem Zweiten Weltkrieg',
    alleThemen[17] === thema && alleThemen[16].id === 'zweiter-weltkrieg');
}
