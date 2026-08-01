import React, { useState, useMemo } from 'react';
import SneatLayout from '@/Layouts/SneatLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Tree } from 'react-arborist';
import DataTable from '@/Components/DataTable';
import { FolderIcon, DocumentIcon, PlusIcon, PencilSquareIcon, TrashIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import FormDialog from '@/Components/FormDialog';

export default function OrganizationIndex({ units, types, canManage }) {
    const [selectedUnitId, setSelectedUnitId] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        id: '',
        name: '',
        organization_unit_type_id: types.length > 0 ? types[0].id : '',
        parent_id: selectedUnitId || ''
    });

    // Build hierarchical tree data for react-arborist
    const treeData = useMemo(() => {
        const map = {};
        const roots = [];

        units.forEach(unit => {
            map[unit.id] = { ...unit, id: String(unit.id), children: [] };
        });

        units.forEach(unit => {
            if (unit.parent_id && map[unit.parent_id]) {
                map[unit.parent_id].children.push(map[unit.id]);
            } else {
                roots.push(map[unit.id]);
            }
        });
        
        // Remove empty children arrays so they are treated as leaf nodes
        Object.values(map).forEach(node => {
            if (node.children.length === 0) {
                delete node.children;
            }
        });

        return roots;
    }, [units]);

    const currentChildren = useMemo(() => {
        if (!selectedUnitId) return treeData;
        const unit = units.find(u => String(u.id) === String(selectedUnitId));
        if (!unit) return treeData;
        return units.filter(u => String(u.parent_id) === String(selectedUnitId));
    }, [selectedUnitId, units, treeData]);

    const selectedUnitName = useMemo(() => {
        if (!selectedUnitId) return "Root (Church of Uganda)";
        return units.find(u => String(u.id) === String(selectedUnitId))?.name || "Unknown";
    }, [selectedUnitId, units]);

    const Node = ({ node, style, dragHandle }) => {
        return (
            <div 
                style={style} 
                ref={dragHandle} 
                className={`flex items-center gap-1 transition-colors px-1 py-1 rounded-md ${node.isSelected ? 'bg-purple-100 text-purple-900 dark:bg-purple-900/50 dark:text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
            >
                {/* Expand/Collapse Caret */}
                <div 
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!node.isLeaf) {
                            node.toggle();
                        }
                    }}
                    className={`cursor-pointer p-0.5 rounded hover:bg-white/10 ${node.isLeaf ? 'invisible' : ''}`}
                >
                    {node.isOpen ? (
                        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    ) : (
                        <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                    )}
                </div>

                {/* Folder/Document Icon & Name */}
                <div 
                    className="flex items-center gap-2 cursor-pointer flex-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        node.toggleSelected();
                        setSelectedUnitId(node.data.id);
                    }}
                >
                    {node.isLeaf ? (
                        <DocumentIcon className="h-4 w-4 text-gray-500" />
                    ) : (
                        <FolderIcon className="h-4 w-4 text-purple-400" />
                    )}
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{node.data.name}</span>
                </div>
            </div>
        );
    };

    const openAddDialog = () => {
        clearErrors();
        setDialogMode('add');
        setData({
            id: '',
            name: '',
            organization_unit_type_id: types.length > 0 ? types[0].id : '',
            parent_id: selectedUnitId || ''
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (e, row) => {
        e.stopPropagation(); // prevent row click
        clearErrors();
        setDialogMode('edit');
        setData({
            id: row.id,
            name: row.name,
            organization_unit_type_id: row.organization_unit_type_id,
            parent_id: row.parent_id || ''
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this organization unit? All its children will also be deleted.')) {
            router.delete(route('organization.destroy', id), {
                preserveScroll: true
            });
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
            post(route('organization.store'), options);
        } else {
            put(route('organization.update', data.id), options);
        }
    };

    const columns = [
        { header: 'Name', accessor: (row) => <span className="fw-medium">{row.name}</span> },
        { header: 'Type', accessor: (row) => <span className="badge bg-label-primary">{row.type?.name || 'Unknown'}</span> },
        { 
            header: 'Actions', 
            accessor: (row) => {
                if (!canManage) {
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
            <Head title="Organizations" />

            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row">
                    {/* Left Panel: Tree View */}
                    <div className="col-12 col-lg-4 mb-4 mb-lg-0">
                        <div className="card h-100">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Structure</h5>
                                {canManage && (
                                    <button 
                                        onClick={openAddDialog}
                                        className="btn btn-sm btn-primary"
                                    >
                                        <i className="bx bx-plus"></i> Add Root
                                    </button>
                                )}
                            </div>
                            <div className="card-body overflow-auto custom-scrollbar" style={{ maxHeight: '600px' }}>
                                <Tree
                                    data={treeData}
                                    width="100%"
                                    height={600}
                                    rowHeight={32}
                                    indent={24}
                                    openByDefault={false}
                                >
                                    {Node}
                                </Tree>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Data Table & Details */}
                    <div className="col-12 col-lg-8">
                        <div className="card h-100">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="mb-0">{selectedUnitName}</h5>
                                    <small className="text-muted">Viewing sub-units and details</small>
                                </div>
                                {canManage && (
                                    <button 
                                        onClick={openAddDialog}
                                        className="btn btn-primary"
                                    >
                                        <i className="bx bx-plus me-1"></i> Add Unit
                                    </button>
                                )}
                            </div>
                            
                            <DataTable 
                                columns={columns} 
                                data={currentChildren} 
                                onRowClick={(row) => setSelectedUnitId(row.id)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <FormDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title={dialogMode === 'add' ? 'Add Organization Unit' : 'Edit Organization Unit'}>
                <form className="space-y-4" onSubmit={submit}>
                    
                    {/* Guidance banner */}
                    <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 px-3 py-2 text-xs text-purple-300 leading-relaxed">
                        <strong className="block mb-0.5 text-purple-200">Hierarchy Guide:</strong>
                        Province → Diocese → Archdeaconry → Parish
                        <span className="block mt-0.5 text-purple-400">Select the correct Type and assign a Parent to place it in the right level.</span>
                    </div>

                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-300">Name</label>
                        <div className="mt-2">
                            <input 
                                type="text" 
                                placeholder="e.g. Kampala Diocese, Nakasero Parish..."
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 placeholder:text-gray-500" 
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-300">Unit Type</label>
                        <div className="mt-2">
                            <select 
                                value={data.organization_unit_type_id}
                                onChange={e => setData('organization_unit_type_id', e.target.value)}
                                className="block w-full rounded-md border-0 bg-gray-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                            >
                                {types.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                            {errors.organization_unit_type_id && <p className="mt-1 text-sm text-red-500">{errors.organization_unit_type_id}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-300">
                            Parent Unit
                            <span className="ml-1 text-xs text-gray-500 font-normal">(Leave empty for top-level)</span>
                        </label>
                        <div className="mt-2">
                            <select 
                                value={data.parent_id}
                                onChange={e => setData('parent_id', e.target.value)}
                                className="block w-full rounded-md border-0 bg-gray-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                            >
                                <option value="">— No Parent (Top Level) —</option>
                                {units
                                    .filter(u => ['Province', 'Diocese', 'Archdeaconry'].includes(u.type?.name))
                                    .map(u => (
                                    <option key={u.id} value={u.id}>
                                        {u.name} ({u.type?.name || 'Unknown'})
                                    </option>
                                ))}
                            </select>
                            {errors.parent_id && <p className="mt-1 text-sm text-red-500">{errors.parent_id}</p>}
                        </div>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="inline-flex w-full justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 sm:col-start-2 disabled:opacity-50" 
                        >
                            {processing ? 'Saving...' : 'Save Unit'}
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
