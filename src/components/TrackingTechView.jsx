import React, { useState } from 'react';
import { GOLD, DARK, DARKER, BORDER_DK, TEXT_DIM } from '../../utils/constants';
import { TRACKING_TECH_DATA } from '../data/trackingTechData';

const titleStyle = { color: GOLD, fontWeight: 700, fontSize: 20, letterSpacing: '3px' };

const FIELDS = [
  { key: 'whatItDoes',            label: 'WHAT IT DOES' },
  { key: 'bestFor',               label: 'BEST FOR' },
  { key: 'howItWorks',            label: 'HOW IT WORKS' },
  { key: 'ecosystemIntegrations', label: 'ECOSYSTEM & INTEGRATIONS' },
  { key: 'ecosystemValue',        label: 'ECOSYSTEM VALUE' },
  { key: 'aiIntegration',         label: 'AI INTEGRATION' },
  { key: 'freeOption',            label: 'FREE OPTION' },
  { key: 'pricing',               label: 'PRICING' },
  { key: 'tutorialLink',          label: 'TUTORIAL / LEARN MORE' },
];

export default function TrackingTechView({ user }) {
  const [activeTab, setActiveTab] = useState('wearables');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [hoveredKey, setHoveredKey] = useState(null);

  function switchTab(tab) {
    setActiveTab(tab);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
  }

  function tabBtnStyle(tab) {
    const active = activeTab === tab;
    return {
      background: active ? '#ddb94a' : DARK,
      color: active ? '#000' : '#ddb94a',
      border: `1px solid ${active ? '#000' : '#ddb94a'}`,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: '2px',
      padding: '7px 20px',
      cursor: 'pointer',
      fontFamily: 'inherit',
      borderRadius: 4,
    };
  }

  function categoryCard(id, label, count, onClick) {
    const isHovered = hoveredKey === id;
    return (
      <div
        key={id}
        onClick={onClick}
        onMouseEnter={() => setHoveredKey(id)}
        onMouseLeave={() => setHoveredKey(null)}
        style={{
          background: DARK,
          border: `1px solid ${isHovered ? GOLD : BORDER_DK}`,
          borderRadius: 6,
          padding: '20px 24px',
          cursor: 'pointer',
          filter: isHovered ? 'brightness(1.1)' : 'none',
          transition: 'border-color 0.15s, filter 0.15s',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ color: GOLD, fontWeight: 700, fontSize: 13, letterSpacing: '2px', marginBottom: 10, flex: 1 }}>
          {label}
        </div>
        <div style={{ color: TEXT_DIM, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
          {count} item{count !== 1 ? 's' : ''}
        </div>
        <div style={{ color: '#ddb94a', fontSize: 11, fontWeight: 700 }}>VIEW →</div>
      </div>
    );
  }

  function itemCard(id, name, onClick) {
    const isHovered = hoveredKey === id;
    return (
      <div
        key={id}
        onClick={onClick}
        onMouseEnter={() => setHoveredKey(id)}
        onMouseLeave={() => setHoveredKey(null)}
        style={{
          background: DARK,
          border: `1px solid ${isHovered ? '#ddb94a' : BORDER_DK}`,
          borderRadius: 6,
          padding: '14px 18px',
          cursor: 'pointer',
          filter: isHovered ? 'brightness(1.1)' : 'none',
          transition: 'border-color 0.15s, filter 0.15s',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{name}</div>
        <div style={{ color: '#ddb94a', fontSize: 11, fontWeight: 700 }}>DETAILS →</div>
      </div>
    );
  }

  function backBtn(onClick) {
    return (
      <button
        onClick={onClick}
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
    );
  }

  function levelHeader(label, onBack) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ color: GOLD, fontWeight: 700, fontSize: 14, letterSpacing: '2px' }}>{label}</div>
        {backBtn(onBack)}
      </div>
    );
  }

  function itemList(items) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map(item => itemCard(item.id, item.name, () => setSelectedItem(item)))}
      </div>
    );
  }

  function renderWearables() {
    if (!selectedCategory) {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {TRACKING_TECH_DATA.wearables.map(cat =>
            categoryCard(cat.id, cat.label, cat.items.length, () => setSelectedCategory(cat))
          )}
        </div>
      );
    }
    return (
      <>
        {levelHeader(selectedCategory.label, () => setSelectedCategory(null))}
        {itemList(selectedCategory.items)}
      </>
    );
  }

  function renderApps() {
    if (!selectedCategory) {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {TRACKING_TECH_DATA.apps.map(cat => {
            const count = cat.subCategories.length > 0
              ? cat.subCategories.reduce((sum, sc) => sum + sc.items.length, 0)
              : cat.items.length;
            return categoryCard(cat.id, cat.label, count, () => setSelectedCategory(cat));
          })}
        </div>
      );
    }

    if (selectedCategory.subCategories.length === 0) {
      return (
        <>
          {levelHeader(selectedCategory.label, () => setSelectedCategory(null))}
          {itemList(selectedCategory.items)}
        </>
      );
    }

    if (!selectedSubCategory) {
      return (
        <>
          {levelHeader(selectedCategory.label, () => setSelectedCategory(null))}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {selectedCategory.subCategories.map(sc =>
              categoryCard(sc.id, sc.label, sc.items.length, () => setSelectedSubCategory(sc))
            )}
          </div>
        </>
      );
    }

    return (
      <>
        {levelHeader(selectedSubCategory.label, () => setSelectedSubCategory(null))}
        {itemList(selectedSubCategory.items)}
      </>
    );
  }

  function renderRecommendations() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, paddingTop: 60 }}>
        <div style={{ color: GOLD, fontWeight: 700, fontSize: 16, letterSpacing: '3px', marginBottom: 12 }}>
          COACH RECOMMENDATIONS
        </div>
        <div style={{ color: TEXT_DIM, fontSize: 13 }}>
          Personalized recommendations by client profile and goal coming soon.
        </div>
      </div>
    );
  }

  function renderSlidePanel() {
    if (!selectedItem) return null;
    const item = selectedItem;
    return (
      <>
        <div
          onClick={() => setSelectedItem(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100 }}
        />
        <div style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 480,
          background: DARKER,
          zIndex: 101,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.5)',
        }}>
          <div style={{
            padding: '20px 24px',
            borderBottom: `1px solid ${BORDER_DK}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexShrink: 0,
          }}>
            <div style={{ color: GOLD, fontWeight: 700, fontSize: 16, letterSpacing: '1px', lineHeight: 1.3, flex: 1, marginRight: 16 }}>
              {item.name}
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: TEXT_DIM,
                fontSize: 22,
                cursor: 'pointer',
                fontFamily: 'inherit',
                lineHeight: 1,
                padding: 0,
              }}
            >×</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
            {FIELDS.map(field => {
              const raw = item[field.key];
              const value = field.key === 'tutorialLink'
                ? (raw ? <a href={raw} target="_blank" rel="noreferrer" style={{ color: '#ddb94a' }}>{raw}</a> : 'Coming soon')
                : raw;
              return (
                <div key={field.key} style={{ marginBottom: 20 }}>
                  <div style={{
                    color: '#ddb94a',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}>
                    {field.label}
                  </div>
                  <div style={{ color: '#fff', fontSize: 14, lineHeight: 1.6 }}>
                    {value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  return (
    <div style={{ padding: 28, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ ...titleStyle, marginBottom: 16 }}>TRACKING & TECHNOLOGY</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button onClick={() => switchTab('wearables')} style={tabBtnStyle('wearables')}>WEARABLES</button>
          <button onClick={() => switchTab('apps')} style={tabBtnStyle('apps')}>APPS</button>
          <button onClick={() => switchTab('recommendations')} style={tabBtnStyle('recommendations')}>RECOMMENDATIONS</button>
        </div>
        <div style={{ height: 1, background: GOLD, opacity: 0.6 }} />
      </div>

      <div style={{ flex: 1 }}>
        {activeTab === 'wearables' && renderWearables()}
        {activeTab === 'apps' && renderApps()}
        {activeTab === 'recommendations' && renderRecommendations()}
      </div>

      {renderSlidePanel()}
    </div>
  );
}
