import React from 'react';
import { GOLD, BORDER_DK, TEXT_DIM } from '../utils/constants';

const rule60 = {
  width: 60, height: 1, background: GOLD, border: 'none', margin: '0 auto',
};

const featureRows = [
  'Post and respond to community threads',
  'Coordinate events with your group',
  'Coach-moderated — focused and purposeful',
];

export default function EventsBoardView({ user }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '80vh', background: '#0F0F0F', padding: '60px 40px',
    }}>
      <hr style={{ ...rule60, marginBottom: 24 }} />

      <div style={{
        color: GOLD, fontWeight: 700, fontSize: 28,
        letterSpacing: '4px', textAlign: 'center',
      }}>
        EVENTS BOARD
      </div>

      <hr style={{ ...rule60, marginTop: 12, marginBottom: 32 }} />

      <div style={{
        color: '#fff', fontSize: 13, letterSpacing: '3px',
        textAlign: 'center', marginBottom: 32,
      }}>
        COMMUNITY. CONNECTION. ACCOUNTABILITY.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {featureRows.map(text => (
          <div key={text} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            marginBottom: 16, textAlign: 'center',
          }}>
            <span style={{ color: GOLD, fontSize: 14 }}>▸</span>
            <span style={{ color: '#fff', fontSize: 14 }}>{text}</span>
          </div>
        ))}
      </div>

      <hr style={{
        border: 'none', borderTop: `1px solid ${BORDER_DK}`,
        maxWidth: 320, width: '100%', margin: '32px auto',
      }} />

      <div style={{
        color: TEXT_DIM, fontSize: 11, letterSpacing: '3px',
        textAlign: 'center', fontStyle: 'italic',
      }}>
        COMING SOON
      </div>
    </div>
  );
}
