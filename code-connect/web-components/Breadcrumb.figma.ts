// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=23-97
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/frameworks/web-components/elements.ts
// component=Breadcrumb
import figma from "figma"
const instance = figma.selectedInstance
const separator = instance.getEnum("Separator", {"Slash":"slash","Chevron":"chevron"})
const itemNode = instance.findText("Item")
const item = itemNode?.type === "TEXT" ? itemNode.textContent : ""
const divider = separator === "chevron" ? "›" : "/"

export default {
  example: figma.code`<relay-breadcrumb separator="${separator}"><a href="/">${item}</a><span aria-hidden="true">${divider}</span></relay-breadcrumb>`,
  imports: ["import { registerElements } from \"../../frameworks/web-components/elements\"","registerElements()"],
  id: "red-web-components-breadcrumb",
  metadata: { nestable: true },
}
