import{initializeApp}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import{getDatabase,ref,onValue,set,increment,remove}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import{getAuth,signInWithEmailAndPassword,onAuthStateChanged,signOut}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import{firebaseConfig}from"./firebase-config.js";
const fb=initializeApp(firebaseConfig),db=getDatabase(fb),auth=getAuth(fb),M=ref(db,"match"),RR=ref(db,"rosters");
const $=s=>document.querySelector(s),arr=x=>x?Object.values(x):[],esc=s=>String(s).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const R=location.hash.slice(1);if(R==="display")document.documentElement.classList.add("display");
let S=norm({}),ready=0,filled=0,C={},tab=R==="draw"?"draw":R==="fans"?"fans":"live",mine=0,last=0,RS={};
function norm(s){s=s||{};const d={bpo:6,overs:10,maxW:10,cur:0,first:0,...s};
 d.teams=[0,1].map(i=>{const t=(s.teams||[])[i]||{};return{n:t.n||"Team "+"AB"[i],p:arr(t.p)}});
 d.inn=[0,1].map(i=>{const t=(s.inn||[])[i]||{};return{b:arr(t.b),st:t.st??-1,ns:t.ns??-1}});
 d.draw={t:Array.from({length:12},(_,i)=>{const x=(s.draw?.t||[])[i]||{};return{n:x.n||"Team "+"ABCDEFGHIJKL"[i],p:arr(x.p)}}),w:{...(s.draw?.w||{})}};d.live=s.live||"";return d}
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
const MT={m1:[2,3],m2:[4,5],m3:[6,7],m4:[8,9],m5:[0,1],m6:[10,11],m7:["m1","m2"],m8:["m3","m4"],m9:["m5","m7"],m10:["m8","m6"],m11:["m9","m10"]};
const win=m=>{const w=S.draw.w[m];return w==null?null:+w},part=c=>typeof c==="number"?c:win(c),tn=i=>i==null?"?":S.draw.t[i].n,top=()=>[...Array(12).keys()].sort((a,b)=>(C[b]||0)-(C[a]||0));
function node(c,o){
 if(typeof c==="number"){const y=24+c*36;o.push(`<path d="M0 ${y}H170"/><text x="4" y="${y-6}">${esc(tn(c))}</text>`);return{x:170,y,h:0}}
 const a=MT[c].map(z=>node(z,o)),h=1+Math.max(a[0].h,a[1].h),x=170+h*100,y=(a[0].y+a[1].y)/2,w=win(c),lv=S.live===c;
 o.push(`<path d="M${a[0].x} ${a[0].y}H${x}V${a[1].y}H${a[1].x}"/><text class="m ${lv?"lv":""}" x="${x+6}" y="${y+16}">M${c.slice(1)}${lv?" LIVE":""}</text>`);
 if(w!==null)o.push(`<text class="w" x="${x+6}" y="${y-6}">${esc(tn(w).slice(0,13))}</text>`);
 return{x,y,h}}
function drawView(){const o=[],r=node("m11",o),w=win("m11");o.push(`<path d="M${r.x} ${r.y}h60"/><text class="w" x="${r.x+8}" y="${r.y-8}">${w===null?"Champion":esc(tn(w).slice(0,13))}</text>`);
 return`<div class=cd><div class=tt>Tournament draw</div><div style="overflow-x:auto"><svg class="dr" viewBox="0 0 720 440" style="min-width:660px">${o.join("")}</svg></div></div>`}
function fans(){const n=i=>C[i]||0,o=top(),mx=Math.max(1,n(o[0]));
 return`<div class=cd><div class=tt>Cheer for your team</div><div class=row><select id=ft>${S.draw.t.map((t,i)=>`<option value=${i} ${i===mine?"selected":""}>${esc(t.n)}</option>`).join("")}</select><button class="b cheer" data-cheer=1>Cheer!</button></div></div>
 <div class=cd><div class=tt>Best supporting team</div>${o.map((i,r)=>`<div class=lb><span>${r+1}. ${esc(S.draw.t[i].n)}${r===0&&n(i)?" ★":""}</span><span class=bar><i style="width:${n(i)/mx*100}%"></i></span><b>${n(i)}</b></div>`).join("")}</div>`}
function banner(){const el=$("#bnr");if(!el)return;const t=top()[0];el.textContent=C[t]?`★ Best supporting team: ${S.draw.t[t].n} · ${C[t]} cheers`:"★ Best supporting team: be the first to cheer for yours!"}
function view(){document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("on",b.dataset.t===tab));$("#app").innerHTML=tab==="draw"?drawView():tab==="fans"?fans():live()}
function dmx(){return Object.keys(MT).map(m=>{const p=MT[m].map(part),w=win(m),no=p.includes(null);return`<div class=row style="align-items:center"><b style="width:3rem">M${m.slice(1)}</b>${no?'<span class=mu style="flex:1">Waiting for earlier winners</span>':p.map(t=>`<button class=b data-w="${m}:${t}" style="${w===t?"border-color:#22d3e6;color:#22d3e6":""}">${esc(tn(t))} won</button>`).join('<span class=mu>vs</span>')}<button class=b data-live=${m} ${no?"disabled":""}>${S.live===m?"Live now":"Go live"}</button></div>`}).join("")}
function live(){const k=S.cur,bat=k?1-S.first:S.first,c=calc(S,k),I=S.inn[k],T=S.teams,left=S.overs*S.bpo-c.L,a=calc(S,0);
 const crr=c.L?(c.R*S.bpo/c.L).toFixed(2):"0.00";let ch="",wp="",res="";
 if(k){const t=a.R+1,need=Math.max(t-c.R,0),q=Math.round(winp(S)*100);
  ch=`<span class=chip>Target <b>${t}</b></span><span class=chip>Need <b>${need}</b> off <b>${left}</b> balls</span><span class=chip>Req. rate <b>${left>0?(need*S.bpo/left).toFixed(2):"-"}</b></span>`;
  wp=`<div class=cd><div class=tt>Win probability</div><div class=bar><i style="width:${q}%"></i><i style="width:${100-q}%;background:#f59e0b"></i></div><div class=sp><span>${esc(T[bat].n)} ${q}%</span><span>${esc(T[1-bat].n)} ${100-q}%</span></div></div>`;
  if(over(S,1))res=c.R>=t?`${T[bat].n} won by ${S.maxW-c.W} wickets`:c.R===t-1?"Match tied":`${T[1-bat].n} won by ${t-1-c.R} runs`}
 else ch=`<span class=chip>Projected <b>${c.L?Math.round(c.R+c.R/c.L*left):0}</b></span>`;
 const ids=[...new Set([...Object.keys(c.bt).map(Number),I.st,I.ns])].filter(i=>i>=0).sort((x,y)=>x-y);
 const rows=ids.map(i=>{const q=c.bt[i]||{r:0,b:0,f:0,s:0};return`<tr class="${q.out?"o":""}"><td>${esc(nm(bat,i))}${i===I.st?" *":""}</td><td><b>${q.r}</b> (${q.b})</td><td>${q.f}</td><td>${q.s}</td><td>${q.b?Math.round(q.r*100/q.b):"-"}</td></tr>`}).join("");
 const co=c.L&&c.L%S.bpo===0?c.L/S.bpo-1:Math.floor(c.L/S.bpo),tb=c.bl.filter(z=>z.o===co).map(z=>`<span class="ball ${z.c}">${z.l}</span>`).join("");
 const tm=t=>{const j=t===S.first?0:1,x=calc(S,j);return`<div class="tm ${t===bat?"on":""}"><div class=nmx>${esc(T[t].n)}</div><div class=mu>${j>k?"Yet to bat":`${x.R}/${x.W} (${ov(x)})`}</div>${t===bat?"<span class=chip>Batting</span>":""}</div>`};
 return`<div class="cd vs">${tm(0)}<b class=vsx>VS</b>${tm(1)}</div><div class=grid><div><div class=cd><div class=tt>${esc(T[bat].n)} · Innings ${k+1}</div><div class=big>${c.R}/${c.W}</div><div class=mu>${ov(c)} / ${S.overs} overs · CRR ${crr}</div>
 <div style="margin-top:.6rem">${ch}</div>${k?`<div class=mu>${esc(T[1-bat].n)}: ${a.R}/${a.W} (${ov(a)})</div>`:""}${res?`<div class=res>${esc(res)}</div>`:""}</div>
 <div class=cd><div class=tt>This over</div>${tb||'<span class=mu>—</span>'}</div>${wp}</div>
 <div><div class=cd><div class=tt>Batting</div><table><tr><th>Batter<th>Runs<th>4s<th>6s<th>SR</tr>${rows}</table></div>
 <div class=cd><div class=tt>Runs per over</div>${bars(c)}</div></div></div>`}
const key=n=>n.trim().replace(/[.$#\[\]\/]/g,"_"),teamList=()=>Object.values(RS).map(t=>({n:t.n,p:arr(t.p)})).sort((a,b)=>a.n.localeCompare(b.n));
function teamsUI(){if(!$("#reg"))return;const L=teamList(),opt=L.map(t=>`<option value="${esc(t.n)}">${esc(t.n)}</option>`).join("");
 $("#tl").innerHTML=L.length?L.map((t,i)=>`<div class=row style="margin:.3rem 0"><span style="flex:1"><b>${esc(t.n)}</b> <span class=mu>· ${t.p.length} players</span></span><button class=b data-e=${i}>Edit</button><button class=b data-d=${i}>Delete</button></div>`).join(""):'<span class=mu>No teams registered yet.</span>';
 [0,1].forEach(i=>{const s=$("#n"+i),cur=s.value||S.teams[i].n;s.innerHTML=`<option value="">— select team —</option>`+opt;s.value=cur;if(s.selectedIndex<0)s.selectedIndex=0;const t=L.find(x=>x.n===s.value);$("#pv"+i).textContent=t?t.p.join(", "):""});
 for(let i=0;i<12;i++){const s=$("#dn"+i);if(!s)continue;const cur=s.value||S.draw.t[i].n;s.innerHTML=`<option value="">Team ${"ABCDEFGHIJKL"[i]} (unassigned)</option>`+opt;s.value=cur;if(s.selectedIndex<0)s.selectedIndex=0}}
function adm(){if(!$("#sc"))return;if(!filled){filled=1;[0,1].forEach(i=>$("#n"+i).value="");teamsUI();$("#bpo").value=S.bpo;$("#ov").value=S.overs;$("#mw").value=S.maxW;$("#fi").value=S.first}
 const k=S.cur,I=S.inn[k],c=calc(S,k),bat=k?1-S.first:S.first;
 const op=v=>`<option value="-1">— select —</option>`+names(bat).map((n,i)=>!(c.bt[i]&&c.bt[i].out)||i===v?`<option value="${i}" ${i===v?"selected":""}>${esc(n)}</option>`:"").join("");
 $("#ih").textContent=`Innings ${k+1} · ${S.teams[bat].n} batting`;$("#sc").textContent=`${c.R}/${c.W} (${ov(c)})`;
 $("#st").innerHTML=op(I.st);$("#ns").innerHTML=op(I.ns);$("#in2").style.display=k?"none":"";$("#dm").innerHTML=dmx()}
function ball(r){const k=S.cur,I=S.inn[k];if(over(S,k))return alert("This innings is over.");
 if(I.st<0||I.ns<0)return alert("Select the striker and non-striker first.");
 const e=$("input[name=ex]:checked").value,w=$("#wk").checked?1:0,lg=e!=="wd"&&e!=="nb",L=calc(S,k).L,b={b:I.st,r:0,x:0,e,w,ps:I.st,pn:I.ns};
 if(e==="wd")b.x=1+r;else if(e==="nb"){b.x=1;b.r=r}else if(e==="b"||e==="lb")b.x=r;else b.r=r;
 I.b.push(b);if(r%2)[I.st,I.ns]=[I.ns,I.st];if(lg&&(L+1)%S.bpo===0)[I.st,I.ns]=[I.ns,I.st];
 if(w){if(I.st===b.b)I.st=-1;else I.ns=-1}
 $("#nx").checked=1;$("#wk").checked=false;put()}
function panel(){$("#app").innerHTML=`<div class=cd id=reg><div class=tt>Team registry</div>
 <div class=row><input id=rn placeholder="Team name"><textarea id=rp rows=6 placeholder="Players, one per line"></textarea><button class=b id=rsave>Save team</button></div>
 <div id=tl></div></div>
 <div class=cd><div class=tt>Match setup</div>
 <div class=row><label>Team 1<select id=n0></select><span class=mu id=pv0></span></label><label>Team 2<select id=n1></select><span class=mu id=pv1></span></label></div>
 
 <div class=row><label>Balls per over<select id=bpo><option>6<option>4</select></label><label>Overs<input id=ov type=number min=1 style="width:5rem"></label><label>Max wickets<input id=mw type=number min=1 style="width:5rem"></label><label>Bats first<select id=fi><option value=0>Team 1<option value=1>Team 2</select></label><button class=b id=save>Save setup</button></div></div>
 <div class=cd><div class=tt id=ih></div><div class=big id=sc style="font-size:3.2rem"></div>
 <div class=row><label>Striker<select id=st></select></label><label>Non-striker<select id=ns></select></label></div>
 <div class=row>${[["","Normal"],["wd","Wide"],["nb","No ball"],["b","Bye"],["lb","Leg bye"]].map((x,i)=>`<label style="display:flex;gap:.3rem;align-items:center"><input type=radio name=ex value="${x[0]}" ${i?"":"id=nx checked"}>${x[1]}</label>`).join("")}<label style="display:flex;gap:.3rem;align-items:center"><input type=checkbox id=wk>Wicket</label></div>
 <div class=mu>Pick the extra type and wicket first, then tap the runs.</div><div class=runs>${[0,1,2,3,4,5,6].map(r=>`<button class=b data-r=${r}>${r}</button>`).join("")}</div>
 <div class=row><button class=b id=undo>Undo last ball</button><button class=b id=in2>Start 2nd innings</button><button class=b id=csv>Export CSV</button><button class=b id=rst>Reset match</button><button class=b id=out>Sign out</button></div></div>
 <div class=cd><div class=tt>Draw · teams and winners</div>${[...Array(12).keys()].map(i=>`<div class=row><b style="width:5rem">Slot ${"ABCDEFGHIJKL"[i]}</b><select id=dn${i}></select></div>`).join("")}
 <button class=b id=sd>Save teams</button> <button class=b id=rc>Reset support votes</button><div id=dm style="margin-top:.8rem"></div></div>`;
 ready=1;filled=0;adm();
 $("#rsave").onclick=()=>{const n=$("#rn").value.trim(),p=$("#rp").value.split("\n").map(s=>s.trim()).filter(Boolean);
  if(!n)return alert("Enter a team name.");if(p.length<2)return alert("Add at least 2 players.");
  set(ref(db,"rosters/"+key(n)),{n,p}).then(()=>{$("#rn").value="";$("#rp").value=""}).catch(()=>alert("Could not save the team. Check the database rules and that you are signed in as an admin."))};
 $("#tl").onclick=e=>{const b=e.target.closest("button");if(!b)return;const L=teamList();
  if(b.dataset.e!==undefined){const t=L[+b.dataset.e];$("#rn").value=t.n;$("#rp").value=t.p.join("\n");$("#rn").scrollIntoView()}
  else if(b.dataset.d!==undefined){const t=L[+b.dataset.d];if(confirm("Delete "+t.n+" from the registry?"))remove(ref(db,"rosters/"+key(t.n)))}};
 $("#n0").onchange=$("#n1").onchange=teamsUI;
 $(".runs").onclick=e=>{const r=e.target.dataset.r;if(r!==undefined)ball(+r)};
 $("#st").onchange=e=>{S.inn[S.cur].st=+e.target.value;put()};$("#ns").onchange=e=>{S.inn[S.cur].ns=+e.target.value;put()};
 $("#save").onclick=()=>{const L=teamList(),t=[0,1].map(i=>L.find(x=>x.n===$("#n"+i).value));
  if(!t[0]||!t[1])return alert("Select both teams first.");if(t[0].n===t[1].n)return alert("Pick two different teams.");
  const chg=t.some((x,i)=>x.n!==S.teams[i].n||x.p.join("|")!==S.teams[i].p.join("|"));
  if(chg&&S.inn.some(I=>I.b.length)&&!confirm("Balls are already recorded. Changing the teams or players can mix up the names in the scorecard. Continue?"))return;
  S.teams=t.map(x=>({n:x.n,p:x.p}));
  S.bpo=+$("#bpo").value;S.overs=+$("#ov").value;S.maxW=+$("#mw").value;S.first=+$("#fi").value;put()};
 $("#undo").onclick=()=>{const I=S.inn[S.cur];if(!I.b.length){if(S.cur){S.cur=0;put()}return}const x=I.b.pop();I.st=x.ps;I.ns=x.pn;put()};
 $("#in2").onclick=()=>{if(confirm("Start the 2nd innings?")){S.cur=1;S.inn[1]={b:[],st:-1,ns:-1};put()}};
 $("#rst").onclick=()=>{if(confirm("Reset the whole match? Scores will be erased.")){S=norm({...S,cur:0,inn:[]});put()}};
 $("#out").onclick=()=>signOut(auth);
 $("#sd").onclick=()=>{S.draw.t=[...Array(12).keys()].map(i=>{const n=$("#dn"+i).value,t=teamList().find(x=>x.n===n);return{n:n||"Team "+"ABCDEFGHIJKL"[i],p:t?t.p:[]}});put()};
 $("#rc").onclick=()=>{if(confirm("Clear all support votes?"))set(ref(db,"cheers"),null)};
 $("#dm").onclick=e=>{const d=e.target.dataset;
  if(d.w){const[m,t]=d.w.split(":");S.draw.w[m]=+t;for(const x of Object.keys(MT)){const w=win(x);if(w!==null&&!MT[x].map(part).includes(w))delete S.draw.w[x]}put()}
  if(d.live&&confirm("Start this match? The live scoreboard will be cleared.")){const[a,b]=MT[d.live].map(part),T=i=>{const n=S.draw.t[i].n,t=teamList().find(x=>x.n===n);return{n,p:t?t.p:S.draw.t[i].p}};S=norm({...S,live:d.live,cur:0,inn:[],teams:[T(a),T(b)],first:0});filled=0;put()}};
 $("#csv").onclick=()=>{const r=["innings,ball,batter,bat_runs,extra,extra_runs,wicket"];S.inn.forEach((I,k)=>I.b.forEach((x,i)=>r.push([k+1,i+1,`"${nm(k?1-S.first:S.first,x.b)}"`,x.r,x.e,x.x,x.w].join(","))));
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([r.join("\n")],{type:"text/csv"}));a.download="datadash-balls.csv";a.click()}}
function login(){ready=0;$("#app").innerHTML=`<div class=cd><div class=tt>Admin sign in</div><div class=row><input id=em type=email placeholder="Email"><input id=pw type=password placeholder="Password"><button class=b id=go>Sign in</button></div></div>`;
 $("#go").onclick=()=>signInWithEmailAndPassword(auth,$("#em").value,$("#pw").value).catch(()=>alert("Sign in failed. Check your email and password."))}
const render=()=>{banner();R==="admin"?adm():view()};
onValue(M,s=>{S=norm(s.val());render()});
onValue(ref(db,"cheers"),s=>{C=s.val()||{};if(R!=="admin")render()});
onValue(ref(db,".info/connected"),s=>{$("#live").className=s.val()?"on":"off"});
if(R==="admin"){onValue(RR,s=>{RS=s.val()||{};teamsUI()});onAuthStateChanged(auth,u=>u?panel():login())}

if(!$("#tabs"))$("#app").insertAdjacentHTML("beforebegin",'<nav class="tabs wrap" id="tabs"></nav>');
if(!$("#bnr"))$("#tabs").insertAdjacentHTML("beforebegin",'<div class=wrap><button class=bn id=bnr></button></div>');
if(R!=="admin"){$("#tabs").innerHTML=[["live","Live score"],["draw","Draw"],["fans","Support"]].map(x=>`<button class=tab data-t=${x[0]}>${x[1]}</button>`).join("");$("#tabs").onclick=e=>{if(e.target.dataset.t){tab=e.target.dataset.t;view()}}}else{$("#tabs").style.display="none";$("#bnr").parentElement.style.display="none"}
$("#bnr").onclick=()=>{if(R!=="admin"){tab="fans";view()}};
$("#app").addEventListener("click",e=>{const d=e.target.dataset;if(d.go){tab=d.go;view()}if(d.cheer&&Date.now()-last>350){last=Date.now();set(ref(db,"cheers/"+mine),increment(1))}});
$("#app").addEventListener("change",e=>{if(e.target.id==="ft")mine=+e.target.value});