'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';

// User interface based on your backend schema
export interface User {
    id: string;
    name: string;
    email: string;
    role_id: number;
    avatar_url: string | null;
    email_verified: boolean;
}

// Auth context type
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    logout: async () => {},
    refreshUser: async () => {}
});

// Protected routes that require authentication
const protectedRoutes = ['/profile', '/dashboard', '/settings', '/users'];

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);

    // Function to fetch user data
    const fetchUser = async () => {
        try {
            const response = await apiClient.get('/auth/me');
            console.log('Auth response:', response.data);

            if (response.data.user) {
                setUser(response.data.user);
                return true;
            } else {
                setUser(null);
                return false;
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            setUser(null);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Public function to refresh user data
    const refreshUser = async () => {
        setIsLoading(true);
        await fetchUser();
    };

    // Check auth on mount and handle redirects
    useEffect(() => {
        const checkAuth = async () => {
            const hasUser = await fetchUser();
            setAuthChecked(true);

            // Check if we need to redirect
            const isProtectedRoute = protectedRoutes.some(route =>
                pathname?.startsWith(route)
            );

            if (!hasUser && isProtectedRoute) {
                toast.error('Please log in to access this page');
                router.push('/login');
            }
        };

        checkAuth();
    }, [pathname]);

    // Logout functionality
    const logout = async () => {
        try {
            await apiClient.post('/auth/logout');

            // Clear tokens from localStorage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            // Clear user state
            setUser(null);

            // Show success toast
            toast.success('Logged out successfully');

            // Redirect to login page
            router.push('/login');
        } catch (error: any) {
            // Handle logout error
            toast.error(error.response?.data?.message || 'Logout failed');
            console.error('Logout error:', error);
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading: isLoading || !authChecked,
        logout,
        refreshUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}