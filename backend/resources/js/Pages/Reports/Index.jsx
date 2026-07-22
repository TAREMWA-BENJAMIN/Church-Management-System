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
                <div className="grid grid-cols-3 gap-4 border border-white/10 p-4 rounded-xl mb-6 bg-white/5">
                    <div>
                        <div className="text-xs text-gray-400">Total Income</div>
                        <div className="text-lg font-bold text-green-400">{new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(income)}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400">Total Expenditure</div>
                        <div className="text-lg font-bold text-red-400">{new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(expenditure)}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400">Net Balance</div>
                        <div className={`text-lg font-bold ${income - expenditure >= 0 ? 'text-white' : 'text-red-400'}`}>
                            {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(income - expenditure)}
                        </div>
                    </div>
                </div>
            );
        } else if (reportType === 'assets') {
            const totalVal = reportData.reduce((sum, r) => sum + parseFloat(r.value || 0), 0);
            return (
                <div className="grid grid-cols-2 gap-4 border border-white/10 p-4 rounded-xl mb-6 bg-white/5">
                    <div>
                        <div className="text-xs text-gray-400">Total Assets Registered</div>
                        <div className="text-lg font-bold text-white">{reportData.length}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400">Total Estimated Value</div>
                        <div className="text-lg font-bold text-green-400">{new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(totalVal)}</div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="grid grid-cols-1 gap-4 border border-white/10 p-4 rounded-xl mb-6 bg-white/5">
                    <div>
                        <div className="text-xs text-gray-400">Total Affiliated Institutions</div>
                        <div className="text-lg font-bold text-white">{reportData.length}</div>
                    </div>
                </div>
            );
        }
    };

    return (
        <AppLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-200">Reports & Analytics</h2>}>
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

            <div className="py-6 no-print">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg">
                        
                        {/* Tab Selectors */}
                        <div className="border-b border-white/10 pb-5 flex flex-wrap gap-4 items-center justify-between">
                            <div className="flex space-x-4">
                                {['finance', 'assets', 'institutions'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => handleTypeChange(type)}
                                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors capitalize ${
                                            reportType === type 
                                                ? 'bg-purple-600 text-white' 
                                                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        {type} Report
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={printReport}
                                className="inline-flex items-center gap-x-2 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
                            >
                                <PrinterIcon className="h-5 w-5" />
                                Print / Save PDF
                            </button>
                        </div>

                        {/* Filter Settings Form */}
                        <form className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-6 p-4 rounded-xl border border-white/10 bg-white/5">
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Organization Unit</label>
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
                                        <label className="block text-sm font-medium text-gray-400">Start Date</label>
                                        <input
                                            type="date"
                                            value={filters.start_date || ''}
                                            onChange={e => handleFilterChange('start_date', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 [color-scheme:dark]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">End Date</label>
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
                        <div className="border border-white/10 rounded-xl p-6 bg-white/5">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <ChartBarIcon className="h-5 w-5 text-purple-400" /> Report Preview
                            </h3>

                            {getSummary()}

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-white/10">
                                    <thead>
                                        {reportType === 'finance' && (
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Date</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Type</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Category</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Unit</th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400">Amount</th>
                                            </tr>
                                        )}
                                        {reportType === 'assets' && (
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Asset Name</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Category</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Owning Unit</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Status</th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400">Value</th>
                                            </tr>
                                        )}
                                        {reportType === 'institutions' && (
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Institution Name</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Type</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Supervising Unit</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Contact Phone</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Address</th>
                                            </tr>
                                        )}
                                    </thead>
                                    <tbody className="divide-y divide-white/10 text-gray-300 text-sm">
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
                                                            <td className={`px-4 py-3 text-right font-semibold ${row.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                                                {row.type === 'income' ? '+' : '-'} {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(row.amount)}
                                                            </td>
                                                        </>
                                                    )}
                                                    {reportType === 'assets' && (
                                                        <>
                                                            <td className="px-4 py-3 font-semibold text-white">{row.name}</td>
                                                            <td className="px-4 py-3">{row.category}</td>
                                                            <td className="px-4 py-3">{row.organization_unit?.name}</td>
                                                            <td className="px-4 py-3">{row.status}</td>
                                                            <td className="px-4 py-3 text-right font-semibold text-green-400">
                                                                {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(row.value)}
                                                            </td>
                                                        </>
                                                    )}
                                                    {reportType === 'institutions' && (
                                                        <>
                                                            <td className="px-4 py-3 font-semibold text-white">{row.name}</td>
                                                            <td className="px-4 py-3">{row.type}</td>
                                                            <td className="px-4 py-3">{row.organization_unit?.name}</td>
                                                            <td className="px-4 py-3">{row.contact_phone || 'N/A'}</td>
                                                            <td className="px-4 py-3">{row.address || 'N/A'}</td>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
