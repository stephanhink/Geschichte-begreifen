// Die Kapitel-Ansicht eines Themas: die Abschnitte des Lernformats zum
// Durchblättern — Aufhänger, Blickwinkel, Synthese, Dein Urteil, „Stimmt's?".
//
// Jeder Abschnitt ist eine eigene Ansicht statt ein endloser Scroll: So bleibt
// jeder Schritt für sich lesbar. Gesprungen werden darf trotzdem jederzeit
// über die Schrittleiste am Kopf.
//
// Dünn nach der Architektur-Regel: Reihenfolge und Auswahl der Abschnitte
// kommen aus utils/lernformat.js, die Inhalte aus utils/themen/, das
// Speichern erledigt App.js über utils/fortschritt.js.

import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Knopf from '../components/Knopf';
import Schrittleiste from '../components/Schrittleiste';
import AufhaengerAbschnitt from '../components/abschnitte/AufhaengerAbschnitt';
import PerspektivenAbschnitt from '../components/abschnitte/PerspektivenAbschnitt';
import QuizAbschnitt from '../components/abschnitte/QuizAbschnitt';
import SyntheseAbschnitt from '../components/abschnitte/SyntheseAbschnitt';
import UrteilAbschnitt from '../components/abschnitte/UrteilAbschnitt';
import { abstand, farben, radius, schrift } from '../components/design';
import { abschnitteFuer, begrenze } from '../utils/lernformat';

/**
 * @param {{thema: object, stand: object, onZurueck: Function,
 *          onSpeichereUrteil: Function, onQuizAntwort: Function,
 *          onQuizZuruecksetzen: Function}} props
 */
export default function Kapitel({
  thema,
  stand,
  onZurueck,
  onSpeichereUrteil,
  onQuizAntwort,
  onQuizZuruecksetzen,
}) {
  const abschnitte = abschnitteFuer(thema);
  const [schritt, setSchritt] = useState(0);
  const [perspektive, setPerspektive] = useState(0);
  const scrollRef = useRef(null);

  const aktuell = abschnitte[schritt];

  // Bei jedem Abschnittswechsel oben anfangen — sonst landet man mitten im
  // nächsten Text.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ y: 0, animated: false });
  }, [schritt, perspektive]);

  const geheZu = (ziel) => setSchritt(begrenze(ziel, abschnitte.length));

  const letzterSchritt = schritt === abschnitte.length - 1;

  return (
    <KeyboardAvoidingView
      style={stile.flaeche}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={stile.kopf}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Zurück zur Themenübersicht"
          onPress={onZurueck}
          style={({ pressed }) => [stile.zurueck, pressed && stile.gedrueckt]}
          hitSlop={8}
        >
          <Text style={stile.zurueckText}>‹ Themen</Text>
        </Pressable>
        <Text style={stile.kopfTitel} numberOfLines={1}>
          {thema.titel}
        </Text>
      </View>

      <View style={stile.leiste}>
        <Schrittleiste abschnitte={abschnitte} aktiv={schritt} onWechsel={geheZu} />
      </View>

      <ScrollView
        ref={scrollRef}
        style={stile.rolle}
        contentContainerStyle={stile.inhalt}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {aktuell.id === 'aufhaenger' ? <AufhaengerAbschnitt thema={thema} /> : null}

        {aktuell.id === 'perspektiven' ? (
          <PerspektivenAbschnitt
            perspektiven={thema.perspektiven}
            aktiv={perspektive}
            onWechsel={setPerspektive}
          />
        ) : null}

        {aktuell.id === 'synthese' ? <SyntheseAbschnitt thema={thema} /> : null}

        {aktuell.id === 'urteil' ? (
          <UrteilAbschnitt thema={thema} urteil={stand.urteil} onSpeichern={onSpeichereUrteil} />
        ) : null}

        {aktuell.id === 'quiz' ? (
          <QuizAbschnitt
            thema={thema}
            antworten={stand.quizAntworten}
            onAntwort={onQuizAntwort}
            onNeuBeginnen={onQuizZuruecksetzen}
          />
        ) : null}
      </ScrollView>

      <View style={stile.fuss}>
        <Knopf
          titel="◂ Zurück"
          art="leer"
          onPress={() => geheZu(schritt - 1)}
          deaktiviert={schritt === 0}
          dehnbar
        />
        {letzterSchritt ? (
          <Knopf titel="Fertig ▸" onPress={onZurueck} dehnbar />
        ) : (
          <Knopf titel={`${abschnitte[schritt + 1].name} ▸`} onPress={() => geheZu(schritt + 1)} dehnbar />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const stile = StyleSheet.create({
  flaeche: {
    flex: 1,
  },
  kopf: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: abstand.mittel,
    paddingHorizontal: abstand.gross,
    paddingBottom: abstand.klein,
  },
  zurueck: {
    paddingVertical: 6,
    paddingHorizontal: abstand.klein,
    marginLeft: -abstand.klein,
    borderRadius: radius.klein,
  },
  gedrueckt: {
    opacity: 0.6,
  },
  zurueckText: {
    ...schrift.klein,
    color: farben.akzent,
    fontWeight: '700',
  },
  kopfTitel: {
    ...schrift.klein,
    flex: 1,
    color: farben.textLeise,
    textAlign: 'right',
  },
  leiste: {
    paddingHorizontal: abstand.gross,
    paddingBottom: abstand.mittel,
    borderBottomWidth: 1,
    borderBottomColor: farben.akzentZart,
  },
  rolle: {
    flex: 1,
  },
  inhalt: {
    paddingHorizontal: abstand.gross,
    paddingTop: abstand.gross,
    paddingBottom: abstand.sehrGross,
  },
  fuss: {
    flexDirection: 'row',
    gap: abstand.klein,
    paddingHorizontal: abstand.gross,
    paddingTop: abstand.mittel,
    paddingBottom: abstand.klein,
    borderTopWidth: 1,
    borderTopColor: farben.akzentZart,
    backgroundColor: farben.hintergrund,
  },
});
