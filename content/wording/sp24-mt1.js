// Spring 2024 Midterm 1: the exam's full wording (from sources/2024 Spring Midterm 1 KEY.pdf).
import { math, code, grid, blank } from './helpers.js';

const WHAT = [
  'Consider the following piece of code:',
  code([
    'Function what(n) {',
    '  If (n < 2) :',
    '    return;',
    '  k ← n',
    '  while k > 1 do {',
    '    for j = 1, 2, 3, ..., n² {',
    '      print BLAH',
    '    }',
    '    k ← k/16',
    '  }',
    '  what(n/2)',
    '}'
  ]),
  'Let T(n) denote the runtime of the what(n).'
];
const EDGES3 = 'A→B, A→E, B→F, C→A, C→B, C→G, D→A, D→E, D→H, E→B, F→I, G→C, G→F, G→J, H→D, H→E, H→I, I→E, I→J, J→F';
const FFT5 = ['In this question, we will run through a polynomial multiplication example via the Fourier transform. Consider two polynomials:', math('P(x) = 1 + x &emsp; Q(x) = 1 + 2x<sup>2</sup>'), 'Suppose we were to compute the product of these two polynomials P(x) and Q(x), using the Fourier transform.'];
const MST7 = [
  'In this graph, some of the edge weights are known, while the rest are unknown.',
  math('cost(A, D) = 1, cost(C, D) = 2, cost(D, E) = 3, cost(C, G) = 4, cost(E, G) = 5, cost(B, D) = 6'),
  'There are two edges that must necessarily belong to a minimum spanning tree, regardless of what the unknown edge weights turn out to be. Justify each of your edges briefly (a sentence or less is enough). Moreover, there is one edge that is necessarily not part of any MST.'
];
const BF = [
  'Recall that Bellman-Ford algorithm for shortest paths in a graph has the following form:',
  code(['(*Outer Loop*) for t = 1 to |V| − 1', '  (*Inner loop*) for each edge e ∈ E', '    update(edge e)']),
  'Here “update(edge e)” modifies the distance values to the nodes in the graph.',
  'Consider the execution of Bellman-Ford algorithm on the following undirected graph with positive edge weights and the source node S.',
  'The convergence of the distance values during the execution of the algorithm depends on the order in which the edges are updated in the inner loop.'
];
const VAC = [
  'You are managing a vacation home for D days. You have received bids from n customers for renting the vacation home. Customer i has submitted a bid of the form: (startDate<sub>i</sub>, endDate<sub>i</sub>, rentPerDay<sub>i</sub>) which means that Customer i wants to rent the vacation home from date startDate<sub>i</sub> to date endDate<sub>i</sub>, and will pay rentPerDay<sub>i</sub> for renting it per day.',
  'Devise an algorithm to determine which subset of customers to rent to, in order to maximize the total profit. Here is the formal description of the problem.',
  'Formal description. Input:<ul><li>There are n customer bids given by (startDate<sub>i</sub>, endDate<sub>i</sub>, rentPerDay<sub>i</sub>) for i = 1, …, n.</li><li>All start dates and end dates are in the range {1, …, D} and rentPerDay<sub>i</sub> is a positive number. Moreover, startDate<sub>i</sub> &lt; endDate<sub>i</sub> for each i.</li></ul>Output: The subset S ⊆ {1, … n} of customers to whom we rent the vacation home, so as to maximize the total rent collected, while satisfying the following constraints:<ul><li>On any given day, the vacation home can be rented to at most one customer.</li><li>Customer i will either rent the home for the entire period between startDate<sub>i</sub> to endDate<sub>i</sub> or will not rent at all.</li><li>The endDate of a customer renting the home can be the same as the startDate of the next customer renting it.</li></ul>'
];
const AIR = [
  'Suppose you are running a travel agency that helps customers book air-tickets. The preference of customers depends on number of hops, flight duration and cost. Here you will design an algorithm to find the most preferred route for customers.',
  'Formal description. Input:<ul><li>A directed graph G = ({1, …, n}, E) whose vertices are cities, and each directed edge i → j is a flight from city i to city j.</li><li>For each directed edge i → j, there are two positive integer weights: duration[i, j], the duration of the flight from i → j, always an integer in {1, …, B}; and cost[i, j], the price of a ticket on flight i → j, always an integer in {1, …, C}.</li><li>A start node s and a destination node t.</li></ul>Output: Find the most preferred route from s to t where the customer’s preferences are as follows:<ul><li>Among two paths P<sub>1</sub>, P<sub>2</sub> from s to t, the customer always prefers the one with fewer hops. (Number of hops is the number of edges on the path).</li><li>If two paths P<sub>1</sub> and P<sub>2</sub> have the same number of hops, then customer prefers the one with shorter total duration.</li><li>If two paths P<sub>1</sub> and P<sub>2</sub> have the same number of hops and the same total duration, then customer prefers the one with lower total cost.</li></ul>'
];
const BIKE = [
  '(We recommend that you attempt this question after finishing other questions on the exam)',
  'We have a road network G = (V, E) between a set of cities. Each city v is at an altitude h[v]. Two cities {u, v} are said to be bikeable from one another, if we can bike u to v and back. The crucial constraint is that bikes can’t go uphill, i.e., bikes can’t go from one city to a neighboring city with a higher altitude. For each city u, we would like to find some partner city v such that {u, v} are bikeable from one another.',
  'Note: It was clarified during the exam that bikes actually can go uphill; ignore the sentence “The crucial constraint is that bikes can’t go uphill...”. Refer to the formal description of the problem below.',
  'Formal description. Input:<ul><li>1. An undirected graph G = (V, E).</li><li>2. For each vertex v ∈ V, we are given its altitude h[v]. h(v) is a positive integer.</li></ul>A pair of vertices {u, v} are said to be bikeable from each other if<ul><li>Altitudes of u and v are the same, h[u] = h[v].</li><li>There is some path P from u to v, where all the intermediate vertices have altitude at most h[u] (and h[v]).</li></ul>Output: For every vertex u, find some vertex v such that {u, v} are bikeable from each other, if there exists at least one such vertex v.'
];

export default {
  instructors: 'C. Borgs and P. Raghavendra',
  questions: {
    1: { parts: { a: ['For each pair of functions f and g, specify whether f = O(g), g = O(f), or both.'] } },
    2: {
      preamble: WHAT,
      parts: {
        1: ['1. Write the recurrence relation for T(n).'],
        2: ['2. Solve the recurrence relation for T(n). Write down the tightest bound O() possible, proof is not needed.']
      }
    },
    3: {
      parts: {
        1: ['1. Perform DFS in the graph starting at node A and write down the pre and post numbers. Break ties alphabetically.', grid(['Vertex v', 'pre[v]', 'post[v]'], ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((v) => [v, '', '']))],
        2: [`2. List all cross edges if any. The edges are: ${EDGES3}.`],
        3: ['3. In this class, we have learnt an algorithm to compute the strongly connected components (SCCs) of a directed graph. Write down the strongly connected components (SCCs) in the above graph in the same order in which the algorithm outputs them. If there are multiple possible orderings, write the lexicographically smallest one.']
      }
    },
    4: {
      parts: {
        1: ['1. In the graph below, what would be the fourth and fifth edges added by Kruskal’s algorithm?'],
        2: ['2. Draw the union-find trees (no path compression) after the inclusion of the fourth edge.'],
        3: ['3. In the same graph, what would be the fourth and fifth edges added by Prim’s algorithm started at A?'],
        4: [`4. Suppose we run Prim’s algorithm and Dijkstra’s algorithm, both starting from A. Consider the step at which the two algorithms delete different nodes from the priority queue for the first time. In this step, Prim’s algorithm deletes ${blank} from priority queue, while Dijkstra’s algorithm deletes ${blank}.`, 'Note that in both algorithms, the first vertex to be deleted from the priority queue is the vertex A.']
      }
    },
    5: {
      preamble: FFT5,
      parts: {
        1: ['1. What is the smallest n for which we can use the n<sup>th</sup> root of unity?'],
        2: ['2. For the above value of n, list the n<sup>th</sup> roots of unity.'],
        3: ['3. What is the Fourier transform associated with the polynomial P?'],
        4: ['4. What is the Fourier transform associated with the polynomial Q?'],
        5: ['5. What is the Fourier transform associated with the product of polynomials P and Q? (No need to simplify the expressions completely)']
      }
    },
    6: {
      parts: {
        1: [`1. A document consists of symbols A, B, C, D, E with frequencies 1, 3, 3<sup>2</sup>, 3<sup>3</sup>, 3<sup>4</sup> respectively. Suppose we run Huffman encoding on these letters, the letter C will be encoded using ${blank} bits.`],
        2: ['2. Let Select(S, k) denote the randomized Select algorithm that finds the k<sup>th</sup> smallest number in a set S. Consider the execution of Select(a[1, …, n], 1) on an array of distinct integers a[1, …, n]. What is the probability that this algorithm needs n − 1 recursive calls before returning the 1<sup>st</sup>-smallest element? (Here n − 1 recursive calls do not include the outer call Select(a[1, …, n], 1))'],
        3: ['3. Strassen’s matrix multiplication algorithm uses fewer multiplications than the naive algorithm for matrix multiplication. However, it uses more additions than the naive algorithm. True or False?'],
        4: [`4. In a directed acyclic graph (DAG), if pre[u] &lt; pre[v] &lt; post[v] &lt; post[u] then edge ${blank} is necessarily absent.`],
        5: [`5. A DAG on n vertices can have at least ${blank} SCCs and at most ${blank} SCCs.`],
        6: [`6. Fast Fourier transform (FFT) algorithm on vector [1, 2, 3, 4, 1, 2, 3, 4] makes two recursive calls to FFT on 4-dimensional vectors. Specifically, the calls are for FFT on vectors ${blank} and ${blank}.`],
        7: [`7. If Fourier transform of [a, b, c, d] is [α<sub>0</sub>, α<sub>1</sub>, α<sub>2</sub>, α<sub>3</sub>], then Fourier transform of [a, 0, b, 0, c, 0, d, 0] is ${blank}.`],
        8: [`8. On a graph with n vertices and m edges, Dijkstra’s algorithm executes ${blank} many DeleteMin operations and ${blank} DecreaseKey operations on its priority queue.`],
        9: ['9. If the edge-lengths of a graph are distinct then the shortest path between any two nodes is unique. True or False?'],
        10: ['10. In a graph with positive and negative weights, if we cube all the edge-weights in a graph, every MST continues to be an MST. True or False?'],
        11: ['11. In a graph with positive and negative weights, if we square all the edge-weights in a graph, every MST continues to be an MST. True or False?']
      }
    },
    7: {
      preamble: MST7,
      parts: {
        1: ['1. Edge ___ necessarily belongs to an MST because …'],
        2: ['2. Edge ___ necessarily belongs to an MST because …'],
        3: ['Edge ___ is necessarily NOT part of any MST because …']
      }
    },
    8: {
      preamble: BF,
      parts: {
        1: ['1. For the above graph, with vertex S as starting vertex, what is the minimum number of iterations of the outer loop, after which the distance values to all vertices are guaranteed to be correct, regardless of the edge weights?'],
        2: ['2. Briefly justify your answer.']
      }
    },
    9: {
      preamble: VAC,
      parts: {
        1: ['1. Give a succinct and precise description of the algorithm.'],
        2: ['2. What is the runtime of your algorithm?']
      }
    },
    10: {
      preamble: AIR,
      parts: {
        1: ['1. Devise an algorithm to find the most preferred path from start node s to destination node t. Give a succinct and precise description of the algorithm. (Proof of correctness is not necessary).'],
        2: ['2. What is the runtime of your algorithm?']
      }
    },
    11: {
      preamble: BIKE,
      parts: {
        1: ['1. Succinctly and precisely describe an algorithm for the problem. (For non-zero credit, your algorithm should run in time O((|V| + |E|) · log |V|). Faster run-times mean higher credit.)'],
        2: ['2. What is the runtime of your algorithm?']
      }
    }
  }
};
