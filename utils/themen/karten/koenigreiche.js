// Die Karte zum Thema „Die frühen Königreiche" — Geschichte in Bewegung.
//
// Die Küstenlinien stehen hier als echte Längen-/Breitengrade `[lon, lat]` und
// werden von utils/karte-geo.js in SVG-Koordinaten umgerechnet. Wer einen Punkt
// anzweifelt, schlägt ihn im Atlas nach: `[12.5, 41.9]` ist Rom, `[6.08, 50.78]`
// Aachen, `[-4.02, 39.86]` Toledo.
//
// Der Ausschnitt ist enger als bei „Germanen und Völkerwanderung". Das ist
// Absicht. Dort musste die Steppe östlich des Don ins Bild, weil von dort der
// Druck kam; hier spielt alles zwischen Irland und dem Bosporus, und die
// Orte sind kleiner geworden — Reims, Tours, Canterbury, Aachen. Ein weiterer
// Ausschnitt hätte sie zu Stecknadelköpfen gemacht. 16,3 SVG-Einheiten je
// Längengrad statt 12,7: Gallien und Britannien haben ein Drittel mehr Platz.
//
// Diese Karte zeigt etwas anderes als ihre Vorgängerin. Bei den Germanen
// zerfiel eine Fläche in viele; hier passiert das Gegenteil, und zwar langsam:
// Aus vielen kleinen Herrschaften wird über drei Jahrhunderte wieder eine
// große. Deshalb liegt das Gewicht auf dem Vergleich der vier Phasen — dieselbe
// Landkarte viermal, und man sieht dem Frankenreich beim Wachsen zu. 476 ist
// es der kleinste Fleck der Karte, 800 der größte.
//
// Zwei Festlegungen, die ausdrücklich hierher gehören:
//
//   1. Wo es keine Herrschaft mit Grenzen gab, steht auch keine Fläche. Das
//      Land östlich des Rheins bleibt 476 leer — Alamannen, Thüringer und
//      Sachsen lebten dort, aber sie hatten keine Kanzlei, die Grenzen
//      aufgezeichnet hätte. Erst als die Franken sie unterwerfen, bekommen
//      diese Gegenden auf der Karte einen Rand: den ihres Eroberers.
//   2. Auch die gezeichneten Grenzen sind genauer, als sie sein können. Ein
//      Königreich dieser Zeit war kein Staatsgebiet mit Katasteramt, sondern
//      ein Geflecht aus Treueiden, Königshöfen und Bischofssitzen. Die Fläche
//      ist eine Vereinfachung — und weil sie eine ist, sagen es die Hinweise
//      der Phasen auch.
//
// Reine Daten und Rechnung — keine UI-Importe (Architektur-Regel).

const { KARTENFARBEN, erstelleProjektion, rueckwaerts, verbinde } = require('../../karte-geo');

// ---------------------------------------------------------------------------
// Ausschnitt und Projektion
// ---------------------------------------------------------------------------

/**
 * Der Kartenausschnitt: vom Atlantik westlich Irlands (11° W) bis hinter den
 * Bosporus (32° O), von der nordafrikanischen Küste (33° N) bis zur Ostsee
 * (57° N).
 *
 * Die Ostgrenze ist mit Bedacht gewählt: Konstantinopel liegt gerade noch im
 * Bild, am äußersten Rand. Genau dort gehört es in diesem Kapitel auch hin —
 * der Kaiser, in dessen Namen die neuen Könige regieren, ist weit weg, aber er
 * ist nicht weg.
 */
const RAHMEN = { minLon: -11, maxLon: 32, minLat: 33, maxLat: 57, breite: 700 };

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

/** Ostsee am oberen Bildrand: Kurland → Weichselmündung → Jütland → Elbmündung. */
const OSTSEE = [
  [22.5, 58.4], // über dem Bildrand
  [21.1, 56.1], // Kurland
  [20.0, 55.2],
  [19.6, 54.7],
  [18.7, 54.6], // Weichselmündung bei Danzig
  [17.5, 54.7],
  [16.5, 54.5],
  [15.2, 54.3],
  [14.5, 54.2],
  [13.4, 54.1],
  [12.5, 54.4],
  [11.0, 54.4],
  [10.2, 54.4], // Kieler Förde
  [9.9, 54.8],
  [10.0, 55.5],
  [10.5, 56.2],
  [10.7, 57.0],
  [10.5, 57.7], // Skagen, über dem Bildrand
  [9.5, 57.2],
  [8.5, 56.3],
  [8.2, 55.5],
  [8.5, 55.0],
  [8.6, 54.4],
  [8.5, 53.9], // Elbmündung
];

/** Nordsee: Elbmündung → Rheinmündung → Calais. */
const NORDSEE = [
  [8.5, 53.9],
  [8.0, 53.6],
  [7.0, 53.7],
  [6.2, 53.5],
  [5.5, 53.4],
  [4.8, 52.9],
  [4.6, 52.5],
  [4.1, 51.9], // Rheinmündung
  [3.5, 51.5],
  [3.1, 51.4],
  [2.6, 51.1],
  [1.6, 50.9], // Calais
];

/** Atlantikküste Galliens: Calais → Seine → Bretagne → Loire → Gironde. */
const GALLIEN_ATLANTIK = [
  [1.6, 50.9],
  [1.0, 50.3],
  [0.2, 49.7], // Seinemündung
  [-0.6, 49.3],
  [-1.2, 49.4],
  [-1.9, 49.7], // Cotentin
  [-1.6, 49.0],
  [-2.5, 48.6],
  [-3.5, 48.8],
  [-4.8, 48.6], // Nordwestspitze der Bretagne
  [-4.6, 48.0],
  [-3.5, 47.7],
  [-2.5, 47.5],
  [-2.2, 47.3], // Loiremündung
  [-1.8, 46.8],
  [-1.2, 46.3],
  [-1.1, 45.6], // Gironde
  [-1.2, 44.6],
  [-1.6, 43.4], // am Fuß der Pyrenäen
];

/** Nordküste Hispaniens: Pyrenäen → Kap Finisterre. */
const HISPANIEN_NORD = [
  [-1.6, 43.4],
  [-2.9, 43.4],
  [-4.0, 43.5],
  [-5.8, 43.6],
  [-7.0, 43.6],
  [-7.9, 43.7],
  [-8.9, 43.3], // Kap Finisterre
];

/** Atlantikküste Hispaniens: Finisterre → Straße von Gibraltar. */
const HISPANIEN_ATLANTIK = [
  [-8.9, 43.3],
  [-8.8, 42.5],
  [-8.8, 42.0],
  [-8.8, 41.1], // Mündung des Douro
  [-9.0, 40.0],
  [-9.4, 39.4], // Cabo da Roca
  [-9.2, 38.7], // Tejomündung
  [-8.9, 38.5],
  [-8.8, 37.8],
  [-8.9, 37.0], // Kap São Vicente
  [-7.4, 37.2],
  [-6.9, 37.1],
  [-6.3, 36.6], // Gades (Cádiz)
  [-5.9, 36.2],
  [-5.6, 36.0], // Straße von Gibraltar
];

/** Mittelmeerküste Hispaniens: Gibraltar → Cap de Creus. */
const HISPANIEN_MITTELMEER = [
  [-5.6, 36.0],
  [-4.4, 36.7], // Malaca
  [-2.9, 36.7],
  [-2.1, 36.8],
  [-0.8, 37.6], // Carthago Nova
  [0.2, 38.8], // Cabo de la Nao
  [-0.3, 39.5], // Valentia
  [0.2, 40.2],
  [0.8, 40.7], // Ebrodelta
  [1.2, 41.1],
  [2.2, 41.4], // Barcino
  [3.2, 42.3], // Cap de Creus
];

/** Mittelmeerküste Galliens: Cap de Creus → Genua. */
const GALLIEN_MITTELMEER = [
  [3.2, 42.3],
  [3.0, 43.0], // Golfe du Lion
  [4.0, 43.4],
  [4.8, 43.4], // Rhônedelta
  [5.4, 43.3], // Massilia
  [6.2, 43.1],
  [7.0, 43.5], // Nizza
  [8.0, 43.9],
  [8.5, 44.4], // Genua
];

/** Ligurische Küste: Genua → Arnomündung. */
const ITALIEN_LIGURIEN = [
  [8.5, 44.4],
  [9.2, 44.3],
  [9.8, 44.1],
  [10.3, 43.7], // Arnomündung bei Pisa
];

/** Tyrrhenische Küste: Arnomündung → Stiefelspitze. */
const ITALIEN_TYRRHENISCH = [
  [10.3, 43.7],
  [10.7, 42.4],
  [11.8, 42.1],
  [12.3, 41.7], // Ostia, der Hafen Roms
  [13.1, 41.3],
  [13.6, 41.2],
  [14.0, 40.9], // Neapolis
  [14.9, 40.6],
  [15.3, 40.0],
  [15.8, 39.5],
  [16.1, 38.7],
  [15.9, 38.3],
  [15.6, 38.0], // Stiefelspitze bei Rhegium
];

/** Adriaküste Italiens: Stiefelspitze → Absatz → Sporn → Rimini. */
const ITALIEN_ADRIA = [
  [15.6, 38.0],
  [16.6, 38.5],
  [17.2, 39.0],
  [16.9, 40.4], // Tarent, am Golf
  [17.9, 40.3],
  [18.4, 39.8], // Absatz: Kap Santa Maria di Leuca
  [18.5, 40.4], // Otranto
  [17.9, 40.7], // Brundisium
  [16.9, 41.1], // Barium
  [16.3, 41.3],
  [15.9, 41.6],
  [16.2, 41.9], // Sporn: der Gargano
  [15.5, 41.9],
  [14.9, 42.1],
  [14.2, 42.5],
  [13.5, 43.0],
  [13.5, 43.6], // Ancona
  [12.6, 44.1], // Ariminum (Rimini)
];

/** Poebene und Oberadria: Rimini → Triest. */
const ITALIEN_PO = [
  [12.6, 44.1],
  [12.3, 44.8], // Podelta
  [12.3, 45.4], // Lagune von Venedig
  [13.1, 45.6],
  [13.6, 45.7], // Triest
];

/** Ostküste der Adria, Nordteil: Triest → Dubrovnik. */
const BALKAN_ADRIA_NORD = [
  [13.6, 45.7],
  [13.7, 45.5],
  [13.9, 44.8], // Istrien
  [14.5, 45.3],
  [15.2, 44.1], // Iader (Zadar)
  [16.4, 43.5], // Salona (Split)
  [17.3, 42.9],
  [18.1, 42.6], // Ragusa (Dubrovnik)
];

/** Ostküste der Adria, Südteil: Dubrovnik → Epirus. */
const BALKAN_ADRIA_SUED = [
  [18.1, 42.6],
  [19.0, 42.1],
  [19.4, 41.3], // Dyrrhachium
  [19.3, 40.4],
  [20.1, 39.6], // Epirus, gegenüber von Korfu
];

/** Griechenland und Thrakien: Epirus → Peloponnes → Thessaloniki → Dardanellen. */
const GRIECHENLAND = [
  [20.1, 39.6],
  [20.8, 38.9],
  [21.2, 38.3], // Eingang zum Golf von Patras
  [22.9, 38.3], // Golf von Korinth, Ostende
  [22.9, 37.9],
  [22.0, 38.2],
  [21.4, 38.1],
  [21.3, 37.6],
  [21.6, 37.0],
  [21.9, 36.7], // Messenien
  [22.5, 36.8],
  [22.4, 36.4], // Kap Tainaron, der mittlere Finger
  [22.8, 36.8],
  [23.1, 36.4], // Kap Malea
  [23.2, 37.5],
  [23.1, 37.9],
  [23.7, 37.9], // Athen
  [24.0, 38.2],
  [23.4, 38.8],
  [22.9, 39.2], // Golf von Volos
  [22.6, 40.0],
  [22.9, 40.6], // Thessaloniki
  [23.7, 40.2], // Chalkidike
  [24.4, 40.9],
  [25.9, 40.8], // Thrakien
  [26.2, 40.6],
  [26.7, 40.4],
  [26.2, 40.1], // Dardanellen, europäische Seite
];

/**
 * Kleinasien, soweit es ins Bild reicht: Dardanellen → Attaleia. Die Meerenge
 * ist in diesem Maßstab dünner als ein Strich — die Landmasse geht hier durch,
 * das Marmarameer weiter nördlich zeigt die Wasserstraße an.
 */
const ANATOLIEN_AEGAEIS = [
  [26.7, 39.6], // Dardanellen, asiatische Seite (bei Troja)
  [26.4, 39.3],
  [26.8, 38.9],
  [27.3, 38.4], // Smyrna
  [26.8, 38.3],
  [27.2, 37.8],
  [27.3, 37.0], // Halikarnassos
  [28.3, 36.8],
  [29.1, 36.2],
  [30.0, 36.2],
  [30.7, 36.9], // Attaleia (Antalya)
  [31.5, 36.8],
  [32.5, 36.2], // schon am rechten Bildrand
];

/** Nordafrika: Kyrenaika → Karthago → Tingis (Tanger). */
const NORDAFRIKA = [
  [25.1, 31.6], // unter dem Bildrand
  [23.9, 32.1],
  [22.6, 32.8],
  [21.6, 32.9],
  [20.5, 32.5],
  [20.1, 32.1], // Kyrenaika
  [20.2, 30.9],
  [19.2, 30.4], // Grund der Großen Syrte
  [17.5, 30.6],
  [16.6, 31.2],
  [15.2, 32.4],
  [13.2, 32.9], // Oea (Tripolis)
  [12.1, 33.0],
  [11.0, 33.4],
  [10.1, 34.0], // Kleine Syrte
  [10.8, 34.7],
  [10.5, 35.6], // Hadrumetum
  [11.1, 36.8], // Kap Bon
  [10.3, 37.0], // Karthago
  [9.8, 37.3],
  [8.6, 36.9],
  [7.8, 36.9], // Hippo Regius
  [6.0, 36.9],
  [4.8, 36.9],
  [3.1, 36.8], // Icosium (Algier)
  [1.2, 36.5],
  [0.1, 36.0],
  [-0.6, 35.7],
  [-1.3, 35.6],
  [-2.9, 35.3],
  [-4.3, 35.2],
  [-5.4, 35.9],
  [-5.9, 35.8], // Tingis (Tanger)
];

/** Atlantikküste Mauretaniens: Tanger → Sala → Südrand des Bildes. */
const MAROKKO_ATLANTIK = [
  [-5.9, 35.8],
  [-6.3, 35.2],
  [-6.5, 34.6],
  [-6.9, 34.0], // Sala (Rabat)
  [-7.7, 33.5],
  [-8.5, 32.8], // schon außerhalb des Bildes
];

/** Schwarzes Meer, Westufer: Bosporus → Donaudelta. */
const SCHWARZMEER_WEST = [
  [29.1, 41.2], // Bosporus
  [28.0, 41.6],
  [27.5, 42.4],
  [27.9, 43.2],
  [28.6, 44.2],
  [29.8, 45.4], // Donaudelta
];

/** Schwarzes Meer, Südufer (Anatolien): Bosporus → über den Bildrand hinaus. */
const SCHWARZMEER_SUED = [
  [29.1, 41.2],
  [31.4, 41.1],
  [33.4, 42.0], // außerhalb des Bildes
];

/** Marmarameer — die Wasserstraße zwischen Ägäis und Schwarzem Meer. */
const MARMARAMEER = [
  [26.4, 40.4],
  [27.5, 40.5],
  [29.3, 40.4],
  [29.9, 40.7],
  [29.1, 41.1],
  [27.0, 41.0],
  [26.5, 40.7],
];

/** Britannien, Westküste: Land's End → Bristolkanal → Wales → Solway. */
const BRITANNIEN_WEST = [
  [-5.7, 50.1], // Land's End
  [-4.2, 51.2],
  [-3.4, 51.3],
  [-2.7, 51.5], // Grund des Bristolkanals
  [-3.2, 51.4],
  [-4.1, 51.7],
  [-5.3, 51.9], // Westspitze von Wales
  [-4.7, 52.3],
  [-4.1, 52.4],
  [-4.8, 52.9],
  [-4.6, 53.3], // Anglesey
  [-3.0, 53.4],
  [-3.1, 54.1],
  [-3.6, 54.6],
  [-3.5, 54.9], // Solway Firth
];

/** Britannien, Norden (Kaledonien): Solway → Schottland → Newcastle. */
const BRITANNIEN_NORD = [
  [-3.5, 54.9],
  [-4.9, 54.6],
  [-4.7, 55.4],
  [-5.8, 55.3], // Kintyre
  [-5.4, 56.4],
  [-5.9, 57.0],
  [-5.5, 57.6], // über dem Bildrand
  [-3.0, 57.7],
  [-4.1, 57.6], // Moray Firth
  [-2.1, 57.2],
  [-2.6, 56.5],
  [-3.2, 56.1], // Firth of Forth
  [-2.1, 56.0],
  [-1.9, 55.7],
  [-1.4, 55.0], // Newcastle
];

/** Britannien, Ost- und Südküste: Newcastle → Dover → Land's End. */
const BRITANNIEN_OST = [
  [-1.4, 55.0],
  [-0.5, 54.5],
  [-0.1, 54.1],
  [0.1, 53.6], // Humber
  [0.3, 52.9], // The Wash
  [1.7, 52.8], // Norfolk
  [1.3, 52.0],
  [1.0, 51.6], // Themsemündung
  [1.4, 51.1], // Dover
  [0.2, 50.7],
  [-1.1, 50.8],
  [-1.9, 50.7],
  [-2.4, 50.6],
  [-3.5, 50.4],
  [-4.2, 50.3],
  [-5.0, 50.2],
  [-5.7, 50.1],
];

// ---------------------------------------------------------------------------
// Inseln
// ---------------------------------------------------------------------------

const IRLAND = [
  [-6.2, 53.3],
  [-6.0, 54.0],
  [-5.6, 54.6],
  [-6.5, 55.2],
  [-7.4, 55.4],
  [-8.5, 55.2],
  [-8.8, 54.3],
  [-9.9, 54.2],
  [-10.1, 53.5],
  [-9.1, 53.3],
  [-9.9, 52.6],
  [-10.4, 52.1],
  [-9.5, 51.6],
  [-8.3, 51.8],
  [-7.0, 52.1],
  [-6.4, 52.2],
  [-6.0, 52.9],
];

const SIZILIEN = [
  [15.6, 38.3], // Kap Peloros, gegenüber der Stiefelspitze
  [14.5, 38.1],
  [13.4, 38.2], // Panormus
  [12.5, 38.1],
  [12.4, 37.8], // Lilybaeum
  [13.1, 37.5],
  [13.9, 37.1],
  [15.1, 36.7], // Kap Pachynum
  [15.3, 37.2], // Syrakus
  [15.2, 37.8],
];

const SARDINIEN = [
  [9.2, 41.25],
  [9.8, 41.1],
  [9.7, 40.5],
  [9.6, 39.9],
  [9.5, 39.2],
  [9.1, 39.0],
  [8.5, 39.1],
  [8.4, 39.9],
  [8.2, 40.6],
  [8.2, 41.0],
];

const KORSIKA = [
  [9.4, 43.0],
  [9.55, 42.7],
  [9.5, 42.0],
  [9.4, 41.6],
  [9.2, 41.37],
  [8.8, 41.6],
  [8.6, 42.0],
  [8.7, 42.6],
  [9.0, 42.8],
];

const KRETA = [
  [23.5, 35.5],
  [24.5, 35.7],
  [25.7, 35.4],
  [26.3, 35.3],
  [26.0, 35.0],
  [25.0, 35.0],
  [24.0, 35.1],
  [23.6, 35.2],
];

const MALLORCA = [
  [2.4, 39.6],
  [3.0, 39.9],
  [3.45, 39.75],
  [3.3, 39.4],
  [2.8, 39.3],
];

// ---------------------------------------------------------------------------
// Flüsse — die Adern der Königreiche
// ---------------------------------------------------------------------------
//
// In dieser Zeit sind Flüsse mehr als Landschaft: Sie sind Verkehrswege und
// Reichsteilungsgrenzen. Die Söhne Chlodwigs teilten ihr Erbe nicht nach
// Völkern, sondern nach Flusstälern und Königsstädten.

const RHEIN = [
  [9.5, 46.6],
  [9.5, 47.5],
  [8.6, 47.6],
  [7.6, 47.6], // Basel
  [7.8, 48.6], // Straßburg
  [8.3, 50.0], // Mainz
  [7.6, 50.4],
  [6.9, 50.9], // Köln
  [6.2, 51.8],
  [5.0, 51.9],
  [4.5, 51.9],
];

const DONAU = [
  [8.2, 48.1],
  [10.0, 48.4],
  [12.1, 49.0], // Regensburg
  [13.8, 48.6],
  [16.4, 48.2], // Wien
  [19.0, 47.5], // Buda
  [19.6, 46.0],
  [20.5, 44.8], // Belgrad
  [22.5, 44.6], // Eisernes Tor
  [24.0, 43.8],
  [26.0, 44.0],
  [27.9, 44.5],
  [29.7, 45.2], // Donaudelta
];

const ELBE = [
  [14.2, 50.6],
  [13.7, 51.05], // Dresden
  [12.4, 51.9],
  [11.6, 52.1], // Magdeburg
  [10.9, 53.0],
  [10.0, 53.5], // Hamburg
  [9.2, 53.85],
  [8.6, 53.9],
];

/** Die Weser — an ihr endete 782 das, was die Reichsannalen als Sieg meldeten. */
const WESER = [
  [9.7, 51.4],
  [9.4, 52.0],
  [9.1, 52.6],
  [8.8, 53.1],
  [8.6, 53.6],
  [8.5, 53.9],
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
  [4.2, 44.9],
  [3.9, 45.9],
  [2.6, 47.1],
  [1.9, 47.9], // Orléans
  [0.7, 47.4], // Tours
  [-0.5, 47.3],
  [-1.55, 47.2], // Nantes
  [-2.2, 47.27],
];

const RHONE = [
  [6.2, 46.4],
  [4.8, 45.8], // Lugdunum (Lyon)
  [4.7, 44.4],
  [4.8, 43.9],
  [4.8, 43.4],
];

const PO = [
  [7.5, 44.9],
  [9.2, 45.1],
  [11.0, 45.0],
  [12.3, 44.9],
];

const EBRO = [
  [-3.0, 42.6],
  [-1.0, 42.1],
  [0.9, 41.7],
  [0.8, 40.7],
];

const TAJO = [
  [-2.0, 40.4],
  [-3.9, 39.9], // bei Toledo
  [-6.0, 39.7],
  [-8.0, 39.5],
  [-9.2, 38.7],
];

// ---------------------------------------------------------------------------
// Die Landmassen
// ---------------------------------------------------------------------------

/**
 * Europa und Kleinasien als ein Umriss — von der Ostsee bis nach Anatolien.
 * Die Randpunkte liegen bewusst außerhalb des Ausschnitts: So läuft das Land
 * über den Bildrand hinaus, statt dort abzuknicken.
 */
const KONTINENT = verbinde(
  OSTSEE,
  NORDSEE,
  GALLIEN_ATLANTIK,
  HISPANIEN_NORD,
  HISPANIEN_ATLANTIK,
  HISPANIEN_MITTELMEER,
  GALLIEN_MITTELMEER,
  ITALIEN_LIGURIEN,
  ITALIEN_TYRRHENISCH,
  ITALIEN_ADRIA,
  ITALIEN_PO,
  BALKAN_ADRIA_NORD,
  BALKAN_ADRIA_SUED,
  GRIECHENLAND,
  ANATOLIEN_AEGAEIS,
  // Rückweg außerhalb des Bildes: Anatolien, die Steppe, der hohe Norden.
  [
    [36, 34],
    [36, 62],
    [24, 62],
  ],
);

/**
 * Nordafrika ist auf dieser Karte eine eigene Landmasse — der Landweg nach
 * Asien führt über den Sinai, und der liegt östlich des Bildrands. Für dieses
 * Kapitel ist das genau richtig: Was 800 südlich des Mittelmeers liegt, gehört
 * zu einer Welt, die von Karls Reich durch Wasser getrennt ist.
 */
const AFRIKA = verbinde(
  NORDAFRIKA,
  MAROKKO_ATLANTIK,
  [
    [-14, 26],
    [30, 26],
    [27, 30],
  ],
);

const BRITANNIEN = verbinde(BRITANNIEN_WEST, BRITANNIEN_NORD, BRITANNIEN_OST);

/** Das Schwarze Meer, soweit es ins Bild ragt. */
const SCHWARZES_MEER = verbinde(
  SCHWARZMEER_WEST,
  [
    [31.0, 46.0],
    [36, 46],
    [36, 41],
  ],
  rueckwaerts(SCHWARZMEER_SUED),
);

// ---------------------------------------------------------------------------
// Bausteine für die Phasen
// ---------------------------------------------------------------------------

/** Alpenkamm als Nordgrenze Italiens: Triest → Genua. */
const ALPENBOGEN = [
  [13.5, 46.3],
  [11.5, 46.6],
  [10.0, 46.4],
  [8.6, 46.3],
  [7.3, 45.5],
  [7.6, 44.8],
  [8.5, 44.4],
];

/** Der Pyrenäenkamm: vom Golf von Biskaya zum Mittelmeer. */
const PYRENAEEN = [
  [-1.6, 43.4],
  [-0.5, 42.8],
  [0.7, 42.7],
  [1.7, 42.5],
  [3.2, 42.3],
];

/** Italien mit dem Alpenbogen als Nordgrenze — die Halbinsel als Ganzes. */
const ITALIEN_GANZ = verbinde(
  ITALIEN_LIGURIEN,
  ITALIEN_TYRRHENISCH,
  ITALIEN_ADRIA,
  ITALIEN_PO,
  [[13.6, 45.7]],
  ALPENBOGEN,
);

/** Die Iberische Halbinsel als Ganzes. */
const IBERIEN = verbinde(
  HISPANIEN_NORD,
  HISPANIEN_ATLANTIK,
  HISPANIEN_MITTELMEER,
  rueckwaerts(PYRENAEEN),
);

/**
 * Das Suebenreich in Gallaecia — der Nordwesten der Halbinsel.
 *
 * Es steht auf dieser Karte, weil es sonst niemand erwähnt: 409 gegründet,
 * 585 von den Westgoten geschluckt, dazwischen fast zwei Jahrhunderte lang ein
 * eigenes Königreich mit eigenen Königen und eigener Kirche. Die Chronisten
 * der Sieger haben es klein geschrieben.
 */
const SUEBEN = [
  [-8.9, 43.3],
  [-7.9, 43.7],
  [-7.0, 43.6],
  [-6.5, 43.0],
  [-6.6, 42.3],
  [-7.2, 41.6],
  [-8.0, 41.2],
  [-8.8, 41.1],
  [-8.8, 42.0],
  [-8.8, 42.5],
];

/** Das Oströmische Reich, wie es 476 bis 600 im Bild liegt. */
const OSTROM = verbinde(
  [
    [29.7, 45.2],
    [27.9, 44.5],
    [26.0, 44.0],
    [24.0, 43.8],
    [22.5, 44.6],
    [20.5, 44.8],
    [19.5, 43.5],
    [18.5, 42.9],
  ],
  BALKAN_ADRIA_SUED,
  GRIECHENLAND,
  ANATOLIEN_AEGAEIS,
  [
    [33.5, 36.5],
    [34, 42],
  ],
  rueckwaerts(SCHWARZMEER_SUED),
  rueckwaerts(SCHWARZMEER_WEST),
);

/** Ostrom um 800 — der Balkan ist bis auf die Küsten verloren. */
const OSTROM_800 = verbinde(
  GRIECHENLAND.slice(0, 24),
  [
    [25.5, 41.2],
    [27.0, 41.6],
    [28.0, 41.6],
  ],
  rueckwaerts(SCHWARZMEER_SUED),
  [
    [34, 42],
    [33.5, 36.5],
  ],
  rueckwaerts(ANATOLIEN_AEGAEIS),
  [[26.2, 40.1]],
);

// --- 476: die Trümmerkarte ------------------------------------------------

/** 476: Italien unter Odoaker — der letzte weströmische Kaiser ist abgesetzt. */
const ODOAKER_476 = ITALIEN_GANZ;

/**
 * 476: das Westgotenreich Eurichs — von der Loire bis nach Andalusien.
 *
 * Es ist zu diesem Zeitpunkt das größte Reich des Westens. Wer nur weiß, dass
 * am Ende die Franken gewannen, wird das überraschend finden — 476 hätte
 * niemand auf sie gesetzt.
 */
const WESTGOTEN_476 = verbinde(
  HISPANIEN_ATLANTIK.slice(3),
  HISPANIEN_MITTELMEER,
  GALLIEN_MITTELMEER.slice(0, 4),
  [
    [4.7, 44.3],
    [3.6, 45.3],
    [2.6, 46.2],
    [2.0, 46.9],
    [1.9, 47.9],
    [0.7, 47.4],
    [-1.55, 47.2],
    [-2.2, 47.3],
  ],
  GALLIEN_ATLANTIK.slice(14),
  HISPANIEN_NORD,
  [
    [-6.5, 43.0],
    [-6.6, 42.3],
    [-7.2, 41.6],
    [-8.0, 41.2],
    [-8.8, 41.1],
  ],
);

/** 476: das Vandalenreich in Nordafrika, seit 439 mit Karthago als Hauptstadt. */
const VANDALEN_476 = verbinde(NORDAFRIKA.slice(11, 27), [
  [0.5, 35.0],
  [3.0, 34.5],
  [6.0, 34.5],
  [8.0, 34.0],
  [9.5, 33.0],
  [11.0, 31.9],
  [12.5, 31.9],
]);

/** 476: das Burgunderreich an Rhône und Saône. */
const BURGUNDER_476 = [
  [4.0, 46.5],
  [4.8, 47.0],
  [5.8, 47.6],
  [7.0, 47.3],
  [7.3, 46.3],
  [7.0, 45.5],
  [6.5, 44.8],
  [5.8, 44.2],
  [4.9, 44.0],
  [4.5, 44.6],
  [4.3, 45.6],
];

/**
 * 476: das Frankenreich Childerichs — der kleinste Fleck auf dieser Karte.
 *
 * Hier steckt die Aussage des ganzen Kapitels in einer Fläche. Dies ist der
 * Ausgangspunkt: ein Streifen um Tournai, keine Hauptstadt, kein Reichsname.
 * Dreihundert Jahre später gehört diesem Haus fast alles, was auf dieser Karte
 * christlich ist.
 */
const FRANKEN_476 = [
  [2.6, 51.1],
  [3.5, 51.5],
  [4.1, 51.9],
  [5.0, 51.9],
  [6.2, 51.8],
  [6.4, 51.0],
  [5.6, 50.3],
  [4.6, 50.0],
  [3.4, 50.0],
  [2.5, 50.4],
];

/**
 * 476: das Reich des Syagrius zwischen Somme und Loire.
 *
 * Ein römischer Heermeister ohne Reich — die Franken nannten ihn schlicht
 * „König der Römer". 486 nahm Chlodwig ihm bei Soissons alles ab. Danach gab
 * es im Westen keine römische Herrschaft mehr, und niemand hat den Tag
 * aufgeschrieben, an dem das auffiel.
 */
const SYAGRIUS_476 = [
  [1.6, 50.9],
  [2.5, 50.4],
  [3.4, 50.0],
  [4.6, 50.0],
  [4.9, 49.2],
  [4.5, 48.4],
  [3.9, 47.6],
  [2.6, 47.1],
  [1.9, 47.9],
  [0.7, 47.4],
  [-0.5, 47.3],
  [-1.0, 48.0],
  [-1.2, 48.6],
  [-1.9, 49.7],
  [-1.2, 49.4],
  [-0.6, 49.3],
  [0.2, 49.7],
  [1.0, 50.3],
];

/** 476: die angelsächsischen Reiche im Osten Britanniens. */
const ANGELSACHSEN_476 = [
  [1.4, 51.1],
  [1.0, 51.6],
  [1.7, 52.8],
  [0.3, 52.9],
  [0.1, 53.6],
  [-0.1, 54.1],
  [-0.9, 54.2],
  [-0.8, 53.4],
  [-1.2, 52.6],
  [-1.0, 51.9],
  [-0.6, 51.3],
  [0.2, 50.7],
];

// --- um 526: die Königreiche stehen ---------------------------------------

/**
 * Um 526: das Frankenreich der Söhne Chlodwigs — von der Bretagne bis über den
 * Rhein, von der Nordsee bis an die Pyrenäen.
 */
const FRANKEN_526 = verbinde(
  rueckwaerts(GALLIEN_ATLANTIK),
  [
    [2.6, 51.1],
    [3.5, 51.5],
    [4.1, 51.9],
    [6.0, 52.0],
    [8.0, 51.6],
    [9.5, 51.0],
    [10.0, 50.2],
    [10.5, 49.3],
    [10.0, 48.4],
    [8.6, 47.6],
    [7.6, 47.6],
    [6.8, 47.5],
    [5.8, 47.6],
    [4.8, 47.0],
    [4.0, 46.5],
    [3.2, 45.8],
    [2.6, 44.9],
    [2.0, 44.1],
    [1.5, 43.4],
    [0.5, 42.9],
    [-0.5, 42.8],
    [-1.6, 43.4],
  ],
);

/**
 * Um 526: das Ostgotenreich Theoderichs — Italien, Dalmatien, die Provence
 * und ein Stück Alpenland. Am Ende seines Lebens das mächtigste Reich des
 * Westens, und das einzige, das sich ausdrücklich als Fortsetzung Roms verstand.
 */
const OSTGOTEN_526 = verbinde(
  GALLIEN_MITTELMEER.slice(1),
  ITALIEN_LIGURIEN,
  ITALIEN_TYRRHENISCH,
  ITALIEN_ADRIA,
  ITALIEN_PO,
  BALKAN_ADRIA_NORD,
  [
    [18.5, 43.3],
    [17.5, 44.2],
    [16.0, 45.2],
    [15.0, 46.0],
    [13.9, 46.4],
    [11.5, 46.9],
    [10.0, 46.6],
    [8.6, 46.3],
    [7.3, 45.5],
    [6.5, 45.0],
    [5.5, 44.6],
    [4.5, 44.3],
    [4.0, 43.6],
  ],
);

/** Um 526: das Westgotenreich, nach der Niederlage von Vouillé auf Spanien zurückgeworfen. */
const WESTGOTEN_526 = verbinde(
  HISPANIEN_ATLANTIK.slice(3),
  HISPANIEN_MITTELMEER,
  [
    [3.0, 43.0],
    [4.0, 43.5],
    [3.2, 44.0],
    [2.2, 43.3],
    [1.5, 43.0],
    [0.5, 42.9],
    [-0.5, 42.8],
    [-1.6, 43.4],
  ],
  HISPANIEN_NORD,
  [
    [-6.5, 43.0],
    [-6.6, 42.3],
    [-7.2, 41.6],
    [-8.0, 41.2],
    [-8.8, 41.1],
  ],
);

/** Um 526: die angelsächsischen Reiche greifen nach Westen aus. */
const ANGELSACHSEN_526 = [
  [1.4, 51.1],
  [1.0, 51.6],
  [1.7, 52.8],
  [0.3, 52.9],
  [0.1, 53.6],
  [-0.1, 54.1],
  [-1.4, 55.0],
  [-1.9, 54.5],
  [-1.5, 53.5],
  [-2.0, 52.8],
  [-1.8, 52.0],
  [-1.0, 51.3],
  [0.2, 50.7],
];

// --- um 600: nach Justinian und den Langobarden ---------------------------

/** Um 600: das Frankenreich der Merowinger, jetzt mit Burgund und Provence. */
const FRANKEN_600 = verbinde(
  rueckwaerts(GALLIEN_ATLANTIK),
  [
    [2.6, 51.1],
    [3.5, 51.5],
    [4.1, 51.9],
    [6.0, 52.0],
    [8.0, 51.8],
    [10.0, 51.4],
    [11.5, 50.8],
    [12.0, 49.8],
    [13.0, 48.8],
    [13.0, 47.6],
    [11.5, 47.2],
    [10.0, 47.2],
    [8.5, 47.6],
    [7.5, 46.5],
    [7.0, 45.9],
    [6.8, 45.2],
    [6.5, 44.5],
    [6.0, 43.9],
    [5.4, 43.3],
    [4.8, 43.4],
    [4.0, 43.5],
    [3.2, 44.0],
    [2.2, 43.3],
    [1.5, 43.0],
    [0.5, 42.9],
    [-0.5, 42.8],
    [-1.6, 43.4],
  ],
);

/** Um 600: die Langobarden in Norditalien und in den Herzogtümern der Mitte. */
const LANGOBARDEN_600 = [
  [8.5, 44.4],
  [7.6, 44.8],
  [7.3, 45.5],
  [8.6, 46.3],
  [10.0, 46.4],
  [11.5, 46.6],
  [13.5, 46.3],
  [13.6, 45.7],
  [12.6, 45.5],
  [12.1, 44.9],
  [12.5, 44.1],
  [13.3, 43.3],
  [14.1, 42.5],
  [15.2, 41.5],
  [15.6, 40.8],
  [16.0, 40.6],
  [15.6, 40.1],
  [14.8, 40.4],
  [14.4, 41.0],
  [13.5, 41.3],
  [12.9, 42.0],
  [12.1, 42.4],
  [11.5, 43.0],
  [10.7, 43.4],
  [10.3, 43.7],
  [9.8, 44.1],
];

/** Um 600: das Exarchat von Ravenna und der oströmische Süden Italiens. */
const OSTROM_ITALIEN_600 = [
  [12.3, 45.4],
  [12.3, 44.8],
  [12.6, 44.1],
  [13.5, 43.6],
  [13.5, 43.0],
  [13.0, 42.6],
  [12.8, 42.0],
  [12.3, 41.7],
  [13.1, 41.3],
  [13.6, 41.2],
  [14.0, 40.9],
  [14.9, 40.6],
  [15.3, 40.0],
  [15.8, 39.5],
  [16.1, 38.7],
  [15.9, 38.3],
  [15.6, 38.0],
  [16.6, 38.5],
  [17.2, 39.0],
  [16.9, 40.4],
  [17.9, 40.3],
  [18.4, 39.8],
  [18.5, 40.4],
  [17.9, 40.7],
  [16.9, 41.1],
  [16.3, 41.3],
  [15.9, 41.6],
  [16.2, 41.9],
  [15.2, 41.8],
  [14.6, 42.2],
  [13.9, 43.0],
  [13.0, 43.9],
  [12.1, 45.0],
];

/** Um 600: das Exarchat von Karthago — was Justinian den Vandalen 534 abnahm. */
const OSTROM_AFRIKA_600 = verbinde(NORDAFRIKA.slice(12, 27), [
  [0.5, 35.0],
  [3.0, 34.5],
  [6.0, 34.5],
  [8.0, 34.0],
  [9.5, 33.0],
  [11.5, 32.3],
]);

/** Um 600: das Westgotenreich — ganz Spanien, seit 585 auch Gallaecia. */
const WESTGOTEN_600 = verbinde(
  HISPANIEN_NORD,
  HISPANIEN_ATLANTIK,
  HISPANIEN_MITTELMEER,
  [
    [3.0, 43.0],
    [4.0, 43.5],
    [3.2, 44.0],
    [2.2, 43.3],
    [1.5, 43.0],
    [0.5, 42.9],
    [-0.5, 42.8],
  ],
);

/** Um 600: die angelsächsische Heptarchie — sieben Reiche, sagt eine spätere Zählung. */
const ANGELSACHSEN_600 = [
  [1.4, 51.1],
  [1.0, 51.6],
  [1.7, 52.8],
  [0.3, 52.9],
  [0.1, 53.6],
  [-0.1, 54.1],
  [-1.4, 55.0],
  [-2.5, 55.2],
  [-2.6, 54.0],
  [-2.9, 53.3],
  [-2.6, 52.5],
  [-3.0, 51.8],
  [-2.6, 51.0],
  [-1.5, 50.7],
  [0.2, 50.7],
];

// --- 800: der Bogen schließt sich -----------------------------------------

/**
 * 800: das Reich Karls des Großen — von der Elbe bis an den Ebro, von der
 * Nordsee bis nach Rom.
 *
 * Es ist die größte Fläche dieser Karte, und sie ist in einem einzigen
 * Menschenleben entstanden. Was sie nicht zeigt: dass Karl nie eine Hauptstadt
 * im römischen Sinn hatte und sein Reich keine dreißig Jahre nach seinem Tod
 * unter seinen Enkeln zerfiel.
 */
const FRANKEN_800 = verbinde(
  rueckwaerts(GALLIEN_ATLANTIK),
  [
    [2.6, 51.1],
    [3.5, 51.5],
    [4.1, 51.9],
    [6.0, 53.2],
    [8.0, 53.5],
    [9.2, 53.85],
    [10.9, 53.0],
    [11.6, 52.1],
    [12.4, 51.9],
    [13.7, 51.05],
    [14.2, 50.6],
    [14.5, 49.5],
    [15.5, 48.8],
    [16.4, 48.2],
    [17.0, 47.4],
    [16.5, 46.4],
    [15.0, 45.9],
    [13.6, 45.7],
  ],
  rueckwaerts(ITALIEN_PO),
  [
    [13.0, 43.5],
    [12.9, 42.6],
    [12.3, 41.7],
    [11.8, 42.1],
    [10.7, 42.4],
    [10.3, 43.7],
    [9.8, 44.1],
    [9.2, 44.3],
    [8.5, 44.4],
    [8.0, 43.9],
    [7.0, 43.5],
    [6.2, 43.1],
    [5.4, 43.3],
    [4.8, 43.4],
    [4.0, 43.4],
    [3.0, 43.0],
    [3.2, 42.3],
    [2.2, 41.4],
    [1.2, 41.1],
    [0.8, 41.5],
    [-0.5, 42.2],
    [-1.6, 42.6],
    [-2.5, 43.0],
    [-1.6, 43.4],
  ],
);

/** 800: das langobardische Fürstentum Benevent, das Karl nie bekam. */
const BENEVENT_800 = [
  [14.0, 40.9],
  [14.9, 40.6],
  [15.3, 40.0],
  [15.8, 39.5],
  [16.3, 39.9],
  [16.5, 40.5],
  [17.2, 40.9],
  [16.3, 41.3],
  [15.9, 41.6],
  [16.2, 41.9],
  [15.2, 41.8],
  [14.6, 42.2],
  [13.9, 42.0],
  [13.6, 41.2],
];

/** 800: Al-Andalus — seit 711 steht der Süden der Halbinsel unter dem Islam. */
const ANDALUS_800 = verbinde(
  HISPANIEN_ATLANTIK.slice(2),
  HISPANIEN_MITTELMEER.slice(0, 11),
  [
    [0.8, 41.5],
    [-0.5, 42.2],
    [-1.6, 42.6],
    [-2.5, 43.0],
    [-4.0, 42.8],
    [-5.5, 42.6],
    [-6.6, 42.3],
    [-7.5, 42.0],
    [-8.8, 42.0],
  ],
);

/** 800: das christliche Asturien im Norden — der Rest, der nie erobert wurde. */
const ASTURIEN_800 = verbinde(HISPANIEN_NORD, [
  [-8.8, 42.0],
  [-7.5, 42.0],
  [-6.6, 42.3],
  [-5.5, 42.6],
  [-4.0, 42.8],
  [-2.5, 43.0],
]);

/** 800: Nordafrika unter den Aghlabiden und Idrisiden — Kalifatsland. */
const KALIFAT_AFRIKA_800 = verbinde(NORDAFRIKA, MAROKKO_ATLANTIK, [
  [-7.0, 32.0],
  [5.0, 32.0],
  [12.0, 30.5],
  [20.0, 29.5],
  [25.5, 30.5],
]);

/** 800: die angelsächsischen Reiche — Mercia ist das stärkste. */
const ANGELSACHSEN_800 = [
  [1.4, 51.1],
  [1.0, 51.6],
  [1.7, 52.8],
  [0.3, 52.9],
  [0.1, 53.6],
  [-0.1, 54.1],
  [-1.4, 55.0],
  [-2.5, 55.2],
  [-2.8, 54.2],
  [-3.1, 54.1],
  [-3.0, 53.4],
  [-3.1, 52.9],
  [-3.0, 52.0],
  [-3.1, 51.4],
  [-2.7, 51.5],
  [-3.4, 51.3],
  [-4.2, 51.2],
  [-4.5, 50.6],
  [-3.5, 50.4],
  [-2.4, 50.6],
  [-1.1, 50.8],
  [0.2, 50.7],
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

/** Ein Binnenmeer, das über die Landmasse gelegt wird. */
const wasser = (orte) => ({
  art: 'wasser',
  d: geo.pfad(orte),
  fill: KARTENFARBEN.meer,
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

/**
 * Die alte Reichsgrenze aus Rhein und Donau — als blasse Linie über dem
 * Untergrund.
 *
 * Sie hat 476 keine Gültigkeit mehr, und trotzdem gehört sie in dieses Bild:
 * Fast alles, was hier an Königreichen entsteht, entsteht westlich und südlich
 * von ihr, auf ehemals römischem Boden. Man sieht der Karte an, dass die neuen
 * Herren nicht irgendwohin zogen, sondern dorthin, wo Straßen, Städte und
 * Bischofssitze schon standen. Erst Karl der Große schiebt die Grenze seines
 * Reiches weit über diese Linie hinaus — nach Sachsen.
 */
const alteReichsgrenze = () => ({
  art: 'altgrenze',
  d: geo.pfad(
    [
      [29.7, 45.2],
      [27.9, 44.5],
      [26.0, 44.0],
      [24.0, 43.8],
      [22.5, 44.6],
      [20.5, 44.8],
      [19.6, 46.0],
      [19.0, 47.5],
      [16.4, 48.2],
      [13.8, 48.6],
      [12.1, 49.0],
      [11.2, 49.3],
      [10.2, 49.1],
      [9.0, 49.3],
      [8.3, 50.0],
      [7.6, 50.4],
      [6.9, 50.9],
      [6.2, 51.8],
      [4.5, 51.9],
    ],
    { geschlossen: false },
  ),
  fill: 'none',
  stroke: KARTENFARBEN.mauer,
  strokeWidth: 1.6,
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
    land(AFRIKA),
    land(BRITANNIEN),
    land(IRLAND),
    land(SIZILIEN),
    land(SARDINIEN),
    land(KORSIKA),
    land(KRETA),
    land(MALLORCA),
    wasser(SCHWARZES_MEER),
    wasser(MARMARAMEER),
    fluss(RHEIN),
    fluss(DONAU),
    fluss(ELBE),
    fluss(WESER),
    fluss(SEINE),
    fluss(LOIRE),
    fluss(RHONE),
    fluss(PO),
    fluss(EBRO),
    fluss(TAJO),
    alteReichsgrenze(),
  ],

  phasen: [
    {
      id: 'truemmerkarte',
      label: '476',
      hinweis:
        'Der letzte weströmische Kaiser ist abgesetzt, und das Reich ist nicht verschwunden, sondern aufgeteilt. Sieben Herrschaften, wo eine war. Sieh dir an, wie klein das Frankenreich hier ist — ein Streifen um Tournai. Und sieh dir an, wie groß das Westgotenreich ist. 476 hätte niemand darauf gewettet, wer von beiden am Ende Europa prägt.',
      flaechen: [
        gebiet('Italien unter Odoaker', ODOAKER_476),
        gebiet('Das Westgotenreich Eurichs — das größte Reich des Westens', WESTGOTEN_476),
        gebiet('Das Suebenreich in Gallaecia', SUEBEN),
        gebiet('Das Vandalenreich in Nordafrika', VANDALEN_476),
        gebiet('Das Burgunderreich an der Rhône', BURGUNDER_476),
        gebiet('Das Frankenreich Childerichs — der kleinste Fleck der Karte', FRANKEN_476),
        gebiet('Das Reich des Syagrius — der letzte römische Heermeister', SYAGRIUS_476),
        gebiet('Die angelsächsischen Reiche in Britannien', ANGELSACHSEN_476),
        gebiet('Das Oströmische Reich — dort regiert der Kaiser weiter', OSTROM),
      ],
    },
    {
      id: 'koenigreiche',
      label: 'um 526',
      hinweis:
        'Ein halbes Jahrhundert später stehen die Königreiche. Chlodwig hat Syagrius geschlagen (486), sich taufen lassen (um 496) und die Westgoten aus Gallien verdrängt (507) — sein Reich reicht jetzt von der Bretagne bis über den Rhein. In Ravenna regiert Theoderich, und er regiert römisch: mit römischen Beamten, römischem Recht und einem Senat, den er weiterarbeiten lässt. Die Grenzen sind glatter gezeichnet, als sie waren — ein Königreich dieser Zeit war ein Geflecht aus Treueiden, kein vermessenes Staatsgebiet.',
      flaechen: [
        gebiet('Das Frankenreich der Söhne Chlodwigs', FRANKEN_526),
        gebiet('Das Ostgotenreich Theoderichs — Italien, Dalmatien, die Provence', OSTGOTEN_526),
        gebiet('Das Westgotenreich, nach 507 auf Spanien zurückgeworfen', WESTGOTEN_526),
        gebiet('Das Suebenreich in Gallaecia', SUEBEN),
        gebiet('Das Burgunderreich an der Rhône', BURGUNDER_476),
        gebiet('Das Vandalenreich in Nordafrika', VANDALEN_476),
        gebiet('Die angelsächsischen Reiche in Britannien', ANGELSACHSEN_526),
        gebiet('Das Oströmische Reich', OSTROM),
      ],
    },
    {
      id: 'nach-justinian',
      label: 'um 600',
      hinweis:
        'Dazwischen liegt ein Rückschlag, den die Karte nicht zeigen kann: Kaiser Justinian eroberte Nordafrika (534) und Italien (554) zurück — und verwüstete Italien dabei so gründlich, dass es 568 den Langobarden kaum Widerstand entgegensetzte. Geblieben ist ein Flickenteppich: Langobarden im Norden und in der Mitte, Ostrom in Ravenna, Rom und im Süden. Im Norden ist Britannien wieder christlich geworden — 597 landete Augustinus in Kent.',
      flaechen: [
        gebiet('Das Frankenreich der Merowinger — jetzt mit Burgund und Provence', FRANKEN_600),
        gebiet('Die Langobarden in Italien (seit 568)', LANGOBARDEN_600),
        gebiet('Ravenna, Rom und der Süden — das oströmische Italien', OSTROM_ITALIEN_600),
        gebiet('Sizilien — oströmisch geblieben', SIZILIEN),
        gebiet('Das Westgotenreich — seit 585 die ganze Halbinsel', WESTGOTEN_600),
        gebiet('Das Exarchat von Karthago', OSTROM_AFRIKA_600),
        gebiet('Die angelsächsische Heptarchie', ANGELSACHSEN_600),
        gebiet('Das Oströmische Reich', OSTROM),
      ],
    },
    {
      id: 'kaiserkroenung',
      label: '800',
      hinweis:
        'Am Weihnachtstag 800 setzt Papst Leo III. in Rom dem Frankenkönig Karl eine Kaiserkrone auf. Aus dem kleinsten Fleck von 476 ist die größte Fläche dieser Karte geworden — von der Elbe bis an den Ebro. Zwei Dinge stehen aber auch auf dem Bild: Spanien ist seit 711 zum größten Teil islamisch, und in Konstantinopel sitzt weiterhin ein Kaiser, der von einem zweiten nichts wissen will. Aus dessen Sicht ist der 25. Dezember 800 kein Festtag, sondern eine Anmaßung.',
      flaechen: [
        gebiet('Das Reich Karls des Großen', FRANKEN_800),
        gebiet('Das Fürstentum Benevent — langobardisch geblieben', BENEVENT_800),
        gebiet('Al-Andalus — seit 711', ANDALUS_800),
        gebiet('Asturien — der christliche Norden', ASTURIEN_800),
        gebiet('Nordafrika unter dem Kalifat', KALIFAT_AFRIKA_800),
        gebiet('Die angelsächsischen Reiche', ANGELSACHSEN_800),
        gebiet('Sizilien — noch oströmisch', SIZILIEN),
        gebiet('Das Oströmische Reich', OSTROM_800),
      ],
    },
  ],

  punkte: [
    {
      id: 'reims',
      name: 'Reims',
      typ: 'ereignis',
      ...ort(4.03, 49.26),
      text: [
        'Hier ließ sich Chlodwig taufen — an einem Weihnachtstag um 496, vielleicht',
        'auch erst 498 oder 499; die Quellen sind sich nicht einig. Bischof Remigius',
        'soll ihm zugerufen haben: „Beuge deinen Nacken. Bete an, was du verbrannt',
        'hast, verbrenne, was du angebetet hast." Entscheidend ist nicht, dass',
        'Chlodwig Christ wurde, sondern welcher: Er ließ sich katholisch taufen,',
        'während die Könige der Goten, Vandalen und Burgunder Arianer waren — für',
        'die katholische Bevölkerung Galliens und ihre Bischöfe Ketzer. Mit einer',
        'einzigen Zeremonie wurde aus einem fremden Kriegsherrn der einzige König,',
        'hinter den sich die alte römische Oberschicht stellen konnte.',
      ].join(' '),
    },
    {
      id: 'tours',
      name: 'Tours',
      typ: 'stadt',
      ...ort(0.69, 47.39),
      text: [
        'Hier steht das Grab des heiligen Martin, das wichtigste Heiligtum',
        'Galliens — und hier war Gregor Bischof, der uns fast alles erzählt, was',
        'wir über Chlodwig zu wissen glauben. Gregor von Tours schrieb seine „Zehn',
        'Bücher Geschichten" rund neunzig Jahre nach Chlodwigs Taufe, und er',
        'schrieb sie als Kirchenmann: Sein Chlodwig ist ein zweiter Konstantin,',
        'vom Himmel geführt. Derselbe Gregor berichtet aber auch, wie dieser König',
        'seine Verwandten einen nach dem anderen umbringen ließ. Man kann das',
        'ganze Kapitel an dieser einen Stadt aufhängen: Was wir wissen, wissen wir',
        'von jemandem, der etwas damit bezweckte — und der ehrlich genug war, das',
        'Unangenehme mit aufzuschreiben.',
      ].join(' '),
    },
    {
      id: 'ravenna',
      name: 'Ravenna',
      typ: 'stadt',
      ...ort(12.2, 44.42),
      text: [
        'Theoderichs Hauptstadt. Er kam 493 hierher, tötete Odoaker bei einem',
        'Gastmahl eigenhändig — und regierte danach dreiunddreißig Jahre lang so',
        'römisch, wie es nur ging: römische Beamte, römisches Recht, ein Senat, der',
        'weiterarbeitete, Getreideverteilungen, Zirkusspiele. Seine Mosaiken und',
        'sein Grabmal stehen bis heute. Und doch zeigt gerade Ravenna, wie dünn das',
        'Eis war: Theoderich war Arianer, seine römischen Untertanen katholisch, und',
        'am Ende seines Lebens ließ er den Gelehrten Boethius hinrichten, der im',
        'Kerker noch den „Trost der Philosophie" schrieb. Die friedliche Koexistenz',
        'war echt — sie hielt nur nicht bis zuletzt.',
      ].join(' '),
    },
    {
      id: 'rom',
      name: 'Rom',
      typ: 'ereignis',
      ...ort(12.5, 41.9),
      text: [
        'Am 25. Dezember 800 setzte Papst Leo III. dem Frankenkönig Karl in der',
        'Peterskirche eine Krone auf und ließ ihn als Kaiser ausrufen. Für die',
        'Chronisten war das die Vollendung: Das Reich ist wieder da. Karls',
        'Biograf Einhard behauptet, sein Herr sei überrascht gewesen und hätte die',
        'Kirche nicht betreten, wenn er es geahnt hätte — eine Behauptung, die',
        'Historiker meist für Diplomatie halten. Denn in Konstantinopel saß ein',
        'Kaiser, und dort galt die Krönung als Anmaßung. Rom war damals längst',
        'keine Millionenstadt mehr, sondern ein Ort mit vielleicht 25 000 Menschen',
        'zwischen riesigen Ruinen. Der Titel wog trotzdem schwerer als die Stadt.',
      ].join(' '),
    },
    {
      id: 'canterbury',
      name: 'Canterbury',
      typ: 'stadt',
      ...ort(1.08, 51.28),
      text: [
        '597 landete der Mönch Augustinus mit rund vierzig Begleitern in Kent —',
        'geschickt von Papst Gregor dem Großen. König Æthelberht empfing ihn im',
        'Freien, aus Vorsicht vor Zauberei, und erlaubte ihm zu predigen. Dass es',
        'so glimpflich ablief, hatte einen Grund, den die Erzählung gern übergeht:',
        'Æthelberhts Frau Bertha war eine fränkische Prinzessin und längst',
        'Christin; sie hatte ihren eigenen Bischof mitgebracht. Von Canterbury aus',
        'wurde die Insel neu christianisiert — und mit dem Glauben kamen die',
        'Schrift, die Klöster und die Chroniken. Rund 130 Jahre später schrieb hier',
        'in der Nähe Beda die erste Geschichte des englischen Volkes.',
      ].join(' '),
    },
    {
      id: 'aachen',
      name: 'Aachen',
      typ: 'stadt',
      ...ort(6.08, 50.78),
      text: [
        'Karls liebste Pfalz, wegen der heißen Quellen — er schwamm gern, schreibt',
        'Einhard, und lud den halben Hof dazu ein. Ab etwa 794 blieb Karl hier über',
        'den Winter, und aus dem Jagdschloss wurde so etwas wie eine Hauptstadt:',
        'Pfalzkapelle, Bibliothek, Hofschule. Gelehrte aus ganz Europa wurden',
        'hergeholt, allen voran der Angelsachse Alkuin aus York. Was sie taten,',
        'klingt unscheinbar und ist gewaltig: Sie ließen antike Texte abschreiben,',
        'in einer neuen, gut lesbaren Schrift. Sehr viel von dem, was wir heute aus',
        'der Antike besitzen, hat nur überlebt, weil es in diesen Jahrzehnten',
        'kopiert wurde.',
      ].join(' '),
    },
    {
      id: 'toledo',
      name: 'Toledo',
      typ: 'stadt',
      ...ort(-4.02, 39.86),
      text: [
        'Die Hauptstadt der Westgoten. Hier trat 589 das dritte Konzil von Toledo',
        'zusammen, und König Reccared verkündete, er und sein Volk gäben den',
        'arianischen Glauben auf und würden katholisch — derselbe Schritt wie bei',
        'Chlodwig, knapp hundert Jahre später und mitten in einer Kirchenversammlung.',
        'Danach regierten Könige und Bischöfe Spanien gemeinsam; die Konzilien von',
        'Toledo waren halb Kirchenversammlung, halb Reichstag. Die Schattenseite',
        'gehört dazu: Dieselben Konzilien beschlossen harte Gesetze gegen die',
        'jüdische Bevölkerung, bis hin zu Zwangstaufen. 711 ging das Reich in',
        'wenigen Monaten unter, als ein Heer aus Nordafrika über die Meerenge kam.',
      ].join(' '),
    },
  ],

  bewegungen: [
    {
      id: 'franken',
      name: 'Die Franken (486–507)',
      ...(() => {
        const [von, nach] = [p(3.4, 50.6), p(1.4, 43.6)];
        return { von, nach };
      })(),
      ueber: [p(3.3, 49.4), p(2.35, 48.85), p(1.5, 47.6), p(0.2, 46.6)],
      text: [
        'Der Weg vom kleinsten Reich der Karte zum größten, in einem einzigen',
        'Königsleben. 486 schlug Chlodwig bei Soissons den römischen Heermeister',
        'Syagrius und nahm ihm Nordgallien ab. Danach unterwarf er die Alamannen,',
        'ließ sich taufen und wandte sich nach Süden: 507 besiegte er bei Vouillé',
        'nahe Poitiers die Westgoten und drängte sie über die Pyrenäen. Toulouse,',
        'ihre Hauptstadt, fiel. Chlodwig starb 511 in Paris — als Herr über fast',
        'ganz Gallien. Was die Chronisten dabei nicht als Feldzug erzählen,',
        'sondern als Gottesurteil: Sein Krieg gegen die Westgoten galt offiziell',
        'dem falschen Glauben der Gegner.',
      ].join(' '),
    },
    {
      id: 'augustinus',
      name: 'Die Mission nach Britannien (596/597)',
      ...(() => {
        const [von, nach] = [p(12.5, 41.9), p(1.08, 51.28)];
        return { von, nach };
      })(),
      ueber: [p(9.0, 44.0), p(5.5, 45.8), p(4.0, 48.0), p(2.35, 49.5)],
      text: [
        'Diese Bewegung ist keine Eroberung, und trotzdem verändert sie mehr als',
        'mancher Feldzug. 596 schickte Papst Gregor der Große den Mönch Augustinus',
        'nach Britannien — auf die Insel, auf der nach dem Abzug der Römer Latein',
        'und Städte verschwunden waren. Unterwegs bekam die Gruppe es mit der Angst',
        'zu tun und wollte umkehren; Gregor schickte sie weiter. 597 landeten sie in',
        'Kent. Mit ihnen kam zurück, was das Kapitel erst möglich macht: die',
        'Schrift. Wo Mönche siedeln, entstehen Bibliotheken — und Chroniken. Dass',
        'wir über die angelsächsischen Königreiche überhaupt etwas wissen,',
        'verdanken wir dieser Reise.',
      ].join(' '),
    },
    {
      id: 'karls-italienzug',
      name: 'Karl nach Italien (773/774 und 800)',
      ...(() => {
        const [von, nach] = [p(6.08, 50.78), p(12.5, 41.9)];
        return { von, nach };
      })(),
      ueber: [p(7.6, 47.6), p(8.0, 45.9), p(9.2, 45.2), p(11.0, 43.5)],
      text: [
        '773 zog Karl über die Alpen, belagerte Pavia und setzte sich im Sommer 774',
        'selbst die eiserne Krone der Langobarden auf. Der Papst hatte ihn gerufen —',
        'und damit begann eine Verbindung, die Europa jahrhundertelang prägen sollte:',
        'Der König schützt den Papst, der Papst legitimiert den König. Dieselbe',
        'Straße führte Karl 800 noch einmal nach Rom, diesmal zur Kaiserkrönung.',
        'Sieh dir an, wohin dieser Pfeil zeigt und wo der Pfeil der Mission',
        'losläuft: Beide Wege verbinden dieselben zwei Orte. Macht und Schrift',
        'reisten in dieser Zeit auf denselben Straßen, nur in verschiedene',
        'Richtungen.',
      ].join(' '),
    },
  ],

  beschriftungen: [
    // Die Völkernamen bezeichnen Kerngebiete, nicht die Grenzen einer einzelnen
    // Phase — sie stehen fest, während die Flächen darunter wechseln.
    { text: 'Frankenreich', art: 'land', ...ort(3.6, 50.2) },
    { text: 'Burgunder', art: 'land', ...ort(5.4, 46.0) },
    { text: 'Westgoten', art: 'land', ...ort(-5.6, 41.7) },
    { text: 'Langobarden', art: 'land', ...ort(9.9, 45.5) },
    { text: 'Ostgoten', art: 'land', ...ort(18.6, 43.0) },
    { text: 'Angelsachsen', art: 'land', ...ort(-0.8, 52.5) },
    { text: 'Sachsen', art: 'land', ...ort(9.9, 52.7) },
    { text: 'Bayern', art: 'land', ...ort(12.3, 48.3) },
    { text: 'Römisches Reich (Ostrom)', art: 'land', ...ort(23.5, 41.6) },
    { text: 'Britannien', art: 'land', ...ort(-3.6, 54.6) },
    { text: 'Hispanien', art: 'land', ...ort(-3.8, 37.7) },
    { text: 'Italien', art: 'land', drehung: 52, ...ort(11.3, 43.2) },
    { text: 'Nordafrika', art: 'land', ...ort(3.5, 34.6) },
    { text: 'Nordsee', art: 'meer', ...ort(3.0, 55.6) },
    { text: 'Atlantik', art: 'meer', ...ort(-8.2, 45.8) },
    { text: 'Mittelmeer', art: 'meer', ...ort(13.5, 34.6) },
    { text: 'Rhein', art: 'meer', ...ort(8.4, 47.6) },
    { text: 'Donau', art: 'meer', drehung: -8, ...ort(21.4, 43.7) },
  ],
};

module.exports = karte;
