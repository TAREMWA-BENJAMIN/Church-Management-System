import React, { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'Profile' | 'Notifications' | 'System'>('Profile');

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header className="header">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 600 }}>Settings</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Manage your personal preferences and system configurations.
          </p>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Settings Sidebar */}
        <div className="card" style={{ width: '250px', padding: '1rem' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {['Profile', 'Notifications', 'System'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: activeTab === tab ? 'var(--color-primary)' : 'transparent',
                  color: activeTab === tab ? 'white' : 'var(--color-text)',
                  fontWeight: activeTab === tab ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="card" style={{ flex: 1, minHeight: '400px' }}>
          {activeTab === 'Profile' && (
            <div className="fade-in">
              <h3 style={{ fontWeight: 600, marginBottom: '1.5rem', fontSize: '1.25rem' }}>Profile Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 600 }}>
                    S
                  </div>
                  <button className="btn" style={{ border: '1px solid var(--color-border)', backgroundColor: 'transparent' }}>Change Avatar</button>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--color-text)' }}>Full Name</label>
                  <input type="text" defaultValue="Stephen K." style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--color-text)' }}>Email Address</label>
                  <input type="email" defaultValue="stephen.k@cmsystem.local" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} />
                </div>

                <div style={{ paddingTop: '1rem' }}>
                  <button className="btn btn-primary">Save Changes</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="fade-in">
              <h3 style={{ fontWeight: 600, marginBottom: '1.5rem', fontSize: '1.25rem' }}>Notification Preferences</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  { title: 'Email Notifications', desc: 'Receive daily summary emails of church activities.' },
                  { title: 'SMS Alerts', desc: 'Get urgent notifications and reminders via SMS.' },
                  { title: 'New Member Alerts', desc: 'Notify me when a new member registers.' }
                ].map((notif, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: idx !== 2 ? '1px solid var(--color-border)' : 'none' }}>
                    <div>
                      <h4 style={{ fontWeight: 500 }}>{notif.title}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{notif.desc}</p>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                      <input type="checkbox" defaultChecked={idx !== 1} style={{ opacity: 0, width: 0, height: 0 }} />
                      <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: idx !== 1 ? 'var(--color-primary)' : '#cbd5e1', borderRadius: '34px', transition: '.4s' }}>
                        <span style={{ position: 'absolute', height: '18px', width: '18px', left: idx !== 1 ? '26px' : '3px', bottom: '3px', backgroundColor: 'white', borderRadius: '50%', transition: '.4s' }}></span>
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'System' && (
            <div className="fade-in">
              <h3 style={{ fontWeight: 600, marginBottom: '1.5rem', fontSize: '1.25rem' }}>System Configurations</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>Advanced settings are restricted to System Administrators only.</p>
              
              <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ color: '#EF4444', fontWeight: 600, marginBottom: '0.5rem' }}>Danger Zone</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Permanently delete your account and all associated data.</p>
                <button className="btn" style={{ backgroundColor: '#EF4444', color: 'white', border: 'none' }}>Delete Account</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
