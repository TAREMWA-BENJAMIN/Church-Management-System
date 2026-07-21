import React from 'react';

export default function DataTable({ columns, data, onRowClick }) {
    return (
        <div className="overflow-x-auto rounded-lg ring-1 ring-white/10">
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
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="py-8 text-center text-sm text-gray-500">
                                No records found.
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
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
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
