import { readFile, writeFile } from 'node:fs/promises'

const promptsPath = new URL('../MAKE-PROMPTS.md', import.meta.url)
const demoPath = new URL('../DEMO.md', import.meta.url)
let prompts = await readFile(promptsPath, 'utf8')
const preface = 'Use the published Relay DS React package and add the published Relay DS Figma library as design context. The navigation component is exported as `Header`. Components accept native React events and refs. Compose Tabs with tab buttons and panels, selected state and keyboard handlers; open Modal through its dialog ref using `showModal()`, and synchronize `onCancel`/`onClose`. Keep form data local and fictional.\n\n'
if (!prompts.includes('The navigation component is exported as `Header`')) prompts = prompts.replace('\n---\n', '\n' + preface + '---\n')
prompts = prompts.replace(/### Prompt 6 — Theme Swap[\s\S]*$/, `### Prompt 6 — Theme Swap

Paste into Figma Make:

> Add a Red / Blue theme switch to this same prototype using the existing Relay DS
> semantic CSS variables and the existing theme selector API. Its two values are
> "red" and "blue". Preserve the layout, content, interactions, and status meanings. Do not
> invent colors or add inline styles. Dark mode was not detected; Red and Blue
> are both light themes.

**Say while it generates:** The product changes brand through semantic tokens.

**Expect to see:** A functional Red / Blue switch using the two shipped palettes.
`)
let demo = await readFile(demoPath, 'utf8')
demo = demo.replace('Production React 19 Design System', 'React 19 Design System')
demo = demo.replace('We took your live site and extracted your actual design system into production-ready code and a Figma library.', 'Relay DS pairs the approved Figma library with shared web and mobile implementations of a fictional B2B workflow product.')
demo = demo.replace('Toggle between Desktop and Mobile viewports (390px)', 'Use the browser responsive tools to compare desktop and 390px mobile viewports')
demo = demo.replaceAll('src/tokens/design-tokens.ts', 'shared/tokens.mjs')
demo = demo.replace('Zero hardcoded colors or sizing in component files.', 'Semantic CSS roles power the web components; the native components read the shared theme tokens.')
demo = demo.replace('The React 19 Design System + Figma Library + Code Connect + Make Prompts', 'React 19 components + Figma Library + Code Connect + Make Prompts')
demo = demo.replace('or **Prompt 6** (theme honesty)', 'or **Prompt 6** (Red / Blue theme swap)')
demo = demo.replace('React, React Native, Vue, Svelte, Web Components, SwiftUI, Jetpack Compose, Flutter, and Angular code', 'React, Angular, Web Components, and React Native code')
if (!demo.includes('## Component composition in Make')) demo += `
## Component composition in Make

- The navigation export is Header. Red and Blue are theme labels, not separate component APIs.
- Tabs is a styled container: compose accessible tab buttons and panels with React state and arrow-key handlers.
- Modal renders a native dialog. Call showModal() through its ref for browser-managed modal focus; synchronize React state through onCancel and onClose.
- Input is a void element. Use value/defaultValue and onChange, with a visible label through FormField.
- The shipped example app includes interaction wiring in shared/behavior.mjs. Package styles do not install that wiring automatically.
- React, Angular and Web Components have 18 Code Connect mappings each; React Native has seven matching the implemented native library.
- The Make file is a source import. Creating or attaching a reusable Make kit from the published package remains a distinct Make action.
`
await writeFile(promptsPath, prompts)
await writeFile(demoPath, demo)
console.log('Customized the generated pack for Relay DS, the shipped component APIs, and Red / Blue themes.')
