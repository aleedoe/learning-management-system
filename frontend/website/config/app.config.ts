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
    label: string;
    href: string;
    icon: LucideIcon;
    badge?: string | number;
    children?: NavItem[];
}

/**
 * Admin Navigation Items
 */
export const adminNavItems: NavItem[] = [
    {
        label: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
    },
    {
        label: 'Users',
        href: '/admin/users',
        icon: Users,
    },
    {
        label: 'Courses',
        href: '/admin/courses',
        icon: BookOpen,
    },
    {
        label: 'Analytics',
        href: '/admin/analytics',
        icon: BarChart3,
    },
    {
        label: 'Transactions',
        href: '/admin/transactions',
        icon: CreditCard,
    },
    {
        label: 'Roles & Permissions',
        href: '/admin/roles',
        icon: Shield,
    },
    {
        label: 'Settings',
        href: '/admin/settings',
        icon: Settings,
    },
];

/**
 * Instructor Navigation Items
 */
export const instructorNavItems: NavItem[] = [
    {
        label: 'Dashboard',
        href: '/instructor',
        icon: LayoutDashboard,
    },
    {
        label: 'My Courses',
        href: '/instructor/courses',
        icon: BookOpen,
    },
    {
        label: 'Create Course',
        href: '/instructor/courses/new',
        icon: FolderOpen,
    },
    {
        label: 'Analytics',
        href: '/instructor/analytics',
        icon: BarChart3,
    },
    {
        label: 'Earnings',
        href: '/instructor/earnings',
        icon: CreditCard,
    },
    {
        label: 'Messages',
        href: '/instructor/messages',
        icon: MessageSquare,
    },
    {
        label: 'Settings',
        href: '/instructor/settings',
        icon: Settings,
    },
];

/**
 * Student Navigation Items
 */
export const studentNavItems: NavItem[] = [
    {
        label: 'Dashboard',
        href: '/student',
        icon: LayoutDashboard,
    },
    {
        label: 'Browse Courses',
        href: '/student/browse',
        icon: BookOpen,
    },
    {
        label: 'My Courses',
        href: '/student/my-courses',
        icon: GraduationCap,
    },
    {
        label: 'Progress',
        href: '/student/progress',
        icon: BarChart3,
    },
    {
        label: 'Notifications',
        href: '/student/notifications',
        icon: Bell,
    },
    {
        label: 'Settings',
        href: '/student/settings',
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
