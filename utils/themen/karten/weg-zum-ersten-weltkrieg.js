// Die Karte zum Thema „Der Weg zum Ersten Weltkrieg" — Geschichte in Bewegung.
//
// Die Küstenlinien stehen als echte Längen-/Breitengrade `[lon, lat]` und werden
// von utils/karte-geo.js in SVG-Koordinaten umgerechnet. Wer einen Punkt
// anzweifelt, schlägt ihn im Atlas nach: `[13.4, 52.52]` ist Berlin,
// `[18.43, 43.85]` ist Sarajevo, `[20.46, 44.82]` ist Belgrad.
//
// Der Ausschnitt: 10° W bis 45° O, 34° N bis 61° N — 700 × 508,7 (Betreiber-
// Vorschlag, siehe .claude/prompt-runde16.txt). Er ist dem Rahmen der
// Napoleon-Karte sehr ähnlich (10° W–40° O, 35–57° N), aber nach Osten und
// Norden erweitert: St. Petersburg liegt auf 59,94° N, ohne den nördlicheren
// Rahmen wäre Russlands Hauptstadt der Julikrise nicht auf der Karte gewesen.
//
// Was dieser Ausschnitt kostet: Skandinavien ist nur mit Südschweden vertreten
// (Norwegen und Nordschweden liegen für dieses Kapitel nicht im Zentrum),
// Nordafrika ist nur ein schmaler Streifen, und der Kaukasus endet am rechten
// Bildrand. Dafür passen die sieben Stationen der Julikrise auf ein Bild:
// Sarajevo im Südosten, London im Nordwesten, St. Petersburg im Nordosten.
//
// Fünf Festlegungen, die ausdrücklich hierher gehören:
//
//   1. **Die politischen Grenzen von 1871 bis 1914 sind angenähert, nicht
//      vermessen** — anders als die Küstenlinien, die auf echten
//      Atlas-Koordinaten beruhen. Das ist dieselbe Praxis wie bei den übrigen
//      Karten der App (z. B. der Dreißigjährige Krieg): Der Verlauf einer
//      Staatsgrenze von 1914 lässt sich nicht auf 0,1° genau belegen, ohne
//      historische Detailkarten zu kopieren — die grobe Lage genügt, um die
//      Bündnisblöcke erkennbar zu machen.
//   2. **Bosnien-Herzegowina ist 1871 osmanisch, ab 1907 österreichisch-
//      ungarisch verwaltet.** Österreich-Ungarn besetzte die Provinz 1878 (Berliner
//      Kongress) und annektierte sie 1908 förmlich — die Annexionskrise 1908/09
//      vergiftete das Verhältnis zu Serbien zusätzlich. Die Fläche
//      Österreich-Ungarns wächst deshalb zwischen der ersten und der zweiten
//      Phase um genau dieses Gebiet; Sarajevo liegt 1871 außerhalb, ab 1907
//      innerhalb der Doppelmonarchie.
//   3. **Das Osmanische Reich schrumpft auf dem Balkan über alle drei Phasen** —
//      1871 hält es noch weite Teile (Bulgarien, Mazedonien, Albanien), nach dem
//      Berliner Kongress 1878 und der bulgarischen Unabhängigkeit 1908 ist es
//      kleiner, nach den Balkankriegen 1912/13 bleibt nur ein schmaler Streifen
//      Ostthrakiens bei Konstantinopel übrig (die „Enos-Midia-Linie"). Genau
//      dieser Rückzug macht den Balkan zum „Pulverfass": Wo eine Ordnung
//      verschwindet, konkurrieren mehrere neue Mächte um das, was übrig bleibt.
//   4. **Serbien wächst zwischen 1907 und 1914** — die Balkankriege 1912/13
//      brachten dem Königreich Kosovo und Teile Mazedoniens. Ein größeres,
//      selbstbewussteres Serbien an der Grenze zu Bosnien ist Teil der
//      Spannung, die 1914 zum Attentat führte.
//   5. **Die Flächen tragen ihre Bündniszugehörigkeit im Titel**
//      („Deutsches Reich — Mittelmächte", „Frankreich — Entente"), nicht in der
//      Farbe: Alle Flächen einer Phase werden gleich eingefärbt (siehe
//      components/abschnitte/KarteAbschnitt.js). 1871 tragen die Flächen noch
//      keinen Bündnisnamen — die Blöcke gab es damals noch nicht.
//
// Reine Daten und Rechnung — keine UI-Importe (Architektur-Regel).

const { KARTENFARBEN, erstelleProjektion, rueckwaerts, verbinde, zeichnePfad } = require('../../karte-geo');

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

/**
 * Die Ostsee-Ostküste von St. Petersburg bis Danzig.
 *
 * Neu gegenüber der Napoleon-Karte: St. Petersburg lag dort über dem
 * Bildrand, hier ist es einer der sieben Info-Punkte und muss auf der Küste
 * liegen.
 */
const OSTSEE_OST = [
  [30.3, 59.94], // St. Petersburg, an der Newamündung
  [29.2, 60.05],
  [28.0, 59.9],
  [27.7, 59.47], // Narva
  [26.4, 59.48],
  [25.2, 59.6],
  [24.75, 59.44], // Tallinn (Reval)
  [23.9, 59.2],
  [23.3, 58.55],
  [24.0, 58.3], // Pärnu-Bucht, Nordseite
  [24.5, 57.85], // Pärnu
  [24.4, 57.6],
  [24.35, 57.4],
  [24.1, 57.05], // Riga, an der Düna
  [23.6, 56.95],
  [23.1, 57.15],
  [22.6, 57.75], // Kap Kolka
  [21.7, 57.5],
  [21.05, 56.55], // Libau
  [20.95, 56.05],
  [21.05, 55.7], // Memel — Grenze zwischen Ostpreußen und Russland
  [20.9, 55.3],
  [20.5, 55.0],
  [19.9, 54.65], // Pillau, der Hafen Königsbergs
  [19.3, 54.55],
  [18.9, 54.65],
  [18.65, 54.35], // Danzig, an der Weichselmündung
];

/** Die Ostsee-Südküste: Danzig → Kiel (deutsche Küste). */
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
  [-9.5, 38.78], // Cabo da Roca
  [-9.25, 38.68], // Lissabon
  [-8.9, 38.5], // Setúbal
  [-8.8, 38.0], // Sines
  [-8.9, 37.4],
  [-8.99, 37.02], // Kap São Vicente
  [-8.3, 37.1],
  [-7.93, 37.0], // Faro
  [-7.4, 37.17], // Guadianamündung — Grenze zu Portugal
  [-6.95, 37.2], // Huelva
  [-6.35, 36.85], // Mündung des Guadalquivir
  [-6.29, 36.53], // Cádiz
  [-5.9, 36.15], // Küste vor Trafalgar
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

/** Die Südküste Italiens: Straße von Messina → Bari (Absatz und Sporn). */
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

/** Die griechische Küste: Vlora → Preveza (Grenze zu Griechenland, vereinfacht). */
const EPIRUS = [
  [19.49, 40.46],
  [20.0, 39.87], // Sarandë, gegenüber Korfu
  [20.75, 38.96], // Preveza
];

/** Die Nordküste des Marmarameers: Gallipoli → Bosporus. */
const MARMARA_NORD = [
  [26.4, 40.35], // die Halbinsel Gallipoli, am Eingang der Dardanellen
  [27.0, 40.5],
  [27.9, 40.4],
  [28.7, 40.95],
  [28.98, 41.02], // Konstantinopel
  [29.1, 41.2], // der Bosporus, am Schwarzen Meer
];

/** Das Westufer des Schwarzen Meeres: Bosporus → Konstanza → Dnjestrmündung → Odessa. */
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
  [30.4, 46.3], // Mündung des Dnjestr — Grenze zwischen Rumänien und Russland
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

/** Anatoliens Nordküste: Bosporus → rechter Bildrand. */
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

/** Anatoliens Südküste (Ägäis/Mittelmeer): vereinfacht, schließt Kleinasien. */
const ANATOLIEN_SUED = [
  [27.3, 37.5],
  [27.26, 37.86],
  [26.9, 38.42], // Smyrna (Izmir)
  [26.7, 38.7],
  [26.85, 39.0],
  [26.7, 39.3],
  [26.2, 39.5],
  [26.2, 40.0],
  [26.4, 40.15], // Çanakkale, an den Dardanellen
  [26.4, 40.35], // Gallipoli
];

// ---------------------------------------------------------------------------
// Britannien, Irland, Skandinavien, Nordafrika
// ---------------------------------------------------------------------------

/** Britanniens Ostküste: Duncansby Head → Dover — der Rahmen reicht diesmal bis nach Nordschottland. */
const BRITANNIEN_OST = [
  [-3.9, 58.6], // Duncansby Head, bei John o’ Groats
  [-2.9, 58.4],
  [-2.1, 57.7],
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

/** Britanniens Westküste: Land’s End → Cape Wrath (Nordwestschottland). */
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
  [-5.2, 57.6],
  [-5.0, 58.6], // Cape Wrath
];

/** Irland. */
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
 * Südschweden — mehr von Skandinavien passt nicht auf diese Karte.
 *
 * Für den Weg zum Ersten Weltkrieg spielt Schweden keine tragende Rolle
 * (Kriegsschauplatz und Bündnisblöcke liegen weiter südlich); die Küste dient
 * hier nur der Wiedererkennbarkeit der Ostsee. Norwegen und Nordschweden
 * bleiben deshalb bewusst außen vor.
 */
const SCHWEDEN = [
  [17.0, 58.6],
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
  [11.4, 58.35],
];

/** Die Küste Nordwestafrikas: Tanger → Kap Bon. */
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
  [10.6, 36.4], // Hammamet
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

/** Die Donau — verbindet Wien, Budapest und Belgrad, das Rückgrat der Karte. */
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
  [20.5, 44.8], // Belgrad, am Zusammenfluss mit der Save
  [22.5, 44.6], // das Eiserne Tor
  [24.0, 43.8],
  [26.0, 44.0],
  [27.9, 44.5],
  [29.7, 45.2], // Donaudelta
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
  EPIRUS,
  // Vereinfachter Rückweg an der griechischen Küste vorbei zur thrakischen
  // Küste — Griechenland wird auf dieser Karte nicht als eigene Fläche
  // gezeichnet (es spielt in der Julikrise keine tragende Rolle), die
  // Landmasse selbst bleibt aber durchgehend.
  [
    [21.0, 39.3],
    [22.9, 39.0],
    [23.5, 40.0],
    [24.0, 40.8],
    [25.2, 40.85],
  ],
  MARMARA_NORD,
  SCHWARZMEER_WEST,
  SCHWARZMEER_NORD,
  // Rückweg über dem Bild: die russische Steppe und der Norden.
  [
    [42.0, 45.0],
    [42.0, 61.0],
    [30.3, 61.0],
  ],
);

const KLEINASIEN = verbinde(
  ANATOLIEN,
  [
    [41.0, 41.2],
    [41.5, 34.0],
    [27.0, 34.0],
  ],
  ANATOLIEN_SUED,
);

const BRITANNIEN = verbinde(BRITANNIEN_OST, BRITANNIEN_SUED, BRITANNIEN_WEST);

const SKANDINAVIEN = verbinde(SCHWEDEN, [
  [11.4, 61.0],
  [17.0, 61.0],
]);

const AFRIKA = verbinde(NORDAFRIKA, [
  [11.5, 34.0],
  [-6.5, 34.0],
  [-6.3, 35.2],
]);

// ---------------------------------------------------------------------------
// Politische Grenzen 1871–1914 — angenähert (siehe Kopf der Datei, Punkt 1)
// ---------------------------------------------------------------------------

/**
 * Deutsches Reich — von 1871 bis 1914 im Wesentlichen unverändert.
 *
 * Die Landgrenze (Emsmündung → Memel, über Aachen, Straßburg, Passau,
 * Oberschlesien) schließt sich über die Küste (Memel → Danzig → Kiel →
 * Flensburg → kurze Grenze zu Dänemark → Elbmündung → Emsmündung) zu einer
 * geschlossenen Fläche.
 */
const DEUTSCHES_REICH_GRENZE_LAND = [
  [7.2, 53.6], // Emsmündung, Grenze zu den Niederlanden
  [6.8, 52.2],
  [6.0, 51.8],
  [6.1, 50.8], // Aachen-Bereich, Grenze zu Belgien
  [6.4, 49.5], // Lothringen (deutsch seit 1871)
  [7.2, 48.55], // Vogesenkamm westlich von Straßburg — Straßburg selbst liegt östlich davon, am Rhein, und damit im Reichsgebiet
  [7.6, 47.6], // Basel, Grenze zur Schweiz
  [9.5, 47.5], // Bodensee
  [11.0, 47.4], // Allgäu, Grenze zu Österreich-Ungarn
  [12.2, 47.7], // Salzburg-Nähe
  [13.46, 48.57], // Passau
  [12.99, 50.3], // Fichtelgebirge
  [12.1, 50.3], // Erzgebirge, Grenze zu Böhmen
  [14.8, 50.85], // Grenze Sachsen/Böhmen
  [15.3, 50.1], // Grenze Schlesien/Mähren
  [18.9, 50.2], // Oberschlesien, Grenze zu Galizien
  [19.9, 50.6], // weiter Richtung Russisch-Polen
  [18.6, 51.8], // Posen, Grenze zu Russisch-Polen
  [17.9, 52.7],
  [17.0, 53.3],
  [20.0, 53.9], // Westpreußen/Ostpreußen, Grenze zu Russisch-Polen
  [21.5, 54.3], // Ostpreußen, Grenze zu Russland
  [22.7, 54.85],
  [21.05, 55.7], // Memel, an der Ostsee — schließt an die Küste an
];

const DEUTSCHES_REICH = verbinde(
  DEUTSCHES_REICH_GRENZE_LAND,
  kueste(OSTSEE_OST, [21.05, 55.7], [18.65, 54.35]), // Memel -> Danzig
  kueste(OSTSEE_SUED, [18.65, 54.35], [10.13, 54.33]), // Danzig -> Kiel
  kueste(JUETLAND_OST, [10.13, 54.33], [9.43, 54.79]), // Kiel -> Flensburg
  [[9.0, 54.9], [8.7, 54.9]], // kurze Landgrenze zu Dänemark
  kueste(JUETLAND_WEST, [8.7, 54.9], [8.7, 53.87]), // Husum-Bereich -> Elbmündung
  kueste(NORDSEE, [8.7, 53.87], [7.2, 53.6]), // Elbmündung -> Emsmündung, schließt
);

/**
 * Frankreich (Dritte Republik, nach 1871 ohne Elsass-Lothringen).
 *
 * Die Landgrenze schließt sich über die Atlantik- und Mittelmeerküste zu
 * einer geschlossenen Fläche.
 */
const FRANKREICH_GRENZE_LAND = [
  [4.2, 49.7], // belgische Grenze (Maas)
  [5.0, 49.3], // Ardennen
  [5.4, 48.5], // Grenze zu Lothringen (jetzt deutsch)
  [6.15, 48.95], // westlich von Straßburg — die neue Grenze von 1871
  [6.85, 47.6], // Vogesenkamm, Grenze bei Belfort
  [7.0, 47.5], // Belfort — die „Trouée de Belfort" blieb 1871 französisch
  [6.0, 46.15], // Genf-Bereich
  [6.7, 45.9], // Alpengrenze zur Schweiz
  [7.1, 45.05],
  [6.85, 44.6],
  [7.0, 44.15], // Grenze zu Italien
  [7.6, 43.8], // Nizza (seit 1860 französisch) — schließt an die Küste an
];

const FRANKREICH = verbinde(
  kueste(NORDSEE, [2.4, 51.1], [1.6, 50.95]), // Dünkirchen-Nähe -> Calais
  FRANKREICH_ATLANTIK, // Calais -> Bidassoa
  [
    [-1.78, 43.35], // die Bidassoa, spanische Grenze
    [-0.7, 42.9],
    [0.6, 42.7],
    [1.9, 42.5],
    [3.28, 42.32], // Cap de Creus — Pyrenäenkamm
  ],
  kueste(FRANKREICH_MITTELMEER, [3.28, 42.32], [7.6, 43.8]), // Cap de Creus -> Nizza
  rueckwaerts(FRANKREICH_GRENZE_LAND), // Nizza -> ... -> belgische Grenze, schließt
);

/** Österreich-Ungarn — der gemeinsame Nordost-Bogen aller drei Phasen. */
const OESTERREICH_UNGARN_GRENZE_NORDOST = [
  [19.4, 44.9], // Save-Mündung, gegenüber Belgrad
  [21.5, 45.5], // Banat
  [22.5, 46.2],
  [23.0, 47.0], // Siebenbürgen
  [25.0, 47.8],
  [26.0, 48.2], // Bukowina, Grenze zu Russland/Rumänien
  [25.3, 48.5],
  [24.0, 49.0], // Galizien, Grenze zu Russland
  [22.5, 49.5],
  [20.8, 49.4],
  [19.9, 50.0], // Krakau-Nähe
  [18.9, 50.2], // Oberschlesien-Grenze zu Deutschland
  [15.3, 50.1], // Mähren/Schlesien
  [14.8, 50.85], // Böhmen/Sachsen
  [12.1, 50.3], // Böhmen/Bayern
  [12.99, 50.3],
  [13.46, 48.57], // Passau
  [12.2, 47.7], // Salzburg
  [11.0, 47.4], // Allgäu/Tirol
  [10.4, 46.9], // Tirol, Grenze zur Schweiz
  [9.6, 46.5], // Vorarlberg
  [10.5, 46.5], // Südtirol, Grenze zu Italien
  [11.0, 46.5],
  [12.0, 46.6],
  [13.0, 46.5],
  [13.65, 45.7], // Triest
];

/**
 * Der schmale dalmatinische Küstenstreifen, 1871: Österreich hält Dalmatien
 * seit 1815, aber Bosnien-Herzegowina dahinter ist noch osmanisch.
 */
const OESTERREICH_UNGARN_BALKAN_1871 = [
  [18.55, 42.4], // Kotor
  [18.3, 42.6],
  [17.5, 43.0],
  [16.8, 43.3],
  [16.0, 43.9], // hinter Split — die Grenze bleibt hier knapp hinter der Küste
  [16.5, 44.5],
  [17.5, 45.0],
  [19.4, 44.9], // schließt an den Nordost-Bogen an
];

/**
 * Mit Bosnien-Herzegowina, ab 1878 besetzt und 1908 annektiert: Die Grenze
 * reicht jetzt bis zur Drina, Sarajevo liegt darin.
 */
const OESTERREICH_UNGARN_BALKAN_MIT_BOSNIEN = [
  [18.55, 42.4], // Kotor
  [19.3, 42.7],
  [19.5, 43.5],
  [19.0, 44.0], // die Drina, Grenze zu Serbien
  [19.4, 44.9], // Save-Mündung, gegenüber Belgrad
];

const OESTERREICH_UNGARN_1871 = verbinde(
  kueste(BALKAN_ADRIA, [13.65, 45.7], [18.55, 42.4]),
  OESTERREICH_UNGARN_BALKAN_1871,
  OESTERREICH_UNGARN_GRENZE_NORDOST,
);

const OESTERREICH_UNGARN_MIT_BOSNIEN = verbinde(
  kueste(BALKAN_ADRIA, [13.65, 45.7], [18.55, 42.4]),
  OESTERREICH_UNGARN_BALKAN_MIT_BOSNIEN,
  OESTERREICH_UNGARN_GRENZE_NORDOST,
);

/** Russisches Reich (Westteil) — Grenzverlauf 1871 bis 1914 im Wesentlichen gleich. */
const RUSSLAND_GRENZE_SUEDWEST = [
  [20.95, 56.05], // knapp nördlich von Memel
  [21.5, 54.3],
  [20.0, 53.9],
  [18.6, 53.7],
  [17.9, 52.7],
  [18.6, 51.8],
  [19.9, 50.0], // Krakau-Nähe (Grenze zu Galizien)
  [20.8, 49.4],
  [22.5, 49.5],
  [24.0, 49.0], // Galizien-Grenze
  [25.3, 48.5],
  [26.0, 48.2], // Bukowina/Grenze zu Rumänien
  [27.5, 47.5],
  [28.2, 46.5], // Bessarabien, Richtung Schwarzes Meer
  [30.4, 46.3], // Mündung des Dnjestr
];

const RUSSLAND = verbinde(
  kueste(OSTSEE_OST, [30.3, 59.94], [20.95, 56.05]),
  RUSSLAND_GRENZE_SUEDWEST,
  kueste(SCHWARZMEER_WEST, [30.4, 46.3], [30.75, 46.48]),
  SCHWARZMEER_NORD,
  [
    [42.0, 45.0],
    [42.0, 61.0],
    [30.3, 61.0],
  ],
);

/** Königreich Italien — die Küste plus die Alpengrenze im Norden. */
const ITALIEN = verbinde(
  [[7.6, 43.8]],
  kueste(ITALIEN_ADRIA, [13.0, 46.5], [16.87, 41.13]),
  kueste(ITALIEN_SUED, [16.87, 41.13], [15.65, 38.27]),
  kueste(ITALIEN_WEST, [15.65, 38.27], [8.95, 44.4]),
  kueste(FRANKREICH_MITTELMEER, [8.95, 44.4], [7.6, 43.8]),
  [
    [7.0, 44.15],
    [9.6, 46.5],
    [10.5, 46.5],
    [11.0, 46.5],
    [12.0, 46.6],
    [13.0, 46.5],
  ],
);

/** Vereinigtes Königreich — Britannien und Irland als zwei Ringe einer Fläche. */
const VEREINIGTES_KOENIGREICH_D = () =>
  `${geo.pfad(BRITANNIEN)} ${geo.pfad(IRLAND)}`;

/**
 * Osmanisches Reich, Balkanbesitz 1871 — noch weite Teile Südosteuropas
 * (Bulgarien, Mazedonien, Albanien), aber nicht Serbien, Montenegro, Rumänien
 * oder Griechenland, die längst eigene (teil-)souveräne Staaten waren.
 */
const OSMANEN_BALKAN_GRENZE_1871 = [
  [19.49, 40.46], // Vlora, an der Küste
  [20.5, 40.0], // Epirus, Grenze zu Griechenland
  [21.0, 40.3],
  [21.8, 40.8],
  [22.3, 41.0], // Mazedonien
  [23.5, 41.8], // Grenze zu Serbien (noch klein)
  [24.5, 42.0],
  [25.0, 42.3],
  [26.0, 42.0],
  [27.47, 42.5], // Warna-Nähe, trifft die Schwarzmeerküste
];

const OSMANISCHES_REICH_BALKAN_1871 = verbinde(
  rueckwaerts(OESTERREICH_UNGARN_BALKAN_1871),
  kueste(BALKAN_ADRIA, [18.55, 42.4], [19.49, 40.46]),
  OSMANEN_BALKAN_GRENZE_1871,
  kueste(SCHWARZMEER_WEST, [27.85, 42.7], [29.7, 45.2]),
  rueckwaerts(kueste(DONAU, [20.5, 44.8], [29.7, 45.2])),
);

/**
 * Osmanisches Reich, Balkanbesitz 1907 — nach dem Berliner Kongress 1878 und
 * der bulgarischen Unabhängigkeit 1908 kleiner: nur noch Albanien, Mazedonien
 * und Thrakien.
 */
const OSMANISCHES_REICH_BALKAN_1907 = verbinde(
  kueste(BALKAN_ADRIA, [19.1, 42.09], [19.49, 40.46]),
  [
    [19.49, 40.46], // Vlora
    [20.5, 40.0],
    [21.0, 40.3],
    [21.8, 40.8],
    [22.3, 41.0],
    [22.6, 41.9], // Grenze zu Serbien (jetzt größer) und Bulgarien (unabhängig)
    [23.0, 42.3],
    [22.9, 43.0],
    [23.7, 41.3],
  ],
  [
    [26.4, 40.35], // Gallipoli
  ],
  kueste(MARMARA_NORD, [26.4, 40.35], [29.1, 41.2]),
  [
    [27.5, 42.0], // Grenze zu Bulgarien (Ostthrakien)
    [26.0, 42.0],
    [24.0, 42.0],
    [22.5, 42.2],
    [21.0, 42.4], // Grenze zu Serbien (Kosovo-Gebiet, das 1907 noch osmanisch ist)
    [19.8, 42.2],
    [19.1, 42.09], // zurück nach Bar
  ],
);

/**
 * Osmanisches Reich, Balkanbesitz 1914 — nach den Balkankriegen 1912/13 nur
 * noch ein schmaler Streifen Ostthrakiens bei Konstantinopel (die
 * „Enos-Midia-Linie").
 */
const OSMANISCHES_REICH_THRAKIEN_1914 = verbinde(
  kueste(MARMARA_NORD, [26.4, 40.35], [29.1, 41.2]),
  [
    [27.5, 42.0],
    [26.5, 41.5],
    [26.4, 40.35],
  ],
);

/** Königreich Serbien, 1907 — unabhängig seit 1878, aber noch ohne Kosovo. */
const SERBIEN_1907 = [
  [19.0, 44.0], // Drina, Grenze zu Bosnien
  [19.4, 44.9], // Save-Mündung, gegenüber Belgrad
  [20.46, 44.82], // Belgrad
  [21.5, 44.9],
  [22.7, 44.5],
  [22.9, 43.8], // Grenze zu Bulgarien
  [22.4, 42.9],
  [21.9, 42.3], // Grenze zum osmanischen Mazedonien
  [21.0, 42.6],
  [20.3, 42.9], // Grenze zu Montenegro
  [19.5, 43.5],
];

/** Königreich Serbien, 1914 — nach den Balkankriegen mit Kosovo und Nordmazedonien. */
const SERBIEN_1914 = [
  [19.0, 44.0],
  [19.4, 44.9],
  [20.46, 44.82],
  [21.5, 44.9],
  [22.7, 44.5],
  [22.9, 43.8],
  [23.3, 42.7], // reicht jetzt weiter nach Süden
  [22.0, 41.3], // Mazedonien, neu gewonnen
  [21.0, 41.1],
  [20.3, 42.0], // Kosovo, neu gewonnen
  [19.7, 42.5],
  [19.5, 43.5],
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
  { art: 'land', d: geo.pfad(AFRIKA), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(KORSIKA), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(SARDINIEN), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(SIZILIEN), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(KRETA), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(ZYPERN), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(SJAELLAND), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(FYN), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(BORNHOLM), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'fluss', d: geo.pfad(RHEIN, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
  { art: 'fluss', d: geo.pfad(DONAU, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
  { art: 'fluss', d: geo.pfad(ELBE, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
  { art: 'fluss', d: geo.pfad(ODER, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
  { art: 'fluss', d: geo.pfad(WEICHSEL, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
  { art: 'fluss', d: geo.pfad(THEMSE, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
];

const flaechenDeutschland = { titel: 'Deutsches Reich', d: geo.pfad(DEUTSCHES_REICH) };
const flaechenDeutschlandMittelmaechte = { titel: 'Deutsches Reich — Mittelmächte', d: geo.pfad(DEUTSCHES_REICH) };

const flaechenOesterreichUngarn1871 = { titel: 'Österreich-Ungarn', d: geo.pfad(OESTERREICH_UNGARN_1871) };
const flaechenOesterreichUngarnMittelmaechte = {
  titel: 'Österreich-Ungarn — Mittelmächte (mit Bosnien-Herzegowina)',
  d: geo.pfad(OESTERREICH_UNGARN_MIT_BOSNIEN),
};

const flaechenFrankreich = { titel: 'Frankreich', d: geo.pfad(FRANKREICH) };
const flaechenFrankreichEntente = { titel: 'Frankreich — Entente', d: geo.pfad(FRANKREICH) };

const flaechenRussland = { titel: 'Das Russische Reich', d: geo.pfad(RUSSLAND) };
const flaechenRusslandEntente = { titel: 'Das Russische Reich — Entente', d: geo.pfad(RUSSLAND) };

const flaechenItalien = { titel: 'Königreich Italien', d: geo.pfad(ITALIEN) };
const flaechenItalienDreibund = { titel: 'Königreich Italien — Dreibund', d: geo.pfad(ITALIEN) };

const flaechenVK = { titel: 'Vereinigtes Königreich', d: VEREINIGTES_KOENIGREICH_D() };
const flaechenVKEntente = { titel: 'Vereinigtes Königreich — Entente', d: VEREINIGTES_KOENIGREICH_D() };

const flaechenOsmanen1871 = { titel: 'Osmanisches Reich (Balkanbesitz)', d: geo.pfad(OSMANISCHES_REICH_BALKAN_1871) };
const flaechenOsmanen1907 = { titel: 'Osmanisches Reich (Balkanbesitz, nach 1878 kleiner)', d: geo.pfad(OSMANISCHES_REICH_BALKAN_1907) };
const flaechenOsmanen1914 = { titel: 'Osmanisches Reich (Ostthrakien, nach den Balkankriegen)', d: geo.pfad(OSMANISCHES_REICH_THRAKIEN_1914) };

const flaechenSerbien1907 = { titel: 'Königreich Serbien', d: geo.pfad(SERBIEN_1907) };
const flaechenSerbien1914 = { titel: 'Königreich Serbien', d: geo.pfad(SERBIEN_1914) };

const phasen = [
  {
    id: 'reichsgruendung',
    label: '1871',
    hinweis: [
      'Das Deutsche Reich steht seit Januar 1871, gerade erst gegründet in',
      'Versailles. Die Landkarte zeigt fünf Großmächte nebeneinander —',
      'aber noch keine festen Bündnisblöcke. Bismarcks Zweibund mit',
      'Österreich-Ungarn kommt erst 1879. Bosnien-Herzegowina ist noch',
      'osmanisch, Serbien ein kleines Königreich am Rand der Karte.',
    ].join(' '),
    flaechen: [
      flaechenDeutschland,
      flaechenOesterreichUngarn1871,
      flaechenFrankreich,
      flaechenRussland,
      flaechenItalien,
      flaechenVK,
      flaechenOsmanen1871,
    ],
  },
  {
    id: 'zwei-bloecke',
    label: '1907',
    hinweis: [
      'Nach der Tripel-Entente von 1907 stehen sich zwei Bündnisblöcke',
      'gegenüber: die Mittelmächte (Deutsches Reich, Österreich-Ungarn,',
      'nominell auch Italien im Dreibund) und die Entente (Frankreich,',
      'Russland, Großbritannien). Österreich-Ungarn verwaltet seit 1878',
      'Bosnien-Herzegowina — die Fläche ist deshalb größer als 1871.',
      'Serbien ist unabhängig, aber noch klein.',
    ].join(' '),
    flaechen: [
      flaechenDeutschlandMittelmaechte,
      flaechenOesterreichUngarnMittelmaechte,
      flaechenFrankreichEntente,
      flaechenRusslandEntente,
      flaechenItalienDreibund,
      flaechenVKEntente,
      flaechenOsmanen1907,
      flaechenSerbien1907,
    ],
  },
  {
    id: 'julikrise',
    label: '1914',
    hinweis: [
      'Dieselben Blöcke wie 1907 — aber der Balkan hat sich verändert.',
      'Serbien ist nach den Balkankriegen 1912/13 deutlich gewachsen, das',
      'Osmanische Reich auf einen schmalen Streifen bei Konstantinopel',
      'zusammengeschrumpft. Genau zwischen dem größeren Serbien und',
      'Österreich-Ungarns Bosnien liegt Sarajevo — die datierten Zustände',
      'zeigen die Lage vor dem Attentat, sie werten sie nicht.',
    ].join(' '),
    flaechen: [
      flaechenDeutschlandMittelmaechte,
      flaechenOesterreichUngarnMittelmaechte,
      flaechenFrankreichEntente,
      flaechenRusslandEntente,
      flaechenItalienDreibund,
      flaechenVKEntente,
      flaechenOsmanen1914,
      flaechenSerbien1914,
    ],
  },
];

const punkte = [
  {
    id: 'sarajevo',
    name: 'Sarajevo',
    typ: 'ereignis',
    ...ort(18.43, 43.85),
    text: [
      'Am 28. Juni 1914 erschoss der neunzehnjährige Gavrilo Princip, Mitglied',
      'der bosnisch-serbischen Untergrundbewegung „Junges Bosnien", in',
      'Sarajevo den österreichisch-ungarischen Thronfolger Erzherzog Franz',
      'Ferdinand und seine Frau Sophie. Es war der zweite Anschlagsversuch an',
      'diesem Tag; der erste, eine Bombe, hatte kurz zuvor nur ein',
      'Begleitfahrzeug getroffen. Ein Kutscher verfuhr sich, hielt zufällig',
      'genau dort, wo Princip stand — und schoss aus nächster Nähe.',
      'Bosnien-Herzegowina stand seit 1878 unter österreichisch-ungarischer',
      'Verwaltung, seit 1908 war es förmlich annektiert. Für viele Serben in',
      'der Region und im benachbarten Königreich Serbien war das eine',
      'fremde Herrschaft über Land, das sie als serbisch verstanden; für',
      'Wien war es befriedete Provinz. Das Attentat war der Funke — der',
      'Zündstoff hatte sich schon lange vorher angesammelt.',
    ].join(' '),
  },
  {
    id: 'wien',
    name: 'Wien',
    typ: 'stadt',
    ...ort(16.37, 48.21),
    text: [
      'Wien war die Hauptstadt einer Doppelmonarchie aus elf großen',
      'Nationalitäten, keine davon eine Mehrheit. Nach dem Attentat sah die',
      'Führung um Kaiser Franz Joseph und Außenminister Berchtold die',
      'Gelegenheit, die südslawische Frage — den Nationalismus, der die',
      'Vielvölkermonarchie von innen bedrohte — endgültig zu klären. Am 23.',
      'Juli 1914 stellte Österreich-Ungarn Serbien ein Ultimatum mit zehn',
      'Forderungen, bewusst so formuliert, dass eine vollständige Annahme',
      'kaum möglich war — diese Stimme benennt das selbst als eigene',
      'Entscheidung, nicht als Zufall. Am 28. Juli, einen Tag nach der als',
      'unzureichend gewerteten serbischen Antwort, erklärte Österreich-',
      'Ungarn Serbien den Krieg.',
    ].join(' '),
  },
  {
    id: 'berlin',
    name: 'Berlin',
    typ: 'stadt',
    ...ort(13.4, 52.52),
    text: [
      'Am 5. Juli 1914 sicherte Kaiser Wilhelm II. dem österreichisch-',
      'ungarischen Gesandten bedingungslose Unterstützung zu, falls Wien',
      'gegen Serbien vorgehe — den „Blankoscheck". Diese Stimme benennt ihn',
      'als eigenen Fehler: Berlin überließ Wien freie Hand, ohne die Folgen',
      'zu Ende zu denken, und ohne zu wissen, wie das Ultimatum am Ende',
      'aussehen würde. Dahinter stand der Zweibund von 1879 — die',
      'einzige feste Bündnisverpflichtung, die Deutschland noch besaß,',
      'nachdem Bismarcks kompliziertes System aus wechselnden Verträgen',
      'zerfallen war — und die Furcht vor einer „Einkreisung" durch',
      'Frankreich und Russland. Am 1. August erklärte Deutschland Russland',
      'den Krieg, am 3. August Frankreich; am 4. August marschierten',
      'deutsche Truppen ins neutrale Belgien ein, um Frankreich nach dem',
      'Schlieffen-Plan von Norden anzugreifen — ein klarer Bruch des',
      'Völkerrechts, den diese Stimme nicht beschönigt.',
    ].join(' '),
  },
  {
    id: 'belgrad',
    name: 'Belgrad',
    typ: 'stadt',
    ...ort(20.46, 44.82),
    text: [
      'Serbien antwortete am 25. Juli 1914 auf das österreichisch-ungarische',
      'Ultimatum — und akzeptierte fast alle zehn Forderungen, mit',
      'Vorbehalten nur bei zweien, die die eigene Souveränität berührt',
      'hätten (die Beteiligung österreichisch-ungarischer Beamter an den',
      'Ermittlungen auf serbischem Boden). Kaiser Wilhelm II. nannte die',
      'Antwort später selbst „einen großen moralischen Erfolg für Wien" und',
      '„jeden Kriegsgrund" hinfällig — doch da war die Mobilmachung in Wien',
      'bereits beschlossene Sache. Serbien mobilisierte gleichzeitig seine',
      'eigene Armee; drei Tage später, am 28. Juli, erklärte Österreich-',
      'Ungarn den Krieg, und am 29. Juli begann die Beschießung Belgrads.',
    ].join(' '),
  },
  {
    id: 'st-petersburg',
    name: 'St. Petersburg',
    typ: 'stadt',
    ...ort(30.3, 59.94),
    text: [
      'Russland verstand sich als Schutzmacht der slawischen Völker auf dem',
      'Balkan und insbesondere Serbiens — ein Motiv, das diese Stimme fair',
      'wiedergibt: Zar Nikolaus II. und seine Regierung sahen im',
      'österreichisch-ungarischen Ultimatum eine Demütigung Serbiens, die',
      'Russlands Ansehen als Großmacht beschädigen würde, nachdem man 1908',
      'bei der Annexion Bosniens bereits hatte zurückstecken müssen. Am 25.',
      'Juli ordnete Russland eine Teil-Mobilmachung gegen Österreich-Ungarn',
      'an, am 30. Juli die Generalmobilmachung — technisch kaum',
      'rückgängig zu machen, weil die riesigen russischen Eisenbahnpläne',
      'einmal angelaufen Wochen brauchten. Aus deutscher Sicht war das eine',
      'unmittelbare Bedrohung an der eigenen Ostgrenze und der Auslöser der',
      'eigenen Mobilmachung.',
    ].join(' '),
  },
  {
    id: 'paris',
    name: 'Paris',
    typ: 'stadt',
    ...ort(2.35, 48.86),
    text: [
      'Frankreich war seit 1892/94 durch ein Bündnis mit Russland verbunden',
      '— aus deutscher Sicht der Kern der „Einkreisung", aus französischer',
      'Sicht ein Sicherheitsnetz gegen einen übermächtigen Nachbarn. Im',
      'Hintergrund stand seit der Niederlage von 1871 und dem Verlust',
      'Elsass-Lothringens der Revanche-Gedanke, den auch diese Stimme',
      'nennt, ohne ihn Frankreich allein anzulasten. Am 1. August 1914',
      'forderte Deutschland von Frankreich Neutralität im',
      'deutsch-russischen Konflikt — mit der kaum erfüllbaren Zusatzforderung,',
      'zwei Grenzfestungen als Pfand zu übergeben. Frankreich mobilisierte',
      'stattdessen; am 3. August erklärte Deutschland Frankreich den Krieg,',
      'unter dem — nie belegten — Vorwand französischer Grenzverletzungen.',
    ].join(' '),
  },
  {
    id: 'london',
    name: 'London',
    typ: 'stadt',
    ...ort(-0.13, 51.51),
    text: [
      'Großbritannien war durch die Entente cordiale von 1904 mit',
      'Frankreich und seit 1907 auch mit Russland locker verbunden — keine',
      'feste Beistandspflicht, eher eine diplomatische Annäherung. Was',
      'London schließlich zum Kriegseintritt bewegte, benennt diese Stimme',
      'fair: der 1839 vertraglich garantierte Status Belgiens als',
      'neutraler Staat (den Deutschland am 4. August 1914 brach), die',
      'Furcht vor einer deutschen Vorherrschaft über den Kontinent und die',
      'eigene, seit 1904 gewachsene Bündnislogik. Am Abend des 4. August',
      '1914 (in Berlin war es zu dieser Stunde bereits der 5.) lief das',
      'britische Ultimatum an Deutschland ab, sich aus Belgien',
      'zurückzuziehen; als keine Antwort kam, war Großbritannien im',
      'Krieg — die letzte der Großmächte, die eintrat.',
    ].join(' '),
  },
];

const bewegungen = [
  {
    id: 'schlieffenplan',
    name: 'Der Schlieffen-Plan, 1914',
    von: [punkte.find((punkt) => punkt.id === 'berlin').x, punkte.find((punkt) => punkt.id === 'berlin').y],
    ueber: [p(4.35, 50.85)],
    nach: p(2.88, 48.96),
    text: [
      'Der deutsche Aufmarschplan von Generalstabschef Alfred von Schlieffen',
      'sah vor, Frankreich in wenigen Wochen durch einen weiten Bogen über',
      'das neutrale Belgien niederzuwerfen, bevor Russland seine',
      'Mobilmachung abschließen konnte — daher der enorme Zeitdruck der',
      'Julikrise, „besser jetzt als später". Am 4. August 1914 überschritten',
      'deutsche Truppen die belgische Grenze; der erwartete schnelle',
      'Durchmarsch geriet ins Stocken, unter anderem am Widerstand um',
      'Lüttich. Anfang September erreichten die deutschen Armeen die Marne',
      'vor Paris — dort stoppte sie eine französisch-britische',
      'Gegenoffensive. Paris selbst wurde nie erreicht: Aus dem geplanten',
      'Bewegungskrieg von wenigen Wochen wurde der Stellungskrieg, der bis',
      '1918 dauerte.',
    ].join(' '),
  },
  {
    id: 'russische-mobilmachung',
    name: 'Die russische Mobilmachung, 1914',
    von: [
      punkte.find((punkt) => punkt.id === 'st-petersburg').x,
      punkte.find((punkt) => punkt.id === 'st-petersburg').y,
    ],
    ueber: [p(21.0, 52.23)],
    nach: p(19.5, 52.5),
    text: [
      'Als Schutzmacht Serbiens ordnete Russland am 25. Juli 1914 eine',
      'Teil-Mobilmachung gegen Österreich-Ungarn an, am 30. Juli die',
      'Generalmobilmachung gegen alle Mittelmächte. Die riesigen',
      'russischen Streitkräfte brauchten Wochen, um an der Front',
      'zusammenzukommen — ein einmal begonnener Aufmarsch ließ sich kaum',
      'mehr stoppen, ohne die eigene Verteidigungsfähigkeit zu gefährden.',
      'Aus deutscher Sicht war genau das die unmittelbare Bedrohung, die',
      'den eigenen Mobilmachungsbefehl auslöste: Der Schlieffen-Plan',
      'verlangte, Frankreich zu schlagen, bevor die russische Dampfwalze',
      'anlief. Beide Seiten sahen sich zum Handeln gezwungen — genau diese',
      'Verzahnung der Mobilmachungspläne gehört zu den Lehren, die der',
      'Abschnitt „Was 1914 uns heute lehrt" aufgreift.',
    ].join(' '),
  },
  {
    id: 'angriff-auf-belgrad',
    name: 'Österreich-Ungarns Kriegserklärung, 1914',
    von: [punkte.find((punkt) => punkt.id === 'wien').x, punkte.find((punkt) => punkt.id === 'wien').y],
    nach: [punkte.find((punkt) => punkt.id === 'belgrad').x, punkte.find((punkt) => punkt.id === 'belgrad').y],
    text: [
      'Am 28. Juli 1914 erklärte Österreich-Ungarn Serbien den Krieg — einen',
      'Tag nach der als unzureichend gewerteten serbischen Antwort auf das',
      'Ultimatum. Bereits am folgenden Tag begann die Beschießung Belgrads',
      'von der anderen Seite der Save aus; ein größerer Bodenangriff auf',
      'Serbien scheiterte in den folgenden Wochen zunächst an der',
      'serbischen Armee. Diese Kriegserklärung war der erste offizielle',
      'Schritt der Julikrise vom Ultimatum zum Krieg — und der Auslöser für',
      'die russische Mobilmachung als Schutzmacht Serbiens, die wiederum',
      'die deutsche nach sich zog.',
    ].join(' '),
  },
];

const beschriftungen = [
  { text: 'Atlantik', art: 'meer', ...ort(-8.5, 45.5) },
  { text: 'Nordsee', art: 'meer', ...ort(3.0, 56.5) },
  { text: 'Ostsee', art: 'meer', ...ort(18.0, 57.5) },
  { text: 'Mittelmeer', art: 'meer', ...ort(10.0, 38.0) },
  { text: 'Schwarzes Meer', art: 'meer', ...ort(34.0, 43.5) },
  { text: 'Alpen', art: 'land', ...ort(9.5, 46.4), drehung: -20 },
  { text: 'Balkan', art: 'land', ...ort(22.0, 42.7) },
  { text: 'Deutsches Reich', art: 'land', ...ort(10.5, 51.2) },
  { text: 'Frankreich', art: 'land', ...ort(2.5, 46.8) },
  { text: 'Russland', art: 'land', ...ort(35.0, 55.5) },
  { text: 'Österreich-Ungarn', art: 'land', ...ort(17.5, 47.3), drehung: -10 },
  { text: 'Italien', art: 'land', ...ort(12.5, 43.0) },
  { text: 'Serbien', art: 'land', ...ort(21.0, 43.9) },
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
