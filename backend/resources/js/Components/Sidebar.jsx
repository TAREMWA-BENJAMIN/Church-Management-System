import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { 
    HomeIcon, 
    BuildingOfficeIcon, 
    UsersIcon, 
    AcademicCapIcon, 
    BanknotesIcon, 
    ChartPieIcon, 
    Cog6ToothIcon, 
    ArchiveBoxIcon, 
    BriefcaseIcon 
} from '@heroicons/react/24/outline'; // We will need to install heroicons

export default function Sidebar() {
    const { url } = usePage();

    const navigation = [
        { name: 'Dashboard', href: route('dashboard'), icon: HomeIcon, current: url.startsWith('/dashboard') },
        { name: 'Organization', href: route('organization.index'), icon: BuildingOfficeIcon, current: url.startsWith('/organization') },
        { name: 'Members', href: route('members.index'), icon: UsersIcon, current: url.startsWith('/members') },
        { name: 'People (Staff/Leaders)', href: route('people.index'), icon: AcademicCapIcon, current: url.startsWith('/people') },
        { name: 'Institutions', href: route('institutions.index'), icon: BuildingOfficeIcon, current: url.startsWith('/institutions') },
        { name: 'Directorates', href: route('directorates.index'), icon: BriefcaseIcon, current: url.startsWith('/directorates') },
        { name: 'Finance', href: route('finance.index'), icon: BanknotesIcon, current: url.startsWith('/finance') },
        { name: 'Assets', href: route('assets.index'), icon: BriefcaseIcon, current: url.startsWith('/assets') },
        { name: 'Reports', href: route('reports.index'), icon: ChartPieIcon, current: url.startsWith('/reports') },
        { name: 'Roles', href: route('roles.index'), icon: Cog6ToothIcon, current: url.startsWith('/roles') },
    ];

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ring-1 ring-white/10 h-screen w-64 fixed">
            <div className="flex h-16 shrink-0 items-center">
                <ApplicationLogo className="h-8 w-auto fill-current text-white" />
                <span className="ml-3 text-white font-bold text-xl tracking-wide">Church ERP</span>
            </div>
            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={classNames(
                                            item.current
                                                ? 'bg-purple-800 text-white'
                                                : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-200'
                                        )}
                                    >
                                        <item.icon
                                            className="h-6 w-6 shrink-0"
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
