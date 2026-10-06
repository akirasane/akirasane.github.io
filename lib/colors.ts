// Accent colors set in the admin dashboard: a preset name (stored by name) or a #rrggbb hex.
const PRESETS: Record<string, string> = {
  indigo: '#6366f1',
  violet: '#8b5cf6',
  purple: '#a855f7',
  pink: '#ec4899',
  rose: '#f43f5e',
  red: '#ef4444',
  orange: '#f97316',
  amber: '#f59e0b',
  yellow: '#eab308',
  lime: '#84cc16',
  green: '#22c55e',
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  sky: '#0ea5e9',
  blue: '#3b82f6',
  gray: '#6b7280',
  slate: '#64748b',
}

const HEX = /^#[0-9a-fA-F]{6}$/

export function isValidColor(value: string): boolean {
  return value === '' || value in PRESETS || HEX.test(value)
}

/** Returns a hex color, or `fallback` when the value is empty or unknown. */
export function resolveColor(value: string | undefined, fallback = 'var(--accent-primary)'): string {
  if (!value) return fallback
  if (value in PRESETS) return PRESETS[value]
  return HEX.test(value) ? value : fallback
}
