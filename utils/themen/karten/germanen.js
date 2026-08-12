// Die Karte zum Thema „Germanen und Völkerwanderung" — Geschichte in Bewegung.
//
// Die Küstenlinien stehen hier als echte Längen-/Breitengrade `[lon, lat]`
// und werden von utils/karte-geo.js in SVG-Koordinaten umgerechnet. Wer einen
// Punkt anzweifelt, schlägt ihn im Atlas nach: `[12.5, 41.9]` ist Rom,
// `[18.7, 54.6]` die Weichselmündung bei Danzig, `[26.55, 41.68]` Adrianopel.
//
// Diese Karte hat eine Aufgabe, die keine der bisherigen hatte: Sie muss
// Bewegung zeigen, die keinem Reich gehört. Bei Rom, China und den Mongolen
// wuchs eine Fläche; hier zerfällt eine — und was an ihre Stelle tritt, kommt
// von außerhalb des Bildes und ist jahrzehntelang unterwegs. Deshalb liegt
// das Gewicht auf den Wanderungsrouten und auf dem Vergleich der Phasen:
// dieselbe Landkarte, fünfmal, und aus einem einzigen Reich werden sechs.
//
// Eine Festlegung, die ausdrücklich hierher gehört: Germanien ist in der
// ersten Phase KEINE Fläche. Das ist kein Versehen. Eine Fläche behauptet
// eine Herrschaft mit Grenzen, und genau die gab es dort nicht — es gab
// Stämme, Bündnisse und Versammlungen. Die Karte hätte sonst eine Ordnung
// erfunden, um die leere Stelle zu füllen.
//
// Reine Daten und Rechnung — keine UI-Importe (Architektur-Regel).

const { KARTENFARBEN, erstelleProjektion, rueckwaerts, verbinde } = require('../../karte-geo');

// ---------------------------------------------------------------------------
// Ausschnitt und Projektion
// ---------------------------------------------------------------------------

/**
 * Der Kartenausschnitt: vom Atlantik (10° W) bis zur Wolgasteppe (45° O), von
 * Nordafrika (32° N) bis zur Ostsee (58° N).
 *
 * Die Ostgrenze ist der Grund für den Zuschnitt: Von dort kommen die Hunnen,
 * und die Goten sitzen mit ihrem Weg von der Weichsel zum Schwarzen Meer
 * mitten im Bild. Ein Ausschnitt, der nur das Römische Reich zeigt, würde die
 * Völkerwanderung genau dort abschneiden, wo sie anfängt.
 */
const RAHMEN = { minLon: -10, maxLon: 45, minLat: 32, maxLat: 58, breite: 700 };

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

/** Ostsee: Estland → Weichselmündung → Jütland → Elbmündung. */
const OSTSEE = [
  [26.5, 59.6], // Estland, über dem Bildrand
  [24.6, 58.6],
  [24.4, 57.6],
  [24.0, 57.0], // Riga
  [21.1, 56.1],
  [19.6, 54.7],
  [18.7, 54.6], // Weichselmündung bei Danzig
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
  [-2.2, 47.3], // Loiremündung
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
 * Kleinasien von den Dardanellen bis zum Golf von Issos. Die Meerenge ist in
 * diesem Maßstab dünner als ein Strich — die Landmasse geht hier durch, das
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

/** Die Levante, soweit sie ins Bild reicht: Golf von Issos → Karmel. */
const LEVANTE_NORD = [
  [36.2, 36.6],
  [35.9, 35.9],
  [35.9, 35.4],
  [35.5, 35.0], // Laodikeia
  [35.6, 34.5],
  [35.2, 33.9], // Tripolis
  [35.5, 33.3], // Berytus
  [35.1, 33.1],
  [35.0, 32.5], // am Karmel, unterer Bildrand
];

/** Nordafrika: Kyrenaika → Karthago → Tingis (Tanger). */
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
  [-9.3, 31.5], // schon außerhalb des Bildes
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

/** Schwarzes Meer, Nordufer: Kolchis → Krim → Donaudelta. */
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

/**
 * Das Asowsche Meer — für dieses Kapitel kein Nebenschauplatz: An seinem
 * Ostufer mündet der Don, und aus der Steppe dahinter kamen 375 die Hunnen.
 */
const ASOWSCHES_MEER = [
  [36.5, 45.4], // Straße von Kertsch
  [37.9, 46.1],
  [38.3, 46.6],
  [39.3, 47.15], // Donmündung bei Tanais
  [38.2, 47.1],
  [37.0, 46.9],
  [35.8, 46.6],
  [34.9, 46.1],
  [35.2, 45.6], // Arabat-Nehrung
  [35.9, 45.4],
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

/**
 * Skandinavien am oberen Bildrand. Für dieses Kapitel ist es mehr als
 * Randverzierung: Von hier führen die Goten ihre eigene Herkunftserzählung
 * her (Jordanes nennt Skandinavien die „Fabrik der Völker"), und ob das
 * stimmt, ist bis heute offen.
 */
const SKANDINAVIEN = [
  [11.2, 62.0],
  [11.5, 57.3],
  [12.9, 56.2],
  [14.3, 55.4],
  [16.0, 56.2],
  [16.8, 57.5],
  [17.5, 62.0],
];

// ---------------------------------------------------------------------------
// Flüsse — sie ordnen die Landschaft, und drei von ihnen sind Grenzen
// ---------------------------------------------------------------------------

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

const ELBE = [
  [15.4, 50.8],
  [14.2, 50.6],
  [13.7, 51.05], // Dresden
  [12.4, 51.9],
  [11.6, 52.1], // Magdeburg
  [10.9, 53.0],
  [10.0, 53.5], // Hamburg
  [9.2, 53.85],
  [8.6, 53.9],
];

/** Die Weichsel — an ihrem Unterlauf beginnt der Weg der Goten. */
const WEICHSEL = [
  [18.9, 49.6],
  [19.9, 50.05], // Krakau
  [21.7, 50.8],
  [21.9, 51.4],
  [21.0, 52.25], // Warschau
  [19.5, 52.6],
  [18.6, 53.0],
  [18.8, 53.6],
  [18.95, 54.35],
];

const DNJEPR = [
  [32.0, 54.8],
  [30.4, 54.5],
  [30.3, 53.5],
  [30.5, 52.0],
  [30.5, 50.45], // Kiew
  [31.5, 49.4],
  [33.4, 49.05],
  [35.0, 48.45],
  [35.1, 47.8],
  [34.0, 47.2],
  [32.6, 46.6],
  [31.9, 46.5],
];

/** Der Don — die Grenze, hinter der für Rom die unbekannte Steppe begann. */
const DON = [
  [38.3, 54.0],
  [38.9, 52.6],
  [39.2, 51.7],
  [40.0, 50.3],
  [41.4, 49.6],
  [40.9, 48.3],
  [39.7, 47.5],
  [39.3, 47.15],
];

const LOIRE = [
  [4.2, 44.9],
  [3.9, 45.9],
  [2.6, 47.1],
  [1.9, 47.9], // Aurelianum (Orléans)
  [0.7, 47.4], // Caesarodunum (Tours)
  [-0.5, 47.3],
  [-1.55, 47.2], // Namnetes (Nantes)
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

// ---------------------------------------------------------------------------
// Die Landmassen
// ---------------------------------------------------------------------------

/**
 * Europa und Kleinasien als ein Umriss — von der Ostsee bis zur Levante. Die
 * Randpunkte liegen bewusst außerhalb des Ausschnitts: So läuft das Land über
 * den Bildrand hinaus, statt dort abzuknicken.
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
  LEVANTE_NORD,
  // Rückweg außerhalb des Bildes: Arabien, die Steppe, der hohe Norden.
  [
    [35.2, 31.0],
    [50, 30],
    [50, 64],
    [28.0, 64],
  ],
);

/**
 * Nordafrika ist auf dieser Karte eine eigene Landmasse: Der Landweg nach
 * Asien führt über den Sinai, und der liegt südlich des Bildrands. Für das
 * Kapitel ist das genau richtig — die Vandalen kamen nicht über Land, sondern
 * 429 mit Schiffen über die Meerenge von Gibraltar.
 */
const AFRIKA = verbinde(
  NORDAFRIKA,
  MAROKKO_ATLANTIK,
  [
    [-14, 24],
    [30, 24],
    [28, 29],
  ],
);

const BRITANNIEN = verbinde(BRITANNIEN_WEST, BRITANNIEN_NORD, BRITANNIEN_OST);

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

/**
 * Die Nordgrenze des Reiches: von der Donaumündung flussaufwärts bis
 * Regensburg, dann quer über den obergermanisch-rätischen Limes nach Mainz
 * und den Rhein hinunter zur Nordsee.
 *
 * Diese Linie ist die Hauptperson der ersten beiden Phasen. Rechts von ihr
 * beginnt das, was Rom „Germania magna" nannte — und was es nach 9 n. Chr.
 * nie wieder ernsthaft zu erobern versuchte.
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

/** Das Reich in Europa, an Rhein, Limes und Donau begrenzt. */
const REICH_EUROPA = verbinde(
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

/** Britannien südlich des Hadrianswalls — die Provinz. */
const REICH_BRITANNIEN = verbinde(BRITANNIEN_OST, BRITANNIEN_WEST);

/** Kleinasien und die Levante, soweit sie im Bild liegen. */
const REICH_KLEINASIEN = verbinde(
  ANATOLIEN_AEGAEIS,
  LEVANTE_NORD,
  [
    [37.0, 33.0],
    [39.5, 34.5],
    [41.0, 37.0],
    [40.0, 39.0],
    [41.5, 40.0],
    [41.6, 41.5],
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

/** Die afrikanischen Provinzen: von Mauretanien bis in die Kyrenaika. */
const REICH_AFRIKA = verbinde(
  rueckwaerts(NORDAFRIKA),
  [
    [24.5, 30.5],
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
    [-6.3, 35.2],
  ],
);

/**
 * Das gotische Siedlungsgebiet nördlich der unteren Donau (3./4. Jahrhundert).
 *
 * Die Grenzen sind bewusst weich gezogen: Was die Archäologie hier findet,
 * ist eine Kultur (Sîntana-de-Mureș/Tschernjachow), kein Staat mit Katasteramt.
 */
const GOTEN_375 = [
  [22.5, 45.0],
  [24.5, 47.5],
  [26.5, 48.5],
  [29.0, 49.0],
  [32.0, 49.5],
  [33.5, 48.0],
  [33.0, 46.6],
  [31.9, 46.5],
  [30.7, 46.5],
  [29.8, 45.4],
  [27.9, 44.5],
  [26.0, 44.0],
  [24.0, 43.8],
  [22.5, 44.6],
];

/** Woher der Druck kam: die Steppe östlich des Don, 375 in Bewegung. */
const HUNNEN_375 = [
  [38.5, 52.5],
  [46.0, 53.0],
  [46.0, 45.0],
  [40.5, 45.0],
  [38.7, 47.3],
  [37.5, 49.5],
];

/** Das Reich Attilas, um 450 — sein Mittelpunkt lag in der Theißebene. */
const HUNNEN_450 = [
  [16.0, 46.0],
  [16.5, 48.5],
  [19.0, 49.2],
  [22.5, 48.8],
  [25.5, 48.0],
  [27.5, 46.5],
  [25.5, 45.0],
  [22.0, 44.8],
  [19.5, 45.5],
  [17.5, 45.5],
];

/** Das Westgotenreich von Toulouse, seit 418 Verbündeter und Nachbar Roms. */
const WESTGOTEN_418 = [
  [-1.2, 44.6],
  [-1.1, 45.6],
  [-1.2, 46.3],
  [-0.3, 46.6],
  [0.9, 46.5],
  [1.6, 45.7],
  [2.2, 44.8],
  [2.6, 44.0],
  [2.0, 43.5],
  [1.0, 43.0],
  [0.0, 42.9],
  [-1.6, 43.4],
];

/** Das Vandalenreich in Nordafrika, seit 439 mit Karthago als Hauptstadt. */
const VANDALEN_439 = verbinde(NORDAFRIKA.slice(11, 27), [
  [0.5, 35.0],
  [3.0, 34.5],
  [6.0, 34.5],
  [8.0, 34.0],
  [9.5, 33.0],
  [11.0, 31.9],
  [12.5, 31.9],
]);

/** Was Westrom in seinen letzten Jahrzehnten noch wirklich hielt. */
const WESTROM_455 = verbinde(
  GALLIEN_MITTELMEER,
  ITALIEN_LIGURIEN,
  ITALIEN_TYRRHENISCH,
  ITALIEN_ADRIA,
  ITALIEN_PO,
  BALKAN_ADRIA_NORD,
  [
    [18.5, 43.3],
    [17.0, 44.5],
    [15.8, 45.6],
    [14.5, 46.4],
    [13.5, 46.6],
    [11.5, 47.2],
    [10.0, 47.4],
    [8.5, 47.6],
    [7.6, 47.6],
    [6.5, 47.0],
    [5.5, 46.5],
    [4.5, 45.5],
    [3.8, 44.5],
    [3.0, 43.6],
  ],
);

/** Das Oströmische Reich — es bestand weiter, als der Westen aufhörte. */
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
  LEVANTE_NORD,
  [
    [37.0, 33.0],
    [39.5, 34.5],
    [41.0, 37.0],
    [40.0, 39.0],
    [41.5, 40.0],
    [41.6, 41.5],
  ],
  rueckwaerts(SCHWARZMEER_SUED),
  rueckwaerts(SCHWARZMEER_WEST),
);

/** Die Iberische Halbinsel als Ganzes — ab 507 ganz westgotisch. */
const IBERIEN = verbinde(
  HISPANIEN_NORD,
  HISPANIEN_ATLANTIK,
  HISPANIEN_MITTELMEER,
  rueckwaerts(PYRENAEEN),
);

/** Um 500: das Westgotenreich zwischen Loire und Gibraltar. */
const WESTGOTEN_500 = verbinde(
  HISPANIEN_ATLANTIK,
  HISPANIEN_MITTELMEER,
  GALLIEN_MITTELMEER.slice(0, 3),
  [
    [4.7, 44.4],
    [3.5, 45.5],
    [2.5, 46.2],
    [2.0, 46.8],
    [1.9, 47.9],
  ],
  [
    [0.7, 47.4],
    [-1.55, 47.2],
    [-2.2, 47.3],
  ],
  GALLIEN_ATLANTIK.slice(8),
  HISPANIEN_NORD,
);

/** Um 500: das Frankenreich Chlodwigs, von der Nordsee bis an die Loire. */
const FRANKEN_500 = [
  [-2.2, 47.3],
  [-1.2, 46.3],
  [-0.3, 46.6],
  [0.9, 46.5],
  [1.9, 47.9],
  [2.5, 46.2],
  [3.5, 46.6],
  [4.8, 47.0],
  [5.8, 47.6],
  [6.5, 48.5],
  [7.5, 49.3],
  [8.3, 50.0],
  [7.6, 50.4],
  [6.9, 50.9],
  [6.2, 51.8],
  [4.1, 51.9],
  [3.5, 51.5],
  [2.6, 51.1],
  [1.6, 50.9],
  [0.2, 49.7],
  [-1.2, 49.4],
  [-1.9, 49.7],
  [-2.5, 48.6],
  [-2.5, 47.5],
];

/** Um 500: das Burgunderreich an Rhône und Saône. */
const BURGUNDER_500 = [
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

/** Um 500: das Ostgotenreich Theoderichs — Italien und Dalmatien. */
const OSTGOTEN_500 = verbinde(
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
  ],
  ALPENBOGEN,
);

/** Um 500: die angelsächsischen Reiche im Osten Britanniens. */
const ANGELSACHSEN_500 = [
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

/** 568: die angelsächsischen Reiche greifen nach Westen aus. */
const ANGELSACHSEN_568 = [
  [1.4, 51.1],
  [1.0, 51.6],
  [1.7, 52.8],
  [0.3, 52.9],
  [0.1, 53.6],
  [-0.1, 54.1],
  [-1.4, 55.0],
  [-2.5, 55.0],
  [-2.6, 54.0],
  [-2.8, 53.3],
  [-2.5, 52.5],
  [-2.7, 51.6],
  [-2.0, 51.0],
  [-1.5, 50.7],
  [0.2, 50.7],
];

/** 568: das Frankenreich reicht von der Bretagne bis über den Rhein. */
const FRANKEN_568 = verbinde(
  rueckwaerts(GALLIEN_ATLANTIK),
  [
    [2.6, 51.1],
    [3.5, 51.5],
    [4.1, 51.9],
    [6.0, 52.0],
    [8.0, 52.3],
    [10.5, 51.6],
    [12.0, 50.9],
    [12.5, 49.5],
    [13.5, 48.7],
    [13.0, 47.5],
    [11.5, 47.3],
    [10.0, 47.3],
    [8.5, 47.6],
    [7.5, 46.5],
    [7.0, 45.9],
    [6.8, 45.2],
    [6.5, 44.5],
    [6.0, 43.9],
    [5.4, 43.3],
    [4.8, 43.4],
    [4.0, 43.8],
    [3.0, 44.2],
    [2.0, 43.7],
    [1.0, 43.2],
    [0.0, 43.0],
  ],
);

/** 568: das Westgotenreich — ganz Spanien und Septimanien. */
const WESTGOTEN_568 = verbinde(
  HISPANIEN_NORD,
  HISPANIEN_ATLANTIK,
  HISPANIEN_MITTELMEER,
  [
    [3.0, 43.0],
    [4.3, 43.5],
    [3.6, 44.0],
    [2.6, 43.4],
    [1.7, 42.6],
    [0.7, 42.7],
    [-0.5, 42.8],
  ],
);

/** 568: die Langobarden nehmen Norditalien und die Mitte der Halbinsel. */
const LANGOBARDEN_568 = [
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
  [14.6, 41.9],
  [13.9, 41.5],
  [13.1, 41.3],
  [12.3, 41.7],
  [11.8, 42.1],
  [10.7, 42.4],
  [10.3, 43.7],
  [9.8, 44.1],
];

/** 568: was Ostrom in Italien hielt — Ravenna, die Küsten und der Süden. */
const OSTROM_ITALIEN_568 = [
  [12.3, 45.4],
  [12.3, 44.8],
  [12.6, 44.1],
  [13.5, 43.6],
  [13.5, 43.0],
  [14.2, 42.5],
  [14.9, 42.1],
  [15.9, 41.6],
  [16.9, 41.1],
  [17.9, 40.7],
  [18.5, 40.4],
  [18.4, 39.8],
  [17.2, 39.0],
  [16.6, 38.5],
  [15.6, 38.0],
  [15.9, 38.3],
  [16.1, 38.7],
  [15.8, 39.5],
  [15.3, 40.0],
  [14.9, 40.6],
  [14.0, 40.9],
  [13.6, 41.2],
  [14.0, 41.6],
  [14.7, 42.0],
  [14.2, 42.6],
  [13.4, 43.4],
  [12.6, 44.2],
  [12.1, 45.0],
];

/** 568: Nordafrika — 534 von Ostrom zurückerobert, das Vandalenreich ist aus. */
const OSTROM_AFRIKA_568 = verbinde(NORDAFRIKA.slice(0, 27), [
  [0.5, 35.0],
  [3.0, 34.5],
  [6.0, 34.5],
  [8.0, 34.0],
  [9.5, 33.0],
  [12.0, 31.5],
  [16.0, 30.5],
  [19.5, 30.2],
  [20.5, 31.0],
  [24.5, 30.6],
]);

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
 * Die Grenzlinie aus Rhein, Limes und Donau — als eigene, dunkle Linie über
 * dem Untergrund. Sie liegt auch dann im Bild, wenn gerade keine Phase sie
 * als Rand einer Fläche zeigt: Diese Linie ist das Thema des Kapitels.
 */
const limeslinie = () => ({
  art: 'mauer',
  d: geo.pfad(LIMES_DONAU_RHEIN, { geschlossen: false }),
  fill: 'none',
  stroke: KARTENFARBEN.mauer,
  strokeWidth: 2.6,
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
    land(SKANDINAVIEN),
    land(BRITANNIEN),
    land(IRLAND),
    land(SIZILIEN),
    land(SARDINIEN),
    land(KORSIKA),
    land(KRETA),
    land(ZYPERN),
    land(MALLORCA),
    wasser(SCHWARZMEER_SUED.concat(SCHWARZMEER_NORD, SCHWARZMEER_WEST)),
    wasser(ASOWSCHES_MEER),
    wasser(MARMARAMEER),
    fluss(RHEIN),
    fluss(DONAU),
    fluss(ELBE),
    fluss(WEICHSEL),
    fluss(DNJEPR),
    fluss(DON),
    fluss(LOIRE),
    fluss(RHONE),
    fluss(PO),
    fluss(EBRO),
    limeslinie(),
  ],

  phasen: [
    {
      id: 'zwei-welten',
      label: 'um 100 n. Chr.',
      hinweis:
        'Die dunkle Linie ist die Grenze: Rhein, Limes, Donau. Links davon liegt ein Reich mit Straßen, Steuern und Statthaltern. Rechts davon ist die Karte leer — nicht weil dort niemand lebte, sondern weil es dort kein Reich mit Grenzen gab. Rom nannte das Land „Germania magna" und seine Bewohner „Barbaren", ohne je genau zu wissen, wie weit es reicht.',
      flaechen: [
        gebiet('Das Römische Reich in Europa', REICH_EUROPA),
        gebiet('Britannien bis zum Hadrianswall', REICH_BRITANNIEN),
        gebiet('Kleinasien und Syrien', REICH_KLEINASIEN),
        gebiet('Die afrikanischen Provinzen', REICH_AFRIKA),
      ],
    },
    {
      id: 'hunnendruck',
      label: '375–378',
      hinweis:
        'Von Osten her setzt sich etwas in Bewegung. Die Hunnen überrennen die Goten am Schwarzen Meer; Zehntausende stehen 376 an der Donau und bitten um Aufnahme ins Reich. 378 fällt bei Adrianopel ein römisches Heer samt Kaiser. Die Grenze steht noch — aber sie hält nicht mehr, was sie verspricht.',
      flaechen: [
        gebiet('Das Römische Reich in Europa', REICH_EUROPA),
        gebiet('Britannien bis zum Hadrianswall', REICH_BRITANNIEN),
        gebiet('Kleinasien und Syrien', REICH_KLEINASIEN),
        gebiet('Die afrikanischen Provinzen', REICH_AFRIKA),
        gebiet('Das gotische Siedlungsgebiet nördlich der Donau', GOTEN_375),
        gebiet('Die Steppe der Hunnen — von hier kam der Druck', HUNNEN_375),
      ],
    },
    {
      id: 'sturm',
      label: '406–455',
      hinweis:
        'Silvester 406 gehen Vandalen, Alanen und Sueben über den Rhein; 410 plündern die Westgoten Rom, 439 nehmen die Vandalen Karthago und damit das Getreide, 455 wird Rom ein zweites Mal geplündert. Im Inneren des Reiches liegt jetzt das Reich Attilas. Vom Westen ist ein Rest übrig — der Osten steht unverändert da.',
      flaechen: [
        gebiet('Was Westrom noch hielt', WESTROM_455),
        gebiet('Das Oströmische Reich', OSTROM),
        gebiet('Britannien — von Rom 407 sich selbst überlassen', REICH_BRITANNIEN),
        gebiet('Das Westgotenreich von Toulouse (seit 418)', WESTGOTEN_418),
        gebiet('Das Vandalenreich in Nordafrika (seit 439)', VANDALEN_439),
        gebiet('Das Reich Attilas (um 450)', HUNNEN_450),
      ],
    },
    {
      id: 'koenigreiche',
      label: 'um 500',
      hinweis:
        'Vierundzwanzig Jahre nach der Absetzung des letzten weströmischen Kaisers gibt es im Westen kein Reich mehr, sondern sechs. Ihre Könige regieren mit römischen Beamten, lassen ihr Recht auf Latein aufschreiben und nennen sich nach römischem Vorbild. Theoderich in Ravenna führt sogar den Titel eines römischen Statthalters — und meint ihn ernst.',
      flaechen: [
        gebiet('Das Frankenreich Chlodwigs', FRANKEN_500),
        gebiet('Das Westgotenreich (Spanien und Aquitanien)', WESTGOTEN_500),
        gebiet('Das Burgunderreich an der Rhône', BURGUNDER_500),
        gebiet('Das Ostgotenreich Theoderichs (Italien und Dalmatien)', OSTGOTEN_500),
        gebiet('Das Vandalenreich in Nordafrika', VANDALEN_439),
        gebiet('Die angelsächsischen Reiche in Britannien', ANGELSACHSEN_500),
        gebiet('Das Oströmische Reich — es bestand weiter', OSTROM),
      ],
    },
    {
      id: 'langobarden',
      label: '568',
      hinweis:
        'Kaiser Justinian hat Nordafrika (534) und Italien (554) zurückerobert — und Italien dabei so verwüstet, dass es 568 den Langobarden kaum noch Widerstand entgegensetzt. Damit endet die Wanderung. Von den Reichen dieser Karte wird eines Europa prägen: das der Franken. Und eines steht schon fast tausend Jahre und wird noch fast tausend weitere stehen.',
      flaechen: [
        gebiet('Das Frankenreich', FRANKEN_568),
        gebiet('Das Westgotenreich (Spanien und Septimanien)', WESTGOTEN_568),
        gebiet('Die Langobarden in Italien (seit 568)', LANGOBARDEN_568),
        gebiet('Ravenna und der Süden — was Ostrom in Italien hielt', OSTROM_ITALIEN_568),
        gebiet('Sizilien — oströmisch geblieben', SIZILIEN),
        gebiet('Nordafrika — 534 von Ostrom zurückerobert', OSTROM_AFRIKA_568),
        gebiet('Die angelsächsischen Reiche in Britannien', ANGELSACHSEN_568),
        gebiet('Das Oströmische Reich', OSTROM),
      ],
    },
  ],

  punkte: [
    {
      id: 'teutoburger-wald',
      name: 'Teutoburger Wald',
      typ: 'ereignis',
      ...ort(8.1, 52.1),
      text: [
        '9 n. Chr. verlor der Statthalter Varus hier drei Legionen — rund 15 000',
        'Mann — an ein Bündnis germanischer Gruppen unter Arminius. Arminius war',
        'selbst in römischen Diensten gewesen, römischer Ritter, ausgebildet in',
        'römischer Kriegführung; er kannte den Gegner von innen. Rom hat sich',
        'danach nie wieder dauerhaft östlich des Rheins festgesetzt. Wer wissen',
        'will, wie viel eine einzige Niederlage bewirken kann: Die Grenze zwischen',
        'romanisch und germanisch geprägtem Europa verläuft bis heute ungefähr',
        'dort, wo Varus umkehren wollte und nicht mehr kam.',
      ].join(' '),
    },
    {
      id: 'limes',
      name: 'Limes',
      typ: 'grenze',
      ...ort(10.5, 48.7),
      text: [
        'Zwischen Rhein und Donau lief die Grenze quer durchs Land: Wall, Graben,',
        'Palisade, Wachtürme in Sichtweite — über 500 Kilometer. Der Limes war',
        'keine Mauer gegen Angreifer, dafür war er viel zu dünn besetzt. Er war',
        'eine kontrollierte Schwelle: Wer hindurchwollte, tat es an einem Übergang,',
        'unter Aufsicht und gegen Zoll. Und er war eine Naht, keine Wand — an ihr',
        'wurde gehandelt, geheiratet und angeworben. Viele der Männer, die später',
        'römische Heere führten, kamen von der anderen Seite dieser Linie.',
      ].join(' '),
    },
    {
      id: 'adrianopel',
      name: 'Adrianopel',
      typ: 'ereignis',
      ...ort(26.55, 41.68),
      text: [
        'Am 9. August 378 stellte Kaiser Valens die Goten hier zur Schlacht — ohne',
        'auf das Heer des Westens zu warten. Am Abend war das römische Feldheer',
        'des Ostens vernichtet und der Kaiser tot; seine Leiche wurde nie',
        'gefunden. Zwei Jahre zuvor hatte Rom dieselben Goten selbst über die',
        'Donau gelassen, als Flüchtende vor den Hunnen — und sie dann so schlecht',
        'versorgt, dass aus Hunger Aufstand wurde. Der Historiker Ammianus',
        'Marcellinus, selbst Offizier, nannte es die schwerste Niederlage seit',
        'Cannae.',
      ].join(' '),
    },
    {
      id: 'rom',
      name: 'Rom',
      typ: 'stadt',
      ...ort(12.5, 41.9),
      text: [
        'Am 24. August 410 nahmen die Westgoten unter Alarich die Stadt und',
        'plünderten sie drei Tage lang. Militärisch war das fast bedeutungslos —',
        'Rom war seit über hundert Jahren nicht mehr Hauptstadt, der Kaiser saß in',
        'Ravenna. Seelisch war es ein Schock ohne Beispiel: Achthundert Jahre lang',
        'hatte kein Feind diese Stadt betreten. Hieronymus schrieb in Bethlehem,',
        'ihm sei die Stimme im Halse steckengeblieben. Augustinus schrieb daraufhin',
        'sein größtes Buch, „Vom Gottesstaat" — die Antwort auf die Frage, wie ein',
        'ewiges Reich fallen kann. 455 kamen die Vandalen und plünderten erneut.',
      ].join(' '),
    },
    {
      id: 'ravenna',
      name: 'Ravenna',
      typ: 'stadt',
      ...ort(12.2, 44.42),
      text: [
        'Seit 402 die Hauptstadt des Westens: von Sümpfen geschützt, mit einem',
        'Hafen, über den man notfalls fliehen konnte. Hier setzte der Offizier',
        'Odoaker 476 den letzten weströmischen Kaiser ab — einen Jungen mit dem',
        'unpassend großen Namen Romulus Augustulus. Odoaker rief sich nicht zum',
        'Kaiser aus; er schickte die Insignien nach Konstantinopel und ließ sich',
        'König nennen. Für die Zeitgenossen war das keine Zeitenwende, sondern',
        'eine Verwaltungsänderung. Später residierte hier Theoderich der Ostgote —',
        'seine Grabstätte und die Mosaiken seiner Kirchen stehen bis heute.',
      ].join(' '),
    },
    {
      id: 'karthago',
      name: 'Karthago',
      typ: 'stadt',
      ...ort(10.3, 36.85),
      text: [
        '439 nahmen die Vandalen unter Geiserich die Stadt — ohne Belagerung, in',
        'einem Handstreich. Das war der schwerste Verlust des Westreichs, und zwar',
        'nicht wegen der Stadt: Hier lag das Getreide, das Rom ernährte, und hier',
        'kamen die Steuern her, aus denen Heere bezahlt wurden. Von Karthago aus',
        'segelten die Vandalen 455 nach Rom und plünderten es. Ihr Name lebt in',
        'einem Wort weiter, das erst 1794 erfunden wurde — „Vandalismus" —, und',
        'die Forschung ist sich einig, dass es ihnen unrecht tut: Die Plünderung',
        'von 455 war nach den Maßstäben der Zeit vergleichsweise geordnet.',
      ].join(' '),
    },
  ],

  bewegungen: [
    {
      id: 'hunnen',
      name: 'Hunnen',
      ...(() => {
        const [von, nach] = [p(44.0, 49.5), p(21.0, 47.0)];
        return { von, nach };
      })(),
      ueber: [p(40.0, 49.2), p(36.0, 48.8), p(32.0, 48.2), p(27.0, 47.4)],
      text: [
        'Um 375 erscheinen östlich des Don berittene Verbände, die die Römer',
        '„Hunnen" nennen. Woher genau sie kamen, ist bis heute umstritten. Sie',
        'erobern das Reich nicht — sie schieben andere hinein: Wer vor ihnen',
        'flieht, steht irgendwann an der Donau und bittet um Aufnahme. Unter',
        'Attila (434–453) liegt ihr Machtzentrum in der ungarischen Tiefebene, und',
        'ihre Züge reichen bis nach Gallien. Nach Attilas Tod zerfällt das Reich',
        'binnen weniger Jahre. Die Völkerwanderung beginnt also nicht mit einem',
        'Angriff auf Rom, sondern mit einer Flucht.',
      ].join(' '),
    },
    {
      id: 'goten',
      name: 'Goten',
      ...(() => {
        const [von, nach] = [p(19.0, 54.2), p(26.5, 42.0)];
        return { von, nach };
      })(),
      ueber: [p(21.5, 51.5), p(25.0, 49.5), p(29.0, 47.8), p(30.8, 46.6), p(28.5, 44.6)],
      text: [
        'Die Goten erzählen von sich selbst, sie seien aus Skandinavien gekommen —',
        'aufgeschrieben hat das im 6. Jahrhundert Jordanes, gut fünfhundert Jahre',
        'nach dem angeblichen Aufbruch. Nachweisbar ist der Weg von der unteren',
        'Weichsel zum Schwarzen Meer im 2. und 3. Jahrhundert. Dort saßen sie',
        'über hundert Jahre, handelten mit dem Reich und übernahmen viel von ihm:',
        'Der Bischof Wulfila übersetzte für sie die Bibel und erfand dafür eine',
        'eigene Schrift. 376 kamen die Hunnen — und dieselben Goten standen an der',
        'Donau und baten um Einlass. Zwei Jahre später schlugen sie bei Adrianopel',
        'ein Kaiserheer.',
      ].join(' '),
    },
    {
      id: 'westgoten',
      name: 'Westgoten',
      ...(() => {
        const [von, nach] = [p(26.5, 42.0), p(-3.7, 39.9)];
        return { von, nach };
      })(),
      ueber: [p(22.0, 41.6), p(19.5, 42.4), p(15.0, 42.2), p(12.6, 42.2), p(9.0, 44.2), p(4.0, 44.4), p(1.4, 43.7)],
      text: [
        'Nach Adrianopel zogen die Westgoten dreißig Jahre lang durch das Reich —',
        'mal als Verbündete unter Vertrag, mal als Plünderer, oft beides in',
        'derselben Generation. 410 nahm Alarich Rom. Danach ging es weiter nach',
        'Südgallien, wo Rom ihnen 418 Land zuwies: das Reich von Toulouse, der',
        'erste germanische Staat auf römischem Boden — mit römischer Erlaubnis.',
        'Als die Franken sie 507 aus Gallien verdrängten, verlegten sie ihr Reich',
        'nach Spanien, mit der Hauptstadt Toledo. Dort bestand es bis 711.',
      ].join(' '),
    },
    {
      id: 'vandalen',
      name: 'Vandalen',
      ...(() => {
        const [von, nach] = [p(17.5, 51.2), p(10.2, 36.9)];
        return { von, nach };
      })(),
      ueber: [p(12.5, 50.6), p(8.3, 50.0), p(3.0, 47.0), p(-1.0, 43.0), p(-4.5, 39.0), p(-5.8, 36.3), p(2.0, 35.6)],
      text: [
        'Silvester 406 überquerten Vandalen, Alanen und Sueben bei Mainz den',
        'Rhein — nach einer alten Erzählung über das Eis. Sie zogen durch Gallien',
        'nach Hispanien und 429 mit rund 80 000 Menschen über die Meerenge von',
        'Gibraltar nach Afrika: dorthin, wo Roms Getreide wuchs. 439 nahmen sie',
        'Karthago und bauten eine Flotte; 455 plünderten sie Rom. Ihr Reich hielt',
        'knapp hundert Jahre — 534 eroberte es Ostrom zurück. Von allen',
        'Wanderungen dieser Karte ist ihre die weiteste: von der Oder bis nach',
        'Tunesien, quer durch drei Erdteile in einer Menschengeneration.',
      ].join(' '),
    },
    {
      id: 'angelsachsen',
      name: 'Angeln und Sachsen',
      ...(() => {
        const [von, nach] = [p(8.8, 54.4), p(0.6, 52.4)];
        return { von, nach };
      })(),
      ueber: [p(6.0, 54.0), p(3.0, 53.2)],
      text: [
        '407 zog Rom die letzten Truppen aus Britannien ab; 410 antwortete Kaiser',
        'Honorius den Städten der Insel, sie sollten künftig selbst für ihre',
        'Verteidigung sorgen. In den Jahrzehnten danach kamen Angeln, Sachsen und',
        'Jüten über die Nordsee — erst als angeworbene Söldner, dann als Siedler,',
        'dann als Herren. Die britannisch-keltische Bevölkerung wurde nach Westen',
        'gedrängt, nach Wales und Cornwall, ein Teil setzte über die See in die',
        'Bretagne. Kein anderes Gebiet des Westens verlor so vollständig, was',
        'römisch war: Latein verschwand, die Städte verfielen, und aus dem Namen',
        'der Angeln wurde England.',
      ].join(' '),
    },
  ],

  beschriftungen: [
    { text: 'Britannien', art: 'land', ...ort(-2.4, 53.6) },
    { text: 'Gallien', art: 'land', ...ort(2.3, 46.6) },
    { text: 'Germanien', art: 'land', ...ort(11.5, 52.4) },
    { text: 'Hispanien', art: 'land', ...ort(-4.6, 40.2) },
    { text: 'Italien', art: 'land', drehung: 52, ...ort(13.2, 42.6) },
    { text: 'Nordafrika', art: 'land', ...ort(3.5, 34.2) },
    { text: 'Römisches Reich', art: 'land', ...ort(22.6, 42.6) },
    { text: 'Pannonien', art: 'land', ...ort(18.6, 46.6) },
    { text: 'Steppe', art: 'land', ...ort(40.5, 50.5) },
    { text: 'Ostsee', art: 'meer', ...ort(17.5, 56.4) },
    { text: 'Nordsee', art: 'meer', ...ort(3.0, 55.8) },
    { text: 'Mittelmeer', art: 'meer', ...ort(15.5, 34.8) },
    { text: 'Schwarzes Meer', art: 'meer', ...ort(34.2, 43.4) },
    { text: 'Rhein', art: 'meer', drehung: 76, ...ort(6.0, 50.4) },
    { text: 'Donau', art: 'meer', drehung: -10, ...ort(21.6, 43.6) },
    { text: 'Weichsel', art: 'meer', drehung: 62, ...ort(20.4, 51.9) },
  ],
};

module.exports = karte;
