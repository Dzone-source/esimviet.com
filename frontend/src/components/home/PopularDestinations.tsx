'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import api from '@/lib/api';
import CountryCard from '../common/CountryCard';
import { PageLoader } from '../common/LoadingSpinner';
import type { Country } from '@/types';

export default function PopularDestinations() {
  const { data, isLoading } = useQuery({
    queryKey: ['countries', 'popular'],
    queryFn: async () => {
      const res = await api.get('/countries?popular=true');
      return res.data.data as Country[];
    },
  });

  return (
    <section className="section bg-white">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            Popular Destinations
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            Top Travel Destinations
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Choose from our most popular countries and get connected in minutes.
          </p>
        </motion.div>

        {isLoading ? (
          <PageLoader />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {data?.slice(0, 12).map((country, i) => (
                <motion.div
                  key={country.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <CountryCard country={country} index={i} />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-10"
            >
              <Link href="/countries" className="btn-secondary">
                View All Countries
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
