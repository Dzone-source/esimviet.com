'use client';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, Mail, Clock, Wifi, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import type { Order } from '@/types';

export default function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderNumber],
    queryFn: async () => {
      if (!orderNumber) return null;
      const res = await api.get(`/orders/number/${orderNumber}`);
      return res.data.data as Order;
    },
    enabled: !!orderNumber,
  });

  if (!orderNumber) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Invalid order link.</p>
          <Link href="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-24 min-h-screen bg-surface-50">
      <div className="container max-w-2xl mt-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-card-hover border border-surface-200 overflow-hidden"
        >
          {/* Success header */}
          <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-10 h-10 text-green-500" />
            </motion.div>
            <h1 className="text-3xl font-black text-white mb-2">Payment Successful!</h1>
            <p className="text-green-100">Thank you for your order</p>
          </div>

          {/* Order details */}
          <div className="p-8">
            {/* Order number */}
            <div className="bg-surface-50 rounded-2xl p-5 mb-6 text-center border border-surface-200">
              <p className="text-gray-500 text-sm mb-1">Order Number</p>
              <p className="text-2xl font-black text-primary-600 tracking-widest">{orderNumber}</p>
            </div>

            {/* What's next */}
            <div className="mb-6">
              <h2 className="font-bold text-gray-900 mb-4 text-lg">What Happens Next?</h2>
              <div className="space-y-4">
                {[
                  {
                    icon: CheckCircle,
                    color: 'text-green-500',
                    bg: 'bg-green-50',
                    title: 'Payment Confirmed',
                    desc: 'Your payment has been received and verified.',
                    done: true,
                  },
                  {
                    icon: Clock,
                    color: 'text-orange-500',
                    bg: 'bg-orange-50',
                    title: 'eSIM Preparation',
                    desc: 'Our team is preparing your eSIM QR code. This usually takes 1-24 hours.',
                    done: false,
                  },
                  {
                    icon: Mail,
                    color: 'text-blue-500',
                    bg: 'bg-blue-50',
                    title: 'Email Delivery',
                    desc: 'You will receive the QR code and activation instructions by email.',
                    done: false,
                  },
                  {
                    icon: Wifi,
                    color: 'text-primary-500',
                    bg: 'bg-primary-50',
                    title: 'Activate & Travel',
                    desc: 'Scan the QR code, install your eSIM, and enjoy seamless connectivity!',
                    done: false,
                  },
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`w-10 h-10 ${step.bg} rounded-xl flex items-center justify-center shrink-0`}>
                      <step.icon className={`w-5 h-5 ${step.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 text-sm">{step.title}</p>
                        {step.done && (
                          <span className="badge bg-green-50 text-green-700 text-[10px]">Done</span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/countries" className="btn-primary flex-1 justify-center">
                Browse More Plans
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/" className="btn-secondary flex-1 justify-center">
                Go Home
              </Link>
            </div>

            <p className="text-center text-gray-400 text-xs mt-4">
              Questions? Email us at{' '}
              <a href="mailto:support@esimglobal.com" className="text-primary-600 hover:underline">
                support@esimglobal.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
