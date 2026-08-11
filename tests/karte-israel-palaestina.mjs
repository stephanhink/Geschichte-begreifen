// Prüfungen für die Karte zum Thema „Israel und Palästina" — und für das,
// was das Themen-Modul an der Karte hängen hat.
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe:
// läuft mit blankem `node`.
//
// Dieses Kapitel ist das heikelste der App, deshalb prüft diese Datei mehr als
// Geometrie. Sie prüft auch die Zusagen, die das Kapitel dem Betreiber
// gegenüber macht (notizen/israel-palaestina.md, Grundsatz: beide Narrative
// und beide Leiden anerkennen):
//   1. Vollständigkeit und Aufbau (Phasen, Punkte, Bewegungen, Beschriftungen).
//   2. Atlas-Gegenprobe: Liegen bekannte Hafenstädte und Seeufer auf der
//      gezeichneten Küste? Und liegt mitten im Mittelmeer keine?
//   3. Die Karte zeigt HISTORISCHE Zustände, keine Grenzen von heute — jede
//      Phase trägt ihre Jahreszahl und einen Hinweis.
//   4. Die Bewegungen laufen in BEIDE Richtungen: Flucht und Vertreibung 1948
//      aus dem Land heraus, Einwanderung ins Land hinein. Eine Karte, die nur
//      eine Richtung zeigt, hätte schon Position bezogen.
//   5. Die Perspektive lässt die unbequemen Stellen der eigenen Erzählung
//      nicht weg (Nakba, 700 000; jüdische Flüchtlinge, 850 000) und benennt
//      ausdrücklich, dass das Land nicht leer war.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { pruefeKarte, KARTEN_PUNKT_TYPEN } = require('../utils/themen/schema.js');
const { erstelleProjektion } = require('../utils/karte-geo.js');
const { themaNachId, alleThemen } = require('../utils/themen/index.js');
const { abschnitteFuer } = require('../utils/lernformat.js');

/**
 * Der Kartenausschnitt, wie ihn utils/themen/karten/israel-palaestina.js
 * aufspannt. Steht hier noch einmal, damit die Atlas-Gegenprobe unten rechnen
 * kann — dass er stimmt, prüft der Test über die daraus folgende Höhe.
 */
const RAHMEN = { minLon: 32, maxLon: 37, minLat: 29, maxLat: 34.5, breite: 700 };

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

/**
 * @param {(name: string, ok: boolean) => void} pruefe Prüf-Funktion des Rahmens
 */
export function laufe(pruefe) {
  const thema = themaNachId('israel-palaestina');
  pruefe('„Israel und Palästina" ist als Thema registriert', Boolean(thema));
  const karte = thema.karte;
  pruefe('„Israel und Palästina" bringt eine Karte mit', Boolean(karte));

  // --- 1. Aufbau ---------------------------------------------------------
  pruefe('Levante-Karte: erfüllt das Karten-Schema', pruefeKarte(karte).length === 0);
  pruefe('Levante-Karte: hat mindestens 3 Phasen', karte.phasen.length >= 3);
  pruefe('Levante-Karte: hat 5 bis 6 Info-Punkte',
    karte.punkte.length >= 5 && karte.punkte.length <= 6);
  pruefe('Levante-Karte: hat 2 bis 4 Bewegungen',
    karte.bewegungen.length >= 2 && karte.bewegungen.length <= 4);
  pruefe('Levante-Karte: jeder Punkt-typ ist ein bekannter',
    karte.punkte.every((p) => KARTEN_PUNKT_TYPEN.includes(p.typ)));
  // Jeder Info-Punkt trägt Hintergrundwissen — die Karte ist die Bühne, die
  // Texte stehen dahinter. Ein Satz allein reicht dafür nicht.
  pruefe('Levante-Karte: jeder Info-Punkt hat einen ausgeführten Text',
    karte.punkte.every((p) => p.text.trim().length > 200));
  pruefe('Levante-Karte: jede Bewegung hat einen ausgeführten Text',
    karte.bewegungen.every((b) => b.text.trim().length > 200));
  pruefe('Levante-Karte: die Phasen-ids sind eindeutig',
    new Set(karte.phasen.map((p) => p.id)).size === karte.phasen.length);

  // Alles muss im Bild liegen — ein Punkt außerhalb wäre unantippbar.
  const imBild = ([x, y]) => x >= 0 && x <= karte.breite && y >= 0 && y <= karte.hoehe;
  pruefe('Levante-Karte: alle Info-Punkte liegen im Bild',
    karte.punkte.every((p) => imBild([p.x, p.y])));
  pruefe('Levante-Karte: alle Bewegungen liegen im Bild',
    karte.bewegungen.every((b) => [b.von, b.nach, ...(b.ueber || [])].every(imBild)));

  // --- 2. Historische Zustände, keine Grenzen von heute ------------------
  // Das ist die wichtigste Zusage dieser Karte. Wer den Umschalter ansieht,
  // muss auf einen Blick erkennen, dass er Geschichte sieht und keine
  // Behauptung darüber, wie es sein sollte.
  const labels = karte.phasen.map((p) => p.label);
  for (const jahr of ['1947', '1949', '1967']) {
    pruefe(`Levante-Karte: die Jahreszahl ${jahr} steht auf dem Umschalter`,
      labels.some((l) => l.includes(jahr)));
  }
  pruefe('Levante-Karte: jede Phase erklärt in einem Hinweis, was man sieht',
    karte.phasen.every((p) => typeof p.hinweis === 'string' && p.hinweis.length > 100));
  // Der Teilungsplan war ein Plan und wird auch so benannt — er ist nie in
  // Kraft getreten.
  const teilungsplan = karte.phasen.find((p) => p.label.includes('1947'));
  pruefe('Levante-Karte: die Phase von 1947 ist als Plan gekennzeichnet',
    teilungsplan.flaechen.every((f) => f.titel.includes('Plan')));
  pruefe('Levante-Karte: der Teilungsplan zeigt beide vorgesehenen Staaten',
    teilungsplan.flaechen.some((f) => f.titel.includes('Jüdischer Staat')) &&
    teilungsplan.flaechen.some((f) => f.titel.includes('Arabischer Staat')));
  pruefe('Levante-Karte: der Teilungsplan zeigt Jerusalem als internationale Zone',
    teilungsplan.flaechen.some((f) => f.titel.includes('international')));
  // 1949: Westjordanland und Gaza standen unter jordanischer bzw.
  // ägyptischer Kontrolle — das gehört zur Karte, es wird oft übersehen.
  const waffenstillstand = karte.phasen.find((p) => p.label.includes('1949'));
  const titel1949 = waffenstillstand.flaechen.map((f) => f.titel).join(' | ');
  pruefe('Levante-Karte: 1949 nennt die jordanische Kontrolle über das Westjordanland',
    titel1949.includes('jordanisch'));
  pruefe('Levante-Karte: 1949 nennt die ägyptische Verwaltung des Gazastreifens',
    titel1949.includes('ägyptisch'));
  // 1967: Die Besetzung wird als historischer Zustand benannt, nicht bewertet —
  // und der Rückgabe des Sinai bzw. dem Abzug aus Gaza wird nicht
  // widersprochen.
  const nach1967 = karte.phasen.find((p) => p.label.includes('1967'));
  const titel1967 = nach1967.flaechen.map((f) => f.titel).join(' | ');
  pruefe('Levante-Karte: nach 1967 wird die Besetzung als solche benannt',
    titel1967.includes('besetzt'));
  pruefe('Levante-Karte: nach 1967 stehen auch Rückgabe und Abzug in den Titeln',
    titel1967.includes('zurückgegeben') && titel1967.includes('Abzug'));

  // --- 3. Atlas-Gegenprobe -----------------------------------------------
  const geo = erstelleProjektion(RAHMEN);
  pruefe('Levante-Karte: die Höhe passt zum angenommenen Ausschnitt', geo.hoehe === karte.hoehe);
  pruefe('Levante-Karte: die Breite passt zum angenommenen Ausschnitt', geo.breite === karte.breite);

  // Nur Küsten und Seeufer — Flüsse und der Kanal würden die Probe
  // verwässern, weil sie mitten im Land liegen.
  const kuestenpunkte = karte.basis
    .filter((teil) => teil.art === 'land' || teil.art === 'wasser')
    .flatMap((teil) => eckpunkte(teil.d));
  pruefe('Levante-Karte: es gibt Küstenlinien zu prüfen', kuestenpunkte.length > 50);

  /** Abstand einer geografischen Landmarke zur nächsten gezeichneten Küste. */
  const abstandZurKueste = (lon, lat) => {
    const [x, y] = geo.punkt(lon, lat);
    return kuestenpunkte.reduce(
      (naechster, [kx, ky]) => Math.min(naechster, Math.hypot(kx - x, ky - y)),
      Infinity,
    );
  };

  // Diese Karte ist mit 140 SVG-Einheiten je Längengrad die feinste der App —
  // rund 27-mal feiner als die Eurasien-Karte des Mongolen-Kapitels. Die
  // Toleranz ist deshalb nur 0,15 Grad, also gut 15 Kilometer. Die Werte sind
  // absichtlich KEINE Eckpunkte aus dem Kartenmodul, sondern unabhängig im
  // Atlas nachgeschlagen: So prüft der Test die gezeichnete Linie und nicht
  // die abgeschriebene Zahl.
  const TOLERANZ = EINHEITEN_JE_GRAD * 0.15;
  const landmarken = [
    ['Jaffa an der Küste von Tel Aviv', 34.75, 32.05],
    ['Aschkelon', 34.55, 31.67],
    ['Gaza-Stadt an der Küste', 34.44, 31.52],
    ['Rafah am Südende des Gazastreifens', 34.25, 31.29],
    ['El Arisch an der Sinai-Küste', 33.8, 31.13],
    ['Port Said am Mittelmeer', 32.3, 31.26],
    ['Akkon an der Bucht von Haifa', 35.07, 32.92],
    ['Tyros an der libanesischen Küste', 35.19, 33.27],
    ['Beirut', 35.5, 33.9],
    ['das Nordende des Toten Meeres', 35.5, 31.77],
    ['das Ostufer des Sees Genezareth', 35.63, 32.8],
    ['Eilat und Akaba am Golf', 34.98, 29.54],
  ];
  for (const [name, lon, lat] of landmarken) {
    pruefe(`Levante-Karte: ${name} liegt auf der gezeichneten Küste`,
      abstandZurKueste(lon, lat) < TOLERANZ);
  }

  // Gegenprobe zur Gegenprobe: auf offener See und mitten in der Wüste darf
  // keine Küste liegen, sonst wäre der Test durch schiere Punktdichte immer
  // erfüllt.
  const abseits = [
    ['auf offener See im Mittelmeer', 33.5, 33.0],
    ['mitten im Negev', 34.9, 30.6],
    ['in der jordanischen Wüste', 36.5, 31.5],
    ['im Inneren des Sinai', 33.8, 30.0],
  ];
  for (const [wo, lon, lat] of abseits) {
    pruefe(`Levante-Karte: ${wo} liegt keine Küste`,
      abstandZurKueste(lon, lat) > TOLERANZ * 2);
  }

  // --- 4. Die Bewegungen laufen in beide Richtungen ----------------------
  // Der Auftrag des Betreibers ist hier ausdrücklich: beide Ströme. 1948 war
  // kein Vorgang mit einer Richtung. Eine Karte, die nur die Flucht oder nur
  // die Einwanderung zeigt, hätte bereits Partei ergriffen.
  const bewegung = Object.fromEntries(karte.bewegungen.map((b) => [b.id, b]));
  const punkte = Object.fromEntries(karte.punkte.map((p) => [p.id, p]));
  const hinaus = karte.bewegungen.filter((b) => b.id.startsWith('flucht-1948'));
  const hinein = karte.bewegungen.filter((b) => !b.id.startsWith('flucht-1948'));
  pruefe('Levante-Karte: es gibt Bewegungen aus dem Land heraus', hinaus.length >= 1);
  pruefe('Levante-Karte: es gibt Bewegungen ins Land hinein', hinein.length >= 1);

  /** Abstand eines SVG-Punktes zum Info-Punkt Tel Aviv — grob „die Mitte". */
  const zurMitte = ([x, y]) => Math.hypot(x - punkte['tel-aviv'].x, y - punkte['tel-aviv'].y);
  for (const b of hinaus) {
    pruefe(`Levante-Karte: „${b.id}" führt vom Land weg`,
      zurMitte(b.nach) > zurMitte(b.von));
  }
  for (const b of hinein) {
    pruefe(`Levante-Karte: „${b.id}" führt ins Land hinein`,
      zurMitte(b.nach) < zurMitte(b.von));
  }
  // Die beiden Zahlen, um die es geht, stehen in den Bewegungstexten — sonst
  // wären es nur Pfeile.
  const bewegungstexte = karte.bewegungen.map((b) => b.text).join(' ');
  pruefe('Levante-Karte: die Bewegungen nennen die rund 700 000 Geflohenen und Vertriebenen',
    bewegungstexte.includes('700 000'));
  pruefe('Levante-Karte: die Bewegungen nennen die rund 850 000 jüdischen Flüchtlinge',
    bewegungstexte.includes('850 000'));

  // --- 5. Die Info-Punkte ------------------------------------------------
  for (const id of ['jerusalem', 'tel-aviv', 'haifa', 'gaza', 'hebron']) {
    pruefe(`Levante-Karte: „${id}" ist ein Info-Punkt`, Boolean(punkte[id]));
  }
  // Jerusalem ist für drei Weltreligionen heilig — wenn der Punkt nur eine
  // davon nennt, ist er falsch.
  const jerusalem = punkte.jerusalem.text;
  pruefe('Levante-Karte: Jerusalem nennt alle drei Religionen',
    ['Judentum', 'Christentum', 'Islam'].every((wort) => jerusalem.includes(wort)));
  // Und es nennt beide Ansprüche auf die Stadt — nur einen zu nennen wäre
  // hier schon eine Aussage.
  pruefe('Levante-Karte: Jerusalem nennt beide Ansprüche auf die Stadt',
    jerusalem.includes('Israel') && jerusalem.includes('Palästinenser'));
  // Lage: Gaza an der Küste im Südwesten, Hebron im Bergland östlich davon,
  // Haifa im Norden.
  pruefe('Levante-Karte: Gaza liegt westlich von Hebron', punkte.gaza.x < punkte.hebron.x);
  pruefe('Levante-Karte: Haifa liegt nördlich von Tel Aviv', punkte.haifa.y < punkte['tel-aviv'].y);
  pruefe('Levante-Karte: Jerusalem liegt östlich von Tel Aviv',
    punkte.jerusalem.x > punkte['tel-aviv'].x);

  // --- 6. Beschriftungen -------------------------------------------------
  const beschriftungen = karte.beschriftungen || [];
  const texte = beschriftungen.map((b) => b.text);
  for (const name of [
    'Israel', 'Westjordanland', 'Gazastreifen', 'Jordanien', 'Ägypten',
    'Libanon', 'Syrien', 'Sinai', 'Totes Meer', 'Mittelmeer',
  ]) {
    pruefe(`Levante-Karte: „${name}" ist beschriftet`, texte.includes(name));
  }
  pruefe('Levante-Karte: es gibt Beschriftungen für Land und Meer', (() => {
    const arten = new Set(beschriftungen.map((b) => b.art));
    return arten.has('land') && arten.has('meer');
  })());

  // --- 7. Zusammenspiel mit dem Lernformat -------------------------------
  pruefe('Lernformat: „Israel und Palästina" zeigt den Karten-Abschnitt',
    abschnitteFuer(thema).some((a) => a.id === 'karte'));
  pruefe('Lernformat: der Karten-Abschnitt steht direkt hinter dem Aufhänger',
    abschnitteFuer(thema).findIndex((a) => a.id === 'karte') === 1);

  // --- 8. Das Modul selbst -----------------------------------------------
  // Runde 7 legt nur die israelisch-jüdische Sicht an (Opus); die
  // palästinensisch-arabische ergänzt Hermes danach. Beide sind gleichwertig,
  // die Reihenfolge ist keine Wertung.
  pruefe('„Israel und Palästina": die israelische Sichtweise stammt von Opus', (() => {
    const israelisch = thema.perspektiven.find((p) => p.id === 'israelisch');
    return Boolean(israelisch) && israelisch.stimme === 'Opus';
  })());
  const sicht = thema.perspektiven[0].text;
  pruefe('„Israel und Palästina": die Perspektive gibt sich als Sichtweise zu erkennen',
    sicht.includes('So wird die Geschichte dieses Landes aus israelisch-jüdischer Sicht'));
  pruefe('„Israel und Palästina": die Perspektive öffnet die Tür zur zweiten Stimme',
    sicht.includes('zweiten Stimme'));

  // Die Fairness-Zusagen aus notizen/israel-palaestina.md, hier als Prüfung.
  // Eine Erzählung, die diese Stellen auslässt, wäre in dieser App wertlos —
  // deshalb steht es im Test und nicht nur im Kommentar.
  pruefe('„Israel und Palästina": die Perspektive sagt, dass das Land nicht leer war',
    sicht.includes('Das Land war nicht leer'));
  pruefe('„Israel und Palästina": die Perspektive benennt die Nakba beim Namen',
    sicht.includes('Nakba'));
  pruefe('„Israel und Palästina": die Perspektive nennt die rund 700 000 Vertriebenen',
    sicht.includes('700 000'));
  pruefe('„Israel und Palästina": die Perspektive nennt die rund 850 000 jüdischen Flüchtlinge',
    sicht.includes('850 000'));
  pruefe('„Israel und Palästina": die Perspektive gibt die arabische Begründung von 1947 wieder',
    sicht.includes('ohne ihre Zustimmung'));
  pruefe('„Israel und Palästina": die Perspektive nennt die Besatzung nach 1967',
    sicht.includes('besetzt'));

  // Hermes hat die palästinensische Sicht ergänzt; die Synthese führt beide
  // Narrative gleichwertig zusammen (Grundsatz aus notizen/israel-palaestina.md).
  pruefe('„Israel und Palästina": die palästinensische Sichtweise stammt von Hermes', (() => {
    const pal = thema.perspektiven.find((p) => p.id === 'palestaenisch');
    return Boolean(pal) && pal.stimme === 'Hermes';
  })());
  pruefe('„Israel und Palästina": die Synthese führt beide Narrative zusammen',
    thema.synthese.includes('jüdische') && thema.synthese.includes('palästinensische'));

  pruefe('„Israel und Palästina" hat 3 bis 5 Quizfragen',
    thema.quiz.length >= 3 && thema.quiz.length <= 5);
  pruefe('„Israel und Palästina": jede Quizfrage hat eine gültige richtige Antwort',
    thema.quiz.every((f) => typeof f.antworten[f.richtig] === 'string'));
  pruefe('„Israel und Palästina": jede Quizfrage wird ausführlich erklärt',
    thema.quiz.every((f) => f.erklaerung.trim().length > 80));
  // Bei diesem Thema müssen die Quizfragen Wissensfragen sein und keine
  // Meinungsfragen — eine Frage nach „wer hat recht" hätte hier nichts zu
  // suchen.
  pruefe('„Israel und Palästina": keine Quizfrage fragt nach Schuld oder Recht',
    thema.quiz.every((f) => !/wer hat recht|schuld|wem gehört/i.test(f.frage)));

  pruefe('„Israel und Palästina": das Urteil ist offen gestellt', thema.urteil.frage.includes('?'));
  pruefe('„Israel und Palästina": das Urteil erlaubt ausdrücklich, sich nicht zu entscheiden',
    thema.urteil.hinweis.includes('nicht für eine Seite entscheiden'));
  pruefe('„Israel und Palästina" steht als Modul 5 hinter Japan',
    alleThemen[4] === thema && alleThemen[3].id === 'japan');
}
