'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Country } from '@/types';

interface CountryCardProps {
  country: Country;
  index?: number;
}

const GRADIENT_COLORS = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-orange-500 to-red-500',
  'from-green-500 to-teal-500',
  'from-indigo-500 to-blue-500',
  'from-rose-500 to-orange-500',
];

export default function CountryCard({ country, index = 0 }: CountryCardProps) {
  const gradient = GRADIENT_COLORS[index % GRADIENT_COLORS.length];
  const planCount = country._count?.plans || 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link href={`/countries/${country.slug}`} className="block group">
        <div className="card-hover overflow-hidden">
          {/* Cover image / gradient */}
          <div className={`relative h-36 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
            <div className="pattern-overlay absolute inset-0" />
            <span className="text-5xl relative z-10 drop-shadow-lg">{country.flag}</span>
            {country.is_popular && (
              <div className="absolute top-3 left-3 z-10">
                <span className="badge bg-yellow-400/90 text-yellow-900 backdrop-blur-sm text-[10px]">
                  Popular
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base group-hover:text-primary-600 transition-colors">
                  {country.name}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {planCount > 0 ? `${planCount} plan${planCount !== 1 ? 's' : ''} available` : 'Plans available'}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
