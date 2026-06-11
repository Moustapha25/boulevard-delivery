import { useEffect, useState, useCallback } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  CheckCircle,
  DollarSign,
  BarChart2,
  Award,
  Truck,
  Clock,
  Utensils,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Order } from '../types';

interface StatsData {
  totalOrders: number;
  deliveredOrders: number;
  refusedOrders: number;
  activeOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  recentOrders: Order[];
  bestDish: string;
  bestDishQty: number;
  topDriver: string;
  topDriverDeliveries: number;
}

export default function Stats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    const { data: orders } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .order('created_at', { ascending: false });

    if (!orders) {
      setLoading(false);
      return;
    }

    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === today);

    const deliveredOrders = orders.filter(o => o.status === 'delivered');
    const activeOrders = orders.filter(o => !['delivered', 'refused'].includes(o.status));

    const dishSales = new Map<string, number>();
    orders.forEach(order => {
      order.items?.forEach((item: any) => {
        dishSales.set(item.dish_name, (dishSales.get(item.dish_name) || 0) + item.quantity);
      });
    });

    const bestDishEntry = Array.from(dishSales.entries()).sort((a, b) => b[1] - a[1])[0];

    const driverSales = new Map<string, number>();
    deliveredOrders.forEach((order: any) => {
      if (order.driver_name) {
        driverSales.set(order.driver_name, (driverSales.get(order.driver_name) || 0) + 1);
      }
    });

    const topDriverEntry = Array.from(driverSales.entries()).sort((a, b) => b[1] - a[1])[0];

    setStats({
      totalOrders: orders.length,
      deliveredOrders: deliveredOrders.length,
      refusedOrders: orders.filter(o => o.status === 'refused').length,
      activeOrders: activeOrders.length,
      totalRevenue: deliveredOrders.reduce((s, o) => s + o.total, 0),
      todayOrders: todayOrders.length,
      todayRevenue: todayOrders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0),
      recentOrders: orders.slice(0, 5) as Order[],
      bestDish: bestDishEntry?.[0] || 'Aucun plat',
      bestDishQty: bestDishEntry?.[1] || 0,
      topDriver: topDriverEntry?.[0] || 'Aucun livreur',
      topDriverDeliveries: topDriverEntry?.[1] || 0,
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();

    const channel = supabase
      .channel('stats-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => fetchStats()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_items',
        },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-8 bg-noir-100 rounded w-16 mb-2" />
              <div className="h-4 bg-noir-100 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const deliveryRate = stats.totalOrders > 0
    ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100)
    : 0;

  const refusedRate = stats.totalOrders > 0
    ? Math.round((stats.refusedOrders / stats.totalOrders) * 100)
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 pb-24">
      <div className="mt-2 mb-6">
        <h2 className="font-display text-2xl font-bold text-noir-950">Statistiques</h2>
        <p className="text-noir-400 text-sm">Vue d'ensemble de l'activité en temps réel</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total commandes',
            value: stats.totalOrders,
            icon: ShoppingBag,
            bg: 'bg-blue-50',
            iconColor: 'text-blue-600',
            valColor: 'text-blue-700',
          },
          {
            label: 'Commandes en cours',
            value: stats.activeOrders,
            icon: Clock,
            bg: 'bg-amber-50',
            iconColor: 'text-amber-600',
            valColor: 'text-amber-700',
          },
          {
            label: 'Livrées',
            value: stats.deliveredOrders,
            icon: CheckCircle,
            bg: 'bg-green-50',
            iconColor: 'text-green-600',
            valColor: 'text-green-700',
          },
          {
            label: 'Chiffre d’affaires',
            value: `${stats.totalRevenue.toLocaleString('fr-FR')}`,
            sub: 'FCFA',
            icon: DollarSign,
            bg: 'bg-brand-50',
            iconColor: 'text-brand-500',
            valColor: 'text-brand-600',
          },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} className={`${item.bg} rounded-2xl p-5`}>
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-3 shadow-sm">
                <Icon size={20} className={item.iconColor} />
              </div>
              <div className={`text-2xl font-bold ${item.valColor}`}>
                {item.value}
                {item.sub && <span className="text-sm ml-1">{item.sub}</span>}
              </div>
              <div className="text-noir-500 text-sm mt-0.5">{item.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={18} className="text-brand-500" />
            <h3 className="font-semibold text-noir-950">Aujourd'hui</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-noir-500 text-sm">Commandes</span>
              <span className="font-bold text-noir-950 text-xl">{stats.todayOrders}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-noir-500 text-sm">Revenus</span>
              <span className="font-bold text-brand-500 text-xl">
                {stats.todayRevenue.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award size={18} className="text-brand-500" />
            <h3 className="font-semibold text-noir-950">Performance</h3>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-noir-500">Commandes livrées</span>
                <span className="font-semibold text-green-700">{deliveryRate}%</span>
              </div>

              <div className="h-2 bg-noir-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-1000"
                  style={{ width: `${deliveryRate}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-noir-500">Commandes refusées</span>
                <span className="font-semibold text-crimson-700">{refusedRate}%</span>
              </div>

              <div className="h-2 bg-noir-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-crimson-600 rounded-full transition-all duration-1000"
                  style={{ width: `${refusedRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Utensils size={18} className="text-brand-500" />
            <h3 className="font-semibold text-noir-950">Plat le plus vendu</h3>
          </div>

          <div className="font-bold text-noir-950 text-xl mb-1">{stats.bestDish}</div>
          <p className="text-noir-400 text-sm">{stats.bestDishQty} vente{stats.bestDishQty > 1 ? 's' : ''}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Truck size={18} className="text-brand-500" />
            <h3 className="font-semibold text-noir-950">Livreur le plus actif</h3>
          </div>

          <div className="font-bold text-noir-950 text-xl mb-1">{stats.topDriver}</div>
          <p className="text-noir-400 text-sm">
            {stats.topDriverDeliveries} livraison{stats.topDriverDeliveries > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {stats.recentOrders.length > 0 && (
        <div className="card p-6">
          <h3 className="font-semibold text-noir-950 mb-4">Dernières commandes</h3>

          <div className="space-y-3">
            {stats.recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-noir-50 last:border-0">
                <div>
                  <div className="font-medium text-noir-950 text-sm">{order.customer_name}</div>
                  <div className="text-noir-400 text-xs">
                    {new Date(order.created_at).toLocaleDateString('fr-FR')} · {order.neighborhood}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-brand-500 text-sm">
                    {order.total.toLocaleString('fr-FR')} FCFA
                  </div>
                  <div className="text-xs text-noir-400 capitalize">{order.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}