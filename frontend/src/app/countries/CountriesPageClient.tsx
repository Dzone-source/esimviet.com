'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Globe, Filter, X } from 'lucide-react';
import api from '@/lib/api';
import CountryCard from '@/components/common/CountryCard';
import { PageLoader } from '@/components/common/LoadingSpinner';
import type { Country } from '@/types';

const REGIONS = ['All', 'Asia', 'Europe', 'Americas', 'Oceania', 'Africa', 'Middle East'];

export default function CountriesPageClient() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [region, setRegion] = useState('All');
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data: countries, isLoading } = useQuery({
    queryKey: ['countries', debouncedSearch, region],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (region !== 'All') params.set('region', region);
      const res = await api.get(`/countries?${params}`);
      return res.data.data as Country[];
    },
  });

  return (
    <div className="pt-20 pb-24 min-h-screen bg-surface-50">
      {/* Header */}
      <div className="hero-gradient py-14">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 border border-white/20 text-sm font-medium px-4 py-2 rounded-full mb-4">
              <Globe className="w-4 h-4" />
              100+ Destinations Available
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Choose Your Destination
            </h1>
            <p className="text-white/80 mb-8">
              Find the perfect eSIM plan for your next adventure
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country..."
                className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white text-gray-800 shadow-xl placeholder-gray-400 outline-none text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mt-8">
        {/* Region filter */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <div className="flex gap-2">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  region === r
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-surface-200 hover:border-primary-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : countries?.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No countries found</h3>
            <p className="text-gray-400">Try a different search term or region</p>
            <button
              onClick={() => { setSearch(''); setRegion('All'); }}
              className="mt-4 btn-secondary"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-6">
              {countries?.length} destination{countries?.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {countries?.map((country, i) => (
                <motion.div
                  key={country.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <CountryCard country={country} index={i} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
