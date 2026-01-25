'use client';

import { Toaster } from 'sonner';

/**
 * Toast Provider
 * Provides toast notifications using Sonner.
 * Configured with consistent styling across the app.
 */
export function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            richColors
            closeButton
            expand={false}
            toastOptions={{
                duration: 4000,
                classNames: {
                    toast: 'font-sans',
                },
            }}
        />
    );
}

export default ToastProvider;
