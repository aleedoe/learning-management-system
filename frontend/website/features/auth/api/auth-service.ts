import { axiosInstance } from '@/lib/axios';
import type {
    LoginInput,
    LoginResponse,
    RegisterInput,
    RegisterResponse,
    User,
} from '../types';

/**
 * Auth Service
 * API functions for authentication endpoints.
 */
export const authService = {
    /**
     * Login user
     * POST /auth/login
     */
    login: async (data: LoginInput): Promise<LoginResponse> => {
        const response = await axiosInstance.post<LoginResponse>('/auth/login', data);
        return response.data;
    },

    /**
     * Register new user
     * POST /auth/register
     */
    register: async (data: RegisterInput): Promise<RegisterResponse> => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...registerData } = data;
        const response = await axiosInstance.post<RegisterResponse>(
            '/auth/register',
            registerData
        );
        return response.data;
    },

    /**
     * Get current authenticated user
     * GET /auth/me
     */
    getMe: async (): Promise<User> => {
        const response = await axiosInstance.get<User>('/auth/me');
        return response.data;
    },

    /**
     * Logout user (client-side only)
     * Clears token from localStorage
     */
    logout: (): void => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
    },
};

export default authService;
