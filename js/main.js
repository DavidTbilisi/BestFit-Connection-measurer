import { loadTheme, applyTheme, saveTheme } from './theme.js';
import { loadData } from './storage.js';
import { render } from './render.js';
import { addTrait, addPerson, exportData, importData, currentPersonFilter } from './actions.js';
import { fetchRemoteData, fetchRemoteTraits } from './remote.js';

// Expose suggestions for debugging (optional)
import { allTraitSuggestions } from './suggestions.js';
window._traitSuggestions = () => ({ all: allTraitSuggestions() });

const themeSelect = document.getElementById('themeSelect');
const initialTheme = loadTheme();
applyTheme(initialTheme);
if(themeSelect){
  themeSelect.value = initialTheme;
  themeSelect.onchange = () => { applyTheme(themeSelect.value); saveTheme(themeSelect.value); };
}

// Buttons
const importFileInput=document.getElementById('importFile');

document.getElementById('exportBtn').onclick = ()=> exportData();
document.getElementById('importBtn').onclick=()=>{ importFileInput.value=null; importFileInput.click(); };
importFileInput.onchange=e=>{ if(!e.target.files.length) return; importData(e.target.files[0]); };

document.getElementById('addTraitBtn').onclick=addTrait;
document.getElementById('addPersonBtn').onclick=addPerson;
document.getElementById('fetchUrlBtn').onclick=()=>fetchRemoteData(rerender);
document.getElementById('fetchTraitsBtn').onclick=fetchRemoteTraits;

function rerender(){
  render(loadData(), currentPersonFilter());
}

// Initial render
rerender();
