'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Wifi, Clock, Database, Signal, Zap, Check } from 'lucide-react';
import type { Plan } from '@/types';

interface PlanCardProps {
  plan: Plan;
  countrySlug?: string;
  featured?: boolean;
}

export default function PlanCard({ plan, countrySlug, featured = false }: PlanCardProps) {
  const price = typeof plan.price === 'string' ? parseFloat(plan.price) : plan.price;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative rounded-2xl border overflow-hidden transition-all duration-300 ${
        featured
          ? 'border-primary-400 shadow-glow bg-gradient-to-br from-primary-600 to-primary-800 text-white'
          : 'border-surface-200 bg-white shadow-card hover:shadow-card-hover'
      }`}
    >
      {featured && (
        <div className="absolute top-3 right-3">
          <span className="badge bg-yellow-400 text-yellow-900">
            <Zap className="w-3 h-3" />
            Best Value
          </span>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="mb-4">
          <h3 className={`font-bold text-lg leading-tight mb-1 ${featured ? 'text-white' : 'text-gray-900'}`}>
            {plan.title}
          </h3>
          {plan.country && (
            <p className={`text-sm ${featured ? 'text-primary-200' : 'text-gray-500'}`}>
              {plan.country.flag} {plan.country.name}
            </p>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <Stat
            icon={<Clock className="w-4 h-4" />}
            label="Duration"
            value={`${plan.days} days`}
            featured={featured}
          />
          <Stat
            icon={<Database className="w-4 h-4" />}
            label="Data"
            value={plan.data_amount}
            featured={featured}
          />
          <Stat
            icon={<Signal className="w-4 h-4" />}
            label="Network"
            value={plan.network}
            featured={featured}
          />
          <Stat
            icon={<Wifi className="w-4 h-4" />}
            label="Hotspot"
            value={plan.hotspot ? 'Included' : 'No'}
            featured={featured}
          />
        </div>

        {/* Features */}
        <ul className="space-y-1.5 mb-5">
          {[
            'Data activation on arrival',
            'No SIM swapping needed',
            plan.hotspot ? 'Hotspot sharing' : null,
            plan.speed ? `Up to ${plan.speed}` : null,
          ]
            .filter(Boolean)
            .slice(0, 3)
            .map((feature) => (
              <li key={feature} className={`flex items-center gap-2 text-xs ${featured ? 'text-primary-100' : 'text-gray-500'}`}>
                <Check className={`w-3.5 h-3.5 shrink-0 ${featured ? 'text-green-300' : 'text-green-500'}`} />
                {feature}
              </li>
            ))}
        </ul>

        {/* Price + CTA */}
        <div className={`flex items-center justify-between pt-4 border-t ${featured ? 'border-primary-500' : 'border-surface-200'}`}>
          <div>
            <span className={`text-2xl font-black ${featured ? 'text-white' : 'text-gray-900'}`}>
              ${price.toFixed(2)}
            </span>
            <span className={`text-xs ml-1 ${featured ? 'text-primary-200' : 'text-gray-400'}`}>USD</span>
          </div>
          <Link
            href={`/checkout?plan=${plan.id}`}
            className={`font-semibold text-sm px-5 py-2.5 rounded-xl transition-all active:scale-95 ${
              featured
                ? 'bg-white text-primary-700 hover:bg-primary-50'
                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-glow'
            }`}
          >
            Buy Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function Stat({
  icon,
  label,
  value,
  featured,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  featured: boolean;
}) {
  return (
    <div className={`flex items-start gap-2 p-2.5 rounded-xl ${featured ? 'bg-white/10' : 'bg-surface-50'}`}>
      <span className={featured ? 'text-primary-200 mt-0.5' : 'text-primary-500 mt-0.5'}>{icon}</span>
      <div>
        <p className={`text-xs ${featured ? 'text-primary-200' : 'text-gray-400'}`}>{label}</p>
        <p className={`text-sm font-semibold leading-tight ${featured ? 'text-white' : 'text-gray-800'}`}>{value}</p>
      </div>
    </div>
  );
}
