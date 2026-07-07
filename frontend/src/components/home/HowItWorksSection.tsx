'use client';
import { motion } from 'framer-motion';
import { Search, CreditCard, Mail, Smartphone } from 'lucide-react';

const STEPS = [
  {
    icon: Search,
    step: '01',
    title: 'Choose Your Plan',
    description: 'Search for your destination and pick the data plan that fits your trip duration and usage needs.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: CreditCard,
    step: '02',
    title: 'Pay Securely',
    description: 'Complete checkout with PayPal. Your payment is 100% secure and protected.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Mail,
    step: '03',
    title: 'Receive Your eSIM',
    description: "We'll email you your QR code and activation instructions within 24 hours.",
    color: 'from-rose-500 to-pink-500',
  },
  {
    icon: Smartphone,
    step: '04',
    title: 'Activate & Travel',
    description: 'Scan the QR code on your phone. Your eSIM activates automatically when you land.',
    color: 'from-amber-500 to-orange-500',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            🚀 Simple Process
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            How It Works
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Get connected in 4 simple steps. No technical knowledge required.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative text-center"
            >
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-1/2 w-full h-px bg-gradient-to-r from-surface-200 to-surface-200 z-0" />
              )}

              {/* Icon */}
              <div className="relative z-10 mx-auto mb-5">
                <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                  <step.icon className="w-9 h-9 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-gray-900 text-white text-xs font-black rounded-full flex items-center justify-center">
                  {i + 1}
                </div>
              </div>

              <h3 className="font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
