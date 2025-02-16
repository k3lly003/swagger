'use client';

import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

import { Button } from '@workspace/ui/components/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@workspace/ui/components/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@workspace/ui/components/input-otp';
import { Card } from '@workspace/ui/components/card';

import apiClient from '@/lib/api-client';
import {AtSign, LockKeyhole} from "lucide-react";

export function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
    const [twoFactorMethod, setTwoFactorMethod] = useState<'authenticator' | 'email'>('authenticator');
    const [tempToken, setTempToken] = useState<string | null>(null);

    // Regular login form
    const loginForm = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    // 2FA verification form
    const totpForm = useForm({
        defaultValues: {
            totpCode: '',
        },
    });

    // Handle login submission
    const handleLogin = async (data: { email: string; password: string }) => {
        setIsLoading(true);
        try {
            const response = await apiClient.post('/auth/login', data);

            // Check if two-factor authentication is required
            if (response.data.data?.requiresTwoFactor) {
                setRequiresTwoFactor(true);
                setTwoFactorMethod(response.data.data.twoFactorMethod);
                setTempToken(response.data.data.tempToken);
                toast.info('Two-factor authentication required');
            } else {
                // Direct login successful
                toast.success('Login successful');
                router.push('/dashboard');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle 2FA verification submission
    const handleVerify = async (data: { totpCode: string }) => {
        setIsLoading(true);
        try {
            const response = await apiClient.post('/verify-two-factor', {
                token: tempToken,
                code: data.totpCode
            });

            toast.success('Authentication successful');
            router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    // Render 2FA verification form if required
    if (requiresTwoFactor) {
        return (
            <Card className="w-full max-w-md mx-auto p-6 shadow-lg rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Two-Factor Authentication</h2>
                <p className="text-gray-500 mb-6">
                    Enter the verification code from your {twoFactorMethod === 'authenticator' ? 'authenticator app' : 'email'}
                </p>
                <Form {...totpForm}>
                    <form onSubmit={totpForm.handleSubmit(handleVerify)} className="space-y-6">
                        <FormField
                            control={totpForm.control}
                            name="totpCode"
                            render={({ field }) => (
                                <FormItem className="mx-auto flex flex-col items-center space-y-2">
                                    <FormControl>
                                        <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                                            <InputOTPGroup>
                                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                                    <InputOTPSlot key={index} index={index} />
                                                ))}
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full text-white bg-primary-green"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verifying...' : 'Verify'}
                        </Button>
                    </form>
                </Form>
            </Card>
        );
    }

    // Render login form with floating card design
    return (
        <div className="flex overflow-hidden rounded-lg shadow-xl mx-auto max-w-4xl">
            {/* Left panel - green with "Welcome Back" */}
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
                <h1 className="text-3xl font-bold mb-4 text-center">Welcome Back!</h1>
                <p className="text-sm text-center mb-8">To keep connected with us please login with your personal info</p>

                <Link href="/signup" className="border border-white rounded-full px-8 py-2 hover:bg-white hover:text-green-800 transition-colors">
                    SIGN UP
                </Link>
            </div>

            {/* Right panel - white with login form */}
            <div className="w-2/3 bg-white p-8">
                <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-semibold text-center mb-2">Login</h2>
                    <p className="text-gray-500 text-center mb-6">Welcome back! Please log in to your account.</p>

                    <div className="flex justify-center space-x-4 mb-6">
                        {/* Social login buttons */}
                        {['facebook', 'google', 'linkedin'].map((provider) => (
                            <button
                                key={provider}
                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                                aria-label={`Login with ${provider}`}
                            >
                                {/* Add SVG for each social provider */}
                                {provider === 'facebook' && (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#000">
                                        <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01z" />
                                    </svg>
                                )}
                                {provider === 'google' && (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#000">
                                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.5 19.05c-3.584-.167-6.55-3.133-6.717-6.717.166-3.584 3.133-6.55 6.717-6.716 1.5.9 2.717 3.15 2.967 5.417h-1.967v2.5h4.883c-.567 2.9-3.383 5.483-5.883 5.516z" />
                                    </svg>
                                )}
                                {provider === 'linkedin' && (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#000">
                                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>

                    <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-5">
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <AtSign className="h-4 w-4 text-black" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="email@example.com"
                                        className="pl-10 py-2 block w-full border border-gray-200 rounded"
                                        {...loginForm.register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /\S+@\S+\.\S+/,
                                                message: 'Invalid email address'
                                            }
                                        })}
                                    />
                                </div>
                                {loginForm.formState.errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {loginForm.formState.errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LockKeyhole className="h-4 w-4 text-black" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 py-2 block w-full border border-gray-200 rounded"
                                        {...loginForm.register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 8,
                                                message: 'Password must be at least 8 characters'
                                            }
                                        })}
                                    />
                                </div>
                                {loginForm.formState.errors.password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {loginForm.formState.errors.password.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-2 rounded-md text-white bg-primary-green"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Log in'}
                            </Button>

                            <div className="text-center mt-4">
                                <p className="text-sm text-primary-green">
                                    Don&apos;t have an account?{' '}
                                    <Link href="/signup" className="text-blue-600 hover:underline">
                                        Sign up
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