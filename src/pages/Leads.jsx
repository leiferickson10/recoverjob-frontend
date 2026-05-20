import { Fragment, useEffect, useState } from 'react';
import api from '../lib/api';

const STATUS_OPTIONS = ['new', 'responded', 'converted', 'dead'];

const STATUS_STYLES = {
  new: 'bg-blue-100 text-blue-700',
  responded: 'bg-green-100 text-green-700',
  converted: 'bg-amber-100 text-amber-700',
  dead: 'bg-gray-100 text-gray-400',
  closed: 'bg-gray-100 text-gray-500',
};

function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-500';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}>
      {status}
    </span>
  );
}

function AddLeadModal({ onClose, onAdded }) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/leads', { caller_phone: phone, name, notes });
      onAdded();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-[#1B2F5E] mb-6">Add Lead</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#3D3D3D]">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+1 (555) 000-0000"
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1B2F5E] focus:ring-2 focus:ring-[#1B2F5E]/10 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#3D3D3D]">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contact name (optional)"
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1B2F5E] focus:ring-2 focus:ring-[#1B2F5E]/10 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#3D3D3D]">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Optional notes…"
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1B2F5E] focus:ring-2 focus:ring-[#1B2F5E]/10 transition-colors resize-none"
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold bg-[#4CAF29] text-white hover:bg-[#3d9422] disabled:opacity-50 transition-colors"
            >
              {loading ? 'Adding…' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  function fetchLeads() {
    return api.get('/leads')
      .then((res) => setLeads(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchLeads(); }, []);

  function toggleExpand(lead) {
    if (expandedId === lead.id) {
      setExpandedId(null);
      setEditData({});
    } else {
      setExpandedId(lead.id);
      setEditData({ notes: lead.notes ?? '', status: lead.status ?? 'new' });
    }
  }

  async function saveEdit(id) {
    setSaving(true);
    try {
      await api.patch(`/leads/${id}`, editData);
      await fetchLeads();
      setExpandedId(null);
      setEditData({});
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteLead(id) {
    setDeleting(id);
    try {
      await api.delete(`/leads/${id}`);
      await fetchLeads();
      if (expandedId === id) { setExpandedId(null); setEditData({}); }
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  }

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchesSearch =
      l.caller_phone?.toLowerCase().includes(q) ||
      l.name?.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {showModal && (
        <AddLeadModal onClose={() => setShowModal(false)} onAdded={fetchLeads} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2F5E]">Leads</h1>
          <p className="text-gray-500 text-sm mt-1">{leads.length} total leads</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-[#4CAF29] text-white text-sm font-semibold hover:bg-[#3d9422] transition-colors"
        >
          + Add Lead
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by phone or name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1B2F5E] focus:ring-2 focus:ring-[#1B2F5E]/10 transition-colors flex-1 min-w-0"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1B2F5E] focus:ring-2 focus:ring-[#1B2F5E]/10 transition-colors"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-16 text-center">
          <p className="text-gray-400 text-sm">No leads found.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F5F7FA]">
                    <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Name / Phone</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap">Called At</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Notes</th>
                    <th className="text-right px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead) => (
                    <Fragment key={lead.id}>
                      <tr
                        onClick={() => toggleExpand(lead)}
                        className="border-t border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-[#1B2F5E]">{lead.name || lead.caller_phone}</div>
                          {lead.name && (
                            <div className="text-xs text-gray-400 mt-0.5">{lead.caller_phone}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                          {new Date(lead.called_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={lead.status} />
                        </td>
                        <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                          {lead.notes || '—'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteLead(lead.id); }}
                            disabled={deleting === lead.id}
                            className="text-xs text-red-400 hover:text-red-600 disabled:opacity-40 transition-colors font-medium"
                          >
                            {deleting === lead.id ? 'Deleting…' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                      {expandedId === lead.id && (
                        <tr className="bg-blue-50/30 border-t border-gray-100">
                          <td colSpan={5} className="px-6 py-5">
                            <div className="flex flex-col sm:flex-row gap-4 items-start">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-500">Status</label>
                                <select
                                  value={editData.status}
                                  onChange={(e) => setEditData((d) => ({ ...d, status: e.target.value }))}
                                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B2F5E] focus:ring-2 focus:ring-[#1B2F5E]/10 transition-colors"
                                >
                                  {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s} className="capitalize">{s}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex flex-col gap-1.5 flex-1">
                                <label className="text-xs font-medium text-gray-500">Notes</label>
                                <textarea
                                  value={editData.notes}
                                  onChange={(e) => setEditData((d) => ({ ...d, notes: e.target.value }))}
                                  rows={2}
                                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1B2F5E] focus:ring-2 focus:ring-[#1B2F5E]/10 transition-colors resize-none"
                                />
                              </div>
                              <div className="flex gap-2 sm:pt-5">
                                <button
                                  onClick={() => { setExpandedId(null); setEditData({}); }}
                                  className="px-4 py-2 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => saveEdit(lead.id)}
                                  disabled={saving}
                                  className="px-4 py-2 rounded-xl text-sm bg-[#4CAF29] text-white font-semibold hover:bg-[#3d9422] disabled:opacity-50 transition-colors"
                                >
                                  {saving ? 'Saving…' : 'Save'}
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-3">
            {filtered.map((lead) => (
              <div key={lead.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="font-medium text-[#1B2F5E]">{lead.name || lead.caller_phone}</div>
                    {lead.name && (
                      <div className="text-xs text-gray-400 mt-0.5">{lead.caller_phone}</div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(lead.called_at).toLocaleString()}
                    </div>
                  </div>
                  <StatusBadge status={lead.status} />
                </div>
                {lead.notes && (
                  <p className="text-sm text-gray-500 mb-3">{lead.notes}</p>
                )}
                {expandedId === lead.id ? (
                  <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-gray-100">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-gray-500">Status</label>
                      <select
                        value={editData.status}
                        onChange={(e) => setEditData((d) => ({ ...d, status: e.target.value }))}
                        className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1B2F5E] transition-colors"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="capitalize">{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-gray-500">Notes</label>
                      <textarea
                        value={editData.notes}
                        onChange={(e) => setEditData((d) => ({ ...d, notes: e.target.value }))}
                        rows={2}
                        className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1B2F5E] transition-colors resize-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setExpandedId(null); setEditData({}); }}
                        className="flex-1 px-4 py-2 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(lead.id)}
                        disabled={saving}
                        className="flex-1 px-4 py-2 rounded-xl text-sm bg-[#4CAF29] text-white font-semibold hover:bg-[#3d9422] disabled:opacity-50 transition-colors"
                      >
                        {saving ? 'Saving…' : 'Save'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => toggleExpand(lead)}
                      className="flex-1 px-3 py-2 rounded-xl text-xs font-medium border border-[#1B2F5E] text-[#1B2F5E] hover:bg-[#1B2F5E] hover:text-white transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteLead(lead.id)}
                      disabled={deleting === lead.id}
                      className="px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 disabled:opacity-40 transition-colors"
                    >
                      {deleting === lead.id ? '…' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
