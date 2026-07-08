'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

function hasAdminToken(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('admin_token')?.trim();
}

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const authenticated = !!user && isAdmin;
  const token = hasAdminToken();

  useEffect(() => {
    if (loading) return;

    if (authenticated && pathname === '/admin/login') {
      router.replace('/admin/dashboard');
      return;
    }

    if (!authenticated && !token && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [authenticated, loading, pathname, router, token]);

  if (loading || (token && !user && pathname !== '/admin/login')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}
