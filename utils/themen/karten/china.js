// Die Karte zum Thema „China: Vom ersten Kaiser zu den großen Dynastien".
//
// Aufgebaut wie karten/roemisches-reich.js: Die Küstenlinien stehen als echte
// Längen-/Breitengrade `[lon, lat]` im Repo, utils/karte-geo.js rechnet sie in
// SVG-Koordinaten um. Wer einen Punkt anzweifelt, schlägt ihn im Atlas nach:
// `[121.9, 31.4]` ist die Mündung des Jangtse, `[122.7, 37.4]` die Ostspitze
// der Halbinsel Shandong, `[108.9, 34.3]` Chang'an (das heutige Xi'an).
//
// Der Ausschnitt ist bewusst breiter als das Reich selbst: Er reicht im Westen
// bis nach Merw, damit die Seidenstraße als durchgehende Linie sichtbar wird —
// und mit ihr die Verbindung zum Römischen Reich, die den Kern dieses Kapitels
// ausmacht. Rom selbst liegt weit außerhalb des Bildes; deshalb steht am linken
// Rand ein antippbarer Punkt, der die Strecke zu Ende erzählt.
//
// Reine Daten und Rechnung — keine UI-Importe (Architektur-Regel).

const { KARTENFARBEN, erstelleProjektion, verbinde } = require('../../karte-geo');

// ---------------------------------------------------------------------------
// Ausschnitt und Projektion
// ---------------------------------------------------------------------------

/**
 * Der Kartenausschnitt: von Merw und Persien (58° O) bis Hokkaido (145° O),
 * vom Südchinesischen Meer (14° N) bis in die mongolische Steppe (55° N).
 *
 * Das Mittelmeer läge bei rund 20° O — weit links außerhalb des Bildes. Die
 * Karte kann Rom deshalb nicht zeigen, nur die Richtung dorthin; genau das
 * macht der Punkt „Weiter nach Rom" am linken Rand.
 */
const RAHMEN = { minLon: 58, maxLon: 145, minLat: 14, maxLat: 55, breite: 700 };

const geo = erstelleProjektion(RAHMEN);

/** Kurzform: geografischer Ort → SVG-Punkt `[x, y]`. */
const p = (lon, lat) => geo.punkt(lon, lat);

/** Kurzform für die Objektschreibweise `{ x, y }` eines Ortes. */
const xy = (lon, lat) => {
  const [x, y] = p(lon, lat);
  return { x, y };
};

// ---------------------------------------------------------------------------
// Küstenabschnitte — jeweils in einer Richtung notiert (Süd → Nord bzw.
// West → Ost). Dieselbe Punktliste trägt später die Landmasse UND die
// Reichsgrenze, die ihr folgt.
// ---------------------------------------------------------------------------

/** Golf von Tonkin: Delta des Roten Flusses → chinesische Grenze. */
const KUESTE_TONKIN = [
  [106.5, 20.3], // Delta des Roten Flusses (bei Hanoi)
  [107.2, 20.9],
  [108.1, 21.5],
];

/** Lingnan — die Südküste: Grenze zu Tonkin → Perlflussmündung. */
const KUESTE_LINGNAN = [
  [108.1, 21.5],
  [108.9, 21.6],
  [109.6, 21.4],
  [110.0, 21.3],
  [110.1, 20.8],
  [110.4, 20.4], // Südspitze der Halbinsel Leizhou
  [110.7, 21.0],
  [111.4, 21.5],
  [112.4, 21.7],
  [113.2, 22.0],
  [113.6, 22.4], // Perlflussmündung
];

/** Südostküste: Perlflussmündung → Mündung des Jangtse. */
const KUESTE_SUEDOST = [
  [113.6, 22.4],
  [114.3, 22.5], // Hongkong
  [115.6, 22.8],
  [116.7, 23.4], // Shantou
  [117.6, 23.9],
  [118.4, 24.5], // Xiamen
  [119.6, 25.4],
  [119.7, 26.1], // Fuzhou
  [120.4, 27.1], // Wenzhou
  [121.2, 28.3],
  [121.6, 29.1],
  [121.9, 29.9], // Ningbo
  [121.2, 30.2],
  [120.5, 30.4], // Bucht von Hangzhou
  [121.2, 30.9],
  [121.9, 31.4], // Mündung des Jangtse
];

/** Ostküste: Jangtse → Halbinsel Shandong → Bohai-Bucht → Shanhaiguan. */
const KUESTE_JIANGSU_SHANDONG = [
  [121.9, 31.4],
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
  [120.3, 37.8], // Penglai, Südseite der Bohai-Straße
  [119.2, 37.3],
  [118.9, 37.9], // Mündung des Gelben Flusses
  [117.9, 38.3],
  [117.7, 38.9], // dort, wo heute Tianjin liegt
  [118.5, 39.2],
  [119.6, 39.9], // Shanhaiguan — hier stößt die Große Mauer ans Meer
];

/** Bohai und Liaodong: Shanhaiguan → Dalian → Mündung des Yalu. */
const KUESTE_LIAODONG = [
  [119.6, 39.9],
  [120.5, 40.3],
  [121.2, 40.8],
  [122.1, 40.9], // Mündung des Liao, Grund der Bohai-Bucht
  [121.9, 40.0],
  [121.3, 39.2],
  [121.6, 38.9], // Dalian, Südspitze der Halbinsel Liaodong
  [122.6, 39.4],
  [123.6, 39.8],
  [124.4, 40.0], // Mündung des Yalu — Grenze nach Korea
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
  [126.3, 34.4], // Mokpo, Südwestecke
  [127.5, 34.4],
  [128.5, 34.8],
  [129.1, 35.1], // Busan — Südspitze, gegenüber von Japan
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

/** Die Küste nördlich davon: Tumen → Wladiwostok → über den Bildrand hinaus. */
const KUESTE_NORDOST = [
  [130.6, 42.3],
  [131.9, 43.1], // dort, wo heute Wladiwostok liegt
  [133.2, 42.8],
  [134.8, 43.5],
  [136.5, 44.5],
  [138.5, 46.5],
  [140.3, 48.8],
  [141.0, 51.0],
  [141.5, 56.0], // schon über dem Bildrand
];

/** Makran: die Küste zwischen Persien und dem Indus. */
const KUESTE_MAKRAN = [
  [57.5, 25.6], // schon außerhalb des Bildes
  [60.6, 25.3],
  [62.3, 25.2],
  [64.5, 25.2],
  [66.9, 24.9], // dort, wo heute Karatschi liegt
  [67.4, 24.0], // Mündung des Indus
];

/** Westküste Indiens: Indusdelta → Kathiawar → Bombay → Kap Komorin. */
const KUESTE_INDIEN_WEST = [
  [67.4, 24.0],
  [68.7, 23.6],
  [70.0, 22.8], // Golf von Kachchh
  [69.1, 22.2],
  [70.0, 20.8], // Südrand der Halbinsel Kathiawar
  [72.2, 21.1],
  [72.7, 21.7], // Golf von Khambhat
  [72.6, 20.7],
  [72.8, 18.9],
  [73.0, 17.9],
  [74.1, 14.8],
  [75.0, 12.0],
  [76.3, 9.9],
  [77.5, 8.1], // Kap Komorin, weit unter dem Bildrand
];

/** Ostküste Indiens: Kap Komorin → Golf von Bengalen → Gangesdelta. */
const KUESTE_INDIEN_OST = [
  [77.5, 8.1],
  [78.1, 9.1],
  [79.8, 10.3],
  [79.9, 11.0],
  [80.3, 13.1],
  [80.9, 15.7], // Delta der Krishna
  [82.3, 16.6], // Delta der Godavari
  [83.3, 18.1],
  [85.1, 19.7],
  [86.9, 20.7],
  [87.0, 21.6],
  [89.0, 21.7], // Gangesdelta
  [90.6, 22.0],
  [91.8, 22.3],
];

/** Birma: Gangesdelta → Delta des Irawadi → Südrand des Bildes. */
const KUESTE_BIRMA = [
  [91.8, 22.3],
  [92.6, 20.7],
  [93.5, 18.0],
  [94.2, 16.5],
  [95.3, 15.8], // Delta des Irawadi
  [96.5, 16.0],
  [97.5, 16.5],
  [98.0, 14.5],
  [98.3, 12.5],
  [98.6, 10.0],
];

/** Hinterindien: Golf von Siam → Mekongdelta → Vietnam → Tonkin. */
const KUESTE_INDOCHINA = [
  [98.6, 10.0],
  [99.5, 11.5],
  [100.0, 13.2], // Grund des Golfs von Siam
  [100.9, 12.6],
  [102.5, 12.2],
  [103.5, 10.6],
  [104.9, 9.6],
  [106.2, 9.6],
  [106.7, 10.5], // Mekongdelta
  [107.1, 10.4],
  [109.2, 11.3],
  [109.4, 12.9],
  [109.2, 13.9],
  [108.9, 15.2],
  [108.2, 16.1], // dort, wo heute Da Nang liegt
  [106.6, 17.2],
  [105.9, 18.3],
  [106.0, 19.2],
  [106.5, 20.3],
];

// ---------------------------------------------------------------------------
// Inseln
// ---------------------------------------------------------------------------

/** Honschu — die Hauptinsel Japans, vom Westzipfel im Bogen zurück. */
const HONSHU = [
  [131.0, 34.0], // Shimonoseki, gegenüber von Kyushu
  [132.0, 34.5],
  [133.3, 35.5],
  [134.7, 35.6],
  [135.9, 35.6], // Bucht von Wakasa
  [136.8, 37.4], // Halbinsel Noto
  [137.3, 36.9],
  [138.3, 37.2],
  [139.5, 38.0],
  [139.9, 39.9],
  [140.1, 40.6],
  [140.4, 41.2],
  [141.1, 41.4], // Nordspitze an der Tsugaru-Straße
  [141.5, 40.7],
  [141.6, 39.7],
  [141.9, 39.0],
  [141.1, 38.3], // dort, wo heute Sendai liegt
  [140.9, 37.0],
  [140.8, 36.1],
  [140.9, 35.7], // Kap Inubo, der Ostpunkt
  [140.0, 35.2],
  [139.8, 34.9], // Bucht von Tokio
  [138.9, 34.6], // Halbinsel Izu
  [138.2, 34.6],
  [137.0, 34.6],
  [136.9, 34.3],
  [136.1, 33.6],
  [135.4, 33.4], // Südspitze der Halbinsel Kii
  [135.1, 34.2],
  [134.2, 34.4],
  [133.0, 34.3],
  [131.8, 34.3],
];

const SHIKOKU = [
  [132.4, 33.5],
  [133.3, 33.5],
  [134.2, 33.6],
  [134.7, 34.2],
  [133.7, 34.3],
  [132.7, 34.1],
  [132.3, 33.9],
];

const KYUSHU = [
  [129.9, 33.3],
  [130.4, 33.6],
  [130.9, 33.9],
  [131.7, 33.5],
  [131.9, 32.7],
  [131.4, 31.5],
  [131.0, 31.1],
  [130.3, 31.2],
  [130.6, 32.0],
  [130.1, 32.4],
  [129.8, 32.8],
];

const HOKKAIDO = [
  [140.2, 41.9],
  [140.9, 42.6],
  [141.8, 42.6],
  [143.0, 42.3],
  [144.4, 42.9],
  [145.3, 43.4], // am rechten Bildrand
  [145.2, 44.3],
  [143.8, 44.1],
  [142.5, 44.7],
  [141.7, 45.4],
  [141.6, 44.4],
  [140.5, 43.3],
  [140.0, 42.6],
];

/** Sachalin am oberen rechten Bildrand — Chinas Welt endete lange davor. */
const SACHALIN = [
  [142.1, 46.1],
  [143.1, 47.6],
  [143.5, 49.0],
  [142.8, 50.2],
  [143.3, 52.0],
  [142.6, 54.0],
  [141.9, 53.4],
  [142.0, 51.2],
  [141.8, 49.2],
  [142.5, 48.0],
  [141.9, 46.6],
];

const TAIWAN = [
  [121.0, 25.3],
  [121.9, 25.1],
  [121.6, 24.0],
  [120.9, 22.5],
  [120.3, 22.7],
  [120.1, 23.6],
  [120.8, 24.8],
];

const HAINAN = [
  [110.6, 20.1],
  [111.0, 19.6],
  [110.5, 18.7],
  [109.5, 18.3],
  [108.7, 19.3],
  [109.3, 19.9],
];

/** Luzon am unteren Bildrand — der Nordteil der Philippinen. */
const LUZON = [
  [120.5, 18.6],
  [121.6, 18.4],
  [122.2, 17.3],
  [122.1, 16.0],
  [121.7, 14.6],
  [120.9, 14.4],
  [120.5, 15.6],
  [119.9, 16.4],
  [120.3, 18.0],
];

// ---------------------------------------------------------------------------
// Binnengewässer
// ---------------------------------------------------------------------------

/** Der Aralsee — damals noch groß, ein Fixpunkt am Westende der Route. */
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

/** Der Baikalsee, nur mit seinem Südteil im Bild. */
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

/** Der Kokonor (Qinghai-See) — Wegmarke direkt neben der Seidenstraße. */
const KOKONOR = [
  [99.6, 36.9],
  [100.2, 37.3],
  [100.9, 37.2],
  [100.8, 36.7],
  [100.0, 36.6],
  [99.6, 36.7],
];

// ---------------------------------------------------------------------------
// Wüsten — sie erklären, warum die Seidenstraße lief, wie sie lief
// ---------------------------------------------------------------------------

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

/** Die Wüste Gobi zwischen der Großen Mauer und der Steppe. */
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

// ---------------------------------------------------------------------------
// Flüsse — sie ordnen die Landschaft und tragen die Geschichte
// ---------------------------------------------------------------------------

/** Der Gelbe Fluss (Huang He) mit der großen Ordos-Schleife im Norden. */
const GELBER_FLUSS = [
  [96.5, 34.9],
  [100.5, 34.5],
  [102.0, 35.8],
  [103.8, 36.1], // dort, wo heute Lanzhou liegt
  [105.5, 37.5],
  [106.3, 38.6],
  [107.5, 40.3],
  [110.0, 40.6], // Nordbogen der Ordos-Schleife
  [111.2, 39.5],
  [110.5, 38.0],
  [110.4, 36.0],
  [110.3, 34.7], // hier knickt der Fluss nach Osten
  [112.5, 34.8], // Luoyang
  [114.5, 34.8],
  [116.5, 35.5],
  [118.0, 37.0],
  [118.9, 37.9], // Mündung in die Bohai-Bucht
];

/** Der Jangtse (Chang Jiang) — die Lebensader des Südens. */
const JANGTSE = [
  [92.0, 33.5],
  [96.5, 32.0],
  [98.5, 30.0],
  [99.5, 28.0],
  [100.2, 26.8], // der große Knick nach Nordosten
  [101.5, 26.7],
  [103.0, 28.5],
  [104.5, 28.8],
  [106.5, 29.6], // Chongqing
  [109.0, 30.8], // die drei Schluchten
  [111.3, 30.7],
  [113.0, 30.6],
  [114.3, 30.6], // Wuhan
  [116.5, 30.0],
  [117.8, 30.9],
  [119.0, 32.0], // Nanjing
  [120.5, 32.0],
  [121.9, 31.4],
];

/** Der Westfluss (Xi Jiang) — der Weg nach Kanton. */
const WESTFLUSS = [
  [104.0, 23.6],
  [107.0, 23.5],
  [109.5, 23.2],
  [111.3, 23.5],
  [112.5, 23.3],
  [113.3, 23.1], // Kanton (Guangzhou)
  [113.6, 22.4],
];

/** Der Tarim — er versickert in der Wüste, statt ins Meer zu münden. */
const TARIM = [
  [77.0, 40.0],
  [80.5, 41.0],
  [84.0, 41.2],
  [86.5, 41.0],
  [88.5, 40.4],
];

/** Der Mekong. */
const MEKONG = [
  [97.5, 33.0],
  [98.8, 30.0],
  [100.0, 27.0],
  [100.9, 24.0],
  [102.0, 21.5],
  [103.5, 19.5],
  [104.8, 18.0],
  [105.9, 15.5],
  [105.5, 13.0],
  [106.7, 10.6],
];

/** Der Amudarja (der Oxus der Antike) — Westende der Seidenstraße. */
const AMUDARJA = [
  [71.5, 37.2],
  [68.0, 37.2],
  [65.5, 38.5],
  [63.0, 40.0],
  [61.5, 42.5],
  [59.5, 44.3],
];

/** Der Syrdarja. */
const SYRDARJA = [
  [70.5, 40.5],
  [68.5, 40.8],
  [66.5, 42.5],
  [63.5, 44.5],
  [61.0, 45.4],
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
  [88.5, 23.5],
  [89.2, 22.2],
];

// ---------------------------------------------------------------------------
// Die Landmasse
// ---------------------------------------------------------------------------

/**
 * Asien hängt zusammen — von Persien bis ans Japanische Meer, von Indien bis
 * in die sibirische Taiga. Deshalb ist es ein einziger Umriss. Die Randpunkte
 * liegen bewusst außerhalb des Ausschnitts: So läuft das Land über den
 * Bildrand hinaus, statt dort abzuknicken.
 */
const KONTINENT = verbinde(
  KUESTE_MAKRAN,
  KUESTE_INDIEN_WEST,
  KUESTE_INDIEN_OST,
  KUESTE_BIRMA,
  KUESTE_INDOCHINA,
  KUESTE_TONKIN,
  KUESTE_LINGNAN,
  KUESTE_SUEDOST,
  KUESTE_JIANGSU_SHANDONG,
  KUESTE_LIAODONG,
  KOREA,
  KUESTE_NORDOST,
  // Rückweg außerhalb des Bildes: Sibirien im Norden, Persien im Westen.
  [
    [150, 62],
    [50, 62],
    [50, 30],
    [52, 26],
  ],
);

// ---------------------------------------------------------------------------
// Die Große Mauer und die Seidenstraße
// ---------------------------------------------------------------------------

/**
 * Die Große Mauer in ihrem Verlauf der Han-Zeit: vom Meer bei Shanhaiguan
 * nach Westen, über die Ordos-Schleife und dann den Hexi-Korridor entlang bis
 * zum Jadetor bei Dunhuang. Sie ist die auffälligste Linie der Karte — und
 * zugleich die Nordgrenze fast aller Phasen.
 */
const GROSSE_MAUER = [
  [119.8, 40.0], // Shanhaiguan, wo die Mauer ins Meer läuft
  [117.8, 40.6],
  [116.0, 40.5], // nördlich des heutigen Peking
  [113.5, 41.2],
  [111.2, 41.4],
  [109.0, 41.0],
  [107.0, 39.8],
  [105.2, 38.6],
  [103.5, 37.6],
  [101.5, 38.6],
  [99.5, 39.7], // der Hexi-Korridor: eine Gasse zwischen Wüste und Gebirge
  [97.5, 40.2],
  [95.5, 40.3],
  [93.9, 40.4], // das Jadetor (Yumenguan) westlich von Dunhuang
];

/**
 * Die Seidenstraße von Chang'an bis an den westlichen Bildrand — und von dort
 * weiter, über Persien und das Mittelmeer, bis nach Rom. Sie war nie eine
 * Straße, sondern ein Bündel von Wegen; das hier ist die klassische
 * Südroute um die Taklamakan herum.
 */
const SEIDENSTRASSE = [
  [108.9, 34.3], // Chang'an
  [107.2, 34.4],
  [105.7, 34.6],
  [103.8, 36.1], // Übergang über den Gelben Fluss
  [102.6, 37.9],
  [100.5, 38.9],
  [98.5, 39.7],
  [96.5, 40.1],
  [94.7, 40.1], // Dunhuang
  [91.5, 39.9],
  [88.5, 39.5], // Loulan, am ausgetrockneten Lop Nor
  [85.5, 38.1],
  [82.5, 37.3],
  [79.9, 37.1], // Khotan, die Stadt der Jade
  [77.2, 38.4],
  [75.9, 39.5], // Kaschgar
  [73.5, 39.6], // über das Dach der Welt, den Pamir
  [72.8, 40.4],
  [70.0, 40.2],
  [66.9, 39.6], // Samarkand
  [64.4, 39.8], // Buchara
  [62.2, 37.7], // Merw
  [58.3, 37.3], // und weiter nach Westen, aus dem Bild hinaus
];

// ---------------------------------------------------------------------------
// Die Phasen — dieselbe Karte, drei Zeitpunkte
// ---------------------------------------------------------------------------

/** 221 v. Chr.: die Nordgrenze des Qin-Reiches, gesichert durch die Mauer. */
const QIN_NORDGRENZE = [
  [119.6, 39.9],
  [117.5, 40.5],
  [115.5, 40.7],
  [113.0, 41.0],
  [111.0, 40.9],
  [109.2, 40.2],
  [107.5, 39.2],
  [106.3, 38.3],
  [105.2, 37.3],
  [104.0, 36.2],
];

/** 221 v. Chr.: die Westgrenze — am Rand des Hochlands endet das Reich. */
const QIN_WESTGRENZE = [
  [104.0, 36.2],
  [103.5, 34.5],
  [104.8, 32.6],
  [104.0, 31.2],
  [103.0, 30.0],
  [102.6, 28.3],
  [103.8, 26.6],
  [104.6, 24.6],
  [106.0, 23.2],
  [107.3, 22.1],
  [108.1, 21.5],
];

/**
 * 221 v. Chr.: Was der erste Kaiser zusammenzwang — die Streitenden Reiche
 * zwischen Gelbem Fluss und Jangtse, dazu der Süden bis ans Meer.
 */
const QIN_221 = verbinde(
  KUESTE_LINGNAN,
  KUESTE_SUEDOST,
  KUESTE_JIANGSU_SHANDONG,
  QIN_NORDGRENZE,
  QIN_WESTGRENZE,
);

/**
 * 100 n. Chr.: die Nordgrenze der Han. Sie folgt der Mauer und läuft als
 * schmale Zunge durch den Hexi-Korridor bis zum Jadetor — der Korridor ist
 * der Flaschenhals, durch den alle Seide nach Westen ging.
 */
const HAN_NORDGRENZE = [
  [119.6, 39.9],
  [117.8, 40.6],
  [116.0, 40.5],
  [113.5, 41.2],
  [111.2, 41.4],
  [109.0, 41.0],
  [107.0, 39.8],
  [105.2, 38.6],
  [103.5, 37.6],
  [101.5, 38.6],
  [99.5, 39.7],
  [97.5, 40.2],
  [95.5, 40.3],
  [93.9, 40.4], // Jadetor
  // und am Südrand des Korridors zurück
  [95.0, 39.4],
  [97.0, 39.0],
  [99.0, 38.4],
  [100.8, 37.6],
  [102.3, 36.8],
  [103.3, 35.6],
  [103.3, 35.0],
];

/** 100 n. Chr.: die Westgrenze der Han, bis in den Norden Vietnams. */
const HAN_WESTGRENZE = [
  [103.3, 35.0],
  [104.9, 32.8],
  [104.2, 31.2],
  [103.0, 29.8],
  [102.4, 28.0],
  [103.4, 26.2],
  [104.4, 24.2],
  [105.6, 22.8],
  [106.3, 21.5],
  [106.5, 20.3],
];

/** 100 n. Chr.: das Kernland der Han-Dynastie. */
const HAN_KERN = verbinde(
  KUESTE_TONKIN,
  KUESTE_LINGNAN,
  KUESTE_SUEDOST,
  KUESTE_JIANGSU_SHANDONG,
  HAN_NORDGRENZE,
  HAN_WESTGRENZE,
);

/**
 * 100 n. Chr.: die „Westgebiete" — der Ring bewohnbarer Oasen rings um die
 * Wüste Taklamakan. Nicht erobert, sondern durch Garnisonen, Bündnisse und
 * Geschenke gehalten. Ohne sie keine Seidenstraße.
 */
const HAN_WESTGEBIETE = [
  [93.9, 40.4],
  [92.0, 41.5],
  [89.2, 42.9], // Turfan
  [86.2, 41.9],
  [83.0, 41.7], // Kutscha
  [80.3, 41.2], // Aksu
  [76.8, 40.6],
  [75.9, 39.5], // Kaschgar
  [76.5, 38.6],
  [77.2, 38.4], // Yarkand
  [79.9, 37.1], // Khotan
  [82.5, 37.3],
  [85.5, 38.1],
  [88.2, 39.2],
  [90.5, 39.6],
  [92.5, 39.9],
];

/** 100 n. Chr.: Lelang — der han-zeitliche Vorposten im Norden Koreas. */
const HAN_LELANG = [
  [124.4, 40.0],
  [125.4, 39.6],
  [125.1, 38.8],
  [126.0, 38.3],
  [126.6, 37.5],
  [127.2, 38.4],
  [127.4, 39.5],
  [126.3, 40.3],
];

/** 750 n. Chr.: die Nordgrenze der Tang, weiter draußen als bei den Han. */
const TANG_NORDGRENZE = [
  [124.4, 40.0],
  [123.0, 41.5],
  [120.5, 42.3],
  [118.0, 42.3],
  [115.5, 42.0],
  [113.0, 41.6],
  [111.0, 41.5],
  [108.8, 41.0],
  [106.8, 39.9],
  [105.0, 38.7],
  [103.4, 37.7],
  [101.4, 38.7],
  [99.4, 39.8],
  [97.4, 40.3],
  [95.4, 40.4],
  [93.9, 40.4],
  [95.0, 39.3],
  [97.0, 38.8],
  [99.0, 38.2],
  [100.8, 37.4],
  [102.3, 36.6],
  [103.2, 35.4],
  [103.0, 34.6],
];

/**
 * 750 n. Chr.: die Westgrenze der Tang. Sie bleibt östlich der Berge — in
 * Yunnan hält sich zu dieser Zeit das eigenständige Reich Nanzhao.
 */
const TANG_WESTGRENZE = [
  [103.0, 34.6],
  [104.6, 32.6],
  [103.8, 31.0],
  [102.6, 29.6],
  [101.6, 28.2],
  [101.0, 26.5],
  [102.5, 25.0],
  [104.0, 23.6],
  [105.4, 22.6],
  [106.2, 21.4],
  [106.5, 20.3],
];

/** 750 n. Chr.: das Kernland der Tang-Dynastie. */
const TANG_KERN = verbinde(
  KUESTE_TONKIN,
  KUESTE_LINGNAN,
  KUESTE_SUEDOST,
  KUESTE_JIANGSU_SHANDONG,
  KUESTE_LIAODONG,
  TANG_NORDGRENZE,
  TANG_WESTGRENZE,
);

/**
 * 750 n. Chr.: das Protektorat Anxi — Tarimbecken, Dsungarei und das Tal des
 * Ili, bis fast an den Balchaschsee. Ein Jahr später endet dieser Vorstoß am
 * Fluss Talas, in der Schlacht gegen ein arabisches Heer.
 */
const TANG_WESTGEBIETE = [
  [93.9, 40.4],
  [92.5, 41.8],
  [91.0, 43.0],
  [89.0, 44.2],
  [87.0, 44.6],
  [84.5, 45.0],
  [82.0, 45.2],
  [80.5, 45.0],
  [79.0, 44.0],
  [77.0, 43.3],
  [75.0, 42.8], // Suyab am Issyk-Kul
  [73.2, 42.6], // der Talas
  [72.0, 41.5],
  [73.0, 40.3],
  [74.5, 39.7],
  [75.9, 39.5],
  [76.5, 38.6],
  [77.2, 38.4],
  [79.9, 37.1],
  [82.5, 37.3],
  [85.5, 38.1],
  [88.2, 39.2],
  [90.5, 39.6],
  [92.5, 39.9],
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
  strokeWidth: 2,
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
    land(KONTINENT),
    land(HONSHU),
    land(SHIKOKU),
    land(KYUSHU),
    land(HOKKAIDO),
    land(SACHALIN),
    land(TAIWAN),
    land(HAINAN),
    land(LUZON),
    wasser(ARALSEE),
    wasser(BALCHASCH),
    wasser(BAIKAL),
    wasser(KOKONOR),
    wueste(TAKLAMAKAN),
    wueste(GOBI),
    fluss(GELBER_FLUSS),
    fluss(JANGTSE),
    fluss(WESTFLUSS),
    fluss(TARIM),
    fluss(MEKONG),
    fluss(AMUDARJA),
    fluss(SYRDARJA),
    fluss(INDUS),
    fluss(GANGES),
    // Die Große Mauer und die Seidenstraße gehören zum festen Untergrund:
    // Beide sind älter als jede einzelne Phase und älter als jede Dynastie.
    {
      art: 'mauer',
      d: geo.pfad(GROSSE_MAUER, { geschlossen: false }),
      fill: 'none',
      stroke: KARTENFARBEN.mauer,
      strokeWidth: 3.5,
    },
    {
      art: 'route',
      d: geo.pfad(SEIDENSTRASSE, { geschlossen: false }),
      fill: 'none',
      stroke: KARTENFARBEN.route,
      strokeWidth: 2.6,
    },
  ],

  phasen: [
    {
      id: 'qin-einigung',
      label: '221 v. Chr.',
      hinweis:
        'Nach 250 Jahren Krieg zwischen den Streitenden Reichen bleibt ein Sieger übrig: Qin. Der erste Kaiser vereint das Land zwischen Gelbem Fluss und Jangtse — und macht sofort alles gleich: eine Schrift, ein Maß, eine Achsbreite, eine Mauer im Norden.',
      flaechen: [gebiet('Das Reich des ersten Kaisers', QIN_221)],
    },
    {
      id: 'han-hoehepunkt',
      label: '100 n. Chr.',
      hinweis:
        'Die Han-Dynastie auf ihrem Höhepunkt — ungefähr so groß und so bevölkert wie das Römische Reich zur selben Zeit. Durch den schmalen Hexi-Korridor greift sie bis ins Tarimbecken aus und hält damit die Seidenstraße offen.',
      flaechen: [
        gebiet('Das Han-Reich', HAN_KERN),
        gebiet('Die Westgebiete um die Taklamakan', HAN_WESTGEBIETE),
        gebiet('Lelang im Norden Koreas', HAN_LELANG),
      ],
    },
    {
      id: 'tang-bluete',
      label: '750 n. Chr.',
      hinweis:
        'Die Tang-Dynastie in voller Blüte: Chang’an ist mit rund einer Million Menschen die größte Stadt der Welt, und die Seidenstraße ist so belebt wie nie. In den Straßen der Hauptstadt hört man Sogdisch, Persisch, Türkisch, Sanskrit. Tippe die Route an — sie hört am Bildrand nicht auf.',
      flaechen: [
        gebiet('Das Tang-Reich', TANG_KERN),
        gebiet('Das Protektorat Anxi — die Westgebiete', TANG_WESTGEBIETE),
      ],
    },
  ],

  punkte: [
    {
      id: 'changan',
      name: 'Chang’an',
      typ: 'stadt',
      ...xy(108.9, 34.3),
      text: [
        'Der Anfang und das Ende jeder Karawane. Hier ließ der erste Kaiser seine',
        'Grabanlage bauen — mit einer Armee aus rund 8 000 lebensgroßen',
        'Tonsoldaten, jeder mit einem eigenen Gesicht; entdeckt wurde sie erst',
        '1974 von Bauern beim Brunnengraben. Unter den Tang wurde die Stadt zur',
        'größten der Welt: ein Schachbrett aus 108 ummauerten Vierteln, rund eine',
        'Million Menschen, zwei riesige Märkte — und auf dem Westmarkt Händler',
        'aus Persien, Sogdien, Indien und Arabien.',
      ].join(' '),
    },
    {
      id: 'grosse-mauer',
      name: 'Große Mauer',
      typ: 'grenze',
      ...xy(116.0, 40.5),
      text: [
        'Nicht ein Bauwerk, sondern viele: Schon die Streitenden Reiche hatten',
        'Wälle: der erste Kaiser ließ sie verbinden, die Han verlängerten die',
        'Linie nach Westen bis zum Jadetor. Erdwälle, Gräben, Signaltürme in',
        'Sichtweite — von Turm zu Turm konnte eine Nachricht schneller reisen als',
        'jedes Pferd. Wie der römische Limes war die Mauer keine undurchdringliche',
        'Sperre, dafür war sie viel zu lang. Sie war eine kontrollierte Schwelle:',
        'Wer durchwollte, tat es an einem Tor, unter Aufsicht und gegen Zoll.',
      ].join(' '),
    },
    {
      id: 'dunhuang',
      name: 'Dunhuang',
      typ: 'stadt',
      ...xy(94.7, 40.1),
      text: [
        'Das Tor zur Seidenstraße: Hier endete der Hexi-Korridor, hier teilte sich',
        'die Route in einen Nord- und einen Südweg um die Wüste Taklamakan. Wer',
        'nach Westen zog, nahm in Dunhuang Wasser, Kamele und Mut auf. In den',
        'Höhlen der tausend Buddhas ganz in der Nähe haben Reisende über tausend',
        'Jahre lang Wandbilder und Schriftrollen hinterlassen — darunter das',
        'älteste bekannte gedruckte Buch der Welt mit Datum: 868 n. Chr.',
      ].join(' '),
    },
    {
      id: 'kaschgar',
      name: 'Kaschgar',
      typ: 'stadt',
      ...xy(75.9, 39.5),
      text: [
        'Hier trafen sich Nord- und Südroute wieder — und hier begann der',
        'schwierigste Teil: der Weg über den Pamir, das „Dach der Welt", auf',
        'Pässen weit über 4 000 Meter. Kaschgar war deshalb ein riesiger',
        'Umschlagplatz. Kaum eine Ware legte den ganzen Weg von China nach Rom in',
        'denselben Händen zurück; sie wechselte unterwegs Dutzende Male den',
        'Besitzer, und mit jedem Wechsel stieg der Preis.',
      ].join(' '),
    },
    {
      id: 'samarkand',
      name: 'Samarkand',
      typ: 'stadt',
      ...xy(66.9, 39.6),
      text: [
        'Die große Handelsstadt zwischen den beiden Welten, Heimat der Sogder —',
        'jener Händler, deren Sprache jahrhundertelang die Verkehrssprache der',
        'Seidenstraße war. Von hier ging es weiter über Buchara und Merw ins',
        'Perserreich und ans Mittelmeer. Wer in Samarkand stand, war ungefähr auf',
        'halber Strecke zwischen Chang’an und Rom.',
      ].join(' '),
    },
    {
      id: 'weiter-nach-rom',
      name: 'Weiter nach Rom',
      typ: 'ereignis',
      ...xy(59.5, 37.4),
      text: [
        'Hier hört die Karte auf, aber nicht der Weg. Von Merw führte die Route',
        'weiter durch das Perserreich, über Mesopotamien ans Mittelmeer und von',
        'dort nach Rom — rund 8 000 Kilometer von Chang’an aus. Diesen Weg ist',
        'in der Antike wohl nie ein Mensch ganz gegangen: Die Seide wanderte von',
        'Hand zu Hand. Deshalb wussten die beiden größten Reiche der Erde',
        'voneinander fast nur vom Hörensagen. Rom nannte China „Serica", das Land',
        'der Seide; China nannte Rom „Da Qin", das große Qin. Zwei Reiche, ein',
        'Faden dazwischen — und dazwischen niemand, der beide gesehen hatte.',
      ].join(' '),
    },
  ],

  bewegungen: [
    {
      id: 'zhang-qian',
      name: 'Zhang Qian nach Westen',
      ...(([von, nach]) => ({ von, nach }))([p(108.9, 34.3), p(67.5, 37.2)]),
      ueber: [p(103.0, 37.4), p(95.0, 40.0), p(85.0, 41.0), p(76.5, 40.0), p(71.5, 40.3)],
      text: [
        '138 v. Chr. schickte Kaiser Wu einen Gesandten namens Zhang Qian nach',
        'Westen: Er sollte Verbündete gegen die Xiongnu finden. Zhang Qian geriet',
        'gleich in Gefangenschaft, lebte zehn Jahre bei den Xiongnu, heiratete',
        'dort, floh weiter nach Westen und kam nach dreizehn Jahren zurück — ohne',
        'Bündnis, aber mit etwas Größerem: der ersten Beschreibung der Länder',
        'jenseits der Wüste. Er berichtete von Städten, von himmlischen Pferden,',
        'von Menschen, die Wein tranken. Aus diesem gescheiterten Auftrag wurde',
        'die Seidenstraße.',
      ].join(' '),
    },
    {
      id: 'karawanen',
      name: 'Karawanen der Seidenstraße',
      ...(([von, nach]) => ({ von, nach }))([p(108.9, 34.3), p(60.5, 37.4)]),
      ueber: [p(103.8, 36.1), p(94.7, 40.1), p(85.5, 38.1), p(75.9, 39.5), p(66.9, 39.6), p(62.2, 37.7)],
      text: [
        'Nach Westen gingen Seide, Papier, Lack, Pfirsiche und Zimt; nach Osten',
        'kamen Glas, Gold, Wolle, Pferde, Weintrauben — und Ideen, die alles',
        'veränderten: Aus Indien kam der Buddhismus nach China, später Manichäer,',
        'Christen und Muslime. Eine Karawane brauchte über ein Jahr für die',
        'Strecke bis Persien. Und mit den Waren reisten auch Krankheiten: Seuchen',
        'trafen Rom und China zur selben Zeit, ohne dass jemand ahnte, warum.',
      ].join(' '),
    },
    {
      id: 'xiongnu',
      name: 'Xiongnu an der Nordgrenze',
      ...(([von, nach]) => ({ von, nach }))([p(105.0, 47.5), p(109.5, 39.2)]),
      ueber: [p(106.5, 44.5), p(108.0, 41.5)],
      text: [
        'Nördlich der Mauer lebten Reitervölker, die die Chinesen „Xiongnu"',
        'nannten — kein Reich mit Städten, sondern ein Bündnis von Verbänden, die',
        'überraschend zuschlagen und ebenso schnell verschwinden konnten. Die Han',
        'versuchten alles: Mauern bauen, Prinzessinnen verheiraten, Tribut zahlen,',
        'Feldzüge führen. Genau dieser Druck aus der Steppe trieb China nach',
        'Westen — und öffnete dabei die Seidenstraße. Das Problem an der Grenze',
        'kannten beide Enden der Route: Rom nannte seine Nachbarn „Barbaren".',
      ].join(' '),
    },
  ],

  beschriftungen: [
    { text: 'China', art: 'land', ...xy(111.0, 29.0) },
    { text: 'Korea', art: 'land', ...xy(127.6, 37.4) },
    { text: 'Japan', art: 'land', ...xy(138.0, 36.5) },
    { text: 'Tibet', art: 'land', ...xy(89.0, 32.3) },
    { text: 'Himalaya', art: 'land', ...xy(85.0, 28.3) },
    { text: 'Indien', art: 'land', ...xy(78.0, 21.5) },
    { text: 'Persien', art: 'land', ...xy(63.5, 32.0) },
    { text: 'Wüste Gobi', art: 'land', ...xy(105.0, 43.8) },
    { text: 'Steppe der Xiongnu', art: 'land', ...xy(111.0, 47.8) },
    { text: 'Seidenstraße', art: 'land', ...xy(92.0, 42.6) },
    { text: 'Gelbes Meer', art: 'meer', ...xy(122.5, 34.0) },
    { text: 'Ostchinesisches Meer', art: 'meer', ...xy(126.5, 28.0) },
    { text: 'Südchinesisches Meer', art: 'meer', ...xy(116.5, 16.8) },
  ],
};

module.exports = karte;
