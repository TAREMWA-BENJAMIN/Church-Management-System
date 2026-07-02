import React, { useState } from 'react';

type Transaction = { id: string; date: string; description: string; category: string; amount: number; type: 'income' | 'expense' };

const initialTransactions: Transaction[] = [
  { id: '1', date: '2026-06-28', description: 'Sunday Tithes', category: 'Tithe', amount: 4500, type: 'income' },
  { id: '2', date: '2026-06-29', description: 'Church Maintenance', category: 'Maintenance', amount: 1200, type: 'expense' },
  { id: '3', date: '2026-06-30', description: 'Thanksgiving Offering', category: 'Offering', amount: 850, type: 'income' },
  { id: '4', date: '2026-07-01', description: 'Electricity Bill', category: 'Utility', amount: 300, type: 'expense' },
];

export default function FinancesPage() {
  const [transactions] = useState<Transaction[]>(initialTransactions);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header className="header">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 600 }}>Finances</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Overview of church income, expenses, and financial health.
          </p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Record Transaction
        </button>
      </header>

      <div className="card-grid">
        <div className="card" style={{ borderLeft: '4px solid #10B981' }}>
          <div className="card-title">Total Income (This Month)</div>
          <div className="card-value" style={{ color: '#10B981' }}>{formatCurrency(totalIncome)}</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #EF4444' }}>
          <div className="card-title">Total Expenses (This Month)</div>
          <div className="card-value" style={{ color: '#EF4444' }}>{formatCurrency(totalExpense)}</div>
        </div>
        <div className="card" style={{ borderLeft: `4px solid ${totalIncome - totalExpense >= 0 ? '#3B82F6' : '#EF4444'}` }}>
          <div className="card-title">Net Balance</div>
          <div className="card-value">{formatCurrency(totalIncome - totalExpense)}</div>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontWeight: 600, margin: 0 }}>Recent Transactions</h3>
          <button className="btn" style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem', border: '1px solid var(--color-border)', background: 'transparent' }}>View Full Report</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Date</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Description</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Category</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={t.id} style={{ borderBottom: i === transactions.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>{t.date}</td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{t.description}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-muted)' }}>
                      {t.category}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: t.type === 'income' ? '#10B981' : '#EF4444' }}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
