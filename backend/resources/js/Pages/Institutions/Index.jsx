import React, { useState } from 'react';
import SneatLayout from '@/Layouts/SneatLayout';
import { Head, useForm, router } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import FormDialog from '@/Components/FormDialog';
import { PlusIcon, PencilSquareIcon, TrashIcon, BuildingOffice2Icon, PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function InstitutionsIndex({ institutions, managingUnits, locationUnits, canEditIds, canManage }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState('add');

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        id: '',
        name: '',
        type: 'School', // School, Hospital, Clinic, University, Centre, Publisher, Bookshop, Museum, Other
        organization_unit_id: '',
        geographical_unit_id: '',
        contact_email: '',
        contact_phone: '',
        address: '',
        status: 'Active'
    });

    // Derived metrics
    const totalCount = institutions.length;
    const schoolsCount = institutions.filter(i => i.type === 'School' || i.type === 'University').length;
    const healthCount = institutions.filter(i => i.type === 'Hospital' || i.type === 'Clinic').length;

    const openAddDialog = () => {
        clearErrors();
        setDialogMode('add');
        setData({
            id: '',
            name: '',
            type: 'School',
            organization_unit_id: '',
            geographical_unit_id: '',
            contact_email: '',
            contact_phone: '',
            address: '',
            status: 'Active'
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (e, row) => {
        e.stopPropagation();
        clearErrors();
        setDialogMode('edit');
        setData({
            id: row.id,
            name: row.name,
            type: row.type,
            organization_unit_id: row.organization_unit_id,
            geographical_unit_id: row.geographical_unit_id || '',
            contact_email: row.contact_email || '',
            contact_phone: row.contact_phone || '',
            address: row.address || '',
            status: row.status
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this institution?')) {
            router.delete(route('institutions.destroy', id), { preserveScroll: true });
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                setIsDialogOpen(false);
                reset();
            },
            preserveScroll: true
        };

        if (dialogMode === 'add') {
            post(route('institutions.store'), options);
        } else {
            put(route('institutions.update', data.id), options);
        }
    };

    const columns = [
        {
            header: 'Institution Name',
            accessor: (row) => (
                <div className="d-flex align-items-center gap-3">
                    <div className="avatar">
                        <span className="avatar-initial rounded bg-label-info"><i className="bx bx-building"></i></span>
                    </div>
                    <div>
                        <div className="fw-medium">{row.name}</div>
                        <div className="text-muted small">{row.type}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Supervising Directorate',
            accessor: (row) => (
                <span className="badge bg-label-primary">
                    {row.organization_unit?.name}
                </span>
            )
        },
        {
            header: 'Physical Location (Parish)',
            accessor: (row) => (
                <span className="badge bg-label-success">
                    {row.geographical_unit?.name || 'Not Set'}
                </span>
            )
        },
        {
            header: 'Contact Info',
            accessor: (row) => (
                <div className="d-flex flex-column gap-1 text-muted small">
                    {row.contact_phone && (
                        <div className="d-flex align-items-center gap-1">
                            <i className="bx bx-phone"></i>
                            {row.contact_phone}
                        </div>
                    )}
                    {row.contact_email && (
                        <div className="d-flex align-items-center gap-1">
                            <i className="bx bx-envelope"></i>
                            {row.contact_email}
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Address',
            accessor: (row) => (
                <div className="d-flex align-items-center gap-1 text-muted small">
                    <i className="bx bx-map"></i>
                    <span className="text-truncate" style={{ maxWidth: '200px' }} title={row.address}>{row.address || 'N/A'}</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (row) => (
                <span className={`badge ${
                    row.status === 'Active' 
                        ? 'bg-label-success' 
                        : 'bg-label-danger'
                }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: (row) => {
                const canEdit = canManage && (canEditIds === 'all' || canEditIds.includes(row.organization_unit_id));
                if (!canEdit) {
                    return <span className="small text-muted fst-italic">View Only</span>;
                }
                return (
                    <div className="dropdown">
                        <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                            <i className="bx bx-dots-vertical-rounded"></i>
                        </button>
                        <div className="dropdown-menu">
                            <button className="dropdown-item" onClick={(e) => openEditDialog(e, row)}>
                                <i className="bx bx-edit-alt me-1"></i> Edit
                            </button>
                            <button className="dropdown-item text-danger" onClick={(e) => handleDelete(e, row.id)}>
                                <i className="bx bx-trash me-1"></i> Delete
                            </button>
                        </div>
                    </div>
                );
            }
        }
    ];

    return (
        <SneatLayout>
            <Head title="Institutions" />

            <div className="container-xxl flex-grow-1 container-p-y">
                
                {/* Metrics Cards */}
                <div className="row mb-4">
                    <div className="col-lg-4 col-md-12 col-6 mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <div className="card-title d-flex align-items-start justify-content-between">
                                    <div className="avatar flex-shrink-0">
                                        <span className="avatar-initial rounded bg-label-info"><i className="bx bx-buildings"></i></span>
                                    </div>
                                </div>
                                <span className="fw-semibold d-block mb-1">Total Institutions</span>
                                <h3 className="card-title mb-2 text-info">{totalCount}</h3>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-lg-4 col-md-12 col-6 mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <div className="card-title d-flex align-items-start justify-content-between">
                                    <div className="avatar flex-shrink-0">
                                        <span className="avatar-initial rounded bg-label-primary"><i className="bx bx-book-reader"></i></span>
                                    </div>
                                </div>
                                <span className="fw-semibold d-block mb-1">Schools & Universities</span>
                                <h3 className="card-title mb-2 text-primary">{schoolsCount}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-12 col-6 mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <div className="card-title d-flex align-items-start justify-content-between">
                                    <div className="avatar flex-shrink-0">
                                        <span className="avatar-initial rounded bg-label-success"><i className="bx bx-plus-medical"></i></span>
                                    </div>
                                </div>
                                <span className="fw-semibold d-block mb-1">Hospitals & Clinics</span>
                                <h3 className="card-title mb-2 text-success">{healthCount}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data List */}
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Registered Institutions</h5>
                        {canManage && managingUnits.length > 0 && (
                            <button
                                onClick={openAddDialog}
                                className="btn btn-primary"
                            >
                                <i className="bx bx-plus me-1"></i> Add Institution
                            </button>
                        )}
                    </div>
                    
                    <DataTable columns={columns} data={institutions} />
                </div>
            </div>

            <FormDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title={dialogMode === 'add' ? 'Register Institution' : 'Edit Institution'}>
                <form className="space-y-4" onSubmit={submit}>
                    
                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-300">Institution Name</label>
                        <div className="mt-1">
                            <input 
                                type="text"
                                placeholder="e.g. Mengo Hospital, Ndejje University..."
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-300">Type</label>
                            <div className="mt-1">
                                <select
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                    className="block w-full rounded-md border-0 bg-gray-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                                >
                                    <option value="School">School</option>
                                    <option value="Hospital">Hospital</option>
                                    <option value="Clinic">Clinic</option>
                                    <option value="University">University</option>
                                    <option value="Centre">Centre/Guest House</option>
                                    <option value="Publisher">Publisher/Bookshop</option>
                                    <option value="Museum">Museum</option>
                                    <option value="Other">Other Company/Establishment</option>
                                </select>
                                {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-300">Supervising Directorate (Owner)</label>
                            <div className="mt-1">
                                <select
                                    value={data.organization_unit_id}
                                    onChange={e => setData('organization_unit_id', e.target.value)}
                                    className="block w-full rounded-md border-0 bg-gray-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                                >
                                    <option value="">Select Directorate</option>
                                    {managingUnits.map(u => <option key={u.id} value={u.id}>{u.name} {u.type?.name ? `(${u.type.name})` : ''}</option>)}
                                </select>
                                {errors.organization_unit_id && <p className="mt-1 text-sm text-red-500">{errors.organization_unit_id}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-300">Physical Location (Parish/Diocese)</label>
                            <div className="mt-1">
                                <select
                                    value={data.geographical_unit_id}
                                    onChange={e => setData('geographical_unit_id', e.target.value)}
                                    className="block w-full rounded-md border-0 bg-gray-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                                >
                                    <option value="">Select Location</option>
                                    {locationUnits.map(u => <option key={u.id} value={u.id}>{u.name} {u.type?.name ? `(${u.type.name})` : ''}</option>)}
                                </select>
                                {errors.geographical_unit_id && <p className="mt-1 text-sm text-red-500">{errors.geographical_unit_id}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-300">Contact Email</label>
                            <div className="mt-1">
                                <input 
                                    type="email"
                                    placeholder="e.g. info@mengo.or.ug"
                                    value={data.contact_email}
                                    onChange={e => setData('contact_email', e.target.value)}
                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                                />
                                {errors.contact_email && <p className="mt-1 text-sm text-red-500">{errors.contact_email}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-300">Contact Phone</label>
                            <div className="mt-1">
                                <input 
                                    type="text"
                                    placeholder="e.g. +256..."
                                    value={data.contact_phone}
                                    onChange={e => setData('contact_phone', e.target.value)}
                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                                />
                                {errors.contact_phone && <p className="mt-1 text-sm text-red-500">{errors.contact_phone}</p>}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-300">Address / Location</label>
                        <div className="mt-1">
                            <input 
                                type="text"
                                placeholder="e.g. Mengo Hill Rd, Kampala"
                                value={data.address}
                                onChange={e => setData('address', e.target.value)}
                                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                            />
                            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-300">Status</label>
                        <div className="mt-1">
                            <select
                                value={data.status}
                                onChange={e => setData('status', e.target.value)}
                                className="block w-full rounded-md border-0 bg-gray-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
                        </div>
                    </div>

                    <div className="mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button 
                            type="submit"
                            disabled={processing}
                            className="inline-flex w-full justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 sm:col-start-2 disabled:opacity-50 transition-colors"
                        >
                            {processing ? 'Saving...' : 'Save'}
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
        </SneatLayout>
    );
}
