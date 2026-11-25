// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=22-4
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/frameworks/web-components/elements.ts
// component=Footer
import figma from "figma"
const instance = figma.selectedInstance
const copyrightNode = instance.findText("Copyright")
const copyright = copyrightNode?.type === "TEXT" ? copyrightNode.textContent : ""

export default {
  example: figma.code`<relay-footer><small>${copyright}</small></relay-footer>`,
  imports: ["import { registerElements } from \"../../frameworks/web-components/elements\"","registerElements()"],
  id: "red-web-components-footer",
  metadata: { nestable: true },
}
