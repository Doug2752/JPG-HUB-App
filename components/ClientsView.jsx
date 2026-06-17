import React, { useState } from 'react';
import { S } from '../utils/styles';
import { CLIENTS } from '../utils/constants';

const PHASE_STYLE = {
  warm:  { ...S.phaseTag, ...S.ptWarm  },
  found: { ...S.phaseTag, ...S.ptFound },
  perf:  { ...S.phaseTag, ...S.ptPerf  },
  stop:  { ...S.phaseTag, ...S.ptStop  }
};

export default function ClientsView({ onOpenPanel }) {
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <div style={S.clientsScroll}>
      <div style={S.pageHdr}>
        <h2 style={S.pageHdrH2}>ACTIVE CLIENTS</h2>
        <p style={S.pageHdrP}>Select a client for quick reference. Open full profile for complete detail.</p>
      </div>

      <div style={S.statsRow}>
        <div style={S.statBox}>
          <div style={S.statLabel}>ACTIVE CLIENTS</div>
          <div style={S.statValue}>7</div>
          <div style={S.statSub}>across all phases</div>
        </div>
        <div style={S.statBox}>
          <div style={S.statLabel}>CHECK-INS TODAY</div>
          <div style={S.statValue}>4</div>
          <div style={S.statSub}>3 pending review</div>
        </div>
        <div style={S.statBox}>
          <div style={S.statLabel}>UNREAD MESSAGES</div>
          <div style={S.statValue}>2</div>
          <div style={S.statSub}>from clients</div>
        </div>
        <div style={S.statBox}>
          <div style={S.statLabel}>ALERTS</div>
          <div style={{ ...S.statValue, ...S.statValueAlert }}>1</div>
          <div style={S.statSub}>missed tracking day</div>
        </div>
      </div>

      <div style={S.sectionBar}>
        <h3 style={S.sectionBarH3}>CLIENT ROSTER</h3>
        <span style={S.sectionBarSpan}>SHOWING 5 OF 7</span>
      </div>

      <div style={S.clientTable}>
        <div style={{ ...S.ctGrid, ...S.ctHead }}>
          <span style={S.ctHeadCell}>NAME</span>
          <span style={S.ctHeadCell}>PHASE</span>
          <span style={S.ctHeadCell}>LAST ACTIVITY</span>
          <span style={S.ctHeadCell}>STREAK</span>
          <span style={S.ctHeadCell}>STATUS</span>
        </div>

        {CLIENTS.map((c, i) => {
          const isLast    = i === CLIENTS.length - 1;
          const isHovered = hoveredRow === c.id;
          const rowStyle  = {
            ...S.ctGrid,
            ...S.ctRow,
            ...(isLast    ? { borderBottom: 'none' } : {}),
            ...(isHovered ? { background: '#1a1a1a' } : {})
          };
          const streakCol = c.day !== '—' ? c.day : c.streak;

          return (
            <div
              key={c.id}
              style={rowStyle}
              onClick={() => onOpenPanel(c)}
              onMouseEnter={() => setHoveredRow(c.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <div style={S.ctName}>{c.name}</div>
              <div>
                <span style={PHASE_STYLE[c.phaseKey]}>{c.phase}</span>
              </div>
              <div style={S.ctMeta}>{c.lastActivity}</div>
              <div style={S.ctMeta}>{streakCol}</div>
              <div style={c.status === 'MISSED' ? S.ctWarn : S.ctAction}>
                {c.status === 'MISSED' ? '⚠ MISSED' : '▶ VIEW'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
