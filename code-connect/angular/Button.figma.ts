// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=14-17
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/frameworks/angular/src/components.ts
// component=Button
import figma from "figma"
const instance = figma.selectedInstance
const label = instance.getString("Label")
const variant = instance.getEnum("Variant", {"Primary":"primary","Secondary":"secondary","Ghost":"ghost","Danger":"danger"})
const size = instance.getEnum("Size", {"Md":"md","Sm":"sm","Lg":"lg"})
const state = instance.getEnum("State", {"Default":"default","Hover":"hover","Focus visible":"focus-visible","Active":"active","Disabled":"disabled","Loading":"loading"})

export default {
  example: figma.code`<relay-ui kind="button" variant="${variant}" size="${size}" state="${state}">${label}</relay-ui>`,
  imports: ["import { RelayUIComponent } from \"../../frameworks/angular/src/components\""],
  id: "red-angular-button",
  metadata: { nestable: true },
}
