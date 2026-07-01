import React, { useState } from 'react';

// Mock Data structure for the hierarchy
const diocesesData = [
  {
    name: "Kampala Diocese",
    members: 15400,
    revenue: "850M",
    archdeaconries: [
      {
        name: "Central Archdeaconry",
        members: 5200,
        revenue: "300M",
        parishes: [
          { name: "All Saints Cathedral Parish", members: 2100, revenue: "150M" },
          { name: "St. John's Parish", members: 3100, revenue: "150M" }
        ]
      },
      {
        name: "Eastern Archdeaconry",
        members: 10200,
        revenue: "550M",
        parishes: [
          { name: "St. Paul's Parish", members: 4000, revenue: "200M" },
          { name: "St. Luke's Parish", members: 6200, revenue: "350M" }
        ]
      }
    ]
  },
  {
    name: "Namirembe Diocese",
    members: 22000,
    revenue: "1.2B",
    archdeaconries: [
      {
        name: "Namirembe Archdeaconry",
        members: 12000,
        revenue: "700M",
        parishes: [
          { name: "St. Paul's Cathedral", members: 8000, revenue: "500M" }
        ]
      }
    ]
  },
  { name: "Ankole Diocese", members: 9500, revenue: "210M", archdeaconries: [] },
  { name: "Busoga Diocese", members: 11200, revenue: "180M", archdeaconries: [] },
  { name: "Karamoja Diocese", members: 3400, revenue: "45M", archdeaconries: [] }
  // ... other dioceses omitted for brevity in demo
];

export default function ArchbishopDashboard() {
  const [expandedDiocese, setExpandedDiocese] = useState<string | null>(null);
  const [expandedArchdeaconry, setExpandedArchdeaconry] = useState<string | null>(null);

  const toggleDiocese = (name: string) => {
    if (expandedDiocese === name) {
      setExpandedDiocese(null);
      setExpandedArchdeaconry(null);
    } else {
      setExpandedDiocese(name);
      setExpandedArchdeaconry(null);
    }
  };

  const toggleArchdeaconry = (name: string) => {
    if (expandedArchdeaconry === name) {
      setExpandedArchdeaconry(null);
    } else {
      setExpandedArchdeaconry(name);
    }
  };

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
          <div className="card-value">39</div>
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Master Hierarchy Directory</h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Click a Diocese to expand</span>
        </div>
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ position: 'sticky', top: 0, background: 'var(--color-surface)', boxShadow: '0 1px 0 var(--color-border)', zIndex: 10 }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Organization Unit</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Members</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Revenue (YTD)</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {diocesesData.map((diocese, dIndex) => (
                <React.Fragment key={`d-${dIndex}`}>
                  {/* Diocese Row */}
                  <tr 
                    style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer', backgroundColor: expandedDiocese === diocese.name ? 'rgba(79, 70, 229, 0.05)' : 'transparent' }} 
                    className="table-row-hover"
                    onClick={() => toggleDiocese(diocese.name)}
                  >
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>
                      <span style={{ display: 'inline-block', width: '20px' }}>{expandedDiocese === diocese.name ? '▼' : '▶'}</span>
                      {diocese.name}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>{diocese.members.toLocaleString()}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>{diocese.revenue}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <button className="btn" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'var(--color-primary-light)', color: 'white' }}>View Stats</button>
                    </td>
                  </tr>

                  {/* Archdeaconry Rows (Shown if Diocese is expanded) */}
                  {expandedDiocese === diocese.name && diocese.archdeaconries?.map((arch, aIndex) => (
                    <React.Fragment key={`a-${aIndex}`}>
                      <tr 
                        style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer', backgroundColor: expandedArchdeaconry === arch.name ? 'rgba(14, 165, 233, 0.05)' : '#fafafa' }}
                        className="table-row-hover"
                        onClick={() => toggleArchdeaconry(arch.name)}
                      >
                        <td style={{ padding: '0.75rem 1.5rem 0.75rem 3rem', color: 'var(--color-text)' }}>
                          <span style={{ display: 'inline-block', width: '20px', color: 'var(--color-text-muted)' }}>{expandedArchdeaconry === arch.name ? '▼' : '▶'}</span>
                          {arch.name}
                        </td>
                        <td style={{ padding: '0.75rem 1.5rem', color: 'var(--color-text-muted)' }}>{arch.members.toLocaleString()}</td>
                        <td style={{ padding: '0.75rem 1.5rem', color: 'var(--color-text-muted)' }}>{arch.revenue}</td>
                        <td style={{ padding: '0.75rem 1.5rem' }}>
                          <button className="btn" style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', border: '1px solid var(--color-border)' }}>View</button>
                        </td>
                      </tr>

                      {/* Parish Rows (Shown if Archdeaconry is expanded) */}
                      {expandedArchdeaconry === arch.name && arch.parishes?.map((parish, pIndex) => (
                        <tr key={`p-${pIndex}`} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: '#ffffff' }}>
                          <td style={{ padding: '0.5rem 1.5rem 0.5rem 5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                            • {parish.name}
                          </td>
                          <td style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{parish.members.toLocaleString()}</td>
                          <td style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{parish.revenue}</td>
                          <td style={{ padding: '0.5rem 1.5rem' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)' }}>Parish Level</span>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .table-row-hover:hover {
          background-color: rgba(0, 0, 0, 0.02) !important;
        }
      `}</style>
    </>
  );
}
