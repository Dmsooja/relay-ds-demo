import { componentNames } from '../../shared/ui.mjs'
import { renderSemantic } from '../../shared/dom.mjs'

type Props = Record<string, unknown>

export class RelayElement extends HTMLElement {
  #content?: Node[]
  #props?: Props
  #rendered = false

  configure(props: Props, content: Node[]) {
    this.#props = props
    this.#content = content
    if (this.isConnected) this.#render()
  }

  mountControl(control: HTMLElement) {
    this.setAttribute('data-relay-host', '')
    this.replaceChildren(control)
    this.#rendered = true
  }

  connectedCallback() {
    if (!this.#rendered && !this.hasAttribute('data-react-host')) this.#render()
  }

  #render() {
    const props = this.#props ?? Object.fromEntries(this.getAttributeNames().map(name => [
      name, ['disabled', 'required', 'hidden', 'open'].includes(name) ? true : this.getAttribute(name),
    ]))
    const children = this.#content ?? [...this.childNodes]
    const control = renderSemantic(this.localName.slice('relay-'.length), props, children)
    for (const name of ['id', 'role', 'tabindex', 'aria-label', 'aria-labelledby', 'aria-describedby']) this.removeAttribute(name)
    this.mountControl(control)
  }
}

export function registerElements() {
  for (const name of componentNames) {
    const tag = `relay-${name}`
    if (!customElements.get(tag)) customElements.define(tag, class extends RelayElement {})
  }
}

export function webComponent(name: string, attrs: Props, children: Node[]) {
  const element = document.createElement(`relay-${name}`) as RelayElement
  element.configure(attrs, children)
  return element
}
