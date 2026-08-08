// Abschnitt 2: „Geschichte in Bewegung" — die Karte ist die Bühne.
//
// Der Betreiber hat es klar gesagt: Die App war zu textlastig. Hier soll man
// die Entwicklung des Reiches SEHEN, nicht darüber lesen. Deshalb steht auf
// dem Bildschirm nur Karte, Phasen-Umschalter und ein Hinweis — die guten
// Texte warten hinter den anklickbaren Punkten und öffnen sich im Popup.
//
// Dünn nach der Architektur-Regel: Sämtliche Geometrie (Küstenlinien,
// Gebietsflächen, Koordinaten) kommt fertig aus utils/themen/karten/, die
// Pfeilspitzen und Pfade rechnet utils/karte-geo.js. Hier wird nur gezeichnet
// und auf Tippen reagiert.

import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';

import { KARTENFARBEN, pfeilspitze, zeichnePfad } from '../../utils/karte-geo';
import { abstand, farben, kartenschatten, radius, schrift } from '../design';

/** Wie lange eine Phase beim Abspielen stehen bleibt (Millisekunden). */
const ABSPIELDAUER = 1800;

/** Schriftgrößen in SVG-Einheiten (die ViewBox ist 700 breit). */
const KARTENSCHRIFT = { land: 20, meer: 19, ort: 18 };

/**
 * Der Pfad einer Bewegung: von → über → nach, weich gerundet.
 *
 * @param {{von: number[], ueber?: number[][], nach: number[]}} bewegung
 * @returns {{linie: string, spitze: string}} `d` der Linie, Punkte der Spitze
 */
function bewegungsPfad(bewegung) {
  const punkte = [bewegung.von, ...(bewegung.ueber || []), bewegung.nach];
  const linie = zeichnePfad(punkte, { geschlossen: false, rund: true });
  const spitze = pfeilspitze(punkte[punkte.length - 2], bewegung.nach)
    .map(([x, y]) => `${x},${y}`)
    .join(' ');
  return { linie, spitze };
}

/**
 * Das Zeichen eines Info-Punktes — je nach Art ein anderes.
 *
 * Städte sind Kreise, Ereignisse Dreiecke, Grenzen Quadrate. So sieht man
 * ohne Legende, dass da Verschiedenes liegt.
 */
function PunktZeichen({ punkt }) {
  const gemeinsam = {
    fill: KARTENFARBEN.punkt,
    stroke: KARTENFARBEN.punktRand,
    strokeWidth: 2,
  };
  if (punkt.typ === 'ereignis') {
    const r = 7;
    const ecken = [
      [punkt.x, punkt.y - r],
      [punkt.x + r, punkt.y + r * 0.7],
      [punkt.x - r, punkt.y + r * 0.7],
    ]
      .map(([x, y]) => `${x},${y}`)
      .join(' ');
    return <Polygon points={ecken} {...gemeinsam} />;
  }
  if (punkt.typ === 'grenze') {
    const r = 5.5;
    return <Rect x={punkt.x - r} y={punkt.y - r} width={r * 2} height={r * 2} {...gemeinsam} />;
  }
  return <Circle cx={punkt.x} cy={punkt.y} r={6} {...gemeinsam} />;
}

/**
 * @param {{karte: object}} props
 */
export default function KarteAbschnitt({ karte }) {
  const [phase, setPhase] = useState(0);
  const [laeuft, setLaeuft] = useState(false);
  // Was gerade im Popup steht — ein Punkt oder eine Bewegung, beides hat
  // `name` und `text`. `null` heißt: Popup zu.
  const [offen, setOffen] = useState(null);
  const uhr = useRef(null);

  const letztePhase = karte.phasen.length - 1;
  const aktuell = karte.phasen[phase];
  const bewegungen = karte.bewegungen || [];
  // Die Wanderungen gehören ans Ende der Geschichte — vorher wären sie nur
  // Striche ohne Anlass.
  const zeigeBewegungen = phase === letztePhase && bewegungen.length > 0;

  // Abspielen: die Phasen der Reihe nach durchschalten und am Ende stehen
  // bleiben. Ein Intervall statt Animated — hier bewegt sich nichts weich,
  // hier springt es von Epoche zu Epoche.
  useEffect(() => {
    if (!laeuft) return undefined;
    uhr.current = setInterval(() => {
      setPhase((vorher) => {
        if (vorher >= letztePhase) {
          setLaeuft(false);
          return vorher;
        }
        return vorher + 1;
      });
    }, ABSPIELDAUER);
    return () => clearInterval(uhr.current);
  }, [laeuft, letztePhase]);

  const waehlePhase = (i) => {
    setLaeuft(false);
    setPhase(i);
  };

  const abspielen = () => {
    if (laeuft) {
      setLaeuft(false);
      return;
    }
    // Vom Ende aus neu beginnen, sonst passiert beim Tippen nichts.
    if (phase >= letztePhase) setPhase(0);
    setLaeuft(true);
  };

  return (
    <View>
      <Text style={stile.marke}>Geschichte in Bewegung</Text>
      <Text style={stile.titel}>{aktuell.label}</Text>
      {aktuell.hinweis ? <Text style={stile.hinweis}>{aktuell.hinweis}</Text> : null}

      {/* --- Die Karte ---------------------------------------------------- */}
      <View style={[stile.buehne, { aspectRatio: karte.breite / karte.hoehe }]}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${karte.breite} ${karte.hoehe}`}>
          {/* Untergrund: Meer, Landmassen, Flüsse */}
          {karte.basis.map((teil, i) => (
            <Path
              key={`basis-${i}`}
              d={teil.d}
              fill={teil.fill}
              stroke={teil.stroke}
              strokeWidth={teil.strokeWidth}
              strokeLinejoin="round"
            />
          ))}

          {/* Das Reich in der gewählten Phase */}
          {aktuell.flaechen.map((flaeche, i) => (
            <Path
              key={`${aktuell.id}-${i}`}
              d={flaeche.d}
              fill={KARTENFARBEN.reich}
              fillOpacity={0.72}
              stroke={KARTENFARBEN.reichRand}
              strokeWidth={1.6}
              strokeLinejoin="round"
            />
          ))}

          {/* Landschafts- und Meeresnamen */}
          {(karte.beschriftungen || []).map((beschriftung, i) => (
            <SvgText
              key={`schrift-${i}`}
              x={beschriftung.x}
              y={beschriftung.y}
              fill={
                beschriftung.art === 'meer'
                  ? KARTENFARBEN.schriftWasser
                  : KARTENFARBEN.schriftLand
              }
              fontSize={beschriftung.art === 'meer' ? KARTENSCHRIFT.meer : KARTENSCHRIFT.land}
              fontStyle={beschriftung.art === 'meer' ? 'italic' : 'normal'}
              textAnchor="middle"
              transform={
                beschriftung.drehung
                  ? `rotate(${beschriftung.drehung} ${beschriftung.x} ${beschriftung.y})`
                  : undefined
              }
            >
              {beschriftung.text}
            </SvgText>
          ))}

          {/* Wanderungsrouten — erst am Ende der Geschichte */}
          {zeigeBewegungen
            ? bewegungen.map((bewegung, i) => {
                const { linie, spitze } = bewegungsPfad(bewegung);
                const farbe = KARTENFARBEN.bewegung[i % KARTENFARBEN.bewegung.length];
                return (
                  <G key={bewegung.id} onPress={() => setOffen(bewegung)}>
                    <Path
                      d={linie}
                      fill="none"
                      stroke={farbe}
                      strokeWidth={4}
                      strokeDasharray="12 8"
                      strokeLinecap="round"
                    />
                    <Polygon points={spitze} fill={farbe} />
                    {/* Breiter, unsichtbarer Streifen zum Antippen */}
                    <Path d={linie} fill="none" stroke="#000" strokeOpacity={0.001} strokeWidth={26} />
                  </G>
                );
              })
            : null}

          {/* Die anklickbaren Info-Punkte — hier liegt das Hintergrundwissen */}
          {karte.punkte.map((punkt) => (
            <G key={punkt.id} onPress={() => setOffen(punkt)}>
              <PunktZeichen punkt={punkt} />
              <SvgText
                x={punkt.x + 11}
                y={punkt.y + 6}
                fill={KARTENFARBEN.punkt}
                fontSize={KARTENSCHRIFT.ort}
                fontWeight="bold"
                stroke={KARTENFARBEN.punktRand}
                strokeWidth={3.5}
                // Weißer Rand hinter der Schrift, damit Ortsnamen auch über
                // dem Reichsgebiet lesbar bleiben.
                paintOrder="stroke"
              >
                {punkt.name}
              </SvgText>
              {/* Großzügige Trefferfläche — Finger sind größer als Punkte */}
              <Circle cx={punkt.x} cy={punkt.y} r={22} fill="#000" fillOpacity={0.001} />
            </G>
          ))}
        </Svg>
      </View>

      <Text style={stile.tippHinweis}>
        Tippe auf die Punkte auf der Karte — dahinter steckt die Geschichte.
      </Text>

      {/* --- Phasen-Umschalter -------------------------------------------- */}
      <View style={stile.umschalter}>
        {karte.phasen.map((p, i) => {
          const aktiv = i === phase;
          return (
            <Pressable
              key={p.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: aktiv }}
              accessibilityLabel={`Karte im Jahr ${p.label}`}
              onPress={() => waehlePhase(i)}
              style={({ pressed }) => [
                stile.chip,
                aktiv && stile.chipAktiv,
                pressed && stile.gedrueckt,
              ]}
            >
              <Text style={[stile.chipText, aktiv && stile.chipTextAktiv]} numberOfLines={1}>
                {p.label}
              </Text>
            </Pressable>
          );
        })}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={laeuft ? 'Abspielen anhalten' : 'Phasen abspielen'}
          onPress={abspielen}
          style={({ pressed }) => [stile.chip, stile.chipSpiel, pressed && stile.gedrueckt]}
        >
          <Text style={[stile.chipText, stile.chipSpielText]}>{laeuft ? '⏸ Halt' : '▶ Ablauf'}</Text>
        </Pressable>
      </View>

      {/* --- Legende der Wanderungen -------------------------------------- */}
      {zeigeBewegungen ? (
        <View style={stile.legende}>
          <Text style={stile.legendeTitel}>Wer von wo kam</Text>
          <View style={stile.legendeReihe}>
            {bewegungen.map((bewegung, i) => {
              const farbe = KARTENFARBEN.bewegung[i % KARTENFARBEN.bewegung.length];
              return (
                <Pressable
                  key={bewegung.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Mehr über die ${bewegung.name}`}
                  onPress={() => setOffen(bewegung)}
                  style={({ pressed }) => [stile.legendeEintrag, pressed && stile.gedrueckt]}
                >
                  <View style={[stile.legendeStrich, { backgroundColor: farbe }]} />
                  <Text style={stile.legendeText}>{bewegung.name}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}

      {/* --- Das Popup mit dem Hintergrundwissen -------------------------- */}
      <Modal
        visible={offen !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setOffen(null)}
      >
        <Pressable style={stile.schleier} onPress={() => setOffen(null)}>
          {/* Tippen im Blatt schließt nicht — nur daneben. */}
          <Pressable style={stile.blatt} onPress={() => {}}>
            <Text style={stile.blattName}>{offen ? offen.name : ''}</Text>
            <ScrollView style={stile.blattRolle} showsVerticalScrollIndicator={false}>
              <Text style={stile.blattText}>{offen ? offen.text : ''}</Text>
            </ScrollView>
            <Pressable
              accessibilityRole="button"
              onPress={() => setOffen(null)}
              style={({ pressed }) => [stile.schliessen, pressed && stile.gedrueckt]}
            >
              <Text style={stile.schliessenText}>Schließen</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
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
  titel: {
    ...schrift.gross,
    color: farben.akzent,
    fontWeight: '800',
  },
  hinweis: {
    ...schrift.klein,
    color: farben.textLeise,
    marginTop: 6,
    marginBottom: abstand.mittel,
  },
  buehne: {
    width: '100%',
    backgroundColor: KARTENFARBEN.meer,
    borderRadius: radius.mittel,
    borderWidth: 1,
    borderColor: farben.rand,
    overflow: 'hidden',
    ...kartenschatten,
  },
  tippHinweis: {
    ...schrift.winzig,
    color: farben.textLeise,
    textAlign: 'center',
    marginTop: abstand.klein,
  },
  umschalter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: abstand.klein,
    marginTop: abstand.mittel,
  },
  chip: {
    paddingVertical: abstand.klein,
    paddingHorizontal: abstand.mittel,
    borderRadius: radius.rund,
    borderWidth: 1.5,
    borderColor: farben.akzentZart,
    backgroundColor: farben.flaeche,
  },
  chipAktiv: {
    backgroundColor: farben.akzent,
    borderColor: farben.akzent,
  },
  chipText: {
    ...schrift.klein,
    color: farben.akzent,
    fontWeight: '700',
  },
  chipTextAktiv: {
    color: '#FFFFFF',
  },
  chipSpiel: {
    borderColor: farben.akzentHell,
    borderStyle: 'dashed',
  },
  chipSpielText: {
    color: farben.akzentHell,
  },
  gedrueckt: {
    opacity: 0.7,
  },
  legende: {
    marginTop: abstand.mittel,
    padding: abstand.mittel,
    backgroundColor: farben.flaecheGedaempft,
    borderRadius: radius.klein,
  },
  legendeTitel: {
    ...schrift.winzig,
    color: farben.textLeise,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: abstand.klein,
  },
  legendeReihe: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: abstand.mittel,
  },
  legendeEintrag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendeStrich: {
    width: 22,
    height: 4,
    borderRadius: 2,
  },
  legendeText: {
    ...schrift.klein,
    color: farben.text,
    fontWeight: '600',
  },
  schleier: {
    flex: 1,
    backgroundColor: 'rgba(58, 43, 27, 0.45)',
    justifyContent: 'center',
    padding: abstand.gross,
  },
  blatt: {
    backgroundColor: farben.hintergrund,
    borderRadius: radius.gross,
    padding: abstand.gross,
    maxHeight: '75%',
    ...kartenschatten,
  },
  blattName: {
    ...schrift.gross,
    color: farben.akzent,
    fontWeight: '800',
    marginBottom: abstand.klein,
  },
  blattRolle: {
    flexGrow: 0,
  },
  blattText: {
    ...schrift.fliess,
    color: farben.text,
  },
  schliessen: {
    alignSelf: 'flex-end',
    marginTop: abstand.mittel,
    paddingVertical: abstand.klein,
    paddingHorizontal: abstand.mittel,
    borderRadius: radius.rund,
    backgroundColor: farben.akzent,
  },
  schliessenText: {
    ...schrift.klein,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
