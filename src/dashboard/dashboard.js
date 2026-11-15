import { t } from '../i18n.js'
import { escapeHtml as h, openDialog } from '../shared/dom.js'
import { createDemoData } from './data.js'
import { navIcons } from './icons.js'

const statuses = ['available', 'rented', 'maintenance', 'reserved']
const tabs = ['profile', 'inventory', 'register', 'requests', 'activeRentals', 'maintenance', 'history', 'catalog']
const today = () => new Date().toISOString().slice(0, 10)
const daysBetween = (from, to) => Math.round((new Date(to) - new Date(from)) / 86400000)
const label = key => h(t(`dashboard.${key}`))
const empty = () => t('dashboard.profile.empty')
const badge = (value, namespace = 'inventory.statuses', cls = value) => `<span class="status-badge status-badge--${h(cls)}">${label(`${namespace}.${value}`)}</span>`
const table = (headers, rows) => `<div class="inventory-table-wrap"><table class="inventory-table"><thead><tr>${headers.map(key => `<th scope="col">${label(key)}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`
const row = (cells, attrs = '') => `<tr ${attrs}>${cells.map(cell => `<td class="cell-wrap">${cell}</td>`).join('')}</tr>`
const input = (prefix, name, type = 'text', extra = '') => `<div class="register-form__row"><label for="${prefix}-${name}">${label(`${prefix}.${name}`)}</label><input id="${prefix}-${name}" name="${name}" type="${type}" ${extra}></div>`

export function renderDashboard(root, user, logout) {
  const data = createDemoData()
  let activeTab = 'profile'
  let historyFilter = ''
  const filters = { search: '', category: '', status: '' }
  const displayName = (user.name?.trim().split(' ')[0] || user.email?.split('@')[0] || '').replace(/^./, char => char.toUpperCase())
  const name = item => item.custom ? item.name : t(`dashboard.inventory.items.${item.id}.name`)
  const category = item => item.custom ? item.category : t(`dashboard.inventory.items.${item.id}.category`)
  const find = id => data.inventory.find(item => item.id === id)
  const machineName = id => { const item = find(id); return item ? name(item) : id }
  const machineOptions = () => data.inventory.map(item => `<option value="${h(item.id)}">${h(name(item))}</option>`).join('')
  const statusOptions = () => statuses.map(status => `<option value="${status}">${label(`inventory.statuses.${status}`)}</option>`).join('')
  const title = key => `<h2 class="panel-title">${label(key)}</h2>`

  root.onkeydown = null
  root.innerHTML = `<div class="dashboard-shell"><aside class="dashboard-sidebar">
    <div class="dashboard-sidebar__brand"><span class="brand" aria-label="RentBuild"><img class="brand__mark" src="${import.meta.env.BASE_URL}assets/images/logo-dark.png" alt="" width="57" height="57"><span class="brand__word" aria-hidden="true">entBuild</span></span></div>
    <nav class="dashboard-nav" aria-label="${label('tabsLabel')}">${tabs.map(key => `<button class="dashboard-nav__item" type="button" data-tab="${key}" aria-pressed="false"><span class="dashboard-nav__icon" aria-hidden="true">${navIcons[key]}</span><span class="dashboard-nav__label">${label(`tabs.${key}`)}</span></button>`).join('')}</nav>
    <div class="dashboard-sidebar__footer"><div class="dashboard-user"><span class="dashboard-user__avatar">${h((user.name || user.email || '?').charAt(0).toUpperCase())}</span><div class="dashboard-user__info"><span class="dashboard-user__name">${h(user.name || displayName || empty())}</span><span class="dashboard-user__email">${h(user.email)}</span></div></div><button class="dashboard-logout" type="button">${label('logout')}</button></div></aside>
    <main class="dashboard-main"><header class="dashboard-topbar"><h1>${h(t('dashboard.welcome', { name: displayName }))}</h1><p>${label('body')}</p></header><div id="dashboard-panel"></div></main>
    <dialog class="access-dialog machine-dialog" aria-labelledby="machine-title"></dialog></div>`
  const panel = root.querySelector('#dashboard-panel')
  root.querySelector('.dashboard-logout').onclick = logout
  root.querySelectorAll('[data-tab]').forEach(button => { button.onclick = () => { activeTab = button.dataset.tab; renderPanel() } })

  function renderPanel() {
    root.querySelectorAll('[data-tab]').forEach(button => {
      const active = button.dataset.tab === activeTab
      button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active))
    })
    panel.className = `${activeTab === 'activeRentals' ? 'active-rentals' : activeTab}-card`
    if (activeTab === 'profile') {
      panel.innerHTML = `${title('profileTitle')}<dl class="profile-info">${['name', 'email', 'company', 'phone'].map(key => `<div class="profile-info__row"><dt>${label(`profile.${key}`)}</dt><dd>${h(user[key] || empty())}</dd></div>`).join('')}</dl>`
    } else if (activeTab === 'inventory') {
      panel.innerHTML = title('inventory.title') + table(['inventory.equipment', 'inventory.category', 'inventory.status', 'inventory.units'], data.inventory.map(item => row([h(name(item)), h(category(item)), badge(item.status), `${item.available} / ${item.total}`], `class="inventory-table__row" tabindex="0" role="button" aria-label="${label('inventory.viewDetail')}" data-machine="${h(item.id)}"`)))
    } else if (activeTab === 'register') {
      panel.innerHTML = `${title('register.title')}<form class="register-form">${input('register', 'name', 'text', 'required maxlength="80"')}${input('register', 'category', 'text', 'required maxlength="60"')}<div class="register-form__grid"><div class="register-form__row"><label for="register-status">${label('register.status')}</label><select id="register-status" name="status">${statusOptions()}</select></div>${input('register', 'total', 'number', 'required min="1" max="999" value="1"')}${input('register', 'available', 'number', 'required min="0" max="999" value="1"')}</div><button class="btn" type="submit">${label('register.submit')}</button><p role="status" class="register-form__status"></p></form>`
      panel.querySelector('form').onsubmit = event => {
        event.preventDefault()
        const form = event.currentTarget
        const values = Object.fromEntries(new FormData(form))
        const name = values.name.trim(), category = values.category.trim(), total = Number(values.total), available = Number(values.available)
        const error = !name || !category ? 'fields' : !Number.isInteger(total) || total < 1 ? 'total' : !Number.isInteger(available) || available < 0 || available > total ? 'available' : ''
        const status = form.querySelector('[role="status"]')
        status.classList.toggle('register-form__status--error', Boolean(error))
        if (error) { status.textContent = t(`dashboard.register.errors.${error}`); return }
        data.inventory.push({ id: `custom-${crypto.randomUUID()}`, name, category, total, available, status: values.status, custom: true })
        form.reset(); status.textContent = t('dashboard.register.success')
      }
    } else if (activeTab === 'requests') {
      panel.innerHTML = title('requests.title') + table(['requests.machine', 'requests.dates', 'requests.status'], data.requests.map(request => row([h(machineName(request.machineId)), h(t('dashboard.requests.dateRange', { start: request.startDate, end: request.endDate })), badge(request.status, 'requests.statuses')])))
    } else if (activeTab === 'activeRentals') {
      const active = data.requests.filter(request => request.status === 'approved' && request.endDate >= today())
      panel.innerHTML = title('activeRentals.title') + (active.length ? table(['activeRentals.machine', 'activeRentals.period', 'activeRentals.rate', 'activeRentals.cost', 'activeRentals.status'], active.map(request => {
        const rate = find(request.machineId)?.rate
        const inProgress = request.startDate <= today()
        const days = daysBetween(today(), inProgress ? request.endDate : request.startDate)
        return row([h(machineName(request.machineId)), `${h(request.startDate)} – ${h(request.endDate)}`, h(rate == null ? empty() : t('dashboard.inventory.detail.rateValue', { rate })), h(rate == null ? empty() : t('dashboard.activeRentals.costValue', { cost: rate * (daysBetween(request.startDate, request.endDate) + 1) })), `<span class="status-badge status-badge--${inProgress ? 'approved' : 'pending'}">${h(t(`dashboard.activeRentals.${inProgress ? 'inProgress' : 'upcoming'}`, { days }))}</span>`])
      })) : `<p class="active-rentals-empty">${label('activeRentals.empty')}</p>`)
    } else if (activeTab === 'maintenance') {
      panel.innerHTML = `${title('maintenance.title')}<form class="register-form"><div class="register-form__row"><label for="maintenance-machine">${label('maintenance.machine')}</label><select id="maintenance-machine" name="machineId" required><option value="" disabled selected>${label('maintenance.selectMachine')}</option>${machineOptions()}</select></div><div class="register-form__grid register-form__grid--two"><div class="register-form__row"><label for="maintenance-type">${label('maintenance.type')}</label><select id="maintenance-type" name="type">${['maintenance', 'incident'].map(type => `<option value="${type}">${label(`maintenance.types.${type}`)}</option>`).join('')}</select></div>${input('maintenance', 'date', 'date', `required value="${today()}"`)}</div><div class="register-form__row"><label for="maintenance-description">${label('maintenance.description')}</label><textarea id="maintenance-description" name="description" rows="3" required maxlength="300"></textarea></div><button class="btn" type="submit">${label('maintenance.submit')}</button><p class="register-form__status" role="status"></p></form><h3 class="maintenance-log-title">${label('maintenance.logTitle')}</h3><div id="maintenance-log"></div>`
      const updateLog = () => {
        panel.querySelector('#maintenance-log').innerHTML = table(['maintenance.machine', 'maintenance.type', 'maintenance.description', 'maintenance.date'], data.maintenance.map(record => row([h(machineName(record.machineId)), badge(record.type, 'maintenance.types', record.type === 'incident' ? 'rejected' : 'maintenance'), h(record.description), h(record.date)])))
      }
      updateLog()
      panel.querySelector('form').onsubmit = event => {
        event.preventDefault()
        const form = event.currentTarget
        const values = Object.fromEntries(new FormData(form))
        const error = !find(values.machineId) ? 'machine' : !values.description.trim() ? 'description' : !/^\d{4}-\d{2}-\d{2}$/.test(values.date) ? 'date' : ''
        const status = form.querySelector('[role="status"]')
        status.classList.toggle('register-form__status--error', Boolean(error))
        if (error) { status.textContent = t(`dashboard.maintenance.errors.${error}`); return }
        data.maintenance.unshift({ ...values, description: values.description.trim(), id: `maint-${crypto.randomUUID()}` })
        Object.assign(find(values.machineId), { status: 'maintenance', lastMaintenance: values.date })
        form.reset(); status.textContent = t('dashboard.maintenance.success'); updateLog()
      }
    } else if (activeTab === 'history') {
      panel.innerHTML = `${title('history.title')}<div class="history-filter"><label for="history-machine-filter">${label('history.filter')}</label><select id="history-machine-filter"><option value="">${label('history.allMachines')}</option>${machineOptions()}</select></div><div id="history-results"></div>`
      const filter = panel.querySelector('select'); filter.value = historyFilter
      const updateHistory = () => {
        const records = [...data.maintenance.map(record => ({ machineId: record.machineId, date: record.date, badge: badge(record.type, 'maintenance.types', record.type === 'incident' ? 'rejected' : 'maintenance'), detail: record.description })), ...data.requests.map(request => ({ machineId: request.machineId, date: request.startDate, badge: badge(request.status, 'requests.statuses'), detail: t('dashboard.history.requestDetail', { start: request.startDate, end: request.endDate }) }))].filter(record => !historyFilter || record.machineId === historyFilter).sort((a, b) => b.date.localeCompare(a.date))
        panel.querySelector('#history-results').innerHTML = records.length ? table(['history.machine', 'history.event', 'history.date', 'history.detail'], records.map(record => row([h(machineName(record.machineId)), record.badge, h(record.date), h(record.detail)]))) : `<p class="active-rentals-empty">${label('history.empty')}</p>`
      }
      filter.onchange = () => { historyFilter = filter.value; updateHistory() }; updateHistory()
    } else if (activeTab === 'catalog') {
      const categories = [...new Set(data.inventory.map(category))].sort()
      panel.innerHTML = `${title('catalog.title')}<div class="catalog-filters"><input id="catalog-search" type="search" placeholder="${label('catalog.searchPlaceholder')}" aria-label="${label('catalog.search')}"><select id="catalog-category" aria-label="${label('catalog.allCategories')}"><option value="">${label('catalog.allCategories')}</option>${categories.map(value => `<option value="${h(value)}">${h(value)}</option>`).join('')}</select><select id="catalog-status" aria-label="${label('catalog.allStatuses')}"><option value="">${label('catalog.allStatuses')}</option>${statusOptions()}</select></div><div id="catalog-results"></div>`
      const updateCatalog = () => {
        const items = data.inventory.filter(item => (!filters.search || `${name(item)} ${category(item)}`.toLowerCase().includes(filters.search.trim().toLowerCase())) && (!filters.category || filters.category === category(item)) && (!filters.status || filters.status === item.status))
        panel.querySelector('#catalog-results').innerHTML = items.length ? `<div class="catalog-grid">${items.map(item => `<button class="catalog-item" type="button" data-machine="${h(item.id)}"><span class="catalog-item__category">${h(category(item))}</span><h3 class="catalog-item__name">${h(name(item))}</h3>${badge(item.status)}<p class="catalog-item__availability">${h(t('dashboard.inventory.detail.availability', item))}</p><p class="catalog-item__rate">${h(item.rate ? t('dashboard.inventory.detail.rateValue', item) : empty())}</p><span class="catalog-item__cta">${label('catalog.viewDetail')}</span></button>`).join('')}</div>` : `<p class="active-rentals-empty">${label('catalog.empty')}</p>`
        bindDetails()
      }
      for (const key of ['search', 'category', 'status']) {
        const control = panel.querySelector(`#catalog-${key}`); control.value = filters[key]
        control.addEventListener(key === 'search' ? 'input' : 'change', () => { filters[key] = control.value; updateCatalog() })
      }
      updateCatalog()
    }
    bindDetails()
  }

  function bindDetails() {
    panel.querySelectorAll('[data-machine]').forEach(element => {
      element.onclick = () => showDetails(find(element.dataset.machine))
      if (element.tagName === 'TR') element.onkeydown = event => {
        if (['Enter', ' '].includes(event.key)) { event.preventDefault(); showDetails(find(element.dataset.machine)) }
      }
    })
  }
  function showDetails(item) {
    const dialog = root.querySelector('.machine-dialog')
    const field = key => item.custom ? item[key] : t(`dashboard.inventory.items.${item.id}.${key}`)
    const details = { location: field('location'), code: item.code, rate: item.rate ? t('dashboard.inventory.detail.rateValue', item) : null, lastMaintenance: item.lastMaintenance }
    dialog.innerHTML = `<button class="access-dialog__close" aria-label="${label('inventory.detail.close')}">×</button><span class="eyebrow">${h(category(item))}</span><h2 id="machine-title">${h(name(item))}</h2><div class="machine-dialog__status">${badge(item.status)}<span class="machine-dialog__availability">${h(t('dashboard.inventory.detail.availability', item))}</span></div><p class="machine-dialog__description">${h(field('description') || empty())}</p><dl class="machine-dialog__grid">${Object.entries(details).map(([key, value]) => `<div class="machine-dialog__field"><dt>${label(`inventory.detail.${key}`)}</dt><dd>${h(value || empty())}</dd></div>`).join('')}</dl>`
    openDialog(dialog)
  }
  renderPanel()
}
