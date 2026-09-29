// Fall 2021 Midterm 1: the exam's full wording (from sources/2021 Fall Midterm 1 KEY.pdf).
import { diagram, math, blank } from './helpers.js';

const B = [
  '(b) Fill out the following four blanks in terms of n, then give a construction of such a graph. i.e. if your answer for a blank is f(n), then describe how, given n, you can construct a graph on n vertices with f(n) edges that satisfy the conditions. You are allowed to fill the blank in form of sums. All graphs are simple (no self-loops, at most one edge between two vertices).',
  'In the first two parts below, we say a directed graph G is weakly connected if the undirected graph obtained by removing all edge directions from G is connected.'
];
const Q4 = [
  'We are given two strings P, T over the alphabet Σ = {0, 1, …, s − 1}. P has length m and T has length n, where m ≤ n. We would like to find all occurrences of the pattern P in T. For example, the pattern P = 101 appears twice in the string T = 10101: namely at positions 0 and 2 in T (using 0-based indexing). In what follows, you only need to provide a short algorithm without proof.',
  'Note: The last two parts of this problem are difficult. We assigned fewer points to the last two parts to encourage you to check your answers for other problems instead if you finished everything else on the exam but stuck on (d) and (e).'
];

export default {
  instructors: 'J. Nelson',
  questions: {
    1: {
      parts: {
        a: ['(a) (5 pts) Let f(n) = log(n!). Prove f(n) = Θ(n log n).'],
        'b.i': [...B, `(i) There are at least ${blank} edges in a weakly connected directed acyclic graph on n vertices.`],
        'b.ii': [...B, `(ii) There are at most ${blank} edges in a weakly connected directed acyclic graph on n vertices.`],
        'b.iii': [...B, `(iii) There are at least ${blank} edges in a strongly connected directed graph on n vertices.`],
        'b.iv': [...B, `(iv) There are at most ${blank} edges in a strongly connected directed graph on n vertices.`],
        c: [
          '(c) (7 pts) To implement Dijkstra’s algorithm, is it faster to use an adjacency list to represent the graph or is it faster to use an adjacency matrix? Explain why. Assume |E| = o(|V|<sup>2</sup>) (informally, assume the graph is not dense).',
          'Hint: Recall from lecture that an adjacency matrix is stored as a 2D array (hence the word “matrix”) and an adjacency list is stored as a 1D array of linked lists.'
        ],
        d: ['(d) (4 pts) How would you speed up computing the FFT of (a<sub>0</sub>, a<sub>0</sub>, a<sub>1</sub>, a<sub>1</sub>, a<sub>2</sub>, a<sub>2</sub>, …) by a factor of roughly 2 (i.e. halve the runtime)?'],
        e: [
          '(e) (8 pts) Is the following statement true or false? Justify your answer.',
          '“Let an M-path between two vertices s and t (in an undirected, connected graph G) be a path such that the weight of every edge is at most M. If G has an M-path between s and t, then there is a minimum spanning tree of G with an M-path between s and t.”'
        ]
      }
    },
    2: {
      parts: {
        a: [
          '(20 pts) Kevin is placing L-shaped chicken wings on a n by n oven tray, where n is a power of 2. Each chicken wing can be viewed as a 2 by 2 square with one of its 1 by 1 squares missing. One of the oven tray’s squares was severely burnt and must be left empty.',
          'Given n, x, y (n is a power of 2, n ≥ 2, x, y ∈ {1 … n}), where (x, y) is the position of the burnt square that he wants to leave empty, how do we fill the entire n by n tray excluding square (x, y) with chicken wings? The chicken wings cannot overlap each other, nor can they extend out of the tray (or they’ll get burnt!).',
          'Describe an efficient algorithm that outputs a possible placement of the chicken wings, given n and (x, y). Then prove the algorithm’s correctness and analyze its runtime.',
          'Feel free to draw figures in your answer if it helps you clarify your description. Marking and deleting the placement of one chicken wing takes constant time.',
          'Example: n = 8; (x, y) = (4, 2). One possible output. We denote the burnt square by shading it black.',
          diagram('fa21-q2.png', 'An 8 by 8 tray tiled with L-shaped pieces around one black burnt square'),
          'Hint: Divide and conquer. Draw a 8x8 or 16x16 grid to try something out first.'
        ]
      }
    },
    3: {
      parts: {
        a: [
          '(18 pts) A levee broke and the water is flooding a group of villages. There are n villages and m roads between the villages. The water floods one road at a time. For each road e<sub>i</sub>, you’re given the unique integer timestep t<sub>i</sub> of when this road is flooded. (t<sub>i</sub>)<sub>i=1</sub><sup>m</sup> is a permutation of {1 … m}. Give an efficient algorithm that computes the array A, where A<sub>i</sub> denotes the number of connected components of villages at timestep i ∈ {1 … m} and then analyze its runtime. Proof of correctness is not needed for this question.',
          'Example: n = 4, m = 4. The roads (e<sub>i</sub>)<sub>i=1</sub><sup>4</sup> = (1, 2); (2, 3); (3, 4); (4, 1). Timesteps (t<sub>i</sub>)<sub>i=1</sub><sup>4</sup> = 3; 2; 4; 1.<ul><li>At timestep 1, e<sub>4</sub> = (1, 4) is flooded, there’s 1 connected component: {1, 2, 3, 4}.</li><li>At timestep 2, e<sub>4</sub> = (1, 4) and e<sub>2</sub> = (2, 3) are flooded, there are 2 connected components: {1, 2}, {3, 4}.</li><li>At timestep 3, e<sub>4</sub>, e<sub>2</sub>, and e<sub>1</sub> are flooded, there are 3 connected components: {1}, {2}, {3, 4}.</li><li>At timestep 4, all roads are flooded, there are 4 connected components: {1}, {2}, {3}, {4}.</li></ul>Therefore A = (1, 2, 3, 4).'
        ]
      }
    },
    4: {
      parts: {
        a: [...Q4, '(a) (6 pts) When s = 2, give an O(n log n) time algorithm for this problem. Hint: what if you replace each 1 in an input string with 01 and replace 0 with 10?'],
        b: [...Q4, '(b) (5 pts) What if we only want to find positions in T that match P up to at most 10% error?'],
        c: [...Q4, '(c) (7 pts) Show how to improve the runtime of (a) to O(n log m). Hint: solve O(n/m) instances of a problem solved in class.'],
        d: [...Q4, '(d) (4 pts) Give an O(n log n) time (no dependence on s) algorithm for exact matching over general alphabets, i.e. where s is not necessarily 2. Hint: a = b iff (a − b)<sup>2</sup> = a<sup>2</sup> + b<sup>2</sup> − 2ab = 0.', 'Note: If your answer for this part is entirely correct you automatically get full points for part (a). If you wrote something like “use my algorithm described in (d)” in (a), you’ll get 0 points for (a) unless you obtain full score in (d).'],
        e: [...Q4, '(e) (4 pts) Give an O(n log n) time algorithm for exact matching (i.e. not 10% error) even if the strings are allowed to have wildcard characters (a wildcard matches any single character).']
      }
    }
  }
};
