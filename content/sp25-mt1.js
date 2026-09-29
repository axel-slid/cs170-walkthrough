// CS 170, Spring 2025, Midterm 1 (N. Haghtalab and J. Wright).
// Source: ~/Downloads/2025 Spring Midterm 1 KEY.pdf
//
// Solutions here are written in our own words, following the official key's
// approach. See fa25-mt1.js for the field reference. The exam doesn't list
// per-part points for every question; parts without them omit `points`.

import * as F from '../renderer/figures.js';
import * as G from '../renderer/figures-sp25.js';

const TF = ['True', 'False'];
const ASN = ['Always', 'Sometimes', 'Never'];
const c = (v) => `<span class="circ">${v}</span>`;

const INF = Infinity;

export const exam = {
  id: 'sp25-mt1',
  course: 'CS 170',
  term: 'Spring 2025',
  title: 'Midterm 1',
  instructors: 'N. Haghtalab and J. Wright',
  source: '~/Downloads/2025 Spring Midterm 1 KEY.pdf',
  // Pages of the official key (rendered by scripts/render-keys.sh) holding each question,
  // shown by the Staff solution button.
  solutionDir: 'keys/sp25-mt1',
  solutionPages: { 1: [2, 4], 2: [5, 5], 3: [6, 8], 4: [9, 11], 5: [12, 13], 6: [14, 16], 7: [17, 18], 8: [19, 20], 9: [21, 24], 10: [25, 27] },
  questions: [
    // ------------------------------------------------------------------ Q1
    {
      number: 1,
      title: 'Asymptotics warmup',
      points: 10,
      topics: ['Big-O', 'logs and exponents', 'recurrences'],
      parts: [
        {
          id: 'a',
          name: 'Which function grows faster?',
          ask: [
            "For each pair of functions f and g, specify whether f = O(g), g = O(f), or both."
          ],
          table: {
            head: ['', 'f', 'g'],
            rows: [
              ['1', 'n<sup>2</sup>', 'log<sub>2</sub>(n<sup>100</sup>)'],
              ['2', '(log<sub>2</sub> n)<sup>n</sup>', 'n<sup>log<sub>2</sub> n</sup>'],
              ['3', '1 + 2x + 3x<sup>2</sup> + 4x<sup>3</sup>', '4 + 3x + 2x<sup>2</sup> + x<sup>3</sup>'],
              ['4', '2<sup>e<sup>log<sub>2</sub> n</sup></sup>', '10<sup>e<sup>log<sub>10</sub> n</sup></sup>'],
              ['5', 'n<sup>10</sup> + 2<sup>n</sup>', 'n<sup>2</sup> + 10<sup>n</sup>']
            ]
          },
          steps: [
            {
              title: 'Know the pecking order',
              prompt: 'Rank from slowest to fastest: log n, n<sup>3</sup>, 2<sup>n</sup>, 10<sup>n</sup>.',
              simple:
                'Logs, then polynomials (bigger power wins), then exponentials (bigger base wins). The table has a few weird ones that sit in between. The picture shows where every function on this exam lands.',
              figure: F.growthLadder(
                [
                  ['log n', 'muted'],
                  ['n^{2}', 'accent'],
                  ['n^{3}', 'accent'],
                  ['n^{10}', 'accent'],
                  ['n^{log n}', 'warn'],
                  ['10^{n⁰·⁴³}', 'warn'],
                  ['2^{n}', 'bad'],
                  ['10^{n}', 'bad'],
                  ['(log n)^{n}', 'bad'],
                  ['2^{n¹·⁴⁴}', 'bad']
                ],
                'Every function on this exam, from slowest to fastest. The two with n⁰·⁴³ and n¹·⁴⁴ in the exponent are row 4, explained below.'
              )
            },
            {
              title: 'Row 1',
              prompt: 'n<sup>2</sup> vs log<sub>2</sub>(n<sup>100</sup>). Hint: pull the 100 out of the log.',
              choices: ['f = O(g)', 'g = O(f)', 'Both'],
              correct: 1,
              simple: 'log(n<sup>100</sup>) = 100 · log n, which is just a log. Logs lose to n<sup>2</sup>. g = O(f) only.'
            },
            {
              title: 'Row 2',
              prompt: '(log n)<sup>n</sup> vs n<sup>log n</sup>. Hint: write both as 2 to a power.',
              choices: ['f = O(g)', 'g = O(f)', 'Both'],
              correct: 1,
              simple:
                'f = 2<sup>n · log log n</sup> and g = 2<sup>(log n)²</sup>. Compare exponents: n · log log n has a whole n in it and beats (log n)<sup>2</sup>. So f is bigger: g = O(f) only.',
              reveal: ['Same pair as the Fall 2025 midterm, just with f and g swapped. Watch which side is which!']
            },
            {
              title: 'Row 3',
              prompt: '1 + 2x + 3x<sup>2</sup> + 4x<sup>3</sup> vs 4 + 3x + 2x<sup>2</sup> + x<sup>3</sup>.',
              choices: ['f = O(g)', 'g = O(f)', 'Both'],
              correct: 2,
              simple: 'Both are degree-3 polynomials, so both are Θ(x<sup>3</sup>). The coefficients (4 vs 1) are just constants. Both.'
            },
            {
              title: 'Row 4',
              prompt:
                '2<sup>e<sup>log₂ n</sup></sup> vs 10<sup>e<sup>log₁₀ n</sup></sup>. Hint: e<sup>log₂ n</sup> = n<sup>log₂ e</sup>. What power of n is that?',
              choices: ['f = O(g)', 'g = O(f)', 'Both'],
              correct: 1,
              simple:
                'e<sup>log₂ n</sup> = n<sup>1.44</sup> and e<sup>log₁₀ n</sup> = n<sup>0.43</sup>. So f = 2<sup>n<sup>1.44</sup></sup> and g = 10<sup>n<sup>0.43</sup></sup>. The exponent n<sup>1.44</sup> crushes n<sup>0.43</sup>, and the bigger base 10 can’t make up for it. g = O(f) only.',
              reveal: [
                'Where 1.44 and 0.43 come from: a<sup>log b</sup> = b<sup>log a</sup>, so e<sup>log₂ n</sup> = n<sup>log₂ e</sup>, and log₂ e ≈ 1.44. Likewise log₁₀ e ≈ 0.43.',
                'Rewriting g in base 2: 10<sup>n<sup>0.43</sup></sup> = 2<sup>3.32 · n<sup>0.43</sup></sup>. The 3.32 is only a constant factor in the exponent, but n<sup>1.44</sup> vs n<sup>0.43</sup> is a different power.'
              ],
              pitfall: 'Don’t let the bigger base (10 vs 2) fool you. When the exponents grow at different rates, the exponent decides.'
            },
            {
              title: 'Row 5',
              prompt: 'n<sup>10</sup> + 2<sup>n</sup> vs n<sup>2</sup> + 10<sup>n</sup>.',
              choices: ['f = O(g)', 'g = O(f)', 'Both'],
              correct: 0,
              simple: 'Only the exponentials matter: f ≈ 2<sup>n</sup>, g ≈ 10<sup>n</sup>. Base 10 wins. f = O(g) only.'
            }
          ],
          key: { gist: 'Row by row: g = O(f), g = O(f), Both, g = O(f), f = O(g).', body: [] }
        },
        {
          id: 'b',
          name: 'T(n) = T(n/2) + 2T(n/4) + Θ(n)',
          ask: [
            "Find, with proof, the asymptotic behavior of the function T(n) satisfying the recurrence relation",
            "<span class=\"math\">T(n) = T(n/2) + 2T(n/4) + Θ(n).</span>",
            "Hint: There are multiple ways to solve the problem. Here is a hint for one of them: define a new function S(n) = T(n) + T(n/2) and substitute. Find the asymptotic value of S(n) and show that S(n) and T(n) have the same asymptotic behavior."
          ],
          steps: [
            {
              title: 'Draw the tree',
              prompt: 'The top level costs n. What do its children cost in total? And the level after that?',
              simple:
                'Children: n/2 + n/4 + n/4 = n. Every level adds up to n again, because each problem splits into pieces whose sizes add back to the whole.',
              figure: F.recTree(
                [
                  { labels: ['n'], cost: 'n' },
                  { labels: ['n/2', 'n/4', 'n/4'], cost: 'n/2 + n/4 + n/4 = n' },
                  { labels: ['n/4', 'n/8', 'n/8', 'n/8', 'n/16', 'n/16', 'n/8', 'n/16', 'n/16'], max: 9, cost: 'still n' }
                ],
                'n per level × about log n levels = n log n'
              )
            },
            {
              title: 'Count the levels',
              prompt: 'The deepest branch keeps halving, and the shallowest keeps quartering. How many full levels are there?',
              choices: ['Θ(n)', 'Θ(n log n)', 'Θ(n<sup>2</sup>)'],
              correct: 1,
              simple:
                'Halving: log<sub>2</sub> n levels at most. Quartering: (log<sub>2</sub> n)/2 levels, all of them full. So the work is between (n/2) log n and n log n. That’s Θ(n log n).'
            },
            {
              title: 'The key’s trick with S(n)',
              prompt: 'Add T(n/2) to both sides of the recurrence. Can you write the result using S(n) = T(n) + T(n/2)?',
              simple:
                'T(n) + T(n/2) = 2T(n/2) + 2T(n/4) + Θ(n) = 2[T(n/2) + T(n/4)] + Θ(n). That’s S(n) = 2S(n/2) + Θ(n), which is mergesort: S(n) = Θ(n log n).',
              reveal: [
                'Then connect S back to T: T(n) ≤ S(n) ≤ 2T(n), because T(n/2) ≤ T(n). So T is squeezed between S/2 and S, and T(n) = Θ(n log n) too.'
              ],
              pitfall: 'The question says “with proof”. Say why T and S have the same growth (the T ≤ S ≤ 2T line). The answer alone isn’t enough.'
            }
          ],
          key: { gist: 'T(n) = Θ(n log n)', body: ['S(n) = T(n) + T(n/2) satisfies S(n) = 2S(n/2) + Θ(n), and T ≤ S ≤ 2T.'] }
        }
      ],
      takeaway: [
        'Write weird functions as 2<sup>something</sup> and compare the somethings.',
        'e<sup>log₂ n</sup> = n<sup>log₂ e</sup>: swapping base and argument turns it into a plain power of n.',
        'If a problem’s pieces add up to the whole (n/2 + n/4 + n/4 = n), every level costs n, and the answer is n × number of levels.'
      ]
    },

    // ------------------------------------------------------------------ Q2
    {
      number: 2,
      title: 'True/False',
      points: 6,
      topics: ['DFS', 'Huffman', 'MSTs', 'shortest paths'],
      preamble: [
        "For each question, fill in True or False. Justification is not required and will not earn partial credit."
      ],
      parts: [
        {
          id: 'a',
          name: 'Smallest post number in a DAG',
          ask: [
            "True or False: The vertex with the smallest post-number in the DFS on a DAG is necessarily a sink vertex."
          ],
          steps: [
            {
              title: 'Who finishes first?',
              prompt: 'If v had an edge v → w, which of v and w would finish first in a DAG?',
              choices: TF,
              correct: 0,
              simple:
                'True. In a DAG, every edge v → w has post[v] > post[w]: DFS can’t finish v until it’s done with w. So a vertex with any outgoing edge can’t be the first to finish. The first one to finish has no outgoing edges, so it’s a sink.',
              figure: G.dagPost()
            }
          ],
          key: { gist: 'True', body: [] }
        },
        {
          id: 'b',
          name: 'Huffman: skewed vs uniform',
          ask: [
            "Consider two data streams, S and S′, each consisting of 170000 characters belonging to the set {A, B, C, D}. The relative character frequencies in each stream are shown below:",
            "<span class=\"math\">S : f<sub>A</sub> = 0.7, f<sub>B</sub> = 0.1, f<sub>C</sub> = 0.1, f<sub>D</sub> = 0.1,<br>S′ : f′<sub>A</sub> = f′<sub>B</sub> = f′<sub>C</sub> = f′<sub>D</sub> = 0.25.</span>",
            "True or False: Using Huffman encodings, it takes fewer bits to encode S compared to S′."
          ],
          steps: [
            {
              title: 'Compare the average code length',
              prompt: 'How many bits per letter does Huffman use for S′? For S?',
              choices: TF,
              correct: 0,
              simple:
                'True. S′: four equal letters, so every code is 2 bits. S: A is so common it gets a 1-bit code. Average = 0.7·1 + 0.1·2 + 0.1·3 + 0.1·3 = 1.5 bits, fewer than 2.',
              reveal: ['Rule of thumb: uniform frequencies are Huffman’s worst case. The more lopsided the frequencies, the more it saves.']
            }
          ],
          key: { gist: 'True', body: [] }
        },
        {
          id: 'c',
          name: 'Raise every weight to the 5th power',
          ask: [
            "Given a weighted graph G, you make a new graph G′ by raising the weight of each edge to the power of 5.",
            "True or False: The set of all minimum spanning trees in G and G′ are the same."
          ],
          steps: [
            {
              title: 'What does Kruskal look at?',
              prompt: 'Does x<sup>5</sup> keep the order of numbers (including negatives)?',
              choices: TF,
              correct: 0,
              simple:
                'True. x<sup>5</sup> is strictly increasing, even for negative numbers, so the sorted order of edges doesn’t change. MSTs only depend on that order.',
              pitfall: 'Squaring would NOT be safe if weights can be negative: (−3)<sup>2</sup> = 9 > 2<sup>2</sup> = 4 flips the order.'
            }
          ],
          key: { gist: 'True', body: [] }
        },
        {
          id: 'd',
          name: 'Lightest edges always in the MST?',
          ask: [
            "True or False: Any minimum spanning tree includes all of the graph’s lightest edges."
          ],
          steps: [
            {
              title: 'Try a triangle',
              prompt: 'What if three lightest edges form a triangle?',
              choices: TF,
              correct: 1,
              simple: 'False. A tree can’t contain a cycle, so an MST can only take two of the three weight-1 edges.',
              figure: G.lightestTriangle(),
              reveal: ['What IS true: if there’s a single unique lightest edge, it’s in every MST.']
            }
          ],
          key: { gist: 'False', body: [] }
        },
        {
          id: 'e',
          name: 'Unique heaviest edge in no MST?',
          ask: [
            "True or False: If a graph has a unique heaviest edge, that edge belongs to no minimum spanning tree of the graph."
          ],
          steps: [
            {
              title: 'What if it’s the only way in?',
              prompt: 'What if the heaviest edge is the only edge connecting some vertex?',
              choices: TF,
              correct: 1,
              simple: 'False. If it’s the only edge that reaches a vertex, every spanning tree has to use it, no matter how heavy it is.',
              figure: G.heaviestBridge(),
              reveal: ['What IS true: the unique heaviest edge on a cycle is in no MST.']
            }
          ],
          key: { gist: 'False', body: [] }
        },
        {
          id: 'f',
          name: 'Shortest paths use the lightest edge?',
          ask: [
            "True or False: In any undirected graph with any given source vertex s, there exists a shortest path from s to some other vertex that includes a minimum weight edge of the graph."
          ],
          steps: [
            {
              title: 'Find a counterexample',
              prompt: 'Try a triangle where the cheap edge is far from s.',
              choices: TF,
              correct: 1,
              simple:
                'False. Triangle with A–B = 5, A–C = 5, B–C = 1, and s = A. The shortest paths are the direct edges. The cheap edge B–C is never on one.',
              figure: G.shortestTriangle(),
              reveal: ['Shortest-path trees and MSTs are different things. An MST would definitely use B–C.']
            }
          ],
          key: { gist: 'False', body: [] }
        }
      ],
      takeaway: [
        'DAG + DFS: every edge goes from higher post to lower post. So the first to finish is a sink, and the last to finish is a source.',
        'Any strictly increasing function of the weights (x<sup>5</sup>, e<sup>x</sup>, x + 7) keeps the same MSTs.',
        'MST facts come with conditions: lightest edges can form a cycle, and a heavy edge can be the only way across a cut.'
      ]
    },

    // ------------------------------------------------------------------ Q3
    {
      number: 3,
      title: 'Short answer',
      points: 18,
      topics: ['components', 'Master theorem', 'QuickSelect', 'HornSAT', 'BFS'],
      preamble: [
        "Write down your answers in the corresponding boxes. Justification is not required and will not earn partial credit."
      ],
      parts: [
        {
          id: 'a',
          name: 'Components with 10 vertices and 10 edges',
          ask: [
            "In a simple graph with 10 vertices and 10 undirected edges (that is, without self-loops and with at most one edge between any pair of vertices), the minimum possible and maximum possible number of connected components are:",
            "Minimum: <span class=\"blank\"></span>, Maximum: <span class=\"blank\"></span>"
          ],
          steps: [
            {
              title: 'Minimum',
              prompt: 'Connecting 10 vertices takes at least how many edges? Do you have enough?',
              simple: 'A tree on 10 vertices has 9 edges, and you have 10. So everything can be one component: minimum = 1.'
            },
            {
              title: 'Maximum',
              prompt: 'To get lots of components, cram all 10 edges into as few vertices as possible. How few?',
              simple:
                'A complete graph on 5 vertices (K<sub>5</sub>) has 5·4/2 = 10 edges, exactly enough. That leaves 5 vertices alone. 1 + 5 = 6 components.',
              figure: G.k5PlusSingles(),
              reveal: ['4 vertices can hold at most 6 edges (not enough), so 5 is the fewest vertices that can hold all 10.']
            }
          ],
          key: { gist: 'Minimum 1, maximum 6', body: [] }
        },
        {
          id: 'b',
          name: 'Five subproblems of size n/3',
          ask: [
            "Inspired by Karatsuba’s algorithm, your friend in CS 170 has found a better divide-and-conquer method for integer multiplication. In her algorithm, she expresses the multiplication of two n-digit integers as the summation of five subproblems, each involving the multiplication of two (n/3)-digit integers.",
            "(i) Write down the recurrence relation for the runtime T(n) of your friend’s algorithm.",
            "(ii) Write down the tightest asymptotic bound on T(n) you can give."
          ],
          steps: [
            {
              title: 'The recurrence',
              prompt: 'How many subproblems, what size, and how much extra work to combine?',
              simple: '5 subproblems of size n/3, plus O(n) for adding things up: T(n) = 5T(n/3) + O(n).'
            },
            {
              title: 'Solve it',
              prompt: 'a = 5, b = 3, d = 1. Is log<sub>3</sub> 5 bigger or smaller than 1?',
              choices: ['O(n log n)', 'O(n<sup>log<sub>3</sub> 5</sup>)', 'O(n<sup>2</sup>)'],
              correct: 1,
              simple:
                'log<sub>3</sub> 5 ≈ 1.46 > 1, so the leaves win: O(n<sup>log₃ 5</sup>) ≈ O(n<sup>1.46</sup>). That beats Karatsuba’s n<sup>1.58</sup>.',
              reveal: ['This is the Toom-Cook algorithm, a real improvement on Karatsuba.']
            }
          ],
          key: { gist: 'T(n) = 5T(n/3) + O(n) = O(n<sup>log<sub>3</sub> 5</sup>)', body: [] }
        },
        {
          id: 'c',
          name: 'QuickSelect for the minimum',
          ask: [
            "Let Select(A, k) denote the randomized QuickSelect algorithm you saw in class that finds the k<sup>th</sup> smallest number in array A. Consider the execution of Select(A, 1) on a list A of size n. Let p denote the number of pivots chosen by the algorithm before it terminates.",
            "(i) In the best case, the value of p (up to constant factors) = <span class=\"blank\"></span>",
            "(ii) In the worst case, the value of p (up to constant factors) = <span class=\"blank\"></span>",
            "(iii) The expected value of p (up to constant factors) = <span class=\"blank\"></span>"
          ],
          steps: [
            {
              title: 'Best case',
              prompt: 'What’s the luckiest possible first pivot?',
              choices: ['1', 'log n', 'n'],
              correct: 0,
              simple: 'The minimum itself. Nothing is smaller, so QuickSelect knows it’s done right away: p = 1.'
            },
            {
              title: 'Worst case',
              prompt: 'What’s the unluckiest pivot each time?',
              choices: ['1', 'log n', 'n'],
              correct: 2,
              simple: 'The largest remaining element. It only knocks out one element each time, so you need about n pivots.'
            },
            {
              title: 'Expected case',
              prompt: 'A random pivot lands somewhere in the middle on average. What happens to the part you keep?',
              choices: ['1', 'log n', 'n'],
              correct: 1,
              simple:
                'You only keep the elements smaller than the pivot, which is about half of them on average. Halving n down to 1 takes about log n pivots.'
            }
          ],
          key: { gist: 'Best 1, worst n, expected log n', body: [] }
        },
        {
          id: 'd',
          name: 'HornSAT: always, sometimes, never',
          ask: [
            "The greedy algorithm on a HornSAT instance returns the following assignment:",
            "<span class=\"math\">x<sub>1</sub> = False, x<sub>2</sub> = True, x<sub>3</sub> = True, x<sub>4</sub> = False, x<sub>5</sub> = True.</span>",
            "For each of the following clauses, indicate whether adding it will make the instance always, sometimes, or never satisfiable. Each sub-part below is independent of the other.",
            "(i) <span class=\"neg\">x</span><sub>3</sub> ∨ <span class=\"neg\">x</span><sub>4</sub>&emsp; (ii) <span class=\"neg\">x</span><sub>3</sub> ∨ <span class=\"neg\">x</span><sub>5</sub>&emsp; (iii) x<sub>3</sub> ⟹ x<sub>1</sub>&emsp; (iv) <span class=\"neg\">x</span><sub>5</sub>",
            "Always / Sometimes / Never"
          ],
          steps: [
            {
              title: 'What greedy tells you',
              prompt: 'Greedy only sets a variable to True when an implication forces it. What does that say about x<sub>2</sub>, x<sub>3</sub>, x<sub>5</sub>?',
              simple:
                'They’re forced. EVERY satisfying assignment has x<sub>2</sub>, x<sub>3</sub>, x<sub>5</sub> true. Meanwhile x<sub>1</sub> and x<sub>4</sub> are false only because nothing forced them, so they could be true in some other solution.'
            },
            {
              title: '(i) x̄₃ ∨ x̄₄',
              prompt: 'Does the greedy assignment already satisfy this clause?',
              choices: ASN,
              correct: 0,
              simple:
                'Always. x<sub>4</sub> is false, so x̄<sub>4</sub> is true and the clause holds. The greedy assignment still satisfies everything, including the new clause.'
            },
            {
              title: '(ii) x̄₃ ∨ x̄₅',
              prompt: 'This clause needs x<sub>3</sub> or x<sub>5</sub> to be false. Can that ever happen?',
              choices: ASN,
              correct: 2,
              simple: 'Never. x<sub>3</sub> and x<sub>5</sub> are forced true in every solution, so this clause can’t be satisfied.'
            },
            {
              title: '(iii) x₃ ⇒ x₁',
              prompt: 'x<sub>3</sub> is forced true, so this forces x<sub>1</sub> true. Could that break some other clause?',
              choices: ASN,
              correct: 1,
              simple:
                'Sometimes. Now x<sub>1</sub> is forced true too. Whether that’s OK depends on the clauses we can’t see. A negative clause like (x̄<sub>1</sub> ∨ x̄<sub>2</sub>) would break it, and otherwise it’s fine.'
            },
            {
              title: '(iv) x̄₅',
              prompt: 'This says x<sub>5</sub> must be false.',
              choices: ASN,
              correct: 2,
              simple: 'Never. x<sub>5</sub> is forced true in every solution.'
            }
          ],
          key: { gist: '(i) Always, (ii) Never, (iii) Sometimes, (iv) Never', body: [] }
        },
        {
          id: 'e',
          name: 'Reading BFS distances',
          ask: [
            "Let G be an unweighted, undirected graph with vertex set {A, B, C, D, E, F}. Suppose we run a Single Source Shortest Path algorithm on the graph G with source vertex A and it computes the following distances:",
            "<span class=\"math\">[A : 0], [B : 1], [C : 1], [D : 2], [E : 3], [F : 2].</span>",
            "Answer the following questions about this graph:",
            "(i) Identify an edge that must exist in G.",
            "(ii) True or False: There cannot be an edge (C, E) in G.",
            "(iii) Identify a smallest set of vertices that is guaranteed to disconnect the graph upon removal."
          ],
          steps: [
            {
              title: 'Lay it out in layers',
              prompt: 'Group vertices by distance. Which layers can an edge connect?',
              simple:
                'Layer 0: A. Layer 1: B, C. Layer 2: D, F. Layer 3: E. An edge can only join the same layer or neighboring layers. If it skipped a layer, the far vertex would have a shorter distance.',
              figure: G.bfsLayers()
            },
            {
              title: '(i) An edge that must exist',
              prompt: 'How did B get distance 1?',
              simple: 'Distance 1 means one step from A. So (A, B) must exist (and so must (A, C)).'
            },
            {
              title: '(ii) Can (C, E) exist?',
              prompt: 'If C–E existed, what would E’s distance be at most?',
              choices: TF,
              correct: 0,
              simple: 'True, it can’t exist. Otherwise E would be at distance at most 1 + 1 = 2, not 3.'
            },
            {
              title: '(iii) Smallest cut',
              prompt: 'Who can E possibly be connected to?',
              simple:
                'Only layer-2 vertices (D, F) or layer-3 ones (none besides E). So removing {D, F} always cuts E off. Also valid: {B, C}, since A can only touch layer 1.'
            }
          ],
          key: { gist: '(i) (A, B) or (A, C). (ii) True. (iii) {D, F} (or {B, C}).', body: [] }
        },
        {
          id: 'f',
          name: 'Shortest paths with weights 1 and 2',
          ask: [
            "Consider a weighted graph G with n vertices and m edges whose edge weights are all either 1 or 2. Then, the single-source shortest paths from a given node can be computed in time O(<span class=\"blank\"></span>). Express your answer in terms of n and m, and provide the tightest bound possible. Briefly justify your answer."
          ],
          steps: [
            {
              title: 'Make every edge weight 1',
              prompt: 'BFS handles weight-1 edges. How can you turn a weight-2 edge into weight-1 edges?',
              simple: 'Put a dummy vertex in the middle of every weight-2 edge. Now all edges have weight 1, so run BFS. At most m extra vertices and edges, so O(n + m).',
              figure: G.subdivide()
            }
          ],
          key: { gist: 'O(n + m): subdivide weight-2 edges, then BFS.', body: [] }
        }
      ],
      takeaway: [
        'Max components with m edges: pack them into the smallest complete graph that fits.',
        'Greedy HornSAT’s true variables are true in EVERY solution. That’s what makes the always/sometimes/never questions easy.',
        'BFS layers: edges only join the same or neighboring layers.',
        'Small integer weights? Subdivide edges and use BFS instead of Dijkstra.'
      ]
    },

    // ------------------------------------------------------------------ Q4
    {
      number: 4,
      title: 'Shortest paths',
      points: 10,
      topics: ['Dijkstra', 'shortest-path tree'],
      preamble: [
        "Consider the following undirected graph."
      ],
      figure: G.q4Graph({}),
      parts: [
        {
          id: 'a',
          name: 'Run Dijkstra by hand',
          ask: [
            "Demonstrate the execution of Dijkstra’s algorithm starting from the source vertex A on the graph above. To do this, fill in the distance array, representing each node’s current distance from node A at the end of each iteration of the algorithm. In each iteration, circle the node that was visited in that step. The first row has been filled out for you."
          ],
          table: { head: ['', 'A', 'B', 'C', 'D', 'E'], rows: [['dist₁', c(0), '2', '5', '∞', '∞'], ['dist₂', '', '', '', '', ''], ['dist₃', '', '', '', '', ''], ['dist₄', '', '', '', '', ''], ['dist₅', '', '', '', '', '']] },
          steps: [
            {
              title: 'Iteration 2',
              prompt: 'Which unvisited node has the smallest distance? Visit it and update its neighbors.',
              simple: 'B (distance 2). Going through B: C = 2 + 2 = 4 (better than 5), and D = 2 + 1 = 3. Row: 0, 2, 4, 3, ∞.',
              figure: G.q4Graph({
                visited: ['A'],
                current: 'B',
                dist: { A: 0, B: 2, C: 4, D: 3, E: INF },
                caption: 'Distances after visiting B (orange).'
              })
            },
            {
              title: 'Iteration 3',
              prompt: 'Next smallest unvisited?',
              simple: 'D (distance 3). Through D: E = 3 + 4 = 7. C would be 3 + 6 = 9, worse than 4, so it stays 4. Row: 0, 2, 4, 3, 7.',
              figure: G.q4Graph({
                visited: ['A', 'B'],
                current: 'D',
                dist: { A: 0, B: 2, C: 4, D: 3, E: 7 },
                caption: 'Distances after visiting D.'
              })
            },
            {
              title: 'Iteration 4',
              prompt: 'Next?',
              simple: 'C (distance 4). Through C: E = 4 + 2 = 6, better than 7. Row: 0, 2, 4, 3, 6.',
              figure: G.q4Graph({
                visited: ['A', 'B', 'D'],
                current: 'C',
                dist: { A: 0, B: 2, C: 4, D: 3, E: 6 },
                caption: 'Distances after visiting C. E improved from 7 to 6.'
              })
            },
            {
              title: 'Iteration 5',
              prompt: 'Last one.',
              simple: 'E (distance 6). Nothing left to update. Row: 0, 2, 4, 3, 6.'
            }
          ],
          key: {
            gist: 'Visit order: A, B, D, C, E.',
            table: {
              head: ['', 'A', 'B', 'C', 'D', 'E'],
              rows: [
                ['dist₁', c(0), '2', '5', '∞', '∞'],
                ['dist₂', '0', c(2), '4', '3', '∞'],
                ['dist₃', '0', '2', '4', c(3), '7'],
                ['dist₄', '0', '2', c(4), '3', '6'],
                ['dist₅', '0', '2', '4', '3', c(6)]
              ]
            },
            body: []
          }
        },
        {
          id: 'b',
          name: 'Write down the shortest paths',
          ask: [
            "For each vertex v, write down the shortest path from vertex A to v, as determined by your execution of Dijkstra’s algorithm. Write the path as a sequence of nodes visited on the path starting with A and ending with v. For example, a valid (but not necessarily shortest) path from vertex A to D is A → C → B → D.",
            "A to B: <span class=\"blank\"></span>&emsp; A to C: <span class=\"blank\"></span>&emsp; A to D: <span class=\"blank\"></span>&emsp; A to E: <span class=\"blank\"></span>"
          ],
          steps: [
            {
              title: 'Follow the “came from” pointers',
              prompt: 'For each node, which neighbor gave it its final distance?',
              simple:
                'B came from A. C’s final 4 came from B. D’s 3 came from B. E’s final 6 came from C. So: A→B, A→B→C, A→B→D, A→B→C→E.',
              figure: G.q4Graph({
                visited: ['A', 'B', 'C', 'D', 'E'],
                tree: [['A', 'B'], ['B', 'C'], ['B', 'D'], ['C', 'E']],
                dist: { A: 0, B: 2, C: 4, D: 3, E: 6 },
                caption: 'The shortest-path tree: each node keeps the one edge that gave it its final distance.'
              })
            }
          ],
          key: { gist: 'B: A→B. C: A→B→C. D: A→B→D. E: A→B→C→E.', body: [] }
        },
        {
          id: 'c',
          name: 'Delete as many edges as possible',
          ask: [
            "You want to delete the maximum number of edges possible from a graph, while ensuring that the lengths of the shortest paths from the source A to any of the vertices does not increase. Formally, you will design an algorithm ConservativeDelete(G = (V, E), {w<sub>e</sub>}<sub>e∈E</sub>, A) that takes as input a graph G, edge lengths w<sub>e</sub>, and the source vertex A. Your algorithm must return a set R ⊆ E of edges to be removed, such that (1) |R| is as large as possible and (2) for any vertex v, the shortest A → v path using the edges in E \\ R is equal to the length of the shortest path from A to v in graph G.",
            "Answer the following two questions about the above task.",
            "(i) What is the maximum number of edges that can be deleted, in terms of |V| and |E|?",
            "(ii) Write a description of ConservativeDelete. Make sure that it’s clear in your description how you are tracking the edges that you intend to keep/remove. Your algorithm must run in time O((|E| + |V|) log(|V|)) to receive full credit."
          ],
          steps: [
            {
              title: 'What do you have to keep?',
              prompt: 'Look at the picture from part (b). What’s the smallest set of edges that still gives every shortest path?',
              simple:
                'Just the shortest-path tree. A tree on |V| vertices has |V| − 1 edges. Everything else can go: |E| − |V| + 1 edges deleted.',
              figure: G.q4Graph({
                visited: ['A', 'B', 'C', 'D', 'E'],
                tree: [['A', 'B'], ['B', 'C'], ['B', 'D'], ['C', 'E']],
                caption: 'Keep the 4 blue edges. The 3 gray ones can all be deleted: 7 − 5 + 1 = 3.'
              })
            },
            {
              title: 'The algorithm',
              prompt: 'How do you find the shortest-path tree’s edges?',
              simple:
                'Run Dijkstra from A and record prev[v] for each vertex. The tree is the edges (prev[v], v). Return R = every edge not in that tree.',
              reveal: [
                'Runtime: Dijkstra is O((|E| + |V|) log |V|). Collecting the tree edges is O(|V|), and building R with a hash set is O(|E|). Total: O((|E| + |V|) log |V|).'
              ]
            }
          ],
          key: {
            gist: '(i) |E| − |V| + 1. (ii) Run Dijkstra, keep the prev-pointer tree edges, delete everything else.',
            body: [],
            runtime: 'O((|E| + |V|) log |V|)'
          }
        }
      ],
      takeaway: [
        'Dijkstra by hand: visit the smallest unvisited distance, then relax its neighbors. Watch for distances that go DOWN later (C from 5 to 4, E from 7 to 6).',
        'The shortest-path tree has |V| − 1 edges and keeps every distance. Every other edge is optional.'
      ]
    },

    // ------------------------------------------------------------------ Q5
    {
      number: 5,
      title: 'Kruskal’s MST',
      points: 6,
      topics: ['Kruskal', 'MST', 'union-find'],
      preamble: [
        "Consider the undirected, weighted graph G whose vertex set is V(G) = {A, B, C, D, E, F}. Below, we list the edges along with their corresponding weights and also provide a visual representation of the graph for clarity."
      ],
      parts: [
        {
          id: 'a',
          name: 'Run Kruskal by hand',
          ask: [
            "Suppose we run Kruskal’s algorithm on G in order to compute the MST. For each step it takes, write down the edge Kruskal’s algorithm considers and indicate whether it adds the edge to the MST or skips it."
          ],
          figure: G.q5Graph(0, 'Edges: A–B 31, A–C 20, A–D 26, B–C 25, B–D 10, B–E 50, C–F 30, D–E 27, E–F 40.'),
          steps: [
            {
              title: 'Sort the edges',
              prompt: 'Kruskal looks at edges from lightest to heaviest. List them in order.',
              simple: 'B–D 10, A–C 20, B–C 25, A–D 26, D–E 27, C–F 30, A–B 31, E–F 40, B–E 50.'
            },
            {
              title: 'Steps 1–3',
              prompt: 'B–D, A–C, B–C. Does any of them make a cycle?',
              simple:
                'No. Add all three. After B–D and A–C you have two separate pairs, {B, D} and {A, C}, and B–C joins them.',
              figure: G.q5Graph(3, 'After 3 steps: A, B, C, D are all connected.')
            },
            {
              title: 'Step 4: A–D (26)',
              prompt: 'A and D are already connected (A–C–B–D). Add or skip?',
              choices: ['Add', 'Skip'],
              correct: 1,
              simple: 'Skip. A and D are already in the same group, so A–D would close the cycle A–C–B–D–A.'
            },
            {
              title: 'Steps 5–6',
              prompt: 'D–E (27) and C–F (30). E and F aren’t connected to anything yet.',
              simple: 'Add both. Now all 6 vertices are connected with 5 edges, so the tree is complete.',
              figure: G.q5Graph(6, 'Five edges on six vertices: the MST is done.')
            },
            {
              title: 'Steps 7–9',
              prompt: 'A–B (31), E–F (40), B–E (50).',
              simple: 'Skip all three. Everything is already connected, so each one would make a cycle.',
              figure: G.q5Graph(9, 'Final MST in blue, total weight 10 + 20 + 25 + 27 + 30 = 112.')
            }
          ],
          key: {
            gist: 'Added: B–D, A–C, B–C, D–E, C–F. Skipped: A–D, A–B, E–F, B–E.',
            table: {
              head: ['Step', 'Edge', 'Added?'],
              rows: [
                ['1', 'B–D (10)', 'Yes'],
                ['2', 'A–C (20)', 'Yes'],
                ['3', 'B–C (25)', 'Yes'],
                ['4', 'A–D (26)', 'No'],
                ['5', 'D–E (27)', 'Yes'],
                ['6', 'C–F (30)', 'Yes'],
                ['7', 'A–B (31)', 'No'],
                ['8', 'E–F (40)', 'No'],
                ['9', 'B–E (50)', 'No']
              ]
            },
            body: []
          }
        }
      ],
      takeaway: [
        'Kruskal: sort, then add each edge unless its two ends are already connected.',
        'Once you have |V| − 1 edges, every remaining edge is a skip. You can stop thinking.'
      ]
    },

    // ------------------------------------------------------------------ Q6
    {
      number: 6,
      title: 'Pruning DFS forest',
      points: 10,
      topics: ['DFS', 'SCCs', 'Kosaraju'],
      preamble: [
        "When running DFS, we obtain a DFS forest consisting of the tree(s) made up of the edges traversed by the DFS exploration procedure (tree edges). The order in which the vertices are explored, including which vertex we start at, may influence the structure of the resulting DFS forest. The possible DFS forests of a graph are defined as the different forests that can arise from running DFS with different exploration orders."
      ],
      parts: [
        {
          id: 'a1',
          name: 'Fewest trees',
          ask: [
            "Consider the following directed graph. In this problem, we study how the number of trees in the DFS forest varies depending on the order in which the vertices are explored.",
            "(i) What is the minimum number of trees in a DFS forest that can result from running DFS on the above graph? Draw a DFS forest that achieves this minimum number of trees."
          ],
          figure: G.q6Graph('problem'),
          steps: [
            {
              title: 'Is there a vertex that reaches everything?',
              prompt: 'If one DFS start reaches every vertex, you get 1 tree. Which vertex has no incoming edges?',
              simple: 'Vertex 2. It reaches 0, 5, 6 directly, then 0 reaches 1 and 4, and 1 reaches 7 and 3. Everything, so 1 tree.',
              figure: G.q6Graph('min')
            }
          ],
          key: { gist: '1 tree (start DFS at 2)', body: [] }
        },
        {
          id: 'a2',
          name: 'Most trees',
          ask: [
            "Consider the following directed graph. In this problem, we study how the number of trees in the DFS forest varies depending on the order in which the vertices are explored.",
            "(ii) What is the maximum number of trees in a DFS forest that can result from running DFS on the above graph? Draw a DFS forest that achieves this maximum number of trees."
          ],
          figure: G.q6Graph('problem'),
          steps: [
            {
              title: 'What can never be split up?',
              prompt: 'If u and v are in the same SCC, can they end up in different DFS trees?',
              simple:
                'No. Whichever one DFS reaches first can reach the other, so it pulls the other into its tree. Each SCC always stays in one tree.'
            },
            {
              title: 'Count the SCCs',
              prompt: 'Find the cycles in the graph. How many SCCs are there?',
              simple:
                '1 → 7 → 3 → 1 is a cycle, so {1, 7, 3} is one SCC. Every other vertex (0, 2, 4, 5, 6) is alone. 6 SCCs means at most 6 trees, and you can get exactly 6.',
              figure: G.q6Graph('max'),
              reveal: [
                'To get 6: start DFS from “downstream” vertices first, so nothing is left for later starts to grab. For example 4, then 1, then 5, 6, 0, 2.'
              ]
            }
          ],
          key: { gist: '6 trees (one per SCC)', body: [] }
        },
        {
          id: 'b',
          name: 'Most trees in a DAG',
          ask: [
            "What is the maximum number of trees in a DFS forest that can result from running DFS on a DAG with n vertices?"
          ],
          steps: [
            {
              title: 'SCCs in a DAG',
              prompt: 'How big is each SCC in a DAG?',
              simple:
                'One vertex each, since there are no cycles. So up to n trees. You get n by starting DFS at sinks first (reverse topological order), so every start finds nothing new.'
            }
          ],
          key: { gist: 'n', body: [] }
        },
        {
          id: 'c',
          name: 'Build the max-tree forest',
          ask: [
            "Provide an O(n + m)-time algorithm that constructs a DFS forest with the maximum possible number of separate trees. The algorithm should output a list of all tree edges (u, v) in the DFS forest in any order."
          ],
          steps: [
            {
              title: 'What order do you need?',
              prompt: 'To get one tree per SCC, which SCCs should DFS start from first?',
              simple:
                'Sink SCCs first. Then each new DFS can’t leak into an SCC that hasn’t been visited yet, because everything it can reach is already done.'
            },
            {
              title: 'You already know an algorithm that does that',
              prompt: 'Which lecture algorithm visits SCCs sink-first?',
              simple:
                'Kosaraju! Its second pass runs DFS from sink SCCs first, and each DFS tree is exactly one SCC. Just record the tree edges during that second pass and output them. O(n + m).'
            }
          ],
          key: {
            gist: 'Run Kosaraju and output the tree edges from its second DFS pass. That gives one tree per SCC.',
            body: [],
            runtime: 'O(n + m)'
          }
        }
      ],
      takeaway: [
        'An SCC can never be split across DFS trees. So #trees ≤ #SCCs, and sink-first order achieves it.',
        'Minimum trees: 1 if some vertex reaches everything. Otherwise, one per source SCC.',
        'Kosaraju’s second pass = DFS in sink-first SCC order.'
      ]
    },

    // ------------------------------------------------------------------ Q7
    {
      number: 7,
      title: 'Don’t resist the Resistance',
      points: 10,
      topics: ['divide and conquer', 'group testing'],
      preamble: [
        "We are playing a variant of The Resistance, a board game where there are n players, s of which are spies. In this variant, in every round, we choose a subset of players to go on a mission. A mission succeeds if the subset of the players does not contain a spy, but fails if at least one spy goes on the mission. After a mission completes, we only know its outcome and not which of the players on the mission were spies."
      ],
      parts: [
        {
          id: 'a',
          name: 'Find all the spies',
          ask: [
            "Describe a strategy that identifies all the spies in O(s log(n/s)) missions. You do not need to prove that your strategy works or analyze its runtime explicitly."
          ],
          steps: [
            {
              title: 'What does one mission tell you?',
              prompt: 'If a mission succeeds, what do you learn about everyone on it?',
              simple: 'They’re all innocent. A success clears a whole group at once. A failure only says “someone in here is a spy”.'
            },
            {
              title: 'Split into 2s groups',
              prompt: 'Split the players into 2s equal groups and send each on a mission. At most how many can fail?',
              simple:
                'At most s fail, since each failure needs its own spy. So at least s of the 2s groups succeed, which clears at least half the players. Keep only the players from failed groups and repeat.',
              figure: G.resistance()
            },
            {
              title: 'Count the missions',
              prompt: 'Each round costs 2s missions. How many rounds until only s players are left?',
              simple:
                'The pool halves every round, from n down to s: that’s log(n/s) rounds. 2s missions × log(n/s) rounds = O(s log(n/s)). When exactly s players remain, they must be the spies.'
            },
            {
              title: 'Another way (also accepted)',
              prompt: 'Could you just split in two, over and over?',
              simple:
                'Yes. Split into 2 groups, drop any group that succeeds, and keep splitting groups that fail until they’re single players. At most s branches stay alive on each level, which also gives O(s log(n/s)).'
            }
          ],
          key: {
            gist: 'Split the remaining players into 2s groups. Throw out every group that succeeds (at least half the players), and repeat until s players are left.',
            body: [],
            runtime: 'O(s log(n/s)) missions'
          }
        }
      ],
      takeaway: [
        'Group testing: one test clears a whole group. Use it to throw away half the candidates each round.',
        '“At most s things can go wrong” + “2s tries” means at least half succeed.'
      ]
    },

    // ------------------------------------------------------------------ Q8
    {
      number: 8,
      title: 'Smallest number',
      points: 15,
      topics: ['greedy', 'digits'],
      preamble: [
        "In this problem, you will design an algorithm that helps Mumble the penguin find the smallest number that can be represented with the digits of a larger number. Formally, given the base-b representation of a large number B that has exactly n digits, Mumble wants to find the smallest number A that can be obtained from B by removing all but k of its digits (and without reordering the digits).",
        "For example, if we have b = 5, B = 20334 and k = 3, then some valid choices for A include 203, 034 and 204. Some invalid examples include 333, 241, 13 and 0. You should assume that the operations of storing, retrieving, and comparing base-b digits each take O(1)-runtime."
      ],
      parts: [
        {
          id: 'a',
          name: 'The algorithm',
          ask: [
            "Provide an algorithm SmallestNumber(B, k) to help Mumble choose the smallest number A that can be formed by removing all but k digits from the base-b representation of B. You may assume that B is provided in its base-b representation, as a string x<sub>1</sub>x<sub>2</sub> … x<sub>n</sub> of length n where each character x<sub>i</sub> is an integer x<sub>i</sub> ∈ {0, 1, …, b − 1}. Your algorithm should have a runtime of O(nk) (this means your runtime should not depend on the value of b) or better to receive credit."
          ],
          steps: [
            {
              title: 'Try the example',
              prompt: 'B = 20334, k = 3. What’s the smallest A?',
              simple: '033. It starts with the 0, then takes the two 3s. Leading zeros are fine here: we’re comparing digit strings.'
            },
            {
              title: 'The first digit matters most',
              prompt: 'Which digit should A start with? Careful: you still need k − 1 digits after it.',
              simple:
                'The smallest digit you can pick while leaving at least k − 1 digits after it. That means searching only positions 1 to n − k + 1. If there’s a tie, take the leftmost one, because that leaves more digits to choose from later.',
              pitfall: 'Picking the rightmost copy of the smallest digit throws away options. Always take the leftmost.'
            },
            {
              title: 'Repeat with a sliding window',
              prompt: 'After picking the digit at position i, where can the next digit come from?',
              simple:
                'Start just after i, and let the window end one position further right than last time (you need one fewer digit afterward). Pick the smallest (leftmost) digit in that window. Do this k times.',
              figure: G.digitWindow()
            }
          ],
          key: {
            gist: 'k times: in the window from (last pick + 1) to (n − k + round number), pick the leftmost smallest digit.',
            body: []
          }
        },
        {
          id: 'b',
          name: 'Runtime',
          ask: [
            "Analyze the runtime of your algorithm. You will receive credit only if your algorithm’s runtime is indeed O(nk)."
          ],
          steps: [
            {
              title: 'Count the work',
              prompt: 'How many picks, and how long does each one take?',
              simple: 'k picks, and each scans a window of at most n digits. O(nk).',
              reveal: [
                'Bonus (not required): a stack gets O(n). Push digits left to right, and pop while the top is bigger than the new digit and you can still afford to drop digits.'
              ]
            }
          ],
          key: { gist: 'O(nk): k rounds, each an O(n) scan', body: [] }
        }
      ],
      takeaway: [
        'Smallest number from a subsequence: be greedy on the most important digit first, but leave room to finish.',
        'Ties go to the leftmost choice, because it keeps the most options open.'
      ]
    },

    // ------------------------------------------------------------------ Q9
    {
      number: 9,
      title: 'Road trip part two',
      points: 15,
      topics: ['BFS', 'layered graphs', 'graph copies'],
      preamble: [
        "Let G = (V, E) be an undirected graph representing a map of all of the cities in the U.S.A. with an edge between two cities if they are connected by a road. In total, G has n cities and m roads, and each road takes one day to traverse. In addition, some cities B ⊆ V have baseball teams, each of which hosts a baseball game every night. As baseball fans, we would like to plan some road trips while ensuring that we go to enough baseball games."
      ],
      parts: [
        {
          id: 'a',
          name: 'NY to SF with 10 games',
          ask: [
            "We want to plan a road trip from New York to San Francisco so that we travel the shortest number of days while going to at least 10 baseball games (meaning that we end the day in a city in B at least 10 times). We are allowed to stay in the same city for multiple days in a row, which might help if we want to see multiple consecutive baseball games there.",
            "For simplicity, in this problem (and part (b) as well) you may assume that neither San Francisco nor New York has a baseball team (meaning that neither city is in B), even though they do in real life.",
            "(i) Provide an O(n + m) time algorithm to solve this problem.",
            "Hint: Try to construct a new graph G′ on which finding a shortest path will solve the problem and enforce spending at least 10 days in B.",
            "(ii) Analyze the runtime of your algorithm."
          ],
          steps: [
            {
              title: 'What do you need to remember?',
              prompt: 'Besides which city you’re in, what number do you need to track?',
              simple: 'How many games you’ve seen so far: 0, 1, …, 10 (10 means “enough”). That’s 11 possible states.',
              reveal: ['Same trick as the two-copy graphs in Fall 2025 Q8, just with 11 copies instead of 2.']
            },
            {
              title: 'Build 11 copies',
              prompt: 'Make copies G<sub>0</sub> to G<sub>10</sub>. Which moves should take you from copy i to copy i + 1?',
              simple:
                'Ending a day in a baseball city. So for each baseball city b: driving into b from a neighbor u goes u<sub>i</sub> → b<sub>i+1</sub>, and staying put in b goes b<sub>i</sub> → b<sub>i+1</sub>. Ordinary roads stay inside the same copy.',
              figure: G.roadTrip()
            },
            {
              title: 'Search it',
              prompt: 'All edges take one day. Which search, from where to where?',
              simple: 'BFS (every edge costs 1 day) from New York in copy 0. The answer is the distance to San Francisco in copy 10.'
            },
            {
              title: 'Runtime',
              prompt: 'How big is the new graph?',
              simple: '11n vertices. Edges: 11 copies of every road, plus at most 10 “up” edges per road end and 10 “stay” edges per baseball city. All of that is O(n + m), so BFS is O(n + m).'
            }
          ],
          key: {
            gist: '11 copies of G (“games seen so far”). Arriving at or staying in a baseball city moves you up a copy. BFS from NY in copy 0 to SF in copy 10.',
            body: [],
            runtime: 'O(n + m)'
          }
        },
        {
          id: 'b',
          name: 'Round trip with 10 games',
          ask: [
            "For simplicity, in this problem (and part (b) as well) you may assume that neither San Francisco nor New York has a baseball team (meaning that neither city is in B), even though they do in real life.",
            "Now we want to do a round trip from New York to San Francisco, then back to New York in the fewest possible days while still going to at least 10 baseball games. Provide an O(n + m) time algorithm that solves this problem."
          ],
          steps: [
            {
              title: 'Split the games',
              prompt: 'Say you see i games on the way there. How many do you need on the way back?',
              simple: 'At least 10 − i. And i can be anything from 0 to 10.'
            },
            {
              title: 'Try every split',
              prompt: 'How do you use part (a) for this?',
              simple:
                'For each i from 0 to 10: compute the NY → SF distance with at least i games, plus the SF → NY distance with at least 10 − i games (part (a) with fewer copies). Return the smallest total. That’s 22 BFS runs, a constant, so O(n + m).'
            },
            {
              title: 'Another way (also accepted)',
              prompt: 'Could you remember “have I reached SF yet?” instead?',
              simple:
                'Yes. Make 22 copies: (games seen, reached SF yes/no). Edges into SF go from the “no” copies to the “yes” copies. One BFS from NY in (0, no) to NY in (10, yes).'
            }
          ],
          key: {
            gist: 'For each i = 0…10, add dist(NY→SF, ≥ i games) + dist(SF→NY, ≥ 10 − i games). Return the minimum.',
            body: [],
            runtime: 'O(n + m)'
          }
        }
      ],
      takeaway: [
        'Need to count something along a path (games, gifts, switches)? Make one copy of the graph per count.',
        'Unweighted after the construction? Use BFS, not Dijkstra.',
        'A constant number of BFS runs (like 22) is still O(n + m).'
      ]
    },

    // ------------------------------------------------------------------ Q10
    {
      number: 10,
      title: 'The representative',
      points: 15,
      topics: ['weighted median', 'divide and conquer', 'deterministic select'],
      preamble: [
        "In this problem, you will design an algorithm that helps a group of penguins find a representative penguin, who is of somewhat average height and weight. The representative is a penguin such that the total weight of all penguins strictly shorter than it, and the total weight of all penguins strictly taller than it, are both at most half the total weight of all penguins.",
        "Formally, suppose that n penguins with distinct heights h<sub>0</sub>, …, h<sub>n−1</sub> have gathered in an array A, in no particular order. The i<sup>th</sup> penguin’s weight is a positive value w<sub>i</sub>. The total weight of all penguins in the array is W = w<sub>0</sub> + ⋯ + w<sub>n−1</sub>. You will design an algorithm FindRep(A, W<sub>short</sub>, W<sub>tall</sub>) that returns a representative p (if one exists) that satisfies the following criteria:",
        "<span class=\"math\">Σ<sub>i : h<sub>i</sub> &lt; h<sub>p</sub></sub> w<sub>i</sub> ≤ W<sub>short</sub> &ensp;and&ensp; Σ<sub>i : h<sub>i</sub> &gt; h<sub>p</sub></sub> w<sub>i</sub> ≤ W<sub>tall</sub></span>",
        "(The left sum is the total weight of penguins shorter than p; the right sum is the total weight of penguins taller than p.)",
        "Throughout this problem, you may use the following fact without proof: if W<sub>short</sub>, W<sub>tall</sub> ≥ 0 and W<sub>short</sub> + W<sub>tall</sub> ≥ W, then a representative always exists. As a reminder, only deterministic (non-random) algorithms will receive points."
      ],
      parts: [
        {
          id: 'a',
          name: 'Find the representative in O(n)',
          ask: [
            "Describe a divide-and-conquer algorithm to find a representative for values of W<sub>tall</sub> = W<sub>short</sub> = W/2. Formally, you want to compute FindRep(A, W/2, W/2) where W is the total weight of all n penguins. Your algorithm must run in time O(n) to receive full credit.",
            "Correct algorithms with O(n log n) runtime will receive partial credit. Algorithms with worse runtime will receive no credit. You may use the algorithm DeterministicSelect from class, which finds the median of n numbers (such as heights) with O(n) runtime."
          ],
          steps: [
            {
              title: 'Picture it',
              prompt: 'Line the penguins up by height, and make each one as wide as its weight. Where’s the representative?',
              simple: 'Right on the halfway point of the total weight. The penguin covering the W/2 line has at most W/2 on each side. It’s a “weighted median”.',
              figure: G.weightedMedian()
            },
            {
              title: 'The O(n log n) way',
              prompt: 'What’s the easy way to find that penguin?',
              simple: 'Sort by height, then walk left to right adding up weights until you pass W/2. Sorting costs O(n log n), which is partial credit only.'
            },
            {
              title: 'Pivot on the median height',
              prompt: 'Instead of sorting, find the median-height penguin p with DeterministicSelect. Split the others into shorter (L) and taller (R). What do you check?',
              simple:
                'Add up the weights of L and of R. If L ≤ its budget and R ≤ its budget, p is the representative, so you’re done. Otherwise exactly one side is too heavy, because both can’t be: their sum is less than W.'
            },
            {
              title: 'Recurse on the heavy side',
              prompt: 'Say L is too heavy. What do you recurse on, and how do the budgets change?',
              simple:
                'Recurse on L plus p. The penguins in R are all taller than everyone in L ∪ {p}, so subtract their weight from the “taller” budget: T<sub>R</sub> ← T<sub>R</sub> − R. (Mirror image if R is too heavy.)',
              pitfall: 'Two easy misses: forgetting to keep p in the recursive call (it might still be the answer), and forgetting to charge the dropped side’s weight to the budget.'
            }
          ],
          key: {
            gist: 'Pivot on the median height. If both sides fit their budgets, return the pivot. Otherwise recurse on the heavy side plus the pivot, charging the dropped side to its budget.',
            body: []
          }
        },
        {
          id: 'b',
          name: 'Runtime',
          ask: [
            "Analyze the runtime of your algorithm. You will receive full credit for a correct proof if your algorithm has O(n) runtime and partial credit for a correct proof if your algorithm has O(n log n) runtime."
          ],
          steps: [
            {
              title: 'Write the recurrence',
              prompt: 'How much work per call, and how big is the recursive call?',
              choices: ['O(n)', 'O(n log n)', 'O(n<sup>2</sup>)'],
              correct: 0,
              simple:
                'O(n) per call (median plus a scan to sum the weights), and the recursive call is about half the size because the pivot is the median. T(n) = T(n/2) + O(n) = O(n).',
              reveal: ['Why it’s O(n): n + n/2 + n/4 + … = 2n. The work halves every level, so the top level dominates.']
            }
          ],
          key: { gist: 'T(n) = T(n/2) + O(n) = O(n)', body: [] }
        }
      ],
      takeaway: [
        'Weighted median: the item sitting on the halfway line of total weight.',
        'Median-of-heights pivot + recurse on one side = T(n/2) + O(n) = O(n). The same pattern as QuickSelect, but deterministic.',
        'When you drop part of the input, update whatever totals or budgets it contributed to.'
      ]
    }
  ]
};
