import React, { useState } from 'react';

export default function CellLeaderDashboard() {
  const [activeTab, setActiveTab] = useState<'overview'>('overview');

  return (
    <>
      <header className="header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1>My Cell Group</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Cell A Overview</p>
        </div>
      </header>

      <div className="card-grid" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-title">Cell Members</div>
          <div className="card-value">15</div>
        </div>
        <div className="card">
          <div className="card-title">Last Week Attendance</div>
          <div className="card-value">12 / 15</div>
          <button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Mark Attendance</button>
        </div>
        <div className="card">
          <div className="card-title">Weekly Collection</div>
          <div className="card-value" style={{ color: '#16a34a' }}>250,000 UGX</div>
        </div>
      </div>

      <div className="tab-container">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
        >
          Members & Attendance
        </button>

      </div>

      {activeTab === 'overview' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Member List</h3>
            <button className="btn" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', border: '1px solid var(--color-border)' }}>+ Add Member</button>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>Mark N.</span>
              <span style={{ color: '#16a34a' }}>Present</span>
            </li>
            <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>Sarah T.</span>
              <span style={{ color: '#dc2626' }}>Absent</span>
            </li>
            <li style={{ padding: '0.75rem 0', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>David L.</span>
              <span style={{ color: '#16a34a' }}>Present</span>
            </li>
          </ul>
        </div>
      )}


    </>
  );
}
