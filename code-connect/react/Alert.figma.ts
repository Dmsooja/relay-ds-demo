// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=30-2
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/src/components/Alert/Alert.tsx
// component=Alert
import figma from "figma"
const instance = figma.selectedInstance
const children = instance.getString("Children")
const dismissible = instance.getBoolean("Dismissible")
const variant = instance.getEnum("Variant", {"Info":"info","Success":"success","Warning":"warning","Danger":"danger"})

export default {
  example: figma.code`<Alert variant="${variant}" ${dismissible ? 'dismissible' : ''}>${children}</Alert>`,
  imports: ["import { Alert } from \"@sc-demo/relay-ds-demo\""],
  id: "red-react-alert",
  metadata: { nestable: true },
}
