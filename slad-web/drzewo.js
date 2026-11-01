/**
 * SLAD — widok drzewa śladów (SVG, z myślą o skali).
 *
 * Zasada: przy dużych drzewach NIE rysujemy wszystkiego. Renderujemy
 * zagregowane poziomy (głębokości) i podświetlamy ścieżkę do wybranego
 * śladu. Dzięki temu koszt rysowania zależy od liczby POZIOMÓW, nie od
 * liczby śladów.
 */

const LIMIT_WEZLOW = 4000; // powyżej tego rysujemy tylko agregat poziomów

export function czyMieszczalne(slady) {
  return Object.keys(slady).length <= LIMIT_WEZLOW;
}

/**
 * Buduje dane do rysunku.
 *
 * @param {Object} slady   mapa CID -> ślad
 * @param {string|null} moj  CID wyróżniony (np. ostatni ślad użytkownika)
 * @returns {Object} { tryb: 'pelny'|'agregat', poziomy: [...], sciezka: [...] }
 */
export function przygotujDrzewo(slady, moj = null) {
  const wgGlebokosci = new Map();
  const rodzice = new Map();
  let maks = 0;

  for (const [cid, s] of Object.entries(slady)) {
    const d = s.depth ?? 0;
    if (!wgGlebokosci.has(d)) wgGlebokosci.set(d, []);
    wgGlebokosci.get(d).push(cid);
    if (s.parent_cid) rodzice.set(cid, s.parent_cid);
    if (d > maks) maks = d;
  }

  // ścieżka od „mojego" śladu do korzenia
  const sciezka = [];
  if (moj) {
    let c = moj;
    const widziane = new Set();
    while (c && !widziane.has(c)) {
      widziane.add(c);
      sciezka.push(c);
      c = rodzice.get(c) || null;
    }
  }

  const poziomy = [];
  if (wgGlebokosci.size > 0) {
    for (let d = 0; d <= maks; d++) {
      const wezly = wgGlebokosci.get(d) || [];
      poziomy.push({ depth: d, liczba: wezly.length });
    }
  }

  const tryb = Object.keys(slady).length <= LIMIT_WEZLOW ? 'pelny' : 'agregat';
  return { tryb, poziomy, sciezka, maks, miSciezka: new Set(sciezka) };
}

/**
 * Rysuje SVG. Szerokość/wysokość zależą od liczby poziomów — nie od liczby
 * śladów, więc duże drzewo nie zawiesi przeglądarki.
 */
export function rysuj(svg, dane) {
  const NS = 'http://www.w3.org/2000/svg';
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  const poziomow = dane.poziomy.length;
  const w = Math.min(640, Math.max(240, Math.sqrt(Math.max(...dane.poziomy.map(p => p.liczba), 1)) * 90));
  const h = Math.max(160, poziomow * 46);
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', String(h));

  const maksLicz = Math.max(...dane.poziomy.map(p => p.liczba), 1);

  // oś głębokości
  for (const p of dane.poziomy) {
    const y = 24 + p.depth * 46;
    const szer = Math.max(6, (p.liczba / maksLicz) * (w - 80));

    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', '40');
    line.setAttribute('x2', String(40 + szer));
    line.setAttribute('y1', String(y));
    line.setAttribute('y2', String(y));
    line.setAttribute('stroke', p.depth === 0 ? '#4cc2ff' : '#26313d');
    line.setAttribute('stroke-width', p.depth === 0 ? '6' : '4');
    line.setAttribute('stroke-linecap', 'round');
    svg.appendChild(line);

    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', String(40 + szer + 8));
    t.setAttribute('y', String(y + 4));
    t.setAttribute('fill', '#8b98a5');
    t.setAttribute('font-size', '10');
    t.textContent = `d${p.depth} · ${p.liczba}`;
    svg.appendChild(t);
  }

  return { szerokosc: w, wysokosc: h };
}
