import { useEffect, useState } from 'react';
import { CheckCircle, Clock, ChefHat, Truck, Package, XCircle, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import type { Order } from '../types';

const STATUS_CONFIG = {
  received: { icon: Clock, label: 'Commande reçue', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  preparing: { icon: ChefHat, label: 'En préparation', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  ready: { icon: Package, label: 'Prête', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  delivering: { icon: Truck, label: 'En livraison', color: 'text-brand-600', bg: 'bg-brand-50', border: 'border-brand-200' },
  delivered: { icon: CheckCircle, label: 'Livrée', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  refused: { icon: XCircle, label: 'Refusée', color: 'text-crimson-700', bg: 'bg-crimson-50', border: 'border-crimson-200' },
};

const STATUS_ORDER = ['received', 'preparing', 'ready', 'delivering', 'delivered'];

export default function OrderStatus() {
  const { currentOrderId, setView } = useApp();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchOrder() {
    if (!currentOrderId) return;
    const { data } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', currentOrderId)
      .single();
    if (data) setOrder(data);
    setLoading(false);
  }

  useEffect(() => {
  if (!currentOrderId) return;

  fetchOrder();

  const channel = supabase
    .channel(`order-status-${currentOrderId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${currentOrderId}`,
      },
      () => {
        fetchOrder();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [currentOrderId]);

  if (!currentOrderId) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-noir-400 mb-6">Aucune commande active</p>
        <button onClick={() => setView('home')} className="btn-primary">Retour au menu</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <RefreshCw size={32} className="text-brand-500 animate-spin mx-auto mb-4" />
        <p className="text-noir-400">Chargement...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-noir-400 mb-6">Commande introuvable</p>
        <button onClick={() => setView('home')} className="btn-primary">Retour au menu</button>
      </div>
    );
  }

  const config = STATUS_CONFIG[order.status];
  const Icon = config.icon;
  const currentStep = STATUS_ORDER.indexOf(order.status);

  return (
    <div className="max-w-lg mx-auto px-4 pb-24 animate-fade-in">
      <h2 className="font-display text-2xl font-bold text-noir-950 mt-2 mb-6">Suivi de commande</h2>

      {/* Current status card */}
      <div className={`rounded-2xl border-2 ${config.border} ${config.bg} p-6 mb-8 text-center`}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white flex items-center justify-center shadow-sm">
          <Icon size={28} className={config.color} />
        </div>
        <h3 className={`font-display text-xl font-bold ${config.color} mb-1`}>{config.label}</h3>
        <p className="text-noir-500 text-sm">
          {order.status === 'refused'
            ? 'Votre commande a été refusée. Veuillez nous contacter.'
            : order.status === 'delivered'
            ? 'Bon appétit ! Merci de votre confiance.'
            : 'Mise à jour automatique toutes les 15 secondes'}
        </p>
      </div>

      {/* Progress steps */}
      {order.status !== 'refused' && (
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-5 h-0.5 bg-noir-100 -z-0" />
            <div
              className="absolute left-0 top-5 h-0.5 bg-brand-500 transition-all duration-500 -z-0"
              style={{ width: `${Math.max(0, (currentStep / (STATUS_ORDER.length - 1)) * 100)}%` }}
            />
            {STATUS_ORDER.map((s, i) => {
              const sc = STATUS_CONFIG[s as keyof typeof STATUS_CONFIG];
              const StepIcon = sc.icon;
              const done = i <= currentStep;
              return (
                <div key={s} className="flex flex-col items-center gap-2 z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    done ? 'bg-brand-500 border-brand-500' : 'bg-white border-noir-200'
                  }`}>
                    <StepIcon size={16} className={done ? 'text-white' : 'text-noir-300'} />
                  </div>
                  <span className={`text-[10px] font-medium text-center leading-tight max-w-[60px] ${
                    done ? 'text-brand-600' : 'text-noir-400'
                  }`}>
                    {sc.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order details */}
      <div className="card p-6 mb-6">
        <h4 className="font-semibold text-noir-950 mb-4">Détails de votre commande</h4>
        <div className="space-y-2 mb-4">
          {order.items?.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-noir-700">{item.quantity}x {item.dish_name}</span>
              <span className="text-noir-500">{(item.dish_price * item.quantity).toLocaleString('fr-FR')} FCFA</span>
            </div>
          ))}
        </div>
        <div className="border-t border-noir-100 pt-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-noir-500">Livraison à</span>
            <span className="font-medium text-noir-950">{order.neighborhood}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-noir-500">Paiement</span>
            <span className="font-medium text-noir-950 capitalize">{order.payment_method}</span>
          </div>
          <div className="flex justify-between text-sm font-bold pt-1">
            <span className="text-noir-950">Total</span>
            <span className="text-brand-500">{order.total.toLocaleString('fr-FR')} FCFA</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={fetchOrder} className="btn-outline flex-1 py-3">
          <RefreshCw size={16} />
          Actualiser
        </button>
        <button onClick={() => setView('home')} className="btn-secondary flex-1 py-3">
          Retour au menu
        </button>
      </div>
    </div>
  );
}
