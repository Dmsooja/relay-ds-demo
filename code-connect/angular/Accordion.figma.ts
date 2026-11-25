// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=24-39
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/frameworks/angular/src/components.ts
// component=Accordion
import figma from "figma"
const instance = figma.selectedInstance
const variant = instance.getEnum("Variant", {"Default":"default","Multi":"multi"})
const state = instance.getEnum("State", {"Collapsed":"collapsed","Expanded":"expanded","Hover":"hover","Focus visible":"focus-visible","Disabled":"disabled"})
const summaryNode = instance.findText("Header")
const summary = summaryNode?.type === "TEXT" ? summaryNode.textContent : ""
const detailNode = instance.findText("Body")
const detail = detailNode?.type === "TEXT" ? detailNode.textContent : ""
const open = state === "expanded" ? "open" : ""

export default {
  example: figma.code`<relay-ui kind="accordion" variant="${variant}" state="${state}"><details ${open}><summary>${summary}</summary><p>${detail}</p></details></relay-ui>`,
  imports: ["import { RelayUIComponent } from \"../../frameworks/angular/src/components\""],
  id: "red-angular-accordion",
  metadata: { nestable: true },
}
