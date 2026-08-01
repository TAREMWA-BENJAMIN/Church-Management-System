import React, { useState, useRef } from 'react';
import SneatLayout from '@/Layouts/SneatLayout';
import { Head, router, useForm } from '@inertiajs/react';

export default function CommunicationsIndex({ inbox, sent, units, myUnitIds, unreadCount }) {
    const [activeTab, setActiveTab] = useState('inbox');
    const [searchQuery, setSearchQuery] = useState('');
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [attachmentPreviews, setAttachmentPreviews] = useState([]);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        subject: '',
        body: '',
        sender_unit_id: myUnitIds[0] || '',
        recipient_ids: [],
        attachments: [],
    });

    const messages = activeTab === 'inbox' ? inbox : sent;

    const filtered = messages.filter(m =>
        m.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.sender_unit?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const now = new Date();
        const isToday = d.toDateString() === now.toDateString();
        if (isToday) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return d.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (confirm('Delete this message?')) {
            router.delete(route('communications.destroy', id), { preserveScroll: true });
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setData('attachments', files);
        setAttachmentPreviews(files.map(f => ({ name: f.name, size: f.size })));
    };

    const removeAttachment = (index) => {
        const newFiles = [...data.attachments];
        newFiles.splice(index, 1);
        setData('attachments', newFiles);
        setAttachmentPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSend = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('subject', data.subject);
        formData.append('body', data.body);
        formData.append('sender_unit_id', data.sender_unit_id);
        data.recipient_ids.forEach(id => formData.append('recipient_ids[]', id));
        data.attachments.forEach(file => formData.append('attachments[]', file));

        router.post(route('communications.store'), formData, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setAttachmentPreviews([]);
                setIsComposeOpen(false);
            },
        });
    };

    const myUnits = units.filter(u => myUnitIds.includes(u.id));

    // Helper: get initials from a name
    const getInitials = (name) => {
        if (!name) return 'UN';
        return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    };

    // Avatar color classes cycle
    const avatarColors = ['bg-label-primary', 'bg-label-success', 'bg-label-danger', 'bg-label-warning', 'bg-label-info'];
    const getAvatarColor = (id) => avatarColors[id % avatarColors.length];

    return (
        <SneatLayout>
            <Head title="Communications" />

            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="app-email card">
                    <div className="row g-0">

                        {/* ─── Email Sidebar ─── */}
                        <div className="col app-email-sidebar border-end flex-grow-0" id="app-email-sidebar">
                            {/* Compose Button */}
                            <div className="btn-compost-wrapper d-grid">
                                <button
                                    className="btn btn-primary btn-compose"
                                    onClick={() => setIsComposeOpen(true)}
                                >
                                    Compose
                                </button>
                            </div>

                            {/* Email Filters */}
                            <div className="email-filters pt-4 pb-2">
                                <ul className="email-filter-folders list-unstyled">
                                    <li
                                        className={`d-flex justify-content-between align-items-center mb-1 ${activeTab === 'inbox' ? 'active' : ''}`}
                                        data-target="inbox"
                                        onClick={() => setActiveTab('inbox')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <a href="javascript:void(0);" className="d-flex flex-wrap align-items-center">
                                            <i className="icon-base bx bx-envelope"></i>
                                            <span className="align-middle ms-2">Inbox</span>
                                        </a>
                                        {unreadCount > 0 && (
                                            <div className="badge bg-label-primary rounded-pill">{unreadCount}</div>
                                        )}
                                    </li>
                                    <li
                                        className={`d-flex mb-1 ${activeTab === 'sent' ? 'active' : ''}`}
                                        data-target="sent"
                                        onClick={() => setActiveTab('sent')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <a href="javascript:void(0);" className="d-flex flex-wrap align-items-center">
                                            <i className="icon-base bx bx-send"></i>
                                            <span className="align-middle ms-2">Sent</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            {/* /Email Filters */}
                        </div>
                        {/* /Email Sidebar */}

                        {/* ─── Emails List ─── */}
                        <div className="col app-emails-list">
                            <div className="card shadow-none border-0 rounded-0">
                                <div className="card-body emails-list-header p-3 py-2">
                                    {/* Search */}
                                    <div className="d-flex justify-content-between align-items-center px-3 mt-2">
                                        <div className="d-flex align-items-center w-100">
                                            {/* Mobile sidebar toggle */}
                                            <i
                                                className="icon-base bx bx-menu icon-lg cursor-pointer d-block d-lg-none me-4 mb-4"
                                                data-bs-toggle="sidebar"
                                                data-target="#app-email-sidebar"
                                                data-overlay
                                            ></i>
                                            <div className="mb-4 w-100">
                                                <div className="input-group input-group-merge shadow-none">
                                                    <span className="input-group-text border-0 p-0 pe-4" id="email-search">
                                                        <i className="icon-base bx bx-search icon-md text-body"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="form-control email-search-input border-0 py-0"
                                                        placeholder="Search mail"
                                                        value={searchQuery}
                                                        onChange={e => setSearchQuery(e.target.value)}
                                                        aria-label="Search mail"
                                                        aria-describedby="email-search"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="mx-n3 emails-list-header-hr mb-2" />
                                    {/* List header actions */}
                                    <div className="d-flex justify-content-between align-items-center ps-1">
                                        <div className="d-flex align-items-center">
                                            <span className="text-body-secondary small ms-2">
                                                {filtered.length} message{filtered.length !== 1 ? 's' : ''} in{' '}
                                                <span className="fw-medium text-capitalize">{activeTab}</span>
                                            </span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <span className="btn btn-icon me-1">
                                                <i className="icon-base bx bx-refresh icon-md cursor-pointer"
                                                   onClick={() => router.reload()}></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <hr className="container-m-nx m-0" />

                                {/* Email List Items */}
                                <div className="email-list pt-0">
                                    {filtered.length === 0 ? (
                                        <div className="d-flex flex-column align-items-center justify-content-center py-5 text-body-secondary">
                                            <i className="bx bx-inbox" style={{ fontSize: '4rem', opacity: 0.2 }}></i>
                                            <p className="small fw-medium mt-3 mb-0">
                                                {activeTab === 'inbox' ? 'Your inbox is empty' : 'No sent messages yet'}
                                            </p>
                                        </div>
                                    ) : (
                                        <ul className="list-unstyled m-0">
                                            {filtered.map((msg, idx) => (
                                                <li
                                                    key={msg.id}
                                                    className={`email-list-item d-flex align-items-center ${activeTab === 'inbox' && msg.is_read ? 'email-marked-read' : ''}`}
                                                    onClick={() => router.visit(route('communications.show', msg.id))}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <div className="d-flex align-items-center w-100">
                                                        {/* Avatar */}
                                                        <div className={`avatar avatar-sm d-block flex-shrink-0 me-sm-2 me-0 ms-3`}>
                                                            <span className={`avatar-initial rounded-circle ${getAvatarColor(msg.id)}`}>
                                                                {getInitials(
                                                                    activeTab === 'inbox'
                                                                        ? msg.sender_unit?.name
                                                                        : (msg.recipients?.[0]?.organization_unit?.name || 'N/A')
                                                                )}
                                                            </span>
                                                        </div>

                                                        {/* Content */}
                                                        <div className="email-list-item-content ms-2 ms-sm-3 me-2">
                                                            <span className={`email-list-item-username me-2 ${!msg.is_read && activeTab === 'inbox' ? 'h6 text-heading' : 'text-body'}`}>
                                                                {activeTab === 'inbox'
                                                                    ? msg.sender_unit?.name
                                                                    : (msg.recipients?.map(r => r.organization_unit?.name).join(', ') || 'N/A')}
                                                            </span>
                                                            <small className="email-list-item-subject d-xl-inline-block d-block text-body-secondary">
                                                                {msg.subject}
                                                            </small>
                                                        </div>

                                                        {/* Meta */}
                                                        <div className="email-list-item-meta ms-auto d-flex align-items-center">
                                                            {msg.attachments?.length > 0 && (
                                                                <span className="email-list-item-attachment icon-base bx bx-paperclip icon-md cursor-pointer me-2 float-end float-sm-none"></span>
                                                            )}
                                                            {!msg.is_read && activeTab === 'inbox' && (
                                                                <span className="badge bg-label-primary rounded-pill me-2">New</span>
                                                            )}
                                                            <small className="email-list-item-time text-body-secondary me-3">
                                                                {formatDate(msg.created_at)}
                                                            </small>
                                                            <ul className="list-inline email-list-item-actions me-2">
                                                                {activeTab === 'sent' && (
                                                                    <li className="list-inline-item email-delete btn btn-icon"
                                                                        onClick={(e) => handleDelete(e, msg.id)}>
                                                                        <i className="icon-base bx bx-trash icon-md"></i>
                                                                    </li>
                                                                )}
                                                                <li className="list-inline-item btn btn-icon"
                                                                    onClick={(e) => { e.stopPropagation(); router.visit(route('communications.show', msg.id)); }}>
                                                                    <i className="icon-base bx bx-info-circle icon-md"></i>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* /Emails List */}

                    </div>
                </div>
            </div>

            {/* ─── Compose Modal (Bootstrap Modal style) ─── */}
            {isComposeOpen && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    onClick={() => setIsComposeOpen(false)}
                >
                    <div
                        className="modal-dialog modal-dialog-centered modal-lg"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="modal-content">
                            <div className="modal-header bg-primary">
                                <h5 className="modal-title text-white">
                                    <i className="bx bx-edit me-2"></i>New Message
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setIsComposeOpen(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleSend}>
                                <div className="modal-body">
                                    <div className="row g-3">
                                        {/* From */}
                                        <div className="col-12">
                                            <label className="form-label">From (Your Unit)</label>
                                            <select
                                                className="form-select"
                                                value={data.sender_unit_id}
                                                onChange={e => setData('sender_unit_id', e.target.value)}
                                                required
                                            >
                                                <option value="">Select your unit</option>
                                                {myUnits.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                            </select>
                                            {errors.sender_unit_id && <div className="text-danger small mt-1">{errors.sender_unit_id}</div>}
                                        </div>

                                        {/* To */}
                                        <div className="col-12">
                                            <label className="form-label">To (Recipient Units)</label>
                                            <div className="border rounded p-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                                {units.map(u => (
                                                    <div key={u.id} className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`unit-${u.id}`}
                                                            checked={data.recipient_ids.includes(u.id)}
                                                            onChange={e => {
                                                                const ids = e.target.checked
                                                                    ? [...data.recipient_ids, u.id]
                                                                    : data.recipient_ids.filter(id => id !== u.id);
                                                                setData('recipient_ids', ids);
                                                            }}
                                                        />
                                                        <label className="form-check-label" htmlFor={`unit-${u.id}`}>{u.name}</label>
                                                    </div>
                                                ))}
                                            </div>
                                            {errors.recipient_ids && <div className="text-danger small mt-1">{errors.recipient_ids}</div>}
                                        </div>

                                        {/* Subject */}
                                        <div className="col-12">
                                            <label className="form-label">Subject</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Message subject..."
                                                value={data.subject}
                                                onChange={e => setData('subject', e.target.value)}
                                                required
                                            />
                                            {errors.subject && <div className="text-danger small mt-1">{errors.subject}</div>}
                                        </div>

                                        {/* Body */}
                                        <div className="col-12">
                                            <label className="form-label">Message</label>
                                            <textarea
                                                className="form-control"
                                                rows={6}
                                                placeholder="Type your message here..."
                                                value={data.body}
                                                onChange={e => setData('body', e.target.value)}
                                                required
                                            />
                                            {errors.body && <div className="text-danger small mt-1">{errors.body}</div>}
                                        </div>

                                        {/* Attachments */}
                                        <div className="col-12">
                                            <label className="form-label">Attachments</label>
                                            <div
                                                className="border border-dashed rounded p-3 text-center cursor-pointer"
                                                style={{ borderStyle: 'dashed', cursor: 'pointer' }}
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <i className="bx bx-upload fs-3 text-muted"></i>
                                                <p className="small text-muted mb-0 mt-1">
                                                    Click to upload files — any format, up to 50MB each
                                                </p>
                                            </div>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                multiple
                                                onChange={handleFileChange}
                                                className="d-none"
                                            />
                                            {attachmentPreviews.length > 0 && (
                                                <ul className="list-unstyled mt-2">
                                                    {attachmentPreviews.map((f, i) => (
                                                        <li key={i} className="d-flex align-items-center justify-content-between bg-light rounded px-3 py-2 mb-1">
                                                            <div className="d-flex align-items-center gap-2 text-truncate">
                                                                <i className="bx bx-paperclip text-muted"></i>
                                                                <span className="small text-truncate">{f.name}</span>
                                                                <span className="small text-muted">({formatFileSize(f.size)})</span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-icon text-danger ms-2"
                                                                onClick={() => removeAttachment(i)}
                                                            >
                                                                <i className="bx bx-x"></i>
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-label-secondary"
                                        onClick={() => setIsComposeOpen(false)}
                                    >
                                        Discard
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={processing}
                                    >
                                        <i className="bx bx-send me-1"></i>
                                        {processing ? 'Sending...' : 'Send Message'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </SneatLayout>
    );
}
