const http = require('http');
const fs = require('fs');
const path = require('path');
const { AgencyStore } = require('./store');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'agency.json');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

fs.mkdirSync(DATA_DIR, { recursive: true });
let initial = {};
if (fs.existsSync(DATA_FILE)) {
  try { initial = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch { initial = {}; }
}
const store = new AgencyStore(initial);
const persist = () => fs.writeFileSync(DATA_FILE, JSON.stringify(store.snapshot(), null, 2));

function json(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'x-content-type-options': 'nosniff' });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  let body = '';
  for await (const chunk of req) body += chunk;
  if (!body) return {};
  try { return JSON.parse(body); } catch { throw new Error('Invalid JSON body'); }
}

const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json' };

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    if (req.method === 'GET' && url.pathname === '/api/state') return json(res, 200, store.snapshot());

    if (req.method === 'POST' && url.pathname === '/api/clients') {
      const body = await readJson(req);
      const result = store.addClient(body);
      persist(); return json(res, 201, result);
    }

    if (req.method === 'POST' && url.pathname === '/api/ideas/generate') {
      const body = await readJson(req);
      const result = store.generateIdeas(body.clientId, body.targetDate);
      persist(); return json(res, 200, result);
    }

    if (req.method === 'POST' && url.pathname === '/api/ideas/approve') {
      const body = await readJson(req);
      const result = store.approveIdea(body.ideaId, body.ownerNote);
      persist(); return json(res, 200, result);
    }

    if (req.method === 'POST' && url.pathname === '/api/content/prepare') {
      const body = await readJson(req);
      const result = store.prepareContent(body.ideaId);
      persist(); return json(res, 200, result);
    }

    if (req.method === 'POST' && url.pathname === '/api/content/decision') {
      const body = await readJson(req);
      const result = store.decideGate2(body.contentId, body.decision, body.ownerNote);
      persist(); return json(res, 200, result);
    }

    if (req.method === 'POST' && url.pathname === '/api/content/publish') {
      const body = await readJson(req);
      const result = store.publish(body.contentId);
      persist(); return json(res, 200, result);
    }

    if (req.method === 'POST' && url.pathname === '/api/content/published') {
      const body = await readJson(req);
      const result = store.markPublished(body.contentId, body.postUrl);
      persist(); return json(res, 200, result);
    }

    if (req.method === 'GET' && (url.pathname === '/' || url.pathname.startsWith('/assets/'))) {
      const requested = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
      const file = path.join(PUBLIC_DIR, requested);
      if (!file.startsWith(PUBLIC_DIR) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return json(res, 404, { error: 'Not found' });
      res.writeHead(200, { 'content-type': `${mime[path.extname(file)] || 'application/octet-stream'}; charset=utf-8` });
      return res.end(fs.readFileSync(file));
    }

    return json(res, 404, { error: 'Not found' });
  } catch (error) {
    return json(res, 400, { error: error.message });
  }
});

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  server.listen(port, () => console.log(`Envision AI listening on http://localhost:${port}`));
}

module.exports = { server };
