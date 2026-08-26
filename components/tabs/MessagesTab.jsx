import React from 'react';
import { GOLD, DARKER, BORDER_DK, TEXT_DIM, TEXT_MID } from '../../utils/constants';
import { storage } from '../../services/storage';

async function saveMessages(msgs) {
  await storage.set('hub_messages', JSON.stringify(msgs));
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

const checkboxStyle = {
  width: 14, height: 14, borderRadius: 2, flexShrink: 0,
  border: '2px solid #444', background: 'transparent',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', fontSize: 9, color: '#000', fontWeight: 900,
};
const checkboxCheckedStyle = {
  ...checkboxStyle,
  border: `2px solid ${GOLD}`, background: GOLD,
};

export default function MessagesTab({ user, clients, threads, setThreads, checkedClients, setCheckedClients, messageInput, setMessageInput, messagesEndRef, isClient, clientId }) {
  const checkedIds = Object.keys(checkedClients).filter(id => checkedClients[id]);
  const checkedCount = checkedIds.length;
  const allChecked = clients.length > 0 && clients.every(c => checkedClients[c.id]);
  const sendDisabled = checkedCount === 0 || !messageInput.trim();

  function getThreadForClient(clientId) {
    return threads.find(t => t.client_id === clientId) || null;
  }

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

  async function handleClientSendMessage() {
    const text = messageInput.trim();
    if (!text) return;
    const now = new Date().toISOString();
    const entry = { id: 'entry_' + Date.now(), sender: user.username, text, timestamp: now };
    let updated = [...threads];
    const idx = updated.findIndex(t => t.client_id === clientId);
    if (idx >= 0) {
      updated[idx] = { ...updated[idx], messages: [...updated[idx].messages, entry] };
    } else {
      updated.push({
        id: 'msg_' + Date.now(),
        client_id: clientId,
        client_username: user.username,
        messages: [entry],
      });
    }
    await saveMessages(updated);
    setThreads(updated);
    setMessageInput('');
  }

  const singleSelected = checkedCount === 1 ? clients.find(c => c.id === checkedIds[0]) : null;
  const thread = singleSelected ? getThreadForClient(singleSelected.id) : null;

  if (isClient) {
    const clientThread = threads.find(t => t.client_id === clientId);
    const clientSendDisabled = !messageInput.trim();
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {clientThread && clientThread.messages.length > 0 ? (
            clientThread.messages.map(msg => {
              const isOwn = msg.sender === user.username;
              return (
                <div key={msg.id} style={{
                  display: 'flex',
                  justifyContent: isOwn ? 'flex-end' : 'flex-start',
                  marginBottom: 12,
                }}>
                  <div style={{
                    maxWidth: '70%',
                    background: isOwn ? '#1C3A5C' : '#2a2a2a',
                    borderRadius: 6, padding: '10px 14px',
                  }}>
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
              No messages yet. Send a message to your coach below.
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
            onKeyDown={e => e.key === 'Enter' && !clientSendDisabled && handleClientSendMessage()}
            placeholder="Message your coach..."
            style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
          />
          <button
            onClick={handleClientSendMessage}
            disabled={clientSendDisabled}
            style={{
              background: clientSendDisabled ? '#555' : '#ddb94a',
              color: clientSendDisabled ? '#999' : '#000',
              fontWeight: 700, fontSize: 12,
              padding: '8px 20px', borderRadius: 4, border: 'none',
              cursor: clientSendDisabled ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', letterSpacing: '1px', flexShrink: 0,
            }}
          >
            SEND
          </button>
        </div>
      </div>
    );
  }

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
