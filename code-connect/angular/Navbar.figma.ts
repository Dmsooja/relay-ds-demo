// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=21-19
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/frameworks/angular/src/components.ts
// component=Header
import figma from "figma"
const instance = figma.selectedInstance
const mobileOpen = instance.getBoolean("Mobile Open")
const state = instance.getEnum("State", {"Default":"default","Mobile collapsed":"mobile-collapsed"})
const navLabelNode = instance.findText("Link")
const navLabel = navLabelNode?.type === "TEXT" ? navLabelNode.textContent : ""

export default {
  example: figma.code`<relay-ui kind="header" state="${state}" data-mobile-open="${mobileOpen}"><nav aria-label="Main"><a href="/">${navLabel}</a></nav></relay-ui>`,
  imports: ["import { RelayUIComponent } from \"../../frameworks/angular/src/components\""],
  id: "red-angular-header",
  metadata: { nestable: true },
}
