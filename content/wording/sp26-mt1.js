// Spring 2026 Midterm 1: the exam's full wording (from sources/2026 Spring Midterm 1 KEY.pdf).
import { diagram } from './helpers.js';

export default {
  questions: {
    1: {
      preamble: [
        'Deep in a mine, a miner is trying to choose which minerals to carry back out. There are n different minerals, each with some quantity q<sub>i</sub> (measured in pounds) available, and some value v<sub>i</sub> per pound. The miner wants to bring back minerals with the maximum possible total value, but can only carry 100 pounds back up. In this problem, you will design an efficient algorithm that computes the maximum value of minerals they can carry subject to this constraint.',
        'For each mineral i, the miner may take any fraction of the available q<sub>i</sub> pounds, subject to the overall 100 pound maximum. That is, there is no restriction to integer values, and you may analyze running time assuming each real number arithmetic operation takes one timestep.'
      ],
      parts: {
        a: ['(a) Give an algorithm to maximize the miner’s value, and analyze the runtime.'],
        b: ['(b) Prove correctness using an exchange argument.']
      }
    },
    2: {
      preamble: [],
      parts: {
        a: [
          'There are n jobs to be run on a computer. Each job j starts at some time s<sub>j</sub>, runs for exactly one hour, and gives a reward payment r<sub>j</sub> if it finishes. Two overlapping jobs cannot both be run. The goal of this question is to design an efficient dynamic programming algorithm to find the maximum total reward obtainable from any set of non-overlapping jobs. It is sufficient to describe your subproblem, recurrence, and base case, and analyze your runtime.',
          'You may assume the jobs j = 1, …, n are given in increasing order of start time s<sub>1</sub> &lt; ⋯ &lt; s<sub>n</sub>.',
          'For example, for the n = 4 jobs drawn below, the maximum reward r<sub>1</sub> + r<sub>3</sub> + r<sub>4</sub> = 5 is given by running jobs 1, 3, 4.',
          diagram('sp26-q2.png', 'Four one-hour jobs on a timeline with rewards 2, 3, 2, 1')
        ]
      }
    },
    3: {
      preamble: [
        'You are given a weighted directed graph G = (V, E) in which one edge has weight −1, and all other edges have weight +1. You want to find the shortest path from a given source vertex s to a target vertex t.'
      ],
      parts: {
        a: ['(a) Give a O(|V| + |E|) time algorithm for this problem, which takes as input the graph G = (V, E), vertices s, t, and the unique edge (u, v) with weight −1. Your algorithm should use breadth-first search.'],
        b: ['(b) Justify the correctness of your algorithm.']
      }
    },
    4: {
      preamble: [
        'Given the n-digit decimal representation of a positive integer, converting it into binary in the natural way takes O(n<sup>2</sup>) steps. In this problem, you will design a more efficient divide-and-conquer algorithm for converting decimal to binary.',
        'Let n be even. Then any n-digit integer can be written as a · 10<sup>n/2</sup> + b where a and b are both n/2-digit integers, e.g. 1342 = 13 · 10<sup>2</sup> + 42.'
      ],
      parts: {
        a: ['(a) Give a divide-and-conquer algorithm to convert an n-digit number to binary.'],
        b: [
          '(b) Argue that the running time of your algorithm in part (a) is O(n<sup>log<sub>2</sub>(3)</sup> · log(n)).',
          'It may be helpful for you to recall that the Karatsuba algorithm for integer multiplication takes O(n<sup>log<sub>2</sub>(3)</sup>) steps to multiply two n-bit integers given in their binary representations.',
          'And, as in Karatsuba, you may assume for simplicity for this question that n is a power of 2.',
          'Note: there is a trick to improving the running time to O(n<sup>log<sub>2</sub>(3)</sup>), so your runtime could be faster than what the question asks for.'
        ]
      }
    },
    5: {
      preamble: ['Attempt this question only if you have time to spare and enjoy challenging problems. Please note that it is worth only 1 point!'],
      parts: {
        a: ['You are given an undirected weighted graph G = (E, V), with non-negative weights w : E → ℤ. You are also given a disjoint set F of zero-weight “free” edges and an integer k. Give an efficient algorithm to find an MST which uses at most k free edges.']
      }
    }
  }
};
