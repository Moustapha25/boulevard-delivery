import { useState } from 'react';
import { ClipboardList, BarChart2, ChefHat } from 'lucide-react';
import Dashboard from '../components/Dashboard';
import Stats from '../components/Stats';

type RestaurantTab = 'orders' | 'stats';

export default function RestaurantPage() {
  const [tab, setTab] = useState<RestaurantTab>('orders');

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="bg-noir-950 py-8 mb-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
              <ChefHat size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-white">Espace Restaurant</h1>
              <p className="text-noir-400 text-xs">Boulevard — Niamey</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex gap-1 bg-noir-50 p-1 rounded-xl w-fit">
          <button
            onClick={() => setTab('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === 'orders' ? 'bg-white shadow-sm text-noir-950' : 'text-noir-500 hover:text-noir-700'
            }`}
          >
            <ClipboardList size={16} />
            Commandes
          </button>
          <button
            onClick={() => setTab('stats')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === 'stats' ? 'bg-white shadow-sm text-noir-950' : 'text-noir-500 hover:text-noir-700'
            }`}
          >
            <BarChart2 size={16} />
            Statistiques
          </button>
        </div>
      </div>

      {tab === 'orders' ? <Dashboard /> : <Stats />}
    </div>
  );
}
