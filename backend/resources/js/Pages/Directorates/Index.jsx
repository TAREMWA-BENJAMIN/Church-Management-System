import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import FormDialog from '@/Components/FormDialog';
import { BuildingOfficeIcon, UsersIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function DirectoratesIndex({ directorates, directorateType, units }) {
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

    const columns = [
        { 
            header: 'Directorate Name', 
            accessor: (row) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20">
                        <BuildingOfficeIcon className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                        <div className="font-semibold text-white">{row.name}</div>
                        <div className="text-xs text-gray-400">Reports to: {row.parent?.name || 'N/A'}</div>
                    </div>
                </div>
            ) 
        },
        { 
            header: 'Assigned Staff', 
            accessor: (row) => (
                <div className="flex items-center gap-2">
                    <UsersIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">
                        {row.role_assignments?.length || 0} Members
                    </span>
                </div>
            ) 
        },
        { 
            header: 'Actions', 
            accessor: (row) => (
                <Link 
                    href={route('organization.index')} 
                    className="text-sm font-semibold leading-6 text-purple-400 hover:text-purple-300 transition-colors"
                >
                    Manage in Tree <span aria-hidden="true">&rarr;</span>
                </Link>
            ) 
        }
    ];

    return (
        <AppLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-200">Directorates Dashboard</h2>}>
            <Head title="Directorates" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Summary Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-purple-500/10 blur-2xl"></div>
                            <dt className="text-sm font-medium text-gray-400 truncate">Total Directorates</dt>
                            <dd className="mt-2 text-3xl font-semibold tracking-tight text-white">{directorates.length}</dd>
                        </div>
                        
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl"></div>
                            <dt className="text-sm font-medium text-gray-400 truncate">Total Assigned Staff</dt>
                            <dd className="mt-2 text-3xl font-semibold tracking-tight text-white">
                                {directorates.reduce((acc, curr) => acc + (curr.role_assignments?.length || 0), 0)}
                            </dd>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-lg">
                        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-white">Directorate Units</h3>
                                <p className="text-sm text-gray-400 mt-1">Overview of all specialized directorates.</p>
                            </div>
                            {(auth.is_super_admin || units.length > 0) && (
                                <button 
                                    onClick={openAddDialog}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-x-2 rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-colors"
                                >
                                    <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                                    Add Directorate
                                </button>
                            )}
                        </div>
                        
                        <DataTable columns={columns} data={directorates} />
                    </div>
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
