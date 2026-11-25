// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=22-4
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/src/components/Footer/Footer.tsx
// component=Footer
import figma from "figma"
const instance = figma.selectedInstance
const copyrightNode = instance.findText("Copyright")
const copyright = copyrightNode?.type === "TEXT" ? copyrightNode.textContent : ""

export default {
  example: figma.code`<Footer><small>${copyright}</small></Footer>`,
  imports: ["import { Footer } from \"@sc-demo/relay-ds-demo\""],
  id: "red-react-footer",
  metadata: { nestable: true },
}
