<script setup>
import { computed, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import BrandLogo from './BrandLogo.vue'

const props = defineProps({ document: { type: String, required: true } })
const { t, tm, locale } = useI18n()
const baseUrl = import.meta.env.BASE_URL
const landingUrl = computed(() => `${baseUrl}?lang=${locale.value}`)
const alternateLocale = computed(() => locale.value === 'en-US' ? 'es-419' : 'en-US')
const sections = computed(() => tm(`legal.${props.document}.sections`))
const localLink = (document, language = locale.value) => `${baseUrl}?document=${document}&lang=${language}`
watchEffect(() => { document.title = `${t(`legal.${props.document}.title`)} — RentBuild` })
</script>

<template>
  <div class="legal-page">
    <a class="skip-link" href="#legal-content">{{ t('nav.skip') }}</a>
    <header class="container legal-page__header">
      <a :href="landingUrl" :aria-label="t('legal.back')"><BrandLogo /></a>
      <nav :aria-label="t('legal.navigation')">
        <a :href="localLink(document, alternateLocale)" :lang="alternateLocale">{{ alternateLocale === 'es-419' ? 'Español' : 'English' }}</a>
        <a :href="landingUrl">{{ t('legal.back') }}</a>
      </nav>
    </header>
    <main id="legal-content" class="container legal-page__content" tabindex="-1">
      <article aria-labelledby="legal-title">
      <span class="eyebrow">{{ t('frontend.demo') }}</span>
      <h1 id="legal-title">{{ t(`legal.${document}.title`) }}</h1>
      <p class="legal-page__date">{{ t('legal.updated') }}</p>
      <p>{{ t(`legal.${document}.intro`) }}</p>
      <section v-for="(_, index) in sections" :key="index" :aria-labelledby="`legal-heading-${index}`">
        <h2 :id="`legal-heading-${index}`">{{ t(`legal.${document}.sections.${index}.title`) }}</h2>
        <p>{{ t(`legal.${document}.sections.${index}.body`) }}</p>
      </section>
      </article>
    </main>
    <footer class="container legal-page__footer">
      <span>RentBuild · DataFlux</span>
      <nav :aria-label="t('legal.navigation')">
        <a :href="localLink('terms')" :aria-current="document === 'terms' ? 'page' : undefined">{{ t('footer.terms') }}</a>
        <a :href="localLink('privacy')" :aria-current="document === 'privacy' ? 'page' : undefined">{{ t('footer.privacy') }}</a>
      </nav>
    </footer>
  </div>
</template>

<style scoped>
.legal-page { min-height: 100vh; background: var(--color-background); }
.legal-page__header, .legal-page__footer { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 24px; padding-block: 28px; }
.legal-page nav { display: flex; flex-wrap: wrap; gap: 20px; }
.legal-page nav a { text-decoration: underline; text-underline-offset: 4px; }
.legal-page__content { max-width: 840px; padding-block: 40px 60px; }
.legal-page__content h1 { font-size: clamp(30px, 5vw, 46px); line-height: 1.2; margin-block: 12px 16px; }
.legal-page__content p { line-height: 1.8; margin-top: 12px; }
.legal-page__date { color: var(--color-muted); font-size: 14px; }
.legal-page__content section { margin-top: 32px; }
.legal-page__content h2 { font-size: 22px; }
.legal-page__footer { border-top: 1px solid var(--color-border); }
</style>
