# SLAD Web (PWA) — podpisywanie śladów w przeglądarce

Aplikacja webowa do podpisywania śladów SLAD **bez instalacji, bez konta,
bez serwera**. Działa offline po pierwszym otwarciu (service worker).

## Co potrafi

| Zakładka | Funkcja |
|---|---|
| **Portfel** | nowy klucz Ed25519, import z ziarna, szyfrowanie AES-GCM, eksport ziarna |
| **Podpisz** | podpisanie śladu → plik JSON do publikacji |
| **Weryfikuj** | sprawdzenie podpisu dowolnego śladu (lokalnie) |
| **Ranking** | TW z danych `stan.json` — ten sam algorytm co `rankuj.py` |

**Języki:** polski, angielski, niemiecki, hiszpański, francuski.
Wybór zapisuje się w przeglądarce; domyślnie język systemowy (fallback: EN).

## Zgodność z wersją Python — potwierdzona

Podpis Ed25519 jest deterministyczny (RFC 8032), więc ten sam klucz i
ten sam rekord dają **identyczny podpis** w JS i w Pythonie:

```
PASS pubkey zgodny z Pythonem
PASS kanoniczny JSON identyczny
PASS podpis identyczny z Pythonem
PASS hash treści identyczny
PASS weryfikacja podpisu
PASS tamper wykryty
...
WYNIK: 0 nie przeszło
```

Dodatkowo test krzyżowy: ślad podpisany w przeglądarce (`gen_js_slad.mjs`)
został **zweryfikowany przez `slad_protokolu.py`** bez błędu.

## Uruchomienie lokalne

Service worker wymaga HTTP (nie `file://`):

```bash
cd slad_web
python3 -m http.server 8080
# otwórz http://127.0.0.1:8080
```

## Testy

```bash
# Node 20+ wymagany (do testów, nie do samej aplikacji)
node wektor_test.mjs            # zgodność z Pythonem
node gen_js_slad.mjs            # generuje js-slad.json do testu krzyżowego
python3 -c "import sys,json; sys.path.insert(0,'..'); \
  import slad_protokolu as S; S.weryfikuj_podpis(json.load(open('js-slad.json'))); \
  print('OK')"
```

## Pliki

```
index.html              UI (4 zakładki, ciemny motyw, mobile-first)
slad_core.js            rdzeń: kanoniczny JSON, Ed25519, hash, koszt
i18n.js                 tłumaczenia PL/EN/DE/ES/FR (63 klucze, 0 braków)
i18n_test.mjs           test kompletności tłumaczeń
vendor/noble-ed25519.js Ed25519 (MIT, RFC 8032, ~5 KB, zero zależności)
gen_ikony.py            generator ikon PNG (bez bibliotek)
icon-192.png            ikona PWA
icon-512.png            ikona PWA
LICENSE.txt             licencja MIT
manifest.webmanifest    PWA (instalacja na ekranie głównym)
sw.js                   service worker (offline)
wektor.txt              wektor referencyjny z Pythona
```

## Ograniczenia (uczciwie)

- **CID liczy węzeł IPFS**, nie przeglądarka. Aplikacja daje plik JSON
  i odcisk sha256; CID powstaje po `ipfs add`.
- **Portfel w `localStorage`** — zaszyfrowany AES-GCM + PBKDF2 (200 000
  iteracji). Wyczyszczenie danych przeglądarki = utrata klucza, jeśli
  nie masz kopii ziarna. **Zapisz ziarno na papierze.**
- **SHA-512 z WebCrypto** — wymaga kontekstu bezpiecznego (HTTPS lub
  `localhost`). Na `http://` w sieci lokalnej może nie działać.

## Ikony

`icon-192.png` i `icon-512.png` są generowane skryptem (bez zewnętrznych
bibliotek):

```bash
python3 gen_ikony.py
```

Znak: drzewo binarne (4 węzły) na ciemnym tle, kolory motywu aplikacji.

## Publikacja

Aplikacja jest statyczna — wystarczy dowolny hosting plików:
- GitHub Pages,
- dowolny serwer HTTP,
- **IPFS** (spójne z ideą SLAD: `ipfs add -r slad_web`).
