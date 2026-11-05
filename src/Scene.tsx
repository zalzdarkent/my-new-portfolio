import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import * as THREE from 'three'
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Desktop, { SCREEN_W, SCREEN_H } from './Desktop'
import Hud from './Hud'
import { playKeyClick, playMouseDown, playMouseUp } from './sound'

export type Mode = 'overview' | 'desk' | 'screen'
const BEGIN_TEXT = 'Click anywhere to begin '

// Exact inner bezel opening of the Gigabyte monitor in world units:
// X: [-0.3598, 0.2371] -> width = 0.5969, center.x = -0.06135
// Y: [0.8671, 1.1929]  -> height = 0.3268, center.y = 1.0298
const SCREEN = {
  w: 0.597,
  h: 0.3268,
  center: new THREE.Vector3(-0.06135, 1.0298, 0.053),
  rotX: -0.0698,
}
const INTRO = new THREE.Vector3(-6, 6.5, 9.5)
const VIEWS = {
  overview: { pos: new THREE.Vector3(-3.1, 3.2, 4.9), look: new THREE.Vector3(0.05, 0.65, 0.1), fit: 1.3 },
  desk: { pos: new THREE.Vector3(-0.06, 1.05, 1.15), look: new THREE.Vector3(-0.06, 1.025, 0.05), fit: 1.35 },
}

// Palette sampled from desk scene
const C = {
  top: 0x3d3939, metal: 0xc6c6c6, drawer: 0xd4d4d2, black: 0x232527, beige: 0xdedbd3, keys: 0xeae8e1,
  tray: 0xaa9e90, paper: 0xf5f4f0, binder: 0x4d3429, mug: 0xf4f4f1, coffee: 0x2b1a10,
  leaf: 0x5f9f68, pot: 0xefefed,
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

function buildDesk(scene: THREE.Scene, onModelsReady: () => void) {
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.13 }))
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)

  // Desk: dark top, grey metal legs, two-drawer pedestal on the left, side panel on the right
  add(scene, box(1.8, 0.035, 0.8, C.top, 0.008), 0, 0.7425, 0)
  for (const x of [-0.85, 0.85]) for (const z of [-0.35, 0.35]) add(scene, box(0.04, 0.725, 0.04, C.metal), x, 0.3625, z)
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
      pcModel.position.set(0.22, 0.748, 0.18)
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

const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

export default function Scene({ started = true, onLoaded }: { started?: boolean; onLoaded?: () => void }) {
  const host = useRef<HTMLDivElement>(null)
  const screenEl = useMemo(() => {
    const el = document.createElement('div')
    el.style.width = `${SCREEN_W}px`
    el.style.height = `${SCREEN_H}px`
    el.style.pointerEvents = 'auto'
    return el
  }, [])
  const [mode, setMode] = useState<Mode>('overview')
  const [typedBegin, setTypedBegin] = useState('')
  const modeRef = useRef<Mode>('overview')
  modeRef.current = mode

  const startedRef = useRef(started)
  startedRef.current = started

  const onLoadedRef = useRef(onLoaded)
  onLoadedRef.current = onLoaded

  // Typewriter effect + mechanical typing sound for "Click anywhere to begin"
  useEffect(() => {
    if (!started || mode !== 'overview') {
      setTypedBegin('')
      return
    }
    let idx = 0
    let intervalId: ReturnType<typeof setInterval> | null = null
    const startDelay = setTimeout(() => {
      intervalId = setInterval(() => {
        idx++
        const nextStr = BEGIN_TEXT.slice(0, idx)
        setTypedBegin(nextStr)
        const ch = BEGIN_TEXT[idx - 1]
        if (ch) playKeyClick(ch === ' ')
        if (idx >= BEGIN_TEXT.length && intervalId) {
          clearInterval(intervalId)
        }
      }, 55)
    }, 650)

    return () => {
      clearTimeout(startDelay)
      if (intervalId) clearInterval(intervalId)
    }
  }, [started, mode])

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
    screenObj.rotation.x = SCREEN.rotX
    // Non-uniform scale so the 1280x720 desktop fills the exact 0.597 x 0.3268 bezel opening
    screenObj.scale.set(SCREEN.w / SCREEN_W, SCREEN.h / SCREEN_H, 1)
    cssScene.add(screenObj)

    const { monitor, life } = buildDesk(scene, () => {
      // Pre-compile shaders and render a warm-up frame to upload all textures to GPU before user clicks START
      gl.compile(scene, camera)
      gl.render(scene, camera)
      css.render(cssScene, camera)
      onLoadedRef.current?.()
    })

    // Drag to turn around the desk in the overview (360 degrees full rotation)
    const controls = new OrbitControls(camera, gl.domElement)
    Object.assign(controls, {
      enabled: false, enableDamping: true, dampingFactor: 0.08, enablePan: false, rotateSpeed: 0.6,
      minDistance: 2.4, maxDistance: 9, minPolarAngle: 0.35, maxPolarAngle: 1.5,
      minAzimuthAngle: -Infinity, maxAzimuthAngle: Infinity,
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
      // Position camera along the monitor's tilted normal so the screen is a flat rectangle
      const ny = -Math.sin(SCREEN.rotX) * d
      const nz = Math.cos(SCREEN.rotX) * d
      return out.copy(SCREEN.center).add(new THREE.Vector3(0, ny, nz))
    }

    const pointer = new THREE.Vector2()
    const onMove = (e: PointerEvent) => pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1)
    addEventListener('pointermove', onMove)

    // A click (not a drag) moves between the views.
    const ray = new THREE.Raycaster()
    let down = { x: 0, y: 0 }
    const onDown = (e: PointerEvent) => {
      down = { x: e.clientX, y: e.clientY }
      playMouseDown()
    }
    const onUp = (e: PointerEvent) => {
      playMouseUp()
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
    let hasStarted = false
    let t0 = 0
    let dur = 3.2
    const clock = new THREE.Clock()
    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(clock.getDelta(), 0.1)
      const t = clock.elapsedTime

      // Hold the intro camera position until the user clicks START
      if (!startedRef.current) {
        t0 = t
        camera.position.copy(INTRO)
        camera.lookAt(VIEWS.overview.look)
        gl.render(scene, camera)
        css.render(cssScene, camera)
        return
      }
      if (!hasStarted) {
        hasStarted = true
        t0 = t
      }

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
      <p className={`begin${started && mode === 'overview' ? '' : ' off'}`}>
        {typedBegin}<span className="blink">_</span>
      </p>
      <Hud show={mode === 'desk'} onOverview={() => setMode('overview')} />
    </div>
  )
}
