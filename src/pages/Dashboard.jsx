import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
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

export default function Dashboard() {
  const [stats, setStats] = useState({ today: 0, this_week: 0, opted_in: 0, reviews_sent: 0 });
  const [recent, setRecent] = useState([]);
  const [twilioNumber, setTwilioNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/review-requests/stats').catch(() => ({ data: { today: 0, this_week: 0, opted_in: 0, reviews_sent: 0 } })),
      api.get('/review-requests/recent').catch(() => ({ data: [] })),
      api.get('/businesses/me').catch(() => ({ data: {} })),
    ])
      .then(([statsRes, recentRes, bizRes]) => {
        setStats(statsRes.data);
        setRecent(recentRes.data);
        setTwilioNumber(bizRes.data.twilioNumber ?? bizRes.data.twilio_number ?? '');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
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

  const chartData = buildChartData(recent);
  const recentSorted = [...recent]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1B2F5E]">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your review requests</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Requests Today"    value={stats.today} />
        <StatCard label="Requests This Week" value={stats.this_week} />
        <StatCard label="Opted In"          value={stats.opted_in} />
        <StatCard label="Reviews Sent"      value={stats.reviews_sent} />
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
    </div>
  );
}
