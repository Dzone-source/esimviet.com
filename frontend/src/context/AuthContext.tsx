'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import api, { setUnauthorizedHandler } from '@/lib/api';

interface User {
  id: number;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isAdminRole(role?: string): boolean {
  return role?.toLowerCase() === 'admin';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem('admin_token');
    setUser(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    clearSession();
    window.location.href = '/admin/login';
  }, [clearSession]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
    });

    const token = localStorage.getItem('admin_token');
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch((err) => {
        // Only clear session on auth failure, not network blips
        if (err.response?.status === 401) {
          clearSession();
        }
      })
      .finally(() => setLoading(false));

    return () => {
      setUnauthorizedHandler(null);
    };
  }, [clearSession]);

  const login = async (username: string, password: string) => {
    const res = await api.post('/auth/login', { username, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('admin_token', String(token).trim());
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin: isAdminRole(user?.role),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
