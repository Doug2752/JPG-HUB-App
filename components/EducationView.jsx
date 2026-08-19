import React, { useState } from 'react';
import { GOLD, DARK, BORDER_DK, TEXT_DIM } from '../utils/constants';

const EDU_CATEGORIES = [
  {
    id: 'app_systems',
    label: 'APP OPERATING SYSTEMS',
    description: 'How the JPG daily apps work — DOP, PIT, and the 4x4 Matrix.',
    docs: [
      {
        num: 1,
        title: 'What Is PIT',
        description: 'Performance Investment Time — the internal side of your daily operating system.',
        file: '/edu-docs/JPG-FD-005-EDU-WhatIsPIT-v1.0.pdf',
      },
      {
        num: 2,
        title: 'What Is DOP',
        description: 'Daily Operational Process — the external execution framework that converts internal alignment into disciplined action.',
        file: '/edu-docs/JPG-FD-006-EDU-WhatIsDOP-v1.0.pdf',
      },
      {
        num: 3,
        title: 'PIT and DOP: The Daily Operating System',
        description: 'How PIT and DOP function together as one integrated daily engine.',
        file: '/edu-docs/JPG-FD-007-EDU-PITandDOPIntegrated-v1.0.pdf',
      },
      {
        num: 4,
        title: 'The DOP 4x4 Matrix System',
        description: 'The structured monthly behavior change system built into DOP — protocols, tiers, and the Time Governor.',
        file: '/edu-docs/JPG-FD-009-EDU-DOP4x4Matrix-v1.0.pdf',
      },
    ],
  },
  {
    id: 'training',
    label: 'TRAINING & PHYSICAL PERFORMANCE',
    description: 'Physical effort, training types, and performance metrics.',
    docs: [
      {
        num: 1,
        title: 'Measuring Effort and Physical Training',
        description: 'RPE framework, training types, and effort metrics for JPG physical performance tracking.',
        file: '/edu-docs/JPG-FD-010-EDU-MeasuringEffort-v1.0.pdf',
      },
    ],
  },
  {
    id: 'lifestyle',
    label: 'LIFESTYLE & BEHAVIOR',
    description: 'Behavioral patterns, habits, and intentional living.',
    docs: [
      {
        num: 1,
        title: 'The Cell Phone Relationship',
        description: 'An honest look at phone use patterns, costs, and practical recommendations for intentional use.',
        file: '/edu-docs/JPG-EDU-CellPhoneRelationship-v1.0.pdf',
      },
      {
        num: 2,
        title: 'LIMITLESS — Operating Doctrine',
        description: '',
        file: '/edu-docs/JPG-FD-LIM-001-EDU-WRK-v1.0.pdf',
      },
    ],
  },
  {
    id: 'program_foundations',
    label: 'PROGRAM FOUNDATIONS',
    description: '',
    docs: [
      { num: 1, title: 'The Four Foundations Overview', description: '', file: '/edu-docs/JPG-FD-OV-001-EDU-WRK-v6.0.pdf' },
      { num: 2, title: 'Foundation 01 — Fitness', description: '', file: '/edu-docs/JPG-FD-001-EDU-WRK-v6.0.pdf' },
      { num: 3, title: 'Foundation 02 — Nutrition', description: '', file: '/edu-docs/JPG-FD-002-EDU-WRK-v6.0.pdf' },
      { num: 4, title: 'Foundation 03 — Sleep', description: '', file: '/edu-docs/JPG-FD-003-EDU-WRK-v6.0.pdf' },
      { num: 5, title: 'Foundation 04 — Mental / Spiritual Health', description: '', file: '/edu-docs/JPG-FD-004-EDU-WRK-v6.0.pdf' },
    ],
  },
  {
    id: 'industry_articles',
    label: 'CURRENT INDUSTRY ARTICLES',
    description: 'Relevant articles and resources from outside JPG — curated by your coach.',
    docs: [],
  },
];

const titleStyle = { color: GOLD, fontWeight: 700, fontSize: 20, letterSpacing: '3px' };

export default function EducationView() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredKey, setHoveredKey] = useState(null);

  if (selectedCategory === null) {
    return (
      <div style={{ padding: 28, overflowY: 'auto', flex: 1 }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ ...titleStyle, marginBottom: 8 }}>
            EDUCATIONAL REFERENCE DOCUMENTS
          </div>
          <div style={{ color: TEXT_DIM, fontSize: 12, fontStyle: 'italic', marginBottom: 16 }}>
            Select a category to view documents.
          </div>
          <div style={{ height: 1, background: GOLD, opacity: 0.6 }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {EDU_CATEGORIES.map(cat => {
            const isHovered = hoveredKey === cat.id;
            const count = cat.docs.length;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                onMouseEnter={() => setHoveredKey(cat.id)}
                onMouseLeave={() => setHoveredKey(null)}
                style={{
                  background: DARK,
                  border: `1px solid ${isHovered ? GOLD : BORDER_DK}`,
                  borderRadius: 6,
                  padding: '22px 26px',
                  cursor: 'pointer',
                  filter: isHovered ? 'brightness(1.1)' : 'none',
                  transition: 'border-color 0.15s, filter 0.15s',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ color: GOLD, fontWeight: 700, fontSize: 14, letterSpacing: '2px', marginBottom: 8 }}>
                  {cat.label}
                </div>
                <div style={{ color: TEXT_DIM, fontSize: 13, lineHeight: 1.5, flex: 1 }}>
                  {cat.description}
                </div>
                <div style={{ color: TEXT_DIM, fontSize: 11, fontWeight: 700, marginTop: 12 }}>
                  {count} document{count !== 1 ? 's' : ''}
                </div>
                <div style={{ color: GOLD, fontSize: 11, fontWeight: 700, marginTop: 4 }}>
                  VIEW →
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 28, overflowY: 'auto', flex: 1 }}>
      <div style={{ marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={titleStyle}>
            EDUCATIONAL REFERENCE DOCUMENTS
          </div>
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              background: 'transparent',
              border: `1px solid ${GOLD}`,
              color: GOLD,
              fontSize: 11,
              fontWeight: 700,
              padding: '5px 14px',
              borderRadius: 4,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ← BACK
          </button>
        </div>
        <div style={{ color: GOLD, fontWeight: 700, fontSize: 14, letterSpacing: '2px', marginTop: 16 }}>
          {selectedCategory.label}
        </div>
        <div style={{ height: 1, background: GOLD, opacity: 0.6, marginTop: 12, marginBottom: 20 }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 12,
      }}>
        {selectedCategory.docs.map(doc => {
          const hoverKey = selectedCategory.id + '_' + doc.num;
          const isHovered = hoveredKey === hoverKey;
          return (
            <div
              key={hoverKey}
              onClick={() => window.open(doc.file, '_blank')}
              onMouseEnter={() => setHoveredKey(hoverKey)}
              onMouseLeave={() => setHoveredKey(null)}
              style={{
                background: DARK,
                border: `1px solid ${isHovered ? GOLD : BORDER_DK}`,
                borderRadius: 6,
                padding: '18px 22px',
                cursor: 'pointer',
                filter: isHovered ? 'brightness(1.1)' : 'none',
                transition: 'border-color 0.15s, filter 0.15s',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ color: TEXT_DIM, fontSize: 10, fontWeight: 700, letterSpacing: '1px' }}>
                Document {doc.num}
              </div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginTop: 4, marginBottom: 6 }}>
                {doc.title}
              </div>
              <div style={{ color: TEXT_DIM, fontSize: 12, lineHeight: 1.5, flex: 1 }}>
                {doc.description}
              </div>
              <div style={{ color: GOLD, fontSize: 11, fontWeight: 700, marginTop: 10 }}>
                OPEN PDF →
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
