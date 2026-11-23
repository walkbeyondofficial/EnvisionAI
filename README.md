# Envision AI

An AI-run social media marketing agency: three AI agents (Design, Publisher, Finance & Marketing) plus one human owner who approves what gets built and what goes live. Launch platforms: Instagram and TikTok.

**Full proposal and plan:** [docs/PROPOSAL.md](docs/PROPOSAL.md)

## Repository map
| Path | Contents |
|---|---|
| `docs/PROPOSAL.md` | Proposal, architecture, phased plan, KPIs, risks |
| `docs/WORKFLOW.md` | Daily cycle and Google Sheets layout |
| `docs/SETUP_CHECKLIST.md` | Connections and owner actions |
| `docs/DRIVE_FOLDER_STRUCTURE.md` | Google Drive folder layout |
| `agents/` | Role specs for the 3 agents |
| `clients/_TEMPLATE/` | Client profile template |
| `schemas/` | JSON schema for client profiles |
| `config/agency.yaml` | Schedule, statuses, connection status |

## How it works
1. Design Agent proposes 5 ideas per client per day.
2. Owner approves 1 (Gate 1).
3. Design Agent builds it in Canva (free plan).
4. Publisher Agent prepares the post in Metricool for review.
5. Owner approves the final (Gate 2).
6. Post publishes automatically; analytics feed the next day's ideas.

Nothing is published without owner approval.

## Privacy
Keep this repo private. Do not commit real client profiles, credentials or API tokens.
