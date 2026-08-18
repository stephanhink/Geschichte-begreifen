#!/usr/bin/env python3
# Hörbuch-Generator: Module -> Kapitel-MP3s (eine feste Stimme pro
# Perspektive, edge-tts). Nutzung: python3 tools/hoerbuch.py de|da
import asyncio, json, os, re, subprocess, sys, wave
from multiprocessing import Pool
from piper import PiperVoice
import edge_tts

SPRACHE = sys.argv[1] if len(sys.argv) > 1 and sys.argv[1] in ('de', 'da') else 'de'
REPO = '/Users/openclaw/Documents/GitHub/Geschichte-begreifen'
AUSGABE = '/Users/openclaw/Geschichte-Buch/Hoerbuch/' + SPRACHE.upper()
TMP = '/tmp/hoerbuch-' + SPRACHE
COVER = '/Users/openclaw/Geschichte-Buch/cover-final.png'

if SPRACHE == 'de':
    STIMMEN = {
        'erzaehler': '/tmp/piper-model/de_DE-thorsten-high.onnx',
        'p1': '/tmp/piper-model/de_DE-thorsten-high.onnx',
        'p2': '/tmp/piper-model/de_DE-thorsten-high.onnx',
        'p3': '/tmp/piper-model/de_DE-thorsten-high.onnx',
        'p4': '/tmp/piper-model/de_DE-thorsten-high.onnx',
        'autorenwort': '/tmp/piper-model/de_DE-thorsten-high.onnx',
    }
    ALBUM = 'Geschichte begreifen'
else:
    # Daenisch: Christel durchgehend (Betreiber-Entscheid 18.08. — die
    # beste konsistente Qualitaet; alle Rollen mit derselben Stimme).
    STIMMEN = {
        'erzaehler': 'da-DK-ChristelNeural',
        'p1': 'da-DK-ChristelNeural',
        'p2': 'da-DK-ChristelNeural',
        'p3': 'da-DK-ChristelNeural',
        'p4': 'da-DK-ChristelNeural',
        'autor': 'da-DK-ChristelNeural',
    }
    ALBUM = 'Historien forstået'

def text_bereinigen(t):
    t = re.sub(r'\*\*(.+?)\*\*', r'\1', t)
    t = re.sub(r'^##\s+', '', t, flags=re.M)
    t = t.replace('„', '"').replace('“', '"').replace('–', '-')
    t = re.sub(r'\n{2,}', '\n', t).strip()
    return t

PIPER_STIMMEN = {}

def _tts_job(args):
    pfad, text, stimme = args
    tts(text, pfad, stimme)
    return pfad

def tts(text, pfad, stimme):
    if SPRACHE == 'de':
        if stimme not in PIPER_STIMMEN:
            PIPER_STIMMEN[stimme] = PiperVoice.load(stimme)
        wav_pfad = pfad + '.wav'
        with wave.open(wav_pfad, 'wb') as w:
            PIPER_STIMMEN[stimme].synthesize_wav(text, w)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'quiet', '-i', wav_pfad,
                        '-codec:a', 'libmp3lame', '-qscale:a', '3', pfad], check=True)
        os.remove(wav_pfad)
    else:
        for versuch in range(4):
            try:
                com = edge_tts.Communicate(text, stimme)
                asyncio.run(com.save(pfad))
                if os.path.getsize(pfad) > 500:
                    return
            except Exception:
                pass
            import time as _t
            _t.sleep(3 * (versuch + 1))
        raise RuntimeError('TTS fehlgeschlagen: %s' % stimme)

def lade_modul(mid):
    modulpfad = ('utils/themen/%s' if SPRACHE == 'de' else 'da/%s') % mid
    js = ("const m=require('%s/%s');"
          "console.log(JSON.stringify({titel:m.titel,epoche:m.epoche,"
          "aufhaenger:m.aufhaenger,perspektiven:m.perspektiven.map(p=>({name:p.name,text:p.text})),"
          "synthese:m.synthese,urteil:m.urteil,quiz:m.quiz,autorenwort:m.autorenwort}))"
          % (REPO, modulpfad))
    out = subprocess.run(['node', '-e', js], capture_output=True, text=True, cwd=REPO)
    if out.returncode != 0:
        print('FEHLER beim Laden von', mid, out.stderr[:200]); sys.exit(1)
    return json.loads(out.stdout)

def abschnitte(modul):
    """Liefert Liste von (stimme, text) fuer ein Kapitel."""
    a = []
    intro = '%s. %s.' % (modul['titel'], modul['epoche'])
    a.append(('erzaehler', intro))
    a.append(('erzaehler', 'Die Frage: ' + modul['aufhaenger']['frage']))
    a.append(('erzaehler', text_bereinigen(modul['aufhaenger']['text'])))
    for i, p in enumerate(modul['perspektiven']):
        a.append(('p%d' % (i + 1), text_bereinigen(p['name'] + '. ' + p['text'])))
    a.append(('erzaehler', 'Synthese. ' + text_bereinigen(modul['synthese'])))
    u = modul['urteil']
    a.append(('erzaehler', 'Dein Urteil. ' + text_bereinigen(u['frage'] + ' ' + u['hinweis'])))
    quiz = 'Stimmt es? '
    for i, q in enumerate(modul['quiz']):
        quiz += ('Frage %d: %s. Antworten: %s. Richtig ist: %s. %s. '
                 % (i + 1, text_bereinigen(q['frage']),
                    ' '.join(text_bereinigen(x) for x in q['antworten']),
                    text_bereinigen(q['antworten'][q['richtig']]),
                    text_bereinigen(q['erklaerung'])))
    a.append(('erzaehler', quiz))
    if modul.get('autorenwort'):
        aw = modul['autorenwort']
        txt = aw.get('text') if isinstance(aw, dict) else aw
        a.append(('autor', text_bereinigen(txt) + ' Mit besten Grüßen, Stephan Hink.'))
    return a

def konvertiere(kapitel_nr, modul, abschnitte_liste):
    """Generiert MP3s und fuegt sie zur Kapitel-MP3 zusammen."""
    dateien = []
    jobs = [('%s/%s-%d.mp3' % (TMP, kapitel_nr, i), text, STIMMEN[stimme])
            for i, (stimme, text) in enumerate(abschnitte_liste)]
    with Pool(4) as pool:
        for pfad in pool.map(_tts_job, jobs):
            dateien.append(pfad)
    liste = '%s/%s-liste.txt' % (TMP, kapitel_nr)
    with open(liste, 'w') as f:
        for d in dateien:
            f.write("file '%s'\n" % d)
    ziel = '%s/kapitel-%02d.mp3' % (AUSGABE, kapitel_nr)
    titel = '%d. %s' % (kapitel_nr, modul['titel'])
    subprocess.run(['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', liste,
                    '-i', COVER, '-map', '0:a', '-map', '1:v', '-c:a', 'copy',
                    '-c:v', 'mjpeg', '-id3v2_version', '3',
                    '-metadata', 'title=' + titel,
                    '-metadata', 'artist=Stephan Hink',
                    '-metadata', 'album=' + ALBUM,
                    '-metadata', 'track=' + str(kapitel_nr),
                    ziel],
                   capture_output=True)
    return ziel

def main():
    ids = json.loads(subprocess.run(['node', '-e',
        "const i=require('%s/utils/themen/index');console.log(JSON.stringify(i.alleThemen.map(t=>t.id)))" % REPO],
        capture_output=True, text=True, cwd=REPO).stdout)
    os.makedirs(AUSGABE, exist_ok=True)
    os.makedirs(TMP, exist_ok=True)
    for nr, mid in enumerate(ids, 1):
        ziel = '%s/kapitel-%02d.mp3' % (AUSGABE, nr)
        if os.path.exists(ziel) and os.path.getsize(ziel) > 100000:
            print('Kapitel %02d uebersprungen (vorhanden)' % nr, flush=True)
            continue
        modul = lade_modul(mid)
        teile = abschnitte(modul)
        ziel = konvertiere(nr, modul, teile)
        print('Kapitel %02d fertig: %s (%.1f MB)' % (nr, modul['titel'],
              os.path.getsize(ziel) / 1048576), flush=True)
    print('FERTIG:', AUSGABE)

if __name__ == '__main__':
    main()