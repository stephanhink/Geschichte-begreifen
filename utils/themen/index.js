// Zentrale Registrierung aller Themen-Module.
//
// Ein neues Thema wird angelegt, indem eine Datei nach dem Schema aus
// schema.js erstellt und hier in `alleThemen` eingetragen wird. Alles, was
// nicht hier steht, findet die App nicht — und die Prüfung sieht es auch
// nicht an.
//
// Die Reihenfolge im Array ist die Reihenfolge in der App (Themenlandkarte
// aus CLAUDE.md: Rom → China → Dschingis Khan → Japan →
// Germanen/Völkerwanderung → frühe Königreiche → Mittelalter →
// Ausblick Neuzeit).
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
// CommonJS, damit dieselbe Datei mit blankem `node` prüfbar ist und von
// Metro/Babel in der App geladen werden kann (siehe schema.js).

const roemischesReich = require('./roemisches-reich');
const china = require('./china');
const dschingisKhan = require('./dschingis-khan');
const japan = require('./japan');

/** Alle Themen in der Reihenfolge der Themenlandkarte. */
const alleThemen = [roemischesReich, china, dschingisKhan, japan];

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
