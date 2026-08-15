// Die Karte zum Thema „Weimarer Republik und der Weg in die Diktatur" —
// Geschichte in Bewegung.
//
// Die Küstenlinien stehen als echte Längen-/Breitengrade `[lon, lat]` und
// werden von utils/karte-geo.js in SVG-Koordinaten umgerechnet. Wer einen
// Punkt anzweifelt, schlägt ihn im Atlas nach: `[13.4, 52.52]` ist Berlin,
// `[11.33, 50.98]` ist Weimar, `[18.65, 54.35]` ist Danzig.
//
// Der Ausschnitt: 2° O bis 23° O, 46° N bis 56° N — 700 × 529,7. Das sind
// 33,3 SVG-Einheiten je Längengrad und damit nach der Levante-Karte
// (140 Einheiten) die feinste Karte der App. Der Betreiber hat diesen Rahmen
// vorgeschlagen, und er passt genau: Das Deutsche Reich der Weimarer Zeit
// reicht von der niederländischen Grenze (rund 5,9° O) bis an die Ostgrenze
// Ostpreußens (rund 22,8° O) und von den Alpen (47,3° N) bis an die Ostsee
// (55,9° N). Weimar, Berlin und München liegen mitten im Bild, Danzig und der
// polnische Korridor oben rechts, das besetzte Rheinland links.
//
// Was dieser Ausschnitt kostet, steht hier, damit niemand es für einen Fehler
// hält: Paris liegt mit 2,35° O gerade eben am linken Bildrand und trägt
// deshalb keinen Info-Punkt; London, Rom, Moskau und Genf liegen außerhalb.
// Jütland ist über dem oberen Bildrand abgeschnitten, Norditalien, Ungarn und
// Jugoslawien schneidet der untere Rand an.
//
// Fünf Festlegungen, die ausdrücklich hierher gehören:
//
//   1. **Die Grenzen des Reiches sind auf allen drei Phasen dieselben.** Das
//      ist keine Bequemlichkeit, sondern die Aussage des Kapitels: Zwischen
//      1919 und 1933 hat sich am Staatsgebiet nichts geändert — was sich
//      geändert hat, war die Verfassungswirklichkeit im Inneren. Die Phasen
//      unterscheiden sich deshalb an dem, was um das Reich herum und über ihm
//      liegt: die alliierte Besatzung im Rheinland, das abgetrennte
//      Memelgebiet, die Freie Stadt Danzig, das Saargebiet.
//   2. **Die politischen Grenzen sind angenähert, nicht vermessen** — anders
//      als die Küstenlinien, die auf echten Atlas-Koordinaten beruhen. Das ist
//      dieselbe Praxis wie bei den übrigen Karten der App. Der Verlauf der
//      deutsch-polnischen Grenze von 1922 lässt sich nicht auf 0,1° genau
//      zeichnen, ohne historische Detailkarten abzumalen; die grobe Lage
//      genügt, damit man den Korridor, Ostpreußen und Oberschlesien erkennt.
//   3. **Die Karte datiert, sie bewertet nicht.** Jede Fläche trägt ihren
//      Zustand mit Jahreszahl im Titel — „Freie Stadt Danzig (Völkerbund, seit
//      1920)", „Memelgebiet — vom Reich abgetrennt (1920–1923)". Über die
//      Frage, ob diese Zustände gerecht waren, entscheidet die Karte nicht;
//      darüber streiten die Perspektiven und am Ende die Lernenden selbst.
//   4. **Eingefärbt wird nur, wo eine Herrschaft mit Grenzen plausibel ist —
//      und nur, was zu diesem Kapitel gehört.** Gezeichnet sind das Reich und
//      seine unmittelbaren Nachbarn (Frankreich, Belgien, Luxemburg, die
//      Niederlande, Dänemark, die Schweiz, Österreich, die Tschechoslowakei,
//      Polen, Danzig, Litauen). Staaten, die der Rahmen nur anschneidet und
//      die in diesem Kapitel keine Rolle spielen — Italien, Ungarn,
//      Jugoslawien, Schweden —, tragen bloß einen Namen. Sie sind nicht
//      vergessen, sie sind bewusst leer.
//   5. **Überlagerte Flächen sind Absicht.** Das besetzte Rheinland und das
//      Saargebiet liegen über der Reichsfläche, weil sie genau das waren:
//      deutsches Gebiet unter fremder Verwaltung. Weil die App alle Flächen
//      einer Phase gleich einfärbt (siehe components/abschnitte/
//      KarteAbschnitt.js, fillOpacity 0,72), erscheinen diese Gebiete dunkler
//      als das übrige Reich — genau der Effekt, den sie brauchen.
//
// Reine Daten und Rechnung — keine UI-Importe (Architektur-Regel).

const { KARTENFARBEN, erstelleProjektion, rueckwaerts, verbinde } = require('../../karte-geo');

// ---------------------------------------------------------------------------
// Ausschnitt und Projektion
// ---------------------------------------------------------------------------

const RAHMEN = { minLon: 2, maxLon: 23, minLat: 46, maxLat: 56, breite: 700 };

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
 * Die Ostsee-Ostküste: von Kurland über Memel und die Kurische Nehrung bis
 * Danzig. Der erste Punkt liegt über dem oberen Bildrand, damit die Landmasse
 * dort nicht abknickt, sondern aus dem Bild läuft.
 */
const OSTSEE_OST = [
  [21.0, 56.45], // vor Libau, über dem oberen Bildrand
  [20.95, 56.05],
  [21.05, 55.7], // Memel
  [21.0, 55.45],
  [20.9, 55.3], // die Kurische Nehrung bei Nidden
  [20.7, 55.15],
  [20.5, 55.0],
  [20.2, 54.8],
  [19.9, 54.65], // Pillau, der Hafen Königsbergs
  [19.6, 54.6],
  [19.3, 54.55], // die Frische Nehrung
  [18.95, 54.6],
  [18.65, 54.35], // Danzig, an der Weichselmündung
];

/** Die Ostsee-Südküste: Danzig → Kiel. */
const OSTSEE_SUED = [
  [18.65, 54.35], // Danzig
  [18.55, 54.5], // Gdingen
  [18.4, 54.78], // die Putziger Nehrung
  [18.15, 54.83], // die Piaśnica-Mündung — ab 1920 die Grenze zwischen dem Korridor und Pommern
  [17.9, 54.8],
  [17.55, 54.75], // Leba
  [17.15, 54.75],
  [16.85, 54.6],
  [16.55, 54.45],
  [16.2, 54.25],
  [15.9, 54.2],
  [15.58, 54.18], // Kolberg
  [15.2, 54.1],
  [14.9, 54.05],
  [14.55, 53.98],
  [14.25, 53.92], // Swinemünde
  [13.75, 54.05],
  [13.4, 54.15],
  [13.1, 54.31], // Stralsund
  [12.85, 54.2],
  [12.6, 54.15],
  [12.35, 54.15],
  [12.1, 54.18], // Warnemünde bei Rostock
  [11.8, 54.15],
  [11.5, 54.15],
  [11.46, 53.9], // Wismar
  [11.15, 53.9],
  [10.87, 53.87], // Lübeck
  [10.75, 54.1],
  [10.55, 54.15],
  [10.4, 54.2],
  [10.13, 54.33], // Kiel
];

/**
 * Die Ostküste Jütlands: Kiel → Flensburger Förde → über den oberen Bildrand.
 *
 * Der Punkt [9.6, 54.87] ist mehr als Geografie: Dort erreichte 1920 nach der
 * Volksabstimmung in Schleswig die neue deutsch-dänische Grenze das Meer.
 */
const JUETLAND_OST = [
  [10.13, 54.33], // Kiel
  [10.03, 54.45],
  [9.85, 54.6],
  [10.03, 54.68], // die Schleimündung
  [9.9, 54.83],
  [9.6, 54.87], // die Flensburger Förde — die Grenze von 1920
  [9.8, 54.95],
  [10.0, 55.1],
  [9.6, 55.25],
  [9.45, 55.5], // Kolding
  [9.8, 55.62],
  [10.0, 55.85],
  [10.2, 56.15], // Aarhus, schon über dem Bildrand
  [10.3, 56.5],
];

/** Die Westküste Jütlands: von über dem Bildrand herunter zur Elbmündung. */
const JUETLAND_WEST = [
  [8.2, 56.5],
  [8.13, 56.2],
  [8.3, 55.8],
  [8.45, 55.47], // Esbjerg
  [8.4, 55.15],
  [8.66, 54.91], // die Grenze von 1920 an der Nordsee
  [8.85, 54.7],
  [9.05, 54.48], // Husum
  [8.85, 54.2],
  [8.7, 53.87], // die Elbmündung
];

/** Die Nordseeküste: Elbmündung → Zuiderzee → Rheinmündung → Flandern. */
const NORDSEE = [
  [8.7, 53.87],
  [8.5, 53.6], // die Wesermündung
  [8.15, 53.5], // der Jadebusen
  [7.6, 53.55],
  [7.2, 53.6], // die Emsmündung — Grenze zu den Niederlanden
  [6.8, 53.45],
  [6.2, 53.45],
  [5.6, 53.4], // Friesland
  [5.4, 52.9], // die Zuiderzee, Ostufer
  [5.3, 52.5],
  [5.05, 52.35], // das Südende der Zuiderzee bei Amsterdam
  [4.9, 52.45],
  [5.0, 52.75], // das Westufer
  [5.1, 52.9],
  [4.75, 52.96], // Texel und Den Helder
  [4.6, 52.6],
  [4.5, 52.3],
  [4.2, 51.95], // die Rheinmündung bei Rotterdam
  [3.9, 51.65], // Seeland
  [3.4, 51.45], // die Scheldemündung
  [2.9, 51.25], // Ostende
  [2.55, 51.07], // die belgisch-französische Grenze an der Küste
  [1.9, 51.0], // schon außerhalb des Bildes
];

/** Südschweden (Schonen) — mehr von Skandinavien passt nicht auf diese Karte. */
const SCHONEN = [
  [12.5, 56.5],
  [12.7, 56.05], // Helsingborg
  [12.9, 55.75],
  [13.0, 55.6], // Malmö, am Öresund
  [13.35, 55.35],
  [13.9, 55.38], // Ystad
  [14.35, 55.4], // Sandhammaren
  [14.2, 55.7],
  [14.7, 56.05],
  [15.6, 56.16], // Karlskrona
  [16.2, 56.4],
];

/** Die Küste Ostpreußens am Kurischen Haff bleibt vereinfacht — siehe Kopf. */
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

/** Lolland und Falster als eine vereinfachte Insel. */
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

/** Rügen — bei diesem Maßstab groß genug, um als Insel erkennbar zu sein. */
const RUEGEN = [
  [13.1, 54.35],
  [13.3, 54.4],
  [13.65, 54.42], // Sassnitz
  [13.65, 54.6],
  [13.43, 54.68], // Kap Arkona
  [13.2, 54.58],
  [13.05, 54.45],
];

// ---------------------------------------------------------------------------
// Flüsse und der Bodensee
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
  [4.6, 51.9], // die Mündung in den Niederlanden
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
  [18.65, 54.35], // die Mündung bei Danzig
];

const MAIN = [
  [11.45, 50.1],
  [10.9, 49.9],
  [10.2, 49.8],
  [9.9, 49.8], // Würzburg
  [9.15, 49.8],
  [8.7, 49.9],
  [8.3, 50.0], // die Mündung bei Mainz
];

const WESER = [
  [9.65, 51.4], // Hann. Münden
  [9.4, 52.0],
  [9.2, 52.5],
  [8.8, 52.9],
  [8.8, 53.1], // Bremen
  [8.5, 53.6],
];

const MOSEL = [
  [6.18, 49.12], // Metz, seit 1919 wieder französisch
  [6.4, 49.45],
  [6.64, 49.75], // Trier
  [7.1, 50.0],
  [7.6, 50.4], // die Mündung bei Koblenz
];

/** Die Saar — der Fluss, der dem Saargebiet den Namen gab. */
const SAAR = [
  [7.0, 49.1],
  [6.98, 49.23], // Saarbrücken
  [6.75, 49.35],
  [6.7, 49.5],
  [6.64, 49.7], // die Mündung in die Mosel bei Konz
];

/** Die Ruhr — kurz, aber sie benennt die Landschaft dieses Kapitels. */
const RUHR = [
  [8.3, 51.4],
  [7.6, 51.45],
  [7.1, 51.45],
  [6.75, 51.45], // die Mündung in den Rhein bei Duisburg
];

const BODENSEE = [
  [9.05, 47.68],
  [9.3, 47.7],
  [9.55, 47.6],
  [9.75, 47.58],
  [9.6, 47.5],
  [9.2, 47.53],
  [9.02, 47.6],
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
 * Der Kontinent: von Kurland über die Ostseeküste, Jütland und die Nordsee bis
 * Flandern — und außerhalb des Bildes zurück. Alles südlich davon ist Land:
 * Auf dem 46. Breitengrad, dem unteren Bildrand, liegt zwischen 2° und 23° O
 * kein Meer mehr (die Adria beginnt erst bei 45,7° N).
 */
const KONTINENT = verbinde(
  OSTSEE_OST,
  OSTSEE_SUED,
  JUETLAND_OST,
  [[9.2, 56.7]], // über den oberen Bildrand — Jütland ist abgeschnitten
  JUETLAND_WEST,
  NORDSEE,
  [
    [1.0, 50.6],
    [1.0, 45.0],
    [24.0, 45.0],
    [24.0, 56.45],
  ],
);

const SCHWEDEN = verbinde(SCHONEN, [
  [16.5, 56.7],
  [12.4, 56.7],
]);

// ---------------------------------------------------------------------------
// Politische Grenzen 1919–1933 — angenähert (siehe Kopf der Datei, Punkt 2)
// ---------------------------------------------------------------------------

/** Die Grenze zu den Niederlanden: Emsmündung → Dreiländereck bei Aachen. */
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

/**
 * Die Grenze zu Belgien.
 *
 * Sie liegt seit 1920 östlich von Eupen und Malmedy: Beide Kreise kamen nach
 * dem Versailler Vertrag zu Belgien.
 */
const GRENZE_BELGIEN = [
  [6.02, 50.75],
  [6.25, 50.6], // östlich von Eupen
  [6.35, 50.4], // östlich von Malmedy
  [6.15, 50.15], // das Dreiländereck mit Luxemburg
];

/** Die Grenze zu Luxemburg — Our und Sauer. */
const GRENZE_LUXEMBURG = [
  [6.15, 50.15],
  [6.4, 49.9],
  [6.5, 49.7], // die Sauer bei Echternach
  [6.37, 49.47], // Perl — das Dreiländereck mit Frankreich
];

/**
 * Die Grenze zu Frankreich.
 *
 * Sie verläuft seit 1919 wieder dort, wo sie vor 1871 lag: Elsass und
 * Lothringen gehören zu Frankreich, die Grenze folgt südlich von Lauterburg
 * dem Rhein bis Basel. Zwischen Perl und Zweibrücken folgt sie zugleich der
 * Südgrenze des Saargebiets.
 */
const GRENZE_FRANKREICH = [
  [6.37, 49.47],
  [6.6, 49.25],
  [6.75, 49.15],
  [7.05, 49.12],
  [7.45, 49.15],
  [7.8, 49.05],
  [8.13, 48.97], // Lauterburg, wo die Grenze den Rhein erreicht
  [8.0, 48.8],
  [7.8, 48.6], // gegenüber Straßburg
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
  [9.55, 47.53], // der Bodensee bei Konstanz
  [9.75, 47.6], // Bregenz
];

/** Die Grenze zu Österreich: Bregenz → Passau → Böhmerwald. */
const GRENZE_OESTERREICH = [
  [9.75, 47.6],
  [10.1, 47.4],
  [10.45, 47.55],
  [11.0, 47.4],
  [11.6, 47.6],
  [12.2, 47.7],
  [12.8, 47.7],
  [13.05, 47.85],
  [12.95, 48.0],
  [13.3, 48.3],
  [13.46, 48.57], // Passau
  [13.83, 48.77], // das Dreiländereck mit der Tschechoslowakei
];

/**
 * Die Grenze zur Tschechoslowakei: Böhmerwald → Erzgebirge → Zittau →
 * Sudeten → Oberschlesien.
 */
const GRENZE_TSCHECHOSLOWAKEI = [
  [13.83, 48.77],
  [13.4, 49.1],
  [12.65, 49.45],
  [12.5, 49.9],
  [12.1, 50.3], // das Egerland springt hier nach Westen vor
  [12.6, 50.4],
  [13.2, 50.5],
  [13.9, 50.75],
  [14.4, 50.9],
  [14.82, 50.87], // Zittau, das Dreiländereck mit Polen
  [15.35, 50.8],
  [16.0, 50.6],
  [16.4, 50.35],
  [16.75, 50.3],
  [17.35, 50.3],
  [17.75, 50.25],
  [18.05, 50.0], // das Hultschiner Ländchen kam 1920 zur Tschechoslowakei
  [18.6, 49.95],
];

/**
 * Die Grenze zu Polen, von Oberschlesien bis an die Ostsee.
 *
 * Zwei Stellen sind für dieses Kapitel wichtig: In Oberschlesien wurde die
 * Grenze nach der Volksabstimmung von 1921 im Jahr 1922 gezogen — Kattowitz
 * kam zu Polen, Beuthen und Gleiwitz blieben deutsch. Und am Nordende trifft
 * die Grenze bei der Piaśnica-Mündung auf die Ostsee: Westlich davon lag
 * Pommern, östlich davon der „polnische Korridor", der Ostpreußen vom übrigen
 * Reich trennte.
 */
const GRENZE_POLEN = [
  [18.6, 49.95],
  [18.95, 50.35],
  [18.6, 50.7],
  [18.4, 51.0],
  [18.0, 51.25],
  [17.6, 51.4],
  [17.0, 51.6],
  [16.5, 51.72],
  [16.2, 51.9],
  [15.9, 52.1],
  [15.6, 52.5],
  [15.8, 52.85],
  [16.2, 53.0],
  [16.6, 53.05],
  [17.0, 53.15],
  [17.25, 53.4],
  [17.35, 53.8],
  [17.6, 54.1],
  [17.95, 54.45],
  [18.15, 54.83], // die Ostsee — hier endete der Korridor nach Westen
];

/** Die Grenze zwischen Dänemark und dem Reich, gezogen 1920 nach der Volksabstimmung in Schleswig. */
const GRENZE_DAENEMARK = [
  [9.6, 54.87],
  [9.3, 54.9],
  [8.66, 54.91],
];

/**
 * Das Deutsche Reich, Hauptteil — die Grenzen, die von 1922 bis 1935 galten.
 *
 * Ostpreußen ist ein eigener Ring (siehe unten): Der polnische Korridor
 * trennte es vom übrigen Reich, und genau das ist auf dieser Karte zu sehen.
 */
const REICH_HAUPTTEIL = verbinde(
  GRENZE_NIEDERLANDE,
  GRENZE_BELGIEN,
  GRENZE_LUXEMBURG,
  GRENZE_FRANKREICH,
  GRENZE_SCHWEIZ,
  GRENZE_OESTERREICH,
  GRENZE_TSCHECHOSLOWAKEI,
  rueckwaerts(GRENZE_POLEN),
  kueste(OSTSEE_SUED, [18.15, 54.83], [10.13, 54.33]),
  kueste(JUETLAND_OST, [10.13, 54.33], [9.6, 54.87]),
  GRENZE_DAENEMARK,
  kueste(JUETLAND_WEST, [8.66, 54.91], [8.7, 53.87]),
  kueste(NORDSEE, [8.7, 53.87], [7.2, 53.6]),
);

/** Die Südgrenze Ostpreußens zu Polen — Soldau kam 1920 zu Polen. */
const OSTPREUSSEN_SUEDGRENZE = [
  [19.35, 54.35], // die Nogatmündung, Grenze zur Freien Stadt Danzig
  [19.1, 54.05],
  [19.05, 53.75],
  [19.4, 53.5],
  [19.9, 53.25],
  [20.6, 53.15],
  [21.4, 53.3],
  [22.2, 53.35],
  [22.85, 53.6],
];

/** Die Ostgrenze Ostpreußens: zu Polen, dann zu Litauen, bis an die Memel. */
const OSTPREUSSEN_OSTGRENZE = [
  [22.85, 53.6],
  [22.9, 54.1],
  [22.7, 54.4],
  [22.9, 54.8],
  [22.4, 55.05], // die Memel, ab hier beginnt das Memelgebiet
  [21.8, 55.15],
  [21.3, 55.27],
  [20.98, 55.28], // die Grenze auf der Kurischen Nehrung bei Nidden
];

const OSTPREUSSEN = verbinde(
  kueste(OSTSEE_OST, [20.98, 55.28], [19.3, 54.55]),
  [[19.35, 54.35]],
  OSTPREUSSEN_SUEDGRENZE.slice(1),
  OSTPREUSSEN_OSTGRENZE.slice(1),
);

/** Die Freie Stadt Danzig — seit 1920 unter dem Schutz des Völkerbunds. */
const DANZIG = [
  [18.55, 54.5],
  [18.65, 54.35],
  [18.95, 54.4],
  [19.2, 54.45],
  [19.35, 54.35], // die Nogat, Grenze zu Ostpreußen
  [19.1, 54.05],
  [18.95, 53.98],
  [18.6, 54.0],
  [18.35, 54.1],
  [18.3, 54.35],
  [18.42, 54.45],
];

/**
 * Das Memelgebiet — 1920 vom Reich abgetrennt und unter alliierte Verwaltung
 * gestellt, 1923 von Litauen besetzt und 1924 Litauen zugesprochen.
 */
const MEMELGEBIET = verbinde(
  kueste(OSTSEE_OST, [20.98, 55.28], [20.95, 56.05]),
  [
    [21.13, 55.95],
    [21.6, 55.8],
    [22.1, 55.5],
    [22.35, 55.25],
    [21.8, 55.15],
    [21.3, 55.27],
    [20.98, 55.28],
  ],
);

/** Litauen ohne das Memelgebiet — der Zustand von 1920 bis 1923. */
const LITAUEN_OHNE_MEMEL = [
  [20.95, 56.05],
  [21.13, 55.95],
  [21.6, 55.8],
  [22.1, 55.5],
  [22.35, 55.25],
  [22.9, 54.8],
  [23.6, 54.5],
  [24.0, 54.7],
  [24.0, 56.4],
  [21.0, 56.4],
];

/** Litauen mit dem Memelgebiet — der Zustand ab 1923/24. */
const LITAUEN_MIT_MEMEL = verbinde(
  kueste(OSTSEE_OST, [20.98, 55.28], [20.95, 56.05]),
  [
    [21.0, 56.4],
    [24.0, 56.4],
    [24.0, 54.7],
    [23.6, 54.5],
    [22.9, 54.8],
    [22.4, 55.05],
    [21.8, 55.15],
    [21.3, 55.27],
    [20.98, 55.28],
  ],
);

/** Polen — im Westen die Grenze von 1922, im Norden der Korridor. */
const POLEN = verbinde(
  GRENZE_POLEN,
  rueckwaerts(kueste(OSTSEE_SUED, [18.15, 54.83], [18.55, 54.5])),
  rueckwaerts(DANZIG.slice(7)),
  [[19.05, 53.75], [19.4, 53.5]],
  OSTPREUSSEN_SUEDGRENZE.slice(4),
  rueckwaerts(OSTPREUSSEN_OSTGRENZE.slice(0, 4)),
  [
    [23.6, 54.5],
    [24.0, 54.3],
    [24.0, 49.0],
    [22.5, 49.1],
    [21.5, 49.4],
    [20.5, 49.4],
    [19.8, 49.5],
    [19.2, 49.6],
  ],
);

/** Die Tschechoslowakei, 1918–1938. */
const TSCHECHOSLOWAKEI = verbinde(
  GRENZE_TSCHECHOSLOWAKEI,
  [
    [19.2, 49.6],
    [19.8, 49.5],
    [20.5, 49.4],
    [21.5, 49.4],
    [22.5, 49.1],
    [24.0, 48.5],
    [22.5, 48.4],
    [21.5, 48.5],
    [20.5, 48.3],
    [19.5, 48.1],
    [18.5, 47.85],
    [17.7, 47.75],
    [17.1, 47.85],
    [16.9, 48.4],
    [16.6, 48.75],
    [15.5, 48.75],
    [15.0, 48.95],
    [14.7, 48.6],
    [14.0, 48.6],
  ],
);

/** Die Republik Österreich, 1918–1938 (mit dem Burgenland, das 1921 dazukam). */
const OESTERREICH = verbinde(
  rueckwaerts(GRENZE_OESTERREICH),
  [
    [9.6, 47.35],
    [9.55, 47.05],
    [10.1, 46.85], // der Reschenpass
    [10.45, 46.85],
    [11.0, 46.8], // der Brenner, seit 1919 die Grenze zu Italien
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
    [17.1, 47.85],
    [16.9, 48.4],
    [16.6, 48.75],
    [15.5, 48.75],
    [15.0, 48.95],
    [14.7, 48.6],
    [14.0, 48.6],
  ],
);

/** Die Schweiz. */
const SCHWEIZ = verbinde(
  rueckwaerts(GRENZE_SCHWEIZ),
  [
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
  ],
);

/** Frankreich — im Westen schneidet der Bildrand, im Süden läuft es aus dem Bild. */
const FRANKREICH = verbinde(
  [[2.55, 51.07]],
  [
    [3.15, 50.79],
    [4.0, 50.35],
    [4.85, 49.8],
    [5.35, 49.62],
    [5.79, 49.54], // das Dreiländereck mit Luxemburg und Belgien
    [6.15, 49.5],
    [6.37, 49.47],
  ],
  GRENZE_FRANKREICH.slice(1),
  [
    [7.0, 47.5],
    [6.45, 46.8],
    [5.95, 46.5],
    [6.0, 46.15],
    [5.0, 45.0],
    [1.0, 45.0],
    [1.0, 51.0],
    [1.9, 51.0],
  ],
);

/** Belgien. */
const BELGIEN = verbinde(
  kueste(NORDSEE, [2.55, 51.07], [3.4, 51.45]),
  [
    [3.5, 51.3],
    [4.2, 51.35],
    [4.4, 51.45],
    [5.0, 51.45],
    [5.8, 51.2],
  ],
  [[6.02, 50.75]],
  GRENZE_BELGIEN.slice(1),
  [
    [5.85, 49.9],
    [5.79, 49.54],
    [5.35, 49.62],
    [4.85, 49.8],
    [4.0, 50.35],
    [3.15, 50.79],
  ],
);

/** Luxemburg. */
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

/** Die Niederlande. */
const NIEDERLANDE = verbinde(
  kueste(NORDSEE, [3.4, 51.45], [7.2, 53.6]),
  GRENZE_NIEDERLANDE.slice(1),
  [
    [5.8, 51.2],
    [5.0, 51.45],
    [4.4, 51.45],
    [4.2, 51.35],
    [3.5, 51.3],
  ],
);

/** Dänemark: Jütland nördlich der Grenze von 1920, dazu die drei großen Inseln. */
const DAENEMARK_JUETLAND = verbinde(
  rueckwaerts(GRENZE_DAENEMARK),
  kueste(JUETLAND_OST, [9.6, 54.87], [10.3, 56.5]),
  [[9.2, 56.7]],
  kueste(JUETLAND_WEST, [8.2, 56.5], [8.66, 54.91]),
);

/**
 * Das Saargebiet — im Versailler Vertrag der deutschen Verwaltung entzogen und
 * bis 1935 dem Völkerbund unterstellt; die Gruben gingen an Frankreich. 1935
 * stimmten über 90 Prozent der Bevölkerung für die Rückkehr zum Reich; das
 * liegt hinter dem Zeitraum dieses Kapitels.
 */
const SAARGEBIET = [
  [6.37, 49.47],
  [6.68, 49.55],
  [6.9, 49.62],
  [7.1, 49.55],
  [7.4, 49.4],
  [7.4, 49.2],
  [7.05, 49.12],
  [6.75, 49.15],
  [6.6, 49.25],
];

/**
 * Das besetzte Rheinland 1919–1926: das gesamte linke Rheinufer nördlich des
 * Saargebiets, dazu die drei Brückenköpfe von Köln, Koblenz und Mainz auf der
 * rechten Rheinseite. Der Vertrag sah drei Zonen vor, die nach fünf, zehn und
 * fünfzehn Jahren geräumt werden sollten.
 */
const RHEINLAND_BESETZT = [
  [6.02, 50.75],
  [5.95, 51.05],
  [6.2, 51.6],
  [6.05, 51.9],
  [6.4, 51.8],
  [6.7, 51.4],
  [7.4, 51.1], // der Kölner Brückenkopf reicht über den Rhein
  [7.5, 50.9],
  [7.3, 50.7],
  [7.9, 50.6], // der Koblenzer Brückenkopf
  [8.1, 50.2],
  [8.0, 50.05],
  [8.7, 50.1], // der Mainzer Brückenkopf
  [8.8, 49.8],
  [8.5, 49.7],
  [8.4, 49.4],
  [8.3, 49.0],
  [8.13, 48.97],
  [7.8, 49.05],
  [7.45, 49.15],
  [7.05, 49.12],
  [7.4, 49.2], // um das Saargebiet herum, das eigene Wege ging
  [7.4, 49.4],
  [7.1, 49.55],
  [6.9, 49.62],
  [6.68, 49.55],
  [6.37, 49.47],
  [6.5, 49.7],
  [6.4, 49.9],
  [6.15, 50.15],
  [6.35, 50.4],
  [6.25, 50.6],
];

/**
 * Das besetzte Rheinland ab 1926: Die Kölner Zone im Norden wurde am 31.
 * Januar 1926 geräumt — die erste Frucht des Vertrags von Locarno. Der Rest
 * folgte am 30. Juni 1930, fünf Jahre früher als im Vertrag vorgesehen.
 */
const RHEINLAND_BESETZT_AB_1926 = [
  [6.28, 50.5],
  [7.0, 50.6],
  [7.3, 50.7],
  [7.9, 50.6],
  [8.1, 50.2],
  [8.0, 50.05],
  [8.7, 50.1],
  [8.8, 49.8],
  [8.5, 49.7],
  [8.4, 49.4],
  [8.3, 49.0],
  [8.13, 48.97],
  [7.8, 49.05],
  [7.45, 49.15],
  [7.05, 49.12],
  [7.4, 49.2],
  [7.4, 49.4],
  [7.1, 49.55],
  [6.9, 49.62],
  [6.68, 49.55],
  [6.37, 49.47],
  [6.5, 49.7],
  [6.4, 49.9],
  [6.15, 50.15],
  [6.2, 50.35],
];

// ---------------------------------------------------------------------------
// Zusammenbau: Untergrund, Phasen, Punkte, Bewegungen, Beschriftungen
// ---------------------------------------------------------------------------

const basis = [
  { art: 'grund', d: `M 0 0 H ${geo.breite} V ${geo.hoehe} H 0 Z`, fill: KARTENFARBEN.meer, stroke: 'none', strokeWidth: 0 },
  { art: 'land', d: geo.pfad(KONTINENT), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(SCHWEDEN), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(SJAELLAND), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(FYN), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(LOLLAND), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(BORNHOLM), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'land', d: geo.pfad(RUEGEN), fill: KARTENFARBEN.land, stroke: KARTENFARBEN.landRand, strokeWidth: 1 },
  { art: 'see', d: geo.pfad(BODENSEE), fill: KARTENFARBEN.meer, stroke: KARTENFARBEN.fluss, strokeWidth: 1 },
  { art: 'fluss', d: geo.pfad(RHEIN, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
  { art: 'fluss', d: geo.pfad(DONAU, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
  { art: 'fluss', d: geo.pfad(ELBE, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
  { art: 'fluss', d: geo.pfad(ODER, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
  { art: 'fluss', d: geo.pfad(WEICHSEL, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
  { art: 'fluss', d: geo.pfad(MAIN, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
  { art: 'fluss', d: geo.pfad(WESER, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
  { art: 'fluss', d: geo.pfad(MOSEL, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
  { art: 'fluss', d: geo.pfad(SAAR, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
  { art: 'fluss', d: geo.pfad(RUHR, { geschlossen: false }), fill: 'none', stroke: KARTENFARBEN.fluss, strokeWidth: 2 },
];

/** Das Reich: zwei Ringe — Hauptteil und Ostpreußen, dazwischen der Korridor. */
const REICH_D = `${geo.pfad(REICH_HAUPTTEIL)} ${geo.pfad(OSTPREUSSEN)}`;

const flaecheReich1919 = {
  titel: 'Deutsches Reich — die junge Republik (Grenzen nach dem Versailler Vertrag)',
  d: REICH_D,
};
const flaecheReich1920er = {
  titel: 'Deutsches Reich — die Republik von Weimar (Grenzen unverändert)',
  d: REICH_D,
};
const flaecheReich1933 = {
  titel: 'Deutsches Reich — Stand 30. Januar 1933 (Grenzen unverändert)',
  d: REICH_D,
};

const flaecheSaar = {
  titel: 'Saargebiet — der deutschen Verwaltung entzogen, Völkerbund (1920–1935)',
  d: geo.pfad(SAARGEBIET),
};

const flaecheRheinland1919 = {
  titel: 'Besetztes Rheinland — alliierte Besatzung seit 1919, entmilitarisiert',
  d: geo.pfad(RHEINLAND_BESETZT),
};
const flaecheRheinland1926 = {
  titel: 'Besetztes Rheinland — verbliebene Zonen nach der Räumung der Kölner Zone (1926)',
  d: geo.pfad(RHEINLAND_BESETZT_AB_1926),
};

const flaecheDanzig = {
  titel: 'Freie Stadt Danzig — unter dem Schutz des Völkerbunds (seit 1920)',
  d: geo.pfad(DANZIG),
};

const flaecheMemel = {
  titel: 'Memelgebiet — vom Reich abgetrennt, alliierte Verwaltung (1920–1923)',
  d: geo.pfad(MEMELGEBIET),
};

const flaechePolen = { titel: 'Republik Polen (seit 1918 wieder ein eigener Staat)', d: geo.pfad(POLEN) };
const flaecheTschechoslowakei = { titel: 'Tschechoslowakei (seit 1918)', d: geo.pfad(TSCHECHOSLOWAKEI) };
const flaecheOesterreich1919 = { titel: 'Republik Österreich (seit 1918)', d: geo.pfad(OESTERREICH) };
const flaecheOesterreich = { titel: 'Republik Österreich (mit dem Burgenland, seit 1921)', d: geo.pfad(OESTERREICH) };
const flaecheSchweiz = { titel: 'Schweiz', d: geo.pfad(SCHWEIZ) };
const flaecheFrankreich = { titel: 'Frankreich (mit Elsass-Lothringen, seit 1919 zurück)', d: geo.pfad(FRANKREICH) };
const flaecheBelgien = { titel: 'Belgien (mit Eupen und Malmedy, seit 1920)', d: geo.pfad(BELGIEN) };
const flaecheLuxemburg = { titel: 'Luxemburg', d: geo.pfad(LUXEMBURG) };
const flaecheNiederlande = { titel: 'Niederlande', d: geo.pfad(NIEDERLANDE) };
const flaecheDaenemark = {
  titel: 'Dänemark (mit Nordschleswig, seit der Volksabstimmung 1920)',
  d: `${geo.pfad(DAENEMARK_JUETLAND)} ${geo.pfad(SJAELLAND)} ${geo.pfad(FYN)} ${geo.pfad(LOLLAND)}`,
};
const flaecheLitauenOhneMemel = { titel: 'Litauen (ohne das Memelgebiet)', d: geo.pfad(LITAUEN_OHNE_MEMEL) };
const flaecheLitauenMitMemel = { titel: 'Litauen (mit dem Memelgebiet, seit 1923/24)', d: geo.pfad(LITAUEN_MIT_MEMEL) };

const phasen = [
  {
    id: 'junge-republik',
    label: '1919',
    hinweis: [
      'Die Nationalversammlung tagt in Weimar, weil in Berlin auf den Straßen',
      'gekämpft wird. Am 28. Juni 1919 unterzeichnet die deutsche Regierung',
      'den Versailler Vertrag, am 11. August wird die Verfassung ausgefertigt.',
      'Die Karte zeigt die Grenzen, die daraus folgten — einige davon wurden',
      'erst später endgültig gezogen: Nordschleswig nach der Volksabstimmung',
      '1920, Oberschlesien nach der Abstimmung von 1921 im Jahr 1922. Das',
      'Rheinland ist besetzt, das Saargebiet dem Völkerbund unterstellt,',
      'Danzig Freie Stadt, das Memelgebiet abgetrennt. Datierte Zustände, ohne',
      'Wertung — was man davon hält, entscheidet niemand für dich.',
    ].join(' '),
    flaechen: [
      flaecheReich1919,
      flaecheRheinland1919,
      flaecheSaar,
      flaecheDanzig,
      flaecheMemel,
      flaechePolen,
      flaecheTschechoslowakei,
      flaecheOesterreich1919,
      flaecheSchweiz,
      flaecheFrankreich,
      flaecheBelgien,
      flaecheLuxemburg,
      flaecheNiederlande,
      flaecheDaenemark,
      flaecheLitauenOhneMemel,
    ],
  },
  {
    id: 'goldene-jahre',
    label: '1924–1929',
    hinweis: [
      'Dieselben Grenzen, eine andere Lage. Die Rentenmark hat die Inflation',
      'beendet, der Dawes-Plan die Reparationen neu geordnet, der Vertrag von',
      'Locarno 1925 das Verhältnis zu Frankreich und Belgien entspannt; 1926',
      'wird Deutschland Mitglied des Völkerbunds. Auf der Karte ist davon eines',
      'zu sehen: Die Kölner Zone im Norden des Rheinlands ist im Januar 1926',
      'geräumt, das besetzte Gebiet also kleiner geworden. Das Memelgebiet',
      'gehört seit 1923/24 zu Litauen. Berlin, Frankfurt und Dessau werden in',
      'diesen Jahren zu Adressen der Kunst und der Wissenschaft.',
    ].join(' '),
    flaechen: [
      flaecheReich1920er,
      flaecheRheinland1926,
      flaecheSaar,
      flaecheDanzig,
      flaechePolen,
      flaecheTschechoslowakei,
      flaecheOesterreich,
      flaecheSchweiz,
      flaecheFrankreich,
      flaecheBelgien,
      flaecheLuxemburg,
      flaecheNiederlande,
      flaecheDaenemark,
      flaecheLitauenMitMemel,
    ],
  },
  {
    id: 'januar-1933',
    label: '1933',
    hinweis: [
      'Am 30. Januar 1933 ernennt Reichspräsident Hindenburg Adolf Hitler zum',
      'Reichskanzler. Am Staatsgebiet hat sich seit 1919 nichts geändert — das',
      'letzte fremde Militär hat das Rheinland am 30. Juni 1930 verlassen, fünf',
      'Jahre früher als im Vertrag vorgesehen, und deshalb fehlt die dunkle',
      'Fläche im Westen. Was sich verändert hat, steht nicht auf der Landkarte,',
      'sondern in den Gesetzblättern: Seit 1930 wird mit Notverordnungen',
      'regiert, der Reichstag ist dreimal aufgelöst worden, und in Preußen',
      'regiert seit Juli 1932 ein vom Reich eingesetzter Kommissar.',
    ].join(' '),
    flaechen: [
      flaecheReich1933,
      flaecheSaar,
      flaecheDanzig,
      flaechePolen,
      flaecheTschechoslowakei,
      flaecheOesterreich,
      flaecheSchweiz,
      flaecheFrankreich,
      flaecheBelgien,
      flaecheLuxemburg,
      flaecheNiederlande,
      flaecheDaenemark,
      flaecheLitauenMitMemel,
    ],
  },
];

const punkte = [
  {
    id: 'weimar',
    name: 'Weimar',
    typ: 'ereignis',
    ...ort(11.33, 50.98),
    text: [
      'Am 6. Februar 1919 trat im Deutschen Nationaltheater in Weimar die',
      'Nationalversammlung zusammen — 423 Abgeordnete, gewählt am 19. Januar',
      '1919 von Männern und Frauen ab 20 Jahren. Es war die erste Wahl in',
      'Deutschland, bei der Frauen wählen und gewählt werden durften; 82',
      'Prozent der Wahlberechtigten gingen hin, 37 Frauen zogen ins Parlament',
      'ein. Warum Weimar und nicht Berlin? Weil in der Hauptstadt geschossen',
      'wurde und die Abgeordneten in Ruhe arbeiten wollten — und weil der Name',
      'der Stadt Goethes und Schillers dem neuen Staat ein anderes Gesicht',
      'geben sollte als das der Kasernen. Am 11. August 1919 wurde die',
      'Verfassung ausgefertigt: Volkssouveränität, Grundrechte, ein direkt',
      'gewählter Reichspräsident, ein Reichstag nach reinem Verhältniswahlrecht.',
      'Für die einen war das der modernste Verfassungstext der Welt, für die',
      'anderen ein Kompromiss mit eingebauten Sollbruchstellen.',
    ].join(' '),
  },
  {
    id: 'berlin',
    name: 'Berlin',
    typ: 'stadt',
    ...ort(13.4, 52.52),
    text: [
      'Am 9. November 1918 wurde in Berlin zweimal die Republik ausgerufen: um',
      'die Mittagszeit vom Sozialdemokraten Philipp Scheidemann vom Reichstag',
      'aus, zwei Stunden später vom Spartakisten Karl Liebknecht vom',
      'Stadtschloss aus — zwei Republiken, zwei Vorstellungen davon, was jetzt',
      'kommen sollte. Berlin blieb der Ort, an dem sich das entschied: der',
      'Januaraufstand 1919 und die Ermordung Rosa Luxemburgs und Karl',
      'Liebknechts durch Freikorpsoffiziere, der Kapp-Putsch 1920, den ein',
      'Generalstreik zum Scheitern brachte, der Mord an Außenminister Walther',
      'Rathenau 1922, die Straßenschlachten zwischen SA und Rotfrontkämpferbund',
      'ab 1929. Und Berlin war zugleich die Stadt, die in den zwanziger Jahren',
      'als eine der aufregendsten der Welt galt — Theater, Kino, Kabarett,',
      'Zeitungen, Wissenschaft. Am 30. Januar 1933 ging beides zu Ende: An',
      'diesem Tag ernannte Reichspräsident Hindenburg in der Wilhelmstraße',
      'Adolf Hitler zum Reichskanzler.',
    ].join(' '),
  },
  {
    id: 'muenchen',
    name: 'München',
    typ: 'ereignis',
    ...ort(11.58, 48.14),
    text: [
      'München erlebte in fünf Jahren beide Extreme. Im November 1918 rief Kurt',
      'Eisner den Freistaat Bayern aus; nach seiner Ermordung im Februar 1919',
      'folgte die Münchner Räterepublik, die Anfang Mai 1919 von Reichswehr und',
      'Freikorps blutig niedergeschlagen wurde — mit über tausend Toten, viele',
      'davon standrechtlich erschossen. Danach wurde Bayern zur „Ordnungszelle"',
      'des rechten Lagers. Am 8. und 9. November 1923 versuchte Adolf Hitler,',
      'aus dem Bürgerbräukeller heraus die Reichsregierung zu stürzen; der',
      'Marsch zur Feldherrnhalle endete vor den Karabinern der bayerischen',
      'Landespolizei. Der Putsch scheiterte — und der Prozess danach zeigte,',
      'wie ungleich die Justiz maß: Hitler durfte den Gerichtssaal als Bühne',
      'nutzen und kam nach neun Monaten Festungshaft wieder frei, während',
      'Aufständische von links Jahre in Zuchthäusern verbrachten. Später nannte',
      'die NSDAP München ihre „Hauptstadt der Bewegung".',
    ].join(' '),
  },
  {
    id: 'ruhrgebiet',
    name: 'Ruhrgebiet (Essen)',
    typ: 'ereignis',
    ...ort(7.01, 51.46),
    text: [
      'Am 11. Januar 1923 rückten französische und belgische Truppen ins',
      'Ruhrgebiet ein, weil das Reich mit Reparationslieferungen — Kohle und',
      'Telegrafenmasten — in Verzug geraten war. Die Reichsregierung rief zum',
      '„passiven Widerstand" auf: Bergleute und Eisenbahner streikten, das',
      'Revier stand still. Bezahlt wurde dieser Widerstand mit frisch',
      'gedrucktem Geld, und damit kippte eine Entwertung, die seit dem Krieg',
      'lief, in die Hyperinflation. Im November 1923 kostete ein Brot in',
      'Papiermark eine Zahl mit zwölf Stellen. Wer Land, Häuser oder Maschinen',
      'besaß, kam durch; wer gespart hatte — Beamte, Rentner, der Mittelstand',
      '—, verlor alles. Im November brach die Regierung Stresemann den',
      'Widerstand ab und führte die Rentenmark ein; die Währung war gerettet,',
      'das Vertrauen vieler Menschen in den Staat nicht.',
    ].join(' '),
  },
  {
    id: 'koeln',
    name: 'Köln',
    typ: 'grenze',
    ...ort(6.96, 50.94),
    text: [
      'Köln lag in der nördlichsten der drei Besatzungszonen, die der Versailler',
      'Vertrag für das linke Rheinufer vorsah — britische Truppen zogen im',
      'Dezember 1918 ein. Der Vertrag sah die Räumung nach fünf, zehn und',
      'fünfzehn Jahren vor. Nach dem Vertrag von Locarno, den Außenminister',
      'Gustav Stresemann 1925 mit Frankreich und Belgien schloss, wurde die',
      'Kölner Zone am 31. Januar 1926 geräumt; im September 1926 trat',
      'Deutschland dem Völkerbund bei, 1930 verließ das letzte fremde Militär',
      'das Rheinland — fünf Jahre früher als vereinbart. Für die Republikaner',
      'war das der Beweis, dass Verhandeln mehr brachte als Trotz. Kölns',
      'Oberbürgermeister hieß damals Konrad Adenauer; die Nationalsozialisten',
      'entließen ihn 1933 aus dem Amt.',
    ].join(' '),
  },
  {
    id: 'leipzig',
    name: 'Leipzig',
    typ: 'stadt',
    ...ort(12.37, 51.34),
    text: [
      'In Leipzig saß das Reichsgericht, das höchste Gericht der Republik — und',
      'an ihm zeigt sich eine der unbequemsten Stellen dieser Geschichte. Die',
      'Justiz der Republik war überwiegend dieselbe wie die des Kaiserreichs:',
      'Richter waren auf Lebenszeit ernannt, und viele hielten die Demokratie',
      'für einen Betriebsunfall. Der Statistiker Emil Julius Gumbel zählte',
      '1922 für die Jahre 1919 bis 1922 mehr als 300 politische Morde von',
      'rechts, die im Schnitt mit wenigen Monaten Haft geahndet wurden — und',
      'gut zwei Dutzend von links, für die zahlreiche Todesurteile fielen.',
      '„Auf dem rechten Auge blind" nannte man das. Im Oktober 1932',
      'verhandelte das Reichsgericht über den „Preußenschlag": Die',
      'sozialdemokratisch geführte Regierung Preußens war im Juli abgesetzt',
      'worden und hatte statt Widerstand den Rechtsweg gewählt. Das Urteil fiel',
      'halb aus, die Absetzung blieb bestehen.',
    ].join(' '),
  },
  {
    id: 'danzig',
    name: 'Danzig und der Korridor',
    typ: 'grenze',
    ...ort(18.65, 54.35),
    text: [
      'Der Versailler Vertrag machte Danzig zur Freien Stadt unter dem Schutz',
      'des Völkerbunds und gab Polen einen Zugang zur Ostsee: den „polnischen',
      'Korridor", der Ostpreußen vom übrigen Reich trennte. Wer von Berlin nach',
      'Königsberg wollte, fuhr durch fremdes Staatsgebiet. In Deutschland galt',
      'das über alle Parteigrenzen hinweg als bitterste Bestimmung des',
      'Vertrags; kein Kabinett der Republik hat sie je anerkannt. Die andere',
      'Seite der Rechnung gehört daneben: Polen war 123 Jahre lang zwischen',
      'Preußen, Österreich und Russland aufgeteilt gewesen und 1918 neu',
      'entstanden; ein Staat ohne Hafen wäre wirtschaftlich am Wohlwollen',
      'seiner Nachbarn gehangen. Die Bevölkerung im Korridor war gemischt, mit',
      'polnischer Mehrheit auf dem Land, deutscher Mehrheit in den Städten —',
      'jede Grenze hier musste Menschen auf die falsche Seite bringen.',
    ].join(' '),
  },
];

const beiPunkt = (id) => {
  const punkt = punkte.find((eintrag) => eintrag.id === id);
  return [punkt.x, punkt.y];
};

const bewegungen = [
  {
    id: 'novemberrevolution',
    name: 'Die Novemberrevolution 1918',
    von: p(10.13, 54.33),
    ueber: [p(10.0, 53.55)],
    nach: beiPunkt('berlin'),
    text: [
      'Am 29. Oktober 1918 sollte die Hochseeflotte in Wilhelmshaven noch',
      'einmal auslaufen — zu einer Schlacht, die den längst verlorenen Krieg',
      'nicht mehr gewendet hätte. Die Matrosen verweigerten den Befehl. Aus',
      'dem Aufstand in Kiel am 3. und 4. November 1918 wurde binnen einer Woche',
      'eine Revolution: In Hamburg, Bremen, Hannover, München und schließlich',
      'in Berlin übernahmen Arbeiter- und Soldatenräte die Macht, ohne dass',
      'jemand sie aufhielt. Am 9. November trat Wilhelm II. ab, Reichskanzler',
      'Max von Baden übergab das Amt an den Sozialdemokraten Friedrich Ebert,',
      'und Philipp Scheidemann rief die Republik aus. Am 11. November 1918',
      'wurde in Compiègne der Waffenstillstand unterzeichnet — von einer zivilen',
      'Delegation, nicht von den Generälen, die den Krieg geführt hatten. Aus',
      'diesem Umstand wurde später die Dolchstoßlegende gemacht.',
    ].join(' '),
  },
  {
    id: 'ruhrbesetzung',
    name: 'Die Ruhrbesetzung, Januar 1923',
    von: p(4.4, 50.5),
    ueber: [beiPunkt('koeln')],
    nach: beiPunkt('ruhrgebiet'),
    text: [
      'Am 11. Januar 1923 marschierten rund 60 000 französische und belgische',
      'Soldaten ins Ruhrgebiet ein, um die Reparationen selbst einzutreiben,',
      'nachdem das Reich mit Kohle- und Holzlieferungen in Verzug geraten war.',
      'Frankreichs Beweggrund gehört fair daneben: Der Norden des Landes lag in',
      'Trümmern, der Wiederaufbau war teuer, und in Paris fürchtete man, ein',
      'wirtschaftlich starkes Deutschland werde sich am Ende um alles drücken.',
      'Die deutsche Antwort war der „passive Widerstand": Streiks, verweigerte',
      'Lieferungen, Sabotage — und die Löhne dafür druckte die Reichsbank.',
      'Das Ergebnis war die Hyperinflation. Im September 1923 brach die',
      'Regierung Stresemann den Widerstand ab, weil das Reich ihn nicht mehr',
      'bezahlen konnte. Es war eine unpopuläre, aber nüchterne Entscheidung —',
      'und sie machte die Rettung der Währung erst möglich.',
    ].join(' '),
  },
  {
    id: 'inflation',
    name: 'Die Geldpresse und die Inflation 1923',
    von: beiPunkt('berlin'),
    ueber: [p(9.73, 52.37)],
    nach: beiPunkt('ruhrgebiet'),
    text: [
      'Die Inflation begann nicht 1923, sondern 1914: Der Krieg wurde nicht',
      'über Steuern, sondern über Kriegsanleihen finanziert — in der Erwartung,',
      'die Besiegten würden am Ende zahlen. Der Krieg ging verloren, die',
      'Rechnung blieb. Reparationen und Handelsbilanz drückten die Mark weiter,',
      'und als das Reich 1923 die Löhne des passiven Widerstands im Ruhrgebiet',
      'aus der Notenpresse bezahlte, kippte die Entwertung in den freien Fall:',
      'Ein Dollar kostete im Januar 1923 rund 18 000 Mark, im November vier',
      'Billionen und zweihundert Milliarden. Löhne wurden zweimal am Tag',
      'ausgezahlt und sofort ausgegeben. Am 15. November 1923 beendete die',
      'Rentenmark den Spuk. Was blieb, war eine Erfahrung, die keine Statistik',
      'einfängt: Wer gespart hatte, hatte umsonst gespart — und viele gaben',
      'nicht der Kriegsfinanzierung die Verantwortung, sondern der Republik,',
      'die das Erbe verwaltete.',
    ].join(' '),
  },
  {
    id: 'ns-aufstieg',
    name: 'Der Weg der NSDAP von München nach Berlin, 1923–1933',
    von: beiPunkt('muenchen'),
    ueber: [p(11.08, 49.45), p(11.33, 50.98)],
    nach: beiPunkt('berlin'),
    text: [
      'Nach dem gescheiterten Putsch von 1923 änderte die NSDAP ihre Strategie:',
      'nicht mehr gegen die Republik putschen, sondern über ihre Wahlen an die',
      'Macht kommen. Bei der Reichstagswahl 1928 kam sie auf 2,6 Prozent — eine',
      'Splitterpartei. Dann kam die Weltwirtschaftskrise: 1930 waren drei',
      'Millionen Menschen ohne Arbeit, Anfang 1932 über sechs Millionen. Im',
      'September 1930 wurde die NSDAP mit 18,3 Prozent zweitstärkste Kraft, im',
      'Juli 1932 mit 37,4 Prozent stärkste; im November 1932 verlor sie wieder',
      'auf 33,1 Prozent, und die Partei steckte in Geldnot. Eine Mehrheit hat',
      'sie in freier Wahl nie bekommen. Ins Amt kam Hitler am 30. Januar 1933',
      'nicht durch einen Wahlsieg, sondern durch die Ernennung des',
      'Reichspräsidenten — nach Verhandlungen in Hinterzimmern, geführt von',
      'Konservativen, die glaubten, ihn einrahmen und benutzen zu können.',
    ].join(' '),
  },
];

const beschriftungen = [
  { text: 'Nordsee', art: 'meer', ...ort(5.0, 54.5) },
  { text: 'Ostsee', art: 'meer', ...ort(15.5, 55.4) },
  { text: 'Deutsches Reich', art: 'land', ...ort(10.2, 52.7) },
  { text: 'Preußen', art: 'land', ...ort(13.2, 53.4) },
  { text: 'Bayern', art: 'land', ...ort(11.7, 48.9) },
  { text: 'Ostpreußen', art: 'land', ...ort(20.9, 54.0) },
  { text: 'Polen', art: 'land', ...ort(19.6, 52.2) },
  { text: 'Tschechoslowakei', art: 'land', ...ort(16.6, 49.2), drehung: -12 },
  { text: 'Österreich', art: 'land', ...ort(14.6, 47.5) },
  { text: 'Frankreich', art: 'land', ...ort(4.2, 48.4) },
  { text: 'Belgien', art: 'land', ...ort(4.4, 50.6) },
  { text: 'Niederlande', art: 'land', ...ort(6.2, 52.6) },
  { text: 'Dänemark', art: 'land', ...ort(9.3, 55.7) },
  { text: 'Schweiz', art: 'land', ...ort(7.7, 46.8) },
  { text: 'Schweden', art: 'land', ...ort(14.2, 56.0) },
  { text: 'Ungarn', art: 'land', ...ort(18.8, 46.9) },
  { text: 'Italien', art: 'land', ...ort(10.6, 46.3) },
  { text: 'Jugoslawien', art: 'land', ...ort(15.2, 46.3) },
  { text: 'Alpen', art: 'land', ...ort(12.4, 47.1), drehung: -12 },
  { text: 'Ruhrgebiet', art: 'land', ...ort(7.4, 51.7) },
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
