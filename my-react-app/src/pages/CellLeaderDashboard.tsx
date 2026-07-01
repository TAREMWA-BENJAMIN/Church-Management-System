import React from 'react';

export default function CellLeaderDashboard() {
  return (
    <>
      <header className="header">
        <div>
          <h1>My Cell Group</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Cell A Overview</p>
        </div>
      </header>

      <div className="card-grid">
        <div className="card">
          <div className="card-title">Cell Members</div>
          <div className="card-value">15</div>
        </div>
        <div className="card">
          <div className="card-title">Last Week Attendance</div>
          <div className="card-value">12 / 15</div>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Mark Attendance</button>
        </div>
        <div className="card">
          <div className="card-title">Member List</div>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>Mark N. - Present</li>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>Sarah T. - Absent</li>
            <li style={{ padding: '0.5rem 0' }}>David L. - Present</li>
          </ul>
        </div>
      </div>
    </>
  );
}
