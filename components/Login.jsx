import React, { useState } from 'react';

const VALID_CREDENTIALS = { Doug: 'JPG2026' };

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const key = Object.keys(VALID_CREDENTIALS).find(k => k.toLowerCase() === username.trim().toLowerCase());
    const expected = key ? VALID_CREDENTIALS[key] : undefined;
    if (!expected || password.toLowerCase() !== expected.toLowerCase()) {
      setError('Invalid username or password.');
      return;
    }
    setError('');
    onLogin(username.trim());
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#B8860B',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        width: '420px',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
        border: '2px solid #000000',
      }}>
        <div style={{ padding: '32px 40px 16px 40px' }}>
          <img
            src="/jpglogo.png"
            style={{ width: '260px', display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom: '0px', position: 'relative', left: '-14px' }}
          />
          <div style={{ fontSize: '42px', fontWeight: 900, letterSpacing: '0.08em', color: '#000000', textAlign: 'center', margin: 0, padding: 0, marginTop: '-12px', marginLeft: '-28px' }}>
            HUB
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.15em', color: '#555555', textAlign: 'center', marginTop: '4px', marginBottom: '20px', marginLeft: '-28px' }}>
            COMMAND HUB
          </div>
          <form onSubmit={handleSubmit}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.1em', color: '#000000', marginBottom: '4px', display: 'block' }}>
              USER
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CCCCCC', background: '#F0F0F0', color: '#2A2A2A', fontSize: '14px', boxSizing: 'border-box' }}
            />
            <label style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.1em', color: '#000000', marginTop: '16px', marginBottom: '4px', display: 'block' }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit(e)}
              autoComplete="current-password"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CCCCCC', background: '#F0F0F0', color: '#2A2A2A', fontSize: '14px', boxSizing: 'border-box' }}
            />
            <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.15em', color: '#B8860B', textAlign: 'center', marginTop: '16px', marginBottom: '12px' }}>
              EXISTING OUTSIDE OF BOUNDARIES
            </div>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '12px', color: '#CCCCCC', cursor: 'pointer' }}>
              <input type="checkbox" style={{ margin: 0 }} />
              Stay logged in for 30 days
            </label>

            {error && (
              <div style={{ color: '#B02020', fontSize: '12px', textAlign: 'center', marginTop: '10px' }}>
                {error}
              </div>
            )}
            <button
              type="submit"
              style={{ width: '100%', padding: '12px', background: '#B8860B', color: '#000000', fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.1em', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '20px' }}
            >
              ENTER
            </button>
          </form>
          <div style={{ marginTop: '12px', textAlign: 'center', lineHeight: 1.8, fontSize: '11px', color: '#000000', letterSpacing: '0.08em' }}>
            <div>JONES PERFORMANCE GROUP LLC</div>
            <div>ACCESS BY AUTHORIZATION ONLY</div>
          </div>
        </div>
        <div style={{ background: '#FFFFFF', borderTop: '1px solid #EEEEEE', height: '28px', lineHeight: '28px', textAlign: 'center', fontSize: '9px', color: '#888888', letterSpacing: '0.05em' }}>
          © 2026 Jones Performance Group LLC · HUB · Confidential · All Rights Reserved
        </div>
      </div>
    </div>
  );
}
