async function finishRelayPages(ledger) {
  const page = await figma.getNodeByIdAsync('83:419')
  await figma.setCurrentPageAsync(page)
  const roots = await Promise.all(ledger.screens.map(screen => figma.getNodeByIdAsync(screen.id)))
  if (roots.length !== 24 || roots.some(root => !root)) throw new Error('Expected all 24 page frames')
  const find = name => roots.find(root => root.name === name)
  const inputs = []
  const patched = []
  for (const root of roots) {
    for (const field of root.query('INSTANCE[name=rd-input]').toArray()) {
      const control = field.children.find(child => child.type === 'FRAME')
      if (!control) continue
      $fig.get(control.id).set({
        width: Math.max(1, field.width - 2), height: Math.max(1, field.height - 2),
        layoutSizingHorizontal: 'FIXED', layoutSizingVertical: 'FIXED',
        paddingLeft: 12, paddingRight: 12, paddingTop: 0, paddingBottom: 0,
        fills: [], strokes: [], strokeWeight: 0, cornerRadius: 0,
        counterAxisAlignItems: 'CENTER', primaryAxisAlignItems: 'MIN',
      })
      inputs.push({ id: field.id, controlId: control.id, w: field.width, h: field.height })
    }
    for (const details of root.query('FRAME[name=details]').toArray()) {
      for (const child of details.children.slice(1)) $fig.get(child.id).set({ visible: false })
    }
    for (const text of root.query('TEXT').toArray()) {
      if (text.letterSpacing.unit === 'PIXELS' && text.letterSpacing.value > .5) {
        $fig.get(text.id).set({ characters: text.characters.toUpperCase() })
      }
      const parent = text.parent
      if (parent.type === 'INSTANCE' && ['rd-link', 'Navigation label'].includes(parent.name)) {
        const rootY = root.absoluteTransform[1][2]
        const localY = text.absoluteTransform[1][2] - rootY
        const label = root.name.split(' / ')[0]
        $fig.get(text.id).set({ textDecoration: localY < 100 && text.characters.trim() === label ? 'UNDERLINE' : 'NONE' })
      }
    }
    for (const window of root.query('FRAME[name=product-window], FRAME[name=product-rows]').toArray()) {
      $fig.get(window.id).set({ clipsContent: true })
    }
    patched.push(root.id)
  }
  await $fig.done()

  const dest = await figma.getNodeByIdAsync('2012:155')
  const labels = [
    ['RED · DESKTOP · 1440 PX', 60],
    ['BLUE · DESKTOP · 1440 PX', 2560],
    ['RED · MOBILE · 390 PX', 5160],
    ['BLUE · MOBILE · 390 PX', 8360],
  ]
  for (const [characters, y] of labels) {
    if (!dest.children.some(n => n.name === characters)) $fig.get(dest.id).append($fig.text({
      name: characters, characters, x: 100, y, fontName: { family: 'Inter', style: 'Bold' }, fontSize: 24,
      fills: [{ type: 'SOLID', color: $fig.getVar('VariableID:2028:13') }],
    }))
  }
  const existingSupport = page.children.find(n => n.name === 'Relay / Page building blocks')
  if (existingSupport) throw new Error('Supporting section already exists')
  const ids = [...new Set([...Object.values(ledger.patterns), ...Object.values(ledger.icons)])]
  const assets = await Promise.all(ids.map(id => figma.getNodeByIdAsync(id)))
  let y = 110
  const entries = []
  for (const asset of assets.filter(Boolean)) {
    entries.push({ asset, y })
    y += Math.max(44, asset.height) + 65
  }
  const support = $fig.section({ name: 'Relay / Page building blocks', x: 10600, y: 2030, width: 1640, height: y + 40,
    fills: [{ type: 'SOLID', color: figma.util.rgb('#f1f3f7') }] }, [
    $fig.text({ characters: 'Relay / Reusable page compositions', name: 'Section title', x: 60, y: 40,
      fontName: { family: 'Inter', style: 'Bold' }, fontSize: 28, fills: [{ type: 'SOLID', color: $fig.getVar('VariableID:2028:13') }] }),
  ])
  for (const { asset, y } of entries) {
    $fig.get(asset.id).moveTo(support)
    $fig.get(asset.id).set({ x: 60, y })
  }
  $fig.get('2012:156').set({ y: Math.max(14000, y + 2030 + 500) })
  await $fig.done()
  return { patched, inputs, support: { id: support.id, height: support.node.height, assetCount: ids.length }, labels: labels.map(l => l[0]) }
}
