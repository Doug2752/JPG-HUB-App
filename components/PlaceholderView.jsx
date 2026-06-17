import React from 'react';
import { S } from '../utils/styles';

export default function PlaceholderView({ icon, label, sub }) {
  return (
    <div style={S.emptyView}>
      <div style={S.comingSoonIcon}>{icon}</div>
      <div style={S.emptyLabel}>{label}</div>
      <div style={S.emptySub}>{sub}</div>
    </div>
  );
}
