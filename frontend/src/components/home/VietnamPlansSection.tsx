'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Sparkles, Wifi } from 'lucide-react';
import api from '@/lib/api';
import { getMaxSavingsAcrossPlans } from '@/lib/planPricing';
import PlanCard from '../common/PlanCard';
import { PageLoader } from '../common/LoadingSpinner';
import ProductNoticeSection from '@/components/product/ProductNoticeSection';
import type { Country } from '@/types';

export default function VietnamPlansSection() {
  const { data: country, isLoading } = useQuery({
    queryKey: ['country', 'vietnam'],
    queryFn: async () => {
      const res = await api.get('/countries/vietnam');
      return res.data.data as Country;
    },
  });

  const plans = country?.plans || [];
  const featuredIndex = plans.length > 1 ? Math.floor(plans.length / 2) : -1;
  const maxSavings = getMaxSavingsAcrossPlans(plans);

  return (
    <section id="vietnam-plans" className="pt-10 md:pt-14 pb-12 md:pb-16 bg-white scroll-mt-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            Vietnam eSIM Plans
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            Choose Your Vietnam Plan
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Affordable 4G/5G data for travelers in Vietnam. Hotspot included on every plan.
          </p>
          {maxSavings > 0 && (
            <p className="text-sm font-semibold text-emerald-600 mt-3">
              Up to {maxSavings}% cheaper than Holafly & Airalo
            </p>
          )}
        </motion.div>

        <ProductNoticeSection />

        {isLoading ? (
          <PageLoader />
        ) : plans.length === 0 ? (
          <div className="text-center py-16 bg-surface-50 rounded-2xl">
            <Wifi className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-600 mb-1">Plans coming soon</h3>
            <p className="text-gray-400 text-sm">We&apos;re working on adding Vietnam plans</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <PlanCard plan={plan} countrySlug="vietnam" featured={i === featuredIndex} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
