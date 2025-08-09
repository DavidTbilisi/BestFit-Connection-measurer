import { addSuggestionIfNew, allTraitSuggestions, loadCustomSuggestions } from './suggestions.js';
import { loadData, saveData } from './storage.js';
import { calcMatchPct, makeNumberInput } from './utils.js';
import { BUILTIN_TRAIT_SUGGESTIONS } from './constants.js';

export function render(data, personFilter){
  const container = document.getElementById('container');
  container.innerHTML='';
  const traitKeys = Object.keys(data.ideal);
  let ranked = data.people.map(p=>({ name:p.name, pct:+calcMatchPct(p,data.ideal).toFixed(1), person:p }))
    .sort((a,b)=> b.pct - a.pct);
  if(personFilter){
    ranked = ranked.filter(r=> r.name.toLowerCase() === personFilter.toLowerCase());
  }
  container.classList.toggle('single-view', !!personFilter);
  if(personFilter){
    const back = document.createElement('div');
    back.className='card';
    const btn = document.createElement('button');
    btn.textContent='← Back to All';
    btn.onclick=()=>{ const u=new URL(location.href); u.searchParams.delete('person'); location.href=u.toString(); };
    back.appendChild(btn);
    container.appendChild(back);
  }

  if(!personFilter){
    const barCard = document.createElement('div');
    barCard.className='card full-span';
    const barTitle = document.createElement('h3');
    barTitle.textContent = 'Connection Match (%)';
    barCard.appendChild(barTitle);
    const barCanvas = document.createElement('canvas');
    barCard.appendChild(barCanvas);
    container.appendChild(barCard);
    new Chart(barCanvas.getContext('2d'), { type:'bar', data:{ labels: ranked.map(r=>r.name), datasets:[{ label:'Match %', data: ranked.map(r=>r.pct), backgroundColor:'rgba(38,103,255,0.7)' }] }, options:{ responsive:true, plugins:{ legend:{display:false}, tooltip:{mode:'index', intersect:false} }, scales:{ y:{ beginAtZero:true, suggestedMax:100, ticks:{ callback:v=> v+'%' } } } } });
  }

  function buildIdealCard(){
    const idealCard = document.createElement('div'); idealCard.className = 'card';
    const idealHeader = document.createElement('h3'); idealHeader.textContent = 'Ideal Traits'; idealCard.appendChild(idealHeader);
    const sub = document.createElement('p'); sub.className='subhead'; sub.textContent='Edit, add, or delete weighted traits (0–5).'; idealCard.appendChild(sub);
    const idealList = document.createElement('ul'); idealList.className='ideal-list';
    traitKeys.forEach(t=>{ const li=document.createElement('li'); li.innerHTML = `<span>${t}</span><strong>${data.ideal[t]}</strong>`; idealList.appendChild(li); });
    idealCard.appendChild(idealList);
    const editIdealBtn = document.createElement('button'); editIdealBtn.textContent='Edit Ideal'; editIdealBtn.style.marginTop='.5rem'; idealCard.appendChild(editIdealBtn);

    editIdealBtn.onclick = () => {
      if(idealCard.dataset.editing) return; idealCard.dataset.editing='1'; editIdealBtn.disabled=true; idealList.remove(); sub.remove();
      const form = document.createElement('form'); form.className='trait-form'; const inputs = {}; let currentOrder = [...traitKeys];
      function addTraitRow(trait){ const label=document.createElement('label'); label.textContent=trait; label.dataset.trait=trait; const inp=makeNumberInput(data.ideal[trait]); inputs[trait]=inp; const del=document.createElement('button'); del.type='button'; del.textContent='×'; del.className='del-trait'; del.title='Delete trait'; del.onclick=()=>{ if(!confirm(`Delete trait "${trait}"?`)) return; delete data.ideal[trait]; delete inputs[trait]; data.people.forEach(p=> delete p.traits[trait]); label.remove(); inp.remove(); del.remove(); currentOrder = currentOrder.filter(t=> t!==trait); updateDatalist(); }; form.appendChild(label); form.appendChild(inp); form.appendChild(del); }
      currentOrder.forEach(addTraitRow);
      const datalist=document.createElement('datalist'); datalist.id='traitSuggestions';
      function updateDatalist(){ datalist.innerHTML=''; const existingLower = new Set(Object.keys(data.ideal).map(t=>t.toLowerCase())); const merged=[...BUILTIN_TRAIT_SUGGESTIONS, ...loadCustomSuggestions()]; const seen=new Set(); merged.forEach(s=>{ const low=s.toLowerCase(); if(seen.has(low)) return; seen.add(low); if(!existingLower.has(low)){ const opt=document.createElement('option'); opt.value=s; datalist.appendChild(opt); } }); }
      updateDatalist(); form.appendChild(datalist);
      const nameInput=document.createElement('input'); nameInput.type='text'; nameInput.placeholder='New trait name'; nameInput.className='new-trait-name'; nameInput.setAttribute('list','traitSuggestions'); const valueInput=makeNumberInput(3); valueInput.value=3; const addBtn=document.createElement('button'); addBtn.type='button'; addBtn.textContent='+'; addBtn.className='add-btn'; addBtn.title='Add trait'; addBtn.onclick=()=>{ let newName = nameInput.value.trim(); if(!newName){ nameInput.focus(); return; } if(data.ideal[newName]!==undefined){ alert('Trait exists'); return; } let v=parseFloat(valueInput.value); if(isNaN(v)||v<0) v=0; if(v>5)v=5; data.ideal[newName]=v; data.people.forEach(p=> p.traits[newName]=0); addSuggestionIfNew(newName); currentOrder.push(newName); addTraitRow(newName); nameInput.value=''; valueInput.value=3; updateDatalist(); };
      form.appendChild(nameInput); form.appendChild(valueInput); form.appendChild(addBtn);
      const actions=document.createElement('div'); actions.className='form-actions'; const cancel=document.createElement('button'); cancel.type='button'; cancel.textContent='Cancel'; const save=document.createElement('button'); save.type='submit'; save.textContent='Save'; actions.appendChild(cancel); actions.appendChild(save); form.appendChild(actions); idealCard.appendChild(form);
      form.onsubmit = e => { e.preventDefault(); Object.keys(inputs).forEach(trait => { let v=parseFloat(inputs[trait].value); if(isNaN(v)||v<0) v=0; if(v>5)v=5; data.ideal[trait]=v; }); saveData(data); render(data, personFilter); };
      cancel.onclick = () => render(loadData(), personFilter);
    };
    return idealCard;
  }

  if(!personFilter){ container.appendChild(buildIdealCard()); }

  ranked.forEach(({name, person, pct})=>{
    const wrap=document.createElement('div');
    wrap.className='person-card card'+(personFilter?' single-person full-span':'');
    const badge=document.createElement('div'); badge.className='badge'; badge.textContent = pct + '%'; wrap.appendChild(badge);
    const h=document.createElement('h3');
    const link=document.createElement('a'); link.href='?person='+encodeURIComponent(name); link.textContent = name + ' vs Ideal'; link.title='Open '+name+' only'; link.style.textDecoration='none'; h.appendChild(link); wrap.appendChild(h);
    const btnRow=document.createElement('div'); btnRow.style.textAlign='right'; btnRow.style.marginBottom='.25rem'; const editBtn=document.createElement('button'); editBtn.type='button'; editBtn.textContent='Edit'; editBtn.className='edit-btn'; editBtn.style.fontSize='.7rem'; btnRow.appendChild(editBtn); wrap.appendChild(btnRow);
    const radarCanvas=document.createElement('canvas'); wrap.appendChild(radarCanvas); container.appendChild(wrap);
    const idealData = traitKeys.map(t=>data.ideal[t]);
    const personData= traitKeys.map(t=> person.traits[t] ?? 0);
    const baseOptions = { responsive:true, elements:{ line:{ borderWidth:2 } }, plugins:{ legend:{ position:'top' } }, scales:{ r:{ min:0, max:5, ticks:{ stepSize:1, backdropColor:'transparent' }, grid:{ color:'rgba(100,100,100,.25)' } } } };
    new Chart(radarCanvas.getContext('2d'), { type:'radar', data:{ labels: traitKeys, datasets:[ { label:'Ideal', data:idealData, borderColor:'rgba(255,99,132,.7)', backgroundColor:'rgba(255,99,132,.15)', fill:true }, { label:name, data:personData, borderColor:'rgba(38,103,255,.8)', backgroundColor:'rgba(38,103,255,.2)', fill:true } ] }, options: baseOptions });

    editBtn.onclick = () => {
      if(wrap.dataset.editing) return; wrap.dataset.editing='1'; wrap.classList.add('editing');
      const existingCanvas = wrap.querySelector('canvas');
      if(existingCanvas){ existingCanvas.remove(); }
      const form=document.createElement('form'); form.className='person-edit-form'; const inputs={};
      traitKeys.forEach(trait=>{ const row=document.createElement('div'); row.className='trait-row'; const label=document.createElement('label'); label.textContent=trait; const inp=makeNumberInput(person.traits[trait]); inputs[trait]=inp; row.appendChild(label); row.appendChild(inp); form.appendChild(row); });
      const actions=document.createElement('div'); actions.className='form-actions'; const cancelBtn=document.createElement('button'); cancelBtn.type='button'; cancelBtn.textContent='Cancel'; const saveBtn=document.createElement('button'); saveBtn.type='submit'; saveBtn.textContent='Save'; actions.appendChild(cancelBtn); actions.appendChild(saveBtn); form.appendChild(actions); wrap.appendChild(form);
      form.onsubmit=e=>{ e.preventDefault(); traitKeys.forEach(t=>{ let v=parseFloat(inputs[t].value); if(isNaN(v)||v<0)v=0; if(v>5)v=5; person.traits[t]=v; }); saveData(data); render(data, personFilter); };
      cancelBtn.onclick=()=>render(loadData(), personFilter);
    };
  });

  if(personFilter){ container.appendChild(buildIdealCard()); }
}
