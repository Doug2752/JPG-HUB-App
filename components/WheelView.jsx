import React from 'react';
import { S } from '../utils/styles';
import { SPOKE_URLS } from '../utils/constants';

const HUB_AUTH_SPOKES = ['dop', 'pit', 'tracker'];

function getClientRecord(hubUser) {
  try {
    const raw = localStorage.getItem('hub_clients');
    if (!raw) return null;
    const clients = JSON.parse(raw);
    return clients.find(c => c.id === hubUser.id) || null;
  } catch (_) {
    return null;
  }
}

function getCyclePhase(hubUser) {
  if (!hubUser || !hubUser.id) return null;
  const client = getClientRecord(hubUser);
  if (!client || !client.tracking_start_date) return null;
  try {
    const today = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00Z');
    const start = new Date(client.tracking_start_date + 'T00:00:00Z');
    const cycleDay = Math.floor((today - start) / 86400000) + 1;
    if (cycleDay <= 14) return 'foundation';
    if (cycleDay <= 21) return 'analysis';
    if (cycleDay <= 30) return 'onramp';
    return 'full';
  } catch (_) {
    return null;
  }
}

function isSpokeUnlocked(spokeId, hubUser, role) {
  if (!hubUser || !hubUser.id) return false;
  const client = getClientRecord(hubUser);
  if (!client) return false;
  const flagMap = {
    tracker: 'obt_unlocked',
    dop: 'dop_unlocked',
    pit: 'pit_unlocked',
    edu: 'edu_unlocked',
    messaging: 'comms_unlocked',
    legal: 'agreements_unlocked',
  };
  const flag = flagMap[spokeId];
  if (!flag || !client[flag]) return false;

  if (role === 'client' && (spokeId === 'dop' || spokeId === 'pit')) {
    const phase = getCyclePhase(hubUser);
    if (phase === 'foundation' || phase === 'analysis') return false;
  }

  return true;
}

function spokeStyle(spokeId, hubUser, role) {
  if (role === 'coach') return { cursor: 'pointer' };
  return isSpokeUnlocked(spokeId, hubUser, role)
    ? { cursor: 'pointer' }
    : { cursor: 'not-allowed', opacity: 0.4 };
}

function spokeClick(spokeId, hubUser, role) {
  if (role === 'client' && !isSpokeUnlocked(spokeId, hubUser, role)) return;
  let url = SPOKE_URLS[spokeId];
  if (url) {
    if (HUB_AUTH_SPOKES.includes(spokeId) && hubUser) {
      const sep = url.includes('?') ? '&' : '?';
      url = url + sep + 'hub_user=' + encodeURIComponent(hubUser);
    }
    window.open(url, '_blank');
  } else {
    alert(
      'SPOKE: ' + spokeId.toUpperCase() +
      '\n\nThis module is not yet connected.\nURL will be configured when the app is deployed.'
    );
  }
}

const lockedG = { cursor: 'not-allowed', opacity: 0.4 };

export default function WheelView({ hubUser, role }) {
  return (
    <div style={S.wheelView}>
      <svg style={S.wheelSvg} viewBox="0 0 720 720" xmlns="http://www.w3.org/2000/svg">

        {/* Rings */}
        <circle cx="360" cy="360" r="285" fill="none" stroke="#252525" strokeWidth="1"/>
        <circle cx="360" cy="360" r="285" fill="none" stroke="#B8860B" strokeWidth="0.5" strokeDasharray="3,12" opacity="0.25"/>
        <circle cx="360" cy="360" r="190" fill="none" stroke="#222" strokeWidth="0.5"/>

        {/* Spokes */}
        <line x1="360" y1="360" x2="360"  y2="75"  stroke="#333" strokeWidth="1.5"/>
        <line x1="360" y1="360" x2="528"  y2="129" stroke="#333" strokeWidth="1.5"/>
        <line x1="360" y1="360" x2="631"  y2="272" stroke="#333" strokeWidth="1.5"/>
        <line x1="360" y1="360" x2="631"  y2="448" stroke="#333" strokeWidth="1.5"/>
        <line x1="360" y1="360" x2="528"  y2="591" stroke="#333" strokeWidth="1.5"/>
        <line x1="360" y1="360" x2="360"  y2="645" stroke="#2a2a2a" strokeWidth="1" strokeDasharray="3,6"/>
        <line x1="360" y1="360" x2="192"  y2="591" stroke="#333" strokeWidth="1.5"/>
        <line x1="360" y1="360" x2="89"   y2="448" stroke="#333" strokeWidth="1.5"/>
        <line x1="360" y1="360" x2="89"   y2="272" stroke="#333" strokeWidth="1.5"/>
        <line x1="360" y1="360" x2="192"  y2="129" stroke="#333" strokeWidth="1.5"/>

        {/* HUB CENTER */}
        <circle cx="360" cy="360" r="92" fill="#B8860B" stroke="rgba(0,0,0,0.2)" strokeWidth="3"/>
        <text x="360" y="354" textAnchor="middle" fill="#000" fontSize="38" fontWeight="900" letterSpacing="8" fontFamily="Lato">HUB</text>
        <line x1="312" y1="368" x2="408" y2="368" stroke="rgba(0,0,0,0.3)" strokeWidth="1"/>
        <text x="360" y="390" textAnchor="middle" fill="#000" fontSize="10" fontWeight="700" letterSpacing="3" fontFamily="Lato">CENTRAL COMMAND</text>

        {/* 14-DAY TRACKER */}
        <g style={spokeStyle('tracker', hubUser, role)} onClick={() => spokeClick('tracker', hubUser, role)}>
          <circle cx="360" cy="75" r="62" fill="#1C3A5C" stroke="#B8860B" strokeWidth="2"/>
          <text x="360" y="60"  textAnchor="middle" fill="#B8860B" fontSize="10" fontWeight="700" letterSpacing="2" fontFamily="Lato">14-DAY</text>
          <text x="360" y="80"  textAnchor="middle" fill="#fff"    fontSize="13" fontWeight="900" letterSpacing="2" fontFamily="Lato">TRACKER</text>
          <text x="360" y="95"  textAnchor="middle" fill="#bbb"    fontSize="9"  letterSpacing="1.5" fontFamily="Lato">ONBOARDING</text>
        </g>

        {/* LEGAL DOCS */}
        <g style={spokeStyle('legal', hubUser, role)} onClick={() => spokeClick('legal', hubUser, role)}>
          <circle cx="528" cy="129" r="62" fill="#1C3A5C" stroke="#B8860B" strokeWidth="2"/>
          <text x="528" y="114" textAnchor="middle" fill="#B8860B" fontSize="10" fontWeight="700" letterSpacing="2" fontFamily="Lato">LEGAL</text>
          <text x="528" y="134" textAnchor="middle" fill="#fff"    fontSize="13" fontWeight="900" letterSpacing="2" fontFamily="Lato">DOCS</text>
          <text x="528" y="149" textAnchor="middle" fill="#bbb"    fontSize="9"  letterSpacing="1.5" fontFamily="Lato">AGREEMENTS</text>
        </g>

        {/* DOP */}
        <g style={spokeStyle('dop', hubUser, role)} onClick={() => spokeClick('dop', hubUser, role)}>
          <circle cx="631" cy="272" r="62" fill="#1C3A5C" stroke="#B8860B" strokeWidth="2"/>
          <text x="631" y="257" textAnchor="middle" fill="#B8860B" fontSize="10" fontWeight="700" letterSpacing="2" fontFamily="Lato">DAILY OPS</text>
          <text x="631" y="277" textAnchor="middle" fill="#fff"    fontSize="16" fontWeight="900" letterSpacing="4" fontFamily="Lato">DOP</text>
          <text x="631" y="292" textAnchor="middle" fill="#bbb"    fontSize="9"  letterSpacing="1.5" fontFamily="Lato">PROCESS</text>
        </g>

        {/* PIT */}
        <g style={spokeStyle('pit', hubUser, role)} onClick={() => spokeClick('pit', hubUser, role)}>
          <circle cx="631" cy="448" r="62" fill="#1C3A5C" stroke="#B8860B" strokeWidth="2"/>
          <text x="631" y="433" textAnchor="middle" fill="#B8860B" fontSize="10" fontWeight="700" letterSpacing="2" fontFamily="Lato">PERSONAL</text>
          <text x="631" y="453" textAnchor="middle" fill="#fff"    fontSize="16" fontWeight="900" letterSpacing="4" fontFamily="Lato">PIT</text>
          <text x="631" y="468" textAnchor="middle" fill="#bbb"    fontSize="9"  letterSpacing="1.5" fontFamily="Lato">TIME INVEST.</text>
        </g>

        {/* DAILY TRACKER */}
        <g style={spokeStyle('daily', hubUser, role)} onClick={() => spokeClick('daily', hubUser, role)}>
          <circle cx="528" cy="591" r="62" fill="#1C3A5C" stroke="#B8860B" strokeWidth="2"/>
          <text x="528" y="576" textAnchor="middle" fill="#B8860B" fontSize="10" fontWeight="700" letterSpacing="2" fontFamily="Lato">DAILY</text>
          <text x="528" y="596" textAnchor="middle" fill="#fff"    fontSize="13" fontWeight="900" letterSpacing="2" fontFamily="Lato">TRACKER</text>
          <text x="528" y="611" textAnchor="middle" fill="#bbb"    fontSize="9"  letterSpacing="1.5" fontFamily="Lato">ONGOING</text>
        </g>

        {/* FUTURE (locked) */}
        <g style={lockedG}>
          <circle cx="360" cy="645" r="62" fill="#161616" stroke="#3a3a3a" strokeWidth="1.5" strokeDasharray="4,4"/>
          <text x="360" y="637" textAnchor="middle" fill="#555" fontSize="10" fontWeight="700" letterSpacing="2" fontFamily="Lato">FUTURE</text>
          <text x="360" y="655" textAnchor="middle" fill="#444" fontSize="9"  letterSpacing="1.5" fontFamily="Lato">DEVELOPMENT</text>
        </g>

        {/* EDUCATION REFERENCE */}
        <g style={spokeStyle('edu', hubUser, role)} onClick={() => spokeClick('edu', hubUser, role)}>
          <circle cx="192" cy="591" r="62" fill="#1C3A5C" stroke="#B8860B" strokeWidth="2"/>
          <text x="192" y="576" textAnchor="middle" fill="#B8860B" fontSize="10" fontWeight="700" letterSpacing="2" fontFamily="Lato">EDUCATION</text>
          <text x="192" y="596" textAnchor="middle" fill="#fff"    fontSize="13" fontWeight="900" letterSpacing="2" fontFamily="Lato">REFERENCE</text>
          <text x="192" y="611" textAnchor="middle" fill="#bbb"    fontSize="9"  letterSpacing="1.5" fontFamily="Lato">LIBRARY</text>
        </g>

        {/* CLIENT CHECK-IN */}
        <g style={spokeStyle('checkin', hubUser, role)} onClick={() => spokeClick('checkin', hubUser, role)}>
          <circle cx="89" cy="448" r="62" fill="#1C3A5C" stroke="#B8860B" strokeWidth="2"/>
          <text x="89" y="433" textAnchor="middle" fill="#B8860B" fontSize="10" fontWeight="700" letterSpacing="2"   fontFamily="Lato">CLIENT</text>
          <text x="89" y="453" textAnchor="middle" fill="#fff"    fontSize="13" fontWeight="900" letterSpacing="2.5" fontFamily="Lato">CHECK-IN</text>
          <text x="89" y="468" textAnchor="middle" fill="#bbb"    fontSize="9"  letterSpacing="1.5" fontFamily="Lato">TOOL</text>
        </g>

        {/* MESSAGING */}
        <g style={spokeStyle('messaging', hubUser, role)} onClick={() => spokeClick('messaging', hubUser, role)}>
          <circle cx="89" cy="272" r="62" fill="#1C3A5C" stroke="#B8860B" strokeWidth="2"/>
          <text x="89" y="257" textAnchor="middle" fill="#B8860B" fontSize="10" fontWeight="700" letterSpacing="2" fontFamily="Lato">COMMS</text>
          <text x="89" y="277" textAnchor="middle" fill="#fff"    fontSize="13" fontWeight="900" letterSpacing="2" fontFamily="Lato">MESSAGING</text>
          <text x="89" y="292" textAnchor="middle" fill="#bbb"    fontSize="9"  letterSpacing="1.5" fontFamily="Lato">CHAT/BCAST</text>
        </g>

        {/* RESOURCES VAULT */}
        <g style={spokeStyle('resources', hubUser, role)} onClick={() => spokeClick('resources', hubUser, role)}>
          <circle cx="192" cy="129" r="62" fill="#1C3A5C" stroke="#B8860B" strokeWidth="2"/>
          <text x="192" y="114" textAnchor="middle" fill="#B8860B" fontSize="10" fontWeight="700" letterSpacing="2" fontFamily="Lato">RESOURCES</text>
          <text x="192" y="134" textAnchor="middle" fill="#fff"    fontSize="13" fontWeight="900" letterSpacing="2" fontFamily="Lato">VAULT</text>
          <text x="192" y="149" textAnchor="middle" fill="#bbb"    fontSize="9"  letterSpacing="1.5" fontFamily="Lato">DOWNLOADS</text>
        </g>

      </svg>
    </div>
  );
}
