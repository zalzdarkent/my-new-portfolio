import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import * as THREE from 'three'
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Desktop, { SCREEN_W, SCREEN_H } from './Desktop'
import PhoneExperience, { type PhonePage } from './components/desktop/PhoneExperience'
import Hud from './Hud'
import SpidermanOverlay from './components/scene/SpidermanOverlay'
import { buildDesk } from './components/scene/DeskSetup'
import { INTRO, SCREEN, VIEWS } from './constants/sceneConstants'
import {
  playHidupJokowi,
  playKeyClick,
  playMouseDown,
  playMouseUp,
  playSpidermanMemeSong,
  playViewTransition,
  stopSpidermanMemeSong,
} from './sound'

export type Mode = 'overview' | 'desk' | 'screen' | 'phone' | 'spiderman'
const BEGIN_TEXT = 'Click anywhere to begin '
const PHONE_SCREEN_W = 390
const PHONE_SCREEN_H = 844

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
  const phoneScreenEl = useMemo(() => {
    const el = document.createElement('div')
    el.className = 'phone-screen'
    el.style.width = `${PHONE_SCREEN_W}px`
    el.style.height = `${PHONE_SCREEN_H}px`
    el.style.pointerEvents = 'auto'
    return el
  }, [])
  const phoneOverlayEl = useMemo(() => {
    const el = document.createElement('div')
    el.className = 'phone-screen-overlay'
    el.style.width = `${PHONE_SCREEN_W}px`
    el.style.height = `${PHONE_SCREEN_H}px`
    el.style.display = 'none'
    el.style.pointerEvents = 'none'
    el.style.transformOrigin = 'top left'
    return el
  }, [])
  const [mode, setMode] = useState<Mode>('overview')
  const [spidermanOverlayActive, setSpidermanOverlayActive] = useState(false)
  const [phonePage, setPhonePage] = useState<PhonePage>('lock')
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
    root.appendChild(phoneOverlayEl)
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
    const phoneScreenObj = new CSS3DObject(phoneScreenEl)
    phoneScreenObj.visible = false
    cssScene.add(phoneScreenObj)

    const gl = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    gl.setClearColor(0x070709, 1)
    gl.setPixelRatio(Math.min(devicePixelRatio, 1.25))
    gl.shadowMap.enabled = true
    gl.shadowMap.type = THREE.PCFSoftShadowMap
    // Static shadow map caching: render once and freeze, eliminating thousands of redundant shadow passes per frame
    gl.shadowMap.autoUpdate = false
    gl.shadowMap.needsUpdate = true
    gl.toneMapping = THREE.NeutralToneMapping
    gl.domElement.style.position = 'absolute'
    gl.domElement.style.inset = '0'
    gl.domElement.style.zIndex = '1'
    root.appendChild(gl.domElement)

    const phoneMeshRef: { current: THREE.Mesh | null } = { current: null }
    const spiderManRef: { current: THREE.Group | null } = { current: null }
    const speakersRef: { current: THREE.Group | null } = { current: null }
    const phoneCenter = new THREE.Vector3()
    const phoneNormal = new THREE.Vector3(0, 0, 1)
    const phoneSize = new THREE.Vector2()
    const phoneWorldQuaternion = new THREE.Quaternion()
    const phoneCorners = [
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]
    const spiderManCenter = new THREE.Vector3()
    const spiderManNormal = new THREE.Vector3(0, 0, 1)
    const spiderManSize = new THREE.Vector2()
    const { monitor, life } = buildDesk(scene, () => {
      // Pre-compile shaders, render static shadow map once, and warm up GPU before user clicks START
      gl.shadowMap.needsUpdate = true
      gl.compile(scene, camera)
      gl.render(scene, camera)
      css.render(cssScene, camera)
      onLoadedRef.current?.()
    }, (phoneMesh) => {
      phoneMeshRef.current = phoneMesh
      phoneMesh.geometry.computeBoundingBox()
      const bounds = phoneMesh.geometry.boundingBox
      if (!bounds) throw new Error('Unable to calculate the iPhone screen bounds')
      const localSize = bounds.getSize(new THREE.Vector3())
      const localCenter = bounds.getCenter(new THREE.Vector3())
      const worldQuaternion = new THREE.Quaternion()
      const worldScale = new THREE.Vector3()
      phoneMesh.matrixWorld.decompose(new THREE.Vector3(), worldQuaternion, worldScale)
      phoneWorldQuaternion.copy(worldQuaternion)
      phoneCenter.copy(localCenter).applyMatrix4(phoneMesh.matrixWorld)
      phoneNormal.set(0, 0, 1).applyQuaternion(worldQuaternion).normalize()
      phoneSize.set(localSize.x * worldScale.x, localSize.y * worldScale.y)

      phoneScreenObj.position.copy(phoneCenter).addScaledVector(phoneNormal, 0.0005)
      phoneScreenObj.quaternion.copy(worldQuaternion)
      phoneScreenObj.scale.set(phoneSize.x / PHONE_SCREEN_W * 1.02, phoneSize.y / PHONE_SCREEN_H * 1.02, 1)
      phoneScreenObj.visible = true
    }, (spiderMan) => {
      spiderManRef.current = spiderMan
      const bounds = new THREE.Box3().setFromObject(spiderMan)
      const size = bounds.getSize(new THREE.Vector3())
      spiderManCenter.copy(bounds.getCenter(new THREE.Vector3()))
      spiderManSize.set(size.x, size.y)
    }, (speakers) => {
      speakersRef.current = speakers
    })

    // Drag to turn around the desk in the overview (360 degrees full rotation)
    const controls = new OrbitControls(camera, gl.domElement)
    Object.assign(controls, {
      enabled: false,
      enableDamping: true,
      dampingFactor: 0.12,
      enablePan: false,
      rotateSpeed: 0.85,
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
    const zoomPos = (
      center: THREE.Vector3,
      normal: THREE.Vector3,
      width: number,
      height: number,
      out: THREE.Vector3,
      fit = 1.08,
    ) => {
      const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
      const d = Math.max(height / 2 / t, width / 2 / (t * camera.aspect)) * fit
      return out.copy(center).addScaledVector(normal, d)
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
      if ((e.target as HTMLElement | null)?.closest?.('.hud')) return
      const m = modeRef.current
      ray.setFromCamera(new THREE.Vector2((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1), camera)
      const hitSpeaker = speakersRef.current ? ray.intersectObject(speakersRef.current, true).length > 0 : false
      if (hitSpeaker) {
        playHidupJokowi()
        return
      }
      const hitSpiderMan = spiderManRef.current ? ray.intersectObject(spiderManRef.current, true).length > 0 : false
      if (m === 'overview') return setMode(hitSpiderMan ? 'spiderman' : 'desk')
      if (m === 'screen' && (e.target as HTMLElement | null)?.closest?.('.os')) return
      if (
        m === 'phone' &&
        (e.target as HTMLElement | null)?.closest?.('.phone-screen, .phone-screen-overlay')
      ) {
        return
      }
      const hitMonitor = ray.intersectObject(monitor, true).length > 0
      const hitPhone = phoneMeshRef.current ? ray.intersectObject(phoneMeshRef.current, true).length > 0 : false
      if (m === 'desk' && hitSpiderMan) setMode('spiderman')
      else if (m === 'desk' && hitPhone) setMode('phone')
      else if (m === 'desk' && hitMonitor) setMode('screen')
      if (m === 'screen' && !hitMonitor) setMode('desk')
      if (m === 'phone' && !hitPhone) setMode('desk')
      if (m === 'spiderman' && !hitSpiderMan) {
        setSpidermanOverlayActive(false)
        stopSpidermanMemeSong()
        setMode('desk')
      }
    }
    root.addEventListener('pointerdown', onDown)
    root.addEventListener('pointerup', onUp)
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === 'Escape' &&
        (modeRef.current === 'screen' || modeRef.current === 'phone' || modeRef.current === 'spiderman')
      ) {
        if (modeRef.current === 'spiderman') {
          setSpidermanOverlayActive(false)
          stopSpidermanMemeSong()
        }
        setMode('desk')
      }
    }
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
    let spidermanArrived = false
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
        if (current === 'spiderman') {
          stopSpidermanMemeSong()
        }
        current = modeRef.current
        if (current !== 'spiderman' && spidermanArrived) {
          spidermanArrived = false
          setSpidermanOverlayActive(false)
        }
        playViewTransition()
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
          zoomPos(SCREEN.center, screenNormal, SCREEN.w, SCREEN.h, goal)
          goalLook.copy(SCREEN.center)
        } else if (current === 'phone') {
          zoomPos(phoneCenter, phoneNormal, phoneSize.x, phoneSize.y, goal, 1.18)
          goalLook.copy(phoneCenter)
        } else if (current === 'spiderman') {
          zoomPos(spiderManCenter, spiderManNormal, spiderManSize.x, spiderManSize.y, goal, 1.4)
          goalLook.copy(spiderManCenter)
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

      if (current === 'spiderman') {
        if (p >= 1 && !spidermanArrived) {
          spidermanArrived = true
          setSpidermanOverlayActive(true)
          playSpidermanMemeSong()
        }
      } else if (spidermanArrived) {
        spidermanArrived = false
        setSpidermanOverlayActive(false)
      }

      // Allow pointer events to pass through to CSS3D when zoomed into 'screen' or 'phone' mode.
      gl.domElement.style.pointerEvents = current === 'screen' || current === 'phone' ? 'none' : 'auto'
      toCam.copy(camera.position).sub(SCREEN.center)
      screenEl.style.visibility = toCam.dot(screenNormal) > 0.02 ? 'visible' : 'hidden'
      
      const toCamPhone = new THREE.Vector3().copy(camera.position).sub(phoneCenter)
      phoneScreenObj.visible = toCamPhone.dot(phoneNormal) > 0.02
      phoneOverlayEl.style.display = 'none'
      phoneOverlayEl.style.pointerEvents = 'none'

      life(t)
      gl.render(scene, camera)
      css.render(cssScene, camera)
    }
    tick()

    return () => {
      stopSpidermanMemeSong()
      setSpidermanOverlayActive(false)
      cancelAnimationFrame(raf)
      removeEventListener('resize', resize)
      removeEventListener('pointermove', onMove)
      removeEventListener('keydown', onKey)
      root.removeEventListener('pointerdown', onDown)
      root.removeEventListener('pointerup', onUp)
      controls.dispose()
      phoneMeshRef.current = null
      spiderManRef.current = null
      speakersRef.current = null
      phoneOverlayEl.remove()
      gl.dispose()
      gl.domElement.remove()
      css.domElement.remove()
    }
  }, [screenEl, phoneScreenEl, phoneOverlayEl])

  return (
    <div className="scene" ref={host}>
      {createPortal(
        <Desktop zoomed={mode === 'screen'} onEnter={() => setMode(mode === 'overview' ? 'desk' : 'screen')} />,
        screenEl,
      )}
      {createPortal(<PhoneExperience page={phonePage} onPageChange={setPhonePage} />, phoneScreenEl)}
      {createPortal(<PhoneExperience page={phonePage} onPageChange={setPhonePage} />, phoneOverlayEl)}
      <p className={`fixed bottom-16 left-1/2 z-5 -translate-x-1/2 whitespace-nowrap bg-white px-4 py-1 leading-[19px] text-black pointer-events-none transition-[opacity,transform] duration-500 max-md:bottom-8 ${started && mode === 'overview' ? 'animate-[beginPulse_2.4s_ease-in-out_infinite]' : 'translate-y-3 opacity-0'}`}>
        {typedBegin}
        <span className="blink">_</span>
      </p>
      <Hud show={mode === 'desk'} onOverview={() => setMode('overview')} />
      <SpidermanOverlay
        active={spidermanOverlayActive}
        onClose={() => {
          setSpidermanOverlayActive(false)
          stopSpidermanMemeSong()
          setMode('desk')
        }}
      />
    </div>
  )
}
