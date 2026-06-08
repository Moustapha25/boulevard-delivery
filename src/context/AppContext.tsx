import React, { createContext, useContext, useState, useCallback } from 'react';
import type { CartItem, Dish, AppView } from '../types';

interface AppContextValue {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  currentView: AppView;
  currentOrderId: string | null;
  addToCart: (dish: Dish) => void;
  removeFromCart: (dishId: string) => void;
  updateQuantity: (dishId: string, delta: number) => void;
  clearCart: () => void;
  setView: (view: AppView) => void;
  setCurrentOrderId: (id: string | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);

  const addToCart = useCallback((dish: Dish) => {
    setCart(prev => {
      const existing = prev.find(i => i.dish.id === dish.id);
      if (existing) {
        return prev.map(i => i.dish.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { dish, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((dishId: string) => {
    setCart(prev => prev.filter(i => i.dish.id !== dishId));
  }, []);

  const updateQuantity = useCallback((dishId: string, delta: number) => {
    setCart(prev => {
      return prev.map(i => {
        if (i.dish.id !== dishId) return i;
        const newQty = i.quantity + delta;
        return newQty <= 0 ? null : { ...i, quantity: newQty };
      }).filter(Boolean) as CartItem[];
    });
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const setView = useCallback((view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <AppContext.Provider value={{
      cart, cartCount, cartTotal,
      currentView, currentOrderId,
      addToCart, removeFromCart, updateQuantity, clearCart,
      setView, setCurrentOrderId,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
