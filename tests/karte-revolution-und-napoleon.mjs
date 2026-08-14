// Prüfungen für die Karte zum Thema „Revolution und Napoleon" — und für das,
// was das Themen-Modul an der Karte hängen hat.
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe:
// läuft mit blankem `node`.
//
// Das Karten-Schema und die Rechenwerkzeuge aus utils/karte-geo.js prüft
// tests/karte.mjs — hier geht es nur um diese eine Karte:
//   1. Vollständigkeit und Aufbau (Phasen, Punkte, Bewegungen, Beschriftungen).
//   2. Atlas-Gegenprobe: Liegen bekannte Kaps, Häfen und Buchten von Lissabon
//      bis Rostow am Don auf der gezeichneten Küste? Und liegt mitten im
//      Binnenland oder auf offener See keine?
//   3. Die Aussage steckt in der Geometrie: Das französische Gebiet wächst von
//      1789 bis 1812 und ist 1815 wieder so groß wie am Anfang; Polen-Litauen
//      steht 1789 auf der Karte und danach nie wieder; Russland wächst über
//      alle drei Phasen. Und die zentrale Festlegung des Kapitels als Rechnung:
//      Moskau liegt in KEINER Phase im französischen Gebiet, wohl aber in jeder
//      im russischen — ein Heer, das in einer Stadt steht, hat sie nicht
//      erobert.
//   4. Die Bewegungen hängen an den Info-Punkten: der Vormarsch von 1812 endet
//      in Moskau, der Rückzug beginnt dort, der Weg von Elba endet in Waterloo.
//   5. TONE-REGEL für sensible Themen (CLAUDE.md): Die Perspektive muss ihre
//      unbequemen Stellen selbst benennen (Terror, Guillotine, die
//      Wiedereinführung der Sklaverei 1802, der Kaiser und Kriegsherr), die
//      Beweggründe der anderen Seite fair wiedergeben — und weder Karte noch
//      Quiz dürfen nach Schuld fragen.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { pruefeKarte, KARTEN_PUNKT_TYPEN } = require('../utils/themen/schema.js');
const { erstelleProjektion } = require('../utils/karte-geo.js');
const { themaNachId, alleThemen } = require('../utils/themen/index.js');
const { abschnitteFuer } = require('../utils/lernformat.js');

/**
 * Der Kartenausschnitt, wie ihn utils/themen/karten/revolution-und-napoleon.js
 * aufspannt. Steht hier noch einmal, damit die Atlas-Gegenprobe unten rechnen
 * kann — dass er stimmt, prüft der Test über die daraus folgende Höhe.
 */
const RAHMEN = { minLon: -10, maxLon: 40, minLat: 35, maxLat: 57, breite: 700 };

/** Wie viele SVG-Einheiten ein Längengrad breit ist — der Maßstab der Probe. */
const EINHEITEN_JE_GRAD = RAHMEN.breite / (RAHMEN.maxLon - RAHMEN.minLon);

/**
 * Die Eckpunkte eines Pfades aus seinem `d`-Attribut.
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
 * Die einzelnen geschlossenen Ringe eines Pfades.
 *
 * Eine Fläche wie „das französische Kaiserreich" besteht aus mehreren
 * Teilpfaden (Hauptblock, Illyrien, Korsika). Für die Punkt-im-Vieleck-Probe
 * müssen sie getrennt bleiben — sonst käme aus drei Ringen ein Zickzack.
 *
 * @param {string} d
 * @returns {Array<Array<Array<number>>>}
 */
function ringe(d) {
  return d
    .split('M')
    .slice(1)
    .map((teil) => eckpunkte(`M${teil}`));
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
    .reduce((summe, f) => summe + ringe(f.d).reduce((t, r) => t + flaecheninhalt(r), 0), 0);
}

/** Liegt ein Punkt in einem Vieleck? (Strahlensatz-Verfahren) */
function imVieleck([x, y], ring) {
  let drin = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) drin = !drin;
  }
  return drin;
}

/**
 * @param {(name: string, ok: boolean) => void} pruefe Prüf-Funktion des Rahmens
 */
export function laufe(pruefe) {
  const thema = themaNachId('revolution-und-napoleon');
  pruefe('„Revolution und Napoleon" ist als Thema registriert', Boolean(thema));
  const karte = thema.karte;
  pruefe('„Revolution und Napoleon" bringt eine Karte mit', Boolean(karte));

  // --- 1. Aufbau ---------------------------------------------------------
  pruefe('Napoleon-Karte: erfüllt das Karten-Schema', pruefeKarte(karte).length === 0);
  pruefe('Napoleon-Karte: hat mindestens 3 Phasen', karte.phasen.length >= 3);
  pruefe('Napoleon-Karte: hat genau 3 Phasen — 1789, 1805–1812, 1815', karte.phasen.length === 3);
  pruefe('Napoleon-Karte: hat 6 bis 7 Info-Punkte',
    karte.punkte.length >= 6 && karte.punkte.length <= 7);
  pruefe('Napoleon-Karte: hat 2 bis 4 Bewegungen',
    karte.bewegungen.length >= 2 && karte.bewegungen.length <= 4);
  pruefe('Napoleon-Karte: jeder Punkt-typ ist ein bekannter',
    karte.punkte.every((punkt) => KARTEN_PUNKT_TYPEN.includes(punkt.typ)));
  pruefe('Napoleon-Karte: jeder Info-Punkt hat einen ausgeführten Text',
    karte.punkte.every((punkt) => punkt.text.trim().length > 200));
  pruefe('Napoleon-Karte: jede Bewegung hat einen ausgeführten Text',
    karte.bewegungen.every((b) => b.text.trim().length > 200));
  pruefe('Napoleon-Karte: jede Phase erklärt sich in einem Hinweis',
    karte.phasen.every((p) => typeof p.hinweis === 'string' && p.hinweis.length > 40));
  pruefe('Napoleon-Karte: die Phasen-ids sind eindeutig',
    new Set(karte.phasen.map((p) => p.id)).size === karte.phasen.length);

  // Die drei Stationen des Kapitels.
  const labels = karte.phasen.map((p) => p.label).join(' | ');
  for (const jahr of ['1789', '1805', '1812', '1815']) {
    pruefe(`Napoleon-Karte: die Jahreszahl ${jahr} steht auf dem Umschalter`, labels.includes(jahr));
  }

  // Alles muss im Bild liegen — ein Punkt außerhalb wäre unantippbar.
  const imBild = ([x, y]) => x >= 0 && x <= karte.breite && y >= 0 && y <= karte.hoehe;
  pruefe('Napoleon-Karte: alle Info-Punkte liegen im Bild',
    karte.punkte.every((punkt) => imBild([punkt.x, punkt.y])));
  pruefe('Napoleon-Karte: alle Bewegungen liegen im Bild',
    karte.bewegungen.every((b) => [b.von, b.nach, ...(b.ueber || [])].every(imBild)));
  pruefe('Napoleon-Karte: alle Beschriftungen liegen im Bild',
    (karte.beschriftungen || []).every((b) => imBild([b.x, b.y])));

  // --- 2. Die Erzählung steckt in der Geometrie --------------------------
  const [phase1789, phase1812, phase1815] = karte.phasen;

  // Das französische Gebiet heißt 1789 und 1815 „Königreich Frankreich",
  // dazwischen „das französische Kaiserreich": wachsen, dann zurück auf Anfang.
  const FRANKREICH = /Königreich Frankreich|französische Kaiserreich/;
  const franz = karte.phasen.map((p) => groesseVon(p, FRANKREICH));
  pruefe('Napoleon-Karte: das französische Gebiet ist 1812 deutlich größer als 1789',
    franz[0] > 0 && franz[1] > franz[0] * 1.3);
  pruefe('Napoleon-Karte: 1815 steht Frankreich wieder in seinen alten Grenzen',
    franz[2] < franz[1] && Math.abs(franz[2] - franz[0]) < franz[0] * 0.05);

  // Polen-Litauen steht 1789 da — und danach nie wieder. Das ist die Aussage.
  pruefe('Napoleon-Karte: 1789 steht Polen-Litauen auf der Karte',
    groesseVon(phase1789, /Polen-Litauen/) > 0);
  pruefe('Napoleon-Karte: nach den Teilungen gibt es Polen-Litauen nicht mehr',
    groesseVon(phase1812, /Polen-Litauen/) === 0 && groesseVon(phase1815, /Polen-Litauen/) === 0);
  pruefe('Napoleon-Karte: das Herzogtum Warschau steht nur auf der mittleren Phase',
    groesseVon(phase1789, /Herzogtum Warschau/) === 0 &&
    groesseVon(phase1812, /Herzogtum Warschau/) > 0 &&
    groesseVon(phase1815, /Herzogtum Warschau/) === 0);

  // Der Rheinbund entsteht 1806 und zerfällt 1813; der Deutsche Bund folgt 1815.
  pruefe('Napoleon-Karte: der Rheinbund steht nur auf der mittleren Phase',
    groesseVon(phase1789, /Rheinbund/) === 0 &&
    groesseVon(phase1812, /Rheinbund/) > 0 &&
    groesseVon(phase1815, /Rheinbund/) === 0);
  pruefe('Napoleon-Karte: der Deutsche Bund steht erst 1815 auf der Karte',
    groesseVon(phase1789, /Deutschen Bundes/) === 0 &&
    groesseVon(phase1812, /Deutschen Bundes/) === 0 &&
    groesseVon(phase1815, /Deutschen Bundes/) > 0);
  pruefe('Napoleon-Karte: die Republik Venedig steht nur 1789 auf der Karte',
    groesseVon(phase1789, /Republik Venedig/) > 0 &&
    groesseVon(phase1812, /Republik Venedig/) === 0 &&
    groesseVon(phase1815, /Republik Venedig/) === 0);

  // Russland wächst über alle drei Phasen: Teilungen Polens, Bessarabien 1812,
  // Kongresspolen 1815.
  const russ = karte.phasen.map((p) => groesseVon(p, /Das Russische Reich/));
  pruefe('Napoleon-Karte: das russische Gebiet wächst über alle drei Phasen',
    russ[0] > 0 && russ[1] > russ[0] && russ[2] > russ[1]);

  // --- 3. Die zentrale Festlegung als Rechnung ---------------------------
  const geo = erstelleProjektion(RAHMEN);
  pruefe('Napoleon-Karte: die Höhe passt zum angenommenen Ausschnitt', geo.hoehe === karte.hoehe);
  pruefe('Napoleon-Karte: die Breite passt zum angenommenen Ausschnitt', geo.breite === karte.breite);

  /** Liegt ein geografischer Ort in einer Fläche dieser Phase? */
  const liegtIn = (phase, muster, lon, lat) => {
    const punkt = geo.punkt(lon, lat);
    return phase.flaechen
      .filter((f) => muster.test(f.titel))
      .some((f) => ringe(f.d).some((ring) => imVieleck(punkt, ring)));
  };

  pruefe('Napoleon-Karte: Moskau liegt in jeder Phase im russischen Gebiet',
    karte.phasen.every((p) => liegtIn(p, /Das Russische Reich/, 37.62, 55.75)));
  // Der Kern des Kapitels: Napoleon stand 1812 in Moskau — einverleibt war die
  // Stadt nie. Deshalb ist der Feldzug ein Pfeil und keine Fläche.
  pruefe('Napoleon-Karte: Moskau liegt in KEINER Phase im französischen Gebiet',
    karte.phasen.every((p) => !liegtIn(p, FRANKREICH, 37.62, 55.75)));
  pruefe('Napoleon-Karte: Rom liegt 1812 im einverleibten Gebiet',
    liegtIn(phase1812, /französische Kaiserreich/, 12.48, 41.9));
  pruefe('Napoleon-Karte: Utrecht liegt 1812 im einverleibten Gebiet',
    liegtIn(phase1812, /französische Kaiserreich/, 5.12, 52.09));
  pruefe('Napoleon-Karte: Ajaccio auf Korsika gehört 1789 wie 1812 zu Frankreich',
    liegtIn(phase1789, FRANKREICH, 8.74, 41.95) &&
    liegtIn(phase1812, /französische Kaiserreich/, 8.74, 41.95));
  pruefe('Napoleon-Karte: Berlin liegt 1812 nicht im einverleibten Gebiet',
    !liegtIn(phase1812, /französische Kaiserreich/, 13.4, 52.52));
  pruefe('Napoleon-Karte: Wien liegt 1812 im Kaisertum Österreich',
    liegtIn(phase1812, /Kaisertum Österreich/, 16.37, 48.21));

  // Das Reich ist eine Linie, keine Fläche — dieselbe Festlegung wie auf der
  // Karte zum Dreißigjährigen Krieg.
  const alleTitel = karte.phasen.flatMap((p) => p.flaechen.map((f) => f.titel)).join(' | ');
  pruefe('Napoleon-Karte: keine Fläche heißt „Heiliges Römisches Reich"',
    !/Heiliges Römisches Reich/.test(alleTitel));
  const reichslinie = karte.basis.find((teil) => teil.art === 'reichsgrenze');
  pruefe('Napoleon-Karte: die Reichsgrenze liegt als Linie im Untergrund',
    Boolean(reichslinie) && reichslinie.fill === 'none' && !reichslinie.d.trim().endsWith('Z'));
  pruefe('Napoleon-Karte: der Hinweis von 1789 sagt selbst, dass das Reich keine Fläche ist',
    phase1789.hinweis.includes('dreihundert') && phase1789.hinweis.includes('Linie'));
  pruefe('Napoleon-Karte: der Hinweis von 1812 benennt Moskau als das, was es nicht war',
    phase1812.hinweis.includes('Moskau') && phase1812.hinweis.includes('einverleibt'));
  pruefe('Napoleon-Karte: der Hinweis von 1812 sagt, dass „beherrscht" nicht „befriedet" heißt',
    phase1812.hinweis.includes('befriedet'));
  pruefe('Napoleon-Karte: der Hinweis von 1815 benennt die Vereinfachung beim Deutschen Bund',
    phase1815.hinweis.includes('39') && phase1815.hinweis.includes('zusammengefasst'));

  // --- 4. Atlas-Gegenprobe -----------------------------------------------
  const kuestenpunkte = karte.basis
    .filter((teil) => teil.art === 'land')
    .flatMap((teil) => eckpunkte(teil.d));
  pruefe('Napoleon-Karte: es gibt Küstenlinien zu prüfen', kuestenpunkte.length > 400);

  /** Abstand einer geografischen Landmarke zur nächsten gezeichneten Küste. */
  const abstandZurKueste = (lon, lat) => {
    const [x, y] = geo.punkt(lon, lat);
    return kuestenpunkte.reduce(
      (naechster, [kx, ky]) => Math.min(naechster, Math.hypot(kx - x, ky - y)),
      Infinity,
    );
  };

  // Toleranz ein voller Längengrad — 14 SVG-Einheiten. Diese Karte spannt 50
  // Längengrade auf 700 Einheiten und ist damit gröber als die vier
  // Europakarten (die mit 0,6 Grad auskommen). Die Werte unten liegen
  // absichtlich mindestens 0,1 Grad NEBEN dem nächsten Eckpunkt des
  // Kartenmoduls, damit die gezeichnete Linie geprüft wird und nicht die
  // abgeschriebene Zahl.
  const TOLERANZ = EINHEITEN_JE_GRAD;
  const landmarken = [
    ['Kap Trafalgar', -6.03, 36.18],
    ['Cartagena', -0.98, 37.6],
    ['Almería', -2.46, 36.83],
    ['Palma auf Mallorca', 2.65, 39.57],
    ['Nizza', 7.27, 43.7],
    ['La Spezia', 9.83, 44.1],
    ['Olbia auf Sardinien', 9.5, 40.92],
    ['Neapel', 14.27, 40.85],
    ['Salerno', 14.77, 40.68],
    ['Venedig', 12.34, 45.44],
    ['Zadar an der dalmatinischen Küste', 15.23, 44.12],
    ['Chania auf Kreta', 24.02, 35.51],
    ['Smyrna', 27.14, 38.42],
    ['Larnaka auf Zypern', 33.63, 34.92],
    ['Burgas am Schwarzen Meer', 27.47, 42.5],
    ['Sewastopol auf der Krim', 33.53, 44.62],
    ['Rostow am Don', 39.7, 47.2],
    ['Tanger', -5.8, 35.79],
    ['Lissabon', -9.14, 38.71],
    ['Bilbao', -2.93, 43.26],
    ['Royan an der Gironde', -1.16, 45.7],
    ['Brest in der Bretagne', -4.49, 48.39],
    ['Calais', 1.85, 50.96],
    ['Rotterdam', 4.29, 51.92],
    ['Bremerhaven', 8.58, 53.54],
    ['Malmö', 13.0, 55.6],
    ['Dover', 1.31, 51.13],
    ['der Firth of Forth bei Edinburgh', -3.0, 56.02],
    ['Cork in Irland', -8.47, 51.85],
    ['Galway in Irland', -9.05, 53.27],
  ];
  for (const [name, lon, lat] of landmarken) {
    pruefe(`Napoleon-Karte: ${name} liegt auf der gezeichneten Küste`,
      abstandZurKueste(lon, lat) < TOLERANZ);
  }

  // Und die Gegenprobe zur Gegenprobe: Keiner dieser Orte darf zugleich ein
  // Eckpunkt des Kartenmoduls sein, sonst prüft der Test seine eigene Vorlage.
  pruefe('Napoleon-Karte: keine Landmarke ist als Eckpunkt abgeschrieben',
    landmarken.every(([, lon, lat]) => abstandZurKueste(lon, lat) > EINHEITEN_JE_GRAD * 0.1));

  // Im Binnenland und auf offener See darf keine Küste liegen, sonst wäre der
  // Test durch schiere Punktdichte immer erfüllt.
  const abseits = [
    ['mitten in Zentralfrankreich', 2.5, 46.5],
    ['auf der kastilischen Hochebene', -4.0, 41.0],
    ['mitten in Ungarn', 19.5, 47.0],
    ['zwischen Njemen und Düna', 28.0, 53.5],
    ['im Umland von Moskau', 37.0, 55.0],
    ['mitten im offenen Atlantik', -8.0, 47.0],
    ['mitten im offenen Mittelmeer', 6.0, 38.5],
    ['mitten in der Nordsee', 3.0, 55.0],
    ['mitten in Anatolien', 33.0, 39.0],
    ['mitten in Polen', 20.0, 52.0],
    ['in Bayern', 11.5, 48.8],
    ['in der Ukraine', 30.0, 49.5],
  ];
  for (const [wo, lon, lat] of abseits) {
    pruefe(`Napoleon-Karte: ${wo} liegt keine Küste`,
      abstandZurKueste(lon, lat) > TOLERANZ * 2);
  }

  // --- 5. Der Untergrund ---------------------------------------------------
  pruefe('Napoleon-Karte: jede Landmasse ist ein geschlossener Pfad',
    karte.basis.filter((teil) => teil.art === 'land').every((teil) => teil.d.trim().endsWith('Z')));
  pruefe('Napoleon-Karte: mindestens zwölf Landmassen und Inseln sind gezeichnet',
    karte.basis.filter((teil) => teil.art === 'land').length >= 12);
  pruefe('Napoleon-Karte: mindestens zwölf Flüsse sind gezeichnet',
    karte.basis.filter((teil) => teil.art === 'fluss').length >= 12);
  const grund = karte.basis[0];
  pruefe('Napoleon-Karte: das Meer liegt als Untergrund unter allem',
    grund.art === 'grund' && grund.d.includes(String(karte.breite)));

  // --- 6. Die Info-Punkte --------------------------------------------------
  const punkte = Object.fromEntries(karte.punkte.map((punkt) => [punkt.id, punkt]));
  for (const id of ['paris', 'trafalgar', 'madrid', 'austerlitz', 'moskau', 'leipzig', 'waterloo']) {
    pruefe(`Napoleon-Karte: „${id}" ist ein Info-Punkt`, Boolean(punkte[id]));
  }
  pruefe('Napoleon-Karte: Paris nennt 1789 und die Erklärung der Menschenrechte',
    punkte.paris.text.includes('1789') && punkte.paris.text.includes('Menschen-'));
  pruefe('Napoleon-Karte: Paris benennt auch die Guillotine und den Terror',
    punkte.paris.text.includes('Guillotine') && punkte.paris.text.includes('Robespierre'));
  pruefe('Napoleon-Karte: Trafalgar erklärt die Folge — die Kontinentalsperre',
    punkte.trafalgar.text.includes('1805') && punkte.trafalgar.text.includes('Kontinentalsperre'));
  pruefe('Napoleon-Karte: Madrid gibt die Beweggründe der spanischen Seite fair wieder',
    punkte.madrid.text.includes('guerrilla') && punkte.madrid.text.includes('Goya'));
  pruefe('Napoleon-Karte: Moskau nennt Borodino und die Verluste des Feldzugs',
    punkte.moskau.text.includes('Borodino') && punkte.moskau.text.includes('600 000'));
  pruefe('Napoleon-Karte: Moskau sagt selbst, dass die Stadt nie französisches Gebiet war',
    punkte.moskau.text.includes('nie französisches Gebiet'));
  pruefe('Napoleon-Karte: Leipzig nennt die Völkerschlacht und ihre Zahl',
    punkte.leipzig.text.includes('1813') && punkte.leipzig.text.includes('Völkerschlacht'));
  pruefe('Napoleon-Karte: Waterloo nennt Wellington, Blücher und St. Helena',
    punkte.waterloo.text.includes('Wellington') &&
    punkte.waterloo.text.includes('Blücher') &&
    punkte.waterloo.text.includes('St. Helena'));

  // --- 7. Die Bewegungen ----------------------------------------------------
  const bewegung = Object.fromEntries(karte.bewegungen.map((b) => [b.id, b]));
  for (const id of ['russlandfeldzug', 'rueckzug', 'elba-waterloo']) {
    pruefe(`Napoleon-Karte: die Bewegung „${id}" ist da`, Boolean(bewegung[id]));
  }
  const beiPunkt = (paar, id) =>
    Math.hypot(paar[0] - punkte[id].x, paar[1] - punkte[id].y) < 1;

  pruefe('Napoleon-Karte: der Vormarsch von 1812 endet in Moskau',
    beiPunkt(bewegung.russlandfeldzug.nach, 'moskau'));
  pruefe('Napoleon-Karte: der Vormarsch von 1812 läuft nach Osten',
    bewegung.russlandfeldzug.nach[0] > bewegung.russlandfeldzug.von[0]);
  pruefe('Napoleon-Karte: der Vormarsch nennt den Njemen und die Zusammensetzung des Heeres',
    bewegung.russlandfeldzug.text.includes('Njemen') &&
    bewegung.russlandfeldzug.text.includes('Rheinbund'));

  pruefe('Napoleon-Karte: der Rückzug beginnt in Moskau',
    beiPunkt(bewegung.rueckzug.von, 'moskau'));
  pruefe('Napoleon-Karte: der Rückzug läuft nach Westen zurück',
    bewegung.rueckzug.nach[0] < bewegung.rueckzug.von[0]);
  pruefe('Napoleon-Karte: der Rückzug läuft dieselbe Strecke wie der Vormarsch',
    (bewegung.rueckzug.ueber || []).some((punkt) =>
      (bewegung.russlandfeldzug.ueber || []).some(
        (hin) => hin[0] === punkt[0] && hin[1] === punkt[1],
      )));
  pruefe('Napoleon-Karte: der Rückzug nennt die Beresina',
    bewegung.rueckzug.text.includes('Beresina'));

  pruefe('Napoleon-Karte: der Weg von Elba endet in Waterloo',
    beiPunkt(bewegung['elba-waterloo'].nach, 'waterloo'));
  pruefe('Napoleon-Karte: der Weg von Elba führt über Paris',
    (bewegung['elba-waterloo'].ueber || []).some((punkt) => beiPunkt(punkt, 'paris')));
  pruefe('Napoleon-Karte: der Weg von Elba nennt die Hundert Tage',
    bewegung['elba-waterloo'].text.includes('Hundert') &&
    bewegung['elba-waterloo'].text.includes('1815'));

  // --- 8. Beschriftungen -----------------------------------------------------
  const beschriftungen = karte.beschriftungen || [];
  const texte = beschriftungen.map((b) => b.text);
  for (const name of [
    'Atlantik', 'Mittelmeer', 'Nordsee', 'Ostsee', 'Schwarzes Meer',
    'Pyrenäen', 'Alpen', 'Rhein', 'Russland', 'Spanien', 'Italien',
    'Frankreich', 'Korsika', 'Elba',
  ]) {
    pruefe(`Napoleon-Karte: „${name}" ist beschriftet`, texte.includes(name));
  }
  pruefe('Napoleon-Karte: es gibt Beschriftungen für Land und Meer',
    beschriftungen.some((b) => b.art === 'land') && beschriftungen.some((b) => b.art === 'meer'));

  // --- 9. Zusammenspiel mit dem Lernformat -----------------------------------
  pruefe('Lernformat: „Revolution und Napoleon" zeigt den Karten-Abschnitt',
    abschnitteFuer(thema).some((a) => a.id === 'karte'));
  pruefe('Lernformat: der Karten-Abschnitt steht direkt hinter dem Aufhänger',
    abschnitteFuer(thema).findIndex((a) => a.id === 'karte') === 1);

  // --- 10. Das Modul selbst -------------------------------------------------
  // Runde 14 legt nur die Sicht der Revolutionäre und der napoleonischen
  // Bewegung an (Opus); die Sicht der Betroffenen ergänzt Hermes danach. Der
  // generische Schema-Test in tests/themen.mjs nimmt alle Perspektiven
  // automatisch mit — hier steht nur, was für dieses Thema besonders gilt.
  const revolution = thema.perspektiven.find((p) => p.id === 'revolution-sicht');
  pruefe('„Revolution und Napoleon": die Sicht der Revolutionäre ist da und stammt von Opus',
    Boolean(revolution) && revolution.stimme === 'Opus');
  pruefe('„Revolution und Napoleon": die Perspektive nennt sich gleichwertig zur zweiten Stimme',
    revolution.text.includes('gleichwertig'));
  pruefe('„Revolution und Napoleon": die Perspektive öffnet die Tür zur zweiten Stimme',
    revolution.text.includes('zweite') && revolution.text.includes('Betroffenen'));

  // Die Stationen des Kapitels.
  for (const stichwort of [
    '1789', 'Bastille', 'Menschen- und Bürgerrechte', 'Olympe de Gouges',
    'Saint-Domingue', 'Robespierre', 'Guillotine', '18. Brumaire', 'Code civil',
    'Austerlitz', 'Jena', 'Kontinentalsperre', 'guerrilla', '1812', 'Borodino',
    'Beresina', 'Leipzig', 'Elba', 'Waterloo', 'Wiener Kongress',
  ]) {
    pruefe(`„Revolution und Napoleon": die Perspektive erzählt von „${stichwort}"`,
      revolution.text.includes(stichwort));
  }

  // TONE-REGEL für sensible Themen (CLAUDE.md): Die eigene Erzählung muss ihre
  // unbequemen Stellen selbst benennen, statt sie der Gegenstimme zu
  // überlassen — und sie darf die andere Seite nicht verunglimpfen.
  pruefe('„Revolution und Napoleon": die Perspektive benennt den Terror als eigene Schuld',
    revolution.text.includes('Terror') && revolution.text.includes('widerlegt sich selbst'));
  pruefe('„Revolution und Napoleon": die Perspektive benennt die Wiedereinführung der Sklaverei 1802',
    revolution.text.includes('1802') && revolution.text.includes('Sklaverei wieder ein'));
  pruefe('„Revolution und Napoleon": die Perspektive benennt, dass die Gleichheit Frauen nicht meinte',
    revolution.text.includes('Frauen') && revolution.text.includes('Olympe de Gouges'));
  pruefe('„Revolution und Napoleon": die Perspektive nennt die Kaiserkrönung eine neue Erbherrschaft',
    revolution.text.includes('Kaiser der Franzosen') && revolution.text.includes('neue Erbherrschaft'));
  pruefe('„Revolution und Napoleon": die Perspektive nennt den 18. Brumaire beim Namen',
    revolution.text.includes('Staatsstreich'));
  pruefe('„Revolution und Napoleon": die Perspektive benennt die Zensur des eigenen Staates',
    revolution.text.includes('Zensur'));
  pruefe('„Revolution und Napoleon": die Perspektive benennt den Feldzug von 1812 als ziellos',
    revolution.text.includes('kein erreichbares Ziel'));
  // Und sie erklärt die Gegenseite nicht zu bloßen Statisten: Aufstand,
  // Beweggründe und die Freiwilligen von 1813 stehen ausdrücklich da.
  pruefe('„Revolution und Napoleon": die Beweggründe der spanischen Seite werden fair wiedergegeben',
    revolution.text.includes('nachvollziehbar') && revolution.text.includes('eigene Land'));
  pruefe('„Revolution und Napoleon": die Freiwilligen von 1813 werden fair eingeordnet',
    revolution.text.includes('Freiwillige') && revolution.text.includes('1813'));
  pruefe('„Revolution und Napoleon": die Bilanz nennt Errungenschaften UND Tote nebeneinander',
    revolution.text.includes('Millionen Menschen das Leben') &&
    revolution.text.includes('keiner hebt den anderen auf'));

  // Solange nur eine Stimme dasteht, muss die Synthese das sagen. Die Prüfung
  // ist zustandstolerant: Sie akzeptiert den Zwischenstand ebenso wie die
  // spätere Fassung, die beide Stimmen zusammenführt (Muster der Runden 8–13).
  const zweiteStimme = thema.perspektiven.find((p) => p.stimme === 'Hermes');
  if (!zweiteStimme) {
    pruefe('„Revolution und Napoleon": die Synthese sagt offen, dass eine Sicht fehlt',
      thema.synthese.includes('noch nicht fertig') && thema.synthese.includes('Betroffenen'));
  } else {
    pruefe('„Revolution und Napoleon": die Synthese führt beide Sichtweisen zusammen',
      thema.synthese.includes('Betroffenen') && thema.synthese.includes('Revolution'));
  }

  pruefe('„Revolution und Napoleon" hat 3 bis 5 Quizfragen',
    thema.quiz.length >= 3 && thema.quiz.length <= 5);
  pruefe('„Revolution und Napoleon": jede Quizfrage hat eine gültige richtige Antwort',
    thema.quiz.every((f) => typeof f.antworten[f.richtig] === 'string'));
  pruefe('„Revolution und Napoleon": jede Quizfrage wird erklärt',
    thema.quiz.every((f) => f.erklaerung.trim().length > 40));
  // Die Quizfragen bleiben Wissensfragen: keine Schuldfrage, keine Frage
  // danach, wer im Recht war (Zusatzregel für sensible Themen).
  const quizText = thema.quiz.map((f) => `${f.frage} ${f.antworten.join(' ')}`).join(' ');
  pruefe('„Revolution und Napoleon": keine Quizfrage fragt nach Schuld',
    !/[Ss]chuld|wer war im Recht|zu Recht/.test(quizText));
  pruefe('„Revolution und Napoleon": das Urteil ist offen gestellt', thema.urteil.frage.includes('?'));
  pruefe('„Revolution und Napoleon": das Urteil fragt nach den Ideen, nicht nach der Schuld',
    thema.urteil.frage.includes('Ideen') && !/[Ss]chuld/.test(thema.urteil.frage));
  pruefe('„Revolution und Napoleon": das Urteil bekommt einen Denkanstoß',
    typeof thema.urteil.hinweis === 'string' && thema.urteil.hinweis.length > 40);
  pruefe('„Revolution und Napoleon" steht als Modul 12 hinter den USA',
    alleThemen[11] === thema && alleThemen[10].id === 'usa-unabhaengigkeit');
}
