import { createElement, type ReactNode, type HTMLAttributes, type InputHTMLAttributes, type SelectHTMLAttributes, type Ref } from 'react'
import { componentNode } from '../../shared/ui.mjs'

type NativeProps<T extends HTMLElement> = T extends HTMLInputElement ? InputHTMLAttributes<HTMLInputElement>
  : T extends HTMLSelectElement ? SelectHTMLAttributes<HTMLSelectElement> : HTMLAttributes<T>
export type ComponentProps<T extends HTMLElement = HTMLElement> = NativeProps<T> & {
  children?: ReactNode; className?: string; ref?: Ref<T>; [key: string]: unknown
}

const attributeNames: Record<string, string> = {
  class: 'className', for: 'htmlFor', tabindex: 'tabIndex', autocomplete: 'autoComplete', maxlength: 'maxLength',
}

export function toReactAttrs(attrs: Record<string, unknown>, tag: string) {
  return Object.fromEntries(Object.entries(attrs).flatMap(([key, value]) => {
    if (key === 'html') return [['dangerouslySetInnerHTML', { __html: value }]]
    if (key === 'value' && ['input', 'select', 'textarea'].includes(tag)) return [['defaultValue', value]]
    return [[attributeNames[key] ?? key, value]]
  }))
}

export function designComponent<T extends HTMLElement = HTMLElement>(name: string) {
  return function DesignComponent({ children, className, ...props }: ComponentProps<T>) {
    const node = componentNode(name, { ...props, class: className }, [])
    const dismiss = name === 'alert' && props.dismissible
      ? createElement('button', {
        className: 'rd-link',
        type: 'button',
        onClick: event => { event.currentTarget.closest<HTMLElement>('.rd-alert')!.hidden = true },
      }, 'Dismiss')
      : undefined
    const attrs = toReactAttrs(node.attrs, node.tag)
    if (name === 'input' && props.error) attrs['aria-invalid'] = true
    if (node.tag === 'input') return createElement(node.tag, attrs)
    return dismiss ? createElement(node.tag, attrs, children, dismiss) : createElement(node.tag, attrs, children)
  }
}
