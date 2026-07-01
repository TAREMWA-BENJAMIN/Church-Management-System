import React from 'react';

export default function ArchbishopDashboard() {
  return (
    <>
      <header className="header">
        <div>
          <h1>National Overview</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Church of Uganda Provincial Dashboard</p>
        </div>
      </header>

      <div className="card-grid">
        <div className="card">
          <div className="card-title">Total Dioceses</div>
          <div className="card-value">39</div>
        </div>
        <div className="card">
          <div className="card-title">Total Parishes</div>
          <div className="card-value">314</div>
        </div>
        <div className="card">
          <div className="card-title">Active Members</div>
          <div className="card-value">124,500</div>
        </div>
        <div className="card">
          <div className="card-title">National Revenue (UGX)</div>
          <div className="card-value">4.2B</div>
        </div>
      </div>
    </>
  );
}
