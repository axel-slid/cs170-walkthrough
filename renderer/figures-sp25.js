// SVG figures for the Spring 2025 Midterm 1 walkthroughs.
// Built from the shared primitives in figures.js, so they share its CSS classes.

import { text, frame, node, edge, graph, box, legend } from './figures.js';

// ---------- Q2: true/false pictures ----------

export function dagPost() {
  const nodes = [
    { id: 'A', x: 70, y: 70, label: 'A', sub: 'post 8' },
    { id: 'B', x: 220, y: 70, label: 'B', sub: 'post 5' },
    { id: 'D', x: 370, y: 70, label: 'D', kind: 'good', over: 'post 4 (smallest)' },
    { id: 'C', x: 220, y: 170, label: 'C', sub: 'post 7' }
  ];
  const edges = [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'D' },
    { from: 'A', to: 'C' },
    { from: 'C', to: 'D' }
  ];
  const extra = text(460, 66, 'D finishes first,', 't-sm', 'start') + text(460, 84, 'and D has no way out.', 't-sm t-good', 'start');
  return graph(620, 214, { nodes, edges, extra }, 'DFS from A. Any vertex with an outgoing edge has to wait for that neighbor to finish first, so the first vertex to finish can’t have one.');
}

function triangle(ox, w, label, tree) {
  const nodes = [
    { id: 'A', x: ox + 110, y: 34, label: 'A' },
    { id: 'B', x: ox + 40, y: 150, label: 'B' },
    { id: 'C', x: ox + 180, y: 150, label: 'C' }
  ];
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  let s = '';
  const pairs = [['A', 'B'], ['A', 'C'], ['B', 'C']];
  pairs.forEach(([a, b], i) => {
    const inTree = tree.includes(`${a}${b}`);
    s += edge(byId[a], byId[b], {
      undirected: true,
      kind: inTree ? 'accent' : 'muted',
      thick: inTree,
      dashed: !inTree,
      label: w[i],
      labelSide: i === 2 ? 1 : -1
    });
  });
  for (const n of nodes) s += node(n);
  if (label) s += text(ox + 110, 204, label, 't-sm t-dim');
  return s;
}

export function lightestTriangle() {
  let body = triangle(20, ['1', '1', '1'], 'three lightest edges, all weight 1', ['AB', 'AC']);
  body += text(290, 70, 'A spanning tree on 3 vertices has 2 edges.', 't-sm', 'start');
  body += text(290, 94, 'So one weight-1 edge has to be left out.', 't-sm t-bad', 'start');
  return frame(640, 216, body, 'The lightest edges can form a cycle, and a tree can’t contain a cycle.');
}

export function heaviestBridge() {
  const nodes = [
    { id: 'A', x: 130, y: 34, label: 'A' },
    { id: 'B', x: 60, y: 150, label: 'B' },
    { id: 'C', x: 200, y: 150, label: 'C' },
    { id: 'D', x: 400, y: 150, label: 'D' }
  ];
  const edges = [
    { from: 'A', to: 'B', undirected: true, kind: 'accent', thick: true, label: '1', labelSide: -1 },
    { from: 'A', to: 'C', undirected: true, kind: 'accent', thick: true, label: '2' },
    { from: 'B', to: 'C', undirected: true, kind: 'muted', dashed: true, label: '3' },
    { from: 'C', to: 'D', undirected: true, kind: 'bad', thick: true, label: '100 (heaviest)' }
  ];
  const extra = text(470, 146, 'The only way to', 't-sm', 'start') + text(470, 164, 'reach D. Every tree', 't-sm', 'start') + text(470, 182, 'must use it.', 't-sm t-bad', 'start');
  return graph(640, 200, { nodes, edges, extra }, 'The heaviest edge is still in every MST when it’s the only edge crossing a cut.');
}

export function shortestTriangle() {
  let body = triangle(20, ['5', '5', '1'], 'shortest paths from A', ['AB', 'AC']);
  body += text(290, 60, 'A → B: direct edge, length 5.', 't-sm', 'start');
  body += text(290, 84, 'A → C: direct edge, length 5.', 't-sm', 'start');
  body += text(290, 108, '(Going around through B would be 6.)', 't-sm t-dim', 'start');
  body += text(290, 140, 'The weight-1 edge B–C is never used.', 't-sm t-bad', 'start');
  return frame(640, 216, body, 'The key’s counterexample. The cheapest edge doesn’t have to be on any shortest path from s.');
}

// ---------- Q3: short answers ----------

export function k5PlusSingles() {
  let body = '';
  const cx = 130;
  const cy = 104;
  const pts = Array.from({ length: 5 }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    return { x: cx + 70 * Math.cos(a), y: cy + 70 * Math.sin(a) };
  });
  for (let i = 0; i < 5; i++)
    for (let j = i + 1; j < 5; j++)
      body += `<path d="M${pts[i].x},${pts[i].y} L${pts[j].x},${pts[j].y}" class="e e-accent"/>`;
  for (const p of pts) body += `<circle cx="${p.x}" cy="${p.y}" r="7" class="dot-accent"/>`;
  for (let i = 0; i < 5; i++) body += `<circle cx="${300 + i * 60}" cy="${cy}" r="7" class="dot"/>`;
  body += text(cx, 206, 'K₅: 5 vertices, all 10 edges', 't-sm t-accent');
  body += text(420, 150, '5 vertices with no edges', 't-sm t-dim');
  return frame(640, 220, body, 'Pack all 10 edges into as few vertices as possible. 1 big component + 5 loners = 6 components.');
}

export function bfsLayers() {
  const nodes = [
    { id: 'A', x: 60, y: 110, label: 'A', kind: 'warn' },
    { id: 'B', x: 200, y: 60, label: 'B' },
    { id: 'C', x: 200, y: 160, label: 'C' },
    { id: 'D', x: 340, y: 60, label: 'D', kind: 'accent' },
    { id: 'F', x: 340, y: 160, label: 'F', kind: 'accent' },
    { id: 'E', x: 480, y: 110, label: 'E' }
  ];
  const edges = [
    { from: 'A', to: 'B', undirected: true },
    { from: 'A', to: 'C', undirected: true },
    { from: 'B', to: 'D', undirected: true },
    { from: 'C', to: 'F', undirected: true },
    { from: 'D', to: 'E', undirected: true },
    { from: 'F', to: 'E', undirected: true },
    { from: 'C', to: 'E', undirected: true, kind: 'bad', dashed: true, bend: 150, label: '✕ C–E can’t exist', labelSide: 1, labelOffset: 16 }
  ];
  const under = `<rect x="310" y="28" width="60" height="164" rx="12" class="region-dash"/>`;
  let extra = '';
  ['dist 0', 'dist 1', 'dist 2', 'dist 3'].forEach((t, i) => (extra += text(60 + i * 140, 18, t, 't-sm t-dim')));
  extra += text(30, 244, 'remove D and F → E is cut off', 't-sm t-accent', 'start');
  return graph(560, 256, { nodes, edges, under, extra }, 'One graph that fits the distances. BFS layers can only connect to the same layer or the next one, so E (layer 3) can only touch layer-2 vertices: D and F.');
}

export function subdivide() {
  const L = [
    { id: 'u', x: 50, y: 50, label: 'u' },
    { id: 'v', x: 190, y: 50, label: 'v' }
  ];
  const R = [
    { id: 'u2', x: 330, y: 50, label: 'u' },
    { id: 'x', x: 450, y: 50, label: 'x', kind: 'muted', r: 11 },
    { id: 'v2', x: 570, y: 50, label: 'v' }
  ];
  const edges = [
    { from: 'u', to: 'v', undirected: true, label: '2', labelSide: -1 },
    { from: 'u2', to: 'x', undirected: true, label: '1', labelSide: -1 },
    { from: 'x', to: 'v2', undirected: true, label: '1', labelSide: -1 }
  ];
  let extra = `<path d="M232,50 L286,50" class="e e-muted" marker-end="url(#ah-muted)"/>`;
  extra += text(450, 96, 'new dummy vertex', 't-sm t-dim');
  return graph(640, 110, { nodes: [...L, ...R], edges, extra }, 'Split every weight-2 edge into two weight-1 edges. Now all edges are equal, and plain BFS finds shortest paths.');
}

// ---------- Q4: Dijkstra ----------

const Q4_POS = {
  A: { x: 60, y: 100 },
  B: { x: 220, y: 40 },
  C: { x: 380, y: 100 },
  D: { x: 160, y: 220 },
  E: { x: 320, y: 220 }
};
const Q4_EDGES = [
  ['A', 'B', 2],
  ['B', 'C', 2],
  ['A', 'C', 5],
  ['B', 'D', 1],
  ['D', 'C', 6],
  ['C', 'E', 2],
  ['D', 'E', 4]
];
const Q4_DIST_POS = {
  A: [30, 104, 'end'],
  B: [220, 12, 'middle'],
  C: [408, 104, 'start'],
  D: [132, 224, 'end'],
  E: [348, 224, 'start']
};

// visited: already popped; current: popped this step; dist: current labels; tree: edges to highlight
export function q4Graph({ visited = [], current = null, dist = null, tree = [], caption }) {
  const nodes = Object.entries(Q4_POS).map(([id, p]) => ({
    id,
    ...p,
    label: id,
    kind: id === current ? 'warn' : visited.includes(id) ? 'good' : 'plain'
  }));
  const inTree = (a, b) => tree.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
  const edges = Q4_EDGES.map(([a, b, w]) => ({
    from: a,
    to: b,
    undirected: true,
    label: String(w),
    kind: tree.length ? (inTree(a, b) ? 'accent' : 'muted') : 'plain',
    thick: inTree(a, b),
    labelSide: a === 'A' && b === 'C' ? -1 : a === 'D' && b === 'C' ? -1 : 1
  }));
  let extra = '';
  if (dist) {
    for (const [id, [x, y, anchor]] of Object.entries(Q4_DIST_POS)) {
      const d = dist[id];
      extra += text(x, y, d === Infinity ? '∞' : String(d), `t-strong ${id === current ? 't-warn' : 't-accent'}`, anchor);
    }
  }
  const items = [];
  if (visited.length || current) items.push({ kind: 'good', label: 'done' });
  if (current) items.push({ kind: 'warn', label: 'picked this step' });
  if (tree.length) items.push({ kind: 'accent', label: 'shortest-path tree', shape: 'line' });
  if (items.length) extra += legend(20, 276, items);
  return graph(460, dist || items.length ? 288 : 256, { nodes, edges, extra }, caption);
}

// ---------- Q5: Kruskal ----------

const Q5_POS = {
  A: { x: 60, y: 190 },
  B: { x: 210, y: 236 },
  C: { x: 400, y: 190 },
  D: { x: 130, y: 70 },
  E: { x: 290, y: 70 },
  F: { x: 400, y: 24 }
};
const Q5_SORTED = [
  ['B', 'D', 10, true],
  ['A', 'C', 20, true],
  ['B', 'C', 25, true],
  ['A', 'D', 26, false],
  ['D', 'E', 27, true],
  ['C', 'F', 30, true],
  ['A', 'B', 31, false],
  ['E', 'F', 40, false],
  ['B', 'E', 50, false]
];

// done: how many sorted edges have been processed; current: index of the edge being decided now
export function q5Graph(done, caption) {
  const nodes = Object.entries(Q5_POS).map(([id, p]) => ({ id, ...p, label: id }));
  const edges = Q5_SORTED.map(([a, b, w, add], i) => {
    const seen = i < done;
    const kind = !seen ? 'muted' : add ? 'accent' : 'bad';
    return {
      from: a,
      to: b,
      undirected: true,
      label: String(w),
      kind,
      thick: seen && add,
      dashed: seen && !add,
      labelSide: a === 'A' && b === 'C' ? -1 : 1
    };
  });
  let extra = text(470, 22, 'Sorted edges', 't-strong', 'start');
  Q5_SORTED.forEach(([a, b, w, add], i) => {
    const y = 48 + i * 24;
    const seen = i < done;
    const cls = !seen ? 't-dim' : add ? 't-accent' : 't-bad';
    extra += text(470, y, `${a}–${b}  ${w}`, `t-mono ${cls}`, 'start');
    if (seen) extra += text(566, y, add ? 'add' : 'skip', `t-sm ${cls} t-strong`, 'start');
  });
  return graph(640, 270, { nodes, edges, extra }, caption);
}

// ---------- Q6: DFS forests ----------

const Q6_POS = {
  0: { x: 280, y: 34 },
  1: { x: 210, y: 94 },
  2: { x: 350, y: 94 },
  3: { x: 120, y: 154 },
  4: { x: 280, y: 154 },
  6: { x: 420, y: 154 },
  7: { x: 180, y: 222 },
  5: { x: 350, y: 222 }
};
const Q6_EDGES = [
  ['0', '1'],
  ['0', '4'],
  ['2', '0'],
  ['2', '5'],
  ['2', '6'],
  ['1', '7'],
  ['7', '3'],
  ['3', '1']
];

export function q6Graph(mode) {
  const tree =
    mode === 'min'
      ? ['2>0', '0>1', '1>7', '7>3', '0>4', '2>5', '2>6']
      : mode === 'max'
        ? ['1>7', '7>3']
        : [];
  const nodes = Object.entries(Q6_POS).map(([id, p]) => ({
    id,
    ...p,
    label: id,
    r: 15,
    kind: mode === 'min' && id === '2' ? 'warn' : 'plain'
  }));
  const edges = Q6_EDGES.map(([a, b]) => {
    const t = tree.includes(`${a}>${b}`);
    return {
      from: a,
      to: b,
      kind: mode === 'problem' ? 'plain' : t ? 'accent' : 'muted',
      thick: t,
      dashed: mode !== 'problem' && !t,
      r: 15
    };
  });
  let under = '';
  let extra = '';
  if (mode === 'max') {
    under = `<ellipse cx="170" cy="156" rx="86" ry="96" class="blob"/>`;
    extra += text(170, 272, 'one SCC → one tree', 't-sm t-accent');
    extra += text(470, 110, '6 trees:', 't-strong', 'start');
    extra += text(470, 132, '{1, 7, 3}, and 0, 2, 4, 5, 6', 't-sm', 'start');
    extra += text(470, 150, 'each on its own', 't-sm', 'start');
  }
  if (mode === 'min') {
    extra += text(470, 98, 'start DFS at 2 →', 't-sm t-warn', 'start');
    extra += text(470, 118, 'it reaches all 8 vertices,', 't-sm', 'start');
    extra += text(470, 136, 'so 1 tree', 't-sm t-strong', 'start');
  }
  const captions = {
    problem: 'The directed graph from the exam.',
    min: 'One DFS from vertex 2 reaches everything. Blue edges are the tree, and the dashed edge is never used as a tree edge.',
    max: 'Vertices in the same SCC always end up in the same tree. So the best you can do is one tree per SCC.'
  };
  const h = mode === 'max' ? 284 : 250;
  return graph(640, h, { nodes, edges, under, extra }, captions[mode]);
}

// ---------- Q7: finding spies ----------

export function resistance() {
  const n = 16;
  const spies = new Set([5, 11]);
  const X = (i) => 150 + i * 30;
  const rounds = [
    { label: 'Round 1', groups: [[0, 3], [4, 7], [8, 11], [12, 15]] },
    { label: 'Round 2', groups: [[4, 5], [6, 7], [8, 9], [10, 11]] },
    { label: 'Round 3', groups: [[4, 4], [5, 5], [10, 10], [11, 11]] }
  ];
  let body = '';
  const alive = new Set(Array.from({ length: n }, (_, i) => i));
  rounds.forEach((r, ri) => {
    const y = 40 + ri * 62;
    body += text(20, y + 4, r.label, 't-strong', 'start');
    body += text(20, y + 20, `${r.groups.length} missions`, 't-sm t-dim', 'start');
    const failed = r.groups.map(([a, b]) => {
      for (let i = a; i <= b; i++) if (spies.has(i)) return true;
      return false;
    });
    r.groups.forEach(([a, b], gi) => {
      body += `<rect x="${X(a) - 13}" y="${y - 15}" width="${X(b) - X(a) + 26}" height="30" rx="15" class="span ${failed[gi] ? 'span-bad' : 'span-good'}"/>`;
    });
    for (let i = 0; i < n; i++) {
      body += `<circle cx="${X(i)}" cy="${y}" r="7" class="${alive.has(i) ? 'dot' : 'dot-faint'}"/>`;
    }
    r.groups.forEach(([a, b], gi) => {
      if (!failed[gi]) for (let i = a; i <= b; i++) alive.delete(i);
    });
  });
  const y = 40 + 3 * 62;
  body += text(20, y + 4, 'Done', 't-strong', 'start');
  for (let i = 0; i < n; i++) {
    body += `<circle cx="${X(i)}" cy="${y}" r="7" class="${spies.has(i) ? 'dot-bad' : 'dot-faint'}"/>`;
  }
  body += text(X(0) - 7, y + 30, 'Only s = 2 players are left, so they must be the spies.', 't-sm t-bad', 'start');
  body += legend(150, 290, [
    { kind: 'good', label: 'mission succeeded (all clear)' },
    { kind: 'bad', label: 'mission failed (a spy inside)' }
  ]);
  return frame(640, 300, body, 'n = 16 players, s = 2 spies. Each round uses 2s = 4 missions. At most 2 fail, so at least half the players get cleared, and the pool halves every round.');
}

// ---------- Q8: smallest number ----------

export function digitWindow() {
  const digits = [2, 0, 3, 3, 4];
  const rounds = [
    { start: 0, end: 2, pick: 1, so: 'A = 0' },
    { start: 2, end: 3, pick: 2, so: 'A = 03' },
    { start: 3, end: 4, pick: 3, so: 'A = 033' }
  ];
  const X = (i) => 150 + i * 56;
  let body = '';
  rounds.forEach((r, ri) => {
    const y = 26 + ri * 58;
    body += text(20, y + 22, `Pick ${ri + 1}`, 't-strong', 'start');
    body += `<rect x="${X(r.start) - 6}" y="${y - 6}" width="${(r.end - r.start) * 56 + 56}" height="46" rx="8" class="region-dash"/>`;
    digits.forEach((d, i) => {
      const cls = i === r.pick ? 'cell cell-accent' : i < r.start ? 'cell cell-faint' : 'cell cell-plain';
      body += box(X(i), y, 44, 34, cls, String(d), i === r.pick ? 'cell-t t-strong' : 'cell-t');
    });
    body += text(470, y + 22, r.so, 't-mono t-accent', 'start');
  });
  body += text(150, 206, 'dashed box = where the next digit is allowed to come from', 't-sm t-dim', 'start');
  return frame(640, 216, body, 'B = 20334, k = 3. Each pick takes the smallest digit in the window (leftmost if tied), while leaving enough digits after it to finish.');
}

// ---------- Q9: road trip ----------

export function roadTrip() {
  const bands = [
    { y: 58, label: '0 games so far', i: '0' },
    { y: 158, label: '1 game so far', i: '1' },
    { y: 288, label: '10 games (done)', i: '10' }
  ];
  const nodes = [];
  for (const b of bands) {
    nodes.push({ id: `ny${b.i}`, x: 70, y: b.y, label: 'NY', r: 16, kind: b.i === '0' ? 'warn' : 'muted' });
    nodes.push({ id: `u${b.i}`, x: 200, y: b.y, label: 'u', r: 14 });
    nodes.push({ id: `b${b.i}`, x: 330, y: b.y, label: 'b', r: 14, kind: 'good' });
    nodes.push({ id: `sf${b.i}`, x: 460, y: b.y, label: 'SF', r: 16, kind: b.i === '10' ? 'accent' : 'muted' });
  }
  const edges = [];
  for (const b of bands) {
    edges.push({ from: `ny${b.i}`, to: `u${b.i}`, undirected: true, kind: 'muted' });
    edges.push({ from: `u${b.i}`, to: `b${b.i}`, undirected: true, kind: 'muted' });
    edges.push({ from: `b${b.i}`, to: `sf${b.i}`, undirected: true, kind: 'muted' });
  }
  edges.push({ from: 'u0', to: 'b1', kind: 'good', thick: true });
  edges.push({ from: 'b0', to: 'b1', kind: 'good', thick: true, bend: -30 });
  let under = '';
  for (const b of bands) under += box(30, b.y - 34, 470, 68, 'layer');
  let extra = '';
  for (const b of bands) extra += text(512, b.y + 5, b.label, 't-sm t-strong', 'start');
  extra += text(252, 112, 'drive to b, see a game', 't-sm t-good', 'end');
  extra += text(354, 112, 'stay a night', 't-sm t-good', 'start');
  extra += text(265, 230, '⋮  9 more copies, same pattern  ⋮', 't-sm t-dim');
  extra += text(70, 336, 'BFS starts at NY in copy 0 and ends at SF in copy 10', 't-sm t-accent', 'start');
  return graph(640, 346, { nodes, edges, under, extra }, 'Copy i means “I’ve seen i games”. Roads work normally inside a copy. The only way up a copy is to end a day in a baseball city.');
}

// ---------- Q10: the representative ----------

export function weightedMedian() {
  const weights = [3, 1, 4, 2, 5, 1, 2];
  const heights = [40, 52, 64, 76, 88, 100, 112];
  const unit = 30;
  const x0 = 60;
  const base = 170;
  let body = '';
  let x = x0;
  let acc = 0;
  weights.forEach((w, i) => {
    const rep = i === 3;
    body += `<rect x="${x + 1}" y="${base - heights[i]}" width="${w * unit - 2}" height="${heights[i]}" rx="3" class="${rep ? 'bar-accent' : 'bar'}"/>`;
    body += text(x + (w * unit) / 2, base + 16, `w=${w}`, rep ? 't-sm t-accent t-strong' : 't-sm t-dim');
    acc += w;
    x += w * unit;
  });
  const half = x0 + 9 * unit;
  body += `<path d="M${half},22 L${half},${base}" class="e e-warn e-dash"/>`;
  body += text(half, 16, 'W/2 = 9', 't-sm t-warn t-strong');
  body += `<path d="M${x0},${base + 34} L${x0 + 8 * unit},${base + 34}" class="e e-muted"/>`;
  body += text(x0 + 4 * unit, base + 50, 'shorter: 3+1+4 = 8 ≤ 9', 't-sm');
  body += `<path d="M${x0 + 10 * unit},${base + 34} L${x0 + 18 * unit},${base + 34}" class="e e-muted"/>`;
  body += text(x0 + 14 * unit, base + 50, 'taller: 5+1+2 = 8 ≤ 9', 't-sm');
  return frame(640, 234, body, 'Penguins sorted by height, each bar as wide as the penguin’s weight (total W = 18). The representative is the penguin whose bar sits on the halfway line.');
}
