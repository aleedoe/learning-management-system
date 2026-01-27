import { dashboardNav } from "@/config/dashboard-nav";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardShell navItems={dashboardNav.student}>
            {children}
        </DashboardShell>
    );
}
