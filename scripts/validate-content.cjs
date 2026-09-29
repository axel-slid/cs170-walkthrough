// Validate the exact content modules the browser loads, without changing study progress.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const modules = new Map();
function moduleAt(file) {
  if (!modules.has(file)) modules.set(file, new vm.SourceTextModule(fs.readFileSync(file, 'utf8'), {identifier:file}));
  return modules.get(file);
}
(async () => {
  const entry = moduleAt(path.join(root, 'content/index.js'));
  await entry.link((specifier, parent) => moduleAt(path.resolve(path.dirname(parent.identifier), specifier)));
  await entry.evaluate();
  const exams = entry.namespace.exams;
  // Question counts per document. Add a line when you add an exam or worksheet.
  const expected = {'sp26-mt1':5,'fa25-mt1':8,'sp25-mt1':10,'fa24-mt1':11,'sp24-mt1':11,'fa23-mt1':12,'sp23-mt1':12,'fa22-mt1':10,'sp22-mt1':12,'fa21-mt1':4,'sp21-mt1':4,'fa20-mt1':4,'sp20-mt1':8};
  assert.equal(exams.length, Object.keys(expected).length, 'content/index.js and the expected list disagree');
  assert.equal(new Set(exams.map(e=>e.id)).size, exams.length, 'duplicate exam ID');
  let parts=0,steps=0,pages=0,drawings=0;
  function checkTable(t,label) {
    if (!t) return;
    assert(t.head.length>0, `${label}: empty table`);
    for(const row of t.rows) assert.equal(row.length,t.head.length, `${label}: table columns`);
  }
  function checkFigure(html,label) {
    if (!html) return;
    assert(!html.includes('NaN'), `${label}: invalid figure coordinates`);
    for(const match of html.matchAll(/<img\b[^>]*src="([^"]+)"/g)) {
      assert(fs.existsSync(path.resolve(root,'renderer',match[1])), `${label}: missing ${match[1]}`);
      drawings++;
    }
  }
  for(const e of exams) {
    assert.equal(e.questions.length,expected[e.id],`${e.id}: missing question`);
    assert.equal(new Set(e.questions.map(q=>q.number)).size,e.questions.length);
    for(const q of e.questions) {
      const label=`${e.id} Q${q.number}`;
      assert(q.title && q.parts.length,`${label}: empty question`);
      assert.equal(new Set(q.parts.map(p=>p.id)).size,q.parts.length,`${label}: duplicate progress ID`);
      checkTable(q.table,label);checkFigure(q.figure,label);
      if(e.source?.startsWith('sources/')) {
        assert(fs.existsSync(path.join(root,e.source)),`${e.id}: missing original PDF`);
        assert(q.sourcePages?.length>0 || e.solutionPages?.[q.number],`${label}: missing source pages`);
      }
      assert(e.solutionPages?.[q.number],`${label}: missing official solution link`);
      const [first,last]=e.solutionPages[q.number];
      assert(first>=1&&last>=first,`${label}: invalid solution range`);
      for(let n=first;n<=last;n++) {
        const file=path.join(root,'content',e.solutionDir,`p-${String(n).padStart(2,'0')}.${e.solutionExt??'jpg'}`);
        assert(fs.existsSync(file),`${label}: missing official page ${n}`);pages++;
      }
      for(const p of q.parts) {
        parts++;
        assert(p.id && p.name && p.ask && p.key?.gist && p.steps?.length,`${label} ${p.id}: incomplete walkthrough`);
        checkTable(p.table,label);checkTable(p.key.table,label);checkFigure(p.figure,label);
        for(const s of p.steps) {
          steps++;
          assert(s.title&&s.prompt&&s.simple,`${label} ${p.id}: empty guided step`);
          if(s.choices) {
            assert(s.choices.length>=2,`${label}: needs answer choices`);
            assert(Number.isInteger(s.correct)&&s.correct>=0&&s.correct<s.choices.length,`${label}: invalid correct choice`);
          }
          checkTable(s.table,label);checkFigure(s.figure,label);
        }
      }
    }
  }
  assert(parts > 0 && steps >= parts, 'every part needs at least one step');
  // Protect the original exams' progress addresses.
  assert.equal(exams.find(e=>e.id==='fa25-mt1').questions.flatMap(q=>q.parts).length,34);
  assert.equal(exams.find(e=>e.id==='sp25-mt1').questions.flatMap(q=>q.parts).length,29);
  new vm.SourceTextModule(fs.readFileSync(path.join(root,'renderer/app.js'),'utf8'));
  console.log(`PASS: ${exams.length} exams, ${parts} parts, ${steps} guided steps; ${drawings} problem diagrams and ${pages} solution-page references exist.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
