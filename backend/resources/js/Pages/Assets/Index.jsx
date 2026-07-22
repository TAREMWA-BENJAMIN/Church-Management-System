import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
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
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 ring-1 ring-orange-500/20">
                        <BriefcaseIcon className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                        <div className="font-semibold text-white">{row.name}</div>
                        <div className="text-xs text-gray-400">{row.category}</div>
                    </div>
                </div>
            ) 
        },
        { 
            header: 'Organization Unit', 
            accessor: (row) => (
                <span className="inline-flex items-center rounded-md bg-purple-400/10 px-2 py-1 text-xs font-medium text-purple-400 ring-1 ring-inset ring-purple-400/30">
                    {row.organization_unit?.name}
                </span>
            )
        },
        { 
            header: 'Value', 
            accessor: (row) => (
                <span className="font-semibold text-green-400">
                    {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(row.value)}
                </span>
            )
        },
        { 
            header: 'Status', 
            accessor: (row) => (
                <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    row.status === 'Active' ? 'bg-green-400/10 text-green-400 ring-green-400/20' : 
                    row.status === 'Maintenance' ? 'bg-yellow-400/10 text-yellow-400 ring-yellow-400/20' : 
                    'bg-gray-400/10 text-gray-400 ring-gray-400/20'
                }`}>
                    {row.status}
                </span>
            )
        },
        { 
            header: 'Actions', 
            accessor: (row) => (
                <div className="flex gap-3">
                    <button onClick={(e) => openEditDialog(e, row)} className="text-gray-400 hover:text-white transition-colors" title="Edit">
                        <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button onClick={(e) => handleDelete(e, row.id)} className="text-red-400 hover:text-red-300 transition-colors" title="Delete">
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            ) 
        }
    ];

    return (
        <AppLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-200">Assets & Inventory</h2>}>
            <Head title="Assets" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    {/* Metrics Dashboard */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-green-500/10 blur-2xl"></div>
                            <dt className="text-sm font-medium text-gray-400 truncate flex items-center gap-2">
                                <CurrencyDollarIcon className="h-4 w-4 text-green-400" /> Total Asset Value
                            </dt>
                            <dd className="mt-2 text-3xl font-semibold tracking-tight text-green-400">
                                {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(totalValue)}
                            </dd>
                        </div>
                        
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-orange-500/10 blur-2xl"></div>
                            <dt className="text-sm font-medium text-gray-400 truncate flex items-center gap-2">
                                <BriefcaseIcon className="h-4 w-4 text-orange-400" /> Registered Assets
                            </dt>
                            <dd className="mt-2 text-3xl font-semibold tracking-tight text-white">
                                {totalAssets}
                            </dd>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl"></div>
                            <dt className="text-sm font-medium text-gray-400 truncate flex items-center gap-2">
                                <BuildingOfficeIcon className="h-4 w-4 text-blue-400" /> Active Assets
                            </dt>
                            <dd className="mt-2 text-3xl font-semibold tracking-tight text-white">
                                {activeAssets}
                            </dd>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-lg">
                        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-white">Asset Registry</h3>
                                <p className="text-sm text-gray-400 mt-1">Track land, buildings, vehicles, and equipment.</p>
                            </div>
                            {units.length > 0 && (
                                <button 
                                    onClick={openAddDialog}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-x-2 rounded-md bg-orange-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 transition-colors"
                                >
                                    <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                                    Register Asset
                                </button>
                            )}
                        </div>
                        
                        <DataTable columns={columns} data={assets} />
                    </div>
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
        </AppLayout>
    );
}
