import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
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
        { header: 'Name', accessor: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.name}</span> },
        { header: 'Type', accessor: (row) => <span className="inline-flex items-center rounded-md bg-purple-400/10 px-2 py-1 text-xs font-medium text-purple-400 ring-1 ring-inset ring-purple-400/30">{row.type?.name || 'Unknown'}</span> },
        { 
            header: 'Actions', 
            accessor: (row) => {
                if (!canManage) {
                    return <span className="text-xs text-gray-500 italic">View Only</span>;
                }
                return (
                    <div className="flex gap-3">
                        <button onClick={(e) => openEditDialog(e, row)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors" title="Edit">
                            <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <button onClick={(e) => handleDelete(e, row.id)} className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors" title="Delete">
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                );
            } 
        }
    ];

    return (
        <AppLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Organization Hierarchy</h2>}>
            <Head title="Organizations" />

            <div className="py-6 lg:h-[calc(100vh-10rem)]">
                <div className="mx-auto max-w-7xl flex flex-col lg:flex-row lg:h-full gap-6 px-4 sm:px-6 lg:px-8">
                    {/* Left Panel: Tree View */}
                    <div className="w-full lg:w-1/3 min-h-[300px] lg:min-h-0 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 backdrop-blur-xl shadow-lg flex flex-col transition-colors duration-200">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Structure</h3>
                            {canManage && (
                                <button 
                                    onClick={openAddDialog}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-sm font-semibold rounded-md bg-purple-600 text-white hover:bg-purple-500 transition-colors shadow-sm"
                                >
                                    <PlusIcon className="h-4 w-4" />
                                    Add Root
                                </button>
                            )}
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
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

                    {/* Right Panel: Data Table & Details */}
                    <div className="w-full lg:w-2/3 min-h-[400px] lg:min-h-0 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-lg flex flex-col transition-colors duration-200">
                        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedUnitName}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Viewing sub-units and details</p>
                            </div>
                            {canManage && (
                                <button 
                                    onClick={openAddDialog}
                                    className="inline-flex items-center gap-x-2 rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-colors"
                                >
                                    <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                                    Add Unit
                                </button>
                            )}
                        </div>
                        
                        <div className="flex-1 overflow-y-auto">
                            <DataTable 
                                columns={columns} 
                                data={currentChildren} 
                                onRowClick={(row) => setSelectedUnitId(row.id)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Add/Edit Unit Modal */}
            <FormDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title={dialogMode === 'add' ? 'Add Organization Unit' : 'Edit Organization Unit'}>
                <form className="space-y-4" onSubmit={submit}>
                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-300">Name</label>
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
                        <label className="block text-sm font-medium leading-6 text-gray-300">Type</label>
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
        </AppLayout>
    );
}
