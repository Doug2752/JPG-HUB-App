import React, { useState } from 'react';
import { S } from '../utils/styles';
import { USERS, LOGO } from '../utils/constants';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const u = username.trim().toLowerCase();
    const p = password.trim();
    if (USERS[u] === p) {
      onLogin(u);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1200);
    }
  }

  return (
    <div style={S.loginScreen}>
      <img src={LOGO} alt="Jones Performance Group" style={S.loginLogo} />
      <div style={S.loginCard}>
        <div style={S.loginTitle}>CENTRAL COMMAND</div>
        <div style={S.loginSub}>Jones Performance Group LLC</div>

        <form onSubmit={handleSubmit}>
          <label style={S.loginLabel}>USERNAME</label>
          <input
            style={S.loginInput}
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="off"
          />

          <label style={S.loginLabel}>PASSWORD</label>
          <input
            style={{
              ...S.loginInput,
              ...S.loginInputLast,
              ...(error ? S.loginInputError : {})
            }}
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button style={S.loginBtn} type="submit">ENTER</button>
        </form>

        <div style={S.loginFooter}>
          JPG-PROJECTS-HUB · Jones Performance Group LLC · CONFIDENTIAL
        </div>
      </div>
    </div>
  );
}
