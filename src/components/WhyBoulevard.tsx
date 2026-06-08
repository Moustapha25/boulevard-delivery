import { Truck, UtensilsCrossed, CreditCard, MapPin, Star, HeadphonesIcon } from 'lucide-react';

const FEATURES = [
  {
    icon: Truck,
    title: 'Livraison rapide à Niamey',
    desc: 'Recevez vos plats chauds directement à votre domicile.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Cuisine fraîche et savoureuse',
    desc: 'Tous les plats sont préparés à la commande avec des ingrédients de qualité.',
  },
  {
    icon: CreditCard,
    title: 'Paiement sécurisé',
    desc: 'Paiement simple et sécurisé via Amana et Nita.',
  },
  {
    icon: MapPin,
    title: 'Suivi de livraison',
    desc: "Suivez facilement l'évolution de votre commande en temps réel.",
  },
  {
    icon: Star,
    title: 'Restaurant réputé',
    desc: "Boulevard est l'une des références gastronomiques de Niamey.",
  },
  {
    icon: HeadphonesIcon,
    title: 'Service client réactif',
    desc: 'Notre équipe reste disponible pour répondre à vos besoins.',
  },
];

export default function WhyBoulevard() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-brand-500 text-sm font-semibold tracking-[0.2em] uppercase mb-3 block">
            Nos engagements
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-noir-950 mb-4">
            Pourquoi choisir Boulevard ?
          </h2>
          <p className="text-noir-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Une expérience culinaire et de livraison conçue pour votre confort.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group relative bg-white rounded-2xl p-7 border border-noir-100 shadow-card
                  hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Top accent line on hover */}
                <div className="absolute top-0 left-6 right-6 h-0.5 bg-brand-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                {/* Icon */}
                <div className="w-13 h-13 mb-5 w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center
                  group-hover:bg-brand-500 transition-colors duration-300">
                  <Icon
                    size={22}
                    className="text-brand-500 group-hover:text-white transition-colors duration-300"
                  />
                </div>

                <h3 className="font-display font-semibold text-noir-950 text-lg mb-2 leading-snug">
                  {f.title}
                </h3>
                <p className="text-noir-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
