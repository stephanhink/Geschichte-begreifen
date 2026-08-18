#!/usr/bin/env node
// Buch-Generator: Module (DE oder DA) -> EPUB (EPUB3, reflowable).
// Nutzung: node tools/buch-epub.cjs <de|da>
//
// Das Buch folgt der App-Reihenfolge (utils/themen/index.js, alleThemen).
// Fuer DA werden die Module aus da/ geladen (gleiche IDs). Karten kommen
// als PNG (tools/…karten-vorschau + rsvg-convert), Cover aus
// ~/Geschichte-Buch/cover-final.png. Vorwort/Quellen aus
// ~/Geschichte-Buch/Einleitung-und-Quellen-DE.md bzw. -DA.md.
//
// EPUB = ZIP mit mimetype (stored, zuerst) + META-INF/container.xml +
// OEBPS/*. Gebaut mit dem System-`zip`.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SPRACHE = process.argv[2] === 'da' ? 'da' : 'de';
const REPO = '/Users/openclaw/Documents/GitHub/Geschichte-begreifen';
const BUCH = '/Users/openclaw/Geschichte-Buch';
const TMP = `/tmp/buch-${SPRACHE}`;
const OEBPS = `${TMP}/OEBPS`;

// ---- Meta ----
const META = {
  de: { titel: 'Geschichte begreifen', untertitel: 'Der Sieger schreibt die Geschichte — aber nicht die ganze.', sprache: 'de', autor: 'Stephan Hink', uuid: 'urn:uuid:9b2f4c1e-7a3d-4e5f-9c1b-2d3e4f5a6b7c' },
  da: { titel: 'Historien forstået', untertitel: 'Sejrherren skriver historien — men ikke hele historien.', sprache: 'da', autor: 'Stephan Hink', uuid: 'urn:uuid:8a1e3d2c-6b4f-4c7e-8d2a-1e3f4a5b6c7d' },
}[SPRACHE];

// ---- Modul-Liste (Buch-Reihenfolge) ----
const ids = [
  'roemisches-reich','china','dschingis-khan','japan','israel-palaestina','germanen',
  'koenigreiche','mittelalter','eroberung-amerikas','dreissigjaehriger-krieg',
  'usa-unabhaengigkeit','revolution-und-napoleon','die-kolonien',
  'weg-zum-ersten-weltkrieg','usa-weltmacht','weimar-ns','zweiter-weltkrieg',
  'kalter-krieg','russland-westen','aufstieg-asiens','ki-gesellschaft',
];

function ladeModul(id) {
  const pfad = SPRACHE === 'da' ? `${REPO}/da/${id}.js` : `${REPO}/utils/themen/${id}.js`;
  return require(pfad);
}

// ---- Markdown-lite (## Ueberschrift, **fett**, Absaetze) ----
// WICHTIG: h4 immer als eigenes Element, NIE innerhalb von <p> (sonst
// invalid XHTML — epubcheck RSC-005; Reader wie ReadEra ignorieren dann
// das Inhaltsverzeichnis).
function md(txt) {
  const escTxt = String(txt)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const zeilen = escTxt.split('\n');
  const out = [];
  let absatz = [];
  const pushAbsatz = () => {
    if (absatz.length) { out.push(`<p>${absatz.join(' ').trim()}</p>`); absatz = []; }
  };
  for (const z of zeilen) {
    const h = z.match(/^##\s+(.+)$/);
    if (h) { pushAbsatz(); out.push(`<h4>${h[1]}</h4>`); }
    else if (z.trim() === '') { pushAbsatz(); }
    else { absatz.push(z.trim()); }
  }
  pushAbsatz();
  return out.join('\n');
}

// Inline-Variante: nur esc + **fett** — KEINE p/h-Elemente (fuer Titel,
// Bildunterschriften, Listenpunkte — ueberall wo inline-HTML gefordert ist).
function mdInline(txt) {
  return String(txt)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^#+\s+/, '')
    .replace(/\n/g, ' ');
}

// ---- Karten als PNG (Cache in /tmp/karten-cache; DA laedt die Karte aus
// dem DE-Modul, die Bildunterschriften aus den karteHinweisen) ----
const kartenskript = '/Users/openclaw/.hermes/skills/autonomous-ai-agents/geschichte-begreifen-workflow/scripts/karten-vorschau.js';
const kartenCache = '/tmp/karten-cache';
function kartenPNGs(modul) {
  const out = [];
  let karte = modul.karte;
  if (!karte && SPRACHE === 'da') {
    try { karte = require(`${REPO}/utils/themen/${modul.id}.js`).karte; } catch (e) { /* kein Karten-Modul */ }
  }
  if (!karte || !Array.isArray(karte.phasen)) return out;
  const ziel = `${OEBPS}/images`;
  fs.mkdirSync(ziel, { recursive: true });
  fs.mkdirSync(kartenCache, { recursive: true });
  karte.phasen.forEach((p, i) => {
    const name = `karte-${modul.id}-phase${i}.jpg`;
    const cache = `${kartenCache}/${name}`;
    const datei = `${ziel}/${name}`;
    if (!fs.existsSync(cache)) {
      try {
        execSync(`node ${kartenskript} ${modul.id} ${i} 2>/dev/null && rsvg-convert -w 900 /tmp/karten-vorschau.svg -o /tmp/karten-tmp.png && sips -s format jpeg -s formatOptions 80 /tmp/karten-tmp.png --out ${cache} >/dev/null 2>&1`, { timeout: 120000 });
      } catch (e) { console.error('  Karte fehlgeschlagen:', modul.id, i); }
    }
    if (fs.existsSync(cache)) {
      fs.copyFileSync(cache, datei);
      const hinweis = SPRACHE === 'da' && modul.karteHinweise && modul.karteHinweise[i]
        ? modul.karteHinweise[i].hinweis : p.hinweis;
      const label = SPRACHE === 'da' && modul.karteHinweise && modul.karteHinweise[i]
        ? modul.karteHinweise[i].label : p.label;
      out.push(`<figure class="karte"><figcaption><strong>${mdInline(label)}</strong> — ${mdInline(hinweis)}</figcaption><img src="images/${name}" alt="${mdInline(label)}"/></figure>`);
    }
  });
  return out;
}

// ---- Ein Kapitel als XHTML ----
function kapitelHTML(modul, nummer) {
  const perspektiven = modul.perspektiven.map((p, i) => {
    const farbe = `p${(i % 4) + 1}`;
    const stimme = p.stimme === 'Opus' ? 'Stimme: Opus (Anthropic)' : 'Stimme: Hermes (DeepSeek)';
    return `<section class="perspektive ${farbe}"><h3>${mdInline(p.name)}</h3><p class="stimme">${stimme}</p>${md(p.text)}</section>`;
  }).join('\n');

  const karten = kartenPNGs(modul).join('\n');
  const kartenBlock = karten ? `<section class="karten"><h2>Geschichte in Bewegung</h2>${karten}</section>` : '';

  const quiz = modul.quiz.map((q, i) => {
    const antworten = q.antworten.map((a, j) =>
      `<li class="${j === q.richtig ? 'richtig' : ''}">${mdInline(a)}${j === q.richtig ? ' ✓' : ''}</li>`).join('');
    return `<div class="quizfrage"><p class="quizfrage-text"><strong>Frage ${i + 1}:</strong> ${mdInline(q.frage)}</p><ul>${antworten}</ul><p class="erklaerung">${mdInline(q.erklaerung)}</p></div>`;
  }).join('\n');

  let autorenwort = '';
  if (modul.autorenwort) {
    const text = typeof modul.autorenwort === 'string' ? modul.autorenwort : modul.autorenwort.text;
    const original = typeof modul.autorenwort === 'string' ? null : modul.autorenwort.original;
    const originalBlock = SPRACHE === 'da' && original ? `<div class="aw-original"><h3>Schlusswort des Autors</h3>${md(original)}</div>` : '';
    const titel = SPRACHE === 'da' ? 'Forfatterens afsluttende ord' : 'Schlusswort des Autors';
    if (!originalBlock) {
      autorenwort = `<section class="autorenwort"><h2>${titel}</h2>${md(text)}<p class="signatur">— Stephan Hink</p></section>`;
    } else {
      autorenwort = `<section class="autorenwort"><h2>${titel}</h2>${originalBlock}<hr/><div class="aw-uebersetzung">${md(text)}</div><p class="signatur">— Stephan Hink</p></section>`;
    }
  }

  return `<section class="kapitel">
<h1 class="kapitel-titel">${nummer}. ${mdInline(modul.titel)}</h1>
<p class="epoche">${mdInline(modul.epoche)}</p>
<section class="aufhaenger"><h2>Die Frage</h2><p class="frage">${mdInline(modul.aufhaenger.frage)}</p>${md(modul.aufhaenger.text)}</section>
${kartenBlock}
<h2>Die Blickwinkel</h2>
${perspektiven}
<section class="synthese"><h2>Synthese</h2>${md(modul.synthese)}</section>
<section class="urteil"><h2>Dein Urteil</h2><p class="frage">${mdInline(modul.urteil.frage)}</p><p>${mdInline(modul.urteil.hinweis)}</p></section>
<section class="quiz"><h2>Stimmt's?</h2>${quiz}</section>
${autorenwort}
</section>`;
}

// ---- Vorwort + Quellen ----
function vorwortHTML() {
  const datei = `${BUCH}/Einleitung-und-Quellen-${SPRACHE.toUpperCase()}.md`;
  const roh = fs.readFileSync(datei, 'utf8');
  const teile = roh.split(/^## /m);
  // Teil 0 = Titel, danach je ein "## ..." block
  const title = teile[0].trim().replace(/^#\s+/, '');
  const sections = teile.slice(1).map((s) => {
    const [head, ...rest] = s.split('\n');
    return `<section><h2>${mdInline(head)}</h2>${md(rest.join('\n'))}</section>`;
  }).join('');
  return `<section class="vorwort"><h1>${mdInline(title)}</h1>${sections}</section>`;
}

// ---- Cover ----
function coverHTML() {
  const cover = `${BUCH}/cover-final.png`;
  const ziel = `${OEBPS}/images/cover.png`;
  if (!fs.existsSync(ziel)) fs.copyFileSync(cover, ziel);
  return `<section class="cover"><img src="images/cover.png" alt="Cover"/></section>`;
}

// ---- Build ----
function build() {
  fs.rmSync(TMP, { recursive: true, force: true });
  fs.mkdirSync(`${OEBPS}/images`, { recursive: true });
  fs.mkdirSync(`${TMP}/META-INF`, { recursive: true });

  // Cover + Vorwort + Quellen
  const kapitel = [];
  kapitel.push({ datei: 'cover.xhtml', html: coverHTML(), titel: 'Cover' });
  kapitel.push({ datei: 'vorwort.xhtml', html: vorwortHTML(), titel: 'Vorwort' });

  ids.forEach((id, i) => {
    const modul = ladeModul(id);
    kapitel.push({ datei: `kapitel-${i + 1}.xhtml`, html: kapitelHTML(modul, i + 1), titel: modul.titel });
  });

  kapitel.forEach((k) => fs.writeFileSync(`${OEBPS}/${k.datei}`, xhtmlRahmen(k.html, k.titel)));

  // OPF
  const manifest = kapitel.map((k, i) =>
    `<item id="k${i}" href="${k.datei}" media-type="application/xhtml+xml"/>`).join('\n');
  const spine = kapitel.map((k, i) => `<itemref idref="k${i}"/>`).join('\n');
  const bilder = fs.readdirSync(`${OEBPS}/images`).filter((f) => f !== 'cover.png').map((f, i) =>
    `<item id="bild${i}" href="images/${f}" media-type="${f.endsWith('.jpg') ? 'image/jpeg' : 'image/png'}"/>`).join('\n');
  const opf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="buch-id" xml:lang="${META.sprache}">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="buch-id">${META.uuid}</dc:identifier>
<dc:title>${META.titel} — ${META.untertitel}</dc:title>
<dc:creator>${META.autor}</dc:creator>
<dc:language>${META.sprache}</dc:language>
<meta property="dcterms:modified">2026-08-18T00:00:00Z</meta>
<meta name="cover" content="cover-image"/>
</metadata>
<manifest><item id="css" href="buch.css" media-type="text/css"/><item id="nav" href="nav.xhtml" properties="nav" media-type="application/xhtml+xml"/><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="cover-image" href="images/cover.png" media-type="image/png" properties="cover-image"/>${manifest}${bilder}</manifest>
<spine toc="ncx">${spine}</spine>
</package>`;
  fs.writeFileSync(`${OEBPS}/content.opf`, opf);

  // Nav (EPUB3)
  const nav = kapitel.map((k, i) => `<li><a href="${k.datei}">${k.titel}</a></li>`).join('\n');
  fs.writeFileSync(`${OEBPS}/nav.xhtml`, `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><head><title>Inhalt</title></head><body><nav epub:type="toc"><h1>Inhalt</h1><ol>${nav}</ol></nav></body></html>`);

  // toc.ncx (EPUB2 — fuer Reader wie ReadEra, die das klassische
  // Inhaltsverzeichnis erwarten)
  const navPoints = kapitel.map((k, i) =>
    `<navPoint id="n${i}" playOrder="${i + 1}"><navLabel><text>${k.titel}</text></navLabel><content src="${k.datei}"/></navPoint>`).join('\n');
  fs.writeFileSync(`${OEBPS}/toc.ncx`, `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
<head><meta name="dtb:uid" content="${META.uuid}"/><meta name="dtb:depth" content="1"/><meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head>
<docTitle><text>${META.titel}</text></docTitle>
<navMap>${navPoints}</navMap>
</ncx>`);

  // container.xml
  fs.writeFileSync(`${TMP}/META-INF/container.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`);

  // mimetype
  fs.writeFileSync(`${TMP}/mimetype`, 'application/epub+zip');

  // CSS
  fs.writeFileSync(`${OEBPS}/buch.css`, css());

  // zip bauen (mimetype zuerst, unkomprimiert — EPUB-Standard)
  const ziel = `${BUCH}/Geschichte-begreifen-${SPRACHE.toUpperCase()}.epub`;
  execSync(`cd ${TMP} && rm -f ${ziel} && zip -X0 ${ziel} mimetype >/dev/null && zip -Xr ${ziel} META-INF OEBPS >/dev/null`);
  console.log('EPUB:', ziel, fs.statSync(ziel).size, 'Bytes');
}

function xhtmlRahmen(inhalt, titel) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${META.sprache}"><head><title>${META.titel} — ${titel}</title><link rel="stylesheet" type="text/css" href="buch.css"/></head><body>${inhalt}</body></html>`;
}

function css() {
  return `body { font-family: Georgia, serif; line-height: 1.55; color: #2b2013; margin: 5% 6%; }
h1 { font-size: 1.8em; } h2 { font-size: 1.35em; margin-top: 1.2em; color: #7C4A03; }
h3 { font-size: 1.15em; margin-top: 1em; } h4 { font-size: 1em; margin-top: 1em; }
p { margin: 0.6em 0; text-align: justify; }
.frage { font-style: italic; font-size: 1.05em; }
.kapitel-titel { margin-bottom: 0.1em; } .epoche { color: #7A6A57; font-style: italic; }
.cover img { width: 100%; }
.karte img { width: 100%; margin: 0.4em 0; }
.karte figcaption { font-size: 0.85em; color: #555; margin-bottom: 0.8em; }
.perspektive { margin: 1.2em 0; padding: 0.6em 1em; border-left: 4px solid #C9A227; background: #FBF4E4; }
.perspektive.p2 { border-left-color: #8C3B2F; background: #FBF0EA; }
.perspektive.p3 { border-left-color: #4F5F3A; background: #F0F2EA; }
.perspektive.p4 { border-left-color: #5A4A78; background: #F1EEF6; }
.stimme { font-size: 0.85em; color: #7A6A57; font-style: italic; }
.synthese { margin: 1.2em 0; padding: 0.6em 1em; border-left: 4px solid #7C4A03; background: #FBF4E4; }
.urteil { margin: 1.2em 0; padding: 0.6em 1em; border-left: 4px solid #5A4A78; background: #F1EEF6; }
.aufhaenger { margin: 1em 0; padding: 0.4em 0.8em; border-left: 4px solid #A96A16; background: #FDF8EC; }
.autorenwort { margin: 1.5em 0; padding: 1em 1.2em; background: #F0F2EA; border-left: 4px solid #3F6B37; }
.autorenwort .aw-original { } .autorenwort .aw-uebersetzung { color: #3F6B37; }
.signatur { font-weight: bold; text-align: right; }
.quiz .richtig { color: #3F6B37; font-weight: bold; }
.erklaerung { font-size: 0.92em; color: #444; }
ul { margin: 0.4em 0 0.8em 1.2em; }`;
}

build();
