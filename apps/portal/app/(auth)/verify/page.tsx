"use client";

import { Suspense } from "react";
import { VerifyEmail } from "@/components/auth";
import { Logo } from "@/components/ui/logo";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter
} from "@workspace/ui/components/card";

function VerifyEmailSkeleton() {
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-2">
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-4 w-2/3 mx-auto" />
            </CardFooter>
        </Card>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4">
            <div className="mb-8 flex flex-col items-center">
                <Logo className="h-12 w-auto" />
                <h1 className="mt-4 text-2xl font-bold tracking-tight">
                    Email Verification
                </h1>
            </div>
            <div className="w-full max-w-md">
                <Suspense fallback={<VerifyEmailSkeleton />}>
                    <VerifyEmail />
                </Suspense>
            </div>
        </div>
    );
}