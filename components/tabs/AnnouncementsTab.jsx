import React from 'react';
import { S } from '../../utils/styles';
import { GOLD, DARK, DARKER, BORDER_DK, TEXT_DIM, TEXT_MID } from '../../utils/constants';
import { storage } from '../../services/storage';

async function getAnnouncements() {
  const v = await storage.get('hub_announcements');
  return v && v.value ? JSON.parse(v.value) : [];
}
async function saveAnnouncements(anns) {
  await storage.set('hub_announcements', JSON.stringify(anns));
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

export default function AnnouncementsTab({ user, announcements, setAnnouncements, annFormData, setAnnFormData, showAnnForm, setShowAnnForm, annError, setAnnError, selectedAnn, setSelectedAnn }) {

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
