import { addSuggestionIfNew } from './suggestions.js';
import { loadData, saveData } from './storage.js';

export async function fetchJson(url){
  const res = await fetch(url,{ headers:{'Accept':'application/json,text/plain;q=0.8,*/*;q=0.5'} });
  if(!res.ok) throw new Error(res.status+' '+res.statusText);
  const ct = res.headers.get('content-type')||'';
  if(ct.includes('application/json')) return await res.json();
  const txt = await res.text();
  try { return JSON.parse(txt); } catch { return txt; }
}

export function validateDataShape(obj){
  return !!(obj && typeof obj==='object' && obj.ideal && typeof obj.ideal==='object' && Array.isArray(obj.people));
}

export async function fetchRemoteData(render){
  const url = prompt('Enter URL returning JSON with { ideal, people }');
  if(!url) return;
  try {
    const incoming = await fetchJson(url.trim());
    if(!validateDataShape(incoming)){
      alert('Invalid structure');
      return;
    }
    const replace = confirm('Replace current data (OK) or Merge (Cancel)?');
    let data = loadData();
    if(replace){
      data = incoming;
    } else {
      Object.entries(incoming.ideal).forEach(([k,v])=>{
        data.ideal[k]=v;
        data.people.forEach(p=>{ if(p.traits[k]===undefined) p.traits[k]=0; });
      });
      incoming.people.forEach(np=>{
        if(!data.people.some(p=> p.name.toLowerCase()===np.name.toLowerCase())){
          Object.keys(data.ideal).forEach(t=>{ if(np.traits[t]===undefined) np.traits[t]=0; });
          data.people.push(np);
        }
      });
    }
    if(replace){
      data.people.forEach(p=>{
        Object.keys(data.ideal).forEach(t=>{ if(p.traits[t]===undefined) p.traits[t]=0; });
      });
    }
    saveData(data);
    render(data);
    alert('Data loaded');
  } catch(err){
    alert('Fetch failed: '+err.message);
  }
}

export async function fetchRemoteTraits(){
  const url = prompt('Enter URL returning trait list (JSON array or newline text)');
  if(!url) return;
  try {
    const payload = await fetchJson(url.trim());
    let list = [];
    if(Array.isArray(payload)) list = payload.filter(x=> typeof x==='string');
    else if(typeof payload==='string') list = payload.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
    else if(payload.traits && Array.isArray(payload.traits)) list = payload.traits.filter(x=> typeof x==='string');
    else { alert('Unrecognized format'); return; }
    if(!list.length){ alert('No traits'); return; }
    list.slice(0,300).forEach(addSuggestionIfNew);
    alert('Imported '+list.length+' trait suggestions.');
  } catch(err){
    alert('Fetch failed: '+err.message);
  }
}
