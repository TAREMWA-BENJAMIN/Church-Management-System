import React, { useState } from 'react';
import SneatLayout from '@/Layouts/SneatLayout';
import { Head, useForm, router } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import FormDialog from '@/Components/FormDialog';
import { PlusIcon, PencilSquareIcon, TrashIcon, BriefcaseIcon, BuildingOfficeIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function AssetsIndex({ assets, units }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState('add');

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        id: '',
        organization_unit_id: '',
        name: '',
        category: '',
        description: '',
        acquisition_date: '',
        value: '',
        status: 'Active'
    });

    const totalValue = assets.reduce((sum, asset) => sum + parseFloat(asset.value || 0), 0);
    const totalAssets = assets.length;
    const activeAssets = assets.filter(a => a.status === 'Active').length;

    const openAddDialog = () => {
        clearErrors();
        setDialogMode('add');
        setData({ 
            id: '', 
            organization_unit_id: '', 
            name: '', 
            category: '', 
            description: '', 
            acquisition_date: '', 
            value: '', 
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
            organization_unit_id: row.organization_unit_id,
            name: row.name,
            category: row.category,
            description: row.description || '',
            acquisition_date: row.acquisition_date || '',
            value: row.value,
            status: row.status
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to remove this asset from the registry?')) {
            router.delete(route('assets.destroy', id), { preserveScroll: true });
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
            post(route('assets.store'), options);
        } else {
            put(route('assets.update', data.id), options);
        }
    };

    const columns = [
        { 
            header: 'Asset Name', 
            accessor: (row) => (
                <div className="d-flex align-items-center gap-3">
                    <div className="avatar">
                        <span className="avatar-initial rounded bg-label-warning"><i className="bx bx-briefcase"></i></span>
                    </div>
                    <div>
                        <div className="fw-medium">{row.name}</div>
                        <div className="text-muted small">{row.category}</div>
                    </div>
                </div>
            ) 
        },
        { 
            header: 'Organization Unit', 
            accessor: (row) => (
                <span className="badge bg-label-primary">
                    {row.organization_unit?.name}
                </span>
            )
        },
        { 
            header: 'Value', 
            accessor: (row) => (
                <span className="fw-medium text-success">
                    {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(row.value)}
                </span>
            )
        },
        { 
            header: 'Status', 
            accessor: (row) => (
                <span className={`badge ${
                    row.status === 'Active' ? 'bg-label-success' : 
                    row.status === 'Maintenance' ? 'bg-label-warning' : 
                    'bg-label-secondary'
                }`}>
                    {row.status}
                </span>
            )
        },
        { 
            header: 'Actions', 
            accessor: (row) => (
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
            ) 
        }
    ];

    return (
        <SneatLayout>
            <Head title="Assets" />

            <div className="container-xxl flex-grow-1 container-p-y">
                
                {/* Metrics Dashboard */}
                <div className="row mb-4">
                    <div className="col-lg-6 col-md-12 col-6 mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <div className="card-title d-flex align-items-start justify-content-between">
                                    <div className="avatar flex-shrink-0">
                                        <span className="avatar-initial rounded bg-label-info"><i className="bx bx-briefcase"></i></span>
                                    </div>
                                </div>
                                <span className="fw-semibold d-block mb-1">Total Assets</span>
                                <h3 className="card-title mb-2 text-info">
                                    {totalAssets}
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12 col-6 mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <div className="card-title d-flex align-items-start justify-content-between">
                                    <div className="avatar flex-shrink-0">
                                        <span className="avatar-initial rounded bg-label-success"><i className="bx bx-money"></i></span>
                                    </div>
                                </div>
                                <span className="fw-semibold d-block mb-1">Total Estimated Value</span>
                                <h3 className="card-title mb-2 text-success">
                                    {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(totalValue)}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Assets</h5>
                        {units.length > 0 && (
                            <button 
                                onClick={openAddDialog}
                                className="btn btn-primary"
                            >
                                <i className="bx bx-plus me-1"></i> Register Asset
                            </button>
                        )}
                    </div>
                    
                    <DataTable columns={columns} data={assets} />
                </div>
            </div>

            <FormDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title={dialogMode === 'add' ? 'Register Asset' : 'Edit Asset'}>
                <form className="space-y-4" onSubmit={submit}>
                    
                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-300">Asset Name / Title</label>
                        <div className="mt-1">
                            <input 
                                type="text" 
                                placeholder="e.g. St. Paul Cathedral Land, Toyota Hilux..."
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6" 
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-300">Category</label>
                            <div className="mt-1">
                                <input 
                                    type="text" 
                                    placeholder="e.g. Land, Vehicle, Building..."
                                    value={data.category}
                                    onChange={e => setData('category', e.target.value)}
                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6" 
                                />
                                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-300">Estimated Value (UGX)</label>
                            <div className="mt-1">
                                <input 
                                    type="number" 
                                    step="0.01"
                                    min="0"
                                    value={data.value}
                                    onChange={e => setData('value', e.target.value)}
                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6" 
                                />
                                {errors.value && <p className="mt-1 text-sm text-red-500">{errors.value}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-300">Organization Unit (Owner)</label>
                            <div className="mt-1">
                                <select 
                                    value={data.organization_unit_id}
                                    onChange={e => setData('organization_unit_id', e.target.value)}
                                    className="block w-full rounded-md border-0 bg-gray-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6"
                                >
                                    <option value="">Select Unit</option>
                                    {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                                {errors.organization_unit_id && <p className="mt-1 text-sm text-red-500">{errors.organization_unit_id}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-300">Status</label>
                            <div className="mt-1">
                                <select 
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    className="block w-full rounded-md border-0 bg-gray-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Disposed">Disposed</option>
                                </select>
                                {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-300">Acquisition Date (Optional)</label>
                        <div className="mt-1">
                            <input 
                                type="date" 
                                value={data.acquisition_date}
                                onChange={e => setData('acquisition_date', e.target.value)}
                                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6 [color-scheme:dark]" 
                            />
                            {errors.acquisition_date && <p className="mt-1 text-sm text-red-500">{errors.acquisition_date}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-300">Description / Details (Optional)</label>
                        <div className="mt-1">
                            <textarea 
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                rows={3}
                                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6" 
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                        </div>
                    </div>

                    <div className="mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="inline-flex w-full justify-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 sm:col-start-2 disabled:opacity-50 transition-colors" 
                        >
                            {processing ? 'Saving...' : 'Save Asset'}
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
