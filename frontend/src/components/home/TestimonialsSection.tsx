'use client';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Marco Rossi',
    country: 'Italy',
    flag: '🇮🇹',
    rating: 5,
    text: 'Perfect service for my Vietnam trip! The QR code arrived within a few hours and setup was super easy. Stable 4G in Hanoi and Ho Chi Minh City.',
    plan: 'Vietnam 15 Days',
  },
  {
    name: 'Sarah Johnson',
    country: 'Australia',
    flag: '🇦🇺',
    rating: 5,
    text: 'Used this eSIM for two weeks traveling from north to south Vietnam. Great coverage and the unlimited plan was excellent value.',
    plan: 'Vietnam 30 Days',
  },
  {
    name: 'Emily Chen',
    country: 'USA',
    flag: '🇺🇸',
    rating: 5,
    text: 'eSIM Viet made my first trip to Vietnam stress-free. Hotspot worked perfectly for my laptop at cafés in Da Nang.',
    plan: 'Vietnam 7 Days',
  },
  {
    name: 'David Park',
    country: 'South Korea',
    flag: '🇰🇷',
    rating: 5,
    text: 'Very easy to install before my flight. Connected immediately when I landed in Saigon. Will use again on my next Vietnam visit.',
    plan: 'Vietnam 7 Days',
  },
  {
    name: 'Anna Schmidt',
    country: 'Germany',
    flag: '🇩🇪',
    rating: 5,
    text: 'Much cheaper than roaming with my home carrier. The team responded quickly when I had a setup question.',
    plan: 'Vietnam 15 Days',
  },
  {
    name: 'James Wilson',
    country: 'UK',
    flag: '🇬🇧',
    rating: 5,
    text: 'Quick delivery, easy setup, great coverage in Hoi An and Ha Long Bay. Five stars without a doubt!',
    plan: 'Vietnam 3 Days',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section bg-surface-50 overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            <Star className="w-4 h-4 fill-current" />
            Customer Reviews
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            Loved by Vietnam Travelers
          </h2>
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="font-semibold text-gray-700">4.9 / 5</span>
            <span>from 2,000+ reviews</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white rounded-2xl p-6 shadow-card border border-surface-200 hover:shadow-card-hover transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-primary-100 mb-3" />

              <div className="flex gap-0.5 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-4">"{review.text}"</p>

              <div className="mb-4">
                <span className="badge bg-primary-50 text-primary-700">
                  {review.plan}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-surface-100">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                  <p className="text-gray-400 text-xs flex items-center gap-1">
                    {review.flag} {review.country}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
