// Abschnitt 1: der Aufhänger — die Frage groß, dann der Einstiegstext.
//
// Bewusst keine Jahreszahlen-Wüste (CLAUDE.md): Die Frage steht im
// Vordergrund, die Epoche nur als leise Einordnung.

import { StyleSheet, Text, View } from 'react-native';

import MarkdownText from '../MarkdownText';
import { abstand, farben, radius, schrift } from '../design';

/**
 * @param {{thema: object}} props
 */
export default function AufhaengerAbschnitt({ thema }) {
  return (
    <View>
      <Text style={stile.marke}>Aufhänger</Text>
      <Text style={stile.frage}>{thema.aufhaenger.frage}</Text>

      <View style={stile.epocheBlock}>
        <Text style={stile.epoche}>{thema.epoche}</Text>
      </View>

      <MarkdownText text={thema.aufhaenger.text} />
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
  frage: {
    ...schrift.riesig,
    color: farben.akzent,
    fontWeight: '800',
    marginBottom: abstand.mittel,
  },
  epocheBlock: {
    backgroundColor: farben.flaecheGedaempft,
    borderRadius: radius.klein,
    paddingVertical: abstand.klein,
    paddingHorizontal: abstand.mittel,
    marginBottom: abstand.gross,
  },
  epoche: {
    ...schrift.klein,
    color: farben.textLeise,
  },
});
