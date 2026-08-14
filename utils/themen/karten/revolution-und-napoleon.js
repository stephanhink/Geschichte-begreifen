// Die Karte zum Thema „Revolution und Napoleon" — Geschichte in Bewegung.
//
// Die Küstenlinien stehen hier als echte Längen-/Breitengrade `[lon, lat]` und
// werden von utils/karte-geo.js in SVG-Koordinaten umgerechnet. Wer einen Punkt
// anzweifelt, schlägt ihn im Atlas nach: `[2.35, 48.86]` ist Paris,
// `[-6.03, 36.18]` das Kap Trafalgar, `[23.9, 54.9]` Kaunas am Njemen, wo die
// Grande Armée am 24. Juni 1812 die Grenze überschritt, und `[37.62, 55.75]`
// Moskau.
//
// Der Ausschnitt: 10° W bis 40° O, 35° N bis 57° N — 700 × 443,4. Mit 14
// SVG-Einheiten je Längengrad liegt er zwischen den vier Europakarten der App
// und der weiten Eurasien-Karte. Der Betreiber hat den Rahmen mit 9° W–40° O
// und 35–55° N vorgegeben; nach Norden und Westen steht er hier eine Spur
// weiter, und zwar aus genau dem Grund, den die Vorgabe selbst nennt: Moskau
// liegt auf 55,75° N, Kopenhagen auf 55,68° N und Lissabon auf 9,14° W — bei
// 55° N und 9° W wären alle drei knapp aus dem Bild gefallen, und der
// Russland-Feldzug hätte kein Ziel gehabt.
//
// Was dieser Ausschnitt kostet und was er bringt: Norwegen und Sankt Petersburg
// liegen über dem oberen Rand, Ägypten unter dem unteren — Napoleons
// Ägypten-Feldzug 1798/99 steht deshalb nur im Text, nicht auf der Karte.
// Dafür passen die drei Enden dieser Geschichte auf ein Bild: Trafalgar im
// Südwesten, Moskau im Nordosten, Waterloo in der Mitte.
//
// Vier Festlegungen, die ausdrücklich hierher gehören:
//
//   1. **Das Heilige Römische Reich ist keine Fläche** — dieselbe Regel wie auf
//      der Karte zum Dreißigjährigen Krieg. 1789 lagen darin über dreihundert
//      Herrschaften; eine einzige eingefärbte Fläche würde einen Staat
//      behaupten, den es nicht gab. Die Reichsgrenze liegt deshalb als blasse
//      Linie im Untergrund. Sie bleibt auch auf den späteren Phasen stehen —
//      als Erinnerung an das, was 1806 aufgelöst wurde. Der Hinweis der Phasen
//      sagt das selbst.
//   2. **Die Flächen zeigen datierte Zustände, nicht Urteile.** „Königreich
//      Spanien unter Joseph Bonaparte" heißt genau das und nichts weiter; dass
//      diese Herrschaft nie über das ganze Land reichte, steht im Titel der
//      Fläche und im Hinweis der Phase, nicht in einer Wertung.
//   3. **Moskau liegt in keiner Phase im französischen Gebiet.** Napoleon stand
//      im September 1812 in der Stadt — einverleibt war sie nie. Der Feldzug
//      ist deshalb eine Bewegung (ein Pfeil), keine Fläche. Der Unterschied
//      zwischen „Heer steht dort" und „Land gehört dazu" ist auf dieser Karte
//      derselbe wie beim schwedischen Vormarsch von 1631.
//   4. **Alle Flächen einer Phase werden gleich eingefärbt** (siehe
//      components/abschnitte/KarteAbschnitt.js). Nachbarn verschmelzen deshalb
//      optisch zu einem Block; nur die Titel sagen, wer wer ist.
//
// Reine Daten und Rechnung — keine UI-Importe (Architektur-Regel).

const { KARTENFARBEN, erstelleProjektion, rueckwaerts, verbinde } = require('../../karte-geo');

// ---------------------------------------------------------------------------
// Ausschnitt und Projektion
// ---------------------------------------------------------------------------

/**
 * Der Kartenausschnitt: vom Atlantik westlich Lissabons (10° W) bis östlich
 * von Moskau (40° O), von Kreta und Nordafrika (35° N) bis Südschweden und
 * Moskau (57° N).
 */
const RAHMEN = { minLon: -10, maxLon: 40, minLat: 35, maxLat: 57, breite: 700 };

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

/** Die Ostküste der Ostsee: Estland (über dem Bildrand) → Riga → Danzig. */
const OSTSEE_OST = [
  [24.5, 58.6], // über dem oberen Bildrand
  [24.4, 58.0],
  [24.5, 57.85], // Pernau am Rigaischen Meerbusen
  [24.4, 57.6],
  [24.35, 57.4],
  [24.1, 57.05], // Riga, an der Mündung der Düna
  [23.6, 56.95],
  [23.1, 57.15],
  [22.6, 57.75], // Kap Kolka, die Nordspitze Kurlands
  [21.7, 57.5],
  [21.05, 56.55], // Libau
  [20.95, 56.05],
  [21.05, 55.7], // Memel — hier beginnt 1812 der Feldzug
  [20.9, 55.3],
  [20.5, 55.0],
  [19.9, 54.65], // Pillau, der Hafen Königsbergs
  [19.3, 54.55],
  [18.9, 54.65],
  [18.65, 54.35], // Danzig, an der Weichselmündung
];

/** Die Südküste der Ostsee: Danzig → Kiel. */
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

/** Jütlands Ostküste: Kiel → Skagen (über dem Bildrand). */
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
  [10.6, 57.75], // Skagen, über dem oberen Bildrand
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

/**
 * Die Nordseeküste: Elbmündung → Zuiderzee → Rheinmündung → Calais.
 *
 * Die Zuiderzee ist als offene Bucht gezeichnet — um 1800 war sie Wasser und
 * der Hafen Amsterdams; abgedämmt wurde sie erst 1932.
 */
const NORDSEE = [
  [8.7, 53.87],
  [8.5, 53.6], // Wesermündung
  [8.15, 53.5],
  [7.2, 53.6], // Emsmündung
  [6.8, 53.45],
  [6.2, 53.45],
  [5.6, 53.4], // Friesland
  [5.4, 52.9], // Zuiderzee, Ostufer
  [5.3, 52.5],
  [5.05, 52.35], // Südende der Zuiderzee, bei Amsterdam
  [4.9, 52.45],
  [5.0, 52.75], // Westufer
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
  [1.55, 50.7], // Boulogne — hier lag 1803–1805 das Lager für die Landung in England
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
  [-3.0, 48.85], // Nordküste der Bretagne
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
  [-8.87, 41.87], // Minhomündung
  [-8.78, 41.5],
  [-8.68, 41.15], // Porto
  [-8.85, 40.6], // Aveiro
  [-8.9, 40.15],
  [-9.35, 39.35], // Peniche
  [-9.42, 38.9],
  [-9.5, 38.78], // Cabo da Roca, der Westpunkt des Festlands
  [-9.25, 38.68], // Lissabon, an der Tejomündung
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
  [-5.9, 36.15], // die Küste vor Trafalgar
  [-5.61, 36.0], // Tarifa, die Südspitze
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
  [6.0, 43.1], // Toulon — hier macht sich Bonaparte 1793 zum ersten Mal einen Namen
  [6.6, 43.15],
  [7.07, 43.56], // der Golf von Juan, wo Napoleon am 1. März 1815 landet
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
  [10.5, 43.0], // Piombino, gegenüber von Elba
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
  [15.65, 38.27], // Capo Peloro, an der Straße von Messina
];

/** Die Südküste Italiens: Straße von Messina → Bari (Absatz und Sporn). */
const ITALIEN_SUED = [
  [15.65, 38.27],
  [16.0, 37.93], // Capo Spartivento, die Sohle des Stiefels
  [16.55, 38.3],
  [17.13, 38.92], // Capo Rizzuto
  [16.95, 39.35],
  [16.5, 39.65], // der Golf von Tarent
  [17.0, 40.45], // Tarent
  [17.98, 40.05], // Gallipoli
  [18.36, 39.79], // Capo Santa Maria di Leuca, der Absatz
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
  [18.1, 42.6], // Ragusa (Dubrovnik)
  [18.55, 42.4], // die Bucht von Kotor
  [19.1, 42.09], // Bar
  [19.5, 41.31], // Durrës
  [19.35, 40.9],
  [19.49, 40.46], // Vlora
];

/** Die Küste Griechenlands: Vlora → Peloponnes → Athen → Thessaloniki → Thrakien. */
const GRIECHENLAND = [
  [19.49, 40.46],
  [20.0, 39.87], // Sarandë, gegenüber von Korfu
  [20.75, 38.96], // Preveza
  [21.43, 38.37], // Missolonghi, am Golf von Patras
  [21.73, 38.25], // Patras
  [21.32, 38.0],
  [21.4, 37.6],
  [21.7, 36.91], // Pylos — hier wird 1827 in Navarino gekämpft
  [21.88, 36.71], // Kap Akritas
  [22.48, 36.39], // Kap Matapan, der Südpunkt des Festlands
  [23.05, 36.5],
  [23.2, 36.43], // Kap Malea
  [23.15, 37.0],
  [22.8, 37.57], // Nauplia
  [22.93, 37.94], // Korinth
  [23.65, 37.94], // Piräus, der Hafen Athens
  [24.03, 37.65], // Kap Sounion
  [23.6, 38.46], // Chalkis auf Euböa
  [22.94, 39.36], // Volos
  [22.6, 40.0],
  [22.94, 40.63], // Thessaloniki
  [23.7, 40.25], // die Chalkidiki
  [24.15, 40.6],
  [24.4, 40.94], // Kavala
  [25.2, 40.85],
  [25.87, 40.85], // Alexandroupoli
];

/** Die Nordküste des Marmarameers: Thrakien → Bosporus. */
const MARMARA_NORD = [
  [25.87, 40.85],
  [26.2, 40.6],
  [26.4, 40.35], // die Halbinsel Gallipoli, am Eingang der Dardanellen
  [27.0, 40.5],
  [27.9, 40.4],
  [28.7, 40.95],
  [28.98, 41.02], // Konstantinopel
  [29.1, 41.2], // der Bosporus, am Schwarzen Meer
];

/** Das Westufer des Schwarzen Meeres: Bosporus → Donaudelta → Odessa. */
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
  [30.4, 46.3], // Mündung des Dnjestr
  [30.75, 46.48], // Odessa
];

/** Die Nordküste des Schwarzen Meeres: Odessa → Krim → Asowsches Meer → Kaukasus. */
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
  [37.4, 46.1], // Jejsk
  [38.3, 45.3],
  [37.3, 45.2],
  [36.8, 45.3],
  [37.0, 44.9],
  [37.8, 44.7], // Noworossijsk
  [39.0, 44.0],
  [39.7, 43.6], // Sotschi
  [40.3, 43.4], // am rechten Bildrand
];

/**
 * Anatolien und die Levanteküste: Bosporus → Schwarzmeer-Südküste → zurück am
 * Mittelmeer entlang bis zu den Dardanellen.
 *
 * Das Osmanische Reich gehört auf diese Karte: Es ist in allen drei Phasen da,
 * es verliert 1812 Bessarabien an Russland — und genau dieser Friede von
 * Bukarest macht russische Truppen für den Feldzug frei, der wenige Wochen
 * später beginnt.
 */
const ANATOLIEN = [
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
  [39.7, 41.0], // Trapezunt
  [40.6, 41.1], // am rechten Bildrand
];

/** Die Mittelmeerküste Anatoliens und der Levante: Iskenderun → Dardanellen. */
const ANATOLIEN_SUED = [
  [35.4, 34.0], // unterhalb des Bildrandes, an der libanesischen Küste
  [35.6, 35.0],
  [35.9, 35.9], // Latakia
  [36.0, 36.2],
  [36.6, 36.6], // Iskenderun
  [35.5, 36.6],
  [34.6, 36.8], // Mersin
  [33.9, 36.3], // Silifke
  [32.8, 36.1],
  [31.4, 36.8],
  [30.7, 36.9], // Antalya
  [30.5, 36.3],
  [29.6, 36.2],
  [29.1, 36.65], // Fethiye
  [28.3, 36.85], // Marmaris
  [27.4, 37.03], // Bodrum
  [27.3, 37.5],
  [27.26, 37.86],
  [26.9, 38.42], // Smyrna (Izmir)
  [26.7, 38.7],
  [26.85, 39.0],
  [26.7, 39.3],
  [26.2, 39.5],
  [26.2, 40.0],
  [26.4, 40.15], // Çanakkale, an den Dardanellen
  [27.3, 40.4],
  [28.5, 40.4],
  [29.1, 40.75],
  [29.1, 41.2],
];

// ---------------------------------------------------------------------------
// Britannien, Irland, Skandinavien, Nordafrika
// ---------------------------------------------------------------------------

/** Britanniens Ostküste: Aberdeenshire → Dover. */
const BRITANNIEN_OST = [
  [-2.0, 57.6], // über dem oberen Bildrand
  [-2.1, 57.15], // Aberdeen
  [-2.45, 56.7], // Montrose
  [-2.85, 56.45], // Firth of Tay
  [-3.4, 56.35],
  [-2.9, 56.2], // Fife
  [-2.6, 56.05],
  [-3.2, 56.0], // Firth of Forth, bei Edinburgh
  [-2.4, 55.95],
  [-1.9, 55.65], // Berwick
  [-1.6, 55.05], // Tynemouth
  [-1.35, 54.65],
  [-0.55, 54.5], // Whitby
  [-0.1, 54.15], // Flamborough Head
  [-0.05, 53.65], // Humbermündung
  [0.2, 53.5],
  [0.1, 52.95], // The Wash
  [0.6, 52.8],
  [1.35, 52.95], // Cromer
  [1.75, 52.65], // Great Yarmouth
  [1.6, 52.1],
  [1.3, 51.95], // Harwich
  [0.95, 51.5], // Themsemündung
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

/** Britanniens Westküste: Land’s End → Nordwestschottland. */
const BRITANNIEN_WEST = [
  [-5.72, 50.07],
  [-4.2, 51.2], // Nordküste von Devon
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
  [-5.2, 57.6], // über dem oberen Bildrand
];

/** Irland — die Insel, von der aus England den Seekrieg absicherte. */
const IRLAND = [
  [-6.0, 55.2],
  [-5.55, 54.7], // Belfast Lough
  [-5.55, 54.25], // Strangford Lough
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

/**
 * Südschweden — mehr von Skandinavien passt nicht ins Bild.
 *
 * Norwegen beginnt erst über dem oberen Bildrand; sichtbar sind Schonen,
 * Blekinge und Halland, also genau der Teil, der 1814 zusammen mit Norwegen
 * neu geordnet wurde.
 */
const SCHWEDEN = [
  [17.0, 58.6], // über dem oberen Bildrand
  [16.75, 57.9], // Västervik
  [16.5, 57.3],
  [16.45, 56.9], // der Kalmarsund
  [16.2, 56.5],
  [15.6, 56.2], // Karlskrona
  [14.7, 56.1],
  [14.2, 55.85],
  [14.35, 55.4], // Sandhammaren, die Südostecke Schonens
  [13.6, 55.38],
  [13.0, 55.38], // Trelleborg
  [12.7, 55.55], // Malmö, am Öresund
  [12.8, 56.0], // Helsingborg
  [12.5, 56.3],
  [12.85, 56.65], // Halmstad
  [12.25, 57.25], // Varberg
  [11.95, 57.7], // Göteborg
  [11.4, 58.35],
];

/** Die Küste Nordwestafrikas: Tanger → Kap Bon → unter den Bildrand. */
const NORDAFRIKA = [
  [-5.93, 35.79], // Tanger, an der Straße von Gibraltar
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
  [10.6, 36.4], // Hammamet
  [10.5, 35.9],
  [10.64, 35.83], // Sousse
  [10.9, 35.6],
  [11.07, 35.2], // Mahdia, am unteren Bildrand
];

// ---------------------------------------------------------------------------
// Die Inseln
// ---------------------------------------------------------------------------

/** Korsika — hier wird Napoleon 1769 als französischer Untertan geboren. */
const KORSIKA = [
  [9.35, 42.98], // Kap Korsika
  [9.45, 42.7], // Bastia
  [9.53, 42.3],
  [9.4, 41.8],
  [9.15, 41.38], // Bonifacio
  [8.8, 41.5],
  [8.74, 41.92], // Ajaccio, Napoleons Geburtsstadt
  [8.55, 42.3],
  [8.65, 42.6],
  [9.2, 42.9],
];

const SARDINIEN = [
  [9.18, 41.25], // Santa Teresa
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

/** Elba — 1814/15 Napoleons erstes Exil, zehn Monate lang ein eigener Staat. */
const ELBA = [
  [10.1, 42.78],
  [10.25, 42.84],
  [10.42, 42.8],
  [10.34, 42.73],
  [10.15, 42.72],
];

const SIZILIEN = [
  [12.43, 37.8], // Marsala
  [12.73, 38.18], // Kap San Vito
  [13.36, 38.13], // Palermo
  [14.0, 38.05],
  [14.7, 38.03],
  [15.24, 38.25], // Messina
  [15.65, 38.27],
  [15.3, 37.85], // Taormina
  [15.09, 37.5], // Catania
  [15.29, 37.07], // Syrakus
  [15.14, 36.68], // Kap Passero
  [14.5, 36.8],
  [14.25, 37.07], // Gela
  [13.58, 37.28], // Agrigent
  [13.08, 37.5], // Sciacca
  [12.6, 37.65],
];

const MALLORCA = [
  [2.35, 39.55],
  [2.75, 39.85],
  [3.15, 39.95],
  [3.45, 39.75],
  [3.35, 39.35],
  [2.95, 39.3],
  [2.6, 39.35],
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

const LOLLAND_FALSTER = [
  [11.0, 54.77],
  [11.4, 54.65],
  [12.1, 54.8],
  [11.9, 54.95],
  [11.3, 54.95],
];

const BORNHOLM = [
  [14.7, 55.1],
  [14.75, 55.28],
  [15.1, 55.3],
  [15.15, 55.05],
  [14.85, 54.98],
];

const OELAND = [
  [16.4, 56.2],
  [16.5, 56.5],
  [16.8, 57.0],
  [16.9, 57.15],
  [16.7, 57.1],
  [16.6, 56.9],
  [16.3, 56.4],
];

// ---------------------------------------------------------------------------
// Flüsse — die Linien, an denen dieses Kapitel spielt
// ---------------------------------------------------------------------------
//
// Der Rhein ist die Grenze, um die zwanzig Jahre gekämpft wird. Der Njemen ist
// die Linie, die die Grande Armée am 24. Juni 1812 überschreitet. Und die
// Beresina ist der Fluss, dessen Name in mehreren Sprachen bis heute für eine
// Katastrophe steht.

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
  [3.9, 45.9],
  [2.6, 47.1],
  [1.9, 47.9], // Orléans
  [0.7, 47.4], // Tours
  [-0.5, 47.3],
  [-1.55, 47.2], // Nantes
  [-2.2, 47.28],
];

const RHONE = [
  [6.2, 46.4], // Genfersee
  [4.85, 45.75], // Lyon
  [4.7, 44.4],
  [4.8, 43.9],
  [4.85, 43.35],
];

const PO = [
  [7.5, 44.9],
  [9.2, 45.1],
  [11.0, 45.0],
  [12.3, 44.9],
];

const TIBER = [
  [12.5, 42.5],
  [12.47, 41.9], // Rom
  [12.25, 41.75],
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
  [19.05, 47.5], // Buda
  [19.6, 46.0],
  [20.5, 44.8], // Belgrad
  [22.5, 44.6], // das Eiserne Tor
  [24.0, 43.8],
  [26.0, 44.0],
  [27.9, 44.5],
  [29.7, 45.2],
];

const ELBE = [
  [14.4, 50.55],
  [13.7, 51.05], // Dresden
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
  [18.65, 54.35],
];

/** Der Njemen (Memel) — die Grenze, die am 24. Juni 1812 überschritten wird. */
const NJEMEN = [
  [26.5, 53.5],
  [25.3, 53.9],
  [23.9, 54.9], // Kaunas
  [23.0, 55.1],
  [22.0, 55.1],
  [21.2, 55.3],
];

/** Die Düna — an ihr liegt Witebsk, wo Napoleon 1812 zwei Wochen wartet. */
const DUENA = [
  [31.5, 56.3],
  [30.2, 55.2], // Witebsk
  [28.8, 55.5], // Polozk
  [26.5, 55.9],
  [25.0, 56.6],
  [24.1, 57.05], // Riga
];

const DNJEPR = [
  [32.05, 54.78], // Smolensk
  [31.2, 53.8],
  [30.7, 52.8],
  [30.9, 51.9],
  [30.5, 51.0],
  [30.5, 50.45], // Kiew
  [31.5, 49.7],
  [33.4, 49.07],
  [34.6, 48.5],
  [35.1, 47.85],
  [34.0, 47.1],
  [32.7, 46.7],
  [32.0, 46.5],
];

/** Die Beresina — Ende November 1812 der Übergang, der zum Sinnbild wurde. */
const BERESINA = [
  [28.5, 54.9],
  [28.5, 54.25], // Borissow
  [29.2, 53.5],
  [30.0, 52.9],
  [30.3, 52.6],
];

/** Die Moskwa und die obere Wolga — das Ziel des Feldzugs von 1812. */
const MOSKWA = [
  [35.9, 55.6],
  [37.0, 55.7],
  [37.62, 55.75], // Moskau
  [38.5, 55.3],
  [38.85, 55.0],
];

const WOLGA = [
  [32.9, 57.0],
  [34.5, 56.8],
  [35.9, 56.86], // Twer
  [37.5, 56.7],
  [38.6, 56.9],
];

const EBRO = [
  [-3.9, 42.9],
  [-2.5, 42.6],
  [-1.6, 42.4],
  [-0.88, 41.65], // Saragossa — zwei Belagerungen 1808 und 1809
  [0.0, 41.2],
  [0.6, 40.85],
  [0.87, 40.72],
];

const TAJO = [
  [-1.5, 40.4],
  [-3.7, 39.9],
  [-4.8, 39.9],
  [-6.0, 39.7],
  [-7.5, 39.5],
  [-8.5, 39.2],
  [-9.25, 38.68], // Lissabon
];

const GUADALQUIVIR = [
  [-2.9, 38.0],
  [-4.0, 37.9],
  [-4.78, 37.88], // Córdoba
  [-5.5, 37.6],
  [-5.99, 37.39], // Sevilla
  [-6.35, 36.85],
];

const THEMSE = [
  [-1.7, 51.7],
  [-0.5, 51.6],
  [-0.13, 51.51], // London
  [0.6, 51.5],
  [0.95, 51.5],
];

// ---------------------------------------------------------------------------
// Die Landmassen
// ---------------------------------------------------------------------------

/**
 * Der Kontinent als ein Umriss — von der Ostsee bis zum Kaukasus.
 *
 * Die Rückwege außerhalb des Bildes (rechts vom rechten und über dem oberen
 * Rand) sind Absicht: So läuft das Land über den Bildrand hinaus, statt dort
 * abzuknicken.
 */
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
  GRIECHENLAND,
  MARMARA_NORD,
  SCHWARZMEER_WEST,
  SCHWARZMEER_NORD,
  // Rückweg rechts und über dem Bild: die russische Steppe und der Norden.
  [
    [42.0, 44.0],
    [42.0, 59.0],
    [24.5, 59.0],
  ],
);

/** Anatolien und die Levante — durch Bosporus und Dardanellen getrennt. */
const KLEINASIEN = verbinde(
  ANATOLIEN,
  // Rückweg rechts und unter dem Bild.
  [
    [41.5, 41.0],
    [42.0, 33.0],
    [36.0, 33.0],
  ],
  ANATOLIEN_SUED,
);

const BRITANNIEN = verbinde(
  BRITANNIEN_OST,
  BRITANNIEN_SUED,
  BRITANNIEN_WEST,
  // Rückweg über dem Bild — Nordschottland liegt außerhalb.
  [
    [-4.0, 58.2],
    [-2.0, 58.1],
  ],
);

const SKANDINAVIEN = verbinde(SCHWEDEN, [
  [11.0, 59.0],
  [17.0, 59.0],
]);

const AFRIKA = verbinde(NORDAFRIKA, [
  [11.5, 34.0],
  [-6.5, 34.0],
  [-6.3, 35.2],
]);

// ---------------------------------------------------------------------------
// Werkzeug: Küstenabschnitte nach Orten schneiden
// ---------------------------------------------------------------------------

/**
 * Der Index des Küstenpunkts, der einem Ort am nächsten liegt.
 *
 * Die Flächen unten schneiden nicht nach Index, sondern nach Ort: „von Genua
 * bis Terracina" bleibt richtig, auch wenn dazwischen zehn Punkte dazukommen.
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
// Grenzlinien, die mehrfach gebraucht werden
// ---------------------------------------------------------------------------

/** Der Pyrenäenkamm — die Grenze zwischen Frankreich und Spanien. */
const PYRENAEEN = [
  [-1.78, 43.35],
  [-0.7, 42.9],
  [0.6, 42.7],
  [1.9, 42.5],
  [3.28, 42.32],
];

/**
 * Die Grenze des Heiligen Römischen Reiches um 1789 — eine Linie, kein Block.
 *
 * Dieselbe Festlegung wie auf der Karte zum Dreißigjährigen Krieg, und aus
 * demselben Grund: Innerhalb dieser Linie lagen über dreihundert Herrschaften
 * mit eigenem Recht, eigener Münze, eigenem Glauben. Eine eingefärbte Fläche
 * würde einen Staat behaupten, den es nicht gab. 1806 legte Franz II. die
 * Kaiserkrone nieder — das Reich, das diese Linie umschließt, hörte damit auf
 * zu bestehen. Die Linie bleibt trotzdem auf allen Phasen stehen: Man sieht
 * daran, was verschwand.
 */
const REICHSGRENZE_1789 = [
  [2.4, 51.1], // an der Nordseeküste bei Dünkirchen
  [3.3, 50.1],
  [4.2, 49.7],
  [5.0, 49.3], // die Ardennen
  [5.4, 48.5],
  [5.5, 47.6],
  [5.2, 46.9],
  [5.9, 46.3],
  [6.8, 46.0], // der Alpenkamm
  [8.0, 46.0],
  [9.0, 46.2],
  [10.2, 46.4],
  [11.5, 46.5],
  [12.5, 46.5],
  [13.5, 46.3],
  [14.0, 45.9], // der Karst über Triest
  [15.0, 45.9],
  [16.0, 46.3],
  [16.6, 46.9], // die Grenze zu Ungarn
  [17.0, 47.6],
  [16.9, 48.7],
  [17.5, 48.9],
  [18.5, 49.5],
  [18.9, 50.2], // die Grenze Schlesiens zu Polen
  [18.0, 50.7],
  [17.4, 51.2],
  [16.3, 51.4],
  [15.6, 52.3], // die Neumark
  [15.9, 53.0],
  [16.4, 53.8],
  [16.9, 54.55], // an der Ostseeküste, östlich von Pommern
];

// ---------------------------------------------------------------------------
// Bausteine: Herrschaften mit Grenzen, 1789
// ---------------------------------------------------------------------------

/**
 * Das Königreich Frankreich 1789 — der Staat, den die Revolution übernimmt.
 *
 * Korsika gehört seit 1768 dazu: Napoleon wird 1769 in Ajaccio als
 * französischer Untertan geboren, ein Jahr nach dem Kauf der Insel.
 */
const FRANKREICH_1789 = verbinde(
  kueste(NORDSEE, [2.4, 51.1], [1.6, 50.95]),
  FRANKREICH_ATLANTIK,
  PYRENAEEN,
  kueste(FRANKREICH_MITTELMEER, [3.28, 42.32], [7.07, 43.56]),
  [
    [7.15, 43.7],
    [7.0, 44.15],
    [6.85, 44.6],
    [7.1, 45.05],
    [6.7, 45.4],
    [6.2, 45.6],
    [6.0, 46.15], // Genf war eine eigene Republik
    [6.4, 47.0],
    [7.0, 47.5],
    [7.6, 47.6], // Basel, am Rhein
    [7.8, 48.6], // das Elsass, französisch seit 1648/1697
    [8.1, 49.0],
    [6.4, 49.5], // Lothringen, französisch seit 1766
    [5.6, 49.5],
    [5.0, 49.3],
    [4.2, 49.7],
    [3.3, 50.1],
    [2.6, 50.8],
  ],
);

/** Das Königreich Spanien — Bourbonen, verbündet mit Frankreich bis 1808. */
const SPANIEN = verbinde(
  kueste(IBERIEN_ATLANTIK, [-1.78, 43.35], [-8.87, 41.87]),
  [
    [-8.2, 42.0],
    [-7.0, 41.9],
    [-6.5, 41.6],
    [-6.8, 41.0],
    [-6.85, 40.3],
    [-7.0, 39.7],
    [-7.5, 39.6],
    [-7.0, 38.9],
    [-7.3, 38.0],
    [-7.4, 37.17], // die Guadianamündung, die Grenze zu Portugal
  ],
  kueste(IBERIEN_ATLANTIK, [-7.4, 37.17], [-5.61, 36.0]),
  IBERIEN_MITTELMEER,
  rueckwaerts(PYRENAEEN),
);

/** Das Königreich Portugal — Englands ältester Bündnispartner in Europa. */
const PORTUGAL = verbinde(
  kueste(IBERIEN_ATLANTIK, [-8.87, 41.87], [-7.4, 37.17]),
  [
    [-7.3, 38.0],
    [-7.0, 38.9],
    [-7.5, 39.6],
    [-7.0, 39.7],
    [-6.85, 40.3],
    [-6.8, 41.0],
    [-6.5, 41.6],
    [-7.0, 41.9],
    [-8.2, 42.0],
  ],
);

/** Die Habsburgermonarchie 1789: Österreich, Böhmen, Ungarn, Galizien. */
const HABSBURG_1789 = verbinde(
  kueste(BALKAN_ADRIA, [13.65, 45.7], [14.5, 45.3]),
  [
    [15.5, 45.5],
    [16.5, 45.2],
    [17.5, 45.1],
    [18.9, 44.9], // die Save, die Militärgrenze zum Osmanischen Reich
    [20.4, 44.85],
    [21.5, 44.7],
    [22.5, 44.6], // das Eiserne Tor an der Donau
    [23.0, 45.2],
    [25.0, 45.5],
    [26.1, 46.2], // die Karpaten, die Grenze Siebenbürgens
    [26.0, 47.0],
    [25.3, 47.9],
    [26.3, 48.2], // die Bukowina, österreichisch seit 1775
    [25.5, 48.8],
    [26.0, 49.5],
    [24.5, 50.3],
    [23.0, 50.4], // Galizien, österreichisch seit 1772
    [21.5, 50.5],
    [20.0, 50.1],
    [19.2, 50.4],
    [18.5, 50.0], // Österreichisch-Schlesien
    [17.9, 50.2],
    [17.4, 50.2],
    [16.6, 50.4],
    [15.5, 50.7],
    [14.9, 51.0],
    [14.3, 51.0],
    [13.4, 50.7], // das Erzgebirge
    [12.5, 50.4],
    [12.2, 50.3],
    [12.4, 49.8], // der Böhmerwald
    [12.6, 49.4],
    [13.4, 48.9],
    [13.46, 48.57], // Passau
    [13.0, 48.3],
    [12.75, 47.9],
    [12.17, 47.58], // Kufstein
    [11.0, 47.4],
    [10.2, 47.35], // der Arlberg
    [9.75, 47.5], // Bregenz
    [10.4, 46.6],
    [11.5, 46.5],
    [12.5, 46.5],
    [13.5, 46.3],
    [13.9, 45.9],
  ],
);

/** Die Österreichischen Niederlande — 1794 von Frankreich erobert. */
const OESTERREICHISCHE_NIEDERLANDE = verbinde(
  kueste(NORDSEE, [2.4, 51.1], [3.4, 51.45]),
  [
    [3.8, 51.3],
    [4.6, 51.45],
    [5.4, 51.4],
    [6.1, 51.1],
    [6.3, 50.5],
    [6.5, 49.9], // Luxemburg
    [6.4, 49.5],
    [5.6, 49.5],
    [5.0, 49.3],
    [4.2, 49.7],
    [3.3, 50.1],
    [2.6, 50.8],
  ],
);

/** Das Herzogtum Mailand — habsburgisch, bis Bonaparte 1796 kommt. */
const LOMBARDEI = [
  [8.6, 45.9],
  [9.3, 46.2],
  [10.2, 46.2],
  [10.5, 45.8],
  [10.6, 45.3],
  [10.0, 45.05],
  [9.2, 44.95],
  [8.75, 45.2],
  [8.6, 45.5],
];

/** Die Republik der Vereinigten Niederlande — 1795 zur Batavischen Republik. */
const NIEDERLANDE_REPUBLIK = verbinde(
  kueste(NORDSEE, [3.4, 51.45], [7.2, 53.6]),
  [
    [7.1, 53.2],
    [6.9, 52.6],
    [6.7, 52.2],
    [6.1, 51.9],
    [5.3, 51.7],
    [4.6, 51.45],
    [3.8, 51.3],
  ],
);

/** Das Königreich Preußen 1789 — der Ostblock von Pommern bis Ostpreußen. */
const PREUSSEN_OST_1789 = verbinde(
  kueste(OSTSEE_SUED, [13.1, 54.31], [18.65, 54.35]),
  kueste(OSTSEE_OST, [18.65, 54.35], [21.05, 55.7]),
  [
    [22.7, 54.4],
    [22.8, 53.9],
    [21.8, 53.5],
    [20.3, 53.2],
    [19.3, 53.35],
    [18.9, 53.05], // Thorn und Danzig blieben bis 1793 polnisch
    [18.4, 52.7],
    [17.5, 53.0],
    [16.5, 52.9],
    [15.8, 52.7],
    [15.6, 52.3],
    [16.3, 51.4],
    [17.4, 51.2],
    [18.0, 50.7],
    [18.9, 50.4], // Schlesien, preußisch seit 1742
    [17.4, 50.2],
    [16.6, 50.4],
    [15.5, 50.7],
    [14.9, 51.0],
    [14.6, 51.4],
    [13.5, 51.5],
    [12.9, 51.7],
    [12.4, 52.0],
    [11.4, 52.2], // Magdeburg
    [11.0, 52.8],
    [11.4, 53.3],
    [12.3, 53.4],
    [12.9, 53.9],
  ],
);

/** Preußens westliche Besitzungen — Kleve, Mark, Minden, Ravensberg. */
const PREUSSEN_WEST_1789 = [
  [6.1, 51.9],
  [7.0, 52.0],
  [7.6, 52.3],
  [8.6, 52.4],
  [8.9, 52.1],
  [8.4, 51.6],
  [7.6, 51.4],
  [6.9, 51.4],
  [6.3, 51.5],
];

/**
 * Polen-Litauen 1789 — nach der ersten Teilung von 1772, vor den beiden
 * folgenden.
 *
 * Diese Fläche verschwindet auf der Karte zwischen der ersten und der zweiten
 * Phase. Das ist kein Fehler des Umschalters: 1793 und 1795 wurde der Staat
 * zwischen Russland, Preußen und Österreich vollständig aufgeteilt. Wer wissen
 * will, warum das Herzogtum Warschau 1807 für viele Polen eine Hoffnung war,
 * sieht hier den Grund.
 */
const POLEN_LITAUEN_1789 = verbinde(
  [
    [18.9, 53.05],
    [19.3, 53.35],
    [20.3, 53.2],
    [21.8, 53.5],
    [22.8, 53.9],
    [22.7, 54.4],
    [23.5, 54.9],
    [24.5, 55.6],
    [25.5, 56.1],
    [26.5, 55.9],
    [28.0, 55.6],
    [29.0, 55.0],
    [30.0, 54.0],
    [30.6, 53.0],
    [31.0, 52.3],
    [31.5, 51.4],
    [32.0, 50.5],
    [32.3, 49.5],
    [31.0, 48.7],
    [29.5, 48.5],
    [28.5, 48.3],
    [26.5, 48.4],
    [26.0, 49.5],
    [24.5, 50.3],
    [23.0, 50.4],
    [21.5, 50.5],
    [20.0, 50.1],
    [19.2, 50.4],
    [18.9, 50.4],
    [18.0, 50.7],
    [17.4, 51.2],
    [16.3, 51.4],
    [15.6, 52.3],
    [15.8, 52.7],
    [16.5, 52.9],
    [17.5, 53.0],
    [18.4, 52.7],
  ],
);

/** Das Russische Reich 1789 — die Grenze liegt an Düna und Dnjepr. */
const RUSSLAND_1789 = verbinde(
  kueste(OSTSEE_OST, [24.5, 58.6], [24.1, 57.05]),
  [
    [24.3, 56.9],
    [26.0, 56.2],
    [27.5, 55.8],
    [28.5, 55.3],
    [30.0, 54.0],
    [30.6, 53.0],
    [31.0, 52.3],
    [31.5, 51.4],
    [32.0, 50.5],
    [32.3, 49.5],
    [31.5, 48.5],
    [31.3, 47.3],
    [31.3, 46.8], // der Bug, damals die Grenze zum Osmanischen Reich
  ],
  kueste(SCHWARZMEER_NORD, [31.5, 46.6], [40.3, 43.4]),
  [
    [42.0, 44.0],
    [42.0, 59.0],
    [24.5, 59.0],
  ],
);

/**
 * Das Osmanische Reich auf dem Balkan, 1789 — mit den Fürstentümern Walachei
 * und Moldau, die bis zum Dnjestr reichen.
 */
const OSMANEN_BALKAN_1789 = verbinde(
  kueste(BALKAN_ADRIA, [18.55, 42.4], [19.49, 40.46]),
  GRIECHENLAND,
  MARMARA_NORD,
  SCHWARZMEER_WEST,
  [
    [31.3, 46.8],
    [31.3, 47.3],
    [29.5, 48.5],
    [28.5, 48.3],
    [26.5, 48.4],
    [26.0, 47.0],
    [26.1, 46.2],
    [25.0, 45.5],
    [23.0, 45.2],
    [22.5, 44.6],
    [21.5, 44.7],
    [20.4, 44.85],
    [18.9, 44.9],
    [18.5, 44.2],
    [18.7, 43.4],
    [18.3, 42.9],
  ],
);

/** Das Königreich Neapel — das Festland südlich des Kirchenstaats. */
const NEAPEL = verbinde(
  kueste(ITALIEN_WEST, [13.6, 41.2], [15.65, 38.27]),
  ITALIEN_SUED,
  kueste(ITALIEN_ADRIA, [16.87, 41.13], [13.7, 42.9]),
  [
    [13.6, 42.6],
    [13.2, 42.2],
    [13.7, 41.7],
  ],
);

/** Der Kirchenstaat — von Rom quer über die Halbinsel bis Ancona. */
const KIRCHENSTAAT = verbinde(
  kueste(ITALIEN_WEST, [12.25, 41.75], [13.6, 41.2]),
  [
    [13.7, 41.7],
    [13.2, 42.2],
    [13.6, 42.6],
  ],
  kueste(ITALIEN_ADRIA, [13.7, 42.9], [12.6, 44.1]),
  [
    [12.2, 44.0],
    [11.6, 43.9],
    [11.8, 43.2],
    [12.2, 42.6],
    [11.9, 42.1],
  ],
);

/** Die Toskana — Großherzogtum, ein habsburgischer Nebenzweig. */
const TOSKANA = verbinde(
  kueste(ITALIEN_WEST, [10.3, 43.65], [11.8, 42.1]),
  [
    [11.9, 42.5],
    [11.8, 43.2],
    [11.6, 43.9],
    [11.0, 44.1],
    [10.3, 44.1],
    [10.0, 43.9],
  ],
);

/** Das Königreich Sardinien-Piemont — Savoyen, Nizza, Piemont, Sardinien. */
const PIEMONT = verbinde(
  kueste(FRANKREICH_MITTELMEER, [7.07, 43.56], [8.95, 44.4]),
  [
    [9.2, 44.5],
    [9.0, 44.9],
    [8.75, 45.2],
    [8.6, 45.9],
    [7.9, 46.25],
    [7.0, 45.9],
    [6.2, 45.6],
    [6.7, 45.4],
    [7.1, 45.05],
    [6.85, 44.6],
    [7.0, 44.15],
    [7.15, 43.7],
  ],
);

/** Die Republik Venedig — 1797 von Bonaparte beendet, nach elf Jahrhunderten. */
const VENEDIG = verbinde(
  kueste(ITALIEN_ADRIA, [12.3, 44.8], [13.65, 45.7]),
  [
    [13.9, 45.9],
    [13.5, 46.3],
    [12.5, 46.5],
    [11.5, 46.5],
    [10.9, 46.2],
    [10.6, 45.6],
    [10.6, 45.3],
    [11.3, 45.0],
    [12.0, 44.9],
  ],
);

/** Das Königreich Dänemark — Jütland, Schleswig und Holstein. */
const DAENEMARK_JUETLAND = verbinde(
  JUETLAND_WEST,
  rueckwaerts(JUETLAND_OST),
  [
    [10.6, 54.05],
    [10.87, 53.87],
    [9.9, 53.9],
    [8.9, 53.9],
  ],
);

/** Die dänischen Inseln mit Kopenhagen. */
const DAENEMARK_INSELN = [SJAELLAND, FYN, LOLLAND_FALSTER];

/** Das Königreich Schweden — auf dieser Karte nur sein Süden. */
const SCHWEDEN_REICH = verbinde(SCHWEDEN, [
  [11.0, 59.0],
  [17.0, 59.0],
]);

/** Großbritannien und Irland — seit 1801 ein Vereinigtes Königreich. */
const GROSSBRITANNIEN = [BRITANNIEN, IRLAND];

// ---------------------------------------------------------------------------
// Bausteine: das Empire und seine Gegner, 1805–1812
// ---------------------------------------------------------------------------

/**
 * Das französische Kaiserreich, unmittelbar einverleibtes Gebiet um 1812.
 *
 * Ein einziger Block von der Elbmündung bis Rom: Frankreich in seinen Grenzen
 * von 1792, dazu Belgien, das linke Rheinufer, die Niederlande (seit 1810),
 * die deutsche Nordseeküste mit Hamburg, Bremen und Lübeck (1810/11), Savoyen,
 * Piemont, Ligurien, die Toskana und der Kirchenstaat mit Rom (1808/09).
 *
 * Was die Fläche NICHT zeigt: Katalonien, das 1812 ebenfalls einverleibt wurde
 * und wenige Monate später wieder verloren ging — bei diesem Maßstab wäre das
 * ein Strich, der mehr behauptet, als er belegen kann.
 */
const KAISERREICH_1812 = verbinde(
  kueste(NORDSEE, [8.7, 53.87], [1.6, 50.95]),
  FRANKREICH_ATLANTIK,
  PYRENAEEN,
  kueste(FRANKREICH_MITTELMEER, [3.28, 42.32], [8.95, 44.4]),
  kueste(ITALIEN_WEST, [8.95, 44.4], [13.6, 41.2]),
  [
    [13.7, 41.7], // die Grenze zum Königreich Neapel
    [13.3, 42.4],
    [12.8, 43.0],
    [12.1, 43.75],
    [11.2, 44.15],
    [10.3, 44.5],
    [9.6, 44.8],
    [8.9, 45.1], // der Po
    [8.75, 45.4], // der Tessin, die Grenze zum Königreich Italien
    [8.6, 45.9],
    [7.9, 46.25], // das Departement Simplon
    [7.3, 46.3],
    [6.8, 46.4],
    [6.15, 46.3], // Genf, einverleibt 1798
    [6.4, 47.0],
    [7.0, 47.5],
    [7.6, 47.6], // Basel
    [7.8, 48.6],
    [8.3, 50.0], // der Rhein als Grenze zum Rheinbund
    [7.6, 50.4],
    [6.95, 50.94],
    [6.7, 51.4],
    [6.2, 51.85],
    [7.2, 52.4], // die Departements an der Nordsee
    [8.0, 52.8],
    [8.6, 53.1],
    [9.3, 53.4],
    [10.2, 53.6],
    [10.87, 53.87], // Lübeck
    [10.0, 53.55], // Hamburg
    [9.2, 53.85],
  ],
);

/** Die Illyrischen Provinzen — 1809 von Österreich abgetreten, französisch. */
const ILLYRISCHE_PROVINZEN = verbinde(
  kueste(BALKAN_ADRIA, [13.65, 45.7], [18.55, 42.4]),
  [
    [18.3, 42.9],
    [17.5, 43.4],
    [16.5, 44.2],
    [15.8, 45.0],
    [16.0, 45.6],
    [15.2, 46.0],
    [14.2, 46.5],
    [13.6, 46.5],
    [13.9, 45.9],
  ],
);

/** Das Königreich Italien — Napoleon selbst ist sein König. */
const KOENIGREICH_ITALIEN = verbinde(
  kueste(ITALIEN_ADRIA, [13.65, 45.7], [13.7, 42.9]),
  [
    [13.6, 42.6],
    [13.3, 42.4],
    [12.8, 43.0],
    [12.1, 43.75],
    [11.2, 44.15],
    [10.3, 44.5],
    [9.6, 44.8],
    [8.9, 45.1],
    [8.75, 45.4],
    [8.6, 45.9],
    [9.3, 46.3],
    [10.4, 46.4],
    [11.5, 46.5],
    [12.3, 46.6],
    [13.0, 46.4],
    [13.5, 46.3],
    [13.6, 45.9],
  ],
);

/**
 * Der Rheinbund — 1806 gegründet, am Ende sechzehn bis achtunddreißig Staaten.
 *
 * Hier steht er als eine Fläche, und das ist eine Vereinfachung, die man wissen
 * muss: Der Bund war kein Staat, sondern ein Militärbündnis unter französischem
 * Protektorat. Seine Mitglieder — Bayern, Sachsen, Württemberg, Baden, das
 * Königreich Westphalen und viele kleinere — behielten ihre Fürsten und
 * stellten Truppen. Sein Zustandekommen bedeutete zugleich das Ende des
 * Heiligen Römischen Reiches: Am 6. August 1806 legte Franz II. die Krone
 * nieder.
 */
const RHEINBUND = verbinde(
  kueste(OSTSEE_SUED, [10.87, 53.87], [12.6, 54.15]),
  [
    [12.8, 54.2],
    [12.6, 53.6],
    [12.2, 53.2],
    [11.6, 53.05], // die Elbe, die Grenze zu Preußen
    [11.9, 52.6],
    [12.3, 52.2],
    [12.7, 51.9],
    [13.0, 51.5],
    [14.0, 51.45],
    [14.6, 51.4], // Sachsen, seit 1806 Königreich im Rheinbund
    [14.3, 51.0],
    [13.4, 50.7],
    [12.5, 50.4],
    [12.2, 50.3],
    [12.4, 49.8],
    [12.6, 49.4],
    [13.4, 48.9],
    [13.46, 48.57], // Passau
    [13.0, 48.3],
    [12.75, 47.9],
    [12.17, 47.58],
    [11.6, 47.0],
    [11.5, 46.6], // Tirol, seit 1806 bayerisch — 1809 steht es auf
    [10.6, 46.7],
    [10.4, 46.9],
    [9.6, 47.05],
    [9.5, 47.6], // Bodensee
    [8.6, 47.6],
    [7.8, 48.6],
    [8.3, 50.0], // der Rhein als Grenze zum Kaiserreich
    [7.6, 50.4],
    [6.95, 50.94],
    [6.7, 51.4],
    [6.2, 51.85],
    [7.2, 52.4],
    [8.0, 52.8],
    [8.6, 53.1],
    [9.3, 53.4],
    [10.2, 53.6],
  ],
);

/**
 * Das Herzogtum Warschau — 1807 aus preußischen, 1809 aus österreichischen
 * Gebieten gebildet.
 *
 * Für viele Polen war es die Hoffnung auf einen eigenen Staat nach den drei
 * Teilungen; rund hunderttausend polnische Soldaten kämpften in Napoleons
 * Heeren. 1815 wurde daraus das „Kongresspolen" unter dem russischen Zaren.
 */
const HERZOGTUM_WARSCHAU = [
  [18.9, 53.05],
  [19.3, 53.35],
  [20.3, 53.2],
  [21.8, 53.5],
  [22.8, 53.9],
  [23.2, 52.7],
  [23.7, 52.1],
  [24.0, 51.3],
  [23.6, 50.5],
  [22.6, 50.0],
  [21.5, 49.6],
  [20.9, 49.4],
  [19.9, 49.3],
  [19.2, 49.5],
  [18.9, 50.4],
  [18.1, 51.0],
  [17.5, 51.6],
  [16.4, 51.9],
  [16.0, 52.4],
  [16.4, 53.0],
  [17.3, 53.1],
  [18.2, 53.1],
];

/** Die Schweiz — 1803 durch Napoleons Mediationsakte neu geordnet. */
const SCHWEIZ = [
  [6.4, 46.5],
  [7.0, 46.5],
  [7.9, 46.4],
  [8.6, 46.2],
  [9.2, 46.3],
  [10.15, 46.6],
  [10.45, 46.9],
  [9.6, 47.35],
  [9.5, 47.6], // Bodensee
  [8.6, 47.6],
  [7.6, 47.6], // Basel
  [7.0, 47.5],
  [6.4, 47.0],
];

/** Das Russische Reich 1812 — nach den Teilungen Polens bis an den Njemen. */
const RUSSLAND_1812 = verbinde(
  kueste(OSTSEE_OST, [24.5, 58.6], [21.05, 55.7]),
  [
    [22.0, 55.3],
    [22.9, 54.6], // der Njemen, die Grenze zum Herzogtum Warschau
    [23.5, 53.9],
    [23.2, 52.7],
    [23.7, 52.1], // Brest, am Bug
    [24.0, 51.3],
    [24.2, 50.5],
    [26.0, 49.5],
    [26.6, 48.2], // der Pruth — Bessarabien wird im Mai 1812 russisch
    [27.0, 47.5],
    [28.2, 46.4],
    [28.5, 45.6],
  ],
  kueste(SCHWARZMEER_WEST, [29.7, 45.2], [30.75, 46.48]),
  SCHWARZMEER_NORD,
  [
    [42.0, 44.0],
    [42.0, 59.0],
    [24.5, 59.0],
  ],
);

/** Das Kaisertum Österreich 1812 — nach den Niederlagen von 1805 und 1809. */
const OESTERREICH_1812 = [
  [16.0, 45.9],
  [16.5, 45.2],
  [17.5, 45.1],
  [18.9, 44.9],
  [20.4, 44.85],
  [21.5, 44.7],
  [22.5, 44.6],
  [23.0, 45.2],
  [25.0, 45.5],
  [26.1, 46.2],
  [26.0, 47.0],
  [25.3, 47.9],
  [26.3, 48.2],
  [25.5, 48.8],
  [26.0, 49.3],
  [25.5, 49.6],
  [24.2, 50.0],
  [23.0, 50.2],
  [22.6, 50.0], // West-Galizien ging 1809 an das Herzogtum Warschau
  [22.3, 49.7],
  [21.5, 49.4],
  [20.5, 49.4],
  [19.5, 49.5],
  [19.2, 50.4],
  [18.5, 50.0],
  [17.9, 50.2],
  [17.4, 50.2],
  [16.6, 50.4],
  [15.5, 50.7],
  [14.9, 51.0],
  [14.3, 51.0],
  [13.4, 50.7],
  [12.5, 50.4],
  [12.2, 50.3],
  [12.4, 49.8],
  [12.6, 49.4],
  [13.4, 48.9],
  [13.46, 48.57],
  [13.0, 48.3],
  [12.9, 47.8], // Salzburg ging 1809 an Bayern
  [13.1, 47.5],
  [13.0, 47.0],
  [13.6, 46.6],
  [14.8, 46.4],
  [15.8, 46.2],
];

/** Das Königreich Preußen nach dem Frieden von Tilsit 1807 — halbiert. */
const PREUSSEN_1807 = verbinde(
  kueste(OSTSEE_SUED, [13.1, 54.31], [18.65, 54.35]),
  kueste(OSTSEE_OST, [18.65, 54.35], [21.05, 55.7]),
  [
    [22.0, 55.3],
    [22.9, 54.6],
    [22.8, 53.9],
    [21.8, 53.5],
    [20.3, 53.2],
    [19.3, 53.35],
    [18.9, 53.05],
    [18.2, 53.1],
    [17.3, 53.1],
    [16.4, 53.0],
    [15.9, 52.7],
    [15.6, 52.3],
    [16.3, 51.4],
    [17.4, 51.2],
    [18.0, 50.7],
    [18.9, 50.4],
    [17.4, 50.2],
    [16.6, 50.4],
    [15.5, 50.7],
    [14.9, 51.0],
    [14.6, 51.4],
    [13.5, 51.5],
    [12.9, 51.7],
    [12.4, 52.0],
    [11.9, 52.2],
    [11.6, 52.6], // die Elbe — alles westlich davon war 1807 verloren
    [11.6, 53.05],
    [12.2, 53.2],
    [12.6, 53.6],
    [12.8, 54.2],
  ],
);

/** Das Osmanische Reich auf dem Balkan nach dem Frieden von Bukarest 1812. */
const OSMANEN_BALKAN_1812 = verbinde(
  kueste(BALKAN_ADRIA, [18.55, 42.4], [19.49, 40.46]),
  GRIECHENLAND,
  MARMARA_NORD,
  kueste(SCHWARZMEER_WEST, [29.1, 41.2], [29.7, 45.2]),
  [
    [28.5, 45.6],
    [28.2, 46.4],
    [27.0, 47.5],
    [26.6, 48.2], // der Pruth, seit Mai 1812 die Grenze zu Russland
    [26.3, 48.2],
    [26.0, 47.0],
    [26.1, 46.2],
    [25.0, 45.5],
    [23.0, 45.2],
    [22.5, 44.6],
    [21.5, 44.7],
    [20.4, 44.85],
    [18.9, 44.9],
    [18.5, 44.2],
    [18.7, 43.4],
    [18.3, 42.9],
  ],
);

// ---------------------------------------------------------------------------
// Bausteine: die Ordnung des Wiener Kongresses, 1815
// ---------------------------------------------------------------------------

/** Das Königreich der Niederlande — Norden und Süden in einem Staat. */
const NIEDERLANDE_1815 = verbinde(
  kueste(NORDSEE, [2.4, 51.1], [7.2, 53.6]),
  [
    [7.1, 53.2],
    [6.9, 52.6],
    [6.7, 52.2],
    [6.1, 51.9],
    [6.1, 51.1],
    [6.3, 50.5],
    [6.1, 50.1],
    [5.9, 49.7],
    [5.0, 49.3],
    [4.2, 49.7],
    [3.3, 50.1],
    [2.6, 50.8],
  ],
);

/** Preußens neue Westprovinzen: Rheinland und Westfalen. */
const PREUSSEN_WEST_1815 = [
  [5.9, 50.7],
  [6.1, 51.9],
  [7.0, 52.2],
  [7.5, 52.4],
  [8.6, 52.4],
  [9.2, 51.9],
  [8.9, 51.4],
  [8.4, 50.9],
  [7.6, 50.3],
  [7.0, 49.5],
  [6.4, 49.5],
  [6.1, 50.1],
];

/** Preußens Ostblock 1815 — mit Posen, halb Sachsen und Schwedisch-Pommern. */
const PREUSSEN_OST_1815 = verbinde(
  kueste(OSTSEE_SUED, [13.1, 54.31], [18.65, 54.35]),
  kueste(OSTSEE_OST, [18.65, 54.35], [21.05, 55.7]),
  [
    [22.0, 55.3],
    [22.9, 54.6],
    [22.8, 53.9],
    [21.8, 53.5],
    [20.3, 53.2],
    [19.3, 53.35],
    [19.0, 53.0],
    [18.6, 52.6],
    [18.2, 52.3],
    [18.1, 51.6],
    [17.4, 51.2],
    [18.0, 50.7],
    [18.9, 50.4],
    [17.4, 50.2],
    [16.6, 50.4],
    [15.5, 50.7],
    [14.9, 51.0],
    [14.7, 51.35], // die Oberlausitz kam 1815 an Preußen
    [13.5, 51.5],
    [12.6, 51.5],
    [12.2, 51.2],
    [11.8, 51.0],
    [11.0, 51.3],
    [10.6, 51.7],
    [11.0, 52.3],
    [11.2, 52.6],
    [11.0, 53.0],
    [11.4, 53.3],
    [12.3, 53.4],
    [12.9, 53.9],
  ],
);

/** Das Kaisertum Österreich 1815 — mit dem neuen Königreich Lombardo-Venetien. */
const OESTERREICH_1815 = HABSBURG_1789;

/** Lombardo-Venetien — Mailand und Venedig unter österreichischer Krone. */
const LOMBARDO_VENETIEN = verbinde(
  kueste(ITALIEN_ADRIA, [12.3, 44.8], [13.65, 45.7]),
  [
    [13.9, 45.9],
    [13.5, 46.3],
    [12.5, 46.5],
    [11.5, 46.5],
    [10.5, 46.4],
    [9.3, 46.3],
    [8.6, 45.9],
    [8.75, 45.2],
    [9.2, 44.95],
    [10.0, 45.05],
    [11.3, 45.0],
    [12.0, 44.9],
  ],
);

/**
 * Die übrigen Staaten des Deutschen Bundes.
 *
 * Der Bund von 1815 bestand aus 39 souveränen Staaten — darunter Österreich
 * und Preußen mit ihren deutschen Gebieten. Neununddreißig einzelne Umrisse
 * wären auf diesem Maßstab unlesbar; deshalb steht hier alles, was NICHT
 * Preußen oder Österreich war, als zwei Flächen: der Süden mit Bayern,
 * Württemberg, Baden, Hessen und Sachsen, der Norden mit Hannover, Braunschweig,
 * Oldenburg und Mecklenburg. Der Hinweis der Phase sagt, dass das eine
 * Vereinfachung ist.
 */
const DEUTSCHER_BUND_SUED = [
  [9.75, 47.5],
  [8.6, 47.6],
  [7.8, 48.6],
  [8.1, 49.0],
  [7.5, 49.4],
  [7.0, 49.5],
  [7.6, 50.3],
  [8.4, 50.9],
  [8.9, 51.4],
  [9.2, 51.9],
  [10.6, 51.7],
  [11.0, 51.3],
  [11.8, 51.0],
  [12.2, 51.2],
  [12.6, 51.5],
  [13.5, 51.5],
  [14.7, 51.35],
  [14.3, 51.0],
  [13.4, 50.7],
  [12.5, 50.4],
  [12.2, 50.3],
  [12.4, 49.8],
  [12.6, 49.4],
  [13.4, 48.9],
  [13.46, 48.57],
  [13.0, 48.3],
  [12.75, 47.9],
  [12.17, 47.58],
  [11.0, 47.4],
  [10.2, 47.35],
];

const DEUTSCHER_BUND_NORD = verbinde(
  kueste(NORDSEE, [7.2, 53.6], [8.7, 53.87]),
  [
    [10.0, 53.55], // die Elbe bei Hamburg
    [10.87, 53.87],
    [11.5, 54.0],
  ],
  kueste(OSTSEE_SUED, [11.5, 54.15], [12.6, 54.15]),
  [
    [12.8, 54.2],
    [12.6, 53.6],
    [12.2, 53.2],
    [11.6, 53.05],
    [11.2, 52.6],
    [11.0, 52.3],
    [10.6, 51.7],
    [9.9, 51.6],
    [9.2, 51.9],
    [8.6, 52.4],
    [7.5, 52.4],
    [7.0, 52.6],
    [7.05, 53.2],
  ],
);

/** Das Russische Reich 1815 — mit dem Königreich Polen unter dem Zaren. */
const RUSSLAND_1815 = verbinde(
  kueste(OSTSEE_OST, [24.5, 58.6], [21.05, 55.7]),
  [
    [22.0, 55.3],
    [22.9, 54.6],
    [22.8, 53.9],
    [21.8, 53.5],
    [20.3, 53.2],
    [19.3, 53.35],
    [19.0, 53.0],
    [18.6, 52.6],
    [18.2, 52.3],
    [18.1, 51.6],
    [19.0, 50.8],
    [19.9, 50.15], // Krakau wurde eine Freie Stadt
    [20.9, 50.3],
    [21.9, 50.6],
    [22.7, 50.4],
    [23.6, 50.5],
    [24.2, 50.0],
    [25.5, 49.6],
    [26.0, 49.3],
    [26.6, 48.2],
    [27.0, 47.5],
    [28.2, 46.4],
    [28.5, 45.6],
  ],
  kueste(SCHWARZMEER_WEST, [29.7, 45.2], [30.75, 46.48]),
  SCHWARZMEER_NORD,
  [
    [42.0, 44.0],
    [42.0, 59.0],
    [24.5, 59.0],
  ],
);

/** Das Königreich Sardinien-Piemont 1815 — vergrößert um Genua. */
const PIEMONT_1815_RING = verbinde(
  kueste(FRANKREICH_MITTELMEER, [7.07, 43.56], [8.95, 44.4]),
  [
    [9.6, 44.35],
    [9.5, 44.6],
    [9.0, 44.9],
    [8.75, 45.2],
    [8.6, 45.9],
    [7.9, 46.25],
    [7.0, 45.9],
    [6.2, 45.6],
    [6.7, 45.4],
    [7.1, 45.05],
    [6.85, 44.6],
    [7.0, 44.15],
    [7.15, 43.7],
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

/** Die Reichsgrenze von 1789 als blasse Linie über dem Untergrund. */
const reichsgrenze = () => ({
  art: 'reichsgrenze',
  d: geo.pfad(REICHSGRENZE_1789, { geschlossen: false }),
  fill: 'none',
  stroke: KARTENFARBEN.grenze,
  strokeWidth: 1.4,
});

/** Eine Gebietsfläche einer Phase. */
const gebiet = (titel, orte) => ({ titel, d: geo.pfad(orte) });

/**
 * Eine Gebietsfläche aus mehreren getrennten Stücken.
 *
 * Frankreich und Korsika sind eine Herrschaft, die dänischen Inseln sind drei
 * Inseln — beides gehört in eine Fläche mit einem Titel. SVG kann das: mehrere
 * geschlossene Teilpfade in einem `d`.
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
    land(KONTINENT),
    land(KLEINASIEN),
    land(BRITANNIEN),
    land(IRLAND),
    land(SKANDINAVIEN),
    land(AFRIKA),
    land(KORSIKA),
    land(SARDINIEN),
    land(ELBA),
    land(SIZILIEN),
    land(MALLORCA),
    land(KRETA),
    land(ZYPERN),
    land(SJAELLAND),
    land(FYN),
    land(LOLLAND_FALSTER),
    land(BORNHOLM),
    land(OELAND),
    fluss(RHEIN),
    fluss(SEINE),
    fluss(LOIRE),
    fluss(RHONE),
    fluss(PO),
    fluss(TIBER),
    fluss(DONAU),
    fluss(ELBE),
    fluss(ODER),
    fluss(WEICHSEL),
    fluss(NJEMEN),
    fluss(DUENA),
    fluss(DNJEPR),
    fluss(BERESINA),
    fluss(MOSKWA),
    fluss(WOLGA),
    fluss(EBRO),
    fluss(TAJO),
    fluss(GUADALQUIVIR),
    fluss(THEMSE),
    reichsgrenze(),
  ],

  phasen: [
    {
      id: 'ancien-regime',
      label: '1789',
      hinweis:
        'Europa am Vorabend der Revolution: ein Kontinent aus Königreichen, in dem fast überall ein Fürst von Gottes Gnaden regiert. Die blasse Linie quer durch die Mitte ist die Grenze des Heiligen Römischen Reiches — und mehr lässt sich vom Reich ehrlich nicht zeichnen: Innerhalb dieser Linie lagen über dreihundert Herrschaften mit eigenem Recht, eigener Münze, eigenem Glauben. Eingefärbt ist nur, was wirklich Grenzen hatte. Zwei Dinge lohnen den zweiten Blick: Polen-Litauen steht hier noch auf der Karte — sechs Jahre später gibt es diesen Staat nicht mehr. Und Korsika gehört seit 1768 zu Frankreich; ein Jahr danach wird dort Napoleon Bonaparte geboren. Weil alle Flächen dieselbe Farbe tragen, verschmelzen Nachbarn optisch zu einem Block; nur die Titel sagen, wer wer ist.',
      flaechen: [
        gebietTeile('Das Königreich Frankreich — mit Korsika, französisch seit 1768', [FRANKREICH_1789, KORSIKA]),
        gebietTeile('Großbritannien und Irland', GROSSBRITANNIEN),
        gebiet('Das Königreich Spanien — Bourbonen, mit Paris verbündet bis 1808', SPANIEN),
        gebiet('Das Königreich Portugal — Englands ältester Bündnispartner', PORTUGAL),
        gebiet('Die Habsburgermonarchie — Österreich, Böhmen, Ungarn, Galizien', HABSBURG_1789),
        gebiet('Die Österreichischen Niederlande', OESTERREICHISCHE_NIEDERLANDE),
        gebiet('Das Herzogtum Mailand — habsburgisch', LOMBARDEI),
        gebiet('Die Republik der Vereinigten Niederlande', NIEDERLANDE_REPUBLIK),
        gebietTeile('Das Königreich Preußen — der Ostblock und die Besitzungen am Rhein', [
          PREUSSEN_OST_1789,
          PREUSSEN_WEST_1789,
        ]),
        gebiet('Polen-Litauen — nach der ersten Teilung von 1772', POLEN_LITAUEN_1789),
        gebiet('Das Russische Reich — die Westgrenze liegt an Düna und Dnjepr', RUSSLAND_1789),
        gebietTeile('Das Osmanische Reich — mit den Fürstentümern Walachei und Moldau', [
          OSMANEN_BALKAN_1789,
          KLEINASIEN,
        ]),
        gebietTeile('Das Königreich Neapel und Sizilien — Bourbonen', [NEAPEL, SIZILIEN]),
        gebiet('Der Kirchenstaat', KIRCHENSTAAT),
        gebiet('Das Großherzogtum Toskana', TOSKANA),
        gebietTeile('Das Königreich Sardinien-Piemont — Savoyen, Nizza, Piemont, Sardinien', [PIEMONT, SARDINIEN]),
        gebiet('Die Republik Venedig — seit dem 8. Jahrhundert, noch acht Jahre', VENEDIG),
        gebiet('Das Königreich Dänemark — Jütland, Schleswig und Holstein', DAENEMARK_JUETLAND),
        gebietTeile('Die dänischen Inseln mit Kopenhagen', DAENEMARK_INSELN),
        gebiet('Das Königreich Schweden', SCHWEDEN_REICH),
      ],
    },
    {
      id: 'empire',
      label: '1805–1812',
      hinweis:
        'Das Kaiserreich auf seinem Höhepunkt. Der große Block reicht von der Elbmündung bis Rom — das ist Gebiet, das unmittelbar von Paris aus verwaltet wurde, mit französischem Recht, französischer Verwaltung und französischer Wehrpflicht. Daneben stehen die Staaten, die von Verwandten oder Verbündeten Napoleons regiert wurden: das Königreich Italien, Neapel unter seinem Schwager Murat, Spanien unter seinem Bruder Joseph, der Rheinbund, das Herzogtum Warschau. Zwei Dinge sind hier wichtig. Erstens: „Beherrscht" heißt nicht „befriedet" — in Spanien tobte seit 1808 ein Volkskrieg, den diese Farbe nicht zeigt. Zweitens: Moskau liegt in KEINER Phase im französischen Gebiet. Napoleon stand im September 1812 in der Stadt; einverleibt war sie nie. Der Feldzug ist deshalb ein Pfeil und keine Fläche — der Unterschied zwischen „ein Heer steht dort" und „das Land gehört dazu" ist der Kern dieses Kapitels.',
      flaechen: [
        gebietTeile('Das französische Kaiserreich — unmittelbar einverleibtes Gebiet, mit Korsika und den Illyrischen Provinzen', [
          KAISERREICH_1812,
          ILLYRISCHE_PROVINZEN,
          KORSIKA,
        ]),
        gebiet('Das Königreich Italien — Napoleon selbst ist sein König', KOENIGREICH_ITALIEN),
        gebiet('Das Königreich Neapel — regiert von Joachim Murat, Napoleons Schwager', NEAPEL),
        gebiet('Der Rheinbund — 1806 gegründet, das Ende des Heiligen Römischen Reiches', RHEINBUND),
        gebiet('Das Herzogtum Warschau — für viele Polen die Hoffnung auf einen eigenen Staat', HERZOGTUM_WARSCHAU),
        gebiet('Die Schweiz — 1803 durch die Mediationsakte neu geordnet', SCHWEIZ),
        gebiet('Das Königreich Spanien unter Joseph Bonaparte — beherrscht, aber nie befriedet', SPANIEN),
        gebiet('Das Königreich Portugal — mit britischen Truppen im Land', PORTUGAL),
        gebietTeile('Großbritannien und Irland — nie besiegt, nie erreicht', GROSSBRITANNIEN),
        gebiet('Das Russische Reich — bis 1812 Bündnispartner, dann Kriegsgegner', RUSSLAND_1812),
        gebiet('Das Kaisertum Österreich — nach den Niederlagen von 1805 und 1809', OESTERREICH_1812),
        gebiet('Das Königreich Preußen — nach dem Frieden von Tilsit 1807 halbiert', PREUSSEN_1807),
        gebietTeile('Das Osmanische Reich — seit Mai 1812 im Frieden mit Russland', [
          OSMANEN_BALKAN_1812,
          KLEINASIEN,
        ]),
        gebiet('Das Königreich Sizilien — die Bourbonen unter britischem Schutz', SIZILIEN),
        gebiet('Das Königreich Dänemark — an der Seite Napoleons', DAENEMARK_JUETLAND),
        gebietTeile('Die dänischen Inseln mit Kopenhagen', DAENEMARK_INSELN),
        gebiet('Das Königreich Schweden', SCHWEDEN_REICH),
      ],
    },
    {
      id: 'wiener-kongress',
      label: '1815',
      hinweis:
        'Europa nach Waterloo, so wie es der Wiener Kongress ordnete. Frankreich steht wieder in den Grenzen von 1792 — bestraft wurde das Land bemerkenswert milde, weil die Sieger einen dauerhaften Frieden wollten und keinen Racheakt. Sonst ist fast nichts wie 1789: Die blasse Linie im Untergrund gehört zu einem Reich, das es seit 1806 nicht mehr gibt; an seine Stelle tritt der Deutsche Bund aus 39 Staaten. Preußen hat das Rheinland und halb Sachsen, Österreich Lombardo-Venetien, Russland das Königreich Polen. Die Republik Venedig ist verschwunden, die Niederlande sind ein Königreich, Polen-Litauen kommt nicht wieder. Und der Code civil bleibt in Gebrauch, auch dort, wo man die französischen Truppen verjagt hat. Achtung bei den Farben: Die 39 Bundesstaaten stehen hier als zwei Flächen zusammengefasst — 39 einzelne Umrisse wären auf diesem Maßstab nicht mehr lesbar.',
      flaechen: [
        gebietTeile('Das Königreich Frankreich — zurück in den Grenzen von 1792, mit Korsika', [FRANKREICH_1789, KORSIKA]),
        gebietTeile('Großbritannien und Irland', GROSSBRITANNIEN),
        gebiet('Das Königreich der Niederlande — Nord und Süd in einem Staat', NIEDERLANDE_1815),
        gebietTeile('Das Königreich Preußen — mit dem Rheinland, Westfalen, Posen und halb Sachsen', [
          PREUSSEN_OST_1815,
          PREUSSEN_WEST_1815,
        ]),
        gebietTeile('Das Kaisertum Österreich — mit dem neuen Königreich Lombardo-Venetien', [
          OESTERREICH_1815,
          LOMBARDO_VENETIEN,
        ]),
        gebietTeile('Die übrigen Staaten des Deutschen Bundes — Bayern, Sachsen, Hannover, Württemberg und dreißig weitere', [
          DEUTSCHER_BUND_SUED,
          DEUTSCHER_BUND_NORD,
        ]),
        gebiet('Das Russische Reich — mit dem Königreich Polen unter dem Zaren', RUSSLAND_1815),
        gebiet('Das Königreich Spanien', SPANIEN),
        gebiet('Das Königreich Portugal', PORTUGAL),
        gebietTeile('Das Königreich Sardinien-Piemont — vergrößert um Genua', [PIEMONT_1815_RING, SARDINIEN]),
        gebiet('Das Großherzogtum Toskana', TOSKANA),
        gebiet('Der Kirchenstaat — wiederhergestellt', KIRCHENSTAAT),
        gebietTeile('Das Königreich beider Sizilien', [NEAPEL, SIZILIEN]),
        gebiet('Die Schweizerische Eidgenossenschaft — für neutral erklärt', SCHWEIZ),
        gebietTeile('Das Osmanische Reich', [OSMANEN_BALKAN_1812, KLEINASIEN]),
        gebiet('Das Königreich Dänemark — Norwegen ist 1814 an Schweden gefallen', DAENEMARK_JUETLAND),
        gebietTeile('Die dänischen Inseln mit Kopenhagen', DAENEMARK_INSELN),
        gebiet('Das Königreich Schweden — seit 1814 in Union mit Norwegen', SCHWEDEN_REICH),
      ],
    },
  ],

  punkte: [
    {
      id: 'paris',
      name: 'Paris',
      typ: 'ereignis',
      ...ort(2.35, 48.86),
      text: [
        'Am 14. Juli 1789 stürmte eine Menge die Bastille, ein Staatsgefängnis mit',
        'gerade einmal sieben Insassen. Militärisch war das unbedeutend, als Zeichen',
        'war es alles: Das Volk hatte eine Festung des Königs genommen. Wenige Wochen',
        'davor hatten die Abgeordneten des Dritten Standes in Versailles im Ballhaus',
        'geschworen, nicht auseinanderzugehen, bis Frankreich eine Verfassung habe;',
        'am 26. August beschloss die Nationalversammlung die Erklärung der Menschen-',
        'und Bürgerrechte: „Die Menschen werden frei und gleich an Rechten geboren."',
        'Vier Jahre später stand auf demselben Platz, an dem heute der Obelisk steht,',
        'die Guillotine: Am 21. Januar 1793 wurde Ludwig XVI. hingerichtet, im Terror',
        'von 1793/94 folgten rund 17 000 Todesurteile — und am 28. Juli 1794 traf es',
        'Robespierre selbst. In derselben Stadt krönte sich am 2. Dezember 1804',
        'Napoleon Bonaparte in Notre-Dame zum Kaiser der Franzosen. Zwischen dem',
        'Schwur im Ballhaus und der Kaiserkrone lagen fünfzehn Jahre.',
      ].join(' '),
    },
    {
      id: 'trafalgar',
      name: 'Trafalgar',
      typ: 'ereignis',
      ...ort(-6.03, 36.18),
      text: [
        'Am 21. Oktober 1805 zerschlug die britische Flotte unter Admiral Horatio',
        'Nelson vor dem Kap Trafalgar die vereinigte französisch-spanische Flotte:',
        'zweiundzwanzig Schiffe verloren die einen, kein einziges die anderen. Nelson',
        'selbst wurde tödlich getroffen. Die Folge bestimmte die nächsten zehn Jahre.',
        'Eine Landung in England war damit erledigt — das Lager bei Boulogne, in dem',
        'seit 1803 Zehntausende Soldaten auf die Überfahrt warteten, wurde aufgelöst.',
        'Napoleon beherrschte den Kontinent, Großbritannien das Meer. Aus dieser',
        'Pattstellung entstand die Kontinentalsperre: Ab 1806 durfte kein europäischer',
        'Hafen mehr britische Waren annehmen. Sie traf England hart, den Kontinent aber',
        'auch — und sie war der Grund, warum Napoleon am Ende Portugal, Spanien und',
        'Russland zwingen wollte mitzumachen. Der Weg nach Moskau beginnt hier, auf',
        'dem Wasser vor Spanien.',
      ].join(' '),
    },
    {
      id: 'madrid',
      name: 'Madrid',
      typ: 'ereignis',
      ...ort(-3.7, 40.42),
      text: [
        'Am 2. Mai 1808 erhoben sich die Einwohner Madrids gegen die französischen',
        'Truppen; am Tag darauf ließ Marschall Murat die Gefangenen erschießen.',
        'Francisco de Goya hat beide Tage gemalt — „El tres de mayo" zeigt einen Mann',
        'mit ausgebreiteten Armen vor den Gewehren und gilt bis heute als eines der',
        'ersten Bilder, die Krieg nicht als Heldentat zeigen. Was folgte, war neu:',
        'kein Feldzug gegen ein Heer, sondern ein Krieg gegen ein ganzes Land. Das',
        'spanische Wort dafür ist bis heute in Gebrauch — „guerrilla", der kleine',
        'Krieg. Napoleon setzte seinen Bruder Joseph als König ein und gewann jede',
        'große Schlacht; das Land bekam er nie. Sechs Jahre banden bis zu 300 000',
        'französische Soldaten, während in Cádiz eine Cortes tagte, die 1812 eine',
        'liberale Verfassung beschloss — im selben Krieg, in dem gegen die',
        'Franzosen gekämpft wurde, wurden also deren eigene Ideen aufgegriffen. Auch',
        'das gehört zu dieser Geschichte.',
      ].join(' '),
    },
    {
      id: 'austerlitz',
      name: 'Austerlitz',
      typ: 'ereignis',
      ...ort(16.76, 49.15),
      text: [
        'Am 2. Dezember 1805, auf den Tag ein Jahr nach der Kaiserkrönung, schlug',
        'Napoleon bei Austerlitz nordöstlich von Wien die vereinten Heere Österreichs',
        'und Russlands — die „Dreikaiserschlacht". Er hatte sein Zentrum absichtlich',
        'schwach aussehen lassen, den Gegner zum Angriff verlockt und dann die',
        'entblößte Mitte durchstoßen. Militärgeschichtlich gilt das bis heute als sein',
        'Meisterstück, und es erklärt, warum Zeitgenossen ihn für unbesiegbar hielten.',
        'Die Folgen reichten weit über das Schlachtfeld: Österreich musste Frieden',
        'schließen, und am 6. August 1806 legte Franz II. die Krone des Heiligen',
        'Römischen Reiches nieder — nach über tausend Jahren war es zu Ende. An seine',
        'Stelle trat der Rheinbund unter französischem Protektorat. Zehn Jahre später',
        'tagte in Wien der Kongress, der Napoleons Werk wieder einsammelte.',
      ].join(' '),
    },
    {
      id: 'moskau',
      name: 'Moskau',
      typ: 'ereignis',
      ...ort(37.62, 55.75),
      text: [
        'Am 14. September 1812 zog Napoleon in Moskau ein — und fand eine Stadt fast',
        'ohne Einwohner. In der Nacht brachen Brände aus, die drei Viertel der Stadt',
        'vernichteten; wer sie legte, ist bis heute umstritten, vieles spricht für die',
        'russische Seite selbst. Fünf Wochen wartete der Kaiser auf ein Friedensangebot',
        'von Zar Alexander I., das nie kam. Vorher hatte am 7. September bei Borodino',
        'die blutigste Schlacht des ganzen Zeitalters stattgefunden: an einem einzigen',
        'Tag rund 70 000 Tote und Verwundete, ohne Entscheidung. Von den etwa 600 000',
        'Soldaten der Grande Armée — Franzosen, Deutsche, Italiener, Polen,',
        'Niederländer, Schweizer — kehrten schätzungsweise weniger als 100 000 zurück.',
        'Wichtig für diese Karte: Moskau war nie französisches Gebiet. Ein Heer, das',
        'in einer Stadt steht, hat sie nicht erobert. Genau daran zerbrach das',
        'Empire.',
      ].join(' '),
    },
    {
      id: 'leipzig',
      name: 'Leipzig',
      typ: 'ereignis',
      ...ort(12.37, 51.34),
      text: [
        'Vom 16. bis 19. Oktober 1813 kämpften bei Leipzig rund 600 000 Soldaten',
        'gegeneinander — die größte Schlacht Europas vor 1914, deshalb der Name',
        '„Völkerschlacht". Auf der einen Seite Napoleon mit französischen, polnischen',
        'und rheinbündischen Truppen, auf der anderen Russland, Preußen, Österreich',
        'und Schweden. Mitten in der Schlacht wechselten sächsische Regimenter die',
        'Seite. Napoleon verlor, zog sich über den Rhein zurück, und der Rheinbund',
        'zerfiel. Für die deutsche Geschichte ist Leipzig ein doppelter Ort: Hier',
        'endete die französische Vorherrschaft, und hier begann die Erzählung von den',
        '„Befreiungskriegen", die im 19. Jahrhundert zum Gründungsmythos des',
        'Nationalismus wurde. Die Freiwilligen, die 1813 auszogen, kämpften gegen',
        'Fremdherrschaft — viele von ihnen zugleich für Verfassung und Freiheitsrechte,',
        'also für Ziele, die aus Frankreich stammten. Bekommen haben sie die',
        'Restauration.',
      ].join(' '),
    },
    {
      id: 'waterloo',
      name: 'Waterloo',
      typ: 'ereignis',
      ...ort(4.4, 50.68),
      text: [
        'Am 18. Juni 1815 endete südlich von Brüssel eine Rückkehr, die hundert Tage',
        'gedauert hatte. Nach der ersten Abdankung 1814 war Napoleon auf die Insel Elba',
        'verbannt worden; am 1. März 1815 landete er in Südfrankreich, und die Truppen,',
        'die ihn festnehmen sollten, liefen zu ihm über. Bei Waterloo trafen sein Heer,',
        'die britisch geführte Armee unter Wellington und die preußische unter Blücher',
        'aufeinander. Napoleon war nahe daran; das Eintreffen der Preußen am Nachmittag',
        'entschied den Tag. Diesmal brachten ihn die Sieger nach St. Helena im',
        'Südatlantik, 1 900 Kilometer vom nächsten Festland entfernt; dort starb er',
        '1821. Sein Werk überlebte ihn ungleich: Die Grenzen zog der Wiener Kongress',
        'neu, die Fürsten kehrten zurück — aber der Code civil, die Gleichheit vor dem',
        'Gesetz und die Verwaltung nach Akten statt nach Geburt blieben in weiten',
        'Teilen Europas in Kraft.',
      ].join(' '),
    },
  ],

  bewegungen: [
    {
      id: 'russlandfeldzug',
      name: 'Der Vormarsch der Grande Armée nach Moskau (Juni bis September 1812)',
      von: p(23.9, 54.9),
      ueber: [p(25.3, 54.7), p(30.2, 55.2), p(32.05, 54.78), p(35.82, 55.52)],
      nach: p(37.62, 55.75),
      text: [
        'Am 24. Juni 1812 überschritt die Grande Armée bei Kaunas den Njemen — nach',
        'den meisten Schätzungen rund 600 000 Mann, das größte Heer, das Europa bis',
        'dahin gesehen hatte, und nur etwa zur Hälfte Franzosen: Deutsche aus dem',
        'Rheinbund, Italiener, Polen, Niederländer, Schweizer, Kroaten, sogar',
        'österreichische und preußische Kontingente. Der Anlass war die',
        'Kontinentalsperre, die Russland nicht länger mittrug. Der Weg führte über',
        'Wilna, Witebsk und Smolensk nach Borodino und Moskau. Die russischen Heere',
        'wichen zurück und verbrannten dabei, was sie nicht mitnehmen konnten — eine',
        'Entscheidung, die vor allem die eigene Bevölkerung traf. Bereits auf dem',
        'Hinweg starben Zehntausende an Hunger, Hitze, Ruhr und Typhus, lange bevor',
        'der erste Schnee fiel. Wer diesen Pfeil ansieht, sieht die Rechnung dieses',
        'Feldzugs: eine Nachschublinie von über tausend Kilometern in einem Land, das',
        'ein Heer dieser Größe nicht ernähren konnte.',
      ].join(' '),
    },
    {
      id: 'rueckzug',
      name: 'Der Rückzug aus Russland (Oktober bis Dezember 1812)',
      von: p(37.62, 55.75),
      ueber: [p(35.82, 55.52), p(32.05, 54.78), p(28.5, 54.25)],
      nach: p(22.0, 55.1),
      text: [
        'Am 19. Oktober 1812 verließ Napoleon Moskau. Der Rückweg führte über dieselbe',
        'ausgeplünderte Straße, auf der das Heer gekommen war; russische Reiterei und',
        'Bauernaufgebote griffen die Nachzügler unablässig an. Ende November staute',
        'sich der Rest der Armee an der Beresina: Auf zwei improvisierten Brücken kamen',
        'die kampffähigen Verbände hinüber, Tausende Nachzügler und Zivilisten blieben',
        'am Ostufer zurück. In mehreren Sprachen steht der Name des Flusses seither für',
        'eine Katastrophe. Kälte, Hunger und Krankheit taten den Rest — bis Mitte',
        'Dezember erreichte nur ein Bruchteil der Armee den Njemen. Napoleon selbst war',
        'da längst vorausgefahren, um in Paris ein neues Heer aufzustellen. Diese Linie',
        'ist die unbequemste dieses Kapitels: Sie zeigt, was passiert, wenn ein Krieg',
        'nicht mehr um ein Ziel geführt wird, sondern um den Beweis, dass man nicht',
        'nachgibt.',
      ].join(' '),
    },
    {
      id: 'elba-waterloo',
      name: 'Von Elba nach Waterloo — die Hundert Tage (März bis Juni 1815)',
      von: p(10.33, 42.8),
      ueber: [p(7.07, 43.56), p(5.73, 45.19), p(2.35, 48.86)],
      nach: p(4.4, 50.68),
      text: [
        'Nach seiner ersten Abdankung im April 1814 erhielt Napoleon die Insel Elba als',
        'Fürstentum — mit Titel, kleinem Hof und 1 000 Mann Garde. Am 26. Februar 1815',
        'stach er mit rund 1 100 Soldaten in See und landete am 1. März im Golf von',
        'Juan. Der Weg über Grenoble und Lyon nach Paris ist als „Flug des Adlers"',
        'bekannt geworden: Das Regiment, das ihn bei Laffrey aufhalten sollte, lief zu',
        'ihm über, nachdem er allein auf die Gewehre zugegangen war. Am 20. März war er',
        'in Paris, König Ludwig XVIII. auf der Flucht. Was folgte, waren die „Hundert',
        'Tage" — mit einer neuen, liberaleren Verfassung im Gepäck, denn ohne',
        'Zugeständnisse war das Land nicht mehr zu haben. Am 18. Juni entschied sich',
        'bei Waterloo alles. Diese Linie erzählt beides zugleich: wie groß die',
        'Anziehungskraft dieses Mannes noch war — und wie wenig davon am Ende blieb.',
      ].join(' '),
    },
  ],

  beschriftungen: [
    { text: 'Frankreich', art: 'land', ...ort(2.0, 47.2) },
    // Etwas südlich der Landesmitte, damit die Beschriftung nicht mit dem
    // Info-Punkt Madrid zusammenfällt.
    { text: 'Spanien', art: 'land', ...ort(-4.6, 38.9) },
    { text: 'Portugal', art: 'land', drehung: 80, ...ort(-8.3, 39.9) },
    { text: 'Italien', art: 'land', drehung: 45, ...ort(14.2, 41.6) },
    { text: 'Britannien', art: 'land', ...ort(-1.5, 52.8) },
    { text: 'Irland', art: 'land', ...ort(-7.9, 53.3) },
    { text: 'Russland', art: 'land', ...ort(34.0, 53.5) },
    { text: 'Polen', art: 'land', ...ort(20.2, 52.2) },
    { text: 'Böhmen', art: 'land', ...ort(14.6, 49.8) },
    { text: 'Ungarn', art: 'land', ...ort(19.4, 46.9) },
    { text: 'Griechenland', art: 'land', ...ort(21.9, 39.6) },
    { text: 'Anatolien', art: 'land', ...ort(33.0, 39.2) },
    { text: 'Nordafrika', art: 'land', ...ort(1.5, 35.6) },
    { text: 'Schweden', art: 'land', ...ort(14.2, 56.7) },
    { text: 'Dänemark', art: 'land', ...ort(9.3, 56.2) },
    // Auf dem Süden der Insel — sonst stünde „Korsika" auf demselben
    // Breitengrad wie „Elba", und beide Namen liefen ineinander.
    { text: 'Korsika', art: 'land', ...ort(8.95, 41.6) },
    { text: 'Elba', art: 'land', ...ort(10.9, 42.75) },
    { text: 'Sardinien', art: 'land', ...ort(9.0, 40.15) },
    { text: 'Sizilien', art: 'land', ...ort(14.0, 37.5) },
    { text: 'Krim', art: 'land', ...ort(34.3, 45.15) },
    { text: 'Pyrenäen', art: 'land', drehung: -8, ...ort(0.4, 42.8) },
    { text: 'Alpen', art: 'land', drehung: -18, ...ort(11.0, 46.9) },
    { text: 'Karpaten', art: 'land', drehung: -45, ...ort(24.2, 47.6) },
    { text: 'Atlantik', art: 'meer', ...ort(-7.0, 45.5) },
    { text: 'Nordsee', art: 'meer', ...ort(3.3, 54.6) },
    { text: 'Ostsee', art: 'meer', ...ort(17.8, 55.4) },
    { text: 'Mittelmeer', art: 'meer', ...ort(6.6, 38.9) },
    { text: 'Adria', art: 'meer', drehung: -50, ...ort(15.6, 42.6) },
    { text: 'Ägäis', art: 'meer', ...ort(25.0, 38.0) },
    { text: 'Schwarzes Meer', art: 'meer', ...ort(34.2, 43.2) },
    { text: 'Rhein', art: 'meer', drehung: 74, ...ort(7.4, 48.3) },
    { text: 'Njemen', art: 'meer', drehung: 25, ...ort(24.6, 54.4) },
    { text: 'Donau', art: 'meer', drehung: -20, ...ort(20.6, 45.0) },
  ],
};

module.exports = karte;

