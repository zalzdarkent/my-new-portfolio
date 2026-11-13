# Tasks: Dark/Light Scene & Desk Lamp Toggle

## Task 1: Expose `setDarkMode` in `DeskSetup.ts`
**Description:** Track desk lamp meshes, lamp point lights, and studio lights in `DeskSetup.ts` and expose `setDarkMode(dark: boolean)` on `DeskSetup`.
**Acceptance criteria:**
- [x] `dark = true`: `lampModel` and `frontDeskLamp` visible, `lampLight` and `frontLampLight` enabled, low-key studio lighting.
- [x] `dark = false`: `lampModel` and `frontDeskLamp` hidden, `lampLight` and `frontLampLight` disabled (`visible = false`), bright studio lighting.
- [x] Initial `darkMode` state applies cleanly even if toggled before GLTF models finish loading.
**Verification:**
- [x] `npm run build` passes.
**Dependencies:** None
**Files likely touched:** `src/components/scene/DeskSetup.ts`
**Estimated scope:** Small (1 file)

## Task 2: Add top-right toggle & background switch in `Scene.tsx`
**Description:** Add `darkMode` state in `Scene.tsx`, update `gl.setClearColor` + `deskSetup.setDarkMode(darkMode)`, and render the top-right toggle button.
**Acceptance criteria:**
- [x] Toggle button appears at top-right when `started` is true and `mode` is `'overview'` or `'desk'`.
- [x] Clicking toggle switches between Dark and Light mode without triggering 3D scene click/zoom.
- [x] Dark mode uses `0x070709` opaque clear color; Light mode reveals `.scene` bright studio gradient.
**Verification:**
- [x] `npm run build` passes.
**Dependencies:** Task 1
**Files likely touched:** `src/Scene.tsx`
**Estimated scope:** Small (1 file)

## Checkpoint: Complete
- [x] `npm run build` succeeds (`tsc -b && vite build`).
