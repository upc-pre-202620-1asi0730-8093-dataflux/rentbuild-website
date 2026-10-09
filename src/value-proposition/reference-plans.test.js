import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { referencePlans, referencePrice } from './reference-plans.js'

test('the public catalogue preserves the three TB1 subscription IDs, names and monthly reference prices', () => {
  assert.deepEqual(referencePlans.map(({ id, name, priceAmount }) => ({ id, name, priceAmount })), [
    { id: 1, name: 'Essential', priceAmount: 79 },
    { id: 2, name: 'Professional', priceAmount: 149 },
    { id: 3, name: 'Growth', priceAmount: 249 },
  ])
  assert.ok(referencePlans.every(plan => plan.billingCycle === 'MONTHLY' && plan.priceCurrency === 'PEN' && plan.status === 'ACTIVE'))
})

test('every reference capability and plan has readable bilingual copy, without the old annual tiers', () => {
  for (const language of ['en', 'es']) {
    const { pricing } = JSON.parse(readFileSync(new URL(`../locales/${language}.json`, import.meta.url), 'utf8'))
    assert.ok(pricing.demoNotice && pricing.referenceFeatures && pricing.monthlyNote)
    assert.equal(pricing.annual, undefined)
    for (const oldPlan of ['basic', 'pro', 'premium']) assert.equal(pricing[oldPlan], undefined)
    for (const plan of referencePlans) {
      const copy = pricing[plan.key]
      assert.ok(copy.name && copy.body && copy.cta)
      if (language === 'en') assert.equal(copy.name, plan.name)
      assert.deepEqual(Object.keys(copy.features), plan.featureKeys)
      assert.ok(Object.values(copy.features).every(feature => typeof feature === 'string' && feature.trim()))
    }
  }
})

test('prices show their PEN denomination in either supported language and do not render invalid amounts', () => {
  assert.match(referencePrice(referencePlans[0], 'en-US'), /^PEN\s*79\.00$/)
  assert.match(referencePrice(referencePlans[1], 'es-419'), /^PEN\s*149\.00$/)
  assert.equal(referencePrice(referencePlans[2], 'es_419'), referencePrice(referencePlans[2], 'es-419'))
  assert.equal(referencePrice({ priceAmount: NaN, priceCurrency: 'PEN' }), '—')
})
