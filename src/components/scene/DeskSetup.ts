import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { C, DESK_BACK_OFFSET, SCREEN } from '../../constants/sceneConstants'

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

export function buildDesk(
  scene: THREE.Scene,
  onModelsReady: () => void,
  onPhoneScreenReady: (screen: THREE.Mesh) => void,
): DeskSetup {
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

  // Interactive target monitor group for clicks/zooming.
  // Uses NoBlending with opacity 0 to punch a depth-tested transparent hole in the WebGL canvas,
  // revealing the CSS3DRenderer Ubuntu screen underneath while allowing 3D objects in front
  // (PC case, gaming chair, mug, speakers) to occlude the screen pixel-by-pixel!
  const holeMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    opacity: 0,
    blending: THREE.NoBlending,
    side: THREE.FrontSide,
  })
  const monitorHitbox = new THREE.Group()
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(SCREEN.w, SCREEN.h), holeMat)
  glass.position.copy(SCREEN.center)
  glass.rotation.x = SCREEN.rotX
  glass.castShadow = false
  glass.receiveShadow = false
  monitorHitbox.add(glass)
  scene.add(monitorHitbox)

  // Load desk assets in parallel before start screen finishes
  const gltfLoader = new GLTFLoader()

  Promise.all([
    gltfLoader.loadAsync('./gaming-pc/scene.gltf'),
    gltfLoader.loadAsync('./white_gaming_chair/scene.gltf'),
    gltfLoader.loadAsync('./simple_retro_desk_lamp/scene.gltf'),
    gltfLoader.loadAsync('./phone_holder/scene.gltf'),
    gltfLoader.loadAsync('./iphone_16/scene.gltf'),
    gltfLoader.loadAsync('./notebook_blackwhite/scene.gltf'),
    gltfLoader.loadAsync('./faber_castell_ballpoint_pen/scene.gltf'),
  ])
    .then(([pcGltf, chairGltf, lampGltf, phoneHolderGltf, iphoneGltf, notebookGltf, penGltf]) => {
      const pcModel = pcGltf.scene

      pcModel.traverse((child) => {
        // Hide the stock wood desk and old screen overlay stickers from the gaming-pc GLTF model
        if (
          child.name === 'Cube_0' ||
          child.name === 'Object_4' ||
          child.name.toLowerCase().includes('table') ||
          child.name === 'gallerymodel_139' ||
          child.name === 'Object_282' ||
          child.name === 'bg2_141' ||
          child.name === 'Object_286'
        ) {
          child.visible = false
        }
        // Replace the old GTR car wallpaper mesh on the monitor with the NoBlending hole-punch material
        if (child.name === 'MY SCREEN_142' || child.name === 'Object_288') {
          if (child instanceof THREE.Mesh) {
            child.material = holeMat
            child.castShadow = false
            child.receiveShadow = false
          }
        } else if (child instanceof THREE.Mesh) {
          const mats = Array.isArray(child.material) ? child.material : [child.material]
          for (const m of mats) {
            if (m) {
              m.transparent = false
              m.depthWrite = true
            }
          }
          child.castShadow = true
          child.receiveShadow = true
          child.frustumCulled = true
        }
      })

      const S = 0.6
      pcModel.scale.setScalar(S)
      pcModel.rotation.y = -Math.PI / 2
      pcModel.position.set(0.22, 0.7355, 0.18 - DESK_BACK_OFFSET)
      monitorHitbox.add(pcModel)

      const chairModel = chairGltf.scene
      chairModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mats = Array.isArray(child.material) ? child.material : [child.material]
          for (const m of mats) {
            if (m) {
              m.transparent = false
              m.depthWrite = true
            }
          }
          child.castShadow = true
          child.receiveShadow = true
          child.frustumCulled = true
        }
      })

      const chairScale = 0.75
      chairModel.scale.setScalar(chairScale)
      // Rotated 90 degrees to the left (facing -X towards the left/desk)
      chairModel.rotation.y = -Math.PI / 2 - 0.2
      chairModel.position.set(0.45, 0.02, 0.92)
      scene.add(chairModel)

      const lampModel = lampGltf.scene
      lampModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mats = Array.isArray(child.material) ? child.material : [child.material]
          for (const m of mats) {
            if (m) {
              m.transparent = false
              m.depthWrite = true
            }
          }
          child.castShadow = true
          child.receiveShadow = true
          child.frustumCulled = true
        }
      })

      const lampBounds = new THREE.Box3().setFromObject(lampModel)
      const lampSize = lampBounds.getSize(new THREE.Vector3())
      lampModel.scale.setScalar(0.52 / Math.max(lampSize.x, lampSize.y, lampSize.z))
      lampModel.rotation.y = Math.PI
      lampModel.position.set(-0.68, 0.765, 0.02 - DESK_BACK_OFFSET)
      scene.add(lampModel)

      const frontDeskLamp = lampGltf.scene.clone(true)
      frontDeskLamp.scale.setScalar(0.52 / Math.max(lampSize.x, lampSize.y, lampSize.z))
      frontDeskLamp.rotation.y = Math.PI / 2
      frontDeskLamp.position.set(0.8, 0.765, 0.02 - DESK_BACK_OFFSET)
      frontDeskLamp.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
          child.frustumCulled = true
        }
      })
      scene.add(frontDeskLamp)

      const lampLight = new THREE.PointLight(0xffc98a, 2.2, 2.2, 2)
      lampLight.position.set(-0.68, 1.12, 0.04 - DESK_BACK_OFFSET)
      lampLight.castShadow = true
      scene.add(lampLight)

      const frontLampLight = new THREE.PointLight(0xffc98a, 1.8, 2.2, 2)
      frontLampLight.position.set(0.8, 1.12, 0.2 - DESK_BACK_OFFSET)
      scene.add(frontLampLight)

      const phoneHolder = phoneHolderGltf.scene
      phoneHolder.scale.setScalar(0.1)
      phoneHolder.updateMatrixWorld(true)
      const holderBounds = new THREE.Box3().setFromObject(phoneHolder)
      const holderSize = holderBounds.getSize(new THREE.Vector3())
      const holderCenter = holderBounds.getCenter(new THREE.Vector3())
      phoneHolder.position.set(-0.42 - holderCenter.x, 0.76 - holderBounds.min.y, 0.1 - holderCenter.z)
      phoneHolder.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
          child.frustumCulled = true
        }
      })
      scene.add(phoneHolder)

      const iphone = iphoneGltf.scene
      iphone.scale.setScalar(0.01)
      iphone.rotation.x = -Math.PI / 18
      iphone.updateMatrixWorld(true)
      const iphoneBounds = new THREE.Box3().setFromObject(iphone)
      const iphoneCenter = iphoneBounds.getCenter(new THREE.Vector3())
      iphone.position.set(
        -0.42 - iphoneCenter.x,
        0.762 + holderSize.y * 0.36 - iphoneBounds.min.y,
        0.077 - iphoneCenter.z,
      )
      let phoneScreen: THREE.Mesh | null = null
      iphone.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
          child.frustumCulled = true
          // Object_18 is the iPhone's front glass in this GLTF.
          if (child.name === 'Object_18') {
            child.material = holeMat
            phoneScreen = child
          }
        }
      })
      scene.add(iphone)
      scene.updateMatrixWorld(true)
      if (!phoneScreen) throw new Error('Unable to find the iPhone screen mesh (Object_18)')
      onPhoneScreenReady(phoneScreen)

      const notebook = notebookGltf.scene
      notebook.scale.setScalar(0.12)
      notebook.updateMatrixWorld(true)
      const notebookBounds = new THREE.Box3().setFromObject(notebook)
      const notebookCenter = notebookBounds.getCenter(new THREE.Vector3())
      const notebookSize = notebookBounds.getSize(new THREE.Vector3())
      notebook.position.set(-0.75 - notebookCenter.x, 0.76 - notebookBounds.min.y, 0.24 - notebookCenter.z)
      notebook.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
          child.frustumCulled = true
        }
      })
      scene.add(notebook)

      const pen = penGltf.scene
      pen.scale.setScalar(0.019)
      pen.updateMatrixWorld(true)
      const penBounds = new THREE.Box3().setFromObject(pen)
      const penCenter = penBounds.getCenter(new THREE.Vector3())
      const penSize = penBounds.getSize(new THREE.Vector3())
      pen.position.set(
        -0.75 + notebookSize.x / 2 + penSize.x / 2 + 0.02 - penCenter.x,
        0.76 - penBounds.min.y,
        0.24 - penCenter.z,
      )
      pen.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
          child.frustumCulled = true
        }
      })
      scene.add(pen)

      onModelsReady()
    })
    .catch((err) => {
      console.error('Error loading GLTF models:', err)
      onModelsReady()
    })

  // White mug of coffee placed comfortably to the left, well clear of the keyboard and speaker
  const mug = new THREE.Group()
  const mugMat = new THREE.MeshStandardMaterial({ color: C.mug, roughness: 0.35, side: THREE.DoubleSide })
  add(mug, new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.036, 0.095, 28, 1, true), mugMat), 0, 0.0475, 0)
  add(mug, new THREE.Mesh(new THREE.CircleGeometry(0.036, 28), mugMat), 0, 0.002, 0).rotation.x = -Math.PI / 2
  add(mug, new THREE.Mesh(new THREE.CircleGeometry(0.038, 28), std(C.coffee, 0.2)), 0, 0.08, 0).rotation.x = -Math.PI / 2
  add(mug, new THREE.Mesh(new THREE.TorusGeometry(0.024, 0.007, 10, 20, Math.PI), mugMat), 0.04, 0.05, 0).rotation.z = -Math.PI / 2
  add(scene, mug, -0.54, 0.76, 0.22 - DESK_BACK_OFFSET).rotation.y = 2.4

  // Soft low-key lighting
  scene.add(new THREE.HemisphereLight(0xffffff, 0x111114, 0.42))
  const key = new THREE.DirectionalLight(0xffffff, 0.8)
  key.position.set(0.6, 5, 2.0)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  Object.assign(key.shadow.camera, { left: -2.0, right: 2.0, top: 2.0, bottom: -2.0, near: 0.5, far: 9 })
  key.shadow.radius = 3
  key.shadow.bias = -0.0005
  key.shadow.normalBias = 0.02
  scene.add(key)
  const fill = new THREE.DirectionalLight(0xffffff, 0.12)
  fill.position.set(-3, 2, 2)
  scene.add(fill)

  const life = (_t: number) => {}
  return { monitor: monitorHitbox, life }
}
