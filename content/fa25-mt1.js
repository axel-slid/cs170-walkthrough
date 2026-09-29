// CS 170, Fall 2025, Midterm 1 (S. Garg and J. Wright).
// Source: ~/Downloads/2025 Fall Midterm 1 KEY.pdf
//
// Solutions here are written in our own words, following the official key's
// approach. They are study notes, not a transcript of the exam.
//
// Text fields may contain inline HTML (<sup>, <sub>, <i>, <code>).
// Step fields:
//   title    shown while locked, so it names the move without giving it away
//   prompt   the question to think about before revealing
//   choices  optional: clickable answers; `correct` is the index of the right one
//   simple   the plain-words answer, shown first
//   figure   optional SVG (from renderer/figures.js)
//   reveal   optional: more detail, paragraphs
//   pitfall  optional: how people lose points

import * as F from '../renderer/figures.js';

const TF = ['True', 'False'];

export const exam = {
  id: 'fa25-mt1',
  course: 'CS 170',
  term: 'Fall 2025',
  title: 'Midterm 1',
  instructors: 'S. Garg and J. Wright',
  source: '~/Downloads/2025 Fall Midterm 1 KEY.pdf',
  // Pages of the official key (rendered by scripts/render-keys.sh) holding each question,
  // shown by the Staff solution button.
  solutionDir: 'keys/fa25-mt1',
  solutionPages: { 1: [2, 4], 2: [5, 7], 3: [8, 9], 4: [10, 13], 5: [14, 16], 6: [17, 20], 7: [21, 23], 8: [24, 27] },
  questions: [
    // ------------------------------------------------------------------ Q1
    {
      number: 1,
      title: 'Asymptotics warmup',
      points: 13,
      topics: ['Big-O', 'logs and exponents', 'recurrences', 'Master theorem'],
      parts: [
        {
          id: 'a',
          name: 'Which function grows faster?',
          points: 5,
          ask: [
            "For each pair of functions f and g, specify whether f = O(g), g = O(f), or both."
          ],
          table: {
            head: ['', 'f', 'g'],
            rows: [
              ['1', 'n<sup>2</sup>', 'log<sub>2</sub>(n<sup>99</sup>)'],
              ['2', 'n<sup>100</sup> + 99<sup>n</sup>', 'n<sup>99</sup> + 100<sup>n</sup>'],
              ['3', 'n<sup>log<sub>2</sub> log<sub>2</sub> n</sup>', '(log<sub>2</sub> n)<sup>log<sub>2</sub> n</sup>'],
              ['4', 'n<sup>log<sub>2</sub> n</sup>', '(log<sub>2</sub> n)<sup>n</sup>'],
              ['5', '2<sup>√(log<sub>2</sub> n)</sup>', 'n']
            ]
          },
          steps: [
            {
              title: 'Know the pecking order',
              prompt:
                'Before touching any row: rank log n, n, n<sup>2</sup>, n<sup>100</sup>, and 2<sup>n</sup> from slowest-growing to fastest.',
              simple:
                'Logs are slowest. Then polynomials, where the bigger power wins. Then exponentials, where the bigger base wins. Any exponential eventually beats any polynomial, even n<sup>100</sup>.',
              figure: F.growthLadder(),
              reveal: [
                'f = O(g) means “f grows no faster than g”: once n is big enough, f is at most some constant times g. Think of O as ≤ for growth rates.',
                '“Both” means they grow at the same rate, so neither pulls ahead. Only pick Both when that’s really true.'
              ]
            },
            {
              title: 'Row 1',
              prompt: 'n<sup>2</sup> vs log<sub>2</sub>(n<sup>99</sup>). Hint: pull the 99 out of the log.',
              choices: ['f = O(g)', 'g = O(f)', 'Both'],
              correct: 1,
              simple:
                'log(n<sup>99</sup>) = 99 · log n. That’s just a log with a constant in front, and logs lose to n<sup>2</sup>. So g = O(f) only.',
              pitfall: 'The 99 looks scary but it’s trapped inside a log. It turns into a ×99, which big-O ignores.'
            },
            {
              title: 'Row 2',
              prompt:
                'n<sup>100</sup> + 99<sup>n</sup> vs n<sup>99</sup> + 100<sup>n</sup>. Hint: when n is huge, which term takes over in each?',
              choices: ['f = O(g)', 'g = O(f)', 'Both'],
              correct: 0,
              simple:
                'The exponential part wins in each: f ≈ 99<sup>n</sup> and g ≈ 100<sup>n</sup>. Base 100 beats base 99, so f = O(g) only.',
              reveal: [
                'n<sup>100</sup> vs n<sup>99</sup> doesn’t matter at all, since both are tiny next to the exponentials.',
                'Why isn’t 99<sup>n</sup> vs 100<sup>n</sup> “both”? Divide them: (99/100)<sup>n</sup> = 0.99<sup>n</sup> → 0. A different base is a genuinely different growth rate.'
              ],
              pitfall: '2<sup>n</sup> vs 3<sup>n</sup> is NOT “both”. Different bases on an exponential are different growth rates.'
            },
            {
              title: 'Row 3',
              prompt:
                'n<sup>log log n</sup> vs (log n)<sup>log n</sup>. Hint: take log<sub>2</sub> of both and compare.',
              choices: ['f = O(g)', 'g = O(f)', 'Both'],
              correct: 2,
              simple:
                'Take log of each. Both come out to (log n) · (log log n). They are literally the same function. Both.',
              reveal: [
                'The general rule: a<sup>log b</sup> = b<sup>log a</sup>. You can swap the base with the thing inside the log.'
              ]
            },
            {
              title: 'Row 4',
              prompt: 'n<sup>log n</sup> vs (log n)<sup>n</sup>. Take log of both again.',
              choices: ['f = O(g)', 'g = O(f)', 'Both'],
              correct: 0,
              simple:
                'log f = (log n)<sup>2</sup>. log g = n · log log n. The second one has a whole n in it, so it’s way bigger. f = O(g) only.',
              reveal: [
                'Rewritten with base 2: f = 2<sup>(log n)²</sup> and g = 2<sup>n log log n</sup>. Compare the exponents, and anything with a factor of n beats a power of log n.'
              ],
              pitfall:
                'Taking logs is safe when one log is WAY bigger, like here. If the logs only differ by a constant factor (log f = 2 · log g), the functions still differ a lot: f = g<sup>2</sup>.'
            },
            {
              title: 'Row 5',
              prompt: '2<sup>√(log n)</sup> vs n. Hint: write n as a power of 2.',
              choices: ['f = O(g)', 'g = O(f)', 'Both'],
              correct: 0,
              simple:
                'n = 2<sup>log n</sup>. Now both are 2 to something, so compare the somethings: √(log n) vs log n. The square root is smaller. f = O(g) only.',
              reveal: [
                '2<sup>√log n</sup> is a weird in-between function: it grows slower than every polynomial, but faster than every power of log n. Exams love it.'
              ]
            }
          ],
          key: {
            gist: 'Row by row: g = O(f), f = O(g), Both, f = O(g), f = O(g).',
            body: [
              'Trick 1: constants come out of logs, and constants don’t matter.',
              'Trick 2: in a sum, only the fastest-growing term matters.',
              'Trick 3: when stuck, write both as 2<sup>something</sup> and compare the somethings.'
            ]
          }
        },
        {
          id: 'b',
          name: 'T(n) = 10T(n/10) + O(n)',
          points: 2,
          ask: [
            "For each of the following recurrences, state a closed form for T(n). For each of the recurrence relations, T(1) = T(0) = 1. A proof is not required for any of the recurrence relations.",
            "<span class=\"math\">T(n) = 10T(n/10) + O(n)</span>"
          ],
          steps: [
            {
              title: 'Read off a, b, d',
              prompt:
                'The Master theorem handles T(n) = a · T(n/b) + O(n<sup>d</sup>). What are a, b, and d here?',
              simple:
                'a = 10 (ten subproblems), b = 10 (each is size n/10), d = 1 (the extra work is n<sup>1</sup>).',
              reveal: [
                'The Master theorem compares d with log<sub>b</sub> a. If they’re equal, every level of the recursion does the same work. If d is bigger, the top level wins. If d is smaller, the bottom wins.'
              ]
            },
            {
              title: 'Which case?',
              prompt: 'Here log<sub>10</sub> 10 = 1 = d. What does that give?',
              choices: ['O(n)', 'O(n log n)', 'O(n<sup>2</sup>)'],
              correct: 1,
              simple:
                'Every level of the tree costs n, and there are log n levels. Total: n log n.',
              figure: F.recTree(
                [
                  { count: 1, label: 'n', cost: 'n' },
                  { count: 10, label: 'n/10', cost: '10 · n/10 = n' },
                  { count: 100, label: 'n/100', cost: '100 · n/100 = n' }
                ],
                'Same n on every level  ×  log n levels  =  n log n'
              ),
              reveal: ['It’s mergesort with 10 pieces instead of 2. The number of pieces doesn’t change the answer.']
            }
          ],
          key: { gist: 'T(n) = O(n log n)', body: ['Master theorem, balanced case: d = log<sub>b</sub> a = 1.'] }
        },
        {
          id: 'c',
          name: 'T(n) = T(n − 1) + O(n log n)',
          points: 2,
          ask: [
            "For each of the following recurrences, state a closed form for T(n). For each of the recurrence relations, T(1) = T(0) = 1. A proof is not required for any of the recurrence relations.",
            "<span class=\"math\">T(n) = T(n − 1) + O(n log n)</span>"
          ],
          steps: [
            {
              title: 'This isn’t Master-theorem shaped',
              prompt: 'The subproblem is n − 1, not n/b. What do you do instead?',
              simple:
                'Just unroll it. T(n) = n log n + (n−1) log(n−1) + (n−2) log(n−2) + … + 1. It’s one big sum.',
              reveal: [
                'The Master theorem only works when the size gets divided. Subtracting 1 means n levels that each shrink only a little, so you add them up.'
              ]
            },
            {
              title: 'Squeeze the sum',
              prompt:
                'Estimate the sum of i log i for i = 1 to n. Upper bound: every term is at most what? Lower bound: the top half of the terms are each at least what?',
              choices: ['O(n log n)', 'O(n<sup>2</sup> log n)', 'O(n<sup>2</sup>)'],
              correct: 1,
              simple:
                'Upper: n terms, each at most n log n, so at most n<sup>2</sup> log n. Lower: the biggest n/2 terms are each at least (n/2) log(n/2), so at least about n<sup>2</sup>/4 · log n. Both are n<sup>2</sup> log n.',
              figure: F.sumBars(),
              reveal: [
                'The “top half” trick is the standard way to lower-bound a sum: throw away the small half, and the big half alone is already big enough.'
              ]
            }
          ],
          key: { gist: 'T(n) = O(n<sup>2</sup> log n)', body: ['Unroll, then bound the sum above and below.'] }
        },
        {
          id: 'd',
          name: 'T(n) = 2T(√n) + O(n)',
          points: 2,
          ask: [
            "For each of the following recurrences, state a closed form for T(n). For each of the recurrence relations, T(1) = T(0) = 1. A proof is not required for any of the recurrence relations.",
            "<span class=\"math\">T(n) = 2T(√n) + O(n)</span>"
          ],
          steps: [
            {
              title: 'Draw the levels',
              prompt:
                'The top level costs n. The next level has 2 problems of size √n. The one after has 4 of size n<sup>1/4</sup>. What does each level cost?',
              simple:
                'n, then 2√n, then 4 · n<sup>1/4</sup>, … The costs collapse super fast, so the top level is basically everything.',
              figure: F.recTree(
                [
                  { count: 1, label: 'n', cost: 'n' },
                  { count: 2, label: '√n', cost: '2√n' },
                  { count: 4, label: 'n^{1/4}', cost: '4 · n^{1/4}' }
                ],
                'Shrinks fast, so the top level wins: O(n)'
              ),
              reveal: [
                '√n is WAY smaller than n/2. For n = 1,000,000: √n = 1,000. So level 1 costs 2,000 while level 0 costs 1,000,000.'
              ]
            },
            {
              title: 'Answer',
              prompt: 'So what is T(n)?',
              choices: ['O(n)', 'O(n log n)', 'O(√n log n)'],
              correct: 0,
              simple: 'The top level’s n dominates. T(n) = O(n).',
              reveal: [
                'There are only about log log n levels (you can square-root n only that many times before hitting 2), and everything below the top adds up to far less than n.'
              ]
            }
          ],
          key: { gist: 'T(n) = O(n)', body: ['Per-level work shrinks extremely fast, so the root dominates.'] }
        },
        {
          id: 'e',
          name: 'T(n) = 2T(√n) + O(log n)',
          points: 2,
          ask: [
            "For each of the following recurrences, state a closed form for T(n). For each of the recurrence relations, T(1) = T(0) = 1. A proof is not required for any of the recurrence relations.",
            "<span class=\"math\">T(n) = 2T(√n) + O(log n)</span>"
          ],
          steps: [
            {
              title: 'Substitute m = log n',
              prompt: 'Set n = 2<sup>m</sup>. What happens to √n? What happens to log n?',
              simple:
                '√n = 2<sup>m/2</sup>, so square-rooting n just halves m. And log n is just m. Define S(m) = T(2<sup>m</sup>), and you get S(m) = 2S(m/2) + O(m).',
              figure: F.substitution()
            },
            {
              title: 'Now it’s mergesort',
              prompt: 'Solve S(m) = 2S(m/2) + O(m), then translate back to n.',
              choices: ['O(log n)', 'O(log n · log log n)', 'O(√n)'],
              correct: 1,
              simple:
                'S(m) = 2S(m/2) + m is exactly mergesort: S(m) = m log m. Put m = log n back in: T(n) = log n · log log n.',
              pitfall: 'Forgetting to substitute back. “O(m log m)” is not an answer in terms of n.'
            }
          ],
          key: { gist: 'T(n) = O(log n · log log n)', body: ['Substitute m = log n, solve with the Master theorem, substitute back.'] }
        }
      ],
      takeaway: [
        'Pecking order: log n < polynomials < exponentials. Inside each group, the bigger power or base wins.',
        'Stuck comparing two functions? Write both as 2<sup>something</sup> and compare the somethings.',
        'Master theorem: compare d with log<sub>b</sub> a. Equal: n<sup>d</sup> log n. d bigger: n<sup>d</sup>. d smaller: n<sup>log<sub>b</sub> a</sup>.',
        'See √n in a recurrence? Substitute n = 2<sup>m</sup>.'
      ]
    },

    // ------------------------------------------------------------------ Q2
    {
      number: 2,
      title: 'Miscellany',
      points: 22,
      topics: ['DFS', 'SCCs', 'Huffman', 'MSTs', 'topological order', 'shortest paths'],
      parts: [
        {
          id: 'a',
          name: 'Same SCC → intervals overlap?',
          points: 2,
          ask: [
            "If two vertices u and v belong to the same strongly connected component, then the intervals [pre(u), post(u)] and [pre(v), post(v)] must overlap.",
            "True or False?"
          ],
          steps: [
            {
              title: 'What do the intervals look like?',
              prompt:
                'pre = when DFS first enters a vertex, post = when it finishes. Draw a few. How can two of these intervals relate to each other?',
              simple:
                'Like parentheses: two intervals are either one inside the other (ancestor and descendant) or completely separate. Never partly overlapping.',
              figure: F.q2Intervals()
            },
            {
              title: 'Now decide',
              prompt: 'u and v are in the same SCC, so each can reach the other. Could their intervals be separate?',
              choices: TF,
              correct: 0,
              simple:
                'True. Whichever one DFS enters first can reach the other, so DFS finds the other before finishing the first. That makes them ancestor and descendant, so the intervals are nested and therefore overlap.',
              reveal: [
                'This is the “white path” idea from lecture: if v is reachable from u through vertices DFS hasn’t visited yet, v ends up as u’s descendant.'
              ]
            }
          ],
          key: { gist: 'True', body: ['Same SCC means mutual reachability, so one is the other’s DFS ancestor and the intervals nest.'] }
        },
        {
          id: 'b',
          name: 'Biggest possible SCC',
          points: 2,
          ask: [
            "In a graph with n vertices and e edges, suppose Kosaraju’s algorithm finds k SCCs. Up to how many vertices can be contained inside the largest SCC? Give your answer in terms of n, e, and/or k."
          ],
          steps: [
            {
              title: 'Starve the others',
              prompt: 'Every SCC needs at least one vertex. How do you make one SCC as big as possible?',
              simple:
                'Give each of the other k − 1 SCCs just one vertex. Everything left goes into the big one: n − (k − 1) = n − k + 1.',
              figure: F.sccBlobs(),
              reveal: ['e doesn’t matter. The question lets you use it, but you don’t need it.']
            }
          ],
          key: { gist: 'n − k + 1', body: [] }
        },
        {
          id: 'c',
          name: 'Huffman: bits for E',
          points: 2,
          ask: [
            "A document consists of symbols A, B, C, D, E with frequencies 2, 2, 2<sup>2</sup>, 2<sup>3</sup>, 2<sup>4</sup> respectively. When applying Huffman encoding to these letters, E requires <span class=\"blank\"></span> bit(s)."
          ],
          steps: [
            {
              title: 'Run Huffman',
              prompt:
                'Frequencies are 2, 2, 4, 8, 16. Huffman always merges the two smallest. Do it by hand. How deep does E end up?',
              choices: ['1', '2', '4'],
              correct: 0,
              simple:
                'A + B = 4. That + C = 8. That + D = 16. That + E = 32. E joins at the very last merge, right under the root, so it gets 1 bit.',
              figure: F.huffman(),
              reveal: ['A letter’s code length is its depth in the tree. Codes: E = 0, D = 10, C = 110, B = 1110, A = 1111.']
            }
          ],
          key: { gist: '1 bit', body: [] }
        },
        {
          id: 'd',
          name: 'MSTs share edge weights',
          points: 2,
          ask: [
            "If a connected graph has multiple MSTs, every MST uses exactly the same number of edges of each weight. (For example, if one MST uses three edges of weight 5, then every MST uses exactly three edges of weight 5.)",
            "True or False?"
          ],
          steps: [
            {
              title: 'Think like Kruskal',
              prompt:
                'Kruskal goes through edges from lightest to heaviest. Different MSTs come from breaking ties differently. Can tie-breaking change how many weight-w edges get used?',
              choices: TF,
              correct: 0,
              simple:
                'True. After Kruskal finishes all edges of weight ≤ w, the groups of connected vertices are the same no matter how ties were broken. So every MST adds the same number of edges at each weight.',
              reveal: [
                'You might pick DIFFERENT weight-w edges, but always the same NUMBER of them. That number is how many groups get merged at weight w, which doesn’t depend on tie-breaking.'
              ]
            }
          ],
          key: { gist: 'True', body: [] }
        },
        {
          id: 'e1',
          name: 'DAGs with one topological order',
          points: 2,
          ask: [
            "Consider a DAG on vertices {1, 2, …, n}.",
            "(i) How many distinct simple DAGs have exactly one topological order, namely 1, 2, …, n? Express your answer as a function of n. Hint: Your answer may be expressed as a power of 2."
          ],
          steps: [
            {
              title: 'Which edges are forced?',
              prompt: 'If the only order is 1, 2, …, n, what stops you from swapping 1 and 2? Or 2 and 3?',
              simple:
                'An edge between them. Every neighbor pair needs its edge: 1→2, 2→3, …, (n−1)→n. Without edge i→i+1, you could swap i and i+1 and get a second order.',
              figure: F.dagChain()
            },
            {
              title: 'Count the free choices',
              prompt:
                'Every other edge must point forward (i→j with i < j). How many of those are left, and how many ways can you choose them?',
              simple:
                'There are n(n−1)/2 forward pairs in total. Take away the n − 1 forced ones and (n−1)(n−2)/2 are left. Each is in or out, so the answer is 2<sup>(n−1)(n−2)/2</sup>.',
              reveal: [
                'Why can’t an optional edge break anything? It points forward, and the chain already pins down the exact order. Extra forward edges just agree with it.'
              ]
            }
          ],
          key: { gist: '2<sup>(n−1)(n−2)/2</sup>', body: [] }
        },
        {
          id: 'e2',
          name: 'Draw a DAG with two orders',
          points: 2,
          ask: [
            "Consider a DAG on vertices {1, 2, …, n}.",
            "(ii) Draw an example (with n = 4) of a DAG which has exactly two topological orders, one of which is 1, 2, 3, 4. Label the vertices and edges clearly."
          ],
          steps: [
            {
              title: 'Loosen one link',
              prompt:
                'Start from the chain 1→2→3→4 (one order). Remove one link so exactly one swap becomes possible. What do you need to add so nothing else can move?',
              simple:
                'Drop 2→3 so 2 and 3 can swap. Then add 1→3 and 2→4 so 1 stays first and 4 stays last. Edges: (1,2), (1,3), (2,4), (3,4).',
              figure: F.dagDiamond()
            }
          ],
          key: { gist: 'Edges (1,2), (1,3), (2,4), (3,4)', body: ['The two orders are 1, 2, 3, 4 and 1, 3, 2, 4.'] }
        },
        {
          id: 'e3',
          name: 'Count DAGs with two orders (hard)',
          points: 2,
          ask: [
            "Consider a DAG on vertices {1, 2, …, n}.",
            "(iii) Challenging: For n ≥ 3, how many distinct simple DAGs have exactly two topological orders, one of which is 1, 2, …, n? Give your answer as a function of n."
          ],
          steps: [
            {
              title: 'What does the second order look like?',
              prompt: 'Why must the second order be 1, 2, …, n with exactly one neighboring pair swapped?',
              simple:
                'If two separate pairs could each swap, you’d get 4 orders, not 2. So exactly one pair is “free”, and it has to be neighbors: k and k + 1, for some k from 1 to n − 1.',
              reveal: ['That also means the edge k→k+1 must be missing. If it existed, they couldn’t swap.']
            },
            {
              title: 'Which edges are forced now?',
              prompt: 'For a given k, which edges must exist, and which must not?',
              simple:
                'All the chain edges except k→k+1 (which must be missing), plus two extra edges so that nothing else can move: (k−1)→(k+1) and k→(k+2).',
              figure: F.dagSwap(),
              reveal: [
                'At the ends (k = 1 or k = n − 1), one of those extra edges doesn’t exist. So n pairs are decided: n − 1 chain pairs (one of them decided as “absent”) plus 1 extra.',
                'In the middle (2 ≤ k ≤ n − 2), both extras exist, so n + 1 pairs are decided.'
              ]
            },
            {
              title: 'Add it up',
              prompt: 'Every undecided forward pair is optional. Count, then simplify.',
              simple:
                'Ends: 2 choices of k, each with 2<sup>C(n,2) − n</sup> DAGs. Middle: n − 3 choices, each with 2<sup>C(n,2) − n − 1</sup>. Pull out 2<sup>C(n,2) − n − 1</sup>: 2·2 + (n − 3) = n + 1. Total: (n + 1) · 2<sup>(n² − 3n − 2)/2</sup>.'
            }
          ],
          key: { gist: '(n + 1) · 2<sup>(n² − 3n − 2)/2</sup>', body: [] }
        },
        {
          id: 'f',
          name: 'Negate weights + Kruskal',
          points: 2,
          ask: [
            "Consider the following algorithm to construct the maximal spanning tree: Negate each edge and run Kruskal’s algorithm. The algorithm always correctly returns the maximal spanning tree.",
            "True or False?"
          ],
          steps: [
            {
              title: 'Does Kruskal care about negatives?',
              prompt: 'Kruskal sorts edges and adds ones that don’t make a cycle. Does anything break when weights are negative?',
              choices: TF,
              correct: 0,
              simple:
                'True. Negating turns the biggest weights into the smallest. Kruskal only compares weights with each other, so negative numbers are fine.',
              reveal: ['Contrast with Dijkstra, which DOES break on negative weights. Kruskal and Prim work with any real numbers.']
            }
          ],
          key: { gist: 'True', body: [] }
        },
        {
          id: 'g',
          name: 'Negate weights + Bellman-Ford',
          points: 2,
          ask: [
            "Recall that a simple path is a path with no repeated vertices. Consider the following procedure to construct the longest simple path from s to t: negate each edge, then run Bellman-Ford, the algorithm for shortest paths in graphs with negative edges. This procedure always correctly returns the longest simple path from s to t.",
            "True or False?"
          ],
          steps: [
            {
              title: 'What about cycles?',
              prompt: 'Suppose the graph has a cycle with positive total weight. What happens after negating?',
              choices: TF,
              correct: 1,
              simple:
                'False. That cycle becomes a negative cycle, and Bellman-Ford just reports “no shortest path” because you could loop forever. Longest simple path is NP-hard, so no easy trick like this solves it.',
              figure: F.negCycle(),
              reveal: ['It does work on a DAG (no cycles at all). That’s the one case where “negate and find shortest” is correct.']
            }
          ],
          key: { gist: 'False', body: [] }
        },
        {
          id: 'h1',
          name: 'Add a constant to every edge',
          points: 2,
          ask: [
            "Consider a graph G = (V, E) with a unique shortest path from source s to target t.",
            "(i) Let G contain potentially negative edge weights. Consider the following fix: increase each edge weight by |min<sub>(u,v)∈E</sub> w(u, v)|, so that all weights become nonnegative. Running Dijkstra’s algorithm on this modified graph will always yield the same shortest path on the original graph.",
            "True or False?"
          ],
          steps: [
            {
              title: 'Who gets hurt more?',
              prompt: 'Add the same amount to every edge. Does a 1-edge path or a 3-edge path get more expensive?',
              choices: TF,
              correct: 1,
              simple:
                'False. Adding c to every edge adds c × (number of edges) to a path. Paths with more edges get punished more, so the winner can change.',
              figure: F.addConstant(),
              reveal: ['Multiplying every weight by a positive number is safe, because all paths scale the same. Adding is not.']
            }
          ],
          key: { gist: 'False', body: [] }
        },
        {
          id: 'h2',
          name: 'Multiply every edge by −1',
          points: 2,
          ask: [
            "Consider a graph G = (V, E) with a unique shortest path from source s to target t.",
            "(ii) Let G contain only negative edge weights. Consider the following fix: multiply each edge weight by −1, so that all weights become nonnegative. Running Dijkstra’s algorithm on this modified graph will always yield the same shortest path on the original graph.",
            "True or False?"
          ],
          steps: [
            {
              title: 'What does −1 do to the order?',
              prompt: 'If path P was shorter than path Q before, what about after multiplying everything by −1?',
              choices: TF,
              correct: 1,
              simple:
                'False. Multiplying by −1 flips every comparison: the shortest path becomes the longest and vice versa. Dijkstra would find the path that was LONGEST in the original.'
            }
          ],
          key: { gist: 'False', body: [] }
        }
      ],
      takeaway: [
        'DFS intervals are like parentheses: nested or separate, never partly overlapping.',
        'Kruskal and Prim are fine with negative weights. Dijkstra is not.',
        'Adding a constant to every edge can change shortest paths. Multiplying by a positive constant can’t.',
        'Longest simple path is NP-hard, so be suspicious of any easy trick for it.'
      ]
    },

    // ------------------------------------------------------------------ Q3
    {
      number: 3,
      title: 'All about pre and post values',
      points: 13,
      topics: ['DFS', 'pre/post numbers', 'edge types'],
      preamble: [
        "Suppose G is a directed graph on 6 vertices, and you are given only the following 5 pre and post values for DFS performed on G. Note that you cannot make any assumptions on what order the vertices were visited (i.e., what order neighbors were visited when exploring any vertex)."
      ],
      table: {
        head: ['vertex', 'pre', 'post'],
        rows: [
          ['u', '2', '7'],
          ['v', '4', '5'],
          ['w', '3', '6'],
          ['x', '1', '8'],
          ['y', '9', '12'],
          ['z', '?', '?']
        ]
      },
      parts: [
        {
          id: 'a',
          name: 'Is x an ancestor of w?',
          points: 2,
          ask: [
            "True or False: x is an ancestor of w in the DFS tree."
          ],
          steps: [
            {
              title: 'Draw the bars',
              prompt: 'Draw each vertex as a bar from pre to post. Does x’s bar contain w’s?',
              choices: TF,
              correct: 0,
              simple: 'True. x = [1, 8] completely contains w = [3, 6]. Bar inside bar means descendant.',
              figure: F.q3Intervals(false),
              reveal: ['The rule: a is an ancestor of b exactly when pre[a] < pre[b] < post[b] < post[a].']
            }
          ],
          key: { gist: 'True', body: [] }
        },
        {
          id: 'b',
          name: 'What kind of edge is (u, v)?',
          points: 2,
          ask: [
            "For this part only, suppose you also know (u, v) ∈ E. What type of edge is (u, v)?",
            "Tree / Forward / Cross / Back"
          ],
          steps: [
            {
              title: 'Is u above v?',
              prompt: 'Compare u = [2, 7] and v = [4, 5]. What does that tell you?',
              simple:
                'u’s bar contains v’s, so u is an ancestor of v. An edge going down the tree is either a tree edge or a forward edge.'
            },
            {
              title: 'Child or grandchild?',
              prompt: 'A tree edge means v is u’s direct child with nothing in between. Is anything between them?',
              choices: ['Tree', 'Forward', 'Cross', 'Back'],
              correct: 1,
              simple:
                'Yes, w = [3, 6] sits between them: inside u, containing v. So v is u’s grandchild, and an edge that skips a level is a forward edge.',
              figure: F.q3Tree(true)
            }
          ],
          key: { gist: 'Forward edge', body: [] }
        },
        {
          id: 'c',
          name: 'Find z’s numbers',
          points: 2,
          ask: [
            "Fill in the missing pre and post values for the last vertex z."
          ],
          steps: [
            {
              title: 'Which numbers are missing?',
              prompt: '6 vertices × 2 numbers = 12, so pre/post use each of 1…12 exactly once. Which are unused?',
              simple: 'Used: 1 through 9, and 12. Missing: 10 and 11. So pre[z] = 10 and post[z] = 11.',
              figure: F.q3Intervals(true),
              reveal: ['That also puts z inside y’s bar [9, 12], so z is y’s descendant.']
            }
          ],
          key: { gist: 'pre[z] = 10, post[z] = 11', body: [] }
        },
        {
          id: 'd',
          name: 'Which edges must exist?',
          points: 4,
          ask: [
            "List all directed edges that must exist in G, based solely on the given pre and post values."
          ],
          steps: [
            {
              title: 'Back-to-back pre numbers',
              prompt:
                'x has pre 1 and u has pre 2. The very next thing DFS did after entering x was enter u. How is that possible?',
              simple:
                'DFS only enters a new vertex by walking along an edge from where it currently is. Going straight from x to u means edge x → u must exist.',
              reveal: ['Same logic for u (2) → w (3), w (3) → v (4), and y (9) → z (10).']
            },
            {
              title: 'Anything else?',
              prompt: 'Is any other edge forced?',
              simple: 'No. Other edges might exist, but nothing forces them. Must-exist edges: (x, u), (u, w), (w, v), (y, z).',
              figure: F.q3Tree(false),
              reveal: ['Why no edge into y? y starts a brand-new DFS tree at time 9 (x already finished at 8). Nothing had to point to it.']
            }
          ],
          key: { gist: '(x, u), (u, w), (w, v), (y, z)', body: [] }
        },
        {
          id: 'e',
          name: 'Could the graph be undirected?',
          points: 3,
          ask: [
            "True or False: There exists an undirected graph G′ such that {z, x} ∈ E and the given pre and post values are valid for some DFS on G′."
          ],
          steps: [
            {
              title: 'Would DFS skip a neighbor?',
              prompt:
                'In an undirected graph, if z and x are neighbors, can DFS finish x completely without ever visiting z?',
              choices: TF,
              correct: 1,
              simple:
                'No, so the answer is False. When DFS explores x it looks at all of x’s neighbors, including z, and would visit z before x finishes at time 8. But z isn’t visited until time 10.',
              reveal: ['Another way to see it: z → x would be a cross edge. Undirected DFS never has cross edges, only tree edges and back edges.']
            }
          ],
          key: { gist: 'False', body: [] }
        }
      ],
      takeaway: [
        'Draw pre/post as bars on a timeline, and the DFS tree jumps out.',
        'Back-to-back pre numbers (p and p + 1) mean a tree edge.',
        'Edge types: tree/forward point into a nested bar, back points out to an enclosing bar, cross points to an earlier separate bar.',
        'Undirected DFS has no cross edges.'
      ]
    },

    // ------------------------------------------------------------------ Q4
    {
      number: 4,
      title: 'Melting icebergs',
      points: 24,
      topics: ['DFS/BFS', 'super-source', 'MST', 'Kruskal'],
      preamble: [
        "The penguins of PNP are in danger! As rising temperatures are causing their iceberg island homes to melt, each penguin must try to slide to safety. There are k penguins in total, each starting from their unique iceberg island home."
      ],
      parts: [
        {
          id: 'a',
          name: 'Can any penguin survive?',
          points: 12,
          ask: [
            "Let us model the situation as a directed graph G = (V, E), where each vertex v ∈ V represents an iceberg. If there exists a directed edge (u, v) ∈ E, then a penguin can slide from iceberg u to iceberg v.",
            "An iceberg is considered safe if it has no outgoing edges (i.e., penguins that reach it cannot slide anywhere else). A penguin survives if it can eventually reach a safe iceberg.",
            "Design an algorithm to determine if there is at least one penguin that can survive. Your algorithm should have a runtime of O(|V| + |E|). Briefly justify the runtime of your algorithm.",
            "Correct algorithms with runtime O(k(|V| + |E|)) will receive partial credit."
          ],
          formal: {
            input: [
              "A directed graph G = (V, E).",
              "A subset P ⊆ V of size |P| = k consisting of the starting nodes of each penguin."
            ],
            output: "Whether or not there exists a penguin that can make it to a safe iceberg."
          },
          figure: F.penguins(false),
          steps: [
            {
              title: 'Say it in graph words',
              prompt: 'A vertex with no outgoing edges has a name. What is the question really asking?',
              simple: 'A vertex with no outgoing edges is a sink. The question is whether any penguin’s starting vertex can reach any sink.'
            },
            {
              title: 'The slow way',
              prompt: 'Obvious approach: one DFS from each penguin. How long does that take?',
              simple:
                'k searches × O(|V| + |E|) each = O(k(|V| + |E|)). That’s correct but too slow, and only gets partial credit.'
            },
            {
              title: 'One search for everybody',
              prompt: 'How can one single DFS start from all k penguins at the same time?',
              simple:
                'Add a fake vertex s with an edge to every penguin’s iceberg. One DFS from s explores everything any penguin could reach.',
              figure: F.penguins(true),
              reveal: [
                'This is the “many starts → one start” trick. Same flavor as Q8: change the graph so that one search does the job of many.'
              ]
            },
            {
              title: 'Check, and state the runtime',
              prompt: 'What do you look for during the DFS? What’s the runtime?',
              simple:
                'If DFS reaches any vertex with no outgoing edges (other than s), answer Yes. Otherwise No. The new graph has 1 extra vertex and k ≤ |V| extra edges, so it’s still O(|V| + |E|).',
              pitfall: 'The question asks for the runtime justification, so don’t skip it. One sentence is enough: “k ≤ |V| added edges, so DFS is still O(|V| + |E|).”'
            }
          ],
          key: {
            gist: 'Add a super-source s → every penguin. DFS from s. Answer Yes if you reach a vertex with no outgoing edges.',
            body: ['Adding s costs 1 vertex and k ≤ |V| edges, so one DFS is O(|V| + |E|).'],
            runtime: 'O(|V| + |E|)'
          }
        },
        {
          id: 'b',
          name: 'Bridges: must-build and can’t-build',
          points: 12,
          ask: [
            "A few of the penguins survived! The survivors now inhabit a subset S ⊆ V of the original icebergs. However, all of the routes between the icebergs melted away, so the penguins want to build two-way bridges between icebergs such that they can travel from any iceberg to any other iceberg. Define the set of all unordered pairs of icebergs to be Pairs(S) = {{u, v} | u, v ∈ S}.",
            "To ensure safety and order in this iceberg bridge construction project, the PNP safety council has imposed two restrictions:<ul><li>For pairs of icebergs {u, v} ∈ M ⊆ Pairs(S), a bridge {u, v} must be built.</li><li>For pairs of icebergs {a, b} ∈ F ⊆ Pairs(S), a bridge {a, b} is forbidden from being built.</li></ul>",
            "Furthermore, for each potential bridge {u, v}, building it incurs a cost c({u, v}). Design an algorithm to return the minimum total cost of building all the necessary bridges. Your algorithm can return -1 if it is impossible to satisfy the constraints. (No proof or runtime analysis needed.)"
          ],
          formal: {
            input: [
              "A set of vertices S.",
              "A cost c({u, v}) for each possible bridge {u, v} ∈ Pairs(S).",
              "A set of mandatory bridges M ⊆ Pairs(S).",
              "A set of forbidden bridges F ⊆ Pairs(S)."
            ],
            output: "The minimum total cost of building bridges such that any iceberg v ∈ S can reach any other iceberg v′ ∈ S, obeying the constraints that mandatory bridges must be built, and forbidden bridges must not be built. Return -1 if impossible."
          },
          steps: [
            {
              title: 'What shape is the cheapest answer?',
              prompt: 'Ignoring the rules, what’s the cheapest way to connect everything called?',
              simple: 'A minimum spanning tree (MST). The rules just tweak it a little.'
            },
            {
              title: 'Forbidden bridges',
              prompt: 'How do you make sure a forbidden bridge never gets picked?',
              simple: 'Delete those edges (or set their cost to ∞). Then Kruskal can never pick them.'
            },
            {
              title: 'Mandatory bridges',
              prompt: 'Kruskal adds edges cheapest-first, skipping ones that make a cycle. How do you force M in?',
              simple:
                'Add them first. Before Kruskal starts, put every mandatory bridge into your answer and union its endpoints. Then run Kruskal normally on everything else.',
              figure: F.mstMandatory(),
              reveal: [
                'Kruskal works fine when it starts from some edges already chosen: it just keeps going greedily from there.',
                'Alternative from the key: shrink each group joined by mandatory bridges into one vertex, then run a normal MST.',
                'If M has a cycle, you still have to build all of it and pay for everything in M.'
              ]
            },
            {
              title: 'When is it impossible?',
              prompt: 'How do you detect the −1 case, and what do you return otherwise?',
              simple:
                'If after Kruskal not everything is connected (you’d need a forbidden bridge), return −1. Otherwise return cost(M) + the cost of the edges Kruskal added.'
            }
          ],
          key: {
            gist: 'Delete forbidden bridges, add mandatory ones first, then finish with Kruskal. Return −1 if it doesn’t connect everything.',
            body: ['Runtime is Kruskal’s: sorting all |S|<sup>2</sup> possible bridges dominates.'],
            runtime: 'O(|S|<sup>2</sup> log |S|)'
          }
        }
      ],
      takeaway: [
        'Many starting points? Add one super-source with an edge to each.',
        'MST with forced edges: add them first, then continue Kruskal. Forbidden edges: delete them.',
        'Sink = vertex with no outgoing edges.'
      ]
    },

    // ------------------------------------------------------------------ Q5
    {
      number: 5,
      title: 'Playing with polynomials',
      points: 20,
      topics: ['divide and conquer', 'Karatsuba', 'Master theorem'],
      parts: [
        {
          id: 'a',
          name: 'Three multiplications instead of four',
          points: 5,
          ask: [
            "Consider two polynomials, A(x) = a<sub>0</sub> + a<sub>1</sub>x and B(x) = b<sub>0</sub> + b<sub>1</sub>x. The product A(x)B(x) = a<sub>0</sub>b<sub>0</sub> + (a<sub>1</sub>b<sub>0</sub> + a<sub>0</sub>b<sub>1</sub>)x + a<sub>1</sub>b<sub>1</sub>x<sup>2</sup> can be naively computed by performing four multiplications: a<sub>0</sub>b<sub>0</sub>, a<sub>1</sub>b<sub>0</sub>, a<sub>0</sub>b<sub>1</sub>, and a<sub>1</sub>b<sub>1</sub>.",
            "Alternatively, a<sub>0</sub>b<sub>0</sub> + (a<sub>1</sub>b<sub>0</sub> + a<sub>0</sub>b<sub>1</sub>)x + a<sub>1</sub>b<sub>1</sub>x<sup>2</sup> can be computed using only three multiplications. List the three products in terms of a<sub>0</sub>, a<sub>1</sub>, b<sub>0</sub>, and b<sub>1</sub>."
          ],
          steps: [
            {
              title: 'Multiply the sums',
              prompt:
                'You need a<sub>0</sub>b<sub>0</sub>, a<sub>1</sub>b<sub>1</sub>, and the middle a<sub>1</sub>b<sub>0</sub> + a<sub>0</sub>b<sub>1</sub>. Expand (a<sub>0</sub> + a<sub>1</sub>)(b<sub>0</sub> + b<sub>1</sub>). What do you notice?',
              simple:
                'It equals a<sub>0</sub>b<sub>0</sub> + a<sub>0</sub>b<sub>1</sub> + a<sub>1</sub>b<sub>0</sub> + a<sub>1</sub>b<sub>1</sub>: the middle term, plus two products you already have!',
              figure: F.karatsubaGrid()
            },
            {
              title: 'So the three are…',
              prompt: 'Write the three products and how to get the middle term.',
              simple:
                'a<sub>0</sub>b<sub>0</sub>, a<sub>1</sub>b<sub>1</sub>, and (a<sub>0</sub> + a<sub>1</sub>)(b<sub>0</sub> + b<sub>1</sub>). Middle = third − first − second.',
              reveal: ['This is Karatsuba’s trick, the same one from integer multiplication in lecture 2.']
            }
          ],
          key: {
            gist: 'a<sub>0</sub>b<sub>0</sub>, a<sub>1</sub>b<sub>1</sub>, (a<sub>0</sub> + a<sub>1</sub>)(b<sub>0</sub> + b<sub>1</sub>)',
            body: []
          }
        },
        {
          id: 'b',
          name: 'Multiply big polynomials fast',
          points: 11,
          ask: [
            "Design an efficient algorithm to compute the product of the polynomials A(x) and B(x), both of degree n. You may assume for simplicity that n is of the form 2<sup>i</sup> − 1 for some positive integer i. Your algorithm should have a runtime of O(n<sup>log<sub>2</sub> 3</sup>). (No proof needed.)"
          ],
          formal: {
            input: [
              "A(x) and B(x), specified by their coefficients, a<sub>0</sub>, …, a<sub>n</sub> and b<sub>0</sub>, …, b<sub>n</sub>, respectively."
            ],
            output: "A(x)B(x), specified by its coefficients."
          },
          steps: [
            {
              title: 'Split each polynomial in half',
              prompt: 'A has n + 1 coefficients. How can you write it using two half-size polynomials?',
              simple:
                'A(x) = A<sub>0</sub>(x) + A<sub>1</sub>(x) · x<sup>m</sup>, with m = (n + 1)/2. A<sub>0</sub> is the low half of the coefficients and A<sub>1</sub> is the high half. Same for B.',
              figure: F.polySplit()
            },
            {
              title: 'It’s part (a) again',
              prompt: 'Multiply out (A<sub>0</sub> + A<sub>1</sub>x<sup>m</sup>)(B<sub>0</sub> + B<sub>1</sub>x<sup>m</sup>). Does it look familiar?',
              simple:
                'A<sub>0</sub>B<sub>0</sub> + (A<sub>0</sub>B<sub>1</sub> + A<sub>1</sub>B<sub>0</sub>)x<sup>m</sup> + A<sub>1</sub>B<sub>1</sub>x<sup>2m</sup>. That’s the exact shape of part (a), with polynomials in place of numbers. So 3 recursive multiplications: A<sub>0</sub>B<sub>0</sub>, A<sub>1</sub>B<sub>1</sub>, and (A<sub>0</sub> + A<sub>1</sub>)(B<sub>0</sub> + B<sub>1</sub>).'
            },
            {
              title: 'Put it back together',
              prompt: 'How do you combine the three results? And what’s the base case?',
              simple:
                'Middle = (A<sub>0</sub> + A<sub>1</sub>)(B<sub>0</sub> + B<sub>1</sub>) − A<sub>0</sub>B<sub>0</sub> − A<sub>1</sub>B<sub>1</sub>. Add the three pieces, with the middle shifted by x<sup>m</sup> and A<sub>1</sub>B<sub>1</sub> shifted by x<sup>2m</sup>. Shifting just slides coefficients over. Base case: degree 1, do part (a) directly.'
            }
          ],
          key: {
            gist: 'Split in half, make 3 recursive multiplications (Karatsuba), combine with additions and shifts.',
            body: []
          }
        },
        {
          id: 'c',
          name: 'Runtime',
          points: 4,
          ask: [
            "Analyze the runtime of your algorithm."
          ],
          steps: [
            {
              title: 'Write the recurrence',
              prompt: 'How many recursive calls, of what size, and how much extra work?',
              simple: '3 calls on half-size polynomials, plus O(n) for adding, subtracting, and shifting. T(n) = 3T(n/2) + O(n).'
            },
            {
              title: 'Solve it',
              prompt: 'a = 3, b = 2, d = 1. Which Master theorem case?',
              choices: ['O(n log n)', 'O(n<sup>log<sub>2</sub> 3</sup>)', 'O(n<sup>2</sup>)'],
              correct: 1,
              simple:
                'log<sub>2</sub> 3 ≈ 1.58, which is bigger than d = 1, so the bottom of the tree wins: O(n<sup>log<sub>2</sub> 3</sup>) ≈ O(n<sup>1.58</sup>). Better than the naive O(n<sup>2</sup>).',
              figure: F.recTree(
                [
                  { count: 1, label: 'n', cost: 'n' },
                  { count: 3, label: 'n/2', cost: '3n/2' },
                  { count: 9, label: 'n/4', cost: '9n/4' }
                ],
                'Grows every level, so the leaves win: n^{log₂ 3}'
              )
            }
          ],
          key: { gist: 'T(n) = 3T(n/2) + O(n) = O(n<sup>log<sub>2</sub> 3</sup>)', body: [] }
        }
      ],
      takeaway: [
        'Karatsuba: 4 multiplications → 3, by computing (a<sub>0</sub> + a<sub>1</sub>)(b<sub>0</sub> + b<sub>1</sub>) and subtracting.',
        '3T(n/2) + O(n) = O(n<sup>log<sub>2</sub> 3</sup>).',
        'Polynomial multiplication is integer multiplication without the carries.'
      ]
    },

    // ------------------------------------------------------------------ Q6
    {
      number: 6,
      title: 'Maximizing subarrays',
      points: 26,
      topics: ['max subarray', 'Kadane', 'divide and conquer', 'absolute-value trick'],
      parts: [
        {
          id: 'a',
          name: 'Maximum subarray sum',
          points: 7,
          ask: [
            "Given an array A = [A[1], A[2], …, A[n]] of n integers, the maximum subarray sum is the largest sum of any contiguous subarray of A (including the empty subarray, in which case the sum will be 0). In other words, the maximum subarray sum is:",
            "<span class=\"math\">max<sub>1≤i≤j≤n+1</sub> Σ<sub>k=i</sub><sup>j−1</sup> A[k]</span>",
            "For example, the maximum subarray sum of [−2, 1, −3, 4, −1, 2, 1, −5, 4] is 6, the sum of the contiguous subarray [4, −1, 2, 1]. Design an efficient algorithm that finds the maximum subarray sum."
          ],
          formal: {
            input: [
              "An array A = [A[1], A[2], …, A[n]] of n integers."
            ],
            output: "max<sub>1≤i≤j≤n+1</sub> Σ<sub>k=i</sub><sup>j−1</sup> A[k]."
          },
          steps: [
            {
              title: 'Get a feel for it',
              prompt: 'Find the best stretch in the example by eye. Anything surprising about it?',
              simple:
                '[4, −1, 2, 1] = 6. It includes a −1! Sometimes you take a small loss to connect two good parts.',
              figure: F.subarrayBars()
            },
            {
              title: 'Best sum ending right here',
              prompt:
                'Walk left to right. Say you know the best sum of a stretch ending at position i − 1. What’s the best stretch ending at position i?',
              simple:
                'Either extend the previous stretch (previous best + A[i]) or start fresh at A[i], whichever is bigger. If the running total goes negative, it’s dead weight, so drop it. This is Kadane’s algorithm.',
              figure: F.kadaneRow(),
              reveal: ['best[i] = max(best[i − 1] + A[i], A[i]). Answer = the largest best[i], or 0 if everything is negative (empty subarray).']
            },
            {
              title: 'The divide-and-conquer version',
              prompt: 'The course (discussion 2) did this with divide and conquer. Where can the best subarray be, relative to the middle?',
              simple:
                'Entirely in the left half, entirely in the right half, or crossing the middle. Recurse on the halves. The crossing one = best suffix of the left + best prefix of the right, found with two O(n) sweeps.',
              reveal: [
                'The key accepts either version. DP hadn’t been taught yet, so wrong Kadane attempts got no partial credit.'
              ]
            }
          ],
          key: {
            gist: 'Kadane: best ending at i = max(best at i − 1 + A[i], A[i]); answer is the max of those (or 0). Or divide and conquer.',
            body: []
          }
        },
        {
          id: 'b',
          name: 'Runtime',
          points: 4,
          ask: [
            "Analyze the runtime of your algorithm."
          ],
          steps: [
            {
              title: 'Count it',
              prompt: 'What’s the runtime of each version?',
              simple:
                'Kadane: one pass with O(1) work per element, so O(n). Divide and conquer: T(n) = 2T(n/2) + O(n) = O(n log n).'
            }
          ],
          key: { gist: 'O(n) for Kadane, O(n log n) for divide and conquer', body: [] }
        },
        {
          id: 'c',
          name: 'The 2D version',
          points: 12,
          ask: [
            "Let A be a length-n array of two-dimensional vectors of the form (x, 0) or (0, y). We denote the i’th element of the array to be (A[i, 1], A[i, 2]) where either A[i, 1] or A[i, 2] is 0 (or possibly both).",
            "The size of an empty array is 0. For 1 ≤ i ≤ j ≤ n + 1, the size of the corresponding non-empty subarray is given by",
            "<span class=\"math\">size(A, i, j) = |Σ<sub>k=i</sub><sup>j−1</sup> A[k, 1]| + |Σ<sub>k=i</sub><sup>j−1</sup> A[k, 2]|</span>",
            "As an example, consider A = [(0, −5), (0, 4), (3, 0), (0, 2), (−7, 0), (1, 0)]. The maximum size of A is |3 + (−7)| + |4 + 2| = 10 and is given by the contiguous subarray [(0, 4), (3, 0), (0, 2), (−7, 0)]. Design an efficient algorithm that finds the maximum subarray size, max<sub>1≤i≤j≤n+1</sub> size(A, i, j)."
          ],
          formal: {
            input: [
              "An array A of n two-dimensional vectors. For any vector (A[k, 1], A[k, 2]) in A, A[k, 1] = 0 or A[k, 2] = 0, or both."
            ],
            output: "max<sub>1≤i≤j≤n+1</sub> size(A, i, j), with the size function defined above."
          },
          steps: [
            {
              title: 'What is “size”, really?',
              prompt: 'Think of each vector as a step on a grid. What does size measure?',
              simple:
                'Start at (0, 0) and take the steps. Size is how far you end up in “taxicab” distance: blocks east/west plus blocks north/south.',
              figure: F.taxiPath()
            },
            {
              title: 'Get rid of the absolute values',
              prompt: '|X| + |Y| is awkward. It equals the max of four plain sums. Which four?',
              simple:
                '|X| + |Y| = max(X + Y, X − Y, −X + Y, −X − Y). One of the four sign choices matches the real signs and gives exactly |X| + |Y|. The others are smaller.',
              figure: F.fourSigns()
            },
            {
              title: 'Each sign choice is part (a)',
              prompt: 'Fix one choice, say X − Y. Over a subarray, X − Y = sum of (x<sub>k</sub> − y<sub>k</sub>). What problem is that?',
              simple:
                'It’s the normal 1D max subarray on the numbers x<sub>k</sub> − y<sub>k</sub>! Run Kadane once for each of the 4 sign choices and take the biggest answer. O(n).',
              reveal: ['This works because “max over subarrays of max over signs” = “max over signs of max over subarrays”. You can do the maxes in either order.']
            },
            {
              title: 'The key’s version',
              prompt: 'The official key uses divide and conquer instead. How would the crossing case work?',
              simple:
                'Split in half and recurse. For subarrays crossing the middle, sweep outward from the middle on each side, tracking the best x + y, x − y, −x + y, and −x − y. Best crossing = max(L<sub>1</sub> + R<sub>1</sub>, L<sub>2</sub> + R<sub>2</sub>, L<sub>3</sub> + R<sub>3</sub>, L<sub>4</sub> + R<sub>4</sub>). That’s O(n log n).',
              reveal: ['It’s the same four-signs idea used in the merge step. Both are correct, and the 4 × Kadane version is shorter to write.']
            }
          ],
          key: {
            gist: '|X| + |Y| = max of the four ±X ± Y sums, and each is a 1D max subarray. Four Kadanes (O(n)), or the key’s divide and conquer (O(n log n)).',
            body: []
          }
        },
        {
          id: 'd',
          name: 'Runtime of the 2D version',
          points: 3,
          ask: [
            "The runtime of your algorithm is <span class=\"blank\"></span>."
          ],
          steps: [
            {
              title: 'Count it',
              prompt: 'Runtime of each version?',
              simple:
                'Key’s divide and conquer: T(n) = 2T(n/2) + O(n) = O(n log n). Four Kadane passes: O(n). Either is fine as long as it matches your algorithm.'
            }
          ],
          key: { gist: 'O(n log n) for the key’s version, O(n) for 4 × Kadane', body: [] }
        }
      ],
      takeaway: [
        'Max subarray: best ending here = max(previous best + A[i], A[i]).',
        '|X| + |Y| = the max of ±X ± Y over the four sign choices. It turns one absolute-value problem into four ordinary ones.',
        'Divide and conquer on arrays: the answer is in the left half, the right half, or crossing the middle.'
      ]
    },

    // ------------------------------------------------------------------ Q7
    {
      number: 7,
      title: "A gardener's dilemma",
      points: 22,
      topics: ['greedy', 'intervals', 'exchange argument'],
      preamble: [
        "GardenMaster, a renowned landscape designer, is designing an efficient watering system for a long, linear garden path. Along this path, several special flower zones require focused watering. To ensure water is delivered precisely where it is needed, GardenMaster must carefully decide where to place the sprinklers. Here are the details of the setup:<ul><li>There are n flower zones that are each represented by the intervals [l<sub>1</sub>, r<sub>1</sub>], …, [l<sub>n</sub>, r<sub>n</sub>]. Each flower zone [l<sub>i</sub>, r<sub>i</sub>] is contained in the garden path [1, D] (i.e., 1 ≤ l<sub>i</sub> ≤ r<sub>i</sub> ≤ D). Here, D is the total length of the garden. Note that some flower zones may overlap.</li><li>Sprinklers can be placed at any point x ∈ [1, D] along the garden path.</li><li>A sprinkler at position x waters flower zone i if l<sub>i</sub> ≤ x ≤ r<sub>i</sub>.</li></ul>",
        "GardenMaster wants to water all flower zones using the fewest number of sprinklers."
      ],
      parts: [
        {
          id: 'a',
          name: 'Fewest sprinklers',
          points: 12,
          ask: [
            "Design an efficient algorithm to compute the fewest possible number of sprinklers to water all n flower zones and also return the locations of these sprinklers."
          ],
          formal: {
            input: [
              "A set of n intervals {[l<sub>1</sub>, r<sub>1</sub>], [l<sub>2</sub>, r<sub>2</sub>], …, [l<sub>n</sub>, r<sub>n</sub>]} with 1 ≤ l<sub>i</sub> ≤ r<sub>i</sub> ≤ D."
            ],
            output: "Positive integer k and sprinkler locations x<sub>1</sub>, …, x<sub>k</sub> ∈ [1, D] such that every interval [l<sub>i</sub>, r<sub>i</sub>] contains one of the integers x<sub>j</sub>. Moreover, k is the smallest possible such positive integer."
          },
          steps: [
            {
              title: 'Picture it',
              prompt: 'Draw zones as bars on a line. What is a sprinkler in this picture?',
              simple:
                'A vertical line. It waters every bar it crosses. The goal is the fewest vertical lines that hit every bar.'
            },
            {
              title: 'Which zone is most urgent?',
              prompt:
                'Look at the zone that ends first (smallest right end). Some sprinkler has to water it. Where’s the smartest place to put that sprinkler?',
              simple:
                'As far right as possible: right at that zone’s right end. It still waters this zone, and moving right can only catch MORE of the other zones, since they all end later.'
            },
            {
              title: 'Repeat',
              prompt: 'Turn that into an algorithm.',
              simple:
                'Sort zones by right end. Go through them in order. If a zone isn’t watered yet, put a sprinkler at its right end. Return all the sprinklers.',
              figure: F.sprinklers(),
              reveal: ['“Already watered?” is O(1): compare with the last sprinkler placed, since it’s the rightmost one so far. Total O(n log n) for the sort.'],
              pitfall: 'Sorting by left end or by length doesn’t work. Right end is what makes the greedy choice safe.'
            }
          ],
          key: {
            gist: 'Sort by right endpoint. Whenever a zone isn’t watered yet, place a sprinkler at its right end.',
            body: [],
            runtime: 'O(n log n)'
          }
        },
        {
          id: 'b',
          name: 'Prove it’s optimal',
          points: 10,
          ask: [
            "Justify the correctness of your algorithm."
          ],
          steps: [
            {
              title: 'Match greedy’s first move',
              prompt:
                'Take any optimal answer. Its leftmost sprinkler x<sub>1</sub> must water the first-ending zone. Can you slide x<sub>1</sub> to that zone’s right end without breaking anything?',
              simple:
                'Yes. Every zone that x<sub>1</sub> waters starts before x<sub>1</sub> and ends at or after the first zone’s end (nothing ends earlier). So it also contains that end point. Sliding x<sub>1</sub> there loses nothing.',
              figure: F.sprinklerExchange()
            },
            {
              title: 'Finish with induction',
              prompt: 'Now optimal and greedy agree on the first sprinkler. How do you finish?',
              simple:
                'Remove every zone that sprinkler waters. Fewer zones are left, so by induction greedy is optimal on the rest. Add the first sprinkler back: greedy uses the same number as optimal.'
            }
          ],
          key: {
            gist: 'Exchange argument: shift an optimal solution’s first sprinkler to greedy’s choice (no zone lost), then induct on the remaining zones.',
            body: []
          }
        }
      ],
      takeaway: [
        'Interval problems: try sorting by right endpoint first.',
        'Greedy proof recipe: show any optimal answer can be changed to agree with greedy’s first choice without getting worse, then induct.'
      ]
    },

    // ------------------------------------------------------------------ Q8
    {
      number: 8,
      title: "Sasha's party",
      points: 30,
      topics: ['Dijkstra', 'reverse the edges', 'two copies of a graph'],
      preamble: [
        "It’s Sasha’s birthday! Her k friends are traveling by bus to the party, each starting from a bus stop. Unfortunately, Sasha’s friends forgot to buy presents, so each friend must stop at a gift shop on their way to the party. Luckily, there is a subset S of bus stops that are located next to gift shops."
      ],
      parts: [
        {
          id: 'a',
          name: 'Get everyone to the party',
          points: 15,
          ask: [
            "Design an efficient algorithm that returns the shortest amount of time for Sasha’s friends to all reach the party location, while each passing through at least one gift shop. For full credit, your runtime must not depend on k or |S|. (No proof or runtime analysis needed.)"
          ],
          formal: {
            input: [
              "A directed graph G = (V, E), where each vertex v ∈ V represents a bus stop. It is possible to travel from u to v if the directed edge (u, v) is in E.",
              "Positive integer edge weights t(u, v) representing the travel time from u to v.",
              "A subset F ⊆ V of size k representing the initial locations of Sasha’s friends.",
              "A subset S ⊆ V representing bus stops with gift shops.",
              "A vertex p ∈ V representing the party location."
            ],
            output: "The shortest amount of time for Sasha’s friends to all arrive at p, given that each one has to pass through at least one gift shop."
          },
          figure: F.q8Problem(),
          steps: [
            {
              title: 'Sum, max, or min?',
              prompt: 'Friends travel at the same time. If friend f needs T(f), what single number is the answer?',
              choices: ['Sum of all T(f)', 'Max of T(f)', 'Min of T(f)'],
              correct: 1,
              simple: 'The max. Everyone travels at once, so the party starts when the slowest friend arrives.'
            },
            {
              title: 'The slow way',
              prompt: 'Obvious approach: one Dijkstra per friend. What’s wrong with that?',
              simple:
                'It works, but costs k Dijkstras, and the question forbids depending on k. That’s the hint: they want ONE Dijkstra total.',
              pitfall: 'Any solution that loops over friends or over gift shops has missed the point of the question.'
            },
            {
              title: 'Flip the arrows',
              prompt:
                'Dijkstra gives distances FROM one start to everything. You need distances from many friends TO one party. How do you turn that around?',
              simple:
                'Reverse every edge. In the flipped graph, the distance from p to f equals the real distance from f to p. One Dijkstra from p gives every friend’s distance at once.',
              figure: F.q8Reversed(),
              reveal: ['Use this whenever the one special vertex is the destination and the many vertices are starting points.']
            },
            {
              title: 'Force a stop at a gift shop',
              prompt:
                'Plain Dijkstra ignores the shops. Each traveler needs to remember one yes/no fact. What is it, and how can a graph “remember” it?',
              simple:
                'The fact is “have I got a gift yet?”. Make two copies of the (reversed) graph, one for “no gift yet” and one for “got a gift”. The only way from the first copy to the second is a 0-cost edge at a gift shop.',
              figure: F.q8Layers(),
              reveal: [
                'Any path that ends in the “got a gift” copy MUST have crossed at a gift shop. The crossing costs 0, so travel times aren’t changed.'
              ],
              pitfall: 'The crossing edges go one way only (no-gift → got-gift). If they went both ways, a path could cross down and back up and skip the shop.'
            },
            {
              title: 'Read off the answer',
              prompt: 'You run Dijkstra from p in the “no gift yet” copy. Where do you read each friend’s time?',
              simple:
                'At each friend in the “got a gift” copy. Answer = the max of those. If some friend can’t be reached there, the answer is ∞.',
              pitfall: 'Reading friends in the top copy gives the no-gift distance and silently drops the rule.'
            },
            {
              title: 'Runtime',
              prompt: 'How big is the new graph, and what’s the total runtime?',
              simple:
                '2|V| vertices and 2|E| + |S| edges, which is just a constant times bigger. One Dijkstra: O((|V| + |E|) log |V|). No k and no |S|.'
            }
          ],
          key: {
            gist: 'Two reversed copies of G, joined by 0-cost edges at the gift shops. One Dijkstra from p in the first copy. Answer = max distance to the friends in the second copy.',
            body: [
              'Reversing lets you run Dijkstra once from the party instead of k times from the friends.',
              'The one-way crossing edges force every friend’s path to have visited a gift shop.'
            ],
            runtime: 'O((|V| + |E|) log |V|)'
          }
        },
        {
          id: 'b',
          name: 'Get Sasha home',
          points: 15,
          ask: [
            "Sasha is heading home from her party, but some of the buses have ended their operation for the day. For each pair of bus stops (u, v), Sasha knows whether she can take the bus from u to v, or if she will need to walk from u to v. She also knows the travel time from u to v. There is only one possible mode of transportation (bus or walk) from u to v.",
            "Design an efficient algorithm that returns the path from the party to Sasha’s home that minimizes her total travel time. If multiple paths achieve the minimal travel time, return the path that minimizes the number of times she switches between transportation modes. Sasha’s initial transportation mode at the party, before beginning to traverse between bus stops, is walking."
          ],
          formal: {
            input: [
              "A simple directed graph G = (V, E), where each vertex v ∈ V represents a bus stop. It is possible to travel from u to v if the directed edge (u, v) is in E.",
              "Positive integer edge weights t(u, v) representing the travel time from u to v.",
              "Edge labels m(u, v) ∈ {bus, walk} representing the transportation mode from u to v.",
              "A vertex p ∈ V representing the party location. Prior to traversing an edge from p, Sasha is walking.",
              "A vertex d ∈ V representing Sasha’s home."
            ],
            output: "A path (p = v<sub>0</sub>, v<sub>1</sub>, …, v<sub>k</sub> = d) that minimizes the total travel time, Σ<sub>i=0</sub><sup>k−1</sup> t(v<sub>i</sub>, v<sub>i+1</sub>). Among all paths that achieve the minimal travel time, minimize the number of switches between transportation modes, 1{walk ≠ m(v<sub>0</sub>, v<sub>1</sub>)} + Σ<sub>i=0</sub><sup>k−2</sup> 1{m(v<sub>i</sub>, v<sub>i+1</sub>) ≠ m(v<sub>i+1</sub>, v<sub>i+2</sub>)}."
          },
          steps: [
            {
              title: 'Two goals, but not equal',
              prompt: 'Why can’t you just minimize time + switches?',
              simple:
                'Time matters first, always. Switches only break ties. Adding them together would let a slower path win by switching less, which is wrong.'
            },
            {
              title: 'What does Sasha need to remember?',
              prompt: 'Whether an edge costs a switch depends on something beyond which stop she’s at. What?',
              simple:
                'Whether she’s currently walking or on the bus. Standing at v on foot and standing at v on the bus are different situations.',
              reveal: ['Same trick as part (a)! There the yes/no fact was “got a gift?”. Here it’s “walking or bus?”.']
            },
            {
              title: 'Build the two-copy graph',
              prompt: 'Make a walking copy and a bus copy. Where do the edges go? What does a switch look like?',
              simple:
                'Walk edges go in the walking copy, bus edges in the bus copy. A switch is an edge between v’s two copies (both directions). Start at p in the walking copy.',
              figure: F.q8bLayers(),
              reveal: ['If her first edge is a bus edge, she has to cross to the bus copy first and pay for the switch. That’s exactly what the rules say.']
            },
            {
              title: 'Squash two goals into one number',
              prompt:
                'Dijkstra minimizes one number. A path has at most n switches. How can you scale things so time always beats switches?',
              simple:
                'Multiply every travel time by n + 1 and give each switch cost 1. Even n switches add up to less than one unit of time, so Dijkstra minimizes time first and switches second.',
              figure: F.q8bScale(),
              reveal: ['Bonus: from the final distance D, time = D ÷ (n + 1) and switches = D mod (n + 1).'],
              pitfall: 'Scaling by n instead of n + 1 lets n switches tie with one unit of time. The + 1 matters, so say why.'
            },
            {
              title: 'Run it and get the path',
              prompt: 'Where do you read the answer, and how do you get the path itself?',
              simple:
                'Take whichever copy of d (walking or bus) has the smaller distance. Follow parent pointers back and drop the switch steps. What’s left is the path in G.'
            },
            {
              title: 'The other accepted answer',
              prompt: 'The key also accepts changing Dijkstra directly. What would you store?',
              simple:
                'Store (time, switches) for each vertex and compare pairs: time first, then switches on ties. Since she starts walking, an even switch count means walking and odd means bus.',
              reveal: ['Why it’s correct: switches are only looked at when times are exactly tied, so the times Dijkstra computes are still the true shortest times.']
            },
            {
              title: 'Runtime',
              prompt: 'Total cost?',
              simple: 'The new graph has 2|V| vertices and |E| + 2|V| edges. One Dijkstra: O((|V| + |E|) log |V|).'
            }
          ],
          key: {
            gist: 'Walking copy + bus copy, switch edges between them. Scale time by n + 1 and give switches cost 1. One Dijkstra from p (walking).',
            body: [
              'Or: modified Dijkstra that stores (time, switches) and breaks time ties by fewer switches.'
            ],
            runtime: 'O((|V| + |E|) log |V|)'
          }
        }
      ],
      takeaway: [
        'If you need to remember a yes/no fact while traveling, make two copies of the graph. Crossing between copies is how the fact changes.',
        'Many starts and one destination? Reverse the edges and run Dijkstra once from the destination.',
        'Two goals where one always matters more: multiply the important one by (max possible of the other) + 1.'
      ]
    }
  ]
};
