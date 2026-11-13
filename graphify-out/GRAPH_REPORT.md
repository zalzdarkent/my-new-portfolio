# Graph Report - app  (2026-11-13)

## Corpus Check
- Large corpus: 116 files · ~547,987 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 166 nodes · 300 edges · 19 communities (8 shown, 11 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Phone & Showcase Apps
- 3D Desk Scene Builder
- Package Dependencies & Scripts
- HUD, Camera & Sound
- App Boot & Loader
- Desktop OS & Portfolio Data
- TypeScript Compiler Configuration
- Build & Dev Tooling
- HTML Entrypoint
- Faber Castell Pen Asset
- iPhone 16 Asset
- PNPM Workspace Config
- Gaming PC Asset
- Notebook Asset
- Phone Holder Asset
- Rhyzome Plant Asset
- ROG Laptop Asset
- Spiderman Model Asset
- Gaming Chair Asset

## God Nodes (most connected - your core abstractions)
1. `Scene()` - 16 edges
2. `react` - 11 edges
3. `compilerOptions` - 10 edges
4. `getCtx()` - 9 edges
5. `playMouseDown()` - 9 edges
6. `Desktop()` - 8 edges
7. `Hud()` - 8 edges
8. `playMouseUp()` - 8 edges
9. `Loader()` - 6 edges
10. `buildDesk()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Implementation Plan: Dark/Light Scene & Desk Lamp Toggle` --conceptually_related_to--> `simple retro Desk Lamp (3D Model)`  [INFERRED]
  tasks/plan.md → public/simple_retro_desk_lamp/license.txt
- `App()` --calls--> `Scene()`  [EXTRACTED]
  src/App.tsx → src/Scene.tsx
- `App()` --calls--> `playStartupSound()`  [EXTRACTED]
  src/App.tsx → src/sound.ts
- `Desktop()` --calls--> `Clock()`  [EXTRACTED]
  src/Desktop.tsx → src/components/desktop/Clock.tsx
- `Desktop()` --calls--> `Icon()`  [EXTRACTED]
  src/Desktop.tsx → src/components/desktop/Icon.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CC-BY-4.0 Licensed 3D Model Assets** — public_faber_castell_ballpoint_pen_license_model, public_gaming_pc_license_model, public_notebook_blackwhite_license_model, public_phone_holder_license_model, public_rhyzome_plant_license_model, public_rog_license_model, public_simple_retro_desk_lamp_license_model, public_spiderman_no_way_home_license_model, public_white_gaming_chair_license_model, public_faber_castell_ballpoint_pen_license_cc_by_4_0 [EXTRACTED 1.00]

## Communities (19 total, 11 thin omitted)

### Community 0 - "Phone & Showcase Apps"
Cohesion: 0.11
Nodes (27): remotion, @remotion/player, ContactForm(), formatDate(), formatTime(), PhoneExperience(), LEVEL_BADGE, Showcase() (+19 more)

### Community 1 - "3D Desk Scene Builder"
Cohesion: 0.12
Nodes (23): simple retro Desk Lamp (3D Model), three, PhonePage, add(), box(), buildDesk(), DeskSetup, std() (+15 more)

### Community 2 - "Package Dependencies & Scripts"
Cohesion: 0.09
Nodes (22): dependencies, react, react-dom, remotion, @remotion/player, three, name, private (+14 more)

### Community 3 - "HUD, Camera & Sound"
Cohesion: 0.26
Nodes (17): Desktop(), Hud(), easeInOut(), Scene(), getCtx(), isSoundOn(), listeners, playHidupJokowi() (+9 more)

### Community 4 - "App Boot & Loader"
Cohesion: 0.24
Nodes (8): react, react-dom, App(), BOOT_LOGS, Loader(), today(), playBiosBeep(), playBootBlip()

### Community 5 - "Desktop OS & Portfolio Data"
Cohesion: 0.21
Nodes (9): Clock(), Icon(), APPS, ASSET_CREDITS, CONTENT, SCREEN_H, SCREEN_W, AppId (+1 more)

### Community 6 - "TypeScript Compiler Configuration"
Cohesion: 0.17
Nodes (11): compilerOptions, isolatedModules, jsx, lib, module, moduleResolution, noEmit, skipLibCheck (+3 more)

### Community 7 - "Build & Dev Tooling"
Cohesion: 0.22
Nodes (9): devDependencies, tailwindcss, @tailwindcss/vite, @types/react, @types/react-dom, @types/three, typescript, vite (+1 more)

## Knowledge Gaps
- **21 isolated node(s):** `@types/react`, `@types/react-dom`, `@types/three`, `tailwindcss`, `typescript` (+16 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 69 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App Boot & Loader` to `Phone & Showcase Apps`, `3D Desk Scene Builder`, `Package Dependencies & Scripts`, `HUD, Camera & Sound`, `Desktop OS & Portfolio Data`?**
  _High betweenness centrality (0.216) - this node is a cross-community bridge._
- **What connects `@types/react`, `@types/react-dom`, `@types/three` to the rest of the system?**
  _21 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Phone & Showcase Apps` be split into smaller, more focused modules?**
  _Cohesion score 0.11229946524064172 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `Build & Dev Tooling` to `Package Dependencies & Scripts`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `3D Desk Scene Builder` be split into smaller, more focused modules?**
  _Cohesion score 0.11576354679802955 - nodes in this community are weakly interconnected._
- **Why does `three` connect `3D Desk Scene Builder` to `Package Dependencies & Scripts`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Should `Package Dependencies & Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.09057971014492754 - nodes in this community are weakly interconnected._