'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, saveToken, removeToken, isAuthenticated, AUTH_EXPIRED_EVENT } from './api';

interface User {
    email: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isLoggedIn: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

function base64UrlDecode(input: string): string {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    return atob(padded);
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated()) {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const parts = token.split('.');
                    if (parts[1]) {
                        const payload = JSON.parse(base64UrlDecode(parts[1]));
                        const isExpired = typeof payload.exp === 'number' && payload.exp * 1000 < Date.now();
                        if (isExpired) {
                            removeToken();
                        } else {
                            setUser({ email: payload.email });
                        }
                    } else {
                        removeToken();
                    }
                } catch {
                    removeToken();
                }
            }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const handleAuthExpired = () => setUser(null);
        window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
        return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await apiLogin(email, password);
            if (response.token) {
                saveToken(response.token);
                setUser({ email });
                return { success: true };
            }
            return { success: false, error: response.message || 'Login failed' };
        } catch (error) {
            return { success: false, error: 'Network error. Please try again.' };
        }
    };

    const register = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await apiRegister(email, password);
            if (response.token) {
                saveToken(response.token);
                setUser({ email });
                return { success: true };
            }
            return { success: false, error: response.message || 'Registration failed' };
        } catch (error) {
            return { success: false, error: 'Network error. Please try again.' };
        }
    };

    const logout = () => {
        removeToken();
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, isLoggedIn: !!user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
