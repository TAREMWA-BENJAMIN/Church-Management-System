import React, { useState, useEffect } from 'react';
import echo from '../echo';

type FinanceRecord = {
  id: number;
  parish_name: string;
  type: 'income' | 'expenditure';
  category: string;
  amount: number;
  description: string | null;
  date: string;
  isNew?: boolean;
};

const API = 'http://localhost:8000/api';
const fmt = (n: number) =>
  new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 }).format(n);

export default function TreasurerDashboard() {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [connected, setConnected] = useState(false);
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    fetch(`${API}/finances`)
      .then(r => r.json())
      .then(setRecords)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const channel = echo.channel('finance');
    channel
      .subscribed(() => setConnected(true))
      .listen('.FinanceRecordCreated', (data: FinanceRecord) => {
        setLiveCount(c => c + 1);
        setRecords(prev => [{ ...data, isNew: true }, ...prev.slice(0, 19)]);
        setTimeout(() => {
          setRecords(prev => prev.map(r => (r.id === data.id ? { ...r, isNew: false } : r)));
        }, 3000);
      });
    setTimeout(() => setConnected(true), 1500);
    return () => { echo.leaveChannel('finance'); };
  }, []);

  const totalIncome = records.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);
  const totalExpenditure = records.filter(r => r.type === 'expenditure').reduce((s, r) => s + r.amount, 0);
  const netSubmittable = totalIncome - totalExpenditure;

  return (
    <>
      <header className="header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1>Financial Desk</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Manage Tithes, Offerings &amp; Expenses
          </p>
        </div>
        {/* Live badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.4rem 0.9rem', borderRadius: '999px',
          background: connected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107,114,128,0.1)',
          border: `1px solid ${connected ? 'rgba(16,185,129,0.3)' : 'rgba(107,114,128,0.2)'}`,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: connected ? '#10B981' : '#6B7280',
            boxShadow: connected ? '0 0 0 3px rgba(16,185,129,0.25)' : 'none',
            animation: connected ? 'pulse 2s infinite' : 'none',
            display: 'inline-block',
          }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: connected ? '#059669' : '#6B7280' }}>
            {connected ? 'Live' : 'Connecting…'}
          </span>
          {liveCount > 0 && (
            <span style={{ fontSize: '0.75rem', background: '#10B981', color: '#fff', borderRadius: 999, padding: '0 6px', fontWeight: 700 }}>
              {liveCount} new
            </span>
          )}
        </div>
      </header>

      <div className="card-grid" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ borderTop: '4px solid #16a34a' }}>
          <div className="card-title">Total Income</div>
          <div className="card-value" style={{ color: '#16a34a' }}>{fmt(totalIncome)}</div>
        </div>
        <div className="card" style={{ borderTop: '4px solid #dc2626' }}>
          <div className="card-title">Total Expenditure</div>
          <div className="card-value" style={{ color: '#dc2626' }}>{fmt(totalExpenditure)}</div>
        </div>
        <div className="card" style={{ borderTop: `4px solid ${netSubmittable >= 0 ? '#3B82F6' : '#f97316'}` }}>
          <div className="card-title">Net Submittable to Diocese</div>
          <div className="card-value">{fmt(netSubmittable)}</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Live Transaction Feed</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{records.length} records</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--color-surface)' }}>
              <tr>
                {['Date', 'Parish', 'Category', 'Description', 'Amount'].map(h => (
                  <th key={h} style={{ padding: '0.9rem 1.25rem', fontWeight: 600, fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No records yet.</td></tr>
              ) : records.map((r, i) => (
                <tr key={r.id} style={{
                  borderBottom: i === records.length - 1 ? 'none' : '1px solid var(--color-border)',
                  background: r.isNew ? (r.type === 'income' ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)') : 'transparent',
                  transition: 'background 1.5s ease',
                }}>
                  <td style={{ padding: '0.9rem 1.25rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                    {r.isNew && <span style={{ marginRight: 6, padding: '1px 6px', borderRadius: 999, background: '#10B981', color: '#fff', fontSize: '0.65rem', fontWeight: 700 }}>LIVE</span>}
                    {r.date}
                  </td>
                  <td style={{ padding: '0.9rem 1.25rem', fontWeight: 500, fontSize: '0.875rem' }}>{r.parish_name}</td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>
                    <span style={{ padding: '0.2rem 0.5rem', background: r.type === 'income' ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)', color: r.type === 'income' ? '#16a34a' : '#dc2626', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                      {r.category}
                    </span>
                  </td>
                  <td style={{ padding: '0.9rem 1.25rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{r.description || '—'}</td>
                  <td style={{ padding: '0.9rem 1.25rem', textAlign: 'right', color: r.type === 'income' ? '#16a34a' : '#dc2626', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {r.type === 'income' ? '+' : '-'} {fmt(r.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </>
  );
}
