import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building2, MapPin, Phone, Globe, ShieldCheck } from 'lucide-react';

// Real imports for your project
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function AddService() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'Hospital',
    address: '',
    phone: '',
    website: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to add a service.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      // Sending to your Express backend's createService endpoint
      await axios.post(
        'import.meta.env.VITE_API_URL/services',
        {
          ...formData,
          // Defaulting location to 0,0 since we aren't using a map picker yet
          location: { type: "Point", coordinates: [0, 0] } 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(true);
      setTimeout(() => navigate('/'), 2000); // Send back to home after 2 seconds
    } catch (err) {
      console.error(err);
      setError('Failed to add service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 font-sans bg-slate-50">
      <Navbar />

      <div className="container max-w-2xl px-6 pt-32 mx-auto">
        <div className="p-8 bg-white border shadow-xl rounded-3xl shadow-slate-200/50 border-slate-100 md:p-12">
          
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 text-blue-600 bg-blue-100 rounded-2xl">
              <Building2 size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">Add a New Service</h1>
            <p className="mt-2 text-slate-500">Help the community by mapping missing essential services.</p>
          </div>

          {success && (
            <div className="flex items-center gap-3 p-4 mb-8 font-medium border bg-emerald-50 border-emerald-200 text-emerald-700 rounded-xl">
              <ShieldCheck size={20} className="shrink-0" />
              Service added successfully! Redirecting...
            </div>
          )}

          {error && (
            <div className="p-4 mb-8 font-medium text-red-700 border border-red-200 bg-red-50 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name */}
            <div>
              <label className="block mb-2 text-sm font-bold text-slate-700">Service Name *</label>
              <input 
                type="text" 
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. City Central Hospital"
                className="w-full px-4 py-3 transition-all border outline-none bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-2 text-sm font-bold text-slate-700">Category *</label>
              <datalist 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 transition-all border outline-none bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600"
              >
                <option value="Hospital">Hospital</option>
                <option value="Police Station">Police Station</option>
                <option value="Fire Station">Fire Station</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="School">School</option>
                <option value="Bank">Bank</option>
              </datalist>
            </div>

            {/* Address */}
            <div>
              <label className="flex items-center block gap-2 mb-2 text-sm font-bold text-slate-700">
                <MapPin size={16} className="text-slate-400" /> Full Address *
              </label>
              <input 
                type="text" 
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, City, State"
                className="w-full px-4 py-3 transition-all border outline-none bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Phone */}
              <div>
                <label className="flex items-center block gap-2 mb-2 text-sm font-bold text-slate-700">
                  <Phone size={16} className="text-slate-400" /> Phone Number *
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91-0000000000"
                  className="w-full px-4 py-3 transition-all border outline-none bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Website */}
              <div>
                <label className="flex items-center block gap-2 mb-2 text-sm font-bold text-slate-700">
                  <Globe size={16} className="text-slate-400" /> Website *
                </label>
                <input 
                  type="url" 
                  name="website"
                  required
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 transition-all border outline-none bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading || success}
              className="w-full py-4 mt-4 font-bold text-white transition-all bg-blue-600 shadow-lg hover:bg-blue-700 rounded-xl shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding Service...' : 'Add Service'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}