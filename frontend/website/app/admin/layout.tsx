import { DashboardLayoutShell } from "@/components/layout/dashboard-layout-shell"
import { adminNavItems } from "@/config/app.config"

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <DashboardLayoutShell navItems={adminNavItems}>
            {children}
        </DashboardLayoutShell>
    )
}
