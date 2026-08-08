// Die Schrittleiste am Kopf eines Kapitels: wo im Lernformat bin ich gerade?
//
// Antippbar — man darf jederzeit springen. Kein Zwang, die Reihenfolge
// einzuhalten (CLAUDE.md: Erforschen statt Pauken).

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { abstand, farben, radius, schrift } from './design';

/**
 * @param {{abschnitte: Array<{id: string, kurz: string}>, aktiv: number,
 *          onWechsel: Function}} props
 */
export default function Schrittleiste({ abschnitte, aktiv, onWechsel }) {
  return (
    <View style={stile.leiste}>
      {abschnitte.map((abschnitt, i) => {
        const istAktiv = i === aktiv;
        const erledigt = i < aktiv;
        return (
          <Pressable
            key={abschnitt.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: istAktiv }}
            accessibilityLabel={`Abschnitt ${abschnitt.kurz}`}
            onPress={() => onWechsel(i)}
            style={stile.schritt}
          >
            <View
              style={[
                stile.balken,
                erledigt && stile.balkenErledigt,
                istAktiv && stile.balkenAktiv,
              ]}
            />
            <Text
              style={[stile.beschriftung, istAktiv && stile.beschriftungAktiv]}
              numberOfLines={1}
            >
              {abschnitt.kurz}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const stile = StyleSheet.create({
  leiste: {
    flexDirection: 'row',
    gap: 6,
  },
  schritt: {
    flex: 1,
  },
  balken: {
    height: 4,
    borderRadius: 2,
    backgroundColor: farben.akzentZart,
    marginBottom: 6,
  },
  balkenErledigt: {
    backgroundColor: farben.akzentHell,
  },
  balkenAktiv: {
    backgroundColor: farben.akzent,
    height: 5,
    borderRadius: radius.klein,
  },
  beschriftung: {
    ...schrift.winzig,
    color: farben.textLeise,
    textAlign: 'center',
  },
  beschriftungAktiv: {
    color: farben.akzent,
    fontWeight: '700',
  },
});
