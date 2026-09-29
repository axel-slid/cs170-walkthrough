// Spring 2020 Midterm 1: the exam's full wording (from sources/2020 Spring Midterm 1 KEY.pdf).
import { math, grid, code } from './helpers.js';

const TF = ['Mark your choice for each of the following. Fill in the bubble completely, as incomplete markings will not be given credit.', 'Grading: +1 for each correct answer, 0 for leaving blank, and −1 for each incorrect answer. Any negative score will affect your entire exam.'];
const REC = ['Write down the solutions to the following recurrence relations (only the final answer is needed). Write down the tightest bound that you can derive. You may use big-O notation.'];
const CYCLES = [
  '(b) Consider the graph above. The graph has exactly four negative cycles: T<sub>0</sub>T<sub>1</sub>T<sub>2</sub> (which we will call cycle T), U<sub>0</sub>U<sub>1</sub>U<sub>2</sub> (which we will call cycle U), V<sub>0</sub>V<sub>1</sub>V<sub>2</sub> (which we will call cycle V), W<sub>0</sub>W<sub>1</sub>W<sub>2</sub> (which we will call cycle W).',
  'We say that the distance path between nodes X and Y is not well-defined if for any path from X to Y, you can find a strictly shorter path (e.g. there’s a path of length 10 from X to Y, one of length 5 from X to Y, one of length 0, one of length −5, etc).',
  'Notice how if there is a negative cycle on the path from the X to the Y, then the distance path is not well defined.'
];
const PART_C = [
  'The main insight from the previous problem is the shortest path can still be well-defined between some pairs of vertices despite the existence of negative cycles.',
  '(c) Give an algorithm that takes in a weighted directed graph G = (V, E) (potentially with negative weight cycles) along with two vertices s and t as input, and outputs the length of the shortest path between s and t if it is well-defined and the string “no well-defined shortest path” otherwise.',
  'Any algorithm that correctly solves this problem and runs in time polynomial in |V| and |E| will receive full credit. You may freely use algorithms covered in lecture in a black-box fashion.',
  'Hint: modify the graph and feed the modified graph to the Bellman–Ford algorithm.'
];

export default {
  instructors: 'A. Chiesa and J. Nelson',
  questions: {
    1: { parts: { a: ['For each question, fill in all circles that apply: f = O(g)? and g = O(f)?'] } },
    2: {
      preamble: TF,
      parts: {
        a: ['(a) A DAG does not necessarily have a unique topological ordering.'],
        b: ['(b) On graphs with negative edge weights, Dijkstra does not work since it does not necessarily halt; otherwise, once it halts, it outputs the correct solution.'],
        c: ['(c) If DFS on a directed graph G = (V, E) produces exactly one back edge, then it is always possible to remove an edge e from the graph G such that G′ = (V, E − {e}) is a DAG.'],
        d: ['(d) If the directed graph G contains a cycle, and removing an edge from G can make it acyclic, then any DFS on G would produce exactly one back-edge.'],
        e: ['(e) If DFS on a directed graph G = (V, E) produces two back edges, there must be at least two strongly connected components which each have at least 2 vertices in the original graph.']
      }
    },
    3: {
      preamble: REC,
      parts: {
        a: [math('(a) T(n) = 23T(n/3) + 2n<sup>3</sup>')],
        b: [math('(b) T(n) = 3T(n<sup>1/3</sup>) + 5n, and T(3) = 3.')],
        c: [math('(c) T(n) = 8T(n − 3) + 1, and T(0) = T(1) = T(2) = 1.')],
        d: [math('(d) T(n) = T(n/5) + T(4n/5) + 3n<sup>2</sup>')]
      }
    },
    4: {
      preamble: [
        'Execute Dijkstra’s algorithm on the following graph starting at vertex A and breaking ties alphabetically.',
        'Here is the algorithm for reference. Assume that decreasekey does nothing if the vertex is not in the heap.',
        code([
          'Dijkstras(G, l, s)',
          '  for all u ∈ V do',
          '    dist(u) = ∞',
          '    prev(u) = null',
          '  end for',
          '  dist(s) = 0',
          '  H = makequeue(V) (using dist-values as keys)',
          '  while H is not empty do',
          '    u = deletemin(H)',
          '    for all edges (u, v) ∈ E do',
          '      if dist(v) > dist(u) + l(u, v) then',
          '        dist(v) = dist(u) + l(u, v)',
          '        prev(v) = u',
          '        decreasekey(H, v)',
          '      end if',
          '    end for',
          '  end while',
          '  return dist'
        ])
      ],
      parts: {
        a: ['Fill in the following table with the shortest paths computed by Dijkstra’s algorithm:', grid(['A', 'B', 'C', 'D', 'E', 'F', 'G'], [['', '', '', '', '', '', '']])]
      }
    },
    5: {
      preamble: ['In this question, assume you can multiply two d-bit integers in time O(d<sup>1.59</sup>). Given an integer n, design an algorithm to compute n! that runs in time O(n<sup>1.59</sup> log<sup>c</sup> n) for some constant c &gt; 0. Hint: divide and conquer.'],
      parts: {
        a: ['(a) Describe your algorithm succinctly below.'],
        b: ['(b) Provide a rigorous analysis for the runtime of your algorithm. Recall you showed on homework that log(n!) = Θ(n log n).']
      }
    },
    6: {
      preamble: [
        '5 charged particles are placed on a line. Particle i is placed at point i on the x-axis with charge c<sub>i</sub>. The force on particle j in the system is',
        math('f<sub>j</sub> = Σ<sub>i&lt;j</sub> c<sub>i</sub>/(i − j)<sup>2</sup> − Σ<sub>i&gt;j</sub> c<sub>i</sub>/(i − j)<sup>2</sup>.')
      ],
      parts: {
        a: ['(a) Set up two polynomials p(x) and q(x) so that f<sub>1</sub>, …, f<sub>5</sub> appear as coefficients of p(x) · q(x). (It is okay if p(x) · q(x) have other irrelevant coefficients as well.) Your answer should depend on c<sub>1</sub>, …, c<sub>5</sub>.'],
        b: ['(b) What is the index of the coefficient of p(x) · q(x) corresponding to f<sub>3</sub>? (e.g. if it is the coefficient of x<sup>2</sup>, write 2.)']
      }
    },
    7: {
      preamble: [
        'Let T be an unweighted and undirected tree on vertex set V = {1, …, 2n}. E(T) is the set of T’s edges, and V(T) is the set of its vertices. We call a collection of n pairs P = {(u<sub>1</sub>, v<sub>1</sub>), …, (u<sub>n</sub>, v<sub>n</sub>)} a valid pairing if for i = 1, …, n, u<sub>i</sub> ≠ v<sub>i</sub> and each vertex v ∈ V occurs in exactly one of the n pairs. We define the cost of a valid pairing P as',
        math('f<sub>T</sub>(P) := Σ<sub>i=1</sub><sup>n</sup> d<sub>T</sub>(u<sub>i</sub>, v<sub>i</sub>)'),
        'where d<sub>T</sub>(a, b) is the length of the shortest path between a and b in T. In this question we will see an O(n) time algorithm to compute the minimum cost of a valid pairing; in particular, to compute',
        math('OPT(T) := min<sub>P valid pairing</sub> f<sub>T</sub>(P).'),
        'We emphasize that OPT(T) is a number — namely the minimum value attained by f (We don’t ask you to output the a pairing with minimum cost.)'
      ],
      parts: {
        a: [
          '(a) Let P<sup>∗</sup> = {(u<sub>1</sub>, v<sub>1</sub>), …, (u<sub>n</sub>, v<sub>n</sub>)} be a valid pairing such that f<sub>T</sub>(P<sup>∗</sup>) = OPT(T) and let p<sub>t</sub> denote the unique path between vertices u<sub>t</sub> and v<sub>t</sub> in T. Prove that for any i, j ∈ {1, …, n} such that i ≠ j, p<sub>i</sub> and p<sub>j</sub> are edge-disjoint. We say two paths p<sub>i</sub> and p<sub>j</sub> are edge-disjoint if the collection of edges used by p<sub>i</sub> does not intersect the collection of edges used by p<sub>j</sub>. You are encouraged to illustrate your proof idea in a diagram.',
          'Hint: What if for some i &lt; j, p<sub>i</sub> and p<sub>j</sub> shared an edge e? Can you make a small change to P<sup>∗</sup> to obtain a new pairing P′ with f(P′) &lt; f(P<sup>∗</sup>)?'
        ],
        b: [
          '(b) Let P<sup>∗</sup> and p<sub>t</sub> be defined as in part (a) and let L ⊆ E(T) be a subset of edges defined as follows:',
          math('L := {e : ∃ p<sub>t</sub> such that e ∈ p<sub>t</sub>}.'),
          'Deleting an edge e ∈ E(T) splits T into two trees T<sub>e,1</sub> and T<sub>e,2</sub>. Prove that e ∈ L if and only if |V(T<sub>e,1</sub>)| and |V(T<sub>e,2</sub>)| are both odd numbers.',
          'Try to use the result of part (a) to show that if |V(T<sub>e,1</sub>)| and |V(T<sub>e,2</sub>)| are both even, then e ∉ L. You will additionally need to argue that if |V(T<sub>e,1</sub>)| and |V(T<sub>e,2</sub>)| are both odd, then e ∈ L.'
        ],
        c: [
          '(c) Use the result of part (b) to devise an algorithm to compute OPT(T). Full points will be given for an O(n)-time algorithm.',
          'Hint: Observe that OPT(T) = f(P<sup>∗</sup>) = |L| where L is defined in part (b).'
        ]
      }
    },
    8: {
      parts: {
        a: [
          '(a) Draw a weighted directed graph G with the following properties:<ul><li>(i) it contains a negative-weight cycle,</li><li>(ii) it has two vertices S and T such that the length of the shortest path between S and T is positive.</li></ul>',
          'Make sure to explicitly write the weight of each directed edge in the graph you draw! The distance between S and T in your graph should be positive.',
          '(The graph shown above belongs to part (b).)'
        ],
        'b.i': [...CYCLES, '(i) Consider what happens if all negative cycles except one are removed from the graph. You would like the distance from S to B to be well-defined. Mark all of the negative cycles for which keeping only that negative cycle results in the distance from S to B being well-defined. (T / U / V / W)'],
        'b.ii': [...CYCLES, '(ii) Consider what happens if all negative cycles except one are removed from the graph. You would like the distance from S to E to be well-defined. Mark all of the negative cycles for which keeping only that negative cycle results in the distance from S to E being well-defined. (T / U / V / W)'],
        'b.iii': [...CYCLES, '(iii) Consider what happens if all negative cycles except one are removed from the graph. You are interested if Bellman-Ford starting from S then reports that distances are not well-defined. Mark all of the negative cycles for which keeping only that negative cycle results in Bellman-Ford starting from S reporting that distances are not well-defined. (T / U / V / W)'],
        'b.iv': [...CYCLES, '(iv) Now consider what happens if all negative cycles are removed from the graph, and you run Bellman-Ford starting from S. True or false: The shortest-paths tree produced by Bellman-Ford in this case is independent of the order in which it updates the edges.'],
        'c.i': [...PART_C, '(i) Give a description of your algorithm.'],
        'c.ii': [...PART_C, '(ii) Give a run-time analysis of your algorithm.']
      }
    }
  }
};
