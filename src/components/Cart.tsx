import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Cart() {
  const { cart, cartTotal, updateQuantity, removeFromCart, setView } = useApp();

  const deliveryFee = cart.length > 0 ? 500 : 0;

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-noir-50 flex items-center justify-center">
          <ShoppingBag size={40} className="text-noir-300" />
        </div>
        <h2 className="font-display text-2xl font-bold text-noir-950 mb-3">Votre panier est vide</h2>
        <p className="text-noir-400 mb-8">Ajoutez des plats délicieux depuis notre menu</p>
        <button onClick={() => setView('home')} className="btn-primary">
          Voir le Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pb-24 animate-fade-in">
      {/* Back */}
      <button
        onClick={() => setView('home')}
        className="flex items-center gap-2 text-noir-400 hover:text-noir-950 mb-6 mt-2 transition-colors"
      >
        <ChevronLeft size={20} />
        <span className="text-sm font-medium">Continuer les achats</span>
      </button>

      <h2 className="font-display text-2xl md:text-3xl font-bold text-noir-950 mb-6">
        Mon Panier
      </h2>

      {/* Cart items */}
      <div className="space-y-4 mb-8">
        {cart.map(item => (
          <div
            key={item.dish.id}
            className="card p-4 flex gap-4 items-center animate-slide-up"
          >
            <img
              src={item.dish.image_url}
              alt={item.dish.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-noir-950 text-sm sm:text-base truncate">
                {item.dish.name}
              </h3>
              <p className="text-brand-500 font-bold text-sm mt-0.5">
                {(item.dish.price * item.quantity).toLocaleString('fr-FR')} FCFA
              </p>
              <p className="text-noir-400 text-xs">
                {item.dish.price.toLocaleString('fr-FR')} FCFA / unité
              </p>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1.5 bg-noir-50 rounded-xl p-1">
                <button
                  onClick={() => updateQuantity(item.dish.id, -1)}
                  className="w-7 h-7 flex items-center justify-center text-noir-600 hover:text-crimson-800 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="text-noir-950 font-bold text-sm w-5 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.dish.id, 1)}
                  className="w-7 h-7 flex items-center justify-center text-noir-600 hover:text-brand-500 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.dish.id)}
                className="ml-1 w-8 h-8 flex items-center justify-center text-noir-300 hover:text-crimson-800 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order summary */}
      <div className="card p-6 mb-6">
        <h3 className="font-semibold text-noir-950 mb-4">Résumé de la commande</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-noir-500">Sous-total</span>
            <span className="text-noir-950 font-medium">{cartTotal.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-noir-500">Frais de livraison</span>
            <span className="text-noir-950 font-medium">{deliveryFee.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div className="border-t border-noir-100 pt-3 flex justify-between">
            <span className="font-bold text-noir-950">Total</span>
            <span className="font-bold text-brand-500 text-lg">
              {(cartTotal + deliveryFee).toLocaleString('fr-FR')} FCFA
            </span>
          </div>
        </div>
      </div>

      {/* Checkout button */}
      <button
        onClick={() => setView('checkout')}
        className="btn-primary w-full text-base py-4 rounded-xl"
      >
        Commander — {(cartTotal + deliveryFee).toLocaleString('fr-FR')} FCFA
        <ArrowRight size={20} />
      </button>

      <p className="text-center text-noir-400 text-xs mt-4">
        Livraison uniquement à Niamey
      </p>
    </div>
  );
}
