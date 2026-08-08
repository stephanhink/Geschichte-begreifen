// Prüfungen für die Karte zum Thema „China" — und für das, was das
// Themen-Modul an der Karte hängen hat.
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe:
// läuft mit blankem `node`.
//
// Das Karten-Schema und die Rechenwerkzeuge aus utils/karte-geo.js prüft
// tests/karte.mjs — hier geht es nur um diese eine Karte:
//   1. Vollständigkeit und Aufbau (Phasen, Punkte, Bewegungen, Beschriftungen).
//   2. Atlas-Gegenprobe: Liegen bekannte Küstenpunkte auf der gezeichneten
//      Küste? Und liegt mitten im Meer keine?
//   3. Die Erzählung muss in der Geometrie stecken: Qin < Han < Tang.
//   4. Die Verbindung nach Westen — ohne sie wäre diese Karte nur eine
//      Landkarte und nicht der Höhepunkt der Multiperspektivität.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { pruefeKarte, KARTEN_PUNKT_TYPEN } = require('../utils/themen/schema.js');
const { erstelleProjektion } = require('../utils/karte-geo.js');
const { themaNachId } = require('../utils/themen/index.js');
const { abschnitteFuer } = require('../utils/lernformat.js');

/**
 * Der Kartenausschnitt der China-Karte, wie ihn utils/themen/karten/china.js
 * aufspannt. Steht hier noch einmal, damit die Atlas-Gegenprobe unten rechnen
 * kann — dass er stimmt, prüft der Test über die daraus folgende Höhe.
 */
const CHINA_RAHMEN = { minLon: 58, maxLon: 145, minLat: 14, maxLat: 55, breite: 700 };

/** Wie viele SVG-Einheiten ein Längengrad breit ist — der Maßstab der Probe. */
const EINHEITEN_JE_GRAD = CHINA_RAHMEN.breite / (CHINA_RAHMEN.maxLon - CHINA_RAHMEN.minLon);

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

/** Die Gesamtfläche einer Phase — grobes Maß für die Größe des Reiches. */
function groesseDerPhase(phase) {
  return phase.flaechen.reduce((summe, f) => summe + flaecheninhalt(eckpunkte(f.d)), 0);
}

/**
 * @param {(name: string, ok: boolean) => void} pruefe Prüf-Funktion des Rahmens
 */
export function laufe(pruefe) {
  const china = themaNachId('china');
  pruefe('„China" ist als Thema registriert', Boolean(china));
  const karte = china.karte;
  pruefe('„China" bringt eine Karte mit', Boolean(karte));

  // --- 1. Aufbau ---------------------------------------------------------
  pruefe('China-Karte: erfüllt das Karten-Schema', pruefeKarte(karte).length === 0);
  pruefe('China-Karte: hat mindestens 3 Phasen', karte.phasen.length >= 3);
  pruefe('China-Karte: hat 4 bis 6 Info-Punkte',
    karte.punkte.length >= 4 && karte.punkte.length <= 6);
  pruefe('China-Karte: hat 2 bis 3 Bewegungen',
    karte.bewegungen.length >= 2 && karte.bewegungen.length <= 3);
  pruefe('China-Karte: jeder Punkt-typ ist ein bekannter',
    karte.punkte.every((p) => KARTEN_PUNKT_TYPEN.includes(p.typ)));
  // Jeder Info-Punkt trägt Hintergrundwissen — die Karte ist die Bühne, die
  // Texte stehen dahinter. Ein Satz allein reicht dafür nicht.
  pruefe('China-Karte: jeder Info-Punkt hat einen ausgeführten Text',
    karte.punkte.every((p) => p.text.trim().length > 200));
  pruefe('China-Karte: jede Bewegung hat einen ausgeführten Text',
    karte.bewegungen.every((b) => b.text.trim().length > 200));

  // Die Phasen aus dem Auftrag des Betreibers.
  const labels = karte.phasen.map((p) => p.label);
  for (const jahr of ['221 v. Chr.', '100 n. Chr.', '750 n. Chr.']) {
    pruefe(`China-Karte: die Phase „${jahr}" ist da`, labels.includes(jahr));
  }
  pruefe('China-Karte: jede Phase erklärt sich in einem Hinweis',
    karte.phasen.every((p) => typeof p.hinweis === 'string' && p.hinweis.length > 40));

  // Alles muss im Bild liegen — ein Punkt außerhalb wäre unantippbar.
  const imBild = ([x, y]) => x >= 0 && x <= karte.breite && y >= 0 && y <= karte.hoehe;
  pruefe('China-Karte: alle Info-Punkte liegen im Bild',
    karte.punkte.every((p) => imBild([p.x, p.y])));
  pruefe('China-Karte: alle Bewegungen liegen im Bild',
    karte.bewegungen.every((b) => [b.von, b.nach, ...(b.ueber || [])].every(imBild)));

  // --- 2. Die Erzählung steckt in der Geometrie --------------------------
  // Qin einigt, Han greift ins Tarimbecken aus, Tang geht noch weiter. Wenn
  // die Flächen das nicht hergeben, zeigt die Karte etwas anderes als der Text.
  const nachLabel = (label) => karte.phasen.find((p) => p.label === label);
  const qin = groesseDerPhase(nachLabel('221 v. Chr.'));
  const han = groesseDerPhase(nachLabel('100 n. Chr.'));
  const tang = groesseDerPhase(nachLabel('750 n. Chr.'));
  pruefe('China-Karte: die Han sind größer als das Qin-Reich', han > qin);
  pruefe('China-Karte: die Tang sind größer als die Han', tang > han);
  pruefe('China-Karte: 221 v. Chr. zeigt ein einziges, geeintes Gebiet',
    nachLabel('221 v. Chr.').flaechen.length === 1);
  pruefe('China-Karte: die Han halten die Westgebiete als eigenes Gebiet',
    nachLabel('100 n. Chr.').flaechen.length >= 2);

  // --- 3. Atlas-Gegenprobe -----------------------------------------------
  // Die Vorgabe des Betreibers lautet: Die Regionen müssen erkennbar sein,
  // keine abstrakte Skizze. Die Küstenlinien stehen im Kartenmodul als echte
  // Längen-/Breitengrade — wenn bekannte Kaps und Buchten auf der
  // gezeichneten Küste liegen, ist die Karte ein Atlas und keine Fantasie.
  const geo = erstelleProjektion(CHINA_RAHMEN);
  pruefe('China-Karte: die Höhe passt zum angenommenen Ausschnitt', geo.hoehe === karte.hoehe);
  pruefe('China-Karte: die Breite passt zum angenommenen Ausschnitt', geo.breite === karte.breite);

  // Nur Küsten und Seeufer — Flüsse, Wüsten, Mauer und Handelsweg würden die
  // Probe verwässern, weil sie mitten im Land liegen.
  const kuestenpunkte = karte.basis
    .filter((teil) => teil.art === 'land' || teil.art === 'wasser')
    .flatMap((teil) => eckpunkte(teil.d));
  pruefe('China-Karte: es gibt Küstenlinien zu prüfen', kuestenpunkte.length > 100);

  /** Abstand einer geografischen Landmarke zur nächsten gezeichneten Küste. */
  const abstandZurKueste = (lon, lat) => {
    const [x, y] = geo.punkt(lon, lat);
    return kuestenpunkte.reduce(
      (naechster, [kx, ky]) => Math.min(naechster, Math.hypot(kx - x, ky - y)),
      Infinity,
    );
  };

  // Ein Grad Toleranz — genug für eine vereinfachte Schulatlas-Küste, zu wenig
  // für eine Karte, die die Geografie nur behauptet. Die Werte hier sind
  // absichtlich KEINE Eckpunkte aus dem Kartenmodul, sondern unabhängig im
  // Atlas nachgeschlagen: So prüft der Test die gezeichnete Linie und nicht
  // die abgeschriebene Zahl.
  const TOLERANZ = EINHEITEN_JE_GRAD;
  const landmarken = [
    ['Shanghai an der Jangtse-Mündung', 121.5, 31.2],
    ['Penglai an der Bohai-Straße', 120.7, 37.8],
    ['die Ostspitze der Halbinsel Shandong', 122.6, 37.3],
    ['Mokpo an der Südwestecke Koreas', 126.4, 34.8],
    ['Hongkong an der Perlflussmündung', 114.2, 22.3],
    ['Nagasaki auf Kyushu', 129.9, 32.7],
    ['die Halbinsel Noto auf Honschu', 137.0, 37.3],
    ['Kap Soja, die Nordspitze Hokkaidos', 141.9, 45.4],
  ];
  for (const [name, lon, lat] of landmarken) {
    pruefe(`China-Karte: ${name} liegt auf der gezeichneten Küste`,
      abstandZurKueste(lon, lat) < TOLERANZ);
  }

  // Gegenprobe zur Gegenprobe: Mitten im Meer darf keine Küste sein, sonst
  // wäre der Test durch schiere Punktdichte immer erfüllt.
  const offeneSee = [
    ['im Japanischen Meer', 135.0, 40.0],
    ['mitten im Gelben Meer', 123.5, 34.5],
    ['im Südchinesischen Meer', 115.0, 17.0],
  ];
  for (const [wo, lon, lat] of offeneSee) {
    pruefe(`China-Karte: ${wo} liegt keine Küste`,
      abstandZurKueste(lon, lat) > TOLERANZ * 2);
  }

  // --- 4. Die Verbindung nach Westen -------------------------------------
  // Ohne sie wäre das hier eine Landkarte Ostasiens. Mit ihr ist es die
  // Brücke zum Kapitel „Römisches Reich".
  const punkte = Object.fromEntries(karte.punkte.map((p) => [p.id, p]));
  pruefe('China-Karte: Chang’an ist ein Info-Punkt', Boolean(punkte.changan));
  pruefe('China-Karte: Dunhuang ist ein Info-Punkt', Boolean(punkte.dunhuang));
  pruefe('China-Karte: Kaschgar ist ein Info-Punkt', Boolean(punkte.kaschgar));
  pruefe('China-Karte: Samarkand ist ein Info-Punkt', Boolean(punkte.samarkand));
  pruefe('China-Karte: die Große Mauer ist ein Info-Punkt', Boolean(punkte['grosse-mauer']));
  pruefe('China-Karte: der Weg nach Rom hört am Bildrand nicht auf',
    Boolean(punkte['weiter-nach-rom']) && punkte['weiter-nach-rom'].text.includes('Rom'));

  // Die Route liegt in der richtigen Reihenfolge auf der Karte: Chang'an im
  // Osten, dann Dunhuang, Kaschgar, Samarkand — und ganz links geht es weiter.
  const westlicher = (a, b) => punkte[a].x < punkte[b].x;
  pruefe('China-Karte: Dunhuang liegt westlich von Chang’an', westlicher('dunhuang', 'changan'));
  pruefe('China-Karte: Kaschgar liegt westlich von Dunhuang', westlicher('kaschgar', 'dunhuang'));
  pruefe('China-Karte: Samarkand liegt westlich von Kaschgar', westlicher('samarkand', 'kaschgar'));
  pruefe('China-Karte: der Weg nach Rom führt westlich von Samarkand',
    westlicher('weiter-nach-rom', 'samarkand'));
  pruefe('China-Karte: die Große Mauer liegt nördlich von Chang’an',
    punkte['grosse-mauer'].y < punkte.changan.y);

  // Geografie-Gegenprobe an den Bewegungen.
  const bewegung = Object.fromEntries(karte.bewegungen.map((b) => [b.id, b]));
  pruefe('China-Karte: Zhang Qian zieht nach Westen',
    Boolean(bewegung['zhang-qian']) && bewegung['zhang-qian'].nach[0] < bewegung['zhang-qian'].von[0]);
  pruefe('China-Karte: die Karawanen ziehen nach Westen',
    Boolean(bewegung.karawanen) && bewegung.karawanen.nach[0] < bewegung.karawanen.von[0]);
  pruefe('China-Karte: die Karawanen führen über Samarkand hinaus',
    bewegung.karawanen.nach[0] < punkte.samarkand.x);
  pruefe('China-Karte: die Xiongnu kommen von Norden',
    Boolean(bewegung.xiongnu) && bewegung.xiongnu.von[1] < bewegung.xiongnu.nach[1]);

  // --- 5. Beschriftungen -------------------------------------------------
  const beschriftungen = karte.beschriftungen || [];
  const texte = beschriftungen.map((b) => b.text);
  for (const name of ['China', 'Korea', 'Japan', 'Tibet', 'Indien', 'Wüste Gobi', 'Seidenstraße', 'Persien']) {
    pruefe(`China-Karte: „${name}" ist beschriftet`, texte.includes(name));
  }
  pruefe('China-Karte: es gibt Beschriftungen für Land und Meer', (() => {
    const arten = new Set(beschriftungen.map((b) => b.art));
    return arten.has('land') && arten.has('meer');
  })());

  // --- 6. Zusammenspiel mit dem Lernformat -------------------------------
  pruefe('Lernformat: „China" zeigt den Karten-Abschnitt',
    abschnitteFuer(china).some((a) => a.id === 'karte'));
  pruefe('Lernformat: der Karten-Abschnitt steht direkt hinter dem Aufhänger',
    abschnitteFuer(china).findIndex((a) => a.id === 'karte') === 1);

  // --- 7. Das Modul selbst -----------------------------------------------
  // Runde 4 legte die europäische Sicht an (Opus); Hermes hat die chinesische
  // Sicht ergänzt. Der generische Schema-Test in tests/themen.mjs nimmt alle
  // Perspektiven automatisch mit — hier steht nur, was für dieses Thema
  // besonders gilt.
  pruefe('„China": die europäische Sichtweise stammt von Opus', (() => {
    const europa = china.perspektiven.find((p) => p.id === 'europaeisch');
    return Boolean(europa) && europa.stimme === 'Opus';
  })());
  pruefe('„China": die chinesische Sichtweise stammt von Hermes', (() => {
    const chinesisch = china.perspektiven.find((p) => p.id === 'chinesisch');
    return Boolean(chinesisch) && chinesisch.stimme === 'Hermes';
  })());
  pruefe('„China": die Perspektive gibt sich als Sichtweise zu erkennen',
    china.perspektiven[0].text.includes('So wird Chinas Geschichte in Europa erzählt'));
  pruefe('„China": die Perspektive öffnet die Tür zur zweiten Stimme',
    china.perspektiven[0].text.includes('zweite Stimme'));
  pruefe('„China": die Synthese führt beide Sichtweisen zusammen',
    china.synthese.includes('europäische') && china.synthese.includes('chinesische'));
  pruefe('„China" hat 3 bis 5 Quizfragen', china.quiz.length >= 3 && china.quiz.length <= 5);
  pruefe('„China": jede Quizfrage hat eine gültige richtige Antwort',
    china.quiz.every((f) => typeof f.antworten[f.richtig] === 'string'));
  pruefe('„China": das Urteil ist offen gestellt', china.urteil.frage.includes('?'));
}
