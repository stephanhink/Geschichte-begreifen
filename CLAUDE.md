# Geschichte begreifen — Projektregeln

Dieses Dokument ist die verbindliche Projekt-DNA. Es wächst mit dem Projekt
und wird vor jeder Arbeit von Claude Code gelesen. Stand: 2026-08-08
(Inhaltsspezifikation V1 durch den Betreiber).

## Ziel und Zielgruppe

Die App „Geschichte begreifen" macht Geschichte für Schülerinnen und Schüler
**von Klasse 5 bis Klasse 13 (bis Abitur)** interaktiv begreifbar — dieselbe
Zielgruppe wie beim Schwesterprojekt „Mathe begreifen". Aber bewusst anders
im Ton: **kein Schulstress, kein Daten-Auswendiglernen.** Geschichte soll
spannend sein und zeigen, wie sie die Welt verändert hat.

## Leitidee: Der Sieger schreibt die Geschichte

Das Herzstück der App ist **Multiperspektivität**: Geschichte wird je nach
Standpunkt unterschiedlich erzählt und interpretiert. „Der Sieger schreibt
die Geschichte" — und niemand war wirklich dabei. Deshalb gilt:

- **Kein Thema wird als eine einzige Wahrheit erzählt.** Zu jedem Thema gibt
  es mehrere klar gekennzeichnete Perspektiven (z. B. „Europäische
  Sichtweise", „Chinesische Sichtweise", „Persische Sichtweise").
- Jede Perspektive ist als solche markiert — sie ist eine Erzählung, keine
  objektive Wahrheit. Die App sagt nie „so war es", sondern „so wird es aus
  dieser Sicht erzählt".
- Eine **Synthese** führt die Perspektiven zusammen: Wo stimmen sie überein,
  wo widersprechen sie sich, und warum könnte das sein?
- Am Ende steht **„Dein Urteil"**: Die Schülerin/der Schüler bildet sich
  ihre/seine eigene Meinung. Es gibt kein Richtig oder Falsch — nur die
  eigene, begründete Sicht.

### Perspektiven-Workflow (wer schreibt welche Stimme)

Die Perspektiven werden von unterschiedlichen Stimmen verfasst und in der App
gekennzeichnet:

- **Opus (Claude Code)** verfasst die westliche/europäische Sichtweise.
- **Hermes** verfasst die chinesische (bzw. östliche) Sichtweise.
- Beide Stimmen fließen in eine **Synthese** (gemeinsam erarbeitet), die
  Übereinstimmungen und Widersprüche sichtbar macht, ohne zu werten.
- Im Repo ist pro Perspektive festgehalten, welche Stimme sie geschrieben
  hat (Attribution im Themen-Modul, nicht in der App-Oberfläche).

## Themenlandkarte

**Version 1 — Einstieg über Europa, aber nicht nur Europa.** Die Reihenfolge
hier ist zugleich die Reihenfolge in der App (`utils/themen/index.js`):

1. **Das Römische Reich** — Aufstieg und Ausdehnung, wie es funktionierte
   (Macht, Straßen, Recht), wie es fiel. *(fertig)*
2. **China: Vom ersten Kaiser zu den großen Dynastien** — Qin, Han, Tang;
   die Seidenstraße als Faden zwischen den beiden größten Reichen der
   Antike. Steht bewusst direkt hinter Rom: Dieselbe Zeit, die andere
   Seite. *(fertig)*
3. **Dschingis Khan und die Mongolen** — das größte zusammenhängende
   Landreich der Geschichte, vom Kurultai 1206 bis zum Ende der Yuan 1368.
   Folgt auf China, weil die Mongolen genau dessen Faden aufnehmen: Sie
   machen aus der Seidenstraße erstmals einen Weg innerhalb eines einzigen
   Reiches — und regieren am Ende China selbst.
   *(europäische Sicht fertig, chinesische offen)*
4. **Japan** — Entstehung, Machthaber, Ausdehnung.
5. **Germanen und Völkerwanderung** — Ausbreitung der Germanen in Europa,
   was mit Rom danach geschah.
6. **Die frühen Königreiche** — wie sie entstanden, welche Macht sie hatten.
7. **Mittelalter** — Ordnung, Glaube, Handel; das Scharnier zur Neuzeit.
8. **Ausblick Neuzeit** — die großen Umbrüche, als Brücke zu den nächsten
   Modulen.

**Spätere Module (Landkarte, noch ohne Termin):** Persien als großes Reich,
das Osmanische Reich und der Mittlere Osten, Indonesien.

## Lernformat (Betreiber-Vorschlag, wächst mit den Runden)

Kein Zeitdruck, keine Noten — **Erforschen statt Pauken**. Jedes Thema
(Kapitel) folgt demselben Muster:

1. **Aufhänger** — eine spannende Frage statt Datenwüste (z. B. „Ein Reich,
   das halb Europa umspannte — wie hält man das zusammen?").
2. **Geschichte in Bewegung** — interaktive Grafiken (Karten mit
   Expansion/Verschiebungen, Zeitleisten) — hier kommt `react-native-svg`
   zum Einsatz. **Die Karte ist die Bühne, nicht die Illustration:** Man
   soll die Entwicklung der Reiche *sehen* statt über sie zu lesen. Die
   guten Texte stehen deshalb hinter anklickbaren Info-Punkten, nicht auf
   dem Bildschirm. Und die Karte muss die Regionen erkennen lassen —
   Italien als Stiefel, Iberische Halbinsel, Britannien, Nordafrika,
   Mittelmeer, Schwarzes Meer sofort erkennbar. Klare, moderne
   Schulatlaskarte, auf das Nötige reduziert; keine abstrakte Skizze.
   Der Abschnitt ist optional: Themen ohne `karte` überspringen ihn.
3. **Zwei Blickwinkel** — die Perspektiven nebeneinander (Kern der App).
4. **Synthese** — Übereinstimmungen und Widersprüche.
5. **Dein Urteil** — offene Frage; die eigene Antwort wird auf dem Gerät
   gespeichert (kein Richtig/Falsch).
6. **Nebenbei: „Stimmt's?"** — lockere Quizfragen ohne Zeitdruck.

Der Lernfortschritt („erforscht/entdeckt") wird lokal gespeichert —
keine Accounts, kein Netzwerk.

## Tech-Stack (bewusste Entscheidungen)

- **Expo SDK 57 / React Native / JavaScript** — wie „Mathe begreifen". Kein
  TypeScript: niedrigere Einstiegshürde, gleiche Codebasis-Pflege.
- **Fachlogik in `utils/` ohne UI** — mit blankem `node` prüfbar
  (Architektur-Regel, siehe unten).
- **Lokaler State via `@react-native-async-storage/async-storage`** —
  Lernfortschritt und „Dein Urteil" bleiben auf dem Gerät, keine Accounts,
  kein Netzwerk (datenschutzfreundlich; die Datenschutzerklärung in `docs/`
  lebt davon).
- **EAS Build remote-Credentials** (`credentialsSource: "remote"`): Keystore
  liegt bei EAS (@heilpraktikerdk/geschichte), Backup lokal unter
  `~/Documents/GitHub/@heilpraktikerdk__geschichte-keystore-backup/` und in
  `credentials/` (beides gitignored).

## Architektur-Regel

**Fachlogik und Inhalte gehören in `utils/` — ohne UI-Importe, mit blankem
`node` prüfbar.** React-Komponenten (`components/`, `screens/`) bleiben dünn:
sie holen Daten aus den utils, stellen sie dar und reichen Eingaben zurück.

Die **Themeninhalte** liegen als strukturierte Daten in `utils/themen/`
(ein Modul pro Thema: Aufhänger, Karte, Perspektiven mit Attribution,
Synthese, Urteils-Fragen, Quiz). Die Texte sind damit menschenlesbar (der
Betreiber liest sie im Repo gegen) und testbar — getrennt von der UI.

Die **Karten** liegen daneben in `utils/themen/karten/` (eine Datei je
Thema): Sie sind lang und von anderer Art — Geometrie statt Erzählung.
**Küstenlinien stehen dort als echte Längen-/Breitengrade** (`[lon, lat]`),
nicht als geratene Pixel; `utils/karte-geo.js` rechnet sie in
SVG-Koordinaten um (Projektion, Pfadglättung, Pfeilspitzen, Kartenpalette).
Damit ist die Geografie im Repo nachschlagbar — und je Karte prüft eine
Testdatei gegen den Atlas nach, ob bekannte Kaps und Meerengen auf der
gezeichneten Küste liegen (`tests/karte.mjs` für Rom, `tests/karte-china.mjs`
für China, `tests/karte-dschingis.mjs` für die Mongolen; die beiden letzteren
nehmen bewusst Koordinaten, die NICHT als Eckpunkte im Kartenmodul stehen,
damit die gezeichnete Linie geprüft wird und nicht die abgeschriebene Zahl —
dazu Kontrollpunkte im Binnenland, die gerade NICHT auf einer Küste liegen
dürfen, sonst wäre die Probe durch bloße Punktdichte immer erfüllt).

Daneben liegt in `utils/` die übrige Fachlogik, jeweils ohne UI-Import:
`markdown.js` (zerlegt die Themen-Texte in Absätze, Überschriften,
Aufzählungen), `quiz.js` (Auswertung von „Stimmt's?"), `fortschritt.js`
(Lernstand und „Dein Urteil"; der Speicher wird übergeben, damit der Test
ein Fake einsetzen kann) und `lernformat.js` (Reihenfolge der Abschnitte).

`tests/architektur.mjs` prüft diese Regel nach: keine UI-Importe in `utils/`
und `tests/`, jede utils-Datei mit blankem `node` ladbar, alle Importpfade
und benannten Importe auflösbar, keine neuen npm-Pakete.

### Aufbau der Oberfläche

Navigation **ohne zusätzliches Paket** (wie bei „Mathe begreifen"):
`App.js` hält den Fortschritt und entscheidet über einen State, ob die
Themenübersicht oder ein Kapitel sichtbar ist.

- `screens/Themenuebersicht.js` — die Themenlandkarte als Karten
  (Titel, Epoche, Aufhänger-Frage, Zahl der Blickwinkel, Fortschritt).
- `screens/Kapitel.js` — blättert durch die Abschnitte des Lernformats;
  jeder Abschnitt ist eine eigene Ansicht, kein endloser Scroll.
- `components/abschnitte/` — eine Komponente je Abschnitt.
- `components/design.js` — Farben, Abstände, Schriftgrößen an einer Stelle
  (Bernstein auf warmem Papier, `#FFF8ED` / `#7C4A03`).

`node tools/syntaxpruefung.mjs` prüft alle `.js`-Dateien auf Syntaxfehler
(nutzt den Babel-Parser aus `node_modules`, deshalb nicht in `npm test`).

## Prüf-Regel

**`npm test` ist der Torwächter.** Eine Änderung an der Fachlogik ohne
bestandene Prüfung gehört nicht ins Repo. Der Prüfrahmen lädt nur Dateien,
die in `tests/alle.mjs` registriert sind — neue Testdateien MÜSSEN dort
eingetragen werden, sonst zählen sie nicht.

## Git- und Build-Regeln

- **Git-Operationen (commit/push) und Builds (`eas build`) laufen nur mit
  Freigabe des Betreibers.** Code-Änderungen + `npm test` laufen autonom.
- Commit-Messages auf Deutsch, prägnant, im Stil der Repo-Historie.
- `git status` ist der erste Schritt jeder Arbeit (siehe Zwei-Bediener).

### Zwei Bediener — eine Instanz zur Zeit
An diesem Projekt arbeiten zwei Bediener: der Betreiber direkt in Claude Code
(interaktiv im Terminal) und Hermes, das Claude Code im Print-Modus
orchestriert. Es ist dieselbe App, aber getrennte Sessions — und sie sehen
einander nicht. Deshalb gelten vier Regeln:

1. **Es arbeitet immer nur eine Instanz zur Zeit.** Wer eine Runde beginnt,
   kündigt sie an: Der Betreiber sagt es Hermes, Hermes kündigt Runden an.
   Niemand startet parallel zur Arbeit des anderen.
2. **`git status` ist der erste Schritt jeder Arbeit.** Uncommittete
   Änderungen stammen vom jeweils anderen Bediener — erst klären, wessen sie
   sind, dann übernehmen. Fremde uncommittete Änderungen werden nie
   überschrieben.
3. **`.claude/wip.md` (gitignored) hält fest, wer gerade woran arbeitet.**
   Vor dem Start lesen, nach Abschluss aktualisieren. Der Stand darin ist
   lokal und flüchtig — verbindlich ist der letzte Commit.
4. **`--continue` setzt die zuletzt gestartete Session im Verzeichnis fort.**
   Nur die eigene Session fortsetzen, nie die des anderen Bedieners.

## Live-Testen

Expo Go auf dem Handy braucht die zu SDK 57 passende Version — die Version
aus dem Play Store hinkt den SDKs hinterher (siehe AGENTS.md). Zum Testen
`npm start` (Metro) und den QR-Code mit Expo Go scannen.

## Status

Stand: 2026-08-09 — Runde 5 abgeschlossen (Modul „Dschingis Khan"):
- Projekt-Setup: Expo-SDK-57-Grundgerüst, EAS-Projekt
  @heilpraktikerdk/geschichte + Android-Keystore (remote + lokales Backup),
  Platzhalter-Assets, GitHub-Repo public
  (https://github.com/stephanhink/Geschichte-begreifen, Pages-Workflow aktiv,
  docs/ mit Datenschutz-Platzhalter)
- Runde 1: Themen-Schema (`utils/themen/`), Modul „Römisches Reich" mit
  europäischer (Opus) und chinesischer (Hermes) Sichtweise samt Synthese
- Runde 2: die App-Oberfläche — Themenübersicht und Kapitel-Ansicht mit
  allen fünf Abschnitten des Lernformats, Fortschritt und „Dein Urteil"
  lokal über async-storage, eigene State-Navigation, keine neuen Pakete
- Runde 3: „Geschichte in Bewegung" — der sechste Abschnitt, zwischen
  Aufhänger und Blickwinkeln. Neu dazugekommen sind
  `utils/karte-geo.js` (Projektion aus echten Koordinaten, Pfadglättung,
  Pfeilspitzen, Kartenpalette), `utils/themen/karten/roemisches-reich.js`
  (Atlas-Küstenlinien vom Atlantik bis Mesopotamien, vier Phasen von
  264 v. Chr. bis 476 n. Chr., sechs Info-Punkte, drei Wanderungsrouten),
  das Feld `karte` im Themen-Schema samt vollständiger Prüfung und
  `components/abschnitte/KarteAbschnitt.js` (SVG-Karte, Phasen-Umschalter
  mit Ablauf-Knopf, antippbare Punkte mit Popup, Legende der Wanderungen)
- Runde 4: das zweite Thema — „China: Vom ersten Kaiser zu den großen
  Dynastien" (`utils/themen/china.js`, registriert als Modul 2). Erst die
  europäische Sichtweise (Stimme: Opus): Serica, die Qin-Einigung, die Han
  und Zhang Qian, die Tang und Chang'an, und zum Schluss die Frage, warum
  Europa das kaum erzählt. Hermes hat die chinesische Sichtweise ergänzt;
  die Synthese führt inzwischen beide Stimmen zusammen — das Thema ist
  fertig. Dazu `utils/themen/karten/china.js` (Ausschnitt 58–145° O,
  14–55° N — weit genug nach Westen für die ganze Seidenstraße; Küsten
  Chinas, Koreas, Japans und Indiens als Atlas-Koordinaten, Große Mauer und
  Seidenstraße als feste Linien, Wüsten Gobi und Taklamakan, drei Phasen
  221 v. Chr. / 100 n. Chr. / 750 n. Chr., sechs Info-Punkte, drei
  Bewegungen) und `tests/karte-china.mjs`. Neu in der Kartenpalette:
  `wueste`, `mauer`, `route`.
- Runde 5: das dritte Thema — „Dschingis Khan und die Mongolen"
  (`utils/themen/dschingis-khan.js`, registriert als Modul 3). Vorerst nur
  die europäische Sichtweise (Stimme: Opus): 1241 der „Gotteszorn" vor
  Liegnitz, die Rettung durch einen Todesfall (und was diese Erzählung
  verschweigt), die Pax Mongolica, Marco Polo und das Staunen, das keiner
  glaubte, und zum Schluss die zwei Bilder — Zerstörer und Wegbereiter. Die
  Synthese ist ausdrücklich vorläufig und benennt selbst, dass die
  chinesische Stimme zur Yuan-Zeit noch fehlt.
  Dazu `utils/themen/karten/dschingis-khan.js` — der bisher größte
  Ausschnitt (8–143° O, 20–58° N, 700 × 253,5): Liegnitz und Dadu passen
  nur so auf ein Bild, und genau das ist die Aussage. Küsten vom Mittelmeer
  bis Japan als Atlas-Koordinaten, Kaspisches Meer / Aralsee / Ostsee /
  Rotes Meer als eigene Wasserflächen, vierzehn Flüsse, Große Mauer und die
  Seidenstraße bis ans Schwarze Meer, vier Phasen (1206 Kurultai / 1227 Tod
  Dschingis Khans / 1259 Höhepunkt mit Großkhanat, Goldener Horde und
  Ilchanat / 1294 Yuan und Teilreiche), sechs Info-Punkte (Karakorum, Dadu,
  Samarkand, Bagdad, Liegnitz, Kaffa) und vier Feldzüge. Dazu
  `tests/karte-dschingis.mjs`. Neu in der Kartenpalette: eine vierte
  Bewegungsfarbe — bei drei hätten zwei Feldzüge dieselbe bekommen.
- `npm test` grün (647 Prüfungen)

Nächste Schritte (Landkarte, noch offen):
- **Die chinesische Sichtweise zu „Dschingis Khan" (Hermes)** — die
  Yuan-Zeit von innen: War Kublai rechtmäßiger Kaiser oder Besatzer? Danach
  die Synthese gemeinsam neu schreiben; der Platzhaltertext in
  `utils/themen/dschingis-khan.js` sagt das auch in der App offen.
- **Am Gerät gegenlesen:** Alle drei Karten sind rechnerisch gegen den
  Atlas geprüft, aber noch nicht auf einem Handy gesehen. Vor allem
  Schriftgrößen und Trefferflächen der Punkte gehören auf einem kleinen
  Bildschirm beurteilt (`npm start`, Expo Go). Die Mongolen-Karte ist mit
  700 × 253,5 das flachste, breiteste Bild der App (Rom 700 × 548, China
  700 × 400): fünfzehn Beschriftungen und sechs Ortsnamen auf einem
  schmalen Band — ob sich das überschneidet, entscheidet das Gerät.
- **Zeitleisten** — der zweite Teil von „Geschichte in Bewegung"; die
  Karten decken bisher nur den Raum ab, nicht die Zeit.
- **Weitere Themen** nach der Themenlandkarte: Japan, Germanen und
  Völkerwanderung, frühe Königreiche, Mittelalter, Ausblick Neuzeit —
  jeweils westliche Sicht von Opus, östliche von Hermes, Synthese
  gemeinsam. Karten sind dabei optional: Themen ohne `karte` überspringen
  den Abschnitt.
