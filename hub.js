/* ═══════════════════════════════════════════════════════════
   JPG HUB — hub.js
   Jones Performance Group LLC
   CONFIDENTIAL
═══════════════════════════════════════════════════════════ */

/* ─── CREDENTIALS ────────────────────────────────────────── */
const CREDENTIALS = {
  username: 'doug',
  password: 'JPG2026'
};

/* ─── SPOKE DESTINATIONS ─────────────────────────────────── */
/* Update these URLs when each app is deployed */
const SPOKE_URLS = {
  tracker:   '',   // 14-Day OB Tracker app URL
  legal:     '',   // Legal Docs URL
  dop:       '',   // DOP App URL
  pit:       '',   // PIT App URL
  daily:     '',   // Daily Tracker URL
  edu:       '',   // Education Reference URL
  checkin:   '',   // Client Check-In Tool URL
  messaging: '',   // Messaging URL
  resources: ''    // Resources Vault URL
};

/* ─── CLIENT DATA ────────────────────────────────────────── */
const CLIENTS = {
  alvarez: {
    name: 'M. ALVAREZ',
    phase: 'WARM-UP',
    phaseClass: 'pt-warm',
    day: 'Day 4 of 14',
    lastActivity: 'Today, 6:42 AM',
    streak: '4 days',
    status: 'ON TRACK',
    goal: 'Weight Loss / Consistency',
    notes: 'Strong morning check-ins. Watch sleep numbers.'
  },
  patel: {
    name: 'J. PATEL',
    phase: 'FOUNDATION',
    phaseClass: 'pt-found',
    day: '—',
    lastActivity: 'Today, 5:15 AM',
    streak: '12 days',
    status: 'ON TRACK',
    goal: 'Endurance / Mental Performance',
    notes: 'Consistent. Nutrition log improving week over week.'
  },
  reynolds: {
    name: 'K. REYNOLDS',
    phase: 'PERFORMANCE',
    phaseClass: 'pt-perf',
    day: '—',
    lastActivity: 'Yesterday, 9:30 PM',
    streak: '38 days',
    status: 'ON TRACK',
    goal: 'Athletic Performance / Body Composition',
    notes: 'Hitting all benchmarks. Ready for next level.'
  },
  cole: {
    name: 'D. COLE',
    phase: 'UNSTOPPABLE',
    phaseClass: 'pt-stop',
    day: '—',
    lastActivity: 'Today, 4:22 AM',
    streak: '94 days',
    status: 'ELITE',
    goal: 'Peak Performance / Leadership',
    notes: '94-day streak. Self-managing. Minimal intervention needed.'
  },
  chen: {
    name: 'R. CHEN',
    phase: 'WARM-UP',
    phaseClass: 'pt-warm',
    day: 'Day 9 of 14',
    lastActivity: '2 days ago',
    streak: '0 days',
    status: 'MISSED',
    goal: 'Habit Formation / Energy',
    notes: 'Missed last 2 check-ins. Follow-up required today.',
    alert: true,
    alertMsg: 'Missed 2 consecutive tracking days. Outreach needed.'
  }
};

/* ─── NAV MAP ────────────────────────────────────────────── */
const NAV_MAP = {
  wheel:    'nav-dashboard',
  clients:  'nav-clients',
  messages: 'nav-messages',
  reports:  'nav-reports',
  settings: 'nav-settings'
};

/* ═══════════════════════════════════════════════════════════
   LOGIN / LOGOUT
═══════════════════════════════════════════════════════════ */
function doLogin() {
  const user = document.getElementById('login-user').value.trim();
  const pass = document.getElementById('login-pass').value.trim();

  if (user === CREDENTIALS.username && pass === CREDENTIALS.password) {
    document.getElementById('screen-login').classList.remove('active');
    document.getElementById('screen-main').classList.add('active');
  } else {
    document.getElementById('login-pass').style.borderColor = '#C0392B';
    setTimeout(() => {
      document.getElementById('login-pass').style.borderColor = '';
    }, 1200);
  }
}

function doLogout() {
  document.getElementById('screen-main').classList.remove('active');
  document.getElementById('screen-login').classList.add('active');
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
}

/* Allow Enter key on login inputs */
document.addEventListener('DOMContentLoaded', function () {
  ['login-user', 'login-pass'].forEach(function(id) {
    document.getElementById(id).addEventListener('keydown', function(e) {
      if (e.key === 'Enter') doLogin();
    });
  });
});

/* ═══════════════════════════════════════════════════════════
   VIEW SWITCHING
═══════════════════════════════════════════════════════════ */
function showView(viewId) {
  /* Hide all views */
  document.querySelectorAll('.view').forEach(function(v) {
    v.classList.remove('active');
  });
  /* Deactivate all nav items */
  document.querySelectorAll('.nav-item').forEach(function(n) {
    n.classList.remove('active');
  });
  /* Activate selected view and nav item */
  document.getElementById('view-' + viewId).classList.add('active');
  var navId = NAV_MAP[viewId];
  if (navId) document.getElementById(navId).classList.add('active');

  /* Close panel when switching views */
  closePanel();
}

/* ═══════════════════════════════════════════════════════════
   SPOKE CLICKS
═══════════════════════════════════════════════════════════ */
function spokeClick(spokeId) {
  var url = SPOKE_URLS[spokeId];
  if (url) {
    window.open(url, '_blank');
  } else {
    /* Spoke not yet connected — show coming soon */
    alert('SPOKE: ' + spokeId.toUpperCase() + '\n\nThis module is not yet connected.\nURL will be configured when the app is deployed.');
  }
}

/* ═══════════════════════════════════════════════════════════
   CLIENT SLIDE PANEL
═══════════════════════════════════════════════════════════ */
function openPanel(clientId) {
  var c = CLIENTS[clientId];
  if (!c) return;

  document.getElementById('sp-name').textContent = c.name;

  var alertHtml = '';
  if (c.alert) {
    alertHtml = '<div class="sp-alert"><div class="al">⚠ ALERT</div><div class="av">' + c.alertMsg + '</div></div>';
  }

  document.getElementById('sp-body').innerHTML =
    alertHtml +
    '<div class="sp-row"><div class="lbl">PHASE</div><div class="val gold">' + c.phase + '</div></div>' +
    '<div class="sp-row"><div class="lbl">LAST ACTIVITY</div><div class="val">' + c.lastActivity + '</div></div>' +
    '<div class="sp-row"><div class="lbl">STREAK</div><div class="val">' + c.streak + '</div></div>' +
    (c.day !== '—' ? '<div class="sp-row"><div class="lbl">PROGRESS</div><div class="val">' + c.day + '</div></div>' : '') +
    '<div class="sp-row"><div class="lbl">STATUS</div><div class="val">' + c.status + '</div></div>' +
    '<hr class="sp-divider">' +
    '<div class="sp-row"><div class="lbl">GOAL</div><div class="val">' + c.goal + '</div></div>' +
    '<div class="sp-row"><div class="lbl">COACH NOTES</div><div class="val">' + c.notes + '</div></div>';

  document.getElementById('slide-panel').classList.add('open');
  document.getElementById('main-content').classList.add('panel-open');
}

function closePanel() {
  document.getElementById('slide-panel').classList.remove('open');
  document.getElementById('main-content').classList.remove('panel-open');
}
