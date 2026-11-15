import english from './templates/en.html?raw'
import spanish from './templates/es.html?raw'
import { getLanguage, setLanguage, t } from './i18n.js'
import { escapeHtml as h, openDialog, postJson, httpUrl } from './shared/dom.js'

const env = import.meta.env
const videos = import.meta.glob('/public/assets/videos/*.mp4', { eager: true, query: '?url', import: 'default' })

export function renderLanding(root, onAuthenticated) {
  let observer
  let period = 'annual'
  const render = () => {
    observer?.disconnect()
    root.innerHTML = getLanguage() === 'es' ? spanish : english
    document.documentElement.lang = getLanguage()
    root.querySelectorAll('.video-frame').forEach((frame, index) => {
      const filename = ['product-demo.mp4', 'about-rentbuild.mp4'][index]
      if (!videos[`/public/assets/videos/${filename}`]) return
      const placeholder = frame.firstElementChild
      const video = document.createElement('video')
      video.controls = true; video.preload = 'metadata'; video.playsInline = true
      video.src = `${env.BASE_URL}assets/videos/${filename}`
      video.setAttribute('aria-label', t(index === 0 ? 'showcase.video' : 'about.video'))
      video.onerror = () => frame.replaceChildren(placeholder)
      frame.replaceChildren(video)
    })
    const toggle = root.querySelector('.navbar__toggle')
    const panel = root.querySelector('.navbar__panel')
    const closeMenu = () => { panel.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false') }
    toggle.onclick = () => {
      const open = panel.classList.toggle('is-open')
      toggle.setAttribute('aria-expanded', String(open))
    }
    panel.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu))
    root.onkeydown = event => {
      if (event.key === 'Escape' && panel.classList.contains('is-open')) { closeMenu(); toggle.focus() }
    }
    root.querySelector('.language-switch').onclick = () => {
      const scroll = window.scrollY
      const fields = [...root.querySelectorAll('input, textarea')].map(input => [input.id, input.value])
      setLanguage(getLanguage() === 'en' ? 'es' : 'en')
      render()
      fields.forEach(([id, value]) => { const input = document.getElementById(id); if (input) input.value = value })
      root.querySelector('.language-switch').focus({ preventScroll: true })
      window.scrollTo(0, scroll)
    }
    observer = new IntersectionObserver(entries => {
      entries.filter(entry => entry.isIntersecting).forEach(entry => {
        root.querySelectorAll('.navbar__links a').forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location')
          else link.removeAttribute('aria-current')
        })
      })
    }, { rootMargin: '-15% 0px -60% 0px' })
    root.querySelectorAll('main section[id]').forEach(section => observer.observe(section))
    root.querySelectorAll('.showcase__item').forEach(item => {
      const button = item.querySelector('button')
      const region = item.querySelector('[role="region"]')
      region.hidden = true
      region.style.removeProperty('display')
      button.onclick = () => {
        const wasOpen = button.getAttribute('aria-expanded') === 'true'
        root.querySelectorAll('.showcase__item').forEach(other => {
          other.classList.remove('is-active')
          other.querySelector('button').setAttribute('aria-expanded', 'false')
          other.querySelector('[role="region"]').hidden = true
        })
        if (!wasOpen) { item.classList.add('is-active'); button.setAttribute('aria-expanded', 'true'); region.hidden = false }
      }
    })
    const updatePeriod = () => {
      root.querySelectorAll('.billing-switch button').forEach((button, index) => {
        const active = period === ['monthly', 'annual'][index]
        button.classList.toggle('is-active', active)
        button.setAttribute('aria-pressed', String(active))
      })
      root.querySelector('.pricing__period').textContent = t(`pricing.${period}Note`)
    }
    root.querySelectorAll('.billing-switch button').forEach((button, index) => {
      button.onclick = () => { period = ['monthly', 'annual'][index]; updatePeriod() }
    })
    updatePeriod()
    root.querySelectorAll('.pricing-card .btn').forEach((button, index) => {
      button.onclick = () => showAccess({ plan: t(`pricing.${['basic', 'pro', 'premium'][index]}.name`), period })
    })
    root.querySelectorAll('.site-footer__bottom button').forEach((button, index) => {
      button.onclick = () => showAccess({ mode: 'legal', document: index === 0 ? 'terms' : 'privacy' })
    })
    // Preserve the links to the separately hosted product application.
    root.querySelectorAll('a[href*="/iam/sign-"]').forEach(link => {
      const url = httpUrl(link.href.includes('sign-in') ? env.VITE_LOGIN_URL : env.VITE_SIGNUP_URL)
      if (url) link.href = url
    })
    bindRemoteForm('.contact-form', env.VITE_CONTACT_FORM_ENDPOINT, 'contact', '.contact-form__status')
    bindRemoteForm('.newsletter', env.VITE_NEWSLETTER_ENDPOINT, 'footer', '.newsletter__status')
    const email = env.VITE_CONTACT_EMAIL
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      for (const [parent, cls] of [['.contact__intro', 'contact__email'], ['.site-footer__brand', 'site-footer__email']]) {
        const link = document.createElement('a')
        link.className = cls; link.href = `mailto:${email}`; link.textContent = email
        root.querySelector(parent).append(link)
      }
    }
    const socials = ['GITHUB', 'X', 'DISCORD', 'BLUESKY'].map(name => [name, httpUrl(env[`VITE_SOCIAL_${name}`])]).filter(([, url]) => url)
    if (socials.length) {
      const group = document.createElement('div')
      group.className = 'contact-social'; group.setAttribute('role', 'group'); group.setAttribute('aria-label', t('contact.social'))
      group.innerHTML = socials.map(([name, url]) => `<a class="contact-social__link" href="${h(url)}" target="_blank" rel="noopener noreferrer" aria-label="${name}"><svg aria-hidden="true"><use href="${env.BASE_URL}icons.svg#${name.toLowerCase()}-icon"></use></svg></a>`).join('')
      root.querySelector('.contact__intro').append(group)
    }
    root.querySelector('.site-footer__bottom > span').textContent = `© ${new Date().getFullYear()} RentBuild · DataFlux`
  }

  function bindRemoteForm(selector, endpoint, namespace, statusSelector) {
    const form = root.querySelector(selector)
    form.onsubmit = async event => {
      event.preventDefault()
      const status = form.querySelector(statusSelector)
      if (form.dataset.submitting) return
      if (!endpoint) { status.textContent = t(`${namespace}.unavailable`); return }
      const payload = Object.fromEntries(new FormData(form))
      form.dataset.submitting = 'true'
      const controls = [...form.querySelectorAll('input, textarea, button')]
      controls.forEach(control => { control.disabled = true })
      status.textContent = namespace === 'contact' ? t('contact.sending') : '…'
      try { await postJson(endpoint, payload); form.reset(); status.textContent = t(`${namespace}.success`) }
      catch { status.textContent = t(`${namespace}.error`) }
      finally { delete form.dataset.submitting; controls.forEach(control => { control.disabled = false }) }
    }
  }

  function showAccess(detail = {}, existing = false) {
    const mode = detail.mode || 'signup'
    const external = httpUrl(mode === 'legal' ? (detail.document === 'terms' ? env.VITE_TERMS_URL : env.VITE_PRIVACY_URL) : mode === 'login' ? env.VITE_LOGIN_URL : env.VITE_SIGNUP_URL)
    if (external) { window.location.assign(external); return }
    const dialog = root.querySelector('.access-dialog')
    const title = mode === 'legal' ? t('access.legalTitle') : t(`${mode}.title`)
    const fields = mode === 'login' ? ['email', 'password'] : ['name', 'email', 'company', 'phone', 'password']
    dialog.innerHTML = `<button class="access-dialog__close" aria-label="${h(t('access.close'))}">×</button>
      <span class="eyebrow">RENTBUILD</span><h2 id="access-title">${h(title)}</h2>
      ${detail.plan ? `<p class="access-dialog__plan">${h(t('access.selected'))}: ${h(detail.plan)} · ${h(t(`pricing.${detail.period || 'monthly'}`))}</p>` : ''}
      <p id="access-description">${h(t(mode === 'legal' ? 'access.legalBody' : `${mode}.body`))}</p>
      ${mode === 'legal' ? `<button class="btn" data-understood>${h(t('access.understood'))}</button>` : `<form class="login-form">${fields.map(name => `<div class="login-form__row"><label for="${mode}-${name}">${h(t(`${mode}.${name}`))}</label><input id="${mode}-${name}" name="${name}" type="${({ email: 'email', password: 'password', phone: 'tel' })[name] || 'text'}" ${name !== 'phone' ? 'required' : ''} ${name === 'password' ? 'minlength="6" maxlength="128"' : `maxlength="${name === 'email' ? 254 : name === 'phone' ? 30 : 120}"`} autocomplete="${({ email: 'email', name: 'name', phone: 'tel', company: 'organization', password: mode === 'login' ? 'current-password' : 'new-password' })[name]}"></div>`).join('')}
      <button class="btn" type="submit">${h(t(`${mode}.submit`))}</button><p class="login-form__status" role="status"></p>
      <p class="login-form__signup">${h(t(mode === 'login' ? 'login.noAccount' : 'signup.hasAccount'))} <button type="button" data-switch>${h(t(mode === 'login' ? 'login.signup' : 'signup.login'))}</button></p></form>`}`
    dialog.querySelector('[data-understood]')?.addEventListener('click', () => dialog.close())
    dialog.querySelector('[data-switch]')?.addEventListener('click', () => showAccess({ ...detail, mode: mode === 'login' ? 'signup' : 'login' }, true))
    const form = dialog.querySelector('form')
    if (form) form.onsubmit = async event => {
      event.preventDefault()
      if (form.dataset.submitting) return
      const data = Object.fromEntries(new FormData(form))
      const endpoint = mode === 'login' ? env.VITE_LOGIN_ENDPOINT : env.VITE_SIGNUP_ENDPOINT
      form.dataset.submitting = 'true'
      const controls = [...form.querySelectorAll('input, button')]
      controls.forEach(control => { control.disabled = true })
      form.querySelector('[role="status"]').textContent = t(`${mode}.submitting`)
      try {
        if (endpoint) await postJson(endpoint, { ...data, plan: detail.plan, period: detail.period })
        dialog.close()
        observer?.disconnect()
        onAuthenticated({ name: data.name, email: data.email, company: data.company, phone: data.phone })
      } catch { form.querySelector('[role="status"]').textContent = t(`${mode}.error`) }
      finally { delete form.dataset.submitting; controls.forEach(control => { control.disabled = false }) }
    }
    if (!existing) openDialog(dialog)
    else dialog.querySelector('input')?.focus()
  }
  render()
  return () => observer?.disconnect()
}
