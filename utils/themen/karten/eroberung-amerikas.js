// Die Karte zum Thema „Die Eroberung Amerikas" — Geschichte in Bewegung.
//
// Die Küstenlinien stehen hier als echte Längen-/Breitengrade `[lon, lat]` und
// werden von utils/karte-geo.js in SVG-Koordinaten umgerechnet. Wer einen Punkt
// anzweifelt, schlägt ihn im Atlas nach: `[-99.13, 19.43]` ist Tenochtitlan
// (das heutige Mexiko-Stadt), `[-71.97, -13.52]` Cusco, `[-6.9, 37.23]` Palos
// de la Frontera, von wo am 3. August 1492 drei Schiffe ausliefen.
//
// Der Ausschnitt ist der größte der ganzen App: 115° W bis 5° W, 20° S bis
// 45° N — 110 Längengrade auf 700 Einheiten, also gut 6,4 Einheiten je Grad.
// Das ist grob, und es ist Absicht. Dieses Kapitel handelt von einer
// Entfernung: Auf ein Bild müssen Sevilla und Cusco passen, sonst versteht
// niemand, worum es geht. Drei Dinge zwingen den Rahmen so weit:
//
//   * Rechts muss die Iberische Halbinsel stehen, sonst hat die Überfahrt
//     keinen Ausgangspunkt — und die Kanaren dazu, denn dort endete für
//     Europa die bekannte Welt und begann das offene Meer.
//   * Links muss Tenochtitlan hinein (99° W), unten Potosí (65,75° W,
//     19,58° S) — der Silberberg liegt einen Fingerbreit über dem unteren
//     Bildrand, und der Strom, der von dort nach Sevilla lief, ist die
//     Fortsetzung der Linie, die Kolumbus 1492 in die andere Richtung zog.
//   * In der Mitte liegt nichts als Wasser. Der Atlantik ist auf dieser Karte
//     keine Lücke, sondern die Bühne.
//
// Drei Festlegungen, die ausdrücklich hierher gehören:
//
//   1. **Flächen nur, wo Herrschaft mit Grenzen plausibel ist.** Das ist die
//      Regel aus den Karten zu den Germanen und den frühen Königreichen, und
//      sie ist hier besonders wichtig. Nordamerika nördlich von Mexiko, das
//      Amazonasbecken und die Weiten des Südens bleiben in jeder Phase leer —
//      nicht weil dort niemand lebte (dort lebten Millionen), sondern weil
//      keine der auf dieser Karte gezeigten Herrschaften dort Grenzen hatte.
//      Eine leere Fläche behauptet nichts. Eine erfundene behauptet zu viel.
//   2. **Auch das spanische Kolonialreich von 1600 ist zurückhaltend
//      gezeichnet.** Was dort steht, sind die Kerngebiete, die tatsächlich
//      verwaltet wurden — die alten Reiche der Azteken und der Inka, die
//      Küsten, die Silberstraßen. Die Nordgrenze Neuspaniens ist die vagste
//      Linie dieser ganzen Karte; der Hinweis der Phase sagt das selbst.
//   3. **Die App färbt alle Flächen einer Phase gleich ein** (siehe
//      components/abschnitte/KarteAbschnitt.js). Für dieses Thema ist das
//      genau richtig: 1492 stehen das Aztekenreich, das Inkareich und die
//      Kronen Kastiliens und Portugals in derselben Farbe nebeneinander. Kein
//      Ton sagt, welche davon die wichtigere war.
//
// Reine Daten und Rechnung — keine UI-Importe (Architektur-Regel).

const { KARTENFARBEN, erstelleProjektion, rueckwaerts, verbinde } = require('../../karte-geo');

// ---------------------------------------------------------------------------
// Ausschnitt und Projektion
// ---------------------------------------------------------------------------

/**
 * Der Kartenausschnitt: von der Halbinsel Niederkalifornien (115° W) bis
 * Andalusien (5° W), von Nordchile (20° S) bis zur Biskaya (45° N).
 */
const RAHMEN = { minLon: -115, maxLon: -5, minLat: -20, maxLat: 45, breite: 700 };

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
//
// Die Reihenfolge ist immer dieselbe Umrundung: von Nordwesten die Pazifikküste
// hinunter bis Chile, unter dem Bildrand nach Osten, die brasilianische Küste
// hinauf, die Karibik entlang zurück nach Westen, um Yucatán herum durch den
// Golf von Mexiko und die nordamerikanische Atlantikküste wieder nach Norden.
// Amerika ist ein einziger geschlossener Umriss — der Golf von Mexiko und das
// Karibische Meer sind Buchten darin und brauchen keine eigene Wasserfläche.

/** Pazifikküste: über dem Bildrand → Niederkalifornien → Isthmus von Tehuantepec. */
const PAZIFIK_NORDAMERIKA = [
  [-119.5, 47.0], // weit außerhalb, damit das Land über den Bildrand läuft
  [-117.1, 32.5], // bei San Diego
  [-116.6, 31.7],
  [-116.0, 30.4],
  [-115.6, 29.5],
  [-114.9, 28.3],
  [-114.6, 27.7], // Bahía Vizcaíno
  [-114.2, 27.0],
  [-113.1, 26.7],
  [-112.2, 26.0],
  [-112.1, 25.2],
  [-111.6, 24.4],
  [-110.9, 23.6],
  [-109.95, 22.88], // Cabo San Lucas, die Südspitze der Halbinsel
  [-109.7, 23.4],
  [-110.3, 24.15], // La Paz, am Golf von Kalifornien
  [-111.35, 26.0], // Loreto
  [-112.27, 27.34], // Santa Rosalía
  [-113.5, 28.95],
  [-114.4, 30.2],
  [-114.83, 31.03], // San Felipe
  [-114.7, 31.75], // Mündung des Colorado
  [-113.5, 31.3], // Ostufer des Golfs: Puerto Peñasco
  [-112.7, 29.9],
  [-111.95, 28.83], // Bahía Kino
  [-110.9, 27.92], // Guaymas
  [-109.5, 26.7],
  [-109.05, 25.6],
  [-107.9, 24.6],
  [-106.4, 23.2], // Mazatlán
  [-105.6, 22.3],
  [-105.3, 21.5],
  [-105.25, 20.6],
  [-104.3, 19.05],
  [-103.5, 18.6],
  [-102.2, 17.95],
  [-101.0, 17.3],
  [-99.9, 16.85], // Acapulco
  [-98.6, 16.3],
  [-97.07, 15.85],
  [-95.9, 15.9],
  [-95.2, 16.15], // Salina Cruz, am Isthmus von Tehuantepec
];

/** Pazifikküste Mittelamerikas: Tehuantepec → Darién. */
const PAZIFIK_MITTELAMERIKA = [
  [-95.2, 16.15],
  [-94.4, 16.2],
  [-93.5, 15.6],
  [-92.4, 14.7],
  [-91.5, 13.95],
  [-90.5, 13.9],
  [-89.8, 13.5],
  [-88.9, 13.3],
  [-87.8, 13.15], // Golf von Fonseca
  [-87.3, 12.9],
  [-86.7, 12.2],
  [-86.0, 11.6],
  [-85.7, 11.05],
  [-85.8, 10.3], // Halbinsel Nicoya
  [-85.65, 9.95],
  [-84.9, 9.85], // Golf von Nicoya
  [-84.2, 9.5],
  [-83.6, 8.9], // Golfo Dulce
  [-82.9, 8.3],
  [-81.5, 7.9],
  [-80.5, 7.3], // Halbinsel Azuero
  [-80.1, 8.2],
  [-79.53, 8.98], // Panamá — hier begann Pizarros Fahrt
  [-78.9, 8.7],
  [-78.2, 8.1], // Punta Garachiné, am Darién
];

/** Pazifikküste Südamerikas: Darién → Nordchile. */
const PAZIFIK_SUEDAMERIKA = [
  [-78.2, 8.1],
  [-77.9, 7.2],
  [-77.4, 6.5],
  [-77.5, 5.5], // Cabo Corrientes
  [-77.1, 3.9],
  [-77.6, 2.7],
  [-78.8, 1.8],
  [-79.7, 1.0], // bei Esmeraldas
  [-80.5, 0.35],
  [-80.7, -0.95], // Manta
  [-80.6, -1.7],
  [-81.0, -2.2],
  [-80.3, -2.9], // Golf von Guayaquil
  [-80.45, -3.57], // Tumbes — hier ging Pizarro 1532 an Land
  [-81.27, -4.58],
  [-81.33, -4.68], // Punta Pariñas, der Westpunkt Südamerikas
  [-80.9, -5.7],
  [-79.9, -6.8],
  [-79.05, -8.1],
  [-78.6, -9.1],
  [-78.15, -10.1],
  [-77.6, -11.0],
  [-77.15, -12.05], // Callao, der Hafen von Lima
  [-76.2, -13.7],
  [-75.2, -15.35],
  [-74.2, -15.85],
  [-72.7, -16.6],
  [-72.0, -17.0],
  [-71.35, -17.65],
  [-70.3, -18.48], // Arica
  [-70.15, -20.2],
  [-70.1, -22.5], // unter dem Bildrand
];

/** Atlantikküste Brasiliens, Südteil: unter dem Bildrand → Cabo Branco. */
const BRASILIEN_SUED = [
  [-48.5, -25.5], // unter dem Bildrand
  [-46.3, -23.97],
  [-44.3, -23.0],
  [-43.2, -22.9], // Rio de Janeiro
  [-41.9, -22.4], // Cabo Frio
  [-40.3, -20.3],
  [-39.7, -18.6],
  [-39.2, -17.6],
  [-39.0, -16.4],
  [-38.9, -14.8],
  [-38.5, -13.0], // die Bucht von Bahia
  [-37.0, -11.0],
  [-35.9, -9.7],
  [-34.9, -8.05],
  [-34.8, -7.15], // Cabo Branco, der Ostpunkt Amerikas
];

/** Atlantikküste Brasiliens und der Guyanas: Cabo Branco → Orinoco-Delta. */
const BRASILIEN_NORD = [
  [-34.8, -7.15],
  [-35.2, -5.8],
  [-36.5, -5.1],
  [-38.5, -3.7],
  [-40.5, -2.8],
  [-42.8, -2.5],
  [-44.3, -2.5],
  [-46.0, -1.0],
  [-48.5, -0.7], // Mündung des Amazonas
  [-50.0, -0.1],
  [-50.5, 0.9],
  [-51.0, 2.0],
  [-51.7, 4.0],
  [-52.5, 4.9],
  [-54.0, 5.5],
  [-55.5, 5.9],
  [-57.0, 6.1],
  [-58.2, 6.8],
  [-59.5, 8.0],
  [-60.0, 8.6], // Orinoco-Delta
];

/** Karibikküste Südamerikas: Orinoco-Delta → Golf von Urabá. */
const KARIBIK_SUEDAMERIKA = [
  [-60.0, 8.6],
  [-61.9, 9.9], // Golf von Paria
  [-63.0, 10.6],
  [-64.2, 10.45], // Cumaná
  [-66.0, 10.6],
  [-68.0, 10.5],
  [-69.6, 11.5],
  [-70.2, 12.2], // Halbinsel Paraguaná
  [-71.0, 11.6], // Golf von Venezuela
  [-71.66, 12.46], // Punta Gallinas, der Nordpunkt Südamerikas
  [-72.4, 11.9],
  [-73.3, 11.3],
  [-74.2, 11.05],
  [-74.85, 11.0], // Mündung des Magdalena
  [-75.5, 10.4], // bei Cartagena
  [-75.6, 9.4],
  [-76.2, 8.9],
  [-76.9, 8.6],
  [-77.4, 8.5], // Golf von Urabá
];

/** Karibikküste Mittelamerikas: Urabá → Nordostspitze Yucatáns. */
const KARIBIK_MITTELAMERIKA = [
  [-77.4, 8.5],
  [-77.9, 8.7],
  [-78.5, 9.2],
  [-79.5, 9.4],
  [-79.9, 9.6], // die karibische Seite des Isthmus von Panama
  [-80.6, 9.6],
  [-81.5, 9.2],
  [-82.3, 9.0],
  [-82.9, 9.6],
  [-83.3, 10.1],
  [-83.6, 10.4],
  [-83.7, 11.0],
  [-83.5, 11.9],
  [-83.7, 12.4],
  [-83.4, 13.4],
  [-83.2, 14.3],
  [-83.16, 14.99], // Cabo Gracias a Dios
  [-84.0, 15.4],
  [-85.0, 15.9],
  [-86.0, 15.95],
  [-87.0, 15.8],
  [-87.9, 15.85],
  [-88.6, 15.75], // Golf von Honduras
  [-88.2, 16.5],
  [-88.3, 17.5],
  [-88.0, 18.4],
  [-87.5, 19.3],
  [-87.0, 20.3],
  [-86.85, 21.16],
  [-87.1, 21.6], // Cabo Catoche
];

/** Yucatán und der Golf von Mexiko: Cabo Catoche → Tampico. */
const YUCATAN_GOLF = [
  [-87.1, 21.6],
  [-88.2, 21.6],
  [-89.7, 21.28],
  [-90.4, 21.1],
  [-90.5, 20.4],
  [-90.8, 19.8],
  [-91.4, 18.9], // Campeche
  [-92.0, 18.65],
  [-93.0, 18.5], // Laguna de Términos
  [-94.4, 18.15],
  [-95.4, 18.7],
  [-96.13, 19.19], // Veracruz — Cortés' Landeplatz von 1519
  [-96.4, 19.9],
  [-97.4, 21.0],
  [-97.85, 22.25], // Tampico
];

/** Nordufer des Golfs von Mexiko: Tampico → Südspitze Floridas. */
const GOLF_NORD = [
  [-97.85, 22.25],
  [-97.75, 23.7],
  [-97.15, 25.95], // Mündung des Río Bravo
  [-97.3, 26.9],
  [-97.4, 27.8],
  [-96.4, 28.4],
  [-95.3, 28.9],
  [-94.8, 29.3],
  [-93.8, 29.7],
  [-92.0, 29.6],
  [-90.9, 29.15],
  [-89.4, 29.1], // Mississippi-Delta
  [-89.3, 30.2],
  [-88.0, 30.4],
  [-87.2, 30.4],
  [-85.7, 30.1],
  [-84.3, 29.9], // Apalachee-Bucht
  [-83.4, 29.6],
  [-82.8, 28.9],
  [-82.7, 28.0],
  [-82.2, 26.8],
  [-81.8, 26.0],
  [-81.1, 25.15], // Cape Sable, die Südspitze
  [-80.4, 25.2],
];

/** Atlantikküste Nordamerikas: Florida → über den oberen Bildrand hinaus. */
const ATLANTIK_NORDAMERIKA = [
  [-80.4, 25.2],
  [-80.15, 25.8],
  [-80.05, 26.7],
  [-80.55, 28.4], // Kap Canaveral
  [-81.2, 29.7],
  [-81.4, 30.7],
  [-80.85, 32.0],
  [-79.9, 32.75],
  [-78.9, 33.6],
  [-77.9, 34.0], // Cape Fear
  [-76.5, 34.7],
  [-75.5, 35.25], // Kap Hatteras
  [-75.9, 36.9], // Chesapeake Bay
  [-75.0, 38.8],
  [-74.0, 40.45],
  [-72.0, 41.05],
  [-70.3, 41.7],
  [-70.0, 42.05], // Cape Cod
  [-70.7, 43.1],
  [-69.0, 44.0],
  [-67.0, 44.9],
  [-65.5, 46.5], // über dem Bildrand
];

// ---------------------------------------------------------------------------
// Die Alte Welt am rechten Bildrand
// ---------------------------------------------------------------------------

/** Nordküste der Iberischen Halbinsel: über dem rechten Bildrand → Finisterre. */
const IBERIEN_NORD = [
  [-3.0, 43.45], // östlich des Bildrands
  [-4.0, 43.5],
  [-5.8, 43.6],
  [-7.0, 43.6],
  [-7.9, 43.7],
  [-8.9, 43.3], // Kap Finisterre
];

/** Atlantikküste der Halbinsel: Finisterre → Straße von Gibraltar. */
const IBERIEN_ATLANTIK = [
  [-8.9, 43.3],
  [-8.8, 42.5],
  [-8.87, 41.87], // Mündung des Minho
  [-8.8, 41.15], // Mündung des Douro
  [-9.0, 40.0],
  [-9.4, 39.4], // Cabo da Roca
  [-9.2, 38.7], // Mündung des Tejo, Lissabon
  [-8.9, 38.5],
  [-8.8, 37.8],
  [-8.99, 37.02], // Kap São Vicente
  [-7.4, 37.2], // Mündung des Guadiana
  [-6.9, 37.23], // Palos de la Frontera
  [-6.35, 36.8], // Sanlúcar, Mündung des Guadalquivir
  [-6.29, 36.53], // Cádiz
  [-5.9, 36.2],
  [-5.6, 36.0], // Straße von Gibraltar
];

/** Nordwestafrika: Tanger → Golf von Guinea. */
const AFRIKA_ATLANTIK = [
  [-5.6, 35.9],
  [-6.3, 35.2],
  [-6.5, 34.6],
  [-6.9, 34.0], // Rabat
  [-7.7, 33.5],
  [-8.5, 32.8],
  [-9.3, 31.5],
  [-9.8, 30.4], // Agadir
  [-10.0, 29.5],
  [-11.0, 28.7],
  [-12.0, 28.0],
  [-13.2, 27.7],
  [-14.5, 26.3],
  [-15.0, 24.6],
  [-16.0, 23.0],
  [-16.5, 22.0],
  [-17.05, 20.77], // Cabo Blanco
  [-16.5, 20.0],
  [-16.5, 19.0],
  [-16.2, 17.5],
  [-16.5, 16.2],
  [-17.44, 14.72], // Kap Verde, die Westspitze Afrikas
  [-16.8, 13.6],
  [-16.7, 12.5],
  [-15.9, 11.8],
  [-15.0, 11.0],
  [-14.5, 10.3],
  [-13.7, 9.5],
  [-13.3, 8.5],
  [-12.5, 7.6],
  [-11.5, 7.0],
  [-10.8, 6.1],
  [-9.5, 5.0],
  [-8.0, 4.6],
  [-7.0, 4.4],
  [-5.5, 5.0],
  [-4.0, 5.2], // östlich des Bildrands
];

// ---------------------------------------------------------------------------
// Inseln
// ---------------------------------------------------------------------------

/** Kuba — 1511 spanisch, Ausgangspunkt der Fahrt nach Mexiko. */
const KUBA = [
  [-84.95, 21.85], // Cabo San Antonio, die Westspitze
  [-84.0, 22.1],
  [-83.0, 22.9],
  [-82.36, 23.13], // Havanna
  [-81.2, 23.2],
  [-80.0, 22.9],
  [-79.3, 22.4],
  [-77.6, 21.6],
  [-76.5, 21.2],
  [-75.6, 21.1],
  [-74.6, 20.7],
  [-74.13, 20.25], // Punta Maisí, die Ostspitze
  [-75.2, 19.9],
  [-76.2, 19.95],
  [-77.2, 20.3],
  [-77.7, 21.0],
  [-78.8, 21.6],
  [-79.9, 22.05],
  [-80.45, 22.15],
  [-81.5, 22.4],
  [-82.5, 22.7], // Golf von Batabanó
  [-83.5, 22.2],
  [-84.5, 21.9],
];

/** Hispaniola — die erste Insel, auf der Europa in Amerika blieb. */
const HISPANIOLA = [
  [-71.7, 19.9],
  [-70.7, 19.85],
  [-69.9, 19.75],
  [-69.2, 19.35],
  [-68.7, 18.9],
  [-68.35, 18.6],
  [-68.7, 18.2],
  [-69.9, 18.47], // Santo Domingo
  [-70.7, 18.25],
  [-71.6, 18.35],
  [-71.7, 18.05],
  [-72.4, 18.55],
  [-73.4, 18.2],
  [-74.45, 18.35],
  [-73.5, 18.6],
  [-72.8, 18.6],
  [-72.6, 19.3],
  [-73.4, 19.7],
  [-72.3, 19.9],
];

const JAMAIKA = [
  [-78.4, 18.5],
  [-77.5, 18.5],
  [-76.4, 18.4],
  [-76.2, 17.9],
  [-77.2, 17.85],
  [-78.2, 18.2],
];

const PUERTO_RICO = [
  [-67.25, 18.5],
  [-66.1, 18.47],
  [-65.6, 18.4],
  [-65.6, 17.95],
  [-66.6, 17.95],
  [-67.2, 18.05],
];

const TRINIDAD = [
  [-61.9, 10.8],
  [-60.9, 10.75],
  [-60.55, 10.15],
  [-61.5, 10.05],
  [-61.9, 10.4],
];

/**
 * Guanahani — die Insel, an der Kolumbus am 12. Oktober 1492 an Land ging.
 *
 * Welche Insel der Bahamas es war, ist bis heute umstritten; am häufigsten
 * genannt wird die, die auf heutigen Karten San Salvador heißt. Sie ist klein,
 * und auf diesem Maßstab bleibt sie ein Fleck — was ganz gut zu ihr passt.
 */
const GUANAHANI = [
  [-74.55, 24.15],
  [-74.4, 24.1],
  [-74.42, 23.92],
  [-74.55, 23.95],
];

/** Andros, die größte Insel der Bahamas — damit die Inselwelt nicht leer ist. */
const ANDROS = [
  [-78.2, 25.1],
  [-77.7, 25.2],
  [-77.6, 24.6],
  [-77.75, 24.0],
  [-78.05, 24.4],
];

// Die Kanarischen Inseln — bewusst vereinfacht: vier Umrisse für die Gruppe.
// Sie waren der letzte Hafen vor dem offenen Meer und zugleich die Probe aufs
// Exempel, was Kastilien mit einer eroberten Bevölkerung tat: Die Guanchen
// wurden zwischen 1402 und 1496 unterworfen — sieben Jahre vor 1492 endete
// das dort, was ein Jahr danach drüben begann.

const TENERIFFA = [
  [-16.92, 28.35],
  [-16.55, 28.55],
  [-16.12, 28.58],
  [-16.15, 28.35],
  [-16.5, 28.05],
  [-16.8, 28.15],
];

const GRAN_CANARIA = [
  [-15.83, 28.15],
  [-15.4, 28.15],
  [-15.36, 27.85],
  [-15.66, 27.73],
  [-15.85, 27.9],
];

const FUERTEVENTURA = [
  [-14.5, 28.05],
  [-14.0, 28.15],
  [-13.83, 28.4],
  [-13.85, 28.75],
  [-14.25, 28.6],
  [-14.5, 28.3],
];

const LANZAROTE = [
  [-13.85, 28.85],
  [-13.45, 28.85],
  [-13.42, 29.2],
  [-13.7, 29.42],
  [-13.9, 29.15],
];

// ---------------------------------------------------------------------------
// Flüsse
// ---------------------------------------------------------------------------
//
// Auf dieser Karte sind die Flüsse mehr als Zierrat: An zweien von ihnen hängt
// die Erzählung. Der Guadalquivir ist der Grund, warum ausgerechnet Sevilla
// achtzig Kilometer landeinwärts der Hafen der Neuen Welt wurde. Und der
// Magdalena war der Weg, auf dem die Spanier ins Innere Südamerikas kamen.

const AMAZONAS = [
  [-73.0, -4.5],
  [-70.0, -4.2],
  [-67.0, -3.3],
  [-64.7, -3.3],
  [-61.0, -3.3],
  [-58.5, -2.5],
  [-55.5, -2.0],
  [-52.5, -1.5],
  [-50.0, -0.5],
  [-48.5, -0.7],
];

const ORINOCO = [
  [-63.5, 2.5],
  [-66.0, 4.5],
  [-67.6, 6.2],
  [-67.4, 8.1],
  [-65.0, 8.1],
  [-63.0, 8.4],
  [-61.5, 8.8],
  [-60.5, 8.7],
];

const MAGDALENA = [
  [-75.3, 2.2],
  [-74.8, 4.5],
  [-74.5, 6.5],
  [-74.2, 8.5],
  [-74.5, 10.0],
  [-74.85, 11.0],
];

const SAO_FRANCISCO = [
  [-45.0, -18.0],
  [-44.0, -15.0],
  [-42.0, -13.0],
  [-40.0, -10.5],
  [-38.0, -10.0],
  [-36.4, -10.5],
];

const RIO_BRAVO = [
  [-106.5, 31.8],
  [-104.5, 29.6],
  [-102.0, 29.7],
  [-100.0, 28.5],
  [-99.0, 27.0],
  [-97.15, 25.95],
];

const MISSISSIPPI = [
  [-90.2, 38.6],
  [-90.0, 36.0],
  [-91.0, 33.5],
  [-91.2, 31.5],
  [-91.0, 30.4],
  [-89.9, 29.9],
  [-89.4, 29.1],
];

/** Der Guadalquivir — die Straße, auf der das Silber nach Sevilla kam. */
const GUADALQUIVIR = [
  [-3.5, 37.8],
  [-5.0, 37.6],
  [-5.98, 37.39], // Sevilla
  [-6.3, 37.0],
  [-6.35, 36.8],
];

// ---------------------------------------------------------------------------
// Die Landmassen
// ---------------------------------------------------------------------------

/**
 * Ganz Amerika als ein einziger Umriss.
 *
 * Nord- und Südamerika hängen am Isthmus von Panama zusammen — auf dieser
 * Karte sind das rund vier SVG-Einheiten, und genau so schmal war der Streifen,
 * über den Pizarro 1531 seine Leute an den Pazifik brachte. Der Golf von
 * Mexiko und das Karibische Meer entstehen von selbst, weil die Linie in sie
 * hinein- und wieder herausläuft.
 */
const AMERIKA = verbinde(
  PAZIFIK_NORDAMERIKA,
  PAZIFIK_MITTELAMERIKA,
  PAZIFIK_SUEDAMERIKA,
  // Rückweg unter dem Bildrand, quer durch den Süden des Kontinents.
  [
    [-68.0, -24.0],
    [-58.0, -25.0],
  ],
  BRASILIEN_SUED,
  BRASILIEN_NORD,
  KARIBIK_SUEDAMERIKA,
  KARIBIK_MITTELAMERIKA,
  YUCATAN_GOLF,
  GOLF_NORD,
  ATLANTIK_NORDAMERIKA,
  // Rückweg über dem Bildrand, quer durch den Norden.
  [
    [-62.0, 48.5],
    [-80.0, 52.0],
    [-119.5, 50.0],
  ],
);

/** Die Iberische Halbinsel — der rechte Bildrand schneidet sie mitten durch. */
const IBERIEN = verbinde(IBERIEN_NORD, IBERIEN_ATLANTIK, [
  [-4.0, 36.4],
  [-3.0, 37.5],
  [-3.0, 43.45],
]);

/** Nordwestafrika — läuft nach Osten aus dem Bild. */
const AFRIKA = verbinde(AFRIKA_ATLANTIK, [
  [-3.0, 12.0],
  [-3.0, 35.5],
]);

// ---------------------------------------------------------------------------
// Bausteine für die Phasen
// ---------------------------------------------------------------------------

/**
 * Der Index des Küstenpunkts, der einem Ort am nächsten liegt.
 *
 * Wie bei den anderen Karten: Die Flächen schneiden die Küstenlisten nicht
 * nach Index, sondern nach Ort. „Von Veracruz bis zum Isthmus" bleibt richtig,
 * auch wenn jemand dazwischen eine Bucht nachträgt.
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

/**
 * Das Aztekenreich um 1519 — der Dreibund von Tenochtitlan, Texcoco und
 * Tlacopan.
 *
 * Diese Linie ist gröber als die Wirklichkeit, und das gehört gesagt: Der
 * Dreibund war kein Staat mit Grenzen, sondern ein Netz aus Städten, die
 * Tribut zahlten. Manche Gebiete darin gehorchten nie, und mitten im Gebiet
 * lag Tlaxcala, das seine Unabhängigkeit behielt — 1519 wurde genau das zum
 * entscheidenden Punkt.
 */
const AZTEKENREICH = verbinde(
  kueste(YUCATAN_GOLF, [-97.4, 21.0], [-94.4, 18.15]),
  [
    [-94.6, 17.4],
    [-95.3, 16.6],
  ],
  kueste(PAZIFIK_NORDAMERIKA, [-95.2, 16.15], [-99.9, 16.85]),
  [
    [-100.9, 17.6],
    [-101.4, 18.6],
    [-100.7, 19.8],
    [-100.4, 20.7],
    [-99.5, 21.2],
    [-98.2, 21.2],
  ],
);

/**
 * Tawantinsuyu, das Reich der Inka, um 1525 — von Südkolumbien bis Mittelchile.
 *
 * Die Westgrenze ist die Küste, die Ostgrenze der Fuß der Anden: Der Regenwald
 * dahinter gehörte nie dazu. Nach Süden läuft das Reich unter dem Bildrand
 * weiter, es reichte bis etwa zum Fluss Maule im heutigen Chile.
 */
const INKAREICH = verbinde(
  kueste(PAZIFIK_SUEDAMERIKA, [-79.7, 1.0], [-70.15, -20.2]),
  [
    [-70.0, -21.5],
    [-67.0, -22.0],
    [-65.5, -19.0],
    [-64.6, -17.3],
    [-66.0, -15.3],
    [-68.3, -13.6],
    [-70.6, -12.5],
    [-72.6, -11.0],
    [-74.6, -9.9],
    [-76.4, -7.6],
    [-77.4, -6.0],
    [-77.9, -4.3],
    [-78.2, -2.3],
    [-78.0, -0.6],
    [-77.9, 0.9],
  ],
);

/** Die Kronen von Kastilien und Aragón — auf diesem Bild nur ihr Westrand. */
const KASTILIEN = verbinde(
  kueste(IBERIEN_NORD, [-3.0, 43.45], [-8.9, 43.3]),
  kueste(IBERIEN_ATLANTIK, [-8.9, 43.3], [-8.87, 41.87]),
  [
    [-7.0, 41.9],
    [-6.9, 41.0],
    [-7.0, 40.0],
    [-7.3, 39.0],
    [-7.0, 38.0],
    [-7.4, 37.2],
  ],
  kueste(IBERIEN_ATLANTIK, [-7.4, 37.2], [-5.6, 36.0]),
  [
    [-4.0, 36.4],
    [-3.0, 37.5],
    [-3.0, 43.45],
  ],
);

/** Das Königreich Portugal — der andere Weg nach Osten, um Afrika herum. */
const PORTUGAL = verbinde(kueste(IBERIEN_ATLANTIK, [-8.87, 41.87], [-7.4, 37.2]), [
  [-7.0, 38.0],
  [-7.3, 39.0],
  [-7.0, 40.0],
  [-6.9, 41.0],
  [-7.0, 41.9],
]);

/**
 * Das Vizekönigreich Neuspanien um 1600 — Mexiko und Mittelamerika.
 *
 * Die Nordlinie ist die vagste dieser Karte. Nördlich davon lagen Silberminen
 * und Missionen, aber keine Verwaltung; viele Völker dort wurden nie
 * unterworfen. Die Linie sagt: „bis hierher regiert", nicht „bis hierher
 * besiedelt".
 */
const NEUSPANIEN = verbinde(
  kueste(PAZIFIK_NORDAMERIKA, [-106.4, 23.2], [-95.2, 16.15]),
  kueste(PAZIFIK_MITTELAMERIKA, [-95.2, 16.15], [-83.6, 8.9]),
  [[-83.0, 9.3]],
  kueste(KARIBIK_MITTELAMERIKA, [-83.3, 10.1], [-87.1, 21.6]),
  kueste(YUCATAN_GOLF, [-87.1, 21.6], [-97.85, 22.25]),
  [
    [-99.0, 22.6],
    [-101.5, 22.9],
    [-103.5, 22.6],
    [-105.3, 22.7],
  ],
);

/**
 * Das Vizekönigreich Peru um 1600 — von Panama bis unter den Bildrand.
 *
 * Es umfasste damals auch das spätere Kolumbien und Ecuador. Die Ostgrenze
 * folgt wieder dem Fuß der Anden, mit einer Ausbuchtung nach Südosten: Potosí
 * musste hinein, sonst hinge der Silberstrom in der Luft.
 */
const PERU = verbinde(
  kueste(KARIBIK_MITTELAMERIKA, [-82.9, 9.6], [-77.4, 8.5]),
  kueste(KARIBIK_SUEDAMERIKA, [-77.4, 8.5], [-71.66, 12.46]),
  [
    [-72.8, 9.5],
    [-73.6, 6.5],
    [-74.8, 2.0],
    [-76.0, -2.0],
    [-76.5, -5.5],
    [-75.0, -9.0],
    [-72.0, -12.5],
    [-69.0, -15.0],
    [-66.0, -17.5],
    [-64.6, -19.5],
    [-64.5, -22.0],
    [-70.0, -22.5],
  ],
  kueste(PAZIFIK_SUEDAMERIKA, [-70.15, -20.2], [-78.2, 8.1]),
  kueste(PAZIFIK_MITTELAMERIKA, [-78.2, 8.1], [-82.9, 8.3]),
);

/**
 * Portugiesisch-Brasilien um 1600 — ein Streifen an der Küste.
 *
 * Mehr war es nicht: Zuckerrohr, Häfen, ein paar Dutzend Kilometer
 * Landeinwärts. Das Innere blieb bis weit ins 17. Jahrhundert außerhalb jeder
 * europäischen Herrschaft.
 */
const BRASILIEN = verbinde(
  kueste(BRASILIEN_SUED, [-46.3, -23.97], [-34.8, -7.15]),
  kueste(BRASILIEN_NORD, [-34.8, -7.15], [-35.2, -5.8]),
  [
    [-37.0, -7.0],
    [-38.5, -9.0],
    [-40.0, -11.5],
    [-41.0, -14.5],
    [-41.5, -17.5],
    [-43.5, -20.5],
    [-45.5, -22.5],
    [-47.5, -24.5],
  ],
);

/** Spanien und Portugal ab 1580 unter einer Krone — die Halbinsel als Ganzes. */
const IBERIEN_GANZ = verbinde(
  kueste(IBERIEN_NORD, [-3.0, 43.45], [-8.9, 43.3]),
  IBERIEN_ATLANTIK,
  [
    [-4.0, 36.4],
    [-3.0, 37.5],
    [-3.0, 43.45],
  ],
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
    // Das Meer ist der Untergrund; alles Land liegt darüber. Auf dieser Karte
    // ist es mehr als die Hälfte des Bildes.
    {
      art: 'grund',
      d: `M 0 0 H ${geo.breite} V ${geo.hoehe} H 0 Z`,
      fill: KARTENFARBEN.meer,
      stroke: 'none',
      strokeWidth: 0,
    },
    land(AMERIKA),
    land(IBERIEN),
    land(AFRIKA),
    land(KUBA),
    land(HISPANIOLA),
    land(JAMAIKA),
    land(PUERTO_RICO),
    land(TRINIDAD),
    land(ANDROS),
    land(GUANAHANI),
    land(TENERIFFA),
    land(GRAN_CANARIA),
    land(FUERTEVENTURA),
    land(LANZAROTE),
    fluss(AMAZONAS),
    fluss(ORINOCO),
    fluss(MAGDALENA),
    fluss(SAO_FRANCISCO),
    fluss(RIO_BRAVO),
    fluss(MISSISSIPPI),
    fluss(GUADALQUIVIR),
  ],

  phasen: [
    {
      id: 'zwei-welten',
      label: 'um 1492',
      hinweis:
        'Zwei Welten auf einem Bild, die nichts voneinander wissen. Links das Aztekenreich und das Reich der Inka — zwei Großmächte mit Millionen Untertanen, Straßen, Steuern und Städten, von denen Tenochtitlan größer war als jede Stadt Europas außer vielleicht Konstantinopel. Rechts die Kronen Kastiliens und Aragóns, die eben erst Granada genommen haben, und Portugal, das den Weg um Afrika sucht. Dazwischen liegt ein Ozean, den niemand für überquerbar hält. Alle vier Flächen haben dieselbe Farbe: Auf dieser Karte ist keine dieser Mächte die wichtigere.',
      flaechen: [
        gebiet('Das Aztekenreich — der Dreibund von Tenochtitlan, Texcoco und Tlacopan', AZTEKENREICH),
        gebiet('Das Reich der Inka — Tawantinsuyu, „die vier Weltteile"', INKAREICH),
        gebiet('Die Kronen von Kastilien und Aragón', KASTILIEN),
        gebiet('Das Königreich Portugal', PORTUGAL),
      ],
    },
    {
      id: 'erste-reisen',
      label: '1492–1504',
      hinweis:
        'Kolumbus fährt viermal über den Atlantik und stirbt 1506 in der Überzeugung, er sei in Asien gewesen. Was Spanien in diesen zwölf Jahren wirklich besitzt, ist auf der Karte kaum zu sehen: eine einzige Insel. Hispaniola wird der erste Stützpunkt, Santo Domingo 1496 die erste dauerhafte europäische Stadt der Neuen Welt. Von den beiden großen Reichen im Westen weiß in Europa noch niemand etwas — und dort weiß noch niemand, dass jemand gekommen ist.',
      flaechen: [
        gebiet('Das Aztekenreich — der Dreibund von Tenochtitlan, Texcoco und Tlacopan', AZTEKENREICH),
        gebiet('Das Reich der Inka — Tawantinsuyu', INKAREICH),
        gebiet('Hispaniola — der erste spanische Stützpunkt', HISPANIOLA),
        gebiet('Die Kronen von Kastilien und Aragón', KASTILIEN),
        gebiet('Das Königreich Portugal', PORTUGAL),
      ],
    },
    {
      id: 'tenochtitlan',
      label: '1519–1521',
      hinweis:
        'Von Kuba aus segelt Cortés 1519 mit rund 500 Mann nach Westen. Sieh dir die Linie an: Der Weg führt über Veracruz und Tlaxcala — und in Tlaxcala liegt der Grund, warum aus 500 Mann ein Heer wird. Die Tlaxcalteken waren jahrzehntelang vom Dreibund bekriegt worden und stellten zehntausende Krieger. Am 13. August 1521 fällt Tenochtitlan nach 93 Tagen Belagerung. Ein Jahr vorher hatten die Pocken die Stadt erreicht, gegen die dort niemand geschützt war.',
      flaechen: [
        gebiet('Das Aztekenreich — im August 1521 gefallen', AZTEKENREICH),
        gebiet('Das Reich der Inka — noch unberührt', INKAREICH),
        gebiet('Kuba — seit 1511 spanisch', KUBA),
        gebiet('Hispaniola — spanisch seit 1492', HISPANIOLA),
        gebiet('Die Kronen von Kastilien und Aragón', KASTILIEN),
        gebiet('Das Königreich Portugal', PORTUGAL),
      ],
    },
    {
      id: 'cajamarca',
      label: '1532–1533',
      hinweis:
        'Elf Jahre später dasselbe im Süden — mit einem Unterschied: Die Krankheit war vor den Spaniern da. Um 1527 starben der Inka Huayna Capac und sein Erbe vermutlich an den Pocken, die aus dem Norden kamen; danach führten seine Söhne Atahualpa und Huáscar einen Bürgerkrieg. In dieses Land kommt Pizarro 1532 mit 168 Mann. Am 16. November nimmt er Atahualpa in Cajamarca gefangen, im November 1533 zieht er in Cusco ein. Widerstand gibt es weiter: Der letzte Inka-Staat in Vilcabamba hält bis 1572.',
      flaechen: [
        gebiet('Neuspanien — das Land, das die Spanier ab 1521 regierten', AZTEKENREICH),
        gebiet('Das Reich der Inka — 1532/33 im Bürgerkrieg und dann verloren', INKAREICH),
        gebiet('Kuba', KUBA),
        gebiet('Hispaniola', HISPANIOLA),
        gebiet('Die Kronen von Kastilien und Aragón', KASTILIEN),
        gebiet('Das Königreich Portugal', PORTUGAL),
      ],
    },
    {
      id: 'kolonialreich',
      label: 'um 1600',
      hinweis:
        'Hundert Jahre nach der ersten Fahrt sind zwei Vizekönigreiche daraus geworden, und über den Atlantik läuft ein Strom aus Silber. Diese Flächen sind mit Absicht zurückhaltend gezeichnet: Sie zeigen, was verwaltet wurde, nicht, was beansprucht wurde. Auf dem Papier gehörte Spanien fast der ganze Doppelkontinent; tatsächlich regierte es die alten Reiche der Azteken und Inka, die Küsten und die Silberstraßen. Nordamerika, das Amazonasbecken und der Süden bleiben leer — dort lebten Millionen Menschen außerhalb jeder europäischen Herrschaft.',
      flaechen: [
        gebiet('Das Vizekönigreich Neuspanien', NEUSPANIEN),
        gebiet('Das Vizekönigreich Peru — bis Potosí und darüber hinaus', PERU),
        gebiet('Kuba', KUBA),
        gebiet('Hispaniola', HISPANIOLA),
        gebiet('Puerto Rico', PUERTO_RICO),
        gebiet('Portugiesisch-Brasilien — ein Streifen an der Küste', BRASILIEN),
        gebiet('Spanien und Portugal — seit 1580 unter einer Krone', IBERIEN_GANZ),
      ],
    },
  ],

  punkte: [
    {
      id: 'sevilla',
      name: 'Sevilla',
      typ: 'stadt',
      ...ort(-5.98, 37.39),
      text: [
        'Der Hafen der Neuen Welt lag achtzig Kilometer landeinwärts. Sevilla',
        'liegt am Guadalquivir, den Seeschiffe hinauffahren konnten — und weil',
        'die Krone den ganzen Verkehr über eine einzige Stelle laufen lassen',
        'wollte, saß hier ab 1503 die Casa de Contratación, das Handelshaus.',
        'Jedes Schiff, jede Ladung, jeder Auswanderer wurde hier eingetragen;',
        'deshalb wissen wir heute so genau, was hin- und herging. Ganz in der',
        'Nähe liegen die beiden anderen Häfen dieser Geschichte: Palos de la',
        'Frontera, von wo am 3. August 1492 drei Schiffe ausliefen, und Cádiz,',
        'von wo die späteren Flotten fuhren. Was hier ankam, veränderte Europa:',
        'Silber, Mais, Kartoffeln, Tomaten, Kakao — und ein Reichtum, der die',
        'Preise in ganz Europa steigen ließ.',
      ].join(' '),
    },
    {
      id: 'kanaren',
      name: 'Kanarische Inseln',
      typ: 'grenze',
      ...ort(-16.0, 28.2),
      text: [
        'Hier endete für Europa die bekannte Welt. Kolumbus lief die Kanaren an,',
        'reparierte ein Ruder und segelte am 6. September 1492 weiter — von hier',
        'an lag vor ihm nur offenes Wasser. Die Inseln waren nicht zufällig der',
        'letzte Hafen: Auf ihrer Höhe weht der Passat verlässlich nach Westen.',
        'Wer nach Amerika wollte, fuhr erst nach Süden und dann geradeaus.',
        'Die Kanaren sind aber auch eine Vorgeschichte, die man kennen sollte:',
        'Kastilien hatte sie zwischen 1402 und 1496 erobert und die dort',
        'lebenden Guanchen unterworfen. Vieles, was danach in Amerika geschah —',
        'Landverteilung an Eroberer, Zwangsarbeit, Zuckerrohr —, war hier',
        'vorher schon einmal geprobt worden.',
      ].join(' '),
    },
    {
      id: 'guanahani',
      name: 'Guanahani',
      typ: 'ereignis',
      ...ort(-74.48, 24.05),
      text: [
        'Am Morgen des 12. Oktober 1492 gingen drei Schiffsbesatzungen auf einer',
        'kleinen Insel an Land, deren Bewohner sie Guanahani nannten. Kolumbus',
        'gab ihr den Namen San Salvador und nahm sie für Kastilien in Besitz —',
        'vor Menschen, die kein Wort davon verstanden. Er hielt sie für Inder,',
        'weil er glaubte, vor Asien zu sein; deshalb heißen die Ureinwohner',
        'Amerikas bis heute in vielen Sprachen „Indianer". Welche Insel es',
        'genau war, streitet die Forschung bis heute. In seinem Bordbuch steht',
        'schon am ersten Tag beides nebeneinander: Bewunderung für die',
        'Freundlichkeit der Taíno — und die Bemerkung, mit fünfzig Mann könne',
        'man sie alle unterwerfen.',
      ].join(' '),
    },
    {
      id: 'santo-domingo',
      name: 'Santo Domingo',
      typ: 'stadt',
      ...ort(-69.9, 18.47),
      text: [
        '1496 gegründet, die älteste dauerhaft bewohnte europäische Stadt',
        'Amerikas — mit der ersten Kathedrale und der ersten Universität. Von',
        'hier aus wurde alles Weitere organisiert. Und hier zeigte sich zuerst,',
        'was auf die Ankunft folgte: Die Taíno der Insel, deren Zahl auf',
        'mehrere hunderttausend bis über eine Million geschätzt wird, waren',
        'binnen zweier Generationen fast verschwunden — durch eingeschleppte',
        'Krankheiten, durch Zwangsarbeit in den Goldwäschen, durch Hunger und',
        'Gewalt. Hier hielt 1511 der Dominikaner Antonio de Montesinos die',
        'Predigt, die fragte: „Sind das nicht Menschen?" Und hier begann als',
        'Folge des Bevölkerungssturzes der Import versklavter Menschen aus',
        'Afrika.',
      ].join(' '),
    },
    {
      id: 'tenochtitlan',
      name: 'Tenochtitlan',
      typ: 'ereignis',
      ...ort(-99.13, 19.43),
      text: [
        'Eine Stadt auf einer Insel im See, mit Dämmen, Kanälen, Aquädukt,',
        'einem Markt, über den die Spanier staunend schrieben, und wohl 150 000',
        'bis 200 000 Einwohnern — größer als jede Stadt Europas außer vielleicht',
        'Konstantinopel. Cortés’ Leute hielten sie beim ersten Anblick für',
        'eine Verzauberung. Am 8. November 1519 zogen sie ein und nahmen den',
        'Herrscher Moctezuma II. als Geisel; in der Nacht des 30. Juni 1520',
        'wurden sie unter schweren Verlusten aus der Stadt getrieben. Im Mai',
        '1521 kehrten sie mit zehntausenden indigenen Verbündeten zurück. Nach',
        '93 Tagen Belagerung, in einer Stadt ohne Trinkwasser und voller',
        'Pockenkranker, gab Cuauhtémoc am 13. August auf. Auf den Trümmern',
        'entstand Mexiko-Stadt.',
      ].join(' '),
    },
    {
      id: 'cusco',
      name: 'Cusco',
      typ: 'ereignis',
      ...ort(-71.97, -13.52),
      text: [
        'Der Nabel der Welt — so hieß Cusco in der Sprache der Inka. Von hier',
        'liefen vier Straßen in die vier Weltteile des Reiches, insgesamt',
        'zehntausende Kilometer, mit Lagerhäusern, Hängebrücken und Läufern,',
        'die Nachrichten in Knotenschnüren weitertrugen. Ein Reich von rund',
        'zehn Millionen Menschen, verwaltet ohne Schrift, ohne Rad und ohne',
        'Geld. Als Pizarro im November 1533 einzog, war das Reich bereits durch',
        'Seuche und Bürgerkrieg erschüttert. Aber es war nicht zu Ende: 1536',
        'belagerte Manco Inca Cusco monatelang, und ein Inka-Staat in',
        'Vilcabamba hielt sich bis 1572. Die Erzählung vom Reich, das in einem',
        'Jahr zusammenbrach, ist zu einfach.',
      ].join(' '),
    },
  ],

  bewegungen: [
    {
      id: 'kolumbus',
      name: 'Kolumbus über den Atlantik (1492)',
      von: p(-6.9, 37.23),
      ueber: [p(-16.0, 28.2), p(-35.0, 25.5), p(-55.0, 24.5), p(-68.0, 24.2)],
      nach: p(-74.48, 24.05),
      text: [
        'Am 3. August 1492 liefen drei Schiffe aus Palos de la Frontera aus.',
        'Der Umweg nach Süden zu den Kanaren war kein Zögern, sondern',
        'Seemannschaft: Erst dort weht der Passat verlässlich nach Westen. Die',
        'eigentliche Überfahrt dauerte 33 Tage, und sie war eine Wette gegen',
        'die Fachleute. Kolumbus hielt die Erde für rund ein Drittel kleiner,',
        'als sie ist — die Gelehrten am Hof rechneten richtiger und rieten ab.',
        'Wäre kein Kontinent im Weg gewesen, wäre die Mannschaft verdurstet.',
        'Am 12. Oktober sichtete ein Matrose Land. Kolumbus fuhr noch dreimal',
        'hinüber und starb 1506 in dem Glauben, er sei vor Asien gewesen.',
      ].join(' '),
    },
    {
      id: 'cortes',
      name: 'Cortés nach Tenochtitlan (1519–1521)',
      von: p(-75.85, 20.02),
      ueber: [p(-86.9, 20.5), p(-96.13, 19.19), p(-98.24, 19.32)],
      nach: p(-99.13, 19.43),
      text: [
        'Im Februar 1519 verließ Hernán Cortés Kuba mit etwa 500 Mann, 16',
        'Pferden und einigen Kanonen — gegen den ausdrücklichen Befehl des',
        'Gouverneurs. An der Küste gründete er Veracruz und machte seine Schiffe',
        'unbrauchbar, damit niemand umkehren konnte. Entschieden wurde der Zug',
        'aber nicht durch Pferde oder Pulver, sondern an der vorletzten Station:',
        'In Tlaxcala kämpften die Spanier zunächst gegen einen Gegner, den sie',
        'kaum besiegen konnten — und schlossen dann ein Bündnis. Die',
        'Tlaxcalteken hatten eigene Gründe: Sie waren seit Jahrzehnten vom',
        'Dreibund bekriegt und tributpflichtig. Beim Sturm auf Tenochtitlan',
        'stellten sie und andere Verbündete die große Mehrheit des Heeres.',
      ].join(' '),
    },
    {
      id: 'pizarro',
      name: 'Pizarro zu den Inka (1531–1533)',
      von: p(-79.53, 8.98),
      ueber: [p(-80.45, -3.57), p(-78.51, -7.16)],
      nach: p(-71.97, -13.52),
      text: [
        'Von Panama aus, der spanischen Stadt am Pazifik, brach Francisco',
        'Pizarro 1531 zum dritten Mal nach Süden auf. Er hatte 168 Mann und 62',
        'Pferde. Am 16. November 1532 traf er in Cajamarca auf Atahualpa, der',
        'gerade den Bürgerkrieg gegen seinen Bruder gewonnen hatte und mit',
        'einem großen, aber unbewaffneten Gefolge kam. Die Spanier eröffneten',
        'das Feuer, nahmen den Inka gefangen und töteten tausende seiner Leute.',
        'Atahualpa ließ ein Zimmer mit Gold und zwei mit Silber füllen; die',
        'Spanier nahmen das Lösegeld und richteten ihn im Juli 1533 trotzdem',
        'hin. Im November zog Pizarro in Cusco ein — mit indigenen Verbündeten,',
        'die im Bürgerkrieg auf der anderen Seite gestanden hatten.',
      ].join(' '),
    },
    {
      id: 'silber',
      name: 'Das Silber von Potosí nach Sevilla (ab 1545)',
      von: p(-65.75, -19.58),
      ueber: [p(-77.15, -12.05), p(-79.53, 8.98), p(-82.36, 23.13), p(-55.0, 31.0), p(-25.0, 35.5)],
      nach: p(-5.98, 37.39),
      text: [
        '1545 fand man im Berg von Potosí Silber — das größte Vorkommen, das',
        'Europa je in die Hände bekam. Um 1610 lebten dort rund 160 000',
        'Menschen, auf 4000 Metern Höhe; Potosí war damit größer als London.',
        'Der Weg des Silbers führte auf Lamas und Maultieren an die Küste, per',
        'Schiff nach Panama, über den Isthmus, mit der Flotte über Havanna nach',
        'Sevilla. Gefördert wurde es in der Mita, einem Zwangsarbeitsdienst, für',
        'den ganze Dörfer ihre Männer stellen mussten; die Sterblichkeit in den',
        'Stollen und in den Quecksilberhütten war hoch. In Europa löste das',
        'Silber eine lange Teuerung aus — und ein Gutteil floss weiter nach',
        'China, wo man dafür Seide und Porzellan bekam.',
      ].join(' '),
    },
  ],

  beschriftungen: [
    { text: 'Mexiko', art: 'land', ...ort(-102.0, 22.0) },
    { text: 'Yucatán', art: 'land', ...ort(-89.5, 19.4) },
    { text: 'Mittelamerika', art: 'land', ...ort(-86.0, 12.6) },
    { text: 'Kuba', art: 'land', ...ort(-79.5, 21.9) },
    { text: 'Peru', art: 'land', ...ort(-75.0, -10.0) },
    { text: 'Anden', art: 'land', drehung: 68, ...ort(-69.6, -16.0) },
    { text: 'Brasilien', art: 'land', ...ort(-45.0, -10.0) },
    { text: 'Iberien', art: 'land', ...ort(-8.0, 40.2) },
    { text: 'Nordwestafrika', art: 'land', ...ort(-12.5, 23.5) },
    { text: 'Kanaren', art: 'land', ...ort(-16.6, 26.4) },
    { text: 'Atlantischer Ozean', art: 'meer', ...ort(-45.0, 15.0) },
    { text: 'Pazifischer Ozean', art: 'meer', ...ort(-104.0, 4.0) },
    { text: 'Golf von Mexiko', art: 'meer', ...ort(-91.0, 25.4) },
    { text: 'Karibisches Meer', art: 'meer', ...ort(-73.0, 15.2) },
    { text: 'Amazonas', art: 'meer', drehung: -6, ...ort(-59.0, -2.6) },
  ],
};

module.exports = karte;
