import React, { useState } from 'react';
import SneatLayout from '@/Layouts/SneatLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';

export default function DirectoratesIndex({ directorates, totalDirectorates, totalStaff, directorateType, units, canManage }) {
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

    const accentColors = ['primary', 'success', 'info', 'warning', 'danger', 'secondary'];

    return (
        <SneatLayout>
            <Head title="Directorates" />

            <div className="container-xxl flex-grow-1 container-p-y">
                <h4 className="fw-bold py-3 mb-4">
                    <span className="text-muted fw-light">Organization /</span> Directorates
                </h4>

                {/* Summary Cards */}
                <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <div className="card-title d-flex align-items-start justify-content-between">
                                    <div className="avatar flex-shrink-0">
                                        <span className="avatar-initial rounded bg-label-primary">
                                            <i className="bx bx-building-house"></i>
                                        </span>
                                    </div>
                                </div>
                                <span className="fw-semibold d-block mb-1">Total Directorates</span>
                                <h3 className="card-title mb-2">{totalDirectorates}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <div className="card-title d-flex align-items-start justify-content-between">
                                    <div className="avatar flex-shrink-0">
                                        <span className="avatar-initial rounded bg-label-info">
                                            <i className="bx bx-group"></i>
                                        </span>
                                    </div>
                                </div>
                                <span className="fw-semibold d-block mb-1">Assigned Staff</span>
                                <h3 className="card-title mb-2">
                                    {totalStaff}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Directorates Table Card */}
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Directorate Units</h5>
                        {canManage && (
                            <button onClick={openAddDialog} className="btn btn-primary btn-sm">
                                <i className="bx bx-plus me-1"></i> Add Directorate
                            </button>
                        )}
                    </div>

                    {directorates.data.length === 0 ? (
                        <div className="card-body text-center py-5">
                            <i className="bx bx-building-house bx-lg text-muted mb-3 d-block"></i>
                            <p className="text-muted">No directorates found. Add one to get started.</p>
                            {canManage && (
                                <button onClick={openAddDialog} className="btn btn-outline-primary btn-sm mt-2">
                                    <i className="bx bx-plus me-1"></i> Add Directorate
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="table-responsive text-nowrap">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Directorate Name</th>
                                        <th>Reports To</th>
                                        <th>Assigned Staff</th>
                                        {canManage && <th className="text-end">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody className="table-border-bottom-0">
                                    {directorates.data.map((dir, index) => (
                                        <tr key={dir.id}>
                                            <td>
                                                <span className={`avatar-initial rounded bg-label-${accentColors[index % accentColors.length]}`}
                                                    style={{ width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                                                    <i className="bx bx-building-house"></i>
                                                </span>
                                            </td>
                                            <td className="fw-medium">{dir.name}</td>
                                            <td>
                                                {dir.parent?.name
                                                    ? <span className="badge bg-label-secondary">{dir.parent.name}</span>
                                                    : <span className="badge bg-label-primary">Top Level</span>
                                                }
                                            </td>
                                            <td>
                                                <span className="badge bg-label-info">
                                                    <i className="bx bx-user me-1"></i>
                                                    {dir.role_assignments?.length || 0} staff
                                                </span>
                                            </td>
                                            {canManage && (
                                                <td className="text-end">
                                                    <Link
                                                        href={route('organization.index')}
                                                        className="btn btn-sm btn-outline-primary"
                                                    >
                                                        <i className="bx bx-cog me-1"></i> Manage
                                                    </Link>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    
                    {directorates.links && <Pagination links={directorates.links} />}
                </div>
            </div>

            {/* Add Directorate Modal */}
            {isDialogOpen && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New Directorate</h5>
                                <button type="button" className="btn-close" onClick={() => setIsDialogOpen(false)}></button>
                            </div>
                            <form onSubmit={submit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Directorate Name <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            placeholder="Enter directorate name"
                                        />
                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Reports To (Parent Unit)</label>
                                        <select
                                            className={`form-select ${errors.parent_id ? 'is-invalid' : ''}`}
                                            value={data.parent_id}
                                            onChange={e => setData('parent_id', e.target.value)}
                                        >
                                            <option value="">None (Top Level)</option>
                                            {units.map(u => (
                                                <option key={u.id} value={u.id}>{u.name}</option>
                                            ))}
                                        </select>
                                        {errors.parent_id && <div className="invalid-feedback">{errors.parent_id}</div>}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={processing}>
                                        {processing ? (
                                            <><span className="spinner-border spinner-border-sm me-1"></span> Saving...</>
                                        ) : (
                                            <><i className="bx bx-save me-1"></i> Save Directorate</>
                                        )}
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
