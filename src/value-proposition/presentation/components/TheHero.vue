<script setup>
import { useI18n } from 'vue-i18n'
import ReferenceArtwork from '../../../shared/presentation/components/ReferenceArtwork.vue'
import { createFrontendLink, frontendRoles } from '../../../shared/frontend-links.js'
defineEmits(['access'])
const { t } = useI18n()
const icons = ['▦', '▣', '▤', '⚒', '◉']
const links = frontendRoles.map((role) => ({ role, href: createFrontendLink(import.meta.env.VITE_FRONTEND_URL, { role }) }))
</script>

<template>
  <section id="home" class="hero" aria-labelledby="hero-title">
    <div class="container hero__grid">
      <div class="hero__copy">
        <h1 id="hero-title">{{ t('hero.title') }}</h1>
        <p>{{ t('hero.body') }}</p>
        <div class="hero__actions">
          <template v-for="link in links" :key="link.role">
            <a v-if="link.href" class="btn" :href="link.href">{{ t(`frontend.${link.role}`) }}</a>
            <button v-else class="btn" @click="$emit('access', { role: link.role })">{{ t(`frontend.${link.role}`) }}</button>
          </template>
        </div>
      </div>
      <div class="hero__visual" aria-hidden="true">
        <div class="hero-art">
          <!-- Only the photographic stage is framed; the surrounding cards are HTML. -->
          <ReferenceArtwork class="hero-art__photo" src="hero-reference.png" :source-width="782"
            :x="490" :y="115" :width="223" :height="286" eager />
          <div class="hero-art__equipment floating-card">
            <div><span class="art-label">{{ t('art.equipment') }}</span><strong>{{ t('art.excavator') }}</strong></div>
            <span class="art-reserve">{{ t('art.reserve') }}</span>
          </div>
          <span class="hero-art__check">✓</span>
          <span class="hero-art__document">▤</span>
          <div class="hero-art__availability floating-card">
            <span class="art-label">{{ t('art.available') }}</span>
            <strong>{{ t('art.equipmentCount') }} <span class="art-bars">▁▃▆</span></strong>
          </div>
          <div class="hero-art__status">
            <div class="art-circles"><i></i><i></i></div>
            <span>{{ t('art.status') }}</span>
            <strong>···· &nbsp; {{ t('art.active') }}</strong>
            <div class="art-status-bottom"><i></i><span>{{ t('art.today') }}</span></div>
          </div>
          <span class="hero-art__message">▱</span>
        </div>
      </div>
    </div>
    <div class="container rental-cycle">
      <h2>{{ t('hero.cycleTitle') }}</h2>
      <ul>
        <li v-for="(icon, index) in icons" :key="index"><span class="cycle-icon" aria-hidden="true">{{ icon }}</span>{{ t(`hero.cycle.${index}`) }}</li>
      </ul>
    </div>
  </section>
</template>
