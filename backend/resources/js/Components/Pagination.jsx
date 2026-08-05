import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <div className="d-flex justify-content-center my-4">
            <nav aria-label="Page navigation">
                <ul className="pagination">
                    {links.map((link, key) => {
                        let label = link.label
                            .replace('&laquo;', '«')
                            .replace('&raquo;', '»');

                        // Sometimes Laravel outputs '&laquo; Previous'
                        label = label.replace('Previous', '').replace('Next', '').trim();
                        if (label === '«' || label === '»') {
                            // keep as is
                        } else if (label === '') {
                            label = link.label.includes('Previous') ? '«' : '»';
                        }

                        if (link.url === null) {
                            return (
                                <li key={key} className="page-item disabled">
                                    <span
                                        className="page-link"
                                        dangerouslySetInnerHTML={{ __html: label }}
                                    ></span>
                                </li>
                            );
                        }

                        return (
                            <li key={key} className={`page-item ${link.active ? 'active' : ''}`}>
                                <Link
                                    href={link.url}
                                    preserveScroll
                                    className="page-link"
                                    dangerouslySetInnerHTML={{ __html: label }}
                                ></Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}
