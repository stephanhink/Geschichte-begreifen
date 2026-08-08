// Der Knopf der App — in drei Ausprägungen.
//
//   art="voll"   — die Hauptaktion („Weiter", „Thema öffnen")
//   art="leer"   — die Nebenaktion („Zurück")
//   art="leise"  — beiläufig, ohne Rahmen („Noch einmal")

import { Pressable, StyleSheet, Text } from 'react-native';

import { abstand, farben, radius, schrift } from './design';

/**
 * @param {{titel: string, onPress: Function, art?: 'voll'|'leer'|'leise',
 *          deaktiviert?: boolean, dehnbar?: boolean, farbe?: string}} props
 */
export default function Knopf({
  titel,
  onPress,
  art = 'voll',
  deaktiviert = false,
  dehnbar = false,
  farbe = farben.akzent,
}) {
  const voll = art === 'voll';
  const leise = art === 'leise';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: deaktiviert }}
      onPress={deaktiviert ? undefined : onPress}
      style={({ pressed }) => [
        stile.knopf,
        leise && stile.leise,
        voll && { backgroundColor: farbe },
        art === 'leer' && { borderWidth: 1.5, borderColor: farbe },
        dehnbar && stile.dehnbar,
        pressed && !deaktiviert && stile.gedrueckt,
        deaktiviert && stile.deaktiviert,
      ]}
    >
      <Text
        style={[
          stile.beschriftung,
          leise ? schrift.klein : schrift.fliess,
          { color: voll ? '#FFFFFF' : farbe },
        ]}
        numberOfLines={1}
      >
        {titel}
      </Text>
    </Pressable>
  );
}

const stile = StyleSheet.create({
  knopf: {
    paddingVertical: 14,
    paddingHorizontal: abstand.gross,
    borderRadius: radius.rund,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leise: {
    paddingVertical: abstand.klein,
    paddingHorizontal: abstand.mittel,
  },
  dehnbar: {
    // Nebeneinanderstehende Knöpfe teilen sich die Breite — dann darf innen
    // weniger Luft sein, damit die Beschriftung nicht abgeschnitten wird.
    flex: 1,
    paddingHorizontal: abstand.mittel,
  },
  gedrueckt: {
    opacity: 0.75,
    transform: [{ scale: 0.985 }],
  },
  deaktiviert: {
    opacity: 0.4,
  },
  beschriftung: {
    fontWeight: '700',
    textAlign: 'center',
  },
});
