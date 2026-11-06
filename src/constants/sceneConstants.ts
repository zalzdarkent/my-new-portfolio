import * as THREE from 'three'

export const DESK_BACK_OFFSET = 0.12

// Exact inner bezel opening of the Gigabyte monitor in world units:
// X: [-0.3598, 0.2371] -> width = 0.5969, center.x = -0.06135
// Y: [0.8546, 1.1804]  -> height = 0.3268, center.y = 1.0173
export const SCREEN = {
  w: 0.597,
  h: 0.3268,
  center: new THREE.Vector3(-0.06135, 1.0173, 0.053 - DESK_BACK_OFFSET),
  rotX: -0.0698,
}

export const INTRO = new THREE.Vector3(-6, 6.5, 9.5)

export const VIEWS = {
  overview: { pos: new THREE.Vector3(-3.1, 3.2, 4.9), look: new THREE.Vector3(0.05, 0.65, 0.1 - DESK_BACK_OFFSET), fit: 1.3 },
  desk: { pos: new THREE.Vector3(-0.06, 1.04, 1.15 - DESK_BACK_OFFSET), look: new THREE.Vector3(-0.06, 1.012, 0.05 - DESK_BACK_OFFSET), fit: 1.35 },
}

// Palette sampled from desk scene
export const C = {
  top: 0x3d3939,
  metal: 0xc6c6c6,
  drawer: 0xd4d4d2,
  black: 0x232527,
  beige: 0xdedbd3,
  keys: 0xeae8e1,
  tray: 0xaa9e90,
  paper: 0xf5f4f0,
  binder: 0x4d3429,
  mug: 0xf4f4f1,
  coffee: 0x2b1a10,
  leaf: 0x5f9f68,
  pot: 0xefefed,
}
