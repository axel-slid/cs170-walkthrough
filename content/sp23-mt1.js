import {E,Q,P,S,T,A,table} from './builders.js';
const possibility=(id,name,ask,yes,why)=>P(id,name,ask,[{...S('Test the traversal','Can a suitable DFS exploration order produce this?',why),choices:['Possible','Impossible'],correct:yes?0:1}],yes?'Possible.':'Impossible.');
export const exam=E('sp23-mt1','Spring 2023','P. Raghavendra and J. Wright',[
Q(1,'Asymptotic analysis',4,[A([
['n³+log n+17','n²+7log n',1,'Leading terms n³ and n² decide the comparison.'],['n²+4ⁿ','n⁴+2ⁿ',1,'Exponentials dominate polynomials, and 4ⁿ grows faster than 2ⁿ.'],['log n','log(n²)',2,'log(n²)=2log n, a constant-factor difference.'],['3<sup>log₂n</sup>','n²',0,'3<sup>log₂n</sup>=n<sup>log₂3</sup>; log₂3≈1.585<2.']])],['a<sup>log_b n</sup>=n<sup>log_b a</sup>.'],[2]),
Q(2,'Runtime analysis',6,[
P('1','Recurrence','what(n) makes three what(n/3) calls and prints inside loops i=1…√n, j=1…√n−i. Write its recurrence.',[
S('Sum the triangular loop','How many prints occur locally?','With k=√n, the print count is (k−1)+(k−2)+…+0=k(k−1)/2=Θ(n). Three one-third calls give T(n)=3T(n/3)+Θ(n).')],'T(n)=3T(n/3)+Θ(n).'),
P('2','Solve','Solve the recurrence tightly.',[
S('Measure each level','Do the three child sizes sum to the parent size?','Yes. Each full level costs Θ(n), and there are Θ(log₃n) levels. Total Θ(n log n).')],'Θ(n log n).','Θ(n log n)')],['A triangular loop with side √n has linear work.'],[2,3]),
Q(3,'Connectivity in graphs',8,[
P('1','DFS timestamps','Run alphabetical DFS over the source graph; fill all pre/post values.',[
S('Trace entries and exits','What is the first discovery sequence?','A,B,E,H,D,I,J,F,G. D finishes before I is explored; F finishes before G is explored. Complete A’s tree, then start C.'),
S('Read nested intervals','What timestamps result from one entry/exit clock?','The answer table records all pairs. An ancestor’s interval encloses its descendants, while sequential branches have disjoint intervals.')],'Use a shared clock from 1 to 20.','',{key:{gist:'A(1,18), B(2,17), C(19,20), D(5,6), E(3,16), F(9,10), G(11,12), H(4,15), I(7,14), J(8,13).',body:[],...table(['Vertex','pre','post'],[['A',1,18],['B',2,17],['C',19,20],['D',5,6],['E',3,16],['F',9,10],['G',11,12],['H',4,15],['I',7,14],['J',8,13]])}}),
P('2','Cross edges','Mark cross edges in the source graph.',[
S('Find disjoint intervals','Which directed edges point from a later branch to an earlier one?','G→F, C→B, C→G. F’s interval 9…10 is already finished when G is visited at 11. The key prints “FG,” but the graph and edge list show G→F; keep the direction.')],'G→F, C→B, C→G.'),
P('3','SCCs in alphabetical order','List SCCs ordered by their smallest member.',[
S('Group mutual reachability','Which directed cycles connect the large group?','A,B,D,E,H form one SCC. G and J form another. C,F,I are singleton SCCs. Ordering smallest members gives {A,B,D,E,H}, {C}, {F}, {G,J}, {I}.')],'{A,B,D,E,H}, {C}, {F}, {G,J}, {I}.')],['Keep directed edge orientation explicit when reading a key.'],[3,4,5]),
Q(4,'Bellman–Ford execution',6,[
P('1','When A is final','Edges E1…E5 are relaxed in that order repeatedly. At which individual relaxation is dist[A] guaranteed correct?',[
S('Check possible shortest routes','When has the path S→C→A been propagated?','E4 establishes C’s label at relaxation 4; E5 sends it to A at 5. The direct S→A path was considered at 1. Positive weights rule out helpful cycles. Thus 5 is the guarantee.')],'Relaxation 5.'),
P('2','When B is final','At which individual relaxation is dist[B] guaranteed correct?',[
S('Wait for its final predecessor','When is A→B relaxed after A becomes final?','E2 is first relaxed at 2, potentially too early. It is revisited at 7, after A is correct at 5. Then every possible shortest route to B has been considered.')],'Relaxation 7.'),
P('3','When C is final','At which individual relaxation is dist[C] guaranteed correct?',[
S('Consider both ways in','When have both S→A→B→C and S→C been considered?','The first route propagates through E1,E2,E3 at steps 1,2,3. The direct route is relaxed at E4, step 4. C is then correct.')],'Relaxation 4.')],['Track the sequence of individual relaxations along candidate shortest paths.'],[6]),
Q(5,'Minimum spanning tree',6,[
P('1','Prim from A','List the first six edges added by Prim, breaking ties lexicographically.',[
S('Maintain the tree cut','Why does BE win the first tie after AB?','From A choose AB(9). From {A,B}, BE(9) is preferred to BF(9) lexicographically. Then choose DE(1), EH(3), HG(2), HI(7), always selecting the lightest current crossing edge.')],'AB, BE, DE, EH, GH, HI.'),
P('2','Kruskal prefix','List the first seven edges accepted by Kruskal, using any valid tie-break.',[
S('Scan sorted weights','Which low edge closes an early cycle?','DE(1), GH(2), EH(3) join components. DG(4) is rejected because D,E,H,G are already connected. Accept CJ(5), JK(6), then FK(7) and HI(7) in either order.')],'DE, GH, EH, CJ, JK, FK, HI; last two may swap.')],['A later Prim edge may be lighter than an earlier one.'],[7]),
Q(6,'Short answers',18,[
P('1','A four-point transform','Find the Fourier transform of [1,1,0,0] in the positive-exponent convention.',[
S('Evaluate the polynomial','What is 1+x at 1,i,−1,−i?','[2,1+i,0,1−i].')],'[2,1+i,0,1−i].'),
P('2','Fourth powers of roots','n>16 is a power of two. How many distinct fourth powers of the nth roots of unity are there?',[
S('Count repeats','What does multiplying the exponent by four do modulo n?','The map j↦4j mod n has four preimages per output because 4 divides n. Thus there are n/4 distinct outputs, the (n/4)th roots.')],'n/4.'),
P('3','Cube transform values','InverseFFT([a₀,…,a₇])=[0,0,2,0,0,0,0,0]. What is InverseFFT([a₀³,…,a₇³])?',[
S('Identify the polynomial','What coefficients produced the original evaluations?','P(x)=2x². Cubing evaluations gives evaluations of P(x)³=8x⁶.'),
S('Place its coefficient','Does degree six wrap modulo eight?','No. The only nonzero coefficient is 8 at index 6. The result is [0,0,0,0,0,0,8,0].')],'[0,0,0,0,0,0,8,0].'),
P('4','Quickselect pivot count','For randomized Select seeking the median of n values, give best, worst and expected numbers of pivots.',[
S('Compare pivot quality','What happens with perfect or extreme pivots?','A median pivot answers immediately: Θ(1). Repeated extreme pivots may discard only one value each: Θ(n). Random pivots shrink the surviving subproblem by a constant factor often enough to give Θ(log n) expected pivot count.','Expected runtime is Θ(n), but this question asks for the number of pivots, not all partition work.')],'Best Θ(1); worst Θ(n); expected Θ(log n).'),
P('5a','Add an implication','Horn-SAT’s least assignment is (T,F,T,F,T). Does adding x₁⇒x₂ necessarily make the formula unsatisfiable?',[
S('Propagate the new truth','Could x₂ simply become true?','Yes in some formulas. x₁ is forced true, so the implication forces x₂ true, but a previously false least-model variable may be true in another model. Other constraints might still conflict, so the correct answer is “may be satisfiable.”')],'May be satisfiable.'),
P('5b','Add a negative clause','Does adding ¬x₁∨¬x₃ necessarily make that instance unsatisfiable?',[
S('Use forced truths','Are x₁ and x₃ optional?','No. Both are true in the least model and therefore forced true in all satisfying assignments. Both negations are false, so the new clause cannot hold.')],'Necessarily unsatisfiable.'),
P('5c','Negate a forced variable','Does adding ¬x₅ necessarily make it unsatisfiable?',[
S('Check the least assignment','What does x₅=true prove?','The Horn propagation forces x₅ in every model. Adding its negation contradicts that forced value.')],'Necessarily unsatisfiable.')],['FFT turns pointwise powers into polynomial powers; least-model truths cannot be undone.'],[8,9]),
Q(7,'DFS orders on a chain',5,[
possibility('1','Increasing preorder','For A→B→C→D→E→F, can pre[A]<pre[B]<…<pre[F]?',true,'Start at A. DFS follows the full chain in that order.'),
possibility('2','Decreasing preorder','Can pre[A]>pre[B]>…>pre[F]?',true,'Start fresh roots in order F,E,D,C,B,A. Each outgoing successor is already visited, so each root finishes alone.'),
possibility('3','Decreasing postorder','Can post[A]>post[B]>…>post[F]?',true,'Start at A. The recursion stack unwinds F,E,D,C,B,A.'),
possibility('4','Increasing postorder','Can post[A]<post[B]<…<post[F]?',false,'In any DAG, edge u→v forces post[u]>post[v], whether v is discovered recursively or already finished. Thus post[A]<post[B] contradicts A→B.'),
possibility('5','Mixed preorder','Can pre[F]<pre[C]<pre[D]<pre[E]<pre[A]<pre[B]?',true,'Explore root F, then root C (which discovers D,E), then root A (which discovers B and finds C already visited).')],['In a DAG, every edge goes from a later-finishing vertex to an earlier-finishing one.'],[10]),
Q(8,'Possible Huffman trees',6,[
P('1','Tree 1','A length-100 string has 30 A’s and 40 B’s. Is source tree 1 possible?',[
S('Compare code lengths','Can the more frequent symbol be given a strictly longer code in an optimum?','No: swapping A and B would reduce total weighted length. Tree 1 gives B greater depth than A, so it cannot be a Huffman tree.')],'Impossible.'),
P('2','Tree 2','Is source tree 2 possible for some frequencies of C,D,E?',[
S('Give witness frequencies','What if C=D=E=10?','Merge two tens into 20, then the remaining 10 with 20 into 30. Merge that subtree with A=30 into 60, then with B=40 into 100. This matches tree 2, with B at depth 1 and A at depth 2.')],'Possible: C=D=E=10.'),
P('3','Tree 3','Is source tree 3 possible?',[
S('Use the exchange test','Which symbol is deeper?','B is deeper than A although B is more frequent. Swapping their labels decreases cost, so the tree is not optimal and cannot be produced by Huffman.')],'Impossible.'),
P('4','Tree 4','Is source tree 4 possible?',[
S('Use the remaining total','What is the combined frequency of C,D,E?','30. These three symbols combine before A and B can merge together; their aggregate then merges with A=30, leaving B=40 for the root merge. The depicted A/B arrangement does not have this structure.')],'Impossible; the 30-frequency remainder must combine with A before B.')],['Greater frequency cannot force a deeper code than a smaller frequency.'],[11,12]),
Q(9,'Legoland departures',12,[
P('1','Departure formula','aᵢ arrive on day i, and a fraction pₜ stays t days then leaves the next day. Find departures on day ℓ.',[
S('Match arrival and stay','A visitor arriving on day i and staying t days leaves when?','On day i+t. Thus departures Lℓ=Σ<sub>i<ℓ</sub>aᵢpℓ₋ᵢ, with aᵢ,pₜ zero outside 1…n.')],'Lℓ=Σ<sub>i<ℓ</sub>aᵢpℓ₋ᵢ.'),
P('2','FFT convolution','Compute all daily departures faster than O(n<sup>1.5</sup>).',[
S('Encode day indices','Which polynomials put arrivals and stay lengths at their actual indices?','A(x)=Σᵢ₌₁ⁿaᵢxⁱ and P(x)=Σₜ₌₁ⁿpₜxᵗ. The coefficient of xℓ in A·P is exactly Lℓ.'),
S('Multiply and extract','How much padding is needed?','Use an FFT length at least 2n+1 (rounded up to a power of two), multiply the evaluations, invert, and read coefficients 1…2n. Day 1 has zero departures.')],'Multiply A(x) and P(x), then read coefficients by departure day.'),
P('3','Runtime','Analyze the convolution algorithm.',[S('Count transform size','How large are the coefficient vectors?','Θ(n). FFT multiplication plus reading outputs costs O(n log n), which is asymptotically below n¹·⁵.')],'O(n log n).','O(n log n)')],['Day offsets add, so departures are a convolution.'],[13,14]),
Q(10,'Faulty network',15,[P('a','Reverse the degradation','An undirected road disappears at time tₑ>0. Find the first time the initially connected network disconnects.',[
S('Build a durable tree','What edge order favors roads that survive longer?','Run Kruskal in decreasing tₑ to get a maximum spanning tree. Return the smallest removal time among its edges, equivalently the weight of the last accepted edge.'),
S('Justify the threshold','Why is this the network’s first disconnection time?','Just before threshold τ, that spanning tree is still present, so the graph is connected. At τ, the graph using only edges with times >τ is disconnected: otherwise a spanning tree of those more durable edges would exist, contradicting the maximal bottleneck achieved by descending Kruskal. All edges with time τ disappear together.','If the graph starts disconnected, report time 0; do not try to extract a full spanning tree.')],'The lightest edge in a maximum spanning tree gives the first disconnection time.','O(m log n) for a simple graph')],['A maximum spanning tree maximizes the survival bottleneck.'],[15,16]),
Q(11,'Martian colonies',14,[P('a','Peel infeasible locations','Find the largest location set S where each location has at least two other S-locations at distance strictly less than R.',[
S('Construct adjacency','How do distances become a graph condition?','Connect i,j iff D[i,j]<R. We need an induced set with minimum degree at least two: the graph’s 2-core.'),
S('Remove forced exclusions','Which vertices cannot belong to any valid solution?','Initialize a queue with degree-0/1 vertices. Remove each once, decrement its neighbors’ active degrees, and enqueue newly deficient vertices. Output all unremoved vertices.'),
S('Prove maximality','Could you have removed a member of a valid solution?','Consider the first removed member of any valid set S*. Its two neighbors in S* would still be present, so its active degree could not be below two. Contradiction. The survivors are feasible and contain every feasible set; hence they are the unique largest set.')],'Build the distance graph and repeatedly remove vertices of degree below 2.','O(n²) to read/build distances, then O(n+m) for queue peeling')],['A forced-removal proof establishes both feasibility and maximality.'],[17,18]),
Q(12,'Mobile towers',20,[
P('1','Covered by one tower','List vertices within distance R of at least one tower, using one Dijkstra execution.',[
S('Add a shared source','How can all towers start at distance zero?','Add a dummy source s with a zero-weight edge to every tower, or initialize all tower heap keys to zero. Dijkstra’s distance to v becomes min<sub>t∈T</sub>d(t,v).'),
S('Filter by radius','Which vertices are covered?','Return original vertices whose distance is ≤R. Zero-weight edges are compatible with Dijkstra; road edges remain positive.')],'One multi-source Dijkstra; return distance≤R.','O((n+m) log n)'),
P('2','Covered by two towers','List vertices within R of at least two distinct towers faster than running one Dijkstra per tower; provide runtime.',[
S('Assign distinct labels','How can two towers always be separated by some partition?','Give towers distinct binary labels of length ⌈log₂|T|⌉. Two different labels differ in at least one bit.'),
S('Search bit partitions','What should be returned for one bit position?','Partition towers by that bit. Run part 1 on each group and intersect the covered vertex sets. Every vertex in this intersection has one covering tower from each group, so those towers are distinct. Union these intersections over all bits.'),
S('Prove no omissions','Why must two covering towers be detected?','Their labels differ in some bit, so the vertex belongs to both covered sets for that partition. There are O(log |T|) pairs of Dijkstra runs. If |T|<2, immediately return the empty set.')],'Union the intersections from all binary-label tower partitions.','O(log |T|·(n+m) log n), for |T|≥2')],['Distinct binary labels separate every pair using logarithmically many partitions.'],[19,20,21,22])]);
