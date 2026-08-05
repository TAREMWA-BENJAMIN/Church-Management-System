import React, { useState } from 'react';
import SneatLayout from '@/Layouts/SneatLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { PlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import DataTable from '@/Components/DataTable';
import FormDialog from '@/Components/FormDialog';

export default function CertificatesIndex({ certificates }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { props } = usePage();
    const user = props.auth.user;

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        type: 'Marriage',
        recipient_name: '',
        issued_date: new Date().toISOString().split('T')[0],
        organization_unit_id: '',
        details_parents: '',
        details_sponsors: ''
    });

    const submit = (e) => {
        e.preventDefault();
        
        const payload = {
            ...data,
            details: {
                parents: data.details_parents,
                sponsors: data.details_sponsors
            }
        };

        post(route('certificates.store'), {
            data: payload,
            onSuccess: () => {
                setIsDialogOpen(false);
                reset();
            }
        });
    };

    const columns = [
        { header: 'Cert No.', accessor: (row) => <span className="font-monospace text-muted small">{row.certificate_number}</span> },
        { header: 'Recipient Name', accessor: (row) => <span className="fw-medium">{row.recipient_name}</span> },
        { 
            header: 'Type', 
            accessor: (row) => (
                <span className={`badge ${
                    row.type === 'Marriage' ? 'bg-label-info' :
                    row.type === 'Baptism' ? 'bg-label-primary' :
                    'bg-label-success'
                }`}>{row.type}</span>
            )
        },
        { header: 'Issued Date', accessor: (row) => <span className="text-muted">{new Date(row.issued_date).toLocaleDateString()}</span> },
        { header: 'Parish', accessor: (row) => <span>{row.organization_unit?.name || 'Unknown'}</span> },
        {
            header: 'Actions',
            accessor: (row) => (
                <div className="dropdown">
                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                        <i className="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div className="dropdown-menu">
                        <a className="dropdown-item" href={route('certificates.download', row.id)} target="_blank">
                            <i className="bx bx-download me-1"></i> Download PDF
                        </a>
                    </div>
                </div>
            )
        }
    ];


    return (
        <SneatLayout>
            <Head title="Certificates" />

            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <div>
                            <h5 className="mb-0">Certificates</h5>
                            <small className="text-muted">Manage and generate official certificates for Marriage, Baptism, and Confirmation.</small>
                        </div>
                        <button
                            onClick={() => { clearErrors(); reset(); setIsDialogOpen(true); }}
                            className="btn btn-primary"
                        >
                            <i className="bx bx-plus me-1"></i> Generate Certificate
                        </button>
                    </div>

                    <DataTable 
                        data={certificates} 
                        columns={columns} 
                    />
                </div>
            </div>

            <FormDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title="Generate New Certificate">
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Certificate Type</label>
                        <select 
                            value={data.type}
                            onChange={e => setData('type', e.target.value)}
                            className="mt-1 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500"
                        >
                            <option value="Marriage">Marriage</option>
                            <option value="Baptism">Baptism</option>
                            <option value="Confirmation">Confirmation</option>
                        </select>
                        {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">Recipient Name(s)</label>
                        <input 
                            type="text" 
                            placeholder={data.type === 'Marriage' ? "e.g. John Doe & Jane Smith" : "e.g. John Doe"}
                            value={data.recipient_name}
                            onChange={e => setData('recipient_name', e.target.value)}
                            className="mt-1 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500" 
                        />
                        {errors.recipient_name && <p className="mt-1 text-sm text-red-500">{errors.recipient_name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">Issued Date</label>
                        <input 
                            type="date" 
                            value={data.issued_date}
                            onChange={e => setData('issued_date', e.target.value)}
                            className="mt-1 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500" 
                        />
                        {errors.issued_date && <p className="mt-1 text-sm text-red-500">{errors.issued_date}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">Parish ID (Your Parish)</label>
                        <input 
                            type="number" 
                            placeholder="Enter Parish ID"
                            value={data.organization_unit_id}
                            onChange={e => setData('organization_unit_id', e.target.value)}
                            className="mt-1 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500" 
                        />
                        <p className="text-xs text-gray-500 mt-1">Note: Typically this would be a dropdown of your assigned parishes, using an ID for now.</p>
                        {errors.organization_unit_id && <p className="mt-1 text-sm text-red-500">{errors.organization_unit_id}</p>}
                    </div>

                    <div className="pt-2 border-t border-white/10">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Additional Details</label>
                        <div className="space-y-3">
                            <input 
                                type="text" 
                                placeholder="Parents Names (Optional)"
                                value={data.details_parents}
                                onChange={e => setData('details_parents', e.target.value)}
                                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500" 
                            />
                            <input 
                                type="text" 
                                placeholder="Sponsors/Godparents (Optional)"
                                value={data.details_sponsors}
                                onChange={e => setData('details_sponsors', e.target.value)}
                                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500" 
                            />
                        </div>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="inline-flex w-full justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 sm:col-start-2 disabled:opacity-50" 
                        >
                            {processing ? 'Generating...' : 'Generate Certificate'}
                        </button>
                        <button 
                            type="button" 
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/20 hover:bg-white/20 sm:col-start-1 sm:mt-0" 
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
