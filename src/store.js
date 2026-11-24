const VALID_STATUSES = new Set([
  'IDEA_PROPOSED', 'IDEA_APPROVED', 'IDEA_REJECTED', 'BUILDING',
  'READY_FOR_PUBLISHER', 'READY_FOR_REVIEW', 'CHANGES_REQUESTED',
  'APPROVED', 'REJECTED', 'SCHEDULED', 'PUBLISHED', 'FAILED', 'HOLD'
]);

class AgencyStore {
  constructor(initial = {}) {
    this.clients = initial.clients || [];
    this.ideas = initial.ideas || [];
    this.content = initial.content || [];
    this.audit = initial.audit || [];
  }

  snapshot() {
    return { clients: this.clients, ideas: this.ideas, content: this.content, audit: this.audit };
  }

  log(actor, action, itemId, details = {}) {
    this.audit.push({ id: cryptoId('LOG'), actor, action, itemId, details, at: new Date().toISOString() });
  }

  getClient(id) { return this.clients.find(c => c.id === id); }

  addClient(profile) {
    if (!profile.id || !profile.name) throw new Error('Client id and name are required');
    if (this.getClient(profile.id)) throw new Error('Client already exists');
    const client = { ...profile, status: 'active' };
    this.clients.push(client);
    this.log('owner', 'CLIENT_CREATED', client.id, { name: client.name });
    return client;
  }

  generateIdeas(clientId, targetDate) {
    const client = this.getClient(clientId);
    if (!client) throw new Error('Unknown client');
    if (!targetDate) throw new Error('Target date is required');

    const existing = this.ideas.filter(i => i.clientId === clientId && i.targetDate === targetDate);
    if (existing.length) return existing;

    const pillars = client.pillars?.length ? client.pillars : ['Awareness', 'Education', 'Trust'];
    const platforms = client.platforms?.length ? client.platforms : ['instagram'];
    const formats = ['image', 'carousel', 'poster', 'video', 'carousel'];
    const ideas = Array.from({ length: 5 }, (_, index) => {
      const idea = {
        id: cryptoId('IDEA'), clientId, targetDate,
        platform: platforms[index % platforms.length], format: formats[index],
        hook: `${pillars[index % pillars.length]}: practical tip ${index + 1}`,
        visualDirection: 'Use approved brand colors and a clear, readable hook.',
        draftCopy: `A useful ${pillars[index % pillars.length].toLowerCase()} update for ${client.name}.`,
        whyItFits: `Supports ${pillars[index % pillars.length].toLower} and the stated agency goals.`,
        effortRisk: 'Low; verify facts and licensed assets.',
        recommended: index === 0, status: 'IDEA_PROPOSED', ownerNote: ''
      };
      this.ideas.push(idea);
      return idea;
    });
    this.log('design', 'IDEAS_GENERATED', clientId, { targetDate, count: 5 });
    return ideas;
  }

  approveIdea(ideaId, ownerNote = '') {
    const idea = this.ideas.find(i => i.id === ideaId);
    if (!idea) throw new Error('Unknown idea');
    if (idea.status !== 'IDEA_PROPOSED') throw new Error('Idea is not awaiting Gate 1 approval');

    this.ideas.forEach(i => {
      if (i.clientId === idea.clientId && i.targetDate === idea.targetDate && i.status === 'IDEA_PROPOSED') {
        i.status = i.id === ideaId ? 'IDEA_APPROVED' : 'IDEA_REJECTED';
      }
    });
    idea.ownerNote = ownerNote;
    this.log('owner', 'GATE1_APPROVED', ideaId, { ownerNote });
    return idea;
  }

  prepareContent(ideaId) {
    const idea = this.ideas.find(i => i.id === ideaId);
    if (!idea) throw new Error('Unknown idea');
    if (idea.status !== 'IDEA_APPROVED') throw new Error('Gate 1 approval is required');

    const existing = this.content.find(c => c.ideaId === ideaId);
    if (existing) return existing;

    const client = this.getClient(idea.clientId);
    const item = {
      id: cryptoId('CONTENT'), ideaId, clientId: idea.clientId,
      status: 'BUILDING', caption: '', hashtags: [], platform: idea.platform,
      scheduledTime: '', canvaLink: '', driveLink: '', metricoolReviewLink: '',
      ownerDecision: '', ownerNote: '', log: 'Awaiting build.'
    };
    item.caption = `${idea.draftCopy}\n\n${client?.tone ? `Tone: ${client.tone}` : ''}`.trim();
    item.status = 'READY_FOR_REVIEW';
    item.log = 'Prepared for final owner review; not approved.';
    this.content.push(item);
    this.log('publisher', 'READY_FOR_REVIEW', item.id, { ideaId, platform: item.platform });
    return item;
  }

  decideGate2(contentId, decision, ownerNote = '') {
    const item = this.content.find(c => c.id === contentId);
    if (!item) throw new Error('Unknown content');
    if (!['APPROVED', 'CHANGES_REQUESTED', 'REJECTED'].includes(decision)) throw new Error('Invalid Gate 2 decision');

    item.ownerDecision = decision;
    item.ownerNote = ownerNote;
    item.status = decision;
    item.log = `Owner decision: ${decision}.`;
    this.log('owner', `GATE2_${decision}`, contentId, { ownerNote });
    return item;
  }

  publish(contentId) {
    const item = this.content.find(c => c.id === contentId);
    if (!item) throw new Error('Unknown content');
    if (item.status !== 'APPROVED') {
      item.status = 'HOLD';
      item.log = 'Publication blocked: explicit APPROVED status missing.';
      this.log('publisher', 'PUBLISH_BLOCKED', contentId, { reason: 'status_not_approved' });
      return item;
    }

    item.status = 'SCHEDULED';
    item.log = 'Approved. Publishing adapter is configured only as a review-mode integration.';
    this.log('publisher', 'PUBLISH_REQUESTED', contentId, { adapter: 'metricool-review-only' });
    return item;
  }

  markPublished(contentId, postUrl) {
    const item = this.content.find(c => c.id === contentId);
    if (!item || item.status !== 'SCHEDULED') throw new Error('Only scheduled approved content can be marked published');
    item.status = 'PUBLISHED';
    item.postUrl = postUrl || '';
    item.log = 'Publishing confirmation received.';
    this.log('publisher', 'PUBLISHED', contentId, { postUrl: postUrl || '' });
    return item;
  }
}

function cryptoId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

module.exports = { AgencyStore, VALID_STATUSES, cryptoId };
