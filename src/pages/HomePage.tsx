import { useApp } from '../context/AppContext';
import Menu from '../components/Menu';
import WhyBoulevard from '../components/WhyBoulevard';
import HowItWorks from '../components/HowItWorks';
import { ChevronRight, Truck, Clock, Star } from 'lucide-react';

export default function HomePage() {
  const { setView } = useApp();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:min-h-[70vh] flex items-center overflow-hidden bg-noir-950">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Boulevard Restaurant"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-noir-950 via-noir-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-0">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-px w-8 bg-brand-500" />
              <span className="text-brand-400 text-sm font-semibold tracking-[0.2em] uppercase">
                Niamey, Niger
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
              La <span className="text-brand-400">Saveur</span><br />
              Livrée Chez<br />
              <em>Vous</em>
            </h1>
            <p className="text-noir-300 text-base md:text-lg leading-relaxed mb-10 max-w-xl">
              Découvrez les plats signature du restaurant Boulevard — cuisinés avec passion,
              livrés directement à votre porte à Niamey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-primary text-base py-4 px-8"
              >
                Commander maintenant
                <ChevronRight size={20} />
              </button>
              <button
                onClick={() => setView('cart')}
                className="flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200 text-base"
              >
                Voir mon panier
              </button>
            </div>

            <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-white/10">
              {[
                { icon: Truck, text: 'Livraison rapide' },
                { icon: Clock, text: 'Commande 24h/7j' },
                { icon: Star, text: 'Cuisine premium' },
              ].map(f => (
                <div key={f.text} className="flex items-center gap-2 text-noir-300">
                  <f.icon size={16} className="text-brand-400" />
                  <span className="text-sm">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Menu section */}
      <div className="pt-16">
        <Menu />
      </div>

      {/* Why Boulevard */}
      <WhyBoulevard />

      {/* How it works */}
      <HowItWorks />
    </div>
  );
}
