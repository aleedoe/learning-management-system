"use client"

import {
    ChevronRight,
    LayoutDashboard,
    Users,
    BookOpen,
    Settings,
    BarChart3,
    GraduationCap,
    FolderOpen,
    MessageSquare,
    CreditCard,
    Bell,
    Shield,
} from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

// Map of icon names to components
const Icons = {
    LayoutDashboard,
    Users,
    BookOpen,
    Settings,
    BarChart3,
    GraduationCap,
    FolderOpen,
    MessageSquare,
    CreditCard,
    Bell,
    Shield,
}

export type IconName = keyof typeof Icons

export interface NavItem {
    title: string
    url: string
    icon?: string
    isActive?: boolean
    items?: NavItem[]
}

export function NavMain({
    items,
    label,
}: {
    items: NavItem[]
    label?: string
}) {
    return (
        <SidebarGroup>
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarMenu>
                {items.map((item) => {
                    const Icon = item.icon ? Icons[item.icon as IconName] : null

                    return (
                        <div key={item.title}>
                            {item.items && item.items.length > 0 ? (
                                <Collapsible
                                    asChild
                                    defaultOpen={item.isActive}
                                    className="group/collapsible"
                                >
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip={item.title}>
                                                {Icon && <Icon />}
                                                <span>{item.title}</span>
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items.map((subItem) => (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton asChild>
                                                            <a href={subItem.url}>
                                                                <span>{subItem.title}</span>
                                                            </a>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            ) : (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild tooltip={item.title}>
                                        <a href={item.url}>
                                            {Icon && <Icon />}
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </div>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
