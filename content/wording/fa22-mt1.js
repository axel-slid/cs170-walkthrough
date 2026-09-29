// Fall 2022 Midterm 1: the exam's full wording (from sources/2022 Fall Midterm 1 KEY.pdf).
import { math, grid } from './helpers.js';

const TF = ['True or false (1 point each).'];
const TIGHT = ['For the following parts, provide the tightest big O bound that you can.'];
const Q3 = ['Ajit has a positive integer n, and James has to figure out what it is. James may guess an integer x, and Ajit will say whether n &gt; x, n = x, or n &lt; x. Please help James use the least amount of guesses possible to figure out Ajit’s integer.'];
const Q5 = [
  'Richard has an array A of n integers and an array B of m integers with log n &lt; m &lt; n. He wishes to compute the maximum dot product between B and every contiguous subarray of A that has length m. The dot product of 2 arrays p and q (both of length r) is defined as',
  math('p · q = Σ<sub>i=1</sub><sup>r</sup> p<sub>i</sub>q<sub>i</sub>'),
  'where p<sub>i</sub> is the i-th element of p (and q<sub>i</sub> is the i-th element of q).'
];
const Q9 = ['Jonathan has an integer n and would like to maximize this integer by performing some sequence of swaps, where two adjacent digits are swapped. For example, if we swap the 1 and the 7 in 710, the resulting number would be 170. However, Jonathan can only perform at most k swaps. Please help Jonathan determine the maximum integer possible after performing at most k swaps.'];

export default {
  instructors: 'J. Demmel and J. Nelson',
  questions: {
    1: {
      parts: {
        1: [...TF, math('1. n<sup>70</sup> = O(n<sup>170</sup>)')],
        2: [...TF, math('2. log(n<sup>170</sup>) = O(log(n<sup>70</sup>))')],
        3: [...TF, math('3. 170<sup>n</sup> = O(70<sup>n</sup>)')],
        4: [...TF, math('4. 70<sup>n</sup> + 170<sup>n</sup> = O(240<sup>n</sup>)')],
        5: [...TIGHT, '5. (1 point) If T(n) = 170T(n/70) + O(n), then T(n) = O(?)'],
        6: [...TIGHT, '6. (1 point) If T(n) = 70T(n/170) + O(n), then T(n) = O(?)'],
        7: [...TIGHT, '7. (4 points) If T(n) = T(n − 1) + 2 · T(n − 2) (We have T(1) = 1 and T(2) = 2), then T(n) = O(?)', 'Note: In case you need to use the quadratic formula, the solutions to the equation ax<sup>2</sup> + bx + c = 0 are x = (−b ± √(b<sup>2</sup> − 4ac)) / 2a.']
      }
    },
    2: {
      parts: {
        1: [
          '1. (4 points) Run Dijkstra’s Algorithm on the above graph for 5 iterations, starting from node C. For each iteration, fill in the below table with the weights of the nodes in the heap as well as the current node that was popped. For vertices that have been popped from the heap already, just fill in the distance to that vertex. The first iteration has been filled in for you already. Break ties in alphabetical order (so node Y before node Z).',
          grid(['Iteration', 'Curr Node', 'A', 'B', 'C', 'D', 'E', 'F', 'G'], [
            ['Start', 'N/A', '∞', '∞', '0', '∞', '∞', '∞', '∞'],
            ['1', 'C', '7', '∞', '0', '∞', '17', '∞', '∞'],
            ['2', '', '', '', '', '', '', '', ''],
            ['3', '', '', '', '', '', '', '', ''],
            ['4', '', '', '', '', '', '', '', ''],
            ['5', '', '', '', '', '', '', '', '']
          ])
        ],
        2: ['2. (3 points) Compute all of the strongly connected components (SCC) of the above graph. For ease of grading, please fill in the SCCs in alphabetical order (and the vertices in each SCC also in alphabetical order). For example, if the SCCs were {U, V} and {T, W}, you should write {T, W} before {U, V}. If there are extra boxes left over, you may leave them blank.']
      }
    },
    3: {
      preamble: Q3,
      parts: {
        1: ['1. (3 points) If we know n ≤ B for some positive integer B, describe an algorithm that uses O(log B) guesses to guess n.'],
        2: ['2. (5 points) If there are no bounds on n (n can be any positive integer), describe an algorithm that uses O(log n) of guesses to guess n. Please explain its runtime as well.']
      }
    },
    4: {
      parts: {
        a: ['Param loves pears. He also loves pairing up his pears. Param has 2N pears, each located at a distinct integer location on the number line. The locations have already been sorted in increasing order. He wishes to pair up his pears, forming N pairs. However, he would like to minimize the sum of distances between the pears in each pair. Design an efficient algorithm to pair up the pairs while minimizing the sum of distance between each of the pairs, and prove its correctness using an exchange argument. You do not have to analyze its runtime.']
      }
    },
    5: {
      preamble: Q5,
      parts: {
        1: ['1. (1 point) Compute the maximum dot product for A = [1, 4, 2, 5, 1] and B = [2, −1].'],
        2: ['2. (9 points) Describe an algorithm to calculate the maximum dot product. Your algorithm must run faster than O(mn) time. Also prove its correctness and analyze its runtime.']
      }
    },
    6: {
      parts: {
        a: ['PNPenguin is in a rectangular igloo, which consists of a m × n grid of rooms. PNPenguin must travel through all of the rooms. However, each room is separated from each of the 4 adjacent rooms by a door, which requires some amount of energy to open. Once a door is opened, it stays open forever. Rooms on the edge of the grid or the corner of the grid are only connected to the 3 or 2 adjacent rooms, respectively. Let c<sub>AB</sub> denote the cost of opening a door between rooms A and B (they must be adjacent). PNPenguin starts at the upper left room, located at (0, 0), but doesn’t care where he ends up as long as he has visited every room. Design an efficient algorithm to help PNPenguin compute the minimum amount of energy needed to open some set of doors such that PNPenguin can travel through all of the rooms. You do have to prove its correctness but you do not have to analyze its runtime.']
      }
    },
    7: {
      parts: {
        a: [
          'PNPenguin has a rectangular igloo, which consists of a m × n grid of rooms; each room is separated from each of the 4 adjacent rooms by a door. Rooms on the edge or the corner of the grid are only connected to the 3 or 2 adjacent rooms. Every minute, PNPenguin chooses one of the doors and opens it; now, the two rooms are connected. Every time PNPenguin opens a door, he would like to know how many new pairs of rooms are connected (i.e. rooms A and B were not connected before the door was opened, but are connected after the door was opened). Rooms A and B are connected if and only if it is possible to get from room A to room B through a sequence of open doors.',
          'Describe an algorithm that can compute the number of pairs of rooms that are connected. Your algorithm must run in O(log(mn)) time every time a door is opened. Also prove its correctness and analyze its runtime. Your algorithm can store the state of the grid (it doesn’t have to start from scratch every time a door is opened), along with other variables if necessary.'
        ]
      }
    },
    8: {
      parts: {
        a: [
          'Shalin is playing a game where he shuffles a deck of n cards, numbered from 1 to n. Then, for each card c drawn from top of the deck, he gets points equal to the number of cards drawn before c that are of smaller value. Note that by construction of the game he is guaranteed to get 0 points from the first (topmost) card picked. His final score is the sum of scores gained from every individual card.',
          'Given an array A that is the permutation of the deck of cards, with the first element corresponding to the topmost card in the deck, design a divide and conquer algorithm to output the total score from that permutation of cards. Also prove its correctness and analyze its runtime.',
          'Example: if n = 3 and A = [2, 1, 3], Shalin’s total score is 2. He gets 0 points from drawing 2, 0 points from drawing 1, and 2 points from drawing 3.'
        ]
      }
    },
    9: {
      preamble: Q9,
      parts: {
        1: ['1. (3 points) If k = +∞, describe an algorithm that runs in O(log n) time that can determine the largest we can make n. You do not need to prove its correctness, but you do need to analyze its runtime.'],
        2: ['2. (1 point) If n = 1263 and we are allowed 1 swap, what is the largest we can make n?'],
        3: ['3. (1 point) If n = 1263 and we are allowed 2 swaps, what is the largest we can make n?'],
        4: ['4. (8 points) Describe an algorithm that runs in polynomial time (in terms of log n and k) that can compute the maximum integer possible after performing at most k swaps. You do not need to prove its correctness nor analyze the runtime.']
      }
    },
    10: {
      parts: {
        a: [
          'n friends are playing a game. k of them are werewolves, while the other n − k of them are villagers. The game is set in a cave with some number of rooms, and rooms may be connected by corridors. At the start of the game, there is a set of broken rooms in the cave that require repairs, and each of the players spawns in a random room. There is no limit on the number of players that can spawn in each room, and it is possible for a player to spawn in a broken room. Everyone then rushes to the closest broken room (determined by number of corridors to get to the room) to either help fix the cave (villager), or pretend to help fix the cave (werewolf). We want to determine how many villagers are in danger because they end up in the same broken room as a werewolf.',
          'Assume that the cave can be represented as an unweighted, undirected graph G = (V, E), where the vertices represent rooms and the edges represent corridors connecting rooms. The set of broken rooms is B ⊆ V. Further assume that all the players take the shortest path to the closest broken room, and there are no ties. Finally, assume that every room has the capacity to hold any number of players.',
          'Design an efficient algorithm to solve this problem and provide its runtime in terms of any of n, k, |V|, |E|, |B|; proof of correctness is not required.'
        ]
      }
    }
  }
};
