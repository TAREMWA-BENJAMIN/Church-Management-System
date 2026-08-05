import React, { useState } from 'react';
import SneatLayout from '@/Layouts/SneatLayout';
import { Head, useForm, router } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import FormDialog from '@/Components/FormDialog';
import { PlusIcon, PencilSquareIcon, TrashIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, BanknotesIcon } from '@heroicons/react/24/outline';

export default function FinanceIndex({ records, totalIncome, totalExpenditure, units, institutions }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState('add');

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        id: '',
        organization_unit_id: '',
        institution_id: '',
        type: 'income',
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    // Calculate metrics
    const netBalance = totalIncome - totalExpenditure;

    const openAddDialog = () => {
        clearErrors();
        setDialogMode('add');
        setData({ 
            id: '', 
            organization_unit_id: '', 
            institution_id: '',
            type: 'income', 
            category: '', 
            amount: '', 
            description: '', 
            date: new Date().toISOString().split('T')[0]
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
            institution_id: row.institution_id || '',
            type: row.type,
            category: row.category,
            amount: row.amount,
            description: row.description || '',
            date: row.date ? new Date(row.date).toISOString().split('T')[0] : ''
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this transaction?')) {
            router.delete(route('finance.destroy', id), { preserveScroll: true });
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
            post(route('finance.store'), options);
        } else {
            put(route('finance.update', data.id), options);
        }
    };

    const columns = [
        { 
            header: 'Date', 
            accessor: (row) => <span className="text-gray-600 dark:text-gray-300">{new Date(row.date).toLocaleDateString()}</span> 
        },
        { 
            header: 'Type', 
            accessor: (row) => (
                <span className={`badge ${row.type === 'income' ? 'bg-label-success' : 'bg-label-danger'}`}>
                    <i className={`bx ${row.type === 'income' ? 'bx-trending-up' : 'bx-trending-down'} me-1`}></i>
                    {row.type.charAt(0).toUpperCase() + row.type.slice(1)}
                </span>
            )
        },
        { 
            header: 'Category', 
            accessor: (row) => <span className="fw-medium">{row.category}</span> 
        },
        { 
            header: 'Organization Unit / Source', 
            accessor: (row) => (
                <div className="d-flex flex-column gap-1">
                    <span className="badge bg-label-primary w-100 text-start">
                        {row.organization_unit?.name}
                    </span>
                    {row.institution && (
                        <span className="badge bg-label-info w-100 text-start">
                            {row.institution.name}
                        </span>
                    )}
                </div>
            )
        },
        { 
            header: 'Amount', 
            accessor: (row) => (
                <span className={`fw-bold ${row.type === 'income' ? 'text-success' : 'text-danger'}`}>
                    {row.type === 'income' ? '+' : '-'} {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(row.amount)}
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
            <Head title="Finance" />

            <div className="container-xxl flex-grow-1 container-p-y">
                
                {/* Metrics Dashboard */}
                <div className="row mb-4">
                    <div className="col-lg-4 col-md-12 col-6 mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <div className="card-title d-flex align-items-start justify-content-between">
                                    <div className="avatar flex-shrink-0">
                                        <span className="avatar-initial rounded bg-label-success"><i className="bx bx-trending-up"></i></span>
                                    </div>
                                </div>
                                <span className="fw-semibold d-block mb-1">Total Income</span>
                                <h3 className="card-title mb-2 text-success">
                                    {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(totalIncome)}
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-12 col-6 mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <div className="card-title d-flex align-items-start justify-content-between">
                                    <div className="avatar flex-shrink-0">
                                        <span className="avatar-initial rounded bg-label-danger"><i className="bx bx-trending-down"></i></span>
                                    </div>
                                </div>
                                <span className="fw-semibold d-block mb-1">Total Expenditure</span>
                                <h3 className="card-title mb-2 text-danger">
                                    {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(totalExpenditure)}
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-12 col-6 mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <div className="card-title d-flex align-items-start justify-content-between">
                                    <div className="avatar flex-shrink-0">
                                        <span className="avatar-initial rounded bg-label-primary"><i className="bx bx-wallet"></i></span>
                                    </div>
                                </div>
                                <span className="fw-semibold d-block mb-1">Net Balance</span>
                                <h3 className="card-title mb-2 text-primary">
                                    {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(netBalance)}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Transactions</h5>
                        {units.length > 0 && (
                            <button 
                                onClick={openAddDialog}
                                className="btn btn-primary"
                            >
                                <i className="bx bx-plus me-1"></i> Add Transaction
                            </button>
                        )}
                    </div>
                    
                    <DataTable columns={columns} data={records} />
                </div>
            </div>

            <FormDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title={dialogMode === 'add' ? 'Record Transaction' : 'Edit Transaction'}>
                <form className="space-y-4" onSubmit={submit}>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-300">Transaction Type</label>
                            <div className="mt-1">
                                <select 
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                    className="block w-full rounded-md border-0 bg-gray-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                                >
                                    <option value="income">Income</option>
                                    <option value="expenditure">Expenditure</option>
                                </select>
                                {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-300">Date</label>
                            <div className="mt-1">
                                <input 
                                    type="date" 
                                    value={data.date}
                                    onChange={e => setData('date', e.target.value)}
                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 [color-scheme:dark]" 
                                />
                                {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-300">Category</label>
                            <div className="mt-1">
                                <input 
                                    type="text" 
                                    placeholder="e.g. Tithe, Salary, Grant..."
                                    value={data.category}
                                    onChange={e => setData('category', e.target.value)}
                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6" 
                                />
                                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-300">Amount (UGX)</label>
                            <div className="mt-1">
                                <input 
                                    type="number" 
                                    step="0.01"
                                    min="0"
                                    value={data.amount}
                                    onChange={e => setData('amount', e.target.value)}
                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6" 
                                />
                                {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-300">Organization Unit (Directorate)</label>
                            <div className="mt-1">
                                <select 
                                    value={data.organization_unit_id}
                                    onChange={e => setData('organization_unit_id', e.target.value)}
                                    className="block w-full rounded-md border-0 bg-gray-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                                >
                                    <option value="">Select Unit</option>
                                    {units.map(u => <option key={u.id} value={u.id}>{u.name} {u.type?.name ? `(${u.type.name})` : ''}</option>)}
                                </select>
                                {errors.organization_unit_id && <p className="mt-1 text-sm text-red-500">{errors.organization_unit_id}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-300">Institution Source (Optional)</label>
                            <div className="mt-1">
                                <select 
                                    value={data.institution_id}
                                    onChange={e => setData('institution_id', e.target.value)}
                                    className="block w-full rounded-md border-0 bg-gray-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                                >
                                    <option value="">None / General</option>
                                    {institutions.filter(i => !data.organization_unit_id || i.organization_unit_id == data.organization_unit_id).map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                </select>
                                {errors.institution_id && <p className="mt-1 text-sm text-red-500">{errors.institution_id}</p>}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-300">Description (Optional)</label>
                        <div className="mt-1">
                            <textarea 
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                rows={3}
                                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6" 
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                        </div>
                    </div>

                    <div className="mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="inline-flex w-full justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 sm:col-start-2 disabled:opacity-50 transition-colors" 
                        >
                            {processing ? 'Saving...' : 'Save Transaction'}
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
