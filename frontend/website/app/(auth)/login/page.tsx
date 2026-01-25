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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary">
                        LMS Platform
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Your gateway to learning
                    </p>
                </div>

                {/* Login Form */}
                <LoginForm />
            </div>
        </div>
    );
}
