# Envision AI — Project Proposal & Implementation Plan

**Prepared by:** Owner, Envision AI
**Date:** 24 November 2026
**Status:** Draft v1 for owner sign-off

> Note: the requirements referred to attached team documents. None were received when this was written, so the team structure below follows the written brief (3 roles, 1 owner). Any additional role detail from those documents can be merged in as v1.1.

---

## 1. Executive summary

Envision AI is a small marketing agency that creates and publishes social media content on behalf of clients. This project turns it into an AI-run agency: **three AI agents** (Design, Social Media Management, Finance & Marketing) do the daily work, and **one human owner** makes the decisions that matter: which idea to build, and whether the finished content goes live.

Nothing is published without the owner's explicit approval. Everything else is automated.

**Launch scope:** Instagram and TikTok. Canva (free plan) for design. Metricool for scheduling and publishing. Google Sheets as the working database. GitHub for the project code and specs. Google Drive for the agency's document library.

## 2. Business model

| Item | Description |
|---|---|
| Service | Done-for-you social content: ideas, designs (images, posters, short videos), captions, scheduling, publishing, monthly reporting |
| Clients | Small businesses that need consistent social presence without an in-house team |
| Platforms (phase 1) | Instagram (feed, carousel, Reels), TikTok (short video) |
| Packages (to be priced) | **Starter** 3 posts/week · **Growth** 5 posts/week · **Pro** daily posting. Pricing is an owner decision (see section 13) |

## 3. The team (max 3 employees)

Each employee is an AI agent with a written role spec in `/agents`. The owner is not counted as an employee. There is **no fourth agent**: the daily sequence is run by a simple scheduler (a fixed script and checklist), not by another employee.

| # | Role | Agent | Owns |
|---|---|---|---|
| 1 | Design | **Design Agent** | Daily idea generation; building approved ideas in Canva |
| 2 | Social Media Management | **Publisher Agent** | Captions, hashtags, scheduling, publishing, community checks, analytics |
| 3 | Finance & Marketing | **Finance & Marketing Agent** | Lead generation, proposals, invoices, payment tracking, monthly reports, agency growth |

### 3.1 Design Agent
- Every day, produces **5 design ideas per active client** before any image or video is created. Each idea is a short brief: hook, format (image / carousel / poster / video), platform, visual direction, draft copy, and why it fits the client.
- After the owner approves **1 idea** for the next day, builds it in Canva (images, posters, short videos), exports it, and hands it to the Publisher Agent.
- Reads the client profile first, always. Follows brand colors, fonts, tone and "never do" rules.
- Does **not** publish, and does not generate before an idea is approved.

### 3.2 Publisher Agent
- Receives finished assets, writes final caption and hashtags per platform, picks the posting time (using best-time data), and places the post in Metricool **for review**.
- Publishes only after the owner's final approval.
- After posting: collects analytics, flags comments or messages that need the owner, and feeds results back to the Design Agent as "what worked."

### 3.3 Finance & Marketing Agent
- **Finance:** client invoices, payment tracking, tool and subscription costs, monthly profit view. Drafts only; owner approves anything sent to a client.
- **Marketing (for Envision AI itself):** finds and qualifies prospects, drafts outreach and proposals, prepares monthly client reports, suggests packages and pricing changes.
- Never moves money or sends payment requests without owner approval.

## 4. Daily operating cycle

Two human gates. Everything between them is automatic.

| Time (Asia/Colombo) | Step | Who |
|---|---|---|
| Evening, day D-1 (e.g. 18:00) | Ideas generated: 5 per client, written to the **Idea Queue** sheet | Design Agent |
| Evening, D-1 | **GATE 1:** owner picks 1 idea per client (or asks for new ones) | Owner |
| Early morning, day D | Approved idea built in Canva, exported, saved to Drive | Design Agent |
| Morning, D | Caption, hashtags and time slot added; post created in Metricool **for review** | Publisher Agent |
| Morning, D | **GATE 2:** owner reviews final asset + caption; approve / request changes / reject | Owner |
| D, at scheduled time | Post goes live on Instagram / TikTok | Publisher Agent (auto, after approval) |
| D+1 onward | Analytics pulled and logged | Publisher Agent |

If the owner has not approved by the deadline, the post is **not published**. The default is always "hold," never "go."

### Status flow for every content item
`IDEA_PROPOSED → IDEA_APPROVED → BUILDING → READY_FOR_REVIEW → APPROVED → SCHEDULED → PUBLISHED`
Side exits: `IDEA_REJECTED`, `CHANGES_REQUESTED` (back to BUILDING), `REJECTED`, `FAILED` (with reason).

## 5. System architecture

| Layer | Tool | Role |
|---|---|---|
| Agent brain | Claude (3 agent role specs) | Reasoning, writing, decisions inside each role |
| Design | **Canva (free plan)** via connector | Create images, posters, videos; export |
| Publishing | **Metricool** via connector | Schedule, send for review, publish, analytics (Instagram, TikTok) |
| Database | **Google Sheets** via connector | Client profiles index, Idea Queue, Approval Queue, Content Calendar, Finance |
| Document library | **Google Drive** | Agency folder with all project files and client deliverables |
| Code & specs | **GitHub** | This repository; version history of agent specs and config |

Data flow:
`Client Profile → Design Agent (5 ideas) → Idea Queue → Owner picks 1 → Design Agent (Canva build) → Drive → Publisher Agent (Metricool, for review) → Owner approves → Auto-publish → Analytics → back to Design Agent`

### Current connection status (checked 24 Nov 2026)
| Connection | Status | Owner action |
|---|---|---|
| Canva | Connected | None |
| Google Sheets | Connected | Create the agency spreadsheet from the template |
| Metricool | Connected | Link the Instagram and TikTok accounts for each client brand inside Metricool |
| Google Drive | **Not connected** | Connect in Claude connector settings so the agency folder can be created |
| GitHub | **Not linked** | Connect GitHub in Claude settings, create the repo, push (see `docs/SETUP_CHECKLIST.md`) |

## 6. Client profiles

Each client has one profile (template in `/clients/_TEMPLATE/client-profile.md`, machine-readable schema in `/schemas/client-profile.schema.json`). Agents read it before every task.

Key sections: business basics; goals and KPIs; target audience; brand identity (colors, fonts, logo, tone, languages); content pillars; do / don't rules; compliance and legal limits; competitors and inspiration; platforms and handles; posting frequency; approval rules; package and billing; history of what worked.

The index of all clients lives in the **Clients** sheet; full profiles live in Drive under `Clients/<client-name>/`.

## 7. Platform notes (Instagram and TikTok)

- Instagram: Reels 9:16 (1080×1920), feed images 4:5 (1080×1350), carousels up to 10 slides.
- TikTok: vertical video 9:16; short, hook in the first seconds.
- Every post gets a platform-specific caption and hashtag set.
- Apply each platform's AI-content disclosure label when content is realistic AI-generated media.
- Use only licensed or Canva-supplied assets. No copyrighted characters, music or logos unless the client owns them.

## 8. Guardrails

1. **Human approval before publishing**, every post, no exceptions in phase 1.
2. Agents work only from the client profile. Missing info means ask, not guess.
3. No claims about results, prices, health or finance that the client has not supplied.
4. No impersonation of real people or organizations; no fake reviews or testimonials.
5. Client data stays in Sheets/Drive owned by Envision AI; one client's data is never used for another.
6. Every action is logged (who, what, when) in the Approval Queue sheet.
7. Failure = stop and report, never retry endlessly.

## 9. Implementation plan

| Phase | Weeks | Deliverables | Exit test |
|---|---|---|---|
| **0. Foundation** | 1 | Connect Drive and GitHub; create agency spreadsheet and Drive folder; push repo; finalize 3 agent specs | Owner can see repo, folder and sheet |
| **1. Technical spike** | 2 | Prove the end-to-end path with one dummy brand: idea → Canva build → export → Metricool "for review" post on a test account | One post completes every status without manual file handling; media hand-off from Canva to Metricool confirmed |
| **2. Pilot** | 3–6 | 1–2 friendly clients onboarded; daily cycle run live; owner approval routine tuned | 3 consecutive weeks with no missed posts and no unapproved publishing |
| **3. Scale** | 7–12 | Up to ~8–10 clients; monthly reports; invoicing and prospecting by Finance & Marketing Agent | Owner review time per client per day under target (see KPIs) |
| **4. Improve** | 13+ | Add platforms (e.g. Facebook, YouTube Shorts); A/B hooks; template library | Engagement and retention KPIs up |

## 10. KPIs

- On-time publish rate ≥ 95% of approved posts
- Owner review time ≤ 5 minutes per client per day (gate 1 + gate 2 combined)
- Idea acceptance rate (approved ideas ÷ days) and rework rate (CHANGES_REQUESTED ÷ builds)
- Client engagement rate and follower growth vs. baseline
- Client retention; monthly margin = revenue − tool costs − owner time

## 11. Capacity note

Five ideas per client per day means the owner reads 5 × N ideas daily. At 10 clients that is 50 short briefs plus 10 final reviews. The Idea Queue shows one line per idea, with a recommended pick, to keep this fast. If review time becomes the bottleneck, reduce active clients per owner or batch ideas for 2–3 days ahead.

## 12. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Canva free plan limits (AI image/video credits, premium assets) | Test limits in Phase 1; design with templates and free assets; budget for an upgrade if limits block delivery |
| Metricool plan limits (brands, scheduled posts, network access) | Verify against the plan in Phase 1; upgrade only if the pilot proves demand |
| Media hand-off from Canva to Metricool is not seamless | Dedicated spike in Phase 1 using Drive/exported links; fallback is manual upload of the approved file |
| Instagram/TikTok API changes or account issues | Clients must use business/creator accounts linked in Metricool; owner monitors failures |
| Off-brand or inaccurate content | Profile-driven prompts, owner gate 2, and a do/don't list per client |
| Daily automation needs a scheduler (not available on the free Claude plan) | Phase 0 decision: run the cycle manually each day with one command/prompt, or use a paid scheduling option or an external scheduler such as GitHub Actions |
| Single point of failure (one owner) | Documented runbook; clear "hold by default" rule so absence never causes bad posts |

## 13. Decisions needed from the owner

1. Package prices and currency.
2. Review deadlines (suggested: Gate 1 by 21:00, Gate 2 by 09:00).
3. How the daily cycle will be triggered (manual vs. scheduled).
4. First 1–2 pilot clients.
5. Share the attached team documents so roles can be reconciled.
