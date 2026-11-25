import { createElement, type ReactNode } from 'react'
import { toReactAttrs } from './components'

export type ElementNode = {
  tag: string
  attrs: Record<string, unknown>
  children: SiteNode[]
  designSystem?: boolean
}
export type SiteNode = ElementNode | string | number
type RenderComponent = (node: ElementNode, children: ReactNode[], key: number) => ReactNode

export function reactTree(nodes: SiteNode[], component: RenderComponent): ReactNode[] {
  return nodes.map((node, key) => {
    if (typeof node !== 'object') return node
    const children = reactTree(node.children, component)
    if (node.designSystem) return component(node, children, key)
    return createElement(node.tag, { ...toReactAttrs(node.attrs, node.tag), key }, ...children)
  })
}
