# Workflow & Sheet Layout

## Daily run (summary)
1. **18:00 D-1** Design Agent writes 5 ideas per client → `Idea Queue`.
2. **By 21:00** Owner marks one idea per client `IDEA_APPROVED` (Gate 1).
3. **06:00 D** Design Agent builds approved ideas in Canva → exports to Drive.
4. **Morning** Publisher Agent writes captions, picks time, creates Metricool post **for review**.
5. **By 09:00** Owner sets `APPROVED` / `CHANGES_REQUESTED` / `REJECTED` (Gate 2).
6. Publisher Agent schedules/publishes approved posts; logs `PUBLISHED`.
7. Analytics logged; learnings fed to Design Agent.

## Sheet tabs and columns
**Clients:** client_id, business_name, package, status, drive_profile_link, canva_brand_kit, instagram_handle, tiktok_handle, posts_per_week

**Idea Queue:** idea_id, client_id, target_date, platform, format, hook, visual_direction, draft_copy, why_it_fits, recommended(Y/N), status, owner_note

**Approval Queue:** content_id, idea_id, client_id, canva_link, drive_link, caption, hashtags, platform, scheduled_time, metricool_review_link, status, owner_decision, owner_note, updated_at, log

**Content Calendar:** date, client_id, platform, content_id, status, post_url, reach, engagement, saves, shares, learnings

**Finance:** client_id, month, fee, currency, invoice_sent, due_date, paid, tool_cost_share, margin

**Leads:** lead_id, business, source, contact, fit_score, stage, last_action, next_action

## Failure handling
Any failed step sets `FAILED` with a reason in `log` and stops that item; other clients continue.
