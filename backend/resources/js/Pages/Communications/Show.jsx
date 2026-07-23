import React, { useState, useRef } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeftIcon, PaperClipIcon, PaperAirplaneIcon,
    ArrowUpTrayIcon, XMarkIcon, DocumentIcon,
    PhotoIcon, TrashIcon, BuildingOfficeIcon, UserCircleIcon
} from '@heroicons/react/24/outline';

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

    const getFileIcon = (mime) => {
        if (isImage(mime)) return <PhotoIcon className="h-5 w-5 text-blue-400" />;
        return <DocumentIcon className="h-5 w-5 text-purple-400" />;
    };

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

    // Build full thread: original message + replies
    const thread = [message, ...(message.replies || [])];

    return (
        <AppLayout header={
            <div className="flex items-center gap-3">
                <Link href={route('communications.index')} className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <ArrowLeftIcon className="h-5 w-5" />
                </Link>
                <div className="min-w-0">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">{message.subject}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {thread.length} message{thread.length !== 1 ? 's' : ''} in this thread
                    </p>
                </div>
            </div>
        }>
            <Head title={message.subject} />

            <div className="py-4">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-4">

                    {/* ─── Thread Messages ─── */}
                    {thread.map((msg, index) => (
                        <div
                            key={msg.id}
                            className={`bg-white dark:bg-white/5 border rounded-2xl overflow-hidden shadow-sm transition-colors duration-200 ${index === 0 ? 'border-purple-200 dark:border-purple-500/30' : 'border-gray-200 dark:border-white/10'}`}
                        >
                            {/* Message Header */}
                            <div className={`px-6 py-4 flex items-start justify-between gap-4 ${index === 0 ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-gray-50 dark:bg-white/5'}`}>
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-800/50">
                                        <BuildingOfficeIcon className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                {msg.sender_unit?.name}
                                            </span>
                                            {index === 0 && (
                                                <span className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-800/50 px-2 py-0.5 text-xs font-medium text-purple-700 dark:text-purple-300">
                                                    Original
                                                </span>
                                            )}
                                            {msg.parent_id && (
                                                <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-800/30 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                                                    Reply
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                            <UserCircleIcon className="h-3.5 w-3.5 text-gray-400" />
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{msg.sender_user?.name}</span>
                                            <span className="text-gray-300 dark:text-gray-600">·</span>
                                            <span className="text-xs text-gray-400">{formatDate(msg.created_at)}</span>
                                        </div>
                                        {/* To: */}
                                        {msg.recipients?.length > 0 && (
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                <span className="text-xs text-gray-400">To:</span>
                                                {msg.recipients.map(r => (
                                                    <span key={r.id} className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                                                        {r.organization_unit?.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Message Body */}
                            <div className="px-6 py-5">
                                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                    {msg.body}
                                </div>
                            </div>

                            {/* Attachments */}
                            {msg.attachments?.length > 0 && (
                                <div className="px-6 pb-5">
                                    <div className="border-t border-gray-100 dark:border-white/10 pt-4">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                            <PaperClipIcon className="h-4 w-4" />
                                            {msg.attachments.length} Attachment{msg.attachments.length !== 1 ? 's' : ''}
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {msg.attachments.map(att => (
                                                <a
                                                    key={att.id}
                                                    href={att.url}
                                                    download={att.original_filename}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-3 hover:border-purple-300 dark:hover:border-purple-500/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group"
                                                >
                                                    <div className="shrink-0">
                                                        {isImage(att.mime_type) ? (
                                                            <img
                                                                src={att.url}
                                                                alt={att.original_filename}
                                                                className="h-10 w-10 rounded-lg object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-800/30 flex items-center justify-center">
                                                                {getFileIcon(att.mime_type)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                            {att.original_filename}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-0.5">{formatFileSize(att.file_size)}</p>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* ─── Reply Box ─── */}
                    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                            <h3 className="text-sm font-bold text-gray-800 dark:text-white">Reply to Thread</h3>
                        </div>

                        <form onSubmit={handleSendReply} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* From */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">From (Your Unit)</label>
                                    <select
                                        value={replySenderUnitId}
                                        onChange={e => setReplySenderUnitId(e.target.value)}
                                        className="block w-full rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 py-2 px-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                        required
                                    >
                                        {myUnits.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                    </select>
                                </div>

                                {/* Reply To */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Reply To (Units)</label>
                                    <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 max-h-24 overflow-y-auto p-2 space-y-1">
                                        {units.map(u => (
                                            <label key={u.id} className="flex items-center gap-2 px-2 py-0.5 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10">
                                                <input
                                                    type="checkbox"
                                                    checked={replyRecipientIds.includes(u.id)}
                                                    onChange={() => handleToggleRecipient(u.id)}
                                                    className="h-3.5 w-3.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                />
                                                <span className="text-xs text-gray-700 dark:text-gray-300">{u.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Your Reply</label>
                                <textarea
                                    value={replyBody}
                                    onChange={e => setReplyBody(e.target.value)}
                                    rows={5}
                                    placeholder="Type your reply here..."
                                    className="block w-full rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 py-2.5 px-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                                    required
                                />
                            </div>

                            {/* Attachment Upload */}
                            <div>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl p-4 text-center cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 transition-colors group"
                                >
                                    <ArrowUpTrayIcon className="h-5 w-5 mx-auto text-gray-300 group-hover:text-purple-400 transition-colors" />
                                    <p className="text-xs text-gray-400 mt-1">Attach files — PDFs, Word, Excel, Images, Videos, etc.</p>
                                </div>
                                <input ref={fileInputRef} type="file" multiple onChange={handleFileChange} className="hidden" />
                                {replyPreviews.length > 0 && (
                                    <ul className="mt-2 space-y-1">
                                        {replyPreviews.map((f, i) => (
                                            <li key={i} className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 px-3 py-1.5 text-xs">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    {isImage(f.type) ? <PhotoIcon className="h-4 w-4 text-blue-400 shrink-0" /> : <DocumentIcon className="h-4 w-4 text-purple-400 shrink-0" />}
                                                    <span className="text-gray-700 dark:text-gray-300 truncate">{f.name}</span>
                                                    <span className="text-gray-400 shrink-0">{formatFileSize(f.size)}</span>
                                                </div>
                                                <button type="button" onClick={() => removeAttachment(i)} className="text-red-400 hover:text-red-600 ml-2">
                                                    <XMarkIcon className="h-4 w-4" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-2">
                                <Link
                                    href={route('communications.index')}
                                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                                >
                                    ← Back to Inbox
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isSending || !replyBody.trim() || replyRecipientIds.length === 0}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-500 transition-colors disabled:opacity-50 shadow-md hover:shadow-purple-500/30 hover:shadow-lg"
                                >
                                    <PaperAirplaneIcon className="h-4 w-4" />
                                    {isSending ? 'Sending...' : 'Send Reply'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
