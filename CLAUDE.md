# HUB — CLAUDE.md
## Workspace Hub — Claude Code Operating Reference
**Version:** v2.0 | **Date:** 08/20/2026
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

```
JPG-HUB-App/
├── app/
│   └── HUBApp.jsx                    # Root component. renderView() routes all views.
├── components/
│   ├── Login.jsx
│   ├── Nav.jsx
│   ├── Topbar.jsx
│   ├── WheelView.jsx                 # 10-spoke SVG wheel. Two visual tiers. Phase + agreements gating.
│   ├── ClientsView.jsx
│   ├── SlidePanel.jsx                # 420px right panel. Agreements gating on 6 spokes.
│   ├── FullProfileView.jsx
│   ├── CommunicationView.jsx         # Thin shell — 210 lines. Owns state. Passes to tab components.
│   ├── ReportsView.jsx
│   ├── EventsBoardView.jsx           # Full forum-style thread board. hub_events storage.
│   ├── AgreementsView.jsx            # 5 forms. jpg_agreements_{username} storage.
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
│   ├── clients.js                    # getClients, updateClient, createClientRecord
│   └── storage.js                    # getSession, saveSession, logoutService
├── public/
│   ├── jpglogo.png                   # Center circle logo — replace with transparent PNG when available
│   ├── agreement-forms/              # 5 agreement PDFs (form_001–form_005)
│   └── edu-docs/                     # 12 education PDFs
└── CLAUDE.md
```

---

## STORAGE KEYS

| Key | Owner | Description |
|---|---|---|
| `hub_clients` | ClientsView, SlidePanel, WheelView | Array of all client objects |
| `hub_session` | Login, HUBApp | Current logged-in user session |
| `hub_messages` | MessagesTab | Array of message thread objects |
| `hub_announcements` | AnnouncementsTab | Array of announcement objects |
| `hub_scheduled` | ScheduledTab | Array of scheduled items |
| `hub_scheduled_completed` | ScheduledTab | Archive of completed/cancelled items |
| `hub_events` | EventsBoardView | Array of event thread objects |
| `jpg_agreements_{username}` | AgreementsView | Per-client agreement state (5 forms) |

InterfacePreferenceView has no localStorage access.

---

## ACTIVE VIEW ROUTING (HUBApp renderView)

| activeView | Component |
|---|---|
| 'wheel' | WheelView |
| 'clients' | ClientsView |
| 'communication' | CommunicationView |
| 'fullprofile' | FullProfileView |
| 'reports' | ReportsView |
| 'settings' | PlaceholderView |
| 'eventsboard' | EventsBoardView |
| 'agreements' | AgreementsView |
| 'edu' | EducationView |
| 'tracker' | TrackingTechView |
| 'interface' | InterfacePreferenceView |
| 'clientview' | ClientViewMode |
| anything else | null |

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

## AGREEMENTS GATING

GATED_SPOKE_IDS (WheelView): dop, pit, edu, eventsboard, daily, resources, interface

**OPEN BUG:** 'interface' must be removed from GATED_SPOKE_IDS. Interface Preference spoke is always freely accessible — not agreements-gated. Fix before client-facing release.

GATED_SPOKES (SlidePanel): same 6 keys excluding interface — audit SlidePanel to confirm.

Exempt from gating (always accessible): tracker, communication, agreements, interface

agreementsComplete() checks jpg_agreements_{username} — all 5 forms .submitted === true.

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
- program_start_date auto-set on OBT unlock. Never changes.
- Phase gating: foundation (days 1–14) and analysis (days 15–21) block DOP and PIT for clients.
- Day 22 auto-promotion: tier 4 → tier 3 (Performance). Self-guarding.
- TrackingTechView and InterfacePreferenceView live in src/components/ — do not move without updating HUBApp import path.
- Spoke visual tiers locked: working (#1C3A5C/#B8860B), reference (#0F2238/#6B5E2E).
- Interface Preference spoke always freely accessible. Must not be in GATED_SPOKE_IDS.

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

isSpokeUnlocked() — phase gate runs first (dop/pit only), then agreements gate (GATED_SPOKE_IDS). Coach always unrestricted.

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
