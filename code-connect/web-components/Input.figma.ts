// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=16-17
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/frameworks/web-components/elements.ts
// component=Input
import figma from "figma"
const instance = figma.selectedInstance
const label = instance.getString("Label")
const error = instance.getString("Error")
const placeholder = instance.getString("Placeholder")
const value = instance.getString("Value")
const state = instance.getEnum("State", {"Default":"default","Focus":"focus","Filled":"filled","Error":"error","Disabled":"disabled"})

export default {
  example: figma.code`<relay-input state="${state}" label="${label}" placeholder="${placeholder}" value="${value}"></relay-input>`,
  imports: ["import { registerElements } from \"../../frameworks/web-components/elements\"","registerElements()"],
  id: "red-web-components-input",
  metadata: { nestable: true },
}
