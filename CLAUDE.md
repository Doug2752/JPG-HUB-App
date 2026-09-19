# HUB — CLAUDE.md
## Workspace Hub — Claude Code Operating Reference
**Version:** v3.0 | **Date:** 09/18/2026
**Repo:** Doug2752/JPG-HUB-App
**Local:** C:\JPG-PROJECTS\JPG-HUB-App

---

## SCOPE AND PURPOSE

HUB is the coach-side and client-side control center for Jones Performance Group LLC. The wheel is the primary navigation hub — 10 spokes, each routing to a spoke view or external app. All spoke views accept an `onBack` prop wired to `handleViewChange('wheel')` in HUBApp. The Education spoke includes a Downloads tab (placeholder — no content wired). Wheel spoke positions reorganized: RECOMMENDATIONS & TECHNOLOGY (spokeId 'daily') at cx=89, cy=272; EVENTS BOARD (spokeId 'eventsboard') at cx=89, cy=448; FUTURE/BACKEND ADDITION (spokeId 'resources') at cx=192, cy=591.

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
| HUB | 5179 | 5177 |
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
│   ├── WheelView.jsx                 # 10-spoke SVG wheel. Two visual tiers. Phase + agreements gating. Prospect short-circuit in isSpokeUnlocked. Communications spoke opacity pulse (@keyframes commsPulse) when client has unread content — clears on spoke click. PIT_URLS and DOP_URLS stub maps at module scope — client DOP/PIT clicks route based on interface_preference (ADDED 08/28/2026).
│   ├── ClientsView.jsx
│   ├── SlidePanel.jsx                # 420px right panel. APPROVE/REVOKE APPROVAL button. Agreements gating on 4 spokes. 10 SPOKE_LABELS entries.
│   ├── FullProfileView.jsx           # 5-section read-only profile. USERNAME and PASSWORD rendered in PROGRAM STATUS section. APP INTERFACE PREFERENCE row with coach override dropdown — saves immediately via updateClient (ADDED 08/28/2026). useState/useEffect hooks before early return (hooks-order fix 08/28/2026).
│   ├── CommunicationView.jsx         # 282 lines. Owns all state. 3-tab bar. isClient role check. getSeen/saveSeen/computeUnread helpers — reads/writes hub_comms_seen_{username}. Gold dot on tab labels when unread. Passes isClient and clientId to all three tab components. Tab bar container borderBottom REMOVED (09/19/2026). Props: { user, onBack }.
│   ├── ReportsView.jsx
│   ├── EventsBoardView.jsx           # Full forum-style thread board. hub_events storage.
│   ├── AgreementsView.jsx            # 4 active standard forms + optional form_007 (Promotional Discount Program Agreement). jpg_agreements_{username} storage. Prospect form_001 submission triggers credential generation + session upgrade. CoachDetailView, ClientAgreementsView, Form007View, and ClientBillingSection are function components defined inside this file — not separate files. ClientBillingSection renders below form rows in ClientAgreementsView — reads hub_billing_{username}, generates invoice table, read-only, renders nothing if record absent. TI, CB, TA helper components defined at module scope (NOT inside Form007View — causes focus loss if defined inside).
│   ├── EducationView.jsx             # Two-level nav. 5 categories, 13 docs. Props: { user, onBack }. TABS: ['categories', 'downloads']. Downloads tab renders "Downloads coming soon." — no content wired.
│   ├── ClientViewMode.jsx
│   ├── PlaceholderView.jsx
│   ├── TK007GeneratorView.jsx        # Coach-only PDF generator for TK-007 Promotional Discount Program Agreement. Located in components/ (NOT src/components/). Imported in AgreementsView.jsx as './TK007GeneratorView'.
│   ├── BillingSetupView.jsx          # Coach-side billing setup. Props: { client, onSave, onBack }. Storage key: hub_billing_{username}. Renders inside SlidePanel BILLING tab.
│   └── tabs/
│       ├── MessagesTab.jsx           # Coach view: multi-client checkbox messaging. Client view: single thread full-width, SEND bar, handleClientSendMessage. Props include isClient and clientId. Instruction bar borderTop changed from GOLD to BORDER_DK at all three instances (09/19/2026).
│       ├── AnnouncementsTab.jsx      # Coach view: list + form + detail panel. Client view: read-only sorted list. Props include isClient and clientId.
│       └── ScheduledTab.jsx          # Full status system (UPDATED 08/28/2026). STATUS_BORDER constant. All items remain in hub_scheduled with status field (pending/completed/cancelled/rescheduled). hub_scheduled_completed RETIRED. handleComplete/handleCancel rewritten to update in place. StatusLegend multi-select filter in coach and client views. Full border cards, marginBottom 8, borderRadius 5, sort descending. Status badge inline with title. Type badge nowrap. Online Video label updated.
├── src/
│   ├── components/
│   │   ├── TrackingTechView.jsx      # Three-tab spoke view. Non-standard import path — cleanup at migration.
│   │   └── InterfacePreferenceView.jsx  # Phase Two COMPLETE (UPDATED 08/28/2026). Full selection logic — OBT-style BrandBar, explainer block, three interface cards (Open/Guided/Structured), hub_clients read/write for interface_preference field, default-to-structured when field absent, StatusLegend multi-select filter. Props: { user, onBack }.
│   └── data/
│       └── trackingTechData.js       # TRACKING_TECH_DATA export. 816 lines. No localStorage.
├── utils/
│   ├── constants.js                  # GOLD, GOLD_LIGHT (#ddb94a — ADDED 08/28/2026), DARK, DARKER, BORDER_DK, TEXT_DIM, TEXT_MID, RED, GREEN, BORDER_LT, CHAR, TEXT_ROLE, LOGO, NAV_ITEMS, SPOKE_URLS
│   └── styles.js                     # S object — shared style tokens
├── services/
│   ├── clients.js                    # getClients, updateClient, createClientRecord, generateUsername, generatePassword, addClient, login, logout
│   └── storage.js                    # getSession, saveSession, logoutService
├── public/
│   ├── jpglogo.png                   # Center circle logo — replace with transparent PNG when available
│   ├── agreement-forms/              # PDFs on disk: TK-001, TK-002, TK-003, TK-004 (legacy — retired, do not reference), TK-005. No TK-006. No TK-007 PDF — generated dynamically via pdf-lib in TK007GeneratorView.
│   └── edu-docs/                     # 12 education PDFs
└── CLAUDE.md
JPG-HUB-App-main/                     # Legacy archive folder in repo root — do not modify contents.

---

## STORAGE KEYS

| Key | Owner | Description |
|---|---|---|
| hub_clients | ClientsView, SlidePanel, WheelView, InterfacePreferenceView, FullProfileView | Array of all client objects |
| hub_session | Login, HUBApp | Current logged-in user session |
| hub_messages | MessagesTab | Array of message thread objects |
| hub_announcements | AnnouncementsTab | Array of announcement objects |
| hub_scheduled | ScheduledTab | ALL scheduled items — pending, completed, cancelled, rescheduled. Status field on every item. hub_scheduled_completed RETIRED 08/28/2026. |
| hub_events | EventsBoardView | Array of event thread objects |
| jpg_agreements_{username} | AgreementsView, SlidePanel, WheelView | Per-client agreement state — 4 active forms: form_001, form_002, form_003, form_005. Optional form_007 entry present only if coach sent it to that client. |
| hub_comms_seen_{username} | CommunicationView (direct localStorage), WheelView | Per-client last-seen timestamps for unread tracking. Shape: { messages: isoString\|null, announcements: isoString\|null, scheduled: isoString\|null } |
| hub_billing_{username} | BillingSetupView (write), ClientBillingSection (read) | Billing profile per client. Written by BillingSetupView on SAVE. Read by ClientBillingSection — read-only invoice table rendered in client agreements view. |

**RETIRED 08/28/2026:** hub_scheduled_completed — do not read or write. All scheduled data lives in hub_scheduled with status field.

InterfacePreferenceView reads and writes hub_clients (interface_preference field).

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

## CLIENT RECORD SHAPE (createClientRecord — updated 08/28/2026)

```js
{
  id, role: 'client', first_name, last_name, username, password,
  phone, email, program_start_date, tracking_start_date: null,
  current_cycle_start: null, onramp_end: null,
  tier: 4, tier_name: 'Apprentice', cap_override_minutes: null,
  interface_preference: null,   // open|guided|structured|null — ADDED 08/28/2026
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

## ACTIVE FORM KEYS (AgreementsView — confirmed in code 08/27/2026)

| Key | Label | Type |
|---|---|---|
| form_001 | Client Application (43 fields, 10 sections) | Standard — always present |
| form_002 | Program Overview & Agreement (14 fields, 6 static text blocks) | Standard — always present |
| form_003 | Liability Waiver & Disclaimer | Standard — always present |
| form_005 | Photo / Testimonial Release | Standard — always present |
| form_007 | Promotional Discount Program Agreement | Optional — coach sends per client |

countComplete() iterates activeKeys = ['form_001','form_002','form_003','form_005'] only. form_007 does NOT count toward completion total.
agreementsComplete() in WheelView checks for form_007 first: if data['form_007']?.submitted === true, required keys are ['form_001', 'form_003', 'form_005', 'form_007']; otherwise standard set ['form_001', 'form_002', 'form_003', 'form_005']. Promotional clients who have signed form_007 satisfy the agreements gate without form_002. SlidePanel does not call agreementsComplete() — gating there uses GATED_SPOKES flag checks only.
Completion count displays as "of 4 complete" in all 3 locations — unchanged by form_007.

form_007 is NOT in the FORMS constant array. Routing handled by ClientFormView null guard: `if (!formDef || formDef.key === 'form_007')` → Form007View. formDef null-safe: `const fields = formDef ? (FORM_FIELDS[formDef.key] || []) : []` and `useEffect(..., [formDef?.key])`.

PROMOTION_TYPES constant (6 entries A–F) defined at module scope in AgreementsView.jsx.

form_007 is NOT in the FORMS constant array — it is handled separately via TK007GeneratorView (coach side) and ClientFormView null guard (client side). Do not add form_007 to FORMS.

---

## PROSPECT FORM_001 SUBMISSION FLOW (AgreementsView — built 08/25/2026, updated 09/15/2026)

Flow is now owned end-to-end by `Form001View`. The prospect upgrade branch has been removed from `handleFormSubmitted` in `ClientAgreementsView` — `handleFormSubmitted` is now a single-line `setActiveForm(null)`. `handleForm001Upgrade(session, credentials)` is the wrapper in `ClientAgreementsView` that receives the two-arg call from `Form001View`, stores credentials for the banner, then calls the external single-arg `onSessionUpgrade(session)` upstream to HUBApp.

When role === 'prospect' and form_001 is submitted:
1. generateUsername and generatePassword called with form_001 data
2. createClientRecord called — pre-populated with form_001 data
3. addClient adds record to hub_clients
4. jpg_agreements_prospect copied to jpg_agreements_{newUsername} in localStorage
5. Form001View calls onSessionUpgrade(session, credentials) — two args
6. handleForm001Upgrade in ClientAgreementsView receives both args: stores credentials, shows banner, calls external onSessionUpgrade(session) — one arg
7. upgradeSession in HUBApp updates hub_session and user state
8. Credential banner displayed — position fixed, zIndex 1000, full-screen modal
9. Banner dismissed by "I HAVE SAVED MY CREDENTIALS" button only — not auto-dismissed

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

**Client DOP/PIT routing (ADDED 08/28/2026):** When role === 'client' and spokeId is 'dop' or 'pit', spokeClick reads interface_preference from hub_clients and routes via PIT_URLS or DOP_URLS map. Defaults to 'structured' when field absent. Coach clicks bypass intercept — always use SPOKE_URLS directly. IS_PROD = import.meta.env.PROD. APP_BASE = https://app.jonesperformancegroup.org. PIT_URLS: structured=5174, guided=5175, open=5176 (prod: /pit, /pit-guided, /pit-open). DOP_URLS: all versions=5173 (prod: /dop, /dop-guided, /dop-open). Updated 09/07/2026.

Do NOT add to SPOKE_URLS: agreements, eventsboard, edu, communication, daily, interface

---

## WHEEL VIEW — SPOKE VISUAL TIERS

Two visual tiers built 08/20/2026. Applied per spokeId in SVG circle elements directly.

**Working spokes** — fill: #1C3A5C | stroke: #B8860B
Spokes: dop, pit, tracker, communication, agreements, interface

**Reference/community spokes** — fill: #0F2238 | stroke: #6B5E2E
Spokes: edu, eventsboard, daily, resources

All strokes: strokeWidth 2, solid. No dashed lines on any active spoke.

**Left-side spoke positions (UPDATED 09/19/2026):**
| spokeId | Label | cx | cy |
|---|---|---|---|
| daily | RECOMMENDATIONS & TECHNOLOGY / TOOLS | 89 | 272 |
| eventsboard | EVENTS BOARD / COMMUNITY | 89 | 448 |
| resources | FUTURE / BACKEND / ADDITION | 192 | 591 |
| interface | APP INTERFACE PREFERENCE | 360 | 645 (unchanged) |

---

## AGREEMENTS GATING (confirmed in code 08/25/2026)

GATED_SPOKE_IDS (WheelView): new Set(['dop', 'pit', 'daily', 'resources'])

GATED_SPOKES (SlidePanel): new Set(['dop_unlocked', 'pit_unlocked', 'daily_unlocked', 'resources_unlocked'])

edu removed from both gating sets 08/25/2026 — Education now controlled by client_approved flag via handleApproval.
eventsboard_unlocked: removed from both gating sets 08/22/2026.
interface_unlocked: never in gating sets. Interface Preference always freely accessible.

Exempt from gating (always accessible): tracker, communication, agreements, interface, eventsboard, edu (approval-controlled)

agreementsComplete() checks jpg_agreements_{username} — if form_007 is submitted, required keys are ['form_001', 'form_003', 'form_005', 'form_007']; otherwise ['form_001', 'form_002', 'form_003', 'form_005']. Promotional clients bypass form_002 when form_007 is signed (UPDATED 09/14/2026).

SPOKE_LABELS (SlidePanel — 10 entries, confirmed in code 08/25/2026):
interface_unlocked present | eventsboard_unlocked present but NOT in GATED_SPOKES | edu_unlocked present but NOT in GATED_SPOKES

---

## APPROVAL GATE (SlidePanel — built 08/25/2026)

handleApproval() — APPROVE CLIENT button above spoke toggles.

APPROVE writes: client_approved: true, obt_unlocked: true, edu_unlocked: true, program_start_date: todayISO()
REVOKE writes: client_approved: false, obt_unlocked: false, edu_unlocked: false, program_start_date: null

obt_unlocked default is false — handleApproval is the only path to OBT unlock.
edu_unlocked is set by approval, not by coach spoke toggle or agreements gate.
handleToggleSpoke DOP/PIT branch (ADDED 09/07/2026 — BUG-HUB-01 fix): When flagKey is dop_unlocked or pit_unlocked and isUnlocking is true, writes { [flagKey]: true, interface_unlocked: true } in one updateClient call. Interface Preference spoke auto-unlocks when coach unlocks DOP or PIT.

---

## EDUCATION SPOKE (EducationView.jsx)

5 categories, 13 docs. PDFs in public/edu-docs/.

| id | Label | Docs |
|---|---|---|
| app_systems | APP OPERATING SYSTEMS | 4 |
| training | TRAINING & PHYSICAL PERFORMANCE | 1 |
| lifestyle | LIFESTYLE & BEHAVIOR | 3 |
| program_foundations | PROGRAM FOUNDATIONS | 5 |
| industry_articles | CURRENT INDUSTRY ARTICLES | 0 (placeholder) |

Adding docs: one object to category docs array. No component rebuild needed.

**Component details (UPDATED 09/19/2026):**
Signature: `{ user, onBack }`. Wired in HUBApp.jsx: `onBack={() => handleViewChange('wheel')}`.
`TABS` constant: `['categories', 'downloads']`. `activeTab` state: `useState('categories')`.
Downloads tab: renders centered italic "Downloads coming soon." — no content wired yet.
Back button: `{onBack && <button onClick={onBack} style={backBtnStyle}>← BACK</button>}`.

---

## TRACKING & TECHNOLOGY SPOKE (TrackingTechView.jsx + trackingTechData.js)

Import path: HUBApp imports from '../src/components/TrackingTechView' — non-standard, cleanup at Supabase migration.

3 tabs: WEARABLES / APPS / RECOMMENDATIONS (placeholder).
Data: TRACKING_TECH_DATA — 4 wearable categories (16 items), 6 app categories (38 items).
Slide panel: 9 fields per item. tutorialLink = "" on all — populate when URLs ready.
No localStorage. Gated behind agreements completion.

---

## INTERFACE PREFERENCE SPOKE (InterfacePreferenceView.jsx — UPDATED 09/07/2026)

Phase Two build COMPLETE. Full selection logic built.
Props: { user, onBack }. Wired in HUBApp.jsx: `onBack={() => handleViewChange('wheel')}`.
Storage: reads and writes hub_clients — field: interface_preference (open|guided|structured|null).
Default: 'structured' when field is null or absent — display default only, no write on init.
Three interface cards: Open, Guided, Structured. OBT-style BrandBar. Explainer block.
Button states: CURRENT SELECTION (GOLD_LIGHT, disabled, selected), SELECT (#e8e8e8, unselected, allowed), LOCKED (#f5f5f5, disabled, period-locked).
isChangeAllowed() — reads current_cycle_start from hub_clients, computes cycleDay, returns true when cycleDay > 30 or no cycle started. Period-lock: SELECT shows as LOCKED and disabled during active period days 1–30. Selection only allowed at period close day 31+. const allowed = isChangeAllowed() computed once per card render.
Routing: 'interface' case in renderView() → InterfacePreferenceView.
flagMap entry: interface → 'interface_unlocked'.
Spoke position: cx=360, cy=645 (bottom-center). Working spoke tier (#1C3A5C / #B8860B).
Always freely accessible — exempt from agreements gating and phase gating.
Real screenshots wired — /assets/pit-structured.png, /assets/pit-guided.png, /assets/pit-open.png. screenshotBox: 300x340, overflowY scroll. INTERFACES order: structured first, guided second, open third.
Coach override: FullProfileView PROGRAM STATUS section — dropdown saves immediately via updateClient.

---

## SCHEDULED COMMUNICATIONS STATUS SYSTEM (ScheduledTab.jsx — UPDATED 08/28/2026)

STATUS_BORDER constant: pending=GOLD, completed=GREEN, cancelled=RED, rescheduled='#888'
STATUS_LABELS constant: pending='UPCOMING', completed='COMPLETED', cancelled='CANCELLED', rescheduled='RESCHEDULED'

All items remain in hub_scheduled — items never move to archive on status change.
hub_scheduled_completed: FULLY RETIRED. Zero reads or writes. getCompletedItems/saveCompletedItems removed.

handleSaveScheduled: new items include status: 'pending'.
handleComplete: writes status:'completed', completed_at, completion_notes in place.
handleCancel: writes status:'cancelled', completed_at, completion_notes in place.
handleReschedule: adds status:'rescheduled' to item.

StatusLegend component: props { activeFilters, onToggle }. Multi-select. Filled solid when active, border-only when inactive. Rendered above card list in both coach and client views.
activeFilters state: useState([]) — string array. toggleFilter handler.
Filtered list: activeFilters.length === 0 → all items. Otherwise filter by status match.

Card rendering: full border 2px solid STATUS_BORDER[status]. marginBottom:8. borderRadius:5.
Sort: descending by date in both coach and client views.
Status badge: inline with title, fontSize 9, outlined in STATUS_BORDER color, text from STATUS_LABELS.
Type badge: whiteSpace:'nowrap'.
SCHED_TYPES: 'Online Video (Teams / Zoom)' renamed to 'Online Video'.

---

## TK-007 PROMOTIONAL AGREEMENT GENERATOR (ADDED 09/14/2026)

**Component:** `components/TK007GeneratorView.jsx` — located in components/ NOT src/components/. Import in AgreementsView.jsx: `import TK007GeneratorView from './TK007GeneratorView'`

**Purpose:** Coach-only component. Generates a configured TK-007 Promotional Discount Program Agreement PDF for a specific client. Client never sees other promo types — only the selected type renders in Sections 5 and 6.

**Props:** `{ client }` — requires client object with `username`, `first_name`, `last_name` fields.

**Placement:** Rendered inside `CoachDetailView` in `AgreementsView.jsx` after the `FORMS.map()` block. Render condition: `client.agreements_unlocked === true`.

**Import in AgreementsView.jsx (line 4):**
`import TK007GeneratorView from './TK007GeneratorView';`

**State variables:**
- `clientName` — string, blank on init. Coach enters manually.
- `effectiveDate` — string, blank on init.
- `promoType` — string, blank on init. Single select A–F.
- `promoRate` — string, blank on init. Only used when promoType === 'C'.
- `generating` — boolean. Button disabled and labeled GENERATING... while PDF builds.
- `generated` — boolean. True after successful generation. Resets on any field change.

**PROMO_TYPES (six entries):**
- A — Full Scholarship ($0)
- B — Two Month Trial ($0 months 1-2, then $1,500/mo)
- C — Reduced Rate (custom) — triggers promoRate field
- D — Greatness Prepay ($9,450 — 7 months)
- E — Unstoppable Prepay ($13,500 — 10 months)
- F — Friends & Family ($500/mo)

**PDF Generation (pdf-lib):**
- Library: pdf-lib 1.17.1
- Logo: imported via Vite asset import `import logoUrl from '../assets/jpglogo.png'` — fetched and embedded as PNG
- Logo file location: `src/assets/jpglogo.png`
- Fonts: HelveticaBold (fB), Helvetica (fR), HelveticaOblique (fI)
- Page size: US Letter (612 x 792pt)
- Continuous page flow — no forced page breaks. checkPage(needed) triggers addPageWithFooter() when y < 60 + needed.
- addPageWithFooter() — page 1: y starts at 750, manual header block draws after. Pages 2+: compact header draws (logo 120x50 at x:50,y:745, doc ID at y:728, rule at y:718), y set to 700.
- Footer: centered at y:20 on every page — "JPG-TK-007-PromotionalAgreement-WRK-v1.1 | Jones Performance Group LLC | Promotional Discount Program Agreement | CONFIDENTIAL | Page N"
- All 12 sections built in order: Parties & Effective Date, Agreement Basis, Scope of Service, Tier Structure & Progression, Promotional Terms (suppressed), Financial Terms Promotional (suppressed), Time Commitment, Client Commitment Statement, Program Acknowledgments, IP & Confidentiality, Dispute Resolution, Acknowledgment & Execution.
- pdfSafe() helper — replaces em dash and en dash with plain hyphens before drawing text.

**Suppression logic (CRITICAL):**
- Section 5 and Section 6 each contain independent if/else if blocks keyed on promoType.
- Only the block matching the selected promoType renders. All other type blocks are omitted entirely.
- Client never sees other promotional options.
- Type C in Section 5 additionally renders the coach-entered promoRate field value.

**Output filename:** `JPGTK007-[clientName-hyphenated]-[effectiveDate].pdf`

**localStorage write — on successful generation:**
- Key: `jpg_agreements_{client.username}`
- Writes form_007 object: `{ sent: true, sentDate: ISO string, promoType, clientName, effectiveDate }`
- Spreads existing agreements record — does not overwrite other form keys.

**Success message:** Green text below Generate button — "Agreement generated and sent to client agreements spoke." Resets to false on any field change.

**GENERATE AGREEMENT button:** Disabled until all required fields filled (promoRate required only when Type C). Shows GENERATING... and disables while PDF is building.

---

## DYNAMIC FORM COMPONENTS (AgreementsView.jsx — ADDED 09/15/2026)

All five client-facing form views are function components defined inside `components/AgreementsView.jsx`. Each bypasses the generic `ClientFormView` field renderer via an early-return routing guard.

- **Form007View** — client-facing TK-007 Promotional Discount Agreement. Reads form_007 sent state from `jpg_agreements_{username}`. Props: `{ entry, username, onBack, onSubmitted }`
- **Form002View** — client-facing TK-002 Program Application & Commitment Statement. Props: `{ entry, username, onBack, onSubmitted }`
- **Form001View** — client-facing TK-001 Client Intake & Application. Prospect submission triggers credential generation and session upgrade via `handleForm001Upgrade`. Props: `{ entry, username, onBack, onSubmitted, onSessionUpgrade, userRole }`
- **Form005View** — client-facing TK-005 Photo / Testimonial Release. Section 2 and 3 checkboxes are optional multi-select. Props: `{ entry, username, onBack, onSubmitted }`
- **Form003View** — client-facing TK-003 Liability Waiver & Disclaimer. Props: `{ entry, username, onBack, onSubmitted }`

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
- CoachDetailView, ClientAgreementsView, and Form007View are function components inside AgreementsView.jsx — not separate files.
- TI, CB, TA helper components in AgreementsView.jsx must be defined at MODULE SCOPE — never inside Form007View or any other component function body. Defining them inside a component causes remount on every keystroke (focus loss bug).
- form_007 is NOT in the FORMS constant array. ClientFormView routes all five custom forms to dedicated components — the generic field renderer is bypassed for all five: form_007 → Form007View (null guard: `if (!formDef || formDef.key === 'form_007')`), form_003 → Form003View, form_005 → Form005View, form_001 → Form001View (passes onSessionUpgrade and userRole), form_002 → Form002View. formDef must be null-safe in ClientFormView: fields lookup and useEffect dependency both use optional access.
- form_007 does not count toward completion total. countComplete() activeKeys are unchanged at ['form_001','form_002','form_003','form_005']. agreementsComplete() now has conditional logic based on form_007 submission — see AGREEMENTS GATING and ACTIVE FORM KEYS sections (UPDATED 09/14/2026).
- obt_unlocked defaults to false. APPROVE CLIENT is the only path to OBT unlock — not the spoke toggle.
- client_approved and interface_unlocked are fields in every client record — both default false.
- interface_preference is a field in every client record — defaults to null (ADDED 08/28/2026).
- Prospect role: shared login, no client record in hub_clients. isSpokeUnlocked short-circuits — communication and agreements only.
- Stage 3 auto-unlock deferred to post-Supabase. No obt_complete flag exists pre-Supabase.
- hub_comms_seen_{username} is read directly via localStorage.getItem/setItem in CommunicationView — not via storage service. WheelView reads it the same way in computeUnread().
- hub_scheduled_completed is RETIRED — do not read or write it anywhere. All scheduled data lives in hub_scheduled with status field.
- Client DOP/PIT spoke clicks route via PIT_URLS/DOP_URLS based on interface_preference. Coach clicks always use SPOKE_URLS directly.

---

## BACK BUTTON STANDARD (ADDED 09/19/2026)

All spoke views accept an `onBack` prop. HUBApp.jsx wires each to `() => handleViewChange('wheel')`.

**Components wired (lines 70–80 of HUBApp renderView):**
- `AgreementsView` — passes `onBack` to both `CoachAgreementsView` and `ClientAgreementsView`. Back button in form-list view of each. Internal form detail paths use their own `onBack={() => setActiveForm(null)}` — independent.
- `ClientsView { onOpenPanel, onBack }`
- `ClientViewMode { onBack }`
- `CommunicationView { user, onBack }`
- `EventsBoardView { user, onBack }`
- `PlaceholderView { icon, label, sub, onBack }` — Settings view
- `ReportsView { user, onBack }`
- `InterfacePreferenceView { user, onBack }`
- `TrackingTechView { user, onBack }`
- `EducationView { user, onBack }`

**Exception:** `FullProfileView` uses `onBack={handleBackFromProfile}` (navigates to 'clients', not wheel) — correct behavior, not a gap. `WheelView` has no onBack — it is the wheel.

**Back button style (standard):**
`background: 'transparent', border: '1px solid #C9A84C', color: '#C9A84C', fontSize: 11, fontWeight: 700, padding: '5px 14px', borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit', alignSelf: 'flex-start'`

Margin varies: most use `margin: '10px 0 24px 16px'` | AgreementsView and TrackingTechView use `margin: '0 0 24px 0'` | CommunicationView uses `margin: '10px 0 14px 16px'` | PlaceholderView uses `margin: '10px 0 0 16px'`

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
| GOLD_LIGHT | #ddb94a | Clickable/action elements (ADDED 08/28/2026) |
| DARK | #1A1A1A | Primary background |
| DARKER | #0F0F0F | Secondary/panel background |
| BORDER_DK | #2a2a4a | Borders |
| TEXT_DIM | #888 | Secondary/muted text |
| TEXT_MID | (confirm in constants.js) | Mid-level text — used in CommunicationView, MessagesTab, AnnouncementsTab, ScheduledTab, FullProfileView |
| RED | #C0392B | Used in ScheduledTab STATUS_BORDER cancelled |
| GREEN | #2E5A4B | Used in ScheduledTab STATUS_BORDER completed |
| BORDER_LT | #CCCCCC | Light borders |
| CHAR | #3A3A3A | (confirm use) |
| TEXT_ROLE | #aaaaaa | Role/label text |

---

## VERSION HISTORY

| Version | Date | Summary |
|---|---|---|
| v2.9 | 09/19/2026 | Back button added to all spoke views — BACK BUTTON STANDARD section added. EducationView Downloads tab added (placeholder). WheelView spoke positions reorganized: daily cx=89 cy=272, eventsboard cx=89 cy=448, resources cx=192 cy=591. TK007GeneratorView.jsx location corrected to components/ (not src/components/). CommunicationView tab bar borderBottom removed. MessagesTab instruction bar borderTop changed from GOLD to BORDER_DK. SCOPE AND PURPOSE section added. CLAUDE.md discrepancies resolved. |
| v2.8 | 09/15/2026 | All five client-facing form views built and wired — Form007View, Form002View, Form001View, Form005View, Form003View. All five bypass ClientFormView generic renderer via routing guards. Form001View owns prospect upgrade flow end-to-end via handleForm001Upgrade two-arg wrapper. handleFormSubmitted simplified to single-line setActiveForm(null). DYNAMIC FORM COMPONENTS section added. |
| v2.7 | 09/14/2026 | TK-007 generator added — TK007GeneratorView.jsx new component. pdf-lib 1.17.1 installed. Coach-side PDF generation with promo type suppression. localStorage write to jpg_agreements_{username} form_007 sent state. Logo asset added to src/assets/jpglogo.png. AgreementsView.jsx import and render block added in CoachDetailView. |
