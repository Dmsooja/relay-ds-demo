// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=17-52
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/frameworks/web-components/elements.ts
// component=FormField
import figma from "figma"
const instance = figma.selectedInstance
const label = instance.getString("Label")
const helperText = instance.getString("Helper Text")
const error = instance.getString("Error")
const state = instance.getEnum("State", {"Default":"default","Error":"error"})
const fieldMessage = state === "error" ? error : helperText

export default {
  example: figma.code`<relay-form-field state="${state}"><span>${label}</span><small>${fieldMessage}</small></relay-form-field>`,
  imports: ["import { registerElements } from \"../../frameworks/web-components/elements\"","registerElements()"],
  id: "red-web-components-form-field",
  metadata: { nestable: true },
}
