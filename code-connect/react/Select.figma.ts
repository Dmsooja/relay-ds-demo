// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=17-4
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/src/components/Select/Select.tsx
// component=Select
import figma from "figma"
const instance = figma.selectedInstance
const value = instance.getString("Value")
const label = instance.getString("Label")
const error = instance.getString("Error")
const state = instance.getEnum("State", {"Default":"default","Focus":"focus","Filled":"filled","Error":"error","Disabled":"disabled"})

export default {
  example: figma.code`<Select state="${state}" label="${label}" value="${value}"><option value="${value}">${value}</option></Select>`,
  imports: ["import { Select } from \"@sc-demo/relay-ds-demo\""],
  id: "red-react-select",
  metadata: { nestable: true },
}
