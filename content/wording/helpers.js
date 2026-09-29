// Shared bits for the wording files.
export const diagram = (file, alt) =>
  `<figure class="exam-diagram"><img src="../content/diagrams/extra/${file}" alt="${alt}"><figcaption>Original problem diagram</figcaption></figure>`;
export const math = (html) => `<span class="math">${html}</span>`;
export const blank = '<span class="blank"></span>';
// A 2x2 block matrix, rows given as arrays of HTML cells.
export const matrix = (rows) =>
  `<table class="matrix">${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
// A table like the exam's (answer blanks left empty).
export const grid = (head, rows) =>
  `<table class="data"><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
// Pseudocode, one line per array entry; leading spaces become indentation.
export const code = (lines) =>
  `<div class="pseudo">${lines.map((l) => { const pad = l.match(/^ */)[0].length; return `<div style="padding-left:${pad * 0.6}em">${l.trim()}</div>`; }).join('')}</div>`;
