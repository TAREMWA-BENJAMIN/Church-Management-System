import React, { useEffect, useState } from 'react';
import { adminFetchDirectorates, adminCreateDirectorate, adminUpdateDirectorate, adminDeleteDirectorate } from '../services/api';

type Directorate = { id: number; name: string; description?: string | null; is_active?: boolean; revenue?: number };

export default function DirectoratesPage() {
  const [items, setItems] = useState<Directorate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Directorate | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [revenue, setRevenue] = useState<number | ''>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminFetchDirectorates();
        setItems(res);
      } catch (e: any) {
        setError(e.message || 'Failed to load directorates');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const resetForm = () => { setEditing(null); setName(''); setDescription(''); setIsActive(true); setRevenue(0); setError(null); };

  const handleSave = async () => {
    setError(null);
    try {
      if (!name.trim()) throw new Error('Name is required');
      if (editing) {
        const payload = { name: name.trim(), description, is_active: isActive, revenue: Number(revenue || 0) };
        const updated = await adminUpdateDirectorate(editing.id, payload);
        setItems(items.map(i => i.id === updated.id ? updated : i));
      } else {
        const created = await adminCreateDirectorate({ name: name.trim(), description, is_active: isActive, revenue: Number(revenue || 0) });
        setItems([created, ...items]);
      }
      resetForm();
    } catch (e: any) {
      setError(e.message || 'Failed to save');
    }
  };

  const handleEdit = (d: Directorate) => {
    setEditing(d); setName(d.name); setDescription(d.description || ''); setIsActive(!!d.is_active); setRevenue(d.revenue ?? 0);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this directorate?')) return;
    try {
      await adminDeleteDirectorate(id);
      setItems(items.filter(i => i.id !== id));
    } catch (e: any) {
      setError(e.message || 'Failed to delete');
    }
  };

  return (
    <div>
      <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Directorates</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Manage directorates that can receive and report income.</p>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
        <div style={{ flex: 1 }}>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>List</h3>
            {loading ? <div>Loading…</div> : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Name</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem' }}>Revenue (UGX)</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Active</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(i => (
                    <tr key={i.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '0.5rem' }}>{i.name}</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 700 }}>{typeof i.revenue === 'number' ? new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 }).format(i.revenue) : 'UGX 0'}</td>
                      <td style={{ padding: '0.5rem' }}>{i.is_active ? 'Yes' : 'No'}</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                        <button className="btn" onClick={() => handleEdit(i)} style={{ marginRight: 8 }}>Edit</button>
                        <button className="btn" onClick={() => handleDelete(i.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div style={{ width: 360 }}>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>{editing ? 'Edit' : 'Create'} Directorate</h3>
            {error && <div style={{ color: '#dc2626', marginBottom: '0.5rem' }}>{error}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Name</label>
                <input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Description</label>
                <input value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Revenue (UGX)</label>
                <input type="number" min={0} value={revenue as any} onChange={e => setRevenue(e.target.value === '' ? '' : Number(e.target.value))} style={{ width: '100%', padding: '0.5rem' }} />
              </div>
              <div>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} /> Active
                </label>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary" onClick={handleSave}>{editing ? 'Save changes' : 'Create'}</button>
                <button className="btn" onClick={resetForm}>Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
