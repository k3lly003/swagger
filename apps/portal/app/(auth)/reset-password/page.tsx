"use client";

import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth";
import { Logo } from "@/components/ui/logo";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter
} from "@workspace/ui/components/card";

function ResetPasswordSkeleton() {
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-2">
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-4 w-full" />
            </CardFooter>
        </Card>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4">
            <div className="mb-8 flex flex-col items-center">
                <Logo className="h-12 w-auto" />
                <h1 className="mt-4 text-2xl font-bold tracking-tight">
                    Reset Your Password
                </h1>
                <p className="mt-2 text-center text-muted-foreground">
                    Create a new secure password for your account
                </p>
            </div>
            <div className="w-full max-w-md">
                <Suspense fallback={<ResetPasswordSkeleton />}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}