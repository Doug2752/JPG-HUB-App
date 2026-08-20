import React, { useState, useEffect } from 'react';
import { GOLD, DARK, DARKER, BORDER_DK, TEXT_DIM } from '../utils/constants';
import { todayISO } from '../utils/date';

function getEvents() {
  try {
    const raw = localStorage.getItem('hub_events');
    return raw ? JSON.parse(raw) : [];
  } catch (_) { return []; }
}

function saveEvents(events) {
  localStorage.setItem('hub_events', JSON.stringify(events));
}

function sortThreads(threads) {
  const pinned = threads.filter(t => t.pinned);
  const unpinned = threads.filter(t => !t.pinned);
  const upcoming = unpinned.filter(t => t.state === 'UPCOMING');
  const completed = unpinned.filter(t => t.state === 'COMPLETED');
  upcoming.sort((a, b) => (a.event_date || '').localeCompare(b.event_date || ''));
  completed.sort((a, b) => {
    const aLast = a.replies?.length ? a.replies[a.replies.length - 1].created_at : a.created_at;
    const bLast = b.replies?.length ? b.replies[b.replies.length - 1].created_at : b.created_at;
    return (bLast || '').localeCompare(aLast || '');
  });
  pinned.sort((a, b) => (a.event_date || '').localeCompare(b.event_date || ''));
  return [...pinned, ...upcoming, ...completed];
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (_) { return dateStr; }
}

const inputStyle = {
  background: '#111', color: '#fff', border: '1px solid #444',
  borderRadius: 3, padding: '8px 10px', fontSize: 13,
  fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
};

const goldBtn = {
  background: GOLD, color: '#000', fontWeight: 700, fontSize: 11,
  padding: '6px 16px', borderRadius: 4, border: 'none',
  cursor: 'pointer', fontFamily: 'inherit',
};

const ghostBtn = {
  background: 'transparent', color: GOLD, fontWeight: 700, fontSize: 11,
  padding: '6px 16px', borderRadius: 4, border: `1px solid ${GOLD}`,
  cursor: 'pointer', fontFamily: 'inherit',
};

const redBtn = {
  background: 'transparent', color: '#c0392b', fontWeight: 700, fontSize: 11,
  padding: '6px 16px', borderRadius: 4, border: '1px solid #c0392b',
  cursor: 'pointer', fontFamily: 'inherit',
};

const smallGhostBtn = {
  background: 'transparent', color: GOLD, fontWeight: 700, fontSize: 10,
  padding: '3px 8px', borderRadius: 3, border: `1px solid ${GOLD}`,
  cursor: 'pointer', fontFamily: 'inherit',
};

const smallRedBtn = {
  background: 'transparent', color: '#c0392b', fontWeight: 700, fontSize: 10,
  padding: '3px 8px', borderRadius: 3, border: '1px solid #c0392b',
  cursor: 'pointer', fontFamily: 'inherit',
};

function ThreadRow({ thread, isSelected, onClick }) {
  const [hovered, setHovered] = useState(false);
  const replyCount = thread.replies?.length || 0;
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: DARK, border: `1px solid ${isSelected ? GOLD : BORDER_DK}`,
        borderRadius: 5, padding: '12px 16px', marginBottom: 8,
        cursor: 'pointer',
        filter: hovered && !isSelected ? 'brightness(1.12)' : 'none',
        transition: 'filter 0.1s', position: 'relative',
      }}
    >
      {thread.pinned && (
        <span style={{ position: 'absolute', top: 8, right: 10, color: GOLD, fontSize: 11, fontWeight: 700 }}>PIN</span>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div style={{
          color: '#fff', fontWeight: 700, fontSize: 14, flex: 1, marginRight: 8,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {thread.title}
        </div>
        {thread.state === 'UPCOMING'
          ? <span style={{ color: GOLD, fontSize: 10, fontWeight: 700, flexShrink: 0 }}>UPCOMING</span>
          : <span style={{ color: '#888', fontSize: 10, fontStyle: 'italic', flexShrink: 0 }}>COMPLETED</span>
        }
      </div>
      <div style={{ color: TEXT_DIM, fontSize: 12, marginBottom: 4 }}>{formatDate(thread.event_date)}</div>
      <div style={{ color: TEXT_DIM, fontSize: 11, fontStyle: 'italic' }}>
        {replyCount === 0 ? 'No replies yet' : `${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}`}
      </div>
    </div>
  );
}

export default function EventsBoardView({ user }) {
  const [threads, setThreads] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newBody, setNewBody] = useState('');
  const [replyInputs, setReplyInputs] = useState({});
  const [editingThread, setEditingThread] = useState(null);
  const [editingReply, setEditingReply] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDeleteReply, setConfirmDeleteReply] = useState(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setThreads(sortThreads(getEvents()));
  }, []);

  const isCoach = user.role === 'coach';
  const selected = selectedId ? threads.find(t => t.id === selectedId) || null : null;

  function persist(updated) {
    const sorted = sortThreads(updated);
    setThreads(sorted);
    saveEvents(sorted);
  }

  function handlePostThread() {
    if (!newTitle.trim() || !newDate || !newBody.trim()) {
      setFormError('All fields are required.');
      return;
    }
    const thread = {
      id: 'evt_' + Date.now(),
      title: newTitle.trim(),
      event_date: newDate,
      body: newBody.trim(),
      created_by: user.username,
      created_by_role: user.role,
      created_at: todayISO(),
      state: 'UPCOMING',
      pinned: false,
      replies: [],
    };
    persist([thread, ...threads]);
    setSelectedId(thread.id);
    setShowNewForm(false);
    setNewTitle('');
    setNewDate('');
    setNewBody('');
    setFormError('');
  }

  function handleToggleState() {
    if (!selected) return;
    persist(threads.map(t =>
      t.id === selected.id ? { ...t, state: t.state === 'UPCOMING' ? 'COMPLETED' : 'UPCOMING' } : t
    ));
  }

  function handleTogglePin() {
    if (!selected) return;
    persist(threads.map(t =>
      t.id === selected.id ? { ...t, pinned: !t.pinned } : t
    ));
  }

  function handleDeleteThread() {
    if (!selected) return;
    persist(threads.filter(t => t.id !== selected.id));
    setSelectedId(null);
    setConfirmDelete(false);
  }

  function handleSaveThreadEdit() {
    if (!editingThread) return;
    persist(threads.map(t =>
      t.id === editingThread.id ? { ...t, title: editingThread.title, body: editingThread.body } : t
    ));
    setEditingThread(null);
  }

  function handlePostReply() {
    if (!selected) return;
    const text = (replyInputs[selected.id] || '').trim();
    if (!text) return;
    const reply = {
      id: 'reply_' + Date.now(),
      body: text,
      created_by: user.username,
      created_by_role: user.role,
      created_at: todayISO(),
    };
    persist(threads.map(t =>
      t.id === selected.id ? { ...t, replies: [...(t.replies || []), reply] } : t
    ));
    setReplyInputs(prev => ({ ...prev, [selected.id]: '' }));
  }

  function handleSaveReplyEdit() {
    if (!editingReply) return;
    persist(threads.map(t => {
      if (t.id !== editingReply.threadId) return t;
      return { ...t, replies: t.replies.map(r =>
        r.id === editingReply.replyId ? { ...r, body: editingReply.body } : r
      )};
    }));
    setEditingReply(null);
  }

  function handleDeleteReply(threadId, replyId) {
    persist(threads.map(t => {
      if (t.id !== threadId) return t;
      return { ...t, replies: t.replies.filter(r => r.id !== replyId) };
    }));
    setConfirmDeleteReply(null);
  }

  const canMark = selected && (isCoach || selected.created_by === user.username);
  const canPin = isCoach;
  const canEdit = isCoach;
  const canDelete = selected && (isCoach || selected.created_by === user.username);

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* ── LEFT PANEL ── */}
      <div style={{
        width: 340, flexShrink: 0, borderRight: `1px solid ${BORDER_DK}`,
        display: 'flex', flexDirection: 'column', background: DARKER,
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '18px 16px', borderBottom: `1px solid ${BORDER_DK}`, flexShrink: 0,
        }}>
          <div>
            <div style={{ color: GOLD, fontWeight: 700, fontSize: 18, letterSpacing: '3px' }}>
              EVENTS BOARD
            </div>
            <div style={{ color: TEXT_DIM, fontSize: 13, fontStyle: 'italic', marginTop: 4 }}>
              Use the Events Board to post upcoming events, share announcements, and engage with other JPG members.
            </div>
          </div>
          <button
            onClick={() => {
              setShowNewForm(true); setSelectedId(null); setEditingThread(null);
              setConfirmDelete(false); setFormError('');
              setNewTitle(''); setNewDate(''); setNewBody('');
            }}
            style={goldBtn}
          >
            + NEW THREAD
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
          {threads.length === 0 && (
            <div style={{ color: TEXT_DIM, fontSize: 13, fontStyle: 'italic', textAlign: 'center', marginTop: 40 }}>
              No threads yet.
            </div>
          )}
          {threads.map(thread => (
            <ThreadRow
              key={thread.id}
              thread={thread}
              isSelected={selectedId === thread.id}
              onClick={() => {
                setSelectedId(thread.id); setShowNewForm(false);
                setEditingThread(null); setEditingReply(null);
                setConfirmDelete(false); setConfirmDeleteReply(null);
              }}
            />
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: DARK }}>
        {showNewForm ? (
          <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
            <div style={{ color: GOLD, fontWeight: 700, fontSize: 16, marginBottom: 20 }}>NEW THREAD</div>
            <div style={{ marginBottom: 14 }}>
              <input
                type="text"
                placeholder="Thread title"
                value={newTitle}
                onChange={e => { setNewTitle(e.target.value); setFormError(''); }}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <input
                type="date"
                value={newDate}
                onChange={e => { setNewDate(e.target.value); setFormError(''); }}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <textarea
                placeholder="What's happening? Share details..."
                value={newBody}
                onChange={e => { setNewBody(e.target.value); setFormError(''); }}
                rows={5}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
            {formError && (
              <div style={{ color: '#e57373', fontSize: 13, marginBottom: 14 }}>{formError}</div>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handlePostThread} style={goldBtn}>POST THREAD</button>
              <button onClick={() => { setShowNewForm(false); setFormError(''); }} style={ghostBtn}>CANCEL</button>
            </div>
          </div>

        ) : selected ? (
          <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
            {/* Title */}
            {editingThread && editingThread.id === selected.id ? (
              <div style={{ marginBottom: 12 }}>
                <input
                  type="text"
                  value={editingThread.title}
                  onChange={e => setEditingThread({ ...editingThread, title: e.target.value })}
                  style={{ ...inputStyle, fontSize: 18, fontWeight: 700 }}
                />
              </div>
            ) : (
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 6 }}>
                {selected.title}
              </div>
            )}

            {/* Event date + state badge */}
            <div style={{ color: TEXT_DIM, fontSize: 13, marginBottom: 6 }}>
              {formatDate(selected.event_date)}
            </div>
            {selected.state === 'UPCOMING'
              ? <div style={{ color: GOLD, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>UPCOMING</div>
              : <div style={{ color: '#888', fontStyle: 'italic', fontSize: 13, marginBottom: 6 }}>COMPLETED</div>
            }

            {/* Created by */}
            <div style={{ color: TEXT_DIM, fontSize: 11, marginBottom: 16 }}>
              Posted by{' '}
              <span style={{ color: selected.created_by_role === 'coach' ? GOLD : '#ccc', fontWeight: 700 }}>
                {selected.created_by}
              </span>
              {' '}on {formatDate(selected.created_at)}
            </div>

            {/* Action bar */}
            {(canMark || canPin || canEdit || canDelete) && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {canMark && selected.state === 'UPCOMING' && (
                  <button onClick={handleToggleState} style={ghostBtn}>MARK COMPLETE</button>
                )}
                {canMark && selected.state === 'COMPLETED' && (
                  <button onClick={handleToggleState} style={ghostBtn}>MARK UPCOMING</button>
                )}
                {canPin && (
                  <button onClick={handleTogglePin} style={ghostBtn}>
                    {selected.pinned ? 'UNPIN' : 'PIN'}
                  </button>
                )}
                {canEdit && !editingThread && (
                  <button
                    onClick={() => setEditingThread({ id: selected.id, title: selected.title, body: selected.body })}
                    style={ghostBtn}
                  >
                    EDIT THREAD
                  </button>
                )}
                {canDelete && !confirmDelete && (
                  <button onClick={() => setConfirmDelete(true)} style={redBtn}>DELETE THREAD</button>
                )}
                {canDelete && confirmDelete && (
                  <button onClick={handleDeleteThread} style={{ ...redBtn, background: 'rgba(192,57,43,0.15)' }}>
                    CONFIRM DELETE
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            {editingThread && editingThread.id === selected.id ? (
              <div style={{ marginBottom: 20 }}>
                <textarea
                  value={editingThread.body}
                  onChange={e => setEditingThread({ ...editingThread, body: e.target.value })}
                  rows={5}
                  style={{ ...inputStyle, resize: 'vertical', marginBottom: 10 }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleSaveThreadEdit} style={goldBtn}>SAVE</button>
                  <button onClick={() => setEditingThread(null)} style={ghostBtn}>CANCEL</button>
                </div>
              </div>
            ) : (
              <div style={{ color: '#ccc', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 20 }}>
                {selected.body}
              </div>
            )}

            {/* Divider */}
            <hr style={{ border: 'none', borderTop: `1px solid ${BORDER_DK}`, margin: '20px 0' }} />

            {/* Replies header */}
            <div style={{ color: TEXT_DIM, fontSize: 11, fontWeight: 700, letterSpacing: '2px', marginBottom: 14 }}>
              REPLIES
            </div>

            {(!selected.replies || selected.replies.length === 0) && (
              <div style={{ color: TEXT_DIM, fontStyle: 'italic', fontSize: 13, marginBottom: 20 }}>
                No replies yet.
              </div>
            )}

            {(selected.replies || []).map(reply => {
              const isEditingThis = editingReply && editingReply.replyId === reply.id;
              const canEditReply = isCoach || reply.created_by === user.username;
              const isConfirmingDelete = confirmDeleteReply === reply.id;

              return (
                <div key={reply.id} style={{
                  background: '#1e1e1e', borderLeft: `3px solid ${BORDER_DK}`,
                  padding: '10px 14px', marginBottom: 10, borderRadius: '0 4px 4px 0',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{
                      color: reply.created_by_role === 'coach' ? GOLD : '#ccc',
                      fontWeight: 700, fontSize: 12,
                    }}>
                      {reply.created_by}
                    </span>
                    <span style={{ color: TEXT_DIM, fontSize: 10, fontStyle: 'italic' }}>
                      ({reply.created_by_role})
                    </span>
                    <span style={{ color: TEXT_DIM, fontSize: 11 }}>
                      {formatDate(reply.created_at)}
                    </span>
                  </div>

                  {isEditingThis ? (
                    <div style={{ marginTop: 6 }}>
                      <textarea
                        value={editingReply.body}
                        onChange={e => setEditingReply({ ...editingReply, body: e.target.value })}
                        rows={3}
                        style={{ ...inputStyle, resize: 'vertical', marginBottom: 8 }}
                      />
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={handleSaveReplyEdit} style={smallGhostBtn}>SAVE</button>
                        <button onClick={() => setEditingReply(null)} style={smallGhostBtn}>CANCEL</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#ccc', fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap', marginTop: 6 }}>
                      {reply.body}
                    </div>
                  )}

                  {canEditReply && !isEditingThis && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                      <button
                        onClick={() => setEditingReply({ threadId: selected.id, replyId: reply.id, body: reply.body })}
                        style={smallGhostBtn}
                      >
                        EDIT
                      </button>
                      {isConfirmingDelete ? (
                        <button onClick={() => handleDeleteReply(selected.id, reply.id)} style={smallRedBtn}>CONFIRM</button>
                      ) : (
                        <button onClick={() => setConfirmDeleteReply(reply.id)} style={smallRedBtn}>DELETE</button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Reply input */}
            <div style={{ marginTop: 16 }}>
              <textarea
                placeholder="Write a reply..."
                value={replyInputs[selected.id] || ''}
                onChange={e => setReplyInputs(prev => ({ ...prev, [selected.id]: e.target.value }))}
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', marginBottom: 10 }}
              />
              <button onClick={handlePostReply} style={goldBtn}>POST REPLY</button>
            </div>
          </div>

        ) : (
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: TEXT_DIM, fontStyle: 'italic', fontSize: 14,
          }}>
            Select a thread to view
          </div>
        )}
      </div>
    </div>
  );
}
