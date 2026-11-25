// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=24-7
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/frameworks/react-native/components.tsx
// component=Card
import figma from "figma"
const instance = figma.selectedInstance
const header = instance.getString("Header")
const content = instance.getSlot("Content")
const variant = instance.getEnum("Variant", {"Default":"default","Elevated":"elevated","Bordered":"bordered"})

export default {
  example: figma.code`<Card variant="${variant}" header="${header}">${content}</Card>`,
  imports: ["import { Card } from \"../../frameworks/react-native/components\""],
  id: "red-react-native-card",
  metadata: { nestable: true },
}
