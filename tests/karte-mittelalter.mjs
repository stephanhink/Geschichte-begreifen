// Prüfungen für die Karte zum Thema „Vom Mittelalter zur Neuzeit" — und für
// das, was das Themen-Modul an der Karte hängen hat.
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe:
// läuft mit blankem `node`.
//
// Das Karten-Schema und die Rechenwerkzeuge aus utils/karte-geo.js prüft
// tests/karte.mjs — hier geht es nur um diese eine Karte:
//   1. Vollständigkeit und Aufbau (Phasen, Punkte, Bewegungen, Beschriftungen).
//   2. Atlas-Gegenprobe: Liegen bekannte Häfen auf der gezeichneten Küste? Und
//      liegt mitten in Anatolien keine?
//   3. Die Aussage steckt in der Geometrie: Karls Reich kommt nie wieder — die
//      Reichsfläche schrumpft von Phase zu Phase. Byzanz verschwindet zwischen
//      1200 und 1500 vom Bild, und an seiner Stelle steht das Osmanische
//      Reich. Von den Kreuzfahrerstaaten ist 1200 die kleinste Fläche übrig.
//   4. Die Bewegungen hängen an den Info-Punkten: Kreuzzug und Pest laufen
//      beide durch Konstantinopel — dieselbe Straße, einmal hin, einmal her.
//      Und der Pfeil von 1492 endet am Bildrand.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { pruefeKarte, KARTEN_PUNKT_TYPEN } = require('../utils/themen/schema.js');
const { erstelleProjektion } = require('../utils/karte-geo.js');
const { themaNachId, alleThemen } = require('../utils/themen/index.js');
const { abschnitteFuer } = require('../utils/lernformat.js');

/**
 * Der Kartenausschnitt, wie ihn utils/themen/karten/mittelalter.js aufspannt.
 * Steht hier noch einmal, damit die Atlas-Gegenprobe unten rechnen kann — dass
 * er stimmt, prüft der Test über die daraus folgende Höhe.
 */
const RAHMEN = { minLon: -11, maxLon: 44, minLat: 30, maxLat: 58, breite: 700 };

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
 * Der Flächeninhalt der ersten Fläche einer Phase, deren Titel passt.
 *
 * @param {object} phase
 * @param {RegExp} muster
 * @returns {number} 0, wenn keine Fläche passt
 */
function groesseVon(phase, muster) {
  const flaeche = phase.flaechen.find((f) => muster.test(f.titel));
  return flaeche ? flaecheninhalt(eckpunkte(flaeche.d)) : 0;
}

/**
 * @param {(name: string, ok: boolean) => void} pruefe Prüf-Funktion des Rahmens
 */
export function laufe(pruefe) {
  const thema = themaNachId('mittelalter');
  pruefe('„Vom Mittelalter zur Neuzeit" ist als Thema registriert', Boolean(thema));
  const karte = thema.karte;
  pruefe('„Vom Mittelalter zur Neuzeit" bringt eine Karte mit', Boolean(karte));

  // --- 1. Aufbau ---------------------------------------------------------
  pruefe('Mittelalter-Karte: erfüllt das Karten-Schema', pruefeKarte(karte).length === 0);
  pruefe('Mittelalter-Karte: hat 4 Phasen — von Karl dem Großen bis 1618',
    karte.phasen.length === 4);
  pruefe('Mittelalter-Karte: hat 6 bis 7 Info-Punkte',
    karte.punkte.length >= 6 && karte.punkte.length <= 7);
  pruefe('Mittelalter-Karte: hat mindestens 3 Bewegungen', karte.bewegungen.length >= 3);
  pruefe('Mittelalter-Karte: jeder Punkt-typ ist ein bekannter',
    karte.punkte.every((p) => KARTEN_PUNKT_TYPEN.includes(p.typ)));
  // Jeder Info-Punkt trägt Hintergrundwissen — die Karte ist die Bühne, die
  // Texte stehen dahinter. Ein Satz allein reicht dafür nicht.
  pruefe('Mittelalter-Karte: jeder Info-Punkt hat einen ausgeführten Text',
    karte.punkte.every((p) => p.text.trim().length > 200));
  pruefe('Mittelalter-Karte: jede Bewegung hat einen ausgeführten Text',
    karte.bewegungen.every((b) => b.text.trim().length > 200));
  pruefe('Mittelalter-Karte: jede Phase erklärt sich in einem Hinweis',
    karte.phasen.every((p) => typeof p.hinweis === 'string' && p.hinweis.length > 40));
  pruefe('Mittelalter-Karte: die Phasen-ids sind eindeutig',
    new Set(karte.phasen.map((p) => p.id)).size === karte.phasen.length);

  // Die vier Stationen des Kapitels.
  const labels = karte.phasen.map((p) => p.label).join(' | ');
  for (const jahr of ['800', '1200', '1500', '1618']) {
    pruefe(`Mittelalter-Karte: die Jahreszahl ${jahr} steht auf dem Umschalter`,
      labels.includes(jahr));
  }

  // Alles muss im Bild liegen — ein Punkt außerhalb wäre unantippbar.
  const imBild = ([x, y]) => x >= 0 && x <= karte.breite && y >= 0 && y <= karte.hoehe;
  pruefe('Mittelalter-Karte: alle Info-Punkte liegen im Bild',
    karte.punkte.every((p) => imBild([p.x, p.y])));
  pruefe('Mittelalter-Karte: alle Bewegungen liegen im Bild',
    karte.bewegungen.every((b) => [b.von, b.nach, ...(b.ueber || [])].every(imBild)));
  pruefe('Mittelalter-Karte: alle Beschriftungen liegen im Bild',
    (karte.beschriftungen || []).every((b) => imBild([b.x, b.y])));

  // --- 2. Die Erzählung steckt in der Geometrie --------------------------
  const [karlPhase, phase1200, phase1500, phase1618] = karte.phasen;

  // Das Gegenstück zur Königreiche-Karte: Dort wuchs das Frankenreich über
  // vier Phasen zur größten Fläche. Hier schrumpft dieselbe Herrschaft wieder
  // — Karls Reich kommt nie zurück, und genau daraus entsteht das
  // vielgeteilte Europa, das 1618 in den Krieg zieht.
  const REICH = /Reich Karls des Großen|Heilige Römische Reich/;
  const reichsgroessen = [karlPhase, phase1200, phase1500].map((p) => groesseVon(p, REICH));
  pruefe('Mittelalter-Karte: auf den ersten drei Phasen steht das Reich',
    reichsgroessen.every((g) => g > 0));
  pruefe('Mittelalter-Karte: das Reich wird von Phase zu Phase kleiner',
    reichsgroessen.every((g, i) => i === 0 || g < reichsgroessen[i - 1]));

  // Byzanz steht 800 und 1200 im Bild und ist 1500 verschwunden — an seiner
  // Stelle steht dann das Osmanische Reich. Das ist der Bogen zurück zu den
  // früheren Kapiteln dieser App, in denen Ostrom immer noch dastand.
  const BYZANZ = /Byzantinische Reich/;
  const OSMANEN = /Osmanische Reich/;
  pruefe('Mittelalter-Karte: Byzanz steht 800 und 1200 auf der Karte',
    groesseVon(karlPhase, BYZANZ) > 0 && groesseVon(phase1200, BYZANZ) > 0);
  pruefe('Mittelalter-Karte: Byzanz wird zwischen 800 und 1200 kleiner',
    groesseVon(phase1200, BYZANZ) < groesseVon(karlPhase, BYZANZ));
  pruefe('Mittelalter-Karte: 1500 gibt es Byzanz nicht mehr',
    groesseVon(phase1500, BYZANZ) === 0);
  pruefe('Mittelalter-Karte: 1500 steht an seiner Stelle das Osmanische Reich',
    groesseVon(phase1500, OSMANEN) > 0 && groesseVon(karlPhase, OSMANEN) === 0);

  // „Was 1200 von den Kreuzfahrerstaaten übrig ist, sagt mehr als jede
  // Erzählung": Sie müssen die kleinste Fläche der Phase sein.
  const kreuzfahrer = groesseVon(phase1200, /Kreuzfahrerstaaten/);
  pruefe('Mittelalter-Karte: 1200 sind die Kreuzfahrerstaaten die kleinste Fläche',
    kreuzfahrer > 0 &&
    phase1200.flaechen.every((f) => flaecheninhalt(eckpunkte(f.d)) >= kreuzfahrer));

  // 1618 stehen zwei Konfessionsflächen nebeneinander, und sie berühren
  // einander an einer gemeinsamen Kante — anders lässt sich die Teilung mit
  // einer einzigen Flächenfarbe nicht zeigen (siehe Kopf des Kartenmoduls).
  const katholisch = phase1618.flaechen.find((f) => f.titel.includes('katholisch'));
  const protestantisch = phase1618.flaechen.find((f) => f.titel.includes('protestantisch'));
  pruefe('Mittelalter-Karte: 1618 gibt es eine katholische und eine protestantische Fläche',
    Boolean(katholisch) && Boolean(protestantisch));
  const alsText = (flaeche) => new Set(eckpunkte(flaeche.d).map(([x, y]) => `${x}|${y}`));
  const gemeinsam = [...alsText(katholisch)].filter((k) => alsText(protestantisch).has(k));
  pruefe('Mittelalter-Karte: die beiden Konfessionsflächen teilen sich eine Kante',
    gemeinsam.length >= 8);
  pruefe('Mittelalter-Karte: der Hinweis von 1618 gibt zu, wie grob diese Linie ist',
    phase1618.hinweis.includes('grob') && phase1618.hinweis.includes('Böhmen'));

  // --- 3. Atlas-Gegenprobe -----------------------------------------------
  // Die Vorgabe des Betreibers lautet: Die Regionen müssen erkennbar sein,
  // keine abstrakte Skizze. Die Küstenlinien stehen im Kartenmodul als echte
  // Längen-/Breitengrade — wenn bekannte Häfen auf der gezeichneten Küste
  // liegen, ist die Karte ein Atlas und keine Fantasie.
  const geo = erstelleProjektion(RAHMEN);
  pruefe('Mittelalter-Karte: die Höhe passt zum angenommenen Ausschnitt', geo.hoehe === karte.hoehe);
  pruefe('Mittelalter-Karte: die Breite passt zum angenommenen Ausschnitt', geo.breite === karte.breite);

  // Nur Küsten und Seeufer — Flüsse würden die Probe verwässern, weil sie
  // mitten im Land liegen.
  const kuestenpunkte = karte.basis
    .filter((teil) => teil.art === 'land' || teil.art === 'wasser')
    .flatMap((teil) => eckpunkte(teil.d));
  pruefe('Mittelalter-Karte: es gibt Küstenlinien zu prüfen', kuestenpunkte.length > 400);

  /** Abstand einer geografischen Landmarke zur nächsten gezeichneten Küste. */
  const abstandZurKueste = (lon, lat) => {
    const [x, y] = geo.punkt(lon, lat);
    return kuestenpunkte.reduce(
      (naechster, [kx, ky]) => Math.min(naechster, Math.hypot(kx - x, ky - y)),
      Infinity,
    );
  };

  // Toleranz 0,6 Grad wie bei den Nachbarkarten. Die Werte unten liegen
  // absichtlich alle mindestens 0,1 Grad NEBEN dem nächsten Eckpunkt des
  // Kartenmoduls: So prüft der Test die gezeichnete Linie und nicht die
  // abgeschriebene Zahl. Der Ausschnitt ist der größte der App, deshalb
  // reichen die Marken vom Firth of Forth bis nach Antiochia.
  const TOLERANZ = EINHEITEN_JE_GRAD * 0.6;
  const landmarken = [
    ['der Firth of Forth in Schottland', -2.7, 56.1],
    ['Belfast Lough auf Irland', -5.7, 54.7],
    ['die Themsemündung', 0.8, 51.45],
    ['Ostende an der flandrischen Küste', 2.92, 51.23],
    ['Le Havre an der Seinemündung', 0.1, 49.49],
    ['Bremerhaven an der Wesermündung', 8.58, 53.55],
    ['Esbjerg an Jütlands Westküste', 8.45, 55.47],
    ['das Stettiner Haff an der Ostsee', 14.25, 53.92],
    ['Danzig an der Weichselmündung', 18.65, 54.35],
    ['Brest an der Spitze der Bretagne', -4.5, 48.38],
    ['Porto an der Douromündung', -8.68, 41.15],
    ['Kap Trafalgar', -6.03, 36.18],
    ['Tanger an der Meerenge', -5.8, 35.79],
    ['Genua am Ligurischen Meer', 8.95, 44.4],
    ['Neapel', 14.25, 40.85],
    ['Palermo auf Sizilien', 13.36, 38.13],
    ['Cagliari auf Sardinien', 9.1, 39.2],
    ['Izmir an der ägäischen Küste', 27.14, 38.42],
    ['der Bosporus bei Konstantinopel', 28.98, 41.02],
    ['das Donaudelta am Schwarzen Meer', 29.6, 45.2],
    ['Trapezunt an der Schwarzmeerküste', 39.72, 41.0],
    ['Antiochia an der Levanteküste', 35.9, 36.1],
  ];
  for (const [name, lon, lat] of landmarken) {
    pruefe(`Mittelalter-Karte: ${name} liegt auf der gezeichneten Küste`,
      abstandZurKueste(lon, lat) < TOLERANZ);
  }

  // Gegenprobe zur Gegenprobe: Im Binnenland und auf offener See darf keine
  // Küste liegen, sonst wäre der Test durch schiere Punktdichte immer erfüllt.
  const abseits = [
    ['mitten in Gallien', 3.0, 47.0],
    ['in Sachsen', 10.5, 52.0],
    ['auf der spanischen Meseta', -4.0, 40.8],
    ['in der ungarischen Tiefebene', 19.5, 46.8],
    ['in Polen', 20.0, 52.0],
    ['mitten in Anatolien', 33.0, 39.0],
    ['in der Sahara', 8.0, 31.0],
    ['mitten in der Nordsee', 3.5, 55.6],
    ['mitten in der Ostsee', 18.0, 56.6],
    ['im Golf von Biskaya', -5.0, 45.5],
    ['im Tyrrhenischen Meer', 12.0, 39.6],
    ['im Ionischen Meer', 19.5, 37.5],
    ['mitten im Schwarzen Meer', 34.0, 43.3],
    ['im östlichen Mittelmeer', 30.0, 34.0],
  ];
  for (const [wo, lon, lat] of abseits) {
    pruefe(`Mittelalter-Karte: ${wo} liegt keine Küste`,
      abstandZurKueste(lon, lat) > TOLERANZ * 2);
  }

  // --- 4. Der Untergrund --------------------------------------------------
  const landflaechen = karte.basis.filter((teil) => teil.art === 'land');
  pruefe('Mittelalter-Karte: Festland, Britannien, Irland und die Inseln sind getrennt',
    landflaechen.length >= 9);
  pruefe('Mittelalter-Karte: jede Landmasse ist ein geschlossener Pfad',
    landflaechen.every((teil) => teil.d.trim().endsWith('Z')));
  // Vor der Eisenbahn ist ein Fluss der billigste Weg, den es gibt — fast jede
  // Stadt dieses Kapitels liegt an einem.
  pruefe('Mittelalter-Karte: die Flüsse des Kapitels sind gezeichnet',
    karte.basis.filter((teil) => teil.art === 'fluss').length >= 10);

  // --- 5. Die Info-Punkte -------------------------------------------------
  const punkte = Object.fromEntries(karte.punkte.map((p) => [p.id, p]));
  for (const id of ['aachen', 'canossa', 'jerusalem', 'konstantinopel', 'mainz', 'wittenberg']) {
    pruefe(`Mittelalter-Karte: „${id}" ist ein Info-Punkt`, Boolean(punkte[id]));
  }
  // y wächst nach unten: größeres y heißt weiter südlich.
  pruefe('Mittelalter-Karte: Jerusalem ist der südlichste Punkt',
    karte.punkte.every((p) => p.id === 'jerusalem' || p.y < punkte.jerusalem.y));
  pruefe('Mittelalter-Karte: Jerusalem ist zugleich der östlichste Punkt',
    karte.punkte.every((p) => p.id === 'jerusalem' || p.x < punkte.jerusalem.x));
  pruefe('Mittelalter-Karte: Aachen ist der westlichste Punkt',
    karte.punkte.every((p) => p.id === 'aachen' || p.x > punkte.aachen.x));
  pruefe('Mittelalter-Karte: Wittenberg liegt nördlich von Canossa',
    punkte.wittenberg.y < punkte.canossa.y);
  // Die beiden Punkte, an denen dieses Kapitel seine Wendepunkte aufhängt.
  pruefe('Mittelalter-Karte: Canossa erzählt vom Streit um die Bischöfe',
    punkte.canossa.text.includes('1077') && punkte.canossa.text.includes('Bischöfe'));
  pruefe('Mittelalter-Karte: Mainz erzählt vom Buchdruck und seiner Folge',
    punkte.mainz.text.includes('Gutenberg') && punkte.mainz.text.includes('1517'));
  // TONE-REGEL: Die Kreuzzüge sind Glaube UND Gewalt. Wenn der Jerusalem-Punkt
  // das Blutbad von 1099 verschweigt, ist die Perspektive geschönt.
  pruefe('Mittelalter-Karte: Jerusalem benennt auch das Blutbad von 1099',
    punkte.jerusalem.text.includes('1099') && punkte.jerusalem.text.includes('Blutbad'));

  // --- 6. Die Bewegungen --------------------------------------------------
  const bewegung = Object.fromEntries(karte.bewegungen.map((b) => [b.id, b]));
  for (const id of ['kreuzzug', 'pest', 'kolumbus']) {
    pruefe(`Mittelalter-Karte: die Bewegung „${id}" ist da`, Boolean(bewegung[id]));
  }
  const beiPunkt = (paar, id) =>
    Math.hypot(paar[0] - punkte[id].x, paar[1] - punkte[id].y) < 1;
  pruefe('Mittelalter-Karte: der Kreuzzug endet in Jerusalem',
    beiPunkt(bewegung.kreuzzug.nach, 'jerusalem'));
  pruefe('Mittelalter-Karte: der Kreuzzug zieht nach Osten und Süden',
    bewegung.kreuzzug.nach[0] > bewegung.kreuzzug.von[0] &&
    bewegung.kreuzzug.nach[1] > bewegung.kreuzzug.von[1]);
  // Beide Bewegungen laufen durch dieselbe Stadt: Der Kreuzzug zieht hin, die
  // Pest kommt zurück. Handel, Glaube und Seuche benutzten dieselben Straßen.
  const laeuftUeber = (b, id) => (b.ueber || []).some((punkt) => beiPunkt(punkt, id));
  pruefe('Mittelalter-Karte: der Kreuzzug führt über Konstantinopel',
    laeuftUeber(bewegung.kreuzzug, 'konstantinopel'));
  pruefe('Mittelalter-Karte: die Pest nimmt denselben Weg über Konstantinopel',
    laeuftUeber(bewegung.pest, 'konstantinopel'));
  pruefe('Mittelalter-Karte: die Pest zieht von der Krim nach Nordwesten',
    bewegung.pest.nach[0] < bewegung.pest.von[0] && bewegung.pest.nach[1] < bewegung.pest.von[1]);
  pruefe('Mittelalter-Karte: die Pest beginnt 1347 in Kaffa auf der Krim',
    bewegung.pest.text.includes('Kaffa') && bewegung.pest.text.includes('1347'));
  // „Der Rand der Karte ist genau der Punkt, an dem Europa aufhört, sich
  // selbst für die Welt zu halten": Der Pfeil von 1492 muss nach Westen zeigen
  // und am Bildrand enden.
  pruefe('Mittelalter-Karte: Kolumbus fährt nach Westen',
    bewegung.kolumbus.nach[0] < bewegung.kolumbus.von[0]);
  pruefe('Mittelalter-Karte: der Pfeil von 1492 endet am westlichen Bildrand',
    bewegung.kolumbus.nach[0] < EINHEITEN_JE_GRAD * 2);

  // --- 7. Beschriftungen -------------------------------------------------
  const beschriftungen = karte.beschriftungen || [];
  const texte = beschriftungen.map((b) => b.text);
  for (const name of [
    'Frankenreich', 'Heiliges Römisches Reich', 'Frankreich', 'England', 'Spanien',
    'Italien', 'Byzanz', 'Osmanisches Reich', 'Mittelmeer', 'Ostsee', 'Rhein',
    'Donau', 'Schwarzes Meer',
  ]) {
    pruefe(`Mittelalter-Karte: „${name}" ist beschriftet`, texte.includes(name));
  }
  pruefe('Mittelalter-Karte: es gibt Beschriftungen für Land und Meer',
    beschriftungen.some((b) => b.art === 'land') && beschriftungen.some((b) => b.art === 'meer'));

  // --- 8. Zusammenspiel mit dem Lernformat -------------------------------
  pruefe('Lernformat: „Vom Mittelalter zur Neuzeit" zeigt den Karten-Abschnitt',
    abschnitteFuer(thema).some((a) => a.id === 'karte'));
  pruefe('Lernformat: der Karten-Abschnitt steht direkt hinter dem Aufhänger',
    abschnitteFuer(thema).findIndex((a) => a.id === 'karte') === 1);

  // --- 9. Das Modul selbst -----------------------------------------------
  // Runde 10 legt nur die Sicht der alten Ordnung an (Opus); die Stimme der
  // Städte ergänzt Hermes danach. Der generische Schema-Test in
  // tests/themen.mjs nimmt alle Perspektiven automatisch mit — hier steht nur,
  // was für dieses Thema besonders gilt.
  const alteOrdnung = thema.perspektiven.find((p) => p.id === 'alte-ordnung');
  pruefe('„Mittelalter": die Sicht der alten Ordnung ist da und stammt von Opus',
    Boolean(alteOrdnung) && alteOrdnung.stimme === 'Opus');
  pruefe('„Mittelalter": die Perspektive gibt sich als Sicht von oben zu erkennen',
    alteOrdnung.text.includes('Erzählung der alten Ordnung'));
  pruefe('„Mittelalter": die Perspektive öffnet die Tür zur zweiten Stimme',
    alteOrdnung.text.includes('zweiten Stimme') && alteOrdnung.text.includes('Städte'));
  // Die Stationen des Kapitels.
  for (const stichwort of [
    'Lehen', 'Canossa', 'Kreuzzüge', 'Saladin', 'Pest', 'Gutenberg', '1453', '1492',
    '1517', 'cuius regio, eius religio', '1618',
  ]) {
    pruefe(`„Mittelalter": die Perspektive erzählt von „${stichwort}"`,
      alteOrdnung.text.includes(stichwort));
  }
  // Die These des Kapitels: „finsteres Mittelalter" ist eine Deutung der
  // Renaissance, keine Tatsache. Ohne diesen Abschnitt fehlt dem Thema sein
  // Kern — und die Leitidee der App hätte hier kein Beispiel.
  pruefe('„Mittelalter": die Perspektive prüft den Namen der Epoche selbst',
    alteOrdnung.text.includes('Renaissance') && alteOrdnung.text.includes('Petrarca') &&
    alteOrdnung.text.includes('Zeit dazwischen'));
  pruefe('„Mittelalter": die Perspektive nennt, was der Name verschweigt',
    alteOrdnung.text.includes('Universitäten') && alteOrdnung.text.includes('Hexenverfolgungen'));
  // TONE-REGEL: Glaube UND Gewalt, Trost UND Macht. Die Perspektive muss die
  // unbequemen Stellen ihrer eigenen Welt benennen.
  pruefe('„Mittelalter": die Perspektive benennt die Gewalt der Kreuzzüge',
    alteOrdnung.text.includes('1099') && alteOrdnung.text.includes('Pogrome'));
  pruefe('„Mittelalter": die Perspektive benennt, wem die Ständeordnung nützte',
    alteOrdnung.text.includes('rechtfertigt'));

  // Solange nur eine Stimme dasteht, muss die Synthese das sagen.
  const zweiteStimme = thema.perspektiven.find((p) => p.stimme === 'Hermes');
  if (!zweiteStimme) {
    pruefe('„Mittelalter": die Synthese sagt offen, dass eine Stimme fehlt',
      thema.synthese.includes('noch nicht fertig') && thema.synthese.includes('Städte'));
  } else {
    pruefe('„Mittelalter": die Synthese führt beide Sichtweisen zusammen',
      thema.synthese.includes('alten Ordnung') && thema.synthese.includes('Städte'));
  }

  pruefe('„Mittelalter" hat 3 bis 5 Quizfragen',
    thema.quiz.length >= 3 && thema.quiz.length <= 5);
  pruefe('„Mittelalter": jede Quizfrage hat eine gültige richtige Antwort',
    thema.quiz.every((f) => typeof f.antworten[f.richtig] === 'string'));
  pruefe('„Mittelalter": jede Quizfrage wird erklärt',
    thema.quiz.every((f) => f.erklaerung.trim().length > 40));
  pruefe('„Mittelalter": das Urteil ist offen gestellt', thema.urteil.frage.includes('?'));
  pruefe('„Mittelalter": das Urteil bekommt einen Denkanstoß',
    typeof thema.urteil.hinweis === 'string' && thema.urteil.hinweis.length > 40);
  pruefe('„Mittelalter" steht als Modul 8 hinter den frühen Königreichen',
    alleThemen[7] === thema && alleThemen[6].id === 'koenigreiche');
}
