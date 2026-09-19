import React from 'react';
import { S } from '../utils/styles';

export default function PlaceholderView({ icon, label, sub, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {onBack && <button onClick={onBack} style={{ background: 'transparent', border: '1px solid #C9A84C', color: '#C9A84C', fontSize: 11, fontWeight: 700, padding: '5px 14px', borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit', margin: '10px 0 0 16px', alignSelf: 'flex-start' }}>← BACK</button>}
      <div style={S.emptyView}>
        <div style={S.comingSoonIcon}>{icon}</div>
        <div style={S.emptyLabel}>{label}</div>
        <div style={S.emptySub}>{sub}</div>
      </div>
    </div>
  );
}
