#!/usr/bin/env python3
# Podcast-Feed-Generator: erzeugt feed.xml (bzw. feed-da.xml) im
# Hoerbuch-Ordner — RSS 2.0 mit iTunes-Extensions fuer Apple Podcasts,
# Spotify & Co. Nutzung: python3 tools/podcast-feed.py [de|da]
import os, sys, subprocess, datetime

SPRACHE = sys.argv[1] if len(sys.argv) > 1 and sys.argv[1] in ('de', 'da') else 'de'
ROOT = '/Users/openclaw/Geschichte-Buch/Hoerbuch'
HOST = ('https://github.com/stephanhink/Geschichte-begreifen/releases/download/hoerbuch-de-v1'
        if SPRACHE == 'de' else
        'https://github.com/stephanhink/Geschichte-begreifen/releases/download/hoerbuch-da-v1')
AUSGABE = 'feed.xml' if SPRACHE == 'de' else 'feed-da.xml'
REPO = '/Users/openclaw/Documents/GitHub/Geschichte-begreifen'

# Kapitel-Titel aus den Modulen (de: utils/themen, da: da)
import json as _json
TITEL_MAP = {}
try:
    _ids = _json.loads(subprocess.run(['node', '-e',
        "const i=require('%s/utils/themen/index');console.log(JSON.stringify(i.alleThemen.map(t=>t.id)))" % REPO],
        capture_output=True, text=True, cwd=REPO).stdout)
    for _nr, _mid in enumerate(_ids, 1):
        _mp = ('utils/themen/%s' if SPRACHE == 'de' else 'da/%s') % _mid
        _t = _json.loads(subprocess.run(['node', '-e',
            "console.log(JSON.stringify(require('%s').titel))" % ('%s/%s' % (REPO, _mp))],
            capture_output=True, text=True, cwd=REPO).stdout)
        TITEL_MAP[_nr] = _t
except Exception:
    pass

if SPRACHE == 'de':
    TITEL = 'Geschichte begreifen — Das Hörbuch'
    BESCHREIBUNG = ('Die Geschichte der Menschheit aus mehreren Perspektiven — '
                    'von den ersten Königreichen bis zur KI. Das Hörbuch zum '
                    'Buch von Stephan Hink: Jede Perspektive hat ihre eigene '
                    'Stimme. Der Sieger schreibt die Geschichte — aber nicht '
                    'die ganze Geschichte.')
    SPRACHE_CODE = 'de'
else:
    TITEL = 'Historien forstået — Lydbogen'
    BESCHREIBUNG = ('Menneskehedens historie fra flere perspektiver — fra de '
                    'første kongeriger til kunstig intelligens. Lydbogen til '
                    'bogen af Stephan Hink: Hvert perspektiv har sin egen '
                    'stemme. Sejrherren skriver historien — men ikke hele '
                    'historien.')
    SPRACHE_CODE = 'da'

ORDNER = '%s/%s' % (ROOT, SPRACHE.upper())
COVER = '%s/cover.jpg' % ROOT
if not os.path.exists(COVER):
    subprocess.run(['cp', '/Users/openclaw/Geschichte-Buch/cover-final.png', COVER], check=True)

def dauer(datei):
    out = subprocess.run(['ffprobe', '-v', 'quiet', '-show_entries', 'format=duration',
                          '-of', 'csv=p=0', datei], capture_output=True, text=True)
    return int(float(out.stdout.strip()))

def datum(datei):
    t = os.path.getmtime(datei)
    return datetime.datetime.fromtimestamp(t, datetime.timezone.utc).strftime('%a, %d %b %Y %H:%M:%S GMT')

items = []
for f in sorted(os.listdir(ORDNER)):
    if not f.endswith('.mp3'):
        continue
    pfad = '%s/%s' % (ORDNER, f)
    nr = int(f.replace('kapitel-', '').replace('.mp3', ''))
    groesse = os.path.getsize(pfad)
    d = dauer(pfad)
    minuten = d // 60
    sekunden = d % 60
    items.append({
        'nr': nr,
        'titel': TITEL_MAP.get(nr, f.replace('.mp3', '')),
        'url': '%s/%s' % (HOST, f),
        'groesse': groesse,
        'dauer': '%d:%02d' % (minuten, sekunden),
        'datum': datum(pfad),
    })

xml = '''<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/" version="2.0">
<channel>
<title>%s</title>
<link>%s/%s</link>
<description>%s</description>
<language>%s</language>
<itunes:author>Stephan Hink</itunes:author>
<itunes:image href="%s/cover.jpg"/>
<itunes:category text="History"/>
<itunes:explicit>false</itunes:explicit>
''' % (TITEL, HOST, AUSGABE, BESCHREIBUNG, SPRACHE_CODE, HOST)

for it in items:
    xml += '''<item>
<title>%d. %s</title>
<enclosure url="%s" length="%d" type="audio/mpeg"/>
<guid>geschichte-%s-%02d</guid>
<pubDate>%s</pubDate>
<description>Kapitel %d — Länge %s</description>
</item>
''' % (it['nr'], it['titel'], it['url'], it['groesse'], SPRACHE, it['nr'], it['datum'], it['nr'], it['dauer'])

xml += '''</channel>
</rss>
'''

ziel = '%s/%s' % (ROOT, AUSGABE)
with open(ziel, 'w') as f:
    f.write(xml)
print('Feed geschrieben:', ziel, '(%d Kapitel)' % len(items))