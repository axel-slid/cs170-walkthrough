// Pixel pets. Each pet is a 16×16 sprite written as text, one character per pixel
// ('.' is transparent). Eye pixels ('E') close when the pet blinks or sleeps.


// Birds share one body plan: folded wings at rest, raised wings mid-flap.
const BIRD_REST = [
  '................',
  '......HHHH......',
  '.....HHHHHH.....',
  '....HHEHHEHH....',
  '....HHHOOHHH....',
  '....BBBOOBBB....',
  '...WBBBBBBBBW...',
  '...WBBLLLLBBW...',
  '...WBBLLLLBBW...',
  '...WWBLLLLBWW...',
  '....WBBLLBBW....',
  '.....BBBBBB.....',
  '......BBBB......',
  '.....OO..OO.....',
  '................',
  '................'
];
const BIRD_FLAP = [
  '................',
  '......HHHH......',
  'WW...HHHHHH...WW',
  '.WW.HHEHHEHH.WW.',
  '..WWHHHOOHHHWW..',
  '...WWBBOOBBWW...',
  '....BBBBBBBB....',
  '....BBLLLLBB....',
  '....BBLLLLBB....',
  '.....BLLLLB.....',
  '.....BBLLBB.....',
  '......BBBB......',
  '.......OO.......',
  '................',
  '................',
  '................'
];
const bird = (name, colors, trick) => ({ name, bird: true, trick, colors: { E: '#111318', O: '#f59e0b', ...colors }, rows: BIRD_REST, flap: BIRD_FLAP });

export const PETS = {
  penguin: {
    name: 'Penguin',
    // Can't really fly: flaps like mad and wobbles slowly down, then belly-slides.
    bird: true,
    slow: true,
    trick: 'slide',
    flap: [
      '................',
      '.....KKKKKK.....',
      '....KKKKKKKK....',
      '...KKWWKKWWKK...',
      'K..KKWEKKEWKK..K',
      'KK.KKKKOOKKKK.KK',
      '.KKKKPWOOWPKKKK.',
      '..KKWWWWWWWWKK..',
      '...KWWWWWWWWK...',
      '....WWWWWWWW....',
      '....WWWWWWWW....',
      '....WWWWWWWW....',
      '....KWWWWWWK....',
      '.....KKKKKK.....',
      '....OOO..OOO....',
      '................'
    ],
    colors: { K: '#1f2433', W: '#f4f5f7', E: '#111318', O: '#f59e0b', P: '#f9a8c4' },
    rows: [
      '................',
      '.....KKKKKK.....',
      '....KKKKKKKK....',
      '...KKWWKKWWKK...',
      '...KKWEKKEWKK...',
      '...KKKKOOKKKK...',
      '..KKKPWOOWPKKK..',
      '..KKWWWWWWWWKK..',
      '.KKKWWWWWWWWKKK.',
      '.KK.WWWWWWWW.KK.',
      '.K..WWWWWWWW..K.',
      '....WWWWWWWW....',
      '....KWWWWWWK....',
      '.....KKKKKK.....',
      '....OOO..OOO....',
      '................'
    ]
  },
  cat: {
    name: 'Cat',
    trick: 'feet', // always lands on its feet
    colors: { O: '#f59e42', D: '#c26a1b', E: '#1f2433', P: '#f472b6', W: '#fff7ed' },
    rows: [
      '................',
      '..O.........O...',
      '..OO.......OO...',
      '..OPO.....OPO...',
      '..OOOODOODOOO...',
      '..OOEOOOOOEOO...',
      '..OOOOOPOOOOO...',
      '..OOOOWWWOOOO...',
      '...OOOOOOOOO....',
      '....ODODODO.....',
      '...OOOOOOOOO....',
      '..OOOOWWWOOOO..O',
      '..OOOWWWWWOOO.O.',
      '..OOOOOOOOOOOO..',
      '...OO.OO.OO.OO..',
      '................'
    ]
  },
  dog: {
    name: 'Dog',
    trick: 'tail', // chases its tail
    colors: { B: '#8b5a2b', T: '#e8b56a', E: '#1f2433', K: '#1f2433', P: '#f472b6', W: '#fff7ed' },
    rows: [
      '................',
      '..BB.......BB...',
      '.BBBB.....BBBB..',
      '.BBBTTTTTTTBBB..',
      '.BB.TTTTTTT.BB..',
      '....TETTTTET....',
      '....TTTWWTTT....',
      '....TTTKKTTTT...',
      '.....TTPPTTT....',
      '....TTTTTTTTT...',
      '...TTTWWWWWTTT..',
      '...TTTWWWWWTTT.B',
      '...TTTTTTTTTTTB.',
      '...TT.TT..TT.TT.',
      '................',
      '................'
    ]
  },
  frog: {
    name: 'Frog',
    trick: 'leap', // leaps away in arcs
    colors: { G: '#4caf50', D: '#2e7d32', L: '#c5e8b7', W: '#ffffff', E: '#1f2433', R: '#7a2e2e' },
    rows: [
      '................',
      '...GGG....GGG...',
      '..GWWEG..GEWWG..',
      '..GWWWG..GWWWG..',
      '..GGGGGGGGGGGG..',
      '.GGGDGGGGGGDGGG.',
      '.GGGGGGGGGGGGGG.',
      '.GGRRRRRRRRRRGG.',
      '.GGGRRRRRRRRGGG.',
      '..GGLLLLLLLLGG..',
      '..GGLLLLLLLLGG..',
      '..GGGLLLLLLGGG..',
      '.GGG.GGGGGG.GGG.',
      'GGG..........GGG',
      '................',
      '................'
    ]
  },
  bunny: {
    name: 'Bunny',
    trick: 'binky', // a happy jump-twist, then hops
    colors: { W: '#f3f4f6', S: '#b8bcc6', P: '#f9a8c4', E: '#1f2433', N: '#e11d74' },
    rows: [
      '....SS....SS....',
      '....SP....PS....',
      '....SP....PS....',
      '....SW....WS....',
      '...SWWSSSSWWS...',
      '..SWWWWWWWWWWS..',
      '..SWEWWWWWWEWS..',
      '..SWWWWWNWWWWS..',
      '..SPWWWWWWWWPS..',
      '...SWWWWWWWWS...',
      '..SWWWWWWWWWWS..',
      '.SWWWWWWWWWWWWS.',
      '.SWWWWWWWWWWWWS.',
      '..SWWWWWWWWWWS..',
      '...SWS....SWS...',
      '................'
    ]
  },
  dragon: {
    name: 'Dragon',
    trick: 'fire', // glides on its wings and breathes fire
    bird: true,
    flap: [
      'AA............AA',
      'AAAY........YAAA',
      '.AAYY......YYAA.',
      '..DDDDDDDDDDDD..',
      '.DDDDDDDDDDDDDD.',
      '.DDEDDDDDDDEDDD.',
      '.DDDDDDDDDDDDDD.',
      '.DDDRDDDDDRDDDD.',
      '..DDDDDDDDDDDD..',
      '...DDDLLLLDDD...',
      '..DDDLLLLLLDD...',
      '..DDLLLLLLLLDD..',
      '..DDLLLLLLLLDD.D',
      '...DDDDDDDDDD.DD',
      '...DD.....DD.DD.',
      '................'
    ],
    colors: { D: '#7c3aed', L: '#c4b5fd', Y: '#fbbf24', A: '#a78bfa', E: '#fef08a', R: '#4c1d95' },
    rows: [
      '................',
      '..Y.........Y...',
      '..YY.......YY...',
      '..DDDDDDDDDDD...',
      '.DDDDDDDDDDDDD..',
      '.DDEDDDDDDDEDD..',
      '.DDDDDDDDDDDDDD.',
      '.DDDRDDDDDRDDDD.',
      '..DDDDDDDDDDDD.A',
      '...DDDLLLLDDD.AA',
      '..DDDLLLLLLDDAAA',
      '..DDLLLLLLLLDDAA',
      '..DDLLLLLLLLDD.D',
      '...DDDDDDDDDD.DD',
      '...DD.....DD.DD.',
      '................'
    ]
  },
  parrot: bird('Parrot', { H: '#ef4444', B: '#22c55e', W: '#2563eb', L: '#fde047' }, 'squawk'),
  owl: bird('Owl', { H: '#7c4a1e', B: '#8b5a2b', W: '#5c3a1a', L: '#e9d5b0' }, 'hoot'),
  bluebird: bird('Bluebird', { H: '#3b82f6', B: '#60a5fa', W: '#1d4ed8', L: '#fb923c' }, 'sing')
};

// A gravestone for pets that were left alone too long.
const TOMB = {
  colors: { S: '#9ca3af', D: '#6b7280', G: '#4caf50', L: '#d1d5db' },
  rows: [
    '................',
    '................',
    '.....SSSSSS.....',
    '....SLLLLLLS....',
    '...SLLLLLLLLS...',
    '...SLDLDLDLLS...',
    '...SLDDLDDLLS...',
    '...SLDLDLDLLS...',
    '...SLLLLLLLLS...',
    '...SLLLLLLLLS...',
    '...SLLLLLLLLS...',
    '...SLLLLLLLLS...',
    '..GSSSSSSSSSSG..',
    '.GGGGGGGGGGGGGG.',
    '................',
    '................'
  ]
};
export function tombSVG(size = 48) {
  let rects = '';
  TOMB.rows.forEach((row, y) => [...row].forEach((ch, x) => {
    if (TOMB.colors[ch]) rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${TOMB.colors[ch]}"/>`;
  }));
  return `<svg viewBox="0 0 16 16" width="${size}" height="${size}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}

// Pet food, 8×8 pixel art.
export const FOOD = {
  snack: { colors: { C: '#d4a05a', d: '#5b3a1e' }, rows: ['..CCCC..', '.CCdCCC.', 'CCCCCdCC', 'CdCCCCCC', 'CCCCdCCC', 'CCdCCCCC', '.CCCCdC.', '..CCCC..'] },
  meal: { colors: { r: '#ef4444', g: '#22c55e', y: '#fde047', B: '#3b82f6' }, rows: ['........', '..rgyr..', '.grygrg.', 'BBBBBBBB', '.BBBBBB.', '.BBBBBB.', '..BBBB..', '........'] },
  cake: { colors: { R: '#f97316', Y: '#fde68a', P: '#f472b6', W: '#fff1f2' }, rows: ['...R....', '...Y....', '.PPPPPP.', '.WWWWWW.', '.PPPPPP.', '.WWWWWW.', '.PPPPPP.', '........'] }
};
export function foodSVG(id, size = 32) {
  const f = FOOD[id];
  let rects = '';
  f.rows.forEach((row, y) => [...row].forEach((ch, x) => {
    if (f.colors[ch]) rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${f.colors[ch]}"/>`;
  }));
  return `<svg viewBox="0 0 8 8" width="${size}" height="${size}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}

// One SVG per sprite state. crispEdges keeps every pixel square.
export function spriteSVG(kind, { closed = false, size = 64, flap = false } = {}) {
  const pet = PETS[kind];
  let rects = '';
  (flap && pet.flap ? pet.flap : pet.rows).forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === '.') return;
      let color = pet.colors[ch];
      if (ch === 'E' && closed) color = pet.colors.K ?? pet.colors.D ?? '#1f2433';
      if (!color) return;
      // A closed eye is a flat line: draw only the lower half of the pixel.
      const h = ch === 'E' && closed ? 0.45 : 1;
      rects += `<rect x="${x}" y="${y + 1 - h}" width="1" height="${h}" fill="${color}"/>`;
    });
  });
  return `<svg viewBox="0 0 16 16" width="${size}" height="${size}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}

const CHEERS = [
  'You got this!',
  'One step at a time.',
  'Dijkstra believes in you.',
  'Nice work!',
  'Recursion leap of faith!',
  'Keep going!',
  'Big-O of awesome.',
  'Snack break soon?'
];

// The pet widget that lives in the corner of the page.
// care: { get(kind) → { hunger, hearts } (0–100 each), foods() → [{ id, name, count, hunger, hearts }],
//         feed(kind, id) → true if fed, petted(kind), openShop() }
export function createPet(host, care = {}) {
  const el = document.createElement('div');
  el.id = 'pet';
  el.innerHTML =
    '<div class="pet-panel" hidden></div><div class="pet-bubble"></div><div class="pet-body"></div>' +
    '<div class="pet-bars" title="Hunger and hearts. Tap your pet to feed it."><i class="bar-hunger"><b></b></i><i class="bar-hearts"><b></b></i></div>';
  host.append(el);
  const body = el.querySelector('.pet-body');
  const bubble = el.querySelector('.pet-bubble');
  const panel = el.querySelector('.pet-panel');
  const bars = el.querySelector('.pet-bars');

  let kind = null;
  let x = 0; // walking offset in px
  let facing = 1;
  let asleep = false;
  let lastActive = Date.now();
  let bubbleTimer = null;
  let blinkTimer = null;
  let moveTimer = null;

  const draw = (closed = false, flap = false) => {
    if (!kind) return;
    body.innerHTML = spriteSVG(kind, { closed, flap });
  };

  // Wing beats for birds while they're held or flying.
  let flapTimer = null;
  const flapping = (on) => {
    clearInterval(flapTimer);
    if (!on || !PETS[kind]?.bird) return draw(false);
    let up = false;
    flapTimer = setInterval(() => draw(false, (up = !up)), PETS[kind].slow ? 80 : 110);
  };

  // ---------- hunger and hearts ----------

  const status = () => (kind && care.get ? care.get(kind) : { hunger: 100, hearts: 100 });
  const mood = (h) => (h >= 70 ? 'Full' : h >= 40 ? 'Peckish' : h > 0 ? 'Hungry' : 'Starving');

  function refresh() {
    if (!kind) return;
    const c = status();
    bars.querySelector('.bar-hunger b').style.width = `${c.hunger}%`;
    bars.querySelector('.bar-hearts b').style.width = `${c.hearts}%`;
    el.classList.toggle('hungry', c.hunger < 25);
    el.classList.toggle('sick', !!c.sick);
    if (!panel.hidden) renderPanel();
  }

  function renderPanel() {
    const c = status();
    panel.replaceChildren();
    const head = document.createElement('div');
    head.className = 'pp-head';
    head.innerHTML = `<b>${PETS[kind].name}</b>`;
    const x = document.createElement('button');
    x.className = 'pp-x';
    x.textContent = '×';
    x.title = 'Close';
    x.onclick = () => closePanel();
    head.append(x);
    panel.append(head);

    const hunger = document.createElement('div');
    hunger.className = 'pp-row';
    hunger.innerHTML = `<span class="pp-lab">Hunger</span><span class="pp-bar hunger"><b style="width:${c.hunger}%"></b></span><span class="pp-val">${mood(c.hunger)}</span>`;
    const hearts = document.createElement('div');
    hearts.className = 'pp-row';
    const full = Math.round(c.hearts / 20);
    hearts.innerHTML = `<span class="pp-lab">Hearts</span><span class="pp-hearts">${[0, 1, 2, 3, 4].map((i) => `<i class="${i < full ? 'on' : ''}">♥</i>`).join('')}</span>`;
    panel.append(hunger, hearts);
    if (c.sick) {
      const warn = document.createElement('div');
      warn.className = 'pp-warn';
      warn.textContent = `${PETS[kind].name} is sick from being left alone. Answer a question within ${c.daysLeft} day${c.daysLeft === 1 ? '' : 's'} or it will die.`;
      panel.append(warn);
    }

    const foods = care.foods?.() ?? [];
    const row = document.createElement('div');
    row.className = 'pp-food';
    for (const f of foods) {
      const b = document.createElement('button');
      b.className = 'pp-item';
      b.disabled = !f.count;
      b.title = `${f.name}: fills ${f.hunger}% of the hunger bar`;
      b.innerHTML = `${foodSVG(f.id, 24)}<span>${f.name}</span><em>×${f.count}</em>`;
      b.onclick = () => {
        if (!care.feed?.(kind, f.id)) return;
        wake();
        play('jump', 700);
        say(['Yum!', 'Nom nom', 'Thank you!', '♥ ♥'][Math.floor(Math.random() * 4)], 1400);
        refresh();
      };
      row.append(b);
    }
    panel.append(row);
    if (!foods.some((f) => f.count)) {
      const shop = document.createElement('button');
      shop.className = 'pp-shop';
      shop.textContent = 'No food left. Get some in the shop →';
      shop.onclick = () => {
        closePanel();
        care.openShop?.();
      };
      panel.append(shop);
    }
  }

  function openPanel() {
    const h = host.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    panel.classList.toggle('flip', r.left - h.left < 200);
    panel.hidden = false;
    bubble.classList.remove('show');
    renderPanel();
  }
  function closePanel() {
    panel.hidden = true;
  }
  document.addEventListener('pointerdown', (e) => {
    if (!panel.hidden && !el.contains(e.target)) closePanel();
  });
  setInterval(refresh, 60000);

  const say = (text, ms = 1600) => {
    clearTimeout(bubbleTimer);
    bubble.textContent = text;
    bubble.classList.add('show');
    bubbleTimer = setTimeout(() => bubble.classList.remove('show'), ms);
  };

  const play = (cls, ms) => {
    el.classList.remove('hop', 'droop', 'jump');
    void el.offsetWidth; // restart the animation
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), ms);
  };

  const wake = () => {
    lastActive = Date.now();
    if (asleep) {
      asleep = false;
      el.classList.remove('asleep');
      draw(false);
    }
  };

  const blink = () => {
    clearTimeout(blinkTimer);
    blinkTimer = setTimeout(() => {
      if (!asleep && kind && !busy) {
        draw(true);
        setTimeout(() => !asleep && !busy && draw(false), 140);
      }
      blink();
    }, 2500 + Math.random() * 3500);
  };

  // Every few seconds: maybe wander a little, or fall asleep if you've been away.
  const wander = () => {
    clearTimeout(moveTimer);
    moveTimer = setTimeout(() => {
      if (kind && !asleep && !busy) {
        if (Date.now() - lastActive > 90000) {
          asleep = true;
          el.classList.add('asleep');
          draw(true);
          say('z z z', 2600);
        } else if (status().sick && Math.random() < 0.45) {
          play('droop', 900);
          say(['Please study with me…', 'I don’t feel good…', 'Answer one question?'][Math.floor(Math.random() * 3)], 2400);
        } else if (status().hunger < 25 && Math.random() < 0.3) {
          play('droop', 900);
          say(status().hunger > 0 ? 'I’m hungry…' : 'So… hungry…', 2200);
        } else if (Math.random() < 0.55) {
          const right = parseFloat(el.style.right) || 22;
          const homeLeft = host.clientWidth - right - el.offsetWidth;
          let target = Math.round((Math.random() - 0.7) * 160); // mostly leftward of home
          target = Math.max(-homeLeft + 8, Math.min(right - 8, target));
          facing = target < x ? -1 : 1;
          x = target;
          el.style.setProperty('--walk', `${x}px`);
          el.style.setProperty('--face', facing);
          el.classList.add('walking');
          setTimeout(() => el.classList.remove('walking'), 1600);
        }
      } else if (kind && asleep && Math.random() < 0.3) {
        say('z z z', 2600);
      }
      wander();
    }, 4000 + Math.random() * 4000);
  };

  // Drag the pet anywhere. Let go and a bird flaps and glides back down to the floor;
  // everyone else drops and bounces. A tap without dragging still gets a pep talk.
  let busy = false; // being held or in the air
  let drag = null;
  el.addEventListener('pointerdown', (e) => {
    if (!kind || busy || e.button > 0 || e.target.closest('.pet-panel')) return;
    e.preventDefault();
    wake();
    const r = el.getBoundingClientRect();
    drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, dx: e.clientX - r.left, dy: e.clientY - r.top, moved: false };
    try { el.setPointerCapture(e.pointerId); } catch {}
  });
  el.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 6) return;
    if (!drag.moved) {
      drag.moved = true;
      busy = true;
      drag.floor = parseFloat(getComputedStyle(el).bottom) || 40;
      el.classList.remove('walking', 'hop', 'jump', 'droop', 'asleep');
      el.classList.add('held');
      x = 0;
      el.style.setProperty('--walk', '0px');
      bubble.classList.remove('show');
      closePanel();
      flapping(true);
    }
    const h = host.getBoundingClientRect();
    const left = Math.max(0, Math.min(h.width - el.offsetWidth, e.clientX - h.left - drag.dx));
    const top = Math.max(0, Math.min(h.height - el.offsetHeight, e.clientY - h.top - drag.dy));
    const prev = parseFloat(el.style.left);
    if (!Number.isNaN(prev) && Math.abs(left - prev) > 1) el.style.setProperty('--face', left < prev ? -1 : 1);
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
    el.style.right = 'auto';
    el.style.bottom = 'auto';
  });
  const release = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag;
    drag = null;
    if (!d.moved) {
      if (!panel.hidden) return closePanel();
      care.petted?.(kind);
      play('jump', 600);
      openPanel();
      refresh();
      return;
    }
    el.classList.remove('held');
    // Let go past the page's edge, toward the iPad's Paper: the pet moves over to the Paper.
    const edge = paperEdge(e);
    if (edge) return toPaper(edge);
    land(d.floor);
  };

  // ---------- visiting the Paper (iPad) ----------

  let onPaper = false;
  // Which side the Paper is on, if the pointer was released past it: right (landscape) or bottom (portrait).
  function paperEdge(e) {
    if (!care.toPaper || !care.paperOpen?.()) return null;
    const h = host.getBoundingClientRect();
    if (e.clientX > h.right - 6) return { edge: 'right', at: (e.clientY - h.top) / h.height };
    if (e.clientY > h.bottom - 6 && window.innerHeight > window.innerWidth) return { edge: 'bottom', at: (e.clientX - h.left) / h.width };
    return null;
  }

  function toPaper({ edge, at }) {
    const P = PETS[kind];
    care.toPaper({ rows: P.rows, flap: P.flap ?? null, colors: P.colors, bird: !!P.bird, slow: !!P.slow, edge, at: Math.max(0, Math.min(1, at)) });
    flapping(false);
    onPaper = true;
    el.hidden = true;
    busy = false;
  }

  // Back from the Paper: appear at the page's edge where it was dropped, then land.
  function fromPaper(edge, at) {
    if (!kind) return;
    onPaper = false;
    el.hidden = false;
    el.style.top = el.style.left = el.style.right = el.style.bottom = '';
    const floor = parseFloat(getComputedStyle(el).bottom) || 14;
    const h = host.getBoundingClientRect();
    const w = el.offsetWidth || 64;
    const left = edge === 'bottom' ? Math.max(0, Math.min(h.width - w, at * h.width - w / 2)) : h.width - w - 4;
    const top = edge === 'bottom' ? h.height - floor - el.offsetHeight - 120 : Math.max(0, Math.min(h.height - el.offsetHeight, at * h.height - el.offsetHeight / 2));
    x = 0;
    el.style.setProperty('--walk', '0px');
    el.style.setProperty('--face', edge === 'bottom' ? 1 : -1);
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
    el.style.right = 'auto';
    el.style.bottom = 'auto';
    busy = true;
    wake();
    if (PETS[kind].bird) flapping(true);
    land(floor);
  }
  el.addEventListener('pointerup', release);
  el.addEventListener('pointercancel', release);

  function land(floor) {
    const isBird = !!PETS[kind]?.bird;
    const h = host.getBoundingClientRect();
    const w = el.offsetWidth;
    const y0 = parseFloat(el.style.top) || 0;
    const x0 = parseFloat(el.style.left) || 0;
    const yEnd = h.height - floor - el.offsetHeight;
    const face = Number(el.style.getPropertyValue('--face')) || 1;
    // Birds glide forward a little as they come down; the rest fall straight.
    const xEnd = isBird ? Math.max(0, Math.min(h.width - w, x0 + face * Math.min(120, Math.max(40, (yEnd - y0) * 0.35)))) : x0;
    const t0 = performance.now();
    const trick = PETS[kind]?.trick;
    let vy = 0;
    let y = y0;
    let bounced = 0;
    let lastNote = 0;
    el.classList.add('flying');
    if (!isBird) flapping(false);
    const stepFrame = (now) => {
      if (isBird) {
        const slow = !!PETS[kind].slow;
        const dur = slow ? Math.max(1400, Math.min(3600, (yEnd - y0) * 6.5)) : Math.max(500, Math.min(1500, (yEnd - y0) * 3.2));
        const t = Math.min(1, (now - t0) / dur);
        const ease = slow ? t : 1 - (1 - t) * (1 - t); // birds slow down to land; the penguin just sinks
        const wobble = slow ? Math.sin(t * Math.PI * 6) * 12 * (1 - t) : 0;
        el.style.top = `${y0 + (yEnd - y0) * ease}px`;
        el.style.left = `${Math.max(0, Math.min(h.width - w, x0 + (xEnd - x0) * ease * (slow ? 0.4 : 1) + wobble))}px`;
        if (trick === 'sing' && now - lastNote > 260) {
          lastNote = now;
          spawnNote();
        }
        if (t < 1) return requestAnimationFrame(stepFrame);
      } else {
        vy += 0.9;
        y += vy;
        if (trick === 'feet') {
          // A full flip on the way down, feet first at the end.
          body.style.rotate = `${Math.min(1, (y - y0) / Math.max(1, yEnd - y0)) * 360 * face}deg`;
          if (y >= yEnd) {
            body.style.rotate = '';
            el.style.top = `${yEnd}px`;
            return settle(x0, w, h.width);
          }
          el.style.top = `${y}px`;
          return requestAnimationFrame(stepFrame);
        }
        if (y >= yEnd) {
          y = yEnd;
          vy = -vy * 0.35;
          bounced += 1;
          if (bounced > 2 || Math.abs(vy) < 2) {
            el.style.top = `${yEnd}px`;
            return settle(x0, w, h.width);
          }
        }
        el.style.top = `${y}px`;
        return requestAnimationFrame(stepFrame);
      }
      settle(xEnd, w, h.width);
    };
    requestAnimationFrame(stepFrame);
  }

  // Back to normal layout: anchored to the bottom, at the spot where it landed.
  function settle(left, w, hostW) {
    flapping(false);
    el.classList.remove('flying');
    el.style.top = '';
    el.style.left = '';
    el.style.bottom = '';
    el.style.right = `${Math.max(0, hostW - left - w)}px`;
    lastActive = Date.now();
    doTrick(PETS[kind]?.trick).finally(() => {
      busy = false;
    });
  }

  // ---------- tricks after landing ----------

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const leftNow = () => host.clientWidth - (parseFloat(el.style.right) || 22) - el.offsetWidth;
  const faceNow = () => Number(el.style.getPropertyValue('--face')) || 1;
  const setFace = (f) => el.style.setProperty('--face', f);

  // Moves along the floor (with an optional hop arc), then commits the new spot.
  async function moveBy(dx, { ms = 600, arc = 0, easing = 'ease-out' } = {}) {
    const left = leftNow();
    const target = Math.max(4, Math.min(host.clientWidth - el.offsetWidth - 4, left + dx));
    dx = target - left;
    const frames = arc
      ? [{ translate: '0 0' }, { translate: `${dx / 2}px ${-arc}px`, offset: 0.5 }, { translate: `${dx}px 0` }]
      : [{ translate: '0 0' }, { translate: `${dx}px 0` }];
    await el.animate(frames, { duration: ms, easing: arc ? 'ease-in-out' : easing }).finished;
    el.style.right = `${host.clientWidth - target - el.offsetWidth}px`;
  }

  // Little things that float off the pet (music notes, fire).
  function spawnBit(cls, text, dx, dy, ms, color) {
    const r = el.getBoundingClientRect();
    const hr = host.getBoundingClientRect();
    const b = document.createElement('span');
    b.className = cls;
    if (text) b.textContent = text;
    if (color) b.style.background = color;
    b.style.left = `${r.left - hr.left + r.width / 2}px`;
    b.style.top = `${r.top - hr.top + r.height * 0.35}px`;
    host.append(b);
    b.animate([{ translate: '0 0', opacity: 1 }, { translate: `${dx}px ${dy}px`, opacity: 0 }], { duration: ms, easing: 'ease-out' }).finished.then(() => b.remove());
  }
  const spawnNote = () => spawnBit('pet-note', Math.random() < 0.5 ? '♪' : '♫', (Math.random() - 0.5) * 40, -60 - Math.random() * 30, 1300);

  const PARROT = ['Squawk! O(n log n)!', 'Dijkstra! Dijkstra!', 'Polly wants a proof!', 'Big-O! Big-O!', 'Squawk! Master theorem!', 'Topo sort! Squawk!'];

  async function doTrick(trick) {
    switch (trick) {
      case 'slide': {
        say('Wheee!', 1400);
        body.style.rotate = `${-80 * faceNow()}deg`;
        await moveBy(faceNow() * 150, { ms: 1100, easing: 'cubic-bezier(.15,.7,.3,1)' });
        body.style.rotate = '';
        play('hop', 500);
        break;
      }
      case 'feet':
        play('hop', 500);
        say(['Nailed it.', 'Obviously.', 'Mrrp.'][Math.floor(Math.random() * 3)], 1500);
        break;
      case 'tail': {
        say('Woof! Woof!', 1500);
        for (let i = 0; i < 10; i++) {
          setFace(-faceNow());
          await wait(90);
        }
        play('hop', 500);
        break;
      }
      case 'leap': {
        say('Ribbit!', 1400);
        const dir = faceNow() || -1;
        await moveBy(dir * 70, { ms: 420, arc: 55 });
        await moveBy(dir * 70, { ms: 420, arc: 45 });
        break;
      }
      case 'binky': {
        await el.animate([{ translate: '0 0' }, { translate: '0 -42px', offset: 0.5 }, { translate: '0 0' }], { duration: 520, easing: 'ease-in-out' }).finished;
        body.animate([{ rotate: '0deg' }, { rotate: '-25deg', offset: 0.3 }, { rotate: '25deg', offset: 0.7 }, { rotate: '0deg' }], { duration: 520 });
        say('♥', 1200);
        const dir = faceNow();
        for (let i = 0; i < 3; i++) await moveBy(dir * 28, { ms: 230, arc: 14 });
        break;
      }
      case 'fire': {
        say('Rawr!', 1400);
        const dir = faceNow();
        for (let i = 0; i < 18; i++) {
          const c = ['#f97316', '#fbbf24', '#ef4444', '#fde047'][i % 4];
          spawnBit('pet-fire', '', dir * (60 + Math.random() * 70), (Math.random() - 0.5) * 36, 500 + Math.random() * 300, c);
          if (i % 3 === 2) await wait(40);
        }
        play('hop', 500);
        break;
      }
      case 'squawk':
        play('jump', 600);
        say(PARROT[Math.floor(Math.random() * PARROT.length)], 2000);
        break;
      case 'hoot': {
        for (let i = 0; i < 4; i++) {
          setFace(-faceNow());
          await wait(240);
        }
        say('Hoo?', 1400);
        break;
      }
      case 'sing':
        say('Tweet!', 1300);
        for (let i = 0; i < 3; i++) {
          spawnNote();
          await wait(200);
        }
        break;
      default:
        play('hop', 500);
    }
  }

  // The page can get narrower (Paper opening beside it, rotation): keep the pet on screen.
  function keepOnScreen() {
    if (!kind || busy) return;
    const w = el.offsetWidth || 64;
    const maxRight = host.clientWidth - w - 4;
    const right = parseFloat(el.style.right);
    if (!Number.isNaN(right) && right > maxRight) el.style.right = `${Math.max(4, maxRight)}px`;
    x = 0;
    el.style.setProperty('--walk', '0px');
  }
  new ResizeObserver(keepOnScreen).observe(host);
  for (const type of ['keydown', 'pointerdown']) document.addEventListener(type, wake, { passive: true });

  return {
    set(next) {
      const changed = next !== kind;
      kind = next && PETS[next] ? next : null;
      if (changed && onPaper) {
        onPaper = false;
        care.recallFromPaper?.();
      }
      el.hidden = !kind || onPaper;
      if (!kind) return;
      asleep = false;
      el.classList.remove('asleep');
      draw(false);
      closePanel();
      refresh();
      blink();
      wander();
    },
    refresh,
    fromPaper,
    say: (text, ms) => kind && say(text, ms),
    happy(big = false) {
      if (!kind) return;
      wake();
      play(big ? 'jump' : 'hop', big ? 700 : 500);
      if (status().hunger < 10) say('Too hungry to cheer…', 1600);
      else say(big ? '♥ ♥ ♥' : '♥', 1300);
      refresh();
    },
    sad() {
      if (!kind) return;
      wake();
      play('droop', 900);
      say('…', 1100);
    }
  };
}
