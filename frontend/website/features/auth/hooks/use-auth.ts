import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '../api/auth-service';
import { useAuthStore } from '@/stores/use-auth-store';
import type { LoginInput, RegisterInput, User } from '../types';
import { AxiosError } from 'axios';

/**
 * Auth Query Keys
 * Centralized keys for React Query cache management
 */
export const authKeys = {
    all: ['auth'] as const,
    user: () => [...authKeys.all, 'user'] as const,
};

/**
 * Custom Hook: useLogin
 * Handles user login with TanStack Query mutation.
 */
export function useLogin() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: LoginInput) => authService.login(data),
        onSuccess: (response) => {
            // Store token and update auth state
            setAuth(response.user, response.token);

            // Invalidate user query to refetch fresh data
            queryClient.invalidateQueries({ queryKey: authKeys.user() });

            // Show success toast
            toast.success('Login successful!', {
                description: `Welcome back, ${response.user.name}!`,
            });

            // Redirect based on user role
            const redirectPath = getRedirectPath(response.user.role);
            router.push(redirectPath);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            const message =
                error.response?.data?.message ||
                'Login failed. Please check your credentials.';
            toast.error('Login Failed', {
                description: message,
            });
        },
    });
}

/**
 * Custom Hook: useRegister
 * Handles user registration with TanStack Query mutation.
 */
export function useRegister() {
    const router = useRouter();

    return useMutation({
        mutationFn: (data: RegisterInput) => authService.register(data),
        onSuccess: (response) => {
            // Show success toast
            toast.success('Registration successful!', {
                description: `Welcome, ${response.user.name}! Please login to continue.`,
            });

            // Redirect to login page
            router.push('/login');
        },
        onError: (error: AxiosError<{ message: string }>) => {
            const message =
                error.response?.data?.message ||
                'Registration failed. Please try again.';
            toast.error('Registration Failed', {
                description: message,
            });
        },
    });
}

/**
 * Custom Hook: useUser
 * Fetches current authenticated user with TanStack Query.
 * Used for session persistence on page refresh.
 */
export function useUser() {
    const { setUser, logout, isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: authKeys.user(),
        queryFn: async () => {
            const user = await authService.getMe();
            setUser(user);
            return user;
        },
        // Only fetch if there's a token in localStorage
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error) => {
            // Don't retry on 401 errors
            if (error instanceof AxiosError && error.response?.status === 401) {
                logout();
                return false;
            }
            return failureCount < 2;
        },
    });
}

/**
 * Custom Hook: useLogout
 * Handles user logout with cleanup.
 */
export function useLogout() {
    const router = useRouter();
    const { logout } = useAuthStore();
    const queryClient = useQueryClient();

    return () => {
        // Clear auth state
        logout();
        authService.logout();

        // Clear all queries
        queryClient.clear();

        // Show toast
        toast.success('Logged out successfully');

        // Redirect to login
        router.push('/login');
    };
}

/**
 * Helper: Get redirect path based on user role
 */
function getRedirectPath(role: User['role']): string {
    switch (role) {
        case 'ADMIN':
            return '/admin';
        case 'INSTRUCTOR':
            return '/instructor';
        case 'STUDENT':
            return '/student';
        default:
            return '/';
    }
}
