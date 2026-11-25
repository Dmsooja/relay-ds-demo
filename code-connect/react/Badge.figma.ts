// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=29-17
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/src/components/Badge/Badge.tsx
// component=Badge
import figma from "figma"
const instance = figma.selectedInstance
const label = instance.getString("Label")
const variant = instance.getEnum("Variant", {"Default":"default","Success":"success","Warning":"warning","Danger":"danger","Info":"info"})
const size = instance.getEnum("Size", {"Md":"md","Sm":"sm"})

export default {
  example: figma.code`<Badge variant="${variant}" size="${size}">${label}</Badge>`,
  imports: ["import { Badge } from \"@sc-demo/relay-ds-demo\""],
  id: "red-react-badge",
  metadata: { nestable: true },
}
