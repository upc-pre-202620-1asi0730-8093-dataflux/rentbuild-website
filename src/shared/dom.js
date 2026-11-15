export function escapeHtml(value = '') {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
}
export function openDialog(dialog) {
  const previousFocus = document.activeElement
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open')
    if (previousFocus?.isConnected) previousFocus.focus()
  }, { once: true })
  dialog.onclick = event => {
    if (event.target === dialog || event.target.closest('.access-dialog__close')) dialog.close()
  }
  dialog.showModal()
  document.body.classList.add('dialog-open')
}
export async function postJson(endpoint, payload) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)
  try {
    const response = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), signal: controller.signal,
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
  } finally { clearTimeout(timeout) }
}
export function httpUrl(value) {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null
  } catch { return null }
}
