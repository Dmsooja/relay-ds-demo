// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=23-2
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/frameworks/web-components/elements.ts
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
  example: figma.code`<relay-tabs variant="${variant}" state="${state}"><div role="tablist"><button type="button" role="tab" aria-selected="${selected}" ${disabled}>${tabLabel}</button></div></relay-tabs>`,
  imports: ["import { registerElements } from \"../../frameworks/web-components/elements\"","registerElements()"],
  id: "red-web-components-tabs",
  metadata: { nestable: true },
}
