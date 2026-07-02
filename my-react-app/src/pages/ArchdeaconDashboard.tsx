import React, { useState, useEffect, useRef } from 'react';
import { fetchCommunications, sendCommunication, markAsRead, fetchDirectory } from '../services/api';

// Mock Data for Eastern Archdeaconry
const archdeaconryData = {
  name: 'Eastern Archdeaconry',
  archdeacon: 'Ven. Michael S.',
  diocese: 'Kampala Diocese',
  bishop: 'Bishop James W.',
  parishes: [
    {
      name: "St. Paul's Parish",
      priest: 'Rev. John D.',
      members: 4000,
      revenue: '200M',
      cells: 14,
      status: 'Active',
    },
    {
      name: "St. Luke's Parish",
      priest: 'Rev. Paul M.',
      members: 6200,
      revenue: '350M',
      cells: 18,
      status: 'Active',
    },
    {
      name: "St. Mark's Mission",
      priest: 'Rev. Andrew K.',
      members: 1050,
      revenue: '45M',
      cells: 5,
      status: 'Mission',
    },
  ],
};

interface Attachment {
  name: string;
  type: 'pdf' | 'excel' | 'photo';
  size: string;
  contentId?: string;
  fileUrl?: string;
}

interface Message {
  id: string;
  from: string;
  fromRole: 'Archbishop' | 'Bishop' | 'Priest' | 'Archdeaconry';
  to: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  attachments: Attachment[];
}

const mockArchdeaconMessages: Message[] = [
  {
    id: 'msg-arch-1',
    from: "St. Paul's Parish (Rev. John D.)",
    fromRole: 'Priest',
    to: 'Eastern Archdeaconry',
    subject: 'Easter Baptism Stats Submission',
    body: "Dear Ven. Michael,\n\nPlease find our Easter baptism and confirmation statistics as requested. We had a fruitful Easter season with 62 total baptisms against a target of 55.\n\nRespectfully,\nRev. John D.",
    date: '2026-07-01T08:30:00.000Z',
    read: false,
    attachments: [
      { name: 'Baptism_Report_St_Pauls.xlsx', type: 'excel', size: '14 KB', contentId: 'arch_excel_1' },
    ],
  },
  {
    id: 'msg-arch-2',
    from: "St. Luke's Parish (Rev. Paul M.)",
    fromRole: 'Priest',
    to: 'Eastern Archdeaconry',
    subject: 'Building Fund Project Update',
    body: "Venerable Michael,\n\nThe new parish hall project has reached the roofing stage. The contractor estimates completion by end of July. Please find the photo documentation attached.\n\nGod Bless,\nRev. Paul M.",
    date: '2026-06-28T10:15:00.000Z',
    read: true,
    attachments: [
      { name: 'Hall_Progress_Photos.jpg', type: 'photo', size: '3.2 MB', contentId: 'arch_photo_1' },
    ],
  },
  {
    id: 'msg-arch-3',
    from: 'Kampala Diocese (Bishop James W.)',
    fromRole: 'Bishop',
    to: 'Eastern Archdeaconry',
    subject: 'Synod Preparatory Brief — All Archdeaconries',
    body: "Dear Venerable Archdeacons,\n\nKindly ensure all your parishes have received the enclosed Synod preparatory brief and financial template. Reports should be consolidated at Archdeaconry level and forwarded to this office by July 15th.\n\nBlessings,\nBishop James W.\nKampala Diocese",
    date: '2026-06-25T09:00:00.000Z',
    read: true,
    attachments: [
      { name: 'Synod_Brief_All_Arch.pdf', type: 'pdf', size: '1.8 MB', contentId: 'arch_pdf_1' },
      { name: 'Financial_Template_Synod.xlsx', type: 'excel', size: '44 KB', contentId: 'arch_excel_2' },
    ],
  },
];

export default function ArchdeaconDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'comms' | 'finance'>('overview');
  const [expandedParish, setExpandedParish] = useState<string | null>(null);

  // Communications State
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [commsView, setCommsView] = useState<'inbox' | 'sent'>('inbox');
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'pdf' | 'excel' | 'photo'>('all');

  // Compose Form State
  const [composeTo, setComposeTo] = useState<string>('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; type: 'pdf' | 'excel' | 'photo'; size: string; fileUrl?: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Previewer States
  const [activePreview, setActivePreview] = useState<Attachment | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [excelData, setExcelData] = useState<any[][]>([]);

  const [directory, setDirectory] = useState<{
    dioceses: { id: number; name: string }[];
    archdeaconries: { id: number; name: string; diocese_id: number }[];
    parishes: { id: number; name: string; archdeaconry_id: number }[];
  }>({ dioceses: [], archdeaconries: [], parishes: [] });

  useEffect(() => {
    fetchDirectory().then(setDirectory).catch(console.error);
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        // Archdeaconry ID 1 (Eastern Archdeaconry) for demo
        const data = await fetchCommunications('App\\Models\\Archdeaconry', 1, commsView);
        const formattedMessages: Message[] = data.map((c: any) => ({
          id: c.id.toString(),
          from: c.sender?.name || 'Unknown',
          fromRole: c.sender_type?.includes('Diocese') ? 'Bishop' : 'Priest',
          to: c.receiver?.name || 'Unknown',
          subject: c.subject,
          body: c.message,
          date: c.created_at,
          read: c.is_read,
          attachments: [],
        }));
        // Merge backend messages with rich mock data (mock first for demo richness)
        setMessages([...mockArchdeaconMessages, ...formattedMessages]);
      } catch (err) {
        console.error(err);
        setMessages(mockArchdeaconMessages);
      }
    };
    loadMessages();
  }, [commsView]);

  const toggleParish = (name: string) => {
    setExpandedParish(expandedParish === name ? null : name);
  };

  const handleSelectMessage = async (msg: Message) => {
    setSelectedMessage(msg);
    setShowCompose(false);
    setActivePreview(null);
    if (!msg.read && commsView === 'inbox') {
      const numericId = parseInt(msg.id);
      if (!isNaN(numericId)) {
        try {
          await markAsRead(numericId);
          setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
        } catch (e) { console.error(e); }
      } else {
        // local mock — just mark read in state
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
      }
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch =
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.to.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType !== 'all') {
      return msg.attachments.some(att => att.type === filterType);
    }
    return true;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      let type: 'pdf' | 'excel' | 'photo' = 'pdf';
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
        type = 'photo';
      } else if (['xls', 'xlsx', 'csv'].includes(extension || '')) {
        type = 'excel';
      }
      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`;
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedFiles(prev => [...prev, { name: file.name, type, size: sizeStr, fileUrl: reader.result as string }]);
      };
      if (type === 'photo') {
        reader.readAsDataURL(file);
      } else {
        setAttachedFiles(prev => [...prev, { name: file.name, type, size: sizeStr, fileUrl: `mock-file-url-${file.name}` }]);
      }
    });
    if (fileInputRef.current) e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeSubject.trim() || !composeBody.trim() || !composeTo) return;

    let receiverType = 'App\\Models\\Parish';
    let receiverId = parseInt(composeTo);

    if (composeTo.startsWith('d-')) {
      receiverType = 'App\\Models\\Diocese';
      receiverId = parseInt(composeTo.replace('d-', ''));
    }

    try {
      await sendCommunication({
        sender_type: 'App\\Models\\Archdeaconry',
        sender_id: 1, // Mock: Eastern Archdeaconry ID 1
        receiver_type: receiverType,
        receiver_id: receiverId,
        subject: composeSubject,
        message: composeBody,
      });
      setComposeSubject('');
      setComposeBody('');
      setAttachedFiles([]);
      setShowCompose(false);
      setCommsView('sent');
      alert('Message successfully sent!');
    } catch (e) {
      console.error(e);
      alert('Failed to send message');
    }
  };

  const openAttachmentPreview = (att: Attachment) => {
    setActivePreview(att);
    setZoomLevel(100);
    if (att.type === 'excel') {
      if (att.contentId === 'arch_excel_1') {
        setExcelData([
          ['Section', 'Baptisms Target', 'Baptisms Actual', 'Confirmations Target', 'Confirmations Actual'],
          ["Cell A (Men's Fellowship)", '5', '4', '8', '6'],
          ['Cell B (Youth Ministry)', '15', '18', '20', '22'],
          ['Cell C (Mothers Union)', '10', '10', '12', '12'],
          ['Sunday School / Children', '25', '30', '-', '-'],
          ['Total Parish Summary', '55', '62', '40', '40'],
        ]);
      } else if (att.contentId === 'arch_excel_2') {
        setExcelData([
          ['Parish', 'Q2 Income (UGX)', 'Q2 Expenses', 'Net', 'Status'],
          ["St. Paul's Parish", '200,000,000', '18,000,000', '182,000,000', 'Healthy'],
          ["St. Luke's Parish", '350,000,000', '24,000,000', '326,000,000', 'Healthy'],
          ["St. Mark's Mission", '45,000,000', '8,000,000', '37,000,000', 'Review'],
          ['Total Archdeaconry', '595,000,000', '50,000,000', '545,000,000', 'On Track'],
        ]);
      } else {
        setExcelData([['Title', 'Value'], ['Custom Data Row', '—']]);
      }
    }
  };

  const handleCellEdit = (r: number, c: number, val: string) => {
    const updated = [...excelData];
    updated[r][c] = val;
    setExcelData(updated);
  };

  const unreadCount = messages.filter(m => !m.read).length;
  const totalMembers = archdeaconryData.parishes.reduce((s, p) => s + p.members, 0);
  const latestInboxMsg = messages.find(m => m.fromRole === 'Bishop' || m.fromRole === 'Archbishop');

  return (
    <>
      <header className="header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1>Archdeaconry Overview</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            {archdeaconryData.name} — {archdeaconryData.diocese}
          </p>
        </div>
      </header>

      {/* Top Stats Cards */}
      <div className="card-grid" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
          <div className="card-title">Parishes</div>
          <div className="card-value">{archdeaconryData.parishes.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Under this Archdeaconry</div>
        </div>
        <div className="card">
          <div className="card-title">Total Members</div>
          <div className="card-value">{totalMembers.toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="card-title">Unread Messages</div>
          <div className="card-value" style={{ color: unreadCount > 0 ? 'var(--color-primary)' : 'inherit' }}>{unreadCount}</div>
        </div>
        <div className="card">
          <div className="card-title">Archdeaconry Revenue (YTD)</div>
          <div className="card-value" style={{ color: '#16a34a' }}>595M</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tab-container">
        <button
          onClick={() => setActiveTab('overview')}
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
        >
          Parish Directory & Alerts
        </button>
        <button
          onClick={() => setActiveTab('comms')}
          className={`tab-btn ${activeTab === 'comms' ? 'active' : ''}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Communications Hub</span>
            {unreadCount > 0 && (
              <span className="badge-unread">{unreadCount}</span>
            )}
          </div>
        </button>
        <button
          onClick={() => setActiveTab('finance')}
          className={`tab-btn ${activeTab === 'finance' ? 'active' : ''}`}
        >
          Finance Overview
        </button>
      </div>

      {/* TAB: PARISH DIRECTORY */}
      {activeTab === 'overview' && (
        <div className="card-grid" style={{ gridTemplateColumns: '2fr 1fr', alignItems: 'start' }}>
          {/* Parish Table */}
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Parish Directory</h2>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Click to expand details</span>
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ position: 'sticky', top: 0, background: 'var(--color-surface)', boxShadow: '0 1px 0 var(--color-border)', zIndex: 10 }}>
                  <tr>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Parish Name</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Priest</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Members</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Revenue</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {archdeaconryData.parishes.map((parish, index) => (
                    <React.Fragment key={index}>
                      <tr
                        style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer', backgroundColor: expandedParish === parish.name ? 'rgba(79, 70, 229, 0.05)' : 'transparent' }}
                        className="table-row-hover"
                        onClick={() => toggleParish(parish.name)}
                      >
                        <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>
                          <span style={{ display: 'inline-block', width: '20px' }}>{expandedParish === parish.name ? '▼' : '▶'}</span>
                          {parish.name}
                        </td>
                        <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>{parish.priest}</td>
                        <td style={{ padding: '1rem 1.5rem' }}>{parish.members.toLocaleString()}</td>
                        <td style={{ padding: '1rem 1.5rem' }}>{parish.revenue} UGX</td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <span style={{
                            padding: '0.25rem 0.6rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            backgroundColor: parish.status === 'Active' ? 'rgba(22, 163, 74, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            color: parish.status === 'Active' ? '#16a34a' : '#d97706',
                          }}>
                            {parish.status}
                          </span>
                        </td>
                      </tr>
                      {expandedParish === parish.name && (
                        <tr style={{ backgroundColor: '#fafafa', borderBottom: '1px solid var(--color-border)' }}>
                          <td colSpan={5} style={{ padding: '1rem 1.5rem 1rem 3rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                              <div>
                                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Cells</span>
                                <strong>{parish.cells} Active Cells</strong>
                              </div>
                              <div>
                                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Priest</span>
                                <strong>{parish.priest}</strong>
                              </div>
                              <div>
                                <button
                                  className="btn btn-primary"
                                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
                                  onClick={(e) => { e.stopPropagation(); setActiveTab('comms'); setShowCompose(true); }}
                                >
                                  Send Message
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Diocese Memo */}
            <div
              className="card"
              style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)', color: 'white', cursor: 'pointer' }}
              onClick={() => { setActiveTab('comms'); if (latestInboxMsg) handleSelectMessage(latestInboxMsg); }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Bishop's Memo</h3>
              <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                "{latestInboxMsg?.subject || 'Synod reports to be submitted by July 15th.'}"
              </p>
              <span style={{ fontSize: '0.75rem', opacity: 0.7, textDecoration: 'underline', marginTop: '0.5rem', display: 'inline-block' }}>Open Communications</span>
            </div>

            {/* Unread Messages Quick View */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Parish Inbound</h3>
                <button
                  className="btn"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', border: '1px solid var(--color-border)' }}
                  onClick={() => { setActiveTab('comms'); setShowCompose(true); }}
                >
                  + Compose
                </button>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.875rem' }}>
                {messages.filter(m => m.fromRole === 'Priest').slice(0, 2).map((m, idx) => (
                  <li key={idx} style={{ padding: '0.75rem 0', borderBottom: idx === 0 ? '1px solid var(--color-border)' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <strong style={{ color: 'var(--color-text)' }}>{m.from.split('(')[0].trim()}</strong>
                      {!m.read && <span style={{ color: 'var(--color-primary)', fontSize: '0.7rem', fontWeight: 600 }}>NEW</span>}
                    </div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>{m.subject}</span>
                    <button
                      className="btn"
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'var(--color-bg)', color: 'var(--color-text-muted)' }}
                      onClick={() => { setActiveTab('comms'); handleSelectMessage(m); }}
                    >
                      View
                    </button>
                  </li>
                ))}
              </ul>
              <a
                href="#"
                style={{ display: 'block', marginTop: '0.5rem', color: 'var(--color-primary)', fontWeight: 500, textDecoration: 'none', textAlign: 'center', fontSize: '0.875rem' }}
                onClick={(e) => { e.preventDefault(); setActiveTab('comms'); }}
              >
                View All Messages
              </a>
            </div>

            {/* Action Required */}
            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Action Required</h3>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.875rem' }}>
                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)' }}>
                  <strong style={{ color: 'var(--color-text)' }}>Synod Report Due</strong><br />
                  <span style={{ color: 'var(--color-text-muted)' }}>Consolidate all parish reports by July 15th.</span>
                </li>
                <li style={{ padding: '0.75rem 0' }}>
                  <strong style={{ color: 'var(--color-text)' }}>Mission Status Review</strong><br />
                  <span style={{ color: 'var(--color-text-muted)' }}>St. Mark's Mission awaits Archdeacon review.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB: COMMUNICATIONS HUB */}
      {activeTab === 'comms' && (
        <div className="mailroom-grid">
          {/* LEFT PANEL: MAIL LISTING */}
          <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '620px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="segmented-control">
                <button
                  className={`segment-btn ${commsView === 'inbox' ? 'active' : ''}`}
                  onClick={() => { setCommsView('inbox'); setShowCompose(false); }}
                >
                  Inbox
                </button>
                <button
                  className={`segment-btn ${commsView === 'sent' ? 'active' : ''}`}
                  onClick={() => { setCommsView('sent'); setShowCompose(false); }}
                >
                  Sent
                </button>
              </div>
              <button
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', padding: '0.4rem 0.8rem' }}
                onClick={() => setShowCompose(true)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Compose
              </button>
            </div>

            {/* Search & Filters */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search mail..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', paddingLeft: '2.25rem', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.875rem', outline: 'none' }}
                />
                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>🔍</span>
              </div>
              <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                <button className={`filter-tag ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>All</button>
                <button className={`filter-tag ${filterType === 'pdf' ? 'active' : ''}`} onClick={() => setFilterType('pdf')}>📄 PDFs</button>
                <button className={`filter-tag ${filterType === 'excel' ? 'active' : ''}`} onClick={() => setFilterType('excel')}>📊 Spreadsheets</button>
                <button className={`filter-tag ${filterType === 'photo' ? 'active' : ''}`} onClick={() => setFilterType('photo')}>🖼️ Photos</button>
              </div>
            </div>

            {/* Email List */}
            <div className="email-list-scroll">
              {filteredMessages.length === 0 ? (
                <div className="empty-state">
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No communications found.</p>
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`email-item-card ${selectedMessage?.id === msg.id && !showCompose ? 'selected' : ''} ${!msg.read ? 'unread' : ''}`}
                    onClick={() => handleSelectMessage(msg)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                      <span className="email-sender">{commsView === 'inbox' ? msg.from : `To: ${msg.to}`}</span>
                      <span className="email-date">{new Date(msg.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="email-subject">{msg.subject}</div>
                    <div className="email-body-snippet">{msg.body}</div>
                    {msg.attachments.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.5rem' }}>
                        {msg.attachments.map((att, i) => (
                          <span key={i} className="attachment-icon-pill">
                            {att.type === 'pdf' ? '📄' : att.type === 'excel' ? '📊' : '🖼️'} {att.name.length > 15 ? `${att.name.slice(0, 12)}...` : att.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT PANEL: MESSAGE DETAIL / COMPOSE */}
          <div className="card" style={{ padding: '1.5rem', minHeight: '620px', display: 'flex', flexDirection: 'column' }}>
            {showCompose ? (
              <form onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Compose Mail (Hierarchical Flow)</h2>
                  <button type="button" className="btn" style={{ fontSize: '0.75rem', background: '#f3f4f6', color: '#4b5563' }} onClick={() => setShowCompose(false)}>Cancel</button>
                </div>

                <div>
                  <label className="form-label">Recipient</label>
                  <select value={composeTo} onChange={(e) => setComposeTo(e.target.value)} className="form-select">
                    <option value="" disabled>— Select Recipient —</option>
                    <optgroup label="Parishes (Downward)">
                      {directory.parishes.map(p => (
                        <option key={`p-${p.id}`} value={String(p.id)}>{p.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Diocese / Bishop (Upward)">
                      {directory.dioceses.map(d => (
                        <option key={`d-${d.id}`} value={`d-${d.id}`}>{d.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    placeholder="Subject line..."
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label className="form-label">Message Body</label>
                  <textarea
                    placeholder="Type message details here..."
                    value={composeBody}
                    onChange={(e) => setComposeBody(e.target.value)}
                    required
                    className="form-textarea"
                    style={{ flex: 1, minHeight: '180px' }}
                  />
                </div>

                {/* File Attachment */}
                <div>
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Attachments (PDF, Excel, Photos)</span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn"
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', background: 'transparent' }}
                    >
                      + Add File
                    </button>
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    multiple
                    onChange={handleFileChange}
                    accept="image/*,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                  />
                  {attachedFiles.length === 0 ? (
                    <div className="file-drop-zone" onClick={() => fileInputRef.current?.click()}>
                      Drag &amp; Drop files here, or click to browse
                    </div>
                  ) : (
                    <div className="attached-files-list">
                      {attachedFiles.map((file, i) => (
                        <div key={i} className="attached-file-row">
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ fontSize: '1.1rem' }}>{file.type === 'pdf' ? '📄' : file.type === 'excel' ? '📊' : '🖼️'}</span>
                            <span style={{ fontWeight: 500 }}>{file.name}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>({file.size})</span>
                          </span>
                          <button type="button" className="btn-remove-attachment" onClick={() => removeAttachment(i)}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', fontWeight: 600 }}>
                  ⚡ Send Mail
                </button>
              </form>
            ) : selectedMessage ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>{selectedMessage.subject}</h2>
                    <span className="date-badge">{new Date(selectedMessage.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', fontSize: '0.875rem' }}>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>From: </span>
                      <strong style={{ color: 'var(--color-text)' }}>{selectedMessage.from}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>To: </span>
                      <strong style={{ color: 'var(--color-text)' }}>{selectedMessage.to}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ flex: 1, whiteSpace: 'pre-wrap', fontSize: '0.975rem', color: '#374151', lineHeight: '1.6', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  {selectedMessage.body}
                </div>

                {selectedMessage.attachments.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                      Attachments ({selectedMessage.attachments.length})
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                      {selectedMessage.attachments.map((att, i) => (
                        <div key={i} className="attachment-download-card" onClick={() => openAttachmentPreview(att)}>
                          <div className="attachment-icon-large">{att.type === 'pdf' ? '📄' : att.type === 'excel' ? '📊' : '🖼️'}</div>
                          <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div className="attachment-filename">{att.name}</div>
                            <div className="attachment-filesize">{att.size}</div>
                          </div>
                          <button className="btn-preview-link" type="button">Preview</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', gap: '1rem' }}>
                <div style={{ fontSize: '3rem', opacity: 0.4 }}>✉️</div>
                <p style={{ fontWeight: 500 }}>Select a message to read, or compose a new one.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: FINANCE OVERVIEW */}
      {activeTab === 'finance' && (
        <div className="card-grid" style={{ gridTemplateColumns: '1fr', alignItems: 'start' }}>
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Archdeaconry Financial Summary</h2>
              <button className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.4rem 0.8rem' }}>+ Record Entry</button>
            </div>

            <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', background: '#fafafa', borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Combined Parish Income</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#16a34a' }}>595,000,000 UGX</div>
              </div>
              <div>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Combined Expenses</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#dc2626' }}>-50,000,000 UGX</div>
              </div>
              <div>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Net Submittable to Diocese</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>545,000,000 UGX</div>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: 'var(--color-surface)' }}>
                  <tr>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Parish</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Gross Income (UGX)</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Expenses (UGX)</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)', textAlign: 'right' }}>Net (UGX)</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { parish: "St. Paul's Parish", income: '200,000,000', expenses: '18,000,000', net: '182,000,000', status: 'Healthy' },
                    { parish: "St. Luke's Parish", income: '350,000,000', expenses: '24,000,000', net: '326,000,000', status: 'Healthy' },
                    { parish: "St. Mark's Mission", income: '45,000,000', expenses: '8,000,000', net: '37,000,000', status: 'Review' },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{row.parish}</td>
                      <td style={{ padding: '1rem 1.5rem', color: '#16a34a' }}>+{row.income}</td>
                      <td style={{ padding: '1rem 1.5rem', color: '#dc2626' }}>-{row.expenses}</td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 500 }}>{row.net}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{
                          padding: '0.25rem 0.6rem',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          backgroundColor: row.status === 'Healthy' ? 'rgba(22, 163, 74, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          color: row.status === 'Healthy' ? '#16a34a' : '#d97706',
                        }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ATTACHMENT PREVIEW MODAL */}
      {activePreview && (
        <div className="preview-overlay">
          <div className={`preview-container ${activePreview.type}`}>
            <div className="preview-topbar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{activePreview.type === 'pdf' ? '📄' : activePreview.type === 'excel' ? '📊' : '🖼️'}</span>
                <div>
                  <div style={{ fontWeight: 600 }}>{activePreview.name}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{activePreview.size}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {activePreview.type !== 'excel' && (
                  <>
                    <button className="preview-control-btn" onClick={() => setZoomLevel(z => Math.max(50, z - 10))}>−</button>
                    <span style={{ fontSize: '0.875rem', minWidth: '40px', textAlign: 'center' }}>{zoomLevel}%</span>
                    <button className="preview-control-btn" onClick={() => setZoomLevel(z => Math.min(200, z + 10))}>+</button>
                  </>
                )}
                <button
                  className="btn"
                  style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', fontWeight: 600 }}
                  onClick={() => setActivePreview(null)}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div className="preview-body">
              {activePreview.type === 'photo' && activePreview.fileUrl && (
                <img
                  src={activePreview.fileUrl}
                  alt={activePreview.name}
                  style={{ maxWidth: `${zoomLevel}%`, maxHeight: '70vh', objectFit: 'contain', borderRadius: '6px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
                />
              )}
              {activePreview.type === 'photo' && !activePreview.fileUrl && (
                <div style={{ color: 'white', opacity: 0.6, textAlign: 'center', padding: '3rem' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🖼️</div>
                  <p>Photo preview not available in demo mode.</p>
                </div>
              )}
              {activePreview.type === 'pdf' && (
                <div style={{ background: 'white', padding: '3rem', borderRadius: '8px', maxWidth: `${zoomLevel * 5}px`, margin: '0 auto', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
                  <h2 style={{ color: '#1e293b', marginBottom: '1rem' }}>{activePreview.name.replace('.pdf', '').replace(/_/g, ' ')}</h2>
                  <div style={{ height: '2px', background: 'var(--color-primary)', marginBottom: '1.5rem' }} />
                  <p style={{ color: '#64748b', lineHeight: 1.7 }}>This is a simulated PDF document preview. In production, the actual file would be rendered here using a PDF.js viewer or served directly from the file storage backend.</p>
                  <p style={{ color: '#64748b', lineHeight: 1.7, marginTop: '1rem' }}>The document contains official Archdeaconry communications and reports for the Eastern Archdeaconry under the Kampala Diocese.</p>
                </div>
              )}
              {activePreview.type === 'excel' && (
                <div style={{ overflowX: 'auto', width: '100%' }}>
                  <table style={{ borderCollapse: 'collapse', background: 'white', minWidth: '600px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
                    {excelData.map((row, r) => (
                      <tr key={r} style={{ background: r === 0 ? '#1e293b' : r % 2 === 0 ? '#f8fafc' : 'white' }}>
                        {row.map((cell: any, c: number) => (
                          r === 0 ? (
                            <th key={c} style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'white', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{cell}</th>
                          ) : (
                            <td key={c} style={{ padding: '0.6rem 1rem', fontSize: '0.875rem', border: '1px solid #e2e8f0', cursor: 'cell' }}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => handleCellEdit(r, c, e.currentTarget.textContent || '')}
                            >
                              {cell}
                            </td>
                          )
                        ))}
                      </tr>
                    ))}
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
