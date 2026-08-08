// Wurzel der App: hält den Fortschritt und entscheidet, welcher Screen dran ist.
//
// Navigation ohne zusätzliches Paket (wie bei „Mathe begreifen"): Es gibt
// genau zwei Ansichten — die Themenübersicht und ein Kapitel. Welche
// angezeigt wird, steckt in einem State-Feld. Das reicht für diese App und
// spart eine Abhängigkeit samt Einrichtungsaufwand.
//
// Architektur-Regel: Hier passiert keine Fachlogik. Themen kommen aus
// utils/themen, Fortschritt und Speichern aus utils/fortschritt — diese
// Datei verdrahtet nur beides mit der Oberfläche.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { abstand, farben, schrift } from './components/design';
import Kapitel from './screens/Kapitel';
import Themenuebersicht from './screens/Themenuebersicht';
import { erstelleFortschritt, leererStand, normalisiereStand, stufe, stufenText } from './utils/fortschritt';
import { alleThemen, themaNachId, themenUebersicht } from './utils/themen';

/** Der Fortschritt-Helfer, verdrahtet mit dem Gerätespeicher. */
const fortschritt = erstelleFortschritt(AsyncStorage);

export default function App() {
  // null = wird noch geladen; danach: Zuordnung themaId -> Stand
  const [staende, setStaende] = useState(null);
  const [offenesThema, setOffenesThema] = useState(null);

  // Spiegel der Stände für die Änderungs-Handler — so muss keiner von ihnen
  // von `staende` abhängen und beim Tippen neu gebaut werden.
  const standRef = useRef({});

  useEffect(() => {
    let abgebrochen = false;
    fortschritt.ladeAlle(alleThemen.map((thema) => thema.id)).then((geladen) => {
      if (abgebrochen) return;
      standRef.current = geladen;
      setStaende(geladen);
    });
    return () => {
      abgebrochen = true;
    };
  }, []);

  /** Ändert Felder eines Standes, zeigt ihn sofort an und schreibt ihn weg. */
  const aendereStand = useCallback((themaId, aenderung) => {
    const vorher = standRef.current[themaId] || leererStand();
    const neu = normalisiereStand({ ...vorher, ...aenderung, besucht: true });
    standRef.current = { ...standRef.current, [themaId]: neu };
    setStaende(standRef.current);
    // Absichtlich ohne await: Das Schreiben darf den Lernfluss nicht bremsen,
    // und utils/fortschritt.js schluckt Speicherfehler bereits.
    fortschritt.speichere(themaId, neu);
  }, []);

  const oeffneThema = useCallback(
    (themaId) => {
      aendereStand(themaId, {}); // markiert das Thema als besucht
      setOffenesThema(themaId);
    },
    [aendereStand],
  );

  const schliesseThema = useCallback(() => setOffenesThema(null), []);

  // Die Zurück-Taste auf Android führt aus dem Kapitel in die Übersicht.
  useEffect(() => {
    if (!offenesThema) return undefined;
    const abo = BackHandler.addEventListener('hardwareBackPress', () => {
      schliesseThema();
      return true;
    });
    return () => abo.remove();
  }, [offenesThema, schliesseThema]);

  const speichereUrteil = useCallback(
    (text) => {
      if (offenesThema) aendereStand(offenesThema, { urteil: text });
    },
    [aendereStand, offenesThema],
  );

  const merkeQuizAntwort = useCallback(
    (frageIndex, gewaehlt) => {
      if (!offenesThema) return;
      const vorher = standRef.current[offenesThema] || leererStand();
      aendereStand(offenesThema, {
        quizAntworten: { ...vorher.quizAntworten, [frageIndex]: gewaehlt },
      });
    },
    [aendereStand, offenesThema],
  );

  const setzeQuizZurueck = useCallback(() => {
    if (offenesThema) aendereStand(offenesThema, { quizAntworten: {} });
  }, [aendereStand, offenesThema]);

  // --- Anzeige -----------------------------------------------------------

  if (staende === null) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={stile.mitte}>
          <ActivityIndicator size="large" color={farben.akzent} />
          <Text style={stile.ladetext}>Geschichte begreifen</Text>
          <StatusBar style="dark" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const thema = offenesThema ? themaNachId(offenesThema) : undefined;

  const eintraege = themenUebersicht().map((eintrag) => {
    const stand = staende[eintrag.id] || leererStand();
    const gefundenesThema = themaNachId(eintrag.id);
    const stufenName = stufe(stand, gefundenesThema ? gefundenesThema.quiz : []);
    return { ...eintrag, stufe: stufenName, stufenText: stufenText(stufenName) };
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={stile.flaeche} edges={['top', 'left', 'right', 'bottom']}>
        {thema ? (
          <Kapitel
            key={thema.id}
            thema={thema}
            stand={staende[thema.id] || leererStand()}
            onZurueck={schliesseThema}
            onSpeichereUrteil={speichereUrteil}
            onQuizAntwort={merkeQuizAntwort}
            onQuizZuruecksetzen={setzeQuizZurueck}
          />
        ) : (
          <Themenuebersicht eintraege={eintraege} onOeffne={oeffneThema} />
        )}
        <StatusBar style="dark" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const stile = StyleSheet.create({
  flaeche: {
    flex: 1,
    backgroundColor: farben.hintergrund,
  },
  mitte: {
    flex: 1,
    backgroundColor: farben.hintergrund,
    alignItems: 'center',
    justifyContent: 'center',
    gap: abstand.mittel,
  },
  ladetext: {
    ...schrift.mittel,
    color: farben.akzent,
    fontWeight: '700',
  },
});
