export default function AdminDashboard() {
    return (
        <main className="p-6 max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500 text-sm">Welcome back, here is an overview of your system.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Users</h3>
                    <p className="text-3xl font-bold mt-2 text-gray-900">1,284</p>
                    <span className="text-xs text-green-600 font-medium">+12% from last month</span>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Projects</h3>
                    <p className="text-3xl font-bold mt-2 text-gray-900">42</p>
                    <span className="text-xs text-blue-600 font-medium">5 pending review</span>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">System Status</h3>
                    <p className="text-3xl font-bold mt-2 text-green-600">Healthy</p>
                    <span className="text-xs text-gray-400 font-medium">All systems operational</span>
                </div>
            </div>

            <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="font-semibold text-gray-900">Recent Activity</h2>
                </div>
                <div className="p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No recent activity to display at this time.</p>
                </div>
            </section>
        </main>
    );
}
