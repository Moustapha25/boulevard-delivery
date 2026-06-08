import { useState } from 'react';
import { ChevronLeft, MapPin, Phone, User, Navigation, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import type { PaymentMethod } from '../types';

const NEIGHBORHOODS = [
  'Plateau', 'Poudrière', 'Récasement', 'Terminus', 'Lazaret',
  'Dar-es-Salam', 'Koira Tegui', 'Yantala', 'Gamkallé', 'Boukoki',
  'Saga', 'Talladjé', 'Madina', 'Zongo', 'Autre',
];

type Step = 'form' | 'payment' | 'processing' | 'success';

export default function Checkout() {
  const { cart, cartTotal, clearCart, setView, setCurrentOrderId } = useApp();
  const [step, setStep] = useState<Step>('form');

  const [form, setForm] = useState({
    name: '',
    phone: '',
    neighborhood: '',
    address: '',
    notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('amana');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [gpsLoading, setGpsLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const deliveryFee = 500;
  const total = cartTotal + deliveryFee;

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Le nom est requis';
    if (!form.phone.trim() || !/^\+?[\d\s]{8,15}$/.test(form.phone)) e.phone = 'Numéro invalide';
    if (!form.neighborhood) e.neighborhood = 'Choisissez un quartier';
    return e;
  }

  function handleGetGPS() {
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsLoading(false);
      },
      () => setGpsLoading(false),
    );
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    setErrors({});
    setStep('payment');
  }

  async function handlePaymentConfirm() {
    setStep('processing');
    await new Promise(r => setTimeout(r, 2000));

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: form.name.trim(),
          customer_phone: form.phone.trim(),
          neighborhood: form.neighborhood,
          address: form.address.trim() || null,
          latitude: coords?.lat ?? null,
          longitude: coords?.lng ?? null,
          payment_method: paymentMethod,
          status: 'received',
          total,
          notes: form.notes.trim() || null,
        })
        .select()
        .single();

      if (orderError || !order) throw orderError;

      const items = cart.map(item => ({
        order_id: order.id,
        dish_id: item.dish.id,
        dish_name: item.dish.name,
        dish_price: item.dish.price,
        quantity: item.quantity,
      }));

      await supabase.from('order_items').insert(items);

      setCurrentOrderId(order.id);
      clearCart();
      setStep('success');
    } catch {
      setStep('payment');
    }
  }

  if (step === 'processing') {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-50 flex items-center justify-center">
          <Loader2 size={36} className="text-brand-500 animate-spin" />
        </div>
        <h2 className="font-display text-2xl font-bold text-noir-950 mb-3">
          Traitement en cours...
        </h2>
        <p className="text-noir-400">Validation du paiement {paymentMethod === 'amana' ? 'Amana' : 'Nita'}</p>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center animate-slide-up">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle size={48} className="text-green-500" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-noir-950 mb-3">
          Commande Confirmée !
        </h2>
        <p className="text-noir-500 mb-2">
          Merci {form.name}! Votre commande a été reçue.
        </p>
        <p className="text-noir-400 text-sm mb-8">
          Vous serez contacté au <strong>{form.phone}</strong> pour la livraison à {form.neighborhood}.
        </p>
        <div className="card p-4 mb-8 text-left">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-noir-500">Paiement</span>
            <span className="font-semibold capitalize text-noir-950">{paymentMethod === 'amana' ? 'Amana' : 'Nita'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-noir-500">Total</span>
            <span className="font-bold text-brand-500">{total.toLocaleString('fr-FR')} FCFA</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => setView('order-status')} className="btn-primary flex-1">
            Suivre ma commande
          </button>
          <button onClick={() => setView('home')} className="btn-outline flex-1">
            Retour au menu
          </button>
        </div>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="max-w-md mx-auto px-4 pb-24 animate-fade-in">
        <button onClick={() => setStep('form')} className="flex items-center gap-2 text-noir-400 hover:text-noir-950 mb-6 mt-2 transition-colors">
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Retour</span>
        </button>

        <h2 className="font-display text-2xl font-bold text-noir-950 mb-2">Paiement</h2>
        <p className="text-noir-400 text-sm mb-8">Choisissez votre mode de paiement mobile</p>

        {/* Payment method selection */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {(['amana', 'nita'] as PaymentMethod[]).map(method => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`relative p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${
                paymentMethod === method
                  ? 'border-brand-500 bg-brand-50 shadow-brand'
                  : 'border-noir-200 bg-white hover:border-noir-300'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                method === 'amana'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {method === 'amana' ? 'A' : 'N'}
              </div>
              <div className="text-center">
                <div className="font-semibold text-noir-950 capitalize">
                  {method === 'amana' ? 'Amana' : 'Nita'}
                </div>
                <div className="text-xs text-noir-400 mt-0.5">Mobile Money</div>
              </div>
              {paymentMethod === method && (
                <CheckCircle size={16} className="text-brand-500 absolute top-3 right-3" />
              )}
            </button>
          ))}
        </div>

        {/* Simulation notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
          <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-800 text-sm font-medium">Paiement simulé</p>
            <p className="text-amber-600 text-xs mt-0.5">
              L'intégration {paymentMethod === 'amana' ? 'Amana' : 'Nita'} est en cours de déploiement. Le paiement sera simulé pour cette commande.
            </p>
          </div>
        </div>

        {/* Payment phone */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-noir-700 mb-2">
            Numéro {paymentMethod === 'amana' ? 'Amana' : 'Nita'}
          </label>
          <input
            type="tel"
            value={paymentPhone}
            onChange={e => setPaymentPhone(e.target.value)}
            placeholder="+227 XX XX XX XX"
            className="input-field"
          />
        </div>

        {/* Total */}
        <div className="card p-5 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-noir-500">Montant à payer</span>
            <span className="font-bold text-brand-500 text-xl">{total.toLocaleString('fr-FR')} FCFA</span>
          </div>
        </div>

        <button onClick={handlePaymentConfirm} className="btn-primary w-full py-4 text-base rounded-xl">
          Confirmer le paiement
          <CheckCircle size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 pb-24 animate-fade-in">
      <button onClick={() => setView('cart')} className="flex items-center gap-2 text-noir-400 hover:text-noir-950 mb-6 mt-2 transition-colors">
        <ChevronLeft size={20} />
        <span className="text-sm font-medium">Mon panier</span>
      </button>

      <h2 className="font-display text-2xl font-bold text-noir-950 mb-2">Votre livraison</h2>
      <p className="text-noir-400 text-sm mb-8">Renseignez vos informations de livraison</p>

      <form onSubmit={handleFormSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-noir-700 mb-1.5">
            <User size={14} className="inline mr-1.5" />Nom complet
          </label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Votre nom"
            className={`input-field ${errors.name ? 'border-crimson-600' : ''}`}
          />
          {errors.name && <p className="text-crimson-700 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-noir-700 mb-1.5">
            <Phone size={14} className="inline mr-1.5" />Téléphone
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            placeholder="+227 XX XX XX XX"
            className={`input-field ${errors.phone ? 'border-crimson-600' : ''}`}
          />
          {errors.phone && <p className="text-crimson-700 text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* Neighborhood */}
        <div>
          <label className="block text-sm font-semibold text-noir-700 mb-1.5">
            <MapPin size={14} className="inline mr-1.5" />Quartier
          </label>
          <select
            value={form.neighborhood}
            onChange={e => setForm(f => ({ ...f, neighborhood: e.target.value }))}
            className={`input-field ${errors.neighborhood ? 'border-crimson-600' : ''}`}
          >
            <option value="">Choisir un quartier...</option>
            {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          {errors.neighborhood && <p className="text-crimson-700 text-xs mt-1">{errors.neighborhood}</p>}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-noir-700 mb-1.5">
            Adresse précise
            <span className="text-noir-400 font-normal ml-1">(optionnel)</span>
          </label>
          <input
            type="text"
            value={form.address}
            onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
            placeholder="Rue, description du lieu..."
            className="input-field"
          />
        </div>

        {/* GPS */}
        <button
          type="button"
          onClick={handleGetGPS}
          disabled={gpsLoading}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
            coords
              ? 'border-green-400 bg-green-50 text-green-700'
              : 'border-dashed border-noir-300 text-noir-500 hover:border-brand-500 hover:text-brand-600'
          }`}
        >
          {gpsLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Navigation size={16} />
          )}
          {coords ? 'Localisation GPS obtenue' : 'Partager ma localisation GPS'}
        </button>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-noir-700 mb-1.5">
            Instructions spéciales
            <span className="text-noir-400 font-normal ml-1">(optionnel)</span>
          </label>
          <textarea
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="Informations pour la livraison..."
            rows={3}
            className="input-field resize-none"
          />
        </div>

        {/* Summary */}
        <div className="card p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-noir-500">Sous-total ({cart.length} article{cart.length > 1 ? 's' : ''})</span>
            <span className="font-medium">{cartTotal.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-noir-500">Livraison</span>
            <span className="font-medium">{deliveryFee.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div className="border-t border-noir-100 pt-3 flex justify-between">
            <span className="font-bold text-noir-950">Total</span>
            <span className="font-bold text-brand-500 text-lg">{total.toLocaleString('fr-FR')} FCFA</span>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full py-4 text-base rounded-xl">
          Continuer vers le paiement
          <ChevronLeft size={20} className="rotate-180" />
        </button>
      </form>
    </div>
  );
}
