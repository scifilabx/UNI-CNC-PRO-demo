# UNI-CNC-PRO — demo

Demonstration build of UNI-CNC-PRO: a CNC editor and machining simulator.

## Download

- Windows: `UNI-CNC-PRO-demo-windows-x86_64.zip`
- Linux: `UNI-CNC-PRO-demo-linux-x86_64.tar.gz`

## Verifying the downloaded file

This release is **cryptographically signed** with the author's Ed25519 key.
This lets you verify that the file you downloaded is identical to the one
the author published — even if you got it from a different server.

```
Release trace (CID): bafkreib7cghyzbovipdxsb4gvbm7xs4rnwoa6imqui33yn5ilxfjdgxnqa
Author key        : 8eff5bc3e3bf6aa846d3d3921f7152f1f0ff570b87d8090fb670e54213041948
Author (address)  : 5825c9958e443dca
```

Quick checksum check:

```bash
sha256sum UNI-CNC-PRO-demo-linux-x86_64.tar.gz
# 487e4a7f420e1e9433e30b9ab42b42f920dac59cc1420b54e0add8185bd1128a
```

Full instructions (including signature verification): **[WERYFIKACJA.md](WERYFIKACJA.md)**

Signed trace (JSON): **[slad-bafkreib7cgh.json](slad-bafkreib7cgh.json)** — download it and load it in the verifier.

Verify in your browser, no installation needed:
**https://scifilabx.org/slad/** (SLAD web app → "Verify" tab).

## License

MIT — see [LICENSE](LICENSE).
