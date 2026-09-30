// Typesets the math in content text with KaTeX.
//
// The content is written as HTML with <sup>/<sub> and Unicode math (Θ, ≤, √, …). mathify finds
// the math inside that text and swaps each stretch for KaTeX, so it reads like LaTeX while the
// prose around it is left alone. A stretch starts at something that's clearly math (a
// superscript, an operator between two operands, f(n), Θ(…), √, ∞, …) and grows over
// neighboring math tokens: numbers, single-letter variables, log/max/…, operators, and
// balanced brackets. Anything that reads like English (a word of two or more letters that
// isn't a math word) stops it.

import katex from './vendor/katex/katex.mjs';

const MATH_WORDS = new Set(['log', 'ln', 'lg', 'lim', 'max', 'min', 'sin', 'cos', 'tan', 'exp', 'mod', 'gcd', 'deg', 'sup', 'inf', 'Pr', 'polylog', 'argmax', 'argmin', 'poly']);
const GREEK = {
  α: '\\alpha', β: '\\beta', γ: '\\gamma', δ: '\\delta', ε: '\\varepsilon', ζ: '\\zeta', η: '\\eta', θ: '\\theta', ι: '\\iota', κ: '\\kappa',
  λ: '\\lambda', μ: '\\mu', ν: '\\nu', ξ: '\\xi', π: '\\pi', ρ: '\\rho', σ: '\\sigma', τ: '\\tau', υ: '\\upsilon', φ: '\\varphi', ϕ: '\\phi',
  χ: '\\chi', ψ: '\\psi', ω: '\\omega', Γ: '\\Gamma', Δ: '\\Delta', Θ: '\\Theta', Λ: '\\Lambda', Ξ: '\\Xi', Π: '\\Pi', Σ: '\\Sigma',
  Φ: '\\Phi', Ψ: '\\Psi', Ω: '\\Omega', ℓ: '\\ell'
};
// Operators: binary/relational symbols that join operands.
const OPS = {
  '+': '+', '−': '-', '-': '-', '=': '=', '<': '<', '>': '>', '/': '/', '*': '*', '·': '\\cdot ', '×': '\\times ', '≤': '\\le ', '≥': '\\ge ',
  '≠': '\\ne ', '≈': '\\approx ', '→': '\\to ', '←': '\\leftarrow ', '↔': '\\leftrightarrow ', '⇒': '\\Rightarrow ', '⟹': '\\implies ',
  '⇝': '\\rightsquigarrow ', '∈': '\\in ', '∉': '\\notin ', '∪': '\\cup ', '∩': '\\cap ', '⊆': '\\subseteq ', '⊂': '\\subset ', '≡': '\\equiv ',
  '±': '\\pm ', '∨': '\\lor ', '∧': '\\land ', '⊕': '\\oplus ', '^': '^', '≪': '\\ll ', '≫': '\\gg ', '∼': '\\sim ', '~': '\\sim ', '∣': '\\mid '
};
// Symbols that are math on their own (they seed a stretch).
const SYMS = { '∞': '\\infty ', '√': '\\sqrt', '∑': '\\sum', '∏': '\\prod', '∅': '\\emptyset ', '¬': '\\neg ', '⌊': '\\lfloor ', '⌋': '\\rfloor ', '⌈': '\\lceil ', '⌉': '\\rceil ', '…': '\\ldots ', '⋯': '\\cdots ', '′': "'", '∂': '\\partial ' };
const OPEN = { '(': ')', '[': ']', '{': '}', '|': '|' };
const SUPCHARS = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', 'ⁿ': 'n', 'ⁱ': 'i', 'ᵏ': 'k', '⁺': '+', '⁻': '-', 'ᶜ': 'c', 'ʲ': 'j', 'ᵐ': 'm', 'ᵇ': 'b', 'ᵈ': 'd' };
const SUBCHARS = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', 'ᵢ': 'i', 'ⱼ': 'j', 'ₖ': 'k', 'ₙ': 'n', 'ₘ': 'm', '₊': '+', '₋': '-', 'ₓ': 'x' };

const SKIP_TAGS = new Set(['SVG', 'FIGURE', 'CODE', 'PRE', 'SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'SELECT', 'BUTTON-NO']);
const SKIP_CLASSES = ['pseudo', 'katex', 'no-math', 'fig', 'q-label', 'pitfall-label', 'attempt-label', 'card-label', 'lab'];

const cache = new Map();
function render(latex) {
  let html = cache.get(latex);
  if (html === undefined) {
    try {
      html = katex.renderToString(latex, { throwOnError: true, output: 'html', strict: 'ignore' });
    } catch {
      html = null; // leave the original text if KaTeX can't read it
    }
    cache.set(latex, html);
  }
  return html;
}

// ---------- tokens ----------
// { k: 'num'|'word'|'space'|'op'|'sym'|'open'|'close'|'script'|'supc'|'subc'|'punct'|'barrier', t: text, node?, latex? }

function tokenizeText(text) {
  const out = [];
  const re = /(\d+(?:\.\d+)?)|([A-Za-zα-ωΑ-Ωϕℓ]+)|(\s+)|([\u0304\u0305])|(.)/gsu;
  let m;
  while ((m = re.exec(text))) {
    const [t, num, word, space, bar, ch] = m;
    if (bar) {
      // x̄: a combining bar over the letter before it
      const prev = out[out.length - 1];
      if (prev?.k === 'word') {
        if (prev.t.length > 1) {
          out.pop();
          for (const c of prev.t.slice(0, -1)) out.push({ k: 'word', t: c });
          out.push({ k: 'word', t: prev.t.slice(-1) });
        }
        out[out.length - 1].bar = true;
      }
      continue;
    }
    if (num) out.push({ k: 'num', t });
    else if (word) {
      // Greek letters are single symbols even when written next to each other.
      if (/[α-ωΑ-Ωϕℓ]/u.test(word) && word.length > 1) for (const c of word) out.push({ k: 'word', t: c });
      else out.push({ k: 'word', t });
    } else if (space) out.push({ k: 'space', t });
    else if (ch in OPS) out.push({ k: 'op', t });
    else if (ch in SYMS) out.push({ k: 'sym', t });
    else if (ch === '(' || ch === '[' || ch === '{') out.push({ k: 'open', t });
    else if (ch === ')' || ch === ']' || ch === '}') out.push({ k: 'close', t });
    else if (ch === '|') out.push({ k: 'bar', t });
    else if (ch in SUPCHARS) out.push({ k: 'supc', t });
    else if (ch in SUBCHARS) out.push({ k: 'subc', t });
    else out.push({ k: 'punct', t });
  }
  return splitGlued(out);
}

// "anᵇ", "xy²": a short word written right against a superscript is a product of variables.
function splitGlued(toks) {
  const out = [];
  for (let i = 0; i < toks.length; i++) {
    const tk = toks[i];
    const nx = toks[i + 1];
    if (tk.k === 'word' && tk.t.length > 1 && tk.t.length <= 3 && !MATH_WORDS.has(tk.t) && /^[a-z]+$/.test(tk.t) && nx && (nx.k === 'supc' || nx.k === 'subc' || nx.k === 'script')) {
      for (const c of tk.t) out.push({ k: 'word', t: c });
    } else out.push(tk);
  }
  return out;
}

const isVar = (w) => w.length === 1 || MATH_WORDS.has(w) || w in GREEK;
// A token that can be part of an expression.
const isExpr = (tok) =>
  tok && (tok.k === 'num' || tok.k === 'op' || tok.k === 'sym' || tok.k === 'open' || tok.k === 'close' || tok.k === 'bar' || tok.k === 'script' || tok.k === 'supc' || tok.k === 'subc' || (tok.k === 'word' && isVar(tok.t)) || (tok.k === 'punct' && tok.t === ',' && tok.inGroup));
const isOperand = (tok) => tok && (tok.k === 'num' || (tok.k === 'word' && isVar(tok.t)) || tok.k === 'close' || tok.k === 'script' || tok.k === 'supc' || tok.k === 'subc' || tok.k === 'sym');

// ---------- find stretches of math ----------

function findRuns(toks) {
  const n = toks.length;
  const next = (i, dir) => {
    let j = i + dir;
    while (j >= 0 && j < n && toks[j].k === 'space') j += dir;
    return j >= 0 && j < n ? j : -1;
  };

  // Bracket groups: a group is math if everything inside is math-like.
  const partner = new Array(n).fill(-1);
  const stack = [];
  for (let i = 0; i < n; i++) {
    if (toks[i].k === 'open') stack.push(i);
    else if (toks[i].k === 'close' && stack.length) {
      const o = stack.pop();
      partner[o] = i;
      partner[i] = o;
    }
  }
  const groupIsMath = (o) => {
    const c = partner[o];
    if (c < 0) return false;
    for (let i = o + 1; i < c; i++) {
      const tk = toks[i];
      if (tk.k === 'space' || tk.k === 'barrier') {
        if (tk.k === 'barrier') return false;
        continue;
      }
      if (tk.k === 'punct' && tk.t === ',') continue;
      if (tk.k === 'word' && !isVar(tk.t)) return false;
      if (tk.k === 'punct') return false;
    }
    return true;
  };
  for (let i = 0; i < n; i++) if (toks[i].k === 'open') toks[i].math = groupIsMath(i);
  for (let i = 0; i < n; i++) if (toks[i].k === 'close') toks[i].math = partner[i] >= 0 && toks[partner[i]].math;
  // commas inside math groups are part of the math
  for (let i = 0; i < n; i++) {
    if (toks[i].k === 'open' && toks[i].math) for (let j = i + 1; j < partner[i]; j++) if (toks[j].k === 'punct' && toks[j].t === ',') toks[j].inGroup = true;
  }

  // Seeds: things that are unmistakably math.
  const seed = new Array(n).fill(false);
  for (let i = 0; i < n; i++) {
    const tk = toks[i];
    if (tk.k === 'script' || tk.k === 'supc' || tk.k === 'subc') {
      // a superscript needs something to sit on (x², (n+1)², log₂), except x̄-style overlines
      const b = toks[i - 1];
      if (tk.overline || (b && (b.k === 'word' || b.k === 'num' || b.k === 'close' || b.k === 'script' || b.k === 'supc' || b.k === 'subc' || b.k === 'bar' || b.k === 'open'))) seed[i] = true;
    }
    else if (tk.k === 'sym' && tk.t !== '…' && tk.t !== '⋯' && tk.t !== '′') seed[i] = true;
    else if (tk.k === 'op') {
      const a = next(i, -1);
      const b = next(i, 1);
      const tight = a === i - 1 && b === i + 1;
      if (tk.t === '-' && !tight) continue; // a spaced hyphen is prose punctuation
      if (tk.t === '·' && !tight && !(a >= 0 && b >= 0 && (toks[a].k === 'num' || (toks[a].k === 'word' && isVar(toks[a].t)) || toks[a].k === 'script') && (toks[b].k === 'num' || (toks[b].k === 'word' && isVar(toks[b].t)) || toks[b].k === 'open'))) continue;
      if (a >= 0 && b >= 0 && isOperand(toks[a]) && (isOperand(toks[b]) || toks[b].k === 'open' || toks[b].k === 'bar' || toks[b].k === 'op')) {
        // a − b, x = 5, f = O(g), n → ∞ … but not "and/or" (words aren't operands)
        if (toks[a].k === 'close' && !toks[a].math) continue;
        seed[i] = true;
      }
    } else if (tk.k === 'word' && isVar(tk.t) && toks[i + 1]?.k === 'open' && toks[i + 1].math && (tk.t.length === 1 || MATH_WORDS.has(tk.t) || tk.t in GREEK)) {
      // f(n), T(n/2), O(n log n), Θ(n), log(n)
      seed[i] = true;
    } else if (tk.k === 'word' && tk.t in GREEK) seed[i] = true;
    else if (tk.k === 'word' && MATH_WORDS.has(tk.t) && tk.t !== 'poly' && tk.t !== 'sup' && tk.t !== 'inf') {
      // "log n", "max(a, b)", "lim f": a math word applied to something
      const b = next(i, 1);
      if (b >= 0 && (toks[b].k === 'num' || (toks[b].k === 'word' && isVar(toks[b].t)) || (toks[b].k === 'open' && toks[b].math) || toks[b].k === 'script')) seed[i] = true;
    }
  }

  // Grow each seed over neighboring math tokens.
  const inRun = new Array(n).fill(false);
  const canJoinAcrossSpace = (l, r) => {
    const L = toks[l];
    const R = toks[r];
    if (!isExpr(L) || !isExpr(R)) return false;
    if (L.k === 'op' || R.k === 'op' || L.k === 'sym' || R.k === 'sym') return true;
    if ((L.k === 'word' && MATH_WORDS.has(L.t)) || (R.k === 'word' && MATH_WORDS.has(R.t))) return true;
    if (L.k === 'open' || R.k === 'close') return true; // inside brackets
    // lim_{n→∞} f(n), Σ_{i} x_i: a subscripted operator applies to what follows
    if (L.k === 'script' && l > 0 && toks[l - 1].k === 'word' && (MATH_WORDS.has(toks[l - 1].t) || toks[l - 1].t === 'Σ' || toks[l - 1].t === 'Π')) return true;
    return false;
  };
  for (let s = 0; s < n; s++) {
    if (!seed[s] || inRun[s]) continue;
    let lo = s;
    let hi = s;
    let grew = true;
    while (grew) {
      grew = false;
      // left
      if (lo > 0) {
        const p = lo - 1;
        if (toks[p].k !== 'space' && isExpr(toks[p]) && !(toks[p].k === 'open' && !toks[p].math) && !(toks[p].k === 'close' && !toks[p].math)) {
          lo = p;
          grew = true;
        } else if (toks[p].k === 'space') {
          const q = next(lo, -1);
          if (q >= 0 && canJoinAcrossSpace(q, lo) && !(toks[q].k === 'close' && !toks[q].math)) {
            lo = q;
            grew = true;
          }
        }
      }
      // right
      if (hi < n - 1) {
        const p = hi + 1;
        if (toks[p].k !== 'space' && isExpr(toks[p]) && !(toks[p].k === 'open' && !toks[p].math) && !(toks[p].k === 'close' && !toks[p].math)) {
          hi = p;
          grew = true;
        } else if (toks[p].k === 'space') {
          const q = next(hi, 1);
          if (q >= 0 && canJoinAcrossSpace(hi, q) && !(toks[q].k === 'open' && !toks[q].math)) {
            hi = q;
            grew = true;
          }
        }
      }
      // keep brackets balanced: pull in the partner of any bracket at the edge
      for (let i = lo; i <= hi; i++) {
        if ((toks[i].k === 'open' || toks[i].k === 'close') && partner[i] >= 0) {
          if (partner[i] < lo) {
            lo = partner[i];
            grew = true;
          }
          if (partner[i] > hi) {
            hi = partner[i];
            grew = true;
          }
        }
      }
    }
    // Trim things that shouldn't start or end a stretch.
    const bad = (tk, end) => tk.k === 'space' || (tk.k === 'op' && tk.t !== '−' && tk.t !== '-' && !end) || (tk.k === 'op' && end) || (tk.k === 'punct' && tk.t === ',');
    while (lo < hi && (toks[lo].k === 'space' || (toks[lo].k === 'op' && toks[lo].t !== '−') || (toks[lo].k === 'punct'))) lo++;
    while (hi > lo && (bad(toks[hi], true))) hi--;
    // unbalanced brackets at the ends: drop them
    while (lo <= hi && (toks[lo].k === 'close' || (toks[lo].k === 'open' && (partner[lo] < 0 || partner[lo] > hi)))) lo++;
    while (hi >= lo && (toks[hi].k === 'open' || (toks[hi].k === 'close' && (partner[hi] < 0 || partner[hi] < lo)))) hi--;
    if (hi < lo) continue;
    // A lone single letter or number isn't worth typesetting; neither is a date like 9/24/2026.
    const meaningful = toks.slice(lo, hi + 1).filter((tk) => tk.k !== 'space');
    if (meaningful.every((tk) => tk.k === 'num' || tk.t === '/') && meaningful.filter((tk) => tk.t === '/').length >= 1 && (meaningful.filter((tk) => tk.t === '/').length >= 2 || meaningful.some((tk) => tk.t.length === 4))) continue;
    if (meaningful.length === 1 && (meaningful[0].k === 'num' || meaningful[0].k === 'word')) continue;
    for (let i = lo; i <= hi; i++) inRun[i] = true;
  }

  // Collect contiguous runs.
  const runs = [];
  for (let i = 0; i < n; i++) {
    if (!inRun[i]) continue;
    let j = i;
    while (j + 1 < n && inRun[j + 1]) j++;
    runs.push([i, j]);
    i = j;
  }
  return runs;
}

// ---------- LaTeX ----------

function toLatex(toks) {
  // bracket partners within this slice (√( … ) takes the whole group)
  const partner = [];
  const st = [];
  toks.forEach((t, i) => {
    if (t.k === 'open') st.push(i);
    if (t.k === 'close' && st.length) partner[st.pop()] = i;
  });
  let out = '';
  for (let i = 0; i < toks.length; i++) {
    const tk = toks[i];
    switch (tk.k) {
      case 'num':
        out += tk.t;
        break;
      case 'word':
        if (tk.bar) out += `\\bar{${tk.t in GREEK ? GREEK[tk.t] : tk.t}}`;
        else if ((tk.t === 'Σ' || tk.t === 'Π') && (toks[i + 1]?.k === 'script' || toks[i + 1]?.k === 'subc')) out += tk.t === 'Σ' ? '\\sum' : '\\prod';
        else if (tk.t in GREEK) out += GREEK[tk.t] + ' ';
        else if (MATH_WORDS.has(tk.t)) out += (tk.t === 'Pr' ? '\\Pr' : ['poly', 'polylog', 'argmax', 'argmin', 'deg'].includes(tk.t) ? `\\operatorname{${tk.t}}` : '\\' + tk.t) + ' ';
        else if (tk.t.length === 1) out += tk.t;
        else {
          // a run of ordinary words ("valid pairing") becomes one \text{…}
          let words = tk.t;
          while (toks[i + 1]?.k === 'space' && toks[i + 2]?.k === 'word' && !isVar(toks[i + 2].t)) {
            words += ' ' + toks[i + 2].t;
            i += 2;
          }
          out += `\\text{${words}}`;
        }
        break;
      case 'space':
        out += ' ';
        break;
      case 'op':
        out += OPS[tk.t];
        break;
      case 'sym':
        if (tk.t === '√') {
          // √x, √(…), √n: the next operand goes under the root
          let j = i + 1;
          while (toks[j]?.k === 'space') j++;
          const nx = toks[j];
          if (nx?.k === 'open' && partner[j] !== undefined) {
            out += `\\sqrt{${toLatex(toks.slice(j + 1, partner[j]))}}`;
            i = partner[j];
          } else if (nx && (nx.k === 'word' || nx.k === 'num')) {
            out += `\\sqrt{${toLatex([nx])}}`;
            i = j;
          } else out += '\\surd ';
        } else out += SYMS[tk.t];
        break;
      case 'open':
        out += tk.t === '{' ? '\\{' : tk.t;
        break;
      case 'close':
        out += tk.t === '}' ? '\\}' : tk.t;
        break;
      case 'bar':
        out += '|';
        break;
      case 'script':
        out += tk.latex;
        break;
      case 'supc': {
        let s = '';
        while (toks[i]?.k === 'supc') s += SUPCHARS[toks[i++].t];
        i--;
        out += `^{${s}}`;
        break;
      }
      case 'subc': {
        let s = '';
        while (toks[i]?.k === 'subc') s += SUBCHARS[toks[i++].t];
        i--;
        out += `_{${s}}`;
        break;
      }
      case 'punct':
        out += tk.t === ',' ? ',\\,' : tk.t === '%' ? '\\%' : tk.t === '#' ? '\\#' : tk.t === '&' ? '\\&' : tk.t === '_' ? '\\_' : tk.t === '$' ? '\\$' : tk.t === '\\' ? '\\backslash ' : tk.t;
        break;
      default:
        break;
    }
  }
  return out;
}

// LaTeX for the inside of a <sup>/<sub> (text, nested scripts, overlines).
function scriptLatex(node) {
  const toks = [];
  for (const c of node.childNodes) {
    if (c.nodeType === 3) toks.push(...tokenizeText(c.data));
    else if (c.nodeType === 1 && (c.tagName === 'SUP' || c.tagName === 'SUB')) toks.push({ k: 'script', latex: (c.tagName === 'SUP' ? '^{' : '_{') + scriptLatex(c) + '}' });
    else if (c.nodeType === 1) toks.push(...tokenizeText(c.textContent));
  }
  // Words inside scripts ("even", "odd") read as text; math words stay math.
  return toLatex(toks).trim();
}

// ---------- DOM ----------

const skip = (el) => SKIP_TAGS.has(el.tagName) || SKIP_CLASSES.some((c) => el.classList?.contains(c));

function processChildren(el) {
  const toks = [];
  for (const c of el.childNodes) {
    if (c.nodeType === 3) {
      for (const tk of tokenizeText(c.data)) toks.push(tk);
    } else if (c.nodeType === 1 && (c.tagName === 'SUP' || c.tagName === 'SUB') && !c.querySelector('svg, img, span.katex')) {
      toks.push({ k: 'script', node: c, latex: (c.tagName === 'SUP' ? '^{' : '_{') + scriptLatex(c) + '}' });
    } else if (c.nodeType === 1 && c.tagName === 'SPAN' && /overline/.test(c.getAttribute('style') ?? '') && !c.children.length) {
      // x̄ written as an overlined span
      toks.push({ k: 'script', node: c, latex: `\\overline{${toLatex(tokenizeText(c.textContent))}}`, overline: true });
    } else {
      toks.push({ k: 'barrier', node: c });
    }
  }
  if (!toks.some((t) => t.k === 'script' || t.k === 'op' || t.k === 'sym' || t.k === 'supc' || t.k === 'subc' || t.k === 'open')) return false;
  toks.splice(0, toks.length, ...splitGlued(toks));
  // An overlined variable on its own is an operand.
  for (const t of toks) if (t.overline) t.k = 'script';

  const runs = findRuns(toks);
  if (!runs.length) return false;

  // Rebuild the children: text for plain tokens, KaTeX for runs, original nodes for the rest.
  const frag = document.createDocumentFragment();
  let text = '';
  const flush = () => {
    if (text) frag.append(document.createTextNode(text));
    text = '';
  };
  let r = 0;
  for (let i = 0; i < toks.length; i++) {
    if (r < runs.length && i === runs[r][0]) {
      const [a, b] = runs[r];
      const latex = toLatex(toks.slice(a, b + 1)).trim();
      const html = render(latex);
      if (html) {
        flush();
        const span = document.createElement('span');
        span.className = 'tex';
        span.innerHTML = html;
        frag.append(span);
        i = b;
        r++;
        continue;
      }
      r++;
    }
    const tk = toks[i];
    if (tk.node) {
      flush();
      frag.append(tk.node);
    } else text += tk.t;
  }
  flush();
  el.replaceChildren(frag);
  return true;
}

export function mathify(root) {
  if (!root || root.nodeType !== 1 || skip(root)) return;
  processChildren(root);
  for (const c of [...root.children]) {
    if (c.tagName === 'SUP' || c.tagName === 'SUB' || c.classList.contains('tex')) continue;
    mathify(c);
  }
}

// For HTML strings (the PDF export).
export function mathifyHTML(html) {
  const t = document.createElement('template');
  t.innerHTML = html;
  const wrap = document.createElement('div');
  wrap.append(t.content);
  mathify(wrap);
  return wrap.innerHTML;
}

// For checking the converter: the LaTeX it would produce for an HTML string.
export function mathRuns(html) {
  const t = document.createElement('template');
  t.innerHTML = html;
  const found = [];
  const visit = (el) => {
    if (skip(el)) return;
    const toks = [];
    for (const c of el.childNodes) {
      if (c.nodeType === 3) toks.push(...tokenizeText(c.data));
      else if (c.nodeType === 1 && (c.tagName === 'SUP' || c.tagName === 'SUB')) toks.push({ k: 'script', latex: (c.tagName === 'SUP' ? '^{' : '_{') + scriptLatex(c) + '}' });
      else toks.push({ k: 'barrier', node: c });
    }
    for (const [a, b] of findRuns(toks)) {
      const latex = toLatex(toks.slice(a, b + 1)).trim();
      found.push({ src: toks.slice(a, b + 1).map((x) => x.t ?? x.latex).join(''), latex, ok: render(latex) !== null });
    }
    for (const c of el.children ?? []) if (c.tagName !== 'SUP' && c.tagName !== 'SUB') visit(c);
  };
  const root = document.createElement('div');
  root.append(t.content);
  visit(root);
  return found;
}
