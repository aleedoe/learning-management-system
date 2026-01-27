"use client"

import { DashboardShell } from "@/components/layout/dashboard-shell"
import { instructorNavItems } from "@/config/dashboard-nav"

export default function InstructorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <DashboardShell navItems={instructorNavItems}>
            {children}
        </DashboardShell>
    )
}
