import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import FormDialog from '@/Components/FormDialog';
import { PlusIcon, PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function PeopleIndex({ users, roles, units }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState('add');

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        id: '',
        name: '',
        email: '',
        password: '',
        assignments: [] // Array of { role_id, organization_unit_id }
    });

    const openAddDialog = () => {
        clearErrors();
        setDialogMode('add');
        setData({ id: '', name: '', email: '', password: '', assignments: [] });
        setIsDialogOpen(true);
    };

    const openEditDialog = (e, row) => {
        e.stopPropagation();
        clearErrors();
        setDialogMode('edit');
        setData({
            id: row.id,
            name: row.name,
            email: row.email,
            password: '', // Leave blank unless they want to change it
            assignments: row.role_assignments.map(a => ({
                role_id: a.role_id,
                organization_unit_id: a.organization_unit_id
            }))
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('people.destroy', id), { preserveScroll: true });
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
            post(route('people.store'), options);
        } else {
            put(route('people.update', data.id), options);
        }
    };

    const addAssignment = () => {
        setData('assignments', [
            ...data.assignments, 
            { role_id: roles[0]?.id || '', organization_unit_id: units[0]?.id || '' }
        ]);
    };

    const updateAssignment = (index, field, value) => {
        const newAssignments = [...data.assignments];
        newAssignments[index][field] = value;
        setData('assignments', newAssignments);
    };

    const removeAssignment = (index) => {
        const newAssignments = [...data.assignments];
        newAssignments.splice(index, 1);
        setData('assignments', newAssignments);
    };

    const columns = [
        { header: 'Name', accessor: (row) => <span className="font-semibold text-white">{row.name}</span> },
        { header: 'Email', accessor: (row) => <span className="text-gray-300">{row.email}</span> },
        { 
            header: 'Role Assignments', 
            accessor: (row) => (
                <div className="flex flex-col gap-1">
                    {row.role_assignments.length === 0 ? (
                        <span className="text-gray-500 italic text-xs">No assignments</span>
                    ) : (
                        row.role_assignments.map((assignment, idx) => (
                            <span key={idx} className="inline-flex items-center rounded-md bg-purple-400/10 px-2 py-1 text-xs font-medium text-purple-400 ring-1 ring-inset ring-purple-400/30 w-max">
                                {assignment.role?.name} @ {assignment.organization_unit?.name}
                            </span>
                        ))
                    )}
                </div>
            )
        },
        { 
            header: 'Actions', 
            accessor: (row) => (
                row.email !== 'admin@church.org' ? (
                    <div className="flex gap-3">
                        <button onClick={(e) => openEditDialog(e, row)} className="text-gray-400 hover:text-white transition-colors" title="Edit">
                            <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <button onClick={(e) => handleDelete(e, row.id)} className="text-red-400 hover:text-red-300 transition-colors" title="Delete">
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                ) : <span className="text-gray-500 text-xs italic">System Admin</span>
            ) 
        }
    ];

    return (
        <AppLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-200">People</h2>}>
            <Head title="People" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg">
                        <div className="mb-6 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-white">Users Directory</h3>
                                <p className="text-sm text-gray-400 mt-1">Manage user accounts and their organizational roles.</p>
                            </div>
                            <button 
                                onClick={openAddDialog}
                                className="inline-flex items-center gap-x-2 rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-colors"
                            >
                                <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                                Add User
                            </button>
                        </div>
                        
                        <DataTable columns={columns} data={users} />
                    </div>
                </div>
            </div>

            <FormDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title={dialogMode === 'add' ? 'Add User' : 'Edit User'}>
                <form className="space-y-4" onSubmit={submit}>
                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-300">Name</label>
                        <div className="mt-1">
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
                        <label className="block text-sm font-medium leading-6 text-gray-300">Email Address</label>
                        <div className="mt-1">
                            <input 
                                type="email" 
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6" 
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-300">Password {dialogMode === 'edit' && <span className="text-gray-500 text-xs">(Leave blank to keep current)</span>}</label>
                        <div className="mt-1">
                            <input 
                                type="password" 
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6" 
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-medium leading-6 text-gray-300">Role Assignments</label>
                            <button 
                                type="button" 
                                onClick={addAssignment}
                                className="text-xs inline-flex items-center gap-1 text-purple-400 hover:text-purple-300"
                            >
                                <PlusIcon className="h-3 w-3" /> Add Assignment
                            </button>
                        </div>
                        
                        <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                            {data.assignments.length === 0 ? (
                                <p className="text-sm text-gray-500 italic text-center py-2">No roles assigned.</p>
                            ) : (
                                data.assignments.map((assignment, index) => (
                                    <div key={index} className="flex gap-2 items-start bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                                        <div className="flex-1 space-y-2">
                                            <select 
                                                value={assignment.role_id}
                                                onChange={e => updateAssignment(index, 'role_id', e.target.value)}
                                                className="block w-full rounded-md border-0 bg-gray-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 text-xs"
                                            >
                                                <option value="">Select Role</option>
                                                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                            </select>
                                            <select 
                                                value={assignment.organization_unit_id}
                                                onChange={e => updateAssignment(index, 'organization_unit_id', e.target.value)}
                                                className="block w-full rounded-md border-0 bg-gray-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 text-xs"
                                            >
                                                <option value="">Select Organization Unit</option>
                                                {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                            </select>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => removeAssignment(index)}
                                            className="text-red-400 hover:text-red-300 p-1"
                                        >
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                        {/* Show any array validation errors */}
                        {Object.keys(errors).filter(k => k.startsWith('assignments')).length > 0 && (
                            <p className="mt-2 text-sm text-red-500">Please complete all assignment fields correctly.</p>
                        )}
                    </div>

                    <div className="mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="inline-flex w-full justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 sm:col-start-2 disabled:opacity-50 transition-colors" 
                        >
                            {processing ? 'Saving...' : 'Save User'}
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
