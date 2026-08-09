# CLAUDE.md — HUB (Workspace Hub)

## APP IDENTITY
- Name: HUB — Workspace Hub
- Full folder: C:\JPG-PROJECTS\JPG-HUB-App
- GitHub repo: Doug2752/JPG-HUB-App
- Dev port: 5176 (5177 fallback)
- Purpose: Central coaching platform hub — 10-spoke model, single login point for coach and clients.
- Architecture: React + Vite, monolith baseline (Class 3 modular conversion pending), localStorage.
- Code Logic doc: JPG-SYS-HUB-CodeLogic-WRK-v1.2

## NON-NEGOTIABLE WORKING RULES
1. Investigation before action.
2. Never assume.
3. Never act without asking first.
4. One task at a time (logic / styling / copy stay isolated).
5. Plan mode always on.
6. GitHub Desktop is the only trusted push mechanism.
7. Browser-verify before commit.
8. Never redraft finalized copy from scratch.
9. Never touch .md files during code builds.

## MODEL SELECTION
- Opus — complex multi-file logic.
- Sonnet — small edits, investigations, styling, cleanup.
- Model stated at top of every prompt.

## BROWSER AND PORT REFERENCE
- Firefox — code/build testing, OS default (localhost:5176).
- Brave — daily DOP/PIT entries only.
- Edge — Claude.ai chat sessions.
- vite.config.js: server { open: false, port: 5176 }

## CREDENTIALS
- Coach: Doug / JPG2026 (case-insensitive)
- Clients: generated username (first initial + last name, lowercase) / generated password (First-cap last name + last 4 digits of phone + MMYY of program start date)
- Example: John Smith, phone 555-867-5309, start Sep 2026 → username: jsmith / password: Smith53090926
- hub_session persists across page refresh. To force login screen: delete hub_session key from localStorage in Firefox DevTools and refresh.

## CURRENT BUILD STATE (confirmed in source 08/08/2026)

### Built and committed
- Login screen — calls login() from services/clients.js, error message on bad credentials, case-insensitive matching
- Session restore on mount — getSession() called on load, session persists across page refresh
- Logout — deletes hub_session from localStorage, clears user state
- 10-spoke SVG wheel — fully restructured 08/08/2026 (see Spoke Map below)
- Center circle — JPG HUB branding: JPG (fontSize 30, y=340) over HUB (fontSize 42, y=388), black text, no subtext
- Topbar title — CENTRAL HUB (updated 08/08/2026, was CENTRAL COMMAND HUB)
- Role-based spoke rendering — coach: all spokes clickable; client: only unlocked spokes clickable; locked spokes greyed (opacity 0.4, not-allowed cursor)
- Phase gating for client role (BUILT 08/08/2026) — DOP and PIT spokes locked during foundation (days 1–14) and analysis (days 15–21) phases regardless of unlock flag. getCyclePhase() reads tracking_start_date from hub_clients.
- HUB_AUTH_SPOKES passthrough — DOP, PIT, OBT (tracker) append ?hub_user=USERNAME param when opened, bypassing spoke login screen. Passes username string only (not full session object) — fixed 08/08/2026.
- FUTURE spoke permanently locked for all roles (bottom center, dashed border)
- services/storage.js — localStorage wrapper (get, set, delete)
- services/clients.js — full client data model: generateUsername, generatePassword, createClientRecord, getClients, saveClients, addClient, updateClient, login, logout, getSession
- utils/date.js — todayISO() returns YYYY-MM-DD
- utils/constants.js — SPOKE_URLS, NAV_ITEMS, color constants. USERS and CLIENTS orphaned constants removed 08/08/2026.
- ClientsView — reads hub_clients on mount, real columns, ADD CLIENT inline form with validation, credentials panel after save, empty state message
- SlidePanel — real client fields, spoke unlock toggles (UNLOCK/REVOKE per spoke), onUpdate callback. OBT unlock auto-writes program_start_date: todayISO().
- HUBApp — clientRosterKey forces ClientsView remount after spoke toggles; onUpdate refreshes panelClient with current data from localStorage after toggle. role prop passed to Nav.
- Nav — role-gated (BUILT 08/08/2026): coach sees all five NAV_ITEMS (DASHBOARD, CLIENTS, MESSAGES, REPORTS, SETTINGS) + CLIENT VIEW toggle below divider + COACH VIEW back button when in client view. Client sees DASHBOARD only, no coach tabs, no CLIENT VIEW section, no COACH VIEW label.
- PlaceholderView, ClientViewMode (demo only — hardcoded data)

### Known issues / dead code
- Topbar "Coach: DOUG JONES" — hardcoded, not dynamic from session
- "Stay logged in" checkbox in Login.jsx — dead UI, post-Supabase
- Legal/Agreements spoke gating rule — Agreements spoke must be completed before other spokes unlock. Not enforced at app level.
- vite.config.js server block — confirmed present (port 5176, open: false)
- hub_session persists indefinitely — no expiry. Acceptable for now; unified login will address.
- flagMap in isSpokeUnlocked — eventsboard_unlocked, daily_unlocked, resources_unlocked flags not yet present in createClientRecord. These fields will be undefined on existing client records until createClientRecord is updated.

### Not yet built
- **createClientRecord update** — add eventsboard_unlocked, daily_unlocked, resources_unlocked flags defaulting to false
- **Client nav items** — messages (with unread indicator), reports (summaries from OBT/PIT data). Scoped — not yet built.
- **Communication spoke** — Spoke 8. Sub-spokes: Messages (Direct Thread), Announcements (Broadcast), Scheduled Communication. Zero code exists. Dedicated scoping session required before build.
- **Events Board spoke** — Spoke 9. Forum-style thread board. Manual title at launch, AI-generated post-Supabase. UPCOMING/COMPLETED post states. Zero code exists. Dedicated scoping session required before build.
- Full Profile view — OPEN FULL PROFILE button in SlidePanel footer is non-functional placeholder
- Topbar dynamic coach/client name from session
- Legal/Agreements spoke gating enforcement
- Class 3 modular conversion
- Unified HUB login for all apps — dedicated session required

### Post-Supabase (do not build)
- OBT personal info auto-populates HUB client roster (requires shared backend)
- Coach-facing archive and activity data
- Real session persistence ("Stay logged in")
- Client tier progression logic

## SPOKE MAP (locked 08/08/2026)

| Position | spokeId | Label Line 1 (gold) | Label Line 2 (white) | Label Line 3 (grey) | cx | cy |
|---|---|---|---|---|---|---|
| TOP | dop | DAILY OPS | DOP | PROCESS | 360 | 75 |
| TOP-RIGHT | pit | PERSONAL | PIT | INVEST. TIME | 528 | 129 |
| RIGHT | tracker | 14-DAY | TRACKER | ONBOARDING | 631 | 272 |
| BOTTOM-RIGHT | communication | COACH | COMMUNICATION | MESSAGES | 631 | 448 |
| BOTTOM-RIGHT-LOWER | agreements | CLIENT | AGREEMENTS | DOCS & FORMS | 528 | 591 |
| BOTTOM-CENTER | future | FUTURE | DEVELOPMENT | — | 360 | 645 |
| BOTTOM-LEFT | eventsboard | EVENTS | BOARD | COMMUNITY | 192 | 591 |
| LEFT | daily | DAILY | TRACKER | APPS | 89 | 448 |
| TOP-LEFT | resources | RESOURCES | VAULT | DOWNLOADS | 89 | 272 |
| TOP-LEFT-UPPER | edu | EDUCATION | REFERENCE | LIBRARY | 192 | 129 |

## KEY ARCHITECTURAL FACTS
- Storage keys: hub_clients (client roster JSON array), hub_session (active session JSON object)
- Coach record hardcoded in services/clients.js — id: coach_001, username: Doug, password: JPG2026, role: coach
- Client role routing: role=coach → full wheel all clickable (no phase gating); role=client → unlock flags + phase gating control access
- flagMap in WheelView isSpokeUnlocked: tracker→obt_unlocked, dop→dop_unlocked, pit→pit_unlocked, edu→edu_unlocked, communication→comms_unlocked, agreements→agreements_unlocked, eventsboard→eventsboard_unlocked, daily→daily_unlocked, resources→resources_unlocked
- getCyclePhase(hubUser) in WheelView — reads tracking_start_date from hub_clients, returns 'foundation'/'analysis'/'onramp'/'full'/null
- isSpokeUnlocked(spokeId, hubUser, role) — role is third param; client role + dop/pit spokes blocked during foundation and analysis phases
- program_start_date auto-written to hub_clients when coach unlocks OBT (obt_unlocked false→true in SlidePanel)
- tracking_start_date written to hub_clients by OBT ClientInfo.jsx when client saves valid date — HUB WheelView reads it for phase gating
- clientRosterKey in HUBApp forces ClientsView remount after any spoke toggle
- hub_clients is the single source of truth for all cycle and tier data — HUB owns it
- hub_user param: HUB passes hubUser.username (string) to spoke apps via URL param — not the full session object

## REFERENCED GOVERNING DOCUMENTS
- JPG-SYS-HUB-CodeLogic-WRK-v1.2 (single source of truth for all HUB decisions)
- JPG-SYS-CS-CoreStandard-WRK-v1.8
- JPG-SYS-Apps-TroubleshootingGuide-WRK-v6.4
- JPG-SYS-PRIMER-SessionHandoff-WRK (current version)

## SESSION START PROTOCOL
First instruction is always read-only:
"Read CLAUDE.md and confirm you understand — do not run any commands yet."

---

*HUB CLAUDE.md — v1.3 — updated 08/08/2026. Spoke wheel fully restructured — 10 spokes repositioned and relabeled, Communication and Events Board spokes added, Client Check-In eliminated. Center circle updated to JPG HUB branding. Topbar title updated to CENTRAL HUB. Nav role-gating built — coach full access + CLIENT VIEW toggle with COACH VIEW back button; client DASHBOARD only. hub_user param fixed to pass username string. USERS and CLIENTS orphaned constants removed. Code Logic reference updated to v1.2.*
