// Official-key walkthroughs, newest first. Existing exam IDs stay unchanged so progress is retained.
import { exam as sp26 } from './sp26-mt1.js';
import { exam as fa25 } from './fa25-mt1.js';
import { exam as sp25 } from './sp25-mt1.js';
import { exam as fa24 } from './fa24-mt1.js';
import { exam as sp24 } from './sp24-mt1.js';
import { exam as fa23 } from './fa23-mt1.js';
import { exam as sp23 } from './sp23-mt1.js';
import { exam as fa22 } from './fa22-mt1.js';
import { exam as sp22 } from './sp22-mt1.js';
import { exam as fa21 } from './fa21-mt1.js';
import { exam as sp21 } from './sp21-mt1.js';
import { exam as fa20 } from './fa20-mt1.js';
import { exam as sp20 } from './sp20-mt1.js';
import { wording } from './wording/index.js';

// Past midterms keep their original order and IDs.
const midterms = [sp26,fa25,sp25,fa24,sp24,fa23,sp23,fa22,sp22,fa21,sp21,fa20,sp20];
for (const e of midterms) e.group ??= 'Past midterms';
export const exams = [...midterms];

// The archive exams' question text is kept separately (content/wording/<exam>.js) so the
// walkthroughs can stay compact. Each entry is the exam's full wording, which replaces the
// shortened `ask`/`preamble` and can fill in the instructors.
for (const e of exams) {
  const w = wording[e.id];
  if (!w) continue;
  if (w.instructors) e.instructors = w.instructors;
  for (const q of e.questions) {
    const wq = w.questions?.[q.number];
    if (!wq) continue;
    if (wq.preamble) q.preamble = wq.preamble;
    if (wq.figure) q.figure = wq.figure;
    for (const p of q.parts) if (wq.parts?.[p.id]) p.ask = wq.parts[p.id];
  }
}
