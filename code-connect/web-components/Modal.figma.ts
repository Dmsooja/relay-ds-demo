// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=32-2
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/frameworks/web-components/elements.ts
// component=Modal
import figma from "figma"
const instance = figma.selectedInstance
const title = instance.getString("Title")
const content = instance.getSlot("Content")
const size = instance.getEnum("Size", {"Sm":"sm","Md":"md","Lg":"lg"})

export default {
  example: figma.code`<relay-modal size="${size}" label="${title}"><h2>${title}</h2>${content}</relay-modal>`,
  imports: ["import { registerElements } from \"../../frameworks/web-components/elements\"","registerElements()"],
  id: "red-web-components-modal",
  metadata: { nestable: true },
}
