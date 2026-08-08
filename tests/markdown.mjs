// Prüfungen für utils/markdown.js — den kleinen Markdown-Zerleger.
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe:
// läuft mit blankem `node`.
//
// Der wichtigste Fall steht am Ende: die echten Texte aus utils/themen/
// müssen sich sauber zerlegen lassen — sonst zeigt die App Zeilensalat.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { zerlegeMarkdown, zerlegeInline, vorschau } = require('../utils/markdown.js');
const { alleThemen } = require('../utils/themen/index.js');

/**
 * @param {(name: string, ok: boolean) => void} pruefe Prüf-Funktion des Rahmens
 */
export function laufe(pruefe) {
  // --- Randfälle ---------------------------------------------------------
  pruefe('Markdown: leerer Text ergibt keine Blöcke', zerlegeMarkdown('').length === 0);
  pruefe('Markdown: nur Leerzeichen ergibt keine Blöcke', zerlegeMarkdown('   \n  \n').length === 0);
  pruefe('Markdown: Nicht-Text ergibt keine Blöcke', zerlegeMarkdown(null).length === 0);

  // --- Absätze -----------------------------------------------------------
  // Die Themen-Texte sind im Repo hart umbrochen. In der App muss daraus
  // wieder fließender Text werden.
  const umbrochen = 'Rom beginnt klein. Ein paar Hügel\nan einer Furt durch den Tiber.\n\nDann wächst Rom.';
  const absaetze = zerlegeMarkdown(umbrochen);
  pruefe('Markdown: Leerzeile trennt zwei Absätze', absaetze.length === 2);
  pruefe(
    'Markdown: harte Zeilenumbrüche werden zu Leerzeichen',
    absaetze[0].art === 'absatz' &&
      absaetze[0].text === 'Rom beginnt klein. Ein paar Hügel an einer Furt durch den Tiber.',
  );
  pruefe('Markdown: zweiter Absatz bleibt eigenständig', absaetze[1].text === 'Dann wächst Rom.');

  // --- Überschriften -----------------------------------------------------
  const mitUeberschrift = zerlegeMarkdown('## Aus einem Dorf wird ein Weltreich\n\nRom beginnt klein.');
  pruefe('Markdown: Überschrift wird erkannt', mitUeberschrift[0].art === 'ueberschrift');
  pruefe('Markdown: Überschrift kennt ihre Ebene', mitUeberschrift[0].ebene === 2);
  pruefe(
    'Markdown: Überschrift trägt die Rauten nicht mit',
    mitUeberschrift[0].text === 'Aus einem Dorf wird ein Weltreich',
  );
  pruefe('Markdown: Text nach der Überschrift bleibt Absatz', mitUeberschrift[1].art === 'absatz');
  pruefe(
    'Markdown: Überschrift ohne Leerzeile davor beendet den Absatz',
    zerlegeMarkdown('Ein Absatz.\n## Titel').length === 2,
  );

  // --- Listen ------------------------------------------------------------
  const liste = zerlegeMarkdown(
    ['- Das Reich war zu groß geworden, um von einer Stelle aus', '  regiert zu werden.', '- Seuchen und Missernten.'].join('\n'),
  );
  pruefe('Markdown: Aufzählung wird ein einziger Listenblock', liste.length === 1 && liste[0].art === 'liste');
  pruefe('Markdown: Aufzählung hat zwei Punkte', liste[0].punkte.length === 2);
  pruefe(
    'Markdown: eingerückte Folgezeile gehört zum Punkt davor',
    liste[0].punkte[0] === 'Das Reich war zu groß geworden, um von einer Stelle aus regiert zu werden.',
  );
  pruefe('Markdown: Sternchen-Aufzählung wird auch erkannt', zerlegeMarkdown('* Punkt')[0].art === 'liste');

  // --- Hervorhebungen ----------------------------------------------------
  const stuecke = zerlegeInline('**Die Straßen.** Rund 80 000 Kilometer.');
  pruefe('Inline: fetter Anfang wird abgetrennt', stuecke[0].fett === true && stuecke[0].text === 'Die Straßen.');
  pruefe('Inline: Rest bleibt normal', stuecke[1].fett === false && stuecke[1].text === ' Rund 80 000 Kilometer.');
  pruefe(
    'Inline: mehrere Hervorhebungen in einem Absatz',
    zerlegeInline('a **b** c **d** e').filter((s) => s.fett).length === 2,
  );
  pruefe('Inline: Text ohne Hervorhebung bleibt ein Stück', zerlegeInline('nur Text').length === 1);
  pruefe('Inline: leerer Text ergibt trotzdem ein Stück', zerlegeInline('').length === 1);
  pruefe(
    'Inline: Sternchen bleiben nirgends stehen',
    zerlegeInline('**a** und **b**').every((s) => !s.text.includes('*')),
  );

  // --- Vorschau ----------------------------------------------------------
  const langerText = 'Wort '.repeat(80);
  pruefe('Vorschau: kurzer Text bleibt unverändert', vorschau('Kurz und knapp.') === 'Kurz und knapp.');
  pruefe('Vorschau: langer Text wird gekürzt', vorschau(langerText, 60).length <= 62);
  pruefe('Vorschau: gekürzter Text endet mit Auslassung', vorschau(langerText, 60).endsWith('…'));
  pruefe('Vorschau: Überschrift allein ergibt keine Vorschau', vorschau('## Nur ein Titel') === '');
  pruefe('Vorschau: Hervorhebungen erscheinen als Klartext', !vorschau('**Fett** und normal.').includes('*'));

  // --- Die echten Texte --------------------------------------------------
  // Jeder Perspektiven- und Synthesetext muss sich in Blöcke zerlegen lassen,
  // und kein Block darf noch Markdown-Zeichen mit sich herumtragen.
  for (const thema of alleThemen) {
    const texte = [thema.aufhaenger.text, thema.synthese, ...thema.perspektiven.map((p) => p.text)];
    for (const text of texte) {
      const bloecke = zerlegeMarkdown(text);
      pruefe(`Markdown: Text in „${thema.id}" ergibt Blöcke`, bloecke.length > 0);
      pruefe(
        `Markdown: keine Raute bleibt in „${thema.id}" stehen`,
        bloecke.every((block) => block.art !== 'absatz' || !block.text.startsWith('#')),
      );
    }

    const perspektive = thema.perspektiven[0];
    pruefe(
      `Markdown: „${thema.id}" hat Zwischenüberschriften in der ersten Perspektive`,
      zerlegeMarkdown(perspektive.text).some((block) => block.art === 'ueberschrift'),
    );
  }
}
