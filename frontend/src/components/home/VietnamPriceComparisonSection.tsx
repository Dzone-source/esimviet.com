'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import PlanPriceComparison from '@/components/common/PlanPriceComparison';
import { PageLoader } from '@/components/common/LoadingSpinner';
import type { Country } from '@/types';

export default function VietnamPriceComparisonSection() {
  const { data: country, isLoading } = useQuery({
    queryKey: ['country', 'vietnam'],
    queryFn: async () => {
      const res = await api.get('/countries/vietnam');
      return res.data.data as Country;
    },
  });

  const plans = country?.plans || [];

  if (isLoading) {
    return (
      <section className="section bg-surface-50 pt-0">
        <div className="container">
          <PageLoader />
        </div>
      </section>
    );
  }

  if (plans.length === 0) return null;

  return (
    <section className="section bg-surface-50 pt-0">
      <div className="container">
        <PlanPriceComparison plans={plans} />
      </div>
    </section>
  );
}
