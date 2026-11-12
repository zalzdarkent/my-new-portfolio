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
    <div className={`loader fixed inset-0 z-10 bg-[#060907] text-white font-term overflow-hidden transition-opacity duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${leaving ? 'opacity-0 pointer-events-none' : ''}`}>
      {/* CRT Scanline & Phosphor Screen Effect */}
      <div className="absolute inset-0 pointer-events-none z-[2] shadow-[inset_0_0_100px_rgba(0,0,0,0.85)] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(255,255,255,0.01),rgba(0,0,255,0.03))] bg-[length:100%_3px,6px_100%]" />
      <div className="absolute top-0 inset-x-0 h-2 bg-white/10 shadow-[0_0_12px_rgba(255,255,255,0.2)] pointer-events-none opacity-70 animate-[crtScan_6s_linear_infinite] motion-reduce:animate-none z-[3]" />

      <div className={`absolute inset-0 p-[clamp(16px,4vw,48px)] flex flex-col transition-opacity duration-300 z-[1] [text-shadow:0_0_4px_rgba(255,255,255,0.25)] ${ready ? 'opacity-0 pointer-events-none' : ''}`} aria-hidden={ready}>
        {/* Hacker Terminal Header */}
        <div className="flex items-center gap-6">
          <div className="">
            <pre className="font-[monospace] text-[clamp(8px,1.2vw,13px)] leading-[1.1] text-white [text-shadow:0_0_8px_rgba(255,255,255,0.35)] m-0">
{`  █████╗ ██╗     ██╗███████╗
 ██╔══██╗██║     ██║██╔════╝
 ███████║██║     ██║█████╗
 ██╔══██║██║     ██║██╔══╝
 ██║  ██║███████╗██║██║
 ╚═╝  ╚═╝╚══════╝╚═╝╚═╝`}
            </pre>
          </div>
          {/* <div className="bios-header-meta">
            <p className="text-[#ffb300] [text-shadow:0_0_6px_rgba(255,179,0,0.6)]">AFU ADVANCED HACKER ARCHITECTURE v4.2</p>
            <p>CORE BIOS (C)2026 {NAME.toUpperCase()} CORP.</p>
            <p className="bios-subtext">SYS_BUILD: 2026.11-RELEASE // ARCH: x86_64</p>
          </div> */}
        </div>

        {/* System Specs Bar */}
        <div className="flex flex-wrap gap-x-8 gap-y-4 px-3 py-2 bg-white/4 border border-dashed border-white/22 text-xs tracking-[1px] text-[#b8b8b8] mt-4">
          <span>SECURE_BOOT: ENABLED</span>
          <span>RAM_CHECK: {memCount}KB {memCount >= 32768 ? 'OK' : '...'}</span>
          <span>GPU_PIPELINE: WebGL2.0</span>
          <span>STATUS: ONLINE</span>
        </div>

        {/* Terminal Log Stream */}
        <div className="pl-0 mt-4 flex flex-col gap-1.5 overflow-hidden max-h-[52vh]">
          {BOOT_LOGS.slice(0, step).map((log, idx) => (
            <div key={idx} className="flex items-center text-[clamp(11px,1.1vw,13px)] gap-3 whitespace-nowrap">
              <span className="text-[#ffb300] font-bold shrink-0 [text-shadow:0_0_4px_rgba(255,179,0,0.4)]">{log.prefix}</span>
              <span className="text-[#c8c8c8] shrink-0">{log.text}</span>
              <span className="flex-1 overflow-hidden text-[#505050] tracking-[2px] text-[10px]">............................</span>
              <span className="shrink-0 font-bold text-white [text-shadow:none]">[{log.ok}]</span>
            </div>
          ))}
          {step < BOOT_LOGS.length && (
            <p className="mt-1.5 text-[13px]">
              <span className="text-white [text-shadow:none]">root@afu-box:~$</span> <span className="blink">█</span>
            </p>
          )}
        </div>

        {/* System Status Footer */}
        <div className="mt-auto pt-4 border-t border-solid border-white/18 flex flex-col gap-1.5 text-xs">
          <div className="font-bold tracking-[0.5px]">
            {done ? (
              <p className="text-white [text-shadow:none]">
                [SYSTEM READY] All security protocols cleared. Initializing 3D Interactive Workspace...
              </p>
            ) : (
              <p className="text-[#ffb300] [text-shadow:0_0_6px_rgba(255,179,0,0.6)]">
                [SYSTEM BOOT] Loading models & textures... {Math.round((step / BOOT_LOGS.length) * 100)}%
              </p>
            )}
          </div>
          <div className="flex justify-between flex-wrap gap-2 text-[#999] text-[11px]">
            <p>PORT: 4173 // HOST: 127.0.0.1 // DEV_SESSION_KEY: 0x7FFD28C</p>
            <p>{today()}</p>
          </div>
        </div>
      </div>

      {/* Cyberpunk Hacker Modal Popup */}
      {ready && (
        <div className="absolute inset-0 flex items-center justify-center px-4 z-[5] bg-black/65 backdrop-blur-[2px]">
          <div className="popup border border-solid border-white/35 bg-[#0b0b0b] shadow-[0_0_25px_rgba(255,255,255,0.12),inset_0_0_15px_rgba(255,255,255,0.04)] p-0 flex flex-col w-[min(520px,92vw)] relative rounded overflow-hidden">
            <div className="flex items-center gap-2 bg-[#151515] px-3.5 py-2.5 border-b border-solid border-white/18">
              <span className="size-2.5 rounded-full inline-block bg-[#ff4d4d] shadow-[0_0_6px_#ff4d4d]" />
              <span className="size-2.5 rounded-full inline-block bg-[#ffd000] shadow-[0_0_6px_#ffd000]" />
              <span className="size-2.5 rounded-full inline-block bg-[#9ca3af] shadow-[0_0_6px_rgba(156,163,175,0.45)]" />
              <span className="ml-1.5 text-[11px] tracking-[1px] text-[#b8b8b8]">ACCESS_GRANTED // TERMINAL_READY</span>
            </div>
            <div className="pt-6 px-6 pb-4 flex flex-col gap-1.5 text-center">
              <p className="popup-main-title text-[clamp(18px,3vw,24px)] text-white font-bold tracking-[2px] [text-shadow:0_0_8px_rgba(255,255,255,0.6)]">{NAME}</p>
              <p className="text-[#ffb300] text-[13px] tracking-[1px] [text-shadow:0_0_6px_rgba(255,179,0,0.4)]">Full Stack Developer & Software Engineer</p>
              <div className="h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] mt-3 mb-2" />
              <p className="text-xs text-[#b0b0b0] tracking-[0.5px]">
                Press START to initiate workspace environment <span className="blink">_</span>
              </p>
            </div>
            <button className="hacker-start mx-6 mb-6 border border-solid border-white/40 bg-white/6 text-white font-[inherit] text-sm font-bold tracking-[2px] px-6 py-3 cursor-pointer shadow-[0_0_12px_rgba(255,255,255,0.12)] transition-all duration-200 ease-[ease] relative text-center hover:bg-white hover:text-black hover:shadow-[0_0_24px_rgba(255,255,255,0.45)] hover:[transform:translateY(-1px)] active:[transform:translateY(1px)]" onClick={onStart} disabled={leaving}>
              <span className="inline-block">► START SYSTEM</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
