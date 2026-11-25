// url=https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=32-2
// source=https://github.com/Dmsooja/relay-ds-demo/blob/main/src/components/Modal/Modal.tsx
// component=Modal
import figma from "figma"
const instance = figma.selectedInstance
const title = instance.getString("Title")
const content = instance.getSlot("Content")
const size = instance.getEnum("Size", {"Sm":"sm","Md":"md","Lg":"lg"})

export default {
  example: figma.code`<Modal size="${size}" label="${title}"><h2>${title}</h2>${content}</Modal>`,
  imports: ["import { Modal } from \"@sc-demo/relay-ds-demo\""],
  id: "red-react-modal",
  metadata: { nestable: true },
}
