import React from 'react';

const dioceses = [
  "West Ankole Diocese", "Ankole Diocese", "North Ankole Diocese", "South Ankole Diocese",
  "Central Busoga Diocese", "Busoga Diocese", "North Mbale Diocese", "Mbale Diocese",
  "Karamoja Diocese", "Kampala Diocese", "Kigezi Diocese", "Kinkizi Diocese",
  "Kitgum Diocese", "Kumi Diocese", "Lango Diocese", "Luweero Diocese",
  "Madi and West Nile Diocese", "Masindi-Kitara Diocese", "Mityana Diocese", "Muhabura Diocese",
  "Mukono Diocese", "Namirembe Diocese", "Nebbi Diocese", "North Kigezi Diocese",
  "Northern Uganda Diocese", "Ruwenzori Diocese", "Sebei Diocese", "South Rwenzori Diocese",
  "Soroti Diocese", "West Buganda Diocese", "Bunyoro-Kitara Diocese", "East Busoga Diocese",
  "East Ruwenzori Diocese", "Kyagulanyi Diocese", "Central Buganda Diocese", "West Lango Diocese",
  "South Busoga Diocese", "Central Uganda Diocese", "Northern Karamoja Diocese"
];

export default function ArchbishopDashboard() {
  return (
    <>
      <header className="header">
        <div>
          <h1>National Overview</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Church of Uganda Provincial Dashboard</p>
        </div>
      </header>

      <div className="card-grid" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-title">Total Dioceses</div>
          <div className="card-value">{dioceses.length}</div>
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

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Diocesan Directory & Performance</h2>
          <input 
            type="text" 
            placeholder="Search dioceses..." 
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', width: '250px' }}
          />
        </div>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ position: 'sticky', top: 0, background: 'var(--color-surface)', boxShadow: '0 1px 0 var(--color-border)' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Diocese Name</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Members</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Revenue (YTD)</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {dioceses.sort().map((diocese, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }} className="table-row-hover">
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{diocese}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{Math.floor(Math.random() * 5000 + 1000).toLocaleString()}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{(Math.random() * 500 + 50).toFixed(1)}M</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <button className="btn" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'var(--color-primary-light)', color: 'white' }}>View Dashboard</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .table-row-hover:hover {
          background-color: rgba(79, 70, 229, 0.03);
        }
      `}</style>
    </>
  );
}
