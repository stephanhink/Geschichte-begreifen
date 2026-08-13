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
   *(fertig)*
9. **Die Eroberung Amerikas** — von der Fahrt des Kolumbus 1492 bis zum
   spanischen Kolonialreich um 1600. Zweites Kapitel des Neuzeit-Bogens und
   die unmittelbare Fortsetzung des achten: Dort läuft auf der Karte ein Pfeil
   nach Westen aus dem Bild hinaus, hier ist die Karte, auf der er ankommt.
   Die Perspektiven-Achse dreht sich wieder nach außen — und sie steht so
   schief wie in keinem anderen Kapitel, weil die eine Seite die
   Aufzeichnungen der anderen verbrannt hat: Von den Büchern der Maya sind
   vier erhalten. „Der Sieger schreibt die Geschichte" ist hier keine
   Redensart, sondern der Befund. Zentral sind nach Betreiber-Vorgabe die
   eingeschleppten Krankheiten: Sie, nicht die Heere, sind der Hauptgrund für
   den größten Bevölkerungseinbruch, den wir aus der Geschichte kennen.
   *(europäische Sichtweise fertig, indigene Sichtweise offen)*

**Der Neuzeit-Bogen** ist vom Betreiber ausbuchstabiert und steht in
`notizen/kapitel-planung.md`: neun Kapitel, beginnend mit „Vom Mittelalter zur
Neuzeit" (= Modul 8, seit Runde 10 angelegt) und der Eroberung Amerikas
(= Modul 9, seit Runde 11 angelegt), dann der Dreißigjährige Krieg, die USA
und die Vertreibung der Indianer, Revolution und Napoleon, der Weg zum Ersten
Weltkrieg (mit der Kriegsschuldfrage als multiperspektivischem Herzstück und
dem Abschnitt „Was 1914 uns heute lehrt") bis zum Zweiten Weltkrieg und der
neuen Weltordnung. Wer eines dieser Kapitel beginnt, liest die Datei zuerst —
sie enthält Vorgaben, die aus der Themenlandkarte allein nicht hervorgehen.
Der frühere Platzhalter „Ausblick Neuzeit" ist damit erledigt: Der Bogen
selbst ist der Ausblick. **Als Nächstes an der Reihe: der Dreißigjährige Krieg
(1618–1648)** — der Krieg und die Folgen für Europa (Westfälischer Friede,
modernes Staatensystem).

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
`tests/karte-mittelalter.mjs` für die drei Europakarten,
`tests/karte-eroberung-amerikas.mjs` für die Atlantikkarte; alle außer der
ersten nehmen bewusst Koordinaten, die NICHT als Eckpunkte im Kartenmodul
stehen, damit die gezeichnete Linie geprüft wird und nicht die abgeschriebene
Zahl — dazu Kontrollpunkte im Binnenland bzw. auf offener See, die gerade
NICHT auf einer Küste liegen dürfen, sonst wäre die Probe durch bloße
Punktdichte immer erfüllt. Die Toleranz richtet sich nach dem Maßstab: ein
Längengrad bei der weiten Eurasien-Karte und bei der noch weiteren
Amerika-Karte (6,4 SVG-Einheiten je Grad, die gröbste der App), 0,6 bei der
feineren Japan-Karte und bei den drei Europakarten, 0,15 bei der
Levante-Karte — dort sind 140 SVG-Einheiten ein Längengrad, und ein ganzer
Grad würde nichts mehr beweisen).

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

Stand: 2026-08-13 — Runde 11 abgeschlossen (Modul „Die Eroberung Amerikas",
zweites Kapitel des Neuzeit-Bogens):
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
  die Kugelgestalt der Erde war jedem Gebildeten bekannt. Hermes hat die
  Stimme der Städte und des Aufbruchs noch in Runde 10 ergänzt; die Synthese
  führt inzwischen beide Stimmen zusammen — das Thema ist fertig
  (Commit c65a2e8).
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
- Runde 11: das neunte Thema und das zweite Kapitel des Neuzeit-Bogens — „Die
  Eroberung Amerikas" (`utils/themen/eroberung-amerikas.js`, registriert als
  Modul 9). Vorerst nur die europäische Sichtweise (Stimme: Opus): warum 1453
  und 1492 zusammenhängen (der Landweg nach Asien ist zu, die Reconquista ist
  zu Ende, und es stehen tausende Männer herum, die nur kämpfen können); die
  Fahrt von Palos über die Kanaren — mit dem Hinweis, dass nicht die
  Kugelgestalt der Erde umstritten war, sondern ihre Größe, und dass Kolumbus
  sich verrechnete und Glück hatte; das Bordbuch des 12. Oktober 1492, in dem
  Bewunderung für die Taíno und der Satz „mit fünfzig Mann kann man sie alle
  unterwerfen" auf derselben Seite stehen; der Abschnitt über das Wort
  „Entdeckung" selbst (es behauptet, vorher sei nichts Zählbares da gewesen —
  Tenochtitlan hatte das Vierfache der Einwohner Sevillas); die Krankheiten
  als Herzstück nach Betreiber-Vorgabe, samt der Erklärung, warum es sie in
  Amerika nicht gab, und den Zahlen mit ihrer Unsicherheit (Zentralmexiko
  10–25 Millionen 1519, ein bis zwei Millionen um 1600); Cortés 1519–1521 mit
  Cholula, der Noche Triste und dem Punkt, den die Heldenerzählung klein
  redet — die indigenen Verbündeten stellten die Mehrheit des Heeres, und
  ihre Beweggründe waren nachvollziehbar; Pizarro 1532/33 mit Cajamarca, dem
  gezahlten und trotzdem nicht eingelösten Lösegeld und dem Widerstand bis
  1572; ein Abschnitt „Warum ging das so schnell?", der fünf Ursachen in
  ihrer wirklichen Reihenfolge nennt und die europäische Lieblingsantwort
  (überlegene Kultur) ausdrücklich verwirft; Encomienda, Mita, Potosí und der
  Silberstrom bis nach China; der Sklavenhandel als direkte Fortsetzung; die
  Kritiker aus den eigenen Reihen (Montesinos 1511, Las Casas, Vitoria,
  Valladolid 1550/51) — samt der ehrlichen Anmerkung, dass Las Casas
  zeitweise afrikanische Sklaven vorschlug, und der Einordnung der
  „Schwarzen Legende"; und zum Schluss die Tür zur zweiten Stimme. Auch die
  Quetzalcoatl-Legende wird als das gekennzeichnet, was sie wahrscheinlich
  ist: eine nachträgliche Erklärung aus Quellen, die nach der Eroberung unter
  spanischer Aufsicht entstanden. Hermes hat die indigene Sichtweise ergänzt:
  die Welt vor 1492 als eigene Geschichte (Tenochtitlan mit Chinampas,
  Schulen und Markt; das Tawantinsuyu mit Straßen, Quipus und Mita), die
  eigenen unbequemen Stellen selbst benannt (Opferungen und Blumenkriege,
  der Bruderkrieg Atahualpa/Huáscar, das Tlaxcala-Bündnis als Rechnung, die
  nicht aufging), die Ankunft aus Sicht der Taíno („Begegnung" gegen
  „Inbesitznahme"), die Seuche, für die es kein Wort gab, der Fall mit
  Cuauhtémoc und der Widerstand bis Vilcabamba 1572, verbrannte Bücher und
  lebendige Erinnerung (Popol Vuh, Florentiner Kodex, Nahuatl und Quechua
  heute) — und fair zur Gegenseite (Montesinos, Las Casas, Vitoria,
  Valladolid). Die Synthese führt beide Stimmen zusammen: wo sie
  übereinstimmen (dieselben Ursachen in derselben Reihenfolge), wo sie
  auseinandergehen (das erste Wort, die Quelle selbst, die Frage nach dem
  Sinn) — und übergibt an Dein Urteil. Der Befund, der dieses Kapitel von
  allen anderen unterscheidet, steht in beiden Stimmen und in der Synthese:
  von den Büchern der Maya sind vier erhalten, und Diego de Landa schrieb
  nach dem Verbrennen selbst ein Buch über die Kultur, die er vernichtet
  hatte.
  Die Karte `utils/themen/karten/eroberung-amerikas.js` ist der weiteste
  Ausschnitt der App: 115° W–5° W, 20° S–45° N, 700 × 423,7 — 110
  Längengrade auf 700 Einheiten, also 6,4 Einheiten je Grad. Das ist grob und
  Absicht: Sevilla und Cusco müssen auf ein Bild, Potosí liegt einen
  Fingerbreit über dem unteren Rand, und in der Mitte ist nichts als Ozean —
  der Atlantik ist hier nicht Lücke, sondern Bühne. Ganz Amerika ist ein
  einziger Umriss vom Nordpazifik bis Feuerland-Höhe und zurück über
  Brasilien, die Karibik, Yucatán, den Golf und die nordamerikanische
  Atlantikküste; Golf von Mexiko und Karibisches Meer entstehen dabei von
  selbst. Dazu Kuba, Hispaniola, Jamaika, Puerto Rico, Trinidad, die Bahamas
  mit Guanahani, vier Kanareninseln, die Iberische Halbinsel und
  Nordwestafrika, sieben Flüsse (darunter der Guadalquivir — der Grund, warum
  der Hafen der Neuen Welt achtzig Kilometer landeinwärts lag). Fünf Phasen
  (um 1492 zwei getrennte Welten / 1492–1504 die vier Reisen und Hispaniola /
  1519–1521 der Fall Tenochtitlans / 1532–1533 der Fall des Inkareichs / um
  1600 die beiden Vizekönigreiche), sechs Info-Punkte (Sevilla, Kanaren,
  Guanahani, Santo Domingo, Tenochtitlan, Cusco) und vier Bewegungen —
  Kolumbus 1492, Cortés 1519, Pizarro 1531–1533 und, als Gegenbewegung, der
  Silberstrom von Potosí nach Sevilla ab 1545. Die Zurückhaltungsregel der
  Germanen- und Königreiche-Karten gilt hier besonders streng: Nordamerika,
  das Amazonasbecken und der Süden bleiben in jeder Phase leer — dort lebten
  Millionen Menschen, aber keine der gezeigten Herrschaften hatte dort
  Grenzen. Auch das Kolonialreich von 1600 zeigt Verwaltetes, nicht
  Beanspruchtes; der Hinweis der Phase sagt das selbst.
  Dazu `tests/karte-eroberung-amerikas.mjs`: 36 Atlas-Landmarken von Ensenada
  bis Gijón mit einem Längengrad Toleranz (jede mindestens 0,1 Grad neben dem
  nächsten Eckpunkt des Kartenmoduls — nachrechenbar mit
  `node tools/pruef-eroberung-amerikas.mjs`), zehn Kontrollpunkte abseits
  jeder Küste (der erste mitten im Atlantik), und die Aussage des Kapitels als
  Rechnung: 1492 müssen zwei Mächte links und zwei rechts des Ozeans stehen
  und in Amerika keine einzige spanische Fläche; das spanische Gebiet muss von
  Phase zu Phase wachsen und um 1600 ein Vielfaches des ersten Stützpunkts
  sein; das Aztekenreich muss nach Phase 3 vom Umschalter verschwinden, das
  Inkareich nach Phase 4; keine amerikanische Fläche darf über den 30.
  Breitengrad nach Norden reichen; und der Silberstrom muss dieselbe Strecke
  zurücklaufen, die Kolumbus hinfuhr. Dazu die Tone-Prüfungen der Zusatzregel
  für sensible Themen: dass die Perspektive Requerimiento, Cholula und
  Sklavenhandel selbst benennt, dass sie die Beweggründe der Verbündeten fair
  wiedergibt, dass sie ihre eigene Lieblingserklärung verwirft — und dass
  keine Quizfrage nach Schuld oder Besitz fragt.
- `npm test` grün (1514 Prüfungen)

Alle neun Module Rom, China, Dschingis Khan, Japan, Israel/Palästina,
Germanen, Königreiche, Mittelalter und Eroberung Amerikas haben beide
Stimmen und eine echte Synthese.

Nächste Schritte (Landkarte, noch offen):
- **Am Gerät gegenlesen:** Alle neun Karten sind rechnerisch gegen den
  Atlas geprüft, aber noch nicht auf einem Handy gesehen. Vor allem
  Schriftgrößen und Trefferflächen der Punkte gehören auf einem kleinen
  Bildschirm beurteilt (`npm start`, Expo Go). Die Extremfälle liegen jetzt
  vor: die Mongolen-Karte mit 700 × 253,5 als flachstes, breitestes Band und
  die Levante-Karte mit 700 × 905,5 als schmalstes, höchstes (Japan
  700 × 584,3, Königreiche 700 × 552,5, Rom 700 × 548, Mittelalter
  700 × 495,4, Germanen 700 × 468, Amerika 700 × 423,7, China 700 × 400). Ob
  die Beschriftungen dort überlappen — und ob ein so hohes Bild auf einem
  Handy überhaupt in einem Stück lesbar ist —, entscheidet das Gerät. Für
  drei Karten liegen schon Hinweise vor; alle drei Skripte sind
  Wegwerf-Werkzeuge und nicht Teil von `npm test`:
  `node tools/pruef-koenigreiche.mjs` meldet vier mögliche Überlappungen —
  „Frankenreich"/Aachen, „Burgunder"/„Langobarden", „Ostgoten"/„Donau" und
  Canterbury/Aachen.
  `node tools/pruef-mittelalter.mjs` meldet zwei, und beide sind echte
  Geografie und nicht zu verschieben: Aachen/Mainz (rund 200 km auseinander)
  und Canossa/Venedig. Bei 12,7 Einheiten je Längengrad stehen die Ortsnamen
  dort dicht beieinander. Wenn es auf dem Gerät stört, ist die Frage, ob die
  App Ortsnamen erst beim Antippen zeigen sollte — das beträfe alle Karten.
  `node tools/pruef-eroberung-amerikas.mjs` meldet keine Überlappung — die
  Karte ist so weit, dass alles Luft hat. Dort ist die offene Frage die
  umgekehrte: ob die vier Kanareninseln und Guanahani auf einem Handy
  überhaupt noch als Inseln zu erkennen sind; sie sind wenige SVG-Einheiten
  groß, und Guanahani trägt trotzdem einen Info-Punkt.
- **Zeitleisten** — der zweite Teil von „Geschichte in Bewegung"; die
  Karten decken bisher nur den Raum ab, nicht die Zeit.
- **Weitere Themen** nach `notizen/kapitel-planung.md`, dem Neuzeit-Bogen —
  als Nächstes **der Dreißigjährige Krieg (1618–1648)**, danach die USA und
  die Vertreibung der Indianer, Revolution und Napoleon, der Erste Weltkrieg
  mit der Kriegsschuldfrage, Weimar, der Zweite Weltkrieg. Jeweils die eine
  Sicht von Opus, die andere von Hermes, Synthese gemeinsam; beim Ersten
  Weltkrieg sind ausdrücklich mehr als zwei Stimmen vorgesehen. Karten sind
  dabei optional: Themen ohne `karte` überspringen den Abschnitt.
