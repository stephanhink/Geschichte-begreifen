// Die Karte zum Thema „Der Zweite Weltkrieg und die neue Weltordnung" —
// Geschichte in Bewegung.
//
// Die Küstenlinien stehen als echte Längen-/Breitengrade `[lon, lat]` und
// werden von utils/karte-geo.js in SVG-Koordinaten umgerechnet. Wer einen
// Punkt anzweifelt, schlägt ihn im Atlas nach: `[13.4, 52.52]` ist Berlin,
// `[44.42, 48.71]` ist Stalingrad (heute Wolgograd), `[19.22, 50.03]` ist
// Oświęcim/Auschwitz.
//
// Der Ausschnitt: 12° W bis 48° O, 34° N bis 62° N — 700 × 488,2. Das sind
// 11,7 SVG-Einheiten je Längengrad; damit liegt diese Karte im selben Maßstab
// wie die Nordamerika-Karte und ist gröber als die fünf engeren Europakarten.
// Der Betreiber hatte 10° W bis 45° O und 35° N bis 65° N vorgeschlagen; der
// Rahmen steht nach Osten und Süden etwas weiter und nach Norden etwas enger,
// und zwar aus Gründen, die die Vorgabe selbst nennt:
//
//   * Stalingrad liegt auf 44,42° O. Bei 45° O hätte die Stadt, an der dieses
//     Kapitel kippt, am äußersten Bildrand geklebt; bei 48° O hat sie Luft,
//     und die Wolga — der Fluss, an dem der Vormarsch endete — ist auf ihrer
//     ganzen für dieses Kapitel wichtigen Strecke zu sehen.
//   * Rom liegt auf 41,9° N, Kreta auf 35,3° N. Der untere Rand bei 34° N
//     nimmt beide mit und lässt Zypern und die Levanteküste gerade noch ins
//     Bild.
//   * Der obere Rand bei 62° N statt 65° N: Leningrad (59,94° N), Helsinki
//     (60,17° N) und Oslo (59,91° N) liegen darunter, Narvik und Murmansk
//     nicht. Ein Rahmen bis 65° N hätte die Karte um ein Sechstel gestreckt,
//     ohne einen der sieben Info-Punkte zu gewinnen.
//
// Was dieser Ausschnitt kostet, steht hier, damit niemand es für einen Fehler
// hält: Nordafrika liegt bis auf den Küstenstreifen von Marokko bis Tunesien
// unter dem unteren Bildrand — El Alamein (30,8° N) und Tobruk (32,1° N) sind
// nicht zu sehen, der Krieg in der Wüste steht deshalb nur im Text und im
// Hinweis der zweiten Phase. Nordnorwegen, Island und die Konvoirouten nach
// Murmansk liegen über dem oberen Rand.
//
// **Warum nur Europa?** Der Zweite Weltkrieg war ein Weltkrieg, und der
// pazifische Kriegsschauplatz gehört dazu. Er hat in dieser App aber schon
// eine eigene Karte: `karten/usa-weltmacht.js` spannt den Pazifik von 110° O
// bis 110° W und zeigt Pearl Harbor, das Inselspringen und Hiroshima. Diese
// Karte hier zeigt den Schauplatz, den die Perspektive dieses Kapitels selbst
// erlebt hat — die Sicht der Besiegten ist eine europäische Sicht. Beide
// Karten zusammen ergeben den Krieg; jede allein wäre die halbe Welt.
//
// Sechs Festlegungen, die ausdrücklich hierher gehören:
//
//   1. **Die Karte datiert, sie bewertet nicht.** Jede Fläche trägt ihren
//      Zustand mit Jahreszahl im Titel — „Von Deutschland besetzt (1940/41)",
//      „Sowjetische Besatzungszone (ab Juli 1945)". Ob diese Zustände recht
//      oder unrecht waren, entscheidet nicht die Karte; darüber sprechen die
//      Perspektiven, und urteilen die Lernenden selbst.
//   2. **Die politischen Grenzen sind angenähert, nicht vermessen** — anders
//      als die Küstenlinien, die auf echten Atlas-Koordinaten beruhen. Das ist
//      dieselbe Praxis wie bei allen Karten der App. Wer die Aufteilung des
//      besetzten Balkans zwischen Deutschland, Italien, Ungarn und Bulgarien
//      oder den genauen Verlauf der Zonengrenzen von 1945 nachschlagen will,
//      braucht eine Detailkarte; hier genügt die grobe Lage.
//   3. **Eingefärbt wird nur, wo eine Herrschaft mit Grenzen plausibel ist.**
//      Die Nordsee, der Atlantik und das Mittelmeer bleiben leer, obwohl der
//      Krieg auch dort tobte: Eine Fläche behauptet ein Gebiet, und Seekrieg
//      ist kein Gebiet.
//   4. **Stalingrad liegt in keiner Phase im deutschen Machtbereich.** Die
//      6. Armee stand ab September 1942 in der Stadt, erobert hat sie sie nie
//      — die Frontlinie verlief mitten hindurch. Dieselbe Regel wie bei Moskau
//      auf der Napoleon-Karte: Wer irgendwo steht, herrscht dort noch nicht.
//      Aus demselben Grund fehlen Leningrad und Moskau in jeder Phase.
//   5. **Die Ostfront der Phase 2 ist die Linie vom November 1942** — die
//      größte Ausdehnung. Sie ist keine Grenze, sondern eine Frontlinie, und
//      der Titel der Fläche sagt das auch.
//   6. **Auschwitz liegt 1939–1944 auf Gebiet, das das Deutsche Reich 1939
//      annektiert hatte** — nicht im Generalgouvernement. Das ist keine
//      Nebensächlichkeit: Das größte deutsche Vernichtungslager stand auf
//      Boden, den die deutsche Verwaltung als Inland führte.
//
// Reine Daten und Rechnung — keine UI-Importe (Architektur-Regel).

const { KARTENFARBEN, erstelleProjektion, rueckwaerts, verbinde } = require('../../karte-geo');

// ---------------------------------------------------------------------------
// Ausschnitt und Projektion
// ---------------------------------------------------------------------------

const RAHMEN = { minLon: -12, maxLon: 48, minLat: 34, maxLat: 62, breite: 700 };

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

/** Finnlands Küste: vom Bottnischen Meerbusen (über dem Bildrand) nach Leningrad. */
const FINNLAND_KUESTE = [
  [21.5, 63.0], // über dem oberen Bildrand
  [21.4, 62.4],
  [21.3, 61.6],
  [21.5, 61.13], // Rauma
  [21.75, 60.8],
  [22.1, 60.45], // Turku (Åbo)
  [22.4, 60.15],
  [23.0, 59.82], // Hanko
  [24.0, 60.05],
  [24.94, 60.17], // Helsinki
  [25.7, 60.35],
  [26.95, 60.45], // Kotka
  [27.8, 60.55],
  [28.75, 60.72], // Wyborg
  [29.4, 60.3],
  [30.3, 59.94], // Leningrad, an der Newamündung
];

/** Die Ostsee-Ostküste: Leningrad → Danzig. */
const OSTSEE_OST = [
  [30.3, 59.94], // Leningrad
  [29.2, 60.05],
  [28.0, 59.9],
  [27.7, 59.47], // Narva
  [26.4, 59.48],
  [25.2, 59.6],
  [24.75, 59.44], // Tallinn
  [23.9, 59.2],
  [23.3, 58.55],
  [24.0, 58.3],
  [24.5, 57.85], // Pärnu
  [24.4, 57.6],
  [24.1, 57.05], // Riga, an der Düna
  [23.6, 56.95],
  [23.1, 57.15],
  [22.6, 57.75], // Kap Kolka
  [21.7, 57.5],
  [21.05, 56.55], // Libau
  [20.95, 56.05],
  [21.05, 55.7], // Memel
  [20.9, 55.3],
  [20.5, 55.0],
  [19.9, 54.65], // Pillau, der Hafen Königsbergs
  [19.3, 54.55],
  [18.9, 54.65],
  [18.65, 54.35], // Danzig, an der Weichselmündung
];

/** Die Ostsee-Südküste: Danzig → Kiel. */
const OSTSEE_SUED = [
  [18.65, 54.35],
  [18.45, 54.75],
  [17.9, 54.8],
  [17.3, 54.75],
  [16.7, 54.55],
  [16.2, 54.25],
  [15.58, 54.18], // Kolberg
  [14.9, 54.05],
  [14.25, 53.92], // Swinemünde
  [13.75, 54.05],
  [13.4, 54.15],
  [13.1, 54.31], // Stralsund
  [12.6, 54.15],
  [12.1, 54.18], // Rostock
  [11.5, 54.15],
  [11.46, 53.9], // Wismar
  [10.87, 53.87], // Lübeck
  [10.75, 54.1],
  [10.4, 54.2],
  [10.13, 54.33], // Kiel
];

/** Jütlands Ostküste: Kiel → Skagen. */
const JUETLAND_OST = [
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
  [10.5, 57.3],
  [10.6, 57.75], // Skagen
];

/** Jütlands Westküste: Skagen → Elbmündung. */
const JUETLAND_WEST = [
  [10.6, 57.75],
  [9.96, 57.59], // Hirtshals
  [9.2, 57.15],
  [8.6, 56.9],
  [8.22, 56.7], // Thyborøn
  [8.13, 56.2],
  [8.3, 55.8],
  [8.45, 55.47], // Esbjerg
  [8.4, 55.1],
  [8.66, 54.91], // die deutsch-dänische Grenze von 1920 an der Nordsee
  [9.05, 54.48], // Husum
  [8.85, 54.2],
  [8.7, 53.87], // die Elbmündung
];

/** Die Nordseeküste: Elbmündung → Zuiderzee → Rheinmündung → Calais. */
const NORDSEE = [
  [8.7, 53.87],
  [8.5, 53.6], // die Wesermündung
  [8.15, 53.5],
  [7.2, 53.6], // die Emsmündung
  [6.8, 53.45],
  [6.2, 53.45],
  [5.6, 53.4],
  [5.4, 52.9],
  [5.3, 52.5],
  [5.05, 52.35],
  [4.9, 52.45],
  [5.0, 52.75],
  [5.1, 52.9],
  [4.75, 52.96], // Den Helder
  [4.6, 52.6],
  [4.5, 52.3],
  [4.2, 51.95], // die Rheinmündung bei Rotterdam
  [3.9, 51.65],
  [3.4, 51.45], // die Scheldemündung
  [2.9, 51.25], // Ostende
  [2.4, 51.1], // Dünkirchen
  [1.6, 50.95], // Calais
];

/** Die Atlantikküste Frankreichs: Calais → Bidassoa. */
const FRANKREICH_ATLANTIK = [
  [1.6, 50.95],
  [1.55, 50.7], // Boulogne
  [1.08, 49.93], // Dieppe
  [0.65, 49.7],
  [0.2, 49.5], // die Seinemündung, Le Havre
  [-0.3, 49.3],
  [-1.0, 49.35],
  [-1.6, 49.65], // Cherbourg
  [-1.85, 49.5],
  [-1.55, 49.0],
  [-1.85, 48.6],
  [-2.5, 48.55],
  [-3.0, 48.85],
  [-4.0, 48.7],
  [-4.7, 48.4], // Brest
  [-4.4, 47.95],
  [-3.5, 47.75],
  [-2.9, 47.5],
  [-2.2, 47.28], // die Loiremündung
  [-1.8, 46.7],
  [-1.2, 46.3], // La Rochelle
  [-1.1, 45.6], // die Gironde
  [-1.25, 44.6], // Arcachon
  [-1.5, 43.5], // Biarritz
  [-1.78, 43.35], // die Bidassoa, die spanische Grenze
];

/** Die Atlantikküste der Iberischen Halbinsel: Bidassoa → Tarifa. */
const IBERIEN_ATLANTIK = [
  [-1.78, 43.35],
  [-2.2, 43.32],
  [-2.95, 43.35], // Bilbao
  [-3.8, 43.45],
  [-4.5, 43.4],
  [-5.2, 43.55],
  [-5.66, 43.57], // Gijón
  [-6.6, 43.6],
  [-7.4, 43.7],
  [-7.86, 43.77], // Kap Ortegal
  [-8.3, 43.6],
  [-8.4, 43.37], // A Coruña
  [-8.9, 43.3],
  [-9.18, 43.15],
  [-9.27, 42.91], // Kap Finisterre
  [-8.87, 42.6],
  [-8.8, 42.24],
  [-8.87, 41.87], // die Minhomündung
  [-8.78, 41.5],
  [-8.68, 41.15], // Porto
  [-8.85, 40.6], // Aveiro
  [-8.9, 40.15],
  [-9.35, 39.35], // Peniche
  [-9.42, 38.9],
  [-9.5, 38.78], // Cabo da Roca
  [-9.25, 38.68], // Lissabon
  [-8.9, 38.5], // Setúbal
  [-8.8, 38.0], // Sines
  [-8.9, 37.4],
  [-8.99, 37.02], // Kap São Vicente
  [-8.3, 37.1],
  [-7.93, 37.0], // Faro
  [-7.4, 37.17], // die Guadianamündung
  [-6.95, 37.2], // Huelva
  [-6.35, 36.85],
  [-6.29, 36.53], // Cádiz
  [-5.9, 36.15],
  [-5.61, 36.0], // Tarifa
];

/** Die Mittelmeerküste der Iberischen Halbinsel: Tarifa → Cap de Creus. */
const IBERIEN_MITTELMEER = [
  [-5.61, 36.0],
  [-5.35, 36.14], // Gibraltar
  [-5.0, 36.42],
  [-4.42, 36.71], // Málaga
  [-3.7, 36.72],
  [-3.0, 36.74],
  [-2.19, 36.72], // Kap de Gata
  [-1.8, 37.0],
  [-1.32, 37.56],
  [-0.69, 37.63], // Kap de Palos
  [-0.5, 38.2],
  [-0.48, 38.35], // Alicante
  [0.19, 38.75], // Kap de la Nao
  [0.0, 39.0],
  [-0.32, 39.47], // Valencia
  [0.2, 40.0],
  [0.87, 40.72], // das Ebrodelta
  [1.2, 41.1],
  [2.17, 41.38], // Barcelona
  [2.8, 41.7],
  [3.2, 41.9],
  [3.28, 42.32], // Cap de Creus
];

/** Die Mittelmeerküste Frankreichs: Cap de Creus → Genua. */
const FRANKREICH_MITTELMEER = [
  [3.28, 42.32],
  [3.05, 43.0], // der Golfe du Lion
  [3.7, 43.4], // Sète
  [4.4, 43.45],
  [4.85, 43.35], // das Rhônedelta
  [5.36, 43.3], // Marseille
  [6.0, 43.1], // Toulon
  [6.6, 43.15],
  [7.07, 43.56],
  [7.6, 43.8], // Nizza
  [8.3, 44.15],
  [8.95, 44.4], // Genua
];

/** Die Westküste Italiens: Genua → Straße von Messina. */
const ITALIEN_WEST = [
  [8.95, 44.4],
  [9.6, 44.15],
  [10.1, 43.9],
  [10.3, 43.65], // die Arnomündung bei Pisa
  [10.5, 43.0], // Piombino
  [11.15, 42.4],
  [11.8, 42.1], // Civitavecchia
  [12.25, 41.75], // Ostia, der Hafen Roms
  [12.9, 41.25], // Terracina
  [13.6, 41.2], // Gaeta
  [14.0, 40.85], // der Golf von Neapel
  [14.45, 40.63],
  [14.9, 40.6], // Salerno
  [15.3, 40.0],
  [15.6, 39.9], // Sapri
  [15.8, 39.4],
  [16.1, 38.9],
  [15.9, 38.4],
  [15.65, 38.27], // Capo Peloro
];

/** Die Südküste Italiens: Straße von Messina → Bari. */
const ITALIEN_SUED = [
  [15.65, 38.27],
  [16.0, 37.93], // Capo Spartivento
  [16.55, 38.3],
  [17.13, 38.92], // Capo Rizzuto
  [16.95, 39.35],
  [16.5, 39.65], // der Golf von Tarent
  [17.0, 40.45], // Tarent
  [17.98, 40.05], // Gallipoli in Apulien
  [18.36, 39.79], // Capo Santa Maria di Leuca
  [18.5, 40.15], // Otranto
  [17.94, 40.64], // Brindisi
  [16.87, 41.13], // Bari
];

/** Die Adriaküste Italiens: Bari → Triest. */
const ITALIEN_ADRIA = [
  [16.87, 41.13],
  [16.18, 41.9], // der Gargano
  [15.5, 41.9],
  [14.9, 42.1],
  [14.2, 42.5],
  [13.7, 42.9],
  [13.5, 43.6], // Ancona
  [13.0, 43.9],
  [12.6, 44.1], // Rimini
  [12.3, 44.8], // das Podelta
  [12.3, 45.35], // die Lagune von Venedig
  [12.5, 45.5],
  [13.1, 45.6],
  [13.65, 45.7], // Triest
];

/** Die Ostküste der Adria: Triest → Vlora. */
const BALKAN_ADRIA = [
  [13.65, 45.7],
  [13.75, 45.5],
  [13.9, 44.9], // Istrien
  [14.5, 45.3], // die Kvarner-Bucht
  [15.0, 44.3],
  [15.9, 43.7], // Šibenik
  [16.45, 43.5], // Split
  [17.3, 42.9],
  [18.1, 42.6], // Dubrovnik
  [18.55, 42.4], // die Bucht von Kotor
  [19.1, 42.09], // Bar
  [19.5, 41.31], // Durrës
  [19.35, 40.9],
  [19.49, 40.46], // Vlora
];

/** Die griechische Küste: Vlora → Peloponnes → Athen → Thrakien → Gallipoli. */
const GRIECHENLAND_KUESTE = [
  [19.49, 40.46],
  [20.0, 39.87], // Sarandë, gegenüber Korfu
  [20.75, 38.96], // Preveza
  [21.15, 38.35],
  [21.4, 38.15], // der Golf von Patras, Südseite
  [21.4, 37.65],
  [21.7, 37.05], // Methoni, der Südwestzipfel des Peloponnes
  [22.15, 36.8],
  [22.48, 36.39], // Kap Tainaron, der südlichste Punkt des Festlands
  [22.75, 36.8],
  [23.0, 36.75], // Kap Maleas
  [23.1, 37.3],
  [22.85, 37.55], // Nafplio
  [23.15, 37.7],
  [23.0, 37.93], // der Isthmus von Korinth
  [23.55, 37.9], // Piräus
  [24.0, 38.0], // Kap Sounion
  [23.85, 38.4],
  [23.3, 38.9],
  [22.95, 39.35], // der Golf von Volos
  [22.6, 39.9],
  [22.85, 40.45],
  [22.94, 40.64], // Thessaloniki
  [23.4, 40.4],
  [23.9, 40.25], // die Chalkidiki, vereinfacht
  [24.4, 40.94], // Kavala
  [25.2, 40.85],
  [25.87, 40.85], // Alexandroupoli
  [26.2, 40.35], // die Halbinsel Gallipoli
];

/**
 * Kleinasien und die Levante: Çanakkale → Ägäis → Mittelmeer → syrische Küste.
 *
 * Der Sprung von Gallipoli (26,2° O) nach Çanakkale (26,4° O) überquert die
 * Dardanellen. Die Meerenge ist an ihrer schmalsten Stelle 1,3 Kilometer breit
 * — bei 11,7 SVG-Einheiten je Längengrad wäre sie ein Zehntel Einheit. Das
 * Marmarameer liegt deshalb als eigene Wasserfläche über dem Land.
 */
const KLEINASIEN_KUESTE = [
  [26.4, 40.15], // Çanakkale, an den Dardanellen
  [26.2, 39.6],
  [26.7, 39.3],
  [26.85, 39.0],
  [26.7, 38.7],
  [26.9, 38.42], // Izmir
  [27.26, 37.86],
  [27.3, 37.5],
  [27.4, 37.03], // Bodrum
  [28.2, 36.65], // Marmaris
  [29.1, 36.2], // Fethiye
  [30.0, 36.25],
  [30.6, 36.85], // Antalya
  [31.5, 36.8],
  [32.8, 36.1], // Anamur
  [33.9, 36.3],
  [34.6, 36.8], // Mersin
  [35.6, 36.6],
  [36.2, 36.6], // İskenderun
  [35.9, 36.0],
  [35.78, 35.52], // Latakia
  [35.9, 34.9],
  [35.6, 34.4], // Tripoli im Libanon
  [35.5, 34.0], // am unteren Bildrand — Beirut liegt knapp darunter
];

/** Die Nordküste Norwegens? Nein: die Westküste, von über dem Bildrand nach Süden. */
const NORWEGEN_WEST = [
  [4.5, 62.6], // über dem oberen Bildrand
  [5.0, 62.0],
  [5.2, 61.5],
  [5.0, 61.1],
  [5.3, 60.4], // Bergen
  [5.2, 59.6],
  [5.7, 58.95], // Stavanger
  [6.6, 58.3],
  [7.05, 57.99], // Lindesnes, Norwegens Südspitze
  [8.0, 58.15],
  [9.0, 58.7],
  [10.0, 59.05],
  [10.75, 59.91], // Oslo, am Ende des Oslofjords
  [11.4, 59.2],
  [11.1, 58.9], // Svinesund, die Grenze zu Schweden
];

/** Schwedens Küste: Svinesund → Skåne → Ostküste → über den oberen Bildrand. */
const SCHWEDEN_KUESTE = [
  [11.1, 58.9],
  [11.4, 58.35],
  [11.95, 57.7], // Göteborg
  [12.25, 57.25], // Varberg
  [12.85, 56.65], // Halmstad
  [12.5, 56.3],
  [12.8, 56.0], // Helsingborg
  [12.7, 55.55], // Malmö, am Öresund
  [13.0, 55.38], // Trelleborg
  [13.6, 55.38],
  [14.35, 55.4], // Sandhammaren
  [14.2, 55.85],
  [14.7, 56.1],
  [15.6, 56.2], // Karlskrona
  [16.2, 56.5],
  [16.45, 56.9], // der Kalmarsund
  [16.5, 57.3],
  [16.75, 57.9], // Västervik
  [17.0, 58.6],
  [17.6, 58.9],
  [18.1, 59.33], // Stockholm
  [17.5, 60.0],
  [17.9, 60.67], // Gävle
  [17.4, 61.3],
  [17.2, 61.7],
  [17.4, 62.6], // über dem oberen Bildrand
];

/** Britanniens Ostküste: Duncansby Head → Dover. */
const BRITANNIEN_OST = [
  [-3.9, 58.6], // Duncansby Head
  [-2.9, 58.4],
  [-2.1, 57.7],
  [-2.1, 57.15], // Aberdeen
  [-2.45, 56.7], // Montrose
  [-2.85, 56.45],
  [-3.4, 56.35],
  [-2.9, 56.2],
  [-2.6, 56.05],
  [-3.2, 56.0], // der Firth of Forth bei Edinburgh
  [-2.4, 55.95],
  [-1.9, 55.65], // Berwick
  [-1.6, 55.05], // Tynemouth
  [-1.35, 54.65],
  [-0.55, 54.5], // Whitby
  [-0.1, 54.15], // Flamborough Head
  [-0.05, 53.65], // die Humbermündung
  [0.2, 53.5],
  [0.1, 52.95], // The Wash
  [0.6, 52.8],
  [1.35, 52.95], // Cromer
  [1.75, 52.65], // Great Yarmouth
  [1.6, 52.1],
  [1.3, 51.95], // Harwich
  [0.95, 51.5], // die Themsemündung
  [1.4, 51.38], // Margate
  [1.4, 51.1], // Dover
];

/** Britanniens Südküste: Dover → Land’s End. */
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
  [-5.72, 50.07], // Land’s End
];

/** Britanniens Westküste: Land’s End → Cape Wrath. */
const BRITANNIEN_WEST = [
  [-5.72, 50.07],
  [-4.2, 51.2],
  [-3.4, 51.25],
  [-2.7, 51.5], // der Grund des Bristolkanals
  [-3.9, 51.6], // Swansea
  [-5.05, 51.7], // Milford Haven
  [-4.6, 52.3],
  [-4.3, 53.3], // Anglesey
  [-3.0, 53.4], // die Merseymündung
  [-3.05, 54.1],
  [-3.5, 54.9], // der Solway Firth
  [-4.9, 54.6],
  [-5.0, 55.3],
  [-5.6, 56.2],
  [-5.5, 57.0],
  [-5.2, 57.6],
  [-5.0, 58.6], // Cape Wrath
];

/** Irland. */
const IRLAND = [
  [-6.0, 55.2],
  [-5.55, 54.7], // Belfast Lough
  [-5.55, 54.25],
  [-6.1, 53.9],
  [-6.25, 53.35], // Dublin
  [-6.05, 52.9],
  [-6.35, 52.35], // Wexford
  [-7.1, 52.1],
  [-7.9, 51.95],
  [-8.3, 51.7], // Cork
  [-9.1, 51.55],
  [-9.82, 51.45], // Mizen Head
  [-10.3, 51.85],
  [-9.9, 52.15],
  [-9.3, 52.6], // die Shannonmündung
  [-9.6, 53.0],
  [-9.9, 53.35], // Galway
  [-9.5, 53.8],
  [-9.9, 54.2], // Achill
  [-8.9, 54.3],
  [-8.6, 54.55], // Sligo
  [-8.8, 54.9],
  [-8.2, 55.15],
  [-7.37, 55.38], // Malin Head
  [-6.9, 55.2],
];

/** Die Küste Nordwestafrikas: Tanger → Mahdia. */
const NORDAFRIKA = [
  [-5.93, 35.79], // Tanger
  [-5.3, 35.9], // Ceuta
  [-4.3, 35.2],
  [-3.93, 35.25],
  [-3.0, 35.3],
  [-2.3, 35.1],
  [-1.4, 35.4],
  [-0.64, 35.7], // Oran
  [0.15, 35.9],
  [1.0, 36.5],
  [2.0, 36.6],
  [3.06, 36.78], // Algier
  [4.0, 36.9],
  [5.07, 36.75], // Bejaia
  [6.0, 36.9],
  [6.9, 37.05],
  [7.77, 36.9], // Annaba
  [8.7, 36.95],
  [9.87, 37.28], // Bizerta
  [10.3, 37.05],
  [10.18, 36.8], // Tunis
  [10.55, 36.75],
  [11.03, 37.08], // Kap Bon
  [10.8, 36.5],
  [10.6, 36.4],
  [10.5, 35.9],
  [10.64, 35.83], // Sousse
  [10.9, 35.6],
  [11.07, 35.2], // Mahdia
];

// ---------------------------------------------------------------------------
// Binnenmeere und Seen
// ---------------------------------------------------------------------------

/**
 * Das Schwarze Meer mit dem Asowschen Meer — als eigene Wasserfläche über der
 * Landmasse, wie bei der Kolonien-Karte. Der Ring folgt der Küste: erst am
 * Bosporus nach Norden, dann um die Krim und das Asowsche Meer, an der
 * Kaukasusküste hinunter nach Batumi und an Anatoliens Nordküste zurück.
 */
const SCHWARZES_MEER = [
  [29.1, 41.2], // der Bosporus
  [28.0, 41.6],
  [27.5, 42.1],
  [27.85, 42.7],
  [27.9, 43.2], // Warna
  [28.15, 43.7],
  [28.6, 44.2], // Constanța
  [29.0, 44.7],
  [29.7, 45.2], // das Donaudelta
  [30.3, 45.9],
  [30.4, 46.3], // die Mündung des Dnjestr
  [30.75, 46.48], // Odessa
  [31.5, 46.6],
  [32.0, 46.5], // die Mündung des Dnjepr
  [32.6, 46.1],
  [33.6, 46.15],
  [33.5, 45.4],
  [33.4, 44.6], // Sewastopol
  [34.2, 44.4],
  [35.4, 44.9], // Feodossija
  [36.5, 45.35], // Kertsch
  [35.9, 45.6],
  [35.0, 45.4],
  [34.6, 45.8],
  [35.1, 46.2],
  [36.0, 46.4],
  [37.3, 46.9],
  [38.9, 47.2], // Taganrog, am Asowschen Meer
  [39.3, 47.1],
  [38.9, 46.6],
  [38.2, 46.2],
  [37.4, 46.1],
  [38.3, 45.3],
  [37.3, 45.2],
  [36.8, 45.3],
  [37.0, 44.9],
  [37.8, 44.7], // Noworossijsk
  [39.0, 44.0],
  [39.7, 43.6], // Sotschi
  [40.5, 43.0],
  [41.65, 41.65], // Batumi
  [41.0, 41.3],
  [40.6, 41.1],
  [39.7, 41.0], // Trapezunt
  [38.4, 41.0],
  [37.3, 41.3],
  [36.33, 41.3], // Samsun
  [36.0, 41.7],
  [35.15, 42.03], // Sinop
  [34.0, 41.95],
  [33.3, 42.0],
  [32.3, 41.8],
  [31.4, 41.15],
  [30.0, 41.2],
];

/** Das Marmarameer mit den Dardanellen. */
const MARMARAMEER = [
  [29.05, 41.05],
  [28.5, 40.95],
  [27.9, 40.75],
  [27.2, 40.6],
  [26.7, 40.45],
  [26.35, 40.15],
  [26.25, 40.05],
  [26.55, 40.2],
  [27.1, 40.35],
  [28.2, 40.35],
  [29.0, 40.4],
  [29.35, 40.75],
];

/**
 * Das Kaspische Meer — nur sein Westrand liegt im Bild. Der Ring schließt sich
 * östlich des rechten Bildrands; was dort fehlt, schneidet die SVG-Fläche ab.
 */
const KASPISCHES_MEER = [
  [48.2, 46.7],
  [47.8, 46.0],
  [47.6, 45.0],
  [47.5, 44.0],
  [47.55, 43.2],
  [47.8, 42.5],
  [48.4, 41.8],
  [49.0, 41.0],
  [49.5, 40.3],
  [49.5, 47.3],
  [48.7, 47.1],
];

/**
 * Der Ladogasee — auf dieser Karte kein Zierrat: Über sein Eis lief im Winter
 * 1941/42 die einzige Verbindung ins eingeschlossene Leningrad.
 */
const LADOGASEE = [
  [30.0, 60.0],
  [29.9, 60.6],
  [30.3, 61.0],
  [30.9, 61.4],
  [31.6, 61.5],
  [32.5, 61.3],
  [32.9, 60.9],
  [32.3, 60.4],
  [31.6, 60.1],
  [30.9, 59.95],
];

// ---------------------------------------------------------------------------
// Inseln
// ---------------------------------------------------------------------------

const KORSIKA = [
  [9.35, 42.98],
  [9.45, 42.7],
  [9.53, 42.3],
  [9.4, 41.8],
  [9.15, 41.38], // Bonifacio
  [8.8, 41.5],
  [8.74, 41.92], // Ajaccio
  [8.55, 42.3],
  [8.65, 42.6],
  [9.2, 42.9],
];

const SARDINIEN = [
  [9.18, 41.25],
  [9.55, 41.15],
  [9.6, 40.85],
  [9.7, 40.55],
  [9.55, 40.1],
  [9.7, 39.5],
  [9.5, 39.15],
  [9.13, 39.2], // Cagliari
  [8.65, 38.95],
  [8.4, 39.2],
  [8.4, 39.9],
  [8.2, 40.35],
  [8.3, 40.85],
  [8.7, 41.1],
];

const SIZILIEN = [
  [12.43, 37.8], // Marsala
  [12.73, 38.18],
  [13.36, 38.13], // Palermo
  [14.0, 38.05],
  [14.7, 38.03],
  [15.24, 38.25], // Messina
  [15.6, 38.25],
  [15.3, 37.85],
  [15.09, 37.5], // Catania
  [15.29, 37.07], // Syrakus
  [15.14, 36.68], // Kap Passero
  [14.5, 36.8],
  [14.25, 37.07], // Gela
  [13.58, 37.28], // Agrigent
  [13.08, 37.5],
  [12.6, 37.65],
];

const KRETA = [
  [23.55, 35.5],
  [24.0, 35.6],
  [24.8, 35.4],
  [25.7, 35.4],
  [26.3, 35.3],
  [26.0, 35.05],
  [25.0, 34.9],
  [24.0, 35.0],
  [23.5, 35.2],
];

const RHODOS = [
  [27.7, 36.45],
  [28.25, 36.45],
  [28.25, 36.15],
  [27.85, 35.87],
  [27.7, 36.1],
];

const ZYPERN = [
  [32.3, 35.05],
  [32.9, 35.4],
  [33.5, 35.35],
  [34.0, 35.6],
  [34.6, 35.7],
  [34.0, 35.1],
  [33.0, 34.85],
  [32.4, 34.75],
];

const MALTA = [
  [14.2, 35.95],
  [14.55, 35.95],
  [14.57, 35.8],
  [14.2, 35.82],
];

const MALLORCA = [
  [2.35, 39.55],
  [2.8, 39.85],
  [3.15, 39.95],
  [3.45, 39.75],
  [3.35, 39.35],
  [2.95, 39.3],
  [2.5, 39.4],
];

const SJAELLAND = [
  [12.3, 56.12],
  [12.6, 56.04], // Helsingør
  [12.6, 55.68], // Kopenhagen
  [12.25, 55.4],
  [11.9, 55.0],
  [11.5, 55.2],
  [11.14, 55.33], // Korsør
  [11.1, 55.68],
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

const LOLLAND = [
  [11.0, 54.77],
  [11.6, 54.65],
  [12.0, 54.68],
  [12.15, 54.9],
  [11.9, 55.0],
  [11.4, 54.95],
  [11.05, 54.9],
];

const BORNHOLM = [
  [14.7, 55.1],
  [14.75, 55.28],
  [15.1, 55.3],
  [15.15, 55.05],
  [14.85, 54.98],
];

const GOTLAND = [
  [18.15, 57.95],
  [18.75, 57.85],
  [19.0, 57.35],
  [18.85, 57.0],
  [18.2, 56.95],
  [18.1, 57.35],
  [18.0, 57.7],
];

// ---------------------------------------------------------------------------
// Flüsse
// ---------------------------------------------------------------------------

const RHEIN = [
  [9.5, 47.5], // der Bodensee
  [8.6, 47.6],
  [7.6, 47.6], // Basel
  [7.8, 48.6], // gegenüber Straßburg
  [8.3, 50.0], // Mainz
  [7.6, 50.4], // Koblenz
  [6.95, 50.94], // Köln
  [6.7, 51.4],
  [6.1, 51.85],
  [4.6, 51.9],
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
  [19.05, 47.5], // Budapest
  [19.6, 46.0],
  [20.5, 44.8], // Belgrad
  [22.5, 44.6], // das Eiserne Tor
  [24.0, 43.8],
  [26.0, 44.0],
  [27.9, 44.5],
  [29.7, 45.2], // das Donaudelta
];

const ELBE = [
  [14.4, 50.55],
  [13.74, 51.05], // Dresden
  [12.99, 51.56], // Torgau
  [12.65, 51.87], // Wittenberg
  [11.63, 52.13], // Magdeburg
  [11.0, 53.0],
  [10.0, 53.55], // Hamburg
  [9.2, 53.85],
  [8.7, 53.87],
];

const ODER = [
  [17.6, 49.6],
  [17.03, 51.11], // Breslau
  [15.0, 52.0],
  [14.55, 52.35], // Frankfurt an der Oder
  [14.6, 52.9],
  [14.55, 53.43], // Stettin
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
  [18.65, 54.35], // die Mündung bei Danzig
];

const SEINE = [
  [3.5, 48.4],
  [2.35, 48.86], // Paris
  [1.4, 49.1],
  [0.7, 49.4],
  [0.2, 49.5], // Le Havre
];

const LOIRE = [
  [4.0, 46.5],
  [2.9, 47.3],
  [1.9, 47.4],
  [0.7, 47.4],
  [-0.55, 47.35],
  [-1.55, 47.25],
  [-2.2, 47.28],
];

const PO = [
  [7.7, 45.05], // Turin
  [8.9, 45.1],
  [9.7, 45.15],
  [10.9, 45.0],
  [11.6, 44.95],
  [12.3, 44.95],
  [12.45, 44.85],
];

const THEMSE = [
  [-1.7, 51.7],
  [-0.5, 51.6],
  [-0.13, 51.51], // London
  [0.6, 51.5],
  [0.95, 51.5],
];

const DNJEPR = [
  [31.0, 53.2],
  [30.98, 52.1],
  [30.5, 51.5],
  [30.5, 50.45], // Kiew
  [31.5, 49.4],
  [33.4, 48.5], // Krementschuk
  [35.05, 48.45], // Dnjepropetrowsk
  [35.3, 47.85], // Saporischschja
  [33.5, 46.6],
  [32.0, 46.5],
];

const DON = [
  [38.3, 54.0],
  [39.2, 51.67], // Woronesch
  [40.0, 50.5],
  [41.5, 49.5],
  [43.2, 48.75], // der Donbogen bei Kalatsch
  [42.8, 48.2],
  [41.5, 47.7],
  [40.4, 47.5],
  [39.7, 47.25], // Rostow am Don
];

/** Die Wolga — der Fluss, an dem der deutsche Vormarsch 1942 endete. */
const WOLGA = [
  [33.0, 57.4],
  [35.9, 56.86], // Twer
  [37.5, 57.2],
  [39.9, 57.6], // Jaroslawl
  [43.0, 56.4],
  [44.0, 56.33], // Nischni Nowgorod
  [46.0, 55.5],
  [47.8, 55.3],
  [48.6, 55.0],
  [48.3, 54.0],
  [47.5, 53.0],
  [46.0, 51.55], // Saratow
  [45.5, 50.5],
  [44.8, 49.5],
  [44.5, 48.71], // Stalingrad
  [45.4, 48.3],
  [46.5, 47.5],
  [47.5, 46.8],
  [48.03, 46.35], // Astrachan
];

// ---------------------------------------------------------------------------
// Werkzeug: Küstenabschnitte nach Orten schneiden (wie bei den übrigen Karten)
// ---------------------------------------------------------------------------

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

const kueste = (liste, von, bis) => {
  const a = naechsterIndex(liste, von[0], von[1]);
  const b = naechsterIndex(liste, bis[0], bis[1]);
  return a <= b ? liste.slice(a, b + 1) : rueckwaerts(liste.slice(b, a + 1));
};

// ---------------------------------------------------------------------------
// Die Landmassen (Untergrund)
// ---------------------------------------------------------------------------

/**
 * Der Kontinent — Europa, Kleinasien und die Levante als eine Landmasse.
 *
 * Das Schwarze Meer, das Marmarameer, das Kaspische Meer und der Ladogasee
 * liegen anschließend als eigene Wasserflächen darüber; deshalb muss der Ring
 * sie nicht umfahren.
 */
const KONTINENT = verbinde(
  FINNLAND_KUESTE,
  OSTSEE_OST,
  OSTSEE_SUED,
  JUETLAND_OST,
  JUETLAND_WEST,
  NORDSEE,
  FRANKREICH_ATLANTIK,
  IBERIEN_ATLANTIK,
  IBERIEN_MITTELMEER,
  FRANKREICH_MITTELMEER,
  ITALIEN_WEST,
  ITALIEN_SUED,
  ITALIEN_ADRIA,
  BALKAN_ADRIA,
  GRIECHENLAND_KUESTE,
  KLEINASIEN_KUESTE,
  // Rückweg außerhalb des Bildes: unter dem unteren Rand nach Osten, am
  // rechten Rand hinauf, über dem oberen Rand nach Westen.
  [
    [36.5, 33.0],
    [49.5, 33.0],
    [49.5, 63.0],
    [21.5, 63.0],
  ],
);

const SKANDINAVIEN = verbinde(NORWEGEN_WEST, SCHWEDEN_KUESTE, [
  [17.4, 63.0],
  [4.5, 63.0],
]);

const BRITANNIEN = verbinde(BRITANNIEN_OST, BRITANNIEN_SUED, BRITANNIEN_WEST);

const AFRIKA = verbinde(NORDAFRIKA, [
  [11.5, 33.0],
  [-6.5, 33.0],
  [-6.3, 35.2],
]);

// ---------------------------------------------------------------------------
// Politische Grenzen — angenähert (siehe Kopf der Datei, Punkt 2)
// ---------------------------------------------------------------------------

/** Die Grenze des Deutschen Reiches zu den Niederlanden. */
const GRENZE_NIEDERLANDE = [
  [7.2, 53.6],
  [7.05, 52.85],
  [7.05, 52.4],
  [6.7, 52.2],
  [6.4, 51.9],
  [6.05, 51.9],
  [6.2, 51.6],
  [5.95, 51.05],
  [6.02, 50.75], // das Dreiländereck bei Aachen
];

/** Die Grenze zu Belgien (mit Eupen und Malmedy auf belgischer Seite, 1920). */
const GRENZE_BELGIEN = [
  [6.02, 50.75],
  [6.25, 50.6],
  [6.35, 50.4],
  [6.15, 50.15],
];

/** Die Grenze zu Luxemburg — Our und Sauer. */
const GRENZE_LUXEMBURG = [
  [6.15, 50.15],
  [6.4, 49.9],
  [6.5, 49.7],
  [6.37, 49.47], // Perl, das Dreiländereck mit Frankreich
];

/** Die Grenze zu Frankreich, wie sie von 1919 bis 1940 galt. */
const GRENZE_FRANKREICH = [
  [6.37, 49.47],
  [6.6, 49.25],
  [6.75, 49.15],
  [7.05, 49.12],
  [7.45, 49.15],
  [7.8, 49.05],
  [8.13, 48.97], // Lauterburg, wo die Grenze den Rhein erreicht
  [8.0, 48.8],
  [7.8, 48.6],
  [7.6, 48.3],
  [7.55, 48.0],
  [7.6, 47.75],
  [7.58, 47.59], // Basel
];

/** Die Grenze zur Schweiz: Basel → Bodensee → Bregenz. */
const GRENZE_SCHWEIZ = [
  [7.58, 47.59],
  [7.9, 47.55],
  [8.4, 47.6],
  [8.6, 47.8],
  [8.8, 47.7],
  [9.2, 47.65],
  [9.55, 47.53],
  [9.75, 47.6], // Bregenz
];

/** Die Alpengrenze Österreichs zu Italien und Jugoslawien: Bregenz → Ungarn. */
const GRENZE_ALPEN_SUED = [
  [9.75, 47.6],
  [9.6, 47.35],
  [9.55, 47.05],
  [10.1, 46.85], // der Reschenpass
  [10.45, 46.85],
  [11.0, 46.8], // der Brenner
  [12.0, 46.7],
  [12.4, 46.7],
  [13.0, 46.5],
  [13.7, 46.5],
  [14.5, 46.5],
  [15.0, 46.6],
  [15.8, 46.7],
  [16.1, 46.87],
  [16.4, 47.0],
  [16.5, 47.4],
  [17.1, 47.85], // das Dreiländereck mit Ungarn und der Slowakei
];

/** Die Westgrenze der Slowakei — Donau bei Pressburg → Weiße Karpaten. */
const GRENZE_SLOWAKEI_WEST = [
  [17.1, 47.85],
  [16.98, 48.17], // Devín, an der Mündung der March in die Donau
  [17.4, 48.8],
  [18.1, 49.1],
  [18.85, 49.5],
];

/**
 * Die Grenze des Protektorats Böhmen und Mähren, angenähert.
 *
 * Sie ist nicht die alte tschechoslowakische Grenze: Das Sudetenland kam im
 * Oktober 1938 zum Reich, das Protektorat entstand im März 1939 aus dem, was
 * übrig blieb. Der Ring läuft deshalb ein Stück innerhalb der Gebirgsränder.
 */
const PROTEKTORAT_GRENZE = [
  [13.5, 49.25],
  [13.0, 49.75],
  [12.95, 50.15],
  [13.5, 50.35],
  [14.1, 50.55],
  [14.7, 50.55],
  [15.3, 50.45],
  [15.9, 50.35],
  [16.4, 50.2],
  [16.95, 50.05],
  [17.6, 49.9],
  [18.2, 49.85],
  [18.85, 49.5], // das Dreiländereck mit der Slowakei
  [18.1, 49.1],
  [17.4, 48.8],
  [16.98, 48.17],
  [16.6, 48.75],
  [15.9, 48.85],
  [15.2, 48.95],
  [14.9, 48.75],
  [14.4, 48.8],
  [14.0, 48.9],
  [13.85, 49.1],
];

/**
 * Die Nordgrenze des Protektorats, wie das Reich sie von außen berührte —
 * dieselben Punkte wie oben, nur als eigener Abschnitt für den Reichsring.
 */
const PROTEKTORAT_NORDBOGEN = [
  [13.85, 49.1],
  [13.5, 49.25],
  [13.0, 49.75],
  [12.95, 50.15],
  [13.5, 50.35],
  [14.1, 50.55],
  [14.7, 50.55],
  [15.3, 50.45],
  [15.9, 50.35],
  [16.4, 50.2],
  [16.95, 50.05],
  [17.6, 49.9],
  [18.2, 49.85],
  [18.85, 49.5],
];

/** Der Südbogen des Protektorats, vom Dreiländereck zurück zur Donau. */
const PROTEKTORAT_SUEDBOGEN = [
  [16.98, 48.17],
  [16.6, 48.75],
  [15.9, 48.85],
  [15.2, 48.95],
  [14.9, 48.75],
  [14.4, 48.8],
  [14.0, 48.9],
  [13.85, 49.1],
];

/**
 * Die Ostgrenze des Deutschen Reiches 1939–1944 — die Linie, an der die 1939
 * annektierten polnischen Gebiete (Danzig-Westpreußen, der „Reichsgau
 * Wartheland", Ostoberschlesien) an das Generalgouvernement stießen.
 */
const REICH_OSTGRENZE_1939 = [
  [18.85, 49.5],
  [19.3, 49.6],
  [19.5, 50.3],
  [19.7, 51.0],
  [20.0, 51.6],
  [20.3, 52.0],
  [20.6, 52.6],
  [21.3, 53.0],
  [21.9, 53.2],
  [22.85, 53.6], // die alte Ostgrenze Ostpreußens
];

/** Die Ostgrenze Ostpreußens: bis 1939 zu Polen und Litauen, ab 1940 zur Sowjetunion. */
const OSTPREUSSEN_OST = [
  [22.85, 53.6],
  [22.9, 54.1],
  [22.7, 54.4],
  [22.9, 54.8],
  [22.4, 55.05],
  [21.8, 55.15],
  [21.3, 55.27],
  [21.05, 55.7], // die Memel, seit März 1939 wieder Reichsgebiet
];

/** Die deutsch-dänische Grenze von 1920. */
const GRENZE_DAENEMARK = [
  [9.43, 54.79],
  [9.0, 54.85],
  [8.66, 54.91],
];

/**
 * Das Großdeutsche Reich, Stand Sommer 1941 — angenähert.
 *
 * Enthalten sind das Reich in den Grenzen von 1937, Österreich (März 1938),
 * das Sudetenland (Oktober 1938), das Memelgebiet (März 1939), Danzig und die
 * 1939 annektierten Teile Polens. Elsass-Lothringen, Luxemburg und
 * Nordslowenien wurden 1940/41 zwar deutsch verwaltet und faktisch
 * eingegliedert, völkerrechtlich aber nie annektiert; sie liegen auf dieser
 * Karte in der Fläche der besetzten Gebiete.
 */
const REICH_1941 = verbinde(
  GRENZE_NIEDERLANDE,
  GRENZE_BELGIEN,
  GRENZE_LUXEMBURG,
  GRENZE_FRANKREICH,
  GRENZE_SCHWEIZ,
  GRENZE_ALPEN_SUED,
  GRENZE_SLOWAKEI_WEST,
  rueckwaerts(PROTEKTORAT_NORDBOGEN),
  rueckwaerts(PROTEKTORAT_SUEDBOGEN),
  [[16.98, 48.17], [17.1, 47.85]],
  GRENZE_SLOWAKEI_WEST.slice(1),
  REICH_OSTGRENZE_1939.slice(1),
  OSTPREUSSEN_OST.slice(1),
  kueste(OSTSEE_OST, [21.05, 55.7], [10.13, 54.33]),
  kueste(JUETLAND_OST, [10.13, 54.33], [9.43, 54.79]),
  GRENZE_DAENEMARK,
  kueste(JUETLAND_WEST, [8.66, 54.91], [8.7, 53.87]),
  kueste(NORDSEE, [8.7, 53.87], [7.2, 53.6]),
);

const PROTEKTORAT = PROTEKTORAT_GRENZE;

/** Das Generalgouvernement — das besetzte Polen ohne die annektierten Gebiete. */
const GENERALGOUVERNEMENT = [
  [18.85, 49.5],
  [19.3, 49.6],
  [19.5, 50.3],
  [19.7, 51.0],
  [20.0, 51.6],
  [20.3, 52.0],
  [20.6, 52.6],
  [21.3, 53.0],
  [21.9, 53.2],
  [22.85, 53.6],
  [23.2, 52.9],
  [23.6, 52.5],
  [23.9, 51.5],
  [24.0, 50.7],
  [22.8, 49.6],
  [22.5, 49.1],
  [21.5, 49.4],
  [20.5, 49.4],
  [19.6, 49.4],
];

/** Die Landgrenze Frankreichs zu Spanien: Bidassoa → Cap de Creus. */
const GRENZE_PYRENAEEN = [
  [-1.78, 43.35],
  [-0.9, 42.9],
  [0.0, 42.7],
  [0.7, 42.75],
  [1.4, 42.5],
  [2.2, 42.4],
  [3.28, 42.32],
];

/** Frankreichs Landgrenze im Osten: Cap de Creus → Genua → Alpen → Belgien. */
const GRENZE_FRANKREICH_OST = [
  [8.95, 44.4],
  [7.6, 44.15],
  [7.0, 44.85],
  [6.75, 45.15],
  [7.0, 45.5],
  [6.8, 46.05],
  [6.45, 46.35],
  [6.15, 46.2],
  [5.95, 46.5],
  [6.45, 46.8],
  [7.0, 47.5],
  [7.58, 47.59], // Basel
];

/**
 * Die Demarkationslinie vom 22. Juni 1940 — sie teilte Frankreich in eine von
 * der Wehrmacht besetzte Zone im Norden und Westen und eine unbesetzte Zone
 * im Süden, deren Regierung in Vichy saß. Im November 1942 rückte die
 * Wehrmacht auch in die Südzone ein.
 */
const DEMARKATIONSLINIE = [
  [-1.15, 45.4], // die Atlantikküste nördlich der Girondemündung
  [0.2, 45.3],
  [0.9, 45.4],
  [1.6, 45.6],
  [2.2, 46.3],
  [3.1, 46.6],
  [4.0, 46.6],
  [4.85, 46.6],
  [5.5, 46.5],
  [5.95, 46.5],
];

const FRANKREICH_GESAMT = verbinde(
  kueste(FRANKREICH_ATLANTIK, [-1.78, 43.35], [1.6, 50.95]),
  [[2.4, 51.1], [2.9, 50.75], [3.6, 50.5], [4.2, 49.95], [5.0, 49.8], [5.79, 49.54], [6.37, 49.47]],
  rueckwaerts(GRENZE_FRANKREICH),
  rueckwaerts(GRENZE_FRANKREICH_OST),
  rueckwaerts(kueste(FRANKREICH_MITTELMEER, [3.28, 42.32], [8.95, 44.4])),
  rueckwaerts(GRENZE_PYRENAEEN),
);

const FRANKREICH_BESETZT_1940 = verbinde(
  kueste(FRANKREICH_ATLANTIK, [-1.15, 45.4], [1.6, 50.95]),
  [[2.4, 51.1], [2.9, 50.75], [3.6, 50.5], [4.2, 49.95], [5.0, 49.8], [5.79, 49.54], [6.37, 49.47]],
  rueckwaerts(GRENZE_FRANKREICH),
  [[7.58, 47.59], [7.0, 47.5], [6.45, 46.8], [5.95, 46.5]],
  rueckwaerts(DEMARKATIONSLINIE),
);

const FRANKREICH_VICHY = verbinde(
  DEMARKATIONSLINIE,
  [[6.15, 46.2], [6.45, 46.35], [6.8, 46.05], [7.0, 45.5], [6.75, 45.15], [7.0, 44.85], [7.6, 44.15], [8.95, 44.4]],
  rueckwaerts(kueste(FRANKREICH_MITTELMEER, [3.28, 42.32], [8.95, 44.4])),
  rueckwaerts(GRENZE_PYRENAEEN),
  kueste(FRANKREICH_ATLANTIK, [-1.78, 43.35], [-1.15, 45.4]),
);

/** Die Niederlande, Belgien und Luxemburg als ein Ring. */
const BENELUX = verbinde(
  kueste(NORDSEE, [2.4, 51.1], [7.2, 53.6]),
  rueckwaerts(GRENZE_NIEDERLANDE).slice(1),
  rueckwaerts(GRENZE_BELGIEN).slice(1),
  rueckwaerts(GRENZE_LUXEMBURG).slice(1),
  [[5.79, 49.54], [5.0, 49.8], [4.2, 49.95], [3.6, 50.5], [2.9, 50.75]],
);

/** Dänemark: Jütland nördlich der Grenze von 1920 (die Inseln kommen dazu). */
const DAENEMARK_JUETLAND = verbinde(
  rueckwaerts(GRENZE_DAENEMARK),
  kueste(JUETLAND_OST, [9.43, 54.79], [10.6, 57.75]),
  kueste(JUETLAND_WEST, [10.6, 57.75], [8.66, 54.91]),
);

const NORWEGEN = verbinde(NORWEGEN_WEST, [
  [11.6, 59.6],
  [12.5, 60.2],
  [12.2, 61.0],
  [12.8, 61.5],
  [12.2, 62.6],
  [4.5, 62.6],
]);

const SCHWEDEN = verbinde(SCHWEDEN_KUESTE, [
  [17.4, 62.6],
  [12.2, 62.6],
  [12.8, 61.5],
  [12.2, 61.0],
  [12.5, 60.2],
  [11.6, 59.6],
  [11.1, 58.9],
]);

const FINNLAND = verbinde(FINNLAND_KUESTE, [
  [29.8, 60.3],
  [28.5, 61.0],
  [29.5, 61.8],
  [30.5, 62.6],
  [21.5, 62.6],
]);

/** Das Königreich Italien in den Grenzen von 1939 (mit Südtirol und Istrien). */
const ITALIEN = verbinde(
  kueste(FRANKREICH_MITTELMEER, [8.95, 44.4], [8.95, 44.4]),
  ITALIEN_WEST,
  ITALIEN_SUED,
  ITALIEN_ADRIA,
  [
    [13.9, 45.55],
    [14.1, 45.5],
    [14.4, 45.5],
    [14.3, 45.75],
    [13.9, 46.2],
    [13.7, 46.5],
    [13.0, 46.5],
    [12.4, 46.7],
    [12.0, 46.7],
    [11.0, 46.8],
    [10.45, 46.85],
    [10.1, 46.85],
    [9.55, 47.05],
    [9.25, 46.5],
    [8.4, 46.45],
    [8.0, 46.0],
    [7.0, 45.92],
    [6.75, 45.15],
    [7.0, 44.85],
    [7.6, 44.15],
  ],
);

const ALBANIEN = [
  [19.35, 42.05],
  [19.8, 42.2],
  [20.1, 42.55],
  [20.5, 42.2],
  [20.6, 41.8],
  [20.95, 41.4],
  [20.7, 40.9],
  [20.95, 40.5],
  [20.4, 40.05],
  [20.0, 39.87],
  [19.49, 40.46],
  [19.35, 40.9],
  [19.5, 41.31],
  [19.1, 42.09],
];

/** Jugoslawien in den Grenzen von 1939. */
const JUGOSLAWIEN = verbinde(
  kueste(BALKAN_ADRIA, [13.9, 45.55], [19.1, 42.09]),
  rueckwaerts(ALBANIEN).slice(1, 9),
  [
    [21.0, 42.3],
    [22.35, 42.3],
    [22.5, 43.0],
    [22.7, 43.4],
    [22.4, 44.0],
    [22.5, 44.6],
    [21.5, 44.85],
    [20.8, 44.9],
    [20.3, 45.2],
    [19.6, 45.2],
    [19.0, 45.5],
    [18.9, 45.8],
    [17.6, 45.9],
    [16.5, 46.3],
    [16.1, 46.87],
    [15.8, 46.7],
    [15.0, 46.6],
    [14.5, 46.5],
    [13.7, 46.5],
    [13.9, 46.2],
    [14.3, 45.75],
    [14.4, 45.5],
    [14.1, 45.5],
  ],
);

/** Griechenland in den Grenzen von 1939 (Kreta kommt als eigener Ring dazu). */
const GRIECHENLAND = verbinde(
  kueste(GRIECHENLAND_KUESTE, [20.0, 39.87], [25.87, 40.85]),
  [
    [25.3, 41.3],
    [24.5, 41.55],
    [23.6, 41.4],
    [22.9, 41.35],
    [22.5, 41.15],
    [21.7, 40.9],
    [20.95, 40.5],
    [20.7, 40.9],
    [20.95, 41.4],
    [20.6, 41.8],
    [20.4, 40.05],
  ],
);

const UNGARN = [
  [17.1, 47.85],
  [16.98, 48.17],
  [17.9, 48.5],
  [18.8, 48.6],
  [19.9, 48.5],
  [21.0, 48.55],
  [22.1, 48.4],
  [22.6, 48.1],
  [22.3, 47.7],
  [21.7, 46.9],
  [21.2, 46.2],
  [20.8, 45.8],
  [19.6, 45.9]  ,
  [18.9, 45.8],
  [17.6, 45.9],
  [16.5, 46.3],
  [16.1, 46.87],
  [16.4, 47.0],
  [16.5, 47.4],
];

const SLOWAKEI = [
  [16.98, 48.17],
  [17.4, 48.8],
  [18.1, 49.1],
  [18.85, 49.5],
  [19.6, 49.4],
  [20.5, 49.4],
  [21.5, 49.4],
  [22.5, 49.1],
  [22.1, 48.4],
  [21.0, 48.55],
  [19.9, 48.5],
  [18.8, 48.6],
  [17.9, 48.5],
];

const RUMAENIEN = [
  [22.5, 49.1],
  [23.6, 48.2],
  [25.0, 47.9],
  [26.0, 48.3],
  [27.0, 47.5],
  [28.0, 46.5],
  [28.2, 45.5],
  [28.8, 45.3],
  [29.7, 45.2],
  [28.6, 44.2],
  [28.15, 43.7],
  [27.5, 43.7],
  [26.0, 43.85],
  [24.0, 43.8],
  [22.9, 43.8],
  [22.4, 44.0],
  [22.5, 44.6],
  [21.5, 44.85],
  [20.8, 44.9],
  [21.2, 46.2],
  [21.7, 46.9],
  [22.3, 47.7],
  [22.6, 48.1],
  [22.1, 48.4],
];

const BULGARIEN = [
  [22.35, 42.3],
  [22.5, 43.0],
  [22.7, 43.4],
  [22.4, 44.0],
  [22.9, 43.8],
  [24.0, 43.8],
  [26.0, 43.85],
  [27.5, 43.7],
  [28.15, 43.7],
  [27.9, 43.2],
  [27.85, 42.7],
  [27.5, 42.1],
  [26.5, 41.8],
  [26.2, 41.7],
  [25.3, 41.3],
  [24.5, 41.55],
  [23.6, 41.4],
  [22.9, 41.35],
  [22.35, 42.0],
];

const SCHWEIZ = verbinde(rueckwaerts(GRENZE_SCHWEIZ), [
  [9.25, 46.5],
  [8.4, 46.45],
  [8.0, 46.0],
  [7.0, 45.92],
  [6.8, 46.05],
  [6.45, 46.35],
  [6.15, 46.2],
  [5.95, 46.5],
  [6.45, 46.8],
  [7.0, 47.5],
]);

const OESTERREICH = verbinde(rueckwaerts(GRENZE_ALPEN_SUED), [
  [16.98, 48.17],
  [16.6, 48.75],
  [15.9, 48.85],
  [15.2, 48.95],
  [14.9, 48.75],
  [14.4, 48.8],
  [14.0, 48.9],
  [13.85, 49.1],
  [13.46, 48.57],
  [13.05, 47.85],
  [12.8, 47.7],
  [12.2, 47.7],
  [11.6, 47.6],
  [11.0, 47.4],
  [10.45, 47.55],
  [10.1, 47.4],
]);

const TSCHECHOSLOWAKEI_1945 = [
  [12.1, 50.3],
  [12.6, 50.4],
  [13.2, 50.5],
  [13.9, 50.75],
  [14.4, 50.9],
  [14.82, 50.87],
  [15.35, 50.8],
  [16.0, 50.6],
  [16.4, 50.35],
  [16.75, 50.3],
  [17.35, 50.3],
  [18.05, 50.0],
  [18.6, 49.95],
  [19.0, 49.4],
  [19.6, 49.4],
  [20.5, 49.4],
  [21.5, 49.4],
  [22.5, 49.1],
  [22.1, 48.4],
  [21.0, 48.55],
  [19.9, 48.5],
  [18.8, 48.6],
  [17.9, 48.5],
  [16.98, 48.17],
  [16.6, 48.75],
  [15.9, 48.85],
  [15.2, 48.95],
  [14.9, 48.75],
  [14.4, 48.8],
  [14.0, 48.9],
  [13.83, 48.77],
  [13.4, 49.1],
  [12.65, 49.45],
  [12.5, 49.9],
];

const SPANIEN = verbinde(
  kueste(IBERIEN_ATLANTIK, [-1.78, 43.35], [-5.61, 36.0]),
  IBERIEN_MITTELMEER.slice(1),
  rueckwaerts(GRENZE_PYRENAEEN).slice(1),
  [[-1.78, 43.35]],
);

/** Portugal — die Grenze zu Spanien folgt in groben Zügen Minho, Duero und Guadiana. */
const PORTUGAL = verbinde(
  kueste(IBERIEN_ATLANTIK, [-8.87, 41.87], [-7.4, 37.17]),
  [
    [-7.2, 37.9],
    [-7.0, 38.5],
    [-7.3, 39.2],
    [-7.0, 39.7],
    [-6.9, 40.3],
    [-6.85, 41.0],
    [-7.5, 41.6],
    [-8.2, 41.9],
  ],
);

const TUERKEI = verbinde(
  kueste(KLEINASIEN_KUESTE, [26.4, 40.15], [36.2, 36.6]),
  [
    [36.6, 36.9],
    [37.5, 36.7],
    [38.5, 36.9],
    [40.0, 37.1],
    [42.0, 37.3],
    [43.5, 37.5],
    [44.8, 39.7],
    [43.5, 41.0],
    [41.65, 41.65],
    [41.0, 41.3],
    [40.6, 41.1],
    [39.7, 41.0],
    [38.4, 41.0],
    [37.3, 41.3],
    [36.33, 41.3],
    [36.0, 41.7],
    [35.15, 42.03],
    [34.0, 41.95],
    [33.3, 42.0],
    [32.3, 41.8],
    [31.4, 41.15],
    [30.0, 41.2],
    [29.1, 41.2],
    [28.5, 41.3],
    [27.5, 41.6],
    [26.5, 41.8],
    [26.2, 41.0],
    [26.35, 40.4],
  ],
);

/**
 * Die Westgrenze der Sowjetunion im Juni 1941 — nach dem Hitler-Stalin-Pakt
 * von 1939 und den Angliederungen von 1939/40 (Ostpolen, Estland, Lettland,
 * Litauen, Bessarabien und die Nordbukowina).
 */
const SOWJETUNION_WESTGRENZE_1941 = [
  [21.05, 55.7],
  [22.4, 55.05],
  [22.9, 54.8],
  [22.7, 54.4],
  [22.9, 54.1],
  [22.85, 53.6],
  [23.2, 52.9],
  [23.6, 52.5],
  [23.9, 51.5],
  [24.0, 50.7],
  [22.8, 49.6],
  [22.5, 49.1],
  [23.6, 48.2],
  [25.0, 47.9],
  [26.0, 48.3],
  [27.0, 47.5],
  [28.0, 46.5],
  [28.2, 45.5],
  [28.8, 45.3],
  [29.7, 45.2],
];

/** Der Ostrand: die Küste des Kaspischen Meeres und die Grenze zur Türkei. */
const SOWJETUNION_OSTRAND = [
  [41.65, 41.65],
  [43.5, 41.0],
  [44.8, 39.7],
  [46.5, 39.2],
  [48.4, 38.8],
  [49.0, 41.0],
  [48.4, 41.8],
  [47.8, 42.5],
  [47.55, 43.2],
  [47.5, 44.0],
  [47.6, 45.0],
  [47.8, 46.0],
  [48.2, 46.7],
  [48.7, 47.1],
  [49.5, 47.3],
  [49.5, 62.6],
  [30.5, 62.6],
  [29.5, 61.8],
  [28.5, 61.0],
  [29.8, 60.3],
  [30.3, 59.94],
];

const SOWJETUNION_1941 = verbinde(
  SOWJETUNION_WESTGRENZE_1941,
  rueckwaerts(kueste(SCHWARZES_MEER, [29.7, 45.2], [41.65, 41.65])),
  SOWJETUNION_OSTRAND,
  rueckwaerts(kueste(OSTSEE_OST, [21.05, 55.7], [30.3, 59.94])),
);

/**
 * Die Frontlinie im November 1942 — die größte Ausdehnung des deutschen
 * Machtbereichs im Osten. Sie läuft von der Ostsee südlich an Leningrad
 * vorbei, über Rschew und den Don bis westlich von Stalingrad und weiter in
 * den Kaukasus. Eine Frontlinie, keine Grenze — der Titel der Fläche sagt das.
 */
const OSTFRONT_1942 = [
  [29.5, 59.8],
  [30.0, 59.7],
  [30.5, 59.72],
  [30.95, 59.8], // Schlüsselburg — hier war der Ring um Leningrad geschlossen
  [32.0, 59.2],
  [31.5, 58.4],
  [31.3, 57.8], // Staraja Russa
  [32.4, 56.8],
  [34.3, 56.26], // Rschew
  [34.6, 55.5],
  [35.0, 54.6],
  [36.0, 53.5],
  [36.1, 52.97], // Orjol
  [35.5, 52.2],
  [35.8, 51.5],
  [37.5, 51.4],
  [39.2, 51.67], // Woronesch
  [40.5, 50.5],
  [41.5, 49.6],
  [43.0, 48.9],
  [44.2, 48.75], // westlich von Stalingrad — die Stadt selbst blieb umkämpft
  [44.3, 48.0],
  [44.5, 47.0],
  [44.25, 46.3], // Elista
  [44.9, 44.6],
  [44.65, 43.75], // Mosdok
  [43.6, 43.5], // Naltschik
  [42.0, 43.7],
  [40.0, 44.2],
  [37.8, 44.7], // Noworossijsk
];

/** Das 1941/42 besetzte sowjetische Gebiet — zwischen alter Grenze und Front. */
const BESETZTES_SOWJETGEBIET_1942 = verbinde(
  SOWJETUNION_WESTGRENZE_1941,
  rueckwaerts(kueste(SCHWARZES_MEER, [29.7, 45.2], [37.8, 44.7])),
  rueckwaerts(OSTFRONT_1942),
  rueckwaerts(kueste(OSTSEE_OST, [21.05, 55.7], [29.5, 59.8])),
);

/** Die Sowjetunion 1945 — mit den 1945 hinzugekommenen Gebieten im Westen. */
const SOWJETUNION_1945 = verbinde(
  [
    [19.6, 54.4],
    [20.5, 54.42],
    [21.5, 54.38],
    [22.8, 54.38],
    [23.5, 53.9],
    [23.5, 53.2],
    [23.2, 52.6],
    [23.6, 52.0],
    [23.8, 51.2],
    [23.6, 50.4],
    [23.0, 49.6],
    [22.5, 49.1],
    [23.6, 48.2],
    [25.0, 47.9],
    [26.0, 48.3],
    [27.0, 47.5],
    [28.0, 46.5],
    [28.2, 45.5],
    [28.8, 45.3],
    [29.7, 45.2],
  ],
  rueckwaerts(kueste(SCHWARZES_MEER, [29.7, 45.2], [41.65, 41.65])),
  SOWJETUNION_OSTRAND,
  rueckwaerts(kueste(OSTSEE_OST, [21.05, 55.7], [30.3, 59.94])),
  [
    [20.9, 55.3],
    [20.5, 55.0],
    [19.9, 54.65],
    [19.3, 54.55],
  ],
);

/** Polen in den Grenzen von 1945 — nach Westen verschoben. */
const POLEN_1945 = verbinde(
  [
    [14.27, 53.93],
    [14.2, 53.75],
    [14.4, 53.4],
    [14.6, 52.9],
    [14.55, 52.35],
    [14.7, 51.95],
    [14.75, 51.5],
    [14.82, 50.87],
    [15.35, 50.8],
    [16.0, 50.6],
    [16.4, 50.35],
    [16.75, 50.3],
    [17.35, 50.3],
    [18.05, 50.0],
    [18.6, 49.95],
    [19.0, 49.4],
    [19.6, 49.4],
    [20.5, 49.4],
    [21.5, 49.4],
    [22.5, 49.1],
    [23.0, 49.6],
    [23.6, 50.4],
    [23.8, 51.2],
    [23.6, 52.0],
    [23.2, 52.6],
    [23.5, 53.2],
    [23.5, 53.9],
    [22.8, 54.38],
    [21.5, 54.38],
    [20.5, 54.42],
    [19.6, 54.4],
    [19.35, 54.35],
  ],
  rueckwaerts(kueste(OSTSEE_OST, [19.35, 54.35], [18.65, 54.35])),
  rueckwaerts(kueste(OSTSEE_SUED, [14.25, 53.92], [18.65, 54.35])),
);

/** Das nördliche Ostpreußen — seit 1945 sowjetisch verwaltet (Königsberg). */
const NORDLICHES_OSTPREUSSEN = verbinde(
  [
    [19.35, 54.35],
    [19.6, 54.4],
    [20.5, 54.42],
    [21.5, 54.38],
    [22.8, 54.38],
    [22.9, 54.8],
    [22.4, 55.05],
    [21.8, 55.15],
    [21.3, 55.27],
    [21.05, 55.7],
  ],
  kueste(OSTSEE_OST, [21.05, 55.7], [19.3, 54.55]),
);

// ---------------------------------------------------------------------------
// Die vier Besatzungszonen 1945 — angenähert (siehe Kopf der Datei, Punkt 2)
// ---------------------------------------------------------------------------

/** Die Oder-Neiße-Linie, von der Ostsee bis an die böhmische Grenze. */
const ODER_NEISSE = [
  [14.27, 53.93],
  [14.2, 53.75],
  [14.4, 53.4],
  [14.6, 52.9],
  [14.55, 52.35],
  [14.7, 51.95],
  [14.75, 51.5],
  [14.82, 50.87],
];

/** Die Westgrenze der sowjetischen Zone: Lübecker Bucht → Elbe → Thüringen → Hof. */
const ZONENGRENZE_WEST = [
  [10.87, 53.87],
  [10.9, 53.4],
  [11.2, 53.1],
  [11.4, 52.9],
  [11.0, 52.6],
  [10.9, 52.2],
  [10.6, 51.9],
  [10.6, 51.6],
  [10.2, 51.5],
  [10.0, 51.4],
  [9.95, 51.0],
  [10.2, 50.6],
  [10.6, 50.4],
  [11.2, 50.4],
  [12.1, 50.3],
];

/** Die böhmische Grenze von 1937, von Hof bis Zittau. */
const BOEHMISCHE_GRENZE = [
  [12.1, 50.3],
  [12.6, 50.4],
  [13.2, 50.5],
  [13.9, 50.75],
  [14.4, 50.9],
  [14.82, 50.87],
];

const SOWJETISCHE_ZONE = verbinde(
  ZONENGRENZE_WEST,
  BOEHMISCHE_GRENZE,
  rueckwaerts(ODER_NEISSE),
  rueckwaerts(kueste(OSTSEE_SUED, [10.87, 53.87], [14.25, 53.92])),
);

/** Die Grenze zwischen britischer und amerikanischer Zone. */
const ZONENGRENZE_NORD = [
  [6.35, 50.4],
  [7.0, 50.55],
  [8.0, 50.5],
  [8.5, 51.2],
  [9.3, 51.4],
  [10.0, 51.45],
  [10.2, 51.5],
];

const BRITISCHE_ZONE = verbinde(
  GRENZE_NIEDERLANDE,
  [[6.25, 50.6], [6.35, 50.4]],
  ZONENGRENZE_NORD.slice(1),
  rueckwaerts(ZONENGRENZE_WEST),
  rueckwaerts(kueste(OSTSEE_SUED, [10.13, 54.33], [10.87, 53.87])),
  kueste(JUETLAND_OST, [10.13, 54.33], [9.43, 54.79]),
  GRENZE_DAENEMARK,
  kueste(JUETLAND_WEST, [8.66, 54.91], [8.7, 53.87]),
  kueste(NORDSEE, [8.7, 53.87], [7.2, 53.6]),
);

/** Die Grenze zwischen amerikanischer und französischer Zone. */
const ZONENGRENZE_SUEDWEST = [
  [8.0, 50.5],
  [8.35, 50.05],
  [8.4, 49.7],
  [8.45, 49.4],
  [8.3, 49.1],
  [8.15, 48.95],
  [8.3, 48.75],
  [9.2, 48.6],
  [9.9, 48.5],
  [10.2, 48.4],
  [10.1, 47.9],
  [10.15, 47.55],
];

const AMERIKANISCHE_ZONE = verbinde(
  ZONENGRENZE_SUEDWEST,
  [[10.45, 47.55], [11.0, 47.4], [11.6, 47.6], [12.2, 47.7], [12.8, 47.7], [13.05, 47.85], [13.46, 48.57], [13.83, 48.77], [13.4, 49.1], [12.65, 49.45], [12.5, 49.9], [12.1, 50.3]],
  rueckwaerts(ZONENGRENZE_WEST).slice(1, 7),
  rueckwaerts(ZONENGRENZE_NORD),
);

const FRANZOESISCHE_ZONE = verbinde(
  [[6.35, 50.4], [7.0, 50.55], [8.0, 50.5]],
  ZONENGRENZE_SUEDWEST.slice(1),
  [[9.75, 47.6]],
  rueckwaerts(GRENZE_SCHWEIZ).slice(1),
  rueckwaerts(GRENZE_FRANKREICH).slice(1),
  rueckwaerts(GRENZE_LUXEMBURG).slice(1),
  rueckwaerts(GRENZE_BELGIEN).slice(1, 3),
);

/** Berlin — die Stadtgrenze, grob: 13,1° bis 13,77° O, 52,34° bis 52,68° N. */
const BERLIN_SEKTOREN = [
  [13.1, 52.68],
  [13.77, 52.68],
  [13.77, 52.34],
  [13.1, 52.34],
];

// ---------------------------------------------------------------------------
// Zusammenbau: Untergrund
// ---------------------------------------------------------------------------

const land = (punkte) => ({
  art: 'land',
  d: geo.pfad(punkte),
  fill: KARTENFARBEN.land,
  stroke: KARTENFARBEN.landRand,
  strokeWidth: 1,
});

const wasser = (punkte) => ({
  art: 'see',
  d: geo.pfad(punkte),
  fill: KARTENFARBEN.meer,
  stroke: KARTENFARBEN.fluss,
  strokeWidth: 1,
});

const fluss = (punkte) => ({
  art: 'fluss',
  d: geo.pfad(punkte, { geschlossen: false }),
  fill: 'none',
  stroke: KARTENFARBEN.fluss,
  strokeWidth: 2,
});

const basis = [
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
  land(IRLAND),
  land(AFRIKA),
  land(KORSIKA),
  land(SARDINIEN),
  land(SIZILIEN),
  land(KRETA),
  land(RHODOS),
  land(ZYPERN),
  land(MALTA),
  land(MALLORCA),
  land(SJAELLAND),
  land(FYN),
  land(LOLLAND),
  land(BORNHOLM),
  land(GOTLAND),
  wasser(SCHWARZES_MEER),
  wasser(MARMARAMEER),
  wasser(KASPISCHES_MEER),
  wasser(LADOGASEE),
  fluss(RHEIN),
  fluss(DONAU),
  fluss(ELBE),
  fluss(ODER),
  fluss(WEICHSEL),
  fluss(SEINE),
  fluss(LOIRE),
  fluss(PO),
  fluss(THEMSE),
  fluss(DNJEPR),
  fluss(DON),
  fluss(WOLGA),
];

// ---------------------------------------------------------------------------
// Zusammenbau: die Flächen der Phasen
// ---------------------------------------------------------------------------

/** Baut aus mehreren Ringen ein einziges `d`-Attribut. */
const ringe = (...listen) => listen.map((liste) => geo.pfad(liste)).join(' ');

const flaecheReich = {
  titel: 'Deutsches Reich — Stand 1941 (mit Österreich 1938, dem Sudetenland 1938, dem Memelgebiet, Danzig und Westpolen 1939)',
  d: geo.pfad(REICH_1941),
};

const flaecheProtektorat = {
  titel: 'Protektorat Böhmen und Mähren — seit März 1939 unter deutscher Herrschaft',
  d: geo.pfad(PROTEKTORAT),
};

const flaecheGeneralgouvernement = {
  titel: 'Generalgouvernement — das besetzte Polen, seit Oktober 1939',
  d: geo.pfad(GENERALGOUVERNEMENT),
};

const flaecheBesetzt1941 = {
  titel: 'Von Deutschland besetzt (1940/41): Dänemark, Norwegen, die Niederlande, Belgien, Luxemburg, Nordfrankreich, Jugoslawien, Griechenland',
  d: ringe(
    DAENEMARK_JUETLAND,
    SJAELLAND,
    FYN,
    NORWEGEN,
    BENELUX,
    FRANKREICH_BESETZT_1940,
    JUGOSLAWIEN,
    GRIECHENLAND,
    KRETA,
  ),
};

const flaecheVichy = {
  titel: 'Vichy-Frankreich — 1940 bis November 1942 unbesetzt',
  d: geo.pfad(FRANKREICH_VICHY),
};

const flaecheItalien1941 = {
  titel: 'Königreich Italien — mit Deutschland verbündet (Achse, seit 1939/40)',
  d: ringe(ITALIEN, SIZILIEN, SARDINIEN, ALBANIEN),
};

const flaecheItalien1943 = {
  titel: 'Königreich Italien — bis September 1943 verbündet, danach selbst Kriegsschauplatz',
  d: ringe(ITALIEN, SIZILIEN, SARDINIEN, ALBANIEN),
};

const flaecheMitkaempfer = {
  titel: 'An der Seite Deutschlands im Krieg (1941): Ungarn, Rumänien, Bulgarien, die Slowakei, Finnland',
  d: ringe(UNGARN, RUMAENIEN, BULGARIEN, SLOWAKEI, FINNLAND),
};

const flaecheMitkaempfer1942 = {
  titel: 'An der Seite Deutschlands im Krieg (1942): Ungarn, Rumänien, Bulgarien, die Slowakei, Finnland',
  d: ringe(UNGARN, RUMAENIEN, BULGARIEN, SLOWAKEI, FINNLAND),
};

const flaecheSowjetunion1941 = {
  titel: 'Sowjetunion — Vertragspartner des Hitler-Stalin-Pakts von 1939, kein Verbündeter (Grenzen von Juni 1941)',
  d: geo.pfad(SOWJETUNION_1941),
};

const flaecheSowjetunion1942 = {
  titel: 'Sowjetunion — das nicht besetzte Gebiet (Stand November 1942)',
  d: geo.pfad(SOWJETUNION_1941),
};

const flaecheSowjetunion1945 = {
  titel: 'Sowjetunion (Grenzen von 1945)',
  d: geo.pfad(SOWJETUNION_1945),
};

const flaecheGrossbritannien = {
  titel: 'Großbritannien — seit dem 3. September 1939 im Krieg gegen Deutschland',
  d: ringe(BRITANNIEN),
};

const flaecheGrossbritannien1945 = {
  titel: 'Großbritannien (1945)',
  d: ringe(BRITANNIEN),
};

const flaecheNeutral = {
  titel: 'Im Krieg neutral geblieben: Schweden, die Schweiz, Spanien, Portugal, Irland, die Türkei',
  d: ringe(SCHWEDEN, SCHWEIZ, SPANIEN, PORTUGAL, IRLAND, TUERKEI),
};

const flaecheMachtbereich1942 = {
  titel: 'Deutscher Machtbereich — die größte Ausdehnung, Herbst 1942 (die Ostgrenze ist eine Frontlinie, keine Staatsgrenze)',
  d: ringe(
    REICH_1941,
    PROTEKTORAT,
    GENERALGOUVERNEMENT,
    BESETZTES_SOWJETGEBIET_1942,
    FRANKREICH_GESAMT,
    BENELUX,
    DAENEMARK_JUETLAND,
    SJAELLAND,
    FYN,
    NORWEGEN,
    JUGOSLAWIEN,
    GRIECHENLAND,
    KRETA,
  ),
};

const flaecheSowjetischeZone = {
  titel: 'Sowjetische Besatzungszone (ab Juli 1945)',
  d: geo.pfad(SOWJETISCHE_ZONE),
};

const flaecheBritischeZone = {
  titel: 'Britische Besatzungszone (ab Juli 1945)',
  d: geo.pfad(BRITISCHE_ZONE),
};

const flaecheAmerikanischeZone = {
  titel: 'Amerikanische Besatzungszone (ab Juli 1945)',
  d: geo.pfad(AMERIKANISCHE_ZONE),
};

const flaecheFranzoesischeZone = {
  titel: 'Französische Besatzungszone (ab Juli 1945)',
  d: geo.pfad(FRANZOESISCHE_ZONE),
};

const flaecheBerlin = {
  titel: 'Berlin — von allen vier Mächten gemeinsam verwaltet, mitten in der sowjetischen Zone (ab Juli 1945)',
  d: geo.pfad(BERLIN_SEKTOREN),
};

const flaechePolen1945 = {
  titel: 'Polen (Grenzen von 1945) — nach Westen verschoben: die deutschen Gebiete östlich von Oder und Neiße kamen unter polnische Verwaltung',
  d: geo.pfad(POLEN_1945),
};

const flaecheNordOstpreussen = {
  titel: 'Nördliches Ostpreußen mit Königsberg — seit 1945 sowjetisch verwaltet',
  d: geo.pfad(NORDLICHES_OSTPREUSSEN),
};

const flaecheOesterreich1945 = {
  titel: 'Österreich — 1945 wiederhergestellt, ebenfalls in vier Besatzungszonen',
  d: geo.pfad(OESTERREICH),
};

const flaecheBefreitOst = {
  titel: 'Von der Roten Armee befreite und besetzte Länder (1944/45): die Tschechoslowakei, Ungarn, Rumänien, Bulgarien, Jugoslawien',
  d: ringe(TSCHECHOSLOWAKEI_1945, UNGARN, RUMAENIEN, BULGARIEN, JUGOSLAWIEN, ALBANIEN),
};

const flaecheBefreitWest = {
  titel: 'Von den Westalliierten befreite Länder (1944/45): Frankreich, Belgien, die Niederlande, Luxemburg, Dänemark, Norwegen, Italien, Griechenland',
  d: ringe(
    FRANKREICH_GESAMT,
    BENELUX,
    DAENEMARK_JUETLAND,
    SJAELLAND,
    FYN,
    NORWEGEN,
    ITALIEN,
    SIZILIEN,
    SARDINIEN,
    GRIECHENLAND,
    KRETA,
  ),
};

const phasen = [
  {
    id: 'angriff-1939-41',
    label: '1939–1941',
    hinweis: [
      'Am 1. September 1939 überfiel die Wehrmacht Polen; zwei Tage später',
      'erklärten Großbritannien und Frankreich Deutschland den Krieg. Bis zum',
      'Sommer 1941 reichte der deutsche Machtbereich vom Nordkap bis nach',
      'Griechenland und vom Atlantik bis an die sowjetische Grenze. Die',
      'Sowjetunion steht auf dieser Phase als Vertragspartner da, nicht als',
      'Verbündeter: Der Nichtangriffsvertrag vom 23. August 1939 — der',
      'Hitler-Stalin-Pakt — enthielt ein geheimes Zusatzprotokoll, das',
      'Osteuropa in Interessensphären aufteilte; am 17. September 1939',
      'besetzte die Rote Armee den Osten Polens. Am 22. Juni 1941 brach',
      'Deutschland den Vertrag und griff die Sowjetunion an. Datierte',
      'Zustände, ohne Wertung.',
    ].join(' '),
    flaechen: [
      flaecheReich,
      flaecheProtektorat,
      flaecheGeneralgouvernement,
      flaecheBesetzt1941,
      flaecheVichy,
      flaecheItalien1941,
      flaecheMitkaempfer,
      flaecheSowjetunion1941,
      flaecheGrossbritannien,
      flaecheNeutral,
    ],
  },
  {
    id: 'wende-1942-44',
    label: '1942–1944',
    hinweis: [
      'Die Fläche zeigt die größte Ausdehnung: den Stand vom Herbst 1942, als',
      'die Wehrmacht an der Wolga und im Kaukasus stand und im November auch',
      'in den bis dahin unbesetzten Süden Frankreichs einrückte. Ihre Ostgrenze',
      'ist eine Frontlinie, keine Staatsgrenze. Von hier an lief alles in die',
      'andere Richtung: Am 2. Februar 1943 kapitulierte die 6. Armee in',
      'Stalingrad, im Mai 1943 endete der Krieg in Nordafrika (das unter dem',
      'unteren Bildrand liegt), im Juli 1943 landeten die Westalliierten auf',
      'Sizilien und scheiterte der letzte deutsche Großangriff bei Kursk, am',
      '6. Juni 1944 landeten sie in der Normandie, im Sommer 1944 zerbrach die',
      'Heeresgruppe Mitte. Leningrad, Moskau und Stalingrad hat die Wehrmacht',
      'nie eingenommen.',
    ].join(' '),
    flaechen: [
      flaecheMachtbereich1942,
      flaecheItalien1943,
      flaecheMitkaempfer1942,
      flaecheSowjetunion1942,
      flaecheGrossbritannien,
      flaecheNeutral,
    ],
  },
  {
    id: 'ende-1945',
    label: '1945',
    hinweis: [
      'Am 8. Mai 1945 trat die bedingungslose Kapitulation der Wehrmacht in',
      'Kraft. Deutschland gab es als Staat weiter, aber ohne Regierung: Die',
      'vier Siegermächte übernahmen die oberste Gewalt und teilten das Land in',
      'vier Besatzungszonen; Berlin, mitten in der sowjetischen Zone, wurde',
      'gemeinsam verwaltet. Die Gebiete östlich von Oder und Neiße kamen unter',
      'polnische, das nördliche Ostpreußen unter sowjetische Verwaltung — aus',
      'ihnen flohen oder wurden vertrieben zwölf bis vierzehn Millionen',
      'Deutsche. Österreich wurde wiederhergestellt und ebenfalls in vier Zonen',
      'geteilt. Die Karte zeigt den Stand nach der Potsdamer Konferenz vom',
      'August 1945; die Zonengrenzen sind angenähert.',
    ].join(' '),
    flaechen: [
      flaecheSowjetischeZone,
      flaecheBritischeZone,
      flaecheAmerikanischeZone,
      flaecheFranzoesischeZone,
      flaecheBerlin,
      flaechePolen1945,
      flaecheNordOstpreussen,
      flaecheOesterreich1945,
      flaecheBefreitOst,
      flaecheBefreitWest,
      flaecheSowjetunion1945,
      flaecheGrossbritannien1945,
      flaecheNeutral,
    ],
  },
];

// ---------------------------------------------------------------------------
// Info-Punkte — hier lebt das Hintergrundwissen
// ---------------------------------------------------------------------------

const punkte = [
  {
    id: 'berlin',
    name: 'Berlin',
    typ: 'stadt',
    ...ort(13.4, 52.52),
    text: [
      'Von Berlin aus wurde der Krieg befohlen, und in Berlin endete er. Am',
      '1. September 1939 erklärte Adolf Hitler im Reichstag den Überfall auf',
      'Polen zu einem „Zurückschießen" — der Anlass, ein vorgetäuschter',
      'polnischer Angriff auf den Sender Gleiwitz, war von der SS inszeniert.',
      'Am 18. Februar 1943, drei Wochen nach Stalingrad, rief Joseph Goebbels',
      'im Sportpalast zum „totalen Krieg" auf, und die Zuhörer jubelten. Ab',
      '1943 fielen Bomben auf die Stadt selbst. Am 16. April 1945 begann die',
      'Schlacht um Berlin: rund 1,5 Millionen Soldaten der Roten Armee gegen',
      'eine Verteidigung, in der auch Fünfzehnjährige des Volkssturms standen.',
      'Am 30. April nahm Hitler sich im Bunker das Leben, am 2. Mai',
      'kapitulierte die Stadt, am 8. Mai die Wehrmacht. Danach wurde Berlin in',
      'vier Sektoren aufgeteilt und von allen vier Siegermächten gemeinsam',
      'verwaltet — mitten in der sowjetischen Zone. Aus dieser Lage entstand',
      'später der Kalte Krieg in seiner deutschen Form.',
    ].join(' '),
  },
  {
    id: 'stalingrad',
    name: 'Stalingrad',
    typ: 'ereignis',
    ...ort(44.42, 48.71),
    text: [
      'Stalingrad (heute Wolgograd) liegt an der Wolga, rund 2 000 Kilometer',
      'von Berlin entfernt. Im Sommer 1942 sollte die Stadt im Vorbeigehen',
      'genommen werden; im Herbst kämpfte man um einzelne Häuser. Am 19.',
      'November 1942 durchbrach die Rote Armee mit der Operation Uranus die',
      'schwach besetzten Flanken und schloss die 6. Armee ein — rund 250 000',
      'Mann. Der Ausbruch wurde verboten, die Versorgung aus der Luft',
      'scheiterte. Am 2. Februar 1943 endete der Kampf: Etwa 110 000 deutsche',
      'Soldaten gingen in Gefangenschaft, von denen rund 6 000 nach Jahren',
      'zurückkamen. Die Verluste der sowjetischen Seite — Soldaten wie',
      'Einwohner der Stadt — waren um ein Vielfaches höher. In Deutschland',
      'wurde drei Tage Staatstrauer angeordnet, und viele begriffen zum ersten',
      'Mal, dass dieser Krieg verloren gehen konnte. Auf dieser Karte liegt',
      'Stalingrad in keiner Phase im deutschen Machtbereich: Die Wehrmacht',
      'stand in der Stadt, erobert hat sie sie nie.',
    ].join(' '),
  },
  {
    id: 'auschwitz',
    name: 'Auschwitz',
    typ: 'ereignis',
    ...ort(19.22, 50.03),
    text: [
      'Auschwitz ist der deutsche Name der polnischen Stadt Oświęcim. Sie lag',
      'in dem Gebiet, das das Deutsche Reich 1939 annektiert hatte. Im Mai 1940',
      'richtete die SS dort ein Konzentrationslager ein, ab 1941 entstand drei',
      'Kilometer entfernt Birkenau (Auschwitz II) — ein Vernichtungslager mit',
      'Gaskammern, das an eine Bahnrampe angeschlossen war. Aus ganz Europa',
      'rollten Züge dorthin: aus Ungarn, Frankreich, den Niederlanden,',
      'Griechenland, Italien, aus dem Reich selbst. Nach dem Forschungsstand',
      'wurden in Auschwitz rund 1,1 Millionen Menschen ermordet, davon etwa',
      'eine Million Jüdinnen und Juden, dazu Sinti und Roma, polnische',
      'Zivilisten und sowjetische Kriegsgefangene. Am 27. Januar 1945',
      'erreichte die Rote Armee das Lager; sie fand etwa 7 000 Überlebende.',
      'Dieser Tag ist seit 1996 in Deutschland der Gedenktag für die Opfer des',
      'Nationalsozialismus. Auschwitz war nicht das einzige Vernichtungslager,',
      'aber das größte — und es steht heute für alle.',
    ].join(' '),
  },
  {
    id: 'london',
    name: 'London',
    typ: 'stadt',
    ...ort(-0.13, 51.51),
    text: [
      'Nach der Niederlage Frankreichs im Juni 1940 stand Großbritannien allein',
      'gegen Deutschland. Von Juli bis Oktober 1940 versuchte die Luftwaffe in',
      'der Luftschlacht um England, die Royal Air Force auszuschalten und eine',
      'Landung vorzubereiten. Als das misslang, wurden ab September 1940 die',
      'Städte selbst zum Ziel: 57 Nächte hintereinander fielen Bomben auf',
      'London, insgesamt starben in Großbritannien im „Blitz" rund 40 000',
      'Menschen, viele Tausend davon in London. Coventry wurde am 14. November',
      '1940 in einer Nacht zerstört; im Deutschen Reich prägte die Propaganda',
      'dafür das Wort „coventrieren". Der Bombenkrieg gegen Wohnviertel wurde',
      'also nicht von den Alliierten erfunden — Warschau 1939, Rotterdam 1940',
      'und Coventry 1940 lagen vor Hamburg und Dresden. Das ist keine',
      'Rechtfertigung für das, was später über deutschen Städten geschah, und',
      'auch keine Gegenrechnung. Es ist nur die Reihenfolge.',
    ].join(' '),
  },
  {
    id: 'paris',
    name: 'Paris',
    typ: 'stadt',
    ...ort(2.35, 48.86),
    text: [
      'Am 14. Juni 1940 marschierte die Wehrmacht in Paris ein; sechs Wochen',
      'hatte der Feldzug gedauert. Am 22. Juni unterzeichnete Frankreich den',
      'Waffenstillstand — in demselben Eisenbahnwagen von Compiègne, in dem',
      '1918 das Deutsche Reich unterschrieben hatte. Der Norden und die',
      'Atlantikküste wurden besetzt, im Süden regierte von Vichy aus eine',
      'französische Regierung unter Marschall Pétain, die mit Deutschland',
      'zusammenarbeitete; im November 1942 besetzte die Wehrmacht auch diesen',
      'Teil. Aus Frankreich wurden rund 75 000 Jüdinnen und Juden in die',
      'Vernichtungslager deportiert, bei der Razzia im Vélodrome d’Hiver im',
      'Juli 1942 verhaftete die französische Polizei über 13 000 Menschen. Es',
      'gab die Résistance, und es gab die Kollaboration; beides gehört zur',
      'französischen Geschichte dieser Jahre. Am 25. August 1944 wurde Paris',
      'befreit — die Stadt blieb erhalten, weil der deutsche Stadtkommandant',
      'den Befehl zur Zerstörung nicht ausführte.',
    ].join(' '),
  },
  {
    id: 'leningrad',
    name: 'Leningrad',
    typ: 'ereignis',
    ...ort(30.31, 59.94),
    text: [
      'Am 8. September 1941 schloss sich der Ring um Leningrad (heute St.',
      'Petersburg). Die Stadt sollte nicht erobert, sondern ausgehungert',
      'werden: Die deutsche Führung hatte entschieden, eine Kapitulation gar',
      'nicht anzunehmen — die Verpflegung von Millionen Menschen war nicht',
      'vorgesehen. Die Blockade dauerte fast 900 Tage, bis zum 27. Januar 1944.',
      'Im Winter 1941/42 lag die Brotration bei 125 Gramm am Tag; die einzige',
      'Verbindung lief über das Eis des Ladogasees, die „Straße des Lebens".',
      'Nach dem Forschungsstand starben über eine Million Menschen, die meisten',
      'an Hunger und Kälte. Leningrad ist damit einer der Orte, an denen sich',
      'zeigt, was der Krieg im Osten war: kein Feldzug um Gebiete, sondern ein',
      'Vernichtungskrieg, in dem der Hungertod der Zivilbevölkerung eingeplant',
      'war. Die Sowjetunion verlor in diesem Krieg insgesamt rund 27 Millionen',
      'Menschen — mehr als jedes andere Land.',
    ].join(' '),
  },
  {
    id: 'dresden',
    name: 'Dresden',
    typ: 'ereignis',
    ...ort(13.74, 51.05),
    text: [
      'In der Nacht vom 13. auf den 14. Februar 1945 und am Tag darauf',
      'zerstörten britische und amerikanische Bomber die Dresdner Innenstadt.',
      'Eine vom Stadtrat eingesetzte Historikerkommission kam 2010 nach',
      'jahrelanger Arbeit auf 22 700 bis 25 000 Tote. Höhere Zahlen, die bis',
      'heute kursieren, gehen auf die Propaganda des Jahres 1945 zurück und',
      'sind widerlegt. Dresden war nicht der schwerste Angriff: In Hamburg',
      'starben Ende Juli 1943 in der „Operation Gomorrha" rund 34 000 Menschen',
      'in einem Feuersturm. Insgesamt kamen im Bombenkrieg über Deutschland',
      'nach heutigem Forschungsstand etwa 350 000 bis 400 000 Menschen um.',
      'Ob die Angriffe auf Wohnviertel militärisch nötig und moralisch',
      'vertretbar waren, wird bis heute gestritten — auch in Großbritannien,',
      'wo Bomber-Harris umstritten blieb. Was nicht strittig ist: Diese Toten',
      'gehören in die deutsche Geschichte, und sie sind keine Gegenrechnung.',
      'Wer Dresden gegen Auschwitz aufrechnet, hat beides nicht verstanden.',
    ].join(' '),
  },
];

const beiPunkt = (id) => {
  const punkt = punkte.find((eintrag) => eintrag.id === id);
  return [punkt.x, punkt.y];
};

// ---------------------------------------------------------------------------
// Bewegungen
// ---------------------------------------------------------------------------

const bewegungen = [
  {
    id: 'ueberfall-polen',
    name: 'Der Überfall auf Polen, 1. September 1939',
    von: beiPunkt('berlin'),
    ueber: [p(15.5, 52.4)],
    nach: p(21.0, 52.23),
    text: [
      'Um 4.45 Uhr am 1. September 1939 eröffnete das Schulschiff',
      '„Schleswig-Holstein" das Feuer auf die polnische Garnison auf der',
      'Westerplatte bei Danzig; gleichzeitig überschritten 1,5 Millionen',
      'deutsche Soldaten die Grenze. Eine Kriegserklärung gab es nicht. Den',
      'Anlass hatte die SS am Abend zuvor selbst gebaut: einen vorgetäuschten',
      'Überfall auf den Sender Gleiwitz. Am 3. September erklärten',
      'Großbritannien und Frankreich Deutschland den Krieg; am 17. September',
      'rückte die Rote Armee nach dem geheimen Zusatzprotokoll des',
      'Hitler-Stalin-Pakts in Ostpolen ein. Warschau kapitulierte am 27.',
      'September nach schwerem Bombardement. Schon in diesen Wochen erschossen',
      'Einsatzgruppen der SS Tausende polnische Lehrer, Priester, Beamte und',
      'Juden. Dieser Krieg war von Anfang an mehr als ein Feldzug — und er war',
      'von Deutschland begonnen.',
    ].join(' '),
  },
  {
    id: 'vormarsch-osten',
    name: 'Der Vormarsch bis Stalingrad, 1941–1942',
    von: beiPunkt('berlin'),
    ueber: [p(27.56, 53.9), p(30.5, 50.45), p(39.7, 47.25)],
    nach: beiPunkt('stalingrad'),
    text: [
      'Am 22. Juni 1941 begann mit dem Unternehmen „Barbarossa" der Angriff auf',
      'die Sowjetunion — drei Millionen deutsche Soldaten auf einer Front von',
      '1 800 Kilometern, ohne Kriegserklärung und unter Bruch des eigenen',
      'Vertrags von 1939. Es war von Anfang an kein gewöhnlicher Feldzug: Die',
      'Befehle, die vor dem Angriff ausgegeben wurden — der Kommissarbefehl,',
      'der Gerichtsbarkeitserlass, der „Hungerplan" —, hoben das Kriegsrecht',
      'für diesen Schauplatz auf. Bis Dezember 1941 stand die Wehrmacht vor',
      'Moskau, dann blieb sie im Winter stecken. 1942 ging der Angriff im',
      'Süden weiter, zur Wolga und in den Kaukasus, zu den Ölfeldern. In',
      'Stalingrad endete er. Der Rückweg dauerte zweieinhalb Jahre und führte',
      'dieselbe Strecke zurück — im Sommer 1944 zerbrach bei der Operation',
      'Bagration die gesamte Heeresgruppe Mitte, im April 1945 stand die Rote',
      'Armee vor Berlin.',
    ].join(' '),
  },
  {
    id: 'normandie',
    name: 'Die Landung in der Normandie, 6. Juni 1944',
    von: p(-1.1, 50.78),
    ueber: [p(-0.6, 49.4)],
    nach: beiPunkt('paris'),
    text: [
      'Am 6. Juni 1944 landeten rund 156 000 amerikanische, britische,',
      'kanadische und alliierte Soldaten an fünf Abschnitten der',
      'normannischen Küste — die größte Landungsoperation der Geschichte. Die',
      'deutsche Führung hatte den Hauptangriff bei Calais erwartet. Innerhalb',
      'weniger Wochen standen über eine Million Soldaten in Frankreich; am',
      '25. August war Paris frei, im September stand die Front an der',
      'deutschen Westgrenze. Für die deutschen Soldaten, die dort lagen, war',
      'der 6. Juni der Tag, an dem der Krieg endgültig in zwei Richtungen',
      'zugleich verloren ging. Für die Menschen in den besetzten Ländern war',
      'er der Anfang der Befreiung. Beides ist wahr, und es ist derselbe Tag —',
      'das ist der Kern dieses Kapitels.',
    ].join(' '),
  },
  {
    id: 'flucht-vertreibung',
    name: 'Flucht und Vertreibung, 1944/45',
    von: p(20.5, 54.72),
    ueber: [beiPunkt('dresden')],
    nach: p(9.0, 52.0),
    text: [
      'Im Herbst 1944 erreichte die Rote Armee Ostpreußen. Was dann begann,',
      'war die größte Fluchtbewegung, die Europa je gesehen hat: Zwölf bis',
      'vierzehn Millionen Deutsche verließen Ostpreußen, Pommern, Schlesien,',
      'das Sudetenland und die Siedlungsgebiete in Südosteuropa — zuerst auf',
      'der Flucht, dann, nach der Potsdamer Konferenz vom August 1945, durch',
      'Vertreibung und Aussiedlung. Viele zogen im Winter auf Trecks über das',
      'Eis des Frischen Haffs; beim Untergang der „Wilhelm Gustloff" am 30.',
      'Januar 1945 starben über 9 000 Menschen, die meisten davon',
      'Flüchtlinge. Wie viele insgesamt umkamen, ist umstritten: Eine ältere',
      'amtliche Schätzung nannte zwei Millionen, neuere Forschung kommt auf',
      'rund eine halbe Million belegbarer Todesfälle. Das Leid dieser Menschen',
      'ist wirklich, und es gehört in dieses Kapitel. Es steht hier neben dem,',
      'was deutsche Truppen zuvor in denselben Ländern getan hatten — nicht',
      'dagegen. Eine Rechnung wird daraus nicht.',
    ].join(' '),
  },
];

// ---------------------------------------------------------------------------
// Beschriftungen
// ---------------------------------------------------------------------------

const beschriftungen = [
  { text: 'Atlantik', art: 'meer', ...ort(-9.5, 47.5) },
  { text: 'Nordsee', art: 'meer', ...ort(3.5, 56.0) },
  { text: 'Ostsee', art: 'meer', ...ort(19.0, 57.0) },
  { text: 'Mittelmeer', art: 'meer', ...ort(16.0, 35.5) },
  { text: 'Schwarzes Meer', art: 'meer', ...ort(34.0, 43.2) },
  { text: 'Kaspisches Meer', art: 'meer', ...ort(47.3, 44.5), drehung: -90 },
  { text: 'Deutsches Reich', art: 'land', ...ort(10.6, 52.0) },
  { text: 'Frankreich', art: 'land', ...ort(2.3, 46.6) },
  { text: 'Großbritannien', art: 'land', ...ort(-2.6, 53.0) },
  { text: 'Irland', art: 'land', ...ort(-8.2, 53.3) },
  { text: 'Spanien', art: 'land', ...ort(-4.0, 40.2) },
  { text: 'Portugal', art: 'land', ...ort(-8.1, 39.6), drehung: -80 },
  { text: 'Italien', art: 'land', ...ort(13.0, 42.5), drehung: 55 },
  { text: 'Polen', art: 'land', ...ort(20.0, 52.6) },
  { text: 'Sowjetunion', art: 'land', ...ort(38.0, 55.0) },
  { text: 'Ukraine', art: 'land', ...ort(32.0, 49.5) },
  { text: 'Weißrussland', art: 'land', ...ort(28.0, 53.6) },
  { text: 'Finnland', art: 'land', ...ort(26.0, 61.3) },
  { text: 'Schweden', art: 'land', ...ort(15.0, 59.5) },
  { text: 'Norwegen', art: 'land', ...ort(8.5, 60.5) },
  { text: 'Dänemark', art: 'land', ...ort(9.3, 56.3) },
  { text: 'Niederlande', art: 'land', ...ort(5.2, 52.6) },
  { text: 'Belgien', art: 'land', ...ort(4.4, 50.5) },
  { text: 'Schweiz', art: 'land', ...ort(7.7, 46.8) },
  { text: 'Österreich', art: 'land', ...ort(14.2, 47.4) },
  { text: 'Ungarn', art: 'land', ...ort(19.3, 47.0) },
  { text: 'Rumänien', art: 'land', ...ort(25.0, 46.0) },
  { text: 'Jugoslawien', art: 'land', ...ort(19.5, 44.2) },
  { text: 'Bulgarien', art: 'land', ...ort(25.0, 42.6) },
  { text: 'Griechenland', art: 'land', ...ort(21.9, 39.5) },
  { text: 'Türkei', art: 'land', ...ort(33.0, 38.8) },
  { text: 'Nordafrika', art: 'land', ...ort(2.0, 34.6) },
];

const hoehe = geo.hoehe;
const breite = geo.breite;

module.exports = {
  breite,
  hoehe,
  basis,
  phasen,
  punkte,
  bewegungen,
  beschriftungen,
};
