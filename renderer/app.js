import { exams } from '../content/index.js';
import * as fx from './effects.js';
import { createPet, spriteSVG, foodSVG, tombSVG } from './pets.js';
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
  view: 'part', // 'part' | 'shop' | 'settings' | 'test-start' | 'test' | 'test-results'
  solutionOpen: false, // staff solution panel
  questionNumber: exam.questions[0].number,
  partId: exam.questions[0].parts[0].id,
  progress: {}, // `${examId}:${q}.${part}` -> { revealed, keyOpen, notes: {i: text}, picks: {i: choiceIndex} }
  last: {}, // examId -> { q, p }, so switching exams returns to where you were
  ink: {}, // `${examId}:${q}.${part}` -> handwritten strokes (see ink.js)
  prefs: { noHints: false, sidebar: true, theme: 'system', textSize: 1, effects: true, showPet: true }, // No-hints mode: hide Hint: lines and the guided steps
  walk: new Set(), // parts opened with “Walk me through it” while in no-hints mode (not saved)
  test: null, // the test in progress or just graded (see “test mode”)
  tests: {}, // examId -> past test attempts
  // Coins and the shop. `awarded` remembers every reward already paid, so starting a part
  // over can't be used to farm coins.
  game: { coins: 0, earned: 0, awarded: {}, owned: ['accent-blue'], equipped: { accent: 'accent-blue', burst: null, finish: null, pet: null }, streak: 0, best: 0,
    food: {}, care: {}, lastStudy: null, graveyard: [], memorial: null }
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
  saveTimer = setTimeout(() => window.study.writeProgress({ ...state.progress, _last: state.last, _game: state.game, _ink: state.ink, _prefs: state.prefs, _test: state.test, _tests: state.tests }), 250);
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
    const doneFn = state.view === 'test' && testActive() ? testAnswered : isDone;
    const done = q.parts.filter((p) => doneFn(q, p)).length;
    const selected = (state.view === 'part' || state.view === 'test') && q.number === state.questionNumber;

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
        if (doneFn(q, p)) pr.classList.add('done');
        pr.append(node('span', 'p-dot'));
        pr.append(node('span', 'p-id', partLabel(p)));
        pr.append(rich('span', 'p-name', p.name));
        pr.onclick = () => go(q.number, p.id);
        list.append(pr);
      }
      nav.append(list);
    }
  }

  el('shop-btn').classList.toggle('selected', state.view === 'shop');
  el('settings-btn').classList.toggle('selected', state.view === 'settings');
  const total = allParts().length;
  const testing = state.view === 'test' && testActive();
  const finished = allParts().filter(({ q, p }) => (testing ? testAnswered(q, p) : isDone(q, p))).length;
  el('overall').innerHTML = `<div class="bar"><div style="width:${(finished / total) * 100}%"></div></div>${finished} of ${total} parts ${testing ? 'answered' : 'done'}`;
  el('exam-picker').disabled = testActive();
}

// ---------- toolbar ----------

function renderToolbar() {
  const offPage = state.view !== 'part'; // shop, settings, tests
  const testing = state.view === 'test' && testActive();
  el('tb-title').hidden = true; // the page says which question it is, above the question
  el('tb-title').textContent =
    state.view === 'shop' ? 'Shop'
    : state.view === 'settings' ? 'Settings'
    : state.view === 'test-start' ? 'Test mode'
    : state.view === 'test-results' ? 'Test submitted'
    : testing ? `Test · Question ${question().number} ${partLabel(part())}`
    : `Question ${question().number} ${partLabel(part())}`;
  renderCoins();
  const i = partIndex();
  el('prev-btn').disabled = (offPage && !testing) || i <= 0;
  el('next-btn').disabled = (offPage && !testing) || i >= allParts().length - 1;
  el('test-btn').classList.toggle('on', state.view.startsWith('test'));
  el('test-btn').hidden = testing;
  el('test-submit').hidden = !testActive();
  tickTest();
  requestAnimationFrame(fitToolbar);
  el('all-btn').hidden = offPage;
  el('solution-btn').hidden = offPage || !exam.solutionPages?.[question().number];
  el('ink-btn').hidden = offPage && !testing;
  el('hints-btn').hidden = offPage;
  el('hints-btn').classList.toggle('on', state.prefs.noHints);
  el('ink-btn').classList.toggle('on', !!ink?.open);
  el('solution-btn').classList.toggle('on', !!state.solutionOpen);
  el('reset-btn').hidden = offPage;
}

// When the window is narrow (iPad landscape with Paper open, split view…) the least-used
// toolbar buttons move into a “⋯” menu instead of squeezing together.
const OVERFLOW_ORDER = ['reset-btn', 'hints-btn', 'test-btn', 'solution-btn', 'side-btn', 'ink-btn'];
const OVERFLOW_LABELS = {
  'reset-btn': 'Start over',
  'hints-btn': 'No-hints mode',
  'test-btn': 'Test mode',
  'solution-btn': 'Staff solution',
  'side-btn': 'Sidebar',
  'ink-btn': 'Ink'
};

function fitToolbar() {
  const bar = el('toolbar');
  for (const id of OVERFLOW_ORDER) el(id).classList.remove('in-overflow');
  el('more-btn').hidden = true;
  const overflowing = () => bar.scrollWidth > bar.clientWidth + 1;
  const moved = [];
  for (const id of OVERFLOW_ORDER) {
    if (!overflowing()) break;
    const b = el(id);
    if (b.hidden) continue;
    if (!moved.length) el('more-btn').hidden = false; // the ⋯ button itself takes room
    b.classList.add('in-overflow');
    moved.push(id);
  }
  el('more-btn').hidden = !moved.length;
  if (!moved.length) el('more-menu').hidden = true;
  return moved;
}

function toggleMoreMenu(force) {
  const menu = el('more-menu');
  const open = force ?? menu.hidden;
  menu.hidden = !open;
  el('more-btn').classList.toggle('on', open);
  if (!open) return;
  menu.replaceChildren();
  for (const id of OVERFLOW_ORDER) {
    const src = el(id);
    if (!src.classList.contains('in-overflow') || src.hidden) continue;
    const item = node('button', `more-item${src.classList.contains('on') ? ' on' : ''}`);
    const icon = src.querySelector('svg')?.cloneNode(true);
    if (icon) item.append(icon);
    let label = OVERFLOW_LABELS[id];
    item.append(node('span', null, label));
    item.onclick = () => {
      toggleMoreMenu(false);
      src.click();
    };
    menu.append(item);
  }
}

// ---------- page ----------

function renderPage() {
  if (state.view === 'shop') return renderShop();
  if (state.view === 'settings') return renderSettings();
  if (state.view.startsWith('test')) {
    const page = el('page');
    page.replaceChildren();
    if (state.view === 'test' && testActive()) renderTestPart(page);
    else if (state.view === 'test-results' && state.test?.submitted && state.test.examId === exam.id) renderTestResults(page);
    else renderTestStart(page);
    ink?.redraw();
    return;
  }

  const q = question();
  const p = part();
  const st = slot();
  const page = el('page');
  page.replaceChildren();

  // The sidebar and toolbar already say which exam, question, and part this is.
  renderMemorial(page);
  page.append(questionLabel(q, p));
  const prob = buildProblem(q, p, state.prefs.noHints);
  page.append(prob);

  // In no-hints mode the steps stay hidden until asked for; you answer, then see the key.
  const hideSteps = state.prefs.noHints && !state.walk.has(slotKey(q.number, p.id));
  const attempt = renderAttempt(p, st, hideSteps);
  if (attempt) page.append(attempt);

  // Steps follow the problem directly. The status bar shows how many are revealed.
  const shown = Math.min(st.revealed, p.steps.length);
  if (!hideSteps) p.steps.forEach((step, i) => page.append(renderStep(step, i, st)));

  const finished = st.revealed >= p.steps.length;
  if (finished || st.keyOpen) page.append(renderKey(p));

  const isLastPart = q.parts[q.parts.length - 1].id === p.id;
  if (finished && isLastPart && q.takeaway) page.append(renderTakeaway(q));

  if (finished || st.keyOpen) {
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

  el('st-progress').textContent = hideSteps
    ? `Q${q.number} ${partLabel(p)} · no hints`
    : `Q${q.number} ${partLabel(p)} · ${shown} of ${p.steps.length} steps shown`;
  ink?.redraw(); // cards may have moved
}

// ---------- answering without the walkthrough ----------

const plain = (html) => String(html).replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();
const isHint = (para) => /^\(?\s*hint\b/i.test(plain(para));

// A part is "short answer" when its key fits in a few words.
// Questions that ask for a proof, algorithm or explanation need room to write, even when
// the key's summary is short.
const asksForWork = (p) =>
  /\b(prove|proof|show that|justify|explain|describe|design|devise|argue|analy[sz]e|give an? (algorithm|example|proof|strategy))\b/i.test(plain([].concat(p.ask).join(' ')));
const shortAnswer = (p) => plain(p.key.gist).length <= 60 && !asksForWork(p);
const choiceStep = (p) => (p.steps[p.steps.length - 1].choices ? p.steps.length - 1 : -1);

// Loose comparison: ignores spaces, case, a trailing period, ^ and *, and superscript/subscript
// digits (n² = n^2 = n2). A wrapping O(…), Θ(…), Ω(…) is optional.
function normAnswer(t) {
  let x = plain(t).normalize('NFKC').toLowerCase().replace(/−/g, '-').replace(/θ/g, 'theta').replace(/ω/g, 'omega');
  x = x.replace(/[\s^*·.]/g, '').replace(/[‘’“”"']/g, '');
  const m = x.match(/^(?:o|theta|omega|big-?o)\((.*)\)$/);
  return m ? m[1] : x;
}

function renderAttempt(p, st, hideSteps) {
  const ci = choiceStep(p);
  const typed = shortAnswer(p) && ci < 0;
  // With the steps showing, choice questions are already answerable inside the steps.
  if (!hideSteps && !typed) return null;
  if (!hideSteps && st.revealed >= p.steps.length && !st.answer) return null;

  const card = node('section', 'card attempt');
  if (typed || ci >= 0) card.append(node('div', 'attempt-label', 'Your answer'));

  if (ci >= 0 && hideSteps) {
    const stepObj = p.steps[ci];
    const picked = st.picks[ci];
    const box = node('div', 'choices');
    stepObj.choices.forEach((label, c) => {
      const b = rich('button', 'choice', label);
      if (picked !== undefined) {
        b.disabled = true;
        if (c === stepObj.correct) b.classList.add('right');
        else if (c === picked) b.classList.add('wrong');
      }
      b.onclick = () => {
        st.picks[ci] = c;
        scorePick(stepObj, ci, c, b);
        openKey();
      };
      box.append(b);
    });
    card.append(box);
    if (picked !== undefined) card.append(node('div', `verdict ${picked === stepObj.correct ? 'good' : 'bad'}`, picked === stepObj.correct ? 'Correct!' : 'Not quite. The green one is right.'));
  } else if (typed) {
    const row = node('div', 'attempt-row');
    const input = node('input', 'attempt-input');
    input.type = 'text';
    input.placeholder = 'Type it the way you’d write it on the exam';
    input.value = st.answer ?? '';
    input.autocapitalize = 'off';
    input.spellcheck = false;
    const check = node('button', 'btn primary', 'Check');
    const submit = () => {
      const v = input.value.trim();
      if (!v) return input.focus();
      st.answer = v;
      const ok = normAnswer(v) === normAnswer(p.key.gist);
      st.answerResult = ok ? 'right' : 'check';
      if (ok) answeredRight(check);
      openKey();
    };
    check.onclick = submit;
    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submit();
      }
    };
    input.oninput = () => {
      st.answer = input.value;
      save();
    };
    row.append(input, check);
    card.append(row);
    if (st.answerResult === 'right') card.append(node('div', 'verdict good', 'Correct! It matches the key.'));
    if (st.answerResult === 'wrong') card.append(node('div', 'verdict bad', 'Marked as missed. The answer is below.'));
    if (st.answerResult === 'had') card.append(node('div', 'verdict good', 'Marked as right.'));
    if (st.answerResult === 'check') {
      const v = node('div', 'verdict neutral', 'Doesn’t match the key word for word. Compare with the answer below. Did you get it?');
      const grade = node('div', 'row');
      const had = node('button', 'btn', 'I had it');
      const miss = node('button', 'btn ghost', 'I missed it');
      had.onclick = () => {
        st.answerResult = 'had';
        answeredRight(had);
        save();
        renderPage();
      };
      miss.onclick = () => {
        st.answerResult = 'wrong';
        state.game.streak = 0;
        state.game.awarded[`${slotKey(state.questionNumber, p.id)}:answer:tried`] = true;
        pet.sad();
        save();
        renderPage();
      };
      grade.append(had, miss);
      card.append(v, grade);
    }
  }

  if (hideSteps) {
    const row = node('div', 'row');
    if (!st.keyOpen) {
      const show = node('button', typed || ci >= 0 ? 'btn' : 'btn primary', 'Show answer');
      show.onclick = openKey;
      row.append(show);
    }
    const walk = node('button', 'btn ghost', 'Walk me through it');
    walk.onclick = () => {
      state.walk.add(slotKey(state.questionNumber, p.id));
      renderPage();
    };
    row.append(walk);
    card.append(row);
  }
  return card;
}

function answeredRight(button) {
  const g = state.game;
  const key = `${slotKey(state.questionNumber, part().id)}:answer`;
  if (g.awarded[`${key}:tried`]) return; // only the first attempt counts
  petHappy();
  g.streak += 1;
  g.best = Math.max(g.best, g.streak);
  if (earn(key, 10, 'Answered it yourself')) celebrate(button);
  if (g.streak % 5 === 0) earn(`streak:${g.earned}`, 20, `${g.streak} in a row`);
}

function openKey() {
  const st = slot();
  st.keyOpen = true;
  markActive();
  save();
  const y = el('scroll').scrollTop;
  renderPage();
  el('scroll').scrollTop = y;
  document.querySelector('.answer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function applySidebar() {
  const shown = state.prefs.sidebar !== false;
  document.documentElement.classList.toggle('sidebar-hidden', !shown);
  el('side-btn').title = shown ? 'Hide the sidebar (⌘\\)' : 'Show the sidebar (⌘\\)';
  el('side-btn').classList.toggle('on', !shown);
}

function toggleSidebar() {
  state.prefs.sidebar = state.prefs.sidebar === false;
  save();
  applySidebar();
  ink?.redraw();
}

function toggleHints() {
  state.prefs.noHints = !state.prefs.noHints;
  state.walk.clear(); // turning it on hides the steps everywhere again
  save();
  renderToolbar();
  if (state.view === 'part') renderPage();
  toast(state.prefs.noHints ? 'No-hints mode' : 'Hints back on', state.prefs.noHints ? 'Hint lines and steps are hidden' : '');
}

// Which question this is, just above it.
function questionLabel(q, p) {
  const pts = p.points ?? (q.parts.length === 1 ? q.points : undefined);
  return node('div', 'q-label', `Question ${q.number} ${partLabel(p)}${pts ? ` · ${pts} point${pts === 1 ? '' : 's'}` : ''}`);
}

// The exam's full wording for one part (optionally without the Hint: lines).
function buildProblem(q, p, hideHints) {
  const prob = node('section', 'card problem');
  // The exam's full wording: shared setup, the question's figure/table, then this part.
  // `ask` may be one string or a list of paragraphs (paragraphs may hold lists).
  const keep = (para) => !(hideHints && isHint(para));
  for (const para of (q.preamble ?? []).filter(keep)) prob.append(rich('div', 'setup', para));
  if (q.table) prob.append(renderTable(q.table));
  if (q.figure) prob.insertAdjacentHTML('beforeend', q.figure);
  for (const para of [].concat(p.ask).filter(keep)) prob.append(rich('div', 'ask', para));
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
  return prob;
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

// ---------- commands ----------

function switchExam(id) {
  if (testActive()) {
    el('exam-picker').value = exam.id;
    return toast('Not during a test', 'Submit or quit it first');
  }
  exam = exams.find((e) => e.id === id) ?? exams[0];
  const last = state.last[exam.id];
  const q = last && exam.questions.find((x) => x.number === last.q);
  if (q && q.parts.some((p) => p.id === last.p)) go(q.number, last.p);
  else go(exam.questions[0].number, exam.questions[0].parts[0].id);
}

function go(qNumber, partId) {
  // During a test the sidebar and arrows move between test questions, never to the walkthrough.
  if (testActive()) state.test.confirming = false;
  state.view = testActive() ? 'test' : 'part';
  state.questionNumber = qNumber;
  state.partId = partId;
  save();
  renderAll();
}

function step(delta) {
  if (state.view !== 'part' && state.view !== 'test') return;
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
    markActive();
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
  state.walk.add(slotKey(state.questionNumber, state.partId));
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
  state.walk.delete(slotKey(state.questionNumber, state.partId)); // back to no-hints if it's on
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
  if (open && state.view !== 'part') return;
  state.solutionOpen = open;
  renderSolution();
  renderToolbar();
}

// ---------- test mode ----------
// A timed run through the whole document with nothing to lean on: no steps, hints, answer
// key or staff solution until you submit. Multiple choice and short answers that
// match the key grade themselves; you grade the rest against the key, or export a PDF with
// grading instructions for an AI.

const TEST_LIMITS = [0, 30, 50, 80, 110, 170]; // minutes; 0 = no limit
let testTimer = null;

const testActive = () => !!state.test && !state.test.submitted && state.test.examId === exam.id;
const partKey = (q, p) => `${q.number}.${p.id}`;
const testInkKey = (q, p) => `test:${state.test?.started}:${slotKey(q.number, p.id)}`;
const testKind = (p) => (choiceStep(p) >= 0 ? 'choice' : shortAnswer(p) ? 'short' : 'long');
const testElapsed = () => Math.max(0, ((state.test.submitted ? state.test.ended : Date.now()) - state.test.started) / 1000);
const clock = (secs) => {
  secs = Math.max(0, Math.round(secs));
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = String(secs % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
};

function testAnswer(q, p) {
  return (state.test.answers[partKey(q, p)] ??= {});
}
function testHandwriting(q, p) {
  return (state.ink[testInkKey(q, p)] ?? []).filter((s) => s.a === 'attempt' || s.a === 'problem');
}
function testAnswered(q, p) {
  const a = state.test?.answers[partKey(q, p)] ?? {};
  return a.pick !== undefined || !!a.text?.trim() || testHandwriting(q, p).some((s) => s.a === 'attempt');
}

// Points when every part has them; otherwise every part counts the same.
function testWeights() {
  const parts = allParts();
  const usePoints = parts.every(({ p }) => typeof p.points === 'number' && p.points > 0);
  return { usePoints, weight: (p) => (usePoints ? p.points : 1) };
}

function recordAttempt() {
  const t = state.test;
  const parts = allParts();
  const list = (state.tests[t.examId] ??= []);
  let rec = list.find((r) => r.started === t.started);
  if (!rec) list.push((rec = { started: t.started }));
  Object.assign(rec, { secs: Math.round(testElapsed()), limitMin: t.limitMin, answered: parts.filter(({ q, p }) => testAnswered(q, p)).length, parts: parts.length });
}

function showTest() {
  if (testActive()) state.view = 'test';
  else if (state.view === 'test-start' || state.view === 'test-results') state.view = 'part';
  else state.view = state.test?.submitted && state.test.examId === exam.id && state.view !== 'part' ? 'test-results' : 'test-start';
  state.solutionOpen = false;
  renderAll();
}

function startTest(limitMin) {
  const first = allParts()[0];
  state.test = { examId: exam.id, started: Date.now(), limitMin, answers: {}, submitted: false };
  state.prefs.testLimit = limitMin;
  state.questionNumber = first.q.number;
  state.partId = first.p.id;
  state.view = 'test';
  if (ink?.open) ink.toggle(false);
  markActive();
  save();
  renderAll();
  startTestTimer();
}

function startTestTimer() {
  clearInterval(testTimer);
  testTimer = setInterval(tickTest, 1000);
  tickTest();
}

function tickTest() {
  const c = el('test-clock');
  if (!testActive()) {
    clearInterval(testTimer);
    c.hidden = true;
    return;
  }
  const t = state.test;
  const secs = testElapsed();
  c.hidden = false;
  if (t.limitMin) {
    const left = t.limitMin * 60 - secs;
    c.textContent = `${clock(left)} left`;
    c.classList.toggle('low', left < 300);
    if (left <= 0) {
      toast('Time’s up', 'Your test was submitted');
      submitTest();
    }
  } else {
    c.textContent = clock(secs);
    c.classList.remove('low');
  }
}

function submitTest() {
  const t = state.test;
  if (!t || t.submitted) return;
  t.submitted = true;
  t.ended = t.limitMin ? Math.min(Date.now(), t.started + t.limitMin * 60000) : Date.now();
  t.confirming = false;
  clearInterval(testTimer);
  recordAttempt();
  earn(`test:${t.examId}:${t.started}`, 25, 'Finished a test');
  state.view = 'test-results';
  save();
  renderAll();
}

function quitTest() {
  const t = state.test;
  for (const { q, p } of allParts()) delete state.ink[testInkKey(q, p)];
  state.test = null;
  clearInterval(testTimer);
  state.view = 'part';
  save();
  renderAll();
  toast('Test ended', 'Nothing was graded');
  void t;
}

function renderTestStart(page) {
  page.append(node('h1', null, 'Test mode'));
  const n = allParts().length;
  page.append(node('p', 'test-lede', `${exam.term} · ${exam.title}: ${exam.questions.length} questions, ${n} parts.`));

  const rules = node('section', 'card');
  rules.append(node('div', 'card-label', 'How it works'));
  const ul = node('ul', 'test-rules');
  for (const line of [
    'No hints, steps, answer key or staff solution until you submit.',
    'Pick an answer, type it, or write it with the Pencil (or the Ink tool). Work in any order.',
    'When you submit, download a PDF of your test and give it to ChatGPT or Claude. It grades every part, with partial credit.'
  ]) ul.append(node('li', null, line));
  rules.append(ul);

  const row = node('div', 'test-start-row');
  const lab = node('label', 'test-limit');
  lab.append(node('span', null, 'Time limit'));
  const sel = node('select', 'exam-picker');
  for (const m of TEST_LIMITS) sel.append(new Option(m ? `${m} minutes` : 'No limit (just time me)', String(m)));
  sel.value = String(state.prefs.testLimit ?? 0);
  lab.append(sel);
  const go = node('button', 'btn primary', 'Start test');
  go.onclick = () => startTest(Number(sel.value));
  row.append(lab, go);
  rules.append(row);
  page.append(rules);

  const past = state.tests[exam.id] ?? [];
  if (past.length) {
    const sec = node('section', 'card');
    sec.append(node('div', 'card-label', 'Your past tests'));
    const tbl = node('table', 'data test-history');
    tbl.innerHTML = '<tr><th>Date</th><th>Answered</th><th>Time</th></tr>';
    for (const r of [...past].reverse().slice(0, 10)) {
      const tr = node('tr');
      tr.append(
        node('td', null, new Date(r.started).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })),
        node('td', null, r.parts ? `${r.answered} of ${r.parts}` : '—'),
        node('td', null, `${clock(r.secs)}${r.limitMin ? ` of ${r.limitMin}:00` : ''}`)
      );
      tbl.append(tr);
    }
    sec.append(tbl);
    page.append(sec);
  }
  el('st-progress').textContent = 'Test mode';
}

function renderTestPart(page) {
  const t = state.test;
  const q = question();
  const p = part();
  page.append(questionLabel(q, p));
  page.append(buildProblem(q, p, true));

  const a = testAnswer(q, p);
  const kind = testKind(p);
  const card = node('section', 'card attempt test-answer');
  card.append(node('div', 'attempt-label', 'Your answer'));
  if (kind === 'choice') {
    const st = p.steps[choiceStep(p)];
    const box = node('div', 'choices');
    st.choices.forEach((label, c) => {
      const b = rich('button', `choice${a.pick === c ? ' picked' : ''}`, label);
      b.onclick = () => {
        a.pick = a.pick === c ? undefined : c;
        save();
        renderPage();
        renderSidebar();
      };
      box.append(b);
    });
    card.append(box);
  } else if (kind === 'short') {
    const input = node('input', 'attempt-input');
    input.type = 'text';
    input.placeholder = 'Type your answer';
    input.value = a.text ?? '';
    input.autocapitalize = 'off';
    input.spellcheck = false;
    input.oninput = () => {
      a.text = input.value;
      save();
      renderSidebar();
    };
    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        step(1);
      }
    };
    card.append(input);
  } else {
    const ta = node('textarea', 'test-text');
    ta.placeholder = 'Type your answer here, or write it with the Pencil in the space below.';
    ta.value = a.text ?? '';
    ta.oninput = () => {
      a.text = ta.value;
      save();
      renderSidebar();
    };
    card.append(ta);
  }
  card.append(node('div', `write-space${kind === 'long' ? ' tall' : ''}`, 'Room to write'));
  page.append(card);

  // Previous / next, and a way out.
  const idx = partIndex();
  const parts = allParts();
  const nav = node('div', 'test-nav');
  const prev = node('button', 'btn', '← Previous');
  prev.disabled = idx === 0;
  prev.onclick = () => step(-1);
  const answered = parts.filter(({ q: qq, p: pp }) => testAnswered(qq, pp)).length;
  const mid = node('span', 'test-count', `${answered} of ${parts.length} answered`);
  const next = idx < parts.length - 1 ? node('button', 'btn primary', 'Next →') : node('button', 'btn primary', 'Review and submit');
  next.onclick = () => (idx < parts.length - 1 ? step(1) : askSubmit());
  nav.append(prev, mid, next);
  page.append(nav);

  if (t.confirming) page.append(renderSubmitConfirm());
  el('st-progress').textContent = `Test · Q${q.number} ${partLabel(p)} · ${answered} of ${parts.length} answered`;
}

function askSubmit() {
  state.test.confirming = true;
  renderPage();
  document.querySelector('.test-confirm')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function renderSubmitConfirm() {
  const parts = allParts();
  const blank = parts.filter(({ q, p }) => !testAnswered(q, p));
  const box = node('section', 'card test-confirm');
  box.append(node('div', 'card-label', 'Submit your test?'));
  box.append(
    node('p', null, blank.length ? `${blank.length} of ${parts.length} parts are still blank: ${blank.map(({ q, p }) => `Q${q.number} ${partLabel(p)}`).join(', ')}. Blank parts get zero.` : 'Every part has an answer.')
  );
  const row = node('div', 'row');
  const keep = node('button', 'btn', 'Keep working');
  keep.onclick = () => {
    state.test.confirming = false;
    renderPage();
  };
  const sub = node('button', 'btn primary', 'Submit and grade');
  sub.onclick = submitTest;
  const quit = node('button', 'btn ghost', 'Quit without grading');
  quit.onclick = quitTest;
  row.append(sub, keep, quit);
  box.append(row);
  return box;
}

function renderTestResults(page) {
  const t = state.test;
  const parts = allParts();
  const answered = parts.filter(({ q, p }) => testAnswered(q, p)).length;
  page.append(node('h1', null, 'Test submitted'));
  page.append(node('p', 'test-lede', `${exam.term} · ${exam.title} · ${answered} of ${parts.length} parts answered · time ${clock(testElapsed())}${t.limitMin ? ` of ${t.limitMin}:00` : ''}`));

  const card = node('section', 'card test-done');
  card.append(node('div', 'card-label', 'Get it graded'));
  const steps = node('ol', 'test-rules');
  for (const line of [
    'Download the PDF. It has every question, your answers and handwriting, grading instructions, and the answer key.',
    'Give it to ChatGPT or Claude: drag it into a new chat (or share it to the app on your iPad) and say “grade this”.',
    'You get a score for each part with partial credit, what you missed, and what to review first.'
  ]) steps.append(node('li', null, line));
  card.append(steps);
  const row = node('div', 'row');
  const pdf = node('button', 'btn primary big', 'Download PDF');
  pdf.onclick = () => exportTestPDF(pdf);
  const again = node('button', 'btn', 'Take it again');
  again.onclick = () => {
    state.view = 'test-start';
    renderAll();
  };
  const back = node('button', 'btn ghost', 'Back to studying');
  back.onclick = () => {
    state.view = 'part';
    renderAll();
  };
  row.append(pdf, again, back);
  card.append(row);
  page.append(card);
  el('st-progress').textContent = 'Test submitted';
}

// Handwriting as an SVG, cropped to the ink and scaled to fit `maxW` pixels.
function inkSVG(strokes, maxW, { crop = true, screen = false } = {}) {
  if (!strokes.length) return '';
  const w0 = strokes[0].w;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const paths = strokes.map((s) => {
    const k = w0 / s.w;
    const pts = [];
    for (let i = 0; i < s.p.length; i += 3) {
      const x = s.p[i] * k;
      const y = s.p[i + 1] * k;
      pts.push([x, y]);
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
    let avg = 0;
    for (let i = 2; i < s.p.length; i += 3) avg += s.p[i] || 0.5;
    avg /= Math.max(1, s.p.length / 3);
    return { s, pts, width: s.h ? 16 : 1.1 + avg * 2.6 };
  });
  const pad = crop ? 10 : 0;
  if (!crop) {
    minX = 0;
    minY = 0;
    maxX = w0;
  }
  const vw = maxX - minX + pad * 2;
  const vh = maxY - minY + pad * 2;
  const scale = Math.min(1, maxW / vw);
  let body = '';
  for (const { s, pts, width } of paths) {
    const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${(x - minX + pad).toFixed(1)},${(y - minY + pad).toFixed(1)}`).join(' ');
    const color = screen && s.c === '#1f2937' ? 'currentColor' : s.c; // “black” ink follows the theme on screen
    body += pts.length === 1
      ? `<circle cx="${(pts[0][0] - minX + pad).toFixed(1)}" cy="${(pts[0][1] - minY + pad).toFixed(1)}" r="1.8" fill="${color}"/>`
      : `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round"${s.h ? ' opacity="0.32"' : ''}/>`;
  }
  return `<svg class="ink-svg" viewBox="0 0 ${vw.toFixed(1)} ${vh.toFixed(1)}" width="${(vw * scale).toFixed(0)}" height="${(vh * scale).toFixed(0)}">${body}</svg>`;
}

// ---------- PDF for AI grading ----------

function lightThemeCSS() {
  // The PDF is always light: reuse the light color variables, whatever the app is showing.
  try {
    const sheet = [...document.styleSheets].find((s) => s.href?.endsWith('styles.css'));
    const root = [...sheet.cssRules].find((r) => r.selectorText === ':root');
    return `:root.print { ${root.style.cssText} }`;
  } catch {
    return '';
  }
}

function buildTestPDF() {
  const t = state.test;
  const { usePoints, weight } = testWeights();
  const totalPoints = allParts().reduce((n, { p }) => n + weight(p), 0);
  const esc = (x) => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const when = new Date(t.started).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  const limit = t.limitMin ? `${t.limitMin} minutes` : 'none';
  const outOf = (p) => (usePoints ? `${weight(p)} point${weight(p) === 1 ? '' : 's'}` : '1 point');

  let html = `<!doctype html><html class="print"><head><meta charset="utf-8"><base href="${new URL('.', location.href).href}">
<title>${esc(`${exam.course} ${exam.term} ${exam.title} test`)}</title>
<link rel="stylesheet" href="styles.css"><style>${lightThemeCSS()}${PDF_CSS}</style></head><body class="pdf">`;

  html += `<section class="pdf-cover">
<div class="pdf-howto"><b>To get this graded:</b> give this PDF to ChatGPT or Claude (drag it into a new chat) and say “grade this”. Everything below is written for the AI.</div>
<h1>${esc(`${exam.course} · ${exam.term} · ${exam.title}`)}</h1>
<p class="pdf-meta">Practice test taken ${esc(when)} · time used ${clock(testElapsed())} · time limit ${limit} · ${allParts().length} parts${usePoints ? ` · ${totalPoints} points` : ''}</p>
<div class="pdf-instructions">
<h2>Instructions for the grader</h2>
<p>You are grading a student's practice test for UC Berkeley CS 170 (Efficient Algorithms and Intractable Problems). The student took it under exam conditions with no notes or hints. Each part below shows the question, then the student's answer: a selected choice, typed text, and/or handwriting (shown as an image; marks drawn on the question itself are scratch work).</p>
<ol>
<li>For every part, compare the student's answer with the reference solution in the appendix at the end. Accept any correct answer, even if it is worded, structured or proven differently from the reference.</li>
<li>For algorithm and proof questions, check the main idea, the correctness argument, and the runtime separately, and give partial credit for each part that is right.</li>
<li>Give each part a score out of the points shown next to it. A blank answer gets 0. Don't give credit for an answer that only restates the question.</li>
<li>For each part, write one or two sentences on what was right and what was missing or wrong.</li>
<li>At the end, give a table with columns Part, Score, Out of, and Comment, then the total score and percentage, then the three topics the student should review first.</li>
</ol>
</div></section>`;

  for (const { q, p } of allParts()) {
    const a = t.answers[partKey(q, p)] ?? {};
    const kind = testKind(p);
    const hand = testHandwriting(q, p);
    html += `<section class="pdf-part"><h2>Question ${q.number} ${esc(partLabel(p))} <span>${esc(outOf(p))}</span></h2>`;
    // The question, with any marks the student made on it drawn on top.
    const probStrokes = hand.filter((s) => s.a === 'problem');
    const probHTML = buildProblem(q, p, true).outerHTML;
    if (probStrokes.length) {
      const w = probStrokes[0].w;
      html += `<div class="pdf-fit" style="width:${w}px;zoom:${(PDF_WIDTH / w).toFixed(4)}"><div class="pdf-overlay">${probHTML}${inkSVG(probStrokes, 1e9, { crop: false }).replace('<svg class="ink-svg"', '<svg class="ink-svg ink-over"')}</div></div>`;
    } else html += probHTML;

    html += `<div class="pdf-answer"><div class="pdf-lab">Student's answer</div>`;
    let any = false;
    if (kind === 'choice') {
      const st = p.steps[choiceStep(p)];
      html += `<ul class="pdf-choices">${st.choices.map((c, i) => `<li class="${a.pick === i ? 'on' : ''}">${a.pick === i ? '☒' : '☐'} ${c}</li>`).join('')}</ul>`;
      any = a.pick !== undefined;
    }
    if (a.text?.trim()) {
      html += `<div class="pdf-text">${esc(a.text.trim())}</div>`;
      any = true;
    }
    const written = inkSVG(hand.filter((s) => s.a === 'attempt'), PDF_WIDTH - 40);
    if (written) {
      html += `<div class="pdf-lab small">Handwritten</div>${written}`;
      any = true;
    }
    if (!any) html += '<p class="pdf-blank">(left blank)</p>';
    html += '</div></section>';
  }

  html += '<section class="pdf-key"><h1>Appendix: reference solutions (for the grader)</h1>';
  for (const { q, p } of allParts()) {
    html += `<div class="pdf-key-part"><h3>Question ${q.number} ${esc(partLabel(p))} · ${p.name} <span>${esc(outOf(p))}</span></h3><div class="pdf-gist">${p.key.gist}</div>`;
    for (const para of p.key.body ?? []) html += `<div>${para}</div>`;
    if (p.key.runtime) html += `<div>Runtime: ${p.key.runtime}</div>`;
    // The walkthrough's reasoning, so the grader can judge partial work.
    html += `<ol class="pdf-steps">${p.steps.map((st) => `<li><b>${st.title}.</b> ${st.simple}</li>`).join('')}</ol>`;
    html += '</div>';
  }
  html += '</section></body></html>';
  return html;
}

const PDF_WIDTH = 700; // CSS px across the printable area of a letter page
const PDF_CSS = `
html.print, html.print body { background: #fff; color: #1d1d1f; height: auto; overflow: visible; }
body.pdf { display: block; margin: 0; padding: 0; font-size: 13px; }
.pdf h1 { font-size: 20px; margin: 0 0 6px; }
.pdf-meta { color: #555; margin: 0 0 14px; }
.pdf-howto { background: #fff6d6; border: 1px solid #ecc58f; border-radius: 8px; padding: 9px 14px; margin: 0 0 16px; font-size: 13.5px; }
.pdf-instructions { border: 1px solid #ccc; border-radius: 8px; padding: 10px 16px; background: #f7f7f9; }
.pdf-instructions h2 { font-size: 15px; margin: 4px 0 6px; }
.pdf-instructions li { margin: 3px 0; }
.pdf-cover { break-after: page; }
.pdf-part { break-inside: auto; margin: 0 0 22px; }
.pdf-part h2 { font-size: 15px; margin: 0 0 6px; border-bottom: 1px solid #ddd; padding-bottom: 4px; break-after: avoid; }
.pdf .problem, .pdf-fit { break-inside: avoid; }
.pdf-steps { margin: 4px 0 0; padding-left: 20px; color: #444; font-size: 12px; }
.pdf-steps li { margin: 2px 0; }
.pdf-steps .fig, .pdf-steps figure { display: none; }
.pdf-part h2 span, .pdf-key h3 span { font-weight: 400; color: #666; font-size: 12.5px; }
.pdf .card { background: #fff; margin-bottom: 10px; padding: 12px 14px; }
.pdf .problem .setup, .pdf .problem .ask { font-size: 13px; }
.pdf-fit { transform-origin: top left; }
.pdf-overlay { position: relative; }
.pdf .ink-over { position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; }
.pdf-answer { border: 1.5px solid #1a62d0; border-radius: 10px; padding: 10px 14px; break-inside: avoid; }
.pdf-lab { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #1a62d0; margin-bottom: 6px; }
.pdf-lab.small { margin-top: 8px; color: #666; }
.pdf-text { white-space: pre-wrap; font: 13px/1.5 ui-monospace, Menlo, monospace; }
.pdf-choices { list-style: none; padding: 0; margin: 4px 0; }
.pdf-choices li { margin: 2px 0; color: #666; }
.pdf-choices li.on { color: #111; font-weight: 700; }
.pdf-prompt { margin: 0 0 4px; color: #444; }
.pdf-blank { color: #999; font-style: italic; margin: 0; }
.pdf .ink-svg { display: block; max-width: 100%; height: auto; }
.pdf-key { break-before: page; }
.pdf-key h1 { font-size: 18px; }
.pdf-key-part { margin: 0 0 14px; break-inside: avoid; }
.pdf-key-part h3 { font-size: 13.5px; margin: 0 0 3px; }
.pdf-gist { font-weight: 600; margin-bottom: 3px; }
.pdf .fig { break-inside: avoid; }
`;

async function exportTestPDF(button) {
  const name = `${exam.course} ${exam.term} ${exam.title} test ${dayKey(new Date(state.test.started))}.pdf`.replace(/[/\\:]/g, '-');
  const html = buildTestPDF();
  if (!window.study.exportPDF) return toast('Not available', 'PDF export needs the app');
  const label = button.textContent;
  button.disabled = true;
  button.textContent = 'Making the PDF…';
  try {
    const res = await window.study.exportPDF(html, name);
    if (res?.ok) toast('PDF ready', 'Give it to ChatGPT or Claude to grade');
  } catch (e) {
    toast('Couldn’t make the PDF', String(e?.message ?? e));
  } finally {
    button.disabled = false;
    button.textContent = label;
  }
}

// ---------- settings ----------

const TEXT_SIZES = [['Small', 0.92], ['Default', 1], ['Large', 1.1], ['Larger', 1.22]];

function applyPrefs() {
  const root = document.documentElement;
  const theme = state.prefs.theme ?? 'system';
  if (theme === 'system') delete root.dataset.theme;
  else root.dataset.theme = theme;
  root.style.setProperty('--page-zoom', state.prefs.textSize ?? 1);
  window.study.setTheme?.(theme); // window chrome, scrollbars and the iPad's Paper follow along
  applySidebar();
  ink?.redraw();
}

function setPref(key, value) {
  state.prefs[key] = value;
  if (key === 'noHints') state.walk.clear();
  save();
  applyPrefs();
  if (key === 'showPet') applyLooks();
  renderToolbar();
  renderPage();
}

function showSettings() {
  if (state.view === 'test' && testActive()) return toast('Not during a test', 'Submit first');
  state.view = state.view === 'settings' ? 'part' : 'settings';
  state.solutionOpen = false;
  renderAll();
}

function renderSettings() {
  const page = el('page');
  page.replaceChildren();
  page.append(node('h1', null, 'Settings'));

  const group = (title, rows) => {
    const sec = node('section', 'settings-group');
    sec.append(node('h2', null, title));
    const card = node('div', 'card settings-card');
    for (const r of rows) card.append(r);
    sec.append(card);
    page.append(sec);
  };
  const row = (label, desc, control) => {
    const r = node('div', 'set-row');
    const t = node('div', 'set-text');
    t.append(node('div', 'set-label', label));
    if (desc) t.append(node('div', 'set-desc', desc));
    r.append(t, control);
    return r;
  };
  const segmented = (options, current, onPick) => {
    const box = node('div', 'segmented');
    for (const [label, value] of options) {
      const b = node('button', value === current ? 'on' : '', label);
      b.onclick = () => onPick(value);
      box.append(b);
    }
    return box;
  };
  const toggle = (on, onFlip) => {
    const b = node('button', `switch${on ? ' on' : ''}`);
    b.setAttribute('role', 'switch');
    b.setAttribute('aria-checked', String(on));
    b.append(node('span'));
    b.onclick = () => onFlip(!on);
    return b;
  };

  const accent = shopItem(state.game.equipped.accent);
  const shopLink = node('button', 'btn ghost set-link');
  const sw = node('span', 'set-swatch');
  sw.style.background = accent?.swatch ?? 'var(--sel)';
  shopLink.append(sw, document.createTextNode(`${accent?.name ?? 'Blue'} · change in the shop`));
  shopLink.onclick = showShop;

  group('Appearance', [
    row('Theme', 'System follows your Mac or iPad.', segmented([['System', 'system'], ['Light', 'light'], ['Dark', 'dark']], state.prefs.theme ?? 'system', (v) => setPref('theme', v))),
    row('Text size', 'Questions, steps and diagrams.', segmented(TEXT_SIZES, state.prefs.textSize ?? 1, (v) => setPref('textSize', v))),
    row('Accent color', null, shopLink)
  ]);

  group('Studying', [
    row('No-hints mode', 'Hide Hint lines and the guided steps; answer first, then check. (Also the lightbulb in the toolbar.)', toggle(!!state.prefs.noHints, (v) => setPref('noHints', v))),
    row('Sidebar', 'The question list on the left. (Also ⌘\\.)', toggle(state.prefs.sidebar !== false, (v) => setPref('sidebar', v))),
    row('Celebrations', 'Confetti, sparks, coin showers and fireworks from the shop.', toggle(state.prefs.effects !== false, (v) => setPref('effects', v))),
    row('Show my pet', 'Your pet still gets hungry while it’s hidden.', toggle(state.prefs.showPet !== false, (v) => setPref('showPet', v)))
  ]);

  const limit = node('select', 'exam-picker set-select');
  for (const m of TEST_LIMITS) limit.append(new Option(m ? `${m} minutes` : 'No limit', String(m)));
  limit.value = String(state.prefs.testLimit ?? 0);
  limit.onchange = () => setPref('testLimit', Number(limit.value));
  const hist = Object.values(state.tests).reduce((n, l) => n + l.length, 0);
  group('Tests', [row('Default time limit', `You’ve taken ${hist} test${hist === 1 ? '' : 's'}.`, limit)]);

  const reset = node('button', 'btn danger', 'Reset…');
  const resetRow = row('Reset study progress', 'Hides every step you’ve revealed and clears your notes and handwriting, for every exam. Coins, pets and test history stay.', reset);
  reset.onclick = () => {
    if (resetRow.querySelector('.set-confirm')) return;
    const c = node('div', 'set-confirm');
    c.append(node('span', null, 'Reset all study progress?'));
    const yes = node('button', 'btn danger', 'Reset');
    yes.onclick = () => {
      state.progress = {};
      for (const k of Object.keys(state.ink)) if (!k.startsWith('test:')) delete state.ink[k];
      save();
      renderSidebar();
      renderPage();
      toast('Progress reset', 'Every part starts fresh');
    };
    const no = node('button', 'btn ghost', 'Cancel');
    no.onclick = () => c.remove();
    c.append(yes, no);
    resetRow.querySelector('.set-text').append(c);
  };
  group('Data', [resetRow]);

  const total = exams.reduce((n, e) => n + e.questions.reduce((m, q) => m + q.parts.length, 0), 0);
  page.append(node('p', 'set-foot', `${exams.length} exams and worksheets · ${total} parts.`));
  el('st-progress').textContent = 'Settings';
}

// ---------- coins and shop ----------

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
  { group: 'Pets', note: 'A little pixel friend who lives in the corner of the page. It cheers when you get things right, and naps when you’re away. It has to be fed: tap it to see its hunger and hearts and give it food. You can also drag it around.', items: [
    { id: 'pet-penguin', name: 'Penguin', price: 120, slot: 'pet', sprite: 'penguin', desc: 'Drop it from up high: it flaps its way slowly down, then belly-slides.' },
    { id: 'pet-cat', name: 'Cat', price: 150, slot: 'pet', sprite: 'cat', desc: 'Drop it from up high: it flips and always lands on its feet.' },
    { id: 'pet-dog', name: 'Dog', price: 150, slot: 'pet', sprite: 'dog', desc: 'Drop it: it bounces, then chases its tail.' },
    { id: 'pet-frog', name: 'Frog', price: 150, slot: 'pet', sprite: 'frog', desc: 'Drop it: it leaps away in big arcs.' },
    { id: 'pet-bunny', name: 'Bunny', price: 180, slot: 'pet', sprite: 'bunny', desc: 'Drop it: it does a happy binky, then hops off.' },
    { id: 'pet-dragon', name: 'Dragon', price: 300, slot: 'pet', sprite: 'dragon', desc: 'Drop it: it glides down on its wings and breathes fire.' },
    { id: 'pet-bluebird', name: 'Bluebird', price: 160, slot: 'pet', sprite: 'bluebird', desc: 'Drop it: it sings all the way down.' },
    { id: 'pet-owl', name: 'Owl', price: 200, slot: 'pet', sprite: 'owl', desc: 'Drop it: it glides down and turns its head.' },
    { id: 'pet-parrot', name: 'Parrot', price: 220, slot: 'pet', sprite: 'parrot', desc: 'Drop it: it squawks algorithm facts.' }
  ] },
  { group: 'Pet food', note: 'Pets get hungry over about a day and a half, and a hungry pet starts losing hearts. Tap your pet to feed it. Hearts also go up when you pet it and when you get answers right.', items: [
    { id: 'snack', name: 'Snack', price: 10, slot: 'food', food: 'snack', hunger: 25, hearts: 2, desc: 'A quarter of the hunger bar.' },
    { id: 'meal', name: 'Meal', price: 25, slot: 'food', food: 'meal', hunger: 60, hearts: 6, desc: 'Most of the hunger bar.' },
    { id: 'cake', name: 'Cake', price: 40, slot: 'food', food: 'cake', hunger: 30, hearts: 25, desc: 'A little food and a whole heart.' }
  ] },
  { group: 'Extras', note: '', items: [
    { id: 'extra-streak', name: 'Streak counter', price: 50, slot: null, desc: 'Shows how many you’ve gotten right in a row, next to your coins.' }
  ] }
];
const shopItem = (id) => SHOP.flatMap((g) => g.items).find((it) => it.id === id);
const owns = (id) => state.game.owned.includes(id);

function earn(key, amount, reason) {
  const g = state.game;
  markActive();
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
  petHappy();
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
    petHappy(true);
  }
}

// ---------- pet care ----------

const HUNGER_PER_HOUR = 3; // a full pet is empty after about 33 hours
const HEARTS_LOST_STARVING = 4; // per hour spent at zero hunger

function careFor(kind) {
  const now = Date.now();
  const c = (state.game.care[kind] ??= { hunger: 80, hearts: 50, t: now });
  const hours = Math.max(0, (now - c.t) / 3.6e6);
  let hunger = c.hunger - HUNGER_PER_HOUR * hours;
  if (hunger < 0) {
    c.hearts = Math.max(0, c.hearts - (-hunger / HUNGER_PER_HOUR) * HEARTS_LOST_STARVING);
    hunger = 0;
  }
  c.hunger = hunger;
  c.t = now;
  return c;
}

const addHearts = (kind, n) => {
  const c = careFor(kind);
  c.hearts = Math.max(0, Math.min(100, c.hearts + n));
};

function equippedPetKind() {
  return shopItem(state.game.equipped.pet)?.sprite ?? null;
}

// Correct answers make the pet happy, and a fed pet grows fonder of you.
function petHappy(big = false) {
  const kind = equippedPetKind();
  if (kind && careFor(kind).hunger > 0) addHearts(kind, big ? 3 : 1);
  pet.happy(big);
}

const PET_CARE = {
  get: (kind) => {
    const c = careFor(kind);
    const idle = idleDays();
    return {
      hunger: Math.round(c.hunger),
      hearts: Math.round(c.hearts),
      sick: idle >= PET_SICK_DAYS,
      daysLeft: Math.max(1, Math.ceil(PET_DIES_DAYS - idle))
    };
  },
  foods: () =>
    SHOP.flatMap((g) => g.items)
      .filter((it) => it.slot === 'food')
      .map((it) => ({ id: it.food, name: it.name, count: state.game.food[it.food] ?? 0, hunger: it.hunger, hearts: it.hearts })),
  feed: (kind, id) => {
    const item = SHOP.flatMap((g) => g.items).find((it) => it.food === id);
    if (!item || !(state.game.food[id] > 0)) return false;
    state.game.food[id] -= 1;
    const c = careFor(kind);
    c.hunger = Math.min(100, c.hunger + item.hunger);
    c.hearts = Math.min(100, c.hearts + item.hearts);
    markActive();
    save();
    if (state.view === 'shop') renderShop();
    return true;
  },
  petted: (kind) => {
    const c = careFor(kind);
    if (Date.now() - (c.petted ?? 0) > 10 * 60 * 1000) {
      c.petted = Date.now();
      addHearts(kind, 2);
      save();
    }
  },
  openShop: () => showShop()
};

// ---------- neglect ----------
// A pet left alone gets sick after 3 days without a single answer, and dies after 5.

const PET_SICK_DAYS = 3;
const PET_DIES_DAYS = 5;
const idleDays = () => (Date.now() - (state.game.lastStudy ?? Date.now())) / 864e5;

function checkPetDeath() {
  const g = state.game;
  const item = shopItem(g.equipped.pet);
  if (!item) return;
  const idle = idleDays();
  if (idle < PET_DIES_DAYS) return;
  const rec = { kind: item.sprite, name: item.name, died: Date.now(), idleDays: Math.floor(idle) };
  g.owned = g.owned.filter((id) => id !== item.id);
  g.equipped.pet = null;
  delete g.care[item.sprite];
  g.graveyard.push(rec);
  g.memorial = rec;
  applyLooks();
  save();
  if (state.view === 'part') renderPage();
}

function renderMemorial(page) {
  const m = state.game.memorial;
  if (!m) return;
  const card = node('section', 'card memorial');
  const pic = node('div', 'memorial-pic');
  pic.innerHTML = tombSVG(56);
  const text = node('div', 'memorial-text');
  text.append(node('b', null, `${m.name} died.`));
  text.append(node('p', null, `You hadn’t answered a question in ${m.idleDays} days, and your ${m.name.toLowerCase()} couldn’t wait any longer. Pets get sick after ${PET_SICK_DAYS} days alone and die after ${PET_DIES_DAYS}.`));
  const row = node('div', 'row');
  const shop = node('button', 'btn primary', 'Adopt a new pet');
  shop.onclick = () => {
    state.game.memorial = null;
    save();
    showShop();
  };
  const ok = node('button', 'btn ghost', 'Dismiss');
  ok.onclick = () => {
    state.game.memorial = null;
    save();
    renderPage();
  };
  row.append(shop, ok);
  text.append(row);
  card.append(pic, text);
  page.append(card);
}

// ---------- activity ----------

const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// Any answer or revealed step counts as studying; it keeps pets alive (see “neglect”).
function markActive() {
  state.game.lastStudy = Date.now();
  pet?.refresh?.();
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

const pet = createPet(document.getElementById('main'), PET_CARE);

function applyLooks() {
  document.documentElement.dataset.accent = state.game.equipped.accent.replace('accent-', '');
  pet.set(state.prefs.showPet === false ? null : (shopItem(state.game.equipped.pet)?.sprite ?? null));
}

function celebrate(button, kind = state.game.equipped.burst, force = false) {
  if (!kind || (state.prefs.effects === false && !force)) return;
  const r = button.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  if (kind === 'burst-sparks') fx.sparks(x, y);
  else fx.confetti(x, y);
}

function finishEffect(kind = state.game.equipped.finish, force = false) {
  if (state.prefs.effects === false && !force) return;
  if (kind === 'finish-coins') fx.coinShower();
  else if (kind === 'finish-fireworks') fx.fireworks();
}

// Lets the shop show an effect before you buy it.
function previewEffect(item, button) {
  if (item.slot === 'burst') celebrate(button, item.id, true);
  if (item.slot === 'finish') finishEffect(item.id, true);
}

function buyOrEquip(item) {
  const g = state.game;
  if (item.slot === 'food') {
    if (g.coins < item.price) return;
    g.coins -= item.price;
    g.food[item.food] = (g.food[item.food] ?? 0) + 1;
    toast(`−${item.price}`, `Bought a ${item.name.toLowerCase()}`);
    save();
    renderToolbar();
    renderShop();
    return;
  }
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
  bal.append(node('span', 'coin big'), node('b', null, String(g.coins)), node('span', null, `coins · ${g.earned} earned all time · best run ${g.best} in a row`));
  page.append(bal);


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
      if (item.food) preview.innerHTML = foodSVG(item.food, 40);
      card.append(preview);
      card.append(node('div', 'shop-name', item.name));
      if (item.desc) card.append(node('div', 'shop-desc', item.desc));
      const btn = node('button', 'btn');
      if (item.slot === 'food') {
        card.append(node('div', 'shop-have', `You have ${g.food[item.food] ?? 0}`));
        btn.classList.add('primary');
        btn.append(node('span', 'coin'), document.createTextNode(` ${item.price}`));
        btn.disabled = g.coins < item.price;
        if (btn.disabled) btn.title = `You need ${item.price - g.coins} more coins`;
      } else if (!owns(item.id)) {
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
    if (state.view === 'test' && testActive()) {
      state.ink[testInkKey(question(), part())] = strokes;
      save();
      renderSidebar();
      return;
    }
    if (state.view !== 'part') return;
    state.ink[slotKey(state.questionNumber, state.partId)] = strokes;
    save();
  }
});
window.__ink = (action) => ink.pencil(action);
setInterval(checkPetDeath, 60000);

function renderAll() {
  renderSidebar();
  renderToolbar();
  renderPage();
  renderSolution();
  ink.load(state.view === 'part' ? state.ink[slotKey(state.questionNumber, state.partId)] : state.view === 'test' && testActive() ? state.ink[testInkKey(question(), part())] : []);
  paper?.position(`${exam.id}-${question().number}-${part().id}`, `${exam.term} · Question ${question().number} ${partLabel(part())}`);
  el('scroll').scrollTop = 0;
}

el('prev-btn').onclick = () => step(-1);
el('next-btn').onclick = () => step(1);
el('all-btn').onclick = revealAll;
el('reset-btn').onclick = resetPart;
el('shop-btn').onclick = showShop;
el('coin-btn').onclick = showShop;
el('solution-btn').onclick = () => toggleSolution();
el('hints-btn').onclick = toggleHints;
el('side-btn').onclick = toggleSidebar;
el('test-btn').onclick = showTest;
el('settings-btn').onclick = showSettings;
el('more-btn').onclick = () => toggleMoreMenu();
document.addEventListener('pointerdown', (e) => {
  if (!el('more-menu').hidden && !e.target.closest('#more-menu, #more-btn')) toggleMoreMenu(false);
});
new ResizeObserver(() => fitToolbar()).observe(el('toolbar'));
el('test-submit').onclick = () => {
  if (state.view !== 'test') {
    state.view = 'test';
    renderAll();
  }
  askSubmit();
};
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
  if (cmd === 'solution') toggleSolution();
  if (cmd === 'shop') showShop();
  if (cmd === 'ink') el('ink-btn').click();
  if (cmd === 'hints') toggleHints();
  if (cmd === 'sidebar') toggleSidebar();
  if (cmd === 'test') showTest();
  if (cmd === 'settings') showSettings();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && state.solutionOpen) toggleSolution(false);
});

// Return inside a textarea should type a newline, not advance the walkthrough.
document.addEventListener('keydown', (e) => {
  if (state.solutionOpen) return;
  if (e.key !== 'Enter' || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
  if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLElement && e.target.tagName === 'SUMMARY') return;
  e.preventDefault();
  if (e.shiftKey) revealAll();
  else if (state.view === 'part' && state.prefs.noHints && !state.walk.has(slotKey(state.questionNumber, state.partId))) openKey();
  else revealNext();
});

window.study.readProgress().then((saved) => {
  const { _last, _game, _ink, _prefs, _test, _tests, ...progress } = saved ?? {};
  state.test = _test ?? null;
  state.tests = _tests ?? {};
  state.ink = _ink ?? {};
  state.prefs = { ...state.prefs, ..._prefs };
  applyPrefs();
  if (state.test && !state.test.submitted) setTimeout(startTestTimer, 0);
  if (_game) state.game = { ...state.game, ..._game, equipped: { ...state.game.equipped, ..._game.equipped } };
  // Older saves never recorded when you last answered: start the clock now, not at 1970.
  state.game.lastStudy ??= Date.now();
  state.game.graveyard ??= [];
  checkPetDeath();
  applyLooks();
  // Older saves had no exam prefix and only covered Fall 2025.
  state.progress = {};
  for (const [k, v] of Object.entries(progress)) state.progress[k.includes(':') ? k : `fa25-mt1:${k}`] = v;
  // Older saves stored _last as a single { q, p } for Fall 2025.
  state.last = _last && 'q' in _last ? { 'fa25-mt1': _last, _exam: 'fa25-mt1' } : (_last ?? {});
  // A test that was running when the app closed picks up where it left off (its clock kept going).
  if (state.test && !state.test.submitted) state.last._exam = state.test.examId;
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
  if (testActive()) state.view = 'test';
  renderAll();
});
