import { THEME_KEY } from './constants.js';

export function applyTheme(theme){
  document.documentElement.classList.remove('theme-dark','theme-highcontrast');
  if(theme==='dark') document.documentElement.classList.add('theme-dark');
  else if(theme==='highcontrast') document.documentElement.classList.add('theme-highcontrast');
}
export function loadTheme(){
  return localStorage.getItem(THEME_KEY) || 'light';
}
export function saveTheme(t){
  localStorage.setItem(THEME_KEY, t);
}
