// Die Karte zum Thema „Japan — die Inselwelt zwischen Abschottung und Öffnung".
//
// Aufgebaut wie karten/roemisches-reich.js, karten/china.js und
// karten/dschingis-khan.js: Die Küstenlinien stehen als echte Längen-/
// Breitengrade `[lon, lat]` im Repo, utils/karte-geo.js rechnet sie in
// SVG-Koordinaten um. Wer einen Punkt anzweifelt, schlägt ihn im Atlas nach:
// `[130.67, 31.0]` ist Kap Sata, die Südspitze Kyushus, `[141.94, 45.52]`
// Kap Soya, die Nordspitze Hokkaidos, `[139.85, 35.65]` der Grund der Bucht
// von Tokio.
//
// Diese Karte hat eine andere Aufgabe als die drei davor. Dort ging es um
// Reiche, die sich über Land ausdehnen — hier geht es um eine Inselwelt. Das
// Meer ist deshalb nicht der leere Rand des Bildes, sondern sein Thema: Es
// hält 1274 und 1281 die Mongolen auf, es trägt zweitausend Jahre lang die
// Schrift, den Buddhismus und die Münzen vom Festland herüber, und es ist
// 1853 der Weg, auf dem Perrys Dampfschiffe die Abschottung beenden. Trennung
// und Verbindung sind hier dasselbe Wasser.
//
// Reine Daten und Rechnung — keine UI-Importe (Architektur-Regel).

const { KARTENFARBEN, erstelleProjektion, verbinde } = require('../../karte-geo');

// ---------------------------------------------------------------------------
// Ausschnitt und Projektion
// ---------------------------------------------------------------------------

/**
 * Der Kartenausschnitt: vom ostchinesischen Festland (119° O) bis östlich
 * Hokkaidos (146° O), von den Ryukyu-Inseln (28° N) bis Kap Soya (46° N).
 *
 * Der Westrand liegt bewusst ein Stück weiter draußen als der japanische
 * Archipel: Ningbo und die Jangtse-Mündung müssen mit ins Bild, sonst hätte
 * die Handelsroute vom Festland keinen Anfang und die zweite Mongolenflotte
 * von 1281 keinen Ausgangshafen. Nach Süden endet die Karte über dem
 * Ostchinesischen Meer — Okinawa und die Ryukyu-Inseln liegen schon darunter.
 */
const RAHMEN = { minLon: 119, maxLon: 146, minLat: 28, maxLat: 46, breite: 700 };

const geo = erstelleProjektion(RAHMEN);

/** Kurzform: geografischer Ort → SVG-Punkt `[x, y]`. */
const p = (lon, lat) => geo.punkt(lon, lat);

/** Kurzform für die Objektschreibweise `{ x, y }` eines Ortes. */
const xy = (lon, lat) => {
  const [x, y] = p(lon, lat);
  return { x, y };
};

/** Kurzform für `{ von, nach }` einer Bewegung aus zwei Orten. */
const weg = (von, nach) => ({ von: p(...von), nach: p(...nach) });

// ---------------------------------------------------------------------------
// Das Festland — China, Korea und die Küste nordöstlich davon
// ---------------------------------------------------------------------------

/**
 * Die chinesische Küste vom Süden des Bildes bis zur Mündung des Yalu.
 *
 * Der erste Punkt liegt absichtlich unterhalb des Ausschnitts, damit das Land
 * über den Bildrand hinausläuft, statt dort abzuknicken.
 */
const KUESTE_CHINA = [
  [119.5, 25.5], // schon unter dem Bildrand
  [119.7, 26.1], // Fuzhou
  [120.4, 27.1], // Wenzhou
  [121.2, 28.3],
  [121.6, 29.1],
  [121.9, 29.9], // Ningbo — Hafen des Handels mit Japan
  [121.2, 30.2],
  [120.5, 30.4], // Bucht von Hangzhou
  [121.2, 30.9],
  [121.9, 31.4], // Mündung des Jangtse
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
  [118.9, 37.9], // Mündung des Gelben Flusses, schon außerhalb des Bildes
  [117.7, 38.9],
  [119.6, 39.9], // Shanhaiguan
  [121.2, 40.8],
  [122.1, 40.9], // Grund der Bohai-Bucht
  [121.9, 40.0],
  [121.3, 39.2],
  [121.6, 38.9], // Dalian, Südspitze der Halbinsel Liaodong
  [122.6, 39.4],
  [123.6, 39.8],
  [124.4, 40.0], // Mündung des Yalu — die Grenze nach Korea
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
  [126.3, 34.4], // Mokpo, die Südwestecke
  [127.5, 34.4],
  [128.5, 34.8],
  [129.1, 35.1], // Busan — von hier sind es keine 200 km bis Kyushu
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

/**
 * Die Nordgrenze Koreas — Yalu und Tumen, dazwischen der Paektu.
 *
 * Sie ist keine Küste, sondern die Linie, an der die Halbinsel ans Festland
 * stößt. Gebraucht wird sie für die Fläche des Königreichs Goryeo, von dem
 * aus die Mongolen 1274 und 1281 übersetzten.
 */
const KOREA_NORDGRENZE = [
  [130.6, 42.3],
  [129.3, 41.9],
  [128.1, 42.0], // am Fuß des Paektu
  [126.8, 41.6],
  [125.6, 40.8],
  [124.4, 40.0],
];

/** Die Küste nördlich des Tumen: Wladiwostok → über den oberen Bildrand. */
const KUESTE_NORDOST = [
  [130.6, 42.3],
  [131.9, 43.1], // dort, wo heute Wladiwostok liegt
  [133.2, 42.8],
  [134.8, 43.5],
  [136.5, 44.5],
  [138.5, 46.5], // schon über dem Bildrand
  [140.0, 48.5],
];

/**
 * Das Festland als ein einziger Umriss: China, Korea und die Küste bis
 * Sibirien hängen zusammen. Der Rückweg läuft weit außerhalb des Bildes.
 */
const FESTLAND = verbinde(
  KUESTE_CHINA,
  KOREA,
  KUESTE_NORDOST,
  [
    [150, 60],
    [110, 60],
    [110, 24],
    [117, 25],
  ],
);

/** Die Fläche des Königreichs Goryeo — Korea, wie es 1274 aussah. */
const GORYEO = verbinde(KOREA, KOREA_NORDGRENZE);

// ---------------------------------------------------------------------------
// Honschu — die Hauptinsel, in vier Abschnitte zerlegt
//
// Die Aufteilung hat einen Grund: Die Yamato-Herrscher beherrschten um 600
// nicht die ganze Insel, sondern den Süden und die Mitte. Dieselben
// Küstenabschnitte tragen deshalb einmal die Insel und einmal die kleinere
// Fläche der ersten Phase.
// ---------------------------------------------------------------------------

/** Die Küste am Japanischen Meer, West: Shimonoseki → Niigata. */
const HONSHU_JAPANMEER_WEST = [
  [130.95, 34.0], // Shimonoseki — hier trennt eine schmale Straße Honshu von Kyushu
  [131.4, 34.4], // Hagi
  [131.9, 34.7],
  [132.7, 35.4], // Izumo
  [133.5, 35.6],
  [134.2, 35.55], // Tottori
  [135.1, 35.7], // Halbinsel Tango
  [135.4, 35.5], // Bucht von Wakasa
  [136.1, 35.65], // Tsuruga
  [136.0, 36.1], // Kap Echizen
  [136.6, 36.6], // Kanazawa
  [136.85, 36.85],
  [137.3, 37.5], // Spitze der Halbinsel Noto
  [136.9, 37.1],
  [137.25, 36.75], // Grund der Bucht von Toyama
  [138.25, 37.15],
  [139.05, 37.9], // Niigata
];

/** Die Küste am Japanischen Meer, Nord: Niigata → Kap Oma. */
const HONSHU_JAPANMEER_NORD = [
  [139.05, 37.9],
  [139.4, 38.4],
  [139.55, 38.85],
  [139.9, 39.4],
  [139.7, 39.9], // Kap Nyudo auf der Halbinsel Oga
  [140.05, 39.75], // Akita
  [140.0, 40.25],
  [140.1, 40.75],
  [140.35, 41.25], // Kap Tappi an der Tsugaru-Straße
  [140.8, 40.85], // Grund der Mutsu-Bucht
  [141.15, 41.15],
  [140.9, 41.55], // Kap Oma, die Nordspitze Honshus
];

/** Die Pazifikküste, Nord: Kap Oma → nördliches Kanto. */
const HONSHU_PAZIFIK_NORD = [
  [140.9, 41.55],
  [141.4, 41.4],
  [141.45, 40.9],
  [141.55, 40.5], // Hachinohe
  [141.9, 39.9],
  [142.05, 39.55], // Kap Todo, der Ostpunkt Honshus
  [141.85, 39.0],
  [141.6, 38.4],
  [141.05, 38.25], // Sendai
  [140.95, 37.8],
  [141.0, 37.0], // Onahama
  [140.75, 36.7],
  [140.6, 36.4],
];

/** Die Pazifikküste, Süd: nördliches Kanto → Inlandsee → Shimonoseki. */
const HONSHU_PAZIFIK_SUED = [
  [140.6, 36.4],
  [140.6, 35.9],
  [140.87, 35.72], // Kap Inubo, der Ostpunkt der Kanto-Ebene
  [140.3, 35.35],
  [140.4, 35.1],
  [139.9, 34.9], // Kap Nojima, Südspitze der Halbinsel Boso
  [139.8, 35.3],
  [139.85, 35.65], // Grund der Bucht von Tokio — hier liegt Edo
  [139.6, 35.4],
  [139.7, 35.15], // Halbinsel Miura
  [139.2, 35.25],
  [139.15, 34.95],
  [138.85, 34.6], // Kap Irozaki, Südspitze der Halbinsel Izu
  [138.75, 35.0],
  [138.5, 34.7],
  [138.2, 34.6], // Omaezaki
  [137.5, 34.65],
  [136.95, 34.65], // Bucht von Ise
  [136.85, 34.3], // Kap Daio
  [136.3, 34.2],
  [136.0, 33.6],
  [135.76, 33.45], // Kap Shionomisaki, Südspitze der Halbinsel Kii
  [135.2, 33.9],
  [135.1, 34.3],
  [135.4, 34.65], // Bucht von Osaka
  [135.2, 34.7], // Kobe
  [134.6, 34.75],
  [133.9, 34.5], // Okayama
  [133.0, 34.4],
  [132.5, 34.35], // Hiroshima
  [132.0, 34.1],
  [131.4, 33.95],
];

const HONSHU = verbinde(
  HONSHU_JAPANMEER_WEST,
  HONSHU_JAPANMEER_NORD,
  HONSHU_PAZIFIK_NORD,
  HONSHU_PAZIFIK_SUED,
);

// ---------------------------------------------------------------------------
// Die übrigen Inseln
// ---------------------------------------------------------------------------

/** Kyushu — die westlichste der großen Inseln und das Tor zum Festland. */
const KYUSHU = [
  [130.9, 33.9], // Moji, gegenüber von Shimonoseki
  [131.65, 33.7], // Halbinsel Kunisaki
  [131.9, 33.3],
  [131.65, 33.25], // Bucht von Beppu
  [131.9, 32.9],
  [132.0, 32.75], // Kap Tsurumi, der Ostpunkt
  [131.75, 32.5],
  [131.6, 32.1],
  [131.45, 31.75], // Miyazaki
  [131.35, 31.35], // Kap Toi
  [131.05, 31.4],
  [130.85, 31.15], // Halbinsel Osumi
  [130.67, 31.0], // Kap Sata, die Südspitze
  [130.6, 31.35],
  [130.25, 31.25], // Halbinsel Satsuma
  [130.15, 31.6],
  [130.35, 32.0],
  [130.1, 32.25],
  [130.25, 32.6],
  [129.8, 32.6],
  [129.87, 32.75], // Nagasaki
  [129.65, 33.05],
  [129.75, 33.35], // Sasebo
  [130.0, 33.5], // Karatsu
  [130.4, 33.6], // Bucht von Hakata — hier landeten beide Mongolenflotten
  [130.65, 33.85],
];

/** Shikoku — die kleinste der vier Hauptinseln, südlich der Inlandsee. */
const SHIKOKU = [
  [134.05, 34.35], // Takamatsu an der Inlandsee
  [134.6, 34.2],
  [134.75, 33.85],
  [134.5, 33.5],
  [134.18, 33.25], // Kap Muroto
  [133.7, 33.5],
  [133.3, 33.3],
  [133.02, 32.72], // Kap Ashizuri, die Südspitze
  [132.7, 33.0],
  [132.5, 33.3],
  [132.35, 33.5],
  [132.0, 33.35], // Kap Sada, die Westspitze
  [132.5, 33.7],
  [132.75, 33.85], // Matsuyama
  [133.4, 34.2],
];

/**
 * Hokkaido — bis ins 19. Jahrhundert „Ezo", das Land der Ainu.
 *
 * Auf den Karten der Tokugawa-Zeit ist es kaum mehr als ein Umriss: Japan
 * hielt dort nur den Südzipfel. Deshalb taucht die Insel in den Phasen erst
 * ganz am Ende vollständig auf.
 */
const HOKKAIDO = [
  [140.2, 41.4], // Kap Shirakami, die Südspitze gegenüber Honshu
  [140.75, 41.8], // Hakodate
  [141.5, 42.3],
  [141.8, 42.6],
  [142.5, 42.3],
  [143.25, 41.93], // Kap Erimo
  [143.7, 42.3],
  [144.4, 42.95], // Kushiro
  [145.3, 43.2],
  [145.8, 43.4], // Kap Nosappu bei Nemuro, der Ostpunkt Japans
  [145.2, 43.8],
  [145.3, 44.35], // Halbinsel Shiretoko
  [144.3, 44.0], // Abashiri
  [143.3, 44.3],
  [142.5, 44.8],
  [141.94, 45.52], // Kap Soya, die Nordspitze
  [141.6, 45.2],
  [141.7, 44.3],
  [141.3, 43.6],
  [141.0, 43.2], // Otaru
  [140.35, 43.33], // Kap Kamui
  [140.5, 42.9],
  [140.0, 42.6],
  [139.85, 42.15],
  [140.1, 41.75],
];

/**
 * Tsushima — zwei Inseln in der Meerenge zwischen Korea und Kyushu.
 *
 * Wer vom Festland nach Japan wollte, kam hier vorbei: die Händler, die
 * Gesandten, und 1274 die Mongolen.
 */
const TSUSHIMA = [
  [129.2, 34.7],
  [129.5, 34.6],
  [129.4, 34.25],
  [129.35, 34.05],
  [129.2, 34.1],
  [129.25, 34.35],
];

/** Iki — der zweite Trittstein auf demselben Weg. */
const IKI = [
  [129.65, 33.85],
  [129.8, 33.8],
  [129.75, 33.7],
  [129.65, 33.72],
];

/** Sado — die Insel vor Niigata, jahrhundertelang Verbannungsort. */
const SADO = [
  [138.25, 38.35],
  [138.55, 38.2],
  [138.5, 37.85],
  [138.2, 37.8],
  [138.0, 38.0],
];

/** Jeju vor der Südküste Koreas. */
const JEJU = [
  [126.2, 33.5],
  [126.9, 33.5],
  [126.95, 33.25],
  [126.3, 33.2],
];

// ---------------------------------------------------------------------------
// Binnengewässer und Flüsse
//
// Auf dieser Karte sind sie Beiwerk — die Geschichte spielt auf dem Meer.
// Sie stehen trotzdem da, weil sie die Orte einordnen: Der Biwa-See liegt
// zwischen Kyoto und der Ostküste, der Tone durchzieht die Ebene um Edo,
// der Yalu markiert Koreas Nordgrenze.
// ---------------------------------------------------------------------------

/** Der Biwa-See — der größte See Japans, gleich östlich von Kyoto. */
const BIWA = [
  [136.1, 35.5],
  [136.25, 35.35],
  [136.1, 35.05],
  [135.95, 34.95],
  [135.9, 35.2],
  [135.95, 35.4],
];

/** Der Yalu — Grenzfluss zwischen Korea und dem Festland. */
const YALU = [
  [128.1, 41.9],
  [127.0, 41.5],
  [126.0, 41.1],
  [125.0, 40.4],
  [124.4, 40.0],
];

/** Der Han — er fließt durch Seoul und mündet nahe Incheon. */
const HAN_FLUSS = [
  [128.3, 37.5],
  [127.6, 37.4],
  [127.2, 37.5],
  [126.95, 37.55],
  [126.6, 37.75],
];

/** Der Shinano — der längste Fluss Japans, Mündung bei Niigata. */
const SHINANO = [
  [138.2, 36.2],
  [138.4, 36.7],
  [138.6, 37.1],
  [139.0, 37.6],
  [139.05, 37.9],
];

/** Der Tone — er ordnet die Kanto-Ebene, in der Edo liegt. */
const TONE = [
  [139.1, 36.8],
  [139.7, 36.2],
  [140.3, 35.9],
  [140.85, 35.73],
];

/** Der Yodo — vom Biwa-See an Kyoto vorbei in die Bucht von Osaka. */
const YODO = [
  [136.0, 35.0],
  [135.7, 34.9],
  [135.45, 34.75],
  [135.4, 34.65],
];

// ---------------------------------------------------------------------------
// Die Phasen — dieselben Inseln, vier Zeitpunkte
// ---------------------------------------------------------------------------

/**
 * Um 600: die Nordgrenze der Yamato-Herrschaft.
 *
 * Sie ist keine Linie im Gelände, sondern eine Schätzung: Nördlich davon
 * lebten die Emishi, die erst über Jahrhunderte unterworfen wurden. Auf einer
 * Karte muss man sich entscheiden — hier liegt die Grenze quer durch die
 * Mitte Honshus, von Niigata zur Pazifikküste.
 */
const YAMATO_GRENZE = [
  [139.05, 37.9],
  [139.6, 37.2],
  [140.2, 36.8],
  [140.6, 36.4],
];

/** Um 600: das Kernland der Yamato-Herrscher auf Honschu. */
const YAMATO_HONSHU = verbinde(
  HONSHU_JAPANMEER_WEST,
  YAMATO_GRENZE,
  HONSHU_PAZIFIK_SUED,
);

/**
 * Matsumae — der einzige japanische Vorposten auf Ezo (Hokkaido).
 *
 * Ein Lehen an der Südspitze, mehr nicht: Der Rest der Insel gehörte den
 * Ainu, und Japan sah ihn als Ausland. Auch das gehört zur Abschottung.
 */
const MATSUMAE = [
  [140.2, 41.4],
  [140.75, 41.8],
  [141.1, 42.05],
  [140.6, 42.15],
  [140.0, 42.0],
  [139.85, 42.15],
  [140.1, 41.75],
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
    // Das Meer ist der Untergrund; alles Land liegt darüber. Auf dieser Karte
    // ist das mehr als eine Zeichenregel — das Meer ist die Hauptfigur.
    {
      art: 'grund',
      d: `M 0 0 H ${geo.breite} V ${geo.hoehe} H 0 Z`,
      fill: KARTENFARBEN.meer,
      stroke: 'none',
      strokeWidth: 0,
    },
    land(FESTLAND),
    land(HONSHU),
    land(KYUSHU),
    land(SHIKOKU),
    land(HOKKAIDO),
    land(TSUSHIMA),
    land(IKI),
    land(SADO),
    land(JEJU),
    wasser(BIWA),
    fluss(YALU),
    fluss(HAN_FLUSS),
    fluss(SHINANO),
    fluss(TONE),
    fluss(YODO),
  ],

  phasen: [
    {
      id: 'yamato',
      label: 'um 600',
      hinweis:
        'Die Yamato-Herrscher regieren von der Ebene um Nara aus: Honschus Süden und Mitte, Shikoku, Kyushu. Der Norden gehört den Emishi, Ezo im Nordosten liegt außerhalb der Welt. Alles Neue kommt über See — Schrift, Buddhismus, Verwaltung, alles aus China und über Korea.',
      flaechen: [
        gebiet('Das Kernland der Yamato-Herrscher', YAMATO_HONSHU),
        gebiet('Shikoku', SHIKOKU),
        gebiet('Kyushu — das Tor zum Festland', KYUSHU),
      ],
    },
    {
      id: 'mongolen',
      label: '1274 und 1281',
      hinweis:
        'Kublai Khan, der Großkhan aus dem Kapitel zuvor, will auch Japan. Zweimal setzt eine Flotte von Korea aus über, 1281 zusätzlich eine zweite aus China. Zweimal zerschlägt ein Taifun die Schiffe. Japan nennt diese Stürme „Kamikaze" — göttlicher Wind — und zieht daraus einen Schluss, der bis 1945 nachwirkt.',
      flaechen: [
        gebiet('Japan unter der Militärregierung von Kamakura', HONSHU),
        gebiet('Shikoku', SHIKOKU),
        gebiet('Kyushu — hier landeten beide Flotten', KYUSHU),
        gebiet('Goryeo — Korea unter mongolischer Oberhoheit', GORYEO),
      ],
    },
    {
      id: 'sakoku',
      label: 'um 1700',
      hinweis:
        'Ganz Japan unter einem Shogun: Die Tokugawa regieren von Edo aus, der Kaiser bleibt in Kyoto ohne Macht. Nach außen ist das Land seit 1639 geschlossen — keine Ausreise, keine fremden Schiffe. Nur auf der Insel Dejima bei Nagasaki bleibt ein Fenster von 120 mal 75 Metern offen.',
      flaechen: [
        gebiet('Das Reich der Tokugawa-Shogune', HONSHU),
        gebiet('Shikoku', SHIKOKU),
        gebiet('Kyushu', KYUSHU),
        gebiet('Sado — die Goldinsel des Shogunats', SADO),
        gebiet('Matsumae — der Vorposten auf Ezo', MATSUMAE),
      ],
    },
    {
      id: 'meiji',
      label: '1868',
      hinweis:
        'Fünfzehn Jahre nach Perrys Ankunft ist das Shogunat abgeschafft, der Kaiser zurück an der Spitze, die Hauptstadt heißt jetzt Tokio. Die Flächen ändern sich kaum — Ezo wird als Hokkaido einverleibt —, aber das Land ist ein anderes: Es baut Eisenbahnen, Fabriken, eine Verfassung und eine Flotte.',
      flaechen: [
        gebiet('Das Kaiserreich Japan', HONSHU),
        gebiet('Shikoku', SHIKOKU),
        gebiet('Kyushu', KYUSHU),
        gebiet('Sado', SADO),
        gebiet('Hokkaido — das ehemalige Ezo', HOKKAIDO),
      ],
    },
  ],

  punkte: [
    // Nara steht vor Kyoto, weil beide Städte nur rund 35 Kilometer
    // auseinanderliegen: Auf dieser Karte sind das etwa zehn Bildpunkte. Wer
    // sie antippt, trifft knapp — das ist der Preis dafür, dass die Karte
    // echte Koordinaten benutzt und nichts auseinanderschiebt.
    {
      id: 'nara',
      name: 'Nara',
      typ: 'stadt',
      ...xy(135.83, 34.69),
      text: [
        'Die erste feste Hauptstadt Japans, ab 710. Vorher zog der Hof nach dem',
        'Tod jedes Herrschers um — ein Palast war eher ein Lager als eine Stadt.',
        'Nara wurde am Reißbrett angelegt, als Schachbrett aus geraden Straßen,',
        'und das Vorbild stand 3 000 Kilometer weiter westlich: Chang’an, die',
        'Hauptstadt der Tang, die du auf der China-Karte antippen kannst. Japan',
        'übernahm in diesen Jahrzehnten die chinesische Schrift, den Buddhismus,',
        'den Kalender, das Beamtenwesen — und baute daraus etwas Eigenes. Nach',
        'nur 74 Jahren zog der Hof schon wieder weiter: Die Klöster von Nara',
        'waren zu mächtig geworden.',
      ].join(' '),
    },
    {
      id: 'kyoto',
      name: 'Kyoto',
      typ: 'stadt',
      ...xy(135.77, 35.01),
      text: [
        'Von 794 bis 1868 die Stadt des Kaisers — über tausend Jahre lang, ohne',
        'Unterbrechung. Das ist der eine Teil der Geschichte. Der andere: Die',
        'meiste Zeit davon hatte der Kaiser hier keine Macht. Sie lag bei',
        'Regenten, dann bei Shogunen in Kamakura, später bei den Tokugawa in',
        'Edo. Der Kaiser blieb Priester und Symbol, ein Herrscher, in dessen',
        'Namen andere regierten. Genau deshalb konnte 1868 etwas gelingen, das',
        'anderswo undenkbar wäre: Man schaffte die tatsächliche Regierung ab und',
        'holte den Kaiser hervor, der die ganze Zeit dagewesen war. Japans',
        'Kaiserhaus ist die älteste ununterbrochene Monarchie der Welt.',
      ].join(' '),
    },
    {
      id: 'kamakura',
      name: 'Kamakura',
      typ: 'stadt',
      ...xy(139.55, 35.32),
      text: [
        'Hier begann 1185 etwas Neues: die erste Militärregierung Japans. Der',
        'Sieger eines langen Bürgerkriegs, Minamoto no Yoritomo, ließ sich vom',
        'Kaiser zum Shogun ernennen und regierte von diesem kleinen Küstenort',
        'aus — weit weg vom Hof in Kyoto, geschützt von Bergen und Meer. Damit',
        'entstand die Doppelherrschaft, die Japan fast 700 Jahre prägte: ein',
        'Kaiser mit Würde und ein Shogun mit Truppen. Die Kriegerschicht dieser',
        'Zeit nennen wir Samurai. Als 1274 und 1281 die Mongolen kamen, war es',
        'diese Regierung, die die Verteidigung organisierte.',
      ].join(' '),
    },
    {
      id: 'edo',
      name: 'Edo (Tokio)',
      typ: 'stadt',
      ...xy(139.77, 35.68),
      text: [
        'Aus einem Fischerdorf machten die Tokugawa ab 1603 die Hauptstadt ihres',
        'Shogunats — und um 1720 vermutlich die größte Stadt der Welt mit über',
        'einer Million Menschen, mehr als London oder Paris. Ihr Trick zur',
        'Machtsicherung hieß „Anwesenheitspflicht": Jeder Landesfürst musste',
        'jedes zweite Jahr in Edo verbringen, und seine Familie blieb dauerhaft',
        'dort. Wer aufbegehren wollte, riskierte seine Frau und seine Kinder.',
        'Nebenbei entstand so ein Netz gepflegter Straßen, ein reges Reisen und',
        'eine Stadtkultur mit Theater, Farbholzschnitten und Buchdruck. 1868',
        'wurde Edo in Tokio umbenannt: „östliche Hauptstadt".',
      ].join(' '),
    },
    {
      id: 'dejima',
      name: 'Dejima bei Nagasaki',
      typ: 'ereignis',
      ...xy(129.87, 32.75),
      text: [
        'Das Fenster, das während der Abschottung offen blieb: eine künstliche',
        'Insel im Hafen von Nagasaki, fächerförmig, rund 120 mal 75 Meter —',
        'kleiner als zwei Fußballfelder. Hier durften ausschließlich Niederländer',
        'wohnen, etwa zwanzig Männer, streng bewacht, und die Brücke ans Festland',
        'durften sie nur mit Erlaubnis überqueren. Einmal im Jahr reiste ihr',
        'Vorsteher nach Edo, um dem Shogun Bericht zu erstatten. Über dieses',
        'Nadelöhr erfuhr Japan von europäischer Medizin, Astronomie und Technik —',
        'die japanischen Gelehrten nannten dieses Wissen „Rangaku",',
        'Hollandkunde. Und über dasselbe Nadelöhr erfuhr Europa fast alles, was',
        'es 200 Jahre lang über Japan zu wissen glaubte.',
      ].join(' '),
    },
    {
      id: 'tsushima',
      name: 'Tsushima',
      typ: 'ereignis',
      ...xy(129.3, 34.3),
      text: [
        'Die Trittsteine zwischen Korea und Japan: Von Busan sind es rund 50',
        'Kilometer nach Tsushima, von dort über Iki weitere 100 nach Kyushu. Auf',
        'diesem Weg kamen Reis, Bronze, Schrift und Buddhismus nach Japan — und',
        'am 5. Oktober 1274 die mongolische Flotte. Die wenigen hundert',
        'Verteidiger der Insel wurden überrannt; ihr Anführer So Sukekuni fiel.',
        'Tsushima war auch danach der Ort, an dem Japans Abschottung nie ganz',
        'galt: Das Fürstenhaus So handelte während der ganzen Sakoku-Zeit mit',
        'Korea weiter, mit Erlaubnis des Shoguns.',
      ].join(' '),
    },
  ],

  bewegungen: [
    {
      id: 'kulturweg',
      name: 'Der Weg des Wissens vom Festland',
      ...weg([121.9, 31.4], [130.4, 33.6]),
      ueber: [p(124.0, 32.6), p(126.6, 33.7), p(128.9, 34.2)],
      text: [
        'Lange bevor Europa von Japan wusste, hatte Japan schon einen Nachbarn:',
        'China. Über das Ostchinesische und das Gelbe Meer kamen — meist über',
        'Korea — der Nassreisanbau, die Bronze, das Eisen, die Schriftzeichen,',
        'der Buddhismus, das Beamtenwesen und der Kalender. Zwischen 630 und 838',
        'schickte der japanische Hof rund zwanzig große Gesandtschaften nach',
        'China; viele Schiffe kamen nie an. Wichtig ist, was Japan daraus machte:',
        'Es übernahm nicht einfach, es wählte aus. Die chinesischen Schriftzeichen',
        'blieben, aber Japan erfand zwei eigene Silbenschriften dazu. Das',
        'Beamtenprüfungswesen dagegen, das Herzstück der chinesischen Verwaltung,',
        'ließ man liegen — in Japan blieben die Ämter beim Adel.',
      ].join(' '),
    },
    {
      id: 'mongolen-1274',
      name: 'Die erste Mongolen-Invasion 1274',
      ...weg([128.9, 35.05], [130.4, 33.6]),
      ueber: [p(129.35, 34.4), p(129.8, 33.85)],
      text: [
        'Kublai Khan hatte Japan mehrfach schriftlich aufgefordert, sich zu',
        'unterwerfen. Kamakura antwortete nicht einmal. Im Herbst 1274 setzte',
        'eine Flotte von etwa 900 Schiffen mit rund 30 000 Mann von Korea aus',
        'über — Mongolen, Chinesen und zwangsweise ausgehobene Koreaner. Tsushima',
        'und Iki fielen, dann landete das Heer in der Bucht von Hakata. Die',
        'Samurai kämpften nach ihrer Sitte in Einzelduellen und trafen auf',
        'geschlossene Formationen, Sprengkörper und vergiftete Pfeile. Am Abend',
        'zogen sich die Angreifer auf ihre Schiffe zurück — und in der Nacht kam',
        'ein Sturm. Ein großer Teil der Flotte ging unter.',
      ].join(' '),
    },
    {
      id: 'mongolen-1281',
      name: 'Die zweite Invasion 1281 — die Flotte aus China',
      ...weg([121.7, 29.8], [130.3, 33.5]),
      ueber: [p(124.5, 30.6), p(127.5, 31.8)],
      text: [
        'Sieben Jahre später kam Kublai wieder, diesmal mit zwei Flotten: eine',
        'aus Korea, eine weit größere aus dem eroberten Südchina. Zusammen',
        'vielleicht 4 400 Schiffe und 140 000 Mann — das größte Flottenunternehmen',
        'der Welt bis zur Landung in der Normandie 1944. Doch Japan hatte',
        'gelernt: An der Bucht von Hakata stand inzwischen eine zwei Meter hohe',
        'Steinmauer, und die Verteidiger griffen die Schiffe nachts mit kleinen',
        'Booten an. Wochenlang kamen die Angreifer nicht an Land. Dann, am 15.',
        'August 1281, traf ein Taifun die eng zusammenliegende Flotte. Sie wurde',
        'fast vollständig vernichtet.',
      ].join(' '),
    },
    {
      id: 'perry-1853',
      name: 'Perrys schwarze Schiffe 1853',
      ...weg([145.5, 31.0], [139.72, 35.25]),
      ueber: [p(143.0, 32.6), p(141.0, 34.4)],
      text: [
        'Am 8. Juli 1853 liefen vier Kriegsschiffe der Vereinigten Staaten in die',
        'Bucht von Tokio ein, zwei davon Dampfer mit schwarzen Rümpfen und',
        'rauchenden Schloten. Kommodore Matthew Perry kam über die Ryukyu-Inseln',
        'von Süden, ankerte vor Uraga und weigerte sich, nach Nagasaki',
        'weiterzufahren, wie es die Vorschrift verlangte. Er ließ Salutschüsse',
        'abfeuern, überreichte einen Brief seines Präsidenten und kündigte an,',
        'im nächsten Jahr mit mehr Schiffen die Antwort zu holen. Er kam 1854 mit',
        'neun. Japan öffnete zwei Häfen — und begann eine Auseinandersetzung mit',
        'sich selbst, an deren Ende 1868 das Shogunat abgeschafft war.',
      ].join(' '),
    },
  ],

  beschriftungen: [
    { text: 'Japan', art: 'land', ...xy(138.3, 36.3) },
    { text: 'Honshu', art: 'land', ...xy(140.6, 39.4) },
    { text: 'Kyushu', art: 'land', ...xy(131.0, 32.4) },
    { text: 'Shikoku', art: 'land', ...xy(133.5, 33.75) },
    { text: 'Hokkaido', art: 'land', ...xy(142.8, 43.6) },
    { text: 'Korea', art: 'land', ...xy(127.6, 37.2) },
    { text: 'China', art: 'land', ...xy(120.6, 34.6) },
    { text: 'Gelbes Meer', art: 'meer', ...xy(123.5, 35.6) },
    { text: 'Japanisches Meer', art: 'meer', ...xy(134.5, 39.6) },
    { text: 'Ostchinesisches Meer', art: 'meer', ...xy(126.5, 30.0) },
    { text: 'Pazifik', art: 'meer', ...xy(143.5, 36.0) },
  ],
};

module.exports = karte;
