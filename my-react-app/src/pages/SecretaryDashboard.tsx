export default function SecretaryDashboard() {
  return (
    <>
      <header className="header">
        <div>
          <h1>Administrative Desk</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Manage Members, Certificates & Events</p>
        </div>
      </header>

      <div className="card-grid">
        <div className="card">
          <div className="card-title">Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            <button className="btn btn-primary">Register New Member</button>
            <button className="btn" style={{ background: 'var(--color-surface-glass)', border: '1px solid var(--color-border)' }}>Issue Certificate</button>
            <button className="btn" style={{ background: 'var(--color-surface-glass)', border: '1px solid var(--color-border)' }}>Record Sacrament</button>
          </div>
        </div>
        <div className="card">
          <div className="card-title">Recent Registrations</div>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', color: 'var(--color-text-muted)' }}>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>John Doe - Awaiting Approval</li>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>Jane Smith - Awaiting Approval</li>
            <li style={{ padding: '0.5rem 0' }}>Peter K. - Approved</li>
          </ul>
        </div>
      </div>
    </>
  );
}
