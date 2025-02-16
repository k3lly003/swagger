"use client";

import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@workspace/ui/components/card";

import apiClient from '@/lib/api-client';

export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';
    const [isLoading, setIsLoading] = useState(false);

    // Reset password form
    const form = useForm({
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
        mode: 'onBlur'
    });

    // Handle reset password submission
    const handleResetPassword = async (data: { password: string; confirmPassword: string }) => {
        // Validate passwords match
        if (data.password !== data.confirmPassword) {
            form.setError('confirmPassword', {
                type: 'manual',
                message: 'Passwords do not match'
            });
            return;
        }

        if (!token) {
            toast.error('Invalid or missing reset token');
            return;
        }

        setIsLoading(true);
        try {
            const response = await apiClient.post('/auth/reset-password', {
                token,
                password: data.password,
                confirmPassword: data.confirmPassword
            });

            if (response.data.success) {
                toast.success('Password reset successfully');
                router.push('/login');
            } else {
                toast.error('Failed to reset password');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>
                    Enter your new password to reset your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleResetPassword)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="••••••••"
                                            type="password"
                                            {...field}
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
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="••••••••"
                                            type="password"
                                            {...field}
                                            {...form.register('confirmPassword', {
                                                required: 'Please confirm your password',
                                            })}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Resetting password...' : 'Reset Password'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                    Remember your password?{' '}
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Log in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
