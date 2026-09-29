import { exams } from '../content/index.js';
import * as fx from './effects.js';
import { createPet, spriteSVG } from './pets.js';
import { createInk } from './ink.js';

const el = (id) => document.getElementById(id);
const node = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
};
// Content strings are our own and may carry inline HTML (sup/sub/i, lists, tables, diagrams).
// Math like "i<j" or "pre[u]<pre[v]" also uses '<', which the browser would read as a tag and
// swallow, so any '<' that doesn't open one of these tags is shown as a literal '<'.
const TAGS = 'sup|sub|span|b|i|em|strong|br|ul|ol|li|code|table|tr|td|th|figure|figcaption|img|div|p|svg|g|path|rect|circle|text|tspan|polygon';
const literalLt = new RegExp(`<(?!/?(?:${TAGS})\\b)`, 'g');
const rich = (tag, cls, html) => {
  const n = node(tag, cls);
  n.innerHTML = String(html).replace(literalLt, '&lt;');
  return n;
};

// ---------- state ----------

let exam = exams[0];

const state = {
  view: 'part', // 'part' | 'cheatsheet' | 'shop'
  solutionOpen: false, // staff solution panel
  questionNumber: exam.questions[0].number,
  partId: exam.questions[0].parts[0].id,
  progress: {}, // `${examId}:${q}.${part}` -> { revealed, keyOpen, notes: {i: text}, picks: {i: choiceIndex} }
  last: {}, // examId -> { q, p }, so switching exams returns to where you were
  ink: {}, // `${examId}:${q}.${part}` -> handwritten strokes (see ink.js)
  // Coins and the shop. `awarded` remembers every reward already paid, so starting a part
  // over can't be used to farm coins.
  game: { coins: 0, earned: 0, awarded: {}, owned: ['accent-blue'], equipped: { accent: 'accent-blue', burst: null, finish: null, pet: null }, streak: 0, best: 0 }
};

const slotKey = (q, p) => `${exam.id}:${q}.${p}`;

function slotFor(q, p) {
  const k = slotKey(q, p);
  if (!state.progress[k]) state.progress[k] = { revealed: 0, keyOpen: false, notes: {}, picks: {} };
  state.progress[k].picks ??= {};
  state.progress[k].notes ??= {};
  return state.progress[k];
}

const slot = () => slotFor(state.questionNumber, state.partId);

let saveTimer = null;
function save() {
  clearTimeout(saveTimer);
  state.last[exam.id] = { q: state.questionNumber, p: state.partId };
  state.last._exam = exam.id;
  saveTimer = setTimeout(() => window.study.writeProgress({ ...state.progress, _last: state.last, _game: state.game, _ink: state.ink }), 250);
}

// ---------- lookups ----------

const question = () => exam.questions.find((q) => q.number === state.questionNumber);
const part = () => question().parts.find((p) => p.id === state.partId) ?? question().parts[0];

const allParts = () => exam.questions.flatMap((q) => q.parts.map((p) => ({ q, p })));
const partIndex = () =>
  allParts().findIndex(({ q, p }) => q.number === state.questionNumber && p.id === state.partId);

const isDone = (q, p) => (state.progress[slotKey(q.number, p.id)]?.revealed ?? 0) >= p.steps.length;
const ROMAN = ['', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
const partLabel = (p) => `(${p.id.replace(/^([a-z])(\d)$/, (_, l, n) => `${l}.${ROMAN[Number(n)]}`)})`;

// ---------- sidebar ----------

function ring(frac) {
  const r = 7;
  const c = 2 * Math.PI * r;
  const done = frac >= 1;
  return `<svg class="ring${done ? ' done' : ''}" viewBox="0 0 18 18" width="18" height="18">
    <circle cx="9" cy="9" r="${r}" class="ring-track"/>
    ${frac > 0 ? `<circle cx="9" cy="9" r="${r}" class="ring-fill" stroke-dasharray="${(frac * c).toFixed(2)} ${c.toFixed(2)}" transform="rotate(-90 9 9)"/>` : ''}
    ${done ? '<path d="M5.6,9.2 L8,11.4 L12.4,6.8" class="ring-check"/>' : ''}
  </svg>`;
}

function renderSidebar() {
  const picker = el('exam-picker');
  if (!picker.options.length) {
    // One section per group (this semester's homework, discussions, past midterms).
    const groups = new Map();
    for (const e of exams) {
      const name = e.group ?? 'Other';
      if (!groups.has(name)) {
        const og = document.createElement('optgroup');
        og.label = name;
        groups.set(name, og);
        picker.append(og);
      }
      groups.get(name).append(new Option(`${e.term} · ${e.title}`, e.id));
    }
    picker.onchange = () => switchExam(picker.value);
  }
  picker.value = exam.id;
  el('side-sub').textContent = `${exam.course} · ${exam.instructors}`;
  const nav = el('nav');
  nav.replaceChildren();

  for (const q of exam.questions) {
    const done = q.parts.filter((p) => isDone(q, p)).length;
    const selected = state.view === 'part' && q.number === state.questionNumber;

    const row = node('button', 'q-row');
    if (selected) row.classList.add('open');
    row.innerHTML = ring(done / q.parts.length);
    row.append(node('span', 'q-num', String(q.number)));
    row.append(node('span', 'q-name', q.title));
    row.append(node('span', 'q-pts', `${q.points ?? ""}`));
    row.onclick = () => go(q.number, q.parts[0].id);
    nav.append(row);

    if (selected) {
      const list = node('div', 'p-list');
      for (const p of q.parts) {
        const pr = node('button', 'p-row');
        if (p.id === state.partId) pr.classList.add('selected');
        if (isDone(q, p)) pr.classList.add('done');
        pr.append(node('span', 'p-dot'));
        pr.append(node('span', 'p-id', partLabel(p)));
        pr.append(rich('span', 'p-name', p.name));
        pr.onclick = () => go(q.number, p.id);
        list.append(pr);
      }
      nav.append(list);
    }
  }

  el('cheat-btn').classList.toggle('selected', state.view === 'cheatsheet');
  el('shop-btn').classList.toggle('selected', state.view === 'shop');
  const total = allParts().length;
  const finished = allParts().filter(({ q, p }) => isDone(q, p)).length;
  el('overall').innerHTML = `<div class="bar"><div style="width:${(finished / total) * 100}%"></div></div>${finished} of ${total} parts done`;
}

// ---------- toolbar ----------

function renderToolbar() {
  const cheat = state.view !== 'part';
  el('tb-title').textContent =
    state.view === 'cheatsheet' ? 'Cheat sheet' : state.view === 'shop' ? 'Shop' : `Question ${question().number} ${partLabel(part())}`;
  renderCoins();
  const i = partIndex();
  el('prev-btn').disabled = cheat || i <= 0;
  el('next-btn').disabled = cheat || i >= allParts().length - 1;
  el('all-btn').hidden = cheat;
  el('solution-btn').hidden = cheat || !exam.solutionPages?.[question().number];
  el('ink-btn').hidden = cheat;
  el('ink-btn').classList.toggle('on', !!ink?.open);
  el('solution-btn').classList.toggle('on', !!state.solutionOpen);
  el('reset-btn').hidden = cheat;
}

// ---------- page ----------

function renderPage() {
  if (state.view === 'cheatsheet') return renderCheatsheet();
  if (state.view === 'shop') return renderShop();

  const q = question();
  const p = part();
  const st = slot();
  const page = el('page');
  page.replaceChildren();

  // The sidebar and toolbar already say which exam, question, and part this is.
  const prob = node('section', 'card problem');
  // The exam's full wording: shared setup, the question's figure/table, then this part.
  // `ask` may be one string or a list of paragraphs (paragraphs may hold lists).
  for (const para of q.preamble ?? []) prob.append(rich('div', 'setup', para));
  if (q.table) prob.append(renderTable(q.table));
  if (q.figure) prob.insertAdjacentHTML('beforeend', q.figure);
  for (const para of [].concat(p.ask)) prob.append(rich('div', 'ask', para));
  if (p.table) prob.append(renderTable(p.table));
  if (p.figure) prob.insertAdjacentHTML('beforeend', p.figure);
  if (p.formal) {
    const d = node('div', 'formal');
    d.append(node('div', 'formal-head', 'Formal description'));
    d.append(node('div', 'lab', 'Input'));
    const ol = node('ol', 'formal-in');
    for (const line of p.formal.input) ol.append(rich('li', null, line));
    d.append(ol);
    d.append(node('div', 'lab', 'Output'));
    d.append(rich('div', 'formal-out', p.formal.output));
    prob.append(d);
  }
  page.append(prob);

  // Steps follow the problem directly. The status bar shows how many are revealed.
  const shown = Math.min(st.revealed, p.steps.length);
  p.steps.forEach((step, i) => page.append(renderStep(step, i, st)));

  const finished = st.revealed >= p.steps.length;
  if (finished || st.keyOpen) page.append(renderKey(p));

  const isLastPart = q.parts[q.parts.length - 1].id === p.id;
  if (finished && isLastPart && q.takeaway) page.append(renderTakeaway(q));

  if (finished) {
    const next = allParts()[partIndex() + 1];
    if (next) {
      const b = node('button', 'next-card');
      b.append(node('span', 'next-label', 'Next up'));
      b.append(rich('span', 'next-name', `Q${next.q.number} ${partLabel(next.p)} · ${next.p.name}`));
      b.append(node('span', 'next-arrow', '→'));
      b.onclick = () => go(next.q.number, next.p.id);
      page.append(b);
    }
  }

  el('st-progress').textContent = `Q${q.number} ${partLabel(p)} · ${shown} of ${p.steps.length} steps shown`;
  ink?.redraw(); // cards may have moved
}

function renderTable(t) {
  const table = node('table', 'data');
  const tr = node('tr');
  for (const h of t.head) tr.append(rich('th', null, h));
  table.append(tr);
  for (const row of t.rows) {
    const r = node('tr');
    for (const c of row) r.append(rich('td', null, c));
    table.append(r);
  }
  return table;
}

function renderStep(step, i, st) {
  const revealed = i < st.revealed;
  const isCurrent = i === st.revealed;
  const locked = i > st.revealed;

  const wrap = node('div', 'step');
  wrap.dataset.index = i;
  if (revealed) wrap.classList.add('done');
  if (isCurrent) wrap.classList.add('current');
  if (locked) wrap.classList.add('locked');

  const head = node('div', 'step-head');
  head.append(node('div', 'badge', revealed ? '✓' : String(i + 1)));
  head.append(rich('div', 'step-title', step.title));
  if (locked) head.append(node('span', 'lock-note', 'locked'));
  wrap.append(head);
  if (locked) return wrap;

  const body = node('div', 'step-body');
  body.append(rich('p', 'prompt', step.prompt));

  if (step.choices) body.append(renderChoices(step, i, st, revealed));

  if (!revealed) {
    const row = node('div', 'row');
    if (!step.choices) {
      const btn = node('button', 'btn primary', 'Show me');
      btn.onclick = revealNext;
      row.append(btn);
    } else {
      const skip = node('button', 'btn', 'Just tell me');
      skip.onclick = revealNext;
      row.append(skip);
    }
    const guess = node('button', 'btn ghost', st.notes[i] ? 'Your notes' : 'Jot a guess first');
    row.append(guess);
    body.append(row);
    const ta = scratch(i, st);
    ta.hidden = !st.notes[i];
    guess.onclick = () => {
      ta.hidden = !ta.hidden;
      if (!ta.hidden) ta.focus();
    };
    body.append(ta);
  } else {
    if (st.notes[i]) body.append(scratch(i, st));
    const simple = node('div', 'simple');
    simple.append(rich('p', null, step.simple));
    body.append(simple);
    if (step.figure) body.insertAdjacentHTML('beforeend', step.figure);
    if (step.reveal?.length) {
      const r = node('div', 'detail');
      for (const para of step.reveal) r.append(rich('p', null, para));
      body.append(r);
    }
    if (step.pitfall) {
      const pit = node('div', 'pitfall');
      pit.append(node('div', 'pitfall-label', 'Easy way to lose points'));
      pit.append(rich('p', null, step.pitfall));
      body.append(pit);
    }
  }

  wrap.append(body);
  return wrap;
}

function renderChoices(step, i, st, revealed) {
  const box = node('div', 'choices');
  const picked = st.picks[i];
  step.choices.forEach((label, c) => {
    const b = rich('button', 'choice', label);
    if (revealed) {
      b.disabled = true;
      if (c === step.correct) b.classList.add('right');
      else if (c === picked) b.classList.add('wrong');
    }
    b.onclick = () => {
      st.picks[i] = c;
      scorePick(step, i, c, b);
      revealNext();
    };
    box.append(b);
  });
  if (revealed) {
    let msg;
    let cls;
    if (picked === undefined) {
      msg = 'Answer shown above in green.';
      cls = 'neutral';
    } else if (picked === step.correct) {
      msg = 'Correct!';
      cls = 'good';
    } else {
      msg = 'Not quite. The green one is right. Here’s why:';
      cls = 'bad';
    }
    const v = node('div', `verdict ${cls}`, msg);
    const wrap = node('div');
    wrap.append(box, v);
    return wrap;
  }
  return box;
}

function scratch(i, st) {
  const ta = node('textarea', 'scratch');
  ta.placeholder = 'Your guess, in any words. Nobody grades this.';
  ta.value = st.notes[i] ?? '';
  ta.oninput = () => {
    st.notes[i] = ta.value;
    save();
  };
  return ta;
}

function renderKey(p) {
  const box = node('section', 'card answer');
  box.append(node('div', 'card-label', 'The answer'));
  box.append(rich('p', 'gist', p.key.gist));
  if (p.key.table) box.append(renderTable(p.key.table));
  for (const para of p.key.body ?? []) box.append(rich('p', null, para));
  if (p.key.runtime) {
    const rt = node('div', 'runtime');
    rt.append(node('span', null, 'Runtime'));
    rt.append(rich('code', null, p.key.runtime));
    box.append(rt);
  }
  return box;
}

function renderTakeaway(q) {
  const box = node('section', 'card takeaway');
  box.append(node('div', 'card-label', `Remember from question ${q.number}`));
  const ul = node('ul');
  for (const line of q.takeaway) ul.append(rich('li', null, line));
  box.append(ul);
  return box;
}

function renderCheatsheet() {
  const page = el('page');
  page.replaceChildren();
  page.append(node('div', 'eyebrow', `${exam.course} · ${exam.term} ${exam.title}`));
  page.append(node('h1', null, 'Cheat sheet'));
  page.append(node('p', 'lede', 'Every answer and every “remember this” on one page. Click a row to jump to its walkthrough.'));

  for (const q of exam.questions) {
    const sec = node('section', 'card cheat');
    sec.append(node('h2', null, `${q.number}. ${q.title}`));
    for (const p of q.parts) {
      const row = node('button', 'cheat-row');
      row.append(node('span', 'p-id', partLabel(p)));
      const txt = node('span', 'cheat-text');
      txt.append(rich('span', 'cheat-name', p.name));
      txt.append(rich('span', 'cheat-gist', p.key.gist));
      row.append(txt);
      row.onclick = () => go(q.number, p.id);
      sec.append(row);
    }
    if (q.takeaway) {
      const ul = node('ul', 'cheat-take');
      for (const line of q.takeaway) ul.append(rich('li', null, line));
      sec.append(ul);
    }
    page.append(sec);
  }
  el('st-progress').textContent = 'Cheat sheet';
}

// ---------- commands ----------

function switchExam(id) {
  exam = exams.find((e) => e.id === id) ?? exams[0];
  const last = state.last[exam.id];
  const q = last && exam.questions.find((x) => x.number === last.q);
  if (q && q.parts.some((p) => p.id === last.p)) go(q.number, last.p);
  else go(exam.questions[0].number, exam.questions[0].parts[0].id);
}

function go(qNumber, partId) {
  state.view = 'part';
  state.questionNumber = qNumber;
  state.partId = partId;
  save();
  renderAll();
}

function step(delta) {
  if (state.view !== 'part') return;
  const next = allParts()[partIndex() + delta];
  if (next) go(next.q.number, next.p.id);
}

function revealNext() {
  if (state.view !== 'part') return;
  const p = part();
  const st = slot();
  const target = st.revealed;
  if (st.revealed < p.steps.length) {
    // Writing a guess before looking is the habit worth paying for.
    if (!p.steps[target].choices && st.notes[target]?.trim()) earn(`${slotKey(state.questionNumber, p.id)}:${target}:guess`, 3, 'Guessed first');
    st.revealed += 1;
    if (st.revealed === p.steps.length) finishPart();
  } else st.keyOpen = true;
  save();
  const y = el('scroll').scrollTop;
  renderPage();
  renderSidebar();
  el('scroll').scrollTop = y;
  const justShown = document.querySelector(`.step[data-index="${target}"]`) ?? document.querySelector('.answer');
  justShown?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function revealAll() {
  if (state.view !== 'part') return;
  const st = slot();
  st.revealed = part().steps.length;
  st.keyOpen = true;
  save();
  renderPage();
  renderSidebar();
}

function toggleKey() {
  if (state.view !== 'part') return;
  const st = slot();
  st.keyOpen = !st.keyOpen;
  save();
  renderPage();
  if (st.keyOpen) document.querySelector('.answer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetPart() {
  if (state.view !== 'part') return;
  state.progress[slotKey(state.questionNumber, state.partId)] = { revealed: 0, keyOpen: false, notes: {}, picks: {} };
  save();
  renderPage();
  renderSidebar();
  el('scroll').scrollTop = 0;
}

function showShop() {
  state.view = state.view === 'shop' ? 'part' : 'shop';
  state.solutionOpen = false;
  renderAll();
}

function showCheatsheet() {
  state.view = state.view === 'cheatsheet' ? 'part' : 'cheatsheet';
  state.solutionOpen = false;
  renderAll();
}

// ---------- staff solution ----------

// Shows the official key's pages for the current question over the walkthrough.
function renderSolution() {
  const panel = el('solution');
  const range = exam.solutionPages?.[question().number];
  panel.hidden = !(state.solutionOpen && state.view === 'part' && range);
  if (panel.hidden) return;
  const [first, last] = range;
  el('sol-title').textContent = `Staff solution · Question ${question().number}`;
  el('sol-sub').textContent = `${exam.term} ${exam.title} key, page${first === last ? ` ${first}` : `s ${first}–${last}`}`;
  const list = el('sol-scroll');
  if (list.dataset.for === `${exam.id}:${question().number}`) return;
  list.dataset.for = `${exam.id}:${question().number}`;
  list.replaceChildren();
  for (let n = first; n <= last; n++) {
    const img = node('img', 'sol-page');
    img.alt = `Answer key page ${n}`;
    img.loading = 'lazy';
    // Both key renderers use two-digit page numbers; older exams use JPEG, newer ones WebP.
    img.src = `../content/${exam.solutionDir}/p-${String(n).padStart(2, '0')}.${exam.solutionExt ?? 'jpg'}`;
    list.append(img);
  }
  list.scrollTop = 0;
}

function toggleSolution(open = !state.solutionOpen) {
  state.solutionOpen = open;
  renderSolution();
  renderToolbar();
}

// ---------- coins and shop ----------

const REWARDS = [
  ['Right answer on the first try', 10],
  ['Writing a guess before tapping “Show me”', 3],
  ['Finishing a part step by step (not with “Show everything”)', 15],
  ['Every 5 right answers in a row', 20]
];

// Everything is cosmetic: coins never unlock answers.
const SHOP = [
  { group: 'Accent colors', note: 'Buttons, highlights, and the explanation boxes.', items: [
    { id: 'accent-blue', name: 'Blue', price: 0, slot: 'accent', swatch: '#1a62d0' },
    { id: 'accent-green', name: 'Green', price: 60, slot: 'accent', swatch: '#1d8248' },
    { id: 'accent-teal', name: 'Teal', price: 60, slot: 'accent', swatch: '#0f7c86' },
    { id: 'accent-purple', name: 'Purple', price: 80, slot: 'accent', swatch: '#6b3fc8' },
    { id: 'accent-orange', name: 'Orange', price: 80, slot: 'accent', swatch: '#c4620c' },
    { id: 'accent-pink', name: 'Pink', price: 100, slot: 'accent', swatch: '#c93a82' },
    { id: 'accent-graphite', name: 'Graphite', price: 120, slot: 'accent', swatch: '#4a4f57' }
  ] },
  { group: 'Celebrations', note: 'What happens when you get a question right.', items: [
    { id: 'burst-confetti', name: 'Confetti', price: 150, slot: 'burst', desc: 'A pop of confetti from the answer you picked.' },
    { id: 'burst-sparks', name: 'Sparks', price: 150, slot: 'burst', desc: 'Gold sparks from the answer you picked.' }
  ] },
  { group: 'Finishing a part', note: 'What happens when you reach the end of a part.', items: [
    { id: 'finish-coins', name: 'Coin shower', price: 200, slot: 'finish', desc: 'Coins rain down the screen.' },
    { id: 'finish-fireworks', name: 'Fireworks', price: 250, slot: 'finish', desc: 'A few bursts over the page.' }
  ] },
  { group: 'Pets', note: 'A little pixel friend who lives in the corner of the page. It cheers when you get things right, and naps when you’re away. Tap it for a pep talk.', items: [
    { id: 'pet-penguin', name: 'Penguin', price: 120, slot: 'pet', sprite: 'penguin' },
    { id: 'pet-cat', name: 'Cat', price: 150, slot: 'pet', sprite: 'cat' },
    { id: 'pet-dog', name: 'Dog', price: 150, slot: 'pet', sprite: 'dog' },
    { id: 'pet-frog', name: 'Frog', price: 150, slot: 'pet', sprite: 'frog' },
    { id: 'pet-bunny', name: 'Bunny', price: 180, slot: 'pet', sprite: 'bunny' },
    { id: 'pet-dragon', name: 'Dragon', price: 300, slot: 'pet', sprite: 'dragon' }
  ] },
  { group: 'Extras', note: '', items: [
    { id: 'extra-streak', name: 'Streak counter', price: 50, slot: null, desc: 'Shows how many you’ve gotten right in a row, next to your coins.' }
  ] }
];
const shopItem = (id) => SHOP.flatMap((g) => g.items).find((it) => it.id === id);
const owns = (id) => state.game.owned.includes(id);

function earn(key, amount, reason) {
  const g = state.game;
  if (g.awarded[key]) return false;
  g.awarded[key] = true;
  g.coins += amount;
  g.earned += amount;
  toast(`+${amount}`, reason);
  save();
  renderCoins(true);
  return true;
}

function scorePick(step, i, choice, button) {
  const g = state.game;
  const key = `${slotKey(state.questionNumber, part().id)}:${i}`;
  if (g.awarded[`${key}:pick`] || g.awarded[`${key}:tried`]) return; // only the first attempt counts
  if (choice !== step.correct) {
    g.awarded[`${key}:tried`] = true;
    g.streak = 0;
    pet.sad();
    save();
    return;
  }
  pet.happy();
  g.streak += 1;
  g.best = Math.max(g.best, g.streak);
  earn(`${key}:pick`, 10, 'Right on the first try');
  if (g.streak % 5 === 0) earn(`streak:${g.earned}`, 20, `${g.streak} in a row`);
  celebrate(button);
}

function finishPart() {
  const done = earn(`${slotKey(state.questionNumber, part().id)}:done`, 15, 'Finished the part');
  if (done) {
    finishEffect();
    pet.happy(true);
  }
}

function renderCoins(bump = false) {
  el('coin-count').textContent = state.game.coins;
  if (bump) {
    const pill = el('coin-btn');
    pill.classList.remove('bump');
    void pill.offsetWidth; // restart the animation
    pill.classList.add('bump');
  }
  const streak = el('streak');
  streak.hidden = !owns('extra-streak') || state.game.streak < 2;
  streak.textContent = `${state.game.streak} in a row`;
}

function toast(amount, reason) {
  const t = node('div', 'toast');
  t.append(node('span', 'coin'), node('b', null, amount), node('span', null, reason));
  el('toasts').append(t);
  setTimeout(() => t.classList.add('out'), 1600);
  setTimeout(() => t.remove(), 2100);
}

const pet = createPet(document.getElementById('main'));

function applyLooks() {
  document.documentElement.dataset.accent = state.game.equipped.accent.replace('accent-', '');
  pet.set(shopItem(state.game.equipped.pet)?.sprite ?? null);
}

function celebrate(button, kind = state.game.equipped.burst) {
  if (!kind) return;
  const r = button.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  if (kind === 'burst-sparks') fx.sparks(x, y);
  else fx.confetti(x, y);
}

function finishEffect(kind = state.game.equipped.finish) {
  if (kind === 'finish-coins') fx.coinShower();
  else if (kind === 'finish-fireworks') fx.fireworks();
}

// Lets the shop show an effect before you buy it.
function previewEffect(item, button) {
  if (item.slot === 'burst') celebrate(button, item.id);
  if (item.slot === 'finish') finishEffect(item.id);
}

function buyOrEquip(item) {
  const g = state.game;
  if (!owns(item.id)) {
    if (g.coins < item.price) return;
    g.coins -= item.price;
    g.owned.push(item.id);
    toast(`−${item.price}`, `Bought ${item.name}`);
  }
  if (item.slot) g.equipped[item.slot] = g.equipped[item.slot] === item.id && item.slot !== 'accent' ? null : item.id;
  applyLooks();
  save();
  renderToolbar();
  renderShop();
}

function renderShop() {
  const g = state.game;
  const page = el('page');
  page.replaceChildren();
  page.append(node('h1', null, 'Shop'));

  const bal = node('div', 'shop-balance');
  bal.append(node('span', 'coin big'), node('b', null, String(g.coins)), node('span', null, `coins · ${g.earned} earned all time · best streak ${g.best}`));
  page.append(bal);

  const how = node('section', 'card shop-how');
  how.append(node('div', 'card-label', 'How to earn coins'));
  const ul = node('ul');
  for (const [what, amount] of REWARDS) {
    const li = node('li');
    li.append(node('span', null, what), node('b', null, `+${amount}`));
    ul.append(li);
  }
  how.append(ul);
  how.append(node('p', 'shop-note', 'Each reward pays once per step or part, so starting a part over won’t pay again.'));
  page.append(how);

  for (const group of SHOP) {
    const sec = node('section', 'shop-group');
    sec.append(node('h2', null, group.group));
    if (group.note) sec.append(node('p', 'shop-note', group.note));
    const grid = node('div', 'shop-grid');
    for (const item of group.items) {
      const card = node('div', 'shop-item');
      const equipped = item.slot && g.equipped[item.slot] === item.id;
      if (equipped) card.classList.add('equipped');
      const preview = node('div', `shop-preview ${item.id}`);
      if (item.swatch) preview.style.background = item.swatch;
      if (item.sprite) preview.innerHTML = spriteSVG(item.sprite, { size: 48 });
      card.append(preview);
      card.append(node('div', 'shop-name', item.name));
      if (item.desc) card.append(node('div', 'shop-desc', item.desc));
      const btn = node('button', 'btn');
      if (!owns(item.id)) {
        btn.classList.add('primary');
        btn.append(node('span', 'coin'), document.createTextNode(` ${item.price}`));
        btn.disabled = g.coins < item.price;
        if (btn.disabled) btn.title = `You need ${item.price - g.coins} more coins`;
      } else if (!item.slot) {
        btn.textContent = 'Owned';
        btn.disabled = true;
      } else if (equipped) {
        btn.textContent = item.slot === 'accent' ? 'In use' : item.slot === 'pet' ? 'With you' : 'In use · turn off';
        btn.disabled = item.slot === 'accent';
      } else {
        btn.textContent = 'Use';
      }
      btn.onclick = () => buyOrEquip(item);
      if (item.slot === 'burst' || item.slot === 'finish') {
        const row = node('div', 'shop-actions');
        const prev = node('button', 'btn ghost', 'Preview');
        prev.onclick = () => previewEffect(item, prev);
        row.append(prev, btn);
        card.append(row);
      } else {
        card.append(btn);
      }
      grid.append(card);
    }
    sec.append(grid);
    page.append(sec);
  }
  el('st-progress').textContent = 'Shop';
}

// ---------- boot ----------

// iPad only: the native shell keeps one sheet of Pencil paper per part.
const paper = window.study.paper;

// Handwriting on the page: the Pencil always writes; the Ink button shows the palette
// (and lets a mouse draw on a Mac).
let ink = null;
ink = createInk({
  scroll: el('scroll'),
  host: el('main'),
  onChange: (strokes) => {
    if (state.view !== 'part') return;
    state.ink[slotKey(state.questionNumber, state.partId)] = strokes;
    save();
  }
});
window.__ink = (action) => ink.pencil(action);

function renderAll() {
  renderSidebar();
  renderToolbar();
  renderPage();
  renderSolution();
  ink.load(state.view === 'part' ? state.ink[slotKey(state.questionNumber, state.partId)] : []);
  paper?.position(`${exam.id}-${question().number}-${part().id}`, `${exam.term} · Question ${question().number} ${partLabel(part())}`);
  el('scroll').scrollTop = 0;
}

el('prev-btn').onclick = () => step(-1);
el('next-btn').onclick = () => step(1);
el('all-btn').onclick = revealAll;
el('reset-btn').onclick = resetPart;
el('cheat-btn').onclick = showCheatsheet;
el('shop-btn').onclick = showShop;
el('coin-btn').onclick = showShop;
el('solution-btn').onclick = () => toggleSolution();
el('paper-btn').hidden = !paper;
el('paper-btn').onclick = () => paper?.toggle();
window.__setPaperOpen = (open) => {
  el('paper-btn').classList.toggle('on', open);
  document.documentElement.classList.toggle('paper-open', open);
};
el('sol-close').onclick = () => toggleSolution(false);
el('ink-btn').onclick = () => {
  ink.toggle();
  renderToolbar();
};

window.study.onCommand((cmd) => {
  if (cmd === 'reveal-next') revealNext();
  if (cmd === 'reveal-all') revealAll();
  if (cmd === 'toggle-key') toggleKey();
  if (cmd === 'reset-part') resetPart();
  if (cmd === 'next-part') step(1);
  if (cmd === 'prev-part') step(-1);
  if (cmd === 'cheatsheet') showCheatsheet();
  if (cmd === 'solution') toggleSolution();
  if (cmd === 'shop') showShop();
  if (cmd === 'ink') el('ink-btn').click();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && state.solutionOpen) toggleSolution(false);
});

// Return inside a textarea should type a newline, not advance the walkthrough.
document.addEventListener('keydown', (e) => {
  if (state.solutionOpen) return;
  if (e.key !== 'Enter' || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.target instanceof HTMLTextAreaElement) return;
  if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLElement && e.target.tagName === 'SUMMARY') return;
  e.preventDefault();
  if (e.shiftKey) revealAll();
  else revealNext();
});

window.study.readProgress().then((saved) => {
  const { _last, _game, _ink, ...progress } = saved ?? {};
  state.ink = _ink ?? {};
  if (_game) state.game = { ...state.game, ..._game, equipped: { ...state.game.equipped, ..._game.equipped } };
  applyLooks();
  // Older saves had no exam prefix and only covered Fall 2025.
  state.progress = {};
  for (const [k, v] of Object.entries(progress)) state.progress[k.includes(':') ? k : `fa25-mt1:${k}`] = v;
  // Older saves stored _last as a single { q, p } for Fall 2025.
  state.last = _last && 'q' in _last ? { 'fa25-mt1': _last, _exam: 'fa25-mt1' } : (_last ?? {});
  exam = exams.find((e) => e.id === state.last._exam) ?? exams[0];
  const last = state.last[exam.id];
  const q = last && exam.questions.find((x) => x.number === last.q);
  if (q && q.parts.some((p) => p.id === last.p)) {
    state.questionNumber = q.number;
    state.partId = last.p;
  } else {
    state.questionNumber = exam.questions[0].number;
    state.partId = exam.questions[0].parts[0].id;
  }
  renderAll();
});
