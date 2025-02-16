"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader } from "lucide-react";

import { useAuth } from '@/components/auth/auth-provider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackUrl?: string;
  roles?: string[];
}

export function ProtectedRoute({
                                   children,
                                   fallbackUrl = '/login',
                                   roles = [],
                               }: ProtectedRouteProps) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // Not authenticated? Redirect to login
    if (!isAuthenticated) {
      // Store the current URL so we can redirect back after login
      if (typeof window !== "undefined") {
        sessionStorage.setItem("redirectAfterLogin", pathname);
      }

      router.push(`${fallbackUrl}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Check roles if specified
    if (roles.length > 0 && user) {
      const hasRequiredRole = roles.includes(user.role);
      if (!hasRequiredRole) {
        router.push("/unauthorized");
      }
    }
  }, [isLoading, isAuthenticated, user, router, pathname, fallbackUrl, roles]);

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not authenticated or doesn't have the required role
  if (
    !isAuthenticated ||
    (roles.length > 0 && user && !roles.includes(user.role))
  ) {
    return null;
  }

  // User is authenticated (and has required role if specified)
  return <>{children}</>;
}

export default ProtectedRoute;
