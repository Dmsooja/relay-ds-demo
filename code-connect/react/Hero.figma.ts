// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=34-2
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/src/components/Hero/Hero.tsx
// component=Hero
import figma from "figma"
const instance = figma.selectedInstance
const eyebrow = instance.getString("Eyebrow")
const title = instance.getString("Title")
const subtitle = instance.getString("Subtitle")
const actions = instance.getSlot("Actions")
const variant = instance.getEnum("Variant", {"Centered":"centered","Split":"split","Media":"media"})

export default {
  example: figma.code`<Hero variant="${variant}"><p className="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${subtitle}</p>${actions}</Hero>`,
  imports: ["import { Hero } from \"@sc-demo/relay-ds-demo\""],
  id: "red-react-hero",
  metadata: { nestable: true },
}
