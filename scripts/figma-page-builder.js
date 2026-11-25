// This script runs inside Figma's Plugin API via use_figma.
// Payload is supplied by scripts/prepare-figma-pages.mjs.
async function buildRelayPages(payload) {
  const page = await figma.getNodeByIdAsync('83:419')
  await figma.setCurrentPageAsync(page)
  const dest = await figma.getNodeByIdAsync('2012:155')
  if (dest?.type !== 'SECTION') throw new Error('Pages destination is not a section')
  const names = dest.children.map(n => n.name)
  if (payload.screens.some(s => names.includes(s.name))) throw new Error('A requested screen already exists. Read the ledger before retrying.')
  const variables = await figma.variables.getLocalVariablesAsync()
  const byName = new Map(variables.map(v => [v.name, v]))
  const collections = await figma.variables.getLocalVariableCollectionsAsync()
  const baseColor = collections.find(c => c.name === 'Color')
  const themeCollection = collections.find(c => c.name === payload.theme)
  if (!baseColor || !themeCollection) throw new Error('Theme collections not available')
  const varMap = {}
  for (const [role, name] of Object.entries(payload.tokens)) {
    const variable = byName.get(name)
    if (!variable) throw new Error('Missing mapped variable ' + name)
    varMap[role] = $fig.getVar(variable.id)
  }
  const round = n => Math.round(n * 100) / 100
  const colorKey = value => {
    if (!value || value === 'transparent') return null
    const nums = value.match(/[\d.]+/g)?.map(Number)
    if (!nums || nums.length < 3) return null
    if (value.startsWith('color(')) return nums.slice(0, 3).map(n => Math.round(n * 255)).join(',')
    return nums.slice(0, 3).map(Math.round).join(',')
  }
  function paint(value) {
    const key = colorKey(value)
    const alpha = value?.startsWith('rgba') ? Number(value.match(/[\d.]+/g)?.[3] ?? 1) : 1
    if (!key || alpha === 0) return []
    const role = payload.colors[key]
    const literal = figma.util.rgb('#' + key.split(',').map(n => Number(n).toString(16).padStart(2, '0')).join(''))
    return [{ type: 'SOLID', color: role && alpha === 1 ? varMap[role] : literal, opacity: alpha }]
  }
  const spacing = new Map(payload.spacing.map(([value, name]) => [value, $fig.getVar(byName.get(name).id)]))
  const radii = new Map(payload.radii.map(([value, name]) => [value, $fig.getVar(byName.get(name).id)]))
  const nval = value => spacing.get(Math.round(value * 100) / 100) ?? value
  const patterns = new Map(Object.entries(payload.patterns ?? {}))
  const newPatterns = {}
  const pendingCards = []
  const pendingControls = []
  const pendingText = []
  const pendingPatterns = []
  const icons = new Map(Object.entries(payload.icons ?? {}))
  const newIcons = {}
  const roots = []

  function nodeProps(node, parentBox) {
    const s = payload.styles[node.s]
    return {
      name: node.name,
      x: round(node.b[0] - parentBox[0]), y: round(node.b[1] - parentBox[1]),
      width: Math.max(1, node.b[2]), height: Math.max(1, node.b[3]),
      layoutSizingHorizontal: 'FIXED', layoutSizingVertical: 'FIXED',
      fills: paint(s.bg), strokes: s.bw ? paint(s.bc) : [],
      strokeWeight: s.bw || 0, cornerRadius: radii.get(s.r) ?? s.r,
      clipsContent: false, effects: [],
    }
  }

  function text(node, parentBox) {
    const s = payload.styles[node.s]
    const style = s.fw >= 750 ? 'Extra Bold' : s.fw >= 680 ? 'Bold' : s.fw >= 550 ? 'Semi Bold' : s.fw >= 450 ? 'Medium' : 'Regular'
    const props = {
      name: node.text.slice(0, 60), characters: node.lines || node.text,
      x: round(node.b[0] - parentBox[0]), y: round(node.b[1] - parentBox[1]),
      width: Math.max(1, node.b[2] + .25), height: Math.max(1, node.b[3]),
      fontName: { family: 'Inter', style }, fontSize: s.fs,
      lineHeight: { unit: 'PIXELS', value: s.lh },
      letterSpacing: { unit: 'PIXELS', value: s.ls }, fills: paint(s.color),
      textAlignHorizontal: s.ta === 'center' ? 'CENTER' : s.ta === 'right' ? 'RIGHT' : 'LEFT',
      textAlignVertical: /workspace-team|workspace-avatar|profile-avatar|owner-avatar/.test(node.name) ? 'CENTER' : 'TOP',
      textAutoResize: 'WIDTH_AND_HEIGHT',
    }
    const plan = $fig.text(props)
    if (/workspace-team|workspace-avatar|profile-avatar|owner-avatar/.test(node.name)) plan.set({textAlignHorizontal:'CENTER'})
    pendingText.push({plan, props})
    return plan
  }

  function makeFrame(node, parentBox, component = false) {
    const opts = nodeProps(node, parentBox)
    const children = node.c ?? []
    const boxes = children.map(c => c.b)
    // Match browser flow with auto layout when all children form one row or column.
    const vertical = children.length > 0 && boxes.every((b, i) => i === 0 || b[1] >= boxes[i - 1][1] + boxes[i - 1][3] - 1)
    const horizontal = !vertical && children.length > 0 && boxes.every((b, i) => i === 0 || b[0] >= boxes[i - 1][0] + boxes[i - 1][2] - 1)
    const alignmentAxis = vertical ? 0 : 1
    const aligned = boxes.every(b => Math.abs(b[alignmentAxis] - boxes[0][alignmentAxis]) < 1)
    const gaps = boxes.slice(1).map((b, i) => vertical ? b[1] - boxes[i][1] - boxes[i][3] : b[0] - boxes[i][0] - boxes[i][2])
    const equalGaps = gaps.every(g => Math.abs(g - (gaps[0] ?? 0)) < 1)
    const flow = (vertical || horizontal) && aligned && equalGaps
    if (flow) {
      opts.layoutMode = vertical ? 'VERTICAL' : 'HORIZONTAL'
      opts.paddingLeft = nval(Math.max(0, round(boxes[0][0] - node.b[0])))
      opts.paddingTop = nval(Math.max(0, round(boxes[0][1] - node.b[1])))
      opts.paddingRight = 0
      opts.paddingBottom = 0
      opts.itemSpacing = nval(Math.max(0, round(gaps[0] ?? 0)))
    }
    // CSS grids and wrapping inline content retain their measured responsive geometry.
    const built = children.map(child => build(child, node.b))
    const frame = component ? $fig.component(opts, built) : flow ? $fig.autoLayout(opts, built) : $fig.frame(opts, built)
    return frame
  }

  function build(node, parentBox, ignorePattern = false) {
    const s = payload.styles[node.s]
    const opts = nodeProps(node, parentBox)
    if (node.svg || node.logo) {
      const svg = node.logo ? '<svg width="29" height="29" viewBox="0 0 29 29" xmlns="http://www.w3.org/2000/svg"><rect width="29" height="29" rx="8" fill="#ec0900"/><path d="m7 16 10-10M14 20l7-7" stroke="white" stroke-width="4" stroke-linecap="round"/></svg>' : node.svg
      const key = node.logo ? 'Relay brand mark' : node.name
      let id = icons.get(key)
      if (!id) {
        const main = $fig.svgComponent(svg, { name: 'Relay / ' + key, x: -2200, y: -1000 - icons.size * 50, width: opts.width, height: opts.height })
        icons.set(key, main)
        newIcons[key] = main
        id = main
      }
      const instance = $fig.instance(id, { name: key, x: opts.x, y: opts.y, width: opts.width, height: opts.height })
      pendingPatterns.push({ plan: instance, svg: true, color: node.logo ? 'brand' : s.color })
      return instance
    }
    if (node.pattern && !ignorePattern) {
      const key = node.pattern
      let main = patterns.get(key)
      if (!main) {
        main = makeFrame(node, [node.b[0] + 1900, node.b[1] + 1600 + patterns.size * 40], true)
        main.set({ name: 'Relay / ' + node.patternName })
        patterns.set(key, main)
        newPatterns[key] = main
      }
      return $fig.instance(main, { ...opts, name: node.patternName })
    }
    const props = node.ui
    if (props?.kind === 'Link' && node.c?.some(child => child.svg)) {
      return makeFrame({ ...node, ui: undefined, c: node.c.map(child => child.k === 'text'
        ? { ...child, ui: { ...props }, name: 'Navigation label' } : child) }, parentBox)
    }
    if (props?.kind === 'Card') {
      const instance = $fig.instance('24:7', {
        ...opts, props: { Variant: 'Default', Header: '' },
        layoutMode: 'VERTICAL', itemSpacing: 0, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0,
      })
      const content = makeFrame({ ...node, name: 'Content', ui: undefined, pattern: undefined, s: payload.transparentStyle }, node.b)
      pendingCards.push({ plan: instance, content, w: node.b[2], h: node.b[3] })
      return instance
    }
    if (props && ['Button', 'Link', 'Badge'].includes(props.kind)) {
      const ids = { Button: '14:17', Link: '15:2', Badge: '29:17' }
      const label = node.text ?? node.c?.map(n => n.text ?? '').join(' ') ?? ''
      const instance = $fig.instance(ids[props.kind], { ...opts,
        props: props.kind === 'Badge'
          ? { Variant: props.variant, Size: 'Md', Label: label }
          : props.kind === 'Link'
            ? { Variant: 'Default', State: 'Default', Label: label }
            : { Variant: props.variant, Size: 'Md', State: 'Default', Label: label },
        paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0,
        primaryAxisAlignItems: s.ta === 'left' && props.kind !== 'Button' ? 'MIN' : 'CENTER', counterAxisAlignItems: 'CENTER',
      })
      pendingControls.push({ plan: instance, s, label, kind: props.kind, active: props.active, children: node.c, box: node.b, opts })
      return instance
    }
    if (props && ['Input', 'Select'].includes(props.kind)) {
      const id = props.kind === 'Input' ? '16:17' : '17:4'
      const value = node.c?.find(n => n.text)?.text ?? ''
      const instance = $fig.instance(id, { ...opts, props: props.kind === 'Input'
        ? { State: 'Default', Label: '', Error: '', Placeholder: value, Value: '' }
        : { State: 'Default', Label: '', Error: '', Value: value },
        paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0, itemSpacing: 0,
        layoutMode: 'VERTICAL',
      })
      pendingControls.push({ plan: instance, s, label: value, kind: props.kind, box: node.b, opts })
      return instance
    }
    if (node.k === 'text' && !s.bw && !s.r && paint(s.bg).length === 0) return text(node, parentBox)
    if (node.k === 'text') {
      const child = { ...node, ui: undefined, c: undefined, s: payload.textStyles[node.s], b: [...node.b], k: 'text' }
      return makeFrame({ ...node, k: 'frame', text: undefined, c: [child] }, parentBox)
    }
    return makeFrame(node, parentBox)
  }

  for (const screen of payload.screens) {
    const plan = build(screen.tree, screen.tree.b)
    plan.set({ name: screen.name, x: screen.x, y: screen.y, fills: paint('rgb(255,255,255)'), clipsContent: true })
    $fig.get(dest.id).append(plan)
    roots.push(plan)
  }
  await $fig.done()

  for (const item of pendingControls) {
    const real = item.plan.node
    const s = item.s
    $fig.get(real.id).set({ ...item.opts, layoutSizingHorizontal: 'FIXED', layoutSizingVertical: 'FIXED', effects: [] })
    const texts = real.query('TEXT').toArray()
    if (item.kind === 'Input' || item.kind === 'Select') {
      for (const child of real.children) if (child.type === 'TEXT') $fig.get(child.id).set({ visible: false })
      const control = real.children.find(c => c.type === 'FRAME')
      if (control) {
        $fig.get(control.id).set({ width: item.box[2], height: item.box[3], layoutSizingHorizontal: 'FIXED', layoutSizingVertical: 'FIXED',
          paddingLeft: 12, paddingRight: 12, paddingTop: 0, paddingBottom: 0, counterAxisAlignItems: 'CENTER',
          fills: paint(s.bg), strokes: paint(s.bc), strokeWeight: s.bw, cornerRadius: s.r })
      }
    }
    for (const layer of texts) {
      if ((item.kind === 'Input' || item.kind === 'Select') && (layer.name === 'Label' || layer.name === 'Error')) continue
      $fig.get(layer.id).set({ fontName: { family: 'Inter', style: s.fw >= 650 ? 'Bold' : s.fw >= 550 ? 'Semi Bold' : 'Regular' },
        fontSize: s.fs, lineHeight: { unit: 'PIXELS', value: s.lh }, letterSpacing: { unit: 'PIXELS', value: s.ls },
        fills: paint(s.color), textAutoResize: 'WIDTH_AND_HEIGHT',
        textDecoration: item.kind === 'Link' && item.active ? 'UNDERLINE' : 'NONE' })
    }
  }
  await $fig.done()
  for (const item of pendingText) {
    const actual = item.plan.node
    const factor = Math.min(1, item.props.width / Math.max(1, actual.width))
    item.plan.set({
      fontSize: item.props.fontSize * factor,
      textAutoResize: 'NONE', width: item.props.width, height: item.props.height,
      x: item.props.x, y: item.props.y,
    })
  }
  await $fig.done()
  for (const root of roots) {
    root.node.setExplicitVariableModeForCollection(themeCollection, themeCollection.modes[0].modeId)
  }
  // Bind reusable icon geometry to theme colors.
  for (const item of pendingPatterns) {
    if (!item.svg) continue
    const real = item.plan.node
    const vectors = real.query('VECTOR, RECTANGLE').toArray()
    for (const vector of vectors) {
      const role = item.color === 'brand' ? 'action' : payload.colors[colorKey(item.color)]
      if (!role) continue
      const p = [{ type: 'SOLID', color: varMap[role] }]
      if (vector.fills?.length) $fig.get(vector.id).set({ fills: p })
      if (vector.strokes?.length && item.color !== 'brand') $fig.get(vector.id).set({ strokes: p })
    }
  }
  await $fig.done()
  // Apply descendant overrides before slot reparenting changes instance IDs.
  for (const card of pendingCards) {
    const real = card.plan.node
    const slot = real.query('SLOT').first()
    if (!slot) throw new Error('Card Content slot not available')
    for (const child of real.children) if (child.id !== slot.id) $fig.get(child.id).set({ visible: false })
    for (const child of slot.children) $fig.get(child.id).remove()
    $fig.get(slot.id).set({ width: card.w, height: card.h, layoutSizingHorizontal: 'FIXED', layoutSizingVertical: 'FIXED',
      layoutMode: 'VERTICAL', paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0, itemSpacing: 0, fills: [], clipsContent: false })
    $fig.get(slot.id).append(card.content)
  }
  await $fig.done()
  return {
    roots: roots.map((plan, index) => ({
      id: plan.id, name: payload.screens[index].name, width: plan.node.width, height: plan.node.height,
      instances: plan.node.query('INSTANCE').length, texts: plan.node.query('TEXT').length,
      frames: plan.node.query('FRAME').length,
    })),
    patterns: Object.fromEntries(Object.entries(newPatterns).map(([key, value]) => [key, value.id])),
    icons: Object.fromEntries(Object.entries(newIcons).map(([key, value]) => [key, value.id])),
    slotCount: pendingCards.length,
  }
}
