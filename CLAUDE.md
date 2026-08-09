# CLAUDE.md — HUB (Workspace Hub)

## APP IDENTITY
- Name: HUB — Workspace Hub
- Full folder: C:\JPG-PROJECTS\JPG-HUB-App
- GitHub repo: Doug2752/JPG-HUB-App
- Dev port: 5176 (5177 fallback)
- Purpose: Central coaching platform hub — 10-spoke model, single login point for coach and clients.
- Architecture: React + Vite, monolith baseline (Class 3 modular conversion pending), localStorage.
- Code Logic doc: JPG-SYS-HUB-CodeLogic-WRK-v1.1

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

## CURRENT BUILD STATE (confirmed in source 08/08/2026)

### Built and committed
- Login screen — calls login() from services/clients.js, error message on bad credentials, case-insensitive matching
- Session restore on mount — getSession() called on load, session persists across page refresh
- Logout — deletes hub_session from localStorage, clears user state
- 10-spoke SVG wheel with HUB center
- Role-based spoke rendering — coach: all spokes clickable; client: only unlocked spokes clickable; locked spokes greyed (opacity 0.4, not-allowed cursor)
- Phase gating for client role (BUILT 08/08/2026) — DOP and PIT spokes locked during foundation (days 1–14) and analysis (days 15–21) phases regardless of unlock flag. getCyclePhase() reads tracking_start_date from hub_clients.
- HUB_AUTH_SPOKES passthrough — DOP, PIT, OBT (tracker) append ?hub_user= param when opened, bypassing spoke login screen
- Spoke URLs corrected (08/07/2026): DOP→5173, PIT→5174, OBT(tracker)→5175
- FUTURE spoke permanently locked for all roles
- services/storage.js — localStorage wrapper (get, set, delete)
- services/clients.js — full client data model: generateUsername, generatePassword, createClientRecord, getClients, saveClients, addClient, updateClient, login, logout, getSession
- utils/date.js (NEW 08/08/2026) — todayISO() returns YYYY-MM-DD
- ClientsView — reads hub_clients on mount, real columns (NAME / TIER / PROGRAM START / SPOKES / STATUS), ADD CLIENT inline form with validation, credentials panel after save, empty state message
- SlidePanel — real client fields (tier, program start, username, generated password), spoke unlock toggles (UNLOCK/REVOKE per spoke), onUpdate callback. OBT unlock also writes program_start_date: todayISO() (BUILT 08/08/2026).
- HUBApp — clientRosterKey forces ClientsView remount after spoke toggles; onUpdate refreshes panelClient with current data from localStorage after toggle
- Nav, Topbar, PlaceholderView, ClientViewMode (demo only — hardcoded data)

### Known issues / dead code
- USERS object and CLIENTS array in utils/constants.js — orphaned from old hardcoded system, no longer imported anywhere. Safe to remove next session.
- Topbar "Coach: DOUG JONES" — hardcoded, not dynamic from session
- "Stay logged in" checkbox in Login.jsx — dead UI, post-Supabase
- Legal spoke gating rule — Agreements spoke must be completed before other spokes unlock. Not enforced at app level.
- vite.config.js server block — confirmed present (port 5176, open: false)
- hub_session persists indefinitely — no expiry. To force login screen: delete hub_session key from localStorage in browser DevTools and refresh.

### Not yet built
- **Client wheel view nav restriction** — when client logs in, coach nav tabs (Clients, etc.) must be hidden. Client should see wheel, messages, and reports only. Not yet built.
- **Client nav items** — messages (with unread indicator), reports (summaries from OBT/PIT). Scoped 08/08/2026 — not yet built.
- **Upcoming Events spoke** — Client Check-In spoke to be renamed Upcoming Events. Will house scheduled calls/meetings and community thread. Prior thread context needed before building.
- **Community thread** — cross-client engagement feature. Own spoke vs. inside Upcoming Events not yet decided. Prior thread context needed.
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

## KEY ARCHITECTURAL FACTS
- Storage keys: hub_clients (client roster JSON array), hub_session (active session JSON object)
- Coach record hardcoded in services/clients.js — id: coach_001, username: Doug, password: JPG2026, role: coach
- Client role routing: role=coach → full wheel all clickable (no phase gating); role=client → unlock flags + phase gating control access
- flagMap in WheelView: tracker→obt_unlocked, dop→dop_unlocked, pit→pit_unlocked, edu→edu_unlocked, messaging→comms_unlocked, legal→agreements_unlocked
- getCyclePhase(hubUser) in WheelView — reads tracking_start_date from hub_clients, returns 'foundation'/'analysis'/'onramp'/'full'/null
- isSpokeUnlocked(spokeId, hubUser, role) — role is third param; client role + dop/pit spokes blocked during foundation and analysis phases
- program_start_date auto-written to hub_clients when coach unlocks OBT (obt_unlocked false→true in SlidePanel)
- tracking_start_date written to hub_clients by OBT ClientInfo.jsx when client saves valid date — HUB WheelView reads it for phase gating
- clientRosterKey in HUBApp forces ClientsView remount after any spoke toggle
- onUpdate in HUBApp re-reads hub_clients and calls setPanelClient with fresh record after toggle
- Spoke 1 (Agreements/Legal) must gate all other spokes — not yet enforced at app level
- hub_clients is the single source of truth for all cycle and tier data — HUB owns it

## REFERENCED GOVERNING DOCUMENTS
- JPG-SYS-HUB-CodeLogic-WRK-v1.1 (single source of truth for all HUB decisions)
- JPG-SYS-CS-CoreStandard-WRK-v1.8
- JPG-SYS-Apps-TroubleshootingGuide-WRK-v6.4
- JPG-SYS-PRIMER-SessionHandoff-WRK (current version)

## SESSION START PROTOCOL
First instruction is always read-only:
"Read CLAUDE.md and confirm you understand — do not run any commands yet."

---

*HUB CLAUDE.md — v1.2 — updated 08/08/2026. Phase gating built — getCyclePhase(), isSpokeUnlocked() role parameter, DOP/PIT client lock during foundation and analysis phases. utils/date.js created — todayISO(). SlidePanel program_start_date auto-write on OBT unlock. Client nav restriction and Upcoming Events spoke scoped but not built. Code Logic reference updated to v1.1.*
