import React, { useState, useRef } from 'react';
import SneatLayout from '@/Layouts/SneatLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function CommunicationsShow({ message, units, myUnitIds }) {
    const [replyBody, setReplyBody] = useState('');
    const [replyRecipientIds, setReplyRecipientIds] = useState([]);
    const [replySenderUnitId, setReplySenderUnitId] = useState(myUnitIds[0] || '');
    const [replyAttachments, setReplyAttachments] = useState([]);
    const [replyPreviews, setReplyPreviews] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const fileInputRef = useRef(null);

    const myUnits = units.filter(u => myUnitIds.includes(u.id));

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) +
            ' at ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const isImage = (mime) => mime?.startsWith('image/');

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setReplyAttachments(files);
        setReplyPreviews(files.map(f => ({ name: f.name, size: f.size, type: f.type })));
    };

    const removeAttachment = (index) => {
        setReplyAttachments(prev => prev.filter((_, i) => i !== index));
        setReplyPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleToggleRecipient = (id) => {
        setReplyRecipientIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleSendReply = (e) => {
        e.preventDefault();
        if (!replyBody.trim() || replyRecipientIds.length === 0) return;
        setIsSending(true);

        const formData = new FormData();
        formData.append('body', replyBody);
        formData.append('sender_unit_id', replySenderUnitId);
        replyRecipientIds.forEach(id => formData.append('recipient_ids[]', id));
        replyAttachments.forEach(file => formData.append('attachments[]', file));

        router.post(route('communications.reply', message.id), formData, {
            forceFormData: true,
            onFinish: () => setIsSending(false),
            onSuccess: () => {
                setReplyBody('');
                setReplyRecipientIds([]);
                setReplyAttachments([]);
                setReplyPreviews([]);
            },
        });
    };

    // Helper: initials
    const getInitials = (name) => {
        if (!name) return 'UN';
        return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    };

    // Build full thread: original message + replies
    const thread = [message, ...(message.replies || [])];

    return (
        <SneatLayout>
            <Head title={message.subject} />

            <div className="container-xxl flex-grow-1 container-p-y">

                {/* Thread Messages */}
                {thread.map((msg, index) => (
                    <div key={msg.id} className={`card mb-4 ${index === 0 ? 'border-primary' : ''}`}>
                        {/* Message Header */}
                        <div className={`card-header d-flex align-items-start justify-content-between ${index === 0 ? 'bg-label-primary' : 'bg-lighter'}`}>
                            <div className="d-flex align-items-start gap-3">
                                <div className="avatar avatar-sm flex-shrink-0">
                                    <span className="avatar-initial rounded-circle bg-primary text-white">
                                        {getInitials(msg.sender_unit?.name)}
                                    </span>
                                </div>
                                <div>
                                    <div className="d-flex align-items-center gap-2 flex-wrap">
                                        <span className="fw-semibold text-heading">{msg.sender_unit?.name}</span>
                                        {index === 0 && (
                                            <span className="badge bg-label-primary">Original</span>
                                        )}
                                        {msg.parent_id && (
                                            <span className="badge bg-label-info">Reply</span>
                                        )}
                                    </div>
                                    <div className="d-flex align-items-center gap-2 mt-1 flex-wrap">
                                        <i className="bx bx-user text-muted small"></i>
                                        <small className="text-muted">{msg.sender_user?.name}</small>
                                        <span className="text-muted">·</span>
                                        <small className="text-muted">{formatDate(msg.created_at)}</small>
                                    </div>
                                    {/* To: recipients */}
                                    {msg.recipients?.length > 0 && (
                                        <div className="mt-1 d-flex flex-wrap gap-1 align-items-center">
                                            <small className="text-muted">To:</small>
                                            {msg.recipients.map(r => (
                                                <span key={r.id} className="badge bg-label-primary">
                                                    {r.organization_unit?.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Message Body */}
                        <div className="card-body">
                            <p className="text-body" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>
                                {msg.body}
                            </p>
                        </div>

                        {/* Attachments */}
                        {msg.attachments?.length > 0 && (
                            <div className="card-footer border-top">
                                <p className="text-uppercase small fw-semibold text-muted mb-3">
                                    <i className="bx bx-paperclip me-1"></i>
                                    {msg.attachments.length} Attachment{msg.attachments.length !== 1 ? 's' : ''}
                                </p>
                                <div className="row g-3">
                                    {msg.attachments.map(att => (
                                        <div key={att.id} className="col-sm-6 col-lg-4">
                                            <a
                                                href={att.url}
                                                download={att.original_filename}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="d-flex align-items-center gap-2 border rounded p-2 text-decoration-none text-body hover-shadow"
                                            >
                                                {isImage(att.mime_type) ? (
                                                    <img
                                                        src={att.url}
                                                        alt={att.original_filename}
                                                        className="rounded"
                                                        style={{ width: 40, height: 40, objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <div className="avatar flex-shrink-0">
                                                        <span className="avatar-initial rounded bg-label-primary">
                                                            <i className="bx bx-file"></i>
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="text-truncate">
                                                    <p className="fw-medium small mb-0 text-truncate">{att.original_filename}</p>
                                                    <small className="text-muted">{formatFileSize(att.file_size)}</small>
                                                </div>
                                                <i className="bx bx-download ms-auto text-primary"></i>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* ─── Reply Box ─── */}
                <div className="card">
                    <div className="card-header">
                        <h5 className="mb-0">
                            <i className="bx bx-reply me-2"></i>Reply to Thread
                        </h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSendReply}>
                            <div className="row g-3">
                                {/* From */}
                                <div className="col-md-6">
                                    <label className="form-label">From (Your Unit)</label>
                                    <select
                                        className="form-select"
                                        value={replySenderUnitId}
                                        onChange={e => setReplySenderUnitId(e.target.value)}
                                        required
                                    >
                                        {myUnits.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                    </select>
                                </div>

                                {/* Reply To */}
                                <div className="col-md-6">
                                    <label className="form-label">Reply To (Units)</label>
                                    <div className="border rounded p-2" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                                        {units.map(u => (
                                            <div key={u.id} className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`reply-unit-${u.id}`}
                                                    checked={replyRecipientIds.includes(u.id)}
                                                    onChange={() => handleToggleRecipient(u.id)}
                                                />
                                                <label className="form-check-label small" htmlFor={`reply-unit-${u.id}`}>
                                                    {u.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="col-12">
                                    <label className="form-label">Your Reply</label>
                                    <textarea
                                        className="form-control"
                                        rows={5}
                                        placeholder="Type your reply here..."
                                        value={replyBody}
                                        onChange={e => setReplyBody(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Attachments */}
                                <div className="col-12">
                                    <div
                                        className="border rounded p-3 text-center"
                                        style={{ borderStyle: 'dashed', cursor: 'pointer' }}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <i className="bx bx-upload fs-4 text-muted"></i>
                                        <p className="small text-muted mb-0 mt-1">
                                            Attach files — PDFs, Word, Excel, Images, Videos, etc.
                                        </p>
                                    </div>
                                    <input ref={fileInputRef} type="file" multiple onChange={handleFileChange} className="d-none" />
                                    {replyPreviews.length > 0 && (
                                        <ul className="list-unstyled mt-2">
                                            {replyPreviews.map((f, i) => (
                                                <li key={i} className="d-flex align-items-center justify-content-between bg-light rounded px-3 py-2 mb-1">
                                                    <div className="d-flex align-items-center gap-2 text-truncate">
                                                        <i className={`bx ${isImage(f.type) ? 'bx-image' : 'bx-file'} text-muted`}></i>
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

                                {/* Actions */}
                                <div className="col-12 d-flex align-items-center justify-content-between">
                                    <Link href={route('communications.index')} className="btn btn-label-secondary">
                                        <i className="bx bx-arrow-back me-1"></i> Back to Inbox
                                    </Link>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isSending || !replyBody.trim() || replyRecipientIds.length === 0}
                                    >
                                        <i className="bx bx-send me-1"></i>
                                        {isSending ? 'Sending...' : 'Send Reply'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </SneatLayout>
    );
}
