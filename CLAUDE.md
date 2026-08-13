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

Bei Themen ohne West-Ost-Achse gilt dieselbe Aufteilung sinngemäß: Opus
schreibt die eine Stimme, Hermes die andere. Beim Modul „Israel und
Palästina" sind das die **israelisch-jüdische Sichtweise (Opus)** und die
**palästinensisch-arabische Sichtweise (Hermes)**. Beide sind ausdrücklich
gleichwertig — welche zuerst geschrieben wurde, ergibt sich nur daraus, wer
die Runde übernommen hat, und ist keine Wertung. Das steht auch so in der
App, damit niemand die Reihenfolge als Rangfolge liest.

**Zusatzregel für sensible Themen.** Wo Menschen heute von einem Konflikt
betroffen sind, reicht „zwei Perspektiven nebeneinander" nicht aus. Dort gilt
zusätzlich: Jede Perspektive muss die unbequemen Stellen der eigenen
Erzählung selbst benennen, statt sie der Gegenstimme zu überlassen; die
Beweggründe der anderen Seite werden fair wiedergegeben, auch innerhalb der
eigenen Perspektive; die Karte zeigt historische Zustände mit Jahreszahl und
bewertet nicht; und die Quizfragen bleiben Wissensfragen — nach Schuld oder
danach, wem ein Land gehört, fragt diese App nicht. `tests/` prüft diese
Zusagen nach, sie stehen nicht nur im Kommentar.

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
   Reiches — und regieren am Ende China selbst. *(fertig)*
4. **Japan — die Inselwelt zwischen Abschottung und Öffnung** — von der
   Yamato-Zeit bis zur Meiji-Restauration 1868. Schließt direkt an die
   Mongolen an: Japan ist der einzige Nachbar, den Kublai Khan nicht bekam;
   1274 und 1281 zerschlug beide Male ein Taifun seine Flotte. Danach ist
   das Meer nicht mehr Grenze, sondern Thema — es trennt und verbindet
   zugleich. *(fertig)*
5. **Israel und Palästina — ein Land, zwei Narrative** — von der Zerstörung
   des Zweiten Tempels 70 n. Chr. bis in die Gegenwart. Steht bewusst am
   Ende der bisherigen Reihe: Wer die vier Kapitel davor gelesen hat, hat
   viermal an leichteren Themen geübt, dass dieselben Ereignisse je nach
   Standpunkt anders klingen. Hier fällt das schwer, und hier ist die
   Multiperspektivität nicht Methode, sondern der Gegenstand selbst.
   *(fertig)*
6. **Germanen und Völkerwanderung** — Ausbreitung der Germanen in Europa,
   was mit Rom danach geschah. Schließt den Bogen zurück zum ersten Kapitel:
   dieselben Jahrhunderte wie „Das Römische Reich", nur von der Grenze aus
   statt aus der Mitte. Und es dreht die Leitidee der App einmal um — hier
   haben nicht die Sieger geschrieben, sondern die Verlierer: Das Reich, das
   unterging, hatte die Bibliotheken; die Gewinner hinterließen Gräber,
   Schmuck und Waffen, aber keine Chroniken.
   *(fertig)*
7. **Die frühen Königreiche — wie aus Eroberern Herrscher wurden** — von 476
   bis zur Kaiserkrönung Karls des Großen 800. Nimmt den Faden der Germanen
   genau dort auf, wo die Wanderung endet: Die Eroberer sitzen im Land und
   müssen es regieren. Hier dreht sich die Perspektiven-Achse zum ersten Mal
   von außen nach innen — es stehen sich nicht zwei Länder gegenüber, sondern
   oben und unten im selben Land: die Höfe und Chronisten, die schreiben
   ließen, gegen die Dörfer, in denen neun von zehn Menschen lebten.
   *(fertig)*
8. **Vom Mittelalter zur Neuzeit — die Geburtsstunde Europas** — von der
   Kaiserkrönung 800 bis zum Vorabend des Dreißigjährigen Krieges 1618.
   Zugleich das erste Kapitel des Neuzeit-Bogens (siehe unten). Es beginnt
   dort, wo das Kapitel davor endet, und die soziale Achse kippt: oben die
   alte Ordnung aus Kaiser, Papst und Adel, unten die Städte, aus denen die
   Neuzeit erwächst. Das Kapitel führt die Leitidee der App an einem einzigen
   Wort vor — „finsteres Mittelalter" ist kein Befund, sondern ein Urteil der
   Renaissance über eine Zeit, die sie selbst nicht erlebt hat.
   *(Sicht der alten Ordnung fertig, Stimme der Städte offen)*

**Der Neuzeit-Bogen** ist vom Betreiber ausbuchstabiert und steht in
`notizen/kapitel-planung.md`: neun Kapitel, beginnend mit „Vom Mittelalter zur
Neuzeit" (= Modul 8, seit Runde 10 angelegt), dann die Eroberung Amerikas, der
Dreißigjährige Krieg, die USA und die Vertreibung der Indianer, Revolution und
Napoleon, der Weg zum Ersten Weltkrieg (mit der Kriegsschuldfrage als
multiperspektivischem Herzstück und dem Abschnitt „Was 1914 uns heute lehrt")
bis zum Zweiten Weltkrieg und der neuen Weltordnung. Wer eines dieser Kapitel
beginnt, liest die Datei zuerst — sie enthält Vorgaben, die aus der
Themenlandkarte allein nicht hervorgehen. Der frühere Platzhalter „Ausblick
Neuzeit" ist damit erledigt: Der Bogen selbst ist der Ausblick.

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
für China, `tests/karte-dschingis.mjs` für die Mongolen, `tests/karte-japan.mjs`
für Japan, `tests/karte-israel-palaestina.mjs` für die Levante,
`tests/karte-germanen.mjs`, `tests/karte-koenigreiche.mjs` und
`tests/karte-mittelalter.mjs` für die drei Europakarten; alle außer der
ersten nehmen bewusst Koordinaten, die NICHT als Eckpunkte im Kartenmodul
stehen, damit die gezeichnete Linie geprüft wird und nicht die abgeschriebene
Zahl — dazu Kontrollpunkte im Binnenland bzw. auf offener See, die gerade
NICHT auf einer Küste liegen dürfen, sonst wäre die Probe durch bloße
Punktdichte immer erfüllt. Die Toleranz richtet sich nach dem Maßstab: ein
Längengrad bei der weiten Eurasien-Karte, 0,6 bei der feineren Japan-Karte
und bei den drei Europakarten, 0,15 bei der Levante-Karte — dort sind 140
SVG-Einheiten ein Längengrad, und ein ganzer Grad würde nichts mehr
beweisen).

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

Stand: 2026-08-13 — Runde 10 abgeschlossen (Modul „Vom Mittelalter zur
Neuzeit", Beginn des Neuzeit-Bogens):
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
  (`utils/themen/dschingis-khan.js`, registriert als Modul 3). Erst die
  europäische Sichtweise (Stimme: Opus): 1241 der „Gotteszorn" vor
  Liegnitz, die Rettung durch einen Todesfall (und was diese Erzählung
  verschweigt), die Pax Mongolica, Marco Polo und das Staunen, das keiner
  glaubte, und zum Schluss die zwei Bilder — Zerstörer und Wegbereiter.
  Hermes hat die chinesische Sichtweise auf die Yuan-Zeit ergänzt; die
  Synthese führt inzwischen beide Stimmen zusammen — das Thema ist fertig.
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
- Runde 6: das vierte Thema — „Japan — die Inselwelt zwischen Abschottung
  und Öffnung" (`utils/themen/japan.js`, registriert als Modul 4). Vorerst
  erst die europäische Sichtweise (Stimme: Opus): 1543 der Sturm, der zwei
  Feuerwaffen nach Tanegashima bringt (und was Japan daraus machte), Franz
  Xaver und die 300 000 Christen, warum Japan die Tür zuzog (mit dem
  Hinweis, dass das Wort „Sakoku" erst 1801 erfunden wurde und die
  Abschottung nur gegen Europa galt), zweihundert Jahre Gerücht durch ein
  Fenster von 120 × 75 Metern, der Japonismus, Perrys schwarze Schiffe, die
  Iwakura-Mission und Tsushima 1905 — samt der unbequemen Fortsetzung
  (Taiwan 1895, Korea 1910). Hermes hat die chinesische Sichtweise ergänzt —
  der Nachbar, der über Jahrhunderte Schrift, Glauben und Verwaltung abgab
  und 1894 den eigenen Schüler verlor; die Synthese führt inzwischen beide
  Stimmen zusammen, das Thema ist fertig.
  Die Karte `utils/themen/karten/japan.js` stammt ebenfalls von Hermes (Ausschnitt
  119–146° O, 28–46° N, 700 × 584,3 — das hochformatigste Bild der App):
  der Archipel als getrennte Landmassen, dazu Korea und die ostchinesische
  Küste, vier Phasen (um 600 Yamato / 1274 und 1281 die Mongolen / um 1700
  Sakoku / 1868 Meiji mit Hokkaido), sechs Info-Punkte (Nara, Kyoto,
  Kamakura, Edo, Dejima, Tsushima) und vier Bewegungen — der Weg des
  Wissens vom Festland, beide Invasionsflotten und Perry 1853. Dazu
  `tests/karte-japan.mjs`; dessen Atlas-Probe arbeitet mit 0,6 Grad
  Toleranz statt einem, weil diese Karte rund fünfmal feiner ist als die
  Eurasien-Karte.
- Runde 7: das fünfte Thema — „Israel und Palästina — ein Land, zwei
  Narrative" (`utils/themen/israel-palaestina.js`, registriert als Modul 5).
  Zuerst die israelisch-jüdische Sichtweise (Stimme: Opus): die Bindung
  ans Land von Abraham bis zum Zweiten Tempel, 70 n. Chr. und Hadrians
  Umbenennung, zweitausend Jahre „Nächstes Jahr in Jerusalem" samt den
  Gemeinden, die durchgehend blieben (Jerusalem, Hebron, Safed, Tiberias),
  Dreyfus und Herzl, die Alijot — mit dem ausdrücklichen Satz, dass das Land
  nicht leer war —, Évian 1938 und das britische Weißbuch 1939, die Annahme
  des UN-Teilungsplans samt fair wiedergegebener arabischer Begründung, 1948
  mit beiden Fluchtbewegungen (rund 700 000 Palästinenser, rund 850 000 Juden
  aus arabischen Ländern) und dem Forschungsstand zur Nakba, 1967 und die
  offen benannte Besatzung. Hermes hat die palästinensisch-arabische
  Sichtweise ergänzt; die Synthese führt inzwischen beide Stimmen zusammen —
  das Thema ist fertig. Die Reihenfolge der beiden Stimmen ist dabei
  ausdrücklich keine Rangfolge; das steht auch so in der App.
  Die Karte `utils/themen/karten/israel-palaestina.js` stammt von Hermes
  (Ausschnitt 32–37° O, 29–34,5° N, 700 × 905,5 — die feinste und
  hochformatigste Karte der App, 140 Einheiten je Längengrad): Levanteküste,
  Totes Meer, See Genezareth, Jordan, Sinai und Sueskanal, drei historische
  Zustände (Teilungsplan 1947 mit beiden Staaten und internationalem
  Jerusalem / Waffenstillstandslinien 1949 mit jordanischer und ägyptischer
  Kontrolle / nach 1967 samt Rückgabe des Sinai 1982 und Abzug aus Gaza
  2005), sechs Info-Punkte (Jerusalem, Tel Aviv, Haifa, Gaza, Hebron,
  Tiberias) und vier Bewegungen in beide Richtungen. Dazu
  `tests/karte-israel-palaestina.mjs` — der prüft nicht nur Geometrie,
  sondern auch die Fairness-Zusagen (siehe Zusatzregel oben).
- Runde 8: das sechste Thema — „Germanen und Völkerwanderung"
  (`utils/themen/germanen.js`, registriert als Modul 6). Vorerst nur die
  römisch-mediterrane Sichtweise (Stimme: Opus): wie Caesar 58 v. Chr. am
  Rhein eine Linie zog und damit ein Volk erfand; Tacitus’ „Germania" als
  Spiegel für Rom samt ihrer gefährlichen Nachgeschichte bis 1943; der
  Teutoburger Wald und der „Hermann" des 19. Jahrhunderts; der Limes als
  Naht und nicht als Wand, mit Stilicho als dem Vandalensohn, der Italien
  verteidigte und 408 hingerichtet wurde; 375/376 der Anfang, der eine
  Flucht war, und Adrianopel; der Sturm von 406 bis 476; der Tag, an dem
  niemand etwas merkte, samt dem offen benannten Streit der Forschung
  (Transformation gegen Absturz des Lebensstandards); und zum Schluss das
  Wort selbst — „Völkerwanderung" gegen „Barbareneinfälle", dazu die
  Zahlen (Zehntausende, nicht Millionen) und die Sieger, die dazugehören
  wollten. Hermes hat die germanische Sichtweise ergänzt; die Synthese führt
  inzwischen beide Stimmen zusammen — das Thema ist fertig (Commit 6fb075f).
  Die Karte `utils/themen/karten/germanen.js` stammt von Hermes (Ausschnitt
  10° W–45° O, 32–58° N, 700 × 468): Küsten vom Atlantik bis zum Asowschen
  Meer, zehn Flüsse, Rhein–Limes–Donau als eigene dunkle Linie über dem
  Untergrund, fünf Phasen (um 100 / 375–378 / 406–455 / um 500 / 568), sechs
  Info-Punkte (Teutoburger Wald, Limes, Adrianopel, Rom, Ravenna, Karthago)
  und fünf Wanderungen (Hunnen, Goten, Westgoten, Vandalen, Angelsachsen).
  Germanien ist dort in keiner Phase eine Fläche — eine Fläche behauptet
  eine Herrschaft mit Grenzen, und die gab es nicht; benannt wird das Land
  trotzdem, als Beschriftung. Dazu `tests/karte-germanen.mjs`: 25
  Atlas-Landmarken mit 0,6 Grad Toleranz (die Küste ist dicht genug
  abgetastet, dass ein ganzer Grad hier nichts mehr bewiese) und acht
  Kontrollpunkte, die gerade NICHT auf einer Küste liegen dürfen — der
  erste davon mitten in Germanien.
- Runde 9: das siebte Thema — „Die frühen Königreiche — wie aus Eroberern
  Herrscher wurden" (`utils/themen/koenigreiche.js`, registriert als Modul 7).
  Zuerst die Sicht der Chronisten und Königshöfe (Stimme: Opus). Die
  Achse ist hier zum ersten Mal keine geografische, sondern eine soziale:
  oben gegen unten. Inhalt: die Trümmerkarte nach 476 und die Frage, wie man
  ein Königreich zusammenhält, wenn ein Heer nur einem Mann folgt;
  Gefolgschaft als teures Band und die Rechnung, die aufgeht, solange es
  Beute gibt; die Taufe als Werkzeug (Chlodwig um 496 in Reims — katholisch,
  während Goten, Vandalen und Burgunder Arianer waren; Reccared 589 in
  Toledo; Æthelberht 597 samt seiner längst christlichen Frau Bertha); die
  Kirche als Erbin der Verwaltung (Bischöfe aus den alten Familien, Diözesen
  auf römischen Bezirken, die Lex Salica auf Latein, Könige, die nicht
  schreiben konnten); Theoderich in Ravenna samt Cassiodors Programm und der
  Hinrichtung des Boethius; die Schattenseite aus denselben Chroniken
  (Chlodwigs Verwandtenmorde bei Gregor von Tours, die Bruderkriege, das Ende
  Brunhilds 613); 751 Pippins Frage an den Papst und die Salbung; 800 die
  Kaiserkrönung, Einhards Überraschungs-Behauptung und der Blick aus
  Konstantinopel. Hermes hat die Sicht aus den Dörfern ergänzt; die Synthese
  führt inzwischen beide Stimmen zusammen — das Thema ist fertig
  (Commit 447a5b5). Die Perspektiven liegen hier nicht nebeneinander, sondern
  übereinander: oben und unten im selben Land.
  Die Karte `utils/themen/karten/koenigreiche.js` stammt von Hermes
  (Ausschnitt 11° W–32° O, 33–57° N, 700 × 552,5 — mit 16,3 Einheiten je
  Längengrad die feinste der drei Europakarten, damit Reims, Tours,
  Canterbury und Aachen keine Stecknadelköpfe werden): zehn Flüsse, die alte
  Reichsgrenze aus Rhein und Donau als blasse Linie über dem Untergrund, vier
  Phasen (476 Trümmerkarte / um 526 die stehenden Königreiche / um 600 nach
  Justinian und den Langobarden / 800 Kaiserkrönung), sieben Info-Punkte
  (Reims, Tours, Ravenna, Rom, Canterbury, Aachen, Toledo) und drei
  Bewegungen (Chlodwigs Weg 486–507, die Mission des Augustinus 596/597, Karl
  nach Italien 773/774 und 800). Auch hier gilt: Wo es keine Herrschaft mit
  Grenzen gab, steht keine Fläche — das Land östlich des Rheins bleibt 476
  leer. Dazu `tests/karte-koenigreiche.mjs`: 19 Atlas-Landmarken mit 0,6 Grad
  Toleranz (jede davon mindestens 0,1 Grad neben dem nächsten Eckpunkt des
  Kartenmoduls, damit die gezeichnete Linie geprüft wird und nicht die
  abgeschriebene Zahl), acht Kontrollpunkte abseits jeder Küste — und die
  Aussage des Kapitels als Rechnung: Das fränkische Gebiet muss über alle
  vier Phasen wachsen, Ostrom auf jeder Phase stehen und dabei kleiner
  werden, und die Bewegungen müssen an denselben Koordinaten hängen wie die
  Info-Punkte (Mission von Rom nach Canterbury, Karl von Aachen nach Rom).
- Runde 10: das achte Thema und der Beginn des Neuzeit-Bogens — „Vom
  Mittelalter zur Neuzeit — die Geburtsstunde Europas"
  (`utils/themen/mittelalter.js`, registriert als Modul 8). Vorerst nur die
  Sicht der alten Ordnung (Stimme: Opus): das Lehnswesen als Netz aus
  Treueiden und sein eingebauter Fehler (wer ein Lehen erbt, wird vom Diener
  zum Konkurrenten); die Ständeordnung Adalberos als Weltbild UND
  Rechtfertigung; der Investiturstreit mit Canossa 1077 als Demütigung und
  Schachzug zugleich, samt der Folge, die bis heute reicht (zwei Gewalten,
  von denen keine die andere schlucken konnte); die Kreuzzüge als Glaube und
  Gewalt in einem — „Gott will es", die Pogrome im Rheinland, das Blutbad von
  1099, Saladin 1187, der Kreuzzug von 1204 gegen eine christliche Stadt,
  Akkon 1291; die Pest 1347–1353 samt den Judenpogromen von 1348/49 und der
  Folge, die die alte Ordnung erschütterte (wo ein Drittel der Arbeitenden
  fehlt, wird Arbeit teuer); der Hundertjährige Krieg und Jeanne d’Arc; die
  drei Zahlen 1450 (Gutenberg), 1453 (Konstantinopel) und 1492 (Granada, die
  Vertreibung der Juden, Kolumbus); die Reformation von 1517 bis zum
  Augsburger Religionsfrieden 1555 samt „cuius regio, eius religio" und dem
  Prager Fenstersturz 1618 als Übergang ins nächste Kapitel.
  Das Herzstück ist ein Abschnitt über den Namen selbst: „finsteres
  Mittelalter" stammt von den Humanisten der Renaissance — über eine Zeit,
  die sie nicht erlebt hatten, und mit dem Interesse, die eigene Gegenwart
  hell aussehen zu lassen. Dazu die beiden Proben aufs Exempel: Die großen
  Hexenverfolgungen liegen zwischen 1560 und 1630, also in der Neuzeit, und
  die Kugelgestalt der Erde war jedem Gebildeten bekannt. Die Synthese ist
  ausdrücklich vorläufig.
  Die Karte `utils/themen/karten/mittelalter.js` hat Hermes zur Hälfte
  angelegt (Küsten, Inseln, zwölf Flüsse, Landmassen) und Opus in Runde 10
  fertiggebaut (Phasen, Punkte, Bewegungen, Beschriftungen, Zusammenbau).
  Ausschnitt 11° W–44° O, 30–58° N, 700 × 495,4 — der größte der App, und das
  ist die Aussage: Jerusalem muss hinein, sonst enden die Kreuzzüge im
  Nichts; Kaffa auf der Krim muss hinein, sonst hat die Pest keinen
  Ausgangspunkt. Vier Phasen (um 800 Karl / um 1200 Kaiser, Papst und
  Kreuzfahrerstaaten / um 1500 Entdeckungen und Osmanen / 1618 die
  Konfessionen), sieben Info-Punkte (Aachen, Canossa, Jerusalem, Venedig,
  Konstantinopel, Mainz, Wittenberg) und vier Bewegungen (Erster Kreuzzug
  1096–1099, der Schwarze Tod 1347–1353 von Kaffa nach London, Kolumbus 1492
  und die Reformation ab 1517 nach Norden). Weil die App alle Flächen einer
  Phase gleich einfärbt, stehen die Konfessionen von 1618 als zwei
  aneinandergrenzende Flächen da; der Hinweis der Phase sagt selbst, wie grob
  das ist, und nennt Böhmen als Gegenbeispiel.
  Dazu `tests/karte-mittelalter.mjs`: 22 Atlas-Landmarken mit 0,6 Grad
  Toleranz (jede mindestens 0,1 Grad neben dem nächsten Eckpunkt des
  Kartenmoduls), 14 Kontrollpunkte abseits jeder Küste — und die Aussage des
  Kapitels als Rechnung: Die Reichsfläche muss über die ersten drei Phasen
  schrumpfen (Karls Reich kommt nie wieder), Byzanz muss zwischen 1200 und
  1500 vom Bild verschwinden und durch das Osmanische Reich ersetzt werden,
  die Kreuzfahrerstaaten müssen 1200 die kleinste Fläche sein, die beiden
  Konfessionsflächen müssen sich eine Kante teilen, und Kreuzzug wie Pest
  müssen über denselben Info-Punkt Konstantinopel laufen.
- `npm test` grün (1316 Prüfungen)

Die sieben Module Rom, China, Dschingis Khan, Japan, Israel/Palästina,
Germanen und Königreiche haben beide Stimmen und eine echte Synthese; beim
Mittelalter fehlt die zweite noch.

Nächste Schritte (Landkarte, noch offen):
- **Die Stimme der Städte und des Aufbruchs (Hermes)** — die zweite Stimme
  zum Mittelalter-Kapitel: Bürger, Kaufleute, Handwerker, Drucker, Reformer.
  Wie sieht diese Zeit aus, wenn man sie nicht vom Thron her betrachtet,
  sondern vom Markt? „Stadtluft macht frei" als Loch in der Ständeordnung;
  woher das Geld kam, das den Fürsten ihre Kriege bezahlte; warum die neuen
  Ideen fast alle in Städten entstanden. Und die Kernfrage: Was die alte
  Ordnung als Zerfall erlebte, war von unten gesehen vielleicht ein Aufbruch.
- **Am Gerät gegenlesen:** Alle acht Karten sind rechnerisch gegen den
  Atlas geprüft, aber noch nicht auf einem Handy gesehen. Vor allem
  Schriftgrößen und Trefferflächen der Punkte gehören auf einem kleinen
  Bildschirm beurteilt (`npm start`, Expo Go). Die Extremfälle liegen jetzt
  vor: die Mongolen-Karte mit 700 × 253,5 als flachstes, breitestes Band und
  die Levante-Karte mit 700 × 905,5 als schmalstes, höchstes (Japan
  700 × 584,3, Königreiche 700 × 552,5, Rom 700 × 548, Mittelalter
  700 × 495,4, Germanen 700 × 468, China 700 × 400). Ob die Beschriftungen
  dort überlappen — und ob ein so hohes Bild auf einem Handy überhaupt in
  einem Stück lesbar ist —, entscheidet das Gerät. Für zwei Karten liegen
  schon Hinweise vor; beide Skripte sind Wegwerf-Werkzeuge und nicht Teil von
  `npm test`:
  `node tools/pruef-koenigreiche.mjs` meldet vier mögliche Überlappungen —
  „Frankenreich"/Aachen, „Burgunder"/„Langobarden", „Ostgoten"/„Donau" und
  Canterbury/Aachen.
  `node tools/pruef-mittelalter.mjs` meldet zwei, und beide sind echte
  Geografie und nicht zu verschieben: Aachen/Mainz (rund 200 km auseinander)
  und Canossa/Venedig. Bei 12,7 Einheiten je Längengrad stehen die Ortsnamen
  dort dicht beieinander. Wenn es auf dem Gerät stört, ist die Frage, ob die
  App Ortsnamen erst beim Antippen zeigen sollte — das beträfe alle Karten.
- **Zeitleisten** — der zweite Teil von „Geschichte in Bewegung"; die
  Karten decken bisher nur den Raum ab, nicht die Zeit.
- **Weitere Themen** nach `notizen/kapitel-planung.md`, dem Neuzeit-Bogen:
  die Eroberung Amerikas, der Dreißigjährige Krieg, die USA und die
  Vertreibung der Indianer, Revolution und Napoleon, der Erste Weltkrieg mit
  der Kriegsschuldfrage, Weimar, der Zweite Weltkrieg. Jeweils die eine Sicht
  von Opus, die andere von Hermes, Synthese gemeinsam; beim Ersten Weltkrieg
  sind ausdrücklich mehr als zwei Stimmen vorgesehen. Karten sind dabei
  optional: Themen ohne `karte` überspringen den Abschnitt.
