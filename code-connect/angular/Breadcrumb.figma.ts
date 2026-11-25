// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=23-97
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/frameworks/angular/src/components.ts
// component=Breadcrumb
import figma from "figma"
const instance = figma.selectedInstance
const separator = instance.getEnum("Separator", {"Slash":"slash","Chevron":"chevron"})
const itemNode = instance.findText("Item")
const item = itemNode?.type === "TEXT" ? itemNode.textContent : ""
const divider = separator === "chevron" ? "›" : "/"

export default {
  example: figma.code`<relay-ui kind="breadcrumb" separator="${separator}"><a href="/">${item}</a><span aria-hidden="true">${divider}</span></relay-ui>`,
  imports: ["import { RelayUIComponent } from \"../../frameworks/angular/src/components\""],
  id: "red-angular-breadcrumb",
  metadata: { nestable: true },
}
