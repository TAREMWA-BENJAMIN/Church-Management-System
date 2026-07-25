import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { 
    UsersIcon, 
    BuildingLibraryIcon, 
    AcademicCapIcon, 
    BanknotesIcon,
    BriefcaseIcon
} from '@heroicons/react/24/outline';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Dashboard({ stats, chartData }) {
    const statCards = [
        { name: 'Dioceses', value: stats?.dioceses, icon: BuildingLibraryIcon, show: stats?.dioceses !== undefined },
        { name: 'Archdeaconries', value: stats?.archdeaconries, icon: BuildingLibraryIcon, show: stats?.archdeaconries !== undefined },
        { name: 'Parishes', value: stats?.parishes, icon: BuildingLibraryIcon, show: stats?.parishes !== undefined },
        { name: 'Total Members', value: stats?.members || 0, icon: UsersIcon, show: true },
        { name: 'Total Staff', value: stats?.staff || 0, icon: AcademicCapIcon, show: true },
        { name: 'Total Revenue', value: `UGX ${stats?.revenue || 0}`, icon: BanknotesIcon, show: true },
        { name: 'Total Assets', value: `UGX ${stats?.assets || 0}`, icon: BriefcaseIcon, show: true },
    ].filter(item => item.show);

    return (
        <AppLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-4">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {statCards.map((stat) => (
                            <div
                                key={stat.name}
                                className="relative overflow-hidden rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 sm:p-6 backdrop-blur-xl shadow-lg transition-transform transition-colors duration-300 hover:-translate-y-1 hover:bg-gray-50 dark:hover:bg-white/10 hover:shadow-purple-900/20"
                            >
                                <dt className="flex items-center gap-3">
                                    <div className="rounded-xl bg-purple-100 dark:bg-purple-500/20 p-2 sm:p-3 transition-colors duration-200 shrink-0">
                                        <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-tight">{stat.name}</p>
                                </dt>
                                <dd className="mt-3 flex items-baseline">
                                    <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white break-words w-full">{stat.value}</p>
                                </dd>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-6">
                        {/* Financial Overview Chart Widget */}
                        <div className="rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 sm:p-6 backdrop-blur-xl shadow-lg transition-colors duration-200">
                            <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white mb-4">Financial Overview (Current Year)</h3>
                            <div className="h-48 sm:h-72 rounded-xl flex items-center justify-center transition-colors duration-200 w-full" style={{ minHeight: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={chartData}
                                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4}/>
                                                <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => value >= 1000000 ? `${(value/1000000).toFixed(1)}M` : value >= 1000 ? `${(value/1000).toFixed(1)}K` : value} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        />
                                        <Legend verticalAlign="top" height={36} iconType="circle" />
                                        <Area type="monotone" dataKey="Income" stroke="#9333ea" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                                        <Area type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                                        <Area type="monotone" dataKey="Assets" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAssets)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent Activity Widget */}
                        <div className="rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 sm:p-6 backdrop-blur-xl shadow-lg transition-colors duration-200">
                            <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white mb-4">Recent Announcements</h3>
                            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700/50">
                                {[
                                    { title: 'New Archdeaconry Formed', time: '2 hours ago' },
                                    { title: 'Provincial Synod Dates Set', time: '1 day ago' },
                                    { title: 'Finance Report Q3 Uploaded', time: '3 days ago' },
                                ].map((item, idx) => (
                                    <li key={idx} className="py-4 flex justify-between">
                                        <div className="text-sm text-gray-800 dark:text-gray-300">{item.title}</div>
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
