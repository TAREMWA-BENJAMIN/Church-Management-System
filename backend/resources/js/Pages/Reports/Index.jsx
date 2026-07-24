import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { PrinterIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function ReportsIndex({ units, reportType, filters, reportData }) {
    
    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        router.get(route('reports.index'), { type: reportType, ...newFilters }, { preserveState: true });
    };

    const handleTypeChange = (type) => {
        router.get(route('reports.index'), { type, unit_id: filters.unit_id || '' });
    };

    const printReport = () => {
        window.print();
    };

    // Calculate metrics for preview
    const getSummary = () => {
        if (reportType === 'finance') {
            const income = reportData.filter(r => r.type === 'income').reduce((sum, r) => sum + parseFloat(r.amount), 0);
            const expenditure = reportData.filter(r => r.type === 'expenditure').reduce((sum, r) => sum + parseFloat(r.amount), 0);
            return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border border-gray-200 dark:border-white/10 p-4 rounded-xl mb-6 bg-white dark:bg-white/5 transition-colors duration-200">
                    <div className="flex sm:block justify-between items-center sm:items-start border-b sm:border-b-0 border-gray-200 dark:border-white/10 pb-3 sm:pb-0">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Total Income</div>
                        <div className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400 mt-0 sm:mt-1">
                            {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(income)}
                        </div>
                    </div>
                    <div className="flex sm:block justify-between items-center sm:items-start border-b sm:border-b-0 border-gray-200 dark:border-white/10 pb-3 sm:pb-0">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Total Expenditure</div>
                        <div className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400 mt-0 sm:mt-1">
                            {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(expenditure)}
                        </div>
                    </div>
                    <div className="flex sm:block justify-between items-center sm:items-start">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Net Balance</div>
                        <div className={`text-base sm:text-lg font-bold mt-0 sm:mt-1 ${income - expenditure >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-600 dark:text-red-400'}`}>
                            {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(income - expenditure)}
                        </div>
                    </div>
                </div>
            );
        } else if (reportType === 'assets') {
            const totalVal = reportData.reduce((sum, r) => sum + parseFloat(r.value || 0), 0);
            return (
                <div className="grid grid-cols-2 gap-4 border border-gray-200 dark:border-white/10 p-4 rounded-xl mb-6 bg-white dark:bg-white/5 transition-colors duration-200">
                    <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Total Assets Registered</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{reportData.length}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Total Estimated Value</div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">{new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(totalVal)}</div>
                    </div>
                </div>
            );
        } else if (reportType === 'members') {
            const active = reportData.filter(r => r.status === 'active').length;
            return (
                <div className="grid grid-cols-2 gap-4 border border-gray-200 dark:border-white/10 p-4 rounded-xl mb-6 bg-white dark:bg-white/5 transition-colors duration-200">
                    <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Total Members</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{reportData.length}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Active Members</div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">{active}</div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="grid grid-cols-1 gap-4 border border-gray-200 dark:border-white/10 p-4 rounded-xl mb-6 bg-white dark:bg-white/5 transition-colors duration-200">
                    <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Total Affiliated Institutions</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{reportData.length}</div>
                    </div>
                </div>
            );
        }
    };

    return (
        <AppLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Reports & Analytics</h2>}>
            <Head title="Reports" />

            {/* Print Stylesheet */}
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    body {
                        background-color: white !important;
                        color: black !important;
                    }
                    /* Hide everything except print sheet */
                    aside, nav, header, .no-print, button, form {
                        display: none !important;
                    }
                    main {
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .print-sheet {
                        display: block !important;
                        background: white !important;
                        color: black !important;
                        padding: 20px !important;
                        width: 100% !important;
                        box-shadow: none !important;
                        border: none !important;
                    }
                    table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                        margin-top: 20px !important;
                        color: black !important;
                    }
                    th, td {
                        border: 1px solid #ddd !important;
                        padding: 8px !important;
                        text-align: left !important;
                        color: black !important;
                    }
                    th {
                        background-color: #f2f2f2 !important;
                    }
                    .print-header {
                        display: block !important;
                        text-align: center !important;
                        margin-bottom: 30px !important;
                    }
                    .print-header h1 {
                        font-size: 24px !important;
                        font-weight: bold !important;
                        text-transform: uppercase !important;
                    }
                }
            `}} />

            <div className="py-4 no-print">
                <div className="mx-auto max-w-7xl">
                    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-lg transition-colors duration-200">
                        
                        {/* Tab Selectors */}
                        <div className="border-b border-gray-200 dark:border-white/10 pb-4 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-between">
                            <div className="flex flex-wrap gap-2">
                                {['finance', 'assets', 'institutions', 'members'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => handleTypeChange(type)}
                                        className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors capitalize ${
                                            reportType === type 
                                                ? 'bg-purple-600 text-white' 
                                                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10'
                                        }`}
                                    >
                                        {type} Report
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={printReport}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-x-2 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
                            >
                                <PrinterIcon className="h-5 w-5" />
                                Print / Save PDF
                            </button>
                        </div>

                        {/* Filter Settings Form */}
                        <form className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-6 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 transition-colors duration-200">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Organization Unit</label>
                                <select
                                    value={filters.unit_id || ''}
                                    onChange={e => handleFilterChange('unit_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-0 bg-gray-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                                >
                                    <option value="">All Units</option>
                                    {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                            </div>

                            {reportType === 'finance' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Start Date</label>
                                        <input
                                            type="date"
                                            value={filters.start_date || ''}
                                            onChange={e => handleFilterChange('start_date', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 [color-scheme:dark]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">End Date</label>
                                        <input
                                            type="date"
                                            value={filters.end_date || ''}
                                            onChange={e => handleFilterChange('end_date', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 [color-scheme:dark]"
                                        />
                                    </div>
                                </>
                            )}
                        </form>

                        {/* On-screen Preview Frame */}
                        <div className="border border-gray-200 dark:border-white/10 rounded-xl p-4 sm:p-6 bg-white dark:bg-white/5 transition-colors duration-200">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <ChartBarIcon className="h-5 w-5 text-purple-400" /> Report Preview
                            </h3>

                            {getSummary()}

                            {/* Mobile cards */}
                            <div className="block md:hidden space-y-3 mt-4">
                                {reportData.length === 0 ? (
                                    <div className="text-center text-gray-500 py-4">No records found matching filters.</div>
                                ) : (
                                    reportData.map((row) => (
                                        <div key={row.id} className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
                                            <div className="flex flex-col gap-1.5">
                                                {reportType === 'finance' && (
                                                    <>
                                                        <div><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Date</span><div className="text-sm text-gray-800 dark:text-gray-200">{new Date(row.date).toLocaleDateString()}</div></div>
                                                        <div><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Type</span><div className="text-sm text-gray-800 dark:text-gray-200 capitalize">{row.type}</div></div>
                                                        <div><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Category</span><div className="text-sm text-gray-800 dark:text-gray-200">{row.category}</div></div>
                                                        <div><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Unit</span><div className="text-sm text-gray-800 dark:text-gray-200">{row.organization_unit?.name}</div></div>
                                                        <div><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Amount</span><div className={`text-sm font-semibold ${row.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{row.type === 'income' ? '+' : '-'} {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(row.amount)}</div></div>
                                                    </>
                                                )}
                                                {reportType === 'assets' && (
                                                    <>
                                                        <div><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Asset Name</span><div className="text-sm font-semibold text-gray-900 dark:text-white">{row.name}</div></div>
                                                        <div><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Category</span><div className="text-sm text-gray-800 dark:text-gray-200">{row.category}</div></div>
                                                        <div><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Owning Unit</span><div className="text-sm text-gray-800 dark:text-gray-200">{row.organization_unit?.name}</div></div>
                                                        <div><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</span><div className="text-sm text-gray-800 dark:text-gray-200">{row.status}</div></div>
                                                        <div><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Value</span><div className="text-sm font-semibold text-green-600 dark:text-green-400">{new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(row.value)}</div></div>
                                                    </>
                                                )}
                                                {reportType === 'institutions' && (
                                                    <>
                                                        <div><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Institution Name</span><div className="text-sm font-semibold text-gray-900 dark:text-white">{row.name}</div></div>
                                                        <div><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Type</span><div className="text-sm text-gray-800 dark:text-gray-200">{row.type}</div></div>
                                                        <div><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Supervising Unit</span><div className="text-sm text-gray-800 dark:text-gray-200">{row.organization_unit?.name}</div></div>
                                                        <div><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Contact Phone</span><div className="text-sm text-gray-800 dark:text-gray-200">{row.contact_phone || 'N/A'}</div></div>
                                                        <div><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Address</span><div className="text-sm text-gray-800 dark:text-gray-200">{row.address || 'N/A'}</div></div>
                                                    </>
                                                )}
                                                {reportType === 'members' && (
                                                    <>
                                                        <div><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Full Name</span><div className="text-sm font-semibold text-gray-900 dark:text-white">{row.first_name} {row.last_name}</div></div>
                                                        <div><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Role / Position</span><div className="text-sm text-gray-800 dark:text-gray-200">
                                                            {row.role 
                                                                ? <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30">{row.role}</span>
                                                                : <span className="text-gray-400 italic text-xs">Not set</span>
                                                            }
                                                        </div></div>
                                                        <div><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Unit</span><div className="text-sm text-gray-800 dark:text-gray-200">{row.organization_unit?.name}</div></div>
                                                        <div><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Gender</span><div className="text-sm text-gray-800 dark:text-gray-200">{row.gender || '-'}</div></div>
                                                        <div><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Phone</span><div className="text-sm text-gray-800 dark:text-gray-200">{row.phone_number || '-'}</div></div>
                                                        <div><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</span><div className="text-sm text-gray-800 dark:text-gray-200 capitalize">{row.status}</div></div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Desktop table */}
                            <div className="hidden md:block overflow-x-auto mt-4">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
                                    <thead>
                                        {reportType === 'finance' && (
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Date</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Type</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Category</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Unit</th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                                            </tr>
                                        )}
                                        {reportType === 'assets' && (
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Asset Name</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Category</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Owning Unit</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Status</th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400">Value</th>
                                            </tr>
                                        )}
                                        {reportType === 'institutions' && (
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Institution Name</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Type</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Supervising Unit</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Contact Phone</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Address</th>
                                            </tr>
                                        )}
                                        {reportType === 'members' && (
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Full Name</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Role / Position</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Unit</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Gender</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Phone</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Status</th>
                                            </tr>
                                        )}
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-white/10 text-gray-700 dark:text-gray-300 text-sm">
                                        {reportData.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No records found matching filters.</td>
                                            </tr>
                                        ) : (
                                            reportData.map((row) => (
                                                <tr key={row.id}>
                                                    {reportType === 'finance' && (
                                                        <>
                                                            <td className="px-4 py-3">{new Date(row.date).toLocaleDateString()}</td>
                                                            <td className="px-4 py-3 capitalize">{row.type}</td>
                                                            <td className="px-4 py-3">{row.category}</td>
                                                            <td className="px-4 py-3">{row.organization_unit?.name}</td>
                                                            <td className={`px-4 py-3 text-right font-semibold ${row.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                                {row.type === 'income' ? '+' : '-'} {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(row.amount)}
                                                            </td>
                                                        </>
                                                    )}
                                                    {reportType === 'assets' && (
                                                        <>
                                                            <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{row.name}</td>
                                                            <td className="px-4 py-3">{row.category}</td>
                                                            <td className="px-4 py-3">{row.organization_unit?.name}</td>
                                                            <td className="px-4 py-3">{row.status}</td>
                                                            <td className="px-4 py-3 text-right font-semibold text-green-600 dark:text-green-400">
                                                                {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(row.value)}
                                                            </td>
                                                        </>
                                                    )}
                                                    {reportType === 'institutions' && (
                                                        <>
                                                            <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{row.name}</td>
                                                            <td className="px-4 py-3">{row.type}</td>
                                                            <td className="px-4 py-3">{row.organization_unit?.name}</td>
                                                            <td className="px-4 py-3">{row.contact_phone || 'N/A'}</td>
                                                            <td className="px-4 py-3">{row.address || 'N/A'}</td>
                                                        </>
                                                    )}
                                                    {reportType === 'members' && (
                                                        <>
                                                            <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{row.first_name} {row.last_name}</td>
                                                            <td className="px-4 py-3">
                                                                {row.role 
                                                                    ? <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30">{row.role}</span>
                                                                    : <span className="text-gray-400 italic text-xs">Not set</span>
                                                                }
                                                            </td>
                                                            <td className="px-4 py-3">{row.organization_unit?.name}</td>
                                                            <td className="px-4 py-3">{row.gender || '-'}</td>
                                                            <td className="px-4 py-3">{row.phone_number || '-'}</td>
                                                            <td className="px-4 py-3 capitalize">{row.status}</td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Offline Printable Sheet (Only visible to browser printer) */}
            <div className="hidden print-sheet">
                <div className="print-header">
                    <h1>Church of Uganda</h1>
                    <h3>Official {reportType.toUpperCase()} Report</h3>
                    <p className="text-xs">Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                </div>

                <div className="mb-4">
                    <p><strong>Filter scope:</strong> {filters.unit_id ? units.find(u => u.id === parseInt(filters.unit_id))?.name : 'All Overseen Units'}</p>
                    {reportType === 'finance' && filters.start_date && (
                        <p><strong>Date range:</strong> {filters.start_date} to {filters.end_date || 'Present'}</p>
                    )}
                </div>

                <table>
                    <thead>
                        {reportType === 'finance' && (
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Category</th>
                                <th>Organization Unit</th>
                                <th style={{textAlign: 'right'}}>Amount (UGX)</th>
                            </tr>
                        )}
                        {reportType === 'assets' && (
                            <tr>
                                <th>Asset Title</th>
                                <th>Category</th>
                                <th>Owning Unit</th>
                                <th>Status</th>
                                <th style={{textAlign: 'right'}}>Value (UGX)</th>
                            </tr>
                        )}
                        {reportType === 'institutions' && (
                            <tr>
                                <th>Institution Name</th>
                                <th>Type</th>
                                <th>Supervising Unit</th>
                                <th>Phone</th>
                                <th>Location</th>
                            </tr>
                        )}
                        {reportType === 'members' && (
                            <tr>
                                <th>Full Name</th>
                                <th>Role / Position</th>
                                <th>Unit</th>
                                <th>Gender</th>
                                <th>Phone</th>
                                <th>Status</th>
                            </tr>
                        )}
                    </thead>
                    <tbody>
                        {reportData.map((row) => (
                            <tr key={row.id}>
                                {reportType === 'finance' && (
                                    <>
                                        <td>{new Date(row.date).toLocaleDateString()}</td>
                                        <td style={{textTransform: 'capitalize'}}>{row.type}</td>
                                        <td>{row.category}</td>
                                        <td>{row.organization_unit?.name}</td>
                                        <td style={{textAlign: 'right'}}>{new Intl.NumberFormat('en-UG').format(row.amount)}</td>
                                    </>
                                )}
                                {reportType === 'assets' && (
                                    <>
                                        <td>{row.name}</td>
                                        <td>{row.category}</td>
                                        <td>{row.organization_unit?.name}</td>
                                        <td>{row.status}</td>
                                        <td style={{textAlign: 'right'}}>{new Intl.NumberFormat('en-UG').format(row.value)}</td>
                                    </>
                                )}
                                {reportType === 'institutions' && (
                                    <>
                                        <td>{row.name}</td>
                                        <td>{row.type}</td>
                                        <td>{row.organization_unit?.name}</td>
                                        <td>{row.contact_phone || 'N/A'}</td>
                                        <td>{row.address || 'N/A'}</td>
                                    </>
                                )}
                                {reportType === 'members' && (
                                    <>
                                        <td>{row.first_name} {row.last_name}</td>
                                        <td>{row.role || 'Not set'}</td>
                                        <td>{row.organization_unit?.name}</td>
                                        <td>{row.gender || '-'}</td>
                                        <td>{row.phone_number || '-'}</td>
                                        <td style={{textTransform: 'capitalize'}}>{row.status}</td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
