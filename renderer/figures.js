// SVG figures for the walkthroughs. Every builder returns an HTML string.
// Colors come from CSS classes (see styles.css, "Figures"), so figures follow
// light/dark mode. Arrowheads are the shared markers defined in index.html.
//
// Labels accept ^{...} and _{...} for superscripts and subscripts.

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function tx(s) {
  return esc(s)
    .replace(/\^\{([^}]*)\}/g, '<tspan baseline-shift="super" font-size="72%">$1</tspan>')
    .replace(/_\{([^}]*)\}/g, '<tspan baseline-shift="sub" font-size="72%">$1</tspan>');
}

export function text(x, y, s, cls = '', anchor = 'middle') {
  return `<text x="${r1(x)}" y="${r1(y)}" text-anchor="${anchor}" class="${cls}">${tx(s)}</text>`;
}

const r1 = (v) => Math.round(v * 10) / 10;

export function frame(w, h, body, caption) {
  return (
    `<figure class="fig"><svg viewBox="0 0 ${w} ${h}" width="${w}" style="max-width:${w}px" role="img">${body}</svg>` +
    (caption ? `<figcaption>${caption}</figcaption>` : '') +
    `</figure>`
  );
}

// ---------- graph primitives ----------

export function node(n) {
  const r = n.r ?? 17;
  let s = `<g class="n n-${n.kind ?? 'plain'}"><circle cx="${n.x}" cy="${n.y}" r="${r}"/>`;
  s += text(n.x, n.y + 4.5, n.label, 'nl');
  if (n.sub) s += text(n.x, n.y + r + 15, n.sub, 't-dim t-sm halo');
  if (n.over) s += text(n.x, n.y - r - 8, n.over, 't-sm t-strong halo');
  return s + '</g>';
}

export function toward(p, q, dist) {
  const dx = q.x - p.x;
  const dy = q.y - p.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: p.x + (dx / len) * dist, y: p.y + (dy / len) * dist };
}

export function edge(a, b, e = {}) {
  const kind = e.kind ?? 'plain';
  const ra = (a.r ?? 17) + 1;
  const rb = (b.r ?? 17) + (e.undirected ? 1 : 2);
  const bend = e.bend ?? 0;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const c = { x: (a.x + b.x) / 2 + nx * bend, y: (a.y + b.y) / 2 + ny * bend };
  const p1 = toward(a, bend ? c : b, e.both ? rb : ra);
  const p2 = toward(b, bend ? c : a, rb);
  const d = bend
    ? `M${r1(p1.x)},${r1(p1.y)} Q${r1(c.x)},${r1(c.y)} ${r1(p2.x)},${r1(p2.y)}`
    : `M${r1(p1.x)},${r1(p1.y)} L${r1(p2.x)},${r1(p2.y)}`;
  const cls = `e e-${kind}${e.dashed ? ' e-dash' : ''}${e.thick ? ' e-thick' : ''}`;
  const mk = `ah-${kind}`;
  let s = `<path d="${d}" class="${cls}"`;
  if (!e.undirected) s += ` marker-end="url(#${mk})"`;
  if (e.both) s += ` marker-start="url(#${mk})"`;
  s += '/>';
  if (e.label !== undefined) {
    const mid = bend
      ? { x: 0.25 * p1.x + 0.5 * c.x + 0.25 * p2.x, y: 0.25 * p1.y + 0.5 * c.y + 0.25 * p2.y }
      : { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    const off = e.labelOffset ?? 11;
    const side = e.labelSide ?? (bend < 0 ? -1 : 1);
    s += text(mid.x + nx * off * side, mid.y + ny * off * side + 4, e.label, `el el-${kind} halo`);
  }
  return s;
}

export function graph(w, h, { nodes, edges = [], extra = '', under = '' }, caption) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  let body = under;
  for (const e of edges) body += edge(byId[e.from], byId[e.to], e);
  for (const n of nodes) body += node(n);
  body += extra;
  return frame(w, h, body, caption);
}

export function box(x, y, w, h, cls, label, labelCls = '') {
  let s = `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="5" class="${cls}"/>`;
  if (label !== undefined) s += text(x + w / 2, y + h / 2 + 4.5, label, labelCls);
  return s;
}

export function legend(x, y, items) {
  // items: [{kind, label, shape: 'dot'|'line'|'dash'}]
  let s = '';
  let cx = x;
  for (const it of items) {
    if (it.shape === 'line' || it.shape === 'dash') {
      s += `<path d="M${cx},${y - 4} L${cx + 22},${y - 4}" class="e e-${it.kind}${it.shape === 'dash' ? ' e-dash' : ''}"/>`;
      cx += 28;
    } else {
      s += `<circle cx="${cx + 6}" cy="${y - 4}" r="6" class="swatch sw-${it.kind}"/>`;
      cx += 17;
    }
    s += text(cx, y, it.label, 't-sm t-dim', 'start');
    cx += it.label.length * 6.4 + 22;
  }
  return s;
}

// ---------- Q1: growth rates and recurrences ----------

const FALL_LADDER = [
    ['log n', 'muted'],
    ['2^{√log n}', 'muted'],
    ['n', 'accent'],
    ['n log n', 'accent'],
    ['n^{2}', 'accent'],
    ['n^{100}', 'accent'],
    ['n^{log n}', 'warn'],
    ['99^{n}', 'bad'],
    ['100^{n}', 'bad'],
    ['(log n)^{n}', 'bad']
];

export function growthLadder(
  items = FALL_LADDER,
  caption = 'Every function on this exam, from slowest to fastest. Anything further right eventually beats everything to its left.'
) {
  let body = '';
  items.forEach(([label, kind], i) => {
    const x = 14 + i * 55;
    const y = 250 - i * 23;
    body += box(x, y, 100, 24, `pill pill-${kind}`, label, 'pill-t');
  });
  body += `<path d="M30,286 L610,286" class="e e-muted" marker-end="url(#ah-muted)"/>`;
  body += text(30, 304, 'grows slower', 't-sm t-dim', 'start');
  body += text(610, 304, 'grows faster', 't-sm t-dim', 'end');
  body += legend(14, 22, [
    { kind: 'muted', label: 'slower than any polynomial' },
    { kind: 'accent', label: 'polynomial' },
    { kind: 'warn', label: 'in between' },
    { kind: 'bad', label: 'exponential and up' }
  ]);
  return frame(640, 314, body, caption);
}

// rows: [{count, label, cost}]; draws a recursion tree with per-level work.
export function recTree(rows, note, caption) {
  const left = 20;
  const right = 430;
  const rowH = 52;
  const top = 38;
  let body = text(470, 22, 'work on this level', 't-sm t-dim', 'start');
  const centers = [];
  rows.forEach((row, i) => {
    const y = top + i * rowH;
    const count = row.labels ? row.labels.length : row.count;
    const shown = Math.min(count, row.max ?? 8);
    const truncated = count > shown;
    const gap = 8;
    const bw = Math.min(130, (right - left - (shown - 1) * gap) / shown);
    const total = shown * bw + (shown - 1) * gap;
    const x0 = (left + right) / 2 - total / 2;
    const cs = [];
    for (let j = 0; j < shown; j++) {
      const x = x0 + j * (bw + gap);
      const isDots = truncated && j === shown - 2;
      if (isDots) {
        body += text(x + bw / 2, y + 17, '…', 't-dim');
      } else {
        const label = row.labels ? row.labels[j] : row.label;
        body += box(x, y, bw, 24, 'rt-box', bw > 34 ? label : '', 'rt-t');
      }
      cs.push(x + bw / 2);
    }
    if (i > 0) {
      const prev = centers[i - 1];
      cs.forEach((cx, j) => {
        if (truncated && j === shown - 2) return;
        const parent = prev[Math.min(prev.length - 1, Math.floor((j * prev.length) / cs.length))];
        body += `<path d="M${r1(parent)},${y - rowH + 24} L${r1(cx)},${y}" class="e e-muted"/>`;
      });
    }
    centers.push(cs);
    body += text(470, y + 17, row.cost, 'rt-cost', 'start');
  });
  const h = top + rows.length * rowH + (note ? 26 : 0);
  if (note) body += text(20, h - 12, note, 't-strong', 'start');
  return frame(640, h, body, caption);
}

export function sumBars() {
  const n = 12;
  const vals = Array.from({ length: n }, (_, i) => (i + 1) * Math.log2(i + 1));
  const max = vals[n - 1];
  const base = 196;
  const scale = 150 / max;
  const x = (i) => 70 + i * 40;
  let body = '';
  // lower bound: top half, each at least the middle bar
  const mid = vals[n / 2 - 1] * scale;
  vals.forEach((v, i) => {
    const h = Math.max(2, v * scale);
    body += `<rect x="${x(i)}" y="${r1(base - h)}" width="28" height="${r1(h)}" rx="2" class="bar"/>`;
  });
  body += `<rect x="${x(n / 2) - 4}" y="${r1(base - mid)}" width="${(n / 2) * 40 - 4}" height="${r1(mid)}" class="region-lower"/>`;
  // upper bound
  body += `<rect x="${x(0) - 4}" y="${r1(base - max * scale)}" width="${n * 40 - 4}" height="${r1(max * scale)}" class="region-dash"/>`;
  body += `<path d="M50,${base} L${x(n - 1) + 40},${base}" class="e e-muted"/>`;
  body += text(x(0) - 2, base - max * scale - 8, 'dashed box (upper): n terms, each ≤ n log n  →  ≤ n^{2} log n', 't-sm', 'start');
  body += text(x(0) + 14, base + 18, 'i = 1', 't-sm t-dim');
  body += text(x(n - 1) + 14, base + 18, 'i = n', 't-sm t-dim');
  body += `<rect x="${x(0)}" y="${base + 32}" width="14" height="12" rx="2" class="region-lower"/>`;
  body += text(x(0) + 22, base + 42, 'blue box (lower): the top n/2 terms, each ≥ (n/2) log(n/2)  →  ≥ (n^{2}/4) log(n/2)', 't-sm t-accent', 'start');
  return frame(640, 250, body, 'The sum 1·log 1 + 2·log 2 + … + n·log n, one bar per term. Both boxes are about n² log n, so the sum is too.');
}

export function substitution() {
  const top = ['n', '√n', 'n^{1/4}', 'n^{1/8}', '…'];
  const bot = ['m', 'm/2', 'm/4', 'm/8', '…'];
  let body = '';
  top.forEach((t, i) => {
    const x = 150 + i * 96;
    if (t === '…') {
      body += text(x + 36, 46, '…', 't-dim');
      body += text(x + 36, 136, '…', 't-dim');
      return;
    }
    body += box(x, 28, 72, 28, 'rt-box', t, 'rt-t');
    body += box(x, 118, 72, 28, 'pill pill-accent', bot[i], 'pill-t');
    body += `<path d="M${x + 36},58 L${x + 36},114" class="e e-muted" marker-end="url(#ah-muted)"/>`;
    body += text(x + 42, 90, 'log₂', 't-sm t-dim', 'start');
    if (i < 3) {
      body += `<path d="M${x + 74},42 L${x + 94},42" class="e e-muted" marker-end="url(#ah-muted)"/>`;
      body += `<path d="M${x + 74},132 L${x + 94},132" class="e e-accent" marker-end="url(#ah-accent)"/>`;
    }
  });
  body += text(20, 47, 'T world', 't-strong', 'start');
  body += text(20, 137, 'S world', 't-strong t-accent', 'start');
  body += text(20, 154, 'm = log₂ n', 't-sm t-dim', 'start');
  return frame(640, 170, body, 'Square-rooting n is the same as halving m. Halving is what the Master theorem knows how to handle.');
}

// ---------- Q2 / Q3: DFS intervals ----------

// items: [{name, pre, post, depth, kind, unknown}]
export function intervals(items, max, caption) {
  const x0 = 40;
  const unit = (600 - x0) / max;
  const X = (t) => x0 + (t - 1) * unit + unit / 2;
  const depth = Math.max(...items.map((it) => it.depth));
  const axisY = 26 + (depth + 1) * 32 + 8;
  let body = '';
  for (let t = 1; t <= max; t++) {
    body += `<path d="M${r1(X(t))},20 L${r1(X(t))},${axisY - 4}" class="grid"/>`;
    body += text(X(t), axisY + 12, String(t), 't-sm t-dim');
  }
  for (const it of items) {
    const y = 22 + it.depth * 32;
    const x = X(it.pre) - 10;
    const w = X(it.post) - X(it.pre) + 20;
    body += `<rect x="${r1(x)}" y="${y}" width="${r1(w)}" height="24" rx="12" class="span span-${it.kind ?? 'accent'}${it.unknown ? ' span-unknown' : ''}"/>`;
    const lab = it.unknown ? `${it.name}  ?` : `${it.name}  [${it.pre}, ${it.post}]`;
    const fits = w > lab.length * 7.4 + 18;
    body += text(fits ? x + 12 : x + w + 6, y + 16.5, lab, 'span-t', 'start');
  }
  body += text(600, axisY + 28, 'time →', 't-sm t-dim', 'end');
  return frame(640, axisY + 34, body, caption);
}

export function q2Intervals() {
  return intervals(
    [
      { name: 'a', pre: 1, post: 10, depth: 0 },
      { name: 'b', pre: 2, post: 5, depth: 1 },
      { name: 'c', pre: 3, post: 4, depth: 2 },
      { name: 'd', pre: 6, post: 9, depth: 1 },
      { name: 'e', pre: 7, post: 8, depth: 2 },
      { name: 'f', pre: 11, post: 14, depth: 0, kind: 'good' },
      { name: 'g', pre: 12, post: 13, depth: 1, kind: 'good' }
    ],
    14,
    'Each bar runs from when DFS enters a vertex (pre) to when it leaves (post). Bars are either nested or separate. They never partly overlap.'
  );
}

export function q3Intervals(showZ) {
  return intervals(
    [
      { name: 'x', pre: 1, post: 8, depth: 0 },
      { name: 'u', pre: 2, post: 7, depth: 1 },
      { name: 'w', pre: 3, post: 6, depth: 2 },
      { name: 'v', pre: 4, post: 5, depth: 3 },
      { name: 'y', pre: 9, post: 12, depth: 0, kind: 'good' },
      { name: 'z', pre: 10, post: 11, depth: 1, kind: 'good', unknown: !showZ }
    ],
    12,
    showZ
      ? 'The whole DFS on a timeline. x contains u contains w contains v, and separately y contains z.'
      : 'The table as a picture. A bar inside another bar means “descendant of”.'
  );
}

export function q3Tree(showForward) {
  const nodes = [
    { id: 'x', x: 60, y: 84, label: 'x', sub: '[1, 8]' },
    { id: 'u', x: 180, y: 84, label: 'u', sub: '[2, 7]' },
    { id: 'w', x: 300, y: 84, label: 'w', sub: '[3, 6]' },
    { id: 'v', x: 420, y: 84, label: 'v', sub: '[4, 5]' },
    { id: 'y', x: 520, y: 84, label: 'y', sub: '[9, 12]', kind: 'good' },
    { id: 'z', x: 610, y: 84, label: 'z', sub: '[10, 11]', kind: 'good' }
  ];
  const edges = [
    { from: 'x', to: 'u', kind: 'accent', thick: true },
    { from: 'u', to: 'w', kind: 'accent', thick: true },
    { from: 'w', to: 'v', kind: 'accent', thick: true },
    { from: 'y', to: 'z', kind: 'accent', thick: true },
  ];
  const items = [{ kind: 'accent', label: 'must exist (tree edges)', shape: 'line' }];
  if (showForward) {
    edges.push({ from: 'u', to: 'v', kind: 'warn', dashed: true, bend: -62, label: 'forward edge (skips w)' });
    items.push({ kind: 'warn', label: 'the edge (u, v) from part (b)', shape: 'dash' });
  }
  const extra = legend(20, 162, items);
  return graph(650, 172, { nodes, edges, extra }, 'The DFS forest. Consecutive pre numbers (1→2→3→4 and 9→10) mean DFS walked straight along an edge.');
}

export function sccBlobs() {
  let body = '<ellipse cx="170" cy="78" rx="140" ry="54" class="blob"/>';
  const pts = [[90, 60], [130, 95], [160, 50], [200, 88], [240, 58], [110, 78], [180, 112], [250, 96], [220, 40]];
  for (const [x, y] of pts) body += `<circle cx="${x}" cy="${y}" r="6" class="dot"/>`;
  const smalls = [390, 460, 530, 600];
  smalls.forEach((x, i) => {
    body += `<circle cx="${x}" cy="78" r="20" class="blob"/>`;
    body += `<circle cx="${x}" cy="78" r="6" class="dot"/>`;
    const from = i === 0 ? 312 : smalls[i - 1] + 22;
    body += `<path d="M${from},78 L${x - 24},78" class="e e-muted" marker-end="url(#ah-muted)"/>`;
  });
  body += text(170, 156, 'one big SCC: n − (k − 1) vertices', 't-strong');
  body += text(495, 156, 'k − 1 SCCs of one vertex each', 't-dim');
  return frame(640, 170, body, 'To make one SCC as big as possible, starve the others: one vertex each.');
}

export function huffman() {
  const leaves = [
    { x: 230, y: 84, t: 'E · 16', code: '0' },
    { x: 290, y: 138, t: 'D · 8', code: '10' },
    { x: 350, y: 192, t: 'C · 4', code: '110' },
    { x: 410, y: 246, t: 'B · 2', code: '1110' },
    { x: 530, y: 246, t: 'A · 2', code: '1111' }
  ];
  const inner = [
    { x: 290, y: 30, t: '32' },
    { x: 350, y: 84, t: '16' },
    { x: 410, y: 138, t: '8' },
    { x: 470, y: 192, t: '4' }
  ];
  let body = '';
  inner.forEach((p, i) => {
    const l = leaves[i];
    const r = inner[i + 1] ?? leaves[4];
    body += `<path d="M${p.x},${p.y + 12} L${l.x},${l.y - 12}" class="e e-plain"/>`;
    body += `<path d="M${p.x},${p.y + 12} L${r.x},${r.y - 12}" class="e e-plain"/>`;
    body += text((p.x + l.x) / 2 - 10, (p.y + l.y) / 2 + 4, '0', 't-sm t-dim halo');
    body += text((p.x + r.x) / 2 + 10, (p.y + r.y) / 2 + 4, '1', 't-sm t-dim halo');
  });
  inner.forEach((p) => {
    body += `<circle cx="${p.x}" cy="${p.y}" r="13" class="inner"/>`;
    body += text(p.x, p.y + 4, p.t, 't-sm');
  });
  leaves.forEach((l, i) => {
    body += box(l.x - 36, l.y - 12, 72, 24, i === 0 ? 'pill pill-accent' : 'pill pill-plain', l.t, 'pill-t');
    body += text(l.x - 44, l.y + 4, l.code, 't-sm t-mono t-dim', 'end');
  });
  return frame(640, 266, body, 'Huffman always merges the two smallest. Each merge hangs one more letter off a long chain, and E, the most common letter, ends up right under the root with a 1-bit code.');
}

export function dagChain() {
  const n = 5;
  const X = (i) => 70 + i * 125;
  const nodes = Array.from({ length: n }, (_, i) => ({ id: String(i + 1), x: X(i), y: 150, label: String(i + 1) }));
  const edges = [];
  for (let i = 1; i < n; i++) edges.push({ from: String(i), to: String(i + 1), kind: 'accent', thick: true });
  for (let i = 1; i <= n; i++)
    for (let j = i + 2; j <= n; j++)
      edges.push({ from: String(i), to: String(j), kind: 'muted', dashed: true, bend: -(j - i) * 34 - (i % 2) * 14 });
  const extra = legend(20, 210, [
    { kind: 'accent', label: 'n − 1 edges you must have', shape: 'line' },
    { kind: 'muted', label: 'optional (each one in or out)', shape: 'dash' }
  ]);
  return graph(640, 222, { nodes, edges, extra }, 'n = 5. The chain forces the order. Every other forward edge is a free yes/no choice: 2 to the number of dashed edges.');
}

export function dagDiamond() {
  const nodes = [
    { id: '1', x: 70, y: 100, label: '1' },
    { id: '2', x: 200, y: 44, label: '2' },
    { id: '3', x: 200, y: 156, label: '3' },
    { id: '4', x: 330, y: 100, label: '4' }
  ];
  const edges = [
    { from: '1', to: '2', kind: 'accent' },
    { from: '1', to: '3', kind: 'accent' },
    { from: '2', to: '4', kind: 'accent' },
    { from: '3', to: '4', kind: 'accent' },
    { from: '2', to: '3', kind: 'bad', dashed: true, undirected: true, label: 'no edge', labelOffset: 30 }
  ];
  let extra = text(410, 70, 'Topological orders:', 't-strong', 'start');
  extra += text(410, 98, '1, 2, 3, 4', 't-mono', 'start');
  extra += text(410, 122, '1, 3, 2, 4', 't-mono', 'start');
  extra += text(410, 150, '2 and 3 are free to swap.', 't-sm t-dim', 'start');
  return graph(640, 200, { nodes, edges, extra }, 'A diamond. 1 must be first and 4 last, but nothing decides between 2 and 3.');
}

export function dagSwap() {
  const n = 6;
  const X = (i) => 60 + (i - 1) * 104;
  const nodes = Array.from({ length: n }, (_, i) => ({
    id: String(i + 1),
    x: X(i + 1),
    y: 118,
    label: String(i + 1),
    kind: i + 1 === 3 || i + 1 === 4 ? 'warn' : 'plain'
  }));
  const edges = [
    { from: '1', to: '2', kind: 'accent', thick: true },
    { from: '2', to: '3', kind: 'accent', thick: true },
    { from: '3', to: '4', kind: 'bad', dashed: true, undirected: true, label: '✕ missing', labelOffset: 16 },
    { from: '4', to: '5', kind: 'accent', thick: true },
    { from: '5', to: '6', kind: 'accent', thick: true },
    { from: '2', to: '4', kind: 'good', thick: true, bend: -64, label: 'extra' },
    { from: '3', to: '5', kind: 'good', thick: true, bend: -64, label: 'extra' }
  ];
  const extra = text(20, 24, 'Swapping k = 3 and k + 1 = 4', 't-strong', 'start');
  return graph(640, 160, { nodes, edges, extra }, 'k and k + 1 are the only free pair. The two green edges stop anything else from moving. At the ends (k = 1 or k = n − 1) only one green edge exists.');
}

export function negCycle() {
  const nodes = [
    { id: 's', x: 60, y: 110, label: 's' },
    { id: 'a', x: 220, y: 60, label: 'a', kind: 'bad' },
    { id: 'b', x: 380, y: 60, label: 'b', kind: 'bad' },
    { id: 'c', x: 300, y: 170, label: 'c', kind: 'bad' },
    { id: 't', x: 560, y: 110, label: 't' }
  ];
  const edges = [
    { from: 's', to: 'a', label: '−1' },
    { from: 'a', to: 'b', kind: 'bad', thick: true, label: '−2' },
    { from: 'b', to: 'c', kind: 'bad', thick: true, label: '−3' },
    { from: 'c', to: 'a', kind: 'bad', thick: true, label: '−1' },
    { from: 'b', to: 't', label: '−4' }
  ];
  const extra = text(300, 118, 'cycle total −6', 't-sm t-bad');
  return graph(640, 212, { nodes, edges, extra }, 'After negating, the cycle a → b → c → a adds up to −6. Going around it again always looks “shorter”, so Bellman-Ford has no answer to give.');
}

export function addConstant() {
  const panel = (ox, title, w, totals, winner) => {
    const nodes = [
      { id: 's', x: ox + 30, y: 110, label: 's' },
      { id: 'a', x: ox + 110, y: 176, label: 'a' },
      { id: 'b', x: ox + 190, y: 176, label: 'b' },
      { id: 't', x: ox + 270, y: 110, label: 't' }
    ];
    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
    let s = text(ox + 150, 22, title, 't-strong');
    const top = winner === 'top' ? 'accent' : 'muted';
    const bot = winner === 'bottom' ? 'accent' : 'muted';
    s += edge(byId.s, byId.t, { kind: top, thick: winner === 'top', bend: -70, label: w[0] });
    s += edge(byId.s, byId.a, { kind: bot, thick: winner === 'bottom', label: w[1], labelSide: -1 });
    s += edge(byId.a, byId.b, { kind: bot, thick: winner === 'bottom', label: w[2] });
    s += edge(byId.b, byId.t, { kind: bot, thick: winner === 'bottom', label: w[3], labelSide: -1 });
    for (const n of nodes) s += node(n);
    s += text(ox + 150, 228, totals, 't-sm');
    return s;
  };
  let body = panel(10, 'Original', ['4', '2', '−1', '2'], 'top path 4 · bottom path 3 ✓', 'bottom');
  body += `<path d="M320,40 L320,236" class="grid"/>`;
  body += panel(330, 'Add 1 to every edge', ['5', '3', '0', '3'], 'top path 5 ✓ · bottom path 6', 'top');
  return frame(640, 244, body, 'The 3-edge path gets +3, the 1-edge path gets only +1. The winner flips.');
}

// ---------- Q4: penguins and bridges ----------

export function penguins(withSource) {
  const nodes = [
    { id: 'p1', x: 170, y: 50, label: 'P1', kind: 'accent' },
    { id: 'p2', x: 170, y: 150, label: 'P2', kind: 'accent' },
    { id: 'p3', x: 170, y: 250, label: 'P3', kind: 'accent' },
    { id: 'a', x: 320, y: 50, label: 'a' },
    { id: 'b', x: 320, y: 150, label: 'b' },
    { id: 'c', x: 460, y: 100, label: 'c' },
    { id: 'd', x: 320, y: 250, label: 'd' },
    { id: 'e', x: 460, y: 250, label: 'e', kind: 'good', sub: 'safe: no way out' }
  ];
  const edges = [
    { from: 'p1', to: 'a', bend: -14 },
    { from: 'a', to: 'p1', bend: -14 },
    { from: 'p2', to: 'b' },
    { from: 'b', to: 'c', bend: -14 },
    { from: 'c', to: 'b', bend: -14 },
    { from: 'a', to: 'c' },
    { from: 'p3', to: 'd', kind: withSource ? 'good' : 'plain', thick: withSource },
    { from: 'd', to: 'e', kind: withSource ? 'good' : 'plain', thick: withSource }
  ];
  if (withSource) {
    nodes.push({ id: 's', x: 40, y: 150, label: 's', kind: 'warn', sub: 'fake start' });
    for (const p of ['p1', 'p2', 'p3']) edges.push({ from: 's', to: p, kind: 'warn', dashed: true });
  }
  const caption = withSource
    ? 'One DFS from the fake vertex s reaches everything any penguin can reach. It finds e, so the answer is Yes.'
    : 'P1 and P2 are stuck going in circles. P3 can slide to e, which has no outgoing edges, so P3 survives.';
  return graph(560, 290, { nodes, edges }, caption);
}

export function mstMandatory() {
  const nodes = [
    { id: 'A', x: 90, y: 70, label: 'A' },
    { id: 'B', x: 280, y: 40, label: 'B' },
    { id: 'C', x: 460, y: 90, label: 'C' },
    { id: 'D', x: 360, y: 210, label: 'D' },
    { id: 'E', x: 130, y: 210, label: 'E' }
  ];
  const edges = [
    { from: 'A', to: 'B', undirected: true, kind: 'good', thick: true, label: '4' },
    { from: 'B', to: 'C', undirected: true, kind: 'accent', thick: true, label: '1' },
    { from: 'C', to: 'D', undirected: true, kind: 'bad', dashed: true, label: '2 ✕' },
    { from: 'B', to: 'D', undirected: true, kind: 'accent', thick: true, label: '2' },
    { from: 'D', to: 'E', undirected: true, kind: 'accent', thick: true, label: '3' },
    { from: 'A', to: 'D', undirected: true, kind: 'muted', label: '5' },
    { from: 'E', to: 'A', undirected: true, kind: 'muted', label: '6' }
  ];
  let extra = legend(20, 262, [
    { kind: 'good', label: 'mandatory (added first)', shape: 'line' },
    { kind: 'accent', label: 'Kruskal picked', shape: 'line' },
    { kind: 'bad', label: 'forbidden', shape: 'dash' },
    { kind: 'muted', label: 'skipped', shape: 'line' }
  ]);
  extra += text(520, 200, 'total = 4 + 1 + 2 + 3', 't-sm', 'start');
  extra += text(520, 218, '= 10', 't-strong', 'start');
  return graph(640, 274, { nodes, edges, extra }, 'A–B is added before Kruskal starts. C–D is deleted. Then Kruskal runs as usual: 1, 2, 3, skipping 5 and 6 because they would make cycles.');
}

// ---------- Q5: Karatsuba ----------

export function karatsubaGrid() {
  let body = '';
  const x0 = 70;
  const y0 = 44;
  const c = 92;
  body += text(x0 + c / 2, y0 - 12, 'b₀', 't-strong');
  body += text(x0 + c * 1.5, y0 - 12, 'b₁', 't-strong');
  body += text(x0 - 16, y0 + c / 2 - 20, 'a₀', 't-strong');
  body += text(x0 - 16, y0 + c * 1.5 - 20 - 26, 'a₁', 't-strong');
  const ch = 64;
  body += box(x0, y0, c - 4, ch - 4, 'cell cell-accent', 'a₀b₀', 'cell-t');
  body += box(x0 + c, y0, c - 4, ch - 4, 'cell cell-warn', 'a₀b₁', 'cell-t');
  body += box(x0, y0 + ch, c - 4, ch - 4, 'cell cell-warn', 'a₁b₀', 'cell-t');
  body += box(x0 + c, y0 + ch, c - 4, ch - 4, 'cell cell-accent', 'a₁b₁', 'cell-t');
  body += `<rect x="${x0 - 8}" y="${y0 - 8}" width="${2 * c + 12}" height="${2 * ch + 12}" rx="8" class="region-dash"/>`;
  body += text(x0 + c, y0 + 2 * ch + 24, '(a₀ + a₁)(b₀ + b₁) = all four boxes', 't-sm');
  const tx0 = 320;
  body += text(tx0, 50, 'Naive: multiply all 4 boxes.', 't-dim', 'start');
  body += text(tx0, 84, 'Karatsuba: only 3 multiplications', 't-strong', 'start');
  body += text(tx0, 110, '① a₀b₀', 't-accent', 'start');
  body += text(tx0, 132, '② a₁b₁', 't-accent', 'start');
  body += text(tx0, 154, '③ (a₀ + a₁)(b₀ + b₁)', '', 'start');
  body += text(tx0, 184, 'orange middle = ③ − ① − ②', 't-warn', 'start');
  return frame(640, 214, body, 'The two orange boxes are the middle term. You get them for free by subtracting the blue ones from the whole square.');
}

export function polySplit() {
  let body = '';
  for (let i = 0; i < 8; i++) {
    const x = 40 + i * 70;
    const low = i < 4;
    body += box(x, 30, 62, 32, `cell ${low ? 'cell-accent' : 'cell-warn'}`, `a_{${i}}`, 'cell-t');
  }
  body += `<path d="M44,74 L${40 + 4 * 70 - 12},74" class="e e-accent"/>`;
  body += `<path d="M${40 + 4 * 70 + 4},74 L${40 + 8 * 70 - 12},74" class="e e-warn"/>`;
  body += text(40 + 2 * 70 - 4, 96, 'A₀(x) = low half', 't-accent');
  body += text(40 + 6 * 70 - 4, 96, 'A₁(x) = high half, shifted by x^{4}', 't-warn');
  return frame(640, 118, body, 'n = 7: eight coefficients. A(x) = A₀(x) + A₁(x)·x⁴. Each half is a degree-3 polynomial.');
}

// ---------- Q6: subarrays ----------

const ARR = [-2, 1, -3, 4, -1, 2, 1, -5, 4];

export function subarrayBars() {
  const zero = 112;
  const s = 15;
  let body = `<path d="M24,${zero} L616,${zero}" class="e e-muted"/>`;
  ARR.forEach((v, i) => {
    const x = 40 + i * 64;
    const best = i >= 3 && i <= 6;
    const h = Math.abs(v) * s;
    const y = v >= 0 ? zero - h : zero;
    body += `<rect x="${x}" y="${y}" width="44" height="${h}" rx="3" class="${best ? 'bar-accent' : 'bar'}"/>`;
    body += text(x + 22, v >= 0 ? y - 6 : y + h + 15, String(v), best ? 't-strong' : 't-dim');
  });
  const x1 = 40 + 3 * 64 - 6;
  const x2 = 40 + 6 * 64 + 50;
  body += `<rect x="${x1}" y="18" width="${x2 - x1}" height="${zero + 70 - 18}" rx="8" class="region-dash"/>`;
  body += text((x1 + x2) / 2, 196, '4 − 1 + 2 + 1 = 6', 't-strong t-accent');
  return frame(640, 210, body, 'The best stretch is worth taking the −1 in the middle, because it connects 4 to 2 + 1.');
}

export function kadaneRow() {
  const best = [];
  ARR.forEach((v, i) => best.push(i === 0 ? v : Math.max(best[i - 1] + v, v)));
  let body = text(20, 44, 'A[i]', 't-sm t-dim', 'start');
  body += text(20, 104, 'best ending here', 't-sm t-dim', 'start');
  ARR.forEach((v, i) => {
    const x = 128 + i * 55;
    body += box(x, 26, 46, 28, 'cell cell-plain', String(v), 'cell-t');
    const fresh = i > 0 && best[i] === v && best[i - 1] + v < v;
    const top = best[i] === 6;
    body += box(x, 86, 46, 28, top ? 'cell cell-accent' : 'cell cell-plain', String(best[i]), top ? 'cell-t t-strong' : 'cell-t');
    body += `<path d="M${x + 23},56 L${x + 23},82" class="e e-muted" marker-end="url(#ah-muted)"/>`;
    if (i > 0) {
      body += `<path d="M${x - 8},100 L${x - 2},100" class="e e-muted"/>`;
    }
    if (fresh) body += text(x + 23, 132, 'fresh', 't-sm t-warn');
  });
  return frame(640, 146, body, 'best = max(previous best + A[i], A[i]). “fresh” marks where the old total was dragging things down, so we start over. The answer is the biggest number in the bottom row: 6.');
}

export function taxiPath() {
  const u = 24;
  const ox = 140;
  const oy = 190;
  const P = (x, y) => ({ x: ox + x * u, y: oy - y * u });
  let body = '';
  for (let x = -5; x <= 4; x++) body += `<path d="M${P(x, -1).x},${P(x, -1).y} L${P(x, 7).x},${P(x, 7).y}" class="grid"/>`;
  for (let y = -1; y <= 7; y++) body += `<path d="M${P(-5, y).x},${P(-5, y).y} L${P(4, y).x},${P(4, y).y}" class="grid"/>`;
  const pts = [[0, 0], [0, 4], [3, 4], [3, 6], [-4, 6]];
  const vecs = ['(0, 4)', '(3, 0)', '(0, 2)', '(−7, 0)'];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = P(...pts[i]);
    const b = P(...pts[i + 1]);
    const t = toward(b, a, 3);
    body += `<path d="M${a.x},${a.y} L${r1(t.x)},${r1(t.y)}" class="e e-accent e-thick" marker-end="url(#ah-accent)"/>`;
  }
  const o = P(0, 0);
  const end = P(-4, 6);
  body += `<path d="M${o.x},${o.y + 14} L${end.x},${o.y + 14}" class="e e-warn e-dash"/>`;
  body += `<path d="M${end.x - 14},${o.y} L${end.x - 14},${end.y}" class="e e-warn e-dash"/>`;
  body += text((o.x + end.x) / 2, o.y + 30, '|X| = 4', 't-sm t-warn');
  body += text(end.x - 22, (o.y + end.y) / 2, '|Y| = 6', 't-sm t-warn', 'end');
  body += `<circle cx="${o.x}" cy="${o.y}" r="5" class="dot"/>`;
  body += `<circle cx="${end.x}" cy="${end.y}" r="5" class="dot-accent"/>`;
  body += text(o.x + 8, o.y + 16, 'start', 't-sm t-dim', 'start');
  body += text(end.x, end.y - 12, 'end (−4, 6)', 't-sm t-strong');
  const tx0 = 370;
  body += text(tx0, 50, 'Steps taken:', 't-strong', 'start');
  vecs.forEach((v, i) => (body += text(tx0, 76 + i * 22, `${i + 1}.  ${v}`, 't-mono', 'start')));
  body += text(tx0, 184, 'size = |−4| + |6| = 10', 't-strong t-accent', 'start');
  return frame(640, 232, body, 'Each vector is a step on a grid. Size is how far from the start you end up, counting blocks east/west plus blocks north/south.');
}

export function fourSigns() {
  const cx = 130;
  const cy = 100;
  const d = 66;
  let body = `<path d="M${cx},${cy - d} L${cx + d},${cy} L${cx},${cy + d} L${cx - d},${cy} Z" class="region-dash"/>`;
  const dirs = [
    [1, -1, 'X + Y'],
    [1, 1, 'X − Y'],
    [-1, -1, '−X + Y'],
    [-1, 1, '−X − Y']
  ];
  for (const [sx, sy, label] of dirs) {
    const win = label === '−X + Y';
    const ex = cx + sx * 50;
    const ey = cy + sy * 50;
    body += `<path d="M${cx},${cy} L${ex},${ey}" class="e ${win ? 'e-accent e-thick' : 'e-muted'}" marker-end="url(#ah-${win ? 'accent' : 'muted'})"/>`;
    body += text(cx + sx * 76, cy + sy * 66 + 4, label, win ? 't-sm t-accent t-strong' : 't-sm t-dim');
  }
  const tx0 = 300;
  body += text(tx0, 42, 'With X = −4, Y = 6:', 't-strong', 'start');
  const rows = [
    ['X + Y', '2'],
    ['X − Y', '−10'],
    ['−X + Y', '10  ← the max, equals |X| + |Y|'],
    ['−X − Y', '−2']
  ];
  rows.forEach(([a, b], i) => {
    const win = i === 2;
    body += text(tx0, 72 + i * 26, a, win ? 't-mono t-accent' : 't-mono', 'start');
    body += text(tx0 + 80, 72 + i * 26, `= ${b}`, win ? 't-mono t-accent' : 't-mono t-dim', 'start');
  });
  return frame(640, 200, body, 'One of the four sign choices always matches the real signs of X and Y. That one gives |X| + |Y|, and the others come out smaller.');
}

// ---------- Q7: sprinklers ----------

const ZONES = [
  [2, 6],
  [5, 7],
  [4, 9],
  [8, 12],
  [13, 14],
  [11, 15],
  [16, 19],
  [17, 20]
];

export function sprinklers() {
  const D = 20;
  const x0 = 50;
  const unit = 560 / D;
  const X = (t) => x0 + (t - 1) * unit;
  const rowH = 24;
  const top = 34;
  const axisY = top + ZONES.length * rowH + 8;
  const placed = [];
  const triggers = new Set();
  ZONES.forEach(([l, r], i) => {
    if (!placed.some((p) => p >= l && p <= r)) {
      placed.push(r);
      triggers.add(i);
    }
  });
  let body = '';
  for (let t = 1; t <= D; t++) {
    body += text(X(t), axisY + 16, String(t), 't-sm t-dim');
  }
  body += `<path d="M${X(1) - 6},${axisY} L${X(D) + 6},${axisY}" class="e e-muted"/>`;
  ZONES.forEach(([l, r], i) => {
    const y = top + i * rowH;
    const trig = triggers.has(i);
    body += `<rect x="${r1(X(l) - 5)}" y="${y}" width="${r1(X(r) - X(l) + 10)}" height="16" rx="8" class="span ${trig ? 'span-accent span-strong' : 'span-plain'}"/>`;
    body += text(X(l) - 12, y + 12.5, `[${l}, ${r}]`, 't-sm t-dim', 'end');
  });
  placed.forEach((p, i) => {
    body += `<path d="M${X(p)},${top - 12} L${X(p)},${axisY}" class="e e-good e-thick"/>`;
    body += `<path d="M${X(p) - 6},${top - 20} L${X(p) + 6},${top - 20} L${X(p)},${top - 10} Z" class="tri-good"/>`;
    body += text(X(p) + 9, top - 12, `S${i + 1}`, 't-sm t-good t-strong', 'start');
  });
  return frame(640, axisY + 30, body, 'Zones sorted by right end, top to bottom. Each bold zone wasn’t watered yet when we reached it, so it got a sprinkler at its right end (green lines). 4 sprinklers, and the 4 bold zones don’t overlap at all, so 4 is the minimum.');
}

export function sprinklerExchange() {
  const X = (t) => 60 + (t - 1) * 50;
  let body = '';
  const zones = [
    [2, 6, 'first zone to end', true],
    [4, 9, '', false],
    [5, 7, '', false]
  ];
  zones.forEach(([l, r, label, first], i) => {
    const y = 30 + i * 28;
    body += `<rect x="${X(l) - 5}" y="${y}" width="${X(r) - X(l) + 10}" height="18" rx="9" class="span ${first ? 'span-accent span-strong' : 'span-plain'}"/>`;
    if (label) body += text(X(r) + 14, y + 13, label, 't-sm t-dim', 'start');
  });
  body += `<path d="M${X(3)},20 L${X(3)},122" class="e e-muted e-dash"/>`;
  body += text(X(3), 140, 'optimal put it here', 't-sm t-dim');
  body += `<path d="M${X(6)},20 L${X(6)},122" class="e e-good e-thick"/>`;
  body += text(X(6), 140, 'slide it to the right end', 't-sm t-good');
  body += `<path d="M${X(3) + 6},116 L${X(6) - 8},116" class="e e-good" marker-end="url(#ah-good)"/>`;
  return frame(640, 156, body, 'Sliding the first sprinkler right, up to the first zone’s end, never un-waters anything. Every zone it touched ends at or after that point.');
}

// ---------- Q8: Sasha's party ----------

const Q8_NODES = [
  { id: 'f1', x: 60, y: 60, label: 'f₁', kind: 'accent', sub: 'friend' },
  { id: 'f2', x: 60, y: 210, label: 'f₂', kind: 'accent', sub: 'friend' },
  { id: 's1', x: 260, y: 40, label: 'S₁', kind: 'good', sub: 'gift shop' },
  { id: 'a', x: 260, y: 135, label: 'a' },
  { id: 's2', x: 260, y: 230, label: 'S₂', kind: 'good', sub: 'gift shop' },
  { id: 'p', x: 460, y: 135, label: 'p', kind: 'warn', sub: 'party' }
];
const Q8_EDGES = [
  ['f1', 's1', '3'],
  ['f1', 'a', '1'],
  ['a', 'p', '2'],
  ['s1', 'p', '4'],
  ['f2', 's2', '2'],
  ['s2', 'a', '1']
];

export function q8Problem() {
  const edges = Q8_EDGES.map(([from, to, label]) => ({ from, to, label }));
  const extra =
    text(520, 70, 'f₁ direct: 1 + 2 = 3', 't-sm t-dim', 'start') +
    text(520, 88, '(no gift! not allowed)', 't-sm t-bad', 'start') +
    text(520, 116, 'f₁ via S₁: 3 + 4 = 7', 't-sm', 'start') +
    text(520, 144, 'f₂ via S₂: 2 + 1 + 2 = 5', 't-sm', 'start') +
    text(520, 180, 'answer = max(7, 5) = 7', 't-sm t-strong', 'start');
  return graph(680, 262, { nodes: Q8_NODES, edges, extra }, 'A small example. The shortest route for f₁ skips the gift shop, so it doesn’t count.');
}

export function q8Reversed() {
  const edges = Q8_EDGES.map(([from, to, label]) => ({ from: to, to: from, label, kind: 'accent' }));
  const nodes = Q8_NODES.map((n) => (n.id === 'p' ? { ...n, sub: 'start here' } : n));
  const under =
    `<circle cx="460" cy="135" r="46" class="ripple"/>` + `<circle cx="460" cy="135" r="78" class="ripple"/>`;
  return graph(560, 262, { nodes, edges, under }, 'Every arrow flipped. One Dijkstra from p now spreads outward and reaches every friend, giving each friend’s distance to the party in one run.');
}

export function q8Layers() {
  // Shops are staggered (x 210 / 270) so the vertical 0-cost drops don't pass through other nodes.
  const lay = (c, which) => {
    const top = which === 'top';
    return [
      { id: `f1${which}`, x: 70, y: c - 30, label: 'f₁', r: 15, kind: top ? 'muted' : 'accent' },
      { id: `f2${which}`, x: 70, y: c + 30, label: 'f₂', r: 15, kind: top ? 'muted' : 'accent' },
      { id: `s1${which}`, x: 210, y: c - 30, label: 'S₁', r: 15, kind: 'good' },
      { id: `s2${which}`, x: 270, y: c + 30, label: 'S₂', r: 15, kind: 'good' },
      { id: `a${which}`, x: 390, y: c + 14, label: 'a', r: 15 },
      { id: `p${which}`, x: 520, y: c, label: 'p', r: 15, kind: top ? 'warn' : 'muted' }
    ];
  };
  const nodes = [...lay(94, 'top'), ...lay(284, 'bot')];
  const edges = [];
  for (const w of ['top', 'bot']) {
    for (const [from, to] of Q8_EDGES) {
      edges.push({ from: to + w, to: from + w, kind: 'muted', bend: to === 'a' && from === 'f1' ? -22 : 0 });
    }
  }
  edges.push({ from: 's1top', to: 's1bot', kind: 'good', thick: true, label: '0', labelSide: -1 });
  edges.push({ from: 's2top', to: 's2bot', kind: 'good', thick: true, label: '0' });
  const under = box(20, 44, 600, 104, 'layer') + box(20, 234, 600, 104, 'layer');
  let extra = text(24, 34, 'Copy 2: no gift yet', 't-strong', 'start');
  extra += text(24, 224, 'Copy 1: got a gift', 't-strong t-accent', 'start');
  extra += text(542, 98, '← start', 't-sm t-warn', 'start');
  extra += text(96, 358, '↑ read the friends’ answers here', 't-sm t-accent', 'start');
  extra += text(290, 196, 'the only way down is a gift shop', 't-sm t-good', 'start');
  return graph(640, 370, { nodes, edges, under, extra }, 'Two copies of the reversed graph. The only way from the top copy to the bottom one is a 0-cost drop at a gift shop, so every friend reached in the bottom copy got a gift.');
}

export function q8bLayers() {
  const lay = (c, which) => {
    const walk = which === 'w';
    return [
      { id: `p${which}`, x: 70, y: c, label: 'p', r: 15, kind: walk ? 'warn' : 'plain' },
      { id: `a${which}`, x: 210, y: c - 30, label: 'a', r: 15 },
      { id: `b${which}`, x: 290, y: c + 30, label: 'b', r: 15 },
      { id: `d${which}`, x: 420, y: c, label: 'd', r: 15, kind: 'accent' }
    ];
  };
  const nodes = [...lay(94, 'w'), ...lay(284, 'b')];
  const edges = [
    { from: 'pw', to: 'aw', label: '3' },
    { from: 'aw', to: 'dw', label: '5' },
    { from: 'pb', to: 'bb', label: '2', labelSide: -1 },
    { from: 'ab', to: 'bb', label: '1' },
    { from: 'bb', to: 'db', label: '3', labelSide: -1 }
  ];
  for (const v of ['p', 'a', 'b', 'd']) {
    edges.push({ from: `${v}w`, to: `${v}b`, kind: 'warn', dashed: true, both: true });
  }
  const under = box(20, 40, 470, 112, 'layer') + box(20, 230, 470, 112, 'layer');
  let extra = text(96, 140, 'Walking copy', 't-strong', 'start');
  extra += text(96, 330, 'Bus copy', 't-strong', 'start');
  extra += text(510, 98, '← start: p, walking', 't-sm t-warn', 'start');
  extra += text(510, 184, 'orange = switch', 't-sm t-warn', 'start');
  extra += text(510, 200, 'mode (cost 1)', 't-sm t-warn', 'start');
  extra += text(510, 280, 'end: whichever', 't-sm t-accent', 'start');
  extra += text(510, 296, 'copy of d is closer', 't-sm t-accent', 'start');
  return graph(640, 352, { nodes, edges, under, extra }, 'Which copy you’re in tells you how you’re traveling. Walk edges live only up top, bus edges only below, and switching means taking an orange edge.');
}

export function q8bScale() {
  const n = 4;
  const cell = 7;
  const paths = [
    { name: 'Path A', time: 5, sw: 3 },
    { name: 'Path B', time: 5, sw: 1, best: true },
    { name: 'Path C', time: 6, sw: 0 }
  ];
  let body = text(20, 24, `Example with n = ${n}, so each unit of time = n + 1 = 5 cells, each switch = 1 cell.`, 't-sm t-dim', 'start');
  paths.forEach((p, i) => {
    const y = 46 + i * 40;
    body += text(20, y + 15, p.name, p.best ? 't-strong t-accent' : 't-strong', 'start');
    body += text(86, y + 15, `time ${p.time}, ${p.sw} switch${p.sw === 1 ? '' : 'es'}`, 't-sm t-dim', 'start');
    let x = 230;
    for (let t = 0; t < p.time; t++) {
      body += `<rect x="${x}" y="${y}" width="${(n + 1) * cell - 2}" height="20" rx="3" class="cell ${p.best ? 'cell-accent' : 'cell-plain'}"/>`;
      x += (n + 1) * cell;
    }
    for (let s = 0; s < p.sw; s++) {
      body += `<rect x="${x}" y="${y}" width="${cell - 2}" height="20" rx="2" class="cell cell-warn"/>`;
      x += cell;
    }
    const total = p.time * (n + 1) + p.sw;
    body += text(x + 8, y + 15, `= ${total}${p.best ? '  ← smallest' : ''}`, p.best ? 't-sm t-strong t-accent' : 't-sm', 'start');
  });
  return frame(640, 170, body, 'Time is measured in big blocks and switches in tiny ones. Even the most switches possible (n) is less than one big block, so time always decides first.');
}
