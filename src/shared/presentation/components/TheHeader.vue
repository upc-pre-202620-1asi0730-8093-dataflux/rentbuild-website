<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import BrandLogo from './BrandLogo.vue'
import { toggleLocale } from '../../language.js'

const emit = defineEmits(['access'])
const { t, locale } = useI18n()
const menuOpen = ref(false)
const links = [ ['how-it-works', 'how'], ['features', 'teams'], ['plans', 'plans'], ['our-team', 'team'], ['contact', 'contact'] ]
const activeSection = ref('home')
let observer
const menuButton = ref(null)

function requestAccess(detail = {}) {
  const returnFocus = menuOpen.value ? menuButton.value : document.activeElement
  menuOpen.value = false
  emit('access', { ...detail, returnFocus })
}
function closeMenu(event) {
  if (event.key === 'Escape' && menuOpen.value) {
    menuOpen.value = false
    menuButton.value?.focus()
  }
}
onMounted(() => {
  window.addEventListener('keydown', closeMenu)
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) activeSection.value = entry.target.id })
  }, { rootMargin: '-15% 0px -60% 0px' })
  document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section))
})
onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('keydown', closeMenu)
})
</script>

<template>
  <a class="skip-link" href="#main-content">{{ t('nav.skip') }}</a>
  <header class="site-header">
    <nav class="navbar container" :aria-label="t('nav.label')">
      <a href="#home" class="navbar__brand" aria-label="RentBuild" @click="menuOpen = false"><BrandLogo /></a>
      <button ref="menuButton" class="navbar__toggle" type="button" :aria-expanded="menuOpen"
        aria-controls="main-navigation" :aria-label="t('nav.menu')" @click="menuOpen = !menuOpen">
        <span></span><span></span><span></span>
      </button>
      <div id="main-navigation" class="navbar__panel" :class="{ 'is-open': menuOpen }">
        <ul class="navbar__links">
          <li v-for="[id, key] in links" :key="id">
            <a :href="`#${id}`" :aria-current="activeSection === id ? 'location' : undefined"
              @click="menuOpen = false">{{ t(`nav.${key}`) }}</a>
          </li>
        </ul>
        <div class="navbar__actions">
          <button class="text-button" @click="requestAccess({ mode: 'login' })">{{ t('nav.login') }}</button>
          <button class="btn btn--small" @click="requestAccess()">{{ t('nav.signup') }}</button>
          <button class="language-switch" type="button" :aria-label="t('nav.language')"
            @click="locale = toggleLocale(locale)">
            <span :class="{ 'is-active': locale === 'en-US' }">EN</span>
            <span class="language-switch__track" :class="{ 'is-spanish': locale === 'es-419' }"><span></span></span>
            <span :class="{ 'is-active': locale === 'es-419' }">ES</span>
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>
