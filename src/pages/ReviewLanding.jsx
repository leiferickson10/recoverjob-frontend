import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'https://recoverjob-backend-production.up.railway.app';

export default function ReviewLanding() {
  const { businessId } = useParams();
  const [business, setBusiness] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/review/${businessId}`)
      .then((res) => {
        if (!res.ok) throw new Error('not found');
        return res.json();
      })
      .then((data) => setBusiness(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [businessId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#1B2F5E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <p className="text-gray-500 text-center text-base">This review link is not valid.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="w-full max-w-sm flex flex-col items-center gap-8">
          {/* Star icon */}
          <div className="w-20 h-20 rounded-full bg-[#4CAF29]/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-[#4CAF29]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>

          {/* Business name */}
          <h1 className="text-3xl font-bold text-[#1B2F5E] leading-tight">
            {business.business_name}
          </h1>

          {/* Message */}
          <p className="text-gray-600 text-base leading-relaxed">
            Thank you for choosing <span className="font-semibold text-[#1B2F5E]">{business.business_name}</span>!
            Your feedback means everything to us.
          </p>

          {/* CTA button */}
          <a
            href={business.google_review_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 bg-[#4CAF29] hover:bg-[#3d9422] active:bg-[#347a1d] text-white text-lg font-semibold rounded-2xl px-6 py-5 transition-colors shadow-md shadow-[#4CAF29]/30"
          >
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 4.5c4.136 0 7.5 3.364 7.5 7.5 0 .336-.022.667-.064.992H12V12h7.424A7.5 7.5 0 1 1 12 4.5z" />
            </svg>
            Leave Us a Review
          </a>

          <p className="text-xs text-gray-400">
            Opens Google Reviews in a new tab
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="RecoverJob"
            className="h-6 w-auto"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span className="text-xs text-gray-400 font-medium">Powered by RecoverJob</span>
        </div>
      </footer>
    </div>
  );
}
