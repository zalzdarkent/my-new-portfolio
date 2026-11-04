import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import * as THREE from 'three'
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import Desktop, { SCREEN_W, SCREEN_H } from './Desktop'
import Hud from './Hud'

export type Mode = 'overview' | 'desk' | 'screen'

// Monitor screen in world units (4:3), facing +z. Units are roughly metres.
const SCREEN = { w: 0.3, h: 0.225, center: new THREE.Vector3(0.15, 1.115, 0.102) }
const INTRO = new THREE.Vector3(-6, 6.5, 9.5)
const VIEWS = {
  overview: { pos: new THREE.Vector3(-3.1, 3.2, 4.9), look: new THREE.Vector3(0.12, 0.55, 0.1), fit: 1.3 },
  desk: { pos: new THREE.Vector3(-0.1, 1.2, 1.5), look: new THREE.Vector3(-0.06, 0.98, 0), fit: 1.5 },
}

// Palette sampled from the original's desk scene
const C = {
  top: 0x3d3939, metal: 0xc6c6c6, drawer: 0xd4d4d2, black: 0x232527, beige: 0xdedbd3, keys: 0xeae8e1,
  tray: 0xaa9e90, paper: 0xf5f4f0, binder: 0x4d3429, mug: 0xf4f4f1, coffee: 0x2b1a10,
  leaf: 0x5f9f68, pot: 0xefefed, chair: 0x8b5a32, post: 0x8f9396,
}

const std = (color: number, roughness = 0.65, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness })

function add<T extends THREE.Object3D>(parent: THREE.Object3D, obj: T, x = 0, y = 0, z = 0): T {
  obj.position.set(x, y, z)
  obj.traverse((o) => { o.castShadow = o.receiveShadow = true })
  parent.add(obj)
  return obj
}
const box = (w: number, h: number, d: number, color: number, r = 0) =>
  new THREE.Mesh(r ? new RoundedBoxGeometry(w, h, d, 3, r) : new THREE.BoxGeometry(w, h, d), std(color))

// A sheet of paper with grey "text" lines drawn on it.
function paperTexture() {
  const c = document.createElement('canvas')
  c.width = 210
  c.height = 297
  const g = c.getContext('2d')!
  g.fillStyle = '#f7f6f2'
  g.fillRect(0, 0, 210, 297)
  g.fillStyle = '#9a9a9a'
  for (let y = 30; y < 270; y += 11) g.fillRect(22, y, 60 + ((y * 37) % 100), 3)
  return new THREE.CanvasTexture(c)
}

function buildDesk(scene: THREE.Scene) {
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.13 }))
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)

  // Desk: dark top, grey metal legs, two-drawer pedestal on the left, side panel on the right
  add(scene, box(1.6, 0.035, 0.75, C.top, 0.008), 0, 0.7425, 0)
  for (const x of [-0.76, 0.76]) for (const z of [-0.33, 0.33]) add(scene, box(0.04, 0.725, 0.04, C.metal), x, 0.3625, z)
  add(scene, box(0.42, 0.3, 0.66, C.metal), -0.52, 0.575, 0)
  for (const y of [0.65, 0.5]) {
    add(scene, box(0.4, 0.135, 0.012, C.drawer, 0.004), -0.52, y, 0.336)
    add(scene, box(0.12, 0.012, 0.02, C.black), -0.52, y + 0.03, 0.35)
  }
  add(scene, box(0.02, 0.3, 0.66, C.metal), 0.76, 0.575, 0)

  // Computer: desktop case, CRT monitor, keyboard, mouse
  add(scene, box(0.46, 0.13, 0.4, C.beige, 0.012), 0.15, 0.825, -0.06)
  add(scene, box(0.12, 0.012, 0.004, C.black), 0.27, 0.8, 0.141)
  const led = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.006, 0.004), new THREE.MeshBasicMaterial({ color: 0x33dd66 }))
  add(scene, led, 0.36, 0.86, 0.141)
  const btn = add(scene, new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.006, 16), std(0xcfccc4)), 0.0, 0.835, 0.141)
  btn.rotation.x = Math.PI / 2

  const monitor = new THREE.Group()
  add(monitor, new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.03, 24), std(C.beige)), 0.15, 0.905, -0.03)
  add(monitor, box(0.42, 0.36, 0.14, C.beige, 0.02), 0.15, 1.1, 0.03)
  const back = add(monitor, new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.11, 0.22, 4, 1), std(C.beige)), 0.15, 1.09, -0.15)
  back.rotation.set(Math.PI / 2, Math.PI / 4, 0)
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(SCREEN.w + 0.012, SCREEN.h + 0.012), new THREE.MeshBasicMaterial({ color: 0x1b2120 }))
  glass.position.set(SCREEN.center.x, SCREEN.center.y, 0.1005)
  monitor.add(glass)
  add(monitor, new THREE.Mesh(new THREE.SphereGeometry(0.006, 12, 8), std(0x555555)), 0.33, 0.955, 0.1)
  scene.add(monitor)

  add(scene, box(0.44, 0.025, 0.15, C.beige, 0.008), 0.15, 0.7725, 0.22)
  const keys = new THREE.InstancedMesh(new THREE.BoxGeometry(0.02, 0.012, 0.02), std(C.keys, 0.5), 17 * 5)
  const m4 = new THREE.Matrix4()
  for (let i = 0; i < 85; i++) keys.setMatrixAt(i, m4.makeTranslation(-0.05 + (i % 17) * 0.0245, 0.788, 0.168 + Math.floor(i / 17) * 0.025))
  add(scene, keys)
  const mouse = add(scene, new THREE.Mesh(new THREE.CapsuleGeometry(0.022, 0.03, 4, 12), std(C.beige)), 0.46, 0.772, 0.23)
  mouse.rotation.x = Math.PI / 2
  mouse.scale.set(1, 1, 0.55)

  // Paper trays (stacked), paper stack, a loose sheet
  const tray = (y: number, stack: number) => {
    const g = new THREE.Group()
    add(g, box(0.26, 0.008, 0.34, C.tray), 0, 0.004, 0)
    for (const x of [-0.126, 0.126]) add(g, box(0.008, 0.05, 0.34, C.tray), x, 0.025, 0)
    add(g, box(0.26, 0.05, 0.008, C.tray), 0, 0.025, -0.166)
    add(g, box(0.26, 0.018, 0.008, C.tray), 0, 0.009, 0.166)
    add(g, box(0.22, stack, 0.3, C.paper), 0, 0.008 + stack / 2, 0)
    return add(scene, g, -0.6, y, -0.04)
  }
  tray(0.76, 0.03)
  tray(0.818, 0.05).rotation.y = 0.04
  add(scene, box(0.21, 0.06, 0.29, C.paper, 0.002), -0.3, 0.79, -0.02).rotation.y = 0.06
  const sheet = add(scene, new THREE.Mesh(new THREE.PlaneGeometry(0.21, 0.297), new THREE.MeshStandardMaterial({ map: paperTexture(), roughness: 0.9 })), -0.33, 0.7615, 0.2)
  sheet.rotation.set(-Math.PI / 2, 0, 0.5)

  // Binders with a ring hole on the spine, white mug of coffee
  ;[[0.6, -0.04], [0.68, 0.07]].forEach(([x, tilt]) => {
    const g = new THREE.Group()
    add(g, box(0.055, 0.3, 0.25, C.binder, 0.004), 0, 0.15, 0)
    add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 0.004, 20), std(0xf2f2f2)), 0, 0.08, 0.126).rotation.x = Math.PI / 2
    add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.006, 20), std(0x2a2a2a)), 0, 0.08, 0.127).rotation.x = Math.PI / 2
    g.rotation.z = tilt
    add(scene, g, x, 0.76, -0.2)
  })
  const mug = new THREE.Group()
  const mugMat = new THREE.MeshStandardMaterial({ color: C.mug, roughness: 0.35, side: THREE.DoubleSide })
  add(mug, new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.036, 0.095, 28, 1, true), mugMat), 0, 0.0475, 0)
  add(mug, new THREE.Mesh(new THREE.CircleGeometry(0.036, 28), mugMat), 0, 0.002, 0).rotation.x = -Math.PI / 2
  add(mug, new THREE.Mesh(new THREE.CircleGeometry(0.038, 28), std(C.coffee, 0.2)), 0, 0.08, 0).rotation.x = -Math.PI / 2
  add(mug, new THREE.Mesh(new THREE.TorusGeometry(0.024, 0.007, 10, 20, Math.PI), mugMat), 0.04, 0.05, 0).rotation.z = -Math.PI / 2
  add(scene, mug, 0.6, 0.76, 0.08).rotation.y = 0.5

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
  add(scene, plant, 1.05, 0, -0.32)

  // Office chair: brown seat and back, metal post, black five-star base on casters
  const chair = new THREE.Group()
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2
    const leg = add(chair, box(0.28, 0.025, 0.035, C.black), Math.cos(a) * 0.14, 0.06, Math.sin(a) * 0.14)
    leg.rotation.y = -a
    add(chair, new THREE.Mesh(new THREE.SphereGeometry(0.024, 12, 8), std(C.black, 0.4)), Math.cos(a) * 0.27, 0.024, Math.sin(a) * 0.27)
  }
  add(chair, new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.03, 0.32, 16), std(0x3a3d40, 0.3, 0.6)), 0, 0.22, 0)
  add(chair, box(0.24, 0.03, 0.24, C.black), 0, 0.385, 0)
  add(chair, box(0.46, 0.08, 0.44, C.chair, 0.035), 0, 0.44, 0)
  add(chair, box(0.05, 0.03, 0.2, C.post), 0, 0.39, 0.2)
  add(chair, box(0.05, 0.42, 0.03, C.post), 0, 0.6, 0.29)
  add(chair, box(0.42, 0.32, 0.07, C.chair, 0.03), 0, 0.8, 0.27).rotation.x = -0.12
  chair.rotation.y = 1.35
  add(scene, chair, 0.45, 0, 0.56)

  // Soft studio lighting
  scene.add(new THREE.HemisphereLight(0xffffff, 0xcfcac4, 1.5))
  const key = new THREE.DirectionalLight(0xffffff, 2.4)
  key.position.set(0.6, 5, 1.6)
  key.castShadow = true
  key.shadow.mapSize.set(2048, 2048)
  Object.assign(key.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2, near: 0.5, far: 10 })
  key.shadow.radius = 8
  key.shadow.bias = -0.0005
  key.shadow.normalBias = 0.02
  scene.add(key)
  const fill = new THREE.DirectionalLight(0xffffff, 0.7)
  fill.position.set(-3, 2, 2)
  scene.add(fill)

  const life = (t: number) => {
    leaves.forEach((l, i) => (l.rotation.x = Math.sin(t * 0.9 + i) * 0.03))
    led.visible = Math.sin(t * 9) + Math.sin(t * 5.3) > -0.6
  }
  return { monitor, life }
}

const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

export default function Scene() {
  const host = useRef<HTMLDivElement>(null)
  const screenEl = useMemo(() => {
    const el = document.createElement('div')
    el.style.width = `${SCREEN_W}px`
    el.style.height = `${SCREEN_H}px`
    el.style.pointerEvents = 'auto'
    return el
  }, [])
  const [mode, setMode] = useState<Mode>('overview')
  const modeRef = useRef<Mode>('overview')
  modeRef.current = mode

  useEffect(() => {
    const root = host.current!
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.02, 60)
    camera.position.copy(INTRO)
    const look = VIEWS.overview.look.clone()

    const gl = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    gl.setPixelRatio(Math.min(devicePixelRatio, 2))
    gl.shadowMap.enabled = true
    gl.shadowMap.type = THREE.PCFSoftShadowMap
    gl.toneMapping = THREE.NeutralToneMapping
    root.appendChild(gl.domElement)

    const css = new CSS3DRenderer()
    css.domElement.className = 'css3d'
    root.appendChild(css.domElement)
    const cssScene = new THREE.Scene()
    const screenObj = new CSS3DObject(screenEl)
    screenObj.position.copy(SCREEN.center)
    screenObj.scale.setScalar(SCREEN.w / SCREEN_W)
    cssScene.add(screenObj)

    const { monitor, life } = buildDesk(scene)

    // Drag to turn around the desk in the overview
    const controls = new OrbitControls(camera, gl.domElement)
    Object.assign(controls, {
      enabled: false, enableDamping: true, dampingFactor: 0.08, enablePan: false, rotateSpeed: 0.6,
      minDistance: 2.4, maxDistance: 9, minPolarAngle: 0.35, maxPolarAngle: 1.4,
      minAzimuthAngle: -1.35, maxAzimuthAngle: 1.35,
    })

    const resize = () => {
      camera.aspect = innerWidth / innerHeight
      camera.updateProjectionMatrix()
      gl.setSize(innerWidth, innerHeight)
      css.setSize(innerWidth, innerHeight)
    }
    resize()
    addEventListener('resize', resize)

    // Pull the camera back on narrow (portrait) screens so the desk still fits.
    const viewPos = (v: (typeof VIEWS)['desk'], out: THREE.Vector3) =>
      out.copy(v.pos).sub(v.look).multiplyScalar(Math.max(1, v.fit / camera.aspect)).add(v.look)
    const zoomPos = (out: THREE.Vector3) => {
      const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
      const d = Math.max(SCREEN.h / 2 / t, SCREEN.w / 2 / (t * camera.aspect)) * 1.05
      return out.copy(SCREEN.center).add(new THREE.Vector3(0, 0, d))
    }

    const pointer = new THREE.Vector2()
    const onMove = (e: PointerEvent) => pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1)
    addEventListener('pointermove', onMove)

    // A click (not a drag) moves between the views.
    const ray = new THREE.Raycaster()
    let down = { x: 0, y: 0 }
    const onDown = (e: PointerEvent) => (down = { x: e.clientX, y: e.clientY })
    const onUp = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return
      const m = modeRef.current
      if (m === 'overview') return setMode('desk')
      ray.setFromCamera(new THREE.Vector2((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1), camera)
      const hit = ray.intersectObject(monitor, true).length > 0
      if (m === 'desk' && hit) setMode('screen')
      if (m === 'screen' && !hit) setMode('desk')
    }
    gl.domElement.addEventListener('pointerdown', onDown)
    gl.domElement.addEventListener('pointerup', onUp)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && modeRef.current === 'screen' && setMode('desk')
    addEventListener('keydown', onKey)

    // Every move is an eased tween from where the camera is to the goal of the current view.
    const goal = new THREE.Vector3()
    const goalLook = new THREE.Vector3()
    const from = camera.position.clone()
    const fromLook = look.clone()
    const smooth = new THREE.Vector2()
    const toCam = new THREE.Vector3()
    let current: Mode = 'overview'
    let t0 = 0
    let dur = 3.2
    const clock = new THREE.Clock()
    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(clock.getDelta(), 0.1)
      const t = clock.elapsedTime
      if (modeRef.current !== current) {
        current = modeRef.current
        controls.enabled = false
        from.copy(camera.position)
        fromLook.copy(look)
        t0 = t
        dur = 1.8
      }
      smooth.lerp(pointer, 1 - Math.pow(0.05, dt))
      const p = easeInOut(Math.min(1, (t - t0) / dur))

      if (current === 'overview' && p >= 1) {
        if (!controls.enabled) {
          controls.target.copy(look)
          controls.enabled = true
        }
        controls.update()
        look.copy(controls.target)
      } else {
        if (current === 'screen') {
          zoomPos(goal)
          goalLook.copy(SCREEN.center)
        } else if (current === 'desk') {
          viewPos(VIEWS.desk, goal).add(new THREE.Vector3(smooth.x * 0.08, smooth.y * 0.04, 0))
          goalLook.copy(VIEWS.desk.look)
        } else {
          viewPos(VIEWS.overview, goal)
          goalLook.copy(VIEWS.overview.look)
        }
        camera.position.lerpVectors(from, goal, p)
        look.lerpVectors(fromLook, goalLook, p)
        camera.lookAt(look)
      }

      // The HTML screen always draws on top, so hide it when looking from behind the monitor.
      toCam.copy(camera.position).sub(SCREEN.center)
      screenEl.style.visibility = toCam.z > 0.05 ? 'visible' : 'hidden'

      life(t)
      gl.render(scene, camera)
      css.render(cssScene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', resize)
      removeEventListener('pointermove', onMove)
      removeEventListener('keydown', onKey)
      controls.dispose()
      gl.dispose()
      gl.domElement.remove()
      css.domElement.remove()
    }
  }, [screenEl])

  return (
    <div className="scene" ref={host}>
      {createPortal(
        <Desktop zoomed={mode === 'screen'} onEnter={() => setMode(mode === 'overview' ? 'desk' : 'screen')} />,
        screenEl,
      )}
      <p className={`begin${mode === 'overview' ? '' : ' off'}`}>
        Click anywhere to begin <span className="blink">_</span>
      </p>
      <Hud show={mode === 'desk'} onOverview={() => setMode('overview')} />
    </div>
  )
}
