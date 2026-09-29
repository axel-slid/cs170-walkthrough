"""Render offline official keys and crop problem diagrams from the supplied PDF archive.
Requires PyMuPDF and Pillow. Run from the repository root.
"""
from pathlib import Path
import fitz
from PIL import Image
import json

# Rectangles are normalized page coordinates. Only the original problem drawing is cropped.
# The final field names the relevant part when a drawing belongs to just one subproblem.
CROPS = [
 ('fa24-mt1',3,4,(.25,.14,.76,.40),None),
 ('fa24-mt1',4,7,(.33,.15,.68,.31),None),
 ('fa24-mt1',5,9,(.35,.15,.70,.42),None),
 ('fa24-mt1',6,10,(.42,.64,.59,.88),'2'),
 ('fa24-mt1',9,17,(.37,.31,.67,.525),None),
 ('sp24-mt1',3,3,(.25,.14,.76,.40),None),
 ('sp24-mt1',4,6,(.26,.15,.74,.43),None),
 ('sp24-mt1',7,12,(.21,.16,.66,.355),None),
 ('sp24-mt1',8,14,(.27,.29,.72,.54),None),
 ('fa23-mt1',4,7,(.23,.22,.53,.46),'1'),
 ('fa23-mt1',4,7,(.23,.47,.53,.745),'2'),
 ('fa23-mt1',4,8,(.23,.09,.53,.34),'3'),
 ('fa23-mt1',4,8,(.23,.38,.53,.64),'4'),
 ('fa23-mt1',4,8,(.23,.66,.53,.73),'5'),
 ('fa23-mt1',7,13,(.24,.19,.78,.43),None),
 ('sp23-mt1',3,3,(.25,.445,.76,.715),None),
 ('sp23-mt1',4,6,(.29,.17,.72,.34),None),
 ('sp23-mt1',5,7,(.25,.50,.74,.78),None),
 ('sp23-mt1',7,10,(.13,.175,.88,.23),None),
 ('sp23-mt1',8,11,(.21,.175,.76,.27),None),
 ('fa22-mt1',2,4,(.19,.138,.56,.505),None),
 ('sp22-mt1',4,5,(.18,.505,.80,.785),None),
 ('sp22-mt1',7,8,(.265,.19,.725,.35),None),
 ('sp22-mt1',12,17,(.32,.535,.66,.79),None),
 ('sp20-mt1',4,6,(.315,.50,.67,.697),None),
 ('sp20-mt1',8,13,(.17,.115,.71,.392),None),
]
root=Path(__file__).resolve().parents[1]
keys=root/'content/keys'
diagrams=root/'content/diagrams';diagrams.mkdir(exist_ok=True)
manifest={}
for pdf in sorted((root/'sources').glob('*.pdf')):
 year,term,*_=pdf.stem.split();eid=f'{"sp" if term=="Spring" else "fa"}{year[2:]}-mt1'
 doc=fitz.open(pdf);dest=keys/eid;dest.mkdir(parents=True,exist_ok=True)
 for i,page in enumerate(doc):
  if not (dest/f'p-{i+1:02}.webp').exists():
   pix=page.get_pixmap(matrix=fitz.Matrix(1.5,1.5),alpha=False)
   Image.frombytes('RGB',(pix.width,pix.height),pix.samples).save(dest/f'p-{i+1:02}.webp',quality=85)
 for item in CROPS:
  ceid,q,p,rect,part=item
  if ceid!=eid:continue
  page=doc[p-1];w,h=page.rect.width,page.rect.height
  clip=fitz.Rect(rect[0]*w,rect[1]*h,rect[2]*w,rect[3]*h)
  pix=page.get_pixmap(matrix=fitz.Matrix(2.5,2.5),clip=clip,alpha=False)
  name=f'{eid}-q{q}'+(f'-{part}' if part else '')+'.webp'
  Image.frombytes('RGB',(pix.width,pix.height),pix.samples).save(diagrams/name,quality=92)
  manifest.setdefault(eid,{}).setdefault(str(q),{})[part or 'question']=name
(root/'content/diagrams/manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
(root/'content/diagrams.js').write_text('// Original problem diagrams cropped from the supplied official keys.\nexport const diagrams = '+json.dumps(manifest,indent=2)+';\n')
print(f'Rendered {len(CROPS)} problem diagrams and bundled official pages.')
