import { useEffect, useState } from 'react'
import { playBiosBeep, playBootBlip } from './sound'

const NAME = 'Alif Fadillah Ummar'

// Matrix / Hacker BIOS boot diagnostic sequence
const BOOT_LOGS = [
  { prefix: '[INIT]', text: 'Probing hardware interfaces & PCI buses...', ok: 'DONE' },
  { prefix: '[CPU ]', text: 'AMD Ryzen Threadripper PRO 9995WX 96-Core Processor @ 2.50GHz', ok: 'OK' },
  { prefix: '[MEM ]', text: 'DDR5 6400MT/s ECC Registered RDIMM Octa-Channel 2TB Initialized', ok: '100%' },
  { prefix: '[GPU ]', text: 'NVIDIA RTX PRO 6000 Blackwell Workstation Edition 96GB GDDR7 ECC Vulkan 1.3/OpenGL 4.6', ok: 'READY' },
  { prefix: '[SSD ]', text: 'NVMe SAMSUNG 9100 PRO 8TB PCIe Gen5 x4 NVMe 2.0 M.2', ok: 'MOUNTED' },
  { prefix: '[NET ]', text: 'Intel I225-V 2.5GbE Controller Link Speed 1000Mbps', ok: 'UP' },
  { prefix: '[SEC ]', text: 'Decryption keys loaded: SHA256-ECDSA Handshake', ok: 'VERIFIED' },
  { prefix: '[MODL]', text: 'Loading 3D asset pipeline: GLTF Mesh & Texture streaming', ok: 'SYNCED' },
  { prefix: '[ROOM]', text: 'Allocating WebGL Depth Buffer & Virtual Canvas', ok: 'COMPILED' },
  { prefix: '[OS  ]', text: 'Kernel boot: Ubuntu 26.04 LTS (Noble Numbat) Yaru Desktop', ok: 'LOADED' },
]

function today() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getMonth() + 1)}/${p(d.getDate())}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

export default function Loader({
  onStart,
  leaving,
  modelsLoaded,
}: {
  onStart: () => void
  leaving: boolean
  modelsLoaded: boolean
}) {
  const [step, setStep] = useState(0)
  const done = step >= BOOT_LOGS.length && modelsLoaded
  const [ready, setReady] = useState(false)
  const [memCount, setMemCount] = useState(1024)

  // Memory counter tick
  useEffect(() => {
    const t = setInterval(() => {
      setMemCount((m) => {
        if (m >= 32768) {
          clearInterval(t)
          return 32768
        }
        return Math.min(32768, m + 680)
      })
    }, 80)
    return () => clearInterval(t)
  }, [])

  // Boot log step ticker with audio blips
  useEffect(() => {
    if (step < BOOT_LOGS.length) {
      const stepDelays = [
        340, 255, 275, 260, 235,
        220, 280, 350, 310, 275,
      ]
      const delay = stepDelays[step] ?? 325
      const t = setTimeout(() => {
        setStep((s) => s + 1)
        playBootBlip(step % 2 === 0)
      }, delay)
      return () => clearTimeout(t)
    }

    if (done && !ready) {
      const beepTimer = setTimeout(() => {
        playBiosBeep()
      }, 350)

      const revealTimer = setTimeout(() => {
        setReady(true)
      }, 700)

      return () => {
        clearTimeout(beepTimer)
        clearTimeout(revealTimer)
      }
    }
  }, [step, done, ready])

  return (
    <div className={`loader${leaving ? ' leaving' : ''}`}>
      {/* CRT Scanline & Phosphor Screen Effect */}
      <div className="crt-overlay" />
      <div className="crt-scanline" />

      <div className={`bios${ready ? ' hidden' : ''}`} aria-hidden={ready}>
        {/* Hacker Terminal Header */}
        <div className="bios-head">
          <div className="bios-logo hacker-logo">
            <pre className="ascii-badge">
{`  █████╗ ██╗     ██╗███████╗
 ██╔══██╗██║     ██║██╔════╝
 ███████║██║     ██║█████╗
 ██╔══██║██║     ██║██╔══╝
 ██║  ██║███████╗██║██║
 ╚═╝  ╚═╝╚══════╝╚═╝╚═╝`}
            </pre>
          </div>
          {/* <div className="bios-header-meta">
            <p className="glow-amber">AFU ADVANCED HACKER ARCHITECTURE v4.2</p>
            <p>CORE BIOS (C)2026 {NAME.toUpperCase()} CORP.</p>
            <p className="bios-subtext">SYS_BUILD: 2026.11-RELEASE // ARCH: x86_64</p>
          </div> */}
        </div>

        {/* System Specs Bar */}
        <div className="hacker-bar mt16">
          <span>SECURE_BOOT: ENABLED</span>
          <span>RAM_CHECK: {memCount}KB {memCount >= 32768 ? 'OK' : '...'}</span>
          <span>GPU_PIPELINE: WebGL2.0</span>
          <span>STATUS: ONLINE</span>
        </div>

        {/* Terminal Log Stream */}
        <div className="bios-list hacker-list">
          {BOOT_LOGS.slice(0, step).map((log, idx) => (
            <div key={idx} className="hacker-log-row">
              <span className="log-prefix">{log.prefix}</span>
              <span className="log-text">{log.text}</span>
              <span className="log-dots">............................</span>
              <span className="log-status status-neutral">[{log.ok}]</span>
            </div>
          ))}
          {step < BOOT_LOGS.length && (
            <p className="hacker-prompt">
              <span className="status-neutral">root@afu-box:~$</span> <span className="blink">█</span>
            </p>
          )}
        </div>

        {/* System Status Footer */}
        <div className="bios-foot hacker-foot">
          <div className="foot-status">
            {done ? (
              <p className="status-neutral">
                [SYSTEM READY] All security protocols cleared. Initializing 3D Interactive Workspace...
              </p>
            ) : (
              <p className="glow-amber">
                [SYSTEM BOOT] Loading models & textures... {Math.round((step / BOOT_LOGS.length) * 100)}%
              </p>
            )}
          </div>
          <div className="foot-details">
            <p>PORT: 4173 // HOST: 127.0.0.1 // DEV_SESSION_KEY: 0x7FFD28C</p>
            <p>{today()}</p>
          </div>
        </div>
      </div>

      {/* Cyberpunk Hacker Modal Popup */}
      {ready && (
        <div className="popup-wrap">
          <div className="popup hacker-popup">
            <div className="popup-header-bar">
              <span className="term-circle red" />
              <span className="term-circle yellow" />
              <span className="term-circle neutral" />
              <span className="term-title">ACCESS_GRANTED // TERMINAL_READY</span>
            </div>
            <div className="popup-text">
              <p className="popup-main-title">{NAME}</p>
              <p className="popup-subtitle">Full Stack Developer & Software Engineer</p>
              <div className="popup-divider" />
              <p className="popup-instruction">
                Press START to initiate workspace environment <span className="blink">_</span>
              </p>
            </div>
            <button className="start hacker-start" onClick={onStart} disabled={leaving}>
              <span className="start-glitch">► START SYSTEM</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
