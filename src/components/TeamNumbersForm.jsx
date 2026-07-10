import { formatPhoneInput } from '../lib/phoneFormat';

export default function TeamNumbersForm({ rows, onChange }) {
  function addRow() {
    if (rows.length >= 5) return;
    onChange([...rows, { id: crypto.randomUUID(), label: '', phoneDigits: '', isPrimary: rows.length === 0 }]);
  }

  function updateRow(id, patch) {
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function setPrimary(id) {
    onChange(rows.map((r) => ({ ...r, isPrimary: r.id === id })));
  }

  function removeRow(id) {
    const removing = rows.find((r) => r.id === id);
    let next = rows.filter((r) => r.id !== id);
    if (removing?.isPrimary && next.length > 0 && !next.some((r) => r.isPrimary)) {
      next = next.map((r, i) => (i === 0 ? { ...r, isPrimary: true } : r));
    }
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-4">
      {rows.map((row) => (
        <div key={row.id} className="flex items-start gap-3 border border-gray-100 rounded-xl p-4">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-medium text-gray-500">Name / Role</label>
            <input
              type="text"
              value={row.label}
              onChange={(e) => updateRow(row.id, { label: e.target.value })}
              placeholder="Owner"
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B2F5E] focus:ring-2 focus:ring-[#1B2F5E]/10 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-medium text-gray-500">Phone Number</label>
            <input
              type="tel"
              value={formatPhoneInput(row.phoneDigits)}
              onChange={(e) => updateRow(row.id, { phoneDigits: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              placeholder="(555) 123-4567"
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B2F5E] focus:ring-2 focus:ring-[#1B2F5E]/10 transition-colors"
            />
          </div>
          <div className="flex flex-col items-center gap-1.5 pt-5">
            <label className="text-xs font-medium text-gray-500">Primary</label>
            <input
              type="radio"
              name="team-primary"
              checked={row.isPrimary}
              onChange={() => setPrimary(row.id)}
              className="h-4 w-4 text-[#4CAF29] focus:ring-[#1B2F5E]"
            />
          </div>
          <button
            type="button"
            onClick={() => removeRow(row.id)}
            className="text-gray-400 hover:text-red-500 text-sm font-semibold pt-6 px-1"
            aria-label="Remove team member"
          >
            &times;
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addRow}
        disabled={rows.length >= 5}
        className="self-start px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-[#1B2F5E] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        + Add team member
      </button>
    </div>
  );
}
