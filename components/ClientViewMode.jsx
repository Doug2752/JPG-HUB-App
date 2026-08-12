import React, { useState, useEffect } from 'react';
import { S } from '../utils/styles';
import { GOLD, BORDER_DK, TEXT_DIM, TEXT_MID, DARKER } from '../utils/constants';

function getPhaseInfo(trackingStartDate) {
  if (!trackingStartDate) return null;
  try {
    const today = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00Z');
    const start = new Date(trackingStartDate + 'T00:00:00Z');
    const cycleDay = Math.floor((today - start) / 86400000) + 1;
    let phase;
    if (cycleDay <= 14) phase = 'Foundation Tracking';
    else if (cycleDay <= 21) phase = 'Analysis Week';
    else if (cycleDay <= 30) phase = 'Onramp';
    else phase = 'Active';
    return { cycleDay, phase };
  } catch (_) {
    return null;
  }
}

export default function ClientViewMode({ onBack }) {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectValue, setSelectValue] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('hub_clients');
      setClients(raw ? JSON.parse(raw) : []);
    } catch (_) {
      setClients([]);
    }
  }, []);

  if (!selectedClient) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          background: DARKER, border: `1px solid ${BORDER_DK}`, borderRadius: 6,
          padding: '36px 40px', width: 360, textAlign: 'center',
        }}>
          <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '2px', color: '#fff', marginBottom: 24 }}>
            Select a Client
          </div>
          <select
            value={selectValue}
            onChange={e => setSelectValue(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px', background: '#1a1a1a',
              border: '1px solid #333', borderRadius: 4, color: '#fff', fontSize: 13,
              fontFamily: 'inherit', marginBottom: 20, boxSizing: 'border-box', appearance: 'auto',
            }}
          >
            <option value="">— Select Client —</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.first_name + ' ' + c.last_name}
              </option>
            ))}
          </select>
          <button
            disabled={!selectValue}
            onClick={() => {
              const c = clients.find(cl => cl.id === selectValue);
              if (c) setSelectedClient(c);
            }}
            style={{
              width: '100%', padding: '12px', borderRadius: 4, border: 'none',
              fontFamily: 'inherit', fontSize: 13, fontWeight: 700, letterSpacing: '2px',
              cursor: selectValue ? 'pointer' : 'not-allowed',
              background: selectValue ? GOLD : '#555',
              color: selectValue ? '#000' : '#999',
            }}
          >
            VIEW CLIENT
          </button>
        </div>
      </div>
    );
  }

  const phaseInfo = getPhaseInfo(selectedClient.tracking_start_date);
  const isTier4 = selectedClient.tier === 4;
  const progressPct = phaseInfo ? Math.min(Math.round((phaseInfo.cycleDay / 14) * 100), 100) : 0;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>

        <div
          onClick={() => { setSelectedClient(null); setSelectValue(''); }}
          style={{
            color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: '1px',
            cursor: 'pointer', marginBottom: 20, display: 'inline-block',
          }}
        >
          ← Back to Client List
        </div>

        <div style={{
          background: DARKER, border: `1px solid ${BORDER_DK}`,
          borderRadius: 3, padding: '20px 24px', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 24,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
            background: GOLD, border: `2px solid ${GOLD}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#000', fontSize: 20, fontWeight: 900,
          }}>
            {selectedClient.first_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: '2px' }}>
              {(selectedClient.first_name + ' ' + selectedClient.last_name).toUpperCase()}
            </div>
            <div style={{ fontSize: 10, color: TEXT_DIM, letterSpacing: '1.5px', marginTop: 4 }}>
              JONES PERFORMANCE GROUP LLC
            </div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{
              background: 'rgba(184,134,11,0.12)', color: GOLD,
              border: `1px solid ${GOLD}`, borderRadius: 2,
              fontSize: 9, fontWeight: 700, letterSpacing: '1px',
              padding: '4px 10px', display: 'inline-block',
            }}>
              {(selectedClient.tier_name || 'UNKNOWN').toUpperCase()}
            </div>
          </div>
        </div>

        {isTier4 ? (
          <div style={{
            background: DARKER, border: `1px solid ${BORDER_DK}`,
            borderRadius: 3, padding: '16px 20px', marginBottom: 20,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            {phaseInfo ? (
              <>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '2px', color: GOLD }}>
                  {phaseInfo.phase.toUpperCase()}
                </span>
                <span style={{ fontSize: 12, color: TEXT_MID, letterSpacing: '1px' }}>
                  Day {phaseInfo.cycleDay}
                </span>
              </>
            ) : (
              <span style={{ fontSize: 12, color: TEXT_MID, letterSpacing: '1px' }}>
                Program not yet started
              </span>
            )}
          </div>
        ) : (
          <div style={{
            background: DARKER, border: `1px solid ${BORDER_DK}`,
            borderRadius: 3, padding: '16px 20px', marginBottom: 20,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '2px', color: GOLD }}>
              {(selectedClient.tier_name || 'UNKNOWN').toUpperCase()}
            </span>
            <span style={{ fontSize: 11, color: TEXT_DIM, letterSpacing: '1px' }}>
              Metrics coming for this tier
            </span>
          </div>
        )}

        <div style={{
          background: DARKER, border: `1px solid ${BORDER_DK}`,
          borderRadius: 3, overflow: 'hidden',
        }}>
          <div style={{
            padding: '12px 16px', background: '#161616',
            borderBottom: `1px solid ${BORDER_DK}`,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', color: GOLD }}>
              CLIENT PROGRESS
            </span>
          </div>
          <div style={{ padding: '20px 16px' }}>
            {isTier4 ? (
              phaseInfo ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', color: '#fff' }}>
                      {phaseInfo.phase.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 11, color: GOLD, fontWeight: 700 }}>{progressPct}%</span>
                  </div>
                  <div style={{ background: '#2a2a2a', borderRadius: 2, height: 8, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${progressPct}%`,
                      background: `linear-gradient(90deg, ${GOLD}, #d4a017)`,
                      borderRadius: 2, transition: 'width 0.4s ease',
                    }} />
                  </div>
                  <div style={{ fontSize: 10, color: TEXT_DIM, marginTop: 8, letterSpacing: '1px' }}>
                    Day {phaseInfo.cycleDay} of 14 — progress data will update in real time after backend migration
                  </div>
                </>
              ) : (
                <div style={{ color: TEXT_DIM, fontSize: 12, letterSpacing: '1px' }}>
                  Tracking has not started yet.
                </div>
              )
            ) : (
              <div style={{ color: TEXT_DIM, fontSize: 12, letterSpacing: '1px' }}>
                Detailed metrics for this tier will be available after backend migration.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
