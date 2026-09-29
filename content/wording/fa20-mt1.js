// Fall 2020 Midterm 1: the exam's full wording (from sources/2020 Fall Midterm 1 KEY.pdf).
import { math, matrix } from './helpers.js';

const H = (k) => `H<sub>${k}</sub>`;

export default {
  questions: {
    1: {
      parts: {
        a: ['Design a linear time algorithm that given a directed graph G, outputs a cycle in the graph if there is one, or else a source vertex and a sink vertex. Just an algorithm and a clear justification of why it always gives a valid output are needed.']
      }
    },
    2: {
      parts: {
        a: ['(a) Write the 2-by-2 Fourier transform matrix. What root of unity did you use? Write it in the form a + bi.'],
        b: [
          `(b) Denote by ${H(1)} your 2-by-2 solution to the previous part. We recursively define the 2<sup>n</sup>-by-2<sup>n</sup> matrix ${H('n')} as:`,
          math(`${H('n')} = ${matrix([[H('n−1'), H('n−1')], [H('n−1'), '−' + H('n−1')]])}`),
          `Explicitly write down the 4-by-4 matrix ${H(2)}.`
        ],
        c: [
          `From part (b): denote by ${H(1)} the 2-by-2 Fourier transform matrix. We recursively define the 2<sup>n</sup>-by-2<sup>n</sup> matrix ${H('n')} as:`,
          math(`${H('n')} = ${matrix([[H('n−1'), H('n−1')], [H('n−1'), '−' + H('n−1')]])}`),
          `(c) Let N = 2<sup>n</sup>. Given an N-dimensional vector v, give an O(N log N)-time algorithm to compute ${H('n')}v. Just the algorithm and runtime analysis is needed.`
        ]
      }
    },
    3: {
      parts: {
        a: [
          'We want to book a cheap flight route to travel from city s to city t. There are n cities with airports including s and t. Airlines offer m flights, where the i<sup>th</sup> flight goes non-stop from city u<sub>i</sub> to v<sub>i</sub> and costs c<sub>i</sub> dollars (all c<sub>i</sub> are positive integers). We wish to find the cheapest route from s to t, but if there are multiple cheapest routes, we wish to find among them one with the fewest flights (to minimize the number of airports we have to transit through). Give an algorithm that outputs such a flight itinerary, and a clear justification of correctness.',
          'Note: If you modify Dijkstra’s itself, the correctness of Dijkstra’s probably does not imply the correctness of your algorithm. You will have to give a modified version of the proof of correctness as well for full credit. If, on the other hand, you use Dijkstra’s as a black box in your algorithm, using Dijkstra’s correctness as a black box in your proof will probably suffice.',
          'One way you might approach this question is by modifying Dijkstra’s algorithm. In this case you should give a clear description and proof of correctness of your algorithm. For partial credit you may give the key idea in the correctness proof of Dijkstra’s algorithm. Another way you might approach this problem is by using Dijkstra’s algorithm as a subroutine. In this case you may assume the correctness of Dijkstra’s algorithm while proving the correctness of your algorithm.'
        ]
      }
    },
    4: {
      parts: {
        a: [
          'There are n movies on Netflix (identified by the numbers 1, …, n) and Alice and Bob have watched all of them! Alice lists all n movies according to her ranking starting with her favorite (a<sub>1</sub>, …, a<sub>n</sub>) and similarly, Bob lists all movies according to his ranking (b<sub>1</sub>, …, b<sub>n</sub>). One measure of difference between Alice and Bob’s tastes is the number of inversions between their orderings, i.e. the number of pairs of movies u, v such that u is rated higher than v by Alice but lower by Bob. Design an O(n log n) algorithm to compute the number of inversions. Justify the correctness of your algorithm.',
          'Example: if Alice’s ordering is (4, 3, 1, 2), with 4 her favorite movie and 2 her least favorite, and Bob’s ordering is (3, 4, 2, 1), then the number of inversions is 2, corresponding to the pairs 1, 2 and 3, 4.',
          'Note: if you are unable to solve this problem, for half the points you may solve the problem where you are given just one sequence of n numbers (x<sub>1</sub>, ⋯, x<sub>n</sub>), and you wish to compute the number of inversions in that list, i.e. pairs (i, j) such that i &lt; j but x<sub>i</sub> &gt; x<sub>j</sub> (this was covered in lecture!)',
          'If you are solving the problem for full points, you may call the algorithm from lecture as a black box if needed.'
        ]
      }
    }
  }
};
