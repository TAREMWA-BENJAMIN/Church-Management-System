import React, { useState } from 'react';

type Member = { id: string; name: string; role: string; parish: string; status: 'Active' | 'Inactive' };

const initialMembers: Member[] = [
  { id: '1', name: 'John Doe', role: 'Parishioner', parish: 'St. Peter Parish', status: 'Active' },
  { id: '2', name: 'Jane Smith', role: 'Cell Leader', parish: 'St. Peter Parish', status: 'Active' },
  { id: '3', name: 'Robert Johnson', role: 'Elder', parish: 'Holy Trinity', status: 'Inactive' },
  { id: '4', name: 'Emily Davis', role: 'Deacon', parish: 'St. Paul Parish', status: 'Active' },
  { id: '5', name: 'Michael Brown', role: 'Parishioner', parish: 'St. Peter Parish', status: 'Active' },
];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header className="header">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 600 }}>Members</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Manage congregation members and roles.
          </p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          Add Member
        </button>
      </header>

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
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Parish</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member, index) => (
                <tr key={member.id} style={{ borderBottom: index === filteredMembers.length - 1 ? 'none' : '1px solid var(--color-border)', transition: 'background-color 0.2s ease' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{member.name}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>{member.role}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>{member.parish}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500, backgroundColor: member.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: member.status === 'Active' ? '#10B981' : '#EF4444' }}>
                      {member.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button className="btn" style={{ padding: '0.25rem 0.5rem', color: 'var(--color-primary)', background: 'transparent', marginRight: '0.5rem', fontSize: '0.875rem' }}>Edit</button>
                    <button className="btn" style={{ padding: '0.25rem 0.5rem', color: '#EF4444', background: 'transparent', fontSize: '0.875rem' }}>Delete</button>
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
