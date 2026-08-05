import React from 'react';
import SneatLayout from '@/Layouts/SneatLayout';
import { Head, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';

export default function ReportsIndex({ units, reportType, filters, reportData, stats }) {
    
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
            const income = stats.income || 0;
            const expenditure = stats.expenditure || 0;
            return (
                <div className="row mb-4">
                    <div className="col-md-4 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <div className="card-title d-flex align-items-start justify-content-between">
                                    <div className="avatar flex-shrink-0">
                                        <span className="avatar-initial rounded bg-label-success"><i className="bx bx-trending-up"></i></span>
                                    </div>
                                </div>
                                <span className="fw-semibold d-block mb-1">Total Income</span>
                                <h4 className="card-title text-success mb-2">{new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(income)}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <div className="card-title d-flex align-items-start justify-content-between">
                                    <div className="avatar flex-shrink-0">
                                        <span className="avatar-initial rounded bg-label-danger"><i className="bx bx-trending-down"></i></span>
                                    </div>
                                </div>
                                <span className="fw-semibold d-block mb-1">Total Expenditure</span>
                                <h4 className="card-title text-danger mb-2">{new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(expenditure)}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <div className="card-title d-flex align-items-start justify-content-between">
                                    <div className="avatar flex-shrink-0">
                                        <span className="avatar-initial rounded bg-label-primary"><i className="bx bx-wallet"></i></span>
                                    </div>
                                </div>
                                <span className="fw-semibold d-block mb-1">Net Balance</span>
                                <h4 className={`card-title mb-2 ${income - expenditure >= 0 ? 'text-primary' : 'text-danger'}`}>{new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(income - expenditure)}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (reportType === 'assets') {
            const totalVal = stats.totalVal || 0;
            return (
                <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <span className="fw-semibold d-block mb-1">Total Assets Registered</span>
                                <h4 className="card-title mb-2">{stats.count || 0}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <span className="fw-semibold d-block mb-1">Total Estimated Value</span>
                                <h4 className="card-title text-success mb-2">{new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(totalVal)}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (reportType === 'members') {
            const active = stats.active || 0;
            return (
                <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <span className="fw-semibold d-block mb-1">Total Members</span>
                                <h4 className="card-title mb-2">{stats.count || 0}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <span className="fw-semibold d-block mb-1">Active Members</span>
                                <h4 className="card-title text-success mb-2">{active}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="row mb-4">
                    <div className="col-12 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <span className="fw-semibold d-block mb-1">Total Affiliated Institutions</span>
                                <h4 className="card-title mb-2">{stats.count || 0}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <SneatLayout>
            <Head title="Reports" />

            {/* Print Stylesheet */}
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    body {
                        background-color: white !important;
                        color: black !important;
                    }
                    /* Hide everything except print sheet */
                    aside, nav, header, .no-print, button, form, .layout-navbar, .layout-menu {
                        display: none !important;
                    }
                    main, .layout-page, .content-wrapper, .container-xxl {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: transparent !important;
                    }
                    .print-sheet {
                        display: block !important;
                        background: white !important;
                        color: black !important;
                        padding: 20px !important;
                        width: 100% !important;
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

            <div className="container-xxl flex-grow-1 container-p-y no-print">
                <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">System /</span> Reports</h4>

                <div className="nav-align-top mb-4">
                    <ul className="nav nav-tabs" role="tablist">
                        {['finance', 'assets', 'institutions', 'members'].map((type) => (
                            <li className="nav-item" key={type}>
                                <button
                                    type="button"
                                    className={`nav-link text-capitalize ${reportType === type ? 'active' : ''}`}
                                    onClick={() => handleTypeChange(type)}
                                >
                                    {type}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="tab-content">
                        <div className="tab-pane fade show active">
                            
                            {/* Filter Settings Form */}
                            <div className="row mb-4 align-items-end">
                                <div className="col-md-3 mb-3 mb-md-0">
                                    <label className="form-label">Organization Unit</label>
                                    <select
                                        value={filters.unit_id || ''}
                                        onChange={e => handleFilterChange('unit_id', e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="">All Units</option>
                                        {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                    </select>
                                </div>

                                {reportType === 'finance' && (
                                    <>
                                        <div className="col-md-3 mb-3 mb-md-0">
                                            <label className="form-label">Start Date</label>
                                            <input
                                                type="date"
                                                value={filters.start_date || ''}
                                                onChange={e => handleFilterChange('start_date', e.target.value)}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="col-md-3 mb-3 mb-md-0">
                                            <label className="form-label">End Date</label>
                                            <input
                                                type="date"
                                                value={filters.end_date || ''}
                                                onChange={e => handleFilterChange('end_date', e.target.value)}
                                                className="form-control"
                                            />
                                        </div>
                                    </>
                                )}
                                
                                <div className="col-md-3">
                                    <button
                                        onClick={printReport}
                                        className="btn btn-primary w-100"
                                    >
                                        <i className="bx bx-printer me-1"></i> Print / Save PDF
                                    </button>
                                </div>
                            </div>

                            {/* Summary Cards */}
                            {getSummary()}

                            {/* Data Table */}
                            <div className="card">
                                <div className="table-responsive text-nowrap">
                                    <table className="table table-hover">
                                        <thead>
                                            {reportType === 'finance' && (
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Type</th>
                                                    <th>Category</th>
                                                    <th>Unit</th>
                                                    <th className="text-end">Amount</th>
                                                </tr>
                                            )}
                                            {reportType === 'assets' && (
                                                <tr>
                                                    <th>Asset Name</th>
                                                    <th>Category</th>
                                                    <th>Owning Unit</th>
                                                    <th>Status</th>
                                                    <th className="text-end">Value</th>
                                                </tr>
                                            )}
                                            {reportType === 'institutions' && (
                                                <tr>
                                                    <th>Institution Name</th>
                                                    <th>Type</th>
                                                    <th>Supervising Unit</th>
                                                    <th>Contact Phone</th>
                                                    <th>Address</th>
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
                                        <tbody className="table-border-bottom-0">
                                            {reportData.data.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="text-center py-4 text-muted">No records found matching filters.</td>
                                                </tr>
                                            ) : (
                                                reportData.data.map((row) => (
                                                    <tr key={row.id}>
                                                        {reportType === 'finance' && (
                                                            <>
                                                                <td>{new Date(row.date).toLocaleDateString()}</td>
                                                                <td className="text-capitalize">{row.type}</td>
                                                                <td>{row.category}</td>
                                                                <td><span className="badge bg-label-primary">{row.organization_unit?.name}</span></td>
                                                                <td className={`text-end fw-semibold ${row.type === 'income' ? 'text-success' : 'text-danger'}`}>
                                                                    {row.type === 'income' ? '+' : '-'} {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(row.amount)}
                                                                </td>
                                                            </>
                                                        )}
                                                        {reportType === 'assets' && (
                                                            <>
                                                                <td className="fw-medium">{row.name}</td>
                                                                <td>{row.category}</td>
                                                                <td><span className="badge bg-label-primary">{row.organization_unit?.name}</span></td>
                                                                <td>{row.status}</td>
                                                                <td className="text-end fw-semibold text-success">
                                                                    {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(row.value)}
                                                                </td>
                                                            </>
                                                        )}
                                                        {reportType === 'institutions' && (
                                                            <>
                                                                <td className="fw-medium">{row.name}</td>
                                                                <td>{row.type}</td>
                                                                <td><span className="badge bg-label-primary">{row.organization_unit?.name}</span></td>
                                                                <td>{row.contact_phone || 'N/A'}</td>
                                                                <td>{row.address || 'N/A'}</td>
                                                            </>
                                                        )}
                                                        {reportType === 'members' && (
                                                            <>
                                                                <td className="fw-medium">{row.first_name} {row.last_name}</td>
                                                                <td>
                                                                    {row.role 
                                                                        ? <span className="badge bg-label-info">{row.role}</span>
                                                                        : <span className="text-muted fst-italic">Not set</span>
                                                                    }
                                                                </td>
                                                                <td><span className="badge bg-label-primary">{row.organization_unit?.name}</span></td>
                                                                <td>{row.gender || '-'}</td>
                                                                <td>{row.phone_number || '-'}</td>
                                                                <td>
                                                                    <span className={`badge ${row.status === 'active' ? 'bg-label-success' : 'bg-label-danger'}`}>
                                                                        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                                                                    </span>
                                                                </td>
                                                            </>
                                                        )}
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {reportData.links && <Pagination links={reportData.links} />}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Offline Printable Sheet (Only visible to browser printer) */}
            <div className="hidden print-sheet d-none">
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
                        {reportData.data.map((row) => (
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
        </SneatLayout>
    );
}
