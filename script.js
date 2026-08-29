const canvas=document.getElementById("scratch");
const area=document.querySelector(".scratch-area");
const button=document.getElementById("reveal");
const ctx=canvas.getContext("2d",{willReadFrequently:true});
let drawing=false,last=null,revealed=false,checks=0;

function init(){
  const r=area.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);
  canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);
  ctx.setTransform(d,0,0,d,0,0);
  const g=ctx.createLinearGradient(0,0,r.width,r.height);
  g.addColorStop(0,"#bdbdbd");g.addColorStop(.22,"#777");g.addColorStop(.45,"#d2d2d2");
  g.addColorStop(.7,"#858585");g.addColorStop(1,"#c5c5c5");
  ctx.globalCompositeOperation="source-over";ctx.fillStyle=g;ctx.fillRect(0,0,r.width,r.height);
  for(let i=0;i<Math.max(500,r.width*r.height/35);i++){
    ctx.fillStyle=Math.random()>.5?"#ffffff26":"#2020201a";
    ctx.beginPath();ctx.arc(Math.random()*r.width,Math.random()*r.height,Math.random()*1.2+.2,0,Math.PI*2);ctx.fill();
  }
  ctx.fillStyle="#fffffff2";ctx.textAlign="center";ctx.textBaseline="middle";
  ctx.font=`700 ${Math.max(18,r.width*.034)}px "DM Sans",sans-serif`;
  ctx.fillText("GRATTE ICI",r.width/2,r.height/2-17);
  ctx.font=`500 ${Math.max(13,r.width*.021)}px "DM Sans",sans-serif`;
  ctx.fillText("pour découvrir ton cadeau",r.width/2,r.height/2+18);
}
function pos(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
function scratch(p){
  if(!last)last=p;
  ctx.globalCompositeOperation="destination-out";
  ctx.lineWidth=Math.max(34,canvas.clientWidth*.075);ctx.lineCap="round";ctx.lineJoin="round";
  ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();
  ctx.beginPath();ctx.arc(p.x,p.y,ctx.lineWidth/2,0,Math.PI*2);ctx.fill();
  last=p;if(++checks%10===0)progress();
}
function progress(){
  const w=canvas.width,h=canvas.height,data=ctx.getImageData(0,0,w,h).data;
  let clear=0,total=0;
  for(let y=12;y<h;y+=Math.max(12,h/25))for(let x=12;x<w;x+=Math.max(12,w/35)){
    if(data[(y*w+x)*4+3]<80)clear++;total++;
  }
  if(clear/total>.5)reveal();
}
function reveal(){
  if(revealed)return;revealed=true;canvas.style.transition="opacity .65s";canvas.style.opacity=0;
  button.textContent="🎉 Cadeau révélé !";button.classList.add("done");
  setTimeout(()=>{canvas.remove();confetti()},650);
}
function confetti(){
  ["🎉","✨","🎈","💝","⭐"].forEach((s,k)=>{
    for(let i=0;i<7;i++){
      const p=document.createElement("span");p.textContent=s;
      Object.assign(p.style,{position:"fixed",left:"50vw",top:"45vh",zIndex:99,pointerEvents:"none",fontSize:`${14+Math.random()*16}px`});
      document.body.appendChild(p);
      const dx=(Math.random()-.5)*520,dy=-100-Math.random()*450,rot=(Math.random()-.5)*900;
      p.animate([{transform:"translate(0,0) rotate(0)",opacity:1},{transform:`translate(${dx}px,${dy}px) rotate(${rot}deg)`,opacity:0}],{duration:1100+Math.random()*900,easing:"cubic-bezier(.2,.8,.3,1)"}).onfinish=()=>p.remove();
    }
  });
}
canvas.addEventListener("pointerdown",e=>{if(revealed)return;drawing=true;canvas.setPointerCapture(e.pointerId);last=pos(e);scratch(last)});
canvas.addEventListener("pointermove",e=>{if(drawing&&!revealed)scratch(pos(e))});
["pointerup","pointercancel","lostpointercapture"].forEach(x=>canvas.addEventListener(x,()=>{drawing=false;last=null}));
button.addEventListener("click",reveal);
window.addEventListener("resize",()=>{if(!revealed)init()});
init();
