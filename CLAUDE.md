# CLAUDE.md — JPG-HUB-App
**Version:** v1.5 | **Date:** 08/13/2026 | **Repo:** Doug2752/JPG-HUB-App

This file is a context loader for Claude Code. Read this first, then read actual source files for full technical detail. Do not replace this file with a stripped-down version — produce targeted updates only.

---

## APP IDENTITY

- **Name:** HUB — Workspace Hub
- **Port:** 5176 (5177 fallback)
- **Framework:** React + Vite
- **Storage:** localStorage (pre-Supabase)
- **Coach login:** Doug / JPG2026
- **Client login:** generated username / generated password
- **Dev/test browser:** Firefox

---

## REPO STRUCTURE

```
app/
  HUBApp.jsx              — root, session restore, routing, clientRosterKey, selectedProfileClient
components/
  Login.jsx               — login gate
  Nav.jsx                 — role-gated navigation
  Topbar.jsx              — title + role-based name display (Coach: / Client:)
  WheelView.jsx           — 10-spoke SVG wheel, phase gating, Day 22 auto-promotion
  ClientsView.jsx         — client roster, ADD CLIENT form, credentials panel
  SlidePanel.jsx          — client detail panel, spoke toggles, PROGRAM TIER section
  FullProfileView.jsx     — read-only full client profile, 5 sections
  CommunicationView.jsx   — 3-tab communication: Messages, Announcements, Scheduled
  ClientViewMode.jsx      — coach preview of client dashboard
  PlaceholderView.jsx     — under development screen
services/
  clients.js              — all client/session logic, createClientRecord, updateClient
  storage.js              — localStorage wrapper
utils/
  date.js                 — todayISO()
  constants.js            — GOLD, DARK, DARKER, RED, GREEN, BORDER_LT, BORDER_DK, SPOKE_URLS, NAV_ITEMS
```

---

## KEY STORAGE KEYS

| Key | Written at | Read at |
|---|---|---|
| `hub_clients` | clients.js, WheelView (Day 22 promotion), OBT write-back | clients.js, WheelView, ClientsView, HUBApp, ClientViewMode, DOP (read-only) |
| `hub_session` | clients.js login/logout | clients.js getSession |
| `hub_messages` | CommunicationView | CommunicationView |
| `hub_announcements` | CommunicationView | CommunicationView |
| `hub_scheduled` | CommunicationView | CommunicationView |
| `hub_scheduled_completed` | CommunicationView | archive only |

---

## CLIENT RECORD STRUCTURE

```js
{
  id: "client_{timestamp}",
  role: "client",
  first_name, last_name, username, password,
  phone, email,
  program_start_date,       // written on OBT unlock
  tracking_start_date,      // written by OBT
  current_cycle_start, onramp_end,
  tier: 4,                  // Apprentice on creation
  tier_name: "Apprentice",
  cap_override_minutes: null, // coach-set Time Governor override (NEW 08/13/2026)
  obt_unlocked: true,
  dop_unlocked: false,
  pit_unlocked: false,
  edu_unlocked: true,
  comms_unlocked: true,
  agreements_unlocked: true,
  eventsboard_unlocked: true,
  daily_unlocked: true,
  resources_unlocked: true,
  residential_street, residential_city, residential_state, residential_zip
}
```

---

## CRITICAL LOGIC — WheelView.jsx

### getCyclePhase(hubUser)
Reads `hub_clients` synchronously, computes cycleDay from `tracking_start_date`.

**Day 22 auto-promotion side effect (ADDED 08/13/2026):**
In the onramp branch (cycleDay > 21 and <= 30):
```js
if (client.tier === 4) {
  updateClient(client.id, { tier: 3, tier_name: 'Performance' });
}
```
Self-guarding — fires only once. `updateClient` imported from `services/clients`.

### isSpokeUnlocked(spokeId, hubUser, role)
- Client role + dop or pit + phase foundation or analysis → false (phase-gated)
- Coach role → never phase-gated
- All other spokes → unlock flag only

---

## CRITICAL LOGIC — SlidePanel.jsx

### PROGRAM TIER section (NEW 08/13/2026)
Located between TIER display row and PROGRAM START row.

**TIER_PROMOTION map:**
```js
{
  3: { newTier: 2, newName: 'Greatness',   label: 'PROMOTE TO GREATNESS' },
  2: { newTier: 1, newName: 'Unstoppable', label: 'PROMOTE TO UNSTOPPABLE' },
}
```

- PROMOTE button: renders only when `TIER_PROMOTION[client.tier]` exists (Tier 3 and 2 only)
- `handlePromoteTier()` — calls `updateClient(client.id, { tier, tier_name })`, calls `onUpdate()`
- CAP OVERRIDE input: controlled local `capInput` state
- `handleSetCap()` — parseInt, calls `updateClient(client.id, { cap_override_minutes: val || null })`, resets capInput, calls `onUpdate()`
- `handleClearCap()` — calls `updateClient(client.id, { cap_override_minutes: null })`, resets capInput, calls `onUpdate()`

---

## CRITICAL LOGIC — Topbar.jsx

Role-based name display (UPDATED 08/13/2026):
```js
const isClient = user?.role === 'client';
const label = isClient ? 'Client: ' : 'Coach: ';
const name = isClient
  ? ((user.first_name && user.last_name)
      ? (user.first_name + ' ' + user.last_name).toUpperCase()
      : user?.username?.toUpperCase() ?? 'CLIENT')
  : (user?.username?.toUpperCase() ?? 'COACH');
```

---

## TIER PROGRESSION (LOCKED 08/13/2026)

| Tier | Name | Entry | Exit |
|---|---|---|---|
| 4 | Apprentice | Auto at creation | Auto Day 22 (WheelView getCyclePhase) |
| 3 | Performance | Auto Day 22 | Coach-promoted via SlidePanel |
| 2 | Greatness | Coach-promoted | Coach-promoted |
| 1 | Unstoppable | Coach-promoted | None — ceiling |

---

## PHASE GATING (LOCKED)

| Phase | Days | DOP/PIT client access |
|---|---|---|
| foundation | 1–14 | BLOCKED |
| analysis | 15–21 | BLOCKED |
| onramp | 22–30 | OPEN |
| full | 31+ | OPEN |
| null | no tracking_start_date | OPEN |

---

## SPOKE FLAGS (9 total)

```
obt_unlocked, dop_unlocked, pit_unlocked, edu_unlocked,
comms_unlocked, agreements_unlocked, eventsboard_unlocked,
daily_unlocked, resources_unlocked
```

Default on creation: dop and pit = false. All others = true.

HUB_AUTH_SPOKES (bypass login via hub_user param): dop, pit, tracker.

---

## STANDING RULES FOR CLAUDE CODE

- Investigation before build — always read actual source files before making changes
- Do not modify .md files in the repo
- Do not start the dev server
- Do not commit
- Master branch is protected — all OBT experimental work on Chris-Mods branch only (not applicable to HUB directly, but rule stands)
- updateClient() is the only safe write path to hub_clients — never write hub_clients directly
- WheelView reads localStorage synchronously — getCyclePhase and isSpokeUnlocked are pure functions except for the Day 22 promotion side effect

*CLAUDE.md v1.5 | JPG-HUB-App | 08/13/2026*
