/* PRO-EX enhancements: desktop helpers + automatic savings adjustment.
   Loaded AFTER the main script in index.html. It wraps the app's existing functions; nothing is removed. */
(function(){
"use strict";
if(typeof window.render!=="function"||typeof window.genDay!=="function")return;
var g=function(i){return document.getElementById(i)},n=function(v){v=parseFloat(v);return isFinite(v)?v:0},r2=function(x){return Math.round(x*100)/100},P=function(x){return window.peso(x)};
/* Excess = Actual - Assigned ; Adjusted savings = Desired - Excess (never below 0) */
function calc(t){var assigned=r2(Math.max(0,t.allow-t.save)),actual=r2(window.spent(t)),excess=r2(Math.max(0,actual-assigned));
 return{budget:t.allow,assigned:assigned,actual:actual,desired:t.save,excess:excess,adj:r2(Math.max(0,t.save-excess)),short:r2(Math.max(0,excess-t.save)),left:r2(assigned-actual)}}
function toast(m,k){var e=g("pxToast");if(!e){e=document.createElement("div");e.id="pxToast";e.setAttribute("role","status");e.setAttribute("aria-live","polite");document.body.appendChild(e)}
 e.className="show "+k;e.textContent=m;clearTimeout(toast.t);toast.t=setTimeout(function(){e.className=""},4500)}
function notify(prev,t){var c=calc(t);if(c.actual===prev)return;
 if(c.short>0)toast("Over budget by "+P(c.excess)+". Savings is now "+P(0)+" and you are "+P(c.short)+" short.","bad");
 else if(c.excess>0)toast("Over your assigned budget by "+P(c.excess)+". Savings adjusted to "+P(c.adj)+".","warn");
 else toast("Within budget. "+P(c.left)+" left to spend.","ok")}
var today=function(){return window.today()},day=function(){return window.D&&window.D.days[today()]};
["addExp","delExp"].forEach(function(nm){var o=window[nm];window[nm]=function(){var t=day(),b=t?calc(t).actual:0,out=o.apply(this,arguments);t=day();if(t)notify(b,t);return out}});
window.editExp=function(id){var t=day();if(!t)return;var x=t.exp.filter(function(e){return e.id===id})[0];if(!x)return;
 var l=prompt("Expense name",x.l);if(l===null)return;var a=prompt("Amount (₱)",x.a);if(a===null)return;a=parseFloat(a);
 if(!(a>0))return alert("Please enter a valid amount.");var b=calc(t).actual;x.l=l.trim()||x.l;x.a=a;window.save();window.render();notify(b,t)};
/* Show adjusted savings in the Savings tab (totals, history) by swapping values only while the original renders */
var baseRender=window.render;
window.render=function(){var sw=[];try{
 if(window.U&&window.D&&window.tab==="goal")Object.keys(window.D.days).forEach(function(k){var d=window.D.days[k];if(d&&d.exp&&d.allow!=null){sw.push([d,d.save]);d.save=calc(d).adj}});
 applySplit();baseRender()}finally{sw.forEach(function(p){p[0].save=p[1]})}
 decorate()};
/* Editable suggested split (saved per user in D.split as percentages) */
var DEF=window.SPLIT.map(function(x){return[x[0],x[1]]});
function applySplit(){var sp=window.D&&window.D.split;window.SPLIT=(sp&&sp.length===4)?DEF.map(function(x,i){return[x[0],sp[i]/100]}):DEF}
function splitUI(){var sp=(window.D&&window.D.split)||DEF.map(function(x){return x[1]*100});
 return'<details class="card pxsplit"><summary>⚙️ Customize suggested split</summary><div class="pxsp">'+DEF.map(function(x,i){return'<label>'+x[0]+' (%)<input id="sp'+i+'" type="number" inputmode="decimal" min="0" max="100" value="'+r2(sp[i])+'" oninput="pxSum()"></label>'}).join("")+'</div><div class="mut" id="pxsum">Total: '+r2(sp.reduce(function(a,b){return a+b},0))+'%</div><button onclick="pxSaveSplit()">Save my split</button><button class="ghost" style="margin-top:10px" onclick="pxResetSplit()">Reset to default</button></details>'}
function vals(){return[0,1,2,3].map(function(i){return n(g("sp"+i).value)})}
window.pxSum=function(){var t=r2(vals().reduce(function(a,b){return a+b},0));g("pxsum").textContent="Total: "+t+"%"+(t===100?"":" (must be 100%)")};
window.pxSaveSplit=function(){var v=vals();if(v.some(function(x){return x<0})||r2(v.reduce(function(a,b){return a+b},0))!==100)return alert("Your percentages must add up to exactly 100%.");window.D.split=v;window.save();window.render();toast("Your split was saved.","ok")};
window.pxResetSplit=function(){window.D.split=null;window.save();window.render();toast("Split reset to the default.","ok")};
function stat(i,l,v,c){return'<div class="pxs '+(c||"")+'"><span class="pxi" aria-hidden="true">'+i+'</span><span class="pxl">'+l+'</span><b>'+P(v)+'</b></div>'}
function panel(t){var c=calc(t),k=c.short>0?"bad":c.excess>0?"warn":"ok",pct=c.desired>0?Math.round(c.adj/c.desired*100):100,m;
 if(k==="bad")m="🚨 Your extra spending ("+P(c.excess)+") is more than your savings goal ("+P(c.desired)+"). Savings is now "+P(0)+" and you are "+P(c.short)+" over your total daily budget.";
 else if(k==="warn")m="⚠️ You went over your assigned expenses by "+P(c.excess)+". It was deducted from your savings, so you will save "+P(c.adj)+" instead of "+P(c.desired)+".";
 else m="✅ "+(c.actual>0?"Great job! You are within your assigned budget. ":"Spend up to "+P(c.assigned)+" today to keep your full savings. ")+P(c.left)+" left to spend. Your "+P(c.desired)+" savings is safe.";
 var f=c.excess>0?"Excess = "+P(c.actual)+" − "+P(c.assigned)+" = "+P(c.excess)+" · Adjusted savings = "+P(c.desired)+" − "+P(c.excess)+" = "+P(c.adj):"No deduction. Savings stay at "+P(c.desired)+".";
 return'<section class="card pxpanel" id="pxPanel"><h2>Daily budget summary</h2><div class="pxgrid">'+stat("💰","Total daily budget",c.budget)+stat("🧾","Assigned expenses",c.assigned)+stat("💸","Actual expenses",c.actual,c.excess>0?"warn":"")+stat("🎯","Desired savings",c.desired)+stat("⚠️","Excess expense",c.excess,c.excess>0?"bad":"good")+stat("🪙","Adjusted savings",c.adj,k==="ok"?"good":k)+'</div><div class="pxmsg '+k+'" role="status">'+m+'</div><div class="mut">Savings progress</div><div class="bar pxbar '+k+'"><i style="width:'+pct+'%"></i></div><div class="mut">'+P(c.adj)+' of '+P(c.desired)+' kept ('+pct+'%)</div><div class="mut pxnote">'+f+'</div></section>'}
function decorate(){var A=g("app");document.body.classList.toggle("in",!!window.U);if(!window.U||!A)return;
 var t=day(),al=g("al"),sv=g("sv");
 if(window.tab==="today"&&al&&sv&&!g("asg")){ /* planning form: add "Assigned expenses", linked to savings */
  al.closest(".card").classList.add("solo");
  var lab=document.createElement("label"),as=document.createElement("input"),svLab=sv.previousElementSibling;
  lab.textContent="Assigned daily expenses (₱)";as.id="asg";as.type="number";as.inputMode="decimal";as.min="0";
  svLab.parentNode.insertBefore(lab,svLab);svLab.parentNode.insertBefore(as,svLab);
  var fill=function(){if(al.value!==""&&sv.value!=="")as.value=r2(Math.max(0,n(al.value)-n(sv.value)))};fill();
  as.oninput=function(){sv.value=r2(Math.max(0,n(al.value)-n(as.value)))};sv.oninput=fill;al.oninput=fill;
  var h=document.createElement("div");h.className="mut";h.textContent="Total budget = Assigned expenses + Savings";sv.parentNode.insertBefore(h,sv.nextSibling)}
 else if(window.tab==="today"&&t&&!al){var first=A.querySelector(".card");if(first){first.insertAdjacentHTML("beforebegin",panel(t));first.insertAdjacentHTML("beforeend",'<div class="mut pxnote">Suggested split is a general guide, not official data. Adjust it to fit your needs.</div>');first.insertAdjacentHTML("afterend",splitUI())}
  A.querySelectorAll("button.x").forEach(function(b){var m=/delExp\((\d+)\)/.exec(b.getAttribute("onclick")||"");if(m){var e=document.createElement("button");e.className="x";e.setAttribute("aria-label","Edit expense");e.textContent="✎";e.setAttribute("onclick","editExp("+m[1]+")");b.parentNode.insertBefore(e,b)}})}
 else if(window.tab==="goal"){var c1=A.querySelector(".card");if(c1)c1.insertAdjacentHTML("beforeend",'<div class="mut pxnote">Savings include automatic deductions on days you overspend.</div>')}}
window.addEventListener("online",function(){window.render()});window.addEventListener("offline",function(){window.render()});
window.render();
})();
