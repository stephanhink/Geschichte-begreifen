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
   *(fertig)*
10. **Der Dreißigjährige Krieg** — von 1618 bis zum Westfälischen Frieden
    1648. Drittes Kapitel des Neuzeit-Bogens und die unmittelbare Fortsetzung
    des achten: Dort ist der Prager Fenstersturz der letzte Satz, hier ist er
    der erste. Die Perspektiven-Achse ist wieder eine soziale wie bei den
    frühen Königreichen und beim Mittelalter — oben die Entscheider (Kaiser,
    Kurfürsten, Könige, Feldherren), unten die Betroffenen in Städten und
    Dörfern. Das Kapitel führt die Leitidee an einer Frage vor, die bis heute
    gestritten wird: Religionskrieg oder Machtkrieg? Ein katholischer Kardinal
    bezahlt lutherische Heere, ein lutherischer Kurfürst kämpft für den
    katholischen Kaiser — und trotzdem war der Glaube für die Beteiligten
    keine Maske. Beides zugleich stehen zu lassen, ohne eine Seite zu
    dämonisieren oder zu verharmlosen, ist hier die eigentliche Aufgabe.
    *(beide Sichtweisen fertig, die Synthese führt sie zusammen)*
11. **Die USA: Unabhängigkeit und die Vertreibung der Indianer**
    (1776–ca. 1890) — viertes Kapitel des Neuzeit-Bogens, und zeitlich nach
    Betreiber-Vorgabe VOR Napoleon einsortiert (Gründung 1776 < Napoleon
    1799). Von der Unabhängigkeitserklärung 1776 und ihrem Satz „alle
    Menschen sind gleich geschaffen" — der weder die Sklaverei noch die
    Souveränität der Stämme abdeckte — über die Frontier als Gründungsmythos,
    den Louisiana Purchase 1803 und den Oregon Trail bis zur Indian Removal
    Policy unter Andrew Jackson, dem Trail of Tears 1838/39 und den
    Indianerkriegen im Westen (Little Bighorn 1876, die gezielte Ausrottung
    der Büffelherden als Kriegsmittel, Wounded Knee 1890). Die
    Perspektiven-Achse steht wieder nach außen — Siedler gegen Stämme —, und
    das brutale Vorgehen gegen die indigene Bevölkerung ist nach
    Betreiber-Vorgabe ausdrücklich zentral, nicht Randnotiz.
    *(beide Sichtweisen fertig — Siedler/Nation und Stämme —, die Synthese
    führt sie zusammen)*
12. **Revolution und Napoleon** (1789–1815) — fünftes Kapitel des
    Neuzeit-Bogens. Von der Krise des Ancien Régime über den Ballhausschwur,
    den Sturm auf die Bastille und die Erklärung der Menschen- und
    Bürgerrechte 1789 bis Waterloo 1815. Es schließt an die USA an, weil
    beide Kapitel zusammenhängen: 1803 verkauft Napoleon Louisiana an die
    USA, um seine Kriege in Europa zu bezahlen. Die Perspektiven-Achse liegt
    zwischen denen, die die Ideen von 1789 trugen, und denen, über deren
    Köpfe hinweg sie gebracht wurden — Befreiung und Eroberung in derselben
    Uniform. Die Leitidee der App führt dieses Kapitel an einer einzigen
    Zahlenreihe vor: Dieselben Jahre gaben Europa Nation, Bürgerrechte und
    Gleichheit vor dem Gesetz — und kosteten drei bis fünf Millionen
    Menschen das Leben. Beides gehört in dieselbe Bilanz.
    *(beide Sichtweisen fertig — Revolutionäre/Napoleon und Betroffene —,
    die Synthese führt sie zusammen)*

**Der Neuzeit-Bogen** ist vom Betreiber ausbuchstabiert und steht in
`notizen/kapitel-planung.md`: zehn Kapitel (seit dem 14.08.2026 — der
Betreiber hat „Die Kolonien" als eigenes Kapitel nachgetragen), beginnend mit
„Vom Mittelalter zur Neuzeit" (= Modul 8, seit Runde 10 angelegt), der Eroberung Amerikas
(= Modul 9, seit Runde 11 angelegt), dem Dreißigjährigen Krieg (= Modul 10,
seit Runde 12 angelegt) und den USA — Unabhängigkeit und die Vertreibung der
Indianer (= Modul 11, seit Runde 13 angelegt) und Revolution und Napoleon
(= Modul 12, seit Runde 14 angelegt), dann die Kolonien, der Weg zum Ersten
Weltkrieg (mit der Kriegsschuldfrage als multiperspektivischem Herzstück und
dem Abschnitt „Was 1914 uns heute lehrt") bis zum Zweiten Weltkrieg und der
neuen Weltordnung. Wer eines dieser Kapitel beginnt, liest die Datei zuerst —
sie enthält Vorgaben, die aus der Themenlandkarte allein nicht hervorgehen.
Der frühere Platzhalter „Ausblick Neuzeit" ist damit erledigt: Der Bogen
selbst ist der Ausblick. **Als Nächstes an der Reihe: Die Kolonien
(ca. 1815–1914)** — der europäische Imperialismus und die Aufteilung der Welt
im 19. Jahrhundert: Wettlauf um Afrika und Kongokonferenz 1884/85, der Kongo
unter Leopold II., Britisch-Indien, die Opiumkriege, Südostasien; nach
Betreiber-Vorgabe mit einer besonderen Rolle Großbritanniens (Pax Britannica,
„The sun never sets on the British Empire", Indien als „Juwel der Krone", die
Dominions) und mit der Verbindung zum Ersten Weltkrieg über die
Kolonialrivalitäten (Faschoda 1898, Marokko-Krisen 1905/1911).
Perspektiven-Achse: die Kolonialmächte gegen die kolonisierten Völker — „Der
Sieger schreibt die Geschichte" gilt hier doppelt. Danach folgt **Der Weg zum
Ersten Weltkrieg (1815–1914)** mit der Kriegsschuldfrage als Herzstück (die
Alleinschuld-These als das kennzeichnen, was sie ist: Artikel 231 des
Versailler Vertrags, kein Forschungsstand) und ausdrücklich mehr als zwei
Stimmen — je Großmacht eine. Die Vorgaben zu beiden Kapiteln stehen
ausbuchstabiert in `notizen/kapitel-planung.md` und sind vor dem Start zu
lesen.

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
`tests/karte-eroberung-amerikas.mjs` für die Atlantikkarte,
`tests/karte-dreissigjaehriger-krieg.mjs` für die vierte Europakarte,
`tests/karte-usa-unabhaengigkeit.mjs` für die Nordamerika-Karte,
`tests/karte-revolution-und-napoleon.mjs` für die fünfte Europakarte; alle
außer der ersten nehmen bewusst Koordinaten, die NICHT als Eckpunkte im
Kartenmodul stehen, damit die gezeichnete Linie geprüft wird und nicht die
abgeschriebene Zahl — dazu Kontrollpunkte im Binnenland bzw. auf offener See,
die gerade NICHT auf einer Küste liegen dürfen, sonst wäre die Probe durch
bloße Punktdichte immer erfüllt. Die Toleranz richtet sich nach dem Maßstab:
ein Längengrad bei der weiten Eurasien-Karte, bei der noch weiteren
Amerika-Karte (6,4 SVG-Einheiten je Grad, die gröbste der App), bei der
Nordamerika-Karte (11,7) und bei der Napoleon-Karte (14 — sie spannt 50
Längengrade von Lissabon bis östlich von Moskau), 0,6 bei der feineren
Japan-Karte und bei den vier engeren Europakarten, 0,15 bei der
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

Stand: 2026-08-14 — Runde 14 abgeschlossen (Modul „Revolution und Napoleon",
fünftes Kapitel des Neuzeit-Bogens; beide Stimmen, Karte und Tests):
- Runde 14: das zwölfte Thema — „Revolution und Napoleon"
  (`utils/themen/revolution-und-napoleon.js`, registriert als Modul 12).
  Die Sicht der Revolutionäre und der napoleonischen Bewegung
  (Stimme: Opus). Inhalt: 1789 als Rechnung, die nicht aufging (Staatsbankrott
  nach dem amerikanischen Unabhängigkeitskrieg, Missernte 1788, Generalstände,
  Ballhausschwur, Bastille, Nacht des 4. August); die Erklärung der Menschen-
  und Bürgerrechte samt dem Halbsatz, der alles umstürzt — Ämter für alle
  „ohne einen anderen Unterschied als den ihrer Fähigkeiten" — und der Liste
  dessen, was tatsächlich kam (Ende der Leibeigenschaft und der Zünfte,
  Gleichstellung von Protestanten und Juden 1791, metrisches System); ein
  eigener Abschnitt „Wen die Gleichheit nicht meinte" (Frauen und Olympe de
  Gouges, das Verbot der Frauenklubs 1793, die Versklavten in Saint-Domingue,
  die Abschaffung der Sklaverei 1794 — und ihre Wiedereinführung durch
  Napoleon 1802, aus der 1804 Haiti hervorging); der Terror 1793/94 mit rund
  17 000 Todesurteilen, der Vendée und dem Satz, den diese Stimme über sich
  selbst sagt: Eine Bewegung, die im Namen der Menschenrechte Menschen ohne
  Verteidigung aburteilt, widerlegt sich selbst; Bonapartes Aufstieg (Toulon
  1793, Italien 1796, Ägypten 1798 samt Stein von Rosetta, der 18. Brumaire
  ausdrücklich als Staatsstreich benannt); der Code civil als das, was blieb,
  mitsamt seiner Kehrseite (die Ehefrau unter der Gewalt des Mannes, vier
  statt siebzig Pariser Zeitungen, Geheimpolizei); die Kaiserkrönung 1804 als
  neue Erbherrschaft, Austerlitz 1805, Jena und Auerstedt 1806, Trafalgar und
  die Kontinentalsperre als Kette, an der jeder Krieg den nächsten erzeugte;
  Spanien ab 1808 mit fair wiedergegebenen Beweggründen der Gegenseite; 1812
  als Feldzug ohne erreichbares Ziel (600 000 Mann, weniger als 100 000
  zurück); Leipzig, Elba, die Hundert Tage, Waterloo und der Wiener Kongress;
  und zum Schluss „Was die Zeitgenossen sahen" (Kant, Hegels „Weltseele zu
  Pferde", Beethovens zurückgenommene Widmung, Wordsworth — und Goyas
  „Schrecken des Krieges", die Blutsteuer, die Bilanz aus Bürgerrechten und
  drei bis fünf Millionen Toten, die in dieselbe Rechnung gehören). Die Sicht
  der Betroffenen (Saint-Domingue/Haiti, Spanien, Russland, die deutschen
  Länder, die Soldaten der Grande Armée) ergänzt Hermes; die Synthese sagt
  bis dahin offen, dass dieses Kapitel eine halbe Geschichte ist.
  Die Karte `utils/themen/karten/revolution-und-napoleon.js` spannt 10° W bis
  40° O und 35° N bis 57° N auf 700 × 443,4 — 14 SVG-Einheiten je Längengrad.
  Der Betreiber hatte 9° W–40° O und 35–55° N vorgegeben; nach Norden und
  Westen steht der Rahmen eine Spur weiter, und zwar aus dem Grund, den die
  Vorgabe selbst nennt: Moskau liegt auf 55,75° N, Kopenhagen auf 55,68° N,
  Lissabon auf 9,14° W — bei 55° N und 9° W wäre der Russland-Feldzug ohne
  Ziel geblieben. Was der Ausschnitt kostet, steht im Kopf der Datei: Norwegen
  und Sankt Petersburg liegen über dem oberen Rand, Ägypten unter dem unteren
  — der Ägypten-Feldzug 1798/99 steht deshalb nur im Text. Enthalten sind
  Küsten von Irland bis zum Kaukasus, Anatolien und die Levanteküste,
  Nordafrika von Tanger bis Kap Bon, zwölf Inseln (darunter Korsika und Elba,
  beide für dieses Kapitel unverzichtbar) und neunzehn Flüsse — vom Rhein bis
  zur Beresina. Drei Phasen (1789 das Europa der Königreiche / 1805–1812 das
  Empire auf dem Höhepunkt / 1815 die Ordnung des Wiener Kongresses), sieben
  Info-Punkte (Paris, Trafalgar, Madrid, Austerlitz, Moskau, Leipzig,
  Waterloo) und drei Bewegungen (Vormarsch 1812, Rückzug über die Beresina,
  von Elba nach Waterloo).
  Zwei Festlegungen sind zentral. Erstens: **Das Heilige Römische Reich ist
  keine Fläche** — dieselbe Regel wie beim Dreißigjährigen Krieg; die
  Reichsgrenze von 1789 liegt als blasse Linie im Untergrund und bleibt auch
  auf den späteren Phasen stehen, damit man sieht, was 1806 verschwand.
  Zweitens: **Moskau liegt in keiner Phase im französischen Gebiet.** Napoleon
  stand im September 1812 in der Stadt; einverleibt war sie nie. Der Feldzug
  ist deshalb ein Pfeil und keine Fläche — derselbe Unterschied wie beim
  schwedischen Vormarsch von 1631.
  Dazu `tests/karte-revolution-und-napoleon.mjs`: 30 Atlas-Landmarken von
  Galway bis Rostow am Don mit einem Längengrad Toleranz (jede mindestens
  0,1 Grad neben dem nächsten Eckpunkt des Kartenmoduls), zwölf Kontrollpunkte
  abseits jeder Küste — und die Aussage des Kapitels als Rechnung: Das
  französische Gebiet muss 1812 deutlich größer sein als 1789 und 1815 wieder
  auf den alten Wert zurückfallen; Polen-Litauen steht 1789 auf der Karte und
  danach nie wieder; Herzogtum Warschau und Rheinbund gibt es nur in der
  mittleren Phase, den Deutschen Bund erst 1815; Russland wächst über alle
  drei Phasen. Dazu die Punkt-im-Vieleck-Proben: Moskau liegt in jeder Phase
  im russischen und in keiner im französischen Gebiet, Rom, Utrecht und
  Ajaccio dagegen 1812 im einverleibten Gebiet, Berlin nicht. Und die
  Tone-Prüfungen: dass die Perspektive den Terror, die Wiedereinführung der
  Sklaverei 1802, den Staatsstreich, die Zensur und die Ziellosigkeit des
  Feldzugs von 1812 selbst benennt, dass sie die Beweggründe der spanischen
  Seite und der Freiwilligen von 1813 fair wiedergibt — und dass keine
  Quizfrage nach Schuld fragt.
- `npm test` grün (2093 Prüfungen)

Frühere Runde (2026-08-13): Runde 13 abgeschlossen (Modul „Die USA:
Unabhängigkeit und die Vertreibung der Indianer", viertes Kapitel des
Neuzeit-Bogens; beide Stimmen, Karte und Tests):
- Runde 13: das elfte Thema — „Die USA: Unabhängigkeit und die Vertreibung
  der Indianer" (`utils/themen/usa-unabhaengigkeit.js`, registriert als
  Modul 11). Zeitlich nach Betreiber-Vorgabe vor Napoleon einsortiert
  (Gründung 1776 < Napoleon 1799). Die Sicht der Siedler und der
  jungen Nation (Stimme: Opus): die Unabhängigkeitserklärung 1776 mit ihrem
  Satz „alle Menschen sind gleich geschaffen" — und der Beschwerde-Passage
  im selben Dokument, die indianische Nationen als „gnadenlose Wilde"
  bezeichnet —, die Verfassung 1787 samt Drei-Fünftel-Klausel und der
  Klausel über „Handel mit den Indianerstämmen"; die Frontier als
  Gründungsmythos nach Frederick Jackson Turner und die unbequeme Stelle,
  die diese Stimme selbst benennt: „frei war das Land nicht"; der Louisiana
  Purchase 1803 (Napoleon verkauft, ohne dass eine der betroffenen Nationen
  gefragt wurde), der Siedlerstrom über den Cumberland Gap, Oregon Trail und
  California Trail; über dreihundert Verträge, von denen die meisten
  gebrochen wurden, die Indian Removal Policy unter Andrew Jackson, das
  Ignorieren von Worcester v. Georgia 1832, der Vertrag von New Echota 1835
  (unterzeichnet gegen den erklärten Willen der gewählten Cherokee-Führung
  um John Ross) und der Trail of Tears 1838/39; die Indianerkriege im
  Westen (Little Bighorn 1876, die von der US-Regierung geförderte
  Ausrottung der Büffelherden als offen ausgesprochenes Kriegsmittel, der
  Dawes Act 1887, Wounded Knee 1890 als Massaker ohne Sieg); und zum
  Schluss „Manifest Destiny" als Selbstrechtfertigung samt der
  Bevölkerungsbilanz (von geschätzt mehreren Millionen auf rund 237 000 bei
  der Volkszählung 1900) und der Tür zur zweiten Stimme. Hermes ergänzt die
  Sicht der Stämme (Stimme: Hermes): die Haudenosaunee-Konföderation als
  Republik vor der Republik, Sequoyahs Silbenschrift und die
  Cherokee-Verfassung von 1827, Land als gemeinsames Zuhause statt Ware
  („solange Gras wächst und Wasser fließt"), die Verträge als feierliche
  Bündnisse und ihr Bruch (Black Hills), New Echota und der Trail of Tears
  aus der Sicht der Betroffenen („Nunna daul Isunyi"), Widerstand (Seminolen,
  Little Bighorn, Geistertanz), Internate und Dawes Act, Überleben bis heute
  (Black-Hills-Urteil 1980, Standing Rock 2016) — und, nach der Zusatzregel,
  auch die unbequemen Stellen der eigenen Seite (Stammesrivalitäten,
  Sklaverei in Südost-Nationen, die New-Echota-Minderheit). Die Synthese
  führt beide Stimmen zusammen.
  Die Karte `utils/themen/karten/usa-unabhaengigkeit.js` ist mit 700 × 367,6
  und 11,7 SVG-Einheiten je Längengrad die bislang breiteste Karte der App
  nach der Mongolen-Karte: Der Ausschnitt (125° W–65° W, 25° N–50° N) muss
  die ganze Ausdehnung der Westexpansion vom Atlantik bis zum Pazifik
  zeigen. Küsten von Niederkalifornien bis zur Bay of Fundy, die Großen Seen
  als fünf eigene Wasserflächen, fünf Flüsse (Mississippi, Missouri, Ohio,
  Rio Grande, Columbia), drei Phasen (1776 die Dreizehn Kolonien / 1830–1839
  Indian Removal und Trail of Tears / 1890 die USA von Meer zu Meer), sieben
  Info-Punkte (Boston, Philadelphia, New Echota, New Orleans, Fort Laramie,
  Little Bighorn, Wounded Knee) und drei Bewegungen (Trail of Tears, Oregon
  Trail, California Trail). Die zentrale Festlegung aus der Zusatzregel für
  sensible Themen: 1776 stehen neben den Dreizehn Kolonien auch das Land der
  Haudenosaunee und das der Nationen des Südostens (Cherokee, Muskogee,
  Choctaw, Chickasaw, Seminolen) als eigene, gleich behandelte Flächen auf
  der Karte — sie verschwinden erst mit der Vertreibung, und genau dieses
  Verschwinden erzählt die Bewegung „Trail of Tears". Reservate tragen ihr
  Gründungsjahr im Titel (Pine-Ridge-Reservat, 1889), datierte Zustände ohne
  Wertung. Zwischen Appalachen und Mississippi bleibt 1776 bewusst eine
  Lücke ungefärbt: Land der Nationen des Ohiotals, für das sich keine
  seriöse Grenze zeichnen ließ. Dazu `tests/karte-usa-unabhaengigkeit.mjs`:
  21 Atlas-Landmarken von San José del Cabo bis Provincetown mit einem
  Längengrad Toleranz, sechs Kontrollpunkte abseits jeder Küste — und die
  Aussage des Kapitels als Rechnung: Die Fläche der jungen Nation muss über
  alle drei Phasen wachsen, das spanische bzw. mexikanische Gebiet muss
  schrumpfen und 1890 bei null liegen, die Länder der Haudenosaunee und der
  Südost-Nationen müssen nach 1830 verschwunden sein, das Indianerterritorium
  darf erst ab 1830 auftauchen. Dazu die Tone-Prüfungen: dass die Perspektive
  die feindselige Formulierung in der Unabhängigkeitserklärung, die
  gebrochenen Verträge, die Ausrottung der Büffelherden als Kriegsmittel und
  Wounded Knee als Massaker selbst benennt, dass sie die politische
  Eigenständigkeit der Cherokee und den Widerstand der Seminolen fair
  wiedergibt — und dass keine Quizfrage nach Schuld oder Besitz fragt.
- `npm test` grün (2095 Prüfungen)

Alle zwölf Module — Rom, China, Dschingis Khan, Japan, Israel/Palästina,
Germanen, Königreiche, Mittelalter, Eroberung Amerikas, Dreißigjähriger
Krieg, die USA und Revolution und Napoleon — haben beide Stimmen und eine
echte Synthese.

Frühere Runde (2026-08-13): Runde 12 abgeschlossen (Modul „Der
Dreißigjährige Krieg",
drittes Kapitel des Neuzeit-Bogens; erste Stimme, Karte und Tests):
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
- Runde 12: das zehnte Thema und das dritte Kapitel des Neuzeit-Bogens — „Der
  Dreißigjährige Krieg" (`utils/themen/dreissigjaehriger-krieg.js`,
  registriert als Modul 10). Vorerst nur die Sicht von Kaiser, Fürsten und
  Feldherren (Stimme: Opus) — die Sicht derer, die entschieden. Inhalt: der
  Prager Fenstersturz vom 23. Mai 1618 als förmliche Handlung mit Vorbild von
  1419, der Majestätsbrief von 1609 und der Weiße Berg 1620 samt den 27
  Hinrichtungen und der Enteignung, aus der ein mittlerer Adliger namens
  Wallenstein reich wurde; ein Abschnitt darüber, warum ein Fenstersturz einen
  Krieg auslösen konnte — das Reich als Verband aus über dreihundert
  Herrschaften und die drei Konstruktionsfehler des Augsburger
  Religionsfriedens (die Calvinisten kommen darin nicht vor, der geistliche
  Vorbehalt wurde nicht eingehalten, die Reichsgerichte waren blockiert), dazu
  „cuius regio, eius religio" ausdrücklich als Machtregel gelesen: Wer die
  Konfession wechselt, wechselt die Einnahmen; das Restitutionsedikt 1629 als
  „der Sieg, der zu weit ging" (auch die katholischen Kurfürsten erschraken
  und erzwangen 1630 in Regensburg Wallensteins Entlassung); Wallenstein als
  Kriegsunternehmer mit „Der Krieg ernährt den Krieg", dem
  Kontributionssystem, Stralsund 1628 und dem Ende in Eger 1634; Magdeburg
  1631 mit der offen benannten Rechnung der Entscheider (ein Heer ohne Sold,
  die Plünderung als zugesagter Lohn) und dem ehrlichen „bis heute
  umstritten", wer das Feuer legte; Gustav Adolf 1630–1632 als frommer
  Lutheraner UND Machtpolitiker mit französischem Geld (Bärwalde 1631),
  Breitenfeld, München, Lützen — und dem unbequemen Befund, dass sein Tod fast
  nichts änderte; 1635 der Prager Friede, Richelieu und die Staatsräson,
  Rocroi 1643; ein Abschnitt „Warum dreißig Jahre?" mit vier strukturellen
  Gründen; der Westfälische Friede 1648 mit Normaljahr 1624, Landeshoheit,
  den Gebietsgewinnen, dem Austritt der Niederlande und der Schweiz, der
  Amnestie samt der Ausnahme für die Erblande (Böhmen bekam nichts zurück)
  und der Erklärung, warum er als Geburtsurkunde des neuzeitlichen Europas
  gilt; und zum Schluss vier unbequeme Stellen, die diese Stimme selbst
  ausspricht: die Zahlen mit ihrer Unsicherheit (16–18 auf 10–13 Millionen,
  regional bis zwei Drittel, die meisten Toten durch Hunger und Seuchen), dass
  die Entscheider selbst selten in Lebensgefahr waren, dass die Konfession oft
  Vorwand war — ohne die Gegenbehauptung, der Glaube sei nur Maske gewesen —,
  und dass diese Männer „keine Heiligen und keine Ungeheuer" waren. Hermes
  hat die Sicht der Betroffenen ergänzt (Söldner, Hunger, Pest, Flucht,
  Überleben — mit den eigenen unbequemen Stellen: Hexenverfolgung, Söldner
  aus den eigenen Dörfern, Kriegsgewinnler — und fair zur Gegenseite:
  Gustav Adolf, Wallenstein, der echte Friede von 1648). Die Synthese führt
  beide Stimmen zusammen: wo sie übereinstimmen (dieselben Ereignisse,
  dieselben Zahlen, dieselbe unbequeme Diagnose „Der Krieg ernährt den
  Krieg"), wo sie auseinandergehen (der Maßstab: Feldzüge gegen Winter;
  das Ende: Vertrag gegen erste Ernte; die Schuldfrage) — und übergibt an
  Dein Urteil.
  Die Karte `utils/themen/karten/dreissigjaehriger-krieg.js` ist mit 20
  SVG-Einheiten je Längengrad die feinste der App nach der Levante-Karte
  (Ausschnitt 5° W–30° O, 42–60° N, 700 × 572): Zwischen Breitenfeld und
  Lützen liegen fünfundzwanzig Kilometer, eine gröbere Karte hätte daraus
  einen Fleck gemacht. Küsten von der Bretagne bis zur Newamündung, die ganze
  Ostsee mit Skandinavien (ohne Finnland — es beginnt über dem oberen
  Bildrand), acht Inseln von Rügen bis Saaremaa, vierzehn Flüsse (darunter die
  Moldau und die Saale, an denen dieses Kapitel spielt). Die zentrale
  Festlegung: **Das Reich ist keine Fläche, sondern eine Linie** — die
  Reichsgrenze liegt blass im Untergrund, weil eine eingefärbte Fläche einen
  Staat behaupten würde, den es nicht gab. Drei Phasen (1618 der Aufstand in
  Böhmen / 1631–1632 Magdeburg, Breitenfeld und Lützen / 1648 der Westfälische
  Friede), sieben Info-Punkte (Prag, Wien, Magdeburg, Breitenfeld, Lützen,
  Münster und Osnabrück, Rocroi) und drei Bewegungen (die Kaiserlichen nach
  Magdeburg 1630/31, Gustav Adolf von Usedom über Breitenfeld und Bayern nach
  Lützen, die Franzosen nach Rocroi 1643). Die Fläche der Phase 1631/32 heißt
  im eigenen Titel „kein Staatsgebiet, sondern besetztes Land" — sie zeigt die
  Reichweite eines Heeres.
  Dazu `tests/karte-dreissigjaehriger-krieg.mjs`: 38 Atlas-Landmarken von
  Brest bis zur Newamündung mit 0,6 Grad Toleranz (jede mindestens 0,1 Grad
  neben dem nächsten Eckpunkt des Kartenmoduls), zwölf Kontrollpunkte abseits
  jeder Küste (der erste mitten in Böhmen) — und die Aussage des Kapitels als
  Rechnung: keine Fläche darf „Heiliges Römisches Reich" heißen, die
  Reichsgrenze muss eine offene Linie ohne Füllung sein, Habsburg muss 1648
  kleiner sein als 1618 (die Lausitz), Frankreich größer (das Elsass),
  Schweden darf erst 1648 Gebiet im Reich haben, die Niederlande und die
  Schweiz müssen 1648 als aus dem Reich ausgeschieden benannt sein, und das
  schwedische Vormarschgebiet muss Leipzig, Bayern und Mainz einschließen,
  Böhmen und Wien aber ausschließen (Punkt-im-Vieleck-Probe). Dazu die
  Tone-Prüfungen: dass die Perspektive das Söldnersystem als eigene
  Entscheidung benennt, dass sie zugibt, Menschen als Posten zu führen, dass
  die Zahlen als umstritten gekennzeichnet sind, dass die Beweggründe beider
  Seiten fair wiedergegeben werden — und dass keine Quizfrage nach Schuld
  fragt.
- `npm test` grün (1737 Prüfungen)

Nächste Schritte nach Runde 14:
- **Die Kolonien (ca. 1815–1914)** als nächstes Kapitel. Achtung, das ist neu:
  Der Betreiber hat dieses Kapitel am 14.08.2026 in
  `notizen/kapitel-planung.md` nachgetragen („anfangs vergessenes, aber
  wichtiges Kapitel") — es steht jetzt als Nummer 6 zwischen Napoleon und dem
  Ersten Weltkrieg, der damit Nummer 7 ist. Inhalt und Vorgaben stehen dort;
  besonders zu beachten ist die ausdrücklich verlangte Rolle Großbritanniens
  und die Verbindung zum Ersten Weltkrieg über die Kolonialrivalitäten.
- **Der Weg zum Ersten Weltkrieg (1815–1914)** danach. Vor dem
  Start `notizen/kapitel-planung.md` lesen: Dort steht ausbuchstabiert, dass
  die Kriegsschuldfrage das Herzstück ist, dass die Alleinschuld-These als
  Artikel 231 des Versailler Vertrags gekennzeichnet werden muss und nicht als
  Forschungsstand, dass Quellen aller Mächte heranzuziehen sind — und dass ein
  Abschnitt „Was 1914 uns heute lehrt" dazugehört. Ausdrücklich mehr als zwei
  Stimmen: je Großmacht eine.
- **Am Gerät gegenlesen** (siehe die ältere Liste unten): Mit der
  Napoleon-Karte (700 × 443,4) sind es jetzt zwölf Karten, die rechnerisch
  gegen den Atlas geprüft, aber noch auf keinem Handy gesehen wurden. Die
  Beschriftungen der Napoleon-Karte wurden auf Überlappung geprüft; zwei
  Kollisionen („Spanien" mit dem Info-Punkt Madrid, „Korsika" mit „Elba")
  sind durch Verschieben der beiden Landschaftsnamen behoben. Offen bleibt
  die Frage vom kleinen Bildschirm her: Elba ist bei 14 Einheiten je
  Längengrad nur wenige SVG-Einheiten groß und trägt trotzdem den Anfang
  einer Bewegung.
- **Zeitleisten** — unverändert offen, siehe unten.

Nächste Schritte von Runde 12 (durch Runde 13 und 14 überholt, siehe oben):
- **Am Gerät gegenlesen:** Alle zehn Karten sind rechnerisch gegen den
  Atlas geprüft, aber noch nicht auf einem Handy gesehen. Vor allem
  Schriftgrößen und Trefferflächen der Punkte gehören auf einem kleinen
  Bildschirm beurteilt (`npm start`, Expo Go). Die Extremfälle liegen jetzt
  vor: die Mongolen-Karte mit 700 × 253,5 als flachstes, breitestes Band und
  die Levante-Karte mit 700 × 905,5 als schmalstes, höchstes (Japan
  700 × 584,3, Dreißigjähriger Krieg 700 × 572, Königreiche 700 × 552,5, Rom
  700 × 548, Mittelalter 700 × 495,4, Germanen 700 × 468, Amerika 700 × 423,7,
  China 700 × 400). Ob
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
  `node tools/pruef-dreissigjaehriger-krieg.mjs` meldet sieben mögliche
  Überlappungen, und alle sieben liegen in derselben Landschaft — zwischen
  Magdeburg, Leipzig und Prag, also genau dort, wo dieses Kapitel spielt. Zwei
  davon sind reine Geografie und nicht zu verschieben: Breitenfeld und Lützen
  liegen fünfundzwanzig Kilometer auseinander (knapp acht SVG-Einheiten), und
  Magdeburg liegt auf demselben Breitengrad wie Münster/Osnabrück, dessen
  langer Name nach Osten läuft. Vier gehen auf die Beschriftung „Sachsen"
  zurück, die zwischen drei Ortsnamen dieses Kapitels sitzt. Die Abschätzung
  im Skript ist bewusst großzügig; ob es auf dem Gerät wirklich stört, muss
  das Gerät zeigen. Falls ja, wäre die Antwort dieselbe wie bei der
  Mittelalter-Karte: Ortsnamen erst beim Antippen zeigen — das beträfe alle
  Karten.
- **Zeitleisten** — der zweite Teil von „Geschichte in Bewegung"; die
  Karten decken bisher nur den Raum ab, nicht die Zeit.
- **Weitere Themen** nach `notizen/kapitel-planung.md`, dem Neuzeit-Bogen —
  als Nächstes **die USA: Unabhängigkeit und die Vertreibung der Indianer
  (1776–ca. 1890)**, danach Revolution und Napoleon, der Erste Weltkrieg
  mit der Kriegsschuldfrage, Weimar, der Zweite Weltkrieg. Jeweils die eine
  Sicht von Opus, die andere von Hermes, Synthese gemeinsam; beim Ersten
  Weltkrieg sind ausdrücklich mehr als zwei Stimmen vorgesehen. Karten sind
  dabei optional: Themen ohne `karte` überspringen den Abschnitt.
