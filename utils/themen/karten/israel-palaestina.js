// Die Karte zum Thema „Israel und Palästina — ein Land, zwei Narrative".
//
// Aufgebaut wie die vier Karten davor: Die Küstenlinien stehen als echte
// Längen-/Breitengrade `[lon, lat]` im Repo, utils/karte-geo.js rechnet sie in
// SVG-Koordinaten um. Wer einen Punkt anzweifelt, schlägt ihn im Atlas nach:
// `[34.99, 32.82]` ist Haifa am Fuß des Karmel, `[35.10, 33.09]` Rosch haNikra
// an der libanesischen Grenze, `[32.55, 29.97]` Sues am Nordende des Golfs.
//
// Diese Karte ist die feinste der App: 140 SVG-Einheiten je Längengrad, mehr
// als fünfmal so fein wie die Eurasien-Karte des Mongolen-Kapitels. Das muss
// so sein — es geht um ein Land, das man an einem Tag durchqueren kann, und um
// Linien, die nur wenige Kilometer auseinanderliegen. Der Preis dafür ist das
// hochformatigste Bild der App (700 × rund 905): Die Levante ist ein schmaler
// Streifen zwischen Meer und Wüste, und genau so sieht sie hier auch aus.
//
// WICHTIG — was diese Karte ist und was sie nicht ist:
// Sie zeigt DREI HISTORISCHE ZUSTÄNDE (Teilungsplan 1947, Waffenstillstands-
// linien 1949, Lage nach dem Sechstagekrieg 1967), nicht „die" Grenzen von
// heute und keine Aussage darüber, wie sie sein sollten. Jede Phase trägt ihre
// Jahreszahl im Umschalter und einen Hinweis, der sagt, was man gerade sieht.
// Die Flächen sind nach den historischen Karten vereinfacht gezeichnet — sie
// geben den Verlauf wieder, nicht jedes Dorf. Beschriftungen und Punkttexte
// sind bewusst nüchtern gehalten: Die Bewertung gehört in die Perspektiven und
// am Ende zu den Lernenden, nicht auf die Karte.
//
// Reine Daten und Rechnung — keine UI-Importe (Architektur-Regel).

const { KARTENFARBEN, erstelleProjektion, verbinde } = require('../../karte-geo');

// ---------------------------------------------------------------------------
// Ausschnitt und Projektion
// ---------------------------------------------------------------------------

/**
 * Der Kartenausschnitt: vom Sueskanal (32° O) bis in die jordanisch-syrische
 * Wüste (37° O), vom Golf von Akaba (29° N) bis nördlich von Tripoli (34,5° N).
 *
 * Der Rahmen ist so gewählt, dass alle Nachbarn im Bild sind, die in der
 * Geschichte dieses Landes vorkommen: Ägypten und der Sinai im Südwesten,
 * Jordanien im Osten, Libanon und Syrien im Norden. Nach Süden reicht er bis
 * Eilat und Akaba — die beiden Städte liegen nebeneinander am selben Golf und
 * gehören zu zwei Staaten.
 */
const RAHMEN = { minLon: 32, maxLon: 37, minLat: 29, maxLat: 34.5, breite: 700 };

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
// Die Küsten
// ---------------------------------------------------------------------------

/**
 * Die Mittelmeerküste vom Nildelta bis an die syrische Küste.
 *
 * Der erste und der letzte Punkt liegen absichtlich außerhalb des Ausschnitts,
 * damit das Land über den Bildrand hinausläuft, statt dort abzuknicken.
 */
const KUESTE_MITTELMEER = [
  [31.30, 31.40], // Nildelta — schon westlich des Bildrands
  [31.85, 31.42], // Damiette
  [32.10, 31.35],
  [32.30, 31.27], // Port Said, das Nordende des Sueskanals
  [32.70, 31.15],
  [33.10, 31.10], // die Bardawil-Lagune im Nordsinai
  [33.45, 31.12],
  [33.78, 31.13], // El Arisch
  [34.05, 31.20],
  [34.25, 31.32], // Rafah — hier stoßen Ägypten und der Gazastreifen aneinander
  [34.33, 31.38],
  [34.42, 31.45],
  [34.47, 31.52], // Gaza
  [34.52, 31.60],
  [34.56, 31.67], // Aschkelon
  [34.61, 31.74],
  [34.65, 31.80], // Aschdod
  [34.70, 31.92],
  [34.75, 32.08], // Tel Aviv-Jaffa
  [34.80, 32.20],
  [34.86, 32.33], // Netanja
  [34.89, 32.50], // Caesarea
  [34.95, 32.72], // Atlit
  [34.99, 32.82], // Haifa am Fuß des Karmel
  [35.07, 32.92], // Akko
  [35.10, 33.09], // Rosch haNikra — die Grenze zum Libanon
  [35.20, 33.27], // Tyros
  [35.37, 33.56], // Sidon
  [35.50, 33.90], // Beirut
  [35.65, 34.12], // Byblos
  [35.83, 34.45], // Tripoli
  [35.90, 34.90], // schon über dem oberen Bildrand
  [35.78, 35.52], // Latakia
  [36.10, 36.20],
];

/**
 * Das Ostufer des Golfs von Akaba, von Süden herauf bis zur Stadt Akaba.
 *
 * Der Golf ist an dieser Stelle keine zwanzig Kilometer breit. Am Nordende
 * liegen Eilat und Akaba direkt nebeneinander — Israel und Jordanien teilen
 * sich einen Strand von wenigen Kilometern Länge.
 */
const GOLF_AKABA_OST = [
  [34.72, 28.30], // unterhalb des Bildrands
  [34.80, 28.60],
  [34.90, 29.00],
  [34.95, 29.30],
  [35.01, 29.51], // Akaba
];

/** Das Nordende des Golfs: von Akaba hinüber nach Eilat und weiter nach Taba. */
const GOLF_AKABA_KOPF = [
  [35.01, 29.51], // Akaba
  [34.96, 29.55], // Eilat
  [34.90, 29.49], // Taba, schon in Ägypten
];

/** Das Westufer des Golfs von Akaba — die Ostküste des Sinai. */
const GOLF_AKABA_WEST = [
  [34.90, 29.49], // Taba
  [34.80, 29.20],
  [34.68, 28.85],
  [34.52, 28.30], // unterhalb des Bildrands
];

/** Das Ostufer des Golfs von Sues — die Westküste des Sinai. */
const GOLF_SUES_OST = [
  [33.35, 28.30], // unterhalb des Bildrands
  [33.15, 28.95],
  [32.88, 29.50],
  [32.58, 29.93], // Sues, am Nordende des Golfs
];

/**
 * Das Westufer des Golfs von Sues — afrikanische Seite.
 *
 * Zwischen den beiden Ufern liegt am Nordende die Landenge von Sues: der
 * schmale Streifen, der Afrika und Asien verbindet. Der Kanal, der ihn seit
 * 1869 durchschneidet, steht weiter unten als eigene Linie — auf diesem
 * Maßstab wäre er als Wasserfläche nur ein Strich von fünf Bildpunkten.
 */
const GOLF_SUES_WEST = [
  [32.50, 29.95], // gegenüber von Sues
  [32.45, 29.60],
  [32.62, 29.10],
  [32.85, 28.60],
  [32.98, 28.30], // unterhalb des Bildrands
];

/**
 * Die eine große Landmasse: Ägypten, der Sinai, die Levante bis Syrien.
 *
 * Anders als bei der Japan-Karte hängt hier alles zusammen — Afrika und Asien
 * treffen sich an der Landenge von Sues. Ausgespart bleiben nur die beiden
 * Meeresarme, die von Süden ins Bild ragen: der Golf von Sues und der Golf von
 * Akaba. Der Rückweg des Umrisses läuft weit außerhalb des Bildes.
 */
const LANDMASSE = verbinde(
  KUESTE_MITTELMEER,
  [
    [38.50, 36.50],
    [38.50, 28.30],
  ],
  GOLF_AKABA_OST,
  GOLF_AKABA_KOPF,
  GOLF_AKABA_WEST,
  GOLF_SUES_OST,
  GOLF_SUES_WEST,
  [
    [30.80, 28.30],
    [30.80, 31.20],
    [31.10, 31.38],
  ],
);

// ---------------------------------------------------------------------------
// Binnengewässer und Flüsse
//
// Sie sind hier kein Beiwerk. Das Tote Meer ist mit rund 430 Metern unter dem
// Meeresspiegel der tiefste Punkt der Erdoberfläche, und der Jordan ist die
// Linie, an der sich fast alle Grenzen dieser Geschichte orientieren.
// ---------------------------------------------------------------------------

/**
 * Das Tote Meer, in der Ausdehnung, die es im 20. Jahrhundert hatte.
 *
 * Es ist seither stark geschrumpft — das südliche Becken ist heute weitgehend
 * trocken und wird von Verdunstungsbecken eingenommen. Weil diese Karte die
 * Jahre 1947 bis 1967 zeigt, steht hier die damalige Form.
 */
const TOTES_MEER = [
  [35.48, 31.78], // Nordende, hier mündet der Jordan
  [35.55, 31.73],
  [35.58, 31.55],
  [35.57, 31.38],
  [35.55, 31.22], // die Halbinsel Lisan schnürt den See ein
  [35.58, 31.08],
  [35.52, 30.98], // Südende
  [35.44, 31.02],
  [35.42, 31.16],
  [35.38, 31.29], // unterhalb von Masada
  [35.40, 31.46], // En Gedi
  [35.44, 31.62],
];

/** Der See Genezareth — Süßwasser, 210 Meter unter dem Meeresspiegel. */
const SEE_GENEZARETH = [
  [35.57, 32.88], // Nordende, hier mündet der Jordan ein
  [35.63, 32.85],
  [35.65, 32.78],
  [35.62, 32.72],
  [35.55, 32.70], // Südende, hier tritt der Jordan wieder aus
  [35.52, 32.76], // Tiberias
  [35.53, 32.84],
];

/** Der obere Jordan: aus dem Hulatal in den See Genezareth. */
const JORDAN_OBEN = [
  [35.62, 33.25],
  [35.60, 33.10],
  [35.58, 32.95],
  [35.57, 32.88],
];

/** Der untere Jordan: vom See Genezareth ins Tote Meer. */
const JORDAN_UNTEN = [
  [35.55, 32.70],
  [35.57, 32.60],
  [35.53, 32.45],
  [35.55, 32.30],
  [35.52, 32.15],
  [35.55, 32.00],
  [35.53, 31.85],
  [35.48, 31.78],
];

/** Der Jarmuk — er kommt aus dem Osten und trifft südlich des Sees ein. */
const JARMUK = [
  [36.30, 32.72],
  [35.95, 32.66],
  [35.72, 32.70],
  [35.57, 32.66],
];

/** Der Litani im Libanon, mit der Mündung nördlich von Tyros. */
const LITANI = [
  [36.10, 33.88],
  [35.75, 33.55],
  [35.45, 33.38],
  [35.25, 33.34],
];

/**
 * Der Sueskanal — seit 1869 die Abkürzung zwischen Mittelmeer und Rotem Meer.
 *
 * Er steht hier als Linie und nicht als Wasserfläche: Er ist rund 200 Meter
 * breit, auf dieser Karte also weniger als ein Bildpunkt. Auf jeder guten
 * Schulatlaskarte wird er genauso gezeichnet.
 */
const SUEZKANAL = [
  [32.30, 31.27], // Port Said
  [32.32, 31.00],
  [32.35, 30.70],
  [32.40, 30.30], // die Bitterseen
  [32.50, 30.05],
  [32.55, 29.97], // Sues
];

// ---------------------------------------------------------------------------
// Phase 1947 — der Teilungsplan der Vereinten Nationen (Resolution 181)
//
// Der Plan teilte das britische Mandatsgebiet in einen jüdischen und einen
// arabischen Staat, die sich wie zwei ineinandergreifende Hände über je drei
// Gebiete verteilten; Jerusalem und Bethlehem sollten als „corpus separatum"
// international verwaltet werden. Die Flächen unten sind vereinfacht — sie
// geben den Verlauf wieder, nicht jede Ortschaft.
// ---------------------------------------------------------------------------

/** Jüdischer Staat, Teil 1: Ostgaliläa mit dem Hulatal und dem See Genezareth. */
const PLAN_JUED_OSTGALILAEA = [
  [35.30, 33.12],
  [35.40, 33.27],
  [35.57, 33.28], // die libanesische Grenze bei Metulla
  [35.68, 33.10],
  [35.66, 32.90],
  [35.62, 32.72],
  [35.57, 32.58],
  [35.45, 32.50], // das Tal von Beisan
  [35.25, 32.55],
  [35.15, 32.62], // die Jesreel-Ebene
  [35.25, 32.70],
  [35.35, 32.85],
  [35.32, 33.00],
];

/** Jüdischer Staat, Teil 2: die Küstenebene von Haifa bis nördlich Isdud. */
const PLAN_JUED_KUESTE = [
  [34.99, 32.82], // Haifa
  [35.12, 32.75],
  [35.16, 32.62],
  [35.10, 32.48],
  [35.02, 32.34],
  [34.98, 32.20],
  [34.95, 32.04],
  [34.97, 31.92],
  [34.90, 31.80],
  [34.78, 31.76],
  [34.66, 31.83], // die Küste nördlich von Isdud
  [34.70, 31.92],
  [34.75, 32.08],
  [34.80, 32.20],
  [34.86, 32.33],
  [34.89, 32.50],
  [34.95, 32.72],
];

/** Jüdischer Staat, Teil 3: der Negev bis hinunter nach Umm Raschrasch (Eilat). */
const PLAN_JUED_NEGEV = [
  [34.42, 31.38],
  [34.75, 31.42],
  [35.05, 31.38],
  [35.25, 31.32],
  [35.38, 31.20], // das Westufer des Toten Meeres
  [35.42, 31.05],
  [35.30, 30.70],
  [35.15, 30.30], // das Wadi Arava
  [35.02, 29.90],
  [34.96, 29.55], // Umm Raschrasch, das spätere Eilat
  [34.90, 29.49], // Taba, die ägyptische Grenze
  [34.75, 29.95],
  [34.58, 30.40],
  [34.42, 30.85],
  [34.32, 31.22],
];

/** Arabischer Staat, Teil 1: West- und Mittelgaliläa mit Akko. */
const PLAN_ARAB_WESTGALILAEA = [
  [35.10, 33.09], // die Küste an der libanesischen Grenze
  [35.30, 33.12],
  [35.32, 33.00],
  [35.35, 32.85],
  [35.25, 32.70],
  [35.15, 32.62],
  [35.12, 32.75],
  [34.99, 32.82], // Haifa
  [35.07, 32.92], // Akko
];

/**
 * Arabischer Staat, Teil 2: das Bergland — Samaria, Judäa und der Negev-Rand
 * um Beerscheba.
 *
 * Die internationale Zone um Jerusalem lag mitten darin. Sie wird unten als
 * eigene Fläche darübergelegt, weil das Karten-Schema für eine Fläche einen
 * einzigen Pfad vorsieht und kein Loch kennt.
 */
const PLAN_ARAB_BERGLAND = [
  [35.08, 32.45],
  [35.20, 32.55], // bei Dschenin
  [35.40, 32.50],
  [35.53, 32.40], // der Jordan
  [35.53, 32.15],
  [35.50, 31.95],
  [35.48, 31.80], // Jericho
  [35.45, 31.62],
  [35.40, 31.45],
  [35.35, 31.32],
  [35.10, 31.28],
  [34.85, 31.22], // Beerscheba
  [34.70, 31.35],
  [34.74, 31.55],
  [34.88, 31.70],
  [34.95, 31.85],
  [34.95, 32.05],
  [34.98, 32.25],
];

/** Arabischer Staat, Teil 3: die Küste von Isdud bis Rafah. */
const PLAN_ARAB_KUESTE = [
  [34.66, 31.83], // die Küste nördlich von Isdud
  [34.80, 31.74],
  [34.72, 31.52],
  [34.62, 31.38],
  [34.42, 31.34],
  [34.32, 31.22],
  [34.25, 31.32], // Rafah
  [34.42, 31.45],
  [34.52, 31.60],
  [34.61, 31.74],
];

/**
 * Jerusalem und Bethlehem als „corpus separatum" — internationale Verwaltung.
 *
 * Der Gedanke dahinter: Eine Stadt, die drei Weltreligionen heilig ist, sollte
 * keinem der beiden Staaten gehören. Umgesetzt wurde er nie.
 */
const PLAN_JERUSALEM_ZONE = [
  [35.13, 31.87],
  [35.24, 31.90],
  [35.32, 31.85],
  [35.33, 31.72],
  [35.28, 31.64], // Bethlehem
  [35.18, 31.63],
  [35.12, 31.70],
  [35.10, 31.79],
];

// ---------------------------------------------------------------------------
// Phase 1949 — die Waffenstillstandslinien
//
// Sie sind ausdrücklich keine Staatsgrenzen: Die Abkommen von 1949 hielten
// fest, wo die Waffen zum Schweigen kamen, und sagten wörtlich, dass damit
// über künftige Grenzen nichts entschieden sei. Weil die Linie auf den Karten
// mit grünem Stift gezogen wurde, heißt sie bis heute „Grüne Linie".
// ---------------------------------------------------------------------------

/** Israel innerhalb der Waffenstillstandslinien von 1949. */
const ISRAEL_1949 = [
  [35.10, 33.09], // Rosch haNikra
  [35.07, 32.92],
  [34.99, 32.82], // Haifa
  [34.95, 32.72],
  [34.89, 32.50],
  [34.86, 32.33],
  [34.80, 32.20],
  [34.75, 32.08], // Tel Aviv
  [34.70, 31.92],
  [34.65, 31.80],
  [34.56, 31.67],
  [34.53, 31.60], // das Nordende des Gazastreifens
  [34.57, 31.56],
  [34.55, 31.48],
  [34.48, 31.40],
  [34.40, 31.31],
  [34.30, 31.23],
  [34.42, 30.85], // die ägyptische Grenze nach Süden
  [34.58, 30.40],
  [34.75, 29.95],
  [34.90, 29.49], // Taba
  [34.96, 29.55], // Eilat
  [35.02, 29.95], // das Wadi Arava nach Norden
  [35.15, 30.35],
  [35.28, 30.75],
  [35.38, 31.02], // das Südende des Toten Meeres
  [35.42, 31.20],
  [35.40, 31.36], // hier beginnt die Grüne Linie um das Westjordanland
  [35.20, 31.36],
  [35.05, 31.42],
  [34.98, 31.50],
  [35.05, 31.60],
  [35.15, 31.72],
  [35.22, 31.77], // Jerusalem — die Linie lief mitten durch die Stadt
  [35.17, 31.79],
  [35.10, 31.72],
  [35.03, 31.75],
  [34.98, 31.85],
  [35.00, 31.92],
  [34.95, 32.02], // die schmalste Stelle: rund 15 Kilometer bis zum Meer
  [35.00, 32.10],
  [34.98, 32.20],
  [35.02, 32.35],
  [35.10, 32.47],
  [35.20, 32.51],
  [35.40, 32.51],
  [35.55, 32.40],
  [35.57, 32.52], // das Jordantal
  [35.60, 32.65],
  [35.62, 32.72],
  [35.66, 32.80],
  [35.68, 32.90],
  [35.70, 33.05], // die Grenze zu Syrien
  [35.64, 33.20],
  [35.57, 33.28], // Metulla
  [35.40, 33.28],
  [35.25, 33.20],
  [35.15, 33.12],
];

/** Das Westjordanland — von 1949 bis 1967 unter jordanischer Kontrolle. */
const WESTJORDANLAND = [
  [35.55, 32.40],
  [35.40, 32.51],
  [35.20, 32.51],
  [35.10, 32.47],
  [35.02, 32.35],
  [34.98, 32.20],
  [35.00, 32.10],
  [34.95, 32.02],
  [35.00, 31.92],
  [34.98, 31.85],
  [35.03, 31.75],
  [35.10, 31.72],
  [35.17, 31.79],
  [35.22, 31.77], // Ostjerusalem
  [35.15, 31.72],
  [35.05, 31.60],
  [34.98, 31.50],
  [35.05, 31.42],
  [35.20, 31.36],
  [35.40, 31.36],
  [35.47, 31.50], // das Nordwestufer des Toten Meeres
  [35.47, 31.70],
  [35.50, 31.83], // Jericho
  [35.53, 32.00],
  [35.55, 32.20],
];

/** Der Gazastreifen — von 1949 bis 1967 unter ägyptischer Verwaltung. */
const GAZASTREIFEN = [
  [34.53, 31.60], // das Nordende
  [34.49, 31.53], // Gaza
  [34.42, 31.45],
  [34.33, 31.36],
  [34.25, 31.32], // Rafah
  [34.30, 31.23],
  [34.40, 31.31],
  [34.48, 31.40],
  [34.55, 31.48],
  [34.57, 31.56],
];

// ---------------------------------------------------------------------------
// Phase 1967 — nach dem Sechstagekrieg
// ---------------------------------------------------------------------------

/** Die Golanhöhen — seit 1967 von Israel kontrolliert, zuvor syrisch. */
const GOLANHOEHEN = [
  [35.68, 33.27],
  [35.88, 33.24],
  [35.85, 33.05],
  [35.80, 32.85],
  [35.73, 32.72],
  [35.65, 32.75],
  [35.63, 32.95],
  [35.64, 33.12],
];

/**
 * Der Sinai — 1967 besetzt, 1979 im Friedensvertrag zugesagt und 1982
 * vollständig an Ägypten zurückgegeben.
 *
 * Er ist mit Abstand die größte Fläche dieser Karte. Dass Israel sie wieder
 * hergab, gehört zu den Tatsachen, die man auf einer Karte nicht sieht — der
 * Hinweis der Phase sagt es deshalb ausdrücklich.
 */
const SINAI = [
  [32.30, 31.27], // Port Said
  [32.70, 31.15],
  [33.10, 31.10],
  [33.45, 31.12],
  [33.78, 31.13],
  [34.05, 31.20],
  [34.25, 31.32], // Rafah
  [34.42, 30.85],
  [34.58, 30.40],
  [34.75, 29.95],
  [34.90, 29.49], // Taba
  [34.80, 29.20],
  [34.68, 28.85],
  [34.52, 28.30],
  [34.20, 27.90], // Ras Muhammad, die Südspitze — unterhalb des Bildrands
  [33.35, 28.30],
  [33.15, 28.95],
  [32.88, 29.50],
  [32.58, 29.93], // Sues
  [32.45, 30.30],
  [32.38, 30.70],
  [32.32, 31.00],
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

/** Der Sueskanal — wie ein Fluss gezeichnet, aber von Menschenhand. */
const kanal = (orte) => ({
  art: 'kanal',
  d: geo.pfad(orte, { geschlossen: false, rund: false }),
  fill: 'none',
  stroke: KARTENFARBEN.fluss,
  strokeWidth: 2.4,
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
    land(LANDMASSE),
    wasser(TOTES_MEER),
    wasser(SEE_GENEZARETH),
    fluss(JORDAN_OBEN),
    fluss(JORDAN_UNTEN),
    fluss(JARMUK),
    fluss(LITANI),
    kanal(SUEZKANAL),
  ],

  phasen: [
    {
      id: 'teilungsplan-1947',
      label: 'Teilungsplan 1947',
      hinweis:
        'So hatten es die Vereinten Nationen am 29. November 1947 beschlossen (Resolution 181): ein jüdischer und ein arabischer Staat aus je drei Gebieten, die sich an sechs Stellen berühren, dazu Jerusalem und Bethlehem unter internationaler Verwaltung. Die jüdische Seite nahm den Plan an, die arabischen Staaten und die palästinensische Führung lehnten ihn ab. Umgesetzt wurde er nie. Auch Jaffa war als arabische Enklave im jüdischen Staat vorgesehen — sie ist auf diesem Maßstab zu klein zum Zeichnen.',
      flaechen: [
        gebiet('Jüdischer Staat — Ostgaliläa (Plan von 1947)', PLAN_JUED_OSTGALILAEA),
        gebiet('Jüdischer Staat — die Küstenebene (Plan von 1947)', PLAN_JUED_KUESTE),
        gebiet('Jüdischer Staat — der Negev (Plan von 1947)', PLAN_JUED_NEGEV),
        gebiet('Arabischer Staat — Westgaliläa (Plan von 1947)', PLAN_ARAB_WESTGALILAEA),
        gebiet('Arabischer Staat — das Bergland (Plan von 1947)', PLAN_ARAB_BERGLAND),
        gebiet('Arabischer Staat — die Küste von Isdud bis Rafah (Plan von 1947)', PLAN_ARAB_KUESTE),
        gebiet('Jerusalem und Bethlehem — internationale Zone (Plan von 1947)', PLAN_JERUSALEM_ZONE),
      ],
    },
    {
      id: 'waffenstillstand-1949',
      label: 'Waffenstillstand 1949',
      hinweis:
        'Nach dem Krieg von 1948/49 verlief die Lage anders als geplant. Israel hielt mehr Gebiet als im Teilungsplan vorgesehen, das Westjordanland stand unter jordanischer, der Gazastreifen unter ägyptischer Kontrolle, Jerusalem war geteilt. Die Linien heißen „Waffenstillstandslinien" oder „Grüne Linie" — die Abkommen hielten ausdrücklich fest, dass damit über künftige Grenzen nichts entschieden sei. Ein palästinensischer Staat entstand nicht.',
      flaechen: [
        gebiet('Israel in den Waffenstillstandslinien von 1949', ISRAEL_1949),
        gebiet('Westjordanland — unter jordanischer Kontrolle (1949–1967)', WESTJORDANLAND),
        gebiet('Gazastreifen — unter ägyptischer Verwaltung (1949–1967)', GAZASTREIFEN),
      ],
    },
    {
      id: 'sechstagekrieg-1967',
      label: 'nach 1967',
      hinweis:
        'Im Juni 1967 dauerte der Krieg sechs Tage. Danach kontrollierte Israel zusätzlich das Westjordanland mit Ostjerusalem, den Gazastreifen, die Golanhöhen und die gesamte Sinai-Halbinsel. Der Sinai ging 1982 nach dem Friedensvertrag an Ägypten zurück; aus Gaza zog Israel 2005 ab. Das Westjordanland und Ostjerusalem sind seither besetzt — völkerrechtlich, politisch und im Alltag der Menschen dort ist genau das der Kern des heutigen Streits. Die Karte zeigt den Zustand, sie bewertet ihn nicht.',
      flaechen: [
        gebiet('Israel in den Linien von 1949', ISRAEL_1949),
        gebiet('Westjordanland und Ostjerusalem — seit 1967 besetzt', WESTJORDANLAND),
        gebiet('Gazastreifen — 1967 besetzt, Abzug 2005', GAZASTREIFEN),
        gebiet('Golanhöhen — 1967 von Syrien erobert', GOLANHOEHEN),
        gebiet('Sinai — 1967 von Ägypten erobert, 1982 zurückgegeben', SINAI),
      ],
    },
  ],

  punkte: [
    {
      id: 'jerusalem',
      name: 'Jerusalem',
      typ: 'stadt',
      ...xy(35.23, 31.78),
      text: [
        'Keine andere Stadt der Erde ist drei Weltreligionen zugleich heilig.',
        'Für das Judentum steht hier der Tempelberg: Dort standen der Erste und',
        'der Zweite Tempel, und die Westmauer — die Klagemauer — ist der Rest',
        'seiner Stützmauer, der bis heute steht. Für das Christentum liegt hier',
        'die Grabeskirche, an der Stelle, an der nach christlicher Überlieferung',
        'Jesus gekreuzigt und begraben wurde. Für den Islam steht auf demselben',
        'Berg der Felsendom und daneben die al-Aqsa-Moschee, die drittwichtigste',
        'Stätte des Islam; von hier aus soll der Prophet Mohammed die Nachtreise',
        'in den Himmel angetreten haben. Alles davon liegt auf wenigen hundert',
        'Metern. Der UN-Plan von 1947 wollte die Stadt deshalb international',
        'verwalten lassen; von 1949 bis 1967 verlief eine Grenze mitten hindurch;',
        'seit 1967 kontrolliert Israel die ganze Stadt und nennt sie seine',
        'Hauptstadt — die Palästinenser beanspruchen den Ostteil als Hauptstadt',
        'eines eigenen Staates, und die meisten Staaten der Welt haben den Status',
        'nie anerkannt. Über kaum eine Frage dieses Konflikts wird härter',
        'gestritten.',
      ].join(' '),
    },
    {
      id: 'tel-aviv',
      name: 'Tel Aviv',
      typ: 'stadt',
      ...xy(34.78, 32.07),
      text: [
        '1909 verteilten 66 jüdische Familien am Strand nördlich der alten',
        'Hafenstadt Jaffa Grundstücke per Losverfahren — mit Muscheln. Daraus',
        'wurde Tel Aviv, die erste Stadt der Neuzeit, die von jüdischen',
        'Einwanderern neu gegründet wurde. In den 1930er Jahren bauten aus',
        'Deutschland geflohene Architekten hier tausende Häuser im Bauhaus-Stil;',
        'die „Weiße Stadt" gehört heute zum Weltkulturerbe. Am 14. Mai 1948 rief',
        'David Ben-Gurion in einem Museum an der Rothschild-Allee den Staat Israel',
        'aus. Jaffa, die arabische Nachbarstadt mit ihrer jahrhundertealten',
        'Geschichte, war im Teilungsplan von 1947 als arabische Enklave',
        'vorgesehen; im Krieg von 1948 verließ der größte Teil ihrer Bevölkerung',
        'die Stadt. Heute sind Tel Aviv und Jaffa eine einzige Gemeinde.',
      ].join(' '),
    },
    {
      id: 'haifa',
      name: 'Haifa',
      typ: 'stadt',
      ...xy(34.99, 32.82),
      text: [
        'Der wichtigste Hafen des Landes, am Fuß des Berges Karmel. Hier kamen',
        'die meisten Einwanderer an — die jüdischen Zuwanderer der 1920er und',
        '1930er Jahre, die Überlebenden des Holocaust, die auf oft seeuntüchtigen',
        'Schiffen anlandeten und von den Briten teils zurückgeschickt wurden, und',
        'nach 1948 die Hunderttausenden Juden aus dem Irak, dem Jemen, Marokko,',
        'Ägypten und Libyen. Haifa war schon vorher eine gemischte Stadt aus',
        'Arabern und Juden und gilt bis heute als die Stadt, in der das',
        'Zusammenleben am besten funktioniert: Arabische und jüdische Israelis',
        'wohnen hier in denselben Vierteln, arbeiten in denselben Krankenhäusern',
        'und studieren an derselben Universität. Auch das gehört ins Bild.',
      ].join(' '),
    },
    {
      id: 'gaza',
      name: 'Gaza',
      typ: 'stadt',
      ...xy(34.47, 31.51),
      text: [
        'Gaza ist eine der ältesten durchgehend bewohnten Städte der Welt — sie',
        'lag schon in der Antike an der Straße zwischen Ägypten und Syrien. Der',
        'Gazastreifen dagegen ist jung: Er entstand 1949 als das Gebiet, das die',
        'ägyptische Armee im Krieg gehalten hatte. Auf rund 40 Kilometer Länge',
        'und stellenweise nur sechs Kilometer Breite drängten sich damals die',
        'einheimische Bevölkerung und etwa 200 000 Flüchtlinge aus dem Gebiet, das',
        'Israel geworden war — die Zahl der Menschen vervielfachte sich in',
        'wenigen Monaten. Von 1949 bis 1967 verwaltete Ägypten den Streifen, ohne',
        'ihn je zu annektieren; 1967 besetzte Israel ihn, 2005 zog es Siedlungen',
        'und Truppen ab, behielt aber die Kontrolle über Grenzen, Küste und',
        'Luftraum, und Ägypten über den Übergang im Süden. Heute leben hier über',
        'zwei Millionen Menschen — eine der am dichtesten besiedelten Gegenden',
        'der Erde.',
      ].join(' '),
    },
    {
      id: 'hebron',
      name: 'Hebron',
      typ: 'stadt',
      ...xy(35.10, 31.53),
      text: [
        'In Hebron steht ein Gebäude, das den ganzen Konflikt in einem Grundriss',
        'zeigt. Die Patriarchengräber — auf Arabisch die Ibrahimi-Moschee — sind',
        'nach jüdischer wie muslimischer Überlieferung die Grabstätte Abrahams,',
        'Isaaks und Jakobs mit ihren Frauen. Abraham gilt beiden Religionen als',
        'Stammvater; das Bauwerk darüber ließ König Herodes vor 2 000 Jahren',
        'errichten. Hebron war jahrhundertelang eine der vier heiligen Städte des',
        'Judentums, und eine jüdische Gemeinde lebte hier ohne Unterbrechung —',
        'bis 1929 bei Unruhen 67 Juden getötet wurden und die Überlebenden die',
        'Stadt verließen; muslimische Nachbarn hatten damals viele von ihnen',
        'versteckt. Seit 1967 leben wieder jüdische Siedler mitten in der',
        'überwiegend palästinensischen Stadt. Das Gebäude ist heute geteilt: eine',
        'Seite Synagoge, eine Seite Moschee, dazwischen Kontrollen.',
      ].join(' '),
    },
    {
      id: 'tiberias',
      name: 'Tiberias am See Genezareth',
      typ: 'stadt',
      ...xy(35.53, 32.79),
      text: [
        'Der See Genezareth ist der größte Süßwassersee der Region und liegt 210',
        'Meter unter dem Meeresspiegel; der Jordan fließt oben hinein und unten',
        'wieder heraus. An seinem Westufer liegt Tiberias — neben Jerusalem,',
        'Hebron und Safed eine der vier Städte, in denen über die ganzen',
        'Jahrhunderte der Zerstreuung hinweg jüdische Gemeinden lebten; hier',
        'wurde um 400 n. Chr. der Jerusalemer Talmud abgeschlossen. Für Christen',
        'ist dieser See der Ort, an dem Jesus predigte und Fischer zu Jüngern',
        'machte. Und er ist bis heute politisch: Wasser ist in dieser Gegend',
        'knapp, und der Streit darüber, wer den Jordan und seine Zuflüsse nutzen',
        'darf, gehörte zu den Konflikten, die 1967 mit in den Krieg führten.',
      ].join(' '),
    },
  ],

  bewegungen: [
    // Vier Bewegungen statt der sonst üblichen drei — und zwar mit Absicht:
    // zwei hinaus und zwei herein. Nach 1948 verließen rund 700 000
    // palästinensische Araber das Gebiet, das Israel wurde, und in denselben
    // Jahren kamen die Überlebenden des Holocaust aus Europa sowie rund
    // 850 000 Juden aus arabischen und muslimischen Ländern ins Land. Wer nur
    // eine Richtung zeichnet, macht die andere zur Fußnote. Die Kartenpalette
    // hat genau vier Bewegungsfarben, die Legende bleibt also eindeutig.
    {
      id: 'flucht-1948-gaza',
      name: '1948: Flucht und Vertreibung in den Gazastreifen',
      ...weg([34.80, 31.98], [34.50, 31.48]),
      ueber: [p(34.65, 31.72)],
      text: [
        'Im Krieg von 1948/49 verließen rund 700 000 palästinensische Araber das',
        'Gebiet, das der Staat Israel wurde — etwa 80 Prozent der arabischen',
        'Bevölkerung dieses Gebiets. Ein großer Teil von ihnen zog nach Süden in',
        'den Gazastreifen, der dadurch von einer dünn besiedelten Küstengegend zu',
        'einem der dichtesten Siedlungsräume der Erde wurde. Über die Ursachen',
        'streiten Historiker bis heute: Es gab gezielte Vertreibungen und',
        'Militäroperationen, die Orte leeren sollten, es gab Massaker wie das von',
        'Deir Yassin im April 1948, es gab Flucht aus Angst vor den Kämpfen, und',
        'es gab arabische Aufrufe zur zeitweisen Räumung. Die neuere Forschung',
        'sagt: alles davon, in unterschiedlicher Mischung — und die Vertreibung',
        'war beträchtlich und vielfach beabsichtigt. Zurückkehren durften die',
        'Flüchtlinge nicht; ihr Besitz ging an den Staat. Die Palästinenser',
        'nennen dieses Jahr die „Nakba", die Katastrophe.',
      ].join(' '),
    },
    {
      id: 'flucht-1948-osten',
      name: '1948: Flucht und Vertreibung nach Osten',
      ...weg([34.90, 31.93], [35.75, 31.95]),
      ueber: [p(35.25, 31.90)],
      text: [
        'Der andere große Strom von 1948 führte nach Osten: ins Bergland, das',
        'Jordanien besetzte und später Westjordanland hieß, und weiter über den',
        'Jordan nach Jordanien selbst. Weitere Flüchtlinge gingen nach Norden in',
        'den Libanon und nach Syrien. Aus den Städten Lydda und Ramla wurden im',
        'Juli 1948 rund 50 000 Menschen zu Fuß nach Osten geschickt — der',
        'bekannteste Einzelfall. Die Vereinten Nationen richteten für die',
        'Flüchtlinge ein eigenes Hilfswerk ein, UNRWA, und Lager, die als',
        'Übergangslösung gedacht waren. Sie bestehen bis heute. Weil der',
        'Flüchtlingsstatus in diesen Lagern vererbt wird, zählt UNRWA inzwischen',
        'mehrere Millionen Menschen. Das „Rückkehrrecht" ist seither eine der',
        'Kernforderungen der palästinensischen Seite — und eine der Fragen, an',
        'denen Verhandlungen regelmäßig scheitern.',
      ].join(' '),
    },
    {
      id: 'alija-ueber-das-meer',
      name: 'Jüdische Einwanderung über das Mittelmeer (die Alijot)',
      ...weg([32.30, 34.30], [34.92, 32.80]),
      ueber: [p(33.30, 33.60)],
      text: [
        'Alija heißt „Aufstieg" — so nennt die hebräische Sprache die Einwanderung',
        'ins Land. Die erste Welle begann 1882, die zweite 1904; die Menschen',
        'kamen aus dem Russischen Reich, aus Polen, Rumänien, später aus',
        'Deutschland. 1918 lebten etwa 60 000 Juden im Land, 1948 rund 600 000.',
        'Nach 1933 wurde aus Auswanderung Flucht: Wer Europa nicht rechtzeitig',
        'verließ, hatte im Holocaust kaum eine Chance. Ausgerechnet in diesen',
        'Jahren begrenzte die britische Mandatsmacht die Einwanderung scharf, um',
        'die arabische Bevölkerung zu beruhigen — Schiffe wurden abgewiesen oder',
        'nach Zypern umgeleitet. Nach 1945 kamen die Überlebenden der',
        'Vernichtungslager, viele von ihnen ohne Familie und ohne ein Land, das',
        'sie zurückhaben wollte. Der Hafen, in dem fast alle ankamen, war Haifa.',
      ].join(' '),
    },
    {
      id: 'juden-aus-arabischen-laendern',
      name: 'Jüdische Flüchtlinge aus arabischen Ländern nach 1948',
      ...weg([36.80, 33.60], [34.90, 32.00]),
      ueber: [p(35.90, 32.90)],
      text: [
        'In den Jahrzehnten nach 1948 verließen rund 850 000 Juden die arabischen',
        'und muslimischen Länder — aus dem Irak, dem Jemen, Ägypten, Libyen,',
        'Syrien, Marokko, Algerien, Tunesien und dem Iran. Manche gingen',
        'freiwillig, viele wurden vertrieben, enteignet oder durch Gesetze,',
        'Pogrome und Verhaftungen zum Gehen gezwungen; jüdische Gemeinden, die',
        'dort zweitausend Jahre und teils länger gelebt hatten als anderswo,',
        'verschwanden binnen einer Generation fast vollständig. Der größte Teil',
        'dieser Menschen kam nach Israel, oft per Schiff nach Haifa oder mit',
        'Luftbrücken wie der aus dem Jemen. Sie und ihre Nachkommen stellen heute',
        'etwa die Hälfte der jüdischen Bevölkerung Israels. Manche Historiker',
        'sprechen deshalb von einem Bevölkerungsaustausch — mit Verlust und Leid',
        'auf beiden Seiten.',
      ].join(' '),
    },
  ],

  beschriftungen: [
    { text: 'Mittelmeer', art: 'meer', ...xy(33.30, 32.80) },
    { text: 'Israel', art: 'land', ...xy(34.80, 31.10) },
    { text: 'Westjordanland', art: 'land', ...xy(35.30, 32.05) },
    { text: 'Gazastreifen', art: 'land', ...xy(34.12, 31.40) },
    { text: 'Jordanien', art: 'land', ...xy(36.40, 30.80) },
    { text: 'Ägypten', art: 'land', ...xy(32.60, 30.10) },
    { text: 'Sinai', art: 'land', ...xy(33.70, 29.90) },
    { text: 'Libanon', art: 'land', ...xy(35.70, 33.85) },
    { text: 'Syrien', art: 'land', ...xy(36.45, 33.55) },
    { text: 'Golanhöhen', art: 'land', ...xy(35.80, 33.10) },
    { text: 'Negev', art: 'land', ...xy(34.85, 30.20) },
    { text: 'Totes Meer', art: 'meer', ...xy(35.90, 31.20) },
    { text: 'Golf von Akaba', art: 'meer', ...xy(34.80, 29.25) },
    { text: 'Sueskanal', art: 'meer', ...xy(32.55, 30.60) },
  ],
};

module.exports = karte;
