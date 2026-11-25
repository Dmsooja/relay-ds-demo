# Relay DS Design System — Live Demo Playbook

A 5-minute customer demo walkthrough script for Figma Solutions Consultants.

## Before you import the kit
Open the Make file's `package.json` and read the `react` version. The kit needs React 19.
- **19.x:** continue.
- **18.x:** create a new Make file (recommended; new Make files default to React 19). Or bump `react`, `react-dom` and `@types/react` to 19 together, after checking that the template's other dependencies (for example `react-day-picker` and `react-slick`) accept React 19.
- Never widen the kit's peer range to React 18.
- **Say:** "This kit is built for React 19, which new Make files use. This file started on React 18, so I'll use a fresh Make file: same prompts, same components."

### Setup in Make
- Stylesheet (once, at the app root): `import '@sc-demo/relay-ds-demo/styles'`

## Demo Overview
- **Customer:** Relay DS
- **Artifact:** React 19 Design System + Figma Library + Code Connect + Make Prompts
- **Package:** `@sc-demo/relay-ds-demo`

## Before you present
- [x] npm package published: `@sc-demo/relay-ds-demo@0.1.1`
- [x] Figma library: https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo
- [x] Code Connect published and verified in Dev Mode

---

## The 5-Minute Demo Flow

### 1. The Context (1 minute)
- "Relay DS pairs the approved Figma library with shared web and mobile implementations of a fictional B2B workflow product."
- Show the visual showcase:
  ```bash
  npm run dev
  ```
- Use the browser responsive tools to compare desktop and 390px mobile viewports to show fluid typography, spacing scales, and responsive contracts.

### 2. Code & Token Architecture (1 minute)
- Open `shared/tokens.mjs` and `src/styles/tokens.css`.
- Point out:
  - Three-tier token architecture (primitives → semantic tokens → components).
  - CSS custom properties in `tokens.css` for zero-build consumption.
  - Semantic CSS roles power the web components; the native components read the shared theme tokens.

### 3. Figma Library & Dev Mode (1.5 minutes)
- Open the Figma file: https://www.figma.com/design/MkqEVrtfKuaL91x47mSiT9/Relay-DS-Demo
- Show the library organization: Foundations, Components, Mobile, Patterns.
- Select a component (e.g. Button or Input) in Dev Mode:
  - Point out the Code Connect panel: show the exact React code snippet.
  - Flip variant properties in Figma: the code snippet updates in real time with zero `undefined` values.

### 4. Figma Make Live Prototype (1.5 minutes)
- Open Figma Make.
- Copy **Prompt 1** from `MAKE-PROMPTS.md` and paste it into Make.
- While Make generates:
  > "Every component Make renders here is the exact React package your engineers use. Design and code are the same artifact."
- Follow with **Prompt 2** (Signup flow with validation states) or **Prompt 6** (Red / Blue theme swap).

---

## Common Customer Questions & Answers

**Q: How does this reach our codebase?**
- *Answer:* Two paths:
  1. Private npm registry (default): `@sc-demo/relay-ds-demo` is published there and Make imports it directly.
  2. Git-backed repo: Make opens the repo, designers work in Make, and changes arrive as clean Pull Requests reviewed by your engineering team.

**Q: Can we use this with extra frameworks?**
- *Answer:* Yes. Code Connect can map React, Angular, Web Components, and React Native code to the same Figma components. This run's package and Make kit are React.

**Q: What happens if our brand colors update?**
- *Answer:* Update the tokens in one place (`shared/tokens.mjs` and `src/styles/tokens.css`). Components read the semantic tokens, so rebuilding and publishing a new package version carries the change into code and Make. The Figma variables are a separate copy: update them in the Figma file (or re-run the Figma phase) so design matches.

## Component composition in Make

- The navigation export is Header. Red and Blue are theme labels, not separate component APIs.
- Tabs is a styled container: compose accessible tab buttons and panels with React state and arrow-key handlers.
- Modal renders a native dialog. Call showModal() through its ref for browser-managed modal focus; synchronize React state through onCancel and onClose.
- Input is a void element. Use value/defaultValue and onChange, with a visible label through FormField.
- The shipped example app includes interaction wiring in shared/behavior.mjs. Package styles do not install that wiring automatically.
- React, Angular and Web Components have 18 Code Connect mappings each; React Native has seven matching the implemented native library.
- The Make file was created in Figma SCs and remains empty: source upload was declined. The source archive stays local. Creating or attaching a reusable Make kit from the published package remains a distinct Make action.
