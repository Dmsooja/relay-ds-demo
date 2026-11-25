# Relay DS Demo

Relay is a fictional B2B workflow product. Relay DS supplies the shared components and the Red and Blue themes across six marketing and workspace routes.

- [Published Figma library](https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo)
- [Figma Make source project](https://www.figma.com/make/EmiD7CbXx5DynfBBjHDDcD)
- [GitHub source](https://github.com/Dmsooja/relay-ds-demo)
- Package: `@sc-demo/relay-ds-demo@0.1.1` in the Figma private npm registry.

| Route | What to try |
| --- | --- |
| `/` | Switch themes, inspect the example request inbox, and follow the main actions. |
| `/solutions` | Use the workflow tabs with the mouse or arrow keys. |
| `/pricing` | Switch billing frequency, expand an FAQ, and select a plan. |
| `/contact` | Check the selected plan, submit invalid data, then enter fictional details for a local confirmation. |
| `/workspace` | Open from “Log in”, search requests, filter their status, and open a request’s details. |
| `/workspace/workflows` | Explore six templates, search or filter by team, and preview their steps and expected outcomes. |

“Log in” enters a fictional workspace directly for the demo. The dashboard uses shared Card, Badge, Tabs, Input, List, Button, Header and Modal components. Its metrics summarize an illustrative week, and the inbox shows six recent requests. React Native includes a workspace screen using the same fixtures and native design-system components.

## Run the source demo

```sh
npm ci
npm ci --prefix frameworks/angular
npm ci --prefix frameworks/react-native

npm run dev            # React, the reference for the design review
npm run dev:wc         # Vanilla Web Components
npm run dev:hybrid     # React consuming the same Web Components
npm run dev:angular
npm run dev:native     # Expo, for a compatible iOS or Android device or simulator
```

Run each preview in a separate terminal. Vite and Angular print the local URL. Contact form submissions stay in the running demo.

## Shared design system

The four web implementations render the same page structure and use the same theme tokens, styles and client-side interaction rules. React Native uses native controls and the shared content and color tokens. The React library builds as `@sc-demo/relay-ds-demo`, a local ESM package with declarations and a stylesheet. The Angular and React Native source projects are named `@relay-ds/angular-demo` and `@relay-ds/react-native-demo`.

- Shared palette and deliberate Figma aliases live in `shared/tokens.mjs`. Run `node scripts/sync-tokens.mjs` to regenerate the web CSS.
- Red follows the existing Figma brand colors. Blue introduces a separate action, hover, tint, accent, and dark surface palette. The Figma `Blue` extension overrides brand, text and button roles through primitive aliases.
- The contact flow uses sample-only data. Plan and inbox figures are illustrative.
- Angular uses `RelayUIComponent` / `<relay-ui>`. Web Components use `RelayElement` and `<relay-button>`, `<relay-card>`, and the other `relay-*` tags. Their internal host marker is `data-relay-host`.
- The existing `--rd-*` CSS tokens and `rd-*` style classes remain stable styling APIs. Theme identifiers stay `red` and `blue`, with the visible labels Red and Blue.

## Local npm package

The package identity is `@sc-demo/relay-ds-demo`. It exports React components, shared tokens, the component stylesheet, and token CSS. Angular, native demo apps, screenshots, caches, and credentials are excluded from the archive.

```sh
mkdir -p artifacts
npm pack --dry-run
npm pack --pack-destination artifacts
```

Packing rebuilds the library first. Install the versioned archive in `artifacts/` in a consuming app, or install from the configured Figma private npm registry, then use:

```tsx
import { Button } from '@sc-demo/relay-ds-demo'
import '@sc-demo/relay-ds-demo/styles'

export function DemoAction() {
  return <Button variant="primary">Explore Relay</Button>
}
```

Optional imports are `@sc-demo/relay-ds-demo/tokens` and `@sc-demo/relay-ds-demo/tokens.css`. Set `data-theme="red"` or `data-theme="blue"` on the document root to select the theme. Registry access is restricted to the configured Figma organization. Creating a local archive and publishing a registry version are separate actions.

The components provide styled semantic elements and accept native React events and refs. `Input` is a void element; supply its value through input props. Compose `Tabs` with tab buttons and panels, controlled state and arrow-key handling. Open `Modal` through the dialog ref's `showModal()` method, and handle `onCancel`/`onClose` to keep React state synchronized. The example app's complete interaction wiring is in `shared/behavior.mjs`; importing the component stylesheet does not install those handlers.

## Verify

```sh
npm run build
npm run build:library
npm --prefix frameworks/angular run build
npm --prefix frameworks/react-native run typecheck
npm --prefix frameworks/react-native run build
npm test
npm run test:browser
npm run code-connect:validate
```

The browser check uses installed Google Chrome on macOS. Set `RELAY_DEMO_CHROME` to use a different Chromium executable. It tests the production builds and stores screenshots in `screenshots/`. The Expo export checks JavaScript bundling for iOS and Android. The command skips optional Hermes bytecode generation so it can be used for local verification on machines without a working Hermes compiler.

## Code Connect and Figma

The parserless templates target 18 verified assets in [Relay DS Demo](https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=13-467). React, Angular, and Web Components have 18 templates each. React Native has seven, one per connected native component implemented by the app. The React hybrid consumes the same Web Components and uses that Dev Mode label. React imports use `@sc-demo/relay-ds-demo`; Angular and Web Component examples use the Relay selectors. Published template record IDs remain stable so a later publication updates the existing mappings. Refresh the Figma property schema in `code-connect/components.json` before regenerating templates if the library API changes.

The local validation parses the templates via the pinned Code Connect CLI and checks their node IDs, labels, and enum coverage. Live Dev Mode verification follows library publication and requires `FIGMA_ACCESS_TOKEN` in this project's `.env`. See `.env.example` for the key name.

The approved marketing and workspace designs are in the existing [Pages section](https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo?node-id=2012-155). Registry publication, the Figma Make project, and GitHub setup for the Code Layers demo are separate steps.
