import React from 'react';
import { S } from '../utils/styles';
import { GOLD, TEXT_DIM } from '../utils/constants';
import { updateClient } from '../services/clients';

const SPOKE_LABELS = [
  { key: 'obt_unlocked',        label: 'OBT' },
  { key: 'dop_unlocked',        label: 'DOP' },
  { key: 'pit_unlocked',        label: 'PIT' },
  { key: 'edu_unlocked',        label: 'EDU' },
  { key: 'comms_unlocked',      label: 'COMMS' },
  { key: 'agreements_unlocked', label: 'AGREEMENTS' },
];

export default function SlidePanel({ client, onClose, onUpdate }) {
  const isOpen = !!client;

  async function handleToggleSpoke(flagKey) {
    await updateClient(client.id, { [flagKey]: !client[flagKey] });
    if (onUpdate) onUpdate();
  }

  return (
    <div style={{ ...S.slidePanel, right: isOpen ? 0 : -420 }}>
      <div style={S.spHeader}>
        <h3 style={S.spHeaderName}>
          {client ? (client.first_name + ' ' + client.last_name).toUpperCase() : ''}
        </h3>
        <button style={S.spClose} onClick={onClose}>✕</button>
      </div>

      {client && (
        <div style={S.spBody}>
          <div style={S.spRow}>
            <div style={S.spRowLbl}>TIER</div>
            <div style={{ ...S.spRowVal, ...S.spRowValGold }}>{client.tier_name}</div>
          </div>
          <div style={S.spRow}>
            <div style={S.spRowLbl}>PROGRAM START</div>
            <div style={S.spRowVal}>{client.program_start_date || '—'}</div>
          </div>
          <div style={S.spRow}>
            <div style={S.spRowLbl}>USERNAME</div>
            <div style={S.spRowVal}>{client.username}</div>
          </div>
          <div style={S.spRow}>
            <div style={S.spRowLbl}>GENERATED PASSWORD</div>
            <div style={S.spRowVal}>{client.password}</div>
          </div>

          <hr style={S.spDivider} />

          <div style={S.spRow}>
            <div style={S.spRowLbl}>SPOKES UNLOCKED</div>
            <div style={{ marginTop: '8px' }}>
              {SPOKE_LABELS.map((spoke, i) => {
                const unlocked = !!client[spoke.key];
                const isLast = i === SPOKE_LABELS.length - 1;
                return (
                  <div key={spoke.key} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: isLast ? 'none' : '1px solid #222',
                  }}>
                    <span style={{
                      color: unlocked ? '#fff' : TEXT_DIM,
                      fontSize: '12px', fontWeight: 700, letterSpacing: '1px',
                    }}>
                      {spoke.label}
                    </span>
                    <button
                      onClick={() => handleToggleSpoke(spoke.key)}
                      style={unlocked ? {
                        background: GOLD, color: '#000', fontWeight: 700, fontSize: 11,
                        padding: '4px 12px', borderRadius: 3, border: 'none',
                        cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '1px',
                      } : {
                        background: 'transparent', color: '#888', fontWeight: 700, fontSize: 11,
                        padding: '4px 12px', borderRadius: 3, border: '1px solid #444',
                        cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '1px',
                      }}
                    >
                      {unlocked ? 'REVOKE' : 'UNLOCK'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div style={S.spFooter}>
        <button style={S.spFullBtn}>OPEN FULL PROFILE ▶</button>
      </div>
    </div>
  );
}
