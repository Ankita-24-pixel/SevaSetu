import {Stethoscope, Shield, Landmark, Pill, GraduationCap, FileText } from 'lucide-react';

export default function CategoryGrid() {
  const categories = [
    { name: "Hospitals", icon: Stethoscope, color: "text-red-500", bg: "bg-red-50" },
    { name: "Police", icon: Shield, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "Banks", icon: Landmark, color: "text-emerald-500", bg: "bg-emerald-50" },
    { name: "Pharmacies", icon: Pill, color: "text-purple-500", bg: "bg-purple-50" },
    { name: "Schools", icon: GraduationCap, color: "text-amber-500", bg: "bg-amber-50" },
    { name: "Gov Offices", icon: FileText, color: "text-indigo-500", bg: "bg-indigo-50" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((cat, i) => {
        const Icon = cat.icon;
        return (
          <button key={i} className="group flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 hover:-translate-y-1">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${cat.bg}`}>
              <Icon size={32} className={cat.color} strokeWidth={2} />
            </div>
            <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}