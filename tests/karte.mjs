// Prüfungen für „Geschichte in Bewegung" — Karten-Schema, Kartengeometrie
// und die Karte des Römischen Reiches.
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe:
// läuft mit blankem `node`.
//
// Geprüft wird viererlei:
//   1. Der Karten-Prüfer selbst (pruefeKarte) — findet er Mängel überhaupt?
//   2. Die Rechenwerkzeuge aus utils/karte-geo.js.
//   3. Die Karte des Römischen Reiches — vollständig, im Bild, und
//      geografisch plausibel (Rom nördlich von Karthago und so weiter).
//   4. Das Zusammenspiel mit dem Lernformat.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { pruefeKarte, pruefeThema, KARTEN_PUNKT_TYPEN } = require('../utils/themen/schema.js');
const {
  KARTENFARBEN,
  erstelleProjektion,
  pfeilspitze,
  rueckwaerts,
  verbinde,
  zeichnePfad,
} = require('../utils/karte-geo.js');
const { themaNachId } = require('../utils/themen/index.js');
const { abschnitteFuer } = require('../utils/lernformat.js');

/** Eine kleine, gültige Karte als Ausgangspunkt für die Gegenproben. */
const GUTE_KARTE = {
  breite: 100,
  hoehe: 80,
  basis: [{ art: 'land', d: 'M 0 0 L 100 0 L 100 80 Z', fill: '#F3E6CD', stroke: 'none', strokeWidth: 0 }],
  phasen: [
    { id: 'frueh', label: '100 v. Chr.', flaechen: [{ titel: 'Kernland', d: 'M 10 10 L 30 10 L 30 30 Z' }] },
    { id: 'spaet', label: '100 n. Chr.', flaechen: [{ titel: 'Alles', d: 'M 5 5 L 60 5 L 60 60 Z' }] },
  ],
  punkte: [
    {
      id: 'hauptstadt',
      name: 'Hauptstadt',
      typ: 'stadt',
      x: 20,
      y: 20,
      text: 'Ein Hintergrundtext, der lang genug ist, um kein Platzhalter zu sein.',
    },
  ],
  bewegungen: [
    {
      id: 'zug',
      name: 'Ein Zug',
      von: [90, 10],
      ueber: [[60, 20]],
      nach: [20, 30],
      text: 'Auch dieser Text ist lang genug, um nicht als Platzhalter zu gelten.',
    },
  ],
  beschriftungen: [{ text: 'Meer', art: 'meer', x: 50, y: 70 }],
};

/** Karte kopieren und gezielt kaputt machen — für die Gegenproben. */
function kaputt(aenderung) {
  const kopie = JSON.parse(JSON.stringify(GUTE_KARTE));
  aenderung(kopie);
  return pruefeKarte(kopie).length > 0;
}

/**
 * Die Eckpunkte einer Fläche aus ihrem `d`-Attribut.
 *
 * Die Flächen bestehen nur aus M, C und Z. Bei „M x y C c1 c2 x y C …" ist
 * jedes dritte Zahlenpaar ein echter Eckpunkt, dazwischen liegen die
 * Kontrollpunkte der Rundung.
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
 * Der Kartenausschnitt der Rom-Karte, wie ihn utils/themen/karten/
 * roemisches-reich.js aufspannt. Steht hier noch einmal, damit die
 * Atlas-Gegenprobe unten rechnen kann — dass er stimmt, prüft der Test
 * über die daraus folgende Höhe.
 */
const ROM_RAHMEN = { minLon: -12, maxLon: 48, minLat: 22, maxLat: 58, breite: 700 };

/**
 * Wie viele SVG-Einheiten ein Längengrad breit ist — der Maßstab für die
 * Atlas-Gegenprobe.
 */
const EINHEITEN_JE_GRAD = ROM_RAHMEN.breite / (ROM_RAHMEN.maxLon - ROM_RAHMEN.minLon);

/**
 * @param {(name: string, ok: boolean) => void} pruefe Prüf-Funktion des Rahmens
 */
export function laufe(pruefe) {
  // --- 1. Der Karten-Prüfer muss Mängel auch wirklich finden -------------
  pruefe('Karten-Prüfer lässt eine vollständige Karte durch', pruefeKarte(GUTE_KARTE).length === 0);
  pruefe('Karten-Prüfer meldet Nicht-Objekte', pruefeKarte(null).length > 0);
  pruefe('Karten-Prüfer meldet eine leere Karte', pruefeKarte({}).length > 0);

  pruefe('Karten-Prüfer meldet fehlende breite', kaputt((k) => { delete k.breite; }));
  pruefe('Karten-Prüfer meldet breite als Text', kaputt((k) => { k.breite = '100'; }));
  pruefe('Karten-Prüfer meldet hoehe von 0', kaputt((k) => { k.hoehe = 0; }));

  pruefe('Karten-Prüfer meldet leere basis', kaputt((k) => { k.basis = []; }));
  pruefe('Karten-Prüfer meldet basis-Teil ohne d', kaputt((k) => { delete k.basis[0].d; }));
  pruefe('Karten-Prüfer meldet basis-Teil ohne fill', kaputt((k) => { delete k.basis[0].fill; }));
  pruefe('Karten-Prüfer meldet negative strokeWidth', kaputt((k) => { k.basis[0].strokeWidth = -1; }));

  pruefe('Karten-Prüfer meldet nur eine Phase', kaputt((k) => { k.phasen = k.phasen.slice(0, 1); }));
  pruefe('Karten-Prüfer meldet fehlende phasen', kaputt((k) => { delete k.phasen; }));
  pruefe('Karten-Prüfer meldet doppelte Phasen-id', kaputt((k) => { k.phasen[1].id = k.phasen[0].id; }));
  pruefe('Karten-Prüfer meldet Phasen-id mit Umlaut', kaputt((k) => { k.phasen[0].id = 'frühe-zeit'; }));
  pruefe('Karten-Prüfer meldet Phase ohne label', kaputt((k) => { delete k.phasen[0].label; }));
  pruefe('Karten-Prüfer meldet Phase ohne flaechen', kaputt((k) => { k.phasen[0].flaechen = []; }));
  pruefe('Karten-Prüfer meldet Fläche ohne titel', kaputt((k) => { delete k.phasen[0].flaechen[0].titel; }));
  pruefe('Karten-Prüfer meldet Fläche ohne d', kaputt((k) => { delete k.phasen[0].flaechen[0].d; }));
  pruefe('Karten-Prüfer meldet leeren hinweis', kaputt((k) => { k.phasen[0].hinweis = '   '; }));

  pruefe('Karten-Prüfer meldet fehlende punkte', kaputt((k) => { k.punkte = []; }));
  pruefe('Karten-Prüfer meldet Punkt ohne text', kaputt((k) => { delete k.punkte[0].text; }));
  pruefe('Karten-Prüfer meldet Punkt mit Platzhaltertext', kaputt((k) => { k.punkte[0].text = 'kurz.'; }));
  pruefe('Karten-Prüfer meldet unbekannten Punkt-typ', kaputt((k) => { k.punkte[0].typ = 'vulkan'; }));
  pruefe('Karten-Prüfer meldet doppelte Punkt-id', kaputt((k) => { k.punkte.push({ ...k.punkte[0] }); }));
  pruefe('Karten-Prüfer meldet Punkt ohne Koordinaten', kaputt((k) => { delete k.punkte[0].x; }));
  pruefe('Karten-Prüfer meldet Punkt außerhalb der Karte', kaputt((k) => { k.punkte[0].x = 500; }));
  pruefe('Karten-Prüfer meldet Punkt über dem oberen Rand', kaputt((k) => { k.punkte[0].y = -3; }));

  pruefe('Karten-Prüfer meldet Bewegung ohne name', kaputt((k) => { delete k.bewegungen[0].name; }));
  pruefe('Karten-Prüfer meldet Bewegung ohne von', kaputt((k) => { delete k.bewegungen[0].von; }));
  pruefe('Karten-Prüfer meldet von mit nur einer Zahl', kaputt((k) => { k.bewegungen[0].von = [10]; }));
  pruefe('Karten-Prüfer meldet Bewegung ins Nirgendwo', kaputt((k) => { k.bewegungen[0].nach = [999, 999]; }));
  pruefe('Karten-Prüfer meldet Bewegung auf der Stelle', kaputt((k) => {
    k.bewegungen[0].nach = k.bewegungen[0].von.slice();
  }));
  pruefe('Karten-Prüfer meldet kaputten Zwischenpunkt', kaputt((k) => { k.bewegungen[0].ueber = [[5]]; }));
  pruefe('Karten-Prüfer meldet Bewegung ohne text', kaputt((k) => { delete k.bewegungen[0].text; }));
  pruefe('Karten-Prüfer meldet bewegungen als Nicht-Liste', kaputt((k) => { k.bewegungen = {}; }));

  pruefe('Karten-Prüfer meldet unbekannte Beschriftungs-art', kaputt((k) => { k.beschriftungen[0].art = 'gebirge'; }));
  pruefe('Karten-Prüfer meldet Beschriftung außerhalb der Karte', kaputt((k) => { k.beschriftungen[0].y = 900; }));
  pruefe('Karten-Prüfer meldet drehung als Text', kaputt((k) => { k.beschriftungen[0].drehung = 'schräg'; }));

  // Optionale Felder dürfen fehlen, ohne dass es beanstandet wird.
  pruefe('Karten-Prüfer lässt eine Karte ohne bewegungen durch', (() => {
    const ohne = JSON.parse(JSON.stringify(GUTE_KARTE));
    delete ohne.bewegungen;
    delete ohne.beschriftungen;
    return pruefeKarte(ohne).length === 0;
  })());

  // --- 1b. Der Themen-Prüfer nimmt die Karte mit -------------------------
  const rom = themaNachId('roemisches-reich');
  pruefe('Themen-Prüfer beanstandet ein Thema mit kaputter Karte',
    pruefeThema({ ...rom, karte: { breite: 10 } }).length > 0);
  pruefe('Themen-Prüfer lässt ein Thema ganz ohne Karte durch', (() => {
    const ohne = { ...rom };
    delete ohne.karte;
    return pruefeThema(ohne).length === 0;
  })());

  // --- 2. Die Rechenwerkzeuge aus utils/karte-geo.js ---------------------
  const geo = erstelleProjektion({ minLon: -12, maxLon: 48, minLat: 22, maxLat: 58, breite: 700 });
  pruefe('Geo: die linke Kante liegt bei x = 0', geo.x(-12) === 0);
  pruefe('Geo: die rechte Kante liegt bei x = breite', geo.x(48) === 700);
  pruefe('Geo: der obere Rand liegt bei y = 0', geo.y(58) === 0);
  pruefe('Geo: die Höhe folgt aus der Breitengrad-Korrektur', geo.hoehe > 0 && geo.hoehe < 700);
  pruefe('Geo: östlicher heißt weiter rechts', geo.x(20) > geo.x(10));
  pruefe('Geo: nördlicher heißt weiter oben', geo.y(50) < geo.y(40));
  pruefe('Geo: punkt() liefert ein Zahlenpaar', (() => {
    const [x, y] = geo.punkt(12.5, 41.9);
    return typeof x === 'number' && typeof y === 'number';
  })());

  pruefe('Geo: ein leerer Pfad bleibt leer', zeichnePfad([]) === '');
  pruefe('Geo: ein Punkt ergibt nur ein M', zeichnePfad([[1, 2]]) === 'M 1 2');
  pruefe('Geo: ein eckiger Pfad wird geschlossen', zeichnePfad([[0, 0], [10, 0], [10, 10]], { rund: false }).endsWith('Z'));
  pruefe('Geo: ein offener Pfad wird nicht geschlossen',
    !zeichnePfad([[0, 0], [10, 0]], { geschlossen: false, rund: false }).endsWith('Z'));
  pruefe('Geo: gerundete Pfade nutzen Bézier-Kurven',
    zeichnePfad([[0, 0], [10, 0], [10, 10], [0, 10]]).includes('C'));

  pruefe('Geo: rueckwaerts dreht die Reihenfolge um',
    JSON.stringify(rueckwaerts([[1, 1], [2, 2]])) === JSON.stringify([[2, 2], [1, 1]]));
  pruefe('Geo: rueckwaerts lässt das Original in Ruhe', (() => {
    const original = [[1, 1], [2, 2]];
    rueckwaerts(original);
    return original[0][0] === 1;
  })());
  pruefe('Geo: verbinde überspringt die doppelte Nahtstelle',
    verbinde([[0, 0], [1, 1]], [[1, 1], [2, 2]]).length === 3);

  const spitze = pfeilspitze([0, 0], [100, 0]);
  pruefe('Geo: eine Pfeilspitze hat drei Ecken', spitze.length === 3);
  pruefe('Geo: die Pfeilspitze sitzt am Ende der Strecke', spitze[0][0] === 100 && spitze[0][1] === 0);
  pruefe('Geo: die Flanken der Pfeilspitze liegen hinter der Spitze',
    spitze[1][0] < 100 && spitze[2][0] < 100);
  pruefe('Geo: die Flanken liegen symmetrisch zur Achse',
    Math.abs(spitze[1][1] + spitze[2][1]) < 0.001);

  pruefe('Geo: es gibt für jede Bewegung eine eigene Farbe', KARTENFARBEN.bewegung.length >= 3);

  // --- 3. Die Karte des Römischen Reiches --------------------------------
  const karte = rom.karte;
  pruefe('„Römisches Reich" bringt eine Karte mit', Boolean(karte));
  pruefe('Rom-Karte: erfüllt das Karten-Schema', pruefeKarte(karte).length === 0);
  pruefe('Rom-Karte: hat mindestens 3 Phasen', karte.phasen.length >= 3);
  pruefe('Rom-Karte: hat 4 bis 6 Info-Punkte', karte.punkte.length >= 4 && karte.punkte.length <= 6);
  pruefe('Rom-Karte: hat 2 bis 3 Bewegungen',
    karte.bewegungen.length >= 2 && karte.bewegungen.length <= 3);
  pruefe('Rom-Karte: jeder Punkt-typ ist ein bekannter',
    karte.punkte.every((p) => KARTEN_PUNKT_TYPEN.includes(p.typ)));

  // Die Phasen aus dem Auftrag des Betreibers.
  const labels = karte.phasen.map((p) => p.label);
  for (const jahr of ['264 v. Chr.', '117 n. Chr.', '476 n. Chr.']) {
    pruefe(`Rom-Karte: die Phase „${jahr}" ist da`, labels.includes(jahr));
  }

  // Die Erzählung muss in der Geometrie stecken: erst wachsen, dann
  // schrumpfen. Sonst zeigt die Karte etwas anderes als der Text sagt.
  const nachLabel = (label) => karte.phasen.find((p) => p.label === label);
  const anfang = groesseDerPhase(nachLabel('264 v. Chr.'));
  const hoehepunkt = groesseDerPhase(nachLabel('117 n. Chr.'));
  const ende = groesseDerPhase(nachLabel('476 n. Chr.'));
  pruefe('Rom-Karte: 117 n. Chr. ist deutlich größer als 264 v. Chr.', hoehepunkt > anfang * 5);
  pruefe('Rom-Karte: 476 n. Chr. ist kleiner als der Höhepunkt', ende < hoehepunkt);
  pruefe('Rom-Karte: 264 v. Chr. zeigt nur Italien', nachLabel('264 v. Chr.').flaechen.length === 1);

  // Alles muss im Bild liegen — ein Punkt außerhalb wäre unantippbar.
  const imBild = ([x, y]) => x >= 0 && x <= karte.breite && y >= 0 && y <= karte.hoehe;
  pruefe('Rom-Karte: alle Info-Punkte liegen im Bild',
    karte.punkte.every((p) => imBild([p.x, p.y])));
  pruefe('Rom-Karte: alle Bewegungen liegen im Bild',
    karte.bewegungen.every((b) => [b.von, b.nach, ...(b.ueber || [])].every(imBild)));

  // Geografie-Gegenprobe: Die Karte soll erkennbar sein (Vorgabe des
  // Betreibers). Wenn die Städte richtig zueinander liegen, stimmt die
  // Projektion — und damit auch die Küsten, die aus denselben Daten kommen.
  const ort = Object.fromEntries(karte.punkte.map((p) => [p.id, p]));
  pruefe('Rom-Karte: Rom liegt nördlich von Karthago', ort.rom.y < ort.karthago.y);
  pruefe('Rom-Karte: Karthago liegt westlich von Alexandria', ort.karthago.x < ort.alexandria.x);
  pruefe('Rom-Karte: Konstantinopel liegt östlich von Rom', ort.konstantinopel.x > ort.rom.x);
  pruefe('Rom-Karte: Alexandria liegt südlich von Konstantinopel',
    ort.alexandria.y > ort.konstantinopel.y);
  pruefe('Rom-Karte: der Limes liegt nördlich von Rom', ort.limes.y < ort.rom.y);

  // --- 3b. Atlas-Gegenprobe: liegt die Küste da, wo sie hingehört? -------
  // Die Vorgabe des Betreibers lautet: Die Regionen müssen erkennbar sein,
  // keine abstrakte Skizze. Das lässt sich prüfen — die Küstenlinien stehen
  // im Themen-Modul als echte Längen-/Breitengrade. Wenn bekannte Kaps und
  // Meerengen auf der gezeichneten Küste liegen, ist die Karte ein Atlas
  // und keine Fantasie. Eine geratene Skizze fiele hier durch.
  const romGeo = erstelleProjektion(ROM_RAHMEN);
  pruefe('Rom-Karte: die Höhe passt zum angenommenen Ausschnitt', romGeo.hoehe === karte.hoehe);
  pruefe('Rom-Karte: die Breite passt zum angenommenen Ausschnitt', romGeo.breite === karte.breite);

  // Alle Eckpunkte der Küsten- und Flusslinien (ohne die Meeresfläche im
  // Hintergrund, die nur der Rahmen ist).
  const kuestenpunkte = karte.basis
    .filter((teil) => teil.art !== 'grund')
    .flatMap((teil) => eckpunkte(teil.d));
  pruefe('Rom-Karte: es gibt Küstenlinien zu prüfen', kuestenpunkte.length > 100);

  /** Abstand einer geografischen Landmarke zur nächsten gezeichneten Küste. */
  const abstandZurKueste = (lon, lat) => {
    const [x, y] = romGeo.punkt(lon, lat);
    return kuestenpunkte.reduce(
      (naechster, [kx, ky]) => Math.min(naechster, Math.hypot(kx - x, ky - y)),
      Infinity,
    );
  };

  // Ein Grad Toleranz — genug für eine vereinfachte Schulatlas-Küste, zu
  // wenig für eine Karte, die die Geografie nur behauptet.
  const TOLERANZ = EINHEITEN_JE_GRAD;
  const landmarken = [
    ['die Straße von Gibraltar', -5.6, 36.0],
    ['die Stiefelspitze Kalabriens', 15.6, 38.0],
    ['der Absatz Apuliens bei Otranto', 18.5, 40.1],
    ['Kap Matapan am Peloponnes', 22.5, 36.4],
    ['der Bosporus', 29.0, 41.0],
    ['das Nildelta', 31.6, 31.4],
    ['Land’s End in Britannien', -5.7, 50.1],
    ['die Nordspitze Jütlands', 10.5, 57.7],
  ];
  for (const [name, lon, lat] of landmarken) {
    pruefe(`Rom-Karte: ${name} liegt auf der gezeichneten Küste`,
      abstandZurKueste(lon, lat) < TOLERANZ);
  }
  // Gegenprobe zur Gegenprobe: Mitten im Meer darf keine Küste sein, sonst
  // wäre der Test durch schiere Punktdichte immer erfüllt.
  pruefe('Rom-Karte: mitten im Mittelmeer liegt keine Küste',
    abstandZurKueste(17.0, 34.5) > TOLERANZ * 2);

  pruefe('Rom-Karte: die Hunnen kommen von Osten',
    (() => {
      const hunnen = karte.bewegungen.find((b) => b.id === 'hunnen');
      return Boolean(hunnen) && hunnen.von[0] > hunnen.nach[0];
    })());

  pruefe('Rom-Karte: es gibt Beschriftungen für Land und Meer', (() => {
    const arten = new Set((karte.beschriftungen || []).map((b) => b.art));
    return arten.has('land') && arten.has('meer');
  })());
  pruefe('Rom-Karte: das Mittelmeer ist beschriftet',
    (karte.beschriftungen || []).some((b) => b.text === 'Mittelmeer'));

  // --- 4. Zusammenspiel mit dem Lernformat -------------------------------
  pruefe('Lernformat: „Römisches Reich" zeigt den Karten-Abschnitt',
    abschnitteFuer(rom).some((a) => a.id === 'karte'));
  pruefe('Lernformat: der Karten-Abschnitt steht direkt hinter dem Aufhänger',
    abschnitteFuer(rom).findIndex((a) => a.id === 'karte') === 1);
  pruefe('Lernformat: ein Thema ohne Karte überspringt den Abschnitt', (() => {
    const ohne = { ...rom };
    delete ohne.karte;
    return !abschnitteFuer(ohne).some((a) => a.id === 'karte');
  })());
  pruefe('Lernformat: eine Karte mit nur einer Phase zählt nicht als Bewegung',
    !abschnitteFuer({ ...rom, karte: { ...karte, phasen: karte.phasen.slice(0, 1) } })
      .some((a) => a.id === 'karte'));
}
