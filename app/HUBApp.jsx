import React, { useState } from 'react';
import { S } from '../utils/styles';
import Login from '../components/Login.jsx';
import Nav from '../components/Nav.jsx';
import Topbar from '../components/Topbar.jsx';
import WheelView from '../components/WheelView.jsx';
import ClientsView from '../components/ClientsView.jsx';
import ClientViewMode from '../components/ClientViewMode.jsx';
import SlidePanel from '../components/SlidePanel.jsx';
import PlaceholderView from '../components/PlaceholderView.jsx';

export default function HUBApp() {
  const [user, setUser]             = useState(null);
  const [activeView, setActiveView] = useState('wheel');
  const [panelClient, setPanelClient] = useState(null);

  if (!user) return <Login onLogin={setUser} />;

  function handleViewChange(viewId) {
    setActiveView(viewId);
    setPanelClient(null);
  }

  function handleLogout() {
    setUser(null);
    setActiveView('wheel');
    setPanelClient(null);
  }

  function renderView() {
    if (activeView === 'wheel')      return <WheelView hubUser={user} />;
    if (activeView === 'clients')    return <ClientsView onOpenPanel={setPanelClient} />;
    if (activeView === 'messages')   return <PlaceholderView icon="✉" label="MESSAGING" sub="Spoke under development" />;
    if (activeView === 'reports')    return <PlaceholderView icon="▦" label="REPORTS" sub="Under development" />;
    if (activeView === 'settings')   return <PlaceholderView icon="⚙" label="SETTINGS" sub="Under development" />;
    if (activeView === 'clientview') return <ClientViewMode key="clientview" />;
    return null;
  }

  const panelOpen = !!panelClient;

  return (
    <div style={S.appShell}>
      <Nav activeView={activeView} onViewChange={handleViewChange} />

      <div style={{
        ...S.mainContent,
        paddingRight: panelOpen ? '420px' : 0,
        transition: 'padding-right 0.25s ease'
      }}>
        <Topbar onLogout={handleLogout} />

        <div style={S.viewArea}>
          {renderView()}
        </div>

        <div style={S.appFooter}>
          JPG-PROJECTS-HUB · JONES PERFORMANCE GROUP LLC · CENTRAL COMMAND ·{' '}
          <span style={S.footerConf}>CONFIDENTIAL</span> · v4
        </div>
      </div>

      <SlidePanel client={panelClient} onClose={() => setPanelClient(null)} />
    </div>
  );
}
