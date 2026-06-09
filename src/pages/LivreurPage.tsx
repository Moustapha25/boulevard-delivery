import { useEffect, useState, useCallback } from 'react';
import { Truck, MapPin, Phone, Navigation, CheckCircle2, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Order } from '../types';

export default function LivreurPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .in('status', ['ready', 'delivering'])
      .order('created_at', { ascending: true });

    if (data) setOrders(data as Order[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('driver-orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => fetchOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  async function updateStatus(orderId: string, status: 'delivering' | 'delivered') {
    setUpdatingId(orderId);
    await supabase.from('orders').update({ status }).eq('id', orderId);
    await fetchOrders();
    setUpdatingId(null);
  }

  function openGoogleMaps(order: Order) {
    if (order.latitude && order.longitude) {
      window.open(`https://www.google.com/maps?q=${order.latitude},${order.longitude}`, '_blank');
      return;
    }

    const query = encodeURIComponent(`${order.neighborhood} ${order.address || ''} Niamey Niger`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pb-24 animate-fade-in">
      <div className="bg-noir-950 rounded-3xl p-6 md:p-8 mt-4 mb-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-500 flex items-center justify-center">
            <Truck size={28} />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">Espace Livreur</h1>
            <p className="text-noir-300 text-sm">
              Commandes prêtes et livraisons en cours
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-bold text-noir-950">
            Livraisons disponibles
          </h2>
          <p className="text-noir-400 text-sm">
            {orders.length} commande{orders.length > 1 ? 's' : ''} à traiter
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-noir-50 hover:bg-noir-100 text-noir-700 rounded-xl text-sm font-medium transition-colors"
        >
          <RefreshCw size={14} />
          Actualiser
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <RefreshCw size={32} className="text-brand-500 animate-spin mx-auto mb-4" />
          <p className="text-noir-400">Chargement des livraisons...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 card">
          <Truck size={52} className="text-noir-200 mx-auto mb-4" />
          <h3 className="font-display text-xl font-bold text-noir-950 mb-2">
            Aucune livraison pour le moment
          </h3>
          <p className="text-noir-400">
            Les commandes prêtes apparaîtront ici automatiquement.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <div className="font-bold text-noir-950 text-lg">
                    {order.customer_name}
                  </div>
                  <div className="text-noir-400 text-xs">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === 'ready'
                      ? 'bg-purple-50 text-purple-700'
                      : 'bg-brand-50 text-brand-700'
                  }`}
                >
                  {order.status === 'ready' ? 'Prête à livrer' : 'En livraison'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-sm">
                <div className="flex items-center gap-2 text-noir-600">
                  <Phone size={14} className="text-brand-500" />
                  <span>{order.customer_phone}</span>
                </div>

                <div className="flex items-center gap-2 text-noir-600 sm:col-span-2">
                  <MapPin size={14} className="text-brand-500 flex-shrink-0" />
                  <span>
                    {order.neighborhood}
                    {order.address ? ` — ${order.address}` : ''}
                  </span>
                </div>
              </div>

              <div className="bg-noir-50 rounded-xl p-3 mb-4">
                <div className="text-xs font-semibold text-noir-500 uppercase tracking-wider mb-2">
                  Commande
                </div>

                <div className="space-y-1">
                  {order.items?.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-noir-700">
                        {item.quantity}× {item.dish_name}
                      </span>
                      <span className="text-noir-500">
                        {(item.dish_price * item.quantity).toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-noir-100 mt-3 pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-brand-500">
                    {order.total.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => openGoogleMaps(order)}
                  className="btn-outline text-sm py-2 px-4"
                >
                  <Navigation size={16} />
                  Voir sur Google Maps
                </button>

                {order.status === 'ready' && (
                  <button
                    onClick={() => updateStatus(order.id, 'delivering')}
                    disabled={updatingId === order.id}
                    className="btn-primary text-sm py-2 px-4"
                  >
                    <Truck size={16} />
                    Prendre la livraison
                  </button>
                )}

                {order.status === 'delivering' && (
                  <button
                    onClick={() => updateStatus(order.id, 'delivered')}
                    disabled={updatingId === order.id}
                    className="btn-primary text-sm py-2 px-4"
                  >
                    <CheckCircle2 size={16} />
                    Marquer livrée
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}