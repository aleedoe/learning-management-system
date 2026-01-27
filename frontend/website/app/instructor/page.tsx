import React from 'react';

export default function InstructorDashboard() {
    const stats = [
        { label: 'Total Students', value: '1,234' },
        { label: 'Active Courses', value: '12' },
        { label: 'Total Revenue', value: '$15,420' },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here is an overview of your performance.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                        <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-center h-32 text-gray-400 italic">
                        No recent activity to display.
                    </div>
                </div>
            </section>
        </div>
    );
}
