import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../lib/api';

const STATUS_STYLES = {
  pending:      'bg-gray-100 text-gray-500',
  opt_in_sent:  'bg-blue-100 text-blue-700',
  review_sent:  'bg-green-100 text-green-700',
  opted_out:    'bg-red-100 text-red-600',
};

const STATUS_LABELS = {
  pending:      'Pending',
  opt_in_sent:  'Opt-in Sent',
  review_sent:  'Review Sent',
  opted_out:    'Opted Out',
};

function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-500';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function RespondedBadge({ responded }) {
  const cls = responded ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {responded ? 'Responded' : 'No response'}
    </span>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-2">
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      <span className="text-4xl font-bold text-[#4CAF29]">{value}</span>
    </div>
  );
}

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
}

function buildChartData(recent) {
  return getLast7Days().map((day) => {
    const label = day.toLocaleDateString('en-US', { weekday: 'short' });
    const count = recent.filter((r) => {
      const d = new Date(r.created_at);
      return (
        d.getFullYear() === day.getFullYear() &&
        d.getMonth() === day.getMonth() &&
        d.getDate() === day.getDate()
      );
    }).length;
    return { day: label, requests: count };
  });
}

function formatPhone(e164) {
  const digits = (e164 || '').replace(/\D/g, '');
  if (digits.length === 11 && digits[0] === '1') {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return e164 || '';
}

const TABS = [
  { key: 'calls',   label: 'Calls' },
  { key: 'reviews', label: 'Reviews' },
];

function TabSwitcher({ activeTab, onChange }) {
  return (
    <div className="inline-flex bg-gray-100 rounded-xl p-1 gap-1 self-start">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === tab.key
              ? 'bg-white text-[#1B2F5E] shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function CallsTab({ callsStats, callsHistory, callsRecent, twilioNumber }) {
  const [range, setRange] = useState('7');

  const windowed = range === '7' ? callsHistory.slice(-7) : callsHistory;
  const chartData = windowed.map((row) => ({
    day: new Date(row.date).toLocaleDateString('en-US',
      range === '7' ? { weekday: 'short' } : { month: 'short', day: 'numeric' }),
    Answered: row.answered,
    Unanswered: row.unanswered,
  }));

  const recentSorted = [...callsRecent]
    .sort((a, b) => new Date(b.called_at) - new Date(a.called_at))
    .slice(0, 10);

  return (
    <>
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Missed Calls" value={callsStats.missed_total} />
        <StatCard label="Texts Sent Today"    value={callsStats.texts_sent_today} />
        <StatCard label="Calls Answered"      value={callsStats.answered} />
        <StatCard label="Calls Unanswered"    value={callsStats.unanswered} />
      </div>

      {/* Answered vs Unanswered chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-semibold text-[#1B2F5E]">Calls — Answered vs Unanswered</p>
          <div className="inline-flex bg-gray-100 rounded-lg p-1 gap-1">
            {['7', '30'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  range === r ? 'bg-white text-[#1B2F5E] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {r}D
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                fontSize: '13px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line
              type="monotone"
              dataKey="Answered"
              stroke="#4CAF29"
              strokeWidth={2.5}
              dot={{ fill: '#4CAF29', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="Unanswered"
              stroke="#1B2F5E"
              strokeWidth={2.5}
              dot={{ fill: '#1B2F5E', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent missed calls log */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-[#1B2F5E]">Recent Missed Calls</p>
        </div>
        {recentSorted.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-400 text-sm mb-3">
              No missed calls yet. Once a call to your RecoverJob number goes unanswered, it'll show up here.
            </p>
            {twilioNumber && (
              <p className="text-[#1B2F5E] text-lg font-bold">{formatPhone(twilioNumber)}</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F7FA]">
                  <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap">Caller</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap">Time</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap">Responded to Text</th>
                </tr>
              </thead>
              <tbody>
                {recentSorted.map((lead, i) => (
                  <tr
                    key={lead.id ?? i}
                    className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-[#1B2F5E] whitespace-nowrap">{formatPhone(lead.caller_phone)}</td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{new Date(lead.called_at).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RespondedBadge responded={lead.status === 'responded'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function ReviewsTab({ stats, recent, twilioNumber, googleProfile, qrCode, qrLoading }) {
  const chartData = buildChartData(recent);
  const recentSorted = [...recent]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10);

  return (
    <>
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Requests Today"    value={stats.today} />
        <StatCard label="Requests This Week" value={stats.this_week} />
        <StatCard label="Opted In"          value={stats.opted_in} />
        <StatCard label="Reviews Sent"      value={stats.reviews_sent} />
      </div>

      {/* Google Profile card */}
      {googleProfile && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-[#1B2F5E]">Google Business Profile</p>
            {googleProfile.lastSynced && (
              <p className="text-xs text-gray-400">
                Synced {new Date(googleProfile.lastSynced).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 font-medium">Current Rating</span>
              {googleProfile.rating ? (
                <span className="flex items-center gap-1.5">
                  <svg className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-2xl font-bold text-[#1B2F5E]">{googleProfile.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-400">/ 5</span>
                </span>
              ) : (
                <span className="text-2xl font-bold text-gray-300">—</span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 font-medium">Total Reviews</span>
              <span className="text-2xl font-bold text-[#4CAF29]">{googleProfile.reviewCount.toLocaleString()}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 font-medium">Reviews Gained with RecoverJob</span>
              <span className="text-2xl font-bold text-[#4CAF29]">
                +{Math.max(0, googleProfile.reviewCount - googleProfile.baseline)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* QR Code card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <p className="text-sm font-semibold text-[#1B2F5E] mb-4">Your QR Code</p>
        {qrLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-8 h-8 border-4 border-[#1B2F5E] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : qrCode ? (
          <div className="flex flex-col items-center gap-4">
            <img src={qrCode} alt="Review QR code" className="w-48 h-48 rounded-xl" />
            <p className="text-sm text-gray-500 text-center max-w-sm leading-relaxed">
              Print this and place it at your front counter. Customers scan it to leave you a Google review instantly.
            </p>
            <button
              onClick={() => {
                const a = document.createElement('a');
                a.href = qrCode;
                a.download = 'recoverjob-qrcode.png';
                a.click();
              }}
              className="flex items-center gap-2 bg-[#1B2F5E] hover:bg-[#15254d] text-white text-sm font-semibold rounded-xl px-5 py-2.5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download QR Code
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-6">QR code unavailable.</p>
        )}
      </div>

      {/* Line chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <p className="text-sm font-semibold text-[#1B2F5E] mb-6">Review Requests — Last 7 Days</p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                fontSize: '13px',
              }}
            />
            <Line
              type="monotone"
              dataKey="requests"
              stroke="#1B2F5E"
              strokeWidth={2.5}
              dot={{ fill: '#1B2F5E', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent requests table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-[#1B2F5E]">Recent Requests</p>
        </div>
        {recentSorted.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-400 text-sm mb-3">
              No review requests yet. Text your RecoverJob number after your next job to get started.
            </p>
            {twilioNumber && (
              <p className="text-[#1B2F5E] text-lg font-bold">{formatPhone(twilioNumber)}</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F7FA]">
                  <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap">Customer Name</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap">Phone</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap">Requested</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSorted.map((req, i) => (
                  <tr
                    key={req.id ?? i}
                    className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-[#1B2F5E] whitespace-nowrap">{req.customer_name ?? '—'}</td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{formatPhone(req.customer_phone)}</td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{new Date(req.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={req.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('calls');

  const [stats, setStats] = useState({ today: 0, this_week: 0, opted_in: 0, reviews_sent: 0 });
  const [recent, setRecent] = useState([]);
  const [twilioNumber, setTwilioNumber] = useState('');
  const [googleProfile, setGoogleProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [qrLoading, setQrLoading] = useState(true);

  const [callsStats, setCallsStats] = useState({ missed_total: 0, texts_sent_today: 0, answered: 0, unanswered: 0 });
  const [callsHistory, setCallsHistory] = useState([]);
  const [callsRecent, setCallsRecent] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/review-requests/stats').catch(() => ({ data: { today: 0, this_week: 0, opted_in: 0, reviews_sent: 0 } })),
      api.get('/review-requests/recent').catch(() => ({ data: [] })),
      api.get('/businesses/me').catch(() => ({ data: {} })),
      api.get('/calls/stats').catch(() => ({ data: { missed_total: 0, texts_sent_today: 0, answered: 0, unanswered: 0 } })),
      api.get('/calls/history?days=30').catch(() => ({ data: [] })),
      api.get('/calls/recent').catch(() => ({ data: [] })),
    ])
      .then(([statsRes, recentRes, bizRes, callsStatsRes, callsHistoryRes, callsRecentRes]) => {
        setStats(statsRes.data);
        setRecent(recentRes.data);
        setCallsStats(callsStatsRes.data);
        setCallsHistory(callsHistoryRes.data);
        setCallsRecent(callsRecentRes.data);
        const b = bizRes.data;
        setTwilioNumber(b.twilioNumber ?? b.twilio_number ?? '');
        if (b.google_place_id) {
          setGoogleProfile({
            rating:        b.google_rating ?? null,
            reviewCount:   b.review_count_current ?? 0,
            baseline:      b.review_count_baseline ?? 0,
            lastSynced:    b.last_synced_at ?? null,
          });
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    api.get('/businesses/qrcode')
      .then((res) => setQrCode(res.data.qr_code))
      .catch(() => {})
      .finally(() => setQrLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">{error}</div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2F5E]">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of your calls and review requests</p>
        </div>
        <TabSwitcher activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'calls' ? (
        <CallsTab
          callsStats={callsStats}
          callsHistory={callsHistory}
          callsRecent={callsRecent}
          twilioNumber={twilioNumber}
        />
      ) : (
        <ReviewsTab
          stats={stats}
          recent={recent}
          twilioNumber={twilioNumber}
          googleProfile={googleProfile}
          qrCode={qrCode}
          qrLoading={qrLoading}
        />
      )}
    </div>
  );
}
