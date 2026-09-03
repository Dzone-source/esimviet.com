'use client';

import { motion } from 'framer-motion';
import { Wifi, Zap } from 'lucide-react';
import Link from 'next/link';
import HeroBackgroundImage from '@/components/common/HeroBackgroundImage';

export default function HeroSection() {
  return (
    <section className="relative min-h-[52vh] md:min-h-[56vh] flex items-center overflow-hidden pt-16 pb-10">
      <HeroBackgroundImage alt="Vietnam landscape wallpaper" />

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30" />

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/90 text-sm font-medium mb-5"
          >
            <Wifi className="w-4 h-4 text-blue-300" />
            Vietnam eSIM for Travelers
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.06 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] mb-4 drop-shadow-lg"
          >
            Vietnam eSIM
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-cyan-200">
              Fast & Affordable Data
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="text-white/90 text-lg md:text-xl mb-8 max-w-xl mx-auto drop-shadow"
          >
            Buy a Vietnam eSIM online. No physical SIM, no roaming fees.
            QR code delivered by email — activate on arrival.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/#vietnam-plans"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-2xl transition-all duration-200 hover:shadow-lg active:scale-95"
            >
              <Zap className="w-5 h-5" />
              View Vietnam Plans
            </Link>
            <Link
              href="/#device-compatibility"
              className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-sm font-semibold px-8 py-4 rounded-2xl transition-all duration-200"
            >
              Check Device Compatible
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 30C480 60 240 0 0 30L0 60Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
