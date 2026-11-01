# Weryfikacja wydania

Wydanie **UNI-CNC-PRO-demo 2026-09-20** jest podpisane kryptograficznie
kluczem Ed25519 autora i zapisane w IPFS jako ślad SLAD.

## Ślad wydania

```
CID        : bafkreib7cghyzbovipdxsb4gvbm7xs4rnwoa6imqui33yn5ilxfjdgxnqa
Autor      : 5825c9958e443dca
Klucz publ.: 8eff5bc3e3bf6aa846d3d3921f7152f1f0ff570b87d8090fb670e54213041948
Odcisk     : 3f118f8c85d543c7790786a859fbcb916d9c0f2190a237bc37a85dca919aed80
Data       : 2026-11-01
```

## Sumy kontrolne plików

| Plik | Rozmiar | SHA-256 |
|---|---:|---|
| `UNI-CNC-PRO-demo-linux-x86_64.tar.gz` | 1 435 620 B | `487e4a7f420e1e9433e30b9ab42b42f920dac59cc1420b54e0add8185bd1128a` |
| `UNI-CNC-PRO-demo-windows-x86_64.zip` | 5 490 778 B | `89632f5db6e76a90ef8fcffd367d790d62db743521df921fa11ba6ccc6b5b3be` |

## Jak sprawdzić pobrany plik

**1. Policz SHA-256** i porównaj z tabelą powyżej.

```bash
# Linux / macOS
sha256sum UNI-CNC-PRO-demo-linux-x86_64.tar.gz

# Windows (PowerShell)
Get-FileHash .\UNI-CNC-PRO-demo-windows-x86_64.zip -Algorithm SHA256
```

**2. Pobierz ślad** (wymaga węzła IPFS):

```bash
ipfs cat bafkreib7cghyzbovipdxsb4gvbm7xs4rnwoa6imqui33yn5ilxfjdgxnqa
```

Można też przez bramkę HTTP:

```
https://gateway.pinata.cloud/ipfs/bafkreib7cghyzbovipdxsb4gvbm7xs4rnwoa6imqui33yn5ilxfjdgxnqa
```

**3. Sprawdź podpis** — w aplikacji SLAD (zakładka „Weryfikuj")
lub w Pythonie:

```python
import json, sys
sys.path.insert(0, 'raspbery')
import slad_protokolu as S

slad = json.load(open('slad-bafkreib7cgh.json'))
S.weryfikuj_podpis(slad)   # brak wyjątku = podpis poprawny
```

## Co to daje, a czego nie daje

**Daje:** pewność, że plik jest identyczny z tym, który podpisał autor.
Nawet jeśli pobrałeś go z innego serwera, lustra lub od osoby trzeciej.

**Nie daje:** oceny, czy program jest bezpieczny, poprawny lub przydatny.
Podpis potwierdza pochodzenie, nie jakość.

## Protokół

Ślad jest częścią drzewa SLAD — korzeń
`bafkreigfhhqx2kzfu5shdcazisoei7gag676uabngyxzumc2geuk4462m4`
(Faza Zero, 1024 ślady).

[SLAD — otwarty protokół](https://scifilabx.org/slad.php) · bez tokenów, bez pośredników
