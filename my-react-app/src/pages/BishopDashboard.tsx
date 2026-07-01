import React from 'react';

export default function BishopDashboard() {
  return (
    <>
      <header className="header">
        <div>
          <h1>Diocesan Overview</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Kampala Diocese Dashboard</p>
        </div>
      </header>

      <div className="card-grid">
        <div className="card">
          <div className="card-title">Archdeaconries</div>
          <div className="card-value">6</div>
        </div>
        <div className="card">
          <div className="card-title">Parishes</div>
          <div className="card-value">42</div>
        </div>
        <div className="card">
          <div className="card-title">Registered Members</div>
          <div className="card-value">18,200</div>
        </div>
        <div className="card">
          <div className="card-title">Diocesan Revenue (UGX)</div>
          <div className="card-value">450M</div>
        </div>
      </div>
    </>
  );
}
