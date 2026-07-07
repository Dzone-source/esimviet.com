'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Wifi, Star, Users, Globe } from 'lucide-react';

const POPULAR_SEARCHES = ['Vietnam', 'Japan', 'Thailand', 'Singapore', 'Europe', 'USA'];

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/countries?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleQuickSearch = (term: string) => {
    router.push(`/countries?search=${encodeURIComponent(term)}`);
  };

  return (
    <section className="relative hero-gradient min-h-[92vh] flex items-center overflow-hidden pt-16">
      {/* Pattern overlay */}
      <div className="pattern-overlay absolute inset-0" />

      {/* Decorative blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/90 text-sm font-medium mb-6"
          >
            <Wifi className="w-4 h-4 text-blue-300" />
            Global eSIM for Travelers
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] mb-6"
          >
            Stay Connected
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-300">
              Everywhere You Go
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/80 text-lg md:text-xl mb-10 max-w-xl mx-auto"
          >
            Buy eSIM online for 100+ countries. No physical SIM, no roaming fees.
            Activate instantly on your phone.
          </motion.p>

          {/* Search box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto mb-4">
              <div className="flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden p-1.5 gap-2">
                <div className="flex items-center flex-1 gap-3 pl-3">
                  <Globe className="w-5 h-5 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search destination (e.g. Japan, Europe...)"
                    className="flex-1 py-3 text-gray-800 text-sm placeholder-gray-400 outline-none bg-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-3 rounded-xl transition-colors shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </form>

            {/* Popular searches */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-white/60 text-xs">Popular:</span>
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => handleQuickSearch(term)}
                  className="text-xs bg-white/10 hover:bg-white/20 text-white/90 border border-white/20 px-3 py-1.5 rounded-full transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-3 gap-4 mt-14 max-w-sm mx-auto"
          >
            {[
              { icon: Globe, value: '100+', label: 'Countries' },
              { icon: Users, value: '10K+', label: 'Customers' },
              { icon: Star, value: '4.9★', label: 'Rating' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="text-white/60 text-xs">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 30C480 60 240 0 0 30L0 60Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
