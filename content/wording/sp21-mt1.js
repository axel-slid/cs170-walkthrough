// Spring 2021 Midterm 1: the exam's full wording (from sources/2021 Spring Midterm 1 KEY.pdf).
import { math, matrix } from './helpers.js';

const Q1 = ['Rosa is a peach farmer. She has to tend to n fields, and all fields are ready for harvest! She must decide in which order to harvest the fields, as she can only harvest one field of peach trees a day. Due to differing soil and geographical conditions, each field has a different water requirement (that stays the same for all days) if it’s not harvested, with field i needing ℓ<sub>i</sub> &gt; 0 liters of water per day.'];
const Q2 = ['You are participating in a gameshow in which you are presented with a set of m boxes in a line, each containing an arbitrary unique number. Your goal is to find a box whose number is larger than that of the box to its left and the box to its right (unless it’s box 1 or m, in which case it needs to be larger than just the number of the box it is next to), while opening as few boxes as possible.'];
const Q3 = [
  'Quentin wants to travel from San Francisco to New York by bus. Assume that there are n − 2 cities he could change buses at on his way (so n cities total), with a total of m direct bus rides between pairs of cities (assume each ride is one-way). The i<sup>th</sup> bus ride has price p<sub>i</sub> and all prices are positive integers. Quentin wants to travel as cheaply as possible, while booking a trip such that the sum of all bus ride prices is a multiple of 5 dollars, as he hates small change.',
  'Find an algorithm that finds the cheapest way to get from San Francisco to New York while paying a multiple of 5 dollars for the trip.'
];
const Q4 = [
  'A striped matrix is an n-by-n matrix A such that a<sub>ij</sub> = a<sub>i−1,j−1</sub> for i = 2, 3, …, n and j = 2, 3, …, n. For example this is a striped matrix:',
  math(matrix([['1', '3', '5', '7'], ['2', '1', '3', '5'], ['4', '2', '1', '3'], ['6', '4', '2', '1']]))
];

export default {
  instructors: 'A. Chiesa and J. Demmel',
  questions: {
    1: {
      preamble: Q1,
      parts: {
        a: ['(a) Describe an algorithm that allows Rosa to harvest the fields in such an order that she minimizes the amount of water used by all fields together.'],
        b: ['(b) Prove that your algorithm is correct.'],
        c: ['(c) Analyze the runtime of your algorithm.']
      }
    },
    2: {
      preamble: Q2,
      parts: {
        a: ['(a) Describe an algorithm to find a box whose number is bigger than that of both of its neighbors. Your solution should run faster than O(m).'],
        b: ['(b) Prove that your algorithm is correct.'],
        c: ['(c) Analyze how many boxes your algorithm opens in the worst case. Your final answer should be of the form O(f(m)), where f is some function that you specify.']
      }
    },
    3: {
      preamble: Q3,
      parts: {
        a: ['(a) Describe your algorithm.', 'Hint: Think about how you can use a similar approach to what you used in a homework problem to solve this question. Furthermore, since all prices are integers, note that there are really only 5 cases you need to consider. It might also help to first consider a case where Quentin wants to end up with an even price.'],
        b: ['(b) Prove that your algorithm is correct.', '(You can use any algorithm from lecture as a sub-routine, and you do not have to re-argue its correctness.)'],
        c: ['(c) Analyze the runtime of your algorithm.']
      }
    },
    4: {
      preamble: Q4,
      parts: {
        a: ['(a) Show how to represent a striped matrix using O(n) space instead of the O(n<sup>2</sup>) representation shown above.'],
        b: ['(b) Describe an O(n log n)-time algorithm for multiplying an n-by-n striped matrix A (represented in your O(n)-space format from Part (a)) by a vector v of length n.'],
        c: ['(c) Assume you have a working solution to Part (b). Using that solution, describe an O(n<sup>2</sup> log n) algorithm for multiplying an n-by-n striped matrix A with an n-by-n matrix, M.'],
        bonus: ['Extra credit (1 pt): Describe a faster algorithm if M is also a striped matrix. Do not try this unless you have extra time.']
      }
    }
  }
};
