# Setup Checklist (owner actions)

## Connections
- [x] Canva — connected (free plan)
- [x] Google Sheets — connected
- [x] Metricool — connected
- [ ] **Google Drive** — connect in Claude → Settings → Connectors, then ask Claude to create the `Envision AI` folder and upload this project
- [ ] **GitHub** — connect GitHub in Claude settings (and give the Claude GitHub App access to the repo if private)
- [ ] In Metricool: add a brand per client and link their Instagram and TikTok business/creator accounts

## Publish this project to GitHub (manual route)
```bash
cd envision-ai
git init && git add . && git commit -m "Initial Envision AI project"
# create an empty repo named envision-ai on GitHub, then:
git remote add origin https://github.com/<your-user>/envision-ai.git
git branch -M main && git push -u origin main
```
Keep the repo **private**: client details must never be committed. Only the `_TEMPLATE` profile belongs in git; real profiles live in Drive/Sheets.

## Google Sheets workbook "Envision AI — Operations"
Create tabs: `Clients`, `Idea Queue`, `Approval Queue`, `Content Calendar`, `Finance`, `Leads`. Column suggestions are in `docs/WORKFLOW.md`.

## Decisions
- [ ] Package prices and currency
- [ ] Gate deadlines (default 21:00 and 09:00)
- [ ] Daily trigger: manual vs. scheduled
- [ ] First pilot clients
