const fs = require('fs');

let content = fs.readFileSync('resources/js/Layouts/SneatLayout.jsx', 'utf8');

const imports = `import React, { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { 
    XMarkIcon, HomeIcon, UsersIcon, BanknotesIcon,
    ChartBarIcon, EllipsisHorizontalIcon,
    BuildingOfficeIcon, AcademicCapIcon,
    BriefcaseIcon, ArchiveBoxIcon,
    Cog6ToothIcon, BuildingLibraryIcon, ChevronRightIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeIconSolid,
    BanknotesIcon as BanknotesIconSolid,
    ChartBarIcon as ChartBarIconSolid,
    EnvelopeIcon as EnvelopeIconSolid,
} from '@heroicons/react/24/solid';
`;

content = content.replace(/import React.*?\nimport { Link, usePage } from '@inertiajs\/react';/s, imports);

const logic = `    const { auth } = usePage().props;
    const { url } = usePage();
    const user = auth?.user;
    const [moreSheetOpen, setMoreSheetOpen] = useState(false);

    const isSuperAdmin = auth?.is_super_admin;
    const isLeader = auth?.roles?.length > 0 || isSuperAdmin;
    const unreadCount = usePage().props?.unreadMessageCount ?? 0;

    const bottomNav = [
        {
            name: 'Home',
            href: route('dashboard'),
            icon: HomeIcon,
            activeIcon: HomeIconSolid,
            active: url.startsWith('/dashboard'),
            badge: null,
        },
        {
            name: 'Reports',
            href: route('reports.index'),
            icon: ChartBarIcon,
            activeIcon: ChartBarIconSolid,
            active: url.startsWith('/reports'),
            badge: null,
        },
        {
            name: 'Finance',
            href: route('finance.index'),
            icon: BanknotesIcon,
            activeIcon: BanknotesIconSolid,
            active: url.startsWith('/finance'),
            badge: null,
        },
        {
            name: 'Messages',
            href: route('communications.index'),
            icon: EnvelopeIcon,
            activeIcon: EnvelopeIconSolid,
            active: url.startsWith('/communications'),
            badge: unreadCount > 0 ? unreadCount : null,
        },
    ];

    const moreNav = [
        { name: 'Organization', href: route('organization.index'), icon: BuildingOfficeIcon, show: isLeader },
        { name: 'Members', href: route('members.index'), icon: UsersIcon, show: isLeader },
        { name: 'People (Staff/Leaders)', href: route('people.index'), icon: AcademicCapIcon, show: isSuperAdmin },
        { name: 'Institutions', href: route('institutions.index'), icon: BuildingLibraryIcon, show: isLeader },
        { name: 'Directorates', href: route('directorates.index'), icon: BriefcaseIcon, show: isLeader },
        { name: 'Assets', href: route('assets.index'), icon: ArchiveBoxIcon, show: isLeader },
        { name: 'Roles & Permissions', href: route('roles.index'), icon: Cog6ToothIcon, show: isSuperAdmin },
    ].filter(item => item.show);
`;

content = content.replace(/    const { auth } = usePage\(\)\.props;/, logic);

// Add bottom padding to content on mobile
content = content.replace(/<div className="container-xxl flex-grow-1 container-p-y">/g, '<div className="container-xxl flex-grow-1 container-p-y pb-28 xl:pb-6">');

const mobileNav = `
            {/* ── Mobile Bottom Navigation Bar ──────────────────────── */}
            <nav className="xl:hidden fixed bottom-0 inset-x-0 z-[1100] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 shadow-2xl transition-colors duration-200">
                <div className="flex items-center justify-around h-16 px-1">
                    {bottomNav.map((item) => {
                        const Icon = item.active ? item.activeIcon : item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={\`relative flex flex-col items-center justify-center flex-1 h-full gap-y-1 transition-colors duration-200 \${
                                    item.active ? 'text-primary' : 'text-secondary'
                                }\`}
                            >
                                {item.active && (
                                    <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-primary" />
                                )}
                                <div className="relative">
                                    <Icon className="h-6 w-6" />
                                    {item.badge && (
                                        <span className="absolute -top-1.5 -right-2 inline-flex items-center justify-center rounded-full bg-danger px-1.5 py-0.5 text-[9px] font-bold text-white leading-none">
                                            {item.badge > 9 ? '9+' : item.badge}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] font-semibold tracking-wide">{item.name}</span>
                            </Link>
                        );
                    })}

                    {/* More — opens bottom sheet */}
                    <button
                        onClick={() => setMoreSheetOpen(true)}
                        className={\`relative flex flex-col items-center justify-center flex-1 h-full gap-y-1 transition-colors duration-200 \${
                            moreSheetOpen ? 'text-primary' : 'text-secondary'
                        }\`}
                    >
                        <EllipsisHorizontalIcon className="h-6 w-6" />
                        <span className="text-[10px] font-semibold tracking-wide">More</span>
                    </button>
                </div>
            </nav>

            {/* ── Mobile "More" Bottom Sheet ──────────────────────── */}
            <Transition show={moreSheetOpen}>
                <Dialog className="relative z-[1200] xl:hidden" onClose={setMoreSheetOpen}>
                    {/* Backdrop */}
                    <TransitionChild
                        enter="transition-opacity ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMoreSheetOpen(false)} />
                    </TransitionChild>

                    {/* Sheet sliding up from bottom */}
                    <div className="fixed inset-0 flex items-end pointer-events-none">
                        <TransitionChild
                            enter="transition ease-out duration-300 transform"
                            enterFrom="translate-y-full"
                            enterTo="translate-y-0"
                            leave="transition ease-in duration-200 transform"
                            leaveFrom="translate-y-0"
                            leaveTo="translate-y-full"
                        >
                            <DialogPanel className="pointer-events-auto w-screen rounded-t-3xl bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/10 shadow-2xl pb-24 transition-colors duration-200">
                                {/* Handle bar */}
                                <div className="flex justify-center pt-3 pb-1">
                                    <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                                </div>

                                {/* Sheet Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10">
                                    <div>
                                        <p className="text-xs font-semibold text-primary uppercase tracking-widest">More Options</p>
                                        <p className="text-gray-900 dark:text-white font-bold text-lg leading-tight">{user?.name}</p>
                                    </div>
                                    <button onClick={() => setMoreSheetOpen(false)} className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Navigation Items */}
                                <nav className="px-4 py-3 space-y-1">
                                    {moreNav.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setMoreSheetOpen(false)}
                                            className={\`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group \${
                                                url.startsWith('/' + item.name.toLowerCase().split(' ')[0])
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 active:bg-gray-200 dark:active:bg-white/10'
                                            }\`}
                                        >
                                            <div className={\`p-2 rounded-xl \${
                                                url.startsWith('/' + item.name.toLowerCase().split(' ')[0])
                                                    ? 'bg-primary/20 text-primary'
                                                    : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-white/10 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                                            }\`}>
                                                <item.icon className="h-5 w-5" />
                                            </div>
                                            <span className="flex-1 font-semibold text-sm">{item.name}</span>
                                            <ChevronRightIcon className="h-4 w-4 text-gray-400 dark:text-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors" />
                                        </Link>
                                    ))}
                                </nav>

                                {/* Logout at bottom */}
                                <div className="px-4 pt-2 pb-2 border-t border-gray-200 dark:border-white/10 mx-4 mt-2">
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-danger hover:bg-danger/10 transition-all"
                                    >
                                        <div className="p-2 rounded-xl bg-danger/10">
                                            <XMarkIcon className="h-5 w-5" />
                                        </div>
                                        <span className="font-semibold text-sm">Log Out</span>
                                    </Link>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
`;

content = content.replace(/        <\/div>\r?\n    \);\r?\n}/, mobileNav + '}\n');

fs.writeFileSync('resources/js/Layouts/SneatLayout.jsx', content, 'utf8');
console.log('Done');
