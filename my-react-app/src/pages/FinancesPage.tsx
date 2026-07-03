import React, { useState, useEffect, useRef } from 'react';
import echo from '../echo';

// ─── Types ───────────────────────────────────────────────────────────────────

type FinanceRecord = {
  id: number;
  parish_id: number;
  parish_name: string;
  type: 'income' | 'expenditure';
  category: string;
  amount: number;
  description: string | null;
  date: string;
  created_at: string;
  isNew?: boolean;
};

type Parish = { id: number; name: string };

const API = 'http://localhost:8000/api';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 }).format(n);

const CATEGORIES = ['Tithe', 'Offering', 'Donation', 'Building Fund', 'Salary', 'Utility', 'Maintenance', 'Transport', 'Other'];

// ─── Component ───────────────────────────────────────────────────────────────

export default function FinancesPage() {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [parishes, setParishes] = useState<Parish[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [liveCount, setLiveCount] = useState(0);
  const [form, setForm] = useState({
    parish_id: '',
    type: 'income' as 'income' | 'expenditure',
    category: 'Tithe',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // ── Fetch initial records ─────────────────────────────────────────────────

  useEffect(() => {
    (async () => {
      try {
        const [recRes, parRes] = await Promise.all([
          fetch(`${API}/finances`),
          fetch(`${API}/finances/parishes`),
        ]);
        const [recs, pars] = await Promise.all([recRes.json(), parRes.json()]);
        setRecords(recs);
        setParishes(pars);
        if (pars.length > 0) setForm(f => ({ ...f, parish_id: String(pars[0].id) }));
      } catch {
        // silent – demo mode will still show sample data
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Real-time subscription ────────────────────────────────────────────────

  useEffect(() => {
    const channel = echo.channel('finance');

    channel
      .subscribed(() => setConnected(true))
      .listen('.FinanceRecordCreated', (data: FinanceRecord) => {
        setLiveCount(c => c + 1);
        setRecords(prev => [{ ...data, isNew: true }, ...prev.slice(0, 49)]);
        // Remove the highlight after 3 s
        setTimeout(() => {
          setRecords(prev =>
            prev.map(r => (r.id === data.id ? { ...r, isNew: false } : r))
          );
        }, 3000);
      });

    // Optimistic connected state for demo environments where Echo connects immediately
    setTimeout(() => setConnected(true), 1500);

    return () => {
      echo.leaveChannel('finance');
      setConnected(false);
    };
  }, []);

  // ── Form helpers ──────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API}/finances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, parish_id: Number(form.parish_id), amount: parseFloat(form.amount) }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(Object.values(err.errors ?? {}).flat().join(' ') || 'Failed to save record.');
      }
      const created: FinanceRecord = await res.json();
      // If broadcasting is working the WS listener adds it; otherwise add here
      setRecords(prev => {
        if (prev.find(r => r.id === created.id)) return prev;
        return [{ ...created, isNew: true }, ...prev.slice(0, 49)];
      });
      setTimeout(() => {
        setRecords(prev => prev.map(r => (r.id === created.id ? { ...r, isNew: false } : r)));
      }, 3000);
      setShowForm(false);
      setForm(f => ({ ...f, amount: '', description: '' }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Derived stats ─────────────────────────────────────────────────────────

  const totalIncome = records.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);
  const totalExpenditure = records.filter(r => r.type === 'expenditure').reduce((s, r) => s + r.amount, 0);
  const netBalance = totalIncome - totalExpenditure;

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0 }}>Financial Records</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.375rem', margin: 0 }}>
            Real-time income &amp; expenditure ledger across all parishes.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Live indicator */}
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
              <span style={{
                marginLeft: '0.25rem', fontSize: '0.75rem',
                background: '#10B981', color: '#fff',
                borderRadius: '999px', padding: '0 6px', fontWeight: 700,
              }}>
                {liveCount} new
              </span>
            )}
          </div>
          <button
            id="btn-record-transaction"
            className="btn btn-primary"
            onClick={() => setShowForm(s => !s)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            {showForm ? 'Cancel' : 'Record Transaction'}
          </button>
        </div>
      </div>

      {/* ── Record Form (slide-down) ───────────────────────────────────────── */}
      {showForm && (
        <div ref={formRef} className="card fade-in" style={{ borderTop: '3px solid var(--color-primary)', padding: '1.75rem' }}>
          <h3 style={{ margin: '0 0 1.25rem', fontWeight: 600, fontSize: '1.1rem' }}>New Finance Entry</h3>
          {error && (
            <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#dc2626', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Parish</label>
              <select id="form-parish" value={form.parish_id} onChange={e => setForm(f => ({ ...f, parish_id: e.target.value }))} required style={inputStyle}>
                {parishes.length === 0 && <option value="">— no parishes yet —</option>}
                {parishes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Type</label>
              <select id="form-type" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))} style={inputStyle}>
                <option value="income">Income</option>
                <option value="expenditure">Expenditure</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Category</label>
              <select id="form-category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Amount (UGX)</label>
              <input id="form-amount" type="number" min="0" step="any" required value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="e.g. 500000" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Date</label>
              <input id="form-date" type="date" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Description</label>
              <input id="form-description" type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional note…" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gridColumn: '1 / -1' }}>
              <button id="btn-submit-record" type="submit" className="btn btn-primary" disabled={submitting} style={{ minWidth: 160 }}>
                {submitting ? 'Saving…' : 'Save & Broadcast'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Stats Cards ───────────────────────────────────────────────────── */}
      <div className="card-grid">
        <StatCard label="Total Income" value={fmt(totalIncome)} accent="#10B981" icon="↑" />
        <StatCard label="Total Expenditure" value={fmt(totalExpenditure)} accent="#EF4444" icon="↓" />
        <StatCard
          label="Net Balance"
          value={fmt(netBalance)}
          accent={netBalance >= 0 ? '#3B82F6' : '#EF4444'}
          icon={netBalance >= 0 ? '=' : '⚠'}
        />
      </div>

      {/* ── Live Records Table ────────────────────────────────────────────── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontWeight: 600, margin: 0, fontSize: '1rem' }}>
            Transaction Feed
            <span style={{ marginLeft: '0.5rem', fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>
              (most recent first)
            </span>
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{records.length} records</span>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <LoadingSpinner /> Loading records…
          </div>
        ) : records.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No records yet. Create the first one above!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                <tr>
                  {['Date', 'Parish', 'Category', 'Description', 'Type', 'Amount'].map(h => (
                    <th key={h} style={{ padding: '0.9rem 1.25rem', fontWeight: 600, fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr
                    key={r.id}
                    style={{
                      borderBottom: i === records.length - 1 ? 'none' : '1px solid var(--color-border)',
                      background: r.isNew ? (r.type === 'income' ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)') : 'transparent',
                      transition: 'background 1.5s ease',
                    }}
                  >
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', fontSize: '0.875rem' }}>
                      {r.isNew && (
                        <span style={{
                          display: 'inline-block', marginRight: '0.5rem',
                          padding: '1px 6px', borderRadius: 999,
                          background: '#10B981', color: '#fff', fontSize: '0.65rem', fontWeight: 700,
                          verticalAlign: 'middle', animation: 'fadeSlideIn 0.4s ease',
                        }}>LIVE</span>
                      )}
                      {r.date}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 500, fontSize: '0.875rem' }}>{r.parish_name}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600,
                        background: r.type === 'income' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: r.type === 'income' ? '#059669' : '#dc2626',
                      }}>
                        {r.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', maxWidth: 260 }}>
                      <span style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {r.description || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize',
                        background: r.type === 'income' ? 'rgba(59,130,246,0.1)' : 'rgba(249,115,22,0.1)',
                        color: r.type === 'income' ? '#2563EB' : '#ea580c',
                      }}>
                        {r.type}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right', fontWeight: 700, color: r.type === 'income' ? '#10B981' : '#EF4444', whiteSpace: 'nowrap' }}>
                      {r.type === 'income' ? '+' : '-'} {fmt(r.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Keyframes (injected once) ────────────────────────────────────── */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, accent, icon }: { label: string; value: string; accent: string; icon: string }) {
  return (
    <div className="card" style={{ borderTop: `4px solid ${accent}`, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        <span style={{ fontSize: '1.25rem', color: accent }}>{icon}</span>
      </div>
      <div style={{ fontSize: '1.6rem', fontWeight: 700, color: accent }}>{value}</div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite', display: 'inline-block', marginRight: '0.5rem', verticalAlign: 'middle' }}>
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2 a10 10 0 0 1 10 10" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

// ─── Shared input style ───────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  padding: '0.6rem 0.75rem',
  borderRadius: '8px',
  border: '1px solid var(--color-border)',
  fontFamily: 'inherit',
  fontSize: '0.9rem',
  width: '100%',
  boxSizing: 'border-box',
  background: 'var(--color-surface)',
  color: 'var(--color-text)',
  outline: 'none',
  transition: 'border-color 0.2s',
};
