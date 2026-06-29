import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ServiceCard from '../components/ServiceCard';
import { HeartCrack } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        // Call our new backend route to get the populated list
        const response = await axios.get('import.meta.env.VITE_API_URL/users/favorites', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(response.data);
      } catch (error) {
        console.error("Failed to fetch favorites", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="min-h-screen font-sans bg-slate-50">
      <Navbar />
      
      <div className="container px-6 pt-32 pb-20 mx-auto">
        <h1 className="mb-2 text-4xl font-extrabold text-slate-900">My Saved Services</h1>
        <p className="mb-10 text-slate-600">Quick access to your most important local resources.</p>

        {loading ? (
           <p className="font-bold text-blue-600 animate-pulse">Loading your favorites...</p>
        ) : favorites.length === 0 ? (
          // Empty State UI
          <div className="max-w-2xl py-20 mx-auto text-center bg-white border shadow-sm rounded-3xl border-slate-200">
            <HeartCrack size={48} className="mx-auto mb-4 text-slate-300" />
            <h2 className="mb-2 text-2xl font-bold text-slate-800">No favorites yet</h2>
            <p className="mb-6 text-slate-500">You haven't saved any services to your dashboard.</p>
            <Link to="/" className="px-6 py-3 font-semibold text-white transition-colors bg-blue-600 hover:bg-blue-700 rounded-xl">
              Explore Map & Search
            </Link>
          </div>
        ) : (
          // The Grid of Saved Cards
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map(service => (
              // We pass initiallyFavorited=true since they are strictly coming from the favorites list
              <ServiceCard key={service._id} service={service} initiallyFavorited={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}