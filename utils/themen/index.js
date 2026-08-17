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
// „Der Weg zum Ersten Weltkrieg" ist das vierzehnte Thema und das siebte des
// Neuzeit-Bogens. Es beginnt dort, wo „Die Kolonien" den Faden bereits knüpft
// (dieselben Kolonialrivalitäten gehören zu den Spannungen von 1914) und
// macht die Kriegsschuldfrage zum multiperspektivischen Herzstück: Die in
// Deutschland lange gelehrte Alleinschuld-These ist Artikel 231 des
// Versailler Vertrags, kein Forschungsstand. Das Schema erlaubt hier
// ausdrücklich mehr als zwei Stimmen — je Großmacht eine.
//
// „Die USA: Aufstieg zur Weltmacht" ist das fünfzehnte Thema und das achte
// des Neuzeit-Bogens. Es steht hinter „Der Weg zum Ersten Weltkrieg": Die
// USA treten 1917 in genau den Krieg ein, dessen Julikrise das vorherige
// Kapitel erzählt, und dieser Kriegseintritt ist der erste Schritt der
// amerikanischen Nation von einer Kontinental- zu einer Weltmacht. Die
// Perspektiven-Achse steht wieder nach außen — die USA gegen die, die ihre
// Weltmacht zu spüren bekamen (Philippinen, Lateinamerika, japanischstämmige
// Amerikaner, Afroamerikaner unter Jim Crow, Hiroshima und Nagasaki).
//
// „Weimarer Republik und der Weg in die Diktatur" ist das sechzehnte Thema
// und das neunte des Neuzeit-Bogens. Es beginnt dort, wo der Krieg endet,
// dessen Julikrise Kapitel 14 erzählt: im November 1918. Die
// Perspektiven-Achse dreht sich wieder nach innen — nicht zwei Länder stehen
// sich gegenüber, sondern die, die diese Demokratie bauten und verteidigten,
// und die, die sie nicht geschützt hat. Und es dreht die Leitidee der App
// noch einmal: Hier erzählt zuerst die Seite, die verlor — und die mit
// eigenen Fehlentscheidungen zu ihrer Niederlage beitrug.
//
// „Der Zweite Weltkrieg und die neue Weltordnung" ist das siebzehnte Thema und
// das zehnte — letzte — Kapitel des Neuzeit-Bogens. Es beginnt dort, wo das
// Kapitel davor endet: am 30. Januar 1933. Und es ist die einzige Stelle des
// ganzen Bogens, an der die eigene Seite die Täterseite ist. Deshalb spricht
// hier zuerst die Sicht der Besiegten: Eine Täterseite, die zuletzt spricht,
// redet sich heraus; eine, die zuerst spricht, muss die unbequemsten Sätze
// selbst sagen. Die weiteren Stimmen — die Sowjetunion mit der Hauptlast des
// Krieges, die USA und die Westmächte, die überfallenen Länder — ergänzt
// Hermes danach; das Schema erlaubt drei und mehr Perspektiven.
//
// „Die neue Weltordnung und der Kalte Krieg" ist das achtzehnte Thema und das
// elfte Kapitel des Neuzeit-Bogens. Es beginnt dort, wo das Kapitel davor
// endet: 1945, bei den Siegern, die sich noch die Hände schütteln — und es
// erzählt, wie daraus binnen zwei Jahren zwei Blöcke wurden, deren Grenze
// mitten durch Deutschland lief. Die Perspektiven-Achse steht wieder nach
// außen, aber anders als sonst verläuft sie diesmal quer durch die eigene
// Geschichte: Die Linie trennte nicht zwei Länder, sondern eines. Die Sicht
// des Westens steht zuerst, weil Opus diese Runde übernommen hat; die Sicht
// des Ostens (Sowjetunion, Warschauer Pakt, DDR) ergänzt Hermes danach.
//
// „Russland und der Westen" ist das neunzehnte Thema und das zwölfte Kapitel
// des Neuzeit-Bogens. Es beginnt am 25. Dezember 1991, wo das Kapitel davor
// endet, und übernimmt die Debatte, die jenes ausdrücklich hierher verwiesen
// hat: die über die NATO-Osterweiterung und den „Geist" des
// Zwei-plus-Vier-Vertrags. Es ist das einzige Kapitel der App, dessen
// Gegenstand nicht abgeschlossen ist — der Krieg, von dem es erzählt, wird
// geführt, während es geschrieben wird. Deshalb gilt hier die Zusatzregel für
// sensible Themen doppelt, und deshalb steht die Betreiber-Vorgabe „wirklich
// objektiv" über dem Abschnitt zu Russland unter Putin: Stabilisierung UND
// autoritäre Wende, beides mit Zahlen, nebeneinander. Die Sicht des Westens
// steht zuerst, weil Opus diese Runde übernommen hat; die Sicht Russlands
// ergänzt Hermes danach, möglicherweise mit der der Ukraine als dritter
// Stimme.
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
const wegZumErstenWeltkrieg = require('./weg-zum-ersten-weltkrieg');
const usaWeltmacht = require('./usa-weltmacht');
const weimarNs = require('./weimar-ns');
const zweiterWeltkrieg = require('./zweiter-weltkrieg');
const kalterKrieg = require('./kalter-krieg');
const russlandWesten = require('./russland-westen');

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
  wegZumErstenWeltkrieg,
  usaWeltmacht,
  weimarNs,
  zweiterWeltkrieg,
  kalterKrieg,
  russlandWesten,
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
