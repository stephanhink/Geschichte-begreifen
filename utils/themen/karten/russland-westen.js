// Die Karte zum Thema „Russland und der Westen" — Geschichte in Bewegung.
//
// Die Küstenlinien stehen als echte Längen-/Breitengrade `[lon, lat]` und
// werden von utils/karte-geo.js in SVG-Koordinaten umgerechnet. Wer einen
// Punkt anzweifelt, schlägt ihn im Atlas nach: `[30.52, 50.45]` ist Kyjiw,
// `[37.62, 55.75]` ist Moskau, `[44.79, 41.72]` ist Tiflis.
//
// Der Ausschnitt: 10° W bis 48° O, 34° N bis 62° N — 700 × 505. Das sind
// 12,1 SVG-Einheiten je Längengrad. Der Rahmen ist fast derselbe wie bei der
// Karte zum Kalten Krieg (10° W–45° O, 34–61° N), und das ist Absicht: Dieses
// Kapitel setzt jenes fort, und wer die beiden Karten nebeneinanderlegt, soll
// dieselbe Bühne mit anderen Grenzen sehen. Nach Osten und Norden steht der
// Rahmen eine Spur weiter, und zwar aus zwei Gründen, die im Kapitel selbst
// stehen:
//
//   * Tiflis liegt auf 44,79° O. Der Krieg vom August 2008 gehört nach
//     Betreiber-Vorgabe in dieses Kapitel — bei 45° O hätte Georgien am
//     äußersten Bildrand geklebt.
//   * Helsinki liegt auf 60,17° N, Stockholm auf 59,33° N. Finnland trat der
//     NATO 2023 bei, Schweden 2024 — der letzte Umschaltzustand dieser Karte
//     erzählt genau das, und dafür müssen beide Hauptstädte lesbar im Bild
//     liegen und nicht auf der Oberkante.
//
// Was dieser Ausschnitt kostet, steht hier, damit niemand es für einen Fehler
// hält:
//
//   * Nordskandinavien, der Ural, das nördliche Russland und Zentralasien
//     laufen über den Bildrand hinaus. Russland ist nur mit seinem
//     europäischen Teil zu sehen — das ist rund ein Viertel des Landes und
//     etwa drei Viertel seiner Bevölkerung.
//   * Die USA und Kanada, die beiden größten NATO-Mitglieder, liegen
//     außerhalb. Der Hinweis der ersten Phase sagt das.
//   * Vom Kaspischen Meer ist nur der westliche Rand zu sehen; Baku liegt
//     schon hinter der rechten Kante.
//
// Sieben Festlegungen, die ausdrücklich hierher gehören:
//
//   1. **Die Karte datiert, sie bewertet nicht.** Jede Fläche trägt ihren
//      Zustand mit Jahreszahl im Titel — „Krim — seit März 2014 von Russland
//      annektiert; völkerrechtlich weiter Ukraine". Das ist keine Meinung,
//      sondern der Stand des Völkerrechts (UN-Resolution 68/262 vom
//      27. März 2014, 100 Ja-Stimmen). Ob eine Grenze recht oder unrecht ist,
//      entscheidet nicht die Karte; darüber sprechen die Perspektiven, und
//      urteilen die Lernenden selbst.
//   2. **Die politischen Grenzen sind angenähert, nicht vermessen** — anders
//      als die Küstenlinien, die auf echten Atlas-Koordinaten beruhen. Das ist
//      dieselbe Praxis wie bei allen Karten der App. Besonders gilt das für
//      die Frontlinie in der Ukraine: Sie hat sich seit 2022 mehrfach
//      verschoben, und jede gezeichnete Linie ist ein Stand, kein Zustand.
//      Der Titel der Fläche sagt das selbst.
//   3. **Die NATO steht als eine Fläche aus vielen Ringen da**, nicht als
//      dreißig einzelne Staaten. Die App färbt alle Flächen einer Phase gleich
//      ein (components/abschnitte/KarteAbschnitt.js), einzeln gezeichnete
//      Staaten wären also ohnehin nicht zu unterscheiden — und die Aussage
//      dieses Kapitels ist genau die: eine Allianz, die dreimal wächst. Wer
//      wissen will, wer wann dazukam, liest den Titel der Fläche; dort stehen
//      die Namen mit ihren Beitrittsjahren.
//   4. **Russland liegt in jeder Phase zweimal auf der Karte** — einmal als
//      Staatsfläche und einmal deckungsgleich darüber. Das ist kein Versehen,
//      sondern der einzige Weg, auf dieser Karte zwei Töne zu bekommen: Die
//      App füllt jede Fläche halbdurchsichtig (0,72), zwei Lagen übereinander
//      ergeben einen dunkleren Ton. Dieselbe Mechanik trägt West-Berlin auf
//      der Karte zum Kalten Krieg. Der Betreiber hat für dieses Kapitel „NATO
//      hell, Russland dunkel" vorgegeben; so ist es umgesetzt, und der Titel
//      der zweiten Lage sagt offen, was sie ist.
//   5. **Die Krim und die besetzten Gebiete sind eigene Flächen.** Sie sind
//      der Gegenstand dieses Kapitels und dürfen weder in Russland noch in der
//      Ukraine verschwinden. Beide tragen im Titel, wer sie kontrolliert UND
//      wem sie völkerrechtlich zugerechnet werden — beides, nicht eines von
//      beiden.
//   6. **Eingefärbt wird nur, wo eine Herrschaft mit Grenzen plausibel ist.**
//      Serbien, Bosnien, die Schweiz, Österreich, Moldau und Irland bleiben in
//      jeder Phase ungefärbt: Sie gehören zu keiner der Seiten, die diese
//      Karte zeigt. Ungefärbt heißt hier nicht „leer", sondern „nicht Teil
//      dieser Rechnung".
//   7. **Kein Pfeil steht für eine Absicht.** Die Bewegungen zeigen, was
//      geschah — Beitritte, Truppenwege —, nicht, was jemand vorhatte.
//
// Reine Daten und Rechnung — keine UI-Importe (Architektur-Regel).

const { KARTENFARBEN, erstelleProjektion, rueckwaerts, verbinde } = require('../../karte-geo');

// ---------------------------------------------------------------------------
// Ausschnitt und Projektion
// ---------------------------------------------------------------------------

const RAHMEN = { minLon: -10, maxLon: 48, minLat: 34, maxLat: 62, breite: 700 };

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

/** Die Ostsee-Ostküste von St. Petersburg bis Danzig. */
const OSTSEE_OST = [
  [30.3, 59.94], // St. Petersburg, an der Newamündung
  [29.2, 60.05],
  [28.0, 59.9],
  [27.7, 59.47], // Narva, an der Grenze zwischen Estland und Russland
  [26.4, 59.48],
  [25.2, 59.6],
  [24.75, 59.44], // Tallinn
  [23.9, 59.2],
  [23.3, 58.55],
  [24.0, 58.3],
  [24.5, 57.85], // Pärnu
  [24.4, 57.6],
  [24.35, 57.4],
  [24.1, 57.05], // Riga, an der Düna
  [23.6, 56.95],
  [23.1, 57.15],
  [22.6, 57.75], // Kap Kolka
  [21.7, 57.5],
  [21.05, 56.55], // Liepāja
  [20.95, 56.05],
  [21.05, 55.7], // Klaipėda (Memel), an der Memelmündung
  [20.9, 55.3],
  [20.5, 55.0],
  [19.9, 54.65], // Baltijsk (Pillau) — seit 1991 in der russischen Oblast Kaliningrad
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
  [15.58, 54.18], // Kołobrzeg (Kolberg)
  [14.9, 54.05],
  [14.25, 53.92], // Świnoujście — hier erreicht die Oder-Neiße-Grenze das Meer
  [13.75, 54.05],
  [13.4, 54.15],
  [13.1, 54.31], // Stralsund
  [12.6, 54.15],
  [12.1, 54.18], // Rostock
  [11.5, 54.15],
  [11.46, 53.9], // Wismar
  [10.87, 53.87], // Lübeck — hier begann der Eiserne Vorhang
  [10.75, 54.1],
  [10.4, 54.2],
  [10.13, 54.33], // Kiel
];

/** Jütlands Ostküste: Kiel → Flensburg → Skagen. */
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
  [8.4, 54.9],
  [8.65, 54.6],
  [9.05, 54.48], // Husum
  [8.85, 54.2],
  [8.7, 53.87], // Elbmündung
];

/** Die Nordseeküste: Elbmündung → Zuiderzee → Rheinmündung → Calais. */
const NORDSEE = [
  [8.7, 53.87],
  [8.5, 53.6], // Wesermündung
  [8.15, 53.5],
  [7.2, 53.6], // Emsmündung — Grenze zu den Niederlanden
  [6.8, 53.45],
  [6.2, 53.45],
  [5.6, 53.4], // Friesland
  [5.4, 52.9],
  [5.3, 52.5],
  [5.05, 52.35], // das Südende des IJsselmeers, bei Amsterdam
  [4.9, 52.45],
  [5.0, 52.75],
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
  [0.65, 49.7],
  [0.2, 49.5], // Seinemündung, Le Havre
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
  [-2.2, 47.28], // Loiremündung
  [-1.8, 46.7],
  [-1.2, 46.3], // La Rochelle
  [-1.1, 45.6], // Gironde
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
  [-8.8, 42.24], // die Ría von Vigo
  [-8.87, 41.87], // Minhomündung — die Grenze zu Portugal
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
  [-7.4, 37.17], // Guadianamündung
  [-6.95, 37.2], // Huelva
  [-6.35, 36.85], // Mündung des Guadalquivir
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
  [0.87, 40.72], // Ebrodelta
  [1.2, 41.1],
  [2.17, 41.38], // Barcelona
  [2.8, 41.7],
  [3.2, 41.9],
  [3.28, 42.32], // Cap de Creus
];

/** Die Mittelmeerküste Frankreichs: Cap de Creus → Genua. */
const FRANKREICH_MITTELMEER = [
  [3.28, 42.32],
  [3.05, 43.0], // Golfe du Lion
  [3.7, 43.4], // Sète
  [4.4, 43.45],
  [4.85, 43.35], // Rhônedelta
  [5.36, 43.3], // Marseille
  [6.0, 43.1], // Toulon
  [6.6, 43.15],
  [7.07, 43.56], // Golf von Juan
  [7.6, 43.8], // Nizza
  [8.3, 44.15],
  [8.95, 44.4], // Genua
];

/** Die Westküste Italiens: Genua → Straße von Messina. */
const ITALIEN_WEST = [
  [8.95, 44.4],
  [9.6, 44.15],
  [10.1, 43.9],
  [10.3, 43.65], // Arnomündung bei Pisa
  [10.5, 43.0],
  [11.15, 42.4],
  [11.8, 42.1], // Civitavecchia
  [12.25, 41.75], // Ostia, der Hafen Roms
  [12.9, 41.25],
  [13.6, 41.2], // Gaeta
  [14.0, 40.85], // der Golf von Neapel
  [14.45, 40.63],
  [14.9, 40.6], // Salerno
  [15.3, 40.0],
  [15.6, 39.9],
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
  [17.98, 40.05], // Gallipoli
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
  [12.3, 44.8], // Podelta
  [12.3, 45.35], // die Lagune von Venedig
  [12.5, 45.5],
  [13.1, 45.6],
  [13.65, 45.7], // Triest — seit 1954 wieder italienisch
];

/** Die Ostküste der Adria: Triest → Bar → die Buna-Mündung. */
const BALKAN_ADRIA = [
  [13.65, 45.7],
  [13.75, 45.5], // Koper, kurz hinter der italienischen Grenze
  [13.9, 44.9], // Istrien
  [14.5, 45.3], // die Kvarner-Bucht
  [15.0, 44.3],
  [15.9, 43.7], // Šibenik
  [16.45, 43.5], // Split
  [17.3, 42.9],
  [18.1, 42.6], // Dubrovnik
  [18.55, 42.4], // die Bucht von Kotor
  [19.1, 42.09], // Bar
  [19.35, 41.85], // die Buna-Mündung — die Grenze zu Albanien
];

/** Die albanische Küste: Buna-Mündung → Vlora → die griechische Grenze. */
const ALBANIEN_KUESTE = [
  [19.35, 41.85],
  [19.45, 41.6],
  [19.5, 41.31], // Durrës
  [19.35, 40.9],
  [19.49, 40.46], // Vlora
  [19.9, 40.1],
  [20.0, 39.87], // Sarandë, gegenüber Korfu — die Grenze zu Griechenland
];

/**
 * Die griechische Westküste: Grenze zu Albanien → Peloponnes → Piräus.
 *
 * Neu gegenüber der Karte zum Ersten Weltkrieg, die Griechenland nur
 * angedeutet hat: Hier ist es NATO-Mitglied seit 1952 und der Ort, an dem
 * die Truman-Doktrin 1947 ihren Anlass hatte. Athen muss auf die Karte.
 */
const GRIECHENLAND_WEST = [
  [20.0, 39.87],
  [20.25, 39.5], // Igoumenitsa
  [20.75, 38.96], // Preveza
  [21.1, 38.35],
  [21.4, 38.3],
  [21.73, 38.25], // Patras
  [21.32, 38.15],
  [21.13, 37.93], // Killini
  [21.4, 37.65], // Katakolo
  [21.67, 37.25], // Kyparissia
  [21.7, 36.82], // Methoni, die Südwestspitze der Peloponnes
  [22.11, 37.03], // Kalamata
  [22.38, 36.72],
  [22.48, 36.39], // Kap Tainaron, die Südspitze des Festlands
  [22.57, 36.76], // Gythio
  [22.85, 36.8],
  [23.05, 36.69], // Monemvasia
  [23.2, 36.43], // Kap Malea
  [23.05, 36.9],
  [22.8, 37.57], // Nafplio
  [23.15, 37.7],
  [22.93, 37.94], // Korinth, am Isthmus
  [23.35, 37.93],
  [23.64, 37.94], // Piräus, der Hafen Athens
];

/** Die griechische Ostküste: Piräus → Thessaloniki → die Evros-Mündung. */
const GRIECHENLAND_OST = [
  [23.64, 37.94],
  [24.03, 37.65], // Kap Sounion
  [23.9, 38.0],
  [24.05, 38.25], // Euböa, hier zum Festland vereinfacht
  [23.6, 38.46], // Chalkida
  [23.4, 39.0],
  [22.94, 39.36], // Volos
  [23.3, 39.9],
  [22.6, 40.3],
  [22.94, 40.63], // Thessaloniki
  [23.4, 40.4],
  [23.7, 40.2], // die Chalkidiki
  [24.0, 40.6],
  [24.4, 40.95], // Kavala
  [25.2, 40.85],
  [25.9, 40.85], // die Evros-Mündung — die Grenze zur Türkei
];

/** Die Nordküste des Marmarameers: Gallipoli → Bosporus. */
const MARMARA_NORD = [
  [26.4, 40.35], // die Halbinsel Gallipoli
  [27.0, 40.5],
  [27.9, 40.4],
  [28.7, 40.95],
  [28.98, 41.02], // Istanbul
  [29.1, 41.2], // der Bosporus, am Schwarzen Meer
];

/** Das Westufer des Schwarzen Meeres: Bosporus → Constanța → Odessa. */
const SCHWARZMEER_WEST = [
  [29.1, 41.2],
  [28.0, 41.6],
  [27.5, 42.1],
  [27.85, 42.7],
  [27.9, 43.2], // Warna
  [28.15, 43.7],
  [28.6, 44.2], // Constanța
  [29.0, 44.7],
  [29.7, 45.2], // das Donaudelta
  [30.3, 45.9],
  [30.4, 46.3],
  [30.75, 46.48], // Odessa
];

/** Die Nordküste des Schwarzen Meeres: Odessa → Krim → Asowsches Meer. */
const SCHWARZMEER_NORD = [
  [30.75, 46.48],
  [31.5, 46.6],
  [32.0, 46.5], // Mündung des Dnjepr
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
  [40.5, 43.2],
  [41.55, 41.52], // Batumi — die georgisch-türkische Grenze am Meer
];

/** Anatoliens Schwarzmeerküste: Bosporus → die georgische Grenze. */
const ANATOLIEN_NORD = [
  [29.1, 41.2],
  [30.0, 41.2],
  [31.4, 41.15],
  [32.3, 41.8],
  [33.3, 42.0],
  [34.0, 41.95],
  [35.15, 42.03], // Sinop
  [36.0, 41.7],
  [36.33, 41.3], // Samsun
  [37.3, 41.3],
  [38.4, 41.0],
  [39.7, 41.0], // Trabzon
  [40.6, 41.1],
  [41.55, 41.52], // Batumi
];

/** Die Ostgrenze der Türkei: zu Georgien, Armenien, dem Iran, Irak und Syrien. */
const TUERKEI_OSTGRENZE = [
  [41.55, 41.52],
  [42.8, 41.4],
  [43.4, 40.9],
  [43.7, 40.1], // der Ararat, das Dreiländereck mit dem Iran
  [44.4, 38.5],
  [44.0, 37.4],
  [42.5, 37.2],
  [41.0, 37.1],
  [38.5, 36.9],
  [36.6, 36.6],
  [36.15, 35.95], // die syrische Grenze am Mittelmeer, bei Samandağ
];

/** Anatoliens Mittelmeerküste: die syrische Grenze → Bodrum. */
const ANATOLIEN_SUED = [
  [36.15, 35.95],
  [36.2, 36.6], // der Golf von İskenderun
  [35.4, 36.8], // Mersin, an der Bucht von Adana
  [34.0, 36.3], // Silifke
  [32.8, 36.1], // Anamur, die Südspitze Anatoliens
  [31.4, 36.8],
  [30.7, 36.88], // Antalya
  [29.1, 36.2], // Fethiye
  [28.1, 36.65],
  [27.3, 37.5], // Bodrum
];

/** Anatoliens Ägäisküste: Bodrum → Gallipoli. */
const ANATOLIEN_AEGAEIS = [
  [27.3, 37.5],
  [27.26, 37.86],
  [26.9, 38.42], // Izmir
  [26.7, 38.7],
  [26.85, 39.0],
  [26.7, 39.3],
  [26.2, 39.5],
  [26.2, 40.0],
  [26.4, 40.15], // Çanakkale, an den Dardanellen
  [26.4, 40.35], // Gallipoli
];

// ---------------------------------------------------------------------------
// Britannien, Irland, Skandinavien, Finnland, Nordafrika
// ---------------------------------------------------------------------------

/** Britanniens Ostküste: Duncansby Head → Dover. */
const BRITANNIEN_OST = [
  [-3.9, 58.6],
  [-2.9, 58.4],
  [-2.1, 57.7],
  [-2.1, 57.15], // Aberdeen
  [-2.45, 56.7],
  [-2.85, 56.45],
  [-3.4, 56.35],
  [-2.9, 56.2],
  [-2.6, 56.05],
  [-3.2, 56.0], // Firth of Forth, bei Edinburgh
  [-2.4, 55.95],
  [-1.9, 55.65],
  [-1.6, 55.05], // Tynemouth
  [-1.35, 54.65],
  [-0.55, 54.5], // Whitby
  [-0.1, 54.15],
  [-0.05, 53.65], // Humbermündung
  [0.2, 53.5],
  [0.1, 52.95], // The Wash
  [0.6, 52.8],
  [1.35, 52.95], // Cromer
  [1.75, 52.65], // Great Yarmouth
  [1.6, 52.1],
  [1.3, 51.95], // Harwich
  [0.95, 51.5], // Themsemündung
  [1.4, 51.38],
  [1.4, 51.1], // Dover
];

/** Britanniens Südküste: Dover → Land's End. */
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
  [-5.72, 50.07], // Land's End
];

/** Britanniens Westküste: Land's End → Cape Wrath. */
const BRITANNIEN_WEST = [
  [-5.72, 50.07],
  [-4.2, 51.2],
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
  [-5.2, 57.6],
  [-5.0, 58.6], // Cape Wrath
];

/** Die Küste Nordirlands: Lough Foyle → Carlingford Lough. */
const NORDIRLAND_KUESTE = [
  [-7.25, 55.05], // Lough Foyle
  [-6.9, 55.2],
  [-6.0, 55.2],
  [-5.55, 54.7], // Belfast Lough
  [-5.55, 54.25], // Strangford Lough
  [-6.2, 54.05], // Carlingford Lough
];

/** Die Küste der Republik Irland: Carlingford Lough → Lough Foyle. */
const IRLAND_KUESTE = [
  [-6.2, 54.05],
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
  [-7.25, 55.05],
];

/** Die innerirische Grenze — seit 1921 die Grenze zwischen Irland und dem Vereinigten Königreich. */
const IRLAND_GRENZE = [
  [-6.2, 54.05],
  [-6.6, 54.2],
  [-7.0, 54.4],
  [-7.4, 54.75],
  [-7.25, 55.05],
];

/** Schwedens Küste: von Norden über Stockholm und Malmö nach Göteborg und Svinesund. */
const SCHWEDEN_KUESTE = [
  [17.4, 62.5], // über dem oberen Bildrand, bei Sundsvall
  [17.1, 61.73], // Hudiksvall
  [17.06, 61.3], // Söderhamn
  [17.14, 60.67], // Gävle
  [17.9, 60.6],
  [18.3, 60.1],
  [18.7, 59.76], // Norrtälje
  [18.07, 59.33], // Stockholm
  [17.6, 58.9],
  [17.0, 58.75], // Nyköping
  [16.75, 57.9], // Västervik
  [16.5, 57.3],
  [16.45, 56.9], // der Kalmarsund
  [16.2, 56.5],
  [15.6, 56.2], // Karlskrona
  [14.7, 56.1],
  [14.2, 55.85],
  [14.35, 55.4], // Sandhammaren
  [13.6, 55.38],
  [13.0, 55.38], // Trelleborg
  [12.7, 55.55], // Malmö, am Öresund
  [12.8, 56.0], // Helsingborg
  [12.5, 56.3],
  [12.85, 56.65], // Halmstad
  [12.25, 57.25], // Varberg
  [11.95, 57.7], // Göteborg
  [11.93, 58.35],
  [11.17, 58.94], // Svinesund — die Grenze zu Norwegen
];

/** Norwegens Küste: Svinesund → Oslo → Lindesnes → Bergen. */
const NORWEGEN_KUESTE = [
  [11.17, 58.94],
  [10.93, 59.22], // Fredrikstad, am Oslofjord
  [10.75, 59.91], // Oslo
  [10.4, 59.55],
  [10.03, 59.05], // Larvik
  [9.4, 58.87],
  [8.77, 58.46], // Arendal
  [8.0, 58.15], // Kristiansand
  [7.05, 57.98], // Lindesnes, die Südspitze Norwegens
  [6.66, 58.3],
  [6.0, 58.45], // Egersund
  [5.6, 58.75],
  [5.73, 58.97], // Stavanger
  [5.27, 59.41], // Haugesund
  [5.6, 59.9],
  [5.32, 60.39], // Bergen
  [5.1, 61.0],
  [5.9, 61.5], // Nordfjord
  [6.15, 62.47], // Ålesund — über dem oberen Bildrand
];

/** Die norwegisch-schwedische Grenze — von Norden herunter nach Svinesund. */
const NORWEGEN_GRENZE = [
  [12.2, 62.5],
  [12.3, 61.4],
  [12.5, 60.3],
  [12.2, 59.4],
  [11.7, 59.15],
  [11.17, 58.94],
];

/** Finnlands Südküste: von Norden über Turku und Helsinki bis St. Petersburg. */
const FINNLAND_KUESTE = [
  [21.37, 62.5], // über dem oberen Bildrand, bei Kristinestad
  [21.5, 61.48], // Pori
  [21.5, 61.13], // Rauma
  [21.8, 60.8], // Uusikaupunki
  [22.27, 60.45], // Turku
  [22.0, 60.2],
  [22.97, 59.82], // Hanko, die Südspitze
  [23.5, 59.98],
  [24.94, 60.17], // Helsinki — hier wurde 1975 die KSZE-Schlussakte unterzeichnet
  [25.6, 60.35],
  [26.95, 60.47], // Kotka
  [27.6, 60.55], // Virolahti — die Grenze zu Russland, seit 1944 unverändert
  [28.75, 60.71], // Wyborg, seit 1944 sowjetisch und heute russisch
  [29.5, 60.2],
  [30.3, 59.94], // St. Petersburg, an der Newamündung
];

/**
 * Die finnisch-russische Grenze — seit 1944 unverändert, seit 1991 die Grenze
 * zur Russischen Föderation und seit dem 4. April 2023 zugleich NATO-Grenze.
 * 1 340 Kilometer; sie hat die Landgrenze der NATO zu Russland mehr als
 * verdoppelt.
 */
const FINNLAND_GRENZE = [
  [27.6, 60.55],
  [28.3, 60.9],
  [29.1, 61.5],
  [30.0, 62.0],
  [30.6, 62.5],
];

/** Die Küste Nordwestafrikas: Tanger → Kap Bon → Mahdia. */
const NORDAFRIKA = [
  [-5.93, 35.79], // Tanger
  [-5.3, 35.9], // Ceuta
  [-4.3, 35.2],
  [-3.93, 35.25], // Al Hoceima
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
// Inseln
// ---------------------------------------------------------------------------

const KORSIKA = [
  [9.35, 42.98],
  [9.45, 42.7], // Bastia
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
  [15.65, 38.27],
  [15.3, 37.85],
  [15.09, 37.5], // Catania
  [15.29, 37.07], // Syrakus
  [15.14, 36.68], // Kap Passero
  [14.5, 36.8],
  [14.25, 37.07],
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

const BORNHOLM = [
  [14.7, 55.1],
  [14.75, 55.28],
  [15.1, 55.3],
  [15.15, 55.05],
  [14.85, 54.98],
];

const GOTLAND = [
  [18.3, 57.9],
  [19.0, 57.85],
  [18.9, 57.4],
  [18.4, 57.1],
  [18.1, 57.35],
  [18.15, 57.7],
];

// ---------------------------------------------------------------------------
// Flüsse
// ---------------------------------------------------------------------------

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
  [17.1, 48.15], // Bratislava
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
  [13.7, 51.05], // Dresden
  [12.99, 51.56], // Torgau an der Elbe
  [12.65, 51.87],
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

/** Die Lausitzer Neiße — seit 1945 zusammen mit der Oder die deutsch-polnische Grenze. */
const NEISSE = [
  [15.35, 50.75],
  [15.0, 51.0],
  [14.95, 51.35],
  [14.72, 51.6],
  [14.7, 52.0],
  [14.55, 52.35],
];

const WEICHSEL = [
  [19.0, 49.6],
  [19.94, 50.06], // Krakau
  [21.0, 51.4],
  [21.0, 52.23], // Warschau
  [19.5, 52.7],
  [18.6, 53.02],
  [18.8, 53.7],
  [18.65, 54.35],
];

const THEMSE = [
  [-1.7, 51.7],
  [-0.5, 51.6],
  [-0.13, 51.51], // London
  [0.6, 51.5],
  [0.95, 51.5],
];

/** Der Dnipro (Dnjepr): von Smolensk über Kyjiw bis zum Schwarzen Meer. */
const DNIPRO = [
  [32.05, 54.78], // Smolensk
  [31.0, 53.9],
  [30.6, 53.0],
  [30.5, 52.1],
  [30.9, 51.3], // die Mündung des Prypjat, bei Tschernobyl
  [30.52, 50.45], // Kyjiw
  [31.5, 49.5],
  [32.9, 49.05], // Krementschuk
  [34.1, 48.5], // Dnipro (früher Dnipropetrowsk)
  [35.1, 47.85], // Saporischschja
  [34.4, 47.3],
  [33.4, 46.75], // Nowa Kachowka
  [32.6, 46.63], // Cherson
  [32.3, 46.55],
];

/** Der Don: von Woronesch über Rostow ins Asowsche Meer. */
const DON = [
  [39.2, 51.67], // Woronesch
  [40.1, 50.6],
  [41.0, 49.9],
  [42.1, 49.6],
  [43.5, 48.8], // die Wolga-Don-Enge bei Wolgograd
  [42.2, 48.0],
  [40.9, 47.55],
  [39.7, 47.25], // Rostow am Don
  [39.3, 47.1],
];

/** Die Wolga, soweit sie in den Ausschnitt fällt: Nischni Nowgorod → Astrachan. */
const WOLGA = [
  [44.0, 56.33], // Nischni Nowgorod
  [45.5, 55.6],
  [46.8, 54.8],
  [46.0, 53.2], // Saratow-Bogen
  [45.5, 52.0],
  [45.0, 50.5],
  [44.5, 48.7], // Wolgograd
  [45.7, 47.5],
  [46.4, 46.5],
  [47.5, 46.0], // Astrachan, im Wolgadelta
];

// ---------------------------------------------------------------------------
// Das Kaspische Meer — nur sein westlicher Rand fällt in den Ausschnitt
// ---------------------------------------------------------------------------

/**
 * Die Westküste des Kaspischen Meeres, von Süden nach Norden notiert.
 *
 * Baku liegt auf 49,9° O und damit hinter der rechten Bildkante; die Punkte
 * dort stehen trotzdem in der Liste, damit die Linie nicht am Rand abknickt,
 * sondern sauber aus dem Bild läuft (die SVG-Fläche schneidet ab).
 */
const KASPI_WEST = [
  [48.85, 38.45], // Astara, die Grenze zwischen Iran und Aserbaidschan
  [49.5, 39.1],
  [49.9, 40.4], // Baku
  [49.4, 40.9],
  [48.9, 41.4],
  [48.6, 41.8], // die Mündung des Samur
  [48.35, 42.05],
  [47.9, 42.55],
  [47.5, 42.98], // Machatschkala
  [47.35, 43.5],
  [47.2, 44.0],
  [47.25, 44.6],
  [47.1, 45.2],
  [46.95, 45.7], // die Kisljar-Bucht
  [47.4, 45.9],
  [48.0, 46.05], // das Wolgadelta
  [48.8, 46.4],
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

const KONTINENT = verbinde(
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
  ALBANIEN_KUESTE,
  GRIECHENLAND_WEST,
  GRIECHENLAND_OST,
  [
    [26.3, 40.6], // die türkische Küste Ostthrakiens
  ],
  MARMARA_NORD,
  SCHWARZMEER_WEST,
  SCHWARZMEER_NORD,
  // Weiter nach Osten: das Vorland des Kaukasus, dann die Kaspi-Küste hinauf.
  [
    [42.0, 41.2],
    [43.5, 40.6],
    [45.0, 39.8],
    [46.5, 39.2],
    [47.8, 38.7],
  ],
  KASPI_WEST,
  // Rückweg über dem Bild: die russische Ebene und der Norden.
  [
    [49.5, 47.0],
    [49.5, 62.6],
    [30.6, 62.6],
  ],
  rueckwaerts(FINNLAND_GRENZE),
  [
    [28.75, 60.71],
    [29.5, 60.2],
  ],
);

const KLEINASIEN = verbinde(
  ANATOLIEN_NORD,
  TUERKEI_OSTGRENZE,
  ANATOLIEN_SUED,
  ANATOLIEN_AEGAEIS,
);

const BRITANNIEN = verbinde(BRITANNIEN_OST, BRITANNIEN_SUED, BRITANNIEN_WEST);

const IRLAND = verbinde(NORDIRLAND_KUESTE, IRLAND_KUESTE);

const SKANDINAVIEN = verbinde(SCHWEDEN_KUESTE, NORWEGEN_KUESTE, [
  [6.0, 62.7],
  [17.4, 62.7],
]);

const FINNLAND_LANDMASSE = verbinde(FINNLAND_KUESTE, [
  [30.6, 62.7],
  [21.3, 62.7],
]);

const AFRIKA = verbinde(NORDAFRIKA, [
  [11.5, 34.0],
  [-6.5, 34.0],
  [-6.3, 35.2],
]);

/** Die Westgrenze Deutschlands: Emsmündung → Passau. */
const GRENZE_DEUTSCHLAND_WEST = [
  [7.2, 53.6], // die Emsmündung, Grenze zu den Niederlanden
  [6.8, 52.2],
  [6.0, 51.8],
  [6.1, 50.8], // bei Aachen, Grenze zu Belgien
  [6.15, 50.15],
  [6.37, 49.47], // das Dreiländereck bei Schengen
  [6.9, 49.2], // das Saarland
  [7.6, 49.05],
  [8.23, 48.97], // Lauterbourg, wo die Grenze den Rhein erreicht
  [7.8, 48.6], // der Rhein bei Straßburg
  [7.6, 47.6], // Basel, Grenze zur Schweiz
  [8.6, 47.6],
  [9.5, 47.5], // Bodensee
  [9.8, 47.55],
  [10.2, 47.4], // Grenze zu Österreich
  [11.0, 47.4],
  [12.2, 47.7], // bei Salzburg
  [13.0, 47.8],
  [13.46, 48.57], // Passau, das Dreiländereck zu Österreich und Tschechien
];

/** Die bayerisch-böhmische Grenze: Passau → das Vogtland. */
const GRENZE_DEUTSCHLAND_TSCHECHIEN_SUED = [
  [13.46, 48.57],
  [13.0, 49.1],
  [12.6, 49.5],
  [12.5, 49.95],
  [12.2, 50.2],
  [12.1, 50.32],
];

/** Die sächsisch-böhmische Grenze: das Vogtland → Zittau. */
const GRENZE_DEUTSCHLAND_TSCHECHIEN_NORD = [
  [12.1, 50.32],
  [12.5, 50.4],
  [13.0, 50.5], // das Erzgebirge
  [13.6, 50.7],
  [14.4, 50.9], // die Elbe bei Bad Schandau
  [14.8, 50.85],
  [15.0, 51.0], // das Dreiländereck an der Neiße bei Zittau
];

/** Die Oder-Neiße-Grenze — von Zittau bis an die Ostsee. Seit dem deutsch-polnischen Grenzvertrag vom 14. November 1990 endgültig anerkannt. */
const ODER_NEISSE_GRENZE = [
  [15.0, 51.0],
  [14.95, 51.35],
  [14.72, 51.6],
  [14.7, 52.0],
  [14.55, 52.35], // Frankfurt an der Oder
  [14.6, 52.75],
  [14.4, 53.05],
  [14.3, 53.35], // westlich von Stettin — die Stadt liegt seit 1945 in Polen
  [14.25, 53.7],
  [14.28, 53.93], // die Ostsee bei Ahlbeck und Świnoujście
];

/** Die Südgrenze Polens: Zittau → das Dreiländereck zur Ukraine. */
const GRENZE_POLEN_SUED = [
  [15.0, 51.0],
  [16.0, 50.6], // das Riesengebirge
  [16.7, 50.2],
  [17.7, 50.2],
  [18.5, 49.9],
  [19.5, 49.6], // die Hohe Tatra
  [21.0, 49.4],
  [22.5, 49.1],
];

/** Die Ostgrenze Polens — zu Kaliningrad, Litauen, Belarus und der Ukraine, notiert von Norden nach Süden. */
const GRENZE_POLEN_OST = [
  [19.65, 54.45], // das Frische Haff; nördlich davon die russische Oblast Kaliningrad
  [21.0, 54.32],
  [22.7, 54.3],
  [23.5, 53.9],
  [23.3, 52.6], // der Bug
  [23.6, 51.6],
  [24.0, 50.8],
  [23.5, 50.3],
  [22.5, 49.1],
];

/** Die Grenze zwischen der Slowakei und Ungarn. */
const GRENZE_UNGARN_NORD = [
  [17.1, 47.85],
  [17.7, 47.75],
  [18.5, 47.85],
  [19.5, 48.1],
  [20.5, 48.3],
  [21.5, 48.5],
  [22.15, 48.4],
];

/** Die Nordgrenze Österreichs: Ungarn → Slowakei → Tschechien → Passau. */
const GRENZE_OESTERREICH_NORD = [
  [17.1, 47.85],
  [16.9, 48.4],
  [16.6, 48.75],
  [15.5, 48.75],
  [15.0, 48.95],
  [14.7, 48.6],
  [14.0, 48.6],
  [13.46, 48.57],
];

const GRENZE_UNGARN_RUMAENIEN = [
  [22.0, 48.1],
  [22.3, 47.6],
  [21.7, 46.9],
  [21.0, 46.4],
  [20.75, 46.25],
];

const GRENZE_UNGARN_SUED = [
  [20.75, 46.25],
  [20.3, 46.13],
  [19.6, 46.17],
  [18.7, 45.87],
  [17.2, 46.0],
  [16.5, 46.5],
  [16.1, 46.87],
];

const GRENZE_UNGARN_OESTERREICH = [
  [16.1, 46.87],
  [16.4, 47.0],
  [16.5, 47.4],
  [17.1, 47.85], // hier lief bis 1989 der Eiserne Vorhang
];

const GRENZE_RUMAENIEN_NORDOST = [
  [22.0, 48.1],
  [23.0, 47.95],
  [24.5, 47.9],
  [26.0, 48.2], // die Bukowina
  [27.0, 47.6],
  [28.0, 46.9], // der Pruth
  [28.2, 46.5],
  [28.5, 45.8],
  [29.0, 45.4],
  [29.65, 45.25], // der Kilia-Arm der Donau
];

const GRENZE_RUMAENIEN_BULGARIEN = [
  [28.15, 43.7],
  [27.9, 43.95],
  [27.3, 44.1], // Silistra, an der Donau
  [26.5, 44.05],
  [25.0, 43.7],
  [23.5, 43.85],
  [22.7, 44.55],
];

const GRENZE_RUMAENIEN_SERBIEN = [
  [22.7, 44.55],
  [21.6, 45.2],
  [20.8, 45.6],
  [20.75, 46.25],
];

const GRENZE_BULGARIEN_SUED = [
  [28.0, 41.98], // Rezovo, die Grenze zur Türkei am Schwarzen Meer
  [27.2, 42.05],
  [26.6, 41.95],
  [26.3, 41.7],
  [26.0, 41.35], // das Dreiländereck bei Edirne
  [25.0, 41.3],
  [24.2, 41.55],
  [23.3, 41.4],
  [22.9, 41.35],
];

const GRENZE_BULGARIEN_WEST = [
  [22.9, 41.35],
  [22.6, 42.0],
  [22.4, 42.4],
  [22.5, 43.0],
  [22.35, 43.35],
  [22.6, 44.0],
  [22.7, 44.55],
];

const GRENZE_ALBANIEN_OST = [
  [19.35, 41.85],
  [19.8, 42.1],
  [20.5, 42.0],
  [20.6, 41.4],
  [21.0, 40.9],
];

const GRENZE_GRIECHENLAND_NORD = [
  [21.0, 40.9], // das Dreiländereck bei Ohrid
  [21.5, 41.1],
  [22.0, 41.2],
  [22.9, 41.35],
];

const GRENZE_ALBANIEN_GRIECHENLAND = [
  [20.0, 39.87],
  [20.4, 40.1],
  [20.7, 40.5],
  [21.0, 40.9],
];

/** Die Grenze zwischen Griechenland und der Türkei am Evros. */
const GRENZE_GRIECHENLAND_TUERKEI = [
  [25.9, 40.85],
  [26.3, 41.3],
  [26.3, 41.7],
  [26.6, 41.95],
];

const GRENZE_OESTERREICH_SUEDWEST = [
  [9.6, 47.35],
  [9.55, 47.05],
  [10.1, 46.85], // der Reschenpass
  [10.45, 46.85],
  [11.0, 46.9],
  [11.5, 47.0], // der Brenner
  [12.2, 46.9],
  [12.8, 46.6],
  [13.7, 46.5], // das Dreiländereck mit Italien und Slowenien
];

const GRENZE_OESTERREICH_SLOWENIEN = [
  [13.7, 46.5],
  [14.5, 46.5],
  [15.0, 46.6],
  [16.1, 46.87],
];

const GRENZE_OESTERREICH_DEUTSCHLAND = [
  [13.46, 48.57],
  [13.0, 47.8],
  [12.2, 47.7],
  [11.0, 47.4],
  [10.2, 47.4],
  [9.8, 47.55],
  [9.6, 47.35],
];

const GRENZE_ITALIEN_NORD = [
  [7.6, 43.8], // Nizza
  [7.0, 44.15],
  [6.85, 44.6],
  [7.1, 45.05],
  [7.0, 45.92],
  [8.0, 46.0],
  [8.9, 46.1],
  [8.4, 46.45],
  [9.0, 46.5],
  [10.1, 46.6],
  [10.45, 46.85], // das Dreiländereck mit der Schweiz und Österreich
  [11.0, 46.9],
  [11.5, 47.0], // der Brenner
  [12.2, 46.9],
  [12.8, 46.6],
  [13.7, 46.5],
  [13.6, 46.2],
  [13.6, 45.98],
  [13.8, 45.75],
  [13.65, 45.7], // Triest
];

const GRENZE_FRANKREICH_LAND = [
  [2.55, 51.07], // die belgische Grenze an der Küste
  [3.15, 50.79],
  [4.0, 50.35],
  [4.85, 49.8],
  [5.35, 49.62],
  [5.79, 49.54], // das Dreiländereck mit Belgien und Luxemburg
  [6.37, 49.47],
  [6.9, 49.2],
  [7.6, 49.05],
  [8.23, 48.97],
  [7.8, 48.6],
  [7.6, 47.6], // Basel
  [7.0, 47.5],
  [6.45, 46.8],
  [5.95, 46.5],
  [6.0, 46.15], // bei Genf
  [6.8, 46.05],
  [7.0, 45.92],
  [7.1, 45.05],
  [6.85, 44.6],
  [7.0, 44.15],
  [7.6, 43.8], // Nizza
];

const SCHWEIZ = [
  [9.6, 47.35],
  [9.55, 47.05],
  [9.0, 46.5],
  [8.4, 46.45],
  [8.9, 46.1],
  [8.0, 46.0],
  [7.0, 45.92],
  [6.8, 46.05],
  [6.0, 46.15],
  [5.95, 46.5],
  [6.45, 46.8],
  [7.0, 47.5],
  [7.6, 47.6],
  [8.6, 47.6],
  [9.5, 47.5],
];

const LUXEMBURG = [
  [5.79, 49.54],
  [6.15, 49.5],
  [6.37, 49.47],
  [6.5, 49.7],
  [6.4, 49.9],
  [6.15, 50.15],
  [5.85, 49.9],
  [5.75, 49.7],
];

/** Die Ostgrenze der drei baltischen Staaten — seit 1991 wieder Staatsgrenze, seit 2004 zugleich NATO-Grenze. */
const BALTIKUM_OSTGRENZE = [
  [21.05, 55.7], // die Memel bei Klaipėda
  [22.1, 55.05],
  [22.9, 54.9],
  [23.5, 54.5],
  [24.8, 54.2],
  [25.8, 54.5], // östlich von Vilnius
  [26.7, 55.3],
  [27.6, 55.8],
  [28.2, 56.2],
  [27.9, 57.3],
  [27.6, 58.0], // bei Pskow
  [27.7, 59.47], // Narva
];


// ---------------------------------------------------------------------------
// Grenzen, die es 1949 noch nicht gab — die Karte nach 1991
// ---------------------------------------------------------------------------

/**
 * Die Grenze zwischen Tschechien und der Slowakei.
 *
 * Sie entstand am 1. Januar 1993 durch die Teilung der Tschechoslowakei — die
 * einzige Staatsauflösung dieser Jahre, bei der kein Schuss fiel. Beide
 * Staaten traten der NATO später bei: Tschechien 1999, die Slowakei 2004.
 */
const GRENZE_TSCHECHIEN_SLOWAKEI = [
  [16.9, 48.4], // das Dreiländereck mit Österreich, nördlich von Bratislava
  [17.4, 48.85],
  [17.9, 48.9],
  [18.4, 49.3],
  [18.5, 49.9], // das Dreiländereck mit Polen
];

/** Die Grenze zwischen Belarus und der Ukraine — seit 1991 Staatsgrenze. */
const GRENZE_BELARUS_UKRAINE = [
  [23.6, 51.6], // der Bug, das Dreiländereck mit Polen
  [24.5, 51.9],
  [26.0, 51.85],
  [27.7, 51.6],
  [29.2, 51.6], // nördlich von Tschernobyl
  [30.5, 51.9],
  [31.8, 52.1], // das Dreiländereck mit Russland
];

/** Die Grenze zwischen Belarus und Russland. */
const GRENZE_BELARUS_RUSSLAND = [
  [28.2, 56.2], // das Dreiländereck mit Lettland
  [29.5, 55.8],
  [30.9, 55.65],
  [31.3, 55.0],
  [31.9, 54.4],
  [32.7, 53.9], // westlich von Smolensk
  [31.8, 53.3],
  [31.4, 52.6],
  [31.8, 52.1], // das Dreiländereck mit der Ukraine
];

/**
 * Die Grenze zwischen der Ukraine und Russland — rund 2 000 Kilometer.
 *
 * Sie wurde 1997 im Freundschaftsvertrag und 2003 im Grenzvertrag von beiden
 * Seiten bestätigt. Notiert von Norden nach Süden, bis ans Asowsche Meer.
 */
const GRENZE_UKRAINE_RUSSLAND = [
  [31.8, 52.1],
  [33.2, 52.35],
  [34.4, 51.3],
  [35.4, 51.0],
  [36.3, 50.35], // zwischen Charkiw und Belgorod
  [37.5, 50.35],
  [38.2, 49.95],
  [39.8, 49.6],
  [40.1, 48.9],
  [39.7, 48.05],
  [38.9, 47.85],
  [38.4, 47.6],
  [38.35, 47.1], // das Asowsche Meer, östlich von Nowoasowsk
];

/** Die Grenze zwischen der Ukraine und der Republik Moldau. */
const GRENZE_UKRAINE_MOLDAU = [
  [26.0, 48.2], // am Pruth, wo Rumänien, Moldau und die Ukraine zusammentreffen
  [26.7, 48.3],
  [27.6, 48.45],
  [29.2, 48.15],
  [30.1, 47.4], // der Dnjestr; östlich davon liegt Transnistrien
  [29.6, 46.4],
  [28.9, 45.85],
  [28.2, 45.47], // Giurgiulești — Moldaus 400 Meter Donauufer
];

/**
 * Die Nordgrenze der Krim, vom Isthmus von Perekop bis zur Arabat-Nehrung.
 *
 * Sie liegt am Siwasch, einem flachen Sumpfmeer — die Halbinsel hängt nur an
 * einem sieben Kilometer breiten Streifen Land am Festland. Dieselbe Linie
 * trennt seit 2014 auf dieser Karte zwei Flächen.
 */
const KRIM_NORDGRENZE = [
  [33.6, 46.16], // Perekop
  [34.2, 45.95],
  [34.9, 45.9],
  [35.1, 46.1], // die Spitze der Arabat-Nehrung
];

/** Die Küste der Krim, vom Isthmus über Sewastopol und Kertsch zurück. */
const KRIM_KUESTE = [
  [33.6, 46.16],
  [33.5, 45.4],
  [33.4, 44.6], // Sewastopol
  [34.2, 44.4],
  [35.4, 44.9], // Feodossija
  [36.5, 45.35], // Kertsch, an der Meerenge
  [35.85, 45.45],
  [35.35, 45.35],
  [35.1, 46.1],
];

/** Die Asow- und Schwarzmeerküste der Ukraine, ohne die Krim. */
const UKRAINE_KUESTE_OST = [
  [38.35, 47.1],
  [37.3, 46.9], // Mariupol liegt an diesem Abschnitt
  [36.0, 46.4],
  [35.1, 46.2],
];

/** Die Küste der Ukraine westlich der Krim: Karkinitbucht → Odessa. */
const UKRAINE_KUESTE_WEST = [
  [33.6, 46.16],
  [32.6, 46.1],
  [32.0, 46.5], // die Mündung des Dnipro
  [31.5, 46.6],
  [30.75, 46.48], // Odessa
];

/**
 * Die Linie, an der die Front in der Ukraine seit 2023 ungefähr verläuft.
 *
 * **Angenähert und veränderlich** — genau wie es im Kopf dieser Datei steht:
 * Diese Linie hat sich seit Februar 2022 mehrfach verschoben (Rückzug aus dem
 * Norden im April 2022, Charkiw im September 2022, Cherson im November 2022,
 * danach kleinräumige Verschiebungen im Osten). Sie ist ein Stand, kein
 * Zustand. Notiert von Norden nach Süden.
 */
const FRONT_2024 = [
  [38.2, 49.95], // an der russischen Grenze, nördlich der Oblast Luhansk
  [38.05, 49.3],
  [37.85, 48.85],
  [37.55, 48.55], // bei Bachmut und Tschassiw Jar
  [37.35, 48.15],
  [36.9, 47.9],
  [36.2, 47.75],
  [35.6, 47.6], // nördlich von Melitopol
  [34.8, 47.4],
  [34.0, 47.2],
  [33.4, 46.7], // der Dnipro bei Nowa Kachowka
  [32.4, 46.5], // die Mündung des Dnipro; Cherson liegt nördlich davon
];

/**
 * Die Gebiete, die 2014 unter die Kontrolle der Separatisten kamen.
 *
 * Angenähert nach dem Stand nach dem Abkommen von Minsk (September 2014):
 * Donezk und Luhansk liegen darin, Mariupol und Kramatorsk nicht — beide
 * blieben unter ukrainischer Kontrolle.
 */
const SEPARATISTENGEBIET_2014 = [
  [37.35, 48.0],
  [37.5, 48.45],
  [38.2, 48.6],
  [38.9, 48.75],
  [39.5, 48.6],
  [39.9, 48.25],
  [39.6, 47.95],
  [38.7, 47.7],
  [37.9, 47.65],
  [37.4, 47.75],
];

/** Die Grenze Russlands im Kaukasus: zu Georgien und Aserbaidschan. */
const GRENZE_RUSSLAND_KAUKASUS = [
  [40.0, 43.4], // die Mündung des Psou am Schwarzen Meer
  [41.0, 43.4],
  [42.0, 43.3],
  [43.0, 42.75],
  [44.0, 42.7], // der Kasbek, an der Grusinischen Heerstraße
  [45.2, 42.55],
  [46.4, 41.9], // das Dreiländereck mit Aserbaidschan
  [47.3, 41.55],
  [48.6, 41.8], // die Mündung des Samur am Kaspischen Meer
];

// ---------------------------------------------------------------------------
// Die Flächen der Staaten
// ---------------------------------------------------------------------------

const DEUTSCHLAND = verbinde(
  GRENZE_DEUTSCHLAND_WEST,
  GRENZE_DEUTSCHLAND_TSCHECHIEN_SUED.slice(1),
  GRENZE_DEUTSCHLAND_TSCHECHIEN_NORD.slice(1),
  ODER_NEISSE_GRENZE.slice(1),
  kueste(OSTSEE_SUED, [14.25, 53.92], [10.13, 54.33]),
  kueste(JUETLAND_OST, [10.13, 54.33], [9.43, 54.79]),
  [
    [9.0, 54.9],
    [8.7, 54.9],
  ],
  kueste(JUETLAND_WEST, [8.7, 54.9], [8.7, 53.87]),
  kueste(NORDSEE, [8.7, 53.87], [7.2, 53.6]),
);

const POLEN = verbinde(
  rueckwaerts(ODER_NEISSE_GRENZE),
  GRENZE_POLEN_SUED.slice(1),
  rueckwaerts(GRENZE_POLEN_OST).slice(1),
  [
    [19.3, 54.55],
    [18.9, 54.65],
    [18.65, 54.35],
  ],
  kueste(OSTSEE_SUED, [18.65, 54.35], [14.25, 53.92]),
);

const TSCHECHIEN = verbinde(
  GRENZE_DEUTSCHLAND_TSCHECHIEN_NORD,
  kueste(GRENZE_POLEN_SUED, [15.0, 51.0], [18.5, 49.9]),
  rueckwaerts(GRENZE_TSCHECHIEN_SLOWAKEI).slice(1),
  kueste(GRENZE_OESTERREICH_NORD, [16.9, 48.4], [13.46, 48.57]),
  rueckwaerts(GRENZE_DEUTSCHLAND_TSCHECHIEN_SUED).slice(1),
);

const SLOWAKEI = verbinde(
  GRENZE_TSCHECHIEN_SLOWAKEI,
  kueste(GRENZE_POLEN_SUED, [18.5, 49.9], [22.5, 49.1]),
  [
    [22.3, 48.6],
    [22.15, 48.4],
  ],
  rueckwaerts(GRENZE_UNGARN_NORD).slice(1),
);

const UNGARN = verbinde(
  GRENZE_UNGARN_NORD,
  [
    [22.3, 48.3],
    [22.0, 48.1],
  ],
  GRENZE_UNGARN_RUMAENIEN.slice(1),
  GRENZE_UNGARN_SUED.slice(1),
  GRENZE_UNGARN_OESTERREICH.slice(1),
);

const RUMAENIEN = verbinde(
  rueckwaerts(GRENZE_UNGARN_RUMAENIEN),
  GRENZE_RUMAENIEN_NORDOST.slice(1),
  kueste(SCHWARZMEER_WEST, [29.7, 45.2], [28.15, 43.7]),
  GRENZE_RUMAENIEN_BULGARIEN.slice(1),
  GRENZE_RUMAENIEN_SERBIEN.slice(1),
);

const BULGARIEN = verbinde(
  rueckwaerts(GRENZE_RUMAENIEN_BULGARIEN),
  kueste(SCHWARZMEER_WEST, [28.15, 43.7], [27.5, 42.1]),
  GRENZE_BULGARIEN_SUED,
  GRENZE_BULGARIEN_WEST.slice(1),
);

const ALBANIEN = verbinde(
  ALBANIEN_KUESTE,
  GRENZE_ALBANIEN_GRIECHENLAND.slice(1),
  rueckwaerts(GRENZE_ALBANIEN_OST).slice(1),
);

/**
 * Slowenien und Kroatien als ein Ring.
 *
 * Beide traten der NATO im selben Jahrzehnt bei (Slowenien 2004, Kroatien
 * 2009) und liegen auf jeder Phase dieser Karte auf derselben Seite; getrennt
 * gezeichnet wären sie ohnehin nicht zu unterscheiden, weil die App alle
 * Flächen gleich einfärbt. Der Ring läuft die dalmatinische Küste hinunter und
 * innen um Bosnien-Herzegowina herum wieder hinauf — Bosnien bleibt
 * ausgespart, es ist kein NATO-Mitglied.
 */
const SLOWENIEN_KROATIEN = verbinde(
  [[13.65, 45.7]],
  kueste(BALKAN_ADRIA, [13.75, 45.5], [18.44, 42.56]),
  [
    [17.6, 43.0],
    [17.3, 43.4],
    [16.9, 43.65], // hinter Split; die Grenze zu Bosnien-Herzegowina
    [15.8, 44.2],
    [15.75, 44.8], // der Bogen um Bihać
    [16.1, 45.2],
    [16.9, 45.2],
    [17.8, 45.15],
    [18.6, 45.08], // die Save
    [19.0, 45.0],
    [19.0, 45.5],
    [18.9, 45.75],
  ],
  kueste(GRENZE_UNGARN_SUED, [18.7, 45.87], [16.1, 46.87]),
  rueckwaerts(GRENZE_OESTERREICH_SLOWENIEN).slice(1),
  [
    [13.6, 46.2],
    [13.6, 45.98],
    [13.8, 45.75],
  ],
);

/** Montenegro — NATO-Mitglied seit dem 5. Juni 2017. */
const MONTENEGRO = [
  [18.44, 42.56], // Prevlaka, die Grenze zu Kroatien
  [18.7, 42.35],
  [19.1, 42.1], // Bar
  [19.35, 41.9], // die Mündung der Bojana, die Grenze zu Albanien
  [19.6, 42.05],
  [19.8, 42.5],
  [20.35, 42.83], // die Grenze zum Kosovo
  [19.9, 43.1],
  [19.5, 43.25],
  [18.95, 43.35], // die Grenze zu Bosnien-Herzegowina
  [18.55, 42.85],
];

/** Nordmazedonien — NATO-Mitglied seit dem 27. März 2020. */
const NORDMAZEDONIEN = [
  [20.6, 41.4], // der Ohridsee, die Grenze zu Albanien
  [20.5, 41.75],
  [20.6, 42.0],
  [21.0, 42.2], // die Grenze zum Kosovo
  [21.7, 42.3],
  [22.35, 42.3], // die Grenze zu Serbien
  [22.9, 41.35], // das Dreiländereck mit Bulgarien und Griechenland
  [22.2, 41.15],
  [21.4, 40.95],
  [20.95, 40.85], // die Grenze zu Griechenland
  [20.65, 41.08],
];

const GRIECHENLAND = verbinde(
  GRIECHENLAND_WEST,
  GRIECHENLAND_OST.slice(1),
  GRENZE_GRIECHENLAND_TUERKEI.slice(1),
  rueckwaerts(GRENZE_BULGARIEN_SUED).slice(1),
  rueckwaerts(GRENZE_GRIECHENLAND_NORD).slice(1),
  rueckwaerts(GRENZE_ALBANIEN_GRIECHENLAND).slice(1),
);

/** Ostthrakien — der europäische Teil der Türkei. */
const TUERKEI_THRAKIEN = verbinde(
  rueckwaerts(GRENZE_GRIECHENLAND_TUERKEI),
  [
    [27.2, 42.05],
    [28.0, 41.98],
  ],
  kueste(SCHWARZMEER_WEST, [28.0, 41.6], [29.1, 41.2]),
  rueckwaerts(MARMARA_NORD).slice(1),
  [[26.3, 40.6]],
);

const FRANKREICH = verbinde(
  [[2.55, 51.07]],
  kueste(NORDSEE, [2.4, 51.1], [1.6, 50.95]),
  FRANKREICH_ATLANTIK,
  [
    [-0.7, 42.9],
    [0.6, 42.7],
    [1.9, 42.5],
    [3.28, 42.32],
  ],
  kueste(FRANKREICH_MITTELMEER, [3.28, 42.32], [7.6, 43.8]),
  rueckwaerts(GRENZE_FRANKREICH_LAND).slice(1),
);

const ITALIEN = verbinde(
  GRENZE_ITALIEN_NORD,
  kueste(ITALIEN_ADRIA, [13.65, 45.7], [16.87, 41.13]),
  kueste(ITALIEN_SUED, [16.87, 41.13], [15.65, 38.27]),
  kueste(ITALIEN_WEST, [15.65, 38.27], [8.95, 44.4]),
  kueste(FRANKREICH_MITTELMEER, [8.95, 44.4], [7.6, 43.8]),
);

const BELGIEN = verbinde(
  [[2.55, 51.07]],
  kueste(NORDSEE, [2.55, 51.07], [3.4, 51.45]),
  [
    [3.5, 51.3],
    [4.2, 51.35],
    [4.4, 51.45],
    [5.0, 51.45],
    [5.8, 51.2],
    [6.02, 50.75],
    [6.15, 50.15],
    [5.85, 49.9],
    [5.79, 49.54],
    [5.35, 49.62],
    [4.85, 49.8],
    [4.0, 50.35],
    [3.15, 50.79],
  ],
);

const NIEDERLANDE = verbinde(
  kueste(NORDSEE, [3.4, 51.45], [7.2, 53.6]),
  [
    [6.8, 52.2],
    [6.0, 51.8],
    [6.02, 50.75],
    [5.8, 51.2],
    [5.0, 51.45],
    [4.4, 51.45],
    [4.2, 51.35],
    [3.5, 51.3],
  ],
);

const DAENEMARK_JUETLAND = verbinde(
  [
    [8.7, 54.9],
    [9.0, 54.9],
  ],
  kueste(JUETLAND_OST, [9.43, 54.79], [10.6, 57.75]),
  kueste(JUETLAND_WEST, [10.6, 57.75], [8.4, 54.9]),
);

const NORWEGEN = verbinde(
  NORWEGEN_KUESTE,
  [
    [6.0, 62.6],
    [12.2, 62.6],
  ],
  NORWEGEN_GRENZE.slice(1),
);

const SCHWEDEN = verbinde(
  SCHWEDEN_KUESTE,
  rueckwaerts(NORWEGEN_GRENZE).slice(1),
  [
    [12.2, 62.6],
    [17.4, 62.6],
  ],
);

const FINNLAND = verbinde(
  kueste(FINNLAND_KUESTE, [21.37, 62.5], [27.6, 60.55]),
  FINNLAND_GRENZE.slice(1),
  [
    [30.6, 62.6],
    [21.3, 62.6],
  ],
);

const PORTUGAL = verbinde(
  kueste(IBERIEN_ATLANTIK, [-8.87, 41.87], [-7.4, 37.17]),
  [
    [-7.3, 37.6],
    [-7.4, 38.2],
    [-7.0, 38.8],
    [-7.1, 39.5],
    [-7.4, 40.0],
    [-6.85, 40.3],
    [-6.85, 41.0],
    [-7.5, 41.85],
    [-8.2, 41.9],
  ],
);

const SPANIEN = verbinde(
  kueste(IBERIEN_ATLANTIK, [-1.78, 43.35], [-8.87, 41.87]),
  [
    [-8.2, 41.9],
    [-7.5, 41.85],
    [-6.85, 41.0],
    [-6.85, 40.3],
    [-7.4, 40.0],
    [-7.1, 39.5],
    [-7.0, 38.8],
    [-7.4, 38.2],
    [-7.3, 37.6],
  ],
  kueste(IBERIEN_ATLANTIK, [-7.4, 37.17], [-5.61, 36.0]),
  IBERIEN_MITTELMEER.slice(1),
  [
    [1.9, 42.5],
    [0.6, 42.7],
    [-0.7, 42.9],
  ],
);

const BALTIKUM = verbinde(
  kueste(OSTSEE_OST, [27.7, 59.47], [21.05, 55.7]),
  BALTIKUM_OSTGRENZE.slice(1),
);

/** Die Oblast Kaliningrad — russisches Gebiet zwischen Polen und Litauen. */
const KALININGRAD = [
  [19.65, 54.45],
  [19.9, 54.65],
  [20.5, 55.0],
  [20.9, 55.3],
  [21.05, 55.7], // die Memel bei Klaipėda
  [22.1, 55.05],
  [22.9, 54.9],
  [22.7, 54.3],
  [21.0, 54.32],
];

const BELARUS = verbinde(
  [
    [23.5, 53.9],
    [23.3, 52.6],
    [23.6, 51.6],
  ],
  GRENZE_BELARUS_UKRAINE.slice(1),
  rueckwaerts(GRENZE_BELARUS_RUSSLAND).slice(1),
  kueste(BALTIKUM_OSTGRENZE, [28.2, 56.2], [23.5, 54.5]),
);

const RUSSLAND = verbinde(
  kueste(FINNLAND_KUESTE, [27.6, 60.55], [30.3, 59.94]),
  kueste(OSTSEE_OST, [30.3, 59.94], [27.7, 59.47]),
  kueste(BALTIKUM_OSTGRENZE, [27.7, 59.47], [28.2, 56.2]),
  GRENZE_BELARUS_RUSSLAND.slice(1),
  GRENZE_UKRAINE_RUSSLAND.slice(1),
  kueste(SCHWARZMEER_NORD, [38.9, 47.2], [39.7, 43.6]),
  GRENZE_RUSSLAND_KAUKASUS,
  kueste(KASPI_WEST, [48.6, 41.8], [48.8, 46.4]),
  // Rückweg über dem Bild: die russische Ebene läuft nach Osten und Norden aus
  // dem Ausschnitt hinaus (siehe Kopf der Datei).
  [
    [49.5, 47.0],
    [49.5, 62.6],
    [30.6, 62.6],
  ],
  rueckwaerts(FINNLAND_GRENZE).slice(1),
);

const KRIM = verbinde(KRIM_KUESTE, rueckwaerts(KRIM_NORDGRENZE).slice(1));

const UKRAINE_1991 = verbinde(
  GRENZE_BELARUS_UKRAINE,
  GRENZE_UKRAINE_RUSSLAND.slice(1),
  kueste(SCHWARZMEER_NORD, [37.3, 46.9], [30.75, 46.48]),
  kueste(SCHWARZMEER_WEST, [30.75, 46.48], [29.7, 45.2]),
  [
    [29.0, 45.4],
    [28.5, 45.3],
    [28.2, 45.47],
  ],
  rueckwaerts(GRENZE_UKRAINE_MOLDAU).slice(1),
  kueste(GRENZE_RUMAENIEN_NORDOST, [26.0, 48.2], [22.0, 48.1]),
  [
    [22.15, 48.4],
    [22.3, 48.6],
  ],
  rueckwaerts(kueste(GRENZE_POLEN_OST, [23.6, 51.6], [22.5, 49.1])).slice(1),
);

/** Die Ukraine ohne die Krim — der Zustand seit März 2014. */
const UKRAINE_OHNE_KRIM = verbinde(
  GRENZE_BELARUS_UKRAINE,
  GRENZE_UKRAINE_RUSSLAND.slice(1),
  UKRAINE_KUESTE_OST.slice(1),
  rueckwaerts(KRIM_NORDGRENZE).slice(1),
  UKRAINE_KUESTE_WEST.slice(1),
  kueste(SCHWARZMEER_WEST, [30.75, 46.48], [29.7, 45.2]),
  [
    [29.0, 45.4],
    [28.5, 45.3],
    [28.2, 45.47],
  ],
  rueckwaerts(GRENZE_UKRAINE_MOLDAU).slice(1),
  kueste(GRENZE_RUMAENIEN_NORDOST, [26.0, 48.2], [22.0, 48.1]),
  [
    [22.15, 48.4],
    [22.3, 48.6],
  ],
  rueckwaerts(kueste(GRENZE_POLEN_OST, [23.6, 51.6], [22.5, 49.1])).slice(1),
);

/** Der Teil der Ukraine, den Kyjiw 2024 kontrollierte — angenähert. */
const UKRAINE_KONTROLLIERT_2024 = verbinde(
  GRENZE_BELARUS_UKRAINE,
  kueste(GRENZE_UKRAINE_RUSSLAND, [31.8, 52.1], [38.2, 49.95]).slice(1),
  FRONT_2024.slice(1),
  [
    [32.0, 46.5],
    [31.5, 46.6],
    [30.75, 46.48],
  ],
  kueste(SCHWARZMEER_WEST, [30.75, 46.48], [29.7, 45.2]),
  [
    [29.0, 45.4],
    [28.5, 45.3],
    [28.2, 45.47],
  ],
  rueckwaerts(GRENZE_UKRAINE_MOLDAU).slice(1),
  kueste(GRENZE_RUMAENIEN_NORDOST, [26.0, 48.2], [22.0, 48.1]),
  [
    [22.15, 48.4],
    [22.3, 48.6],
  ],
  rueckwaerts(kueste(GRENZE_POLEN_OST, [23.6, 51.6], [22.5, 49.1])).slice(1),
);

/** Die von Russland besetzten Gebiete der Ukraine ohne die Krim — Stand 2024. */
const BESETZT_2024 = verbinde(
  FRONT_2024,
  [[32.4, 46.5]],
  rueckwaerts(UKRAINE_KUESTE_WEST).slice(1),
  rueckwaerts(KRIM_NORDGRENZE),
  rueckwaerts(UKRAINE_KUESTE_OST).slice(1),
  kueste(GRENZE_UKRAINE_RUSSLAND, [38.35, 47.1], [38.2, 49.95]).slice(1),
);

const GEORGIEN = [
  [41.55, 41.52], // Batumi
  [41.65, 42.15], // Poti
  [41.3, 42.65],
  [41.0, 43.0], // Suchumi, in Abchasien
  [40.3, 43.35],
  [40.0, 43.4], // die Psou-Mündung, die Grenze zu Russland
  [41.0, 43.4],
  [42.0, 43.3],
  [43.0, 42.75], // Südossetien liegt südlich dieses Abschnitts
  [44.0, 42.7],
  [45.2, 42.55],
  [46.4, 41.9],
  [46.6, 41.35],
  [45.7, 41.2],
  [45.0, 41.3],
  [44.4, 41.2],
  [43.4, 41.1],
  [42.8, 41.4],
];

// ---------------------------------------------------------------------------
// Zusammenbau: Untergrund, Phasen, Punkte, Bewegungen, Beschriftungen
// ---------------------------------------------------------------------------

const basis = [
  { art: 'grund', d: `M 0 0 H ${geo.breite} V ${geo.hoehe} H 0 Z`, fill: KARTENFARBEN.meer, stroke: 'none', strokeWidth: 0 },
  { art: 'land', d: geo.pfad(KONTINENT), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(KLEINASIEN), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(BRITANNIEN), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(IRLAND), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(SKANDINAVIEN), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(FINNLAND_LANDMASSE), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(AFRIKA), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(KORSIKA), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(SARDINIEN), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(SIZILIEN), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(KRETA), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(ZYPERN), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(SJAELLAND), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(FYN), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(BORNHOLM), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(GOTLAND), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'fluss', d: geo.pfad(RHEIN, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
  { art: 'fluss', d: geo.pfad(DONAU, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
  { art: 'fluss', d: geo.pfad(ELBE, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
  { art: 'fluss', d: geo.pfad(ODER, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
  { art: 'fluss', d: geo.pfad(NEISSE, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
  { art: 'fluss', d: geo.pfad(WEICHSEL, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
  { art: 'fluss', d: geo.pfad(THEMSE, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
  { art: 'fluss', d: geo.pfad(DNIPRO, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
  { art: 'fluss', d: geo.pfad(DON, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
  { art: 'fluss', d: geo.pfad(WOLGA, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
];

/** Baut aus mehreren Ringen einen Pfad — eine Fläche, viele Teile. */
const flaecheAus = (...ringe) => ringe.map((ring) => geo.pfad(ring)).join(' ');

const NATO_RINGE_1999 = [
  BRITANNIEN,
  verbinde(NORDIRLAND_KUESTE, IRLAND_GRENZE.slice(1)),
  FRANKREICH,
  ITALIEN,
  BELGIEN,
  NIEDERLANDE,
  LUXEMBURG,
  DAENEMARK_JUETLAND,
  SJAELLAND,
  FYN,
  BORNHOLM,
  NORWEGEN,
  PORTUGAL,
  SPANIEN,
  GRIECHENLAND,
  TUERKEI_THRAKIEN,
  KLEINASIEN,
  DEUTSCHLAND,
  POLEN,
  TSCHECHIEN,
  UNGARN,
];

const NATO_RINGE_2014 = [
  ...NATO_RINGE_1999,
  BALTIKUM,
  SLOWAKEI,
  SLOWENIEN_KROATIEN,
  RUMAENIEN,
  BULGARIEN,
  ALBANIEN,
];

const NATO_RINGE_2024 = [
  ...NATO_RINGE_2014,
  MONTENEGRO,
  NORDMAZEDONIEN,
  FINNLAND,
  SCHWEDEN,
  GOTLAND,
];

const RUSSLAND_RINGE = [RUSSLAND, KALININGRAD];

/**
 * Die zweite, deckungsgleiche Lage Russlands.
 *
 * Siehe Kopf der Datei, Punkt 4: Die App füllt jede Fläche mit 72 Prozent
 * Deckkraft; zwei Lagen übereinander ergeben den dunkleren Ton, den der
 * Betreiber für Russland vorgegeben hat. Der Titel sagt offen, was das ist.
 */
const zweiteLage = (jahr) => ({
  titel: `Russische Föderation (${jahr}) — zweite Lage derselben Fläche, damit sie dunkler erscheint als die NATO-Staaten`,
  d: flaecheAus(...RUSSLAND_RINGE),
});

const phasen = [
  {
    id: 'erweiterung-1999',
    label: '1999 — die erste Osterweiterung',
    hinweis:
      'Acht Jahre nach dem Ende der Sowjetunion treten Polen, Tschechien und Ungarn der NATO bei (12. März 1999). Russland ist geschrumpft, aber es ist kein Gegner: 1997 haben Moskau und Brüssel die NATO-Russland-Grundakte unterzeichnet. Die USA und Kanada, die beiden größten Mitglieder, liegen außerhalb dieses Ausschnitts.',
    flaechen: [
      {
        titel: 'NATO in Europa (1999) — seit dem 12. März 1999 mit Polen, Tschechien und Ungarn',
        d: flaecheAus(...NATO_RINGE_1999),
      },
      { titel: 'Russische Föderation (1999)', d: flaecheAus(...RUSSLAND_RINGE) },
      zweiteLage(1999),
      { titel: 'Ukraine (1999) — seit dem 24. August 1991 unabhängig, mit der Krim', d: geo.pfad(UKRAINE_1991) },
      { titel: 'Belarus (1999) — seit 1991 unabhängig', d: geo.pfad(BELARUS) },
      {
        titel: 'Estland, Lettland und Litauen (1999) — unabhängig, noch nicht in der NATO',
        d: geo.pfad(BALTIKUM),
      },
      { titel: 'Georgien (1999) — seit 1991 unabhängig', d: geo.pfad(GEORGIEN) },
    ],
  },
  {
    id: 'krim-2014',
    label: '2014 — Krim und Donbass',
    hinweis:
      'Zwei weitere Erweiterungen liegen dazwischen: 2004 kamen Estland, Lettland, Litauen, die Slowakei, Slowenien, Rumänien und Bulgarien dazu, 2009 Albanien und Kroatien. Seit 2004 hat die NATO eine Landgrenze zu Russland. Im März 2014 annektiert Russland die Krim, im Frühjahr beginnt der Krieg im Donbass.',
    flaechen: [
      {
        titel: 'NATO in Europa (2014) — seit 2004 mit Estland, Lettland, Litauen, der Slowakei, Slowenien, Rumänien und Bulgarien, seit 2009 mit Albanien und Kroatien',
        d: flaecheAus(...NATO_RINGE_2014),
      },
      { titel: 'Russische Föderation (2014)', d: flaecheAus(...RUSSLAND_RINGE) },
      zweiteLage(2014),
      {
        titel: 'Krim — seit März 2014 von Russland annektiert; völkerrechtlich weiter Ukraine (UN-Resolution 68/262 vom 27. März 2014)',
        d: geo.pfad(KRIM),
      },
      {
        titel: 'Von Separatisten kontrollierte Gebiete in Donezk und Luhansk (Stand Ende 2014) — völkerrechtlich Ukraine',
        d: geo.pfad(SEPARATISTENGEBIET_2014),
      },
      {
        titel: 'Ukraine (2014) — Staatsgebiet ohne die annektierte Krim',
        d: geo.pfad(UKRAINE_OHNE_KRIM),
      },
      { titel: 'Belarus (2014)', d: geo.pfad(BELARUS) },
      {
        titel: 'Georgien — Abchasien und Südossetien stehen seit dem Krieg vom August 2008 außerhalb der Kontrolle von Tiflis',
        d: geo.pfad(GEORGIEN),
      },
    ],
  },
  {
    id: 'krieg-2022',
    label: '2022–2024 — der Angriffskrieg und die Nordische Erweiterung',
    hinweis:
      'Am 24. Februar 2022 greift Russland die Ukraine in vollem Umfang an. Die Front auf dieser Karte ist ein angenäherter Stand von 2024, kein fester Zustand. Und sie zeigt eine Folge, die niemand in Moskau geplant hatte: Finnland (2023) und Schweden (2024) geben ihre jahrzehntelange Bündnisfreiheit auf und treten der NATO bei.',
    flaechen: [
      {
        titel: 'NATO in Europa (2024) — seit 2017 mit Montenegro, seit 2020 mit Nordmazedonien, seit 2023 mit Finnland und seit 2024 mit Schweden',
        d: flaecheAus(...NATO_RINGE_2024),
      },
      { titel: 'Russische Föderation (2024)', d: flaecheAus(...RUSSLAND_RINGE) },
      zweiteLage(2024),
      {
        titel: 'Krim — seit März 2014 von Russland annektiert; völkerrechtlich weiter Ukraine (UN-Resolution 68/262 vom 27. März 2014)',
        d: geo.pfad(KRIM),
      },
      {
        titel: 'Von Russland besetzte Gebiete der Ukraine (angenäherter Stand 2024) — völkerrechtlich Ukraine',
        d: geo.pfad(BESETZT_2024),
      },
      {
        titel: 'Ukraine — der von Kyjiw kontrollierte Teil (angenäherter Stand 2024)',
        d: geo.pfad(UKRAINE_KONTROLLIERT_2024),
      },
      {
        titel: 'Belarus (2022) — von hier aus führte im Februar 2022 einer der Angriffswege auf Kyjiw',
        d: geo.pfad(BELARUS),
      },
      {
        titel: 'Georgien — Abchasien und Südossetien stehen seit dem Krieg vom August 2008 außerhalb der Kontrolle von Tiflis',
        d: geo.pfad(GEORGIEN),
      },
    ],
  },
];

const punkte = [
  {
    id: 'moskau',
    name: 'Moskau',
    typ: 'stadt',
    ...ort(37.62, 55.75),
    text:
      'Hauptstadt der Russischen Föderation, die am 25. Dezember 1991 die Sowjetunion beerbte. In den neunziger Jahren erlebte die Stadt beides: den Beschuss des eigenen Parlaments im Oktober 1993 und die ersten freien Wahlen. Die Wirtschaftsleistung des Landes fiel zwischen 1991 und 1998 um rund 40 Prozent, die Ersparnisse einer ganzen Generation verbrannten in der Inflation, im August 1998 war der Staat zahlungsunfähig. Am 31. Dezember 1999 übergab Boris Jelzin die Amtsgeschäfte an Wladimir Putin. Was danach kam, erzählt dieses Kapitel aus mehreren Sichtweisen — die Stabilisierung der 2000er Jahre und die autoritäre Wende gehören beide dazu.',
  },
  {
    id: 'kyjiw',
    name: 'Kyjiw (Kiew)',
    typ: 'stadt',
    ...ort(30.52, 50.45),
    text:
      'Am 1. Dezember 1991 stimmten in einem Referendum über 90 Prozent für die Unabhängigkeit der Ukraine — auch auf der Krim war eine Mehrheit dafür. 1994 gab das Land im Budapester Memorandum die drittgrößte Atomwaffensammlung der Welt ab; Russland, die USA und Großbritannien sicherten dafür seine Grenzen und seine Souveränität zu. 2004 brachte die Orange Revolution eine gefälschte Wahl zu Fall, 2013/14 stürzten die Proteste auf dem Maidan Präsident Janukowytsch, nachdem er das Abkommen mit der EU nicht unterschrieben hatte. Am 24. Februar 2022 begann der russische Angriff auch auf diese Stadt; der Vorstoß aus dem Norden scheiterte und wurde Anfang April abgebrochen.',
  },
  {
    id: 'bruessel',
    name: 'Brüssel',
    typ: 'stadt',
    ...ort(4.35, 50.85),
    text:
      'Sitz der NATO. Artikel 10 des Nordatlantikvertrags von 1949 sieht ausdrücklich vor, dass weitere europäische Staaten aufgenommen werden können — die „offene Tür". Nach dieser Regel kamen 1999 Polen, Tschechien und Ungarn dazu, 2004 sieben weitere Staaten, zuletzt Finnland (2023) und Schweden (2024). 1997 unterzeichneten die NATO und Russland hier die Grundakte über gegenseitige Beziehungen, 2002 entstand der NATO-Russland-Rat; beide Seiten nannten sich darin Partner, keine Gegner. Ob die Erweiterung Sicherheit geschaffen oder Misstrauen genährt hat, ist die Streitfrage dieses Kapitels — und beide Antworten haben ernst zu nehmende Gründe.',
  },
  {
    id: 'sewastopol',
    name: 'Sewastopol',
    typ: 'ereignis',
    ...ort(33.53, 44.62),
    text:
      'Heimathafen der russischen Schwarzmeerflotte, seit 1783. Nach 1991 lag er in der Ukraine; 1997 einigten sich beide Staaten auf eine Pacht bis 2017, 2010 wurde sie bis 2042 verlängert. Im Februar/März 2014 besetzten Soldaten ohne Hoheitsabzeichen — später von Präsident Putin als russische Militärangehörige bezeichnet — die Halbinsel; ein Referendum am 16. März wurde unter Besatzung abgehalten und international nicht anerkannt. Am 27. März 2014 erklärte die UN-Vollversammlung die Annexion mit 100 gegen 11 Stimmen für ungültig. Auf dieser Karte trägt die Krim deshalb ab 2014 zwei Angaben im Titel: wer sie kontrolliert und wem sie völkerrechtlich zugerechnet wird.',
  },
  {
    id: 'warschau',
    name: 'Warschau',
    typ: 'stadt',
    ...ort(21.0, 52.23),
    text:
      'Am 12. März 1999 trat Polen zusammen mit Tschechien und Ungarn der NATO bei — sechs Jahre nach dem Abzug der letzten russischen Truppen. Warum ein Land das wollte, erklärt sich hier aus der eigenen Geschichte: 1939 zweimal überfallen, 1945 ohne eigenes Zutun in einen Block eingeordnet, 1956 und 1981 unter Kriegsrecht. Der Beitritt war ein Beschluss eines gewählten Parlaments, kein Geschenk des Westens — das gehört zu den Gründen, die die westliche Sichtweise anführt. Die russische Sichtweise setzt dagegen, dass eine souveräne Entscheidung trotzdem die Sicherheitslage eines Nachbarn verändert. Beides steht in diesem Kapitel nebeneinander.',
  },
  {
    id: 'tiflis',
    name: 'Tiflis (Tbilissi)',
    typ: 'ereignis',
    ...ort(44.79, 41.72),
    text:
      'Im April 2008 erklärte der NATO-Gipfel von Bukarest, Georgien und die Ukraine „werden Mitglieder werden" — ohne einen Fahrplan dafür zu beschließen. Im August 2008 eskalierte der Streit um Südossetien: In der Nacht zum 8. August beschoss die georgische Armee Zchinwali, russische Truppen rückten ein und stießen weit über die umstrittenen Gebiete hinaus vor. Der von der EU eingesetzte Untersuchungsbericht (Tagliavini, 2009) kam zu einem doppelten Ergebnis: Der georgische Angriff sei völkerrechtlich nicht zu rechtfertigen gewesen, die russische Reaktion aber weit über das Verhältnismäßige hinausgegangen — und vorangegangen sei eine lange Reihe von Provokationen auf beiden Seiten. Abchasien und Südossetien stehen seither außerhalb der Kontrolle von Tiflis.',
  },
  {
    id: 'helsinki',
    name: 'Helsinki',
    typ: 'stadt',
    ...ort(24.94, 60.17),
    text:
      'Finnland hat eine 1 340 Kilometer lange Grenze zu Russland und hielt seit 1945 an der Bündnisfreiheit fest — hier wurde 1975 die KSZE-Schlussakte unterzeichnet, das Herzstück der Entspannungspolitik. Vor dem Februar 2022 waren in Umfragen rund 20 bis 25 Prozent der Finninnen und Finnen für einen NATO-Beitritt; wenige Wochen nach dem russischen Angriff waren es über 70 Prozent. Am 4. April 2023 trat Finnland bei, am 7. März 2024 Schweden, das seit 1814 keinem Bündnis angehört hatte. Die Landgrenze der NATO zu Russland hat sich damit mehr als verdoppelt — die Ausdehnung des Bündnisses, die der Krieg verhindern sollte.',
  },
];

const bewegungen = [
  {
    id: 'erweiterung-1999',
    name: 'Die erste Osterweiterung 1999',
    von: p(4.35, 50.85),
    ueber: [p(13.4, 52.52)],
    nach: p(21.0, 52.23),
    text:
      'Am 12. März 1999 traten Polen, Tschechien und Ungarn der NATO bei. Alle drei hatten den Beitritt selbst beantragt, in allen dreien trugen gewählte Parlamente die Entscheidung. Aus westlicher Sicht war das die Anwendung von Artikel 10 des Vertrags von 1949 und eine Frage der Selbstbestimmung; aus russischer Sicht rückte das Bündnis, dem man das Ende der eigenen Vormacht verdankte, an die eigene Nachbarschaft heran. Der Pfeil zeigt, was geschah — nicht, was jemand vorhatte.',
  },
  {
    id: 'erweiterung-2004',
    name: 'Die große Erweiterung 2004',
    von: p(4.35, 50.85),
    ueber: [p(14.5, 53.5)],
    nach: p(24.75, 59.3),
    text:
      'Am 29. März 2004 traten sieben Staaten zugleich bei: Estland, Lettland, Litauen, die Slowakei, Slowenien, Rumänien und Bulgarien. Damit hatte die NATO zum ersten Mal eine Landgrenze zu Russland — bei Narva und in Litauen an der Oblast Kaliningrad. Die drei baltischen Staaten waren 1940 von der Sowjetunion annektiert worden; ihre Regierungen begründeten den Beitritt genau damit. In Moskau wurde derselbe Vorgang als das Gegenteil gelesen: als Verschiebung einer Militärallianz bis vor die eigene Tür.',
  },
  {
    id: 'angriff-2022',
    name: 'Der Angriff auf Kyjiw, Februar 2022',
    von: p(30.9, 52.4),
    ueber: [p(30.6, 51.3)],
    nach: p(30.52, 50.45),
    text:
      'Am 24. Februar 2022 begann der groß angelegte russische Angriff auf die Ukraine — aus dem Osten, aus dem Süden von der Krim aus und aus dem Norden über belarussisches Gebiet auf die Hauptstadt. Dieser Vorstoß kam bis in die Vororte von Kyjiw und scheiterte; Anfang April zogen sich die russischen Truppen aus dem Norden zurück. In den befreiten Orten, unter ihnen Butscha, fanden Ermittler zahlreiche getötete Zivilisten; die Vorfälle sind Gegenstand von Ermittlungen des Internationalen Strafgerichtshofs. Die UN-Vollversammlung verurteilte den Angriff am 2. März 2022 mit 141 gegen 5 Stimmen.',
  },
  {
    id: 'nordische-erweiterung',
    name: 'Finnland und Schweden treten bei, 2023 und 2024',
    von: p(24.94, 60.17),
    ueber: [p(13.0, 55.6)],
    nach: p(4.35, 50.85),
    text:
      'Finnland gab am 4. April 2023 seine Bündnisfreiheit auf, Schweden am 7. März 2024 — nach 209 Jahren ohne Bündnis und ohne Krieg. Beide Länder hatten die Neutralität über Generationen als Teil ihrer Staatsräson verstanden; die Mehrheiten dafür kippten innerhalb weniger Wochen nach dem 24. Februar 2022. Der Pfeil läuft deshalb in die andere Richtung als die beiden Erweiterungspfeile davor: Hier ging die Bewegung nicht vom Bündnis aus, sondern von zwei Staaten, die vorher nichts von ihm wollten.',
  },
];

const beschriftungen = [
  { text: 'Atlantik', art: 'meer', ...ort(-7.5, 45.5), drehung: 0 },
  { text: 'Nordsee', art: 'meer', ...ort(3.5, 56.0), drehung: 0 },
  { text: 'Ostsee', art: 'meer', ...ort(19.0, 56.8), drehung: 0 },
  { text: 'Mittelmeer', art: 'meer', ...ort(15.0, 35.5), drehung: 0 },
  { text: 'Schwarzes Meer', art: 'meer', ...ort(34.0, 43.2), drehung: 0 },
  { text: 'Kaspisches Meer', art: 'meer', ...ort(47.5, 45.5), drehung: 90 },
  { text: 'NATO', art: 'land', ...ort(9.5, 47.0), drehung: 0 },
  { text: 'Russland', art: 'land', ...ort(43.0, 57.5), drehung: 0 },
  { text: 'Ukraine', art: 'land', ...ort(32.5, 48.6), drehung: 0 },
  { text: 'Belarus', art: 'land', ...ort(28.0, 53.4), drehung: 0 },
  { text: 'Kaukasus', art: 'land', ...ort(43.5, 43.3), drehung: 0 },
];

module.exports = {
  breite: geo.breite,
  hoehe: geo.hoehe,
  basis,
  phasen,
  punkte,
  bewegungen,
  beschriftungen,
};
