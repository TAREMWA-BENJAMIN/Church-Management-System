import React, { useState } from 'react';

export default function CellLeaderDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'finance'>('overview');

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
        <button 
          onClick={() => setActiveTab('finance')}
          className={`tab-btn ${activeTab === 'finance' ? 'active' : ''}`}
        >
          Finance Overview
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

      {activeTab === 'finance' && (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Cell Financial Log</h2>
            <button className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.4rem 0.8rem' }}>+ Record Entry</button>
          </div>
          
          <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', background: '#fafafa', borderBottom: '1px solid var(--color-border)' }}>
            <div>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Gross Income</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#16a34a' }}>250,000 UGX</div>
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Immediate Expenses</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#dc2626' }}>-20,000 UGX</div>
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Net Submittable to Parish</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>230,000 UGX</div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'var(--color-surface)' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Date</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Category</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Description</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)', textAlign: 'right' }}>Amount (UGX)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>2026-07-06</td>
                  <td style={{ padding: '1rem 1.5rem' }}><span style={{ padding: '0.2rem 0.5rem', background: 'rgba(22, 163, 74, 0.1)', color: '#16a34a', borderRadius: '4px', fontSize: '0.75rem' }}>Giving</span></td>
                  <td style={{ padding: '1rem 1.5rem' }}>Weekly Cell Meeting Offering</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#16a34a', fontWeight: 500 }}>+150,000</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>2026-07-06</td>
                  <td style={{ padding: '1rem 1.5rem' }}><span style={{ padding: '0.2rem 0.5rem', background: 'rgba(22, 163, 74, 0.1)', color: '#16a34a', borderRadius: '4px', fontSize: '0.75rem' }}>Tithe</span></td>
                  <td style={{ padding: '1rem 1.5rem' }}>Members' Tithe Collected</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#16a34a', fontWeight: 500 }}>+100,000</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'rgba(220, 38, 38, 0.02)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>2026-07-06</td>
                  <td style={{ padding: '1rem 1.5rem' }}><span style={{ padding: '0.2rem 0.5rem', background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', borderRadius: '4px', fontSize: '0.75rem' }}>Expense (Refreshments)</span></td>
                  <td style={{ padding: '1rem 1.5rem' }}>Water and snacks for meeting</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#dc2626', fontWeight: 500 }}>-20,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
