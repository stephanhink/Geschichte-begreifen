// Abschnitt 4: „Dein Urteil" — die eigene Meinung, kein Richtig oder Falsch.
//
// Die Antwort bleibt auf dem Gerät (CLAUDE.md: keine Accounts, kein
// Netzwerk). Gesichert wird beim Antippen von „Urteil sichern", beim
// Verlassen des Feldes und beim Verlassen des Abschnitts — damit nichts
// verlorengeht, ohne dass jemand ans Speichern denken muss.
//
// Das eigentliche Schreiben macht utils/fortschritt.js; hier kommt nur der
// Text zurück (Architektur-Regel).

import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import Knopf from '../Knopf';
import { abstand, farben, radius, schrift } from '../design';

/**
 * @param {{thema: object, urteil: string, onSpeichern: Function}} props
 */
export default function UrteilAbschnitt({ thema, urteil, onSpeichern }) {
  const [text, setText] = useState(urteil || '');
  const [gesichert, setGesichert] = useState(Boolean(urteil));

  // Refs, damit das Sichern beim Verlassen immer den neuesten Stand sieht.
  const aktuellRef = useRef(urteil || '');
  const geschriebenRef = useRef(urteil || '');
  const speichernRef = useRef(onSpeichern);
  speichernRef.current = onSpeichern;

  const sichere = () => {
    if (aktuellRef.current !== geschriebenRef.current) {
      geschriebenRef.current = aktuellRef.current;
      speichernRef.current(aktuellRef.current);
    }
    setGesichert(true);
  };

  // Beim Verlassen des Abschnitts: ungesicherte Änderungen mitnehmen.
  useEffect(
    () => () => {
      if (aktuellRef.current !== geschriebenRef.current) {
        speichernRef.current(aktuellRef.current);
      }
    },
    [],
  );

  const aendere = (neu) => {
    setText(neu);
    aktuellRef.current = neu;
    if (gesichert) setGesichert(false);
  };

  const hatText = text.trim().length > 0;

  return (
    <View>
      <Text style={stile.marke}>Dein Urteil</Text>
      <Text style={stile.frage}>{thema.urteil.frage}</Text>

      {thema.urteil.hinweis ? (
        <View style={stile.hinweisBlock}>
          <Text style={stile.hinweisTitel}>Denkanstoß</Text>
          <Text style={stile.hinweisText}>{thema.urteil.hinweis}</Text>
        </View>
      ) : null}

      <TextInput
        style={stile.feld}
        value={text}
        onChangeText={aendere}
        onBlur={sichere}
        multiline
        textAlignVertical="top"
        placeholder="Schreib hier deine Sicht auf …"
        placeholderTextColor={farben.textLeise}
        accessibilityLabel="Dein Urteil"
      />

      <View style={stile.zeile}>
        <Text style={stile.stand}>
          {gesichert && hatText
            ? 'Gesichert — nur auf diesem Gerät.'
            : hatText
              ? 'Noch nicht gesichert.'
              : 'Es gibt kein Richtig und kein Falsch.'}
        </Text>
        <Knopf
          titel={gesichert && hatText ? 'Gesichert ✓' : 'Urteil sichern'}
          onPress={sichere}
          deaktiviert={gesichert || !hatText}
        />
      </View>

      <Text style={stile.fussnote}>
        Deine Antwort verlässt dieses Gerät nicht: kein Konto, keine Übertragung, keine Bewertung.
        Du kannst sie jederzeit ändern — auch dann, wenn du das Thema später noch einmal anders
        siehst.
      </Text>
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
    ...schrift.mittel,
    color: farben.akzent,
    fontWeight: '700',
    marginBottom: abstand.mittel,
  },
  hinweisBlock: {
    backgroundColor: farben.flaecheGedaempft,
    borderRadius: radius.mittel,
    padding: abstand.mittel,
    marginBottom: abstand.gross,
  },
  hinweisTitel: {
    ...schrift.winzig,
    color: farben.akzentHell,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  hinweisText: {
    ...schrift.klein,
    color: farben.text,
  },
  feld: {
    ...schrift.fliess,
    minHeight: 160,
    color: farben.text,
    backgroundColor: farben.flaeche,
    borderWidth: 1.5,
    borderColor: farben.rand,
    borderRadius: radius.mittel,
    padding: abstand.mittel,
  },
  zeile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: abstand.mittel,
    marginTop: abstand.mittel,
  },
  stand: {
    ...schrift.winzig,
    flex: 1,
    color: farben.textLeise,
  },
  fussnote: {
    ...schrift.winzig,
    color: farben.textLeise,
    marginTop: abstand.gross,
  },
});
