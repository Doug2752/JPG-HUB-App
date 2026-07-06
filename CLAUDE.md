# CLAUDE.md — HUB (Workspace Hub)

## APP IDENTITY
- Name: HUB — Workspace Hub
- Full folder: C:\JPG-PROJECTS\JPG-HUB-App
- GitHub repo: Doug2752/JPG-HUB-App
- Dev port: 5176 (5177 fallback)
- Purpose: Central coaching platform hub — 10-spoke model, single login point for all coaching activity.
- Architecture: React + Vite, monolith baseline (Class 3 modular conversion pending), localStorage.

## NON-NEGOTIABLE WORKING RULES
1. Investigation before action.
2. Never assume.
3. Never act without asking first.
4. One task at a time (logic / styling / copy stay isolated).
5. Plan mode always on.
6. GitHub Desktop is the only trusted push mechanism.
7. Browser-verify before commit.
8. Never redraft finalized copy from scratch.

## MODEL SELECTION
- Opus — complex multi-file logic.
- Sonnet — small edits, investigations, styling, cleanup.
- Model stated at top of every prompt.

## BROWSER AND PORT REFERENCE
- Firefox — code/build testing, OS default.
- Brave — daily DOP/PIT entries only.
- Edge — Claude.ai chat sessions.
- vite.config.js should carry server: { open: false, port: 5176 }.

## CURRENT BUILD STATE
Built: monolith baseline committed, login screen (Test/JPG2026), shared JPG login standard applied.
Not built: all 10 spokes (Legal, Onboarding, PIT link, DOP link, Check-In, Educational Content, Resources, Messaging, TBD x2), Class 3 modular conversion, Legal spoke gating rule enforcement, client-journey tier/patch emblem system.
Known issues: no vite.config.js server block yet (port/open:false) — add before first dev session.

## KEY ARCHITECTURAL FACTS
React + Vite, npm run dev port 5176, localStorage, no backend,
case-insensitive login matching per CS v1.8 §8.2.
Spoke 1 (Legal) must gate all other spokes — not yet enforced at app level.

## REFERENCED GOVERNING DOCUMENTS
Core Standard v1.8, Troubleshooting Guide v3.2, Doc A, Doc B,
Session Handoff Primer.

## SESSION START PROTOCOL
First instruction is always read-only:
"Read CLAUDE.md and confirm you understand — do not run any commands yet."