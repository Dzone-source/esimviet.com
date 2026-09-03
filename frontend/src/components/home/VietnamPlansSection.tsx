'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import api from '@/lib/api';
import { getMaxSavingsAcrossPlans } from '@/lib/planPricing';
import PlanCard from '../common/PlanCard';
import { PageLoader } from '../common/LoadingSpinner';
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
    <section id="vietnam-plans" className="pt-10 md:pt-14 pb-16 md:pb-24 bg-white scroll-mt-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
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
              Up to {maxSavings}% cheaper than other travel eSIMs
            </p>
          )}
        </motion.div>

        {isLoading ? (
          <PageLoader />
        ) : plans.length === 0 ? (
          <p className="text-center text-gray-500">Plans coming soon.</p>
        ) : (
          <>
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

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-10"
            >
              <Link href="/countries/vietnam" className="btn-secondary">
                View All Vietnam Plans
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
