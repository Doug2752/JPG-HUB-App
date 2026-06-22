import React, { useState } from 'react';
import { S } from '../utils/styles';
import { GOLD, BORDER_DK, TEXT_DIM, TEXT_MID, DARKER } from '../utils/constants';

const DEMO = {
  name: 'DEMO CLIENT',
  phase: 'APPRENTICE',
  day: 'Day 3 / 14',
  streak: '3 days',
  goal: 'Habit Formation / Energy',
  lastActivity: 'Today, 8:00 AM',
  habits: [
    { label: 'Morning Check-In', done: true },
    { label: 'Water Goal (100 oz)', done: true },
    { label: 'Sleep Log', done: false },
    { label: 'Evening Reflection', done: false },
  ],
};

function HabitRow({ habit }) {
  const [checked, setChecked] = useState(habit.done);
  return (
    <div
      onClick={() => setChecked(c => !c)}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '12px 16px', borderBottom: `1px solid ${BORDER_DK}`,
        cursor: 'pointer', background: checked ? 'rgba(184,134,11,0.05)' : 'transparent',
      }}
    >
      <div style={{
        width: '18px', height: '18px', borderRadius: '3px', flexShrink: 0,
        border: `2px solid ${checked ? GOLD : '#444'}`,
        background: checked ? GOLD : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '11px', color: '#000', fontWeight: 900,
      }}>
        {checked ? '✓' : ''}
      </div>
      <span style={{
        fontSize: '12px', fontWeight: 700, letterSpacing: '1px',
        color: checked ? '#fff' : TEXT_MID,
        textDecoration: checked ? 'none' : 'none',
      }}>
        {habit.label}
      </span>
      <span style={{
        marginLeft: 'auto', fontSize: '10px', letterSpacing: '1px',
        color: checked ? GOLD : TEXT_DIM, fontWeight: 700,
      }}>
        {checked ? 'DONE' : 'PENDING'}
      </span>
    </div>
  );
}

export default function ClientViewMode() {
  const progress = Math.round((3 / 14) * 100);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Demo mode banner */}
      <div style={{
        background: '#0d2340',
        borderBottom: `2px solid ${GOLD}`,
        padding: '9px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexShrink: 0,
      }}>
        <span style={{
          background: GOLD, color: '#000', fontWeight: 900,
          fontSize: '9px', letterSpacing: '2px',
          padding: '3px 8px', borderRadius: '2px',
        }}>
          CLIENT VIEW
        </span>
        <span style={{ color: '#aaa', fontSize: '10px', letterSpacing: '1px' }}>
          Demo mode — generic client profile — nothing is saved
        </span>
        <span style={{ marginLeft: 'auto', color: TEXT_DIM, fontSize: '10px', letterSpacing: '1px' }}>
          Select any coach nav item to return to coach view
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>

        {/* Profile header */}
        <div style={{
          background: DARKER, border: `1px solid ${BORDER_DK}`,
          borderRadius: '3px', padding: '20px 24px', marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '24px',
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0,
            background: '#1C3A5C', border: `2px solid ${GOLD}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: GOLD, fontSize: '20px', fontWeight: 900,
          }}>
            D
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#fff', letterSpacing: '2px' }}>
              {DEMO.name}
            </div>
            <div style={{ fontSize: '10px', color: TEXT_DIM, letterSpacing: '1.5px', marginTop: '4px' }}>
              JONES PERFORMANCE GROUP LLC
            </div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{
              background: 'rgba(192,57,43,0.12)', color: '#C0392B',
              border: '1px solid #C0392B', borderRadius: '2px',
              fontSize: '9px', fontWeight: 700, letterSpacing: '1px',
              padding: '4px 10px', display: 'inline-block',
            }}>
              {DEMO.phase}
            </div>
            <div style={{ fontSize: '10px', color: TEXT_DIM, marginTop: '6px', letterSpacing: '1px' }}>
              {DEMO.day}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
          {[
            { label: 'CURRENT STREAK', value: DEMO.streak, sub: 'keep it going' },
            { label: 'LAST CHECK-IN', value: DEMO.lastActivity, sub: 'on time' },
            { label: 'GOAL', value: DEMO.goal, sub: '14-day baseline' },
          ].map(stat => (
            <div key={stat.label} style={{ ...S.statBox }}>
              <div style={S.statLabel}>{stat.label}</div>
              <div style={{ ...S.statValue, fontSize: '14px', marginTop: '8px', height: 'auto' }}>{stat.value}</div>
              <div style={S.statSub}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{
          background: DARKER, border: `1px solid ${BORDER_DK}`,
          borderRadius: '3px', padding: '16px 20px', marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', color: '#fff' }}>
              14-DAY BASELINE PROGRESS
            </span>
            <span style={{ fontSize: '11px', color: GOLD, fontWeight: 700 }}>{progress}%</span>
          </div>
          <div style={{ background: '#2a2a2a', borderRadius: '2px', height: '8px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: `linear-gradient(90deg, ${GOLD}, #d4a017)`,
              borderRadius: '2px', transition: 'width 0.4s ease',
            }} />
          </div>
          <div style={{ fontSize: '10px', color: TEXT_DIM, marginTop: '8px', letterSpacing: '1px' }}>
            Day 3 of 14 complete — 11 days remaining in APPRENTICE phase
          </div>
        </div>

        {/* Today's habits */}
        <div style={{
          background: DARKER, border: `1px solid ${BORDER_DK}`,
          borderRadius: '3px', overflow: 'hidden',
        }}>
          <div style={{
            padding: '12px 16px', background: '#161616',
            borderBottom: `1px solid ${BORDER_DK}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', color: '#fff' }}>
              TODAY'S HABITS
            </span>
            <span style={{ fontSize: '10px', color: TEXT_DIM, letterSpacing: '1px' }}>
              {DEMO.habits.filter(h => h.done).length} / {DEMO.habits.length} COMPLETE
            </span>
          </div>
          {DEMO.habits.map(habit => (
            <HabitRow key={habit.label} habit={habit} />
          ))}
        </div>

      </div>
    </div>
  );
}
