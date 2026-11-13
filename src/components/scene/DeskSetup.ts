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
  setDarkMode: (dark: boolean) => void
}

export function buildDesk(
  scene: THREE.Scene,
  onModelsReady: () => void,
  onPhoneScreenReady: (screen: THREE.Mesh) => void,
  onSpiderManReady: (model: THREE.Group) => void,
  onSpeakersReady: (speakers: THREE.Group) => void,
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
  let isDark = true
  const lampObjects: THREE.Object3D[] = []
  const lampLights: THREE.PointLight[] = []

  Promise.all([
    gltfLoader.loadAsync('./gaming-pc/scene.gltf'),
    gltfLoader.loadAsync('./white_gaming_chair/scene.gltf'),
    gltfLoader.loadAsync('./simple_retro_desk_lamp/scene.gltf'),
    gltfLoader.loadAsync('./phone_holder/scene.gltf'),
    gltfLoader.loadAsync('./iphone_16/scene.gltf'),
    gltfLoader.loadAsync('./notebook_blackwhite/scene.gltf'),
    gltfLoader.loadAsync('./faber_castell_ballpoint_pen/scene.gltf'),
    gltfLoader.loadAsync('./spiderman_no_way_home/scene.gltf'),
    gltfLoader.loadAsync('./rog/scene.gltf'),
  ])
    .then(([pcGltf, chairGltf, lampGltf, phoneHolderGltf, iphoneGltf, notebookGltf, penGltf, spiderManGltf, rogGltf]) => {
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
      pcModel.updateMatrixWorld(true)

      // Collect desktop speaker parts and create click hitboxes
      const speakersGroup = new THREE.Group()
      const speakerNodeNames = new Set([
        'Object_240', 'Object_256', 'Object_242', 'Object_244',
        'Object_246', 'Object_248', 'Object_250', 'Object_252',
        'Object_254', 'Object_258', 'Object_260', 'Object_262', 'Object_264',
        'Cube081_118', 'Cube088_126', 'Cube068_119', 'Cube069_121',
        'Cube070_128', 'Cube071_129', 'Cube082_130', 'Color-PewDiePie-Logo_120',
        'Cylinder013_122', 'Cylinder014_123', 'Cylinder015_124', 'Text001_125',
      ])

      const speakerMeshes: THREE.Mesh[] = []
      pcModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const parentName = child.parent?.name || ''
          if (
            speakerNodeNames.has(child.name) ||
            speakerNodeNames.has(parentName) ||
            child.name.toLowerCase().includes('pewdiepie') ||
            parentName.toLowerCase().includes('pewdiepie')
          ) {
            speakerMeshes.push(child)
          }
        }
      })

      const leftBox = new THREE.Box3()
      const rightBox = new THREE.Box3()
      speakerMeshes.forEach((mesh) => {
        const b = new THREE.Box3().setFromObject(mesh)
        const c = b.getCenter(new THREE.Vector3())
        if (c.x < -0.05) leftBox.union(b)
        else if (c.x > 0.05) rightBox.union(b)
      })

      const speakerHitboxMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        colorWrite: false,
        depthWrite: false,
        side: THREE.DoubleSide,
      })

      if (!leftBox.isEmpty()) {
        const sz = leftBox.getSize(new THREE.Vector3()).addScalar(0.04)
        const c = leftBox.getCenter(new THREE.Vector3())
        const leftHitbox = new THREE.Mesh(new THREE.BoxGeometry(sz.x, sz.y, sz.z), speakerHitboxMaterial)
        leftHitbox.position.copy(c)
        speakersGroup.add(leftHitbox)
      } else {
        const leftHitbox = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.20, 0.12), speakerHitboxMaterial)
        leftHitbox.position.set(-0.36, 0.84, -0.06 - DESK_BACK_OFFSET)
        speakersGroup.add(leftHitbox)
      }

      if (!rightBox.isEmpty()) {
        const sz = rightBox.getSize(new THREE.Vector3()).addScalar(0.04)
        const c = rightBox.getCenter(new THREE.Vector3())
        const rightHitbox = new THREE.Mesh(new THREE.BoxGeometry(sz.x, sz.y, sz.z), speakerHitboxMaterial)
        rightHitbox.position.copy(c)
        speakersGroup.add(rightHitbox)
      } else {
        const rightHitbox = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.20, 0.12), speakerHitboxMaterial)
        rightHitbox.position.set(0.24, 0.84, -0.06 - DESK_BACK_OFFSET)
        speakersGroup.add(rightHitbox)
      }

      scene.add(speakersGroup)
      onSpeakersReady(speakersGroup)

      // Wrap ROG model in a centered group
      const rogGroup = new THREE.Group()
      const rogModel = rogGltf.scene
      rogModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
          const mats = Array.isArray(child.material) ? child.material : [child.material]
          for (const m of mats) {
            if (m) {
              m.transparent = false
              m.depthWrite = true
            }
          }
        }
      })
      const rogBounds = new THREE.Box3().setFromObject(rogModel)
      const rogSize = rogBounds.getSize(new THREE.Vector3())
      const rogCenter = rogBounds.getCenter(new THREE.Vector3())
      
      // Align model: center X & Y, and place back plane (min Z) exactly at local Z = 0
      rogModel.position.set(-rogCenter.x, -rogCenter.y, -rogBounds.min.z)
      rogGroup.add(rogModel)

      // Panel dimensions: height ~0.295m, depth ~0.325m.
      // Target logo size: ~0.16m wide
      const targetSize = 0.16
      const rogScale = targetSize / Math.max(rogSize.x, rogSize.y)
      rogGroup.scale.setScalar(rogScale)

      // Orient so logo faces +X (towards the right side of the desk)
      // When looking at the panel from +X, +Z is to the left (front of PC), -Z is to the right (back of PC)
      rogGroup.rotation.y = Math.PI / 2
      // Outer surface of right side panel is at x = 0.6355.
      // With min Z at local 0, local +Z extends outward into +X.
      // Placing at x = 0.6365 puts both the emblem and text exactly 1mm flush against the panel.
      rogGroup.position.set(0.6365, 0.9225, -0.0205)
      scene.add(rogGroup)

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
      // PointLight shadows require 6 cubemap passes every frame across 800+ meshes.
      // Disabling castShadow on accent point lights drastically improves 360 rotation FPS.
      lampLight.castShadow = false
      scene.add(lampLight)

      const frontLampLight = new THREE.PointLight(0xffdfb0, 3.8, 3.2, 2)
      frontLampLight.position.set(0.78, 1.10, 0.18)
      frontLampLight.castShadow = false
      scene.add(frontLampLight)

      lampObjects.push(lampModel, frontDeskLamp)
      lampLights.push(lampLight, frontLampLight)

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
          child.receiveShadow = false
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
          } else if (
            child.name === 'Object_12' ||
            child.name === 'Object_14' ||
            child.name === 'Object_16' ||
            child.name === 'Object_100'
          ) {
            // Hide the 3D model's built-in static notch and camera cutouts so they don't
            // clash or stack with the interactive software Dynamic Island in CSS!
            child.visible = false
            child.castShadow = false
            child.receiveShadow = false
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
        -0.84 + notebookSize.x / 2 + penSize.x / 2 + 0.02 - penCenter.x,
        0.76 - penBounds.min.y,
        0.24 - penCenter.z,
      )
      pen.rotation.set(
        THREE.MathUtils.degToRad(0),  // X
        THREE.MathUtils.degToRad(70), // Y
        THREE.MathUtils.degToRad(0),
      )
      pen.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
          child.frustumCulled = true
        }
      })
      scene.add(pen)

      const spiderMan = new THREE.Group()
      const spiderManModel = spiderManGltf.scene
      spiderManModel.updateMatrixWorld(true)
      const character = spiderManModel.getObjectByName('Spiderman_3')
      if (!character) throw new Error('Unable to find the Spider-Man character group')
      const characterBounds = new THREE.Box3().setFromObject(character)
      const characterSize = characterBounds.getSize(new THREE.Vector3())
      spiderManModel.scale.setScalar(0.10 / characterSize.y)
      spiderManModel.updateMatrixWorld(true)
      const spiderManBounds = new THREE.Box3().setFromObject(spiderManModel)
      const spiderManSize = spiderManBounds.getSize(new THREE.Vector3())
      const spiderManCenter = spiderManBounds.getCenter(new THREE.Vector3())
      spiderManModel.position.set(-spiderManCenter.x, -spiderManBounds.min.y, -spiderManCenter.z)
      spiderManModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = false
          child.frustumCulled = true
        }
      })
      spiderMan.add(spiderManModel)
      const hitboxMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        colorWrite: false,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
      const hitbox = new THREE.Mesh(
        new THREE.BoxGeometry(spiderManSize.x, spiderManSize.y, spiderManSize.z),
        hitboxMaterial,
      )
      hitbox.position.y = spiderManSize.y / 2
      spiderMan.add(hitbox)
      spiderMan.position.set(0.7, 0.76, 0.24)
      scene.add(spiderMan)
      scene.updateMatrixWorld(true)

      // Store references to the 3 distinct Spider-Men characters
      spiderMan.userData.spidey1 = spiderManModel.getObjectByName('Spiderman_1') // Tobey Maguire (Right)
      spiderMan.userData.spidey2 = spiderManModel.getObjectByName('Spiderman_2') // Andrew Garfield (Left)
      spiderMan.userData.spidey3 = spiderManModel.getObjectByName('Spiderman_3') // Tom Holland (Center)

      // Dedicated showcase lights for the Spider-Man diorama
      // Front key light: bright, clean illumination directly onto the faces & suits of all 3 Spider-Men
      const spideyKeyLight = new THREE.PointLight(0xfff6ea, 3.2, 1.8, 2)
      spideyKeyLight.position.set(0.70, 1.08, 0.58)
      spideyKeyLight.castShadow = false
      scene.add(spideyKeyLight)

      // Left fill light: brightens Andrew Garfield (Peter-Three) from front-left
      const spideyFillLeft = new THREE.PointLight(0xdff0ff, 2.2, 1.4, 2)
      spideyFillLeft.position.set(0.54, 0.96, 0.46)
      spideyFillLeft.castShadow = false
      scene.add(spideyFillLeft)

      // Right fill light: brightens Tobey Maguire (Peter-Two) and his silver webbing from front-right
      const spideyFillRight = new THREE.PointLight(0xffeedd, 2.2, 1.4, 2)
      spideyFillRight.position.set(0.86, 0.96, 0.46)
      spideyFillRight.castShadow = false
      scene.add(spideyFillRight)

      // Top-back rim light: subtle rim glow to clearly separate the trio from dark background
      const spideyRimLight = new THREE.PointLight(0xffffff, 1.6, 1.2, 2)
      spideyRimLight.position.set(0.70, 1.15, 0.12)
      spideyRimLight.castShadow = false
      scene.add(spideyRimLight)

      lampLights.push(spideyKeyLight, spideyFillLeft, spideyFillRight, spideyRimLight)

      onSpiderManReady(spiderMan)

      applyDarkMode(isDark)
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
  const hemi = new THREE.HemisphereLight(0xffffff, 0x111114, 0.42)
  scene.add(hemi)
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
  const frontStudioFill = new THREE.DirectionalLight(0xffffff, 0)
  frontStudioFill.position.set(2.5, 1.8, 3.0)
  scene.add(frontStudioFill)

  const applyDarkMode = (dark: boolean) => {
    isDark = dark
    for (const obj of lampObjects) obj.visible = dark
    for (const light of lampLights) light.visible = dark
    hemi.groundColor.setHex(dark ? 0x111114 : 0x909098)
    hemi.intensity = dark ? 0.42 : 1.25
    key.intensity = dark ? 0.8 : 1.5
    fill.intensity = dark ? 0.12 : 0.55
    frontStudioFill.intensity = dark ? 0 : 0.75
  }

  const life = (_t: number) => { }
  return { monitor: monitorHitbox, life, setDarkMode: applyDarkMode }
}
