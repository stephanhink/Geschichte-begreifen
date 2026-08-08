// Gestaltungs-Grundlagen der App: Farben, Abstände, Schriftgrößen, Radien.
//
// Eine warme, ruhige Bernstein-Palette — passend zu den Assets. Für Klasse 5
// bis 13: großzügige Schrift, klare Hierarchie, sachlich und modern statt
// verspielt. Geschichte soll spannend aussehen, nicht wie ein Kinderbuch.
//
// Das ist kein Fachlogik-Modul (deshalb components/ und nicht utils/), aber
// es enthält bewusst auch keine Komponente: nur Werte, die überall gleich
// verwendet werden.

/** Farbpalette — Bernstein auf warmem Papier. */
export const farben = {
  hintergrund: '#FFF8ED', // warmes Papier
  flaeche: '#FFFFFF', // Karten
  flaecheGedaempft: '#FBEFDC', // hinterlegte Blöcke, Zitate
  akzent: '#7C4A03', // tiefes Bernstein — Titel, aktive Elemente
  akzentHell: '#A96A16', // Nebenakzent
  akzentZart: '#F2E0C4', // Linien und Flächen im Akzentton
  text: '#3A2B1B', // Fließtext
  textLeise: '#7A6A57', // Beschriftungen, Hinweise
  rand: '#EADCC6',
  richtig: '#3F6B37', // Quiz-Rückmeldung: getroffen
  richtigFlaeche: '#EAF2E4',
  daneben: '#9A4A28', // Quiz-Rückmeldung: daneben (nie „falsch"-rot)
  danebenFlaeche: '#FBEAE2',
  schatten: '#7C4A03',
};

/**
 * Farben für die Perspektiven — jede Sichtweise bekommt einen eigenen
 * Ton, damit man beim Umschalten sofort sieht, wessen Erzählung man liest.
 * Alle Töne bleiben in der warmen Familie: keine Sichtweise wirkt „richtiger"
 * als eine andere.
 */
export const perspektivfarben = [
  { kraeftig: '#8A5212', zart: '#F6E7CE' },
  { kraeftig: '#8C3B2F', zart: '#F8E4DC' },
  { kraeftig: '#4F5F3A', zart: '#E9EEE0' },
  { kraeftig: '#5A4A78', zart: '#EBE6F2' },
];

/**
 * Der Farbton einer Perspektive anhand ihrer Position im Thema.
 *
 * @param {number} index
 * @returns {{kraeftig: string, zart: string}}
 */
export function perspektivfarbe(index) {
  return perspektivfarben[index % perspektivfarben.length];
}

/** Abstände in Punkten — Vielfache von 4 halten das Bild ruhig. */
export const abstand = {
  klein: 8,
  mittel: 16,
  gross: 24,
  sehrGross: 32,
};

/** Eckenradien. */
export const radius = {
  klein: 10,
  mittel: 16,
  gross: 22,
  rund: 999,
};

/** Schriftgrößen und Zeilenhöhen — großzügig, damit lange Texte tragen. */
export const schrift = {
  riesig: { fontSize: 30, lineHeight: 38 },
  gross: { fontSize: 24, lineHeight: 32 },
  mittel: { fontSize: 19, lineHeight: 29 },
  fliess: { fontSize: 17, lineHeight: 27 },
  klein: { fontSize: 15, lineHeight: 22 },
  winzig: { fontSize: 13, lineHeight: 18 },
};

/** Ein weicher Schatten für Karten (auf Android via elevation). */
export const kartenschatten = {
  shadowColor: farben.schatten,
  shadowOpacity: 0.1,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
};
