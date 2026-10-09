<script setup>
import { useI18n } from 'vue-i18n'
import PricingCard from './PricingCard.vue'
import { referencePlans } from '../../reference-plans.js'

defineEmits(['access'])
const { t } = useI18n()
</script>

<template>
  <section id="plans" class="pricing section" aria-labelledby="pricing-title">
    <div class="container">
      <header class="pricing__header">
        <h2 id="pricing-title">{{ t('pricing.title') }}</h2>
        <p class="section-copy">{{ t('pricing.body') }}</p>
        <p class="section-copy">{{ t('pricing.demoNotice') }}</p>
        <div class="billing-switch">
          <span class="billing-switch__label">{{ t('pricing.monthly') }}</span>
        </div>
      </header>
      <div class="pricing__grid">
        <PricingCard v-for="plan in referencePlans" :key="plan.id" :plan="plan" :featured="plan.id === 2"
          @select="$emit('access', $event)" />
      </div>
      <p class="pricing__period">{{ t('pricing.monthlyNote') }}</p>
    </div>
  </section>
</template>
