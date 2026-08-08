// Start-Screen: die Themenlandkarte als Karten.
//
// Dünn nach der Architektur-Regel: Die Einträge kommen fertig aus App.js
// (utils/themen + utils/fortschritt), hier wird nur angezeigt.

import { ScrollView, StyleSheet, Text, View } from 'react-native';

import Themenkarte from '../components/Themenkarte';
import { abstand, farben, radius, schrift } from '../components/design';

/**
 * @param {{eintraege: Array<object>, onOeffne: Function}} props
 */
export default function Themenuebersicht({ eintraege, onOeffne }) {
  const erforscht = eintraege.filter((e) => e.stufe === 'erforscht').length;

  return (
    <ScrollView
      style={stile.flaeche}
      contentContainerStyle={stile.inhalt}
      showsVerticalScrollIndicator={false}
    >
      <Text style={stile.appTitel}>Geschichte begreifen</Text>
      <Text style={stile.leitsatz}>Der Sieger schreibt die Geschichte.</Text>

      <View style={stile.merksatz}>
        <Text style={stile.merksatzText}>
          Niemand von uns war dabei. Zu jedem Thema stehen hier mehrere Sichtweisen nebeneinander —
          keine davon ist „die Wahrheit". Am Ende zählt dein eigenes Urteil.
        </Text>
      </View>

      <View style={stile.abschnittskopf}>
        <Text style={stile.abschnittstitel}>Themen</Text>
        <Text style={stile.zaehler}>
          {erforscht} von {eintraege.length} erforscht
        </Text>
      </View>

      {eintraege.map((eintrag) => (
        <Themenkarte key={eintrag.id} eintrag={eintrag} onOeffne={onOeffne} />
      ))}

      <Text style={stile.ausblick}>
        Weitere Themen entstehen nach und nach: Germanen und Völkerwanderung, die frühen
        Königreiche, das Mittelalter und der Blick in die Neuzeit.
      </Text>
    </ScrollView>
  );
}

const stile = StyleSheet.create({
  flaeche: {
    flex: 1,
  },
  inhalt: {
    paddingHorizontal: abstand.gross,
    paddingTop: abstand.mittel,
    paddingBottom: abstand.sehrGross,
  },
  appTitel: {
    ...schrift.riesig,
    color: farben.akzent,
    fontWeight: '800',
  },
  leitsatz: {
    ...schrift.mittel,
    color: farben.akzentHell,
    fontStyle: 'italic',
    marginTop: 2,
  },
  merksatz: {
    backgroundColor: farben.flaecheGedaempft,
    borderRadius: radius.mittel,
    padding: abstand.mittel,
    marginTop: abstand.mittel,
    borderLeftWidth: 4,
    borderLeftColor: farben.akzent,
  },
  merksatzText: {
    ...schrift.klein,
    color: farben.text,
  },
  abschnittskopf: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: abstand.sehrGross,
    marginBottom: abstand.mittel,
  },
  abschnittstitel: {
    ...schrift.mittel,
    color: farben.akzent,
    fontWeight: '700',
  },
  zaehler: {
    ...schrift.klein,
    color: farben.textLeise,
  },
  ausblick: {
    ...schrift.klein,
    color: farben.textLeise,
    marginTop: abstand.klein,
    textAlign: 'center',
  },
});
