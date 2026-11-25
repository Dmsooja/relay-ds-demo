// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=15-2
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/frameworks/web-components/elements.ts
// component=Link
import figma from "figma"
const instance = figma.selectedInstance
const label = instance.getString("Label")
const variant = instance.getEnum("Variant", {"Default":"default","Subtle":"subtle"})
const state = instance.getEnum("State", {"Default":"default","Hover":"hover","Focus visible":"focus-visible"})

export default {
  example: figma.code`<relay-link variant="${variant}" state="${state}" href="/">${label}</relay-link>`,
  imports: ["import { registerElements } from \"../../frameworks/web-components/elements\"","registerElements()"],
  id: "red-web-components-link",
  metadata: { nestable: true },
}
