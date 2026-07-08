'use client';
import { motion } from 'framer-motion';
import { Package, Zap, Headphones, ShieldCheck, Globe2, Wifi } from 'lucide-react';

const BENEFITS = [
  {
    icon: Package,
    title: 'Manual Delivery',
    description: 'We personally review and deliver your eSIM QR code within 24 hours. Quality guaranteed.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Globe2,
    title: '100+ Countries',
    description: 'Extensive coverage across Asia, Europe, Americas and beyond with local network partnerships.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Zap,
    title: '4G & 5G Networks',
    description: 'Blazing fast data speeds with premium 4G LTE and 5G network access where available.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Safe',
    description: 'PayPal-protected payments. Your payment and personal data is always secure with us.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: "Our support team is always ready to help you get connected, any time of day or night.",
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: Wifi,
    title: 'Hotspot Sharing',
    description: 'Share your connection with other devices. Perfect for teams and families traveling together.',
    color: 'bg-cyan-50 text-cyan-600',
  },
];

export default function BenefitsSection() {
  return (
    <section className="section bg-surface-50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-surface-200 text-gray-600 text-sm font-semibold px-4 py-2 rounded-full mb-4 shadow-sm">
            ✨ Why Choose Us
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            The Smart Way to Stay Connected
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            We make international connectivity simple, affordable and reliable for every traveler.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white rounded-2xl p-6 shadow-card border border-surface-200 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-2xl ${benefit.color} flex items-center justify-center mb-4`}>
                <benefit.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{benefit.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
