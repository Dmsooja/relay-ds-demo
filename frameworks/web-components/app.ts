import { registerElements, webComponent } from './elements'
import { renderDom } from '../../shared/dom.mjs'
import { site } from '../../shared/site.mjs'
import { mountBehavior } from '../../shared/behavior.mjs'
import '../../shared/tokens.css'
import '../../shared/styles.css'

registerElements()
const root = document.querySelector('#app')!
root.replaceChildren(...renderDom(site(location.pathname, location.search), webComponent))
mountBehavior(root)
