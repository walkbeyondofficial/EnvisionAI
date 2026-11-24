const $ = selector => document.querySelector(selector);
const api = async (path, body) => { const response = await fetch(path, body ? {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)} : {}); const data = await response.json(); if(!response.ok) throw new Error(data.error || 'Request failed'); return data; };

async function refresh(){
  const state=await api('/api/state');
  $('#run-controls').innerHTML=`<form id="run-form"><select id="run-client">${state.clients.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</select><input id="target-date" type="date" required><button>Generate 5</button></form>`;
  const runForm=$('#run-form'); if(runForm) runForm.addEventListener('submit',async e=>{e.preventDate;await api('/api/ideas/generate',{clientId:$('#run-client').value,targetDate:$('#target-date').value});await refresh();});
  $('#ideas').innerHTML=state.ideas.length?state.ideas.map(i=>`<div class="item"><strong>${i.hook}</strong><div class="meta">${i.clientId} · ${i.targetDate} · ${i.platform} · ${i.format} · ${i.status}</div><p>${i.visualDirection}</p>${i.status==='IDEA_PROPOSED'?`<div class="actions"><button class="approve" data-approve="${i.id}">Approve idea</button></div>`:''}</div>`).join(''):'<p>No ideas yet.</p>';
  document.querySelectorAll('[data-approve]').forEach(button=>button.addEventListener('click',()=>approveIdea(button.dataset.approve)));
  $('#content').innerHTML=state.content.length?state.content.map(c=>`<div class="item"><strong>${c.platform}</strong><div class="meta">${c.status}</div><p>${c.caption}</p>${c.status==='READY_FOR_REVIEW'?`<div class="actions"><button class="approve" data-gate="APPROVED" data-content="${c.id}">Approve Gate 2</button><button class="reject" data-gate="CHANGES_REQUESTED" data-content="${c.id}">Request changes</button></div>`:c.status==='APPROVED'?`<button class="approve" data-publish="${c.id}">Publish (adapter check)</button>`:''}</div>`).join(''):'<p>No final posts yet.</p>';
  document.querySelectorAll('[data-gate]').forEach(b=>b.addEventListener('click',()=>gate2(b.dataset.content,b.dataset.gate)));
  document.querySelectorAll('[data-publish]').forEach(b=>b.addEventListener('click',()=>publish(b.dataset.publish)));
  $('#audit').innerHTML=state.audit.slice(-30).reverse().map(a=>`<div class="audit-row"><strong>${a.actor}</strong> · ${a.action} · ${a.itemId} · ${a.at}</div>`).join('')||'<p>No audit entries.</p>';
}
async function approveIdea(id){await api('/api/ideas/approve',{ideaId:id});const state=await api('/api/state');const idea=state.ideas.find(i=>i.id===id);await api('/api/content/prepare',{ideaId:id});await refresh();}
async function gate2(id,decision){await api('/api/content/decision',{contentId:id,decision,ownerNote:'Owner decision from console'});await refresh();}
async function publish(id){await api('/api/content/publish',{contentId:id});await refresh();}
$('#client-form').addEventListener('submit',async e=>{e.preventDefault();await api('/api/clients',{id:$('#client-id').value.trim(),name:$('#client-name').value.trim(),pillars:$('#client-pillars').value.split(',').map(v=>v.trim()).filter(Boolean),platforms:['instagram','tiktok']});e.target.reset();await refresh();});
refresh();
