'use client';

import { motion } from 'framer-motion';
import {
  RotateCcw,
  QrCode,
  AlertCircle,
  Ban,
  Headphones,
  Clock,
  CreditCard,
} from 'lucide-react';

const REFUND_POINTS = [
  {
    icon: QrCode,
    title: 'QR code not delivered',
    description: 'Full refund if the eSIM QR code has not been delivered.',
    tone: 'emerald',
  },
  {
    icon: AlertCircle,
    title: 'Activation issue on our side',
    description: 'Full refund if the QR code cannot be activated due to an issue on our side.',
    tone: 'primary',
  },
  {
    icon: Ban,
    title: 'After activation or data use',
    description: 'No refunds after the eSIM has been successfully activated or if mobile data has been used.',
    tone: 'amber',
  },
  {
    icon: Headphones,
    title: 'Contact support early',
    description: 'Contact our support team immediately if you experience activation issues before using the eSIM.',
    tone: 'sky',
  },
  {
    icon: Clock,
    title: 'Review timeline',
    description: 'Refund requests will be reviewed within 1–3 business days.',
    tone: 'violet',
  },
  {
    icon: CreditCard,
    title: 'Refund method',
    description: 'If eligible, refunds will be issued through the original payment method.',
    tone: 'rose',
  },
];

export default function RefundPolicySection() {
  return (
    <section id="refund-policy" className="section bg-white pt-0">
      <div className="container max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            <RotateCcw className="w-4 h-4" />
            Refund Policy
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            Clear & Fair Refunds
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We want you to feel confident when purchasing. Here is how refunds work for Vietnam eSIM plans.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REFUND_POINTS.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-surface-200 bg-surface-50 p-5 hover:shadow-card transition-shadow"
            >
              <RefundIcon icon={point.icon} tone={point.tone} />
              <h3 className="font-bold text-gray-900 mt-4 mb-2">{point.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{point.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-gray-500 mt-8"
        >
          Questions about refunds? Email{' '}
          <a href="mailto:support@esimviet.com" className="text-primary-600 hover:underline font-medium">
            support@esimviet.com
          </a>
        </motion.p>
      </div>
    </section>
  );
}

function RefundIcon({
  icon: Icon,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
}) {
  const toneClasses: Record<string, string> = {
    emerald: 'bg-emerald-100 text-emerald-600',
    primary: 'bg-primary-100 text-primary-600',
    amber: 'bg-amber-100 text-amber-600',
    sky: 'bg-sky-100 text-sky-600',
    violet: 'bg-violet-100 text-violet-600',
    rose: 'bg-rose-100 text-rose-600',
  };

  return (
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${toneClasses[tone] || toneClasses.primary}`}>
      <Icon className="w-5 h-5" />
    </div>
  );
}
