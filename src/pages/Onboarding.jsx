import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

function formatPhone(e164) {
  const digits = (e164 || '').replace(/\D/g, '');
  if (digits.length === 11 && digits[0] === '1') {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return e164 || '';
}

export default function Onboarding() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [twilioNumber, setTwilioNumber] = useState('');
  const [reviewUrl, setReviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/businesses/me')
      .then((res) => {
        const b = res.data;
        setTwilioNumber(b.twilioNumber ?? b.twilio_number ?? '');
        setReviewUrl(b.google_review_url ?? '');
      })
      .catch((err) => setFetchError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaveError('');
    setSaving(true);
    try {
      await api.patch('/businesses/me', { google_review_url: reviewUrl });
      setSaved(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setSaveError(err.response?.data?.error || err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 max-w-md w-full">
          {fetchError}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6]" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* Header */}
      <div className="bg-[#1B2F5E] px-6 py-10">
        <div className="max-w-2xl mx-auto text-center">
          <img
            src="/logo.png"
            alt="RecoverJob"
            className="h-10 w-auto mx-auto mb-6"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="inline-flex items-center gap-2 bg-[#4CAF29]/20 text-[#7ed659] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            Account Created
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-3 tracking-tight">
            One Last Step
          </h1>
          <p className="text-[#93aed8] text-base leading-relaxed max-w-lg mx-auto">
            Add your Google review link so customers can leave you a review.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">

        {/* How to find your Google review link */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[#1B2F5E] mb-1">How to find your Google review link</h2>
          <p className="text-sm text-gray-500 mb-5">Follow these steps to get your shareable review link from Google Maps.</p>

          <ol className="flex flex-col gap-4 mb-6">
            {[
              'Go to <strong>google.com/maps</strong>',
              'Search your <strong>business name</strong>',
              'Click on <strong>your listing</strong>',
              'Click the <strong>three dots menu</strong> and select <strong>Share</strong>',
              'Copy the link and paste it below',
            ].map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#e8f5e2] text-[#2d7a18] text-sm font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span
                  className="text-sm text-gray-700 leading-relaxed pt-1"
                  dangerouslySetInnerHTML={{ __html: step }}
                />
              </li>
            ))}
          </ol>

          {/* Input + save */}
          {saved ? (
            <div className="flex items-center gap-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-5 py-4">
              <svg className="w-5 h-5 text-[#4CAF29] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm font-semibold text-[#166534]">You are all set! Your review link is saved.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-sm font-semibold text-[#1B2F5E]">Your Google Review Link</label>
                <input
                  type="url"
                  value={reviewUrl}
                  onChange={(e) => { setReviewUrl(e.target.value); setSaveError(''); }}
                  placeholder="https://g.page/r/..."
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1B2F5E] focus:ring-2 focus:ring-[#1B2F5E]/10 transition-colors"
                />
              </div>
              {saveError && (
                <p className="text-xs text-red-500 mb-3">{saveError}</p>
              )}
              <button
                onClick={handleSave}
                disabled={saving || !reviewUrl.trim()}
                className="w-full bg-[#4CAF29] hover:bg-[#3d9922] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3.5 rounded-xl transition-colors"
              >
                {saving ? 'Saving…' : 'Save Review Link'}
              </button>
            </>
          )}
        </div>

        {/* RecoverJob number card */}
        {twilioNumber && (
          <div className="bg-[#1B2F5E] rounded-2xl p-6 text-center shadow-lg">
            <p className="text-[#93aed8] text-xs font-bold uppercase tracking-widest mb-2">Your RecoverJob Number</p>
            <p className="text-[#4CAF29] text-5xl font-black tracking-tight mb-3">
              {formatPhone(twilioNumber)}
            </p>
            <p className="text-[#6b87b8] text-sm leading-relaxed">
              Text this number after every completed job:<br />
              <span className="font-semibold text-[#93aed8]">Customer Name &nbsp;Phone Number</span>
            </p>
          </div>
        )}

        {/* Skip + footer */}
        <div className="text-center flex flex-col gap-3 pb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            I'll set this up later
          </button>
          <p className="text-xs text-gray-400">
            Need help?{' '}
            <a href="mailto:support@recoverjob.com" className="text-[#4CAF29] hover:underline font-medium">
              Email us at support@recoverjob.com
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
