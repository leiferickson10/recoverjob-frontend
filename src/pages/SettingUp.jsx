import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';

const POLL_INTERVAL_MS = 2000;
const SLOW_THRESHOLD_MS = 15000;
const TIMEOUT_MS = 60000;

export default function SettingUp() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');

  const [heading, setHeading] = useState('Setting up your account...');
  const [timedOut, setTimedOut] = useState(!sessionId);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;
    let pollTimer = null;

    async function checkStatus() {
      const elapsed = Date.now() - startTimeRef.current;

      if (elapsed >= TIMEOUT_MS) {
        if (!cancelled) setTimedOut(true);
        clearInterval(pollTimer);
        return;
      }

      if (elapsed >= SLOW_THRESHOLD_MS && !cancelled) {
        setHeading('Almost there, hang tight...');
      }

      try {
        const { data } = await api.get('/api/account-status', { params: { session_id: sessionId } });
        if (data.ready && !cancelled) {
          clearInterval(pollTimer);
          navigate('/onboarding');
        }
      } catch {
        // ignore transient network errors, keep polling until timeout
      }
    }

    checkStatus();
    pollTimer = setInterval(checkStatus, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(pollTimer);
    };
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen bg-[#1B2F5E] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-12 text-center">
        <img
          src="/logo.png"
          alt="RecoverJob"
          className="h-10 w-auto mx-auto mb-7"
          onError={(e) => { e.target.style.display = 'none'; }}
        />

        {!timedOut && (
          <div className="w-11 h-11 mx-auto mb-6 rounded-full border-4 border-gray-200 border-t-[#4CAF29] animate-spin" />
        )}

        <h1 className="text-xl font-extrabold text-[#1B2F5E] tracking-tight mb-2.5">
          {timedOut ? 'This is taking longer than expected.' : heading}
        </h1>

        {timedOut ? (
          <p className="text-sm text-gray-500 leading-relaxed">
            Please contact{' '}
            <a href="mailto:support@recoverjob.com" className="text-[#4CAF29] font-semibold hover:underline">
              support@recoverjob.com
            </a>{' '}
            and we'll get you set up right away.
          </p>
        ) : (
          <p className="text-sm text-gray-500 leading-relaxed">
            This usually takes just a few seconds.
          </p>
        )}
      </div>
    </div>
  );
}
