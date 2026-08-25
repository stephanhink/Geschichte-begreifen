#!/usr/bin/env node
// Rendert die ENGLISCHEN Karten: DE-Geometrie (utils/themen/karten/*) +
// EN-Texte (en/karten.js) -> SVGs -> JPEGs (900px) nach /tmp/karten-cache-en/
const fs = require('fs');
const { execSync } = require('child_process');
const { KARTENFARBEN, pfeilspitze } = require('../utils/karte-geo.js');
const ids = require('../utils/themen/index.js').alleThemen.map(t => t.id);
const enKarten = require('../en/karten.js');

const cache = '/tmp/karten-cache-en';
fs.mkdirSync(cache, { recursive: true });

function renderSVG(karte, phase) {
  const teile = [];
  teile.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${karte.breite} ${karte.hoehe}">`);
  for (const el of karte.basis || []) {
    teile.push(`  <path d="${el.d}" fill="${el.fill}" stroke="${el.stroke || 'none'}" stroke-width="${el.strokeWidth || 0}"/>`);
  }
  for (const flaeche of phase.flaechen || []) {
    teile.push(`  <path d="${flaeche.d}" fill="${KARTENFARBEN.reich}" fill-opacity="0.7" stroke="${KARTENFARBEN.reichRand}" stroke-width="2"/>`);
  }
  for (const bewegung of karte.bewegungen || []) {
    const punkte = [bewegung.von, ...(bewegung.ueber || []), bewegung.nach];
    const farbe = KARTENFARBEN.bewegung[0];
    let d = `M ${punkte[0][0]} ${punkte[0][1]}`;
    for (let p = 1; p < punkte.length; p += 1) d += ` L ${punkte[p][0]} ${punkte[p][1]}`;
    teile.push(`  <path d="${d}" fill="none" stroke="${farbe}" stroke-width="3" stroke-dasharray="7,5" stroke-linecap="round"/>`);
    const spitze = pfeilspitze(punkte[punkte.length - 2], punkte[punkte.length - 1], 12);
    teile.push(`  <polygon points="${spitze.map(([x, y]) => `${x},${y}`).join(' ')}" fill="${farbe}"/>`);
    const mitte = punkte[Math.floor(punkte.length / 2)];
    teile.push(`  <text x="${mitte[0] + 6}" y="${mitte[1] - 6}" font-family="Helvetica, Arial" font-size="15" font-weight="bold" fill="${farbe}">${bewegung.name}</text>`);
  }
  for (const punkt of karte.punkte || []) {
    teile.push(`  <circle cx="${punkt.x}" cy="${punkt.y}" r="7" fill="${KARTENFARBEN.punkt}" stroke="${KARTENFARBEN.punktRand}" stroke-width="2"/>`);
    teile.push(`  <text x="${punkt.x}" y="${punkt.y - 11}" font-family="Helvetica, Arial" font-size="14" font-weight="bold" fill="${KARTENFARBEN.punkt}" text-anchor="middle">${punkt.name}</text>`);
  }
  for (const b of karte.beschriftungen || []) {
    const farbe = b.art === 'meer' ? KARTENFARBEN.schriftWasser : KARTENFARBEN.schriftLand;
    const drehung = b.drehung ? ` transform="rotate(${b.drehung} ${b.x} ${b.y})"` : '';
    teile.push(`  <text x="${b.x}" y="${b.y}" font-family="Helvetica, Arial" font-size="16" font-style="italic" fill="${farbe}" text-anchor="middle"${drehung}>${b.text}</text>`);
  }
  teile.push(`  <text x="${karte.breite / 2}" y="24" font-family="Helvetica, Arial" font-size="20" font-weight="bold" fill="${KARTENFARBEN.reichRand}" text-anchor="middle">${phase.label}</text>`);
  teile.push('</svg>');
  return teile.join('\n');
}

let gezahlt = 0;
for (const id of ids) {
  let kartenModul;
  try { kartenModul = require('../utils/themen/karten/' + id + '.js'); } catch (e) { continue; }
  const karte = kartenModul.karte || kartenModul;
  if (!karte || !karte.phasen) continue;
  const en = enKarten[id];
  if (!en) { console.log('Keine EN-Texte:', id); continue; }
  karte.phasen.forEach((p, i) => {
    if (en.phasen && en.phasen[i]) {
      if (en.phasen[i].label) p.label = en.phasen[i].label;
      (en.phasen[i].flaechen || []).forEach((f, j) => {
        if (p.flaechen && p.flaechen[j] && f.titel) p.flaechen[j].titel = f.titel;
      });
    }
  });
  (en.bewegungen || []).forEach((b, i) => { if (karte.bewegungen && karte.bewegungen[i]) karte.bewegungen[i].name = b.name; });
  (en.punkte || []).forEach((p, i) => { if (karte.punkte && karte.punkte[i]) karte.punkte[i].name = p.name; });
  (en.beschriftungen || []).forEach((b, i) => { if (karte.beschriftungen && karte.beschriftungen[i]) karte.beschriftungen[i].text = b.text; });
  karte.phasen.forEach((phase, i) => {
    const out = `/tmp/karten-en-${id}-phase${i}.svg`;
    fs.writeFileSync(out, renderSVG(karte, phase));
    const jpg = `${cache}/karte-${id}-phase${i}.jpg`;
    try {
      execSync(`rsvg-convert -w 900 "${out}" -o /tmp/karten-tmp.png && sips -s format jpeg -s formatOptions 80 /tmp/karten-tmp.png --out "${jpg}" >/dev/null 2>&1`, { timeout: 120000 });
      gezahlt++;
    } catch (e) { console.error('Render-Fehler:', id, i); }
  });
  console.log('EN-Karte:', id);
}
console.log('FERTIG:', gezahlt, 'EN-Karten-JPEGs nach', cache);
