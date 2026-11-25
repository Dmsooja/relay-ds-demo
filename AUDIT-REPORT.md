# Audit report — Relay DS

Rendered from `.extraction/audit-result.json` (2026-11-25T13:41:04.150Z) by `audit-result.js render`. Do not edit by hand: change a row with `audit-result.js set`, then render again.

**Verdict: not-ready** — phase: pipelinePhase is "intake"; earlier phases have not all exited; audit-gaps: GAP: A2, A3, A6, A8, A9, A10, A11, A12, A15, A17, A18, A21, A22, A28, A31, A32, A33; visual-readiness-missing: no .extraction/visual-readiness.json and no visualReadiness.skipReason

| Check | Status | Evidence | By |
|---|---|---|---|
| A1 | PASS | data.json buildVerification.fullVerifiedAt, data.json buildVerification.fullVerifiedInputHash | audit-code |
| A2 | GAP | src/index.ts, src/react-app.ts | agent |
| A3 | GAP | .extraction/architecture.json | agent |
| A4 | PASS | src/components/Accordion/Accordion.tsx, src/components/Alert/Alert.tsx, src/components/Badge/Badge.tsx, src/components/Breadcrumb/Breadcrumb.tsx, src/components/Button/Button.tsx, src/components/CTABanner/CTABanner.tsx, src/components/Card/Card.tsx, src/components/FeatureGrid/FeatureGrid.tsx, src/components/Footer/Footer.tsx, src/components/FormField/FormField.tsx | audit-code |
| A5 | PASS | data.json npmPublished, package.json | audit-code |
| A6 | GAP | .extraction/release/figma-audit.json | agent |
| A7 | PASS | .extraction/release/published-components.json, code-connect/components.json | agent |
| A8 | GAP | .extraction/release/published-components.json, .extraction/release/code-connect-verification.json | agent |
| A9 | GAP | .extraction/release/figma-audit.json | agent |
| A10 | GAP | .extraction/release/figma-audit.json | agent |
| A11 | GAP | tests/foundations.test.mjs, scripts/browser-check.mjs, .extraction/release/figma-audit.json | agent |
| A12 | GAP | shared/tokens.mjs, .extraction/release/figma-audit.json | agent |
| A13 | N/A | shared/tokens.mjs, MAKE-PROMPTS.md | agent |
| A14 | PASS | scripts/check-connect.mjs, .extraction/release/cc-publication.json, .extraction/release/code-connect-verification.json | agent |
| A15 | GAP | scripts/check-connect.mjs, .extraction/check-gate3-result.json, .extraction/release/code-connect-verification.json | agent |
| A16 | PASS | data.json figmaEnabled, data.json figmaSkipReason, data.json codeConnectEnabled, data.json codeConnectSkipReason | audit-code |
| A17 | GAP | src/components/factory.tsx, src/index.ts | agent |
| A18 | GAP | shared/tokens.mjs, shared/tokens.css, src/styles/tokens.css | agent |
| A19 | PASS | .extraction/release/figma-audit.json | agent |
| A20 | PASS | src/components/Accordion/Accordion.tsx, src/components/Alert/Alert.tsx, src/components/Badge/Badge.tsx, src/components/Breadcrumb/Breadcrumb.tsx, src/components/Button/Button.tsx, src/components/CTABanner/CTABanner.tsx, src/components/Card/Card.tsx, src/components/FeatureGrid/FeatureGrid.tsx, src/components/Footer/Footer.tsx, src/components/FormField/FormField.tsx | audit-code |
| A21 | GAP | shared/styles.css, scripts/browser-check.mjs | agent |
| A22 | GAP | frameworks/angular/, frameworks/web-components/, frameworks/react-native/, scripts/check-connect.mjs | agent |
| A23 | FIX-APPLIED | frameworks/react-native/components.tsx, shared/tokens.mjs | agent |
| A24 | PASS | .extraction/release/figma-audit.json, .extraction/release/published-components.json | agent |
| A25 | PASS | .extraction/check-demo-pack-result.json, MAKE-PROMPTS.md, DEMO.md, scripts/customize-demo-pack.mjs | agent |
| A26 | N/A | .extraction/architecture.json | agent |
| A27 | PASS | .extraction/release/figma-audit.json, scripts/browser-check.mjs | agent |
| A28 | GAP | .extraction/release/figma-audit.json | agent |
| A29 | PASS | .extraction/code-connect-live.json, .extraction/release/code-connect-verification.json | agent |
| A30 | PASS | .extraction/code-connect-live.json, .extraction/release/code-connect-verification.json | agent |
| A31 | GAP | .extraction/variant-manifest.json, .extraction/release/code-connect-verification.json | agent |
| A32 | GAP | .extraction/release/figma-audit.json | agent |
| A33 | GAP | .extraction/release/figma-audit.json | agent |
| A34 | PASS | .extraction/verify-build-result.json, .extraction/consumer-smoke.json, package.json | agent |

## Notes

- A1: tsc and build green in the full verify at 2026-11-25T13:21:26.303Z; inputs unchanged since
- A2: All 18 named exports render in the packed consumer. The stock audit requires export-star barrels and a different showcase layout. Next: add a read-only adapter for the actual named exports and six-page showcase, then rerun the gate.
- A3: This selected release pass did not record a new full code-review phase. Next: review the existing shared renderer, four framework adapters and consumer interaction contracts, and record findings before claiming full authoring-pipeline completion.
- A4: 19 component source files: named exports only, token imports resolve into src/tokens or src/styles
- A5: @sc-demo/relay-ds-demo@0.1.1 recorded and matches package.json
- A6: Existing published foundations: 124 of 234 variables still have broad or missing scopes (example VariableID:10:3 color/orange/50). All have WEB code syntax and no empty effect styles were found. Next: narrow variable scopes during a library-maintenance pass and republish; the release did not silently change published foundations.
- A7: All 18 supplied design-system components resolve to published nodes: 17 component sets and the standalone Footer. Actual published child variants were checked against the same node IDs used by code mappings.
- A8: All 18 published targets were verified, but the stock normalized metadata snapshot was not produced. Next: normalize the existing file metadata and model Alert Dismissible as its actual Boolean property before rerunning Gate 2.
- A9: A fresh per-property binding audit was not completed for every existing component. Next: run a binding audit on the published library; bind only matching token values, validate geometry, and republish any intended changes.
- A10: The 18 component targets have stable names, but a complete layer naming and duplicate-node review was not repeated for the user-maintained canvas. Next: inspect all component sections and normalize only confirmed default or duplicate names.
- A11: Code contrast tests pass for both palettes and the approved browser flows pass at 1440/390px. Full current Figma contrast, target-size, and focus-state measurements remain unverified. Next: perform the fixed Figma accessibility sample before claiming the entire library passes AA.
- A12: Shared Red/Blue tokens and Figma semantic aliases exist, but a complete token-to-variable value join was not established for all 234 existing variables. Next: audit the WEB code-syntax map and record deliberate differences.
- A13: The requested themes are Red and Blue, both light themes. No dark palette or Dark-mode publication was requested or claimed.
- A14: Actual per-framework template inventory: React 18, Angular 18, Web Components 18, React Native 7, totaling 61 CLI-published mappings. The local parser checks the real code-connect directories. Native coverage is explicitly limited to the seven implemented native components.
- A15: Project validation checks every enum key AND mapped code value in all 61 templates; all 256 live variant snippets are template-backed and contain no undefined. The installed generic Gate 3 still expects a different template layout and catalog conventions. Next: adapt that checker to these configured template paths and the actual published Boolean properties; do not falsify a stock-gate pass.
- A16: no layer skipped
- A17: The published generic API has 18 components; the stock completeness gate additionally requires Stack/Grid/Container/Section and inline IMMUTABLE contract comments. Next: reconcile that catalog with the approved generic API, then add only intended API extensions and rerun Gate 1.
- A18: The project uses shared token modules and synchronized CSS rather than the helper's expected design-tokens/foundations/responsive files. Next: validate the existing theme and font inventory through an adapter and record explicit breakpoint/font metadata.
- A19: Current file has Cover, Getting Started, four Foundations documentation pages, functional component pages, Patterns, Utilities, and Pages. Existing component section documentation and release package examples remain in the file.
- A20: 19 component files: no hex literals, no primitive token paths
- A21: The four web apps pass 1440/390px flows, using their existing responsive CSS. Stock checks require a different token/media-query layout, viewport toggle and crawl record. Next: reconcile responsive evidence with the actual six-page generic project; no crawl was requested.
- A22: Web implementations and Code Connect each cover 18 components through shared adapters; native implements seven. Stock checks expect individual component files and different template paths. Next: audit adapter coverage explicitly and decide any native expansion before claiming full 18-component native parity.
- A23: Replaced the native Input's literal normal-border color with the existing semantic muted token. Native typecheck and iOS/Android export pass. Shared palette values were not invented or changed.
- A24: The existing user-maintained 17-page structure is retained. Published component locations match their functional pages. Approved desktop/mobile product screens remain in the user-requested Pages section rather than being moved to an invented new layout.
- A25: Six prompts and the playbook pass check-demo-pack, including React 19 and the actual package. They document Header, composed Tabs/Modal, and Red/Blue switching. Source upload was declined: the Make file is empty and the archive stays local.
- A26: This is a release of an existing approved generic Figma/code library. The user requested only applicable steps; no live-site crawl was requested for Relay DS. No crawl counts were fabricated.
- A27: Mobile examples exist in Patterns and the approved Pages section. The six-page app flows pass at 390px in Red and Blue across React, Angular, Web Components and the React hybrid. This does not claim a new separate Mobile component set.
- A28: Patterns are present, but a fresh audit of all instance composition, error-input and disabled-submit specimens was not completed. Next: review the existing Patterns sections and record screenshots of the required states.
- A29: CLI-only publication followed by read-back of every scoped set/label. All 61 component-label pairs and 256 published variants have hasTemplate=true. Figma returns child IDs for parent-set queries; records were joined to independently verified published child membership. The raw responses were preserved unmodified. The legacy parent-ID checker mismatch is recorded, not presented as a pass.
- A30: React Button 14:17, Input 16:17 and Card 24:7 were read back along with all other targets. Their variant snippets include @sc-demo/relay-ds-demo imports, have template indicators, and contain no undefined.
- A31: All 74 actual published variant nodes have mappings under each web label. Stock reconciliation instead expects 75 drawn cells/160 Cartesian combinations, different template paths, and parent IDs. Next: reconcile the Boolean Alert model and child-ID evidence, produce a normalized snapshot, and rerun the manifest gates without inventing nodes or counts.
- A32: Every published variant was verified as mapped, but fresh per-section visual evidence was not captured for every existing variant matrix in this release pass. Next: inspect and screenshot all 18 component sections before claiming full visual matrix QA.
- A33: The current page inventory was inspected, but complete current bounding-box/grid measurements and page screenshots were not repeated after user canvas edits. Next: run the full canvas organization review without rebuilding or detaching approved components.
- A34: React 19, stylesheet exports, token CSS and the packed consumer render/bundle checks pass. All 18 exports render. Four generic standalone Tabs/Modal browser checks do NOT pass without consumer wiring; that contract difference is documented in README and DEMO and is not reported as a browser-smoke pass. The complete example-app flows pass.
- fix-applied: A23

## Timing

Active unknown, human wait 0s (source: none; `run-timing.js`).
