import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

function useSaveState() {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  function onSuccess() {
    setError('');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function onError(err) {
    setSaved(false);
    setError(err?.response?.data?.error || err.message);
  }

  return { saved, error, onSuccess, onError };
}

function formatDisplay(e164) {
  const d = (e164 || '').replace(/\D/g, '');
  if (d.length === 11) return `+1 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  return e164 || '';
}

export default function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading]       = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [twilioNumber, setTwilioNumber] = useState('');
  const [copied, setCopied]             = useState(false);

  const [reviewUrl, setReviewUrl]   = useState('');
  const reviewSave = useSaveState();

  // Billing cancel flow
  const [showConfirm, setShowConfirm]     = useState(false);
  const [cancelling, setCancelling]       = useState(false);
  const [cancelError, setCancelError]     = useState('');
  const [cancelSuccess, setCancelSuccess] = useState(false);

  useEffect(() => {
    api.get('/businesses/me')
      .then((res) => {
        const b = res.data;
        setTwilioNumber(b.twilioNumber ?? b.twilio_number ?? b.phone ?? '');
        setReviewUrl(b.google_review_url ?? '');
      })
      .catch((err) => setFetchError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function copyTwilioNumber() {
    if (!twilioNumber) return;
    navigator.clipboard.writeText(twilioNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function saveReviewUrl() {
    try {
      await api.patch('/businesses/me', { google_review_url: reviewUrl });
      reviewSave.onSuccess();
    } catch (err) {
      reviewSave.onError(err);
    }
  }

  async function confirmCancel() {
    setCancelError('');
    setCancelling(true);
    try {
      await api.post('/billing/cancel');
      setCancelSuccess(true);
      setShowConfirm(false);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setCancelError(err?.response?.data?.error || err.message);
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    );
  }
  if (fetchError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">{fetchError}</div>
    );
  }

  return (
    <>
      {/* Cancel confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <h2 className="text-base font-bold text-[#1B2F5E] mb-2">Cancel Subscription?</h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Are you sure? Your account will be cancelled at the end of your billing period.
            </p>
            {cancelError && (
              <p className="text-xs text-red-500 mb-4">{cancelError}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowConfirm(false); setCancelError(''); }}
                disabled={cancelling}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={confirmCancel}
                disabled={cancelling}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
              >
                {cancelling ? 'Cancelling…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-8 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2F5E]">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your RecoverJob account</p>
        </div>

        {/* RecoverJob Number */}
        {twilioNumber && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-[#1B2F5E] mb-1">Your RecoverJob Number</h2>
            <p className="text-xs text-gray-400 mb-5">Text this number after every completed job: Customer Name &nbsp;Phone Number</p>
            <div className="flex gap-3">
              <input
                type="text"
                value={formatDisplay(twilioNumber)}
                readOnly
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm bg-[#F5F7FA] text-[#3D3D3D] font-medium cursor-default select-all"
              />
              <button
                onClick={copyTwilioNumber}
                className="px-4 py-3 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {/* Google Review Link */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-[#1B2F5E] mb-1">Google Review Link</h2>
          <p className="text-xs text-gray-400 mb-5">This is the link your customers receive when they reply YES.</p>
          <div className="flex flex-col gap-1.5 mb-5">
            <input
              type="url"
              value={reviewUrl}
              onChange={(e) => setReviewUrl(e.target.value)}
              placeholder="https://g.page/r/..."
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1B2F5E] focus:ring-2 focus:ring-[#1B2F5E]/10 transition-colors"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={saveReviewUrl}
              className="px-5 py-2.5 rounded-xl bg-[#4CAF29] text-white text-sm font-semibold hover:bg-[#3d9422] transition-colors"
            >
              Save
            </button>
            {reviewSave.saved && <span className="text-sm text-[#4CAF29] font-medium">Saved!</span>}
            {reviewSave.error && <span className="text-sm text-red-600">{reviewSave.error}</span>}
          </div>
        </div>

        {/* Billing */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-[#1B2F5E] mb-1">Billing</h2>
          <p className="text-xs text-gray-400 mb-5">Cancel your RecoverJob subscription.</p>
          {cancelSuccess ? (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              Your subscription has been cancelled. Redirecting…
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="px-5 py-2.5 rounded-xl border border-red-300 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors"
            >
              Cancel Subscription
            </button>
          )}
        </div>

      </div>
    </>
  );
}
