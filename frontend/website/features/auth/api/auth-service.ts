import { axiosInstance } from '@/lib/axios';
import type {
    LoginInput,
    LoginResponse,
    RegisterInput,
    RegisterResponse,
    GetMeResponse,
    AuthResponseData,
    User,
} from '../types';

/**
 * Auth Service
 * API functions for authentication endpoints.
 * Handles the backend API response wrapper format.
 */
export const authService = {
    /**
     * Login user
     * POST /auth/login
     * @returns AuthResponseData (user + token)
     */
    login: async (data: LoginInput): Promise<AuthResponseData> => {
        const response = await axiosInstance.post<LoginResponse>('/auth/login', data);
        return response.data.data; // Extract data from API response wrapper
    },

    /**
     * Register new user
     * POST /auth/register
     * Sends firstName, lastName, email, password, role to backend
     * @returns AuthResponseData (user + token)
     */
    register: async (data: RegisterInput): Promise<AuthResponseData> => {
        // Remove confirmPassword before sending to backend
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...registerData } = data;
        const response = await axiosInstance.post<RegisterResponse>(
            '/auth/register',
            registerData
        );
        return response.data.data; // Extract data from API response wrapper
    },

    /**
     * Get current authenticated user
     * GET /auth/me
     * @returns User
     */
    getMe: async (): Promise<User> => {
        const response = await axiosInstance.get<GetMeResponse>('/auth/me');
        return response.data.data; // Extract user from API response wrapper
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
