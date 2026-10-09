const localeAliases = new Map([
  ['en', 'en-US'], ['en-us', 'en-US'], ['en_us', 'en-US'],
  ['es', 'es-419'], ['es-419', 'es-419'], ['es_419', 'es-419'],
])

export function normalizeLocale(value) {
  return typeof value === 'string' ? localeAliases.get(value.trim().toLowerCase()) || null : null
}

export function resolveInitialLocale({ search = '', readPreference = () => null } = {}) {
  const requested = normalizeLocale(new URLSearchParams(search).get('lang'))
  if (requested) return requested
  try {
    return normalizeLocale(readPreference()) || 'en-US'
  } catch { return 'en-US' }
}

export function toggleLocale(value) {
  return (normalizeLocale(value) || 'en-US') === 'en-US' ? 'es-419' : 'en-US'
}
