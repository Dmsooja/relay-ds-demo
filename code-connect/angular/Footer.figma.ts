// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=22-4
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/frameworks/angular/src/components.ts
// component=Footer
import figma from "figma"
const instance = figma.selectedInstance
const copyrightNode = instance.findText("Copyright")
const copyright = copyrightNode?.type === "TEXT" ? copyrightNode.textContent : ""

export default {
  example: figma.code`<relay-ui kind="footer"><small>${copyright}</small></relay-ui>`,
  imports: ["import { RelayUIComponent } from \"../../frameworks/angular/src/components\""],
  id: "red-angular-footer",
  metadata: { nestable: true },
}
