import React from 'react';

const templates = [
  { id: '1', title: 'Baptism Certificate', icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', color: '#3B82F6' },
  { id: '2', title: 'Marriage Certificate', icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z', color: '#EC4899' },
  { id: '3', title: 'Confirmation Certificate', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', color: '#F59E0B' },
];

const issuedCertificates = [
  { id: '1', member: 'John Doe', type: 'Baptism', date: '2026-06-15' },
  { id: '2', member: 'Emily Davis', type: 'Confirmation', date: '2026-05-20' },
  { id: '3', member: 'Robert Johnson & Jane Smith', type: 'Marriage', date: '2026-04-10' },
];

export default function CertificatesPage() {
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header className="header">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 600 }}>Certificates</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Generate and manage church certificates for members.
          </p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          Issue New Certificate
        </button>
      </header>

      <div>
        <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Templates</h3>
        <div className="card-grid">
          {templates.map(tpl => (
            <div key={tpl.id} className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: `${tpl.color}15`, color: tpl.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill={tpl.title === 'Marriage Certificate' ? tpl.color : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={tpl.icon}/>
                </svg>
              </div>
              <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{tpl.title}</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Standard template for {tpl.title.toLowerCase()}.</p>
              <button className="btn" style={{ width: '100%', border: '1px solid var(--color-border)', backgroundColor: 'transparent' }}>Use Template</button>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ fontWeight: 600, margin: 0 }}>Recently Issued</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Member(s)</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Type</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Issue Date</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {issuedCertificates.map((cert, i) => (
                <tr key={cert.id} style={{ borderBottom: i === issuedCertificates.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{cert.member}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>{cert.type}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>{cert.date}</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button className="btn" style={{ padding: '0.25rem 0.5rem', color: 'var(--color-primary)', background: 'transparent', fontSize: '0.875rem' }}>View</button>
                    <button className="btn" style={{ padding: '0.25rem 0.5rem', color: 'var(--color-secondary)', background: 'transparent', fontSize: '0.875rem' }}>Print</button>
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
