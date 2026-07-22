import React from 'react';

export default function DataTable({ columns, data, onRowClick }) {
    // Separate "Actions" column from data columns
    const dataColumns = columns.filter(col => col.header !== 'Actions');
    const actionsColumn = columns.find(col => col.header === 'Actions');

    if (data.length === 0) {
        return (
            <div className="py-16 text-center text-sm text-gray-500">
                No records found.
            </div>
        );
    }

    return (
        <>
            {/* ── Mobile card list (< md) ─────────────────── */}
            <div className="block md:hidden space-y-3">
                {data.map((row, rowIndex) => (
                    <div
                        key={row.id || rowIndex}
                        className={`bg-gray-800/70 border border-white/10 rounded-xl p-4 transition-colors ${onRowClick ? 'cursor-pointer active:bg-gray-700' : ''}`}
                        onClick={() => onRowClick && onRowClick(row)}
                    >
                        {dataColumns.map((col, colIndex) => (
                            <div key={colIndex} className="flex justify-between items-start py-1.5 border-b border-white/5 last:border-0">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mr-4 mt-0.5 shrink-0">
                                    {col.header}
                                </span>
                                <span className="text-sm text-right">
                                    {col.accessor(row)}
                                </span>
                            </div>
                        ))}
                        {actionsColumn && (
                            <div className="flex justify-end mt-3 pt-2 border-t border-white/10">
                                {actionsColumn.accessor(row)}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* ── Desktop table (≥ md) ────────────────────── */}
            <div className="hidden md:block overflow-x-auto rounded-lg ring-1 ring-white/10">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                        <tr>
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    scope="col"
                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-300 sm:pl-6"
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 bg-gray-900/50">
                        {data.map((row, rowIndex) => (
                            <tr
                                key={row.id || rowIndex}
                                className={`transition-colors duration-150 ${onRowClick ? 'cursor-pointer hover:bg-gray-800' : ''}`}
                                onClick={() => onRowClick && onRowClick(row)}
                            >
                                {columns.map((col, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-300 sm:pl-6"
                                    >
                                        {col.accessor(row)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
