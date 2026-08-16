# STAND — Geschichte begreifen (Notfall-Anker & Übergabe)

Stand: 2026-08-16, ~11:00 (Copenhagen). Diese Datei sichert den
vollständigen Projektzustand, damit nach einer verlorenen/kompaktierten
Session nichts verloren geht. Sie wird bei wichtigen Änderungen aktualisiert.

## Projekt

- Repo: github.com/stephanhink/Geschichte-begreifen (public), main.
  Lokal: /Users/openclaw/Documents/GitHub/Geschichte-begreifen (M1-Server).
- App: React Native / Expo SDK 57 (JavaScript, CommonJS, `npm test` als
  Torwächter). Projekt-DNA: CLAUDE.md (verbindlich). Betreiber-Planung:
  notizen/kapitel-planung.md (13 Kapitel Neuzeit-Bogen + ältere Module).
- Ablauf in „Runden": Opus (P1, `claude -p` mit Prompt-Datei) schreibt die
  erste Perspektive, Hermes (P2) ergänzt weitere Stimmen + finale Synthese;
  dann npm test → Karten-Vorschau → Betreiber-Freigabe → Commit/Push.
  Prompts liegen in .claude/prompt-rundeN.txt (NICHT /tmp — Opus-Sessions
  haben eine Sandbox ohne /tmp-Zugriff seit 15.08.).
- Zwei-Bediener-Regel: Commit nur nach ausdrücklicher Freigabe („ja
  Freigabe und commit und push"). Betreiber kann zeitlich begrenzte
  Vollmachten erteilen (wip.md dokumentiert sie).

## Commit-Kette (HEAD = letzter Stand)

bffb5b2 Runde 19: Der Zweite Weltkrieg (Besiegte + Sowjetunion mit
        Hauptlast + Westmaechte-Sicht) mit Europa-Karte 1939-1945
bbb35a6 Planung: Demuetigung von 1871 und Kette Versailles->Hitler
3f2d218 Planung: Neuzeit-Bogen auf 13 Kapitel erweitert (2. WK mit
        sowjetischer Hauptlast, Kalter Krieg + 2+4, Russland/Westen,
        Aufstieg Asiens) + Status Runde 18
eebecc0 Korrektur: Reichsgruendung 1871 praezisiert
883ebac Runde 18: Weimarer Republik und der Weg in die Diktatur
0e4f16d Runde 17: Die USA — Aufstieg zur Weltmacht
c5d6f01 Runde 16: Der Weg zum Ersten Weltkrieg (Kriegsschuldfrage)
… (davor: Runden 11–15: 4b12811, 1f6a791, b34e92c, 49777cf, 2b53cae)

## Module (18 fertig, utils/themen/<id>.js)

roemisches-reich, china, dschingis-khan, japan, israel-palaestina,
germanen, koenigreiche, mittelalter, eroberung-amerikas,
dreissigjaehriger-krieg, usa-unabhaengigkeit, revolution-und-napoleon,
die-kolonien, weg-zum-ersten-weltkrieg, usa-weltmacht, weimar-ns,
zweiter-weltkrieg (3 Stimmen: Besiegte/Opus, Sowjetunion/Hermes mit
Hauptlast — 27 Mio. Tote nach Krivosheev, Westmaechte/Hermes).

Offen (Runden 20–22, Kapitel 11–13 der Planung):
- 20: Die neue Weltordnung und der Kalte Krieg (1945–1991) — Prompt liegt
  in .claude/prompt-runde20.txt (Westen-Sicht von Opus; Osten + Deutsche
  in Ost/West von Hermes danach; 2+4-Vertrag prominent; Zusammenbruch
  des Ostblocks; Luftbrücke, Kubakrise, Helsinki).
- 21: Russland und der Westen (1991–heute) — Jelzin/Anarchie, Putin
  OBJEKTIV (Stabilisierung + autoritäre Wende), NATO-Osterweiterung
  (Baker-Versprechen „not one inch eastward" vs. offene Tür).
- 22: Der Aufstieg Asiens und die Zukunft des Westens (Abschluss, offen
  bleiben) — Japan, Korea, Taiwan (TSMC), China, Indien; die Frage
  „Deutschland ein sterbendes Land?" fair (absolut stark, relativ
  schwächer).

## Auth (Claude Code, wichtig!)

- Keychain-Weg (GELÖST seit 14.08.): Login via CHAT-WORKFLOW — Hermes
  startet `claude auth login` im Hintergrund-PTY, URL kommt in den Chat,
  Betreiber autorisiert im Browser, Code in den Chat, Hermes gibt ihn ein,
  „Login successful" → Keychain persistiert headless.
- NIE ~/.claude/.credentials.json blind löschen (kostete am 14.08. einen
  Token). Kein CLAUDE_CODE_OAUTH_TOKEN-Workaround mehr nötig.
- Token-Laufzeit ~8 h; `auth status` kann „loggedIn: true" zeigen, obwohl
  der Token serverseitig tot ist → echter Test: `claude -p "Antworte nur
  mit OK"`. Watchdog-Cron a37345199eac (alle 30 Min, deliver origin/Desktop).
- Limits: 5-h-Session-Fenster („session limit · resets <zeit>") UND
  wöchentliches Opus-Budget („weekly limit · resets 1am" — am 16.08.2026
  erreicht, Reset 17.08. 01:00). Bei „session limit": Auth ok, Continue-
  Cron auf die Reset-Zeit legen. Bei „weekly limit": Runde startet erst
  nach dem Reset (1:00 nachts).
- Runden-Skripte: ~/.hermes/scripts/rundeN-start.sh / rundeN-continue.sh
  (Muster: unset CLAUDE_CODE_OAUTH_TOKEN, Auth-Mini-Test, claude -p
  "$(cat .claude/prompt-rundeN.txt)" --model opus --allowedTools
  'Read,Edit,Write,Bash(npm test),Bash(node*)' --max-turns 60).
- Opus-Sandbox: --continue-Sessions können /tmp NICHT lesen → Prompts und
  Hinweise immer ins Projektverzeichnis (.claude/) legen.

## Betreiber-Vorgaben (verbindlich, aus Planung/CLAUDE.md)

- Neuzeit-Schwerpunkt: Ordnung nach dem 2. WK (Hauptlast der Sowjetunion
  prominent — Zahlen nach Krivosheev ~27 Mio. gesamt, ~8,7–11 Mio.
  Soldaten; „20-Millionen-Zahl" = ältere sowjetische Angabe), NATO vs.
  Warschauer Pakt, Grenze durch Deutschland, Zusammenbruch 1989/91
  (warum: Planwirtschaft, Rüstungslast, Ölpreisverfall 1986,
  Gorbatschow, Samtene Revolutionen), Russland unter Putin OBJEKTIV,
  NATO-Osterweiterung/Baker, 2+4-Vertrag (Bedeutung + Einhaltung: formal
  ja, Art. 7; Debatte in Kap. 12).
- 1871-Demütigung (Frankreich griff an, Kaiserproklamation in Versailles,
  Rache 1919 im selben Spiegelsaal) + Kette Versailles→Hyperinflation→
  Hitler prominent (Rote Linie durch den Bogen: 1871→1919→1923→1933→1939).
- Buch-Projekt: nach Fertigstellung EPUB3 (DE + DA, Mona!), PDF (A4),
  Hörbuch (TTS, eine Stimme pro Perspektive; da-DK ChristelNeural
  existiert), Amazon KDP mit KI-Offenlegung (Betreiber will transparent
  die Modelle nennen: Opus/Anthropic + DeepSeek/Hermes). **ENGLISCHE
  Version später** (Betreiber-Vorgabe 16.08.: internationale
  Veröffentlichung — Übersetzungs-Pipeline erweitert um EN).
  Übersetzungen: da/ im Repo (CommonJS-Module, gleiche Struktur wie
  utils/themen/*.js + karteHinweise-Array). Demo-PDFs:
  /tmp/kapitel-demo-de.pdf + /tmp/kapitel-demo-da.pdf; Export-Skripte:
  /tmp/modul-zu-html.cjs (de|da), /tmp/html-zu-pdf.py.
- Dänisch: Alle Kapitel sollen auf Dänisch erscheinen (Mona liest mit) —
  Übersetzungs-Pipeline nach Fertigstellung.

## Werkzeuge & Pfade

- Skill: ~/.hermes/skills/autonomous-ai-agents/geschichte-begreifen-
  workflow/ (enthält Login-Workflow, Runden-Muster, karten-vorschau.js,
  themen-vorschau.js).
- Vorschau: node <skill>/karten-vorschau.js <thema> <phase> → /tmp/karten-
  vorschau.svg → rsvg-convert -w 1400 → PNG; Demo-PDFs via Playwright
  (python3 /tmp/html-zu-pdf.py <html> <pdf> [checkwörter]).
- Keychain-Leser: /tmp/read_keychain.py (zeigt expiresAt, aktualisiert
  /tmp/credentials.backup.json).
- wip.md (gitignored) im Repo: wer arbeitet woran + Vollmachten.

## Offene Punkte

- Runde 20 wartet auf das Wochenlimit-Reset (17.08. 01:00) + frischen
  Login (Token ~8 h). Optionen mit Betreiber klären (Nacht-Cron 1:00 vs.
  morgen früh vs. heute dänische Übersetzungen).
- Runde-19-Hermes-Pass ist DONE (3 Stimmen) — bffb5b2 committet.
- Karten-Vorschau Runde 19: /tmp/karte-2wk-phase0..2.png.
- Telegram-Zustellung: seit 16.08. deliver=origin (Desktop-App) +
  telegram:902266104 (STEPHAN — der Betreiber, gewünscht). NICHT
  verwenden: telegram:31557334:68355 (Andreas' Chat — war der Fehler
  vom 15.08.).
