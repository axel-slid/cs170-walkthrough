import { diagrams } from './diagrams.js';
// Small authoring helpers. Each supplied explanation is specific to its exam part.
export const S = (title, prompt, simple, pitfall = '', reveal = []) => ({title,prompt,simple,...(pitfall?{pitfall}:{}),...(reveal.length?{reveal}: {})});
export const P = (id,name,ask,steps,gist,runtime='',extra={}) => ({id,name,ask,steps,key:{gist,body:[],...(runtime?{runtime}: {})},...extra});
export const T = (id,name,ask,truth,why,pitfall='') => P(id,name,ask,[{...S('Test the claim','Is the statement true or false? Find a reason or a counterexample.',why,pitfall),choices:['True','False'],correct:truth?0:1}],truth?'True.':'False.');
export const Q = (number,title,points,parts,takeaway=[],pages=[],preamble=[]) => ({number,title,points,topics:[],parts,takeaway,sourcePages:pages,preamble});
export const E = (id,term,instructors,questions) => {
  const figure = (file, label) => `<figure class="exam-diagram"><img src="../content/diagrams/${file}" alt="${label}"><figcaption>Original problem diagram</figcaption></figure>`;
  for (const q of questions) {
    const drawings = diagrams[id]?.[q.number] ?? {};
    if (drawings.question) q.figure = figure(drawings.question, `${term}, question ${q.number} diagram`);
    for (const p of q.parts) if (drawings[p.id]) p.figure = figure(drawings[p.id], `${term}, question ${q.number}, part ${p.id} diagram`);
  }
  return {id,term,course:'CS 170',title:'Midterm 1',instructors,
    source:`sources/${term.split(' ')[1]} ${term.split(' ')[0]} Midterm 1 KEY.pdf`,
    solutionDir:`keys/${id}`,solutionExt:'webp',
    solutionPages:Object.fromEntries(questions.filter(q=>q.sourcePages.length).map(q=>[q.number,[Math.min(...q.sourcePages),Math.max(...q.sourcePages)]])),questions};
};
export const A = (rows) => P('a','Compare growth rates','For each pair, decide whether f = O(g), g = O(f), or both. Logarithms are base 2 unless marked otherwise.',rows.map(([f,g,correct,why],i)=>({...S(`Row ${i+1}`,`Compare ${f} with ${g}. Simplify before comparing.`,why),choices:['f = O(g)','g = O(f)','Both'],correct})),rows.map((r,i)=>`Row ${i+1}: ${['f = O(g) only','g = O(f) only','Both'][r[2]]}.`).join(' '),'',{table:{head:['f','g'],rows:rows.map(r=>r.slice(0,2))}});
export const table = (head,rows) => ({table:{head,rows}});
