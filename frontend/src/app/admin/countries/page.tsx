'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import type { Country } from '@/types';
import { Plus, Edit, Trash2, Globe, X, Check } from 'lucide-react';

export default function AdminCountriesPage() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editCountry, setEditCountry] = useState<Country | null>(null);

  const { data: countries = [], isLoading } = useQuery({
    queryKey: ['admin-countries'],
    queryFn: async () => {
      const res = await api.get('/admin/countries');
      return res.data.data as Country[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/countries/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-countries'] });
      toast.success('Country deactivated');
    },
    onError: () => toast.error('Failed'),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Countries</h1>
          <p className="text-gray-400 text-sm">Manage destination countries</p>
        </div>
        <button
          onClick={() => { setEditCountry(null); setShowModal(true); }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add Country
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-28 animate-pulse border border-surface-200" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {countries.map((country, i) => (
            <motion.div
              key={country.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className={`bg-white rounded-2xl p-4 shadow-card border ${country.is_active ? 'border-surface-200' : 'border-red-100 opacity-60'}`}
            >
              <div className="text-3xl mb-2">{country.flag}</div>
              <p className="font-bold text-gray-900 text-sm truncate">{country.name}</p>
              <p className="text-gray-400 text-xs mb-1">{country.region}</p>
              <div className="flex items-center gap-1 mb-3">
                {country.is_popular && (
                  <span className="badge bg-yellow-50 text-yellow-700 text-[10px]">Popular</span>
                )}
                {!country.is_active && (
                  <span className="badge bg-red-50 text-red-700 text-[10px]">Inactive</span>
                )}
              </div>
              <p className="text-gray-300 text-xs mb-3">{country._count?.plans || 0} plans</p>
              <div className="flex gap-1">
                <button
                  onClick={() => { setEditCountry(country); setShowModal(true); }}
                  className="flex-1 p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg text-center transition-colors"
                >
                  <Edit className="w-3.5 h-3.5 mx-auto" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Deactivate ${country.name}?`)) deleteMutation.mutate(country.id);
                  }}
                  className="flex-1 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-center transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 mx-auto" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <CountryModal
            country={editCountry}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false);
              qc.invalidateQueries({ queryKey: ['admin-countries'] });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CountryModal({
  country,
  onClose,
  onSuccess,
}: {
  country: Country | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: country?.name || '',
    slug: country?.slug || '',
    flag: country?.flag || '',
    region: country?.region || '',
    is_popular: country?.is_popular ?? false,
    is_active: country?.is_active ?? true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (country) {
        await api.put(`/admin/countries/${country.id}`, formData);
        toast.success('Country updated');
      } else {
        await api.post('/admin/countries', formData);
        toast.success('Country created');
      }
      onSuccess();
    } catch {
      toast.error('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

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
        className="bg-white rounded-2xl w-full max-w-md"
      >
        <div className="p-5 border-b border-surface-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">{country ? 'Edit Country' : 'Add Country'}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Country Name</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })}
                className="input text-sm"
                required
              />
            </div>
            <div>
              <label className="label">Slug</label>
              <input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="input text-sm font-mono"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Flag Emoji</label>
              <input
                value={formData.flag}
                onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
                className="input text-sm"
                placeholder="🇻🇳"
                required
              />
            </div>
            <div>
              <label className="label">Region</label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="input text-sm"
              >
                <option value="">Select region</option>
                {['Asia', 'Europe', 'Americas', 'Oceania', 'Africa', 'Middle East'].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_popular}
                onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Popular</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-60">
              {loading ? '...' : (country ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
