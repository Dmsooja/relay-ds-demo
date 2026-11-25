// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=17-4
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/frameworks/angular/src/components.ts
// component=Select
import figma from "figma"
const instance = figma.selectedInstance
const value = instance.getString("Value")
const label = instance.getString("Label")
const error = instance.getString("Error")
const state = instance.getEnum("State", {"Default":"default","Focus":"focus","Filled":"filled","Error":"error","Disabled":"disabled"})

export default {
  example: figma.code`<relay-ui kind="select" state="${state}" label="${label}" value="${value}"><option value="${value}">${value}</option></relay-ui>`,
  imports: ["import { RelayUIComponent } from \"../../frameworks/angular/src/components\""],
  id: "red-angular-select",
  metadata: { nestable: true },
}
