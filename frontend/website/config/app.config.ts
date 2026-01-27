import {
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
    type LucideIcon,
} from 'lucide-react';

/**
 * Navigation Item Interface
 */
export interface NavItem {
    title: string;
    url: string;
    icon: LucideIcon;
    badge?: string | number;
    items?: NavItem[];
}

/**
 * Admin Navigation Items
 */
export const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/admin',
        icon: LayoutDashboard,
    },
    {
        title: 'Users',
        url: '/admin/users',
        icon: Users,
    },
    {
        title: 'Courses',
        url: '/admin/courses',
        icon: BookOpen,
    },
    {
        title: 'Analytics',
        url: '/admin/analytics',
        icon: BarChart3,
    },
    {
        title: 'Transactions',
        url: '/admin/transactions',
        icon: CreditCard,
    },
    {
        title: 'Roles & Permissions',
        url: '/admin/roles',
        icon: Shield,
    },
    {
        title: 'Settings',
        url: '/admin/settings',
        icon: Settings,
    },
];

/**
 * Instructor Navigation Items
 */
export const instructorNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/instructor',
        icon: LayoutDashboard,
    },
    {
        title: 'My Courses',
        url: '/instructor/courses',
        icon: BookOpen,
    },
    {
        title: 'Create Course',
        url: '/instructor/courses/new',
        icon: FolderOpen,
    },
    {
        title: 'Analytics',
        url: '/instructor/analytics',
        icon: BarChart3,
    },
    {
        title: 'Earnings',
        url: '/instructor/earnings',
        icon: CreditCard,
    },
    {
        title: 'Messages',
        url: '/instructor/messages',
        icon: MessageSquare,
    },
    {
        title: 'Settings',
        url: '/instructor/settings',
        icon: Settings,
    },
];

/**
 * Student Navigation Items
 */
export const studentNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/student',
        icon: LayoutDashboard,
    },
    {
        title: 'Browse Courses',
        url: '/student/browse',
        icon: BookOpen,
    },
    {
        title: 'My Courses',
        url: '/student/my-courses',
        icon: GraduationCap,
    },
    {
        title: 'Progress',
        url: '/student/progress',
        icon: BarChart3,
    },
    {
        title: 'Notifications',
        url: '/student/notifications',
        icon: Bell,
    },
    {
        title: 'Settings',
        url: '/student/settings',
        icon: Settings,
    },
];

/**
 * App Metadata / Branding
 */
export const appConfig = {
    name: 'LMS Platform',
    description: 'A production-grade Learning Management System',
    version: '0.1.0',
} as const;
