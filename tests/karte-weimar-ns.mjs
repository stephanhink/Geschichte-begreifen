// Prüfungen für die Karte zum Thema „Weimarer Republik und der Weg in die
// Diktatur" — und für das, was das Themen-Modul an der Karte hängen hat.
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe:
// läuft mit blankem `node`.
//
//   1. Vollständigkeit und Aufbau (Phasen, Punkte, Bewegungen, Beschriftungen).
//   2. Atlas-Gegenprobe: Liegen bekannte Küstenorte von Zeebrugge bis Palanga
//      auf der gezeichneten Küste? Und liegt mitten im Binnenland oder auf
//      offener See keine?
//   3. Die Aussage steckt in der Geometrie: Die Grenzen des Reiches bleiben
//      über alle drei Phasen gleich — verändert wird nur, was um das Reich
//      herum und über ihm liegt (das besetzte Rheinland schrumpft 1926 und
//      verschwindet 1930, das Memelgebiet steht nur 1919 als eigene Fläche da
//      und gehört danach zu Litauen).
//   4. Die Bewegungen hängen an den Info-Punkten: die Novemberrevolution endet
//      in Berlin, die Ruhrbesetzung führt über Köln ins Ruhrgebiet, der Weg
//      der NSDAP führt von München nach Berlin.
//   5. TONE-REGEL für sensible Themen (CLAUDE.md): Die Perspektive muss ihre
//      unbequemen Stellen selbst benennen (das Bündnis mit der alten
//      Armeeführung, die Freikorps, die Notverordnungen, die Unterschätzung
//      Hitlers, den hingenommenen „Preußenschlag"), die Beweggründe der
//      anderen Seiten fair wiedergeben (Kommunisten, Konservative, die Wähler
//      der NSDAP) — ohne zu verharmlosen —, und keine Quizfrage darf nach
//      Schuld fragen.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { pruefeKarte, KARTEN_PUNKT_TYPEN } = require('../utils/themen/schema.js');
const { erstelleProjektion } = require('../utils/karte-geo.js');
const { themaNachId, alleThemen } = require('../utils/themen/index.js');
const { abschnitteFuer } = require('../utils/lernformat.js');

/**
 * Der Kartenausschnitt, wie ihn utils/themen/karten/weimar-ns.js aufspannt.
 * Steht hier noch einmal, damit die Atlas-Gegenprobe unten rechnen kann — dass
 * er stimmt, prüft der Test über die daraus folgende Höhe.
 */
const RAHMEN = { minLon: 2, maxLon: 23, minLat: 46, maxLat: 56, breite: 700 };

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
 * Das Deutsche Reich besteht auf dieser Karte aus zwei Ringen — dem Hauptteil
 * und Ostpreußen, dazwischen liegt der polnische Korridor. Für die
 * Punkt-im-Vieleck-Probe müssen sie getrennt bleiben.
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
  const thema = themaNachId('weimar-ns');
  pruefe('„Weimarer Republik und der Weg in die Diktatur" ist als Thema registriert', Boolean(thema));
  const karte = thema.karte;
  pruefe('„Weimarer Republik": das Thema bringt eine Karte mit', Boolean(karte));

  // --- 1. Aufbau ---------------------------------------------------------
  pruefe('Weimar-Karte: erfüllt das Karten-Schema', pruefeKarte(karte).length === 0);
  pruefe('Weimar-Karte: hat mindestens 3 Phasen', karte.phasen.length >= 3);
  pruefe('Weimar-Karte: hat genau 3 Phasen — 1919, 1924–1929, 1933', karte.phasen.length === 3);
  pruefe('Weimar-Karte: hat 6 bis 7 Info-Punkte',
    karte.punkte.length >= 6 && karte.punkte.length <= 7);
  pruefe('Weimar-Karte: hat 2 bis 4 Bewegungen',
    karte.bewegungen.length >= 2 && karte.bewegungen.length <= 4);
  pruefe('Weimar-Karte: jeder Punkt-Typ ist ein bekannter',
    karte.punkte.every((punkt) => KARTEN_PUNKT_TYPEN.includes(punkt.typ)));
  pruefe('Weimar-Karte: jeder Info-Punkt hat einen ausgeführten Text',
    karte.punkte.every((punkt) => punkt.text.trim().length > 200));
  pruefe('Weimar-Karte: jede Bewegung hat einen ausgeführten Text',
    karte.bewegungen.every((b) => b.text.trim().length > 200));
  pruefe('Weimar-Karte: jede Phase erklärt sich in einem Hinweis',
    karte.phasen.every((p) => typeof p.hinweis === 'string' && p.hinweis.length > 40));
  pruefe('Weimar-Karte: die Phasen-ids sind eindeutig',
    new Set(karte.phasen.map((p) => p.id)).size === karte.phasen.length);

  const labels = karte.phasen.map((p) => p.label).join(' | ');
  for (const jahr of ['1919', '1929', '1933']) {
    pruefe(`Weimar-Karte: die Jahreszahl ${jahr} steht auf dem Umschalter`, labels.includes(jahr));
  }

  const imBild = ([x, y]) => x >= 0 && x <= karte.breite && y >= 0 && y <= karte.hoehe;
  pruefe('Weimar-Karte: alle Info-Punkte liegen im Bild',
    karte.punkte.every((punkt) => imBild([punkt.x, punkt.y])));
  pruefe('Weimar-Karte: alle Bewegungen liegen im Bild',
    karte.bewegungen.every((b) => [b.von, b.nach, ...(b.ueber || [])].every(imBild)));
  pruefe('Weimar-Karte: alle Beschriftungen liegen im Bild',
    (karte.beschriftungen || []).every((b) => imBild([b.x, b.y])));

  // --- 2. Die Erzählung steckt in der Geometrie --------------------------
  const [phase1919, phase1920er, phase1933] = karte.phasen;

  // Die zentrale Festlegung dieser Karte: Am Staatsgebiet ändert sich zwischen
  // 1919 und 1933 nichts. Was sich änderte, stand nicht auf der Landkarte.
  const reich = karte.phasen.map((p) => groesseVon(p, /^Deutsches Reich/));
  pruefe('Weimar-Karte: das Deutsche Reich steht auf jeder Phase',
    reich.every((flaeche) => flaeche > 0));
  pruefe('Weimar-Karte: die Grenzen des Reiches sind über alle drei Phasen dieselben',
    Math.abs(reich[1] - reich[0]) < 0.001 && Math.abs(reich[2] - reich[0]) < 0.001);
  pruefe('Weimar-Karte: das Reich besteht aus zwei Ringen — Hauptteil und Ostpreußen',
    karte.phasen.every((p) =>
      p.flaechen.filter((f) => /^Deutsches Reich/.test(f.titel)).every((f) => ringe(f.d).length === 2)));

  // Das besetzte Rheinland: 1926 kleiner (die Kölner Zone ist geräumt), 1933
  // gar nicht mehr da (Räumung am 30. Juni 1930).
  const rheinland = karte.phasen.map((p) => groesseVon(p, /Besetztes Rheinland/));
  pruefe('Weimar-Karte: das besetzte Rheinland ist 1924–1929 kleiner als 1919',
    rheinland[0] > 0 && rheinland[1] > 0 && rheinland[1] < rheinland[0] * 0.9);
  pruefe('Weimar-Karte: 1933 ist das Rheinland geräumt und steht nicht mehr auf der Karte',
    rheinland[2] === 0);

  // Das Memelgebiet steht nur 1919 als eigene Fläche da; danach gehört es zu
  // Litauen, dessen Fläche entsprechend wächst.
  const memel = karte.phasen.map((p) => groesseVon(p, /^Memelgebiet/));
  pruefe('Weimar-Karte: das Memelgebiet steht nur auf der ersten Phase als eigene Fläche',
    memel[0] > 0 && memel[1] === 0 && memel[2] === 0);
  const litauen = karte.phasen.map((p) => groesseVon(p, /^Litauen/));
  pruefe('Weimar-Karte: Litauen ist ab 1924 größer als 1919 (das Memelgebiet kam dazu)',
    litauen[0] > 0 && litauen[1] > litauen[0] && litauen[2] === litauen[1]);
  pruefe('Weimar-Karte: der Titel des Memelgebiets nennt die Jahre 1920–1923',
    phase1919.flaechen.some((f) => /^Memelgebiet/.test(f.titel) && f.titel.includes('1920–1923')));

  // Danzig und das Saargebiet stehen auf jeder Phase — und tragen ihren
  // Zustand mit Jahreszahl im Titel (datierte Zustände ohne Wertung).
  const danzig = karte.phasen.map((p) => groesseVon(p, /Danzig/));
  pruefe('Weimar-Karte: die Freie Stadt Danzig steht auf jeder Phase',
    danzig.every((flaeche) => flaeche > 0));
  const saar = karte.phasen.map((p) => groesseVon(p, /Saargebiet/));
  pruefe('Weimar-Karte: das Saargebiet steht auf jeder Phase', saar.every((flaeche) => flaeche > 0));
  pruefe('Weimar-Karte: jede Fläche trägt einen Titel',
    karte.phasen.every((p) => p.flaechen.every((f) => f.titel.trim().length > 0)));
  const alleTitel = karte.phasen.flatMap((p) => p.flaechen.map((f) => f.titel)).join(' | ');
  for (const stichwort of ['Völkerbund', 'Versailler Vertrag', 'Volksabstimmung 1920']) {
    pruefe(`Weimar-Karte: die Flächen-Titel benennen „${stichwort}"`, alleTitel.includes(stichwort));
  }

  // --- 3. Die zentrale Festlegung als Rechnung ---------------------------
  const geo = erstelleProjektion(RAHMEN);
  pruefe('Weimar-Karte: die Höhe passt zum angenommenen Ausschnitt', geo.hoehe === karte.hoehe);
  pruefe('Weimar-Karte: die Breite passt zum angenommenen Ausschnitt', geo.breite === karte.breite);

  /** Liegt ein geografischer Ort in einer Fläche dieser Phase? */
  const liegtIn = (phase, muster, lon, lat) => {
    const punkt = geo.punkt(lon, lat);
    return phase.flaechen
      .filter((f) => muster.test(f.titel))
      .some((f) => ringe(f.d).some((ring) => imVieleck(punkt, ring)));
  };

  const REICH = /^Deutsches Reich/;
  for (const [name, lon, lat] of [
    ['Berlin', 13.4, 52.52],
    ['Weimar', 11.33, 50.98],
    ['München', 11.58, 48.14],
    ['Köln', 6.96, 50.94],
    ['Breslau', 17.03, 51.11],
    ['Königsberg in Ostpreußen', 20.5, 54.72],
  ]) {
    pruefe(`Weimar-Karte: ${name} liegt in jeder Phase im Deutschen Reich`,
      karte.phasen.every((p) => liegtIn(p, REICH, lon, lat)));
  }

  // Was 1919 nicht mehr zum Reich gehörte — die Karte zeigt die Grenzen des
  // Versailler Vertrags, ohne sie zu bewerten.
  for (const [name, lon, lat] of [
    ['Straßburg (Elsass, seit 1919 französisch)', 7.75, 48.58],
    ['Metz (Lothringen, seit 1919 französisch)', 6.18, 49.12],
    ['Posen (seit 1919 polnisch)', 16.93, 52.41],
    ['Kattowitz (seit der Teilung Oberschlesiens 1922 polnisch)', 19.02, 50.26],
    ['Danzig (Freie Stadt)', 18.65, 54.35],
    ['Memel', 21.14, 55.7],
  ]) {
    pruefe(`Weimar-Karte: ${name} liegt in keiner Phase im Deutschen Reich`,
      karte.phasen.every((p) => !liegtIn(p, REICH, lon, lat)));
  }

  pruefe('Weimar-Karte: Straßburg und Metz liegen in jeder Phase in Frankreich',
    karte.phasen.every((p) => liegtIn(p, /Frankreich/, 7.75, 48.58) && liegtIn(p, /Frankreich/, 6.18, 49.12)));
  pruefe('Weimar-Karte: Danzig liegt in jeder Phase in der Freien Stadt Danzig',
    karte.phasen.every((p) => liegtIn(p, /Danzig/, 18.65, 54.35)));
  pruefe('Weimar-Karte: Posen und Warschau liegen in jeder Phase in Polen',
    karte.phasen.every((p) => liegtIn(p, /Polen/, 16.93, 52.41) && liegtIn(p, /Polen/, 21.0, 52.23)));
  pruefe('Weimar-Karte: Saarbrücken liegt in jeder Phase im Saargebiet',
    karte.phasen.every((p) => liegtIn(p, /Saargebiet/, 6.99, 49.23)));

  // Memel: 1919 im abgetrennten Memelgebiet, ab 1923/24 in Litauen.
  pruefe('Weimar-Karte: Memel liegt 1919 im abgetrennten Memelgebiet',
    liegtIn(phase1919, /^Memelgebiet/, 21.14, 55.7));
  pruefe('Weimar-Karte: Memel liegt 1919 noch nicht in Litauen',
    !liegtIn(phase1919, /^Litauen/, 21.14, 55.7));
  pruefe('Weimar-Karte: Memel liegt 1924–1929 und 1933 in Litauen',
    liegtIn(phase1920er, /^Litauen/, 21.14, 55.7) && liegtIn(phase1933, /^Litauen/, 21.14, 55.7));

  // Das besetzte Rheinland als Rechnung: Köln liegt 1919 darin, nach der
  // Räumung der Kölner Zone 1926 nicht mehr; Mainz bleibt bis 1930 besetzt.
  pruefe('Weimar-Karte: Köln liegt 1919 im besetzten Rheinland',
    liegtIn(phase1919, /Besetztes Rheinland/, 6.96, 50.94));
  pruefe('Weimar-Karte: Köln liegt 1924–1929 nicht mehr im besetzten Gebiet (Räumung 1926)',
    !liegtIn(phase1920er, /Besetztes Rheinland/, 6.96, 50.94));
  pruefe('Weimar-Karte: Mainz liegt 1919 und 1924–1929 im besetzten Rheinland',
    liegtIn(phase1919, /Besetztes Rheinland/, 8.27, 50.0) &&
    liegtIn(phase1920er, /Besetztes Rheinland/, 8.27, 50.0));
  pruefe('Weimar-Karte: Berlin liegt in keiner Phase im besetzten Rheinland',
    karte.phasen.every((p) => !liegtIn(p, /Besetztes Rheinland/, 13.4, 52.52)));

  // Die Nachbarn stehen als eigene Flächen da — dieselbe Regel wie bei den
  // übrigen Karten: eingefärbt wird, wo eine Herrschaft mit Grenzen plausibel ist.
  for (const [name, muster, lon, lat] of [
    ['Prag', /Tschechoslowakei/, 14.42, 50.08],
    ['Wien', /Österreich/, 16.37, 48.21],
    ['Zürich', /Schweiz/, 8.54, 47.37],
    ['Amsterdam', /Niederlande/, 4.9, 52.37],
    ['Brüssel', /Belgien/, 4.35, 50.85],
    ['Kopenhagen', /Dänemark/, 12.57, 55.68],
  ]) {
    pruefe(`Weimar-Karte: ${name} liegt in jeder Phase im eigenen Staat`,
      karte.phasen.every((p) => liegtIn(p, muster, lon, lat)));
  }

  // --- 4. Atlas-Gegenprobe -----------------------------------------------
  const kuestenpunkte = karte.basis
    .filter((teil) => teil.art === 'land')
    .flatMap((teil) => eckpunkte(teil.d));
  pruefe('Weimar-Karte: es gibt Küstenlinien zu prüfen', kuestenpunkte.length > 100);

  /** Abstand einer geografischen Landmarke zur nächsten gezeichneten Küste. */
  const abstandZurKueste = (lon, lat) => {
    const [x, y] = geo.punkt(lon, lat);
    return kuestenpunkte.reduce(
      (naechster, [kx, ky]) => Math.min(naechster, Math.hypot(kx - x, ky - y)),
      Infinity,
    );
  };

  // Toleranz ein Drittel Längengrad statt eines ganzen: Diese Karte ist mit
  // 33,3 SVG-Einheiten je Grad rund zweieinhalbmal feiner als die Karte zum
  // Weg in den Ersten Weltkrieg — ein ganzer Grad würde hier nichts mehr
  // beweisen. In SVG-Einheiten liegt die Toleranz damit bei rund 11,7 und
  // damit im selben Bereich wie bei den übrigen Europakarten. Die Werte unten
  // liegen absichtlich mindestens 0,1 Grad NEBEN dem nächsten Eckpunkt des
  // Kartenmoduls, damit die gezeichnete Linie geprüft wird und nicht die
  // abgeschriebene Zahl.
  const TOLERANZ = EINHEITEN_JE_GRAD * 0.35;
  const landmarken = [
    ['Zeebrugge an der belgischen Küste', 3.2, 51.33],
    ['Vlissingen an der Scheldemündung', 3.57, 51.44],
    ['Scheveningen bei Den Haag', 4.27, 52.1],
    ['Zandvoort', 4.53, 52.37],
    ['IJmuiden', 4.6, 52.46],
    ['Terschelling', 5.4, 53.38],
    ['Borkum', 6.66, 53.58],
    ['Bremerhaven an der Wesermündung', 8.58, 53.55],
    ['Ringkøbing an der jütländischen Westküste', 8.24, 56.09],
    ['Eckernförde', 9.84, 54.47],
    ['Laboe bei Kiel', 10.22, 54.41],
    ['Grömitz in der Lübecker Bucht', 10.97, 54.15],
    ['Travemünde bei Lübeck', 10.87, 53.96],
    ['Rerik an der mecklenburgischen Küste', 11.62, 54.1],
    ['Barth bei Stralsund', 12.72, 54.36],
    ['Sassnitz auf Rügen', 13.64, 54.52],
    ['Peenemünde', 13.77, 54.14],
    ['die Küste bei Köslin', 16.05, 54.22],
    ['Rügenwalde in Pommern', 16.4, 54.4],
    ['Hela an der Danziger Bucht', 18.75, 54.6],
    ['Cranz bei Königsberg', 20.6, 54.96],
    ['Rossitten auf der Kurischen Nehrung', 20.96, 55.15],
    ['Palanga nördlich von Memel', 21.07, 55.92],
    ['Nakskov auf Lolland', 11.14, 54.83],
    ['Nyborg auf Fünen', 10.79, 55.31],
    ['die Küste bei Odense', 10.4, 55.5],
    ['Trelleborg in Schonen', 13.15, 55.38],
    ['Ystad in Schonen', 13.82, 55.43],
    ['Simrishamn in Schonen', 14.35, 55.55],
  ];
  for (const [name, lon, lat] of landmarken) {
    pruefe(`Weimar-Karte: ${name} liegt auf der gezeichneten Küste`,
      abstandZurKueste(lon, lat) < TOLERANZ);
  }

  // Und die Gegenprobe zur Gegenprobe: Keiner dieser Orte darf zugleich ein
  // Eckpunkt des Kartenmoduls sein, sonst prüft der Test seine eigene Vorlage.
  pruefe('Weimar-Karte: keine Landmarke ist als Eckpunkt abgeschrieben',
    landmarken.every(([, lon, lat]) => abstandZurKueste(lon, lat) > EINHEITEN_JE_GRAD * 0.1));

  // Im Binnenland und auf offener See darf keine Küste liegen, sonst wäre der
  // Test durch schiere Punktdichte immer erfüllt.
  const abseits = [
    ['mitten in Thüringen', 10.8, 51.0],
    ['mitten in Bayern', 11.5, 48.8],
    ['mitten in Böhmen', 14.5, 50.0],
    ['mitten in Polen', 19.0, 52.0],
    ['mitten in Frankreich', 4.5, 48.0],
    ['mitten in Belgien', 4.8, 50.4],
    ['in den Alpen', 12.0, 47.2],
    ['mitten in der Nordsee', 4.5, 54.3],
    ['mitten in der Ostsee', 17.0, 55.6],
    ['mitten in Ostpreußen', 21.0, 54.0],
    ['mitten in Ungarn', 19.0, 47.0],
    ['mitten in Litauen', 22.5, 55.0],
  ];
  for (const [wo, lon, lat] of abseits) {
    pruefe(`Weimar-Karte: ${wo} liegt keine Küste`, abstandZurKueste(lon, lat) > TOLERANZ * 2);
  }

  // --- 5. Der Untergrund ---------------------------------------------------
  pruefe('Weimar-Karte: jede Landmasse ist ein geschlossener Pfad',
    karte.basis.filter((teil) => teil.art === 'land').every((teil) => teil.d.trim().endsWith('Z')));
  pruefe('Weimar-Karte: mindestens sieben Landmassen und Inseln sind gezeichnet',
    karte.basis.filter((teil) => teil.art === 'land').length >= 7);
  pruefe('Weimar-Karte: mindestens acht Flüsse sind gezeichnet',
    karte.basis.filter((teil) => teil.art === 'fluss').length >= 8);
  const grund = karte.basis[0];
  pruefe('Weimar-Karte: das Meer liegt als Untergrund unter allem',
    grund.art === 'grund' && grund.d.includes(String(karte.breite)));

  // --- 6. Die Info-Punkte --------------------------------------------------
  const punkte = Object.fromEntries(karte.punkte.map((punkt) => [punkt.id, punkt]));
  for (const id of ['weimar', 'berlin', 'muenchen', 'ruhrgebiet', 'koeln', 'leipzig', 'danzig']) {
    pruefe(`Weimar-Karte: „${id}" ist ein Info-Punkt`, Boolean(punkte[id]));
  }
  pruefe('Weimar-Karte: Weimar nennt die Nationalversammlung und die Verfassung von 1919',
    punkte.weimar.text.includes('Nationalversammlung') && punkte.weimar.text.includes('11. August 1919'));
  pruefe('Weimar-Karte: Weimar nennt das Wahlrecht für Frauen',
    punkte.weimar.text.includes('Frauen wählen und gewählt werden'));
  pruefe('Weimar-Karte: Berlin nennt den 9. November 1918 und den 30. Januar 1933',
    punkte.berlin.text.includes('9. November 1918') && punkte.berlin.text.includes('30. Januar 1933'));
  pruefe('Weimar-Karte: München nennt den Putschversuch von 1923',
    punkte.muenchen.text.includes('8. und 9. November 1923'));
  pruefe('Weimar-Karte: das Ruhrgebiet nennt die Besetzung von 1923 und die Rentenmark',
    punkte.ruhrgebiet.text.includes('11. Januar 1923') && punkte.ruhrgebiet.text.includes('Rentenmark'));
  pruefe('Weimar-Karte: Köln nennt Locarno und die Räumung des Rheinlands',
    punkte.koeln.text.includes('Locarno') && punkte.koeln.text.includes('1926'));
  pruefe('Weimar-Karte: Leipzig nennt das Reichsgericht und die ungleiche Justiz',
    punkte.leipzig.text.includes('Reichsgericht') && punkte.leipzig.text.includes('rechten Auge blind'));
  pruefe('Weimar-Karte: Danzig gibt auch die polnischen Beweggründe fair wieder',
    punkte.danzig.text.includes('123 Jahre') && punkte.danzig.text.includes('Zugang zur Ostsee'));

  // --- 7. Die Bewegungen ----------------------------------------------------
  const bewegung = Object.fromEntries(karte.bewegungen.map((b) => [b.id, b]));
  for (const id of ['novemberrevolution', 'ruhrbesetzung', 'inflation', 'ns-aufstieg']) {
    pruefe(`Weimar-Karte: die Bewegung „${id}" ist da`, Boolean(bewegung[id]));
  }
  const beiPunkt = (paar, id) => Math.hypot(paar[0] - punkte[id].x, paar[1] - punkte[id].y) < 1;

  pruefe('Weimar-Karte: die Novemberrevolution endet in Berlin',
    beiPunkt(bewegung.novemberrevolution.nach, 'berlin'));
  pruefe('Weimar-Karte: die Novemberrevolution beginnt an der Küste (Kiel) und führt nach Osten',
    bewegung.novemberrevolution.von[0] < bewegung.novemberrevolution.nach[0] &&
    bewegung.novemberrevolution.text.includes('Kiel'));
  pruefe('Weimar-Karte: die Novemberrevolution nennt den Waffenstillstand vom 11. November 1918',
    bewegung.novemberrevolution.text.includes('11. November 1918'));

  pruefe('Weimar-Karte: die Ruhrbesetzung führt über Köln ins Ruhrgebiet',
    beiPunkt(bewegung.ruhrbesetzung.ueber[0], 'koeln') &&
    beiPunkt(bewegung.ruhrbesetzung.nach, 'ruhrgebiet'));
  pruefe('Weimar-Karte: die Ruhrbesetzung gibt die französischen Beweggründe fair wieder',
    bewegung.ruhrbesetzung.text.includes('fair daneben'));

  pruefe('Weimar-Karte: die Inflation läuft von Berlin ins Ruhrgebiet',
    beiPunkt(bewegung.inflation.von, 'berlin') && beiPunkt(bewegung.inflation.nach, 'ruhrgebiet'));
  pruefe('Weimar-Karte: die Inflation beginnt der Erklärung nach schon 1914',
    bewegung.inflation.text.includes('1914'));

  pruefe('Weimar-Karte: der Weg der NSDAP führt von München nach Berlin',
    beiPunkt(bewegung['ns-aufstieg'].von, 'muenchen') && beiPunkt(bewegung['ns-aufstieg'].nach, 'berlin'));
  pruefe('Weimar-Karte: der Weg der NSDAP nennt die Wahlergebnisse und die Ernennung',
    bewegung['ns-aufstieg'].text.includes('37,4 Prozent') &&
    bewegung['ns-aufstieg'].text.includes('nie bekommen') &&
    bewegung['ns-aufstieg'].text.includes('30. Januar 1933'));

  // --- 8. Beschriftungen -----------------------------------------------------
  const beschriftungen = karte.beschriftungen || [];
  const texte = beschriftungen.map((b) => b.text);
  for (const name of [
    'Nordsee', 'Ostsee', 'Deutsches Reich', 'Preußen', 'Bayern', 'Ostpreußen',
    'Polen', 'Tschechoslowakei', 'Österreich', 'Frankreich', 'Belgien',
    'Niederlande', 'Dänemark', 'Schweiz',
  ]) {
    pruefe(`Weimar-Karte: „${name}" ist beschriftet`, texte.includes(name));
  }
  pruefe('Weimar-Karte: es gibt Beschriftungen für Land und Meer',
    beschriftungen.some((b) => b.art === 'land') && beschriftungen.some((b) => b.art === 'meer'));

  // --- 9. Zusammenspiel mit dem Lernformat -----------------------------------
  pruefe('Lernformat: „Weimarer Republik" zeigt den Karten-Abschnitt',
    abschnitteFuer(thema).some((a) => a.id === 'karte'));
  pruefe('Lernformat: der Karten-Abschnitt steht direkt hinter dem Aufhänger',
    abschnitteFuer(thema).findIndex((a) => a.id === 'karte') === 1);

  // --- 10. Das Modul selbst -------------------------------------------------
  // Runde 18 legt nur die Sicht derer an, die die Republik aufbauten und
  // verteidigten (Opus); die Sicht der Verfolgten ergänzt Hermes danach. Der
  // generische Schema-Test in tests/themen.mjs nimmt alle Perspektiven
  // automatisch mit — hier steht nur, was für dieses Thema besonders gilt.
  const republik = thema.perspektiven.find((p) => p.id === 'republik-sicht');
  pruefe('„Weimarer Republik": die Sicht der Republikaner ist da und stammt von Opus',
    Boolean(republik) && republik.stimme === 'Opus');
  pruefe('„Weimarer Republik": die Perspektive nennt sich gleichwertig zur zweiten Stimme',
    republik.text.includes('gleichwertig'));
  pruefe('„Weimarer Republik": die Perspektive öffnet die Tür zur zweiten Stimme',
    republik.text.includes('zweite Stimme') && republik.text.includes('Verfolgten'));

  // Die Stationen des Kapitels.
  for (const stichwort of [
    'Friedrich Ebert', '9. November 1918', 'Waffenstillstand', 'Nationalversammlung',
    '11. August 1919', 'Artikel 48', 'Versailles', 'Dolchstoßlegende',
    'Ruhrgebiet', 'Rentenmark', 'Gustav Stresemann', 'Locarno', 'Völkerbund',
    'Bauhaus', 'Weltwirtschaftskrise', 'Brüning', 'Notverordnung',
    '20. Juli 1932', '30. Januar 1933', 'Hindenburg', 'Papen',
    'Reichstag', 'Ermächtigungsgesetz', 'Otto Wels',
  ]) {
    pruefe(`„Weimarer Republik": die Perspektive erzählt von „${stichwort}"`,
      republik.text.includes(stichwort));
  }

  // TONE-REGEL für sensible Themen (CLAUDE.md): Die eigene Erzählung muss ihre
  // unbequemen Stellen selbst benennen, statt sie der Gegenstimme zu
  // überlassen — und sie darf die andere Seite nicht verunglimpfen.
  pruefe('„Weimarer Republik": die Perspektive benennt das Bündnis mit der alten Armeeführung selbst',
    republik.text.includes('Ebert-Groener-Pakt') &&
    republik.text.includes('teuer zu stehen gekommen'));
  pruefe('„Weimarer Republik": die Perspektive benennt den Einsatz der Freikorps als eigene Entscheidung',
    republik.text.includes('Freikorps') && republik.text.includes('Noske') &&
    republik.text.includes('kann das nicht wegerklären'));
  pruefe('„Weimarer Republik": die Perspektive benennt die eigene Justiz als ungleich',
    republik.text.includes('auf dem rechten Auge blind') && republik.text.includes('Gumbel'));
  pruefe('„Weimarer Republik": die Perspektive benennt die Notverordnungen als eigene Aushöhlung',
    republik.text.includes('Die Notverordnungen wurden beschlossen, um die') &&
    republik.text.includes('Instrumente bereitgelegt'));
  pruefe('„Weimarer Republik": die Perspektive benennt die Unterschätzung Hitlers',
    republik.text.includes('engagiert') && republik.text.includes('Unterschätzung'));
  pruefe('„Weimarer Republik": die Perspektive benennt die Uneinigkeit der republikanischen Kräfte',
    republik.text.includes('Uneinigkeit') && republik.text.includes('Sozialfaschisten'));
  pruefe('„Weimarer Republik": die Perspektive benennt den hingenommenen Preußenschlag von 1932',
    republik.text.includes('Sie leistete') && republik.text.includes('kampflos nachgegeben'));

  // Und sie erklärt die Gegenseiten nicht zu bloßen Statisten: Ihre
  // Beweggründe werden ausdrücklich fair wiedergegeben — ohne Verharmlosung.
  pruefe('„Weimarer Republik": die Beweggründe der Kommunisten werden fair wiedergegeben',
    republik.text.includes('hatten einen Grund für ihr Misstrauen'));
  pruefe('„Weimarer Republik": die Beweggründe der Konservativen werden fair wiedergegeben',
    republik.text.includes('undeutsch') && republik.text.includes('fürchteten den Bolschewismus'));
  pruefe('„Weimarer Republik": die Beweggründe der NSDAP-Wähler werden ernst genommen',
    republik.text.includes('muss diese Erfahrungen ernst nehmen'));
  pruefe('„Weimarer Republik": und dabei ausdrücklich nicht verharmlost',
    republik.text.includes('Ernst nehmen heißt aber nicht beschönigen') &&
    republik.text.includes('Parteiprogramm von 1920'));

  // Solange nur eine Stimme dasteht, muss die Synthese das sagen. Die Prüfung
  // ist zustandstolerant: Sie akzeptiert den Zwischenstand ebenso wie die
  // spätere Fassung, die beide Stimmen zusammenführt (Muster der Runden 8–17).
  const zweiteStimme = thema.perspektiven.find((p) => p.stimme === 'Hermes');
  if (!zweiteStimme) {
    pruefe('„Weimarer Republik": die Synthese sagt offen, dass eine Sicht fehlt',
      thema.synthese.includes('fehlt noch') && thema.synthese.includes('Verfolgten'));
  } else {
    pruefe('„Weimarer Republik": die Synthese führt die Sichtweisen zusammen',
      thema.synthese.includes('Verfolgten') && thema.synthese.includes('Republik'));
  }

  pruefe('„Weimarer Republik" hat 3 bis 5 Quizfragen',
    thema.quiz.length >= 3 && thema.quiz.length <= 5);
  pruefe('„Weimarer Republik": jede Quizfrage hat eine gültige richtige Antwort',
    thema.quiz.every((f) => typeof f.antworten[f.richtig] === 'string'));
  pruefe('„Weimarer Republik": jede Quizfrage wird erklärt',
    thema.quiz.every((f) => f.erklaerung.trim().length > 40));
  // Die Quizfragen bleiben Wissensfragen: keine Schuldfrage — auch das Wort
  // selbst darf im Quiz nicht vorkommen (Regel dieses Kapitels).
  const quizText = thema.quiz.map((f) => `${f.frage} ${f.antworten.join(' ')} ${f.erklaerung}`).join(' ');
  pruefe('„Weimarer Republik": keine Quizfrage (und keine Erklärung) nennt das Wort „Schuld"',
    !/[Ss]chuld/.test(quizText));
  pruefe('„Weimarer Republik": das Urteil ist offen gestellt', thema.urteil.frage.includes('?'));
  pruefe('„Weimarer Republik": das Urteil fragt nicht nach Schuld',
    !/[Ss]chuld/.test(thema.urteil.frage) && !/[Ss]chuld/.test(thema.urteil.hinweis));
  pruefe('„Weimarer Republik": das Urteil bekommt einen Denkanstoß',
    typeof thema.urteil.hinweis === 'string' && thema.urteil.hinweis.length > 40);
  pruefe('„Weimarer Republik": der Aufhänger stellt eine neutrale Frage',
    thema.aufhaenger.frage.includes('?') && !/[Ss]chuld/.test(thema.aufhaenger.frage));

  pruefe('„Weimarer Republik" steht als Modul 16 hinter „Die USA: Aufstieg zur Weltmacht"',
    alleThemen[15] === thema && alleThemen[14].id === 'usa-weltmacht');
}
