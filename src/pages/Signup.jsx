import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '../lib/supabaseClient';
import api from '../lib/api';

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null;

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '14px',
      fontFamily: 'Inter, -apple-system, sans-serif',
      color: '#1a1a2e',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#ef4444' },
  },
};

function SignupForm() {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

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
      // Step 1: Create account + Stripe subscription on backend
      const { data } = await api.post('/auth/register', {
        email,
        password,
        businessName,
        personalPhone,
      });

      const { clientSecret } = data;

      // Step 2: Confirm card with Stripe if a clientSecret was returned
      if (clientSecret && stripe && elements) {
        const cardElement = elements.getElement(CardElement);

        // SetupIntent (seti_) vs PaymentIntent (pi_) require different confirm methods
        let stripeError;
        if (clientSecret.startsWith('seti_')) {
          const result = await stripe.confirmCardSetup(clientSecret, {
            payment_method: { card: cardElement, billing_details: { email, name: businessName } },
          });
          stripeError = result.error;
        } else {
          const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: cardElement, billing_details: { email, name: businessName } },
          });
          stripeError = result.error;
        }

        if (stripeError) {
          setError(stripeError.message);
          setLoading(false);
          return;
        }
      }

      // Step 3: Sign in with Supabase to establish a session
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      navigate('/onboarding');
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
          <h1 className="text-2xl font-bold text-[#1B2F5E] tracking-tight">Start Your Free Trial</h1>
          <p className="text-gray-500 text-sm text-center">30 days free — no charge until your trial ends</p>
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

            {stripePromise && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#3D3D3D]">Card Details</label>
                <div className="border border-gray-200 rounded-xl px-4 py-3 focus-within:border-[#1B2F5E] focus-within:ring-2 focus-within:ring-[#1B2F5E]/10 transition-colors">
                  <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
                <p className="text-xs text-gray-400">Your card will not be charged for 30 days.</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (stripePromise && !stripe)}
              className="bg-[#4CAF29] text-white rounded-xl px-4 py-3 text-sm font-semibold hover:bg-[#3d9422] disabled:opacity-50 transition-colors mt-1"
            >
              {loading ? 'Setting up your account…' : 'Start Free Trial — No charge for 30 days'}
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

export default function Signup() {
  if (!stripePromise) {
    return (
      <Elements stripe={null}>
        <SignupForm />
      </Elements>
    );
  }
  return (
    <Elements stripe={stripePromise}>
      <SignupForm />
    </Elements>
  );
}
