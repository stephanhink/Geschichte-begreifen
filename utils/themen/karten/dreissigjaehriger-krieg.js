// Die Karte zum Thema „Der Dreißigjährige Krieg" — Geschichte in Bewegung.
//
// Die Küstenlinien stehen hier als echte Längen-/Breitengrade `[lon, lat]` und
// werden von utils/karte-geo.js in SVG-Koordinaten umgerechnet. Wer einen Punkt
// anzweifelt, schlägt ihn im Atlas nach: `[14.42, 50.09]` ist Prag,
// `[11.63, 52.13]` Magdeburg, `[13.77, 54.13]` Peenemünde auf Usedom, wo im
// Juli 1630 die schwedische Flotte anlandete.
//
// Der Ausschnitt: 5° W bis 30° O, 42° N bis 60° N — 700 × 572,1. Mit 20
// SVG-Einheiten je Längengrad ist das die feinste Karte der App außer der
// Levante-Karte, und das ist Absicht. Dieser Krieg spielt auf engem Raum:
// Zwischen Breitenfeld und Lützen liegen fünfundzwanzig Kilometer, zwischen
// Magdeburg und Wittenberg sechzig. Eine gröbere Karte hätte daraus einen
// einzigen Fleck gemacht. Zugleich muss der Ausschnitt weit genug sein, damit
// man sieht, wer alles hineingriff: Stockholm liegt oben rechts, Paris links
// unten, Rocroi an der spanisch-französischen Grenze, und die Ostsee ist der
// Weg, auf dem Gustav Adolf kam.
//
// Vier Festlegungen, die ausdrücklich hierher gehören:
//
//   1. **Das Reich ist keine Fläche.** Es war ein Flickenteppich aus über
//      dreihundert Herrschaften — Kurfürstentümer, Bistümer, Reichsstädte,
//      Reichsritter. Eine einzige eingefärbte Fläche „Heiliges Römisches
//      Reich" würde einen Staat behaupten, den es nicht gab. Deshalb liegt die
//      Reichsgrenze als blasse Linie über dem Untergrund (siehe
//      `reichsgrenze()`), und die Flächen der Phasen zeigen nur, was wirklich
//      Herrschaft mit Grenzen war: die habsburgischen Länder, Frankreich,
//      Schweden, Dänemark, Polen-Litauen, die beiden Niederlande.
//   2. **Der schwedische Vormarsch ist kein Staatsgebiet.** Die Fläche in der
//      Phase 1631/32 heißt so, wie sie gemeint ist: die Reichweite eines
//      Heeres. Wo Gustav Adolfs Truppen standen, war kein Land erobert im
//      Sinne einer Grenze — es war besetzt, bezahlt und morgen wieder offen.
//      Der Hinweis der Phase sagt das selbst.
//   3. **Breitenfeld und Lützen liegen auf dem Bild fast übereinander.** Das
//      ist keine Ungenauigkeit, sondern Geografie: Beide Schlachtfelder liegen
//      bei Leipzig, rund fünfundzwanzig Kilometer auseinander, hier also
//      knapp acht SVG-Einheiten. Ob die beiden Ortsnamen auf einem Handy noch
//      lesbar nebeneinander stehen, entscheidet das Gerät — die Karte
//      verschiebt sie nicht, denn dann stimmte die Geografie nicht mehr.
//   4. **Alle Flächen einer Phase werden gleich eingefärbt** (siehe
//      components/abschnitte/KarteAbschnitt.js). Benachbarte Herrschaften —
//      die Spanischen Niederlande und die Republik, Frankreich und Lothringen —
//      verschmelzen deshalb optisch zu einem Block; nur die Titel sagen, wer
//      wer ist. Der Hinweis der ersten Phase weist darauf hin.
//
// Reine Daten und Rechnung — keine UI-Importe (Architektur-Regel).

const { KARTENFARBEN, erstelleProjektion, rueckwaerts, verbinde } = require('../../karte-geo');

// ---------------------------------------------------------------------------
// Ausschnitt und Projektion
// ---------------------------------------------------------------------------

/**
 * Der Kartenausschnitt: vom Atlantik westlich der Bretagne (5° W) bis zum
 * Finnischen Meerbusen (30° O), von den Pyrenäen (42° N) bis Mittelschweden
 * (60° N).
 */
const RAHMEN = { minLon: -5, maxLon: 30, minLat: 42, maxLat: 60, breite: 700 };

const geo = erstelleProjektion(RAHMEN);

/** Kurzform: geografischer Ort → SVG-Punkt `[x, y]`. */
const p = (lon, lat) => geo.punkt(lon, lat);

/** Dasselbe als `{ x, y }` — die Form, die Punkte und Beschriftungen wollen. */
const ort = (lon, lat) => {
  const [x, y] = p(lon, lat);
  return { x, y };
};

// ---------------------------------------------------------------------------
// Küstenabschnitte — jeweils in einer Richtung notiert
// ---------------------------------------------------------------------------

/**
 * Die Ostküste der Ostsee: Finnischer Meerbusen → Riga → Danzig.
 *
 * Von Osten nach Westen notiert. Der erste Punkt liegt rechts außerhalb des
 * Bildes, damit das Land am Rand nicht abknickt.
 */
const OSTSEE_OST = [
  [30.4, 60.0], // Newamündung, über dem rechten Bildrand
  [29.0, 59.85],
  [27.8, 59.45], // Estlands Nordküste bei Kunda
  [26.6, 59.5],
  [25.6, 59.55],
  [24.75, 59.47], // Reval (Tallinn)
  [24.0, 59.35],
  [23.5, 59.2],
  [23.4, 58.75], // Estlands Westküste
  [23.7, 58.4],
  [24.5, 58.38], // Pernau (Pärnu), am Rigaischen Meerbusen
  [24.4, 57.9],
  [24.35, 57.4],
  [24.1, 57.05], // Riga, an der Düna
  [23.6, 56.95],
  [23.1, 57.15],
  [22.6, 57.75], // Kap Kolka, die Nordspitze Kurlands
  [21.7, 57.5],
  [21.05, 56.55], // Libau (Liepāja)
  [20.95, 56.05],
  [21.05, 55.7], // Memel (Klaipėda)
  [20.9, 55.3],
  [20.5, 55.0],
  [19.9, 54.65], // Pillau, der Hafen Königsbergs
  [19.3, 54.55],
  [18.9, 54.65],
  [18.65, 54.35], // Danzig, an der Weichselmündung
];

/** Die Südküste der Ostsee: Danzig → Kiel. */
const OSTSEE_SUED = [
  [18.65, 54.35],
  [18.45, 54.75],
  [17.9, 54.8],
  [17.3, 54.75],
  [16.7, 54.55],
  [16.2, 54.25],
  [15.58, 54.18], // Kolberg
  [14.9, 54.05],
  [14.25, 53.92], // Swinemünde — hier liegt Usedom
  [13.75, 54.05],
  [13.4, 54.15],
  [13.1, 54.31], // Stralsund, gegenüber von Rügen
  [12.6, 54.15],
  [12.1, 54.18], // Rostock
  [11.5, 54.15],
  [11.46, 53.9], // Wismar
  [10.87, 53.87], // Lübeck
  [10.75, 54.1],
  [10.4, 54.2],
  [10.13, 54.33], // Kiel
];

/** Jütlands Ostküste: Kiel → Flensburg → Aarhus → Skagen. */
const DAENEMARK_OST = [
  [10.13, 54.33],
  [9.9, 54.5],
  [9.43, 54.79], // Flensburg
  [9.7, 55.0],
  [9.75, 55.25],
  [9.9, 55.5], // Kolding
  [10.2, 55.85],
  [10.2, 56.15], // Aarhus
  [10.6, 56.5],
  [10.3, 56.9],
  [10.4, 57.1],
  [10.55, 57.45],
  [10.6, 57.73], // Skagen, die Nordspitze
];

/** Jütlands Westküste: Skagen → Esbjerg → Elbmündung. */
const DAENEMARK_WEST = [
  [10.6, 57.73],
  [9.96, 57.59], // Hirtshals
  [9.2, 57.15],
  [8.6, 56.9],
  [8.22, 56.7], // Thyborøn
  [8.13, 56.2],
  [8.3, 55.8],
  [8.45, 55.47], // Esbjerg
  [8.4, 55.1],
  [8.4, 54.9], // Sylt und Rømø
  [8.65, 54.6],
  [9.05, 54.48], // Husum
  [8.85, 54.2],
  [8.7, 53.87], // Elbmündung
];

/**
 * Die Nordseeküste: Elbmündung → Zuiderzee → Rheinmündung → Calais.
 *
 * Die Zuiderzee ist als Bucht gezeichnet — im 17. Jahrhundert war sie offenes
 * Wasser und der Hafen, von dem aus die Republik Weltmacht war. Erst 1932
 * wurde sie abgedämmt.
 */
const NORDSEE = [
  [8.7, 53.87],
  [8.5, 53.6], // Wesermündung bei Bremerhaven
  [8.15, 53.5],
  [7.2, 53.6], // Ostfriesland, Emsmündung
  [6.8, 53.45],
  [6.2, 53.45],
  [5.6, 53.4], // Friesland
  [5.4, 52.9], // Zuiderzee, Ostufer
  [5.3, 52.5],
  [5.05, 52.35], // Südende der Zuiderzee, bei Amsterdam
  [4.9, 52.45],
  [5.0, 52.75], // Westufer
  [5.1, 52.9],
  [4.75, 52.96], // Texel und Den Helder
  [4.6, 52.6],
  [4.5, 52.3],
  [4.2, 51.95], // Rheinmündung, Rotterdam
  [3.9, 51.65], // Seeland
  [3.4, 51.45], // Scheldemündung
  [2.9, 51.25], // Ostende
  [2.4, 51.1], // Dünkirchen
  [1.6, 50.95], // Calais
];

/** Die Atlantikküste Frankreichs: Calais → Bretagne → Gironde → Bidassoa. */
const FRANKREICH_ATLANTIK = [
  [1.6, 50.95],
  [1.55, 50.7], // Boulogne
  [1.08, 49.93], // Dieppe
  [0.65, 49.7], // Fécamp
  [0.2, 49.5], // Seinemündung, Le Havre
  [-0.3, 49.3],
  [-1.0, 49.35],
  [-1.6, 49.65], // Cherbourg, auf dem Cotentin
  [-1.85, 49.5],
  [-1.55, 49.0], // Bucht des Mont-Saint-Michel
  [-1.85, 48.6],
  [-2.5, 48.55],
  [-3.0, 48.85], // Nordküste der Bretagne
  [-4.0, 48.7],
  [-4.6, 48.65], // am linken Bildrand
  [-4.75, 48.3],
  [-4.4, 47.95],
  [-3.5, 47.75],
  [-2.9, 47.5],
  [-2.2, 47.28], // Loiremündung
  [-1.8, 46.7],
  [-1.2, 46.3], // La Rochelle
  [-1.1, 45.6], // Gironde
  [-1.25, 44.6], // Arcachon
  [-1.5, 43.5], // Biarritz
  [-1.78, 43.35], // Bidassoa, die spanische Grenze
];

/** Die Nordküste Spaniens: Bidassoa → über den linken Bildrand hinaus. */
const SPANIEN_NORD = [
  [-1.78, 43.35],
  [-2.2, 43.32],
  [-2.95, 43.35], // Bilbao
  [-3.8, 43.45],
  [-4.5, 43.4],
  [-5.2, 43.55],
  [-5.9, 43.55], // Gijón, außerhalb des Bildes
];

/** Der Pyrenäenkamm: vom Golf von Biskaya zum Mittelmeer. */
const PYRENAEEN = [
  [-1.78, 43.35],
  [-0.7, 42.9],
  [0.6, 42.7],
  [1.9, 42.5],
  [3.2, 42.3], // Cap de Creus
];

/** Die Mittelmeerküste Frankreichs: Cap de Creus → Genua. */
const MITTELMEER_FRANKREICH = [
  [3.2, 42.3],
  [3.05, 43.0], // Golfe du Lion
  [3.7, 43.4], // Sète
  [4.4, 43.45],
  [4.85, 43.35], // Rhônedelta
  [5.36, 43.3], // Marseille
  [6.0, 43.1], // Toulon
  [6.6, 43.15],
  [7.1, 43.55], // die Var-Mündung, damals die Grenze zu Savoyen
  [7.6, 43.8], // Nizza
  [8.3, 44.15],
  [8.95, 44.4], // Genua
];

/** Die Westküste Italiens: Genua → unter den unteren Bildrand. */
const ITALIEN_WEST = [
  [8.95, 44.4],
  [9.6, 44.15],
  [10.1, 43.9],
  [10.3, 43.65], // Arnomündung bei Pisa
  [10.5, 43.0], // Piombino
  [11.15, 42.4],
  [11.8, 42.1], // Civitavecchia
  [12.25, 41.75], // Ostia, unterhalb des Bildrandes
];

/** Die Adriaküste Italiens: von unterhalb des Bildrandes bis Triest. */
const ITALIEN_ADRIA = [
  [16.9, 41.1], // Bari, unterhalb des Bildrandes
  [16.2, 41.9], // der Gargano
  [15.5, 41.9],
  [14.9, 42.1],
  [14.2, 42.5],
  [13.7, 42.9],
  [13.5, 43.6], // Ancona
  [13.0, 43.9],
  [12.6, 44.1], // Rimini
  [12.3, 44.8], // Podelta
  [12.3, 45.35], // die Lagune von Venedig
  [12.5, 45.5],
  [13.1, 45.6],
  [13.65, 45.7], // Triest
];

/** Die Ostküste der Adria: Triest → Ragusa (Dubrovnik). */
const BALKAN_ADRIA = [
  [13.65, 45.7],
  [13.75, 45.5],
  [13.9, 44.9], // Istrien
  [14.5, 45.3], // Kvarner-Bucht
  [15.0, 44.3],
  [15.9, 43.7], // Šibenik
  [16.45, 43.5], // Split
  [17.3, 42.9],
  [18.1, 42.6], // Ragusa
];

/** Das Westufer des Schwarzen Meeres: Bosporus → Donaudelta → Odessa. */
const SCHWARZMEER_WEST = [
  [29.1, 41.2], // Bosporus, unterhalb des Bildrandes
  [28.0, 41.6],
  [27.5, 42.1],
  [27.85, 42.7],
  [27.9, 43.2], // Warna
  [28.15, 43.7],
  [28.6, 44.2], // Constanța
  [29.0, 44.7],
  [29.7, 45.2], // Donaudelta
  [30.3, 45.9],
  [30.8, 46.4], // am rechten Bildrand
];

// ---------------------------------------------------------------------------
// Die skandinavische Halbinsel
// ---------------------------------------------------------------------------

/**
 * Schwedens Ostküste: Bottnischer Meerbusen → Stockholm → Kalmarsund →
 * Schonen.
 *
 * Von Norden nach Süden notiert. Schonen, Halland und Blekinge — der ganze
 * Süden — waren 1618 dänisch; das ist auf dieser Karte keine Kleinigkeit,
 * sondern der Grund für vier Kriege.
 */
const SCHWEDEN_OST = [
  [17.3, 61.0], // über dem oberen Bildrand
  [17.15, 60.67], // Gävle
  [17.6, 60.35],
  [18.35, 59.75],
  [18.3, 59.35], // Stockholm und seine Schären
  [17.6, 58.9],
  [16.9, 58.6], // Bråviken, bei Norrköping
  [16.6, 58.35],
  [16.75, 57.9], // Västervik
  [16.5, 57.3],
  [16.45, 56.9], // Kalmarsund, gegenüber von Öland
  [16.2, 56.5],
  [15.6, 56.2], // Karlskrona
  [14.7, 56.1],
  [14.2, 55.85],
  [14.35, 55.4], // Sandhammaren, die Südostecke Schonens
  [13.6, 55.38],
  [13.0, 55.38], // Trelleborg
];

/** Die Westküste: Öresund → Kattegat → Oslofjord → Norwegens Südküste. */
const SKANDINAVIEN_WEST = [
  [13.0, 55.38],
  [12.7, 55.55], // Malmö, am Öresund
  [12.8, 56.0], // Helsingborg
  [12.5, 56.3],
  [12.85, 56.65], // Halmstad
  [12.25, 57.25], // Varberg
  [11.95, 57.7], // hier gründet Schweden 1621 Göteborg
  [11.4, 58.35], // Bohuslän
  [11.15, 58.9], // Strömstad
  [10.6, 59.4], // Ostufer des Oslofjords
  [10.75, 59.9], // Oslo (damals Christiania)
  [10.3, 59.6], // Westufer
  [10.2, 59.1],
  [9.6, 58.9],
  [8.6, 58.3],
  [8.0, 58.15], // Kristiansand
  [6.7, 58.1],
  [5.95, 58.45], // Egersund
  [5.6, 58.9],
  [5.73, 58.97], // Stavanger
  [5.3, 59.4],
  [5.0, 60.0], // am oberen Bildrand
];

// ---------------------------------------------------------------------------
// Britannien
// ---------------------------------------------------------------------------

/** Die Ostküste: Caithness → Firth of Forth → Humber → Dover. */
const BRITANNIEN_OST = [
  [-3.0, 58.62], // Duncansby Head
  [-3.1, 58.4], // Wick
  [-3.9, 57.85],
  [-4.15, 57.5], // Inverness, am Ende des Moray Firth
  [-3.5, 57.7],
  [-2.6, 57.68], // Banff
  [-1.8, 57.5], // Peterhead
  [-2.1, 57.15], // Aberdeen
  [-2.45, 56.7], // Montrose
  [-2.85, 56.45], // Firth of Tay
  [-3.4, 56.35],
  [-2.9, 56.2], // Fife
  [-2.6, 56.05],
  [-3.2, 56.0], // Firth of Forth, bei Edinburgh
  [-2.4, 55.95],
  [-1.9, 55.65], // Berwick
  [-1.6, 55.05], // Tynemouth, bei Newcastle
  [-1.35, 54.65],
  [-0.55, 54.5], // Whitby
  [-0.1, 54.15], // Flamborough Head
  [-0.05, 53.65], // Humbermündung
  [0.2, 53.5],
  [0.1, 52.95], // The Wash
  [0.6, 52.8],
  [1.35, 52.95], // Cromer
  [1.75, 52.65], // Great Yarmouth
  [1.6, 52.1],
  [1.3, 51.95], // Harwich
  [0.95, 51.5], // Themsemündung
  [1.4, 51.38], // Margate
  [1.4, 51.1], // Dover
];

/** Die Südküste: Dover → Land’s End. */
const BRITANNIEN_SUED = [
  [1.4, 51.1],
  [0.55, 50.85], // Hastings
  [-0.35, 50.79],
  [-1.1, 50.78], // Portsmouth
  [-1.95, 50.62],
  [-2.45, 50.55], // Portland
  [-3.0, 50.6],
  [-3.55, 50.35],
  [-4.15, 50.35], // Plymouth
  [-4.7, 50.2],
  [-5.2, 50.1],
  [-5.7, 50.07], // Land’s End, außerhalb des Bildes
];

/**
 * Die Westküste — grob gehalten, denn sie liegt fast vollständig links
 * außerhalb des Ausschnitts. Nur der Bristolkanal und die Mündung des Mersey
 * liegen noch im Bild.
 */
const BRITANNIEN_WEST = [
  [-5.7, 50.07],
  [-4.2, 51.2], // Nordküste von Devon
  [-3.4, 51.25],
  [-2.7, 51.5], // Grund des Bristolkanals
  [-3.9, 51.6], // Swansea
  [-5.05, 51.7], // Milford Haven
  [-4.6, 52.3],
  [-4.3, 53.3], // Anglesey
  [-3.0, 53.4], // Merseymündung
  [-3.05, 54.1],
  [-3.5, 54.9], // Solway Firth
  [-4.9, 54.6],
  [-5.0, 55.3],
  [-5.6, 56.2],
  [-5.5, 57.0],
  [-5.0, 58.3],
  [-4.0, 58.6],
];

// ---------------------------------------------------------------------------
// Die Inseln — ohne sie wäre die Ostsee kein Meer, sondern ein blauer Fleck
// ---------------------------------------------------------------------------

const SJAELLAND = [
  [12.3, 56.12], // Gilleleje
  [12.6, 56.04], // Helsingør
  [12.6, 55.68], // Kopenhagen
  [12.25, 55.4],
  [11.9, 55.0],
  [11.5, 55.2],
  [11.14, 55.33], // Korsør
  [11.1, 55.68], // Kalundborg
  [11.7, 55.75],
  [11.85, 55.97],
];

const FYN = [
  [10.25, 55.62],
  [10.8, 55.45],
  [10.75, 55.1],
  [10.3, 54.85],
  [9.85, 55.05],
  [9.75, 55.35],
  [9.9, 55.55],
];

const LOLLAND_FALSTER = [
  [11.0, 54.77],
  [11.4, 54.65],
  [12.1, 54.8],
  [11.9, 54.95],
  [11.3, 54.95],
];

const BORNHOLM = [
  [14.7, 55.1],
  [14.75, 55.28],
  [15.1, 55.3],
  [15.15, 55.05],
  [14.85, 54.98],
];

/** Rügen — 1628 hielt Stralsund gegenüber der Insel Wallensteins Belagerung aus. */
const RUEGEN = [
  [13.1, 54.4],
  [13.15, 54.6],
  [13.45, 54.68],
  [13.7, 54.55],
  [13.6, 54.35],
  [13.35, 54.25],
];

const OELAND = [
  [16.4, 56.2],
  [16.5, 56.5],
  [16.8, 57.0],
  [17.07, 57.37],
  [16.9, 57.35],
  [16.6, 56.9],
  [16.3, 56.4],
];

const GOTLAND = [
  [18.15, 56.92], // Hoburgen
  [18.2, 57.3],
  [18.3, 57.65], // Visby
  [18.75, 57.9],
  [19.05, 57.93],
  [19.3, 57.55],
  [18.9, 57.2],
  [18.5, 57.0],
];

const SAAREMAA = [
  [21.85, 58.4],
  [22.1, 58.6],
  [22.9, 58.65],
  [23.35, 58.5],
  [23.0, 58.0],
  [22.3, 57.9],
];

// ---------------------------------------------------------------------------
// Flüsse — die Straßen dieses Krieges
// ---------------------------------------------------------------------------
//
// Ein Heer von zwanzigtausend Mann verbraucht am Tag mehr, als ein Dorf im
// Jahr erzeugt. Deshalb marschierten Heere an Flüssen: Auf dem Wasser kam der
// Nachschub, am Ufer lagen die Städte, aus denen man Kontributionen presste.
// Wer wissen will, warum dieser Krieg immer wieder dieselben Landschaften
// verheerte, sieht es an diesen Linien.

const RHEIN = [
  [9.5, 47.5], // Bodensee
  [8.6, 47.6],
  [7.6, 47.6], // Basel
  [7.8, 48.6], // Straßburg
  [8.3, 50.0], // Mainz
  [7.6, 50.4], // Koblenz
  [6.95, 50.94], // Köln
  [6.7, 51.4],
  [6.1, 51.85],
  [5.3, 51.85],
  [4.6, 51.9],
];

const MAIN = [
  [11.5, 49.85],
  [10.9, 49.9], // Bamberg
  [9.93, 49.79], // Würzburg
  [9.15, 49.9],
  [8.68, 50.11], // Frankfurt
  [8.3, 50.0],
];

const DONAU = [
  [8.5, 47.95], // Donaueschingen
  [10.0, 48.4], // Ulm
  [11.4, 48.75],
  [12.1, 49.0], // Regensburg
  [13.46, 48.57], // Passau
  [14.8, 48.4],
  [16.37, 48.15], // Wien
  [17.1, 48.15], // Pressburg
  [19.05, 47.5], // Buda
  [19.6, 46.0],
  [20.5, 44.8], // Belgrad
  [22.5, 44.6], // das Eiserne Tor
  [24.0, 43.8],
  [26.0, 44.0],
  [27.9, 44.5],
  [29.7, 45.2],
];

const ELBE = [
  [14.4, 50.55],
  [14.03, 50.66], // Aussig
  [13.7, 51.05], // Dresden
  [13.47, 51.16], // Meißen
  [12.99, 51.56], // Torgau
  [12.65, 51.87], // Wittenberg
  [12.2, 52.0],
  [11.63, 52.13], // Magdeburg
  [11.3, 52.6],
  [10.9, 53.0],
  [10.0, 53.55], // Hamburg
  [9.2, 53.85],
  [8.7, 53.87],
];

/** Die Moldau — an ihr liegt Prag, wo der Krieg anfängt und aufhört. */
const MOLDAU = [
  [14.3, 48.8],
  [14.47, 48.97], // Budweis
  [14.3, 49.4],
  [14.4, 49.75],
  [14.42, 50.09], // Prag
  [14.48, 50.35], // Mündung in die Elbe bei Melnik
];

/** Die Saale — Breitenfeld und Lützen liegen in ihrem Einzugsgebiet. */
const SAALE = [
  [11.9, 50.3],
  [11.6, 50.93], // Jena
  [11.8, 51.2],
  [11.97, 51.48], // Halle
  [11.88, 51.97],
];

const ODER = [
  [17.6, 49.6],
  [17.03, 51.11], // Breslau
  [16.0, 51.7],
  [15.0, 52.0],
  [14.55, 52.35], // Frankfurt an der Oder
  [14.6, 52.9],
  [14.55, 53.43], // Stettin
  [14.35, 53.75],
  [14.25, 53.92],
];

const WEICHSEL = [
  [19.0, 49.6],
  [19.94, 50.06], // Krakau
  [21.0, 51.4],
  [21.0, 52.23], // Warschau
  [19.5, 52.7],
  [18.6, 53.02], // Thorn
  [18.8, 53.7],
  [18.65, 54.35],
];

const WESER = [
  [9.65, 51.42], // Hannoversch Münden
  [9.4, 52.1], // Hameln
  [9.2, 52.6],
  [8.8, 53.08], // Bremen
  [8.6, 53.4],
  [8.5, 53.6],
];

const SEINE = [
  [4.9, 47.9],
  [3.9, 48.4],
  [3.0, 48.4],
  [2.35, 48.85], // Paris
  [1.5, 49.1],
  [1.1, 49.4],
  [0.2, 49.5],
];

const LOIRE = [
  [3.9, 45.9],
  [2.6, 47.1],
  [1.9, 47.9], // Orléans
  [0.7, 47.4], // Tours
  [-0.5, 47.3],
  [-1.55, 47.2], // Nantes
  [-2.2, 47.28],
];

const RHONE = [
  [6.2, 46.4], // Genfersee
  [4.85, 45.75], // Lyon
  [4.7, 44.4],
  [4.8, 43.9],
  [4.85, 43.35],
];

const PO = [
  [7.5, 44.9],
  [9.2, 45.1],
  [11.0, 45.0],
  [12.3, 44.9],
];

const THEMSE = [
  [-1.7, 51.7],
  [-1.0, 51.6],
  [-0.5, 51.5],
  [-0.13, 51.51], // London
  [0.6, 51.5],
  [0.95, 51.5],
];

// ---------------------------------------------------------------------------
// Die Landmassen
// ---------------------------------------------------------------------------

/**
 * Der Kontinent als ein Umriss — von der Newamündung bis zum Schwarzen Meer.
 *
 * Die Rückwege außerhalb des Bildes (unter dem unteren, links vom linken und
 * rechts vom rechten Rand) sind Absicht: So läuft das Land über den Bildrand
 * hinaus, statt dort abzuknicken. Italien wird dabei unterhalb von 42° N
 * gequert, Griechenland ebenso — beides liegt außerhalb des Ausschnitts und
 * ist unsichtbar.
 */
const KONTINENT = verbinde(
  OSTSEE_OST,
  OSTSEE_SUED,
  DAENEMARK_OST,
  DAENEMARK_WEST,
  NORDSEE,
  FRANKREICH_ATLANTIK,
  SPANIEN_NORD,
  // Rückweg links und unter dem Bild: die Iberische Halbinsel.
  [
    [-7.0, 43.0],
    [-7.5, 40.5],
    [-2.0, 40.0],
    [1.0, 40.8],
  ],
  PYRENAEEN,
  MITTELMEER_FRANKREICH,
  ITALIEN_WEST,
  // Querung Italiens unterhalb des Bildrandes.
  [
    [12.8, 41.0],
    [15.5, 40.5],
  ],
  ITALIEN_ADRIA,
  BALKAN_ADRIA,
  // Querung des Balkans unterhalb des Bildrandes.
  [
    [19.4, 41.3],
    [21.5, 40.6],
    [24.0, 40.5],
    [26.5, 40.4],
    [28.0, 41.0],
  ],
  SCHWARZMEER_WEST,
  // Rückweg rechts und über dem Bild: die russische Steppe und der Norden.
  [
    [32.5, 48.0],
    [32.5, 62.0],
    [30.4, 62.0],
  ],
);

/**
 * Die skandinavische Halbinsel — geschlossen oberhalb des Bildrandes.
 *
 * Finnland fehlt mit Absicht: Es lag zwar seit Jahrhunderten unter der
 * schwedischen Krone, seine Küste beginnt aber erst nördlich von 60° N und
 * damit über dem oberen Bildrand.
 */
const SKANDINAVIEN = verbinde(SCHWEDEN_OST, SKANDINAVIEN_WEST, [
  [4.0, 61.5],
  [10.0, 63.0],
  [17.3, 63.0],
]);

const BRITANNIEN = verbinde(BRITANNIEN_OST, BRITANNIEN_SUED, BRITANNIEN_WEST);

// ---------------------------------------------------------------------------
// Werkzeug: Küstenabschnitte nach Orten schneiden
// ---------------------------------------------------------------------------

/**
 * Der Index des Küstenpunkts, der einem Ort am nächsten liegt.
 *
 * Die Küstenlisten sind lang, und ihre Zählung ändert sich, sobald jemand eine
 * Bucht nachträgt. Deshalb schneiden die Flächen unten nicht nach Index,
 * sondern nach Ort: „von Kolberg bis Danzig" bleibt richtig, auch wenn
 * dazwischen zehn Punkte dazukommen.
 */
const naechsterIndex = (liste, lon, lat) => {
  let beste = 0;
  let abstand = Infinity;
  liste.forEach(([l, b], i) => {
    const d = (l - lon) ** 2 + (b - lat) ** 2;
    if (d < abstand) {
      abstand = d;
      beste = i;
    }
  });
  return beste;
};

/**
 * Ein Küstenabschnitt zwischen zwei Orten — in der Richtung, in der er
 * gebraucht wird.
 *
 * @param {Array<Array<number>>} liste Küstenliste
 * @param {Array<number>} von [lon, lat]
 * @param {Array<number>} bis [lon, lat]
 */
const kueste = (liste, von, bis) => {
  const a = naechsterIndex(liste, von[0], von[1]);
  const b = naechsterIndex(liste, bis[0], bis[1]);
  return a <= b ? liste.slice(a, b + 1) : rueckwaerts(liste.slice(b, a + 1));
};

// ---------------------------------------------------------------------------
// Die Reichsgrenze — eine Linie, kein Block
// ---------------------------------------------------------------------------

/**
 * Die Landgrenze des Heiligen Römischen Reiches um 1618, von der Nordsee bis
 * zur Ostsee.
 *
 * Sie liegt als blasse Linie über dem Untergrund und nicht als Fläche in den
 * Phasen — genau das ist die Aussage. Innerhalb dieser Linie lagen über
 * dreihundert Herrschaften: sieben Kurfürsten, Hunderte Fürsten, Grafen,
 * Bischöfe, Äbte, freie Reichsstädte und Reichsritter, jeder mit eigenem
 * Recht, eigener Münze, eigenem Zoll. Ein Kaiser regierte das nicht, er
 * verhandelte es.
 *
 * Zwei Gebiete liegen 1618 noch innerhalb der Linie, die 1648 herausfallen:
 * die Republik der Niederlande und die Schweizerische Eidgenossenschaft. Beide
 * waren längst selbständig, gehörten aber förmlich noch zum Reich.
 */
const REICHSGRENZE = [
  [2.1, 51.0], // an der Nordseeküste bei Gravelines
  [2.4, 50.6],
  [3.3, 50.1],
  [4.2, 49.7],
  [5.0, 49.3], // die Ardennen
  [5.4, 48.5],
  [5.5, 47.6],
  [5.2, 46.9],
  [5.7, 46.2],
  [5.9, 45.4], // die Grenze zu Savoyen
  [6.8, 46.0], // der Alpenkamm
  [8.0, 46.0],
  [9.0, 46.2],
  [10.2, 46.4],
  [11.5, 46.5],
  [12.5, 46.5],
  [13.5, 46.3],
  [14.0, 45.9], // der Karst über Triest
  [15.0, 45.9],
  [16.0, 46.3],
  [16.6, 46.9], // die Grenze zu Ungarn
  [17.0, 47.6],
  [16.9, 48.7],
  [17.5, 48.9],
  [18.5, 49.5],
  [18.9, 50.2], // die Grenze Schlesiens zu Polen
  [18.0, 50.7],
  [17.4, 51.2],
  [16.3, 51.4],
  [15.6, 52.3], // die Neumark
  [15.9, 53.0],
  [16.4, 53.8],
  [16.9, 54.55], // an der Ostseeküste, östlich von Pommern
];

// ---------------------------------------------------------------------------
// Bausteine der Phasen — Herrschaften mit Grenzen
// ---------------------------------------------------------------------------

/**
 * Die habsburgischen Länder 1618: Österreich, Tirol, Innerösterreich, die
 * Länder der böhmischen Krone (Böhmen, Mähren, Schlesien, die Lausitz) und
 * das königliche Ungarn.
 *
 * Das ist kein Staat, sondern eine Erbschaft — jedes Land mit eigenen
 * Ständen, eigenen Rechten und einem eigenen Vertrag mit dem Herrscher.
 * Genau daran entzündet sich 1618 der Streit: Böhmen war ein Wahlkönigreich
 * mit einem verbrieften Recht auf Glaubensfreiheit, und die Stände sahen
 * beides bedroht.
 */
const HABSBURG_1618 = verbinde(
  kueste(BALKAN_ADRIA, [13.65, 45.7], [14.5, 45.3]),
  [
    [15.5, 45.8],
    [16.5, 46.3],
    [17.5, 46.6],
    [18.5, 47.2],
    [19.0, 47.9], // die Grenze zum osmanischen Ungarn
    [19.6, 48.6],
    [20.3, 49.1], // die Karpaten
    [19.0, 49.5],
    [18.9, 49.7],
    [18.8, 50.2], // Schlesien
    [18.0, 50.7],
    [17.4, 51.2],
    [16.3, 51.4],
    [15.0, 51.6], // die Lausitz
    [14.6, 51.4],
    [14.2, 51.05],
    [13.4, 50.7], // das Erzgebirge
    [12.5, 50.4],
    [12.2, 50.3],
    [12.4, 49.8], // der Böhmerwald
    [12.6, 49.4],
    [13.4, 48.9],
    [13.46, 48.57], // Passau, am Zusammenfluss von Donau und Inn
    [13.0, 48.3],
    [12.75, 47.9], // die Salzach
    [12.17, 47.58], // Kufstein, am Inn
    [11.0, 47.4],
    [10.2, 47.35], // der Arlberg
    [9.75, 47.5], // Bregenz am Bodensee
    [10.4, 46.6],
    [11.5, 46.5],
    [12.5, 46.5],
    [13.5, 46.3],
    [13.9, 45.9],
  ],
);

/**
 * Dieselben Länder 1648 — nur die Lausitz fehlt.
 *
 * Sie ging 1635 im Prager Frieden an Kursachsen, den Preis dafür, dass der
 * wichtigste protestantische Kurfürst die Seite wechselte. Auf der Karte ist
 * das ein kleiner Zipfel; politisch war es der Versuch, den Krieg im Reich zu
 * beenden — er scheiterte, weil Schweden und Frankreich weiterkämpften.
 */
const HABSBURG_1648 = verbinde(
  kueste(BALKAN_ADRIA, [13.65, 45.7], [14.5, 45.3]),
  [
    [15.5, 45.8],
    [16.5, 46.3],
    [17.5, 46.6],
    [18.5, 47.2],
    [19.0, 47.9],
    [19.6, 48.6],
    [20.3, 49.1],
    [19.0, 49.5],
    [18.9, 49.7],
    [18.8, 50.2],
    [18.0, 50.7],
    [17.4, 51.2],
    [16.3, 51.4],
    [15.4, 51.2], // ohne die Lausitz
    [14.8, 50.9],
    [14.3, 50.9],
    [13.4, 50.7],
    [12.5, 50.4],
    [12.2, 50.3],
    [12.4, 49.8],
    [12.6, 49.4],
    [13.4, 48.9],
    [13.46, 48.57],
    [13.0, 48.3],
    [12.75, 47.9],
    [12.17, 47.58],
    [11.0, 47.4],
    [10.2, 47.35],
    [9.75, 47.5],
    [10.4, 46.6],
    [11.5, 46.5],
    [12.5, 46.5],
    [13.5, 46.3],
    [13.9, 45.9],
  ],
);

/** Das Königreich Frankreich 1618 — östlich davon liegt noch das Reich. */
const FRANKREICH_1618 = verbinde(
  kueste(FRANKREICH_ATLANTIK, [1.6, 50.95], [-1.78, 43.35]),
  PYRENAEEN,
  kueste(MITTELMEER_FRANKREICH, [3.2, 42.3], [7.1, 43.55]),
  [
    [7.0, 43.9],
    [6.5, 44.5],
    [5.9, 45.4],
    [5.7, 46.2],
    [5.2, 46.9],
    [5.5, 47.6],
    [5.4, 48.5],
    [5.0, 49.3],
    [4.2, 49.7],
    [3.3, 50.1],
    [2.4, 50.6],
    [1.9, 50.95],
  ],
);

/**
 * Frankreich 1648 — mit den habsburgischen Rechten im Elsass.
 *
 * Der Westfälische Friede sprach Frankreich zu, was Habsburg im Elsass
 * besessen hatte. Was das genau war, blieb absichtlich unklar formuliert;
 * Frankreich legte es weit aus und schob seine Grenze in den folgenden
 * Jahrzehnten an den Rhein.
 */
const FRANKREICH_1648 = verbinde(
  kueste(FRANKREICH_ATLANTIK, [1.6, 50.95], [-1.78, 43.35]),
  PYRENAEEN,
  kueste(MITTELMEER_FRANKREICH, [3.2, 42.3], [7.1, 43.55]),
  [
    [7.0, 43.9],
    [6.5, 44.5],
    [5.9, 45.4],
    [5.7, 46.2],
    [5.2, 46.9],
    [6.0, 47.4],
    [7.6, 47.6], // Basel, am Rhein
    [7.8, 48.6], // Straßburg
    [8.1, 49.0], // Lauterburg
    [6.4, 49.5], // über Lothringen hinweg
    [5.6, 49.5],
    [5.0, 49.3],
    [4.2, 49.7],
    [3.3, 50.1],
    [2.4, 50.6],
    [1.9, 50.95],
  ],
);

/** Die Spanischen Niederlande — spanisch regiert und förmlich im Reich. */
const SPANISCHE_NIEDERLANDE = verbinde(
  kueste(NORDSEE, [2.4, 51.1], [3.4, 51.45]),
  [
    [3.8, 51.3],
    [4.6, 51.45],
    [5.4, 51.4],
    [6.1, 51.1],
    [6.3, 50.5],
    [6.5, 49.9], // Luxemburg
    [6.4, 49.5],
    [5.6, 49.5],
    [5.0, 49.3],
    [4.2, 49.7],
    [3.3, 50.1],
    [2.4, 50.6],
  ],
);

/**
 * Die Republik der Sieben Vereinigten Niederlande.
 *
 * 1618 war sie im Waffenstillstand mit Spanien; 1621 ging der Krieg weiter,
 * und damit hing er mit dem Krieg im Reich zusammen — dieselben spanischen
 * Truppen, dieselben Straßen, dasselbe Geld.
 */
const REPUBLIK = verbinde(
  kueste(NORDSEE, [3.4, 51.45], [7.2, 53.6]),
  [
    [7.1, 53.2],
    [6.9, 52.6],
    [6.7, 52.2],
    [6.1, 51.9],
    [5.9, 51.8],
    [5.3, 51.7],
    [4.6, 51.45],
    [3.8, 51.3],
  ],
);

/** Das Königreich Dänemark: Jütland mit Schleswig und Holstein. */
const DAENEMARK_JUETLAND = verbinde(
  DAENEMARK_WEST,
  rueckwaerts(DAENEMARK_OST),
  [
    [10.6, 54.05],
    [10.87, 53.87],
    [9.9, 53.9],
    [8.9, 53.9],
  ],
);

/** Die dänischen Inseln — Seeland mit Kopenhagen, Fünen, Lolland und Falster. */
const DAENEMARK_INSELN = [SJAELLAND, FYN, LOLLAND_FALSTER];

/**
 * Norwegen, Schonen, Halland und Blekinge — alles dieselbe Krone.
 *
 * Dänemark-Norwegen umfasste 1618 auch den ganzen Süden und Westen der
 * skandinavischen Halbinsel. Schweden hatte zur Nordsee hin nur ein schmales
 * Fenster an der Mündung des Göta älv — dort gründete Gustav Adolf 1621
 * Göteborg. Wer wissen will, warum Schweden nach Süden drängte, sieht es hier.
 */
const DAENEMARK_NORWEGEN = verbinde(
  kueste(SKANDINAVIEN_WEST, [13.0, 55.38], [5.0, 60.0]),
  [
    [4.0, 61.5],
    [10.0, 62.5],
    [12.5, 61.0],
    [12.2, 59.8],
    [12.5, 59.0],
    [12.4, 58.1], // der schwedische Zugang zum Meer bei Göteborg
    [12.0, 57.6],
    [13.0, 57.8],
    [14.0, 57.2],
    [15.0, 56.6],
    [15.6, 56.2],
    [14.2, 55.85],
    [14.35, 55.4],
    [13.6, 55.38],
  ],
);

/** Das Königreich Schweden auf der Halbinsel — 1618 ohne den Süden. */
const SCHWEDEN_REICH = verbinde(
  kueste(SCHWEDEN_OST, [17.3, 61.0], [16.2, 56.5]),
  [
    [15.6, 56.2],
    [15.0, 56.6],
    [14.0, 57.2],
    [13.0, 57.8],
    [12.0, 57.6],
    [12.4, 58.1],
    [12.5, 59.0],
    [12.2, 59.8],
    [12.5, 61.0],
  ],
);

/** Schwedisch-Estland — seit 1561 unter der Krone Schwedens. */
const SCHWEDEN_ESTLAND = verbinde(
  kueste(OSTSEE_OST, [23.4, 58.75], [30.4, 60.0]),
  [
    [31.0, 59.0],
    [30.0, 58.6],
    [28.0, 58.4],
    [26.0, 58.0],
    [24.6, 58.1],
  ],
);

/**
 * Schwedisch-Livland und Estland — nach den Kriegen gegen Polen bis 1629.
 *
 * Riga fiel 1621, der Waffenstillstand von Altmark 1629 sicherte den Gewinn.
 * Erst dieser Friede machte den Weg ins Reich frei: Solange Schweden gegen
 * Polen kämpfte, konnte Gustav Adolf nicht nach Deutschland.
 */
const SCHWEDEN_LIVLAND = verbinde(
  kueste(OSTSEE_OST, [24.1, 57.05], [30.4, 60.0]),
  [
    [31.0, 59.0],
    [30.5, 57.5],
    [28.0, 56.8],
    [26.0, 56.6],
    [24.5, 56.9],
  ],
);

/**
 * Polen-Litauen mit dem Herzogtum Preußen und Kurland als Lehen.
 *
 * Die größte Fläche dieser Karte und in unserer Erzählung fast unsichtbar —
 * dabei hängt beides zusammen: Weil Schweden hier gebunden war, begann sein
 * Eingreifen im Reich erst 1630. Und seit 1618 regierte der Kurfürst von
 * Brandenburg das Herzogtum Preußen, ein polnisches Lehen: derselbe Fürst,
 * zwei Herren.
 */
const POLEN_LITAUEN_1618 = verbinde(
  kueste(OSTSEE_SUED, [16.9, 54.55], [18.65, 54.35]),
  kueste(OSTSEE_OST, [18.65, 54.35], [22.6, 57.75]),
  [
    [24.0, 57.0],
    [26.0, 56.4],
    [31.0, 55.0],
    [31.0, 49.5],
    [24.0, 48.9],
    [22.0, 49.2],
    [20.3, 49.1],
    [19.0, 49.5],
    [18.9, 50.2],
    [18.0, 50.7],
    [17.4, 51.2],
    [16.3, 51.4],
    [15.6, 52.3],
    [15.9, 53.0],
    [16.4, 53.8],
  ],
);

/** Polen-Litauen nach 1629 — Livland ist an Schweden verloren. */
const POLEN_LITAUEN_1648 = verbinde(
  kueste(OSTSEE_SUED, [16.9, 54.55], [18.65, 54.35]),
  kueste(OSTSEE_OST, [18.65, 54.35], [22.6, 57.75]),
  [
    [23.8, 56.9],
    [24.5, 56.9],
    [26.0, 56.6],
    [28.0, 56.8],
    [30.5, 57.5],
    [31.0, 55.0],
    [31.0, 49.5],
    [24.0, 48.9],
    [22.0, 49.2],
    [20.3, 49.1],
    [19.0, 49.5],
    [18.9, 50.2],
    [18.0, 50.7],
    [17.4, 51.2],
    [16.3, 51.4],
    [15.6, 52.3],
    [15.9, 53.0],
    [16.4, 53.8],
  ],
);

/**
 * Die Reichweite der schwedischen Heere 1630 bis 1632 — kein Staatsgebiet.
 *
 * Diese Fläche behauptet nichts über Grenzen, und sie behauptet auch nicht,
 * dass hier überall Schweden regierte. Sie zeigt, wie weit die Heere Gustav
 * Adolfs und seiner protestantischen Verbündeten in zwei Jahren kamen: von
 * der pommerschen Küste über Brandenburg und Sachsen bis an den Main, den
 * Rhein bei Mainz und die Donau — im Mai 1632 stand der König in München.
 * Was hier lag, war besetzt, zahlte Kontributionen und konnte im nächsten
 * Feldzug wieder verloren sein. Genau das ist die Aussage.
 */
const SCHWEDISCHER_VORMARSCH = verbinde(
  kueste(OSTSEE_SUED, [10.87, 53.87], [16.2, 54.25]),
  [
    [15.5, 53.2],
    [14.8, 52.4],
    [15.0, 51.5],
    [14.4, 51.0],
    [13.5, 50.6],
    [12.4, 50.2],
    [12.0, 49.4],
    [11.6, 48.9],
    [11.6, 48.15], // München
    [10.9, 48.4],
    [10.0, 48.5],
    [8.7, 49.5],
    [8.3, 50.0], // Mainz
    [7.9, 50.6],
    [8.5, 51.4],
    [9.3, 52.2],
    [9.0, 53.0],
    [9.6, 53.7],
  ],
);

/** Vorpommern mit Stettin — 1648 an Schweden. */
const SCHWEDEN_VORPOMMERN = verbinde(
  kueste(OSTSEE_SUED, [13.1, 54.31], [14.25, 53.92]),
  [
    [14.4, 53.6],
    [13.8, 53.4],
    [13.2, 53.6],
    [13.0, 54.05],
  ],
);

/** Wismar — 1648 an Schweden, ein Hafen als Brückenkopf. */
const SCHWEDEN_WISMAR = [
  [11.28, 53.92],
  [11.62, 53.92],
  [11.62, 53.76],
  [11.28, 53.76],
];

/** Die Stifte Bremen und Verden zwischen Weser und Elbe — 1648 an Schweden. */
const SCHWEDEN_BREMEN_VERDEN = [
  [8.5, 53.6],
  [9.3, 53.6],
  [9.6, 53.2],
  [9.2, 52.85],
  [8.7, 52.9],
  [8.5, 53.2],
];

/**
 * Die Schweizerische Eidgenossenschaft — 1648 förmlich aus dem Reich gelöst.
 *
 * Sie war seit 1499 selbständig und im Krieg neutral geblieben; der
 * Westfälische Friede zog nur nach, was seit anderthalb Jahrhunderten galt.
 */
const SCHWEIZ = [
  [6.15, 46.2], // Genf
  [7.0, 45.95],
  [8.4, 46.0],
  [9.2, 46.3],
  [10.15, 46.6],
  [10.45, 46.9],
  [9.6, 47.35],
  [9.5, 47.6], // Bodensee
  [8.6, 47.6],
  [7.6, 47.6], // Basel
  [7.0, 47.5],
  [6.4, 47.0],
  [5.95, 46.6],
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

/** Ein Fluss — nur Linie, keine Fläche. */
const fluss = (orte) => ({
  art: 'fluss',
  d: geo.pfad(orte, { geschlossen: false }),
  fill: 'none',
  stroke: KARTENFARBEN.fluss,
  strokeWidth: 2,
});

/** Die Reichsgrenze als blasse Linie über dem Untergrund. */
const reichsgrenze = () => ({
  art: 'reichsgrenze',
  d: geo.pfad(REICHSGRENZE, { geschlossen: false }),
  fill: 'none',
  stroke: KARTENFARBEN.grenze,
  strokeWidth: 1.4,
});

/** Eine Gebietsfläche einer Phase. */
const gebiet = (titel, orte) => ({ titel, d: geo.pfad(orte) });

/**
 * Eine Gebietsfläche aus mehreren getrennten Stücken.
 *
 * Schwedens Gewinne von 1648 lagen an drei Stellen der Küste, und die
 * dänischen Inseln sind drei Inseln — beides ist eine Herrschaft und gehört
 * deshalb in eine Fläche mit einem Titel. SVG kann das: mehrere geschlossene
 * Teilpfade in einem `d`.
 */
const gebietTeile = (titel, stuecke) => ({
  titel,
  d: stuecke.map((orte) => geo.pfad(orte)).join(' '),
});

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
    land(SKANDINAVIEN),
    land(BRITANNIEN),
    land(SJAELLAND),
    land(FYN),
    land(LOLLAND_FALSTER),
    land(BORNHOLM),
    land(RUEGEN),
    land(OELAND),
    land(GOTLAND),
    land(SAAREMAA),
    fluss(RHEIN),
    fluss(MAIN),
    fluss(DONAU),
    fluss(ELBE),
    fluss(MOLDAU),
    fluss(SAALE),
    fluss(ODER),
    fluss(WEICHSEL),
    fluss(WESER),
    fluss(SEINE),
    fluss(LOIRE),
    fluss(RHONE),
    fluss(PO),
    fluss(THEMSE),
    reichsgrenze(),
  ],

  phasen: [
    {
      id: 'aufstand',
      label: '1618',
      hinweis:
        'Das Reich am Vorabend des Krieges. Die blasse Linie ist die Reichsgrenze — und mehr lässt sich vom Reich ehrlich nicht zeichnen: Es war ein Flickenteppich, kein Block. Innerhalb dieser Linie lagen über dreihundert Herrschaften mit eigenem Recht, eigener Münze und eigenem Glauben. Eingefärbt ist nur, was wirklich Grenzen hatte. Achte auf die habsburgischen Länder: Böhmen, wo im Mai 1618 der Aufstand beginnt, gehört dazu — als Wahlkönigreich mit verbriefter Glaubensfreiheit. Weil alle Flächen dieselbe Farbe tragen, verschmelzen Nachbarn wie die Spanischen Niederlande und die Republik zu einem Block; nur die Titel sagen, wer wer ist.',
      flaechen: [
        gebiet('Die habsburgischen Länder — Österreich, Böhmen, Mähren, Schlesien, die Lausitz und das königliche Ungarn', HABSBURG_1618),
        gebiet('Das Königreich Frankreich', FRANKREICH_1618),
        gebiet('Die Spanischen Niederlande — spanisch regiert, förmlich noch im Reich', SPANISCHE_NIEDERLANDE),
        gebiet('Die Republik der Sieben Vereinigten Niederlande — im Waffenstillstand mit Spanien', REPUBLIK),
        gebiet('Das Königreich Dänemark — Jütland, Schleswig und Holstein', DAENEMARK_JUETLAND),
        gebietTeile('Die dänischen Inseln mit Kopenhagen', DAENEMARK_INSELN),
        gebiet('Norwegen, Schonen, Halland und Blekinge — dieselbe dänische Krone', DAENEMARK_NORWEGEN),
        gebiet('Das Königreich Schweden', SCHWEDEN_REICH),
        gebiet('Schwedisch-Estland', SCHWEDEN_ESTLAND),
        gebiet('Polen-Litauen — mit dem Herzogtum Preußen und Kurland als Lehen', POLEN_LITAUEN_1618),
      ],
    },
    {
      id: 'hoehepunkt',
      label: '1631–1632',
      hinweis:
        'Der Krieg auf seinem Höhepunkt. Im Mai 1631 wird Magdeburg erobert und brennt aus; im September schlägt Gustav Adolf mit Kursachsen bei Breitenfeld das kaiserlich-ligistische Heer, im November 1632 fällt er selbst bei Lützen. Die große Fläche im Reich ist mit Bedacht so benannt, wie sie gemeint ist: die Reichweite eines Heeres, kein Staatsgebiet. Was darin lag, war besetzt und zahlte Kontributionen — und konnte im nächsten Feldzug wieder verloren sein. Böhmen liegt bewusst außerhalb, obwohl sächsische Truppen im November 1631 sogar in Prag standen: Sie blieben nur einen Winter.',
      flaechen: [
        gebiet('Die habsburgischen Länder', HABSBURG_1618),
        gebiet('Die Reichweite der schwedischen Heere 1630–1632 — kein Staatsgebiet, sondern besetztes Land', SCHWEDISCHER_VORMARSCH),
        gebiet('Das Königreich Schweden', SCHWEDEN_REICH),
        gebiet('Schwedisch-Livland und Estland — seit 1629 gesichert', SCHWEDEN_LIVLAND),
        gebiet('Das Königreich Frankreich — noch nicht im Krieg, aber Geldgeber Schwedens', FRANKREICH_1618),
        gebiet('Die Spanischen Niederlande', SPANISCHE_NIEDERLANDE),
        gebiet('Die Republik der Sieben Vereinigten Niederlande — seit 1621 wieder im Krieg mit Spanien', REPUBLIK),
        gebiet('Das Königreich Dänemark — seit 1629 aus dem Krieg heraus', DAENEMARK_JUETLAND),
        gebietTeile('Die dänischen Inseln mit Kopenhagen', DAENEMARK_INSELN),
        gebiet('Norwegen, Schonen, Halland und Blekinge', DAENEMARK_NORWEGEN),
        gebiet('Polen-Litauen', POLEN_LITAUEN_1618),
      ],
    },
    {
      id: 'westfaelischer-friede',
      label: '1648',
      hinweis:
        'Der Westfälische Friede, unterzeichnet am 24. Oktober 1648 in Münster und Osnabrück. Auf der Karte sieht man drei Dinge: Schweden sitzt jetzt selbst im Reich — in Vorpommern, in Wismar, in Bremen und Verden. Frankreich hat die habsburgischen Rechte im Elsass. Und die Republik der Niederlande und die Schweiz sind förmlich aus dem Reich heraus. Nicht zu sehen ist das Wichtigste: Die Reichsstände bekamen Landeshoheit und das Recht, eigene Bündnisse zu schließen — die Grenzen im Reich blieben, aber wer darin herrschte, war von nun an fast souverän. Und der Krieg war nicht überall zu Ende: Spanien und Frankreich kämpften bis 1659 weiter.',
      flaechen: [
        gebiet('Die habsburgischen Länder — ohne die Lausitz, die 1635 an Kursachsen fiel', HABSBURG_1648),
        gebietTeile('Schweden im Reich — Vorpommern mit Rügen, Wismar, die Stifte Bremen und Verden', [
          SCHWEDEN_VORPOMMERN,
          SCHWEDEN_WISMAR,
          SCHWEDEN_BREMEN_VERDEN,
        ]),
        gebiet('Das Königreich Schweden', SCHWEDEN_REICH),
        gebiet('Schwedisch-Livland und Estland', SCHWEDEN_LIVLAND),
        gebiet('Das Königreich Frankreich — mit den habsburgischen Rechten im Elsass', FRANKREICH_1648),
        gebiet('Die Republik der Sieben Vereinigten Niederlande — seit 1648 nicht mehr Teil des Reiches', REPUBLIK),
        gebiet('Die Schweizerische Eidgenossenschaft — seit 1648 aus dem Reich gelöst', SCHWEIZ),
        gebiet('Die Spanischen Niederlande — Spanien kämpft gegen Frankreich weiter', SPANISCHE_NIEDERLANDE),
        gebiet('Das Königreich Dänemark', DAENEMARK_JUETLAND),
        gebietTeile('Die dänischen Inseln mit Kopenhagen', DAENEMARK_INSELN),
        gebiet('Norwegen, Schonen, Halland und Blekinge', DAENEMARK_NORWEGEN),
        gebiet('Polen-Litauen', POLEN_LITAUEN_1648),
      ],
    },
  ],

  punkte: [
    {
      id: 'prag',
      name: 'Prag',
      typ: 'ereignis',
      ...ort(14.42, 50.09),
      text: [
        'Am 23. Mai 1618 warfen böhmische Adlige zwei kaiserliche Statthalter',
        'und einen Schreiber aus einem Fenster der Prager Burg, rund siebzehn',
        'Meter tief. Alle drei überlebten — die katholische Seite sah darin',
        'Gottes Hand, die protestantische einen Misthaufen. Der Streit dahinter',
        'war handfest: Kaiser Rudolf II. hatte 1609 im „Majestätsbrief" die',
        'Glaubensfreiheit verbrieft, und die Stände sahen dieses Recht gebrochen.',
        'Böhmen war ein Wahlkönigreich; die Stände setzten Ferdinand ab und',
        'wählten den calvinistischen Kurfürsten Friedrich V. von der Pfalz. Am',
        '8. November 1620 verloren sie am Weißen Berg vor der Stadt in gut zwei',
        'Stunden alles. 1621 wurden auf dem Altstädter Ring 27 Anführer',
        'hingerichtet, das Land wurde katholisch gemacht, der Adel enteignet.',
        'Und ein Kreis schließt sich: 1648 standen schwedische Truppen auf der',
        'Prager Kleinseite, als die Nachricht vom Frieden kam. Der Krieg endete,',
        'wo er begonnen hatte.',
      ].join(' '),
    },
    {
      id: 'wien',
      name: 'Wien',
      typ: 'stadt',
      ...ort(16.37, 48.21),
      text: [
        'Hier saß der Kaiser — und hier sieht man, wie wenig das hieß. Das',
        'Heilige Römische Reich war kein Staat: Über dreihundert Herrschaften mit',
        'eigenem Recht, sieben Kurfürsten, die den Kaiser wählten, ein Reichstag,',
        'ohne den er kein Geld und keine Truppen bekam. Ferdinand II., ab 1619',
        'Kaiser, war tief gläubig und entschlossen, den Katholizismus',
        'zurückzubringen. 1629 erließ er das Restitutionsedikt: Alles',
        'Kirchengut, das seit 1552 protestantisch geworden war, sollte',
        'zurückgegeben werden. Juristisch ließ sich das begründen — politisch war',
        'es eine Bombe, denn nun stand der Besitz halb Norddeutschlands zur',
        'Debatte, und selbst katholische Fürsten fürchteten einen Kaiser, der so',
        'weit greifen konnte. 1630 zwangen ihn die Kurfürsten in Regensburg,',
        'Wallenstein zu entlassen. Der mächtigste Mann des Reiches war abhängig',
        'von den Fürsten, die ihn gewählt hatten.',
      ].join(' '),
    },
    {
      id: 'magdeburg',
      name: 'Magdeburg',
      typ: 'ereignis',
      ...ort(11.63, 52.13),
      text: [
        'Am 20. Mai 1631 fiel die Stadt. Belagert hatte sie seit November 1630',
        'Pappenheim, ab April führte Tilly das kaiserlich-ligistische Heer. Beim',
        'Sturm brach Feuer aus, und von rund 25 000 bis 30 000 Menschen starben',
        'etwa 20 000. Wer das Feuer legte, ist bis heute umstritten: Tilly',
        'beschuldigte die Verteidiger, die protestantischen Flugschriften die',
        'kaiserlichen Truppen; die Forschung hält beides für möglich. Aus dem',
        'Namen der Stadt wurde ein Verb — „magdeburgisieren". Der nüchterne Teil',
        'der Sache gehört in die Erzählung der Entscheider: Ein Heer von',
        '25 000 Mann, das kein Geld bekam, brauchte die Vorräte der Stadt, und',
        'die Plünderung war der versprochene Lohn. Das war kein Ausrutscher',
        'einzelner Unmenschen, sondern die Folge einer Entscheidung, wie man',
        'Krieg bezahlt. Besser wird es davon nicht. Magdeburg wurde außerdem der',
        'erste große Medienkrieg Europas: Hunderte Druckschriften, in ganz Europa',
        'gelesen.',
      ].join(' '),
    },
    {
      id: 'breitenfeld',
      name: 'Breitenfeld',
      typ: 'ereignis',
      ...ort(12.37, 51.44),
      text: [
        'Am 17. September 1631 nördlich von Leipzig: Gustav Adolf und der',
        'sächsische Kurfürst schlagen Tillys Heer. Es ist der erste große Sieg',
        'der protestantischen Seite — und ein Lehrstück in Militärtechnik. Die',
        'Schweden kämpften in kleineren, beweglichen Einheiten, ließen Musketen',
        'in Salven feuern und führten leichte Geschütze mit, die man während der',
        'Schlacht umsetzen konnte. Tilly, siebzig Jahre alt und bis dahin',
        'ungeschlagen, verlor rund 7 600 Mann und wurde verwundet. Die Folge:',
        'Der Krieg verlagerte sich nach Süden, in Gebiete, die ihn bis dahin',
        'nur vom Hörensagen kannten. Und noch eine Folge, die man in der',
        'Siegesmeldung nicht liest: Breitenfeld beendete den Krieg nicht,',
        'sondern verlängerte ihn. Von nun an war keine Seite mehr stark genug,',
        'um zu gewinnen, und keine schwach genug, um aufzugeben.',
      ].join(' '),
    },
    {
      id: 'luetzen',
      name: 'Lützen',
      typ: 'ereignis',
      ...ort(12.14, 51.25),
      text: [
        'Am 16. November 1632, im Nebel südwestlich von Leipzig, treffen Gustav',
        'Adolf und Wallenstein aufeinander. Die Schweden behielten das Feld,',
        'aber der König fiel — mit siebenunddreißig Jahren, von seinen Truppen',
        'getrennt, im Nahkampf erschossen. Für die protestantische Seite war er',
        'sofort ein Märtyrer, für die katholische ein Eindringling, der endlich',
        'weg war. Beide irrten sich in der Wirkung: Schweden führte den Krieg',
        'unter Reichskanzler Oxenstierna weiter, sechzehn Jahre lang. Das ist',
        'der unbequeme Befund aus Sicht der Entscheider — der Tod des größten',
        'Feldherrn änderte am Krieg fast nichts. Er hatte sich vom Willen',
        'einzelner Männer gelöst und lief weiter, weil Heere, Geldgeber und',
        'Verträge ihn weiterlaufen ließen. Zwei Jahre später traf es die andere',
        'Seite: 1634 ließ der Kaiser Wallenstein in Eger ermorden.',
      ].join(' '),
    },
    {
      id: 'muenster-osnabrueck',
      name: 'Münster und Osnabrück',
      typ: 'stadt',
      ...ort(7.85, 52.12),
      text: [
        'Hier wurde von 1644 bis 1648 verhandelt — in zwei Städten, weil die',
        'Konfessionen nicht an einem Tisch sitzen wollten: die katholische Seite',
        'mit Frankreich in Münster, die protestantische mit Schweden in',
        'Osnabrück. Rund 150 Gesandtschaften, kein einziges Treffen aller',
        'Beteiligten, jahrelanger Streit über Rangfolgen und Anreden — und am',
        'Ende, am 24. Oktober 1648, ein Vertragswerk, das Europa umbaute. Der',
        'Augsburger Religionsfrieden wurde bestätigt und auf die Reformierten',
        'ausgedehnt; für das Kirchengut galt das „Normaljahr" 1624 als Maßstab.',
        'Die Reichsstände erhielten Landeshoheit und das Recht auf eigene',
        'Bündnisse. Schweden bekam Vorpommern, Wismar, Bremen und Verden,',
        'Frankreich die habsburgischen Rechte im Elsass, Brandenburg',
        'Hinterpommern und Bistümer, Bayern die Kurwürde — die Pfalz erhielt',
        'eine neue, achte. Die Niederlande und die Schweiz waren nun förmlich',
        'außerhalb des Reiches. Der Papst protestierte gegen den Vertrag; er',
        'wurde trotzdem geschlossen. Nicht weil man einig war, sondern weil',
        'niemand mehr gewinnen konnte.',
      ].join(' '),
    },
    {
      id: 'rocroi',
      name: 'Rocroi',
      typ: 'ereignis',
      ...ort(4.52, 49.92),
      text: [
        'Am 19. Mai 1643 schlug hier, an der Grenze zu den Spanischen',
        'Niederlanden, ein französisches Heer unter dem 21-jährigen Herzog von',
        'Enghien — später als „der große Condé" bekannt — die spanische Armee.',
        'Der Ruf der spanischen Tercios als unbesiegbar war damit dahin, auch',
        'wenn die Legende übertreibt: Spanien blieb gefährlich und gewann noch',
        '1656 bei Valenciennes. Wichtiger ist, was Rocroi über diesen Krieg',
        'sagt. Frankreich kämpfte seit 1635 mit — ein katholisches Königreich,',
        'geführt von Kardinal Richelieu, das die protestantischen Schweden mit',
        'Geld ausstattete und gegen das katholische Habsburg zu Felde zog. Wer',
        'noch geglaubt hatte, es gehe in diesem Krieg allein um den rechten',
        'Glauben, konnte es hier nicht mehr glauben. Es ging auch um Macht — und',
        'die Regel dafür hieß Staatsräson: Was dem Staat nützt, ist erlaubt.',
      ].join(' '),
    },
  ],

  bewegungen: [
    {
      id: 'kaiserliche',
      name: 'Die kaiserlichen und ligistischen Heere ziehen nach Norden (1630/31)',
      von: p(12.1, 49.0),
      ueber: [p(10.9, 49.9), p(11.0, 51.0)],
      nach: p(11.63, 52.13),
      text: [
        'Diese Linie fasst zusammen, was viele Marschbefehle waren: Aus dem',
        'Süden und aus Franken verlegten die kaiserlichen und ligistischen',
        'Heere nach Norden. Am Anfang steht Regensburg, wo die Kurfürsten 1630',
        'die Entlassung Wallensteins erzwangen; am Ende Magdeburg, das am 20.',
        'Mai 1631 fiel. Warum überhaupt marschiert wurde, ist der unbequeme',
        'Kern der Sache: Ein Heer dieser Größe hatte eine Landschaft nach',
        'wenigen Monaten aufgezehrt. Wallensteins Satz „Der Krieg ernährt den',
        'Krieg" bedeutete, dass die Truppen sich aus dem Land holten, was die',
        'Kriegskasse nicht hergab — Kontributionen, Quartier, Verpflegung, und',
        'wo es nichts mehr gab, Gewalt. Das war eine Entscheidung der',
        'Entscheider, kein Naturgesetz. Sie hielten sie für die einzige, mit',
        'der man einen so langen Krieg überhaupt führen konnte.',
      ].join(' '),
    },
    {
      id: 'gustav-adolf',
      name: 'Gustav Adolf im Reich (1630–1632)',
      von: p(13.77, 54.13),
      ueber: [
        p(14.55, 53.43),
        p(14.55, 52.35),
        p(12.5, 52.4),
        p(12.37, 51.44),
        p(11.08, 49.45),
        p(10.9, 48.55),
      ],
      nach: p(12.14, 51.25),
      text: [
        'Am 6. Juli 1630 landete der schwedische König mit rund 13 000 Mann bei',
        'Peenemünde auf Usedom. Möglich war das erst, seit der Waffenstillstand',
        'von Altmark 1629 den Krieg gegen Polen beendet hatte. Der Weg führte',
        'über Stettin und Frankfurt an der Oder nach Brandenburg, wo Gustav',
        'Adolf seinen eigenen Schwager mit Kanonen zum Bündnis nötigte, dann',
        'nach Sachsen und im September 1631 zum Sieg bei Breitenfeld, weiter',
        'nach Franken, an den Rhein und über den Lech bis München — und',
        'schließlich zurück nach Norden, wo er im November 1632 bei Lützen',
        'fiel. Wer war er? Beides: ein frommer Lutheraner, der die',
        'Glaubensgenossen im Reich retten wollte, und ein Machtpolitiker, der',
        'die Ostsee zum schwedischen Meer machen wollte und sich von Frankreich',
        'dafür bezahlen ließ. Seine Heere lebten wie alle anderen vom Land, das',
        'sie besetzten.',
      ].join(' '),
    },
    {
      id: 'franzosen',
      name: 'Das französische Heer nach Rocroi (1643)',
      von: p(2.35, 48.85),
      ueber: [p(3.5, 49.4)],
      nach: p(4.52, 49.92),
      text: [
        'Im Mai 1643 marschierte ein französisches Heer aus dem Raum um Paris',
        'nach Norden an die Grenze der Spanischen Niederlande und schlug am 19.',
        'Mai bei Rocroi die spanische Armee. Frankreich war seit 1635 offen im',
        'Krieg; vorher hatte es jahrelang gezahlt, statt zu kämpfen — Schweden',
        'erhielt seit dem Vertrag von Bärwalde 1631 französische Gelder. Der',
        'Mann dahinter war Kardinal Richelieu: ein katholischer Kirchenfürst,',
        'der die protestantische Sache im Reich unterstützte, weil ein',
        'geschwächtes Habsburg Frankreich nützte. Er nannte das Staatsräson.',
        'Für die Bevölkerung in Lothringen, Elsass, Burgund und Norditalien',
        'bedeutete es, dass der Krieg auch dort einzog. Wer diesen Pfeil',
        'ansieht, sieht das Ende einer Legende: Dieser Krieg war da schon lange',
        'keine Auseinandersetzung mehr zwischen zwei Bekenntnissen.',
      ].join(' '),
    },
  ],

  beschriftungen: [
    { text: 'Böhmen', art: 'land', ...ort(14.2, 49.1) },
    { text: 'Sachsen', art: 'land', ...ort(13.2, 51.3) },
    { text: 'Brandenburg', art: 'land', ...ort(13.4, 52.7) },
    { text: 'Pommern', art: 'land', ...ort(15.6, 53.6) },
    { text: 'Bayern', art: 'land', ...ort(11.5, 48.3) },
    { text: 'Franken', art: 'land', ...ort(10.3, 49.9) },
    { text: 'Schlesien', art: 'land', ...ort(18.2, 50.4) },
    { text: 'Österreich', art: 'land', ...ort(13.0, 47.2) },
    { text: 'Ungarn', art: 'land', ...ort(18.6, 47.0) },
    { text: 'Niederlande', art: 'land', ...ort(5.2, 52.8) },
    { text: 'Frankreich', art: 'land', ...ort(2.2, 47.6) },
    { text: 'Dänemark', art: 'land', ...ort(9.2, 56.4) },
    { text: 'Schweden', art: 'land', ...ort(14.6, 58.4) },
    { text: 'Norwegen', art: 'land', ...ort(8.4, 59.4) },
    { text: 'Polen-Litauen', art: 'land', ...ort(20.6, 52.6) },
    { text: 'England', art: 'land', ...ort(-1.4, 52.5) },
    { text: 'Schweiz', art: 'land', ...ort(8.2, 46.7) },
    { text: 'Italien', art: 'land', drehung: 50, ...ort(11.3, 44.3) },
    { text: 'Ostsee', art: 'meer', ...ort(17.6, 55.7) },
    { text: 'Nordsee', art: 'meer', ...ort(4.2, 55.4) },
    { text: 'Atlantik', art: 'meer', ...ort(-2.2, 45.4) },
    { text: 'Mittelmeer', art: 'meer', ...ort(5.6, 42.6) },
    { text: 'Adria', art: 'meer', ...ort(14.8, 44.2) },
    { text: 'Rhein', art: 'meer', drehung: 74, ...ort(7.4, 48.3) },
    { text: 'Donau', art: 'meer', drehung: -20, ...ort(20.6, 45.0) },
    { text: 'Elbe', art: 'meer', drehung: 60, ...ort(10.0, 53.6) },
  ],
};

module.exports = karte;
