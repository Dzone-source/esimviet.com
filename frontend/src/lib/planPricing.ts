export interface CompetitorBenchmark {
  id: string;
  name: string;
  /** Typical retail USD price keyed by plan duration (days). */
  pricesByDays: Record<number, number>;
}

/** Approximate Vietnam travel eSIM prices from major providers (updated periodically). */
export const COMPETITOR_BENCHMARKS: CompetitorBenchmark[] = [
  {
    id: 'holafly',
    name: 'Holafly',
    pricesByDays: { 3: 14, 7: 19, 15: 34, 30: 47 },
  },
  {
    id: 'airalo',
    name: 'Airalo',
    pricesByDays: { 3: 9, 7: 12, 15: 18, 30: 26 },
  },
];

export function parsePlanPrice(price: string | number): number {
  return typeof price === 'string' ? parseFloat(price) : price;
}

export function getPricePerDay(price: string | number, days: number): number {
  if (days <= 0) return 0;
  return parsePlanPrice(price) / days;
}

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatPricePerDay(price: string | number, days: number): string {
  return `${formatUsd(getPricePerDay(price, days))}/day`;
}

function getCompetitorPrice(benchmark: CompetitorBenchmark, days: number): number | null {
  if (benchmark.pricesByDays[days] != null) {
    return benchmark.pricesByDays[days];
  }

  const knownDays = Object.keys(benchmark.pricesByDays)
    .map(Number)
    .sort((a, b) => a - b);

  if (knownDays.length === 0) return null;

  const closest = knownDays.reduce((prev, curr) =>
    Math.abs(curr - days) < Math.abs(prev - days) ? curr : prev
  );

  const basePrice = benchmark.pricesByDays[closest];
  return (basePrice / closest) * days;
}

export function getSavingsPercent(ourPrice: number, competitorPrice: number): number {
  if (competitorPrice <= 0 || ourPrice >= competitorPrice) return 0;
  return Math.round(((competitorPrice - ourPrice) / competitorPrice) * 100);
}

export interface PlanComparisonRow {
  planId: number;
  title: string;
  days: number;
  ourPrice: number;
  ourPricePerDay: number;
  competitors: Array<{
    id: string;
    name: string;
    price: number;
    pricePerDay: number;
    savingsPercent: number;
  }>;
  maxSavingsPercent: number;
}

export function buildPlanComparisons(
  plans: Array<{ id: number; title: string; days: number; price: string | number }>
): PlanComparisonRow[] {
  return plans.map((plan) => {
    const ourPrice = parsePlanPrice(plan.price);
    const ourPricePerDay = getPricePerDay(ourPrice, plan.days);

    const competitors = COMPETITOR_BENCHMARKS.map((benchmark) => {
      const price = getCompetitorPrice(benchmark, plan.days);
      if (price == null) {
        return null;
      }

      return {
        id: benchmark.id,
        name: benchmark.name,
        price,
        pricePerDay: getPricePerDay(price, plan.days),
        savingsPercent: getSavingsPercent(ourPrice, price),
      };
    }).filter((row): row is NonNullable<typeof row> => row != null);

    const maxSavingsPercent = competitors.reduce(
      (max, row) => Math.max(max, row.savingsPercent),
      0
    );

    return {
      planId: plan.id,
      title: plan.title,
      days: plan.days,
      ourPrice,
      ourPricePerDay,
      competitors,
      maxSavingsPercent,
    };
  });
}

export function getMaxSavingsAcrossPlans(
  plans: Array<{ id: number; title: string; days: number; price: string | number }>
): number {
  const comparisons = buildPlanComparisons(plans);
  return comparisons.reduce((max, row) => Math.max(max, row.maxSavingsPercent), 0);
}
