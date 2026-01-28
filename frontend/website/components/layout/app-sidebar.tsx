"use client"

import * as React from "react"
import {
    AudioWaveform,
    BanIcon,
    Command,
    GalleryVerticalEnd,
} from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavUser } from "@/components/layout/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import type { NavItem } from "@/components/layout/nav-main"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    items: NavItem[]
}

export function AppSidebar({ items, ...props }: AppSidebarProps) {
    return (
        <Sidebar collapsible="icon" className="bg-sidebar text-sidebar-foreground" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                        >
                            <a href="#">
                                <BanIcon className="size-5!" />
                                <span className="text-base font-semibold">Acme Inc.</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={items} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
