'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { QrCode, Package } from 'lucide-react';
import type { EsimCode } from '@/types';

export default function AdminEsimPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders-waiting'],
    queryFn: async () => {
      const res = await api.get('/admin/orders?status=WaitingUpload&limit=50');
      return res.data;
    },
  });

  const orders = data?.data || [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">eSIM Codes</h1>
        <p className="text-gray-400 text-sm">Orders waiting for eSIM upload</p>
      </div>

      {/* Waiting upload orders */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-2 text-orange-700">
          <QrCode className="w-5 h-5" />
          <p className="font-semibold text-sm">
            {orders.length} order{orders.length !== 1 ? 's' : ''} waiting for eSIM upload
          </p>
        </div>
        <p className="text-orange-600 text-xs mt-1">
          Go to Orders page to upload eSIM QR codes for these orders.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-surface-200 overflow-hidden">
        <div className="p-4 border-b border-surface-100">
          <h2 className="font-semibold text-gray-700">Pending eSIM Upload</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-100 bg-surface-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Order</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Plan</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Paid At</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                    <Package className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                    No orders waiting for eSIM upload
                  </td>
                </tr>
              ) : (
                orders.map((order: { id: number; order_number: string; customer_name: string; customer_email: string; paid_at?: string; order_items?: Array<{ id: number; plan?: { country?: { flag: string }; title: string } }> }) => {
                  const item = order.order_items?.[0];
                  return (
                    <tr key={order.id} className="border-b border-surface-50 hover:bg-orange-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-semibold text-primary-600">{order.order_number}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-sm">{order.customer_name}</div>
                        <div className="text-xs text-gray-400">{order.customer_email}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-sm">
                        {item?.plan?.country?.flag} {item?.plan?.title}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {order.paid_at ? new Date(order.paid_at).toLocaleString() : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`/admin/orders`}
                          className="text-xs font-semibold text-orange-700 bg-orange-100 hover:bg-orange-200 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Upload eSIM →
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
