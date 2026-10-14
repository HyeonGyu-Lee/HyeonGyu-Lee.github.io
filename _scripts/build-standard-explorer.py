"""Extract ECUC definitions, preserving explicit source multiplicity (no defaults)."""
from pathlib import Path
import xml.etree.ElementTree as ET
import json,hashlib
source=Path('_files/422.arxml');root=ET.parse(source).getroot()
def tag(e):return e.tag.split('}')[-1]
def child(e,name):return next((x for x in e if tag(x)==name),None)
def text(e):return ' '.join(''.join(e.itertext()).split()) if e is not None else None
def val(e,name):return text(child(e,name))
def definition(e):return tag(e).startswith('ECUC-') and tag(e).endswith('-DEF') and child(e,'SHORT-NAME') is not None
def descendants(e):
 for x in e:
  if definition(x):yield x
  elif tag(x) in ('CONTAINERS','SUB-CONTAINERS','PARAMETERS','REFERENCES','CHOICES'):yield from descendants(x)
def node(e,parent=''):
 name=val(e,'SHORT-NAME');path=parent+'/'+name
 return {'name':name,'path':path,'type':tag(e),'lower':val(e,'LOWER-MULTIPLICITY'),'upper':val(e,'UPPER-MULTIPLICITY'),'infinite':val(e,'UPPER-MULTIPLICITY-INFINITE'),'description':val(e,'DESC'),'metadata':{tag(x):text(x) for x in e if tag(x) not in ('SHORT-NAME','DESC','CONTAINERS','SUB-CONTAINERS','PARAMETERS','REFERENCES','CHOICES')},'children':[node(x,path) for x in descendants(e)]}
folder=Path('assets/standards');modules=[];count=0
for e in root.iter():
 if tag(e)!='ECUC-MODULE-DEF':continue
 data=node(e);modules.append(data['name']);(folder/(data['name']+'.json')).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
 count+=sum(1 for x in e.iter() if definition(x) and tag(x)!='ECUC-ENUMERATION-LITERAL-DEF')
(folder/'index.json').write_text(json.dumps({'release':'Classic AUTOSAR 4.2.2','source':'/_files/422.arxml','sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'modules':sorted(modules),'definitions':count},indent=2)+'\n')
print(len(modules),'modules;',count,'definitions')
