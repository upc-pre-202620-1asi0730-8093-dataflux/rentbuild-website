import { renderLanding } from './landing.js'
import { renderDashboard } from './dashboard/dashboard.js'
import { getLanguage } from './i18n.js'
import './assets/styles/reset.css'
import './assets/styles/variables.css'
import './assets/styles/layout.css'
import './assets/styles/main.css'
import './assets/styles/components/header.css'
import './assets/styles/components/hero.css'
import './assets/styles/components/features.css'
import './assets/styles/components/showcase.css'
import './assets/styles/components/pricing.css'
import './assets/styles/components/team.css'
import './assets/styles/components/contact.css'
import './assets/styles/components/dashboard.css'
import './assets/styles/components/footer.css'
import './assets/styles/components/video.css'
import './assets/styles/responsive.css'

const root = document.querySelector('#app')
const sessionKey = 'rentbuild-user'
let disposeLanding
document.documentElement.lang = getLanguage()

function logout() {
  try { sessionStorage.removeItem(sessionKey) } catch { /* Optional persistence. */ }
  disposeLanding = renderLanding(root, authenticate)
}
function authenticate(user) {
  disposeLanding?.()
  try { sessionStorage.setItem(sessionKey, JSON.stringify(user)) } catch { /* Optional persistence. */ }
  renderDashboard(root, user, logout)
  window.scrollTo(0, 0)
}
let storedUser
try {
  const value = JSON.parse(sessionStorage.getItem(sessionKey))
  if (value && typeof value.email === 'string') {
    storedUser = Object.fromEntries(['name', 'email', 'company', 'phone'].filter(key => typeof value[key] === 'string').map(key => [key, value[key]]))
  }
} catch { /* Invalid or unavailable storage starts on the landing page. */ }
if (storedUser) authenticate(storedUser)
else disposeLanding = renderLanding(root, authenticate)
