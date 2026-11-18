/* PRO-EX modules: Home, Spending Habits, Budget (suggested + customize), History, light/dark mode.
   Loaded after enhance.js. Rule-based, no AI or external service. */
(function(){
"use strict";
var W=window;if(typeof W.render!=="function"||typeof W.pxSum!=="function")return;
var g=function(i){return document.getElementById(i)},N=function(v){v=parseFloat(v);return isFinite(v)&&v>0?v:0},R=Math.round,P=function(x){return W.peso(x)},E=function(s){return W.esc(s)};
var COL=["#0f7b5f","#f2b705","#7a4a21","#0b3d2e","#c3b091","#3aa17e","#d98e04","#8a8d91","#5aa02c"];
var TIPS=["Small savings today can make a big difference tomorrow.","Think before you spend. Your future self will thank you.","A smart budget is a step toward financial freedom.","Pay yourself first: set aside your savings before you spend.","Bring a bagged lunch once a week and watch your savings grow.","Needs first, wants later. Ask: do I need it today?","Write down every expense. What you track, you control.","Saving ₱20 a day is ₱600 in a month."];
var NAV={home:["🏠","Home"],habits:["🧩","Habits"],plan:["📝","Planner"],budget:["🎯","Budget"],track:["💸","Tracker"],save:["🪙","Savings"],hist:["📊","History"]};
var rnd=function(){return TIPS[Math.floor(Math.random()*TIPS.length)]};
var sec="home",S={tip:rnd(),ex:false,A:"",G:"",sug:null,dr:null};
function ensure(){var D=W.D;D.hab=D.hab||{c:[["Food and Snacks","e"],["Transportation","e"],["School Supplies","e"],["School Projects and Activities","f"],["Personal Needs","f"],["Other Expenses","f"]].map(function(x){return{n:x[0],a:0,t:x[1]}}),s:0};D.plans=D.plans||[]}
function tt(m,k){var e=g("pxToast");if(!e){e=document.createElement("div");e.id="pxToast";e.setAttribute("role","status");document.body.appendChild(e)}e.className="show "+k;e.textContent=m;clearTimeout(tt.t);tt.t=setTimeout(function(){e.className=""},3500)}
/* theme */
function isDark(){var t=document.documentElement.dataset.theme;return t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches}
try{var th=localStorage.getItem("proex_theme");if(th)document.documentElement.dataset.theme=th}catch(e){}
W.pxTheme=function(){var v=isDark()?"light":"dark";document.documentElement.dataset.theme=v;try{localStorage.setItem("proex_theme",v)}catch(e){}W.render()};
/* navigation */
W.pxGo=function(s){sec=s;W.editing=(s==="plan");if(s==="home")S.tip=rnd();scrollTo(0,0);W.render()};
W.pxExplore=function(){S.ex=!S.ex;W.render()};W.pxTip=function(){S.tip=rnd();W.render()};
var ob=W.boot;W.boot=function(){sec="home";S.tip=rnd();S.sug=null;S.dr=null;S.A="";S.G="";ob()};
var base=W.render;
W.render=function(){var D=W.D;
 if(W.U&&D){ensure();var day=D.days[W.today()];if(sec==="plan"&&!W.editing&&day)sec="track";if(sec==="track"&&!day)sec="plan";
  W.tab=sec==="save"?"goal":(sec==="plan"||sec==="track")?"today":"px"}
 base();if(W.U&&D)mount()};
function mount(){var A=g("app"),top=A.querySelector(".top");if(!top)return;
 var nv=A.querySelector("nav");if(nv)nv.remove();
 var lo=top.querySelector(".ghost");if(lo)lo.insertAdjacentHTML("beforebegin",'<button class="ghost pxth" onclick="pxTheme()" aria-label="Switch light or dark mode">'+(isDark()?"☀️":"🌙")+'</button>');
 var v={home:vHome,habits:vHabits,budget:vBudget,hist:vHist}[sec];
 if(v)top.insertAdjacentHTML("afterend",'<div class="pxpage">'+v()+'</div>');else extras();
 A.insertAdjacentHTML("beforeend",'<nav class="pxnav" aria-label="Main">'+Object.keys(NAV).map(function(k){return'<button class="'+(k===sec?"on":"")+'" onclick="pxGo(\''+k+'\')" aria-label="'+NAV[k][1]+'"><span>'+NAV[k][0]+'</span><span>'+NAV[k][1]+'</span></button>'}).join("")+'</nav>')}
/* tracker extras: category picker + category budget vs actual */
function extras(){var D=W.D,t=D.days[W.today()];if(sec!=="track"||!t)return;
 var cats=t.cat?Object.keys(t.cat):D.hab.c.map(function(x){return x.n});if(cats.indexOf("Other Expenses")<0)cats.push("Other Expenses");
 var el=g("el");if(el&&!g("pxcat"))el.insertAdjacentHTML("afterend",'<label>Category</label><select id="pxcat">'+cats.map(function(c){return'<option>'+E(c)+'</option>'}).join("")+'</select>');
 var pn=g("pxPanel");if(!t.cat||!pn)return;var sp={};
 (t.exp||[]).forEach(function(e){var k=e.c&&t.cat[e.c]!=null?e.c:(t.cat["Other Expenses"]!=null?"Other Expenses":"Not in plan");sp[k]=(sp[k]||0)+e.a});
 var ks=Object.keys(t.cat);if(sp["Not in plan"])ks.push("Not in plan");
 pn.insertAdjacentHTML("afterend",'<section class="card"><h2>🎯 Category budget vs actual</h2>'+ks.map(function(k){var a=t.cat[k]||0,s=sp[k]||0,o=s>a,p=a?Math.min(100,s/a*100):(s?100:0);return'<div class="row"><span>'+E(k)+'<div class="bar pxbar'+(o?" bad":"")+'" style="width:140px"><i style="width:'+p+'%"></i></div></span><span style="text-align:right"><b style="color:'+(o?"var(--bad)":"inherit")+'">'+P(s)+'</b><br><span class="mut">of '+P(a)+'</span></span></div>'}).join("")+'</section>')}
var oa=W.addExp;W.addExp=function(){var s=g("pxcat"),c=s?s.value:"",t=W.D.days[W.today()],len=t?t.exp.length:0,o=oa.apply(this,arguments);t=W.D.days[W.today()];
 if(t&&t.exp.length>len&&c){t.exp[t.exp.length-1].c=c;W.save();W.render()}return o};
/* HOME */
function vHome(){var nm=E(W.U.name.split(" ")[0]),F=[["📝","PLAN YOUR MONEY","Organize your daily allowance.","plan"],["💸","TRACK YOUR SPENDING","Monitor where your money goes.","track"],["🪙","GROW YOUR SAVINGS","Develop better saving habits.","save"]];
 var ex=[["habits","🧩","My Spending Habits","Tell PRO-EX what you usually spend."],["plan","📝","Budget Planner","Enter today's allowance and savings goal."],["budget","🎯","Budget","Get a personalized plan, then customize it."],["track","💸","Expense Tracker","Record expenses and see your savings adjust."],["save","🪙","Savings Tracker","Follow your 30-day or 10-week challenge."],["hist","📊","Spending History","Weekly summaries and category averages."]];
 return'<section class="pxhero"><div class="pxcoins" aria-hidden="true"><i>🪙</i><i>💰</i><i>📚</i><i>🎒</i><i>🪙</i></div>'+W.logo(84)+'<h1>PRO-EX</h1><div class="pxsub">PROcastinating EXpenditures</div><p class="pxmotto"><b>Your Money, Your Decisions, Your Future.</b></p><p>Hi '+nm+'! PRO-EX helps students plan their daily allowance, track every peso and build saving habits one day at a time.</p><div class="pxbtns"><button onclick="pxGo(\'plan\')">🚀 Get Started</button><button class="alt" onclick="pxExplore()">🔍 Explore PRO-EX</button><button class="pxwh" onclick="pxGo(\'habits\')">🧩 My Budgeting Habits</button></div></section>'
 +(S.ex?'<section class="card"><h2>Explore PRO-EX</h2>'+ex.map(function(x){return'<div class="row"><span>'+x[1]+' <b>'+x[2]+'</b><br><span class="mut">'+x[3]+'</span></span><button class="ghost" onclick="pxGo(\''+x[0]+'\')">Open</button></div>'}).join("")+'</section>':"")
 +'<div class="pxfeat">'+F.map(function(c){return'<button class="pxfc" onclick="pxGo(\''+c[3]+'\')"><span>'+c[0]+'</span><b>'+c[1]+'</b><small>'+c[2]+'</small></button>'}).join("")+'</div><section class="card pxtip"><span>💡</span><div><b>Daily tip</b><p>'+E(S.tip)+'</p></div><button class="ghost" onclick="pxTip()">New tip</button></section>'}
/* HABITS */
function vHabits(){var H=W.D.hab;return'<section class="card"><h2>🧩 My Spending Habits</h2><p class="mut">Enter what you usually spend in a day. Mark each as Essential (you must pay it) or Flexible (you can adjust it).</p>'
 +H.c.map(function(x,i){return'<div class="pxh"><label>'+E(x.n)+'</label><input id="ha'+i+'" type="number" inputmode="decimal" min="0" placeholder="₱0" value="'+(x.a||"")+'"><select id="ht'+i+'" aria-label="Type of expense"><option value="e"'+(x.t==="e"?" selected":"")+'>Essential</option><option value="f"'+(x.t!=="e"?" selected":"")+'>Flexible</option></select></div>'}).join("")
 +'<label>Savings you usually set aside (₱)</label><input id="hs" type="number" inputmode="decimal" min="0" value="'+(H.s||"")+'"><div class="pxrow2"><button onclick="pxSaveHab()">Save my habits</button><button class="alt" onclick="pxSaveHab(1)">Save and get my budget</button></div></section>'}
W.pxSaveHab=function(go){var H=W.D.hab;H.c.forEach(function(x,i){x.a=N(g("ha"+i).value);x.t=g("ht"+i).value});H.s=N(g("hs").value);S.sug=null;W.save();tt("Habits saved.","ok");if(go)W.pxGo("budget");else W.render()};
/* SUGGESTION (rule-based): essentials first at usual amount; flexible trimmed 25% (to nearest ₱5); savings = what is left,
   never below the savings goal (flexible cut first, essentials scaled only if they cannot fit). */
function hist7(){var D=W.D,ks=Object.keys(D.days).sort().slice(-7),t={};ks.forEach(function(k){(D.days[k].exp||[]).forEach(function(e){var c=e.c||"Other Expenses";t[c]=(t[c]||0)+e.a})});return{n:ks.length,t:t}}
function suggest(A,G){var h=hist7(),rows=W.D.hab.c.map(function(x){var av=h.n&&h.t[x.n]?h.t[x.n]/h.n:0,u=x.a>0&&av>0?R((x.a+av)/2):(x.a>0?x.a:R(av));
  return{n:x.n,t:x.t,u:u,a:u,why:x.a>0&&av>0?"average of your usual and recent spending":av>0?"based on your recent records":"your usual amount"}}).filter(function(x){return x.u>0});
 var es=rows.filter(function(x){return x.t==="e"}),fl=rows.filter(function(x){return x.t!=="e"}),sum=function(a,f){return a.reduce(function(s,x){return s+x[f]},0)},avail=A-G,note="",Et=sum(es,"u");
 if(Et>avail){var k=avail>0?avail/Et:0;es.forEach(function(x){x.a=Math.floor(x.u*k);x.why="essential, scaled down to fit your allowance"});fl.forEach(function(x){x.a=0;x.why="paused to protect essentials"});note="Your essentials are more than what is left after your savings goal, so they were scaled down."}
 else{fl.forEach(function(x){x.a=Math.round(x.u*.75/5)*5;x.why="flexible: trimmed 25% to boost savings"});var sv=A-Et-sum(fl,"a");
  if(sv<G){var need=G-sv,ft=sum(fl,"a");fl.forEach(function(x){x.a-=ft?Math.min(x.a,Math.ceil(need*x.a/ft)):0;x.why="flexible: reduced to reach your savings goal"})}}
 var used=sum(rows,"a");return{rows:rows,save:Math.max(0,A-used),note:note,h:h.n}}
function donut(it,den){var tot=Math.max(den,1),off=25,h='<svg viewBox="0 0 42 42" class="pxd" role="img" aria-label="Budget chart"><circle cx="21" cy="21" r="15.9155" fill="none" stroke="var(--bd)" stroke-width="6"/>';
 it.forEach(function(x,i){var p=x.a/tot*100;if(p>0){h+='<circle cx="21" cy="21" r="15.9155" fill="none" stroke="'+COL[i%COL.length]+'" stroke-width="6" stroke-dasharray="'+p+' '+(100-p)+'" stroke-dashoffset="'+off+'"/>';off-=p}});
 return h+'</svg><div class="pxlgw">'+it.filter(function(x){return x.a>0}).map(function(x){var i=it.indexOf(x);return'<div class="pxlg"><i style="background:'+COL[i%COL.length]+'"></i>'+E(x.n)+'<b>'+P(x.a)+' · '+R(x.a/tot*100)+'%</b></div>'}).join("")+'</div>'}
/* BUDGET */
function vBudget(){var D=W.D,t=D.days[W.today()];if(S.A==="")S.A=t?t.allow:(D.lastA||"");if(S.G==="")S.G=t?t.save:(D.hab.s||"");
 var A=N(S.A);if(A>0&&!S.sug)S.sug=suggest(A,Math.min(N(S.G),A));var s=S.sug,h='<section class="card"><h2>🎯 Budget</h2><div class="pxrow2"><div><label>Daily allowance (₱)</label><input id="pxA" type="number" inputmode="decimal" min="0" value="'+S.A+'"></div><div><label>Savings goal (₱)</label><input id="pxG" type="number" inputmode="decimal" min="0" value="'+S.G+'"></div></div><button onclick="pxGen()">'+(s?"Regenerate my budget":"Generate my budget")+'</button></section>';
 if(s&&!s.rows.length)h+='<section class="card">Tell PRO-EX what you usually spend first.<button onclick="pxGo(\'habits\')">Go to My Spending Habits</button></section>';
 else if(s){var it=s.rows.map(function(x){return{n:x.n,a:x.a}}).concat([{n:"Savings",a:s.save}]);
  h+='<section class="card"><h2>⭐ YOUR PERSONALIZED BUDGET PLAN</h2><div class="pxdw">'+donut(it,A)+'</div>'+(s.note?'<div class="pxmsg warn">'+s.note+'</div>':"")+s.rows.map(function(x){return'<div class="row"><span>'+E(x.n)+' <span class="mut">('+(x.t==="e"?"essential":"flexible")+')<br>'+x.why+'</span></span><b>'+P(x.a)+'</b></div>'}).join("")+'<div class="row"><span><b>Suggested savings</b>'+(N(S.G)?' <span class="mut">(your goal: '+P(N(S.G))+')</span>':"")+'</span><b style="color:var(--em)">'+P(s.save)+'</b></div><p class="mut">Based on your habits'+(s.h?" and "+s.h+" day(s) of records":"")+'. You are free to change everything.</p><div class="pxrow2"><button onclick="pxAccept()">✅ Accept this budget</button><button class="alt" onclick="pxStart(\'sug\')">✏️ Customize it</button></div></section>'}
 if(S.dr)h+='<section class="card"><h2>✏️ CUSTOMIZE MY BUDGET</h2><p class="mut">Tap ★ to mark a priority. Add or remove categories anytime.</p>'+S.dr.rows.map(function(x,i){return'<div class="pxer"><input value="'+E(x.n)+'" oninput="pxEd('+i+',\'n\',this.value)" aria-label="Category name"><input type="number" inputmode="decimal" min="0" value="'+(x.a||"")+'" oninput="pxEd('+i+',\'a\',this.value)" aria-label="Amount"><button class="pxstar'+(x.p?" on":"")+'" onclick="pxStar('+i+')" aria-label="Priority">★</button><button class="x" onclick="pxDel('+i+')" aria-label="Remove">✕</button></div>'}).join("")
  +'<div class="pxer"><input id="pxnew" placeholder="New category" aria-label="New category"><span></span><button onclick="pxAdd()" aria-label="Add category">＋</button><span></span></div><label>Desired savings (₱)</label><input type="number" inputmode="decimal" min="0" value="'+(S.dr.sv||"")+'" oninput="pxEdS(this.value)"><div id="pxlive">'+live()+'</div></section>';
 else if(!s||!s.rows.length)h+='<section class="card"><h2>✏️ CUSTOMIZE MY BUDGET</h2><p class="mut">Build your own plan from scratch.</p><button class="alt" onclick="pxStart(\'blank\')">Start my own budget</button></section>';
 var pl=W.D.plans;if(pl.length)h+='<section class="card"><h2>🗂️ Saved budget plans</h2>'+pl.slice(0,6).map(function(p,i){return'<div class="row"><span>'+p.d+' · '+E(p.k)+'<br><span class="mut">Allowance '+P(p.A)+' · Savings '+P(p.sv)+'</span></span><button class="ghost" onclick="pxLoad('+i+')">Edit</button></div>'}).join("")+'</section>';return h}
function live(){var dr=S.dr,A=N(S.A),sum=dr.rows.reduce(function(s,x){return s+x.a},0),tot=sum+dr.sv,rem=A-tot,over=rem<0||A<=0,pct=A?R(tot/A*100):0;
 var it=dr.rows.map(function(x){return{n:x.n||"Category",a:x.a}}).concat([{n:"Savings",a:dr.sv}]),cmp="";
 if(S.sug&&S.sug.rows.length){var sm={Savings:S.sug.save},cm={Savings:dr.sv},nm=["Savings"];S.sug.rows.forEach(function(x){sm[x.n]=x.a;nm.unshift(x.n)});dr.rows.forEach(function(x){cm[x.n]=(cm[x.n]||0)+x.a;if(nm.indexOf(x.n)<0)nm.unshift(x.n)});
  cmp='<h3>PRO-EX suggested vs My budget</h3><div class="pxtw"><table class="pxt"><tr><th>Category</th><th>PRO-EX</th><th>Mine</th><th>Diff</th></tr>'+nm.map(function(k){var a=sm[k]||0,b=cm[k]||0,d=b-a;return'<tr><td>'+E(k)+'</td><td>'+P(a)+'</td><td>'+P(b)+'</td><td style="color:'+(d>0?"var(--warn)":d<0?"var(--em)":"inherit")+'">'+(d>0?"+":"")+P(d)+'</td></tr>'}).join("")+'</table></div>'}
 return'<div class="pxgrid">'+[["💰","Total daily allowance",A],["🧾","Total allocated expenses",sum],["🎯","Desired savings",dr.sv],["⚖️","Remaining unallocated",rem]].map(function(x){return'<div class="pxs '+(x[1][0]==="R"&&rem<0?"bad":"")+'"><span class="pxi">'+x[0]+'</span><span class="pxl">'+x[1]+'</span><b>'+P(x[2])+'</b></div>'}).join("")+'<div class="pxs"><span class="pxi">📈</span><span class="pxl">Budget allocation</span><b>'+pct+'%</b></div></div><div class="bar pxbar'+(over?" bad":"")+'"><i style="width:'+Math.min(100,pct)+'%"></i></div>'
 +(A<=0?'<div class="pxmsg warn">Enter your daily allowance above first.</div>':rem<0?'<div class="pxmsg bad">⚠️ You allocated '+P(-rem)+' more than your allowance. Lower some amounts to save.</div>':rem>0?'<div class="pxmsg">'+P(rem)+' is still unallocated. Add it to savings or keep it as a buffer.</div>':'<div class="pxmsg">✅ Every peso is assigned.</div>')
 +'<div class="pxdw">'+donut(it,Math.max(A,tot))+'</div>'+cmp+'<div class="pxrow2"><button onclick="pxSaveCB()"'+(over?" disabled":"")+'>💾 Save my budget</button><button class="ghost" onclick="pxReset()">Reset</button></div>'}
W.pxGen=function(){S.A=g("pxA").value;S.G=g("pxG").value;var A=N(S.A);S.sug=A>0?suggest(A,Math.min(N(S.G),A)):null;W.render()};
W.pxStart=function(m){var s=S.sug;S.dr=m==="sug"&&s?{rows:s.rows.map(function(x){return{n:x.n,a:x.a,p:x.t==="e"}}),sv:s.save}:{rows:["Food and Snacks","Transportation","School Supplies","School Projects and Activities","Personal Needs","Emergency Funds","Other Expenses"].map(function(n){return{n:n,a:0,p:false}}),sv:N(S.G)};W.render()};
W.pxEd=function(i,f,v){S.dr.rows[i][f]=f==="a"?N(v):v;var e=g("pxlive");if(e)e.innerHTML=live()};
W.pxEdS=function(v){S.dr.sv=N(v);g("pxlive").innerHTML=live()};
W.pxStar=function(i){S.dr.rows[i].p=!S.dr.rows[i].p;W.render()};W.pxDel=function(i){S.dr.rows.splice(i,1);W.render()};
W.pxAdd=function(){var n=g("pxnew").value.trim();if(!n)return;S.dr.rows.push({n:n,a:0,p:false});W.render()};W.pxReset=function(){S.dr=null;W.render()};
function apply(A,rows,sv,kind){var D=W.D,td=W.today(),t=D.days[td]||(D.days[td]={exp:[],done:false});t.allow=A;t.save=sv;t.cat={};rows.forEach(function(x){t.cat[x.n]=(t.cat[x.n]||0)+x.a});
 if(!D.goal)D.goal={ds:sv||1,days:30,start:td};D.lastA=A;D.plans.unshift({d:td,k:kind,A:A,sv:sv,rows:rows});D.plans=D.plans.slice(0,10);W.save();S.dr=null;W.pxGo("track");tt("Budget saved. Your tracker and savings are updated.","ok")}
W.pxAccept=function(){var s=S.sug;if(s&&s.rows.length)apply(N(S.A),s.rows.map(function(x){return{n:x.n,a:x.a,p:x.t==="e"}}),s.save,"PRO-EX suggested")};
W.pxSaveCB=function(){var dr=S.dr,A=N(S.A),tot=dr.rows.reduce(function(s,x){return s+x.a},0)+dr.sv;if(A<=0||tot>A)return alert("Your total allocation cannot be more than your daily allowance.");apply(A,dr.rows.filter(function(x){return x.a>0}),dr.sv,"My customized budget")};
W.pxLoad=function(i){var p=W.D.plans[i];S.A=p.A;S.dr={rows:p.rows.map(function(x){return{n:x.n,a:x.a,p:!!x.p}}),sv:p.sv};W.render()};
/* HISTORY */
function ds(k){var t=W.D.days[k];if(!t||t.allow==null)return null;var sp=W.spent(t),as=t.allow-t.save,adj=Math.max(0,t.save-Math.max(0,sp-as));return{k:k,t:t,sp:sp,as:as,adj:adj,sv:t.done?adj:0}}
function win(a,b){var td=W.today(),o={sp:0,sv:0,n:0,cat:{},cnt:{}};for(var i=a;i<=b;i++){var s=ds(W.addDays(td,-i));if(s){o.n++;o.sp+=s.sp;o.sv+=s.sv;(s.t.exp||[]).forEach(function(e){var c=e.c||"Other Expenses";o.cat[c]=(o.cat[c]||0)+e.a;o.cnt[c]=(o.cnt[c]||0)+1})}}return o}
function vHist(){var D=W.D,td=W.today(),cur=win(0,6),pre=win(7,13),days=[];for(var i=6;i>=0;i--)days.push(ds(W.addDays(td,-i))||{k:W.addDays(td,-i),sp:0,as:0});
 var mx=Math.max.apply(null,days.map(function(d){return Math.max(d.sp,d.as)}).concat([1])),ch=pre.sp>0?R((cur.sp-pre.sp)/pre.sp*100):null,ks=Object.keys(cur.cat).sort(function(a,b){return cur.cat[b]-cur.cat[a]}),cm=ks.length?cur.cat[ks[0]]:1;
 if(!cur.n&&!pre.n)return'<section class="card"><h2>📊 Spending History</h2><p>No records yet. Plan your day and add expenses, then your weekly summary will appear here.</p><button onclick="pxGo(\'plan\')">Start planning</button></section>';
 return'<section class="card"><h2>📊 This week</h2><div class="pxgrid"><div class="pxs"><span class="pxi">💸</span><span class="pxl">Spent (7 days)</span><b>'+P(cur.sp)+'</b></div><div class="pxs good"><span class="pxi">🪙</span><span class="pxl">Saved (7 days)</span><b>'+P(cur.sv)+'</b></div><div class="pxs"><span class="pxi">📅</span><span class="pxl">Average per day</span><b>'+P(cur.n?cur.sp/cur.n:0)+'</b></div></div><div class="pxmsg '+(ch!==null&&ch>0?"warn":"")+'">'+(ch===null?"No records from last week to compare yet.":ch>0?"📈 You spent "+ch+"% more than last week ("+P(pre.sp)+").":ch<0?"📉 You spent "+(-ch)+"% less than last week ("+P(pre.sp)+"). Keep it up!":"Same spending as last week ("+P(pre.sp)+").")+'</div>'
 +'<div class="pxbars" role="img" aria-label="Spending in the last 7 days">'+days.map(function(d){return'<div title="'+d.k+'"><i class="'+(d.sp>d.as&&d.as>0?"o":"")+'" style="height:'+R(d.sp/mx*100)+'%"></i>'+new Date(d.k+"T00:00:00").toLocaleDateString(undefined,{weekday:"short"}).slice(0,2)+'</div>'}).join("")+'</div><p class="mut">Red bars are days you went over your assigned expenses.</p></section>'
 +'<section class="card"><h2>🏷️ Spending by category</h2>'+(ks.length?ks.map(function(k){return'<div class="row"><span>'+E(k)+'<div class="bar pxbar" style="width:150px"><i style="width:'+R(cur.cat[k]/cm*100)+'%"></i></div></span><span style="text-align:right"><b>'+P(cur.cat[k]/cur.n)+'</b>/day<br><span class="mut">used '+cur.cnt[k]+"×</span></span></div>"}).join("")+'<button class="alt" onclick="pxAvg()">Update my habits from these averages</button>':'<p class="mut">Pick a category when you add expenses to see averages here.</p>')+'</section>'
 +'<section class="card"><h2>🗓️ Daily records</h2>'+Object.keys(D.days).sort().reverse().slice(0,14).map(ds).filter(Boolean).map(function(s){return'<div class="row"><span>'+s.k+'<br><span class="mut">Allowance '+P(s.t.allow)+' · Spent '+P(s.sp)+'</span></span><b style="color:'+(s.sp>s.as?"var(--bad)":"var(--em)")+'">'+(s.t.done?"✓ ":"")+P(s.adj)+'</b></div>'}).join("")+'</section>'}
W.pxAvg=function(){var c=win(0,6);W.D.hab.c.forEach(function(x){if(c.cat[x.n])x.a=R(c.cat[x.n]/c.n)});S.sug=null;W.save();tt("Habits updated from your records.","ok");W.pxGo("habits")};
W.render();
})();
