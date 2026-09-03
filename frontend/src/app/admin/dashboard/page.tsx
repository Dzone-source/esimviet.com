'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  ShoppingBag, DollarSign, Clock, CheckCircle, Globe, Package, TrendingUp, AlertCircle,
} from 'lucide-react';

interface Stats {
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  waitingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  countriesCount: number;
  plansCount: number;
}

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    enabled: !!user && !authLoading,
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data.data as Stats;
    },
  });

  const cards = [
    { label: 'Total Revenue', value: `$${Number(stats?.totalRevenue || 0).toFixed(2)}`, icon: DollarSign, color: 'bg-green-50 text-green-600', change: 'All time' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600', change: 'All time' },
    { label: 'Waiting Upload', value: stats?.waitingOrders || 0, icon: AlertCircle, color: 'bg-orange-50 text-orange-600', change: 'Need action' },
    { label: 'Completed', value: stats?.completedOrders || 0, icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600', change: 'Delivered' },
    { label: 'Pending Orders', value: stats?.pendingOrders || 0, icon: Clock, color: 'bg-yellow-50 text-yellow-600', change: 'Awaiting payment' },
    { label: 'Countries', value: stats?.countriesCount || 0, icon: Globe, color: 'bg-purple-50 text-purple-600', change: 'Active' },
    { label: 'Active Plans', value: stats?.plansCount || 0, icon: Package, color: 'bg-cyan-50 text-cyan-600', change: 'Active' },
    { label: 'Paid Orders', value: stats?.paidOrders || 0, icon: TrendingUp, color: 'bg-indigo-50 text-indigo-600', change: 'Processed' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 h-28 animate-pulse border border-surface-200" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl p-5 shadow-card border border-surface-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center`}>
                  <card.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-black text-gray-900 mb-0.5">{card.value}</div>
              <div className="text-gray-500 text-xs font-medium">{card.label}</div>
              <div className="text-gray-300 text-xs mt-0.5">{card.change}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-2xl p-6 shadow-card border border-surface-200">
        <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'View Orders', href: '/admin/orders', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
            { label: 'Upload eSIM', href: '/admin/orders?status=WaitingUpload', color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
            { label: 'Vietnam Settings', href: '/admin/countries', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
            { label: 'Add Plan', href: '/admin/plans', color: 'bg-green-50 text-green-700 hover:bg-green-100' },
          ].map(({ label, href, color }) => (
            <a
              key={label}
              href={href}
              className={`${color} px-4 py-3 rounded-xl text-sm font-semibold text-center transition-colors`}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
