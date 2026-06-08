import { CheckCircle, Clock, ChefHat, Truck, Package, XCircle } from 'lucide-react';
import type { OrderStatus } from '../types';

export const STATUS_CONFIG: Record<OrderStatus, {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  color: string;
  bg: string;
  border: string;
  badge: string;
}> = {
  received: { icon: Clock, label: 'Reçue', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700' },
  preparing: { icon: ChefHat, label: 'En préparation', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700' },
  ready: { icon: Package, label: 'Prête', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700' },
  delivering: { icon: Truck, label: 'En livraison', color: 'text-brand-700', bg: 'bg-brand-50', border: 'border-brand-200', badge: 'bg-brand-100 text-brand-700' },
  delivered: { icon: CheckCircle, label: 'Livrée', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700' },
  refused: { icon: XCircle, label: 'Refusée', color: 'text-crimson-700', bg: 'bg-crimson-50', border: 'border-crimson-200', badge: 'bg-crimson-100 text-crimson-700' },
};

interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <span className={`status-badge ${config.badge}`}>
      <Icon size={12} />
      {config.label}
    </span>
  );
}
