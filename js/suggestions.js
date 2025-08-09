import { BUILTIN_TRAIT_SUGGESTIONS, SUGGESTION_KEY } from './constants.js';

export function loadCustomSuggestions(){
  try { return JSON.parse(localStorage.getItem(SUGGESTION_KEY)) || []; } catch { return []; }
}
export function saveCustomSuggestions(list){
  localStorage.setItem(SUGGESTION_KEY, JSON.stringify(list.slice(0,300)));
}
export function addSuggestionIfNew(name){
  const lower = name.toLowerCase();
  if(BUILTIN_TRAIT_SUGGESTIONS.some(b=> b.toLowerCase()===lower)) return;
  const custom = loadCustomSuggestions();
  if(!custom.some(c=> c.toLowerCase()===lower)){
    custom.push(name);
    saveCustomSuggestions(custom);
  }
}
export function allTraitSuggestions(){
  return [...BUILTIN_TRAIT_SUGGESTIONS, ...loadCustomSuggestions()];
}
