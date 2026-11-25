// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=14-17
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/src/components/Button/Button.tsx
// component=Button
import figma from "figma"
const instance = figma.selectedInstance
const label = instance.getString("Label")
const variant = instance.getEnum("Variant", {"Primary":"primary","Secondary":"secondary","Ghost":"ghost","Danger":"danger"})
const size = instance.getEnum("Size", {"Md":"md","Sm":"sm","Lg":"lg"})
const state = instance.getEnum("State", {"Default":"default","Hover":"hover","Focus visible":"focus-visible","Active":"active","Disabled":"disabled","Loading":"loading"})

export default {
  example: figma.code`<Button variant="${variant}" size="${size}" state="${state}">${label}</Button>`,
  imports: ["import { Button } from \"@sc-demo/relay-ds-demo\""],
  id: "red-react-button",
  metadata: { nestable: true },
}
