'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, MapPin, Wifi, Check, Info } from 'lucide-react';
import api from '@/lib/api';
import PlanCard from '@/components/common/PlanCard';
import { PageLoader } from '@/components/common/LoadingSpinner';
import FAQSection from '@/components/home/FAQSection';
import type { Country } from '@/types';

interface Props { slug: string; }

const TRAVEL_TIPS = [
  'Best time to visit: March–April and September–November',
  'Currency: Vietnamese Dong (VND)',
  'Capital: Hanoi | Major city: Ho Chi Minh City',
  'Known for: Ha Long Bay, Ancient Hoi An, delicious street food',
];

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
  const tips = TRAVEL_TIPS;
  const featuredIndex = plans.length > 1 ? Math.floor(plans.length / 2) : -1;

  return (
    <div className="pt-16">
      {/* Hero Banner */}
      <div className="relative hero-gradient min-h-[50vh] flex items-end pb-12 overflow-hidden">
        <div className="pattern-overlay absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <span className="text-[20rem] leading-none">{country.flag}</span>
        </div>

        <div className="container relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4 mb-3">
              <span className="text-6xl">{country.flag}</span>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white">{country.name}</h1>
                <div className="flex items-center gap-2 text-white/70 text-sm mt-1">
                  <MapPin className="w-4 h-4" />
                  {country.region}
                  <span className="w-1 h-1 bg-white/40 rounded-full" />
                  <Wifi className="w-4 h-4" />
                  {plans.length} plan{plans.length !== 1 ? 's' : ''} available
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

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
          </motion.div>

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

      {/* Info + Travel Tips */}
      <section className="section bg-surface-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* How to install */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-card border border-surface-200"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Wifi className="w-5 h-5 text-primary-600" />
                How to Install Your eSIM
              </h3>
              <ol className="space-y-4">
                {[
                  'Purchase your plan and complete payment via PayPal',
                  'Receive QR code and activation instructions via email (within 24h)',
                  'Go to Settings → Mobile Data → Add eSIM on your phone',
                  'Scan the QR code or enter the activation code manually',
                  'Your eSIM activates automatically upon arrival in ' + country.name,
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-gray-600 text-sm leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </motion.div>

            {/* Travel Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-card border border-surface-200"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary-600" />
                Travel Tips for {country.name}
              </h3>
              <ul className="space-y-3">
                {tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm">{tip}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 p-4 bg-primary-50 rounded-xl">
                <p className="text-primary-700 text-sm">
                  <strong>📱 eSIM Tip:</strong> Install your eSIM before you travel. The data plan activates automatically when you arrive in {country.name}.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <FAQSection />
    </div>
  );
}
