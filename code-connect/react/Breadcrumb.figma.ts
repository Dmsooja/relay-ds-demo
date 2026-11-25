// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=23-97
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/src/components/Breadcrumb/Breadcrumb.tsx
// component=Breadcrumb
import figma from "figma"
const instance = figma.selectedInstance
const separator = instance.getEnum("Separator", {"Slash":"slash","Chevron":"chevron"})
const itemNode = instance.findText("Item")
const item = itemNode?.type === "TEXT" ? itemNode.textContent : ""
const divider = separator === "chevron" ? "›" : "/"

export default {
  example: figma.code`<Breadcrumb separator="${separator}"><a href="/">${item}</a><span aria-hidden="true">${divider}</span></Breadcrumb>`,
  imports: ["import { Breadcrumb } from \"@sc-demo/relay-ds-demo\""],
  id: "red-react-breadcrumb",
  metadata: { nestable: true },
}
