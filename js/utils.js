export function calcMatchPct(person, ideal){
  const keys = Object.keys(ideal);
  if(!keys.length) return 0;
  let sum=0;
  keys.forEach(t=>{
    const i=ideal[t];
    const p = person.traits[t] ?? 0;
    sum += Math.min(p,i)/(i||1);
  });
  return (sum/keys.length)*100;
}

export function makeNumberInput(value){
  const inp = document.createElement('input');
  inp.type='number';
  inp.step='0.1';
  inp.min='0';
  inp.max='5';
  inp.value = value ?? 0;
  return inp;
}
