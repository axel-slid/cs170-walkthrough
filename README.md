# CS 170 Walkthrough

An Electron study app that walks through every question on past CS 170 midterms, one small step at a time, with a diagram wherever a picture helps. Pick
the document from the menu at the top of the sidebar (grouped by kind):

- Spring 2026 Midterm 1, 5 questions (including the bonus)
- Fall and Spring 2025 Midterm 1, 8 and 10 questions (the original walkthroughs)
- Fall and Spring 2024 Midterm 1, 11 questions each
- Fall and Spring 2023 Midterm 1, 12 questions each
- Fall and Spring 2022 Midterm 1, 10 and 12 questions
- Fall and Spring 2021 Midterm 1, 4 questions each
- Fall and Spring 2020 Midterm 1, 4 and 8 questions

In total: 13 exams, 308 study parts and 521 guided steps. Some numbered short-answer
subquestions are grouped into one study part when they share a derivation.

Studying:

- Each part shows the full question, then small steps: a prompt to think about, then the answer
  in plain words, with a diagram where it helps. Multiple-choice steps grade themselves.
- Short-answer parts have an answer box; typed answers are checked loosely against the key
  (spacing, case, n² vs n^2, an optional O(…) wrapper), or you mark yourself right or wrong.
- No-hints mode (the lightbulb) hides Hint lines and the steps, so you answer first and then check.
- Staff solution opens the official key's pages; the cheat sheet collects the takeaways.
- Ink: write directly on the page with the Apple Pencil (or the Ink palette with a mouse).
  Strokes are anchored to the card they start on, so they stay put when steps are revealed.
  On iPad there is also a Paper panel for scratch work, one sheet per part.

Test mode (the stopwatch): a timed run through a whole exam or worksheet with no hints, steps,
keys or cheat sheet. Answers can be picked, typed or handwritten. On submit, Download PDF builds
a PDF with grading instructions for an AI, every question, the student's answers (handwriting as
images) and an appendix with the answer key and step-by-step reasoning. Give it to ChatGPT or
Claude and say "grade this". The PDF is printed by Electron (`printToPDF`) on the Mac and by
`UIPrintPageRenderer` on the iPad, which then opens the share sheet.

Extras: coins for correct answers and a shop (accent colors, celebration effects, pet food,
pixel pets that live in the corner of the page and can be dragged; birds fly back down).
Pets get hungry over about a day and a half and have a hearts bar; tap one to feed it. A daily
streak pays coins for studying on consecutive days. Settings (the gear, or ⌘,) has the theme
(System, Light, Dark), text size, and toggles for the sidebar, celebrations and the pet.

Code: `renderer/app.js` (views, test mode, PDF export, shop, settings), `renderer/ink.js`,
`renderer/pets.js`, `renderer/effects.js`, and the figure builders in `renderer/figures*.js`.
Narrow windows move the least-used toolbar buttons into a "⋯" menu instead of squeezing them.

```
npm start
```

## iPad

The same app runs on iPad as a native app (`ios/`), with everything bundled so it works offline.
Plug in the iPad, unlock it, and run:

```
ios/install-ipad.sh
```

That regenerates the Xcode project (XcodeGen, from `ios/project.yml`), builds, installs, and
launches it. Re-run it after any change to the content or the app. The Swift side is a thin
shell (`ios/Sources`): it serves `renderer/` and `content/` to a web view and saves progress to
the iPad. Progress on the iPad is separate from the Mac's.

On iPad, "Paper" in the toolbar opens Apple Pencil scratch paper for the current part: beside the
page in landscape (the question list hides to make room), below it in portrait. Each part has its
own sheet, saved as you write, and the sheet grows as you reach the bottom. The Pencil writes;
fingers scroll and pinch to zoom. Squeeze (hold) or double-tap the Pencil to erase. The paper's
toolbar has pen/eraser, undo, redo, and ink color. The canvas code is adapted from
`~/cs170-study` (`ios/Sources/Paper.swift`).

## How a question works

Each part opens with the problem, then a ladder of steps. A step asks you one small question.
True/false and multiple-choice steps have buttons: click your answer and it tells you if you were
right. Other steps have a "Show me" button, and you can jot a guess first if you want.

A revealed step shows the answer "in plain words" first, then any diagram, then more detail and
common ways to lose points. When every step is shown you get the answer card, and on the last part
of a question, a short "remember this" list.

The sidebar tracks which parts you've finished. "Cheat sheet" at the bottom puts every answer and
every "remember this" on one page.

Guesses, clicked answers, and reveal position are saved per part (and each exam remembers where
you left off), so closing the app is safe.

| Shortcut | Action |
| --- | --- |
| Return | Show the next step |
| Shift+Return | Show everything for this part |
| Cmd+] / Cmd+[ | Next / previous part |
| Cmd+K | Toggle the answer card |
| Cmd+L | Cheat sheet |
| Cmd+J | Staff solution (the official key's pages for this question) |
| Cmd+Delete | Start this part over |

Return types a newline normally while the cursor is inside a guess box.

## Staff solution

"Staff solution" in the toolbar shows the official answer key's pages for the current question.
The pages are bundled images in `content/keys/`, and each exam lists which pages belong to
which question in `solutionPages`. The original 2025 exams use JPEG; the added archive exams
use WebP. Problem diagrams are separately cropped into `content/diagrams/`, so the question
can show its graph without showing the official answer.

The supplied PDFs are preserved in `sources/`. `scripts/render-archive.py` rebuilds the archive
pages and problem diagrams using PyMuPDF and Pillow. `scripts/render-keys.sh` is the existing
renderer for the original 2025 keys.

## Content

Each exam is one file in `content/` (for example, `fa25-mt1.js` or `sp26-mt1.js`), listed in
`content/index.js`. To add an exam, write a new file with the same shape and add it to that list.
Shape of a question:

```js
{
  number, title, points,
  topics: [],            // chips under the heading
  preamble: [],          // shared setup paragraphs (optional)
  table: { head, rows }, // shared table (optional)
  parts: [{
    id: 'a', name, points,
    ask: '',             // what the question asks
    table, figure,       // optional, shown with the problem
    formal: { input: [], output: '' },
    steps: [{
      title: '',         // shown while still locked, so keep it a topic not a spoiler
      prompt: '',        // the question to answer before revealing
      choices: [], correct: 0,  // optional clickable answers
      simple: '',        // the plain-words answer, shown first
      figure: F.x(),     // optional SVG from renderer/figures.js
      reveal: [],        // optional extra paragraphs
      pitfall: ''        // optional: how people lose points here
    }],
    key: { gist: '', body: [], runtime: '' }
  }],
  takeaway: []
}
```

Text fields may contain inline HTML (`<sup>`, `<sub>`). A part's `key` can also carry a
`table: { head, rows }`, and `points` can be left off when the exam doesn't list them. Diagrams
are plain SVG built by the functions in `renderer/figures.js` (shared primitives and Fall 2025)
and `renderer/figures-sp25.js`. Their colors come from CSS classes, so they follow light and
dark mode.

Two conventions worth keeping: a step's `title` names the move without giving it away, and
`reveal` explains why the move works rather than just asserting it. The solutions are written
from the official key in our own words, not copied from it.

The new exams use the authoring helpers in `content/builders.js`: `S` for a step, `P` for a
part, `T` for true/false, `Q` for a question, and `E` for an exam. The exam helper attaches
problem drawings and official solution-page ranges. Explanations include algorithm, reasoning,
and runtime where requested; relevant key ambiguities and errors are explained in the steps.

Run `npm test` to check all imports, question coverage, progress IDs, answer choices, table
shapes, problem diagrams, and official solution-page files. This check does not read or write
study progress.

Full question wording for the archive exams lives in `content/wording/<id>.js` and is applied
in `content/index.js`; extra problem drawings are cropped from the PDFs by
`scripts/crop-extra.sh`. Key page images come from `scripts/render-keys.sh`.

Sources: all 13 official Midterm 1 keys in
`~/Downloads/drive-download-20260929T021336Z-1-001.zip`, preserved in `sources/`.

## Note

The separate `~/cs170-study` project (native iPad app, PencilKit annotation over exam PDFs) is
unrelated and untouched by this one.
