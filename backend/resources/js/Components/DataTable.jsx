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
                        className={`bg-white dark:bg-gray-800/70 border border-gray-200 dark:border-white/10 rounded-xl p-4 shadow-sm transition-colors duration-200 ${onRowClick ? 'cursor-pointer active:bg-gray-50 dark:active:bg-gray-700' : ''}`}
                        onClick={() => onRowClick && onRowClick(row)}
                    >
                        {dataColumns.map((col, colIndex) => (
                            <div key={colIndex} className="flex flex-col gap-0.5 py-2 border-b border-gray-100 dark:border-white/5 last:border-0">
                                <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                    {col.header}
                                </span>
                                <span className="text-sm text-gray-800 dark:text-gray-200 break-words overflow-hidden">
                                    {col.accessor(row)}
                                </span>
                            </div>
                        ))}
                        {actionsColumn && (
                            <div className="flex justify-end mt-3 pt-2 border-t border-gray-200 dark:border-white/10">
                                {actionsColumn.accessor(row)}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* ── Desktop table (≥ md) ────────────────────── */}
            <div className="hidden md:block overflow-x-auto rounded-lg ring-1 ring-gray-200 dark:ring-white/10 transition-colors duration-200">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
                        <tr>
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    scope="col"
                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-300 sm:pl-6"
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900/50 transition-colors duration-200">
                        {data.map((row, rowIndex) => (
                            <tr
                                key={row.id || rowIndex}
                                className={`transition-colors duration-150 ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''}`}
                                onClick={() => onRowClick && onRowClick(row)}
                            >
                                {columns.map((col, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-700 dark:text-gray-300 sm:pl-6"
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
