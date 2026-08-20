# HUB — CLAUDE.md
## Workspace Hub — Claude Code Operating Reference
**Version:** v1.9 | **Date:** 08/19/2026
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
│   └── HUBApp.jsx               # Root component — session, routing, activeView
├── components/
│   ├── Login.jsx
│   ├── Nav.jsx
│   ├── Topbar.jsx
│   ├── WheelView.jsx            # 10-spoke SVG wheel, phase gating, agreements gating
│   ├── ClientsView.jsx
│   ├── SlidePanel.jsx           # 420px client panel, spoke unlock/revoke, gating
│   ├── FullProfileView.jsx
│   ├── CommunicationView.jsx    # Thin shell — 210 lines, owns state, passes to tabs
│   ├── ReportsView.jsx
│   ├── EventsBoardView.jsx      # Full forum-style board, hub_events storage
│   ├── AgreementsView.jsx       # 5 forms, coach + client views
│   ├── EducationView.jsx        # Two-level nav, 5 categories, 12 docs
│   ├── ClientViewMode.jsx
│   ├── PlaceholderView.jsx
│   └── tabs/
│       ├── MessagesTab.jsx
│       ├── AnnouncementsTab.jsx
│       └── ScheduledTab.jsx
├── src/
│   ├── components/
│   │   └── TrackingTechView.jsx # Three-tab view: WEARABLES / APPS / RECOMMENDATIONS
│   └── data/
│       └── trackingTechData.js  # Pure data module — 816 lines, 54 items, no localStorage
├── services/
│   ├── clients.js
│   └── storage.js
├── utils/
│   ├── constants.js             # GOLD, GOLD_LIGHT, DARK, DARKER, BORDER_DK, TEXT_DIM, NAV_ITEMS, SPOKE_URLS
│   ├── styles.js
│   └── date.js
└── public/
    ├── jpglogo.png
    ├── edu-docs/                # 12 PDFs — education spoke
    └── agreement-forms/         # 5 PDFs — agreements spoke
```

**Path note:** TrackingTechView.jsx and trackingTechData.js live under `src/` — one level deeper than the standard component root. HUBApp imports TrackingTechView from `'../src/components/TrackingTechView'`. This is a known asymmetry — flag for cleanup at Supabase migration. Do not move files without Doug's direction.

---

## STORAGE KEYS

| Key | Component | Description |
|---|---|---|
| `hub_clients` | ClientsView, SlidePanel, WheelView | Array of client objects |
| `hub_session` | Login, HUBApp | Current session |
| `hub_messages` | MessagesTab | Message thread objects |
| `hub_announcements` | AnnouncementsTab | Announcement objects |
| `hub_scheduled` | ScheduledTab | Scheduled items |
| `hub_scheduled_completed` | ScheduledTab | Archived completed/cancelled items |
| `hub_events` | EventsBoardView | Event thread objects |
| `jpg_agreements_{username}` | AgreementsView, SlidePanel, WheelView | Per-client agreement state |

**trackingTechData.js uses no localStorage** — pure static data module.

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
| 'clientview' | ClientViewMode |

---

## SPOKE ROUTING (WheelView spokeClick)

| spokeId | Action |
|---|---|
| communication | onNavigate('communication') |
| eventsboard | onNavigate('eventsboard') |
| agreements | onNavigate('agreements') |
| edu | onNavigate('edu') |
| daily | onNavigate('tracker') |
| dop, pit, tracker | window.open(SPOKE_URLS[spokeId] + hub_user param) |
| resources | alert (empty URL fallback) |

**Do NOT add to SPOKE_URLS:** communication, eventsboard, agreements, edu, daily.

**HUB_AUTH_SPOKES** (bypass login via hub_user param): dop, pit, tracker.

---

## AGREEMENTS GATING

### GATED_SPOKES (SlidePanel) — flag keys
`dop_unlocked`, `pit_unlocked`, `edu_unlocked`, `eventsboard_unlocked`, `daily_unlocked`, `resources_unlocked`

### GATED_SPOKE_IDS (WheelView) — spoke ids
`dop`, `pit`, `edu`, `eventsboard`, `daily`, `resources`

### agreementsComplete(username)
Reads `jpg_agreements_{username}`. Checks all 5 form keys for `submitted === true`. try/catch returns false. Defined identically in both SlidePanel and WheelView.

### Gate behavior
- SlidePanel: UNLOCK blocked + inline italic message shown. REVOKE always allowed.
- WheelView: greyed out spoke for client when gated. Coach never gated.

---

## EDUCATION SPOKE (EducationView.jsx)

Two-level navigation. 5 categories, 12 docs.

| Category id | Label | Docs |
|---|---|---|
| app_systems | APP OPERATING SYSTEMS | 4 |
| training | TRAINING & PHYSICAL PERFORMANCE | 1 |
| lifestyle | LIFESTYLE & BEHAVIOR | 2 |
| program_foundations | PROGRAM FOUNDATIONS | 5 |
| industry_articles | CURRENT INDUSTRY ARTICLES | 0 (placeholder) |

PDFs served from `public/edu-docs/`. To add a doc: add one object to the relevant category's `docs` array in EDU_CATEGORIES. No component rebuild needed.

---

## TRACKING & TECHNOLOGY SPOKE (TrackingTechView.jsx + trackingTechData.js)

Three-tab view: WEARABLES / APPS / RECOMMENDATIONS.

### Data file structure
`src/data/trackingTechData.js` — export const TRACKING_TECH_DATA = { wearables, apps }

**Wearables:** 4 categories, 16 items.
**Apps:** 6 categories (1 with 7 sub-categories), 38 items total.
**Item fields (11):** id, name, whatItDoes, bestFor, howItWorks, ecosystemIntegrations, ecosystemValue, aiIntegration, freeOption, pricing, tutorialLink

### Navigation
- WEARABLES: category grid → item list → slide panel
- APPS flat: category grid → item list → slide panel
- APPS sub-categorized: category grid → sub-category grid → item list → slide panel
- Branch condition: `selectedCategory.subCategories.length === 0` → flat path

### Slide panel
Fixed right, 480px, overlay backdrop. Displays all 9 content fields. tutorialLink empty → "Coming soon". Closes on × or overlay click.

### To add items
Add one object to the relevant `items` array in trackingTechData.js. No component rebuild needed.

### To add tutorial links
Update `tutorialLink` field on specific items in trackingTechData.js.

### Recommendations tab
Static placeholder. Content build deferred — dedicated pass when Doug provides coach recommendations by client profile.

---

## LOCKED DECISIONS

- GOLD_LIGHT (#ddb94a) = clickable/action. GOLD (#B8860B) = informational. Never swap.
- Elements on dark nav bar get NO black border.
- agreementsComplete() logic must be identical in SlidePanel and WheelView.
- TrackingTechView slide panel is a custom inline panel — not SlidePanel.jsx.
- trackingTechData.js has no localStorage access — pure data module.
- Do not move TrackingTechView or trackingTechData to standard paths without Doug's direction.

---

## PHASE GATING RULES

| Days | Phase | DOP/PIT |
|---|---|---|
| 1–14 | foundation | locked |
| 15–21 | analysis | locked |
| 22–30 | onramp | unlocked |
| 31+ | full | unlocked |

Day 22 auto-promotion: if tier === 4 on onramp entry → updateClient({ tier: 3, tier_name: 'Performance' }).

---

## COLOR CONSTANTS (utils/constants.js)

| Constant | Hex | Use |
|---|---|---|
| GOLD | #B8860B | Headers, informational elements |
| GOLD_LIGHT | #ddb94a | Clickable/action elements |
| DARK | — | Primary dark background |
| DARKER | — | Secondary dark background |
| BORDER_DK | — | Dark border |
| TEXT_DIM | — | Dimmed text |

Always import from utils/constants. Never define local color constants.
