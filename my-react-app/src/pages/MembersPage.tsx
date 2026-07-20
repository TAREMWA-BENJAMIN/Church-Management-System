import React, { useEffect, useState } from 'react';
import { createUser, deleteUser, fetchDirectorates, fetchUsers, updateUser } from '../services/api';

type Member = { id: number; name: string; role: string; email: string; phone_number?: string; parish?: string; directorate_id?: number; directorate?: { id: number; name: string }; status?: 'Active' | 'Inactive' };

const roleOptions = [
  'SuperAdmin',
  'Archbishop',
  'Bishop',
  'Assistant Bishop',
  'Archdeacon',
  'Canon',
  'Dean',
  'Parish Priest',
  'Assistant Priest',
  'Deacon',
  'Lay Reader',
  'DirectorateAdmin',
  'DirectorateManager',
];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'Parish Priest', phone_number: '' });
  const [directorates, setDirectorates] = useState<{ id: number; name: string }[]>([]);
  const [directorateId, setDirectorateId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMembers();
    loadDirectorates();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setMembers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadDirectorates = async () => {
    try {
      const data = await fetchDirectorates();
      setDirectorates(data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMembers = members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const resetForm = () => {
    setForm({ name: '', email: '', role: 'Parish Priest', phone_number: '' });
    setDirectorateId('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        directorate_id: directorateId === '' ? null : directorateId,
      };

      if (editingId) {
        await updateUser(editingId, payload);
      } else {
        await createUser(payload);
      }

      await loadMembers();
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Unable to save member. Please check the form values.');
    }
  };

  const handleEdit = (member: Member) => {
    setEditingId(member.id);
    setForm({
      name: member.name,
      email: member.email,
      role: member.role,
      phone_number: member.phone_number || '',
    });
    setDirectorateId(member.directorate_id || '');
    setShowForm(true);
  };

  const handleDelete = async (member: Member) => {
    if (!window.confirm(`Delete ${member.name}?`)) return;
    try {
      await deleteUser(member.id);
      await loadMembers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header className="header">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 600 }}>Members</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Manage congregation members and roles.
          </p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => { resetForm(); setShowForm(true); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          Add Member
        </button>
      </header>

      {showForm && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{editingId ? 'Edit Member' : 'Add Member'}</h2>
            <button className="btn" onClick={resetForm}>Cancel</button>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500 }}>Name</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500 }}>Email</label>
              <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500 }}>Phone</label>
              <input value={form.phone_number} onChange={e => setForm({ ...form, phone_number: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500 }}>Role</label>
              <select required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={inputStyle}>
                {roleOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500 }}>Directorate</label>
              <select value={directorateId} onChange={e => setDirectorateId(e.target.value === '' ? '' : Number(e.target.value))} style={inputStyle}>
                <option value="">None</option>
                {directorates.map(dir => <option key={dir.id} value={dir.id}>{dir.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'end' }}>
              <button className="btn btn-primary" type="submit">{editingId ? 'Save Changes' : 'Create Member'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              placeholder="Search members..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }}
            />
          </div>
          <div>
            <select style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-surface)' }}>
              <option value="All">All Parishes</option>
              <option value="St. Peter">St. Peter Parish</option>
              <option value="Holy Trinity">Holy Trinity</option>
            </select>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Name</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Role</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Email</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Phone</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member, index) => (
                <tr key={member.id} style={{ borderBottom: index === filteredMembers.length - 1 ? 'none' : '1px solid var(--color-border)', transition: 'background-color 0.2s ease' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{member.name}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>{member.role}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>{member.email}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>{member.directorate?.name ?? '—'}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>{member.phone_number || '—'}</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button className="btn" style={{ padding: '0.25rem 0.5rem', color: 'var(--color-primary)', background: 'transparent', marginRight: '0.5rem', fontSize: '0.875rem' }} onClick={() => handleEdit(member)}>Edit</button>
                    <button className="btn" style={{ padding: '0.25rem 0.5rem', color: '#EF4444', background: 'transparent', fontSize: '0.875rem' }} onClick={() => handleDelete(member)}>Delete</button>
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

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.7rem 0.9rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  outline: 'none',
  background: 'var(--color-surface)',
};
