import { create } from 'zustand';

/**
 * Sidebar Store
 * Manages the open/close state of the dashboard sidebar.
 * Used across Admin, Instructor, and Student dashboards.
 */

interface SidebarState {
    isOpen: boolean;
    isCollapsed: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
    setCollapsed: (collapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
    isOpen: true,
    isCollapsed: false,

    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
}));
