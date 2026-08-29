import React, { useState, useEffect } from 'react';
import { GOLD, GOLD_LIGHT, DARK, TEXT_DIM } from '../../utils/constants';

const brandBar = {
  background: DARK,
  borderBottom: `2px solid ${GOLD}`,
  padding: '18px 28px',
  textAlign: 'center',
};

const brandTitle = {
  fontSize: 20,
  fontWeight: 900,
  letterSpacing: '3px',
  color: '#fff',
  margin: 0,
};

const explainerBlock = {
  background: '#fff',
  borderRadius: 5,
  border: '1.5px solid #ccc',
  padding: '20px',
  maxWidth: 860,
  margin: '24px auto 0 auto',
};

const explainerText = {
  fontSize: 14,
  lineHeight: 1.7,
  color: '#222',
  margin: 0,
};

const cardStyle = {
  background: '#fff',
  borderRadius: 5,
  border: '1.5px solid #ccc',
  padding: '20px',
  maxWidth: 860,
  margin: '16px auto 0 auto',
  display: 'flex',
  flexDirection: 'row',
  gap: 20,
  alignItems: 'flex-start',
};

const screenshotBox = {
  width: 220,
  minWidth: 220,
  height: 160,
  background: '#e0e0e0',
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const screenshotLabel = {
  fontSize: 11,
  color: '#999',
  fontWeight: 700,
  letterSpacing: '1px',
  textAlign: 'center',
};

const rightCol = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const cardName = {
  fontSize: 18,
  fontWeight: 900,
  letterSpacing: '2px',
  color: GOLD,
  textTransform: 'uppercase',
};

const cardDesc = {
  fontSize: 13,
  lineHeight: 1.6,
  color: '#222',
  margin: 0,
};

const INTERFACES = [
  {
    key: 'open',
    label: 'Open',
    description: 'Your day, your words. The Open interface gives you a single flowing text space to capture everything from your day — by voice or by typing. Subtle reminders guide you through what to include, disappearing as you fill them in. If something required gets missed, a targeted prompt brings you back to it. Built for people who think in paragraphs, not checkboxes.',
  },
  {
    key: 'guided',
    label: 'Guided',
    description: 'Structure without rigidity. The Guided interface organizes your day into a small number of focused input areas — each one a free-flow space for a different category of information. You move between them at your own pace, speaking or typing naturally. More organized than Open, less rigid than Structured. Built for people who want some scaffolding without feeling locked in.',
  },
  {
    key: 'structured',
    label: 'Structured',
    description: 'The full framework. The Structured interface is the complete JPG daily form — every section defined, every input in its place. Checkboxes, dedicated fields, clear section headers. Nothing left to interpretation. Built for people who want maximum clarity and the highest level of daily accountability.',
  },
];

function getClientRecord(username) {
  try {
    const raw = localStorage.getItem('hub_clients');
    if (!raw) return null;
    const clients = JSON.parse(raw);
    return clients.find(c => c.username === username) || null;
  } catch {
    return null;
  }
}

function saveInterfacePreference(username, value) {
  try {
    const raw = localStorage.getItem('hub_clients');
    if (!raw) return;
    const clients = JSON.parse(raw);
    const idx = clients.findIndex(c => c.username === username);
    if (idx === -1) return;
    clients[idx] = { ...clients[idx], interface_preference: value };
    localStorage.setItem('hub_clients', JSON.stringify(clients));
  } catch {
    // silent
  }
}

export default function InterfacePreferenceView({ user }) {
  const [selectedInterface, setSelectedInterface] = useState(null);

  useEffect(() => {
    const record = getClientRecord(user.username);
    setSelectedInterface(record?.interface_preference || 'structured');
  }, [user.username]);

  function handleSelect(key) {
    saveInterfacePreference(user.username, key);
    setSelectedInterface(key);
  }

  return (
    <div style={{ overflowY: 'auto', flex: 1 }}>
      <div style={brandBar}>
        <div style={brandTitle}>APP INTERFACE PREFERENCE</div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', paddingBottom: 40 }}>
        <div style={explainerBlock}>
          <p style={explainerText}>
            Interface Preference determines how DOP and PIT present your daily experience. No interface is better than another — all three capture identical information and count equally toward day completion. The only purpose of this selection is to match your natural style and personality to the interface that makes your daily experience most effective and sustainable. You can change your selection at any time, including mid-period. Try different interfaces and settle on what works best for you.
          </p>
        </div>

        {INTERFACES.map(iface => {
          const isSelected = selectedInterface === iface.key;
          return (
            <div key={iface.key} style={cardStyle}>
              <div style={screenshotBox}>
                <span style={screenshotLabel}>SCREENSHOT{'\n'}COMING</span>
              </div>

              <div style={rightCol}>
                <div style={cardName}>{iface.label}</div>
                <p style={cardDesc}>{iface.description}</p>
                {isSelected ? (
                  <button
                    style={{
                      alignSelf: 'flex-start',
                      background: GOLD_LIGHT,
                      color: '#000',
                      border: '1.5px solid #000',
                      borderRadius: 5,
                      fontWeight: 700,
                      fontSize: 13,
                      padding: '8px 16px',
                      cursor: 'default',
                      fontFamily: 'inherit',
                    }}
                    disabled
                  >
                    CURRENT SELECTION
                  </button>
                ) : (
                  <button
                    onClick={() => handleSelect(iface.key)}
                    style={{
                      alignSelf: 'flex-start',
                      background: '#e8e8e8',
                      color: '#888',
                      border: '1.5px solid #ccc',
                      borderRadius: 5,
                      fontWeight: 700,
                      fontSize: 13,
                      padding: '8px 16px',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    SELECT
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
