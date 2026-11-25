// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=35-8
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/src/components/FeatureGrid/FeatureGrid.tsx
// component=FeatureGrid
import figma from "figma"
const instance = figma.selectedInstance
const title = instance.getString("Title")
const items = instance.getSlot("Items")
const columns = instance.getEnum("Columns", {"Two":"two","Three":"three","Four":"four"})

export default {
  example: figma.code`<FeatureGrid columns="${columns}"><h2>${title}</h2>${items}</FeatureGrid>`,
  imports: ["import { FeatureGrid } from \"@sc-demo/relay-ds-demo\""],
  id: "red-react-feature-grid",
  metadata: { nestable: true },
}
