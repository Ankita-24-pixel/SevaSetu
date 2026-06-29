import { useState } from 'react';
import { Star, MapPin, Phone, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ServiceCard({ service, initiallyFavorited = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isFavorited, setIsFavorited] = useState(initiallyFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    if (!user) {
      alert("Please log in to save favorites!");
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3001/api/users/favorites/toggle', 
        { 
          serviceId: service.id || service._id,
          serviceData: service // <-- THIS SENDS THE LIVE OSM DATA TO BE CACHED
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setIsFavorited(response.data.isFavorited);
    } catch (error) {
      console.error("Failed to update favorite status", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden transition-all duration-300 bg-white border shadow-sm group rounded-3xl border-slate-100 hover:shadow-xl">
      <div className="relative h-48 overflow-hidden bg-slate-200">
        <img 
          src={service.image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop"} 
          alt={service.name} 
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute flex gap-2 top-4 left-4">
          <span className="bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm capitalize">
            {service.category}
          </span>
        </div>
        
        <button 
          onClick={handleFavoriteClick}
          disabled={isLoading}
          className="absolute z-10 flex items-center justify-center w-8 h-8 transition-colors rounded-full shadow-sm top-4 right-4 bg-white/90 backdrop-blur hover:bg-white"
        >
          <Heart 
            size={16} 
            className={`transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-slate-400 hover:text-red-500'}`} 
          />
        </button>
      </div>

      <div className="flex flex-col flex-grow p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold leading-tight transition-colors text-slate-900 group-hover:text-blue-600 line-clamp-1">
            {service.name}
          </h3>
          <span className="flex items-center px-2 py-1 ml-2 text-sm font-bold rounded-md bg-amber-50 text-amber-700 shrink-0">
            <Star size={14} className="mr-1 fill-amber-400 text-amber-400" />
            {service.rating || "New"}
          </span>
        </div>
        
        <p className="mb-4 text-sm text-slate-500 line-clamp-1">{service.reviews || 0} reviews</p>

        <div className="flex-grow mb-6 space-y-3">
          <div className="flex items-start gap-3 text-slate-600">
            <MapPin size={18} className="shrink-0 text-slate-400 mt-0.5" />
            <span className="text-sm line-clamp-2">{service.address}</span>
          </div>
          {service.phone && (
            <div className="flex items-center gap-3 text-slate-600">
              <Phone size={18} className="shrink-0 text-slate-400" />
              <span className="text-sm font-medium">{service.phone}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-4 mt-auto border-t border-slate-100 bg-slate-50">
        <span className="px-3 py-1 text-sm font-bold rounded-lg text-slate-900 bg-slate-200/50">
          {service.distance || "Nearby"}
        </span>
        <Link 
          to={`/service/${service.id || service._id}`}
          state={{ serviceData: service }} 
          className="flex items-center gap-1 font-semibold text-blue-600 transition-colors hover:text-blue-800"
        >
          View Details
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}