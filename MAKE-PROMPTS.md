# Relay DS — Figma Make Demo Prompts

Ready-to-paste prompt pack for the live Figma Make customer demo.
Published on private registry: `@sc-demo/relay-ds-demo@0.1.1`

Package: `@sc-demo/relay-ds-demo`

Use the published Relay DS React package and add the published Relay DS Figma library as design context. The navigation component is exported as `Header`. Components accept native React events and refs. Compose Tabs with tab buttons and panels, selected state and keyboard handlers; open Modal through its dialog ref using `showModal()`, and synchronize `onCancel`/`onClose`. Keep form data local and fictional.

---

### Prompt 1 — Marketing Landing Page

Paste into Figma Make:

> Build a landing page for Relay DS using only components from
> `@sc-demo/relay-ds-demo`. Sections, in order: a nav bar with the logo and a primary CTA;
> a hero with an h1, a supporting paragraph, and primary plus secondary buttons; a
> three-column feature section using Card; a pricing section with three Cards where
> the middle one has a "Most popular" Badge; a closing CTA band; and the Footer.
> Do not write any inline styles.

**Say while it generates:** Every component here is the same code your engineers
would import — the design and the implementation are the exact same artifact.

**Expect to see:** Navbar, Button (primary + secondary), Card (elevated + bordered),
Badge, Footer.

---

### Prompt 2 — Signup Flow

Paste into Figma Make:

> Build a two-step signup flow for Relay DS using components from
> `@sc-demo/relay-ds-demo`. Include labeled inputs for work email and password with inline
> validation errors, a disabled submit Button until valid, and a success Alert.
> Do not write any inline styles.

**Say while it generates:** Input states are real, not decorative. Form states are what
teams hand-build over and over, and here they come directly from the design system.

**Expect to see:** Input (default, focus, error), Button, Alert.

---

### Prompt 3 — Dashboard

Paste into Figma Make:

> Build an operational dashboard for Relay DS using components from
> `@sc-demo/relay-ds-demo`. Include a top header or nav bar, three stat Cards, a data List,
> Tabs across two views, and an empty state.
> Do not write any inline styles.

**Say while it generates:** Notice the density and layout consistency — the system
powers data and product surfaces just as effectively as marketing pages.

**Expect to see:** Navbar, Card, List, Tabs, Badge.

---

### Prompt 4 — Settings Page

Paste into Figma Make:

> Build an account settings page for Relay DS using components from
> `@sc-demo/relay-ds-demo`. Include tabbed sections, accordions for advanced options, form controls for preferences, and a destructive-action confirmation using the danger variant.
> Do not write any inline styles.

**Say while it generates:** Plausible, production-grade hierarchy and states for complex
configuration workflows.

**Expect to see:** Tabs, Accordion, Button (danger/destructive).

---

### Prompt 5 — Mobile Screens

Paste into Figma Make:

> Render the signup flow from Prompt 2 at a mobile viewport (390px width) using components
> from `@sc-demo/relay-ds-demo`. Show the collapsed mobile navigation with the hamburger menu.
> Do not write any inline styles.

**Say while it generates:** Responsive tokens and mobile targets are built into the library
from day one — 44px minimum touch targets and clean mobile navigation.

**Expect to see:** Navbar (mobile collapsed), Input, Button at 390px.

---

### Prompt 6 — Theme Swap

Paste into Figma Make:

> Add a Red / Blue theme switch to this same prototype using the existing Relay DS
> semantic CSS variables and the existing theme selector API. Its two values are
> "red" and "blue". Preserve the layout, content, interactions, and status meanings. Do not
> invent colors or add inline styles. Dark mode was not detected; Red and Blue
> are both light themes.

**Say while it generates:** The product changes brand through semantic tokens.

**Expect to see:** A functional Red / Blue switch using the two shipped palettes.
