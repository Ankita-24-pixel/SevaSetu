import React, { useState } from 'react';
import axios from 'axios';
import ServiceMap from '../components/ServiceMap';
import { Map, List } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import FloatingSearch from '../components/FloatingSearch';
import CategoryGrid from '../components/CategoryGrid';
import ServiceCard from '../components/ServiceCard';
import MapSection from '../components/MapSection';
import StatsSection from '../components/StatsSection';
import FeaturesSection from '../components/FeaturesSection';
import Footer from '../components/Footer';

// Haversine formula for OSM distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1); 
}

const getOSMTag = (category) => {
  const cat = category?.toLowerCase().trim() || '';
  if (cat.includes('hospital')) return 'amenity="hospital"';
  if (cat.includes('police')) return 'amenity="police"';
  if (cat.includes('pharmacy')) return 'amenity="pharmacy"';
  if (cat.includes('bank')) return 'amenity="bank"';
  if (cat.includes('fire')) return 'amenity="fire_station"';
  if (cat.includes('school')) return 'amenity="school"';
  if (cat.includes('college') || cat.includes('university')) return 'amenity="college"';
  if (cat.includes('atm')) return 'amenity="atm"';
  if (cat.includes('clinic')) return 'amenity="clinic"';
  if (cat) return `amenity="${cat.replace(/\s+/g, '_')}"`;
  return 'amenity="hospital"'; 
};

export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [currentCoords, setCurrentCoords] = useState({ lat: null, lng: null });
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const searchRef = React.useRef(null);
const handleExecuteSearch = async (searchParams) => {
    setLoading(true);
    setError('');
    setCurrentCoords({ lat: searchParams.lat, lng: searchParams.lng });

    try {
      const radiusInMeters = (searchParams.radius || 10) * 1000;
      const osmTag = getOSMTag(searchParams.category);
      
      const query = `
        [out:json][timeout:25];
        (
          node[${osmTag}](around:${radiusInMeters},${searchParams.lat},${searchParams.lng});
          way[${osmTag}](around:${radiusInMeters},${searchParams.lat},${searchParams.lng});
        );
        out center;
      `;

      const response = await axios.post(
        'https://overpass-api.de/api/interpreter',
        `data=${encodeURIComponent(query)}`,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      
      const formattedServices = response.data.elements.map(el => {
        const lat = el.lat || el.center?.lat;
        const lon = el.lon || el.center?.lon;
        const tags = el.tags || {};
        
        // 1. FIX THE BADGE: Use the actual OSM category (e.g., "school" or "hospital") instead of user input
        const actualCategory = tags.amenity ? tags.amenity.replace('_', ' ') : 'Service';
        
        return {
          id: el.id,
          // 2. FIX THE TITLE: If it's unnamed, say "Unnamed school" instead of "Unnamed subhash..."
          name: tags.name || `Unnamed ${actualCategory}`,
          category: actualCategory,
          address: tags['addr:full'] || tags['addr:street'] || tags['addr:city'] || 'Location mapped',
          location: { type: "Point", coordinates: [lon, lat] },
          phone: tags.phone || tags['contact:phone'] || tags['contact:mobile'] || null,
          website: tags.website || tags['contact:website'] || tags.url || null,
          distance: calculateDistance(searchParams.lat, searchParams.lng, lat, lon) + " km",
          rating: (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1), 
          reviews: Math.floor(Math.random() * 200) + 5
        };
      });

      // 3. THE SMART TEXT FILTER: If they searched for a specific name, hide the others
      const searchTerm = (searchParams.category || '').toLowerCase().trim();
      const genericCategories = ['hospital', 'police', 'pharmacy', 'bank', 'fire', 'school', 'college', 'university', 'atm', 'clinic'];
      const isGeneric = genericCategories.some(cat => searchTerm === cat);

      let finalServices = formattedServices;

      if (!isGeneric && searchTerm !== '') {
         const searchWords = searchTerm.split(' ').filter(word => word.length > 2 && !genericCategories.includes(word));
         
         if (searchWords.length > 0) {
             finalServices = formattedServices.filter(service => {
                 const serviceName = service.name.toLowerCase();
                 // Only keep the service if its name contains one of their specific keywords
                 return searchWords.some(word => serviceName.includes(word));
             });
         }
      }

      finalServices.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      setServices(finalServices);
      setHasSearched(true);
      
    } catch (err) {
      console.error("OSM Search failed", err);
      setError("Failed to fetch live map data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-slate-50 text-slate-900">
      <Navbar />

      <section className="relative pt-32 pb-40 overflow-hidden lg:pt-48 lg:pb-56">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-slate-50 -z-10" />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-blue-400/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-3xl -z-10" />

        <div className="container relative z-10 px-6 mx-auto lg:px-12">
          <div className="flex flex-col items-center gap-16 lg:flex-row">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full text-center lg:w-1/2 lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-200 rounded-full">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full bg-blue-500 rounded-full opacity-75 animate-ping"></span>
                  <span className="relative inline-flex w-2 h-2 bg-blue-600 rounded-full"></span>
                </span>
                Live Global Engine
              </div>
              <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight lg:text-7xl text-slate-900">
                Find Essential Services <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Near You</span>
              </h1>
              <p className="max-w-2xl mx-auto mb-10 text-lg leading-relaxed text-slate-600 lg:mx-0">
                Discover hospitals, police stations, banks, schools, pharmacies, and government services instantly anywhere in the world.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <button 
                  onClick={() => searchRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5"
                >
                  Find Services
                </button>
                <button 
                  onClick={() => {
                    setViewMode('map');
                    searchRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold shadow-sm transition-all hover:-translate-y-0.5"
                >
                  Explore Map
                </button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden w-full lg:w-1/2 lg:block"
            >
              <div className="relative w-full aspect-square max-w-[600px] mx-auto">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" alt="City Map" className="object-cover w-full h-full border-8 border-white shadow-2xl rounded-3xl" />
                
                <div className="absolute flex items-center gap-4 p-4 bg-white border shadow-xl -top-6 -left-6 rounded-2xl border-slate-100 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="p-3 text-red-600 bg-red-100 rounded-full">🏥</div>
                  <div>
                    <p className="font-bold text-slate-800">City Hospital</p>
                    <p className="text-xs text-slate-500">1.2 km away</p>
                  </div>
                </div>
                
                <div className="absolute flex items-center gap-4 p-4 bg-white border shadow-xl -bottom-8 -right-8 rounded-2xl border-slate-100 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                  <div className="p-3 text-blue-600 bg-blue-100 rounded-full">👮</div>
                  <div>
                    <p className="font-bold text-slate-800">Police Station</p>
                    <p className="text-xs text-slate-500">0.5 km away</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div ref={searchRef} className="relative z-20 px-6 mb-12 -mt-24 scroll-mt-32">
        <FloatingSearch onSearch={handleExecuteSearch} />
      </div>

      {hasSearched && (
        <section className="px-6 pb-20 duration-500 border-b bg-slate-50 border-slate-200 animate-in fade-in slide-in-from-bottom-4">
          <div className="container mx-auto">
            
            <div className="flex flex-col items-center justify-between gap-4 mb-8 sm:flex-row">
              <h2 className="text-2xl font-bold text-slate-900">Search Results</h2>
              
              <div className="flex items-center p-1 shadow-inner bg-slate-200/60 rounded-xl">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <List size={18} /> List
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Map size={18} /> Map
                </button>
              </div>
            </div>

            {loading && <p className="font-bold text-center text-blue-600 animate-pulse">Scanning Live OpenStreetMap...</p>}
            {error && <p className="p-4 font-bold text-center text-red-500 bg-red-50 rounded-xl">{error}</p>}
            
            {!loading && !error && (
              services.length === 0 ? (
                <div className="py-12 text-center bg-white border shadow-sm rounded-2xl border-slate-200">
                  <p className="font-medium text-slate-500">No services found matching your criteria in this area.</p>
                  <p className="mt-1 text-xs text-slate-400">Try expanding your search radius.</p>
                </div>
              ) : viewMode === 'list' ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => (
                     <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              ) : (
                <ServiceMap services={services} userCoords={currentCoords} />
              )
            )}
          </div>
        </section>
      )}  

      <section id="about" className="container px-6 py-20 mx-auto">
        <div className="mb-12 text-center lg:text-left">
          <h2 className="mb-4 text-3xl font-bold text-slate-900">Browse by Category</h2>
          <p className="max-w-2xl mx-auto text-slate-600 lg:mx-0">Quickly filter through specialized services in your immediate vicinity.</p>
        </div>
        <CategoryGrid />
      </section>

      <StatsSection />
      <div id='map'><MapSection /> </div>
      <FeaturesSection />
      <Footer />
    </div>
  );
}