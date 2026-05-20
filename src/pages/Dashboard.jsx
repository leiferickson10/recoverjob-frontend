import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../lib/api';

const STATUS_STYLES = {
  new: 'bg-blue-100 text-blue-700',
  responded: 'bg-green-100 text-green-700',
  converted: 'bg-amber-100 text-amber-700',
  closed: 'bg-gray-100 text-gray-500',
  dead: 'bg-gray-100 text-gray-400',
};

function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-500';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}>
      {status}
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

function buildChartData(leads) {
  return getLast7Days().map((day) => {
    const label = day.toLocaleDateString('en-US', { weekday: 'short' });
    const count = leads.filter((l) => {
      const d = new Date(l.called_at);
      return (
        d.getFullYear() === day.getFullYear() &&
        d.getMonth() === day.getMonth() &&
        d.getDate() === day.getDate()
      );
    }).length;
    return { day: label, calls: count };
  });
}

function computeStats(leads) {
  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const missedToday = leads.filter((l) =>
    new Date(l.called_at).toDateString() === today.toDateString()
  ).length;
  const thisWeek = leads.filter((l) => new Date(l.called_at) >= weekAgo).length;
  const responded = leads.filter((l) => l.status === 'responded').length;
  const rate = leads.length > 0 ? Math.round((responded / leads.length) * 100) : 0;

  return { missedToday, thisWeek, rate };
}

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/leads')
      .then((res) => setLeads(res.data))
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

  const { missedToday, thisWeek, rate } = computeStats(leads);
  const chartData = buildChartData(leads);
  const recent = [...leads]
    .sort((a, b) => new Date(b.called_at) - new Date(a.called_at))
    .slice(0, 10);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1B2F5E]">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your missed call activity</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Missed Calls Today" value={missedToday} />
        <StatCard label="Missed Calls This Week" value={thisWeek} />
        <StatCard label="Response Rate" value={`${rate}%`} />
      </div>

      {/* Line chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <p className="text-sm font-semibold text-[#1B2F5E] mb-6">Missed Calls — Last 7 Days</p>
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
              dataKey="calls"
              stroke="#1B2F5E"
              strokeWidth={2.5}
              dot={{ fill: '#1B2F5E', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent leads table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-[#1B2F5E]">Recent Leads</p>
        </div>
        {recent.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">No leads yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F7FA]">
                  <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap">Phone</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap">Time</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap">Notes</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((lead, i) => (
                  <tr
                    key={lead.id ?? i}
                    className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-[#1B2F5E] whitespace-nowrap">{lead.caller_phone}</td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{new Date(lead.called_at).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={lead.status} /></td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{lead.notes ?? '—'}</td>
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
