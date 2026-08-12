// Prüfungen für die Karte zum Thema „Die frühen Königreiche" — und für das,
// was das Themen-Modul an der Karte hängen hat.
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe:
// läuft mit blankem `node`.
//
// Das Karten-Schema und die Rechenwerkzeuge aus utils/karte-geo.js prüft
// tests/karte.mjs — hier geht es nur um diese eine Karte:
//   1. Vollständigkeit und Aufbau (Phasen, Punkte, Bewegungen, Beschriftungen).
//   2. Atlas-Gegenprobe: Liegen bekannte Häfen auf der gezeichneten Küste? Und
//      liegt mitten in Gallien keine?
//   3. Die Aussage steckt in der Geometrie: Das Frankenreich wächst über alle
//      vier Phasen vom kleinen Fleck zur größten Fläche, Ostrom schrumpft — und
//      steht doch auf jedem der vier Bilder.
//   4. Die Bewegungen hängen an den Info-Punkten: Die Mission läuft von Rom
//      nach Canterbury, Karl zieht von Aachen nach Rom. Dieselben zwei Orte,
//      entgegengesetzte Richtungen — Macht und Schrift auf denselben Straßen.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { pruefeKarte, KARTEN_PUNKT_TYPEN } = require('../utils/themen/schema.js');
const { erstelleProjektion } = require('../utils/karte-geo.js');
const { themaNachId, alleThemen } = require('../utils/themen/index.js');
const { abschnitteFuer } = require('../utils/lernformat.js');

/**
 * Der Kartenausschnitt, wie ihn utils/themen/karten/koenigreiche.js aufspannt.
 * Steht hier noch einmal, damit die Atlas-Gegenprobe unten rechnen kann — dass
 * er stimmt, prüft der Test über die daraus folgende Höhe.
 */
const RAHMEN = { minLon: -11, maxLon: 32, minLat: 33, maxLat: 57, breite: 700 };

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
  const thema = themaNachId('koenigreiche');
  pruefe('„Die frühen Königreiche" sind als Thema registriert', Boolean(thema));
  const karte = thema.karte;
  pruefe('„Die frühen Königreiche" bringen eine Karte mit', Boolean(karte));

  // --- 1. Aufbau ---------------------------------------------------------
  pruefe('Königreiche-Karte: erfüllt das Karten-Schema', pruefeKarte(karte).length === 0);
  pruefe('Königreiche-Karte: hat 4 Phasen — von der Trümmerkarte bis zur Krönung',
    karte.phasen.length === 4);
  pruefe('Königreiche-Karte: hat 6 bis 7 Info-Punkte',
    karte.punkte.length >= 6 && karte.punkte.length <= 7);
  pruefe('Königreiche-Karte: hat 2 bis 3 Bewegungen',
    karte.bewegungen.length >= 2 && karte.bewegungen.length <= 3);
  pruefe('Königreiche-Karte: jeder Punkt-typ ist ein bekannter',
    karte.punkte.every((p) => KARTEN_PUNKT_TYPEN.includes(p.typ)));
  // Jeder Info-Punkt trägt Hintergrundwissen — die Karte ist die Bühne, die
  // Texte stehen dahinter. Ein Satz allein reicht dafür nicht.
  pruefe('Königreiche-Karte: jeder Info-Punkt hat einen ausgeführten Text',
    karte.punkte.every((p) => p.text.trim().length > 200));
  pruefe('Königreiche-Karte: jede Bewegung hat einen ausgeführten Text',
    karte.bewegungen.every((b) => b.text.trim().length > 200));
  pruefe('Königreiche-Karte: jede Phase erklärt sich in einem Hinweis',
    karte.phasen.every((p) => typeof p.hinweis === 'string' && p.hinweis.length > 40));
  pruefe('Königreiche-Karte: die Phasen-ids sind eindeutig',
    new Set(karte.phasen.map((p) => p.id)).size === karte.phasen.length);

  // Die Stationen des Kapitels: das Ende Westroms, die stehenden Königreiche,
  // der Flickenteppich nach Justinian, die Kaiserkrönung.
  const labels = karte.phasen.map((p) => p.label).join(' | ');
  for (const jahr of ['476', '526', '600', '800']) {
    pruefe(`Königreiche-Karte: die Jahreszahl ${jahr} steht auf dem Umschalter`,
      labels.includes(jahr));
  }

  // Alles muss im Bild liegen — ein Punkt außerhalb wäre unantippbar.
  const imBild = ([x, y]) => x >= 0 && x <= karte.breite && y >= 0 && y <= karte.hoehe;
  pruefe('Königreiche-Karte: alle Info-Punkte liegen im Bild',
    karte.punkte.every((p) => imBild([p.x, p.y])));
  pruefe('Königreiche-Karte: alle Bewegungen liegen im Bild',
    karte.bewegungen.every((b) => [b.von, b.nach, ...(b.ueber || [])].every(imBild)));

  // --- 2. Die Erzählung steckt in der Geometrie --------------------------
  // Der Satz, um den dieses Kapitel gebaut ist: 476 ist das Frankenreich ein
  // Fleck, 800 die größte Fläche der Karte. Das muss die Geometrie hergeben,
  // sonst behauptet der Text etwas, was das Bild nicht zeigt.
  const FRANKEN = /Frankenreich|Reich Karls/;
  const frankenGroessen = karte.phasen.map((p) => groesseVon(p, FRANKEN));
  pruefe('Königreiche-Karte: in jeder Phase steht ein fränkisches Gebiet',
    frankenGroessen.every((g) => g > 0));
  pruefe('Königreiche-Karte: das Frankenreich wächst von Phase zu Phase',
    frankenGroessen.every((g, i) => i === 0 || g > frankenGroessen[i - 1]));

  const erste = karte.phasen[0];
  const letzte = karte.phasen[karte.phasen.length - 1];
  // 476 war das Westgotenreich das große und das fränkische das kleine — die
  // Phase sagt das im Hinweis, also muss der Größenunterschied deutlich sein.
  pruefe('Königreiche-Karte: 476 ist das Westgotenreich um ein Vielfaches größer als das fränkische',
    groesseVon(erste, /Westgotenreich/) > 10 * groesseVon(erste, FRANKEN));
  pruefe('Königreiche-Karte: 800 ist Karls Reich die größte Fläche des Bildes',
    letzte.flaechen.every((f) => flaecheninhalt(eckpunkte(f.d)) <= groesseVon(letzte, FRANKEN)));

  // „Der Kaiser ist weit weg, aber er ist nicht weg" — Ostrom gehört auf jedes
  // der vier Bilder, und es wird dabei kleiner.
  const OSTROM = /^Das Oströmische Reich/;
  pruefe('Königreiche-Karte: Ostrom steht auf jeder der vier Phasen',
    karte.phasen.every((p) => groesseVon(p, OSTROM) > 0));
  pruefe('Königreiche-Karte: Ostrom ist 800 kleiner als 476',
    groesseVon(letzte, OSTROM) < groesseVon(erste, OSTROM));

  // 476 ist eine Trümmerkarte: viele Herrschaften, wo eine war.
  pruefe('Königreiche-Karte: 476 zeigt mindestens acht Herrschaften',
    erste.flaechen.length >= 8);
  // Und 800 gehört die Halbinsel im Süden nicht mehr zum christlichen Europa —
  // das gehört auf das Bild, sonst fehlt die Hälfte der Erklärung für 711.
  pruefe('Königreiche-Karte: 800 ist Al-Andalus eine eigene Fläche',
    letzte.flaechen.some((f) => f.titel.includes('Al-Andalus')));

  // --- 3. Atlas-Gegenprobe -----------------------------------------------
  // Die Vorgabe des Betreibers lautet: Die Regionen müssen erkennbar sein,
  // keine abstrakte Skizze. Die Küstenlinien stehen im Kartenmodul als echte
  // Längen-/Breitengrade — wenn bekannte Häfen auf der gezeichneten Küste
  // liegen, ist die Karte ein Atlas und keine Fantasie.
  const geo = erstelleProjektion(RAHMEN);
  pruefe('Königreiche-Karte: die Höhe passt zum angenommenen Ausschnitt', geo.hoehe === karte.hoehe);
  pruefe('Königreiche-Karte: die Breite passt zum angenommenen Ausschnitt', geo.breite === karte.breite);

  // Nur Küsten und Seeufer — Flüsse würden die Probe verwässern, weil sie
  // mitten im Land liegen.
  const kuestenpunkte = karte.basis
    .filter((teil) => teil.art === 'land' || teil.art === 'wasser')
    .flatMap((teil) => eckpunkte(teil.d));
  pruefe('Königreiche-Karte: es gibt Küstenlinien zu prüfen', kuestenpunkte.length > 300);

  /** Abstand einer geografischen Landmarke zur nächsten gezeichneten Küste. */
  const abstandZurKueste = (lon, lat) => {
    const [x, y] = geo.punkt(lon, lat);
    return kuestenpunkte.reduce(
      (naechster, [kx, ky]) => Math.min(naechster, Math.hypot(kx - x, ky - y)),
      Infinity,
    );
  };

  // Toleranz 0,6 Grad, wie bei den Nachbarkarten. Diese hier ist mit 16,3
  // SVG-Einheiten je Längengrad die feinste der drei Europakarten, deshalb ist
  // dieselbe Gradzahl hier eine strengere Probe als bei den Germanen. Die
  // Werte unten liegen absichtlich alle mindestens 0,1 Grad NEBEN dem nächsten
  // Eckpunkt des Kartenmoduls: So prüft der Test die gezeichnete Linie und
  // nicht die abgeschriebene Zahl.
  const TOLERANZ = EINHEITEN_JE_GRAD * 0.6;
  const landmarken = [
    ['die Themsemündung', 0.8, 51.45],
    ['der Firth of Forth in Schottland', -2.7, 56.1],
    ['Belfast Lough auf Irland', -5.7, 54.7],
    ['Ostende an der flandrischen Küste', 2.92, 51.23],
    ['Le Havre an der Seinemündung', 0.1, 49.49],
    ['Bremerhaven an der Wesermündung', 8.58, 53.55],
    ['Esbjerg an Jütlands Westküste', 8.45, 55.47],
    ['das Stettiner Haff an der Ostsee', 14.25, 53.92],
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
  ];
  for (const [name, lon, lat] of landmarken) {
    pruefe(`Königreiche-Karte: ${name} liegt auf der gezeichneten Küste`,
      abstandZurKueste(lon, lat) < TOLERANZ);
  }

  // Gegenprobe zur Gegenprobe: Im Binnenland und auf offener See darf keine
  // Küste liegen, sonst wäre der Test durch schiere Punktdichte immer erfüllt.
  const abseits = [
    ['mitten in Gallien', 3.0, 47.0],
    ['in Sachsen', 10.5, 52.0],
    ['auf der spanischen Meseta', -4.0, 40.8],
    ['in der ungarischen Tiefebene', 19.5, 46.8],
    ['mitten in der Nordsee', 3.5, 55.6],
    ['im Golf von Biskaya', -5.0, 45.5],
    ['im Tyrrhenischen Meer', 12.0, 39.6],
    ['im Ionischen Meer', 19.5, 37.5],
  ];
  for (const [wo, lon, lat] of abseits) {
    pruefe(`Königreiche-Karte: ${wo} liegt keine Küste`,
      abstandZurKueste(lon, lat) > TOLERANZ * 2);
  }

  // --- 4. Der Untergrund --------------------------------------------------
  const landflaechen = karte.basis.filter((teil) => teil.art === 'land');
  pruefe('Königreiche-Karte: Festland, Britannien, Irland und die Inseln sind getrennt',
    landflaechen.length >= 8);
  pruefe('Königreiche-Karte: jede Landmasse ist ein geschlossener Pfad',
    landflaechen.every((teil) => teil.d.trim().endsWith('Z')));
  // Die Flüsse tragen dieses Kapitel mit: An Rhein und Donau lag die alte
  // Grenze, an Seine und Loire lagen die Königshöfe.
  pruefe('Königreiche-Karte: die Flüsse des Kapitels sind gezeichnet',
    karte.basis.filter((teil) => teil.art === 'fluss').length >= 9);

  // Die alte Reichsgrenze liegt als blasse Linie über dem Untergrund: Fast
  // alles, was hier entsteht, entsteht auf ehemals römischem Boden — und erst
  // Karl schiebt sein Reich weit darüber hinaus.
  const altgrenze = karte.basis.filter((teil) => teil.art === 'altgrenze');
  pruefe('Königreiche-Karte: die alte Reichsgrenze liegt im Untergrund',
    altgrenze.length === 1);
  pruefe('Königreiche-Karte: die alte Reichsgrenze ist eine Linie, keine Fläche',
    altgrenze.every((teil) => !teil.d.trim().endsWith('Z') && teil.fill === 'none'));

  // --- 5. Die Info-Punkte -------------------------------------------------
  const punkte = Object.fromEntries(karte.punkte.map((p) => [p.id, p]));
  for (const id of ['reims', 'tours', 'ravenna', 'rom', 'canterbury', 'aachen', 'toledo']) {
    pruefe(`Königreiche-Karte: „${id}" ist ein Info-Punkt`, Boolean(punkte[id]));
  }
  // y wächst nach unten: größeres y heißt weiter südlich.
  pruefe('Königreiche-Karte: Canterbury ist der nördlichste Punkt',
    karte.punkte.every((p) => p.id === 'canterbury' || p.y > punkte.canterbury.y));
  pruefe('Königreiche-Karte: Toledo ist der westlichste Punkt',
    karte.punkte.every((p) => p.id === 'toledo' || p.x > punkte.toledo.x));
  pruefe('Königreiche-Karte: Toledo ist zugleich der südlichste Punkt',
    karte.punkte.every((p) => p.id === 'toledo' || p.y < punkte.toledo.y));
  pruefe('Königreiche-Karte: Ravenna liegt nördlich von Rom',
    punkte.ravenna.y < punkte.rom.y);
  pruefe('Königreiche-Karte: Aachen liegt nördlich und östlich von Reims',
    punkte.aachen.y < punkte.reims.y && punkte.aachen.x > punkte.reims.x);
  // Die beiden Orte, an denen dieses Kapitel hängt: Reims erzählt die Taufe,
  // Tours den Chronisten, dem wir sie verdanken.
  pruefe('Königreiche-Karte: Reims erzählt von der Taufe Chlodwigs',
    punkte.reims.text.includes('taufen') && punkte.reims.text.includes('Remigius'));
  pruefe('Königreiche-Karte: Tours erzählt von Gregor und seiner Absicht',
    punkte.tours.text.includes('Gregor von Tours'));

  // --- 6. Die Bewegungen --------------------------------------------------
  const bewegung = Object.fromEntries(karte.bewegungen.map((b) => [b.id, b]));
  for (const id of ['franken', 'augustinus', 'karls-italienzug']) {
    pruefe(`Königreiche-Karte: die Bewegung „${id}" ist da`, Boolean(bewegung[id]));
  }
  const beiPunkt = (paar, id) =>
    Math.hypot(paar[0] - punkte[id].x, paar[1] - punkte[id].y) < 1;
  // Die Mission startet in Rom und endet in Canterbury, Karl zieht von Aachen
  // nach Rom: Wenn die Bewegungen an denselben Koordinaten hängen wie die
  // Info-Punkte, stimmt das Bild mit den Texten überein.
  pruefe('Königreiche-Karte: die Mission läuft von Rom aus los',
    beiPunkt(bewegung.augustinus.von, 'rom'));
  pruefe('Königreiche-Karte: die Mission endet in Canterbury',
    beiPunkt(bewegung.augustinus.nach, 'canterbury'));
  pruefe('Königreiche-Karte: Karls Zug beginnt in Aachen',
    beiPunkt(bewegung['karls-italienzug'].von, 'aachen'));
  pruefe('Königreiche-Karte: Karls Zug endet in Rom',
    beiPunkt(bewegung['karls-italienzug'].nach, 'rom'));
  // „Macht und Schrift reisten auf denselben Straßen, nur in verschiedene
  // Richtungen": Die eine Bewegung läuft nach Norden, die andere nach Süden.
  pruefe('Königreiche-Karte: die Mission zieht nach Norden, Karl nach Süden',
    bewegung.augustinus.nach[1] < bewegung.augustinus.von[1] &&
    bewegung['karls-italienzug'].nach[1] > bewegung['karls-italienzug'].von[1]);
  // Chlodwigs Weg geht von Tournai nach Süden — bis über die Loire hinaus.
  pruefe('Königreiche-Karte: die Franken ziehen von Norden nach Süden',
    bewegung.franken.nach[1] > bewegung.franken.von[1]);
  pruefe('Königreiche-Karte: der Frankenzug endet südlich von Tours (Vouillé 507)',
    bewegung.franken.nach[1] > punkte.tours.y);

  // --- 7. Beschriftungen -------------------------------------------------
  const beschriftungen = karte.beschriftungen || [];
  const texte = beschriftungen.map((b) => b.text);
  for (const name of [
    'Frankenreich', 'Westgoten', 'Ostgoten', 'Langobarden', 'Burgunder',
    'Angelsachsen', 'Römisches Reich (Ostrom)', 'Mittelmeer', 'Rhein', 'Donau',
  ]) {
    pruefe(`Königreiche-Karte: „${name}" ist beschriftet`, texte.includes(name));
  }
  pruefe('Königreiche-Karte: es gibt Beschriftungen für Land und Meer',
    beschriftungen.some((b) => b.art === 'land') && beschriftungen.some((b) => b.art === 'meer'));

  // --- 8. Zusammenspiel mit dem Lernformat -------------------------------
  pruefe('Lernformat: „Die frühen Königreiche" zeigen den Karten-Abschnitt',
    abschnitteFuer(thema).some((a) => a.id === 'karte'));
  pruefe('Lernformat: der Karten-Abschnitt steht direkt hinter dem Aufhänger',
    abschnitteFuer(thema).findIndex((a) => a.id === 'karte') === 1);

  // --- 9. Das Modul selbst -----------------------------------------------
  // Runde 9 legt nur die Sicht der Chronisten und Königshöfe an (Opus); die
  // Sicht aus den Dörfern ergänzt Hermes danach. Der generische Schema-Test in
  // tests/themen.mjs nimmt alle Perspektiven automatisch mit — hier steht nur,
  // was für dieses Thema besonders gilt.
  const chronisten = thema.perspektiven.find((p) => p.id === 'chronisten');
  pruefe('„Königreiche": die Sicht der Chronisten ist da und stammt von Opus',
    Boolean(chronisten) && chronisten.stimme === 'Opus');
  pruefe('„Königreiche": die Perspektive gibt sich als Sicht der Mächtigen zu erkennen',
    chronisten.text.includes('Erzählung der Mächtigen'));
  pruefe('„Königreiche": die Perspektive öffnet die Tür zur zweiten Stimme',
    chronisten.text.includes('zweiten Stimme'));
  // Die vier Verfasser, denen dieses Kapitel fast alles verdankt — wer sie
  // nicht nennt, verschweigt, woher das Wissen stammt.
  for (const name of ['Gregor von Tours', 'Fredegar', 'Beda', 'Einhard']) {
    pruefe(`„Königreiche": die Perspektive nennt ihre Quelle „${name}"`,
      chronisten.text.includes(name));
  }
  // Die Stationen des Kapitels.
  for (const stichwort of ['Chlodwig', 'Theoderich', 'Reccared', 'Lex Salica', '597', '751', '800']) {
    pruefe(`„Königreiche": die Perspektive erzählt von „${stichwort}"`,
      chronisten.text.includes(stichwort));
  }
  // TONE-REGEL: Die Sicht der Mächtigen muss die Schattenseite mit erzählen,
  // und zwar aus denselben Chroniken heraus — sonst wird aus der Perspektive
  // eine Verherrlichung.
  pruefe('„Königreiche": die Perspektive benennt Mord und Verrat an den Höfen',
    chronisten.text.includes('Brunhild') && chronisten.text.includes('Verwandten'));
  // Und sie muss sagen, dass die Taufe auch ein Machtmittel war — sonst fehlt
  // der Punkt, an dem diese Erzählung ihre eigene Absicht verrät.
  pruefe('„Königreiche": die Perspektive nennt die Taufe auch einen Machtschritt',
    chronisten.text.includes('Machtschritt'));

  // Solange nur eine Stimme dasteht, muss die Synthese das sagen. Bei diesem
  // Thema liegen die Perspektiven nicht nebeneinander, sondern übereinander —
  // oben und unten im selben Land.
  const zweiteStimme = thema.perspektiven.find((p) => p.stimme === 'Hermes');
  if (!zweiteStimme) {
    pruefe('„Königreiche": die Synthese sagt offen, dass eine Stimme fehlt',
      thema.synthese.includes('noch nicht fertig') && thema.synthese.includes('Dörfern'));
  } else {
    pruefe('„Königreiche": die Synthese führt beide Sichtweisen zusammen',
      thema.synthese.includes('Chronisten') && thema.synthese.includes('Dörfer'));
  }

  pruefe('„Königreiche" haben 3 bis 5 Quizfragen',
    thema.quiz.length >= 3 && thema.quiz.length <= 5);
  pruefe('„Königreiche": jede Quizfrage hat eine gültige richtige Antwort',
    thema.quiz.every((f) => typeof f.antworten[f.richtig] === 'string'));
  pruefe('„Königreiche": jede Quizfrage wird erklärt',
    thema.quiz.every((f) => f.erklaerung.trim().length > 40));
  pruefe('„Königreiche": das Urteil ist offen gestellt', thema.urteil.frage.includes('?'));
  pruefe('„Königreiche": das Urteil bekommt einen Denkanstoß',
    typeof thema.urteil.hinweis === 'string' && thema.urteil.hinweis.length > 40);
  pruefe('„Königreiche" stehen als Modul 7 hinter den Germanen',
    alleThemen[6] === thema && alleThemen[5].id === 'germanen');
}
