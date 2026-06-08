import { useState } from 'react';
import { UtensilsCrossed, BarChart2, ShoppingBag, Shield } from 'lucide-react';
import AdminMenu from '../components/AdminMenu';
import Stats from '../components/Stats';
import Dashboard from '../components/Dashboard';

type AdminTab = 'menu' | 'orders' | 'stats';

const ADMIN_PIN = 'admin123';

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>('menu');
  const [pin, setPin] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);

  function handlePinSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setAuthenticated(true);
    } else {
      setPinError(true);
      setPin('');
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 animate-fade-in">
        <div className="card p-8 w-full max-w-sm text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-noir-950 flex items-center justify-center">
            <Shield size={28} className="text-brand-400" />
          </div>
          <h2 className="font-display text-xl font-bold text-noir-950 mb-1">Accès Admin</h2>
          <p className="text-noir-400 text-sm mb-6">Entrez le code d'accès</p>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input
              type="password"
              value={pin}
              onChange={e => { setPin(e.target.value); setPinError(false); }}
              placeholder="••••••••"
              className={`input-field text-center tracking-widest text-lg ${pinError ? 'border-crimson-500' : ''}`}
              autoFocus
            />
            {pinError && <p className="text-crimson-600 text-sm">Code incorrect</p>}
            <button type="submit" className="btn-primary w-full py-3">
              Accéder
            </button>
          </form>
          <p className="text-noir-300 text-xs mt-4">Code par défaut : admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="bg-noir-950 py-8 mb-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-white">Administration</h1>
              <p className="text-noir-400 text-xs">Gestion complète — Boulevard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex gap-1 bg-noir-50 p-1 rounded-xl w-fit">
          {([
            { key: 'menu', label: 'Menu', icon: UtensilsCrossed },
            { key: 'orders', label: 'Commandes', icon: ShoppingBag },
            { key: 'stats', label: 'Statistiques', icon: BarChart2 },
          ] as const).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tab === t.key ? 'bg-white shadow-sm text-noir-950' : 'text-noir-500 hover:text-noir-700'
              }`}
            >
              <t.icon size={15} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'menu' && <AdminMenu />}
      {tab === 'orders' && <Dashboard />}
      {tab === 'stats' && <Stats />}
    </div>
  );
}
