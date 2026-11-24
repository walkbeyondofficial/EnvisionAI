# Envision AI — MVP

A local-first, human-gated social content workflow for Instagram and TikTok.

## Safety model

- The owner must approve one of five ideas (**Gate 1**).
- The owner must approve the completed post (**Gate 2**).
- Publishing is impossible unless an item is in `APPROVED` status.
- Missing approval, webhook failure, or unknown status defaults to `HOLD`.
- Publishing integrations are adapters and remain disabled until credentials are configured.

## Run

```bash
npm start
```

Open `http://localhost:3000`.

## Test

```bash
npm test
```

## Workflow

1. Add or select a client.
2. Generate exactly five ideas.
3. Approve one idea (Gate 1).
4. Build the approved asset details.
5. Prepare the publisher review.
6. Approve or reject the final post (Gate 2).
7. Publish only after explicit approval.

The data store is `data/agency.json`. It is excluded from Git. No real client, credential, or token data belongs in this repository.
