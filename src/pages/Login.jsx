import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
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
            className="h-16 w-auto"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <h1 className="text-2xl font-bold text-[#1B2F5E] tracking-tight">RecoverJob</h1>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>

        <div className="px-10 pb-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p className="mt-6 text-sm text-gray-500 text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#4CAF29] font-semibold hover:text-[#3d9422] transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
