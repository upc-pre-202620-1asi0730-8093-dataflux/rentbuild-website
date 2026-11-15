import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  use: { baseURL: 'http://127.0.0.1:4180', browserName: 'chromium', channel: process.env.PLAYWRIGHT_CHANNEL || undefined, trace: 'retain-on-failure' },
  webServer: [
    { command: 'npm run preview -- --host 127.0.0.1 --port 4180 --strictPort', url: 'http://127.0.0.1:4180', reuseExistingServer: false },
    { command: 'npm run dev -- --host 127.0.0.1 --port 4182 --strictPort', url: 'http://127.0.0.1:4182', reuseExistingServer: false,
      env: { VITE_CONTACT_FORM_ENDPOINT: '/test-api/contact', VITE_NEWSLETTER_ENDPOINT: '/test-api/newsletter', VITE_SIGNUP_ENDPOINT: '/test-api/signup', VITE_LOGIN_ENDPOINT: '/test-api/login', VITE_CONTACT_EMAIL: 'contact@example.com', VITE_SOCIAL_GITHUB: 'https://github.com/upc-pre-202620-1asi0730-8093-dataflux' } },
  ],
})
