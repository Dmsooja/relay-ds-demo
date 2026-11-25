import assert from 'node:assert/strict'
import test from 'node:test'
import { execFileSync } from 'node:child_process'
import { brands, foundations, brandAliases, bluePrimitiveNames } from '../shared/tokens.mjs'
import { routes } from '../shared/content.mjs'
import { site } from '../shared/site.mjs'

const luminance = hex => {
  const srgb = hex.slice(1).match(/../g).map(value => Number.parseInt(value, 16) / 255)
  const [r, g, b] = srgb.map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
  return .2126 * r + .7152 * g + .0722 * b
}
const ratio = (a, b) => {
  const [low, high] = [luminance(a), luminance(b)].sort((x, y) => x - y)
  return (high + .05) / (low + .05)
}

test('both themes meet AA for action, focus, and key text roles', () => {
  const t = foundations
  for (const [name, brand] of Object.entries(brands)) {
    for (const [foreground, background] of [
      [t.paper, brand.action], [t.paper, brand.hover], [brand.deep, brand.tint],
      [brand.hover, brand.tint], [t.muted, brand.tint], [brand.tint, brand.darkest],
      [t.ink, t.paper], [t.success, t.successTint], [t.warning, t.warningTint], [t.danger, t.dangerTint],
    ]) assert.ok(ratio(foreground, background) >= 4.5, `${name} ${foreground} on ${background}`)
  }
  for (const role of Object.values(brandAliases)) assert.ok(bluePrimitiveNames[role] && brands.blue[role])
  execFileSync(process.execPath, ['scripts/sync-tokens.mjs', '--check'])
})

test('all four direct routes have their expected heading', () => {
  const flatten = nodes => nodes.flatMap(node => typeof node === 'object' ? [node, ...flatten(node.children)] : [])
  for (const route of routes) {
    const headings = flatten(site(route.path)).filter(node => node.tag === 'h1')
    assert.deepEqual(headings.map(node => node.children.join('')), [route.title])
  }
})
