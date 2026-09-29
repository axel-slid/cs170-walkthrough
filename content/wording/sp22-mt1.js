// Spring 2022 Midterm 1: the exam's full wording (from sources/2022 Spring Midterm 1 KEY.pdf).
import { math, grid } from './helpers.js';

const REC1 = ['1. For each recurrence, provide the tightest big O bound that you can.'];
const REC2 = ['2. Suppose T(n) satisfies the recurrence: T(n) = T(n − 1) + T(n − 3) + 1, then mark each of the following statements as true or false.'];
const FFT = ['Suppose we want to use FFT to multiply two polynomials P(x), Q(x) of degree 40 and 80 respectively.'];
const Q7 = ['Here is a weighted graph G. Some of the edge weights are revealed, while others are not.'];
const Q8 = [
  'DFS was run on an undirected connected graph of 8 vertices and m edges and the pre/post values were recorded.',
  'The order of pre/post values of the 8 vertices {A, B, C, D, E, F, G, H} is as follows.',
  math('pre[A] &lt; pre[D] &lt; pre[C] &lt; pre[G] &lt; post[G] &lt; post[C] &lt; post[D] &lt; pre[F] &lt; post[F] &lt; pre[E] &lt; pre[H] &lt; post[H] &lt; post[E] &lt; post[A]'),
  'or equivalently, in brackets:',
  math('[<sub>A</sub> [<sub>D</sub> [<sub>C</sub> [<sub>G</sub> ]<sub>G</sub> ]<sub>C</sub> ]<sub>D</sub> [<sub>F</sub> ]<sub>F</sub> [<sub>E</sub> [<sub>H</sub> ]<sub>H</sub> ]<sub>E</sub> ]<sub>A</sub>')
];
const Q9 = ['Given a list of n variables x<sub>1</sub>, …, x<sub>n</sub> and m inequalities of the form x<sub>i</sub> &lt; x<sub>j</sub> or x<sub>i</sub> ≤ x<sub>j</sub> for some i, j ∈ [n], you would like to find values for the variables such that all inequalities are satisfied, or determine that not all inequalities can be satisfied simultaneously.'];
const Q12 = [
  '(Please refer to the Bellman-Ford pseudocode from the textbook for reference.)',
  'Suppose we run the Bellman-Ford algorithm on the following graph to compute shortest paths from the vertex A.',
  'Let T denote the number of individual “update” calls after which the value of dist[J] reaches its correct value (which may occur prior to the algorithm’s termination). T depends on the actual weights on the edges and the order in which the edges are updated.',
  'Assume there’s a fixed ordering of the edges. That is, we always go through the edges in the same order every time we run for all e in E.',
  '(Both the weights and order of edge updates are NOT given.)'
];

export default {
  instructors: 'P. Raghavendra and J. Wright',
  questions: {
    1: { parts: { a: ['For each pair of functions f and g, specify whether f = O(g), g = O(f), or both. Write “YES” or “NO” in the boxes.'] } },
    2: {
      parts: {
        '1a': [...REC1, math('(a) T(n) = 256 · T(n/2) + O(n<sup>2</sup>)')],
        '1b': [...REC1, math('(b) T(n) = T(n − 1) + O(n<sup>2</sup>)')],
        '2a': [...REC2, math('(a) T(n) = O(n<sup>1000</sup>)')],
        '2b': [...REC2, math('(b) T(n) = O(n<sup>log n</sup>)')]
      }
    },
    3: {
      preamble: ['Let g be a string that is made of 6n “A”s, 2n “B”s, n “C”s and n “D”s.', 'Suppose we use Huffman encoding to express g in bits.'],
      parts: {
        1: ['1. What would the length of the encoding for each letter be? A: ___ B: ___ C: ___ D: ___'],
        2: ['2. What would be the total length of the encoding for g?']
      }
    },
    4: {
      parts: {
        1: ['1. List the first six edges added by Prim’s algorithm in the order in which they are added. Start Prim’s algorithm from vertex H.'],
        2: ['2. List the first six edges added by Kruskal’s algorithm in the order in which they are added.']
      }
    },
    5: {
      preamble: FFT,
      parts: {
        1: ['What would be the size n of the FFT used? (Here n is a power of 2.)'],
        2: ['Suppose ω denotes the corresponding root of unity. What is ω<sup>64</sup>? (It is a very simple complex number.) (Throughout this exam, ω<sub>n</sub> = e<sup>2πi/n</sup> denotes the first n<sup>th</sup> root of unity.)'],
        3: ['In the above polynomial multiplication algorithm via FFT, how many times do you run the FFT algorithm? (Make no assumptions about the algorithm’s implementation.)'],
        4: ['In the above polynomial multiplication algorithm via FFT, how many times do you run the inverse FFT algorithm? (Make no assumptions about the algorithm’s implementation.)']
      }
    },
    6: {
      parts: {
        a: [
          'Suppose we used the randomized median finding algorithm (i.e Quickselect) to find the median of the following list:',
          math('{1, 2, 3, 4, 5, …, 99, 100, 101}'),
          '(Note: the list is of length 101 and contains all integers from 1 to 101) with successive pivot choices 70, 30, 47, 51.',
          'Write down the length of the relevant sublist and corresponding value of k in each recursive call after performing the partition with respect to the pivot.',
          grid(['Pivot', 'Length of list', 'k'], [['', '', ''], ['', '', ''], ['', '', ''], ['', '', '']])
        ]
      }
    },
    7: {
      preamble: Q7,
      parts: {
        1: ['1. Find all edges that are necessarily part of every MST of the graph and justify. (a) Edge ___ is necessarily part of every MST because: … (b) … (c) …', '(Note: there may be more spaces allotted than there are edges. In the case that you think there are less than 3 edges that satisfy the conditions, leave the other parts blank)'],
        2: ['2. List all edges that are NOT part of any MST of the graph (no justification needed).']
      }
    },
    8: {
      preamble: Q8,
      parts: {
        1: ['1. Deleting F from the graph will separate D and E into two different connected components. True or False?'],
        2: ['2. Deleting E will separate G and H into two different connected components. True or False?'],
        3: ['3. Deleting A will separate G and H into two different connected components. True or False?'],
        4: ['4. An edge in the graph is “critical”, if deleting it disconnects the graph. List all pairs of vertices that necessarily are critical edges of the graph.']
      }
    },
    9: {
      preamble: Q9,
      parts: {
        1: ['1. Design an efficient algorithm for the case that all inequalities are strict (i.e. of the form x<sub>i</sub> &lt; x<sub>j</sub>). Give a succinct and precise description of the algorithm (proof of correctness or runtime analysis are not needed).'],
        2: ['2. Design an efficient algorithm that solves the above problem in general (when some inequalities are of the form x<sub>i</sub> &lt; x<sub>j</sub>, and some are of the form x<sub>i</sub> ≤ x<sub>j</sub>). Give a succinct and precise description of the algorithm (proof of correctness or runtime analysis are not needed).']
      }
    },
    10: {
      parts: {
        a: [
          'There’s a device that generates a random positive integer between 1 and n. For 1 ≤ i ≤ n, let p<sub>i</sub> denote the probability that the device generates the number i.',
          'Devise an algorithm to find the most probable value of the sum of 4 independent samples from the device (Your algorithm should run in time less than or equal to O(n<sup>2</sup>).)',
          'Give a succinct and precise description of your algorithm (proof of correctness and runtime analysis are not needed).',
          'Hint: ' + math('Pr[X<sub>1</sub> + X<sub>2</sub> + X<sub>3</sub> + X<sub>4</sub> = n] = Σ<sub>x<sub>1</sub>+x<sub>2</sub>+x<sub>3</sub>+x<sub>4</sub>=n</sub> Pr[X<sub>1</sub> = x<sub>1</sub>, …, X<sub>4</sub> = x<sub>4</sub>]')
        ]
      }
    },
    11: {
      parts: {
        a: [
          'The Story: (Feel free to skip the story if you prefer a formal problem description.) There is both a rail network and a bus network on the same set of n cities. Given a start city s and a destination city t, can we find the shortest path from s to t that uses exactly k bus rides and k train rides (in any order)?',
          'Formal Problem Description. Input:<ul><li>1. Two undirected graphs G<sub>red</sub> = (V, E<sub>red</sub>) and G<sub>blue</sub> = (V, E<sub>blue</sub>) on the same set of vertices V. We refer to edges E<sub>red</sub> as red edges and edges E<sub>blue</sub> as blue edges.</li><li>2. Length ℓ<sub>e</sub> for each edge e ∈ E<sub>red</sub> ∪ E<sub>blue</sub>. (All edge lengths are positive)</li><li>3. Two vertices s and t.</li><li>4. Positive integer k.</li></ul>',
          'Goal: Find the shortest path from s to t that contains exactly k red edges and k blue edges, in any order. In other words, among all paths from s to t that has k red edges and k blue edges, find the shortest. If there is no path from s to t that has k red edges and k blue edges, then your algorithm should return FAIL. (A path is permitted to go through the same edge multiple times.)',
          'Devise an algorithm for the problem that runs in time less than or equal to O(k<sup>4</sup> · |V|<sup>2</sup>). Give a succinct and precise description of your algorithm. (Proof of correctness and runtime analysis are not needed).'
        ]
      }
    },
    12: {
      preamble: Q12,
      parts: {
        1: ['1. What is the smallest possible value of T?'],
        2: ['2. What is the largest possible value of T?']
      }
    }
  }
};
