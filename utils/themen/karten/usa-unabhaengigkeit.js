// Die Karte zum Thema „Die USA: Unabhängigkeit und die Vertreibung der
// Indianer" — Geschichte in Bewegung.
//
// Küstenlinien stehen als echte Längen-/Breitengrade `[lon, lat]` und werden
// von utils/karte-geo.js in SVG-Koordinaten umgerechnet. Wer einen Punkt
// anzweifelt, schlägt ihn im Atlas nach: `[-71.06, 42.36]` ist Boston,
// `[-89.25, 29.0]` die Mississippi-Mündung bei New Orleans.
//
// Ausschnitt: 125° W bis 65° W, 25° N bis 50° N — 700 × rund 367,6. Mit
// 11,7 SVG-Einheiten je Längengrad ist das eine grobe, weite Karte (zum
// Vergleich: die Levante-Karte hat 140, die Königreiche-Karte 16,3) — Absicht,
// denn die ganze Ausdehnung der Westexpansion von der Atlantikküste bis zum
// Pazifik muss auf ein Bild passen.
//
// Zwei Festlegungen, die aus der Zusatzregel für sensible Themen folgen
// (CLAUDE.md): Erstens zeigt Phase 1 (1776) nicht nur die Dreizehn Kolonien,
// sondern auch die Länder der Haudenosaunee (Irokesen-Konföderation) und der
// Nationen des Südostens (Cherokee, Muskogee, Choctaw, Chickasaw, Seminolen)
// als eigene, gleich behandelte Flächen — die Karte darf nicht so aussehen,
// als sei das Land vor der Ankunft der Siedler leer gewesen. Zweitens tragen
// die Reservate in Phase 3 ihr Gründungsjahr im Titel: datierte Zustände ohne
// Wertung, wie es die Regel verlangt.
//
// Reine Daten und Rechnung — keine UI-Importe (Architektur-Regel).

const { KARTENFARBEN, erstelleProjektion, rueckwaerts, verbinde } = require('../../karte-geo');

// ---------------------------------------------------------------------------
// Ausschnitt und Projektion
// ---------------------------------------------------------------------------

const RAHMEN = { minLon: -125, maxLon: -65, minLat: 25, maxLat: 50, breite: 700 };

const geo = erstelleProjektion(RAHMEN);

/** Kurzform: geografischer Ort → SVG-Punkt `[x, y]`. */
const p = (lon, lat) => geo.punkt(lon, lat);

/** Dasselbe als `{ x, y }` — die Form, die Punkte und Beschriftungen wollen. */
const ort = (lon, lat) => {
  const [x, y] = p(lon, lat);
  return { x, y };
};

// ---------------------------------------------------------------------------
// Küstenabschnitte — jeweils in einer Richtung notiert
// ---------------------------------------------------------------------------

/**
 * Die Pazifikküste: San Diego → Kanadische Grenze bei Vancouver.
 *
 * Von Süden nach Norden notiert, endet am 49. Breitengrad — der seit dem
 * Oregon-Vertrag von 1846 die Grenze zu Kanada ist.
 */
const PAZIFIK = [
  [-117.25, 32.53], // San Diego
  [-117.34, 32.86], // La Jolla
  [-117.39, 33.36], // Oceanside
  [-117.78, 33.5], // Dana Point
  [-118.27, 33.72], // San Pedro, der Hafen von Los Angeles
  [-118.49, 34.02], // Santa Monica
  [-119.29, 34.27], // Ventura
  [-119.7, 34.42], // Santa Barbara
  [-120.47, 34.45], // Point Conception
  [-120.64, 35.14], // Bucht von San Luis Obispo
  [-120.86, 35.37], // Morro Bay
  [-121.29, 36.6], // Monterey Bay
  [-122.03, 36.97], // Santa Cruz
  [-122.48, 37.81], // Golden Gate, San Francisco
  [-122.98, 38.0], // Point Reyes
  [-123.05, 38.32], // Bodega Bay
  [-123.74, 38.96], // Point Arena
  [-123.8, 39.45], // Fort Bragg
  [-124.1, 40.1],
  [-124.41, 40.44], // Cape Mendocino
  [-124.18, 40.8], // Humboldt Bay
  [-124.2, 41.75], // Crescent City
  [-124.4, 42.84], // Cape Blanco
  [-124.3, 43.4], // Coos Bay
  [-124.06, 44.64], // Newport
  [-123.97, 45.93], // Tillamook Head
  [-123.97, 46.25], // Mündung des Columbia — hier endete der Oregon Trail
  [-124.1, 46.9], // Grays Harbor
  [-124.73, 48.38], // Cape Flattery
  [-123.43, 48.12], // Port Angeles, an der Straße von Juan de Fuca
  [-122.75, 48.75], // Bellingham, San-Juan-Inseln
  [-122.75, 49.0], // die kanadische Grenze
];

/** Die kanadische Grenze und der Weg zurück zur Atlantikküste — unsichtbar oberhalb 50° N. */
const NORDSCHLUSS = [
  [-122.75, 50.3],
  [-114.1, 50.3],
  [-95.15, 50.3],
  [-68.0, 47.3],
];

/**
 * Die Atlantik- und Golfküste: Maine → Rio-Grande-Mündung.
 *
 * Von Norden nach Süden, um Florida herum, dann die Golfküste nach Westen.
 */
const ATLANTIK_GOLF = [
  [-67.0, 44.9], // Passamaquoddy Bay, an der Grenze zu New Brunswick
  [-68.2, 44.35], // Mount Desert Island
  [-68.8, 44.15], // Penobscot Bay
  [-69.8, 43.8], // Muscongus Bay
  [-70.15, 43.66], // Casco Bay, Portland
  [-70.75, 43.08], // Portsmouth
  [-70.62, 42.65], // Cape Ann
  [-70.95, 42.36], // Boston
  [-70.5, 41.75], // Plymouth
  [-70.05, 41.9], // äußeres Cape Cod
  [-69.96, 41.67], // Chatham, der Ellbogen von Cape Cod
  [-70.5, 41.35], // Nantucket Sound
  [-71.2, 41.45], // Buzzards Bay
  [-71.4, 41.6], // Narragansett Bay, Providence
  [-72.1, 41.35], // New London
  [-71.86, 41.07], // Montauk Point
  [-73.0, 40.6], // Südküste Long Islands
  [-74.0, 40.5], // Hafeneinfahrt New York
  [-74.0, 40.2], // Küste New Jerseys
  [-74.1, 39.75], // Barnegat Bay
  [-74.42, 39.36], // Atlantic City
  [-74.97, 38.94], // Cape May
  [-75.05, 38.8], // Ostufer der Delaware Bay
  [-75.1, 38.33], // Ocean City
  [-76.0, 37.0], // Einfahrt zur Chesapeake Bay
  [-76.29, 36.85], // Norfolk
  [-75.53, 35.23], // Cape Hatteras
  [-76.54, 34.62], // Cape Lookout
  [-77.95, 33.85], // Cape Fear
  [-78.88, 33.7], // Myrtle Beach
  [-79.93, 32.78], // Charleston
  [-81.09, 32.08], // Savannah
  [-81.4, 30.7], // die Grenze zwischen Georgia und Florida
  [-81.31, 29.9], // St. Augustine
  [-80.6, 28.4], // Cape Canaveral
  [-80.05, 26.7], // Palm Beach
  [-80.19, 25.76], // Miami
  [-80.45, 25.1], // Key Largo
  [-81.78, 24.55], // Key West, knapp unterhalb des Bildrandes
  [-81.7, 25.95], // Marco Island, an der Golfseite Floridas
  [-82.63, 27.76], // Tampa Bay
  [-83.03, 29.13], // Cedar Key
  [-84.3, 29.75], // Apalachee Bay
  [-84.98, 29.73], // Apalachicola
  [-85.66, 30.15], // Panama City
  [-87.21, 30.35], // Pensacola
  [-88.02, 30.25], // Mobile Bay
  [-89.1, 30.2], // Mississippi-Sund
  [-89.25, 29.0], // die Mündung des Mississippi
  [-91.4, 29.4], // Atchafalaya Bay
  [-93.35, 29.75], // Calcasieu, nahe der Grenze zu Texas
  [-94.83, 29.3], // Galveston Bay
  [-96.4, 28.6], // Matagorda Bay
  [-97.2, 27.7], // Corpus Christi Bay
  [-97.4, 26.1], // Padre Island, Südspitze
  [-97.15, 25.97], // die Mündung des Rio Grande
];

/**
 * Der Weg von der Rio-Grande-Mündung zurück nach San Diego — über die reale
 * Küste Niederkaliforniens, größtenteils unterhalb des Bildrandes (25° N).
 */
const BAJASCHLUSS = [
  [-98.0, 22.0],
  [-105.0, 20.0],
  [-109.95, 22.88], // Cabo San Lucas, die Südspitze der Halbinsel
  [-113.1, 26.7], // Bahía Vizcaíno
  [-116.0, 30.4], // Ensenada
];

// ---------------------------------------------------------------------------
// Die Großen Seen — Binnengewässer über der Landmasse
// ---------------------------------------------------------------------------

const OBERER_SEE = [
  [-92.1, 46.7], // Duluth
  [-90.1, 46.9],
  [-88.4, 47.9],
  [-87.0, 48.3],
  [-85.0, 47.5],
  [-84.9, 46.6], // Sault Ste. Marie
  [-86.5, 46.1],
  [-88.5, 46.0],
  [-90.5, 46.3],
];

const MICHIGANSEE = [
  [-87.9, 41.7], // Chicago
  [-87.8, 43.0],
  [-87.0, 44.5],
  [-85.6, 45.3],
  [-85.0, 45.8],
  [-84.7, 45.3], // Mackinac
  [-85.6, 44.0],
  [-86.2, 42.5],
  [-87.0, 41.6],
];

const HURONSEE = [
  [-82.4, 43.0],
  [-82.9, 44.0],
  [-83.5, 45.5],
  [-81.5, 45.9],
  [-80.0, 44.7],
  [-81.0, 43.6],
];

const ERIESEE = [
  [-83.1, 41.7], // Toledo
  [-82.3, 41.7],
  [-81.0, 41.5], // Cleveland
  [-79.8, 42.4],
  [-78.9, 42.9], // Buffalo
  [-80.5, 42.6],
  [-82.0, 41.9],
];

const ONTARIOSEE = [
  [-79.1, 43.1], // Niagara
  [-79.5, 43.6],
  [-78.0, 43.9],
  [-76.5, 43.9],
  [-76.2, 43.6],
  [-77.5, 43.2],
];

// ---------------------------------------------------------------------------
// Flüsse — die Wege der Westexpansion
// ---------------------------------------------------------------------------

/** Der Mississippi — von der Quelle am Lake Itasca bis zur Mündung. */
const MISSISSIPPI = [
  [-95.2, 47.2], // Lake Itasca, die Quelle
  [-94.5, 46.3],
  [-93.3, 45.0], // Minneapolis und St. Paul
  [-91.65, 44.05],
  [-91.25, 43.8], // La Crosse
  [-90.6, 41.5], // die Quad Cities
  [-90.4, 38.6], // St. Louis
  [-89.15, 37.0], // Cairo, Zufluss des Ohio
  [-90.05, 35.15], // Memphis
  [-91.1, 33.4], // Greenville
  [-91.2, 32.3], // Vicksburg
  [-91.4, 30.4], // Baton Rouge
  [-90.07, 29.95], // New Orleans
  [-89.25, 29.0], // die Mündung
];

/** Der Missouri — von den Rocky Mountains bis zum Zusammenfluss bei St. Louis. */
const MISSOURI = [
  [-111.5, 45.9], // Three Forks, die Quelle in Montana
  [-110.4, 45.7],
  [-107.9, 47.5],
  [-101.3, 47.3],
  [-100.8, 46.8], // Bismarck
  [-98.5, 44.4], // Pierre
  [-95.9, 41.3], // Omaha
  [-94.85, 39.3],
  [-94.6, 39.1], // Kansas City
  [-91.2, 38.8],
  [-90.4, 38.6], // Zusammenfluss mit dem Mississippi
];

/** Der Ohio — von Pittsburgh bis Cairo, das Tor der Siedler in den Westen. */
const OHIO = [
  [-80.0, 40.45], // Pittsburgh, Zusammenfluss von Allegheny und Monongahela
  [-81.5, 39.3],
  [-82.9, 38.7], // Portsmouth
  [-84.5, 39.1], // Cincinnati
  [-85.75, 38.25], // Louisville
  [-88.0, 37.2],
  [-89.15, 37.0], // Cairo, Zusammenfluss mit dem Mississippi
];

/** Der Rio Grande — die spätere Grenze zu Mexiko. */
const RIO_GRANDE = [
  [-106.3, 37.0], // San-Luis-Tal, Colorado
  [-106.6, 35.1], // Albuquerque
  [-106.5, 31.75], // El Paso
  [-104.4, 29.5], // Big Bend
  [-99.5, 27.5], // Laredo
  [-97.6, 26.0],
  [-97.15, 25.97], // die Mündung
];

/** Der Columbia — das Ziel des Oregon Trail. */
const COLUMBIA = [
  [-117.78, 49.0], // Eintritt aus Kanada
  [-118.0, 47.9],
  [-119.3, 46.6],
  [-119.4, 45.9], // Zusammenfluss mit dem Snake River
  [-121.2, 45.7], // The Dalles
  [-122.7, 45.65], // Portland, Zusammenfluss mit dem Willamette
  [-123.97, 46.25], // die Mündung
];

// ---------------------------------------------------------------------------
// Werkzeug: Küstenabschnitte nach Orten schneiden (wie in den anderen Karten)
// ---------------------------------------------------------------------------

const naechsterIndex = (liste, lon, lat) => {
  let beste = 0;
  let abstand = Infinity;
  liste.forEach(([l, b], i) => {
    const d = (l - lon) ** 2 + (b - lat) ** 2;
    if (d < abstand) {
      abstand = d;
      beste = i;
    }
  });
  return beste;
};

const kueste = (liste, von, bis) => {
  const a = naechsterIndex(liste, von[0], von[1]);
  const b = naechsterIndex(liste, bis[0], bis[1]);
  return a <= b ? liste.slice(a, b + 1) : rueckwaerts(liste.slice(b, a + 1));
};

// ---------------------------------------------------------------------------
// Die Landmasse für den Untergrund
// ---------------------------------------------------------------------------

/**
 * Nordamerika als ein geschlossener Umriss: Pazifikküste, kanadische Grenze,
 * Atlantik- und Golfküste, Rückweg über Niederkalifornien.
 */
const KONTINENT = verbinde(PAZIFIK, NORDSCHLUSS, ATLANTIK_GOLF, BAJASCHLUSS);

// ---------------------------------------------------------------------------
// Bausteine der Phasen — Herrschaften mit Grenzen
// ---------------------------------------------------------------------------

/** Die westliche Grenze der Dreizehn Kolonien — ungefähr der Appalachenkamm. */
const KOLONIEN_INNENGRENZE = [
  [-81.4, 30.7],
  [-83.0, 30.9],
  [-84.9, 32.5],
  [-84.3, 34.0],
  [-83.9, 35.0],
  [-82.6, 36.0],
  [-81.8, 37.0],
  [-80.5, 38.0],
  [-79.3, 39.3],
  [-77.8, 40.3],
  [-75.5, 41.3],
  [-74.0, 42.0],
  [-73.4, 43.0],
  [-71.5, 44.3],
  [-70.7, 45.3],
];

/**
 * Die Dreizehn Kolonien 1776 — ein Küstenstreifen, keine sea-to-sea-Charter.
 *
 * Florida (britisch, aber nicht abtrünnig) bleibt bewusst ungefärbt: Es
 * gehörte 1776 weder zu den Kolonien noch zu Spanien.
 */
const DREIZEHN_KOLONIEN = verbinde(
  kueste(ATLANTIK_GOLF, [-67.0, 44.9], [-81.4, 30.7]),
  KOLONIEN_INNENGRENZE,
);

/** Die Nordgrenze der spanischen Ansprüche 1776 — von der Pazifikküste zur Mississippi-Quelle. */
const NORDGRENZE_SPANISCH = [
  [-122.75, 49.0],
  [-114.1, 49.0],
  [-100.0, 49.0],
  [-95.2, 47.2],
];

/**
 * Spanisch-Nordamerika 1776: Louisiana (seit 1762 spanisch), Texas,
 * Neu-Mexiko, Kalifornien — begrenzt im Osten durch den Mississippi.
 *
 * Zwischen den Appalachen und dem Mississippi bleibt bewusst eine Lücke
 * ungefärbt: Das Ohiotal war 1776 weder amerikanisch noch spanisch, sondern
 * Land der dort lebenden Nationen (Shawnee, Miami, Delaware und andere) unter
 * loser britischer Oberhoheit — dafür lässt sich hier keine seriöse Grenze
 * zeichnen, im Zweifel lieber keine Fläche als eine erfundene.
 */
const SPANISCH_NORDAMERIKA = verbinde(
  kueste(PAZIFIK, [-117.25, 32.53], [-122.75, 49.0]),
  NORDGRENZE_SPANISCH,
  MISSISSIPPI,
  kueste(ATLANTIK_GOLF, [-89.25, 29.0], [-97.15, 25.97]),
  BAJASCHLUSS,
);

/** Das Land der Haudenosaunee (Irokesen-Konföderation) rund um die Finger Lakes. */
const HAUDENOSAUNEE = [
  [-79.5, 43.5],
  [-77.5, 43.9],
  [-75.5, 44.3],
  [-73.8, 44.8],
  [-73.5, 43.0],
  [-75.0, 42.3],
  [-77.5, 42.1],
  [-79.5, 42.3],
];

/** Die Nationen des Südostens: Cherokee, Muskogee (Creek), Choctaw, Chickasaw, Seminolen. */
const SUEDOSTEN_NATIONEN = [
  [-84.3, 34.0],
  [-83.0, 34.5],
  [-82.0, 35.3],
  [-84.0, 36.0],
  [-86.5, 36.3],
  [-89.5, 35.0],
  [-90.5, 33.0],
  [-88.8, 31.0],
  [-85.5, 31.0],
  [-83.5, 32.0],
];

/** Die Westgrenze der USA 1830 — vom Sabine (Grenze zu Texas) zu den Rocky Mountains. */
const WEST_GRENZE_1830 = [
  [-93.75, 29.75],
  [-97.1, 33.8],
  [-100.0, 36.5],
  [-103.0, 37.0],
  [-105.5, 40.0],
  [-106.8, 43.0],
  [-111.0, 44.5],
  [-113.5, 47.0],
  [-114.1, 49.0],
];

/** Die Nordgrenze der USA 1830 — von den Rocky Mountains zurück zur Atlantikküste. */
const NORD_GRENZE_1830 = [
  [-114.1, 49.0],
  [-100.0, 49.0],
  [-95.15, 49.0], // Lake of the Woods
  [-94.7, 48.6],
  [-92.1, 46.7],
  [-84.9, 46.6],
  [-82.4, 43.0],
  [-79.1, 43.1],
  [-76.2, 43.6],
  [-75.0, 44.9],
  [-71.5, 44.3],
  [-70.7, 45.3],
];

/**
 * Die USA 1830: die alten Dreizehn plus Louisiana Purchase (1803) und Florida
 * (1821) — bis an die Rocky Mountains, aber noch nicht an den Pazifik.
 */
const USA_1830 = verbinde(
  kueste(ATLANTIK_GOLF, [-67.0, 44.9], [-93.35, 29.75]),
  WEST_GRENZE_1830,
  NORD_GRENZE_1830,
);

/** Mexiko 1830: Texas, Neu-Mexiko, Kalifornien — seit 1821 unabhängig von Spanien. */
const MEXIKO_1830 = verbinde(
  kueste(PAZIFIK, [-117.25, 32.53], [-122.75, 49.0]),
  [[-114.1, 49.0]],
  rueckwaerts(WEST_GRENZE_1830),
  kueste(ATLANTIK_GOLF, [-93.35, 29.75], [-97.15, 25.97]),
  BAJASCHLUSS,
);

/** Das Indianerterritorium (das spätere Oklahoma) — Ziel der Zwangsumsiedlung ab 1830. */
const INDIANERTERRITORIUM = [
  [-94.6, 37.0],
  [-94.4, 33.6],
  [-96.0, 33.9],
  [-98.0, 34.5],
  [-98.0, 36.5],
];

/** Die USA 1890 — von Meer zu Meer, derselbe Umriss wie der Kontinent selbst. */
const USA_1890 = verbinde(
  kueste(ATLANTIK_GOLF, [-67.0, 44.9], [-97.15, 25.97]),
  BAJASCHLUSS,
  kueste(PAZIFIK, [-117.25, 32.53], [-122.75, 49.0]),
  NORDSCHLUSS,
);

/**
 * Das Pine-Ridge-Reservat der Lakota, gegründet 1889 — in unmittelbarer Nähe
 * von Wounded Knee. Reale Ausdehnung, nicht erfunden.
 */
const PINE_RIDGE = [
  [-102.9, 43.5],
  [-101.8, 43.5],
  [-101.8, 42.9],
  [-102.9, 42.9],
];

// ---------------------------------------------------------------------------
// Zusammenbau
// ---------------------------------------------------------------------------

const land = (orte) => ({
  art: 'land',
  d: geo.pfad(orte),
  fill: KARTENFARBEN.land,
  stroke: KARTENFARBEN.landRand,
  strokeWidth: 1.2,
});

const wasser = (orte) => ({
  art: 'wasser',
  d: geo.pfad(orte),
  fill: KARTENFARBEN.meer,
  stroke: KARTENFARBEN.landRand,
  strokeWidth: 1,
});

const fluss = (orte) => ({
  art: 'fluss',
  d: geo.pfad(orte, { geschlossen: false }),
  fill: 'none',
  stroke: KARTENFARBEN.fluss,
  strokeWidth: 2,
});

const gebiet = (titel, orte) => ({ titel, d: geo.pfad(orte) });

const karte = {
  breite: geo.breite,
  hoehe: geo.hoehe,

  basis: [
    {
      art: 'grund',
      d: `M 0 0 H ${geo.breite} V ${geo.hoehe} H 0 Z`,
      fill: KARTENFARBEN.meer,
      stroke: 'none',
      strokeWidth: 0,
    },
    land(KONTINENT),
    wasser(OBERER_SEE),
    wasser(MICHIGANSEE),
    wasser(HURONSEE),
    wasser(ERIESEE),
    wasser(ONTARIOSEE),
    fluss(MISSISSIPPI),
    fluss(MISSOURI),
    fluss(OHIO),
    fluss(RIO_GRANDE),
    fluss(COLUMBIA),
  ],

  phasen: [
    {
      id: 'gruendung',
      label: '1776',
      hinweis:
        'Die Dreizehn Kolonien hängen wie ein schmaler Streifen an der Atlantikküste — den Rest des Kontinents beanspruchten andere. Spanien hielt Louisiana, Texas, Neu-Mexiko und Kalifornien; Florida war britisch, aber nicht abtrünnig. Und westlich der Appalachen lebten Nationen mit eigenem Land: die Haudenosaunee im Norden, im Südosten Cherokee, Muskogee, Choctaw, Chickasaw und Seminolen. Zwischen ihnen und dem Mississippi ist absichtlich keine Fläche eingezeichnet — dort gab es 1776 keine Grenze, die sich seriös zeichnen ließe, nur Land, das schon bewohnt war.',
      flaechen: [
        gebiet('Die Dreizehn Kolonien', DREIZEHN_KOLONIEN),
        gebiet('Spanisch-Nordamerika — Louisiana, Texas, Neu-Mexiko und Kalifornien', SPANISCH_NORDAMERIKA),
        gebiet('Land der Haudenosaunee (Irokesen-Konföderation)', HAUDENOSAUNEE),
        gebiet('Die Nationen des Südostens — Cherokee, Muskogee, Choctaw, Chickasaw, Seminolen', SUEDOSTEN_NATIONEN),
      ],
    },
    {
      id: 'removal',
      label: '1830–1839',
      hinweis:
        'Die USA sind gewachsen: Louisiana Purchase 1803 und Florida 1821 liegen dazwischen, die Grenze reicht jetzt bis an die Rocky Mountains. Mexiko, seit 1821 unabhängig von Spanien, hält noch Texas, Neu-Mexiko und Kalifornien. Und im heutigen Oklahoma entsteht das Indianerterritorium — das erzwungene Ziel des Indian Removal Act von 1830. Die Karte zeigt hier nicht mehr die Länder der Südost-Nationen aus Phase 1: Genau dieses Verschwinden, mit allem, was es an Gewalt und Tod kostete, erzählt die Bewegung „Trail of Tears" unten.',
      flaechen: [
        gebiet('Die Vereinigten Staaten 1830', USA_1830),
        gebiet('Mexiko — Texas, Neu-Mexiko und Kalifornien', MEXIKO_1830),
        gebiet('Indianerterritorium (das spätere Oklahoma) — Ziel der Zwangsumsiedlung', INDIANERTERRITORIUM),
      ],
    },
    {
      id: 'meer-zu-meer',
      label: '1890',
      hinweis:
        'Die USA reichen jetzt von Atlantik zu Pazifik — derselbe Umriss wie der Kontinent selbst. Was von den Ländern der Ureinwohner blieb, sind zwei kleine, datierte Flächen: das Indianerterritorium, das erst 1907 als eigenständiges Gebiet aufhört zu bestehen, und das Pine-Ridge-Reservat der Lakota, gegründet 1889 — wenige Kilometer von Wounded Knee entfernt, wo im Dezember 1890 das letzte große Kapitel der Indianerkriege endet.',
      flaechen: [
        gebiet('Die Vereinigten Staaten — von Meer zu Meer', USA_1890),
        gebiet('Indianerterritorium (das spätere Oklahoma) — bis zur Auflösung 1907', INDIANERTERRITORIUM),
        gebiet('Pine-Ridge-Reservat (Lakota), gegründet 1889', PINE_RIDGE),
      ],
    },
  ],

  punkte: [
    {
      id: 'boston',
      name: 'Boston',
      typ: 'stadt',
      ...ort(-71.06, 42.36),
      text: [
        'Hier begann der offene Bruch: die Boston Tea Party im Dezember 1773,',
        'das Massaker von 1770, die ersten Schüsse bei Lexington und Concord',
        'im April 1775. Boston war die Stadt, in der sich Kolonisten zuerst als',
        'etwas anderes verstanden als als Untertanen der britischen Krone —',
        'auch wenn 1776 längst nicht alle Kolonisten diese Sicht teilten. Rund',
        'ein Fünftel der weißen Bevölkerung blieb der Krone treu (die',
        '„Loyalisten"), manche aus Überzeugung, manche aus Vorsicht. Der Weg',
        'von Boston zur Unabhängigkeitserklärung war kein einhelliger.',
      ].join(' '),
    },
    {
      id: 'philadelphia',
      name: 'Philadelphia',
      typ: 'ereignis',
      ...ort(-75.16, 39.95),
      text: [
        'Im Juli 1776 verabschiedete der Kontinentalkongress hier die',
        'Unabhängigkeitserklärung: „Alle Menschen sind gleich geschaffen …" —',
        'einer der wirkungsmächtigsten Sätze der Geschichte, geschrieben von',
        'Thomas Jefferson, der zugleich mehr als 600 Menschen versklavte. Elf',
        'Jahre später, 1787, entstand in derselben Stadt die Verfassung der',
        'neuen USA. Beide Dokumente sprachen von Freiheit und Gleichheit — und',
        'beide ließen die Sklaverei bestehen und die Souveränität der',
        'indianischen Nationen unerwähnt, obwohl die Verfassung den Kongress',
        'ausdrücklich ermächtigte, mit ihnen wie mit fremden Mächten Verträge',
        'zu schließen.',
      ].join(' '),
    },
    {
      id: 'new-echota',
      name: 'New Echota',
      typ: 'ereignis',
      ...ort(-84.85, 34.48),
      text: [
        'Die Hauptstadt der Cherokee-Nation, mit eigener Verfassung, eigener',
        'Zeitung und einer Silbenschrift, die Sequoyah 1821 entwickelt hatte —',
        'die Cherokee waren nach jedem Maßstab, den die USA selbst anlegten,',
        '„zivilisiert". Es half nichts. Am 29. Dezember 1835 unterzeichnete',
        'hier eine kleine, nicht von der Nationalversammlung bevollmächtigte',
        'Gruppe von Cherokee den Vertrag von New Echota und trat das gesamte',
        'Stammesgebiet östlich des Mississippi ab. Der Häuptling John Ross und',
        'mehr als 15 000 Cherokee protestierten dagegen — vergeblich. Auf',
        'diesem Vertrag beruhte die Zwangsräumung von 1838.',
      ].join(' '),
    },
    {
      id: 'new-orleans',
      name: 'New Orleans',
      typ: 'stadt',
      ...ort(-90.07, 29.95),
      text: [
        'Über diesen Hafen lief der ganze Handel des Mississippi-Beckens —',
        'genau deshalb wollte Präsident Jefferson 1803 nur die Stadt kaufen.',
        'Napoleon, der Louisiana gerade erst von Spanien zurückerhalten hatte',
        'und Geld für den Krieg in Europa brauchte, bot das ganze Gebiet an:',
        'rund 2,1 Millionen Quadratkilometer für 15 Millionen Dollar, etwa vier',
        'Cent je Hektar. Über Nacht verdoppelte sich die Fläche der USA. Kein',
        'Vertreter der zahllosen indianischen Nationen, die auf diesem Land',
        'lebten, saß am Verhandlungstisch — verkauft und gekauft wurde ein',
        'Anspruch, den europäische Mächte einander zusprachen.',
      ].join(' '),
    },
    {
      id: 'fort-laramie',
      name: 'Fort Laramie',
      typ: 'ereignis',
      ...ort(-104.57, 42.21),
      text: [
        'Ursprünglich ein Handelsposten, dann die wichtigste Raststation des',
        'Oregon Trail und Schauplatz zweier Verträge, die zeigen, wie',
        'Vertragstreue in der Praxis aussah. 1851 versprachen die USA den',
        'Plains-Nationen ein riesiges Gebiet als deren Land, im Gegenzug für',
        'freien Durchzug der Siedlerzüge. 1868 versprach ein zweiter Vertrag',
        'den Lakota unter anderem die Black Hills „für alle Zeit". Als 1874',
        'dort Gold gefunden wurde, brach die US-Regierung den eigenen Vertrag',
        'und drängte die Lakota zum Verkauf — die Black Hills sind bis heute',
        'Gegenstand eines ungelösten Rechtsstreits.',
      ].join(' '),
    },
    {
      id: 'little-bighorn',
      name: 'Little Bighorn',
      typ: 'ereignis',
      ...ort(-107.44, 45.57),
      text: [
        'Am 25. Juni 1876 griff Lieutenant Colonel George Armstrong Custer mit',
        'rund 210 Soldaten des 7. Kavallerie-Regiments ein Lager von Lakota,',
        'Cheyenne und Arapaho an — und unterschätzte dessen Größe vollständig.',
        'Unter Anführern wie Sitting Bull und Crazy Horse vernichteten die',
        'Verteidiger Custers gesamte Abteilung. Der militärische Sieg blieb',
        'ohne Zukunft: Die US-Armee reagierte mit verstärktem Vorgehen, und',
        'binnen weniger Jahre waren fast alle Plains-Nationen in Reservate',
        'gezwungen. Für die siegreiche Seite war Little Bighorn ein Sieg, der',
        'die eigene Niederlage nur beschleunigte.',
      ].join(' '),
    },
    {
      id: 'wounded-knee',
      name: 'Wounded Knee',
      typ: 'ereignis',
      ...ort(-102.35, 43.14),
      text: [
        'Am 29. Dezember 1890 versuchte die US-Kavallerie, eine Gruppe Lakota',
        'unter Spotted Elk zu entwaffnen — im Zusammenhang mit der',
        'Geistertanz-Bewegung, die den Weißen als Kriegsvorbereitung',
        'erschien, für die Lakota aber eine Hoffnung auf Erneuerung war. Ein',
        'Schuss fiel, vermutlich versehentlich, und die Soldaten eröffneten',
        'das Feuer mit Gewehren und Schnellfeuerkanonen. Zwischen 150 und mehr',
        'als 300 Lakota starben, darunter viele Frauen und Kinder. Wounded',
        'Knee gilt als das Ende der bewaffneten Indianerkriege — ein Ende',
        'ohne Sieg, nur mit einem Massaker.',
      ].join(' '),
    },
  ],

  bewegungen: [
    {
      id: 'trail-of-tears',
      name: 'Der Pfad der Tränen (1838/39)',
      von: p(-84.85, 34.48),
      ueber: [p(-85.31, 35.05), p(-86.78, 36.16), p(-93.29, 37.22)],
      nach: p(-94.97, 35.91),
      text: [
        'Nach dem Indian Removal Act von 1830 und dem erzwungenen Vertrag von',
        'New Echota 1835 trieb die US-Armee ab 1838 rund 16 000 Cherokee',
        'entlang mehrerer Routen nach Westen — zu Fuß, im Winter, mit',
        'unzureichender Verpflegung. Schätzungen zur Zahl der Toten reichen',
        'von etwa 4 000 bis zu einem Fünftel aller Betroffenen; genaue Zahlen',
        'gibt es nicht. Die Cherokee nennen den Weg bis heute „Nunna daul',
        'Isunyi" — der Pfad, auf dem wir weinten. Dieselbe Zwangsumsiedlung',
        'traf zuvor und danach auch Muskogee, Choctaw, Chickasaw und',
        'Seminolen, mit eigenen Routen und eigenen Verlustzahlen.',
      ].join(' '),
    },
    {
      id: 'oregon-trail',
      name: 'Der Oregon Trail (ab den 1840er Jahren)',
      von: p(-94.42, 39.09),
      ueber: [p(-99.08, 40.7), p(-104.57, 42.21), p(-108.9, 42.32), p(-112.43, 43.02)],
      nach: p(-122.6, 45.36),
      text: [
        'Rund 3 200 Kilometer von Independence, Missouri, bis ins',
        'Willamette-Tal in Oregon — mit Ochsengespannen, in fünf bis sechs',
        'Monaten, über den Kontinentalabschnitt South Pass, der als einziger',
        'für Planwagen befahrbar war. Zwischen 1841 und den 1860er Jahren',
        'zogen mehrere Hunderttausend Siedler diesen Weg. Er war für die',
        'Wandernden gefährlich — Krankheiten wie Cholera forderten mehr Opfer',
        'als Überfälle — und für die Nationen, deren Jagdgründe und Weiden er',
        'durchquerte, eine Invasion in Zeitlupe: Der Trail zerschnitt die',
        'Büffelherden und brachte Krankheiten in Gebiete, die vorher kaum',
        'Kontakt mit Siedlern hatten.',
      ].join(' '),
    },
    {
      id: 'california-trail',
      name: 'Der California Trail (ab 1849)',
      von: p(-112.43, 43.02),
      ueber: [p(-116.5, 40.7), p(-119.97, 39.5)],
      nach: p(-121.49, 38.58),
      text: [
        'Bei Fort Hall zweigte eine zweite große Route vom Oregon Trail ab —',
        'nach Süden, dem Humboldt River folgend, über die Sierra Nevada nach',
        'Sacramento. Der Goldfund am American River im Januar 1848 löste den',
        '„Gold Rush" aus: Bis Ende 1849 kamen mehr als 90 000 Menschen nach',
        'Kalifornien, aus den USA wie aus aller Welt. Für die kalifornischen',
        'Nationen war das eine Katastrophe eigenen Ausmaßes: Ihre Zahl brach',
        'zwischen 1848 und 1870 von schätzungsweise 150 000 auf weniger als',
        '30 000 ein — durch Krankheit, Vertreibung und gezielte Gewalt, die',
        'der Bundesstaat Kalifornien selbst finanzierte.',
      ].join(' '),
    },
  ],

  beschriftungen: [
    { text: 'Atlantikküste', art: 'land', ...ort(-77.0, 37.5) },
    { text: 'Appalachen', art: 'land', drehung: 55, ...ort(-81.0, 36.5) },
    { text: 'Große Seen', art: 'meer', ...ort(-85.0, 44.7) },
    { text: 'Mississippi', art: 'meer', drehung: 80, ...ort(-90.5, 34.0) },
    { text: 'Prärie', art: 'land', ...ort(-98.0, 42.0) },
    { text: 'Rocky Mountains', art: 'land', drehung: 65, ...ort(-108.0, 40.0) },
    { text: 'Kalifornien', art: 'land', ...ort(-119.5, 37.0) },
    { text: 'Golf von Mexiko', art: 'meer', ...ort(-90.0, 25.6) },
    { text: 'Atlantischer Ozean', art: 'meer', ...ort(-68.0, 35.0) },
    { text: 'Pazifischer Ozean', art: 'meer', ...ort(-124.0, 34.0) },
    { text: 'Texas', art: 'land', ...ort(-99.0, 31.0) },
    { text: 'Oregon', art: 'land', ...ort(-121.0, 44.0) },
  ],
};

module.exports = karte;
