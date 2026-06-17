import React, { useState } from 'react';
import { S } from '../utils/styles';
import { NAV_ITEMS, LOGO } from '../utils/constants';

export default function Nav({ activeView, onViewChange }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={S.nav}>
      <div style={S.navLogoWrap} onClick={() => onViewChange('wheel')}>
        <img src={LOGO} alt="JPG" style={S.navLogoImg} />
        <div style={S.navRole}>COACH VIEW</div>
      </div>

      <div style={S.navItems}>
        {NAV_ITEMS.map(item => {
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
      </div>

      <div style={S.neverTwice}>
        <div style={S.ntLabel}>CORE PHRASE</div>
        <div style={S.ntPhrase}>NEVER TWICE</div>
      </div>
    </div>
  );
}
