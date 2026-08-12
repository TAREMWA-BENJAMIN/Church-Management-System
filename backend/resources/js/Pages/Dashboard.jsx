import SneatLayout from '@/Layouts/SneatLayout';
import { Head, Link } from '@inertiajs/react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

const formatShortNumber = (num) => {
    if (!num) return 0;
    const n = Number(String(num).replace(/,/g, ''));
    if (isNaN(n)) return num;
    if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return new Intl.NumberFormat('en-UG').format(n);
};

export default function Dashboard({ stats, chartData }) {
    const processedChartData = chartData?.map(item => ({
        ...item,
        Income: Math.abs(item.Income || 0),
        Expenses: -Math.abs(item.Expenses || 0),
    })) || [];

    const radialData = [{ name: 'Growth', value: 78, fill: '#696cff' }];

    return (
        <SneatLayout>
            <Head title="Dashboard" />

            {/* ── ROW 1: Welcome Banner + 2 small stat cards ── */}
            <div className="row">
                {/* Welcome Banner */}
                <div className="col-lg-8 mb-4 order-0">
                    <div className="card h-100">
                        <div className="d-flex align-items-center row h-100">
                            <div className="col-sm-7">
                                <div className="card-body py-3">
                                    <h5 className="card-title text-primary">Welcome to ERP CHURCH SYSTEM! 🎉</h5>
                                    <p className="mb-3">
                                        You have <span className="fw-bold">{stats?.members || 0}</span> total members registered across all dioceses. Check the reports for more details.
                                    </p>
                                    <Link href="/members" className="btn btn-sm btn-outline-primary">View Members</Link>
                                </div>
                            </div>
                            <div className="col-sm-5 text-center text-sm-left">
                                <div className="card-body pb-0 px-0 px-md-2">
                                    <img
                                        src="/assets/img/illustrations/real-church.png"
                                        style={{ height: '140px', width: '100%', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
                                        alt="Church ERP System"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Two stat cards */}
                <div className="col-lg-4 col-md-4 order-1">
                    <div className="row">
                        <div className="col-lg-6 col-md-12 col-6 mb-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between">
                                        <div className="avatar flex-shrink-0">
                                            <span className="avatar-initial rounded bg-label-success"><i className="bx bx-building-house"></i></span>
                                        </div>
                                    </div>
                                    <span className="fw-semibold d-block mb-1">Dioceses</span>
                                    <h3 className="card-title mb-2">{stats?.dioceses || 0}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-6 mb-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between">
                                        <div className="avatar flex-shrink-0">
                                            <span className="avatar-initial rounded bg-label-info"><i className="bx bx-building"></i></span>
                                        </div>
                                    </div>
                                    <span className="fw-semibold d-block mb-1">Archdeaconries</span>
                                    <h3 className="card-title mb-2">{stats?.archdeaconries || 0}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── ROW 2: Chart + Radial | 2 small cards + Profile card ── */}
            <div className="row" style={{ alignItems: 'stretch' }}>

                {/* Left: Bar chart card (with radial inside) */}
                <div className="col-lg-8 mb-4 d-flex">
                    <div className="card w-100">
                        <div className="row row-bordered g-0 h-100">
                            <div className="col-md-8">
                                <h5 className="card-header m-0 me-2 pb-3">Total Collection</h5>
                                <div className="px-2" style={{ height: '320px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            data={processedChartData}
                                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                        >
                                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => Math.abs(v) >= 1000000 ? `${(v/1000000).toFixed(1)}M` : Math.abs(v) >= 1000 ? `${(v/1000).toFixed(1)}K` : v} />
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" opacity={0.5} />
                                            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', color: '#566a7f' }} formatter={(v) => Math.abs(v)} />
                                            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ left: 20 }} />
                                            <Line type="monotone" dataKey="Income" name="Income" stroke="#696cff" strokeWidth={3} dot={{ r: 4, fill: '#696cff' }} activeDot={{ r: 6 }} />
                                            <Line type="monotone" dataKey="Expenses" name="Expenses" stroke="#03c3ec" strokeWidth={3} dot={{ r: 4, fill: '#03c3ec' }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="col-md-4 d-flex flex-column justify-content-between">
                                <div className="card-body pb-0">
                                    <div className="text-center">
                                        <div className="dropdown">
                                            <button className="btn btn-sm btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                                2022
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-end">
                                                <a className="dropdown-item" href="#">2021</a>
                                                <a className="dropdown-item" href="#">2020</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ height: '160px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={10} data={radialData} startAngle={180} endAngle={0}>
                                            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                            <RadialBar background={{ fill: '#e7e7ff' }} clockWise dataKey="value" cornerRadius={10} />
                                            <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '22px', fontWeight: 'bold', fill: '#566a7f' }}>78%</text>
                                            <text x="50%" y="62%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '12px', fill: '#a1acb8' }}>Growth</text>
                                        </RadialBarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="text-center fw-semibold mb-2">Church Growth</div>
                                <div className="d-flex p-3 gap-3 justify-content-between">
                                    <div className="d-flex">
                                        <span className="badge bg-label-primary p-2 me-2"><i className="bx bx-dollar text-primary"></i></span>
                                        <div>
                                            <small className="text-muted d-block">Revenue</small>
                                            <small className="fw-semibold" title={`UGX ${stats?.revenue || 0}`}>UGX {formatShortNumber(stats?.revenue)}</small>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <span className="badge bg-label-info p-2 me-2"><i className="bx bx-wallet text-info"></i></span>
                                        <div>
                                            <small className="text-muted d-block">Assets</small>
                                            <small className="fw-semibold" title={`UGX ${stats?.assets || 0}`}>UGX {formatShortNumber(stats?.assets)}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: 2 small cards + profile-style card */}
                <div className="col-lg-4 mb-4 d-flex flex-column">

                    {/* Top two small cards */}
                    <div className="row g-3 mb-3">
                        <div className="col-6 d-flex">
                            <div className="card w-100">
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between">
                                        <div className="avatar flex-shrink-0">
                                            <img src="/assets/img/icons/unicons/paypal.png" alt="Parishes" className="rounded" />
                                        </div>
                                    </div>
                                    <span className="fw-semibold d-block mb-1">Parishes</span>
                                    <h3 className="card-title mb-2">{stats?.parishes || 0}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 d-flex">
                            <div className="card w-100">
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between">
                                        <div className="avatar flex-shrink-0">
                                            <span className="avatar-initial rounded bg-label-info"><i className="bx bx-certification"></i></span>
                                        </div>
                                    </div>
                                    <span className="fw-semibold d-block mb-1">Certificates</span>
                                    <h3 className="card-title mb-2">{stats?.totalCertificates || 0}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile-style card — fills remaining height */}
                    <div className="card flex-fill">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h5 className="mb-1">Total Assets</h5>
                                    <span className="badge bg-label-warning rounded-pill mb-3">Current Year</span>
                                    <h3 className="mb-0">UGX {stats?.assets || 0}</h3>
                                </div>
                                <div style={{ width: '130px', height: '80px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData?.slice(-6) || []} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                                            <defs>
                                                <linearGradient id="colorProfile" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ffab00" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#ffab00" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <Area type="monotone" dataKey="Assets" stroke="#ffab00" strokeWidth={3} fillOpacity={1} fill="url(#colorProfile)" dot={false} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            {/* ── ROW 3: Stats ── */}
            <div className="row">
                <div className="col-lg-2 col-md-4 col-6 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <div className="avatar flex-shrink-0 mb-2">
                                <span className="avatar-initial rounded bg-label-primary"><i className="bx bx-water"></i></span>
                            </div>
                            <span className="fw-semibold d-block mb-1">Baptisms</span>
                            <h3 className="card-title mb-2">{stats?.totalBaptisms || 0}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-lg-2 col-md-4 col-6 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <div className="avatar flex-shrink-0 mb-2">
                                <span className="avatar-initial rounded bg-label-info"><i className="bx bx-check-shield"></i></span>
                            </div>
                            <span className="fw-semibold d-block mb-1">Confirmations</span>
                            <h3 className="card-title mb-2">{stats?.totalConfirmations || 0}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-lg-2 col-md-4 col-6 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <div className="avatar flex-shrink-0 mb-2">
                                <span className="avatar-initial rounded bg-label-danger"><i className="bx bx-heart"></i></span>
                            </div>
                            <span className="fw-semibold d-block mb-1">Marriages</span>
                            <h3 className="card-title mb-2">{stats?.totalMarriages || 0}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-lg-2 col-md-4 col-6 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <div className="avatar flex-shrink-0 mb-2">
                                <span className="avatar-initial rounded bg-label-secondary"><i className="bx bx-user-badge"></i></span>
                            </div>
                            <span className="fw-semibold d-block mb-1">Staff</span>
                            <h3 className="card-title mb-2">{stats?.staff || 0}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-lg-2 col-md-4 col-6 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <div className="avatar flex-shrink-0 mb-2">
                                <span className="avatar-initial rounded bg-label-success"><i className="bx bx-group"></i></span>
                            </div>
                            <span className="fw-semibold d-block mb-1">Members</span>
                            <h3 className="card-title mb-2">{stats?.members || 0}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-lg-2 col-md-4 col-6 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <div className="avatar flex-shrink-0 mb-2">
                                <span className="avatar-initial rounded bg-label-warning"><i className="bx bx-money"></i></span>
                            </div>
                            <span className="fw-semibold d-block mb-1">Revenue</span>
                            <h4 className="card-title mb-2 text-truncate" title={`UGX ${stats?.revenue || 0}`}>UGX {stats?.revenue || 0}</h4>
                        </div>
                    </div>
                </div>
            </div>

        </SneatLayout>
    );
}
