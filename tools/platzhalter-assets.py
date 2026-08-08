#!/usr/bin/env python3
"""Platzhalter-Assets für 'Geschichte begreifen' — einfarbige PNGs per
Python-Stdlib (kein PIL nötig). Wird später durch echtes Design ersetzt."""
import struct, zlib, os

HINTERGRUND = (0x7C, 0x4A, 0x03, 0xFF)   # Bernstein
WEISS = (0xFF, 0xFF, 0xFF, 0xFF)
TRANSPARENT = (0, 0, 0, 0)

def png_roh(breite, hoehe, pixel_funktion):
    """pixel_funktion(x, y) -> (r,g,b,a). Zeilen mit Filter 0."""
    zeilen = b''
    for y in range(hoehe):
        zeile = b'\x00'
        for x in range(breite):
            zeile += bytes(pixel_funktion(x, y))
        zeilen += zeile
    def chunk(typ, daten):
        c = typ + daten
        return struct.pack('>I', len(daten)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)
    ihdr = struct.pack('>IIBBBBB', breite, hoehe, 8, 6, 0, 0, 0)
    return (b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr)
            + chunk(b'IDAT', zlib.compress(zeilen, 9)) + chunk(b'IEND', b''))

def einfarbig(farbe):
    return lambda x, y: farbe

def quadrat_mitte(seite, farbe):
    """Zentriertes Quadrat auf transparentem Grund (Platzhalter-Motiv)."""
    def f(x, y, size=seite, c=farbe):
        von = (size - seite) // 2
        bis = von + seite
        return c if von <= x < bis and von <= y < bis else TRANSPARENT
    return f

os.makedirs('assets', exist_ok=True)

icon = png_roh(1024, 1024, einfarbig(HINTERGRUND))
open('assets/icon.png', 'wb').write(icon)
open('assets/android-icon-background.png', 'wb').write(icon)

fore = png_roh(1024, 1024, quadrat_mitte(640, WEISS))
open('assets/android-icon-foreground.png', 'wb').write(fore)
open('assets/android-icon-monochrome.png', 'wb').write(fore)

fav = png_roh(48, 48, einfarbig(HINTERGRUND))
open('assets/favicon.png', 'wb').write(fav)

splash = png_roh(1024, 1024, einfarbig(HINTERGRUND))
open('assets/splash-icon.png', 'wb').write(splash)

for name in sorted(os.listdir('assets')):
    p = os.path.join('assets', name)
    print(f'{name}: {os.path.getsize(p)} Bytes')
print('Fertig.')
