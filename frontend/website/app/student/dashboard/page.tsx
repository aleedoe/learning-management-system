export default function StudentDashboard() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold mb-2">Active Courses</h2>
                    <p className="text-4xl font-bold text-blue-600">4</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold mb-2">Assignments Due</h2>
                    <p className="text-4xl font-bold text-orange-500">2</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold mb-2">GPA</h2>
                    <p className="text-4xl font-bold text-green-600">3.8</p>
                </div>
            </div>
            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
                    <div className="p-4">Submitted Assignment: Introduction to Algorithms</div>
                    <div className="p-4">New Grade Posted: Database Systems - A</div>
                    <div className="p-4">Course Material Uploaded: Operating Systems</div>
                </div>
            </div>
        </div>
    );
}
