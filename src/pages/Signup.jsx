import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

function formatPhoneDisplay(digits) {
  const d = digits.slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export default function Signup() {
  const [businessName, setBusinessName] = useState('');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    const next = {};
    if (!businessName.trim()) next.businessName = 'Business name is required.';
    if (phoneDigits.length !== 10) next.phone = 'Enter a valid 10-digit US phone number.';
    if (!email.trim()) {
      next.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'Enter a valid email address.';
    }
    if (password.length < 8) next.password = 'Password must be at least 8 characters.';
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const { data } = await api.post('/api/signup', {
        businessName: businessName.trim(),
        phone: `+1${phoneDigits}`,
        email: email.trim(),
        password,
      });
      window.location.href = data.url;
    } catch (err) {
      setSubmitError(
        err.response?.data?.error || err.response?.data?.message || 'Something went wrong. Please try again.'
      );
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
          <h1 className="text-2xl font-bold text-[#1B2F5E] tracking-tight">Create your account</h1>
          <p className="text-gray-500 text-sm text-center">Start recovering missed calls in minutes.</p>
        </div>

        <div className="px-10 pb-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#3D3D3D]">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Acme Plumbing Co."
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1B2F5E] focus:ring-2 focus:ring-[#1B2F5E]/10 transition-colors"
              />
              {errors.businessName && <p className="text-xs text-red-600 mt-0.5">{errors.businessName}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#3D3D3D]">Phone Number</label>
              <input
                type="tel"
                value={formatPhoneDisplay(phoneDigits)}
                onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="(555) 123-4567"
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1B2F5E] focus:ring-2 focus:ring-[#1B2F5E]/10 transition-colors"
              />
              {errors.phone && <p className="text-xs text-red-600 mt-0.5">{errors.phone}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#3D3D3D]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1B2F5E] focus:ring-2 focus:ring-[#1B2F5E]/10 transition-colors"
              />
              {errors.email && <p className="text-xs text-red-600 mt-0.5">{errors.email}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#3D3D3D]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm w-full focus:outline-none focus:border-[#1B2F5E] focus:ring-2 focus:ring-[#1B2F5E]/10 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600 mt-0.5">{errors.password}</p>}
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-[#4CAF29] text-white rounded-xl px-4 py-3 text-sm font-semibold hover:bg-[#3d9422] disabled:opacity-50 transition-colors mt-1"
            >
              {loading ? 'Setting up your account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-xs text-gray-400 text-center">
            14-day free trial. $99/month after. Cancel anytime.
          </p>

          <p className="mt-6 text-sm text-gray-500 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-[#4CAF29] font-semibold hover:text-[#3d9422] transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
