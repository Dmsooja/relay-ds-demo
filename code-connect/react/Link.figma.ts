// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=15-2
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/src/components/Link/Link.tsx
// component=Link
import figma from "figma"
const instance = figma.selectedInstance
const label = instance.getString("Label")
const variant = instance.getEnum("Variant", {"Default":"default","Subtle":"subtle"})
const state = instance.getEnum("State", {"Default":"default","Hover":"hover","Focus visible":"focus-visible"})

export default {
  example: figma.code`<Link variant="${variant}" state="${state}" href="/">${label}</Link>`,
  imports: ["import { Link } from \"@sc-demo/relay-ds-demo\""],
  id: "red-react-link",
  metadata: { nestable: true },
}
