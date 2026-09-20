import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { User, AuthSession, LoginCredentials, SignupData, AuthResponse, AuthContextType } from '../types/auth';
import { authService } from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize session on mount
  useEffect(() => {
    try {
      const activeSession = authService.getSession();
      if (activeSession) {
        setSession(activeSession);
      }
    } catch (e) {
      console.error('Failed to restore auth session', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setError(null);
    try {
      const res = await authService.login(credentials);
      if (res.success && res.session) {
        setSession(res.session);
        return res;
      }
      setError(res.error || 'Authentication failed');
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during login.';
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  const signup = useCallback(async (data: SignupData): Promise<AuthResponse> => {
    setError(null);
    try {
      const res = await authService.signup(data);
      if (res.success && res.session) {
        setSession(res.session);
        return res;
      }
      setError(res.error || 'Registration failed');
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during signup.';
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
    } finally {
      setSession(null);
      setError(null);
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    setError(null);
    return await authService.resetPassword(email);
  }, []);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user: session?.user || null,
      session,
      isAuthenticated: Boolean(session?.user && Date.now() < (session?.expiresAt || 0)),
      isLoading,
      error,
      login,
      signup,
      logout,
      resetPassword,
      clearError,
    }),
    [session, isLoading, error, login, signup, logout, resetPassword, clearError]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
