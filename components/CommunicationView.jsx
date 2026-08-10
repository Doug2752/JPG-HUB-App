import React, { useState, useEffect, useRef, useCallback } from 'react';
import { S } from '../utils/styles';
import { GOLD, DARK, DARKER, BORDER_DK, TEXT_DIM, TEXT_MID, RED, GREEN } from '../utils/constants';
import { getClients } from '../services/clients';
import { storage } from '../services/storage';

const TABS = [
  { id: 'messages', label: 'MESSAGES' },
  { id: 'announcements', label: 'ANNOUNCEMENTS' },
  { id: 'scheduled', label: 'SCHEDULED COMMUNICATION' },
];

const SCHED_TYPES = ['Phone Call', 'Text Message', 'Email', 'Online Video (Teams / Zoom)', 'In Person', 'Other'];

const STATE_TZ_OFFSET = {
  CA: 0, OR: 0, WA: 0, NV: 0,
  AZ: 1, CO: 1, UT: 1, NM: 1, ID: 1, MT: 1, WY: 1,
  TX: 2, OK: 2, KS: 2, NE: 2, SD: 2, ND: 2, MN: 2, IA: 2, MO: 2, AR: 2, LA: 2,
  WI: 2, IL: 2, MI: 2, IN: 2, TN: 2, MS: 2, AL: 2,
  ME: 3, NH: 3, VT: 3, MA: 3, RI: 3, CT: 3, NY: 3, NJ: 3, PA: 3, DE: 3, MD: 3,
  VA: 3, WV: 3, NC: 3, SC: 3, GA: 3, FL: 3, OH: 3, KY: 3,
};

async function getMessages() {
  const v = await storage.get('hub_messages');
  return v && v.value ? JSON.parse(v.value) : [];
}
async function saveMessages(msgs) {
  await storage.set('hub_messages', JSON.stringify(msgs));
}
async function getAnnouncements() {
  const v = await storage.get('hub_announcements');
  return v && v.value ? JSON.parse(v.value) : [];
}
async function saveAnnouncements(anns) {
  await storage.set('hub_announcements', JSON.stringify(anns));
}
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

const inputStyle = {
  width: '100%', padding: '8px 10px', background: '#1a1a1a',
  border: '1px solid #333', borderRadius: 4, color: '#fff', fontSize: 13,
  marginBottom: 12, boxSizing: 'border-box', fontFamily: 'inherit',
};
const labelStyle = {
  fontSize: 11, color: '#888', fontWeight: 700, letterSpacing: '1px',
  marginBottom: 4, display: 'block',
};
const detailLabel = {
  color: TEXT_DIM, fontSize: 9, letterSpacing: '2px', fontWeight: 700, marginBottom: 5,
};
const textareaStyle = { ...inputStyle, minHeight: 80, resize: 'vertical' };

const checkboxStyle = {
  width: 14, height: 14, borderRadius: 2, flexShrink: 0,
  border: `2px solid #444`, background: 'transparent',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', fontSize: 9, color: '#000', fontWeight: 900,
};
const checkboxCheckedStyle = {
  ...checkboxStyle,
  border: `2px solid ${GOLD}`, background: GOLD,
};

export default function CommunicationView({ user }) {
  const [activeTab, setActiveTab] = useState('messages');

  const [clients, setClients] = useState([]);
  const [threads, setThreads] = useState([]);
  const [checkedClients, setCheckedClients] = useState({});
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  const [announcements, setAnnouncements] = useState([]);
  const [annFormData, setAnnFormData] = useState({ title: '', body: '' });
  const [showAnnForm, setShowAnnForm] = useState(false);
  const [annError, setAnnError] = useState(null);
  const [selectedAnn, setSelectedAnn] = useState(null);

  const [scheduled, setScheduled] = useState([]);
  const [schedFormData, setSchedFormData] = useState({
    client_id: '', client_username: '', title: '', type: 'Phone Call', date: '', time: '', notes: '',
  });
  const [showSchedForm, setShowSchedForm] = useState(false);
  const [schedError, setSchedError] = useState(null);
  const [selectedSched, setSelectedSched] = useState(null);
  const [schedFooterMode, setSchedFooterMode] = useState(null);
  const [reschedDate, setReschedDate] = useState('');
  const [reschedTime, setReschedTime] = useState('');
  const [coachNotes, setCoachNotes] = useState('');
  const coachNotesTimerRef = useRef(null);

  useEffect(() => { loadAll(); }, []);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [threads, checkedClients]);

  useEffect(() => {
    if (selectedSched) {
      setCoachNotes(selectedSched.coach_notes || '');
      setSchedFooterMode(null);
      setReschedDate('');
      setReschedTime('');
    }
  }, [selectedSched]);

  async function loadAll() {
    const [c, m, a, s] = await Promise.all([
      getClients(), getMessages(), getAnnouncements(), getScheduledItems(),
    ]);
    setClients(c);
    setThreads(m);
    setAnnouncements(a);
    setScheduled(s);
  }

  function getThreadForClient(clientId) {
    return threads.find(t => t.client_id === clientId) || null;
  }

  const checkedIds = Object.keys(checkedClients).filter(id => checkedClients[id]);
  const checkedCount = checkedIds.length;
  const allChecked = clients.length > 0 && clients.every(c => checkedClients[c.id]);

  function toggleClient(clientId) {
    setCheckedClients(prev => ({ ...prev, [clientId]: !prev[clientId] }));
  }

  function toggleAll() {
    if (allChecked) {
      setCheckedClients({});
    } else {
      const next = {};
      clients.forEach(c => { next[c.id] = true; });
      setCheckedClients(next);
    }
  }

  const sendDisabled = checkedCount === 0 || !messageInput.trim();

  async function handleSendMessage() {
    const text = messageInput.trim();
    if (!text || checkedCount === 0) return;
    const now = new Date().toISOString();
    const baseEntry = { sender: user.username, text, timestamp: now };
    let updated = [...threads];

    for (const cId of checkedIds) {
      const c = clients.find(cl => cl.id === cId);
      if (!c) continue;
      const entry = { ...baseEntry, id: 'entry_' + Date.now() + '_' + c.id };
      const idx = updated.findIndex(t => t.client_id === c.id);
      if (idx >= 0) {
        updated[idx] = { ...updated[idx], messages: [...updated[idx].messages, entry] };
      } else {
        updated.push({
          id: 'msg_' + Date.now() + '_' + c.id,
          client_id: c.id,
          client_username: c.username,
          messages: [entry],
        });
      }
    }

    await saveMessages(updated);
    setThreads(updated);
    setMessageInput('');
  }

  async function handleSaveAnnouncement() {
    if (!annFormData.title.trim()) { setAnnError('Title is required.'); return; }
    if (!annFormData.body.trim()) { setAnnError('Body is required.'); return; }
    const ann = {
      id: 'ann_' + Date.now(),
      title: annFormData.title.trim(),
      body: annFormData.body.trim(),
      created_by: user.username,
      created_at: new Date().toISOString(),
    };
    const updated = [ann, ...announcements];
    await saveAnnouncements(updated);
    setAnnouncements(updated);
    setAnnFormData({ title: '', body: '' });
    setAnnError(null);
    setShowAnnForm(false);
  }

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

  // ── MESSAGES TAB ─────────────────────────────────────────────
  function renderMessagesTab() {
    const singleSelected = checkedCount === 1 ? clients.find(c => c.id === checkedIds[0]) : null;
    const thread = singleSelected ? getThreadForClient(singleSelected.id) : null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <div style={{
          width: '100%', background: DARKER, borderTop: `1px solid ${GOLD}`,
          padding: '8px 20px', boxSizing: 'border-box', flexShrink: 0,
        }}>
          <span style={{ color: TEXT_DIM, fontSize: 11, fontStyle: 'italic', letterSpacing: '0.5px' }}>
            In-app messages only — clients must be logged into HUB to receive messages. This is not email or text.
          </span>
        </div>
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{
          width: 240, flexShrink: 0, borderRight: `1px solid ${BORDER_DK}`,
          overflowY: 'auto', background: DARKER,
        }}>
          <div
            onClick={toggleAll}
            style={{
              padding: '14px 16px', cursor: 'pointer',
              borderBottom: `1px solid ${BORDER_DK}`,
              background: allChecked ? 'rgba(184,134,11,0.08)' : 'transparent',
              borderLeft: allChecked ? `3px solid ${GOLD}` : '3px solid transparent',
              display: 'flex', alignItems: 'center', gap: 10,
            }}
          >
            <div style={allChecked ? checkboxCheckedStyle : checkboxStyle}>
              {allChecked ? '✓' : ''}
            </div>
            <div>
              <div style={{ color: GOLD, fontSize: 12, fontWeight: 900, letterSpacing: '2px' }}>
                ALL CLIENTS
              </div>
              <div style={{ color: TEXT_DIM, fontSize: 10, marginTop: 2, letterSpacing: '1px' }}>
                Broadcast to all
              </div>
            </div>
          </div>

          {clients.map(c => {
            const isChecked = !!checkedClients[c.id];
            const clientThread = getThreadForClient(c.id);
            const lastMsg = clientThread && clientThread.messages.length > 0
              ? clientThread.messages[clientThread.messages.length - 1] : null;
            return (
              <div
                key={c.id}
                onClick={() => toggleClient(c.id)}
                style={{
                  padding: '12px 16px', cursor: 'pointer',
                  borderBottom: '1px solid #1a1a1a',
                  background: isChecked ? 'rgba(184,134,11,0.08)' : 'transparent',
                  borderLeft: isChecked ? `3px solid ${GOLD}` : '3px solid transparent',
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                }}
              >
                <div style={{ ...(isChecked ? checkboxCheckedStyle : checkboxStyle), marginTop: 1 }}>
                  {isChecked ? '✓' : ''}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{
                    color: isChecked ? '#fff' : TEXT_MID, fontSize: 12,
                    fontWeight: 700, letterSpacing: '1px',
                  }}>
                    {(c.first_name + ' ' + c.last_name).toUpperCase()}
                  </div>
                  {lastMsg && (
                    <div style={{
                      color: TEXT_DIM, fontSize: 10, marginTop: 4,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {lastMsg.text}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {clients.length === 0 && (
            <div style={{ padding: '20px 16px', color: TEXT_DIM, fontSize: 12, textAlign: 'center' }}>
              No clients yet.
            </div>
          )}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {checkedCount > 0 ? (
            <>
              <div style={{
                padding: '14px 20px', borderBottom: `1px solid ${BORDER_DK}`,
                background: DARKER, flexShrink: 0,
              }}>
                <div style={{ color: GOLD, fontSize: 13, fontWeight: 900, letterSpacing: '2px' }}>
                  {singleSelected
                    ? (singleSelected.first_name + ' ' + singleSelected.last_name).toUpperCase()
                    : checkedCount + ' CLIENTS SELECTED'}
                </div>
                {!singleSelected && (
                  <div style={{ color: TEXT_DIM, fontSize: 10, marginTop: 4, letterSpacing: '1px' }}>
                    {checkedCount} clients selected &mdash; message will be sent to each individually
                  </div>
                )}
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
                {singleSelected ? (
                  thread && thread.messages.length > 0 ? (
                    thread.messages.map(msg => {
                      const isCoach = msg.sender === user.username;
                      return (
                        <div key={msg.id} style={{
                          display: 'flex',
                          justifyContent: isCoach ? 'flex-end' : 'flex-start',
                          marginBottom: 12,
                        }}>
                          <div style={{
                            maxWidth: '70%',
                            background: isCoach ? 'rgba(184,134,11,0.15)' : '#1a1a1a',
                            border: `1px solid ${isCoach ? 'rgba(184,134,11,0.3)' : BORDER_DK}`,
                            borderRadius: 6, padding: '10px 14px',
                          }}>
                            <div style={{
                              fontSize: 10, color: isCoach ? GOLD : TEXT_MID,
                              fontWeight: 700, letterSpacing: '1px', marginBottom: 4,
                            }}>
                              {msg.sender.toUpperCase()}
                            </div>
                            <div style={{ color: '#fff', fontSize: 13, lineHeight: '1.4' }}>
                              {msg.text}
                            </div>
                            <div style={{ fontSize: 9, color: TEXT_DIM, marginTop: 6, letterSpacing: '0.5px' }}>
                              {formatTimestamp(msg.timestamp)}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ color: TEXT_DIM, fontSize: 12, textAlign: 'center', paddingTop: 40 }}>
                      No messages yet. Start the conversation below.
                    </div>
                  )
                ) : (
                  <div style={{ color: TEXT_DIM, fontSize: 12, textAlign: 'center', paddingTop: 40 }}>
                    {checkedCount} clients selected &mdash; message will be sent to each individually
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div style={{
                padding: '12px 20px', borderTop: `1px solid ${BORDER_DK}`,
                background: DARKER, flexShrink: 0, display: 'flex', gap: 8,
              }}>
                <input
                  type="text"
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !sendDisabled && handleSendMessage()}
                  placeholder="Type a message..."
                  style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sendDisabled}
                  style={{
                    background: sendDisabled ? '#555' : GOLD,
                    color: sendDisabled ? '#999' : '#000',
                    fontWeight: 700, fontSize: 12,
                    padding: '8px 20px', borderRadius: 4, border: 'none',
                    cursor: sendDisabled ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit', letterSpacing: '1px', flexShrink: 0,
                  }}
                >
                  SEND
                </button>
              </div>
            </>
          ) : (
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: TEXT_DIM, fontSize: 12, letterSpacing: '1px',
            }}>
              Select a client to view messages
            </div>
          )}
        </div>
        </div>
      </div>
    );
  }

  // ── ANNOUNCEMENTS TAB ────────────────────────────────────────
  function renderAnnouncementsTab() {
    return (
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
          <div style={S.sectionBar}>
            <h3 style={S.sectionBarH3}>ANNOUNCEMENTS</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={S.sectionBarSpan}>{announcements.length} TOTAL</span>
              <button
                onClick={() => { setShowAnnForm(true); setSelectedAnn(null); }}
                style={{
                  background: DARK, color: GOLD, fontWeight: 700, fontSize: 12,
                  padding: '6px 16px', borderRadius: 4, border: `1.5px solid ${GOLD}`,
                  cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '1px',
                }}
              >
                NEW ANNOUNCEMENT
              </button>
            </div>
          </div>

          {showAnnForm && (
            <div style={{
              background: '#111', border: '1.5px solid #333', borderRadius: 6,
              padding: 20, marginBottom: 16,
            }}>
              <div style={{ color: GOLD, fontSize: 13, fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>
                NEW ANNOUNCEMENT
              </div>
              <label style={labelStyle}>TITLE</label>
              <input
                type="text" value={annFormData.title}
                onChange={e => setAnnFormData(p => ({ ...p, title: e.target.value }))}
                style={inputStyle}
              />
              <label style={labelStyle}>BODY</label>
              <textarea
                value={annFormData.body}
                onChange={e => setAnnFormData(p => ({ ...p, body: e.target.value }))}
                style={textareaStyle}
              />
              {annError && (
                <div style={{ color: '#CC2222', fontSize: 12, marginBottom: 8 }}>{annError}</div>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button onClick={handleSaveAnnouncement} style={{
                  background: GOLD, color: '#000', fontWeight: 700, fontSize: 13,
                  padding: '8px 20px', borderRadius: 4, border: 'none',
                  cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '1px',
                }}>
                  SAVE
                </button>
                <button onClick={() => { setShowAnnForm(false); setAnnError(null); }} style={{
                  background: 'transparent', color: '#888', fontWeight: 600, fontSize: 13,
                  padding: '8px 20px', borderRadius: 4, border: '1px solid #444',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  CANCEL
                </button>
              </div>
            </div>
          )}

          {announcements.length === 0 && !showAnnForm ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#666', fontSize: 14 }}>
              No announcements yet.
            </div>
          ) : announcements.length > 0 ? (
            <div style={S.clientTable}>
              {announcements.map((ann, i) => {
                const isActive = selectedAnn && selectedAnn.id === ann.id;
                return (
                  <div
                    key={ann.id}
                    onClick={() => setSelectedAnn(isActive ? null : ann)}
                    style={{
                      padding: '14px 18px', cursor: 'pointer',
                      borderBottom: i < announcements.length - 1 ? '1px solid #1a1a1a' : 'none',
                      background: isActive ? 'rgba(184,134,11,0.08)' : 'transparent',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: '1px' }}>
                        {ann.title}
                      </span>
                      <span style={{ color: TEXT_DIM, fontSize: 10, letterSpacing: '1px' }}>
                        {formatTimestamp(ann.created_at)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        {selectedAnn && (
          <div style={{
            width: 360, flexShrink: 0, borderLeft: `1px solid ${BORDER_DK}`,
            background: '#111', display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}>
            <div style={{
              padding: '18px 20px', borderBottom: `1px solid ${BORDER_DK}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <h3 style={{ color: GOLD, fontSize: 13, fontWeight: 900, letterSpacing: '2px', margin: 0 }}>
                ANNOUNCEMENT
              </h3>
              <button onClick={() => setSelectedAnn(null)} style={{
                background: 'none', border: `1px solid ${BORDER_DK}`, color: TEXT_MID,
                width: 28, height: 28, borderRadius: 2, cursor: 'pointer',
                fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'inherit',
              }}>{'✕'}</button>
            </div>
            <div style={{ padding: 20, flex: 1, overflowY: 'auto' }}>
              <div style={{ marginBottom: 16 }}>
                <div style={detailLabel}>TITLE</div>
                <div style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>{selectedAnn.title}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={detailLabel}>BODY</div>
                <div style={{ color: '#ddd', fontSize: 13, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{selectedAnn.body}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={detailLabel}>DATE</div>
                <div style={{ color: TEXT_MID, fontSize: 12 }}>{formatTimestamp(selectedAnn.created_at)}</div>
              </div>
              <div>
                <div style={detailLabel}>CREATED BY</div>
                <div style={{ color: TEXT_MID, fontSize: 12 }}>{selectedAnn.created_by}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── SCHEDULED TAB ────────────────────────────────────────────
  function renderScheduledTab() {
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

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{
        display: 'flex', gap: 0, borderBottom: `1px solid ${BORDER_DK}`,
        background: DARKER, flexShrink: 0,
      }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedAnn(null);
                setSelectedSched(null);
                setSchedFooterMode(null);
              }}
              style={{
                padding: '14px 24px', cursor: 'pointer',
                fontSize: 11, fontWeight: 700, letterSpacing: '2px',
                color: isActive ? GOLD : TEXT_MID,
                borderBottom: isActive ? `2px solid ${GOLD}` : '2px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </div>
          );
        })}
      </div>

      {activeTab === 'messages' && renderMessagesTab()}
      {activeTab === 'announcements' && renderAnnouncementsTab()}
      {activeTab === 'scheduled' && renderScheduledTab()}
    </div>
  );
}
