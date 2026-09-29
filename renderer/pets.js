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
const bird = (name, colors) => ({ name, bird: true, colors: { E: '#111318', O: '#f59e0b', ...colors }, rows: BIRD_REST, flap: BIRD_FLAP });

export const PETS = {
  penguin: {
    name: 'Penguin',
    // Can't really fly: flaps like mad and wobbles slowly down.
    bird: true,
    slow: true,
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
  parrot: bird('Parrot', { H: '#ef4444', B: '#22c55e', W: '#2563eb', L: '#fde047' }),
  owl: bird('Owl', { H: '#7c4a1e', B: '#8b5a2b', W: '#5c3a1a', L: '#e9d5b0' }),
  bluebird: bird('Bluebird', { H: '#3b82f6', B: '#60a5fa', W: '#1d4ed8', L: '#fb923c' })
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
    land(d.floor);
  };
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
    let vy = 0;
    let y = y0;
    let bounced = 0;
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
        if (t < 1) return requestAnimationFrame(stepFrame);
      } else {
        vy += 0.9;
        y += vy;
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
    busy = false;
    lastActive = Date.now();
    play('hop', 500);
  }
  for (const type of ['keydown', 'pointerdown']) document.addEventListener(type, wake, { passive: true });

  return {
    set(next) {
      kind = next && PETS[next] ? next : null;
      el.hidden = !kind;
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
