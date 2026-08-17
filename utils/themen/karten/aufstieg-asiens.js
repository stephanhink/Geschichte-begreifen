// Die Karte zum Thema „Der Aufstieg Asiens und die Zukunft des Westens" —
// Geschichte in Bewegung, und die letzte Karte dieser App.
//
// Die Küstenlinien stehen als echte Längen-/Breitengrade `[lon, lat]` und
// werden von utils/karte-geo.js in SVG-Koordinaten umgerechnet. Wer einen
// Punkt anzweifelt, schlägt ihn im Atlas nach: `[8.68, 50.11]` ist Frankfurt
// am Main, `[139.69, 35.69]` ist Tokio, `[103.85, 1.29]` ist Singapur.
//
// Der Ausschnitt: 10° W bis 145° O, 10° S bis 58° N — 700 × 336,2. Das sind
// 4,5 SVG-Einheiten je Längengrad, und damit ist dies die gröbste Karte der
// App (bisher war es die Pazifikkarte mit 5). Sie spannt 155 Längengrade, ein
// gutes Drittel des Erdumfangs, und genau darin liegt ihre Aussage: Frankfurt
// und Tokio müssen auf ein Bild, sonst hat dieses Kapitel keine Bühne. Es
// erzählt von einer Verschiebung zwischen zwei Enden Eurasiens; wer nur das
// eine Ende sieht, sieht keine Verschiebung.
//
// Was dieser Ausschnitt kostet, steht hier, damit niemand es für einen Fehler
// hält:
//
//   * **Die USA liegen außerhalb.** Das ist die schwerwiegendste Lücke dieser
//     Karte, und sie wird nicht versteckt: Die Vereinigten Staaten waren 1955
//     die größte Volkswirtschaft der Welt, sie sind es 1990 und sie sind es
//     2024 — mit rund einem Viertel der Weltwirtschaft. Der Hinweis jeder
//     Phase sagt das, und der Marshallplan-Pfeil kommt sichtbar von außerhalb
//     des linken Bildrands herein. Diese Karte zeigt nicht die Welt, sondern
//     die beiden Enden Eurasiens, zwischen denen dieses Kapitel spielt.
//   * Australien beginnt bei 10,7° S und liegt damit knapp unter dem unteren
//     Rand; Neuseeland, Afrika südlich von Tansania, Sibirien nördlich von
//     58° N und der ganze Pazifik östlich von 145° O ebenso.
//   * Skandinavien ist nur bis etwa Uppsala zu sehen, Britannien bis
//     Nordschottland.
//
// Fünf Festlegungen, die ausdrücklich hierher gehören:
//
//   1. **Die Fläche zeigt Land, nicht Gewicht.** Chinas Staatsgebiet ist
//      siebenundzwanzigmal so groß wie das deutsche; 1990 war die deutsche
//      Wirtschaftsleistung viermal so groß wie die chinesische. Eine Karte,
//      die Wirtschaft als Fläche liest, lügt also — deshalb steht das Gewicht
//      in den Titeln der Flächen und in den Hinweisen der Phasen, mit Zahlen
//      und Jahreszahl. Wer nur die Farben ansieht, hat dieses Kapitel nicht
//      gelesen.
//   2. **Eingefärbt wird nur, wovon dieses Kapitel erzählt.** In Europa sind
//      das die sechs Gründerstaaten der Europäischen Wirtschaftsgemeinschaft
//      von 1957 (dazu die DDR als eigene, benannte Fläche, solange es sie
//      gibt), in Asien Japan, Südkorea, Taiwan, Hongkong, Singapur, die
//      Volksrepublik China, Indien und — ab der letzten Phase — Vietnam.
//      Spanien, Skandinavien, Polen, die Türkei, Indonesien, Australien und
//      alle anderen fehlen nicht, weil sie unwichtig wären, sondern weil der
//      Text nicht von ihnen handelt. Ungefärbt heißt hier nicht „leer",
//      sondern „nicht Gegenstand dieses Kapitels".
//   3. **Die zweite, deckungsgleiche Lage markiert die zweitgrößte
//      Volkswirtschaft der Welt** — und sie wandert: Bundesrepublik
//      Deutschland (Mitte der 1960er Jahre) → Japan (ab 1968) → Volksrepublik
//      China (ab 2010). Das ist der einzige Weg zu zwei Tönen, weil die App
//      alle Flächen einer Phase gleich einfärbt (0,72 Deckkraft, zwei Lagen
//      ergeben dunkler); dieselbe Mechanik trägt Russland auf der Karte des
//      vorigen Kapitels und West-Berlin auf der des Kalten Krieges. Der Titel
//      der zweiten Lage sagt offen, was sie ist. Die Reihenfolge ist keine
//      Rangliste der Verdienste, sondern eine Reihe von Jahreszahlen.
//   4. **Umstrittene Grenzen werden als umstritten benannt, nicht
//      entschieden.** Drei Stellen betrifft das: Taiwan (die Insel wird von
//      Taipeh regiert, die Volksrepublik beansprucht sie — beides steht im
//      Titel, die Karte entscheidet nichts), die Linie zwischen Indien und
//      China im Himalaja (Aksai Chin, Arunachal Pradesh) und Kaschmir. Die
//      Karte zeichnet, wer wo regiert, mit Jahreszahl — mehr nicht.
//   5. **Die politischen Grenzen sind angenähert, nicht vermessen** — anders
//      als die Küstenlinien, die auf Atlas-Koordinaten beruhen. Bei 4,5
//      Einheiten je Längengrad ist ein Grenzstreit von fünfzig Kilometern
//      schmaler als der Strich. Hongkong und Singapur sind aus demselben Grund
//      größer gezeichnet, als sie sind: In wahrer Größe wären sie kleiner als
//      ihre eigene Umrandung. Ihre Lage stimmt, ihre Größe nicht.
//
// Reine Daten und Rechnung — keine UI-Importe (Architektur-Regel).

const { KARTENFARBEN, erstelleProjektion, rueckwaerts, verbinde } = require('../../karte-geo');

// ---------------------------------------------------------------------------
// Ausschnitt und Projektion
// ---------------------------------------------------------------------------

const RAHMEN = { minLon: -10, maxLon: 145, minLat: -10, maxLat: 58, breite: 700 };

const geo = erstelleProjektion(RAHMEN);

/** Kurzform: geografischer Ort → SVG-Punkt `[x, y]`. */
const p = (lon, lat) => geo.punkt(lon, lat);

/** Dasselbe als `{ x, y }` — die Form, die Punkte und Beschriftungen wollen. */
const ort = (lon, lat) => {
  const [x, y] = p(lon, lat);
  return { x, y };
};

// ---------------------------------------------------------------------------
// Werkzeug: Küstenabschnitte nach Orten schneiden (wie in karten/die-kolonien.js)
// ---------------------------------------------------------------------------

/** Der Index des Küstenpunkts, der einem Ort am nächsten liegt. */
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

/** Ein Küstenabschnitt zwischen zwei Orten — in der Richtung, in der er gebraucht wird. */
const kueste = (liste, von, bis) => {
  const a = naechsterIndex(liste, von[0], von[1]);
  const b = naechsterIndex(liste, bis[0], bis[1]);
  return a <= b ? liste.slice(a, b + 1) : rueckwaerts(liste.slice(b, a + 1));
};

/** Ein kleines Vieleck um einen Ort — für Inseln, die sonst unsichtbar wären. */
const eiland = (lon, lat, r = 0.45) => [
  [lon - r, lat],
  [lon - r * 0.6, lat + r * 0.7],
  [lon + r * 0.6, lat + r * 0.7],
  [lon + r, lat],
  [lon + r * 0.6, lat - r * 0.7],
  [lon - r * 0.6, lat - r * 0.7],
];

// ---------------------------------------------------------------------------
// Europa und der Mittelmeerraum — dieselben Atlas-Küsten wie in
// karten/die-kolonien.js, weil beide Karten denselben Ring brauchen
// ---------------------------------------------------------------------------

/** Die Atlantikküste: Calais → Brest → Gironde → Lissabon → Tarifa. */
const ATLANTIK_EUROPA = [
  [1.85, 50.96], // Calais
  [0.7, 49.9],
  [0.1, 49.5], // Le Havre
  [-1.0, 49.4],
  [-1.6, 49.7], // die Spitze des Cotentin
  [-2.5, 48.6],
  [-3.5, 48.8],
  [-4.49, 48.39], // Brest
  [-4.2, 47.8],
  [-2.9, 47.5],
  [-2.2, 47.25], // die Loiremündung
  [-1.2, 46.3],
  [-1.16, 45.7], // die Gironde
  [-1.3, 44.6],
  [-1.5, 43.5],
  [-1.78, 43.35], // die Bidassoa, die Grenze zu Spanien
  [-2.93, 43.26], // Bilbao
  [-4.5, 43.4],
  [-6.0, 43.6],
  [-7.9, 43.7],
  [-8.4, 43.37], // A Coruña
  [-9.28, 42.9], // Kap Finisterre
  [-8.87, 41.87], // die Minhomündung
  [-8.7, 41.15], // Porto
  [-8.9, 40.15],
  [-9.4, 39.35],
  [-9.48, 38.78], // Kap Roca
  [-9.0, 38.5],
  [-8.9, 37.9],
  [-8.99, 37.02], // Kap São Vicente
  [-7.4, 37.17],
  [-6.35, 36.8], // Cádiz
  [-6.03, 36.18], // Kap Trafalgar
  [-5.61, 36.0], // Tarifa
];

/** Die Ostsee- und Nordseeküste: Estland → Danzig → Jütland → Calais. */
const OSTSEE_NORDSEE = [
  [26.8, 59.5],
  [25.0, 59.5],
  [24.0, 59.4],
  [23.5, 58.6],
  [24.3, 57.9],
  [24.1, 57.05], // Riga
  [23.0, 57.1],
  [22.6, 57.75], // Kap Kolka
  [21.0, 56.5],
  [21.05, 55.7], // Klaipėda
  [20.0, 54.9],
  [19.3, 54.55],
  [18.65, 54.35], // Danzig
  [17.3, 54.75],
  [16.2, 54.25],
  [14.25, 53.92], // Świnoujście
  [13.1, 54.31], // Stralsund
  [12.1, 54.18], // Rostock
  [11.0, 54.1],
  [10.13, 54.33], // Kiel
  [9.9, 54.5],
  [9.43, 54.79], // Flensburg
  [9.9, 55.5],
  [10.2, 56.15], // Aarhus
  [10.5, 57.0],
  [10.6, 57.75], // Skagen
  [9.96, 57.59],
  [8.6, 56.9],
  [8.13, 56.2],
  [8.45, 55.47], // Esbjerg
  [8.4, 55.0],
  [8.65, 54.6],
  [9.05, 54.48], // Husum
  [8.85, 54.0],
  [8.7, 53.87], // die Elbmündung
  [8.15, 53.5],
  [7.2, 53.6], // die Emsmündung
  [6.2, 53.45],
  [5.4, 52.9],
  [5.05, 52.35],
  [4.75, 52.96],
  [4.5, 52.3],
  [4.05, 51.98],
  [3.4, 51.45],
  [2.6, 51.1],
  [1.85, 50.96],
];

/**
 * Die Nordküste des Mittelmeers: Gibraltar → Italien → Griechenland →
 * Kleinasien → Levante → Port Said → Sues. Der Weg um die Ägäis herum ist
 * kein Umweg — sonst würde sie zu Land.
 */
const MITTELMEER_NORD = [
  [-5.61, 36.0], // Tarifa
  [-4.42, 36.72], // Málaga
  [-2.46, 36.83], // Almería
  [-0.98, 37.6], // Cartagena
  [-0.5, 38.35],
  [0.2, 38.75], // Kap Nao
  [0.0, 39.5],
  [0.87, 40.72], // das Ebrodelta
  [1.2, 41.1],
  [2.18, 41.38], // Barcelona
  [3.28, 42.32], // Kap Creus
  [3.05, 43.02],
  [4.4, 43.4], // das Rhonedelta
  [5.37, 43.3], // Marseille
  [6.6, 43.15],
  [7.27, 43.7], // Nizza
  [8.3, 44.1],
  [8.95, 44.4], // Genua
  [9.83, 44.1], // La Spezia
  [10.3, 43.5],
  [11.0, 42.6],
  [11.8, 42.1],
  [12.4, 41.75], // die Tibermündung
  [13.1, 41.25],
  [14.27, 40.85], // Neapel
  [14.9, 40.6],
  [15.5, 40.0],
  [16.0, 39.4],
  [15.9, 38.5],
  [15.65, 38.0], // Reggio
  [16.6, 38.9],
  [17.2, 39.4],
  [17.2, 40.5], // Tarent
  [18.0, 40.1],
  [18.5, 40.15], // Otranto
  [17.9, 40.7],
  [16.9, 41.15], // Bari
  [15.9, 41.9], // der Gargano
  [14.0, 42.4], // Pescara
  [13.5, 43.6], // Ancona
  [12.6, 44.4], // Ravenna
  [12.34, 45.44], // Venedig
  [13.65, 45.7], // Triest
  [14.5, 45.3], // Rijeka
  [15.2, 44.1], // Zadar
  [16.4, 43.5], // Split
  [18.09, 42.65], // Dubrovnik
  [19.2, 42.0],
  [19.5, 41.3], // Durrës
  [19.4, 40.5], // Vlora
  [20.0, 39.7],
  [20.7, 38.9],
  [21.3, 38.3],
  [21.6, 37.6],
  [21.7, 37.0],
  [22.5, 36.5], // Kap Matapan
  [23.2, 36.4],
  [23.5, 37.4],
  [23.7, 37.95], // Piräus
  [24.0, 38.3],
  [23.5, 39.2],
  [22.9, 39.9], // Volos
  [22.6, 40.5], // Thessaloniki
  [24.0, 40.7], // Kavala
  [25.9, 40.85],
  [26.2, 40.3], // die Dardanellen
  [26.7, 39.6],
  [26.9, 38.9],
  [27.14, 38.42], // Izmir
  [27.2, 37.7],
  [27.4, 37.0],
  [28.2, 36.6],
  [29.1, 36.2],
  [30.5, 36.3], // Antalya
  [31.4, 36.8],
  [32.8, 36.1],
  [34.0, 36.3], // Mersin
  [35.5, 36.6], // Iskenderun
  [36.0, 36.0],
  [35.9, 35.5], // Latakia
  [35.5, 34.6],
  [35.5, 33.9], // Beirut
  [35.0, 33.1],
  [34.9, 32.5], // Haifa
  [34.75, 32.1], // Jaffa
  [34.47, 31.5], // Gaza
  [34.0, 31.3],
  [33.2, 31.1],
  [32.35, 31.25], // Port Said
  [32.4, 30.6],
  [32.55, 29.97], // Sues
];

/** Sinai und die Westküste Arabiens: Sues → Dschidda → Aden. */
const ARABIEN_WEST = [
  [32.55, 29.97],
  [33.2, 28.5],
  [33.6, 27.9],
  [34.25, 27.72], // Ras Muhammad
  [34.6, 28.5],
  [34.85, 29.3],
  [35.0, 29.55], // Akaba
  [35.2, 28.5],
  [36.0, 27.5],
  [36.8, 25.6],
  [38.05, 24.09], // Yanbu
  [37.9, 23.0],
  [39.15, 21.5], // Dschidda
  [39.9, 20.0],
  [40.5, 19.0],
  [41.5, 17.5],
  [42.55, 16.9], // Dschasan
  [42.8, 15.5],
  [43.2, 14.0],
  [43.3, 12.8], // Bab al-Mandab
  [44.0, 12.8],
  [45.03, 12.78], // Aden
];

/** Die Südküste Arabiens: Aden → Maskat → Straße von Hormus. */
const ARABIEN_SUED = [
  [45.03, 12.78],
  [46.5, 13.5],
  [48.0, 14.0],
  [49.1, 14.5], // Mukalla
  [51.0, 15.0],
  [52.2, 15.6],
  [53.1, 16.6],
  [54.0, 17.0], // Salala
  [55.0, 17.8],
  [56.5, 18.8],
  [58.6, 20.7],
  [59.8, 22.52], // Ras al-Hadd
  [58.6, 23.6], // Maskat
  [57.2, 24.3],
  [56.4, 25.6],
  [56.4, 26.4], // Ras Musandam
];

/** Von Hormus bis zur Südspitze Indiens; der Persische Golf liegt im Ring. */
const MAKRAN_INDIEN_WEST = [
  [56.2, 27.15], // Bandar Abbas
  [57.8, 26.5],
  [59.0, 25.4],
  [60.6, 25.3],
  [61.6, 25.2],
  [62.3, 25.2],
  [64.0, 25.3],
  [66.0, 25.2],
  [67.0, 24.85], // Karatschi
  [68.0, 23.8], // das Indusdelta
  [69.1, 22.47], // Okha
  [69.6, 21.63], // Porbandar
  [70.98, 20.71], // Diu
  [72.0, 21.0],
  [72.8, 21.17], // Surat
  [72.83, 18.94], // Mumbai
  [73.3, 17.0],
  [73.8, 15.5], // Goa
  [74.8, 13.3], // Mangalore
  [75.8, 11.25], // Kozhikode
  [76.3, 9.97], // Kochi
  [77.5, 8.08], // Kap Komorin
];

/** Die Ostküste Indiens und Birmas: Kap Komorin → Kalkutta → Rangun. */
const INDIEN_OST = [
  [77.5, 8.08],
  [78.2, 8.8],
  [79.1, 9.3], // Rameswaram
  [79.5, 10.3],
  [79.85, 11.4],
  [80.27, 13.08], // Chennai
  [80.2, 14.5],
  [80.9, 15.7],
  [82.3, 16.6],
  [83.3, 17.7], // Visakhapatnam
  [84.8, 19.1],
  [86.0, 20.3],
  [87.0, 21.5],
  [88.1, 21.7], // die Sundarbans
  [89.5, 21.8],
  [90.6, 22.3],
  [91.4, 22.2],
  [91.8, 22.35], // Chittagong
  [92.3, 21.5],
  [93.0, 20.5],
  [94.0, 19.0],
  [94.2, 18.0],
  [94.5, 17.0],
  [95.0, 16.0], // das Irawadidelta
  [96.2, 16.8], // Rangun
  [97.0, 16.5],
  [97.6, 15.5],
];

// ---------------------------------------------------------------------------
// Südostasien — die Küste von Birma um die Malaiische Halbinsel bis Tonkin
// ---------------------------------------------------------------------------

const KUESTE_INDOCHINA = [
  [97.6, 15.5],
  [98.0, 14.0],
  [98.5, 12.2], // Mergui
  [98.6, 10.5],
  [98.4, 9.0],
  [98.3, 8.0], // Phuket
  [99.6, 6.6],
  [100.35, 5.42], // Penang
  [100.6, 3.9],
  [101.4, 2.9],
  [102.2, 2.2], // die Straße von Malakka
  [103.4, 1.45],
  [103.85, 1.29], // Singapur
  [104.2, 1.4],
  [103.6, 2.5],
  [103.4, 3.7],
  [103.3, 4.9],
  [102.3, 6.1], // Kota Bharu
  [101.2, 6.3],
  [100.3, 7.2],
  [100.1, 8.4],
  [99.5, 9.6],
  [99.9, 11.0],
  [100.0, 12.6],
  [100.5, 13.5], // der Grund des Golfs von Siam, bei Bangkok
  [101.3, 12.6],
  [102.5, 12.2],
  [103.5, 10.6], // Sihanoukville
  [104.5, 10.4],
  [104.9, 9.6],
  [105.1, 8.7], // Kap Cà Mau, die Südspitze Vietnams
  [106.7, 10.5], // das Mekongdelta
  [108.0, 11.0],
  [109.2, 11.9],
  [109.4, 12.9],
  [109.3, 14.0],
  [108.9, 15.1],
  [108.2, 16.1], // Đà Nẵng
  [107.1, 17.0],
  [106.5, 17.9],
  [105.9, 18.3],
  [105.8, 19.8],
  [106.5, 20.3], // das Delta des Roten Flusses
  [106.9, 20.8],
  [107.6, 21.1],
  [108.05, 21.55], // die Grenze zu China am Golf von Tonkin
];

// ---------------------------------------------------------------------------
// China, Korea und der Nordosten — dieselben Atlas-Küsten wie in
// karten/usa-weltmacht.js und karten/japan.js
// ---------------------------------------------------------------------------

const KUESTE_SUEDCHINA = [
  [108.05, 21.55],
  [108.5, 21.6],
  [109.2, 21.4],
  [110.4, 21.2], // Zhanjiang
  [110.4, 20.4], // die Südspitze der Halbinsel Leizhou
  [111.0, 21.5],
  [111.8, 21.6],
  [113.2, 22.0],
  [113.55, 22.19], // Macau
  [113.6, 23.0], // die Bucht vor Guangzhou
  [114.17, 22.3], // Hongkong
  [114.9, 22.6],
  [116.7, 23.35], // Shantou
  [117.6, 23.9],
  [118.1, 24.5], // Xiamen
  [118.6, 24.9],
  [119.5, 25.5],
];

const KUESTE_CHINA = [
  [119.5, 25.5],
  [119.7, 26.1], // Fuzhou
  [120.4, 27.1], // Wenzhou
  [121.2, 28.3],
  [121.6, 29.1],
  [121.9, 29.9], // Ningbo
  [121.2, 30.2],
  [120.5, 30.4], // die Bucht von Hangzhou
  [121.2, 30.9],
  [121.9, 31.4], // die Mündung des Jangtse — hier liegt Schanghai
  [121.4, 32.2],
  [120.9, 33.0],
  [120.4, 34.0],
  [119.8, 34.8],
  [119.4, 35.5],
  [119.9, 35.8],
  [120.4, 36.1], // Qingdao
  [121.4, 36.6],
  [122.7, 37.4], // die Ostspitze der Halbinsel Shandong
  [122.0, 37.5],
  [121.2, 37.6], // Yantai
  [120.3, 37.8], // Penglai
  [119.2, 37.3],
  [118.9, 37.9], // die Mündung des Gelben Flusses
  [117.7, 38.9], // die Bucht von Bohai, bei Tianjin
  [119.6, 39.9], // Shanhaiguan
  [121.2, 40.8],
  [122.1, 40.9],
  [121.9, 40.0],
  [121.3, 39.2],
  [121.6, 38.9], // Dalian
  [122.6, 39.4],
  [123.6, 39.8],
  [124.4, 40.0], // die Mündung des Yalu
];

const KOREA = [
  [124.4, 40.0],
  [125.4, 39.6],
  [125.1, 38.8],
  [126.0, 38.3],
  [126.6, 37.5], // Incheon
  [126.4, 36.7],
  [126.6, 36.0],
  [126.4, 35.2],
  [126.3, 34.4], // Mokpo
  [127.5, 34.4],
  [128.5, 34.8],
  [129.1, 35.1], // Busan
  [129.4, 35.9],
  [129.3, 36.8],
  [129.0, 37.6],
  [128.4, 38.4],
  [127.5, 39.3], // Wonsan
  [128.3, 40.0],
  [129.4, 40.8],
  [129.9, 41.8],
  [130.6, 42.3], // die Mündung des Tumen
];

/** Die Nordgrenze Koreas — Yalu und Tumen, dazwischen der Paektu. */
const KOREA_NORDGRENZE = [
  [130.6, 42.3],
  [129.3, 41.9],
  [128.1, 42.0],
  [126.8, 41.6],
  [125.6, 40.8],
  [124.4, 40.0],
];

/** Die Küste nördlich des Tumen: Wladiwostok → Amurmündung. */
const KUESTE_NORDOST = [
  [130.6, 42.3],
  [131.9, 43.1], // Wladiwostok
  [133.2, 42.8],
  [134.8, 43.5],
  [136.5, 44.5],
  [137.7, 45.8],
  [139.0, 47.2],
  [140.3, 49.0],
  [140.8, 50.5],
  [141.2, 51.5],
  [141.4, 52.5],
  [141.0, 53.2], // Nikolajewsk an der Mündung des Amur
];

// ---------------------------------------------------------------------------
// Inseln
// ---------------------------------------------------------------------------

const BRITANNIEN = [
  [-5.7, 50.07], // Land's End
  [-3.5, 50.6],
  [-1.9, 50.7],
  [-0.8, 50.75],
  [0.5, 50.9],
  [1.4, 51.4], // die Themsemündung
  [0.7, 52.7],
  [0.3, 53.6],
  [-0.2, 54.1],
  [-1.4, 54.7],
  [-1.6, 55.6],
  [-2.5, 56.2], // der Firth of Forth
  [-3.0, 56.5],
  [-2.1, 57.6], // Aberdeen
  [-3.0, 58.6], // John o' Groats, über dem oberen Bildrand
  [-5.0, 58.6],
  [-5.6, 57.9],
  [-5.8, 57.0],
  [-5.5, 56.0],
  [-5.3, 55.4],
  [-4.8, 54.7],
  [-3.5, 54.5],
  [-3.0, 53.5],
  [-4.2, 53.35], // Wales
  [-5.2, 51.9],
  [-4.2, 51.5],
  [-3.0, 51.3],
  [-4.2, 50.3],
];

const IRLAND = [
  [-6.0, 52.15],
  [-6.2, 53.35], // Dublin
  [-6.0, 54.0],
  [-5.5, 54.7], // Belfast
  [-7.0, 55.2],
  [-8.5, 55.2],
  [-10.0, 54.3],
  [-9.6, 53.4],
  [-9.9, 52.5],
  [-10.4, 51.8],
  [-9.0, 51.5],
  [-8.3, 51.7], // Cork
  [-7.0, 52.0],
];

/** Südskandinavien — der Rest liegt über dem oberen Bildrand. */
const SKANDINAVIEN = [
  [10.0, 59.5],
  [11.4, 58.9],
  [11.9, 57.7], // Göteborg
  [12.6, 56.3],
  [13.0, 55.6], // Malmö
  [14.3, 55.4],
  [15.6, 56.1],
  [16.4, 56.7], // Kalmar
  [17.0, 58.0],
  [18.3, 59.0],
  [19.0, 60.0],
  [10.0, 60.0],
];

const SIZILIEN = [
  [12.4, 37.8],
  [13.3, 38.2],
  [15.2, 38.25],
  [15.65, 38.0],
  [15.1, 36.7],
  [14.5, 36.7],
  [12.65, 37.55],
];

const SARDINIEN = [
  [9.2, 41.25],
  [9.55, 40.9],
  [9.7, 40.5],
  [9.6, 39.15],
  [8.9, 38.9],
  [8.4, 39.2],
  [8.4, 40.0],
  [8.2, 40.6],
  [8.6, 41.1],
];

const KORSIKA = [
  [9.35, 42.7],
  [9.55, 42.2],
  [9.4, 41.7],
  [8.8, 41.4],
  [8.6, 42.0],
  [8.7, 42.6],
  [9.0, 43.0],
];

const KRETA = [
  [23.6, 35.55],
  [24.7, 35.6],
  [26.3, 35.3],
  [25.7, 35.0],
  [24.5, 35.0],
  [23.55, 35.2],
];

const ZYPERN = [
  [32.3, 35.1],
  [33.9, 35.4],
  [34.6, 35.7],
  [34.0, 34.9],
  [33.0, 34.6],
  [32.3, 34.75],
];

/** Sri Lanka — bis 1972 Ceylon. */
const SRI_LANKA = [
  [79.9, 9.8],
  [80.9, 9.3],
  [81.8, 8.5],
  [81.9, 7.0],
  [81.6, 6.4],
  [80.6, 5.95],
  [79.9, 6.8],
  [79.8, 8.5],
];

const HONSHU = [
  [130.95, 34.0], // Shimonoseki
  [131.4, 34.4],
  [131.9, 34.7],
  [132.7, 35.4], // Izumo
  [133.5, 35.6],
  [134.2, 35.55], // Tottori
  [135.1, 35.7],
  [135.4, 35.5],
  [136.1, 35.65], // Tsuruga
  [136.0, 36.1],
  [136.6, 36.6], // Kanazawa
  [137.3, 37.5], // die Spitze der Halbinsel Noto
  [136.9, 37.1],
  [137.25, 36.75],
  [138.25, 37.15],
  [139.05, 37.9], // Niigata
  [139.4, 38.4],
  [139.55, 38.85],
  [139.9, 39.4],
  [139.7, 39.9],
  [140.05, 39.75], // Akita
  [140.1, 40.75],
  [140.35, 41.25], // Kap Tappi
  [140.8, 40.85],
  [140.9, 41.55], // Kap Oma
  [141.4, 41.4],
  [141.55, 40.5], // Hachinohe
  [141.9, 39.9],
  [142.05, 39.55], // Kap Todo
  [141.85, 39.0],
  [141.05, 38.25], // Sendai
  [140.95, 37.8],
  [141.0, 37.0],
  [140.6, 36.4],
  [140.87, 35.72], // Kap Inubo
  [140.3, 35.35],
  [139.9, 34.9], // Kap Nojima
  [139.85, 35.65], // der Grund der Bucht von Tokio
  [139.7, 35.15], // die Halbinsel Miura
  [138.85, 34.6], // Kap Irozaki
  [138.5, 34.7],
  [138.2, 34.6],
  [136.95, 34.65], // die Bucht von Ise
  [136.85, 34.3],
  [136.0, 33.6],
  [135.76, 33.45], // Kap Shionomisaki
  [135.2, 33.9],
  [135.4, 34.65], // die Bucht von Osaka
  [134.6, 34.75],
  [133.9, 34.5], // Okayama
  [132.5, 34.35], // Hiroshima
  [132.0, 34.1],
  [131.4, 33.95],
];

const KYUSHU = [
  [130.9, 33.9],
  [131.65, 33.7],
  [131.9, 33.3],
  [131.9, 32.9],
  [132.0, 32.75],
  [131.75, 32.5],
  [131.45, 31.75], // Miyazaki
  [131.35, 31.35],
  [130.85, 31.15],
  [130.67, 31.0], // Kap Sata
  [130.6, 31.35],
  [130.25, 31.25],
  [130.15, 31.6],
  [130.35, 32.0],
  [130.1, 32.25],
  [130.25, 32.6],
  [129.87, 32.75], // Nagasaki
  [129.65, 33.05],
  [129.75, 33.35], // Sasebo
  [130.0, 33.5],
  [130.4, 33.6], // die Bucht von Hakata
  [130.65, 33.85],
];

const SHIKOKU = [
  [134.05, 34.35],
  [134.6, 34.2],
  [134.75, 33.85],
  [134.18, 33.25], // Kap Muroto
  [133.7, 33.5],
  [133.02, 32.72], // Kap Ashizuri
  [132.5, 33.3],
  [132.0, 33.35],
  [132.5, 33.7],
  [132.75, 33.85], // Matsuyama
  [133.4, 34.2],
];

const HOKKAIDO = [
  [140.2, 41.4],
  [140.75, 41.8], // Hakodate
  [141.5, 42.3],
  [142.5, 42.3],
  [143.25, 41.93], // Kap Erimo
  [144.4, 42.95], // Kushiro
  [145.8, 43.4], // Kap Nosappu — schon rechts außerhalb des Bildrands
  [145.3, 44.35],
  [144.3, 44.0],
  [142.5, 44.8],
  [141.94, 45.52], // Kap Sōya
  [141.6, 45.2],
  [141.3, 43.6],
  [140.35, 43.33],
  [140.0, 42.6],
  [140.1, 41.75],
];

const TAIWAN = [
  [120.1, 23.1], // Tainan
  [120.15, 22.6],
  [120.8, 21.93], // Kap Eluanbi
  [121.4, 22.6],
  [121.6, 23.6],
  [121.9, 24.6],
  [121.8, 25.15], // Keelung
  [121.0, 25.1], // Tamsui
  [120.5, 24.5],
  [120.2, 23.8],
];

const HAINAN = [
  [110.6, 20.1],
  [111.0, 19.6],
  [109.5, 18.3],
  [108.7, 19.3],
  [109.3, 19.9],
];

const OKINAWA = [
  [127.65, 26.08],
  [127.9, 26.2],
  [128.3, 26.7],
  [128.0, 26.78],
  [127.75, 26.4],
  [127.6, 26.2],
];

const LUZON = [
  [120.6, 18.5],
  [121.6, 18.4],
  [122.3, 18.3],
  [122.5, 17.0],
  [122.1, 16.0],
  [121.7, 15.0],
  [122.0, 14.2],
  [123.4, 13.6],
  [124.1, 12.6],
  [123.4, 13.1],
  [122.9, 13.9],
  [122.0, 13.7],
  [121.3, 13.75],
  [120.6, 14.4], // die Einfahrt in die Bucht von Manila
  [120.5, 14.9],
  [119.9, 16.0],
  [119.8, 16.4],
  [120.3, 17.5],
  [120.4, 18.2],
];

const MINDANAO = [
  [124.0, 9.8],
  [125.6, 9.4],
  [126.4, 8.6],
  [126.2, 7.2],
  [125.7, 5.6],
  [124.6, 6.4],
  [123.9, 7.4],
  [122.08, 6.9], // Zamboanga
  [122.5, 7.9],
  [123.6, 8.2],
  [123.9, 8.9],
];

const PALAWAN = [
  [117.2, 8.4],
  [118.5, 9.4],
  [119.5, 11.1],
  [119.1, 11.05],
  [118.2, 10.0],
  [117.05, 8.6],
];

const NEGROS = [
  [122.5, 9.3],
  [123.3, 9.9],
  [123.4, 10.8],
  [122.9, 10.5],
  [122.6, 9.9],
];

const SAMAR = [
  [124.9, 11.6],
  [125.6, 11.2],
  [125.8, 12.0],
  [125.4, 12.5],
  [124.9, 12.2],
  [124.4, 11.9],
];

/** Sumatra — die Nordwestecke des indonesischen Archipels. */
const SUMATRA = [
  [95.3, 5.6], // Banda Aceh
  [96.4, 5.2],
  [97.5, 5.1],
  [98.7, 4.1], // Medan
  [100.4, 3.0],
  [101.5, 2.2],
  [102.6, 1.5],
  [103.5, 1.0],
  [104.4, 0.9],
  [104.4, -0.5],
  [105.0, -1.9],
  [105.9, -3.4],
  [105.9, -5.6], // die Sundastraße
  [104.6, -5.7],
  [103.5, -4.9],
  [102.3, -3.8],
  [101.4, -2.7],
  [100.4, -1.4],
  [99.5, 0.0],
  [98.5, 1.6],
  [97.3, 3.3],
  [95.9, 4.6],
];

const JAVA = [
  [105.2, -6.8],
  [106.8, -6.1], // Jakarta
  [108.5, -6.3],
  [110.4, -6.4],
  [112.7, -6.9],
  [114.4, -8.2],
  [113.0, -8.3],
  [110.0, -8.1],
  [107.7, -7.7],
  [106.5, -7.4],
];

const BORNEO = [
  [109.0, 1.9],
  [110.5, 1.4],
  [112.0, 3.0],
  [113.9, 4.5],
  [115.3, 5.0],
  [116.1, 6.0], // Kota Kinabalu
  [117.6, 6.9],
  [118.6, 6.1], // Sandakan
  [119.0, 5.0],
  [118.0, 4.2],
  [117.5, 3.2],
  [117.5, 1.0],
  [116.5, -1.2],
  [116.3, -3.5],
  [114.6, -3.9],
  [113.0, -3.3],
  [111.0, -3.0],
  [110.0, -1.8],
  [109.3, -0.5],
  [108.9, 0.8],
];

const SULAWESI = [
  [119.4, -5.2],
  [120.4, -5.6],
  [120.6, -4.3],
  [121.7, -4.7],
  [123.2, -4.6],
  [122.3, -3.5],
  [121.0, -2.5],
  [123.0, -1.0],
  [124.9, -1.7],
  [125.2, -1.3],
  [123.5, 0.5],
  [121.5, 1.0],
  [120.0, 0.5],
  [120.2, -1.5],
];

/** Der Westteil Neuguineas — der Rest liegt rechts außerhalb des Bildes. */
const NEUGUINEA_WEST = [
  [131.0, -0.8],
  [132.6, -0.5],
  [134.0, -1.0],
  [135.5, -1.6],
  [137.5, -2.2],
  [140.0, -2.6],
  [142.5, -3.3],
  [144.5, -4.3],
  [145.5, -5.6],
  [144.0, -6.5],
  [141.0, -8.2],
  [138.5, -8.4],
  [137.0, -6.5],
  [135.0, -4.5],
  [133.5, -4.1],
  [132.2, -2.9],
  [131.3, -2.5],
  [132.1, -1.6],
];

// ---------------------------------------------------------------------------
// Afrika — nur so weit, wie der Ausschnitt reicht
// ---------------------------------------------------------------------------

const NORDAFRIKA = [
  [-5.8, 35.79], // Tanger
  [-4.3, 35.17],
  [-3.0, 35.25],
  [-1.9, 35.1],
  [-0.63, 35.72], // Oran
  [0.14, 35.9],
  [1.3, 36.5],
  [3.06, 36.77], // Algier
  [5.08, 36.75], // Bejaia
  [6.6, 37.05],
  [7.77, 36.9], // Annaba
  [9.87, 37.28], // Bizerta
  [10.3, 37.0], // Tunis
  [11.05, 37.08], // Kap Bon
  [10.55, 35.75], // Sousse
  [11.1, 35.2],
  [10.76, 34.73], // Sfax
  [10.1, 33.88], // Gabès
  [11.5, 33.2],
  [13.19, 32.9], // Tripolis
  [15.1, 32.4], // Misrata
  [15.3, 31.6],
  [18.0, 30.75], // die Große Syrte
  [19.9, 31.0],
  [20.07, 32.12], // Bengasi
  [21.8, 32.9],
  [23.98, 32.08], // Tobruk
  [25.15, 31.55],
  [27.24, 31.35], // Marsa Matruh
  [29.92, 31.2], // Alexandria
  [31.8, 31.42], // Damiette
  [32.3, 31.25], // Port Said
  [32.4, 30.6],
  [32.55, 29.97], // Sues
];

const ROTES_MEER_WEST = [
  [32.55, 29.97],
  [33.8, 27.25], // Hurghada
  [34.28, 26.1],
  [35.48, 23.95],
  [36.3, 22.5],
  [37.22, 19.6], // Port Sudan
  [38.6, 17.2],
  [39.45, 15.6], // Massaua
  [40.9, 14.3],
  [42.73, 13.0], // Assab
  [43.3, 11.9], // Bab al-Mandab
  [43.15, 11.6], // Dschibuti
];

const OSTAFRIKA = [
  [43.15, 11.6],
  [45.02, 10.44], // Berbera
  [48.5, 11.3],
  [51.27, 11.83], // Kap Guardafui
  [51.4, 10.44],
  [50.0, 7.5],
  [47.0, 4.0],
  [45.34, 2.04], // Mogadischu
  [42.55, -0.36], // Kismayo
  [40.9, -2.27], // Lamu
  [39.67, -4.05], // Mombasa
  [39.1, -5.07], // Tanga
  [39.28, -6.82], // Daressalam
  [39.5, -8.93], // Kilwa
  [40.4, -10.3],
  [40.6, -10.68], // Kap Delgado, schon unter dem Bildrand
];

const WESTAFRIKA = [
  [13.0, -10.0], // die angolanische Küste, unter dem Bildrand
  [13.23, -8.81], // Luanda
  [12.35, -6.0], // die Kongomündung
  [11.85, -4.78], // Pointe-Noire
  [9.9, -2.5],
  [8.78, -0.72], // Kap Lopez
  [9.45, 0.39], // Libreville
  [9.77, 1.86],
  [9.7, 4.05], // Duala
  [8.32, 4.75], // Calabar
  [6.5, 4.3], // das Nigerdelta
  [4.5, 6.2],
  [3.4, 6.45], // Lagos
  [1.22, 6.13], // Lomé
  [-0.2, 5.55], // Accra
  [-2.1, 4.75], // Kap Three Points
  [-4.02, 5.31], // Abidjan
  [-7.72, 4.37], // Kap Palmas
  [-9.0, 5.2],
  [-10.8, 6.31], // Monrovia — links außerhalb des Bildrands
  [-11.0, 8.0],
  [-11.0, 20.0],
  [-11.0, 30.0],
  [-9.6, 30.42], // Agadir
  [-7.6, 33.6], // Casablanca
  [-6.83, 34.02], // Rabat
  [-5.8, 35.79],
];

// ---------------------------------------------------------------------------
// Binnenmeere und Seen
// ---------------------------------------------------------------------------

const SCHWARZES_MEER = [
  [29.0, 41.2],
  [31.0, 41.3],
  [34.0, 41.9],
  [36.2, 41.4],
  [38.4, 41.3],
  [41.02, 42.99],
  [39.5, 44.0],
  [37.5, 44.9],
  [36.5, 45.3],
  [35.0, 44.4],
  [33.5, 44.4],
  [31.5, 46.2],
  [30.6, 46.4],
  [29.7, 45.2],
  [28.7, 44.0],
  [28.0, 43.4],
  [27.5, 42.1],
  [28.5, 41.4],
];

const KASPISCHES_MEER = [
  [49.0, 45.2],
  [51.2, 44.6],
  [51.3, 43.5],
  [52.5, 42.7],
  [53.9, 42.2],
  [53.0, 41.0],
  [54.0, 40.0],
  [53.5, 38.5],
  [52.5, 37.2],
  [50.0, 36.8],
  [48.6, 37.5],
  [49.5, 39.0],
  [49.0, 40.5],
  [47.6, 41.3],
  [47.5, 42.9],
  [47.9, 44.2],
  [47.5, 45.7],
];

const ARALSEE = [
  [58.4, 45.0],
  [59.6, 45.3],
  [61.2, 44.6],
  [61.0, 43.8],
  [59.5, 43.6],
  [58.3, 44.2],
];

const PERSISCHER_GOLF = [
  [48.0, 30.0],
  [50.0, 29.0],
  [51.5, 27.8],
  [53.5, 26.8],
  [55.5, 26.3],
  [56.3, 26.6],
  [55.0, 25.0],
  [52.5, 24.0],
  [50.8, 24.7],
  [50.6, 26.2],
  [49.0, 27.7],
  [48.2, 29.2],
];

const BALCHASCH = [
  [73.5, 45.3],
  [75.5, 46.2],
  [78.0, 46.5],
  [79.3, 46.6],
  [78.5, 45.9],
  [76.0, 45.6],
  [74.0, 44.9],
];

const BAIKAL = [
  [103.8, 51.6],
  [105.5, 52.5],
  [107.5, 53.5],
  [109.5, 54.5],
  [109.9, 55.4],
  [109.2, 55.4],
  [107.5, 54.0],
  [105.0, 52.6],
  [103.5, 51.8],
];

const VICTORIASEE = [
  [31.8, -0.4],
  [33.0, 0.4],
  [34.0, 0.1],
  [34.2, -1.2],
  [33.2, -2.4],
  [32.0, -2.2],
  [31.7, -1.2],
];

// ---------------------------------------------------------------------------
// Flüsse
// ---------------------------------------------------------------------------

const RHEIN = [
  [8.6, 47.6],
  [7.6, 48.6],
  [8.3, 49.0],
  [8.4, 50.0],
  [7.6, 50.4],
  [6.9, 51.2],
  [6.1, 51.85],
  [4.5, 51.92],
];

const DONAU = [
  [8.2, 48.0],
  [10.9, 48.7],
  [13.4, 48.6],
  [16.4, 48.1],
  [19.0, 47.5],
  [21.0, 46.2],
  [22.9, 44.7],
  [25.4, 43.7],
  [28.0, 44.9],
  [29.7, 45.2],
];

const WOLGA = [
  [37.0, 56.9],
  [40.0, 56.3],
  [43.9, 56.3],
  [47.2, 55.5],
  [49.1, 55.8],
  [49.5, 53.5],
  [47.5, 51.5],
  [45.0, 48.7],
  [47.0, 46.3],
];

const NIL = [
  [30.9, 31.5],
  [31.2, 30.05],
  [31.3, 27.5],
  [32.6, 25.7],
  [32.9, 24.1],
  [33.9, 21.0],
  [33.0, 18.5],
  [32.55, 15.6],
  [32.0, 12.5],
];

const EUPHRAT_TIGRIS = [
  [38.7, 37.0],
  [40.1, 36.0],
  [42.4, 34.4],
  [44.4, 32.5],
  [46.1, 31.0],
  [47.8, 30.4],
  [48.5, 30.0],
];

const INDUS = [
  [74.5, 34.5],
  [72.5, 33.0],
  [71.5, 31.5],
  [70.9, 29.5],
  [69.5, 27.5],
  [68.3, 25.4],
  [67.4, 24.0],
];

const GANGES = [
  [78.2, 30.0],
  [80.0, 28.9],
  [82.0, 25.9],
  [84.5, 25.4],
  [86.5, 25.2],
  [87.9, 24.6],
  [88.5, 23.5],
  [89.5, 22.5],
  [90.6, 22.3],
];

const MEKONG = [
  [98.5, 26.0],
  [100.2, 22.5],
  [101.2, 21.2],
  [102.6, 17.9],
  [104.8, 16.5],
  [105.8, 15.3],
  [105.9, 13.5],
  [105.5, 12.0],
  [105.8, 10.9],
  [106.7, 10.5],
];

const JANGTSE = [
  [98.0, 32.5],
  [101.0, 29.0],
  [104.0, 28.8],
  [106.5, 29.6],
  [108.4, 30.8],
  [111.3, 30.7],
  [114.3, 30.6],
  [117.3, 31.2],
  [119.4, 32.0],
  [121.9, 31.4],
];

const GELBER_FLUSS = [
  [96.5, 34.5],
  [100.5, 34.5],
  [103.8, 36.1],
  [106.6, 37.5],
  [107.5, 39.6],
  [110.5, 40.5],
  [110.9, 37.6],
  [110.4, 35.0],
  [112.5, 34.8],
  [114.5, 34.9],
  [116.5, 36.0],
  [118.9, 37.9],
];

// ---------------------------------------------------------------------------
// Wüsten — eine Spur tiefer als das Land
// ---------------------------------------------------------------------------

const SAHARA = [
  [-5.0, 27.0],
  [0.0, 25.0],
  [8.0, 24.0],
  [16.0, 23.5],
  [24.0, 24.0],
  [30.0, 25.0],
  [31.0, 22.0],
  [24.0, 18.0],
  [16.0, 17.0],
  [6.0, 16.5],
  [-2.0, 17.5],
  [-8.0, 21.0],
  [-7.0, 25.0],
];

const ARABISCHE_WUESTE = [
  [38.0, 29.0],
  [44.0, 29.5],
  [48.0, 26.0],
  [52.0, 23.0],
  [55.0, 21.0],
  [50.0, 18.5],
  [45.0, 17.5],
  [41.0, 20.0],
  [38.5, 24.0],
];

const THAR = [
  [69.5, 28.5],
  [72.5, 29.0],
  [74.5, 27.5],
  [73.5, 25.0],
  [71.0, 24.5],
  [69.5, 26.0],
];

const TAKLAMAKAN = [
  [77.0, 39.5],
  [82.0, 41.0],
  [87.0, 41.5],
  [89.5, 40.5],
  [86.0, 38.5],
  [81.0, 37.5],
  [77.5, 38.3],
];

const GOBI = [
  [95.0, 43.0],
  [101.0, 44.5],
  [106.0, 45.0],
  [111.0, 44.5],
  [113.0, 43.0],
  [108.0, 41.5],
  [102.0, 41.0],
  [96.0, 41.5],
];

// ---------------------------------------------------------------------------
// Die Landmassen
// ---------------------------------------------------------------------------

/** Afrika, so weit der Ausschnitt reicht — der Rückweg läuft unter dem Rand. */
const AFRIKA = verbinde(
  NORDAFRIKA,
  ROTES_MEER_WEST,
  OSTAFRIKA,
  [
    [38.0, -12.0],
    [25.0, -12.0],
    [13.0, -12.0],
  ],
  WESTAFRIKA,
);

/**
 * Europa und Asien als ein Ring.
 *
 * Der Weg: Mittelmeernordküste → Arabien → Indien → Birma → Malaiische
 * Halbinsel → Vietnam → China → Korea → Amurmündung, dann über den oberen
 * Bildrand zurück nach Estland, die Ostsee- und Nordseeküste entlang und über
 * den Atlantik nach Tarifa. Alles oberhalb von 58° N ist außerhalb des Bildes
 * und deshalb frei gezogen — sichtbar wird davon nichts.
 */
const EURASIEN = verbinde(
  MITTELMEER_NORD,
  ARABIEN_WEST,
  ARABIEN_SUED,
  MAKRAN_INDIEN_WEST,
  INDIEN_OST,
  KUESTE_INDOCHINA,
  KUESTE_SUEDCHINA,
  KUESTE_CHINA,
  KOREA,
  KUESTE_NORDOST,
  [
    [142.0, 56.0],
    [143.0, 62.0],
    [60.0, 62.0],
    [27.5, 62.0],
    [27.0, 59.8],
  ],
  OSTSEE_NORDSEE,
  ATLANTIK_EUROPA,
);

// ---------------------------------------------------------------------------
// Politische Grenzen — angenähert (siehe Kopf der Datei, Festlegung 5)
// ---------------------------------------------------------------------------

/** Die innerdeutsche Grenze, von der Lübecker Bucht bis Mödlareuth. */
const INNERDEUTSCHE_GRENZE = [
  [10.87, 53.95],
  [10.55, 53.37], // die Elbe bei Lauenburg
  [11.55, 53.03],
  [11.0, 52.2], // Helmstedt und Marienborn
  [10.6, 51.85],
  [10.25, 51.5],
  [10.03, 50.83], // Vacha an der Werra
  [10.0, 50.4],
  [10.9, 50.3],
  [11.95, 50.35], // Mödlareuth
  [12.1, 50.32],
];

/** Die Westgrenze der Bundesrepublik: Emsmündung → Basel. */
const GRENZE_BRD_WEST = [
  [7.2, 53.6],
  [6.8, 52.2],
  [6.0, 51.8],
  [6.1, 50.8], // bei Aachen
  [6.15, 50.15],
  [6.37, 49.47],
  [6.9, 49.2],
  [7.6, 49.05],
  [8.23, 48.97], // Lauterbourg
  [7.8, 48.6], // der Rhein bei Straßburg
  [7.6, 47.6], // Basel
];

/** Die Südgrenze der Bundesrepublik: Basel → Passau. */
const GRENZE_BRD_SUED = [
  [7.6, 47.6],
  [8.6, 47.6],
  [9.5, 47.5], // der Bodensee
  [9.8, 47.55],
  [10.2, 47.4],
  [11.0, 47.4],
  [12.2, 47.7],
  [13.0, 47.8],
  [13.46, 48.57], // Passau
];

/** Die bayerisch-böhmische Grenze: Passau → Mödlareuth. */
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
  [14.4, 50.9],
  [14.8, 50.85],
  [15.0, 51.0], // das Dreiländereck an der Neiße
];

/** Die Oder-Neiße-Grenze: Zittau → Ostsee. */
const ODER_NEISSE_GRENZE = [
  [15.0, 51.0],
  [14.95, 51.35],
  [14.7, 52.0],
  [14.55, 52.35], // Frankfurt an der Oder
  [14.6, 52.75],
  [14.3, 53.35],
  [14.28, 53.93],
];

/** Der Pyrenäenkamm: Kap Creus → Bidassoa. */
const PYRENAEEN = [
  [3.28, 42.32],
  [1.9, 42.5],
  [0.6, 42.7],
  [-0.7, 42.9],
  [-1.78, 43.35],
];

/** Die französisch-schweizerische Grenze: Basel → Mont Blanc. */
const GRENZE_SCHWEIZ_FRANKREICH = [
  [7.6, 47.6],
  [7.0, 47.5],
  [6.45, 46.8],
  [5.95, 46.5],
  [6.0, 46.15], // bei Genf
  [6.8, 46.05],
  [7.0, 45.92], // der Mont Blanc
];

/** Die Alpengrenze Italiens: Mont Blanc → Triest. */
const GRENZE_ALPEN_ITALIEN = [
  [7.0, 45.92],
  [7.9, 45.95],
  [8.6, 46.1],
  [9.0, 46.2],
  [9.5, 46.3],
  [10.1, 46.4],
  [10.45, 46.62], // der Reschenpass
  [11.0, 46.9],
  [11.5, 47.0], // der Brenner
  [12.2, 46.9],
  [12.8, 46.6],
  [13.7, 46.5],
  [13.6, 46.2],
  [13.65, 45.7], // Triest
];

/** Die Waffenstillstandslinie von 1953 zwischen Nord- und Südkorea. */
const DEMARKATIONSLINIE_KOREA = [
  [128.4, 38.4],
  [127.9, 38.3],
  [127.0, 38.2],
  [126.68, 37.83],
];

/**
 * Die Landgrenzen der Volksrepublik China — angenähert, gegen den
 * Uhrzeigersinn vom Tumen bis zum Golf von Tonkin.
 *
 * Zwei Abschnitte sind umstritten und werden hier nur gezeichnet, nicht
 * entschieden (Festlegung 4 im Kopf): Aksai Chin im Westen und die
 * McMahon-Linie im Osten des Himalaja.
 */
const GRENZE_CHINA_NORD = [
  [130.6, 42.3],
  [131.3, 43.4],
  [133.1, 45.1], // der Ussuri
  [133.9, 46.4],
  [134.7, 47.7],
  [135.05, 48.45], // Chabarowsk, wo Ussuri und Amur zusammenkommen
  [133.0, 48.1],
  [130.6, 48.9],
  [128.5, 49.6],
  [127.5, 50.3],
  [126.6, 51.4],
  [125.0, 52.6],
  [123.5, 53.3],
  [121.5, 53.3],
  [120.7, 53.2], // die Mündung der Argun
  [119.5, 52.0],
  [117.9, 49.6], // Manzhouli
  [115.9, 47.9], // das Dreiländereck zu Russland und der Mongolei
  [113.6, 44.9],
  [111.9, 43.7], // Erenhot
  [110.0, 42.6],
  [105.0, 41.6],
  [100.0, 42.6],
  [96.5, 43.3],
  [93.0, 44.8],
  [90.9, 45.25],
  [88.0, 48.0],
  [87.75, 49.17], // das Dreiländereck im Altai
];

const GRENZE_CHINA_WEST = [
  [87.75, 49.17],
  [85.5, 47.0],
  [83.0, 47.2],
  [82.5, 45.3], // die Dsungarische Pforte
  [80.4, 44.2], // Khorgos
  [80.2, 42.8],
  [76.5, 42.9],
  [75.5, 40.5],
  [73.9, 39.5], // Irkeschtam
  [74.9, 37.4],
  [75.0, 36.9], // der Karakorum-Pass
  [78.0, 35.5], // Aksai Chin — der Verlauf ist zwischen Indien und China umstritten
  [79.5, 34.4],
  [78.9, 32.6],
  [79.2, 31.4],
  [81.0, 30.3], // die Nordwestecke Nepals
  [83.0, 29.3],
  [85.0, 28.3],
  [86.5, 28.1], // der Mount Everest
  [88.1, 27.9],
  [88.9, 28.1],
  [90.0, 28.1],
  [92.1, 28.0],
  [93.0, 28.6],
  [94.5, 29.3],
  [96.0, 29.0],
  [96.8, 28.5], // die McMahon-Linie — auch sie ist umstritten
  [97.4, 28.3],
];

const GRENZE_CHINA_SUED = [
  [97.4, 28.3],
  [98.4, 27.5],
  [98.7, 25.9],
  [97.6, 24.4],
  [98.9, 24.1],
  [99.4, 22.9],
  [101.15, 21.2], // das Dreiländereck zu Birma und Laos
  [101.8, 22.4],
  [102.14, 22.4], // das Dreiländereck zu Laos und Vietnam
  [103.3, 22.7],
  [104.8, 22.8],
  [106.7, 22.8],
  [107.0, 21.8],
  [108.05, 21.55],
];

/** Die Landgrenzen Indiens — angenähert, von der Küste im Westen im Uhrzeigersinn. */
const GRENZE_INDIEN_PAKISTAN = [
  [68.0, 23.8],
  [68.7, 24.3],
  [69.5, 25.7],
  [70.0, 26.5],
  [70.6, 27.7],
  [71.9, 28.0],
  [73.0, 29.9],
  [73.9, 31.0],
  [74.6, 32.5],
  [74.0, 33.5], // die Waffenstillstandslinie in Kaschmir
  [74.3, 34.6],
  [76.0, 34.9],
  [77.0, 35.4],
  [78.2, 34.8],
  [79.5, 34.4],
];

const GRENZE_INDIEN_HIMALAJA = [
  [79.5, 34.4],
  [78.9, 32.6],
  [79.2, 31.4],
  [81.0, 30.3],
  [80.1, 28.8], // die Westgrenze Nepals
  [80.5, 28.6],
  [82.0, 27.5],
  [84.0, 27.4],
  [85.0, 26.6],
  [87.0, 26.4],
  [88.1, 27.9], // die Ostgrenze Nepals
  [88.8, 28.1], // die Nordspitze Sikkims
  [88.9, 27.2],
  [89.7, 26.7], // die Westgrenze Bhutans
  [92.0, 26.9],
  [92.1, 28.0], // die Ostgrenze Bhutans
  [93.0, 28.6],
  [94.5, 29.3],
  [96.0, 29.0],
  [96.8, 28.5],
  [97.4, 28.3],
];

const GRENZE_INDIEN_BIRMA = [
  [97.4, 28.3],
  [96.2, 27.2],
  [95.1, 26.6],
  [94.2, 25.0],
  [93.2, 23.7],
  [92.9, 22.1],
];

/** Die Grenze um Bangladesch herum — Indien liegt im Westen, Norden und Osten. */
const GRENZE_BANGLADESCH = [
  [92.9, 22.1],
  [92.6, 22.2],
  [92.1, 23.7],
  [91.4, 24.1],
  [92.2, 25.1],
  [90.5, 26.05],
  [89.8, 26.2],
  [89.0, 26.0],
  [88.1, 25.2],
  [88.2, 24.5],
  [88.9, 23.5],
  [88.6, 22.0],
  [88.1, 21.7],
];

/** Die Westgrenze Vietnams: China → Laos → Kambodscha → Golf von Thailand. */
const GRENZE_VIETNAM = [
  [102.14, 22.4],
  [103.0, 21.4],
  [104.0, 20.9],
  [104.5, 19.6],
  [105.5, 18.5],
  [106.5, 17.5],
  [107.3, 16.0],
  [107.6, 14.7],
  [107.5, 13.5],
  [106.5, 12.4],
  [106.0, 11.8],
  [105.8, 11.0],
  [105.0, 10.9],
  [104.6, 10.5],
];

// ---------------------------------------------------------------------------
// Die Flächen: die Volkswirtschaften, von denen dieses Kapitel erzählt
// ---------------------------------------------------------------------------

/** Die Bundesrepublik in den Grenzen von 1949 bis 1990. */
const BUNDESREPUBLIK = verbinde(
  kueste(OSTSEE_NORDSEE, [7.2, 53.6], [8.65, 54.6]),
  [
    [8.9, 54.9],
    [9.43, 54.79],
  ],
  kueste(OSTSEE_NORDSEE, [9.43, 54.79], [11.0, 54.1]),
  INNERDEUTSCHE_GRENZE,
  rueckwaerts(GRENZE_BRD_OST),
  rueckwaerts(GRENZE_BRD_SUED),
  rueckwaerts(GRENZE_BRD_WEST),
);

/** Die DDR — bis zum 3. Oktober 1990. */
const DDR = verbinde(
  INNERDEUTSCHE_GRENZE,
  GRENZE_DDR_CSSR,
  ODER_NEISSE_GRENZE,
  kueste(OSTSEE_NORDSEE, [14.25, 53.92], [11.0, 54.1]),
);

/**
 * Die sechs Gründerstaaten der EWG von 1957 — Frankreich, die Benelux-Staaten,
 * Italien und die Bundesrepublik — als ein Ring.
 *
 * Der Weg umgeht die Schweiz und Österreich, die nicht dazugehören: von Basel
 * die Schweizer Westgrenze hinunter zum Mont Blanc, dann die Alpengrenze
 * Italiens entlang nach Triest, um den Stiefel herum und die französische
 * Mittelmeerküste zurück.
 */
const EWG_SECHS_1957 = verbinde(
  kueste(OSTSEE_NORDSEE, [1.85, 50.96], [8.65, 54.6]),
  [
    [8.9, 54.9],
    [9.43, 54.79],
  ],
  kueste(OSTSEE_NORDSEE, [9.43, 54.79], [11.0, 54.1]),
  INNERDEUTSCHE_GRENZE,
  rueckwaerts(GRENZE_BRD_OST),
  rueckwaerts(GRENZE_BRD_SUED),
  rueckwaerts(GRENZE_SCHWEIZ_FRANKREICH),
  GRENZE_ALPEN_ITALIEN,
  kueste(MITTELMEER_NORD, [13.65, 45.7], [3.28, 42.32]),
  PYRENAEEN,
  kueste(ATLANTIK_EUROPA, [-1.78, 43.35], [1.85, 50.96]),
);

/** Dieselben sechs Staaten, seit dem 3. Oktober 1990 mit dem vereinten Deutschland. */
const EWG_SECHS_MIT_OSTEN = verbinde(
  kueste(OSTSEE_NORDSEE, [1.85, 50.96], [8.65, 54.6]),
  [
    [8.9, 54.9],
    [9.43, 54.79],
  ],
  kueste(OSTSEE_NORDSEE, [9.43, 54.79], [14.25, 53.92]),
  rueckwaerts(ODER_NEISSE_GRENZE),
  rueckwaerts(GRENZE_DDR_CSSR),
  rueckwaerts(GRENZE_BRD_OST),
  rueckwaerts(GRENZE_BRD_SUED),
  rueckwaerts(GRENZE_SCHWEIZ_FRANKREICH),
  GRENZE_ALPEN_ITALIEN,
  kueste(MITTELMEER_NORD, [13.65, 45.7], [3.28, 42.32]),
  PYRENAEEN,
  kueste(ATLANTIK_EUROPA, [-1.78, 43.35], [1.85, 50.96]),
);

/** Die Republik Korea — südlich der Waffenstillstandslinie von 1953. */
const SUEDKOREA = verbinde(
  kueste(KOREA, [126.6, 37.5], [128.4, 38.4]),
  DEMARKATIONSLINIE_KOREA,
);

/** Die Volksrepublik China — Küste und Landgrenzen. */
const CHINA = verbinde(
  KUESTE_SUEDCHINA,
  KUESTE_CHINA,
  rueckwaerts(KOREA_NORDGRENZE),
  GRENZE_CHINA_NORD,
  GRENZE_CHINA_WEST,
  GRENZE_CHINA_SUED,
);

/** Indien — Küste und Landgrenzen, Bangladesch und Nepal ausgespart. */
const INDIEN = verbinde(
  kueste(MAKRAN_INDIEN_WEST, [68.0, 23.8], [77.5, 8.08]),
  kueste(INDIEN_OST, [77.5, 8.08], [88.1, 21.7]),
  rueckwaerts(GRENZE_BANGLADESCH),
  rueckwaerts(GRENZE_INDIEN_BIRMA),
  rueckwaerts(GRENZE_INDIEN_HIMALAJA),
  rueckwaerts(GRENZE_INDIEN_PAKISTAN),
);

/** Vietnam — die Küste von Hà Tiên bis Móng Cái und die Grenze zurück. */
const VIETNAM = verbinde(
  kueste(KUESTE_INDOCHINA, [104.6, 10.5], [108.05, 21.55]),
  [[107.0, 21.8], [106.7, 22.8], [104.8, 22.8], [103.3, 22.7], [102.14, 22.4]],
  GRENZE_VIETNAM,
);

/**
 * Hongkong und Singapur — größer gezeichnet, als sie sind.
 *
 * Hongkong misst rund 1 100 Quadratkilometer, Singapur rund 730. Bei 4,5
 * SVG-Einheiten je Längengrad wären beide schmaler als ihre eigene Umrandung.
 * Die Lage stimmt, die Größe nicht (Festlegung 5 im Kopf).
 */
const HONGKONG = eiland(114.15, 22.35, 0.75);
const SINGAPUR = eiland(103.85, 1.32, 0.75);

// ---------------------------------------------------------------------------
// Zusammenbau: Untergrund, Phasen, Punkte, Bewegungen, Beschriftungen
// ---------------------------------------------------------------------------

const landmasse = (ring) => ({
  art: 'land',
  d: geo.pfad(ring),
  fill: KARTENFARBEN.land,
  stroke: KARTENFARBEN.landRand,
  strokeWidth: 1,
});

const wasser = (ring) => ({
  art: 'wasser',
  d: geo.pfad(ring),
  fill: KARTENFARBEN.meer,
  stroke: KARTENFARBEN.landRand,
  strokeWidth: 0.8,
});

const wueste = (ring) => ({
  art: 'wueste',
  d: geo.pfad(ring),
  fill: KARTENFARBEN.wueste,
  stroke: 'none',
  strokeWidth: 0,
});

const fluss = (linie) => ({
  art: 'fluss',
  d: geo.pfad(linie, { geschlossen: false }),
  fill: 'none',
  stroke: KARTENFARBEN.fluss,
  strokeWidth: 1.6,
});

const basis = [
  {
    art: 'grund',
    d: `M 0 0 H ${geo.breite} V ${geo.hoehe} H 0 Z`,
    fill: KARTENFARBEN.meer,
    stroke: 'none',
    strokeWidth: 0,
  },
  landmasse(EURASIEN),
  landmasse(AFRIKA),
  landmasse(BRITANNIEN),
  landmasse(IRLAND),
  landmasse(SKANDINAVIEN),
  landmasse(SIZILIEN),
  landmasse(SARDINIEN),
  landmasse(KORSIKA),
  landmasse(KRETA),
  landmasse(ZYPERN),
  landmasse(SRI_LANKA),
  landmasse(HONSHU),
  landmasse(KYUSHU),
  landmasse(SHIKOKU),
  landmasse(HOKKAIDO),
  landmasse(TAIWAN),
  landmasse(HAINAN),
  landmasse(OKINAWA),
  landmasse(LUZON),
  landmasse(MINDANAO),
  landmasse(PALAWAN),
  landmasse(NEGROS),
  landmasse(SAMAR),
  landmasse(SUMATRA),
  landmasse(JAVA),
  landmasse(BORNEO),
  landmasse(SULAWESI),
  landmasse(NEUGUINEA_WEST),
  wasser(SCHWARZES_MEER),
  wasser(KASPISCHES_MEER),
  wasser(ARALSEE),
  wasser(PERSISCHER_GOLF),
  wasser(BALCHASCH),
  wasser(BAIKAL),
  wasser(VICTORIASEE),
  wueste(SAHARA),
  wueste(ARABISCHE_WUESTE),
  wueste(THAR),
  wueste(TAKLAMAKAN),
  wueste(GOBI),
  fluss(RHEIN),
  fluss(DONAU),
  fluss(WOLGA),
  fluss(NIL),
  fluss(EUPHRAT_TIGRIS),
  fluss(INDUS),
  fluss(GANGES),
  fluss(MEKONG),
  fluss(JANGTSE),
  fluss(GELBER_FLUSS),
];

/** Baut aus mehreren Ringen einen Pfad — eine Fläche, viele Teile. */
const flaecheAus = (...ringe) => ringe.map((ring) => geo.pfad(ring)).join(' ');

const JAPAN_RINGE = [HONSHU, KYUSHU, SHIKOKU, HOKKAIDO, OKINAWA];
const CHINA_RINGE = [CHINA, HAINAN];

const phasen = [
  {
    id: 'wiederaufbau',
    label: '1955–1968 — Wiederaufbau und Wirtschaftswunder',
    hinweis:
      'Zehn Jahre nach dem Krieg wachsen Westeuropa und Japan schneller als je zuvor: die Bundesrepublik um rund 8 Prozent im Jahr, Japan um rund 9. Südkorea, Taiwan und Singapur sind zu diesem Zeitpunkt arme Länder — Südkorea kam 1961 auf rund 100 Dollar je Einwohner und lag damit unter Ghana. Die größte Volkswirtschaft der Welt liegt außerhalb dieses Ausschnitts: Die USA stellen um 1960 etwa 40 Prozent der Weltwirtschaft. Und noch einmal: Die Fläche zeigt Land, nicht Gewicht — das Gewicht steht in den Titeln.',
    flaechen: [
      {
        titel: 'Die Europäische Wirtschaftsgemeinschaft (1957) — Frankreich, Italien, die Bundesrepublik, Belgien, die Niederlande und Luxemburg; zusammen rund ein Fünftel der Weltwirtschaft',
        d: geo.pfad(EWG_SECHS_1957),
      },
      {
        titel: 'Bundesrepublik Deutschland (Mitte der 1960er Jahre) — nach den USA die zweitgrößte Volkswirtschaft der Welt; zweite Lage derselben Fläche, damit sie dunkler erscheint',
        d: geo.pfad(BUNDESREPUBLIK),
      },
      {
        titel: 'Deutsche Demokratische Republik (1955–1968) — Planwirtschaft im Rat für gegenseitige Wirtschaftshilfe; sie gehört zur anderen Hälfte der Geschichte, die das Kapitel „Die neue Weltordnung und der Kalte Krieg" erzählt',
        d: geo.pfad(DDR),
      },
      {
        titel: 'Japan (1955–1968) — rund 9 Prozent Wachstum im Jahr; 1964 die Olympischen Spiele in Tokio und der erste Shinkansen, 1968 überholt Japan die Bundesrepublik',
        d: flaecheAus(...JAPAN_RINGE),
      },
      {
        titel: 'Republik Korea (1961) — rund 100 Dollar Wirtschaftsleistung je Einwohner, damit ärmer als Ghana; der Aufholprozess beginnt erst in diesen Jahren',
        d: geo.pfad(SUEDKOREA),
      },
      {
        titel: 'Taiwan (1960er Jahre) — Landreform und erste Exportindustrie; die Insel wird von Taipeh regiert, die Volksrepublik China beansprucht sie',
        d: geo.pfad(TAIWAN),
      },
      {
        titel: 'Hongkong (1960er Jahre) — britische Kronkolonie; Textil- und Spielzeugfabriken (größer gezeichnet, als es ist)',
        d: geo.pfad(HONGKONG),
      },
      {
        titel: 'Singapur (1965) — seit dem 9. August 1965 unabhängig, ohne Rohstoffe und mit dem Hafen als einzigem Kapital (größer gezeichnet, als es ist)',
        d: geo.pfad(SINGAPUR),
      },
      {
        titel: 'Volksrepublik China (1958–1961) — der „Große Sprung nach vorn" endet in einer Hungerkatastrophe mit Millionen Toten; die Reformen beginnen erst 1978',
        d: flaecheAus(...CHINA_RINGE),
      },
      {
        titel: 'Indien (1965) — Planwirtschaft und rund 3,5 Prozent Wachstum im Jahr; 1966 muss das Land Getreide einführen, um eine Hungersnot abzuwenden',
        d: geo.pfad(INDIEN),
      },
    ],
  },
  {
    id: 'hoehepunkt-japans',
    label: '1990 — Japans Höhepunkt und die vier Tiger',
    hinweis:
      'Japan steht 1990 für rund 14 Prozent der Weltwirtschaft — der höchste Anteil, den das Land je hatte. Die vier „Tigerstaaten" Südkorea, Taiwan, Hongkong und Singapur haben in einer Generation den Abstand zu Europa halbiert. China ist zwölf Jahre nach dem Beginn der Reformen noch klein: rund 2 Prozent der Weltwirtschaft. Deutschland ist seit dem 3. Oktober 1990 wieder ein Staat — das ist die einzige Fläche auf dieser Karte, die zwischen zwei Phasen wächst.',
    flaechen: [
      {
        titel: 'Die sechs Gründerstaaten der Europäischen Gemeinschaft (1990) — seit dem 3. Oktober 1990 mit dem vereinten Deutschland; die EG hat zu diesem Zeitpunkt zwölf Mitglieder, gezeichnet sind hier die sechs von 1957',
        d: geo.pfad(EWG_SECHS_MIT_OSTEN),
      },
      {
        titel: 'Japan (1990) — seit 1968 die zweitgrößte Volkswirtschaft der Welt; zweite Lage derselben Fläche, damit sie dunkler erscheint',
        d: flaecheAus(...JAPAN_RINGE),
      },
      {
        titel: 'Japan (1990) — rund 14 Prozent der Weltwirtschaft; am 29. Dezember 1989 erreicht der Nikkei-Index 38 915 Punkte, danach platzt die Blase',
        d: flaecheAus(...JAPAN_RINGE),
      },
      {
        titel: 'Republik Korea (1990) — rund 6 500 Dollar je Einwohner; 1987 die ersten freien Präsidentschaftswahlen, 1988 die Olympischen Spiele in Seoul',
        d: geo.pfad(SUEDKOREA),
      },
      {
        titel: 'Taiwan (1990) — der Wissenschaftspark von Hsinchu trägt eine neue Industrie, der Auftragsfertiger TSMC ist 1987 gegründet worden; die Insel wird von Taipeh regiert, die Volksrepublik China beansprucht sie',
        d: geo.pfad(TAIWAN),
      },
      {
        titel: 'Hongkong (1990) — britische Kronkolonie und Finanzplatz; die Fabriken sind längst über die Grenze nach Shenzhen gezogen',
        d: geo.pfad(HONGKONG),
      },
      {
        titel: 'Singapur (1990) — über 12 000 Dollar je Einwohner; in einer Generation vom Entwicklungsland zum Industriestaat',
        d: geo.pfad(SINGAPUR),
      },
      {
        titel: 'Volksrepublik China (1990) — zwölf Jahre nach dem Beginn der Reformen Deng Xiaopings: rund 2 Prozent der Weltwirtschaft und rund 330 Dollar je Einwohner',
        d: flaecheAus(...CHINA_RINGE),
      },
      {
        titel: 'Indien (1990) — am Vorabend der Reformen von 1991; die Devisenreserven reichen für wenige Wochen Einfuhren',
        d: geo.pfad(INDIEN),
      },
    ],
  },
  {
    id: 'gegenwart',
    label: '2024 — die neuen Gewichte',
    hinweis:
      'Die Volksrepublik China ist seit 2010 die zweitgrößte Volkswirtschaft der Welt, Indien seit 2023 das bevölkerungsreichste Land. Deutschland ist 2023 wieder auf Platz drei vorgerückt — nicht weil es gewachsen wäre, sondern weil der Yen gefallen ist. Die USA liegen weiter außerhalb dieses Ausschnitts und weiter auf Platz eins, mit rund einem Viertel der Weltwirtschaft. Und die Fläche zeigt immer noch Land, nicht Gewicht: Chinas Staatsgebiet ist siebenundzwanzigmal so groß wie das deutsche, seine Wirtschaftsleistung rund viermal.',
    flaechen: [
      {
        titel: 'Die sechs Gründerstaaten der Europäischen Union (2024) — sie stehen hier für Westeuropa; die Union hat heute 27 Mitglieder und stellt zusammen rund ein Sechstel der Weltwirtschaft. Deutschland ist mit rund 4,7 Billionen Dollar die drittgrößte Volkswirtschaft der Welt',
        d: geo.pfad(EWG_SECHS_MIT_OSTEN),
      },
      {
        titel: 'Volksrepublik China (2024) — seit 2010 die zweitgrößte Volkswirtschaft der Welt; zweite Lage derselben Fläche, damit sie dunkler erscheint',
        d: flaecheAus(...CHINA_RINGE),
      },
      {
        titel: 'Volksrepublik China (2024) — rund 18 Billionen Dollar Wirtschaftsleistung, rund ein Sechstel der Weltwirtschaft; je Einwohner sind das rund 13 000 Dollar, ein Viertel des deutschen Werts',
        d: flaecheAus(...CHINA_RINGE),
      },
      {
        titel: 'Japan (2024) — die viertgrößte Volkswirtschaft der Welt; auf 1990 folgten rund drei Jahrzehnte mit kaum Wachstum, bei weiterhin hoher Lebenserwartung und niedriger Arbeitslosigkeit',
        d: flaecheAus(...JAPAN_RINGE),
      },
      {
        titel: 'Indien (2024) — die fünftgrößte Volkswirtschaft der Welt und seit 2023 das bevölkerungsreichste Land; rund 2 700 Dollar je Einwohner',
        d: geo.pfad(INDIEN),
      },
      {
        titel: 'Republik Korea (2024) — rund 36 000 Dollar je Einwohner, zuletzt über dem japanischen Wert; zugleich die niedrigste Geburtenziffer der Welt',
        d: geo.pfad(SUEDKOREA),
      },
      {
        titel: 'Taiwan (2024) — hier entstehen rund 90 Prozent der modernsten Halbleiter der Welt; die Insel wird von Taipeh regiert, die Volksrepublik China beansprucht sie',
        d: geo.pfad(TAIWAN),
      },
      {
        titel: 'Hongkong (2024) — seit dem 1. Juli 1997 Sonderverwaltungsregion der Volksrepublik China (größer gezeichnet, als es ist)',
        d: geo.pfad(HONGKONG),
      },
      {
        titel: 'Singapur (2024) — eines der höchsten Bruttoinlandsprodukte je Einwohner der Welt (größer gezeichnet, als es ist)',
        d: geo.pfad(SINGAPUR),
      },
      {
        titel: 'Vietnam (2024) — die neue Werkbank: Fabriken, die aus China abwandern, gehen häufig hierher',
        d: geo.pfad(VIETNAM),
      },
    ],
  },
];

const punkte = [
  {
    id: 'frankfurt',
    name: 'Frankfurt am Main',
    typ: 'stadt',
    ...ort(8.68, 50.11),
    text:
      'Am 20. Juni 1948 wurde in den Westzonen die D-Mark eingeführt; jede Person bekam 40 Mark „Kopfgeld". Über Nacht füllten sich die Schaufenster — nicht, weil es plötzlich mehr Waren gab, sondern weil sich das Zurückhalten nicht mehr lohnte. Ausgegeben wurde die neue Währung von der Bank deutscher Länder in Frankfurt, der Vorgängerin der Bundesbank; seit 1998 sitzt hier auch die Europäische Zentralbank. Das „Wirtschaftswunder" der 1950er Jahre hatte mehrere Ursachen: die Währungsreform, den Marshallplan, den Nachfrageschub des Koreakriegs, eine Industrie, die weniger zerstört war als angenommen, acht Millionen Vertriebene als Arbeitskräfte — und niedrige Löhne. Ein Wunder war es nicht; Frankreich, Italien und Japan wuchsen in denselben Jahren ähnlich schnell.',
  },
  {
    id: 'tokio',
    name: 'Tokio',
    typ: 'stadt',
    ...ort(139.69, 35.69),
    text:
      'Zwischen 1955 und 1973 wuchs die japanische Wirtschaft um rund 9 Prozent im Jahr. 1964 fuhr der erste Shinkansen und die Stadt richtete die Olympischen Spiele aus; 1968 überholte Japan die Bundesrepublik und war nach den USA die zweitgrößte Volkswirtschaft der Welt. In den 1980er Jahren erschienen im Westen Bücher mit Titeln wie „Japan as Number One". Am 29. Dezember 1989 stand der Nikkei-Index bei 38 915 Punkten; das Grundstück des Kaiserpalasts galt rechnerisch als teurer als der Bundesstaat Kalifornien. Dann platzte die Blase. Es folgten die „verlorenen Jahrzehnte" — allerdings mit einer Einschränkung, die selten mitgesagt wird: Je Erwerbstätigem wuchs Japan seither kaum langsamer als Westeuropa. Was wirklich schrumpft, ist die Bevölkerung: von 128 Millionen im Jahr 2008 auf rund 123 Millionen heute.',
  },
  {
    id: 'seoul',
    name: 'Seoul',
    typ: 'stadt',
    ...ort(126.98, 37.57),
    text:
      '1953 lag die Stadt in Trümmern, 1961 kam Südkorea auf rund 100 Dollar Wirtschaftsleistung je Einwohner — weniger als Ghana. Heute sind es rund 36 000 Dollar. Der Weg dorthin war kein Wettbewerb reiner Marktkräfte: Der Staat lenkte Kredite in ausgewählte Konzerne (Samsung, Hyundai, LG), schützte den Binnenmarkt und zwang die Unternehmen zugleich, im Export zu bestehen. Er war auch keine Erfolgsgeschichte der Freiheit: Bis 1987 war das Land eine Militärdiktatur; erst die Proteste des Juni 1987 erzwangen freie Wahlen. 1997 stand Südkorea in der Asienkrise vor der Zahlungsunfähigkeit und musste zum Internationalen Währungsfonds. Heute hat es die niedrigste Geburtenziffer der Welt — rund 0,75 Kinder je Frau.',
  },
  {
    id: 'taipeh',
    name: 'Taipeh',
    typ: 'stadt',
    ...ort(121.56, 25.03),
    text:
      '1980 eröffnete in Hsinchu ein Wissenschaftspark, 1987 gründete Morris Chang dort TSMC — ein Unternehmen, das selbst keine eigenen Chips entwirft, sondern die Entwürfe anderer fertigt. Dieses Geschäftsmodell hat die Halbleiterindustrie umgebaut: Heute entstehen auf Taiwan rund 90 Prozent der modernsten Chips der Welt. Wie abhängig Europa davon ist, zeigte sich 2021, als deutsche Autowerke in Kurzarbeit gingen, weil Bauteile fehlten. Zur Insel gehört die politisch heikelste Frage dieses Kapitels: Taiwan wird seit 1949 von der Regierung in Taipeh regiert und ist seit 1996 eine Demokratie; die Volksrepublik China betrachtet die Insel als Teil ihres Staatsgebiets. Die meisten Staaten unterhalten diplomatische Beziehungen zu Peking und nicht zu Taipeh. Diese Karte zeichnet, wer wo regiert — sie entscheidet die Frage nicht.',
  },
  {
    id: 'shenzhen',
    name: 'Shenzhen',
    typ: 'ereignis',
    ...ort(114.06, 22.55),
    text:
      '1980 erklärte die Volksrepublik den Ort an der Grenze zu Hongkong zur Sonderwirtschaftszone. Damals lebten hier einige zehntausend Menschen, heute über siebzehn Millionen. Deng Xiaoping hatte 1978 die Reformen eingeleitet, mit Sätzen, die keine Ideologie mehr waren: Es sei gleich, ob eine Katze schwarz oder weiß sei, Hauptsache, sie fange Mäuse. Was folgte, ist der größte Aufholprozess der Geschichte — rund dreißig Jahre mit etwa 10 Prozent Wachstum, nach Angaben der Weltbank sind dabei mehr als 800 Millionen Menschen der extremen Armut entkommen. Zur selben Geschichte gehört die andere Hälfte: China ist ein Einparteienstaat geblieben, die Arbeitsbedingungen in den Fabriken der 1990er und 2000er Jahre waren hart, und seit 2021 belastet eine Immobilienkrise das Wachstum.',
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    typ: 'stadt',
    ...ort(72.83, 18.94),
    text:
      '1991 hatte Indien Devisen für wenige Wochen Einfuhren; die Regierung musste Goldreserven verpfänden. Aus dieser Krise kam die Wende: Finanzminister Manmohan Singh lockerte die Lizenzpflichten, öffnete das Land für Investitionen und beendete damit vier Jahrzehnte Planwirtschaft. Was danach wuchs, war weniger die Industrie als der Dienstleistungssektor — Software, Rechenzentren, Pharmazie; die Ausfuhren der IT-Branche liegen heute bei rund 250 Milliarden Dollar im Jahr. Seit 2023 ist Indien das bevölkerungsreichste Land der Erde, mit einem mittleren Alter von rund 28 Jahren gegenüber 46 in Deutschland. Und zugleich: rund 2 700 Dollar Wirtschaftsleistung je Einwohner. In dieser Stadt stehen die Wolkenkratzer der Börse und Dharavi, eines der größten Elendsviertel Asiens, wenige Kilometer voneinander entfernt.',
  },
  {
    id: 'singapur',
    name: 'Singapur',
    typ: 'stadt',
    ...ort(103.85, 1.29),
    text:
      'Am 9. August 1965 wurde Singapur unabhängig — nicht aus eigenem Entschluss, sondern weil Malaysia den Stadtstaat aus der Föderation entließ. Es hatte keine Rohstoffe, kaum Trinkwasser und zwei Millionen Einwohner. Was es hatte, war die Lage: Durch die Straße von Malakka läuft bis heute rund ein Viertel des Welthandels. Unter Lee Kuan Yew wurden Hafen, Verwaltung, Wohnungsbau und Schulen aufgebaut; heute gehört Singapur zu den Ländern mit der höchsten Wirtschaftsleistung je Einwohner. Der Preis wird selten mitgenannt und gehört doch dazu: eine Regierungspartei, die seit 1959 ununterbrochen regiert, enge Grenzen für Presse und Opposition und ein hartes Strafrecht. Wer Singapur als Vorbild nennt, sollte sagen, welchen Teil davon er meint.',
  },
];

const bewegungen = [
  {
    id: 'marshallplan',
    name: 'Der Marshallplan, 1948–1952',
    von: p(-9.0, 47.5),
    ueber: [p(-1.0, 48.5)],
    nach: p(8.68, 50.11),
    text:
      'Der Pfeil kommt von außerhalb des Bildes, und das ist keine Nachlässigkeit: Die Vereinigten Staaten liegen nicht auf dieser Karte, ohne sie ist der Wiederaufbau Westeuropas aber nicht zu erklären. Zwischen 1948 und 1952 flossen rund 13 Milliarden Dollar an sechzehn Länder, davon etwa 1,4 Milliarden nach Westdeutschland — ein Zehntel. Gemessen an der Wirtschaftsleistung der Empfänger war das weniger, als die Legende sagt; entscheidend waren die Währungsreform, die erhaltene Industrie und der Zwang zur Zusammenarbeit, den der Plan den Europäern auferlegte. Wichtig war er trotzdem: Er lieferte Rohstoffe und Devisen, als beides fehlte, und er machte aus ehemaligen Kriegsgegnern Handelspartner.',
  },
  {
    id: 'werkbank-ostasien',
    name: 'Die Werkbank wandert: Japan → Südkorea und Taiwan (1960er–1980er)',
    von: p(139.69, 35.69),
    ueber: [p(126.98, 37.57)],
    nach: p(121.56, 25.03),
    text:
      'Als die Löhne in Japan stiegen, wanderte die arbeitsintensive Fertigung weiter — zuerst nach Südkorea und Taiwan. Beide kopierten das japanische Muster nicht einfach, sie verschärften es: staatlich gelenkte Kredite, Ausbildung, Exportzwang, geschützte Heimatmärkte. Und beide gingen darüber hinaus, als sie konnten — Südkorea in den Schiffbau, den Stahl und die Elektronik, Taiwan in die Halbleiter. Der Pfeil zeigt keine Absicht und kein Programm: Er zeigt, wohin Aufträge gingen, wenn die Fertigung anderswo billiger wurde. Genau dieselbe Bewegung hatte Westeuropa gegenüber den USA hinter sich, und genau dieselbe wird später China gegenüber Vietnam erleben.',
  },
  {
    id: 'werkbank-china',
    name: 'Und weiter nach China: die Sonderwirtschaftszonen ab 1980',
    von: p(121.56, 25.03),
    ueber: [p(114.17, 22.3)],
    nach: p(114.06, 22.55),
    text:
      'Als 1980 in Shenzhen die erste Sonderwirtschaftszone entstand, lag die Grenze zu Hongkong wenige Kilometer entfernt — und genau von dort kamen die ersten Fabriken, gefolgt von taiwanischen Unternehmen, für die die Löhne zu Hause zu hoch geworden waren. Nach dem Beitritt zur Welthandelsorganisation am 11. Dezember 2001 folgten die Aufträge aus Europa und Amerika. Innerhalb von zwanzig Jahren wurde die Volksrepublik zur Werkstatt der Welt. Auch dieser Pfeil zeigt, was geschah, und nicht, was jemand vorhatte: Die westlichen Unternehmen, die hier fertigen ließen, taten es nicht, um China aufzubauen, sondern weil es billiger war.',
  },
  {
    id: 'container-nach-europa',
    name: 'Was aus Asien nach Europa kommt — der Weg der Container',
    von: p(121.56, 25.03),
    ueber: [p(103.85, 1.29), p(43.3, 12.8), p(32.4, 30.6), p(14.0, 37.0)],
    nach: p(8.68, 50.11),
    text:
      'Dieser Pfeil läuft in die Gegenrichtung und schließt die Karte: Durch die Straße von Malakka geht rund ein Viertel des Welthandels, durch den Sueskanal ein weiterer großer Teil dessen, was Europa erreicht. Was hier ankommt, sind nicht nur Waren, sondern Abhängigkeiten in beide Richtungen. 2021 standen deutsche Autowerke still, weil Halbleiter aus Taiwan fehlten. Zugleich ist Europa einer der größten Absatzmärkte Chinas, und deutsche Autohersteller verkaufen einen erheblichen Teil ihrer Fahrzeuge dort. Die beiden Enden dieser Karte sind keine Gegner in einem Rennen; sie hängen aneinander — und das ist die Lage, in der die Frage nach der Zukunft gestellt wird.',
  },
];

const beschriftungen = [
  { text: 'Atlantik', art: 'meer', ...ort(-6.5, 44.0), drehung: 0 },
  { text: 'Mittelmeer', art: 'meer', ...ort(17.5, 34.5), drehung: 0 },
  { text: 'Nordsee', art: 'meer', ...ort(3.0, 56.3), drehung: 0 },
  { text: 'Schwarzes Meer', art: 'meer', ...ort(34.0, 43.4), drehung: 0 },
  { text: 'Rotes Meer', art: 'meer', ...ort(38.5, 20.0), drehung: 55 },
  { text: 'Indischer Ozean', art: 'meer', ...ort(72.0, -5.0), drehung: 0 },
  { text: 'Golf von Bengalen', art: 'meer', ...ort(85.5, 13.5), drehung: 0 },
  { text: 'Südchinesisches Meer', art: 'meer', ...ort(115.5, 11.0), drehung: 0 },
  { text: 'Pazifischer Ozean', art: 'meer', ...ort(139.0, 20.0), drehung: 0 },
  { text: 'Sahara', art: 'land', ...ort(12.0, 21.0), drehung: 0 },
  { text: 'Sibirien', art: 'land', ...ort(80.0, 55.0), drehung: 0 },
  { text: 'Himalaja', art: 'land', ...ort(84.0, 32.0), drehung: 0 },
  { text: 'Europa', art: 'land', ...ort(24.0, 47.0), drehung: 0 },
  { text: 'Asien', art: 'land', ...ort(60.0, 45.0), drehung: 0 },
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
