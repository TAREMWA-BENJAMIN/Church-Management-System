import { useState } from 'react';
import Sidebar from '@/Components/Sidebar';
import Dropdown from '@/Components/Dropdown';
import { usePage, Link } from '@inertiajs/react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { 
    Bars3Icon, BellIcon, XMarkIcon,
    HomeIcon, UsersIcon, BanknotesIcon,
    ChartBarIcon, EllipsisHorizontalIcon,
    BuildingOfficeIcon, AcademicCapIcon,
    BriefcaseIcon, ArchiveBoxIcon,
    ChartPieIcon, Cog6ToothIcon,
    BuildingLibraryIcon, ChevronRightIcon
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeIconSolid,
    UsersIcon as UsersIconSolid,
    BanknotesIcon as BanknotesIconSolid,
    ChartBarIcon as ChartBarIconSolid,
} from '@heroicons/react/24/solid';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function AppLayout({ header, children }) {
    const { url, props } = usePage();
    const user = props.auth.user;
    const auth = props.auth;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [moreSheetOpen, setMoreSheetOpen] = useState(false);

    const isSuperAdmin = auth?.is_super_admin;
    const isLeader = auth?.roles?.length > 0 || isSuperAdmin;

    // Bottom nav — the 4 primary tabs
    const bottomNav = [
        {
            name: 'Home',
            href: route('dashboard'),
            icon: HomeIcon,
            activeIcon: HomeIconSolid,
            active: url.startsWith('/dashboard'),
        },
        {
            name: 'Members',
            href: route('members.index'),
            icon: UsersIcon,
            activeIcon: UsersIconSolid,
            active: url.startsWith('/members'),
        },
        {
            name: 'Finance',
            href: route('finance.index'),
            icon: BanknotesIcon,
            activeIcon: BanknotesIconSolid,
            active: url.startsWith('/finance'),
        },
        {
            name: 'Reports',
            href: route('reports.index'),
            icon: ChartBarIcon,
            activeIcon: ChartBarIconSolid,
            active: url.startsWith('/reports'),
        },
    ];

    // "More" bottom sheet items
    const moreNav = [
        { name: 'Organization', href: route('organization.index'), icon: BuildingOfficeIcon, show: isLeader },
        { name: 'People (Staff/Leaders)', href: route('people.index'), icon: AcademicCapIcon, show: isLeader },
        { name: 'Institutions', href: route('institutions.index'), icon: BuildingLibraryIcon, show: isLeader },
        { name: 'Directorates', href: route('directorates.index'), icon: BriefcaseIcon, show: isLeader },
        { name: 'Assets', href: route('assets.index'), icon: ArchiveBoxIcon, show: isLeader },
        { name: 'Roles & Permissions', href: route('roles.index'), icon: Cog6ToothIcon, show: isSuperAdmin },
    ].filter(item => item.show);

    return (
        <div className="min-h-screen bg-[#0F172A] text-gray-300 font-sans selection:bg-purple-500 selection:text-white">
            
            {/* Desktop Sidebar Drawer */}
            <Transition show={sidebarOpen}>
                <Dialog className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
                    <TransitionChild
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900/80" />
                    </TransitionChild>
                    <div className="fixed inset-0 flex">
                        <TransitionChild
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
                                <TransitionChild
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                        <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                                            <XMarkIcon className="h-6 w-6 text-white" />
                                        </button>
                                    </div>
                                </TransitionChild>
                                <Sidebar />
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>

            {/* ── Mobile "More" Bottom Sheet ──────────────────────── */}
            <Transition show={moreSheetOpen}>
                <Dialog className="relative z-50 lg:hidden" onClose={setMoreSheetOpen}>
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
                            <DialogPanel className="pointer-events-auto w-screen rounded-t-3xl bg-gray-900 border-t border-white/10 shadow-2xl pb-24">
                                {/* Handle bar */}
                                <div className="flex justify-center pt-3 pb-1">
                                    <div className="w-10 h-1 rounded-full bg-gray-600" />
                                </div>

                                {/* Sheet Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                                    <div>
                                        <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest">More Options</p>
                                        <p className="text-white font-bold text-lg leading-tight">{user.name}</p>
                                    </div>
                                    <button onClick={() => setMoreSheetOpen(false)} className="p-2 rounded-full bg-white/10 text-gray-400 hover:text-white transition-colors">
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
                                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                                                url.startsWith('/' + item.name.toLowerCase().split(' ')[0])
                                                    ? 'bg-purple-600/30 text-purple-300'
                                                    : 'text-gray-300 hover:bg-white/5 active:bg-white/10'
                                            }`}
                                        >
                                            <div className={`p-2 rounded-xl ${
                                                url.startsWith('/' + item.name.toLowerCase().split(' ')[0])
                                                    ? 'bg-purple-500/30'
                                                    : 'bg-white/5 group-hover:bg-white/10'
                                            }`}>
                                                <item.icon className="h-5 w-5" />
                                            </div>
                                            <span className="flex-1 font-semibold text-sm">{item.name}</span>
                                            <ChevronRightIcon className="h-4 w-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                                        </Link>
                                    ))}
                                </nav>

                                {/* Logout at bottom */}
                                <div className="px-4 pt-2 pb-2 border-t border-white/10 mx-4 mt-2">
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all"
                                    >
                                        <div className="p-2 rounded-xl bg-red-500/10">
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

            {/* Sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
                <Sidebar />
            </div>

            <div className="lg:pl-64">
                {/* Top Header Bar */}
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/5 bg-gray-900/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">

                    {/* Logo in header - mobile only */}
                    <div className="flex flex-1 items-center gap-x-3 lg:hidden">
                        <ApplicationLogo className="h-7 w-auto fill-current text-white" />
                        <span className="text-white font-bold text-base tracking-wide">Church ERP</span>
                    </div>

                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                        <div className="flex flex-1"></div>
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-300">
                                <BellIcon className="h-6 w-6" />
                            </button>
                            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-700" />
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="flex items-center p-1.5 focus:outline-none transition-transform duration-200 hover:scale-105">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg">
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className="hidden lg:flex lg:items-center">
                                                <span className="ml-4 text-sm font-semibold leading-6 text-white">
                                                    {user.name}
                                                </span>
                                            </span>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content contentClasses="py-1 bg-gray-800 border border-gray-700">
                                        <Dropdown.Link href={route('profile.edit')} className="text-gray-300 hover:bg-gray-700 hover:text-white">Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button" className="text-gray-300 hover:bg-gray-700 hover:text-white">Log Out</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content — extra bottom padding on mobile for bottom nav */}
                <main className="py-6 pb-28 lg:pb-6">
                    <div className="px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>

            {/* ── Mobile Bottom Navigation Bar ──────────────────────── */}
            <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-gray-900/95 backdrop-blur-xl border-t border-white/10 shadow-2xl">
                <div className="flex items-center justify-around h-16 px-1">
                    {bottomNav.map((item) => {
                        const Icon = item.active ? item.activeIcon : item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`relative flex flex-col items-center justify-center flex-1 h-full gap-y-1 transition-colors duration-200 ${
                                    item.active ? 'text-purple-400' : 'text-gray-500'
                                }`}
                            >
                                {item.active && (
                                    <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-purple-400" />
                                )}
                                <Icon className="h-6 w-6" />
                                <span className="text-[10px] font-semibold tracking-wide">{item.name}</span>
                            </Link>
                        );
                    })}

                    {/* More — opens bottom sheet */}
                    <button
                        onClick={() => setMoreSheetOpen(true)}
                        className={`relative flex flex-col items-center justify-center flex-1 h-full gap-y-1 transition-colors duration-200 ${
                            moreSheetOpen ? 'text-purple-400' : 'text-gray-500'
                        }`}
                    >
                        <EllipsisHorizontalIcon className="h-6 w-6" />
                        <span className="text-[10px] font-semibold tracking-wide">More</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}
