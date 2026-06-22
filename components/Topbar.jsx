import React from 'react';
import { S } from '../utils/styles';

export default function Topbar({ onLogout }) {
  return (
    <div style={S.topbar}>
      <div style={{ ...S.topbarRow, ...S.topbarRow1 }}>
        <div style={S.topbarTitle}>CENTRAL COMMAND HUB</div>
        <button style={S.topbarLogout} onClick={onLogout}>LOGOUT</button>
      </div>
      <div style={S.topbarRow}>
        <div style={S.topbarJpg}>JONES PERFORMANCE GROUP LLC</div>
        <div style={S.topbarCoach}>
          Coach: <span style={S.topbarCoachName}>DOUG JONES</span>
        </div>
      </div>
    </div>
  );
}
