// Prüfungen für die Karte zum Thema „Germanen und Völkerwanderung" — und für
// das, was das Themen-Modul an der Karte hängen hat.
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe:
// läuft mit blankem `node`.
//
// Das Karten-Schema und die Rechenwerkzeuge aus utils/karte-geo.js prüft
// tests/karte.mjs — hier geht es nur um diese eine Karte:
//   1. Vollständigkeit und Aufbau (Phasen, Punkte, Bewegungen, Beschriftungen).
//   2. Atlas-Gegenprobe: Liegen bekannte Kaps und Häfen auf der gezeichneten
//      Küste? Und liegt mitten in Germanien keine?
//   3. Die Aussage steckt in der Geometrie: Aus einer Fläche werden viele, der
//      Osten bleibt unverändert stehen — und Germanien bekommt in keiner Phase
//      eine Fläche, weil es dort keine Herrschaft mit Grenzen gab.
//   4. Die Richtung der Wanderungen: Die Hunnen kommen von Osten, die Goten von
//      Norden, die Vandalen legen den weitesten Weg zurück.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { pruefeKarte, KARTEN_PUNKT_TYPEN } = require('../utils/themen/schema.js');
const { erstelleProjektion } = require('../utils/karte-geo.js');
const { themaNachId, alleThemen } = require('../utils/themen/index.js');
const { abschnitteFuer } = require('../utils/lernformat.js');

/**
 * Der Kartenausschnitt, wie ihn utils/themen/karten/germanen.js aufspannt.
 * Steht hier noch einmal, damit die Atlas-Gegenprobe unten rechnen kann — dass
 * er stimmt, prüft der Test über die daraus folgende Höhe.
 */
const RAHMEN = { minLon: -10, maxLon: 45, minLat: 32, maxLat: 58, breite: 700 };

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

/** Länge eines Wanderungswegs in SVG-Einheiten (von … über … nach). */
function weglaenge(bewegung) {
  const punkte = [bewegung.von, ...(bewegung.ueber || []), bewegung.nach];
  let summe = 0;
  for (let i = 0; i + 1 < punkte.length; i += 1) {
    summe += Math.hypot(punkte[i + 1][0] - punkte[i][0], punkte[i + 1][1] - punkte[i][1]);
  }
  return summe;
}

/**
 * @param {(name: string, ok: boolean) => void} pruefe Prüf-Funktion des Rahmens
 */
export function laufe(pruefe) {
  const thema = themaNachId('germanen');
  pruefe('„Germanen" ist als Thema registriert', Boolean(thema));
  const karte = thema.karte;
  pruefe('„Germanen" bringt eine Karte mit', Boolean(karte));

  // --- 1. Aufbau ---------------------------------------------------------
  pruefe('Germanen-Karte: erfüllt das Karten-Schema', pruefeKarte(karte).length === 0);
  pruefe('Germanen-Karte: hat 5 Phasen — von der Grenze bis zu den Königreichen',
    karte.phasen.length === 5);
  pruefe('Germanen-Karte: hat 5 bis 6 Info-Punkte',
    karte.punkte.length >= 5 && karte.punkte.length <= 6);
  pruefe('Germanen-Karte: hat 4 bis 5 Bewegungen',
    karte.bewegungen.length >= 4 && karte.bewegungen.length <= 5);
  pruefe('Germanen-Karte: jeder Punkt-typ ist ein bekannter',
    karte.punkte.every((p) => KARTEN_PUNKT_TYPEN.includes(p.typ)));
  // Jeder Info-Punkt trägt Hintergrundwissen — die Karte ist die Bühne, die
  // Texte stehen dahinter. Ein Satz allein reicht dafür nicht.
  pruefe('Germanen-Karte: jeder Info-Punkt hat einen ausgeführten Text',
    karte.punkte.every((p) => p.text.trim().length > 200));
  pruefe('Germanen-Karte: jede Bewegung hat einen ausgeführten Text',
    karte.bewegungen.every((b) => b.text.trim().length > 200));
  pruefe('Germanen-Karte: jede Phase erklärt sich in einem Hinweis',
    karte.phasen.every((p) => typeof p.hinweis === 'string' && p.hinweis.length > 40));
  pruefe('Germanen-Karte: die Phasen-ids sind eindeutig',
    new Set(karte.phasen.map((p) => p.id)).size === karte.phasen.length);

  // Die Stationen des Kapitels: die Grenze, der Hunnendruck, der Sturm, die
  // Königreiche, das Ende der Wanderung.
  const labels = karte.phasen.map((p) => p.label).join(' | ');
  for (const jahr of ['100', '375', '406', '500', '568']) {
    pruefe(`Germanen-Karte: die Jahreszahl ${jahr} steht auf dem Umschalter`,
      labels.includes(jahr));
  }

  // Alles muss im Bild liegen — ein Punkt außerhalb wäre unantippbar.
  const imBild = ([x, y]) => x >= 0 && x <= karte.breite && y >= 0 && y <= karte.hoehe;
  pruefe('Germanen-Karte: alle Info-Punkte liegen im Bild',
    karte.punkte.every((p) => imBild([p.x, p.y])));
  pruefe('Germanen-Karte: alle Bewegungen liegen im Bild',
    karte.bewegungen.every((b) => [b.von, b.nach, ...(b.ueber || [])].every(imBild)));

  // --- 2. Die Erzählung steckt in der Geometrie --------------------------
  // Die Aussage des Kapitels ist eine Zahl: aus einem Reich werden sechs. Auf
  // der Karte heißt das, die Zahl der Flächen muss wachsen, nicht die Fläche.
  const erste = karte.phasen[0];
  const letzte = karte.phasen[karte.phasen.length - 1];
  pruefe('Germanen-Karte: die letzte Phase zeigt mehr getrennte Gebiete als die erste',
    letzte.flaechen.length > erste.flaechen.length);
  pruefe('Germanen-Karte: die erste Phase zeigt ein einziges Reich in mehreren Teilen',
    erste.flaechen.every((f) => /Röm|Britannien|Kleinasien|afrikanisch/.test(f.titel)));

  // Die Festlegung aus dem Kopf des Kartenmoduls: Germanien bekommt in KEINER
  // Phase eine Fläche. Eine Fläche behauptet eine Herrschaft mit Grenzen, und
  // genau die gab es dort nicht. Benannt wird das Land trotzdem — als
  // Beschriftung. Beides zusammen ist die Aussage.
  const alleTitel = karte.phasen.flatMap((p) => p.flaechen.map((f) => f.titel));
  pruefe('Germanen-Karte: keine Phase zeichnet „Germanien" als Fläche',
    alleTitel.every((titel) => !titel.includes('Germanien')));
  pruefe('Germanen-Karte: Germanien ist trotzdem beschriftet',
    (karte.beschriftungen || []).some((b) => b.text === 'Germanien'));

  // „Und eines steht schon fast tausend Jahre und wird noch fast tausend
  // weitere stehen": Ostrom muss in den letzten drei Phasen unverändert
  // dieselbe Fläche sein — die Karte darf den Westen zerfallen lassen, ohne
  // den Osten mitzuziehen.
  const ostromFlaechen = karte.phasen
    .map((p) => p.flaechen.find((f) => f.titel.startsWith('Das Oströmische Reich')))
    .filter(Boolean);
  pruefe('Germanen-Karte: Ostrom steht in drei Phasen', ostromFlaechen.length === 3);
  pruefe('Germanen-Karte: Ostrom bleibt dabei unverändert',
    ostromFlaechen.every((f) => f.d === ostromFlaechen[0].d));

  // Im Sturm bleibt vom Westen ein Rest, während der Osten unversehrt ist.
  const sturm = karte.phasen.find((p) => p.id === 'sturm');
  pruefe('Germanen-Karte: die Sturm-Phase ist da', Boolean(sturm));
  const groesse = (titelAnfang) => {
    const flaeche = sturm.flaechen.find((f) => f.titel.startsWith(titelAnfang));
    return flaeche ? flaecheninhalt(eckpunkte(flaeche.d)) : 0;
  };
  pruefe('Germanen-Karte: 455 ist Ostrom größer als das, was Westrom noch hielt',
    groesse('Das Oströmische Reich') > groesse('Was Westrom noch hielt'));

  // --- 3. Atlas-Gegenprobe -----------------------------------------------
  // Die Vorgabe des Betreibers lautet: Die Regionen müssen erkennbar sein,
  // keine abstrakte Skizze. Die Küstenlinien stehen im Kartenmodul als echte
  // Längen-/Breitengrade — wenn bekannte Kaps und Häfen auf der gezeichneten
  // Küste liegen, ist die Karte ein Atlas und keine Fantasie.
  const geo = erstelleProjektion(RAHMEN);
  pruefe('Germanen-Karte: die Höhe passt zum angenommenen Ausschnitt', geo.hoehe === karte.hoehe);
  pruefe('Germanen-Karte: die Breite passt zum angenommenen Ausschnitt', geo.breite === karte.breite);

  // Nur Küsten und Seeufer — Flüsse würden die Probe verwässern, weil sie
  // mitten im Land liegen.
  const kuestenpunkte = karte.basis
    .filter((teil) => teil.art === 'land' || teil.art === 'wasser')
    .flatMap((teil) => eckpunkte(teil.d));
  pruefe('Germanen-Karte: es gibt Küstenlinien zu prüfen', kuestenpunkte.length > 300);

  /** Abstand einer geografischen Landmarke zur nächsten gezeichneten Küste. */
  const abstandZurKueste = (lon, lat) => {
    const [x, y] = geo.punkt(lon, lat);
    return kuestenpunkte.reduce(
      (naechster, [kx, ky]) => Math.min(naechster, Math.hypot(kx - x, ky - y)),
      Infinity,
    );
  };

  // Diese Karte ist mit 12,7 SVG-Einheiten je Längengrad die zweitgröbste der
  // App — trotzdem sind es hier nur 0,6 Grad Toleranz und nicht ein ganzer wie
  // bei der Eurasien-Karte: Die Küste ist dicht genug abgetastet, dass ein Grad
  // nichts mehr beweisen würde. Die Werte unten sind absichtlich KEINE
  // Eckpunkte aus dem Kartenmodul, sondern unabhängig im Atlas nachgeschlagen.
  // So prüft der Test die gezeichnete Linie und nicht die abgeschriebene Zahl.
  const TOLERANZ = EINHEITEN_JE_GRAD * 0.6;
  const landmarken = [
    ["Land's End, die Südwestspitze Britanniens", -5.71, 50.07],
    ['Belfast Lough auf Irland', -5.7, 54.7],
    ['die Themsemündung', 0.8, 51.45],
    ['Ostende an der flandrischen Küste', 2.92, 51.23],
    ['Bremerhaven an der Wesermündung', 8.58, 53.55],
    ['Esbjerg an Jütlands Westküste', 8.45, 55.47],
    ['das Stettiner Haff an der Ostsee', 14.25, 53.92],
    ['Brest an der Spitze der Bretagne', -4.5, 48.38],
    ['das Becken von Arcachon', -1.17, 44.66],
    ['die Tejomündung bei Lissabon', -9.15, 38.7],
    ['Kap Trafalgar', -6.03, 36.18],
    ['Barcelona', 2.18, 41.38],
    ['Marseille an der Rhônemündung', 5.37, 43.3],
    ['Genua am Ligurischen Meer', 8.95, 44.4],
    ['Neapel', 14.25, 40.85],
    ['Bari an der Adria', 16.87, 41.13],
    ['Kap Matapan, die Südspitze der Peloponnes', 22.48, 36.39],
    ['Thessaloniki', 22.95, 40.62],
    ['der Bosporus bei Konstantinopel', 28.98, 41.02],
    ['Sinope an der Südküste des Schwarzen Meeres', 35.15, 42.03],
    ['Sewastopol auf der Krim', 33.53, 44.6],
    ['Odessa', 30.75, 46.48],
    ['Taganrog am Asowschen Meer', 38.9, 47.22],
    ['Algier', 3.06, 36.78],
    ['Tripolis', 13.18, 32.9],
  ];
  for (const [name, lon, lat] of landmarken) {
    pruefe(`Germanen-Karte: ${name} liegt auf der gezeichneten Küste`,
      abstandZurKueste(lon, lat) < TOLERANZ);
  }

  // Gegenprobe zur Gegenprobe: Im Binnenland und auf offener See darf keine
  // Küste liegen, sonst wäre der Test durch schiere Punktdichte immer erfüllt.
  // Der erste Wert ist der wichtigste: Mitten in Germanien ist auf dieser Karte
  // absichtlich nichts — kein Ufer, keine Grenze, keine Fläche.
  const abseits = [
    ['mitten in Germanien', 12.0, 51.2],
    ['mitten in Gallien', 3.0, 47.0],
    ['in der pontischen Steppe', 41.0, 50.0],
    ['in der ungarischen Tiefebene', 18.5, 46.8],
    ['mitten in der Nordsee', 3.5, 55.6],
    ['mitten in der Ostsee', 18.5, 56.6],
    ['mitten im Schwarzen Meer', 34.0, 43.3],
    ['im Ionischen Meer', 19.5, 37.5],
  ];
  for (const [wo, lon, lat] of abseits) {
    pruefe(`Germanen-Karte: ${wo} liegt keine Küste`,
      abstandZurKueste(lon, lat) > TOLERANZ * 2);
  }

  // --- 4. Der Untergrund --------------------------------------------------
  const landflaechen = karte.basis.filter((teil) => teil.art === 'land');
  pruefe('Germanen-Karte: Festland, Inseln und Britannien sind getrennte Landmassen',
    landflaechen.length >= 9);
  pruefe('Germanen-Karte: jede Landmasse ist ein geschlossener Pfad',
    landflaechen.every((teil) => teil.d.trim().endsWith('Z')));
  // Die Flüsse sind hier nicht Zierrat: An Rhein und Donau lag die Grenze, an
  // Weichsel und Dnjepr der Weg der Goten, am Don kamen die Hunnen an.
  pruefe('Germanen-Karte: die Flüsse des Kapitels sind gezeichnet',
    karte.basis.filter((teil) => teil.art === 'fluss').length >= 10);

  // Rhein–Limes–Donau liegt als eigene Linie über dem Untergrund — sie ist das
  // Thema des Kapitels und darf deshalb keine geschlossene Fläche sein.
  const grenzlinien = karte.basis.filter((teil) => teil.art === 'mauer');
  pruefe('Germanen-Karte: die Grenzlinie Rhein–Limes–Donau ist im Untergrund',
    grenzlinien.length === 1);
  pruefe('Germanen-Karte: die Grenzlinie ist eine Linie, keine Fläche',
    grenzlinien.every((teil) => !teil.d.trim().endsWith('Z') && teil.fill === 'none'));

  // --- 5. Die Info-Punkte -------------------------------------------------
  const punkte = Object.fromEntries(karte.punkte.map((p) => [p.id, p]));
  for (const id of ['teutoburger-wald', 'limes', 'adrianopel', 'rom', 'ravenna', 'karthago']) {
    pruefe(`Germanen-Karte: „${id}" ist ein Info-Punkt`, Boolean(punkte[id]));
  }
  // y wächst nach unten: größeres y heißt weiter südlich.
  pruefe('Germanen-Karte: der Teutoburger Wald liegt nördlich des Limes',
    punkte['teutoburger-wald'].y < punkte.limes.y);
  pruefe('Germanen-Karte: Ravenna liegt nördlich von Rom',
    punkte.ravenna.y < punkte.rom.y);
  pruefe('Germanen-Karte: Karthago ist der südlichste Punkt',
    karte.punkte.every((p) => p.id === 'karthago' || p.y < punkte.karthago.y));
  pruefe('Germanen-Karte: Adrianopel ist der östlichste Punkt',
    karte.punkte.every((p) => p.id === 'adrianopel' || p.x < punkte.adrianopel.x));
  // Der Limes-Punkt muss auf der gezeichneten Grenzlinie sitzen, nicht daneben.
  const limespunkte = eckpunkte(grenzlinien[0].d);
  pruefe('Germanen-Karte: der Limes-Punkt liegt auf der Grenzlinie',
    limespunkte.reduce(
      (naechster, [x, y]) => Math.min(naechster, Math.hypot(x - punkte.limes.x, y - punkte.limes.y)),
      Infinity,
    ) < EINHEITEN_JE_GRAD);
  pruefe('Germanen-Karte: der Limes-Punkt erklärt die Grenze als Schwelle, nicht als Wall',
    punkte.limes.text.includes('keine Mauer'));

  // --- 6. Die Wanderungen -------------------------------------------------
  const bewegung = Object.fromEntries(karte.bewegungen.map((b) => [b.id, b]));
  for (const id of ['hunnen', 'goten', 'westgoten', 'vandalen', 'angelsachsen']) {
    pruefe(`Germanen-Karte: die Bewegung „${id}" ist da`, Boolean(bewegung[id]));
  }
  // Die Richtungen sind die halbe Erzählung: Der Druck kommt aus dem Osten,
  // die Goten kommen von der Ostsee herunter, die Westgoten ziehen quer durch
  // das Reich nach Westen.
  pruefe('Germanen-Karte: die Hunnen kommen von Osten',
    bewegung.hunnen.nach[0] < bewegung.hunnen.von[0]);
  pruefe('Germanen-Karte: die Goten ziehen von Norden nach Süden',
    bewegung.goten.nach[1] > bewegung.goten.von[1]);
  pruefe('Germanen-Karte: die Goten enden an der unteren Donau, bei Adrianopel',
    Math.hypot(bewegung.goten.nach[0] - punkte.adrianopel.x,
      bewegung.goten.nach[1] - punkte.adrianopel.y) < EINHEITEN_JE_GRAD * 2);
  pruefe('Germanen-Karte: die Westgoten ziehen nach Westen',
    bewegung.westgoten.nach[0] < bewegung.westgoten.von[0]);
  pruefe('Germanen-Karte: die Westgoten setzen dort an, wo die Goten aufhören',
    Math.hypot(bewegung.westgoten.von[0] - bewegung.goten.nach[0],
      bewegung.westgoten.von[1] - bewegung.goten.nach[1]) < EINHEITEN_JE_GRAD);
  pruefe('Germanen-Karte: die Vandalen enden in Nordafrika, bei Karthago',
    Math.hypot(bewegung.vandalen.nach[0] - punkte.karthago.x,
      bewegung.vandalen.nach[1] - punkte.karthago.y) < EINHEITEN_JE_GRAD);
  // „Von allen Wanderungen dieser Karte ist ihre die weiteste" — das behauptet
  // der Text der Bewegung, also muss die Geometrie es hergeben.
  const laengen = karte.bewegungen.map((b) => [b.id, weglaenge(b)]);
  const weiteste = laengen.reduce((a, b) => (b[1] > a[1] ? b : a));
  pruefe('Germanen-Karte: die Vandalen legen wirklich den weitesten Weg zurück',
    weiteste[0] === 'vandalen');
  // Die Angelsachsen sind die einzige Bewegung über offene See — und sie endet
  // auf der Insel, westlich des Startpunkts an der Nordseeküste.
  pruefe('Germanen-Karte: die Angelsachsen setzen nach Westen über',
    bewegung.angelsachsen.nach[0] < bewegung.angelsachsen.von[0]);

  // --- 7. Beschriftungen -------------------------------------------------
  const beschriftungen = karte.beschriftungen || [];
  const texte = beschriftungen.map((b) => b.text);
  for (const name of [
    'Britannien', 'Gallien', 'Germanien', 'Hispanien', 'Italien', 'Nordafrika',
    'Ostsee', 'Nordsee', 'Mittelmeer', 'Schwarzes Meer', 'Rhein', 'Donau',
  ]) {
    pruefe(`Germanen-Karte: „${name}" ist beschriftet`, texte.includes(name));
  }
  pruefe('Germanen-Karte: es gibt Beschriftungen für Land und Meer',
    beschriftungen.some((b) => b.art === 'land') && beschriftungen.some((b) => b.art === 'meer'));

  // --- 8. Zusammenspiel mit dem Lernformat -------------------------------
  pruefe('Lernformat: „Germanen" zeigt den Karten-Abschnitt',
    abschnitteFuer(thema).some((a) => a.id === 'karte'));
  pruefe('Lernformat: der Karten-Abschnitt steht direkt hinter dem Aufhänger',
    abschnitteFuer(thema).findIndex((a) => a.id === 'karte') === 1);

  // --- 9. Das Modul selbst -----------------------------------------------
  // Runde 8 legt nur die römisch-mediterrane Sicht an (Opus); die germanische
  // Sicht ergänzt Hermes danach. Der generische Schema-Test in tests/themen.mjs
  // nimmt alle Perspektiven automatisch mit — hier steht nur, was für dieses
  // Thema besonders gilt.
  const roemisch = thema.perspektiven.find((p) => p.id === 'roemisch');
  pruefe('„Germanen": die römische Sichtweise ist da und stammt von Opus',
    Boolean(roemisch) && roemisch.stimme === 'Opus');
  pruefe('„Germanen": die Perspektive gibt sich als Sichtweise zu erkennen',
    roemisch.text.includes('So wird die Geschichte der Völkerwanderung in der Tradition erzählt'));
  pruefe('„Germanen": die Perspektive öffnet die Tür zur zweiten Stimme',
    roemisch.text.includes('zweiten Stimme'));
  // Die Quellenfrage ist bei diesem Thema keine Fußnote, sondern der Kern:
  // Hier haben die Verlierer geschrieben, und die Sieger hinterließen keine
  // Chroniken. Wenn das im Text fehlt, fehlt die Multiperspektivität.
  pruefe('„Germanen": die Perspektive benennt, dass die Quellen von einer Seite stammen',
    roemisch.text.includes('Runen') && roemisch.text.includes('Wulfila'));
  pruefe('„Germanen": die Perspektive benennt den Missbrauch der „Germania"',
    roemisch.text.includes('Tacitus') && roemisch.text.includes('Nationalsozialisten'));
  // Die Stationen des Kapitels müssen wirklich erzählt werden.
  for (const stichwort of ['Arminius', 'Limes', 'Stilicho', '376', 'Adrianopel', '410', '476']) {
    pruefe(`„Germanen": die Perspektive erzählt von „${stichwort}"`,
      roemisch.text.includes(stichwort));
  }
  // Und sie muss das Wort selbst zum Thema machen — „Völkerwanderung" gegen
  // „Barbareneinfälle" ist der Ort, an dem dieses Kapitel die Leitidee der App
  // an einem einzigen Begriff vorführt.
  pruefe('„Germanen": die Perspektive prüft das Wort „Völkerwanderung" selbst',
    roemisch.text.includes('Völkerwanderung') && roemisch.text.includes('Barbareneinfälle'));

  // Solange nur eine Stimme dasteht, muss die Synthese das sagen — bei diesem
  // Thema ist das keine Formalie: Ohne Gegenstimme klingt eine Erzählung, der
  // niemand widerspricht, wie die ganze Wahrheit.
  const zweiteStimme = thema.perspektiven.find((p) => p.stimme === 'Hermes');
  if (!zweiteStimme) {
    pruefe('„Germanen": die Synthese sagt offen, dass eine Stimme fehlt',
      thema.synthese.includes('noch nicht fertig') && thema.synthese.includes('germanische'));
  } else {
    pruefe('„Germanen": die Synthese führt beide Sichtweisen zusammen',
      thema.synthese.includes('römisch') && thema.synthese.includes('germanisch'));
  }

  pruefe('„Germanen" hat 3 bis 5 Quizfragen',
    thema.quiz.length >= 3 && thema.quiz.length <= 5);
  pruefe('„Germanen": jede Quizfrage hat eine gültige richtige Antwort',
    thema.quiz.every((f) => typeof f.antworten[f.richtig] === 'string'));
  pruefe('„Germanen": jede Quizfrage wird erklärt',
    thema.quiz.every((f) => f.erklaerung.trim().length > 40));
  pruefe('„Germanen": das Urteil ist offen gestellt', thema.urteil.frage.includes('?'));
  pruefe('„Germanen": das Urteil bekommt einen Denkanstoß',
    typeof thema.urteil.hinweis === 'string' && thema.urteil.hinweis.length > 40);
  pruefe('„Germanen" steht als Modul 6 hinter „Israel und Palästina"',
    alleThemen[5] === thema && alleThemen[4].id === 'israel-palaestina');
}
