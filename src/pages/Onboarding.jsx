import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import TeamNumbersForm from '../components/TeamNumbersForm';
import { rowsToTeamNumbers, validateRows } from '../lib/teamNumbers';

function formatPhone(e164) {
  const digits = (e164 || '').replace(/\D/g, '');
  if (digits.length === 11 && digits[0] === '1') {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return e164 || '';
}

function StarRating({ rating }) {
  if (!rating) return null;
  return (
    <span className="flex items-center gap-1 text-amber-400 text-sm font-semibold">
      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      {rating.toFixed(1)}
    </span>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();

  const [twilioNumber, setTwilioNumber] = useState('');

  // Step 1 — search
  const [query, setQuery]         = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [results, setResults]     = useState(null); // null = not searched yet

  // Step 2 — confirmation
  const [selected, setSelected]   = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState('');

  // Step 3 — success
  const [done, setDone] = useState(false);

  // Step 4 — team numbers (optional)
  const [showTeamStep, setShowTeamStep] = useState(false);
  const [teamRows, setTeamRows] = useState([]);
  const [teamError, setTeamError] = useState('');
  const [savingTeam, setSavingTeam] = useState(false);

  const step = done ? 3 : selected ? 2 : 1;

  useEffect(() => {
    api.get('/businesses/me')
      .then((res) => {
        const b = res.data;
        setTwilioNumber(b.twilioNumber ?? b.twilio_number ?? '');
      })
      .catch(() => {});
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchError('');
    setResults(null);
    setSearching(true);
    try {
      const res = await api.get('/places/search', { params: { q: query.trim() } });
      setResults(res.data);
    } catch (err) {
      setSearchError(err?.response?.data?.error || 'Search failed. Check your connection and try again.');
    } finally {
      setSearching(false);
    }
  }

  async function handleConfirm() {
    setConfirmError('');
    setConfirming(true);
    try {
      await api.post('/places/select', { place_id: selected.place_id });
      setDone(true);
      setTimeout(() => setShowTeamStep(true), 2000);
    } catch (err) {
      setConfirmError(err?.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setConfirming(false);
    }
  }

  function resetSearch() {
    setSelected(null);
    setConfirmError('');
  }

  async function handleSaveTeam() {
    setTeamError('');
    const validationError = validateRows(teamRows);
    if (validationError) {
      setTeamError(validationError);
      return;
    }
    setSavingTeam(true);
    try {
      await api.post('/businesses/team-numbers', { team_numbers: rowsToTeamNumbers(teamRows) });
      navigate('/dashboard');
    } catch (err) {
      setTeamError(err?.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setSavingTeam(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6]" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* Header */}
      <div className="bg-[#1B2F5E] px-6 py-10">
        <div className="max-w-2xl mx-auto text-center">
          <img
            src="/logo.png"
            alt="RecoverJob"
            className="h-12 w-auto mx-auto mb-6"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="inline-flex items-center gap-2 bg-[#4CAF29]/20 text-[#7ed659] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            Account Created
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-3 tracking-tight">
            One Last Step
          </h1>
          <p className="text-[#93aed8] text-base leading-relaxed max-w-lg mx-auto">
            Find your business on Google so we know where to send your customers to leave a review.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">

        {/* ── Step 1: Search ── */}
        {!showTeamStep && step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-[#1B2F5E] mb-1">Find Your Business</h2>
            <p className="text-sm text-gray-500 mb-5">Search for your business as it appears on Google Maps.</p>

            <form onSubmit={handleSearch} className="flex gap-3 mb-5">
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSearchError(''); setResults(null); }}
                placeholder="Mike's Plumbing Salt Lake City"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1B2F5E] focus:ring-2 focus:ring-[#1B2F5E]/10 transition-colors"
              />
              <button
                type="submit"
                disabled={searching || !query.trim()}
                className="px-5 py-3 rounded-xl bg-[#1B2F5E] hover:bg-[#152549] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors whitespace-nowrap"
              >
                {searching ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Searching…
                  </span>
                ) : 'Search'}
              </button>
            </form>

            {searchError && (
              <p className="text-sm text-red-500 mb-4">{searchError}</p>
            )}

            {results !== null && (
              results.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">
                  No results found. Try adding your city name.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {results.map((place) => (
                    <div
                      key={place.place_id}
                      className="flex items-center justify-between gap-4 border border-gray-100 rounded-xl px-4 py-4 hover:border-[#1B2F5E]/30 hover:bg-[#f8f9ff] transition-colors"
                    >
                      <div className="flex flex-col gap-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1B2F5E] truncate">{place.name}</p>
                        <p className="text-xs text-gray-400 truncate">{place.address}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StarRating rating={place.rating} />
                          {place.review_count > 0 && (
                            <span className="text-xs text-gray-400">{place.review_count.toLocaleString()} reviews</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelected(place)}
                        className="flex-shrink-0 px-4 py-2 rounded-xl bg-[#4CAF29] hover:bg-[#3d9922] text-white text-xs font-semibold transition-colors"
                      >
                        That's Me
                      </button>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}

        {/* ── Step 2: Confirmation ── */}
        {!showTeamStep && step === 2 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-[#1B2F5E] mb-5">Confirm Your Business</h2>

            <div className="flex items-start gap-4 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 mb-5">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#4CAF29] flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-sm font-semibold text-[#1B2F5E]">{selected.name}</p>
                <p className="text-xs text-gray-500">{selected.address}</p>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={selected.rating} />
                  {selected.review_count > 0 && (
                    <span className="text-xs text-gray-500">{selected.review_count.toLocaleString()} reviews</span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Great! We found your business. Your current Google review count is{' '}
              <strong>{selected.review_count.toLocaleString()} reviews</strong>.
            </p>

            {confirmError && (
              <p className="text-sm text-red-500 mb-4">{confirmError}</p>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="w-full bg-[#4CAF29] hover:bg-[#3d9922] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3.5 rounded-xl transition-colors"
              >
                {confirming ? 'Saving…' : 'Confirm'}
              </button>
              <button
                onClick={resetSearch}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors text-center"
              >
                Search Again
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Success ── */}
        {!showTeamStep && step === 3 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#4CAF29] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#166534]">You are all set! Your Google review link is saved.</p>
            </div>
          </div>
        )}

        {/* ── Step 4: Team Numbers (optional) ── */}
        {showTeamStep && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-[#1B2F5E] mb-1">Add Your Team (Optional)</h2>
            <p className="text-sm text-gray-500 mb-5">
              If others can answer calls, add their numbers so calls ring everyone at once. Skip this if it's just you.
            </p>

            <TeamNumbersForm rows={teamRows} onChange={setTeamRows} />

            {teamError && <p className="text-sm text-red-500 mt-4">{teamError}</p>}

            <div className="flex flex-col gap-3 mt-5">
              <button
                onClick={handleSaveTeam}
                disabled={savingTeam}
                className="w-full bg-[#4CAF29] hover:bg-[#3d9922] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3.5 rounded-xl transition-colors"
              >
                {savingTeam ? 'Saving…' : 'Continue'}
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors text-center"
              >
                Skip — I'll use one number
              </button>
            </div>
          </div>
        )}

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
          {!showTeamStep && (
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              I'll set this up later
            </button>
          )}
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
