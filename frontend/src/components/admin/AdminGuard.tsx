'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

function hasAdminToken(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('admin_token');
}

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(hasAdminToken());
  }, [user, loading]);

  useEffect(() => {
    if (loading) return;

    if (user && isAdmin && pathname === '/admin/login') {
      router.replace('/admin/dashboard');
      return;
    }

    if (!user && !hasToken && pathname !== '/admin/login') {
      router.replace('/admin/login');
      return;
    }

    if (user && !isAdmin && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [user, loading, isAdmin, pathname, router, hasToken]);

  // Wait for /auth/me when token exists but user state not ready yet
  if (loading || (hasToken && !user && pathname !== '/admin/login')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
