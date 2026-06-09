import { useApp } from './context/AppContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderStatus from './components/OrderStatus';
import RestaurantPage from './pages/RestaurantPage';
import AdminPage from './pages/AdminPage';
import LivreurPage from './pages/LivreurPage';

function AppContent() {
  const { currentView, setView } = useApp();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16 md:pt-20">
        {currentView === 'home' && <HomePage />}
        {currentView === 'cart' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <Cart />
          </div>
        )}
        {currentView === 'checkout' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <Checkout />
          </div>
        )}
        {currentView === 'order-status' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <OrderStatus />
          </div>
        )}
        {currentView === 'restaurant' && <RestaurantPage />}
        {currentView === 'admin' && <AdminPage />}
        {currentView === 'livreur' && <LivreurPage />}
      </main>

      {/* Footer */}
      {['home', 'cart', 'checkout', 'order-status'].includes(currentView) && (
        <footer className="bg-noir-950 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                  <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center">
                    <span className="text-white font-display font-bold text-sm">B</span>
                  </div>
                  <span className="font-display font-bold text-lg">BOULEVARD</span>
                </div>
                <p className="text-noir-400 text-sm">Restaurant de prestige — Niamey, Niger</p>
              </div>
              <div className="flex flex-col items-center md:items-end gap-2 text-sm text-noir-400">
                <p>Livraison uniquement à Niamey</p>
                <p>Paiement Amana &amp; Nita</p>
              </div>
            </div>
            <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
              <p className="text-noir-500 text-xs">
                © 2024 Boulevard Delivery. Tous droits réservés.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setView('restaurant')}
                  className="text-noir-500 hover:text-brand-400 text-xs transition-colors"
                >
                  Espace Restaurant
                </button>
                <button
                  onClick={() => setView('admin')}
                  className="text-noir-500 hover:text-brand-400 text-xs transition-colors"
                >
                  Administration
                </button>
                <button
                 onClick={() => setView('livreur')}
                  className="text-noir-500 hover:text-brand-400 text-xs transition-colors"
                >
                   Espace Livreur
                </button>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
