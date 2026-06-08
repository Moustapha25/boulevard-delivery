import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, ToggleLeft, ToggleRight, Loader2, ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Dish } from '../types';

const CATEGORIES = ['Riz', 'Grillades', 'Sandwichs', 'Boissons'];

interface DishForm {
  name: string;
  description: string;
  price: string;
  category: string;
  image_url: string;
  available: boolean;
}

const EMPTY_FORM: DishForm = {
  name: '', description: '', price: '', category: 'Riz', image_url: '', available: true,
};

export default function AdminMenu() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<DishForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function fetchDishes() {
    const { data } = await supabase.from('dishes').select('*').order('sort_order');
    if (data) setDishes(data);
    setLoading(false);
  }

  useEffect(() => { fetchDishes(); }, []);

  function validateForm() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Le nom est requis';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Prix invalide';
    if (!form.category) e.category = 'Catégorie requise';
    return e;
  }

  function startEdit(dish: Dish) {
    setEditing(dish.id);
    setCreating(false);
    setForm({
      name: dish.name,
      description: dish.description || '',
      price: String(dish.price),
      category: dish.category,
      image_url: dish.image_url || '',
      available: dish.available,
    });
    setErrors({});
  }

  function startCreate() {
    setCreating(true);
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
  }

  function cancelEdit() {
    setEditing(null);
    setCreating(false);
    setErrors({});
  }

  async function handleSave() {
    const e = validateForm();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseInt(form.price),
      category: form.category,
      image_url: form.image_url.trim(),
      available: form.available,
    };

    if (creating) {
      const maxOrder = dishes.reduce((m, d) => Math.max(m, d.sort_order), 0);
      await supabase.from('dishes').insert({ ...payload, sort_order: maxOrder + 1 });
    } else if (editing) {
      await supabase.from('dishes').update(payload).eq('id', editing);
    }

    await fetchDishes();
    setEditing(null);
    setCreating(false);
    setSaving(false);
  }

  async function toggleAvailable(dish: Dish) {
    await supabase.from('dishes').update({ available: !dish.available }).eq('id', dish.id);
    setDishes(prev => prev.map(d => d.id === dish.id ? { ...d, available: !d.available } : d));
  }

  async function deleteDish(id: string) {
    if (!confirm('Supprimer ce plat ?')) return;
    await supabase.from('dishes').delete().eq('id', id);
    setDishes(prev => prev.filter(d => d.id !== id));
  }

  const FormPanel = (
    <div className="card p-6 mb-6 border-2 border-brand-200 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-noir-950">{creating ? 'Nouveau plat' : 'Modifier le plat'}</h3>
        <button onClick={cancelEdit} className="p-1.5 text-noir-400 hover:text-noir-700 transition-colors">
          <X size={18} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-noir-600 mb-1.5">Nom du plat</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className={`input-field text-sm ${errors.name ? 'border-crimson-500' : ''}`}
            placeholder="Ex: Poulet Braisé"
          />
          {errors.name && <p className="text-crimson-600 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-noir-600 mb-1.5">Prix (FCFA)</label>
          <input
            type="number"
            value={form.price}
            onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
            className={`input-field text-sm ${errors.price ? 'border-crimson-500' : ''}`}
            placeholder="2500"
          />
          {errors.price && <p className="text-crimson-600 text-xs mt-1">{errors.price}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-noir-600 mb-1.5">Catégorie</label>
          <select
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="input-field text-sm"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-noir-600 mb-1.5">URL Image</label>
          <input
            type="url"
            value={form.image_url}
            onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
            className="input-field text-sm"
            placeholder="https://..."
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-noir-600 mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="input-field text-sm resize-none"
            rows={2}
            placeholder="Description du plat..."
          />
        </div>
        <div className="md:col-span-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setForm(f => ({ ...f, available: !f.available }))}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              form.available ? 'text-green-700' : 'text-noir-400'
            }`}
          >
            {form.available ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            {form.available ? 'Disponible' : 'Indisponible'}
          </button>
        </div>
      </div>
      <div className="flex gap-3 mt-5">
        <button onClick={handleSave} disabled={saving} className="btn-primary py-2.5 px-6">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Enregistrer
        </button>
        <button onClick={cancelEdit} className="btn-outline py-2.5 px-6">Annuler</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 pb-24">
      <div className="flex items-center justify-between mt-2 mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-noir-950">Gestion du Menu</h2>
          <p className="text-noir-400 text-sm">{dishes.length} plats enregistrés</p>
        </div>
        {!creating && !editing && (
          <button onClick={startCreate} className="btn-primary py-2.5 px-5">
            <Plus size={18} />
            Ajouter un plat
          </button>
        )}
      </div>

      {creating && FormPanel}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="card p-4 flex gap-4 animate-pulse">
              <div className="w-20 h-20 bg-noir-100 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-4 bg-noir-100 rounded w-3/4" />
                <div className="h-3 bg-noir-100 rounded w-full" />
                <div className="h-3 bg-noir-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {CATEGORIES.map(cat => {
            const catDishes = dishes.filter(d => d.category === cat);
            if (catDishes.length === 0) return null;
            return (
              <div key={cat}>
                <h3 className="text-xs font-bold text-noir-400 uppercase tracking-widest mb-2 px-1">{cat}</h3>
                <div className="space-y-3">
                  {catDishes.map(dish => (
                    <div key={dish.id}>
                      {editing === dish.id && FormPanel}
                      {editing !== dish.id && (
                        <div className={`card p-4 flex gap-4 transition-all duration-200 ${!dish.available ? 'opacity-60' : ''}`}>
                          {/* Image */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-noir-100">
                            {dish.image_url ? (
                              <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon size={24} className="text-noir-300" />
                              </div>
                            )}
                          </div>
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-semibold text-noir-950 text-sm">{dish.name}</h4>
                                <p className="text-noir-400 text-xs mt-0.5 line-clamp-1">{dish.description}</p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="font-bold text-brand-500 text-sm">{dish.price.toLocaleString('fr-FR')} FCFA</div>
                                <span className={`text-xs font-medium ${dish.available ? 'text-green-600' : 'text-noir-400'}`}>
                                  {dish.available ? 'Disponible' : 'Indisponible'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              <button
                                onClick={() => startEdit(dish)}
                                className="flex items-center gap-1 text-xs font-medium text-noir-600 hover:text-noir-950 transition-colors"
                              >
                                <Edit2 size={13} />Modifier
                              </button>
                              <span className="text-noir-200">|</span>
                              <button
                                onClick={() => toggleAvailable(dish)}
                                className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                                  dish.available ? 'text-amber-600 hover:text-amber-800' : 'text-green-600 hover:text-green-800'
                                }`}
                              >
                                {dish.available ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                                {dish.available ? 'Désactiver' : 'Activer'}
                              </button>
                              <span className="text-noir-200">|</span>
                              <button
                                onClick={() => deleteDish(dish.id)}
                                className="flex items-center gap-1 text-xs font-medium text-crimson-600 hover:text-crimson-800 transition-colors"
                              >
                                <Trash2 size={13} />Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
