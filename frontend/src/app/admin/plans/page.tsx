'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import type { Plan, Country } from '@/types';
import { Plus, Edit, Trash2, X, Package } from 'lucide-react';

export default function AdminPlansPage() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editPlan, setEditPlan] = useState<Plan | null>(null);

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['admin-plans'],
    queryFn: async () => {
      const res = await api.get('/admin/plans');
      return res.data.data as Plan[];
    },
  });

  const { data: countries = [] } = useQuery({
    queryKey: ['admin-countries-list'],
    queryFn: async () => {
      const res = await api.get('/admin/countries');
      return res.data.data as Country[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/plans/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-plans'] });
      toast.success('Plan deactivated');
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Plans</h1>
          <p className="text-gray-400 text-sm">Manage eSIM data plans</p>
        </div>
        <button
          onClick={() => { setEditPlan(null); setShowModal(true); }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add Plan
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-surface-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-100 bg-surface-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs">Plan</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs">Country</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs">Days</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs">Data</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs">Network</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs">Price</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-surface-50">
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : plans.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No plans yet</td></tr>
              ) : (
                plans.map((plan) => (
                  <tr key={plan.id} className={`border-b border-surface-50 hover:bg-surface-50 transition-colors ${!plan.is_active ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3 font-medium text-gray-900">{plan.title}</td>
                    <td className="px-4 py-3">{plan.country?.flag} {plan.country?.name}</td>
                    <td className="px-4 py-3 text-gray-600">{plan.days}d</td>
                    <td className="px-4 py-3 text-gray-600">{plan.data_amount}</td>
                    <td className="px-4 py-3 text-gray-600">{plan.network}</td>
                    <td className="px-4 py-3 font-bold text-primary-600">${Number(plan.price).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${plan.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {plan.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => { setEditPlan(plan); setShowModal(true); }}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Deactivate plan?')) deleteMutation.mutate(plan.id);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <PlanModal
            plan={editPlan}
            countries={countries}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false);
              qc.invalidateQueries({ queryKey: ['admin-plans'] });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PlanModal({
  plan,
  countries,
  onClose,
  onSuccess,
}: {
  plan: Plan | null;
  countries: Country[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    country_id: plan?.country_id?.toString() || '',
    title: plan?.title || '',
    days: plan?.days?.toString() || '',
    data_amount: plan?.data_amount || '',
    price: plan?.price?.toString() || '',
    description: plan?.description || '',
    network: plan?.network || '4G/LTE',
    hotspot: plan?.hotspot ?? true,
    speed: plan?.speed || '',
    is_active: plan?.is_active ?? true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (plan) {
        await api.put(`/admin/plans/${plan.id}`, formData);
        toast.success('Plan updated');
      } else {
        await api.post('/admin/plans', formData);
        toast.success('Plan created');
      }
      onSuccess();
    } catch {
      toast.error('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="p-5 border-b border-surface-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">{plan ? 'Edit Plan' : 'Add Plan'}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div>
            <label className="label">Country</label>
            <select
              value={formData.country_id}
              onChange={(e) => setFormData({ ...formData, country_id: e.target.value })}
              className="input text-sm"
              required
            >
              <option value="">Select country</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Plan Title</label>
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input text-sm"
              placeholder="Vietnam 7 Days"
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Days</label>
              <input
                type="number"
                value={formData.days}
                onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                className="input text-sm"
                min="1"
                required
              />
            </div>
            <div>
              <label className="label">Data Amount</label>
              <input
                value={formData.data_amount}
                onChange={(e) => setFormData({ ...formData, data_amount: e.target.value })}
                className="input text-sm"
                placeholder="10GB"
                required
              />
            </div>
            <div>
              <label className="label">Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="input text-sm"
                min="0.01"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Network</label>
              <input
                value={formData.network}
                onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                className="input text-sm"
                placeholder="4G/LTE"
              />
            </div>
            <div>
              <label className="label">Speed</label>
              <input
                value={formData.speed}
                onChange={(e) => setFormData({ ...formData, speed: e.target.value })}
                className="input text-sm"
                placeholder="100 Mbps"
              />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input text-sm resize-none"
              rows={2}
            />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hotspot}
                onChange={(e) => setFormData({ ...formData, hotspot: e.target.checked })}
              />
              <span className="text-sm">Hotspot</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <span className="text-sm">Active</span>
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-60">
              {loading ? '...' : (plan ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
