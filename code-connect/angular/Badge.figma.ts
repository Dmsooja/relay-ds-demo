// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=29-17
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/frameworks/angular/src/components.ts
// component=Badge
import figma from "figma"
const instance = figma.selectedInstance
const label = instance.getString("Label")
const variant = instance.getEnum("Variant", {"Default":"default","Success":"success","Warning":"warning","Danger":"danger","Info":"info"})
const size = instance.getEnum("Size", {"Md":"md","Sm":"sm"})

export default {
  example: figma.code`<relay-ui kind="badge" variant="${variant}" size="${size}">${label}</relay-ui>`,
  imports: ["import { RelayUIComponent } from \"../../frameworks/angular/src/components\""],
  id: "red-angular-badge",
  metadata: { nestable: true },
}
