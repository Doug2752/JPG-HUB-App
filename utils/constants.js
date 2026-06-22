// ── COLORS ────────────────────────────────────────────────────
export const GOLD      = '#B8860B';
export const DARK      = '#1A1A1A';
export const DARKER    = '#0F0F0F';
export const RED       = '#C0392B';
export const GREEN     = '#2E5A4B';
export const BORDER_LT = '#CCCCCC';
export const BORDER_DK = '#2a2a2a';
export const CHAR      = '#3A3A3A';
export const TEXT_DIM  = '#555555';
export const TEXT_MID  = '#888888';
export const TEXT_ROLE = '#aaaaaa';

// ── LOGO ──────────────────────────────────────────────────────
export const LOGO = 'jpglogo.png';

// ── CREDENTIALS ───────────────────────────────────────────────
export const USERS = {
  doug: 'JPG2026',
  test: 'JPG2026'
};

// ── SPOKE URLS ────────────────────────────────────────────────
export const SPOKE_URLS = {
  tracker:   'http://localhost:5176',
  legal:     '',
  dop:       'http://localhost:5174',
  pit:       'http://localhost:5175',
  daily:     '',
  edu:       '',
  checkin:   '',
  messaging: '',
  resources: ''
};

// ── NAV ITEMS ─────────────────────────────────────────────────
export const NAV_ITEMS = [
  { id: 'wheel',    label: 'DASHBOARD' },
  { id: 'clients',  label: 'CLIENTS' },
  { id: 'messages', label: 'MESSAGES' },
  { id: 'reports',  label: 'REPORTS' },
  { id: 'settings', label: 'SETTINGS' }
];

// ── CLIENTS ───────────────────────────────────────────────────
export const CLIENTS = [
  {
    id: 'alvarez',
    name: 'M. ALVAREZ',
    phase: 'APPRENTICE',
    phaseKey: 'warm',
    day: 'Day 4 / 14',
    lastActivity: 'Today, 6:42 AM',
    streak: '4 days',
    status: 'ON TRACK',
    goal: 'Weight Loss / Consistency',
    notes: 'Strong morning check-ins. Watch sleep numbers.'
  },
  {
    id: 'patel',
    name: 'J. PATEL',
    phase: 'FOUNDATION',
    phaseKey: 'found',
    day: '—',
    lastActivity: 'Today, 5:15 AM',
    streak: '12 days',
    status: 'ON TRACK',
    goal: 'Endurance / Mental Performance',
    notes: 'Consistent. Nutrition log improving week over week.'
  },
  {
    id: 'reynolds',
    name: 'K. REYNOLDS',
    phase: 'PERFORMANCE',
    phaseKey: 'perf',
    day: '—',
    lastActivity: 'Yesterday, 9:30 PM',
    streak: '38 days',
    status: 'ON TRACK',
    goal: 'Athletic Performance / Body Composition',
    notes: 'Hitting all benchmarks. Ready for next level.'
  },
  {
    id: 'cole',
    name: 'D. COLE',
    phase: 'UNSTOPPABLE',
    phaseKey: 'stop',
    day: '—',
    lastActivity: 'Today, 4:22 AM',
    streak: '94 days',
    status: 'ELITE',
    goal: 'Peak Performance / Leadership',
    notes: '94-day streak. Self-managing. Minimal intervention needed.'
  },
  {
    id: 'chen',
    name: 'R. CHEN',
    phase: 'APPRENTICE',
    phaseKey: 'warm',
    day: 'Day 9 / 14',
    lastActivity: '2 days ago',
    streak: '0 days',
    status: 'MISSED',
    goal: 'Habit Formation / Energy',
    notes: 'Missed last 2 check-ins. Follow-up required today.',
    alert: true,
    alertMsg: 'Missed 2 consecutive tracking days. Outreach needed.'
  }
];
