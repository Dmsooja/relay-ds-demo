import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { mkdir, readFile, stat } from 'node:fs/promises'
import { resolve, sep } from 'node:path'
import { chromium } from 'playwright-core'
import { routes } from '../shared/content.mjs'

const outputs = {
  react: 'dist-react',
  angular: 'frameworks/angular/dist/browser',
  'web-components': 'dist-web-components',
  hybrid: 'dist-react-web-components',
}
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' }
const executablePath = process.env.RELAY_DEMO_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const browser = await chromium.launch({ executablePath, headless: true })
await mkdir('screenshots', { recursive: true })
try {
  for (const [framework, output] of Object.entries(outputs)) {
    const root = resolve(output)
    await stat(resolve(root, 'index.html'))
    const server = createServer(async (req, res) => {
      const path = new URL(req.url, 'http://localhost').pathname
      const file = resolve(root, `.${path}`)
      if (file !== root && !file.startsWith(root + sep)) return res.writeHead(400).end()
      const ext = /\.[a-z]+$/i.exec(path)?.[0] ?? ''
      try {
        res.writeHead(200, { 'content-type': mime[ext] ?? mime['.html'] })
        res.end(await readFile(ext ? file : resolve(root, 'index.html')))
      } catch { res.end() }
    })
    await new Promise(done => server.listen(0, '127.0.0.1', done))
    const url = `http://127.0.0.1:${server.address().port}`
    const page = await browser.newPage({ viewport: { width: 1440, height: 980 } })
    page.setDefaultTimeout(10000)
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    const open = async path => {
      await page.goto(url + path, { waitUntil: 'domcontentloaded' })
      await page.locator('h1').waitFor()
    }
    try {
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 980 })
        for (const theme of ['red', 'blue']) {
          for (const route of routes) {
            await open(route.path)
            await page.getByRole('button', { name: theme, exact: false }).filter({ hasText: new RegExp(`^${theme}$`, 'i') }).click()
            assert.equal(await page.locator('html').getAttribute('data-theme'), theme)
            assert.equal(await page.locator('h1').textContent(), route.title)
            if (route.path === '/') {
              const preview = page.locator('.product-preview img')
              assert.equal(await preview.count(), 1)
              await preview.evaluate(image => image.decode())
              assert.ok(await preview.evaluate(image => image.naturalWidth > 0))
              assert.equal(await preview.getAttribute('src'), `/assets/relay-workspace-${theme}.png`)
              assert.equal(await page.locator('.product-preview figcaption').count(), 0)
            }
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${framework} ${theme} ${route.path} ${width}px overflows`)
            if (framework === 'react') {
              const slug = route.path.slice(1) || 'home'
              await page.screenshot({ path: `screenshots/${slug}-${theme}-${width}.png`, fullPage: true })
            }
          }
          await open('/workspace')
          assert.equal(await page.locator('h1').textContent(), 'Request inbox')
          assert.equal(await page.locator('[data-request-row]:visible').count(), 6)
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), framework + ' workspace overflows')
          if (framework === 'react') await page.screenshot({ path: `screenshots/workspace-${theme}-${width}.png`, fullPage: true })
          await page.getByRole('link', { name: 'Explore workflows', exact: true }).click()
          await page.waitForURL('**/workspace/workflows')
          assert.equal(await page.locator('h1').textContent(), 'Explore workflows')
          assert.equal(await page.locator('[data-workflow-card]:visible').count(), 6)
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), framework + ' workflows overflows')
          if (framework === 'react') await page.screenshot({ path: `screenshots/workflows-${theme}-${width}.png`, fullPage: true })
        }
      }
      await open('/')
      await page.locator('a[href="/workspace"]').click()
      await page.waitForURL('**/workspace')
      await page.getByRole('tab', { name: 'Awaiting review', exact: true }).click()
      assert.equal(await page.locator('[data-request-row]:visible').count(), 2)
      await page.getByLabel('Search requests').fill('vendor')
      assert.equal(await page.locator('[data-request-row]:visible').count(), 1)
      await page.getByRole('button', { name: 'New vendor review', exact: true }).click()
      await page.getByRole('dialog', { name: 'Request details' }).waitFor()
      assert.equal(await page.locator('[data-detail-owner]').textContent(), 'Alex Morgan')
      await page.keyboard.press('Escape')
      assert.equal(await page.getByRole('dialog').count(), 0)
      assert.ok(await page.getByRole('button', { name: 'New vendor review', exact: true }).evaluate(node => document.activeElement === node))
      await page.getByLabel('Search requests').fill('nothing matches')
      await page.getByRole('heading', { name: 'No requests found' }).waitFor()
      await page.getByRole('button', { name: 'Clear filters' }).click()
      assert.equal(await page.locator('[data-request-row]:visible').count(), 6)
      await page.getByRole('tab', { name: 'All requests', exact: true }).focus()
      await page.keyboard.press('ArrowRight')
      assert.equal(await page.getByRole('tab', { name: 'Awaiting review', exact: true }).getAttribute('aria-selected'), 'true')
      await page.reload()
      assert.equal(await page.locator('[data-request-row]:visible').count(), 6)
      await page.getByRole('link', { name: 'Explore workflows', exact: true }).click()
      await page.waitForURL('**/workspace/workflows')
      assert.equal(await page.getByRole('link', { name: 'Explore workflows', exact: true }).getAttribute('aria-current'), 'page')
      await page.getByLabel('Team', { exact: true }).selectOption('IT operations')
      assert.equal(await page.locator('[data-workflow-card]:visible').count(), 2)
      await page.getByLabel('Search workflows').fill('access')
      assert.equal(await page.locator('[data-workflow-card]:visible').count(), 1)
      await page.getByRole('button', { name: 'View access request', exact: true }).click()
      await page.getByRole('dialog', { name: 'Workflow template' }).waitFor()
      assert.equal(await page.locator('[data-workflow-step]').count(), 3)
      assert.match(await page.locator('[data-workflow-outcome]').textContent(), /Access provisioned/)
      await page.keyboard.press('Escape')
      assert.ok(await page.getByRole('button', { name: 'View access request', exact: true }).evaluate(node => document.activeElement === node))
      await page.getByLabel('Search workflows').fill('no-match')
      await page.getByRole('heading', { name: 'No workflows found' }).waitFor()
      await page.getByRole('button', { name: 'Clear filters', exact: true }).click()
      assert.equal(await page.locator('[data-workflow-card]:visible').count(), 6)
      await page.reload()
      await page.getByRole('heading', { name: 'Explore workflows', exact: true }).waitFor()
      await page.getByRole('link', { name: 'Request inbox', exact: true }).click()
      await page.waitForURL('**/workspace')
      await open('/')
      const menu = page.getByRole('button', { name: 'Open menu' })
      await menu.click()
      await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Solutions' }).click()
      await page.waitForURL('**/solutions')
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'blue')
      await page.getByRole('tab', { name: 'Intake' }).focus()
      await page.keyboard.press('ArrowRight')
      assert.equal(await page.getByRole('tab', { name: 'Approvals' }).getAttribute('aria-selected'), 'true')
      await page.getByRole('heading', { name: 'Cross-team approvals' }).waitFor()
      await open('/pricing')
      await page.getByRole('button', { name: 'Annual', exact: true }).click()
      assert.equal(await page.locator('[data-annual="32"]').textContent(), '$32')
      await page.getByText('What counts as a seat?', { exact: true }).click()
      await page.getByText('People who only submit a request', { exact: false }).waitFor()
      await page.getByRole('link', { name: 'Talk about Team' }).click()
      await page.waitForURL('**/contact?plan=team')
      await page.getByLabel('Plan of interest').waitFor()
      assert.equal(await page.getByLabel('Plan of interest').inputValue(), 'team')
      const submit = page.getByRole('button', { name: 'Submit demo request' })
      await submit.click()
      assert.equal(await page.locator('form').evaluate(form => form.checkValidity()), false)
      await page.getByLabel('Full name').fill('Jordan Demo')
      await page.getByLabel('Company', { exact: true }).fill('Example Company')
      await page.getByLabel('Work email').fill('jordan@example.test')
      await submit.click()
      await page.getByText('Demo request complete.').waitFor()
      await page.getByRole('button', { name: 'Start again' }).click()
      assert.equal(await page.getByLabel('Full name').inputValue(), '')
      assert.deepEqual(errors, [])
      console.log(`${framework}: marketing, inbox and workflow routes, both themes, 1440/390px, filters, previews, keyboard navigation, pricing, and form passed`)
    } finally {
      await page.close()
      server.close()
    }
  }
} finally {
  await browser.close()
}
