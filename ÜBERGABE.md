# ÜBERGABE — Server-Umstellung auf den M1 (24/7)

Stand: 2026-08-13, erstellt vor der Umstellung vom M5 auf den M1-Server.
Diese Notiz beschreibt den Zustand des Projekts und die Aufgaben der
ersten Session auf dem M1. Sie liegt im Repo, damit die neue Session
(sie hat keine Vorgeschichte) alles Nötige findet.

## Projekt

- **App**: „Geschichte begreifen" — multiperspektivische Geschichts-
  Lern-App, Klasse 5–13, Deutsch, Expo SDK 57, JavaScript.
- **Leitidee**: „Der Sieger schreibt die Geschichte" — mehrere
  Perspektiven nebeneinander, Synthese, eigenes Urteil.
- **Lernformat**: Aufhänger → Karte („Geschichte in Bewegung") →
  Perspektiven → Synthese → Dein Urteil → Quiz („Stimmt's?").
- **Repo**: https://github.com/stephanhink/Geschichte-begreifen (public)
- **EAS-Projekt**: @heilpraktikerdk/geschichte, projectId 1d4700a7-…
  (Keystore remote bei EAS; lokales Backup existiert auf dem M5 unter
  ~/Documents/GitHub/@heilpraktikerdk__geschichte-keystore-backup/ —
  NICHT übertragen, bleibt Backup am M5.)

## Fertige Module (8, alle mit 2 Perspektiven + Synthese + Karte + Tests)

1. Römisches Reich · 2. China · 3. Dschingis Khan · 4. Japan ·
5. Israel/Palästina (israelisch + palästinensisch) ·
6. Germanen (römisch + germanisch) · 7. Königreiche (Chronisten + Dörfer) ·
8. Mittelalter (alte Ordnung + Städte) — „Vom Mittelalter zur Neuzeit",
   erster Teil des Neuzeit-Bogens.

Teststand: **1318 Prüfungen grün** (npm test). Letzter Commit: Runde 10.

## Planung (Neuzeit-Bogen) — notizen/kapitel-planung.md LESEN!

9 Kapitel nach dem Mittelalter: Eroberung Amerikas (1492, Indigene),
Dreißigjähriger Krieg, USA-Unabhängigkeit + Indianer-Vertreibung (vor
Napoleon), Revolution + Napoleon, Weg zum 1. WK (KRIEGSSCHULDFRAGE
multiperspektivisch, Quellen aller Mächte, Abschnitt „Was 1914 uns
heute lehrt"), USA-Weltmacht, Weimar/NS, 2. WK.

## Regeln (aus CLAUDE.md)

- **Zwei-Bediener-Regel**: Vor jeder Arbeit .claude/wip.md lesen, nach
  Abschluss aktualisieren. Es arbeitet immer nur eine Instanz.
- **Keine Git-Operationen durch Opus (Claude Code)**: commit/push macht
  Hermes NACH expliziter Freigabe des Betreibers.
- **Prompt-Übergabe immer als Datei** (/tmp/prompt-rundeN.txt) via
  `claude -p "$(cat /tmp/prompt-rundeN.txt)"` — nie inline (zsh-Quoting).
- **npm test ist der Torwächter**; neue Tests in tests/alle.mjs
  registrieren. Keine neuen npm-Pakete.
- **Opus schreibt in jeder Runde NUR die erste Perspektive** + vorläufige
  Synthese; Hermes ergänzt die zweite Perspektive + die echte Synthese
  NACH der Runde (dann ggf. Test anpassen — Muster der Runden 4–7).
- Stimmen-Verteilung: Opus = westlich/erste Sicht, Hermes = zweite Sicht
  (chinesisch/palästinensisch/germanisch/Dörfer/Städte — je nach Thema;
  die Zusatzregel für sensible Themen und Themen ohne West-Ost-Achse
  steht in CLAUDE.md und in den Runden-Prompts).

## Aufgaben der ersten Session auf dem M1 (der Reihe nach)

1. Umgebung prüfen: `git --version`, `node --version`, `gh auth status`,
   `claude auth status` (gh muss eingeloggt sein: stephanhink).
2. Repo klonen (in das Verzeichnis, in dem die anderen Repos liegen,
   z. B. ~/Documents/GitHub/): `git clone
   https://github.com/stephanhink/Geschichte-begreifen.git` — Achtung:
   der Ordnername enthält ein Leerzeichen („Geschichte begreifen").
3. `npm install` + `npm test` → alle 1318 Prüfungen grün.
4. Diese Notiz + CLAUDE.md + wip.md + notizen/kapitel-planung.md lesen.
5. **Skills + Memories vom M5 übertragen** (der M5 läuft noch): per
   `tailscale status` die Tailscale-IP des M5 ermitteln, dann rsync:
   - `rsync -av stephanhink@<M5-IP>:~/.hermes/skills/ ~/.hermes/skills/`
   - `rsync -av stephanhink@<M5-IP>:~/.hermes/profiles/default/memories/ ~/.hermes/profiles/default/memories/`
   - `rsync -av stephanhink@<M5-IP>:~/.hermes/scripts/claude-auth-watchdog.sh ~/.hermes/scripts/` (falls nicht vorhanden — das Skript liegt auch unter tools/ im Repo)
   Falls SSH zum M5 nicht klappt: dem Betreiber die exakten Befehle
   nennen, er führt sie auf dem M5 aus.
6. **Watchdog einrichten**: ~/.hermes/scripts/claude-auth-watchdog.sh
   (aus tools/ im Repo kopieren), chmod +x, Cron-Job anlegen
   (alle 30 Min, still bei ok, Warnung bei abgelaufener Claude-Session;
   Muster: no_agent-Skript-Cron, deliver 'all').
7. **Claude Code Login**: `claude auth status` — falls nicht eingeloggt,
   dem Betreiber sagen, er muss `claude auth login` ausführen
   (Konto andreas@hink.de). Runden starten erst NACH dem Login.
8. Abschlussbericht an den Betreiber: was fertig ist, was er tun muss
   (Login, ggf. rsync), und die Empfehlung für die nächste Runde
   (Neuzeit-Bogen Kapitel 2: Eroberung Amerikas — siehe
   notizen/kapitel-planung.md).

## Stolpersteine (aus der Erfahrung der Runden 1–10)

- **Nächtliche Wrapper (sleep + --continue) sind unzuverlässig**: auf
  dem M5 hat macOS sie pausiert. Auf dem M1 (24/7, kein Deckel) können
  sie wieder genutzt werden — aber der bewährte Weg ist: Runde starten
  und sie laufen lassen; bei Session-Limit (5h-Fenster) den Zwischen-
  stand sichern und nach dem Reset direkt `claude --continue` starten.
- **OAuth-Session von Claude Code läuft ab** (auch wenn `claude auth
  status` loggedIn meldet): Der Watchdog warnt; dann `claude auth
  login` durch den Betreiber.
- **Wochen-/Session-Limits**: „You've hit your session limit · resets
  …" — Zwischenstand sichern (Karte liegt oft schon, Modul + Tests
  fehlen), nach dem Reset `--continue` starten.
- **Veraltete Modul-Tests** nach der Hermes-Perspektiven-Ergänzung:
  Test erwartet den Zwischenstand → auf finale Fassung anpassen
  (Muster in Runde 4–7; die Tests der Runden 8–10 sind bereits
  zustands-tolerant gebaut).

## Konten

- GitHub: stephanhink (143619594+stephanhink@users.noreply.github.com)
- Claude Pro: andreas@hink.de (OAuth; Login pro Maschine nötig)
- EAS/Expo: owner heilpraktikerdk (für Builds, nicht für Runden nötig)
- Tailscale: M1-Server und M5-Client verbunden
