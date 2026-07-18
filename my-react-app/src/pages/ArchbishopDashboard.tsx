import React, { useState, useEffect, useRef } from 'react';
import CertificatesPage from './CertificatesPage';
import { fetchDirectory, fetchCommunications, sendCommunication, markAsRead } from '../services/api';

// Messages are now fetched from the backend.

export interface Attachment {
  name: string;
  type: 'pdf' | 'excel' | 'photo';
  size: string;
  contentId?: string;
  fileUrl?: string; // Client-side loaded image or file data URL
}

export interface Message {
  id: string;
  from: string;
  fromRole: 'Archbishop' | 'Bishop' | 'Priest' | 'Archdeaconry' | 'Diocese';
  fromDiocese?: string;
  to: string; // e.g. "Kampala Diocese", "All Dioceses", "Archbishop"
  subject: string;
  body: string;
  date: string;
  read: boolean;
  attachments: Attachment[];
  senderType?: string;
  senderId?: number;
}

export default function ArchbishopDashboard() {
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'comms' | 'certificates'>('hierarchy');
  const [expandedDiocese, setExpandedDiocese] = useState<string | null>(null);
  const [expandedArchdeaconry, setExpandedArchdeaconry] = useState<string | null>(null);

  // Communications State
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [commsView, setCommsView] = useState<'inbox' | 'sent'>('inbox');
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'pdf' | 'excel' | 'photo'>('all');

  // Compose Form State
  const [composeTo, setComposeTo] = useState<string>('All Dioceses');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; type: 'pdf' | 'excel' | 'photo'; size: string; fileUrl?: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Previewer States
  const [activePreview, setActivePreview] = useState<Attachment | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [excelData, setExcelData] = useState<any[][]>([]);
  const [excelEditCell, setExcelEditCell] = useState<{ r: number; c: number } | null>(null);

  const [directory, setDirectory] = useState<{ dioceses: any[]; archdeaconries: any[]; parishes: any[] }>({ dioceses: [], archdeaconries: [], parishes: [] });

  useEffect(() => {
    fetchDirectory().then(setDirectory).catch(console.error);
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user) return;

      try {
        const data = await fetchCommunications('App\\Models\\User', user.id, commsView);
        const formattedMessages: Message[] = data.map((c: any) => ({
          id: c.id.toString(),
          from: c.sender?.name || 'Unknown',
          fromRole: 'Diocese',
          to: c.receiver?.name || 'Unknown',
          subject: c.subject,
          body: c.message,
          date: c.created_at,
          read: c.is_read,
          attachments: [],
          senderType: c.sender_type,
          senderId: c.sender_id
        }));
        setMessages(formattedMessages);
      } catch (err) {
        console.error(err);
      }
    };
    loadMessages();
  }, [commsView]);

  // Replaced unused saveMessages with direct fetch/api calls

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

  // Mark message as read
  const handleSelectMessage = async (msg: Message) => {
    setSelectedMessage(msg);
    setShowCompose(false);
    setActivePreview(null);
    if (!msg.read && commsView === 'inbox') {
      try {
        await markAsRead(parseInt(msg.id));
        const updated = messages.map(m => m.id === msg.id ? { ...m, read: true } : m);
        setMessages(updated);
      } catch(e) { console.error(e); }
    }
  };

  // Filter messages
  const filteredMessages = messages.filter(msg => {
    // Search query matching
    const matchesSearch = 
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
      msg.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.to.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Attachment filter matching
    if (filterType !== 'all') {
      return msg.attachments.some(att => att.type === filterType);
    }

    return true;
  });

  const handleReply = (msg: Message) => {
    if (!msg.senderType || !msg.senderId) return;
    
    let toValue = msg.senderId.toString();
    if (msg.senderType === 'App\\Models\\User') toValue = `arch-${msg.senderId}`;
    else if (msg.senderType === 'App\\Models\\Archdeaconry') toValue = `a-${msg.senderId}`;
    else if (msg.senderType === 'App\\Models\\Parish') toValue = `p-${msg.senderId}`;

    setComposeTo(toValue);
    setComposeSubject(msg.subject.startsWith('Re:') ? msg.subject : `Re: ${msg.subject}`);
    setComposeBody(`\n\n--- Original Message ---\nFrom: ${msg.from}\nDate: ${new Date(msg.date).toLocaleString()}\n\n${msg.body}`);
    setShowCompose(true);
  };

  // Handle local file selection for attachment
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
        setAttachedFiles(prev => [...prev, {
          name: file.name,
          type,
          size: sizeStr,
          fileUrl: reader.result as string
        }]);
      };
      if (type === 'photo') {
        reader.readAsDataURL(file);
      } else {
        // Read file metadata as mock
        setAttachedFiles(prev => [...prev, {
          name: file.name,
          type,
          size: sizeStr,
          fileUrl: `mock-file-url-${file.name}`
        }]);
      }
    });

    if (fileInputRef.current) e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Submit Compose Email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeSubject.trim() || !composeBody.trim()) return;

    let receiverType = 'App\\Models\\Diocese';
    let receiverId = 1;

    if (composeTo !== 'All Dioceses') {
      if (composeTo.startsWith('arch-')) {
        receiverType = 'App\\Models\\User';
        receiverId = parseInt(composeTo.replace('arch-', ''));
      } else if (composeTo.startsWith('a-')) {
        receiverType = 'App\\Models\\Archdeaconry';
        receiverId = parseInt(composeTo.replace('a-', ''));
      } else if (composeTo.startsWith('p-')) {
        receiverType = 'App\\Models\\Parish';
        receiverId = parseInt(composeTo.replace('p-', ''));
      } else {
        receiverType = 'App\\Models\\Diocese';
        receiverId = parseInt(composeTo);
      }
    }

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    try {
      await sendCommunication({
        sender_type: 'App\\Models\\User',
        sender_id: user.id,
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
      
      const recipientName = composeTo === 'All Dioceses' ? 'All Dioceses' : directory.dioceses.find(d => d.id.toString() === composeTo)?.name;
      alert(`Message successfully sent to ${recipientName}!`);
    } catch(err) {
      console.error(err);
      alert('Failed to send message');
    }
  };

  // Open rich attachment preview
  const openAttachmentPreview = (att: Attachment) => {
    setActivePreview(att);
    setZoomLevel(100);

    // Populate mock Excel grid data if it's spreadsheet
    if (att.type === 'excel') {
      if (att.contentId === 'kampala_q2_fin') {
        setExcelData([
          ['Diocesan Allocation Category', 'Q2 Budget (UGX)', 'Q2 Actual (UGX)', 'Variance (UGX)', 'Status'],
          ['All Saints Cathedral Parish', '150,000,000', '145,000,000', '-5,000,000', 'Under Budget'],
          ['St. John\'s Parish', '150,000,000', '162,000,000', '12,000,000', 'Surplus'],
          ['Diocesan Secretariat', '200,000,000', '190,000,000', '-10,000,000', 'Under Budget'],
          ['Education Department', '180,000,000', '170,000,000', '-10,000,000', 'Under Budget'],
          ['Health Board', '120,000,000', '135,000,000', '15,000,000', 'Deficit'],
          ['Mission & Evangelism', '170,000,000', '170,000,000', '0', 'Balanced'],
          ['Total Summary', '970,000,000', '972,000,000', '2,000,000', 'Net Surplus']
        ]);
      } else {
        // Generic template for user uploaded excel
        setExcelData([
          ['Item Title', 'Category', 'Quantity', 'Amount (UGX)', 'Notes'],
          ['Renovation Cement', 'Construction', '200 bags', '7,600,000', 'Kampala Depot'],
          ['Steel Bars', 'Construction', '50 units', '3,400,000', 'Delivered'],
          ['Labour Charges', 'Personnel', '15 days', '4,500,000', 'Ongoing'],
          ['Transport costs', 'Logistics', '4 trips', '1,200,000', 'Invoice 442'],
          ['Permits & Fees', 'Administrative', '1 flat', '1,800,000', 'Completed'],
          ['Contingency Fund', 'Financial', 'Global', '2,500,000', 'Emergency reserve'],
          ['Estimated Budget Total', 'Summary', '-', '21,000,000', 'Approved by Committee']
        ]);
      }
    }
  };

  const handleCellEdit = (r: number, c: number, val: string) => {
    const updated = [...excelData];
    updated[r][c] = val;
    setExcelData(updated);
  };

  return (
    <>
      <header className="header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1>National Overview</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Church of Uganda Provincial Dashboard</p>
        </div>
      </header>

      {/* Top Stats Cards */}
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
          <div className="card-value" style={{ color: '#16a34a' }}>4.2B</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tab-container">
        <button 
          onClick={() => setActiveTab('hierarchy')}
          className={`tab-btn ${activeTab === 'hierarchy' ? 'active' : ''}`}
        >
          Master Hierarchy Directory
        </button>
        <button 
          onClick={() => setActiveTab('comms')}
          className={`tab-btn ${activeTab === 'comms' ? 'active' : ''}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Diocesan Mailroom</span>
            {messages.filter(m => m.to === 'Archbishop' && !m.read).length > 0 && (
              <span className="badge-unread">
                {messages.filter(m => m.to === 'Archbishop' && !m.read).length}
              </span>
            )}
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('certificates')}
          className={`tab-btn ${activeTab === 'certificates' ? 'active' : ''}`}
        >
          Certificates
        </button>
      </div>

      {/* TAB CONTENT: HIERARCHY DIRECTORY */}
      {activeTab === 'hierarchy' && (
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
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Current Bishop</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Revenue (YTD)</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {directory.dioceses.map((diocese, dIndex) => {
                  const archs = directory.archdeaconries.filter(a => a.diocese_id === diocese.id);
                  return (
                  <React.Fragment key={`d-${dIndex}`}>
                    {/* Diocese Row */}
                    <tr 
                      style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer', backgroundColor: expandedDiocese === diocese.name ? 'rgba(79, 70, 229, 0.05)' : 'transparent' }} 
                      className="table-row-hover"
                      onClick={() => toggleDiocese(diocese.name)}
                    >
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>
                        <span style={{ display: 'inline-block', width: '20px' }}>{expandedDiocese === diocese.name ? '▼' : '▶'}</span>
                        {diocese.name} Diocese
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>{diocese.bishop_name || 'N/A'}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>--</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <button 
                          className="btn" 
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'var(--color-primary-light)', color: 'white' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab('comms');
                            setComposeTo(diocese.id.toString());
                            setShowCompose(true);
                          }}
                        >
                          Email Bishop
                        </button>
                      </td>
                    </tr>

                    {/* Archdeaconry Rows (Shown if Diocese is expanded) */}
                    {expandedDiocese === diocese.name && archs.map((arch, aIndex) => {
                      const archParishes = directory.parishes.filter(p => p.archdeaconry_id === arch.id);
                      return (
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
                          <td style={{ padding: '0.75rem 1.5rem', color: 'var(--color-text-muted)' }}>--</td>
                          <td style={{ padding: '0.75rem 1.5rem', color: 'var(--color-text-muted)' }}>--</td>
                          <td style={{ padding: '0.75rem 1.5rem' }}></td>
                        </tr>

                        {/* Parish Rows (Shown if Archdeaconry is expanded) */}
                        {expandedArchdeaconry === arch.name && archParishes.map((parish, pIndex) => (
                          <tr key={`p-${pIndex}`} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'white' }}>
                            <td style={{ padding: '0.5rem 1.5rem 0.5rem 5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                              • {parish.name}
                            </td>
                            <td style={{ padding: '0.5rem 1.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>--</td>
                            <td style={{ padding: '0.5rem 1.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>--</td>
                            <td style={{ padding: '0.5rem 1.5rem' }}></td>
                          </tr>
                        ))}
                      </React.Fragment>
                    )})}
                  </React.Fragment>
                )})}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: DIOCESAN MAILROOM */}
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
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Compose
              </button>
            </div>

            {/* Search and Filters */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Search mail..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', paddingLeft: '2.25rem', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.875rem', outline: 'none' }}
                />
                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
                  🔍
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                <button className={`filter-tag ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>All</button>
                <button className={`filter-tag ${filterType === 'pdf' ? 'active' : ''}`} onClick={() => setFilterType('pdf')}>📄 PDFs</button>
                <button className={`filter-tag ${filterType === 'excel' ? 'active' : ''}`} onClick={() => setFilterType('excel')}>📊 Spreadsheets</button>
                <button className={`filter-tag ${filterType === 'photo' ? 'active' : ''}`} onClick={() => setFilterType('photo')}>🖼️ Photos</button>
              </div>
            </div>

            {/* Scrollable Email list */}
            <div className="email-list-scroll">
              {filteredMessages.length === 0 ? (
                <div className="empty-state">
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No communications found.</p>
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`email-item-card ${selectedMessage?.id === msg.id && !showCompose ? 'selected' : ''} ${!msg.read && msg.to === 'Archbishop' ? 'unread' : ''}`}
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

          {/* RIGHT PANEL: DISPLAY DETAILS / COMPOSE FORM */}
          <div className="card" style={{ padding: '1.5rem', minHeight: '620px', display: 'flex', flexDirection: 'column' }}>
            
            {/* 1. COMPOSE NEW MAIL VIEW */}
            {showCompose ? (
              <form onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 600 }}>New Communication to Diocese</h2>
                  <button type="button" className="btn" style={{ fontSize: '0.75rem', background: '#f3f4f6', color: '#4b5563' }} onClick={() => setShowCompose(false)}>Cancel</button>
                </div>
                
                <div>
                  <label className="form-label">Recipient Diocese</label>
                  <select 
                    value={composeTo} 
                    onChange={(e) => setComposeTo(e.target.value)}
                    className="form-select"
                  >
                    <option value="All Dioceses">All Dioceses (General Circular)</option>
                    {directory.dioceses.map(d => (
                      <option key={d.id} value={d.id}>{d.name} Diocese</option>
                    ))}
                    {composeTo && !directory.dioceses.find(d => d.id.toString() === composeTo) && composeTo !== 'All Dioceses' && (
                      <option value={composeTo} hidden>{selectedMessage?.from || 'Reply Recipient'}</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="form-label">Subject</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Provincial Synod Agenda 2026" 
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label className="form-label">Message Body</label>
                  <textarea 
                    placeholder="Type your message here..." 
                    value={composeBody}
                    onChange={(e) => setComposeBody(e.target.value)}
                    required
                    className="form-textarea"
                    style={{ flex: 1, minHeight: '180px' }}
                  />
                </div>

                {/* File Attachment Area */}
                <div>
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Attachments (PDFs, Excel Sheets, Photos in all formats)</span>
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
                    <div 
                      className="file-drop-zone"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Drag & Drop files here, or click to browse
                      <span style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem', display: 'block' }}>Supports JPEG, PNG, Excel spreadsheets, PDFs</span>
                    </div>
                  ) : (
                    <div className="attached-files-list">
                      {attachedFiles.map((file, i) => (
                        <div key={i} className="attached-file-row">
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ fontSize: '1.1rem' }}>
                              {file.type === 'pdf' ? '📄' : file.type === 'excel' ? '📊' : '🖼️'}
                            </span>
                            <span style={{ fontWeight: 500 }}>{file.name}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>({file.size})</span>
                          </span>
                          <button 
                            type="button" 
                            className="btn-remove-attachment"
                            onClick={() => removeAttachment(i)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', fontWeight: 600 }}>
                  ⚡ Send Communication
                </button>
              </form>
            ) : selectedMessage ? (
              
              /* 2. MESSAGE DISPLAY VIEW */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
                
                {/* Header Information */}
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>{selectedMessage.subject}</h2>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button className="btn" style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem', border: '1px solid var(--color-border)', background: 'var(--color-surface)' }} onClick={() => handleReply(selectedMessage)}>
                        ↩ Reply
                      </button>
                      <span className="date-badge">{new Date(selectedMessage.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
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

                {/* Email Body */}
                <div style={{ flex: 1, whiteSpace: 'pre-wrap', fontSize: '0.975rem', color: '#374151', lineHeight: '1.6', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  {selectedMessage.body}
                </div>

                {/* File Attachments List */}
                {selectedMessage.attachments.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                      Attachments ({selectedMessage.attachments.length})
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                      {selectedMessage.attachments.map((att, i) => (
                        <div 
                          key={i} 
                          className="attachment-download-card"
                          onClick={() => openAttachmentPreview(att)}
                        >
                          <div className="attachment-icon-large">
                            {att.type === 'pdf' ? '📄' : att.type === 'excel' ? '📊' : '🖼️'}
                          </div>
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
              /* 3. DEFAULT PLACEHOLDER */
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', gap: '1rem' }}>
                <div style={{ fontSize: '3rem', opacity: 0.4 }}>✉️</div>
                <p style={{ fontWeight: 500 }}>Select a communication to read or click Compose to write to a Diocese.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: CERTIFICATES */}
      {activeTab === 'certificates' && (
        <div style={{ marginTop: '1rem' }}>
          <CertificatesPage />
        </div>
      )}

      {/* DETAILED ATTACHMENT PREVIEW MODAL */}
      {activePreview && (
        <div className="preview-overlay">
          <div className={`preview-container ${activePreview.type}`}>
            
            {/* Top Bar controls */}
            <div className="preview-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                <span style={{ fontSize: '1.25rem' }}>
                  {activePreview.type === 'pdf' ? '📄' : activePreview.type === 'excel' ? '📊' : '🖼️'}
                </span>
                <h3 className="preview-title" style={{ margin: 0, fontWeight: 600 }}>{activePreview.name}</h3>
                <span className="preview-badge">{activePreview.size}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* PDF Specific Controls */}
                {activePreview.type === 'pdf' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <button className="preview-control-btn" type="button" onClick={() => setZoomLevel(z => Math.max(50, z - 10))}>➖</button>
                    <span style={{ fontSize: '0.85rem', width: '45px', textAlign: 'center' }}>{zoomLevel}%</span>
                    <button className="preview-control-btn" type="button" onClick={() => setZoomLevel(z => Math.min(200, z + 10))}>➕</button>
                  </div>
                )}
                
                <button 
                  className="btn" 
                  style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)' }}
                  onClick={() => alert(`Simulated Download of: ${activePreview.name}`)}
                  type="button"
                >
                  📥 Download
                </button>
                <button className="preview-close-btn" type="button" onClick={() => setActivePreview(null)}>✕</button>
              </div>
            </div>

            {/* PREVIEW RENDERING AREAS */}
            <div className="preview-content-body">
              
              {/* PHOTO PREVIEW */}
              {activePreview.type === 'photo' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem', padding: '1.5rem' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', width: '100%', maxHeight: '420px' }}>
                    {activePreview.fileUrl ? (
                      <img 
                        src={activePreview.fileUrl} 
                        alt={activePreview.name} 
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                    ) : (
                      /* Render beautiful mock custom SVG graphics for demo files */
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
                        <svg width="450" height="300" viewBox="0 0 450 300" style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)' }}>
                          <defs>
                            <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#818cf8" />
                              <stop offset="100%" stopColor="#c084fc" />
                            </linearGradient>
                          </defs>
                          {/* Simulated Event graphics */}
                          <circle cx="225" cy="120" r="70" fill="url(#glow)" opacity="0.15" />
                          <path d="M 225,50 L 225,190 M 200,90 L 250,90" stroke="url(#glow)" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
                          <circle cx="150" cy="180" r="10" fill="#fbbf24" opacity="0.7"/>
                          <circle cx="300" cy="180" r="8" fill="#38bdf8" opacity="0.6"/>
                          <circle cx="270" cy="200" r="12" fill="#34d399" opacity="0.7"/>
                          <path d="M 50,250 Q 150,210 225,230 T 400,220 L 400,280 L 50,280 Z" fill="#4f46e5" opacity="0.3"/>
                          <path d="M 50,270 Q 150,230 225,250 T 400,240 L 400,280 L 50,280 Z" fill="#3730a3" opacity="0.5"/>
                          <text x="225" y="270" fill="white" fontFamily="inherit" fontSize="16" fontWeight="bold" textAnchor="middle">
                            {activePreview.name.includes('Youth') ? 'Diocesan Youth Rally 2026' : 'St. Paul\'s Cathedral Site'}
                          </text>
                          <text x="225" y="285" fill="#e0e7ff" fontFamily="inherit" fontSize="10" textAnchor="middle" opacity="0.8">
                            Church of Uganda Provincial Photographic Record
                          </text>
                        </svg>
                        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                          Click the Download button to retrieve the high-resolution master image.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PDF PREVIEW */}
              {activePreview.type === 'pdf' && (
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto', height: '100%', background: '#525659' }}>
                  <div 
                    style={{ 
                      width: `${zoomLevel}%`, 
                      maxWidth: '800px', 
                      background: 'white', 
                      padding: '3rem 4rem', 
                      boxShadow: '0 4px 16px rgba(0,0,0,0.3)', 
                      borderRadius: '4px',
                      color: '#111827',
                      fontFamily: '"Times New Roman", Times, serif',
                      lineHeight: '1.5',
                      fontSize: '1rem'
                    }}
                  >
                    <div style={{ textAlign: 'center', borderBottom: '2px double #111827', paddingBottom: '1rem', marginBottom: '2rem' }}>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>CHURCH OF UGANDA</h2>
                      <h3 style={{ fontSize: '1.2rem', margin: '0.25rem 0' }}>
                        {activePreview.name.includes('Kampala') ? 'KAMPALA DIOCESE' : 'NAMIREMBE DIOCESE'}
                      </h3>
                      <p style={{ fontStyle: 'italic', margin: 0, fontSize: '0.875rem' }}>Office of the Diocesan Secretary</p>
                    </div>

                    {activePreview.name.includes('Minutes') ? (
                      <div>
                        <h4 style={{ textAlign: 'center', fontSize: '1.1rem', textDecoration: 'underline', marginBottom: '1.5rem' }}>
                          MINUTES OF THE 26TH SYNOD COMMITTEE HELD ON 12TH MAY 2026
                        </h4>
                        <p><strong>MEMBERS PRESENT:</strong></p>
                        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
                          <li>Rt. Rev. James W. - Bishop (Chairman)</li>
                          <li>Ven. Robert K. - Archdeacon</li>
                          <li>Mary S. - Diocesan Secretary</li>
                          <li>Peter T. - Diocesan Treasurer</li>
                        </ul>

                        <p><strong>AGENDA 1: OPENING DEVOTION</strong><br/>
                        The Bishop led the devotion focusing on Nehemiah 2:18: "Let us rise up and build." He thanked parishes for their continued evangelical cells outreach and digital tracking system deployment.</p>

                        <p><strong>AGENDA 2: Q2 FINANCIALS CONSIDERATION</strong><br/>
                        The Treasurer presented the Q2 accounts. The Synod resolved that:</p>
                        <ol style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
                          <li>Parish development levies be kept at 10% to facilitate provincial development.</li>
                          <li>All Saints Cathedral project funds allocation is approved.</li>
                        </ol>
                        
                        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ borderBottom: '1px solid #111827', width: '150px', height: '30px' }}></div>
                            <span style={{ fontSize: '0.8rem' }}>Bishop James W. (Chairman)</span>
                          </div>
                          <div>
                            <div style={{ borderBottom: '1px solid #111827', width: '150px', height: '30px' }}></div>
                            <span style={{ fontSize: '0.8rem' }}>Mary S. (Secretary)</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 style={{ textAlign: 'center', fontSize: '1.1rem', textDecoration: 'underline', marginBottom: '1.5rem' }}>
                          PROJECT SPECIFICATION & ARCHITECTURAL BRIEF
                        </h4>
                        <p><strong>PROJECT TITLE:</strong> Cathedral Expansion Phase II</p>
                        <p><strong>LOCATION:</strong> St. Paul's Cathedral Grounds</p>
                        <p><strong>ENGINEERING FIRM:</strong> Crested Builders Ltd.</p>

                        <p style={{ marginTop: '1.5rem' }}><strong>1. Executive Summary:</strong><br/>
                        This blueprint specification detail covers the foundation layout reinforcement for the new north wing extension. Designed seating capacity increases from 1,200 to 2,500 parishioners.</p>

                        <p><strong>2. Material Estimates:</strong><br/>
                        Grade 40 reinforced steel bars, 500 tons high-tensile cement mix, and acoustic panels mapping as per provincial guidelines. Estimated duration: 9 calendar months from ground-breaking.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* EXCEL PREVIEW */}
              {activePreview.type === 'excel' && (
                <div style={{ padding: '1rem', overflow: 'auto', height: '100%', background: '#f3f4f6' }}>
                  <div style={{ background: 'white', border: '1px solid #d1d5db', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', minWidth: '700px' }}>
                    
                    {/* Excel Formulas Simulator Bar */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', background: '#fafafa', padding: '0.35rem 0.5rem', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#16a34a', borderRight: '1px solid #e5e7eb', paddingRight: '0.5rem' }}>Sheet1</div>
                      <div style={{ fontSize: '0.75rem', background: '#f3f4f6', padding: '0.1rem 0.4rem', border: '1px solid #d1d5db', borderRadius: '2px' }}>fx</div>
                      <input 
                        type="text" 
                        readOnly 
                        value={excelEditCell ? `Cell [Row ${excelEditCell.r + 1}, Col ${excelEditCell.c + 1}]: "${excelData[excelEditCell.r][excelEditCell.c]}"` : 'Select a cell to edit values inline'} 
                        style={{ flex: 1, fontSize: '0.75rem', border: '1px solid #d1d5db', padding: '0.1rem 0.5rem', outline: 'none', background: '#fff' }}
                      />
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
                      <thead>
                        <tr style={{ background: '#f3f4f6', borderBottom: '1.5px solid #d1d5db' }}>
                          <th style={{ width: '40px', padding: '0.35rem', textAlign: 'center', borderRight: '1px solid #d1d5db', fontWeight: 'bold', color: '#6b7280' }}>#</th>
                          {Array.from({ length: excelData[0]?.length || 0 }).map((_, cIndex) => (
                            <th key={cIndex} style={{ padding: '0.35rem 0.75rem', borderRight: '1px solid #d1d5db', fontWeight: 'bold', color: '#374151' }}>
                              {String.fromCharCode(65 + cIndex)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {excelData.map((row, rIndex) => (
                          <tr 
                            key={rIndex} 
                            style={{ 
                              borderBottom: '1px solid #e5e7eb',
                              background: rIndex === 0 ? '#f9fafb' : rIndex === excelData.length - 1 ? '#f0fdf4' : 'transparent',
                              fontWeight: rIndex === 0 || rIndex === excelData.length - 1 ? 'bold' : 'normal'
                            }}
                          >
                            <td style={{ padding: '0.35rem', textAlign: 'center', background: '#f3f4f6', borderRight: '1px solid #d1d5db', fontWeight: 'bold', color: '#6b7280' }}>
                              {rIndex + 1}
                            </td>
                            {row.map((cell, cIndex) => (
                              <td 
                                key={cIndex} 
                                style={{ 
                                  padding: '0.35rem 0.75rem', 
                                  borderRight: '1px solid #e5e7eb',
                                  color: rIndex === 0 ? '#4b5563' : '#111827',
                                  cursor: 'cell'
                                }}
                                onClick={() => setExcelEditCell({ r: rIndex, c: cIndex })}
                              >
                                {excelEditCell?.r === rIndex && excelEditCell?.c === cIndex && rIndex > 0 ? (
                                  <input 
                                    type="text" 
                                    defaultValue={cell} 
                                    onBlur={(e) => {
                                      handleCellEdit(rIndex, cIndex, e.target.value);
                                      setExcelEditCell(null);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        handleCellEdit(rIndex, cIndex, e.currentTarget.value);
                                        setExcelEditCell(null);
                                      }
                                    }}
                                    autoFocus
                                    style={{ width: '100%', padding: '0.1rem', fontSize: '0.825rem', border: '1px solid var(--color-primary)', outline: 'none' }}
                                  />
                                ) : (
                                  <span style={{ 
                                    color: cell === 'Surplus' || cell === 'Net Surplus' ? '#16a34a' : cell === 'Deficit' ? '#dc2626' : 'inherit'
                                  }}>
                                    {cell}
                                  </span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>
                    💡 Tip: Click on any cell in the table body above to edit its content inline.
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      <style>{`
        /* Global CSS Extensions for ArchbishopDashboard */
        .tab-container {
          display: flex;
          border-bottom: 2px solid var(--color-border);
          margin-bottom: 1.5rem;
        }
        
        .tab-btn {
          padding: 0.75rem 1.5rem;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          color: var(--color-text-muted);
          font-weight: 600;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .tab-btn:hover {
          color: var(--color-primary);
        }

        .tab-btn.active {
          border-bottom: 3px solid var(--color-primary);
          color: var(--color-primary);
        }

        .badge-unread {
          background: #ef4444;
          color: white;
          font-size: 0.75rem;
          border-radius: 99px;
          padding: 0.1rem 0.4rem;
          font-weight: 700;
        }

        .table-row-hover:hover {
          background-color: rgba(0, 0, 0, 0.02) !important;
        }

        /* Mailroom grid layout */
        .mailroom-grid {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        .segmented-control {
          background: #f3f4f6;
          padding: 0.2rem;
          border-radius: 8px;
          display: flex;
          border: 1px solid var(--color-border);
        }

        .segment-btn {
          padding: 0.35rem 1rem;
          font-size: 0.85rem;
          font-weight: 500;
          border: none;
          background: none;
          border-radius: 6px;
          cursor: pointer;
          color: var(--color-text-muted);
          transition: all 0.2s;
        }

        .segment-btn.active {
          background: var(--color-surface);
          color: var(--color-primary);
          box-shadow: var(--shadow-sm);
        }

        .filter-tag {
          padding: 0.25rem 0.6rem;
          background: #f3f4f6;
          border: 1px solid var(--color-border);
          border-radius: 99px;
          font-size: 0.75rem;
          cursor: pointer;
          white-space: nowrap;
          color: var(--color-text-muted);
          font-weight: 500;
          transition: all 0.15s;
        }

        .filter-tag:hover {
          background: #e5e7eb;
        }

        .filter-tag.active {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }

        .email-list-scroll {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-right: 0.25rem;
          max-height: 480px;
        }

        .email-list-scroll::-webkit-scrollbar {
          width: 4px;
        }

        .email-list-scroll::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 99px;
        }

        .email-item-card {
          padding: 1rem;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          background: var(--color-surface);
        }

        .email-item-card:hover {
          border-color: var(--color-primary-light);
          box-shadow: var(--shadow-sm);
        }

        .email-item-card.selected {
          border-color: var(--color-primary);
          background: rgba(79, 70, 229, 0.03);
        }

        .email-item-card.unread {
          font-weight: 600;
          border-left: 3px solid var(--color-primary);
        }

        .email-sender {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }

        .email-item-card.unread .email-sender {
          color: var(--color-text);
          font-weight: 700;
        }

        .email-date {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }

        .email-subject {
          font-size: 0.9rem;
          margin-top: 0.15rem;
          color: var(--color-text);
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .email-body-snippet {
          font-size: 0.775rem;
          color: var(--color-text-muted);
          margin-top: 0.25rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.4;
        }

        .attachment-icon-pill {
          font-size: 0.7rem;
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          font-weight: 500;
        }

        .empty-state {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px dashed var(--color-border);
          border-radius: 8px;
          min-height: 150px;
        }

        /* Form styling */
        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.35rem;
          color: var(--color-text);
        }

        .form-select, .form-input, .form-textarea {
          width: 100%;
          padding: 0.6rem 0.8rem;
          border-radius: 6px;
          border: 1px solid var(--color-border);
          font-family: inherit;
          font-size: 0.925rem;
          outline: none;
          box-sizing: border-box;
        }

        .form-select:focus, .form-input:focus, .form-textarea:focus {
          border-color: var(--color-primary-light);
          box-shadow: 0 0 0 2px rgba(129, 140, 248, 0.2);
        }

        .file-drop-zone {
          border: 2px dashed var(--color-border);
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          font-size: 0.85rem;
          color: var(--color-text-muted);
          cursor: pointer;
          transition: all 0.2s;
        }

        .file-drop-zone:hover {
          border-color: var(--color-primary);
          background: rgba(79, 70, 229, 0.02);
          color: var(--color-primary);
        }

        .attached-files-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .attached-file-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.4rem 0.75rem;
          background: #fafafa;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          font-size: 0.825rem;
        }

        .btn-remove-attachment {
          background: none;
          border: none;
          color: #dc2626;
          font-weight: bold;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .date-badge {
          background: #f3f4f6;
          color: var(--color-text-muted);
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        /* Attachment cards */
        .attachment-download-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.85rem;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          background: #fafafa;
          cursor: pointer;
          transition: all 0.2s;
        }

        .attachment-download-card:hover {
          border-color: var(--color-primary);
          background: rgba(79, 70, 229, 0.02);
        }

        .attachment-icon-large {
          font-size: 1.5rem;
        }

        .attachment-filename {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text);
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .attachment-filesize {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }

        .btn-preview-link {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-primary);
          background: none;
          border: none;
          cursor: pointer;
        }

        /* Preview overlay styles */
        .preview-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 2rem;
        }

        .preview-container {
          background: var(--color-surface);
          border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          width: 100%;
          height: 100%;
        }

        .preview-container.photo {
          max-width: 650px;
          height: auto;
          max-height: 550px;
        }

        .preview-container.pdf, .preview-container.excel {
          max-width: 1100px;
          height: 90%;
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--color-border);
          background: var(--color-surface);
        }

        .preview-title {
          font-size: 1.05rem;
          color: var(--color-text);
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .preview-badge {
          font-size: 0.75rem;
          background: #f3f4f6;
          color: var(--color-text-muted);
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          font-weight: 500;
        }

        .preview-close-btn, .preview-control-btn {
          background: none;
          border: none;
          font-size: 1.15rem;
          cursor: pointer;
          color: var(--color-text-muted);
          transition: color 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preview-close-btn:hover {
          color: #dc2626;
        }

        .preview-control-btn:hover {
          color: var(--color-text);
        }

        .preview-content-body {
          flex: 1;
          overflow: hidden;
          position: relative;
        }
      `}</style>
    </>
  );
}
