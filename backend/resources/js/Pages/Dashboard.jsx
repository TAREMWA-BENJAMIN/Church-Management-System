import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { 
    UsersIcon, 
    BuildingLibraryIcon, 
    AcademicCapIcon, 
    BanknotesIcon 
} from '@heroicons/react/24/outline';

export default function Dashboard({ stats }) {
    const statCards = [
        { name: 'Dioceses', value: stats?.dioceses, icon: BuildingLibraryIcon, show: stats?.dioceses !== undefined },
        { name: 'Archdeaconries', value: stats?.archdeaconries, icon: BuildingLibraryIcon, show: stats?.archdeaconries !== undefined },
        { name: 'Parishes', value: stats?.parishes, icon: BuildingLibraryIcon, show: stats?.parishes !== undefined },
        { name: 'Total Members', value: stats?.members || 0, icon: UsersIcon, show: true },
        { name: 'Total Staff', value: stats?.staff || 0, icon: AcademicCapIcon, show: true },
        { name: 'Total Revenue', value: `UGX ${stats?.revenue || 0}`, icon: BanknotesIcon, show: true },
    ].filter(item => item.show);

    return (
        <AppLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-200">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-4">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {statCards.map((stat) => (
                            <div
                                key={stat.name}
                                className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-6 backdrop-blur-xl shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-purple-900/20"
                            >
                                <dt>
                                    <div className="absolute rounded-xl bg-purple-500/20 p-2.5 sm:p-3">
                                        <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" aria-hidden="true" />
                                    </div>
                                    <p className="ml-12 sm:ml-16 truncate text-xs sm:text-sm font-medium text-gray-400">{stat.name}</p>
                                </dt>
                                <dd className="ml-12 sm:ml-16 flex items-baseline pb-1 sm:pb-2">
                                    <p className="text-xl sm:text-2xl font-bold text-white">{stat.value}</p>
                                </dd>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-6">
                        {/* Fake Chart Widget */}
                        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-6 backdrop-blur-xl shadow-lg">
                            <h3 className="text-base font-semibold leading-6 text-white mb-4">Monthly Income</h3>
                            <div className="h-48 sm:h-64 rounded-xl border border-dashed border-gray-700 bg-gray-800/30 flex items-center justify-center">
                                <span className="text-gray-500 text-sm">Chart Visualization Placeholder</span>
                            </div>
                        </div>

                        {/* Recent Activity Widget */}
                        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-6 backdrop-blur-xl shadow-lg">
                            <h3 className="text-base font-semibold leading-6 text-white mb-4">Recent Announcements</h3>
                            <ul role="list" className="divide-y divide-gray-700/50">
                                {[
                                    { title: 'New Archdeaconry Formed', time: '2 hours ago' },
                                    { title: 'Provincial Synod Dates Set', time: '1 day ago' },
                                    { title: 'Finance Report Q3 Uploaded', time: '3 days ago' },
                                ].map((item, idx) => (
                                    <li key={idx} className="py-4 flex justify-between">
                                        <div className="text-sm text-gray-300">{item.title}</div>
                                        <div className="text-xs text-gray-500">{item.time}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
