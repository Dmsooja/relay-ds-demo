import { chromium } from 'playwright-core'
import { mkdir, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'

const paths = ['/', '/solutions', '/pricing', '/contact', '/workspace', '/workspace/workflows']
const server = await createServer({ server: { host: '127.0.0.1', port: 5194, strictPort: true } })
await server.listen()
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
})
await mkdir('.extraction/figma-pages', { recursive: true })
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 980 } })
    for (const theme of ['red', 'blue']) {
      for (const route of paths) {
        await page.goto('http://127.0.0.1:5194' + route)
        await page.locator('h1').waitFor()
        await page.getByRole('button', { name: new RegExp('^' + theme + '$', 'i') }).click()
        await page.evaluate(() => document.fonts.ready)
        const tree = await page.evaluate(() => {
          let id = 0
          const rect = node => {
            const r = node.getBoundingClientRect()
            return { x: r.x + scrollX, y: r.y + scrollY, w: r.width, h: r.height }
          }
          const style = (node, override) => {
            const s = override ?? getComputedStyle(node)
            return {
              color: s.color, background: s.backgroundColor, radius: parseFloat(s.borderTopLeftRadius) || 0,
              border: parseFloat(s.borderTopWidth) ? s.borderTopColor : s.borderBottomColor,
              borderWidth: parseFloat(s.borderTopWidth) || parseFloat(s.borderBottomWidth) || 0,
              fontSize: parseFloat(s.fontSize), weight: parseInt(s.fontWeight) || 400, family: s.fontFamily,
              lineHeight: parseFloat(s.lineHeight) || parseFloat(s.fontSize) * 1.2,
              letterSpacing: parseFloat(s.letterSpacing) || 0, textAlign: s.textAlign, display: s.display,
              opacity: Number(s.opacity), gap: parseFloat(s.gap) || 0,
            }
          }
          function textGeometry(node) {
            const lines = []
            const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT)
            let textNode
            while ((textNode = walker.nextNode())) {
              for (let index = 0; index < textNode.length; index++) {
                const range = document.createRange()
                range.setStart(textNode, index)
                range.setEnd(textNode, index + 1)
                const r = range.getBoundingClientRect()
                if (!r.height) continue
                let line = lines.find(line => Math.abs(line.y - r.y) < 2)
                if (!line) { line = { y: r.y, text: '' }; lines.push(line) }
                line.text += textNode.data[index]
              }
            }
            return lines.map(line => line.text.trim()).filter(Boolean).join('\n')
          }
          function walk(node) {
            const box = rect(node)
            const s = getComputedStyle(node)
            if (box.w < 1 || box.h < 1 || s.display === 'none' || s.visibility === 'hidden'
              || node.matches('.sr-only,.skip-link,script,style,dialog:not([open])')) return null
            if (node.matches('svg')) {
              const svg = node.cloneNode(true)
              svg.setAttribute('width', String(box.w))
              svg.setAttribute('height', String(box.h))
              return { id: ++id, kind: 'svg', svg: svg.outerHTML.replaceAll('currentColor', s.color), box, style: style(node) }
            }
            const children = []
            const directText = [...node.childNodes].filter(child => child.nodeType === Node.TEXT_NODE && child.textContent.trim())
            const noElements = node.children.length === 0
            if (noElements && node.textContent.trim() && !node.matches('input,textarea')) {
              return { id: ++id, kind: 'text', text: node.textContent.trim(), lines: textGeometry(node), box, style: style(node), tag: node.tagName.toLowerCase(), cls: node.className }
            }
            for (const child of node.childNodes) {
              if (child.nodeType === Node.ELEMENT_NODE) {
                const result = walk(child)
                if (result) children.push(result)
              } else if (directText.includes(child)) {
                const range = document.createRange()
                range.selectNodeContents(child)
                const r = range.getBoundingClientRect()
                if (r.width && r.height) children.push({ id: ++id, kind: 'text', text: child.textContent.trim(),
                  box: { x: r.x + scrollX, y: r.y + scrollY, w: r.width, h: r.height }, style: style(node), tag: 'text' })
              }
            }
            if (node.matches('input,textarea')) {
              const text = node.value || node.placeholder
              if (text) children.push({ id: ++id, kind: 'text', text, tag: 'value',
                box: { x: box.x + parseFloat(s.paddingLeft), y: box.y + parseFloat(s.paddingTop),
                  w: box.w - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight),
                  h: parseFloat(s.lineHeight) || 20 },
                style: { ...style(node), color: node.value ? s.color : 'rgb(117, 117, 117)' } })
            }
            if (node.matches('select')) {
              children.length = 0
              children.push({ id: ++id, kind: 'text', text: node.selectedOptions[0]?.textContent ?? '', tag: 'value',
                box: { x: box.x + parseFloat(s.paddingLeft), y: box.y + parseFloat(s.paddingTop),
                  w: box.w - 40, h: 21 }, style: style(node) })
            }
            return { id: ++id, kind: 'frame', tag: node.tagName.toLowerCase(), cls: typeof node.className === 'string' ? node.className : '',
              box, style: style(node), children, href: node.getAttribute('href'),
              ...(node.matches('.brand-mark') ? { logo: true } : {}) }
          }
          return { width: innerWidth, height: document.documentElement.scrollHeight,
            tree: walk(document.querySelector('#app')), title: document.title }
        })
        const slug = route === '/' ? 'home' : route.replace(/^\//, '').replaceAll('/', '-')
        const key = slug + '-' + theme + '-' + width
        await writeFile('.extraction/figma-pages/' + key + '.json', JSON.stringify({ ...tree, route, theme, key }))
        await page.screenshot({ path: '.extraction/figma-pages/' + key + '.png', fullPage: true })
        console.log(key)
      }
    }
    await page.close()
  }
} finally {
  await browser.close()
  await server.close()
}
