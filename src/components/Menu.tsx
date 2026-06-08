import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import FoodCard from './FoodCard';
import type { Dish } from '../types';
import { supabase } from '../lib/supabase';

const CATEGORIES = ['Tous', 'Riz', 'Grillades', 'Sandwichs', 'Boissons'];

export default function Menu() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchDishes() {
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data) setDishes(data);
      setLoading(false);
    }
    fetchDishes();
  }, []);

  const filtered = dishes.filter(d => {
    const matchCat = activeCategory === 'Tous' || d.category === activeCategory;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      {/* Section header */}
      <div className="text-center mb-10 animate-fade-in">
        <span className="text-brand-500 text-sm font-semibold tracking-[0.2em] uppercase mb-2 block">
          Notre Carte
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-noir-950 mb-4">
          Découvrez Nos Spécialités
        </h2>
        <p className="text-noir-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          Des plats cuisinés avec passion, inspirés des saveurs d'Afrique de l'Ouest,
          livrés directement chez vous à Niamey.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-noir-400" />
        <input
          type="text"
          placeholder="Rechercher un plat..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-11"
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-thin">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-brand-500 text-white shadow-brand'
                : 'bg-white border border-noir-200 text-noir-600 hover:border-brand-500 hover:text-brand-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Dishes grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card overflow-hidden animate-pulse">
              <div className="h-48 bg-noir-100" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-noir-100 rounded w-3/4" />
                <div className="h-3 bg-noir-100 rounded w-full" />
                <div className="h-3 bg-noir-100 rounded w-5/6" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 bg-noir-100 rounded w-20" />
                  <div className="h-9 bg-noir-100 rounded-xl w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-noir-400 text-lg">Aucun plat trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          {filtered.map(dish => (
            <FoodCard key={dish.id} dish={dish} />
          ))}
        </div>
      )}
    </section>
  );
}
