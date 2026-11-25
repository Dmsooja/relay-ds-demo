import { createElement, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { registerElements, type RelayElement } from '../web-components/elements'
import { reactTree, type ElementNode, type SiteNode } from '../../src/react-renderer'
import { site } from '../../shared/site.mjs'
import { mountBehavior } from '../../shared/behavior.mjs'
import { applyAttributes, renderSemantic } from '../../shared/dom.mjs'
import '../../shared/tokens.css'
import '../../shared/styles.css'

registerElements()

function WebComponent({ node, children }: { node: ElementNode; children: ReactNode }) {
  const ref = useRef<RelayElement>(null)
  const [control] = useState(() => renderSemantic(node.tag, node.attrs, []))
  useLayoutEffect(() => {
    if (control instanceof HTMLSelectElement) applyAttributes(control, node.attrs)
    ref.current!.mountControl(control)
  }, [control, node])
  return createElement(`relay-${node.tag}`, { ref, 'data-react-host': '' }, createPortal(children, control))
}

function App() {
  const root = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => mountBehavior(root.current!), [])
  return createElement('div', { ref: root }, ...reactTree(site(location.pathname, location.search) as SiteNode[],
    (node, children, key) => createElement(WebComponent, { node, key, children })))
}

createRoot(document.querySelector('#app')!).render(createElement(App))
