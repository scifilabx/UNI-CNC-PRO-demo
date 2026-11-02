# Release verification

The **UNI-CNC-PRO-demo 2026-09-20** release is cryptographically signed
with the author's Ed25519 key and stored on IPFS as a SLAD trace.

## Release trace

```
CID       : bafkreib7cghyzbovipdxsb4gvbm7xs4rnwoa6imqui33yn5ilxfjdgxnqa
Author    : 5825c9958e443dca
Public key: 8eff5bc3e3bf6aa846d3d3921f7152f1f0ff570b87d8090fb670e54213041948
Digest    : 3f118f8c85d543c7790786a859fbcb916d9c0f2190a237bc37a85dca919aed80
Date      : 2026-11-01
```

## File checksums

| File | Size | SHA-256 |
|---|---:|---|
| `UNI-CNC-PRO-demo-linux-x86_64.tar.gz` | 1 435 620 B | `487e4a7f420e1e9433e30b9ab42b42f920dac59cc1420b54e0add8185bd1128a` |
| `UNI-CNC-PRO-demo-windows-x86_64.zip` | 5 490 778 B | `89632f5db6e76a90ef8fcffd367d790d62db743521df921fa11ba6ccc6b5b3be` |

## How to verify a downloaded file

**1. Compute the SHA-256** and compare it with the table above.

```bash
# Linux / macOS
sha256sum UNI-CNC-PRO-demo-linux-x86_64.tar.gz

# Windows (PowerShell)
Get-FileHash .\UNI-CNC-PRO-demo-windows-x86_64.zip -Algorithm SHA256
```

**2. Get the trace.** Easiest — download it from this repository (no IPFS
node needed): **[slad-bafkreib7cgh.json](slad-bafkreib7cgh.json)**.
It is the signed record; any tampering invalidates the signature.

Or fetch it from IPFS:

```bash
ipfs cat bafkreib7cghyzbovipdxsb4gvbm7xs4rnwoa6imqui33yn5ilxfjdgxnqa
```

Or via an HTTP gateway:

```
https://gateway.pinata.cloud/ipfs/bafkreib7cghyzbovipdxsb4gvbm7xs4rnwoa6imqui33yn5ilxfjdgxnqa
```

**3. Verify the signature** — in the SLAD web app
(https://scifilabx.org/slad/ → "Verify" tab) or in Python:

```python
import json, sys
sys.path.insert(0, 'raspbery')
import slad_protokolu as S

slad = json.load(open('slad-bafkreib7cgh.json'))
S.weryfikuj_podpis(slad)   # no exception = valid signature
```

## What this does and does not give you

**It gives you** confidence that the file is identical to the one the
author signed, even if you downloaded it from another server, a mirror,
or a third party.

**It does not give you** an assessment of whether the program is safe,
correct, or useful. A signature confirms provenance, not quality.

## Protocol

The trace is part of the SLAD tree — root
`bafkreigfhhqx2kzfu5shdcazisoei7gag676uabngyxzumc2geuk4462m4`
(Phase Zero, 1024 traces).

[SLAD — an open protocol](https://scifilabx.org/slad.php) · no tokens, no intermediaries
