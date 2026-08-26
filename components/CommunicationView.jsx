import React, { useState, useEffect, useRef } from 'react';
import { S } from '../utils/styles';
import { GOLD, DARKER, BORDER_DK, TEXT_DIM, TEXT_MID } from '../utils/constants';
import { getClients } from '../services/clients';
import { storage } from '../services/storage';
import MessagesTab from './tabs/MessagesTab';
import AnnouncementsTab from './tabs/AnnouncementsTab';
import ScheduledTab from './tabs/ScheduledTab';

const TABS = [
  { id: 'messages', label: 'MESSAGES' },
  { id: 'announcements', label: 'ANNOUNCEMENTS' },
  { id: 'scheduled', label: 'SCHEDULED COMMUNICATION' },
];

const SCHED_TYPES = ['Phone Call', 'Text Message', 'Email', 'Online Video (Teams / Zoom)', 'In Person', 'Other'];

async function getMessages() {
  const v = await storage.get('hub_messages');
  return v && v.value ? JSON.parse(v.value) : [];
}
async function getAnnouncements() {
  const v = await storage.get('hub_announcements');
  return v && v.value ? JSON.parse(v.value) : [];
}
async function getScheduledItems() {
  const v = await storage.get('hub_scheduled');
  return v && v.value ? JSON.parse(v.value) : [];
}

function formatTimestamp(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let h = d.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const min = String(d.getMinutes()).padStart(2, '0');
  return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear() + ' ' + h + ':' + min + ' ' + ampm;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00Z');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[d.getUTCMonth()] + ' ' + d.getUTCDate() + ', ' + d.getUTCFullYear();
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [hh, mm] = timeStr.split(':');
  let h = parseInt(hh, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return h + ':' + mm + ' ' + ampm;
}

const inputStyle = {
  width: '100%', padding: '8px 10px', background: '#1a1a1a',
  border: '1px solid #333', borderRadius: 4, color: '#fff', fontSize: 13,
  marginBottom: 12, boxSizing: 'border-box', fontFamily: 'inherit',
};
const labelStyle = {
  fontSize: 11, color: '#888', fontWeight: 700, letterSpacing: '1px',
  marginBottom: 4, display: 'block',
};
const detailLabel = {
  color: TEXT_DIM, fontSize: 9, letterSpacing: '2px', fontWeight: 700, marginBottom: 5,
};
const textareaStyle = { ...inputStyle, minHeight: 80, resize: 'vertical' };
const checkboxStyle = {
  width: 14, height: 14, borderRadius: 2, flexShrink: 0,
  border: '2px solid #444', background: 'transparent',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', fontSize: 9, color: '#000', fontWeight: 900,
};
const checkboxCheckedStyle = {
  ...checkboxStyle,
  border: `2px solid ${GOLD}`, background: GOLD,
};

export default function CommunicationView({ user }) {
  const isClient = user?.role === 'client';
  const [activeTab, setActiveTab] = useState('messages');
  const [unreadMessages, setUnreadMessages] = useState(false);
  const [unreadAnnouncements, setUnreadAnnouncements] = useState(false);
  const [unreadScheduled, setUnreadScheduled] = useState(false);

  const [clients, setClients] = useState([]);
  const [threads, setThreads] = useState([]);
  const [checkedClients, setCheckedClients] = useState({});
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  const [announcements, setAnnouncements] = useState([]);
  const [annFormData, setAnnFormData] = useState({ title: '', body: '' });
  const [showAnnForm, setShowAnnForm] = useState(false);
  const [annError, setAnnError] = useState(null);
  const [selectedAnn, setSelectedAnn] = useState(null);

  const [scheduled, setScheduled] = useState([]);
  const [schedFormData, setSchedFormData] = useState({
    client_id: '', client_username: '', title: '', type: 'Phone Call', date: '', time: '', notes: '',
  });
  const [showSchedForm, setShowSchedForm] = useState(false);
  const [schedError, setSchedError] = useState(null);
  const [selectedSched, setSelectedSched] = useState(null);
  const [schedFooterMode, setSchedFooterMode] = useState(null);
  const [reschedDate, setReschedDate] = useState('');
  const [reschedTime, setReschedTime] = useState('');
  const [coachNotes, setCoachNotes] = useState('');

  function getSeen() {
    try {
      const raw = localStorage.getItem(`hub_comms_seen_${user.username}`);
      return raw ? JSON.parse(raw) : { messages: null, announcements: null, scheduled: null };
    } catch (_) {
      return { messages: null, announcements: null, scheduled: null };
    }
  }

  function saveSeen(tab) {
    try {
      const seen = getSeen();
      seen[tab] = new Date().toISOString();
      localStorage.setItem(`hub_comms_seen_${user.username}`, JSON.stringify(seen));
    } catch (_) {}
  }

  function computeUnread() {
    if (!isClient) return;
    try {
      const seen = getSeen();
      const msgsRaw = localStorage.getItem('hub_messages');
      const msgs = msgsRaw ? JSON.parse(msgsRaw) : [];
      const thread = msgs.find(t => t.client_id === user.id);
      if (thread && thread.messages.length > 0) {
        setUnreadMessages(thread.messages.some(m => !seen.messages || m.timestamp > seen.messages));
      } else {
        setUnreadMessages(false);
      }
      const annsRaw = localStorage.getItem('hub_announcements');
      const anns = annsRaw ? JSON.parse(annsRaw) : [];
      setUnreadAnnouncements(anns.some(a => !seen.announcements || a.created_at > seen.announcements));
      const schedRaw = localStorage.getItem('hub_scheduled');
      const sched = schedRaw ? JSON.parse(schedRaw) : [];
      const clientSched = sched.filter(s => s.client_id === user.id);
      setUnreadScheduled(clientSched.some(s => !seen.scheduled || s.created_at > seen.scheduled));
    } catch (_) {}
  }

  useEffect(() => {
    loadAll().then(() => { if (isClient) computeUnread(); });
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [threads, checkedClients]);

  async function loadAll() {
    const [c, m, a, s] = await Promise.all([
      getClients(), getMessages(), getAnnouncements(), getScheduledItems(),
    ]);
    setClients(c);
    setThreads(m);
    setAnnouncements(a);
    setScheduled(s);
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{
        display: 'flex', gap: 0, borderBottom: `1px solid ${BORDER_DK}`,
        background: DARKER, flexShrink: 0,
      }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedAnn(null);
                setSelectedSched(null);
                setSchedFooterMode(null);
                if (isClient) {
                  saveSeen(tab.id);
                  if (tab.id === 'messages') setUnreadMessages(false);
                  if (tab.id === 'announcements') setUnreadAnnouncements(false);
                  if (tab.id === 'scheduled') setUnreadScheduled(false);
                }
              }}
              style={{
                padding: '14px 24px', cursor: 'pointer',
                fontSize: 11, fontWeight: 700, letterSpacing: '2px',
                color: isActive ? GOLD : TEXT_MID,
                borderBottom: isActive ? `2px solid ${GOLD}` : '2px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
              {isClient && (
                (tab.id === 'messages' && unreadMessages) ||
                (tab.id === 'announcements' && unreadAnnouncements) ||
                (tab.id === 'scheduled' && unreadScheduled)
              ) && (
                <span style={{
                  display: 'inline-block',
                  width: 8, height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#ddb94a',
                  marginLeft: 6,
                  verticalAlign: 'middle',
                }} />
              )}
            </div>
          );
        })}
      </div>

      {activeTab === 'messages' && (
        <MessagesTab
          user={user}
          clients={clients}
          threads={threads}
          setThreads={setThreads}
          checkedClients={checkedClients}
          setCheckedClients={setCheckedClients}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          messagesEndRef={messagesEndRef}
          isClient={isClient}
          clientId={user?.id}
        />
      )}
      {activeTab === 'announcements' && (
        <AnnouncementsTab
          user={user}
          announcements={announcements}
          setAnnouncements={setAnnouncements}
          annFormData={annFormData}
          setAnnFormData={setAnnFormData}
          showAnnForm={showAnnForm}
          setShowAnnForm={setShowAnnForm}
          annError={annError}
          setAnnError={setAnnError}
          selectedAnn={selectedAnn}
          setSelectedAnn={setSelectedAnn}
          isClient={isClient}
          clientId={user?.id}
        />
      )}
      {activeTab === 'scheduled' && (
        <ScheduledTab
          user={user}
          clients={clients}
          scheduled={scheduled}
          setScheduled={setScheduled}
          schedFormData={schedFormData}
          setSchedFormData={setSchedFormData}
          showSchedForm={showSchedForm}
          setShowSchedForm={setShowSchedForm}
          schedError={schedError}
          setSchedError={setSchedError}
          selectedSched={selectedSched}
          setSelectedSched={setSelectedSched}
          schedFooterMode={schedFooterMode}
          setSchedFooterMode={setSchedFooterMode}
          reschedDate={reschedDate}
          setReschedDate={setReschedDate}
          reschedTime={reschedTime}
          setReschedTime={setReschedTime}
          coachNotes={coachNotes}
          setCoachNotes={setCoachNotes}
          isClient={isClient}
          clientId={user?.id}
        />
      )}
    </div>
  );
}
