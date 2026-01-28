import { LoginForm } from '@/features/auth/components/login-form';

export const metadata = {
    title: 'Login | LMS Platform',
    description: 'Sign in to your LMS account',
};

/**
 * Login Page
 * Route: /login
 */
export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/5 via-background to-secondary/5 p-4">
            <div className="w-full max-w-md">
                {/* Login Form */}
                <LoginForm />
            </div>
        </div>
    );
}
