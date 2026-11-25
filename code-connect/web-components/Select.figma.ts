// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=17-4
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/frameworks/web-components/elements.ts
// component=Select
import figma from "figma"
const instance = figma.selectedInstance
const value = instance.getString("Value")
const label = instance.getString("Label")
const error = instance.getString("Error")
const state = instance.getEnum("State", {"Default":"default","Focus":"focus","Filled":"filled","Error":"error","Disabled":"disabled"})

export default {
  example: figma.code`<relay-select state="${state}" label="${label}" value="${value}"><option value="${value}">${value}</option></relay-select>`,
  imports: ["import { registerElements } from \"../../frameworks/web-components/elements\"","registerElements()"],
  id: "red-web-components-select",
  metadata: { nestable: true },
}
