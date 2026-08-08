# Geschichte begreifen — Projektregeln

Dieses Dokument ist die verbindliche Projekt-DNA. Es wächst mit dem Projekt
und wird vor jeder Arbeit von Claude Code gelesen. Stand: 2026-08-08
(Projekt-Setup, noch keine Inhalte).

## Ziel und Zielgruppe

**Arbeitshypothese (wird mit dem Betreiber präzisiert):** Die App „Geschichte
begreifen" macht historische Themen für Kinder und Jugendliche interaktiv
begreifbar — analog zum Schwesterprojekt „Mathe begreifen". Der konkrete
Inhalt (Epochen, Themen, Aufgabentypen) wird nach dem Setup mit dem
Betreiber festgelegt und hier dokumentiert.

## Tech-Stack (bewusste Entscheidungen)

- **Expo SDK 57 / React Native / JavaScript** — wie „Mathe begreifen". Kein
  TypeScript: niedrigere Einstiegshürde, gleiche Codebasis-Pflege.
- **Fachlogik in `utils/` ohne UI** — mit blankem `node` prüfbar
  (Architektur-Regel, siehe unten).
- **Lokaler State via `@react-native-async-storage/async-storage`** —
  Lernfortschritt bleibt auf dem Gerät, keine Accounts, kein Netzwerk
  (datenschutzfreundlich; die Datenschutzerklärung in `docs/` lebt davon).
- **EAS Build remote-Credentials** (`credentialsSource: "remote"`): Keystore
  liegt bei EAS (@heilpraktikerdk/geschichte), Backup lokal unter
  `~/Documents/GitHub/@heilpraktikerdk__geschichte-keystore-backup/` und in
  `credentials/` (beides gitignored).

## Architektur-Regel

**Fachlogik gehört in `utils/` — ohne UI-Importe, mit blankem `node`
prüfbar.** React-Komponenten (`components/`, `screens/`) bleiben dünn: sie
holen Daten aus den utils, stellen sie dar und reichen Eingaben zurück.
Diese Regel hält die App testbar und den Kopf frei für den Inhalt.

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

Stand: 2026-08-08 — Projekt-Setup abgeschlossen:
- Expo-SDK-57-Grundgerüst (package.json, App.js, app.json, eas.json)
- GitHub-Repo public: https://github.com/stephanhink/Geschichte-begreifen
  (Pages-Workflow aktiv, docs/ mit Datenschutz-Platzhalter)
- EAS-Projekt @heilpraktikerdk/geschichte + Android-Keystore angelegt
  (remote + lokales Backup), Platzhalter-Assets
- `npm test` grün (Smoke-Tests in tests/alle.mjs)

Nächster Schritt: Inhalt mit dem Betreiber besprechen (Zielgruppe, Epochen,
Aufgabentypen), dann erste Claude-Code-Runde. Vorher muss der Betreiber
`claude auth login` ausführen (Konto andreas@hink.de).
