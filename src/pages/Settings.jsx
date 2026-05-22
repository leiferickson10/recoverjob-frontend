import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

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
    setError(err.message);
  }

  return { saved, error, onSuccess, onError };
}

function Toggle({ checked, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div
        className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${
          checked ? 'bg-[#4CAF29]' : 'bg-gray-200'
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full shadow transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
      <span className="ml-3 text-sm font-medium text-[#3D3D3D]">Enable follow-up</span>
    </label>
  );
}

export default function Settings() {
  const { user } = useAuth();
  const [businessId, setBusinessId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [autoReply, setAutoReply] = useState('');
  const autoReplySave = useSaveState();

  const [followUpEnabled, setFollowUpEnabled] = useState(false);
  const [followUpDelay, setFollowUpDelay] = useState(15);
  const [followUpMessage, setFollowUpMessage] = useState('');
  const followUpSave = useSaveState();

  const [twilioNumber, setTwilioNumber] = useState('');
  const [copied, setCopied] = useState(false);

  const [whitelist, setWhitelist] = useState([]);
  const [newPhone, setNewPhone] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const whitelistSave = useSaveState();

  useEffect(() => {
    api.get('/businesses/me')
      .then((res) => {
        const b = res.data;
        setBusinessId(b.id);
        setAutoReply(b.autoReplyMessage ?? '');
        setFollowUpEnabled(b.followUpEnabled ?? false);
        setFollowUpDelay(b.followUpDelay ?? 15);
        setFollowUpMessage(b.followUpMessage ?? '');
        setTwilioNumber(b.twilioNumber ?? b.twilio_number ?? b.phone ?? '');
        setWhitelist(b.whitelist_numbers ?? []);
      })
      .catch((err) => setFetchError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function saveAutoReply() {
    try {
      await api.patch(`/businesses/${businessId}`, { autoReplyMessage: autoReply });
      autoReplySave.onSuccess();
    } catch (err) {
      autoReplySave.onError(err);
    }
  }

  async function saveFollowUp() {
    try {
      await api.patch(`/businesses/${businessId}`, {
        followUpEnabled,
        followUpDelay: Number(followUpDelay),
        followUpMessage,
      });
      followUpSave.onSuccess();
    } catch (err) {
      followUpSave.onError(err);
    }
  }

  function normalizePhone(raw) {
    const digits = raw.replace(/\D/g, '');
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
    return null;
  }

  function formatDisplay(e164) {
    const d = e164.replace(/\D/g, '');
    if (d.length === 11) return `+1 (${d.slice(1,4)}) ${d.slice(4,7)}-${d.slice(7)}`;
    return e164;
  }

  function addContact() {
    setPhoneError('');
    const normalized = normalizePhone(newPhone);
    if (!normalized) {
      setPhoneError('Enter a valid US phone number.');
      return;
    }
    if (whitelist.some(e => e.phone.replace(/\D/g,'') === normalized.replace(/\D/g,''))) {
      setPhoneError('That number is already in your list.');
      return;
    }
    setWhitelist(prev => [...prev, { phone: normalized, label: newLabel.trim() }]);
    setNewPhone('');
    setNewLabel('');
  }

  function removeContact(phone) {
    setWhitelist(prev => prev.filter(e => e.phone !== phone));
  }

  async function saveWhitelist() {
    try {
      await api.patch('/businesses/me', { whitelist_numbers: whitelist });
      whitelistSave.onSuccess();
    } catch (err) {
      whitelistSave.onError(err);
    }
  }

  function copyTwilioNumber() {
    if (!twilioNumber) return;
    navigator.clipboard.writeText(twilioNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-[#1B2F5E]">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure your auto-reply and follow-up messages</p>
      </div>

      {/* Business Number */}
      {twilioNumber && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-[#1B2F5E] mb-1">Your Business Number</h2>
          <p className="text-xs text-gray-400 mb-5">This is the Twilio number customers will see.</p>
          <div className="flex gap-3">
            <input
              type="text"
              value={twilioNumber}
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

      {/* Auto-Reply Message */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-[#1B2F5E] mb-1">Auto-Reply Message</h2>
        <p className="text-xs text-gray-400 mb-5">
          Sent automatically when someone calls and you don't answer.
        </p>
        <div className="flex flex-col gap-1.5 mb-5">
          <textarea
            value={autoReply}
            onChange={(e) => setAutoReply(e.target.value.slice(0, 320))}
            rows={4}
            placeholder="Hi! Sorry I missed your call. I'll get back to you shortly…"
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1B2F5E] focus:ring-2 focus:ring-[#1B2F5E]/10 transition-colors resize-none"
          />
          <span className="text-xs text-gray-400 text-right">{autoReply.length} / 320</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={saveAutoReply}
            className="px-5 py-2.5 rounded-xl bg-[#4CAF29] text-white text-sm font-semibold hover:bg-[#3d9422] transition-colors"
          >
            Save
          </button>
          {autoReplySave.saved && <span className="text-sm text-[#4CAF29] font-medium">Saved!</span>}
          {autoReplySave.error && <span className="text-sm text-red-600">{autoReplySave.error}</span>}
        </div>
      </div>

      {/* Follow-Up Message */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-[#1B2F5E] mb-1">Follow-Up Message</h2>
        <p className="text-xs text-gray-400 mb-5">
          Send a follow-up if the customer hasn't replied.
        </p>
        <div className="flex flex-col gap-5">
          <Toggle
            checked={followUpEnabled}
            onChange={(e) => setFollowUpEnabled(e.target.checked)}
          />

          {followUpEnabled && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#3D3D3D]">Delay (minutes)</label>
                <input
                  type="number"
                  min={1}
                  max={1440}
                  value={followUpDelay}
                  onChange={(e) => setFollowUpDelay(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm w-36 focus:outline-none focus:border-[#1B2F5E] focus:ring-2 focus:ring-[#1B2F5E]/10 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#3D3D3D]">Follow-up message</label>
                <textarea
                  value={followUpMessage}
                  onChange={(e) => setFollowUpMessage(e.target.value)}
                  rows={3}
                  placeholder="Just following up — did you still need help?"
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1B2F5E] focus:ring-2 focus:ring-[#1B2F5E]/10 transition-colors resize-none"
                />
              </div>
            </>
          )}

          <div className="flex items-center gap-4">
            <button
              onClick={saveFollowUp}
              className="px-5 py-2.5 rounded-xl bg-[#4CAF29] text-white text-sm font-semibold hover:bg-[#3d9422] transition-colors"
            >
              Save
            </button>
            {followUpSave.saved && <span className="text-sm text-[#4CAF29] font-medium">Saved!</span>}
            {followUpSave.error && <span className="text-sm text-red-600">{followUpSave.error}</span>}
          </div>
        </div>
      </div>
      {/* Whitelist */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-[#1B2F5E] mb-1">Personal Contacts (Won't Receive Auto-Texts)</h2>
        <p className="text-xs text-gray-400 mb-5">
          Add personal phone numbers — family, friends — that shouldn't receive business auto-texts when they call you.
        </p>

        {/* Existing entries */}
        {whitelist.length > 0 && (
          <ul className="flex flex-col gap-2 mb-5">
            {whitelist.map((entry) => (
              <li key={entry.phone} className="flex items-center justify-between gap-3 bg-[#F5F7FA] rounded-xl px-4 py-3">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[#1B2F5E]">{formatDisplay(entry.phone)}</span>
                  {entry.label && <span className="text-xs text-gray-400">{entry.label}</span>}
                </div>
                <button
                  onClick={() => removeContact(entry.phone)}
                  className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Add form */}
        <div className="flex flex-col gap-3 mb-5">
          <div className="flex gap-3">
            <input
              type="tel"
              value={newPhone}
              onChange={e => { setNewPhone(e.target.value); setPhoneError(''); }}
              placeholder="(801) 555-0000"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1B2F5E] focus:ring-2 focus:ring-[#1B2F5E]/10 transition-colors"
            />
            <input
              type="text"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              placeholder="Label (e.g. Wife)"
              className="w-36 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1B2F5E] focus:ring-2 focus:ring-[#1B2F5E]/10 transition-colors"
            />
            <button
              onClick={addContact}
              className="px-4 py-2.5 rounded-xl bg-[#1B2F5E] text-white text-sm font-semibold hover:bg-[#152549] transition-colors whitespace-nowrap"
            >
              Add
            </button>
          </div>
          {phoneError && <p className="text-xs text-red-500">{phoneError}</p>}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={saveWhitelist}
            className="px-5 py-2.5 rounded-xl bg-[#4CAF29] text-white text-sm font-semibold hover:bg-[#3d9422] transition-colors"
          >
            Save
          </button>
          {whitelistSave.saved && <span className="text-sm text-[#4CAF29] font-medium">Saved!</span>}
          {whitelistSave.error && <span className="text-sm text-red-600">{whitelistSave.error}</span>}
        </div>
      </div>

    </div>
  );
}
