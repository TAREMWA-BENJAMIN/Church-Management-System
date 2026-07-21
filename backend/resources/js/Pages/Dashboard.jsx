import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { 
    UsersIcon, 
    BuildingLibraryIcon, 
    AcademicCapIcon, 
    BanknotesIcon 
} from '@heroicons/react/24/outline';

export default function Dashboard() {
    const stats = [
        { name: 'Dioceses', value: '39', icon: BuildingLibraryIcon },
        { name: 'Total Members', value: '4.2M', icon: UsersIcon },
        { name: 'Total Priests', value: '12,500', icon: AcademicCapIcon },
        { name: 'Total Revenue', value: 'UGX 1.2B', icon: BanknotesIcon },
    ];

    return (
        <AppLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-200">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.name}
                                className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-purple-900/20"
                            >
                                <dt>
                                    <div className="absolute rounded-xl bg-purple-500/20 p-3">
                                        <stat.icon className="h-6 w-6 text-purple-400" aria-hidden="true" />
                                    </div>
                                    <p className="ml-16 truncate text-sm font-medium text-gray-400">{stat.name}</p>
                                </dt>
                                <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                </dd>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Fake Chart Widget */}
                        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl shadow-lg">
                            <h3 className="text-base font-semibold leading-6 text-white mb-4">Monthly Income</h3>
                            <div className="h-64 rounded-xl border border-dashed border-gray-700 bg-gray-800/30 flex items-center justify-center">
                                <span className="text-gray-500">Chart Visualization Placeholder</span>
                            </div>
                        </div>

                        {/* Recent Activity Widget */}
                        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl shadow-lg">
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
