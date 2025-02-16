"use client";

import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { Card } from '@workspace/ui/components/card';

import apiClient from '@/lib/api-client';

export function ForgotPasswordForm() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

  // Forgot password form
  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

    // Handle forgot password submission
    const handleForgotPassword = async (data: { email: string }) => {
        setIsLoading(true);
        try {
            const response = await apiClient.post('/auth/forgot-password', data);

            if (response.data.success) {
                setIsSubmitted(true);
                toast.success('Password reset instructions sent to your email');
            } else {
                toast.error('Failed to send password reset instructions');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send password reset instructions');
        } finally {
            setIsLoading(false);
        }
    };

    // If the request has been submitted, show a success message
    if (isSubmitted) {
        return (
            <Card className="w-full max-w-md mx-auto p-6 shadow-lg rounded-lg">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="h-8 w-8 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-center">Check Your Email</h2>
                    <p className="text-gray-500 text-center mt-2">
                        We've sent password reset instructions to your email address.
                    </p>
                </div>

                <div className="mb-6">
                    <p className="text-center text-gray-600">
                        Please check your inbox and follow the link to reset your password.
                        If you don't see the email, check your spam folder.
                    </p>
                </div>

                <div className="flex justify-center">
                    <Link
                        href="/login"
                        className="py-2 px-4 rounded-md text-primary-green border border-primary-green hover:bg-green-50 transition-colors"
                    >
                        Return to login
                    </Link>
                </div>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto p-6 shadow-lg rounded-lg">
            <div className="flex flex-col items-center mb-6">
                <Image
                    src="/logo.png"
                    alt="Logo"
                    width={100}
                    height={40}
                    className="object-contain"
                    priority
                />
                <h2 className="text-2xl font-semibold text-center">Forgot Password</h2>
                <p className="text-gray-500 text-center mt-2">
                    Enter your email and we'll send you a link to reset your password
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleForgotPassword)} className="space-y-5">
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

                    <Button
                        type="submit"
                        className="w-full py-2 rounded-md text-white bg-primary-green"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Submitting...' : 'Send Reset Link'}
                    </Button>

                    <div className="text-center mt-4">
                        <p className="text-sm text-primary-green">
                            Remember your password?{' '}
                            <Link href="/login" className="text-blue-600 hover:underline">
                                Log in
                            </Link>
                        </p>
                    </div>
                </form>
            </Form>
        </Card>
    );
}
