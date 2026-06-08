import { ShoppingCart, ClipboardCheck, ChefHat, Bike, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const STEPS = [
  {
    number: '01',
    icon: ShoppingCart,
    title: 'Choisissez vos plats',
    desc: 'Parcourez notre menu et ajoutez vos plats préférés au panier.',
  },
  {
    number: '02',
    icon: ClipboardCheck,
    title: 'Validez votre commande',
    desc: 'Renseignez vos coordonnées et choisissez votre mode de paiement.',
  },
  {
    number: '03',
    icon: ChefHat,
    title: 'Le restaurant prépare',
    desc: 'La cuisine reçoit instantanément votre commande et la prépare.',
  },
  {
    number: '04',
    icon: Bike,
    title: 'Livraison à votre porte',
    desc: 'Un livreur vous apporte votre repas partout à Niamey.',
  },
];

export default function HowItWorks() {
  const { setView } = useApp();

  return (
    <section className="bg-noir-950 py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-brand-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3 block">
            Simple et rapide
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-noir-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Commander votre repas n'a jamais été aussi simple.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop only */}
          <div className="hidden lg:block absolute top-16 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-px">
            <div className="h-full border-t-2 border-dashed border-white/10" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative flex flex-col items-center text-center group"
                >
                  {/* Step circle */}
                  <div className="relative mb-6">
                    {/* Outer ring */}
                    <div className="w-32 h-32 rounded-full border border-white/10 flex items-center justify-center
                      group-hover:border-brand-500/40 transition-colors duration-300">
                      {/* Inner circle */}
                      <div className="w-24 h-24 rounded-full bg-noir-900 border border-white/10 flex flex-col items-center justify-center
                        group-hover:bg-brand-500 group-hover:border-brand-500 transition-all duration-300">
                        <Icon size={28} className="text-brand-400 group-hover:text-white transition-colors duration-300 mb-0.5" />
                      </div>
                    </div>
                    {/* Number badge */}
                    <span className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-brand-500 text-white text-xs font-bold
                      flex items-center justify-center shadow-brand">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-white text-lg mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-noir-400 text-sm leading-relaxed max-w-[200px]">
                    {step.desc}
                  </p>

                  {/* Arrow connector — mobile/tablet between steps */}
                  {i < STEPS.length - 1 && (
                    <div className="lg:hidden mt-6 text-brand-500 opacity-40">
                      <ChevronRight size={20} className="rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col items-center gap-4">
            <p className="text-noir-400 text-sm">Prêt à vous régaler ?</p>
            <button
              onClick={() => {
                setView('home');
                setTimeout(() => {
                  document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="btn-primary text-base py-4 px-10 text-lg"
            >
              Commander maintenant
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
