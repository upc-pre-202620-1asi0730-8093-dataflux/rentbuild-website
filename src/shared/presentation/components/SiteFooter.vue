<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BrandLogo from './BrandLogo.vue'
const { t, locale } = useI18n()
const baseUrl = import.meta.env.BASE_URL
const email = ref('')
const status = ref('')
const submitting = ref(false)
const endpoint = import.meta.env.VITE_NEWSLETTER_ENDPOINT
const contact = import.meta.env.VITE_CONTACT_EMAIL
const columns = [
  ['#how-it-works', '#plans', '#about', '#contact'],
  ['#contact', '#product-demo', '#benefits', '#features'],
  ['#features', '#benefits', '#product-demo', '#plans'],
]

async function subscribe() {
  if (submitting.value) return
  status.value = ''
  if (!endpoint) { status.value = 'unavailable'; return }
  submitting.value = true
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)
  try {
    const response = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value.trim() }), signal: controller.signal,
    })
    if (!response.ok) throw new Error('Subscription was not accepted')
    status.value = 'success'
    email.value = ''
  } catch { status.value = 'error' }
  finally { clearTimeout(timeout); submitting.value = false }
}
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="site-footer__grid">
        <div class="site-footer__brand">
          <a href="#home" aria-label="RentBuild"><BrandLogo light /></a>
          <p>{{ t('footer.tagline') }}</p>
          <form class="newsletter" @submit.prevent="subscribe">
            <label class="visually-hidden" for="newsletter-email">{{ t('footer.email') }}</label>
            <div class="newsletter__field">
              <input id="newsletter-email" v-model="email" type="email" name="email" autocomplete="email" required
                maxlength="254" :placeholder="t('footer.email')" :disabled="submitting" aria-describedby="newsletter-status">
              <button type="submit" :disabled="submitting" :aria-label="t('footer.subscribe')">{{ submitting ? '…' : '→' }}</button>
            </div>
            <p id="newsletter-status" class="newsletter__status" role="status">{{ status ? t(`footer.${status}`) : '' }}</p>
          </form>
          <a v-if="contact" :href="`mailto:${contact}`" class="site-footer__email">{{ contact }}</a>
        </div>
        <nav v-for="(links, columnIndex) in columns" :key="columnIndex" class="site-footer__column" :aria-label="t(`footer.columns.${columnIndex}.title`)">
          <h2>{{ t(`footer.columns.${columnIndex}.title`) }}</h2>
          <a v-for="(link, index) in links" :key="index" :href="link">{{ t(`footer.columns.${columnIndex}.links.${index}`) }}</a>
        </nav>
      </div>
      <div class="site-footer__bottom">
        <span>© {{ new Date().getFullYear() }} RentBuild · DataFlux</span>
        <div>
          <a :href="`${baseUrl}?document=terms&lang=${locale}`">{{ t('footer.terms') }}</a>
          <span aria-hidden="true">·</span>
          <a :href="`${baseUrl}?document=privacy&lang=${locale}`">{{ t('footer.privacy') }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>
