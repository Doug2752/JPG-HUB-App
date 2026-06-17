import React from 'react';
import { S } from '../utils/styles';

export default function SlidePanel({ client, onClose }) {
  const isOpen = !!client;

  return (
    <div style={{ ...S.slidePanel, right: isOpen ? 0 : -420 }}>
      <div style={S.spHeader}>
        <h3 style={S.spHeaderName}>{client ? client.name : ''}</h3>
        <button style={S.spClose} onClick={onClose}>✕</button>
      </div>

      {client && (
        <div style={S.spBody}>
          {client.alert && (
            <div style={S.spAlert}>
              <div style={S.spAlertLabel}>⚠ ALERT</div>
              <div style={S.spAlertMsg}>{client.alertMsg}</div>
            </div>
          )}

          <div style={S.spRow}>
            <div style={S.spRowLbl}>PHASE</div>
            <div style={{ ...S.spRowVal, ...S.spRowValGold }}>{client.phase}</div>
          </div>
          <div style={S.spRow}>
            <div style={S.spRowLbl}>LAST ACTIVITY</div>
            <div style={S.spRowVal}>{client.lastActivity}</div>
          </div>
          <div style={S.spRow}>
            <div style={S.spRowLbl}>STREAK</div>
            <div style={S.spRowVal}>{client.streak}</div>
          </div>
          {client.day !== '—' && (
            <div style={S.spRow}>
              <div style={S.spRowLbl}>PROGRESS</div>
              <div style={S.spRowVal}>{client.day}</div>
            </div>
          )}
          <div style={S.spRow}>
            <div style={S.spRowLbl}>STATUS</div>
            <div style={S.spRowVal}>{client.status}</div>
          </div>

          <hr style={S.spDivider} />

          <div style={S.spRow}>
            <div style={S.spRowLbl}>GOAL</div>
            <div style={S.spRowVal}>{client.goal}</div>
          </div>
          <div style={S.spRow}>
            <div style={S.spRowLbl}>COACH NOTES</div>
            <div style={S.spRowVal}>{client.notes}</div>
          </div>
        </div>
      )}

      <div style={S.spFooter}>
        <button style={S.spFullBtn}>OPEN FULL PROFILE ▶</button>
      </div>
    </div>
  );
}
