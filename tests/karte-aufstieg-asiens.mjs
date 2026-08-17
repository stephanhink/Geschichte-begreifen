// Prüfungen für die Karte zum Thema „Der Aufstieg Asiens und die Zukunft des
// Westens" — der Abschluss der App — und für das, was das Themen-Modul an
// der Karte hängen hat.
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe:
// läuft mit blankem `node`.
//
//   1. Vollständigkeit und Aufbau (Phasen, Punkte, Bewegungen, Beschriftungen).
//   2. Atlas-Gegenprobe: Liegen bekannte Küstenorte von Lissabon bis Jakarta
//      auf der gezeichneten Küste? Und liegt mitten im Binnenland oder auf
//      offener See keine? Die Landmarken liegen bewusst NICHT auf den
//      Eckpunkten des Kartenmoduls — geprüft wird die gezeichnete Linie und
//      nicht die abgeschriebene Zahl (nachrechenbar mit
//      `node tools/pruef-aufstieg-asiens.mjs`).
//   3. Die Aussage steckt in der Geometrie: China wächst zwischen 1955–1968
//      und 2024 auf das Doppelte, Japans zweite Lage wandert von
//      Deutschland über Japan nach China (die zweitgrößte Volkswirtschaft
//      der Welt zu drei verschiedenen Zeitpunkten), Vietnam taucht erst
//      2024 auf, die DDR verschwindet nach 1990.
//   4. Die Bewegungen hängen an den Info-Punkten: der Marshallplan kommt von
//      außerhalb des Bildes nach Frankfurt, die Werkbank wandert von Japan
//      über Korea/Taiwan nach China.
//   5. TONE-REGEL (CLAUDE.md, Zusatzregel für Themen mit Gegenwartsbezug):
//      Die Perspektive muss ihre unbequemen Stellen selbst benennen
//      (Exportabhängigkeit, versäumte Digitalisierung, Demografie,
//      langsames Wachstum), sie muss die Betreiber-These „sterbendes Land?"
//      mit der Unterscheidung relativ/absolut fair behandeln, sie muss den
//      asiatischen Aufstieg ohne Herablassung UND ohne Panik würdigen, und
//      sie muss die Taiwan-Frage sachlich behandeln. Keine Quizfrage darf
//      nach Schuld oder danach fragen, wessen System „besser" ist.
//   6. Der Test ist zustandstolerant: Er ist mit dem Zwischenstand (nur die
//      Sicht des Westens) grün und bleibt es, wenn Hermes weitere Stimmen
//      und die endgültige Synthese ergänzt (Muster der Runden 8–21).
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { pruefeKarte, KARTEN_PUNKT_TYPEN } = require('../utils/themen/schema.js');
const { erstelleProjektion } = require('../utils/karte-geo.js');
const { themaNachId, alleThemen } = require('../utils/themen/index.js');
const { abschnitteFuer } = require('../utils/lernformat.js');

/**
 * Der Kartenausschnitt, wie ihn utils/themen/karten/aufstieg-asiens.js
 * aufspannt. Steht hier noch einmal, damit die Atlas-Gegenprobe rechnen kann —
 * dass er stimmt, prüft der Test über die daraus folgende Höhe.
 */
const RAHMEN = { minLon: -10, maxLon: 145, minLat: -10, maxLat: 58, breite: 700 };

/** Wie viele SVG-Einheiten ein Längengrad breit ist — der Maßstab der Probe. */
const EINHEITEN_JE_GRAD = RAHMEN.breite / (RAHMEN.maxLon - RAHMEN.minLon);

/** Die Eckpunkte eines Pfades aus seinem `d`-Attribut. */
function eckpunkte(d) {
  const zahlen = (d.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  const paare = [];
  for (let i = 0; i + 1 < zahlen.length; i += 2) paare.push([zahlen[i], zahlen[i + 1]]);
  return paare.filter((_, i) => i % 3 === 0);
}

/** Die einzelnen geschlossenen Ringe eines Pfades. */
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
  const thema = themaNachId('aufstieg-asiens');
  pruefe('„Der Aufstieg Asiens und die Zukunft des Westens" ist als Thema registriert', Boolean(thema));
  const karte = thema.karte;
  pruefe('„Der Aufstieg Asiens und die Zukunft des Westens" bringt eine Karte mit', Boolean(karte));

  // --- 1. Aufbau -----------------------------------------------------------
  pruefe('Aufstieg-Asiens-Karte: erfüllt das Karten-Schema', pruefeKarte(karte).length === 0);
  pruefe('Aufstieg-Asiens-Karte: hat genau 3 Phasen — 1955–1968, 1990, 2024',
    karte.phasen.length === 3);
  pruefe('Aufstieg-Asiens-Karte: hat 6 bis 8 Info-Punkte',
    karte.punkte.length >= 6 && karte.punkte.length <= 8);
  pruefe('Aufstieg-Asiens-Karte: hat 3 bis 5 Bewegungen',
    karte.bewegungen.length >= 3 && karte.bewegungen.length <= 5);
  pruefe('Aufstieg-Asiens-Karte: jeder Punkt-Typ ist ein bekannter',
    karte.punkte.every((punkt) => KARTEN_PUNKT_TYPEN.includes(punkt.typ)));
  pruefe('Aufstieg-Asiens-Karte: jeder Info-Punkt hat einen ausgeführten Text',
    karte.punkte.every((punkt) => punkt.text.trim().length > 200));
  pruefe('Aufstieg-Asiens-Karte: jede Bewegung hat einen ausgeführten Text',
    karte.bewegungen.every((b) => b.text.trim().length > 200));
  pruefe('Aufstieg-Asiens-Karte: jede Phase erklärt sich in einem Hinweis',
    karte.phasen.every((p) => typeof p.hinweis === 'string' && p.hinweis.length > 40));
  pruefe('Aufstieg-Asiens-Karte: die Phasen-ids sind eindeutig',
    new Set(karte.phasen.map((p) => p.id)).size === karte.phasen.length);

  const labels = karte.phasen.map((p) => p.label).join(' | ');
  for (const jahr of ['1955', '1990', '2024']) {
    pruefe(`Aufstieg-Asiens-Karte: die Jahreszahl ${jahr} steht auf dem Umschalter`,
      labels.includes(jahr));
  }

  const imBild = ([x, y]) => x >= 0 && x <= karte.breite && y >= 0 && y <= karte.hoehe;
  pruefe('Aufstieg-Asiens-Karte: alle Info-Punkte liegen im Bild',
    karte.punkte.every((punkt) => imBild([punkt.x, punkt.y])));
  pruefe('Aufstieg-Asiens-Karte: alle Bewegungen liegen im Bild',
    karte.bewegungen.every((b) => [b.von, b.nach, ...(b.ueber || [])].every(imBild)));
  pruefe('Aufstieg-Asiens-Karte: alle Beschriftungen liegen im Bild',
    (karte.beschriftungen || []).every((b) => imBild([b.x, b.y])));

  // --- 2. Die Erzählung steckt in der Geometrie -----------------------------
  const [phase1, phase2, phase3] = karte.phasen;

  // China wächst über die drei Phasen deutlich — das ist die Aussage dieses
  // Kapitels als Rechnung: dieselbe Fläche, aber ein ganz anderes Gewicht.
  const china = karte.phasen.map((p) => groesseVon(p, /^Volksrepublik China/));
  pruefe('Aufstieg-Asiens-Karte: China steht auf jeder Phase', china.every((c) => c > 0));
  pruefe('Aufstieg-Asiens-Karte: Chinas Fläche verdoppelt sich zwischen 1990 und 2024 (die zweite Lage)',
    china[2] > china[1] * 1.5);
  pruefe('Aufstieg-Asiens-Karte: Chinas Fläche ist 1955–1968 und 1990 gleich groß',
    Math.abs(china[0] - china[1]) < 0.01);

  // Japan steht auf jeder Phase, seine reine Landfläche ändert sich nicht —
  // nur ob die zweite, dunklere Lage dazukommt.
  const japan = karte.phasen.map((p) => groesseVon(p, /^Japan/));
  pruefe('Aufstieg-Asiens-Karte: Japan steht auf jeder Phase', japan.every((j) => j > 0));
  pruefe('Aufstieg-Asiens-Karte: Japans Fläche ist 1990 doppelt so groß wie 1955–1968 und 2024 (zweite Lage nur 1990)',
    japan[1] > japan[0] * 1.5 && japan[1] > japan[2] * 1.5 &&
    Math.abs(japan[0] - japan[2]) < 1);

  // Die DDR verschwindet nach der Wiedervereinigung.
  const ddr = karte.phasen.map((p) => groesseVon(p, /^Deutsche Demokratische/));
  pruefe('Aufstieg-Asiens-Karte: die DDR steht nur in der ersten Phase',
    ddr[0] > 0 && ddr[1] === 0 && ddr[2] === 0);

  // Vietnam taucht erst 2024 auf (Kopf der Kartendatei, Festlegung 2).
  const vietnam = karte.phasen.map((p) => groesseVon(p, /^Vietnam/));
  pruefe('Aufstieg-Asiens-Karte: Vietnam steht erst 2024 auf der Karte',
    vietnam[0] === 0 && vietnam[1] === 0 && vietnam[2] > 0);

  // Die zweite, deckungsgleiche Lage wandert: BRD -> Japan -> China.
  pruefe('Aufstieg-Asiens-Karte: die zweite Lage erklärt sich in jeder Phase im Titel',
    karte.phasen.every((p) => p.flaechen.some((f) => /zweite Lage/.test(f.titel))));
  const zweiteLageTitel = karte.phasen.map(
    (p) => p.flaechen.find((f) => /zweite Lage/.test(f.titel)).titel,
  );
  pruefe('Aufstieg-Asiens-Karte: die zweite Lage ist 1955–1968 die Bundesrepublik',
    /Bundesrepublik/.test(zweiteLageTitel[0]));
  pruefe('Aufstieg-Asiens-Karte: die zweite Lage ist 1990 Japan',
    /^Japan/.test(zweiteLageTitel[1]));
  pruefe('Aufstieg-Asiens-Karte: die zweite Lage ist 2024 die Volksrepublik China',
    /Volksrepublik China/.test(zweiteLageTitel[2]));

  // Die Titel tragen das Gewicht (Zahlen), nicht nur die Fläche.
  const titel1 = phase1.flaechen.map((f) => f.titel).join(' | ');
  const titel2 = phase2.flaechen.map((f) => f.titel).join(' | ');
  const titel3 = phase3.flaechen.map((f) => f.titel).join(' | ');
  const alleTitel = `${titel1} | ${titel2} | ${titel3}`;
  pruefe('Aufstieg-Asiens-Karte: Taiwan trägt in jeder Phase den Hinweis auf den umstrittenen Status',
    karte.phasen.every((p) =>
      p.flaechen.filter((f) => /^Taiwan/.test(f.titel)).every((f) => /beansprucht/.test(f.titel))));
  pruefe('Aufstieg-Asiens-Karte: 2024 nennt TSMC bzw. die Halbleiter',
    /Halbleiter/.test(titel3));
  pruefe('Aufstieg-Asiens-Karte: 2024 nennt Indien als bevölkerungsreichstes Land',
    /bevölkerungsreichste/.test(titel3));
  pruefe('Aufstieg-Asiens-Karte: keine Fläche wertet mit Wörtern wie „überlegen" oder „unterlegen"',
    !/überlegen|unterlegen|besseres System|Kopie/i.test(alleTitel));

  // --- 3. Die Festlegungen als Rechnung -------------------------------------
  const geo = erstelleProjektion(RAHMEN);
  pruefe('Aufstieg-Asiens-Karte: die Höhe passt zum angenommenen Ausschnitt', geo.hoehe === karte.hoehe);
  pruefe('Aufstieg-Asiens-Karte: die Breite passt zum angenommenen Ausschnitt', geo.breite === karte.breite);

  /** Liegt ein geografischer Ort in einer Fläche dieser Phase? */
  const liegtIn = (phase, muster, lon, lat) => {
    const punkt = geo.punkt(lon, lat);
    return phase.flaechen
      .filter((f) => muster.test(f.titel))
      .some((f) => ringe(f.d).some((ring) => imVieleck(punkt, ring)));
  };

  const EUROPA = /Gründerstaaten|Europäische (Wirtschaftsgemeinschaft|Gemeinschaft|Union)/;
  const CHINA = /^Volksrepublik China/;
  const JAPAN = /^Japan/;
  const INDIEN = /^Indien/;
  const KOREA = /^Republik Korea/;
  const TAIWAN = /^Taiwan/;

  pruefe('Aufstieg-Asiens-Karte: Frankfurt, Paris und Rom liegen in jeder Phase in der europäischen Fläche',
    karte.phasen.every((p) => liegtIn(p, EUROPA, 8.68, 50.11)) &&
    karte.phasen.every((p) => liegtIn(p, EUROPA, 2.35, 48.86)) &&
    karte.phasen.every((p) => liegtIn(p, EUROPA, 12.5, 41.9)));
  pruefe('Aufstieg-Asiens-Karte: Leipzig und Berlin liegen 1955–1968 in der DDR und nicht in der europäischen Fläche',
    liegtIn(phase1, /^Deutsche Demokratische/, 12.37, 51.34) &&
    !liegtIn(phase1, EUROPA, 12.37, 51.34) &&
    liegtIn(phase1, /^Deutsche Demokratische/, 13.4, 52.52));
  pruefe('Aufstieg-Asiens-Karte: Leipzig und Berlin liegen ab 1990 in der europäischen Fläche',
    liegtIn(phase2, EUROPA, 12.37, 51.34) && liegtIn(phase3, EUROPA, 13.4, 52.52));
  pruefe('Aufstieg-Asiens-Karte: Wien, Bern, Madrid, London und Warschau gehören in keiner Phase zur eingefärbten europäischen Fläche',
    ['Wien', 'Bern', 'Madrid', 'London', 'Warschau']
      .map((_, i) => [[16.37, 48.21], [7.45, 46.95], [-3.7, 40.42], [-0.13, 51.51], [21.0, 52.23]][i])
      .every(([lon, lat]) => karte.phasen.every((p) => !liegtIn(p, EUROPA, lon, lat))));

  pruefe('Aufstieg-Asiens-Karte: Tokio und Osaka liegen in jeder Phase in Japan',
    karte.phasen.every((p) => liegtIn(p, JAPAN, 139.69, 35.69)) &&
    karte.phasen.every((p) => liegtIn(p, JAPAN, 135.5, 34.7)));
  pruefe('Aufstieg-Asiens-Karte: Peking, Chengdu und Lhasa liegen in jeder Phase in China',
    karte.phasen.every((p) => liegtIn(p, CHINA, 116.4, 39.9)) &&
    karte.phasen.every((p) => liegtIn(p, CHINA, 104.07, 30.67)) &&
    karte.phasen.every((p) => liegtIn(p, CHINA, 91.1, 29.65)));
  pruefe('Aufstieg-Asiens-Karte: Delhi und Bengaluru liegen in jeder Phase in Indien',
    karte.phasen.every((p) => liegtIn(p, INDIEN, 77.2, 28.6)) &&
    karte.phasen.every((p) => liegtIn(p, INDIEN, 77.59, 12.97)));
  pruefe('Aufstieg-Asiens-Karte: Seoul liegt in jeder Phase in der Republik Korea',
    karte.phasen.every((p) => liegtIn(p, KOREA, 126.98, 37.57)));
  pruefe('Aufstieg-Asiens-Karte: Pjöngjang liegt in keiner Phase in der Republik Korea',
    karte.phasen.every((p) => !liegtIn(p, KOREA, 125.75, 39.03)));
  pruefe('Aufstieg-Asiens-Karte: Taipeh liegt in jeder Phase auf der Taiwan-Fläche',
    karte.phasen.every((p) => liegtIn(p, TAIWAN, 121.56, 25.03)));
  pruefe('Aufstieg-Asiens-Karte: Hanoi und Ho-Chi-Minh-Stadt liegen erst 2024 in Vietnam',
    !liegtIn(phase1, /^Vietnam/, 105.85, 21.03) && !liegtIn(phase2, /^Vietnam/, 105.85, 21.03) &&
    liegtIn(phase3, /^Vietnam/, 105.85, 21.03) &&
    liegtIn(phase3, /^Vietnam/, 106.7, 10.78));

  // Orte, die zu keiner eingefärbten Fläche gehören (Festlegung 2 im Kopf).
  for (const [name, lon, lat] of [
    ['Ulaanbaatar', 106.9, 47.9],
    ['Bangkok', 100.5, 13.75],
    ['Dhaka', 90.4, 23.8],
    ['Islamabad', 73.06, 33.7],
    ['Moskau', 37.62, 55.75],
  ]) {
    pruefe(`Aufstieg-Asiens-Karte: ${name} gehört in keiner Phase zu einer eingefärbten Fläche`,
      karte.phasen.every((p) =>
        !liegtIn(p, EUROPA, lon, lat) && !liegtIn(p, CHINA, lon, lat) && !liegtIn(p, JAPAN, lon, lat) &&
        !liegtIn(p, INDIEN, lon, lat) && !liegtIn(p, KOREA, lon, lat) && !liegtIn(p, TAIWAN, lon, lat)));
  }

  // --- 4. Atlas-Gegenprobe ---------------------------------------------------
  const kuestenpunkte = karte.basis
    .filter((teil) => teil.art === 'land')
    .flatMap((teil) => eckpunkte(teil.d));
  pruefe('Aufstieg-Asiens-Karte: es gibt Küstenlinien zu prüfen', kuestenpunkte.length > 400);

  /** Abstand einer geografischen Landmarke zur nächsten gezeichneten Küste. */
  const abstandZurKueste = (lon, lat) => {
    const [x, y] = geo.punkt(lon, lat);
    return kuestenpunkte.reduce(
      (naechster, [kx, ky]) => Math.min(naechster, Math.hypot(kx - x, ky - y)),
      Infinity,
    );
  };

  // Toleranz ein voller Längengrad — 4,5 SVG-Einheiten bei diesem Maßstab,
  // der gröbste der App (Kopf der Kartendatei).
  const TOLERANZ = EINHEITEN_JE_GRAD;
  // Bewusst NICHT die exakten Eckpunkte des Kartenmoduls — viele Küstenorte
  // stehen dort als kommentierte Koordinate (z. B. „// Aden"). Geprüft wird
  // deshalb ein Punkt nahe der jeweiligen Stadt, nicht die abgeschriebene
  // Zahl (siehe die Gegenprobe zur Gegenprobe direkt danach).
  const landmarken = [
    ['nahe Lissabon', -9.14, 38.71],
    ['nahe Brest in der Bretagne', -4.65, 48.5],
    ['nahe Rotterdam', 4.29, 51.92],
    ['nahe Venedig', 12.2, 45.55],
    ['nahe Izmir', 26.95, 38.3],
    ['nahe Alexandria', 29.75, 31.1],
    ['nahe Aden', 44.85, 12.65],
    ['nahe Maskat', 58.78, 23.48],
    ['nahe Karatschi', 67.15, 24.72],
    ['nahe Mumbai', 73.0, 18.82],
    ['nahe Chennai', 80.12, 12.95],
    ['nahe Kolkata', 88.3, 21.82],
    ['nahe Rangun', 96.02, 16.65],
    ['nahe Singapur', 103.7, 1.42],
    ['nahe Ho-Chi-Minh-Stadt', 106.52, 10.62],
    ['nahe Hongkong', 114.0, 22.2],
    ['nahe Schanghai', 121.6, 31.22],
    ['nahe Busan', 128.95, 34.98],
    ['die Bucht von Tokio', 139.85, 35.4],
    ['nahe der Manila-Bucht', 120.42, 14.28],
    ['nahe Jakarta', 106.62, -6.22],
    ['nahe Mombasa', 39.5, -3.92],
  ];
  for (const [name, lon, lat] of landmarken) {
    pruefe(`Aufstieg-Asiens-Karte: ${name} liegt auf der gezeichneten Küste`,
      abstandZurKueste(lon, lat) < TOLERANZ);
  }

  // Und die Gegenprobe zur Gegenprobe: Keiner dieser Orte darf zugleich ein
  // Eckpunkt des Kartenmoduls sein, sonst prüft der Test seine eigene Vorlage.
  pruefe('Aufstieg-Asiens-Karte: keine Landmarke ist als Eckpunkt abgeschrieben',
    landmarken.every(([, lon, lat]) => abstandZurKueste(lon, lat) > EINHEITEN_JE_GRAD * 0.1));

  // Im Binnenland und auf offener See darf keine Küste liegen, sonst wäre der
  // Test durch schiere Punktdichte immer erfüllt.
  const abseits = [
    ['mitten in Frankreich', 2.5, 46.5],
    ['mitten in Deutschland', 10.5, 51.0],
    ['mitten in Polen', 20.0, 52.0],
    ['mitten in der Mongolei', 103.0, 47.0],
    ['mitten in Kasachstan', 68.0, 48.0],
    ['mitten in Zentralindien', 79.0, 22.0],
    ['mitten in China (Sichuan-Becken)', 104.5, 30.5],
    ['mitten in Laos', 103.0, 18.0],
    ['mitten im offenen Atlantik', -25.0, 30.0],
    ['mitten im offenen Indischen Ozean', 70.0, -5.0],
    ['mitten im offenen Pazifik östlich von Japan', 155.0, 30.0],
    ['mitten im offenen Südchinesischen Meer', 114.0, 13.0],
  ];
  for (const [wo, lon, lat] of abseits) {
    pruefe(`Aufstieg-Asiens-Karte: ${wo} liegt keine Küste`,
      abstandZurKueste(lon, lat) > TOLERANZ * 2);
  }

  // --- 5. Der Untergrund -----------------------------------------------------
  pruefe('Aufstieg-Asiens-Karte: jede Landmasse ist ein geschlossener Pfad',
    karte.basis.filter((teil) => teil.art === 'land').every((teil) => teil.d.trim().endsWith('Z')));
  pruefe('Aufstieg-Asiens-Karte: mindestens zwanzig Landmassen und Inseln sind gezeichnet',
    karte.basis.filter((teil) => teil.art === 'land').length >= 20);
  pruefe('Aufstieg-Asiens-Karte: mindestens acht Flüsse sind gezeichnet',
    karte.basis.filter((teil) => teil.art === 'fluss').length >= 8);
  const grund = karte.basis[0];
  pruefe('Aufstieg-Asiens-Karte: das Meer liegt als Untergrund unter allem',
    grund.art === 'grund' && grund.d.includes(String(karte.breite)));

  // --- 6. Die Info-Punkte ------------------------------------------------------
  const punkte = Object.fromEntries(karte.punkte.map((punkt) => [punkt.id, punkt]));
  for (const id of ['frankfurt', 'tokio', 'seoul', 'taipeh', 'shenzhen', 'mumbai', 'singapur']) {
    pruefe(`Aufstieg-Asiens-Karte: „${id}" ist ein Info-Punkt`, Boolean(punkte[id]));
  }
  pruefe('Aufstieg-Asiens-Karte: Frankfurt nennt die Währungsreform von 1948',
    punkte.frankfurt.text.includes('1948') && punkte.frankfurt.text.includes('Kopfgeld'));
  pruefe('Aufstieg-Asiens-Karte: Tokio nennt sowohl das Wachstum als auch die verlorenen Jahrzehnte',
    punkte.tokio.text.includes('9 Prozent') && punkte.tokio.text.includes('verlorenen Jahrzehnte'));
  pruefe('Aufstieg-Asiens-Karte: Seoul nennt den Weg von der Armut zum Wohlstand mit Zahlen',
    punkte.seoul.text.includes('100 Dollar') && punkte.seoul.text.includes('36 000 Dollar'));
  pruefe('Aufstieg-Asiens-Karte: Taipeh benennt den umstrittenen Status sachlich',
    punkte.taipeh.text.includes('Taipeh') && punkte.taipeh.text.includes('Volksrepublik China'));
  pruefe('Aufstieg-Asiens-Karte: Shenzhen nennt Deng Xiaoping und die Armutsbekämpfung',
    punkte.shenzhen.text.includes('Deng Xiaoping') && punkte.shenzhen.text.includes('Armut'));
  pruefe('Aufstieg-Asiens-Karte: Mumbai nennt die Reformen von 1991',
    punkte.mumbai.text.includes('1991') && punkte.mumbai.text.includes('Manmohan Singh'));
  pruefe('Aufstieg-Asiens-Karte: Singapur benennt Aufschwung UND die politischen Einschränkungen',
    punkte.singapur.text.includes('Lee Kuan Yew') && punkte.singapur.text.includes('Opposition'));

  // --- 7. Die Bewegungen --------------------------------------------------------
  const bewegung = Object.fromEntries(karte.bewegungen.map((b) => [b.id, b]));
  for (const id of ['marshallplan', 'werkbank-ostasien', 'werkbank-china']) {
    pruefe(`Aufstieg-Asiens-Karte: die Bewegung „${id}" ist da`, Boolean(bewegung[id]));
  }
  const beiPunkt = (paar, id) =>
    Math.hypot(paar[0] - punkte[id].x, paar[1] - punkte[id].y) < 1;

  pruefe('Aufstieg-Asiens-Karte: der Marshallplan endet in Frankfurt',
    beiPunkt(bewegung.marshallplan.nach, 'frankfurt'));
  pruefe('Aufstieg-Asiens-Karte: der Marshallplan nennt die Zahl und den Zeitraum',
    bewegung.marshallplan.text.includes('1948') && bewegung.marshallplan.text.includes('13 Milliarden'));

  pruefe('Aufstieg-Asiens-Karte: die Werkbank wandert von Tokio nach Taipeh, über Seoul',
    beiPunkt(bewegung['werkbank-ostasien'].von, 'tokio') &&
    beiPunkt(bewegung['werkbank-ostasien'].nach, 'taipeh'));
  pruefe('Aufstieg-Asiens-Karte: die Werkbank wandert weiter nach Shenzhen',
    beiPunkt(bewegung['werkbank-china'].von, 'taipeh') &&
    beiPunkt(bewegung['werkbank-china'].nach, 'shenzhen'));

  // --- 8. Beschriftungen -------------------------------------------------------
  const beschriftungen = karte.beschriftungen || [];
  const texte = beschriftungen.map((b) => b.text);
  for (const name of ['Atlantik', 'Mittelmeer', 'Indischer Ozean', 'Pazifischer Ozean', 'Europa', 'Asien']) {
    pruefe(`Aufstieg-Asiens-Karte: „${name}" ist beschriftet`, texte.includes(name));
  }
  pruefe('Aufstieg-Asiens-Karte: es gibt Beschriftungen für Land und Meer',
    beschriftungen.some((b) => b.art === 'land') && beschriftungen.some((b) => b.art === 'meer'));

  // --- 9. Zusammenspiel mit dem Lernformat --------------------------------------
  pruefe('Lernformat: „Der Aufstieg Asiens und die Zukunft des Westens" zeigt den Karten-Abschnitt',
    abschnitteFuer(thema).some((a) => a.id === 'karte'));
  pruefe('Lernformat: der Karten-Abschnitt steht direkt hinter dem Aufhänger',
    abschnitteFuer(thema).findIndex((a) => a.id === 'karte') === 1);

  // --- 10. Das Modul selbst ------------------------------------------------------
  // Runde 22 legt nur die Sicht des Westens an (Opus); die Sichtweisen
  // Asiens ergänzt Hermes danach. Der generische Schema-Test in
  // tests/themen.mjs nimmt alle Perspektiven automatisch mit — hier steht
  // nur, was für dieses Thema besonders gilt.
  const westen = thema.perspektiven.find((p) => p.id === 'westen-sicht');
  /**
   * Die Perspektive als Fließtext — Zeilenumbrüche zu einfachen Leerzeichen.
   *
   * Die Texte in utils/themen/ sind als Zeilen-Array notiert und mit \n
   * zusammengesetzt; ein gesuchter Begriff kann also mitten im Umbruch
   * stehen. Geprüft wird deshalb der Fließtext.
   */
  const fliesstext = westen.text.replace(/\s+/g, ' ');
  pruefe('„Der Aufstieg Asiens": die Sicht des Westens ist da und stammt von Opus',
    Boolean(westen) && westen.stimme === 'Opus');
  pruefe('„Der Aufstieg Asiens": die Perspektive nennt sich gleichwertig zu den anderen Stimmen',
    fliesstext.includes('gleichwertig'));
  pruefe('„Der Aufstieg Asiens": die Reihenfolge wird ausdrücklich nicht als Rangfolge ausgegeben',
    fliesstext.includes('keine Rangfolge'));
  pruefe('„Der Aufstieg Asiens": die Perspektive öffnet die Tür zu den weiteren Stimmen',
    fliesstext.includes('Sichtweisen Asiens') && fliesstext.includes('Hermes'));
  pruefe('„Der Aufstieg Asiens": die Perspektive sagt selbst, dass die Gegenwart offen ist',
    fliesstext.includes('nicht abgeschlossen'));

  // Die Stationen des Wiederaufbaus (Betreiber-Vorgabe 1).
  for (const stichwort of [
    'Währungsreform', '20. Juni 1948', 'Marshallplan', 'Soziale Marktwirtschaft',
    'Wirtschaftswunder', 'Vertriebene', 'Ludwig Erhard',
  ]) {
    pruefe(`„Der Aufstieg Asiens": die Perspektive erzählt von „${stichwort}"`,
      fliesstext.includes(stichwort));
  }
  pruefe('„Der Aufstieg Asiens": das Wirtschaftswunder wird fair eingeordnet, kein Heldenmythos',
    fliesstext.includes('kein Wunder') || fliesstext.includes('war deshalb kein Wunder'));
  pruefe('„Der Aufstieg Asiens": die Zerstörung und die harten Anfangsjahre werden benannt',
    fliesstext.includes('zerstört') && fliesstext.includes('Vertriebene'));

  // Die Betreiber-These „sterbendes Land?" — fair mit relativ/absolut.
  pruefe('„Der Aufstieg Asiens": die Betreiber-These hat einen eigenen Abschnitt',
    fliesstext.includes('„Ein sterbendes Land"?'));
  pruefe('„Der Aufstieg Asiens": relativ und absolut werden ausdrücklich unterschieden',
    fliesstext.includes('**relativ**') && fliesstext.includes('**absolut**'));
  pruefe('„Der Aufstieg Asiens": Aufholen wird ausdrücklich von Überholen unterschieden',
    fliesstext.includes('„Aufholen" ist nicht dasselbe wie „Überholen"'));
  pruefe('„Der Aufstieg Asiens": Deutschlands Rang als drittgrößte Volkswirtschaft wird genannt',
    fliesstext.includes('drittgrößte') && fliesstext.includes('4,7 Billionen'));

  // TONE-REGEL: eigene unbequeme Stellen selbst benannt.
  pruefe('„Der Aufstieg Asiens": die Perspektive benennt die eigene Exportabhängigkeit',
    fliesstext.includes('Exportabhängigkeit'));
  pruefe('„Der Aufstieg Asiens": die Perspektive benennt die versäumte Digitalisierung',
    fliesstext.includes('versäumte Digitalisierung'));
  pruefe('„Der Aufstieg Asiens": die Perspektive benennt die Demografie mit Zahlen',
    fliesstext.includes('Demografie') && fliesstext.includes('1,5 Kindern'));
  pruefe('„Der Aufstieg Asiens": die Perspektive benennt das langsame Wachstum',
    fliesstext.includes('langsame Wachstum') || fliesstext.includes('Das langsame Wachstum'));

  // Der asiatische Aufstieg wird fair gewürdigt — weder Herablassung noch Panik.
  pruefe('„Der Aufstieg Asiens": die Perspektive weist Herablassung gegenüber Asien ausdrücklich zurück',
    fliesstext.includes('Herablassend ist die Erzählung'));
  pruefe('„Der Aufstieg Asiens": die Perspektive weist German-Angst-Panik ausdrücklich zurück',
    fliesstext.includes('Panisch ist die Erzählung'));
  pruefe('„Der Aufstieg Asiens": TSMC bzw. Taiwans Halbleiterkompetenz wird anerkannt',
    fliesstext.includes('TSMC') || fliesstext.includes('kein westliches Unternehmen allein herstellen kann'));
  pruefe('„Der Aufstieg Asiens": kein Nullsummenspiel wird ausdrücklich festgehalten',
    fliesstext.includes('kein Nullsummenspiel'));

  // Die eigenen asiatischen Sorgen werden ebenfalls benannt — Symmetrie.
  for (const stichwort of ['Japan altert', 'Ein-Kind-Politik', 'Ungleichheit']) {
    pruefe(`„Der Aufstieg Asiens": die Perspektive benennt auch asiatische Sorgen („${stichwort}")`,
      fliesstext.includes(stichwort));
  }

  // Solange nur eine Stimme dasteht, muss die Synthese das sagen. Die Prüfung
  // ist zustandstolerant: Sie akzeptiert den Zwischenstand ebenso wie die
  // spätere Fassung, die die Stimmen zusammenführt (Muster der Runden 8–21).
  const weitereStimme = thema.perspektiven.find((p) => p.stimme !== 'Opus');
  if (!weitereStimme) {
    pruefe('„Der Aufstieg Asiens": die Synthese sagt offen, dass Stimmen noch fehlen',
      thema.synthese.includes('vorläufig') && thema.synthese.includes('Sichtweisen Asiens'));
    pruefe('„Der Aufstieg Asiens": die Synthese kündigt das bewusst offene Ende schon an',
      thema.synthese.includes('offen'));
  } else {
    pruefe('„Der Aufstieg Asiens": die Synthese führt die Sichtweisen zusammen',
      /Westen/.test(thema.synthese) && /Asien|China|Japan|Indien/.test(thema.synthese));
  }
  pruefe('„Der Aufstieg Asiens": die Synthese endet mit einer offenen Frage an die Zukunft, nicht mit einem Punkt',
    thema.synthese.trim().endsWith('?'));

  pruefe('„Der Aufstieg Asiens" hat mindestens 5 Quizfragen', thema.quiz.length >= 5);
  pruefe('„Der Aufstieg Asiens": jede Quizfrage hat eine gültige richtige Antwort',
    thema.quiz.every((f) => typeof f.antworten[f.richtig] === 'string'));
  pruefe('„Der Aufstieg Asiens": jede Quizfrage wird erklärt',
    thema.quiz.every((f) => f.erklaerung.trim().length > 40));
  // Die Quizfragen bleiben Wissensfragen: keine Schuldfrage, keine Frage nach
  // einem „besseren System" (Zusatzregel für sensible Themen).
  const quizText = thema.quiz.map((f) => `${f.frage} ${f.antworten.join(' ')} ${f.erklaerung}`).join(' ');
  pruefe('„Der Aufstieg Asiens": keine Quizfrage (und keine Erklärung) nennt das Wort „Schuld"',
    !/[Ss]chuld/.test(quizText));
  pruefe('„Der Aufstieg Asiens": keine Quizfrage fragt nach einem „besseren" System',
    !/besser(es)? System|überlegen(es)? System/i.test(quizText));
  pruefe('„Der Aufstieg Asiens": das Urteil ist offen gestellt', thema.urteil.frage.includes('?'));
  pruefe('„Der Aufstieg Asiens": das Urteil fragt nicht nach Schuld',
    !/[Ss]chuld/.test(thema.urteil.frage));
  pruefe('„Der Aufstieg Asiens": das Urteil bekommt einen Denkanstoß mit beiden Seiten',
    typeof thema.urteil.hinweis === 'string' && thema.urteil.hinweis.length > 40 &&
    thema.urteil.hinweis.includes('Die einen sagen') && thema.urteil.hinweis.includes('Die anderen sagen'));

  pruefe('„Der Aufstieg Asiens und die Zukunft des Westens" steht als Modul 20 hinter „Russland und der Westen"',
    alleThemen[19] === thema && alleThemen[18].id === 'russland-westen');
  // Seit Runde 23 steht dahinter noch das Zukunftskapitel „Die KI und die
  // Folgen auf die Gesellschaft" (Modul 21). „Der Aufstieg Asiens" bleibt das
  // letzte Kapitel des NEUZEIT-BOGENS — Modul 21 gehört nicht mehr dazu,
  // sondern nimmt dessen offene Schlussfrage auf.
  pruefe('„Der Aufstieg Asiens und die Zukunft des Westens" ist das letzte Kapitel des Neuzeit-Bogens',
    alleThemen[20] !== undefined
      ? alleThemen[20].id === 'ki-gesellschaft'
      : alleThemen[alleThemen.length - 1] === thema);
}
