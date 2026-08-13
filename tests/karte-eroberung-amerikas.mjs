// Prüfungen für die Karte zum Thema „Die Eroberung Amerikas" — und für das,
// was das Themen-Modul an der Karte hängen hat.
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe:
// läuft mit blankem `node`.
//
// Das Karten-Schema und die Rechenwerkzeuge aus utils/karte-geo.js prüft
// tests/karte.mjs — hier geht es nur um diese eine Karte:
//   1. Vollständigkeit und Aufbau (Phasen, Punkte, Bewegungen, Beschriftungen).
//   2. Atlas-Gegenprobe: Liegen bekannte Häfen von Kalifornien bis Galicien auf
//      der gezeichneten Küste? Und liegt mitten im Atlantik keine?
//   3. Die Aussage steckt in der Geometrie: 1492 stehen zwei getrennte Welten
//      auf einem Bild, und in Amerika gibt es keine einzige spanische Fläche.
//      Danach verschwindet erst das Aztekenreich vom Umschalter, dann das Reich
//      der Inka — und das spanische Gebiet in Amerika wächst von einer Insel
//      auf zwei Vizekönigreiche.
//   4. Die Bewegungen hängen an den Info-Punkten: Kolumbus fährt von Iberien
//      über die Kanaren nach Guanahani, und der Silberstrom läuft dieselbe
//      Strecke in umgekehrter Richtung wieder zurück nach Sevilla.
//   5. TONE-REGEL für sensible Themen (CLAUDE.md): Die Perspektive muss die
//      unbequemen Stellen der eigenen Erzählung selbst benennen, die
//      Beweggründe der anderen Seite fair wiedergeben — und die Karte darf
//      nicht behaupten, wo sie nichts weiß.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { pruefeKarte, KARTEN_PUNKT_TYPEN } = require('../utils/themen/schema.js');
const { erstelleProjektion } = require('../utils/karte-geo.js');
const { themaNachId, alleThemen } = require('../utils/themen/index.js');
const { abschnitteFuer } = require('../utils/lernformat.js');

/**
 * Der Kartenausschnitt, wie ihn utils/themen/karten/eroberung-amerikas.js
 * aufspannt. Steht hier noch einmal, damit die Atlas-Gegenprobe unten rechnen
 * kann — dass er stimmt, prüft der Test über die daraus folgende Höhe.
 */
const RAHMEN = { minLon: -115, maxLon: -5, minLat: -20, maxLat: 45, breite: 700 };

/** Wie viele SVG-Einheiten ein Längengrad breit ist — der Maßstab der Probe. */
const EINHEITEN_JE_GRAD = RAHMEN.breite / (RAHMEN.maxLon - RAHMEN.minLon);

/**
 * Die Eckpunkte einer Fläche aus ihrem `d`-Attribut.
 *
 * Die Pfade bestehen nur aus M, C und Z. Bei „M x y C c1 c2 x y C …" ist jedes
 * dritte Zahlenpaar ein echter Eckpunkt, dazwischen liegen die Kontrollpunkte
 * der Rundung.
 *
 * @param {string} d
 * @returns {Array<Array<number>>}
 */
function eckpunkte(d) {
  const zahlen = (d.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  const paare = [];
  for (let i = 0; i + 1 < zahlen.length; i += 2) paare.push([zahlen[i], zahlen[i + 1]]);
  return paare.filter((_, i) => i % 3 === 0);
}

/** Flächeninhalt eines Vielecks (Gaußsche Trapezformel), immer positiv. */
function flaecheninhalt(punkte) {
  let summe = 0;
  for (let i = 0; i < punkte.length; i += 1) {
    const [x1, y1] = punkte[i];
    const [x2, y2] = punkte[(i + 1) % punkte.length];
    summe += x1 * y2 - x2 * y1;
  }
  return Math.abs(summe) / 2;
}

/**
 * Der Flächeninhalt aller Flächen einer Phase, deren Titel passt.
 *
 * @param {object} phase
 * @param {RegExp} muster
 * @returns {number} 0, wenn keine Fläche passt
 */
function groesseVon(phase, muster) {
  return phase.flaechen
    .filter((f) => muster.test(f.titel))
    .reduce((summe, f) => summe + flaecheninhalt(eckpunkte(f.d)), 0);
}

/**
 * @param {(name: string, ok: boolean) => void} pruefe Prüf-Funktion des Rahmens
 */
export function laufe(pruefe) {
  const thema = themaNachId('eroberung-amerikas');
  pruefe('„Die Eroberung Amerikas" ist als Thema registriert', Boolean(thema));
  const karte = thema.karte;
  pruefe('„Die Eroberung Amerikas" bringt eine Karte mit', Boolean(karte));

  // --- 1. Aufbau ---------------------------------------------------------
  pruefe('Amerika-Karte: erfüllt das Karten-Schema', pruefeKarte(karte).length === 0);
  pruefe('Amerika-Karte: hat mindestens 3 Phasen', karte.phasen.length >= 3);
  pruefe('Amerika-Karte: hat 5 Phasen — von 1492 bis um 1600', karte.phasen.length === 5);
  pruefe('Amerika-Karte: hat 5 bis 6 Info-Punkte',
    karte.punkte.length >= 5 && karte.punkte.length <= 6);
  pruefe('Amerika-Karte: hat 2 bis 4 Bewegungen',
    karte.bewegungen.length >= 2 && karte.bewegungen.length <= 4);
  pruefe('Amerika-Karte: jeder Punkt-typ ist ein bekannter',
    karte.punkte.every((p) => KARTEN_PUNKT_TYPEN.includes(p.typ)));
  // Jeder Info-Punkt trägt Hintergrundwissen — die Karte ist die Bühne, die
  // Texte stehen dahinter. Ein Satz allein reicht dafür nicht.
  pruefe('Amerika-Karte: jeder Info-Punkt hat einen ausgeführten Text',
    karte.punkte.every((p) => p.text.trim().length > 200));
  pruefe('Amerika-Karte: jede Bewegung hat einen ausgeführten Text',
    karte.bewegungen.every((b) => b.text.trim().length > 200));
  pruefe('Amerika-Karte: jede Phase erklärt sich in einem Hinweis',
    karte.phasen.every((p) => typeof p.hinweis === 'string' && p.hinweis.length > 40));
  pruefe('Amerika-Karte: die Phasen-ids sind eindeutig',
    new Set(karte.phasen.map((p) => p.id)).size === karte.phasen.length);

  // Die fünf Stationen des Kapitels.
  const labels = karte.phasen.map((p) => p.label).join(' | ');
  for (const jahr of ['1492', '1504', '1521', '1533', '1600']) {
    pruefe(`Amerika-Karte: die Jahreszahl ${jahr} steht auf dem Umschalter`,
      labels.includes(jahr));
  }

  // Alles muss im Bild liegen — ein Punkt außerhalb wäre unantippbar.
  const imBild = ([x, y]) => x >= 0 && x <= karte.breite && y >= 0 && y <= karte.hoehe;
  pruefe('Amerika-Karte: alle Info-Punkte liegen im Bild',
    karte.punkte.every((p) => imBild([p.x, p.y])));
  pruefe('Amerika-Karte: alle Bewegungen liegen im Bild',
    karte.bewegungen.every((b) => [b.von, b.nach, ...(b.ueber || [])].every(imBild)));
  pruefe('Amerika-Karte: alle Beschriftungen liegen im Bild',
    (karte.beschriftungen || []).every((b) => imBild([b.x, b.y])));

  // --- 2. Die Erzählung steckt in der Geometrie --------------------------
  const [phase1492, phase1504, phase1521, phase1533, phase1600] = karte.phasen;

  // Der Atlantik teilt das Bild: alles links von dieser Grenze liegt in
  // Amerika, alles rechts davon in der Alten Welt. Bei 6,4 Einheiten je Grad
  // ist 500 der Meridian 36° W — mitten im Ozean, weit von beiden Ufern.
  const ATLANTIK = 500;
  const schwerpunkt = (flaeche) => {
    const punkte = eckpunkte(flaeche.d);
    return punkte.reduce((s, [x]) => s + x, 0) / punkte.length;
  };
  const inAmerika = (phase) => phase.flaechen.filter((f) => schwerpunkt(f) < ATLANTIK);
  const inEuropa = (phase) => phase.flaechen.filter((f) => schwerpunkt(f) >= ATLANTIK);

  // „Zwei Welten auf einem Bild, die nichts voneinander wissen": 1492 stehen
  // zwei Mächte links und zwei rechts vom Ozean, und dazwischen ist nichts.
  pruefe('Amerika-Karte: 1492 stehen zwei Mächte in Amerika', inAmerika(phase1492).length === 2);
  pruefe('Amerika-Karte: 1492 stehen zwei Mächte in Europa', inEuropa(phase1492).length === 2);

  // Der Kern der Sache: 1492 gibt es in Amerika keine einzige spanische
  // Fläche, danach wächst sie von einer Insel auf zwei Vizekönigreiche.
  const SPANISCH_AMERIKA = /Hispaniola|Kuba|Puerto Rico|Neuspanien|Vizekönigreich Peru/;
  const spanisch = karte.phasen.map((p) => groesseVon(p, SPANISCH_AMERIKA));
  pruefe('Amerika-Karte: 1492 gibt es in Amerika kein spanisches Gebiet', spanisch[0] === 0);
  pruefe('Amerika-Karte: 1492–1504 ist Hispaniola der einzige Stützpunkt',
    groesseVon(phase1504, /Hispaniola/) > 0 && inAmerika(phase1504).length === 3);
  pruefe('Amerika-Karte: das spanische Gebiet in Amerika wächst von Phase zu Phase',
    spanisch.every((g, i) => i === 0 || g >= spanisch[i - 1]));
  pruefe('Amerika-Karte: um 1600 ist es ein Vielfaches des ersten Stützpunkts',
    spanisch[4] > spanisch[1] * 10);

  // Erst fällt Tenochtitlan, dann Cusco: Das Aztekenreich steht auf den ersten
  // drei Phasen und ist danach vom Umschalter verschwunden, das Reich der Inka
  // auf den ersten vier.
  const AZTEKEN = /Aztekenreich/;
  const INKA = /Reich der Inka/;
  pruefe('Amerika-Karte: das Aztekenreich steht 1492, 1504 und 1521 auf der Karte',
    [phase1492, phase1504, phase1521].every((p) => groesseVon(p, AZTEKEN) > 0));
  pruefe('Amerika-Karte: ab 1532 gibt es das Aztekenreich nicht mehr',
    groesseVon(phase1533, AZTEKEN) === 0 && groesseVon(phase1600, AZTEKEN) === 0);
  pruefe('Amerika-Karte: das Reich der Inka steht auf den ersten vier Phasen',
    [phase1492, phase1504, phase1521, phase1533].every((p) => groesseVon(p, INKA) > 0));
  pruefe('Amerika-Karte: um 1600 gibt es das Reich der Inka nicht mehr',
    groesseVon(phase1600, INKA) === 0);
  // Auf seinem Platz steht dann das Vizekönigreich Peru — und es ist größer,
  // denn es reicht bis Panama.
  pruefe('Amerika-Karte: um 1600 steht dort das Vizekönigreich Peru',
    groesseVon(phase1600, /Vizekönigreich Peru/) > groesseVon(phase1533, INKA));

  // Das Reich der Inka war das größere der beiden — auf der Karte wie in der
  // Wirklichkeit (rund 4000 km Länge gegen ein Hochtal).
  pruefe('Amerika-Karte: das Reich der Inka ist größer als das Aztekenreich',
    groesseVon(phase1492, INKA) > groesseVon(phase1492, AZTEKEN));

  // „Im Zweifel lieber keine Fläche als eine erfundene": Nordamerika nördlich
  // von Mexiko bleibt in jeder Phase leer. Keine Fläche darf über den 30.
  // Breitengrad nach Norden reichen — außer denen in Europa.
  const y30Nord = (45 - 30) * (karte.hoehe / (RAHMEN.maxLat - RAHMEN.minLat));
  const nordamerikaLeer = karte.phasen.every((phase) =>
    phase.flaechen
      .filter((f) => schwerpunkt(f) < ATLANTIK)
      .every((f) => eckpunkte(f.d).every(([, y]) => y > y30Nord)));
  pruefe('Amerika-Karte: Nordamerika nördlich des 30. Breitengrads bleibt leer',
    nordamerikaLeer);
  pruefe('Amerika-Karte: der Hinweis von 1600 sagt selbst, wie zurückhaltend die Flächen sind',
    phase1600.hinweis.includes('zurückhaltend') && phase1600.hinweis.includes('leer'));
  // Und die Karte gibt zu, dass das Aztekenreich kein Staat mit Grenzen war.
  pruefe('Amerika-Karte: der Hinweis von 1521 nennt die Tlaxcalteken',
    phase1521.hinweis.includes('Tlaxcal'));
  pruefe('Amerika-Karte: der Hinweis von 1532 nennt Seuche und Bürgerkrieg vor Pizarro',
    phase1533.hinweis.includes('Pocken') && phase1533.hinweis.includes('Bürgerkrieg'));

  // --- 3. Atlas-Gegenprobe -----------------------------------------------
  // Die Vorgabe des Betreibers lautet: Die Regionen müssen erkennbar sein,
  // keine abstrakte Skizze. Die Küstenlinien stehen im Kartenmodul als echte
  // Längen-/Breitengrade — wenn bekannte Häfen auf der gezeichneten Küste
  // liegen, ist die Karte ein Atlas und keine Fantasie.
  const geo = erstelleProjektion(RAHMEN);
  pruefe('Amerika-Karte: die Höhe passt zum angenommenen Ausschnitt', geo.hoehe === karte.hoehe);
  pruefe('Amerika-Karte: die Breite passt zum angenommenen Ausschnitt', geo.breite === karte.breite);

  // Nur Küsten — Flüsse würden die Probe verwässern, weil sie mitten im Land
  // liegen.
  const kuestenpunkte = karte.basis
    .filter((teil) => teil.art === 'land')
    .flatMap((teil) => eckpunkte(teil.d));
  pruefe('Amerika-Karte: es gibt Küstenlinien zu prüfen', kuestenpunkte.length > 350);

  /** Abstand einer geografischen Landmarke zur nächsten gezeichneten Küste. */
  const abstandZurKueste = (lon, lat) => {
    const [x, y] = geo.punkt(lon, lat);
    return kuestenpunkte.reduce(
      (naechster, [kx, ky]) => Math.min(naechster, Math.hypot(kx - x, ky - y)),
      Infinity,
    );
  };

  // Toleranz ein voller Längengrad — das ist der grobe Maßstab dieser
  // Übersichtskarte (6,4 Einheiten je Grad, die weiteste der App; zum
  // Vergleich: bei den Europakarten sind es 12,7 bis 16,3, dort genügen 0,6).
  // Die Werte unten liegen absichtlich alle mindestens 0,1 Grad NEBEN dem
  // nächsten Eckpunkt des Kartenmoduls: So prüft der Test die gezeichnete
  // Linie und nicht die abgeschriebene Zahl. Nachrechnen lässt sich das mit
  // `node tools/pruef-eroberung-amerikas.mjs`.
  const TOLERANZ = EINHEITEN_JE_GRAD;
  const landmarken = [
    ['Ensenada in Niederkalifornien', -116.62, 31.86],
    ['die Bucht von Magdalena', -112.1, 24.6],
    ['Zihuatanejo an der Pazifikküste Mexikos', -101.55, 17.64],
    ['Campeche am Golf von Mexiko', -90.53, 19.85],
    ['Cozumel vor Yucatán', -86.95, 20.51],
    ['La Ceiba in Honduras', -86.79, 15.78],
    ['Bluefields an der Moskitoküste', -83.77, 12.01],
    ['Colón auf der Karibikseite des Isthmus', -79.9, 9.35],
    ['Santa Marta in Kolumbien', -74.2, 11.24],
    ['Paramaribo an der Guayanaküste', -55.17, 5.85],
    ['Maceió in Brasilien', -35.74, -9.67],
    ['Ilhéus in Bahia', -39.04, -14.79],
    ['Cabo Frio bei Rio de Janeiro', -42.02, -22.88],
    ['Paita an der Nordküste Perus', -81.11, -5.09],
    ['Salaverry bei Trujillo', -79.03, -8.23],
    ['Matanzas an der Nordküste Kubas', -81.58, 23.05],
    ['Santiago de Cuba', -75.82, 19.97],
    ['Cap-Haïtien auf Hispaniola', -72.2, 19.76],
    ['Mayagüez auf Puerto Rico', -67.14, 18.2],
    ['Kingston auf Jamaika', -76.79, 17.99],
    ['Santa Cruz auf Teneriffa', -16.25, 28.47],
    ['Arrecife auf Lanzarote', -13.55, 28.96],
    ['Vigo an der galicischen Küste', -8.72, 42.24],
    ['Gijón an der Nordküste Spaniens', -5.66, 43.54],
    ['Porto an der Douromündung', -8.68, 41.15],
    ['Tanger an der Straße von Gibraltar', -5.8, 35.79],
    ['Nouakchott in Mauretanien', -15.98, 18.08],
    ['Monrovia in Westafrika', -10.8, 6.3],
    ['Key West an der Südspitze Floridas', -81.78, 24.55],
    ['Norfolk an der Chesapeake Bay', -76.29, 36.85],
    ['die Mündung des Hudson bei New York', -74.02, 40.7],
    ['Boston an der Massachusetts Bay', -71.05, 42.36],
    ['die Bucht von Tampa', -82.55, 27.75],
    ['Savannah in Georgia', -81.09, 32.08],
    ['die Galveston Bay in Texas', -94.95, 29.55],
    ['die Mündung des Mississippi', -89.25, 29.15],
  ];
  for (const [name, lon, lat] of landmarken) {
    pruefe(`Amerika-Karte: ${name} liegt auf der gezeichneten Küste`,
      abstandZurKueste(lon, lat) < TOLERANZ);
  }

  // Und die Gegenprobe zur Gegenprobe: Keiner dieser Orte darf zugleich ein
  // Eckpunkt des Kartenmoduls sein, sonst prüft der Test seine eigene Vorlage.
  pruefe('Amerika-Karte: keine Landmarke ist als Eckpunkt abgeschrieben',
    landmarken.every(([, lon, lat]) => abstandZurKueste(lon, lat) > EINHEITEN_JE_GRAD * 0.1));

  // Im Binnenland und auf offener See darf keine Küste liegen, sonst wäre der
  // Test durch schiere Punktdichte immer erfüllt. Der erste Kontrollpunkt ist
  // die Bühne dieses Kapitels: mitten im Atlantik.
  const abseits = [
    ['mitten im Atlantik', -45, 25],
    ['mitten im Pazifik', -105, 10],
    ['in der Sahara', -8, 25],
    ['im Amazonasbecken', -60, -5],
    ['auf der Hochebene von Mexiko', -101, 20.5],
    ['im Golf von Mexiko', -91, 25],
    ['im Karibischen Meer', -75, 15],
    ['auf der kastilischen Meseta', -5.5, 41.0],
    ['in den Anden bei Cusco', -72, -13.5],
    ['in der Prärie Nordamerikas', -95, 40],
  ];
  for (const [wo, lon, lat] of abseits) {
    pruefe(`Amerika-Karte: ${wo} liegt keine Küste`,
      abstandZurKueste(lon, lat) > TOLERANZ * 2);
  }

  // --- 4. Der Untergrund --------------------------------------------------
  const landflaechen = karte.basis.filter((teil) => teil.art === 'land');
  pruefe('Amerika-Karte: Festland, Antillen, Kanaren und die Alte Welt sind getrennt',
    landflaechen.length >= 12);
  pruefe('Amerika-Karte: jede Landmasse ist ein geschlossener Pfad',
    landflaechen.every((teil) => teil.d.trim().endsWith('Z')));
  pruefe('Amerika-Karte: die Flüsse des Kapitels sind gezeichnet',
    karte.basis.filter((teil) => teil.art === 'fluss').length >= 5);
  // Mehr als die Hälfte des Bildes ist Wasser — der Ozean ist hier keine
  // Lücke, sondern der Gegenstand.
  const grund = karte.basis[0];
  pruefe('Amerika-Karte: das Meer liegt als Untergrund unter allem',
    grund.art === 'grund' && grund.d.includes(String(karte.breite)));

  // --- 5. Die Info-Punkte -------------------------------------------------
  const punkte = Object.fromEntries(karte.punkte.map((p) => [p.id, p]));
  for (const id of ['sevilla', 'kanaren', 'guanahani', 'santo-domingo', 'tenochtitlan', 'cusco']) {
    pruefe(`Amerika-Karte: „${id}" ist ein Info-Punkt`, Boolean(punkte[id]));
  }
  // y wächst nach unten: größeres y heißt weiter südlich.
  pruefe('Amerika-Karte: Cusco ist der südlichste Punkt',
    karte.punkte.every((p) => p.id === 'cusco' || p.y < punkte.cusco.y));
  pruefe('Amerika-Karte: Tenochtitlan ist der westlichste Punkt',
    karte.punkte.every((p) => p.id === 'tenochtitlan' || p.x > punkte.tenochtitlan.x));
  pruefe('Amerika-Karte: Sevilla ist der östlichste Punkt',
    karte.punkte.every((p) => p.id === 'sevilla' || p.x < punkte.sevilla.x));
  pruefe('Amerika-Karte: die Kanaren liegen zwischen Sevilla und Guanahani',
    punkte.kanaren.x < punkte.sevilla.x && punkte.kanaren.x > punkte.guanahani.x);
  // TONE-REGEL: Der Punkt zur Ankunft darf nicht nur die Bewunderung aus dem
  // Bordbuch zitieren, sondern muss auch den Satz daneben nennen.
  pruefe('Amerika-Karte: Guanahani nennt beide Seiten des Bordbuchs',
    punkte.guanahani.text.includes('unterwerfen') && punkte.guanahani.text.includes('Taíno'));
  pruefe('Amerika-Karte: Santo Domingo benennt den Bevölkerungssturz und seine Folge',
    punkte['santo-domingo'].text.includes('Zwangsarbeit') &&
    punkte['santo-domingo'].text.includes('Afrika'));
  pruefe('Amerika-Karte: Tenochtitlan nennt die Größe der Stadt vor dem Fall',
    punkte.tenochtitlan.text.includes('200 000') && punkte.tenochtitlan.text.includes('1521'));
  pruefe('Amerika-Karte: Cusco widerspricht dem Bild vom Reich, das sofort zusammenbrach',
    punkte.cusco.text.includes('1572') && punkte.cusco.text.includes('Vilcabamba'));
  pruefe('Amerika-Karte: die Kanaren erzählen auch ihre eigene Vorgeschichte',
    punkte.kanaren.text.includes('Guanchen'));

  // --- 6. Die Bewegungen --------------------------------------------------
  const bewegung = Object.fromEntries(karte.bewegungen.map((b) => [b.id, b]));
  for (const id of ['kolumbus', 'cortes', 'pizarro']) {
    pruefe(`Amerika-Karte: die Bewegung „${id}" ist da`, Boolean(bewegung[id]));
  }
  const beiPunkt = (paar, id) =>
    Math.hypot(paar[0] - punkte[id].x, paar[1] - punkte[id].y) < 1;
  const laeuftUeber = (b, id) => (b.ueber || []).some((punkt) => beiPunkt(punkt, id));

  pruefe('Amerika-Karte: Kolumbus fährt nach Westen', bewegung.kolumbus.nach[0] < bewegung.kolumbus.von[0]);
  pruefe('Amerika-Karte: Kolumbus nimmt den Umweg über die Kanaren',
    laeuftUeber(bewegung.kolumbus, 'kanaren'));
  pruefe('Amerika-Karte: Kolumbus endet in Guanahani',
    beiPunkt(bewegung.kolumbus.nach, 'guanahani'));
  // Der Umweg nach Süden ist Seemannschaft und keine Zierde: Die Kanaren
  // liegen deutlich südlicher als der Ausgangspunkt.
  pruefe('Amerika-Karte: der Weg führt erst nach Süden, dann geradeaus',
    bewegung.kolumbus.ueber[0][1] > bewegung.kolumbus.von[1]);

  pruefe('Amerika-Karte: Cortés zieht von Kuba nach Tenochtitlan',
    bewegung.cortes.nach[0] < bewegung.cortes.von[0] &&
    beiPunkt(bewegung.cortes.nach, 'tenochtitlan'));
  pruefe('Amerika-Karte: Cortés’ Text nennt das Bündnis mit Tlaxcala',
    bewegung.cortes.text.includes('Tlaxcal') && bewegung.cortes.text.includes('Bündnis'));
  pruefe('Amerika-Karte: Cortés’ Text gibt die Beweggründe der Verbündeten wieder',
    bewegung.cortes.text.includes('eigene Gründe'));

  pruefe('Amerika-Karte: Pizarro zieht von Panama nach Süden bis Cusco',
    bewegung.pizarro.nach[1] > bewegung.pizarro.von[1] &&
    beiPunkt(bewegung.pizarro.nach, 'cusco'));
  pruefe('Amerika-Karte: Pizarros Text benennt Cajamarca und das Lösegeld',
    bewegung.pizarro.text.includes('Cajamarca') && bewegung.pizarro.text.includes('Lösegeld'));

  // Die Gegenbewegung: Was 1492 nach Westen fuhr, kommt ab 1545 als Silber
  // zurück — auf derselben Karte, in derselben Richtung rückwärts.
  if (bewegung.silber) {
    pruefe('Amerika-Karte: der Silberstrom läuft nach Osten zurück',
      bewegung.silber.nach[0] > bewegung.silber.von[0]);
    pruefe('Amerika-Karte: der Silberstrom endet in Sevilla',
      beiPunkt(bewegung.silber.nach, 'sevilla'));
    pruefe('Amerika-Karte: der Silberstrom benennt die Zwangsarbeit der Mita',
      bewegung.silber.text.includes('Mita') && bewegung.silber.text.includes('Zwangsarbeit'));
  }

  // --- 7. Beschriftungen -------------------------------------------------
  const beschriftungen = karte.beschriftungen || [];
  const texte = beschriftungen.map((b) => b.text);
  for (const name of [
    'Mexiko', 'Yucatán', 'Kuba', 'Peru', 'Brasilien', 'Iberien', 'Kanaren',
    'Atlantischer Ozean', 'Pazifischer Ozean', 'Karibisches Meer',
  ]) {
    pruefe(`Amerika-Karte: „${name}" ist beschriftet`, texte.includes(name));
  }
  pruefe('Amerika-Karte: es gibt Beschriftungen für Land und Meer',
    beschriftungen.some((b) => b.art === 'land') && beschriftungen.some((b) => b.art === 'meer'));

  // --- 8. Zusammenspiel mit dem Lernformat -------------------------------
  pruefe('Lernformat: „Die Eroberung Amerikas" zeigt den Karten-Abschnitt',
    abschnitteFuer(thema).some((a) => a.id === 'karte'));
  pruefe('Lernformat: der Karten-Abschnitt steht direkt hinter dem Aufhänger',
    abschnitteFuer(thema).findIndex((a) => a.id === 'karte') === 1);

  // --- 9. Das Modul selbst -----------------------------------------------
  // Runde 11 legt nur die europäische Sichtweise an (Opus); die indigene
  // Sichtweise ergänzt Hermes danach. Der generische Schema-Test in
  // tests/themen.mjs nimmt alle Perspektiven automatisch mit — hier steht nur,
  // was für dieses Thema besonders gilt.
  const europaeisch = thema.perspektiven.find((p) => p.id === 'europaeische-sicht');
  pruefe('„Eroberung Amerikas": die europäische Sichtweise ist da und stammt von Opus',
    Boolean(europaeisch) && europaeisch.stimme === 'Opus');
  pruefe('„Eroberung Amerikas": die Perspektive gibt sich als Sicht der Ankommenden zu erkennen',
    europaeisch.text.includes('Sicht derer, die ankamen'));
  pruefe('„Eroberung Amerikas": die Perspektive öffnet die Tür zur zweiten Stimme',
    europaeisch.text.includes('zweiten Stimme') && europaeisch.text.includes('indigene'));
  // Und sie sagt ausdrücklich, dass die Reihenfolge keine Rangfolge ist —
  // dieselbe Zusage wie beim Modul „Israel und Palästina".
  pruefe('„Eroberung Amerikas": die Reihenfolge der Stimmen wird als willkürlich benannt',
    europaeisch.text.includes('gleichwertig'));

  // Die Stationen des Kapitels.
  for (const stichwort of [
    '1492', 'Guanahani', 'Kanarischen Inseln', 'Pocken', 'Cortés', 'Tenochtitlan',
    'Tlaxcala', 'Moctezuma', 'Pizarro', 'Atahualpa', 'Cajamarca', 'Encomienda',
    'Potosí', 'Mita', 'Sevilla',
  ]) {
    pruefe(`„Eroberung Amerikas": die Perspektive erzählt von „${stichwort}"`,
      europaeisch.text.includes(stichwort));
  }

  // Die Vorgabe des Betreibers: Die Krankheiten sind das zentrale Thema, mit
  // Zahlen nach Forschungsstand — und ausdrücklich mit deren Unsicherheit.
  pruefe('„Eroberung Amerikas": der Bevölkerungseinbruch steht mit Zahlen da',
    europaeisch.text.includes('Zentralmexiko') && europaeisch.text.includes('25 Millionen'));
  pruefe('„Eroberung Amerikas": die Zahlen werden als Schätzungen gekennzeichnet',
    europaeisch.text.includes('Die Zahlen sind umstritten'));
  pruefe('„Eroberung Amerikas": die Seuchen stehen vor allen anderen Ursachen',
    europaeisch.text.indexOf('Der wichtigste Faktor') <
      europaeisch.text.indexOf('Die Technik'));

  // TONE-REGEL für sensible Themen (CLAUDE.md): Die eigene Erzählung muss ihre
  // unbequemen Stellen selbst benennen, statt sie der Gegenstimme zu
  // überlassen — und sie darf die andere Seite nicht verunglimpfen.
  pruefe('„Eroberung Amerikas": die Perspektive benennt das Requerimiento',
    europaeisch.text.includes('Requerimiento'));
  pruefe('„Eroberung Amerikas": die Perspektive benennt Cholula',
    europaeisch.text.includes('Cholula'));
  pruefe('„Eroberung Amerikas": die Perspektive benennt den Sklavenhandel als Folge',
    europaeisch.text.includes('Sklavenhandel'));
  pruefe('„Eroberung Amerikas": die Perspektive nennt die Kritiker aus den eigenen Reihen',
    europaeisch.text.includes('Las Casas') && europaeisch.text.includes('Montesinos') &&
    europaeisch.text.includes('Vitoria'));
  pruefe('„Eroberung Amerikas": auch Las Casas wird nicht zum Helden verklärt',
    europaeisch.text.includes('afrikanische Sklaven'));
  pruefe('„Eroberung Amerikas": die Perspektive prüft das Wort „Entdeckung" selbst',
    europaeisch.text.includes('Entdecken') && europaeisch.text.includes('Behauptung'));
  pruefe('„Eroberung Amerikas": die Perspektive räumt mit der Quetzalcoatl-Legende auf',
    europaeisch.text.includes('Quetzalcoatl') && europaeisch.text.includes('nachträgliche'));
  pruefe('„Eroberung Amerikas": die Perspektive verwirft die eigene Lieblingserklärung',
    europaeisch.text.includes('überlegene Kultur'));
  // Und sie erklärt die Gegenseite nicht zu Opfern ohne eigenes Handeln: Die
  // Beweggründe der Verbündeten und der Widerstand stehen ausdrücklich da.
  pruefe('„Eroberung Amerikas": die Beweggründe der indigenen Verbündeten werden fair wiedergegeben',
    europaeisch.text.includes('nachvollziehbar'));
  pruefe('„Eroberung Amerikas": der jahrzehntelange Widerstand wird benannt',
    europaeisch.text.includes('Manco Inca') && europaeisch.text.includes('Vierzig Jahre Widerstand'));

  // Solange nur eine Stimme dasteht, muss die Synthese das sagen. Die Prüfung
  // ist zustandstolerant: Sie akzeptiert den Zwischenstand ebenso wie die
  // spätere Fassung, die beide Stimmen zusammenführt (Muster der Runden 8–10).
  const zweiteStimme = thema.perspektiven.find((p) => p.stimme === 'Hermes');
  if (!zweiteStimme) {
    pruefe('„Eroberung Amerikas": die Synthese sagt offen, dass eine Sicht fehlt',
      thema.synthese.includes('noch nicht fertig') && thema.synthese.includes('indigene'));
  } else {
    pruefe('„Eroberung Amerikas": die Synthese führt beide Sichtweisen zusammen',
      thema.synthese.includes('indigene') && thema.synthese.includes('europäische'));
  }
  // Diese Zusage gilt in beiden Zuständen: „Der Sieger schreibt die
  // Geschichte" ist hier keine Redensart, sondern der Befund.
  pruefe('„Eroberung Amerikas": die Synthese benennt die zerstörten Quellen der anderen Seite',
    thema.synthese.includes('Maya') && thema.synthese.includes('verbrenn'));

  pruefe('„Eroberung Amerikas" hat 3 bis 5 Quizfragen',
    thema.quiz.length >= 3 && thema.quiz.length <= 5);
  pruefe('„Eroberung Amerikas": jede Quizfrage hat eine gültige richtige Antwort',
    thema.quiz.every((f) => typeof f.antworten[f.richtig] === 'string'));
  pruefe('„Eroberung Amerikas": jede Quizfrage wird erklärt',
    thema.quiz.every((f) => f.erklaerung.trim().length > 40));
  // Die Quizfragen bleiben Wissensfragen: keine Schuldfrage, keine Frage
  // danach, wem ein Land gehört (Zusatzregel für sensible Themen).
  const quizText = thema.quiz.map((f) => f.frage).join(' ');
  pruefe('„Eroberung Amerikas": keine Quizfrage fragt nach Schuld oder Besitz',
    !/[Ss]chuld|gehört|Recht auf|wem geh/.test(quizText));
  pruefe('„Eroberung Amerikas": das Urteil ist offen gestellt', thema.urteil.frage.includes('?'));
  pruefe('„Eroberung Amerikas": das Urteil fragt nach dem Wort, nicht nach der Schuld',
    thema.urteil.frage.includes('Entdeckung') && thema.urteil.frage.includes('Eroberung') &&
    !/[Ss]chuld/.test(thema.urteil.frage));
  pruefe('„Eroberung Amerikas": das Urteil bekommt einen Denkanstoß',
    typeof thema.urteil.hinweis === 'string' && thema.urteil.hinweis.length > 40);
  pruefe('„Eroberung Amerikas" steht als Modul 9 hinter dem Mittelalter',
    alleThemen[8] === thema && alleThemen[7].id === 'mittelalter');
}
