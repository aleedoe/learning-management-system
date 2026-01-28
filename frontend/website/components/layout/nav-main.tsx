"use client"

import { usePathname } from "next/navigation"
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
    const pathname = usePathname()

    // Find the single item (or sub-item) that best matches the current path.
    // The "best" match is the one with the longest URL that is a prefix of the pathname.
    const findBestMatch = (navItems: NavItem[]): string | null => {
        let bestMatch: string | null = null;
        let maxLen = -1;

        const traverse = (list: NavItem[]) => {
            for (const item of list) {
                // Check if current item matches
                if (pathname === item.url || (item.url !== "/" && pathname?.startsWith(item.url + "/"))) {
                    if (item.url.length > maxLen) {
                        maxLen = item.url.length;
                        bestMatch = item.url;
                    }
                }

                if (item.items) {
                    traverse(item.items);
                }
            }
        };
        traverse(navItems);
        return bestMatch;
    }

    const bestMatchUrl = findBestMatch(items);

    return (
        <SidebarGroup>
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarMenu>
                {items.map((item) => {
                    const Icon = item.icon ? Icons[item.icon as IconName] : null

                    // Check if this item or any of its children is the best match
                    // This is used for 'defaultOpen' state of Collapsible
                    const hasActiveChild = (subItems: NavItem[]): boolean => {
                        return subItems.some(sub => sub.url === bestMatchUrl || (sub.items && hasActiveChild(sub.items)));
                    }
                    const isOpen = item.isActive || (item.url === bestMatchUrl) || (item.items ? hasActiveChild(item.items) : false);

                    // Strictly highlight the link only if it is the best match
                    const isActive = item.url === bestMatchUrl;

                    return (
                        <div key={item.title}>
                            {item.items && item.items.length > 0 ? (
                                <Collapsible
                                    asChild
                                    defaultOpen={isOpen}
                                    className="group/collapsible"
                                >
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip={item.title} isActive={isActive}>
                                                {Icon && <Icon />}
                                                <span>{item.title}</span>
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items.map((subItem) => {
                                                    const isSubActive = subItem.url === bestMatchUrl
                                                    return (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton asChild isActive={isSubActive}>
                                                                <a href={subItem.url}>
                                                                    <span>{subItem.title}</span>
                                                                </a>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    )
                                                })}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            ) : (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
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
