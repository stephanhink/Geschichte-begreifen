// Prüfungen für die Karte zum Thema „Die USA: Unabhängigkeit und die
// Vertreibung der Indianer" — und für das, was das Themen-Modul an der Karte
// hängen hat.
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe:
// läuft mit blankem `node`.
//
// Das Karten-Schema und die Rechenwerkzeuge aus utils/karte-geo.js prüft
// tests/karte.mjs — hier geht es nur um diese eine Karte:
//   1. Vollständigkeit und Aufbau (Phasen, Punkte, Bewegungen, Beschriftungen).
//   2. Atlas-Gegenprobe: Liegen bekannte Kaps und Buchten von Niederkalifornien
//      bis zur Bay of Fundy auf der gezeichneten Küste? Und liegt mitten im
//      Kontinent oder auf offener See keine?
//   3. Die Aussage steckt in der Geometrie: 1776 stehen neben den Dreizehn
//      Kolonien auch die Länder der Haudenosaunee und der Nationen des
//      Südostens auf der Karte — und verschwinden nach der Vertreibung. Das
//      Gebiet der jungen Nation wächst über alle drei Phasen, das spanische
//      bzw. mexikanische Gebiet schrumpft bis auf null.
//   4. Die Bewegungen hängen an den Info-Punkten: der Pfad der Tränen beginnt
//      in New Echota, der Oregon Trail endet am Columbia.
//   5. TONE-REGEL für sensible Themen (CLAUDE.md): Die Perspektive muss ihre
//      unbequemen Stellen selbst benennen, die Beweggründe der Stämme fair
//      wiedergeben — und weder die Karte noch das Quiz dürfen nach Schuld
//      oder Besitz fragen.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { pruefeKarte, KARTEN_PUNKT_TYPEN } = require('../utils/themen/schema.js');
const { erstelleProjektion } = require('../utils/karte-geo.js');
const { themaNachId, alleThemen } = require('../utils/themen/index.js');
const { abschnitteFuer } = require('../utils/lernformat.js');

/**
 * Der Kartenausschnitt, wie ihn utils/themen/karten/usa-unabhaengigkeit.js
 * aufspannt. Steht hier noch einmal, damit die Atlas-Gegenprobe unten rechnen
 * kann — dass er stimmt, prüft der Test über die daraus folgende Höhe.
 */
const RAHMEN = { minLon: -125, maxLon: -65, minLat: 25, maxLat: 50, breite: 700 };

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
 * Der Flächeninhalt aller Flächen einer Phase, deren Titel passt.
 *
 * @param {object} phase
 * @param {RegExp} muster
 * @returns {number} 0, wenn keine Fläche passt
 */
function groesseVon(phase, muster) {
  return phase.flaechen
    .filter((f) => muster.test(f.titel))
    .reduce((summe, f) => summe + flaecheninhalt(eckpunkte(f.d)), 0);
}

/**
 * @param {(name: string, ok: boolean) => void} pruefe Prüf-Funktion des Rahmens
 */
export function laufe(pruefe) {
  const thema = themaNachId('usa-unabhaengigkeit');
  pruefe('„Die USA: Unabhängigkeit und die Vertreibung der Indianer" ist als Thema registriert', Boolean(thema));
  const karte = thema.karte;
  pruefe('„Die USA" bringt eine Karte mit', Boolean(karte));

  // --- 1. Aufbau ---------------------------------------------------------
  pruefe('USA-Karte: erfüllt das Karten-Schema', pruefeKarte(karte).length === 0);
  pruefe('USA-Karte: hat mindestens 3 Phasen', karte.phasen.length >= 3);
  pruefe('USA-Karte: hat genau 3 Phasen — 1776, 1830–1839, 1890', karte.phasen.length === 3);
  pruefe('USA-Karte: hat 6 bis 7 Info-Punkte',
    karte.punkte.length >= 6 && karte.punkte.length <= 7);
  pruefe('USA-Karte: hat 2 bis 4 Bewegungen',
    karte.bewegungen.length >= 2 && karte.bewegungen.length <= 4);
  pruefe('USA-Karte: jeder Punkt-typ ist ein bekannter',
    karte.punkte.every((p) => KARTEN_PUNKT_TYPEN.includes(p.typ)));
  pruefe('USA-Karte: jeder Info-Punkt hat einen ausgeführten Text',
    karte.punkte.every((p) => p.text.trim().length > 200));
  pruefe('USA-Karte: jede Bewegung hat einen ausgeführten Text',
    karte.bewegungen.every((b) => b.text.trim().length > 200));
  pruefe('USA-Karte: jede Phase erklärt sich in einem Hinweis',
    karte.phasen.every((p) => typeof p.hinweis === 'string' && p.hinweis.length > 40));
  pruefe('USA-Karte: die Phasen-ids sind eindeutig',
    new Set(karte.phasen.map((p) => p.id)).size === karte.phasen.length);

  // Die drei Stationen des Kapitels.
  const labels = karte.phasen.map((p) => p.label).join(' | ');
  for (const jahr of ['1776', '1830', '1839', '1890']) {
    pruefe(`USA-Karte: die Jahreszahl ${jahr} steht auf dem Umschalter`, labels.includes(jahr));
  }

  // Alles muss im Bild liegen — ein Punkt außerhalb wäre unantippbar.
  const imBild = ([x, y]) => x >= 0 && x <= karte.breite && y >= 0 && y <= karte.hoehe;
  pruefe('USA-Karte: alle Info-Punkte liegen im Bild',
    karte.punkte.every((p) => imBild([p.x, p.y])));
  pruefe('USA-Karte: alle Bewegungen liegen im Bild',
    karte.bewegungen.every((b) => [b.von, b.nach, ...(b.ueber || [])].every(imBild)));
  pruefe('USA-Karte: alle Beschriftungen liegen im Bild',
    (karte.beschriftungen || []).every((b) => imBild([b.x, b.y])));

  // --- 2. Die Erzählung steckt in der Geometrie --------------------------
  const [phase1776, phase1830, phase1890] = karte.phasen;

  // Die junge Nation heißt in Phase 1 „Dreizehn Kolonien", danach „Vereinigte
  // Staaten" — ihre Fläche muss über alle drei Phasen wachsen.
  const NATION = /Dreizehn Kolonien|Vereinigten Staaten/;
  const nation = karte.phasen.map((p) => groesseVon(p, NATION));
  pruefe('USA-Karte: die Fläche der jungen Nation wächst über alle drei Phasen',
    nation[0] > 0 && nation[1] > nation[0] && nation[2] > nation[1]);
  pruefe('USA-Karte: 1890 reicht die Fläche von Meer zu Meer — deutlich größer als 1830',
    nation[2] > nation[1] * 1.5);

  // 1776 stehen die Länder der Haudenosaunee und der Nationen des Südostens
  // gleichberechtigt neben den Dreizehn Kolonien auf der Karte — die Karte
  // behauptet nicht, das Land sei leer gewesen.
  pruefe('USA-Karte: 1776 steht das Land der Haudenosaunee auf der Karte',
    groesseVon(phase1776, /Haudenosaunee/) > 0);
  pruefe('USA-Karte: 1776 stehen die Nationen des Südostens auf der Karte',
    groesseVon(phase1776, /Nationen des Südostens/) > 0);
  // Nach der Vertreibung verschwinden beide Flächen vom Umschalter — genau
  // das erzählt die Bewegung „Der Pfad der Tränen".
  pruefe('USA-Karte: nach 1830 gibt es die Haudenosaunee-Fläche nicht mehr',
    groesseVon(phase1830, /Haudenosaunee/) === 0 && groesseVon(phase1890, /Haudenosaunee/) === 0);
  pruefe('USA-Karte: nach 1830 gibt es die Fläche der Südost-Nationen nicht mehr',
    groesseVon(phase1830, /Nationen des Südostens/) === 0 &&
    groesseVon(phase1890, /Nationen des Südostens/) === 0);

  // Das Indianerterritorium entsteht erst mit der Zwangsumsiedlung.
  pruefe('USA-Karte: 1776 gibt es noch kein Indianerterritorium',
    groesseVon(phase1776, /Indianerterritorium/) === 0);
  pruefe('USA-Karte: ab 1830 steht das Indianerterritorium auf der Karte und bleibt bis 1890',
    groesseVon(phase1830, /Indianerterritorium/) > 0 && groesseVon(phase1890, /Indianerterritorium/) > 0);

  // Spanien, dann Mexiko, verlieren über die drei Phasen ihr gesamtes Gebiet
  // im Ausschnitt — bis die USA 1890 den ganzen Kontinent bis zum Pazifik
  // einnehmen.
  const FREMDE_MACHT = /Spanisch|Mexiko/;
  const fremd = karte.phasen.map((p) => groesseVon(p, FREMDE_MACHT));
  pruefe('USA-Karte: 1776 hält eine fremde Macht den größten Teil des Westens',
    fremd[0] > nation[0]);
  pruefe('USA-Karte: das Gebiet der fremden Macht schrumpft von Phase zu Phase',
    fremd[1] < fremd[0] && fremd[2] < fremd[1]);
  pruefe('USA-Karte: 1890 gibt es kein spanisches oder mexikanisches Gebiet mehr im Ausschnitt',
    fremd[2] === 0);

  // Das Pine-Ridge-Reservat steht erst 1890 auf der Karte — datiert, klein,
  // ohne Wertung (Zusatzregel für sensible Themen).
  pruefe('USA-Karte: das Pine-Ridge-Reservat steht nur 1890 auf der Karte',
    groesseVon(phase1776, /Pine-Ridge/) === 0 &&
    groesseVon(phase1830, /Pine-Ridge/) === 0 &&
    groesseVon(phase1890, /Pine-Ridge/) > 0);
  pruefe('USA-Karte: das Pine-Ridge-Reservat trägt sein Gründungsjahr im Titel',
    phase1890.flaechen.some((f) => /Pine-Ridge/.test(f.titel) && f.titel.includes('1889')));
  pruefe('USA-Karte: der Hinweis von 1776 benennt die Lücke zwischen Appalachen und Mississippi selbst',
    phase1776.hinweis.includes('keine Grenze') || phase1776.hinweis.includes('bewohnt'));

  // --- 3. Atlas-Gegenprobe -----------------------------------------------
  const geo = erstelleProjektion(RAHMEN);
  pruefe('USA-Karte: die Höhe passt zum angenommenen Ausschnitt', geo.hoehe === karte.hoehe);
  pruefe('USA-Karte: die Breite passt zum angenommenen Ausschnitt', geo.breite === karte.breite);

  const kuestenpunkte = karte.basis
    .filter((teil) => teil.art === 'land')
    .flatMap((teil) => eckpunkte(teil.d));
  pruefe('USA-Karte: es gibt Küstenlinien zu prüfen', kuestenpunkte.length > 80);

  /** Abstand einer geografischen Landmarke zur nächsten gezeichneten Küste. */
  const abstandZurKueste = (lon, lat) => {
    const [x, y] = geo.punkt(lon, lat);
    return kuestenpunkte.reduce(
      (naechster, [kx, ky]) => Math.min(naechster, Math.hypot(kx - x, ky - y)),
      Infinity,
    );
  };

  // Toleranz ein voller Längengrad — der grobe Maßstab dieser
  // Übersichtskarte (11,7 Einheiten je Grad; zum Vergleich: die
  // Europakarten kommen mit 0,6 aus, sie sind gut zweimal so fein). Die
  // Werte unten liegen absichtlich mindestens 0,1 Grad NEBEN dem nächsten
  // Eckpunkt des Kartenmoduls, damit die gezeichnete Linie geprüft wird und
  // nicht die abgeschriebene Zahl.
  const TOLERANZ = EINHEITEN_JE_GRAD;
  const landmarken = [
    ['San Diego', -117.17, 32.72],
    ['Long Beach in Kalifornien', -118.19, 33.77],
    ['Gaviota an der kalifornischen Küste', -120.13, 34.47],
    ['Half Moon Bay südlich von San Francisco', -122.43, 37.46],
    ['Shelter Cove bei Cape Mendocino', -123.98, 40.02],
    ['Long Beach im Bundesstaat Washington', -124.06, 46.35],
    ['Neah Bay an der Straße von Juan de Fuca', -124.62, 48.37],
    ['Boston', -71.06, 42.36],
    ['Provincetown auf Cape Cod', -70.19, 42.05],
    ['Atlantic Highlands an der New Yorker Bucht', -74.07, 40.42],
    ['Cape Hatteras', -75.4, 35.2],
    ['Folly Beach bei Charleston', -79.94, 32.65],
    ['die Biscayne Bay bei Miami', -80.22, 25.68],
    ['Marathon in den Florida Keys', -81.09, 24.71],
    ['Clearwater am Golf von Mexiko', -82.8, 27.97],
    ['die Mündung des Mississippi', -89.3, 29.1],
    ['Freeport in Texas', -95.36, 28.95],
    ['Port Isabel an der Rio-Grande-Mündung', -97.21, 26.07],
    ['San Quintín in Niederkalifornien', -115.95, 30.48],
    ['Todos Santos in Niederkalifornien', -110.22, 23.45],
    ['San José del Cabo an der Südspitze der Halbinsel', -109.7, 23.06],
  ];
  for (const [name, lon, lat] of landmarken) {
    pruefe(`USA-Karte: ${name} liegt auf der gezeichneten Küste`,
      abstandZurKueste(lon, lat) < TOLERANZ);
  }

  // Und die Gegenprobe zur Gegenprobe: Keiner dieser Orte darf zugleich ein
  // Eckpunkt des Kartenmoduls sein, sonst prüft der Test seine eigene Vorlage.
  pruefe('USA-Karte: keine Landmarke ist als Eckpunkt abgeschrieben',
    landmarken.every(([, lon, lat]) => abstandZurKueste(lon, lat) > EINHEITEN_JE_GRAD * 0.1));

  // Im Binnenland und auf offener See darf keine Küste liegen, sonst wäre der
  // Test durch schiere Punktdichte immer erfüllt.
  const abseits = [
    ['mitten in Kansas', -98, 39],
    ['im Great Basin von Nevada', -117, 40],
    ['mitten im offenen Atlantik', -68, 32],
    ['mitten im offenen Pazifik', -128, 35],
    ['mitten im Golf von Mexiko', -90, 25.7],
    ['in den zentralen Rocky Mountains', -108, 41],
  ];
  for (const [wo, lon, lat] of abseits) {
    pruefe(`USA-Karte: ${wo} liegt keine Küste`,
      abstandZurKueste(lon, lat) > TOLERANZ * 2);
  }

  // --- 4. Der Untergrund ---------------------------------------------------
  pruefe('USA-Karte: der Kontinent ist als ein geschlossener Pfad gezeichnet',
    karte.basis.filter((teil) => teil.art === 'land').every((teil) => teil.d.trim().endsWith('Z')));
  pruefe('USA-Karte: die Großen Seen sind als eigene Wasserflächen gezeichnet',
    karte.basis.filter((teil) => teil.art === 'wasser').length === 5);
  pruefe('USA-Karte: mindestens fünf Flüsse sind gezeichnet',
    karte.basis.filter((teil) => teil.art === 'fluss').length >= 5);
  const grund = karte.basis[0];
  pruefe('USA-Karte: das Meer liegt als Untergrund unter allem',
    grund.art === 'grund' && grund.d.includes(String(karte.breite)));

  // --- 5. Die Info-Punkte --------------------------------------------------
  const punkte = Object.fromEntries(karte.punkte.map((p) => [p.id, p]));
  for (const id of [
    'boston', 'philadelphia', 'new-echota', 'new-orleans',
    'fort-laramie', 'little-bighorn', 'wounded-knee',
  ]) {
    pruefe(`USA-Karte: „${id}" ist ein Info-Punkt`, Boolean(punkte[id]));
  }
  pruefe('USA-Karte: New Echota nennt den Vertrag von 1835 und den Protest der Cherokee',
    punkte['new-echota'].text.includes('1835') && punkte['new-echota'].text.includes('John Ross'));
  pruefe('USA-Karte: New Echota benennt die Cherokee-Institutionen fair',
    punkte['new-echota'].text.includes('Verfassung') && punkte['new-echota'].text.includes('Sequoyah'));
  pruefe('USA-Karte: New Orleans nennt den Louisiana Purchase',
    punkte['new-orleans'].text.includes('1803') && punkte['new-orleans'].text.includes('Jefferson'));
  pruefe('USA-Karte: Fort Laramie benennt den Vertragsbruch bei den Black Hills',
    punkte['fort-laramie'].text.includes('1868') && punkte['fort-laramie'].text.includes('Black Hills'));
  pruefe('USA-Karte: Wounded Knee nennt Opferzahlen und das Wort „Massaker"',
    punkte['wounded-knee'].text.includes('300') && punkte['wounded-knee'].text.includes('Massaker'));
  pruefe('USA-Karte: Philadelphia benennt Sklaverei und die Souveränität der Stämme',
    punkte.philadelphia.text.includes('versklavte') && punkte.philadelphia.text.includes('fremden Mächten'));

  // --- 6. Die Bewegungen ----------------------------------------------------
  const bewegung = Object.fromEntries(karte.bewegungen.map((b) => [b.id, b]));
  for (const id of ['trail-of-tears', 'oregon-trail', 'california-trail']) {
    pruefe(`USA-Karte: die Bewegung „${id}" ist da`, Boolean(bewegung[id]));
  }
  const beiPunkt = (paar, id) =>
    Math.hypot(paar[0] - punkte[id].x, paar[1] - punkte[id].y) < 1;

  pruefe('USA-Karte: der Pfad der Tränen beginnt in New Echota',
    beiPunkt(bewegung['trail-of-tears'].von, 'new-echota'));
  pruefe('USA-Karte: der Pfad der Tränen führt nach Westen ins Indianerterritorium',
    bewegung['trail-of-tears'].nach[0] < bewegung['trail-of-tears'].von[0]);
  pruefe('USA-Karte: der Pfad der Tränen nennt die Zahl der Toten',
    bewegung['trail-of-tears'].text.includes('4 000'));
  pruefe('USA-Karte: der Pfad der Tränen nennt weitere betroffene Nationen',
    bewegung['trail-of-tears'].text.includes('Muskogee') && bewegung['trail-of-tears'].text.includes('Seminolen'));

  pruefe('USA-Karte: der Oregon Trail läuft über Fort Laramie',
    (bewegung['oregon-trail'].ueber || []).some((punkt) => beiPunkt(punkt, 'fort-laramie')));
  pruefe('USA-Karte: der Oregon Trail führt nach Westen an den Pazifik',
    bewegung['oregon-trail'].nach[0] < bewegung['oregon-trail'].von[0]);
  pruefe('USA-Karte: der Oregon Trail benennt seine Folgen für die Plains-Nationen',
    bewegung['oregon-trail'].text.includes('Büffelherden'));

  pruefe('USA-Karte: der California Trail zweigt beim Oregon Trail ab',
    bewegung['california-trail'].von[0] === bewegung['oregon-trail'].ueber[3][0] &&
    bewegung['california-trail'].von[1] === bewegung['oregon-trail'].ueber[3][1]);
  pruefe('USA-Karte: der California Trail benennt die Folgen für die kalifornischen Nationen',
    bewegung['california-trail'].text.includes('Kalifornien') && /1848|1849/.test(bewegung['california-trail'].text));

  // --- 7. Beschriftungen -----------------------------------------------------
  const beschriftungen = karte.beschriftungen || [];
  const texte = beschriftungen.map((b) => b.text);
  for (const name of [
    'Atlantikküste', 'Appalachen', 'Große Seen', 'Mississippi', 'Prärie',
    'Rocky Mountains', 'Kalifornien', 'Golf von Mexiko',
  ]) {
    pruefe(`USA-Karte: „${name}" ist beschriftet`, texte.includes(name));
  }
  pruefe('USA-Karte: es gibt Beschriftungen für Land und Meer',
    beschriftungen.some((b) => b.art === 'land') && beschriftungen.some((b) => b.art === 'meer'));

  // --- 8. Zusammenspiel mit dem Lernformat -----------------------------------
  pruefe('Lernformat: „Die USA" zeigt den Karten-Abschnitt',
    abschnitteFuer(thema).some((a) => a.id === 'karte'));
  pruefe('Lernformat: der Karten-Abschnitt steht direkt hinter dem Aufhänger',
    abschnitteFuer(thema).findIndex((a) => a.id === 'karte') === 1);

  // --- 9. Das Modul selbst -----------------------------------------------
  // Runde 13 legt nur die Sicht der Siedler und der jungen Nation an (Opus);
  // die Sicht der Stämme ergänzt Hermes danach. Der generische Schema-Test in
  // tests/themen.mjs nimmt alle Perspektiven automatisch mit — hier steht nur,
  // was für dieses Thema besonders gilt.
  const siedler = thema.perspektiven.find((p) => p.id === 'siedler-sicht');
  pruefe('„Die USA": die Siedler-Sicht ist da und stammt von Opus',
    Boolean(siedler) && siedler.stimme === 'Opus');
  pruefe('„Die USA": die Perspektive nennt sich gleichwertig zur zweiten Stimme',
    siedler.text.includes('gleichwertig'));
  pruefe('„Die USA": die Perspektive öffnet die Tür zur zweiten Stimme',
    siedler.text.includes('zweite') && siedler.text.includes('Stämme'));

  // Die Stationen des Kapitels.
  for (const stichwort of [
    '1776', 'Unabhängigkeitserklärung', 'Verfassung', '1787', 'Frontier',
    'Louisiana', '1803', 'Oregon Trail', 'Indian Removal Act', '1830',
    'New Echota', 'Trail of Tears', 'Little Bighorn', 'Wounded Knee',
    'Manifest Destiny',
  ]) {
    pruefe(`„Die USA": die Perspektive erzählt von „${stichwort}"`, siedler.text.includes(stichwort));
  }

  // TONE-REGEL für sensible Themen (CLAUDE.md): Die eigene Erzählung muss ihre
  // unbequemen Stellen selbst benennen, statt sie der Gegenstimme zu
  // überlassen — und sie darf die andere Seite nicht verunglimpfen.
  pruefe('„Die USA": die Perspektive benennt die feindselige Formulierung in der Unabhängigkeitserklärung selbst',
    siedler.text.includes('gnadenlosen indianischen Wilden') || siedler.text.includes('Wilde'));
  pruefe('„Die USA": die Perspektive benennt die gebrochenen Verträge selbst',
    siedler.text.includes('gebrochen'));
  pruefe('„Die USA": die Perspektive benennt die gezielte Ausrottung der Büffelherden als Kriegsmittel',
    siedler.text.includes('Sheridan') && siedler.text.includes('Waffe'));
  pruefe('„Die USA": die Perspektive benennt Wounded Knee als Massaker, nicht als Sieg',
    siedler.text.includes('Massaker'));
  pruefe('„Die USA": die Perspektive räumt mit dem Wort „freies Land" der Frontier-Erzählung selbst auf',
    siedler.text.includes('frei war das Land nicht'));
  // Und sie erklärt die Gegenseite nicht zu bloßen Opfern ohne eigenes
  // Handeln: Souveränität, Verfassung und Widerstand der Stämme stehen
  // ausdrücklich da.
  pruefe('„Die USA": die Beweggründe und die politische Eigenständigkeit der Stämme werden fair wiedergegeben',
    siedler.text.includes('John Ross') && siedler.text.includes('protestierten'));
  pruefe('„Die USA": der Widerstand der Seminolen wird benannt',
    siedler.text.includes('Seminolen') && siedler.text.includes('Widerstand'));

  // Solange nur eine Stimme dasteht, muss die Synthese das sagen. Die Prüfung
  // ist zustandstolerant: Sie akzeptiert den Zwischenstand ebenso wie die
  // spätere Fassung, die beide Stimmen zusammenführt (Muster der Runden 8–12).
  const zweiteStimme = thema.perspektiven.find((p) => p.stimme === 'Hermes');
  if (!zweiteStimme) {
    pruefe('„Die USA": die Synthese sagt offen, dass eine Sicht fehlt',
      thema.synthese.includes('noch nicht fertig') && thema.synthese.includes('Stämme'));
  } else {
    pruefe('„Die USA": die Synthese führt beide Sichtweisen zusammen',
      thema.synthese.includes('Stämme') && thema.synthese.includes('Siedler'));
  }

  pruefe('„Die USA" hat 3 bis 5 Quizfragen',
    thema.quiz.length >= 3 && thema.quiz.length <= 5);
  pruefe('„Die USA": jede Quizfrage hat eine gültige richtige Antwort',
    thema.quiz.every((f) => typeof f.antworten[f.richtig] === 'string'));
  pruefe('„Die USA": jede Quizfrage wird erklärt',
    thema.quiz.every((f) => f.erklaerung.trim().length > 40));
  // Die Quizfragen bleiben Wissensfragen: keine Schuldfrage, keine Frage
  // danach, wem ein Land gehört (Zusatzregel für sensible Themen).
  const quizText = thema.quiz.map((f) => `${f.frage} ${f.antworten.join(' ')}`).join(' ');
  pruefe('„Die USA": keine Quizfrage fragt nach Schuld oder Besitz',
    !/[Ss]chuld|gehört|Recht auf|wem geh/.test(quizText));
  pruefe('„Die USA": das Urteil ist offen gestellt', thema.urteil.frage.includes('?'));
  pruefe('„Die USA": das Urteil fragt nach dem Freiheitsversprechen, nicht nach der Schuld',
    thema.urteil.frage.includes('Freiheit') && !/[Ss]chuld/.test(thema.urteil.frage));
  pruefe('„Die USA": das Urteil bekommt einen Denkanstoß',
    typeof thema.urteil.hinweis === 'string' && thema.urteil.hinweis.length > 40);
  pruefe('„Die USA" steht als Modul 11 hinter dem Dreißigjährigen Krieg',
    alleThemen[10] === thema && alleThemen[9].id === 'dreissigjaehriger-krieg');
}
