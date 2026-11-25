import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const schema = JSON.parse(await readFile(new URL('../code-connect/components.json', import.meta.url), 'utf8'))
const figmaURL = 'https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo'
const sourceBase = 'https://github.com/Dmsooja/relay-ds-demo/blob/main/'
const variants = { Navbar: 'header', CTABanner: 'cta-banner', FeatureGrid: 'feature-grid', FormField: 'form-field' }
const nativeComponents = new Set(['Button', 'Input', 'Card', 'Badge', 'Alert', 'Hero', 'CTABanner'])
const targets = {
  react: { label: 'React', language: 'jsx', source: 'src/components.tsx', imports: '@sc-demo/relay-ds-demo' },
  angular: { label: 'Angular', language: 'html', source: 'frameworks/angular/src/components.ts', imports: '../../frameworks/angular/src/components' },
  'web-components': { label: 'Web Components', language: 'html', source: 'frameworks/web-components/elements.ts', imports: '../../frameworks/web-components/elements' },
  'react-native': { label: 'React Native', language: 'tsx', source: 'frameworks/react-native/components.tsx', imports: '../../frameworks/react-native/components' },
}
const slug = value => value.toLowerCase().replaceAll(' ', '-')
const camel = value => value[0].toLowerCase() + value.slice(1).replace(/ (\w)/g, (_, first) => first.toUpperCase())
const files = new Map()
const dynamic = key => '${' + key + '}'

function componentExample(name, target) {
  const native = target === 'react-native'
  const jsx = native || target === 'react'
  const kind = variants[name] ?? slug(name)
  const component = name === 'Navbar' ? 'Header' : name
  const tag = jsx ? component : target === 'angular' ? 'relay-ui' : 'relay-' + kind
  const props = []
  if (target === 'angular') props.push('kind="' + kind + '"')
  const add = (...keys) => keys.forEach(key => props.push(key + '="' + dynamic(key) + '"'))
  const attr = (name, value) => props.push(name + '="' + value + '"')
  for (const [key, values] of Object.entries(schema[name].properties)) {
    if (Array.isArray(values)) add(camel(key))
  }
  let body = ''
  switch (name) {
    case 'Button': case 'Badge': case 'Link':
      if (name === 'Link') attr('href', '/')
      body = '@{label}'
      break
    case 'Card':
      if (native) { add('header'); body = '@{content}'; break }
      body = '<h3>@{header}</h3>@{content}'
      break
    case 'Hero': case 'CTABanner':
      if (native) {
        if (name === 'Hero') add('eyebrow')
        add('title', 'subtitle')
        body = '@{actions}'
        break
      }
      body = name === 'Hero'
        ? '<p class="eyebrow">@{eyebrow}</p><h1>@{title}</h1><p>@{subtitle}</p>@{actions}'
        : '<div><h2>@{title}</h2><p>@{subtitle}</p></div>@{actions}'
      if (jsx && name === 'Hero') body = body.replace('class=', 'className=')
      break
    case 'FeatureGrid': body = '<h2>@{title}</h2>@{items}'; break
    case 'Input':
      add('label', 'placeholder', 'value')
      if (native) add('error')
      break
    case 'Select':
      add('label', 'value')
      body = '<option value="@{value}">@{value}</option>'
      break
    case 'FormField':
      body = '<span>@{label}</span><small>@{fieldMessage}</small>'
      break
    case 'Alert':
      if (target === 'angular') props.push('[dismissible]="' + dynamic('dismissible') + '"')
      else props.push(dynamic("dismissible ? 'dismissible' : ''"))
      body = '@{children}'
      break
    case 'Modal': attr('label', dynamic('title')); body = '<h2>@{title}</h2>@{content}'; break
    case 'Navbar':
      attr('data-mobile-open', dynamic('mobileOpen'))
      body = '<nav aria-label="Main"><a href="/">@{navLabel}</a></nav>'
      break
    case 'Footer': body = '<small>@{copyright}</small>'; break
    case 'List': body = '<li>@{item}</li>'; break
    case 'Breadcrumb': body = '<a href="/">@{item}</a><span aria-hidden="true">@{divider}</span>'; break
    case 'Accordion':
      body = '<details @{open}><summary>@{summary}</summary><p>@{detail}</p></details>'
      break
    case 'Tabs':
      body = '<div role="tablist"><button type="button" role="tab" aria-selected="@{selected}" @{disabled}>@{tabLabel}</button></div>'
      break
  }
  body = body.replace(/@\{(\w+)\}/g, (_, key) => dynamic(key))
  const start = '<' + tag + (props.length ? ' ' + props.join(' ') : '')
  if (name === 'Input' && jsx) return start + ' />'
  return start + '>' + body + '</' + tag + '>'
}

const fallbackReads = {
  Navbar: { navLabel: 'Link' }, Footer: { copyright: 'Copyright' }, List: { item: 'Content' },
  Breadcrumb: { item: 'Item' }, Accordion: { summary: 'Header', detail: 'Body' }, Tabs: { tabLabel: 'Label' },
}

for (const [target, config] of Object.entries(targets)) {
  const include = 'code-connect/' + target + '/*.figma.ts'
  const configName = target === 'react' ? 'figma.config.json' : 'figma.' + target + '.config.json'
  files.set(configName, JSON.stringify({ codeConnect: { include: [include], label: config.label, language: config.language } }, null, 2) + '\n')
  for (const [name, { id, properties }] of Object.entries(schema)) {
    if (target === 'react-native' && !nativeComponents.has(name)) continue
    const imports = target === 'web-components'
      ? ['import { registerElements } from "' + config.imports + '"', 'registerElements()']
      : ['import { ' + (target === 'angular' ? 'RelayUIComponent' : name === 'Navbar' ? 'Header' : name) + ' } from "' + config.imports + '"']
    let example = componentExample(name, target)
    const lines = []
    for (const [key, type] of Object.entries(properties)) {
      const prop = camel(key)
      if (Array.isArray(type)) {
        const combinations = Object.fromEntries(type.map(value => [value, slug(value)]))
        lines.push('const ' + prop + ' = instance.getEnum(' + JSON.stringify(key) + ', ' + JSON.stringify(combinations) + ')')
      } else {
        const method = { TEXT: 'getString', SLOT: 'getSlot', BOOLEAN: 'getBoolean' }[type]
        lines.push('const ' + prop + ' = instance.' + method + '(' + JSON.stringify(key) + ')')
      }
    }
    for (const [prop, layer] of Object.entries(fallbackReads[name] ?? {})) {
      lines.push('const ' + prop + 'Node = instance.findText(' + JSON.stringify(layer) + ')')
      lines.push('const ' + prop + ' = ' + prop + 'Node?.type === "TEXT" ? ' + prop + 'Node.textContent : ""')
    }
    if (name === 'FormField') lines.push('const fieldMessage = state === "error" ? error : helperText')
    if (name === 'Breadcrumb') lines.push('const divider = separator === "chevron" ? "›" : "/"')
    if (name === 'Accordion') lines.push('const open = state === "expanded" ? "open" : ""')
    if (name === 'Tabs') lines.push('const selected = state === "active" ? "true" : "false"', 'const disabled = state === "disabled" ? "disabled" : ""')
    const metadata = [
      '// url=' + figmaURL + '?node-id=' + id.replace(':', '-'),
      '// source=' + sourceBase + (target === 'react' ? 'src/components/' + name + '/' + name + '.tsx' : config.source),
      '// component=' + (name === 'Navbar' ? 'Header' : name),
      'import figma from "figma"',
      'const instance = figma.selectedInstance',
    ]
    files.set('code-connect/' + target + '/' + name + '.figma.ts', [
      ...metadata, ...lines, '', 'export default {',
      '  example: figma.code' + String.fromCharCode(96) + example + String.fromCharCode(96) + ',',
      '  imports: ' + JSON.stringify(imports) + ',',
      // Keep published record identifiers stable when updating branding or snippets.
      '  id: ' + JSON.stringify('red-' + target + '-' + (variants[name] ?? slug(name))) + ',',
      '  metadata: { nestable: true },', '}', '',
    ].join('\n'))
  }
}

for (const [path, contents] of files) {
  const target = fileURLToPath(new URL('../' + path, import.meta.url))
  if (process.argv.includes('--check')) {
    if (await readFile(target, 'utf8') !== contents) throw new Error(path + ' is out of sync')
  } else {
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, contents)
  }
}
console.log(files.size - Object.keys(targets).length + ' Code Connect templates, with all Figma enum values represented.')
