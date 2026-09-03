'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Save, Settings, CreditCard, Share2, KeyRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminSettingsPage() {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    site_name: '',
    contact_email: '',
    facebook: '',
    paypal_client_id: '',
    paypal_secret: '',
  });
  const [accountData, setAccountData] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const res = await api.get('/settings');
      return res.data.data as Record<string, string>;
    },
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        site_name: settings.site_name || '',
        contact_email: settings.contact_email || '',
        facebook: settings.facebook || '',
        paypal_client_id: settings.paypal_client_id || '',
        paypal_secret: settings.paypal_secret || '',
      });
    }
  }, [settings]);

  useEffect(() => {
    if (user?.username) {
      setAccountData((prev) => ({ ...prev, username: user.username }));
    }
  }, [user?.username]);

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, string>) => api.put('/settings', data),
    onSuccess: () => toast.success('Settings saved'),
    onError: () => toast.error('Failed to save'),
  });

  const accountMutation = useMutation({
    mutationFn: (data: { currentPassword: string; username?: string; newPassword?: string }) =>
      api.put('/auth/account', data),
    onSuccess: (_res, variables) => {
      const usernameChanged = variables.username && variables.username !== user?.username;
      toast.success(usernameChanged ? 'Username updated — please sign in again' : 'Account updated');
      if (usernameChanged) {
        setTimeout(() => logout(), 800);
      } else {
        setAccountData((prev) => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      }
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || 'Failed to update account');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountData.currentPassword) {
      toast.error('Enter your current password');
      return;
    }
    if (accountData.newPassword && accountData.newPassword !== accountData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (accountData.username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    const payload: { currentPassword: string; username?: string; newPassword?: string } = {
      currentPassword: accountData.currentPassword,
    };

    if (accountData.username !== user?.username) {
      payload.username = accountData.username;
    }
    if (accountData.newPassword) {
      payload.newPassword = accountData.newPassword;
    }

    if (!payload.username && !payload.newPassword) {
      toast.error('Change username and/or enter a new password');
      return;
    }

    accountMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Settings</h1>
        <p className="text-gray-400 text-sm">Configure your eSIM store</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Admin account */}
        <motion.form
          onSubmit={handleAccountSubmit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-card border border-surface-200 space-y-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <KeyRound className="w-5 h-5 text-primary-600" />
            <h2 className="font-bold text-gray-900">Admin Account</h2>
          </div>
          <div>
            <label className="label">Username</label>
            <input
              value={accountData.username}
              onChange={(e) => setAccountData({ ...accountData, username: e.target.value })}
              className="input"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="label">Current Password</label>
            <input
              type="password"
              value={accountData.currentPassword}
              onChange={(e) => setAccountData({ ...accountData, currentPassword: e.target.value })}
              className="input"
              autoComplete="current-password"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">New Password (optional)</label>
              <input
                type="password"
                value={accountData.newPassword}
                onChange={(e) => setAccountData({ ...accountData, newPassword: e.target.value })}
                className="input"
                autoComplete="new-password"
                placeholder="Min. 6 characters"
              />
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input
                type="password"
                value={accountData.confirmPassword}
                onChange={(e) => setAccountData({ ...accountData, confirmPassword: e.target.value })}
                className="input"
                autoComplete="new-password"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={accountMutation.isPending}
            className="btn-secondary disabled:opacity-60"
          >
            {accountMutation.isPending ? 'Updating...' : 'Update Account'}
          </button>
        </motion.form>

        <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-card border border-surface-200"
        >
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-primary-600" />
            <h2 className="font-bold text-gray-900">General</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">Site Name</label>
              <input
                value={formData.site_name}
                onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                className="input"
                placeholder="eSIM Global"
              />
            </div>
            <div>
              <label className="label">Contact Email</label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="input"
                placeholder="support@youresim.com"
              />
            </div>
          </div>
        </motion.div>

        {/* Social */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-card border border-surface-200"
        >
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="w-5 h-5 text-primary-600" />
            <h2 className="font-bold text-gray-900">Social Media</h2>
          </div>
          <div>
            <label className="label">Facebook Page URL</label>
            <input
              value={formData.facebook}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
              className="input"
              placeholder="https://facebook.com/yourpage"
            />
          </div>
        </motion.div>

        {/* PayPal */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-card border border-surface-200"
        >
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-primary-600" />
            <h2 className="font-bold text-gray-900">PayPal Integration</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">PayPal Client ID</label>
              <input
                value={formData.paypal_client_id}
                onChange={(e) => setFormData({ ...formData, paypal_client_id: e.target.value })}
                className="input font-mono text-sm"
                placeholder="AaBbCc..."
              />
            </div>
            <div>
              <label className="label">PayPal Secret</label>
              <input
                type="password"
                value={formData.paypal_secret}
                onChange={(e) => setFormData({ ...formData, paypal_secret: e.target.value })}
                className="input font-mono text-sm"
                placeholder="••••••••"
              />
            </div>
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-blue-700 text-xs">
                💡 You can also set PayPal credentials via environment variables:
                <code className="block mt-1 font-mono bg-blue-100 px-2 py-1 rounded text-[11px]">
                  PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET
                </code>
              </p>
            </div>
          </div>
        </motion.div>

        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="btn-primary disabled:opacity-60"
        >
          {updateMutation.isPending ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Settings
        </button>
        </form>
      </div>
    </div>
  );
}
