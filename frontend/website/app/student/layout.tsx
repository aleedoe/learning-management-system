import { DashboardLayoutShell } from "@/components/layout/dashboard-layout-shell"
import { studentNavItems } from "@/config/app.config"

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <DashboardLayoutShell navItems={studentNavItems}>
            {children}
        </DashboardLayoutShell>
    )
}
