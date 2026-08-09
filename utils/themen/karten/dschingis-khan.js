// Die Karte zum Thema „Dschingis Khan und die Mongolen".
//
// Aufgebaut wie karten/roemisches-reich.js und karten/china.js: Die
// Küstenlinien stehen als echte Längen-/Breitengrade `[lon, lat]` im Repo,
// utils/karte-geo.js rechnet sie in SVG-Koordinaten um. Wer einen Punkt
// anzweifelt, schlägt ihn im Atlas nach: `[16.2, 51.2]` ist Liegnitz,
// `[102.8, 47.4]` Karakorum, `[116.4, 39.9]` Dadu — das heutige Peking.
//
// Der Ausschnitt ist der größte der App, und das ist der Punkt: Nur so passen
// Liegnitz in Schlesien und Dadu am Gelben Meer auf ein einziges Bild. Genau
// das ist die Aussage dieses Kapitels — ein Reich, das beide Enden dieses
// Bildes zusammenhielt. Die Karte wird dadurch ein flaches, breites Band;
// sie soll auch so wirken. Alles, was hier von links nach rechts läuft, hat
// im 13. Jahrhundert jemand geritten.
//
// Zwei bewusste Vereinfachungen, damit die Karte bei 5,2 SVG-Einheiten je
// Längengrad überhaupt etwas zeigt:
//   * Die Meerengen am Bosporus und an den Dardanellen sind breiter
//     gezeichnet, als sie sind — in Wahrheit wären sie ein halber Strich.
//   * Rotes Meer und Ostsee laufen als geschlossene Wasserflächen über den
//     Bildrand hinaus, statt über die halbe Erde ans offene Meer geführt zu
//     werden.
// Beides steht hier, damit niemand die Karte für genauer hält, als sie ist.
//
// Reine Daten und Rechnung — keine UI-Importe (Architektur-Regel).

const { KARTENFARBEN, erstelleProjektion, verbinde } = require('../../karte-geo');

// ---------------------------------------------------------------------------
// Ausschnitt und Projektion
// ---------------------------------------------------------------------------

/**
 * Der Kartenausschnitt: von Italien und der Adria (8° O) bis Japan (143° O),
 * vom Persischen Golf (20° N) bis Nowgorod und die Ostsee (58° N).
 *
 * Die Grenzen sind nicht gerundet gewählt, sondern von den beiden Orten her,
 * die zusammen auf ein Bild müssen: Liegnitz bei 16,2° O und Dadu bei
 * 116,4° O. Dazwischen liegen 100 Längengrade — die Strecke, die Batus Heer
 * 1236 bis 1241 zurückgelegt hat.
 */
const RAHMEN = { minLon: 8, maxLon: 143, minLat: 20, maxLat: 58, breite: 700 };

const geo = erstelleProjektion(RAHMEN);

/** Kurzform: geografischer Ort → SVG-Punkt `[x, y]`. */
const p = (lon, lat) => geo.punkt(lon, lat);

/** Kurzform für die Objektschreibweise `{ x, y }` eines Ortes. */
const xy = (lon, lat) => {
  const [x, y] = p(lon, lat);
  return { x, y };
};

// ---------------------------------------------------------------------------
// Küstenabschnitte — jeweils in einer Richtung notiert, damit sie sich
// aneinanderhängen lassen (`verbinde`). Der Umriss läuft im Uhrzeigersinn:
// vom westlichen Mittelmeer über Levante, Arabien, Indien und China bis
// Sibirien.
// ---------------------------------------------------------------------------

/** Italien, Westseite: von der Riviera bis zur Stiefelspitze. */
const ITALIEN_WEST = [
  [6.0, 43.4], // schon außerhalb des Bildes, an der Côte d’Azur
  [8.9, 44.4], // Genua
  [9.8, 44.1],
  [10.3, 43.5], // Livorno
  [10.5, 42.9],
  [11.8, 42.1],
  [12.3, 41.7], // die Tibermündung — der Hafen Roms
  [13.6, 41.2], // Gaeta
  [14.3, 40.8], // Golf von Neapel
  [14.9, 40.3],
  [15.3, 40.0], // Kap Palinuro
  [15.7, 40.1], // Golf von Policastro
  [16.0, 39.4],
  [15.9, 38.7],
  [15.6, 38.1], // Reggio, an der Straße von Messina
  [16.1, 37.9], // Kap Spartivento — die Stiefelspitze
];

/** Italien, Ostseite: um den Absatz herum und die Adria hinauf. */
const ITALIEN_OST = [
  [16.1, 37.9],
  [16.6, 38.4],
  [17.2, 39.0], // Kap Colonna bei Kroton
  [16.6, 39.6], // Golf von Tarent
  [17.2, 40.5], // Tarent
  [18.0, 40.1],
  [18.4, 39.8], // Kap Santa Maria di Leuca — der Absatz
  [18.5, 40.2], // Otranto
  [17.9, 40.7], // Brindisi
  [16.9, 41.1], // Bari
  [16.2, 41.9], // der Sporn: der Monte Gargano
  [15.9, 41.6],
  [14.2, 42.5], // Pescara
  [13.5, 43.6], // Ancona
  [12.6, 44.1],
  [12.4, 44.8], // das Podelta
  [12.3, 45.4], // Venedig — hier bricht Marco Polo 1271 auf
  [13.8, 45.7], // Triest
];

/** Die Ostküste der Adria: Istrien, Dalmatien, Albanien. */
const DALMATIEN = [
  [13.8, 45.7],
  [13.8, 44.9], // Istrien
  [15.2, 44.1], // Zadar
  [16.4, 43.5], // Split
  [18.1, 42.6], // Ragusa — das heutige Dubrovnik
  [18.8, 42.4], // die Bucht von Kotor
  [19.5, 41.3], // Durazzo
  [19.5, 40.5],
  [20.0, 39.6], // gegenüber von Korfu
];

/** Griechenland und die Ägäis bis an die Dardanellen. */
const GRIECHENLAND = [
  [20.0, 39.6],
  [20.8, 38.9],
  [21.4, 38.3], // der Golf von Patras
  [21.3, 37.6],
  [21.7, 37.0],
  [22.4, 36.5], // Kap Tenaro, der Südzipfel der Peloponnes
  [23.1, 36.4], // Kap Malea
  [23.5, 37.5], // der Saronische Golf bei Athen
  [24.0, 38.2], // Euböa
  [23.2, 39.0],
  [23.4, 40.2], // die Chalkidike
  [24.5, 40.6],
  [25.9, 40.9], // die Mündung der Mariza
  [26.2, 40.4], // Gallipoli — die europäische Seite der Dardanellen
];

/** Die europäische Seite von Dardanellen und Marmarameer. */
const MARMARA_NORD = [
  [26.2, 40.4],
  [27.0, 40.8],
  [28.0, 41.0],
  [28.8, 41.3], // der Bosporus — hier liegt Konstantinopel
];

/** Die Westküste des Schwarzen Meeres bis auf die Krim. */
const SCHWARZMEER_WEST = [
  [28.8, 41.3],
  [28.0, 41.9],
  [27.5, 42.5], // Burgas
  [27.9, 43.2], // Warna
  [28.6, 44.2],
  [29.7, 45.2], // das Donaudelta
  [30.7, 46.5], // dort, wo heute Odessa liegt
  [32.3, 46.6], // die Dnepr-Mündung
  [33.7, 46.1], // die Landenge von Perekop — das Tor zur Krim
  [33.4, 45.2],
  [33.5, 44.6], // Sewastopol
  [34.2, 44.5],
  [35.4, 45.0], // Kaffa
  [36.6, 45.4], // die Straße von Kertsch
];

/** Das Asowsche Meer, die Donmündung und die Küste unter dem Kaukasus. */
const ASOW_KAUKASUS = [
  [36.6, 45.4],
  [35.8, 45.9],
  [36.8, 46.8],
  [38.3, 46.9],
  [39.3, 47.1], // die Donmündung
  [39.3, 46.6],
  [38.2, 46.1],
  [37.3, 45.4],
  [37.8, 44.7],
  [39.5, 43.5],
  [41.0, 43.0],
  [41.7, 42.2], // Poti, am Fuß des Kaukasus
  [41.6, 41.6], // Batumi
];

/** Die Nordküste Anatoliens, zurück nach Westen an den Bosporus. */
const ANATOLIEN_NORD = [
  [41.6, 41.6],
  [39.7, 41.0], // Trapezunt
  [38.0, 41.0],
  [36.3, 41.3], // Samsun
  [35.2, 42.0], // Sinope
  [33.8, 41.9],
  [31.8, 41.4],
  [30.2, 41.2],
  [29.4, 41.0], // die asiatische Seite des Bosporus
];

/** Die asiatische Seite von Marmarameer und Dardanellen. */
const MARMARA_SUED = [
  [29.4, 41.0],
  [28.6, 40.6],
  [27.5, 40.3],
  [26.7, 40.0], // Abydos, gegenüber von Gallipoli
];

/** Die Westküste Kleinasiens. */
const AEGAEIS_OST = [
  [26.7, 40.0],
  [26.2, 39.5], // die Troas
  [26.7, 38.8],
  [26.9, 38.4], // Smyrna
  [27.3, 37.7],
  [27.4, 37.0], // Halikarnassos
  [28.2, 36.6],
  [29.1, 36.2], // Lykien
];

/** Die Südküste Anatoliens bis zum Golf von Iskenderun. */
const ANATOLIEN_SUED = [
  [29.1, 36.2],
  [30.6, 36.8], // Antalya
  [31.8, 36.3],
  [33.5, 36.1], // Kap Anamur
  [34.6, 36.8], // Mersin
  [35.8, 36.6],
  [36.2, 36.6],
];

/** Die Levante: von Nordsyrien bis vor das Nildelta. */
const LEVANTE = [
  [36.2, 36.6],
  [35.9, 35.9], // Latakia
  [35.6, 34.6], // Tripolis
  [35.5, 33.9], // Beirut
  [35.1, 33.1], // Tyros
  [34.9, 32.5], // Akkon
  [34.6, 31.6], // Gaza
  [33.8, 31.2],
  [32.9, 31.1], // Pelusium, am Ostrand des Nildeltas
  [32.7, 30.3], // die Landenge von Suez
];

/** Sinai und die arabische Seite des Roten Meeres, hinaus aus dem Bild. */
const ARABIEN_WEST = [
  [32.7, 30.3],
  [33.4, 29.2], // die Westseite des Sinai
  [34.0, 27.9], // die Südspitze des Sinai
  [34.8, 28.7], // der Golf von Akaba
  [35.0, 29.5], // Akaba
  [35.6, 28.0],
  [36.6, 25.8],
  [38.0, 24.0], // Yanbu
  [39.2, 21.5], // Dschidda
  [41.0, 18.5], // schon unter dem Bildrand
  [43.4, 12.7], // Bab al-Mandab, weit außerhalb
];

/** Die Südküste Arabiens und der Golf von Oman. */
const ARABIEN_SUED = [
  [43.4, 12.7],
  [45.0, 12.8], // Aden
  [49.0, 14.0],
  [52.2, 15.6],
  [54.1, 17.0], // Salala
  [57.0, 19.5],
  [59.8, 22.5], // Ras al-Hadd, die Ostspitze Arabiens
  [58.6, 23.6], // Maskat
  [56.5, 24.5],
  [56.3, 26.3], // Musandam, an der Straße von Hormus
];

/** Die arabische Seite des Persischen Golfs bis zur Mündung des Schatt. */
const GOLF_ARABIEN = [
  [56.3, 26.3],
  [54.4, 24.5],
  [52.6, 24.2],
  [51.6, 24.6], // die Südspitze Katars
  [51.2, 25.9], // Katar
  [50.7, 25.4],
  [50.6, 26.4],
  [49.6, 27.0],
  [48.8, 28.5],
  [48.2, 29.4], // die Bucht von Kuwait
  [48.5, 30.0], // die Mündung des Schatt al-Arab
];

/** Die persische Seite des Golfs, zurück zur Straße von Hormus. */
const GOLF_PERSIEN = [
  [48.5, 30.0],
  [49.6, 30.2],
  [50.8, 28.9], // Buschir
  [52.6, 27.8],
  [54.5, 26.8],
  [55.9, 26.6],
  [56.9, 27.2], // Bandar Abbas an der Straße von Hormus
];

/** Makran: die Küste zwischen Persien und dem Indus. */
const MAKRAN = [
  [56.9, 27.2],
  [57.8, 25.7],
  [60.6, 25.3],
  [62.3, 25.2],
  [64.5, 25.2],
  [66.9, 24.9], // dort, wo heute Karatschi liegt
  [67.4, 24.0], // die Mündung des Indus
];

/** Die Westküste Indiens, nur mit ihrem Nordteil im Bild. */
const INDIEN_WEST = [
  [67.4, 24.0],
  [68.7, 23.6],
  [70.0, 22.8], // der Golf von Kachchh
  [69.1, 22.2],
  [70.0, 20.8], // der Südrand der Halbinsel Kathiawar
  [72.2, 21.1],
  [72.7, 21.7], // der Golf von Khambhat
  [72.6, 20.7],
  [73.0, 18.0], // schon unter dem Bildrand
  [74.5, 14.0],
  [77.0, 8.5], // Kap Komorin, weit außerhalb
];

/** Die Ostküste Indiens bis zum Gangesdelta. */
const INDIEN_OST = [
  [77.0, 8.5],
  [80.3, 13.1],
  [82.3, 16.6],
  [85.1, 19.7],
  [86.9, 20.7],
  [87.0, 21.6],
  [89.0, 21.7], // das Gangesdelta
  [91.8, 22.3],
];

/** Birma und Hinterindien bis in den Golf von Tonkin. */
const HINTERINDIEN = [
  [91.8, 22.3],
  [92.6, 20.7],
  [94.2, 16.5],
  [95.3, 15.8], // das Delta des Irawadi
  [97.5, 16.5],
  [98.3, 12.5],
  [99.5, 11.5],
  [100.0, 13.2], // der Grund des Golfs von Siam
  [102.5, 12.2],
  [104.9, 9.6],
  [106.7, 10.5], // das Mekongdelta
  [109.4, 12.9],
  [108.2, 16.1],
  [105.9, 18.3],
  [106.5, 20.3], // das Delta des Roten Flusses
];

/** Die Südküste Chinas bis zur Perlflussmündung. */
const KUESTE_LINGNAN = [
  [106.5, 20.3],
  [108.1, 21.5],
  [109.6, 21.4],
  [110.4, 20.4], // die Südspitze der Halbinsel Leizhou
  [111.4, 21.5],
  [113.2, 22.0],
  [113.6, 22.4], // die Perlflussmündung
];

/** Die Südostküste Chinas bis zur Mündung des Jangtse. */
const KUESTE_SUEDOST = [
  [113.6, 22.4],
  [114.3, 22.5], // Hongkong
  [116.7, 23.4],
  [118.4, 24.5], // Xiamen
  [119.7, 26.1], // Fuzhou
  [120.4, 27.1],
  [121.6, 29.1],
  [121.9, 29.9], // Ningbo
  [120.5, 30.4], // die Bucht von Hangzhou
  [121.2, 30.9],
  [121.9, 31.4], // die Mündung des Jangtse
];

/** Die Ostküste: Jangtse → Halbinsel Shandong → Bohai-Bucht. */
const KUESTE_SHANDONG = [
  [121.9, 31.4],
  [120.9, 33.0],
  [119.8, 34.8],
  [120.4, 36.1], // Qingdao
  [122.7, 37.4], // die Ostspitze der Halbinsel Shandong
  [121.2, 37.6], // Yantai
  [120.3, 37.8], // Penglai, an der Bohai-Straße
  [118.9, 37.9], // die Mündung des Gelben Flusses
  [117.7, 38.9], // dort, wo heute Tianjin liegt
  [119.6, 39.9], // Shanhaiguan — hier stößt die Große Mauer ans Meer
];

/** Bohai und Liaodong bis zur Mündung des Yalu. */
const KUESTE_LIAODONG = [
  [119.6, 39.9],
  [121.2, 40.8],
  [122.1, 40.9], // die Mündung des Liao
  [121.3, 39.2],
  [121.6, 38.9], // die Südspitze der Halbinsel Liaodong
  [123.6, 39.8],
  [124.4, 40.0], // die Mündung des Yalu
];

/** Korea, im Uhrzeigersinn vom Yalu bis zur Mündung des Tumen. */
const KOREA = [
  [124.4, 40.0],
  [125.4, 39.6],
  [126.0, 38.3],
  [126.6, 37.5], // Inchon
  [126.4, 36.7],
  [126.3, 34.4], // Mokpo, die Südwestecke
  [128.5, 34.8],
  [129.1, 35.1], // Pusan, gegenüber von Japan
  [129.3, 36.8],
  [128.4, 38.4],
  [127.5, 39.3], // Wonsan
  [129.4, 40.8],
  [130.6, 42.3], // die Mündung des Tumen
];

/** Die Küste nordöstlich davon, hinaus über den Bildrand. */
const KUESTE_NORDOST = [
  [130.6, 42.3],
  [131.9, 43.1], // dort, wo heute Wladiwostok liegt
  [134.8, 43.5],
  [136.5, 44.5],
  [138.5, 46.5],
  [140.3, 48.8],
  [141.0, 51.0],
  [141.5, 56.0], // schon über dem Bildrand
];

// ---------------------------------------------------------------------------
// Inseln
// ---------------------------------------------------------------------------

/** Honschu — die Hauptinsel Japans. Zweimal blieb sie unerreicht. */
const HONSHU = [
  [131.0, 34.0],
  [133.3, 35.5],
  [135.9, 35.6], // die Bucht von Wakasa
  [136.8, 37.4], // die Halbinsel Noto
  [138.3, 37.2],
  [139.9, 39.9],
  [140.4, 41.2],
  [141.1, 41.4], // die Nordspitze an der Tsugaru-Straße
  [141.6, 39.7],
  [141.1, 38.3],
  [140.9, 35.7], // Kap Inubo, der Ostpunkt
  [139.8, 34.9], // die Bucht von Tokio
  [138.9, 34.6], // die Halbinsel Izu
  [137.0, 34.6],
  [136.1, 33.6],
  [135.4, 33.4], // die Südspitze der Halbinsel Kii
  [134.2, 34.4],
  [132.5, 34.3],
];

const SHIKOKU = [
  [132.4, 33.5],
  [133.3, 33.5],
  [134.7, 34.2],
  [133.7, 34.3],
  [132.3, 33.9],
];

/** Kyushu — hier landeten 1274 und 1281 die Flotten Kublai Khans. */
const KYUSHU = [
  [129.9, 33.3],
  [130.4, 33.6], // die Bucht von Hakata, wo die Landung scheiterte
  [131.7, 33.5],
  [131.9, 32.7],
  [131.0, 31.1],
  [130.3, 31.2],
  [130.1, 32.4],
  [129.8, 32.8],
];

const HOKKAIDO = [
  [140.2, 41.9],
  [141.8, 42.6],
  [142.9, 42.3], // der Rest der Insel liegt rechts außerhalb des Bildes
  [142.9, 44.5],
  [141.7, 45.4],
  [141.6, 44.4],
  [140.5, 43.3],
  [140.0, 42.6],
];

const TAIWAN = [
  [121.0, 25.3],
  [121.9, 25.1],
  [121.6, 24.0],
  [120.9, 22.5],
  [120.1, 23.6],
  [120.8, 24.8],
];

const HAINAN = [
  [110.6, 20.1],
  [111.0, 19.6],
  [109.5, 18.3],
  [108.7, 19.3],
  [109.3, 19.9],
];

/** Kreta — der Südrand der Ägäis. */
const KRETA = [
  [23.5, 35.5],
  [25.2, 35.4],
  [26.3, 35.3],
  [26.2, 35.0],
  [24.7, 34.9],
  [23.6, 35.2],
];

/** Zypern. */
const ZYPERN = [
  [32.3, 35.1],
  [33.9, 35.4],
  [34.6, 35.7],
  [34.0, 34.9],
  [33.0, 34.6],
];

/** Sizilien, am linken Bildrand. */
const SIZILIEN = [
  [12.4, 37.8],
  [14.0, 38.2],
  [15.2, 38.3],
  [15.6, 38.2],
  [15.1, 37.5],
  [15.3, 37.0],
  [14.5, 36.7],
  [12.6, 37.6],
];

// ---------------------------------------------------------------------------
// Afrika — nur der Nordrand. Ägypten gehört in dieses Kapitel, weil hier der
// mongolische Vormarsch nach Westen endgültig zum Stehen kam.
// ---------------------------------------------------------------------------

const AFRIKA = [
  [32.7, 30.3], // die Landenge von Suez — hier hängen Afrika und Asien zusammen
  [32.3, 31.0],
  [31.6, 31.5], // Damiette im Nildelta
  [29.9, 31.2], // Alexandria
  [28.5, 31.0],
  [27.2, 31.3],
  [25.0, 31.6],
  [23.0, 32.2], // die Kyrenaika
  [20.1, 32.1], // Bengasi
  [19.0, 30.8], // die Große Syrte
  [17.5, 30.9],
  [15.2, 31.2],
  [13.2, 32.9], // Tripolis
  [11.1, 33.5],
  [10.1, 34.3], // Sfax
  [8.0, 36.5], // schon außerhalb des Bildes
  // Rückweg weit außerhalb: um Afrika herum und durch das Rote Meer zurück.
  [0, 30],
  [0, 5],
  [40, 5],
  [43.0, 12.5], // Bab al-Mandab, afrikanische Seite
  [39.5, 15.5], // Massaua
  [37.2, 20.5], // die Küste Nubiens
  [35.5, 23.9],
  [34.0, 27.4],
  [32.6, 29.6], // Suez
];

// ---------------------------------------------------------------------------
// Binnengewässer
// ---------------------------------------------------------------------------

/**
 * Das Kaspische Meer — der größte See der Erde und die wichtigste Landmarke
 * dieser Karte. „Vom Kaspischen Meer bis zum Gelben Meer" ist die kürzeste
 * Beschreibung dessen, was Dschingis Khan hinterließ.
 */
const KASPISCHES_MEER = [
  [48.0, 45.9], // das Wolgadelta
  [47.6, 44.3],
  [47.5, 43.0], // dort, wo heute Machatschkala liegt
  [48.3, 42.1], // Derbent — das „Eiserne Tor" zwischen Meer und Kaukasus
  [49.5, 40.9],
  [49.9, 40.4], // Baku auf der Halbinsel Apscheron
  [49.2, 39.5], // die Mündung des Kura
  [48.9, 38.5],
  [49.5, 37.5], // die Küste von Gilan
  [51.5, 36.9],
  [54.0, 37.0], // die Bucht von Gorgan, die Südostecke
  [53.6, 38.2],
  [53.0, 40.0],
  [52.7, 41.3], // der Kara-Bogas-Gol
  [51.3, 42.7],
  [50.3, 44.3], // die Halbinsel Mangyschlak
  [51.6, 45.4],
  [52.1, 46.4],
  [51.8, 47.0], // die Uralmündung
  [50.0, 46.7],
];

/** Der Aralsee — damals noch groß, das Westende Zentralasiens. */
const ARALSEE = [
  [58.3, 45.0],
  [58.6, 46.0],
  [59.5, 46.6],
  [60.5, 46.3],
  [61.5, 45.3],
  [61.3, 44.5],
  [60.0, 43.8],
  [58.9, 44.3],
];

/** Der Balchaschsee — die Landmarke der Steppe nördlich des Tian Shan. */
const BALCHASCH = [
  [73.6, 46.0],
  [75.0, 46.5],
  [77.0, 46.4],
  [79.0, 46.0],
  [78.5, 45.4],
  [76.5, 45.6],
  [74.5, 45.3],
  [73.4, 45.6],
];

/** Der Baikalsee — an seinem Südufer wuchs Temüdschin auf. */
const BAIKAL = [
  [103.7, 51.5],
  [105.4, 52.4],
  [107.4, 53.4],
  [109.4, 55.3],
  [110.0, 56.0],
  [108.6, 55.0],
  [106.6, 53.0],
  [104.6, 51.9],
];

/**
 * Nordsee und Ostsee als ein Gewässer — der Nordwestzipfel des Bildes.
 * Der westliche Teil liegt außerhalb, deshalb wirkt die Fläche geschlossen.
 * Sie trennt Skandinavien vom Festland und legt die polnische Küste frei,
 * an der 1241 der Vormarsch endete.
 */
const NORDSEE_OSTSEE = [
  [4.0, 58.5], // außerhalb des Bildes, in der Nordsee
  [7.0, 57.8],
  [8.5, 57.7], // Skagen, die Nordspitze Jütlands
  [10.6, 57.6],
  [10.5, 56.6], // das Kattegat
  [10.5, 55.3], // der Große Belt
  [11.8, 54.6],
  [12.5, 54.4],
  [14.3, 54.1], // die Odermündung
  [16.5, 54.6],
  [18.7, 54.5], // die Weichselmündung bei Danzig
  [19.7, 54.4],
  [21.0, 55.3], // die Memelmündung
  [21.1, 56.2],
  [23.9, 57.0], // die Rigaer Bucht
  [24.4, 57.9],
  [23.5, 58.6],
  [24.8, 59.5], // Reval
  [28.0, 59.7],
  [30.3, 59.9], // die Newa — das Ende des Finnischen Meerbusens
  [27.0, 60.4],
  [25.0, 60.2],
  [21.4, 60.6], // die Åland-Inseln
  [19.5, 63.5], // der Bottnische Meerbusen, oberhalb des Bildes
  [17.3, 62.5],
  [17.6, 60.6],
  [18.6, 59.4], // Stockholm
  [16.9, 58.6],
  [16.6, 57.0],
  [14.7, 56.2],
  [12.9, 55.4], // der Öresund
  [12.0, 56.2],
  [11.2, 58.3],
  [8.0, 58.9],
  [4.0, 59.5], // wieder außerhalb des Bildes
];

/**
 * Das Rote Meer, unten aus dem Bild hinauslaufend. Nach Süden reicht es bis
 * Bab al-Mandab — das liegt bei 12° N und damit weit unter dem Bildrand.
 */
const ROTES_MEER = [
  [32.6, 29.7],
  [34.0, 27.4],
  [35.5, 23.9],
  [37.2, 20.5],
  [39.0, 17.0], // schon außerhalb des Bildes
  [41.5, 15.0],
  [42.5, 13.5],
  [43.4, 12.7],
  [42.0, 15.5],
  [39.6, 19.0],
  [38.0, 22.5],
  [36.6, 25.8],
  [35.6, 28.0],
  [35.0, 29.4], // Akaba
  [34.6, 28.4],
  [33.8, 29.3],
];

// ---------------------------------------------------------------------------
// Wüsten — sie erklären, warum die Wege liefen, wie sie liefen
// ---------------------------------------------------------------------------

/** Die Wüste Gobi: die Südgrenze der Steppe, Heimat der Reitervölker. */
const GOBI = [
  [97.5, 41.8],
  [100.5, 41.8],
  [104.0, 41.5],
  [108.0, 41.3],
  [113.0, 41.8],
  [116.0, 43.2],
  [114.0, 44.0],
  [110.0, 44.8],
  [106.0, 44.5],
  [102.0, 43.5],
  [98.0, 42.5],
];

/** Die Taklamakan im Tarimbecken: umgangen, nie durchquert. */
const TAKLAMAKAN = [
  [77.5, 39.0],
  [80.0, 40.3],
  [83.5, 41.0],
  [86.5, 40.7],
  [88.5, 39.8],
  [87.0, 38.8],
  [84.0, 37.8],
  [81.0, 37.0],
  [78.5, 37.6],
  [76.8, 38.4],
];

/** Die Wüste Karakum zwischen Kaspischem Meer und Amudarja. */
const KARAKUM = [
  [55.0, 39.5],
  [58.0, 40.5],
  [61.0, 41.5],
  [63.0, 40.0],
  [61.5, 38.5],
  [58.5, 37.8],
  [56.0, 38.3],
];

// ---------------------------------------------------------------------------
// Flüsse — sie ordnen die Landschaft und tragen die Geschichte
// ---------------------------------------------------------------------------

/** Die Wolga: an ihrem Unterlauf stand Sarai, die Hauptstadt der Horde. */
const WOLGA = [
  [32.5, 57.2], // die Quelle im Waldaihöhenzug
  [35.9, 56.9], // Twer
  [38.8, 58.0],
  [40.0, 57.6],
  [44.0, 56.3], // Nischni Nowgorod
  [47.5, 56.0],
  [49.1, 55.8], // Kasan, die Stadt der Wolgabulgaren
  [50.3, 54.0],
  [49.5, 52.0],
  [47.0, 50.0],
  [45.0, 48.8], // die große Wolgaknie
  [46.5, 47.5],
  [48.0, 46.3], // das Wolgadelta
];

/** Der Don, mit seiner großen Schleife dicht an die Wolga heran. */
const DON = [
  [38.3, 54.1],
  [39.2, 51.7], // Woronesch
  [40.5, 50.0],
  [43.0, 49.5],
  [43.7, 48.6], // hier kommen sich Don und Wolga bis auf 60 Kilometer nahe
  [42.0, 47.9],
  [40.3, 47.6],
  [39.3, 47.1], // die Mündung ins Asowsche Meer
];

/** Der Dnepr — an ihm lag Kiew, das 1240 fiel. */
const DNEPR = [
  [32.0, 55.0],
  [31.0, 53.0],
  [30.5, 51.5],
  [30.5, 50.4], // Kiew
  [32.0, 49.4],
  [34.6, 48.5],
  [35.1, 47.8],
  [33.5, 47.1],
  [32.3, 46.6],
];

/** Die Donau — Ungarn, und die Grenze, an der 1242 alles endete. */
const DONAU = [
  [8.5, 48.0], // die Quelle liegt links außerhalb des Bildes
  [10.9, 48.7],
  [13.4, 48.7], // Passau
  [16.4, 48.2], // Wien
  [18.8, 47.8],
  [19.0, 46.5],
  [19.5, 45.3],
  [20.5, 44.9], // Belgrad
  [22.6, 44.6], // das Eiserne Tor
  [25.0, 43.7],
  [27.5, 44.1],
  [28.8, 45.2],
  [29.7, 45.2], // das Donaudelta
];

/** Die Weichsel — Krakau, Warschau, und die Mündung bei Danzig. */
const WEICHSEL = [
  [19.0, 49.6],
  [19.9, 50.1], // Krakau, 1241 geplündert
  [21.8, 51.4],
  [21.0, 52.2],
  [18.9, 52.8],
  [18.6, 53.1], // Thorn
  [18.9, 54.0],
  [18.8, 54.4], // die Mündung bei Danzig
];

/** Der Euphrat. */
const EUPHRAT = [
  [39.5, 39.5],
  [38.6, 38.3],
  [38.0, 37.0],
  [38.9, 36.2],
  [40.1, 35.3],
  [42.0, 34.0],
  [43.5, 33.0],
  [44.4, 32.5], // Hilla, nahe dem alten Babylon
  [46.1, 31.5],
  [47.4, 31.0], // hier vereinigen sich Euphrat und Tigris
  [48.5, 30.0],
];

/** Der Tigris — an ihm liegt Bagdad. */
const TIGRIS = [
  [40.2, 38.3],
  [40.2, 37.9], // Amida, das heutige Diyarbakir
  [42.0, 37.3],
  [43.1, 36.3], // Mosul, gegenüber dem alten Ninive
  [43.9, 34.6],
  [44.4, 33.3], // Bagdad
  [45.8, 32.5],
  [47.4, 31.0],
];

/** Der Amudarja — der Oxus der Antike, Grenzfluss Zentralasiens. */
const AMUDARJA = [
  [71.5, 37.2],
  [68.0, 37.2],
  [65.5, 38.5],
  [63.0, 40.0],
  [61.5, 42.5],
  [59.5, 44.3],
];

/** Der Syrdarja — an ihm lagen Otrar und Buchara-nahe Städte. */
const SYRDARJA = [
  [70.5, 40.5],
  [68.5, 40.8],
  [68.3, 42.9], // Otrar, wo 1218 die Karawane hingerichtet wurde
  [66.5, 43.5],
  [63.5, 44.5],
  [61.0, 45.4],
];

/** Der Irtysch — der Weg in die sibirische Weite. */
const IRTYSCH = [
  [88.0, 46.5],
  [85.0, 47.7],
  [83.0, 48.5],
  [80.3, 50.4],
  [76.9, 52.3],
  [73.4, 55.0], // dort, wo heute Omsk liegt
  [70.5, 57.0],
  [68.3, 58.5], // Tobolsk, schon über dem Bildrand
];

/** Der Gelbe Fluss mit der großen Ordos-Schleife. */
const GELBER_FLUSS = [
  [96.5, 34.9],
  [100.5, 34.5],
  [103.8, 36.1], // Lanzhou
  [105.5, 37.5],
  [106.3, 38.6],
  [107.5, 40.3],
  [110.0, 40.6], // der Nordbogen der Ordos-Schleife
  [111.2, 39.5],
  [110.4, 36.0],
  [110.3, 34.7], // hier knickt der Fluss nach Osten
  [112.5, 34.8], // Luoyang
  [114.5, 34.8],
  [116.5, 35.5],
  [118.0, 37.0],
  [118.9, 37.9],
];

/** Der Jangtse — die Linie, an der sich die Song fünfzig Jahre hielten. */
const JANGTSE = [
  [92.0, 33.5],
  [96.5, 32.0],
  [99.5, 28.0],
  [100.2, 26.8],
  [103.0, 28.5],
  [106.5, 29.6], // Chongqing
  [109.0, 30.8], // die drei Schluchten
  [111.3, 30.7],
  [114.3, 30.6], // Wuhan
  [116.5, 30.0],
  [119.0, 32.0], // Nanjing
  [121.9, 31.4],
];

const INDUS = [
  [74.5, 34.5],
  [72.5, 32.0],
  [71.0, 30.0],
  [70.5, 28.0],
  [68.5, 26.0],
  [67.4, 24.2],
];

const GANGES = [
  [78.0, 30.0],
  [81.0, 26.0],
  [84.0, 25.5],
  [87.0, 25.0],
  [89.2, 22.2],
];

// ---------------------------------------------------------------------------
// Die Landmasse
// ---------------------------------------------------------------------------

/**
 * Eurasien als ein einziger Umriss — vom Mittelmeer bis ans Japanische Meer.
 * Die Randpunkte liegen bewusst außerhalb des Ausschnitts, damit das Land
 * über den Bildrand hinausläuft, statt dort abzuknicken.
 *
 * Genau diese Zusammenhängendkeit ist das Thema des Kapitels: Von Liegnitz
 * bis Dadu kann man reiten, ohne ein Schiff zu besteigen. Es hat nur nie
 * jemand versucht — bis die Mongolen es zur Verwaltungsaufgabe machten.
 */
const EURASIEN = verbinde(
  ITALIEN_WEST,
  ITALIEN_OST,
  DALMATIEN,
  GRIECHENLAND,
  MARMARA_NORD,
  SCHWARZMEER_WEST,
  ASOW_KAUKASUS,
  ANATOLIEN_NORD,
  MARMARA_SUED,
  AEGAEIS_OST,
  ANATOLIEN_SUED,
  LEVANTE,
  ARABIEN_WEST,
  ARABIEN_SUED,
  GOLF_ARABIEN,
  GOLF_PERSIEN,
  MAKRAN,
  INDIEN_WEST,
  INDIEN_OST,
  HINTERINDIEN,
  KUESTE_LINGNAN,
  KUESTE_SUEDOST,
  KUESTE_SHANDONG,
  KUESTE_LIAODONG,
  KOREA,
  KUESTE_NORDOST,
  // Rückweg weit außerhalb des Bildes: über Sibirien nach Westen und durch
  // Frankreich zurück ans Mittelmeer.
  [
    [150, 72],
    [0, 72],
    [0, 44],
  ],
);

// ---------------------------------------------------------------------------
// Zwei Linien, die älter sind als jede Phase
// ---------------------------------------------------------------------------

/**
 * Die Große Mauer in ihrem Verlauf vor der Mongolenzeit.
 *
 * Sie steht hier aus einem Grund, der nichts mit Erfolg zu tun hat: Sie war
 * gebaut worden, um genau das zu verhindern, was in diesem Kapitel passiert.
 */
const GROSSE_MAUER = [
  [119.8, 40.0], // Shanhaiguan, wo die Mauer ins Meer läuft
  [117.8, 40.6],
  [116.0, 40.5], // nördlich von Dadu
  [113.5, 41.2],
  [111.2, 41.4],
  [109.0, 41.0],
  [107.0, 39.8],
  [105.2, 38.6],
  [103.5, 37.6],
  [101.5, 38.6],
  [99.5, 39.7], // der Hexi-Korridor
  [97.5, 40.2],
  [95.5, 40.3],
  [93.9, 40.4], // das Jadetor westlich von Dunhuang
];

/**
 * Der Weg von Dadu bis ans Schwarze Meer — die Seidenstraße unter der
 * Pax Mongolica. Zum ersten und einzigen Mal in der Geschichte lag diese
 * ganze Linie innerhalb eines einzigen Reiches.
 */
const SEIDENSTRASSE = [
  [116.4, 39.9], // Dadu
  [111.5, 39.5],
  [107.5, 38.0],
  [103.8, 36.1], // Lanzhou, der Übergang über den Gelben Fluss
  [100.5, 38.9],
  [96.5, 40.1],
  [94.7, 40.1], // Dunhuang
  [91.5, 39.9],
  [88.5, 39.5],
  [85.5, 38.1],
  [79.9, 37.1], // Khotan
  [77.2, 38.4],
  [75.9, 39.5], // Kaschgar
  [73.5, 39.6], // über das Dach der Welt, den Pamir
  [70.0, 40.2],
  [66.9, 39.6], // Samarkand
  [64.4, 39.8], // Buchara
  [62.2, 37.7], // Merw
  [58.3, 37.3],
  [54.0, 36.5],
  [51.4, 35.7], // Rai, nahe dem heutigen Teheran
  [48.5, 36.5],
  [46.3, 38.1], // Täbris, die Hauptstadt des Ilchanats
  [43.0, 39.8],
  [39.7, 41.0], // Trapezunt am Schwarzen Meer
];

// ---------------------------------------------------------------------------
// Die Phasen — dieselbe Karte, vier Zeitpunkte
// ---------------------------------------------------------------------------

/**
 * 1206: das Gebiet, das die Stämme auf dem Kurultai zusammenbringen.
 *
 * Es ist der kleinste Fleck, den eine Phase in dieser App je gezeigt hat.
 * Von hier aus dauert es einundzwanzig Jahre bis zur nächsten Karte.
 */
const MONGOLEI_1206 = [
  [88.5, 48.5],
  [91.0, 49.8],
  [94.5, 50.5],
  [98.0, 51.2],
  [101.5, 51.5],
  [104.5, 51.8],
  [108.0, 51.0],
  [112.0, 50.0],
  [115.5, 48.8],
  [118.5, 47.5],
  [119.5, 45.8],
  [116.0, 44.8],
  [112.0, 43.8],
  [108.0, 42.8],
  [104.0, 42.3],
  [100.0, 42.8],
  [96.0, 43.5],
  [92.5, 45.0],
  [89.5, 46.5],
];

/**
 * 1227, im Todesjahr Dschingis Khans: vom Kaspischen Meer bis ans Gelbe Meer.
 *
 * Im Norden Chinas endet das Reich am Gelben Fluss — der Süden, das Reich der
 * Song, bleibt noch über fünfzig Jahre unabhängig. Im Westen reicht es bis an
 * das Kaspische Meer: Das Choresm-Reich, 1219 noch eine Großmacht, gibt es
 * nicht mehr.
 */
const REICH_1227 = [
  [51.5, 45.0],
  [53.0, 48.0],
  [56.0, 50.5],
  [60.0, 52.0],
  [65.0, 53.0],
  [71.0, 53.5],
  [78.0, 53.0],
  [85.0, 52.5],
  [92.0, 52.0],
  [98.0, 51.5],
  [104.0, 51.8],
  [110.0, 50.5],
  [116.0, 48.5],
  [120.0, 46.5],
  [123.0, 44.5],
  [124.0, 42.0],
  [122.5, 40.8],
  [119.6, 39.9], // Shanhaiguan
  [118.0, 39.2],
  [117.0, 38.5],
  [115.5, 37.5],
  [113.5, 36.2],
  [111.0, 35.2],
  [108.5, 34.6], // der Gelbe Fluss als Grenze gegen die Song
  [105.5, 35.5],
  [103.5, 36.2],
  [101.0, 37.8],
  [98.0, 39.5],
  [94.0, 40.5],
  [90.0, 42.0],
  [85.0, 42.5],
  [80.0, 42.0],
  [76.0, 40.0], // Kaschgar
  [72.0, 38.0],
  [68.0, 37.0],
  [64.0, 37.5],
  [60.0, 38.0],
  [56.5, 38.5],
  [54.0, 37.5], // die Südostecke des Kaspischen Meeres
  [53.5, 39.5],
  [53.0, 41.0],
  [52.0, 43.0],
  [50.3, 44.3], // die Halbinsel Mangyschlak
];

/**
 * 1259: das Großkhanat — Zentralasien, Nordchina, die Mandschurei, Tibet und
 * Yunnan. Die Südgrenze folgt dem Huai; dahinter halten sich die Song.
 */
const GROSSKHANAT_1259 = [
  [124.0, 49.0],
  [128.0, 47.0],
  [131.0, 43.5],
  [130.0, 42.8],
  [128.0, 42.0],
  [126.0, 41.5],
  [124.4, 40.0], // die Yalu-Mündung
  [122.5, 40.9],
  [121.6, 38.9],
  [119.6, 39.9],
  [117.7, 38.9],
  [118.9, 37.9],
  [120.4, 36.1],
  [119.8, 34.8],
  [120.4, 34.0],
  [119.5, 33.2], // die Huai-Linie gegen die Song
  [116.5, 32.8],
  [113.0, 32.5],
  [109.5, 32.8],
  [106.5, 32.2],
  [104.5, 31.3],
  [103.0, 30.5],
  [101.5, 28.0],
  [100.2, 26.0],
  [99.5, 25.2], // Dali in Yunnan, 1253 erobert
  [98.0, 25.8],
  [97.0, 28.0],
  [94.0, 29.0],
  [90.0, 29.5], // Tibet, das sich 1253 unterwirft
  [86.0, 29.5],
  [82.0, 30.5],
  [79.0, 32.5],
  [76.5, 35.5],
  [73.5, 37.0],
  [70.0, 37.5],
  [66.5, 37.0],
  [63.0, 38.5],
  [60.5, 41.0],
  [59.5, 44.0],
  [61.5, 46.5],
  [64.0, 49.0],
  [68.0, 51.0],
  [73.0, 53.0],
  [79.0, 54.0],
  [86.0, 54.0],
  [93.0, 53.5],
  [100.0, 52.5],
  [107.0, 52.0],
  [113.0, 51.0],
  [118.0, 50.0],
];

/**
 * Die Goldene Horde: die Steppe nördlich des Schwarzen Meeres, die Krim, die
 * Wolga — und darüber hinaus die russischen Fürstentümer als Tributzahler.
 *
 * Ihre Westgrenze sind die Karpaten. Sie steht so in beiden späten Phasen:
 * Zwischen 1259 und 1294 hat sich hier fast nichts verschoben.
 */
const GOLDENE_HORDE = [
  [26.0, 48.2], // die Karpaten — hier endete 1241 der Vormarsch
  [27.5, 50.5],
  [29.0, 52.5],
  [30.5, 55.0],
  [31.3, 58.3], // Nowgorod, am oberen Bildrand
  [38.0, 58.5],
  [45.0, 58.3],
  [52.0, 57.5],
  [58.0, 56.0],
  [64.0, 54.5],
  [70.0, 52.5],
  [68.0, 51.0],
  [64.0, 49.0],
  [61.5, 46.5],
  [59.5, 44.0],
  [57.0, 44.5],
  [54.0, 45.0],
  [51.6, 45.4], // das Ostufer des Kaspischen Meeres
  [51.8, 47.0],
  [50.0, 46.7],
  [48.0, 45.9], // das Wolgadelta — hier stand Sarai
  [47.6, 44.3],
  [47.5, 43.0],
  [48.3, 42.1], // Derbent, die Grenze zum Ilchanat
  [46.5, 42.8],
  [44.5, 43.2],
  [42.5, 43.5],
  [40.0, 43.3],
  [37.8, 44.7],
  [36.6, 45.4],
  [35.4, 45.0], // Kaffa auf der Krim
  [33.5, 44.6],
  [33.4, 45.2],
  [32.3, 46.6],
  [30.7, 46.5],
  [29.7, 45.2], // das Donaudelta
  [28.5, 46.5],
  [27.0, 47.5],
];

/**
 * Das Ilchanat: Persien, Mesopotamien, der Kaukasus und Kleinasien.
 *
 * Die Westgrenze ist der Euphrat — dahinter beginnt das Reich der Mamluken,
 * das die Mongolen 1260 bei Ain Dschalut zum Stehen bringt.
 */
const ILCHANAT = [
  [48.3, 42.1], // Derbent
  [46.5, 41.5],
  [44.5, 41.0],
  [43.0, 41.5],
  [41.6, 41.6], // Batumi am Schwarzen Meer
  [39.7, 41.0],
  [37.0, 41.2],
  [35.2, 42.0],
  [33.0, 41.8],
  [31.5, 41.0],
  [30.5, 39.5], // die Westgrenze des Sultanats von Rum
  [30.0, 37.5],
  [30.6, 36.8],
  [32.5, 36.2],
  [34.6, 36.8], // Mersin
  [36.2, 36.6],
  [37.5, 36.8],
  [38.5, 36.0], // der Euphrat als Grenze gegen die Mamluken
  [40.5, 35.0],
  [42.5, 33.5],
  [43.5, 32.0],
  [45.5, 31.0],
  [47.4, 31.0],
  [48.5, 30.0],
  [50.8, 28.9],
  [53.0, 27.5],
  [56.9, 27.2], // Bandar Abbas
  [58.5, 26.5],
  [61.0, 27.0],
  [62.5, 29.0],
  [64.0, 31.5],
  [65.5, 34.0],
  [66.0, 36.5], // der Amudarja als Nordgrenze
  [63.0, 37.5],
  [60.0, 37.5],
  [57.0, 38.0],
  [54.0, 37.2], // die Südostecke des Kaspischen Meeres
  [51.5, 36.8],
  [49.5, 37.4],
  [48.9, 38.5],
  [49.3, 39.4],
  [49.9, 40.4], // Baku
  [49.0, 41.0],
];

/** Korea: 1259 als Vasall, danach durch Heirat mit dem Khanshaus verbunden. */
const KOREA_VASALL = [
  [124.4, 40.0],
  [125.4, 39.6],
  [126.0, 38.3],
  [126.6, 37.5],
  [126.3, 34.4],
  [129.1, 35.1],
  [129.3, 36.8],
  [128.4, 38.4],
  [127.5, 39.3],
  [129.4, 40.8],
  [128.0, 41.6],
  [126.0, 41.3],
];

/**
 * 1294, im Todesjahr Kublai Khans: das Reich der Yuan.
 *
 * Jetzt gehört ganz China dazu — bis Hainan, bis an die Grenze zu Dai Viet.
 * Die Hauptstadt ist Dadu, nicht mehr Karakorum: Der Schwerpunkt des Reiches
 * ist von der Steppe in die Ackerbauwelt gewandert.
 */
const YUAN_1294 = [
  [124.0, 49.0],
  [128.0, 47.0],
  [131.0, 43.5],
  [130.0, 42.8],
  [128.0, 42.0],
  [126.0, 41.5],
  [124.4, 40.0],
  [122.5, 40.9],
  [121.6, 38.9],
  [119.6, 39.9],
  [117.7, 38.9],
  [118.9, 37.9],
  [120.4, 36.1],
  [119.8, 34.8],
  [121.9, 31.4], // die Jangtse-Mündung — seit 1279 mongolisch
  [121.6, 29.1],
  [119.7, 26.1],
  [117.6, 23.9],
  [113.6, 22.4], // die Perlflussmündung
  [110.4, 20.4],
  [108.1, 21.5],
  [106.5, 21.8], // die Grenze zu Dai Viet
  [104.0, 23.0],
  [101.0, 24.0],
  [99.0, 25.5],
  [97.5, 27.5],
  [95.0, 28.5],
  [91.0, 28.5],
  [86.0, 28.8], // Tibet gehört zum Reich
  [82.0, 30.0],
  [79.0, 32.0],
  [82.0, 34.5],
  [85.0, 36.5],
  [87.0, 40.0],
  [88.0, 43.0], // die Grenze zum Tschagatai-Khanat
  [89.0, 46.5],
  [92.0, 49.0],
  [96.0, 51.0],
  [101.0, 52.0],
  [107.0, 52.0],
  [113.0, 51.0],
  [118.0, 50.0],
];

/** Das Tschagatai-Khanat: Transoxanien, das Siebenstromland, das Tarimbecken. */
const TSCHAGATAI = [
  [88.0, 43.0],
  [86.0, 46.0],
  [82.0, 47.0],
  [78.0, 47.0],
  [73.0, 45.5],
  [68.0, 44.5],
  [63.0, 44.5],
  [60.5, 42.0],
  [61.0, 39.5],
  [63.5, 38.0],
  [66.5, 37.0],
  [70.0, 37.5],
  [73.5, 37.0],
  [76.5, 36.0],
  [80.0, 35.5],
  [84.0, 36.5],
  [87.0, 40.0],
];

// ---------------------------------------------------------------------------
// Zusammenbau
// ---------------------------------------------------------------------------

/** Eine Landfläche im Grundgerüst der Karte. */
const land = (orte) => ({
  art: 'land',
  d: geo.pfad(orte),
  fill: KARTENFARBEN.land,
  stroke: KARTENFARBEN.landRand,
  strokeWidth: 1.2,
});

/** Ein Binnengewässer, das über die Landmasse gelegt wird. */
const wasser = (orte) => ({
  art: 'wasser',
  d: geo.pfad(orte),
  fill: KARTENFARBEN.meer,
  stroke: KARTENFARBEN.landRand,
  strokeWidth: 1,
});

/** Eine Wüstenfläche — Untergrund, kein Gebiet. */
const wueste = (orte) => ({
  art: 'wueste',
  d: geo.pfad(orte),
  fill: KARTENFARBEN.wueste,
  stroke: 'none',
  strokeWidth: 0,
});

/** Ein Fluss — nur Linie, keine Fläche. */
const fluss = (orte) => ({
  art: 'fluss',
  d: geo.pfad(orte, { geschlossen: false }),
  fill: 'none',
  stroke: KARTENFARBEN.fluss,
  strokeWidth: 1.8,
});

/** Eine Gebietsfläche einer Phase. */
const gebiet = (titel, orte) => ({ titel, d: geo.pfad(orte) });

const karte = {
  breite: geo.breite,
  hoehe: geo.hoehe,

  basis: [
    // Das Meer ist der Untergrund; alles Land liegt darüber.
    {
      art: 'grund',
      d: `M 0 0 H ${geo.breite} V ${geo.hoehe} H 0 Z`,
      fill: KARTENFARBEN.meer,
      stroke: 'none',
      strokeWidth: 0,
    },
    land(EURASIEN),
    land(AFRIKA),
    land(HONSHU),
    land(SHIKOKU),
    land(KYUSHU),
    land(HOKKAIDO),
    land(TAIWAN),
    land(HAINAN),
    land(KRETA),
    land(ZYPERN),
    land(SIZILIEN),
    wasser(KASPISCHES_MEER),
    wasser(ARALSEE),
    wasser(BALCHASCH),
    wasser(BAIKAL),
    wasser(NORDSEE_OSTSEE),
    wasser(ROTES_MEER),
    wueste(GOBI),
    wueste(TAKLAMAKAN),
    wueste(KARAKUM),
    fluss(WOLGA),
    fluss(DON),
    fluss(DNEPR),
    fluss(DONAU),
    fluss(WEICHSEL),
    fluss(EUPHRAT),
    fluss(TIGRIS),
    fluss(AMUDARJA),
    fluss(SYRDARJA),
    fluss(IRTYSCH),
    fluss(GELBER_FLUSS),
    fluss(JANGTSE),
    fluss(INDUS),
    fluss(GANGES),
    // Die Große Mauer und die Seidenstraße gehören zum festen Untergrund:
    // Beide sind älter als jede Phase dieser Karte.
    {
      art: 'mauer',
      d: geo.pfad(GROSSE_MAUER, { geschlossen: false }),
      fill: 'none',
      stroke: KARTENFARBEN.mauer,
      strokeWidth: 3,
    },
    {
      art: 'route',
      d: geo.pfad(SEIDENSTRASSE, { geschlossen: false }),
      fill: 'none',
      stroke: KARTENFARBEN.route,
      strokeWidth: 2.4,
    },
  ],

  phasen: [
    {
      id: 'kurultai-1206',
      label: '1206',
      hinweis:
        'Auf dem Kurultai an der Quelle des Onon rufen die versammelten Stämme Temüdschin zum Dschingis Khan aus. Was er regiert, ist kein Reich, sondern ein Bündnis: vielleicht eine Million Menschen, mehr Pferde als Menschen, keine einzige Stadt. Schau dir diesen Fleck genau an — die nächste Karte ist einundzwanzig Jahre später.',
      flaechen: [gebiet('Die geeinten Stämme der Steppe', MONGOLEI_1206)],
    },
    {
      id: 'tod-1227',
      label: '1227',
      hinweis:
        'Im Todesjahr Dschingis Khans reicht das Reich vom Kaspischen Meer bis ans Gelbe Meer. Das Choresm-Reich, 1219 noch eine Großmacht mit Samarkand und Buchara, ist verschwunden. In China endet der Vormarsch am Gelben Fluss: Der Süden gehört noch den Song — und wird es fünfzig Jahre bleiben.',
      flaechen: [gebiet('Das Reich beim Tod Dschingis Khans', REICH_1227)],
    },
    {
      id: 'hoehepunkt-1259',
      label: '1259',
      hinweis:
        'Der größte Umfang: von Korea bis an die Karpaten, von Sibirien bis an den Persischen Golf. Rund vierundzwanzig Millionen Quadratkilometer, ein Fünftel des Landes der Erde — noch nie hat ein Reich so viel zusammengehalten, und danach nie wieder. Vier Farbflecken, ein Reich: Noch gilt ein Großkhan für alle.',
      flaechen: [
        gebiet('Das Großkhanat', GROSSKHANAT_1259),
        gebiet('Die Goldene Horde', GOLDENE_HORDE),
        gebiet('Das Ilchanat', ILCHANAT),
        gebiet('Korea als Vasall', KOREA_VASALL),
      ],
    },
    {
      id: 'yuan-1294',
      label: '1294',
      hinweis:
        'Beim Tod Kublai Khans ist das Reich noch riesig — aber es ist keines mehr. Vier Teilreiche gehen eigene Wege, führen eigene Kriege, nehmen eigene Religionen an. In China regiert Kublai als Kaiser einer chinesischen Dynastie, der Yuan, von Dadu aus — dem heutigen Peking. Die Steppe ist Provinz geworden.',
      flaechen: [
        gebiet('Das Reich der Yuan', YUAN_1294),
        gebiet('Das Tschagatai-Khanat', TSCHAGATAI),
        gebiet('Die Goldene Horde', GOLDENE_HORDE),
        gebiet('Das Ilchanat', ILCHANAT),
        gebiet('Korea', KOREA_VASALL),
      ],
    },
  ],

  punkte: [
    {
      id: 'karakorum',
      name: 'Karakorum',
      typ: 'stadt',
      ...xy(102.83, 47.42),
      text: [
        'Die erste Hauptstadt eines Reiches, das Städte eigentlich nicht brauchte.',
        'Ögödei ließ sie ab 1235 bauen — eine Mauer, ein Palast, Werkstätten,',
        'Handwerker aus aller Herren Länder. Wilhelm von Rubruk, der 1254 hier war,',
        'fand sie enttäuschend klein: kleiner als ein Vorort von Paris, schrieb er.',
        'Dafür sah er etwas, das er nirgends sonst kannte: zwölf Tempel',
        'verschiedener Religionen, zwei Moscheen und eine christliche Kirche in',
        'einer Stadt. Und einen silbernen Baum, aus dessen Ästen auf Knopfdruck',
        'Wein, Stutenmilch, Met und Reisbier flossen — gebaut von einem',
        'französischen Goldschmied, den die Mongolen in Ungarn erbeutet hatten.',
        'Als Kublai später Dadu zur Hauptstadt machte, verlor Karakorum alles.',
        'Heute stehen dort ein Kloster und eine Steinschildkröte.',
      ].join(' '),
    },
    {
      id: 'dadu',
      name: 'Dadu',
      typ: 'stadt',
      ...xy(116.4, 39.9),
      text: [
        'Das heutige Peking. Kublai Khan ließ die Stadt ab 1267 neu bauen und',
        'machte sie zur Hauptstadt seiner chinesischen Dynastie, der Yuan — ein',
        'Schachbrett aus geraden Straßen, mit einem See mitten in der Anlage. Die',
        'Mongolen nannten sie Chanbaliq, „Stadt des Khans"; daraus machte Europa',
        'das Wort Cambaluc. Genau hier endete die Reise, mit der Marco Polo',
        'berühmt wurde: 1275 kam er an, blieb rund siebzehn Jahre und beschrieb',
        'danach Dinge, die zu Hause niemand glaubte — Geld aus Papier, Steine, die',
        'brennen, eine Post mit Wechselstationen. Für die Mongolen war der Umzug',
        'hierher eine Entscheidung: Wer von Dadu aus regiert, regiert ein',
        'Ackerbauland und nicht mehr die Steppe. Kublais Vettern im Westen haben',
        'ihm das nie verziehen.',
      ].join(' '),
    },
    {
      id: 'samarkand',
      name: 'Samarkand',
      typ: 'stadt',
      ...xy(66.97, 39.65),
      text: [
        'Eine der reichsten Städte der Welt — und der Ort, an dem der Krieg nach',
        'Westen begann. 1218 schickte Dschingis Khan eine Handelskarawane ins',
        'Choresm-Reich; in Otrar am Syrdarja ließ ein Statthalter die Kaufleute',
        'als Spione hinrichten. Die Gesandten, die daraufhin Genugtuung',
        'verlangten, kamen geschoren oder gar nicht zurück. Zwei Jahre später war',
        'Samarkand erobert, Buchara niedergebrannt, das Choresm-Reich Geschichte.',
        'Was das kostete, ist bis heute umstritten — die Zahlen der Chronisten',
        'sind riesig und niemand hat sie geprüft. Sicher ist: Die',
        'Bewässerungsanlagen dieser Landschaft, über Jahrhunderte angelegt,',
        'erholten sich nie ganz. Und ebenso sicher: Wenig später zogen wieder',
        'Karawanen durch Samarkand, geschützt von denselben Mongolen.',
      ].join(' '),
    },
    {
      id: 'bagdad',
      name: 'Bagdad',
      typ: 'ereignis',
      ...xy(44.4, 33.3),
      text: [
        '1258 nahm Hülegü, ein Enkel Dschingis Khans, die Stadt ein und ließ den',
        'letzten Kalifen der Abbasiden töten — nach fünfhundert Jahren endete',
        'damit das Kalifat, das geistige Zentrum der islamischen Welt. Bagdad',
        'besaß das „Haus der Weisheit", die größte Bibliothek ihrer Zeit; die',
        'Überlieferung sagt, der Tigris habe sich von der Tinte der',
        'hineingeworfenen Bücher schwarz gefärbt. Solche Sätze sind Erzählung,',
        'nicht Protokoll — aber die Bibliothek war weg. Zwei Jahre später kam der',
        'Vormarsch nach Westen zum Stehen: 1260 schlug ein Heer der Mamluken aus',
        'Ägypten die Mongolen bei Ain Dschalut in Palästina. Es war die erste',
        'Niederlage, von der sich die Mongolen nicht mehr erholten — der Euphrat',
        'blieb die Grenze.',
      ].join(' '),
    },
    {
      id: 'liegnitz',
      name: 'Liegnitz',
      typ: 'ereignis',
      ...xy(16.16, 51.21),
      text: [
        'Am 9. April 1241 traf hier ein Heer aus schlesischen Rittern, Bergleuten',
        'und Ordensbrüdern auf eine mongolische Armee, von der niemand wusste,',
        'woher sie kam. Herzog Heinrich II. fiel; sein Kopf wurde auf einer Lanze',
        'vor die Stadtmauern getragen. Der Ort heißt seither Wahlstatt, nach dem',
        'alten Wort für Schlachtfeld. Zwei Tage später erging es dem ungarischen',
        'Heer bei Mohi genauso — zwei Niederlagen, zweihundert Kilometer',
        'auseinander, koordiniert über Entfernungen, für die europäische Boten',
        'Wochen gebraucht hätten. Und dann, im Frühjahr 1242, drehten die Mongolen',
        'um. Sie kamen nie zurück. Warum, weiß bis heute niemand sicher; die',
        'bekannteste Erklärung ist der Tod des Großkhans Ögödei, sechstausend',
        'Kilometer entfernt.',
      ].join(' '),
    },
    {
      id: 'kaffa',
      name: 'Kaffa',
      typ: 'ereignis',
      ...xy(35.38, 45.03),
      text: [
        'Der genuesische Hafen auf der Krim, das westliche Ende der Karawanenwege:',
        'Wer Seide aus Dadu kaufte, holte sie hier ab. 1346 belagerte ein Heer der',
        'Goldenen Horde die Stadt — und im Lager brach eine Seuche aus. Die',
        'Chronik eines Notars aus Piacenza berichtet, die Belagerer hätten ihre',
        'Toten über die Mauern geschleudert; die Genuesen flohen mit ihren',
        'Schiffen nach Italien. Ob es wirklich so war, ist umstritten — Ratten und',
        'Flöhe brauchten keine Katapulte, sie fuhren in der Fracht mit. Sicher',
        'ist: Über dieselben offenen Wege, die den Handel so leicht machten, kam',
        'der Schwarze Tod nach Europa und kostete vielleicht ein Drittel aller',
        'Menschen. Die Pax Mongolica hatte eine Rechnung, die erst hundert Jahre',
        'später präsentiert wurde.',
      ].join(' '),
    },
  ],

  bewegungen: [
    {
      id: 'westfeldzug-1219',
      name: 'Der erste Westfeldzug (1219–1223)',
      ...(([von, nach]) => ({ von, nach }))([p(107.0, 47.5), p(62.2, 37.7)]),
      ueber: [p(95.0, 45.5), p(85.0, 44.5), p(76.0, 40.5), p(67.0, 39.6)],
      text: [
        'Dschingis Khan war fast sechzig, als er nach Westen zog — nicht aus Plan,',
        'sondern aus Vergeltung: Das Choresm-Reich hatte seine Kaufleute und seine',
        'Gesandten getötet. In vier Jahren war es verschwunden. Unterwegs lernten',
        'die Mongolen das, was ihnen zuvor gefehlt hatte: Belagerungstechnik. Sie',
        'zwangen chinesische und persische Ingenieure in ihre Dienste, bauten',
        'Wurfmaschinen, leiteten Flüsse um. Eine Vorhut unter Dschebe und Subutai',
        'ritt weiter, umrundete das Kaspische Meer, schlug 1223 an der Kalka ein',
        'Heer russischer Fürsten — und verschwand wieder. In Europa wusste danach',
        'niemand, wer das gewesen war.',
      ].join(' '),
    },
    {
      id: 'batu-1241',
      name: 'Batus Westexpedition (1236–1242)',
      ...(([von, nach]) => ({ von, nach }))([p(65.0, 53.0), p(16.3, 51.2)]),
      ueber: [p(55.0, 54.0), p(45.0, 54.5), p(35.0, 53.0), p(30.5, 50.4), p(22.0, 50.5)],
      text: [
        'Diesmal war es kein Streifzug, sondern ein Feldzug mit Beschluss: Der',
        'Kurultai schickte Batu, einen Enkel Dschingis Khans, nach Westen. Zuerst',
        'fielen die Wolgabulgaren, dann die Rus — Rjasan, Wladimir, 1240 Kiew.',
        'Danach teilte sich das Heer, und genau das erschreckte Europa am meisten:',
        'Ein Teil zog nach Polen und schlug am 9. April 1241 bei Liegnitz, der',
        'andere zwei Tage später bei Mohi in Ungarn. Im Frühjahr 1242 standen',
        'mongolische Reiter an der Donau, in Sichtweite von Wien — und zogen ab.',
        'Für Mitteleuropa war es damit vorbei. Für die russischen Fürsten begann',
        'es gerade erst: Rund 240 Jahre zahlten sie Tribut an die Goldene Horde.',
      ].join(' '),
    },
    {
      id: 'huelegue-1258',
      name: 'Hülegü nach Bagdad (1256–1258)',
      ...(([von, nach]) => ({ von, nach }))([p(66.0, 37.5), p(44.4, 33.3)]),
      ueber: [p(58.5, 37.0), p(51.4, 35.7), p(46.3, 38.1)],
      text: [
        'Möngke Khan schickte seinen Bruder Hülegü nach Westen, um Persien und',
        'Mesopotamien endgültig zu unterwerfen. Unterwegs nahm er die Bergfestung',
        'Alamut und zerschlug den Orden der Assassinen; 1258 fiel Bagdad, und mit',
        'dem letzten Abbasidenkalifen endete eine fünfhundertjährige Ordnung. Aus',
        'diesem Feldzug wurde das Ilchanat, das ein Jahrhundert lang Persien',
        'regierte — mit Täbris als Hauptstadt, mit persischen Beamten, mit einer',
        'Sternwarte in Maragha, an der Astronomen aus China und dem Islam',
        'zusammenarbeiteten. 1295 trat der Ilchan zum Islam über. Die Eroberer',
        'wurden zu dem, was sie erobert hatten.',
      ].join(' '),
    },
    {
      id: 'kublai-song',
      name: 'Kublai gegen die Song (1268–1279)',
      ...(([von, nach]) => ({ von, nach }))([p(116.4, 39.9), p(113.0, 22.5)]),
      ueber: [p(115.5, 34.5), p(114.3, 30.6), p(114.0, 26.0)],
      text: [
        'Der längste Krieg der Mongolen war der gegen ein Reich, das sie schon',
        'halb besaßen. Fünfzig Jahre lang hielten die südchinesischen Song hinter',
        'Jangtse und Huai stand — mit Festungen, Kanälen und einer Flotte, gegen',
        'die Reiterei nichts ausrichtet. Kublai baute deshalb selbst eine Flotte',
        'und ließ persische Ingenieure Wurfmaschinen konstruieren; die Belagerung',
        'von Xiangyang dauerte allein fünf Jahre. 1279 endete alles in einer',
        'Seeschlacht bei Yamen an der Südküste: Ein Beamter sprang mit dem',
        'achtjährigen Kaiser der Song im Arm ins Meer. Zum ersten Mal in der',
        'Geschichte war ganz China von Fremden beherrscht. Zwei Flotten, die',
        'Kublai danach gegen Japan schickte, versanken 1274 und 1281 im Sturm —',
        'die Japaner nannten ihn Kamikaze, „Götterwind".',
      ].join(' '),
    },
  ],

  beschriftungen: [
    { text: 'Europa', art: 'land', ...xy(12.0, 47.0) },
    { text: 'Russland', art: 'land', ...xy(42.0, 55.0) },
    { text: 'Steppe', art: 'land', ...xy(60.0, 49.5) },
    { text: 'Persien', art: 'land', ...xy(56.0, 30.5) },
    { text: 'Mongolei', art: 'land', ...xy(96.0, 49.5) },
    { text: 'Gobi', art: 'land', ...xy(106.0, 43.2) },
    { text: 'Seidenstraße', art: 'land', ...xy(88.0, 43.6) },
    { text: 'Himalaya', art: 'land', ...xy(85.0, 28.5) },
    { text: 'China', art: 'land', ...xy(112.0, 31.0) },
    { text: 'Korea', art: 'land', ...xy(127.5, 37.9) },
    { text: 'Japan', art: 'land', ...xy(138.0, 36.0) },
    { text: 'Mittelmeer', art: 'meer', ...xy(22.0, 34.5) },
    { text: 'Schwarzes Meer', art: 'meer', ...xy(32.0, 42.3) },
    { text: 'Kaspisches Meer', art: 'meer', ...xy(51.5, 42.0), drehung: -78 },
    { text: 'Gelbes Meer', art: 'meer', ...xy(123.5, 34.5) },
  ],
};

module.exports = karte;
