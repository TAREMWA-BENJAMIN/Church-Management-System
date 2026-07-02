import React, { useState } from 'react';

export default function TreasurerDashboard() {
  const [activeTab, setActiveTab] = useState<'finance'>('finance');

  return (
    <>
      <header className="header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1>Financial Desk</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Manage Tithes, Offerings & Expenses</p>
        </div>
      </header>

      <div className="card-grid" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-title">Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            <button className="btn btn-primary">Record Income Entry</button>
            <button className="btn btn-primary" style={{ backgroundColor: 'var(--color-secondary)', borderColor: 'transparent' }}>Log Expense</button>
          </div>
        </div>
        <div className="card">
          <div className="card-title">Weekly Collections</div>
          <div className="card-value" style={{ color: '#16a34a' }}>+ 3.2M</div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Compared to 2.8M last week</p>
        </div>
        <div className="card">
          <div className="card-title">Pending Diocesan Quota</div>
          <div className="card-value" style={{ color: '#dc2626' }}>1.2M</div>
        </div>
      </div>

      <div className="tab-container">
        <button 
          onClick={() => setActiveTab('finance')}
          className={`tab-btn ${activeTab === 'finance' ? 'active' : ''}`}
        >
          Finance Overview
        </button>
      </div>

      {activeTab === 'finance' && (
        <div className="card-grid" style={{ gridTemplateColumns: '1fr', alignItems: 'start' }}>
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Parish Financial Master Log</h2>
              <button className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.4rem 0.8rem' }}>+ Record Entry</button>
            </div>
            
            <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', background: '#fafafa', borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Gross Income</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#16a34a' }}>10,000,000 UGX</div>
              </div>
              <div>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Immediate Expenses</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#dc2626' }}>-1,200,000 UGX</div>
              </div>
              <div>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Net Submittable to Diocese</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>8,800,000 UGX</div>
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
                    <td style={{ padding: '1rem 1.5rem' }}>2026-07-05</td>
                    <td style={{ padding: '1rem 1.5rem' }}><span style={{ padding: '0.2rem 0.5rem', background: 'rgba(22, 163, 74, 0.1)', color: '#16a34a', borderRadius: '4px', fontSize: '0.75rem' }}>Tithe</span></td>
                    <td style={{ padding: '1rem 1.5rem' }}>Main Sunday Service Tithes</td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#16a34a', fontWeight: 500 }}>+6,000,000</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>2026-07-05</td>
                    <td style={{ padding: '1rem 1.5rem' }}><span style={{ padding: '0.2rem 0.5rem', background: 'rgba(22, 163, 74, 0.1)', color: '#16a34a', borderRadius: '4px', fontSize: '0.75rem' }}>Giving</span></td>
                    <td style={{ padding: '1rem 1.5rem' }}>General Offering</td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#16a34a', fontWeight: 500 }}>+2,500,000</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>2026-07-05</td>
                    <td style={{ padding: '1rem 1.5rem' }}><span style={{ padding: '0.2rem 0.5rem', background: 'rgba(22, 163, 74, 0.1)', color: '#16a34a', borderRadius: '4px', fontSize: '0.75rem' }}>Donation</span></td>
                    <td style={{ padding: '1rem 1.5rem' }}>Building Fund Envelopes</td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#16a34a', fontWeight: 500 }}>+1,500,000</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'rgba(220, 38, 38, 0.02)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>2026-07-05</td>
                    <td style={{ padding: '1rem 1.5rem' }}><span style={{ padding: '0.2rem 0.5rem', background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', borderRadius: '4px', fontSize: '0.75rem' }}>Expense (Utility)</span></td>
                    <td style={{ padding: '1rem 1.5rem' }}>Umeme Electricity Pre-paid Token</td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#dc2626', fontWeight: 500 }}>-400,000</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'rgba(220, 38, 38, 0.02)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>2026-07-05</td>
                    <td style={{ padding: '1rem 1.5rem' }}><span style={{ padding: '0.2rem 0.5rem', background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', borderRadius: '4px', fontSize: '0.75rem' }}>Expense (Maintenance)</span></td>
                    <td style={{ padding: '1rem 1.5rem' }}>Plumbing repair for washrooms</td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#dc2626', fontWeight: 500 }}>-800,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
