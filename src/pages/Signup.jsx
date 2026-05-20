import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import api from '../lib/api';

export default function Signup() {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState('');
  const [personalPhone, setPersonalPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Create auth user + business record on the backend
      await api.post('/auth/register', { email, password, businessName, personalPhone });

      // Sign in with Supabase to establish a session
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1B2F5E] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-10 pt-10 pb-6 flex flex-col items-center gap-3">
          <img
            src="/logo.png"
            alt="RecoverJob"
            className="h-12 w-auto"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <h1 className="text-2xl font-bold text-[#1B2F5E] tracking-tight">RecoverJob</h1>
          <p className="text-gray-500 text-sm">Create your account</p>
        </div>

        <div className="px-10 pb-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#3D3D3D]">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                placeholder="Mike's Plumbing"
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1B2F5E] focus:ring-2 focus:ring-[#1B2F5E]/10 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#3D3D3D]">Your Personal Phone Number</label>
              <input
                type="tel"
                value={personalPhone}
                onChange={(e) => setPersonalPhone(e.target.value)}
                required
                placeholder="+1 (801) 555-0000"
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1B2F5E] focus:ring-2 focus:ring-[#1B2F5E]/10 transition-colors"
              />
              <p className="text-xs text-gray-400">We'll forward customer replies to this number.</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#3D3D3D]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1B2F5E] focus:ring-2 focus:ring-[#1B2F5E]/10 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#3D3D3D]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1B2F5E] focus:ring-2 focus:ring-[#1B2F5E]/10 transition-colors"
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#4CAF29] text-white rounded-xl px-4 py-3 text-sm font-semibold hover:bg-[#3d9422] disabled:opacity-50 transition-colors mt-1"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
          <p className="mt-6 text-sm text-gray-500 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-[#4CAF29] font-semibold hover:text-[#3d9422] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
