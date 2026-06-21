import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      try {
        // Adjust endpoint to match your single-service backend route
        const response = await axios.get(`http://localhost:3001/api/services/${id}`);
        setService(response.data);
      } catch (err) {
        setError('Service not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error || !service) return <div className="text-center py-20 text-red-600">{error}</div>;
  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition">
        &larr; Back to Results
      </Link>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Map Placeholder */}
        <div className="h-64 bg-gray-200 w-full relative flex items-center justify-center">
          <span className="text-gray-500 font-medium">Map View Placeholder (Integrate Google Maps / Mapbox here)</span>
        </div>

        <div className="p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.name}</h1>
              <div className="flex gap-2 mb-4">
                <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">{service.category}</span>
                <span className={`text-sm px-3 py-1 rounded-full ${service.type === 'Government' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                  {service.type}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-2xl font-bold text-blue-600">{service.distance}</span>
              <span className="text-sm text-gray-500">Distance from you</span>
            </div>
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed">
            {service.description || "This is a detailed description of the service. Here you will find operational hours, specific departments available, and other vital local information regarding this facility."}
          </p>

          <div className="grid md:grid-cols-2 gap-6 border-t border-gray-100 pt-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Location</h3>
              <p className="text-gray-800">{service.address}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Contact</h3>
              <p className="text-gray-800 mb-1">📞 {service.phone || '+91 98765 43210'}</p>
              <p className="text-blue-600 hover:underline cursor-pointer">🌐 {service.website || 'Visit Website'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}