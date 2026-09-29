import {E,Q,P,S,T,A,table} from './builders.js';
export const exam=E('sp24-mt1','Spring 2024','C. Borgs and P. Raghavendra',[
Q(1,'Asymptotic analysis',4,[A([
['n(log n)<sup>2023</sup>','n²/(log n)<sup>2023</sup>',0,'The ratio f/g=(log n)<sup>4046</sup>/n tends to zero; a huge fixed logarithmic power still loses to n.'],
['nⁿ','2<sup>100n</sup>',1,'Write nⁿ=2<sup>n log₂n</sup>. Eventually log₂n>100, so the exponent of f grows faster.'],
['n²+(log n)³','n+(log n)⁶',1,'The polynomial terms dominate: f=Θ(n²), g=Θ(n).']])],['Fixed powers of log n eventually lose to every positive polynomial power.'],[2]),
Q(2,'Runtime analysis',6,[
P('1','Write the recurrence','what(n) runs an n²-print loop while k starts at n and is divided by 16 until k≤1, then makes one what(n/2) call.',[
S('Separate n from k','Does the inner print count shrink with k?','No: every round still costs n². There are Θ(log n) rounds because k is divided by 16.'),
S('Add the recursive call','How much work belongs to one call?','Θ(n² log n) locally, plus one half-sized recursive call. T(n)=T(n/2)+Θ(n² log n).')],'T(n)=T(n/2)+Θ(n² log n).'),
P('2','Solve the recurrence','Find the tightest runtime bound for that recurrence.',[
S('Sum successive levels','How fast does the cost decrease?','Level i costs (n/2ⁱ)² log(n/2ⁱ), at most n²log n/4ⁱ. The geometric sum is O(n²log n), and the root already costs Ω(n²log n).')],'Θ(n² log n).','Θ(n² log n)')],['A logarithmic loop multiplies by its actual per-round cost.'],[2]),
Q(3,'Connectivity in graphs',8,[
P('1','DFS timestamps','Run alphabetical DFS starting from A on the original graph.',[
S('Trace the exploration','What is the first DFS path?','A→B→F→I→E; finish E, then visit J, and finish J,I,F,B,A. Continue the forest at C→G, then D→H.'),
S('Use a single clock','Which pre/post pairs result?','Advance the clock on both discovery and completion. The source table is reproduced in the answer; disconnected DFS roots continue the same clock.')],'DFS uses timestamps 1 through 20.','',{key:{gist:'A(1,12), B(2,11), C(13,16), D(17,20), E(5,6), F(3,10), G(14,15), H(18,19), I(4,9), J(7,8).',body:[],...table(['Vertex','pre','post'],[['A',1,12],['B',2,11],['C',13,16],['D',17,20],['E',5,6],['F',3,10],['G',14,15],['H',18,19],['I',4,9],['J',7,8]])}}),
P('2','Cross edges','List all cross edges in that DFS.',[
S('Compare intervals','Which edges go between separate finished DFS branches?','C→A,C→B,D→A,D→E,G→F,G→J,H→E,H→I. A→E is forward, since E is a descendant of A; a completed target is not automatically cross.')],'CA, CB, DA, DE, GF, GJ, HE, HI.'),
P('3','SCC output','List SCCs in the course algorithm’s output order, preferring lexicographic order if necessary.',[
S('Contract cycles','Which vertices are mutually reachable?','The four SCCs are {B,E,F,I,J}, {A}, {C,G}, {D,H}. The first is a sink, and A follows it in reverse topological order.'),
S('Resolve independent components','Which of the last two should appear first?','Choose {C,G} then {D,H} for lexicographic order. The key also accepted the reverse order of these two independent components.')],'{B,E,F,I,J}, {A}, {C,G}, {D,H}.')],['Test ancestry before labeling an edge cross.'],[3,4,5]),
Q(4,'MST execution',8,[
P('1','Kruskal edge order','Which fourth/fifth edges does Kruskal add in the source graph?',[
S('Skip the early cycle','What happens at edge AE of weight 7?','Accept DE(1), AD(5), CF(6); AE(7) would close a cycle and is skipped. Accept DG(9) fourth. EG(10) also closes a cycle; accept FG(11) fifth.')],'Fourth DG; fifth FG.'),
P('2','Union–find forest','Draw union–find trees after the fourth accepted edge, without path compression.',[
S('Track the merged sets','Which sets have formed?','{A,D,E,G}, {C,F}, {B}, {H}. Under the key’s union-by-rank tie choices, D is root with children A,E,G; C is root with child F. B and H remain singletons.','Root names depend on tie conventions. The represented sets and valid rank-based structure matter; do not silently use path compression.')],'D→{A,E,G}, C→{F}, and singleton roots B,H.'),
P('3','Prim edge order','Which fourth/fifth edges does Prim add starting at A?',[
S('Update the crossing cut','What sequence of crossing edges is chosen?','AD(5), DE(1), DG(9), GF(11), FC(6). CF becomes available only after F joins the tree.')],'Fourth FG; fifth CF.'),
P('4','Prim versus Dijkstra','At their first differing deletion starting at A, which vertex does Prim delete and which does Dijkstra delete?',[
S('Compare the priorities','What does each heap key measure?','Both first settle A,D,E. Then Prim favors G via edge DG(9), while Dijkstra favors H at distance 13 from A over G at distance 14. Dijkstra compares full path sums; Prim compares a single crossing edge.')],'Prim: G. Dijkstra: H.')],['Union–find represents components; MST and shortest-path priorities differ.'],[6,7]),
Q(5,'Polynomial multiplication via FFT',6,[
P('1','Choose transform length','For P(x)=1+x and Q(x)=1+2x², what is the smallest FFT length?',[
S('Count product coefficients','What is the product degree?','It is 3. Four coefficients are needed, so length 4 prevents cyclic wraparound.')],'n=4.'),
P('2','Roots of unity','List the fourth roots of unity in the positive-exponent convention.',[
S('Walk around the unit circle','What are successive powers of i?','1,i,−1,−i. These are the evaluation points in order.')],'[1,i,−1,−i].'),
P('3','Transform P','Evaluate P at those roots.',[
S('Substitute each root','What is 1+x at 1,i,−1,−i?','[2,1+i,0,1−i]. The transform is the list of evaluations, not the coefficient vector.')],'[2,1+i,0,1−i].'),
P('4','Transform Q','Evaluate Q at the same roots.',[
S('Square each root','How does x² alternate?','x² is 1,−1,1,−1. Thus 1+2x² gives [3,−1,3,−1].')],'[3,−1,3,−1].'),
P('5','Transform the product','Find the transform of P·Q without interpolation.',[
S('Multiply matching evaluations','Why can products be taken entry by entry?','(PQ)(z)=P(z)Q(z) at each root z. Multiply corresponding entries to get [6,−1−i,0,−1+i].')],'[6,−1−i,0,−1+i].')],['FFT multiplication needs enough evaluation points for the full product degree.'],[8]),
Q(6,'Short answers',23,[
P('1','Huffman code length','A,B,C,D,E have frequencies 1,3,3²,3³,3⁴. How many bits does C need?',[
S('Merge two minima','Where does weight 9 enter?','Merge 1+3=4, then 4+9=13, then 13+27=40, then 40+81=121. C passes through 13,40,121, so it has depth 3.')],'3 bits.'),
P('2','Worst quickselect probability','Randomized Select on distinct a[1…n] seeks the minimum. What is the probability it makes n−1 recursive calls after the initial call?',[
S('Force maximal shrinkage delay','Which pivot leaves a subproblem of size n−1?','The maximum. To get n−1 calls, every pivot must be the maximum of the current set, with probability (1/n)(1/(n−1))…(1/2)=1/n!.')],'1/n!.'),
P('3','Strassen and additions','Assess: Strassen uses fewer multiplications but more additions than naive matrix multiplication.',[
S('Choose an interpretation','Are we comparing the whole algorithm or one block-combine step?','For total scalar operations, the claim is false: Strassen uses O(n<sup>log₂7</sup>) additions as well as multiplications, whereas the naive algorithm uses Θ(n³) of each. One block combine does use more additions than the naive block formula. The official exam dropped this ambiguous question.')],'Dropped for ambiguity; false under the intended whole-algorithm interpretation.'),
P('4','Missing DAG edge','A DFS has pre[u]<pre[v]<post[v]<post[u] in a DAG. Which edge is necessarily absent?',[
S('Read the nesting','What route already exists between u and v?','u is an ancestor of v, so the DFS tree gives u→…→v. Edge v→u would close a cycle, impossible in a DAG.')],'v→u is absent.'),
P('5','DAG SCC bounds','How few and how many SCCs can an n-vertex DAG have?',[
S('Use mutual reachability','Could two vertices lie in one SCC?','No. Routes in both directions would create a directed cycle. Every SCC is a singleton.')],'Exactly n: minimum n, maximum n.'),
P('6','FFT recursive inputs','FFT on [1,2,3,4,1,2,3,4] makes two length-four calls. What are their vectors?',[
S('Split by parity','Which coefficients have even and odd indices, starting at index zero?','Even: [1,3,1,3]. Odd: [2,4,2,4]. FFT splits coefficient parity, not contiguous halves.')],'[1,3,1,3] and [2,4,2,4].'),
P('7','Insert zeros in a transform','If FFT([a,b,c,d])=[α₀,α₁,α₂,α₃], what is FFT([a,0,b,0,c,0,d,0])?',[
S('View the new polynomial','What substitution does inserting zeros make?','The new polynomial is P(x²). Squaring the eight roots visits the four roots twice, in the same order. The outputs repeat.')],'[α₀,α₁,α₂,α₃,α₀,α₁,α₂,α₃].'),
P('8','Dijkstra heap operations','In an n-vertex, m-edge graph, count DeleteMin and DecreaseKey operations.',[
S('Count settlements and relaxations','How often can a vertex be removed or an edge tried?','With all vertices initially queued, there are n DeleteMin operations and at most m successful DecreaseKey operations, one per directed edge relaxation. Unreachable-only variants may remove fewer vertices.')],'n DeleteMin; at most m DecreaseKey.'),
T('9','Distinct weights and shortest paths','Do distinct edge lengths guarantee unique shortest paths?',false,'Different sums can tie: paths of edge weights 1+4 and 2+3 both total 5, even though all four weights are distinct.'),
T('10','Cube the weights','With positive and negative weights, does cubing preserve every MST?',true,'Cubing is strictly increasing on all real numbers. It preserves every comparison and equality between edge weights, so cut/cycle characterizations of MSTs are unchanged.'),
T('11','Square the weights','With positive and negative weights, does squaring preserve every MST?',false,'A triangle with weights −10,1,1 uses −10 in its MSTs. After squaring, that edge has weight 100 and is excluded.')],['MSTs depend on edge ordering; shortest paths depend on sums.'],[9,10,11]),
Q(7,'Unknown MST weights',10,[
P('1','First mandatory edge','Which known edge must occur in an MST regardless of the unknown weights?',[
S('Find a cut without unknown crossing edges','What isolates A?','The singleton cut {A} has only AD(1), so AD is a bridge and mandatory. The key labels this singleton cut {D}, which is a typo: D has several other incident edges.')],'AD is mandatory: it is A’s only incident edge.'),
P('2','Second mandatory edge','Find another known edge that must occur regardless of unknown weights.',[
S('Enclose unknown internal edges','Which cut leaves CG as its unique lightest crossing edge?','Use {A,C,D,E} versus {B,F,G,H}. CG(4), EG(5), and DB(6) are the known crossing edges; the unknown edges lie within the two sides. CG is uniquely lightest.')],'CG is mandatory by the cut property.'),
P('3','Forbidden edge','Which known edge cannot occur in any MST?',[
S('Find a fully known cycle','Which edge is strictly heaviest on E−D−C−G−E?','The cycle weights are 3,2,4,5. EG(5) is uniquely heaviest, so the cycle property excludes it from every MST.')],'EG is excluded by the cycle property.')],['Unknown weights do not matter on a certificate cut or cycle containing only known relevant weights.'],[12,13]),
Q(8,'Bellman–Ford passes',5,[
P('1','Number of passes','For the pictured undirected positive-weight grid from S, how many passes guarantee correctness regardless of edge ordering?',[
S('Count the longest simple route','Why is the answer larger than the hop diameter?','Weights may make a winding route the cheapest one. The longest simple route starting at S has 11 hops. One pass guarantees one further path edge even under adversarial ordering, so 11 passes suffice.')],'11 passes.'),
P('2','Why the bound is tight','Justify the 11-pass bound.',[
S('Build the worst case','Can the winding route be forced to win?','Assign its edges small positive weights and all other edges sufficiently large weights. Relax its edges in reverse route order on each pass. A correct label then advances only one hop per pass, requiring all 11. Positive weights mean an optimal route is simple.')],'A reverse-ordered 11-edge shortest route makes 11 passes necessary; the path-edge invariant makes them sufficient.')],['A worst-case relaxation bound uses the most edges a shortest path could contain.'],[14,15]),
Q(9,'Vacation home',15,[
P('1','A timeline DAG','Bids i are [startᵢ,endᵢ) with rent per day rᵢ. Choose whole, nonoverlapping bids for maximum profit over D days; one bid may end when another starts.',[
S('Turn time into vertices','What should an accepted bid look like in a path?','Create vertices for days 1,…,D. Add zero-weight arcs j→j+1 for unused time, and a bid arc startᵢ→endᵢ weighted −rᵢ(endᵢ−startᵢ).'),
S('Solve and reconstruct','Why does a shortest path maximize rent?','All arcs advance time, so this is a DAG. Run DAG shortest paths from day 1 to D, retaining predecessors. Bid arcs on the path are the selected customers. A path cannot overlap bids, and every valid rental schedule can be completed with zero-cost day arcs. Path weight equals negative profit.')],'Use a timeline DAG with negative-profit bid arcs and zero-cost idle-day arcs.'),
P('2','Runtime','Analyze the timeline-DAG solution.',[
S('Count vertices and edges','How large is the construction?','D vertices and (D−1)+n edges. Calendar order is already topological. One relaxation per edge costs O(D+n); reconstruction is also within that bound.')],'O(D+n).','O(D+n)')],['Time-advancing choices naturally form a DAG.'],[16,17,18]),
Q(10,'Airline preferences',15,[
P('1','Ordered route priorities','Find an s→t route minimizing, in order: number of flights, total duration, then total price. Durations are in 1…B and prices in 1…C.',[
S('Encode the priorities','How can lower-priority totals be prevented from outweighing a hop?','Give each edge weight cost+(C+1)n·duration+(C+1)(B+1)n². A simple route has fewer than n edges, total cost below nC, and duration below nB. Thus one duration unit beats all cost differences, and one hop beats all duration/cost differences.'),
S('Use a standard search','Why may routes be restricted to simple ones?','All encoded weights are positive, so cycles only increase the objective. Run Dijkstra on the encoded graph and reconstruct its path. Equivalently use lexicographic (hops,duration,cost) labels and heap keys.','Adding a small arbitrary constant to each flight does not reliably enforce three priorities.')],'Encode each edge as c+(C+1)n·d+(C+1)(B+1)n² and run Dijkstra.'),
P('2','Runtime','Analyze the airline algorithm.',[
S('Count modified work','Do three priority fields change the asymptotic cost?','No, each comparison or weight computation still takes constant time in the exam’s arithmetic model. Construction is O(n+m); binary-heap Dijkstra is O((n+m)log n).')],'O((n+m) log n).','O((n+m) log n)')],['Bound subordinate totals before converting lexicographic priorities to scalar weights.'],[19,20]),
Q(11,'Bikeable cities',20,[
P('1','Altitude sweep','For every city u, find another city v of the same altitude connected to u by a path whose intermediate altitudes are at most h[u]. Use the formal definition; the exam explicitly withdrew the “cannot go uphill” sentence.',[
S('Activate low vertices','What connectivity should be available at altitude H?','Sort vertices by altitude. Process an entire equal-altitude group H together: activate its vertices and union every edge with both endpoints now active. The resulting components are exactly the components of the graph induced by altitudes ≤H.'),
S('Assign partners','How do you avoid missing a city when several components merge within one altitude group?','After all unions for H, group the newly activated H-vertices by their final union–find root. For each group of size ≥2, pair its first two as partners, and give each remaining vertex the first as its partner. A singleton group has no partner. This assigns every city that has one.'),
S('Prove the correspondence','Why is sharing a component sufficient and necessary?','Connectivity in the induced graph gives precisely a path never exceeding H. Endpoints are in the same activation group, so they have equal altitude. Any valid partner must appear in the same final component.','Process all tied altitudes before assigning partners. Reporting just one pair per merge can leave other eligible cities without output.')],'Sort by altitude, activate equal-height batches, union active edges, and assign partners among each component’s new equal-height vertices.'),
P('2','Runtime','Analyze the altitude sweep.',[
S('Count sorts and unions','How many times is an edge examined?','O(1) times. Sorting costs O(n log n), and union–find operations plus grouping cost O((n+m)α(n)) with path compression and union by rank. The simpler no-compression bound O((n+m) log n) also meets the exam target.')],'O(n log n+(n+m)α(n)).','O(n log n+(n+m)α(n))')],['Batch equal thresholds before answering connectivity questions.'],[21,22,23])]);
