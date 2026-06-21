import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import FloatingSearch from '../components/FloatingSearch';
import CategoryGrid from '../components/CategoryGrid';
import ServiceCard from '../components/ServiceCard';
import MapSection from '../components/MapSection';
import StatsSection from '../components/StatsSection';
import FeaturesSection from '../components/FeaturesSection';
import Footer from '../components/Footer';

export default function Home() {
    const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExecuteSearch = async (searchParams) => {
    setLoading(true);
    setError('');

    try {
      // Connects to the Geospatial route we created earlier!
      const response = await axios.get('http://localhost:3001/api/services/nearby', {
        params: searchParams // Automatically adds ?lat=x&lng=y&radius=z... to the URL
      });
      
      setServices(response.data);
    } catch (err) {
      console.error("Search failed", err);
      setError("Failed to fetch nearby services. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-40 lg:pt-48 lg:pb-56 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-slate-50 -z-10" />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-blue-400/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-1/2 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium text-sm mb-6 border border-blue-200">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                Live in 500+ Cities
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                Find Essential Services <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Near You</span>
              </h1>
              <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Discover hospitals, police stations, banks, pharmacies, and government services instantly. Your local bridge to everything you need.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5">
                  Find Services
                </button>
                <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold shadow-sm transition-all hover:-translate-y-0.5">
                  Explore Map
                </button>
              </div>
            </motion.div>
            

            {/* Hero Abstract Graphic */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full lg:w-1/2 relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-[600px] mx-auto">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" alt="City Map" className="rounded-3xl shadow-2xl object-cover w-full h-full border-8 border-white" />
                
                {/* Floating Elements */}
                <div className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="bg-red-100 p-3 rounded-full text-red-600">🏥</div>
                  <div>
                    <p className="font-bold text-slate-800">City Hospital</p>
                    <p className="text-xs text-slate-500">1.2 km away</p>
                  </div>
                </div>
                
                <div className="absolute -bottom-8 -right-8 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600">👮</div>
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
      {/* Categories */}
      <section className="py-20 px-6 container mx-auto">
        <div className="mb-12 text-center lg:text-left">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Browse by Category</h2>
          <p className="text-slate-600 max-w-2xl">Quickly filter through specialized services in your immediate vicinity.</p>
        </div>
        <CategoryGrid />
      </section>
      {/* Nearby Services Listing */}
      <section className="py-20 px-6 bg-white border-y border-slate-200">
        <div className="container mx-auto">
          {loading && <p className="text-center text-blue-600 font-bold">Searching area...</p>}
          {error && <p className="text-center text-red-500 font-bold">{error}</p>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {services.map((service, index) => (
              <motion.div key={service._id} /* ... */>
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Overlapping Floating Search */}
      <div className="relative z-20 -mt-24 mb-20 px-6">
        <FloatingSearch onSearch={handleExecuteSearch}/>
      </div>

      <StatsSection />

      

      

      <MapSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}