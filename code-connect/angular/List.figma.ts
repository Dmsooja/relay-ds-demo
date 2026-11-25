// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=28-2
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/frameworks/angular/src/components.ts
// component=List
import figma from "figma"
const instance = figma.selectedInstance
const variant = instance.getEnum("Variant", {"Default":"default","Icon":"icon","Bordered":"bordered","Ordered":"ordered"})
const size = instance.getEnum("Size", {"Md":"md","Sm":"sm"})
const itemNode = instance.findText("Content")
const item = itemNode?.type === "TEXT" ? itemNode.textContent : ""

export default {
  example: figma.code`<relay-ui kind="list" variant="${variant}" size="${size}"><li>${item}</li></relay-ui>`,
  imports: ["import { RelayUIComponent } from \"../../frameworks/angular/src/components\""],
  id: "red-angular-list",
  metadata: { nestable: true },
}
