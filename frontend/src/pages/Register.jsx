import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';


export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      // Connect to the registerUser backend controller
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      // Save the token so the user is instantly logged in
      localStorage.setItem('token', response.data.token);
      
      // If you have a login context function, call it here
      login(response.data.user);

      // Redirect to the home page!
      navigate('/');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-slate-50">
      <div className="w-full max-w-md p-8 mx-auto bg-white border border-gray-100 shadow-xl rounded-3xl shadow-slate-200/50">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="text-gray-500">Join SevaSetu to save your favorite services.</p>
        </div>

        {error && (
          <div className="flex justify-center p-4 mb-6 text-sm font-medium text-red-700 border border-red-200 bg-red-50 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700">Full Name</label>
            <input 
              type="text" 
              required 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 transition-all border outline-none bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700">Email Address</label>
            <input 
              type="email" 
              required 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 transition-all border outline-none bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 pr-12 transition-all border outline-none bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="••••••••"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-sm font-semibold text-slate-400 hover:text-blue-600 transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700">Confirm Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              required
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:outline-none transition-all ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-300 focus:ring-red-500 bg-red-50/50' : 'border-slate-200 focus:ring-blue-600'}`}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 mt-6 font-bold text-white transition duration-200 bg-blue-600 shadow-lg rounded-xl hover:bg-blue-700 shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="mt-8 text-sm font-medium text-center text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-blue-600 transition-colors hover:text-blue-800">Log in</Link>
        </p>
      </div>
    </div>
  );
}