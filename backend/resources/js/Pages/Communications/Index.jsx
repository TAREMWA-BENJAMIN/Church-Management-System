import React, { useState, useRef } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    InboxIcon, PaperAirplaneIcon, PlusIcon, PaperClipIcon,
    MagnifyingGlassIcon, TrashIcon, ChevronRightIcon,
    EnvelopeIcon, EnvelopeOpenIcon, XMarkIcon, ArrowUpTrayIcon
} from '@heroicons/react/24/outline';

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

    return (
        <AppLayout header={
            <div className="flex items-center justify-between w-full">
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <InboxIcon className="h-6 w-6 text-purple-500" />
                    Communications
                    {unreadCount > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center rounded-full bg-purple-600 px-2 py-0.5 text-xs font-bold text-white">
                            {unreadCount}
                        </span>
                    )}
                </h2>
            </div>
        }>
            <Head title="Communications" />

            <div className="py-4">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-6 min-h-[75vh]">

                        {/* ─── Left Sidebar ─── */}
                        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-3">
                            {/* Compose Button */}
                            <button
                                onClick={() => setIsComposeOpen(true)}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white shadow-lg hover:bg-purple-500 transition-all duration-200 hover:shadow-purple-500/30 hover:shadow-xl"
                            >
                                <PlusIcon className="h-5 w-5" />
                                Compose
                            </button>

                            {/* Tabs */}
                            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setActiveTab('inbox')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors ${activeTab === 'inbox' ? 'bg-purple-50 dark:bg-purple-800/40 text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                >
                                    <InboxIcon className="h-5 w-5" />
                                    Inbox
                                    {unreadCount > 0 && (
                                        <span className="ml-auto inline-flex items-center justify-center rounded-full bg-purple-600 px-2 py-0.5 text-xs font-bold text-white">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('sent')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold border-t border-gray-100 dark:border-white/5 transition-colors ${activeTab === 'sent' ? 'bg-purple-50 dark:bg-purple-800/40 text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                >
                                    <PaperAirplaneIcon className="h-5 w-5" />
                                    Sent
                                </button>
                            </div>
                        </div>

                        {/* ─── Message List ─── */}
                        <div className="flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
                            {/* Search bar */}
                            <div className="p-4 border-b border-gray-100 dark:border-white/10">
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search messages..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Message rows */}
                            {filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                                    <InboxIcon className="h-16 w-16 opacity-20 mb-4" />
                                    <p className="text-sm font-medium">
                                        {activeTab === 'inbox' ? 'Your inbox is empty' : 'No sent messages yet'}
                                    </p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-100 dark:divide-white/5">
                                    {filtered.map(msg => (
                                        <li
                                            key={msg.id}
                                            onClick={() => router.visit(route('communications.show', msg.id))}
                                            className={`flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/20 group ${!msg.is_read && activeTab === 'inbox' ? 'bg-purple-50/50 dark:bg-purple-900/10' : ''}`}
                                        >
                                            {/* Icon */}
                                            <div className="shrink-0 mt-0.5">
                                                {activeTab === 'inbox' && !msg.is_read ? (
                                                    <EnvelopeIcon className="h-5 w-5 text-purple-500" />
                                                ) : (
                                                    <EnvelopeOpenIcon className="h-5 w-5 text-gray-400" />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className={`text-sm truncate ${!msg.is_read && activeTab === 'inbox' ? 'font-bold text-gray-900 dark:text-white' : 'font-semibold text-gray-700 dark:text-gray-300'}`}>
                                                        {activeTab === 'inbox'
                                                            ? msg.sender_unit?.name
                                                            : (msg.recipients?.map(r => r.organization_unit?.name).join(', ') || 'N/A')}
                                                    </span>
                                                    <span className="text-xs text-gray-400 shrink-0">{formatDate(msg.created_at)}</span>
                                                </div>
                                                <p className={`text-sm truncate mt-0.5 ${!msg.is_read && activeTab === 'inbox' ? 'font-semibold text-gray-800 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>
                                                    {msg.subject}
                                                </p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <p className="text-xs text-gray-400 truncate">
                                                        {msg.body?.replace(/<[^>]*>/g, '').substring(0, 80)}...
                                                    </p>
                                                    {msg.reply_count > 0 && (
                                                        <span className="shrink-0 text-xs text-purple-500 font-semibold">{msg.reply_count} repl{msg.reply_count === 1 ? 'y' : 'ies'}</span>
                                                    )}
                                                    {msg.attachments?.length > 0 && (
                                                        <PaperClipIcon className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <ChevronRightIcon className="h-4 w-4 text-gray-300 group-hover:text-purple-400 transition-colors" />
                                                {activeTab === 'sent' && (
                                                    <button
                                                        onClick={(e) => handleDelete(e, msg.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-red-400 hover:text-red-600 transition-all"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Compose Modal ─── */}
            {isComposeOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 bg-purple-600">
                            <h3 className="text-base font-bold text-white">New Message</h3>
                            <button onClick={() => setIsComposeOpen(false)} className="text-white/70 hover:text-white">
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSend} className="p-6 space-y-4">
                            {/* From */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">From (Your Unit)</label>
                                <select
                                    value={data.sender_unit_id}
                                    onChange={e => setData('sender_unit_id', e.target.value)}
                                    className="block w-full rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 py-2 px-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                    required
                                >
                                    <option value="">Select your unit</option>
                                    {myUnits.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                                {errors.sender_unit_id && <p className="mt-1 text-xs text-red-500">{errors.sender_unit_id}</p>}
                            </div>

                            {/* To */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">To (Recipient Units)</label>
                                <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 max-h-36 overflow-y-auto p-2 space-y-1">
                                    {units.map(u => (
                                        <label key={u.id} className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.recipient_ids.includes(u.id)}
                                                onChange={e => {
                                                    const ids = e.target.checked
                                                        ? [...data.recipient_ids, u.id]
                                                        : data.recipient_ids.filter(id => id !== u.id);
                                                    setData('recipient_ids', ids);
                                                }}
                                                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">{u.name}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.recipient_ids && <p className="mt-1 text-xs text-red-500">{errors.recipient_ids}</p>}
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={data.subject}
                                    onChange={e => setData('subject', e.target.value)}
                                    placeholder="Message subject..."
                                    className="block w-full rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 py-2 px-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
                                    required
                                />
                                {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
                            </div>

                            {/* Body */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Message</label>
                                <textarea
                                    value={data.body}
                                    onChange={e => setData('body', e.target.value)}
                                    rows={5}
                                    placeholder="Type your message here..."
                                    className="block w-full rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 py-2 px-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                                    required
                                />
                                {errors.body && <p className="mt-1 text-xs text-red-500">{errors.body}</p>}
                            </div>

                            {/* Attachments */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Attachments</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-lg p-4 text-center cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 transition-colors group"
                                >
                                    <ArrowUpTrayIcon className="h-6 w-6 mx-auto text-gray-300 group-hover:text-purple-400 transition-colors" />
                                    <p className="text-xs text-gray-400 mt-1">Click to upload files — any format, up to 50MB each</p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                {attachmentPreviews.length > 0 && (
                                    <ul className="mt-2 space-y-1">
                                        {attachmentPreviews.map((f, i) => (
                                            <li key={i} className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-white/5 px-3 py-1.5 text-xs">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <PaperClipIcon className="h-3.5 w-3.5 text-gray-400 shrink-0" />
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
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsComposeOpen(false)}
                                    className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors disabled:opacity-50 shadow-md"
                                >
                                    <PaperAirplaneIcon className="h-4 w-4" />
                                    {processing ? 'Sending...' : 'Send Message'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
