import React, { useState } from 'react';
import { GOLD, DARKER, BORDER_DK, TEXT_DIM } from '../utils/constants';

const REPORT_METRICS = [
  'Avg Hours Slept',
  'Avg Sleep Score',
  'Avg Weight',
  'Fitness Completion',
  'To Accomplish Completion',
  'Thankful For Completion',
];

export default function ReportsView({ user }) {
  const [selectedClient, setSelectedClient] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  let clients = [];
  try {
    const raw = localStorage.getItem('hub_clients');
    clients = raw ? JSON.parse(raw).filter(c => c.role === 'client') : [];
  } catch (_) {
    clients = [];
  }

  if (clients.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#fff', fontSize: 14, letterSpacing: '1px' }}>No clients enrolled.</div>
      </div>
    );
  }

  if (selectedClient) {
    const fullName = (selectedClient.first_name + ' ' + selectedClient.last_name).toUpperCase();
    return (
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
        <button
          onClick={() => setSelectedClient(null)}
          style={{
            background: 'none', border: 'none', color: GOLD,
            cursor: 'pointer', fontSize: 14, fontFamily: 'inherit',
            padding: 0, marginBottom: 20,
          }}
        >
          ← Back to Reports
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 0 }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 20 }}>{fullName}</div>
          <div style={{
            background: GOLD, color: '#000', fontWeight: 700, fontSize: 12,
            padding: '3px 10px', borderRadius: 12, letterSpacing: '1px',
          }}>
            {(selectedClient.tier_name || 'Apprentice').toUpperCase()}
          </div>
        </div>

        <div style={{ borderBottom: `1px solid ${BORDER_DK}`, margin: '12px 0' }} />

        {REPORT_METRICS.map(label => (
          <div key={label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 0', borderBottom: `1px solid ${BORDER_DK}`,
          }}>
            <span style={{ color: TEXT_DIM, fontSize: 13 }}>{label}</span>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>—</span>
          </div>
        ))}

        <button
          disabled
          style={{
            width: '100%', background: 'transparent', color: GOLD,
            border: `1px solid ${GOLD}`, padding: 10, borderRadius: 4,
            fontWeight: 700, fontSize: 12, letterSpacing: '1px',
            cursor: 'not-allowed', opacity: 0.45, marginTop: 20,
            fontFamily: 'inherit',
          }}
        >
          VIEW DAILY DETAIL
        </button>

        <div style={{
          textAlign: 'center', color: TEXT_DIM, fontSize: 11,
          fontStyle: 'italic', marginTop: 8,
        }}>
          Full data available after backend migration.
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
      <div style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginBottom: 24 }}>REPORTS</div>

      {clients.map(c => {
        const fullName = (c.first_name + ' ' + c.last_name).toUpperCase();
        const isHovered = hoveredRow === c.id;
        return (
          <div
            key={c.id}
            onClick={() => setSelectedClient(c)}
            onMouseEnter={() => setHoveredRow(c.id)}
            onMouseLeave={() => setHoveredRow(null)}
            style={{
              background: DARKER, border: `1px solid ${GOLD}`, borderRadius: 6,
              padding: '14px 20px', marginBottom: 10, cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              filter: isHovered ? 'brightness(1.15)' : 'none',
              transition: 'filter 0.1s',
            }}
          >
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{fullName}</div>
            <div style={{
              background: GOLD, color: '#000', fontWeight: 700, fontSize: 12,
              padding: '3px 10px', borderRadius: 12,
            }}>
              {(c.tier_name || 'Apprentice').toUpperCase()}
            </div>
          </div>
        );
      })}
    </div>
  );
}
