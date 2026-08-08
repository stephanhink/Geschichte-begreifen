// Geografie-Werkzeug für „Geschichte in Bewegung".
//
// Der Betreiber hat es deutlich gesagt: Die Karte muss die Regionen erkennen
// lassen — Italien als Stiefel, die Iberische Halbinsel, Britannien, das
// Mittelmeer. Geratene Pixelwerte geben das nicht her. Deshalb liegen die
// Küstenlinien in den Themen-Modulen als echte Längen-/Breitengrade
// (`[lon, lat]`, z. B. `[12.5, 41.9]` für Rom), und dieses Modul rechnet sie
// in SVG-Koordinaten um.
//
// Das hat drei Vorteile:
//   1. Die Daten sind im Repo nachprüfbar — wer einen Punkt anzweifelt,
//      schlägt die Koordinaten nach.
//   2. Küstenabschnitte lassen sich wiederverwenden: Dieselbe Punktliste
//      trägt die Landmasse und die Reichsgrenze, die ihr folgt.
//   3. Die Projektion ist an einer Stelle änderbar.
//
// Reine Fachlogik, keine UI-Importe (Architektur-Regel). CommonJS wie die
// übrigen utils, damit blankes `node` sie lädt.

/** Grad in Bogenmaß. */
const BOGENMASS = Math.PI / 180;

/**
 * Die Atlas-Palette der Karten.
 *
 * Sie steht hier und nicht in components/design.js, weil die Themen-Module
 * (utils/) sie brauchen und nichts aus components/ importieren dürfen. Die
 * Töne bleiben in der warmen Familie der App: Land in Sandbeige, Wasser in
 * einem gedämpften Blau, das Reich in Bernstein.
 */
const KARTENFARBEN = {
  meer: '#D8E7F0',
  land: '#F3E6CD',
  landRand: '#D2BB92',
  fluss: '#A9C6D6',
  /** Wüstenflächen — eine Spur tiefer als das Land, ohne aufdringlich zu sein. */
  wueste: '#EDDCB4',
  reich: '#C08A3E',
  reichRand: '#7C4A03',
  grenze: '#8A5212',
  /** Gebaute Grenzlinien (Große Mauer, Limes) — dunkel, nicht zu übersehen. */
  mauer: '#5B4632',
  /** Handelswege (Seidenstraße) — warm, aber leiser als das Reichsgebiet. */
  route: '#B5762B',
  punkt: '#7C4A03',
  punktRand: '#FFF8ED',
  schriftLand: '#6B5636',
  schriftWasser: '#5E7F92',
  /** Ein Ton je Bewegung (Völkerwanderung) — reihum vergeben. */
  bewegung: ['#9A4A28', '#4F5F3A', '#5A4A78'],
};

/** Rundet auf eine Nachkommastelle — hält die Pfad-Zeichenketten kurz. */
function runde(zahl) {
  return Math.round(zahl * 10) / 10;
}

/**
 * Kehrt einen Küstenabschnitt um.
 *
 * Küsten sind in eine Richtung notiert; eine Grenze läuft oft in die andere.
 * Gibt eine Kopie zurück, das Original bleibt unangetastet.
 *
 * @param {Array<Array<number>>} punkte
 * @returns {Array<Array<number>>}
 */
function rueckwaerts(punkte) {
  return punkte.slice().reverse();
}

/**
 * Hängt mehrere Punktlisten aneinander.
 *
 * Doppelte Nahtstellen (das Ende der einen Liste ist der Anfang der nächsten)
 * werden übersprungen — sonst stolpert die Glättung über zwei gleiche Punkte.
 *
 * @param {...Array<Array<number>>} listen
 * @returns {Array<Array<number>>}
 */
function verbinde(...listen) {
  const alle = [];
  for (const liste of listen) {
    for (const punkt of liste) {
      const letzter = alle[alle.length - 1];
      if (letzter && letzter[0] === punkt[0] && letzter[1] === punkt[1]) continue;
      alle.push(punkt);
    }
  }
  return alle;
}

/**
 * Baut aus SVG-Punkten eine Pfad-Zeichenkette.
 *
 * Mit `rund: true` (Vorgabe) werden die Ecken nach Catmull-Rom geglättet:
 * Küsten sehen dann nach Küste aus und nicht nach Vieleck. Die Glättung
 * greift nur zwischen den gegebenen Punkten — sie erfindet keine Buchten.
 *
 * @param {Array<Array<number>>} punkte SVG-Koordinaten [[x, y], …]
 * @param {{geschlossen?: boolean, rund?: boolean}} [optionen]
 * @returns {string} der Wert für das `d`-Attribut
 */
function zeichnePfad(punkte, optionen = {}) {
  const { geschlossen = true, rund = true } = optionen;
  const anzahl = punkte.length;
  if (anzahl === 0) return '';
  if (anzahl === 1) return `M ${runde(punkte[0][0])} ${runde(punkte[0][1])}`;

  const hole = (i) => {
    if (geschlossen) return punkte[((i % anzahl) + anzahl) % anzahl];
    return punkte[Math.min(Math.max(i, 0), anzahl - 1)];
  };

  let d = `M ${runde(punkte[0][0])} ${runde(punkte[0][1])}`;
  const letzteKante = geschlossen ? anzahl : anzahl - 1;

  for (let i = 0; i < letzteKante; i += 1) {
    const [x1, y1] = hole(i);
    const [x2, y2] = hole(i + 1);
    if (!rund) {
      d += ` L ${runde(x2)} ${runde(y2)}`;
      continue;
    }
    const [x0, y0] = hole(i - 1);
    const [x3, y3] = hole(i + 2);
    const c1x = x1 + (x2 - x0) / 6;
    const c1y = y1 + (y2 - y0) / 6;
    const c2x = x2 - (x3 - x1) / 6;
    const c2y = y2 - (y3 - y1) / 6;
    d += ` C ${runde(c1x)} ${runde(c1y)} ${runde(c2x)} ${runde(c2y)} ${runde(x2)} ${runde(y2)}`;
  }

  if (geschlossen) d += ' Z';
  return d;
}

/**
 * Die drei Eckpunkte einer Pfeilspitze am Ende einer Strecke.
 *
 * Gebraucht für die Bewegungen (Völkerwanderung): react-native-svg kennt
 * zwar Marker, aber ein selbst gerechnetes Dreieck verhält sich auf beiden
 * Plattformen gleich — und ist hier prüfbar.
 *
 * @param {Array<number>} von vorletzter Punkt [x, y] (gibt die Richtung)
 * @param {Array<number>} nach Spitze [x, y]
 * @param {number} [groesse] Länge der Spitze in SVG-Einheiten
 * @returns {Array<Array<number>>} drei Punkte: Spitze, linke Ecke, rechte Ecke
 */
function pfeilspitze(von, nach, groesse = 14) {
  const dx = nach[0] - von[0];
  const dy = nach[1] - von[1];
  const laenge = Math.sqrt(dx * dx + dy * dy) || 1;
  const ex = dx / laenge;
  const ey = dy / laenge;
  // Senkrechte zur Richtung — die halbe Breite der Spitze.
  const nx = -ey;
  const ny = ex;
  const fuss = [nach[0] - ex * groesse, nach[1] - ey * groesse];
  const halb = groesse * 0.45;
  return [
    [runde(nach[0]), runde(nach[1])],
    [runde(fuss[0] + nx * halb), runde(fuss[1] + ny * halb)],
    [runde(fuss[0] - nx * halb), runde(fuss[1] - ny * halb)],
  ];
}

/**
 * Erstellt die Projektion für einen Kartenausschnitt.
 *
 * Eine schlichte Plattkarte mit Breitengrad-Korrektur: Längengrade werden um
 * den Kosinus der mittleren Breite gestaucht. Dadurch behält der Ausschnitt
 * um das Mittelmeer die vertrauten Proportionen — Italien wird nicht breit
 * gequetscht, Britannien nicht in die Länge gezogen.
 *
 * Punkte außerhalb des Rahmens sind erlaubt und erwünscht: Landmassen laufen
 * so über den Bildrand hinaus, statt am Rand abzuknicken (die SVG-Fläche
 * schneidet den Überstand ab).
 *
 * @param {{minLon: number, maxLon: number, minLat: number, maxLat: number,
 *          breite: number}} rahmen
 * @returns {{breite: number, hoehe: number, x: Function, y: Function,
 *            punkt: Function, pfad: Function}}
 */
function erstelleProjektion(rahmen) {
  const { minLon, maxLon, minLat, maxLat, breite } = rahmen;
  const proLon = breite / (maxLon - minLon);
  const mitte = (minLat + maxLat) / 2;
  const proLat = proLon / Math.cos(mitte * BOGENMASS);
  const hoehe = runde((maxLat - minLat) * proLat);

  const x = (lon) => runde((lon - minLon) * proLon);
  const y = (lat) => runde((maxLat - lat) * proLat);
  const punkt = (lon, lat) => [x(lon), y(lat)];

  /**
   * Projiziert eine Liste geografischer Orte und baut daraus einen Pfad.
   *
   * @param {Array<Array<number>>} orte [[lon, lat], …]
   * @param {{geschlossen?: boolean, rund?: boolean}} [optionen]
   */
  const pfad = (orte, optionen) =>
    zeichnePfad(orte.map(([lon, lat]) => punkt(lon, lat)), optionen);

  return { breite, hoehe, x, y, punkt, pfad };
}

module.exports = {
  KARTENFARBEN,
  erstelleProjektion,
  pfeilspitze,
  rueckwaerts,
  runde,
  verbinde,
  zeichnePfad,
};
