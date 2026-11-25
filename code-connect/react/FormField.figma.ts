// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=17-52
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/src/components/FormField/FormField.tsx
// component=FormField
import figma from "figma"
const instance = figma.selectedInstance
const label = instance.getString("Label")
const helperText = instance.getString("Helper Text")
const error = instance.getString("Error")
const state = instance.getEnum("State", {"Default":"default","Error":"error"})
const fieldMessage = state === "error" ? error : helperText

export default {
  example: figma.code`<FormField state="${state}"><span>${label}</span><small>${fieldMessage}</small></FormField>`,
  imports: ["import { FormField } from \"@sc-demo/relay-ds-demo\""],
  id: "red-react-form-field",
  metadata: { nestable: true },
}
