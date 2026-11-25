// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=28-2
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/frameworks/web-components/elements.ts
// component=List
import figma from "figma"
const instance = figma.selectedInstance
const variant = instance.getEnum("Variant", {"Default":"default","Icon":"icon","Bordered":"bordered","Ordered":"ordered"})
const size = instance.getEnum("Size", {"Md":"md","Sm":"sm"})
const itemNode = instance.findText("Content")
const item = itemNode?.type === "TEXT" ? itemNode.textContent : ""

export default {
  example: figma.code`<relay-list variant="${variant}" size="${size}"><li>${item}</li></relay-list>`,
  imports: ["import { registerElements } from \"../../frameworks/web-components/elements\"","registerElements()"],
  id: "red-web-components-list",
  metadata: { nestable: true },
}
