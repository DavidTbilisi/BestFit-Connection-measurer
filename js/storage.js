import { STORAGE_KEY, defaultData } from './constants.js';

export function loadData(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw) return structuredClone(defaultData);
  try { return JSON.parse(raw); } catch { return structuredClone(defaultData); }
}

export function saveData(data){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
