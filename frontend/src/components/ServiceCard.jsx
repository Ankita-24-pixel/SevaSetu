import { Star, MapPin, Phone, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ServiceCard({ service }) {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Header */}
      <div className="relative h-48 overflow-hidden bg-slate-200">
        <img 
          src={service.image} 
          alt={service.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
            {service.category}
          </span>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm backdrop-blur flex items-center gap-1
            ${service.type === 'Government' ? 'bg-emerald-500/90 text-white' : 'bg-purple-500/90 text-white'}`}>
            {service.type === 'Government' && <ShieldCheck size={12} />}
            {service.type}
          </span>
        </div>
        <button className="absolute top-4 right-4 h-8 w-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-white transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
            {service.name}
          </h3>
          <span className="flex items-center bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-sm font-bold ml-2 shrink-0">
            <Star size={14} className="fill-amber-400 text-amber-400 mr-1" />
            {service.rating}
          </span>
        </div>
        
        <p className="text-sm text-slate-500 mb-4 line-clamp-1">{service.reviews} reviews</p>

        <div className="space-y-3 mb-6 flex-grow">
          <div className="flex items-start gap-3 text-slate-600">
            <MapPin size={18} className="shrink-0 text-slate-400 mt-0.5" />
            <span className="text-sm line-clamp-2">{service.address}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Phone size={18} className="shrink-0 text-slate-400" />
            <span className="text-sm font-medium">{service.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-emerald-600">
            <Clock size={18} className="shrink-0 text-emerald-500" />
            <span className="text-sm font-medium">Open Now</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 mt-auto">
        <span className="text-sm font-bold text-slate-900 bg-slate-200/50 px-3 py-1 rounded-lg">
          {service.distance}
        </span>
        <Link 
          to={`/service/${service.id}`}
          className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800 transition-colors"
        >
          View Details
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}