# Implementation Plan: Dark/Light Scene & Desk Lamp Toggle

## Overview
Add a top-right toggle button in the 3D scene HUD to switch between Dark and Light modes. In Dark mode, the background is dark and the desk lamp props and their warm point lights are visible to illuminate the desk. In Light mode, the background is bright studio light, the desk lamp props are hidden, and the desk lamp lights are turned off.

## Architecture Decisions
- **State location**: Manage `darkMode` boolean state (default `true`, matching current dark scene) in `Scene.tsx` and sync it to Three.js via a `setDarkMode(dark: boolean)` method returned by `buildDesk`.
- **Background switching**: Use `gl.setClearColor(0x070709, 1)` in Dark mode and `gl.setClearColor(0x000000, 0)` in Light mode so the existing `.scene` radial-gradient studio backdrop in `src/styles.css` shows through cleanly.
- **Toggle placement**: Render a top-right button with class `hud` (so `Scene.tsx` raycast ignores clicks on it) visible in `overview` and `desk` modes after `started`.

## Task List

### Phase 1: Scene & Lighting Control
- [x] Task 1: Expose `setDarkMode(dark: boolean)` from `DeskSetup.ts` to toggle desk lamps (`lampModel`, `frontDeskLamp`), lamp point lights (`lampLight`, `frontLampLight`), and studio light intensities.
- [x] Task 2: Wire `darkMode` state, `gl.setClearColor`, and top-right toggle button in `Scene.tsx`.

### Checkpoint: Complete
- [x] `npm run build` (`tsc -b && vite build`) passes with zero errors.
- [ ] Toggle switches background, desk lamp visibility, and lighting as specified.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Toggle clicked before GLTF models finish loading | Low | Store `darkMode` ref/flag in `DeskSetup.ts` and apply it right after models load |
| Toggle click triggers 3D raycast to zoom to desk | Med | Add `hud` class to the toggle container so `onUp` ignores it |
