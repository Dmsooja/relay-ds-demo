import { Component, ElementRef, Input, ViewEncapsulation, inject, type AfterViewInit } from '@angular/core'
import { renderSemantic } from '../../../shared/dom.mjs'

@Component({
  selector: 'relay-ui',
  standalone: true,
  template: '<ng-content />',
  host: { 'data-relay-host': '' },
  encapsulation: ViewEncapsulation.None,
})
export class RelayUIComponent implements AfterViewInit {
  @Input() kind = ''
  @Input() variant?: string
  @Input() size?: string
  @Input() state?: string
  @Input() href?: string
  @Input() value?: string
  @Input() placeholder?: string
  @Input() label?: string
  @Input() separator?: string
  @Input() columns?: string
  @Input() dismissible?: boolean
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement

  ngAfterViewInit() {
    if (!this.kind) return // The site prepares its semantic content before projection.
    const { kind, variant, size, state, href, value, placeholder, label, separator, columns, dismissible } = this
    const attrs = { variant, size, state, href, value, placeholder, label, separator, columns, dismissible }
    this.host.replaceChildren(renderSemantic(kind, attrs, [...this.host.childNodes]))
  }
}
