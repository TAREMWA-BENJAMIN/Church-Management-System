import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import { BuildingOfficeIcon, UsersIcon } from '@heroicons/react/24/outline';

export default function DirectoratesIndex({ directorates }) {
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
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white">Directorate Units</h3>
                            <p className="text-sm text-gray-400 mt-1">Read-only overview of all specialized directorates.</p>
                        </div>
                        
                        <DataTable columns={columns} data={directorates} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
