import { RegisterForm } from '@/features/auth/components/register-form';

export const metadata = {
    title: 'Register | LMS Platform',
    description: 'Create your LMS account',
};

/**
 * Register Page
 * Route: /register
 */
export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary">
                        LMS Platform
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Start your learning journey
                    </p>
                </div>

                {/* Register Form */}
                <RegisterForm />
            </div>
        </div>
    );
}
