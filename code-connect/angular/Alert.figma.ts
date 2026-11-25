// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=30-2
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/frameworks/angular/src/components.ts
// component=Alert
import figma from "figma"
const instance = figma.selectedInstance
const children = instance.getString("Children")
const dismissible = instance.getBoolean("Dismissible")
const variant = instance.getEnum("Variant", {"Info":"info","Success":"success","Warning":"warning","Danger":"danger"})

export default {
  example: figma.code`<relay-ui kind="alert" variant="${variant}" [dismissible]="${dismissible}">${children}</relay-ui>`,
  imports: ["import { RelayUIComponent } from \"../../frameworks/angular/src/components\""],
  id: "red-angular-alert",
  metadata: { nestable: true },
}
