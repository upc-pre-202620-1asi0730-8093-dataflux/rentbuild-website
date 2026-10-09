export const frontendRoles = Object.freeze(['construction_company', 'rental_company'])

function parseFrontendBase(baseUrl) {
  if (typeof baseUrl !== 'string') return null
  const value = baseUrl.trim()
  if (!/^https?:\/\//i.test(value) || /[\u0000-\u001f\u007f\\]/.test(value)) return null
  try {
    const base = new URL(value)
    if (base.username || base.password || /\/iam\/sign-(?:in|up)\/?$/i.test(base.pathname)) return null
    return base
  } catch { return null }
}

export function frontendConfigurationStatus(baseUrl) {
  if (baseUrl == null || (typeof baseUrl === 'string' && !baseUrl.trim())) return 'missing'
  return parseFrontendBase(baseUrl) ? 'ready' : 'invalid'
}

export function createFrontendLink(baseUrl, { mode = 'signup', role } = {}) {
  if (!['signup', 'login'].includes(mode)) return ''
  if (role !== undefined && !frontendRoles.includes(role)) return ''
  const base = parseFrontendBase(baseUrl)
  if (!base) return ''
  base.pathname = `${base.pathname.replace(/\/+$/, '')}/`
  base.search = ''
  base.hash = ''
  const target = new URL(mode === 'login' ? 'iam/sign-in' : 'iam/sign-up', base)
  if (mode === 'signup' && role) target.searchParams.set('role', role)
  return target.href
}
