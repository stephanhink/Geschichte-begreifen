// Die Karte zum Thema „Die USA: Aufstieg zur Weltmacht" — Geschichte in
// Bewegung.
//
// Küstenlinien stehen als echte Längen-/Breitengrade `[lon, lat]` und werden
// von utils/karte-geo.js in SVG-Koordinaten umgerechnet. Wer einen Punkt
// anzweifelt, schlägt ihn im Atlas nach: `[-157.95, 21.35]` ist Pearl Harbor,
// `[132.46, 34.39]` Hiroshima, `[144.75, 13.45]` Guam.
//
// ---------------------------------------------------------------------------
// Der Ausschnitt — und warum er so liegt
// ---------------------------------------------------------------------------
//
// 110° O bis 110° W über den Pazifik hinweg, 5° N bis 62° N: 700 × rund 341,8.
// Mit 5 SVG-Einheiten je Längengrad ist das der weiteste und damit gröbste
// Ausschnitt der App (zur Mongolen-Karte 5,2, zur Kolonien-Karte 6,1, zur
// Levante-Karte 140). Das ist Absicht: Dieses Kapitel handelt davon, wie aus
// einer Kontinentalmacht eine Pazifikmacht wurde, und diese Geschichte
// braucht beide Ufer eines Ozeans auf einem Bild. Hawaii, die Philippinen,
// Pearl Harbor, Midway und Hiroshima müssen zusammen sichtbar sein — sonst
// bleibt der Aufstieg eine Behauptung im Text.
//
// Der Ausschnitt läuft über den 180. Längengrad. Damit die Projektion aus
// utils/karte-geo.js (eine schlichte Plattkarte) rechnen kann, zählen die
// Längengrade hier durch: Alles westlich von 180° bekommt 360 dazu, aus
// −157,95° (Pearl Harbor) wird 202,05. In den Datenlisten unten stehen
// trotzdem die echten, im Atlas nachschlagbaren Werte — die Umrechnung macht
// `pazifisch()` an genau einer Stelle.
//
// Was der Ausschnitt kostet, steht hier und nicht im Kleingedruckten:
//   * Der Panamakanal (1914) liegt bei 79,5° W und 9° N — weit östlich und
//     südlich des Bildes. Ebenso Kuba und Puerto Rico, die anderen Schauplätze
//     von 1898. Sie stehen deshalb nur im Text der Perspektive, nicht auf der
//     Karte. Ein Ausschnitt, der sie einschlösse, müsste 170 Längengrade
//     spannen; dann wäre von Japan und den Philippinen kaum mehr etwas zu
//     erkennen.
//   * Guadalcanal und die Salomonen (rund 9° S) liegen unter dem unteren Rand.
//     Der Pazifikkrieg von 1942 im Südwesten fehlt deshalb auf der Karte; die
//     Bewegung „Inselspringen" beginnt bei den Marshallinseln, also 1944.
//   * Die USA laufen nach Osten aus dem Bild — der Kontinent hört am rechten
//     Rand nicht auf. Auch China und Sibirien reichen weit über den linken
//     Rand hinaus; die Titel der Flächen sagen das selbst.
//
// Zwei Festlegungen, die aus der Zusatzregel für sensible Themen folgen
// (CLAUDE.md). Erstens: **Eingefärbt wird nur, wo eine Herrschaft mit Grenzen
// plausibel ist**, und jede Fläche trägt ihren Zustand mit Jahreszahl im Titel
// — 1890 steht das Königreich Hawaii als eigener Staat da, nicht als künftiger
// US-Besitz, und die Philippinen stehen als spanische Kolonie da, nicht als
// leeres Land. Die Karte bewertet nicht, sie datiert. Zweitens: **Winzige
// Inseln sind größer gezeichnet, als sie sind.** Midway, Wake, Iwojima und die
// Atolle der Marshallinseln messen wenige Kilometer; bei 5 Einheiten je
// Längengrad wären sie ein Vierzigstel einer Einheit und damit unsichtbar. Sie
// stehen deshalb als kleine Vielecke von rund 0,45 Grad Halbmesser da — ihre
// Lage stimmt, ihre Größe nicht. Dasselbe gilt für die Inseln der Aleuten und
// der Kurilen.
//
// Politische Grenzen sind hier — anders als die Küsten — angenähert und nicht
// vermessen: die Grenze zwischen den USA und Mexiko, die Amur- und
// Ussuri-Linie zwischen China und Russland, der 38. Breitengrad, der Korea
// 1945 teilte. Die Küsten dagegen sind Atlas-Werte und werden in
// tests/karte-usa-weltmacht.mjs gegen bekannte Orte nachgerechnet.
//
// Reine Daten und Rechnung — keine UI-Importe (Architektur-Regel).

const { KARTENFARBEN, erstelleProjektion, rueckwaerts, verbinde } = require('../../karte-geo');

// ---------------------------------------------------------------------------
// Ausschnitt und Projektion
// ---------------------------------------------------------------------------

const RAHMEN = { minLon: 110, maxLon: 250, minLat: 5, maxLat: 62, breite: 700 };

const geo = erstelleProjektion(RAHMEN);

/**
 * Pazifische Zählung der Längengrade.
 *
 * Die Karte läuft über den 180. Längengrad hinweg. Westliche Längen (negativ)
 * werden deshalb weitergezählt: −122,42° (San Francisco) → 237,58. Östliche
 * Längen bleiben, wie sie sind.
 */
const pazifisch = (lon) => (lon < 0 ? lon + 360 : lon);

/** Kurzform: geografischer Ort → SVG-Punkt `[x, y]`. */
const p = (lon, lat) => geo.punkt(pazifisch(lon), lat);

/** Dasselbe als `{ x, y }` — die Form, die Punkte und Beschriftungen wollen. */
const ort = (lon, lat) => {
  const [x, y] = p(lon, lat);
  return { x, y };
};

/** Ein Pfad aus geografischen Orten, mit pazifischer Zählung. */
const pfad = (orte, optionen) =>
  geo.pfad(orte.map(([lon, lat]) => [pazifisch(lon), lat]), optionen);

/**
 * Eine winzige Insel als kleines Vieleck.
 *
 * Bewusst größer als in Wirklichkeit (siehe Kopf der Datei): Ein Atoll von
 * fünf Kilometern wäre hier ein Vierzigstel einer SVG-Einheit. Die Form hat
 * absichtlich keinen Eckpunkt genau auf der Mittenbreite — sonst läge der
 * Mittelpunkt bei der Punkt-im-Vieleck-Probe genau auf einer Kante.
 */
const eiland = (lon, lat, r = 0.45) => [
  [lon - r, lat + r * 0.4],
  [lon, lat + r * 0.85],
  [lon + r, lat + r * 0.4],
  [lon + r * 0.8, lat - r * 0.5],
  [lon, lat - r * 0.85],
  [lon - r * 0.8, lat - r * 0.5],
];

// ---------------------------------------------------------------------------
// Asien — die Küste von Südchina bis Kamtschatka
//
// Die chinesische, koreanische und südsibirische Küste folgt denselben
// Atlas-Werten wie karten/japan.js; nach Süden und Norden ist sie hier
// weitergeführt, weil dieser Ausschnitt weiter reicht.
// ---------------------------------------------------------------------------

/** Südchina: vom Golf von Tonkin (schon außerhalb des Bildes) bis Fuzhou. */
const KUESTE_SUEDCHINA = [
  [109.2, 21.4], // westlich des Bildrandes
  [110.4, 21.2], // Zhanjiang
  [111.8, 21.6],
  [113.2, 22.0],
  [113.55, 22.19], // Macau, an der Mündung des Perlflusses
  [113.6, 23.0], // die Bucht vor Guangzhou
  [114.17, 22.3], // Hongkong — von hier lief 1898 Deweys Geschwader aus
  [114.9, 22.6],
  [116.7, 23.35], // Shantou
  [117.6, 23.9],
  [118.1, 24.5], // Xiamen
  [118.6, 24.9],
  [119.5, 25.5],
];

/** Die chinesische Küste von Fuzhou bis zur Mündung des Yalu. */
const KUESTE_CHINA = [
  [119.5, 25.5],
  [119.7, 26.1], // Fuzhou
  [120.4, 27.1], // Wenzhou
  [121.2, 28.3],
  [121.6, 29.1],
  [121.9, 29.9], // Ningbo
  [121.2, 30.2],
  [120.5, 30.4], // Bucht von Hangzhou
  [121.2, 30.9],
  [121.9, 31.4], // Mündung des Jangtse — hier liegt Schanghai
  [121.4, 32.2],
  [120.9, 33.0],
  [120.4, 34.0],
  [119.8, 34.8],
  [119.4, 35.5],
  [119.9, 35.8],
  [120.4, 36.1], // Qingdao
  [121.4, 36.6],
  [122.7, 37.4], // Ostspitze der Halbinsel Shandong
  [122.0, 37.5],
  [121.2, 37.6], // Yantai
  [120.3, 37.8], // Penglai an der Bohai-Straße
  [119.2, 37.3],
  [118.9, 37.9], // Mündung des Gelben Flusses
  [117.7, 38.9],
  [119.6, 39.9], // Shanhaiguan
  [121.2, 40.8],
  [122.1, 40.9], // Grund der Bohai-Bucht
  [121.9, 40.0],
  [121.3, 39.2],
  [121.6, 38.9], // Dalian
  [122.6, 39.4],
  [123.6, 39.8],
  [124.4, 40.0], // Mündung des Yalu
];

/** Korea: Yalu → Westküste → Südspitze → Ostküste → Mündung des Tumen. */
const KOREA = [
  [124.4, 40.0],
  [125.4, 39.6],
  [125.1, 38.8],
  [126.0, 38.3],
  [126.6, 37.5], // Incheon
  [126.4, 36.7],
  [126.6, 36.0],
  [126.4, 35.2],
  [126.3, 34.4], // Mokpo
  [127.5, 34.4],
  [128.5, 34.8],
  [129.1, 35.1], // Busan
  [129.4, 35.9],
  [129.3, 36.8],
  [129.0, 37.6],
  [128.4, 38.4],
  [127.5, 39.3], // Wonsan
  [128.3, 40.0],
  [129.4, 40.8],
  [129.9, 41.8],
  [130.6, 42.3], // Mündung des Tumen
];

/** Die Nordgrenze Koreas — Yalu und Tumen, dazwischen der Paektu. */
const KOREA_NORDGRENZE = [
  [130.6, 42.3],
  [129.3, 41.9],
  [128.1, 42.0],
  [126.8, 41.6],
  [125.6, 40.8],
  [124.4, 40.0],
];

/** Die Küste nördlich des Tumen: Wladiwostok → Amurmündung. */
const KUESTE_NORDOST = [
  [130.6, 42.3],
  [131.9, 43.1], // Wladiwostok
  [133.2, 42.8],
  [134.8, 43.5],
  [136.5, 44.5],
  [137.7, 45.8],
  [139.0, 47.2],
  [140.3, 49.0], // Sowjetskaja Gawan
  [140.8, 50.5],
  [141.2, 51.5],
  [141.4, 52.5],
  [141.0, 53.2], // Nikolajewsk an der Mündung des Amur
];

/** Die Nord- und Westküste des Ochotskischen Meeres bis Kamtschatka. */
const KUESTE_OCHOTSK = [
  [141.0, 53.2],
  [139.5, 54.2],
  [137.6, 54.4], // Uda-Bucht, gegenüber den Schantar-Inseln
  [138.5, 56.4], // Ajan
  [139.7, 57.5],
  [141.5, 58.5],
  [143.2, 59.4], // Ochotsk
  [146.5, 59.4],
  [149.5, 59.4],
  [150.8, 59.6], // Magadan
  [153.3, 59.2],
  [155.5, 59.4],
  [157.5, 61.0],
  [159.9, 61.9], // Ewensk
  [162.5, 62.6], // über dem oberen Bildrand
];

/** Kamtschatka: Westküste nach Süden, Kap Lopatka, Ostküste nach Norden. */
const KAMTSCHATKA = [
  [162.5, 62.6],
  [163.3, 61.0],
  [162.0, 59.0],
  [160.0, 57.5],
  [157.5, 55.5],
  [156.5, 54.0],
  [155.6, 52.5],
  [156.2, 51.3],
  [156.7, 50.9], // Kap Lopatka, die Südspitze
  [157.8, 51.6],
  [158.5, 52.3],
  [158.65, 53.0], // Petropawlowsk an der Awatscha-Bucht
  [159.9, 53.2],
  [161.0, 54.5],
  [162.0, 55.5],
  [163.3, 56.2], // Kap Kamtschatski
  [162.5, 57.5],
  [162.3, 58.5],
  [163.0, 59.5],
  [163.9, 60.5],
  [165.5, 61.5],
  [168.0, 62.6], // wieder über dem oberen Bildrand
];

/**
 * Asien als ein einziger Umriss. Der Rückweg läuft weit außerhalb des Bildes:
 * über den Norden (Tschuktschen-Halbinsel liegt über dem oberen Rand) und
 * westlich am linken Bildrand vorbei.
 */
const ASIEN = verbinde(
  KUESTE_SUEDCHINA,
  KUESTE_CHINA,
  KOREA,
  KUESTE_NORDOST,
  KUESTE_OCHOTSK,
  KAMTSCHATKA,
  [
    [175.0, 65.0],
    [190.0, 70.0],
    [200.0, 76.0],
    [100.0, 76.0],
    [100.0, 16.0],
    [107.0, 19.0],
  ],
);

/** Der Nordzipfel Borneos — die Südwestecke des Bildes. */
const BORNEO_NORD = [
  [115.0, 4.2], // unter dem unteren Bildrand
  [115.5, 5.2],
  [116.1, 6.0], // Kota Kinabalu
  [116.8, 6.9],
  [117.6, 6.9],
  [118.6, 6.1], // Sandakan
  [119.2, 5.3],
  [118.5, 4.2],
];

// ---------------------------------------------------------------------------
// Japan — dieselben Atlas-Küsten wie in karten/japan.js
// ---------------------------------------------------------------------------

const HONSHU = [
  [130.95, 34.0], // Shimonoseki
  [131.4, 34.4],
  [131.9, 34.7],
  [132.7, 35.4], // Izumo
  [133.5, 35.6],
  [134.2, 35.55], // Tottori
  [135.1, 35.7],
  [135.4, 35.5],
  [136.1, 35.65], // Tsuruga
  [136.0, 36.1],
  [136.6, 36.6], // Kanazawa
  [137.3, 37.5], // Spitze der Halbinsel Noto
  [136.9, 37.1],
  [137.25, 36.75],
  [138.25, 37.15],
  [139.05, 37.9], // Niigata
  [139.4, 38.4],
  [139.55, 38.85],
  [139.9, 39.4],
  [139.7, 39.9], // Kap Nyudo
  [140.05, 39.75], // Akita
  [140.1, 40.75],
  [140.35, 41.25], // Kap Tappi
  [140.8, 40.85],
  [140.9, 41.55], // Kap Oma, die Nordspitze
  [141.4, 41.4],
  [141.55, 40.5], // Hachinohe
  [141.9, 39.9],
  [142.05, 39.55], // Kap Todo, der Ostpunkt
  [141.85, 39.0],
  [141.05, 38.25], // Sendai
  [140.95, 37.8],
  [141.0, 37.0], // Onahama
  [140.6, 36.4],
  [140.87, 35.72], // Kap Inubo
  [140.3, 35.35],
  [139.9, 34.9], // Kap Nojima
  [139.85, 35.65], // Grund der Bucht von Tokio
  [139.7, 35.15], // Halbinsel Miura
  [138.85, 34.6], // Kap Irozaki
  [138.5, 34.7],
  [138.2, 34.6], // Omaezaki
  [136.95, 34.65], // Bucht von Ise
  [136.85, 34.3], // Kap Daio
  [136.0, 33.6],
  [135.76, 33.45], // Kap Shionomisaki
  [135.2, 33.9],
  [135.4, 34.65], // Bucht von Osaka
  [134.6, 34.75],
  [133.9, 34.5], // Okayama
  [132.5, 34.35], // Hiroshima
  [132.0, 34.1],
  [131.4, 33.95],
];

const KYUSHU = [
  [130.9, 33.9],
  [131.65, 33.7],
  [131.9, 33.3],
  [131.9, 32.9],
  [132.0, 32.75], // Kap Tsurumi
  [131.75, 32.5],
  [131.45, 31.75], // Miyazaki
  [131.35, 31.35], // Kap Toi
  [130.85, 31.15],
  [130.67, 31.0], // Kap Sata, die Südspitze
  [130.6, 31.35],
  [130.25, 31.25],
  [130.15, 31.6],
  [130.35, 32.0],
  [130.1, 32.25],
  [130.25, 32.6],
  [129.87, 32.75], // Nagasaki
  [129.65, 33.05],
  [129.75, 33.35], // Sasebo
  [130.0, 33.5],
  [130.4, 33.6], // Bucht von Hakata
  [130.65, 33.85],
];

const SHIKOKU = [
  [134.05, 34.35],
  [134.6, 34.2],
  [134.75, 33.85],
  [134.18, 33.25], // Kap Muroto
  [133.7, 33.5],
  [133.02, 32.72], // Kap Ashizuri
  [132.5, 33.3],
  [132.0, 33.35], // Kap Sada
  [132.5, 33.7],
  [132.75, 33.85], // Matsuyama
  [133.4, 34.2],
];

const HOKKAIDO = [
  [140.2, 41.4],
  [140.75, 41.8], // Hakodate
  [141.5, 42.3],
  [142.5, 42.3],
  [143.25, 41.93], // Kap Erimo
  [144.4, 42.95], // Kushiro
  [145.8, 43.4], // Kap Nosappu, der Ostpunkt Japans
  [145.3, 44.35], // Halbinsel Shiretoko
  [144.3, 44.0], // Abashiri
  [142.5, 44.8],
  [141.94, 45.52], // Kap Soya, die Nordspitze
  [141.6, 45.2],
  [141.3, 43.6],
  [140.35, 43.33], // Kap Kamui
  [140.0, 42.6],
  [140.1, 41.75],
];

/**
 * Sachalin — die Insel, die dieses Kapitel dreimal wechselt: 1875 russisch,
 * 1905 im Süden japanisch, 1945 wieder ganz sowjetisch.
 */
const SACHALIN_SUED = [
  [142.08, 45.9], // Kap Crillon, die Südspitze
  [143.0, 46.4],
  [143.4, 46.7],
  [143.3, 47.3],
  [142.8, 48.0],
  [142.6, 49.0],
  [143.1, 49.4],
  [143.2, 50.0],
  [141.85, 50.0],
  [141.9, 49.0],
  [142.1, 48.0],
  [142.0, 47.0],
  [141.9, 46.4],
];

const SACHALIN_NORD = [
  [143.2, 50.0],
  [143.3, 51.0],
  [143.2, 52.0],
  [142.9, 53.3],
  [142.2, 54.3], // Kap Elisabeth, die Nordspitze
  [141.8, 53.8],
  [142.0, 53.0],
  [141.7, 51.0],
  [141.85, 50.0],
];

/** Ganz Sachalin — für die Phasen, in denen die Insel ungeteilt ist. */
const SACHALIN = verbinde(
  SACHALIN_SUED.slice(0, 8),
  SACHALIN_NORD.slice(0, 5),
  rueckwaerts(SACHALIN_NORD.slice(5)),
  [[141.9, 49.0], [142.1, 48.0], [142.0, 47.0], [141.9, 46.4]],
);

/** Die Kurilen — Kette von Hokkaido nach Kamtschatka, 1875 ganz japanisch. */
const KURILEN = [
  eiland(145.5, 44.0, 0.4),
  eiland(147.5, 45.2, 0.45), // Iturup — von hier lief 1941 die Flotte aus
  eiland(150.0, 46.2, 0.4),
  eiland(152.0, 47.2, 0.35),
  eiland(154.7, 49.4, 0.35),
  eiland(156.2, 50.5, 0.4), // Paramuschir
];

/** Taiwan — 1895 von China an Japan, 1945 zurück. */
const TAIWAN = [
  [120.1, 23.1], // Tainan
  [120.15, 22.6],
  [120.8, 21.93], // Kap Eluanbi, die Südspitze
  [121.4, 22.6],
  [121.6, 23.6],
  [121.9, 24.6],
  [121.8, 25.15], // Keelung
  [121.0, 25.1], // Tamsui
  [120.5, 24.5],
  [120.2, 23.8],
];

/** Okinawa — 1879 von Japan einverleibt, ab Juni 1945 unter US-Verwaltung. */
const OKINAWA = [
  [127.65, 26.08],
  [127.9, 26.2],
  [128.3, 26.7],
  [128.0, 26.78],
  [127.75, 26.4],
  [127.6, 26.2],
];

/** Amami — die nördliche der Ryukyu-Inseln. */
const AMAMI = eiland(129.4, 28.3, 0.35);

// ---------------------------------------------------------------------------
// Die Philippinen
// ---------------------------------------------------------------------------

const LUZON = [
  [120.6, 18.5], // Kap Bojeador, die Nordwestecke
  [121.6, 18.4], // Aparri
  [122.3, 18.3], // Kap Engaño
  [122.5, 17.0],
  [122.1, 16.0], // Baler
  [121.7, 15.0],
  [122.0, 14.2], // Lamon-Bucht
  [123.4, 13.6],
  [124.1, 12.6], // Matnog, die Südspitze der Bicol-Halbinsel
  [123.4, 13.1],
  [122.9, 13.9],
  [122.0, 13.7],
  [121.3, 13.75], // die Küste von Batangas
  [120.6, 14.4], // Einfahrt in die Bucht von Manila
  [120.5, 14.9], // Bataan
  [119.9, 16.0],
  [119.8, 16.4], // Kap Bolinao
  [120.3, 17.5],
  [120.4, 18.2],
];

const MINDANAO = [
  [124.0, 9.8],
  [125.6, 9.4],
  [126.4, 8.6],
  [126.2, 7.2], // Kap San Agustin
  [125.7, 5.6], // Sarangani, die Südspitze
  [124.6, 6.4],
  [123.9, 7.4],
  [122.08, 6.9], // Zamboanga
  [122.5, 7.9],
  [123.6, 8.2],
  [123.9, 8.9],
];

const SAMAR = [
  [124.9, 11.6],
  [125.6, 11.2],
  [125.8, 12.0],
  [125.4, 12.5],
  [124.9, 12.2],
  [124.4, 11.9],
];

const LEYTE = [
  [124.4, 10.3],
  [125.0, 10.5],
  [125.1, 11.3],
  [124.6, 11.4],
  [124.35, 10.9],
];

const CEBU = [
  [123.3, 9.5],
  [124.0, 10.6],
  [124.1, 11.3],
  [123.85, 10.9],
  [123.3, 10.0],
];

const NEGROS = [
  [122.5, 9.3],
  [123.3, 9.9],
  [123.4, 10.8],
  [122.9, 10.5],
  [122.6, 9.9],
];

const PANAY = [
  [121.9, 10.5],
  [122.9, 10.4],
  [123.2, 11.2],
  [122.5, 11.8],
  [122.0, 11.2],
];

const MINDORO = [
  [120.6, 12.3],
  [121.5, 12.4],
  [121.5, 13.5],
  [120.9, 13.5],
];

const PALAWAN = [
  [117.2, 8.4],
  [118.5, 9.4],
  [119.5, 11.1],
  [119.1, 11.05],
  [118.2, 10.0],
  [117.05, 8.6],
];

/** Alle philippinischen Inseln, die die Karte zeigt. */
const PHILIPPINEN = [LUZON, MINDANAO, SAMAR, LEYTE, CEBU, NEGROS, PANAY, MINDORO, PALAWAN];

// ---------------------------------------------------------------------------
// Die Inseln des offenen Pazifiks — Lage echt, Größe übertrieben
// ---------------------------------------------------------------------------

const GUAM = eiland(144.75, 13.45, 0.4);
const SAIPAN = eiland(145.75, 15.19, 0.4);
const TINIAN = eiland(145.62, 14.99, 0.28);
const IWOJIMA = eiland(141.29, 24.78, 0.35);
const MIDWAY = eiland(-177.37, 28.2, 0.4);
const WAKE = eiland(166.63, 19.28, 0.35);
const KWAJALEIN = eiland(167.73, 8.72, 0.4);
const MAJURO = eiland(171.2, 7.1, 0.35);

/** Hawaii — die fünf großen Inseln des Archipels. */
const HAWAII_GROSSE_INSEL = [
  [-155.68, 18.91], // Ka Lae, der Südpunkt der USA
  [-154.8, 19.5],
  [-155.1, 20.0],
  [-155.9, 20.27], // Upolu Point
  [-156.06, 19.7],
  [-155.9, 19.1],
];

const MAUI = [
  [-156.7, 20.6],
  [-155.98, 20.75],
  [-156.0, 20.95],
  [-156.4, 21.03],
  [-156.7, 20.9],
];

const MOLOKAI = [
  [-157.32, 21.1],
  [-156.7, 21.12],
  [-156.72, 21.2],
  [-157.32, 21.21],
];

const OAHU = [
  [-158.28, 21.3],
  [-157.65, 21.28],
  [-157.65, 21.72],
  [-158.28, 21.6],
];

const KAUAI = [
  [-159.79, 21.87],
  [-159.29, 21.9],
  [-159.3, 22.23],
  [-159.75, 22.2],
];

const HAWAII = [HAWAII_GROSSE_INSEL, MAUI, MOLOKAI, OAHU, KAUAI];

// ---------------------------------------------------------------------------
// Nordamerika
// ---------------------------------------------------------------------------

/** Die Pazifikküste Niederkaliforniens: aus dem Bild heraus bis San Diego. */
const KUESTE_MEXIKO = [
  [-105.5, 20.5], // östlich des Bildrandes
  [-109.95, 22.88], // Cabo San Lucas
  [-110.3, 23.6],
  [-112.1, 24.6], // Bahía Magdalena
  [-113.6, 26.7],
  [-115.08, 27.85], // Punta Eugenia
  [-114.3, 28.05], // Grund der Vizcaíno-Bucht
  [-115.2, 28.9],
  [-115.8, 29.95],
  [-116.0, 30.5],
  [-116.6, 31.85], // Ensenada
];

/** Die Pazifikküste der USA: San Diego → 49. Breitengrad. */
const PAZIFIK_USA = [
  [-117.25, 32.53], // San Diego
  [-117.39, 33.36], // Oceanside
  [-117.78, 33.5],
  [-118.27, 33.72], // San Pedro, der Hafen von Los Angeles
  [-118.49, 34.02], // Santa Monica
  [-119.29, 34.27], // Ventura
  [-120.47, 34.45], // Point Conception
  [-120.64, 35.14],
  [-120.86, 35.37], // Morro Bay
  [-121.29, 36.6], // Bucht von Monterey
  [-122.03, 36.97], // Santa Cruz
  [-122.48, 37.81], // das Golden Gate von San Francisco
  [-122.98, 38.0], // Point Reyes
  [-123.05, 38.32],
  [-123.74, 38.96], // Point Arena
  [-123.8, 39.45],
  [-124.41, 40.44], // Cape Mendocino
  [-124.18, 40.8], // Humboldt Bay
  [-124.2, 41.75], // Crescent City
  [-124.4, 42.84], // Cape Blanco
  [-124.3, 43.4], // Coos Bay
  [-124.06, 44.64], // Newport
  [-123.97, 46.25], // Mündung des Columbia
  [-124.1, 46.9],
  [-124.73, 48.38], // Cape Flattery
  [-123.43, 48.12], // Port Angeles
  [-122.75, 49.0], // die kanadische Grenze
];

/** Die Küste Britisch-Kolumbiens: 49. Breitengrad → Portland Canal. */
const KUESTE_KANADA = [
  [-123.1, 49.3], // Vancouver
  [-124.0, 49.7],
  [-124.9, 50.5],
  [-126.0, 51.0],
  [-127.5, 51.7],
  [-127.9, 52.4],
  [-128.3, 53.2],
  [-128.8, 53.8],
  [-130.3, 54.3], // Prince Rupert
];

/** Die Küste Alaskas: Panhandle → Golf von Alaska → Bristol Bay → Beringsee. */
const KUESTE_ALASKA = [
  [-130.0, 54.8], // Portland Canal, die Grenze zu Kanada
  [-131.6, 55.3],
  [-133.2, 56.4],
  [-134.2, 57.5],
  [-135.3, 58.2], // vor Juneau
  [-136.5, 58.3],
  [-137.5, 58.9],
  [-139.5, 59.6], // Yakutat
  [-141.5, 60.0],
  [-144.0, 60.2],
  [-145.75, 60.54], // Cordova
  [-146.5, 61.0], // Prince-William-Sund, vor Valdez
  [-148.0, 60.8],
  [-149.4, 60.1], // Seward
  [-149.9, 59.2], // Kap Elizabeth
  [-151.4, 59.6], // Homer
  [-150.4, 60.7],
  [-149.9, 61.2], // Anchorage, am Grund des Cook Inlet
  [-150.9, 61.3],
  [-151.9, 60.5],
  [-152.6, 60.0],
  [-153.5, 59.2],
  [-154.5, 58.5],
  [-155.8, 57.7],
  [-157.5, 56.7],
  [-159.5, 55.8],
  [-161.0, 55.3],
  [-162.5, 54.9],
  [-163.4, 54.85], // False Pass, das Ende der Alaska-Halbinsel
  [-162.5, 55.4],
  [-161.0, 55.8],
  [-159.5, 56.5],
  [-158.0, 57.5],
  [-157.0, 58.7], // Naknek an der Bristol Bay
  [-158.5, 59.05], // Dillingham
  [-160.0, 58.9],
  [-161.8, 58.7], // Kap Newenham
  [-162.0, 59.5],
  [-164.0, 60.2],
  [-165.1, 60.5], // das Delta von Yukon und Kuskokwim
  [-164.7, 61.5],
  [-165.3, 62.6], // über dem oberen Bildrand
];

/** Die Grenze zwischen dem Panhandle Alaskas und Kanada. */
const PANHANDLE_GRENZE = [
  [-130.0, 54.8],
  [-130.5, 56.0],
  [-131.8, 56.6],
  [-133.0, 58.0],
  [-134.5, 58.9],
  [-136.5, 59.3],
  [-138.5, 59.8],
  [-141.0, 60.3], // ab hier läuft die Grenze auf dem 141. Längengrad nach Norden
];

/** Nordamerika als ein Umriss; der Rückweg läuft außerhalb des Bildes. */
const NORDAMERIKA = verbinde(
  KUESTE_MEXIKO,
  PAZIFIK_USA,
  KUESTE_KANADA,
  KUESTE_ALASKA,
  [
    [-166.0, 68.0],
    [-150.0, 76.0],
    [-100.0, 76.0],
    [-100.0, 16.0],
  ],
);

const VANCOUVER_ISLAND = [
  [-123.5, 48.4],
  [-124.8, 48.9],
  [-125.9, 49.4],
  [-126.9, 49.9],
  [-128.0, 50.9], // Cape Scott
  [-127.0, 50.5],
  [-125.3, 50.1],
  [-123.9, 49.5],
  [-123.3, 48.7], // Victoria
];

const HAIDA_GWAII = [
  [-130.9, 52.4],
  [-132.0, 52.8],
  [-133.1, 54.1],
  [-131.9, 54.2],
  [-131.4, 53.2],
];

const KODIAK = [
  [-154.3, 56.9],
  [-153.0, 56.6],
  [-152.0, 57.3],
  [-152.3, 57.8],
  [-154.0, 57.8],
  [-154.5, 57.4],
];

/** Die Aleuten — die Kette, über die 1942/43 die Front bis Alaska reichte. */
const ALEUTEN = [
  eiland(-164.0, 54.75, 0.5),
  eiland(-166.8, 53.8, 0.45), // Unalaska mit Dutch Harbor
  eiland(-168.6, 53.2, 0.4),
  eiland(-174.2, 52.2, 0.35),
  eiland(-176.7, 51.85, 0.35), // Adak
  eiland(177.5, 52.05, 0.35), // Kiska — 1942 bis 1943 japanisch besetzt
  eiland(172.9, 52.9, 0.35), // Attu — dasselbe
];

// ---------------------------------------------------------------------------
// Flüsse
// ---------------------------------------------------------------------------

const JANGTSE = [
  [112.0, 30.6],
  [114.3, 30.6], // Wuhan
  [116.0, 29.7],
  [117.0, 30.5],
  [118.8, 32.1], // Nanjing
  [119.4, 32.2],
  [120.9, 32.0],
  [121.9, 31.4],
];

const PERLFLUSS = [
  [112.5, 23.1],
  [113.0, 23.1],
  [113.26, 23.13], // Guangzhou
  [113.5, 22.75],
  [113.55, 22.19],
];

const AMUR = [
  [121.5, 53.4],
  [125.5, 52.6],
  [127.5, 50.3],
  [130.7, 48.9],
  [135.1, 48.5], // Chabarowsk
  [137.0, 50.5],
  [139.5, 52.0],
  [141.0, 53.2],
];

const COLUMBIA = [
  [-117.78, 49.0],
  [-119.3, 46.6],
  [-119.4, 45.9],
  [-121.2, 45.7],
  [-122.7, 45.65], // Portland
  [-123.97, 46.25],
];

const SACRAMENTO = [
  [-121.5, 39.7],
  [-121.6, 38.6],
  [-121.5, 38.58], // Sacramento
  [-122.0, 38.05],
  [-122.48, 37.81],
];

// ---------------------------------------------------------------------------
// Die Flächen der Phasen
// ---------------------------------------------------------------------------

/** Die Grenze zwischen den USA und Mexiko, von Westen nach Osten. */
const GRENZE_MEXIKO = [
  [-117.13, 32.53],
  [-114.72, 32.72], // am Colorado bei Yuma
  [-111.0, 31.33],
  [-108.2, 31.33],
  [-106.5, 31.75], // El Paso
  [-100.0, 26.0], // längst außerhalb des Bildes
];

/** Das Festland der USA — nach Osten läuft es aus dem Bild. */
const USA_FESTLAND = verbinde(
  PAZIFIK_USA,
  [[-110.0, 49.0], [-100.0, 49.0], [-100.0, 26.0]],
  rueckwaerts(GRENZE_MEXIKO),
);

/** Mexiko — auf dieser Karte nur Niederkalifornien und Sonora. */
const MEXIKO = verbinde(
  KUESTE_MEXIKO,
  [[-117.13, 32.53]],
  GRENZE_MEXIKO,
  [[-97.0, 22.0], [-100.0, 17.0]],
);

/** Kanada — die Westhälfte des Dominions, östlich außerhalb des Bildes. */
const KANADA = verbinde(
  [[-122.75, 49.0]],
  KUESTE_KANADA,
  [[-130.0, 54.8]],
  PANHANDLE_GRENZE,
  [[-141.0, 70.0], [-100.0, 76.0], [-100.0, 49.0]],
);

/** Alaska — 1867 für 7,2 Millionen Dollar von Russland gekauft. */
const ALASKA = verbinde(
  KUESTE_ALASKA,
  [[-166.0, 68.0], [-141.0, 72.0], [-141.0, 60.3]],
  rueckwaerts(PANHANDLE_GRENZE),
);

/** Die Nordgrenze Chinas: Ussuri, Amur, Argun — angenähert, nicht vermessen. */
const CHINA_NORDGRENZE = [
  [130.6, 42.3],
  [131.3, 43.4],
  [133.1, 45.1],
  [134.0, 46.5],
  [135.1, 48.5], // Chabarowsk, wo Ussuri und Amur zusammentreffen
  [133.0, 48.2],
  [130.7, 48.9],
  [128.5, 49.6],
  [127.5, 50.3],
  [126.5, 51.3],
  [125.5, 52.6],
  [123.5, 53.5],
  [121.5, 53.4],
  [120.0, 51.5],
  [117.9, 49.5], // Mandschurei-Station
  [115.0, 47.9],
  [112.0, 47.5],
  [105.0, 48.5], // außerhalb des Bildes
];

/** China — der östliche Rand eines Reiches, das weit über die Karte reicht. */
const CHINA = verbinde(
  KUESTE_SUEDCHINA,
  KUESTE_CHINA,
  [[124.4, 40.0]],
  rueckwaerts(KOREA_NORDGRENZE),
  CHINA_NORDGRENZE,
  [[105.0, 16.0]],
);

/** Korea, wie es 1890 noch als eigenes Königreich dastand. */
const KOREA_GANZ = verbinde(KOREA, KOREA_NORDGRENZE);

/** Korea nördlich des 38. Breitengrads — 1945 sowjetische Besatzungszone. */
const KOREA_NORD = verbinde(
  [[126.2, 38.0], [126.0, 38.3], [125.1, 38.8], [125.4, 39.6], [124.4, 40.0]],
  rueckwaerts(KOREA_NORDGRENZE),
  [[129.9, 41.8], [129.4, 40.8], [128.3, 40.0], [127.5, 39.3], [128.4, 38.4], [128.7, 38.0]],
);

/** Korea südlich des 38. Breitengrads — 1945 amerikanische Besatzungszone. */
const KOREA_SUED = [
  [126.2, 38.0],
  [126.6, 37.5],
  [126.4, 36.7],
  [126.6, 36.0],
  [126.4, 35.2],
  [126.3, 34.4],
  [127.5, 34.4],
  [128.5, 34.8],
  [129.1, 35.1],
  [129.4, 35.9],
  [129.3, 36.8],
  [129.0, 37.6],
  [128.7, 38.0],
];

/** Russland und später die Sowjetunion — der pazifische Rand. */
const RUSSLAND = verbinde(
  KUESTE_NORDOST,
  KUESTE_OCHOTSK,
  KAMTSCHATKA,
  [[175.0, 65.0], [190.0, 70.0], [200.0, 76.0], [100.0, 76.0], [100.0, 50.0], [105.0, 48.5]],
  rueckwaerts(CHINA_NORDGRENZE).slice(1),
);

// ---------------------------------------------------------------------------
// Zusammenbau
// ---------------------------------------------------------------------------

const land = (orte) => ({
  art: 'land',
  d: pfad(orte),
  fill: KARTENFARBEN.land,
  stroke: KARTENFARBEN.landRand,
  strokeWidth: 1.2,
});

const fluss = (orte) => ({
  art: 'fluss',
  d: pfad(orte, { geschlossen: false }),
  fill: 'none',
  stroke: KARTENFARBEN.fluss,
  strokeWidth: 2,
});

const gebiet = (titel, orte) => ({ titel, d: pfad(orte) });

/** Eine Fläche aus mehreren getrennten Teilen (Inselreiche, Kolonien). */
const gebietTeile = (titel, teile) => ({
  titel,
  d: teile.map((orte) => pfad(orte)).join(' '),
});

const JAPAN_KERN = [HONSHU, KYUSHU, SHIKOKU, HOKKAIDO];

const karte = {
  breite: geo.breite,
  hoehe: geo.hoehe,

  basis: [
    {
      art: 'grund',
      d: `M 0 0 H ${geo.breite} V ${geo.hoehe} H 0 Z`,
      fill: KARTENFARBEN.meer,
      stroke: 'none',
      strokeWidth: 0,
    },
    land(ASIEN),
    land(BORNEO_NORD),
    land(HONSHU),
    land(KYUSHU),
    land(SHIKOKU),
    land(HOKKAIDO),
    land(SACHALIN),
    land(TAIWAN),
    land(OKINAWA),
    land(AMAMI),
    ...KURILEN.map(land),
    ...PHILIPPINEN.map(land),
    land(GUAM),
    land(SAIPAN),
    land(TINIAN),
    land(IWOJIMA),
    land(MIDWAY),
    land(WAKE),
    land(KWAJALEIN),
    land(MAJURO),
    ...HAWAII.map(land),
    land(NORDAMERIKA),
    land(VANCOUVER_ISLAND),
    land(HAIDA_GWAII),
    land(KODIAK),
    ...ALEUTEN.map(land),
    fluss(JANGTSE),
    fluss(PERLFLUSS),
    fluss(AMUR),
    fluss(COLUMBIA),
    fluss(SACRAMENTO),
  ],

  phasen: [
    {
      id: 'kontinentalmacht',
      label: '1890',
      hinweis:
        'Die USA sind eine Kontinentalmacht: Das Land reicht von Meer zu Meer, die Volkszählung erklärt in diesem Jahr die Frontier für geschlossen, und die Industrie hat Großbritannien bei Stahl und Kohle bereits überholt. Im Pazifik dagegen besitzen die USA fast nichts — nur Alaska, 1867 von Russland gekauft, und ein Nutzungsrecht auf Pearl Harbor, das ihnen das unabhängige Königreich Hawaii 1887 eingeräumt hat. Alles andere gehört anderen: die Philippinen und die Marianen Spanien, die Marshallinseln seit 1885 dem Deutschen Reich, Sibirien und Sachalin Russland. Korea ist noch ein eigenes Königreich, China das Reich der Qing — beide Flächen laufen weit über den linken Bildrand hinaus.',
      flaechen: [
        gebietTeile('Die Vereinigten Staaten — eine Kontinentalmacht, im Pazifik nur mit Alaska (1867 gekauft)', [
          USA_FESTLAND, ALASKA, KODIAK, ...ALEUTEN,
        ]),
        gebiet('Kanada — britisches Dominion seit 1867', KANADA),
        gebiet('Mexiko', MEXIKO),
        gebietTeile('Das Königreich Hawaii — unabhängig, seit 1887 mit einem US-Flottenrecht auf Pearl Harbor', HAWAII),
        gebietTeile('Die Philippinen — spanische Kolonie seit 1565', PHILIPPINEN),
        gebietTeile('Die Marianen — spanische Kolonie', [GUAM, SAIPAN, TINIAN]),
        gebietTeile('Die Marshallinseln — deutsches Schutzgebiet seit 1885', [KWAJALEIN, MAJURO]),
        gebietTeile('Das Kaiserreich Japan — seit 1868 in der Meiji-Zeit', [
          ...JAPAN_KERN, OKINAWA, AMAMI, ...KURILEN,
        ]),
        gebiet('Das Königreich Korea — noch selbstständig', KOREA_GANZ),
        gebiet('Das Kaiserreich China (Qing) — seine Grenzen reichen weit über den linken Bildrand hinaus', CHINA),
        gebietTeile('Das Russische Reich — Sibirien, Kamtschatka und ganz Sachalin', [RUSSLAND, SACHALIN]),
      ],
    },
    {
      id: 'weltkriegsmacht',
      label: '1917',
      hinweis:
        'Neunzehn Jahre später ist die Karte eine andere. Der Spanisch-Amerikanische Krieg von 1898 hat den USA die Philippinen, Guam und Puerto Rico gebracht; im selben Jahr wurde Hawaii annektiert, 1899 Wake. Midway gehört schon seit 1867 dazu. Aus einem Land ohne Kolonien ist eine Kolonialmacht geworden — und aus dem Pazifik ein amerikanisches Vorfeld. Japan ist denselben Weg gegangen: Taiwan 1895, Süd-Sachalin 1905, Korea 1910, und seit 1914 hält es die deutschen Inselgebiete nördlich des Äquators besetzt. Zwei aufsteigende Mächte teilen sich jetzt einen Ozean. In Europa treten die USA 1917 in den Weltkrieg ein; in Russland stürzt in diesem Jahr das Zarenreich.',
      flaechen: [
        gebietTeile('Die Vereinigten Staaten und ihre pazifischen Gebiete — Alaska und Midway (1867), Hawaii, Guam und die Philippinen (1898), Wake (1899)', [
          USA_FESTLAND, ALASKA, KODIAK, ...ALEUTEN, ...HAWAII, ...PHILIPPINEN, GUAM, MIDWAY, WAKE,
        ]),
        gebiet('Kanada — britisches Dominion', KANADA),
        gebiet('Mexiko', MEXIKO),
        gebietTeile('Das Kaiserreich Japan — mit Taiwan (1895), Süd-Sachalin (1905) und Korea (1910)', [
          ...JAPAN_KERN, OKINAWA, AMAMI, ...KURILEN, TAIWAN, KOREA_GANZ, SACHALIN_SUED,
        ]),
        gebietTeile('Von Japan besetzte deutsche Inselgebiete (seit 1914) — die Marianen ohne Guam und die Marshallinseln', [
          SAIPAN, TINIAN, KWAJALEIN, MAJURO,
        ]),
        gebiet('Die Republik China (seit 1911) — auch sie reicht weit über den linken Bildrand hinaus', CHINA),
        gebietTeile('Russland — 1917 geht das Zarenreich in der Revolution unter; Nord-Sachalin bleibt russisch', [
          RUSSLAND, SACHALIN_NORD,
        ]),
      ],
    },
    {
      id: 'supermacht',
      label: '1945',
      hinweis:
        'Der Pazifikkrieg ist entschieden. Japan hat 1941/42 fast den ganzen westlichen Pazifik erobert — Guam, Wake, die Philippinen, Teile der Aleuten — und ihn zwischen 1943 und 1945 wieder verloren. Nach der Kapitulation vom 2. September 1945 bleiben dem Kaiserreich die vier Hauptinseln: Taiwan fällt an China zurück, Korea wird am 38. Breitengrad in eine sowjetische und eine amerikanische Besatzungszone geteilt, Süd-Sachalin und die Kurilen gehen an die Sowjetunion, und die Marianen, die Marshallinseln und Okinawa stehen unter amerikanischer Verwaltung. Die Philippinen sind noch US-Gebiet — sie werden am 4. Juli 1946 unabhängig. Es ist der Zustand eines einzigen Jahres, nicht ein Ergebnis für alle Zeit.',
      flaechen: [
        gebietTeile('Die Vereinigten Staaten und ihre Gebiete — die Philippinen werden am 4. Juli 1946 unabhängig', [
          USA_FESTLAND, ALASKA, KODIAK, ...ALEUTEN, ...HAWAII, ...PHILIPPINEN, GUAM, MIDWAY, WAKE,
        ]),
        gebietTeile('Von den USA verwaltete Inseln — die Marianen und die Marshallinseln (1944 erobert), Iwojima und Okinawa (1945)', [
          SAIPAN, TINIAN, KWAJALEIN, MAJURO, IWOJIMA, OKINAWA,
        ]),
        gebiet('Kanada — britisches Dominion', KANADA),
        gebiet('Mexiko', MEXIKO),
        gebietTeile('Japan — am 2. September 1945 kapituliert und von den USA besetzt', JAPAN_KERN),
        gebiet('Korea nördlich des 38. Breitengrads — sowjetische Besatzungszone', KOREA_NORD),
        gebiet('Korea südlich des 38. Breitengrads — amerikanische Besatzungszone', KOREA_SUED),
        gebietTeile('Die Republik China — Taiwan fällt 1945 an China zurück', [CHINA, TAIWAN]),
        gebietTeile('Die Sowjetunion — mit ganz Sachalin und den Kurilen (September 1945)', [
          RUSSLAND, SACHALIN, ...KURILEN,
        ]),
      ],
    },
  ],

  punkte: [
    {
      id: 'san-francisco',
      name: 'San Francisco',
      typ: 'stadt',
      ...ort(-122.42, 37.77),
      text: [
        'Das Tor der USA zum Pazifik. Von hier liefen 1898 die Truppentransporter',
        'nach Manila aus, hier kamen die Rohstoffe und Waren an, die den Handel mit',
        'Asien trugen. Die Stadt zeigt aber auch die unbequeme Seite des',
        '„Schmelztiegels": Auf Angel Island in der Bucht stand ab 1910 die',
        'Einwanderungsstation für Asien — und anders als auf Ellis Island in New York',
        'ging es dort nicht ums Ankommen, sondern ums Abweisen. Grundlage war der',
        'Chinese Exclusion Act von 1882, das erste Gesetz der US-Geschichte, das eine',
        'ganze Volksgruppe von der Einwanderung ausschloss. Er galt bis 1943.',
      ].join(' '),
    },
    {
      id: 'pearl-harbor',
      name: 'Pearl Harbor (Hawaii)',
      typ: 'ereignis',
      ...ort(-157.95, 21.35),
      text: [
        'Der wichtigste Flottenstützpunkt der USA im Pazifik — und der Ort, an dem',
        'zwei Daten dieses Kapitels zusammenfallen. 1887 räumte das Königreich Hawaii',
        'den USA das Recht ein, hier eine Kohlestation zu unterhalten. 1893 stürzten',
        'amerikanische Zuckerpflanzer mit Hilfe von US-Marineinfanteristen Königin',
        'Liliʻuokalani; 1898 wurde Hawaii annektiert. Präsident Cleveland hatte den',
        'Umsturz 1893 selbst als völkerrechtswidrig bezeichnet — 1993 entschuldigte',
        'sich der US-Kongress in einer eigenen Resolution dafür. Am Morgen des',
        '7. Dezember 1941 griffen japanische Trägerflugzeuge den Hafen an: rund 2 400',
        'Tote, acht Schlachtschiffe getroffen. Am Tag darauf erklärten die USA Japan',
        'den Krieg.',
      ].join(' '),
    },
    {
      id: 'manila',
      name: 'Manila',
      typ: 'ereignis',
      ...ort(120.98, 14.6),
      text: [
        'Am 1. Mai 1898 vernichtete Commodore George Dewey in der Bucht von Manila',
        'binnen weniger Stunden das spanische Pazifikgeschwader — die erste Schlacht',
        'eines Krieges, der offiziell um Kuba geführt wurde. Die philippinische',
        'Unabhängigkeitsbewegung unter Emilio Aguinaldo kämpfte seit 1896 gegen',
        'Spanien und sah in den USA zunächst einen Verbündeten; am 12. Juni 1898 rief',
        'sie die Republik aus. Im Vertrag von Paris kauften die USA die Inseln',
        'stattdessen für 20 Millionen Dollar. Es folgte der Philippinisch-',
        'Amerikanische Krieg 1899–1902 mit mindestens 200 000 toten Filipinos, die',
        'meisten durch Hunger und Seuchen. 1946 wurden die Philippinen unabhängig.',
      ].join(' '),
    },
    {
      id: 'guam',
      name: 'Guam',
      typ: 'ereignis',
      ...ort(144.75, 13.45),
      text: [
        'Die Insel wechselte in fünfzig Jahren dreimal den Herrn — und wurde dabei',
        'nie gefragt. 1898 nahm ein US-Kriegsschiff sie den Spaniern ab, deren',
        'Kommandant vom Kriegsausbruch noch gar nichts wusste. Am 10. Dezember 1941',
        'besetzten japanische Truppen die Insel; die Chamorro, ihre Bewohner,',
        'erlebten zweieinhalb Jahre Zwangsarbeit und Straflager. Im Juli 1944',
        'eroberten die USA Guam zurück und bauten es zum größten Flugplatz-Komplex',
        'des Pazifiks aus. Bis heute ist Guam US-Gebiet: Seine Bewohner sind',
        'US-Staatsbürger, dürfen aber nicht über den Präsidenten mitbestimmen.',
      ].join(' '),
    },
    {
      id: 'midway',
      name: 'Midway',
      typ: 'ereignis',
      ...ort(-177.37, 28.2),
      text: [
        'Ein Atoll von sechs Quadratkilometern, seit 1867 amerikanisch, ab 1903',
        'Zwischenstation des Pazifik-Seekabels. Vom 4. bis 7. Juni 1942 fand hier die',
        'Seeschlacht statt, die den Pazifikkrieg drehte: Die US-Marine verlor einen',
        'Flugzeugträger, die japanische vier — und mit ihnen einen großen Teil ihrer',
        'erfahrensten Flugzeugbesatzungen. Entscheidend war weniger das Material als',
        'die Entschlüsselung des japanischen Marinecodes: Die Amerikaner wussten,',
        'wohin der Angriff zielte. Von Midway an lag die Anfangsinitiative bei den',
        'USA — der Krieg dauerte trotzdem noch mehr als drei Jahre.',
      ].join(' '),
    },
    {
      id: 'hiroshima',
      name: 'Hiroshima',
      typ: 'ereignis',
      ...ort(132.46, 34.39),
      text: [
        'Am 6. August 1945 warf ein amerikanischer Bomber die erste im Krieg',
        'eingesetzte Atombombe über Hiroshima ab, am 9. August die zweite über',
        'Nagasaki. Schätzungen der Toten reichen für Hiroshima von 70 000 bis 140 000',
        'und für Nagasaki von 40 000 bis 80 000 bis zum Jahresende 1945 — die',
        'Spannweite ist so groß, weil niemand mehr zählen konnte und die Folgen der',
        'Strahlung sich über Jahre hinzogen. Das ist die unbequemste Stelle der',
        'amerikanischen Erzählung, und sie gehört ausdrücklich hierher: Die Bombe',
        'traf zwei Städte und nicht zwei Armeen. Über ihre Notwendigkeit wird bis',
        'heute gestritten — auch in den USA, auch von Beteiligten von damals.',
      ].join(' '),
    },
    {
      id: 'tokio',
      name: 'Tokio',
      typ: 'stadt',
      ...ort(139.77, 35.68),
      text: [
        'In dieser Bucht schließt sich ein Kreis. 1853 fuhr Commodore Matthew Perry',
        'mit vier Kriegsschiffen hier ein und erzwang die Öffnung Japans, das sich',
        'zweihundert Jahre lang abgeschottet hatte. Am 2. September 1945 unterzeichnete',
        'eine japanische Delegation an Bord der USS Missouri, ebenfalls in der Bucht',
        'von Tokio, die Kapitulation — Perrys Flagge von 1853 hing dabei sichtbar an',
        'der Wand. Zwischen beiden Tagen liegen 92 Jahre, in denen aus einem',
        'abgeschlossenen Inselreich eine Großmacht und aus einer Republik am Rand der',
        'Welt eine Supermacht wurde. Es folgten sieben Jahre amerikanischer Besatzung.',
      ].join(' '),
    },
  ],

  bewegungen: [
    {
      id: 'dewey-1898',
      name: 'Deweys Geschwader nach Manila (1898)',
      von: p(114.17, 22.3),
      ueber: [p(118.5, 18.5)],
      nach: p(120.98, 14.6),
      text: [
        'Der Spanisch-Amerikanische Krieg begann am 21. April 1898 wegen Kuba — die',
        'erste Schlacht wurde zehn Tage später auf der anderen Seite der Erde',
        'geschlagen. Commodore George Dewey lief mit dem Asiengeschwader aus Hongkong',
        'aus und versenkte am 1. Mai in der Bucht von Manila die spanische Flotte,',
        'ohne ein Schiff zu verlieren. Innerhalb von zehn Wochen erwarben die USA',
        'Puerto Rico, Guam und die Philippinen und wurden damit eine Kolonialmacht —',
        'ein Ergebnis, über das im Kongress erbittert gestritten wurde.',
      ].join(' '),
    },
    {
      id: 'pearl-harbor-angriff',
      name: 'Die japanische Trägerflotte nach Pearl Harbor (1941)',
      von: p(147.5, 45.2),
      ueber: [p(170.0, 43.0), p(-175.0, 38.0), p(-162.0, 27.0)],
      nach: p(-157.95, 21.35),
      text: [
        'Am 26. November 1941 lief eine japanische Flotte aus sechs Flugzeugträgern',
        'von der Hitokappu-Bucht auf der Kurilen-Insel Iturup aus. Sie nahm bewusst',
        'den nördlichen, stürmischen und wenig befahrenen Weg, hielt Funkstille und',
        'blieb unentdeckt. Am Morgen des 7. Dezember 1941 starteten von ihr aus zwei',
        'Angriffswellen auf Pearl Harbor. Der Angriff traf die Schlachtschiffe, nicht',
        'aber die Flugzeugträger, die zufällig auf See waren — und nicht die',
        'Treibstofflager. Für die USA endete an diesem Tag jede Debatte über den',
        'Isolationismus: Der Kongress erklärte den Krieg mit einer Gegenstimme.',
      ].join(' '),
    },
    {
      id: 'inselspringen',
      name: 'Inselspringen — der Weg zurück (1944/45)',
      von: p(167.73, 8.72),
      ueber: [p(145.75, 15.19), p(141.29, 24.78)],
      nach: p(127.85, 26.33),
      text: [
        'Statt jede besetzte Insel zurückzuerobern, nahmen die USA nur die, von denen',
        'aus sich die nächste erreichen ließ, und ließen die übrigen abgeschnitten',
        'zurück. Der Weg führte über die Marshallinseln (Kwajalein, Februar 1944) und',
        'die Marianen (Saipan, Juni 1944) nach Iwojima (Februar 1945) und Okinawa',
        '(April bis Juni 1945). Die Verluste stiegen mit jeder Etappe: Auf Okinawa',
        'starben rund 12 500 Amerikaner, über 70 000 japanische Soldaten und',
        'schätzungsweise mehr als 100 000 Zivilisten — ein Viertel der',
        'Inselbevölkerung. Diese Zahlen standen im Sommer 1945 hinter jeder',
        'Überlegung, was eine Landung in Japan selbst kosten würde.',
      ].join(' '),
    },
    {
      id: 'atombombe',
      name: 'Von Tinian nach Hiroshima (6. August 1945)',
      von: p(145.62, 14.99),
      ueber: [p(141.0, 22.0)],
      nach: p(132.46, 34.39),
      text: [
        'Von der Marianen-Insel Tinian, im Sommer 1944 erobert und zum größten',
        'Flugplatz der Welt ausgebaut, startete am 6. August 1945 der Bomber, der die',
        'erste Atombombe über Hiroshima abwarf; drei Tage später folgte Nagasaki. Der',
        'Weg auf dieser Karte ist gut 2 500 Kilometer lang — genau dafür waren die',
        'Inseln erobert worden, die er überfliegt. Präsident Truman erfuhr von der',
        'Existenz der Bombe erst nach Roosevelts Tod im April 1945. Was ihre Strahlung',
        'langfristig anrichten würde, wusste 1945 niemand vollständig; dass eine',
        'ganze Stadt getroffen würde, wussten alle Beteiligten.',
      ].join(' '),
    },
  ],

  beschriftungen: [
    { text: 'Pazifischer Ozean', art: 'meer', ...ort(-170.0, 35.0) },
    { text: 'Beringmeer', art: 'meer', ...ort(-177.0, 57.0) },
    { text: 'Golf von Alaska', art: 'meer', ...ort(-146.0, 56.5) },
    { text: 'Ochotskisches Meer', art: 'meer', ...ort(148.0, 54.5) },
    { text: 'Japanisches Meer', art: 'meer', ...ort(134.5, 39.8) },
    { text: 'Ostchinesisches Meer', art: 'meer', ...ort(125.5, 29.5) },
    { text: 'Südchinesisches Meer', art: 'meer', ...ort(115.5, 13.5) },
    { text: 'Vereinigte Staaten', art: 'land', ...ort(-119.0, 41.0) },
    { text: 'Alaska', art: 'land', ...ort(-155.0, 60.5) },
    { text: 'Kanada', art: 'land', ...ort(-124.0, 56.5) },
    { text: 'Mexiko', art: 'land', ...ort(-111.0, 25.5) },
    { text: 'Hawaii', art: 'land', ...ort(-157.0, 19.3) },
    { text: 'Midway', art: 'land', ...ort(-177.37, 29.6) },
    { text: 'Wake', art: 'land', ...ort(166.63, 20.7) },
    { text: 'Marshallinseln', art: 'land', ...ort(169.5, 9.6) },
    { text: 'Marianen', art: 'land', ...ort(146.5, 16.8) },
    { text: 'Aleuten', art: 'land', drehung: -12, ...ort(-172.0, 51.0) },
    { text: 'Kamtschatka', art: 'land', drehung: 80, ...ort(159.5, 56.5) },
    { text: 'Sibirien', art: 'land', ...ort(139.0, 56.5) },
    { text: 'Kurilen', art: 'land', drehung: -55, ...ort(151.5, 47.6) },
    { text: 'Japan', art: 'land', ...ort(138.0, 37.8) },
    { text: 'Korea', art: 'land', ...ort(127.4, 37.2) },
    { text: 'China', art: 'land', ...ort(112.5, 27.0) },
    { text: 'Taiwan', art: 'land', ...ort(121.0, 22.4) },
    { text: 'Philippinen', art: 'land', ...ort(122.8, 11.0) },
  ],
};

module.exports = karte;
