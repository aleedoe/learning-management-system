/**
 * User Roles
 * Role-based authorization constants
 */

export const ROLES = {
    ADMIN: 'ADMIN',
    INSTRUCTOR: 'INSTRUCTOR',
    STUDENT: 'STUDENT',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const ROLE_LIST: Role[] = Object.values(ROLES);
