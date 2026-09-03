'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Globe, ArrowRight, Zap } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="hero-gradient rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
        >
          <div className="pattern-overlay absolute inset-0" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4 text-yellow-300" />
              Ready for Vietnam?
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
              Get Your Vietnam eSIM Today
              <br />
              <span className="text-blue-200">Starting from $4.99</span>
            </h2>

            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of travelers who stay connected in Vietnam with our affordable eSIM plans.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#vietnam-plans"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-2xl transition-all duration-200 hover:shadow-lg active:scale-95"
              >
                <Globe className="w-5 h-5" />
                View Vietnam Plans
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-8 py-4 rounded-2xl transition-all duration-200"
              >
                How It Works
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
