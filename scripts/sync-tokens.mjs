import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { brands, foundations } from '../shared/tokens.mjs'

const files = [new URL('../shared/tokens.css', import.meta.url), new URL('../src/styles/tokens.css', import.meta.url)]
const kebab = key => key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
const block = (selector, entries) => `${selector} {\n${Object.entries(entries).map(([key, value]) =>
  `  --rd-${kebab(key)}: ${typeof value === 'number' ? `${value}px` : value};`).join('\n')}\n}\n`
const { spacing, ...rest } = foundations
const expected = '/* Generated from tokens.mjs by scripts/sync-tokens.mjs */\n'
  + block(':root, [data-theme="red"]', brands.red)
  + block('[data-theme="blue"]', brands.blue)
  + block(':root', { ...rest, ...Object.fromEntries(Object.entries(spacing).map(([key, value]) => [`space-${key}`, value])) })

if (process.argv.includes('--check')) {
  for (const file of files) if (await readFile(file, 'utf8') !== expected) throw new Error(file.pathname + ' is out of sync')
} else {
  for (const file of files) {
    await mkdir(new URL('.', file), { recursive: true })
    await writeFile(file, expected)
  }
}
