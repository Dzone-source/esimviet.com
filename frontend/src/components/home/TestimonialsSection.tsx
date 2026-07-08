'use client';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Sarah Johnson',
    country: 'Australia',
    flag: '🇦🇺',
    rating: 5,
    text: 'Used this eSIM for my Japan trip. The QR code was delivered within a few hours and setup was super easy. Had 4G the whole trip!',
    plan: 'Japan 7 Days',
  },
  {
    name: 'Marco Rossi',
    country: 'Italy',
    flag: '🇮🇹',
    rating: 5,
    text: 'Perfect service! Visited Vietnam and Thailand back to back. Both eSIMs worked flawlessly. Great value for money.',
    plan: 'Vietnam 15 Days',
  },
  {
    name: 'Emily Chen',
    country: 'USA',
    flag: '🇺🇸',
    rating: 5,
    text: 'As a frequent traveler, eSIM Global is my go-to. The team responded quickly when I had a question. Excellent customer service!',
    plan: 'Thailand 7 Days',
  },
  {
    name: 'David Park',
    country: 'South Korea',
    flag: '🇰🇷',
    rating: 5,
    text: 'Very easy to install and the connection was stable throughout my Singapore trip. Will definitely use again for my next adventure.',
    plan: 'Singapore 5 Days',
  },
  {
    name: 'Anna Schmidt',
    country: 'Germany',
    flag: '🇩🇪',
    rating: 5,
    text: "Saved so much money compared to my carrier's roaming charges. The unlimited data plan was worth every penny for a month in Japan.",
    plan: 'Japan 30 Days',
  },
  {
    name: 'James Wilson',
    country: 'UK',
    flag: '🇬🇧',
    rating: 5,
    text: 'Quick delivery, easy setup, great coverage. What more could you ask for? Five stars without a doubt!',
    plan: 'USA 30 Days',
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
            Loved by Travelers Worldwide
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
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-primary-100 mb-3" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">"{review.text}"</p>

              {/* Plan badge */}
              <div className="mb-4">
                <span className="badge bg-primary-50 text-primary-700">
                  {review.plan}
                </span>
              </div>

              {/* Author */}
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
