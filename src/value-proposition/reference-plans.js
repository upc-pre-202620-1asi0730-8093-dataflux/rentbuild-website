import { normalizeLocale } from '../shared/language.js'

// TB1 reference catalogue: keep this snapshot aligned with Subscriptions' fake API.
export const referencePlans = Object.freeze([
  Object.freeze({ id: 1, key: 'essential', name: 'Essential', priceAmount: 79, priceCurrency: 'PEN',
    billingCycle: 'MONTHLY', status: 'ACTIVE', featureKeys: Object.freeze(['inventory', 'availability', 'requests']) }),
  Object.freeze({ id: 2, key: 'professional', name: 'Professional', priceAmount: 149, priceCurrency: 'PEN',
    billingCycle: 'MONTHLY', status: 'ACTIVE', featureKeys: Object.freeze(['essential', 'rentals', 'payments', 'delivery-return']) }),
  Object.freeze({ id: 3, key: 'growth', name: 'Growth', priceAmount: 249, priceCurrency: 'PEN',
    billingCycle: 'MONTHLY', status: 'ACTIVE', featureKeys: Object.freeze(['professional', 'incidents', 'scheduling', 'history']) }),
])

export function referencePrice(plan, locale = 'en-US') {
  if (!Number.isFinite(plan?.priceAmount) || plan.priceAmount < 0 || plan.priceCurrency !== 'PEN') return '—'
  return new Intl.NumberFormat(normalizeLocale(locale) || 'en-US', {
    style: 'currency', currency: plan.priceCurrency, currencyDisplay: 'code',
  }).format(plan.priceAmount)
}
