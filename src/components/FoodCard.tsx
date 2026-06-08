import { Plus, Minus } from 'lucide-react';
import type { Dish } from '../types';
import { useApp } from '../context/AppContext';

interface FoodCardProps {
  dish: Dish;
}

export default function FoodCard({ dish }: FoodCardProps) {
  const { cart, addToCart, updateQuantity } = useApp();
  const cartItem = cart.find(i => i.dish.id === dish.id);
  const quantity = cartItem?.quantity ?? 0;

  return (
    <div className="card overflow-hidden group hover:shadow-card-hover transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden h-48 sm:h-52">
        <img
          src={dish.image_url}
          alt={dish.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-noir-950/60 via-transparent to-transparent" />
        {!dish.available && (
          <div className="absolute inset-0 bg-noir-950/70 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-noir-800 px-3 py-1.5 rounded-lg">
              Indisponible
            </span>
          </div>
        )}
        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-noir-950/80 text-brand-300 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
          {dish.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-noir-950 text-base mb-1 leading-snug">
          {dish.name}
        </h3>
        <p className="text-noir-400 text-xs leading-relaxed flex-1 mb-3 line-clamp-2">
          {dish.description}
        </p>

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-brand-500 font-bold text-lg">{dish.price.toLocaleString('fr-FR')}</span>
            <span className="text-noir-400 text-xs ml-1">FCFA</span>
          </div>

          {dish.available && (
            <>
              {quantity === 0 ? (
                <button
                  onClick={() => addToCart(dish)}
                  className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-3 py-2 rounded-xl text-sm transition-all duration-200 shadow-brand hover:shadow-brand-lg active:scale-95"
                >
                  <Plus size={16} />
                  Ajouter
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-noir-950 rounded-xl p-1">
                  <button
                    onClick={() => updateQuantity(dish.id, -1)}
                    className="w-7 h-7 flex items-center justify-center text-white hover:text-brand-400 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-white font-bold text-sm w-5 text-center">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(dish.id, 1)}
                    className="w-7 h-7 flex items-center justify-center text-white hover:text-brand-400 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
