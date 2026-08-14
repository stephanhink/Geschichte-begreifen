// Prüfungen für die Karte zum Thema „Die Kolonien" — und für das, was das
// Themen-Modul an der Karte hängen hat.
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe:
// läuft mit blankem `node`.
//
// Das Karten-Schema und die Rechenwerkzeuge aus utils/karte-geo.js prüft
// tests/karte.mjs — hier geht es nur um diese eine Karte:
//   1. Vollständigkeit und Aufbau (Phasen, Punkte, Bewegungen, Beschriftungen).
//   2. Atlas-Gegenprobe: Liegen bekannte Häfen und Kaps von Essaouira bis
//      Sittwe auf der gezeichneten Küste? Und liegt mitten in der Sahara, im
//      Kongobecken oder auf offener See keine?
//   3. Die Aussage steckt in der Geometrie: 1815 stehen zehn afrikanische
//      Staaten auf der Karte und Europa sitzt auf ein paar Küstenpunkten;
//      1914 sind von den Staaten Afrikas zwei übrig — Abessinien und Liberia.
//      Nachgerechnet wird das mit Punkt-im-Vieleck-Proben: Addis Abeba liegt
//      in KEINER Phase in einer europäischen Fläche, Timbuktu und Nairobi
//      1815 nicht und 1914 schon.
//   4. Der Kongo-Freistaat steht nur auf der mittleren Phase — und sein Titel
//      sagt, was er war: Privatbesitz eines Königs, nicht Besitz Belgiens.
//   5. TONE-REGEL für sensible Themen (CLAUDE.md): Die Perspektive muss ihre
//      unbequemen Stellen selbst benennen (Kongo, Opiumkriege, Herero und
//      Nama, Zwangsarbeit, Hungersnöte, Rassismus), die Beweggründe der
//      anderen Seite fair wiedergeben — und weder Karte noch Quiz dürfen nach
//      Schuld fragen.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { pruefeKarte, KARTEN_PUNKT_TYPEN } = require('../utils/themen/schema.js');
const { erstelleProjektion } = require('../utils/karte-geo.js');
const { themaNachId, alleThemen } = require('../utils/themen/index.js');
const { abschnitteFuer } = require('../utils/lernformat.js');

/**
 * Der Kartenausschnitt, wie ihn utils/themen/karten/die-kolonien.js aufspannt.
 * Steht hier noch einmal, damit die Atlas-Gegenprobe unten rechnen kann — dass
 * er stimmt, prüft der Test über die daraus folgende Höhe.
 */
const RAHMEN = { minLon: -20, maxLon: 95, minLat: -36, maxLat: 58, breite: 700 };

/** Wie viele SVG-Einheiten ein Längengrad breit ist — der Maßstab der Probe. */
const EINHEITEN_JE_GRAD = RAHMEN.breite / (RAHMEN.maxLon - RAHMEN.minLon);

/**
 * Die Eckpunkte eines Pfades aus seinem `d`-Attribut.
 *
 * Die Pfade bestehen nur aus M, C und Z. Bei „M x y C c1 c2 x y C …" ist jedes
 * dritte Zahlenpaar ein echter Eckpunkt, dazwischen liegen die Kontrollpunkte
 * der Rundung.
 *
 * @param {string} d
 * @returns {Array<Array<number>>}
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
 * Ein Kolonialreich besteht hier aus bis zu vierzehn Teilpfaden. Für die
 * Punkt-im-Vieleck-Probe müssen sie getrennt bleiben — sonst käme aus vierzehn
 * Ringen ein Zickzack.
 *
 * @param {string} d
 * @returns {Array<Array<Array<number>>>}
 */
function ringe(d) {
  return d
    .split('M')
    .slice(1)
    .map((teil) => eckpunkte(`M${teil}`));
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

/** Wie viele Flächen einer Phase auf ein Titelmuster passen. */
function zaehle(phase, muster) {
  return phase.flaechen.filter((f) => muster.test(f.titel)).length;
}

/**
 * @param {(name: string, ok: boolean) => void} pruefe Prüf-Funktion des Rahmens
 */
export function laufe(pruefe) {
  const thema = themaNachId('die-kolonien');
  pruefe('„Die Kolonien" ist als Thema registriert', Boolean(thema));
  const karte = thema.karte;
  pruefe('„Die Kolonien" bringt eine Karte mit', Boolean(karte));

  // --- 1. Aufbau ---------------------------------------------------------
  pruefe('Kolonien-Karte: erfüllt das Karten-Schema', pruefeKarte(karte).length === 0);
  pruefe('Kolonien-Karte: hat mindestens 3 Phasen', karte.phasen.length >= 3);
  pruefe('Kolonien-Karte: hat genau 3 Phasen — 1815, 1885, 1914', karte.phasen.length === 3);
  pruefe('Kolonien-Karte: hat 6 bis 7 Info-Punkte',
    karte.punkte.length >= 6 && karte.punkte.length <= 7);
  pruefe('Kolonien-Karte: hat 2 bis 4 Bewegungen',
    karte.bewegungen.length >= 2 && karte.bewegungen.length <= 4);
  pruefe('Kolonien-Karte: jeder Punkt-typ ist ein bekannter',
    karte.punkte.every((punkt) => KARTEN_PUNKT_TYPEN.includes(punkt.typ)));
  pruefe('Kolonien-Karte: jeder Info-Punkt hat einen ausgeführten Text',
    karte.punkte.every((punkt) => punkt.text.trim().length > 200));
  pruefe('Kolonien-Karte: jede Bewegung hat einen ausgeführten Text',
    karte.bewegungen.every((b) => b.text.trim().length > 200));
  pruefe('Kolonien-Karte: jede Phase erklärt sich in einem Hinweis',
    karte.phasen.every((p) => typeof p.hinweis === 'string' && p.hinweis.length > 40));
  pruefe('Kolonien-Karte: die Phasen-ids sind eindeutig',
    new Set(karte.phasen.map((p) => p.id)).size === karte.phasen.length);

  const labels = karte.phasen.map((p) => p.label).join(' | ');
  for (const jahr of ['1815', '1885', '1914']) {
    pruefe(`Kolonien-Karte: die Jahreszahl ${jahr} steht auf dem Umschalter`, labels.includes(jahr));
  }

  // Alles muss im Bild liegen — ein Punkt außerhalb wäre unantippbar.
  const imBild = ([x, y]) => x >= 0 && x <= karte.breite && y >= 0 && y <= karte.hoehe;
  pruefe('Kolonien-Karte: alle Info-Punkte liegen im Bild',
    karte.punkte.every((punkt) => imBild([punkt.x, punkt.y])));
  pruefe('Kolonien-Karte: alle Bewegungen liegen im Bild',
    karte.bewegungen.every((b) => [b.von, b.nach, ...(b.ueber || [])].every(imBild)));
  pruefe('Kolonien-Karte: alle Beschriftungen liegen im Bild',
    (karte.beschriftungen || []).every((b) => imBild([b.x, b.y])));

  // --- 2. Die Erzählung steckt in den Flächen ----------------------------
  const [phase1815, phase1885, phase1914] = karte.phasen;

  // 1815 stehen die Staaten Afrikas auf der Karte — als eigene, gleich
  // behandelte Flächen. Das ist die zentrale Festlegung dieser Karte.
  const AFRIKANISCHE_STAATEN = /Sokoto|Bornu|Aschanti|Dahomey|Buganda|Merina|Sultanat Sansibar|Sultanat Marokko|Sultanat Oman|Regentschaften|Abessinien|Mahdi|Samori|Ndebele|Barotse|Transvaal|Oranje-Freistaat|Zululand|Liberia|Königreich Madagaskar|Muhammad Ali/;
  pruefe('Kolonien-Karte: 1815 stehen mindestens acht afrikanische Staaten auf der Karte',
    zaehle(phase1815, AFRIKANISCHE_STAATEN) >= 8);
  pruefe('Kolonien-Karte: 1885 stehen noch mehr afrikanische Staaten auf der Karte als 1815',
    zaehle(phase1885, AFRIKANISCHE_STAATEN) > zaehle(phase1815, AFRIKANISCHE_STAATEN));
  pruefe('Kolonien-Karte: 1914 sind von den Staaten Afrikas genau zwei übrig',
    zaehle(phase1914, AFRIKANISCHE_STAATEN) === 2);
  pruefe('Kolonien-Karte: die beiden sind Abessinien und Liberia',
    zaehle(phase1914, /Abessinien/) === 1 && zaehle(phase1914, /Liberia/) === 1);
  pruefe('Kolonien-Karte: beide tragen im Titel, dass sie nie kolonisiert wurden',
    phase1914.flaechen
      .filter((f) => /Abessinien|Liberia/.test(f.titel))
      .every((f) => f.titel.includes('nie kolonisiert')));

  // Das Sokoto-Kalifat, das Aschanti-Reich und das Sultanat Sansibar stehen
  // 1815 und 1885 da — und 1914 nicht mehr. Genau das erzählt der Umschalter.
  for (const [name, muster] of [
    ['das Sokoto-Kalifat', /Sokoto/],
    ['das Aschanti-Reich', /Aschanti/],
    ['das Sultanat Sansibar', /Sansibar/],
  ]) {
    pruefe(`Kolonien-Karte: ${name} steht 1815 und 1885 auf der Karte und 1914 nicht mehr`,
      zaehle(phase1815, muster) > 0 && zaehle(phase1885, muster) > 0 &&
      phase1914.flaechen.filter((f) => muster.test(f.titel) && !/Vereinigte Königreich/.test(f.titel)).length === 0);
  }

  // Der Kongo-Freistaat gab es nur zwischen 1885 und 1908 — und er gehörte
  // nicht Belgien, sondern einem Mann.
  pruefe('Kolonien-Karte: der Kongo-Freistaat steht nur auf der mittleren Phase',
    zaehle(phase1815, /Kongo-Freistaat/) === 0 &&
    zaehle(phase1885, /Kongo-Freistaat/) === 1 &&
    zaehle(phase1914, /Kongo-Freistaat/) === 0);
  const freistaat = phase1885.flaechen.find((f) => /Kongo-Freistaat/.test(f.titel));
  pruefe('Kolonien-Karte: der Titel sagt, dass der Freistaat Privatbesitz Leopolds II. war',
    freistaat.titel.includes('Leopold II.') && freistaat.titel.includes('nicht Besitz Belgiens'));
  pruefe('Kolonien-Karte: 1914 heißt dasselbe Gebiet Belgisch-Kongo',
    zaehle(phase1914, /Belgisch-Kongo/) === 1);

  // 1815 hatten Deutschland, Belgien und Italien keine Kolonien — und keine
  // dieser Mächte darf auf der ersten Phase stehen.
  const alleTitel1815 = phase1815.flaechen.map((f) => f.titel).join(' | ');
  pruefe('Kolonien-Karte: 1815 kommt kein deutsches, belgisches oder italienisches Gebiet vor',
    !/Deutsch|Belgi|Italien/.test(alleTitel1815));
  pruefe('Kolonien-Karte: 1885 stehen die ersten deutschen Schutzgebiete auf der Karte',
    zaehle(phase1885, /Deutsche Reich/) === 1);

  // Indien: erst eine Aktiengesellschaft, dann eine Kronkolonie.
  pruefe('Kolonien-Karte: 1815 heißt das britische Gebiet in Indien nach der East India Company',
    zaehle(phase1815, /East India Company/) === 1 && zaehle(phase1815, /Britisch-Indien/) === 0);
  pruefe('Kolonien-Karte: 1885 und 1914 heißt es Britisch-Indien',
    zaehle(phase1885, /Britisch-Indien/) === 1 && zaehle(phase1914, /Britisch-Indien/) === 1);
  pruefe('Kolonien-Karte: 1914 trägt Britisch-Indien das „Juwel der Krone" im Titel',
    phase1914.flaechen.some((f) => f.titel.includes('Juwel der Krone')));

  // Die Hinweise müssen die Darstellungsregeln selbst aussprechen.
  pruefe('Kolonien-Karte: der Hinweis von 1815 sagt, dass leer bleibt, wo keine Grenze war',
    phase1815.hinweis.includes('Leer bleibt') && phase1815.hinweis.includes('Grenze'));
  pruefe('Kolonien-Karte: der Hinweis von 1815 sagt, dass die Farbe nicht unterscheidet',
    phase1815.hinweis.includes('gleich einfärbt') && phase1815.hinweis.includes('Titel'));
  pruefe('Kolonien-Karte: der Hinweis von 1885 benennt, dass in Berlin kein Afrikaner am Tisch saß',
    phase1885.hinweis.includes('Berlin') && phase1885.hinweis.includes('saß von ihnen niemand'));
  pruefe('Kolonien-Karte: der Hinweis von 1914 nennt Abessinien und Liberia als die zwei Ausnahmen',
    phase1914.hinweis.includes('Abessinien') && phase1914.hinweis.includes('Liberia'));
  pruefe('Kolonien-Karte: der Hinweis von 1914 sagt selbst, dass Verwaltung nicht überall hinreichte',
    phase1914.hinweis.includes('beanspruchtes und verwaltetes Gebiet'));

  // --- 3. Die Aussage als Rechnung ---------------------------------------
  const geo = erstelleProjektion(RAHMEN);
  pruefe('Kolonien-Karte: die Höhe passt zum angenommenen Ausschnitt', geo.hoehe === karte.hoehe);
  pruefe('Kolonien-Karte: die Breite passt zum angenommenen Ausschnitt', geo.breite === karte.breite);

  /** Liegt ein geografischer Ort in einer Fläche dieser Phase? */
  const liegtIn = (phase, muster, lon, lat) => {
    const punkt = geo.punkt(lon, lat);
    return phase.flaechen
      .filter((f) => muster.test(f.titel))
      .some((f) => ringe(f.d).some((ring) => imVieleck(punkt, ring)));
  };

  /** Alles, was einer europäischen Macht gehörte oder von ihr verwaltet wurde. */
  const EUROPAEISCH = /Vereinigte Königreich|East India Company|Britisch-Indien|Frankreich|Deutsche Reich|Belgi|Portugal|Spanien|Italien|Kongo-Freistaat|Ägypten — seit 1882/;

  // Der Kern des Kapitels: Was 1815 niemandem in Europa gehörte, gehört 1914
  // fast überall jemandem in Europa.
  for (const [name, lon, lat] of [
    ['Timbuktu', -3.0, 16.77],
    ['Tabora in Ostafrika', 32.8, -5.02],
    ['Kumasi im Aschanti-Reich', -1.62, 6.69],
    ['Antananarivo auf Madagaskar', 47.52, -18.9],
    ['Bamako am Niger', -8.0, 12.65],
  ]) {
    pruefe(`Kolonien-Karte: ${name} liegt 1815 in keiner europäischen Fläche`,
      !liegtIn(phase1815, EUROPAEISCH, lon, lat));
    pruefe(`Kolonien-Karte: ${name} liegt 1914 in einer europäischen Fläche`,
      liegtIn(phase1914, EUROPAEISCH, lon, lat));
  }

  // Und die Gegenprobe, die diese Karte fair macht: Abessinien und Liberia
  // liegen in KEINER Phase in einer europäischen Fläche.
  for (const [name, lon, lat] of [
    ['Addis Abeba', 38.75, 9.03],
    ['Monrovia', -10.8, 6.31],
  ]) {
    pruefe(`Kolonien-Karte: ${name} liegt in keiner Phase in einer europäischen Fläche`,
      karte.phasen.every((p) => !liegtIn(p, EUROPAEISCH, lon, lat)));
  }
  pruefe('Kolonien-Karte: Addis Abeba liegt in jeder Phase in Abessinien',
    karte.phasen.every((p) => liegtIn(p, /Abessinien/, 38.75, 9.03)));
  pruefe('Kolonien-Karte: Monrovia liegt 1885 und 1914 in Liberia',
    liegtIn(phase1885, /Liberia/, -10.8, 6.31) && liegtIn(phase1914, /Liberia/, -10.8, 6.31));

  // Die britische Sonderrolle als Rechnung: Kalkutta und Kapstadt sind in
  // jeder Phase britisch, Kairo erst ab 1882.
  pruefe('Kolonien-Karte: Kalkutta liegt in jeder Phase im britisch verwalteten Gebiet',
    karte.phasen.every((p) => liegtIn(p, /Vereinigte Königreich|East India Company|Britisch-Indien/, 88.36, 22.57)));
  pruefe('Kolonien-Karte: Delhi gehört 1885 und 1914 zu Britisch-Indien',
    liegtIn(phase1885, /Britisch-Indien/, 77.2, 28.6) && liegtIn(phase1914, /Britisch-Indien/, 77.2, 28.6));
  pruefe('Kolonien-Karte: Kapstadt liegt in jeder Phase im britischen Gebiet',
    karte.phasen.every((p) => liegtIn(p, /Vereinigte Königreich/, 18.42, -33.93)));
  pruefe('Kolonien-Karte: Kairo liegt 1815 nicht, 1885 und 1914 aber im britisch verwalteten Gebiet',
    !liegtIn(phase1815, EUROPAEISCH, 31.24, 30.05) &&
    liegtIn(phase1885, EUROPAEISCH, 31.24, 30.05) &&
    liegtIn(phase1914, /Vereinigte Königreich/, 31.24, 30.05));

  // Lahore und Katmandu: Britisch-Indien ist nicht der ganze Subkontinent.
  pruefe('Kolonien-Karte: Lahore liegt 1815 im Sikh-Reich und nicht bei der Company',
    liegtIn(phase1815, /Sikh/, 74.35, 31.55) && !liegtIn(phase1815, /East India Company/, 74.35, 31.55));
  pruefe('Kolonien-Karte: Katmandu liegt 1914 in Nepal und nicht in Britisch-Indien',
    liegtIn(phase1914, /Nepal/, 85.32, 27.7) && !liegtIn(phase1914, /Britisch-Indien/, 85.32, 27.7));
  pruefe('Kolonien-Karte: Kabul liegt 1914 in Afghanistan und nicht in Britisch-Indien',
    liegtIn(phase1914, /Afghanistan/, 69.2, 34.5) && !liegtIn(phase1914, /Britisch-Indien/, 69.2, 34.5));

  // Léopoldville: erst Freistaat, dann belgische Kolonie — und 1815 nichts.
  pruefe('Kolonien-Karte: Léopoldville liegt 1885 im Kongo-Freistaat',
    liegtIn(phase1885, /Kongo-Freistaat/, 15.3, -4.3));
  pruefe('Kolonien-Karte: Léopoldville liegt 1914 in Belgisch-Kongo',
    liegtIn(phase1914, /Belgisch-Kongo/, 15.3, -4.3));
  pruefe('Kolonien-Karte: Windhuk liegt 1914 im deutschen Gebiet',
    liegtIn(phase1914, /Deutsche Reich/, 17.08, -22.56));
  pruefe('Kolonien-Karte: Khartum liegt 1885 im Mahdi-Staat und 1914 im britisch verwalteten Sudan',
    liegtIn(phase1885, /Mahdi/, 32.53, 15.6) && liegtIn(phase1914, /Vereinigte Königreich/, 32.53, 15.6));
  pruefe('Kolonien-Karte: Pretoria liegt 1885 in der Südafrikanischen Republik und 1914 im britischen Gebiet',
    liegtIn(phase1885, /Transvaal/, 28.19, -25.75) &&
    liegtIn(phase1914, /Vereinigte Königreich/, 28.19, -25.75));

  // --- 4. Atlas-Gegenprobe -----------------------------------------------
  const kuestenpunkte = karte.basis
    .filter((teil) => teil.art === 'land')
    .flatMap((teil) => eckpunkte(teil.d));
  pruefe('Kolonien-Karte: es gibt Küstenlinien zu prüfen', kuestenpunkte.length > 500);

  /** Abstand einer geografischen Landmarke zur nächsten gezeichneten Küste. */
  const abstandZurKueste = (lon, lat) => {
    const [x, y] = geo.punkt(lon, lat);
    return kuestenpunkte.reduce(
      (naechster, [kx, ky]) => Math.min(naechster, Math.hypot(kx - x, ky - y)),
      Infinity,
    );
  };

  // Toleranz ein voller Längengrad — 6,1 SVG-Einheiten. Diese Karte spannt
  // 115 Längengrade auf 700 Einheiten und ist damit die gröbste der App. Die
  // Werte unten liegen absichtlich mindestens 0,1 Grad NEBEN dem nächsten
  // Eckpunkt des Kartenmoduls, damit die gezeichnete Linie geprüft wird und
  // nicht die abgeschriebene Zahl.
  const TOLERANZ = EINHEITEN_JE_GRAD;
  const landmarken = [
    ['Essaouira in Marokko', -9.77, 31.51],
    ['Bonthe auf Sherbro', -12.5, 7.53],
    ['Takoradi an der Goldküste', -1.75, 4.9],
    ['Aného in Togo', 1.6, 6.23],
    ['Port Harcourt am Nigerdelta', 7.0, 4.75],
    ['Mayumba in Gabun', 10.65, -3.42],
    ['Lobito in Angola', 13.53, -12.35],
    ['Swakopmund', 14.53, -22.68],
    ['Port Nolloth am Oranje', 16.87, -29.25],
    ['Knysna am Kap', 23.05, -34.05],
    ['Port Alfred', 26.89, -33.6],
    ['Richards Bay in Natal', 32.05, -28.8],
    ['Pebane in Mosambik', 38.15, -17.27],
    ['Lindi in Ostafrika', 39.72, -10.0],
    ['Kilifi bei Mombasa', 39.85, -3.63],
    ['Merka in Somalia', 44.77, 1.72],
    ['Bosaso am Golf von Aden', 49.18, 11.28],
    ['Mokka am Roten Meer', 43.32, 13.32],
    ['Hodeida', 42.95, 14.8],
    ['Ormara an der Makranküste', 64.63, 25.21],
    ['Kannur an der Malabarküste', 75.37, 11.87],
    ['Alappuzha in Kerala', 76.34, 9.5],
    ['Nagapattinam an der Koromandelküste', 79.84, 10.77],
    ['Krishnapatnam', 80.1, 14.28],
    ['Puri in Orissa', 85.83, 19.8],
    ['Cox’s Bazar in Bengalen', 91.97, 21.44],
    ['Sittwe in Arakan', 92.9, 20.15],
    ['Colombo auf Ceylon', 79.85, 6.93],
    ['Galle auf Ceylon', 80.22, 6.03],
    ['Trincomalee auf Ceylon', 81.23, 8.58],
    ['Mahajanga auf Madagaskar', 46.32, -15.72],
    ['Toliara auf Madagaskar', 43.67, -23.35],
    ['Huelva in Andalusien', -6.95, 37.25],
    ['Toulon', 5.93, 43.12],
    ['Valencia', -0.38, 39.47],
    ['Aschdod an der Levanteküste', 34.65, 31.8],
    ['Ostende', 2.92, 51.23],
    ['Ringkøbing in Jütland', 8.24, 56.09],
    ['Falmouth in Cornwall', -5.07, 50.15],
    ['Whitby in Yorkshire', -0.61, 54.49],
    ['Galway in Irland', -9.05, 53.27],
    ['Las Palmas auf Gran Canaria', -15.42, 28.13],
  ];
  for (const [name, lon, lat] of landmarken) {
    pruefe(`Kolonien-Karte: ${name} liegt auf der gezeichneten Küste`,
      abstandZurKueste(lon, lat) < TOLERANZ);
  }

  // Und die Gegenprobe zur Gegenprobe: Keiner dieser Orte darf zugleich ein
  // Eckpunkt des Kartenmoduls sein, sonst prüft der Test seine eigene Vorlage.
  pruefe('Kolonien-Karte: keine Landmarke ist als Eckpunkt abgeschrieben',
    landmarken.every(([, lon, lat]) => abstandZurKueste(lon, lat) > EINHEITEN_JE_GRAD * 0.1));

  // Im Binnenland und auf offener See darf keine Küste liegen, sonst wäre der
  // Test durch schiere Punktdichte immer erfüllt.
  const abseits = [
    ['mitten in der Sahara', 10.0, 22.0],
    ['mitten im Kongobecken', 22.0, -1.0],
    ['in der Kalahari', 22.0, -23.0],
    ['im Hochland Abessiniens', 38.0, 9.0],
    ['in Zentralindien', 78.0, 22.0],
    ['in Zentralasien', 65.0, 45.0],
    ['im offenen Südatlantik', -15.0, -10.0],
    ['im offenen Indischen Ozean', 62.0, -25.0],
    ['mitten in Frankreich', 2.5, 46.5],
    ['mitten in Anatolien', 33.0, 39.0],
    ['im Inneren Arabiens', 45.0, 22.0],
    ['im offenen Nordatlantik', -16.0, 45.0],
    ['im Sudan', 28.0, 15.0],
    ['in Sibirien', 70.0, 55.0],
  ];
  for (const [wo, lon, lat] of abseits) {
    pruefe(`Kolonien-Karte: ${wo} liegt keine Küste`,
      abstandZurKueste(lon, lat) > TOLERANZ * 2);
  }

  // --- 5. Der Untergrund ---------------------------------------------------
  pruefe('Kolonien-Karte: jede Landmasse ist ein geschlossener Pfad',
    karte.basis.filter((teil) => teil.art === 'land').every((teil) => teil.d.trim().endsWith('Z')));
  pruefe('Kolonien-Karte: mindestens zwölf Landmassen und Inseln sind gezeichnet',
    karte.basis.filter((teil) => teil.art === 'land').length >= 12);
  pruefe('Kolonien-Karte: mindestens zehn Flüsse sind gezeichnet',
    karte.basis.filter((teil) => teil.art === 'fluss').length >= 10);
  pruefe('Kolonien-Karte: die Binnenmeere und großen Seen sind eigene Wasserflächen',
    karte.basis.filter((teil) => teil.art === 'wasser').length >= 6);
  pruefe('Kolonien-Karte: die Wüsten sind als eigene Flächen gezeichnet',
    karte.basis.filter((teil) => teil.art === 'wueste').length >= 3);
  pruefe('Kolonien-Karte: der Sueskanal liegt als gebaute Linie auf der Karte',
    karte.basis.some((teil) => teil.art === 'kanal' && teil.fill === 'none'));
  const grund = karte.basis[0];
  pruefe('Kolonien-Karte: das Meer liegt als Untergrund unter allem',
    grund.art === 'grund' && grund.d.includes(String(karte.breite)));

  // --- 6. Die Info-Punkte --------------------------------------------------
  const punkte = Object.fromEntries(karte.punkte.map((punkt) => [punkt.id, punkt]));
  for (const id of ['london', 'berlin', 'sueskanal', 'delhi', 'kongo', 'kapstadt', 'sansibar']) {
    pruefe(`Kolonien-Karte: „${id}" ist ein Info-Punkt`, Boolean(punkte[id]));
  }
  pruefe('Kolonien-Karte: London nennt „The sun never sets" und die Flotte',
    punkte.london.text.includes('The sun never sets') && punkte.london.text.includes('Marine'));
  pruefe('Kolonien-Karte: Berlin sagt, dass kein Afrikaner eingeladen war',
    punkte.berlin.text.includes('kein einziger Afrikaner') && punkte.berlin.text.includes('1884'));
  pruefe('Kolonien-Karte: Berlin räumt mit der Lineal-Verkürzung auf',
    punkte.berlin.text.includes('Lineal') && punkte.berlin.text.includes('besetzt'));
  pruefe('Kolonien-Karte: der Sueskanal nennt 1869 und die Besetzung Ägyptens 1882',
    punkte.sueskanal.text.includes('1869') && punkte.sueskanal.text.includes('1882'));
  pruefe('Kolonien-Karte: Delhi nennt die East India Company, 1857 und 1947',
    punkte.delhi.text.includes('East India Company') &&
    punkte.delhi.text.includes('1857') &&
    punkte.delhi.text.includes('1947'));
  pruefe('Kolonien-Karte: Delhi stellt die Hungersnöte neben die Eisenbahnen',
    punkte.delhi.text.includes('Eisenbahn') && punkte.delhi.text.includes('Hungersnöte'));
  pruefe('Kolonien-Karte: Delhi gibt der indischen Sicht auf 1857 ihren eigenen Namen',
    punkte.delhi.text.includes('Unabhängigkeitskrieg'));
  pruefe('Kolonien-Karte: der Kongo benennt Kautschuk, Gewalt und die Aufdeckung',
    punkte.kongo.text.includes('Kautschuk') &&
    punkte.kongo.text.includes('verstümmelt') &&
    punkte.kongo.text.includes('Casement'));
  pruefe('Kolonien-Karte: Kapstadt benennt die Lager im Burenkrieg',
    punkte.kapstadt.text.includes('Konzentrationslager'));
  pruefe('Kolonien-Karte: Sansibar gibt beim Sklavenhandel beide Seiten wieder',
    punkte.sansibar.text.includes('Sklavenhandel') && punkte.sansibar.text.includes('sehr gelegen kam'));
  pruefe('Kolonien-Karte: Sansibar nennt den Vertrag von 1890 samt Helgoland',
    punkte.sansibar.text.includes('1890') && punkte.sansibar.text.includes('Helgoland'));

  // --- 7. Die Bewegungen ----------------------------------------------------
  const bewegung = Object.fromEntries(karte.bewegungen.map((b) => [b.id, b]));
  for (const id of ['kaproute', 'suesroute', 'karawanen', 'kautschuk']) {
    pruefe(`Kolonien-Karte: die Bewegung „${id}" ist da`, Boolean(bewegung[id]));
  }
  const beiPunkt = (paar, id) =>
    Math.hypot(paar[0] - punkte[id].x, paar[1] - punkte[id].y) < 1.5;

  pruefe('Kolonien-Karte: der alte Seeweg führt um Kapstadt herum',
    (bewegung.kaproute.ueber || []).some((punkt) => beiPunkt(punkt, 'kapstadt')));
  pruefe('Kolonien-Karte: der kurze Weg beginnt in London und führt durch den Sueskanal',
    beiPunkt(bewegung.suesroute.von, 'london') &&
    (bewegung.suesroute.ueber || []).some((punkt) => beiPunkt(punkt, 'sueskanal')));
  pruefe('Kolonien-Karte: beide Wege nach Indien enden am selben Ort',
    bewegung.kaproute.nach[0] === bewegung.suesroute.nach[0] &&
    bewegung.kaproute.nach[1] === bewegung.suesroute.nach[1]);
  pruefe('Kolonien-Karte: der kurze Weg ist auf der Karte kürzer als der alte',
    laenge(bewegung.suesroute) < laenge(bewegung.kaproute));
  pruefe('Kolonien-Karte: die Karawanen beginnen in Sansibar und laufen nach Westen',
    beiPunkt(bewegung.karawanen.von, 'sansibar') &&
    bewegung.karawanen.nach[0] < bewegung.karawanen.von[0]);
  pruefe('Kolonien-Karte: die Karawanen benennen Elfenbein und versklavte Menschen',
    bewegung.karawanen.text.includes('Elfenbein') && bewegung.karawanen.text.includes('versklavte'));
  pruefe('Kolonien-Karte: der Kautschukweg läuft über den Kongo nach Europa',
    (bewegung.kautschuk.ueber || []).some((punkt) => beiPunkt(punkt, 'kongo')) &&
    bewegung.kautschuk.nach[1] < bewegung.kautschuk.von[1]);
  pruefe('Kolonien-Karte: der Kautschukweg sagt, wo das Geld blieb',
    bewegung.kautschuk.text.includes('dort blieb das Geld'));

  // --- 8. Beschriftungen -----------------------------------------------------
  const beschriftungen = karte.beschriftungen || [];
  const texte = beschriftungen.map((b) => b.text);
  for (const name of [
    'Atlantik', 'Indischer Ozean', 'Mittelmeer', 'Rotes Meer', 'Persischer Golf',
    'Sahara', 'Kongobecken', 'Nil', 'Niger', 'Indien', 'Arabien', 'Madagaskar',
  ]) {
    pruefe(`Kolonien-Karte: „${name}" ist beschriftet`, texte.includes(name));
  }
  pruefe('Kolonien-Karte: es gibt Beschriftungen für Land und Meer',
    beschriftungen.some((b) => b.art === 'land') && beschriftungen.some((b) => b.art === 'meer'));

  // --- 9. Zusammenspiel mit dem Lernformat -----------------------------------
  pruefe('Lernformat: „Die Kolonien" zeigt den Karten-Abschnitt',
    abschnitteFuer(thema).some((a) => a.id === 'karte'));
  pruefe('Lernformat: der Karten-Abschnitt steht direkt hinter dem Aufhänger',
    abschnitteFuer(thema).findIndex((a) => a.id === 'karte') === 1);

  // --- 10. Das Modul selbst -------------------------------------------------
  // Runde 15 legt nur die Sicht der Kolonialmächte an (Opus); die Sicht der
  // kolonisierten Völker ergänzt Hermes danach. Der generische Schema-Test in
  // tests/themen.mjs nimmt alle Perspektiven automatisch mit — hier steht nur,
  // was für dieses Thema besonders gilt.
  const maechte = thema.perspektiven.find((p) => p.id === 'maechte-sicht');
  pruefe('„Die Kolonien": die Sicht der Kolonialmächte ist da und stammt von Opus',
    Boolean(maechte) && maechte.stimme === 'Opus');
  pruefe('„Die Kolonien": die Perspektive nennt sich gleichwertig zur zweiten Stimme',
    maechte.text.includes('gleichwertig'));
  pruefe('„Die Kolonien": die Perspektive öffnet die Tür zur zweiten Stimme',
    maechte.text.includes('zweite Stimme') && maechte.text.includes('kolonisierten Völker'));

  // Die Betreiber-Vorgabe: die besondere Rolle Großbritanniens ist zentral.
  for (const stichwort of [
    'The sun never sets', 'Pax Britannica', 'Juwel der Krone', 'East India Company',
    '1857', 'Kronkolonie', 'Dominions', 'Kanada', 'Australien', 'Neuseeland',
    'Royal Navy', '1947',
  ]) {
    pruefe(`„Die Kolonien": die britische Sonderrolle nennt „${stichwort}"`,
      maechte.text.includes(stichwort));
  }

  // Die übrigen Stationen des Kapitels.
  for (const stichwort of [
    'Kongokonferenz', '1884', 'Leopold II.', 'Kautschuk', 'Opiumkriege',
    'Sueskanal', '1869', 'Frankreich', 'Portugal', 'Spanien', 'Italien',
    'Faschoda', 'Marokko-Krisen', 'Adua',
  ]) {
    pruefe(`„Die Kolonien": die Perspektive erzählt von „${stichwort}"`,
      maechte.text.includes(stichwort));
  }

  // TONE-REGEL für sensible Themen (CLAUDE.md): Die eigene Erzählung muss ihre
  // unbequemen Stellen selbst benennen, statt sie der Gegenstimme zu
  // überlassen — und sie darf die andere Seite nicht verunglimpfen.
  pruefe('„Die Kolonien": die Perspektive benennt die Gewalt im Kongo selbst',
    maechte.text.includes('verstümmelt') && maechte.text.includes('Kautschuk'));
  pruefe('„Die Kolonien": die Perspektive nennt die Opiumkriege beim Namen',
    maechte.text.includes('Recht, Drogen zu verkaufen'));
  pruefe('„Die Kolonien": die Perspektive benennt den Völkermord an Herero und Nama',
    maechte.text.includes('Völkermord') && maechte.text.includes('Herero'));
  pruefe('„Die Kolonien": die Perspektive benennt die Lager im Burenkrieg',
    maechte.text.includes('Konzentrationslager'));
  pruefe('„Die Kolonien": die Perspektive benennt Zwangsarbeit und Hungersnöte',
    maechte.text.includes('Zwangsarbeit') && maechte.text.includes('Hungersnöte'));
  pruefe('„Die Kolonien": die Perspektive benennt den Rassismus als Ideologie',
    maechte.text.includes('Rassismus als Ideologie'));
  pruefe('„Die Kolonien": die Perspektive benennt die eigene Rolle im Sklavenhandel',
    maechte.text.includes('größte Sklavenhändler'));
  pruefe('„Die Kolonien": die Perspektive sagt selbst, dass „Zivilisation bringen" eine Behauptung war',
    maechte.text.includes('musste dafür erst behaupten, dort sei keine'));
  pruefe('„Die Kolonien": die Perspektive benennt ihren eigenen Quellenvorsprung',
    maechte.text.includes('Akten geführt') && maechte.text.includes('doppelt'));

  // Und sie erklärt die Gegenseite nicht zu bloßen Statisten: Widerstand,
  // Beweggründe und eigene Staatlichkeit stehen ausdrücklich da.
  pruefe('„Die Kolonien": der Widerstand wird fair wiedergegeben',
    maechte.text.includes('nachvollziehbar') && maechte.text.includes('Vaterlandsliebe'));
  for (const name of ['Samori Touré', 'Yaa Asantewaa', 'Maji-Maji', 'Menelik']) {
    pruefe(`„Die Kolonien": der Widerstand nennt „${name}"`, maechte.text.includes(name));
  }
  pruefe('„Die Kolonien": die Staatlichkeit Afrikas vor 1885 wird benannt',
    maechte.text.includes('Timbuktu') && maechte.text.includes('Sokoto-Kalifat'));

  // Solange nur eine Stimme dasteht, muss die Synthese das sagen. Die Prüfung
  // ist zustandstolerant: Sie akzeptiert den Zwischenstand ebenso wie die
  // spätere Fassung, die beide Stimmen zusammenführt (Muster der Runden 8–14).
  const zweiteStimme = thema.perspektiven.find((p) => p.stimme === 'Hermes');
  if (!zweiteStimme) {
    pruefe('„Die Kolonien": die Synthese sagt offen, dass eine Sicht fehlt',
      thema.synthese.includes('noch nicht fertig') && thema.synthese.includes('kolonisierten'));
  } else {
    pruefe('„Die Kolonien": die Synthese führt beide Sichtweisen zusammen',
      thema.synthese.includes('kolonisierten') && thema.synthese.includes('Kolonialmächte'));
  }

  pruefe('„Die Kolonien" hat 3 bis 5 Quizfragen',
    thema.quiz.length >= 3 && thema.quiz.length <= 5);
  pruefe('„Die Kolonien": jede Quizfrage hat eine gültige richtige Antwort',
    thema.quiz.every((f) => typeof f.antworten[f.richtig] === 'string'));
  pruefe('„Die Kolonien": jede Quizfrage wird erklärt',
    thema.quiz.every((f) => f.erklaerung.trim().length > 40));
  // Die Quizfragen bleiben Wissensfragen: keine Schuldfrage, keine Frage
  // danach, wem ein Land gehört (Zusatzregel für sensible Themen).
  const quizText = thema.quiz.map((f) => `${f.frage} ${f.antworten.join(' ')}`).join(' ');
  pruefe('„Die Kolonien": keine Quizfrage fragt nach Schuld',
    !/[Ss]chuld|wer war im Recht|zu Recht|wem gehört/.test(quizText));
  pruefe('„Die Kolonien": das Urteil ist offen gestellt', thema.urteil.frage.includes('?'));
  pruefe('„Die Kolonien": das Urteil fragt nach der Bilanz, nicht nach der Schuld',
    thema.urteil.frage.includes('Bilanz') && !/[Ss]chuld/.test(thema.urteil.frage));
  pruefe('„Die Kolonien": das Urteil bekommt einen Denkanstoß',
    typeof thema.urteil.hinweis === 'string' && thema.urteil.hinweis.length > 40);
  pruefe('„Die Kolonien" steht als Modul 13 hinter „Revolution und Napoleon"',
    alleThemen[12] === thema && alleThemen[11].id === 'revolution-und-napoleon');
}

/** Die Länge einer Bewegung in SVG-Einheiten — Start, Zwischenpunkte, Ziel. */
function laenge(bewegung) {
  const stationen = [bewegung.von, ...(bewegung.ueber || []), bewegung.nach];
  let summe = 0;
  for (let i = 1; i < stationen.length; i += 1) {
    summe += Math.hypot(stationen[i][0] - stationen[i - 1][0], stationen[i][1] - stationen[i - 1][1]);
  }
  return summe;
}
