import React, { useState } from 'react';
import SneatLayout from '@/Layouts/SneatLayout';
import { Head, useForm, router } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import FormDialog from '@/Components/FormDialog';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function MembersIndex({ members, units }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState('add');

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        id: '',
        organization_unit_id: '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        phone_number: '',
        status: 'active',
        role: ''
    });

    const openAddDialog = () => {
        clearErrors();
        setDialogMode('add');
        setData({ 
            id: '', 
            organization_unit_id: '', 
            first_name: '', 
            last_name: '', 
            date_of_birth: '', 
            gender: '', 
            phone_number: '', 
            status: 'active',
            role: ''
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
            first_name: row.first_name,
            last_name: row.last_name,
            date_of_birth: row.date_of_birth || '',
            gender: row.gender || '',
            phone_number: row.phone_number || '',
            status: row.status,
            role: row.role || ''
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this member?')) {
            router.delete(route('members.destroy', id), { preserveScroll: true });
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
            post(route('members.store'), options);
        } else {
            put(route('members.update', data.id), options);
        }
    };

    const columns = [
        { header: 'First Name', accessor: (row) => <span className="fw-medium">{row.first_name}</span> },
        { header: 'Last Name', accessor: (row) => <span>{row.last_name}</span> },
        { 
            header: 'Role / Position', 
            accessor: (row) => row.role 
                ? <span className="badge bg-label-info">{row.role}</span>
                : <span className="text-muted fst-italic">Not set</span>
        },
        { header: 'Gender', accessor: (row) => <span>{row.gender || '-'}</span> },
        { header: 'Phone', accessor: (row) => <span>{row.phone_number || '-'}</span> },
        { 
            header: 'Organization', 
            accessor: (row) => (
                <span className="badge bg-label-primary">
                    {row.organization_unit?.name}
                </span>
            )
        },
        { 
            header: 'Status', 
            accessor: (row) => (
                <span className={`badge ${row.status === 'active' ? 'bg-label-success' : 'bg-label-danger'}`}>
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
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
            <Head title="Members" />

            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Members</h5>
                        <button 
                            onClick={openAddDialog}
                            className="btn btn-primary"
                        >
                            <i className="bx bx-plus me-1"></i> Add Member
                        </button>
                    </div>
                    
                    <DataTable columns={columns} data={members} />
                </div>
            </div>

            <FormDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title={dialogMode === 'add' ? 'Add Member' : 'Edit Member'}>
                <form className="space-y-4" onSubmit={submit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-300">First Name</label>
                            <div className="mt-1">
                                <input 
                                    type="text" 
                                    value={data.first_name}
                                    onChange={e => setData('first_name', e.target.value)}
                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6" 
                                />
                                {errors.first_name && <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-300">Last Name</label>
                            <div className="mt-1">
                                <input 
                                    type="text" 
                                    value={data.last_name}
                                    onChange={e => setData('last_name', e.target.value)}
                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6" 
                                />
                                {errors.last_name && <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-300">Date of Birth</label>
                            <div className="mt-1">
                                <input 
                                    type="date" 
                                    value={data.date_of_birth}
                                    onChange={e => setData('date_of_birth', e.target.value)}
                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 [color-scheme:dark]" 
                                />
                                {errors.date_of_birth && <p className="mt-1 text-sm text-red-500">{errors.date_of_birth}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-300">Gender</label>
                            <div className="mt-1">
                                <select 
                                    value={data.gender}
                                    onChange={e => setData('gender', e.target.value)}
                                    className="block w-full rounded-md border-0 bg-gray-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-300">Phone Number</label>
                        <div className="mt-1">
                            <input 
                                type="text" 
                                value={data.phone_number}
                                onChange={e => setData('phone_number', e.target.value)}
                                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6" 
                            />
                            {errors.phone_number && <p className="mt-1 text-sm text-red-500">{errors.phone_number}</p>}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-700">
                        <label className="block text-sm font-medium leading-6 text-gray-300">Assign to Organization Unit (Parish, Cell, etc.)</label>
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

                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-300">Role / Position <span className="text-gray-500 font-normal">(e.g. Headmaster, Teacher, Nurse)</span></label>
                        <div className="mt-1">
                            <input 
                                type="text" 
                                placeholder="e.g. Headmaster, Teacher, Nurse..."
                                value={data.role}
                                onChange={e => setData('role', e.target.value)}
                                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 placeholder:text-gray-500" 
                            />
                            {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
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
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
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
                            {processing ? 'Saving...' : 'Save Member'}
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
