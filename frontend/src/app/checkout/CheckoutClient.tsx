'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  ArrowLeft, ShieldCheck, Clock, Wifi, Database, Signal, Users, Minus, Plus,
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import type { Plan, CheckoutForm } from '@/types';

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get('plan');
  const [orderData, setOrderData] = useState<{ orderId: number; orderNumber: string; paypalOrderId: string; total: number } | null>(null);
  const [paypalClientId, setPaypalClientId] = useState('');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [qty, setQty] = useState(1);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutForm>({
    defaultValues: { customer_name: '', customer_email: '', quantity: 1 },
  });

  const { data: plan, isLoading: planLoading } = useQuery({
    queryKey: ['plan', planId],
    queryFn: async () => {
      if (!planId) return null;
      const res = await api.get(`/plans/${planId}`);
      return res.data.data as Plan;
    },
    enabled: !!planId,
  });

  useEffect(() => {
    api.get('/paypal/client-id').then((res) => setPaypalClientId(res.data.clientId));
  }, []);

  if (!planId) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No plan selected.</p>
          <Link href="/countries/vietnam" className="btn-primary">View Vietnam Plans</Link>
        </div>
      </div>
    );
  }

  if (planLoading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Plan not found.</p>
          <Link href="/countries/vietnam" className="btn-primary">View Vietnam Plans</Link>
        </div>
      </div>
    );
  }

  const price = typeof plan.price === 'string' ? parseFloat(plan.price) : plan.price;
  const total = price * qty;

  const createOrder = async (formData: CheckoutForm): Promise<{ orderId: number; orderNumber: string; paypalOrderId: string; total: number }> => {
    setIsCreatingOrder(true);
    try {
      const res = await api.post('/orders', {
        ...formData,
        plan_id: plan.id,
        quantity: qty,
      });
      setOrderData(res.data.data);
      return res.data.data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create order';
      toast.error(message);
      throw err;
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const onPayPalApprove = async (data: { orderID: string }) => {
    try {
      const loadingToast = toast.loading('Confirming payment...');
      await api.post('/paypal/capture', {
        paypalOrderId: data.orderID,
        orderNumber: orderData?.orderNumber,
      });
      toast.dismiss(loadingToast);
      toast.success('Payment successful! 🎉');
      router.push(`/order/success?order=${orderData?.orderNumber}`);
    } catch {
      toast.error('Payment verification failed. Please contact support.');
    }
  };

  return (
    <div className="pt-20 pb-24 min-h-screen bg-surface-50">
      <div className="container max-w-5xl mt-8">
        <Link href={`/countries/${plan.country?.slug}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to {plan.country?.name}
        </Link>

        <h1 className="text-3xl font-black text-gray-900 mb-8">Complete Your Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Customer Details */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-card border border-surface-200"
            >
              <h2 className="font-bold text-gray-900 text-lg mb-5">Your Details</h2>
              <form id="checkout-form" className="space-y-4">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    {...register('customer_name', { required: 'Name is required' })}
                    placeholder="John Smith"
                    className="input"
                  />
                  {errors.customer_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.customer_name.message}</p>
                  )}
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input
                    {...register('customer_email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                    })}
                    type="email"
                    placeholder="john@example.com"
                    className="input"
                  />
                  {errors.customer_email && (
                    <p className="text-red-500 text-xs mt-1">{errors.customer_email.message}</p>
                  )}
                  <p className="text-gray-400 text-xs mt-1">Your eSIM QR code will be sent to this address</p>
                </div>

                {/* Quantity */}
                <div>
                  <label className="label">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-10 h-10 bg-surface-100 hover:bg-surface-200 rounded-xl flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-lg">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(Math.min(10, qty + 1))}
                      className="w-10 h-10 bg-surface-100 hover:bg-surface-200 rounded-xl flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-gray-400 text-sm">eSIM{qty > 1 ? 's' : ''}</span>
                  </div>
                  {qty > 1 && (
                    <p className="text-primary-600 text-xs mt-1 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {qty} eSIMs will be emailed to you
                    </p>
                  )}
                </div>
              </form>
            </motion.div>

            {/* PayPal */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl p-6 shadow-card border border-surface-200"
            >
              <h2 className="font-bold text-gray-900 text-lg mb-2">Payment</h2>
              <p className="text-gray-500 text-sm mb-5">Powered by PayPal – Secure & Protected</p>

              {!paypalClientId ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin mx-auto mb-2" />
                  Loading payment...
                </div>
              ) : (
                <PayPalScriptProvider
                  options={{
                    clientId: paypalClientId,
                    currency: 'USD',
                    intent: 'capture',
                  }}
                >
                  <PayPalButtons
                    style={{ layout: 'vertical', shape: 'rect', height: 48 }}
                  createOrder={async () => {
                    return new Promise<string>((resolve, reject) => {
                      handleSubmit(async (formData) => {
                        try {
                          const result = await createOrder(formData);
                          resolve(result.paypalOrderId);
                        } catch (err) {
                          reject(err);
                        }
                      })();
                    });
                  }}
                    onApprove={(data) => onPayPalApprove(data)}
                    onError={(err) => {
                      console.error('PayPal error:', err);
                      toast.error('PayPal error. Please try again.');
                    }}
                    onCancel={() => {
                      setOrderData(null);
                      toast('Payment cancelled');
                    }}
                    disabled={isCreatingOrder}
                  />
                </PayPalScriptProvider>
              )}

              <div className="flex items-center justify-center gap-2 mt-4 text-gray-400 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                Your payment is protected by PayPal Buyer Protection
              </div>
            </motion.div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-card border border-surface-200 sticky top-24"
            >
              {/* Plan header */}
              <div className="p-5 border-b border-surface-100">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{plan.country?.flag}</span>
                  <div>
                    <h3 className="font-bold text-gray-900">{plan.title}</h3>
                    <p className="text-gray-400 text-xs">{plan.country?.name}</p>
                  </div>
                </div>
              </div>

              {/* Plan details */}
              <div className="p-5 space-y-3">
                {[
                  { icon: Clock, label: 'Duration', value: `${plan.days} days` },
                  { icon: Database, label: 'Data', value: plan.data_amount },
                  { icon: Signal, label: 'Network', value: plan.network },
                  { icon: Wifi, label: 'Hotspot', value: plan.hotspot ? 'Included' : 'Not included' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Icon className="w-4 h-4" />
                      {label}
                    </span>
                    <span className="font-semibold text-gray-800">{value}</span>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="p-5 border-t border-surface-100 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Unit price</span>
                  <span>${price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Quantity</span>
                  <span>× {qty}</span>
                </div>
                <div className="flex justify-between font-black text-xl text-gray-900 pt-2 border-t border-surface-100">
                  <span>Total</span>
                  <span className="text-primary-600">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="p-5 pt-0 space-y-2">
                {[
                  { icon: ShieldCheck, text: 'Secure PayPal payment' },
                  { icon: Clock, text: 'eSIM delivered within 24h' },
                  { icon: Wifi, text: 'QR code sent by email' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-gray-400">
                    <Icon className="w-3.5 h-3.5 text-green-500" />
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
