import { useEffect, useState, useCallback, useRef } from 'react';
import { RefreshCw, Phone, MapPin, CreditCard, Bell, CheckCircle2, XCircle, Navigation } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Order, OrderStatus } from '../types';
import { StatusBadge, STATUS_CONFIG } from './StatusBadge';

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  received: 'preparing',
  preparing: 'ready',
  ready: 'delivering',
  delivering: 'delivered',
};

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  received: 'Démarrer préparation',
  preparing: 'Marquer prête',
  ready: 'Envoyer en livraison',
  delivering: 'Marquer livrée',
};

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'all'>('active');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set());
  const [showNewOrderAlert, setShowNewOrderAlert] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function playNotificationSound() {
  try {
    if (!audioRef.current) {
      audioRef.current = new Audio('/notification.wav');
    }

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      console.log('Son bloqué par le navigateur');
    });
  } catch (error) {
    console.log('Erreur audio:', error);
  }
}
  const fetchOrders = useCallback(async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .order('created_at', { ascending: false })
      .limit(100);
    if (data) {
      setOrders(prev => {
        const prevIds = new Set(prev.map(o => o.id));
        const incoming = data as Order[];
        const fresh = incoming.filter(o => !prevIds.has(o.id) && o.status === 'received');
        if (fresh.length > 0) {
          setShowNewOrderAlert(true);
            playNotificationSound();

            setTimeout(() => {
          setShowNewOrderAlert(false);
          }, 6000);
          setNewOrderIds(ids => {
            const next = new Set(ids);
            fresh.forEach(o => next.add(o.id));
            return next;
          });
          setTimeout(() => {
            setNewOrderIds(ids => {
              const next = new Set(ids);
              fresh.forEach(o => next.delete(o.id));
              return next;
            });
          }, 5000);
        }
        return incoming;
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
  fetchOrders();

  const channel = supabase
    .channel('restaurant-orders-realtime')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
      },
      () => {
        fetchOrders();
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'order_items',
      },
      () => {
        fetchOrders();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [fetchOrders]);

function openGoogleMaps(order: Order) {
  if (order.latitude && order.longitude) {
    window.open(
      `https://www.google.com/maps?q=${order.latitude},${order.longitude}`,
      '_blank'
    );
    return;
  }

  const query = encodeURIComponent(`${order.neighborhood} ${order.address || ''} Niamey Niger`);
  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
}

  async function updateStatus(orderId: string, status: OrderStatus) {
    setUpdatingId(orderId);
    await supabase.from('orders').update({ status }).eq('id', orderId);
    await fetchOrders();
    setUpdatingId(null);
  }

  const activeOrders = orders.filter(o => !['delivered', 'refused'].includes(o.status));
  const displayOrders = activeTab === 'active' ? activeOrders : orders;

  const stats = {
    received: orders.filter(o => o.status === 'received').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    delivering: orders.filter(o => o.status === 'delivering').length,
    total: orders.length,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24">
      {showNewOrderAlert && (
  <div className="fixed top-24 right-6 z-50 bg-brand-500 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
    <Bell size={22} />
    <div>
      <div className="font-bold">Nouvelle commande !</div>
      <div className="text-sm text-white/80">Une commande vient d’arriver.</div>
    </div>
  </div>
)}
      <div className="flex items-center justify-between mb-6 mt-2">
        <div>
          <h2 className="font-display text-2xl font-bold text-noir-950">Tableau de bord</h2>
          <p className="text-noir-400 text-sm">Gestion des commandes en temps réel</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-noir-50 hover:bg-noir-100 text-noir-700 rounded-xl text-sm font-medium transition-colors"
        >
          <RefreshCw size={14} />
          Actualiser
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Nouvelles', value: stats.received, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'En préparation', value: stats.preparing, color: 'text-amber-700', bg: 'bg-amber-50' },
          { label: 'En livraison', value: stats.delivering, color: 'text-brand-700', bg: 'bg-brand-50' },
          { label: 'Aujourd\'hui', value: stats.total, color: 'text-noir-700', bg: 'bg-noir-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-noir-500 text-sm mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-noir-50 p-1 rounded-xl w-fit mb-6">
        {(['active', 'all'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab ? 'bg-white shadow-sm text-noir-950' : 'text-noir-500 hover:text-noir-700'
            }`}
          >
            {tab === 'active' ? `Actives (${activeOrders.length})` : `Toutes (${orders.length})`}
          </button>
        ))}
      </div>

      {/* Orders */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex justify-between mb-4">
                <div className="h-5 bg-noir-100 rounded w-32" />
                <div className="h-5 bg-noir-100 rounded w-20" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-noir-100 rounded w-48" />
                <div className="h-4 bg-noir-100 rounded w-36" />
              </div>
            </div>
          ))}
        </div>
      ) : displayOrders.length === 0 ? (
        <div className="text-center py-20">
          <CheckCircle2 size={48} className="text-noir-200 mx-auto mb-4" />
          <p className="text-noir-400">Aucune commande active</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayOrders.map(order => {
            const isNew = newOrderIds.has(order.id);
            const nextStatus = NEXT_STATUS[order.status];
            return (
              <div
                key={order.id}
                className={`card p-5 md:p-6 transition-all duration-300 ${
                  isNew ? 'ring-2 ring-brand-500 animate-pulse-brand' : ''
                }`}
              >
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    {isNew && (
                      <span className="flex items-center gap-1 bg-brand-100 text-brand-700 text-xs font-bold px-2.5 py-1 rounded-full animate-bounce">
                        <Bell size={10} />
                        Nouvelle
                      </span>
                    )}
                    <div>
                      <div className="font-bold text-noir-950">{order.customer_name}</div>
                      <div className="text-noir-400 text-xs">
                        {new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        {' · '}
                        #{order.id.slice(0, 8).toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                {/* Customer info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-noir-600">
                    <Phone size={14} className="text-brand-500 flex-shrink-0" />
                    <span>{order.customer_phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-noir-600">
                    <MapPin size={14} className="text-brand-500 flex-shrink-0" />
                    <span>{order.neighborhood}{order.address ? ` — ${order.address}` : ''}</span>
                  </div>
                  <div className="flex items-center gap-2 text-noir-600">
                    <CreditCard size={14} className="text-brand-500 flex-shrink-0" />
                    <span className="capitalize font-medium">{order.payment_method}</span>
                    <span className="text-brand-500 font-bold ml-auto">{order.total.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-noir-50 rounded-xl p-3 mb-4">
                  <div className="text-xs font-semibold text-noir-500 uppercase tracking-wider mb-2">Commande</div>
                  <div className="space-y-1">
                    {order.items?.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-noir-700">{item.quantity}× {item.dish_name}</span>
                        <span className="text-noir-500">{(item.dish_price * item.quantity).toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    ))}
                  </div>
                  {order.notes && (
                    <p className="mt-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5">
                      📝 {order.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => openGoogleMaps(order)}
                    className="btn-outline text-sm py-2 px-4"
                  >
                    <Navigation size={16} />
                   Voir sur Google Maps
                </button>
                  {order.status === 'received' && (
                    <button
                      onClick={() => updateStatus(order.id, 'refused')}
                      disabled={updatingId === order.id}
                      className="btn-danger text-sm py-2 px-4"
                    >
                      <XCircle size={16} />
                      Refuser
                    </button>
                  )}
                  {nextStatus && (
                    <button
                      onClick={() => updateStatus(order.id, nextStatus)}
                      disabled={updatingId === order.id}
                      className="btn-primary text-sm py-2 px-4"
                    >
                      {updatingId === order.id ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}
                      {NEXT_LABEL[order.status]}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
