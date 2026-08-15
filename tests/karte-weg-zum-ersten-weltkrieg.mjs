// Prüfungen für die Karte zum Thema „Der Weg zum Ersten Weltkrieg" — und für
// das, was das Themen-Modul an der Karte hängen hat.
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe:
// läuft mit blankem `node`.
//
//   1. Vollständigkeit und Aufbau (Phasen, Punkte, Bewegungen, Beschriftungen).
//   2. Atlas-Gegenprobe: Liegen bekannte Küstenorte von Lissabon bis St.
//      Petersburg auf der gezeichneten Küste? Und liegt mitten im Binnenland
//      oder auf offener See keine?
//   3. Die Aussage steckt in der Geometrie: Österreich-Ungarns Fläche wächst
//      1907 um Bosnien-Herzegowina (Sarajevo liegt 1871 außerhalb, danach
//      innerhalb); das Osmanische Reich schrumpft über alle drei Phasen;
//      Serbien wächst nach den Balkankriegen 1912/13; Deutschland bleibt
//      konstant.
//   4. Die Bewegungen hängen an den Info-Punkten: der Schlieffen-Plan beginnt
//      bei Berlin, die russische Mobilmachung bei St. Petersburg, der
//      österreichisch-ungarische Kriegserklärung führt von Wien nach Belgrad.
//   5. TONE-REGEL für sensible Themen (CLAUDE.md): Die Perspektive muss ihre
//      unbequemen Stellen selbst benennen (Blankoscheck, Einmarsch in
//      Belgien, Mobilmachungslogik), Artikel 231 als Vertragsbestimmung und
//      nicht als Forschungsstand kennzeichnen, die Beweggründe der anderen
//      Seite fair wiedergeben — und weder Karte noch Quiz dürfen nach Schuld
//      fragen.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { pruefeKarte, KARTEN_PUNKT_TYPEN } = require('../utils/themen/schema.js');
const { erstelleProjektion } = require('../utils/karte-geo.js');
const { themaNachId, alleThemen } = require('../utils/themen/index.js');
const { abschnitteFuer } = require('../utils/lernformat.js');

/**
 * Der Kartenausschnitt, wie ihn utils/themen/karten/weg-zum-ersten-weltkrieg.js
 * aufspannt. Steht hier noch einmal, damit die Atlas-Gegenprobe unten rechnen
 * kann — dass er stimmt, prüft der Test über die daraus folgende Höhe.
 */
const RAHMEN = { minLon: -10, maxLon: 45, minLat: 34, maxLat: 61, breite: 700 };

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
 * Eine Fläche wie „Vereinigtes Königreich" besteht aus mehreren Teilpfaden
 * (Britannien, Irland). Für die Punkt-im-Vieleck-Probe müssen sie getrennt
 * bleiben — sonst käme aus zwei Ringen ein Zickzack.
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
  const thema = themaNachId('weg-zum-ersten-weltkrieg');
  pruefe('„Der Weg zum Ersten Weltkrieg" ist als Thema registriert', Boolean(thema));
  const karte = thema.karte;
  pruefe('„Der Weg zum Ersten Weltkrieg" bringt eine Karte mit', Boolean(karte));

  // --- 1. Aufbau ---------------------------------------------------------
  pruefe('Weltkrieg-Karte: erfüllt das Karten-Schema', pruefeKarte(karte).length === 0);
  pruefe('Weltkrieg-Karte: hat mindestens 3 Phasen', karte.phasen.length >= 3);
  pruefe('Weltkrieg-Karte: hat genau 3 Phasen — 1871, 1907, 1914', karte.phasen.length === 3);
  pruefe('Weltkrieg-Karte: hat 6 bis 7 Info-Punkte',
    karte.punkte.length >= 6 && karte.punkte.length <= 7);
  pruefe('Weltkrieg-Karte: hat 2 bis 4 Bewegungen',
    karte.bewegungen.length >= 2 && karte.bewegungen.length <= 4);
  pruefe('Weltkrieg-Karte: jeder Punkt-Typ ist ein bekannter',
    karte.punkte.every((punkt) => KARTEN_PUNKT_TYPEN.includes(punkt.typ)));
  pruefe('Weltkrieg-Karte: jeder Info-Punkt hat einen ausgeführten Text',
    karte.punkte.every((punkt) => punkt.text.trim().length > 200));
  pruefe('Weltkrieg-Karte: jede Bewegung hat einen ausgeführten Text',
    karte.bewegungen.every((b) => b.text.trim().length > 200));
  pruefe('Weltkrieg-Karte: jede Phase erklärt sich in einem Hinweis',
    karte.phasen.every((p) => typeof p.hinweis === 'string' && p.hinweis.length > 40));
  pruefe('Weltkrieg-Karte: die Phasen-ids sind eindeutig',
    new Set(karte.phasen.map((p) => p.id)).size === karte.phasen.length);

  const labels = karte.phasen.map((p) => p.label).join(' | ');
  for (const jahr of ['1871', '1907', '1914']) {
    pruefe(`Weltkrieg-Karte: die Jahreszahl ${jahr} steht auf dem Umschalter`, labels.includes(jahr));
  }

  const imBild = ([x, y]) => x >= 0 && x <= karte.breite && y >= 0 && y <= karte.hoehe;
  pruefe('Weltkrieg-Karte: alle Info-Punkte liegen im Bild',
    karte.punkte.every((punkt) => imBild([punkt.x, punkt.y])));
  pruefe('Weltkrieg-Karte: alle Bewegungen liegen im Bild',
    karte.bewegungen.every((b) => [b.von, b.nach, ...(b.ueber || [])].every(imBild)));
  pruefe('Weltkrieg-Karte: alle Beschriftungen liegen im Bild',
    (karte.beschriftungen || []).every((b) => imBild([b.x, b.y])));

  // --- 2. Die Erzählung steckt in der Geometrie --------------------------
  const [phase1871, phase1907, phase1914] = karte.phasen;

  // Österreich-Ungarn wächst 1907 um Bosnien-Herzegowina und bleibt danach
  // gleich groß — die zentrale Festlegung dieser Karte.
  const AH = /Österreich-Ungarn/;
  const ah = karte.phasen.map((p) => groesseVon(p, AH));
  pruefe('Weltkrieg-Karte: Österreich-Ungarn ist 1907 größer als 1871 (Bosnien-Herzegowina)',
    ah[0] > 0 && ah[1] > ah[0] * 1.05);
  pruefe('Weltkrieg-Karte: Österreich-Ungarns Fläche bleibt 1907 und 1914 gleich groß',
    Math.abs(ah[2] - ah[1]) < ah[1] * 0.01);

  // Das Osmanische Reich schrumpft über alle drei Phasen — der Balkan als
  // Pulverfass, geometrisch nachvollzogen.
  const OSMANEN = /Osmanisches Reich/;
  const osmanen = karte.phasen.map((p) => groesseVon(p, OSMANEN));
  pruefe('Weltkrieg-Karte: das Osmanische Reich ist 1871 die größte seiner drei Balkan-Flächen',
    osmanen[0] > 0 && osmanen[0] > osmanen[1] && osmanen[1] > osmanen[2]);
  pruefe('Weltkrieg-Karte: das Osmanische Reich ist 1914 nur noch ein schmaler Rest',
    osmanen[2] < osmanen[0] * 0.15);

  // Serbien wächst nach den Balkankriegen 1912/13.
  const serbien = karte.phasen.map((p) => groesseVon(p, /Serbien/));
  pruefe('Weltkrieg-Karte: Serbien steht 1871 noch nicht auf der Karte', serbien[0] === 0);
  pruefe('Weltkrieg-Karte: Serbien ist 1914 größer als 1907', serbien[1] > 0 && serbien[2] > serbien[1]);

  // Das Deutsche Reich bleibt von 1871 bis 1914 im Wesentlichen unverändert.
  const deutschland = karte.phasen.map((p) => groesseVon(p, /Deutsches Reich/));
  pruefe('Weltkrieg-Karte: Deutschlands Fläche ist über alle drei Phasen (fast) gleich groß',
    deutschland.every((d) => d > 0) &&
    Math.abs(deutschland[2] - deutschland[0]) < deutschland[0] * 0.01);

  // 1871 tragen die Flächen noch keinen Bündnisnamen — die Blöcke gab es
  // damals noch nicht; ab 1907 tun sie es.
  const titel1871 = phase1871.flaechen.map((f) => f.titel).join(' | ');
  const titel1907 = phase1907.flaechen.map((f) => f.titel).join(' | ');
  pruefe('Weltkrieg-Karte: 1871 trägt keine Fläche einen Bündnisnamen',
    !titel1871.includes('Mittelmächte') && !titel1871.includes('Entente'));
  pruefe('Weltkrieg-Karte: 1907 tragen die Flächen ihre Bündniszugehörigkeit im Titel',
    titel1907.includes('Mittelmächte') && titel1907.includes('Entente'));

  // --- 3. Die zentrale Festlegung als Rechnung ---------------------------
  const geo = erstelleProjektion(RAHMEN);
  pruefe('Weltkrieg-Karte: die Höhe passt zum angenommenen Ausschnitt', geo.hoehe === karte.hoehe);
  pruefe('Weltkrieg-Karte: die Breite passt zum angenommenen Ausschnitt', geo.breite === karte.breite);

  /** Liegt ein geografischer Ort in einer Fläche dieser Phase? */
  const liegtIn = (phase, muster, lon, lat) => {
    const punkt = geo.punkt(lon, lat);
    return phase.flaechen
      .filter((f) => muster.test(f.titel))
      .some((f) => ringe(f.d).some((ring) => imVieleck(punkt, ring)));
  };

  pruefe('Weltkrieg-Karte: Berlin liegt in jeder Phase im Deutschen Reich',
    karte.phasen.every((p) => liegtIn(p, /Deutsches Reich/, 13.4, 52.52)));
  pruefe('Weltkrieg-Karte: Straßburg liegt 1871 im Deutschen Reich (Elsass-Lothringen)',
    liegtIn(phase1871, /Deutsches Reich/, 7.75, 48.58));
  pruefe('Weltkrieg-Karte: Straßburg liegt 1871 NICHT in Frankreich',
    !liegtIn(phase1871, /Frankreich/, 7.75, 48.58));
  pruefe('Weltkrieg-Karte: Paris liegt in jeder Phase in Frankreich',
    karte.phasen.every((p) => liegtIn(p, /Frankreich/, 2.35, 48.86)));
  pruefe('Weltkrieg-Karte: Wien liegt in jeder Phase in Österreich-Ungarn',
    karte.phasen.every((p) => liegtIn(p, AH, 16.37, 48.21)));

  // Der Kern des Kapitels: Sarajevo liegt 1871 noch nicht in Österreich-Ungarn.
  pruefe('Weltkrieg-Karte: Sarajevo liegt 1871 NICHT in Österreich-Ungarn',
    !liegtIn(phase1871, AH, 18.43, 43.85));
  pruefe('Weltkrieg-Karte: Sarajevo liegt 1871 im Osmanischen Reich',
    liegtIn(phase1871, OSMANEN, 18.43, 43.85));
  pruefe('Weltkrieg-Karte: Sarajevo liegt 1907 und 1914 in Österreich-Ungarn',
    liegtIn(phase1907, AH, 18.43, 43.85) && liegtIn(phase1914, AH, 18.43, 43.85));

  pruefe('Weltkrieg-Karte: Belgrad liegt 1907 und 1914 in Serbien',
    liegtIn(phase1907, /Serbien/, 20.46, 44.82) && liegtIn(phase1914, /Serbien/, 20.46, 44.82));
  pruefe('Weltkrieg-Karte: Belgrad liegt 1914 NICHT in Österreich-Ungarn',
    !liegtIn(phase1914, AH, 20.46, 44.82));

  pruefe('Weltkrieg-Karte: St. Petersburg liegt in jeder Phase im Russischen Reich',
    karte.phasen.every((p) => liegtIn(p, /Russische Reich/, 30.3, 59.94)));
  pruefe('Weltkrieg-Karte: Warschau liegt in jeder Phase im Russischen Reich',
    karte.phasen.every((p) => liegtIn(p, /Russische Reich/, 21.0, 52.23)));
  pruefe('Weltkrieg-Karte: London liegt in jeder Phase im Vereinigten Königreich',
    karte.phasen.every((p) => liegtIn(p, /Vereinigtes Königreich/, -0.13, 51.51)));
  pruefe('Weltkrieg-Karte: Rom liegt in jeder Phase in Italien',
    karte.phasen.every((p) => liegtIn(p, /Italien/, 12.48, 41.9)));

  // --- 4. Atlas-Gegenprobe -----------------------------------------------
  const kuestenpunkte = karte.basis
    .filter((teil) => teil.art === 'land')
    .flatMap((teil) => eckpunkte(teil.d));
  pruefe('Weltkrieg-Karte: es gibt Küstenlinien zu prüfen', kuestenpunkte.length > 400);

  /** Abstand einer geografischen Landmarke zur nächsten gezeichneten Küste. */
  const abstandZurKueste = (lon, lat) => {
    const [x, y] = geo.punkt(lon, lat);
    return kuestenpunkte.reduce(
      (naechster, [kx, ky]) => Math.min(naechster, Math.hypot(kx - x, ky - y)),
      Infinity,
    );
  };

  // Toleranz ein voller Längengrad — wie bei der Napoleon-Karte, deren
  // Rahmen diese Karte fortsetzt. Die Werte unten liegen absichtlich
  // mindestens 0,1 Grad NEBEN dem nächsten Eckpunkt des Kartenmoduls, damit
  // die gezeichnete Linie geprüft wird und nicht die abgeschriebene Zahl.
  const TOLERANZ = EINHEITEN_JE_GRAD;
  const landmarken = [
    ['Kap Trafalgar', -6.03, 36.18],
    ['Cartagena', -0.98, 37.6],
    ['Villefranche bei Nizza', 7.32, 43.7],
    ['Venedig', 12.34, 45.44],
    ['Zadar an der dalmatinischen Küste', 15.23, 44.12],
    ['Cavtat bei Dubrovnik', 18.22, 42.58],
    ['Igoumenitsa gegenüber Korfu', 20.27, 39.5],
    ['Smyrna', 27.14, 38.42],
    ['Nessebar bei Warna', 27.73, 42.66],
    ['Sewastopol auf der Krim', 33.53, 44.62],
    ['Rostow am Don', 39.7, 47.2],
    ['Odessa-Nähe', 30.6, 46.4],
    ['Tanger', -5.8, 35.79],
    ['Lissabon', -9.14, 38.71],
    ['Espinho bei Porto', -8.78, 40.97],
    ['Bilbao', -2.93, 43.26],
    ['Brest in der Bretagne', -4.49, 48.39],
    ['Calais-Nähe', 1.85, 50.96],
    ['Rotterdam', 4.29, 51.92],
    ['Kiel-Nähe', 10.3, 54.4],
    ['Danzig-Nähe', 18.8, 54.5],
    ['Memel-Nähe', 21.3, 55.6],
    ['Riga', 24.3, 56.9],
    ['Tallinn', 24.9, 59.3],
    ['die Newabucht bei St. Petersburg', 30.1, 59.8],
    ['Malmö', 13.0, 55.6],
    ['Dover', 1.31, 51.13],
    ['der Firth of Forth bei Edinburgh', -3.0, 56.02],
    ['Cork in Irland', -8.47, 51.85],
    ['Galway in Irland', -9.05, 53.27],
    ['John o’ Groats in Nordschottland', -3.05, 58.63],
    ['die Küste bei Göteborg', 11.9, 57.6],
  ];
  for (const [name, lon, lat] of landmarken) {
    pruefe(`Weltkrieg-Karte: ${name} liegt auf der gezeichneten Küste`,
      abstandZurKueste(lon, lat) < TOLERANZ);
  }

  // Und die Gegenprobe zur Gegenprobe: Keiner dieser Orte darf zugleich ein
  // Eckpunkt des Kartenmoduls sein, sonst prüft der Test seine eigene Vorlage.
  pruefe('Weltkrieg-Karte: keine Landmarke ist als Eckpunkt abgeschrieben',
    landmarken.every(([, lon, lat]) => abstandZurKueste(lon, lat) > EINHEITEN_JE_GRAD * 0.1));

  // Im Binnenland und auf offener See darf keine Küste liegen, sonst wäre der
  // Test durch schiere Punktdichte immer erfüllt.
  const abseits = [
    ['mitten in Frankreich', 2.5, 46.5],
    ['mitten in Deutschland', 10.5, 51.0],
    ['mitten in Böhmen', 14.5, 50.0],
    ['mitten in Ungarn', 19.5, 47.0],
    ['mitten in Russland', 32.0, 55.0],
    ['mitten im offenen Atlantik', -8.0, 47.0],
    ['mitten im offenen Mittelmeer', 6.0, 38.5],
    ['mitten in der Nordsee', 3.0, 55.0],
    ['mitten in Anatolien', 33.0, 39.0],
    ['mitten in Polen', 20.0, 52.0],
    ['in Bayern', 11.5, 48.8],
    ['mitten in Rumänien', 25.0, 45.8],
    ['mitten in Litauen', 24.0, 55.0],
    ['mitten in Weißrussland', 27.5, 53.5],
  ];
  for (const [wo, lon, lat] of abseits) {
    pruefe(`Weltkrieg-Karte: ${wo} liegt keine Küste`,
      abstandZurKueste(lon, lat) > TOLERANZ * 2);
  }

  // --- 5. Der Untergrund ---------------------------------------------------
  pruefe('Weltkrieg-Karte: jede Landmasse ist ein geschlossener Pfad',
    karte.basis.filter((teil) => teil.art === 'land').every((teil) => teil.d.trim().endsWith('Z')));
  pruefe('Weltkrieg-Karte: mindestens zwölf Landmassen und Inseln sind gezeichnet',
    karte.basis.filter((teil) => teil.art === 'land').length >= 12);
  pruefe('Weltkrieg-Karte: mindestens fünf Flüsse sind gezeichnet',
    karte.basis.filter((teil) => teil.art === 'fluss').length >= 5);
  const grund = karte.basis[0];
  pruefe('Weltkrieg-Karte: das Meer liegt als Untergrund unter allem',
    grund.art === 'grund' && grund.d.includes(String(karte.breite)));

  // --- 6. Die Info-Punkte --------------------------------------------------
  const punkte = Object.fromEntries(karte.punkte.map((punkt) => [punkt.id, punkt]));
  for (const id of ['sarajevo', 'wien', 'berlin', 'belgrad', 'st-petersburg', 'paris', 'london']) {
    pruefe(`Weltkrieg-Karte: „${id}" ist ein Info-Punkt`, Boolean(punkte[id]));
  }
  pruefe('Weltkrieg-Karte: Sarajevo nennt das Attentat und das Datum',
    punkte.sarajevo.text.includes('28. Juni 1914') && punkte.sarajevo.text.includes('Franz Ferdinand'));
  pruefe('Weltkrieg-Karte: Wien nennt das Ultimatum vom 23. Juli',
    punkte.wien.text.includes('23.') && punkte.wien.text.includes('Ultimatum'));
  pruefe('Weltkrieg-Karte: Berlin nennt den Blankoscheck als eigenen Fehler',
    punkte.berlin.text.includes('Blankoscheck') && punkte.berlin.text.includes('eigenen Fehler'));
  pruefe('Weltkrieg-Karte: Berlin nennt den Einmarsch in Belgien als Bruch des Völkerrechts',
    punkte.berlin.text.includes('Belgien') && punkte.berlin.text.includes('Völkerrechts'));
  pruefe('Weltkrieg-Karte: Belgrad nennt die serbische Antwort auf das Ultimatum',
    punkte.belgrad.text.includes('25. Juli') && punkte.belgrad.text.includes('Vorbehalten'));
  pruefe('Weltkrieg-Karte: St. Petersburg gibt Russlands Motiv als Schutzmacht Serbiens fair wieder',
    punkte['st-petersburg'].text.includes('Schutzmacht') && punkte['st-petersburg'].text.includes('fair'));
  pruefe('Weltkrieg-Karte: Paris nennt das Bündnis mit Russland und die Einkreisung',
    punkte.paris.text.includes('1892') && punkte.paris.text.includes('Einkreisung'));
  pruefe('Weltkrieg-Karte: London nennt die belgische Neutralität als Beweggrund',
    punkte.london.text.includes('Belgien') && punkte.london.text.includes('neutraler Staat'));

  // --- 7. Die Bewegungen ----------------------------------------------------
  const bewegung = Object.fromEntries(karte.bewegungen.map((b) => [b.id, b]));
  for (const id of ['schlieffenplan', 'russische-mobilmachung', 'angriff-auf-belgrad']) {
    pruefe(`Weltkrieg-Karte: die Bewegung „${id}" ist da`, Boolean(bewegung[id]));
  }
  const beiPunkt = (paar, id) =>
    Math.hypot(paar[0] - punkte[id].x, paar[1] - punkte[id].y) < 1;

  pruefe('Weltkrieg-Karte: der Schlieffen-Plan beginnt bei Berlin',
    beiPunkt(bewegung.schlieffenplan.von, 'berlin'));
  pruefe('Weltkrieg-Karte: der Schlieffen-Plan führt nach Westen',
    bewegung.schlieffenplan.nach[0] < bewegung.schlieffenplan.von[0]);
  pruefe('Weltkrieg-Karte: der Schlieffen-Plan nennt Belgien und die Marne',
    bewegung.schlieffenplan.text.includes('Belgien') && bewegung.schlieffenplan.text.includes('Marne'));
  pruefe('Weltkrieg-Karte: der Schlieffen-Plan sagt, dass Paris nie erreicht wurde',
    bewegung.schlieffenplan.text.includes('nie erreicht'));

  pruefe('Weltkrieg-Karte: die russische Mobilmachung beginnt bei St. Petersburg',
    beiPunkt(bewegung['russische-mobilmachung'].von, 'st-petersburg'));
  pruefe('Weltkrieg-Karte: die russische Mobilmachung nennt die Generalmobilmachung vom 30. Juli',
    bewegung['russische-mobilmachung'].text.includes('30. Juli'));

  pruefe('Weltkrieg-Karte: der österreichisch-ungarische Angriff beginnt bei Wien',
    beiPunkt(bewegung['angriff-auf-belgrad'].von, 'wien'));
  pruefe('Weltkrieg-Karte: der österreichisch-ungarische Angriff endet bei Belgrad',
    beiPunkt(bewegung['angriff-auf-belgrad'].nach, 'belgrad'));
  pruefe('Weltkrieg-Karte: der österreichisch-ungarische Angriff nennt die Kriegserklärung vom 28. Juli',
    bewegung['angriff-auf-belgrad'].text.includes('28. Juli'));

  // --- 8. Beschriftungen -----------------------------------------------------
  const beschriftungen = karte.beschriftungen || [];
  const texte = beschriftungen.map((b) => b.text);
  for (const name of [
    'Atlantik', 'Nordsee', 'Ostsee', 'Mittelmeer', 'Schwarzes Meer', 'Alpen',
    'Balkan', 'Deutsches Reich', 'Frankreich', 'Russland', 'Österreich-Ungarn',
    'Italien', 'Serbien',
  ]) {
    pruefe(`Weltkrieg-Karte: „${name}" ist beschriftet`, texte.includes(name));
  }
  pruefe('Weltkrieg-Karte: es gibt Beschriftungen für Land und Meer',
    beschriftungen.some((b) => b.art === 'land') && beschriftungen.some((b) => b.art === 'meer'));

  // --- 9. Zusammenspiel mit dem Lernformat -----------------------------------
  pruefe('Lernformat: „Der Weg zum Ersten Weltkrieg" zeigt den Karten-Abschnitt',
    abschnitteFuer(thema).some((a) => a.id === 'karte'));
  pruefe('Lernformat: der Karten-Abschnitt steht direkt hinter dem Aufhänger',
    abschnitteFuer(thema).findIndex((a) => a.id === 'karte') === 1);

  // --- 10. Das Modul selbst -------------------------------------------------
  // Runde 16 legt nur die Sicht der Mittelmächte an (Opus); die Sicht der
  // Entente und Serbiens ergänzt Hermes danach. Der generische Schema-Test in
  // tests/themen.mjs nimmt alle Perspektiven automatisch mit — hier steht nur,
  // was für dieses Thema besonders gilt.
  const mittelmaechte = thema.perspektiven.find((p) => p.id === 'mittelmaechte-sicht');
  pruefe('„Der Weg zum Ersten Weltkrieg": die Sicht der Mittelmächte ist da und stammt von Opus',
    Boolean(mittelmaechte) && mittelmaechte.stimme === 'Opus');
  pruefe('„Der Weg zum Ersten Weltkrieg": die Perspektive nennt sich gleichwertig zur zweiten Stimme',
    mittelmaechte.text.includes('gleichwertig'));
  pruefe('„Der Weg zum Ersten Weltkrieg": die Perspektive öffnet die Tür zur zweiten Stimme',
    mittelmaechte.text.includes('zweite') && mittelmaechte.text.includes('Entente'));

  // Die Stationen des Kapitels.
  for (const stichwort of [
    'Wiener Kongress', 'Zweibund', 'Dreibund', 'Bismarck', 'Entente cordiale',
    'Tripel-Entente', '28. Juni 1914', 'Gavrilo Princip', 'Blankoscheck',
    '23. Juli', '25. Juli', '28. Juli', '30. Juli', 'Schlieffen-Plan',
    '4. August', 'Artikel 231', 'Versailler Vertrag', 'Fritz Fischer',
    'Christopher Clark', 'Schlafwandler', 'Was 1914 uns heute lehrt',
  ]) {
    pruefe(`„Der Weg zum Ersten Weltkrieg": die Perspektive erzählt von „${stichwort}"`,
      mittelmaechte.text.includes(stichwort));
  }

  // TONE-REGEL für sensible Themen (CLAUDE.md): Die eigene Erzählung muss ihre
  // unbequemen Stellen selbst benennen, statt sie der Gegenstimme zu
  // überlassen — und sie darf die andere Seite nicht verunglimpfen.
  pruefe('„Der Weg zum Ersten Weltkrieg": die Perspektive benennt den Blankoscheck als eigenen Fehler',
    mittelmaechte.text.includes('Blankoscheck') && mittelmaechte.text.includes('eigenen, folgenschweren Fehler'));
  pruefe('„Der Weg zum Ersten Weltkrieg": die Perspektive nennt den Einmarsch in Belgien einen Bruch des Völkerrechts',
    mittelmaechte.text.includes('Bruch des Völkerrechts'));
  pruefe('„Der Weg zum Ersten Weltkrieg": die Perspektive benennt das österreichisch-ungarische Ultimatum als bewusst unannehmbar',
    mittelmaechte.text.includes('kaum möglich schien'));
  pruefe('„Der Weg zum Ersten Weltkrieg": die Perspektive kennzeichnet Artikel 231 als Vertragsbestimmung, nicht als Forschungsstand',
    mittelmaechte.text.includes('politisches Dokument der Sieger') &&
    mittelmaechte.text.includes('kein Ergebnis historischer Forschung'));
  pruefe('„Der Weg zum Ersten Weltkrieg": die Perspektive nennt den Rüstungswettlauf als eigenen Anteil an der Spirale',
    mittelmaechte.text.includes('Rüstungswettlauf') && mittelmaechte.text.includes('eigenen Wehrgesetze'));
  // Und sie erklärt die Gegenseite nicht zu bloßen Statisten: die Beweggründe
  // Russlands, der Entente und Serbiens werden ausdrücklich fair genannt.
  pruefe('„Der Weg zum Ersten Weltkrieg": die Beweggründe Russlands werden fair wiedergegeben',
    mittelmaechte.text.includes('Furcht') && mittelmaechte.text.includes('Bosnien-Annexion'));
  pruefe('„Der Weg zum Ersten Weltkrieg": die Beweggründe der Entente werden als Sicherheitsnetz fair eingeordnet',
    mittelmaechte.text.includes('Sicherheitsnetz'));
  pruefe('„Der Weg zum Ersten Weltkrieg": die serbische Antwort wird als weitgehendes Entgegenkommen anerkannt',
    mittelmaechte.text.includes('großen moralischen Erfolg für Wien'));

  // Solange nur eine Stimme dasteht, muss die Synthese das sagen. Die Prüfung
  // ist zustandstolerant: Sie akzeptiert den Zwischenstand ebenso wie die
  // spätere Fassung, die alle Stimmen zusammenführt (Muster der Runden 8–15).
  const zweiteStimme = thema.perspektiven.find((p) => p.stimme === 'Hermes');
  if (!zweiteStimme) {
    pruefe('„Der Weg zum Ersten Weltkrieg": die Synthese sagt offen, dass eine Sicht fehlt',
      thema.synthese.includes('fehlt noch') && thema.synthese.includes('Entente'));
  } else {
    pruefe('„Der Weg zum Ersten Weltkrieg": die Synthese führt die Sichtweisen zusammen',
      thema.synthese.includes('Entente') && thema.synthese.includes('Mittelmächte'));
  }

  pruefe('„Der Weg zum Ersten Weltkrieg" hat 3 bis 5 Quizfragen',
    thema.quiz.length >= 3 && thema.quiz.length <= 5);
  pruefe('„Der Weg zum Ersten Weltkrieg": jede Quizfrage hat eine gültige richtige Antwort',
    thema.quiz.every((f) => typeof f.antworten[f.richtig] === 'string'));
  pruefe('„Der Weg zum Ersten Weltkrieg": jede Quizfrage wird erklärt',
    thema.quiz.every((f) => f.erklaerung.trim().length > 40));
  // Die Quizfragen bleiben Wissensfragen: keine Schuldfrage — auch das Wort
  // selbst darf im Quiz nicht vorkommen (Betreiber-Vorgabe für dieses Kapitel).
  const quizText = thema.quiz.map((f) => `${f.frage} ${f.antworten.join(' ')} ${f.erklaerung}`).join(' ');
  pruefe('„Der Weg zum Ersten Weltkrieg": keine Quizfrage (und keine Erklärung) nennt das Wort „Schuld"',
    !/[Ss]chuld/.test(quizText));
  pruefe('„Der Weg zum Ersten Weltkrieg": das Urteil ist offen gestellt', thema.urteil.frage.includes('?'));
  pruefe('„Der Weg zum Ersten Weltkrieg": das Urteil fragt nach Verantwortung, nicht nach Schuld',
    thema.urteil.frage.includes('Verantwortung') && !/[Ss]chuld/.test(thema.urteil.frage));
  pruefe('„Der Weg zum Ersten Weltkrieg": das Urteil bekommt einen Denkanstoß',
    typeof thema.urteil.hinweis === 'string' && thema.urteil.hinweis.length > 40);

  // „Was 1914 uns heute lehrt" gehört nach Betreiber-Vorgabe dazu — sachlich,
  // ohne ein aktuelles Ereignis zu bewerten.
  pruefe('„Der Weg zum Ersten Weltkrieg": der Abschnitt „Was 1914 uns heute lehrt" ist da',
    mittelmaechte.text.includes('Was 1914 uns heute lehrt'));
  pruefe('„Der Weg zum Ersten Weltkrieg": der Abschnitt bewertet kein aktuelles Ereignis',
    mittelmaechte.text.includes('ohne dabei ein aktuelles Ereignis zu bewerten') &&
    !/Ukraine|Russland-Ukraine|Putin/.test(mittelmaechte.text));

  pruefe('„Der Weg zum Ersten Weltkrieg" steht als Modul 14 hinter den Kolonien',
    alleThemen[13] === thema && alleThemen[12].id === 'die-kolonien');
}
