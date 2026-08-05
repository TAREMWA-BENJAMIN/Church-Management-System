import React from 'react';
import Pagination from './Pagination';

export default function DataTable({ columns, data, onRowClick }) {
    // Handle both flat arrays and paginated objects
    const items = Array.isArray(data) ? data : (data?.data || []);
    const links = !Array.isArray(data) && data?.links ? data.links : null;

    if (items.length === 0) {
        return (
            <div className="text-center text-muted py-5">
                No records found.
            </div>
        );
    }

    return (
        <>
            <div className="table-responsive text-nowrap">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index}>{col.header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                        {items.map((row, rowIndex) => (
                            <tr
                                key={row.id || rowIndex}
                                onClick={(e) => {
                                    // Prevent row click if the clicked element is inside a dropdown or button
                                    if (onRowClick && !e.target.closest('.dropdown') && !e.target.closest('button') && !e.target.closest('a')) {
                                        onRowClick(row);
                                    }
                                }}
                                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                            >
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex}>
                                        {col.accessor(row)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {links && <Pagination links={links} />}
        </>
    );
}
