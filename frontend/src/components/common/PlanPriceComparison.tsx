'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, TrendingDown } from 'lucide-react';
import {
  buildPlanComparisons,
  formatPricePerDay,
  formatUsd,
  getMaxSavingsAcrossPlans,
} from '@/lib/planPricing';
import type { Plan } from '@/types';

interface PlanPriceComparisonProps {
  plans: Plan[];
}

export default function PlanPriceComparison({ plans }: PlanPriceComparisonProps) {
  if (plans.length === 0) return null;

  const comparisons = buildPlanComparisons(plans);
  const maxSavings = getMaxSavingsAcrossPlans(plans);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="mb-0"
    >
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-primary-50 p-5 md:p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 mb-2">
              <TrendingDown className="w-3.5 h-3.5" />
              {maxSavings > 0 ? `Up to ${maxSavings}% cheaper than other travel eSIMs` : 'Lower daily rates than major travel eSIM brands'}
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              Compare price per day
            </h3>
            <p className="text-sm text-gray-500 mt-1 max-w-2xl">
              See how eSIM Viet stacks up against typical Holafly and Airalo Vietnam plans.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs text-emerald-700 bg-white/80 border border-emerald-100 rounded-xl px-3 py-2">
            <BadgeCheck className="w-4 h-4 shrink-0" />
            Transparent pricing for international travelers
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-surface-200 bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-50 text-left">
                <th className="px-4 py-3 font-semibold text-gray-700">Plan</th>
                <th className="px-4 py-3 font-semibold text-primary-700 whitespace-nowrap">eSIM Viet</th>
                <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Holafly</th>
                <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Airalo</th>
                <th className="px-4 py-3 font-semibold text-emerald-700 whitespace-nowrap">You save</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row) => {
                const holafly = row.competitors.find((c) => c.id === 'holafly');
                const airalo = row.competitors.find((c) => c.id === 'airalo');

                return (
                  <tr key={row.planId} className="border-b border-surface-100 last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{row.title}</p>
                      <p className="text-xs text-gray-400">{row.days} days</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-bold text-primary-700">{formatUsd(row.ourPrice)}</p>
                      <p className="text-xs font-medium text-primary-600">
                        {formatPricePerDay(row.ourPrice, row.days)}
                      </p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {holafly ? (
                        <>
                          <p className="line-through">{formatUsd(holafly.price)}</p>
                          <p className="text-xs text-gray-400">
                            {formatPricePerDay(holafly.price, row.days)}
                          </p>
                        </>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {airalo ? (
                        <>
                          <p className="line-through">{formatUsd(airalo.price)}</p>
                          <p className="text-xs text-gray-400">
                            {formatPricePerDay(airalo.price, row.days)}
                          </p>
                        </>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {row.maxSavingsPercent > 0 ? (
                        <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                          Up to {row.maxSavingsPercent}% off
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
          Competitor prices are approximate typical retail rates for comparable Vietnam travel eSIM plans and may change. Savings shown vs the higher of Holafly or Airalo for each duration.
        </p>
      </div>
    </motion.div>
  );
}
