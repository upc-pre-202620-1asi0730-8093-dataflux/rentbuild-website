import { createI18n } from 'vue-i18n'
import { watch } from 'vue'
import en from './locales/en.json'
import es from './locales/es.json'
import { normalizeLocale, resolveInitialLocale } from './shared/language.js'

const locale = resolveInitialLocale({
  search: window.location.search,
  readPreference: () => localStorage.getItem('rentbuild-language'),
})
document.documentElement.lang = locale

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en-US',
  messages: { 'en-US': en, 'es-419': es },
})

watch(i18n.global.locale, (value) => {
  const canonical = normalizeLocale(value) || 'en-US'
  if (value !== canonical) { i18n.global.locale.value = canonical; return }
  document.documentElement.lang = canonical
  try { localStorage.setItem('rentbuild-language', canonical) } catch { /* Optional persistence. */ }
})

export default i18n
