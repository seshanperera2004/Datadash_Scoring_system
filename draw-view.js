// Knockout bracket drawn like the hand-drawn sketch: 12 teams (A-L), 6 first-round pairs, byes for the A-B and K-L winners.
export const MT={m1:[2,3],m2:[4,5],m3:[6,7],m4:[8,9],m5:[0,1],m6:[10,11],m7:["m1","m2"],m8:["m3","m4"],m9:["m5","m7"],m10:["m8","m6"],m11:["m9","m10"]};
const esc=s=>String(s).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const X0=190,ST=90,Y0=26,RH=36;
// tn(i) -> name of team slot i, win(matchId) -> winning slot index or null, live -> id of the live match
export function bracket(tn,win,live){const o=[];
 const node=c=>{
  if(typeof c==="number"){const y=Y0+c*RH;o.push(`<path d="M0 ${y}H${X0}"/><circle class="lt" cx="13" cy="${y-9}" r="12"/><text class="lt" x="13" y="${y-4}" text-anchor="middle">${"ABCDEFGHIJKL"[c]}</text><text x="34" y="${y-6}">${esc(tn(c).slice(0,15))}</text>`);return{x:X0,y,h:0}}
  const a=MT[c].map(z=>node(z)),h=1+Math.max(a[0].h,a[1].h),x=X0+h*ST,y=(a[0].y+a[1].y)/2,w=win(c),lv=live===c;
  o.push(`<path d="M${a[0].x} ${a[0].y}H${x}V${a[1].y}H${a[1].x}"/><text class="m${lv?" lv":""}" x="${x+6}" y="${y+16}">M${c.slice(1)}${lv?" LIVE":""}</text>`);
  if(w!==null)o.push(`<text class="w" x="${x+6}" y="${y-6}">${esc(tn(w).slice(0,12))}</text>`);
  return{x,y,h}};
 const r=node("m11"),w=win("m11");
 o.push(`<path d="M${r.x} ${r.y}h50"/><text class="w" x="${r.x+8}" y="${r.y-8}">${w===null?"Champion":esc(tn(w).slice(0,12))}</text>`);
 return`<svg class="dr" viewBox="0 0 690 450"><style>.dr path{fill:none;stroke:#2b9ac4;stroke-width:2.5}.dr text{fill:#e9f3ff;font:600 19px Inter,sans-serif}.dr .w{fill:#22d3e6;font-weight:800}.dr .m{fill:#8aa3bf;font-size:13px}.dr .lv{fill:#ff4d6d;font-weight:800}.dr circle.lt{fill:#0e7490}.dr text.lt{fill:#fff;font-weight:800;font-size:15px}</style>${o.join("")}</svg>`}