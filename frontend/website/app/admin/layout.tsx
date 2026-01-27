import { dashboardNav } from "@/config/dashboard-nav";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardShell navItems={dashboardNav.admin}>
            {children}
        </DashboardShell>
    );
}
