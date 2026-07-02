import React, { useState } from 'react';

type Unit = { id: string; name: string; type: 'Diocese' | 'Parish' | 'Cell'; leader: string; location: string };

const initialUnits: Unit[] = [
  { id: '1', name: 'Kampala Diocese', type: 'Diocese', leader: 'Archbishop Stephen K.', location: 'Kampala Central' },
  { id: '2', name: 'St. Peter Parish', type: 'Parish', leader: 'Rev. John D.', location: 'Ntinda' },
  { id: '3', name: 'Grace Cell', type: 'Cell', leader: 'David C.', location: 'Kiwatule' },
];

export default function HierarchyPage() {
  const [units, setUnits] = useState<Unit[]>(initialUnits);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header className="header">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 600 }}>Hierarchy</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Manage and view the organizational structure.
          </p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          Add Unit
        </button>
      </header>

      <div className="card-grid">
        <div className="card">
          <div className="card-title">Total Dioceses</div>
          <div className="card-value">5</div>
        </div>
        <div className="card">
          <div className="card-title">Total Parishes</div>
          <div className="card-value">124</div>
        </div>
        <div className="card">
          <div className="card-title">Total Cells</div>
          <div className="card-value">845</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Organizational Units</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {units.map(unit => (
            <div key={unit.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', transition: 'all 0.2s ease', background: 'var(--color-surface)' }} className="unit-row">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600 }}>{unit.name}</span>
                  <span style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem', borderRadius: '9999px', backgroundColor: unit.type === 'Diocese' ? 'rgba(79, 70, 229, 0.1)' : unit.type === 'Parish' ? 'rgba(14, 165, 233, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: unit.type === 'Diocese' ? 'var(--color-primary)' : unit.type === 'Parish' ? 'var(--color-secondary)' : '#10B981', fontWeight: 500 }}>{unit.type}</span>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    {unit.leader}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    {unit.location}
                  </span>
                </div>
              </div>
              <div>
                <button className="btn" style={{ padding: '0.5rem', color: 'var(--color-text-muted)', background: 'transparent' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
