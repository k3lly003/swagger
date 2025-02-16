"use client";

import * as React from 'react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@workspace/ui/components/card";
import { Loader } from "lucide-react";

import apiClient from '@/lib/api-client';

export function VerifyEmail() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState('');

  React.useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Invalid verification link. Please request a new one.");
      return;
    }

        const verify = async () => {
            try {
                const response = await apiClient.post('/auth/verify-email', { token });

                if (response.data.success) {
                    setStatus('success');
                    toast.success('Email verified successfully!');
                } else {
                    setStatus('error');
                    setErrorMessage('Failed to verify email. Please try again.');
                    toast.error('Email verification failed');
                }
            } catch (error: any) {
                setStatus('error');
                const errorMsg = error.response?.data?.message || 'Failed to verify email. Please try again.';
                setErrorMessage(errorMsg);
                toast.error(errorMsg);
            } finally {
                // If there's no token, we've already set the error state
                if (token) {
                    setStatus('error');
                }
            }
        };

        verify();
    }, [token]);

    if (status === 'loading') {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Verifying Your Email</CardTitle>
                    <CardDescription>
                        Please wait while we verify your email address...
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Loader className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

  if (status === "error") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Verification Failed</CardTitle>
          <CardDescription>
            We were unable to verify your email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">{errorMessage}</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/login">Return to login</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Email Verified!</CardTitle>
        <CardDescription>
          Your email address has been successfully verified.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          You can now log in to your account and start using all features.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button asChild>
          <Link href="/login">Log in to your account</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
