// Config is editable remotely (admin dashboard), so treat link fields as untrusted.
// Allowed: empty, https://..., or a scheme-less relative path. Everything else (javascript:, data:, http:, //host) becomes ''.
const URL_KEYS = new Set([
  'avatarUrl',
  'resumeUrl',
  'imageUrl',
  'credentialUrl',
  'link',
  'github',
  'linkedin',
  'twitter',
  'website',
  'target',
  'formEndpoint',
])

export function isSafeUrl(value: string): boolean {
  if (value === '') return true
  if (/^https:\/\/\S+$/i.test(value)) return true
  return /^(?!\/[\\/])(?!\\)[^:\x00-\x1f\s]*$/.test(value)
}

export function sanitizeConfig<T>(input: T): T {
  if (Array.isArray(input)) return input.map(sanitizeConfig) as unknown as T
  if (input && typeof input === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
      out[k] = typeof v === 'string' && URL_KEYS.has(k) ? (isSafeUrl(v) ? v : '') : sanitizeConfig(v)
    }
    return out as T
  }
  return input
}
