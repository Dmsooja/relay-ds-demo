export const el = (tag, attrs, ...children) => ({
  tag, attrs: attrs ?? {}, children: children.flat(Infinity).filter(child => child != null && child !== false),
})

const styles = {
  button: 'rd-button', link: 'rd-link', badge: 'rd-badge', card: 'rd-card', header: 'rd-header',
  footer: 'rd-footer', hero: 'rd-hero', 'cta-banner': 'rd-cta', 'feature-grid': 'rd-feature-grid',
  'form-field': 'rd-field', input: 'rd-input', select: 'rd-input', alert: 'rd-alert', list: 'rd-list',
  tabs: 'rd-tabs', accordion: 'rd-accordion', breadcrumb: 'rd-breadcrumb', modal: 'rd-modal',
}
export const componentNames = Object.keys(styles)

export function componentNode(name, props, children) {
  const { variant, size, state, columns, separator, dismissible, label, class: customClass, ...attrs } = props
  const classes = [styles[name], variant && `is-${variant}`, size && `size-${size}`, state && `state-${state}`,
    columns && `cols-${columns}`, separator && `separator-${separator}`, customClass].filter(Boolean).join(' ')
  let tag = { header: 'header', footer: 'footer', hero: 'section', 'cta-banner': 'section', card: 'article',
    badge: 'span', link: 'a', 'form-field': 'div', input: 'input', select: 'select', list: 'ul',
    accordion: 'div', breadcrumb: 'nav', modal: 'dialog' }[name] ?? 'div'
  if (name === 'button') {
    if (state === 'disabled' || state === 'loading') attrs.disabled = true
    if (state === 'loading') attrs['aria-busy'] = 'true'
    tag = attrs.href && !attrs.disabled ? 'a' : 'button'
    if (tag === 'a') delete attrs.type
    else {
      delete attrs.href
      attrs.type ??= 'button'
    }
  }
  if (name === 'list' && variant === 'ordered') tag = 'ol'
  if (label && ['input', 'select', 'modal'].includes(name)) attrs['aria-label'] = label
  if (['input', 'select'].includes(name) && state === 'disabled') attrs.disabled = true
  if (['input', 'select'].includes(name) && state === 'error') attrs['aria-invalid'] = 'true'
  return el(tag, { ...attrs, class: classes }, children)
}

export const ui = (name, attrs, ...children) => ({ ...el(name, attrs, children), designSystem: true })
