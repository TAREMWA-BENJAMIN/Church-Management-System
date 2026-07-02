import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import LoginPage from './pages/LoginPage';
import ArchbishopDashboard from './pages/ArchbishopDashboard';
import BishopDashboard from './pages/BishopDashboard';
import PriestDashboard from './pages/PriestDashboard';
import SecretaryDashboard from './pages/SecretaryDashboard';
import TreasurerDashboard from './pages/TreasurerDashboard';
import CellLeaderDashboard from './pages/CellLeaderDashboard';

import HierarchyPage from './pages/HierarchyPage';
import MembersPage from './pages/MembersPage';
import FinancesPage from './pages/FinancesPage';
import CertificatesPage from './pages/CertificatesPage';
import SettingsPage from './pages/SettingsPage';
import ArchdeaconDashboard from './pages/ArchdeaconDashboard';

type Role = 'Archbishop' | 'Bishop' | 'Archdeacon' | 'Priest' | 'Secretary' | 'Treasurer' | 'CellLeader';
type ModuleTab = 'Dashboard' | 'Hierarchy' | 'Members' | 'Finances' | 'Certificates' | 'Settings';

function DashboardLayout() {
  const [currentRole, setCurrentRole] = useState<Role>('Archbishop');
  const [activeTab, setActiveTab] = useState<ModuleTab>('Dashboard');

  const renderDashboard = () => {
    switch (currentRole) {
      case 'Archbishop': return <ArchbishopDashboard />;
      case 'Bishop': return <BishopDashboard />;
      case 'Archdeacon': return <ArchdeaconDashboard />;
      case 'Priest': return <PriestDashboard />;
      case 'Secretary': return <SecretaryDashboard />;
      case 'Treasurer': return <TreasurerDashboard />;
      case 'CellLeader': return <CellLeaderDashboard />;
      default: return <div className="card" style={{ padding: '2rem' }}><h3>Dashboard not implemented for this role yet.</h3></div>;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard': return renderDashboard();
      case 'Hierarchy': return <HierarchyPage />;
      case 'Members': return <MembersPage />;
      case 'Finances': return <FinancesPage />;
      case 'Certificates': return <CertificatesPage />;
      case 'Settings': return <SettingsPage />;
      default: return renderDashboard();
    }
  };

  const getProfileName = () => {
    switch (currentRole) {
      case 'Archbishop': return 'Stephen K. (Archbishop)';
      case 'Bishop': return 'James W. (Bishop)';
      case 'Archdeacon': return 'Robert K. (Archdeacon)';
      case 'Priest': return 'Rev. John D. (Priest)';
      case 'Secretary': return 'Mary S. (Secretary)';
      case 'Treasurer': return 'Peter T. (Treasurer)';
      case 'CellLeader': return 'David C. (Cell Leader)';
      default: return '';
    }
  };

  const tabs: ModuleTab[] = ['Dashboard', 'Hierarchy', 'Members', 'Finances', 'Certificates', 'Settings'];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          CMS Portal
        </div>
        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <div 
              key={tab} 
              className={`nav-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </nav>

        {/* Demo Role Switcher */}
        <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(0,0,0,0.03)', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Demo Role Switcher</p>
          <select 
            value={currentRole} 
            onChange={(e) => {
              setCurrentRole(e.target.value as Role);
              setActiveTab('Dashboard'); // reset to dashboard on role change
            }}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
          >
            <option value="Archbishop">Archbishop</option>
            <option value="Bishop">Bishop</option>
            <option value="Archdeacon">Archdeacon</option>
            <option value="Priest">Priest</option>
            <option value="Secretary">Secretary</option>
            <option value="Treasurer">Treasurer</option>
            <option value="CellLeader">Cell Leader</option>
          </select>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header" style={{ marginBottom: activeTab === 'Dashboard' ? '-1rem' : '0' }}>
          <div style={{ visibility: 'hidden' }}>Spacer</div>
          <div className="user-profile">
            <span style={{ fontWeight: 500 }}>{getProfileName()}</span>
            <div className="avatar">{currentRole.charAt(0)}</div>
          </div>
        </header>

        {/* Render Active Dashboard or Module */}
        {renderContent()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardLayout />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
