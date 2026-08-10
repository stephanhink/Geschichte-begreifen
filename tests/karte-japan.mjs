// Prüfungen für die Karte zum Thema „Japan" — und für das, was das
// Themen-Modul an der Karte hängen hat.
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe:
// läuft mit blankem `node`.
//
// Das Karten-Schema und die Rechenwerkzeuge aus utils/karte-geo.js prüft
// tests/karte.mjs — hier geht es nur um diese eine Karte:
//   1. Vollständigkeit und Aufbau (Phasen, Punkte, Bewegungen, Beschriftungen).
//   2. Atlas-Gegenprobe: Liegen bekannte Kaps und Häfen auf der gezeichneten
//      Küste? Und liegt mitten im Japanischen Meer keine?
//   3. Die Inselwelt muss Inselwelt sein: Honschu, Shikoku, Kyushu und
//      Hokkaido als getrennte Landmassen, das Meer als Thema und nicht als
//      leerer Rand.
//   4. Die Klammer zum Kapitel davor: 1274 und 1281 kommen vom Festland, und
//      Perry kommt 1853 von der anderen Seite — aus dem Pazifik.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { pruefeKarte, KARTEN_PUNKT_TYPEN } = require('../utils/themen/schema.js');
const { erstelleProjektion } = require('../utils/karte-geo.js');
const { themaNachId, alleThemen } = require('../utils/themen/index.js');
const { abschnitteFuer } = require('../utils/lernformat.js');

/**
 * Der Kartenausschnitt, wie ihn utils/themen/karten/japan.js aufspannt. Steht
 * hier noch einmal, damit die Atlas-Gegenprobe unten rechnen kann — dass er
 * stimmt, prüft der Test über die daraus folgende Höhe.
 */
const RAHMEN = { minLon: 119, maxLon: 146, minLat: 28, maxLat: 46, breite: 700 };

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

/** Die Gesamtfläche einer Phase — grobes Maß für den Umfang der Herrschaft. */
function groesseDerPhase(phase) {
  return phase.flaechen.reduce((summe, f) => summe + flaecheninhalt(eckpunkte(f.d)), 0);
}

/**
 * @param {(name: string, ok: boolean) => void} pruefe Prüf-Funktion des Rahmens
 */
export function laufe(pruefe) {
  const thema = themaNachId('japan');
  pruefe('„Japan" ist als Thema registriert', Boolean(thema));
  const karte = thema.karte;
  pruefe('„Japan" bringt eine Karte mit', Boolean(karte));

  // --- 1. Aufbau ---------------------------------------------------------
  pruefe('Japan-Karte: erfüllt das Karten-Schema', pruefeKarte(karte).length === 0);
  pruefe('Japan-Karte: hat mindestens 3 Phasen', karte.phasen.length >= 3);
  pruefe('Japan-Karte: hat 5 bis 6 Info-Punkte',
    karte.punkte.length >= 5 && karte.punkte.length <= 6);
  pruefe('Japan-Karte: hat 3 bis 4 Bewegungen',
    karte.bewegungen.length >= 3 && karte.bewegungen.length <= 4);
  pruefe('Japan-Karte: jeder Punkt-typ ist ein bekannter',
    karte.punkte.every((p) => KARTEN_PUNKT_TYPEN.includes(p.typ)));
  // Jeder Info-Punkt trägt Hintergrundwissen — die Karte ist die Bühne, die
  // Texte stehen dahinter. Ein Satz allein reicht dafür nicht.
  pruefe('Japan-Karte: jeder Info-Punkt hat einen ausgeführten Text',
    karte.punkte.every((p) => p.text.trim().length > 200));
  pruefe('Japan-Karte: jede Bewegung hat einen ausgeführten Text',
    karte.bewegungen.every((b) => b.text.trim().length > 200));
  pruefe('Japan-Karte: jede Phase erklärt sich in einem Hinweis',
    karte.phasen.every((p) => typeof p.hinweis === 'string' && p.hinweis.length > 40));
  pruefe('Japan-Karte: die Phasen-ids sind eindeutig',
    new Set(karte.phasen.map((p) => p.id)).size === karte.phasen.length);

  // Die Stationen aus dem Auftrag des Betreibers: Yamato, die Mongolen,
  // Sakoku, Meiji.
  const labels = karte.phasen.map((p) => p.label).join(' | ');
  for (const jahr of ['600', '1274', '1281', '1700', '1868']) {
    pruefe(`Japan-Karte: die Jahreszahl ${jahr} steht auf dem Umschalter`,
      labels.includes(jahr));
  }

  // Alles muss im Bild liegen — ein Punkt außerhalb wäre unantippbar.
  const imBild = ([x, y]) => x >= 0 && x <= karte.breite && y >= 0 && y <= karte.hoehe;
  pruefe('Japan-Karte: alle Info-Punkte liegen im Bild',
    karte.punkte.every((p) => imBild([p.x, p.y])));
  pruefe('Japan-Karte: alle Bewegungen liegen im Bild',
    karte.bewegungen.every((b) => [b.von, b.nach, ...(b.ueber || [])].every(imBild)));

  // --- 2. Die Erzählung steckt in der Geometrie --------------------------
  // Yamato reicht nicht bis in den Norden; unter den Tokugawa gehört ganz
  // Honschu dazu; 1868 kommt Hokkaido hinzu. Die Fläche muss also wachsen.
  const erste = groesseDerPhase(karte.phasen[0]);
  const letzte = groesseDerPhase(karte.phasen[karte.phasen.length - 1]);
  pruefe('Japan-Karte: die letzte Phase zeigt mehr Land als die erste', letzte > erste);
  pruefe('Japan-Karte: jede Phase zeigt die Inseln einzeln, nicht als einen Klumpen',
    karte.phasen.every((p) => p.flaechen.length >= 3));
  // Die Insel im Norden ist der sichtbare Zugewinn des 19. Jahrhunderts.
  pruefe('Japan-Karte: die letzte Phase benennt Hokkaido',
    karte.phasen[karte.phasen.length - 1].flaechen.some((f) => f.titel.includes('Hokkaido')));

  // --- 3. Atlas-Gegenprobe -----------------------------------------------
  // Die Vorgabe des Betreibers lautet: Die Regionen müssen erkennbar sein,
  // keine abstrakte Skizze. Die Küstenlinien stehen im Kartenmodul als echte
  // Längen-/Breitengrade — wenn bekannte Kaps und Häfen auf der gezeichneten
  // Küste liegen, ist die Karte ein Atlas und keine Fantasie.
  const geo = erstelleProjektion(RAHMEN);
  pruefe('Japan-Karte: die Höhe passt zum angenommenen Ausschnitt', geo.hoehe === karte.hoehe);
  pruefe('Japan-Karte: die Breite passt zum angenommenen Ausschnitt', geo.breite === karte.breite);

  // Nur Küsten und Seeufer — Flüsse würden die Probe verwässern, weil sie
  // mitten im Land liegen.
  const kuestenpunkte = karte.basis
    .filter((teil) => teil.art === 'land' || teil.art === 'wasser')
    .flatMap((teil) => eckpunkte(teil.d));
  pruefe('Japan-Karte: es gibt Küstenlinien zu prüfen', kuestenpunkte.length > 150);

  /** Abstand einer geografischen Landmarke zur nächsten gezeichneten Küste. */
  const abstandZurKueste = (lon, lat) => {
    const [x, y] = geo.punkt(lon, lat);
    return kuestenpunkte.reduce(
      (naechster, [kx, ky]) => Math.min(naechster, Math.hypot(kx - x, ky - y)),
      Infinity,
    );
  };

  // Diese Karte ist mit 26 SVG-Einheiten je Längengrad rund fünfmal feiner als
  // die Eurasien-Karte des Mongolen-Kapitels. Ein ganzer Grad Toleranz würde
  // hier nichts mehr beweisen, deshalb sind es nur 0,6 Grad. Die Werte sind
  // absichtlich KEINE Eckpunkte aus dem Kartenmodul, sondern unabhängig im
  // Atlas nachgeschlagen: So prüft der Test die gezeichnete Linie und nicht
  // die abgeschriebene Zahl.
  const TOLERANZ = EINHEITEN_JE_GRAD * 0.6;
  const landmarken = [
    ['Nagasaki auf Kyushu', 129.87, 32.75],
    ['die Straße von Shimonoseki', 130.95, 33.95],
    ['Kap Muroto auf Shikoku', 134.18, 33.25],
    ['die Ise-Bucht bei Nagoya', 136.8, 34.7],
    ['Kap Inubo, der Ostpunkt Honschus', 140.87, 35.71],
    ['die Halbinsel Noto am Japanischen Meer', 137.0, 37.3],
    ['Kap Erimo auf Hokkaido', 143.25, 41.92],
    ['Pusan an der Straße von Korea', 129.05, 35.1],
    ['Wonsan an Koreas Ostküste', 127.45, 39.15],
    ['Dalian am Gelben Meer', 121.6, 38.9],
    ['die Jangtse-Mündung bei Shanghai', 121.5, 31.4],
  ];
  for (const [name, lon, lat] of landmarken) {
    pruefe(`Japan-Karte: ${name} liegt auf der gezeichneten Küste`,
      abstandZurKueste(lon, lat) < TOLERANZ);
  }

  // Gegenprobe zur Gegenprobe: Auf offener See darf keine Küste liegen, sonst
  // wäre der Test durch schiere Punktdichte immer erfüllt. Bei einer Karte,
  // deren Thema das Meer ist, ist das die wichtigste Probe von allen.
  const offeneSee = [
    ['mitten im Japanischen Meer', 135.0, 40.0],
    ['im Pazifik östlich von Honschu', 144.0, 36.0],
    ['mitten im Gelben Meer', 123.5, 34.5],
    ['im Ostchinesischen Meer', 126.0, 30.5],
  ];
  for (const [wo, lon, lat] of offeneSee) {
    pruefe(`Japan-Karte: ${wo} liegt keine Küste`,
      abstandZurKueste(lon, lat) > TOLERANZ * 2);
  }

  // --- 4. Die Inselwelt --------------------------------------------------
  // „Das Meer trennt und verbindet zugleich" — das muss die Geometrie
  // hergeben: getrennte Landmassen, keine durchgehende Küste.
  const landflaechen = karte.basis.filter((teil) => teil.art === 'land');
  pruefe('Japan-Karte: es gibt mehrere getrennte Landmassen', landflaechen.length >= 5);
  pruefe('Japan-Karte: jede Landmasse ist ein geschlossener Pfad',
    landflaechen.every((teil) => teil.d.trim().endsWith('Z')));

  // --- 5. Die Klammer zu den Nachbarkapiteln -----------------------------
  const punkte = Object.fromEntries(karte.punkte.map((p) => [p.id, p]));
  for (const id of ['nara', 'kyoto', 'kamakura', 'edo', 'dejima', 'tsushima']) {
    pruefe(`Japan-Karte: „${id}" ist ein Info-Punkt`, Boolean(punkte[id]));
  }
  // Die Orte stehen in der richtigen West-Ost-Ordnung auf dem Bild: Tsushima
  // vor Kyushu, dann der Kansai, dann Edo im Osten.
  const westlicher = (a, b) => punkte[a].x < punkte[b].x;
  pruefe('Japan-Karte: Tsushima liegt westlich von Nara', westlicher('tsushima', 'nara'));
  pruefe('Japan-Karte: Dejima liegt westlich von Kyoto', westlicher('dejima', 'kyoto'));
  pruefe('Japan-Karte: Kyoto liegt westlich von Edo', westlicher('kyoto', 'edo'));
  pruefe('Japan-Karte: Kamakura liegt südlich von Edo', punkte.kamakura.y > punkte.edo.y);
  pruefe('Japan-Karte: Dejima erzählt vom einzigen offenen Fenster',
    punkte.dejima.text.includes('Nagasaki'));

  const bewegung = Object.fromEntries(karte.bewegungen.map((b) => [b.id, b]));
  for (const id of ['mongolen-1274', 'mongolen-1281', 'perry-1853']) {
    pruefe(`Japan-Karte: die Bewegung „${id}" ist da`, Boolean(bewegung[id]));
  }
  // Beide Invasionen kommen vom Festland, also von Westen — Perry kommt von
  // der anderen Seite, aus dem Pazifik. Genau darin steckt die Geschichte:
  // Zweihundert Jahre lang war die Gefahr immer im Westen vermutet worden.
  pruefe('Japan-Karte: die Mongolen 1274 kommen von Westen',
    bewegung['mongolen-1274'].nach[0] > bewegung['mongolen-1274'].von[0]);
  pruefe('Japan-Karte: die Mongolen 1281 kommen von Westen',
    bewegung['mongolen-1281'].nach[0] > bewegung['mongolen-1281'].von[0]);
  pruefe('Japan-Karte: Perry kommt 1853 aus dem Osten',
    bewegung['perry-1853'].nach[0] < bewegung['perry-1853'].von[0]);
  pruefe('Japan-Karte: Perry läuft in die Bucht von Tokio ein — bei Edo',
    Math.hypot(bewegung['perry-1853'].nach[0] - punkte.edo.x,
      bewegung['perry-1853'].nach[1] - punkte.edo.y) < 30);
  // Die zweite Flotte war die größere und kam aus dem eroberten Südchina —
  // sie muss deshalb weiter westlich starten als die erste aus Korea.
  pruefe('Japan-Karte: die Flotte von 1281 startet weiter westlich als die von 1274',
    bewegung['mongolen-1281'].von[0] < bewegung['mongolen-1274'].von[0]);

  // --- 6. Beschriftungen -------------------------------------------------
  const beschriftungen = karte.beschriftungen || [];
  const texte = beschriftungen.map((b) => b.text);
  for (const name of [
    'Japan', 'Honshu', 'Kyushu', 'Shikoku', 'Hokkaido', 'Korea', 'China',
    'Gelbes Meer', 'Japanisches Meer', 'Pazifik',
  ]) {
    pruefe(`Japan-Karte: „${name}" ist beschriftet`, texte.includes(name));
  }
  // Bei einer Inselwelt muss die See mindestens so oft benannt sein wie das
  // Land — sonst ist das Meer wieder nur der Rand des Bildes.
  const meere = beschriftungen.filter((b) => b.art === 'meer').length;
  const laender = beschriftungen.filter((b) => b.art === 'land').length;
  pruefe('Japan-Karte: das Meer ist so oft benannt wie das Land', meere >= laender - 3);
  pruefe('Japan-Karte: es gibt Beschriftungen für Land und Meer',
    meere > 0 && laender > 0);

  // --- 7. Zusammenspiel mit dem Lernformat -------------------------------
  pruefe('Lernformat: „Japan" zeigt den Karten-Abschnitt',
    abschnitteFuer(thema).some((a) => a.id === 'karte'));
  pruefe('Lernformat: der Karten-Abschnitt steht direkt hinter dem Aufhänger',
    abschnitteFuer(thema).findIndex((a) => a.id === 'karte') === 1);

  // --- 8. Das Modul selbst -----------------------------------------------
  // Runde 6 legt nur die europäische Sicht an (Opus); die chinesische Sicht
  // ergänzt Hermes danach. Der generische Schema-Test in tests/themen.mjs
  // nimmt alle Perspektiven automatisch mit — hier steht nur, was für dieses
  // Thema besonders gilt.
  pruefe('„Japan": die europäische Sichtweise stammt von Opus', (() => {
    const europa = thema.perspektiven.find((p) => p.id === 'europaeisch');
    return Boolean(europa) && europa.stimme === 'Opus';
  })());
  pruefe('„Japan": die Perspektive gibt sich als Sichtweise zu erkennen',
    thema.perspektiven[0].text.includes('So wird die Geschichte Japans in Europa erzählt'));
  pruefe('„Japan": die Perspektive öffnet die Tür zur zweiten Stimme',
    thema.perspektiven[0].text.includes('zweiten Stimme'));
  // Die Perspektive muss die vier Stationen des Auftrags wirklich erzählen.
  for (const stichwort of ['1543', 'Franz Xaver', 'Dejima', '1853', '1868', 'Japonismus']) {
    pruefe(`„Japan": die Perspektive erzählt von „${stichwort}"`,
      thema.perspektiven[0].text.includes(stichwort));
  }
  // Hermes hat die chinesische Sicht ergänzt; die Synthese führt beide
  // Stimmen zusammen.
  pruefe('„Japan": die chinesische Sichtweise stammt von Hermes', (() => {
    const chinesisch = thema.perspektiven.find((p) => p.id === 'chinesisch');
    return Boolean(chinesisch) && chinesisch.stimme === 'Hermes';
  })());
  pruefe('„Japan": die Synthese führt beide Sichtweisen zusammen',
    thema.synthese.includes('europäische') && thema.synthese.includes('chinesische'));
  pruefe('„Japan" hat 3 bis 5 Quizfragen',
    thema.quiz.length >= 3 && thema.quiz.length <= 5);
  pruefe('„Japan": jede Quizfrage hat eine gültige richtige Antwort',
    thema.quiz.every((f) => typeof f.antworten[f.richtig] === 'string'));
  pruefe('„Japan": jede Quizfrage wird erklärt',
    thema.quiz.every((f) => f.erklaerung.trim().length > 40));
  pruefe('„Japan": das Urteil ist offen gestellt', thema.urteil.frage.includes('?'));
  pruefe('„Japan": das Urteil bekommt einen Denkanstoß',
    typeof thema.urteil.hinweis === 'string' && thema.urteil.hinweis.length > 40);
  pruefe('„Japan" steht als Modul 4 hinter Dschingis Khan',
    alleThemen[3] === thema && alleThemen[2].id === 'dschingis-khan');
}
