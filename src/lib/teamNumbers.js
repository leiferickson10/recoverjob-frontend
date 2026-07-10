export function teamNumbersToRows(teamNumbers) {
  if (!Array.isArray(teamNumbers) || teamNumbers.length === 0) return [];
  return teamNumbers.map((t) => ({
    id: crypto.randomUUID(),
    label: t.label || '',
    phoneDigits: (t.number || '').replace(/\D/g, '').slice(-10),
    isPrimary: !!t.is_primary,
  }));
}

export function rowsToTeamNumbers(rows) {
  return rows
    .filter((r) => r.phoneDigits.length === 10)
    .map((r) => ({
      label: r.label.trim(),
      number: `+1${r.phoneDigits}`,
      is_primary: r.isPrimary,
    }));
}

export function validateRows(rows) {
  if (rows.length === 0) return null;
  if (rows.some((r) => r.phoneDigits.length !== 10)) {
    return 'Enter a valid 10-digit phone number for every team member.';
  }
  if (rows.filter((r) => r.isPrimary).length !== 1) {
    return 'Exactly one team member must be marked primary.';
  }
  return null;
}
