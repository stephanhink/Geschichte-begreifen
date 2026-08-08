// Die Karte zum Thema „Das Römische Reich" — Geschichte in Bewegung.
//
// Die Küstenlinien stehen hier als echte Längen-/Breitengrade `[lon, lat]`
// und werden von utils/karte-geo.js in SVG-Koordinaten umgerechnet. Wer
// einen Punkt anzweifelt, schlägt ihn im Atlas nach: `[12.5, 41.9]` ist Rom,
// `[10.3, 36.9]` Karthago, `[-5.6, 36.0]` die Straße von Gibraltar.
//
// Der Zuschnitt ist eine klare Schulatlas-Karte, auf das Nötige reduziert:
// die Küsten so genau, dass man Italien als Stiefel, die Iberische
// Halbinsel, Britannien, Nordafrika, das Schwarze Meer und das Nildelta
// sofort erkennt — aber ohne jede Bucht, die nichts erzählt.
//
// Die Küstenabschnitte sind absichtlich in benannte Stücke zerlegt: Dieselbe
// Punktliste trägt einmal die Landmasse und einmal die Reichsgrenze, die ihr
// folgt. So liegt keine Küste zweimal (und zweimal anders) im Repo.
//
// Reine Daten und Rechnung — keine UI-Importe (Architektur-Regel).

const { KARTENFARBEN, erstelleProjektion, rueckwaerts, verbinde } = require('../../karte-geo');

// ---------------------------------------------------------------------------
// Ausschnitt und Projektion
// ---------------------------------------------------------------------------

/**
 * Der Kartenausschnitt: vom Atlantik (12° W) bis Mesopotamien (48° O), von
 * Britannien (58° N) bis zum Oberlauf des Nils (22° N). Das ist der Rahmen,
 * in dem die ganze Geschichte dieses Kapitels spielt.
 */
const RAHMEN = { minLon: -12, maxLon: 48, minLat: 22, maxLat: 58, breite: 700 };

const geo = erstelleProjektion(RAHMEN);

/** Kurzform: geografischer Ort → SVG-Punkt `[x, y]`. */
const p = (lon, lat) => geo.punkt(lon, lat);

// ---------------------------------------------------------------------------
// Küstenabschnitte — jeweils in einer Richtung notiert
// ---------------------------------------------------------------------------

/** Ostsee: Golf von Riga → Weichselmündung → Jütland → Elbmündung. */
const OSTSEE = [
  [24.6, 58.6], // Estland, über dem Bildrand
  [24.4, 57.6],
  [24.0, 57.0], // Riga
  [21.1, 56.1],
  [19.6, 54.7],
  [18.7, 54.6], // Danzig
  [16.5, 54.5],
  [14.5, 54.2],
  [12.5, 54.4],
  [11.0, 54.4],
  [10.2, 54.4], // Kieler Förde
  [9.9, 54.8],
  [10.0, 55.5],
  [10.5, 56.2],
  [10.7, 57.0],
  [10.5, 57.7], // Skagen — Nordspitze Jütlands
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
  [7.0, 53.7],
  [5.5, 53.4],
  [4.6, 52.5],
  [4.1, 51.9], // Rheinmündung
  [3.5, 51.5],
  [2.6, 51.1],
  [1.6, 50.9], // Calais
];

/** Atlantikküste Galliens: Calais → Bretagne → Gironde → Pyrenäen. */
const GALLIEN_ATLANTIK = [
  [1.6, 50.9],
  [0.2, 49.7], // Seinemündung
  [-1.2, 49.4],
  [-1.9, 49.7], // Cotentin
  [-2.5, 48.6],
  [-4.8, 48.6], // Nordwestspitze der Bretagne
  [-4.6, 48.0],
  [-2.5, 47.5],
  [-2.2, 47.3],
  [-1.2, 46.3],
  [-1.1, 45.6], // Gironde
  [-1.2, 44.6],
  [-1.6, 43.4], // am Fuß der Pyrenäen
];

/** Nordküste Hispaniens: Pyrenäen → Kap Finisterre. */
const HISPANIEN_NORD = [
  [-1.6, 43.4],
  [-2.9, 43.4],
  [-5.8, 43.6],
  [-7.9, 43.7],
  [-8.9, 43.3], // Kap Finisterre
];

/** Atlantikküste Hispaniens: Finisterre → Straße von Gibraltar. */
const HISPANIEN_ATLANTIK = [
  [-8.9, 43.3],
  [-8.8, 42.0],
  [-8.8, 41.1], // Mündung des Douro
  [-9.0, 40.0],
  [-9.4, 39.4], // Cabo da Roca
  [-8.9, 38.5],
  [-8.9, 37.0], // Kap São Vicente
  [-7.4, 37.2],
  [-6.3, 36.6], // Gades (Cádiz)
  [-5.6, 36.0], // Straße von Gibraltar
];

/** Mittelmeerküste Hispaniens: Gibraltar → Cap de Creus. */
const HISPANIEN_MITTELMEER = [
  [-5.6, 36.0],
  [-4.4, 36.7], // Malaca
  [-2.9, 36.7],
  [-0.8, 37.6], // Carthago Nova
  [0.2, 38.8], // Cabo de la Nao
  [-0.3, 39.5], // Valentia
  [0.8, 40.7], // Ebrodelta
  [1.2, 41.1],
  [2.2, 41.4], // Barcino
  [3.2, 42.3], // Cap de Creus
];

/** Mittelmeerküste Galliens: Cap de Creus → Genua. */
const GALLIEN_MITTELMEER = [
  [3.2, 42.3],
  [3.0, 43.0], // Golfe du Lion
  [4.8, 43.4], // Rhônedelta
  [5.4, 43.3], // Massilia
  [7.0, 43.5], // Nizza
  [8.5, 44.4], // Genua
];

/** Ligurische Küste: Genua → Arnomündung. */
const ITALIEN_LIGURIEN = [
  [8.5, 44.4],
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
 * Die Meerenge der Dardanellen ist keine zwei Kilometer breit — in diesem
 * Maßstab dünner als ein Strich. Die Landmasse geht hier deshalb durch; das
 * Marmarameer weiter nördlich zeigt die Wasserstraße an.
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
  [32.8, 36.1],
  [34.0, 36.3], // Kilikien
  [35.3, 36.8],
  [36.2, 36.6], // Golf von Issos
];

/** Levante: Golf von Issos → Gaza → Pelusium am Ostrand des Nildeltas. */
const LEVANTE = [
  [36.2, 36.6],
  [35.9, 35.9],
  [35.9, 35.4],
  [35.5, 35.0], // Laodikeia
  [35.6, 34.5],
  [35.2, 33.9], // Tripolis
  [35.5, 33.3], // Berytus
  [35.1, 33.1],
  [35.0, 32.5],
  [34.9, 31.8], // Ioppe
  [34.5, 31.5], // Gaza
  [33.6, 31.1],
  [32.6, 31.1],
  [32.3, 31.2], // Pelusium
];

/** Ägyptische Küste: Pelusium → Nildelta → Alexandria → Marmarica. */
const AEGYPTEN_KUESTE = [
  [32.3, 31.2],
  [31.8, 31.5],
  [31.2, 31.6], // Spitze des Nildeltas
  [30.4, 31.5],
  [29.9, 31.2], // Alexandria
  [29.0, 30.9],
  [28.0, 30.9],
  [27.2, 31.3],
  [26.2, 31.5],
  [25.1, 31.6], // Marmarica
];

/** Nordafrika: Marmarica → Große Syrte → Karthago → Tingis (Tanger). */
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
  [-6.9, 34.0], // Sala (Rabat)
  [-7.7, 33.5],
  [-8.8, 32.3],
  [-9.3, 31.5],
  [-9.7, 30.5],
  [-10.4, 29.2],
  [-11.3, 28.4],
  [-12.6, 27.8], // schon außerhalb des Bildes
];

/** Schwarzes Meer, Südufer (Anatolien): Bosporus → Kolchis. */
const SCHWARZMEER_SUED = [
  [29.1, 41.2], // Bosporus
  [31.4, 41.1],
  [33.4, 42.0],
  [35.2, 42.0], // Sinope
  [36.3, 41.3], // Amisos
  [38.4, 40.9],
  [39.7, 41.0], // Trapezunt
  [41.6, 41.5], // Kolchis
];

/** Schwarzes Meer, Nord- und Ostufer: Kolchis → Krim → Donaudelta. */
const SCHWARZMEER_NORD = [
  [41.6, 41.5],
  [41.0, 43.0],
  [39.7, 43.6],
  [37.8, 44.7],
  [36.6, 45.3], // Straße von Kertsch
  [35.4, 45.0],
  [34.2, 44.5], // Südküste der Krim
  [33.4, 44.6],
  [33.6, 45.3],
  [33.8, 46.0], // Landenge von Perekop
  [32.0, 46.3],
  [30.7, 46.5],
  [29.8, 45.4], // Donaudelta
];

/** Schwarzes Meer, Westufer: Donaudelta → Bosporus. */
const SCHWARZMEER_WEST = [
  [29.8, 45.4],
  [28.6, 44.2],
  [27.9, 43.2],
  [27.5, 42.4],
  [28.0, 41.6],
  [29.1, 41.2],
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
  [-5.5, 57.6],
  [-5.0, 58.6], // Cape Wrath, über dem Bildrand
  [-3.0, 58.6],
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
  [-0.1, 54.1],
  [0.1, 53.6], // Humber
  [0.3, 52.9], // The Wash
  [1.7, 52.8], // Norfolk
  [1.0, 51.6], // Themsemündung
  [1.4, 51.1], // Dover
  [0.2, 50.7],
  [-1.1, 50.8],
  [-2.4, 50.6],
  [-3.5, 50.4],
  [-4.2, 50.3],
  [-5.7, 50.1],
];

// ---------------------------------------------------------------------------
// Inseln und Binnenmeere
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

const ZYPERN = [
  [32.3, 35.1],
  [33.0, 35.4],
  [34.0, 35.6],
  [34.6, 35.7],
  [33.9, 35.1],
  [33.6, 34.7],
  [32.9, 34.7],
];

const MALLORCA = [
  [2.4, 39.6],
  [3.0, 39.9],
  [3.45, 39.75],
  [3.3, 39.4],
  [2.8, 39.3],
];

/** Skandinavien am oberen Bildrand — Roms Welt endete lange davor. */
const SKANDINAVIEN = [
  [11.2, 62.0],
  [11.5, 57.3],
  [12.9, 56.2],
  [14.3, 55.4],
  [16.0, 56.2],
  [16.8, 57.5],
  [17.5, 62.0],
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

/** Rotes Meer mit der Halbinsel Sinai zwischen seinen beiden Golfen. */
const ROTES_MEER = [
  [32.6, 30.0], // Golf von Suez, Nordende
  [33.2, 28.6],
  [33.8, 27.2],
  [34.3, 26.1],
  [35.5, 23.9], // Berenike
  [36.8, 21.0], // unter dem Bildrand
  [39.5, 21.0],
  [38.1, 24.1],
  [36.3, 26.5],
  [35.7, 27.4],
  [35.0, 28.6],
  [34.9, 29.5], // Golf von Aqaba, Nordende
  [34.5, 28.5],
  [34.3, 27.8], // Südspitze des Sinai
  [33.5, 28.7],
  [32.9, 29.5],
];

/** Das Kaspische Meer reicht nur mit seinem Westufer ins Bild. */
const KASPISCHES_MEER = [
  [52.0, 47.0],
  [48.0, 46.5],
  [47.5, 44.5],
  [47.5, 43.0],
  [48.3, 42.1],
  [50.0, 40.4],
  [52.0, 39.5],
];

// ---------------------------------------------------------------------------
// Flüsse — sie ordnen die Landschaft und sind zugleich Reichsgrenzen
// ---------------------------------------------------------------------------

const NIL = [
  [31.3, 20.5],
  [32.9, 24.1], // Syene (Assuan), der erste Katarakt
  [32.6, 25.7], // Theben
  [31.7, 26.9],
  [30.8, 28.1],
  [31.2, 29.9], // dort, wo später Kairo liegt
  [30.9, 30.8],
];

const DONAU = [
  [8.2, 48.1],
  [10.0, 48.4],
  [12.1, 49.0], // Castra Regina (Regensburg)
  [13.8, 48.6],
  [16.4, 48.2], // Vindobona (Wien)
  [19.0, 47.5], // Aquincum (Budapest)
  [19.6, 46.0],
  [20.5, 44.8], // Singidunum (Belgrad)
  [22.5, 44.6], // Eisernes Tor
  [24.0, 43.8],
  [26.0, 44.0],
  [27.9, 44.5],
  [29.7, 45.2], // Donaudelta
];

const RHEIN = [
  [9.5, 46.6],
  [9.5, 47.5],
  [8.6, 47.6],
  [7.6, 47.6], // Basel
  [7.8, 48.6], // Argentoratum (Straßburg)
  [8.3, 50.0], // Mogontiacum (Mainz)
  [7.6, 50.4],
  [6.9, 50.9], // Colonia (Köln)
  [6.2, 51.8],
  [4.5, 51.9],
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

const EUPHRAT = [
  [39.0, 38.7],
  [38.2, 36.7],
  [39.0, 35.9],
  [40.4, 35.0],
  [41.0, 34.4],
  [42.4, 33.6],
  [44.0, 33.1], // Babylon
  [45.5, 32.0],
  [47.5, 31.0],
];

const TIGRIS = [
  [41.0, 37.9],
  [42.9, 36.9],
  [43.5, 35.4],
  [44.4, 33.3], // Ktesiphon
  [46.0, 32.0],
  [47.5, 31.0],
];

// ---------------------------------------------------------------------------
// Die Landmasse
// ---------------------------------------------------------------------------

/**
 * Europa, Kleinasien und Afrika hängen zusammen — von Skandinavien bis zur
 * Sahara, von Marokko bis Mesopotamien. Deshalb ist es ein einziger Umriss.
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
  LEVANTE,
  AEGYPTEN_KUESTE,
  NORDAFRIKA,
  MAROKKO_ATLANTIK,
  // Rückweg außerhalb des Bildes: Sahara, Arabien, die Steppe im Norden.
  [
    [-16, 26],
    [-16, 18],
    [52, 18],
    [52, 62],
    [24.8, 62],
  ],
);

// ---------------------------------------------------------------------------
// Die Phasen — dieselbe Karte, vier Zeitpunkte
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

/**
 * Die Nordgrenze des Reiches auf ihrem Höhepunkt: von der Donaumündung
 * flussaufwärts bis Regensburg, dann quer über den obergermanisch-rätischen
 * Limes nach Mainz und den Rhein hinunter zur Nordsee. Die Ecke zwischen
 * Rhein und Donau ist die auffälligste Linie der ganzen Karte.
 */
const LIMES_DONAU_RHEIN = [
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
  [12.1, 49.0], // hier verlässt die Grenze die Donau
  [11.2, 49.3],
  [10.2, 49.1],
  [9.0, 49.3],
  [8.3, 50.0], // und trifft bei Mainz auf den Rhein
  [7.6, 50.4],
  [6.9, 50.9],
  [6.2, 51.8],
  [4.5, 51.9],
];

/** 264 v. Chr.: die Halbinsel bis zum Rubikon — mehr nicht. */
const ITALIEN_264 = verbinde(ITALIEN_TYRRHENISCH, ITALIEN_ADRIA);

/** 146 v. Chr.: Italien einschließlich der Poebene. */
const ITALIEN_146 = verbinde(
  ITALIEN_LIGURIEN,
  ITALIEN_TYRRHENISCH,
  ITALIEN_ADRIA,
  ITALIEN_PO,
  ALPENBOGEN,
);

/** 146 v. Chr.: die beiden hispanischen Provinzen — Küste und Süden. */
const HISPANIEN_146 = verbinde(
  [[-6.3, 36.6]],
  HISPANIEN_MITTELMEER.slice(),
  [
    [1.0, 42.3],
    [-1.0, 42.2],
    [-2.5, 41.5],
    [-3.5, 40.0],
    [-5.0, 39.0],
    [-6.3, 38.2],
    [-6.9, 37.4],
  ],
);

/** 146 v. Chr.: die Provinz Africa auf dem Boden Karthagos. */
const AFRICA_146 = [
  [8.6, 36.9],
  [9.8, 37.3],
  [10.3, 37.0],
  [11.1, 36.8],
  [10.5, 35.6],
  [10.8, 34.7],
  [10.0, 34.9],
  [9.3, 35.5],
  [8.7, 36.2],
];

/** 146 v. Chr.: Makedonien und Griechenland. */
const GRIECHENLAND_146 = verbinde(
  [[19.4, 41.3]],
  BALKAN_ADRIA_SUED.slice(2),
  GRIECHENLAND,
  [
    [25.0, 41.5],
    [23.0, 41.9],
    [21.0, 42.2],
    [19.8, 42.0],
  ],
);

/**
 * 117 n. Chr.: der zusammenhängende europäische Block. Von Gibraltar am
 * Mittelmeer entlang bis ans Schwarze Meer, an der Donau und am Rhein zurück
 * und über die Atlantikküste wieder nach Süden.
 */
const EUROPA_117 = verbinde(
  HISPANIEN_MITTELMEER,
  GALLIEN_MITTELMEER,
  ITALIEN_LIGURIEN,
  ITALIEN_TYRRHENISCH,
  ITALIEN_ADRIA,
  ITALIEN_PO,
  BALKAN_ADRIA_NORD,
  BALKAN_ADRIA_SUED,
  GRIECHENLAND,
  [
    [26.7, 40.6],
    [28.0, 41.0],
  ],
  rueckwaerts(SCHWARZMEER_WEST),
  LIMES_DONAU_RHEIN,
  rueckwaerts(NORDSEE).slice(0, 4),
  GALLIEN_ATLANTIK,
  HISPANIEN_NORD,
  HISPANIEN_ATLANTIK,
);

/** 117 n. Chr.: Britannien südlich des Hadrianswalls. */
const BRITANNIEN_117 = verbinde(BRITANNIEN_OST, BRITANNIEN_WEST);

/**
 * 117 n. Chr.: der afrikanische Streifen von Marokko bis an den ersten
 * Nilkatarakt. Im Süden endet das Reich dort, wo die Wüste beginnt.
 */
const AFRIKA_117 = verbinde(
  [[-6.9, 34.0], [-6.3, 35.2]],
  rueckwaerts(NORDAFRIKA),
  rueckwaerts(AEGYPTEN_KUESTE),
  [
    [32.6, 30.0],
    [33.2, 28.6],
    [33.8, 27.2],
    [34.3, 26.1],
    [35.5, 23.9], // Berenike am Roten Meer
    [32.9, 24.1], // Syene, der erste Katarakt
    [29.0, 25.5],
    [25.5, 27.5],
    [24.0, 29.5],
    [21.5, 30.0],
    [18.5, 29.8],
    [15.5, 30.5],
    [11.5, 31.8],
    [9.5, 32.6],
    [8.0, 34.3],
    [6.5, 34.9],
    [3.5, 35.3],
    [0.5, 34.8],
    [-2.0, 34.5],
    [-4.5, 34.3],
    [-5.8, 34.4],
  ],
);

/** 117 n. Chr.: Kleinasien, Syrien und die Levante bis zum Roten Meer. */
const KLEINASIEN_117 = verbinde(
  ANATOLIEN_AEGAEIS,
  LEVANTE,
  [
    [33.5, 30.8],
    [34.5, 30.3],
    [35.5, 30.5],
    [36.5, 31.5],
    [37.5, 32.5],
    [38.5, 33.5],
    [39.5, 34.5],
    [40.5, 36.0],
    [41.0, 37.5],
    [40.0, 39.0],
    [41.5, 40.0],
  ],
  rueckwaerts(SCHWARZMEER_SUED),
  [
    [29.9, 40.7],
    [29.3, 40.4],
    [27.5, 40.5],
    [26.4, 40.4],
    [26.2, 40.1],
  ],
);

/** 117 n. Chr.: Trajans letzte Eroberung — nur ein Jahr lang gehalten. */
const MESOPOTAMIEN_117 = [
  [39.5, 38.0],
  [41.5, 40.0],
  [44.0, 40.5],
  [46.0, 39.5],
  [46.5, 37.5],
  [45.5, 35.0],
  [47.5, 31.2],
  [45.5, 30.8],
  [43.0, 32.5],
  [40.5, 34.0],
  [39.5, 35.0],
  [38.7, 36.5],
];

/** 117 n. Chr.: Dakien, nördlich der Donau. */
const DAKIEN_117 = [
  [21.0, 45.5],
  [22.5, 47.8],
  [25.5, 47.8],
  [26.8, 46.5],
  [27.5, 45.3],
  [25.0, 44.2],
  [22.7, 44.6],
  [21.5, 44.7],
];

/** 476 n. Chr.: vom Westreich ist Italien geblieben. */
const WESTREICH_476 = ITALIEN_146;

/**
 * 476 n. Chr.: das Ostreich — vom Donaudelta über den Balkan, Kleinasien
 * und die Levante bis nach Ägypten und in die Kyrenaika. Es bestand noch
 * fast tausend Jahre weiter.
 */
const OSTREICH_476 = verbinde(
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
  LEVANTE,
  AEGYPTEN_KUESTE,
  [
    [23.9, 32.1],
    [22.6, 32.8],
    [20.5, 32.5],
    [20.1, 32.1], // Kyrenaika
    [20.5, 31.0],
    [21.5, 30.0],
    [24.0, 29.5],
    [25.5, 27.5],
    [29.0, 25.5],
    [32.9, 24.1], // Syene
    [35.5, 23.9],
    [34.3, 26.1],
    [33.8, 27.2],
    [33.2, 28.6],
    [32.6, 30.0],
    [34.0, 30.5],
    [35.0, 30.2],
    [37.0, 31.2],
    [39.0, 32.8],
    [41.0, 34.2],
    [40.0, 35.5],
    [38.5, 36.6],
    [40.0, 38.2],
    [41.0, 39.8],
    [41.6, 41.5],
  ],
  rueckwaerts(SCHWARZMEER_SUED),
  SCHWARZMEER_WEST.slice().reverse(),
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
    land(SKANDINAVIEN),
    land(verbinde(BRITANNIEN_WEST, BRITANNIEN_NORD, BRITANNIEN_OST)),
    land(IRLAND),
    land(SIZILIEN),
    land(SARDINIEN),
    land(KORSIKA),
    land(KRETA),
    land(ZYPERN),
    land(MALLORCA),
    wasser(SCHWARZMEER_SUED.concat(SCHWARZMEER_NORD, SCHWARZMEER_WEST)),
    wasser(MARMARAMEER),
    wasser(ROTES_MEER),
    wasser(KASPISCHES_MEER),
    fluss(NIL),
    fluss(DONAU),
    fluss(RHEIN),
    fluss(RHONE),
    fluss(PO),
    fluss(EBRO),
    fluss(EUPHRAT),
    fluss(TIGRIS),
  ],

  phasen: [
    {
      id: 'republik-anfang',
      label: '264 v. Chr.',
      hinweis:
        'Vor dem ersten Krieg gegen Karthago: Rom beherrscht die Halbinsel bis zum Rubikon — kein Fußbreit außerhalb Italiens. Sizilien, Sardinien und Korsika kommen erst mit dem Sieg über Karthago dazu (241 und 238 v. Chr.).',
      flaechen: [gebiet('Italien bis zum Rubikon', ITALIEN_264)],
    },
    {
      id: 'mittelmeer',
      label: '146 v. Chr.',
      hinweis:
        'Karthago ist zerstört, Korinth ebenso. Rom hält beide Ufer des westlichen Mittelmeers, dazu Griechenland und die Küsten Hispaniens — aus dem Meer wird das „mare nostrum", unser Meer.',
      flaechen: [
        gebiet('Italien mit der Poebene', ITALIEN_146),
        gebiet('Sizilien — die erste Provinz', SIZILIEN),
        gebiet('Sardinien', SARDINIEN),
        gebiet('Korsika', KORSIKA),
        gebiet('Die hispanischen Provinzen', HISPANIEN_146),
        gebiet('Africa — das Gebiet Karthagos', AFRICA_146),
        gebiet('Makedonien und Griechenland', GRIECHENLAND_146),
      ],
    },
    {
      id: 'hoehepunkt',
      label: '117 n. Chr.',
      hinweis:
        'Die größte Ausdehnung, unter Kaiser Trajan: von Britannien bis Ägypten, vom Atlantik bis an den Persischen Golf. Im Norden hält eine einzige Linie das Reich zusammen — Rhein, Limes, Donau.',
      flaechen: [
        gebiet('Der europäische Block', EUROPA_117),
        gebiet('Britannien bis zum Hadrianswall', BRITANNIEN_117),
        gebiet('Nordafrika und Ägypten', AFRIKA_117),
        gebiet('Kleinasien, Syrien und Arabien', KLEINASIEN_117),
        gebiet('Mesopotamien und Armenien', MESOPOTAMIEN_117),
        gebiet('Dakien', DAKIEN_117),
      ],
    },
    {
      id: 'ende-westrom',
      label: '476 n. Chr.',
      hinweis:
        'Im Westen ist von einem Weltreich Italien übrig; Britannien, Gallien, Hispanien und Africa sind an neue Herrscher gefallen. Der Osten dagegen steht — und wird noch fast tausend Jahre stehen. „Untergang" ist deshalb schon eine Deutung.',
      flaechen: [
        gebiet('Was vom Westreich blieb', WESTREICH_476),
        gebiet('Das Oströmische Reich — es bestand weiter', OSTREICH_476),
      ],
    },
  ],

  punkte: [
    {
      id: 'rom',
      name: 'Rom',
      typ: 'stadt',
      ...(([x, y]) => ({ x, y }))(p(12.5, 41.9)),
      text: [
        'Angefangen hat alles hier: ein paar Hügel an einer Furt durch den Tiber.',
        'Von diesem Punkt aus wurde ein Gebiet regiert, das von Schottland bis',
        'zur Sahara reichte. Ein Befehl aus Rom brauchte bis an den Rand des',
        'Reiches mehrere Wochen — und trotzdem hat es über Jahrhunderte',
        'funktioniert.',
      ].join(' '),
    },
    {
      id: 'karthago',
      name: 'Karthago',
      typ: 'stadt',
      ...(([x, y]) => ({ x, y }))(p(10.3, 36.9)),
      text: [
        'Roms großer Gegner — eine Handelsmacht mit einer Flotte, die das',
        'westliche Mittelmeer beherrschte. Drei Kriege lang ging es hin und her;',
        'Hannibal führte sogar Kriegselefanten über die Alpen und schlug die',
        'Römer mehrfach vernichtend. Rom verlor Schlacht um Schlacht und gewann',
        'trotzdem den Krieg, weil es Verluste ersetzen konnte. 146 v. Chr. wurde',
        'Karthago zerstört.',
      ].join(' '),
    },
    {
      id: 'limes',
      name: 'Limes',
      typ: 'grenze',
      ...(([x, y]) => ({ x, y }))(p(10.5, 48.7)),
      text: [
        'Zwischen Rhein und Donau lief die Grenze quer durchs Land: Wall, Graben,',
        'Palisade, Wachtürme in Sichtweite zueinander — über 500 Kilometer.',
        'Der Limes war keine Mauer gegen Angreifer, dafür war er viel zu dünn',
        'besetzt. Er war eine kontrollierte Schwelle: Wer hindurchwollte, tat es',
        'an einem Übergang, unter Aufsicht und gegen Zoll.',
      ].join(' '),
    },
    {
      id: 'teutoburger-wald',
      name: 'Teutoburger Wald',
      typ: 'ereignis',
      ...(([x, y]) => ({ x, y }))(p(8.1, 52.1)),
      text: [
        '9 n. Chr. verlor der Feldherr Varus hier drei Legionen — rund 15 000',
        'Mann — an ein Bündnis germanischer Stämme unter Arminius, der selbst in',
        'römischen Diensten gestanden hatte. Rom hat sich danach nie wieder',
        'dauerhaft östlich des Rheins festgesetzt. Eine einzige Niederlage hat',
        'die Grenze Europas für Jahrhunderte festgelegt.',
      ].join(' '),
    },
    {
      id: 'alexandria',
      name: 'Alexandria',
      typ: 'stadt',
      ...(([x, y]) => ({ x, y }))(p(29.9, 31.2)),
      text: [
        'Die zweitgrößte Stadt des Reiches und sein Gelehrtenzentrum: Bibliothek,',
        'Leuchtturm, Hafen. Vor allem aber lag hier das Getreide. Ägypten',
        'ernährte Rom — die Kornflotte fuhr jedes Jahr über das Meer, und wenn',
        'sie ausblieb, wurde es in der Hauptstadt gefährlich. Wer Ägypten hielt,',
        'hatte Rom am Hebel.',
      ].join(' '),
    },
    {
      id: 'konstantinopel',
      name: 'Konstantinopel',
      typ: 'stadt',
      ...(([x, y]) => ({ x, y }))(p(29.0, 41.0)),
      text: [
        '330 n. Chr. gründete Kaiser Konstantin am Bosporus eine zweite',
        'Hauptstadt — an der Nahtstelle zwischen Europa und Asien, leicht zu',
        'verteidigen, am Handelsweg. Als 476 der letzte Kaiser des Westens',
        'abgesetzt wurde, regierte man hier einfach weiter, bis 1453. Die',
        'Bewohner nannten sich selbstverständlich weiterhin Römer.',
      ].join(' '),
    },
  ],

  bewegungen: [
    {
      id: 'hunnen',
      name: 'Hunnen',
      ...(([von, nach]) => ({ von, nach }))([p(46.5, 49.5), p(19.5, 47.0)]),
      ueber: [p(40.0, 48.5), p(33.0, 47.5), p(26.0, 47.0)],
      text: [
        'Aus den Steppen östlich der Wolga kommen ab etwa 375 n. Chr. berittene',
        'Verbände nach Westen, die die Römer „Hunnen" nennen. Sie erobern nicht',
        'das Reich — sie schieben andere hinein. Wer vor ihnen flieht, steht',
        'irgendwann an der Donau und bittet um Aufnahme. Unter Attila reicht ihre',
        'Macht bis nach Gallien, zerfällt nach seinem Tod 453 aber schnell wieder.',
      ].join(' '),
    },
    {
      id: 'westgoten',
      name: 'Westgoten',
      ...(([von, nach]) => ({ von, nach }))([p(28.0, 45.5), p(-3.5, 41.5)]),
      ueber: [p(23.0, 42.0), p(20.0, 39.5), p(15.5, 40.5), p(12.5, 42.0), p(4.0, 44.0)],
      text: [
        '376 n. Chr. lässt Rom Zehntausende Goten über die Donau — Flüchtende vor',
        'den Hunnen. Aus Hunger und schlechter Behandlung wird Aufstand: 378 fällt',
        'bei Adrianopel ein römisches Heer samt Kaiser. 410 plündern die Westgoten',
        'unter Alarich Rom selbst. Am Ende siedeln sie in Südgallien und Hispanien',
        'und gründen dort ein eigenes Königreich.',
      ].join(' '),
    },
    {
      id: 'vandalen',
      name: 'Vandalen',
      ...(([von, nach]) => ({ von, nach }))([p(13.0, 53.5), p(10.0, 36.9)]),
      ueber: [p(8.5, 50.5), p(2.0, 46.0), p(-3.0, 40.0), p(-5.6, 36.2), p(2.0, 35.5)],
      text: [
        'Silvester 406 überquerten germanische Verbände den zugefrorenen Rhein.',
        'Die Vandalen zogen durch Gallien nach Hispanien und 429 über die Meerenge',
        'von Gibraltar nach Afrika — dorthin, wo Roms Getreide wuchs. 439 nahmen',
        'sie Karthago. Von dort aus plünderten sie 455 Rom. Ohne Africa und ohne',
        'dessen Steuern war das Westreich kaum noch zu halten.',
      ].join(' '),
    },
  ],

  beschriftungen: [
    { text: 'Britannien', art: 'land', ...(([x, y]) => ({ x, y }))(p(-2.4, 53.6)) },
    { text: 'Gallien', art: 'land', ...(([x, y]) => ({ x, y }))(p(2.5, 46.8)) },
    { text: 'Germanien', art: 'land', ...(([x, y]) => ({ x, y }))(p(11.0, 52.2)) },
    { text: 'Hispanien', art: 'land', ...(([x, y]) => ({ x, y }))(p(-4.6, 40.2)) },
    { text: 'Italien', art: 'land', drehung: 52, ...(([x, y]) => ({ x, y }))(p(13.2, 42.6)) },
    { text: 'Griechenland', art: 'land', ...(([x, y]) => ({ x, y }))(p(22.4, 40.4)) },
    { text: 'Kleinasien', art: 'land', ...(([x, y]) => ({ x, y }))(p(33.0, 39.2)) },
    { text: 'Ägypten', art: 'land', ...(([x, y]) => ({ x, y }))(p(30.5, 26.5)) },
    { text: 'Nordafrika', art: 'land', ...(([x, y]) => ({ x, y }))(p(4.0, 32.2)) },
    { text: 'Mesopotamien', art: 'land', ...(([x, y]) => ({ x, y }))(p(42.5, 34.0)) },
    { text: 'Mittelmeer', art: 'meer', ...(([x, y]) => ({ x, y }))(p(15.0, 34.6)) },
    { text: 'Schwarzes Meer', art: 'meer', ...(([x, y]) => ({ x, y }))(p(34.5, 43.6)) },
    { text: 'Nordsee', art: 'meer', ...(([x, y]) => ({ x, y }))(p(3.0, 55.6)) },
  ],
};

module.exports = karte;
