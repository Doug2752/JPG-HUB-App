# CLAUDE.md — HUB App
**Version:** v1.7 | **Date:** 08/16/2026
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
  Nav.jsx                 — role-gated nav (coach: 6 items + CLIENT VIEW; client: DASHBOARD only)
  Topbar.jsx              — role-based name display (Coach: DOUG / Client: FIRST LAST)
  WheelView.jsx           — 10-spoke SVG wheel, phase gating, Day 22 auto-promotion,
                            communication/eventsboard/agreements onNavigate wiring,
                            center circle JPG logo (clipPath + multiply blend)
  ClientsView.jsx         — client roster, ADD CLIENT form, 9-spoke flag table
  SlidePanel.jsx          — client detail panel, PROGRAM TIER section, cap override,
                            AGREEMENTS status row (reads jpg_agreements_{username}),
                            OPEN FULL PROFILE
  FullProfileView.jsx     — 5-section full client profile, real data + migration placeholders
  CommunicationView.jsx   — 3-tab communication: MESSAGES, ANNOUNCEMENTS, SCHEDULED
                            COMMUNICATION (1089 lines — Class 3 conversion pending)
  ClientViewMode.jsx      — coach-as-client view, real client data, client selector dropdown
  ReportsView.jsx         — coach reports: client list view → drill-down per client,
                            6 metric rows (all placeholder dashes), VIEW DAILY DETAIL disabled
  EventsBoardView.jsx     — coming-soon placeholder screen, professional JPG-styled,
                            routes from eventsboard spoke and nav
  AgreementsView.jsx      — full Agreements spoke (NEW 08/16/2026): role-gated coach + client
                            views, all 5 forms, localStorage storage, PDF download,
                            mailto send, FORM_PDFS constants object
  PlaceholderView.jsx     — generic "under development" screen (icon, label, sub props)
services/
  clients.js              — all client/session logic, generateUsername, generatePassword,
                            createClientRecord, getClients, saveClients, addClient,
                            updateClient, login, logout, getSession
  storage.js              — localStorage wrapper (get, set, delete)
utils/
  constants.js            — color constants, LOGO, SPOKE_URLS, NAV_ITEMS (6 items)
  date.js                 — todayISO()
  styles.js               — shared style objects
public/
  jpglogo.png             — JPG mountain logo (used in center circle via SVG <image> with clipPath)
  LIMITLESS_Tier_1_Patch.png
  LIMITLESS_Tier_2_Patch.png
  LIMITLESS_Tier_3_Patch.png
  LIMITLESS_Tier_4_Patch.png
  agreement-forms/        — static PDF files for all 5 client agreement forms (NEW 08/16/2026)
    JPG-TK-001-ClientIntake-WRK-v1.0.pdf
    JPG-TK-002-ProgramApplication-WRK-v1.0.pdf
    JPG-TK-003-LiabilityWaiver-WRK-v1.0.pdf
    JPG-TK-004-ProgramAgreement-WRK-v1.0.pdf
    JPG-TK-005-PhotoRelease-WRK-v1.0.pdf
```

---

## STORAGE KEYS

| Key | Written at | Read at |
|---|---|---|
| hub_clients | services/clients.js; OBT ClientInfo.jsx (tracking_start_date + address); WheelView.jsx (Day 22 auto-promotion) | services/clients.js; ClientsView.jsx; WheelView.jsx; HUBApp.jsx; ReportsView.jsx; DOP fourX4Period.js (read-only); ClientViewMode.jsx; CoachAgreementsView (direct localStorage.getItem) |
| hub_session | services/clients.js (login / logout) | services/clients.js (getSession) |
| hub_messages | CommunicationView.jsx | CommunicationView.jsx |
| hub_announcements | CommunicationView.jsx | CommunicationView.jsx |
| hub_scheduled | CommunicationView.jsx | CommunicationView.jsx |
| hub_scheduled_completed | CommunicationView.jsx (archive only) | not yet read |
| jpg_agreements_{username} | AgreementsView.jsx — saveAgreements() in ClientFormView.handleSubmit | AgreementsView.jsx — getAgreements() throughout component; SlidePanel.jsx — inline localStorage.getItem in AGREEMENTS status row |

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
| 'agreements' | AgreementsView — NEW 08/16/2026 |
| 'settings' | PlaceholderView |
| 'clientview' | ClientViewMode |
| anything else | null |

---

## SPOKE ROUTING (WheelView spokeClick)

- 'communication' → onNavigate('communication') — internal view
- 'eventsboard' → onNavigate('eventsboard') — internal view
- 'agreements' → onNavigate('agreements') — internal view (NEW 08/16/2026)
- All other spokes → SPOKE_URLS[spokeId] opened in new tab with hub_user param (HUB_AUTH_SPOKES: dop, pit, tracker)
- Spokes with empty SPOKE_URLS string → alert message

---

## NAV ITEMS (utils/constants.js NAV_ITEMS — UPDATED 08/16/2026)

6 items (coach sees all; client sees DASHBOARD only):
1. wheel / DASHBOARD
2. clients / CLIENTS
3. communication / MESSAGES
4. reports / REPORTS
5. agreements / AGREEMENTS
6. settings / SETTINGS

Coach also gets CLIENT VIEW toggle (hardcoded in Nav.jsx JSX, not part of NAV_ITEMS array).

---

## CENTER CIRCLE (WheelView.jsx)

- Gold circle: cx=360, cy=360, r=92, fill=#B8860B
- JPG logo image: href=/jpglogo.png, x=265, y=265, width=190, height=190
- clipPath="url(#centerCircleClip)" — clips image to circle (r=91 in defs)
- style={{ mixBlendMode: 'multiply' }} — blends white PNG background into gold
- Both JPG/HUB text elements removed 08/14/2026

---

## AGREEMENTS SPOKE (AgreementsView.jsx — NEW 08/16/2026)

### Storage
- Key: jpg_agreements_{username}
- One object per client. Five form entries, each: { submitted, submitted_at, data: {...} }
- Written by saveAgreements() — called only from ClientFormView.handleSubmit
- Read by getAgreements() throughout AgreementsView; also read inline in SlidePanel AGREEMENTS row

### Five Forms
| Key | Label |
|---|---|
| form_001 | Client Intake & Application |
| form_002 | Program Application & Commitment Statement |
| form_003 | Liability Waiver & Disclaimer |
| form_004 | Program Agreement |
| form_005 | Photo / Testimonial Release |

### PDF Files (FORM_PDFS constants object)
Served from /agreement-forms/ in public/. Paths:
- form_001 → /agreement-forms/JPG-TK-001-ClientIntake-WRK-v1.0.pdf
- form_002 → /agreement-forms/JPG-TK-002-ProgramApplication-WRK-v1.0.pdf
- form_003 → /agreement-forms/JPG-TK-003-LiabilityWaiver-WRK-v1.0.pdf
- form_004 → /agreement-forms/JPG-TK-004-ProgramAgreement-WRK-v1.0.pdf
- form_005 → /agreement-forms/JPG-TK-005-PhotoRelease-WRK-v1.0.pdf

Post-Supabase migration: update FORM_PDFS object with Supabase Storage signed URLs — no other code changes needed.

### Coach View
- FORMS section (top): 5 form rows, each with DOWNLOAD PDF + SEND OPTIONS toggle
- Send options panel: email input + SEND THIS FORM (single mailto) + SEND ALL FORMS (all-forms mailto)
- CLIENTS section (below): roster list → CoachDetailView → read-only submission viewer
- Reads hub_clients directly via localStorage.getItem (no try/catch — known backlog item)

### Client View
- Form list with completion status per form
- One-time submit per form — no edit after submit
- Phase 1 signature: typed full name + confirm checkbox
- Submit date auto-populated via todayISO()

### Known Backlog (fix next HUB session)
- CoachAgreementsView: hub_clients read without try/catch on JSON.parse
- SlidePanel AGREEMENTS row: localStorage read without try/catch on JSON.parse
- tick state in ClientAgreementsView: increments on submit but does no visible work
- AgreementsView: defines GOLD/DARK/DARKER/TEXT_DIM locally — should import from utils/constants.js

---

## LOCKED DECISIONS

- Username formula: first initial + last name, lowercase
- Password formula: First-cap last name + last 4 of phone + MMYY of program start date
- 7 spoke flags default true on client create (obt, edu, comms, agreements, eventsboard, daily, resources); dop and pit default false
- program_start_date auto-written when coach toggles obt_unlocked true — never changes
- tracking_start_date written by OBT when client saves it; also written to hub_clients
- Phase gating: foundation (days 1–14) and analysis (days 15–21) lock DOP and PIT for client role regardless of unlock flag
- Day 22 auto-promotion: getCyclePhase() onramp branch — Tier 4 → Tier 3, self-guarding
- Coach tier promotion: PROMOTE button in SlidePanel for Tier 3→2 and Tier 2→1 only
- cap_override_minutes: coach-set field, takes precedence over tier default when set
- Tier 1 cap: 60 min; Tiers 2/3/4: 30 min default
- HUB_AUTH_SPOKES (hub_user param appended): dop, pit, tracker
- hub_user param: username string only — not full session object
- Topbar: coach shows "Coach: DOUG"; client shows "Client: FIRST LAST" (uppercased)
- CommunicationView: 3 tabs only — MESSAGES, ANNOUNCEMENTS, SCHEDULED COMMUNICATION
- ReportsView: standalone view wired to left nav REPORTS item — not inside CommunicationView
- EventsBoardView: standalone coming-soon placeholder — routes via eventsboard spoke and nav
- AgreementsView: standalone full spoke — routes via agreements spoke and AGREEMENTS nav item
- Agreements PDF download: static files in public/agreement-forms/ — FORM_PDFS constants object is the single update point for Supabase Storage migration
- Agreements send: mailto only in Phase 1 — coach attaches PDF manually. Server-side email post-Supabase.
- Agreements signature: typed full name + checkbox in Phase 1 — e-signature platform post-Supabase
- Cross-origin localStorage: OBT cannot write to HUB hub_clients from a different port — resolved post-Supabase

---

## DO NOT

- Do not start the dev server
- Do not commit — GitHub Desktop only
- Do not touch .md files in the repo during builds
- Do not add a Reports tab back to CommunicationView — Reports is a standalone view
- Do not add eventsboard to SPOKE_URLS — it routes via onNavigate, not a URL
- Do not add agreements to SPOKE_URLS — it routes via onNavigate, not a URL
- Do not hardcode FORM_PDFS paths inline — all paths live in the FORM_PDFS constants object only

---

*CLAUDE.md v1.7 | JPG-HUB-App | 08/16/2026*
