// Prüfungen für die Karte zum Thema „Die USA: Aufstieg zur Weltmacht" — und
// für das, was das Themen-Modul an der Karte hängen hat.
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe:
// läuft mit blankem `node`.
//
//   1. Vollständigkeit und Aufbau (Phasen, Punkte, Bewegungen, Beschriftungen).
//   2. Atlas-Gegenprobe: Liegen bekannte Küstenorte von Los Angeles bis
//      Shanghai auf der gezeichneten Küste? Und liegt mitten im Binnenland
//      oder auf offener See keine?
//   3. Die Aussage steckt in der Geometrie: Die USA wachsen 1890→1917 um
//      Hawaii, die Philippinen, Guam, Midway und Wake und bleiben 1917→1945
//      gleich groß; Japan ist 1917 am größten (mit Taiwan, Süd-Sachalin,
//      Korea) und 1945 am kleinsten (nur die Kerninseln); das Königreich
//      Korea verschwindet nach 1890 von der Karte.
//   4. Die Bewegungen hängen an den Info-Punkten: Deweys Geschwader beginnt
//      bei Hongkong und endet bei Manila, der Angriff auf Pearl Harbor endet
//      dort, die Bombe fliegt von den Marianen nach Hiroshima.
//   5. TONE-REGEL für sensible Themen (CLAUDE.md): Die Perspektive muss ihre
//      unbequemen Stellen selbst benennen (Philippinisch-Amerikanischer
//      Krieg, Jim Crow, die Atombombe), die Beweggründe der anderen Seite
//      fair wiedergeben — und weder Karte noch Quiz dürfen nach Schuld
//      fragen.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { pruefeKarte, KARTEN_PUNKT_TYPEN } = require('../utils/themen/schema.js');
const { erstelleProjektion } = require('../utils/karte-geo.js');
const { themaNachId, alleThemen } = require('../utils/themen/index.js');
const { abschnitteFuer } = require('../utils/lernformat.js');

/**
 * Der Kartenausschnitt, wie ihn utils/themen/karten/usa-weltmacht.js
 * aufspannt. Steht hier noch einmal, damit die Atlas-Gegenprobe unten rechnen
 * kann — dass er stimmt, prüft der Test über die daraus folgende Höhe.
 */
const RAHMEN = { minLon: 110, maxLon: 250, minLat: 5, maxLat: 62, breite: 700 };

/** Wie viele SVG-Einheiten ein Längengrad breit ist — der Maßstab der Probe. */
const EINHEITEN_JE_GRAD = RAHMEN.breite / (RAHMEN.maxLon - RAHMEN.minLon);

/**
 * Pazifische Zählung der Längengrade — dieselbe Umrechnung wie in
 * karten/usa-weltmacht.js: Die Karte läuft über den 180. Längengrad, deshalb
 * bekommen westliche Längen (negativ) 360 dazu.
 */
const pazifisch = (lon) => (lon < 0 ? lon + 360 : lon);

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
 * Eine Fläche aus mehreren getrennten Inseln besteht aus mehreren
 * Teilpfaden. Für die Punkt-im-Vieleck-Probe müssen sie getrennt bleiben —
 * sonst käme aus zwei Ringen ein Zickzack.
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
  const thema = themaNachId('usa-weltmacht');
  pruefe('„Die USA: Aufstieg zur Weltmacht" ist als Thema registriert', Boolean(thema));
  const karte = thema.karte;
  pruefe('„Die USA: Aufstieg zur Weltmacht" bringt eine Karte mit', Boolean(karte));

  // --- 1. Aufbau ---------------------------------------------------------
  pruefe('Weltmacht-Karte: erfüllt das Karten-Schema', pruefeKarte(karte).length === 0);
  pruefe('Weltmacht-Karte: hat mindestens 3 Phasen', karte.phasen.length >= 3);
  pruefe('Weltmacht-Karte: hat genau 3 Phasen — 1890, 1917, 1945', karte.phasen.length === 3);
  pruefe('Weltmacht-Karte: hat 6 bis 7 Info-Punkte',
    karte.punkte.length >= 6 && karte.punkte.length <= 7);
  pruefe('Weltmacht-Karte: hat 2 bis 4 Bewegungen',
    karte.bewegungen.length >= 2 && karte.bewegungen.length <= 4);
  pruefe('Weltmacht-Karte: jeder Punkt-Typ ist ein bekannter',
    karte.punkte.every((punkt) => KARTEN_PUNKT_TYPEN.includes(punkt.typ)));
  pruefe('Weltmacht-Karte: jeder Info-Punkt hat einen ausgeführten Text',
    karte.punkte.every((punkt) => punkt.text.trim().length > 200));
  pruefe('Weltmacht-Karte: jede Bewegung hat einen ausgeführten Text',
    karte.bewegungen.every((b) => b.text.trim().length > 200));
  pruefe('Weltmacht-Karte: jede Phase erklärt sich in einem Hinweis',
    karte.phasen.every((p) => typeof p.hinweis === 'string' && p.hinweis.length > 40));
  pruefe('Weltmacht-Karte: die Phasen-ids sind eindeutig',
    new Set(karte.phasen.map((p) => p.id)).size === karte.phasen.length);

  const labels = karte.phasen.map((p) => p.label).join(' | ');
  for (const jahr of ['1890', '1917', '1945']) {
    pruefe(`Weltmacht-Karte: die Jahreszahl ${jahr} steht auf dem Umschalter`, labels.includes(jahr));
  }

  const imBild = ([x, y]) => x >= 0 && x <= karte.breite && y >= 0 && y <= karte.hoehe;
  pruefe('Weltmacht-Karte: alle Info-Punkte liegen im Bild',
    karte.punkte.every((punkt) => imBild([punkt.x, punkt.y])));
  pruefe('Weltmacht-Karte: alle Bewegungen liegen im Bild',
    karte.bewegungen.every((b) => [b.von, b.nach, ...(b.ueber || [])].every(imBild)));
  pruefe('Weltmacht-Karte: alle Beschriftungen liegen im Bild',
    (karte.beschriftungen || []).every((b) => imBild([b.x, b.y])));

  // --- 2. Die Erzählung steckt in der Geometrie --------------------------
  const [phase1890, phase1917, phase1945] = karte.phasen;

  // Die USA wachsen 1890 → 1917 um Hawaii, die Philippinen, Guam, Midway und
  // Wake — und bleiben 1917 → 1945 unverändert (dieselben Gebiete, bis auf
  // die separat geführten, 1944/45 erst erworbenen Marianen/Marshallinseln).
  const USA = /Vereinigten Staaten/;
  const usa = karte.phasen.map((p) => groesseVon(p, USA));
  pruefe('Weltmacht-Karte: die USA sind 1917 deutlich größer als 1890 (Hawaii, Philippinen, Guam)',
    usa[0] > 0 && usa[1] > usa[0] * 1.03);
  pruefe('Weltmacht-Karte: die USA bleiben 1917 und 1945 gleich groß',
    Math.abs(usa[2] - usa[1]) < usa[1] * 0.01);

  // Japan ist 1917 am größten (mit Taiwan, Süd-Sachalin, Korea) und 1945 am
  // kleinsten (nur noch die vier Kerninseln, ohne Okinawa und Kurilen).
  const JAPAN = /^(Das Kaiserreich Japan|Japan —)/;
  const japan = karte.phasen.map((p) => groesseVon(p, JAPAN));
  pruefe('Weltmacht-Karte: Japan ist 1917 größer als 1890 (Taiwan, Süd-Sachalin, Korea)',
    japan[0] > 0 && japan[1] > japan[0]);
  pruefe('Weltmacht-Karte: Japan ist 1945 kleiner als 1890 und als 1917',
    japan[2] > 0 && japan[2] < japan[0] && japan[2] < japan[1]);

  // Das Königreich Korea steht nur 1890 auf der Karte — danach ist es Teil
  // Japans (1917) bzw. zweier Besatzungszonen (1945).
  const koreaKoenigreich = karte.phasen.map((p) => groesseVon(p, /Königreich Korea/));
  pruefe('Weltmacht-Karte: das Königreich Korea steht 1890 auf der Karte', koreaKoenigreich[0] > 0);
  pruefe('Weltmacht-Karte: das Königreich Korea verschwindet 1917 und 1945 von der Karte',
    koreaKoenigreich[1] === 0 && koreaKoenigreich[2] === 0);

  // Die Staatsnamen Russlands wechseln mit der Geschichte: Kaiserreich (1890),
  // Russland nach der Revolution (1917), Sowjetunion (1945) — keine Fläche
  // heißt in mehr als einer Phase gleich.
  const titel1890 = phase1890.flaechen.map((f) => f.titel).join(' | ');
  const titel1917 = phase1917.flaechen.map((f) => f.titel).join(' | ');
  const titel1945 = phase1945.flaechen.map((f) => f.titel).join(' | ');
  pruefe('Weltmacht-Karte: 1890 heißt Russland „Das Russische Reich"',
    titel1890.includes('Russische Reich'));
  pruefe('Weltmacht-Karte: 1917 heißt dieselbe Fläche „Russland" (nach der Revolution)',
    titel1917.includes('Russland') && !titel1917.includes('Russische Reich'));
  pruefe('Weltmacht-Karte: 1945 heißt sie „Die Sowjetunion"',
    titel1945.includes('Sowjetunion'));

  // --- 3. Die zentrale Festlegung als Rechnung ---------------------------
  const geo = erstelleProjektion(RAHMEN);
  pruefe('Weltmacht-Karte: die Höhe passt zum angenommenen Ausschnitt', geo.hoehe === karte.hoehe);
  pruefe('Weltmacht-Karte: die Breite passt zum angenommenen Ausschnitt', geo.breite === karte.breite);

  /** Liegt ein geografischer Ort (echte Länge/Breite) in einer Fläche dieser Phase? */
  const liegtIn = (phase, muster, lon, lat) => {
    const punkt = geo.punkt(pazifisch(lon), lat);
    return phase.flaechen
      .filter((f) => muster.test(f.titel))
      .some((f) => ringe(f.d).some((ring) => imVieleck(punkt, ring)));
  };

  pruefe('Weltmacht-Karte: San Francisco liegt in jeder Phase in den Vereinigten Staaten',
    karte.phasen.every((p) => liegtIn(p, USA, -122.42, 37.77)));

  pruefe('Weltmacht-Karte: Manila liegt 1890 NICHT in den Vereinigten Staaten',
    !liegtIn(phase1890, USA, 120.98, 14.6));
  pruefe('Weltmacht-Karte: Manila liegt 1890 in den spanischen Philippinen',
    liegtIn(phase1890, /Philippinen — spanische Kolonie/, 120.98, 14.6));
  pruefe('Weltmacht-Karte: Manila liegt 1917 und 1945 in den Vereinigten Staaten',
    liegtIn(phase1917, USA, 120.98, 14.6) && liegtIn(phase1945, USA, 120.98, 14.6));

  pruefe('Weltmacht-Karte: Pearl Harbor liegt 1890 im Königreich Hawaii',
    liegtIn(phase1890, /Königreich Hawaii/, -157.95, 21.35));
  pruefe('Weltmacht-Karte: Pearl Harbor liegt 1917 und 1945 in den Vereinigten Staaten',
    liegtIn(phase1917, USA, -157.95, 21.35) && liegtIn(phase1945, USA, -157.95, 21.35));

  pruefe('Weltmacht-Karte: Seoul liegt 1890 im Königreich Korea',
    liegtIn(phase1890, /Königreich Korea/, 126.978, 37.5665));
  pruefe('Weltmacht-Karte: Seoul liegt 1917 im Kaiserreich Japan (Annexion 1910)',
    liegtIn(phase1917, JAPAN, 126.978, 37.5665));
  pruefe('Weltmacht-Karte: Seoul liegt 1945 südlich des 38. Breitengrads',
    liegtIn(phase1945, /Korea südlich/, 126.978, 37.5665) &&
    !liegtIn(phase1945, /Korea nördlich/, 126.978, 37.5665));
  pruefe('Weltmacht-Karte: Pjöngjang liegt 1945 nördlich des 38. Breitengrads',
    liegtIn(phase1945, /Korea nördlich/, 125.7625, 39.0392) &&
    !liegtIn(phase1945, /Korea südlich/, 125.7625, 39.0392));

  pruefe('Weltmacht-Karte: Taipei liegt 1917 im Kaiserreich Japan',
    liegtIn(phase1917, JAPAN, 121.5654, 25.033));
  pruefe('Weltmacht-Karte: Taipei liegt 1945 NICHT mehr in Japan, sondern in der Republik China',
    !liegtIn(phase1945, JAPAN, 121.5654, 25.033) && liegtIn(phase1945, /Republik China/, 121.5654, 25.033));

  pruefe('Weltmacht-Karte: Guam liegt 1890 bei den spanischen Marianen, nicht bei den USA',
    liegtIn(phase1890, /Marianen/, 144.75, 13.45) && !liegtIn(phase1890, USA, 144.75, 13.45));
  pruefe('Weltmacht-Karte: Guam liegt 1917 und 1945 bei den USA',
    liegtIn(phase1917, USA, 144.75, 13.45) && liegtIn(phase1945, USA, 144.75, 13.45));

  pruefe('Weltmacht-Karte: Hiroshima liegt in jeder Phase in Japan',
    karte.phasen.every((p) => liegtIn(p, JAPAN, 132.46, 34.39)));

  // --- 4. Atlas-Gegenprobe -----------------------------------------------
  const kuestenpunkte = karte.basis
    .filter((teil) => teil.art === 'land')
    .flatMap((teil) => eckpunkte(teil.d));
  pruefe('Weltmacht-Karte: es gibt Küstenlinien zu prüfen', kuestenpunkte.length > 400);

  /** Abstand einer geografischen Landmarke zur nächsten gezeichneten Küste. */
  const abstandZurKueste = (lon, lat) => {
    const [x, y] = geo.punkt(pazifisch(lon), lat);
    return kuestenpunkte.reduce(
      (naechster, [kx, ky]) => Math.min(naechster, Math.hypot(kx - x, ky - y)),
      Infinity,
    );
  };

  // Toleranz ein voller Längengrad — bei 5 SVG-Einheiten je Grad die
  // gröbste Karte der App. Die Werte unten liegen absichtlich mindestens
  // 0,1 Grad NEBEN dem nächsten Eckpunkt des Kartenmoduls, damit die
  // gezeichnete Linie geprüft wird und nicht die abgeschriebene Zahl.
  const TOLERANZ = EINHEITEN_JE_GRAD;
  const landmarken = [
    ['Los Angeles', -118.24, 34.05],
    ['San Diego', -117.16, 32.72],
    ['Tijuana', -117.03, 32.53],
    ['Dutch Harbor auf den Aleuten', -166.54, 53.89],
    ['Honolulu (Oahu)', -157.86, 21.31],
    ['Hilo (Big Island)', -155.09, 19.71],
    ['Manila-Stadt', 120.98, 14.6],
    ['Cebu-Stadt', 123.9, 10.3],
    ['Yokohama in der Bucht von Tokio', 139.65, 35.44],
    ['Shanghai', 121.47, 31.23],
    ['Guangzhou', 113.26, 23.13],
    ['Hagåtña auf Guam', 144.75, 13.48],
    ['Saipan-Stadt', 145.75, 15.21],
    ['Wake (Atoll-Mitte)', 166.63, 19.28],
    ['Kwajalein (Atoll-Mitte)', 167.73, 8.72],
    ['Midway (Atoll-Mitte)', -177.37, 28.2],
  ];
  for (const [name, lon, lat] of landmarken) {
    pruefe(`Weltmacht-Karte: ${name} liegt auf der gezeichneten Küste`,
      abstandZurKueste(lon, lat) < TOLERANZ);
  }

  // Und die Gegenprobe zur Gegenprobe: Keiner dieser Orte darf zugleich ein
  // Eckpunkt des Kartenmoduls sein, sonst prüft der Test seine eigene Vorlage.
  pruefe('Weltmacht-Karte: keine Landmarke ist als Eckpunkt abgeschrieben',
    landmarken.every(([, lon, lat]) => abstandZurKueste(lon, lat) > EINHEITEN_JE_GRAD * 0.1));

  // Im Binnenland und auf offener See darf keine Küste liegen, sonst wäre der
  // Test durch schiere Punktdichte immer erfüllt.
  const abseits = [
    ['mitten in den USA (Kansas)', -98.0, 39.0],
    ['mitten in Kanada', -105.0, 55.0],
    ['mitten in Sibirien', 135.0, 55.0],
    ['mitten in China', 108.0, 32.0],
    ['mitten im offenen Pazifik', -160.0, 35.0],
    ['mitten im Beringmeer', -178.0, 60.0],
    ['mitten in der Mongolei', 105.0, 46.0],
    ['mitten in Mexiko', -102.0, 24.0],
  ];
  for (const [wo, lon, lat] of abseits) {
    pruefe(`Weltmacht-Karte: ${wo} liegt keine Küste`,
      abstandZurKueste(lon, lat) > TOLERANZ * 2);
  }

  // --- 5. Der Untergrund ---------------------------------------------------
  pruefe('Weltmacht-Karte: jede Landmasse ist ein geschlossener Pfad',
    karte.basis.filter((teil) => teil.art === 'land').every((teil) => teil.d.trim().endsWith('Z')));
  pruefe('Weltmacht-Karte: mindestens zwölf Landmassen und Inseln sind gezeichnet',
    karte.basis.filter((teil) => teil.art === 'land').length >= 12);
  pruefe('Weltmacht-Karte: mindestens fünf Flüsse sind gezeichnet',
    karte.basis.filter((teil) => teil.art === 'fluss').length >= 5);
  const grund = karte.basis[0];
  pruefe('Weltmacht-Karte: das Meer liegt als Untergrund unter allem',
    grund.art === 'grund' && grund.d.includes(String(karte.breite)));

  // --- 6. Die Info-Punkte --------------------------------------------------
  const punkte = Object.fromEntries(karte.punkte.map((punkt) => [punkt.id, punkt]));
  for (const id of ['san-francisco', 'pearl-harbor', 'manila', 'guam', 'midway', 'hiroshima', 'tokio']) {
    pruefe(`Weltmacht-Karte: „${id}" ist ein Info-Punkt`, Boolean(punkte[id]));
  }
  pruefe('Weltmacht-Karte: Pearl Harbor nennt Datum und Zahl der Toten des Angriffs',
    punkte['pearl-harbor'].text.includes('7. Dezember 1941') && punkte['pearl-harbor'].text.includes('2 400'));
  pruefe('Weltmacht-Karte: Manila nennt den Philippinisch-Amerikanischen Krieg',
    punkte.manila.text.includes('Philippinisch-') && punkte.manila.text.includes('200 000'));
  pruefe('Weltmacht-Karte: Hiroshima benennt die Bombe als unbequemste Stelle der amerikanischen Erzählung',
    punkte.hiroshima.text.includes('unbequemste Stelle') && punkte.hiroshima.text.includes('amerikanischen Erzählung'));
  pruefe('Weltmacht-Karte: Guam nennt die Chamorro und die japanische Besetzung',
    punkte.guam.text.includes('Chamorro') && punkte.guam.text.includes('1941'));
  pruefe('Weltmacht-Karte: San Francisco nennt den Chinese Exclusion Act',
    punkte['san-francisco'].text.includes('Chinese Exclusion Act'));

  // --- 7. Die Bewegungen ----------------------------------------------------
  const bewegung = Object.fromEntries(karte.bewegungen.map((b) => [b.id, b]));
  for (const id of ['dewey-1898', 'pearl-harbor-angriff', 'inselspringen', 'atombombe']) {
    pruefe(`Weltmacht-Karte: die Bewegung „${id}" ist da`, Boolean(bewegung[id]));
  }
  const beiPunkt = (paar, id) =>
    Math.hypot(paar[0] - punkte[id].x, paar[1] - punkte[id].y) < 1;

  pruefe('Weltmacht-Karte: Deweys Geschwader endet bei Manila',
    beiPunkt(bewegung['dewey-1898'].nach, 'manila'));
  pruefe('Weltmacht-Karte: Deweys Geschwader nennt die versenkte spanische Flotte',
    bewegung['dewey-1898'].text.includes('1. Mai') && bewegung['dewey-1898'].text.includes('spanische Flotte'));

  pruefe('Weltmacht-Karte: der Angriff auf Pearl Harbor endet bei Pearl Harbor',
    beiPunkt(bewegung['pearl-harbor-angriff'].nach, 'pearl-harbor'));
  pruefe('Weltmacht-Karte: der Angriff auf Pearl Harbor nennt das Datum 7. Dezember 1941',
    bewegung['pearl-harbor-angriff'].text.includes('7. Dezember 1941'));

  pruefe('Weltmacht-Karte: die Atombomben-Bewegung endet bei Hiroshima',
    beiPunkt(bewegung.atombombe.nach, 'hiroshima'));
  pruefe('Weltmacht-Karte: die Atombomben-Bewegung nennt Tinian als Startpunkt',
    bewegung.atombombe.text.includes('Tinian'));

  // --- 8. Beschriftungen -----------------------------------------------------
  const beschriftungen = karte.beschriftungen || [];
  const texte = beschriftungen.map((b) => b.text);
  for (const name of [
    'Pazifischer Ozean', 'Vereinigte Staaten', 'Alaska', 'Kanada', 'Mexiko',
    'Hawaii', 'Japan', 'Korea', 'China', 'Philippinen',
  ]) {
    pruefe(`Weltmacht-Karte: „${name}" ist beschriftet`, texte.includes(name));
  }
  pruefe('Weltmacht-Karte: es gibt Beschriftungen für Land und Meer',
    beschriftungen.some((b) => b.art === 'land') && beschriftungen.some((b) => b.art === 'meer'));

  // --- 9. Zusammenspiel mit dem Lernformat -----------------------------------
  pruefe('Lernformat: „Die USA: Aufstieg zur Weltmacht" zeigt den Karten-Abschnitt',
    abschnitteFuer(thema).some((a) => a.id === 'karte'));
  pruefe('Lernformat: der Karten-Abschnitt steht direkt hinter dem Aufhänger',
    abschnitteFuer(thema).findIndex((a) => a.id === 'karte') === 1);

  // --- 10. Das Modul selbst -------------------------------------------------
  // Runde 17 legt nur die Sicht der USA an (Opus); die Sicht derer, die die
  // Weltmacht zu spüren bekamen, ergänzt Hermes danach. Der generische
  // Schema-Test in tests/themen.mjs nimmt alle Perspektiven automatisch mit —
  // hier steht nur, was für dieses Thema besonders gilt.
  const weltmacht = thema.perspektiven.find((p) => p.id === 'weltmacht-sicht');
  pruefe('„Die USA: Aufstieg zur Weltmacht": die Sicht der USA ist da und stammt von Opus',
    Boolean(weltmacht) && weltmacht.stimme === 'Opus');
  pruefe('„Die USA: Aufstieg zur Weltmacht": die Perspektive nennt sich gleichwertig zur zweiten Stimme',
    weltmacht.text.includes('gleichwertig'));
  pruefe('„Die USA: Aufstieg zur Weltmacht": die Perspektive öffnet die Tür zur zweiten Stimme',
    weltmacht.text.includes('zweiten Stimme') && weltmacht.text.includes('Weltmacht zu spüren bekamen'));

  // Die Stationen des Kapitels.
  for (const stichwort of [
    'Frontier', 'Chinese Exclusion Act', 'American Dream', 'Maine',
    'Philippinisch-Amerikanische', 'Mark Twain', 'Anti-Imperialistische Liga',
    'Roosevelt-Corollary', 'Big Stick', 'Panamakanal', 'Bananenrepublik',
    'Zimmermann-Depesche', '6. April 1917', '14 Punkte', 'Völkerbund',
    'New Deal', 'Neutralitätsgesetze', 'Lend-Lease', '7. Dezember 1941',
    'Arsenal der Demokratie', 'D-Day', 'Hiroshima', 'Nagasaki', 'Jim Crow',
  ]) {
    pruefe(`„Die USA: Aufstieg zur Weltmacht": die Perspektive erzählt von „${stichwort}"`,
      weltmacht.text.includes(stichwort));
  }

  // TONE-REGEL für sensible Themen (CLAUDE.md): Die eigene Erzählung muss ihre
  // unbequemen Stellen selbst benennen, statt sie der Gegenstimme zu
  // überlassen — und sie darf die andere Seite nicht verunglimpfen.
  pruefe('„Die USA: Aufstieg zur Weltmacht": die Perspektive benennt den Philippinisch-Amerikanischen Krieg mit Opferzahl',
    weltmacht.text.includes('Philippinisch-Amerikanische Krieg') && weltmacht.text.includes('200 000'));
  pruefe('„Die USA: Aufstieg zur Weltmacht": die Perspektive benennt Jim Crow und die Rassentrennung',
    weltmacht.text.includes('Jim Crow') && weltmacht.text.includes('Rassentrennung'));
  pruefe('„Die USA: Aufstieg zur Weltmacht": die Perspektive benennt die Atombombe als unbequemste Stelle',
    weltmacht.text.includes('unbequemste Stelle der ganzen Erzählung'));
  pruefe('„Die USA: Aufstieg zur Weltmacht": die Perspektive benennt den Rückzug aus dem eigenen Völkerbund',
    weltmacht.text.includes('lehnte') && weltmacht.text.includes('Völkerbund'));
  pruefe('„Die USA: Aufstieg zur Weltmacht": die Perspektive benennt die „Big Stick"-Politik und den Begriff „Bananenrepublik" selbst',
    weltmacht.text.includes('Bananenrepublik') && weltmacht.text.includes('an der die USA selbst mitwirkten'));
  // Und sie erklärt die Gegenseite nicht zu bloßen Statisten: die
  // Beweggründe der philippinischen Unabhängigkeitsbewegung und die
  // internationale Wahrnehmung von Wilsons Idealismus werden fair genannt.
  pruefe('„Die USA: Aufstieg zur Weltmacht": die Beweggründe der philippinischen Unabhängigkeitsbewegung werden fair wiedergegeben',
    weltmacht.text.includes('Aguinaldo') && weltmacht.text.includes('zunächst einen Verbündeten'));
  pruefe('„Die USA: Aufstieg zur Weltmacht": Wilsons Idealismus wird als von Europa ernst genommen fair eingeordnet',
    weltmacht.text.includes('aufrichtigen amerikanischen Idealismus'));

  // Solange nur eine Stimme dasteht, muss die Synthese das sagen. Die Prüfung
  // ist zustandstolerant: Sie akzeptiert den Zwischenstand ebenso wie die
  // spätere Fassung, die alle Stimmen zusammenführt (Muster der Runden 8–16).
  const zweiteStimme = thema.perspektiven.find((p) => p.stimme === 'Hermes');
  if (!zweiteStimme) {
    pruefe('„Die USA: Aufstieg zur Weltmacht": die Synthese sagt offen, dass eine Sicht fehlt',
      thema.synthese.includes('vorläufig') && thema.synthese.includes('fehlt noch'));
  } else {
    pruefe('„Die USA: Aufstieg zur Weltmacht": die Synthese führt die Sichtweisen zusammen',
      thema.synthese.includes('USA') && !thema.synthese.includes('fehlt noch'));
  }

  pruefe('„Die USA: Aufstieg zur Weltmacht" hat 3 bis 5 Quizfragen',
    thema.quiz.length >= 3 && thema.quiz.length <= 5);
  pruefe('„Die USA: Aufstieg zur Weltmacht": jede Quizfrage hat eine gültige richtige Antwort',
    thema.quiz.every((f) => typeof f.antworten[f.richtig] === 'string'));
  pruefe('„Die USA: Aufstieg zur Weltmacht": jede Quizfrage wird erklärt',
    thema.quiz.every((f) => f.erklaerung.trim().length > 40));
  // Die Quizfragen bleiben Wissensfragen: keine Schuldfrage — auch das Wort
  // selbst darf im Quiz nicht vorkommen.
  const quizText = thema.quiz.map((f) => `${f.frage} ${f.antworten.join(' ')} ${f.erklaerung}`).join(' ');
  pruefe('„Die USA: Aufstieg zur Weltmacht": keine Quizfrage (und keine Erklärung) nennt das Wort „Schuld"',
    !/[Ss]chuld/.test(quizText));
  pruefe('„Die USA: Aufstieg zur Weltmacht": das Urteil ist offen gestellt', thema.urteil.frage.includes('?'));
  pruefe('„Die USA: Aufstieg zur Weltmacht": das Urteil bekommt einen Denkanstoß',
    typeof thema.urteil.hinweis === 'string' && thema.urteil.hinweis.length > 40);

  pruefe('„Die USA: Aufstieg zur Weltmacht" steht als Modul 15 hinter dem Weg zum Ersten Weltkrieg',
    alleThemen[14] === thema && alleThemen[13].id === 'weg-zum-ersten-weltkrieg');
}
