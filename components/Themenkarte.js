// Eine Karte in der Themenübersicht: Titel, Epoche, Aufhänger-Frage,
// Anzahl der Blickwinkel und die Fortschritts-Markierung.

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { abstand, farben, kartenschatten, radius, schrift } from './design';

/** Farbe und Zeichen je Fortschritts-Stufe. */
const STUFEN_BILD = {
  neu: { farbe: farben.textLeise, flaeche: farben.flaecheGedaempft, zeichen: '○' },
  entdeckt: { farbe: farben.akzentHell, flaeche: '#FBEBD3', zeichen: '◐' },
  erforscht: { farbe: farben.richtig, flaeche: farben.richtigFlaeche, zeichen: '●' },
};

/**
 * @param {{eintrag: {id, titel, epoche, frage, anzahlPerspektiven,
 *          stufe, stufenText}, onOeffne: Function}} props
 */
export default function Themenkarte({ eintrag, onOeffne }) {
  const bild = STUFEN_BILD[eintrag.stufe] || STUFEN_BILD.neu;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${eintrag.titel}, ${eintrag.stufenText}`}
      onPress={() => onOeffne(eintrag.id)}
      style={({ pressed }) => [stile.karte, pressed && stile.gedrueckt]}
    >
      <View style={stile.kopf}>
        <Text style={stile.epoche} numberOfLines={2}>
          {eintrag.epoche}
        </Text>
        <View style={[stile.marke, { backgroundColor: bild.flaeche }]}>
          <Text style={[stile.markeZeichen, { color: bild.farbe }]}>{bild.zeichen}</Text>
          <Text style={[stile.markeText, { color: bild.farbe }]}>{eintrag.stufenText}</Text>
        </View>
      </View>

      <Text style={stile.titel}>{eintrag.titel}</Text>
      <Text style={stile.frage}>{eintrag.frage}</Text>

      <View style={stile.fuss}>
        <Text style={stile.fussText}>
          {eintrag.anzahlPerspektiven === 1
            ? '1 Blickwinkel'
            : `${eintrag.anzahlPerspektiven} Blickwinkel`}
        </Text>
        <Text style={stile.pfeil}>Öffnen ›</Text>
      </View>
    </Pressable>
  );
}

const stile = StyleSheet.create({
  karte: {
    backgroundColor: farben.flaeche,
    borderRadius: radius.gross,
    padding: abstand.gross,
    marginBottom: abstand.mittel,
    borderWidth: 1,
    borderColor: farben.rand,
    ...kartenschatten,
  },
  gedrueckt: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  kopf: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: abstand.klein,
    marginBottom: abstand.klein,
  },
  epoche: {
    ...schrift.winzig,
    flex: 1,
    color: farben.textLeise,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  marke: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.rund,
  },
  markeZeichen: {
    fontSize: 11,
  },
  markeText: {
    ...schrift.winzig,
    fontWeight: '700',
  },
  titel: {
    ...schrift.gross,
    color: farben.akzent,
    fontWeight: '700',
    marginBottom: 6,
  },
  frage: {
    ...schrift.fliess,
    color: farben.text,
  },
  fuss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: abstand.mittel,
    paddingTop: abstand.mittel,
    borderTopWidth: 1,
    borderTopColor: farben.akzentZart,
  },
  fussText: {
    ...schrift.klein,
    color: farben.textLeise,
  },
  pfeil: {
    ...schrift.klein,
    color: farben.akzent,
    fontWeight: '700',
  },
});
