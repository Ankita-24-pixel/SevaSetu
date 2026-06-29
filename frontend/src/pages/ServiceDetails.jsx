import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPin, Phone, Globe, ArrowLeft, 
  ShieldCheck, Navigation, AlertCircle, Heart, Search, Share2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const routerLocation = useLocation(); 
  const { user } = useAuth();
  
  // OPTIMIZATION 1: Zero-Latency Loading. 
  // Instantly grab the data passed from the ServiceCard. No loading spinners needed!
  const [service, setService] = useState(routerLocation.state?.serviceData || null);
  const [loading, setLoading] = useState(!routerLocation.state?.serviceData);
  const [error, setError] = useState('');

  const [isFavorited, setIsFavorited] = useState(false);
  const [isFavLoading, setIsFavLoading] = useState(false);

  useEffect(() => {
    // OPTIMIZATION 2: Only hit the backend as a fallback.
    // If a user reloads the page directly (losing the router state), THEN we fetch.
    if (!service) {
      const fetchServiceDetails = async () => {
        try {
          const response = await axios.get(`import.meta.env.VITE_API_URL/services/${id}`);
          setService(response.data);
        } catch (err) {
          console.error(err);
          setError("Could not load service details. The service might have been removed.");
        } finally {
          setLoading(false);
        }
      };
      fetchServiceDetails();
    }
  }, [id, service]);

  const handleFavoriteClick = async () => {
    if (!user) {
      alert("Please log in to save favorites!");
      navigate('/login');
      return;
    }

    setIsFavLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'import.meta.env.VITE_API_URL/users/favorites/toggle', 
        { 
          serviceId: service._id || service.id,
          serviceData: service // Pass data for lazy-caching
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setIsFavorited(response.data.isFavorited);
    } catch (error) {
      console.error("Failed to update favorite status", error);
    } finally {
      setIsFavLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: service.name,
          text: `Check out ${service.name} on SevaSetu`,
          url: window.location.href,
        });
      } catch (err) { console.log('Error sharing:', err); }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen font-sans bg-slate-50">
        <Navbar />
        <div className="container px-6 pt-40 mx-auto text-center">
          <AlertCircle size={64} className="mx-auto mb-4 text-red-400" />
          <h1 className="mb-2 text-2xl font-bold text-slate-900">Service Not Found</h1>
          <p className="mb-8 text-slate-600">{error}</p>
          <button onClick={() => navigate(-1)} className="font-semibold text-blue-600 hover:underline">
            &larr; Go Back
          </button>
        </div>
      </div>
    );
  }

  const mapCenter = [
    service.location.coordinates[1], 
    service.location.coordinates[0]
  ];

  return (
    <div className="min-h-screen pb-20 font-sans bg-slate-50">
      <Navbar />

      <div className="pt-20">
        <div className="w-full h-[350px] md:h-[450px] bg-slate-200 relative z-0 border-b border-slate-200 shadow-inner">
          <MapContainer 
            center={mapCenter} 
            zoom={16} 
            scrollWheelZoom={false} 
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={mapCenter}>
              <Popup>
                <strong>{service.name}</strong><br/>{service.address}
              </Popup>
            </Marker>
          </MapContainer>

          <button 
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 z-[400] flex items-center gap-2 bg-white/90 backdrop-blur-sm text-slate-800 hover:text-blue-600 font-bold px-4 py-2 rounded-xl shadow-lg border border-slate-100 transition-all"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <button 
            onClick={handleFavoriteClick}
            disabled={isFavLoading}
            className="absolute top-6 right-6 z-[400] flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg border border-slate-100 transition-all"
          >
            <Heart 
              size={24} 
              className={`transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-slate-400 hover:text-red-500'}`} 
            />
          </button>
        </div>

        <div className="container relative z-10 px-4 mx-auto -mt-12 sm:px-6">
          <div className="max-w-5xl p-8 mx-auto bg-white border shadow-xl rounded-3xl shadow-slate-200/50 border-slate-100 md:p-12">
            
            <div className="flex flex-col justify-between gap-6 pb-8 mb-8 border-b md:flex-row md:items-start border-slate-100">
              <div>
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900">
                  {service.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-slate-100 text-slate-600 text-sm font-semibold px-4 py-1.5 rounded-full border border-slate-200">
                    {service.category}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-start gap-3 md:items-end">
                <p className="font-medium text-slate-500">
                  {service.distance || (routerLocation.state?.distance ? `${routerLocation.state.distance} from you` : 'Location verified')}
                </p>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${mapCenter[0]},${mapCenter[1]}`)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-md shadow-blue-500/20 transition-all"
                >
                  <Navigation size={18} /> Get Directions
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              
              <div>
                <h3 className="mb-4 text-sm font-bold tracking-widest uppercase text-slate-400">Location</h3>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 text-blue-600 shrink-0" size={22} />
                  <div>
                    <p className="text-lg font-medium leading-snug text-slate-800">
                      {service.address}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-bold tracking-widest uppercase text-slate-400">Contact</h3>
                <div className="mb-8 space-y-4">
                  {service.phone ? (
                    <a href={`tel:${service.phone}`} className="flex items-center gap-3 group">
                      <Phone className="text-pink-600 shrink-0" size={22} />
                      <span className="text-lg font-medium transition-colors text-slate-800 group-hover:text-blue-600">
                        {service.phone}
                      </span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 opacity-60">
                      <Phone className="text-slate-400 shrink-0" size={22} />
                      <span className="text-base font-medium text-slate-500">Number not listed on map</span>
                    </div>
                  )}

                  {service.website ? (
                    <a href={service.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 group">
                      <Globe className="text-blue-500 shrink-0" size={22} />
                      <span className="text-lg font-medium text-blue-600 group-hover:underline truncate max-w-[250px] sm:max-w-sm">
                        {service.website}
                      </span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 opacity-60">
                      <Globe className="text-slate-400 shrink-0" size={22} />
                      <span className="text-base font-medium text-slate-500">Website not listed on map</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {/* OPTIMIZATION 3: Smart Google Fallback if data is missing */}
                  {(!service.phone || !service.website) && (
                    <button 
                      onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(service.name + " " + service.address)}`)}
                      className="flex items-center justify-center w-full gap-2 py-3 font-bold text-indigo-700 transition-all bg-indigo-50 hover:bg-indigo-100 rounded-xl"
                    >
                      <Search size={18} /> Search Web for Details
                    </button>
                  )}

                  <button 
                    onClick={handleShare}
                    className="flex items-center justify-center w-full gap-2 py-3 font-bold transition-all border bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border-slate-200"
                  >
                    <Share2 size={18} /> Share this location
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
