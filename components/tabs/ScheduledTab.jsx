import React, { useRef, useCallback, useEffect } from 'react';
import { S } from '../../utils/styles';
import { GOLD, DARK, DARKER, BORDER_DK, TEXT_DIM, TEXT_MID, RED, GREEN } from '../../utils/constants';
import { storage } from '../../services/storage';

const SCHED_TYPES = ['Phone Call', 'Text Message', 'Email', 'Online Video (Teams / Zoom)', 'In Person', 'Other'];

const STATE_TZ_OFFSET = {
  CA: 0, OR: 0, WA: 0, NV: 0,
  AZ: 1, CO: 1, UT: 1, NM: 1, ID: 1, MT: 1, WY: 1,
  TX: 2, OK: 2, KS: 2, NE: 2, SD: 2, ND: 2, MN: 2, IA: 2, MO: 2, AR: 2, LA: 2,
  WI: 2, IL: 2, MI: 2, IN: 2, TN: 2, MS: 2, AL: 2,
  ME: 3, NH: 3, VT: 3, MA: 3, RI: 3, CT: 3, NY: 3, NJ: 3, PA: 3, DE: 3, MD: 3,
  VA: 3, WV: 3, NC: 3, SC: 3, GA: 3, FL: 3, OH: 3, KY: 3,
};

async function getScheduledItems() {
  const v = await storage.get('hub_scheduled');
  return v && v.value ? JSON.parse(v.value) : [];
}
async function saveScheduledItems(items) {
  await storage.set('hub_scheduled', JSON.stringify(items));
}
async function getCompletedItems() {
  const v = await storage.get('hub_scheduled_completed');
  return v && v.value ? JSON.parse(v.value) : [];
}
async function saveCompletedItems(items) {
  await storage.set('hub_scheduled_completed', JSON.stringify(items));
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00Z');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[d.getUTCMonth()] + ' ' + d.getUTCDate() + ', ' + d.getUTCFullYear();
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [hh, mm] = timeStr.split(':');
  let h = parseInt(hh, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return h + ':' + mm + ' ' + ampm;
}

function formatTimestamp(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let h = d.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const min = String(d.getMinutes()).padStart(2, '0');
  return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear() + ' ' + h + ':' + min + ' ' + ampm;
}

const inputStyle = {
  width: '100%', padding: '8px 10px', background: '#1a1a1a',
  border: '1px solid #333', borderRadius: 4, color: '#fff', fontSize: 13,
  marginBottom: 12, boxSizing: 'border-box', fontFamily: 'inherit',
};
const labelStyle = {
  fontSize: 11, color: '#888', fontWeight: 700, letterSpacing: '1px',
  marginBottom: 4, display: 'block',
};
const textareaStyle = { ...inputStyle, minHeight: 80, resize: 'vertical' };
const detailLabel = {
  color: TEXT_DIM, fontSize: 9, letterSpacing: '2px', fontWeight: 700, marginBottom: 5,
};

export default function ScheduledTab({ user, clients, scheduled, setScheduled, schedFormData, setSchedFormData, showSchedForm, setShowSchedForm, schedError, setSchedError, selectedSched, setSelectedSched, schedFooterMode, setSchedFooterMode, reschedDate, setReschedDate, reschedTime, setReschedTime, coachNotes, setCoachNotes }) {
  const coachNotesTimerRef = useRef(null);

  useEffect(() => {
    if (selectedSched) {
      setCoachNotes(selectedSched.coach_notes || '');
      setSchedFooterMode(null);
      setReschedDate('');
      setReschedTime('');
    }
  }, [selectedSched]);

  function getTimezoneHelper() {
    if (!schedFormData.client_id) return null;
    const c = clients.find(cl => cl.id === schedFormData.client_id);
    if (!c) return null;
    const state = (c.residential_state || '').toUpperCase().trim();
    if (!state) return { text: 'No address on file for this client', color: TEXT_DIM };
    const offset = STATE_TZ_OFFSET[state];
    if (offset === undefined) return { text: 'No address on file for this client', color: TEXT_DIM };
    if (offset === 0) return null;
    const dir = 'ahead of';
    const name = c.first_name + ' ' + c.last_name;
    return {
      text: name + ' is in ' + state + ' — ' + offset + ' hour' + (offset > 1 ? 's' : '') + ' ' + dir + ' Pacific time',
      color: GOLD,
    };
  }

  async function handleSaveScheduled() {
    if (!schedFormData.title.trim()) { setSchedError('Title is required.'); return; }
    if (!schedFormData.date) { setSchedError('Date is required.'); return; }
    const item = {
      id: 'sched_' + Date.now(),
      client_id: schedFormData.client_id,
      client_username: schedFormData.client_username,
      title: schedFormData.title.trim(),
      type: schedFormData.type,
      date: schedFormData.date,
      time: schedFormData.time,
      notes: schedFormData.notes.trim(),
      coach_notes: '',
      created_by: user.username,
      created_at: new Date().toISOString(),
    };
    const updated = [...scheduled, item].sort((a, b) => a.date.localeCompare(b.date));
    await saveScheduledItems(updated);
    setScheduled(updated);
    setSchedFormData({ client_id: '', client_username: '', title: '', type: 'Phone Call', date: '', time: '', notes: '' });
    setSchedError(null);
    setShowSchedForm(false);
  }

  const handleCoachNotesChange = useCallback((value) => {
    setCoachNotes(value);
    if (coachNotesTimerRef.current) clearTimeout(coachNotesTimerRef.current);
    coachNotesTimerRef.current = setTimeout(async () => {
      if (!selectedSched) return;
      const items = await getScheduledItems();
      const idx = items.findIndex(s => s.id === selectedSched.id);
      if (idx === -1) return;
      items[idx] = { ...items[idx], coach_notes: value };
      await saveScheduledItems(items);
      setScheduled(items);
      setSelectedSched(items[idx]);
    }, 800);
  }, [selectedSched]);

  async function handleComplete() {
    const completed = await getCompletedItems();
    completed.push({
      ...selectedSched,
      coach_notes: coachNotes,
      status: 'completed',
      completed_at: new Date().toISOString(),
      completion_notes: coachNotes,
    });
    await saveCompletedItems(completed);
    const updated = scheduled.filter(s => s.id !== selectedSched.id);
    await saveScheduledItems(updated);
    setScheduled(updated);
    setSelectedSched(null);
    setSchedFooterMode(null);
  }

  async function handleCancel() {
    const completed = await getCompletedItems();
    completed.push({
      ...selectedSched,
      coach_notes: coachNotes,
      status: 'cancelled',
      completed_at: new Date().toISOString(),
      completion_notes: coachNotes,
    });
    await saveCompletedItems(completed);
    const updated = scheduled.filter(s => s.id !== selectedSched.id);
    await saveScheduledItems(updated);
    setScheduled(updated);
    setSelectedSched(null);
    setSchedFooterMode(null);
  }

  async function handleReschedule() {
    if (!reschedDate) return;
    const items = await getScheduledItems();
    const idx = items.findIndex(s => s.id === selectedSched.id);
    if (idx === -1) return;
    const item = { ...items[idx] };
    if (!item.original_date) {
      item.original_date = item.date;
      item.original_time = item.time || '';
    }
    item.date = reschedDate;
    item.time = reschedTime;
    items[idx] = item;
    const sorted = items.sort((a, b) => a.date.localeCompare(b.date));
    await saveScheduledItems(sorted);
    setScheduled(sorted);
    setSelectedSched(item);
    setSchedFooterMode(null);
    setReschedDate('');
    setReschedTime('');
  }

  const sorted = [...scheduled].sort((a, b) => a.date.localeCompare(b.date));
  const tzHelper = getTimezoneHelper();

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
        <div style={S.sectionBar}>
          <h3 style={S.sectionBarH3}>SCHEDULED COMMUNICATION</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={S.sectionBarSpan}>{scheduled.length} TOTAL</span>
            <button
              onClick={() => { setShowSchedForm(true); setSelectedSched(null); }}
              style={{
                background: DARK, color: GOLD, fontWeight: 700, fontSize: 12,
                padding: '6px 16px', borderRadius: 4, border: `1.5px solid ${GOLD}`,
                cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '1px',
              }}
            >
              NEW SCHEDULED
            </button>
          </div>
        </div>

        {showSchedForm && (
          <div style={{
            background: '#111', border: '1.5px solid #333', borderRadius: 6,
            padding: 20, marginBottom: 16,
          }}>
            <div style={{ color: GOLD, fontSize: 13, fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>
              NEW SCHEDULED COMMUNICATION
            </div>

            <label style={labelStyle}>CLIENT</label>
            <select
              value={schedFormData.client_id}
              onChange={e => {
                const cId = e.target.value;
                const c = clients.find(cl => cl.id === cId);
                setSchedFormData(p => ({
                  ...p,
                  client_id: cId,
                  client_username: c ? c.username : '',
                }));
              }}
              style={{ ...inputStyle, appearance: 'auto' }}
            >
              <option value="">{'—'} Select Client {'—'}</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.first_name + ' ' + c.last_name}
                </option>
              ))}
            </select>
            {tzHelper && (
              <div style={{ color: tzHelper.color, fontSize: 10, letterSpacing: '0.5px', marginTop: -8, marginBottom: 12 }}>
                {tzHelper.text}
              </div>
            )}

            <label style={labelStyle}>TITLE</label>
            <input
              type="text" value={schedFormData.title}
              onChange={e => setSchedFormData(p => ({ ...p, title: e.target.value }))}
              style={inputStyle}
            />
            <label style={labelStyle}>TYPE</label>
            <select
              value={schedFormData.type}
              onChange={e => setSchedFormData(p => ({ ...p, type: e.target.value }))}
              style={{ ...inputStyle, appearance: 'auto' }}
            >
              {SCHED_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>DATE</label>
                <input
                  type="date" value={schedFormData.date}
                  onChange={e => setSchedFormData(p => ({ ...p, date: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>TIME</label>
                <input
                  type="time" value={schedFormData.time}
                  onChange={e => setSchedFormData(p => ({ ...p, time: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            </div>

            <label style={labelStyle}>NOTES</label>
            <textarea
              value={schedFormData.notes}
              onChange={e => setSchedFormData(p => ({ ...p, notes: e.target.value }))}
              placeholder="Optional"
              style={textareaStyle}
            />
            {schedError && (
              <div style={{ color: '#CC2222', fontSize: 12, marginBottom: 8 }}>{schedError}</div>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button onClick={handleSaveScheduled} style={{
                background: GOLD, color: '#000', fontWeight: 700, fontSize: 13,
                padding: '8px 20px', borderRadius: 4, border: 'none',
                cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '1px',
              }}>
                SAVE
              </button>
              <button onClick={() => { setShowSchedForm(false); setSchedError(null); }} style={{
                background: 'transparent', color: '#888', fontWeight: 600, fontSize: 13,
                padding: '8px 20px', borderRadius: 4, border: '1px solid #444',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                CANCEL
              </button>
            </div>
          </div>
        )}

        {sorted.length === 0 && !showSchedForm ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#666', fontSize: 14 }}>
            No scheduled communications yet.
          </div>
        ) : sorted.length > 0 ? (
          <div style={S.clientTable}>
            {sorted.map((item, i) => {
              const isActive = selectedSched && selectedSched.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedSched(isActive ? null : item)}
                  style={{
                    padding: '14px 18px', cursor: 'pointer',
                    borderBottom: i < sorted.length - 1 ? '1px solid #1a1a1a' : 'none',
                    background: isActive ? 'rgba(184,134,11,0.08)' : 'transparent',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}
                >
                  <span style={{ color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: '1px' }}>
                    {item.title}
                  </span>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <span style={{
                      color: GOLD, fontSize: 10, fontWeight: 700, letterSpacing: '1px',
                      background: 'rgba(184,134,11,0.1)', padding: '3px 8px', borderRadius: 2,
                    }}>
                      {item.type.toUpperCase()}
                    </span>
                    <span style={{ color: TEXT_DIM, fontSize: 11, letterSpacing: '1px' }}>
                      {formatDate(item.date)}
                      {item.time ? ' ' + formatTime(item.time) : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      {selectedSched && (
        <div style={{
          width: 360, flexShrink: 0, borderLeft: `1px solid ${BORDER_DK}`,
          background: '#111', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{
            padding: '18px 20px', borderBottom: `1px solid ${BORDER_DK}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <h3 style={{ color: GOLD, fontSize: 13, fontWeight: 900, letterSpacing: '2px', margin: 0 }}>
              DETAIL
            </h3>
            <button onClick={() => { setSelectedSched(null); setSchedFooterMode(null); }} style={{
              background: 'none', border: `1px solid ${BORDER_DK}`, color: TEXT_MID,
              width: 28, height: 28, borderRadius: 2, cursor: 'pointer',
              fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'inherit',
            }}>{'✕'}</button>
          </div>
          <div style={{ padding: 20, flex: 1, overflowY: 'auto' }}>
            {selectedSched.client_username && (
              <div style={{ marginBottom: 16 }}>
                <div style={detailLabel}>CLIENT</div>
                <div style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>
                  {(() => {
                    const c = clients.find(cl => cl.id === selectedSched.client_id);
                    return c ? (c.first_name + ' ' + c.last_name).toUpperCase() : selectedSched.client_username;
                  })()}
                </div>
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <div style={detailLabel}>TITLE</div>
              <div style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>{selectedSched.title}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={detailLabel}>TYPE</div>
              <div style={{ color: GOLD, fontSize: 12, fontWeight: 700 }}>{selectedSched.type}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={detailLabel}>DATE</div>
              <div style={{ color: '#fff', fontSize: 13 }}>
                {formatDate(selectedSched.date)}
                {selectedSched.time ? ' at ' + formatTime(selectedSched.time) : ''}
              </div>
            </div>
            {selectedSched.original_date && (
              <div style={{ marginBottom: 16 }}>
                <div style={detailLabel}>ORIGINAL DATE</div>
                <div style={{ color: TEXT_DIM, fontSize: 12 }}>
                  {formatDate(selectedSched.original_date)}
                  {selectedSched.original_time ? ' at ' + formatTime(selectedSched.original_time) : ''}
                </div>
              </div>
            )}
            {selectedSched.notes && (
              <div style={{ marginBottom: 16 }}>
                <div style={detailLabel}>NOTES</div>
                <div style={{ color: '#ddd', fontSize: 13, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{selectedSched.notes}</div>
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <div style={detailLabel}>CREATED BY</div>
              <div style={{ color: TEXT_MID, fontSize: 12 }}>{selectedSched.created_by}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={detailLabel}>CREATED</div>
              <div style={{ color: TEXT_MID, fontSize: 12 }}>{formatTimestamp(selectedSched.created_at)}</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={detailLabel}>COACH NOTES</div>
              <textarea
                value={coachNotes}
                onChange={e => handleCoachNotesChange(e.target.value)}
                placeholder="Add coach notes..."
                style={{ ...textareaStyle, marginBottom: 0 }}
              />
            </div>
          </div>

          <div style={{
            padding: '16px 20px', borderTop: `1px solid ${BORDER_DK}`, flexShrink: 0,
          }}>
            {!schedFooterMode && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setSchedFooterMode('complete')} style={{
                  flex: 1, background: 'transparent', color: GREEN,
                  fontWeight: 700, fontSize: 11, padding: '10px 4px',
                  borderRadius: 4, border: `1px solid ${GREEN}`,
                  cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '1px',
                }}>
                  COMPLETED
                </button>
                <button onClick={() => setSchedFooterMode('reschedule')} style={{
                  flex: 1, background: 'transparent', color: GOLD,
                  fontWeight: 700, fontSize: 11, padding: '10px 4px',
                  borderRadius: 4, border: `1px solid ${GOLD}`,
                  cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '1px',
                }}>
                  RESCHEDULE
                </button>
                <button onClick={() => setSchedFooterMode('cancel')} style={{
                  flex: 1, background: 'transparent', color: RED,
                  fontWeight: 700, fontSize: 11, padding: '10px 4px',
                  borderRadius: 4, border: `1px solid ${RED}`,
                  cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.5px',
                }}>
                  APPT. CANCELLED / DELETE
                </button>
              </div>
            )}

            {schedFooterMode === 'complete' && (
              <div>
                <div style={{ color: TEXT_MID, fontSize: 11, marginBottom: 10, letterSpacing: '0.5px' }}>
                  Mark as completed? Coach notes will be saved.
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleComplete} style={{
                    flex: 1, background: GREEN, color: '#fff',
                    fontWeight: 700, fontSize: 12, padding: '10px',
                    borderRadius: 4, border: 'none',
                    cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '1px',
                  }}>
                    CONFIRM COMPLETE
                  </button>
                  <button onClick={() => setSchedFooterMode(null)} style={{
                    background: 'transparent', color: '#888', fontWeight: 600, fontSize: 12,
                    padding: '10px 16px', borderRadius: 4, border: '1px solid #444',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                    BACK
                  </button>
                </div>
              </div>
            )}

            {schedFooterMode === 'cancel' && (
              <div>
                <div style={{ color: TEXT_MID, fontSize: 11, marginBottom: 10, letterSpacing: '0.5px' }}>
                  Mark as cancelled? Coach notes will be saved.
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleCancel} style={{
                    flex: 1, background: RED, color: '#fff',
                    fontWeight: 700, fontSize: 12, padding: '10px',
                    borderRadius: 4, border: 'none',
                    cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '1px',
                  }}>
                    CONFIRM CANCEL
                  </button>
                  <button onClick={() => setSchedFooterMode(null)} style={{
                    background: 'transparent', color: '#888', fontWeight: 600, fontSize: 12,
                    padding: '10px 16px', borderRadius: 4, border: '1px solid #444',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                    BACK
                  </button>
                </div>
              </div>
            )}

            {schedFooterMode === 'reschedule' && (
              <div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>NEW DATE</label>
                    <input
                      type="date" value={reschedDate}
                      onChange={e => setReschedDate(e.target.value)}
                      style={{ ...inputStyle, marginBottom: 0 }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>NEW TIME</label>
                    <input
                      type="time" value={reschedTime}
                      onChange={e => setReschedTime(e.target.value)}
                      style={{ ...inputStyle, marginBottom: 0 }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleReschedule} style={{
                    flex: 1, background: GOLD, color: '#000',
                    fontWeight: 700, fontSize: 12, padding: '10px',
                    borderRadius: 4, border: 'none',
                    cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '1px',
                  }}>
                    CONFIRM RESCHEDULE
                  </button>
                  <button onClick={() => setSchedFooterMode(null)} style={{
                    background: 'transparent', color: '#888', fontWeight: 600, fontSize: 12,
                    padding: '10px 16px', borderRadius: 4, border: '1px solid #444',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                    BACK
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
