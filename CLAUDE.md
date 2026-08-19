# CLAUDE.md — HUB App
**Version:** v1.8 | **Date:** 08/18/2026
**Repo:** Doug2752/JPG-HUB-App
**Local:** C:\JPG-PROJECTS\JPG-HUB-App

---

## STACK
- React + Vite (no src/ prefix — files at root-level folders: app/, components/, utils/, services/)
- localStorage (pre-Supabase)
- Dev port: 5176 (fallback 5177)
- Test browser: Firefox

---

## CREDENTIALS
- Coach: Doug / JPG2026
- Test client: mhowardiii / Howard iii63900826 (space between "Howard" and "iii" is real)
- hub_session persists indefinitely — to force login screen, delete hub_session key from localStorage in Firefox DevTools and refresh

---

## REPO STRUCTURE

```
app/
  HUBApp.jsx              — root component, session restore, renderView(), all activeView routing
components/
  Login.jsx               — shared JPG login screen
  Nav.jsx                 — role-gated nav (coach: 8 items + CLIENT VIEW; client: DASHBOARD only)
  Topbar.jsx              — role-based name display (Coach: DOUG / Client: FIRST LAST)
  WheelView.jsx           — 10-spoke SVG wheel, phase gating, agreements gating,
                            Day 22 auto-promotion, communication/eventsboard/agreements/edu
                            onNavigate wiring, center circle JPG logo (clipPath + multiply blend)
  ClientsView.jsx         — client roster, ADD CLIENT form, 9-spoke flag table
  SlidePanel.jsx          — client detail panel, PROGRAM TIER section, cap override,
                            AGREEMENTS status row, agreements gating (GATED_SPOKES Set +
                            agreementsComplete() helper + inline gate message),
                            OPEN FULL PROFILE
  FullProfileView.jsx     — 5-section full client profile, real data + migration placeholders
  CommunicationView.jsx   — 210-line thin shell. 3-tab bar. Owns all state + loadAll().
                            Passes props to tab components. (Converted from 1089-line monolith
                            08/18/2026 — Class 3 modular conversion complete)
  tabs/
    MessagesTab.jsx       — multi-client checkbox messaging, saveMessages, handleSendMessage
    AnnouncementsTab.jsx  — announcements list + inline form + detail panel, handleSaveAnnouncement
    ScheduledTab.jsx      — full scheduled comms, STATE_TZ_OFFSET, coachNotesTimerRef,
                            handleSaveScheduled/handleCoachNotesChange/handleComplete/
                            handleCancel/handleReschedule
  ClientViewMode.jsx      — coach-as-client view, real client data, client selector dropdown
  ReportsView.jsx         — coach reports: client list view → drill-down per client,
                            6 metric rows (all placeholder dashes), VIEW DAILY DETAIL disabled
  EventsBoardView.jsx     — full forum-style thread board (REBUILT 08/18/2026):
                            hub_events storage, two-column layout, sortThreads(),
                            coach full moderation, client own-post edit/delete,
                            reply input per thread, pin/unpin coach only
  AgreementsView.jsx      — full Agreements spoke: role-gated coach + client views,
                            all 5 forms, localStorage storage, PDF download, mailto send,
                            FORM_PDFS constants object. Color constants imported from
                            utils/constants (not local). try/catch on all JSON.parse calls.
  EducationView.jsx       — two-level navigation (NEW 08/18/2026): Level 1 category landing,
                            Level 2 doc list with PDF links. 4 categories, 6 docs.
                            "EDUCATIONAL REFERENCE DOCUMENTS" gold header.
  PlaceholderView.jsx     — generic "under development" screen (icon, label, sub props)
services/
  clients.js              — all client/session logic, generateUsername, generatePassword,
                            createClientRecord, getClients, saveClients, addClient,
                            updateClient, login, logout, getSession
  storage.js              — localStorage wrapper (get, set, delete)
utils/
  constants.js            — color constants, LOGO, SPOKE_URLS, NAV_ITEMS (8 items)
  date.js                 — todayISO()
  styles.js               — shared style objects
public/
  jpglogo.png             — JPG mountain logo (used in center circle via SVG <image> with clipPath)
  LIMITLESS_Tier_1_Patch.png
  LIMITLESS_Tier_2_Patch.png
  LIMITLESS_Tier_3_Patch.png
  LIMITLESS_Tier_4_Patch.png
  agreement-forms/        — static PDF files for all 5 client agreement forms
    JPG-TK-001-ClientIntake-WRK-v1.0.pdf
    JPG-TK-002-ProgramApplication-WRK-v1.0.pdf
    JPG-TK-003-LiabilityWaiver-WRK-v1.0.pdf
    JPG-TK-004-ProgramAgreement-WRK-v1.0.pdf
    JPG-TK-005-PhotoRelease-WRK-v1.0.pdf
  edu-docs/               — static PDF files for Education spoke (NEW 08/18/2026)
    JPG-FD-005-EDU-WhatIsPIT-v1.0.pdf
    JPG-FD-006-EDU-WhatIsDOP-v1.0.pdf
    JPG-FD-007-EDU-PITandDOPIntegrated-v1.0.pdf
    JPG-FD-009-EDU-DOP4x4Matrix-v1.0.pdf
    JPG-FD-010-EDU-MeasuringEffort-v1.0.pdf
    JPG-EDU-CellPhoneRelationship-v1.0.pdf
```

---

## STORAGE KEYS

| Key | Written at | Read at |
|---|---|---|
| hub_clients | services/clients.js; OBT ClientInfo.jsx (tracking_start_date + address); WheelView.jsx (Day 22 auto-promotion) | services/clients.js; ClientsView.jsx; WheelView.jsx; HUBApp.jsx; ReportsView.jsx; DOP fourX4Period.js (read-only); ClientViewMode.jsx; CoachAgreementsView (try/catch JSON.parse) |
| hub_session | services/clients.js (login / logout) | services/clients.js (getSession) |
| hub_messages | tabs/MessagesTab.jsx | CommunicationView.jsx (loadAll) |
| hub_announcements | tabs/AnnouncementsTab.jsx | CommunicationView.jsx (loadAll) |
| hub_scheduled | tabs/ScheduledTab.jsx | CommunicationView.jsx (loadAll) |
| hub_scheduled_completed | tabs/ScheduledTab.jsx (archive only) | tabs/ScheduledTab.jsx (handleComplete, handleCancel) |
| hub_events | EventsBoardView.jsx (getEvents/saveEvents) | EventsBoardView.jsx |
| jpg_agreements_{username} | AgreementsView.jsx — saveAgreements() | AgreementsView.jsx — getAgreements(); SlidePanel.jsx — inline read (try/catch); SlidePanel.jsx — agreementsComplete() helper |

---

## ACTIVE VIEW ROUTING (HUBApp.jsx renderView())

| activeView | Component |
|---|---|
| 'wheel' | WheelView |
| 'clients' | ClientsView |
| 'communication' | CommunicationView |
| 'fullprofile' | FullProfileView |
| 'reports' | ReportsView |
| 'eventsboard' | EventsBoardView |
| 'agreements' | AgreementsView |
| 'edu' | EducationView — NEW 08/18/2026 |
| 'settings' | PlaceholderView |
| 'clientview' | ClientViewMode |
| anything else | null |

---

## SPOKE ROUTING (WheelView spokeClick)

- 'communication' → onNavigate('communication') — internal view
- 'eventsboard' → onNavigate('eventsboard') — internal view
- 'agreements' → onNavigate('agreements') — internal view
- 'edu' → onNavigate('edu') — internal view (NEW 08/18/2026)
- All other spokes → SPOKE_URLS[spokeId] opened in new tab with hub_user param (HUB_AUTH_SPOKES: dop, pit, tracker)
- Spokes with empty SPOKE_URLS string → alert message

---

## NAV ITEMS (utils/constants.js NAV_ITEMS — UPDATED 08/18/2026)

8 items (coach sees all; client sees DASHBOARD only):
1. wheel / DASHBOARD
2. clients / CLIENTS
3. communication / MESSAGES
4. edu / EDUCATION — NEW 08/18/2026
5. reports / REPORTS
6. agreements / AGREEMENTS
7. eventsboard / EVENTS — NEW 08/18/2026
8. settings / SETTINGS

Coach also gets CLIENT VIEW toggle (hardcoded in Nav.jsx JSX, not part of NAV_ITEMS array).

---

## CENTER CIRCLE (WheelView.jsx)

- Gold circle: cx=360, cy=360, r=92, fill=#B8860B
- JPG logo image: href=/jpglogo.png, x=265, y=265, width=190, height=190
- clipPath="url(#centerCircleClip)" — clips image to circle (r=91 in defs)
- style={{ mixBlendMode: 'multiply' }} — blends white PNG background into gold

---

## AGREEMENTS GATING RULE (NEW 08/18/2026)

Six spokes gated until all 5 client agreements are submitted:
- Gated flag keys: dop_unlocked, pit_unlocked, edu_unlocked, eventsboard_unlocked, daily_unlocked, resources_unlocked
- Exempt (always freely unlockable): obt_unlocked, comms_unlocked, agreements_unlocked

**SlidePanel enforcement:**
- agreementsComplete(username) helper at file level — reads jpg_agreements_{username}, checks all 5 form keys submitted === true, try/catch returns false
- GATED_SPOKES Set defined at file level with 6 flag keys
- handleToggleSpoke: early return if isUnlocking AND gated AND !agreementsComplete
- Spoke row: inline italic message below UNLOCK button when blocked — "Agreements must be completed before this spoke can be unlocked."
- REVOKE always works regardless of gate

**WheelView enforcement:**
- GATED_SPOKE_IDS Set: 'dop', 'pit', 'edu', 'eventsboard', 'daily', 'resources'
- agreementsComplete(username) defined locally (same logic)
- isSpokeUnlocked: after phase gating, client role + gated spokeId + !agreementsComplete → return false
- Coach role: gating never applies

---

## AGREEMENTS SPOKE (AgreementsView.jsx)

### Storage
- Key: jpg_agreements_{username}
- One object per client. Five form entries, each: { submitted, submitted_at, data: {...} }
- Written by saveAgreements() — called only from ClientFormView.handleSubmit
- Read by getAgreements() throughout AgreementsView; also read inline in SlidePanel (try/catch)

### Five Forms
| Key | Label |
|---|---|
| form_001 | Client Intake & Application |
| form_002 | Program Application & Commitment Statement |
| form_003 | Liability Waiver & Disclaimer |
| form_004 | Program Agreement |
| form_005 | Photo / Testimonial Release |

### PDF Files (FORM_PDFS constants object)
Served from /agreement-forms/ in public/. Post-Supabase: update FORM_PDFS object only.

### Coach View
- FORMS section: 5 form rows, DOWNLOAD PDF + SEND OPTIONS toggle
- CLIENTS section: roster → CoachDetailView → read-only submission viewer

### Client View
- Form list, one-time submit per form, no edit after submit

---

## EVENTS BOARD (EventsBoardView.jsx — REBUILT 08/18/2026)

- Storage key: hub_events — JSON array of thread objects
- Thread shape: { id, title, event_date, body, created_by, created_by_role, created_at, state, pinned, replies[] }
- Reply shape: { id, body, created_by, created_by_role, created_at }
- sortThreads(): pinned (by event_date asc) → UPCOMING (by event_date asc) → COMPLETED (by last reply desc)
- Layout: left panel 340px (thread list) + right panel flex 1 (detail or new form)
- Coach: full moderation — delete/edit any thread or reply, pin, mark state
- Client: edit/delete own posts/replies only, mark state on own threads only
- Any user can create threads and post replies

---

## EDUCATION SPOKE (EducationView.jsx — NEW 08/18/2026)

- Two-level navigation: selectedCategory state
- Level 1: category cards (4 categories)
- Level 2: doc cards for selected category, window.open(doc.file, '_blank') on click
- PDFs served from /edu-docs/ in public/
- EDU_CATEGORIES array — add one object to docs[] to add a new doc, no rebuild needed
- Categories: app_systems, training, lifestyle, industry_articles (empty placeholder)

---

## COMMUNICATION SPOKE (MODULAR — 08/18/2026)

- CommunicationView.jsx: 210-line shell. Owns all useState (19) + messagesEndRef. loadAll() via Promise.all.
- components/tabs/MessagesTab.jsx: hub_messages storage, saveMessages, handleSendMessage
- components/tabs/AnnouncementsTab.jsx: hub_announcements storage, handleSaveAnnouncement
- components/tabs/ScheduledTab.jsx: hub_scheduled + hub_scheduled_completed storage, STATE_TZ_OFFSET, coachNotesTimerRef (inside component), all 5 handlers

---

## LOCKED DECISIONS

- Username formula: first initial + last name, lowercase
- Password formula: First-cap last name + last 4 of phone + MMYY of program start date
- All spoke flags default false on client create — coach unlocks manually
- program_start_date auto-written when coach toggles obt_unlocked true — never changes
- tracking_start_date written by OBT when client saves it; also written to hub_clients
- Phase gating: foundation (days 1–14) and analysis (days 15–21) lock DOP and PIT for client role regardless of unlock flag
- Agreements gating: 6 spokes locked until all 5 agreements submitted — coach and client both gated
- Day 22 auto-promotion: getCyclePhase() onramp branch — Tier 4 → Tier 3, self-guarding
- Coach tier promotion: PROMOTE button in SlidePanel for Tier 3→2 and Tier 2→1 only
- cap_override_minutes: coach-set field, takes precedence over tier default when set
- Tier 1 cap: 60 min; Tiers 2/3/4: 30 min default
- HUB_AUTH_SPOKES (hub_user param appended): dop, pit, tracker
- hub_user param: username string only — not full session object
- Topbar: coach shows "Coach: DOUG"; client shows "Client: FIRST LAST" (uppercased)
- CommunicationView: 3 tabs only — MESSAGES, ANNOUNCEMENTS, SCHEDULED COMMUNICATION
- ReportsView: standalone view wired to left nav REPORTS item
- Education PDFs: served from /edu-docs/ — add docs by updating EDU_CATEGORIES array only
- Agreements PDFs: served from /agreement-forms/ — FORM_PDFS constants object is single update point for Supabase migration
- Internal routing spokes (do NOT add to SPOKE_URLS): communication, eventsboard, agreements, edu
- Cross-origin localStorage: OBT cannot write to HUB hub_clients from different port — resolved post-Supabase

---

## DO NOT

- Do not start the dev server
- Do not commit — GitHub Desktop only
- Do not touch .md files in the repo during builds
- Do not add a Reports tab back to CommunicationView — Reports is a standalone view
- Do not add eventsboard, agreements, edu, or communication to SPOKE_URLS — all route via onNavigate
- Do not hardcode FORM_PDFS paths inline — all paths live in the FORM_PDFS constants object only
- Do not define color constants locally in components — import from utils/constants.js

---

*CLAUDE.md v1.8 | JPG-HUB-App | 08/18/2026*
