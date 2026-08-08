// Abschnitt 5: „Stimmt's?" — lockere Fragen ohne Zeitdruck und ohne Noten.
//
// Eine Frage nach der anderen, Antwort antippen, sofort die Erklärung dazu.
// Auch eine danebenliegende Antwort ist ein Gewinn: Die Erklärung ist das
// eigentlich Interessante. Am Ende ein freundlicher Abschluss — kein
// Ergebnis, keine Prozente (CLAUDE.md).
//
// Ausgewertet wird in utils/quiz.js, gespeichert über utils/fortschritt.js;
// diese Komponente zeigt nur an und reicht Antippen zurück.

import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  abschlusstext,
  alleErkundet,
  anzahlBeantwortet,
  ersteOffeneFrage,
  gegebeneAntwort,
  pruefeAntwort,
} from '../../utils/quiz';
import Knopf from '../Knopf';
import { abstand, farben, radius, schrift } from '../design';

/**
 * @param {{thema: object, antworten: object, onAntwort: Function,
 *          onNeuBeginnen: Function}} props
 */
export default function QuizAbschnitt({ thema, antworten, onAntwort, onNeuBeginnen }) {
  const quiz = thema.quiz;
  const [index, setIndex] = useState(() => ersteOffeneFrage(quiz, antworten));
  const [zeigeAbschluss, setZeigeAbschluss] = useState(() => alleErkundet(quiz, antworten));

  const beginneNeu = () => {
    onNeuBeginnen();
    setIndex(0);
    setZeigeAbschluss(false);
  };

  if (zeigeAbschluss) {
    return (
      <View>
        <Text style={stile.marke}>Stimmt’s?</Text>
        <View style={stile.abschlusskarte}>
          <Text style={stile.abschlussHaken}>✓</Text>
          <Text style={stile.abschlussTitel}>Du hast alle Fragen erkundet!</Text>
          <Text style={stile.abschlussText}>{abschlusstext(quiz, antworten)}</Text>
        </View>

        <View style={stile.abschlussKnoepfe}>
          <Knopf titel="Fragen noch einmal ansehen" art="leer" onPress={() => setZeigeAbschluss(false)} dehnbar />
        </View>
        <View style={stile.leiseZeile}>
          <Knopf titel="Von vorn beginnen" art="leise" onPress={beginneNeu} />
        </View>
      </View>
    );
  }

  const frage = quiz[index];
  const gewaehlt = gegebeneAntwort(antworten, index);
  const beantwortet = gewaehlt !== null;
  const ergebnis = beantwortet ? pruefeAntwort(frage, gewaehlt) : null;
  const letzteFrage = index === quiz.length - 1;

  return (
    <View>
      <View style={stile.kopf}>
        <Text style={stile.marke}>Stimmt’s?</Text>
        <Text style={stile.zaehler}>
          Frage {index + 1} von {quiz.length} · {anzahlBeantwortet(quiz, antworten)} erkundet
        </Text>
      </View>

      <Text style={stile.frage}>{frage.frage}</Text>

      {frage.antworten.map((antwort, i) => {
        const istRichtige = beantwortet && i === ergebnis.richtigerIndex;
        const istDaneben = beantwortet && i === gewaehlt && !ergebnis.richtig;
        return (
          <Pressable
            key={i}
            accessibilityRole="button"
            accessibilityState={{ selected: i === gewaehlt }}
            onPress={beantwortet ? undefined : () => onAntwort(index, i)}
            style={({ pressed }) => [
              stile.antwort,
              istRichtige && stile.antwortRichtig,
              istDaneben && stile.antwortDaneben,
              beantwortet && !istRichtige && !istDaneben && stile.antwortBlass,
              pressed && !beantwortet && stile.gedrueckt,
            ]}
          >
            <Text
              style={[
                stile.antwortZeichen,
                istRichtige && { color: farben.richtig },
                istDaneben && { color: farben.daneben },
              ]}
            >
              {istRichtige ? '✓' : istDaneben ? '✗' : '○'}
            </Text>
            <Text
              style={[
                stile.antwortText,
                istRichtige && { color: farben.richtig, fontWeight: '700' },
                istDaneben && { color: farben.daneben },
              ]}
            >
              {antwort}
            </Text>
          </Pressable>
        );
      })}

      {beantwortet ? (
        <View
          style={[
            stile.erklaerung,
            {
              backgroundColor: ergebnis.richtig ? farben.richtigFlaeche : farben.danebenFlaeche,
              borderLeftColor: ergebnis.richtig ? farben.richtig : farben.daneben,
            },
          ]}
        >
          <Text
            style={[stile.erklaerungTitel, { color: ergebnis.richtig ? farben.richtig : farben.daneben }]}
          >
            {ergebnis.richtig ? 'Getroffen.' : 'Knapp daneben — und genau darum geht es:'}
          </Text>
          <Text style={stile.erklaerungText}>{ergebnis.erklaerung}</Text>
        </View>
      ) : (
        <Text style={stile.hinweis}>
          Tippe an, was du für richtig hältst. Kein Zeitdruck, keine Note — die Erklärung kommt so
          oder so.
        </Text>
      )}

      <View style={stile.navigation}>
        <Knopf
          titel="◂ Vorige Frage"
          art="leer"
          onPress={() => setIndex(index - 1)}
          deaktiviert={index === 0}
          dehnbar
        />
        {letzteFrage ? (
          <Knopf
            titel="Abschluss"
            onPress={() => setZeigeAbschluss(true)}
            deaktiviert={!beantwortet}
            dehnbar
          />
        ) : (
          <Knopf titel="Nächste Frage ▸" onPress={() => setIndex(index + 1)} dehnbar />
        )}
      </View>
    </View>
  );
}

const stile = StyleSheet.create({
  kopf: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: abstand.klein,
  },
  marke: {
    ...schrift.winzig,
    color: farben.akzentHell,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: abstand.klein,
  },
  zaehler: {
    ...schrift.winzig,
    color: farben.textLeise,
  },
  frage: {
    ...schrift.mittel,
    color: farben.akzent,
    fontWeight: '700',
    marginBottom: abstand.mittel,
  },
  antwort: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: abstand.klein,
    backgroundColor: farben.flaeche,
    borderWidth: 1.5,
    borderColor: farben.rand,
    borderRadius: radius.mittel,
    padding: abstand.mittel,
    marginBottom: abstand.klein,
  },
  antwortRichtig: {
    borderColor: farben.richtig,
    backgroundColor: farben.richtigFlaeche,
  },
  antwortDaneben: {
    borderColor: farben.daneben,
    backgroundColor: farben.danebenFlaeche,
  },
  antwortBlass: {
    opacity: 0.55,
  },
  gedrueckt: {
    opacity: 0.8,
    transform: [{ scale: 0.995 }],
  },
  antwortZeichen: {
    ...schrift.fliess,
    width: 20,
    color: farben.textLeise,
    fontWeight: '700',
  },
  antwortText: {
    ...schrift.fliess,
    flex: 1,
    color: farben.text,
  },
  erklaerung: {
    borderRadius: radius.mittel,
    borderLeftWidth: 5,
    padding: abstand.mittel,
    marginTop: abstand.klein,
  },
  erklaerungTitel: {
    ...schrift.klein,
    fontWeight: '800',
    marginBottom: 4,
  },
  erklaerungText: {
    ...schrift.klein,
    color: farben.text,
  },
  hinweis: {
    ...schrift.winzig,
    color: farben.textLeise,
    marginTop: abstand.klein,
  },
  navigation: {
    flexDirection: 'row',
    gap: abstand.klein,
    marginTop: abstand.gross,
  },
  abschlusskarte: {
    backgroundColor: farben.richtigFlaeche,
    borderRadius: radius.gross,
    borderWidth: 1.5,
    borderColor: farben.richtig,
    padding: abstand.gross,
    alignItems: 'center',
  },
  abschlussHaken: {
    fontSize: 40,
    color: farben.richtig,
    marginBottom: abstand.klein,
  },
  abschlussTitel: {
    ...schrift.gross,
    color: farben.richtig,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: abstand.klein,
  },
  abschlussText: {
    ...schrift.fliess,
    color: farben.text,
    textAlign: 'center',
  },
  abschlussKnoepfe: {
    flexDirection: 'row',
    marginTop: abstand.gross,
  },
  leiseZeile: {
    alignItems: 'center',
    marginTop: abstand.klein,
  },
});
