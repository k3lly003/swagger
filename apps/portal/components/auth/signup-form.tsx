"use client";

import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

import { Button } from "@workspace/ui/components/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@workspace/ui/components/form';

import apiClient from '@/lib/api-client';

export function SignupForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Signup form
    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirm_password: "",
        },
    });

    // Handle signup submission
    const handleSignup = async (data: { name: string; email: string; password: string; confirm_password: string }) => {
        setIsLoading(true);
        try {
            const response = await apiClient.post('/auth/register', {
                ...data,
                base_role: 'public', // Default role
                sendVerificationEmail: true
            });

            if (response.data.success) {
                toast.success('Account created successfully. Please check your email to verify your account.');
                router.push('/login');
            } else {
                toast.error('Signup failed. Please try again.');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex overflow-hidden rounded-lg shadow-xl mx-auto max-w-4xl">
            {/* Left panel - green with "Create Account" */}
            <div className="w-1/2 bg-primary-green text-white p-8 flex flex-col items-center justify-center">
                <div className="mb-6">
                    <Image
                        src="/images/logoLight.png"
                        alt="Logo"
                        width={100}
                        height={30}
                        className="object-contain"
                        priority
                    />
                </div>
                <h1 className="text-3xl font-bold mb-4 text-center">Create Account</h1>
                <p className="text-sm text-center mb-8">
                    Join our community and start your journey with us
                </p>

                <Link
                    href="/login"
                    className="border border-white rounded-full px-8 py-2 hover:bg-white hover:text-green-800 transition-colors"
                >
                    LOG IN
                </Link>
            </div>

            {/* Right panel - white with signup form */}
            <div className="w-2/3 bg-white p-8">
                <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-semibold text-center mb-2">Create Account</h2>
                    <p className="text-gray-500 text-center mb-6">Join our community and start your journey with us</p>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSignup)} className="space-y-5">
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="pl-10 py-2 block w-full border border-gray-200 rounded"
                                        {...form.register('name', {
                                            required: 'Full name is required',
                                            minLength: {
                                                value: 2,
                                                message: 'Name must be at least 2 characters'
                                            }
                                        })}
                                    />
                                </div>
                                {form.formState.errors.name && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {form.formState.errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="email@example.com"
                                        className="pl-10 py-2 block w-full border border-gray-200 rounded"
                                        {...form.register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /\S+@\S+\.\S+/,
                                                message: 'Invalid email address'
                                            }
                                        })}
                                    />
                                </div>
                                {form.formState.errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {form.formState.errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 py-2 block w-full border border-gray-200 rounded"
                                        {...form.register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 8,
                                                message: 'Password must be at least 8 characters'
                                            },
                                            validate: (value) => {
                                                const hasUpperCase = /[A-Z]/.test(value);
                                                const hasLowerCase = /[a-z]/.test(value);
                                                const hasNumber = /[0-9]/.test(value);
                                                const hasSpecialChar = /[^A-Za-z0-9]/.test(value);

                                                return (
                                                    (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) ||
                                                    'Password must include uppercase, lowercase, number, and special character'
                                                );
                                            }
                                        })}
                                    />
                                </div>
                                {form.formState.errors.password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {form.formState.errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Added Confirm Password Field */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 py-2 block w-full border border-gray-200 rounded"
                                        {...form.register('confirm_password', {
                                            required: 'Please confirm your password',
                                            validate: (value) => {
                                                return value === form.getValues('password') || 'Passwords do not match';
                                            }
                                        })}
                                    />
                                </div>
                                {form.formState.errors.confirm_password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {form.formState.errors.confirm_password.message}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-2 rounded-md text-white bg-primary-green"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating account...' : 'Sign Up'}
                            </Button>

                            <div className="text-center mt-4">
                                <p className="text-sm text-primary-green">
                                    Already have an account?{' '}
                                    <Link href="/login" className="text-blue-600 hover:underline">
                                        Log in
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}