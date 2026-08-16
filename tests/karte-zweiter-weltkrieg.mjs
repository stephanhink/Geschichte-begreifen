// Prüfungen für die Karte zum Thema „Der Zweite Weltkrieg und die neue
// Weltordnung" — und für das, was das Themen-Modul an der Karte hängen hat.
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe:
// läuft mit blankem `node`.
//
//   1. Vollständigkeit und Aufbau (Phasen, Punkte, Bewegungen, Beschriftungen).
//   2. Atlas-Gegenprobe: Liegen bekannte Küstenorte von Les Sables-d’Olonne
//      bis Pori auf der gezeichneten Küste? Und liegt im Binnenland oder auf
//      offener See keine?
//   3. Die Aussage steckt in der Geometrie. Vier Festlegungen der Kartendatei
//      werden hier nachgerechnet: Stalingrad, Moskau und Leningrad liegen in
//      KEINER Phase im deutschen Machtbereich (die Wehrmacht stand dort, sie
//      herrschte dort nicht); Auschwitz liegt 1939–1944 auf annektiertem
//      Reichsgebiet und nicht im Generalgouvernement; der Machtbereich ist
//      1942 größer als 1941; 1945 steht Deutschland in vier Besatzungszonen
//      da, mit Berlin als eigener Fläche mitten in der sowjetischen.
//   4. Die Bewegungen hängen an den Info-Punkten: der Überfall auf Polen
//      beginnt in Berlin, der Vormarsch endet in Stalingrad, die Landung in
//      der Normandie führt nach Paris, Flucht und Vertreibung laufen von Ost
//      nach West.
//   5. TONE-REGEL für sensible Themen (CLAUDE.md) in ihrer schärfsten Form.
//      Die Perspektive muss ihre unbequemen Stellen selbst benennen (den von
//      Deutschland begonnenen Angriffskrieg, den Vernichtungskrieg im Osten,
//      die Verstrickung der Wehrmacht, den Holocaust als deutsche
//      Verantwortung, die Frage des Mitwissens), sie muss die Beweggründe und
//      die Verluste der anderen Seite fair wiedergeben (die Sowjetunion mit
//      der Hauptlast, die Westmächte) — und sie darf den Holocaust an keiner
//      Stelle relativieren. Bombenkrieg und Vertreibung stehen ausdrücklich
//      NEBEN ihm, nicht gegen ihn; der Text sagt das selbst, und hier wird es
//      nachgeprüft. Keine Quizfrage fragt nach Schuld.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { pruefeKarte, KARTEN_PUNKT_TYPEN } = require('../utils/themen/schema.js');
const { erstelleProjektion } = require('../utils/karte-geo.js');
const { themaNachId, alleThemen } = require('../utils/themen/index.js');
const { abschnitteFuer } = require('../utils/lernformat.js');

/**
 * Der Kartenausschnitt, wie ihn utils/themen/karten/zweiter-weltkrieg.js
 * aufspannt. Steht hier noch einmal, damit die Atlas-Gegenprobe rechnen kann —
 * dass er stimmt, prüft der Test über die daraus folgende Höhe.
 */
const RAHMEN = { minLon: -12, maxLon: 48, minLat: 34, maxLat: 62, breite: 700 };

/** Wie viele SVG-Einheiten ein Längengrad breit ist — der Maßstab der Probe. */
const EINHEITEN_JE_GRAD = RAHMEN.breite / (RAHMEN.maxLon - RAHMEN.minLon);

/**
 * Die Eckpunkte eines Pfades aus seinem `d`-Attribut.
 *
 * Die Pfade bestehen nur aus M, C und Z. Bei „M x y C c1 c2 x y C …" ist jedes
 * dritte Zahlenpaar ein echter Eckpunkt, dazwischen liegen die Kontrollpunkte
 * der Rundung.
 */
function eckpunkte(d) {
  const zahlen = (d.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  const paare = [];
  for (let i = 0; i + 1 < zahlen.length; i += 2) paare.push([zahlen[i], zahlen[i + 1]]);
  return paare.filter((_, i) => i % 3 === 0);
}

/**
 * Die einzelnen geschlossenen Ringe eines Pfades.
 *
 * Der deutsche Machtbereich der zweiten Phase besteht aus mehr als einem
 * Dutzend aneinandergrenzender Ringe; für die Punkt-im-Vieleck-Probe müssen
 * sie getrennt bleiben.
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
  const thema = themaNachId('zweiter-weltkrieg');
  pruefe('„Der Zweite Weltkrieg" ist als Thema registriert', Boolean(thema));
  const karte = thema.karte;
  pruefe('„Der Zweite Weltkrieg": das Thema bringt eine Karte mit', Boolean(karte));

  // --- 1. Aufbau ---------------------------------------------------------
  pruefe('WK2-Karte: erfüllt das Karten-Schema', pruefeKarte(karte).length === 0);
  pruefe('WK2-Karte: hat mindestens 3 Phasen', karte.phasen.length >= 3);
  pruefe('WK2-Karte: hat genau 3 Phasen — 1939–1941, 1942–1944, 1945',
    karte.phasen.length === 3);
  pruefe('WK2-Karte: hat 6 bis 7 Info-Punkte',
    karte.punkte.length >= 6 && karte.punkte.length <= 7);
  pruefe('WK2-Karte: hat 2 bis 4 Bewegungen',
    karte.bewegungen.length >= 2 && karte.bewegungen.length <= 4);
  pruefe('WK2-Karte: jeder Punkt-Typ ist ein bekannter',
    karte.punkte.every((punkt) => KARTEN_PUNKT_TYPEN.includes(punkt.typ)));
  pruefe('WK2-Karte: jeder Info-Punkt hat einen ausgeführten Text',
    karte.punkte.every((punkt) => punkt.text.trim().length > 200));
  pruefe('WK2-Karte: jede Bewegung hat einen ausgeführten Text',
    karte.bewegungen.every((b) => b.text.trim().length > 200));
  pruefe('WK2-Karte: jede Phase erklärt sich in einem Hinweis',
    karte.phasen.every((p) => typeof p.hinweis === 'string' && p.hinweis.length > 40));
  pruefe('WK2-Karte: die Phasen-ids sind eindeutig',
    new Set(karte.phasen.map((p) => p.id)).size === karte.phasen.length);
  pruefe('WK2-Karte: jede Fläche trägt einen Titel',
    karte.phasen.every((p) => p.flaechen.every((f) => f.titel.trim().length > 0)));

  const labels = karte.phasen.map((p) => p.label).join(' | ');
  for (const jahr of ['1939', '1942', '1945']) {
    pruefe(`WK2-Karte: die Jahreszahl ${jahr} steht auf dem Umschalter`, labels.includes(jahr));
  }

  const imBild = ([x, y]) => x >= 0 && x <= karte.breite && y >= 0 && y <= karte.hoehe;
  pruefe('WK2-Karte: alle Info-Punkte liegen im Bild',
    karte.punkte.every((punkt) => imBild([punkt.x, punkt.y])));
  pruefe('WK2-Karte: alle Bewegungen liegen im Bild',
    karte.bewegungen.every((b) => [b.von, b.nach, ...(b.ueber || [])].every(imBild)));
  pruefe('WK2-Karte: alle Beschriftungen liegen im Bild',
    (karte.beschriftungen || []).every((b) => imBild([b.x, b.y])));

  const geo = erstelleProjektion(RAHMEN);
  pruefe('WK2-Karte: die Höhe passt zum angenommenen Ausschnitt', geo.hoehe === karte.hoehe);
  pruefe('WK2-Karte: die Breite passt zum angenommenen Ausschnitt', geo.breite === karte.breite);

  // --- 2. Die Erzählung steckt in der Geometrie --------------------------
  const [phase1941, phase1942, phase1945] = karte.phasen;

  /** Liegt ein geografischer Ort in einer Fläche dieser Phase? */
  const liegtIn = (phase, muster, lon, lat) => {
    const punkt = geo.punkt(lon, lat);
    return phase.flaechen
      .filter((f) => muster.test(f.titel))
      .some((f) => ringe(f.d).some((ring) => imVieleck(punkt, ring)));
  };

  // Jede Fläche trägt ihren Zustand mit Jahreszahl im Titel — die Karte
  // datiert, sie bewertet nicht.
  const alleTitel = karte.phasen.flatMap((p) => p.flaechen.map((f) => f.titel)).join(' | ');
  for (const stichwort of [
    'Stand 1941', 'seit März 1939', 'seit Oktober 1939', '(1940/41)',
    'November 1942', 'ab Juli 1945', 'Grenzen von 1945',
  ]) {
    pruefe(`WK2-Karte: die Flächen-Titel datieren mit „${stichwort}"`,
      alleTitel.includes(stichwort));
  }
  pruefe('WK2-Karte: der Titel der Sowjetunion 1941 nennt den Pakt und sagt „kein Verbündeter"',
    phase1941.flaechen.some((f) =>
      /^Sowjetunion/.test(f.titel) &&
      f.titel.includes('Hitler-Stalin-Pakts') &&
      f.titel.includes('kein Verbündeter')));
  pruefe('WK2-Karte: der Titel der Ostgrenze von 1942 nennt sie eine Frontlinie',
    phase1942.flaechen.some((f) => /Machtbereich/.test(f.titel) && f.titel.includes('Frontlinie')));

  // Der deutsche Machtbereich wächst von 1941 auf 1942 und ist 1945 fort.
  const reich1941 = groesseVon(phase1941, /^Deutsches Reich/) +
    groesseVon(phase1941, /Protektorat/) +
    groesseVon(phase1941, /Generalgouvernement/) +
    groesseVon(phase1941, /Von Deutschland besetzt/);
  const machtbereich1942 = groesseVon(phase1942, /Machtbereich/);
  pruefe('WK2-Karte: der deutsche Machtbereich ist 1942 größer als 1941',
    reich1941 > 0 && machtbereich1942 > reich1941);
  pruefe('WK2-Karte: 1945 gibt es keinen deutschen Machtbereich mehr',
    groesseVon(phase1945, /Machtbereich/) === 0 &&
    groesseVon(phase1945, /^Deutsches Reich/) === 0);

  // Die vier Besatzungszonen und Berlin.
  for (const zone of [
    /Sowjetische Besatzungszone/, /Britische Besatzungszone/,
    /Amerikanische Besatzungszone/, /Französische Besatzungszone/,
  ]) {
    pruefe(`WK2-Karte: 1945 steht die Zone ${zone.source} auf der Karte`,
      groesseVon(phase1945, zone) > 0);
  }
  pruefe('WK2-Karte: 1945 ist Berlin eine eigene Fläche',
    groesseVon(phase1945, /^Berlin/) > 0);
  pruefe('WK2-Karte: die Besatzungszonen gibt es 1941 und 1942 noch nicht',
    groesseVon(phase1941, /Besatzungszone/) === 0 &&
    groesseVon(phase1942, /Besatzungszone/) === 0);

  // --- 3. Die zentralen Festlegungen als Rechnung ------------------------
  const MACHT = /Machtbereich/;
  const REICH = /^Deutsches Reich/;

  // Wer irgendwo steht, herrscht dort noch nicht — dieselbe Regel wie bei
  // Moskau auf der Napoleon-Karte.
  for (const [name, lon, lat] of [
    ['Stalingrad', 44.42, 48.71],
    ['Moskau', 37.62, 55.75],
    ['Leningrad', 30.31, 59.94],
    ['London', -0.13, 51.51],
  ]) {
    pruefe(`WK2-Karte: ${name} liegt in keiner Phase im deutschen Machtbereich`,
      !liegtIn(phase1942, MACHT, lon, lat) &&
      !liegtIn(phase1941, REICH, lon, lat) &&
      !liegtIn(phase1941, /Von Deutschland besetzt/, lon, lat));
  }

  // Auschwitz lag auf Gebiet, das das Reich 1939 annektiert hatte — nicht im
  // Generalgouvernement. Das ist keine Nebensächlichkeit.
  pruefe('WK2-Karte: Auschwitz liegt 1939–1941 im Deutschen Reich',
    liegtIn(phase1941, REICH, 19.22, 50.03));
  pruefe('WK2-Karte: Auschwitz liegt nicht im Generalgouvernement',
    !liegtIn(phase1941, /Generalgouvernement/, 19.22, 50.03));
  pruefe('WK2-Karte: Warschau liegt 1939–1941 im Generalgouvernement',
    liegtIn(phase1941, /Generalgouvernement/, 21.0, 52.23));
  pruefe('WK2-Karte: Prag liegt 1939–1941 im Protektorat',
    liegtIn(phase1941, /Protektorat/, 14.42, 50.08));
  pruefe('WK2-Karte: Wien liegt 1939–1941 im Deutschen Reich (Anschluss 1938)',
    liegtIn(phase1941, REICH, 16.37, 48.21));

  for (const [name, lon, lat] of [
    ['Paris', 2.35, 48.86],
    ['Amsterdam', 4.9, 52.37],
    ['Oslo', 10.75, 59.91],
    ['Kopenhagen', 12.57, 55.68],
    ['Belgrad', 20.46, 44.82],
    ['Athen', 23.73, 37.98],
  ]) {
    pruefe(`WK2-Karte: ${name} liegt 1940/41 in besetztem Gebiet`,
      liegtIn(phase1941, /Von Deutschland besetzt/, lon, lat));
  }
  pruefe('WK2-Karte: Marseille liegt 1940/41 im unbesetzten Vichy-Frankreich',
    liegtIn(phase1941, /Vichy/, 5.36, 43.3) &&
    !liegtIn(phase1941, /Von Deutschland besetzt/, 5.36, 43.3));
  pruefe('WK2-Karte: Marseille liegt 1942 im deutschen Machtbereich (November 1942)',
    liegtIn(phase1942, MACHT, 5.36, 43.3));
  pruefe('WK2-Karte: Kiew und Minsk liegen 1942 im deutschen Machtbereich',
    liegtIn(phase1942, MACHT, 30.5, 50.45) && liegtIn(phase1942, MACHT, 27.56, 53.9));

  // Die Nachbarn stehen als eigene, datierte Flächen da.
  for (const [name, muster, lon, lat] of [
    ['Rom', /Italien/, 12.5, 41.9],
    ['Budapest', /An der Seite Deutschlands/, 19.04, 47.5],
    ['Bukarest', /An der Seite Deutschlands/, 26.1, 44.43],
    ['Sofia', /An der Seite Deutschlands/, 23.32, 42.7],
    ['Tampere', /An der Seite Deutschlands/, 23.76, 61.5],
    ['Moskau', /Sowjetunion/, 37.62, 55.75],
    ['London', /Großbritannien/, -0.13, 51.51],
    ['Madrid', /neutral/, -3.7, 40.42],
    ['Bern', /neutral/, 7.45, 46.95],
    ['Stockholm', /neutral/, 18.07, 59.33],
    ['Dublin', /neutral/, -6.26, 53.35],
    ['Lissabon', /neutral/, -9.14, 38.72],
    ['Ankara', /neutral/, 32.86, 39.93],
  ]) {
    pruefe(`WK2-Karte: ${name} liegt 1939–1941 in der erwarteten Fläche`,
      liegtIn(phase1941, muster, lon, lat));
  }

  // 1945: die Zonen, Berlin, das nach Westen verschobene Polen.
  for (const [name, muster, lon, lat] of [
    ['Berlin', /Sowjetische Besatzungszone/, 13.4, 52.52],
    ['Berlin', /^Berlin/, 13.4, 52.52],
    ['Dresden', /Sowjetische Besatzungszone/, 13.74, 51.05],
    ['Hamburg', /Britische Besatzungszone/, 10.0, 53.55],
    ['Köln', /Britische Besatzungszone/, 6.96, 50.94],
    ['München', /Amerikanische Besatzungszone/, 11.58, 48.14],
    ['Frankfurt am Main', /Amerikanische Besatzungszone/, 8.68, 50.11],
    ['Stuttgart', /Amerikanische Besatzungszone/, 9.18, 48.78],
    ['Freiburg', /Französische Besatzungszone/, 7.85, 47.99],
    ['Trier', /Französische Besatzungszone/, 6.64, 49.75],
    ['Breslau', /^Polen/, 17.03, 51.11],
    ['Danzig', /^Polen/, 18.65, 54.35],
    ['Königsberg', /Ostpreußen/, 20.5, 54.72],
    ['Wien', /^Österreich/, 16.37, 48.21],
    ['Prag', /Roten Armee befreite/, 14.42, 50.08],
    ['Paris', /Westalliierten befreite/, 2.35, 48.86],
    ['Rom', /Westalliierten befreite/, 12.5, 41.9],
  ]) {
    pruefe(`WK2-Karte: ${name} liegt 1945 in der erwarteten Fläche`,
      liegtIn(phase1945, muster, lon, lat));
  }
  pruefe('WK2-Karte: Berlin liegt 1945 nicht in der britischen oder amerikanischen Zone',
    !liegtIn(phase1945, /Britische Besatzungszone/, 13.4, 52.52) &&
    !liegtIn(phase1945, /Amerikanische Besatzungszone/, 13.4, 52.52));
  pruefe('WK2-Karte: der Titel Polens von 1945 nennt Oder und Neiße',
    phase1945.flaechen.some((f) => /^Polen/.test(f.titel) && f.titel.includes('Oder und Neiße')));

  // --- 4. Atlas-Gegenprobe -----------------------------------------------
  const kuestenpunkte = karte.basis
    .filter((teil) => teil.art === 'land')
    .flatMap((teil) => eckpunkte(teil.d));
  pruefe('WK2-Karte: es gibt Küstenlinien zu prüfen', kuestenpunkte.length > 200);

  /** Abstand einer geografischen Landmarke zur nächsten gezeichneten Küste. */
  const abstandZurKueste = (lon, lat) => {
    const [x, y] = geo.punkt(lon, lat);
    return kuestenpunkte.reduce(
      (naechster, [kx, ky]) => Math.min(naechster, Math.hypot(kx - x, ky - y)),
      Infinity,
    );
  };

  // Toleranz 0,8 Längengrad. Diese Karte ist mit 11,7 SVG-Einheiten je Grad
  // etwa so grob wie die Nordamerika-Karte (11,7) und gröber als die fünf
  // engeren Europakarten; in SVG-Einheiten liegt die Toleranz damit bei rund
  // 9,3. Die Werte unten liegen absichtlich mindestens 0,12 Grad NEBEN dem
  // nächsten Eckpunkt des Kartenmoduls, damit die gezeichnete Linie geprüft
  // wird und nicht die abgeschriebene Zahl.
  const TOLERANZ = EINHEITEN_JE_GRAD * 0.8;
  const landmarken = [
    ['Les Sables-d’Olonne an der Biskaya', -1.75, 46.5],
    ['Berck an der Kanalküste', 1.55, 50.4],
    ['Nieuwpoort in Flandern', 2.75, 51.15],
    ['Katwijk an der holländischen Küste', 4.4, 52.2],
    ['Juist in Ostfriesland', 7.0, 53.68],
    ['Amrum', 8.35, 54.65],
    ['Løkken in Nordjütland', 9.7, 57.38],
    ['Barth bei Stralsund', 12.72, 54.3],
    ['Rügenwalde in Pommern', 16.45, 54.4],
    ['Hela an der Danziger Bucht', 18.78, 54.6],
    ['Palanga nördlich von Memel', 21.08, 55.92],
    ['Roja an der kurländischen Küste', 22.5, 57.5],
    ['Haapsalu in Estland', 23.5, 58.9],
    ['Loksa an der estnischen Nordküste', 25.72, 59.58],
    ['Terijoki bei Leningrad', 29.7, 60.15],
    ['Loviisa an der finnischen Südküste', 26.2, 60.4],
    ['Pori am Bottnischen Meerbusen', 21.5, 61.5],
    ['Åhus in Schonen', 14.3, 55.95],
    ['Mandal an der norwegischen Südküste', 7.45, 58.02],
    ['Egersund', 5.95, 58.45],
    ['Filey in Yorkshire', -0.28, 54.2],
    ['Mablethorpe an der Nordseeküste', 0.25, 53.35],
    ['St Ives in Cornwall', -5.48, 50.2],
    ['Rosslare in Irland', -6.35, 52.25],
    ['die Bucht von Ballina', -9.15, 54.25],
    ['die Küste bei Sines', -8.83, 37.8],
    ['Portimão an der Algarve', -8.55, 37.11],
    ['Motril an der Costa Tropical', -3.5, 36.72],
    ['Agde am Golfe du Lion', 3.45, 43.28],
    ['die Küste bei Grosseto', 10.9, 42.6],
    ['Amalfi', 14.6, 40.6],
    ['Ulcinj an der Adria', 19.2, 41.95],
    ['Nafpaktos am Golf von Patras', 21.85, 38.35],
    ['Katerini am Thermaischen Golf', 22.6, 40.3],
    ['Kuşadası an der Ägäis', 27.2, 37.75],
    ['Alanya an der türkischen Südküste', 32.0, 36.55],
    ['Baniyas an der syrischen Küste', 35.85, 35.2],
    ['Skikda in Algerien', 6.85, 36.95],
    ['Cherchell westlich von Algier', 2.2, 36.6],
    ['Trapani auf Sizilien', 12.5, 38.0],
    ['Alghero auf Sardinien', 8.3, 40.55],
    ['Chania auf Kreta', 24.0, 35.5],
    ['Limassol auf Zypern', 33.05, 34.7],
    ['Slite auf Gotland', 18.8, 57.7],
  ];
  for (const [name, lon, lat] of landmarken) {
    pruefe(`WK2-Karte: ${name} liegt auf der gezeichneten Küste`,
      abstandZurKueste(lon, lat) < TOLERANZ);
  }

  // Und die Gegenprobe zur Gegenprobe: Keiner dieser Orte darf zugleich ein
  // Eckpunkt des Kartenmoduls sein, sonst prüft der Test seine eigene Vorlage.
  pruefe('WK2-Karte: keine Landmarke ist als Eckpunkt abgeschrieben',
    landmarken.every(([, lon, lat]) => abstandZurKueste(lon, lat) > EINHEITEN_JE_GRAD * 0.12));

  // Im Binnenland und auf offener See darf keine Küste liegen, sonst wäre der
  // Test durch schiere Punktdichte immer erfüllt.
  const abseits = [
    ['mitten in Deutschland', 10.5, 50.5],
    ['mitten in Frankreich', 2.5, 46.5],
    ['mitten in Spanien', -4.0, 40.5],
    ['mitten in Polen', 20.0, 52.0],
    ['mitten in der Ukraine', 32.0, 49.5],
    ['mitten in Russland', 40.0, 55.0],
    ['in der Wolgasteppe', 45.0, 50.5],
    ['mitten in Weißrussland', 28.0, 53.5],
    ['mitten in Ungarn', 19.5, 47.0],
    ['mitten in Rumänien', 25.0, 45.5],
    ['mitten in Anatolien', 33.0, 39.0],
    ['im Kaukasus', 43.0, 42.0],
    ['in den Alpen', 11.5, 47.0],
    ['mitten in Schweden', 15.0, 59.0],
    ['mitten in Norwegen', 9.0, 61.0],
    ['auf offenem Atlantik', -11.0, 45.0],
    ['mitten in der Nordsee', 3.0, 56.0],
    ['im Nordmeer', 0.0, 60.0],
    ['mitten im Mittelmeer', 17.0, 34.6],
    ['mitten im Schwarzen Meer', 34.0, 43.0],
  ];
  for (const [wo, lon, lat] of abseits) {
    pruefe(`WK2-Karte: ${wo} liegt keine Küste`, abstandZurKueste(lon, lat) > TOLERANZ * 2);
  }

  // --- 5. Der Untergrund ---------------------------------------------------
  pruefe('WK2-Karte: jede Landmasse ist ein geschlossener Pfad',
    karte.basis.filter((teil) => teil.art === 'land').every((teil) => teil.d.trim().endsWith('Z')));
  pruefe('WK2-Karte: mindestens fünfzehn Landmassen und Inseln sind gezeichnet',
    karte.basis.filter((teil) => teil.art === 'land').length >= 15);
  pruefe('WK2-Karte: mindestens zehn Flüsse sind gezeichnet',
    karte.basis.filter((teil) => teil.art === 'fluss').length >= 10);
  pruefe('WK2-Karte: das Schwarze Meer, das Kaspische Meer und der Ladogasee sind Wasserflächen',
    karte.basis.filter((teil) => teil.art === 'see').length >= 4);
  const grund = karte.basis[0];
  pruefe('WK2-Karte: das Meer liegt als Untergrund unter allem',
    grund.art === 'grund' && grund.d.includes(String(karte.breite)));

  // --- 6. Die Info-Punkte --------------------------------------------------
  const punkte = Object.fromEntries(karte.punkte.map((punkt) => [punkt.id, punkt]));
  for (const id of ['berlin', 'stalingrad', 'auschwitz', 'london', 'paris', 'leningrad', 'dresden']) {
    pruefe(`WK2-Karte: „${id}" ist ein Info-Punkt`, Boolean(punkte[id]));
  }
  pruefe('WK2-Karte: Berlin nennt den Kriegsbeginn und die Teilung in vier Sektoren',
    punkte.berlin.text.includes('1. September 1939') && punkte.berlin.text.includes('vier Sektoren'));
  pruefe('WK2-Karte: Stalingrad nennt die Einschließung und den 2. Februar 1943',
    punkte.stalingrad.text.includes('19.') && punkte.stalingrad.text.includes('2. Februar 1943'));
  pruefe('WK2-Karte: Stalingrad sagt selbst, dass die Stadt nie erobert wurde',
    punkte.stalingrad.text.includes('erobert hat sie sie nie'));
  pruefe('WK2-Karte: Auschwitz nennt Datum, Zahlen und den 27. Januar 1945',
    punkte.auschwitz.text.includes('1,1 Millionen') && punkte.auschwitz.text.includes('27. Januar 1945'));
  pruefe('WK2-Karte: Auschwitz benennt, dass das Lager auf annektiertem Reichsgebiet stand',
    punkte.auschwitz.text.includes('1939 annektiert hatte'));
  pruefe('WK2-Karte: London nennt die Luftschlacht und den Blitz',
    punkte.london.text.includes('Luftschlacht um England') && punkte.london.text.includes('Coventry'));
  pruefe('WK2-Karte: London nennt die Reihenfolge des Bombenkriegs ausdrücklich als solche',
    punkte.london.text.includes('keine Gegenrechnung') && punkte.london.text.includes('nur die'));
  pruefe('WK2-Karte: Paris nennt Besetzung 1940 und Befreiung 1944',
    punkte.paris.text.includes('14. Juni 1940') && punkte.paris.text.includes('25. August 1944'));
  pruefe('WK2-Karte: Paris gibt Résistance und Kollaboration beide wieder',
    punkte.paris.text.includes('Résistance') && punkte.paris.text.includes('Kollaboration'));
  pruefe('WK2-Karte: Leningrad nennt die Blockade und die 27 Millionen sowjetischen Toten',
    punkte.leningrad.text.includes('900 Tage') && punkte.leningrad.text.includes('27 Millionen'));
  pruefe('WK2-Karte: Dresden nennt den Forschungsstand zu den Opferzahlen',
    punkte.dresden.text.includes('22 700') && punkte.dresden.text.includes('Historikerkommission'));
  pruefe('WK2-Karte: Dresden verbietet die Aufrechnung ausdrücklich',
    punkte.dresden.text.includes('keine Gegenrechnung') &&
    punkte.dresden.text.includes('Wer Dresden gegen Auschwitz aufrechnet'));

  // --- 7. Die Bewegungen ----------------------------------------------------
  const bewegung = Object.fromEntries(karte.bewegungen.map((b) => [b.id, b]));
  for (const id of ['ueberfall-polen', 'vormarsch-osten', 'normandie', 'flucht-vertreibung']) {
    pruefe(`WK2-Karte: die Bewegung „${id}" ist da`, Boolean(bewegung[id]));
  }
  const beiPunkt = (paar, id) => Math.hypot(paar[0] - punkte[id].x, paar[1] - punkte[id].y) < 1;

  pruefe('WK2-Karte: der Überfall auf Polen beginnt in Berlin und läuft nach Osten',
    beiPunkt(bewegung['ueberfall-polen'].von, 'berlin') &&
    bewegung['ueberfall-polen'].nach[0] > bewegung['ueberfall-polen'].von[0]);
  pruefe('WK2-Karte: der Überfall auf Polen nennt Westerplatte und Gleiwitz',
    bewegung['ueberfall-polen'].text.includes('Westerplatte') &&
    bewegung['ueberfall-polen'].text.includes('Gleiwitz'));
  pruefe('WK2-Karte: der Überfall auf Polen sagt selbst, wer den Krieg begonnen hat',
    bewegung['ueberfall-polen'].text.includes('von Deutschland begonnen'));

  pruefe('WK2-Karte: der Vormarsch im Osten führt von Berlin nach Stalingrad',
    beiPunkt(bewegung['vormarsch-osten'].von, 'berlin') &&
    beiPunkt(bewegung['vormarsch-osten'].nach, 'stalingrad'));
  pruefe('WK2-Karte: der Vormarsch benennt die verbrecherischen Befehle selbst',
    bewegung['vormarsch-osten'].text.includes('Kommissarbefehl') &&
    bewegung['vormarsch-osten'].text.includes('Hungerplan'));

  pruefe('WK2-Karte: die Landung in der Normandie endet in Paris und kommt von Westen',
    beiPunkt(bewegung.normandie.nach, 'paris') &&
    bewegung.normandie.von[0] < bewegung.normandie.nach[0]);
  pruefe('WK2-Karte: die Normandie-Bewegung nennt beide Bedeutungen desselben Tages',
    bewegung.normandie.text.includes('6. Juni 1944') &&
    bewegung.normandie.text.includes('Anfang der Befreiung'));

  pruefe('WK2-Karte: Flucht und Vertreibung laufen von Ost nach West',
    bewegung['flucht-vertreibung'].von[0] > bewegung['flucht-vertreibung'].nach[0]);
  pruefe('WK2-Karte: Flucht und Vertreibung nennen die Zahlen und ihren Streitstand',
    bewegung['flucht-vertreibung'].text.includes('Zwölf bis') &&
    bewegung['flucht-vertreibung'].text.includes('umstritten'));
  pruefe('WK2-Karte: Flucht und Vertreibung verbieten die Aufrechnung ausdrücklich',
    bewegung['flucht-vertreibung'].text.includes('Eine Rechnung wird daraus nicht'));

  // --- 8. Beschriftungen -----------------------------------------------------
  const beschriftungen = karte.beschriftungen || [];
  const texte = beschriftungen.map((b) => b.text);
  for (const name of [
    'Nordsee', 'Ostsee', 'Mittelmeer', 'Schwarzes Meer', 'Deutsches Reich',
    'Frankreich', 'Großbritannien', 'Sowjetunion', 'Polen', 'Italien',
    'Spanien', 'Schweden', 'Norwegen', 'Finnland', 'Türkei',
  ]) {
    pruefe(`WK2-Karte: „${name}" ist beschriftet`, texte.includes(name));
  }
  pruefe('WK2-Karte: es gibt Beschriftungen für Land und Meer',
    beschriftungen.some((b) => b.art === 'land') && beschriftungen.some((b) => b.art === 'meer'));

  // --- 9. Zusammenspiel mit dem Lernformat -----------------------------------
  pruefe('Lernformat: „Der Zweite Weltkrieg" zeigt den Karten-Abschnitt',
    abschnitteFuer(thema).some((a) => a.id === 'karte'));
  pruefe('Lernformat: der Karten-Abschnitt steht direkt hinter dem Aufhänger',
    abschnitteFuer(thema).findIndex((a) => a.id === 'karte') === 1);

  // --- 10. Das Modul selbst -------------------------------------------------
  // Runde 19 legt nur die Sicht der Besiegten an (Opus); die Sicht der
  // Befreiten und Besetzer ergänzt Hermes danach. Der generische Schema-Test
  // in tests/themen.mjs nimmt alle Perspektiven automatisch mit — hier steht
  // nur, was für dieses Thema besonders gilt.
  const besiegte = thema.perspektiven.find((p) => p.id === 'besiegte-sicht');
  pruefe('„Der Zweite Weltkrieg": die Sicht der Besiegten ist da und stammt von Opus',
    Boolean(besiegte) && besiegte.stimme === 'Opus');
  pruefe('„Der Zweite Weltkrieg": die Perspektive nennt sich gleichwertig, ohne Rangfolge',
    besiegte.text.includes('gleichwertig') && besiegte.text.includes('keine Rangfolge'));
  pruefe('„Der Zweite Weltkrieg": die Perspektive öffnet die Tür zu den weiteren Stimmen',
    besiegte.text.includes('zweiten Stimme') &&
    besiegte.text.includes('Es fehlen die Stimmen der Befreiten'));

  // Die Stationen des Kapitels.
  for (const stichwort of [
    '1. September 1939', 'Westerplatte', 'Gleiwitz', 'Hitler-Stalin-Pakt',
    'Einsatzgruppen', '22. Juni 1941', 'Kommissarbefehl', 'Leningrad',
    '20. Januar 1942', 'Treblinka', 'Sobibor', 'Auschwitz', 'Babyn Jar',
    'Sinti und Roma', 'Zwangsarbeit', 'Weiße Rose', '20. Juli 1944',
    'Stauffenberg', 'Stalingrad', 'Hamburg', 'Dresden', 'Gustloff',
    'Potsdamer Konferenz', 'Weizsäcker', 'Nürnberg', 'Entnazifizierung',
    'Fritz Bauer', 'Vereinten Nationen', 'Grundgesetz',
  ]) {
    pruefe(`„Der Zweite Weltkrieg": die Perspektive erzählt von „${stichwort}"`,
      besiegte.text.includes(stichwort));
  }

  // TONE-REGEL, Teil 1: Die eigene Erzählung benennt ihre unbequemen Stellen
  // selbst, statt sie den anderen Stimmen zu überlassen.
  pruefe('„Der Zweite Weltkrieg": die Perspektive sagt selbst, wer den Krieg begonnen hat',
    besiegte.text.includes('Deutschland hat diesen Krieg begonnen'));
  pruefe('„Der Zweite Weltkrieg": die Perspektive nennt den Krieg einen Angriffskrieg',
    besiegte.text.includes('Angriffskrieg'));
  pruefe('„Der Zweite Weltkrieg": die Perspektive nennt den Krieg im Osten einen Vernichtungskrieg',
    besiegte.text.includes('Vernichtungskrieg'));
  pruefe('„Der Zweite Weltkrieg": die Perspektive weist die eigenen Entlastungsversuche zurück',
    besiegte.text.includes('wird sie hier nicht finden'));
  pruefe('„Der Zweite Weltkrieg": die Perspektive benennt die Verstrickung der Wehrmacht selbst',
    besiegte.text.includes('Es gab keine saubere Wehrmacht') &&
    besiegte.text.includes('tragende Institution'));
  pruefe('„Der Zweite Weltkrieg": die Perspektive benennt das Sterben der sowjetischen Kriegsgefangenen',
    besiegte.text.includes('Kriegsgefangenen') && besiegte.text.includes('3,3'));
  pruefe('„Der Zweite Weltkrieg": die Perspektive benennt den Holocaust als deutsche Verantwortung',
    besiegte.text.includes('sechs Millionen') && besiegte.text.includes('deutsche Verantwortung'));
  pruefe('„Der Zweite Weltkrieg": die Perspektive sagt, dass der Holocaust nicht relativiert werden kann',
    besiegte.text.includes('nicht relativieren'));
  pruefe('„Der Zweite Weltkrieg": die Perspektive stellt die Frage nach dem Mitwissen selbst',
    besiegte.text.includes('## Was wussten die Deutschen?') &&
    besiegte.text.includes('nichts wissen zu wollen'));
  pruefe('„Der Zweite Weltkrieg": die Perspektive sagt, dass der Widerstand eine Minderheit war',
    besiegte.text.includes('Und es waren wenige') &&
    besiegte.text.includes('nicht durch seine Ausnahmen entlastet'));

  // TONE-REGEL, Teil 2: Bombenkrieg und Vertreibung stehen NEBEN dem
  // Holocaust, nicht gegen ihn. Der Text sagt das selbst — mehrfach.
  pruefe('„Der Zweite Weltkrieg": die Perspektive schließt jede Aufrechnung ausdrücklich aus',
    besiegte.text.includes('In diesem Kapitel wird nicht aufgerechnet'));
  pruefe('„Der Zweite Weltkrieg": sie sagt beim Bombenkrieg selbst, dass es keine Gegenrechnung gibt',
    besiegte.text.includes('Wer Dresden gegen Auschwitz stellt') &&
    besiegte.text.includes('Gegenrechnung'));
  pruefe('„Der Zweite Weltkrieg": sie stellt die Vertreibung neben und nicht gegen die eigenen Taten',
    besiegte.text.includes('nicht dagegen'));
  pruefe('„Der Zweite Weltkrieg": das Leid der deutschen Zivilbevölkerung wird nicht kleingeredet',
    besiegte.text.includes('es wird hier nicht kleingeredet'));
  pruefe('„Der Zweite Weltkrieg": die Reihenfolge des Bombenkriegs wird sachlich benannt',
    besiegte.text.includes('Warschau 1939, Rotterdam 1940, Coventry 1940'));

  // TONE-REGEL, Teil 3: Die Beweggründe und die Verluste der anderen Seite
  // werden fair wiedergegeben — die Hauptlast der Sowjetunion ausdrücklich.
  pruefe('„Der Zweite Weltkrieg": die Perspektive benennt die Hauptlast der Sowjetunion',
    besiegte.text.includes('Hauptlast dieses Krieges') &&
    besiegte.text.includes('27 Millionen'));
  pruefe('„Der Zweite Weltkrieg": sie sagt, wo die Wehrmacht ihre Verluste erlitt',
    besiegte.text.includes('Ostfront erlitt die Wehrmacht'));
  pruefe('„Der Zweite Weltkrieg": sie gibt die Sicht der Westmächte fair wieder',
    besiegte.text.includes('Westmächte') && besiegte.text.includes('Lend-Lease'));
  pruefe('„Der Zweite Weltkrieg": sie nennt den 8. Mai für beide Seiten',
    besiegte.text.includes('Tag der Befreiung') && besiegte.text.includes('Weizsäcker'));
  pruefe('„Der Zweite Weltkrieg": sie räumt ein, dass der Einwand gegen Nürnberg nicht unberechtigt war',
    besiegte.text.includes('Siegerjustiz'));

  // Solange nur eine Stimme dasteht, muss die Synthese das sagen. Die Prüfung
  // ist zustandstolerant: Sie akzeptiert den Zwischenstand ebenso wie die
  // spätere Fassung, die die Stimmen zusammenführt (Muster der Runden 8–18).
  const weitereStimme = thema.perspektiven.find((p) => p.stimme !== 'Opus');
  if (!weitereStimme) {
    pruefe('„Der Zweite Weltkrieg": die Synthese sagt offen, dass Sichtweisen fehlen',
      thema.synthese.includes('fehlen noch') && thema.synthese.includes('Befreiten'));
  } else {
    pruefe('„Der Zweite Weltkrieg": die Synthese führt die Sichtweisen zusammen',
      thema.synthese.includes('Befreiten') && thema.synthese.includes('Besiegten'));
  }
  pruefe('„Der Zweite Weltkrieg": die Synthese hält die Regel gegen das Aufrechnen fest',
    thema.synthese.includes('nicht aufgerechnet'));
  pruefe('„Der Zweite Weltkrieg": die Synthese nennt keine Sichtweise „so war es"',
    thema.synthese.includes('so war es'));

  pruefe('„Der Zweite Weltkrieg" hat 3 bis 5 Quizfragen',
    thema.quiz.length >= 3 && thema.quiz.length <= 5);
  pruefe('„Der Zweite Weltkrieg": jede Quizfrage hat eine gültige richtige Antwort',
    thema.quiz.every((f) => typeof f.antworten[f.richtig] === 'string'));
  pruefe('„Der Zweite Weltkrieg": jede Quizfrage wird erklärt',
    thema.quiz.every((f) => f.erklaerung.trim().length > 40));

  // Die Quizfragen bleiben Wissensfragen: keine Schuldfrage — auch das Wort
  // selbst darf im Quiz nicht vorkommen (Regel dieses Kapitels).
  const quizText = thema.quiz.map((f) => `${f.frage} ${f.antworten.join(' ')} ${f.erklaerung}`).join(' ');
  pruefe('„Der Zweite Weltkrieg": keine Quizfrage (und keine Erklärung) nennt das Wort „Schuld"',
    !/[Ss]chuld/.test(quizText));
  // Und keine Quizfrage darf deutsches Leid gegen den Holocaust stellen.
  pruefe('„Der Zweite Weltkrieg": keine Quizfrage rechnet Bombenkrieg oder Vertreibung gegen etwas auf',
    !/aufgerechnet|Gegenrechnung|schlimmer als|mehr Opfer als/.test(quizText));

  pruefe('„Der Zweite Weltkrieg": das Urteil ist offen gestellt', thema.urteil.frage.includes('?'));
  pruefe('„Der Zweite Weltkrieg": das Urteil fragt nicht nach Schuld',
    !/[Ss]chuld/.test(thema.urteil.frage) && !/[Ss]chuld/.test(thema.urteil.hinweis));
  pruefe('„Der Zweite Weltkrieg": das Urteil bekommt einen Denkanstoß',
    typeof thema.urteil.hinweis === 'string' && thema.urteil.hinweis.length > 40);
  pruefe('„Der Zweite Weltkrieg": der Aufhänger stellt eine neutrale Frage',
    thema.aufhaenger.frage.includes('?') && !/[Ss]chuld/.test(thema.aufhaenger.frage));
  pruefe('„Der Zweite Weltkrieg": der Aufhänger nennt die Größenordnung der Opferzahlen',
    thema.aufhaenger.text.includes('55 bis 70 Millionen'));

  pruefe('„Der Zweite Weltkrieg" steht als Modul 17 hinter „Weimarer Republik"',
    alleThemen[16] === thema && alleThemen[15].id === 'weimar-ns');
}
