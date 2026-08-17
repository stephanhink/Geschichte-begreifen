// Die Karte zum Thema „Die neue Weltordnung und der Kalte Krieg" —
// Geschichte in Bewegung.
//
// Die Küstenlinien stehen als echte Längen-/Breitengrade `[lon, lat]` und
// werden von utils/karte-geo.js in SVG-Koordinaten umgerechnet. Wer einen
// Punkt anzweifelt, schlägt ihn im Atlas nach: `[13.4, 52.52]` ist Berlin,
// `[37.62, 55.75]` ist Moskau, `[24.94, 60.17]` ist Helsinki.
//
// Der Ausschnitt: 10° W bis 45° O, 34° N bis 61° N — 700 × 508,7. Das sind
// 12,7 SVG-Einheiten je Längengrad. Der Rahmen ist derselbe wie bei der Karte
// zu „Der Weg zum Ersten Weltkrieg", und das ist Absicht: Beide Kapitel
// erzählen, wie Europa in zwei Lager zerfällt, und wer die Karten
// nebeneinanderlegt, sieht dieselbe Bühne mit anderen Grenzen. Der Betreiber
// hatte 10° W bis 40° O und 35° N bis 60° N vorgeschlagen; nach Osten und
// Norden steht der Rahmen eine Spur weiter, und zwar aus Gründen, die die
// Vorgabe selbst nennt:
//
//   * Moskau liegt auf 37,62° O. Bei 40° O hätte der eine Pol dieses Kapitels
//     am äußersten Bildrand geklebt.
//   * Helsinki liegt auf 60,17° N. Die KSZE-Schlussakte von 1975 gehört nach
//     Betreiber-Vorgabe ins Herz dieses Kapitels — bei 60° N wäre der Ort,
//     an dem sie unterschrieben wurde, nicht auf der Karte.
//
// Was dieser Ausschnitt kostet, steht hier, damit niemand es für einen Fehler
// hält:
//
//   * **Kuba liegt nicht auf dieser Karte.** Die Kubakrise von 1962 ist das
//     dramatischste Ereignis dieses Kapitels, und sie spielt siebentausend
//     Kilometer westlich des linken Bildrands. Sie steht deshalb im Text, im
//     Hinweis der zweiten Phase und im Info-Punkt Moskau — und die Türkei,
//     aus der die amerikanischen Jupiter-Raketen im Geheimabkommen
//     abgezogen wurden, ist auf der Karte zu sehen. Das ist die Hälfte des
//     Handels, die man zeigen kann.
//   * Die USA, Kanada und Island sind NATO-Gründungsmitglieder von 1949 und
//     liegen alle drei außerhalb. Der Hinweis der ersten Phase sagt das.
//   * Nordskandinavien, der Ural und der Kaukasus laufen über den Bildrand
//     hinaus; die Sowjetunion ist nur mit ihrem europäischen Teil zu sehen.
//
// Sechs Festlegungen, die ausdrücklich hierher gehören:
//
//   1. **Die Karte datiert, sie bewertet nicht.** Jede Fläche trägt ihren
//      Zustand mit Jahreszahl im Titel — „Deutsche Demokratische Republik
//      (gegründet 1949)", „Ehemaliger Warschauer Pakt — aufgelöst am 1. Juli
//      1991". Ob diese Zustände recht oder unrecht waren, entscheidet nicht
//      die Karte; darüber sprechen die Perspektiven, und urteilen die
//      Lernenden selbst. Deshalb heißt keine Fläche „Ostblock" oder „freie
//      Welt" — beides sind Wörter aus dem Streit, nicht aus dem Atlas.
//   2. **Die politischen Grenzen sind angenähert, nicht vermessen** — anders
//      als die Küstenlinien, die auf echten Atlas-Koordinaten beruhen. Das ist
//      dieselbe Praxis wie bei allen Karten der App.
//   3. **Die Blöcke stehen als je eine Fläche mit mehreren Ringen da**, nicht
//      als zwanzig einzelne Staaten. Das hat einen technischen und einen
//      inhaltlichen Grund: Die App färbt alle Flächen einer Phase gleich ein
//      (siehe components/abschnitte/KarteAbschnitt.js), einzeln gezeichnete
//      Staaten wären also ohnehin nicht zu unterscheiden — und die Aussage
//      dieses Kapitels ist genau die: zwei Blöcke, eine Grenze. Wer wissen
//      will, wer dazugehört, liest den Titel der Fläche; dort stehen die
//      Namen.
//   4. **Die beiden deutschen Staaten und Berlin sind eigene Flächen.** Sie
//      sind der Gegenstand dieses Kapitels und dürfen nicht in einem Block
//      verschwinden. West-Berlin liegt dabei als eigene Fläche über dem
//      Gebiet der DDR — genau das war es: von den Westmächten verwalteter
//      Boden mitten in einem anderen Staat. Weil die App Flächen halbdurch-
//      sichtig füllt, erscheint es dunkler als das Land ringsum.
//   5. **Der Eiserne Vorhang ist eine Linie im Untergrund und bleibt auf
//      allen drei Phasen stehen** — auch auf der letzten, auf der es ihn
//      nicht mehr gibt. Dieselbe Regel wie bei der Reichsgrenze auf der
//      Napoleon-Karte: Man soll sehen, was verschwunden ist. Die Linie endet
//      im Süden dort, wo Jugoslawien beginnt; es gehörte seit dem Bruch
//      zwischen Tito und Stalin 1948 zu keinem der beiden Blöcke. Churchills
//      Satz von 1946 — „von Stettin an der Ostsee bis Triest an der Adria" —
//      stammt aus der Zeit vor diesem Bruch.
//   6. **Eingefärbt wird nur, wo eine Herrschaft mit Grenzen plausibel ist.**
//      Das Meer bleibt leer, obwohl der Kalte Krieg auch dort stattfand:
//      Eine Fläche behauptet ein Gebiet, und U-Boote sind kein Gebiet.
//
// Reine Daten und Rechnung — keine UI-Importe (Architektur-Regel).

const { KARTENFARBEN, erstelleProjektion, rueckwaerts, verbinde } = require('../../karte-geo');

// ---------------------------------------------------------------------------
// Ausschnitt und Projektion
// ---------------------------------------------------------------------------

const RAHMEN = { minLon: -10, maxLon: 45, minLat: 34, maxLat: 61, breite: 700 };

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

/** Die Ostsee-Ostküste von Leningrad bis Danzig. */
const OSTSEE_OST = [
  [30.3, 59.94], // Leningrad, an der Newamündung
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
  [19.9, 54.65], // Baltijsk (Pillau) — ab 1945 sowjetisch
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
  [41.55, 41.52], // Batumi — die sowjetisch-türkische Grenze am Meer
];

/** Anatoliens Schwarzmeerküste: Bosporus → die sowjetische Grenze. */
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

/** Die Ostgrenze der Türkei: zur Sowjetunion, zum Iran, zu Irak und Syrien. */
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
  [17.5, 61.2], // über dem oberen Bildrand, bei Söderhamn
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
  [5.0, 61.2], // über dem oberen Bildrand
];

/** Die norwegisch-schwedische Grenze — von Norden herunter nach Svinesund. */
const NORWEGEN_GRENZE = [
  [12.3, 61.4],
  [12.5, 60.3],
  [12.2, 59.4],
  [11.7, 59.15],
  [11.17, 58.94],
];

/** Finnlands Südküste: von Norden über Turku und Helsinki bis Leningrad. */
const FINNLAND_KUESTE = [
  [21.5, 61.3], // über dem oberen Bildrand, bei Rauma
  [21.8, 60.8], // Uusikaupunki
  [22.27, 60.45], // Turku
  [22.0, 60.2],
  [22.97, 59.82], // Hanko, die Südspitze
  [23.5, 59.98],
  [24.94, 60.17], // Helsinki — hier wurde 1975 die KSZE-Schlussakte unterzeichnet
  [25.6, 60.35],
  [26.95, 60.47], // Kotka
  [27.6, 60.55], // Virolahti — die Grenze zur Sowjetunion seit 1944
  [28.75, 60.71], // Wyborg, seit 1944 sowjetisch
  [29.5, 60.2],
  [30.3, 59.94], // Leningrad
];

/** Die finnisch-sowjetische Grenze, wie sie seit 1944 verlief. */
const FINNLAND_GRENZE = [
  [27.6, 60.55],
  [28.3, 60.9],
  [29.0, 61.4],
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
  [12.99, 51.56], // Torgau — hier trafen sich 1945 Amerikaner und Rote Armee
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
  // Rückweg über dem Bild: der Kaukasus, die russische Ebene und der Norden.
  [
    [46.0, 44.0],
    [46.0, 61.4],
    [30.3, 61.4],
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
  [5.0, 61.4],
  [17.5, 61.4],
]);

const FINNLAND_LANDMASSE = verbinde(FINNLAND_KUESTE, [
  [30.5, 61.4],
  [21.5, 61.4],
]);

const AFRIKA = verbinde(NORDAFRIKA, [
  [11.5, 34.0],
  [-6.5, 34.0],
  [-6.3, 35.2],
]);

// ---------------------------------------------------------------------------
// Politische Grenzen 1949–1991 — angenähert (siehe Kopf der Datei, Punkt 2)
// ---------------------------------------------------------------------------

/**
 * Die innerdeutsche Grenze, von der Lübecker Bucht bis zum Dreiländereck bei
 * Mödlareuth — 1 393 Kilometer, die Linie, um die es in diesem Kapitel geht.
 * Notiert von Norden nach Süden.
 */
const INNERDEUTSCHE_GRENZE = [
  [10.87, 53.95], // die Lübecker Bucht bei Travemünde
  [10.75, 53.7],
  [10.9, 53.55], // der Schaalsee
  [10.55, 53.37], // die Elbe bei Lauenburg
  [11.0, 53.15],
  [11.55, 53.03], // Schnackenburg, wo die Grenze die Elbe verlässt
  [11.4, 52.85],
  [10.95, 52.6],
  [11.0, 52.2], // Helmstedt/Marienborn — der Übergang an der Transitstrecke
  [10.6, 51.85], // westlich des Harzes
  [10.25, 51.5], // das Eichsfeld bei Duderstadt
  [10.05, 51.2],
  [10.03, 50.83], // Vacha an der Werra
  [10.0, 50.4], // die Rhön
  [10.6, 50.35],
  [10.9, 50.3], // bei Coburg
  [11.5, 50.4],
  [11.95, 50.35], // Mödlareuth
  [12.1, 50.32], // das Dreiländereck zur Tschechoslowakei
];

/** Die Westgrenze der Bundesrepublik: Emsmündung → Passau. */
const GRENZE_BRD_WEST = [
  [7.2, 53.6], // die Emsmündung, Grenze zu den Niederlanden
  [6.8, 52.2],
  [6.0, 51.8],
  [6.1, 50.8], // bei Aachen, Grenze zu Belgien
  [6.15, 50.15],
  [6.37, 49.47], // das Dreiländereck bei Schengen
  [6.9, 49.2], // das Saarland — bis 1957 unter französischer Verwaltung
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
  [13.46, 48.57], // Passau, das Dreiländereck zur Tschechoslowakei
];

/** Die bayerisch-böhmische Grenze: Passau → Dreiländereck bei Mödlareuth. */
const GRENZE_BRD_OST = [
  [13.46, 48.57],
  [13.0, 49.1],
  [12.6, 49.5],
  [12.5, 49.95],
  [12.2, 50.2],
  [12.1, 50.32],
];

/** Die Grenze zwischen der DDR und der Tschechoslowakei. */
const GRENZE_DDR_CSSR = [
  [12.1, 50.32],
  [12.5, 50.4],
  [13.0, 50.5], // das Erzgebirge
  [13.6, 50.7],
  [14.4, 50.9], // die Elbe bei Bad Schandau
  [14.8, 50.85],
  [15.0, 51.0], // das Dreiländereck an der Neiße bei Zittau
];

/** Die Oder-Neiße-Grenze, seit 1945 — von Zittau bis an die Ostsee. */
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

/** Die Südgrenze Polens: Zittau → das Dreiländereck zur Sowjetunion. */
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

/** Die Ostgrenze Polens seit 1945 — notiert von Norden nach Süden. */
const GRENZE_POLEN_SOWJET = [
  [19.65, 54.45], // das Frische Haff; nördlich davon das sowjetische Königsberg
  [21.0, 54.32],
  [22.7, 54.3],
  [23.5, 53.9],
  [23.3, 52.6], // der Bug
  [23.6, 51.6],
  [24.0, 50.8],
  [23.5, 50.3],
  [22.5, 49.1],
];

/** Die Grenze zwischen der Tschechoslowakei und Ungarn. */
const GRENZE_UNGARN_NORD = [
  [17.1, 47.85],
  [17.7, 47.75],
  [18.5, 47.85],
  [19.5, 48.1],
  [20.5, 48.3],
  [21.5, 48.5],
  [22.15, 48.4],
];

/** Die Nordgrenze Österreichs: Ungarn → Tschechoslowakei → Passau. */
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

const GRENZE_UNGARN_JUGOSLAWIEN = [
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
  [17.1, 47.85], // hier lief der Eiserne Vorhang — 1989 wurde er hier zuerst durchtrennt
];

const GRENZE_RUMAENIEN_SOWJET = [
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

const GRENZE_RUMAENIEN_JUGOSLAWIEN = [
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

const GRENZE_BULGARIEN_JUGOSLAWIEN = [
  [22.9, 41.35],
  [22.6, 42.0],
  [22.4, 42.4],
  [22.5, 43.0],
  [22.35, 43.35],
  [22.6, 44.0],
  [22.7, 44.55],
];

const GRENZE_JUGOSLAWIEN_ALBANIEN = [
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
  [13.7, 46.5], // das Dreiländereck mit Italien und Jugoslawien
];

const GRENZE_OESTERREICH_JUGOSLAWIEN = [
  [13.7, 46.5],
  [14.5, 46.5],
  [15.0, 46.6],
  [16.1, 46.87],
];

const GRENZE_OESTERREICH_BRD = [
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

/** Die Ostgrenze der drei baltischen Staaten — 1991 wieder Staatsgrenze. */
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
// Die Flächen der Staaten und Blöcke
// ---------------------------------------------------------------------------

const BUNDESREPUBLIK = verbinde(
  GRENZE_BRD_WEST,
  GRENZE_BRD_OST.slice(1),
  rueckwaerts(INNERDEUTSCHE_GRENZE),
  kueste(OSTSEE_SUED, [10.87, 53.87], [10.13, 54.33]),
  kueste(JUETLAND_OST, [10.13, 54.33], [9.43, 54.79]),
  [
    [9.0, 54.9],
    [8.7, 54.9],
  ],
  kueste(JUETLAND_WEST, [8.7, 54.9], [8.7, 53.87]),
  kueste(NORDSEE, [8.7, 53.87], [7.2, 53.6]),
);

const DDR = verbinde(
  INNERDEUTSCHE_GRENZE,
  GRENZE_DDR_CSSR.slice(1),
  ODER_NEISSE_GRENZE.slice(1),
  kueste(OSTSEE_SUED, [14.25, 53.92], [10.87, 53.87]),
);

const DEUTSCHLAND_VEREINT = verbinde(
  GRENZE_BRD_WEST,
  GRENZE_BRD_OST.slice(1),
  GRENZE_DDR_CSSR.slice(1),
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

/**
 * West-Berlin — die drei Westsektoren, angenähert.
 *
 * Die Sektorengrenze lief mitten durch die Stadt; das Brandenburger Tor
 * (13,377° O) stand genau darauf. Bei 12,7 SVG-Einheiten je Längengrad ist
 * das ganze West-Berlin knapp fünf Einheiten breit — die Form ist deshalb
 * vereinfacht, die Lage stimmt.
 */
const WEST_BERLIN = [
  [13.12, 52.4],
  [13.09, 52.5],
  [13.15, 52.6],
  [13.28, 52.65],
  [13.36, 52.62], // Reinickendorf, im französischen Sektor
  [13.38, 52.55],
  [13.42, 52.5], // Kreuzberg und Tempelhof, im amerikanischen Sektor
  [13.44, 52.45],
  [13.38, 52.4],
  [13.25, 52.37],
];

/** Ost-Berlin — der sowjetische Sektor, ab 1949 Hauptstadt der DDR. */
const OST_BERLIN = [
  [13.36, 52.62],
  [13.45, 52.65],
  [13.6, 52.62],
  [13.66, 52.53],
  [13.6, 52.45],
  [13.5, 52.4],
  [13.38, 52.4],
  [13.44, 52.45],
  [13.42, 52.5],
  [13.38, 52.55],
];

/** Berlin als eine Stadt — der Zustand ab dem 3. Oktober 1990. */
const BERLIN_GANZ = [
  [13.12, 52.4],
  [13.09, 52.5],
  [13.15, 52.6],
  [13.28, 52.65],
  [13.45, 52.65],
  [13.6, 52.62],
  [13.66, 52.53],
  [13.6, 52.45],
  [13.5, 52.4],
  [13.38, 52.4],
  [13.25, 52.37],
];

const POLEN = verbinde(
  rueckwaerts(ODER_NEISSE_GRENZE),
  GRENZE_POLEN_SUED.slice(1),
  rueckwaerts(GRENZE_POLEN_SOWJET).slice(1),
  [
    [19.3, 54.55],
    [18.9, 54.65],
    [18.65, 54.35],
  ],
  kueste(OSTSEE_SUED, [18.65, 54.35], [14.25, 53.92]),
);

const TSCHECHOSLOWAKEI = verbinde(
  GRENZE_DDR_CSSR,
  GRENZE_POLEN_SUED.slice(1),
  [
    [22.3, 48.6],
    [22.15, 48.4],
  ],
  rueckwaerts(GRENZE_UNGARN_NORD).slice(1),
  GRENZE_OESTERREICH_NORD.slice(1),
  rueckwaerts(GRENZE_BRD_OST).slice(1),
);

const UNGARN = verbinde(
  GRENZE_UNGARN_NORD,
  [
    [22.3, 48.3],
    [22.0, 48.1],
  ],
  GRENZE_UNGARN_RUMAENIEN.slice(1),
  GRENZE_UNGARN_JUGOSLAWIEN.slice(1),
  GRENZE_UNGARN_OESTERREICH.slice(1),
);

const RUMAENIEN = verbinde(
  rueckwaerts(GRENZE_UNGARN_RUMAENIEN),
  GRENZE_RUMAENIEN_SOWJET.slice(1),
  kueste(SCHWARZMEER_WEST, [29.7, 45.2], [28.15, 43.7]),
  GRENZE_RUMAENIEN_BULGARIEN.slice(1),
  GRENZE_RUMAENIEN_JUGOSLAWIEN.slice(1),
);

const BULGARIEN = verbinde(
  rueckwaerts(GRENZE_RUMAENIEN_BULGARIEN),
  kueste(SCHWARZMEER_WEST, [28.15, 43.7], [27.5, 42.1]),
  GRENZE_BULGARIEN_SUED,
  GRENZE_BULGARIEN_JUGOSLAWIEN.slice(1),
);

const ALBANIEN = verbinde(
  ALBANIEN_KUESTE,
  GRENZE_ALBANIEN_GRIECHENLAND.slice(1),
  rueckwaerts(GRENZE_JUGOSLAWIEN_ALBANIEN).slice(1),
);

const JUGOSLAWIEN = verbinde(
  [[13.78, 45.58]],
  kueste(BALKAN_ADRIA, [13.75, 45.5], [19.35, 41.85]),
  GRENZE_JUGOSLAWIEN_ALBANIEN.slice(1),
  GRENZE_GRIECHENLAND_NORD.slice(1),
  rueckwaerts(GRENZE_BULGARIEN_JUGOSLAWIEN).slice(1),
  rueckwaerts(GRENZE_RUMAENIEN_JUGOSLAWIEN).slice(1),
  rueckwaerts(GRENZE_UNGARN_JUGOSLAWIEN).slice(1),
  rueckwaerts(GRENZE_OESTERREICH_JUGOSLAWIEN).slice(1),
  [
    [13.6, 46.2],
    [13.6, 45.98],
    [13.8, 45.75],
  ],
);

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

const OESTERREICH = verbinde(
  GRENZE_OESTERREICH_SUEDWEST,
  GRENZE_OESTERREICH_JUGOSLAWIEN.slice(1),
  rueckwaerts(GRENZE_UNGARN_OESTERREICH).slice(1),
  GRENZE_OESTERREICH_NORD.slice(1),
  GRENZE_OESTERREICH_BRD.slice(1),
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

const NORWEGEN = verbinde(NORWEGEN_KUESTE, [[5.0, 61.4]], NORWEGEN_GRENZE);

const SCHWEDEN = verbinde(
  SCHWEDEN_KUESTE,
  rueckwaerts(NORWEGEN_GRENZE).slice(1),
  [[17.5, 61.4]],
);

const FINNLAND = verbinde(
  kueste(FINNLAND_KUESTE, [21.5, 61.3], [27.6, 60.55]),
  FINNLAND_GRENZE.slice(1),
  [[21.3, 61.4]],
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

const SOWJETUNION = verbinde(
  kueste(FINNLAND_KUESTE, [27.6, 60.55], [30.3, 59.94]),
  kueste(OSTSEE_OST, [30.3, 59.94], [19.9, 54.65]),
  [[19.65, 54.45]],
  GRENZE_POLEN_SOWJET.slice(1),
  rueckwaerts(GRENZE_RUMAENIEN_SOWJET).slice(1),
  kueste(SCHWARZMEER_WEST, [29.7, 45.2], [30.75, 46.48]),
  SCHWARZMEER_NORD.slice(1),
  [
    [46.0, 44.0],
    [46.0, 61.4],
    [29.0, 61.4],
  ],
  rueckwaerts(FINNLAND_GRENZE).slice(1),
);

/** Die Sowjetunion ohne die drei baltischen Staaten — der Zustand von 1991. */
const SOWJETUNION_OHNE_BALTIKUM = verbinde(
  kueste(FINNLAND_KUESTE, [27.6, 60.55], [30.3, 59.94]),
  kueste(OSTSEE_OST, [30.3, 59.94], [27.7, 59.47]),
  rueckwaerts(BALTIKUM_OSTGRENZE).slice(1),
  kueste(OSTSEE_OST, [21.05, 55.7], [19.9, 54.65]),
  [[19.65, 54.45]],
  GRENZE_POLEN_SOWJET.slice(1),
  rueckwaerts(GRENZE_RUMAENIEN_SOWJET).slice(1),
  kueste(SCHWARZMEER_WEST, [29.7, 45.2], [30.75, 46.48]),
  SCHWARZMEER_NORD.slice(1),
  [
    [46.0, 44.0],
    [46.0, 61.4],
    [29.0, 61.4],
  ],
  rueckwaerts(FINNLAND_GRENZE).slice(1),
);

const BALTIKUM = verbinde(
  kueste(OSTSEE_OST, [27.7, 59.47], [21.05, 55.7]),
  BALTIKUM_OSTGRENZE.slice(1),
);

/**
 * Der Eiserne Vorhang, wie er von 1949 bis 1989 verlief.
 *
 * Von der Lübecker Bucht die innerdeutsche Grenze entlang, dann die
 * tschechoslowakische Grenze zu Bayern und Österreich, dann die
 * österreichisch-ungarische — und dort endet er: Südlich davon beginnt
 * Jugoslawien, das seit 1948 zu keinem Block gehörte.
 */
const EISERNER_VORHANG = verbinde(
  INNERDEUTSCHE_GRENZE,
  rueckwaerts(GRENZE_BRD_OST).slice(1),
  rueckwaerts(GRENZE_OESTERREICH_NORD).slice(1),
  rueckwaerts(GRENZE_UNGARN_OESTERREICH).slice(1),
);

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
  // Der Eiserne Vorhang liegt über dem Untergrund und bleibt auf allen Phasen
  // stehen — auch auf der letzten, damit man sieht, was verschwunden ist.
  {
    art: 'grenze',
    d: geo.pfad(EISERNER_VORHANG, { geschlossen: false }),
    fill: 'none',
    stroke: KARTENFARBEN.mauer,
    strokeWidth: 2.5,
  },
];

/** Baut aus mehreren Ringen einen Pfad — eine Fläche, viele Teile. */
const flaecheAus = (...ringe) => ringe.map((ring) => geo.pfad(ring)).join(' ');

const NATO_RINGE_1949 = [
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
  NORWEGEN,
  PORTUGAL,
];

const NATO_RINGE_AB_1952 = [...NATO_RINGE_1949, GRIECHENLAND, TUERKEI_THRAKIEN, KLEINASIEN];

const NEUTRALE_RINGE = [
  SCHWEDEN,
  FINNLAND,
  SCHWEIZ,
  verbinde(IRLAND_KUESTE, rueckwaerts(IRLAND_GRENZE).slice(1)),
];

const OSTBLOCK_RINGE = [POLEN, TSCHECHOSLOWAKEI, UNGARN, RUMAENIEN, BULGARIEN];

const flaecheNato1949 = {
  titel: 'NATO in Europa (gegründet am 4. April 1949)',
  d: flaecheAus(...NATO_RINGE_1949),
};
const flaecheNato1961 = {
  titel: 'NATO in Europa (1961) — mit Griechenland und der Türkei seit 1952',
  d: flaecheAus(...NATO_RINGE_AB_1952),
};
const flaecheNato1991 = {
  titel: 'NATO in Europa (1991)',
  d: flaecheAus(...NATO_RINGE_AB_1952),
};

const flaecheBrd1949 = {
  titel: 'Bundesrepublik Deutschland (gegründet 1949) — noch kein NATO-Mitglied',
  d: geo.pfad(BUNDESREPUBLIK),
};
const flaecheBrd1961 = {
  titel: 'Bundesrepublik Deutschland — NATO-Mitglied seit 1955',
  d: geo.pfad(BUNDESREPUBLIK),
};

const flaecheDdr1949 = {
  titel: 'Deutsche Demokratische Republik (gegründet 1949)',
  d: geo.pfad(DDR),
};
const flaecheDdr1961 = {
  titel: 'Deutsche Demokratische Republik — Warschauer Pakt seit 1955',
  d: geo.pfad(DDR),
};

const flaecheWestBerlin1949 = {
  titel: 'West-Berlin — von den USA, Großbritannien und Frankreich verwaltet (1949)',
  d: geo.pfad(WEST_BERLIN),
};
const flaecheWestBerlin1961 = {
  titel: 'West-Berlin — seit dem 13. August 1961 von der Mauer umschlossen',
  d: geo.pfad(WEST_BERLIN),
};
const flaecheOstBerlin = {
  titel: 'Ost-Berlin — sowjetischer Sektor, ab 1949 Hauptstadt der DDR',
  d: geo.pfad(OST_BERLIN),
};

const flaecheDeutschland1990 = {
  titel: 'Deutschland — seit dem 3. Oktober 1990 wiedervereinigt',
  d: geo.pfad(DEUTSCHLAND_VEREINT),
};
const flaecheBerlin1990 = {
  titel: 'Berlin — die Mauer ist seit dem 9. November 1989 offen',
  d: geo.pfad(BERLIN_GANZ),
};

const flaecheSowjetunion1949 = { titel: 'Sowjetunion', d: geo.pfad(SOWJETUNION) };
const flaecheSowjetunion1961 = { titel: 'Sowjetunion — Warschauer Pakt', d: geo.pfad(SOWJETUNION) };
const flaecheSowjetunion1991 = {
  titel: 'Sowjetunion — aufgelöst am 25. Dezember 1991',
  d: geo.pfad(SOWJETUNION_OHNE_BALTIKUM),
};
const flaecheBaltikum = {
  titel: 'Estland, Lettland und Litauen — 1991 wieder unabhängig',
  d: geo.pfad(BALTIKUM),
};

const flaecheEinflussbereich1949 = {
  titel: 'Im sowjetischen Einflussbereich (1949): Polen, Tschechoslowakei, Ungarn, Rumänien, Bulgarien',
  d: flaecheAus(...OSTBLOCK_RINGE),
};
const flaecheWarschauerPakt1961 = {
  titel: 'Warschauer Pakt (gegründet am 14. Mai 1955): Polen, Tschechoslowakei, Ungarn, Rumänien, Bulgarien',
  d: flaecheAus(...OSTBLOCK_RINGE),
};
const flaecheWarschauerPakt1991 = {
  titel: 'Ehemaliger Warschauer Pakt — aufgelöst am 1. Juli 1991: Polen, Tschechoslowakei, Ungarn, Rumänien, Bulgarien',
  d: flaecheAus(...OSTBLOCK_RINGE),
};

const flaecheAlbanien1949 = {
  titel: 'Albanien — 1949 im sowjetischen Einflussbereich',
  d: geo.pfad(ALBANIEN),
};
const flaecheAlbanien1961 = {
  titel: 'Albanien — seit 1961 mit Moskau zerstritten, an China angelehnt',
  d: geo.pfad(ALBANIEN),
};
const flaecheAlbanien1991 = {
  titel: 'Albanien — 1990/91 endet die Abschottung',
  d: geo.pfad(ALBANIEN),
};

const flaecheJugoslawien1949 = {
  titel: 'Jugoslawien — seit dem Bruch mit Moskau 1948 keinem Block zugehörig',
  d: geo.pfad(JUGOSLAWIEN),
};
const flaecheJugoslawien1961 = {
  titel: 'Jugoslawien — 1961 Mitbegründer der Bewegung der Blockfreien',
  d: geo.pfad(JUGOSLAWIEN),
};
const flaecheJugoslawien1991 = {
  titel: 'Jugoslawien — 1991 beginnt der Zerfall',
  d: geo.pfad(JUGOSLAWIEN),
};

const flaecheOesterreich1949 = {
  titel: 'Österreich — noch von den vier Siegermächten besetzt (bis 1955)',
  d: geo.pfad(OESTERREICH),
};
const flaecheOesterreich1961 = {
  titel: 'Österreich — seit dem Staatsvertrag von 1955 neutral',
  d: geo.pfad(OESTERREICH),
};
const flaecheOesterreich1991 = { titel: 'Österreich — neutral', d: geo.pfad(OESTERREICH) };

const flaecheSpanien1949 = {
  titel: 'Spanien — Diktatur unter Franco, kein NATO-Mitglied (1949)',
  d: geo.pfad(SPANIEN),
};
const flaecheSpanien1961 = {
  titel: 'Spanien — Diktatur unter Franco, seit 1953 mit US-Stützpunkten',
  d: geo.pfad(SPANIEN),
};
const flaecheSpanien1991 = {
  titel: 'Spanien — NATO-Mitglied seit 1982',
  d: geo.pfad(SPANIEN),
};

const flaecheGriechenlandTuerkei1949 = {
  titel: 'Griechenland und die Türkei — Empfänger der Truman-Doktrin seit 1947, NATO-Beitritt 1952',
  d: flaecheAus(GRIECHENLAND, TUERKEI_THRAKIEN, KLEINASIEN),
};

const flaecheNeutrale1949 = {
  titel: 'Neutrale und bündnisfreie Staaten (1949): Schweden, Finnland, Schweiz, Irland',
  d: flaecheAus(...NEUTRALE_RINGE),
};
const flaecheNeutrale1961 = {
  titel: 'Neutrale und bündnisfreie Staaten (1961): Schweden, Finnland, Schweiz, Irland',
  d: flaecheAus(...NEUTRALE_RINGE),
};
const flaecheNeutrale1991 = {
  titel: 'Neutrale und bündnisfreie Staaten (1991): Schweden, Finnland, Schweiz, Irland',
  d: flaecheAus(...NEUTRALE_RINGE),
};

const phasen = [
  {
    id: 'blockbildung',
    label: '1949',
    hinweis: [
      'Vier Jahre nach dem Ende des Krieges stehen zwei deutsche Staaten auf',
      'der Karte: die Bundesrepublik (Grundgesetz vom 23. Mai, erste',
      'Bundesregierung im September) und die DDR (7. Oktober). Berlin liegt',
      'mitten im Gebiet der DDR und ist in vier Sektoren geteilt; die Blockade',
      'der Westsektoren endete am 12. Mai 1949, elf Monate nach ihrem Beginn.',
      'Am 4. April 1949 war die NATO gegründet worden — die USA, Kanada und',
      'Island gehören dazu, liegen aber außerhalb dieses Ausschnitts. Einen',
      'Warschauer Pakt gibt es noch nicht, er kommt erst 1955; die Staaten',
      'östlich der Linie stehen aber schon unter sowjetischem Einfluss.',
      'Griechenland und die Türkei sind noch keine NATO-Mitglieder, erhalten',
      'aber seit 1947 Hilfe nach der Truman-Doktrin. Österreich ist noch von',
      'vier Mächten besetzt. Das Saarland stand bis 1957 unter französischer',
      'Verwaltung — auf dieser Karte ist es der Bundesrepublik zugeschlagen,',
      '1949 gehörte es nicht dazu.',
    ].join(' '),
    flaechen: [
      flaecheNato1949,
      flaecheBrd1949,
      flaecheDdr1949,
      flaecheWestBerlin1949,
      flaecheOstBerlin,
      flaecheSowjetunion1949,
      flaecheEinflussbereich1949,
      flaecheAlbanien1949,
      flaecheJugoslawien1949,
      flaecheGriechenlandTuerkei1949,
      flaecheOesterreich1949,
      flaecheSpanien1949,
      flaecheNeutrale1949,
    ],
  },
  {
    id: 'mauer-und-kubakrise',
    label: '1961/62',
    hinweis: [
      'Jetzt stehen sich zwei Bündnisse gegenüber: die NATO, der die',
      'Bundesrepublik 1955 beitrat, und der Warschauer Pakt, der als Antwort',
      'darauf im selben Jahr entstand — mit der DDR als Mitglied. Griechenland',
      'und die Türkei sind seit 1952 in der NATO; in der Türkei stehen',
      'amerikanische Jupiter-Raketen, und genau die werden im Oktober 1962 Teil',
      'des geheimen Handels, der die Kubakrise beendet. Kuba selbst liegt',
      'siebentausend Kilometer westlich dieser Karte. In Berlin wird seit dem',
      '13. August 1961 eine Mauer gebaut; die Grenze quer durch Deutschland ist',
      '1 393 Kilometer lang. Österreich ist seit 1955 neutral, die sowjetischen',
      'Truppen sind abgezogen — das gab es also auch. Jugoslawien gehört zu',
      'keinem Block und gründet 1961 mit Indien und Ägypten die Bewegung der',
      'Blockfreien.',
    ].join(' '),
    flaechen: [
      flaecheNato1961,
      flaecheBrd1961,
      flaecheDdr1961,
      flaecheWestBerlin1961,
      flaecheOstBerlin,
      flaecheSowjetunion1961,
      flaecheWarschauerPakt1961,
      flaecheAlbanien1961,
      flaecheJugoslawien1961,
      flaecheOesterreich1961,
      flaecheSpanien1961,
      flaecheNeutrale1961,
    ],
  },
  {
    id: 'wende',
    label: '1989–1991',
    hinweis: [
      'In zwei Jahren verschwindet die Ordnung von vierzig. Am 9. November 1989',
      'öffnet sich die Mauer, am 3. Oktober 1990 sind die beiden deutschen',
      'Staaten wieder einer — völkerrechtlich geregelt im Zwei-plus-Vier-Vertrag',
      'vom 12. September 1990. Am 1. Juli 1991 löst sich der Warschauer Pakt',
      'auf, am 25. Dezember 1991 tritt Michail Gorbatschow zurück und die',
      'Sowjetunion hört auf zu bestehen; Estland, Lettland und Litauen sind',
      'schon im selben Jahr wieder unabhängig. Die dunkle Linie quer durch',
      'Europa steht auf dieser Phase noch da, obwohl es sie nicht mehr gibt —',
      'sie zeigt, was verschwunden ist. Was danach kam, ist nicht mehr Teil',
      'dieses Kapitels: In Jugoslawien beginnt 1991 der Zerfall, und die Frage,',
      'wie sich das Verhältnis zwischen Russland und dem Westen weiterentwickelt,',
      'stellt das nächste Kapitel.',
    ].join(' '),
    flaechen: [
      flaecheNato1991,
      flaecheDeutschland1990,
      flaecheBerlin1990,
      flaecheSowjetunion1991,
      flaecheBaltikum,
      flaecheWarschauerPakt1991,
      flaecheAlbanien1991,
      flaecheJugoslawien1991,
      flaecheOesterreich1991,
      flaecheSpanien1991,
      flaecheNeutrale1991,
    ],
  },
];

const punkte = [
  {
    id: 'berlin',
    name: 'Berlin',
    typ: 'ereignis',
    ...ort(13.3, 52.5),
    text: [
      'Keine Stadt der Welt hat den Kalten Krieg so vollständig erlebt wie',
      'diese. Am 24. Juni 1948 sperrte die sowjetische Seite alle Straßen,',
      'Schienen- und Wasserwege nach West-Berlin — Anlass war die Einführung',
      'der D-Mark in den Westzonen wenige Tage zuvor, die aus Moskauer Sicht',
      'die gemeinsame Verwaltung Deutschlands beendete. Zwei Millionen',
      'Menschen in den Westsektoren waren abgeschnitten. Die Antwort war die',
      'Luftbrücke: In elf Monaten brachten rund 280 000 Flüge etwa 2,3',
      'Millionen Tonnen Kohle, Mehl und Medikamente in die Stadt, im Abstand',
      'von wenigen Minuten. Rund achtzig Menschen kamen bei Abstürzen ums',
      'Leben. Am 12. Mai 1949 wurde die Blockade aufgehoben. Am 13. August',
      '1961 begann der Bau der Mauer — 155 Kilometer um West-Berlin herum;',
      'bis 1989 starben an der innerdeutschen Grenze und der Mauer nach',
      'heutigem Forschungsstand mindestens 140 Menschen allein in Berlin. Am',
      'Abend des 9. November 1989 öffneten sich die Übergänge, nachdem ein',
      'Mitglied der DDR-Führung eine neue Reiseregelung auf einer',
      'Pressekonferenz missverständlich verkündet hatte.',
    ].join(' '),
  },
  {
    id: 'bonn',
    name: 'Bonn',
    typ: 'stadt',
    ...ort(7.1, 50.73),
    text: [
      'Die Bundesrepublik wählte 1949 bewusst eine kleine Universitätsstadt am',
      'Rhein zur Hauptstadt — nicht Frankfurt, das zu endgültig gewirkt hätte.',
      'Bonn war das Gegenteil einer Machtdemonstration: eine provisorische',
      'Hauptstadt für einen Staat, der sich selbst als Provisorium verstand,',
      'bis Deutschland wieder eines wäre. Von hier aus wurde die',
      'Westbindung betrieben (Marshallplan-Hilfe ab 1948, NATO-Beitritt 1955,',
      'Römische Verträge 1957) — und ab 1969 auch die Ostpolitik Willy',
      'Brandts, die beides zugleich sein sollte: fest im Westen verankert und',
      'gesprächsbereit nach Osten. 1991 entschied der Bundestag mit 338 zu 320',
      'Stimmen, dass Berlin wieder Regierungssitz wird — eine der knappsten',
      'Abstimmungen der deutschen Nachkriegsgeschichte.',
    ].join(' '),
  },
  {
    id: 'moskau',
    name: 'Moskau',
    typ: 'stadt',
    ...ort(37.62, 55.75),
    text: [
      'Der andere Pol. Von hier aus wurde 1947 der Marshallplan für die eigene',
      'Einflusszone abgelehnt, 1955 der Warschauer Pakt gegründet, 1962 die',
      'Raketenstationierung auf Kuba beschlossen und wieder abgebrochen, 1968',
      'der Einmarsch in die Tschechoslowakei befohlen. Die Beweggründe, die',
      'diese Stimme nicht bestreitet: Die Sowjetunion hatte im Zweiten',
      'Weltkrieg rund 27 Millionen Menschen verloren und war binnen dreißig',
      'Jahren zweimal von Westen angegriffen worden; ein Gürtel befreundeter',
      'Staaten galt in Moskau als Lebensversicherung. Aus westlicher Sicht war',
      'die daraus abgeleitete Angst vor Einkreisung übertrieben — erfunden war',
      'sie nicht. Ab 1985 änderte Michail Gorbatschow den Kurs: Perestroika',
      '(Umbau) und Glasnost (Offenheit), Abrüstungsverträge mit Washington und',
      '1989 die Entscheidung, die Reformen in Osteuropa nicht mit Panzern zu',
      'beenden. Am 12. September 1990 wurde hier der Zwei-plus-Vier-Vertrag',
      'unterzeichnet, am 25. Dezember 1991 trat Gorbatschow zurück.',
    ].join(' '),
  },
  {
    id: 'prag',
    name: 'Prag',
    typ: 'ereignis',
    ...ort(14.42, 50.09),
    text: [
      'Im Februar 1948 übernahm die Kommunistische Partei in der',
      'Tschechoslowakei die alleinige Macht — für viele im Westen der Moment,',
      'in dem aus Misstrauen Gewissheit wurde. Zwanzig Jahre später versuchte',
      'die Führung um Alexander Dubček einen „Sozialismus mit menschlichem',
      'Antlitz": Pressefreiheit, offene Debatte, Reformen im Inneren, aber',
      'kein Austritt aus dem Warschauer Pakt. In der Nacht zum 21. August 1968',
      'beendeten Truppen des Warschauer Pakts den Prager Frühling. Der Westen',
      'protestierte und griff nicht ein — dieselbe Rechnung wie 1953 und 1956:',
      'Ein Eingreifen hätte Krieg zwischen Atommächten bedeutet. Im Januar',
      '1977 forderten Bürgerrechtler mit der „Charta 77" die Einhaltung genau',
      'jener Menschenrechte, die ihre Regierung 1975 in Helsinki selbst',
      'unterschrieben hatte. Im November 1989 gingen in Prag Hunderttausende',
      'auf die Straße; binnen Wochen wechselte die Macht — ohne einen Schuss.',
      'Deshalb heißt es die Samtene Revolution.',
    ].join(' '),
  },
  {
    id: 'leipzig',
    name: 'Leipzig',
    typ: 'ereignis',
    ...ort(12.37, 51.34),
    text: [
      'In der Nikolaikirche gab es seit 1982 montags Friedensgebete. Ab',
      'September 1989 wurden daraus Demonstrationen, und am 9. Oktober 1989',
      'kamen rund 70 000 Menschen. Sicherheitskräfte, Betriebskampfgruppen und',
      'Krankenhäuser waren auf einen Einsatz vorbereitet; wer den Befehl zum',
      'Zurückhalten gab, ist bis heute nicht restlos geklärt. Der Ruf lautete',
      '„Wir sind das Volk" und „Keine Gewalt" — und es blieb bei beidem. Vier',
      'Wochen später fiel die Mauer. Für die Erzählung des Kalten Krieges ist',
      'dieser Abend zentral: Das Ende kam nicht durch eine Armee von außen,',
      'sondern durch Menschen, die ohne Waffen auf die Straße gingen — und',
      'durch die Entscheidung, nicht zu schießen.',
    ].join(' '),
  },
  {
    id: 'budapest',
    name: 'Budapest',
    typ: 'ereignis',
    ...ort(19.04, 47.5),
    text: [
      'Im Oktober 1956 erhob sich Ungarn: Die Regierung unter Imre Nagy kündigte',
      'freie Wahlen und den Austritt aus dem Warschauer Pakt an. Anfang November',
      'schlugen sowjetische Truppen den Aufstand nieder; etwa 2 500 Ungarn',
      'starben, rund 200 000 flohen in den Westen, Nagy wurde 1958 hingerichtet.',
      'Radiosender im Westen hatten Hoffnungen geweckt, die niemand einzulösen',
      'bereit war — der Westen sah zu. Diese Stimme nennt das eine der',
      'bittersten Stellen ihrer eigenen Erzählung. 1989 kehrte sich die',
      'Richtung um: Am 2. Mai begann Ungarn, die Sperranlagen an der Grenze zu',
      'Österreich abzubauen, am 19. August ließ das Paneuropäische Picknick bei',
      'Sopron Hunderte DDR-Bürger hinüber, am 11. September öffnete Ungarn die',
      'Grenze ganz. Das erste Loch im Eisernen Vorhang lag nicht in Berlin,',
      'sondern hier.',
    ].join(' '),
  },
  {
    id: 'helsinki',
    name: 'Helsinki',
    typ: 'ereignis',
    ...ort(24.94, 60.17),
    text: [
      'Am 1. August 1975 unterschrieben 35 Staaten — die NATO-Länder, die',
      'Warschauer-Pakt-Staaten und die Neutralen — die Schlussakte der',
      'Konferenz über Sicherheit und Zusammenarbeit in Europa. Die',
      'Sowjetunion bekam, was sie seit Jahrzehnten wollte: die Anerkennung der',
      'Grenzen von 1945. Der Westen bekam dafür einen Satz auf Papier — den',
      '„Korb III" über Menschenrechte, Reisefreiheit, Familienzusammenführung',
      'und freien Informationsfluss. Viele hielten das damals für einen',
      'schlechten Tausch. Es wurde der folgenreichste des ganzen Kalten',
      'Krieges: Weil die Schlussakte in allen Unterzeichnerstaaten',
      'veröffentlicht werden musste, konnten sich Bürgerrechtler von Moskau bis',
      'Prag auf ein Dokument berufen, das ihre eigene Regierung unterzeichnet',
      'hatte. Die Moskauer Helsinki-Gruppe entstand 1976, die Charta 77 ein Jahr',
      'später. Was als Zugeständnis aussah, wirkte wie ein Hebel von innen.',
    ].join(' '),
  },
];

const bewegungen = [
  {
    id: 'luftbruecke',
    name: 'Die Berliner Luftbrücke, 1948/49',
    von: p(8.68, 50.11),
    ueber: [p(10.6, 51.4)],
    nach: [punkte.find((punkt) => punkt.id === 'berlin').x, punkte.find((punkt) => punkt.id === 'berlin').y],
    text: [
      'Drei Luftkorridore von je 32 Kilometern Breite verbanden West-Berlin mit',
      'den Westzonen — sie waren 1945 schriftlich vereinbart worden, und genau',
      'das machte die Luftbrücke möglich: Die Straßen waren gesperrt, der',
      'Luftweg vertraglich zugesichert. Der Pfeil zeigt den südlichen Korridor',
      'von Frankfurt am Main nach Berlin-Tempelhof; die anderen beiden kamen',
      'aus Hamburg und Hannover. Auf dem Höhepunkt landete alle drei Minuten',
      'ein Flugzeug. Der amerikanische Pilot Gail Halvorsen warf über den',
      'Wohnvierteln Süßigkeiten an selbstgebastelten Fallschirmen ab; daraus',
      'wurde die Aktion „Little Vittles" und der Name „Rosinenbomber". Drei',
      'Jahre nach dem Ende eines Krieges, den Deutschland begonnen hatte,',
      'standen Berliner Kinder an der Einflugschneise und winkten den Flugzeugen',
      'zu, die ihre Stadt bombardiert hatten. Für den Westen war das eine',
      'humanitäre Leistung — und zugleich ein politischer Erfolg, wie diese',
      'Stimme selbst sagt: Aus Besatzern wurden Schutzmächte.',
    ].join(' '),
  },
  {
    id: 'flucht-aus-der-ddr',
    name: 'Die Fluchtbewegung aus der DDR, bis 1961',
    von: p(13.74, 51.05),
    ueber: [p(13.45, 52.45)],
    nach: p(9.73, 52.37),
    text: [
      'Zwischen 1949 und 1961 verließen rund 2,7 Millionen Menschen die DDR —',
      'jeder sechste. Die meisten gingen über Berlin: Innerhalb der Stadt war',
      'die Sektorengrenze bis 1961 mit der S-Bahn zu überqueren, von den',
      'Westsektoren aus wurden die Ankommenden in die Bundesrepublik',
      'ausgeflogen. Es waren überdurchschnittlich viele junge und gut',
      'ausgebildete Menschen; für die DDR-Wirtschaft war das auf Dauer nicht',
      'zu tragen. Der Mauerbau am 13. August 1961 war die Antwort darauf —',
      'die Führung in Ost-Berlin nannte ihn „antifaschistischen Schutzwall".',
      'Der Westen protestierte scharf und tat nichts: Präsident Kennedy sagte',
      'im Kreis seiner Berater sinngemäß, eine Mauer sei keine schöne Lösung,',
      'aber sehr viel besser als ein Krieg. Auch das gehört zur westlichen',
      'Erzählung, und diese Stimme spricht es aus: Die Freiheit West-Berlins',
      'war garantiert, die der Menschen im Osten nicht.',
    ].join(' '),
  },
  {
    id: 'oeffnung-1989',
    name: 'Der Weg über Ungarn, 1989',
    von: [punkte.find((punkt) => punkt.id === 'budapest').x, punkte.find((punkt) => punkt.id === 'budapest').y],
    ueber: [p(16.6, 47.68), p(16.37, 48.21)],
    nach: p(11.58, 48.14),
    text: [
      'Im Sommer 1989 fuhren Zehntausende DDR-Bürger nach Ungarn, offiziell in',
      'den Urlaub. Beim Paneuropäischen Picknick bei Sopron am 19. August',
      'wurde ein Grenztor für ein symbolisches Fest geöffnet — mehrere hundert',
      'Menschen liefen einfach hindurch nach Österreich, und die ungarischen',
      'Grenzer ließen sie. Am 11. September öffnete Ungarn die Grenze',
      'förmlich; in den folgenden Tagen kamen rund 30 000 Menschen über',
      'Österreich in die Bundesrepublik. Andere besetzten die westdeutschen',
      'Botschaften in Prag und Warschau; am 30. September verkündete',
      'Außenminister Hans-Dietrich Genscher vom Balkon der Prager Botschaft',
      'ihre Ausreise — der Satz brach im Jubel ab. Entscheidend war, was nicht',
      'geschah: Moskau schickte keine Panzer. Ohne diese Entscheidung wäre der',
      'Herbst 1989 vermutlich verlaufen wie 1953, 1956 und 1968.',
    ].join(' '),
  },
  {
    id: 'truppenabzug',
    name: 'Der Abzug der sowjetischen Truppen, 1991–1994',
    von: p(13.5, 52.17),
    ueber: [p(21.0, 52.23), p(27.56, 53.9)],
    nach: [punkte.find((punkt) => punkt.id === 'moskau').x, punkte.find((punkt) => punkt.id === 'moskau').y],
    text: [
      'Artikel 4 des Zwei-plus-Vier-Vertrags vom 12. September 1990 verpflichtete',
      'die Sowjetunion, ihre Truppen bis Ende 1994 aus dem Gebiet der',
      'ehemaligen DDR abzuziehen. Es waren rund 340 000 Soldaten und noch',
      'einmal so viele Angehörige, dazu Panzer, Flugzeuge und Munition — der',
      'größte Truppenabzug in Friedenszeiten, den es je gab. Das Hauptquartier',
      'lag in Wünsdorf südlich von Berlin, einer Stadt aus Kasernen, die auf',
      'keiner DDR-Karte verzeichnet war. Am 31. August 1994 verließen die',
      'letzten Soldaten Deutschland; Deutschland finanzierte im Gegenzug den',
      'Bau von Wohnungen in der zerfallenden Sowjetunion. Der Vertrag wurde in',
      'diesem Punkt vollständig eingehalten — von beiden Seiten.',
    ].join(' '),
  },
];

const beschriftungen = [
  { text: 'Atlantik', art: 'meer', ...ort(-8.5, 45.5) },
  { text: 'Nordsee', art: 'meer', ...ort(3.0, 56.5) },
  { text: 'Ostsee', art: 'meer', ...ort(19.5, 57.0) },
  { text: 'Mittelmeer', art: 'meer', ...ort(10.0, 38.0) },
  { text: 'Schwarzes Meer', art: 'meer', ...ort(34.0, 43.5) },
  { text: 'NATO', art: 'land', ...ort(1.5, 46.0) },
  { text: 'Warschauer Pakt', art: 'land', ...ort(24.0, 51.5) },
  { text: 'Eiserner Vorhang', art: 'land', ...ort(9.2, 50.6), drehung: -78 },
  { text: 'Neutrale', art: 'land', ...ort(14.0, 47.6) },
  { text: 'Sowjetunion', art: 'land', ...ort(36.0, 58.0) },
  { text: 'Jugoslawien', art: 'land', ...ort(19.0, 44.3) },
  { text: 'Alpen', art: 'land', ...ort(10.0, 46.3), drehung: -20 },
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
