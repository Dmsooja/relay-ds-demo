// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=36-8
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/src/components/CTABanner/CTABanner.tsx
// component=CTABanner
import figma from "figma"
const instance = figma.selectedInstance
const title = instance.getString("Title")
const subtitle = instance.getString("Subtitle")
const actions = instance.getSlot("Actions")
const variant = instance.getEnum("Variant", {"Brand":"brand","Subtle":"subtle"})

export default {
  example: figma.code`<CTABanner variant="${variant}"><div><h2>${title}</h2><p>${subtitle}</p></div>${actions}</CTABanner>`,
  imports: ["import { CTABanner } from \"@sc-demo/relay-ds-demo\""],
  id: "red-react-cta-banner",
  metadata: { nestable: true },
}
