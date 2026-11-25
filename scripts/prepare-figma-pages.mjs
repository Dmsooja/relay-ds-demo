import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { brands, foundations } from '../shared/tokens.mjs'

const batch = Number(process.argv[2] ?? 0)
const ledger = JSON.parse(readFileSync('.extraction/figma-pages/ledger.json', 'utf8'))
const combinations = [
  ['home', 'Home'], ['solutions', 'Solutions'], ['pricing', 'Pricing'], ['contact', 'Contact'],
  ['workspace', 'Dashboard'], ['workspace-workflows', 'Explore workflows'],
]
const [slug, label] = combinations[batch % 6]
const width = batch < 6 ? 1440 : 390
const theme = process.argv[3] ?? 'red'
const snapshot = JSON.parse(readFileSync('.extraction/figma-pages/' + slug + '-' + theme + '-' + width + '.json', 'utf8'))
const styles = []
const styleIds = new Map()
const textStyles = {}
const style = source => {
  const s = { color: source.color, bg: source.background, bc: source.border, bw: source.borderWidth,
    r: source.radius, fs: source.fontSize, fw: source.weight, lh: source.lineHeight, ls: source.letterSpacing, ta: source.textAlign }
  const key = JSON.stringify(s)
  if (!styleIds.has(key)) { styleIds.set(key, styles.length); styles.push(s) }
  return styleIds.get(key)
}
const blank = { color: 'rgb(23, 26, 36)', background: 'rgba(0, 0, 0, 0)', border: '', borderWidth: 0,
  radius: 0, fontSize: 16, weight: 400, lineHeight: 24, letterSpacing: 0, textAlign: 'left' }
const transparentStyle = style(blank)
function compress(node, parent) {
  const cls = node.cls ?? ''
  const b = Object.values(node.box).map(value => Math.round(value * 100) / 100)
  const n = { k: node.kind, b, s: style(node.style), name: cls || node.tag || 'Icon' }
  if (node.svg) {
    n.svg = node.svg
    n.name = 'Icon ' + createHash('sha256').update(node.svg.replace(/rgb\([^)]+\)/g, 'currentColor')).digest('hex').slice(0, 10)
  }
  if (node.logo) n.logo = true
  if (node.text) n.text = node.text
  if (node.lines) n.lines = node.lines
  if (cls === 'eyebrow') {
    if (n.text) n.text = n.text.toUpperCase()
    if (n.lines) n.lines = n.lines.toUpperCase()
  }
  if (node.children?.length) n.c = node.children.map(child => compress(child, node))
  if (node.tag === 'details') n.c = node.children.filter(child => child.tag === 'summary').map(child => compress(child, node))
  const ui = [
    ['rd-button', 'Button'], ['rd-link', 'Link'], ['rd-badge', 'Badge'], ['rd-card', 'Card'], ['rd-input', node.tag === 'select' ? 'Select' : 'Input'],
  ].find(([className]) => cls.split(' ').includes(className))
  if (ui && node.tag !== 'textarea') {
    const variant = cls.match(/(?:^| )is-(\S+)/)?.[1] ?? (ui[1] === 'Button' ? 'primary' : 'default')
    const value = variant === 'brand' || variant === 'neutral' ? 'Default' : variant[0].toUpperCase() + variant.slice(1)
    n.ui = { kind: ui[1], variant: value, active: !snapshot.route.startsWith('/workspace') && node.href === snapshot.route }
  }
  if (!n.ui && (cls === 'theme-control' || cls.includes('wordmark') || cls === 'dashboard-sidebar'
    || cls.includes('rd-footer') || cls.includes('rd-header') || cls === 'product-preview'
    || cls === 'product-row' || (node.tag === 'li' && parent?.cls?.includes('inbox-list')))) {
    const signature = JSON.stringify(node, (key, value) => {
      if (key === 'box' || key === 'id') return undefined
      if (['color', 'background', 'border'].includes(key) && !['theme-control'].includes(cls) && !cls.includes('rd-header')) return undefined
      return value
    })
    n.pattern = (cls || 'Request row') + ':' + width + ':' + createHash('sha256').update(signature).digest('hex').slice(0, 12)
    if (cls === 'dashboard-sidebar') n.pattern += ':' + snapshot.route
    n.patternName = (cls.includes('rd-header') ? 'Header' : cls.includes('rd-footer') ? 'Footer' : cls || 'Request row') + ' / ' + width
  }
  if (node.kind === 'text') textStyles[n.s] = style({ ...node.style, background: 'rgba(0,0,0,0)', borderWidth: 0, radius: 0 })
  return n
}
const tree = compress(snapshot.tree)
tree.b = [0, 0, width, snapshot.height]
const tokens = {
  paper: 'surface/default', action: 'brand/primary', hover: 'brand/primary-hover', tint: 'relay/brand/tint',
  deep: 'brand/deep', darkest: 'brand/darkest', secondary: 'brand/secondary',
  ink: 'relay/ink', muted: 'relay/muted', surface: 'relay/surface', border: 'relay/border',
  success: 'relay/success', successTint: 'relay/success-tint', warning: 'relay/warning',
  warningTint: 'relay/warning-tint', danger: 'relay/danger', dangerTint: 'relay/danger-tint',
}
const colors = {}
const palette = { ...foundations, ...brands[theme] }
for (const role of Object.keys(tokens)) {
  const value = palette[role]
  if (typeof value === 'string' && value.startsWith('#')) {
    const key = value.slice(1).match(/../g).map(x => parseInt(x, 16)).join(',')
    colors[key] = role
  }
}
colors['117,117,117'] = 'muted'
const payload = {
  theme: theme === 'red' ? 'Red' : 'Blue', tokens, colors, styles, textStyles, transparentStyle,
  patterns: ledger.patterns, icons: ledger.icons,
  spacing: [[4, 'spacing/xxs'], [8, 'spacing/xs'], [12, 'spacing/sm'], [16, 'spacing/md'], [20, 'spacing/lg'], [24, 'spacing/xl'], [32, 'spacing/xxl']],
  radii: [],
  screens: [{ name: label + ' / ' + (width === 1440 ? 'Desktop' : 'Mobile') + ' / ' + (theme === 'red' ? 'Red' : 'Blue'),
    x: 100 + (batch % 6) * 1600,
    y: 140 + (theme === 'blue' ? (width === 390 ? 3200 : 2500) : 0) + (width === 390 ? 5100 : 0), tree }],
}
const source = readFileSync('scripts/figma-page-builder.js', 'utf8')
const code = source + '\nreturn await buildRelayPages(' + JSON.stringify(payload) + ');'
if (process.argv.includes('--out')) {
  const path = '.extraction/figma-pages/batch-' + batch + '-' + theme + '.js'
  writeFileSync(path, code)
  console.log(path)
} else console.log(code)
