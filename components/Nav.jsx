import React, { useState } from 'react';
import { S } from '../utils/styles';
import { NAV_ITEMS, LOGO, BORDER_DK } from '../utils/constants';

export default function Nav({ activeView, onViewChange, role }) {
  const [hovered, setHovered] = useState(null);

  const isCoach = role === 'coach';
  const visibleItems = isCoach ? NAV_ITEMS : NAV_ITEMS.filter(item => item.id === 'wheel');

  const isClientView  = activeView === 'clientview';
  const cvHovered     = hovered === 'clientview';
  const cvStyle = {
    ...S.navItem,
    ...(isClientView ? { color: '#6B9BD3', borderLeft: '3px solid #6B9BD3', background: 'rgba(44,74,107,0.15)' } : {}),
    ...(!isClientView && cvHovered ? { color: '#6B9BD3', background: 'rgba(44,74,107,0.08)' } : {})
  };

  return (
    <div style={S.nav}>
      <div style={S.navLogoWrap} onClick={() => onViewChange('wheel')}>
        <img src={LOGO} alt="JPG" style={S.navLogoImg} />
        {isCoach && <div style={S.navRole}>COACH VIEW</div>}
      </div>

      <div style={S.navItems}>
        {visibleItems.map(item => {
          const isActive  = activeView === item.id;
          const isHovered = hovered === item.id;
          const itemStyle = {
            ...S.navItem,
            ...(isActive  ? S.navItemActive  : {}),
            ...(!isActive && isHovered ? S.navItemHover : {})
          };
          return (
            <div
              key={item.id}
              style={itemStyle}
              onClick={() => onViewChange(item.id)}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={{ ...S.navDot, ...(isActive ? S.navDotActive : {}) }} />
              {item.label}
            </div>
          );
        })}

        {isCoach && (
          <div style={{ borderTop: `1px solid ${BORDER_DK}`, marginTop: '8px', paddingTop: '8px' }}>
            {isClientView && (
              <div
                style={{
                  ...S.navItem,
                  color: '#B8860B',
                  borderLeft: '3px solid #B8860B',
                  background: 'rgba(184,134,11,0.08)',
                  marginBottom: '4px'
                }}
                onClick={() => onViewChange('wheel')}
                onMouseEnter={() => setHovered('coachback')}
                onMouseLeave={() => setHovered(null)}
              >
                <div style={{ ...S.navDot, background: '#B8860B' }} />
                COACH VIEW
              </div>
            )}
            <div
              style={cvStyle}
              onClick={() => onViewChange('clientview')}
              onMouseEnter={() => setHovered('clientview')}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={{
                ...S.navDot,
                background: isClientView ? '#6B9BD3' : BORDER_DK,
              }} />
              CLIENT VIEW
            </div>
          </div>
        )}
      </div>

      <div style={S.neverTwice}>
        <div style={S.ntLabel}>CORE PHRASE</div>
        <div style={S.ntPhrase}>NEVER TWICE</div>
      </div>
    </div>
  );
}
