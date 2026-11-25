import { componentNode } from './ui.mjs'

export function applyAttributes(element, attrs) {
  for (const [name, value] of Object.entries(attrs)) {
    if (value === false || value == null || name === 'html') continue
    element.setAttribute(name, value === true ? '' : String(value))
  }
  if (attrs.html) element.innerHTML = attrs.html // Only fixed, locally-authored icon markup.
  if (element instanceof HTMLSelectElement && attrs.value != null) {
    for (const option of element.options) option.defaultSelected = option.value === String(attrs.value)
    element.value = String(attrs.value)
  }
}

export function renderDom(nodes, renderComponent) {
  return nodes.map(node => {
    if (typeof node !== 'object') return document.createTextNode(String(node))
    const children = renderDom(node.children, renderComponent)
    if (node.designSystem) return renderComponent(node.tag, node.attrs, children)
    const element = document.createElement(node.tag)
    element.append(...children)
    applyAttributes(element, node.attrs)
    return element
  })
}

export function renderSemantic(name, attrs, children) {
  const node = componentNode(name, attrs, [])
  const element = document.createElement(node.tag)
  element.append(...children)
  applyAttributes(element, node.attrs)
  if (name === 'alert' && attrs.dismissible) {
    const dismiss = document.createElement('button')
    dismiss.type = 'button'
    dismiss.className = 'rd-link'
    dismiss.textContent = 'Dismiss'
    dismiss.addEventListener('click', () => { element.hidden = true })
    element.append(dismiss)
  }
  return element
}
