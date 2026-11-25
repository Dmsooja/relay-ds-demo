// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=23-2
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/frameworks/angular/src/components.ts
// component=Tabs
import figma from "figma"
const instance = figma.selectedInstance
const variant = instance.getEnum("Variant", {"Default":"default","Pill":"pill","Bordered":"bordered"})
const state = instance.getEnum("State", {"Active":"active","Inactive":"inactive","Hover":"hover","Focus visible":"focus-visible","Disabled":"disabled"})
const tabLabelNode = instance.findText("Label")
const tabLabel = tabLabelNode?.type === "TEXT" ? tabLabelNode.textContent : ""
const selected = state === "active" ? "true" : "false"
const disabled = state === "disabled" ? "disabled" : ""

export default {
  example: figma.code`<relay-ui kind="tabs" variant="${variant}" state="${state}"><div role="tablist"><button type="button" role="tab" aria-selected="${selected}" ${disabled}>${tabLabel}</button></div></relay-ui>`,
  imports: ["import { RelayUIComponent } from \"../../frameworks/angular/src/components\""],
  id: "red-angular-tabs",
  metadata: { nestable: true },
}
