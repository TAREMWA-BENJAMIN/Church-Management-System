import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import FormDialog from '@/Components/FormDialog';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function RolesIndex({ roles, permissions }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState('add');

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        id: '',
        name: '',
        permissions: []
    });

    const openAddDialog = () => {
        clearErrors();
        setDialogMode('add');
        setData({ id: '', name: '', permissions: [] });
        setIsDialogOpen(true);
    };

    const openEditDialog = (e, row) => {
        e.stopPropagation();
        clearErrors();
        setDialogMode('edit');
        setData({
            id: row.id,
            name: row.name,
            permissions: row.permissions.map(p => p.name)
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this role? Users assigned to this role may lose access.')) {
            router.delete(route('roles.destroy', id), { preserveScroll: true });
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
            post(route('roles.store'), options);
        } else {
            put(route('roles.update', data.id), options);
        }
    };

    const togglePermission = (permName) => {
        if (data.permissions.includes(permName)) {
            setData('permissions', data.permissions.filter(p => p !== permName));
        } else {
            setData('permissions', [...data.permissions, permName]);
        }
    };

    const columns = [
        { header: 'Role Name', accessor: (row) => <span className="font-semibold text-white">{row.name}</span> },
        { 
            header: 'Permissions Assigned', 
            accessor: (row) => (
                <span className="text-gray-400">
                    {row.name === 'Super Admin' ? 'All Permissions' : `${row.permissions.length} permissions`}
                </span>
            )
        },
        { 
            header: 'Actions', 
            accessor: (row) => (
                row.name !== 'Super Admin' ? (
                    <div className="flex gap-3">
                        <button onClick={(e) => openEditDialog(e, row)} className="text-gray-400 hover:text-white transition-colors" title="Edit">
                            <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <button onClick={(e) => handleDelete(e, row.id)} className="text-red-400 hover:text-red-300 transition-colors" title="Delete">
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                ) : <span className="text-gray-500 text-xs italic">System Role</span>
            ) 
        }
    ];

    return (
        <AppLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-200">Roles & Permissions</h2>}>
            <Head title="Roles" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg">
                        <div className="mb-6 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-white">System Roles</h3>
                                <p className="text-sm text-gray-400 mt-1">Manage functionary roles and their access levels.</p>
                            </div>
                            <button 
                                onClick={openAddDialog}
                                className="inline-flex items-center gap-x-2 rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-colors"
                            >
                                <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                                Add Role
                            </button>
                        </div>
                        
                        <DataTable columns={columns} data={roles} />
                    </div>
                </div>
            </div>

            <FormDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title={dialogMode === 'add' ? 'Add Role' : 'Edit Role'}>
                <form className="space-y-6" onSubmit={submit}>
                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-300">Role Name (e.g. Bishop, Treasurer)</label>
                        <div className="mt-2">
                            <input 
                                type="text" 
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6" 
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-300 mb-2">Permissions</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                            {permissions.map((perm) => (
                                <div key={perm.id} className="relative flex items-start">
                                    <div className="flex h-6 items-center">
                                        <input
                                            id={`perm-${perm.id}`}
                                            type="checkbox"
                                            checked={data.permissions.includes(perm.name)}
                                            onChange={() => togglePermission(perm.name)}
                                            className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-600 focus:ring-offset-gray-900"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm leading-6">
                                        <label htmlFor={`perm-${perm.id}`} className="font-medium text-gray-300 capitalize cursor-pointer">
                                            {perm.name.replace('_', ' ')}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {errors.permissions && <p className="mt-1 text-sm text-red-500">{errors.permissions}</p>}
                    </div>

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="inline-flex w-full justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 sm:col-start-2 disabled:opacity-50 transition-colors" 
                        >
                            {processing ? 'Saving...' : 'Save Role'}
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
