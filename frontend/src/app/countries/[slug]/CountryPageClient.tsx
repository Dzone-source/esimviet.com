'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Wifi } from 'lucide-react';
import api from '@/lib/api';
import { getMaxSavingsAcrossPlans } from '@/lib/planPricing';
import PlanCard from '@/components/common/PlanCard';
import PlanPriceComparison from '@/components/common/PlanPriceComparison';
import { PageLoader } from '@/components/common/LoadingSpinner';
import DeviceCompatibilitySection from '@/components/home/DeviceCompatibilitySection';
import HowToUseSection from '@/components/home/HowToUseSection';
import ProductNoticeSection from '@/components/product/ProductNoticeSection';
import RefundPolicySection from '@/components/product/RefundPolicySection';
import ProductFAQSection from '@/components/product/ProductFAQSection';
import CountryHeroBanner from '@/components/countries/CountryHeroBanner';
import type { Country } from '@/types';

interface Props { slug: string; }

const TRAVEL_TIPS = [
  'Best time to visit: March–April and September–November',
  'Currency: Vietnamese Dong (VND)',
  'Capital: Hanoi | Major city: Ho Chi Minh City',
  'Known for: Ha Long Bay, Ancient Hoi An, delicious street food',
];

function TravelTipsCard({ countryName }: { countryName: string }) {
  return (
    <section className="section bg-surface-50 pt-0">
      <div className="container max-w-3xl">
        <div className="bg-white rounded-2xl p-6 shadow-card border border-surface-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Travel Tips for {countryName}</h3>
          <ul className="space-y-2">
            {TRAVEL_TIPS.map((tip) => (
              <li key={tip} className="text-gray-600 text-sm">• {tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function CountryPageClient({ slug }: Props) {
  const { data: country, isLoading, isError } = useQuery({
    queryKey: ['country', slug],
    queryFn: async () => {
      const res = await api.get(`/countries/${slug}`);
      return res.data.data as Country;
    },
  });

  if (isLoading) return <div className="pt-16"><PageLoader /></div>;

  if (isError || !country) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌍</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Country not found</h1>
          <Link href="/countries/vietnam" className="btn-primary mt-4">View Vietnam Plans</Link>
        </div>
      </div>
    );
  }

  const plans = country.plans || [];
  const featuredIndex = plans.length > 1 ? Math.floor(plans.length / 2) : -1;
  const maxSavings = getMaxSavingsAcrossPlans(plans);

  return (
    <div className="pt-16">
      <CountryHeroBanner country={country} planCount={plans.length} />

      {/* Plans */}
      <section className="section bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              Available Plans for {country.name}
            </h2>
            <p className="text-gray-500">
              All plans include 4G/LTE data with hotspot sharing. Choose the one that fits your trip.
            </p>
            {maxSavings > 0 && (
              <p className="text-sm font-semibold text-emerald-600 mt-2">
                Up to {maxSavings}% cheaper than Holafly & Airalo
              </p>
            )}
          </motion.div>

          {slug === 'vietnam' && <ProductNoticeSection />}

          {plans.length === 0 ? (
            <div className="text-center py-16 bg-surface-50 rounded-2xl">
              <Wifi className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-600 mb-1">Plans coming soon</h3>
              <p className="text-gray-400 text-sm">We're working on adding plans for {country.name}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <PlanCard
                    plan={plan}
                    countrySlug={slug}
                    featured={i === featuredIndex}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <TravelTipsCard countryName={country.name} />
      {slug === 'vietnam' && <RefundPolicySection />}
      <DeviceCompatibilitySection />
      <HowToUseSection />
      {plans.length > 0 && (
        <section className="section bg-surface-50 pt-0">
          <div className="container">
            <PlanPriceComparison plans={plans} />
          </div>
        </section>
      )}
      {slug === 'vietnam' ? <ProductFAQSection /> : null}
    </div>
  );
}
