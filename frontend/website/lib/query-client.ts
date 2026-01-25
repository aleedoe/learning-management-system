import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack Query Client Configuration
 * Centralized configuration for React Query.
 */

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // Data is considered fresh for 1 minute
                staleTime: 60 * 1000,
                // Cache data for 5 minutes
                gcTime: 5 * 60 * 1000,
                // Retry failed requests up to 3 times
                retry: 3,
                // Don't refetch on window focus in development
                refetchOnWindowFocus: process.env.NODE_ENV === 'production',
            },
            mutations: {
                // Retry mutations once on failure
                retry: 1,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Get Query Client
 * Returns a singleton QueryClient on the browser, or creates a new one on the server.
 */
export function getQueryClient() {
    if (typeof window === 'undefined') {
        // Server: always make a new query client
        return makeQueryClient();
    } else {
        // Browser: make a new query client if we don't already have one
        if (!browserQueryClient) {
            browserQueryClient = makeQueryClient();
        }
        return browserQueryClient;
    }
}
