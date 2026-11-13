import { useState } from 'react'

export interface WallpaperOption {
  id: string
  name: string
  gradient: string
  preview: string
}

export const WALLPAPERS: WallpaperOption[] = [
  {
    id: 'noble',
    name: 'Noble Numbat (Default)',
    gradient: 'radial-gradient(circle at 80% 20%, #77216F 0%, #3e1239 45%, #1d0718 100%)',
    preview: 'linear-gradient(135deg, #77216F, #1d0718)',
  },
  {
    id: 'jammy',
    name: 'Jammy Violet',
    gradient: 'radial-gradient(circle at 75% 25%, #5e2750 0%, #2c001e 55%, #11000b 100%)',
    preview: 'linear-gradient(135deg, #5e2750, #11000b)',
  },
  {
    id: 'midnight',
    name: 'Midnight Slate',
    gradient: 'radial-gradient(circle at 80% 20%, #1e3a5f 0%, #0f172a 55%, #020617 100%)',
    preview: 'linear-gradient(135deg, #1e3a5f, #020617)',
  },
  {
    id: 'sunset',
    name: 'Ubuntu Sunset',
    gradient: 'radial-gradient(circle at 80% 20%, #c2410c 0%, #431407 55%, #1c0a04 100%)',
    preview: 'linear-gradient(135deg, #c2410c, #1c0a04)',
  },
]

export default function SettingsApp({
  wallpaperId,
  onSelectWallpaper,
}: {
  wallpaperId: string
  onSelectWallpaper: (id: string) => void
}) {
  const [tab, setTab] = useState<'appearance' | 'about'>('appearance')

  return (
    <div className="w-full h-full flex bg-[#1e1e1e] text-[#f0f0f0]">
      {/* Sidebar */}
      <div className="w-44 bg-[#262626] border-r border-white/10 p-3! flex flex-col gap-1.5">
        <button
          onClick={() => setTab('appearance')}
          className={`text-left px-3! py-2! rounded-lg text-[13px] cursor-pointer transition ${
            tab === 'appearance' ? 'bg-ub-orange text-white font-medium' : 'text-[#ccc] hover:bg-white/8'
          }`}
        >
          🎨 Appearance
        </button>
        <button
          onClick={() => setTab('about')}
          className={`text-left px-3! py-2! rounded-lg text-[13px] cursor-pointer transition ${
            tab === 'about' ? 'bg-ub-orange text-white font-medium' : 'text-[#ccc] hover:bg-white/8'
          }`}
        >
          ℹ️ About System
        </button>
      </div>

      {/* Main Panel */}
      <div className="flex-1 p-6! overflow-y-auto">
        {tab === 'appearance' ? (
          <div>
            <h3 className="text-[17px] font-semibold mb-1!">Desktop Wallpaper</h3>
            <p className="text-[12px] text-[#aaa] mb-4!">Pilih tema latar belakang Ubuntu Desktop.</p>
            <div className="grid grid-cols-2 gap-4">
              {WALLPAPERS.map((wp) => {
                const active = wp.id === wallpaperId
                return (
                  <button
                    key={wp.id}
                    onClick={() => onSelectWallpaper(wp.id)}
                    className={`group rounded-xl overflow-hidden border-2 text-left transition cursor-pointer ${
                      active ? 'border-ub-orange shadow-[0_0_0_2px_rgba(233,84,32,0.3)]' : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="h-24 w-full" style={{ background: wp.preview }} />
                    <div className="px-3! py-2! bg-[#2a2a2a] text-[12px] flex items-center justify-between">
                      <span>{wp.name}</span>
                      {active && <span className="text-ub-orange font-bold">✓</span>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4!">
            <div className="flex items-center gap-4 p-4! rounded-xl bg-[#262626] border border-white/10">
              <div className="w-12 h-12 rounded-full bg-ub-orange flex items-center justify-center text-[22px] font-bold text-white">
                U
              </div>
              <div>
                <h3 className="text-[16px] font-semibold">Ubuntu 24.04 LTS (Noble Numbat)</h3>
                <p className="text-[12px] text-[#aaa]">Portfolio Interactive Workstation Edition</p>
              </div>
            </div>
            <div className="rounded-xl bg-[#262626] border border-white/10 divide-y divide-white/10 text-[13px]">
              <div className="flex justify-between px-4! py-2.5!">
                <span className="text-[#aaa]">Owner</span>
                <span>Alif Fadillah Ummar</span>
              </div>
              <div className="flex justify-between px-4! py-2.5!">
                <span className="text-[#aaa]">Windowing System</span>
                <span>React 18 + Three.js Canvas</span>
              </div>
              <div className="flex justify-between px-4! py-2.5!">
                <span className="text-[#aaa]">Display Resolution</span>
                <span>1280 × 720 (Virtual Monitor)</span>
              </div>
              <div className="flex justify-between px-4! py-2.5!">
                <span className="text-[#aaa]">Installed Apps</span>
                <span>7 Applications</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
