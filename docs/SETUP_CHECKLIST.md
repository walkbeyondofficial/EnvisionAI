# Local Development

## Requirements
- Node.js 18+

## Start
```bash
npm start
```

Open http://localhost:3000.

## Verify
```bash
npm test
```

## Integrations
Canva and Metricool are intentionally adapters in the MVP. No external API is called. Integration credentials must be supplied through environment variables and never committed.

For publishing, the system must still receive a Metricool/publication confirmation before content is marked `PUBLISHED`.
