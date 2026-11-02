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

Signed trace (JSON): **[slad-bafkreib7cgh.json](slad-bafkreib7cgh.json)** — download it, or copy the record below and load it in the verifier.

<details>
<summary>Show the signed trace (JSON)</summary>

```json
{"author_pubkey":"8eff5bc3e3bf6aa846d3d3921f7152f1f0ff570b87d8090fb670e54213041948","depth":1,"parent_cid":"bafkreigfhhqx2kzfu5shdcazisoei7gag676uabngyxzumc2geuk4462m4","payload":{"data":"2026-11-01","projekt":"UNI-CNC-PRO-demo","repo":"https://github.com/czerwoney/UNI-CNC-PRO-demo","typ":"release","wersja":"2026-09-20","wydania":[{"plik":"UNI-CNC-PRO-demo-linux-x86_64.tar.gz","rozmiar":1435620,"sha256":"487e4a7f420e1e9433e30b9ab42b42f920dac59cc1420b54e0add8185bd1128a"},{"plik":"UNI-CNC-PRO-demo-windows-x86_64.zip","rozmiar":5490778,"sha256":"89632f5db6e76a90ef8fcffd367d790d62db743521df921fa11ba6ccc6b5b3be"}]},"signature":"be635e8c5b13d859a3695606aa99f61b5860e631d3cb83eb50de6659d8197b883a5bb6418b57d2d061fc2700f9690da93c2afef9982c3be35c2f68026cadfb0a","timestamp":1793555032,"version":"1.0"}
```

</details>

Verify in your browser, no installation needed:
**https://scifilabx.org/slad/** (SLAD web app → "Verify" tab).

## License

MIT — see [LICENSE](LICENSE).
