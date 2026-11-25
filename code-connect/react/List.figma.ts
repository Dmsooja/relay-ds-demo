// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=28-2
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/src/components/List/List.tsx
// component=List
import figma from "figma"
const instance = figma.selectedInstance
const variant = instance.getEnum("Variant", {"Default":"default","Icon":"icon","Bordered":"bordered","Ordered":"ordered"})
const size = instance.getEnum("Size", {"Md":"md","Sm":"sm"})
const itemNode = instance.findText("Content")
const item = itemNode?.type === "TEXT" ? itemNode.textContent : ""

export default {
  example: figma.code`<List variant="${variant}" size="${size}"><li>${item}</li></List>`,
  imports: ["import { List } from \"@sc-demo/relay-ds-demo\""],
  id: "red-react-list",
  metadata: { nestable: true },
}
