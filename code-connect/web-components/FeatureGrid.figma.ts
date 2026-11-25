// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=35-8
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/frameworks/web-components/elements.ts
// component=FeatureGrid
import figma from "figma"
const instance = figma.selectedInstance
const title = instance.getString("Title")
const items = instance.getSlot("Items")
const columns = instance.getEnum("Columns", {"Two":"two","Three":"three","Four":"four"})

export default {
  example: figma.code`<relay-feature-grid columns="${columns}"><h2>${title}</h2>${items}</relay-feature-grid>`,
  imports: ["import { registerElements } from \"../../frameworks/web-components/elements\"","registerElements()"],
  id: "red-web-components-feature-grid",
  metadata: { nestable: true },
}
