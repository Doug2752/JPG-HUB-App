# HUB — CLAUDE.md
## Workspace Hub — Claude Code Operating Reference
**Version:** v2.3 | **Date:** 08/25/2026
**Repo:** Doug2752/JPG-HUB-App
**Local:** C:\JPG-PROJECTS\JPG-HUB-App

---

## CRITICAL RULES — READ FIRST

1. **Never guess or assume** — read the actual file before stating anything about its contents.
2. **Never produce a build prompt** until Doug has reviewed and approved the spec in Claude.ai.
3. **Investigation prompts use Sonnet. Complex multi-file builds may use Opus.**
4. **Never start the dev server.** Never commit. Never push.
5. **Never modify .md files in the repo root.**
6. **All builds broken into 150–200 line sections max.** Never send a single large build prompt.
7. **GOLD_LIGHT (#ddb94a) = clickable/action elements. GOLD (#B8860B) = informational/non-interactive.**
8. **Never define local color constants** — always import from utils/constants.

---

## PORTS

| App | Port | Fallback |
|---|---|---|
| HUB | 5176 | 5177 |
| DOP | 5173 | — |
| PIT | 5174 | — |
| OBT (master) | 5175 | — |
| OBT (Chris-Mods) | 5178 | — |

---

## REPO STRUCTURE

JPG-HUB-App/
├── app/
│   └── HUBApp.jsx                    # Root component. renderView() routes all views. Owns upgradeSession(). Imports storage from services/storage.
├── components/
│   ├── Login.jsx
│   ├── Nav.jsx
│   ├── Topbar.jsx
│   ├── WheelView.jsx                 # 10-spoke SVG wheel. Two visual tiers. Phase + agreements gating. Prospect short-circuit in isSpokeUnlocked.
│   ├── ClientsView.jsx
│   ├── SlidePanel.jsx                # 420px right panel. APPROVE/REVOKE APPROVAL button. Agreements gating on 4 spokes. 10 SPOKE_LABELS entries.
│   ├── FullProfileView.jsx
│   ├── CommunicationView.jsx         # Thin shell — 210 lines. Owns state. Passes to tab components.
│   ├── ReportsView.jsx
│   ├── EventsBoardView.jsx           # Full forum-style thread board. hub_events storage.
│   ├── AgreementsView.jsx            # 4 active forms. jpg_agreements_{username} storage. Prospect form_001 submission triggers credential generation + session upgrade. CoachDetailView and ClientAgreementsView are function components defined inside this file — not separate files.
│   ├── EducationView.jsx             # Two-level nav. 5 categories, 12 docs.
│   ├── ClientViewMode.jsx
│   ├── PlaceholderView.jsx
│   └── tabs/
│       ├── MessagesTab.jsx
│       ├── AnnouncementsTab.jsx
│       └── ScheduledTab.jsx
├── src/
│   ├── components/
│   │   ├── TrackingTechView.jsx      # Three-tab spoke view. Non-standard import path — cleanup at migration.
│   │   └── InterfacePreferenceView.jsx  # Shell — title, description, coming-soon block; props: { user }
│   └── data/
│       └── trackingTechData.js       # TRACKING_TECH_DATA export. 816 lines. No localStorage.
├── utils/
│   ├── constants.js                  # GOLD, GOLD_LIGHT, DARK, DARKER, BORDER_DK, TEXT_DIM, NAV_ITEMS, SPOKE_URLS
│   └── styles.js                     # S object — shared style tokens
├── services/
│   ├── clients.js                    # getClients, updateClient, createClientRecord, generateUsername, generatePassword, addClient, login, logout
│   └── storage.js                    # getSession, saveSession, logoutService
├── public/
│   ├── jpglogo.png                   # Center circle logo — replace with transparent PNG when available
│   ├── agreement-forms/              # 4 active agreement PDFs (form_001, form_002, form_003, form_005)
│   └── edu-docs/                     # 12 education PDFs
└── CLAUDE.md

---

## STORAGE KEYS

| Key | Owner | Description |
|---|---|---|
| hub_clients | ClientsView, SlidePanel, WheelView | Array of all client objects |
| hub_session | Login, HUBApp | Current logged-in user session |
| hub_messages | MessagesTab | Array of message thread objects |
| hub_announcements | AnnouncementsTab | Array of announcement objects |
| hub_scheduled | ScheduledTab | Array of scheduled items |
| hub_scheduled_completed | ScheduledTab | Archive of completed/cancelled items |
| hub_events | EventsBoardView | Array of event thread objects |
| jpg_agreements_{username} | AgreementsView, SlidePanel, WheelView | Per-client agreement state — 4 active forms: form_001, form_002, form_003, form_005 |

InterfacePreferenceView has no localStorage access.

**Retired form keys (do not reference):** form_004 (Program Agreement — retired 08/24/2026), form_006 (Client Information — retired 08/24/2026)

---

## LOGIN ROLES (services/clients.js — confirmed in code 08/25/2026)

Three login checks in order:

| Check | Credentials | Role | Session shape |
|---|---|---|---|
| 1. Coach | Doug / JPG2026 | coach | { id: 'coach_001', role: 'coach', username: 'Doug' } |
| 2. Prospect | prospect / JPG2026 | prospect | { id: 'prospect_001', role: 'prospect', username: 'prospect' } |
| 3. Client | generated credentials | client | { id, role: 'client', username, first_name, last_name } |

Prospect is a shared generic login. No real client record exists in hub_clients for prospect. isSpokeUnlocked() short-circuits for prospect role — returns true only for communication and agreements, false for all other spokes.

---

## CLIENT RECORD SHAPE (createClientRecord — confirmed in code 08/25/2026)

```js
{
  id, role: 'client', first_name, last_name, username, password,
  phone, email, program_start_date, tracking_start_date: null,
  current_cycle_start: null, onramp_end: null,
  tier: 4, tier_name: 'Apprentice', cap_override_minutes: null,
  obt_unlocked: false,          // approval gate is the only path — changed 08/25/2026
  dop_unlocked: false,
  pit_unlocked: false,
  edu_unlocked: true,           // set to true by handleApproval
  comms_unlocked: true,
  agreements_unlocked: true,
  eventsboard_unlocked: true,
  daily_unlocked: true,
  resources_unlocked: true,
  interface_unlocked: false,    // added 08/25/2026
  client_approved: false,       // added 08/25/2026
}
```

---

## ACTIVE FORM KEYS (AgreementsView — confirmed in code 08/24/2026)

| Key | Label |
|---|---|
| form_001 | Client Application (43 fields, 10 sections) |
| form_002 | Program Overview & Agreement (14 fields, 6 static text blocks) |
| form_003 | Liability Waiver & Disclaimer |
| form_005 | Photo / Testimonial Release |

countComplete() iterates activeKeys = ['form_001','form_002','form_003','form_005'] only.
agreementsComplete() in both SlidePanel and WheelView uses keys ['form_001','form_002','form_003','form_005'].
Completion count displays as "of 4 complete" in all 3 locations.

---

## PROSPECT FORM_001 SUBMISSION FLOW (AgreementsView — built 08/25/2026)

When role === 'prospect' and form_001 is submitted:
1. generateUsername and generatePassword called with form_001 data
2. createClientRecord called — pre-populated with form_001 data
3. addClient adds record to hub_clients
4. jpg_agreements_prospect copied to jpg_agreements_{newUsername} in localStorage
5. onSessionUpgrade called → upgradeSession in HUBApp updates hub_session and user state
6. Credential banner displayed — position fixed, zIndex 1000, full-screen modal
7. Banner dismissed by "I HAVE SAVED MY CREDENTIALS" button only — not auto-dismissed

---

## ACTIVE VIEW ROUTING (HUBApp renderView — updated 08/25/2026)

| activeView | Component | Notes |
|---|---|---|
| 'wheel' | WheelView | role normalized: prospect → 'client' |
| 'clients' | ClientsView | |
| 'communication' | CommunicationView | |
| 'fullprofile' | FullProfileView | |
| 'reports' | ReportsView | |
| 'settings' | PlaceholderView | |
| 'eventsboard' | EventsBoardView | |
| 'agreements' | AgreementsView | receives onSessionUpgrade={upgradeSession} |
| 'edu' | EducationView | |
| 'tracker' | TrackingTechView | |
| 'interface' | InterfacePreferenceView | |
| 'clientview' | ClientViewMode | |
| anything else | null | |

---

## SPOKE ROUTING (WheelView spokeClick)

Internal routes (do NOT add to SPOKE_URLS):
| spokeId | Routes to |
|---|---|
| communication | onNavigate('communication') |
| eventsboard | onNavigate('eventsboard') |
| agreements | onNavigate('agreements') |
| edu | onNavigate('edu') |
| daily | onNavigate('tracker') |
| interface | onNavigate('interface') |

External routes (SPOKE_URLS — appends ?hub_user param for HUB_AUTH_SPOKES):
- dop → localhost:5173
- pit → localhost:5174
- tracker → localhost:5175

HUB_AUTH_SPOKES: dop, pit, tracker

Do NOT add to SPOKE_URLS: agreements, eventsboard, edu, communication, daily, interface

---

## WHEEL VIEW — SPOKE VISUAL TIERS

Two visual tiers built 08/20/2026. Applied per spokeId in SVG circle elements directly.

**Working spokes** — fill: #1C3A5C | stroke: #B8860B
Spokes: dop, pit, tracker, communication, agreements, interface

**Reference/community spokes** — fill: #0F2238 | stroke: #6B5E2E
Spokes: edu, eventsboard, daily, resources

All strokes: strokeWidth 2, solid. No dashed lines on any active spoke.

---

## AGREEMENTS GATING (confirmed in code 08/25/2026)

GATED_SPOKE_IDS (WheelView): new Set(['dop', 'pit', 'daily', 'resources'])

GATED_SPOKES (SlidePanel): new Set(['dop_unlocked', 'pit_unlocked', 'daily_unlocked', 'resources_unlocked'])

edu removed from both gating sets 08/25/2026 — Education now controlled by client_approved flag via handleApproval.
eventsboard_unlocked: removed from both gating sets 08/22/2026.
interface_unlocked: never in gating sets. Interface Preference always freely accessible.

Exempt from gating (always accessible): tracker, communication, agreements, interface, eventsboard, edu (approval-controlled)

agreementsComplete() checks jpg_agreements_{username} — all 4 active forms .submitted === true.

SPOKE_LABELS (SlidePanel — 10 entries, confirmed in code 08/25/2026):
interface_unlocked present | eventsboard_unlocked present but NOT in GATED_SPOKES | edu_unlocked present but NOT in GATED_SPOKES

---

## APPROVAL GATE (SlidePanel — built 08/25/2026)

handleApproval() — APPROVE CLIENT button above spoke toggles.

APPROVE writes: client_approved: true, obt_unlocked: true, edu_unlocked: true, program_start_date: todayISO()
REVOKE writes: client_approved: false, obt_unlocked: false, edu_unlocked: false, program_start_date: null

obt_unlocked default is false — handleApproval is the only path to OBT unlock.
edu_unlocked is set by approval, not by coach spoke toggle or agreements gate.

---

## EDUCATION SPOKE (EducationView.jsx)

5 categories, 12 docs. PDFs in public/edu-docs/.

| id | Label | Docs |
|---|---|---|
| app_systems | APP OPERATING SYSTEMS | 4 |
| training | TRAINING & PHYSICAL PERFORMANCE | 1 |
| lifestyle | LIFESTYLE & BEHAVIOR | 2 |
| program_foundations | PROGRAM FOUNDATIONS | 5 |
| industry_articles | CURRENT INDUSTRY ARTICLES | 0 (placeholder) |

Adding docs: one object to category docs array. No component rebuild needed.

---

## TRACKING & TECHNOLOGY SPOKE (TrackingTechView.jsx + trackingTechData.js)

Import path: HUBApp imports from '../src/components/TrackingTechView' — non-standard, cleanup at Supabase migration.

3 tabs: WEARABLES / APPS / RECOMMENDATIONS (placeholder).
Data: TRACKING_TECH_DATA — 4 wearable categories (16 items), 6 app categories (38 items).
Slide panel: 9 fields per item. tutorialLink = "" on all — populate when URLs ready.
No localStorage. Gated behind agreements completion.

---

## INTERFACE PREFERENCE SPOKE (InterfacePreferenceView.jsx)

Shell only — no selection logic built yet.
Props: { user }. No localStorage.
Routing: 'interface' case in renderView() → InterfacePreferenceView.
flagMap entry: interface → 'interface_unlocked'.
Spoke position: cx=360, cy=645 (bottom-center). Working spoke tier (#1C3A5C / #B8860B).
Always freely accessible — exempt from agreements gating and phase gating.
Future build: Open/Guided/Structured version selection, two-path flow, snippet previews.

---

## LOCKED DECISIONS

- Two-tier gold system: GOLD_LIGHT (#ddb94a) = clickable/action. GOLD (#B8860B) = informational.
- Never define local color constants. Always import from utils/constants.
- HUB owns all cycle and tier data. Spokes read-only except OBT writing tracking_start_date.
- program_start_date auto-set by handleApproval on coach approval. Never changes after set.
- Phase gating: foundation (days 1–14) and analysis (days 15–21) block DOP and PIT for clients.
- Day 22 auto-promotion: tier 4 → tier 3 (Performance). Self-guarding.
- TrackingTechView and InterfacePreferenceView live in src/components/ — do not move without updating HUBApp import path.
- Spoke visual tiers locked: working (#1C3A5C/#B8860B), reference (#0F2238/#6B5E2E).
- Interface Preference spoke always freely accessible. Must not be in GATED_SPOKE_IDS or GATED_SPOKES.
- Desired Outcomes is correct terminology throughout — not Goals. Applies to all form labels and display text.
- styles.js S.viewArea: overflowY auto. S.appShell: overflow auto. Do not revert to hidden.
- Active forms are form_001, form_002, form_003, form_005. form_004 and form_006 are retired — do not reference.
- countComplete() must iterate activeKeys only — never Object.values() of all agreements keys.
- CoachDetailView and ClientAgreementsView are function components inside AgreementsView.jsx — not separate files.
- obt_unlocked defaults to false. APPROVE CLIENT is the only path to OBT unlock — not the spoke toggle.
- client_approved and interface_unlocked are fields in every client record — both default false.
- Prospect role: shared login, no client record in hub_clients. isSpokeUnlocked short-circuits — communication and agreements only.
- Stage 3 auto-unlock deferred to post-Supabase. No obt_complete flag exists pre-Supabase.

---

## PHASE GATING RULES

getCyclePhase(hubUser) — reads hub_clients, computes cycleDay from tracking_start_date.

| Days | Phase |
|---|---|
| 1–14 | foundation |
| 15–21 | analysis |
| 22–30 | onramp |
| 31+ | full |
| No date | null |

isSpokeUnlocked() — prospect short-circuit first, then phase gate (dop/pit only), then agreements gate (GATED_SPOKE_IDS). Coach always unrestricted.

---

## COLOR CONSTANTS (utils/constants.js)

| Constant | Value | Use |
|---|---|---|
| GOLD | #B8860B | Informational/non-interactive |
| GOLD_LIGHT | #ddb94a | Clickable/action elements |
| DARK | #1a1a2e | Primary background |
| DARKER | #12121f | Secondary/panel background |
| BORDER_DK | #2a2a4a | Borders |
| TEXT_DIM | #888 | Secondary/muted text |
