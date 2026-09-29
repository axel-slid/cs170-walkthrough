// Spring 2023 Midterm 1: the exam's full wording (from sources/2023 Spring Midterm 1 KEY.pdf).
import { math, code, grid } from './helpers.js';

const neg = (i) => `<span class="neg">x</span><sub>${i}</sub>`;
const WHAT = [
  'Consider the following piece of code:',
  code([
    'Function what(n) {',
    '  If (n < 2) :',
    '    return;',
    '  what(n/3)',
    '  k = √n',
    '  for i = 1, 2, 3, ..., k {',
    '    for j = 1, 2, 3, ..., k − i {',
    '      print BLAH',
    '    }',
    '  }',
    '  what(n/3)',
    '  what(n/3)',
    '}'
  ]),
  'Let T(n) denote the runtime of the what(n).'
];
const BF = [
  'Consider the execution of Bellman-Ford algorithm on the following directed graph with positive edge weights and the source node S. Edges of the graph are labelled E1, E2, E3, E4 and E5.',
  'Here is the sequence of update operations carried out by the algorithm.',
  grid(['Iteration Number', 'Updated Edge'], [
    ['1', 'E1'], ['2', 'E2'], ['3', 'E3'], ['4', 'E4'], ['5', 'E5'],
    ['6', 'E1'], ['7', 'E2'], ['8', 'E3'], ['9', 'E4'], ['10', 'E5'],
    ['11', 'E1'], ['12', 'E2'], ['13', 'E3'], ['14', 'E4'], ['15', 'E5']
  ])
];
const MST = ['For both subparts of this question, write one edge in each box. Denote an edge with only the vertices, in alphabetical order, and nothing else. Write: AB, do not write BA, A-B, or AB(9).'];
const HORN = [
  '5. The greedy algorithm on a HornSAT instance returns the following assignment:',
  math('x<sub>1</sub> = True, x<sub>2</sub> = False, x<sub>3</sub> = True, x<sub>4</sub> = False, x<sub>5</sub> = True'),
  'For each of the following clauses, indicate whether adding it will necessarily make the instance unsatisfiable. (i.e., there exists no assignment that satisfies all the original clauses and the new added clause) Each sub-part below is independent of the other. (may be satisfiable / necessarily unsatisfiable)'
];
const DFS7 = ['The DFS traversal of a graph depends on the order in which the vertices are chosen. Consider the following graph:', 'Suppose we execute a DFS traversal of the above graph, choosing the vertices in arbitrary order (not necessarily lexicographic). Mark each of the following outcomes as possible or impossible.'];
const HUFF = [
  'Assume we have a length 100 string consisting of the characters {A, B, C, D, E}. We know the string contains 30 A’s and 40 B’s.',
  'For each of the trees shown above, indicate whether the tree is a possible Huffman encoding for some choice of frequencies of other characters C, D and E. Unlabelled leaves may represent any character. If impossible, justify your answer.'
];
const LEGO = [
  'Legoland is open for 2n days in the summer, and visitors arrive at the park for the first n days. On day i, exactly a<sub>i</sub> visitors arrive at Legoland.',
  'Visitors stay in Legoland for different lengths of time. More precisely, among visitors arriving on any given day, a p<sub>t</sub>-fraction of visitors will leave after t-days at Legoland (ie they will spend t days at Legoland then leave the next day).',
  'In this problem, we will devise an algorithm for the following problem:',
  'Formal description. Input:<ul><li>1. Number of arrivals {a<sub>1</sub>, …, a<sub>n</sub>}.</li><li>2. {p<sub>1</sub>, …, p<sub>n</sub>} where p<sub>t</sub> is the fraction of visitors that will spend t days.</li></ul>Output: Determine the number of visitors leaving the park on each day.'
];
const TOWERS = [
  'Devise algorithms for the following tasks given the input below.',
  'Formal description. Input:<ul><li>An undirected graph G = (V, E) and positive edge weights {w<sub>e</sub>}<sub>e∈E</sub> on the edges.</li><li>A subset T ⊂ V of vertices, referred to as “towers”.</li><li>A positive number R</li></ul>',
  'Note: A vertex v is said to be covered by a tower w, if the length of the shortest path from v to w is at most R.'
];

export default {
  instructors: 'P. Raghavendra and J. Wright',
  questions: {
    1: { parts: { a: ['For each pair of functions f and g, specify whether f = O(g), g = O(f), or both.'] } },
    2: {
      preamble: WHAT,
      parts: {
        1: ['1. Write the recurrence relation for T(n).'],
        2: ['2. Solve the recurrence relation for T(n) (give the tightest bound O() possible).']
      }
    },
    3: {
      parts: {
        1: ['1. Perform DFS in the graph, breaking ties alphabetically, and write down the pre and post numbers.', grid(['Vertex v', 'pre[v]', 'post[v]'], ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((v) => [v, '', '']))],
        2: ['2. Mark all cross edges if any. The edges are: A→B, A→E, B→E, B→F, C→B, C→G, D→A, D→E, D→H, E→H, G→F, G→J, H→D, H→I, I→J, J→G, J→F.'],
        3: ['3. In the following table, list its strongly connected components (SCCs), in the alphabetical order of the smallest vertex contained (e.g. AEF precedes BCD).']
      }
    },
    4: {
      preamble: BF,
      parts: {
        1: ['1. What is the earliest iteration after which dist[A] (distance to A) is guaranteed to be correct? If dist[A] is first set to the correct value on iteration x, write x.'],
        2: ['2. What is the earliest iteration after which dist[B] (distance to B) is guaranteed to be correct? If dist[B] is first set to the correct value on iteration x, write x.'],
        3: ['3. What is the earliest iteration after which dist[C] (distance to C) is guaranteed to be correct? If dist[C] is first set to the correct value on iteration x, write x.']
      }
    },
    5: {
      preamble: MST,
      parts: {
        1: ['1. List the first six edges added by Prim’s algorithm in the order in which they are added. Assume that Prim’s algorithm starts at vertex A and breaks ties lexicographically.'],
        2: ['2. List the first seven edges added by Kruskal’s algorithm in the order in which they are added. You may break ties in any way.']
      }
    },
    6: {
      preamble: ['Note: all subparts are independent from one another.'],
      parts: {
        1: ['1. What is the Fourier transform of the vector [1, 1, 0, 0]?'],
        2: ['2. Let n &gt; 16 be a power of 2. Let {ω<sub>1</sub>, ω<sub>2</sub>, ω<sub>3</sub>, …, ω<sub>n</sub>} denote all the n<sup>th</sup> roots of unity. How many distinct numbers are in the set: {ω<sub>1</sub><sup>4</sup>, ω<sub>2</sub><sup>4</sup>, …, ω<sub>n</sub><sup>4</sup>}?'],
        3: ['3. Let InverseFFT denote the inverse Fourier transform. Suppose', math('InverseFFT([a<sub>0</sub>, a<sub>1</sub>, a<sub>2</sub>, a<sub>3</sub>, a<sub>4</sub>, a<sub>5</sub>, a<sub>6</sub>, a<sub>7</sub>]) = [0, 0, 2, 0, 0, 0, 0, 0].'), 'What is', math('InverseFFT([a<sub>0</sub><sup>3</sup>, a<sub>1</sub><sup>3</sup>, a<sub>2</sub><sup>3</sup>, a<sub>3</sub><sup>3</sup>, a<sub>4</sub><sup>3</sup>, a<sub>5</sub><sup>3</sup>, a<sub>6</sub><sup>3</sup>, a<sub>7</sub><sup>3</sup>]) = ?')],
        4: ['4. Let Select(S, k) denote the randomized Select algorithm that finds the k<sup>th</sup> smallest number in a set S. Consider the execution of SELECT(S, n/2) on a set S of size n. Let R denote the number of pivots chosen by the algorithm before it terminates.', '(a) In the best case, the value of R (up to constant factors) = ___ (b) In the worst case, the value of R (up to constant factors) = ___ (c) The expected value of R (up to constant factors) = ___'],
        '5a': [...HORN, '(a) x<sub>1</sub> ⟹ x<sub>2</sub>'],
        '5b': [...HORN, `(b) ${neg(1)} ∨ ${neg(3)}`],
        '5c': [...HORN, `(c) ${neg(5)}`]
      }
    },
    7: {
      preamble: DFS7,
      parts: {
        1: [math('1. pre[A] &lt; pre[B] &lt; pre[C] &lt; pre[D] &lt; pre[E] &lt; pre[F]')],
        2: [math('2. pre[A] &gt; pre[B] &gt; pre[C] &gt; pre[D] &gt; pre[E] &gt; pre[F]')],
        3: [math('3. post[A] &gt; post[B] &gt; post[C] &gt; post[D] &gt; post[E] &gt; post[F]')],
        4: [math('4. post[A] &lt; post[B] &lt; post[C] &lt; post[D] &lt; post[E] &lt; post[F]')],
        5: [math('5. pre[F] &lt; pre[C] &lt; pre[D] &lt; pre[E] &lt; pre[A] &lt; pre[B]')]
      }
    },
    8: {
      preamble: HUFF,
      parts: { 1: ['Tree 1: possible or impossible?'], 2: ['Tree 2: possible or impossible?'], 3: ['Tree 3: possible or impossible?'], 4: ['Tree 4: possible or impossible?'] }
    },
    9: {
      preamble: LEGO,
      parts: {
        1: ['1. Write down a formula for the number of visitors leaving the park on day ℓ, as a function of {a<sub>1</sub>, …, a<sub>n</sub>} and {p<sub>1</sub>, …, p<sub>n</sub>}.'],
        2: ['2. Give a succinct and precise description of the algorithm. (Your algorithm should be asymptotically faster than O(n<sup>1.5</sup>). Proof of correctness not required.)'],
        3: ['3. What is the runtime of your algorithm?']
      }
    },
    10: {
      parts: {
        a: [
          'The road network in the city of Degradia is represented by an undirected graph G = (V, E). Every road degrades over time until it becomes unusable. More precisely, for each edge (u, v) ∈ E in the network, there is a time t<sub>uv</sub> after which the road is unusable. Assume all roads start degrading at the same time.',
          'Given this information, devise an efficient algorithm to find the first time at which the network disconnects.',
          'Formal description. Input:<ul><li>An undirected graph G = (V, E)</li><li>A positive time t<sub>uv</sub> &gt; 0 for each edge (u, v). The edge (u, v) is removed from the graph G at time t<sub>uv</sub>.</li></ul>Output: The first time at which the graph G becomes disconnected.',
          'Observe that if at time t, the network is disconnected, the network will stay disconnected for all times greater than t. Conversely, if at time t, the network is connected, the network will be connected for all times less than t.',
          'Devise an efficient algorithm to determine the first time at which the network disconnects and provide the runtime. (No proof needed. Your algorithm should run in time asymptotically smaller than O((|V| + |E|)<sup>1.5</sup>) to receive full credit.)'
        ]
      }
    },
    11: {
      parts: {
        a: [
          'The Story: (Feel free to skip the story if you prefer a formal problem description.) There are n locations on Mars suitable for building colonies. Let D[i, j] denote the distance between the i<sup>th</sup> and j<sup>th</sup> location. SpaceX needs to select a subset of locations to build colonies at. For safety reasons, each colony must be within a distance R of two other colonies. Devise an algorithm to identify the largest subset of locations to build colonies at.',
          'Formal description. Input:<ul><li>There are n locations numbered {1, …, n}</li><li>Distances D[i, j] between all pairs of locations i and j in {1, …, n}.</li><li>A positive number R.</li></ul>Output: The largest subset S ⊂ {1, … n} of locations such that for each i ∈ S, there exists two other locations j, k ∈ S such that D[i, j] &lt; R and D[i, k] &lt; R.',
          'Give a succinct and precise description of an algorithm. (Your algorithm should run asymptotically faster than O(n<sup>5</sup>) time. No proof or runtime analysis needed.)'
        ]
      }
    },
    12: {
      preamble: TOWERS,
      parts: {
        1: ['1. (10 points) List all vertices v that are covered by at least one tower in T. Devise an algorithm for this problem using one execution of Dijkstra’s algorithm. (Give a succinct and precise description of the algorithm. Proof of correctness or runtime analysis not required)'],
        2: [
          '2. (10 points) Disclaimer: This subpart is particularly difficult. We recommend working on this problem only after you’ve finished all previous questions.',
          'List all vertices v that are covered by at least two towers in T. Observe that one can solve the problem using |T| executions of Dijkstra’s algorithm, one from each tower. Devise an algorithm for the problem with run-time that is asymptotically faster than O(|T| · ((|V| + |E|) · log |V|)) (i.e. faster than |T| executions of Dijkstra’s algorithm).',
          '(Hint: What can you learn by using part (1) on a subset of towers?)',
          '(a) What is the runtime of your algorithm? (b) Give a succinct and precise description of the algorithm. (Proof of correctness not required.)'
        ]
      }
    }
  }
};
