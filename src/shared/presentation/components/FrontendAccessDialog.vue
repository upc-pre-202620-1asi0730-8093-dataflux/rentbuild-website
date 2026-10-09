<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { createFrontendLink, frontendConfigurationStatus, frontendRoles } from '../../frontend-links.js'

const { t } = useI18n()
const dialog = ref(null)
const detail = ref({})
const frontendUrl = import.meta.env.VITE_FRONTEND_URL
const loginUrl = createFrontendLink(frontendUrl, { mode: 'login' })
const links = frontendRoles.map((role) => ({ role, href: createFrontendLink(frontendUrl, { role }) }))
const configurationStatus = frontendConfigurationStatus(frontendUrl)
const configured = configurationStatus === 'ready'
const isLogin = computed(() => detail.value.mode === 'login')
let previousFocus

function open(value = {}) {
  if (value.mode === 'login' && loginUrl) { window.location.assign(loginUrl); return }
  if (dialog.value.open) return
  detail.value = value
  previousFocus = value.returnFocus || document.activeElement
  dialog.value.showModal()
  document.body.classList.add('dialog-open')
}
function close() { dialog.value.close() }
function onClose() {
  document.body.classList.remove('dialog-open')
  if (previousFocus?.isConnected) previousFocus.focus()
}
onBeforeUnmount(() => document.body.classList.remove('dialog-open'))
defineExpose({ open })
</script>

<template>
  <dialog ref="dialog" class="access-dialog frontend-dialog" aria-labelledby="frontend-title"
    aria-describedby="frontend-description" @close="onClose"
    @click="event => { if (event.target === dialog) close() }">
    <button class="access-dialog__close" type="button" autofocus :aria-label="t('access.close')" @click="close">×</button>
    <span class="eyebrow">{{ t('frontend.demo') }}</span>
    <h2 id="frontend-title">{{ t(isLogin ? 'frontend.loginTitle' : 'frontend.title') }}</h2>
    <p id="frontend-description" :role="configured ? undefined : 'status'">{{
      t(configured ? 'frontend.description' : configurationStatus === 'invalid' ? 'frontend.invalid' : 'frontend.unavailable')
    }}</p>
    <p v-if="detail.plan" class="access-dialog__plan">{{ t('access.selected') }}: {{ detail.plan }}</p>
    <div v-if="configured" class="frontend-dialog__links">
      <a v-for="link in links" :key="link.role" :href="link.href" class="btn">{{ t(`frontend.${link.role}`) }}</a>
    </div>
    <button v-else class="btn" type="button" @click="close">{{ t('access.understood') }}</button>
  </dialog>
</template>

<style scoped>
.frontend-dialog__links { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
</style>
