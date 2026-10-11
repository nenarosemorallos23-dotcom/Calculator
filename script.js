const d=document.getElementById('display');
const api=document.getElementById('api');
const URL='http://localhost:3000';

function add(v){ d.value+=v; }
function clearD(){ d.value=''; api.innerText='API: Waiting...'; }
function del(){ d.value=d.value.slice(0,-1); }

async function calc(){
  let exp = d.value;
  if(!exp) return;

  // --- BAGO: Check muna kung divide by zero bago i-calculate ---
  if(exp.includes('/0')){
    d.value = 'Error: Cannot divide by zero';
    api.innerText = 'Error: Cannot divide by zero (Local check)';
    setTimeout(clearD, 1500);
    return;
  }

  try{
    let m=exp.match(/(\d+\.?\d*)([\+\-\*\/])(\d+\.?\d*)/);
    if(!m){
      let res = eval(exp);
      if(!isFinite(res)){ throw new Error('div0'); }
      d.value=res;
      return;
    }

    let n1=parseFloat(m[1]), sym=m[2], n2=parseFloat(m[3]);

    // Check div by zero
    if(sym=='/' && n2==0){
      d.value='Error: Cannot divide by zero';
      api.innerText='Error: Cannot divide by zero';
      return;
    }

    let map={'+':'add','-':'subtract','*':'multiply','/':'divide'};
    let op=map[sym];

    api.innerText=`Sending to Python: ${n1} ${sym} ${n2}...`;

    const r=await fetch(`${URL}/api/calculate`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({num1:n1,num2:n2,operation:op})
    });

    const j=await r.json();
    d.value=j.result;
    api.innerText=`Result: ${j.result} | ${j.source}`;

  }catch(e){
    // Kung API off pa din
    try{
      let res=eval(exp);
      if(!isFinite(res)){
        d.value='Error: Cannot divide by zero';
        api.innerText='Local: Error Cannot divide by zero';
      } else {
        d.value=res; api.innerText='Local calc (API off)';
      }
    }catch{ d.value='Error'; }
  }
}