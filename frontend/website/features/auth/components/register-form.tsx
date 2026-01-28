'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { useRegister } from '../hooks/use-auth';
import { registerSchema, type RegisterInput, type UserRole } from '../types';

/**
 * RegisterForm Component
 * A polished registration form using shadcn/ui components.
 * Features:
 * - Form validation with React Hook Form + Zod
 * - Password visibility toggle
 * - Role selection
 * - Loading states
 * - Error handling with toast notifications
 * 
 * Updated to use firstName and lastName fields matching backend schema.prisma
 */
export function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { mutate: registerUser, isPending } = useRegister();

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'STUDENT',
        },
    });

    const selectedRole = useWatch({ control, name: 'role' });

    const onSubmit = (data: RegisterInput) => {
        registerUser(data);
    };

    return (
        <Card className="w-full max-w-md mx-auto shadow-lg bg-card text-card-foreground">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold tracking-tight">
                    Create Account
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    Join our learning platform today
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    {/* Name Fields Row */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* First Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                type="text"
                                placeholder="John"
                                autoComplete="given-name"
                                disabled={isPending}
                                {...register('firstName')}
                                className={errors.firstName ? 'border-destructive' : ''}
                            />
                            {errors.firstName && (
                                <p className="text-sm text-destructive">
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>

                        {/* Last Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                type="text"
                                placeholder="Doe"
                                autoComplete="family-name"
                                disabled={isPending}
                                {...register('lastName')}
                                className={errors.lastName ? 'border-destructive' : ''}
                            />
                            {errors.lastName && (
                                <p className="text-sm text-destructive">
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            disabled={isPending}
                            {...register('email')}
                            className={errors.email ? 'border-destructive' : ''}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-2">
                        <Label>I want to</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    const input = document.querySelector('input[name="role"][value="STUDENT"]') as HTMLInputElement;
                                    if (input) input.click();
                                }}
                                className={`p-3 rounded-lg border-2 transition-all ${selectedRole === 'STUDENT'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-muted hover:border-muted-foreground/50'
                                    }`}
                            >
                                <div className="text-sm font-medium">Learn</div>
                                <div className="text-xs text-muted-foreground">
                                    As a Student
                                </div>
                                <input
                                    type="radio"
                                    value="STUDENT"
                                    className="sr-only"
                                    {...register('role')}
                                />
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const input = document.querySelector('input[name="role"][value="INSTRUCTOR"]') as HTMLInputElement;
                                    if (input) input.click();
                                }}
                                className={`p-3 rounded-lg border-2 transition-all ${selectedRole === 'INSTRUCTOR'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-muted hover:border-muted-foreground/50'
                                    }`}
                            >
                                <div className="text-sm font-medium">Teach</div>
                                <div className="text-xs text-muted-foreground">
                                    As an Instructor
                                </div>
                                <input
                                    type="radio"
                                    value="INSTRUCTOR"
                                    className="sr-only"
                                    {...register('role')}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a password"
                                autoComplete="new-password"
                                disabled={isPending}
                                {...register('password')}
                                className={`pr-10 ${errors.password ? 'border-destructive' : ''}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-destructive">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                autoComplete="new-password"
                                disabled={isPending}
                                {...register('confirmPassword')}
                                className={`pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-sm text-destructive">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            <>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Create Account
                            </>
                        )}
                    </Button>

                    {/* Login Link */}
                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="font-medium text-primary hover:text-primary/80 hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}

export default RegisterForm;
