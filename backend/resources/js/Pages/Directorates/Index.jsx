import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import FormDialog from '@/Components/FormDialog';
import { BuildingOfficeIcon, UsersIcon, PlusIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

    export default function DirectoratesIndex({ directorates, directorateType, units, canManage }) {
        const { auth } = usePage().props;
        const [isDialogOpen, setIsDialogOpen] = useState(false);
    
        const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
            name: '',
            organization_unit_type_id: directorateType?.id || '',
            parent_id: ''
        });
    
        const openAddDialog = () => {
            clearErrors();
            setData({
                name: '',
                organization_unit_type_id: directorateType?.id || '',
                parent_id: ''
            });
            setIsDialogOpen(true);
        };
    
        const submit = (e) => {
            e.preventDefault();
            post(route('organization.store'), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
                preserveScroll: true
            });
        };
    
        // A palette of accent colors for each directorate card
        const accents = [
            { bg: 'bg-purple-500/15', icon: 'text-purple-400', ring: 'ring-purple-500/20', glow: 'bg-purple-500/10' },
            { bg: 'bg-blue-500/15',   icon: 'text-blue-400',   ring: 'ring-blue-500/20',   glow: 'bg-blue-500/10' },
            { bg: 'bg-indigo-500/15', icon: 'text-indigo-400', ring: 'ring-indigo-500/20', glow: 'bg-indigo-500/10' },
            { bg: 'bg-violet-500/15', icon: 'text-violet-400', ring: 'ring-violet-500/20', glow: 'bg-violet-500/10' },
            { bg: 'bg-cyan-500/15',   icon: 'text-cyan-400',   ring: 'ring-cyan-500/20',   glow: 'bg-cyan-500/10' },
            { bg: 'bg-emerald-500/15',icon: 'text-emerald-400',ring: 'ring-emerald-500/20',glow: 'bg-emerald-500/10' },
        ];
    
        return (
            <AppLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Directorates Dashboard</h2>}>
                <Head title="Directorates" />
    
                <div className="py-4">
                    <div className="mx-auto max-w-7xl">
    
                        {/* ── Summary Metrics ── */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-lg relative overflow-hidden transition-colors duration-200">
                                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-purple-500/10 blur-2xl" />
                                <dt className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Total Directorates</dt>
                                <dd className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{directorates.length}</dd>
                            </div>
                            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-lg relative overflow-hidden transition-colors duration-200">
                                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-blue-500/10 blur-2xl" />
                                <dt className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Assigned Staff</dt>
                                <dd className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {directorates.reduce((acc, curr) => acc + (curr.role_assignments?.length || 0), 0)}
                                </dd>
                            </div>
                        </div>
    
                        {/* ── Header ── */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Directorate Units</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Overview of all specialized directorates.</p>
                            </div>
                            {canManage && (
                                <button
                                    onClick={openAddDialog}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-x-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-colors"
                                >
                                    <PlusIcon className="h-4 w-4" />
                                    Add Directorate
                                </button>
                            )}
                        </div>

                    {/* ── Directorate Cards ── */}
                    {directorates.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                            <BuildingOfficeIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No directorates found.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {directorates.map((dir, index) => {
                                const accent = accents[index % accents.length];
                                return (
                                    <div
                                        key={dir.id}
                                        className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 backdrop-blur-xl shadow-sm hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-all duration-200"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Icon */}
                                            <div className={`shrink-0 flex h-11 w-11 items-center justify-center rounded-xl ${accent.bg} ring-1 ${accent.ring}`}>
                                                <BuildingOfficeIcon className={`h-5 w-5 ${accent.icon}`} />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-gray-900 dark:text-white text-base leading-tight truncate">
                                                    {dir.name}
                                                </p>
                                                <p className="text-xs text-gray-600 dark:text-gray-500 mt-0.5 truncate">
                                                    Reports to: <span className="text-gray-700 dark:text-gray-400">{dir.parent?.name || 'Top Level'}</span>
                                                </p>

                                                {/* Staff badge */}
                                                <div className="flex items-center gap-1.5 mt-2.5">
                                                    <UsersIcon className="h-3.5 w-3.5 text-gray-600 dark:text-gray-500" />
                                                    <span className="text-xs text-gray-700 dark:text-gray-400">
                                                        {dir.role_assignments?.length || 0} staff assigned
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action arrow */}
                                            {canManage && (
                                                <Link
                                                    href={route('organization.index')}
                                                    className="shrink-0 flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors mt-0.5"
                                                >
                                                    <span className="hidden sm:inline">Manage</span>
                                                    <ArrowRightIcon className="h-4 w-4" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <FormDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title="Add New Directorate">
                <form className="space-y-4" onSubmit={submit}>
                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-300">Directorate Name</label>
                        <div className="mt-1">
                            <input 
                                type="text" 
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6" 
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-300">Reports To (Parent Unit)</label>
                        <div className="mt-1">
                            <select 
                                value={data.parent_id}
                                onChange={e => setData('parent_id', e.target.value)}
                                className="block w-full rounded-md border-0 bg-gray-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                            >
                                <option value="">None (Top Level)</option>
                                {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                            </select>
                            {errors.parent_id && <p className="mt-1 text-sm text-red-500">{errors.parent_id}</p>}
                        </div>
                    </div>

                    <div className="mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="inline-flex w-full justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 sm:col-start-2 disabled:opacity-50 transition-colors" 
                        >
                            {processing ? 'Saving...' : 'Save Directorate'}
                        </button>
                        <button 
                            type="button" 
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/20 hover:bg-white/20 sm:col-start-1 sm:mt-0 transition-colors" 
                            onClick={() => setIsDialogOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </FormDialog>
        </AppLayout>
    );
}
