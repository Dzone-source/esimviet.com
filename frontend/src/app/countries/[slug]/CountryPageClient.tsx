'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Wifi } from 'lucide-react';
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
import type { Country } from '@/types';

interface Props { slug: string; }

const VIETNAM_HERO_IMAGE = '/images/vietnam-hero.jpg';

function getHeroImage(country: Country, slug: string): string {
  if (country.cover_image) {
    if (country.cover_image.startsWith('http')) {
      return country.cover_image;
    }
    if (country.cover_image.startsWith('/uploads')) {
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api\/?$/, '');
      return `${siteUrl}${country.cover_image}`;
    }
    return country.cover_image;
  }

  return slug === 'vietnam' ? VIETNAM_HERO_IMAGE : VIETNAM_HERO_IMAGE;
}

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
  const heroImage = getHeroImage(country, slug);

  return (
    <div className="pt-16">
      {/* Hero Banner */}
      <div className="relative min-h-[52vh] md:min-h-[58vh] flex items-end pb-12 overflow-hidden">
        <Image
          src={heroImage}
          alt={`${country.name} travel landscape`}
          fill
          priority
          className="object-cover object-center scale-105"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/92 via-primary-900/78 to-primary-800/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <div className="pattern-overlay absolute inset-0 opacity-20" />

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

        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 30C480 60 240 0 0 30L0 60Z" fill="white" />
          </svg>
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
