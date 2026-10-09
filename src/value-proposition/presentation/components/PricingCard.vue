<script setup>
import { useI18n } from 'vue-i18n'
import { referencePrice } from '../../reference-plans.js'

defineProps({ plan: { type: Object, required: true }, featured: Boolean })
defineEmits(['select'])
const { t, locale } = useI18n()
</script>

<template>
  <article class="pricing-card" :class="{ 'pricing-card--featured': featured }">
    <header class="pricing-card__header">
      <h3>{{ t(`pricing.${plan.key}.name`) }}</h3>
      <p>{{ t(`pricing.${plan.key}.body`) }}</p>
      <p class="pricing-card__price">{{ referencePrice(plan, locale) }} <small>{{ t('pricing.perMonth') }}</small></p>
    </header>
    <div class="pricing-card__details">
      <span v-if="featured" class="pricing-card__badge">{{ t('pricing.popular') }}</span>
      <p class="pricing-card__reference">{{ t('pricing.referenceFeatures') }}</p>
      <ul class="check-list">
        <li v-for="feature in plan.featureKeys" :key="feature"><span class="check-mark" aria-hidden="true">✓</span>{{ t(`pricing.${plan.key}.features.${feature}`) }}</li>
      </ul>
      <button class="btn" :class="{ 'btn--white': !featured }" @click="$emit('select', { plan: t(`pricing.${plan.key}.name`), period: 'monthly' })">
        {{ t(`pricing.${plan.key}.cta`) }}
      </button>
    </div>
  </article>
</template>
