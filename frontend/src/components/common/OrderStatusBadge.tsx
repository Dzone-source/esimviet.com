import type { OrderStatus } from '@/types';

const STATUS_CONFIG: Record<OrderStatus, { label: string; classes: string }> = {
  Pending: { label: 'Pending', classes: 'bg-yellow-50 text-yellow-700 border border-yellow-200' },
  Paid: { label: 'Paid', classes: 'bg-blue-50 text-blue-700 border border-blue-200' },
  WaitingUpload: { label: 'Waiting Upload', classes: 'bg-orange-50 text-orange-700 border border-orange-200' },
  Completed: { label: 'Completed', classes: 'bg-green-50 text-green-700 border border-green-200' },
  Cancelled: { label: 'Cancelled', classes: 'bg-red-50 text-red-700 border border-red-200' },
  Refunded: { label: 'Refunded', classes: 'bg-purple-50 text-purple-700 border border-purple-200' },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${config.classes}`}>
      {config.label}
    </span>
  );
}
