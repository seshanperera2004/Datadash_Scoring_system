import{initializeApp}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import{getDatabase,ref,onValue,set}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import{getAuth,signInWithEmailAndPassword,onAuthStateChanged,signOut}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import{firebaseConfig}from"./firebase-config.js";
const fb=initializeApp(firebaseConfig),db=getDatabase(fb),auth=getAuth(fb),M=ref(db,"match");
const $=s=>document.querySelector(s),arr=x=>x?Object.values(x):[],esc=s=>String(s).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const R=location.hash.slice(1);if(R==="display")document.documentElement.classList.add("display");
let S=norm({}),ready=0,filled=0;
function norm(s){s=s||{};const d={bpo:6,overs:10,maxW:10,cur:0,first:0,...s};
 d.teams=[0,1].map(i=>{const t=(s.teams||[])[i]||{};return{n:t.n||"Team "+"AB"[i],p:arr(t.p)}});
 d.inn=[0,1].map(i=>{const t=(s.inn||[])[i]||{};return{b:arr(t.b),st:t.st??-1,ns:t.ns??-1}});return d}
const put=()=>set(M,S),nm=(t,i)=>S.teams[t].p[i]||"Player "+(i+1),names=t=>Array.from({length:Math.max(S.teams[t].p.length,2)},(_,i)=>nm(t,i));
const ov=c=>Math.floor(c.L/S.bpo)+"."+c.L%S.bpo;
function calc(S,k){const bt={},o_=[],ow=[],bl=[];let R=0,W=0,L=0;
 for(const x of S.inn[k].b){const t=x.r+x.x,lg=x.e!=="wd"&&x.e!=="nb",o=Math.floor(L/S.bpo);
  while(o_.length<=o){o_.push(0);ow.push(0)}
  R+=t;o_[o]+=t;const q=bt[x.b]||(bt[x.b]={r:0,b:0,f:0,s:0,out:0});
  if(x.e!=="wd")q.b++;q.r+=x.r;if(x.r===4)q.f++;if(x.r===6)q.s++;if(x.w){W++;ow[o]++;q.out=1}
  bl.push({o,l:x.w?"W":x.e==="wd"?"Wd"+(x.x>1?"+"+(x.x-1):""):x.e==="nb"?"Nb"+(x.r?"+"+x.r:""):x.e?x.x+x.e:""+x.r,c:x.w?"w":!x.e&&x.r===4?"f":!x.e&&x.r===6?"s":""});
  if(lg)L++}
 return{R,W,L,bt,ov:o_,ow,bl}}
function over(S,k){const c=calc(S,k);return c.W>=S.maxW||c.L>=S.overs*S.bpo||(k===1&&c.R>=calc(S,0).R+1)}
function winp(S){const t=calc(S,0).R+1,c=calc(S,1),tot=S.overs*S.bpo;if(c.R>=t)return 1;if(c.W>=S.maxW||c.L>=tot)return 0;
 const n=[0,0,0,0,0,0,0],pr=[.35,.3,.08,.01,.1,.06,.1],v=[0,1,2,3,4,6,0],m=[0,1,2,3,4,4,5],B=S.inn[1].b,p=[];
 for(const x of B)n[x.w?6:m[Math.min(x.r+x.x,6)]]++;
 let s=0;for(let i=0;i<7;i++){s+=(n[i]+pr[i]*12)/(B.length+12);p.push(s)}
 let win=0;for(let z=0;z<2000;z++){let r=c.R,w=c.W,l=c.L;
  while(l<tot&&w<S.maxW&&r<t){const u=Math.random()*s;let i=0;while(u>p[i])i++;if(i===6)w++;else r+=v[i];l++}
  if(r>=t)win++}return win/2000}
function bars(c){const n=Math.max(S.overs,c.ov.length),m=Math.max(6,...c.ov),w=300/n;
 return`<svg viewBox="0 0 300 110">`+Array.from({length:n},(_,i)=>{const v=c.ov[i]||0,h=v/m*85,x=i*w;
  return`<rect x="${x+2}" y="${100-h}" width="${w-4}" height="${h}" rx="2" fill="#22d3e6" opacity=".85"/>`+(v?`<text x="${x+w/2}" y="108" font-size="7" fill="#8aa3bf" text-anchor="middle">${v}</text>`:"")+(c.ow[i]?`<circle cx="${x+w/2}" cy="${95-h}" r="3.5" fill="#ff4d6d"/>`:"")}).join("")+`</svg>`}
function view(){const k=S.cur,bat=k?1-S.first:S.first,c=calc(S,k),I=S.inn[k],T=S.teams,left=S.overs*S.bpo-c.L,a=calc(S,0);
 const crr=c.L?(c.R*S.bpo/c.L).toFixed(2):"0.00";let ch="",wp="",res="";
 if(k){const t=a.R+1,need=Math.max(t-c.R,0),q=Math.round(winp(S)*100);
  ch=`<span class=chip>Target <b>${t}</b></span><span class=chip>Need <b>${need}</b> off <b>${left}</b> balls</span><span class=chip>Req. rate <b>${left>0?(need*S.bpo/left).toFixed(2):"-"}</b></span>`;
  wp=`<div class=cd><div class=tt>Win probability</div><div class=bar><i style="width:${q}%"></i><i style="width:${100-q}%;background:#f59e0b"></i></div><div class=sp><span>${esc(T[bat].n)} ${q}%</span><span>${esc(T[1-bat].n)} ${100-q}%</span></div></div>`;
  if(over(S,1))res=c.R>=t?`${T[bat].n} won by ${S.maxW-c.W} wickets`:c.R===t-1?"Match tied":`${T[1-bat].n} won by ${t-1-c.R} runs`}
 else ch=`<span class=chip>Projected <b>${c.L?Math.round(c.R+c.R/c.L*left):0}</b></span>`;
 const ids=[...new Set([...Object.keys(c.bt).map(Number),I.st,I.ns])].filter(i=>i>=0).sort((x,y)=>x-y);
 const rows=ids.map(i=>{const q=c.bt[i]||{r:0,b:0,f:0,s:0};return`<tr class="${q.out?"o":""}"><td>${esc(nm(bat,i))}${i===I.st?" *":""}</td><td><b>${q.r}</b> (${q.b})</td><td>${q.f}</td><td>${q.s}</td><td>${q.b?Math.round(q.r*100/q.b):"-"}</td></tr>`}).join("");
 const co=c.L&&c.L%S.bpo===0?c.L/S.bpo-1:Math.floor(c.L/S.bpo),tb=c.bl.filter(z=>z.o===co).map(z=>`<span class="ball ${z.c}">${z.l}</span>`).join("");
 $("#app").innerHTML=`<div class=grid><div><div class=cd><div class=tt>${esc(T[bat].n)} · Innings ${k+1}</div><div class=big>${c.R}/${c.W}</div><div class=mu>${ov(c)} / ${S.overs} overs · CRR ${crr}</div>
 <div style="margin-top:.6rem">${ch}</div>${k?`<div class=mu>${esc(T[1-bat].n)}: ${a.R}/${a.W} (${ov(a)})</div>`:""}${res?`<div class=res>${esc(res)}</div>`:""}</div>
 <div class=cd><div class=tt>This over</div>${tb||'<span class=mu>—</span>'}</div>${wp}</div>
 <div><div class=cd><div class=tt>Batting</div><table><tr><th>Batter<th>Runs<th>4s<th>6s<th>SR</tr>${rows}</table></div>
 <div class=cd><div class=tt>Runs per over</div>${bars(c)}</div></div></div>`}
function adm(){if(!$("#sc"))return;if(!filled){filled=1;[0,1].forEach(i=>{$("#n"+i).value=S.teams[i].n;$("#p"+i).value=S.teams[i].p.join("\n")});$("#bpo").value=S.bpo;$("#ov").value=S.overs;$("#mw").value=S.maxW;$("#fi").value=S.first}
 const k=S.cur,I=S.inn[k],c=calc(S,k),bat=k?1-S.first:S.first;
 const op=v=>`<option value="-1">— select —</option>`+names(bat).map((n,i)=>!(c.bt[i]&&c.bt[i].out)||i===v?`<option value="${i}" ${i===v?"selected":""}>${esc(n)}</option>`:"").join("");
 $("#ih").textContent=`Innings ${k+1} · ${S.teams[bat].n} batting`;$("#sc").textContent=`${c.R}/${c.W} (${ov(c)})`;
 $("#st").innerHTML=op(I.st);$("#ns").innerHTML=op(I.ns);$("#in2").style.display=k?"none":""}
function ball(r){const k=S.cur,I=S.inn[k];if(over(S,k))return alert("This innings is over.");
 if(I.st<0||I.ns<0)return alert("Select the striker and non-striker first.");
 const e=$("input[name=ex]:checked").value,w=$("#wk").checked?1:0,lg=e!=="wd"&&e!=="nb",L=calc(S,k).L,b={b:I.st,r:0,x:0,e,w,ps:I.st,pn:I.ns};
 if(e==="wd")b.x=1+r;else if(e==="nb"){b.x=1;b.r=r}else if(e==="b"||e==="lb")b.x=r;else b.r=r;
 I.b.push(b);if(r%2)[I.st,I.ns]=[I.ns,I.st];if(lg&&(L+1)%S.bpo===0)[I.st,I.ns]=[I.ns,I.st];
 if(w){if(I.st===b.b)I.st=-1;else I.ns=-1}
 $("#nx").checked=1;$("#wk").checked=false;put()}
function panel(){$("#app").innerHTML=`<div class=cd><div class=tt>Match setup</div>
 <div class=row><input id=n0 placeholder="Team 1 name"><input id=n1 placeholder="Team 2 name"></div>
 <div class=row><textarea id=p0 rows=6 placeholder="Team 1 players, one per line"></textarea><textarea id=p1 rows=6 placeholder="Team 2 players, one per line"></textarea></div>
 <div class=row><label>Balls per over<select id=bpo><option>6<option>4</select></label><label>Overs<input id=ov type=number min=1 style="width:5rem"></label><label>Max wickets<input id=mw type=number min=1 style="width:5rem"></label><label>Bats first<select id=fi><option value=0>Team 1<option value=1>Team 2</select></label><button class=b id=save>Save setup</button></div></div>
 <div class=cd><div class=tt id=ih></div><div class=big id=sc style="font-size:3.2rem"></div>
 <div class=row><label>Striker<select id=st></select></label><label>Non-striker<select id=ns></select></label></div>
 <div class=row>${[["","Normal"],["wd","Wide"],["nb","No ball"],["b","Bye"],["lb","Leg bye"]].map((x,i)=>`<label style="display:flex;gap:.3rem;align-items:center"><input type=radio name=ex value="${x[0]}" ${i?"":"id=nx checked"}>${x[1]}</label>`).join("")}<label style="display:flex;gap:.3rem;align-items:center"><input type=checkbox id=wk>Wicket</label></div>
 <div class=mu>Pick the extra type and wicket first, then tap the runs.</div><div class=runs>${[0,1,2,3,4,5,6].map(r=>`<button class=b data-r=${r}>${r}</button>`).join("")}</div>
 <div class=row><button class=b id=undo>Undo last ball</button><button class=b id=in2>Start 2nd innings</button><button class=b id=csv>Export CSV</button><button class=b id=rst>Reset match</button><button class=b id=out>Sign out</button></div></div>`;
 ready=1;filled=0;adm();
 $(".runs").onclick=e=>{const r=e.target.dataset.r;if(r!==undefined)ball(+r)};
 $("#st").onchange=e=>{S.inn[S.cur].st=+e.target.value;put()};$("#ns").onchange=e=>{S.inn[S.cur].ns=+e.target.value;put()};
 $("#save").onclick=()=>{S.teams=[0,1].map(i=>({n:$("#n"+i).value.trim()||"Team "+(i+1),p:$("#p"+i).value.split("\n").map(s=>s.trim()).filter(Boolean)}));
  S.bpo=+$("#bpo").value;S.overs=+$("#ov").value;S.maxW=+$("#mw").value;S.first=+$("#fi").value;put()};
 $("#undo").onclick=()=>{const I=S.inn[S.cur];if(!I.b.length){if(S.cur){S.cur=0;put()}return}const x=I.b.pop();I.st=x.ps;I.ns=x.pn;put()};
 $("#in2").onclick=()=>{if(confirm("Start the 2nd innings?")){S.cur=1;S.inn[1]={b:[],st:-1,ns:-1};put()}};
 $("#rst").onclick=()=>{if(confirm("Reset the whole match? Scores will be erased.")){S=norm({bpo:S.bpo,overs:S.overs,maxW:S.maxW,first:S.first,teams:S.teams});put()}};
 $("#out").onclick=()=>signOut(auth);
 $("#csv").onclick=()=>{const r=["innings,ball,batter,bat_runs,extra,extra_runs,wicket"];S.inn.forEach((I,k)=>I.b.forEach((x,i)=>r.push([k+1,i+1,`"${nm(k?1-S.first:S.first,x.b)}"`,x.r,x.e,x.x,x.w].join(","))));
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([r.join("\n")],{type:"text/csv"}));a.download="datadash-balls.csv";a.click()}}
function login(){ready=0;$("#app").innerHTML=`<div class=cd><div class=tt>Admin sign in</div><div class=row><input id=em type=email placeholder="Email"><input id=pw type=password placeholder="Password"><button class=b id=go>Sign in</button></div></div>`;
 $("#go").onclick=()=>signInWithEmailAndPassword(auth,$("#em").value,$("#pw").value).catch(()=>alert("Sign in failed. Check your email and password."))}
const render=()=>R==="admin"?adm():view();
onValue(M,s=>{S=norm(s.val());render()});
onValue(ref(db,".info/connected"),s=>{$("#live").className=s.val()?"on":"off"});
if(R==="admin")onAuthStateChanged(auth,u=>u?panel():login());
