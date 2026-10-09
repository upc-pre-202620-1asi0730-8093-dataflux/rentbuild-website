import assert from 'node:assert/strict'
import test from 'node:test'
import { createFrontendLink, frontendConfigurationStatus } from './frontend-links.js'

test('an unset frontend leaves access unavailable instead of inventing a destination', () => {
  for (const value of [undefined, null, '', '   ']) {
    assert.equal(frontendConfigurationStatus(value), 'missing')
    assert.equal(createFrontendLink(value), '')
  }
})

test('each segment opens the agreed registration route with its exact role', () => {
  assert.equal(createFrontendLink('https://application.test', { role: 'construction_company' }),
    'https://application.test/iam/sign-up?role=construction_company')
  assert.equal(createFrontendLink('https://application.test', { role: 'rental_company' }),
    'https://application.test/iam/sign-up?role=rental_company')
  assert.equal(frontendConfigurationStatus('https://application.test'), 'ready')
})

test('registration preserves an application subdirectory and local development port', () => {
  assert.equal(createFrontendLink(' https://application.test/rentbuild/// ', { role: 'rental_company' }),
    'https://application.test/rentbuild/iam/sign-up?role=rental_company')
  assert.equal(createFrontendLink('http://127.0.0.1:5173/demo', { role: 'construction_company' }),
    'http://127.0.0.1:5173/demo/iam/sign-up?role=construction_company')
})

test('old query parameters and fragments do not leak into the registration link', () => {
  assert.equal(createFrontendLink('https://application.test/demo?role=admin&trace=old#private',
    { role: 'rental_company' }), 'https://application.test/demo/iam/sign-up?role=rental_company')
})

test('login uses its own route without passing a segment or an old fragment', () => {
  assert.equal(createFrontendLink('https://application.test/demo/#previous',
    { mode: 'login', role: 'rental_company' }), 'https://application.test/demo/iam/sign-in')
})

test('unknown roles and modes cannot produce an unintended destination', () => {
  for (const role of ['admin', '', null, 'rental_company&admin=true']) {
    assert.equal(createFrontendLink('https://application.test', { role }), '')
  }
  assert.equal(createFrontendLink('https://application.test', { mode: 'reset-password' }), '')
})

test('malformed, executable and authentication-page base URLs are rejected safely', () => {
  for (const value of [42, {}, 'not a URL', '//application.test', 'javascript:alert(1)',
    'data:text/html,hello', 'ftp://application.test', 'https://', 'https://application.test/iam/sign-up',
    'https://application.test/demo/iam/sign-in/', 'https://application.test/one\ntwo',
    'https://application.test\\@other.test']) {
    assert.equal(frontendConfigurationStatus(value), 'invalid')
    assert.equal(createFrontendLink(value), '')
  }
})

test('a base URL containing credentials is never exposed in a link', () => {
  for (const value of ['https://user:secret@application.test', 'https://user@application.test/demo']) {
    assert.equal(frontendConfigurationStatus(value), 'invalid')
    assert.equal(createFrontendLink(value, { role: 'rental_company' }), '')
  }
})
