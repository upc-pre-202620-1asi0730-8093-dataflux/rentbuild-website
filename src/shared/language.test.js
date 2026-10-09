import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeLocale, resolveInitialLocale, toggleLocale } from './language.js'

test('canonical locales and old aliases resolve to the same supported language', () => {
  for (const value of ['en-US', 'en', 'en_US', ' EN_us ']) assert.equal(normalizeLocale(value), 'en-US')
  for (const value of ['es-419', 'es', 'es_419', ' ES_419 ']) assert.equal(normalizeLocale(value), 'es-419')
  for (const value of [undefined, null, 1, '', 'fr', 'javascript:alert(1)']) {
    assert.equal(normalizeLocale(value), null)
  }
})

test('the initial page is English when the visitor has no saved preference', () => {
  assert.equal(resolveInitialLocale(), 'en-US')
  assert.equal(resolveInitialLocale({ readPreference: () => null }), 'en-US')
})

test('saved preferences migrate old aliases and an explicit document language takes priority', () => {
  assert.equal(resolveInitialLocale({ readPreference: () => 'es_419' }), 'es-419')
  assert.equal(resolveInitialLocale({ search: '?document=terms&lang=en_US', readPreference: () => 'es' }), 'en-US')
  assert.equal(resolveInitialLocale({ search: '?document=privacy&lang=es', readPreference: () => 'en-US' }), 'es-419')
})

test('an unsupported query cannot erase a valid preference or select an unknown language', () => {
  assert.equal(resolveInitialLocale({ search: '?lang=fr', readPreference: () => 'es' }), 'es-419')
  assert.equal(resolveInitialLocale({ search: '?lang=invalid', readPreference: () => 'fr' }), 'en-US')
})

test('unavailable browser storage does not prevent a usable default or a bilingual document link', () => {
  const blockedStorage = () => { throw new Error('Storage blocked') }
  assert.equal(resolveInitialLocale({ readPreference: blockedStorage }), 'en-US')
  assert.equal(resolveInitialLocale({ search: '?document=terms&lang=es-419', readPreference: blockedStorage }), 'es-419')
})

test('the language selector cycles both directions using canonical values, including old aliases', () => {
  assert.equal(toggleLocale('en-US'), 'es-419')
  assert.equal(toggleLocale('es-419'), 'en-US')
  assert.equal(toggleLocale('en_US'), 'es-419')
  assert.equal(toggleLocale('es'), 'en-US')
  assert.equal(toggleLocale(toggleLocale('en')), 'en-US')
})
