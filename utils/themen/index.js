// Zentrale Registrierung aller Themen-Module.
//
// Ein neues Thema wird angelegt, indem eine Datei nach dem Schema aus
// schema.js erstellt und hier in `alleThemen` eingetragen wird. Alles, was
// nicht hier steht, findet die App nicht — und die Prüfung sieht es auch
// nicht an.
//
// Die Reihenfolge im Array ist die Reihenfolge in der App (Themenlandkarte
// aus CLAUDE.md: Rom → China → Dschingis Khan → Japan → Israel/Palästina →
// Germanen/Völkerwanderung → frühe Königreiche → Mittelalter →
// Eroberung Amerikas).
//
// China steht bewusst direkt hinter Rom: Beide Reiche waren zur selben Zeit
// ungefähr gleich groß, und die Seidenstraße verbindet sie auf der Karte.
// Wer Rom gelesen hat, sieht im nächsten Kapitel dieselbe Zeit von der
// anderen Seite.
//
// Dschingis Khan folgt auf China, weil die Mongolen genau den Faden aufnehmen,
// der dort gesponnen wurde: Sie machen aus der Seidenstraße erstmals einen Weg
// innerhalb eines einzigen Reiches — und regieren am Ende China selbst.
//
// Japan schließt direkt an: Es ist der einzige Nachbar, den Kublai Khan nicht
// bekam — zweimal scheiterte seine Flotte an einem Taifun. Wer die Kapitel der
// Reihe nach liest, kommt also über die abgebrochene Invasion ins nächste Land
// und sieht dort dieselben Jahre 1274 und 1281 von der anderen Küste aus.
//
// „Der Dreißigjährige Krieg" steht als zehntes Thema am Ende und knüpft an das
// achte an: „Vom Mittelalter zur Neuzeit" endet mit dem Prager Fenstersturz
// 1618, hier beginnt es damit. Die Achse ist wieder eine soziale — oben die
// Entscheider (Kaiser, Fürsten, Feldherren), unten die Betroffenen in Städten
// und Dörfern.
//
// „Israel und Palästina" steht als fünftes und damit am Ende der bisherigen
// Reihe — mit Absicht. Wer die vier Kapitel davor gelesen hat, hat viermal
// geübt, dass dieselben Ereignisse je nach Standpunkt anders klingen, an
// Themen, bei denen einem das leichtfällt. Hier fällt es schwer. Deshalb
// kommt es zuletzt und nicht zuerst.
//
// „Germanen und Völkerwanderung" schließt als sechstes den Bogen zurück zum
// ersten Kapitel: Es erzählt dieselben Jahrhunderte wie „Das Römische Reich",
// nur von der Grenze aus statt aus der Mitte — und es endet dort, wo Rom
// aufhört. Zugleich kehrt es die Leitidee der App einmal um: Hier haben nicht
// die Sieger geschrieben, sondern die Verlierer. Die Gewinner hinterließen
// Gräber statt Chroniken.
//
// „Die frühen Königreiche" nimmt als siebtes genau dort den Faden auf: Die
// Wanderung ist zu Ende, die Eroberer sitzen im Land — und müssen es
// regieren. Die Perspektiven-Achse dreht sich dabei zum ersten Mal von außen
// nach innen: Es stehen sich nicht zwei Länder gegenüber, sondern oben und
// unten im selben Land (Höfe und Chronisten gegen die Dörfer).
//
// „Vom Mittelalter zur Neuzeit" ist das achte Thema und zugleich das erste
// des Neuzeit-Bogens (notizen/kapitel-planung.md). Es beginnt dort, wo das
// Kapitel davor endet — bei der Kaiserkrönung 800 — und führt bis 1618. Die
// Achse bleibt sozial, kippt aber: oben die alte Ordnung aus Kaiser, Papst
// und Adel, unten die Städte, aus denen die Neuzeit erwächst.
//
// „Die Eroberung Amerikas" ist das neunte Thema und das zweite des
// Neuzeit-Bogens. Es hängt unmittelbar am achten: Dort läuft auf der Karte
// ein Pfeil nach Westen aus dem Bild hinaus — 1492 —, hier ist die Karte, auf
// der er ankommt. Die Perspektiven-Achse dreht sich wieder nach außen, und
// sie steht so schief wie in keinem anderen Kapitel: Die eine Seite hat die
// Aufzeichnungen der anderen verbrannt. Genau deshalb steht es hier und
// nicht früher — wer die acht Kapitel davor gelesen hat, ist geübt darin,
// hinter einer Erzählung die Auswahl zu sehen.
//
// „Der Dreißigjährige Krieg" ist das zehnte Thema und das dritte des
// Neuzeit-Bogens; es knüpft an „Vom Mittelalter zur Neuzeit" an, dessen
// letzter Satz der Prager Fenstersturz 1618 ist.
//
// „Die USA: Unabhängigkeit und die Vertreibung der Indianer" ist das elfte
// Thema und das vierte des Neuzeit-Bogens (notizen/kapitel-planung.md).
// Zeitlich steht es bewusst vor „Revolution und Napoleon": Die
// Unabhängigkeit der USA 1776 liegt vor Napoleons Aufstieg 1799. Die
// Perspektiven-Achse dreht sich wieder nach außen — Siedler gegen Stämme —
// und das Kapitel macht, wie „Die Eroberung Amerikas", die Vertreibung der
// indigenen Bevölkerung ausdrücklich zum zentralen Gegenstand.
//
// „Revolution und Napoleon" ist das zwölfte Thema und das fünfte des
// Neuzeit-Bogens. Es steht hinter den USA, weil deren Unabhängigkeit 1776 vor
// Napoleons Aufstieg 1799 liegt — und weil beide Kapitel zusammenhängen: 1803
// verkauft Napoleon Louisiana an die USA, um seine Kriege in Europa zu
// bezahlen. Die Perspektiven-Achse liegt hier zwischen denen, die die Ideen
// von 1789 trugen, und denen, über deren Köpfe hinweg sie gebracht wurden.
//
// „Die Kolonien" ist das dreizehnte Thema und das sechste des Neuzeit-Bogens
// (notizen/kapitel-planung.md, vom Betreiber am 14.08.2026 nachgetragen). Es
// steht hinter „Revolution und Napoleon", weil es dort ansetzt, wo der Wiener
// Kongress 1815 endet, und es steht vor dem Weg zum Ersten Weltkrieg, weil die
// Kolonialrivalitäten — Faschoda 1898, die Marokko-Krisen 1905 und 1911 — zu
// den Spannungen gehören, die 1914 explodierten. Die Perspektiven-Achse steht
// wieder nach außen: die Kolonialmächte gegen die kolonisierten Völker. „Der
// Sieger schreibt die Geschichte" gilt hier doppelt — diese Seite hat nicht
// nur gewonnen, sie hat auch die Akten geführt und die Karten gezeichnet.
//
// CommonJS, damit dieselbe Datei mit blankem `node` prüfbar ist und von
// Metro/Babel in der App geladen werden kann (siehe schema.js).

const roemischesReich = require('./roemisches-reich');
const china = require('./china');
const dschingisKhan = require('./dschingis-khan');
const japan = require('./japan');
const israelPalaestina = require('./israel-palaestina');
const germanen = require('./germanen');
const koenigreiche = require('./koenigreiche');
const mittelalter = require('./mittelalter');
const eroberungAmerikas = require('./eroberung-amerikas');
const dreissigjaehrigerKrieg = require('./dreissigjaehriger-krieg');
const usaUnabhaengigkeit = require('./usa-unabhaengigkeit');
const revolutionUndNapoleon = require('./revolution-und-napoleon');
const dieKolonien = require('./die-kolonien');

/** Alle Themen in der Reihenfolge der Themenlandkarte. */
const alleThemen = [
  roemischesReich,
  china,
  dschingisKhan,
  japan,
  israelPalaestina,
  germanen,
  koenigreiche,
  mittelalter,
  eroberungAmerikas,
  dreissigjaehrigerKrieg,
  usaUnabhaengigkeit,
  revolutionUndNapoleon,
  dieKolonien,
];

/**
 * Sucht ein Thema anhand seiner id.
 *
 * @param {string} id ASCII-Slug, z. B. 'roemisches-reich'
 * @returns {object|undefined} das Thema oder undefined
 */
function themaNachId(id) {
  return alleThemen.find((thema) => thema.id === id);
}

/**
 * Sucht eine Perspektive innerhalb eines Themas.
 *
 * @param {string} themaId
 * @param {string} perspektiveId z. B. 'europaeisch'
 * @returns {object|undefined} die Perspektive oder undefined
 */
function perspektiveNachId(themaId, perspektiveId) {
  const thema = themaNachId(themaId);
  if (!thema) return undefined;
  return thema.perspektiven.find((perspektive) => perspektive.id === perspektiveId);
}

/**
 * Kurzfassung aller Themen für Übersichtslisten — ohne die langen Texte.
 *
 * @returns {Array<{id: string, titel: string, epoche: string, frage: string,
 *                  anzahlPerspektiven: number}>}
 */
function themenUebersicht() {
  return alleThemen.map((thema) => ({
    id: thema.id,
    titel: thema.titel,
    epoche: thema.epoche,
    frage: thema.aufhaenger.frage,
    anzahlPerspektiven: thema.perspektiven.length,
  }));
}

module.exports = {
  alleThemen,
  themaNachId,
  perspektiveNachId,
  themenUebersicht,
};
