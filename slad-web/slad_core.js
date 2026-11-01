/**
 * SLAD — rdzeń w JS (zgodny bit w bit z slad_protokolu.py).
 *
 * Kluczowe: kanoniczny JSON MUSI być identyczny z Pythonem:
 *   json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
 *
 * Podpisywanie: Ed25519 (RFC 8032) przez @noble/ed25519.
 * SHA-512 dla noble: WebCrypto (async) lub fallback.
 */

import * as ed from "./vendor/noble-ed25519.js";

export const PROTOCOL_VERSION = "1.0";
export const WYMAGANE_POLA = [
  "version",
  "parent_cid",
  "depth",
  "timestamp",
  "author_pubkey",
  "payload",
  "signature",
];

// noble v3 potrzebuje funkcji SHA-512; WebCrypto jest asynchroniczne,
// więc rejestrujemy je raz i używamy wyłącznie *Async API.
let _shaZainicjowany = false;
export async function inicjujKrypto() {
  if (_shaZainicjowany) return;
  ed.hashes.sha512Async = async (m) =>
    new Uint8Array(await crypto.subtle.digest("SHA-512", m));
  _shaZainicjowany = true;
}

// --- hex / base64 ----------------------------------------------------------

export function bajtyDoHex(b) {
  return Array.from(b)
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}

export function hexDoBajtow(hex) {
  if (hex.length % 2) throw new Error("nieparzysta długość hex");
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    const b = parseInt(hex.substr(i * 2, 2), 16);
    if (Number.isNaN(b)) throw new Error("nieprawidłowy hex");
    out[i] = b;
  }
  return out;
}

// base64 URL-safe bez paddingu (jak Python urlsafe_b64encode, ale bez '=')
export function bajtyDoB64url(b) {
  let s = "";
  for (let i = 0; i < b.length; i += 3) {
    const n = (b[i] << 16) | ((b[i + 1] || 0) << 8) | (b[i + 2] || 0);
    s += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"[
      (n >> 18) & 63
    ];
    s += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"[
      (n >> 12) & 63
    ];
    if (i + 1 < b.length)
      s += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"[
        (n >> 6) & 63
      ];
    if (i + 2 < b.length)
      s += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"[
        n & 63
      ];
  }
  return s;
}

export function b64urlDoBajtow(s) {
  s = s.replace(/=+$/, "").replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(s + "=".repeat((4 - (s.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

// --- kanoniczny JSON -------------------------------------------------------

function sortujKlucze(v) {
  if (Array.isArray(v)) return v.map(sortujKlucze);
  if (v && typeof v === "object") {
    const out = {};
    for (const k of Object.keys(v).sort()) out[k] = sortujKlucze(v[k]);
    return out;
  }
  return v;
}

export function kanoniczny(obj) {
  return JSON.stringify(sortujKlucze(obj));
}

export function sygnowanyRekord(obj) {
  const { signature, ...reszta } = obj;
  return new TextEncoder().encode(kanoniczny(reszta));
}

export async function hashTresci(obj) {
  const dane = new TextEncoder().encode(kanoniczny(obj));
  const h = await crypto.subtle.digest("SHA-256", dane);
  return bajtyDoHex(new Uint8Array(h));
}

// --- klucze i podpisy ------------------------------------------------------

export async function kluczPubliczny(ziarnoHex) {
  await inicjujKrypto();
  const ziarno =
    typeof ziarnoHex === "string" ? hexDoBajtow(ziarnoHex) : ziarnoHex;
  if (ziarno.length !== 32) throw new Error("ziarno musi mieć 32 bajty");
  return bajtyDoHex(await ed.getPublicKeyAsync(ziarno));
}

export function adresKlucza(pubHex) {
  // adres = sha256(pub)[:8] w hex — potrzebne async, więc osobno
  return pubHex.slice(0, 16); // prowizoryczne, nadpisywane w adresKluczaAsync
}

export async function adresKluczaAsync(pubHex) {
  const h = await crypto.subtle.digest("SHA-256", hexDoBajtow(pubHex));
  return bajtyDoHex(new Uint8Array(h)).slice(0, 16);
}

export async function podpiszSlad(
  ziarnoHex,
  parentCid,
  depth,
  payload,
  timestamp,
) {
  await inicjujKrypto();
  if (depth < 0) throw new Error("depth nie może być ujemne");
  if (depth === 0 && parentCid !== null)
    throw new Error("korzeń nie może mieć rodzica");
  if (depth > 0 && !parentCid) throw new Error("potomek musi mieć parent_cid");

  const pub = await kluczPubliczny(ziarnoHex);
  const slad = {
    version: PROTOCOL_VERSION,
    parent_cid: parentCid === undefined ? null : parentCid,
    depth: depth,
    timestamp: timestamp ?? Math.floor(Date.now() / 1000),
    author_pubkey: pub,
    payload: payload,
  };
  const ziarno =
    typeof ziarnoHex === "string" ? hexDoBajtow(ziarnoHex) : ziarnoHex;
  const podpis = await ed.signAsync(sygnowanyRekord(slad), ziarno);
  slad.signature = bajtyDoHex(podpis);
  return slad;
}

export function walidujStrukture(slad) {
  if (!slad || typeof slad !== "object")
    throw new Error("ślad musi być obiektem");
  const brak = WYMAGANE_POLA.filter((p) => !(p in slad));
  if (brak.length) throw new Error("brakujące pola: " + brak.join(", "));
  if (slad.version !== PROTOCOL_VERSION)
    throw new Error("nieobsługiwana wersja");
  if (typeof slad.depth !== "number" || slad.depth < 0)
    throw new Error("złe depth");
  if (typeof slad.timestamp !== "number") throw new Error("zły timestamp");
  if (typeof slad.payload !== "object" || swladNull(slad.payload))
    throw new Error("zły payload");
}

function swladNull(x) {
  return x === null;
}

export async function weryfikujPodpis(slad) {
  await inicjujKrypto();
  walidujStrukture(slad);
  const ok = await ed.verifyAsync(
    hexDoBajtow(slad.signature),
    sygnowanyRekord(slad),
    hexDoBajtow(slad.author_pubkey),
  );
  if (!ok) throw new Error("nieprawidłowy podpis");
  return true;
}

// --- koszt (ta sama formuła co w Pythonie) ---------------------------------

export const COST_BASE = 1.0;
export const COST_DEPTH_LINEAR = 0.05;
export const COST_BRANCH_EXP_BASE = 2.0;

export function obliczKoszt(glebokosc, galezie) {
  if (glebokosc < 0) throw new Error("głębokość < 0");
  if (galezie < 1) throw new Error("gałęzie < 1");
  return +(
    (COST_BASE + COST_DEPTH_LINEAR * glebokosc) *
    Math.pow(COST_BRANCH_EXP_BASE, galezie - 1)
  ).toFixed(6);
}
