// Die Karte zum Thema „Vom Mittelalter zur Neuzeit" — Geschichte in Bewegung.
//
// Die Küstenlinien stehen hier als echte Längen-/Breitengrade `[lon, lat]` und
// werden von utils/karte-geo.js in SVG-Koordinaten umgerechnet. Wer einen Punkt
// anzweifelt, schlägt ihn im Atlas nach: `[8.27, 50.0]` ist Mainz, `[35.23,
// 31.78]` Jerusalem, `[35.4, 45.03]` Kaffa auf der Krim.
//
// Der Ausschnitt ist der größte aller drei Europakarten: 11° W bis 44° O,
// 30° N bis 58° N. Das ist keine Bequemlichkeit, sondern die Aussage des
// Kapitels. Acht Jahrhunderte lang wird der Horizont Europas größer, und die
// Karte muss mitwachsen:
//
//   * Jerusalem (31,8° N) muss ins Bild, sonst enden die Kreuzzüge im Nichts.
//   * Kaffa auf der Krim (35,4° O) muss ins Bild, sonst hat die Pest von 1347
//     keinen Ausgangspunkt — sie kam über die Handelswege des Schwarzen Meeres.
//   * Und ganz links läuft ein Pfeil aus dem Bild hinaus. Das ist 1492: Der
//     Rand der Karte ist genau der Punkt, an dem Europa aufhört, sich selbst
//     für die Welt zu halten.
//
// Zwei Festlegungen, die ausdrücklich hierher gehören:
//
//   1. Alle Flächen einer Phase werden in derselben Farbe gezeichnet (siehe
//      components/abschnitte/KarteAbschnitt.js). Die Konfessionen von 1618
//      lassen sich deshalb nicht einfärben — sie stehen als zwei
//      aneinandergrenzende Flächen im Bild, deren gemeinsame Kante man sieht,
//      und die Titel sagen, welche welche ist. Genau so grob war die Wahrheit
//      allerdings nicht: Böhmen, wo der Krieg begann, war überwiegend
//      protestantisch und liegt trotzdem im „katholischen" Teil. Der Hinweis
//      der Phase sagt das.
//   2. Afrika und der Kontinent sind getrennt gezeichnet, obwohl sie am Sinai
//      zusammenhängen. Ein einziger Umriss würde das Mittelmeer einschließen
//      und mit Landfarbe füllen. Die Landbrücke ist gut hundert Kilometer breit
//      und liegt genau am unteren Bildrand — man sieht dort eine schmale
//      Wasserrinne, wo in Wirklichkeit Wüste war.
//
// Reine Daten und Rechnung — keine UI-Importe (Architektur-Regel).

const { KARTENFARBEN, erstelleProjektion, rueckwaerts, verbinde } = require('../../karte-geo');

// ---------------------------------------------------------------------------
// Ausschnitt und Projektion
// ---------------------------------------------------------------------------

/**
 * Der Kartenausschnitt: vom Atlantik westlich Irlands (11° W) bis nach
 * Armenien (44° O), vom Nildelta (30° N) bis zur Ostsee (58° N).
 */
const RAHMEN = { minLon: -11, maxLon: 44, minLat: 30, maxLat: 58, breite: 700 };

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

/** Ostsee am oberen Bildrand: Estland → Weichselmündung → Jütland → Elbmündung. */
const OSTSEE = [
  [25.5, 59.6], // über dem Bildrand
  [23.8, 58.6],
  [22.3, 57.6],
  [21.1, 56.1], // Kurland
  [20.0, 55.2],
  [19.6, 54.7],
  [18.7, 54.6], // Weichselmündung bei Danzig
  [17.5, 54.7],
  [16.5, 54.5],
  [15.2, 54.3],
  [14.5, 54.2], // Odermündung
  [13.4, 54.1],
  [12.5, 54.4],
  [11.0, 54.4],
  [10.2, 54.4], // Kieler Förde
  [9.9, 54.8],
  [10.0, 55.5],
  [10.5, 56.2],
  [10.7, 57.0],
  [10.5, 57.7], // Skagen
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

/** Atlantikküste Frankreichs: Calais → Seine → Bretagne → Loire → Gironde. */
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

/** Nordküste Spaniens: Pyrenäen → Kap Finisterre. */
const HISPANIEN_NORD = [
  [-1.6, 43.4],
  [-2.9, 43.4],
  [-4.0, 43.5],
  [-5.8, 43.6],
  [-7.0, 43.6],
  [-7.9, 43.7],
  [-8.9, 43.3], // Kap Finisterre
];

/** Atlantikküste der Halbinsel: Finisterre → Straße von Gibraltar. */
const HISPANIEN_ATLANTIK = [
  [-8.9, 43.3],
  [-8.8, 42.5],
  [-8.8, 42.0],
  [-8.8, 41.1], // Mündung des Douro
  [-9.0, 40.0],
  [-9.4, 39.4], // Cabo da Roca
  [-9.2, 38.7], // Tejomündung, Lissabon
  [-8.9, 38.5],
  [-8.8, 37.8],
  [-8.9, 37.0], // Kap São Vicente
  [-7.4, 37.2],
  [-6.9, 37.1],
  [-6.3, 36.6], // Cádiz
  [-5.9, 36.2],
  [-5.6, 36.0], // Straße von Gibraltar
];

/** Mittelmeerküste der Halbinsel: Gibraltar → Cap de Creus. */
const HISPANIEN_MITTELMEER = [
  [-5.6, 36.0],
  [-4.4, 36.7], // Málaga
  [-2.9, 36.7],
  [-2.1, 36.8],
  [-0.8, 37.6], // Cartagena
  [0.2, 38.8], // Cabo de la Nao
  [-0.3, 39.5], // Valencia
  [0.2, 40.2],
  [0.8, 40.7], // Ebrodelta
  [1.2, 41.1],
  [2.2, 41.4], // Barcelona
  [3.2, 42.3], // Cap de Creus
];

/** Mittelmeerküste Frankreichs: Cap de Creus → Genua. */
const GALLIEN_MITTELMEER = [
  [3.2, 42.3],
  [3.0, 43.0], // Golfe du Lion
  [4.0, 43.4],
  [4.8, 43.4], // Rhônedelta
  [5.4, 43.3], // Marseille
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
  [14.0, 40.9], // Neapel
  [14.9, 40.6],
  [15.3, 40.0],
  [15.8, 39.5],
  [16.1, 38.7],
  [15.9, 38.3],
  [15.6, 38.0], // Stiefelspitze bei Reggio
];

/** Adriaküste Italiens: Stiefelspitze → Absatz → Sporn → Rimini. */
const ITALIEN_ADRIA = [
  [15.6, 38.0],
  [16.6, 38.5],
  [17.2, 39.0],
  [16.9, 40.4], // Tarent, am Golf
  [17.9, 40.3],
  [18.4, 39.8], // Absatz: Santa Maria di Leuca
  [18.5, 40.4], // Otranto
  [17.9, 40.7], // Brindisi
  [16.9, 41.1], // Bari
  [16.3, 41.3],
  [15.9, 41.6],
  [16.2, 41.9], // Sporn: der Gargano
  [15.5, 41.9],
  [14.9, 42.1],
  [14.2, 42.5],
  [13.5, 43.0],
  [13.5, 43.6], // Ancona
  [12.6, 44.1], // Rimini
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
  [15.2, 44.1], // Zadar
  [16.4, 43.5], // Split
  [17.3, 42.9],
  [18.1, 42.6], // Ragusa (Dubrovnik)
];

/** Ostküste der Adria, Südteil: Dubrovnik → Epirus. */
const BALKAN_ADRIA_SUED = [
  [18.1, 42.6],
  [19.0, 42.1],
  [19.4, 41.3], // Durrës
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
  [22.4, 36.4], // Kap Tainaron
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

/** Ägäisküste Kleinasiens: Dardanellen → Antalya. */
const ANATOLIEN_AEGAEIS = [
  [26.7, 39.6], // Dardanellen, asiatische Seite (bei Troja)
  [26.4, 39.3],
  [26.8, 38.9],
  [27.3, 38.4], // Smyrna (Izmir)
  [26.8, 38.3],
  [27.2, 37.8],
  [27.3, 37.0], // Halikarnassos
  [28.3, 36.8],
  [29.1, 36.2],
  [30.0, 36.2],
  [30.7, 36.9], // Antalya
];

/** Südküste Kleinasiens: Antalya → Golf von Iskenderun → Orontesmündung. */
const ANATOLIEN_SUED = [
  [30.7, 36.9],
  [31.5, 36.8],
  [32.3, 36.3],
  [32.8, 36.1], // Anamur, die Südspitze
  [33.7, 36.3],
  [34.6, 36.8], // Mersin
  [35.4, 36.6],
  [35.7, 36.9], // Grund des Golfs von Iskenderun
  [36.2, 36.6], // Iskenderun
  [36.0, 36.15], // Orontesmündung, bei Antiochia
];

/** Levanteküste: Orontesmündung → Gaza → Sinai → Landenge von Sues. */
const LEVANTE = [
  [36.0, 36.15],
  [35.9, 35.9],
  [35.78, 35.52], // Latakia
  [35.9, 35.1],
  [35.88, 34.9], // Tartus
  [35.84, 34.44], // Tripoli
  [35.62, 34.15],
  [35.5, 33.9], // Beirut
  [35.37, 33.56], // Sidon
  [35.2, 33.27], // Tyros
  [35.07, 32.92], // Akkon
  [34.95, 32.82], // Haifa
  [34.89, 32.5], // Caesarea
  [34.75, 32.08], // Jaffa
  [34.55, 31.67],
  [34.45, 31.5], // Gaza
  [34.25, 31.3],
  [33.8, 31.13], // el-Arisch
  [33.2, 31.1],
  [32.9, 31.05],
  [32.6, 31.2],
  [32.6, 30.6], // die Landenge von Sues
  [32.7, 30.0], // am unteren Bildrand
];

/** Ägypten: Landenge von Sues → Nildelta → Marsa Matruh → Sallum. */
const AEGYPTEN = [
  [32.3, 30.0],
  [32.25, 30.7],
  [32.2, 31.22], // bei Port Said
  [31.8, 31.45], // Damiette
  [31.1, 31.45],
  [30.4, 31.42], // Rosette
  [30.0, 31.25],
  [29.9, 31.2], // Alexandria
  [29.2, 30.95],
  [28.5, 30.85],
  [27.8, 31.1],
  [27.2, 31.35], // Marsa Matruh
  [26.2, 31.5],
  [25.1, 31.6], // Sallum
];

/** Nordafrika: Kyrenaika → Karthago → Tanger. */
const NORDAFRIKA = [
  [25.1, 31.6],
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
  [13.2, 32.9], // Tripolis
  [12.1, 33.0],
  [11.0, 33.4],
  [10.1, 34.0], // Kleine Syrte
  [10.8, 34.7],
  [10.5, 35.6], // Sousse
  [11.1, 36.8], // Kap Bon
  [10.3, 37.0], // Tunis, das alte Karthago
  [9.8, 37.3],
  [8.6, 36.9],
  [7.8, 36.9], // Annaba
  [6.0, 36.9],
  [4.8, 36.9],
  [3.1, 36.8], // Algier
  [1.2, 36.5],
  [0.1, 36.0],
  [-0.6, 35.7],
  [-1.3, 35.6],
  [-2.9, 35.3],
  [-4.3, 35.2],
  [-5.4, 35.9],
  [-5.9, 35.8], // Tanger
];

/** Atlantikküste Marokkos: Tanger → Rabat → Südrand des Bildes. */
const MAROKKO_ATLANTIK = [
  [-5.9, 35.8],
  [-6.3, 35.2],
  [-6.5, 34.6],
  [-6.9, 34.0], // Rabat
  [-7.7, 33.5],
  [-8.5, 32.8],
  [-9.3, 31.5], // Essaouira
  [-9.8, 30.4], // Agadir
];

// ---------------------------------------------------------------------------
// Das Schwarze Meer — in fünf Abschnitten, damit die Reiche sie einzeln nutzen
// ---------------------------------------------------------------------------

/** Westufer: Bosporus → Donaudelta → Odessa → Landenge von Perekop. */
const SCHWARZMEER_WEST = [
  [29.1, 41.2], // Bosporus
  [28.0, 41.6],
  [27.5, 42.1],
  [27.8, 42.7],
  [27.9, 43.2], // Warna
  [28.15, 43.7],
  [28.6, 44.2], // Constanța
  [29.0, 44.7],
  [29.7, 45.2], // Donaudelta
  [30.2, 45.9],
  [30.7, 46.5], // Odessa
  [31.5, 46.6],
  [32.0, 46.25],
  [33.6, 46.05], // Karkinitbucht
];

/** Die Krim: Perekop → Tarchankut → Sewastopol → Kaffa → Kertsch. */
const KRIM = [
  [33.6, 46.05],
  [32.5, 45.4], // Kap Tarchankut
  [33.5, 44.6], // Sewastopol
  [34.4, 44.5], // Jalta
  [35.4, 45.0], // Kaffa (Feodosia)
  [36.5, 45.35], // Kertsch
];

/** Das Asowsche Meer: Kertsch → Donmündung → Taman. */
const ASOW = [
  [36.5, 45.35],
  [37.3, 46.1],
  [38.3, 46.85],
  [39.3, 47.1], // Mündung des Don
  [39.1, 46.6],
  [38.2, 46.2],
  [37.4, 45.85],
  [36.7, 45.2], // Taman
];

/** Ostufer: Taman → Kaukasusküste → Batumi. */
const SCHWARZMEER_OST = [
  [36.7, 45.2],
  [37.8, 44.7],
  [39.3, 43.7],
  [40.5, 43.1],
  [41.6, 41.7], // Batumi
];

/** Südufer (Anatolien): Batumi → Samsun → Sinop → Bosporus. */
const SCHWARZMEER_SUED = [
  [41.6, 41.7],
  [40.0, 41.2],
  [38.4, 41.0],
  [36.3, 41.3], // Samsun
  [35.15, 42.0], // Sinop, die Nordspitze Kleinasiens
  [33.4, 41.8],
  [32.0, 41.5],
  [31.4, 41.1],
  [30.0, 41.15],
  [29.1, 41.2], // Bosporus
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

// ---------------------------------------------------------------------------
// Britannien und die Inseln
// ---------------------------------------------------------------------------

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

/** Britannien, Norden: Solway → Schottland → Newcastle. */
const BRITANNIEN_NORD = [
  [-3.5, 54.9],
  [-4.9, 54.6],
  [-4.7, 55.4],
  [-5.8, 55.3], // Kintyre
  [-5.4, 56.4],
  [-5.9, 57.0],
  [-5.5, 57.6],
  [-4.4, 58.4], // über dem Bildrand
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
  [15.6, 38.3], // Kap Peloro, gegenüber der Stiefelspitze
  [14.5, 38.1],
  [13.4, 38.2], // Palermo
  [12.5, 38.1],
  [12.4, 37.8], // Marsala
  [13.1, 37.5],
  [13.9, 37.1],
  [15.1, 36.7], // Kap Passero
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

/**
 * Zypern — auf dieser Karte kein Zierrat.
 *
 * 1191 nahm Richard Löwenherz die Insel auf dem Weg ins Heilige Land; danach
 * war sie zwei Jahrhunderte lang der Rückhalt der Kreuzfahrerstaaten und nach
 * 1291 ihr letzter Rest. 1489 fiel sie an Venedig, 1571 an die Osmanen.
 */
const ZYPERN = [
  [32.27, 35.18], // Kap Arnauti
  [32.55, 35.15],
  [33.0, 35.4],
  [33.6, 35.35],
  [34.1, 35.45],
  [34.55, 35.68], // Kap Apostolos Andreas, die Panhandle-Spitze
  [34.0, 35.05],
  [33.6, 34.95],
  [33.3, 34.72],
  [32.9, 34.66],
  [32.42, 34.75], // Paphos
];

// ---------------------------------------------------------------------------
// Flüsse — die Straßen dieser Jahrhunderte
// ---------------------------------------------------------------------------
//
// Vor der Eisenbahn ist ein Fluss der billigste Weg, den es gibt. Fast jede
// Stadt dieses Kapitels liegt an einem: Mainz am Rhein, Wittenberg an der
// Elbe, Venedig am Ende der Poebene, Köln, Paris, London. Wer wissen will,
// warum die Städte gerade dort wuchsen, sieht es an diesen Linien.

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
  [12.6, 51.8],
  [12.65, 51.87], // Wittenberg
  [11.6, 52.1], // Magdeburg
  [10.9, 53.0],
  [10.0, 53.5], // Hamburg
  [9.2, 53.85],
  [8.6, 53.9],
];

const WEICHSEL = [
  [19.0, 49.6],
  [19.94, 50.06], // Krakau
  [21.0, 51.4],
  [21.0, 52.23], // Warschau
  [19.5, 52.7],
  [18.6, 53.02], // Thorn
  [18.8, 53.7],
  [18.7, 54.4], // Danzig
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
  [4.8, 45.8], // Lyon
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

const THEMSE = [
  [-1.7, 51.7],
  [-1.0, 51.6],
  [-0.5, 51.5],
  [-0.13, 51.51], // London
  [0.6, 51.5],
  [1.0, 51.55],
];

const NIL = [
  [32.9, 24.1], // weit unter dem Bildrand
  [32.7, 26.5],
  [31.7, 28.5],
  [31.25, 30.05], // Kairo
  [31.0, 30.9],
  [30.4, 31.42],
];

// ---------------------------------------------------------------------------
// Die Landmassen
// ---------------------------------------------------------------------------

/**
 * Europa, Kleinasien und die Levante als ein Umriss — von der Ostsee bis zur
 * Landenge von Sues. Die Randpunkte liegen bewusst außerhalb des Ausschnitts:
 * So läuft das Land über den Bildrand hinaus, statt dort abzuknicken.
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
  ANATOLIEN_SUED,
  LEVANTE,
  // Rückweg außerhalb des Bildes: Arabien, die Steppe, der hohe Norden.
  [
    [33.5, 28.5],
    [50, 28],
    [50, 63],
    [27, 63],
  ],
);

/** Afrika — siehe die zweite Festlegung im Kopf dieser Datei. */
const AFRIKA = verbinde(AEGYPTEN, NORDAFRIKA, MAROKKO_ATLANTIK, [
  [-14, 25],
  [38, 25],
  [32.4, 29.0],
]);

const BRITANNIEN = verbinde(BRITANNIEN_WEST, BRITANNIEN_NORD, BRITANNIEN_OST);

/** Das Schwarze Meer samt Asowschem Meer — die Krim bleibt als Land stehen. */
const SCHWARZES_MEER = verbinde(SCHWARZMEER_WEST, KRIM, ASOW, SCHWARZMEER_OST, SCHWARZMEER_SUED);

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

/** Die Iberische Halbinsel als Ganzes. */
const IBERIEN = verbinde(
  HISPANIEN_NORD,
  HISPANIEN_ATLANTIK,
  HISPANIEN_MITTELMEER,
  rueckwaerts(PYRENAEEN),
);

/** Italien mit dem Alpenbogen als Nordgrenze. */
const ITALIEN_GANZ = verbinde(
  ITALIEN_LIGURIEN,
  ITALIEN_TYRRHENISCH,
  ITALIEN_ADRIA,
  ITALIEN_PO,
  ALPENBOGEN,
);

/**
 * Der Index des Küstenpunkts, der einem Ort am nächsten liegt.
 *
 * Die Küstenlisten sind lang, und ihre Zählung ändert sich, sobald jemand eine
 * Bucht nachträgt. Deshalb schneiden die Flächen unten nicht nach Index,
 * sondern nach Ort: „von der Elbmündung bis Calais" bleibt richtig, auch wenn
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
// Phase 1 — um 800: das Reich Karls des Großen
// ---------------------------------------------------------------------------

/**
 * Das Frankenreich Karls des Großen: von der Elbe bis an den Ebro, von der
 * Nordsee bis vor die Tore Roms. Die Ostgrenze folgt Elbe, Böhmerwald und Enns.
 */
const KARL_800 = verbinde(
  kueste(NORDSEE, [8.5, 53.9], [1.6, 50.9]),
  GALLIEN_ATLANTIK,
  PYRENAEEN,
  GALLIEN_MITTELMEER,
  ITALIEN_LIGURIEN,
  kueste(ITALIEN_TYRRHENISCH, [10.3, 43.7], [11.8, 42.1]),
  [
    [12.3, 42.5],
    [13.1, 43.1],
  ],
  kueste(ITALIEN_ADRIA, [13.5, 43.6], [12.6, 44.1]),
  ITALIEN_PO,
  [
    [13.9, 46.2],
    [14.6, 46.7],
    [15.1, 47.5],
    [14.5, 48.2],
    [13.7, 48.6],
    [12.6, 49.4],
    [12.3, 50.2],
    [11.8, 51.0],
    [11.3, 51.9],
    [10.8, 52.7],
    [9.8, 53.5],
  ],
);

/** Der Kirchenstaat — das Land, das Pippin dem Papst überschrieb. */
const KIRCHENSTAAT = verbinde(
  kueste(ITALIEN_TYRRHENISCH, [11.8, 42.1], [13.25, 41.3]),
  [
    [13.9, 42.0],
    [14.2, 42.5],
  ],
  kueste(ITALIEN_ADRIA, [14.2, 42.5], [13.5, 43.6]),
  [
    [13.1, 43.1],
    [12.3, 42.5],
  ],
);

/** Die angelsächsischen Reiche — später England. */
const ENGLAND = verbinde(
  kueste(BRITANNIEN_OST, [-1.4, 55.0], [-5.0, 50.3]),
  [
    [-3.5, 51.4],
    [-3.0, 53.0],
    [-2.7, 54.0],
    [-2.2, 54.9],
  ],
);

/** Byzanz um 800: Kleinasien, die Ägäis und die griechischen Küsten. */
const BYZANZ_800 = verbinde(
  GRIECHENLAND,
  [[26.6, 40.4]],
  ANATOLIEN_AEGAEIS,
  ANATOLIEN_SUED,
  [
    [37.2, 37.4],
    [38.6, 39.0],
    [40.3, 40.4],
  ],
  kueste(SCHWARZMEER_SUED, [41.6, 41.7], [29.1, 41.2]),
  [
    [27.6, 41.3],
    [25.4, 41.0],
    [23.2, 40.6],
    [21.2, 40.0],
  ],
);

/** Al-Andalus — der islamische Teil der Halbinsel. */
const ANDALUS_800 = verbinde(
  kueste(HISPANIEN_ATLANTIK, [-8.8, 41.1], [-5.6, 36.0]),
  kueste(HISPANIEN_MITTELMEER, [-5.6, 36.0], [0.9, 41.0]),
  [
    [-0.5, 41.6],
    [-2.5, 41.9],
    [-4.5, 41.6],
    [-6.5, 41.3],
    [-8.0, 41.1],
  ],
);

/** Asturien — der christliche Streifen im Norden. */
const ASTURIEN = verbinde(
  kueste(HISPANIEN_NORD, [-1.6, 43.4], [-8.9, 43.3]),
  [
    [-8.6, 42.3],
    [-7.5, 42.0],
    [-6.0, 42.4],
    [-4.5, 42.6],
    [-3.0, 42.8],
    [-1.9, 42.9],
  ],
);

/** Das Kalifat: Nordafrika, Ägypten und die Levante. */
const KALIFAT_800 = verbinde(
  kueste(LEVANTE, [36.0, 36.15], [32.7, 30.0]),
  kueste(AEGYPTEN, [32.3, 30.0], [25.1, 31.6]),
  NORDAFRIKA,
  MAROKKO_ATLANTIK,
  [
    [-9.0, 28.5],
    [10.0, 26.0],
    [30.0, 26.0],
    [38.0, 30.0],
    [38.5, 33.5],
    [37.0, 35.5],
  ],
);

// ---------------------------------------------------------------------------
// Phase 2 — um 1200: Kaiser, Papst und die Kreuzzüge
// ---------------------------------------------------------------------------

/** Das Heilige Römische Reich samt Burgund und Reichsitalien. */
const REICH_1200 = verbinde(
  kueste(OSTSEE, [14.5, 54.2], [8.5, 53.9]),
  kueste(NORDSEE, [8.5, 53.9], [3.5, 51.5]),
  [
    [3.2, 50.7],
    [4.2, 49.9],
    [5.0, 49.0],
    [5.6, 47.9],
    [5.0, 47.0],
    [4.6, 45.9],
    [4.7, 44.6],
    [4.6, 43.6],
  ],
  kueste(GALLIEN_MITTELMEER, [4.6, 43.4], [8.5, 44.4]),
  ITALIEN_LIGURIEN,
  kueste(ITALIEN_TYRRHENISCH, [10.3, 43.7], [11.8, 42.1]),
  [
    [12.3, 42.5],
    [13.1, 43.1],
  ],
  kueste(ITALIEN_ADRIA, [13.5, 43.6], [12.6, 44.1]),
  ITALIEN_PO,
  [
    [14.0, 46.2],
    [15.5, 46.8],
    [16.8, 47.6],
    [16.5, 48.8],
    [15.0, 49.0],
    [14.0, 49.6],
    [12.5, 50.4],
    [12.0, 51.4],
    [14.0, 52.4],
    [14.4, 53.3],
  ],
);

/** Das Königreich Frankreich der Kapetinger. */
const FRANKREICH_1200 = verbinde(
  GALLIEN_ATLANTIK,
  PYRENAEEN,
  kueste(GALLIEN_MITTELMEER, [3.2, 42.3], [4.4, 43.4]),
  [
    [4.4, 44.3],
    [4.4, 45.5],
    [4.9, 46.9],
    [5.4, 47.8],
    [4.9, 49.0],
    [4.0, 49.9],
    [3.1, 50.7],
    [2.6, 51.0],
  ],
);

/** Die christlichen Reiche Spaniens — die Reconquista hat den Süden erreicht. */
const CHRISTLICHES_SPANIEN_1200 = verbinde(
  kueste(HISPANIEN_NORD, [-1.6, 43.4], [-8.9, 43.3]),
  kueste(HISPANIEN_ATLANTIK, [-8.9, 43.3], [-8.9, 38.7]),
  [
    [-7.5, 38.7],
    [-6.0, 38.8],
    [-4.0, 39.4],
    [-2.0, 39.5],
    [-0.6, 39.9],
  ],
  kueste(HISPANIEN_MITTELMEER, [-0.6, 39.9], [3.2, 42.3]),
  rueckwaerts(PYRENAEEN),
);

/** Was den Almohaden im Süden geblieben ist. */
const ANDALUS_1200 = verbinde(
  kueste(HISPANIEN_ATLANTIK, [-8.9, 38.7], [-5.6, 36.0]),
  kueste(HISPANIEN_MITTELMEER, [-5.6, 36.0], [-0.6, 39.9]),
  [
    [-2.0, 39.5],
    [-4.0, 39.4],
    [-6.0, 38.8],
    [-7.5, 38.7],
  ],
);

/**
 * Die Kreuzfahrerstaaten — nach 1187 nur noch ein Küstenstreifen.
 *
 * Genau das ist die Aussage: Jerusalem selbst liegt nicht mehr darin.
 */
const KREUZFAHRERSTAATEN = verbinde(
  kueste(LEVANTE, [36.0, 36.15], [34.9, 32.5]),
  [
    [35.4, 32.6],
    [36.0, 33.5],
    [36.3, 34.6],
    [36.6, 35.6],
    [36.5, 36.2],
  ],
);

/** Byzanz um 1200 — Zentralanatolien ist an die Seldschuken verloren. */
const BYZANZ_1200 = verbinde(
  GRIECHENLAND,
  [[26.6, 40.4]],
  ANATOLIEN_AEGAEIS,
  kueste(ANATOLIEN_SUED, [30.7, 36.9], [32.5, 36.3]),
  [
    [32.0, 37.5],
    [31.0, 39.0],
    [31.5, 40.5],
  ],
  kueste(SCHWARZMEER_SUED, [31.5, 41.0], [29.1, 41.2]),
  [
    [27.6, 41.3],
    [25.4, 41.0],
    [23.2, 40.6],
    [21.2, 40.0],
  ],
);

// ---------------------------------------------------------------------------
// Phase 3 — um 1500: die Welt wird größer
// ---------------------------------------------------------------------------

/** Das Reich um 1500 — ohne Burgund, das an Frankreich gefallen ist. */
const REICH_1500 = verbinde(
  kueste(OSTSEE, [14.5, 54.2], [8.5, 53.9]),
  kueste(NORDSEE, [8.5, 53.9], [3.5, 51.5]),
  [
    [3.8, 50.9],
    [4.6, 50.3],
    [5.9, 49.5],
    [6.1, 48.6],
    [5.7, 47.6],
    [6.2, 46.4],
    [7.0, 45.9],
    [8.0, 46.0],
    [9.5, 46.4],
    [11.5, 46.6],
    [13.5, 46.3],
    [14.0, 46.2],
    [15.5, 46.8],
    [16.8, 47.6],
    [16.5, 48.8],
    [15.0, 49.0],
    [14.0, 49.6],
    [12.5, 50.4],
    [12.0, 51.4],
    [14.0, 52.4],
    [14.4, 53.3],
  ],
);

/** Frankreich um 1500 — die Provence ist 1481 dazugekommen. */
const FRANKREICH_1500 = verbinde(
  GALLIEN_ATLANTIK,
  PYRENAEEN,
  kueste(GALLIEN_MITTELMEER, [3.2, 42.3], [6.9, 43.4]),
  [
    [6.6, 44.3],
    [6.0, 45.2],
    [5.6, 46.2],
    [5.7, 47.5],
    [6.1, 48.6],
    [5.9, 49.5],
    [4.6, 50.3],
    [3.8, 50.9],
    [2.6, 51.0],
  ],
);

/** Spanien — 1492 vereinigt und bis zur Meerenge christlich. */
const SPANIEN_1500 = verbinde(
  kueste(HISPANIEN_NORD, [-1.6, 43.4], [-8.9, 43.3]),
  kueste(HISPANIEN_ATLANTIK, [-8.9, 43.3], [-8.8, 41.9]),
  [
    [-7.0, 41.9],
    [-6.9, 41.0],
    [-7.0, 40.0],
    [-7.3, 39.0],
    [-7.0, 38.0],
    [-7.4, 37.2],
  ],
  kueste(HISPANIEN_ATLANTIK, [-7.4, 37.2], [-5.6, 36.0]),
  HISPANIEN_MITTELMEER,
  rueckwaerts(PYRENAEEN),
);

/** Portugal — von hier fahren die Schiffe nach Süden und Westen. */
const PORTUGAL = verbinde(
  kueste(HISPANIEN_ATLANTIK, [-8.8, 41.9], [-7.4, 37.2]),
  [
    [-7.0, 38.0],
    [-7.3, 39.0],
    [-7.0, 40.0],
    [-6.9, 41.0],
    [-7.0, 41.9],
  ],
);

/** Das Osmanische Reich um 1500: der Balkan, Konstantinopel, Kleinasien. */
const OSMANEN_1500 = verbinde(
  [
    [26.0, 45.3],
    [24.0, 45.0],
    [22.5, 44.5],
    [21.0, 44.6],
    [19.5, 44.5],
    [18.0, 44.4],
    [17.0, 43.6],
    [18.5, 42.6],
  ],
  kueste(BALKAN_ADRIA_SUED, [18.5, 42.4], [20.1, 39.6]),
  GRIECHENLAND,
  [[26.6, 40.4]],
  ANATOLIEN_AEGAEIS,
  ANATOLIEN_SUED,
  [
    [36.5, 36.6],
    [38.5, 38.2],
    [40.5, 39.6],
    [41.2, 41.0],
  ],
  kueste(SCHWARZMEER_SUED, [41.6, 41.7], [29.1, 41.2]),
  kueste(SCHWARZMEER_WEST, [29.1, 41.2], [29.6, 45.2]),
  [[28.0, 45.4]],
);

/** Ägypten und Syrien — 1500 noch mamlukisch, ab 1517 osmanisch. */
const AEGYPTEN_SYRIEN = verbinde(
  kueste(LEVANTE, [36.0, 36.15], [32.7, 30.0]),
  kueste(AEGYPTEN, [32.3, 30.0], [25.1, 31.6]),
  [
    [26.0, 28.0],
    [33.0, 26.0],
    [38.0, 29.0],
    [38.0, 33.0],
    [37.0, 35.5],
  ],
);

// ---------------------------------------------------------------------------
// Phase 4 — 1618: zwei Konfessionen, eine Karte
// ---------------------------------------------------------------------------
//
// Die Kante zwischen den beiden Flächen läuft ungefähr am Main entlang. Sie
// ist die gröbste Linie dieser ganzen Karte — siehe die erste Festlegung im
// Kopf der Datei und den Hinweis der Phase.

/** Die Linie, an der sich die beiden Konfessionsflächen berühren. */
const KONFESSIONSKANTE = [
  [3.5, 50.6],
  [5.0, 50.3],
  [6.5, 50.1],
  [8.0, 50.0],
  [9.5, 50.2],
  [11.5, 50.3],
  [13.0, 50.9],
  [15.0, 51.5],
  [17.0, 52.0],
  [19.5, 52.3],
  [22.0, 52.0],
];

/** Der überwiegend katholische Süden und Westen. */
const KATHOLISCH_1618 = verbinde(
  GALLIEN_ATLANTIK,
  HISPANIEN_NORD,
  HISPANIEN_ATLANTIK,
  HISPANIEN_MITTELMEER,
  GALLIEN_MITTELMEER,
  ITALIEN_LIGURIEN,
  ITALIEN_TYRRHENISCH,
  ITALIEN_ADRIA,
  ITALIEN_PO,
  [
    [14.2, 46.4],
    [15.5, 46.9],
    [17.0, 47.8],
    [19.0, 48.4],
    [21.0, 49.3],
    [23.0, 50.2],
    [24.0, 51.5],
  ],
  rueckwaerts(KONFESSIONSKANTE),
);

/** Der überwiegend protestantische Norden. */
const PROTESTANTISCH_1618 = verbinde(
  KONFESSIONSKANTE,
  [
    [22.0, 53.5],
    [21.0, 54.3],
    [19.6, 54.7],
  ],
  kueste(OSTSEE, [19.6, 54.7], [8.5, 53.9]),
  kueste(NORDSEE, [8.5, 53.9], [3.5, 51.5]),
  [[3.2, 51.0]],
);

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
    land(ZYPERN),
    wasser(SCHWARZES_MEER),
    wasser(MARMARAMEER),
    fluss(RHEIN),
    fluss(DONAU),
    fluss(ELBE),
    fluss(WEICHSEL),
    fluss(SEINE),
    fluss(LOIRE),
    fluss(RHONE),
    fluss(PO),
    fluss(EBRO),
    fluss(TAJO),
    fluss(THEMSE),
    fluss(NIL),
  ],

  phasen: [
    {
      id: 'karl',
      label: 'um 800',
      hinweis:
        'Am Anfang steht ein Reich, das fast den ganzen Westen umfasst — und das keine hundert Jahre hält. Daneben liegen die beiden Mächte, an denen Europa sich die nächsten Jahrhunderte abarbeitet: das Kalifat im Süden, das den ganzen Mittelmeerrand hält, und Byzanz im Osten, wo der Kaiser sitzt, der sich für den einzigen hält. Der kleine Streifen mitten in Italien ist der Kirchenstaat — von hier aus wird der Papst das Reich später herausfordern.',
      flaechen: [
        gebiet('Das Reich Karls des Großen', KARL_800),
        gebiet('Der Kirchenstaat — Pippins Schenkung an den Papst', KIRCHENSTAAT),
        gebiet('Die angelsächsischen Reiche in Britannien', ENGLAND),
        gebiet('Das Byzantinische Reich — Kleinasien und die griechischen Küsten', BYZANZ_800),
        gebiet('Al-Andalus — der islamische Teil der Halbinsel', ANDALUS_800),
        gebiet('Asturien — der christliche Norden', ASTURIEN),
        gebiet('Das Kalifat — Nordafrika, Ägypten und die Levante', KALIFAT_800),
      ],
    },
    {
      id: 'kaiser-und-papst',
      label: 'um 1200',
      hinweis:
        'Karls Reich ist längst geteilt: Aus dem Westteil wird Frankreich, aus dem Ostteil das Heilige Römische Reich. Es ist die Zeit der Kathedralen, der ersten Universitäten und des Streits zwischen Kaiser und Papst. An der Levante liegen die Kreuzfahrerstaaten — und das, was von ihnen 1200 übrig ist, sagt mehr als jede Erzählung: ein Küstenstreifen. Jerusalem selbst ist seit 1187 wieder verloren.',
      flaechen: [
        gebiet('Das Heilige Römische Reich', REICH_1200),
        gebiet('Das Königreich Frankreich', FRANKREICH_1200),
        gebiet('Das Königreich England', ENGLAND),
        gebiet('Die christlichen Reiche Spaniens', CHRISTLICHES_SPANIEN_1200),
        gebiet('Al-Andalus unter den Almohaden', ANDALUS_1200),
        gebiet('Die Kreuzfahrerstaaten — nach 1187 ein Küstenstreifen', KREUZFAHRERSTAATEN),
        gebiet('Das Byzantinische Reich', BYZANZ_1200),
      ],
    },
    {
      id: 'entdeckungen',
      label: 'um 1500',
      hinweis:
        'In zwei Menschenaltern ändert sich alles: 1453 nehmen die Osmanen Konstantinopel — das Oströmische Reich, das seit über tausend Jahren bestand, ist zu Ende. Um 1450 druckt Gutenberg in Mainz mit beweglichen Lettern. 1492 fällt Granada, und im selben Jahr segelt Kolumbus nach Westen. Sieh dir an, wo der Pfeil aus dem Bild läuft: Genau dort hört Europa auf, sich für die Welt zu halten.',
      flaechen: [
        gebiet('Das Heilige Römische Reich', REICH_1500),
        gebiet('Das Königreich Frankreich', FRANKREICH_1500),
        gebiet('Spanien — 1492 vereinigt', SPANIEN_1500),
        gebiet('Portugal — der andere Weg nach Osten', PORTUGAL),
        gebiet('Das Königreich England', ENGLAND),
        gebiet('Die italienischen Staaten — Venedig, Mailand, Florenz, Rom, Neapel', ITALIEN_GANZ),
        gebiet('Das Osmanische Reich — seit 1453 auch Konstantinopel', OSMANEN_1500),
        gebiet('Ägypten und Syrien unter den Mamluken', AEGYPTEN_SYRIEN),
      ],
    },
    {
      id: 'konfessionen',
      label: '1618',
      hinweis:
        'Hundert Jahre nach Luthers Thesen ist Europa geteilt — nicht mehr in Reiche, sondern in Bekenntnisse. Die Kante zwischen den beiden Flächen ist die gröbste Linie dieser Karte, und sie ist mit Absicht grob: In Wirklichkeit lag beides oft im selben Land, manchmal im selben Dorf. Böhmen zum Beispiel war überwiegend protestantisch und liegt hier trotzdem im katholischen Teil — und genau dort, in Prag, beginnt 1618 der Krieg.',
      flaechen: [
        gebiet('Überwiegend katholisch — Spanien, Frankreich, Italien, Österreich, Polen', KATHOLISCH_1618),
        gebiet('Überwiegend protestantisch — Norddeutschland, Dänemark, die Niederlande', PROTESTANTISCH_1618),
        gebiet('England und Schottland — seit 1603 unter einer Krone', BRITANNIEN),
        gebiet('Das Osmanische Reich', OSMANEN_1500),
        gebiet('Ägypten und Syrien — seit 1517 osmanisch', AEGYPTEN_SYRIEN),
      ],
    },
  ],

  punkte: [
    {
      id: 'aachen',
      name: 'Aachen',
      typ: 'stadt',
      ...ort(6.08, 50.78),
      text: [
        'Karls Pfalz — und der Ort, an dem dieses Kapitel anfängt. Was hier',
        'entstand, überlebte das Reich um Jahrhunderte: In der Hofschule wurden',
        'antike Texte abgeschrieben, in einer neuen, gut lesbaren Schrift. Sehr',
        'viel von dem, was wir heute aus der Antike besitzen, hat nur deshalb',
        'überdauert. Und die Pfalzkapelle blieb Krönungskirche: Bis 1531 wurden',
        'die deutschen Könige hier gekrönt, mehr als dreißig an der Zahl. Wer',
        'wissen will, warum das Mittelalter so gern nach hinten schaute — hier',
        'ist die Antwort in Stein. Jeder spätere Herrscher wollte der neue Karl',
        'sein.',
      ].join(' '),
    },
    {
      id: 'canossa',
      name: 'Canossa',
      typ: 'ereignis',
      ...ort(10.42, 44.58),
      text: [
        'Im Januar 1077 stand Kaiser Heinrich IV. drei Tage lang im Büßergewand',
        'vor dieser Burg, in der Papst Gregor VII. saß, und bat um Aufhebung des',
        'Kirchenbanns. Er bekam sie. Streitpunkt war, wer die Bischöfe einsetzen',
        'darf — für den Kaiser eine Machtfrage, denn Bischöfe verwalteten halbe',
        'Länder. Man kann den Gang nach Canossa als Demütigung lesen; man kann',
        'ihn auch als Schachzug lesen, denn Heinrich war den Bann los und stand',
        'kurz darauf wieder mit einem Heer in Italien. Beides stimmt. Was blieb,',
        'war die neue Frage: Gibt es eine Macht über dem Kaiser? Seither ringen',
        'in Europa zwei Gewalten miteinander, statt in einer Hand zu liegen.',
      ].join(' '),
    },
    {
      id: 'jerusalem',
      name: 'Jerusalem',
      typ: 'ereignis',
      ...ort(35.23, 31.78),
      text: [
        '1095 rief Papst Urban II. zum Kreuzzug auf; die Menge soll „Gott will',
        'es!" gerufen haben. Am 15. Juli 1099 nahmen die Kreuzfahrer die Stadt —',
        'und richteten unter Muslimen und Juden ein Blutbad an, über das schon',
        'die eigenen Chronisten mit Entsetzen schrieben. Das gehört zu dieser',
        'Erzählung dazu, auch wenn sie sonst vom Glauben handelt. 1187 gewann',
        'Saladin die Stadt zurück und ließ die Bewohner gegen Lösegeld abziehen —',
        'ein Verhalten, das im Westen noch Jahrhunderte später bewundert wurde.',
        'Nach knapp zweihundert Jahren war 1291 alles wieder verloren. Geblieben',
        'ist, was niemand geplant hatte: Handel, Zahlen, Medizin, Bücher — und',
        'die Erfahrung, dass hinter dem Horizont eine Welt lag.',
      ].join(' '),
    },
    {
      id: 'venedig',
      name: 'Venedig',
      typ: 'stadt',
      ...ort(12.34, 45.44),
      text: [
        'Die Stadt, die vom Dazwischen lebte: Aus dem Osten kamen Pfeffer, Seide',
        'und Zucker, aus dem Norden Silber und Tuch, und Venedig nahm bei jedem',
        'Umschlag seinen Anteil. Wer im Mittelalter wissen wollte, was die Welt',
        'zu bieten hat, fragte hier. Die Kehrseite steht in denselben Akten:',
        '1204 lenkte Venedig den Vierten Kreuzzug auf Konstantinopel um — eine',
        'christliche Stadt, geplündert von einem christlichen Heer, weil die',
        'Reise sonst nicht zu bezahlen war. Byzanz hat sich davon nie erholt.',
        'Und über dieselben Handelswege kam 1347 die Pest.',
      ].join(' '),
    },
    {
      id: 'konstantinopel',
      name: 'Konstantinopel',
      typ: 'ereignis',
      ...ort(28.98, 41.02),
      text: [
        'Am 29. Mai 1453 nahm Sultan Mehmed II. die Stadt; der letzte',
        'byzantinische Kaiser fiel in den Kämpfen. Damit endete nach fast',
        'elfhundert Jahren das Oströmische Reich — jenes Reich, das in den',
        'früheren Kapiteln dieser App immer noch dastand, wenn im Westen längst',
        'alles zerfallen war. Entschieden wurde es unter anderem durch Kanonen,',
        'gegen die keine antike Mauer mehr half. Für Europa hatte der Fall zwei',
        'Folgen: Griechische Gelehrte gingen mit ihren Handschriften nach',
        'Italien und brachten die Antike mit — und der Landweg nach Osten war',
        'nun in osmanischer Hand. Wer Gewürze wollte, musste einen Seeweg',
        'suchen.',
      ].join(' '),
    },
    {
      id: 'mainz',
      name: 'Mainz',
      typ: 'ereignis',
      ...ort(8.27, 50.0),
      text: [
        'Um 1450 setzte Johannes Gutenberg hier zusammen, was es einzeln längst',
        'gab: bewegliche Metalllettern, eine Presse nach dem Vorbild der',
        'Weinkelter und eine Druckerfarbe, die auf Metall hält. Vorher schrieb',
        'ein Mönch Monate an einem Buch; jetzt entstanden Hunderte gleicher',
        'Exemplare. Fünfzig Jahre später gab es in Europa Millionen Bücher. Ohne',
        'diese Werkstatt hätte Luthers Streitschrift 1517 wenige Leser gefunden;',
        'mit ihr war sie in zwei Wochen im ganzen Reich. Gutenberg selbst',
        'verlor seine Werkstatt im Streit an einen Geldgeber und starb ohne',
        'Vermögen.',
      ].join(' '),
    },
    {
      id: 'wittenberg',
      name: 'Wittenberg',
      typ: 'ereignis',
      ...ort(12.65, 51.87),
      text: [
        '1517 wandte sich der Mönch und Professor Martin Luther gegen den',
        'Ablasshandel — gegen das Versprechen, man könne sich mit Geld Strafen',
        'im Jenseits erlassen. Ob er 95 Thesen an die Kirchentür schlug, ist',
        'unsicher; sicher ist, dass er sie verschickte und dass der Buchdruck',
        'den Rest besorgte. Aus einer gelehrten Streitfrage wurde binnen',
        'Jahren die Spaltung der westlichen Christenheit. Luther übersetzte die',
        'Bibel ins Deutsche und prägte damit die Sprache mit; er schrieb aber',
        'auch übelste Hetzschriften gegen Juden und rief 1525 zur',
        'Niederschlagung der aufständischen Bauern auf. Beides gehört zu',
        'demselben Mann.',
      ].join(' '),
    },
  ],

  bewegungen: [
    {
      id: 'kreuzzug',
      name: 'Der Erste Kreuzzug (1096–1099)',
      ...(() => {
        const [von, nach] = [p(3.09, 45.78), p(35.23, 31.78)];
        return { von, nach };
      })(),
      ueber: [p(8.5, 48.0), p(12.1, 49.0), p(19.0, 47.5), p(23.0, 43.2), p(28.98, 41.02), p(36.2, 36.2)],
      text: [
        'Im November 1095 rief Papst Urban II. in Clermont zum Zug nach',
        'Jerusalem auf. Was dann losmarschierte, war kein Heer im heutigen Sinn,',
        'sondern ein Zug aus Rittern, Knechten, Pilgern, Frauen und Kindern —',
        'die meisten kamen nie an. Der Weg führte über Land: die Donau hinunter,',
        'durch Ungarn und den Balkan nach Konstantinopel, dann quer durch',
        'Kleinasien. Schon unterwegs, im Rheinland, ermordeten Kreuzfahrergruppen',
        'jüdische Gemeinden — die ersten großen Judenpogrome Europas. Drei Jahre',
        'nach dem Aufbruch stand ein Rest des Zuges vor Jerusalem.',
      ].join(' '),
    },
    {
      id: 'pest',
      name: 'Der Schwarze Tod (1347–1353)',
      ...(() => {
        const [von, nach] = [p(35.4, 45.03), p(-0.13, 51.51)];
        return { von, nach };
      })(),
      ueber: [p(28.98, 41.02), p(15.55, 38.19), p(9.0, 44.3), p(5.37, 43.3), p(2.35, 48.85)],
      text: [
        'Die Pest nahm den Weg des Handels. 1347 brach sie in Kaffa aus, einem',
        'genuesischen Stützpunkt auf der Krim; im Oktober liefen die Schiffe in',
        'Messina ein, im Winter in Genua und Marseille, im Sommer 1348 war sie in',
        'Paris, im Herbst in London. In fünf Jahren starb etwa ein Drittel der',
        'Menschen Europas, in manchen Städten die Hälfte. Sieh dir die Linie an:',
        'Sie folgt genau den Wegen, auf denen vorher Pfeffer und Seide kamen. Der',
        'Reichtum und die Seuche benutzten dieselben Straßen. Und weil niemand',
        'die Ursache kannte, suchte man Schuldige — in vielen Städten wurden die',
        'jüdischen Gemeinden beschuldigt und ermordet.',
      ].join(' '),
    },
    {
      id: 'kolumbus',
      name: 'Kolumbus fährt nach Westen (1492)',
      ...(() => {
        const [von, nach] = [p(-6.9, 37.2), p(-10.85, 33.6)];
        return { von, nach };
      })(),
      ueber: [p(-8.6, 35.6)],
      text: [
        'Am 3. August 1492 liefen drei Schiffe aus Palos aus. Der Plan war nicht,',
        'Amerika zu finden — der Plan war, Indien zu erreichen, indem man nach',
        'Westen segelt statt um Afrika herum. Dass die Erde eine',
        'Kugel ist, war unter Gelehrten längst bekannt; umstritten war ihre',
        'Größe, und Kolumbus schätzte sie viel zu klein. Der wirkliche Weg führte',
        'zuerst nach Süden zu den Kanaren, die unter dem Rand dieser Karte',
        'liegen, und von dort mit dem Passat nach Westen. Der Pfeil endet hier am',
        'Bildrand, und das ist die Aussage dieses Kapitels: Was danach kommt,',
        'passt nicht mehr auf eine Karte von Europa. Es hat ein eigenes.',
      ].join(' '),
    },
    {
      id: 'reformation',
      name: 'Die Reformation zieht nach Norden (ab 1517)',
      ...(() => {
        const [von, nach] = [p(12.65, 51.87), p(12.57, 55.68)];
        return { von, nach };
      })(),
      ueber: [p(11.5, 53.0), p(10.7, 53.87)],
      text: [
        'Von Wittenberg aus lief die neue Lehre die Handelswege entlang nach',
        'Norden — über die Hansestädte an Ostsee und Nordsee, wo Kaufleute,',
        'Drucker und Ratsherren sie aufnahmen, bis nach Dänemark und Schweden,',
        'die in den 1530er Jahren lutherisch wurden. Das ging so schnell, weil',
        'zwei Dinge zusammenkamen: gedruckte Flugschriften in deutscher Sprache',
        'und Fürsten, denen die Reformation erlaubte, Kirchengut einzuziehen.',
        'Glaube und Rechnung liefen nebeneinanderher — was die eine Seite',
        'Erneuerung nannte, hieß auf der anderen Seite Raub.',
      ].join(' '),
    },
  ],

  beschriftungen: [
    { text: 'Frankenreich', art: 'land', ...ort(2.0, 49.2) },
    { text: 'Heiliges Römisches Reich', art: 'land', ...ort(11.6, 53.2) },
    { text: 'Frankreich', art: 'land', ...ort(1.4, 46.6) },
    { text: 'England', art: 'land', ...ort(-1.6, 52.6) },
    { text: 'Spanien', art: 'land', ...ort(-4.2, 40.4) },
    { text: 'Italien', art: 'land', drehung: 52, ...ort(12.6, 42.6) },
    { text: 'Byzanz', art: 'land', ...ort(32.6, 38.6) },
    { text: 'Osmanisches Reich', art: 'land', ...ort(23.0, 42.6) },
    { text: 'Ägypten', art: 'land', ...ort(30.2, 30.9) },
    { text: 'Nordsee', art: 'meer', ...ort(2.6, 55.9) },
    { text: 'Ostsee', art: 'meer', ...ort(17.4, 56.6) },
    { text: 'Atlantik', art: 'meer', ...ort(-7.2, 46.6) },
    { text: 'Mittelmeer', art: 'meer', ...ort(15.4, 34.4) },
    { text: 'Schwarzes Meer', art: 'meer', ...ort(35.5, 44.6) },
    { text: 'Rhein', art: 'meer', drehung: 74, ...ort(8.0, 47.8) },
    { text: 'Donau', art: 'meer', drehung: -12, ...ort(21.4, 45.0) },
  ],
};

module.exports = karte;
