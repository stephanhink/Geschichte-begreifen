// Prüfungen für die Karte zum Thema „Der Dreißigjährige Krieg" — und für das,
// was das Themen-Modul an der Karte hängen hat.
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe:
// läuft mit blankem `node`.
//
// Das Karten-Schema und die Rechenwerkzeuge aus utils/karte-geo.js prüft
// tests/karte.mjs — hier geht es nur um diese eine Karte:
//   1. Vollständigkeit und Aufbau (Phasen, Punkte, Bewegungen, Beschriftungen).
//   2. Atlas-Gegenprobe: Liegen bekannte Häfen von Brest bis zur Newamündung
//      auf der gezeichneten Küste? Und liegt mitten in Böhmen keine?
//   3. Die Aussage steckt in der Geometrie: Das Reich ist KEINE Fläche,
//      sondern eine Linie — innerhalb davon lagen über dreihundert
//      Herrschaften. Was die Phasen einfärben, hatte wirklich Grenzen. Und
//      der schwedische Vormarsch von 1631/32 sagt im eigenen Titel, dass er
//      kein Staatsgebiet war.
//   4. Der Friede von 1648 ist nachrechenbar: Habsburg verliert die Lausitz,
//      Frankreich gewinnt im Elsass, Schweden sitzt zum ersten Mal selbst im
//      Reich, die Niederlande und die Schweiz sind heraus.
//   5. TONE-REGEL (CLAUDE.md, Zusatzregel für sensible Themen, sinngemäß auf
//      die Konfessionsfrage angewandt): Die Perspektive muss die unbequemen
//      Stellen der eigenen Erzählung selbst benennen, die Beweggründe der
//      anderen Seite fair wiedergeben, keine Seite dämonisieren — und keine
//      Quizfrage fragt nach Schuld.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { pruefeKarte, KARTEN_PUNKT_TYPEN } = require('../utils/themen/schema.js');
const { erstelleProjektion } = require('../utils/karte-geo.js');
const { themaNachId, alleThemen } = require('../utils/themen/index.js');
const { abschnitteFuer } = require('../utils/lernformat.js');

/**
 * Der Kartenausschnitt, wie ihn utils/themen/karten/dreissigjaehriger-krieg.js
 * aufspannt. Steht hier noch einmal, damit die Atlas-Gegenprobe unten rechnen
 * kann — dass er stimmt, prüft der Test über die daraus folgende Höhe.
 */
const RAHMEN = { minLon: -5, maxLon: 30, minLat: 42, maxLat: 60, breite: 700 };

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
 * Liegt ein Punkt innerhalb eines Vielecks? (Strahlenverfahren.)
 *
 * Gebraucht für die Probe, was der schwedische Vormarsch von 1631/32 umfasst
 * und was nicht — Bohemia und Wien liegen ausdrücklich außerhalb.
 */
function imPolygon([x, y], ecken) {
  let drin = false;
  for (let i = 0, j = ecken.length - 1; i < ecken.length; j = i, i += 1) {
    const [xi, yi] = ecken[i];
    const [xj, yj] = ecken[j];
    const schneidet = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (schneidet) drin = !drin;
  }
  return drin;
}

/**
 * @param {(name: string, ok: boolean) => void} pruefe Prüf-Funktion des Rahmens
 */
export function laufe(pruefe) {
  const thema = themaNachId('dreissigjaehriger-krieg');
  pruefe('„Der Dreißigjährige Krieg" ist als Thema registriert', Boolean(thema));
  const karte = thema.karte;
  pruefe('„Der Dreißigjährige Krieg" bringt eine Karte mit', Boolean(karte));

  // --- 1. Aufbau ---------------------------------------------------------
  pruefe('Kriegs-Karte: erfüllt das Karten-Schema', pruefeKarte(karte).length === 0);
  pruefe('Kriegs-Karte: hat mindestens 3 Phasen', karte.phasen.length >= 3);
  pruefe('Kriegs-Karte: hat 3 Phasen — 1618, 1631/32, 1648', karte.phasen.length === 3);
  pruefe('Kriegs-Karte: hat 6 bis 7 Info-Punkte',
    karte.punkte.length >= 6 && karte.punkte.length <= 7);
  pruefe('Kriegs-Karte: hat 2 bis 4 Bewegungen',
    karte.bewegungen.length >= 2 && karte.bewegungen.length <= 4);
  pruefe('Kriegs-Karte: jeder Punkt-typ ist ein bekannter',
    karte.punkte.every((punkt) => KARTEN_PUNKT_TYPEN.includes(punkt.typ)));
  // Jeder Info-Punkt trägt Hintergrundwissen — die Karte ist die Bühne, die
  // Texte stehen dahinter. Ein Satz allein reicht dafür nicht.
  pruefe('Kriegs-Karte: jeder Info-Punkt hat einen ausgeführten Text',
    karte.punkte.every((punkt) => punkt.text.trim().length > 200));
  pruefe('Kriegs-Karte: jede Bewegung hat einen ausgeführten Text',
    karte.bewegungen.every((b) => b.text.trim().length > 200));
  pruefe('Kriegs-Karte: jede Phase erklärt sich in einem Hinweis',
    karte.phasen.every((phase) => typeof phase.hinweis === 'string' && phase.hinweis.length > 40));
  pruefe('Kriegs-Karte: die Phasen-ids sind eindeutig',
    new Set(karte.phasen.map((phase) => phase.id)).size === karte.phasen.length);

  // Die drei Stationen des Kapitels.
  const labels = karte.phasen.map((phase) => phase.label).join(' | ');
  for (const jahr of ['1618', '1631', '1632', '1648']) {
    pruefe(`Kriegs-Karte: die Jahreszahl ${jahr} steht auf dem Umschalter`, labels.includes(jahr));
  }

  // Alles muss im Bild liegen — ein Punkt außerhalb wäre unantippbar.
  const imBild = ([x, y]) => x >= 0 && x <= karte.breite && y >= 0 && y <= karte.hoehe;
  pruefe('Kriegs-Karte: alle Info-Punkte liegen im Bild',
    karte.punkte.every((punkt) => imBild([punkt.x, punkt.y])));
  pruefe('Kriegs-Karte: alle Bewegungen liegen im Bild',
    karte.bewegungen.every((b) => [b.von, b.nach, ...(b.ueber || [])].every(imBild)));
  pruefe('Kriegs-Karte: alle Beschriftungen liegen im Bild',
    (karte.beschriftungen || []).every((b) => imBild([b.x, b.y])));

  // --- 2. Das Reich ist eine Linie, keine Fläche -------------------------
  // Die zentrale Festlegung dieser Karte: Über dreihundert Herrschaften lassen
  // sich nicht als ein Block einfärben, ohne einen Staat zu behaupten, den es
  // nicht gab. Deshalb liegt die Reichsgrenze im Untergrund — und in keiner
  // Phase steht eine Fläche „Heiliges Römisches Reich".
  const grenze = karte.basis.find((teil) => teil.art === 'reichsgrenze');
  pruefe('Kriegs-Karte: die Reichsgrenze liegt als Linie im Untergrund', Boolean(grenze));
  pruefe('Kriegs-Karte: die Reichsgrenze ist eine Linie und keine Fläche',
    grenze.fill === 'none' && !grenze.d.trim().endsWith('Z'));
  const alleTitel = karte.phasen.flatMap((phase) => phase.flaechen.map((f) => f.titel));
  pruefe('Kriegs-Karte: keine Phase färbt das Reich als Block ein',
    alleTitel.every((titel) => !/Heiliges Römisches Reich/.test(titel)));
  pruefe('Kriegs-Karte: der Hinweis von 1618 sagt selbst, warum das Reich keine Fläche ist',
    karte.phasen[0].hinweis.includes('Flickenteppich') &&
    karte.phasen[0].hinweis.includes('Reichsgrenze'));

  // --- 3. Die Erzählung steckt in der Geometrie --------------------------
  const [phase1618, phase1631, phase1648] = karte.phasen;

  const HABSBURG = /habsburgischen Länder/;
  const FRANKREICH = /Königreich Frankreich/;
  const habsburg = karte.phasen.map((phase) => groesseVon(phase, HABSBURG));
  const frankreich = karte.phasen.map((phase) => groesseVon(phase, FRANKREICH));

  pruefe('Kriegs-Karte: die habsburgischen Länder stehen auf jeder Phase',
    habsburg.every((groesse) => groesse > 0));
  // 1635 ging die Lausitz im Prager Frieden an Kursachsen — der Kaiser bezahlt
  // den Seitenwechsel des wichtigsten protestantischen Kurfürsten mit Land.
  pruefe('Kriegs-Karte: Habsburg ist 1648 kleiner als 1618 (die Lausitz fehlt)',
    habsburg[2] < habsburg[0]);
  pruefe('Kriegs-Karte: 1618 und 1631 ist das habsburgische Gebiet dasselbe',
    habsburg[0] === habsburg[1]);
  // Frankreich bekommt 1648 die habsburgischen Rechte im Elsass.
  pruefe('Kriegs-Karte: Frankreich steht auf jeder Phase',
    frankreich.every((groesse) => groesse > 0));
  pruefe('Kriegs-Karte: Frankreich ist 1648 größer als 1618 (das Elsass)',
    frankreich[2] > frankreich[0]);

  // Schweden sitzt erst nach 1648 selbst im Reich — vorher war es Besatzer.
  const SCHWEDEN_IM_REICH = /Schweden im Reich/;
  pruefe('Kriegs-Karte: 1618 hat Schweden kein Gebiet im Reich',
    !phase1618.flaechen.some((f) => SCHWEDEN_IM_REICH.test(f.titel)));
  pruefe('Kriegs-Karte: 1631 hat Schweden kein Gebiet im Reich',
    !phase1631.flaechen.some((f) => SCHWEDEN_IM_REICH.test(f.titel)));
  pruefe('Kriegs-Karte: 1648 sitzt Schweden selbst im Reich',
    phase1648.flaechen.some((f) => SCHWEDEN_IM_REICH.test(f.titel)));
  pruefe('Kriegs-Karte: die schwedischen Gewinne sind Vorpommern, Wismar, Bremen und Verden',
    phase1648.flaechen.some((f) =>
      SCHWEDEN_IM_REICH.test(f.titel) &&
      f.titel.includes('Vorpommern') && f.titel.includes('Wismar') && f.titel.includes('Bremen')));

  // Die Niederlande und die Schweiz scheiden 1648 förmlich aus dem Reich aus.
  const titel1648 = phase1648.flaechen.map((f) => f.titel).join(' | ');
  pruefe('Kriegs-Karte: 1648 sind die Niederlande nicht mehr Teil des Reiches',
    /Niederlande — seit 1648 nicht mehr Teil des Reiches/.test(titel1648));
  pruefe('Kriegs-Karte: 1648 ist die Schweiz aus dem Reich gelöst',
    /Eidgenossenschaft — seit 1648 aus dem Reich gelöst/.test(titel1648));

  // Polen-Litauen steht auf jeder Phase — die große Macht im Osten, die in
  // unserer Erzählung fast nie vorkommt und die den Beginn des schwedischen
  // Eingreifens um Jahre verzögert hat.
  pruefe('Kriegs-Karte: Polen-Litauen steht auf jeder Phase',
    karte.phasen.every((phase) => groesseVon(phase, /Polen-Litauen/) > 0));

  // Der schwedische Vormarzsch ist die einzige Fläche, die keine Herrschaft
  // mit Grenzen zeigt — und sie sagt das im eigenen Titel.
  const vormarsch = phase1631.flaechen.find((f) => /Reichweite der schwedischen Heere/.test(f.titel));
  pruefe('Kriegs-Karte: 1631/32 zeigt die Reichweite der schwedischen Heere', Boolean(vormarsch));
  pruefe('Kriegs-Karte: der Titel sagt selbst, dass das kein Staatsgebiet ist',
    vormarsch.titel.includes('kein Staatsgebiet'));
  pruefe('Kriegs-Karte: auch der Hinweis der Phase sagt es',
    phase1631.hinweis.includes('kein Staatsgebiet') && phase1631.hinweis.includes('Kontributionen'));

  // Und die Probe aufs Exempel: Der Vormarsch reicht von der Ostsee bis an die
  // Donau, lässt Böhmen und Wien aber aus.
  const geo = erstelleProjektion(RAHMEN);
  const vormarschEcken = eckpunkte(vormarsch.d);
  pruefe('Kriegs-Karte: der Vormarsch reicht bis nach Leipzig',
    imPolygon(geo.punkt(12.37, 51.34), vormarschEcken));
  pruefe('Kriegs-Karte: der Vormarsch reicht bis nach Bayern',
    imPolygon(geo.punkt(11.43, 48.76), vormarschEcken));
  pruefe('Kriegs-Karte: der Vormarsch reicht an den Rhein bei Mainz',
    imPolygon(geo.punkt(8.5, 50.1), vormarschEcken));
  pruefe('Kriegs-Karte: Böhmen bleibt außerhalb des Vormarschgebiets',
    !imPolygon(geo.punkt(14.42, 50.09), vormarschEcken));
  pruefe('Kriegs-Karte: Wien bleibt außerhalb des Vormarschgebiets',
    !imPolygon(geo.punkt(16.37, 48.21), vormarschEcken));
  pruefe('Kriegs-Karte: der Hinweis nennt den sächsischen Winter in Prag',
    phase1631.hinweis.includes('Prag'));

  // --- 4. Atlas-Gegenprobe -----------------------------------------------
  // Die Vorgabe des Betreibers lautet: Die Regionen müssen erkennbar sein,
  // keine abstrakte Skizze. Die Küstenlinien stehen im Kartenmodul als echte
  // Längen-/Breitengrade — wenn bekannte Häfen auf der gezeichneten Küste
  // liegen, ist die Karte ein Atlas und keine Fantasie.
  pruefe('Kriegs-Karte: die Höhe passt zum angenommenen Ausschnitt', geo.hoehe === karte.hoehe);
  pruefe('Kriegs-Karte: die Breite passt zum angenommenen Ausschnitt', geo.breite === karte.breite);

  // Nur Küsten — Flüsse würden die Probe verwässern, weil sie mitten im Land
  // liegen.
  const kuestenpunkte = karte.basis
    .filter((teil) => teil.art === 'land')
    .flatMap((teil) => eckpunkte(teil.d));
  pruefe('Kriegs-Karte: es gibt Küstenlinien zu prüfen', kuestenpunkte.length > 300);

  /** Abstand einer geografischen Landmarke zur nächsten gezeichneten Küste. */
  const abstandZurKueste = (lon, lat) => {
    const [x, y] = geo.punkt(lon, lat);
    return kuestenpunkte.reduce(
      (naechster, [kx, ky]) => Math.min(naechster, Math.hypot(kx - x, ky - y)),
      Infinity,
    );
  };

  // Toleranz 0,6 Längengrad wie bei den anderen Europakarten — diese hier ist
  // mit 20 Einheiten je Grad sogar die feinste von ihnen. Die Werte unten
  // liegen absichtlich alle mindestens 0,1 Grad NEBEN dem nächsten Eckpunkt
  // des Kartenmoduls: So prüft der Test die gezeichnete Linie und nicht die
  // abgeschriebene Zahl.
  const TOLERANZ = EINHEITEN_JE_GRAD * 0.6;
  const landmarken = [
    ['Le Havre an der Seinemündung', -0.1, 49.49],
    ['Saint-Malo an der bretonischen Nordküste', -2.02, 48.65],
    ['Brest an der Westspitze der Bretagne', -4.49, 48.39],
    ['La Rochelle an der Biskaya', -1.15, 46.16],
    ['San Sebastián am Golf von Biskaya', -1.98, 43.32],
    ['Zeebrügge an der flandrischen Küste', 3.2, 51.33],
    ['Scheveningen bei Den Haag', 4.27, 52.1],
    ['Enkhuizen an der Zuiderzee', 5.29, 52.7],
    ['Norderney vor der ostfriesischen Küste', 7.15, 53.71],
    ['Ribe an der jütischen Westküste', 8.76, 55.33],
    ['Aalborg am Limfjord', 9.92, 57.05],
    ['Grenaa an der jütischen Ostküste', 10.87, 56.42],
    ['Travemünde an der Lübecker Bucht', 10.87, 53.96],
    ['Barth an der pommerschen Küste', 12.72, 54.36],
    ['Stolpmünde in Hinterpommern', 16.86, 54.58],
    ['Gdingen an der Danziger Bucht', 18.53, 54.52],
    ['Polangen an der kurischen Küste', 21.07, 55.92],
    ['Windau in Kurland', 21.56, 57.4],
    ['der Strand von Jūrmala bei Riga', 23.77, 56.97],
    ['Hapsal an der estnischen Westküste', 23.54, 58.94],
    ['die Narwamündung', 28.04, 59.47],
    ['Stockholm an der Ostsee', 18.07, 59.33],
    ['Kalmar am Kalmarsund', 16.36, 56.66],
    ['Ystad an der Südküste Schonens', 13.82, 55.43],
    ['Uddevalla in Bohuslän', 11.93, 58.35],
    ['Fredrikstad am Oslofjord', 10.93, 59.22],
    ['Arendal an der norwegischen Südküste', 8.77, 58.46],
    ['Scarborough an der englischen Ostküste', -0.4, 54.28],
    ['Southend an der Themsemündung', 0.71, 51.54],
    ['Brighton am Ärmelkanal', -0.14, 50.82],
    ['Cardiff im Bristolkanal', -3.18, 51.46],
    ['Blackpool an der Irischen See', -3.05, 53.82],
    ['St Andrews an der schottischen Ostküste', -2.79, 56.34],
    ['Zadar an der dalmatinischen Küste', 15.23, 44.12],
    ['Venedig an der Lagune', 12.34, 45.44],
    ['Livorno an der ligurischen See', 10.3, 43.55],
    ['Palavas bei Montpellier', 3.93, 43.52],
    ['Burgas am Schwarzen Meer', 27.47, 42.49],
  ];
  for (const [name, lon, lat] of landmarken) {
    pruefe(`Kriegs-Karte: ${name} liegt auf der gezeichneten Küste`,
      abstandZurKueste(lon, lat) < TOLERANZ);
  }

  // Und die Gegenprobe zur Gegenprobe: Keiner dieser Orte darf zugleich ein
  // Eckpunkt des Kartenmoduls sein, sonst prüft der Test seine eigene Vorlage.
  pruefe('Kriegs-Karte: keine Landmarke ist als Eckpunkt abgeschrieben',
    landmarken.every(([, lon, lat]) => abstandZurKueste(lon, lat) > EINHEITEN_JE_GRAD * 0.1));

  // Im Binnenland und auf offener See darf keine Küste liegen, sonst wäre der
  // Test durch schiere Punktdichte immer erfüllt. Der erste Kontrollpunkt ist
  // die Bühne dieses Kapitels: mitten in Böhmen.
  const abseits = [
    ['mitten in Böhmen', 14.5, 49.8],
    ['in Bayern nördlich der Donau', 11.4, 48.9],
    ['in Thüringen', 11.0, 51.0],
    ['in Großpolen', 18.5, 52.0],
    ['im Wiener Becken', 16.4, 48.2],
    ['im ungarischen Tiefland', 19.5, 47.0],
    ['in den Karpaten', 23.0, 48.0],
    ['in Burgund', 4.5, 47.3],
    ['im Zentralmassiv', 3.0, 45.2],
    ['in Mittelschweden', 15.0, 60.0],
    ['in der Nordsee zwischen England und Jütland', 3.5, 56.0],
    ['im Atlantik westlich der Bretagne', -4.5, 46.5],
  ];
  for (const [wo, lon, lat] of abseits) {
    pruefe(`Kriegs-Karte: ${wo} liegt keine Küste`, abstandZurKueste(lon, lat) > TOLERANZ * 2);
  }

  // --- 5. Der Untergrund --------------------------------------------------
  const landflaechen = karte.basis.filter((teil) => teil.art === 'land');
  pruefe('Kriegs-Karte: Kontinent, Skandinavien, Britannien und die Ostsee-Inseln sind getrennt',
    landflaechen.length >= 10);
  pruefe('Kriegs-Karte: jede Landmasse ist ein geschlossener Pfad',
    landflaechen.every((teil) => teil.d.trim().endsWith('Z')));
  // Die Flüsse sind hier nicht Zierde: An ihnen marschierten die Heere, und an
  // ihnen liegen fast alle Orte dieses Kapitels.
  pruefe('Kriegs-Karte: die Flüsse des Kapitels sind gezeichnet',
    karte.basis.filter((teil) => teil.art === 'fluss').length >= 10);
  const grund = karte.basis[0];
  pruefe('Kriegs-Karte: das Meer liegt als Untergrund unter allem',
    grund.art === 'grund' && grund.d.includes(String(karte.breite)));

  // --- 6. Die Info-Punkte -------------------------------------------------
  const punkte = Object.fromEntries(karte.punkte.map((punkt) => [punkt.id, punkt]));
  for (const id of ['prag', 'wien', 'magdeburg', 'breitenfeld', 'luetzen', 'muenster-osnabrueck', 'rocroi']) {
    pruefe(`Kriegs-Karte: „${id}" ist ein Info-Punkt`, Boolean(punkte[id]));
  }
  // y wächst nach unten: kleineres y heißt weiter nördlich.
  pruefe('Kriegs-Karte: Wien ist der östlichste Punkt',
    karte.punkte.every((punkt) => punkt.id === 'wien' || punkt.x < punkte.wien.x));
  pruefe('Kriegs-Karte: Rocroi ist der westlichste Punkt',
    karte.punkte.every((punkt) => punkt.id === 'rocroi' || punkt.x > punkte.rocroi.x));
  pruefe('Kriegs-Karte: Magdeburg liegt nördlich der beiden Schlachtfelder',
    punkte.magdeburg.y < punkte.breitenfeld.y && punkte.magdeburg.y < punkte.luetzen.y);
  pruefe('Kriegs-Karte: Breitenfeld liegt nördlich von Lützen',
    punkte.breitenfeld.y < punkte.luetzen.y);

  // TONE-REGEL: Die Punkte müssen die unbequemen Stellen selbst benennen — und
  // sie dürfen nicht behaupten, was die Forschung offenlässt.
  pruefe('Kriegs-Karte: Prag nennt den Majestätsbrief und den Weißen Berg',
    punkte.prag.text.includes('Majestätsbrief') && punkte.prag.text.includes('Weißen Berg'));
  pruefe('Kriegs-Karte: Wien erklärt, warum das Restitutionsedikt eine Bombe war',
    punkte.wien.text.includes('Restitutionsedikt') && punkte.wien.text.includes('Kurfürsten'));
  pruefe('Kriegs-Karte: Magdeburg lässt offen, was offen ist',
    punkte.magdeburg.text.includes('umstritten'));
  pruefe('Kriegs-Karte: Magdeburg benennt die Rechnung der Entscheider',
    punkte.magdeburg.text.includes('Entscheider') && punkte.magdeburg.text.includes('bezahlt'));
  pruefe('Kriegs-Karte: Breitenfeld sagt auch, dass der Sieg den Krieg verlängerte',
    punkte.breitenfeld.text.includes('verlängerte'));
  pruefe('Kriegs-Karte: Lützen benennt, dass der Tod des Feldherrn wenig änderte',
    punkte.luetzen.text.includes('Oxenstierna') && punkte.luetzen.text.includes('Eger'));
  pruefe('Kriegs-Karte: Münster und Osnabrück nennen Normaljahr und Kurwürde',
    punkte['muenster-osnabrueck'].text.includes('Normaljahr') &&
    punkte['muenster-osnabrueck'].text.includes('Kurwürde'));
  pruefe('Kriegs-Karte: Rocroi erklärt die Staatsräson',
    punkte.rocroi.text.includes('Staatsräson') && punkte.rocroi.text.includes('Richelieu'));

  // --- 7. Die Bewegungen --------------------------------------------------
  const bewegung = Object.fromEntries(karte.bewegungen.map((b) => [b.id, b]));
  for (const id of ['kaiserliche', 'gustav-adolf', 'franzosen']) {
    pruefe(`Kriegs-Karte: die Bewegung „${id}" ist da`, Boolean(bewegung[id]));
  }
  const beiPunkt = (paar, id) =>
    Math.hypot(paar[0] - punkte[id].x, paar[1] - punkte[id].y) < 1;
  const laeuftUeber = (b, id) => (b.ueber || []).some((punkt) => beiPunkt(punkt, id));

  pruefe('Kriegs-Karte: die Kaiserlichen ziehen nach Norden',
    bewegung.kaiserliche.nach[1] < bewegung.kaiserliche.von[1]);
  pruefe('Kriegs-Karte: der Zug der Kaiserlichen endet in Magdeburg',
    beiPunkt(bewegung.kaiserliche.nach, 'magdeburg'));
  pruefe('Kriegs-Karte: der Text nennt das System, das dahintersteckt',
    bewegung.kaiserliche.text.includes('Der Krieg ernährt den Krieg') &&
    bewegung.kaiserliche.text.includes('Kontributionen'));
  pruefe('Kriegs-Karte: der Text nennt es eine Entscheidung und kein Naturgesetz',
    bewegung.kaiserliche.text.includes('Entscheidung') &&
    bewegung.kaiserliche.text.includes('kein Naturgesetz'));

  pruefe('Kriegs-Karte: Gustav Adolf kommt von der Ostseeküste nach Süden',
    bewegung['gustav-adolf'].nach[1] > bewegung['gustav-adolf'].von[1]);
  pruefe('Kriegs-Karte: sein Weg läuft über Breitenfeld',
    laeuftUeber(bewegung['gustav-adolf'], 'breitenfeld'));
  pruefe('Kriegs-Karte: sein Weg endet in Lützen',
    beiPunkt(bewegung['gustav-adolf'].nach, 'luetzen'));
  // Der Umweg nach Süden ist Feldzug und keine Zierde: Der südlichste Punkt
  // des Weges liegt deutlich südlicher als sein Ende.
  pruefe('Kriegs-Karte: der Weg führt bis nach Bayern und wieder zurück',
    Math.max(...bewegung['gustav-adolf'].ueber.map(([, y]) => y)) >
      bewegung['gustav-adolf'].nach[1]);
  pruefe('Kriegs-Karte: sein Text nennt beide Beweggründe',
    bewegung['gustav-adolf'].text.includes('frommer Lutheraner') &&
    bewegung['gustav-adolf'].text.includes('Machtpolitiker'));
  pruefe('Kriegs-Karte: sein Text sagt auch, wovon seine Heere lebten',
    bewegung['gustav-adolf'].text.includes('vom Land'));
  pruefe('Kriegs-Karte: sein Text nennt den Waffenstillstand mit Polen als Voraussetzung',
    bewegung['gustav-adolf'].text.includes('Altmark'));

  pruefe('Kriegs-Karte: die Franzosen ziehen nach Nordosten',
    bewegung.franzosen.nach[0] > bewegung.franzosen.von[0] &&
    bewegung.franzosen.nach[1] < bewegung.franzosen.von[1]);
  pruefe('Kriegs-Karte: ihr Weg endet in Rocroi', beiPunkt(bewegung.franzosen.nach, 'rocroi'));
  pruefe('Kriegs-Karte: ihr Text nennt Richelieu, Bärwalde und die Staatsräson',
    bewegung.franzosen.text.includes('Richelieu') &&
    bewegung.franzosen.text.includes('Bärwalde') &&
    bewegung.franzosen.text.includes('Staatsräson'));

  // --- 8. Beschriftungen --------------------------------------------------
  const beschriftungen = karte.beschriftungen || [];
  const texte = beschriftungen.map((b) => b.text);
  for (const name of [
    'Böhmen', 'Sachsen', 'Bayern', 'Franken', 'Brandenburg', 'Pommern',
    'Niederlande', 'Frankreich', 'Dänemark', 'Schweden', 'Polen-Litauen',
    'Ostsee', 'Nordsee',
  ]) {
    pruefe(`Kriegs-Karte: „${name}" ist beschriftet`, texte.includes(name));
  }
  pruefe('Kriegs-Karte: es gibt Beschriftungen für Land und Meer',
    beschriftungen.some((b) => b.art === 'land') && beschriftungen.some((b) => b.art === 'meer'));

  // --- 9. Zusammenspiel mit dem Lernformat -------------------------------
  pruefe('Lernformat: „Der Dreißigjährige Krieg" zeigt den Karten-Abschnitt',
    abschnitteFuer(thema).some((a) => a.id === 'karte'));
  pruefe('Lernformat: der Karten-Abschnitt steht direkt hinter dem Aufhänger',
    abschnitteFuer(thema).findIndex((a) => a.id === 'karte') === 1);

  // --- 10. Das Modul selbst ----------------------------------------------
  // Runde 12 legt nur die Sicht der Entscheider an (Opus); die Sicht der
  // Betroffenen ergänzt Hermes danach. Der generische Schema-Test in
  // tests/themen.mjs nimmt alle Perspektiven automatisch mit — hier steht nur,
  // was für dieses Thema besonders gilt.
  const herrscher = thema.perspektiven.find((perspektive) => perspektive.id === 'herrscher-sicht');
  pruefe('„Dreißigjähriger Krieg": die Sicht der Entscheider ist da und stammt von Opus',
    Boolean(herrscher) && herrscher.stimme === 'Opus');
  pruefe('„Dreißigjähriger Krieg": die Perspektive gibt sich als Sicht der Entscheider zu erkennen',
    herrscher.text.includes('Sicht derer, die entschieden'));
  pruefe('„Dreißigjähriger Krieg": die Perspektive öffnet die Tür zur zweiten Stimme',
    herrscher.text.includes('zweiten Stimme') && herrscher.text.includes('Betroffenen'));
  // Und sie sagt ausdrücklich, dass die Reihenfolge keine Rangfolge ist —
  // dieselbe Zusage wie bei „Israel und Palästina" und bei Amerika.
  pruefe('„Dreißigjähriger Krieg": die Reihenfolge der Stimmen wird als willkürlich benannt',
    herrscher.text.includes('gleichwertig'));

  // Die Stationen des Kapitels.
  for (const stichwort of [
    '1618', 'Fenstersturz', 'Majestätsbrief', 'Weißen Berg', 'Ferdinand',
    'Augsburger Religionsfriede', 'cuius regio, eius religio', 'Restitutionsedikt',
    'Wallenstein', 'Friedland', 'Eger', 'Gustav Adolf', 'Breitenfeld', 'Lützen',
    'Magdeburg', 'Richelieu', 'Staatsräson', 'Rocroi', 'Westfälische',
    'Münster', 'Osnabrück', 'Normaljahr', 'Landeshoheit',
  ]) {
    pruefe(`„Dreißigjähriger Krieg": die Perspektive erzählt von „${stichwort}"`,
      herrscher.text.includes(stichwort));
  }

  // Die Vorgabe des Betreibers: der Krieg UND die Folgen für Europa.
  pruefe('„Dreißigjähriger Krieg": der Friede wird als Geburtsurkunde Europas erklärt',
    herrscher.text.includes('gleichberechtigte Vertragspartner'));
  pruefe('„Dreißigjähriger Krieg": die Perspektive erklärt, warum der Krieg so lange dauerte',
    herrscher.text.includes('Warum dreißig Jahre?'));

  // TONE-REGEL für sensible Themen (CLAUDE.md, sinngemäß): Die eigene
  // Erzählung muss ihre unbequemen Stellen selbst benennen, statt sie der
  // Gegenstimme zu überlassen — und keine Seite darf zur Karikatur werden.
  pruefe('„Dreißigjähriger Krieg": das Söldnersystem wird als eigene Entscheidung benannt',
    herrscher.text.includes('Der Krieg ernährt den Krieg') &&
    herrscher.text.includes('Es war eine Entscheidung'));
  pruefe('„Dreißigjähriger Krieg": die Perspektive gibt zu, dass sie Menschen als Posten führt',
    herrscher.text.includes('Nicht als Menschen'));
  pruefe('„Dreißigjähriger Krieg": die Zahlen stehen da — mit ihrer Unsicherheit',
    herrscher.text.includes('16 bis 18 Millionen') &&
    herrscher.text.includes('Die Zahlen') && herrscher.text.includes('umstritten'));
  pruefe('„Dreißigjähriger Krieg": Hunger und Seuchen stehen vor den Schlachten',
    herrscher.text.includes('nicht in Schlachten'));
  pruefe('„Dreißigjähriger Krieg": es wird gesagt, dass die Entscheider selbst kaum in Gefahr waren',
    herrscher.text.includes('selten in Lebensgefahr'));
  pruefe('„Dreißigjähriger Krieg": die Feldherren werden weder zu Helden noch zu Ungeheuern',
    herrscher.text.includes('keine Heiligen') && herrscher.text.includes('keine Ungeheuer'));
  // Fairness zur jeweils anderen Seite, INNERHALB dieser Perspektive: Die
  // Beweggründe beider Konfessionen werden ernst genommen, und die Fälle, die
  // nicht ins Schema passen, stehen ausdrücklich da.
  pruefe('„Dreißigjähriger Krieg": die Beweggründe der Aufständischen werden fair wiedergegeben',
    herrscher.text.includes('war das Notwehr'));
  pruefe('„Dreißigjähriger Krieg": auch Ferdinands Beweggründe werden ernst genommen',
    herrscher.text.includes('echter Überzeugung'));
  pruefe('„Dreißigjähriger Krieg": die Perspektive verwirft die einfache Formel vom reinen Glaubenskrieg',
    herrscher.text.includes('Religionskrieg') && herrscher.text.includes('Der Glaube war nicht nur Maske'));

  // Solange nur eine Stimme dasteht, muss die Synthese das sagen. Die Prüfung
  // ist zustandstolerant: Sie akzeptiert den Zwischenstand ebenso wie die
  // spätere Fassung, die beide Stimmen zusammenführt (Muster der Runden 8–11).
  const zweiteStimme = thema.perspektiven.find((perspektive) => perspektive.stimme === 'Hermes');
  if (!zweiteStimme) {
    pruefe('„Dreißigjähriger Krieg": die Synthese sagt offen, dass eine Sicht fehlt',
      thema.synthese.includes('noch nicht fertig') && thema.synthese.includes('Betroffenen'));
  } else {
    pruefe('„Dreißigjähriger Krieg": die Synthese führt beide Sichtweisen zusammen',
      thema.synthese.includes('Betroffenen') &&
      /Entscheider|Feldherren|Fürsten/.test(thema.synthese));
  }
  // Diese Zusage gilt in beiden Zuständen: Die Synthese ist mehr als ein Satz.
  pruefe('„Dreißigjähriger Krieg": die Synthese ist ausgeführt', thema.synthese.length > 600);

  pruefe('„Dreißigjähriger Krieg" hat 3 bis 5 Quizfragen',
    thema.quiz.length >= 3 && thema.quiz.length <= 5);
  pruefe('„Dreißigjähriger Krieg": jede Quizfrage hat eine gültige richtige Antwort',
    thema.quiz.every((frage) => typeof frage.antworten[frage.richtig] === 'string'));
  pruefe('„Dreißigjähriger Krieg": jede Quizfrage wird erklärt',
    thema.quiz.every((frage) => frage.erklaerung.trim().length > 40));
  // Die Quizfragen bleiben Wissensfragen: keine Schuldfrage, keine Frage
  // danach, wem ein Land gehört (Zusatzregel für sensible Themen).
  const quizText = thema.quiz.map((frage) => frage.frage).join(' ');
  pruefe('„Dreißigjähriger Krieg": keine Quizfrage fragt nach Schuld oder Besitz',
    !/[Ss]chuld|gehört|Recht auf|wem geh/.test(quizText));
  pruefe('„Dreißigjähriger Krieg": das Urteil ist offen gestellt', thema.urteil.frage.includes('?'));
  pruefe('„Dreißigjähriger Krieg": das Urteil fragt nach der Deutung, nicht nach der Schuld',
    thema.urteil.frage.includes('Religionskrieg') && thema.urteil.frage.includes('Machtkrieg') &&
    !/[Ss]chuld/.test(thema.urteil.frage));
  pruefe('„Dreißigjähriger Krieg": das Urteil bekommt einen Denkanstoß',
    typeof thema.urteil.hinweis === 'string' && thema.urteil.hinweis.length > 40);
  pruefe('„Dreißigjähriger Krieg" steht als Modul 10 hinter der Eroberung Amerikas',
    alleThemen[9] === thema && alleThemen[8].id === 'eroberung-amerikas');
}
