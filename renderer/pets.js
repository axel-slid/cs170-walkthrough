// Pixel pets. Each pet is a 16×16 sprite written as text, one character per pixel
// ('.' is transparent). Eye pixels ('E') close when the pet blinks or sleeps.

export const PETS = {
  penguin: {
    name: 'Penguin',
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
  }
};

// One SVG per sprite state. crispEdges keeps every pixel square.
export function spriteSVG(kind, { closed = false, size = 64 } = {}) {
  const pet = PETS[kind];
  let rects = '';
  pet.rows.forEach((row, y) => {
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
export function createPet(host) {
  const el = document.createElement('div');
  el.id = 'pet';
  el.innerHTML = '<div class="pet-bubble"></div><div class="pet-body"></div>';
  host.append(el);
  const body = el.querySelector('.pet-body');
  const bubble = el.querySelector('.pet-bubble');

  let kind = null;
  let x = 0; // walking offset in px
  let facing = 1;
  let asleep = false;
  let lastActive = Date.now();
  let bubbleTimer = null;
  let blinkTimer = null;
  let moveTimer = null;

  const draw = (closed = false) => {
    if (!kind) return;
    body.innerHTML = spriteSVG(kind, { closed });
  };

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
      if (!asleep && kind) {
        draw(true);
        setTimeout(() => !asleep && draw(false), 140);
      }
      blink();
    }, 2500 + Math.random() * 3500);
  };

  // Every few seconds: maybe wander a little, or fall asleep if you've been away.
  const wander = () => {
    clearTimeout(moveTimer);
    moveTimer = setTimeout(() => {
      if (kind && !asleep) {
        if (Date.now() - lastActive > 90000) {
          asleep = true;
          el.classList.add('asleep');
          draw(true);
          say('z z z', 2600);
        } else if (Math.random() < 0.55) {
          const target = Math.round((Math.random() - 0.7) * 160); // mostly leftward of home
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

  el.addEventListener('click', () => {
    wake();
    play('jump', 600);
    say(CHEERS[Math.floor(Math.random() * CHEERS.length)]);
  });
  for (const type of ['keydown', 'pointerdown']) document.addEventListener(type, wake, { passive: true });

  return {
    set(next) {
      kind = next && PETS[next] ? next : null;
      el.hidden = !kind;
      if (!kind) return;
      asleep = false;
      el.classList.remove('asleep');
      draw(false);
      blink();
      wander();
    },
    happy(big = false) {
      if (!kind) return;
      wake();
      play(big ? 'jump' : 'hop', big ? 700 : 500);
      say(big ? '♥ ♥ ♥' : '♥', 1300);
    },
    sad() {
      if (!kind) return;
      wake();
      play('droop', 900);
      say('…', 1100);
    }
  };
}
