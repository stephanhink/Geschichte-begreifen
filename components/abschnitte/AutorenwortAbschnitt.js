// Abschnitt 6: das Schlusswort des Autors — das allerletzte Wort der App.
//
// Bewusst hervorgehoben und bewusst anders als alle KI-Abschnitte: Der
// Text wird wörtlich übernommen (vom Betreiber geschrieben, nicht von der
// KI verbessert — Authentizität gewollt). Die Darstellung betont das:
// eine eigene Fläche, ein Titel mit Namenszug.

import { StyleSheet, Text, View } from 'react-native';

import MarkdownText from '../MarkdownText';
import { abstand, farben, radius, schrift } from '../design';

/**
 * Das Schlusswort des Autors — hervorgehoben als Abschluss der App.
 */
export default function AutorenwortAbschnitt({ thema }) {
  const text =
    typeof thema.autorenwort === 'string'
      ? thema.autorenwort
      : thema.autorenwort.text;

  return (
    <View style={styles.rahmen}>
      <Text style={styles.titel}>Schlusswort des Autors</Text>
      <View style={styles.linie} />
      <MarkdownText text={text} style={styles.text} />
      <Text style={styles.namenszug}>— Stephan Hink</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rahmen: {
    backgroundColor: farben.flaecheGedaempft,
    borderRadius: radius.gross,
    padding: abstand.gross,
    borderLeftWidth: 4,
    borderLeftColor: farben.akzent,
  },
  titel: {
    ...schrift.gross,
    color: farben.akzent,
    marginBottom: abstand.klein,
  },
  linie: {
    height: 2,
    backgroundColor: farben.akzentZart,
    marginBottom: abstand.mittel,
  },
  text: {
    ...schrift.fliess,
    color: farben.text,
  },
  namenszug: {
    ...schrift.fliess,
    color: farben.akzent,
    fontWeight: '700',
    marginTop: abstand.mittel,
  },
});
