// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=21-19
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/src/components/Navbar/Navbar.tsx
// component=Header
import figma from "figma"
const instance = figma.selectedInstance
const mobileOpen = instance.getBoolean("Mobile Open")
const state = instance.getEnum("State", {"Default":"default","Mobile collapsed":"mobile-collapsed"})
const navLabelNode = instance.findText("Link")
const navLabel = navLabelNode?.type === "TEXT" ? navLabelNode.textContent : ""

export default {
  example: figma.code`<Header state="${state}" data-mobile-open="${mobileOpen}"><nav aria-label="Main"><a href="/">${navLabel}</a></nav></Header>`,
  imports: ["import { Header } from \"@sc-demo/relay-ds-demo\""],
  id: "red-react-header",
  metadata: { nestable: true },
}
