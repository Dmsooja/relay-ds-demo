// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=35-8
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/frameworks/angular/src/components.ts
// component=FeatureGrid
import figma from "figma"
const instance = figma.selectedInstance
const title = instance.getString("Title")
const items = instance.getSlot("Items")
const columns = instance.getEnum("Columns", {"Two":"two","Three":"three","Four":"four"})

export default {
  example: figma.code`<relay-ui kind="feature-grid" columns="${columns}"><h2>${title}</h2>${items}</relay-ui>`,
  imports: ["import { RelayUIComponent } from \"../../frameworks/angular/src/components\""],
  id: "red-angular-feature-grid",
  metadata: { nestable: true },
}
