// Celebration effects, drawn on one full-window canvas with a small particle engine.
// The canvas only animates while particles exist, and ignores all pointer input.

let canvas = null;
let ctx = null;
let particles = [];
let running = false;
let last = 0;

function ensureCanvas() {
  if (canvas) return;
  canvas = document.createElement('canvas');
  canvas.id = 'fx-canvas';
  document.body.append(canvas);
  ctx = canvas.getContext('2d');
  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);
}

function start() {
  ensureCanvas();
  if (running) return;
  running = true;
  last = performance.now();
  requestAnimationFrame(frame);
}

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  const born = [];
  particles = particles.filter((p) => {
    p.age += dt;
    if (p.age >= p.life) {
      if (p.onDeath) p.onDeath(p, born);
      return false;
    }
    p.update(p, dt);
    p.draw(p);
    return true;
  });
  particles.push(...born);
  if (particles.length) requestAnimationFrame(frame);
  else {
    running = false;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (xs) => xs[Math.floor(Math.random() * xs.length)];
const CONFETTI = ['#f4b400', '#1a73e8', '#34a853', '#ea4335', '#8e44ef', '#ff7a1a', '#16b3c6', '#ff4fa3'];

// Shared physics: gravity, air drag, optional sideways flutter.
function physics(p, dt) {
  p.vy += p.gravity * dt;
  const drag = Math.pow(p.drag, dt * 60);
  p.vx *= drag;
  p.vy *= drag;
  p.x += p.vx * dt;
  p.y += p.vy * dt;
  p.rot += p.spin * dt;
}

// ---------- confetti ----------

export function confetti(x, y, count = 70) {
  for (let i = 0; i < count; i++) {
    const angle = rand(-Math.PI * 0.95, -Math.PI * 0.05);
    const speed = rand(260, 620);
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gravity: 900,
      drag: 0.965,
      rot: rand(0, Math.PI * 2),
      spin: rand(-12, 12),
      flip: rand(0, Math.PI * 2),
      flipSpeed: rand(6, 14),
      w: rand(6, 10),
      h: rand(10, 16),
      color: pick(CONFETTI),
      age: 0,
      life: rand(1.6, 2.4),
      update(p, dt) {
        physics(p, dt);
        p.flip += p.flipSpeed * dt;
        p.x += Math.sin(p.flip) * 30 * dt; // flutter
      },
      draw(p) {
        const fade = Math.min(1, (p.life - p.age) * 2.5);
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, Math.cos(p.flip)); // paper turning over
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    });
  }
  start();
}

// ---------- sparks ----------

export function sparks(x, y, count = 60) {
  for (let i = 0; i < count; i++) {
    const angle = rand(0, Math.PI * 2);
    const speed = rand(120, 460);
    particles.push({
      x, y, px: x, py: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gravity: 380,
      drag: 0.94,
      rot: 0, spin: 0,
      age: 0,
      life: rand(0.6, 1.1),
      hue: rand(38, 52),
      update(p, dt) {
        p.px = p.x;
        p.py = p.y;
        physics(p, dt);
      },
      draw(p) {
        const t = 1 - p.age / p.life;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = `hsla(${p.hue}, 100%, ${55 + 35 * t}%, ${t})`;
        ctx.lineWidth = 2.2 * t + 0.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.px - (p.x - p.px) * 2, p.py - (p.y - p.py) * 2);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.restore();
      }
    });
  }
  // A quick bright flash at the center.
  particles.push({
    x, y, age: 0, life: 0.25, rot: 0, spin: 0,
    update() {},
    draw(p) {
      const t = 1 - p.age / p.life;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 60);
      g.addColorStop(0, `rgba(255, 236, 170, ${0.9 * t})`);
      g.addColorStop(1, 'rgba(255, 200, 80, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 60, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  start();
}

// ---------- coin shower ----------

function drawCoin(r, turn) {
  // turn: -1…1, the coin's apparent width as it spins
  const w = Math.max(0.12, Math.abs(turn));
  ctx.save();
  ctx.scale(w, 1);
  const g = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r);
  g.addColorStop(0, '#fff3b0');
  g.addColorStop(0.45, '#f6c343');
  g.addColorStop(1, '#c98a06');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = r * 0.16;
  ctx.strokeStyle = '#b37705';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.62, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(179, 119, 5, 0.55)';
  ctx.lineWidth = r * 0.1;
  ctx.stroke();
  ctx.restore();
}

export function coinShower(count = 46) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  for (let i = 0; i < count; i++) {
    const r = rand(9, 15);
    particles.push({
      x: rand(20, W - 20),
      y: rand(-H * 0.6, -20),
      vx: rand(-40, 40),
      vy: rand(0, 120),
      gravity: 1100,
      drag: 0.995,
      rot: rand(-0.3, 0.3), spin: rand(-1, 1),
      turn: rand(0, Math.PI * 2),
      turnSpeed: rand(5, 11),
      r,
      bounced: 0,
      age: 0,
      life: rand(2.6, 3.4),
      update(p, dt) {
        physics(p, dt);
        p.turn += p.turnSpeed * dt;
        const floor = H - p.r - 4;
        if (p.y > floor && p.vy > 0 && p.bounced < 2) {
          p.y = floor;
          p.vy *= -0.42;
          p.vx *= 0.7;
          p.bounced++;
        }
      },
      draw(p) {
        const fade = Math.min(1, (p.life - p.age) * 2);
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        drawCoin(p.r, Math.cos(p.turn));
        ctx.restore();
      }
    });
  }
  start();
}

// ---------- fireworks ----------

const SHELLS = [
  ['#ff4d4d', '#ffb3b3'],
  ['#ffd23f', '#fff2b3'],
  ['#4dd2ff', '#c7f1ff'],
  ['#9b5cff', '#dcc7ff'],
  ['#3ddc84', '#c3f7d9'],
  ['#ff7ad9', '#ffd1f1']
];

function explode(x, y, colors, born) {
  const [main, pale] = colors;
  const ring = Math.random() < 0.35; // some shells burst in a clean ring
  const n = ring ? 70 : 110;
  for (let i = 0; i < n; i++) {
    const angle = ring ? (i / n) * Math.PI * 2 : rand(0, Math.PI * 2);
    const speed = ring ? 260 : rand(60, 330) * Math.sqrt(Math.random() + 0.2);
    born.push({
      x, y, trail: [],
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gravity: 170,
      drag: 0.955,
      rot: 0, spin: 0,
      color: Math.random() < 0.8 ? main : pale,
      crackle: Math.random() < 0.3,
      age: 0,
      life: rand(1.1, 1.8),
      update(p, dt) {
        p.trail.push([p.x, p.y]);
        if (p.trail.length > 6) p.trail.shift();
        physics(p, dt);
      },
      draw(p) {
        const t = 1 - p.age / p.life;
        const twinkle = p.crackle && t < 0.45 ? (Math.random() < 0.5 ? 0 : 1) : 1;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = t * twinkle;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        const [tx, ty] = p.trail[0] ?? [p.x, p.y];
        ctx.moveTo(tx, ty);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = t * twinkle * 0.9;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });
  }
  // The flash of the burst.
  born.push({
    x, y, age: 0, life: 0.35, rot: 0, spin: 0,
    update() {},
    draw(p) {
      const t = 1 - p.age / p.life;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 120);
      g.addColorStop(0, `rgba(255, 255, 255, ${0.55 * t})`);
      g.addColorStop(0.3, `${main}${Math.round(90 * t).toString(16).padStart(2, '0')}`);
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 120, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  });
}

function rocket(delay) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const tx = rand(W * 0.18, W * 0.82);
  const ty = rand(H * 0.12, H * 0.42);
  const x0 = tx + rand(-60, 60);
  const flight = rand(0.75, 1.05);
  const colors = pick(SHELLS);
  setTimeout(() => {
    particles.push({
      x: x0, y: H + 10, trail: [],
      sx: x0, sy: H + 10, tx, ty,
      rot: 0, spin: 0,
      age: 0,
      life: flight,
      update(p) {
        // Ease out, like a shell losing speed near the top.
        const k = p.age / p.life;
        const e = 1 - Math.pow(1 - k, 2.2);
        p.trail.push([p.x, p.y]);
        if (p.trail.length > 12) p.trail.shift();
        p.x = p.sx + (p.tx - p.sx) * e + Math.sin(p.age * 30) * 0.8;
        p.y = p.sy + (p.ty - p.sy) * e;
      },
      draw(p) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        p.trail.forEach(([x, y], i) => {
          const a = (i + 1) / p.trail.length;
          ctx.fillStyle = `rgba(255, 210, 140, ${a * 0.7})`;
          ctx.beginPath();
          ctx.arc(x + rand(-1, 1), y, 1.8 * a, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.fillStyle = '#fff6d8';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      },
      onDeath(p, born) {
        explode(p.tx, p.ty, colors, born);
      }
    });
    start();
  }, delay);
}

export function fireworks(shells = 6) {
  for (let i = 0; i < shells; i++) rocket(i * 320 + rand(0, 160));
}
