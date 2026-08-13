# CLAUDE.md — HUB (Workspace Hub)

## APP IDENTITY
- Name: HUB — Workspace Hub
- Full folder: C:\JPG-PROJECTS\JPG-HUB-App
- GitHub repo: Doug2752/JPG-HUB-App
- Dev port: 5176 (5177 fallback)
- Purpose: Central coaching platform hub — 10-spoke model, single login point for coach and clients.
- Architecture: React + Vite, modular structure (CommunicationView.jsx still monolithic — Class 3 conversion pending), localStorage.
- Code Logic doc: JPG-SYS-HUB-CodeLogic-WRK-v1.4

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

## CURRENT BUILD STATE (confirmed in source 08/12/2026)

### Built and committed
- Login screen — calls login() from services/clients.js, error message on bad credentials, case-insensitive matching
- Session restore on mount — getSession() called on load, session persists across page refresh
- Logout — deletes hub_session from localStorage, clears user state
- 10-spoke SVG wheel — fully restructured 08/08/2026 (see Spoke Map below)
- Center circle — JPG HUB branding: JPG (fontSize 30, y=340) over HUB (fontSize 42, y=388), black text, no subtext
- Topbar title — CENTRAL HUB
- **Topbar dynamic coach name — BUILT 08/12/2026:** accepts user prop from HUBApp. Renders user?.username?.toUpperCase() ?? 'COACH'. No longer hardcoded. Post-Supabase: add admin tier with coach assignment to clients.
- Role-based spoke rendering — coach: all spokes clickable; client: only unlocked spokes clickable; locked spokes greyed
- Phase gating for client role (BUILT 08/08/2026) — DOP and PIT spokes locked during foundation (days 1–14) and analysis (days 15–21) phases
- HUB_AUTH_SPOKES passthrough — DOP, PIT, OBT (tracker) append ?hub_user=USERNAME param when opened. Passes username string only.
- FUTURE spoke permanently locked for all roles
- services/storage.js — localStorage wrapper (get, set, delete)
- services/clients.js — full client data model. createClientRecord defaults: obt, edu, comms, agreements, eventsboard, daily, resources all default TRUE as of 08/12/2026. dop_unlocked and pit_unlocked default FALSE.
- utils/date.js — todayISO()
- utils/constants.js — SPOKE_URLS, NAV_ITEMS, color constants
- ClientsView — reads hub_clients on mount, ADD CLIENT form, credentials panel after save. SPOKE_FLAGS has all 9 entries. Spoke count shows X / 9 (updated 08/12/2026 from /6).
- **SlidePanel — UPDATED 08/12/2026:** SPOKE_LABELS now has all 9 spokes with full descriptive labels. Accepts onOpenFullProfile prop. OPEN FULL PROFILE button now calls onOpenFullProfile(client) — no longer a placeholder. OBT unlock auto-writes program_start_date. Displays RESIDENTIAL ADDRESS (read-only, 2-line format).
- Nav — role-gated: coach sees all five NAV_ITEMS + CLIENT VIEW toggle + COACH VIEW back button. Client sees DASHBOARD only.
- **ClientViewMode — FULLY REBUILT 08/12/2026:** real client data from hub_clients. Client selector dropdown on load. Dashboard shows real name, tier badge, phase/cycle row (Tier 4 calculated from tracking_start_date). CLIENT PROGRESS section replaces TODAY'S HABITS — gold progress bar for Tier 4 with backend migration note. All hardcoded demo data removed. Props: { onBack }.
- **FullProfileView — NEW 08/12/2026:** components/FullProfileView.jsx. Props: { client, onBack }. Five sections: PERSONAL INFORMATION, BACKGROUND, CURRENT HABITS & HEALTH, PROGRAM STATUS, 4x4 METRICS. Real data from hub_clients where available (name, phone, email, program dates, tier). Migration placeholders for OBT-sourced fields. Routed from HUBApp when activeView === 'fullprofile'.
- HUBApp — clientRosterKey forces ClientsView remount after spoke toggles. selectedProfileClient state. handleOpenFullProfile(client) and handleBackFromProfile() handlers. fullprofile routing. Passes user={user} to Topbar. Passes onOpenFullProfile={handleOpenFullProfile} to SlidePanel.
- CommunicationView (BUILT 08/10/2026) — 1089 lines. Three tabs: MESSAGES, ANNOUNCEMENTS, SCHEDULED COMMUNICATION. Props: { user }. Routed on activeView === "communication".
- PlaceholderView — generic placeholder screen

### SlidePanel SPOKE_LABELS (9 entries — current as of 08/12/2026)
```
{ key: 'obt_unlocked',          label: 'ONBOARDING & 14-DAY TRACKING' }
{ key: 'dop_unlocked',          label: 'DAILY OPERATIONAL PROCESS (DOP)' }
{ key: 'pit_unlocked',          label: 'PERSONAL INVESTMENT TIME (PIT)' }
{ key: 'edu_unlocked',          label: 'EDUCATIONAL DOCUMENTS' }
{ key: 'comms_unlocked',        label: 'COMMUNICATIONS & MESSAGING' }
{ key: 'agreements_unlocked',   label: 'AGREEMENTS' }
{ key: 'eventsboard_unlocked',  label: 'EVENTS BOARD' }
{ key: 'daily_unlocked',        label: 'DAILY TRACKER' }
{ key: 'resources_unlocked',    label: 'RESOURCES VAULT' }
```

### Storage keys
- hub_clients — client roster JSON array
- hub_session — active session JSON object
- hub_messages — message thread objects
- hub_announcements — announcement objects
- hub_scheduled — active scheduled items
- hub_scheduled_completed — archived completed/cancelled items

### Known issues
- "Stay logged in" checkbox in Login.jsx — dead UI, post-Supabase
- hub_session persists indefinitely — no expiry. Acceptable for now.
- Residential address write-back from OBT limited by cross-origin localStorage — resolved post-Supabase.

### Not yet built
- Agreements spoke gating enforcement
- Client nav items — messages (unread indicator), reports
- Events Board spoke — zero code. Dedicated build session required.
- Class 3 modular conversion — CommunicationView.jsx needs split into 3 tab files
- Unified HUB login for all apps — dedicated session required
- Reports section in Communication spoke — scoped only, no code
- Full Communications spoke usability and efficiency audit — after all builds complete
- Topbar dynamic client name — currently shows coach name only when client logs in

### Post-Supabase (do not build)
- Auto-unlock DOP and PIT after client completes all 14 OBT days
- Admin tier with coach assignment to clients
- OBT personal info auto-populates HUB client roster
- Coach-facing archive and activity data
- Real session persistence
- Client tier progression logic
- Events Board AI title generation
- Communication spoke email delivery
- Full Profile OBT-sourced field population (preferred name, age, occupation, desired outcomes, hobbies, habits, injuries)
- Full Profile tier history and 4x4 metrics

## SPOKE MAP (locked 08/08/2026)

| Position | spokeId | Label L1 (gold) | Label L2 (white) | Label L3 (grey) | cx | cy |
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
- Coach record hardcoded in services/clients.js — id: coach_001, username: Doug, password: JPG2026, role: coach
- Client role routing: role=coach → full wheel, no phase gating; role=client → unlock flags + phase gating
- flagMap in WheelView isSpokeUnlocked: tracker→obt_unlocked, dop→dop_unlocked, pit→pit_unlocked, edu→edu_unlocked, communication→comms_unlocked, agreements→agreements_unlocked, eventsboard→eventsboard_unlocked, daily→daily_unlocked, resources→resources_unlocked
- getCyclePhase(hubUser) in WheelView — reads tracking_start_date from hub_clients, returns 'foundation'/'analysis'/'onramp'/'full'/null
- isSpokeUnlocked(spokeId, hubUser, role) — role is third param; client role + dop/pit spokes blocked during foundation and analysis phases
- program_start_date auto-written to hub_clients when coach unlocks OBT (obt_unlocked false→true in SlidePanel)
- tracking_start_date written to hub_clients by OBT ClientInfo.jsx
- clientRosterKey in HUBApp forces ClientsView remount after any spoke toggle
- hub_clients is the single source of truth for all cycle and tier data — HUB owns it
- hub_user param: HUB passes hubUser.username (string) to spoke apps via URL param — not the full session object
- New client creation (08/12/2026): 7 spokes default true (obt, edu, comms, agreements, eventsboard, daily, resources). dop_unlocked and pit_unlocked default false.
- CLIENT VIEW (08/12/2026): coach clicks CLIENT VIEW → client selector dropdown auto-opens → coach selects client → real client dashboard loads
- Full Profile (08/12/2026): OPEN FULL PROFILE button in SlidePanel opens FullProfileView.jsx via HUBApp routing (activeView === 'fullprofile')

## REFERENCED GOVERNING DOCUMENTS
- JPG-SYS-HUB-CodeLogic-WRK-v1.4 (single source of truth for all HUB decisions)
- JPG-SYS-CS-CoreStandard-WRK-v1.8
- JPG-SYS-Apps-TroubleshootingGuide-WRK-v6.8
- JPG-SYS-PRIMER-SessionHandoff-WRK (current version)

## SESSION START PROTOCOL
First instruction is always read-only:
"Read CLAUDE.md and confirm you understand — do not run any commands yet."

---

*HUB CLAUDE.md — v1.4 — updated 08/12/2026. Topbar now dynamic from user prop. SlidePanel expanded to 9 spokes with full descriptive labels. ClientsView spoke count updated to /9. ClientViewMode fully rebuilt with real client data and client selector dropdown. FullProfileView.jsx new component — 5 sections, real data + migration placeholders. OPEN FULL PROFILE wired in SlidePanel and HUBApp. createClientRecord: 7 spokes default true on creation, dop/pit remain false. Code Logic reference updated to v1.4. Troubleshooting Guide reference updated to v6.8.*
