import {E,Q,P,S,T,A,table} from './builders.js';
export const exam=E('sp22-mt1','Spring 2022','P. Raghavendra and J. Wright',[
Q(1,'Asymptotic analysis',4,[A([
['n²+5n','1000(n+1)²',2,'Both are degree-two polynomials with positive leading coefficients.'],['n³','5n³+(log n)¹⁰',2,'The logarithmic term is lower order; both are Θ(n³).'],['n¹⁰⁰','1.01ⁿ',0,'Every fixed exponential base greater than one eventually beats any fixed polynomial.'],['(log n)⁵+7log n','√n',0,'√n=n¹ᐟ² is a positive polynomial power and beats fixed logarithmic powers.']])],['Even a base close to one eventually beats a fixed polynomial.'],[3]),
Q(2,'Recurrences',6,[
P('1a','256 half-sized calls','Find the tightest upper bound for T(n)=256T(n/2)+O(n²).',[
S('Find the critical exponent','What is log₂256?','8. The O(n²) combine work is smaller than n⁸, so the recursion leaves dominate. With constant base cases, T(n)=O(n⁸).')],'O(n⁸).'),
P('1b','One-step decrease','Find the tightest upper bound for T(n)=T(n−1)+O(n²).',[
S('Unroll the recurrence','What sum bounds all combine costs?','O(1²+2²+…+n²)=O(n³). Since the toll is only specified as O(n²), do not claim a matching lower bound without an extra assumption.')],'O(n³).'),
T('2a','Polynomial bound','For T(n)=T(n−1)+T(n−3)+1 with positive constant bases, is T(n)=O(n¹⁰⁰⁰)?',false,'T is increasing and T(n)≥2T(n−3), so T(n)≥Ω(2ⁿᐟ³). That exponential lower bound beats every fixed polynomial.'),
T('2b','Quasipolynomial bound','For that recurrence, is T(n)=O(n<sup>log n</sup>)?',false,'n<sup>log n</sup>=2<sup>(log n)²</sup>, but the recurrence is at least exponential 2ⁿᐟ³. n/3 grows faster than (log n)².')],['A constant decrement with branching leads to exponential growth.'],[3,4]),
Q(3,'Huffman encoding',5,[
P('1','Letter code lengths','A string has 6n A’s, 2n B’s, n C’s, n D’s. Find the Huffman length of each letter.',[
S('Ignore the common factor','Which weights merge first?','Scale out n: 1+1=2, then 2+2=4, then 4+6=10. A is a root child; B is one level deeper; C,D are deepest.')],'A:1, B:2, C:3, D:3.'),
P('2','Total encoded length','What is the total bit length of the string?',[
S('Weight each depth','How many bits are contributed by each letter?','6n·1+2n·2+n·3+n·3=16n. Counting just the four codeword lengths would ignore their frequency.')],'16n bits.')],['Total encoding length is frequency times depth, summed over symbols.'],[4,5]),
Q(4,'MST execution',4,[
P('1','Prim from H','List the first six edges added by Prim starting at H in the source graph.',[
S('Maintain the active cut','What edges become eligible as vertices join?','HI(7), HG(8), IF(10), FC(3), CB(2), BA(1). Prim starts with a more expensive connection before reaching the cheap upper row; it always chooses the cheapest currently crossing edge.')],'HI, HG, IF, FC, CB, BA.'),
P('2','Kruskal prefix','List Kruskal’s first six accepted edges.',[
S('Scan globally','Which edge is skipped before the sixth acceptance?','AB(1), BC(2), CF(3), DE(4), AD(5) are accepted. BE(6) closes a cycle in A,B,C,D,E,F, so skip it. HI(7) is accepted sixth.')],'AB, BC, CF, DE, AD, HI.')],['Prim and Kruskal inspect different candidate sets.'],[5]),
Q(5,'FFT polynomial multiplication',6,[
P('1','Transform size','P and Q have degrees 40 and 80. Choose power-of-two FFT length n.',[
S('Count coefficients','How many coefficients does the product need?','Degree 120 means 121 coefficients. The smallest power of two at least 121 is 128.')],'128.'),
P('2','A root power','For ω=e<sup>2πi/128</sup>, find ω⁶⁴.',[
S('Halve the circle','What is the exponent’s angle?','ω⁶⁴=e<sup>πi</sup>=−1.')],'−1.'),
P('3','Forward transform count','How many forward FFT calls does the standard polynomial multiplication pipeline use?',[
S('Convert the inputs','How many coefficient vectors must be evaluated?','Two: one transform for P, one for Q. Then multiply corresponding evaluations.')],'2.'),
P('4','Inverse transform count','How many inverse FFT calls does that pipeline use?',[
S('Interpolate the result','How many product evaluation vectors exist?','One. Apply one inverse FFT to recover the product coefficients.')],'1.')],['Product degree determines transform padding.'],[6]),
Q(6,'Quickselect median trace',4,[P('a','Update the retained rank','Select the median of {1,…,101} with successive pivots 70,30,47,51. After each partition, give retained list length and its new k.',[
S('Start with rank 51','What remains after pivot 70?','The target is below 70. Retain 1…69, length 69, rank k=51.'),
S('Subtract discarded lower values','What happens at 30, then 47?','At 30, retain 31…69, length 39, rank 51−30=21. At 47, retain 48…69, length 22, rank 21−17=4.'),
S('Recognize termination','What happens when pivot 51 has retained rank 4?','It is exactly the target, so return 51. The key uses length 0,k=0 as a termination marker; no further recursive subproblem is actually called.')],'70→(69,51); 30→(39,21); 47→(22,4); 51→return (key marker 0,0).')],['After keeping the greater side, subtract all discarded lesser elements and the pivot.'],[7]),
Q(7,'MST with hidden weights',10,[
P('1','Mandatory edges','Find every edge necessarily in every MST of the partly labeled source graph, and justify each.',[
S('Use only known cut comparisons','Which three cuts certify edges?','EF(2) is uniquely lightest across {A,E}; BC(6) is uniquely lightest across {B}, compared with EB(8) and FB(7); CD is the only edge across {D}, hence a bridge. Unknown internal weights cannot change these certificates.')],'EF, BC, CD are mandatory.'),
P('2','Excluded edge','Which edge is necessarily excluded from every MST?',[
S('Find a known cycle','Which edge is largest on E−F−B−E?','EB(8), compared with EF(2) and FB(7). A uniquely heaviest cycle edge is never in an MST.')],'EB is excluded.')],['A bridge is mandatory even when its weight is unknown.'],[8,9]),
Q(8,'Interpret pre/post values',8,[
T('1','Delete F','The displayed DFS forest has A’s children D,F,E, D→C→G and E→H. Does deleting F necessarily separate D and E?',false,'D and E remain connected by tree path D−A−E, which avoids F.'),
T('2','Delete E','Does deleting E necessarily separate G and H?',false,'A possible back edge H−A would keep H connected to G through A,D,C after E is deleted. The timestamps do not rule it out.'),
T('3','Delete A','Does deleting A necessarily separate G and H?',true,'G and H lie in different root-child subtrees. An undirected DFS cannot have edges between such subtrees, so all routes between them pass through A.'),
P('4','Forced bridges','Which edges are necessarily critical in the displayed traversal?',[
S('Inspect the leaf subtree','Can F have a back edge bypassing A−F?','Its only ancestor is A, and a simple graph has no second parallel AF edge. Thus AF is a bridge. Other branches could have back edges to A that bypass their tree edges, so no other bridge is forced. The printed bracket sequence omits B; the answer concerns the displayed tree only.')],'AF only.')],['Root-child subtrees cannot connect without the DFS root.'],[9,10]),
Q(9,'Inequalities',20,[
P('1','All strict inequalities','Assign real values satisfying m constraints xᵢ<xⱼ on n variables, or report impossible.',[
S('Build the dependency graph','Which direction should the edge point?','Create xᵢ→xⱼ. A directed cycle would imply xᵢ<xᵢ, impossible.'),
S('Assign values on a DAG','What if no cycle exists?','Topologically sort and assign each variable its position in the order. Every directed edge then goes from a smaller value to a larger value. Detect cycles and assign in O(n+m).')],'Reject directed cycles; otherwise use topological positions.','O(n+m)'),
P('2','Strict and nonstrict constraints','Now allow both xᵢ<xⱼ and xᵢ≤xⱼ.',[
S('Interpret cycles','What must values in a strongly connected component satisfy?','Nonstrict reachability in both directions forces equality. Mark each edge strict or nonstrict; any strict edge internal to an SCC makes that equality impossible.'),
S('Assign component values','How do you handle the remaining SCC DAG?','If an internal strict edge exists, report impossible. Otherwise topologically order the SCCs and assign each component its order index, giving all members the same value. Across components, values strictly increase, satisfying either edge type.')],'Reject strict edges inside SCCs; topologically assign one value per SCC.','O(n+m)')],['Nonstrict cycles mean equality; a strict inequality inside such a cycle is inconsistent.'],[11,12]),
Q(10,'Most probable sum',12,[P('a','Four independent samples','An integer-valued device outputs i∈1…n with probability pᵢ. Find the most likely sum of four independent outputs in at most O(n²) time.',[
S('Encode one distribution','What polynomial records sample values?','A(x)=Σᵢ₌₁ⁿpᵢxⁱ. Independence and exponent addition mean [xˢ]A(x)⁴ is the probability the four samples sum to s.'),
S('Compute and maximize','How can you obtain the whole distribution efficiently?','Use FFT to square A, then square the result, with padding for final degree 4n. Scan coefficients for sums 4…4n and return an exponent with maximal coefficient, not the coefficient itself. Constantly many size-O(n) products cost O(n log n).')],'Compute A(x)⁴ by FFT and return the index of its largest coefficient.','O(n log n)')],['The mode is a coefficient’s index, not its probability value.'],[13]),
Q(11,'Exactly k red and k blue edges',20,[P('a','Two resource counters','Find a minimum-length s→t walk using exactly k red and k blue edges, allowing repeated original edges. Meet O(k⁴|V|²).',[
S('Create product states','What must the state remember?','(v,r,b), with 0≤r,b≤k. Each red undirected edge gives both oriented transitions that increment r; each blue edge gives transitions incrementing b. Preserve road lengths and omit transitions exceeding k.'),
S('Choose exact endpoints','Where should the search start and finish?','Start (s,0,0); end (t,k,k). Each transformed path corresponds to a walk with exactly those counts, even if it revisits an original vertex. Reconstruct original edges, or return FAIL if unreachable.'),
S('Use the layered DAG','Can you do better than Dijkstra?','Every transition increases r+b, so the expanded graph is a DAG. Relax states in increasing r+b, in O((k+1)²(n+m)), within the requested bound. The key’s Dijkstra solution also works; its array-heap O(((k+1)²n)²) bound directly meets O(k⁴n²) for k≥1.')],'Build states (v,r,b) and find the shortest path from (s,0,0) to (t,k,k).','O((k+1)²(n+m)) using DAG shortest paths')],['Resource increments can create a DAG even when the original graph has cycles.'],[14,15,16]),
Q(12,'Bellman–Ford update counts',5,[
P('1','Smallest count','For the shown 3×3 directed grid from A to J, what smallest number of individual updates can make dist[J] correct?',[
S('Follow a four-edge path','Can fewer than four relaxations reach J?','No path uses fewer than four edges. If the shortest path is A→B→C→F→J and those edges are updated first in order, J becomes final at update 4.')],'4 updates.'),
P('2','Largest count','With one fixed edge order repeated every pass, what largest number of updates can be required before dist[J] is correct?',[
S('Reverse the shortest route','How can each pass advance only one path edge?','There are 12 grid edges. Put the four shortest-path edges last in reverse order: FJ,CF,BC,AB. After each pass, only one more path edge’s distance is final.'),
S('Locate the last relevant update','When is FJ processed on pass four?','At position 9, after three full 12-edge passes: 3·12+9=45. More generally, a four-pass delayed path needs its four edges in decreasing within-pass positions, so its final edge can be no later than position 9. If an earlier forward pair exists, convergence needs fewer passes.')],'45 updates (48 is a sufficient but non-tight bound).')],['Distinguish complete passes from individual edge updates.'],[17,18,19])]);
