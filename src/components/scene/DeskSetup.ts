import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { C, SCREEN } from '../../constants/sceneConstants'

const std = (color: number, roughness = 0.65, metalness = 0) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness })

function add<T extends THREE.Object3D>(parent: THREE.Object3D, obj: T, x = 0, y = 0, z = 0): T {
  obj.position.set(x, y, z)
  obj.traverse((o) => {
    o.castShadow = o.receiveShadow = true
  })
  parent.add(obj)
  return obj
}

const box = (w: number, h: number, d: number, color: number, r = 0) =>
  new THREE.Mesh(r ? new RoundedBoxGeometry(w, h, d, 3, r) : new THREE.BoxGeometry(w, h, d), std(color))

export interface DeskSetup {
  monitor: THREE.Group
  life: (t: number) => void
}

export function buildDesk(scene: THREE.Scene, onModelsReady: () => void): DeskSetup {
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.13 }))
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)

  // Desk: dark top, grey metal legs, two-drawer pedestal on the left, side panel on the right
  add(scene, box(1.8, 0.035, 0.8, C.top, 0.008), 0, 0.7425, 0)
  for (const x of [-0.85, 0.85]) {
    for (const z of [-0.35, 0.35]) {
      add(scene, box(0.04, 0.725, 0.04, C.metal), x, 0.3625, z)
    }
  }
  add(scene, box(0.42, 0.3, 0.7, C.metal), -0.62, 0.575, 0)
  for (const y of [0.65, 0.5]) {
    add(scene, box(0.4, 0.135, 0.012, C.drawer, 0.004), -0.62, y, 0.356)
    add(scene, box(0.12, 0.012, 0.02, C.black), -0.62, y + 0.03, 0.37)
  }
  add(scene, box(0.02, 0.3, 0.7, C.metal), 0.85, 0.575, 0)

  // Interactive target monitor group for clicks/zooming
  const monitorHitbox = new THREE.Group()
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(SCREEN.w, SCREEN.h),
    new THREE.MeshBasicMaterial({ color: 0x1d0718 }),
  )
  glass.position.copy(SCREEN.center)
  glass.rotation.x = SCREEN.rotX
  monitorHitbox.add(glass)
  scene.add(monitorHitbox)

  // Load both Gaming PC Setup and Gaming Chair in parallel before start screen finishes
  const gltfLoader = new GLTFLoader()
  const screenBackMat = new THREE.MeshBasicMaterial({ color: 0x1d0718 })

  Promise.all([
    gltfLoader.loadAsync('./gaming-pc/scene.gltf'),
    gltfLoader.loadAsync('./gaming_chair/scene.gltf'),
  ])
    .then(([pcGltf, chairGltf]) => {
      const pcModel = pcGltf.scene

      pcModel.traverse((child) => {
        // Hide the stock wood desk from the gaming-pc GLTF model
        if (child.name === 'Cube_0' || child.name === 'Object_4' || child.name.toLowerCase().includes('table')) {
          child.visible = false
        }
        // Replace the old GTR car wallpaper mesh on the monitor with dark Ubuntu backing
        if (
          child.name === 'MY SCREEN_142' ||
          child.name === 'Object_288' ||
          child.name === 'gallerymodel_139' ||
          child.name === 'Object_282' ||
          child.name === 'bg2_141' ||
          child.name === 'Object_286'
        ) {
          if (child instanceof THREE.Mesh) {
            child.material = screenBackMat
          }
        }
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
          child.frustumCulled = false
        }
      })

      const S = 0.6
      pcModel.scale.setScalar(S)
      pcModel.rotation.y = -Math.PI / 2
      pcModel.position.set(0.22, 0.7355, 0.18)
      monitorHitbox.add(pcModel)

      const chairModel = chairGltf.scene
      chairModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
          child.frustumCulled = false
        }
      })

      const chairScale = 0.034
      chairModel.scale.setScalar(chairScale)
      // Rotated 90 degrees to the left (facing -X towards the left/desk)
      chairModel.rotation.y = -Math.PI / 2 - 0.2
      chairModel.position.set(0.45, 0.58, 0.92)
      scene.add(chairModel)

      onModelsReady()
    })
    .catch((err) => {
      console.error('Error loading GLTF models:', err)
      onModelsReady()
    })

  // Paper trays (stacked) on the far left of the desk, clear of the left speaker
  const tray = (y: number, stack: number) => {
    const g = new THREE.Group()
    add(g, box(0.26, 0.008, 0.34, C.tray), 0, 0.004, 0)
    for (const x of [-0.126, 0.126]) add(g, box(0.008, 0.05, 0.34, C.tray), x, 0.025, 0)
    add(g, box(0.26, 0.05, 0.008, C.tray), 0, 0.025, -0.166)
    add(g, box(0.26, 0.018, 0.008, C.tray), 0, 0.009, 0.166)
    add(g, box(0.22, stack, 0.3, C.paper), 0, 0.008 + stack / 2, 0)
    return add(scene, g, -0.73, y, -0.14)
  }
  tray(0.76, 0.03)
  tray(0.818, 0.05).rotation.y = 0.04

  // White mug of coffee placed comfortably to the left, well clear of the keyboard and speaker
  const mug = new THREE.Group()
  const mugMat = new THREE.MeshStandardMaterial({ color: C.mug, roughness: 0.35, side: THREE.DoubleSide })
  add(mug, new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.036, 0.095, 28, 1, true), mugMat), 0, 0.0475, 0)
  add(mug, new THREE.Mesh(new THREE.CircleGeometry(0.036, 28), mugMat), 0, 0.002, 0).rotation.x = -Math.PI / 2
  add(mug, new THREE.Mesh(new THREE.CircleGeometry(0.038, 28), std(C.coffee, 0.2)), 0, 0.08, 0).rotation.x = -Math.PI / 2
  add(mug, new THREE.Mesh(new THREE.TorusGeometry(0.024, 0.007, 10, 20, Math.PI), mugMat), 0.04, 0.05, 0).rotation.z = -Math.PI / 2
  add(scene, mug, -0.54, 0.76, 0.22).rotation.y = 2.4

  // Plant in a white pot behind the right end of the desk
  const plant = new THREE.Group()
  add(plant, new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.12, 0.42, 28), std(C.pot, 0.5)), 0, 0.21, 0)
  add(plant, new THREE.Mesh(new THREE.CircleGeometry(0.14, 24), std(0x3a2c22, 1)), 0, 0.415, 0).rotation.x = -Math.PI / 2
  const leafShape = new THREE.Shape()
  leafShape.moveTo(0, 0)
  leafShape.quadraticCurveTo(0.1, 0.12, 0, 0.34)
  leafShape.quadraticCurveTo(-0.1, 0.12, 0, 0)
  const leafGeo = new THREE.ShapeGeometry(leafShape, 8)
  const leafMat = new THREE.MeshStandardMaterial({ color: C.leaf, roughness: 0.6, side: THREE.DoubleSide })
  const stemMat = std(0x4f7f50)
  const leaves: THREE.Group[] = []
  for (let i = 0; i < 14; i++) {
    const stemLen = 0.35 + ((i * 7) % 5) * 0.12
    const arm = new THREE.Group()
    arm.rotation.y = i * 2.4
    const lean = new THREE.Group()
    lean.rotation.z = 0.25 + ((i * 3) % 4) * 0.12
    add(lean, new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.008, stemLen, 6), stemMat), 0, stemLen / 2, 0)
    const leaf = add(lean, new THREE.Mesh(leafGeo, leafMat), 0, stemLen, 0)
    leaf.rotation.set(0.3, 0, -1.1 - ((i * 5) % 3) * 0.2)
    leaf.scale.setScalar(1.35)
    arm.add(lean)
    plant.add(arm)
    leaves.push(lean)
  }
  add(scene, plant, 1.15, 0, -0.32)

  // Soft studio lighting
  scene.add(new THREE.HemisphereLight(0xffffff, 0xcfcac4, 1.6))
  const key = new THREE.DirectionalLight(0xffffff, 2.5)
  key.position.set(0.6, 5, 2.0)
  key.castShadow = true
  key.shadow.mapSize.set(2048, 2048)
  Object.assign(key.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2, near: 0.5, far: 10 })
  key.shadow.radius = 6
  key.shadow.bias = -0.0005
  key.shadow.normalBias = 0.02
  scene.add(key)
  const fill = new THREE.DirectionalLight(0xffffff, 0.8)
  fill.position.set(-3, 2, 2)
  scene.add(fill)

  const life = (t: number) => {
    leaves.forEach((l, i) => (l.rotation.x = Math.sin(t * 0.9 + i) * 0.03))
  }
  return { monitor: monitorHitbox, life }
}
