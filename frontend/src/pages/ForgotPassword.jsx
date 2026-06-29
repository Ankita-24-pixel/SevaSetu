import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, ArrowLeft, KeyRound, ShieldCheck } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Sends request to your backend to generate a reset token and email it
      const response = await axios.post(import.meta.env.VITE_API_URL+'/users/forgot-password', { email });
      setMessage(response.data.message || 'Password reset link sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 font-sans bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white border shadow-xl rounded-3xl shadow-slate-200/50 border-slate-100">
        
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 text-blue-600 bg-blue-100 rounded-2xl">
            <KeyRound size={32} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Reset Password</h1>
          <p className="mt-2 text-sm text-slate-500">Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        {message && (
          <div className="flex items-center gap-3 p-4 mb-6 text-sm font-medium border bg-emerald-50 border-emerald-200 text-emerald-700 rounded-xl">
            <ShieldCheck size={20} className="shrink-0" />
            {message}
          </div>
        )}

        {error && (
          <div className="p-4 mb-6 text-sm font-medium text-red-700 border border-red-200 bg-red-50 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-bold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full py-3 pl-12 pr-4 transition-all border outline-none bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || message}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending Link...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold transition-colors text-slate-500 hover:text-blue-600">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}