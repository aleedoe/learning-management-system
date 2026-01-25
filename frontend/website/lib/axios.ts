import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from './env';

/**
 * Axios Instance
 * Configured with base URL and interceptors for JWT authentication.
 */
export const axiosInstance = axios.create({
    baseURL: env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

/**
 * Request Interceptor
 * Automatically attaches JWT token from localStorage to Authorization header.
 */
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Only access localStorage on client-side
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor
 * Handles 401 Unauthorized errors globally.
 * Clears localStorage token and Zustand auth store.
 */
axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Clear auth state on 401
            if (typeof window !== 'undefined') {
                // Clear token from localStorage
                localStorage.removeItem('token');

                // Clear Zustand persisted auth storage
                localStorage.removeItem('auth-storage');

                // Redirect to login page (avoid redirect loops)
                const currentPath = window.location.pathname;
                if (!currentPath.startsWith('/login') && !currentPath.startsWith('/register')) {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
