// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=15-2
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/frameworks/angular/src/components.ts
// component=Link
import figma from "figma"
const instance = figma.selectedInstance
const label = instance.getString("Label")
const variant = instance.getEnum("Variant", {"Default":"default","Subtle":"subtle"})
const state = instance.getEnum("State", {"Default":"default","Hover":"hover","Focus visible":"focus-visible"})

export default {
  example: figma.code`<relay-ui kind="link" variant="${variant}" state="${state}" href="/">${label}</relay-ui>`,
  imports: ["import { RelayUIComponent } from \"../../frameworks/angular/src/components\""],
  id: "red-angular-link",
  metadata: { nestable: true },
}
