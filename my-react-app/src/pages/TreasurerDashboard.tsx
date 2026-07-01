export default function TreasurerDashboard() {
  return (
    <>
      <header className="header">
        <div>
          <h1>Financial Desk</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Manage Tithes, Offerings & Expenses</p>
        </div>
      </header>

      <div className="card-grid">
        <div className="card">
          <div className="card-title">Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            <button className="btn btn-primary">Record Offering</button>
            <button className="btn btn-primary" style={{ backgroundColor: 'var(--color-secondary)', borderColor: 'transparent' }}>Log Expense</button>
          </div>
        </div>
        <div className="card">
          <div className="card-title">Weekly Collections</div>
          <div className="card-value" style={{ color: '#16a34a' }}>+ 3.2M</div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Compared to 2.8M last week</p>
        </div>
        <div className="card">
          <div className="card-title">Recent Transactions</div>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>Tithe (J. Doe) - 50,000</li>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>Sunday Offering - 1,200,000</li>
            <li style={{ padding: '0.5rem 0', color: '#dc2626' }}>Electricity Bill - (200,000)</li>
          </ul>
        </div>
      </div>
    </>
  );
}
