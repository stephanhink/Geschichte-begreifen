// Stellt einen Themen-Text dar (Überschriften, Absätze, Aufzählungen).
//
// Dünne Komponente nach der Architektur-Regel: Das Zerlegen macht
// utils/markdown.js, hier wird nur noch angezeigt.

import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { zerlegeInline, zerlegeMarkdown } from '../utils/markdown';
import { abstand, farben, schrift } from './design';

/**
 * Ein Absatz mit Hervorhebungen (**fett**).
 */
function Absatz({ text, stil }) {
  const stuecke = useMemo(() => zerlegeInline(text), [text]);
  return (
    <Text style={stil}>
      {stuecke.map((stueck, i) => (
        <Text key={i} style={stueck.fett ? stile.fett : null}>
          {stueck.text}
        </Text>
      ))}
    </Text>
  );
}

/**
 * @param {{text: string, akzent?: string, kompakt?: boolean}} props
 *   akzent  — Farbe der Zwischenüberschriften (z. B. der Perspektiven-Ton)
 *   kompakt — etwas kleinere Schrift für Nebenflächen
 */
export default function MarkdownText({ text, akzent = farben.akzent, kompakt = false }) {
  const bloecke = useMemo(() => zerlegeMarkdown(text), [text]);
  const absatzstil = [stile.absatz, kompakt ? schrift.klein : schrift.fliess];

  return (
    <View>
      {bloecke.map((block, i) => {
        if (block.art === 'ueberschrift') {
          return (
            <View key={i} style={[stile.ueberschriftBlock, i === 0 && stile.ohneAbstandOben]}>
              <View style={[stile.ueberschriftStrich, { backgroundColor: akzent }]} />
              <Text style={[stile.ueberschrift, { color: akzent }]}>{block.text}</Text>
            </View>
          );
        }

        if (block.art === 'liste') {
          return (
            <View key={i} style={stile.liste}>
              {block.punkte.map((punkt, j) => (
                <View key={j} style={stile.listenzeile}>
                  <Text style={[stile.aufzaehlungspunkt, { color: akzent }]}>•</Text>
                  <Absatz text={punkt} stil={[absatzstil, stile.listentext]} />
                </View>
              ))}
            </View>
          );
        }

        return <Absatz key={i} text={block.text} stil={absatzstil} />;
      })}
    </View>
  );
}

const stile = StyleSheet.create({
  absatz: {
    color: farben.text,
    marginBottom: abstand.mittel,
  },
  fett: {
    fontWeight: '700',
    color: farben.akzent,
  },
  ueberschriftBlock: {
    marginTop: abstand.mittel,
    marginBottom: abstand.mittel,
  },
  ohneAbstandOben: {
    marginTop: 0,
  },
  ueberschriftStrich: {
    width: 40,
    height: 3,
    borderRadius: 2,
    marginBottom: abstand.klein,
  },
  ueberschrift: {
    ...schrift.mittel,
    fontWeight: '700',
  },
  liste: {
    marginBottom: abstand.klein,
  },
  listenzeile: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  aufzaehlungspunkt: {
    ...schrift.fliess,
    width: 18,
    fontWeight: '700',
  },
  listentext: {
    flex: 1,
  },
});
