import React, { useState, useEffect } from 'react';
import { S } from '../utils/styles';
import { GOLD, DARK } from '../utils/constants';
import { createClientRecord, addClient } from '../services/clients';

const SPOKE_FLAGS = [
  'obt_unlocked', 'dop_unlocked', 'pit_unlocked',
  'edu_unlocked', 'comms_unlocked', 'agreements_unlocked',
  'eventsboard_unlocked', 'daily_unlocked', 'resources_unlocked'
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

const inputStyle = {
  width: '100%', padding: '8px 10px', background: '#1a1a1a',
  border: '1px solid #333', borderRadius: 4, color: '#fff', fontSize: 13,
  marginBottom: 12, boxSizing: 'border-box', fontFamily: 'inherit'
};

const labelStyle = { fontSize: 11, color: '#888', fontWeight: 700, letterSpacing: '1px', marginBottom: 4, display: 'block' };

export default function ClientsView({ onOpenPanel }) {
  const [clients, setClients] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', phone: '', email: '',
    program_start_date: ''
  });
  const [formError, setFormError] = useState(null);
  const [addedClient, setAddedClient] = useState(null);

  function reloadClients() {
    try {
      const raw = localStorage.getItem('hub_clients');
      setClients(raw ? JSON.parse(raw) : []);
    } catch (_) {
      setClients([]);
    }
  }

  useEffect(() => { reloadClients(); }, []);

  async function handleAddClient() {
    const { first_name, last_name, phone, program_start_date } = formData;
    if (!first_name.trim()) { setFormError('First name is required.'); return; }
    if (!last_name.trim()) { setFormError('Last name is required.'); return; }
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) { setFormError('Phone must have at least 10 digits.'); return; }
    if (!program_start_date) { setFormError('Program start date is required.'); return; }

    const record = createClientRecord(
      formData.first_name.trim(), formData.last_name.trim(),
      formData.phone, formData.email.trim(), formData.program_start_date
    );
    await addClient(record);
    setAddedClient(record);
    reloadClients();
    setFormData({ first_name: '', last_name: '', phone: '', email: '', program_start_date: '' });
    setFormError(null);
  }

  function updateField(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={S.sectionBarSpan}>SHOWING {clients.length} CLIENTS</span>
          <button
            onClick={() => { setShowAddForm(true); setAddedClient(null); }}
            style={{
              background: DARK, color: GOLD, fontWeight: 700, fontSize: 12,
              padding: '6px 16px', borderRadius: 4, border: '1.5px solid ' + GOLD,
              cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '1px'
            }}
          >
            ADD CLIENT
          </button>
        </div>
      </div>

      {showAddForm && (
        <div style={{
          background: '#111', border: '1.5px solid #333', borderRadius: 6,
          padding: 20, marginBottom: 16
        }}>
          <div style={{ color: GOLD, fontSize: 13, fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>
            NEW CLIENT
          </div>

          <label style={labelStyle}>FIRST NAME</label>
          <input
            type="text" value={formData.first_name}
            onChange={e => updateField('first_name', e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>LAST NAME</label>
          <input
            type="text" value={formData.last_name}
            onChange={e => updateField('last_name', e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>PHONE</label>
          <input
            type="text" value={formData.phone} placeholder="digits only"
            onChange={e => updateField('phone', e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>EMAIL</label>
          <input
            type="text" value={formData.email}
            onChange={e => updateField('email', e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>PROGRAM START DATE</label>
          <input
            type="date" value={formData.program_start_date}
            onChange={e => updateField('program_start_date', e.target.value)}
            style={inputStyle}
          />

          {formError && (
            <div style={{ color: '#CC2222', fontSize: 12, marginBottom: 8 }}>{formError}</div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button
              onClick={handleAddClient}
              style={{
                background: GOLD, color: '#000', fontWeight: 700, fontSize: 13,
                padding: '8px 20px', borderRadius: 4, border: 'none',
                cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '1px'
              }}
            >
              SAVE CLIENT
            </button>
            <button
              onClick={() => { setShowAddForm(false); setFormError(null); }}
              style={{
                background: 'transparent', color: '#888', fontWeight: 600, fontSize: 13,
                padding: '8px 20px', borderRadius: 4, border: '1px solid #444',
                cursor: 'pointer', fontFamily: 'inherit'
              }}
            >
              CANCEL
            </button>
          </div>
        </div>
      )}

      {addedClient && (
        <div style={{
          background: '#0d1f0d', border: '1.5px solid #2e5a2e', borderRadius: 6,
          padding: 16, marginBottom: 16
        }}>
          <div style={{ color: '#4caf50', fontSize: 12, fontWeight: 700, letterSpacing: 1.5, marginBottom: 12 }}>
            CLIENT ADDED — SAVE THESE CREDENTIALS
          </div>
          <div style={{ marginBottom: 8 }}>
            <span style={{ color: '#888', fontSize: 11, letterSpacing: '1px' }}>USERNAME: </span>
            <span style={{ color: GOLD, fontSize: 16, fontWeight: 700, fontFamily: 'monospace' }}>
              {addedClient.username}
            </span>
          </div>
          <div style={{ marginBottom: 16 }}>
            <span style={{ color: '#888', fontSize: 11, letterSpacing: '1px' }}>GENERATED PASSWORD: </span>
            <span style={{ color: GOLD, fontSize: 16, fontWeight: 700, fontFamily: 'monospace' }}>
              {addedClient.password}
            </span>
          </div>
          <button
            onClick={() => { setAddedClient(null); setShowAddForm(false); }}
            style={{
              background: 'transparent', color: '#4caf50', fontWeight: 700, fontSize: 12,
              padding: '6px 16px', borderRadius: 4, border: '1px solid #2e5a2e',
              cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '1px'
            }}
          >
            DONE
          </button>
        </div>
      )}

      {clients.length === 0 && !showAddForm ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#666', fontSize: 14 }}>
          No clients yet. Add your first client to get started.
        </div>
      ) : clients.length > 0 ? (
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
                <div style={S.ctMeta}>{countUnlocked(c)} / 9</div>
                <div style={S.ctAction}>ACTIVE</div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
