import React, { useState, useEffect } from 'react';
import { S } from '../utils/styles';

const SPOKE_FLAGS = [
  'obt_unlocked', 'dop_unlocked', 'pit_unlocked',
  'edu_unlocked', 'comms_unlocked', 'agreements_unlocked'
];

function countUnlocked(client) {
  return SPOKE_FLAGS.filter(f => !!client[f]).length;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00Z');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[d.getUTCMonth()] + ' ' + d.getUTCDate() + ' ' + d.getUTCFullYear();
}

export default function ClientsView({ onOpenPanel }) {
  const [clients, setClients] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('hub_clients');
      setClients(raw ? JSON.parse(raw) : []);
    } catch (_) {
      setClients([]);
    }
  }, []);

  return (
    <div style={S.clientsScroll}>
      <div style={S.pageHdr}>
        <h2 style={S.pageHdrH2}>ACTIVE CLIENTS</h2>
        <p style={S.pageHdrP}>Select a client for quick reference. Open full profile for complete detail.</p>
      </div>

      <div style={S.statsRow}>
        <div style={S.statBox}>
          <div style={S.statLabel}>ACTIVE CLIENTS</div>
          <div style={S.statValue}>{clients.length}</div>
          <div style={S.statSub}>across all tiers</div>
        </div>
        <div style={S.statBox}>
          <div style={S.statLabel}>CHECK-INS TODAY</div>
          <div style={S.statValue}>—</div>
          <div style={S.statSub}>no data yet</div>
        </div>
        <div style={S.statBox}>
          <div style={S.statLabel}>UNREAD MESSAGES</div>
          <div style={S.statValue}>—</div>
          <div style={S.statSub}>no data yet</div>
        </div>
        <div style={S.statBox}>
          <div style={S.statLabel}>ALERTS</div>
          <div style={S.statValue}>—</div>
          <div style={S.statSub}>no data yet</div>
        </div>
      </div>

      <div style={S.sectionBar}>
        <h3 style={S.sectionBarH3}>CLIENT ROSTER</h3>
        <span style={S.sectionBarSpan}>SHOWING {clients.length} CLIENTS</span>
      </div>

      {clients.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#666', fontSize: 14 }}>
          No clients yet. Add your first client to get started.
        </div>
      ) : (
        <div style={S.clientTable}>
          <div style={{ ...S.ctGrid, ...S.ctHead }}>
            <span style={S.ctHeadCell}>NAME</span>
            <span style={S.ctHeadCell}>TIER</span>
            <span style={S.ctHeadCell}>PROGRAM START</span>
            <span style={S.ctHeadCell}>SPOKES</span>
            <span style={S.ctHeadCell}>STATUS</span>
          </div>

          {clients.map((c, i) => {
            const isLast    = i === clients.length - 1;
            const isHovered = hoveredRow === c.id;
            const rowStyle  = {
              ...S.ctGrid,
              ...S.ctRow,
              ...(isLast    ? { borderBottom: 'none' } : {}),
              ...(isHovered ? { background: '#1a1a1a' } : {})
            };

            return (
              <div
                key={c.id}
                style={rowStyle}
                onClick={() => onOpenPanel(c)}
                onMouseEnter={() => setHoveredRow(c.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <div style={S.ctName}>
                  {(c.first_name + ' ' + c.last_name).toUpperCase()}
                </div>
                <div style={S.ctMeta}>{c.tier_name}</div>
                <div style={S.ctMeta}>{formatDate(c.program_start_date)}</div>
                <div style={S.ctMeta}>{countUnlocked(c)} / 6</div>
                <div style={S.ctAction}>ACTIVE</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
