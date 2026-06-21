import { ShieldCheck, Zap, Star, Layout } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Fast Discovery",
      desc: "Instantly find the nearest hospitals, police stations, and banks using our optimized location algorithms.",
      color: "text-amber-500",
      bg: "bg-amber-50"
    },
    {
      icon: ShieldCheck,
      title: "Verified Data",
      desc: "All government and private service listings are verified to ensure you get accurate contact details and addresses.",
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    },
    {
      icon: Star,
      title: "Community Ratings",
      desc: "Make informed decisions based on genuine reviews and ratings left by users in your local community.",
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      icon: Layout,
      title: "Intuitive Interface",
      desc: "A clean, ad-free experience designed to help you find critical services without any friction or confusion.",
      color: "text-purple-500",
      bg: "bg-purple-50"
    }
  ];

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Choose SevaSetu?</h2>
          <p className="text-lg text-slate-600">Built to bring essential services to your fingertips with speed, accuracy, and absolute ease.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow duration-300">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.bg}`}>
                  <Icon size={28} className={feature.color} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}