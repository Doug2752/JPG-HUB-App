import React, { useState, useEffect } from 'react';
import { S } from '../utils/styles';
import { getSession, logout as logoutService } from '../services/clients';
import Login from '../components/Login.jsx';
import Nav from '../components/Nav.jsx';
import Topbar from '../components/Topbar.jsx';
import WheelView from '../components/WheelView.jsx';
import ClientsView from '../components/ClientsView.jsx';
import ClientViewMode from '../components/ClientViewMode.jsx';
import SlidePanel from '../components/SlidePanel.jsx';
import PlaceholderView from '../components/PlaceholderView.jsx';
import CommunicationView from '../components/CommunicationView.jsx';
import ReportsView from '../components/ReportsView.jsx';
import EventsBoardView from '../components/EventsBoardView';
import FullProfileView from '../components/FullProfileView.jsx';

export default function HUBApp() {
  const [user, setUser]             = useState(null);
  const [activeView, setActiveView] = useState('wheel');
  const [panelClient, setPanelClient] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [clientRosterKey, setClientRosterKey] = useState(0);
  const [selectedProfileClient, setSelectedProfileClient] = useState(null);

  useEffect(() => {
    getSession().then(session => {
      if (session) setUser(session);
      setLoading(false);
    });
  }, []);

  if (loading) return null;
  if (!user) return <Login onLogin={setUser} />;

  function handleViewChange(viewId) {
    setActiveView(viewId);
    setPanelClient(null);
  }

  function handleOpenFullProfile(client) {
    setSelectedProfileClient(client);
    setActiveView('fullprofile');
    setPanelClient(null);
  }

  function handleBackFromProfile() {
    setActiveView('clients');
    setSelectedProfileClient(null);
  }

  async function handleLogout() {
    await logoutService();
    setUser(null);
    setActiveView('wheel');
    setPanelClient(null);
  }

  function renderView() {
    if (activeView === 'wheel')         return <WheelView hubUser={user} role={user.role} onNavigate={handleViewChange} />;
    if (activeView === 'clients')      return <ClientsView key={clientRosterKey} onOpenPanel={setPanelClient} />;
    if (activeView === 'communication') return <CommunicationView user={user} />;
    if (activeView === 'fullprofile')   return <FullProfileView client={selectedProfileClient} onBack={handleBackFromProfile} />;
    if (activeView === 'reports')    return <ReportsView user={user} />;
    if (activeView === 'settings')   return <PlaceholderView icon="⚙" label="SETTINGS" sub="Under development" />;
    if (activeView === 'eventsboard') return <EventsBoardView user={user} />;
    if (activeView === 'clientview') return <ClientViewMode key="clientview" />;
    return null;
  }

  const panelOpen = !!panelClient;

  return (
    <div style={S.appShell}>
      <Nav activeView={activeView} onViewChange={handleViewChange} role={user.role} />

      <div style={{
        ...S.mainContent,
        paddingRight: panelOpen ? '420px' : 0,
        transition: 'padding-right 0.25s ease'
      }}>
        <Topbar onLogout={handleLogout} user={user} />

        <div style={S.viewArea}>
          {renderView()}
        </div>

        <div style={S.appFooter}>
          JPG-PROJECTS-HUB · JONES PERFORMANCE GROUP LLC · CENTRAL COMMAND ·{' '}
          <span style={S.footerConf}>CONFIDENTIAL</span> · v4
        </div>
      </div>

      <SlidePanel
        client={panelClient}
        onClose={() => setPanelClient(null)}
        onOpenFullProfile={handleOpenFullProfile}
        onUpdate={() => {
          setClientRosterKey(k => k + 1);
          try {
            const raw = localStorage.getItem('hub_clients');
            const clients = raw ? JSON.parse(raw) : [];
            const updated = clients.find(c => c.id === panelClient?.id);
            if (updated) setPanelClient(updated);
          } catch (_) {}
        }}
      />
    </div>
  );
}
