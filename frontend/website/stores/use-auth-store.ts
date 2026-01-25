import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/features/auth/types';

/**
 * Auth Store State Interface
 */
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

/**
 * Auth Store Actions Interface
 */
interface AuthActions {
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    setUser: (user: User) => void;
}

type AuthStore = AuthState & AuthActions;

/**
 * Auth Store
 * Manages client-side authentication state using Zustand.
 * Persists user data to localStorage for session persistence.
 */
export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            // Initial State
            user: null,
            isAuthenticated: false,

            // Actions
            /**
             * Set auth state after successful login
             * Also stores the JWT token in localStorage
             */
            setAuth: (user: User, token: string) => {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('token', token);
                }
                set({
                    user,
                    isAuthenticated: true,
                });
            },

            /**
             * Clear auth state on logout
             * Removes token from localStorage
             */
            logout: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                }
                set({
                    user: null,
                    isAuthenticated: false,
                });
            },

            /**
             * Update user data without changing token
             * Useful for refreshing user profile
             */
            setUser: (user: User) => {
                set({ user, isAuthenticated: true });
            },
        }),
        {
            name: 'auth-storage', // localStorage key
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export default useAuthStore;
