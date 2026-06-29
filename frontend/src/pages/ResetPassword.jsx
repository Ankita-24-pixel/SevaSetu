import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ResetPassword() {
  const { token } = useParams(); // Grabs the secure token from the URL
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');

    try {
      // Sends the new password and the token to the backend
      await axios.post(import.meta.env.VITE_API_URL+`/users/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired reset token. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 font-sans bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white border shadow-xl rounded-3xl shadow-slate-200/50 border-slate-100">
        
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 text-blue-600 bg-blue-100 rounded-2xl">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Create New Password</h1>
          <p className="mt-2 text-sm text-slate-500">Please enter your new strong password below.</p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="inline-flex items-center gap-3 p-4 mb-6 text-sm font-medium border bg-emerald-50 border-emerald-200 text-emerald-700 rounded-xl">
              <ShieldCheck size={20} className="shrink-0" />
              Password reset successful! Redirecting to login...
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 p-4 text-sm font-medium text-red-700 border border-red-200 bg-red-50 rounded-xl">
                <AlertCircle size={20} className="shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block mb-2 text-sm font-bold text-slate-700">New Password</label>
              <div className="relative">
                <Lock className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-3 pl-12 pr-4 transition-all border outline-none bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-slate-700">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-3 pl-12 pr-4 transition-all border outline-none bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}