#!/usr/bin/env python3
# Genspark-TTS-Vorlagen: Module -> Textdateien zum Einfuegen in die
# Genspark-Web-App (ai-text-to-speech). Nutzung: python3 tools/genspark-texte.py de
import json, os, re, subprocess, sys

REPO = '/Users/openclaw/Documents/GitHub/Geschichte-begreifen'
AUSGABE = '/Users/openclaw/Geschichte-Buch/Genspark-Texte'
SPRACHE = sys.argv[1] if len(sys.argv) > 1 else 'de'

def text_bereinigen(t):
    t = re.sub(r'\*\*(.+?)\*\*', r'\1', t)
    t = re.sub(r'^##\s+', '', t, flags=re.M)
    t = re.sub(r'\n{2,}', '\n\n', t).strip()
    return t

def lade_modul(mid):
    modulpfad = ('utils/themen/%s' if SPRACHE == 'de' else 'da/%s') % mid
    js = ("const m=require('%s/%s');"
          "console.log(JSON.stringify({titel:m.titel,epoche:m.epoche,"
          "aufhaenger:m.aufhaenger,perspektiven:m.perspektiven.map(p=>({name:p.name,stimme:p.stimme,text:p.text})),"
          "synthese:m.synthese,urteil:m.urteil,quiz:m.quiz,autorenwort:m.autorenwort}))") % (REPO, modulpfad)
    out = subprocess.run(['node', '-e', js], capture_output=True, text=True, cwd=REPO)
    return json.loads(out.stdout)

def kapitel_text(modul, nr):
    teile = []
    teile.append('Kapitel %d: %s (%s)' % (nr, modul['titel'], modul['epoche']))
    teile.append('')
    teile.append('Die Frage: %s' % modul['aufhaenger']['frage'])
    teile.append('')
    teile.append(text_bereinigen(modul['aufhaenger']['text']))
    for i, p in enumerate(modul['perspektiven'], 1):
        teile.append('')
        teile.append('Perspektive %d: %s' % (i, p['name']))
        teile.append('')
        teile.append(text_bereinigen(p['text']))
    teile.append('')
    teile.append('Synthese')
    teile.append('')
    teile.append(text_bereinigen(modul['synthese']))
    teile.append('')
    teile.append('Dein Urteil: %s' % modul['urteil']['frage'])
    teile.append('')
    teile.append(text_bereinigen(modul['urteil']['hinweis']))
    if modul.get('quiz'):
        teile.append('')
        teile.append('Stimmt das? Die Quizfragen:')
        for i, q in enumerate(modul['quiz'], 1):
            richtig = q['antworten'][q['richtig']]
            teile.append('')
            teile.append('Frage %d: %s' % (i, q['frage']))
            for a in q['antworten']:
                teile.append('- %s' % a)
            teile.append('Richtig ist: %s. %s' % (richtig, q['erklaerung']))
    aw = modul.get('autorenwort')
    if aw:
        teile.append('')
        teile.append('Schlusswort des Autors')
        teile.append('')
        teile.append(text_bereinigen(aw.get('text', '') or ''))
        if aw.get('original'):
            teile.append('')
            teile.append('Das Schlusswort im Original:')
            teile.append('')
            teile.append(text_bereinigen(aw['original']))
    return '\n'.join(teile)

def main():
    ids = json.loads(subprocess.run(['node', '-e',
        "const i=require('%s/utils/themen/index');console.log(JSON.stringify(i.alleThemen.map(t=>t.id)))" % REPO],
        capture_output=True, text=True, cwd=REPO).stdout)
    ziel = os.path.join(AUSGABE, SPRACHE.upper())
    os.makedirs(ziel, exist_ok=True)
    for nr, mid in enumerate(ids, 1):
        modul = lade_modul(mid)
        txt = kapitel_text(modul, nr)
        pfad = os.path.join(ziel, 'kapitel-%02d.txt' % nr)
        with open(pfad, 'w', encoding='utf-8') as f:
            f.write(txt)
        print('Kapitel %02d: %s (%d Zeichen)' % (nr, modul['titel'], len(txt)))
    print('FERTIG:', ziel)

if __name__ == '__main__':
    main()