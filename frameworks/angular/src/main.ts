import { ApplicationRef, Component, ElementRef, createComponent, inject, type AfterViewInit, type OnDestroy } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import { renderDom, renderSemantic } from '../../../shared/dom.mjs'
import { mountBehavior } from '../../../shared/behavior.mjs'
import { site } from '../../../shared/site.mjs'
import { RelayUIComponent } from './components'

@Component({ selector: 'relay-app', standalone: true, template: '' })
export class RelayApp implements AfterViewInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private readonly application = inject(ApplicationRef)
  private readonly views: Array<ReturnType<typeof createComponent<RelayUIComponent>>> = []
  private cleanup?: () => void

  ngAfterViewInit() {
    const nodes = renderDom(site(location.pathname, location.search), (name: string, attrs: Record<string, unknown>, children: Node[]) => {
      const element = renderSemantic(name, attrs, children)
      const ref = createComponent(RelayUIComponent, {
        environmentInjector: this.application.injector,
        projectableNodes: [[element]],
      })
      this.views.push(ref)
      this.application.attachView(ref.hostView)
      ref.changeDetectorRef.detectChanges()
      return ref.location.nativeElement as HTMLElement
    })
    this.host.append(...nodes)
    this.cleanup = mountBehavior(this.host)
  }

  ngOnDestroy() {
    this.cleanup?.()
    for (const ref of this.views) ref.destroy()
  }
}

void bootstrapApplication(RelayApp).catch(console.error)
