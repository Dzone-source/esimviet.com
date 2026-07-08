'use client';
import { useState, Suspense } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import OrderStatusBadge from '@/components/common/OrderStatusBadge';
import UploadEsimModal from '@/components/admin/UploadEsimModal';
import type { Order, OrderStatus } from '@/types';
import { Search, Eye, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: '', label: 'All Orders' },
  { value: 'Pending', label: 'Pending' },
  { value: 'WaitingUpload', label: 'Waiting Upload' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
  { value: 'Refunded', label: 'Refunded' },
];

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [uploadOrderItem, setUploadOrderItem] = useState<{ id: number; orderId: number } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', search, status, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      const res = await api.get(`/admin/orders?${params}`);
      return res.data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, newStatus }: { id: number; newStatus: string }) =>
      api.patch(`/admin/orders/${id}/status`, { status: newStatus }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });

  const orders: Order[] = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Orders</h1>
          <p className="text-gray-400 text-sm">Manage customer orders and eSIM delivery</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-surface-200 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by order #, name, or email..."
              className="input pl-10 text-sm"
            />
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="input max-w-[180px]"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card border border-surface-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-100 bg-surface-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs">Order #</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs">Customer</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs hidden md:table-cell">Plan</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs hidden sm:table-cell">Total</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs hidden lg:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-surface-50">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const item = order.order_items?.[0];
                  const needsUpload = order.status === 'WaitingUpload';
                  return (
                    <tr key={order.id} className={`border-b border-surface-50 hover:bg-surface-50 transition-colors ${needsUpload ? 'bg-orange-50/30' : ''}`}>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-semibold text-primary-600">{order.order_number}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 text-sm">{order.customer_name}</div>
                        <div className="text-gray-400 text-xs">{order.customer_email}</div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-gray-600">
                        {item?.plan?.country?.flag} {item?.plan?.title}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <OrderStatusBadge status={order.status} />
                          {needsUpload && (
                            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell font-semibold text-gray-900">
                        ${Number(order.total).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-gray-400 text-xs">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="View order"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {needsUpload && item && (
                            <button
                              onClick={() => setUploadOrderItem({ id: item.id, orderId: order.id })}
                              className="flex items-center gap-1 px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs font-semibold rounded-lg transition-colors"
                              title="Upload eSIM"
                            >
                              <Upload className="w-3 h-3" />
                              Upload
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-surface-100">
            <p className="text-sm text-gray-400">
              Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, pagination.total)} of {pagination.total}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.pages}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusChange={(id, newStatus) => updateStatus.mutate({ id, newStatus })}
          />
        )}
      </AnimatePresence>

      {/* Upload eSIM Modal */}
      <AnimatePresence>
        {uploadOrderItem && (
          <UploadEsimModal
            orderItemId={uploadOrderItem.id}
            onClose={() => setUploadOrderItem(null)}
            onSuccess={() => {
              setUploadOrderItem(null);
              qc.invalidateQueries({ queryKey: ['admin-orders'] });
              toast.success('eSIM uploaded and email sent!');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="p-4 text-gray-400">Loading orders...</div>}>
      <AdminOrdersContent />
    </Suspense>
  );
}

function OrderDetailModal({
  order,
  onClose,
  onStatusChange,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: number, status: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-surface-100">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Order Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><p className="text-gray-400 text-xs">Order #</p><p className="font-mono font-bold text-primary-600">{order.order_number}</p></div>
            <div><p className="text-gray-400 text-xs">Status</p><OrderStatusBadge status={order.status} /></div>
            <div><p className="text-gray-400 text-xs">Customer</p><p className="font-medium">{order.customer_name}</p></div>
            <div><p className="text-gray-400 text-xs">Email</p><p className="font-medium text-xs">{order.customer_email}</p></div>
            <div><p className="text-gray-400 text-xs">Total</p><p className="font-bold text-lg">${Number(order.total).toFixed(2)}</p></div>
            <div><p className="text-gray-400 text-xs">Date</p><p>{new Date(order.created_at).toLocaleString()}</p></div>
          </div>

          {/* Items */}
          {order.order_items?.map((item) => (
            <div key={item.id} className="bg-surface-50 rounded-xl p-4">
              <p className="font-semibold text-sm">{item.plan?.country?.flag} {item.plan?.title}</p>
              <p className="text-gray-400 text-xs">{item.plan?.days} days · {item.plan?.data_amount}</p>
              <p className="text-primary-600 font-bold mt-1">${Number(item.price).toFixed(2)} × {item.qty}</p>
            </div>
          ))}

          {/* Status change */}
          <div>
            <label className="label">Change Status</label>
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value)}
              className="input"
            >
              {['Pending', 'Paid', 'WaitingUpload', 'Completed', 'Cancelled', 'Refunded'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
