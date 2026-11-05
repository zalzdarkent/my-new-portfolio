import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import * as THREE from 'three'
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Desktop, { SCREEN_W, SCREEN_H } from './Desktop'
import Hud from './Hud'
import { buildDesk } from './components/scene/DeskSetup'
import { INTRO, SCREEN, VIEWS } from './constants/sceneConstants'
import { playKeyClick, playMouseDown, playMouseUp } from './sound'

export type Mode = 'overview' | 'desk' | 'screen'
const BEGIN_TEXT = 'Click anywhere to begin '

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

    const gl = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    gl.setClearColor(0xd4d2ce, 1)
    gl.setPixelRatio(Math.min(devicePixelRatio, 2))
    gl.shadowMap.enabled = true
    gl.shadowMap.type = THREE.PCFSoftShadowMap
    gl.toneMapping = THREE.NeutralToneMapping
    gl.domElement.style.position = 'absolute'
    gl.domElement.style.inset = '0'
    gl.domElement.style.zIndex = '2'
    root.appendChild(gl.domElement)

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
      enabled: false,
      enableDamping: true,
      dampingFactor: 0.08,
      enablePan: false,
      rotateSpeed: 0.6,
      minDistance: 2.4,
      maxDistance: 9,
      minPolarAngle: 0.35,
      maxPolarAngle: 1.5,
      minAzimuthAngle: -Infinity,
      maxAzimuthAngle: Infinity,
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
    const onMove = (e: PointerEvent) =>
      pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1)
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
      if (m === 'screen' && (e.target as HTMLElement | null)?.closest?.('.os')) return
      ray.setFromCamera(new THREE.Vector2((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1), camera)
      const hit = ray.intersectObject(monitor, true).length > 0
      if (m === 'desk' && hit) setMode('screen')
      if (m === 'screen' && !hit) setMode('desk')
    }
    root.addEventListener('pointerdown', onDown)
    root.addEventListener('pointerup', onUp)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && modeRef.current === 'screen' && setMode('desk')
    addEventListener('keydown', onKey)

    const screenNormal = new THREE.Vector3(0, -Math.sin(SCREEN.rotX), Math.cos(SCREEN.rotX))

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

      // The WebGL canvas sits on top of CSS3D and punches a depth-tested transparent hole at the screen.
      // Only let pointer events pass through to the CSS3D Ubuntu screen when zoomed into 'screen' mode.
      gl.domElement.style.pointerEvents = current === 'screen' ? 'none' : 'auto'
      toCam.copy(camera.position).sub(SCREEN.center)
      screenEl.style.visibility = toCam.dot(screenNormal) > 0.02 ? 'visible' : 'hidden'

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
      root.removeEventListener('pointerdown', onDown)
      root.removeEventListener('pointerup', onUp)
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
        {typedBegin}
        <span className="blink">_</span>
      </p>
      <Hud show={mode === 'desk'} onOverview={() => setMode('overview')} />
    </div>
  )
}
