import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import FormDialog from '@/Components/FormDialog';
import { PlusIcon, PencilSquareIcon, TrashIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, BanknotesIcon } from '@heroicons/react/24/outline';

export default function FinanceIndex({ records, units, institutions }) {
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
    const totalIncome = records.filter(r => r.type === 'income').reduce((sum, r) => sum + parseFloat(r.amount), 0);
    const totalExpenditure = records.filter(r => r.type === 'expenditure').reduce((sum, r) => sum + parseFloat(r.amount), 0);
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
                <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    row.type === 'income' 
                        ? 'bg-green-400/10 text-green-400 ring-green-400/20' 
                        : 'bg-red-400/10 text-red-400 ring-red-400/20'
                }`}>
                    {row.type === 'income' ? <ArrowTrendingUpIcon className="h-3 w-3" /> : <ArrowTrendingDownIcon className="h-3 w-3" />}
                    {row.type.charAt(0).toUpperCase() + row.type.slice(1)}
                </span>
            )
        },
        { 
            header: 'Category', 
            accessor: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.category}</span> 
        },
        { 
            header: 'Organization Unit / Source', 
            accessor: (row) => (
                <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center rounded-md bg-purple-400/10 px-2 py-1 text-xs font-medium text-purple-400 ring-1 ring-inset ring-purple-400/30">
                        {row.organization_unit?.name}
                    </span>
                    {row.institution && (
                        <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30">
                            {row.institution.name}
                        </span>
                    )}
                </div>
            )
        },
        { 
            header: 'Amount', 
            accessor: (row) => (
                <span className={`font-bold ${row.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {row.type === 'income' ? '+' : '-'} {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(row.amount)}
                </span>
            )
        },
        { 
            header: 'Actions', 
            accessor: (row) => (
                <div className="flex gap-3">
                    <button onClick={(e) => openEditDialog(e, row)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors" title="Edit">
                        <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button onClick={(e) => handleDelete(e, row.id)} className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors" title="Delete">
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            ) 
        }
    ];

    return (
        <AppLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Finance & Revenue</h2>}>
            <Head title="Finance" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    {/* Metrics Dashboard */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-lg relative overflow-hidden transition-colors duration-200">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-green-500/10 blur-2xl"></div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 dark:text-green-400 shrink-0" /> Total Income
                            </dt>
                            <dd className="mt-2 text-2xl lg:text-3xl font-semibold tracking-tight text-green-600 dark:text-green-400 break-words">
                                {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(totalIncome)}
                            </dd>
                        </div>
                        
                        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-lg relative overflow-hidden transition-colors duration-200">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-red-500/10 blur-2xl"></div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 dark:text-red-400 shrink-0" /> Total Expenditure
                            </dt>
                            <dd className="mt-2 text-2xl lg:text-3xl font-semibold tracking-tight text-red-600 dark:text-red-400 break-words">
                                {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(totalExpenditure)}
                            </dd>
                        </div>

                        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-lg relative overflow-hidden transition-colors duration-200">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl"></div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                <BanknotesIcon className="h-4 w-4 text-blue-500 dark:text-blue-400 shrink-0" /> Net Balance
                            </dt>
                            <dd className={`mt-2 text-2xl lg:text-3xl font-semibold tracking-tight break-words ${netBalance >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-600 dark:text-red-400'}`}>
                                {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(netBalance)}
                            </dd>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-lg transition-colors duration-200">
                        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Financial Ledger</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track all income and expenditures across the organization.</p>
                            </div>
                            {units.length > 0 && (
                                <button 
                                    onClick={openAddDialog}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-x-2 rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-colors"
                                >
                                    <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                                    Add Transaction
                                </button>
                            )}
                        </div>
                        
                        <DataTable columns={columns} data={records} />
                    </div>
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
        </AppLayout>
    );
}
