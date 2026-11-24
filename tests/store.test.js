const test = require('node:test');
const assert = require('node:assert/strict');
const { AgencyStore } = require('../src/store');

function agency() {
  const store = new AgencyStore();
  store.addClient({ id:'demo', name:'Demo Business', pillars:['Education','Trust','Offers'], platforms:['instagram','tiktok'] });
  return store;
}

test('generates exactly five ideas and one recommended idea', () => {
  const store=agency();
  const ideas=store.generateIdeas('demo','2026-11-25');
  assert.equal(ideas.length,5);
  assert.equal(ideas.filter(i=>i.recommended).length,1);
  assert.ok(new Set(ideas.map(i=>i.format)).size >= 2);
});

test('gate 1 rejects the remaining ideas and prepares only approved idea', () => {
  const store=agency();
  const [selected]=store.generateIdeas('demo','2026-11-25');
  store.approveIdea(selected.id,'Approved');
  assert.equal(store.ideas.find(i=>i.id===selected.id).status,'IDEA_APPROVED');
  assert.equal(store.ideas.filter(i=>i.status==='IDEA_REJECTED').length,4);
  const content=store.prepareContent(selected.id);
  assert.equal(content.status,'READY_FOR_REVIEW');
});

test('unapproved content can never publish', () => {
  const store=agency();
  const [idea]=store.generateIdeas('demo','2026-11-25');
  const content=store.prepareContent(idea.id);
  const held=store.publish(content.id);
  assert.equal(held.status,'HOLD');
  assert.match(held.log,/blocked/i);
});

test('gate 2 approval allows scheduling, and changes return to review path', () => {
  const store=agency();
  const [idea]=store.generateIdeas('demo','2026-11-25');
  store.approveIdea(idea.id);
  const content=store.prepareContent(idea.id);
  store.decideGate2(content.id,'CHANGES_REQUESTED','Needs revision');
  assert.equal(content.status,'CHANGES_REQUESTED');
  store.decideGate2(content.id,'APPROVED','Final approved');
  assert.equal(store.publish(content.id).status,'SCHEDULED');
});
