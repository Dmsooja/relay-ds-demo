import { createElement, useLayoutEffect, useRef, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import { components } from './components'
import { reactTree, type SiteNode } from './react-renderer'
import { mountBehavior } from '../shared/behavior.mjs'
import { site } from '../shared/site.mjs'
import '../shared/tokens.css'
import '../shared/styles.css'

function App() {
  const root = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => mountBehavior(root.current!), [])
  return createElement('div', { ref: root }, ...reactTree(site(location.pathname, location.search) as SiteNode[], (node, children, key) => {
    const Component = components[node.tag as keyof typeof components] as ComponentType<Record<string, unknown>>
    const { class: className, ...props } = node.attrs
    return createElement(Component, { ...props, className: typeof className === 'string' ? className : undefined, key }, ...children)
  }))
}

createRoot(document.querySelector('#app')!).render(createElement(App))
