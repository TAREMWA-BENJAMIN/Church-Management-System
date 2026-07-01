import React from 'react';

export default function PriestDashboard() {
  return (
    <>
      <header className="header">
        <div>
          <h1>Parish Operations</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>St. Paul's Parish Dashboard</p>
        </div>
      </header>

      <div className="card-grid">
        <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
          <div className="card-title">Pending Approvals</div>
          <div className="card-value">12</div>
          <button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Review Registrations</button>
        </div>
        <div className="card">
          <div className="card-title">Total Members</div>
          <div className="card-value">845</div>
        </div>
        <div className="card">
          <div className="card-title">Active Cells</div>
          <div className="card-value">14</div>
        </div>
        <div className="card">
          <div className="card-title">Parish Revenue (Monthly)</div>
          <div className="card-value">12.5M</div>
        </div>
      </div>
    </>
  );
}
