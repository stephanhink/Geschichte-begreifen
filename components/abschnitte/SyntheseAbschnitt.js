// Abschnitt 3: die Synthese — wo die Sichtweisen sich treffen und wo sie
// auseinandergehen.
//
// Die Kernaussagen der Synthesetexte stehen im Modul als **Hervorhebung**
// am Absatzanfang („**Wo sie sich treffen:** …"). MarkdownText setzt sie
// im Akzentton — hier bekommt jeder solche Absatz zusätzlich eine eigene
// Fläche, damit die Gegenüberstellung ins Auge springt.

import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { zerlegeInline, zerlegeMarkdown } from '../../utils/markdown';
import MarkdownText from '../MarkdownText';
import { abstand, farben, radius, schrift } from '../design';

/**
 * Teilt die Synthese in Absätze mit und ohne Kernaussage.
 *
 * Ein Absatz gilt als Kernaussage, wenn er mit einer Hervorhebung beginnt.
 */
function teileAuf(text) {
  return zerlegeMarkdown(text).map((block) => {
    if (block.art !== 'absatz') return { art: 'sonst', block };
    const stuecke = zerlegeInline(block.text);
    if (stuecke.length > 1 && stuecke[0].fett) {
      return {
        art: 'kern',
        titel: stuecke[0].text.replace(/:\s*$/, ''),
        text: stuecke
          .slice(1)
          .map((s) => s.text)
          .join('')
          .trim(),
      };
    }
    return { art: 'sonst', block };
  });
}

/**
 * @param {{thema: object}} props
 */
export default function SyntheseAbschnitt({ thema }) {
  const teile = useMemo(() => teileAuf(thema.synthese), [thema.synthese]);

  return (
    <View>
      <Text style={stile.marke}>Synthese</Text>
      <Text style={stile.titel}>Zwei Erzählungen nebeneinander</Text>
      <Text style={stile.einleitung}>
        Kein Schiedsspruch, keine Auflösung — nur der Blick darauf, wo die Sichtweisen
        übereinstimmen und wo sie sich widersprechen.
      </Text>

      {teile.map((teil, i) =>
        teil.art === 'kern' ? (
          <View key={i} style={stile.kernblock}>
            <Text style={stile.kerntitel}>{teil.titel}</Text>
            <Text style={stile.kerntext}>{teil.text}</Text>
          </View>
        ) : (
          <MarkdownText
            key={i}
            text={
              teil.block.art === 'liste'
                ? teil.block.punkte.map((p) => `- ${p}`).join('\n')
                : `${teil.block.art === 'ueberschrift' ? '## ' : ''}${teil.block.text}`
            }
          />
        ),
      )}
    </View>
  );
}

const stile = StyleSheet.create({
  marke: {
    ...schrift.winzig,
    color: farben.akzentHell,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: abstand.klein,
  },
  titel: {
    ...schrift.gross,
    color: farben.akzent,
    fontWeight: '800',
    marginBottom: 6,
  },
  einleitung: {
    ...schrift.klein,
    color: farben.textLeise,
    marginBottom: abstand.gross,
  },
  kernblock: {
    backgroundColor: farben.flaecheGedaempft,
    borderRadius: radius.mittel,
    borderLeftWidth: 5,
    borderLeftColor: farben.akzent,
    padding: abstand.mittel,
    marginBottom: abstand.mittel,
  },
  kerntitel: {
    ...schrift.mittel,
    color: farben.akzent,
    fontWeight: '800',
    marginBottom: 6,
  },
  kerntext: {
    ...schrift.fliess,
    color: farben.text,
  },
});
