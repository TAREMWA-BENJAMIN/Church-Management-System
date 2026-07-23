import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import FormDialog from '@/Components/FormDialog';
import { PlusIcon, PencilSquareIcon, TrashIcon, BuildingOffice2Icon, PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function InstitutionsIndex({ institutions, units }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState('add');

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        id: '',
        name: '',
        type: 'School', // School, Hospital, Clinic, University, Centre, Publisher, Bookshop, Museum, Other
        organization_unit_id: '',
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
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20">
                        <BuildingOffice2Icon className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{row.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{row.type}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Supervising Unit',
            accessor: (row) => (
                <span className="inline-flex items-center rounded-md bg-purple-400/10 px-2 py-1 text-xs font-medium text-purple-400 ring-1 ring-inset ring-purple-400/30">
                    {row.organization_unit?.name}
                </span>
            )
        },
        {
            header: 'Contact Info',
            accessor: (row) => (
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                    {row.contact_phone && (
                        <div className="flex items-center gap-1">
                            <PhoneIcon className="h-3.5 w-3.5 text-gray-400" />
                            {row.contact_phone}
                        </div>
                    )}
                    {row.contact_email && (
                        <div className="flex items-center gap-1">
                            <EnvelopeIcon className="h-3.5 w-3.5 text-gray-400" />
                            {row.contact_email}
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Address',
            accessor: (row) => (
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                    <MapPinIcon className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <span className="truncate max-w-[200px]" title={row.address}>{row.address || 'N/A'}</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (row) => (
                <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    row.status === 'Active' 
                        ? 'bg-green-400/10 text-green-400 ring-green-400/20' 
                        : 'bg-red-400/10 text-red-400 ring-red-400/20'
                }`}>
                    {row.status}
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
        <AppLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Church Institutions</h2>}>
            <Head title="Institutions" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    {/* Metrics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg relative overflow-hidden transition-colors duration-200">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-purple-500/10 blur-2xl"></div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Institutions</dt>
                            <dd className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">{totalCount}</dd>
                        </div>
                        
                        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg relative overflow-hidden transition-colors duration-200">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl"></div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Schools & Universities</dt>
                            <dd className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">{schoolsCount}</dd>
                        </div>

                        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg relative overflow-hidden transition-colors duration-200">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-green-500/10 blur-2xl"></div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Hospitals & Clinics</dt>
                            <dd className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">{healthCount}</dd>
                        </div>
                    </div>

                    {/* Data List */}
                    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg transition-colors duration-200">
                        <div className="mb-6 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Registered Institutions</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track all Church-affiliated operations.</p>
                            </div>
                            {units.length > 0 && (
                                <button
                                    onClick={openAddDialog}
                                    className="inline-flex items-center gap-x-2 rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-colors"
                                >
                                    <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                                    Add Institution
                                </button>
                            )}
                        </div>
                        
                        <DataTable columns={columns} data={institutions} />
                    </div>
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
                            <label className="block text-sm font-medium leading-6 text-gray-300">Supervising Unit</label>
                            <div className="mt-1">
                                <select
                                    value={data.organization_unit_id}
                                    onChange={e => setData('organization_unit_id', e.target.value)}
                                    className="block w-full rounded-md border-0 bg-gray-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                                >
                                    <option value="">Select Unit</option>
                                    {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                                {errors.organization_unit_id && <p className="mt-1 text-sm text-red-500">{errors.organization_unit_id}</p>}
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
        </AppLayout>
    );
}
