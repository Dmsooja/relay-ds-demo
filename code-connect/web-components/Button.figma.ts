// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=14-17
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/frameworks/web-components/elements.ts
// component=Button
import figma from "figma"
const instance = figma.selectedInstance
const label = instance.getString("Label")
const variant = instance.getEnum("Variant", {"Primary":"primary","Secondary":"secondary","Ghost":"ghost","Danger":"danger"})
const size = instance.getEnum("Size", {"Md":"md","Sm":"sm","Lg":"lg"})
const state = instance.getEnum("State", {"Default":"default","Hover":"hover","Focus visible":"focus-visible","Active":"active","Disabled":"disabled","Loading":"loading"})

export default {
  example: figma.code`<relay-button variant="${variant}" size="${size}" state="${state}">${label}</relay-button>`,
  imports: ["import { registerElements } from \"../../frameworks/web-components/elements\"","registerElements()"],
  id: "red-web-components-button",
  metadata: { nestable: true },
}
