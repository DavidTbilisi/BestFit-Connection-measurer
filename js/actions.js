import { addSuggestionIfNew } from './suggestions.js';
import { loadData, saveData } from './storage.js';
import { render } from './render.js';

export function addTrait(){
  const data=loadData();
  let name=prompt('Enter new trait name:');
  if(!name) return; name=name.trim();
  if(data.ideal[name] !== undefined){ alert('Trait already exists'); return; }
  let valStr=prompt('Enter ideal value (0-5):','3'); if(valStr===null) return;
  let val=parseFloat(valStr); if(isNaN(val)||val<0) val=0; if(val>5) val=5;
  data.ideal[name]=val;
  data.people.forEach(p=>{ p.traits[name]=0; });
  addSuggestionIfNew(name);
  saveData(data);
  render(data, currentPersonFilter());
}

export function addPerson(){
  const data=loadData();
  let name=prompt('Enter person name:');
  if(!name) return; name=name.trim();
  if(!name) return;
  if(data.people.some(p=> p.name.toLowerCase()===name.toLowerCase())){ alert('Name exists'); return; }
  const traits={}; Object.keys(data.ideal).forEach(t=> traits[t]=0);
  data.people.push({ name, traits });
  saveData(data);
  render(data, currentPersonFilter());
}

export function exportData(){
  const data = loadData();
  const json=JSON.stringify(data,null,2);
  const blob=new Blob([json],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='connection_matcher_data.json'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

export function importData(file){
  const reader=new FileReader();
  reader.onload=e=>{ try { const json=JSON.parse(e.target.result); if(!json.ideal || !json.people) throw new Error('Invalid format'); saveData(json); render(json, currentPersonFilter()); alert('Data imported'); } catch(err){ alert('Import error: '+err.message); } };
  reader.readAsText(file);
}

export function currentPersonFilter(){
  const params = new URLSearchParams(location.search); return params.get('person');
}
