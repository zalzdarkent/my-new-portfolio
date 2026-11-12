import { useEffect, useState, useTransition } from 'react'
import { NAME, PROJECTS_DATA, SKILLS_DATA, I18N } from '../../data/portfolioData'

export type PhonePage = 'lock' | 'home' | 'contact' | 'projects' | 'skills' | 'notes'

const formatTime = (date: Date) =>
  new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(date)

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }).format(date)

export default function PhoneExperience({
  page,
  onPageChange,
}: {
  page: PhonePage
  onPageChange: (page: PhonePage) => void
}) {
  const [now, setNow] = useState(() => new Date())
  const [islandExpanded, setIslandExpanded] = useState(false)
  const [flashlightOn, setFlashlightOn] = useState(false)
  const [cameraFlash, setCameraFlash] = useState(false)
  const [copiedToast, setCopiedToast] = useState(false)
  const [activeProjectTab, setActiveProjectTab] = useState<'all' | 'fullstack' | 'ai' | 'web'>('all')
  const [, startTransition] = useTransition()

  // Real-time clock update
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 10_000)
    return () => window.clearInterval(timer)
  }, [])

  // Auto hide copy toast
  useEffect(() => {
    if (!copiedToast) return
    const t = window.setTimeout(() => setCopiedToast(false), 2200)
    return () => window.clearTimeout(t)
  }, [copiedToast])

  const copyEmail = () => {
    navigator.clipboard?.writeText('arszalzdarker@email.com')
    setCopiedToast(true)
  }

  const navigateTo = (nextPage: PhonePage) => {
    startTransition(() => {
      onPageChange(nextPage)
      setIslandExpanded(false)
    })
  }

  const isLightPage = page === 'contact' || page === 'projects' || page === 'skills' || page === 'notes'

  const filteredProjects = PROJECTS_DATA.filter((p) => {
    if (activeProjectTab === 'all') return true
    if (activeProjectTab === 'fullstack') return p.cat === 'fullstack'
    if (activeProjectTab === 'ai') return p.cat === 'ai' || p.cat === 'iot'
    if (activeProjectTab === 'web') return p.cat === 'web'
    return true
  })

  return (
    <div
      className="relative w-full h-full select-none overflow-hidden rounded-[54px] text-white [font-family:-apple-system,BlinkMacSystemFont,'SF_Pro_Display','SF_Pro_Text','Segoe_UI',Roboto,sans-serif] tracking-normal touch-manipulation antialiased"
      style={{
        background:
          page === 'lock' || page === 'home'
            ? 'radial-gradient(ellipse at 50% 0%, #2e4a87 0%, #151e3f 40%, #0a0e1c 100%)'
            : '#000000',
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Dynamic iOS Wallpaper Mesh Background for Lock & Home */}
      {(page === 'lock' || page === 'home') && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* iOS 18 Signature Fluid Aurora Waves */}
          <div className="absolute -top-[15%] -left-[20%] w-[140%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.35)_0%,rgba(99,102,241,0.25)_40%,transparent_70%)] blur-[50px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-[30%] -right-[25%] w-[120%] h-[55%] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.25)_0%,rgba(139,92,246,0.3)_45%,transparent_70%)] blur-[55px]" />
          <div className="absolute bottom-[5%] left-[5%] w-[110%] h-[40%] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.18)_0%,rgba(14,165,233,0.25)_50%,transparent_70%)] blur-[45px]" />
          {/* Subtle noise/stars overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
        </div>
      )}

      {/* Flashlight simulated glare on lock screen */}
      {page === 'lock' && flashlightOn && (
        <div className="absolute inset-0 bg-white/20 pointer-events-none z-30 transition-opacity duration-300" />
      )}

      {/* Camera mock shutter flash */}
      {cameraFlash && (
        <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-out fade-out duration-300" />
      )}

      {/* Copy notification toast */}
      {copiedToast && (
        <div className="absolute top-[64px] left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 text-gray-900 shadow-2xl backdrop-blur-xl border border-white/40 text-xs font-semibold animate-in fade-in slide-in-from-top-3 duration-200">
          <span className="text-[#34C759] text-sm">✓</span> Email disalin ke clipboard!
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOP STATUS BAR & DYNAMIC ISLAND */}
      {/* ========================================================================= */}
      <div
        className={`absolute z-40 top-0 left-0 flex items-center justify-between w-full h-[50px] px-8 text-[15px] font-semibold transition-colors duration-200 ${
          isLightPage && !islandExpanded ? 'text-gray-900' : 'text-white'
        }`}
      >
        {/* Left: Clock */}
        <span className="w-[58px] text-[15px] font-semibold tracking-[-0.2px] tabular-nums">
          {formatTime(now)}
        </span>

        {/* Dynamic Island (iPhone 16 Pro Style) */}
        <div
          onClick={() => setIslandExpanded(!islandExpanded)}
          className={`absolute top-[11px] left-1/2 -translate-x-1/2 bg-black rounded-[20px] flex items-center justify-between cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-50 shadow-[0_0_1px_1px_rgba(255,255,255,0.08),0_4px_16px_rgba(0,0,0,0.6)] hover:scale-[1.02] active:scale-[0.98] ${
            islandExpanded
              ? 'w-[350px] h-[82px] p-3.5 rounded-[36px]'
              : 'w-[124px] h-[35px] px-3'
          }`}
          title="Ketuk Dynamic Island"
        >
          {islandExpanded ? (
            /* Expanded Dynamic Island (Live Activity / Now Playing) */
            <div className="flex items-center justify-between w-full h-full text-white">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-[14px] bg-gradient-to-tr from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center shadow-md">
                  <span className="text-xl">⚡</span>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#34C759] rounded-full border-2 border-black" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-bold text-white tracking-tight">Alif Fadillah</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                      Open to Work
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">Full Stack · Ready to hire</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 pr-1">
                <div className="flex items-end gap-0.5 h-4">
                  <span className="w-1 bg-[#34C759] rounded-full h-2 animate-pulse" />
                  <span className="w-1 bg-[#34C759] rounded-full h-4 animate-pulse delay-75" />
                  <span className="w-1 bg-[#34C759] rounded-full h-2.5 animate-pulse delay-150" />
                </div>
              </div>
            </div>
          ) : (
            /* Compact Dynamic Island */
            <div className="flex items-center justify-between w-full h-full">
              {/* Left: Sensor or activity dot */}
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
                <span className="text-[10px] text-gray-300 font-semibold tracking-tight">AF</span>
              </div>
              {/* Right: TrueDepth Camera & Sensor with sapphire lens look */}
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0a0f16]" />
                <div className="w-[11px] h-[11px] rounded-full bg-[radial-gradient(circle_at_35%_35%,#203a5e_0%,#09121d_55%,#000000_100%)] shadow-[inset_0_0_1.5px_rgba(255,255,255,0.45),0_0_2px_rgba(0,0,0,0.85)]" />
              </div>
            </div>
          )}
        </div>

        {/* Right: Cellular, Wi-Fi, and Authentic iOS Battery */}
        <div className="flex items-center gap-1.5 w-[58px] justify-end" aria-label="Status Bar">
          {/* Cellular Signal (4 bars) */}
          <svg viewBox="0 0 17 12" width="16" height="11" fill="currentColor">
            <rect x="0" y="8.5" width="2.8" height="3.5" rx="0.8" />
            <rect x="4.5" y="5.8" width="2.8" height="6.2" rx="0.8" />
            <rect x="9" y="3.2" width="2.8" height="8.8" rx="0.8" />
            <rect x="13.5" y="0.5" width="2.8" height="11.5" rx="0.8" />
          </svg>
          {/* Wi-Fi Icon */}
          <svg viewBox="0 0 16 12" width="15" height="11" fill="currentColor">
            <path d="M8 2.5C10.5 2.5 12.8 3.5 14.5 5.2L16 3.7C13.9 1.6 11.1 0.5 8 0.5C4.9 0.5 2.1 1.6 0 3.7L1.5 5.2C3.2 3.5 5.5 2.5 8 2.5ZM8 6.5C9.7 6.5 11.2 7.2 12.4 8.4L13.9 6.9C12.4 5.4 10.3 4.5 8 4.5C5.7 4.5 3.6 5.4 2.1 6.9L3.6 8.4C4.8 7.2 6.3 6.5 8 6.5ZM8 10C8.8 10 9.5 10.7 9.5 11.5C9.5 12.3 8.8 13 8 13C7.2 13 6.5 12.3 6.5 11.5C6.5 10.7 7.2 10 8 10Z" />
          </svg>
          {/* iOS Battery Capsule */}
          <div className="flex items-center gap-0.5">
            <div className="w-[23px] h-[11.5px] border-[1.5px] border-solid border-current rounded-[4px] p-[1.5px] box-border flex items-center">
              <div className="w-[90%] h-full bg-current rounded-[1.5px]" />
            </div>
            <div className="w-[1.5px] h-[4px] bg-current rounded-r-[1px] opacity-75" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 1: LOCK SCREEN */}
      {/* ========================================================================= */}
      {page === 'lock' && (
        <main
          className="relative h-full flex flex-col justify-between pt-[70px] pb-5 px-6"
          onClick={() => navigateTo('home')}
        >
          {/* Top Lock Icon & Clock */}
          <div className="flex flex-col items-center text-center mt-2 cursor-pointer">
            <div className="text-white/70 text-xs mb-1 font-medium tracking-wide flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7c0-2.757-2.243-5-5-5zm-3 5c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z" />
              </svg>
              <span>{formatDate(now).toUpperCase()}</span>
            </div>

            {/* Apple Big iOS Clock */}
            <h1 className="text-[78px] font-[600] tracking-[-3px] leading-none text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)] my-1">
              {formatTime(now)}
            </h1>

            {/* iOS Lock Screen Widgets Row */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 backdrop-blur-md border border-white/10 text-[11px] text-white/90">
                <span>☀️</span>
                <span className="font-semibold">Karawang 29°</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 backdrop-blur-md border border-white/10 text-[11px] text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Open to Work</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-black/25 backdrop-blur-md border border-white/10 text-[11px] text-white/90">
                <span>⚡</span>
                <span>3+ Thn XP</span>
              </div>
            </div>
          </div>

          {/* iOS Notification Center Card */}
          <div
            onClick={(e) => {
              e.stopPropagation()
              navigateTo('contact')
            }}
            className="w-full mt-auto mb-6 p-3.5 rounded-[22px] bg-white/15 backdrop-blur-2xl border border-white/20 shadow-2xl hover:bg-white/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-[6px] bg-gradient-to-tr from-[#30D158] to-[#248A3D] flex items-center justify-center text-white text-[11px] shadow-sm">
                  💬
                </div>
                <span className="text-[11px] font-semibold tracking-wider text-white/80 uppercase">
                  Pesan Masuk
                </span>
              </div>
              <span className="text-[10px] text-white/60">baru saja</span>
            </div>
            <div className="text-left pl-7">
              <h2 className="text-[13px] font-semibold text-white leading-tight">
                Perekrut / Klien Potensial
              </h2>
              <p className="text-[12px] text-white/80 mt-0.5 leading-snug">
                &ldquo;Halo Alif! Kami tertarik berkolaborasi untuk posisi Full Stack Developer...&rdquo;
              </p>
            </div>
          </div>

          {/* Bottom Controls: Flashlight, Unlock Cue, Camera */}
          <div className="flex items-center justify-between w-full px-2">
            {/* Flashlight button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setFlashlightOn(!flashlightOn)
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg backdrop-blur-xl border transition-all active:scale-90 ${
                flashlightOn
                  ? 'bg-white text-gray-900 border-white shadow-[0_0_20px_rgba(255,255,255,0.8)]'
                  : 'bg-black/35 text-white border-white/15 hover:bg-black/50'
              }`}
              title="Senter"
              aria-label="Senter"
            >
              🔦
            </button>

            {/* Swipe/Tap Hint */}
            <div className="flex flex-col items-center gap-1 text-white/75 text-[11px] font-medium tracking-wide">
              <span className="text-[14px] leading-none animate-bounce">⌃</span>
              <span>Ketuk untuk membuka</span>
            </div>

            {/* Camera button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setCameraFlash(true)
                setTimeout(() => setCameraFlash(false), 250)
              }}
              className="w-12 h-12 rounded-full bg-black/35 text-white backdrop-blur-xl border border-white/15 flex items-center justify-center text-lg hover:bg-black/50 active:scale-90 transition-all"
              title="Kamera"
              aria-label="Kamera"
            >
              📷
            </button>
          </div>

          {/* iOS Bottom Home Bar */}
          <div className="w-[134px] h-[5px] rounded-full bg-white/80 mx-auto mt-2 shadow-sm" />
        </main>
      )}

      {/* ========================================================================= */}
      {/* PAGE 2: HOME SCREEN (SPRINGBOARD) */}
      {/* ========================================================================= */}
      {page === 'home' && (
        <main className="relative h-full flex flex-col justify-between pt-[66px] pb-3 px-5">
          <div className="flex flex-col gap-4">
            {/* Apple Smart Widget: Profile Banner */}
            <div
              onClick={() => navigateTo('contact')}
              className="p-4 rounded-[26px] bg-white/15 backdrop-blur-2xl border border-white/25 shadow-xl cursor-pointer hover:bg-white/20 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-13 h-13 rounded-full bg-gradient-to-tr from-[#6366F1] via-[#8B5CF6] to-[#EC4899] flex items-center justify-center text-white text-lg font-bold shadow-lg">
                  AF
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#34C759] rounded-full border-2 border-slate-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white/70">
                      Portfolio iOS
                    </span>
                    <span className="text-[10px] text-emerald-300 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Open to Work
                    </span>
                  </div>
                  <h1 className="text-[16px] font-bold text-white tracking-tight truncate">
                    {NAME}
                  </h1>
                  <p className="text-[11px] text-white/80 truncate">
                    Full Stack Dev & Junior Software Engineer
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/15 text-center">
                <div className="bg-black/20 rounded-[12px] py-1 px-1">
                  <span className="block text-[14px] font-extrabold text-white">3+</span>
                  <span className="text-[9px] text-white/70">Tahun XP</span>
                </div>
                <div className="bg-black/20 rounded-[12px] py-1 px-1">
                  <span className="block text-[14px] font-extrabold text-cyan-300">6+</span>
                  <span className="text-[9px] text-white/70">Proyek Rilis</span>
                </div>
                <div className="bg-black/20 rounded-[12px] py-1 px-1">
                  <span className="block text-[14px] font-extrabold text-purple-300">15+</span>
                  <span className="text-[9px] text-white/70">Keahlian</span>
                </div>
              </div>
            </div>

            {/* iOS App Grid (4 Columns) */}
            <div className="grid grid-cols-4 gap-y-4 gap-x-2 pt-1">
              {/* App 1: Proyek */}
              <button
                onClick={() => navigateTo('projects')}
                className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
              >
                <div className="relative w-[58px] h-[58px] rounded-[22%] bg-gradient-to-b from-[#0A84FF] to-[#0051C7] flex items-center justify-center text-white text-[24px] shadow-[0_8px_18px_rgba(10,132,255,0.4)] group-active:scale-90 transition-transform">
                  <span className="drop-shadow-sm">▦</span>
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF3B30] text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                    6
                  </span>
                </div>
                <span className="text-[11px] font-medium text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-tight">
                  Proyek
                </span>
              </button>

              {/* App 2: Kontak */}
              <button
                onClick={() => navigateTo('contact')}
                className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
              >
                <div className="w-[58px] h-[58px] rounded-[22%] bg-gradient-to-b from-[#34C759] to-[#248A3D] flex items-center justify-center text-white text-[24px] shadow-[0_8px_18px_rgba(52,199,89,0.35)] group-active:scale-90 transition-transform">
                  <span className="drop-shadow-sm">✉</span>
                </div>
                <span className="text-[11px] font-medium text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-tight">
                  Kontak
                </span>
              </button>

              {/* App 3: Keahlian (Settings) */}
              <button
                onClick={() => navigateTo('skills')}
                className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
              >
                <div className="w-[58px] h-[58px] rounded-[22%] bg-gradient-to-b from-[#8E8E93] to-[#48484A] flex items-center justify-center text-white text-[24px] shadow-[0_8px_18px_rgba(0,0,0,0.35)] group-active:scale-90 transition-transform">
                  <span className="drop-shadow-sm">⚙</span>
                </div>
                <span className="text-[11px] font-medium text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-tight">
                  Keahlian
                </span>
              </button>

              {/* App 4: Catatan (Notes) */}
              <button
                onClick={() => navigateTo('notes')}
                className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
              >
                <div className="w-[58px] h-[58px] rounded-[22%] bg-gradient-to-b from-[#FFD60A] to-[#F5A623] flex items-center justify-center text-slate-900 text-[24px] font-bold shadow-[0_8px_18px_rgba(245,166,35,0.35)] group-active:scale-90 transition-transform">
                  <span className="drop-shadow-sm">📝</span>
                </div>
                <span className="text-[11px] font-medium text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-tight">
                  Catatan
                </span>
              </button>

              {/* App 5: GitHub */}
              <a
                href="https://github.com/zalzdarkent"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 group cursor-pointer no-underline focus:outline-none"
              >
                <div className="w-[58px] h-[58px] rounded-[22%] bg-gradient-to-b from-[#2D333B] to-[#1C2128] flex items-center justify-center text-white text-[24px] shadow-[0_8px_18px_rgba(0,0,0,0.4)] group-active:scale-90 transition-transform border border-white/10">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </div>
                <span className="text-[11px] font-medium text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-tight">
                  GitHub
                </span>
              </a>

              {/* App 6: LinkedIn */}
              <a
                href="https://linkedin.com/in/alif-fadillah-ummar-07001224b/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 group cursor-pointer no-underline focus:outline-none"
              >
                <div className="w-[58px] h-[58px] rounded-[22%] bg-gradient-to-b from-[#0A66C2] to-[#004182] flex items-center justify-center text-white text-[23px] font-bold shadow-[0_8px_18px_rgba(10,102,194,0.35)] group-active:scale-90 transition-transform">
                  in
                </div>
                <span className="text-[11px] font-medium text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-tight">
                  LinkedIn
                </span>
              </a>

              {/* App 7: Safari */}
              <a
                href="https://onlinetest.unsika.ac.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 group cursor-pointer no-underline focus:outline-none"
              >
                <div className="w-[58px] h-[58px] rounded-[22%] bg-gradient-to-b from-[#FFFFFF] via-[#E8EDF5] to-[#D0D7E5] flex items-center justify-center text-[26px] shadow-[0_8px_18px_rgba(0,0,0,0.25)] group-active:scale-90 transition-transform">
                  🧭
                </div>
                <span className="text-[11px] font-medium text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-tight">
                  Safari
                </span>
              </a>

              {/* App 8: Kunci Layar */}
              <button
                onClick={() => navigateTo('lock')}
                className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
              >
                <div className="w-[58px] h-[58px] rounded-[22%] bg-gradient-to-b from-[#FF453A] to-[#C92A2A] flex items-center justify-center text-white text-[24px] shadow-[0_8px_18px_rgba(255,69,58,0.35)] group-active:scale-90 transition-transform">
                  🔒
                </div>
                <span className="text-[11px] font-medium text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-tight">
                  Kunci
                </span>
              </button>
            </div>
          </div>

          {/* Bottom Area: Search Pill + iOS Dock + Home Bar */}
          <div className="flex flex-col items-center gap-3">
            {/* iOS Search Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white/80 text-[11px] font-medium shadow-sm">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <span>Cari</span>
            </div>

            {/* iOS Frosted Glass Floating Dock */}
            <div className="w-full p-3 rounded-[35px] bg-white/25 backdrop-blur-3xl border border-white/25 shadow-2xl flex items-center justify-around">
              <button
                onClick={() => navigateTo('contact')}
                className="w-[52px] h-[52px] rounded-[22%] bg-gradient-to-b from-[#34C759] to-[#248A3D] flex items-center justify-center text-white text-[22px] shadow-md active:scale-90 transition-transform cursor-pointer"
                title="Panggilan / Kontak"
              >
                📞
              </button>
              <button
                onClick={() => navigateTo('projects')}
                className="w-[52px] h-[52px] rounded-[22%] bg-gradient-to-b from-[#0A84FF] to-[#0051C7] flex items-center justify-center text-white text-[22px] shadow-md active:scale-90 transition-transform cursor-pointer"
                title="Proyek Portofolio"
              >
                ▦
              </button>
              <button
                onClick={() => navigateTo('notes')}
                className="w-[52px] h-[52px] rounded-[22%] bg-gradient-to-b from-[#FFD60A] to-[#F5A623] flex items-center justify-center text-slate-900 text-[22px] shadow-md active:scale-90 transition-transform cursor-pointer"
                title="Catatan Bio"
              >
                📝
              </button>
              <a
                href="mailto:arszalzdarker@email.com"
                className="w-[52px] h-[52px] rounded-[22%] bg-gradient-to-b from-[#5856D6] to-[#3634A3] flex items-center justify-center text-white text-[22px] shadow-md active:scale-90 transition-transform cursor-pointer no-underline"
                title="Kirim Email"
              >
                ✉
              </a>
            </div>

            {/* iOS Home Indicator Bar */}
            <div
              onClick={() => navigateTo('lock')}
              className="w-[134px] h-[5px] rounded-full bg-white/80 cursor-pointer hover:bg-white transition-all shadow-sm"
            />
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* PAGE 3: PROJECTS (APP STORE / SHOWCASE STYLE) */}
      {/* ========================================================================= */}
      {page === 'projects' && (
        <main className="relative h-full flex flex-col bg-[#F2F2F7] text-gray-900 pt-[52px]">
          {/* iOS Top Navigation Bar */}
          <header className="flex items-center justify-between px-4 py-2 border-b border-gray-300/60 bg-white/80 backdrop-blur-xl shrink-0">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center text-[#007AFF] text-[15px] font-medium active:opacity-60 cursor-pointer"
            >
              <span className="text-[22px] mr-0.5 leading-none">‹</span> Beranda
            </button>
            <h2 className="text-[16px] font-bold text-gray-900">Proyek Unggulan</h2>
            <div className="w-[60px] flex justify-end">
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                {PROJECTS_DATA.length} Apps
              </span>
            </div>
          </header>

          {/* Segmented Filter Pills */}
          <div className="px-4 py-2.5 bg-white/60 backdrop-blur-md border-b border-gray-200 shrink-0">
            <div className="grid grid-cols-4 p-0.5 rounded-[9px] bg-[#E3E3E8] text-[11px] font-semibold text-gray-600">
              {(
                [
                  { id: 'all', label: 'Semua' },
                  { id: 'fullstack', label: 'Web' },
                  { id: 'ai', label: 'AI/IoT' },
                  { id: 'web', label: 'Tools' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveProjectTab(tab.id)}
                  className={`py-1 rounded-[7px] transition-all cursor-pointer ${
                    activeProjectTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm font-bold'
                      : 'hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Project Cards (iOS Inset Grouped / App Store Style) */}
          <section className="flex-1 overflow-y-auto px-4 py-3 space-y-3 [scrollbar-width:none]">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="p-3.5 rounded-[20px] bg-white border border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col gap-2.5"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-13 h-13 rounded-[14px] flex items-center justify-center text-white text-[22px] font-bold shadow-md shrink-0"
                    style={{
                      background: `linear-gradient(135deg, hsl(${project.hue}, 85%, 55%), hsl(${project.hue + 25}, 85%, 40%))`,
                    }}
                  >
                    {project.cat === 'ai'
                      ? '👁️'
                      : project.cat === 'iot'
                      ? '⚙️'
                      : project.cat === 'web'
                      ? '🎵'
                      : '🌐'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase">
                        {project.cat}
                      </span>
                      {project.liveUrl && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold border border-emerald-200">
                          Live
                        </span>
                      )}
                    </div>
                    <h3 className="text-[15px] font-bold text-gray-900 tracking-tight leading-tight">
                      {project.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {project.shortDescId}
                    </p>
                  </div>
                </div>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-[#F2F2F7] text-gray-600 text-[10px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* iOS App Store GET / BUKA button */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                  <span className="text-[10px] text-gray-400">Ver. 1.0 • Web App</span>
                  <div className="flex gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-[11px] font-semibold no-underline hover:bg-gray-200 active:scale-95 transition-all"
                      >
                        Source
                      </a>
                    )}
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1 rounded-full bg-[#007AFF] text-white text-[11px] font-bold no-underline shadow-sm hover:bg-blue-600 active:scale-95 transition-all"
                      >
                        BUKA ↗
                      </a>
                    ) : (
                      <button
                        onClick={() => navigateTo('contact')}
                        className="px-3 py-1 rounded-full bg-blue-50 text-[#007AFF] text-[11px] font-bold hover:bg-blue-100 active:scale-95 transition-all"
                      >
                        Tanya Demo
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </section>

          {/* iOS Bottom Navigation / Home Bar */}
          <div className="py-2 bg-white/80 backdrop-blur-xl border-t border-gray-200 shrink-0">
            <button
              onClick={() => navigateTo('home')}
              className="w-[134px] h-[5px] rounded-full bg-gray-800/40 mx-auto block hover:bg-gray-800/70 active:scale-95 transition-all cursor-pointer"
              aria-label="Kembali ke beranda"
            />
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* PAGE 4: CONTACT (APPLE CONTACT CARD / ID STYLE) */}
      {/* ========================================================================= */}
      {page === 'contact' && (
        <main className="relative h-full flex flex-col bg-[#F2F2F7] text-gray-900 pt-[52px]">
          {/* iOS Top Navigation Bar */}
          <header className="flex items-center justify-between px-4 py-2 border-b border-gray-300/60 bg-white/80 backdrop-blur-xl shrink-0">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center text-[#007AFF] text-[15px] font-medium active:opacity-60 cursor-pointer"
            >
              <span className="text-[22px] mr-0.5 leading-none">‹</span> Kontak
            </button>
            <h2 className="text-[16px] font-bold text-gray-900">Kartu Kontak</h2>
            <button
              onClick={copyEmail}
              className="text-[#007AFF] text-[14px] font-semibold active:opacity-60 cursor-pointer"
            >
              Salin
            </button>
          </header>

          <section className="flex-1 overflow-y-auto px-4 py-4 space-y-4 [scrollbar-width:none]">
            {/* Apple ID Style Profile Header */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#6366F1] via-[#8B5CF6] to-[#EC4899] flex items-center justify-center text-white text-[28px] font-bold shadow-lg">
                AF
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-[#34C759] rounded-full border-2 border-white shadow-sm" />
              </div>
              <h1 className="text-[20px] font-bold text-gray-900 mt-2.5 tracking-tight">{NAME}</h1>
              <p className="text-[12px] text-gray-500 font-medium">
                Full Stack Developer & Software Engineer
              </p>
            </div>

            {/* Apple Quick Action 4-Pill Buttons */}
            <div className="grid grid-cols-4 gap-2">
              <a
                href="mailto:arszalzdarker@email.com"
                className="flex flex-col items-center gap-1.5 p-2 rounded-[16px] bg-white border border-gray-200 shadow-sm no-underline active:scale-95 transition-transform"
              >
                <div className="w-10 h-10 rounded-full bg-[#007AFF] text-white flex items-center justify-center text-lg shadow-sm">
                  ✉
                </div>
                <span className="text-[10px] font-semibold text-gray-800">Email</span>
              </a>

              <a
                href="https://linkedin.com/in/alif-fadillah-ummar-07001224b/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 p-2 rounded-[16px] bg-white border border-gray-200 shadow-sm no-underline active:scale-95 transition-transform"
              >
                <div className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center text-base font-bold shadow-sm">
                  in
                </div>
                <span className="text-[10px] font-semibold text-gray-800">LinkedIn</span>
              </a>

              <a
                href="https://github.com/zalzdarkent"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 p-2 rounded-[16px] bg-white border border-gray-200 shadow-sm no-underline active:scale-95 transition-transform"
              >
                <div className="w-10 h-10 rounded-full bg-[#24292F] text-white flex items-center justify-center text-base shadow-sm">
                  ⌘
                </div>
                <span className="text-[10px] font-semibold text-gray-800">GitHub</span>
              </a>

              <button
                onClick={copyEmail}
                className="flex flex-col items-center gap-1.5 p-2 rounded-[16px] bg-white border border-gray-200 shadow-sm active:scale-95 transition-transform cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#34C759] text-white flex items-center justify-center text-lg shadow-sm">
                  📋
                </div>
                <span className="text-[10px] font-semibold text-gray-800">Salin</span>
              </button>
            </div>

            {/* Apple Grouped Table View: Detail Kontak */}
            <div className="rounded-[18px] bg-white border border-gray-200 overflow-hidden shadow-sm divide-y divide-gray-100">
              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold block uppercase">
                    Alamat Email
                  </span>
                  <a
                    href="mailto:arszalzdarker@email.com"
                    className="text-[13px] font-semibold text-[#007AFF] no-underline"
                  >
                    arszalzdarker@email.com
                  </a>
                </div>
                <span className="text-gray-300 text-sm">›</span>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold block uppercase">
                    Lokasi
                  </span>
                  <span className="text-[13px] font-semibold text-gray-800">
                    Karawang & Jawa Barat, Indonesia
                  </span>
                </div>
                <span className="text-gray-400 text-xs font-semibold">WIB</span>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold block uppercase">
                    Status Kerja
                  </span>
                  <span className="text-[13px] font-semibold text-emerald-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Tersedia untuk Pekerjaan / Kontrak
                  </span>
                </div>
                <span className="text-gray-300 text-sm">›</span>
              </div>
            </div>

            {/* Apple Grouped Table View: Catatan & Bio Singkat */}
            <div className="rounded-[18px] bg-white border border-gray-200 p-3.5 shadow-sm">
              <span className="text-[10px] text-gray-400 font-semibold block uppercase mb-1">
                Catatan Kolaborasi
              </span>
              <p className="text-[12px] text-gray-600 leading-relaxed">
                {I18N.id.contactSub}
              </p>
            </div>
          </section>

          {/* iOS Bottom Navigation / Home Bar */}
          <div className="py-2 bg-white/80 backdrop-blur-xl border-t border-gray-200 shrink-0">
            <button
              onClick={() => navigateTo('home')}
              className="w-[134px] h-[5px] rounded-full bg-gray-800/40 mx-auto block hover:bg-gray-800/70 active:scale-95 transition-all cursor-pointer"
              aria-label="Kembali ke beranda"
            />
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* PAGE 5: SKILLS (IOS SETTINGS STYLE) */}
      {/* ========================================================================= */}
      {page === 'skills' && (
        <main className="relative h-full flex flex-col bg-[#F2F2F7] text-gray-900 pt-[52px]">
          {/* iOS Top Navigation Bar */}
          <header className="flex items-center justify-between px-4 py-2 border-b border-gray-300/60 bg-white/80 backdrop-blur-xl shrink-0">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center text-[#007AFF] text-[15px] font-medium active:opacity-60 cursor-pointer"
            >
              <span className="text-[22px] mr-0.5 leading-none">‹</span> Beranda
            </button>
            <h2 className="text-[16px] font-bold text-gray-900">Keahlian & Stack</h2>
            <div className="w-[50px]" />
          </header>

          <section className="flex-1 overflow-y-auto px-4 py-3 space-y-4 [scrollbar-width:none]">
            <div className="text-center px-2">
              <div className="w-14 h-14 rounded-[22%] bg-gradient-to-b from-[#8E8E93] to-[#48484A] text-white flex items-center justify-center text-2xl mx-auto shadow-md">
                ⚙️
              </div>
              <h3 className="text-[16px] font-bold text-gray-900 mt-2">Spesialisasi Teknologi</h3>
              <p className="text-[11px] text-gray-500">
                Pengalaman 3+ tahun dalam ekosistem Full Stack & AI
              </p>
            </div>

            {/* Inset Grouped Settings List */}
            <div className="rounded-[18px] bg-white border border-gray-200 overflow-hidden shadow-sm divide-y divide-gray-100">
              {SKILLS_DATA.map((skill) => (
                <div key={skill.name} className="p-3 flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-[8px] flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0"
                    style={{ backgroundColor: skill.color }}
                  >
                    {skill.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-semibold text-gray-900 truncate">
                        {skill.name}
                      </span>
                      <span className="text-[11px] font-bold text-[#007AFF]">
                        {skill.pct}%
                      </span>
                    </div>
                    {/* iOS style progress bar */}
                    <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${skill.pct}%`, backgroundColor: skill.color }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* iOS Bottom Home Bar */}
          <div className="py-2 bg-white/80 backdrop-blur-xl border-t border-gray-200 shrink-0">
            <button
              onClick={() => navigateTo('home')}
              className="w-[134px] h-[5px] rounded-full bg-gray-800/40 mx-auto block hover:bg-gray-800/70 active:scale-95 transition-all cursor-pointer"
              aria-label="Kembali ke beranda"
            />
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* PAGE 6: NOTES (APPLE NOTES STYLE) */}
      {/* ========================================================================= */}
      {page === 'notes' && (
        <main className="relative h-full flex flex-col bg-[#FDFCF7] text-gray-900 pt-[52px]">
          {/* iOS Top Navigation Bar */}
          <header className="flex items-center justify-between px-4 py-2 border-b border-amber-200/50 bg-[#FDFCF7]/90 backdrop-blur-xl shrink-0">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center text-[#F5A623] text-[15px] font-semibold active:opacity-60 cursor-pointer"
            >
              <span className="text-[22px] mr-0.5 leading-none">‹</span> Catatan
            </button>
            <span className="text-[11px] text-gray-400 font-medium">Semua Catatan</span>
            <button
              onClick={() => navigateTo('contact')}
              className="text-[#F5A623] text-[14px] font-semibold active:opacity-60 cursor-pointer"
            >
              Kontak
            </button>
          </header>

          <section className="flex-1 overflow-y-auto px-5 py-4 [scrollbar-width:none]">
            <span className="text-[11px] text-gray-400 block text-center mb-2">
              {formatDate(now)} pukul {formatTime(now)}
            </span>

            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight leading-tight mb-2">
              Tentang Saya & Visi Rekayasa
            </h1>

            <p className="text-[13px] text-gray-700 leading-relaxed mb-4">
              {I18N.id.aboutDesc}
            </p>

            <h2 className="text-[14px] font-bold text-gray-900 mb-2 border-b border-amber-200 pb-1">
              Prinsip & Kebiasaan Kerja
            </h2>

            <div className="space-y-2 mb-4">
              {I18N.id.workHabits.map((habit) => (
                <div key={habit.title} className="flex items-start gap-2.5">
                  <span className="text-base leading-none mt-0.5">{habit.icon}</span>
                  <div>
                    <h3 className="text-[12px] font-bold text-gray-900">{habit.title}</h3>
                    <p className="text-[11px] text-gray-600 leading-normal">{habit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-[14px] bg-amber-50 border border-amber-200/80 text-amber-900 text-xs">
              <strong className="block mb-1">Status Ketersediaan:</strong>
              Siap untuk peluang Full-time, Kontrak, atau Remote Engineering.
            </div>
          </section>

          {/* iOS Bottom Home Bar */}
          <div className="py-2 bg-[#FDFCF7]/90 backdrop-blur-xl border-t border-amber-200/50 shrink-0">
            <button
              onClick={() => navigateTo('home')}
              className="w-[134px] h-[5px] rounded-full bg-gray-800/40 mx-auto block hover:bg-gray-800/70 active:scale-95 transition-all cursor-pointer"
              aria-label="Kembali ke beranda"
            />
          </div>
        </main>
      )}
    </div>
  )
}
