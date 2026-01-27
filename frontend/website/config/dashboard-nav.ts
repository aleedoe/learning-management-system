import {
    BookOpen,
    LayoutDashboard,
    Settings,
    Users,
    GraduationCap,
    FileText,
    BarChart,
    Shield,
    LucideIcon
} from "lucide-react"

export interface NavItem {
    title: string
    url: string
    icon: LucideIcon
    items?: {
        title: string
        url: string
    }[]
}

export const adminNavItems: NavItem[] = [
    {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Users",
        url: "/admin/users",
        icon: Users,
        items: [
            {
                title: "All Users",
                url: "/admin/users",
            },
            {
                title: "Instructors",
                url: "/admin/users/instructors",
            },
            {
                title: "Students",
                url: "/admin/users/students",
            },
        ],
    },
    {
        title: "Courses",
        url: "/admin/courses",
        icon: BookOpen,
    },
    {
        title: "System Settings",
        url: "/admin/settings",
        icon: Settings,
    },
]

export const instructorNavItems: NavItem[] = [
    {
        title: "Dashboard",
        url: "/instructor/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "My Courses",
        url: "/instructor/courses",
        icon: BookOpen,
        items: [
            {
                title: "Active Courses",
                url: "/instructor/courses",
            },
            {
                title: "Drafts",
                url: "/instructor/courses?status=draft",
            },
            {
                title: "Create Course",
                url: "/instructor/courses/new",
            },
        ],
    },
    {
        title: "Analytics",
        url: "/instructor/analytics",
        icon: BarChart,
    },
    {
        title: "Resources",
        url: "/instructor/resources",
        icon: FileText,
    },
]

export const studentNavItems: NavItem[] = [
    {
        title: "Dashboard",
        url: "/student/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "My Learning",
        url: "/student/courses",
        icon: GraduationCap,
        items: [
            {
                title: "In Progress",
                url: "/student/courses",
            },
            {
                title: "Completed",
                url: "/student/courses?status=completed",
            },
        ],
    },
    {
        title: "Browse Courses",
        url: "/courses",
        icon: BookOpen,
    },
    {
        title: "Achievements",
        url: "/student/achievements",
        icon: Shield,
    },
]
