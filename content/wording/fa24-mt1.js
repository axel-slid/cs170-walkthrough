// Fall 2024 Midterm 1: the exam's full wording (from sources/2024 Fall Midterm 1 KEY.pdf).
import { math, code, grid, matrix, blank } from './helpers.js';

const WHAT = [
  'Consider the following piece of code:',
  code([
    'Function what(n) {',
    '  If (n < 2) :',
    '    return',
    '  k ← n',
    '  while k > 1 do {',
    '    for j = 1, 2, 3, ..., k {',
    '      print n',
    '    }',
    '    k ← ⌊3 ∗ k/4⌋     # Here ⌊ ⌋ denotes the floor function that rounds real numbers down to integers',
    '  }',
    '  what(⌊n/2⌋)',
    '  what(⌊n/2⌋)',
    '}'
  ]),
  'Let B(n) denote the number of times the number n is printed by a call to what(n). Let T(n) denote the total runtime of the what(n).'
];
const EDGES3 = 'A→B, A→E, B→F, B→C, C→G, D→A, D→H, E→B, E→D, G→C, G→F, H→D, H→E, I→E, I→F, I→H, J→G, J→I, J→F';
const FIB = [
  'Consider the following simple algorithm to compute the n<sup>th</sup>-Fibonacci number. Here F[i] stores the i<sup>th</sup>-Fibonacci number.',
  code(['Simple-Fibonacci(n)', '  F[1] ← 1', '  F[2] ← 1', '  for i = 3 to n', '    F[i] ← F[i − 1] + F[i − 2]', '  return F[n]']),
  'Recall that the n<sup>th</sup> Fibonacci number F<sub>n</sub> is Θ(n)-digits long. Therefore, a correct implementation of the above algorithm will actually need an array of digits to store each F[i]. In other words, for each i, F[i] is itself an array of digits of length up to n.',
  'Throughout this question, we assume that operations on individual digits take Θ(1) time. But arithmetic operations on n digit numbers are implemented using operations on digits, and may take time depending on n.'
];
const FOUR = ['Let A denote the adjacency matrix of an undirected graph G on n vertices. Let B = A<sup>2</sup> = A · A where A · A denotes multiplication of matrices.'];
const BF = [
  'Recall that Bellman-Ford algorithm for shortest paths in a graph has the following form:',
  code(['(*Outer Loop*) for t = 1 to |V| − 1', '  (*Inner loop*) for each edge e ∈ E', '    update(edge e)']),
  'Here “update(edge e)” modifies the distance values to the nodes in the graph.',
  'Consider the execution of Bellman-Ford algorithm on the following directed graph with positive or negative edge weights and the source node S. The graph is a grid, with S being the bottom left corner and all edges directed up or to the right, or diagonally.',
  'The convergence of the distance values during the execution of the algorithm depends on the order in which the edges are updated in the inner loop.'
];
const CARS = [
  'Given the road network of the state of Electrica, we want to compute the quickest route to go from a city S to a city T in an electric car. Unfortunately, the electric car needs to recharge every so often and charging takes time. So we will devise an algorithm to compute the quickest routes taking into account the charging stops along the way. Here are the details:',
  'Formal description. Input:<ul><li>An undirected graph G = ({1, …, n}, E) representing the road network between cities in Electrica.</li><li>For each edge e = (i, j), a positive integer d<sub>e</sub> representing the drive time in minutes, to go from city i to j along the edge.</li><li>The car can be charged at a subset S ⊂ {1, …, n} of cities. There are two options for charging that are summarized in the table below.</li></ul>',
  grid(['Name', 'Charging Time', 'Drive time'], [['Full Charge', 'C<sub>full</sub>', 'D<sub>full</sub>'], ['Partial Charge', 'C<sub>partial</sub>', 'D<sub>partial</sub>']]),
  'So a full charge takes C<sub>full</sub> minutes to complete, but allows the electric car to drive another D<sub>full</sub> minutes. A partial charge takes C<sub>partial</sub> minutes to complete, but can allow the car to drive another D<sub>partial</sub> minutes. The car can undergo a Full or Partial Charge while at a city in S, irrespective of its pre-existing level of charge. Furthermore, the charging times for the full or partial charge do not depend on the amount of pre-existing charge in the car.',
  'A source city s and a destination city t in the graph G.',
  'Output: The quickest route from the source s to destination t in the electric car. Here the quickest route is one that takes the shortest total time including both drive and charging times. Assume that the car starts with a Full Charge at the source city s.'
];

export default {
  instructors: 'S. Garg and P. Raghavendra',
  questions: {
    1: { parts: { a: ['For each pair of functions f and g, specify whether f = O(g), g = O(f), or both. Assume all logarithms are to base 2.'] } },
    2: {
      preamble: WHAT,
      parts: {
        1: [`1. B(n) = Θ(${blank})`, '2. Briefly justify the estimate of B(n).'],
        3: ['3. Write the recurrence relation for T(n).', `4. Solve the recurrence relation for T(n). T(n) = Θ(${blank})`]
      }
    },
    3: {
      parts: {
        1: ['1. Perform DFS in the graph starting at node A and write down the pre and post numbers. Break ties alphabetically.', grid(['Vertex v', 'pre[v]', 'post[v]'], ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((v) => [v, '', '']))],
        2: [`2. Mark all cross and back edges if any, by filling the circles below. The edges are: ${EDGES3}.`],
        3: ['3. In this class, we have learnt an algorithm to compute the strongly connected components (SCCs) of a directed graph. Write down the strongly connected components (SCCs) in the above graph in the same order in which the algorithm outputs them.', 'Note that there may be more answer boxes below than SCCs in the graph.']
      }
    },
    4: {
      parts: {
        a: [
          'Consider the execution of Dijkstra’s algorithm in the following graph starting at node S.',
          'During the execution of Dijkstra’s algorithm, there are 5 deleteMin operations. Write down the state of the priority queue right before each deleteMin operation. If a vertex is not in the priority queue, leave the corresponding box blank.',
          'The priority queue starts out with all vertices inserted with key = ∞, except for the source S which is inserted with key = 0. We have filled out the first row for you.',
          grid(['deleteMin Steps', 'S', 'A', 'B', 'C', 'D'], [['0', '(S, 0)', '(A, ∞)', '(B, ∞)', '(C, ∞)', '(D, ∞)'], ['1', '', '', '', '', ''], ['2', '', '', '', '', ''], ['3', '', '', '', '', ''], ['4', '', '', '', '', '']])
        ]
      }
    },
    5: {
      parts: {
        1: ['1. In the graph below, what would be the fourth and fifth edges added by Kruskal’s algorithm?'],
        2: ['2. In the same graph, what would be the fourth and fifth edges added by Prim’s algorithm started at A?'],
        3: ['3. In the same graph, Dijkstra’s algorithm can be used to construct a shortest path tree starting from A. What would be the fourth and fifth edges added by the Dijkstra’s algorithm to the shortest path tree?']
      }
    },
    6: {
      parts: {
        1: [`1. (2 points) A document consists of symbols A, B, C, D, E with frequencies 20, 40, 45, 50, 80 respectively. Suppose we run Huffman encoding on these letters, the letter C will be encoded using ${blank} bits, and the letter E is encoded using ${blank} bits.`],
        2: ['2. (3 points) Here is DFS tree for an undirected connected graph, shown up to depth 5. The vertex A is the root of the tree.', '(Warning: The picture shows the tree only up to depth 5, and does not show any of the non-tree edges in the graph. The dotted lines at the bottom indicate subtrees hanging below.)', 'Which is the smallest set of vertices whose deletion will necessarily disconnect the graph? Briefly justify why deletion of this set disconnects the graph.'],
        3: ['3. (2 points) In a weighted undirected graph, G, if edges e<sub>1</sub> and e<sub>2</sub> have the same weight, and e<sub>1</sub> is in every minimum spanning tree of G, then e<sub>2</sub> must be in at least one minimum spanning tree of G. (Assume that the graph is connected and has at least 3 nodes)'],
        4: ['4. (2 points) In a weighted undirected graph G with distinct edge weights, the second lightest edge is always part of an MST. (Assume that the graph is connected and has at least 3 nodes)'],
        5: [`5. (2 points) Let G be a connected undirected graph with n vertices and m edges. In every DFS traversal of the graph, the number of back edges is ${blank}, while the number of cross edges is ${blank}.`],
        6: [`6. (1 point) The fastest known algorithm to add two n × n matrices takes Θ(${blank}) time. Here assume additions and multiplications of individual numbers take constant time.`],
        7: [`7. (2 points) Let e be an edge in a connected undirected graph G. The graph G has n vertices and m edges. Deleting the edge e can break the graph into a maximum of ${blank} connected components.`],
        8: [`8. (2 points) Let e be an edge in a strongly connected directed graph G. The graph G has n vertices and m edges. Deleting the edge e can break the graph into a maximum of ${blank} strongly connected components.`],
        9: ['9. (1 point) In every directed graph G, any vertex v can have the largest pre-value (pre[v]) in a DFS traversal, depending on the order of vertices chosen by the traversal.'],
        10: ['10. (1 point) In every directed graph G, any vertex v can have the smallest pre-value (pre[v]) in a DFS traversal, depending on the order of vertices chosen by the traversal.']
      }
    },
    7: {
      preamble: FIB,
      parts: {
        1: [`1. The total runtime of the above algorithm is Θ(${blank}).`, '2. Briefly justify your answer.'],
        3: [
          'Now, we will devise a faster algorithm to compute the n<sup>th</sup>-Fibonacci number. Towards this, we will first derive a different formula for the n<sup>th</sup> Fibonacci number.',
          `Let A[i] denote the following vector with two coordinates: A[i] = ${matrix([['F[i + 1]'], ['F[i]']])} and let M denote the following 2 × 2 matrix: M = ${matrix([['1', '1'], ['1', '0']])}`,
          `Then we have the following identity: A[i] = M A[i − 1]. Here M A[i − 1] denotes the multiplication of the 2 × 2-matrix M, with the 2 × 1 vector A[i − 1]. By induction, we have the following formula for the Fibonacci numbers, A[n] = M<sup>n−1</sup> · ${matrix([['1'], ['1']])}. In the above formula, M<sup>n−1</sup> is the matrix multiplied n − 1 times with itself.`,
          '3. Using the above formula for the Fibonacci numbers, describe how to compute the n<sup>th</sup> Fibonacci number asymptotically faster than the Simple-Fibonacci algorithm. (As always, you may use any algorithm we covered in textbook, lecture or discussions as a black-box).'
        ]
      }
    },
    8: {
      preamble: FOUR,
      parts: {
        1: ['1. The ij<sup>th</sup> entry of matrix B in terms of entries of matrix A is: B[i, j] = ?'],
        2: ['2. If B[i, j] &gt; 0 for some i ≠ j, then what can you say about vertex i and vertex j? (Hint: Carefully observe the expression for B[i, j] from the first part)'],
        3: ['3. A 4-cycle in a graph G consists of 4 vertices u<sub>1</sub>, u<sub>2</sub>, u<sub>3</sub>, u<sub>4</sub> such that (u<sub>1</sub>, u<sub>2</sub>), (u<sub>2</sub>, u<sub>3</sub>), (u<sub>3</sub>, u<sub>4</sub>) and (u<sub>4</sub>, u<sub>1</sub>) are all edges. Describe an algorithm to check if a graph has a 4-cycle in time strictly faster than O(n<sup>2.99</sup>). Your algorithm only needs to detect the existence of the 4-cycle—it doesn’t need to find one.']
      }
    },
    9: {
      preamble: BF,
      parts: {
        1: ['1. For the above graph, with vertex S as starting vertex, what is the minimum number of iterations of the outer loop, after which the distance values to all vertices are guaranteed to be correct, regardless of the edge weights, for the worst possible ordering of the edge updates?'],
        2: ['2. For the above graph, with vertex S as starting vertex, what is the minimum number of iterations of the outer loop, after which the distance values to all vertices are guaranteed to be correct, regardless of the edge weights, for the best possible ordering of the edge updates?']
      }
    },
    10: {
      preamble: CARS,
      parts: {
        1: ['1. Give a brief but precise description of an algorithm for the problem. (Your algorithm should run in a time that is strictly shorter than Θ(n<sup>4</sup>). Partial credit if the runtime depends on the numerical parameters like C<sub>full</sub>, D<sub>full</sub>, C<sub>partial</sub>, D<sub>partial</sub> and edge weights d<sub>e</sub>)'],
        2: ['2. What is the run-time of your algorithm?']
      }
    },
    11: {
      parts: {
        a: [
          'Alice has a list of 2<sup>30</sup> integers on her computer. Bob has a different list of 2<sup>30</sup> integers on his computer. All integers are 32 bits long. So Alice and Bob have about 2<sup>30</sup> ∗ 32 = 32GB of data each.',
          'Alice and Bob want to compute the median of the concatenation of the two lists. Their computers are very powerful, so computational time is no issue. However, the two computers are connected on a very slow data connection.',
          'How can Alice and Bob compute the median of the concatenation of two lists with as little communication between the two computers as possible? Describe the algorithm that Alice and Bob run on their computers, and what they communicate between the computers.',
          '(For full credit, the total communication must be less than 4000 bits, and the algorithm should always succeed. Randomized solutions that succeed with high probability will also receive partial credit.)'
        ]
      }
    }
  }
};
