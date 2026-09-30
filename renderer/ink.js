// Handwriting directly on the page (the problem, the steps, the answer).
//
// Input: an Apple Pencil always writes; fingers keep scrolling and tapping. On a Mac the
// "Ink" palette turns the mouse into a pen while it's open.
//
// Anchoring: every stroke is stored relative to the card it starts on (problem, a step, the
// answer…), so when steps are revealed and the page grows, the ink moves with its card.
// Drawing: one viewport-sized canvas over the scroll area, redrawn on scroll, so long pages
// never need a giant bitmap.

// The same six inks as the iPad's Paper (ios/Sources/Paper.swift), in the same order: picking a
// color, the highlighter or the eraser in either place picks it in both.
const COLORS = ['#1f2937', '#2663eb', '#db2626', '#17a34a', '#9433eb', '#eb7514'];
const HIGHLIGHT = '#facc15';
const DARK_INK = '#e5e7eb'; // "black" ink is drawn light in dark mode

export function createInk({ scroll, host, onChange, onTool }) {
  const canvas = document.createElement('canvas');
  canvas.id = 'ink-canvas';
  host.append(canvas);
  const ctx = canvas.getContext('2d');

  const palette = document.createElement('div');
  palette.id = 'ink-palette';
  palette.hidden = true;
  host.append(palette);

  let strokes = [];        // strokes for the current part
  let history = [];        // undo stack: {type:'add', stroke} | {type:'erase', removed:[...]}
  let tool = 'pen';        // 'pen' | 'highlighter' | 'eraser'
  let colorIndex = 0;
  let color = COLORS[0];
  let squeezing = false;
  let open = false;        // palette open (and, on a Mac, mouse drawing on)
  let live = null;         // stroke being drawn
  let erasedNow = null;
  const dark = window.matchMedia('(prefers-color-scheme: dark)');

  // ---------- geometry ----------

  const anchorOf = (target) => {
    const card = target.closest?.('.problem, .step, .attempt, .answer, .takeaway, .next-card');
    if (!card) return { name: 'page', el: scroll.querySelector('.page') };
    if (card.classList.contains('step')) return { name: `step-${card.dataset.index}`, el: card };
    const name = ['problem', 'attempt', 'answer', 'takeaway', 'next-card'].find((c) => card.classList.contains(c));
    return { name, el: card };
  };

  const elForAnchor = (name) => {
    if (name === 'page') return scroll.querySelector('.page');
    if (name.startsWith('step-')) return scroll.querySelector(`.step[data-index="${name.slice(5)}"]`);
    return scroll.querySelector(`.${name}`);
  };

  const resize = () => {
    const r = scroll.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.style.left = `${scroll.offsetLeft}px`;
    canvas.style.top = `${scroll.offsetTop}px`;
    canvas.style.width = `${r.width}px`;
    canvas.style.height = `${r.height}px`;
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  };

  // ---------- drawing ----------

  // Settings can force light or dark; otherwise follow the system.
  const isDark = () => {
    const t = document.documentElement.dataset.theme;
    return t ? t === 'dark' : dark.matches;
  };
  const inkColor = (c) => (c === COLORS[0] && isDark() ? DARK_INK : c);

  function paint(stroke, ox, oy, scale) {
    const p = stroke.p;
    if (p.length < 3) return;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (stroke.h) {
      ctx.globalAlpha = 0.32;
      ctx.strokeStyle = stroke.c;
      ctx.lineWidth = 16 * scale;
      ctx.beginPath();
      ctx.moveTo(ox + p[0] * scale, oy + p[1] * scale);
      for (let i = 3; i < p.length; i += 3) ctx.lineTo(ox + p[i] * scale, oy + p[i + 1] * scale);
      ctx.stroke();
      ctx.restore();
      return;
    }
    ctx.strokeStyle = inkColor(stroke.c);
    if (p.length === 3) {
      ctx.fillStyle = ctx.strokeStyle;
      ctx.beginPath();
      ctx.arc(ox + p[0] * scale, oy + p[1] * scale, 1.6 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
    // Smooth with midpoints; width follows Pencil pressure.
    for (let i = 3; i < p.length; i += 3) {
      const x0 = ox + p[i - 3] * scale;
      const y0 = oy + p[i - 2] * scale;
      const x1 = ox + p[i] * scale;
      const y1 = oy + p[i + 1] * scale;
      const pressure = p[i + 2] || 0.5;
      ctx.lineWidth = (1.1 + pressure * 2.6) * scale;
      ctx.beginPath();
      if (i >= 6) {
        const xm = (ox + p[i - 6] * scale + x0) / 2;
        const ym = (oy + p[i - 5] * scale + y0) / 2;
        ctx.moveTo(xm, ym);
        ctx.quadraticCurveTo(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      } else {
        ctx.moveTo(x0, y0);
      }
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }
    ctx.restore();
  }

  function draw() {
    const cr = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, cr.width, cr.height);
    const rects = {};
    const all = live ? [...strokes, live] : strokes;
    for (const s of all) {
      if (!(s.a in rects)) {
        const el = elForAnchor(s.a);
        rects[s.a] = el ? el.getBoundingClientRect() : null;
      }
      const r = rects[s.a];
      if (!r) continue; // its card isn't on the page right now (e.g. the answer is hidden)
      const scale = r.width / s.w;
      paint(s, r.left - cr.left, r.top - cr.top, scale);
    }
  }

  let queued = false;
  const redraw = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      draw();
    });
  };

  // ---------- input ----------

  const isPen = (e) => e.pointerType === 'pen' || (open && e.pointerType === 'mouse');
  const erasing = () => tool === 'eraser' || squeezing;

  function localPoint(e, anchorEl) {
    const r = anchorEl.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top, r.width];
  }

  function eraseAt(e) {
    const cr = canvas.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    const keep = [];
    for (const s of strokes) {
      const el = elForAnchor(s.a);
      if (!el) { keep.push(s); continue; }
      const r = el.getBoundingClientRect();
      const scale = r.width / s.w;
      let hit = false;
      for (let i = 0; i < s.p.length && !hit; i += 3) {
        const dx = r.left + s.p[i] * scale - x;
        const dy = r.top + s.p[i + 1] * scale - y;
        if (dx * dx + dy * dy < (s.h ? 150 : 90)) hit = true;
      }
      if (hit) erasedNow.push(s);
      else keep.push(s);
    }
    if (keep.length !== strokes.length) {
      strokes = keep;
      redraw();
    }
    void cr;
  }

  scroll.addEventListener('pointerdown', (e) => {
    if (!isPen(e) || e.button > 0) return;
    if (e.target.closest('#ink-palette')) return;
    e.preventDefault();
    try {
      scroll.setPointerCapture(e.pointerId); // keep the stroke even if the pen leaves the page
    } catch {}
    if (erasing()) {
      erasedNow = [];
      eraseAt(e);
      return;
    }
    const { name, el } = anchorOf(e.target);
    const [x, y, w] = localPoint(e, el);
    live = { a: name, w, c: color, h: tool === 'highlighter', p: [round(x), round(y), round(e.pressure || 0.5)], el };
    redraw();
  });

  scroll.addEventListener('pointermove', (e) => {
    if (!isPen(e)) return;
    if (erasedNow) {
      eraseAt(e);
      return;
    }
    if (!live) return;
    e.preventDefault();
    const coalesced = e.getCoalescedEvents?.() ?? [];
    const events = coalesced.length ? coalesced : [e];
    for (const ev of events) {
      const [x, y] = localPoint(ev, live.el);
      live.p.push(round(x), round(y), round(ev.pressure || 0.5));
    }
    redraw();
  });

  const finish = (e) => {
    if (!isPen(e)) return;
    if (erasedNow) {
      if (erasedNow.length) {
        history.push({ type: 'erase', removed: erasedNow });
        onChange(strokes);
      }
      erasedNow = null;
      return;
    }
    if (!live) return;
    const { el, ...stroke } = live;
    void el;
    live = null;
    strokes.push(stroke);
    history.push({ type: 'add', stroke });
    onChange(strokes);
    redraw();
  };
  scroll.addEventListener('pointerup', finish);
  scroll.addEventListener('pointercancel', finish);

  // The Pencil must not scroll the page or trigger taps; fingers still do both.
  scroll.addEventListener('touchstart', (e) => {
    if ([...e.touches].some((t) => t.touchType === 'stylus')) e.preventDefault();
  }, { passive: false });
  scroll.addEventListener('touchmove', (e) => {
    if ([...e.touches].some((t) => t.touchType === 'stylus')) e.preventDefault();
  }, { passive: false });

  scroll.addEventListener('scroll', redraw, { passive: true });
  window.addEventListener('resize', resize);
  new ResizeObserver(resize).observe(scroll);
  dark.addEventListener?.('change', redraw);

  // ---------- palette ----------

  function renderPalette() {
    palette.replaceChildren();
    const btn = (label, title, active, onclick, cls = '') => {
      const b = document.createElement('button');
      b.className = `ink-btn ${cls}${active ? ' on' : ''}`;
      b.title = title;
      b.innerHTML = label;
      b.onclick = onclick;
      palette.append(b);
      return b;
    };
    COLORS.forEach((c, i) => {
      const b = btn('', 'Ink color', tool === 'pen' && colorIndex === i, () => setTool('pen', i), 'swatch');
      b.style.setProperty('--swatch', i === 0 ? 'var(--text)' : c);
    });
    btn('<span class="hl"></span>', 'Highlighter', tool === 'highlighter', () => setTool(tool === 'highlighter' ? 'pen' : 'highlighter', colorIndex));
    btn('Eraser', 'Eraser (Pencil: double-tap, or squeeze and hold)', tool === 'eraser', () => setTool(tool === 'eraser' ? 'pen' : 'eraser', colorIndex));
    btn('Undo', 'Undo', false, undo);
    btn('Clear', 'Clear all ink on this part', false, () => {
      if (!strokes.length) return;
      history.push({ type: 'erase', removed: strokes });
      strokes = [];
      onChange(strokes);
      redraw();
    });
  }

  // Change the tool; tell the other writing surface unless the change came from it.
  function setTool(next, index, quiet = false) {
    tool = next;
    colorIndex = Math.max(0, Math.min(COLORS.length - 1, index ?? colorIndex));
    color = tool === 'highlighter' ? HIGHLIGHT : COLORS[colorIndex];
    renderPalette();
    if (!quiet) onTool?.({ tool, color: colorIndex });
  }

  function undo() {
    const last = history.pop();
    if (!last) return;
    if (last.type === 'add') strokes = strokes.filter((s) => s !== last.stroke);
    else strokes = [...strokes, ...last.removed];
    onChange(strokes);
    redraw();
  }

  renderPalette();

  return {
    // Load the ink for a newly shown part.
    load(saved) {
      strokes = Array.isArray(saved) ? saved : [];
      history = [];
      live = null;
      requestAnimationFrame(resize);
    },
    redraw: () => requestAnimationFrame(resize),
    toggle(force) {
      open = force ?? !open;
      palette.hidden = !open;
      scroll.classList.toggle('inking', open);
      return open;
    },
    get open() { return open; },
    // Apple Pencil gestures forwarded from the native app.
    pencil(action, data) {
      if (action === 'toggle-eraser') return setTool(tool === 'eraser' ? 'pen' : 'eraser');
      if (action === 'sync') return setTool(data.tool, data.color, true); // from the Paper
      if (action === 'squeeze-on') squeezing = true;
      if (action === 'squeeze-off') squeezing = false;
      renderPalette();
    }
  };
}

const round = (v) => Math.round(v * 10) / 10;
