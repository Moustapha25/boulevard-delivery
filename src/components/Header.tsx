import { ShoppingCart, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { cartCount, setView, currentView } = useApp();

  const isClient = !['restaurant', 'admin'].includes(currentView);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-noir-950/95 backdrop-blur-md border-b border-brand-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={() => setView('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-500 flex items-center justify-center shadow-brand">
              <span className="text-white font-display font-bold text-sm md:text-base">B</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-white text-lg md:text-xl tracking-wide group-hover:text-brand-400 transition-colors">
                BOULEVARD
              </span>
              <span className="text-brand-400 text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase">
                Delivery
              </span>
            </div>
          </button>

          {/* Location */}
          <div className="hidden md:flex items-center gap-1.5 text-noir-300 text-sm">
            <MapPin size={14} className="text-brand-400" />
            <span>Niamey, Niger</span>
          </div>

          {/* Desktop Nav */}
          {isClient && (
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setView('home')}
                className="text-noir-300 hover:text-brand-400 text-sm font-medium transition-colors"
              >
                Menu
              </button>
              <button
                onClick={() => setView('cart')}
                className="relative flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-200 shadow-brand hover:shadow-brand-lg"
              >
                <ShoppingCart size={18} />
                <span className="text-sm">Panier</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-noir-950 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Mobile Cart Button */}
          {isClient && (
            <div className="flex md:hidden items-center gap-3">
              <button
                onClick={() => setView('cart')}
                className="relative p-2.5 bg-brand-500 text-white rounded-xl"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-noir-950 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Restaurant/Admin nav */}
          {!isClient && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('restaurant')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'restaurant'
                    ? 'bg-brand-500 text-white'
                    : 'text-noir-300 hover:text-white'
                }`}
              >
                Restaurant
              </button>
              <button
                onClick={() => setView('admin')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'admin'
                    ? 'bg-brand-500 text-white'
                    : 'text-noir-300 hover:text-white'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => setView('home')}
                className="ml-2 text-noir-400 hover:text-white text-sm transition-colors"
              >
                ← Site
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
