import React from 'react';
import { S } from '../utils/styles';

export default function Topbar({ onLogout, user }) {
  const isClient = user?.role === 'client';
  const label = isClient ? 'Client: ' : 'Coach: ';
  const name = isClient
    ? (user.first_name && user.last_name
        ? (user.first_name + ' ' + user.last_name).toUpperCase()
        : user?.username?.toUpperCase() ?? 'CLIENT')
    : (user?.username?.toUpperCase() ?? 'COACH');

  return (
    <div style={S.topbar}>
      <div style={{ ...S.topbarRow, ...S.topbarRow1 }}>
        <div style={S.topbarTitle}>CENTRAL HUB</div>
        <button style={S.topbarLogout} onClick={onLogout}>LOGOUT</button>
      </div>
      <div style={S.topbarRow}>
        <div style={S.topbarJpg}>JONES PERFORMANCE GROUP LLC</div>
        <div style={S.topbarCoach}>
          {label}<span style={S.topbarCoachName}>{name}</span>
        </div>
      </div>
    </div>
  );
}
