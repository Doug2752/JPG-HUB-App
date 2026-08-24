import React, { useState } from 'react';
import { S } from '../utils/styles';
import { GOLD, TEXT_DIM } from '../utils/constants';
import { updateClient } from '../services/clients';
import { todayISO } from '../utils/date';

function agreementsComplete(username) {
  try {
    const raw = localStorage.getItem(`jpg_agreements_${username}`);
    const data = raw ? JSON.parse(raw) : {};
    const keys = ['form_001','form_002','form_003','form_005'];
    return keys.every(k => data[k]?.submitted === true);
  } catch (_) {
    return false;
  }
}

const GATED_SPOKES = new Set([
  'dop_unlocked', 'pit_unlocked', 'edu_unlocked',
  'daily_unlocked', 'resources_unlocked',
]);

const SPOKE_LABELS = [
  { key: 'obt_unlocked',        label: 'ONBOARDING & 14-DAY TRACKING' },
  { key: 'dop_unlocked',        label: 'DAILY OPERATIONAL PROCESS (DOP)' },
  { key: 'pit_unlocked',        label: 'PERSONAL INVESTMENT TIME (PIT)' },
  { key: 'edu_unlocked',        label: 'EDUCATIONAL DOCUMENTS' },
  { key: 'comms_unlocked',      label: 'COMMUNICATIONS & MESSAGING' },
  { key: 'agreements_unlocked', label: 'AGREEMENTS' },
  { key: 'interface_unlocked',  label: 'INTERFACE PREFERENCE' },
  { key: 'eventsboard_unlocked', label: 'EVENTS BOARD' },
  { key: 'daily_unlocked',       label: 'TRACKING & TECHNOLOGY' },
  { key: 'resources_unlocked',   label: 'RESOURCES VAULT' },
];

const TIER_PROMOTION = {
  3: { newTier: 2, newName: 'Greatness',   label: 'PROMOTE TO GREATNESS' },
  2: { newTier: 1, newName: 'Unstoppable', label: 'PROMOTE TO UNSTOPPABLE' },
};

const actionBtn = {
  background: 'transparent', color: '#888', fontWeight: 700, fontSize: 11,
  padding: '4px 12px', borderRadius: 3, border: '1px solid #444',
  cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '1px',
};

export default function SlidePanel({ client, onClose, onUpdate, onOpenFullProfile }) {
  const isOpen = !!client;
  const [capInput, setCapInput] = useState('');

  async function handleToggleSpoke(flagKey) {
    const isUnlocking = !client[flagKey];
    if (isUnlocking && GATED_SPOKES.has(flagKey) && !agreementsComplete(client.username)) {
      return;
    }
    if (flagKey === 'obt_unlocked' && isUnlocking) {
      await updateClient(client.id, { obt_unlocked: true, program_start_date: todayISO() });
    } else {
      await updateClient(client.id, { [flagKey]: !client[flagKey] });
    }
    if (onUpdate) onUpdate();
  }

  async function handlePromoteTier() {
    const promo = TIER_PROMOTION[client.tier];
    if (!promo) return;
    await updateClient(client.id, { tier: promo.newTier, tier_name: promo.newName });
    if (onUpdate) onUpdate();
  }

  async function handleSetCap() {
    const val = parseInt(capInput, 10);
    await updateClient(client.id, { cap_override_minutes: isNaN(val) ? null : val });
    setCapInput('');
    if (onUpdate) onUpdate();
  }

  async function handleClearCap() {
    await updateClient(client.id, { cap_override_minutes: null });
    setCapInput('');
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

          <div style={{ padding: '10px 0', borderBottom: '1px solid #222' }}>
            <div style={S.spRowLbl}>PROGRAM TIER</div>
            <div style={{ marginTop: 10 }}>
              {TIER_PROMOTION[client.tier] && (
                <div style={{ marginBottom: 10 }}>
                  <button
                    onClick={handlePromoteTier}
                    style={{
                      background: GOLD, color: '#000', fontWeight: 700, fontSize: 11,
                      padding: '4px 12px', borderRadius: 3, border: 'none', cursor: 'pointer',
                    }}
                  >
                    {TIER_PROMOTION[client.tier].label}
                  </button>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', color: TEXT_DIM }}>
                  CAP OVERRIDE (MIN)
                </span>
                <input
                  type="number"
                  value={capInput}
                  placeholder={client.cap_override_minutes ?? ''}
                  onChange={e => setCapInput(e.target.value)}
                  style={{
                    width: 60, background: '#111', color: '#fff',
                    border: '1px solid #444', borderRadius: 3,
                    padding: '4px 8px', fontSize: 12, fontFamily: 'inherit',
                  }}
                />
                <button onClick={handleSetCap} style={actionBtn}>SET</button>
                <button onClick={handleClearCap} style={actionBtn}>CLEAR</button>
              </div>
            </div>
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

          <div style={S.spRow}>
            <div style={S.spRowLbl}>RESIDENTIAL ADDRESS</div>
            <div style={S.spRowVal}>
              {(() => {
                const street = (client.residential_street || '').trim();
                const city   = (client.residential_city   || '').trim();
                const state  = (client.residential_state  || '').trim();
                const zip    = (client.residential_zip    || '').trim();
                if (!street && !city && !state && !zip) return '—';
                const line2Parts = [city, state && zip ? state + ' ' + zip : state || zip].filter(Boolean);
                const line2 = line2Parts.join(', ');
                return (
                  <>
                    {street && <div>{street}</div>}
                    {line2  && <div>{line2}</div>}
                  </>
                );
              })()}
            </div>
          </div>

          <div style={S.spRow}>
            <div style={S.spRowLbl}>AGREEMENTS</div>
            <div style={S.spRowVal}>
              {(() => {
                const agreementsKey = `jpg_agreements_${client.username}`;
                const agreementsRaw = localStorage.getItem(agreementsKey);
                let agreementsData = {};
                try {
                  agreementsData = agreementsRaw ? JSON.parse(agreementsRaw) : {};
                } catch (_) {
                  agreementsData = {};
                }
                const formKeys = ['form_001','form_002','form_003','form_005'];
                const completedCount = formKeys.filter(k => agreementsData[k]?.submitted).length;
                return completedCount + ' of 4 complete';
              })()}
            </div>
          </div>

          <hr style={S.spDivider} />

          <div style={S.spRow}>
            <div style={S.spRowLbl}>SPOKES UNLOCKED</div>
            <div style={{ marginTop: '8px' }}>
              {SPOKE_LABELS.map((spoke, i) => {
                const unlocked = !!client[spoke.key];
                const isLast = i === SPOKE_LABELS.length - 1;
                const isGated = GATED_SPOKES.has(spoke.key);
                const showGateMsg = !unlocked && isGated && !agreementsComplete(client.username);
                return (
                  <div key={spoke.key} style={{
                    padding: '8px 0',
                    borderBottom: isLast ? 'none' : '1px solid #222',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                          cursor: showGateMsg ? 'default' : 'pointer',
                          fontFamily: 'inherit', letterSpacing: '1px',
                        }}
                      >
                        {unlocked ? 'REVOKE' : 'UNLOCK'}
                      </button>
                    </div>
                    {showGateMsg && (
                      <div style={{ color: '#888', fontSize: 11, fontStyle: 'italic', marginTop: 4 }}>
                        Agreements must be completed before this spoke can be unlocked.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div style={S.spFooter}>
        <button style={S.spFullBtn} onClick={() => onOpenFullProfile && onOpenFullProfile(client)}>OPEN FULL PROFILE ▶</button>
      </div>
    </div>
  );
}
