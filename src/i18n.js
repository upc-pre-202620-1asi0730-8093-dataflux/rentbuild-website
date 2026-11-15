import en from './locales/en.json'
import es from './locales/es.json'

const messages = { en, es }
let locale = 'en'
try {
  const saved = localStorage.getItem('rentbuild-language')
  if (saved === 'en' || saved === 'es') locale = saved
} catch {
  // Language selection still works when browser storage is unavailable.
}
export const getLanguage = () => locale
export function setLanguage(value) {
  if (!Object.hasOwn(messages, value)) return
  locale = value
  document.documentElement.lang = value
  try { localStorage.setItem('rentbuild-language', value) } catch { /* Storage is optional. */ }
}
export function t(key, values = {}) {
  const find = language => key.split('.').reduce((value, part) => value?.[part], messages[language])
  const message = find(locale) ?? find('en') ?? key
  return String(message).replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match)
}
