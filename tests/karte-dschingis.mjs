// Prüfungen für die Karte zum Thema „Dschingis Khan und die Mongolen" — und
// für das, was das Themen-Modul an der Karte hängen hat.
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe:
// läuft mit blankem `node`.
//
// Das Karten-Schema und die Rechenwerkzeuge aus utils/karte-geo.js prüft
// tests/karte.mjs — hier geht es nur um diese eine Karte:
//   1. Vollständigkeit und Aufbau (Phasen, Punkte, Bewegungen, Beschriftungen).
//   2. Atlas-Gegenprobe: Liegen bekannte Küstenpunkte auf der gezeichneten
//      Küste? Und liegt mitten in der Steppe keine?
//   3. Die Erzählung muss in der Geometrie stecken: 1206 < 1227 < 1259.
//   4. Die beiden Enden des Bildes — Liegnitz und Dadu. Ohne sie wäre diese
//      Karte nur eine Landkarte Asiens und nicht die Aussage des Kapitels.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { pruefeKarte, KARTEN_PUNKT_TYPEN } = require('../utils/themen/schema.js');
const { erstelleProjektion, KARTENFARBEN } = require('../utils/karte-geo.js');
const { themaNachId } = require('../utils/themen/index.js');
const { abschnitteFuer } = require('../utils/lernformat.js');

/**
 * Der Kartenausschnitt, wie ihn utils/themen/karten/dschingis-khan.js
 * aufspannt. Steht hier noch einmal, damit die Atlas-Gegenprobe unten rechnen
 * kann — dass er stimmt, prüft der Test über die daraus folgende Höhe.
 */
const RAHMEN = { minLon: 8, maxLon: 143, minLat: 20, maxLat: 58, breite: 700 };

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

/** Die Gesamtfläche einer Phase — grobes Maß für die Größe des Reiches. */
function groesseDerPhase(phase) {
  return phase.flaechen.reduce((summe, f) => summe + flaecheninhalt(eckpunkte(f.d)), 0);
}

/**
 * @param {(name: string, ok: boolean) => void} pruefe Prüf-Funktion des Rahmens
 */
export function laufe(pruefe) {
  const thema = themaNachId('dschingis-khan');
  pruefe('„Dschingis Khan" ist als Thema registriert', Boolean(thema));
  const karte = thema.karte;
  pruefe('„Dschingis Khan" bringt eine Karte mit', Boolean(karte));

  // --- 1. Aufbau ---------------------------------------------------------
  pruefe('Mongolen-Karte: erfüllt das Karten-Schema', pruefeKarte(karte).length === 0);
  pruefe('Mongolen-Karte: hat mindestens 4 Phasen', karte.phasen.length >= 4);
  pruefe('Mongolen-Karte: hat 5 bis 6 Info-Punkte',
    karte.punkte.length >= 5 && karte.punkte.length <= 6);
  pruefe('Mongolen-Karte: hat 3 bis 4 Bewegungen',
    karte.bewegungen.length >= 3 && karte.bewegungen.length <= 4);
  pruefe('Mongolen-Karte: jeder Punkt-typ ist ein bekannter',
    karte.punkte.every((p) => KARTEN_PUNKT_TYPEN.includes(p.typ)));
  // Jeder Info-Punkt trägt Hintergrundwissen — die Karte ist die Bühne, die
  // Texte stehen dahinter. Ein Satz allein reicht dafür nicht.
  pruefe('Mongolen-Karte: jeder Info-Punkt hat einen ausgeführten Text',
    karte.punkte.every((p) => p.text.trim().length > 200));
  pruefe('Mongolen-Karte: jede Bewegung hat einen ausgeführten Text',
    karte.bewegungen.every((b) => b.text.trim().length > 200));
  // Vier Feldzüge nebeneinander brauchen vier Farben, sonst zeigt die Legende
  // zweimal auf denselben Ton.
  pruefe('Mongolen-Karte: es gibt für jede Bewegung eine eigene Farbe',
    KARTENFARBEN.bewegung.length >= karte.bewegungen.length);

  // Die Phasen aus dem Auftrag des Betreibers.
  const labels = karte.phasen.map((p) => p.label);
  for (const jahr of ['1206', '1227', '1259', '1294']) {
    pruefe(`Mongolen-Karte: die Phase „${jahr}" ist da`, labels.includes(jahr));
  }
  pruefe('Mongolen-Karte: die Phasen stehen in zeitlicher Reihenfolge',
    labels.map(Number).every((jahr, i, alle) => i === 0 || alle[i - 1] < jahr));
  pruefe('Mongolen-Karte: jede Phase erklärt sich in einem Hinweis',
    karte.phasen.every((p) => typeof p.hinweis === 'string' && p.hinweis.length > 40));

  // Alles muss im Bild liegen — ein Punkt außerhalb wäre unantippbar.
  const imBild = ([x, y]) => x >= 0 && x <= karte.breite && y >= 0 && y <= karte.hoehe;
  pruefe('Mongolen-Karte: alle Info-Punkte liegen im Bild',
    karte.punkte.every((p) => imBild([p.x, p.y])));
  pruefe('Mongolen-Karte: alle Bewegungen liegen im Bild',
    karte.bewegungen.every((b) => [b.von, b.nach, ...(b.ueber || [])].every(imBild)));

  // --- 2. Die Erzählung steckt in der Geometrie --------------------------
  // 1206 ein Fleck in der Steppe, 1227 vom Kaspischen Meer bis ans Gelbe Meer,
  // 1259 der größte Umfang. Wenn die Flächen das nicht hergeben, zeigt die
  // Karte etwas anderes als der Text.
  const nachLabel = (label) => karte.phasen.find((p) => p.label === label);
  const kurultai = groesseDerPhase(nachLabel('1206'));
  const tod = groesseDerPhase(nachLabel('1227'));
  const hoehepunkt = groesseDerPhase(nachLabel('1259'));
  pruefe('Mongolen-Karte: 1227 ist größer als 1206', tod > kurultai);
  pruefe('Mongolen-Karte: 1259 ist größer als 1227', hoehepunkt > tod);
  // Das Reich wächst nicht ein bisschen, sondern um Größenordnungen — das
  // ist der Punkt des Kapitels und muss auf der Karte zu sehen sein.
  pruefe('Mongolen-Karte: 1259 ist ein Vielfaches von 1206', hoehepunkt > kurultai * 8);
  pruefe('Mongolen-Karte: 1206 zeigt ein einziges Gebiet',
    nachLabel('1206').flaechen.length === 1);
  pruefe('Mongolen-Karte: 1259 zeigt die Teilreiche nebeneinander',
    nachLabel('1259').flaechen.length >= 3);
  pruefe('Mongolen-Karte: 1294 zeigt die Teilung in eigene Khanate',
    nachLabel('1294').flaechen.length >= 4);
  // Die Namen der Teilreiche sind der halbe Inhalt der Phase 1259.
  const titel1259 = nachLabel('1259').flaechen.map((f) => f.titel).join(' | ');
  for (const name of ['Großkhanat', 'Goldene Horde', 'Ilchanat']) {
    pruefe(`Mongolen-Karte: 1259 benennt „${name}"`, titel1259.includes(name));
  }
  pruefe('Mongolen-Karte: 1294 benennt die Yuan',
    nachLabel('1294').flaechen.some((f) => f.titel.includes('Yuan')));

  // --- 3. Atlas-Gegenprobe -----------------------------------------------
  // Die Vorgabe des Betreibers lautet: Die Regionen müssen erkennbar sein,
  // keine abstrakte Skizze. Die Küstenlinien stehen im Kartenmodul als echte
  // Längen-/Breitengrade — wenn bekannte Kaps und Buchten auf der
  // gezeichneten Küste liegen, ist die Karte ein Atlas und keine Fantasie.
  const geo = erstelleProjektion(RAHMEN);
  pruefe('Mongolen-Karte: die Höhe passt zum angenommenen Ausschnitt', geo.hoehe === karte.hoehe);
  pruefe('Mongolen-Karte: die Breite passt zum angenommenen Ausschnitt', geo.breite === karte.breite);

  // Nur Küsten und Seeufer — Flüsse, Wüsten, Mauer und Handelsweg würden die
  // Probe verwässern, weil sie mitten im Land liegen.
  const kuestenpunkte = karte.basis
    .filter((teil) => teil.art === 'land' || teil.art === 'wasser')
    .flatMap((teil) => eckpunkte(teil.d));
  pruefe('Mongolen-Karte: es gibt Küstenlinien zu prüfen', kuestenpunkte.length > 200);

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
  // die abgeschriebene Zahl. Sie sind über die ganze Breite des Bildes
  // verteilt — vom Mittelmeer bis nach Japan.
  const TOLERANZ = EINHEITEN_JE_GRAD;
  const landmarken = [
    ['Ancona an der Adria', 13.6, 43.7],
    ['Kap Malea an der Südspitze Griechenlands', 23.2, 36.4],
    ['Sewastopol auf der Krim', 33.6, 44.5],
    ['Batumi am Fuß des Kaukasus', 41.7, 41.7],
    ['Beirut an der Levanteküste', 35.4, 33.8],
    ['Baku am Kaspischen Meer', 49.8, 40.3],
    ['die Bucht von Kuwait', 48.1, 29.4],
    ['Karatschi an der Indusmündung', 67.1, 24.8],
    ['Danzig an der Weichselmündung', 18.6, 54.4],
    ['Qingdao an der Halbinsel Shandong', 120.5, 36.2],
    ['Mokpo an der Südwestecke Koreas', 126.4, 34.9],
    ['die Halbinsel Noto auf Honschu', 137.0, 37.3],
  ];
  for (const [name, lon, lat] of landmarken) {
    pruefe(`Mongolen-Karte: ${name} liegt auf der gezeichneten Küste`,
      abstandZurKueste(lon, lat) < TOLERANZ);
  }

  // Gegenprobe zur Gegenprobe: Mitten im Binnenland und auf offener See darf
  // keine Küste sein, sonst wäre der Test durch schiere Punktdichte immer
  // erfüllt. Der Kontrollpunkt in der mongolischen Steppe ist der wichtigste:
  // Dort, wo alles anfing, ist bis zum nächsten Meer sehr weit.
  const abseits = [
    ['in der mongolischen Steppe', 95.0, 45.0],
    ['mitten in Sibirien', 80.0, 55.0],
    ['auf dem Iranischen Hochland', 55.0, 33.0],
    ['im Ionischen Meer', 18.5, 37.0],
    ['im Japanischen Meer', 135.0, 40.0],
  ];
  for (const [wo, lon, lat] of abseits) {
    pruefe(`Mongolen-Karte: ${wo} liegt keine Küste`,
      abstandZurKueste(lon, lat) > TOLERANZ * 2);
  }

  // --- 4. Die beiden Enden des Bildes ------------------------------------
  // Liegnitz links, Dadu rechts: Dass beide auf dieselbe Karte passen, IST
  // die Aussage dieses Kapitels.
  const punkte = Object.fromEntries(karte.punkte.map((p) => [p.id, p]));
  for (const id of ['karakorum', 'dadu', 'samarkand', 'bagdad', 'liegnitz', 'kaffa']) {
    pruefe(`Mongolen-Karte: „${id}" ist ein Info-Punkt`, Boolean(punkte[id]));
  }
  pruefe('Mongolen-Karte: Liegnitz und Dadu liegen beide im Bild',
    imBild([punkte.liegnitz.x, punkte.liegnitz.y]) && imBild([punkte.dadu.x, punkte.dadu.y]));
  pruefe('Mongolen-Karte: zwischen Liegnitz und Dadu liegt fast die ganze Karte',
    punkte.dadu.x - punkte.liegnitz.x > karte.breite * 0.6);

  // Die Orte stehen in der richtigen West-Ost-Ordnung auf dem Bild.
  const westlicher = (a, b) => punkte[a].x < punkte[b].x;
  pruefe('Mongolen-Karte: Liegnitz liegt westlich von Kaffa', westlicher('liegnitz', 'kaffa'));
  pruefe('Mongolen-Karte: Kaffa liegt westlich von Bagdad', westlicher('kaffa', 'bagdad'));
  pruefe('Mongolen-Karte: Bagdad liegt westlich von Samarkand', westlicher('bagdad', 'samarkand'));
  pruefe('Mongolen-Karte: Samarkand liegt westlich von Karakorum',
    westlicher('samarkand', 'karakorum'));
  pruefe('Mongolen-Karte: Karakorum liegt westlich von Dadu', westlicher('karakorum', 'dadu'));
  pruefe('Mongolen-Karte: Karakorum liegt nördlich von Dadu', punkte.karakorum.y < punkte.dadu.y);
  pruefe('Mongolen-Karte: Bagdad liegt südlich von Kaffa', punkte.bagdad.y > punkte.kaffa.y);
  // Zwei Punkte tragen die Klammer zum Modultext: 1241 und der Schwarze Tod.
  pruefe('Mongolen-Karte: Liegnitz erzählt von 1241', punkte.liegnitz.text.includes('1241'));
  pruefe('Mongolen-Karte: Kaffa erzählt vom Schwarzen Tod',
    punkte.kaffa.text.includes('Schwarze Tod'));

  // Geografie-Gegenprobe an den Bewegungen: drei gehen nach Westen, eine nach
  // Süden. Genau so ist das Reich gewachsen.
  const bewegung = Object.fromEntries(karte.bewegungen.map((b) => [b.id, b]));
  for (const id of ['westfeldzug-1219', 'batu-1241', 'kublai-song']) {
    pruefe(`Mongolen-Karte: die Bewegung „${id}" ist da`, Boolean(bewegung[id]));
  }
  pruefe('Mongolen-Karte: der Westfeldzug 1219 zieht nach Westen',
    bewegung['westfeldzug-1219'].nach[0] < bewegung['westfeldzug-1219'].von[0]);
  pruefe('Mongolen-Karte: Batus Zug endet bei Liegnitz',
    Math.hypot(bewegung['batu-1241'].nach[0] - punkte.liegnitz.x,
      bewegung['batu-1241'].nach[1] - punkte.liegnitz.y) < 10);
  pruefe('Mongolen-Karte: Batus Zug kommt weiter nach Westen als der von 1219',
    bewegung['batu-1241'].nach[0] < bewegung['westfeldzug-1219'].nach[0]);
  pruefe('Mongolen-Karte: Kublais Feldzug gegen die Song zieht nach Süden',
    bewegung['kublai-song'].nach[1] > bewegung['kublai-song'].von[1]);
  pruefe('Mongolen-Karte: Kublais Feldzug beginnt in Dadu',
    Math.hypot(bewegung['kublai-song'].von[0] - punkte.dadu.x,
      bewegung['kublai-song'].von[1] - punkte.dadu.y) < 10);

  // --- 5. Beschriftungen -------------------------------------------------
  const beschriftungen = karte.beschriftungen || [];
  const texte = beschriftungen.map((b) => b.text);
  for (const name of [
    'Mongolei', 'China', 'Korea', 'Japan', 'Persien', 'Russland', 'Europa',
    'Steppe', 'Seidenstraße', 'Gobi', 'Himalaya',
  ]) {
    pruefe(`Mongolen-Karte: „${name}" ist beschriftet`, texte.includes(name));
  }
  pruefe('Mongolen-Karte: das Kaspische Meer ist beschriftet',
    texte.includes('Kaspisches Meer'));
  pruefe('Mongolen-Karte: es gibt Beschriftungen für Land und Meer', (() => {
    const arten = new Set(beschriftungen.map((b) => b.art));
    return arten.has('land') && arten.has('meer');
  })());

  // --- 6. Zusammenspiel mit dem Lernformat -------------------------------
  pruefe('Lernformat: „Dschingis Khan" zeigt den Karten-Abschnitt',
    abschnitteFuer(thema).some((a) => a.id === 'karte'));
  pruefe('Lernformat: der Karten-Abschnitt steht direkt hinter dem Aufhänger',
    abschnitteFuer(thema).findIndex((a) => a.id === 'karte') === 1);

  // --- 7. Das Modul selbst -----------------------------------------------
  // Runde 5 legte die europäische Sicht an (Opus); Hermes hat die chinesische
  // Sicht auf die Yuan-Zeit ergänzt. Der generische Schema-Test in
  // tests/themen.mjs nimmt alle Perspektiven automatisch mit — hier steht
  // nur, was für dieses Thema besonders gilt.
  pruefe('„Dschingis Khan": die europäische Sichtweise stammt von Opus', (() => {
    const europa = thema.perspektiven.find((p) => p.id === 'europaeisch');
    return Boolean(europa) && europa.stimme === 'Opus';
  })());
  pruefe('„Dschingis Khan": die chinesische Sichtweise stammt von Hermes', (() => {
    const chinesisch = thema.perspektiven.find((p) => p.id === 'chinesisch');
    return Boolean(chinesisch) && chinesisch.stimme === 'Hermes';
  })());
  pruefe('„Dschingis Khan": die Perspektive gibt sich als Sichtweise zu erkennen',
    thema.perspektiven[0].text.includes('So wird die Geschichte der Mongolen in Europa erzählt'));
  pruefe('„Dschingis Khan": die Perspektive öffnet die Tür zur zweiten Stimme',
    thema.perspektiven[0].text.includes('zweite'));
  pruefe('„Dschingis Khan": die Synthese führt beide Sichtweisen zusammen',
    thema.synthese.includes('europäische Erzählung') && thema.synthese.includes('chinesische Erzählung'));
  pruefe('„Dschingis Khan" hat 3 bis 5 Quizfragen',
    thema.quiz.length >= 3 && thema.quiz.length <= 5);
  pruefe('„Dschingis Khan": jede Quizfrage hat eine gültige richtige Antwort',
    thema.quiz.every((f) => typeof f.antworten[f.richtig] === 'string'));
  pruefe('„Dschingis Khan": jede Quizfrage wird erklärt',
    thema.quiz.every((f) => f.erklaerung.trim().length > 40));
  pruefe('„Dschingis Khan": das Urteil ist offen gestellt', thema.urteil.frage.includes('?'));
  pruefe('„Dschingis Khan": das Urteil bekommt einen Denkanstoß',
    typeof thema.urteil.hinweis === 'string' && thema.urteil.hinweis.length > 40);
  pruefe('„Dschingis Khan" steht als Modul 3 hinter China', (() => {
    const { alleThemen } = require('../utils/themen/index.js');
    return alleThemen[2] === thema && alleThemen[1].id === 'china';
  })());
}
