// Fall 2023 Midterm 1: the exam's full wording (from sources/2023 Fall Midterm 1 KEY.pdf).
import { diagram, math, code, grid } from './helpers.js';

const TF = ['Label each of the following statements as “True” or “False”.'];
const HORN = [
  '3. Recall the greedy algorithm we saw in class for solving the Horn-SAT problem. Suppose that we ran this algorithm on an instance of the Horn-SAT problem with variables a, b, c, d, e and it returned the following satisfying True/False assignment to these variables: (a, b, c, d, e) = (T, F, F, T, T).',
  'For each of the following True/False assignments, state whether it is possible or impossible for that assignment to also satisfy the same Horn-SAT formula.'
];
const DFS = ['In the following graphs, the bold solid edges correspond to tree edges in the DFS traversal of the graph and the dashed edges are all of the other edges. The grey, filled-in vertex is the first node explored by the DFS. For each graph, state whether it is possible or impossible for the DFS algorithm to match such a traversal, given some tie-breaking rule between the vertices. Note that the first graph is undirected while the rest are directed.'];
const Q9 = ['You invited n friends to your upcoming birthday party. Your i-th friend will show up with probability p<sub>i</sub> (and does not show up with probability 1 − p<sub>i</sub>) independently of your other friends. Let random variable M be the number of friends who show up. To plan the party, you want to know the probability distribution of M. That is, you would like to compute P(M = m) for each m ∈ {0, 1, 2, …, n}.'];
const PX = math('P(x) = ((1 − p<sub>1</sub>) + p<sub>1</sub>x)((1 − p<sub>2</sub>) + p<sub>2</sub>x) ⋯ ((1 − p<sub>n</sub>) + p<sub>n</sub>x).');
const Q10 = ['Given a directed acyclic graph G with n vertices and m edges, design an algorithm that determines whether G has a unique topological sort.'];
const Q11 = [
  'Let G = (V, E) be an undirected graph with a weight w<sub>e</sub> ≥ 0 for each edge e ∈ E. Recall that a minimum spanning tree T of G is a spanning tree of minimum total weight, where the total weight of T is defined as',
  math('w(T) = Σ<sub>e∈T</sub> w<sub>e</sub>.'),
  'In this problem, we will also consider a different type of spanning tree, called a min-max tree. A min-max tree T′ of G is a spanning tree of G which minimizes the quantity',
  math('max(T′) = max<sub>e∈T′</sub> {w<sub>e</sub>},'),
  'among all spanning trees of G. In other words, among all spanning trees of G, the min-max tree T′ has as small of a maximum edge as possible.'
];

export default {
  instructors: 'N. Haghtalab and J. Wright',
  questions: {
    1: {
      preamble: TF,
      parts: {
        a: [math('(a) (log log n)<sup>100</sup> = O(<sup>7</sup>√(log n)).')],
        b: [math('(b) 2<sup>√(log n)</sup> = O(n<sup>0.003</sup>).')],
        c: [math('(c) 2<sup>(log n)<sup>2</sup></sup> = O(n<sup>0.003</sup>).')],
        d: [math('(d) 2<sup>√n</sup> = O(n<sup>log n</sup>).')],
        e: [math('(e) If T(n) = 2T(n/2) + O(√n), then T(n) = O(n).')],
        f: [math('(f) If T(n) = 2T(n/2) + O(n), then T(n) = Θ(n log n).')]
      }
    },
    2: {
      parts: {
        a: ['Consider the recurrence relationship T(n) = 2T(n/2) + O(n / log n) with the base case T(1) = 1. Prove that T(n) = O(n log log n) using the tree method.', 'Hint: You may use the fact that Σ<sub>j=1</sub><sup>k</sup> 1/j = O(log k).']
      }
    },
    3: {
      parts: {
        1: [
          '1. Fill in True or False: The following algorithm correctly computes single-source shortest paths in any graph with no negative-length cycles.',
          code([
            'Input: Weighted Graph G = (V, E); Source Vertex s ∈ V',
            'dist ← [+∞, …, +∞]',
            'dist[s] ← 0     ▷ dist is a length |V| array with +∞ everywhere except s',
            'for (u, v) ∈ E do',
            '  for i = 1, …, |V| − 1 do',
            '    dist[v] ← min(dist[v], dist[u] + ℓ(u, v))'
          ])
        ],
        2: ['2. Fill in True or False: In an undirected graph, it is possible for two vertices with an edge between them to have the same parent in the DFS tree.'],
        '3a': [...HORN, '(a) (a, b, c, d, e) = (T, F, F, T, F). Possible or Impossible?'],
        '3b': [...HORN, '(b) (a, b, c, d, e) = (T, T, F, T, T). Possible or Impossible?'],
        4: ['4. Suppose you have a set of 8 distinct numbers a<sub>1</sub>, …, a<sub>8</sub> such that the set a<sub>1</sub><sup>2</sup>, …, a<sub>8</sub><sup>2</sup> has size 4. Are the a<sub>i</sub>’s necessarily the 8-th roots of unity? If not, provide a counter-example.'],
        5: ['5. Let Roots<sub>4</sub> := {ω<sub>0</sub>, ω<sub>1</sub>, ω<sub>2</sub>, ω<sub>3</sub>} be the 4-th roots of unity, where ω<sub>0</sub> = 1 and the other three are numbered counter-clockwise on the unit circle. We saw in class that ω<sub>1</sub> is a generator of this set, meaning that for every a, there is an integer b such that ω<sub>a</sub> = ω<sub>1</sub><sup>b</sup>. Are any of the other 4th-roots of unity generators of Roots<sub>4</sub>? If so, list them.']
      }
    },
    4: {
      preamble: DFS,
      parts: {
        1: ['1. (Undirected graph.) Possible or Impossible?'],
        2: ['2. Possible or Impossible?'],
        3: ['3. Possible or Impossible?'],
        4: ['4. Possible or Impossible?'],
        5: ['5. Possible or Impossible?']
      }
    },
    5: {
      parts: {
        a: [
          'To escape being turned into a paperclip by a rogue artificial intelligence, you are building a spaceship to Mars. You have n trapezoidal components available to build your spaceship. The i-th component is a trapezoid with height 1 and bases of length a<sub>i</sub> and b<sub>i</sub> such that a<sub>i</sub> &lt; b<sub>i</sub>. A spaceship consists of a sequence of components of decreasing width stacked on top of each other. That is, the i-th component can go on top of the j-th component if and only if b<sub>i</sub> ≤ a<sub>j</sub>. Design an efficient algorithm to output the height of the tallest spaceship you can make from the available components.',
          'In the figure below, the spaceship has height 4. (Figure not to scale.)',
          diagram('fa23-q5.png', 'Four stacked trapezoids with bases 19/21, 22/44, 60/70, and 70/170'),
          'Give a succinct and precise description of an algorithm to solve this problem. (Proof of correctness not required.) Your algorithm should run in time asymptotically faster than O(n<sup>3</sup>) to receive full credit.'
        ]
      }
    },
    6: {
      parts: {
        a: [
          'Suppose we run Karatsuba’s algorithm (using integers in base 10) on the two integers 5432 and 6789 in order to compute the product 5432 × 6789. Write down the 3 subproblems that Karatsuba’s algorithm will call in its top level of recursion.',
          'Subproblem 1: Run Karatsuba’s algorithm on ___ and ___. Subproblem 2: … Subproblem 3: …',
          'For each subproblem, write the smaller of the two numbers on the left. Order the three subproblems according to their leftmost number, from smallest to largest.'
        ]
      }
    },
    7: {
      parts: {
        a: [
          'Run Kruskal’s algorithm on the following graph. For each edge, indicate either the order it was added to the MST or if it’s not in the MST. For example, if edge UV was the 3rd edge added to the MST, then bubble in “in MST” and write 3 in the corresponding order box. If an edge is not in the MST, bubble in “not in MST” and leave the order box blank.',
          grid(['Edge', 'In MST?', 'Order', 'Edge', 'In MST?', 'Order'], [
            ['AB', '', '', 'AD', '', ''], ['AE', '', '', 'AF', '', ''], ['BC', '', '', 'BD', '', ''],
            ['BE', '', '', 'BG', '', ''], ['CD', '', '', 'CG', '', ''], ['DE', '', '', 'DF', '', '']
          ])
        ]
      }
    },
    8: {
      parts: {
        a: [
          'The selection problem asks us to find the k-th largest element of an unsorted list of length n. Recall that QuickSelect solves this problem in expected O(n) time. There is also a deterministic algorithm called DeterministicSelect that solves this problem in O(n) time always. To answer m distinct selection queries for the k<sub>1</sub>-th, k<sub>2</sub>-th, …, k<sub>m</sub>-th largest elements of a given list, one could run DeterministicSelect with k = k<sub>i</sub> for each i and take O(nm) time. But we aspire for better!',
          'Design an algorithm to answer m selection queries for distinct k<sub>1</sub>, …, k<sub>m</sub> on a list [a<sub>1</sub>, a<sub>2</sub>, …, a<sub>n</sub>] of n distinct integers in O(n log m) time. Your algorithm may call DeterministicSelect as a subroutine. Give a succinct and precise description of your algorithm. (Proof of correctness not required.) Note: algorithms that run in Ω(n log n) time will get no credit.'
        ]
      }
    },
    9: {
      preamble: Q9,
      parts: {
        a: ['a) Describe how to deduce the probability distribution of M from the coefficients of the polynomial', PX],
        b: ['b) Describe an algorithm to compute the coefficients of P(x) in O(n(log n)<sup>2</sup>) time. As a reminder,', PX]
      }
    },
    10: {
      preamble: Q10,
      parts: {
        a: ['a) Give a succinct and precise description of an algorithm to solve this problem. (Proof of correctness not required.) Full credit is given to algorithms that run in O(n + m) time.'],
        b: ['b) What is the runtime of your algorithm?']
      }
    },
    11: {
      preamble: Q11,
      parts: {
        a: [
          'a) In this part, we will show that if T is a minimum spanning tree, then it is also a min-max tree. We will use a proof by contradiction. To do so, assume for the sake of contradiction that T is not a min-max tree of G. Then there is another spanning tree T′ of G whose largest weight edge is smaller than T’s largest weight edge.',
          'Given T′, it is possible to modify T to create a new spanning tree with smaller total weight than T. Give a succinct and precise explanation of how to do so. (Proof of correctness not required. Note that this contradicts the fact that T is a minimum spanning tree.)'
        ],
        b: [
          'b) In this part, you will show that the converse to the last part is not true: that is, a min-max tree is not necessarily a minimum spanning tree. To prove this, construct a counter-example on a graph G with at most 4 vertices, in which there exists a min-max tree that is not a minimum spanning tree. So you should construct such a graph G, give a min-max tree of G, and show that it is not a minimum spanning tree of G.',
          'Give a concrete construction of G: draw the vertices of the graph, the edges between them, and label the weights on the edges. Give an example of a min-max tree T′ of G: draw the vertices and only the edges included in the min-max tree, and compute the total weight w(T′) = Σ<sub>e∈T′</sub> w<sub>e</sub>. Give a minimum spanning tree T of G with a total weight w(T) = Σ<sub>e∈T</sub> w<sub>e</sub> which is less than that of the min-max tree.'
        ]
      }
    },
    12: {
      parts: {
        a: ['You are planning to travel by plane from San Francisco to New York. The airline you selected operates in n cities, indexed 1 through n, and has m distinct flight routes. The i-th route flies from city u<sub>i</sub> to city v<sub>i</sub> and has cost w<sub>i</sub>.', 'Luckily for you, the airline is running a promotion for your trip where you may take up to k flights for free. Your goal is to compute the minimum total cost needed to travel from city 1 (San Francisco) to city n (New York), if you may take up to k flights for free. Give a succinct and precise description of an algorithm to solve this problem. (Proof of correctness not required.) Your algorithm should run in time O(k(m + n) log n) to receive full credit.']
      }
    }
  }
};
