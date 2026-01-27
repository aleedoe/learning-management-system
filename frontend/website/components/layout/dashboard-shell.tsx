"use client"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { NavItem } from "@/config/dashboard-nav"
import { useAuthStore } from "@/stores/use-auth-store"
import { Separator } from "@/components/ui/separator"

interface DashboardShellProps {
    children: React.ReactNode
    navItems: NavItem[]
}

export function DashboardShell({ children, navItems }: DashboardShellProps) {
    const { user } = useAuthStore()

    const sidebarUser = {
        name: user ? `${user.firstName} ${user.lastName}` : "Guest User",
        email: user?.email || "guest@example.com",
        avatar: user?.avatar || "",
    }

    return (
        <SidebarProvider>
            <AppSidebar items={navItems} user={sidebarUser} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        {/* Breadcrumbs can be added here */}
                        <div className="text-sm font-medium">Dashboard</div>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
