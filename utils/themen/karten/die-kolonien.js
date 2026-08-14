// Die Karte zum Thema „Die Kolonien" (≈1815–1914) — Geschichte in Bewegung.
//
// Die Küstenlinien stehen hier als echte Längen-/Breitengrade `[lon, lat]` und
// werden von utils/karte-geo.js in SVG-Koordinaten umgerechnet. Wer einen Punkt
// anzweifelt, schlägt ihn im Atlas nach: `[18.42, -33.93]` ist Kapstadt,
// `[32.55, 29.97]` Sues am Nordende des Roten Meeres, `[12.35, -6.0]` die
// Kongomündung und `[88.36, 22.57]` Kalkutta.
//
// ---------------------------------------------------------------------------
// Der Ausschnitt und warum er so steht
// ---------------------------------------------------------------------------
//
// 20° W bis 95° O, 36° S bis 58° N — 700 × 582,9. Mit 6,1 SVG-Einheiten je
// Längengrad ist das die gröbste Karte der App (bisher hielt die Amerika-Karte
// mit 6,4 diesen Platz). Das ist Absicht und zugleich die Aussage: London,
// Kapstadt und Kalkutta müssen auf ein Bild, sonst bleibt „über dem Empire geht
// die Sonne nie unter" ein Satz ohne Anschauung.
//
// Der Betreiber hatte 20° W bis 60° O vorgeschlagen. Nach Osten steht der
// Rahmen hier deutlich weiter, und zwar aus einem Grund, den die Vorgabe selbst
// nennt: Britisch-Indien soll sichtbar sein. Delhi liegt auf 77,2° O, Bombay auf
// 72,8° O, Kalkutta auf 88,4° O — bei 60° O wäre vom „Juwel der Krone" kein
// einziger Quadratzentimeter auf der Karte. Nach Norden reicht der Rahmen bis
// 58° N, damit London und Berlin daraufpassen: das eine als Zentrum des
// größten, das andere als Konferenzort, an dem 1884/85 die Grenzen eines
// Kontinents gezogen wurden.
//
// Was der Ausschnitt kostet, gehört ausdrücklich hierher: Australien,
// Neuseeland und Kanada liegen außerhalb — die Dominions stehen deshalb nur im
// Text. China ebenso: Kanton liegt auf 113° O, Peking auf 116° O; die
// Opiumkriege sind auf dieser Karte nicht zu sehen. Auch Singapur (104° O) und
// Indochina fehlen. Ein Rahmen, der all das noch aufnähme, wäre eine
// Weltkarte — und auf 700 Einheiten Breite wäre Afrika darauf ein Fleck.
// Diese Karte zeigt die beiden Schauplätze, die der Betreiber als zentral
// benannt hat: Afrika und Indien.
//
// ---------------------------------------------------------------------------
// Vier Festlegungen, die zu diesem Kapitel gehören
// ---------------------------------------------------------------------------
//
//   1. **Afrikanische Staaten stehen als eigene Flächen auf der Karte** —
//      gleich behandelt und gleich benannt wie die Kolonien. Das Sokoto-
//      Kalifat, Abessinien, das Aschanti-Reich, Bornu, Buganda, das Sultanat
//      Sansibar, das Königreich Merina auf Madagaskar: 1815 ist Afrika keine
//      leere Fläche, auf der Europa anfängt, sondern ein Kontinent voller
//      Staaten mit Grenzen. Dieselbe Regel wie auf der Karte zu den USA, wo
//      1776 das Land der Haudenosaunee und der Südost-Nationen neben den
//      Dreizehn Kolonien steht. Genau deshalb erzählt der Umschalter etwas:
//      Man sieht, was verschwindet.
//   2. **Eingefärbt wird nur, wo eine Herrschaft mit Grenzen plausibel ist.**
//      Die Sahara zwischen den Oasen, das Innere des Kongobeckens vor 1885,
//      die Kalahari — dort lebten Menschen, aber keine der gezeigten
//      Herrschaften hatte dort eine Grenze. Solche Flächen bleiben leer.
//      Umgekehrt gilt: Was 1914 eingefärbt ist, ist beanspruchtes und
//      verwaltetes Gebiet — nicht überall reichte die Verwaltung wirklich
//      bis zum letzten Dorf. Der Hinweis der Phase sagt das selbst.
//   3. **Die europäischen Mächte sind auch in Europa eingefärbt** — damit
//      sichtbar ist, von wo aus regiert wurde. Die übrigen Staaten Europas
//      bleiben leer; dieses Kapitel handelt von den Kolonialreichen, nicht von
//      der europäischen Staatenordnung. Das ist eine Darstellungsregel, kein
//      Urteil, und der Hinweis jeder Phase sagt sie an.
//   4. **Alle Flächen einer Phase werden gleich eingefärbt** (siehe
//      components/abschnitte/KarteAbschnitt.js). Die Farbe sagt also NICHT,
//      wem etwas gehört — Abessinien trägt denselben Ton wie Belgisch-Kongo.
//      Nur die Titel sagen, wer wer ist. Was man trotzdem sieht, und darum
//      geht es: wie viel von Afrika überhaupt eingefärbt ist. 1815 sind es
//      ein paar Küstenpunkte europäischer Mächte neben vielen afrikanischen
//      Staaten; 1914 ist der Kontinent bis auf zwei Ausnahmen aufgeteilt.
//
// Reine Daten und Rechnung — keine UI-Importe (Architektur-Regel).

const { KARTENFARBEN, erstelleProjektion, rueckwaerts, verbinde } = require('../../karte-geo');

// ---------------------------------------------------------------------------
// Ausschnitt und Projektion
// ---------------------------------------------------------------------------

/**
 * Der Kartenausschnitt: vom Atlantik westlich der Kanaren (20° W) bis an den
 * Golf von Bengalen und die Küste Birmas (95° O), vom Kap Agulhas (36° S) bis
 * nach Südschottland und Südschweden (58° N).
 */
const RAHMEN = { minLon: -20, maxLon: 95, minLat: -36, maxLat: 58, breite: 700 };

const geo = erstelleProjektion(RAHMEN);

/** Kurzform: geografischer Ort → SVG-Punkt `[x, y]`. */
const p = (lon, lat) => geo.punkt(lon, lat);

/** Dasselbe als `{ x, y }` — die Form, die Punkte und Beschriftungen wollen. */
const ort = (lon, lat) => {
  const [x, y] = p(lon, lat);
  return { x, y };
};

// ---------------------------------------------------------------------------
// Afrika — die Küste, in vier Abschnitten gegen den Uhrzeigersinn
// ---------------------------------------------------------------------------

/** Die Mittelmeerküste Afrikas: Tanger → Nildelta → Port Said → Sues. */
const NORDAFRIKA = [
  [-5.8, 35.79], // Tanger, an der Straße von Gibraltar
  [-5.3, 35.88],
  [-4.3, 35.17],
  [-3.0, 35.25], // Melilla
  [-1.9, 35.1],
  [-0.63, 35.72], // Oran
  [0.14, 35.9],
  [1.3, 36.5],
  [2.2, 36.6],
  [3.06, 36.77], // Algier
  [4.5, 36.9],
  [5.08, 36.75], // Bejaia
  [6.6, 37.05],
  [7.77, 36.9], // Annaba
  [8.65, 37.2],
  [9.87, 37.28], // Bizerta
  [10.3, 37.0], // Tunis
  [11.05, 37.08], // Kap Bon
  [10.7, 36.4],
  [10.55, 35.75], // Sousse
  [11.1, 35.2],
  [10.76, 34.73], // Sfax
  [10.1, 33.88], // Gabès
  [11.1, 33.5], // Djerba
  [11.5, 33.2],
  [12.0, 33.0],
  [13.19, 32.9], // Tripolis
  [14.2, 32.7],
  [15.1, 32.4], // Misrata
  [15.3, 31.6],
  [16.6, 31.2],
  [18.0, 30.75], // die große Bucht der Großen Syrte
  [19.2, 30.4],
  [19.9, 31.0],
  [20.07, 32.12], // Bengasi
  [20.9, 32.65],
  [21.8, 32.9],
  [22.64, 32.76], // Derna
  [23.98, 32.08], // Tobruk
  [25.15, 31.55], // Sollum
  [26.5, 31.4],
  [27.24, 31.35], // Marsa Matruh
  [28.5, 31.05],
  [29.92, 31.2], // Alexandria
  [30.9, 31.5], // Rosette, der westliche Nilarm
  [31.8, 31.42], // Damiette, der östliche Nilarm
  [32.3, 31.25], // Port Said, das Nordende des Sueskanals
  [32.4, 30.6], // der Kanal, bei Ismailia
  [32.55, 29.97], // Sues
];

/** Die Westküste des Roten Meeres: Sues → Massaua → Bab al-Mandab. */
const ROTES_MEER_WEST = [
  [32.55, 29.97],
  [33.1, 28.5],
  [33.8, 27.25], // Hurghada
  [34.28, 26.1], // Kosseir
  [34.9, 24.8],
  [35.48, 23.95], // Ras Banas
  [36.3, 22.5],
  [37.0, 21.0],
  [37.22, 19.6], // Port Sudan
  [37.33, 19.1], // Suakin, der alte Hafen des Sudans
  [38.2, 17.9],
  [38.6, 17.2],
  [39.1, 16.3],
  [39.45, 15.6], // Massaua, ab 1885 italienisch
  [40.0, 15.0],
  [40.9, 14.3],
  [41.9, 13.6],
  [42.73, 13.0], // Assab
  [43.15, 12.5],
  [43.3, 11.9], // Bab al-Mandab, das Tor zum Roten Meer
  [43.15, 11.6], // Dschibuti
];

/** Die Ostküste Afrikas: Dschibuti → Sansibar → Natal → Kapstadt. */
const OSTAFRIKA = [
  [43.15, 11.6],
  [44.0, 10.45],
  [45.02, 10.44], // Berbera
  [47.0, 11.0],
  [48.5, 11.3],
  [50.0, 11.5],
  [51.27, 11.83], // Kap Guardafui, die Spitze des Horns
  [51.4, 10.44], // Ras Hafun
  [50.8, 9.0],
  [50.0, 7.5],
  [48.5, 5.5],
  [47.0, 4.0],
  [45.34, 2.04], // Mogadischu
  [44.0, 1.0],
  [42.55, -0.36], // Kismayo
  [41.5, -1.5],
  [40.9, -2.27], // Lamu
  [40.2, -3.2],
  [39.67, -4.05], // Mombasa
  [39.2, -4.7],
  [39.1, -5.07], // Tanga
  [38.85, -6.45], // Bagamoyo, wo die Karawanen ankamen
  [39.28, -6.82], // Daressalam
  [39.4, -7.6],
  [39.5, -8.93], // Kilwa
  [39.8, -9.8],
  [40.4, -10.3],
  [40.6, -10.68], // Kap Delgado
  [40.5, -12.97], // Porto Amélia
  [40.6, -14.2],
  [40.73, -15.03], // Moçambique, die alte portugiesische Inselstadt
  [39.8, -16.3],
  [38.4, -17.2],
  [36.9, -17.88], // Quelimane
  [35.9, -18.6],
  [34.84, -19.83], // Beira
  [35.0, -20.8],
  [35.4, -21.9],
  [35.4, -23.87], // Inhambane
  [35.3, -24.7],
  [32.9, -25.7],
  [32.58, -25.97], // Lourenço Marques, heute Maputo
  [32.4, -27.0],
  [31.9, -28.5],
  [31.05, -29.87], // Durban
  [30.0, -31.0],
  [28.8, -32.3],
  [27.9, -33.02], // East London
  [26.5, -33.7],
  [25.6, -33.96], // Port Elizabeth
  [24.8, -34.2],
  [23.5, -34.05],
  [22.2, -34.1],
  [20.9, -34.4],
  [20.0, -34.83], // Kap Agulhas, der Südpunkt Afrikas
  [19.0, -34.6],
  [18.85, -34.36], // das Kap der Guten Hoffnung
  [18.42, -33.93], // Kapstadt
];

/** Die Westküste Afrikas: Kapstadt → Kongomündung → Dakar → Tanger. */
const WESTAFRIKA = [
  [18.42, -33.93],
  [18.3, -33.3],
  [17.94, -33.0], // Saldanha
  [18.0, -32.0],
  [17.5, -31.0],
  [16.9, -29.8],
  [16.45, -28.6], // die Mündung des Oranje
  [15.6, -27.6],
  [15.16, -26.65], // Lüderitzbucht, 1884 der erste deutsche Erwerb
  [14.9, -25.5],
  [14.5, -24.0],
  [14.5, -22.95], // Walfischbai, britisch mitten in deutschem Gebiet
  [14.4, -22.0],
  [13.95, -21.77], // Kap Cross
  [13.4, -20.0],
  [12.4, -18.5],
  [11.75, -17.25], // die Mündung des Kunene
  [11.8, -16.0],
  [12.15, -15.2], // Moçâmedes
  [12.5, -13.5],
  [13.4, -12.58], // Benguela
  [13.6, -11.5],
  [13.0, -10.0],
  [13.23, -8.81], // Luanda
  [12.9, -7.5],
  [12.35, -6.0], // die Kongomündung
  [12.0, -5.0],
  [11.85, -4.78], // Pointe-Noire
  [11.0, -3.7],
  [9.9, -2.5],
  [9.3, -1.5],
  [8.78, -0.72], // Kap Lopez
  [9.35, 0.0],
  [9.45, 0.39], // Libreville
  [9.6, 1.0],
  [9.77, 1.86], // Bata
  [9.4, 2.9],
  [9.7, 4.05], // Duala
  [8.8, 4.5],
  [8.32, 4.75], // Calabar
  [7.5, 4.4],
  [6.5, 4.3], // das Nigerdelta
  [5.5, 5.5],
  [4.5, 6.2],
  [3.4, 6.45], // Lagos
  [2.43, 6.35], // Cotonou
  [1.22, 6.13], // Lomé
  [0.0, 5.7],
  [-0.2, 5.55], // Accra
  [-1.2, 5.0],
  [-2.1, 4.75], // Kap Three Points
  [-3.2, 4.9],
  [-4.02, 5.31], // Abidjan
  [-5.5, 5.0],
  [-6.5, 4.6],
  [-7.72, 4.37], // Kap Palmas
  [-9.0, 5.2],
  [-10.8, 6.31], // Monrovia
  [-11.8, 7.4],
  [-12.5, 8.0],
  [-13.23, 8.49], // Freetown
  [-13.3, 9.1],
  [-13.7, 9.5], // Conakry
  [-14.4, 10.4],
  [-15.0, 10.9],
  [-15.6, 11.86], // Bissau
  [-16.7, 12.35],
  [-16.5, 13.5],
  [-17.0, 14.4],
  [-17.53, 14.72], // Kap Verde, die Westspitze des Kontinents
  [-16.9, 15.4],
  [-16.5, 16.03], // Saint-Louis, der älteste französische Posten
  [-16.2, 17.0],
  [-16.0, 18.1],
  [-16.3, 19.4],
  [-17.05, 20.77], // Kap Blanc
  [-16.5, 22.0],
  [-15.95, 23.7], // Dakhla
  [-14.9, 25.0],
  [-14.5, 26.1],
  [-13.4, 27.1],
  [-12.9, 27.95], // Kap Juby
  [-11.5, 28.5],
  [-10.0, 29.4],
  [-9.6, 30.42], // Agadir
  [-9.3, 31.5],
  [-8.5, 32.5],
  [-7.6, 33.6], // Casablanca
  [-6.83, 34.02], // Rabat
  [-6.3, 35.2],
  [-5.8, 35.79],
];

// ---------------------------------------------------------------------------
// Europa und Asien — die Küsten des großen Rings
// ---------------------------------------------------------------------------

/**
 * Die Nordküste des Mittelmeers: Gibraltar → Italien → Griechenland →
 * Kleinasien → Levante → Port Said → Sues.
 *
 * Der Weg um die Ägäis herum (Griechenlands Ostküste hinauf, an der
 * Nordküste entlang, die türkische Westküste hinunter) ist kein Umweg,
 * sondern nötig: Sonst würde die Ägäis zu Land.
 */
const MITTELMEER_NORD = [
  [-5.61, 36.0], // Tarifa, die Südspitze Europas
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
  [14.9, 40.6], // Salerno
  [15.5, 40.0],
  [16.0, 39.4],
  [15.9, 38.5],
  [15.65, 38.0], // Reggio, an der Straße von Messina
  [16.6, 38.9],
  [17.2, 39.4], // Kap Colonna
  [17.2, 40.5], // Tarent
  [18.0, 40.1],
  [18.5, 40.15], // Otranto
  [17.9, 40.7],
  [16.9, 41.15], // Bari
  [15.9, 41.9], // der Gargano, der Sporn des Stiefels
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
  [21.3, 38.3], // der Golf von Patras
  [21.6, 37.6],
  [21.7, 37.0],
  [22.5, 36.5], // Kap Matapan, die Südspitze der Peloponnes
  [23.2, 36.4],
  [23.5, 37.4],
  [23.7, 37.95], // Piräus, der Hafen Athens
  [24.0, 38.3],
  [23.5, 39.2],
  [22.9, 39.9], // Volos
  [22.6, 40.5], // Thessaloniki
  [24.0, 40.7], // Kavala
  [25.9, 40.85],
  [26.2, 40.3], // die Dardanellen
  [26.7, 39.6],
  [26.9, 38.9],
  [27.14, 38.42], // Smyrna
  [27.2, 37.7],
  [27.4, 37.0],
  [28.2, 36.6],
  [29.1, 36.2],
  [30.5, 36.3], // Antalya
  [31.4, 36.8],
  [32.8, 36.1], // Anamur
  [34.0, 36.3], // Mersin
  [35.5, 36.6], // Iskenderun
  [36.0, 36.0],
  [35.9, 35.5], // Latakia
  [35.5, 34.6], // Tripoli
  [35.5, 33.9], // Beirut
  [35.0, 33.1], // Tyros
  [34.9, 32.5], // Haifa
  [34.75, 32.1], // Jaffa
  [34.47, 31.5], // Gaza
  [34.0, 31.3],
  [33.2, 31.1], // El Arisch
  [32.35, 31.25], // Port Said
  [32.4, 30.6],
  [32.55, 29.97], // Sues — hier stößt der Ring an Afrika
];

/** Sinai und die Westküste Arabiens: Sues → Dschidda → Aden. */
const ARABIEN_WEST = [
  [32.55, 29.97],
  [33.2, 28.5],
  [33.6, 27.9],
  [34.25, 27.72], // Ras Muhammad, die Südspitze des Sinai
  [34.6, 28.5],
  [34.85, 29.3],
  [35.0, 29.55], // Akaba
  [35.2, 28.5],
  [36.0, 27.5],
  [36.8, 25.6],
  [38.05, 24.09], // Yanbu
  [37.9, 23.0],
  [39.15, 21.5], // Dschidda, der Hafen Mekkas
  [39.9, 20.0],
  [40.5, 19.0],
  [41.5, 17.5],
  [42.55, 16.9], // Dschasan
  [42.8, 15.5],
  [43.2, 14.0],
  [43.3, 12.8], // die Ostseite von Bab al-Mandab
  [44.0, 12.8],
  [45.03, 12.78], // Aden — britisch seit 1839, Kohlestation nach Indien
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
  [59.8, 22.52], // Ras al-Hadd, die Ostspitze Arabiens
  [58.6, 23.6], // Maskat
  [57.2, 24.3],
  [56.4, 25.6],
  [56.4, 26.4], // Ras Musandam, an der Straße von Hormus
];

/**
 * Die Küste von Hormus bis zur Südspitze Indiens.
 *
 * Der Ring springt bei Hormus über die Meerenge auf die persische Seite; der
 * Persische Golf liegt danach im Inneren des Rings und wird als eigene
 * Wasserfläche darübergelegt. Das spart dreißig Punkte und sieht gleich aus.
 */
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
  [69.1, 22.47], // Okha, die Westspitze Kathiawars
  [69.6, 21.63], // Porbandar
  [70.98, 20.71], // Diu, portugiesisch seit 1535
  [72.0, 21.0],
  [72.8, 21.17], // Surat, der erste englische Handelsposten in Indien
  [72.83, 18.94], // Bombay
  [73.3, 17.0],
  [73.8, 15.5], // Goa, portugiesisch
  [74.8, 13.3], // Mangalore
  [75.8, 11.25], // Kozhikode, das Calicut der Gewürzfahrten
  [76.3, 9.97], // Kochi
  [77.5, 8.08], // Kap Komorin
];

/** Die Ostküste Indiens und Birmas: Kap Komorin → Kalkutta → Rangun. */
const INDIEN_OST = [
  [77.5, 8.08],
  [78.2, 8.8],
  [79.1, 9.3], // Rameswaram, gegenüber von Ceylon
  [79.5, 10.3],
  [79.85, 11.4],
  [80.27, 13.08], // Madras
  [80.2, 14.5],
  [80.9, 15.7], // die Krishnamündung
  [82.3, 16.6], // das Godavaridelta
  [83.3, 17.7], // Visakhapatnam
  [84.8, 19.1],
  [86.0, 20.3],
  [87.0, 21.5],
  [88.1, 21.7], // die Sundarbans, das Mündungsgebiet des Ganges
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
  [96.2, 16.8], // Rangun, östlich außerhalb des Bildrands
  [97.0, 16.5],
  [97.6, 15.5],
];

/**
 * Die Ostsee- und Nordseeküste: Estland → Danzig → Jütland → Calais.
 *
 * Was nördlich davon liegt — Skandinavien —, ist eine eigene Landmasse; die
 * Ostsee bleibt dadurch Wasser, ohne dass eine zusätzliche Fläche nötig wäre.
 */
const OSTSEE_NORDSEE = [
  [26.8, 59.5], // die estnische Küste, über dem oberen Bildrand
  [25.0, 59.5],
  [24.0, 59.4],
  [23.5, 58.6],
  [24.3, 57.9],
  [24.1, 57.05], // Riga
  [23.0, 57.1],
  [22.6, 57.75], // Kap Kolka
  [21.0, 56.5],
  [21.05, 55.7], // Memel
  [20.0, 54.9],
  [19.3, 54.55],
  [18.65, 54.35], // Danzig
  [17.3, 54.75],
  [16.2, 54.25],
  [14.25, 53.92], // Swinemünde
  [13.1, 54.31], // Stralsund
  [12.1, 54.18], // Rostock
  [11.0, 54.1],
  [10.13, 54.33], // Kiel
  [9.9, 54.5],
  [9.43, 54.79], // Flensburg
  [9.9, 55.5],
  [10.2, 56.15], // Aarhus
  [10.5, 57.0],
  [10.6, 57.75], // Skagen, die Nordspitze Jütlands
  [9.96, 57.59], // Hirtshals
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
  [5.05, 52.35], // die Zuidersee, 1932 abgedämmt
  [4.75, 52.96],
  [4.5, 52.3],
  [4.05, 51.98],
  [3.4, 51.45],
  [2.6, 51.1],
  [1.85, 50.96], // Calais
];

/** Die Atlantikküste: Calais → Brest → Gironde → Lissabon → Tarifa. */
const ATLANTIK_EUROPA = [
  [1.85, 50.96],
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
  [-8.87, 41.87], // die Minhomündung, die Grenze Portugals
  [-8.7, 41.15], // Porto
  [-8.9, 40.15],
  [-9.4, 39.35],
  [-9.48, 38.78], // Kap Roca, der Westpunkt des Festlands
  [-9.0, 38.5],
  [-8.9, 37.9],
  [-8.99, 37.02], // Kap São Vicente
  [-7.4, 37.17], // die Guadianamündung
  [-6.35, 36.8], // Cádiz
  [-6.03, 36.18], // Kap Trafalgar
  [-5.61, 36.0],
];

// ---------------------------------------------------------------------------
// Inseln
// ---------------------------------------------------------------------------

/** Britannien. */
const BRITANNIEN = [
  [-5.7, 50.07], // Land's End
  [-3.5, 50.6],
  [-1.9, 50.7],
  [-0.8, 50.75],
  [0.5, 50.9],
  [1.4, 51.4], // die Themsemündung
  [0.7, 52.7],
  [0.3, 53.6], // The Wash
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
  [-3.0, 51.3], // der Bristolkanal
  [-4.2, 50.3],
];

/** Irland. */
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

/** Madagaskar — das Königreich Merina, ab 1896 französische Kolonie. */
const MADAGASKAR = [
  [49.3, -12.3], // Kap d'Ambre, die Nordspitze
  [50.2, -14.0],
  [50.5, -15.4],
  [49.8, -16.5],
  [49.6, -18.0], // Toamasina
  [48.8, -20.3],
  [47.9, -22.5],
  [47.1, -24.0],
  [45.2, -25.55], // Kap Sainte-Marie, die Südspitze
  [44.0, -24.5],
  [43.5, -23.5],
  [43.7, -22.0],
  [43.3, -21.0],
  [43.5, -19.5],
  [44.5, -18.0],
  [44.0, -16.5],
  [45.5, -15.8],
  [47.0, -15.0],
  [48.0, -13.5],
  [48.8, -13.0],
];

/** Ceylon — eigene Kronkolonie, nie Teil Britisch-Indiens. */
const CEYLON = [
  [79.9, 9.8],
  [80.9, 9.3],
  [81.8, 8.5],
  [81.9, 7.0],
  [81.6, 6.4],
  [80.6, 5.95],
  [79.9, 6.8],
  [79.8, 8.5],
];

/** Sansibar — Sitz des Sultans, Umschlagplatz für Gewürznelken und Sklaven. */
const SANSIBAR = [
  [39.15, -5.72],
  [39.5, -6.05],
  [39.5, -6.45],
  [39.25, -6.5],
  [39.1, -6.1],
];

const SOKOTRA = [
  [53.3, 12.6],
  [54.5, 12.6],
  [54.5, 12.35],
  [53.3, 12.4],
];

const TENERIFFA = [
  [-16.9, 28.6],
  [-16.1, 28.35],
  [-16.4, 28.0],
  [-16.9, 28.35],
];

const GRAN_CANARIA = [
  [-15.7, 28.15],
  [-15.35, 28.0],
  [-15.4, 27.75],
  [-15.8, 27.9],
];

// ---------------------------------------------------------------------------
// Binnenmeere und Seen — sie liegen im Inneren der großen Ringe
// ---------------------------------------------------------------------------

const SCHWARZES_MEER = [
  [29.0, 41.2],
  [31.0, 41.3],
  [34.0, 41.9],
  [36.5, 41.1],
  [38.4, 41.4],
  [41.5, 41.5],
  [41.6, 42.6],
  [40.0, 43.4],
  [38.0, 44.3],
  [36.5, 45.3],
  [35.0, 45.3],
  [33.5, 44.4], // die Südspitze der Krim
  [32.5, 45.3],
  [31.5, 46.6],
  [30.5, 46.6],
  [29.7, 45.3],
  [28.7, 44.3],
  [28.0, 43.4],
  [27.5, 42.4],
  [28.0, 41.7],
];

const KASPISCHES_MEER = [
  [51.3, 47.1],
  [52.5, 45.5],
  [53.0, 44.0],
  [52.0, 42.5],
  [51.0, 41.5],
  [53.5, 39.5],
  [54.0, 37.5],
  [52.5, 36.8],
  [50.0, 36.8],
  [49.0, 37.5],
  [48.6, 38.5],
  [49.0, 40.0],
  [50.0, 41.5],
  [51.0, 43.0],
  [50.5, 44.5],
  [49.5, 46.0],
  [50.0, 46.8],
];

const PERSISCHER_GOLF = [
  [56.3, 26.9],
  [55.0, 26.0],
  [52.5, 27.5],
  [50.0, 29.0],
  [48.5, 30.0],
  [48.0, 30.4], // die Mündung von Euphrat und Tigris
  [47.7, 30.0],
  [48.5, 28.5],
  [50.5, 27.0],
  [51.5, 25.0],
  [52.5, 24.0],
  [54.5, 24.3],
  [56.3, 26.4],
];

const ARALSEE = [
  [58.5, 45.0],
  [59.5, 46.2],
  [61.0, 45.6],
  [61.5, 44.5],
  [60.0, 43.7],
  [58.6, 44.3],
];

const VICTORIASEE = [
  [31.7, -1.0],
  [32.0, 0.4],
  [33.0, 0.5],
  [34.2, 0.4],
  [34.0, -1.0],
  [33.0, -2.6],
  [32.0, -2.4],
];

const TANGANJIKASEE = [
  [29.2, -3.4],
  [29.9, -4.3],
  [30.5, -5.5],
  [30.0, -6.5],
  [29.6, -6.0],
  [29.2, -4.5],
];

const NJASSASEE = [
  [34.0, -9.5],
  [34.9, -10.5],
  [35.3, -12.5],
  [34.9, -14.4],
  [34.5, -13.5],
  [34.2, -11.5],
  [33.8, -10.0],
];

const TSCHADSEE = [
  [13.2, 12.6],
  [14.6, 13.5],
  [14.9, 12.9],
  [14.0, 12.2],
  [13.3, 12.2],
];

// ---------------------------------------------------------------------------
// Flüsse und Kanal
// ---------------------------------------------------------------------------

/** Der Nil — von der Mündung bis Juba. */
const NIL = [
  [31.0, 31.4],
  [31.24, 30.05], // Kairo
  [31.8, 27.5],
  [32.6, 25.7], // Luxor
  [32.9, 24.09], // Assuan
  [31.3, 21.8], // Wadi Halfa
  [31.6, 18.5],
  [32.53, 15.6], // Khartum, wo sich Weißer und Blauer Nil treffen
  [32.4, 13.2],
  [31.9, 11.0],
  [31.6, 9.5],
  [31.6, 4.85], // Juba
];

/** Der Blaue Nil — von Khartum zum Tanasee im Hochland Abessiniens. */
const BLAUER_NIL = [
  [32.53, 15.6],
  [33.9, 13.5],
  [35.0, 11.8],
  [37.3, 12.0], // der Tanasee
];

/** Der Kongo — der Strom, um den es 1884/85 in Berlin ging. */
const KONGO = [
  [12.35, -6.0],
  [13.45, -5.83], // Matadi, das Ende der Schifffahrt vom Meer her
  [15.3, -4.3], // der Stanley Pool
  [16.2, -3.3],
  [17.7, -1.5],
  [19.0, 0.0],
  [21.0, 1.2], // der große Bogen über den Äquator
  [23.0, 1.0],
  [25.2, 0.5], // Stanleyville
  [25.9, -2.0],
  [27.0, -4.5],
  [28.8, -8.6], // der Oberlauf, der Lualaba in Katanga
];

/** Der Niger — der Fluss, der bis 1830 als Rätsel galt. */
const NIGER = [
  [-10.5, 9.7],
  [-8.0, 12.65], // Bamako
  [-5.5, 14.5],
  [-3.0, 16.77], // Timbuktu, am nördlichsten Punkt des Bogens
  [0.05, 16.27], // Gao
  [2.1, 13.5], // Niamey
  [3.5, 11.9],
  [6.75, 7.8], // Lokoja, wo der Benue mündet
  [6.5, 4.6],
];

const SENEGAL = [
  [-16.5, 16.03],
  [-14.0, 16.5],
  [-12.0, 14.8],
  [-11.4, 13.7],
];

/** Der Sambesi — mit den Victoriafällen, die Livingstone 1855 sah. */
const SAMBESI = [
  [36.3, -18.6],
  [34.5, -16.6],
  [33.6, -16.15], // Tete
  [30.4, -16.0],
  [25.85, -17.93], // die Victoriafälle
  [23.5, -17.5],
];

const ORANJE = [
  [16.45, -28.6],
  [20.0, -28.6],
  [24.0, -29.0],
  [26.5, -28.7],
  [28.5, -29.6],
];

const LIMPOPO = [
  [35.35, -25.2],
  [32.5, -24.5],
  [29.5, -22.5],
  [27.5, -24.5],
];

const INDUS = [
  [68.0, 23.8],
  [68.5, 26.0],
  [70.0, 28.0],
  [71.5, 30.0],
  [73.0, 31.5], // die Fünf Ströme des Pandschab
  [74.5, 33.0],
  [75.5, 34.5],
];

const GANGES = [
  [89.0, 22.5],
  [89.5, 24.0],
  [87.0, 25.0],
  [85.1, 25.6], // Patna
  [83.0, 25.3], // Benares
  [81.85, 25.45], // Allahabad
  [80.35, 26.45], // Kanpur
  [78.15, 29.95], // Haridwar, wo der Ganges das Gebirge verlässt
];

const EUPHRAT_TIGRIS = [
  [48.0, 30.4],
  [47.0, 31.0],
  [45.5, 32.0], // Bagdad liegt am Tigris etwas nördlich
  [43.0, 34.0],
  [40.0, 35.5],
  [38.0, 36.8],
];

const DONAU = [
  [29.6, 45.2],
  [26.5, 44.1],
  [22.5, 44.6], // das Eiserne Tor
  [20.45, 44.8], // Belgrad
  [19.05, 47.5], // Budapest
  [16.37, 48.2], // Wien
  [13.0, 48.5],
];

/** Der Sueskanal — seit 1869 die kürzeste Verbindung nach Indien. */
const SUESKANAL = [
  [32.3, 31.25],
  [32.35, 30.6],
  [32.55, 29.97],
];

// ---------------------------------------------------------------------------
// Wüsten
// ---------------------------------------------------------------------------

const SAHARA = [
  [-13.0, 27.5],
  [-5.0, 30.5],
  [5.0, 31.5],
  [15.0, 30.0],
  [25.0, 26.0],
  [31.0, 24.0],
  [33.5, 22.0],
  [30.0, 17.0],
  [22.0, 16.0],
  [12.0, 15.5],
  [3.0, 16.5],
  [-5.0, 16.5],
  [-12.5, 19.0],
  [-16.5, 22.0],
  [-15.0, 26.0],
];

const ARABISCHE_WUESTE = [
  [36.5, 29.5],
  [42.0, 30.5],
  [47.0, 29.0],
  [52.0, 24.0],
  [55.0, 22.5],
  [52.0, 19.0],
  [47.0, 18.5],
  [43.0, 17.5],
  [40.0, 20.0],
  [38.0, 24.0],
  [36.0, 27.0],
];

const KALAHARI = [
  [20.0, -20.0],
  [24.0, -19.0],
  [26.0, -21.5],
  [25.0, -25.5],
  [22.5, -27.0],
  [20.0, -25.0],
  [19.5, -22.0],
];

const NAMIB = [
  [14.6, -22.5],
  [15.8, -24.5],
  [16.6, -27.5],
  [15.5, -27.8],
  [14.6, -25.0],
  [13.9, -22.0],
];

const THAR = [
  [70.0, 28.5],
  [73.0, 29.5],
  [74.0, 27.0],
  [72.0, 25.0],
  [70.0, 26.0],
];

// ---------------------------------------------------------------------------
// Die Landmassen
// ---------------------------------------------------------------------------

/** Afrika — ein geschlossener Umriss, am Isthmus von Sues an Asien grenzend. */
const AFRIKA = verbinde(NORDAFRIKA, ROTES_MEER_WEST, OSTAFRIKA, WESTAFRIKA);

/**
 * Europa und Asien als ein Ring.
 *
 * Der Weg: Mittelmeernordküste → Arabien → Indien → Birma, dann über den
 * rechten und oberen Bildrand zurück nach Estland, die Ostsee- und
 * Nordseeküste entlang und über den Atlantik zurück nach Tarifa. Alles
 * oberhalb von 58° N ist außerhalb des Bildes und deshalb frei erfunden —
 * sichtbar wird davon nichts.
 */
const EURASIEN = verbinde(
  MITTELMEER_NORD,
  ARABIEN_WEST,
  ARABIEN_SUED,
  MAKRAN_INDIEN_WEST,
  INDIEN_OST,
  [
    [98.0, 12.0],
    [98.0, 62.0],
    [27.5, 62.0],
    [27.0, 59.8],
  ],
  OSTSEE_NORDSEE,
  ATLANTIK_EUROPA,
);

// ---------------------------------------------------------------------------
// Werkzeug: Küstenabschnitte nach Orten schneiden
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

/**
 * Ein Küstenabschnitt zwischen zwei Orten — in der Richtung, in der er
 * gebraucht wird. Geschnitten wird nach Ort, nicht nach Index: „von Lagos bis
 * Dakar" bleibt richtig, auch wenn dazwischen Punkte dazukommen.
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
// Europa: die Mächte, von denen aus regiert wurde
// ---------------------------------------------------------------------------
//
// Nur die Kolonialmächte dieses Kapitels sind in Europa eingefärbt (siehe
// Festlegung 3 im Kopf). Die Grenze zwischen Frankreich und Deutschland ist
// hier durchgehend die von 1871 gezeichnet — Elsass-Lothringen ist bei 6,1
// Einheiten je Längengrad kaum breiter als die Linie selbst, und das Kapitel,
// in dem es darauf ankommt, ist das nächste.

const FRANKREICH_EUROPA = verbinde(
  kueste(OSTSEE_NORDSEE, [2.6, 51.1], [1.85, 50.96]),
  kueste(ATLANTIK_EUROPA, [1.85, 50.96], [-1.78, 43.35]),
  [
    [-0.7, 42.9],
    [0.6, 42.7],
    [1.9, 42.5],
    [3.28, 42.32], // der Pyrenäenkamm
  ],
  kueste(MITTELMEER_NORD, [3.28, 42.32], [7.27, 43.7]),
  [
    [7.0, 44.2],
    [6.8, 45.1],
    [6.0, 46.2],
    [6.9, 47.5],
    [6.9, 48.6],
    [6.4, 49.5],
    [4.8, 49.8],
    [4.2, 49.95],
    [3.3, 50.5],
    [2.6, 51.1],
  ],
);

const SPANIEN_EUROPA = verbinde(
  kueste(ATLANTIK_EUROPA, [-1.78, 43.35], [-8.87, 41.87]),
  [
    [-8.2, 42.0],
    [-7.0, 41.9],
    [-6.5, 41.6],
    [-6.8, 41.0],
    [-7.0, 39.7],
    [-7.5, 39.6],
    [-7.0, 38.9],
    [-7.4, 37.17],
  ],
  kueste(ATLANTIK_EUROPA, [-7.4, 37.17], [-5.61, 36.0]),
  kueste(MITTELMEER_NORD, [-5.61, 36.0], [3.28, 42.32]),
  [
    [1.9, 42.5],
    [0.6, 42.7],
    [-0.7, 42.9],
  ],
);

const PORTUGAL_EUROPA = verbinde(
  kueste(ATLANTIK_EUROPA, [-8.87, 41.87], [-7.4, 37.17]),
  [
    [-7.0, 38.9],
    [-7.5, 39.6],
    [-7.0, 39.7],
    [-6.8, 41.0],
    [-6.5, 41.6],
    [-7.0, 41.9],
    [-8.2, 42.0],
  ],
);

const BELGIEN_EUROPA = [
  [2.6, 51.1],
  [3.4, 51.45],
  [4.6, 51.5],
  [5.8, 51.1],
  [6.0, 50.5],
  [6.4, 49.8],
  [5.8, 49.5],
  [4.8, 49.8],
  [4.2, 49.95],
  [3.3, 50.5],
];

const DEUTSCHES_REICH_EUROPA = verbinde(
  [
    [6.0, 50.8],
    [6.4, 51.9],
    [7.0, 52.5],
    [7.2, 53.3],
  ],
  kueste(OSTSEE_NORDSEE, [7.2, 53.6], [8.45, 55.47]),
  [
    [8.6, 55.4],
    [9.5, 55.5], // die Grenze zu Dänemark, wie sie von 1864 bis 1920 lief
  ],
  kueste(OSTSEE_NORDSEE, [9.9, 55.5], [10.13, 54.33]),
  kueste(OSTSEE_NORDSEE, [10.13, 54.33], [21.05, 55.7]),
  [
    [22.8, 54.4],
    [23.0, 53.9],
    [20.3, 53.0],
    [19.3, 53.1],
    [18.3, 53.2],
    [18.0, 52.3],
    [17.9, 51.4],
    [18.6, 50.5],
    [19.9, 50.05],
    [18.6, 50.0],
    [17.0, 50.3],
    [15.0, 50.8],
    [14.4, 51.0],
    [13.5, 50.7],
    [12.5, 50.4],
    [12.4, 49.8],
    [13.4, 48.9],
    [13.5, 48.6],
    [12.8, 47.7],
    [11.0, 47.5],
    [10.2, 47.4],
    [9.6, 47.5],
    [8.6, 47.8],
    [7.6, 47.6],
    [6.9, 47.5],
    [6.9, 48.6],
    [6.4, 49.5],
    [6.4, 49.8],
    [6.0, 50.5],
  ],
);

const ITALIEN_EUROPA = verbinde(
  kueste(MITTELMEER_NORD, [7.27, 43.7], [12.34, 45.44]),
  [
    [13.0, 45.75],
    [12.4, 46.6],
    [11.0, 46.5],
    [10.4, 46.6],
    [9.0, 46.2],
    [8.0, 46.0],
    [7.0, 45.9],
    [6.8, 45.1],
    [7.0, 44.2],
  ],
);

// ---------------------------------------------------------------------------
// Die großen Reiche Asiens, die keine Kolonien waren
// ---------------------------------------------------------------------------

/** Das Osmanische Reich 1815 — mit dem Balkan bis an die Donau. */
const OSMANEN_1815 = verbinde(
  kueste(MITTELMEER_NORD, [19.4, 40.5], [34.47, 31.5]),
  [
    [36.0, 31.0],
    [38.0, 31.5],
    [40.5, 31.0],
    [43.0, 30.5],
    [47.7, 30.0], // Basra, am Kopf des Persischen Golfs
    [46.0, 32.5],
    [45.5, 34.5],
    [44.5, 37.0],
    [43.5, 38.5],
    [44.5, 39.7],
    [42.5, 41.5],
    [41.5, 41.5],
  ],
  kueste(SCHWARZES_MEER, [41.5, 41.5], [29.0, 41.2]),
  [
    [28.0, 43.4],
    [28.7, 44.3],
    [29.7, 45.3], // das Donaudelta
    [26.5, 44.1],
    [22.5, 44.6],
    [20.45, 44.8], // Belgrad, an der Militärgrenze
    [19.0, 45.2],
    [17.5, 45.1],
    [16.5, 45.2],
    [17.5, 43.0],
    [18.4, 42.6],
  ],
  kueste(MITTELMEER_NORD, [18.09, 42.65], [19.4, 40.5]),
);

/** Das Osmanische Reich 1885 — nach dem Berliner Kongress von 1878. */
const OSMANEN_1885 = verbinde(
  kueste(MITTELMEER_NORD, [19.4, 40.5], [20.0, 39.7]),
  [
    [21.0, 39.8],
    [22.2, 39.9],
  ],
  kueste(MITTELMEER_NORD, [22.9, 39.9], [34.47, 31.5]),
  [
    [36.0, 31.0],
    [38.0, 31.5],
    [40.5, 31.0],
    [43.0, 30.5],
    [47.7, 30.0],
    [46.0, 32.5],
    [45.5, 34.5],
    [44.5, 37.0],
    [43.5, 38.5],
    [44.5, 39.7],
    [42.5, 41.5],
    [41.5, 41.5],
  ],
  kueste(SCHWARZES_MEER, [41.5, 41.5], [29.0, 41.2]),
  [
    [27.0, 41.6],
    [25.0, 41.4],
    [22.5, 42.0],
    [21.0, 42.5],
    [20.0, 42.3],
    [19.5, 41.9],
  ],
  kueste(MITTELMEER_NORD, [19.5, 41.3], [19.4, 40.5]),
);

/** Das Osmanische Reich 1914 — der Balkan ist 1912/13 verloren gegangen. */
const OSMANEN_1914 = verbinde(
  kueste(MITTELMEER_NORD, [26.2, 40.3], [34.47, 31.5]),
  [
    [36.0, 31.0],
    [38.0, 31.5],
    [40.5, 31.0],
    [43.0, 30.5],
    [47.7, 30.0],
    [46.0, 32.5],
    [45.5, 34.5],
    [44.5, 37.0],
    [43.5, 38.5],
    [44.5, 39.7],
    [42.5, 41.5],
    [41.5, 41.5],
  ],
  kueste(SCHWARZES_MEER, [41.5, 41.5], [29.0, 41.2]),
  [
    [27.5, 41.8],
    [26.5, 40.9],
  ],
);

/** Persien unter den Kadscharen — Spielball im „Großen Spiel", nie Kolonie. */
const PERSIEN = verbinde(
  kueste(PERSISCHER_GOLF, [48.0, 30.4], [56.3, 26.9]),
  kueste(MAKRAN_INDIEN_WEST, [56.2, 27.15], [61.6, 25.2]),
  [
    [61.5, 27.5],
    [61.0, 31.0],
    [60.5, 33.5],
    [61.0, 36.0],
    [58.0, 37.7],
    [54.0, 37.5],
  ],
  kueste(KASPISCHES_MEER, [54.0, 37.5], [48.6, 38.5]),
  [
    [47.5, 39.5],
    [45.5, 39.2],
    [44.5, 39.7],
    [44.5, 37.0],
    [45.5, 34.5],
    [46.0, 32.5],
    [47.7, 30.0],
  ],
);

/** Afghanistan — Pufferstaat zwischen dem britischen und dem russischen Reich. */
const AFGHANISTAN = [
  [60.8, 35.5],
  [64.0, 37.0],
  [68.0, 37.0],
  [71.0, 36.8],
  [74.5, 37.0], // der Wachan-Korridor, 1895 als Puffer gezogen
  [71.5, 35.0],
  [70.5, 33.5],
  [69.5, 31.5],
  [66.5, 29.5],
  [62.0, 29.5],
  [60.8, 32.5],
];

/** Nepal — nie Kolonie, seit 1816 mit einem britischen Residenten in Katmandu. */
const NEPAL = [
  [80.2, 28.6],
  [82.0, 29.5],
  [85.0, 28.5],
  [88.0, 27.9],
  [88.2, 27.0],
  [85.0, 27.0],
  [82.0, 27.5],
  [80.0, 28.2],
];

/** Die Khanate Chiwa, Buchara und Kokand — bis in die 1870er selbständig. */
const KHANATE = [
  [58.5, 42.5],
  [62.0, 43.0],
  [66.0, 43.0],
  [70.0, 42.0],
  [72.0, 40.5],
  [70.0, 38.5],
  [67.0, 37.5],
  [64.0, 38.0],
  [61.0, 38.5],
  [58.5, 40.0],
];

/** Das Russische Reich 1815 — die Steppe im Süden ist noch nicht erobert. */
const RUSSLAND_1815 = verbinde(
  [
    [21.05, 55.7],
    [22.8, 54.4],
    [23.0, 53.9],
    [20.3, 53.0],
    [19.3, 53.1],
    [18.3, 53.2],
    [18.0, 52.3],
    [17.9, 51.4],
    [18.6, 50.5],
    [19.9, 50.05],
    [22.5, 49.3],
    [25.0, 48.5],
    [26.3, 48.2],
    [28.0, 46.5],
    [28.5, 45.5],
    [29.7, 45.3],
  ],
  kueste(SCHWARZES_MEER, [29.7, 45.3], [41.5, 41.5]),
  [
    [44.0, 41.5],
    [46.5, 41.5],
    [48.6, 41.5],
  ],
  kueste(KASPISCHES_MEER, [49.0, 40.0], [51.3, 47.1]),
  [
    [55.0, 48.0],
    [62.0, 50.0],
    [70.0, 50.5],
    [80.0, 50.5],
    [90.0, 50.5],
    [98.0, 51.0],
    [98.0, 62.0],
    [21.0, 62.0],
    [21.0, 56.5],
  ],
);

/**
 * Das Russische Reich nach der Eroberung Zentralasiens (1865–1885).
 *
 * Es gehört auf diese Karte, weil das „Große Spiel" um Zentralasien und
 * Afghanistan derselbe Vorgang ist wie der Wettlauf um Afrika, nur zu Land:
 * Zwei Reiche schieben ihre Grenzen aufeinander zu, bis ein Pufferstaat
 * dazwischen bleibt.
 */
const RUSSLAND_1885 = verbinde(
  [
    [21.05, 55.7],
    [22.8, 54.4],
    [23.0, 53.9],
    [20.3, 53.0],
    [19.3, 53.1],
    [18.3, 53.2],
    [18.0, 52.3],
    [17.9, 51.4],
    [18.6, 50.5],
    [19.9, 50.05],
    [22.5, 49.3],
    [25.0, 48.5],
    [26.3, 48.2],
    [28.0, 46.5],
    [28.5, 45.5],
    [29.7, 45.3],
  ],
  kueste(SCHWARZES_MEER, [29.7, 45.3], [41.5, 41.5]),
  [
    [44.0, 39.7],
    [45.5, 39.2],
    [47.5, 39.5],
    [48.6, 38.5],
  ],
  kueste(KASPISCHES_MEER, [48.6, 38.5], [51.3, 47.1]),
  [
    [52.5, 41.7],
    [53.9, 39.7],
    [54.0, 37.5],
    [58.0, 37.7],
    [61.0, 36.0],
    [65.0, 37.2],
    [68.0, 37.0],
    [71.0, 36.9],
    [74.5, 37.2],
    [76.0, 41.0],
    [80.0, 45.0],
    [83.0, 47.0],
    [87.0, 49.0],
    [90.0, 50.0],
    [98.0, 51.0],
    [98.0, 62.0],
    [21.0, 62.0],
    [21.0, 56.5],
  ],
);

// ---------------------------------------------------------------------------
// Afrika 1815: Staaten und die ersten Küstenpunkte Europas
// ---------------------------------------------------------------------------

/** Das Sultanat Marokko — das einzige Land Nordafrikas außerhalb des Sultans. */
const MAROKKO = verbinde(
  kueste(WESTAFRIKA, [-12.9, 27.95], [-5.8, 35.79]),
  kueste(NORDAFRIKA, [-5.8, 35.79], [-1.9, 35.1]),
  [
    [-1.5, 33.5],
    [-3.0, 31.5],
    [-5.0, 29.5],
    [-8.0, 28.5],
    [-11.0, 27.8],
  ],
);

/** Die osmanischen Regentschaften Algier, Tunis und Tripolis. */
const REGENTSCHAFTEN_1815 = verbinde(
  kueste(NORDAFRIKA, [-1.9, 35.1], [25.15, 31.55]),
  [
    [24.0, 29.5],
    [20.0, 29.0],
    [15.0, 29.5],
    [10.0, 31.0],
    [8.0, 32.0],
    [5.0, 32.5],
    [0.0, 32.5],
    [-1.5, 33.5],
  ],
);

/** Ägypten unter Muhammad Ali — formal osmanisch, tatsächlich eigenständig. */
const AEGYPTEN_1815 = verbinde(
  kueste(NORDAFRIKA, [25.15, 31.55], [32.55, 29.97]),
  kueste(ROTES_MEER_WEST, [32.55, 29.97], [35.48, 23.95]),
  [
    [33.5, 22.0],
    [29.0, 22.0],
    [25.0, 22.0],
    [25.0, 26.0],
    [25.5, 29.0],
  ],
);

/** Ägypten mit dem Sinai — die Form, die es 1885 und 1914 hatte. */
const AEGYPTEN_SPAETER = verbinde(
  kueste(NORDAFRIKA, [25.15, 31.55], [32.3, 31.25]),
  kueste(MITTELMEER_NORD, [32.35, 31.25], [34.0, 31.3]),
  [
    [34.25, 31.2], // Rafah
    [35.0, 29.55], // Akaba
    [34.85, 29.3],
    [34.6, 28.5],
    [34.25, 27.72], // Ras Muhammad
    [33.6, 27.9],
    [33.2, 28.5],
    [32.55, 29.97],
  ],
  kueste(ROTES_MEER_WEST, [32.55, 29.97], [36.3, 22.5]),
  [
    [33.5, 22.0],
    [29.0, 22.0],
    [25.0, 22.0],
    [25.0, 26.0],
    [25.5, 29.0],
  ],
);

/** Das Kaiserreich Abessinien um 1815 — das Hochland. */
const ABESSINIEN_1815 = [
  [36.0, 14.5],
  [38.0, 15.0],
  [39.5, 14.5],
  [40.5, 13.0],
  [41.0, 11.5],
  [41.5, 9.5],
  [41.0, 8.0],
  [39.5, 6.5],
  [37.5, 7.0],
  [36.0, 8.5],
  [35.5, 10.5],
  [35.5, 12.5],
];

/** Abessinien nach den Eroberungen Meneliks II. — die Form von 1914. */
const ABESSINIEN_1914 = [
  [36.0, 14.5],
  [38.0, 15.0],
  [39.5, 14.5],
  [40.5, 13.0],
  [42.0, 11.5],
  [43.0, 9.5],
  [44.5, 8.5],
  [45.0, 6.5],
  [42.5, 4.5],
  [39.5, 3.5],
  [37.0, 4.5],
  [35.5, 5.5],
  [34.5, 7.5],
  [34.5, 9.5],
  [35.0, 11.5],
  [36.0, 12.5],
];

/** Das Sokoto-Kalifat — 1804 gegründet, einer der größten Staaten Afrikas. */
const SOKOTO = [
  [3.5, 13.8],
  [6.0, 14.0],
  [8.0, 14.0],
  [10.0, 13.5],
  [12.0, 13.0],
  [13.0, 12.0],
  [12.5, 10.5],
  [11.0, 9.5],
  [8.5, 9.0],
  [6.0, 9.5],
  [4.0, 10.5],
  [3.2, 12.0],
];

/** Das Reich von Bornu am Tschadsee — über achthundert Jahre alt. */
const BORNU = [
  [12.5, 14.5],
  [14.0, 14.5],
  [15.5, 13.5],
  [16.0, 12.0],
  [15.0, 11.0],
  [13.5, 11.0],
  [12.8, 12.5],
];

/** Das Aschanti-Reich — Gold, Verwaltung, ein eigenes Straßennetz. */
const ASCHANTI = [
  [-3.3, 5.5],
  [-2.0, 6.0],
  [-0.8, 6.5],
  [-0.5, 7.8],
  [-1.5, 8.5],
  [-3.0, 8.0],
  [-3.5, 6.8],
];

/** Das Königreich Dahomey. */
const DAHOMEY = [
  [1.6, 6.3],
  [2.5, 6.5],
  [2.7, 8.0],
  [1.8, 9.0],
  [1.3, 8.0],
  [1.2, 6.6],
];

/** Das Reich Samori Tourés (Wassoulou) — Widerstand bis 1898. */
const WASSOULOU = [
  [-10.0, 10.0],
  [-8.0, 11.5],
  [-6.0, 11.5],
  [-5.5, 10.0],
  [-7.0, 8.5],
  [-9.0, 9.0],
];

/** Das Königreich Buganda am Victoriasee. */
const BUGANDA = [
  [31.5, 0.5],
  [32.8, 0.6],
  [33.0, -0.5],
  [32.3, -1.0],
  [31.4, -0.6],
];

/** Das Königreich Merina — von den Hochebenen Madagaskars aus im Aufstieg. */
const MERINA = [
  [46.0, -18.0],
  [47.5, -17.5],
  [48.3, -19.0],
  [47.8, -21.0],
  [46.5, -22.0],
  [45.5, -20.5],
  [45.5, -19.0],
];

/** Das Sultanat Oman — Herr über den Handel des westlichen Indischen Ozeans. */
const OMAN = verbinde(
  kueste(ARABIEN_SUED, [54.0, 17.0], [56.4, 26.4]),
  [
    [56.0, 24.5],
    [55.0, 22.5],
    [54.0, 19.0],
    [53.5, 17.5],
  ],
);

/**
 * Der Küstenstreifen des Sultans von Sansibar.
 *
 * Er war in Wirklichkeit schmal — vielerorts nur wenige Kilometer tief. Hier
 * ist er breiter gezeichnet, weil er sonst schmaler wäre als die Linie, die
 * ihn umrandet. Der Hinweis der Phase sagt das.
 */
const SANSIBAR_KUESTE = verbinde(
  kueste(OSTAFRIKA, [45.34, 2.04], [40.6, -10.68]),
  [
    [39.6, -10.4],
    [38.6, -8.0],
    [38.0, -6.5],
    [38.4, -4.5],
    [39.9, -2.2],
    [41.6, 0.5],
    [43.9, 1.6],
  ],
);

/** Die Kapkolonie 1815 — seit 1806 britisch, bis an den Großen Fischfluss. */
const KAPKOLONIE_1815 = verbinde(
  kueste(OSTAFRIKA, [27.9, -33.02], [18.42, -33.93]),
  [
    [18.5, -32.5],
    [19.5, -31.8],
    [22.0, -31.5],
    [24.5, -32.0],
    [26.5, -32.3],
  ],
);

/** Die Kapkolonie 1885 — bis zum Oranje und über den Kei hinaus. */
const KAPKOLONIE_1885 = verbinde(
  kueste(OSTAFRIKA, [30.0, -31.0], [18.42, -33.93]),
  kueste(WESTAFRIKA, [18.42, -33.93], [16.45, -28.6]),
  [
    [19.5, -28.5],
    [22.0, -28.5],
    [24.7, -28.5],
    [25.0, -29.5],
    [27.0, -30.5],
    [29.0, -30.0],
    [29.3, -30.9],
  ],
);

/** Sierra Leone — 1787 als Siedlung für befreite Sklaven gegründet. */
const SIERRA_LEONE_KUESTE = verbinde(
  kueste(WESTAFRIKA, [-12.5, 8.0], [-13.3, 9.1]),
  [
    [-12.2, 8.8],
    [-11.9, 8.3],
  ],
);

/** Sierra Leone 1914 — Kolonie und Protektorat. */
const SIERRA_LEONE_1914 = verbinde(
  kueste(WESTAFRIKA, [-12.5, 8.0], [-13.3, 9.1]),
  [
    [-12.9, 9.9],
    [-11.0, 10.0],
    [-10.3, 9.0],
    [-11.0, 8.3],
  ],
);

/** Gambia — ein Streifen links und rechts des Flusses. */
const GAMBIA = [
  [-16.8, 13.6],
  [-15.0, 13.7],
  [-13.9, 13.5],
  [-13.9, 13.15],
  [-15.0, 13.2],
  [-16.7, 13.2],
];

/** Die französischen Posten an der Senegalmündung — Saint-Louis und Gorée. */
const SENEGAL_POSTEN_1815 = [
  [-16.7, 16.3],
  [-16.1, 16.1],
  [-16.2, 15.4],
  [-16.8, 15.6],
];

/** Die portugiesischen Küstengebiete in Angola. */
const ANGOLA_1815 = verbinde(
  kueste(WESTAFRIKA, [13.4, -12.58], [13.23, -8.81]),
  [
    [15.0, -9.5],
    [15.5, -11.0],
    [14.8, -12.8],
  ],
);

/** Die portugiesischen Küstengebiete in Mosambik. */
const MOSAMBIK_1815 = verbinde(
  kueste(OSTAFRIKA, [40.6, -10.68], [32.58, -25.97]),
  [
    [33.0, -25.0],
    [33.5, -22.0],
    [34.0, -19.5],
    [35.5, -17.5],
    [37.5, -15.0],
    [39.0, -12.0],
    [40.0, -10.9],
  ],
);

// ---------------------------------------------------------------------------
// Indien 1815: die Company, das Sikh-Reich, die Marathen
// ---------------------------------------------------------------------------

/** Bengalen und die Gangesebene — das Kerngebiet der East India Company. */
const EIC_BENGALEN = verbinde(
  kueste(INDIEN_OST, [86.0, 20.3], [91.8, 22.35]),
  [
    [92.0, 24.5],
    [90.0, 25.5],
    [88.0, 26.3],
    [85.0, 26.5],
    [82.0, 27.0],
    [79.5, 28.5],
    [77.2, 28.6], // Delhi, seit 1803 unter Aufsicht der Company
    [76.5, 27.5],
    [77.5, 26.0],
    [79.0, 25.0],
    [81.0, 24.5],
    [83.0, 23.5],
    [84.5, 22.5],
    [86.0, 21.5],
  ],
);

/** Die Präsidentschaft Madras. */
const EIC_MADRAS = verbinde(
  kueste(INDIEN_OST, [77.5, 8.08], [86.0, 20.3]),
  [
    [84.0, 19.0],
    [81.0, 18.0],
    [79.0, 16.0],
    [77.5, 14.0],
    [76.5, 12.0],
    [76.5, 10.0],
    [77.0, 8.5],
  ],
);

/** Die Präsidentschaft Bombay. */
const EIC_BOMBAY = verbinde(
  kueste(MAKRAN_INDIEN_WEST, [72.83, 18.94], [73.8, 15.5]),
  [
    [74.5, 16.0],
    [74.5, 18.5],
    [73.6, 19.5],
  ],
);

/** Das Sikh-Reich Ranjit Singhs im Pandschab. */
const SIKH_REICH = [
  [71.0, 32.0],
  [74.0, 33.5],
  [76.5, 34.5],
  [78.0, 33.0],
  [76.5, 31.0],
  [75.0, 30.0],
  [73.0, 30.0],
  [71.5, 31.0],
];

/** Die Fürstentümer der Marathen in Zentralindien. */
const MARATHEN = [
  [73.0, 19.5],
  [76.0, 21.0],
  [79.0, 22.0],
  [80.0, 24.0],
  [78.0, 25.5],
  [75.5, 24.0],
  [73.5, 22.0],
];

// ---------------------------------------------------------------------------
// Britisch-Indien 1885 und 1914
// ---------------------------------------------------------------------------

/** Der Subkontinent unter britischer Verwaltung — Provinzen und Fürstenstaaten. */
const BRITISCH_INDIEN = verbinde(
  kueste(MAKRAN_INDIEN_WEST, [61.6, 25.2], [77.5, 8.08]),
  kueste(INDIEN_OST, [77.5, 8.08], [91.8, 22.35]),
  [
    [92.5, 24.0],
    [92.0, 26.0],
    [90.0, 26.8],
    [88.0, 27.2],
    [85.0, 27.5],
    [82.0, 28.5],
    [80.0, 29.5],
    [78.0, 31.5],
    [76.0, 33.5],
    [74.0, 34.8],
    [73.0, 34.0],
    [71.5, 33.0],
    [70.0, 32.0],
    [69.3, 31.5],
    [66.5, 29.5],
    [62.0, 29.5],
    [61.5, 27.0],
  ],
);

/** Unterbirma — seit 1852 britisch; Oberbirma kommt erst Anfang 1886 dazu. */
const UNTERBIRMA = verbinde(
  kueste(INDIEN_OST, [92.3, 21.5], [97.6, 15.5]),
  [
    [97.0, 18.0],
    [95.0, 20.0],
    [93.5, 21.0],
  ],
);

/** Birma 1914 — ganz, und als Provinz Britisch-Indiens verwaltet. */
const BIRMA_1914 = verbinde(
  kueste(INDIEN_OST, [92.3, 21.5], [97.6, 15.5]),
  [
    [98.0, 16.5],
    [98.5, 19.0],
    [97.5, 21.5],
    [98.0, 24.0],
    [96.0, 25.5],
    [97.0, 27.5],
    [95.0, 27.0],
    [93.5, 25.0],
    [93.0, 23.5],
    [92.3, 22.5],
  ],
);

// ---------------------------------------------------------------------------
// Afrika 1885: der Wettlauf hat begonnen
// ---------------------------------------------------------------------------

const ALGERIEN_1885 = verbinde(
  kueste(NORDAFRIKA, [-1.9, 35.1], [8.65, 37.2]),
  [
    [8.3, 34.5],
    [7.5, 33.5],
    [8.0, 32.5],
    [6.0, 31.0],
    [3.0, 30.0],
    [0.0, 29.5],
    [-2.0, 31.0],
    [-2.0, 33.5],
    [-1.5, 34.5],
  ],
);

const ALGERIEN_1914 = verbinde(
  kueste(NORDAFRIKA, [-1.9, 35.1], [8.65, 37.2]),
  [
    [8.3, 34.5],
    [7.5, 33.5],
    [8.5, 32.5],
    [10.0, 30.0],
    [11.5, 27.0],
    [10.0, 24.0],
    [6.0, 21.5],
    [3.0, 20.0],
    [0.0, 20.0],
    [-4.5, 22.5],
    [-8.7, 27.6],
    [-8.7, 29.0],
    [-2.0, 32.0],
    [-1.5, 34.5],
  ],
);

const TUNESIEN = verbinde(
  kueste(NORDAFRIKA, [8.65, 37.2], [11.5, 33.2]),
  [
    [10.5, 33.0],
    [9.5, 32.0],
    [8.3, 32.5],
    [8.3, 34.5],
    [8.6, 36.5],
  ],
);

const LIBYEN_1912 = verbinde(
  kueste(NORDAFRIKA, [11.5, 33.2], [25.15, 31.55]),
  [
    [24.5, 29.5],
    [24.0, 22.0],
    [19.0, 21.0],
    [15.0, 23.0],
    [13.0, 25.5],
    [11.0, 29.0],
    [10.5, 32.0],
  ],
);

/** Der Mahdi-Staat im Sudan — 1885 fiel Khartum, der Staat hielt bis 1898. */
const MAHDI_STAAT = [
  [36.5, 17.5],
  [35.0, 14.0],
  [34.0, 11.5],
  [32.0, 10.0],
  [28.0, 10.5],
  [24.0, 12.0],
  [23.5, 15.0],
  [25.0, 19.0],
  [30.0, 20.0],
  [34.0, 19.0],
];

/** Der Anglo-Ägyptische Sudan — seit 1899 gemeinsam verwaltet. */
const SUDAN_1914 = verbinde(
  kueste(ROTES_MEER_WEST, [36.3, 22.5], [38.2, 17.9]),
  [
    [37.0, 17.0],
    [36.5, 15.0],
    [35.0, 13.0],
    [34.5, 11.0],
    [33.9, 9.5],
    [33.0, 8.5],
    [33.0, 5.0],
    [30.0, 4.5],
    [28.0, 5.0],
    [25.0, 6.0],
    [23.5, 9.0],
    [23.0, 11.0],
    [22.5, 14.0],
    [24.0, 16.0],
    [24.0, 20.0],
    [25.0, 22.0],
    [33.5, 22.0],
  ],
);

/** Deutsch-Südwestafrika 1885 — der Küstenstreifen um Lüderitz. */
const DSW_1885 = verbinde(
  kueste(WESTAFRIKA, [16.45, -28.6], [14.5, -22.95]),
  [
    [16.5, -22.5],
    [17.5, -25.5],
    [17.0, -28.3],
  ],
);

/** Deutsch-Südwestafrika 1914 — Walfischbai blieb britisch. */
const DSW_1914 = verbinde(
  kueste(WESTAFRIKA, [16.45, -28.6], [11.75, -17.25]),
  [
    [12.5, -17.5],
    [14.0, -17.5],
    [18.0, -17.5],
    [21.0, -18.0],
    [21.0, -22.0],
    [20.0, -22.0],
    [20.0, -24.8],
    [19.5, -28.5],
  ],
);

const TOGO = verbinde(
  kueste(WESTAFRIKA, [1.22, 6.13], [0.0, 5.7]),
  [
    [0.5, 8.0],
    [0.7, 10.0],
    [1.4, 11.0],
    [1.6, 9.0],
    [1.7, 7.0],
    [1.5, 6.3],
  ],
);

const KAMERUN_1885 = verbinde(
  kueste(WESTAFRIKA, [8.8, 4.5], [9.4, 2.9]),
  [
    [11.0, 2.5],
    [11.5, 4.5],
    [10.0, 5.5],
  ],
);

/** Kamerun 1914 — mit „Neukamerun", das 1911 aus dem Marokko-Handel kam. */
const KAMERUN_1914 = verbinde(
  kueste(WESTAFRIKA, [8.8, 4.5], [9.4, 2.9]),
  [
    [11.5, 2.2],
    [13.5, 2.3],
    [16.0, 2.2],
    [16.0, 3.5],
    [15.0, 5.0],
    [15.5, 7.5],
    [14.5, 9.5],
    [14.6, 12.9],
    [13.5, 12.5],
    [12.5, 9.5],
    [11.5, 7.0],
    [10.5, 6.5],
    [9.0, 5.5],
  ],
);

/** Deutsch-Ostafrika 1885 — die Verträge Carl Peters', noch ohne die Küste. */
const DOA_1885 = [
  [38.8, -6.4],
  [37.5, -6.0],
  [36.5, -6.5],
  [36.0, -7.5],
  [37.0, -8.5],
  [38.5, -8.5],
  [39.0, -7.5],
];

const DOA_1914 = verbinde(
  kueste(OSTAFRIKA, [39.2, -4.7], [40.6, -10.68]),
  [
    [39.5, -10.9],
    [37.5, -11.5],
    [35.3, -11.4],
    [34.6, -9.5],
    [32.9, -9.4],
    [30.8, -8.4],
    [30.0, -6.5],
    [29.6, -6.0],
    [29.2, -4.5],
    [29.4, -3.3],
    [30.5, -2.4],
    [30.8, -1.0],
    [33.9, -1.0],
    [35.0, -1.7],
    [37.6, -3.0],
  ],
);

/** Der Kongo — die Grenzen, die 1884/85 in Berlin bestätigt wurden. */
const KONGOBECKEN = verbinde(
  kueste(WESTAFRIKA, [12.35, -6.0], [12.0, -5.0]),
  [
    [13.0, -5.0],
    [14.5, -4.8],
    [16.2, -3.3],
    [17.0, -1.0],
    [18.0, 1.0],
    [17.5, 3.0],
    [19.0, 4.5],
    [22.0, 4.5],
    [25.5, 5.0],
    [27.5, 3.5],
    [29.5, 1.5],
    [29.7, 0.5],
    [29.6, -1.4],
    [29.2, -3.4],
    [29.6, -6.0],
    [30.0, -6.5],
    [30.8, -8.4],
    [28.9, -8.5],
    [28.4, -11.5], // der Katanga-Zipfel mit seinem Kupfer
    [29.5, -13.3],
    [27.0, -12.0],
    [25.0, -11.5],
    [22.5, -11.0],
    [22.0, -9.0],
    [20.0, -7.5],
    [17.5, -8.1],
    [16.5, -7.0],
    [13.5, -6.1],
  ],
);

const FRANZ_KONGO_1885 = verbinde(
  kueste(WESTAFRIKA, [11.85, -4.78], [9.4, 2.9]),
  [
    [11.5, 2.2],
    [13.5, 2.3],
    [16.0, 2.2],
    [17.5, 3.0],
    [18.0, 1.0],
    [17.0, -1.0],
    [16.2, -3.3],
    [15.3, -4.3], // der Stanley Pool, gegenüber von Léopoldville
    [13.0, -4.5],
  ],
);

/** Französisch-Äquatorialafrika 1910 — Gabun, Kongo, Ubangi-Schari, Tschad. */
const AEF_1914 = verbinde(
  kueste(WESTAFRIKA, [11.85, -4.78], [9.4, 2.9]),
  [
    [11.5, 2.2],
    [16.0, 2.2],
    [18.0, 4.5],
    [22.0, 5.0],
    [23.5, 8.0],
    [23.0, 11.0],
    [22.0, 15.0],
    [19.0, 17.0],
    [16.0, 20.0],
    [14.5, 20.0],
    [14.0, 16.0],
    [14.6, 12.9],
    [14.0, 11.5],
    [15.5, 8.0],
    [16.0, 4.0],
    [17.5, 3.0],
    [18.0, 1.0],
    [17.0, -1.0],
    [16.2, -3.3],
    [15.3, -4.3],
    [13.0, -4.5],
  ],
);

/** Französisch-Westafrika 1904 — acht Gebiete unter einem Generalgouverneur. */
const AOF_1914 = verbinde(
  kueste(WESTAFRIKA, [-17.05, 20.77], [-13.7, 9.5]),
  [
    [-12.9, 9.9],
    [-11.0, 10.0],
    [-10.3, 9.0],
    [-11.5, 8.5],
    [-8.5, 7.5],
    [-7.5, 5.5], // um Sierra Leone und Liberia herum
  ],
  kueste(WESTAFRIKA, [-7.72, 4.37], [-3.2, 4.9]),
  [
    [-2.9, 6.5],
    [-2.9, 11.0],
    [0.5, 11.0],
    [0.7, 10.0],
    [0.5, 8.0], // um die Goldküste und Togo herum
  ],
  kueste(WESTAFRIKA, [1.22, 6.13], [2.43, 6.35]),
  [
    [2.7, 9.5],
    [3.6, 11.9],
    [4.0, 13.5],
    [9.0, 13.0],
    [13.0, 13.6],
    [14.0, 13.2],
    [14.5, 15.0],
    [15.0, 20.0],
    [12.0, 23.0],
    [6.0, 21.5],
    [3.0, 20.0],
    [0.0, 20.0],
    [-4.5, 22.5],
    [-8.7, 27.6],
    [-8.7, 21.4],
    [-13.0, 21.0],
    [-16.0, 21.0],
  ],
);

const SENEGAL_1885 = verbinde(
  kueste(WESTAFRIKA, [-17.05, 20.77], [-13.7, 9.5]),
  [
    [-12.0, 10.5],
    [-10.5, 13.0],
    [-9.0, 15.0],
    [-11.0, 16.5],
    [-13.0, 18.0],
    [-15.0, 19.5],
  ],
);

const GOLDKUESTE_1885 = verbinde(
  kueste(WESTAFRIKA, [0.0, 5.7], [-3.2, 4.9]),
  [
    [-3.0, 6.3],
    [-0.6, 6.3],
    [0.4, 6.2],
  ],
);

const GOLDKUESTE_1914 = verbinde(
  kueste(WESTAFRIKA, [0.0, 5.7], [-3.2, 4.9]),
  [
    [-3.0, 6.5],
    [-2.9, 11.0],
    [0.5, 11.0],
    [0.6, 8.0],
    [0.7, 6.2],
  ],
);

const LAGOS_1885 = [
  [2.7, 6.3],
  [4.6, 6.2],
  [4.6, 7.0],
  [2.7, 7.0],
];

const NIGERIA_1914 = verbinde(
  kueste(WESTAFRIKA, [2.43, 6.35], [8.8, 4.5]),
  [
    [9.5, 6.5],
    [11.5, 7.0],
    [12.5, 9.5],
    [13.5, 12.5],
    [14.0, 13.2],
    [13.0, 13.6],
    [11.0, 13.4],
    [9.0, 13.0],
    [6.0, 13.5],
    [4.0, 13.5],
    [3.6, 11.9],
    [2.7, 9.5],
  ],
);

/** Liberia — 1847 als Republik gegründet, nie kolonisiert. */
const LIBERIA = verbinde(
  kueste(WESTAFRIKA, [-7.72, 4.37], [-11.8, 7.4]),
  [
    [-11.5, 8.4],
    [-10.0, 8.5],
    [-8.5, 7.5],
    [-7.5, 5.5],
  ],
);

const PORTUGIESISCH_GUINEA = verbinde(
  kueste(WESTAFRIKA, [-15.0, 10.9], [-16.7, 12.35]),
  [
    [-13.7, 12.4],
    [-13.7, 11.0],
    [-14.4, 10.4],
  ],
);

const RIO_DE_ORO = verbinde(
  kueste(WESTAFRIKA, [-17.05, 20.77], [-12.9, 27.95]),
  [
    [-12.0, 27.7],
    [-8.7, 27.6],
    [-8.7, 21.4],
    [-13.0, 21.0],
    [-16.0, 21.0],
  ],
);

const SPANISCH_MAROKKO = [
  [-5.9, 35.8],
  [-3.0, 35.3],
  [-2.5, 35.1],
  [-4.0, 34.8],
  [-5.4, 35.2],
];

const SPANISCH_GUINEA = [
  [9.35, 1.0],
  [11.3, 1.0],
  [11.3, 2.2],
  [9.7, 2.2],
];

const MADAGASKAR_FRANZOESISCH = MADAGASKAR;

const DSCHIBUTI = verbinde(
  kueste(ROTES_MEER_WEST, [42.73, 13.0], [43.15, 11.6]),
  [
    [42.4, 11.0],
    [41.8, 11.6],
    [42.4, 12.7],
  ],
);

/** Assab und Massaua — die ersten italienischen Stützpunkte am Roten Meer. */
const ASSAB_MASSAUA = [
  [39.3, 15.8],
  [40.0, 15.2],
  [42.9, 13.1],
  [42.6, 12.8],
  [39.9, 14.9],
  [39.2, 15.4],
];

const ERITREA = verbinde(
  kueste(ROTES_MEER_WEST, [38.2, 17.9], [42.73, 13.0]),
  [
    [42.0, 13.0],
    [39.5, 14.5],
    [38.0, 15.0],
    [36.6, 17.0],
  ],
);

const ITALIENISCH_SOMALILAND = verbinde(
  kueste(OSTAFRIKA, [51.4, 10.44], [42.55, -0.36]),
  [
    [41.8, 0.0],
    [41.0, 3.9],
    [43.0, 4.5],
    [47.0, 8.0],
    [48.5, 9.0],
    [49.5, 9.5],
    [50.8, 9.0],
  ],
);

const BRITISCH_SOMALILAND = verbinde(
  kueste(OSTAFRIKA, [43.15, 11.6], [48.5, 11.3]),
  [
    [48.0, 9.5],
    [45.0, 8.5],
    [43.5, 9.5],
    [42.9, 10.9],
  ],
);

const BRITISCH_OSTAFRIKA = verbinde(
  kueste(OSTAFRIKA, [42.55, -0.36], [39.2, -4.7]),
  [
    [37.6, -3.0],
    [35.0, -1.7],
    [33.9, -1.0],
    [30.8, -1.0],
    [29.6, -1.4],
    [29.7, 0.5],
    [30.8, 3.5],
    [33.0, 4.5],
    [35.0, 4.5],
    [36.0, 4.4],
    [38.0, 3.5],
    [41.0, 3.9],
    [41.0, 1.0],
  ],
);

const ANGOLA_1914 = verbinde(
  kueste(WESTAFRIKA, [11.75, -17.25], [12.35, -6.0]),
  [
    [13.5, -6.1],
    [16.5, -7.0],
    [19.0, -8.0],
    [21.8, -8.0],
    [24.0, -11.0],
    [22.0, -16.5],
    [21.0, -18.0],
    [12.5, -17.4],
  ],
);

const MOSAMBIK_1914 = verbinde(
  kueste(OSTAFRIKA, [40.6, -10.68], [32.58, -25.97]),
  [
    [32.0, -26.0],
    [31.9, -24.0],
    [32.5, -21.5],
    [31.3, -19.0],
    [32.7, -16.5],
    [30.2, -14.9],
    [33.0, -14.0],
    [35.3, -12.5],
    [36.5, -11.7],
    [37.5, -11.5],
    [39.5, -10.9],
  ],
);

const TRANSVAAL = [
  [25.8, -25.7],
  [29.0, -22.2],
  [31.0, -22.3],
  [30.5, -25.0],
  [29.3, -26.5],
  [26.9, -26.9],
  [25.0, -26.0],
];

const ORANJE_FREISTAAT = [
  [24.7, -28.5],
  [26.0, -27.5],
  [27.0, -27.0],
  [29.4, -28.5],
  [29.0, -30.0],
  [27.0, -30.5],
  [25.0, -29.5],
];

const NATAL_1885 = verbinde(
  kueste(OSTAFRIKA, [30.0, -31.0], [31.9, -28.5]),
  [
    [30.5, -27.5],
    [29.4, -28.5],
    [29.3, -30.9],
  ],
);

const ZULULAND_1885 = [
  [31.9, -28.5],
  [32.4, -27.0],
  [32.0, -26.4],
  [31.0, -27.0],
  [30.8, -28.0],
];

/** Das Reich der Ndebele in Matabeleland — bis 1893 selbständig. */
const NDEBELE = [
  [27.0, -18.0],
  [29.5, -18.5],
  [30.0, -20.5],
  [28.5, -21.5],
  [26.5, -20.5],
];

/** Barotseland am oberen Sambesi — das Reich der Lozi. */
const BAROTSELAND = [
  [22.0, -14.0],
  [24.5, -13.5],
  [25.5, -15.5],
  [24.0, -17.5],
  [22.5, -16.5],
];

/**
 * Der britische Block im Süden 1914 — Südafrikanische Union, Betschuanaland,
 * Nord- und Südrhodesien in einem Stück.
 */
const BRITISCH_SUEDAFRIKA_1914 = verbinde(
  kueste(OSTAFRIKA, [32.4, -27.0], [18.42, -33.93]),
  kueste(WESTAFRIKA, [18.42, -33.93], [16.45, -28.6]),
  [
    [19.5, -28.5],
    [20.0, -24.8],
    [20.0, -22.0],
    [21.0, -18.0],
    [23.5, -17.5],
    [25.3, -17.8], // die Victoriafälle
    [24.0, -13.0],
    [22.0, -11.5],
    [24.0, -11.0],
    [28.5, -12.5],
    [29.5, -13.3],
    [33.0, -14.0],
    [30.2, -14.9],
    [32.7, -16.5],
    [31.3, -19.0],
    [30.2, -22.3],
    [31.0, -22.3],
    [31.9, -24.0],
    [32.0, -26.0],
  ],
);

const NJASSALAND = [
  [33.0, -9.6],
  [34.0, -9.5],
  [34.5, -11.0],
  [35.3, -12.5],
  [35.0, -14.0],
  [34.3, -14.5],
  [33.5, -14.0],
  [33.0, -12.0],
  [32.7, -10.5],
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

/** Ein Binnenmeer oder See — Wasser über dem Land. */
const wasser = (orte) => ({
  art: 'wasser',
  d: geo.pfad(orte),
  fill: KARTENFARBEN.meer,
  stroke: KARTENFARBEN.fluss,
  strokeWidth: 1,
});

/** Ein Fluss — nur Linie, keine Fläche. */
const fluss = (orte) => ({
  art: 'fluss',
  d: geo.pfad(orte, { geschlossen: false }),
  fill: 'none',
  stroke: KARTENFARBEN.fluss,
  strokeWidth: 2,
});

/** Eine Wüste — eine Spur tiefer als das Land, ohne Rand. */
const wueste = (orte) => ({
  art: 'wueste',
  d: geo.pfad(orte),
  fill: KARTENFARBEN.wueste,
  stroke: 'none',
  strokeWidth: 0,
});

/** Der Sueskanal — eine gebaute Linie, deshalb dunkel wie eine Mauer. */
const kanal = () => ({
  art: 'kanal',
  d: geo.pfad(SUESKANAL, { geschlossen: false, rund: false }),
  fill: 'none',
  stroke: KARTENFARBEN.mauer,
  strokeWidth: 2.4,
});

/** Eine Gebietsfläche einer Phase. */
const gebiet = (titel, orte) => ({ titel, d: geo.pfad(orte) });

/**
 * Eine Gebietsfläche aus mehreren getrennten Stücken.
 *
 * Ein Kolonialreich ist selten ein Stück Land: Großbritannien 1914 besteht auf
 * dieser Karte aus vierzehn Umrissen von Gambia bis Sansibar. Sie gehören in
 * eine Fläche mit einem Titel. SVG kann das — mehrere geschlossene Teilpfade
 * in einem `d`.
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
    land(AFRIKA),
    land(EURASIEN),
    land(BRITANNIEN),
    land(IRLAND),
    land(SKANDINAVIEN),
    land(MADAGASKAR),
    land(CEYLON),
    land(SIZILIEN),
    land(SARDINIEN),
    land(KORSIKA),
    land(KRETA),
    land(ZYPERN),
    land(SANSIBAR),
    land(SOKOTRA),
    land(TENERIFFA),
    land(GRAN_CANARIA),
    wueste(SAHARA),
    wueste(ARABISCHE_WUESTE),
    wueste(KALAHARI),
    wueste(NAMIB),
    wueste(THAR),
    wasser(SCHWARZES_MEER),
    wasser(KASPISCHES_MEER),
    wasser(PERSISCHER_GOLF),
    wasser(ARALSEE),
    wasser(VICTORIASEE),
    wasser(TANGANJIKASEE),
    wasser(NJASSASEE),
    wasser(TSCHADSEE),
    fluss(NIL),
    fluss(BLAUER_NIL),
    fluss(KONGO),
    fluss(NIGER),
    fluss(SENEGAL),
    fluss(SAMBESI),
    fluss(ORANJE),
    fluss(LIMPOPO),
    fluss(INDUS),
    fluss(GANGES),
    fluss(EUPHRAT_TIGRIS),
    fluss(DONAU),
    kanal(),
  ],

  phasen: [
    {
      id: 'vor-dem-wettlauf',
      label: '1815',
      hinweis:
        'Afrika vor dem Wettlauf. Europa sitzt an den Küsten — auf ein paar Hafenplätzen, Forts und Inseln, meist dort, wo jahrhundertelang Handel getrieben wurde, auch mit Sklaven. Das Innere des Kontinents kennt in Europa fast niemand: Der Lauf des Niger ist ein Rätsel, die Quelle des Nils ein Streitthema. Eingefärbt sind hier die Kolonialmächte samt ihren Gebieten UND die Staaten Afrikas und Asiens — das Sokoto-Kalifat, Bornu, Aschanti, Dahomey, Abessinien, Buganda, Merina auf Madagaskar, das Sultanat Oman, Marokko. Sie tragen dieselbe Farbe wie die Kolonien, weil die App alle Flächen einer Phase gleich einfärbt; nur die Titel sagen, wer wer ist. Zwei Dinge sind wichtig. Erstens: Leer bleibt, wo sich für 1815 keine Herrschaft mit Grenzen zeichnen ließ — die Sahara, das Kongobecken, die Kalahari. Dort lebten Menschen, aber keine der gezeigten Herrschaften hatte dort eine Grenze. Zweitens: Der Küstenstreifen des Sultans von Sansibar ist hier breiter gezeichnet, als er war, sonst wäre er dünner als die Linie um ihn herum. Die übrigen Staaten Europas bleiben leer; dieses Kapitel handelt von den Kolonialreichen.',
      flaechen: [
        gebietTeile('Das Vereinigte Königreich — dazu die Kapkolonie (seit 1806), Sierra Leone und Gambia', [
          BRITANNIEN,
          IRLAND,
          KAPKOLONIE_1815,
          SIERRA_LEONE_KUESTE,
          GAMBIA,
        ]),
        gebietTeile('Die Gebiete der East India Company — Bengalen, Madras und Bombay', [
          EIC_BENGALEN,
          EIC_MADRAS,
          EIC_BOMBAY,
        ]),
        gebietTeile('Frankreich — dazu die Handelsposten an der Senegalmündung, Saint-Louis und Gorée', [
          FRANKREICH_EUROPA,
          SENEGAL_POSTEN_1815,
        ]),
        gebietTeile('Portugal — dazu die Küstengebiete in Angola und Mosambik', [
          PORTUGAL_EUROPA,
          ANGOLA_1815,
          MOSAMBIK_1815,
        ]),
        gebiet('Spanien', SPANIEN_EUROPA),
        gebiet('Das Sultanat Marokko — unabhängig, mit eigenen Gesandtschaften in Europa', MAROKKO),
        gebiet('Die Regentschaften Algier, Tunis und Tripolis — dem Sultan unterstellt, tatsächlich selbständig', REGENTSCHAFTEN_1815),
        gebiet('Ägypten unter Muhammad Ali — formal osmanisch, tatsächlich ein eigener Staat', AEGYPTEN_1815),
        gebiet('Das Kaiserreich Abessinien', ABESSINIEN_1815),
        gebiet('Das Sokoto-Kalifat — 1804 gegründet, einer der größten Staaten der Welt seiner Zeit', SOKOTO),
        gebiet('Das Reich von Bornu am Tschadsee', BORNU),
        gebiet('Das Aschanti-Reich an der Goldküste — Gold, Verwaltung, eigene Straßen', ASCHANTI),
        gebiet('Das Königreich Dahomey', DAHOMEY),
        gebiet('Das Königreich Buganda am Victoriasee', BUGANDA),
        gebiet('Das Königreich Merina auf Madagaskar', MERINA),
        gebietTeile('Das Sultanat Oman und Sansibar — Herr über den Handel des westlichen Indischen Ozeans', [
          OMAN,
          SANSIBAR_KUESTE,
          SANSIBAR,
        ]),
        gebiet('Das Sikh-Reich unter Ranjit Singh im Pandschab', SIKH_REICH),
        gebiet('Die Fürstentümer der Marathen in Zentralindien', MARATHEN),
        gebiet('Das Königreich Nepal', NEPAL),
        gebiet('Afghanistan', AFGHANISTAN),
        gebiet('Die Khanate Chiwa, Buchara und Kokand', KHANATE),
        gebiet('Das Kadscharen-Reich Persien', PERSIEN),
        gebiet('Das Osmanische Reich', OSMANEN_1815),
        gebiet('Das Russische Reich', RUSSLAND_1815),
      ],
    },
    {
      id: 'kongokonferenz',
      label: '1885',
      hinweis:
        'Das Jahr, in dem in Berlin die Kongokonferenz zu Ende ging. Sie hat Afrika nicht auf einer Landkarte verteilt — das ist eine verbreitete Verkürzung —, aber sie hat die Regeln festgelegt, nach denen verteilt wurde: Wer ein Gebiet beansprucht, muss es besetzen und den anderen Mächten Bescheid geben. Danach ging alles sehr schnell. Auf dieser Phase sieht man den Anfang: Algerien und Tunesien französisch, Ägypten seit 1882 britisch besetzt, im Süden die Kapkolonie und Natal neben den Burenrepubliken, 1884/85 die ersten deutschen Schutzgebiete, und in der Mitte eine Fläche, die es so nur einmal gab — der Kongo-Freistaat, Privatbesitz des belgischen Königs Leopold II., nicht Besitz Belgiens. Zugleich stehen große afrikanische Staaten noch auf der Karte: Abessinien, das Sokoto-Kalifat, Aschanti, Dahomey, das Reich Samori Tourés, der Mahdi-Staat im Sudan, der 1885 Khartum nahm, Madagaskar, Sansibar. Am Tisch in Berlin saß von ihnen niemand.',
      flaechen: [
        gebietTeile('Das Vereinigte Königreich — dazu die Kapkolonie, Natal, die Goldküste, Lagos, Sierra Leone, Gambia und Britisch-Somaliland', [
          BRITANNIEN,
          IRLAND,
          KAPKOLONIE_1885,
          NATAL_1885,
          GOLDKUESTE_1885,
          LAGOS_1885,
          SIERRA_LEONE_KUESTE,
          GAMBIA,
          BRITISCH_SOMALILAND,
        ]),
        gebietTeile('Britisch-Indien — seit 1858 Kronkolonie, dazu Unterbirma und Ceylon', [
          BRITISCH_INDIEN,
          UNTERBIRMA,
          CEYLON,
        ]),
        gebiet('Ägypten — seit 1882 britisch besetzt, formal noch osmanisch', AEGYPTEN_SPAETER),
        gebietTeile('Frankreich — dazu Algerien, Tunesien (seit 1881), der Senegal, der französische Kongo und Obock am Roten Meer', [
          FRANKREICH_EUROPA,
          ALGERIEN_1885,
          TUNESIEN,
          SENEGAL_1885,
          FRANZ_KONGO_1885,
          DSCHIBUTI,
        ]),
        gebiet('Der Kongo-Freistaat — Privatbesitz des belgischen Königs Leopold II., nicht Besitz Belgiens', KONGOBECKEN),
        gebiet('Das Königreich Belgien', BELGIEN_EUROPA),
        gebietTeile('Das Deutsche Reich — dazu die Schutzgebiete von 1884/85: Südwestafrika, Togo, Kamerun und die Verträge in Ostafrika', [
          DEUTSCHES_REICH_EUROPA,
          DSW_1885,
          TOGO,
          KAMERUN_1885,
          DOA_1885,
        ]),
        gebietTeile('Portugal — dazu Angola, Mosambik und Portugiesisch-Guinea', [
          PORTUGAL_EUROPA,
          ANGOLA_1815,
          MOSAMBIK_1815,
          PORTUGIESISCH_GUINEA,
        ]),
        gebietTeile('Spanien — dazu Río de Oro (seit 1884) und Spanisch-Guinea', [
          SPANIEN_EUROPA,
          RIO_DE_ORO,
          SPANISCH_GUINEA,
        ]),
        gebietTeile('Italien — dazu Assab und Massaua, die ersten Stützpunkte am Roten Meer', [
          ITALIEN_EUROPA,
          SIZILIEN,
          SARDINIEN,
          ASSAB_MASSAUA,
        ]),
        gebiet('Das Sultanat Marokko — noch unabhängig', MAROKKO),
        gebiet('Das Kaiserreich Abessinien', ABESSINIEN_1815),
        gebiet('Der Mahdi-Staat im Sudan — 1885 fiel Khartum', MAHDI_STAAT),
        gebiet('Das Sokoto-Kalifat', SOKOTO),
        gebiet('Das Reich von Bornu', BORNU),
        gebiet('Das Aschanti-Reich', ASCHANTI),
        gebiet('Das Königreich Dahomey', DAHOMEY),
        gebiet('Das Reich Samori Tourés — Widerstand bis 1898', WASSOULOU),
        gebiet('Liberia — 1847 als Republik gegründet', LIBERIA),
        gebiet('Das Königreich Madagaskar unter der Merina-Dynastie', MADAGASKAR),
        gebietTeile('Das Sultanat Sansibar — die Insel und der Küstenstreifen', [SANSIBAR_KUESTE, SANSIBAR]),
        gebiet('Das Königreich Buganda', BUGANDA),
        gebiet('Das Reich der Ndebele in Matabeleland', NDEBELE),
        gebiet('Barotseland am oberen Sambesi', BAROTSELAND),
        gebiet('Die Südafrikanische Republik (Transvaal)', TRANSVAAL),
        gebiet('Der Oranje-Freistaat', ORANJE_FREISTAAT),
        gebiet('Zululand — 1879 im Krieg mit Britannien, 1887 einverleibt', ZULULAND_1885),
        gebiet('Das Sultanat Oman', OMAN),
        gebiet('Das Königreich Nepal', NEPAL),
        gebiet('Afghanistan — Pufferstaat zwischen zwei Reichen', AFGHANISTAN),
        gebiet('Persien', PERSIEN),
        gebiet('Das Osmanische Reich', OSMANEN_1885),
        gebiet('Das Russische Reich — nach der Eroberung Zentralasiens', RUSSLAND_1885),
      ],
    },
    {
      id: 'aufgeteilt',
      label: '1914',
      hinweis:
        'Neunundzwanzig Jahre später. Von den Staaten, die 1815 und 1885 auf dieser Karte standen, sind in Afrika zwei übrig: das Kaiserreich Abessinien, das 1896 bei Adua ein italienisches Heer schlug, und Liberia. Alles andere ist Kolonie, Protektorat oder besetztes Gebiet. Britannien verwaltet einen Streifen von Kairo bis zum Kap — mit einer Lücke, die Deutsch-Ostafrika heißt. Der Kongo-Freistaat ist 1908 nach jahrelanger internationaler Kritik an den belgischen Staat übergegangen und heißt jetzt Belgisch-Kongo. Zwei Hinweise zum Lesen dieser Phase: Eingefärbt ist beanspruchtes und verwaltetes Gebiet — dass die Verwaltung überall bis ins letzte Dorf reichte, behauptet die Karte nicht. Und die gemeinsame Farbe sagt nichts darüber, wer wem gehört; Abessinien trägt hier denselben Ton wie Belgisch-Kongo. Was man trotzdem sieht, ist die Aussage dieses Kapitels: wie wenig auf diesem Kontinent 1914 noch von den Staaten übrig ist, die 1815 da waren.',
      flaechen: [
        gebietTeile('Das Vereinigte Königreich und seine Gebiete — Ägypten, der Anglo-Ägyptische Sudan, Ostafrika und Uganda, Sansibar, die Südafrikanische Union mit Rhodesien und Betschuanaland, Njassaland, Nigeria, die Goldküste, Sierra Leone, Gambia, Somaliland und Zypern', [
          BRITANNIEN,
          IRLAND,
          AEGYPTEN_SPAETER,
          SUDAN_1914,
          BRITISCH_OSTAFRIKA,
          SANSIBAR,
          BRITISCH_SUEDAFRIKA_1914,
          NJASSALAND,
          NIGERIA_1914,
          GOLDKUESTE_1914,
          SIERRA_LEONE_1914,
          GAMBIA,
          BRITISCH_SOMALILAND,
          ZYPERN,
        ]),
        gebietTeile('Britisch-Indien — das „Juwel der Krone", dazu Birma als Provinz und Ceylon als eigene Kronkolonie', [
          BRITISCH_INDIEN,
          BIRMA_1914,
          CEYLON,
        ]),
        gebietTeile('Frankreich und seine Gebiete — Französisch-Westafrika, Französisch-Äquatorialafrika, Algerien, Tunesien, das Protektorat Marokko (seit 1912), Madagaskar und die Somaliküste', [
          FRANKREICH_EUROPA,
          AOF_1914,
          AEF_1914,
          ALGERIEN_1914,
          TUNESIEN,
          MAROKKO,
          MADAGASKAR_FRANZOESISCH,
          DSCHIBUTI,
        ]),
        gebietTeile('Das Deutsche Reich und seine Kolonien — Deutsch-Ostafrika, Deutsch-Südwestafrika, Kamerun und Togo', [
          DEUTSCHES_REICH_EUROPA,
          DOA_1914,
          DSW_1914,
          KAMERUN_1914,
          TOGO,
        ]),
        gebietTeile('Belgien und Belgisch-Kongo — seit 1908 vom Staat verwaltet, davor Privatbesitz des Königs', [
          BELGIEN_EUROPA,
          KONGOBECKEN,
        ]),
        gebietTeile('Portugal und seine Kolonien — Angola, Mosambik und Portugiesisch-Guinea', [
          PORTUGAL_EUROPA,
          ANGOLA_1914,
          MOSAMBIK_1914,
          PORTUGIESISCH_GUINEA,
        ]),
        gebietTeile('Italien und seine Kolonien — Libyen (seit 1912), Eritrea und Italienisch-Somaliland', [
          ITALIEN_EUROPA,
          SIZILIEN,
          SARDINIEN,
          LIBYEN_1912,
          ERITREA,
          ITALIENISCH_SOMALILAND,
        ]),
        gebietTeile('Spanien und seine Gebiete — Spanisch-Sahara, Spanisch-Marokko und Spanisch-Guinea', [
          SPANIEN_EUROPA,
          RIO_DE_ORO,
          SPANISCH_MAROKKO,
          SPANISCH_GUINEA,
        ]),
        gebiet('Das Kaiserreich Abessinien — 1896 bei Adua siegreich, nie kolonisiert', ABESSINIEN_1914),
        gebiet('Liberia — Republik seit 1847, nie kolonisiert', LIBERIA),
        gebiet('Das Königreich Nepal', NEPAL),
        gebiet('Afghanistan', AFGHANISTAN),
        gebiet('Persien — 1907 zwischen Russland und Britannien in Einflusszonen geteilt', PERSIEN),
        gebiet('Das Osmanische Reich', OSMANEN_1914),
        gebiet('Das Russische Reich', RUSSLAND_1885),
      ],
    },
  ],

  punkte: [
    {
      id: 'london',
      name: 'London',
      typ: 'stadt',
      ...ort(-0.13, 51.51),
      text: [
        'Von hier aus wurde das größte Reich der Geschichte verwaltet: 1914 lebte',
        'rund ein Viertel der Menschheit unter britischer Herrschaft, auf etwa einem',
        'Viertel der Landfläche der Erde. Daher der Satz, den Zeitgenossen gern',
        'wiederholten: „The sun never sets on the British Empire" — irgendwo im',
        'Reich war immer Tag. In London saßen das Kolonialministerium und das India',
        'Office, die Reederei-Kontore, die Versicherer von Lloyd’s und die Banken,',
        'über die der Welthandel abgerechnet wurde; das Pfund Sterling war die',
        'Währung, in der man überall zahlen konnte, und die Zeit der ganzen Welt',
        'wurde ab 1884 vom Nullmeridian in Greenwich aus gerechnet — einem Vorort',
        'dieser Stadt. Was diese Macht trug, war weniger das Heer als die Flotte:',
        'Britannien hielt sich eine Marine, die so stark sein sollte wie die beiden',
        'nächstgrößten zusammen, und eine Kette von Häfen und Kohlestationen von',
        'Gibraltar über Malta, Aden und Bombay bis Singapur und Hongkong.',
      ].join(' '),
    },
    {
      id: 'berlin',
      name: 'Berlin',
      typ: 'ereignis',
      ...ort(13.4, 52.52),
      text: [
        'Vom 15. November 1884 bis zum 26. Februar 1885 tagten hier auf Einladung',
        'Bismarcks die Vertreter von vierzehn Staaten — darunter alle europäischen',
        'Mächte, dazu das Osmanische Reich und die USA. Verhandelt wurde über',
        'Afrika. Eingeladen war kein einziger Afrikaner. Die Konferenz hat den',
        'Kontinent nicht, wie oft erzählt wird, am Tisch mit dem Lineal',
        'aufgeteilt; sie legte die Regeln fest, nach denen aufgeteilt wurde: freie',
        'Schifffahrt auf Kongo und Niger, Freihandel im Kongobecken — und der',
        'Grundsatz, dass ein Anspruch auf ein Gebiet nur zählt, wenn man es',
        'tatsächlich besetzt und den anderen Mächten anzeigt. Genau dieser Satz',
        'löste den Wettlauf aus: Wer zögerte, kam zu spät. Nebenbei wurde dem',
        'belgischen König Leopold II. das Kongobecken als persönlicher Besitz',
        'zuerkannt — begründet mit Handelsfreiheit und dem Kampf gegen den',
        'Sklavenhandel. Was daraus wurde, steht am Info-Punkt Kongo.',
      ].join(' '),
    },
    {
      id: 'sueskanal',
      name: 'Sueskanal',
      typ: 'ereignis',
      ...ort(32.35, 30.6),
      text: [
        'Am 17. November 1869 wurde der Kanal eröffnet — 164 Kilometer zwischen',
        'Mittelmeer und Rotem Meer, gebaut unter der Leitung des Franzosen',
        'Ferdinand de Lesseps, bezahlt von französischen Aktionären und dem',
        'ägyptischen Staat, gegraben von ägyptischen Arbeitern, die anfangs zur',
        'Fronarbeit herangezogen wurden. Der Weg von London nach Bombay verkürzte',
        'sich von rund 21 000 auf etwa 11 500 Kilometer: Statt um ganz Afrika herum',
        'fuhr man mitten hindurch. Damit war der Kanal für Britannien die',
        'Lebensader nach Indien, obwohl es den Bau abgelehnt hatte. 1875 kaufte die',
        'britische Regierung dem hoch verschuldeten ägyptischen Vizekönig seine',
        'Anteile ab; 1882 besetzten britische Truppen Ägypten, offiziell zum Schutz',
        'der Ordnung und der Anleihen, tatsächlich blieben sie bis 1956. Ein Kanal,',
        'gegraben für den Handel, wurde so zum Grund einer Besetzung, die',
        'siebzig Jahre dauerte.',
      ].join(' '),
    },
    {
      id: 'delhi',
      name: 'Delhi',
      typ: 'stadt',
      ...ort(77.21, 28.61),
      text: [
        'Bis 1911 war Kalkutta die Hauptstadt Britisch-Indiens, danach Delhi — die',
        'alte Residenz der Mogulkaiser und 1857 das Zentrum des großen Aufstands. Der',
        'Anfang war kein Staat, sondern eine Aktiengesellschaft: Die 1600 gegründete',
        'East India Company handelte mit Pfeffer, Baumwollstoff und Salpeter, hielt',
        'eigene Truppen und wurde nach der Schlacht bei Plassey 1757 Herrin über',
        'Bengalen. Ein Unternehmen regierte Millionen Menschen und zog Steuern ein.',
        'Nach dem großen Aufstand von 1857 — in Indien als erster',
        'Unabhängigkeitskrieg erinnert, in Britannien lange „Sepoy-Meuterei"',
        'genannt, auf beiden Seiten mit großer Grausamkeit geführt — löste die',
        'Krone die Company ab: Ab 1858 war Indien Kronkolonie, ab 1877 trug',
        'Königin Victoria den Titel „Kaiserin von Indien". Britannien baute hier',
        'das damals viertgrößte Eisenbahnnetz der Welt, Universitäten, Telegrafen',
        'und ein Rechtswesen, das bis heute nachwirkt — und exportierte Getreide,',
        'während zwischen 1876 und 1900 Hungersnöte Millionen Menschen töteten.',
        'Aus Britisch-Indien gingen 1947 Indien und Pakistan hervor.',
      ].join(' '),
    },
    {
      id: 'kongo',
      name: 'Léopoldville',
      typ: 'ereignis',
      ...ort(15.3, -4.3),
      text: [
        'Der Kongo-Freistaat gehörte von 1885 bis 1908 keinem Staat, sondern einem',
        'Mann: Leopold II., König der Belgier, in Personalunion Herr über ein',
        'Gebiet, das achtzigmal so groß war wie Belgien. Er hat es nie betreten.',
        'Begründet worden war die Herrschaft mit Handel, Wissenschaft und dem Kampf',
        'gegen den Sklavenhandel. Als um 1890 der Luftreifen erfunden wurde und die',
        'Nachfrage nach Kautschuk explodierte, wurden den Dörfern Liefermengen',
        'auferlegt; wer sie nicht erfüllte, dessen Angehörige wurden verschleppt,',
        'verstümmelt oder erschossen. Die abgehackten Hände, mit denen Soldaten den',
        'Verbrauch ihrer Patronen belegten, sind das Bild, das von diesem Gebiet',
        'geblieben ist. Öffentlich gemacht wurde es von Europäern: dem britischen',
        'Konsul Roger Casement, dem Reeder-Angestellten E. D. Morel, Missionaren mit',
        'Fotoapparaten. Die Schätzungen der Bevölkerungsverluste gehen weit',
        'auseinander und werden bis heute erforscht; sie reichen in die Millionen.',
        '1908 nahm der belgische Staat dem König die Kolonie ab — die Kritik kam',
        'aus denselben Ländern, die anderswo eigene Kolonien hielten.',
      ].join(' '),
    },
    {
      id: 'kapstadt',
      name: 'Kapstadt',
      typ: 'stadt',
      ...ort(18.42, -33.93),
      text: [
        '1652 als Versorgungsstation der niederländischen Ostindienkompanie',
        'gegründet, 1806 von Britannien besetzt und 1814 vertraglich übernommen —',
        'nicht wegen des Landes, sondern wegen der Lage: Wer das Kap hält, hält den',
        'Seeweg nach Indien. Nach der Eröffnung des Sueskanals verlor die Route an',
        'Bedeutung, doch da hatte sich das Interesse längst verschoben: 1867 wurden',
        'bei Kimberley Diamanten gefunden, 1886 am Witwatersrand das größte',
        'Goldfeld der Welt. Aus dem Streit um diese Bodenschätze und um die',
        'Vorherrschaft im Süden wurde 1899 der Zweite Burenkrieg — ein Krieg',
        'zwischen Britannien und den Nachkommen niederländischer Siedler, in dem',
        'die britische Armee Zehntausende burische Frauen und Kinder sowie',
        'afrikanische Landarbeiter in Lagern zusammenpferchte; Tausende starben',
        'dort an Hunger und Krankheit. Das Wort „Konzentrationslager" bekam hier',
        'seine traurige Bekanntheit. 1910 entstand die Südafrikanische Union als',
        'Dominion — mit Selbstverwaltung für die weiße Minderheit und ohne',
        'Stimmrecht für die große Mehrheit der Bevölkerung.',
      ].join(' '),
    },
    {
      id: 'sansibar',
      name: 'Sansibar',
      typ: 'stadt',
      ...ort(39.2, -6.16),
      text: [
        'Sansibar war im 19. Jahrhundert der Umschlagplatz Ostafrikas: Von hier aus',
        'gingen Karawanen bis an die großen Seen und brachten Elfenbein und',
        'versklavte Menschen zurück, hier wuchsen auf Plantagen die Gewürznelken,',
        'die den Reichtum des Sultans ausmachten. Der Sklavenhandel über den',
        'Indischen Ozean war alt und wurde von arabischen, swahilischen und',
        'afrikanischen Händlern getragen; die europäischen Mächte machten seine',
        'Bekämpfung ab den 1870er Jahren zu einem Grund für ihr Eingreifen — der',
        'ehrlich gemeint war und zugleich sehr gelegen kam. 1873 schloss der Sultan',
        'unter britischem Druck den Sklavenmarkt. 1890 tauschten Deutschland und',
        'Britannien in einem einzigen Vertrag Sansibar gegen Helgoland und zogen',
        'nebenbei Grenzen quer durch Ostafrika; der Sultan wurde nicht gefragt.',
        'Sein Reich wurde britisches Protektorat, seine Küstenstreifen auf dem',
        'Festland fielen an Deutsch-Ostafrika.',
      ].join(' '),
    },
  ],

  bewegungen: [
    {
      id: 'kaproute',
      name: 'Der alte Seeweg nach Indien — um das Kap (bis 1869)',
      von: p(-9.48, 38.78),
      ueber: [p(-17.0, 15.0), p(0.0, -10.0), p(18.42, -33.93), p(40.0, -18.0), p(60.0, 5.0)],
      nach: p(72.83, 18.94),
      text: [
        'Seit Vasco da Gama 1498 führte der Seeweg von Europa nach Indien um ganz',
        'Afrika herum: hinaus in den Atlantik, an der westafrikanischen Küste',
        'entlang, um das Kap der Guten Hoffnung, dann quer über den Indischen',
        'Ozean. Ein Segelschiff brauchte für die Strecke vier bis sechs Monate. Wer',
        'diesen Weg beherrschte, beherrschte den Handel mit Asien — deshalb lagen',
        'die begehrten Punkte nicht im Landesinneren, sondern an der Küste: die',
        'Kapverden, St. Helena, das Kap. Diese Linie erklärt, warum Europa',
        'jahrhundertelang an Afrikas Rändern saß und das Innere nicht kannte: Man',
        'wollte nicht das Land, man wollte den Weg.',
      ].join(' '),
    },
    {
      id: 'suesroute',
      name: 'Der kurze Weg nach Indien — durch den Sueskanal (ab 1869)',
      von: p(-0.13, 51.51),
      ueber: [p(-9.48, 38.78), p(-5.35, 36.14), p(14.5, 35.9), p(32.35, 30.6), p(43.3, 12.5), p(60.0, 15.0)],
      nach: p(72.83, 18.94),
      text: [
        'Mit dem Sueskanal wurde aus einer halbjährigen Reise eine Fahrt von wenigen',
        'Wochen. Der Weg führte an einer Kette britischer Stützpunkte entlang:',
        'Gibraltar (seit 1713), Malta (seit 1800), der Kanal und Ägypten (ab 1882',
        'besetzt), Aden (seit 1839) — und dann Bombay. Jeder dieser Punkte war ein',
        'Hafen mit Kohlelager, denn Dampfschiffe mussten alle paar tausend',
        'Kilometer nachfüllen. Dass die Route quer durch fremde Länder lief, war',
        'aus britischer Sicht ein Sicherheitsproblem — und aus diesem Denken',
        'entstanden Besetzungen, die nie geplant, aber immer wieder verlängert',
        'wurden. Vergleicht man diese Linie mit der alten Kaproute, sieht man den',
        'ganzen Unterschied, den ein einziger Kanal machte.',
      ].join(' '),
    },
    {
      id: 'karawanen',
      name: 'Die Karawanenwege ins Innere Ostafrikas',
      von: p(39.2, -6.16),
      ueber: [p(38.85, -6.45), p(35.7, -5.0), p(32.8, -5.0)],
      nach: p(29.7, -4.9),
      text: [
        'Von Sansibar und Bagamoyo aus zogen Karawanen monatelang ins Innere, bis an',
        'den Tanganjikasee und darüber hinaus. Sie brachten Elfenbein und versklavte',
        'Menschen an die Küste; getragen wurde die Last von Menschen, weil die',
        'Tsetsefliege Zugtiere tötete. Auf denselben Wegen reisten ab der',
        'Jahrhundertmitte die europäischen Forschungsreisenden — Burton und Speke,',
        'Livingstone, Stanley —, und ihre Berichte machten aus dem Inneren Afrikas',
        'in Europa erst ein Ziel. Diese Linie erzählt beides zugleich: Sie ist der',
        'Weg, auf dem der Sklavenhandel lief, den Europa bekämpfen wollte — und der',
        'Weg, auf dem Europa hereinkam.',
      ].join(' '),
    },
    {
      id: 'kautschuk',
      name: 'Der Kautschuk aus dem Kongo — nach Antwerpen',
      von: p(20.0, 1.0),
      ueber: [p(15.3, -4.3), p(13.45, -5.83), p(12.35, -6.0), p(-2.0, 20.0), p(-6.0, 42.0)],
      nach: p(4.4, 51.22),
      text: [
        'Der Weg des Gewinns: Aus den Wäldern am oberen Kongo kam der Kautschuk',
        'flussabwärts nach Léopoldville, von dort mit der 1898 fertiggestellten',
        'Bahn um die Stromschnellen nach Matadi und über den Atlantik nach',
        'Antwerpen. Dort wurde er verkauft, und dort blieb das Geld — beim König',
        'und bei den Konzessionsgesellschaften, denen ganze Landstriche überlassen',
        'worden waren. Dieselbe Rechnung galt fast überall: Baumwolle aus Ägypten',
        'und Indien, Palmöl aus Westafrika, Kupfer aus Katanga, Gold und Diamanten',
        'aus Südafrika, Tee aus Assam. Gebaut wurden Eisenbahnen und Häfen — und',
        'die Strecken führten fast immer von der Rohstoffquelle zum nächsten',
        'Verschiffungshafen, selten von einer afrikanischen Stadt zur anderen. Man',
        'kann an einem Streckennetz ablesen, wofür es gebaut wurde.',
      ].join(' '),
    },
  ],

  // Die Beschriftungen sind auf einem so weiten Ausschnitt heikel: Ein Name
  // von fünfzehn Zeichen ist hier über zwanzig Längengrade breit. Deshalb
  // stehen die Meeresnamen dort, wo wirklich nur Wasser ist, und `Golf von
  // Bengalen` fehlt ganz — der Name hätte am rechten Bildrand nicht mehr Platz
  // gehabt. Nachrechnen lässt sich das mit `node tools/pruef-die-kolonien.mjs`.
  beschriftungen: [
    { text: 'Atlantik', art: 'meer', ...ort(-12.5, 4.0) },
    { text: 'Indischer Ozean', art: 'meer', ...ort(68.0, -26.0) },
    { text: 'Mittelmeer', art: 'meer', ...ort(18.0, 34.5) },
    { text: 'Rotes Meer', art: 'meer', drehung: -58, ...ort(37.5, 17.0) },
    { text: 'Persischer Golf', art: 'meer', drehung: -35, ...ort(53.0, 25.0) },
    { text: 'Guineagolf', art: 'meer', ...ort(2.0, -1.0) },
    { text: 'Nordsee', art: 'meer', ...ort(3.0, 56.0) },
    { text: 'Schwarzes Meer', art: 'meer', ...ort(33.5, 43.5) },
    { text: 'Kaspisches Meer', art: 'meer', drehung: -75, ...ort(51.0, 41.5) },
    { text: 'Arabisches Meer', art: 'meer', ...ort(63.0, 12.0) },
    { text: 'Sahara', art: 'land', ...ort(6.0, 23.0) },
    { text: 'Kalahari', art: 'land', ...ort(24.0, -22.0) },
    { text: 'Namib', art: 'land', drehung: -72, ...ort(14.6, -25.5) },
    // „Kongobecken" steht dort, wo sonst der Flussname stünde: Beides
    // nebeneinander ginge sich an dieser Stelle mit den Ortsnamen
    // Léopoldville und Sansibar aus, und die Landschaft ist hier das
    // Wichtigere — um sie ging es 1884/85 in Berlin.
    { text: 'Kongobecken', art: 'land', ...ort(22.5, 0.0) },
    { text: 'Nil', art: 'meer', drehung: 78, ...ort(32.6, 22.5) },
    { text: 'Niger', art: 'meer', drehung: -12, ...ort(-4.5, 15.5) },
    { text: 'Sambesi', art: 'meer', drehung: 8, ...ort(29.0, -16.4) },
    { text: 'Ganges', art: 'meer', drehung: -20, ...ort(86.5, 24.5) },
    { text: 'Europa', art: 'land', ...ort(25.0, 48.0) },
    { text: 'Arabien', art: 'land', ...ort(47.0, 21.0) },
    { text: 'Indien', art: 'land', ...ort(78.5, 21.0) },
    { text: 'Anatolien', art: 'land', ...ort(33.5, 39.0) },
    { text: 'Persien', art: 'land', ...ort(60.0, 30.0) },
    { text: 'Zentralasien', art: 'land', ...ort(66.0, 45.0) },
    { text: 'Madagaskar', art: 'land', drehung: 60, ...ort(46.6, -20.0) },
    { text: 'Ceylon', art: 'land', ...ort(81.5, 6.5) },
    { text: 'Kanaren', art: 'land', ...ort(-13.5, 30.0) },
  ],
};

module.exports = karte;
