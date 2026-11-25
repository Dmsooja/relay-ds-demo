// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=16-17
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/src/components/Input/Input.tsx
// component=Input
import figma from "figma"
const instance = figma.selectedInstance
const label = instance.getString("Label")
const error = instance.getString("Error")
const placeholder = instance.getString("Placeholder")
const value = instance.getString("Value")
const state = instance.getEnum("State", {"Default":"default","Focus":"focus","Filled":"filled","Error":"error","Disabled":"disabled"})

export default {
  example: figma.code`<Input state="${state}" label="${label}" placeholder="${placeholder}" value="${value}" />`,
  imports: ["import { Input } from \"@sc-demo/relay-ds-demo\""],
  id: "red-react-input",
  metadata: { nestable: true },
}
