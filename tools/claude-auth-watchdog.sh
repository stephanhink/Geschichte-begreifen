#!/bin/bash
# Watchdog: prüft, ob die Claude-Code-OAuth-Session noch gültig ist.
# Meldet sich NUR, wenn die Session abgelaufen ist (sonst still = Watchdog-Muster).
# Aufruf durch Hermes-Cron alle 30 Minuten (no_agent, deliver 'all').
STATUS=$(/Users/stephanhink/.local/bin/claude auth status 2>/dev/null || ~/.local/bin/claude auth status 2>/dev/null)
if ! echo "$STATUS" | grep -q '"loggedIn": true'; then
  echo "⚠️ Claude-Code-Session abgelaufen (loggedIn: false). Bitte ausführen: claude auth login (Konto andreas@hink.de), danach kann die nächste Runde starten."
fi
