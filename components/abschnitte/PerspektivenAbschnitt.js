// Abschnitt 2: die Blickwinkel — der Kern der App.
//
// Jede Perspektive trägt ihren Namen und einen unübersehbaren Hinweis:
// Das hier ist eine Erzählung, nicht die eine Wahrheit (CLAUDE.md,
// Leitidee). Umgeschaltet wird oben über Reiter, geblättert unten über
// „nächste Sichtweise" — die Sichtweisen stehen damit gleichberechtigt
// nebeneinander, keine ist die Hauptsache.
//
// Die Attribution (welche Stimme den Text verfasst hat) bleibt bewusst im
// Repo und erscheint hier nicht — so steht die Erzählung für sich.

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import MarkdownText from '../MarkdownText';
import { abstand, farben, perspektivfarbe, radius, schrift } from '../design';

/**
 * @param {{perspektiven: Array<object>, aktiv: number, onWechsel: Function}} props
 */
export default function PerspektivenAbschnitt({ perspektiven, aktiv, onWechsel }) {
  const perspektive = perspektiven[aktiv];
  const farbe = perspektivfarbe(aktiv);
  const naechste = (aktiv + 1) % perspektiven.length;

  return (
    <View>
      <Text style={stile.marke}>Zwei Blickwinkel</Text>
      <Text style={stile.einleitung}>
        Dieselbe Geschichte, von verschiedenen Standpunkten aus erzählt. Tippe oben um, um zu
        vergleichen.
      </Text>

      {/* Reiter: alle Sichtweisen auf einen Blick, gleich groß dargestellt. */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={stile.reiterleiste}
      >
        {perspektiven.map((eintrag, i) => {
          const istAktiv = i === aktiv;
          const eigeneFarbe = perspektivfarbe(i);
          return (
            <Pressable
              key={eintrag.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: istAktiv }}
              onPress={() => onWechsel(i)}
              style={({ pressed }) => [
                stile.reiter,
                {
                  backgroundColor: istAktiv ? eigeneFarbe.kraeftig : eigeneFarbe.zart,
                  borderColor: eigeneFarbe.kraeftig,
                },
                pressed && stile.gedrueckt,
              ]}
            >
              <Text
                style={[
                  stile.reiterText,
                  { color: istAktiv ? '#FFFFFF' : eigeneFarbe.kraeftig },
                ]}
              >
                {eintrag.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Die aktive Sichtweise. */}
      <View style={[stile.karte, { borderColor: farbe.kraeftig, backgroundColor: farbe.zart }]}>
        <Text style={[stile.name, { color: farbe.kraeftig }]}>{perspektive.name}</Text>
        <Text style={[stile.warnung, { color: farbe.kraeftig }]}>
          Eine Erzählung — nicht die eine Wahrheit
        </Text>
      </View>

      <MarkdownText text={perspektive.text} akzent={farbe.kraeftig} />

      {perspektiven.length > 1 ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => onWechsel(naechste)}
          style={({ pressed }) => [
            stile.wechsel,
            { borderColor: perspektivfarbe(naechste).kraeftig },
            pressed && stile.gedrueckt,
          ]}
        >
          <Text style={[stile.wechselText, { color: perspektivfarbe(naechste).kraeftig }]}>
            Und wie klingt es aus dieser Sicht? → {perspektiven[naechste].name}
          </Text>
        </Pressable>
      ) : null}
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
  einleitung: {
    ...schrift.klein,
    color: farben.textLeise,
    marginBottom: abstand.mittel,
  },
  reiterleiste: {
    flexDirection: 'row',
    gap: abstand.klein,
    paddingBottom: abstand.mittel,
  },
  reiter: {
    paddingVertical: abstand.klein,
    paddingHorizontal: abstand.mittel,
    borderRadius: radius.rund,
    borderWidth: 1.5,
  },
  reiterText: {
    ...schrift.klein,
    fontWeight: '700',
  },
  gedrueckt: {
    opacity: 0.8,
  },
  karte: {
    borderRadius: radius.mittel,
    borderLeftWidth: 5,
    padding: abstand.mittel,
    marginBottom: abstand.gross,
  },
  name: {
    ...schrift.mittel,
    fontWeight: '800',
  },
  warnung: {
    ...schrift.winzig,
    fontStyle: 'italic',
    marginTop: 2,
  },
  wechsel: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: radius.mittel,
    padding: abstand.mittel,
    marginTop: abstand.klein,
  },
  wechselText: {
    ...schrift.klein,
    fontWeight: '700',
    textAlign: 'center',
  },
});
