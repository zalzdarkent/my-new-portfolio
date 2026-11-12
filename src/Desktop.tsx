import { useRef, useState, type PointerEvent as RPE, type ReactNode } from 'react'
import Clock from './components/desktop/Clock'
import Icon from './components/desktop/Icon'
import Showcase from './components/desktop/Showcase'
import { playKeyClick, playMouseDown, playMouseUp } from './sound'
import type { AppId, IconKind, Win } from './types/portfolio'
import './desktop.css'

export const SCREEN_W = 1280
export const SCREEN_H = 720

const APPS: Record<AppId, { title: string; icon: IconKind; w: number; h: number }> = {
  showcase: { title: 'Showcase - Alif Fadillah Ummar', icon: 'terminal', w: 960, h: 600 },
  notes: { title: 'Text Editor - readme.txt', icon: 'note', w: 520, h: 400 },
  credits: { title: 'Credits', icon: 'folder', w: 640, h: 610 },
}

const ASSET_CREDITS = [
  {
    title: 'Gaming-pc',
    url: 'https://sketchfab.com/3d-models/gaming-pc-364175250e8847998d0135c357d8b60d',
    author: 'ws12x1',
    authorUrl: 'https://sketchfab.com/ws12x1',
    license: 'CC BY 4.0',
    modified: false,
  },
  {
    title: 'Gaming Chair',
    url: 'https://sketchfab.com/3d-models/gaming-chair-7c276ea3a3a24bda893f0dd70d53d141',
    author: 'Pradeep.Kumar2',
    authorUrl: 'https://sketchfab.com/Pradeep.Kumar2',
    license: 'CC BY 4.0',
    modified: true,
  },
  {
    title: 'simple retro Desk Lamp',
    url: 'https://sketchfab.com/3d-models/simple-retro-desk-lamp-9818614b5da1479ba43a6a1216b1688f',
    author: 'ribot02',
    authorUrl: 'https://sketchfab.com/ribot02',
    license: 'CC BY 4.0',
    modified: true,
  },
  {
    title: 'Phone Holder',
    url: 'https://sketchfab.com/3d-models/phone-holder-c7f862eb830b439ebf5852f67d843907',
    author: 'cettina.savatti',
    authorUrl: 'https://sketchfab.com/cettina.savatti',
    license: 'CC BY 4.0',
    modified: true,
  },
  {
    title: 'iPhone 16 - Free',
    url: 'https://sketchfab.com/3d-models/iphone-16-free-d58591e88a824dfd8cef0af616273b02',
    author: 'Wes',
    authorUrl: 'https://sketchfab.com/wimell',
    license: 'Sketchfab Standard License',
    modified: true,
  },
  {
    title: 'Notebook (black+white)',
    url: 'https://sketchfab.com/3d-models/notebook-blackwhite-f3946ccc6d77475eb2e9b42e2f24ca8f',
    author: 'KatzeSchwarz',
    authorUrl: 'https://sketchfab.com/katzeschwarz',
    license: 'CC BY 4.0',
    modified: true,
  },
  {
    title: 'Faber Castell Ballpoint Pen',
    url: 'https://sketchfab.com/3d-models/faber-castell-ballpoint-pen-ca69fdd81e634048b77932b4851115bc',
    author: 'chemicalX',
    authorUrl: 'https://sketchfab.com/chemicalX3D',
    license: 'CC BY 4.0',
    modified: true,
  },
  {
    title: 'Spiderman - No Way Home',
    url: 'https://sketchfab.com/3d-models/spiderman-no-way-home-6c2ee86c08af4d8aad782b1c3eaed6e4',
    author: 'Veysel Gök',
    authorUrl: 'https://sketchfab.com/veysel.gok.vg',
    license: 'CC BY 4.0',
    modified: true,
  },
]

const DOCK =
  "group relative w-11 h-11 rounded-[10px] flex items-center justify-center bg-white/5 transition-all duration-200 ease-out-expo hover:bg-white/18 hover:scale-[1.08] motion-reduce:hover:scale-100 hover:before:content-[attr(aria-label)] hover:before:absolute hover:before:left-14 hover:before:top-1/2 hover:before:-translate-y-1/2 hover:before:bg-[rgba(18,18,18,0.96)] hover:before:text-[#f6f6f6] hover:before:text-[12px] hover:before:px-2.5 hover:before:py-1 hover:before:rounded-md hover:before:whitespace-nowrap hover:before:pointer-events-none hover:before:shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
const DOCK_ACTIVE =
  "after:content-[''] after:absolute after:-left-1.5 after:w-1 after:h-4 after:rounded-r-[3px] after:bg-ub-orange after:shadow-[0_0_8px_var(--accent)]"
const WIN = 'animate-[win-pop_0.25s_cubic-bezier(0.16,1,0.3,1)_backwards] motion-reduce:animate-none'
const WBTN =
  'w-5 h-5 rounded-full border-0 flex items-center justify-center text-[11px] text-white/80 bg-white/14 transition-all duration-150 hover:text-white'

const CONTENT: Record<AppId, ReactNode> = {
  showcase: <Showcase />,
  notes: (
    <textarea
      className="w-full h-full p-4! bg-[#1e1e1e] text-[#e0e0e0] font-[monospace] text-[13px] leading-[1.5] border-0 outline-none resize-none"
      defaultValue={`Ubuntu 24.04 LTS (Noble Numbat)
=====================================
Portofolio & Showcase Alif Fadillah Ummar
Full Stack Developer & Junior Software Engineer
Lulusan S1 Informatika UNSIKA (Cum Laude)

Spesialisasi Teknologi:
- Backend: Laravel, Node.js, Express, CodeIgniter, MySQL, PostgreSQL
- Frontend: React, Next.js, TypeScript, Tailwind CSS
- AI & Computer Vision: Python, YOLO, OpenCV
- IoT & Industri: Sensor telemetry, E-Checksheet, PM Dashboard

Tautan & Kontak:
- Email: arszalzdarker@email.com
- GitHub: https://github.com/zalzdarkent
- LinkedIn: https://linkedin.com/in/alif-fadillah-ummar-07001224b/
- Web Portofolio: https://alif-fadillah-portfolio.vercel.app

Tips Navigasi:
- Klik aplikasi di dock kiri untuk beralih antar aplikasi.
- Tekan 'Free look' di kanan atas atau klik di luar layar untuk kembali melihat meja kerja 3D!`}
    />
  ),
  credits: (
    <div className="p-6! text-[#ddd]">
      <p>
        <b>Design & Development</b>
        <br />
        Alif Fadillah Ummar
        <br />
        <small style={{ color: '#aaa' }}>Full Stack Developer & Junior Software Engineer</small>
      </p>
      <div style={{ marginTop: 14 }}>
        <b>3D Assets</b>
        <br />
        Model assets used in the interactive desk scene:
        <ul style={{ margin: '10px 0 0', paddingLeft: 20, lineHeight: 1.7 }}>
          {ASSET_CREDITS.map((asset) => (
            <li key={asset.title} style={{ marginBottom: 5 }}>
              <a href={asset.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ub-orange)' }}>
                {asset.title}
              </a>{' '}
              by{' '}
              <a href={asset.authorUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#ddd' }}>
                {asset.author}
              </a>{' '}
              —{' '}
              {asset.license === 'CC BY 4.0' ? (
                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--ub-orange)' }}
                >
                  {asset.license}
                </a>
              ) : (
                asset.license
              )}
              {asset.modified ? ' · modified for this scene' : ''}
              {asset.title === 'simple retro Desk Lamp' ? ' · used twice' : ''}
            </li>
          ))}
        </ul>
      </div>
    </div>
  ),
}

export default function Desktop({ zoomed, onEnter }: { zoomed: boolean; onEnter: () => void }) {
  const [wins, setWins] = useState<Win[]>([{ id: 'showcase', x: 175, y: 55, z: 1, min: false }])
  const [launcher, setLauncher] = useState(false)
  const top = useRef(1)
  const root = useRef<HTMLDivElement>(null)

  const focus = (id: AppId) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, z: ++top.current, min: false } : w)))
  const open = (id: AppId) => {
    setLauncher(false)
    setWins((ws) =>
      ws.some((w) => w.id === id && !w.closing)
        ? ws.map((w) => (w.id === id ? { ...w, z: ++top.current, min: false } : w))
        : [...ws.filter((w) => w.id !== id), { id, x: 190 + ws.length * 35, y: 65 + ws.length * 25, z: ++top.current, min: false }],
    )
  }
  const close = (id: AppId) => {
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, closing: true } : w)))
    setTimeout(() => setWins((ws) => ws.filter((w) => !(w.id === id && w.closing))), 200)
  }
  const minimize = (id: AppId) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, min: true } : w)))
  const toggleMax = (id: AppId) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, max: !w.max, z: ++top.current } : w)))

  const drag = (id: AppId, e: RPE) => {
    focus(id)
    const w0 = wins.find((w) => w.id === id)!
    if (w0.max) return
    const scale = root.current!.getBoundingClientRect().width / SCREEN_W || 1
    const sx = e.clientX
    const sy = e.clientY
    let raf = 0
    const move = (ev: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() =>
        setWins((ws) =>
          ws.map((w) =>
            w.id === id
              ? {
                ...w,
                x: Math.min(SCREEN_W - 80, Math.max(60, w0.x + (ev.clientX - sx) / scale)),
                y: Math.min(SCREEN_H - 60, Math.max(32, w0.y + (ev.clientY - sy) / scale)),
              }
              : w,
          ),
        ),
      )
    }
    const up = () => {
      removeEventListener('pointermove', move)
      removeEventListener('pointerup', up)
    }
    addEventListener('pointermove', move)
    addEventListener('pointerup', up)
  }

  const live = wins.filter((w) => !w.min && !w.closing)
  const front = Math.max(0, ...live.map((w) => w.z))

  return (
    <div
      className="os relative w-[1280px] h-[720px] overflow-hidden bg-[radial-gradient(circle_at_80%_20%,#77216F_0%,#3e1239_45%,#1d0718_100%)] text-[#f6f6f6] font-ubuntu text-[14px] tracking-[0.2px] select-none after:content-[''] after:absolute after:inset-0 after:pointer-events-none after:z-[10001] after:bg-[radial-gradient(ellipse_90%_80%_at_50%_40%,transparent_55%,rgba(0,0,0,0.28)_100%)]"
      ref={root}
      onPointerDownCapture={() => playMouseDown()}
      onPointerUpCapture={() => playMouseUp()}
      onKeyDownCapture={(e) => playKeyClick(e.key === ' ')}
    >
      {/* Top Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-ub-panel flex items-center justify-between px-4! text-[13px] font-medium text-[#e6e6e6] z-[10000] shadow-[0_1px_0_rgba(0,0,0,0.5)]">
        <button className={`px-3! py-[3px]! rounded-xl cursor-pointer transition-[background-color] duration-150 hover:bg-white/16${launcher ? ' bg-white/16' : ''}`} onClick={() => setLauncher((v) => !v)}>
          Activities
        </button>
        <Clock />
        <div className="flex items-center gap-3 text-[#bbb] text-[12px]">
          <span>🔊</span>
          <span>📶</span>
          <span>🔋 100%</span>
          <span>⏻</span>
        </div>
      </div>

      {/* Ubuntu Left Dock */}
      <div className="absolute left-0 top-8 bottom-0 w-[60px] bg-[rgba(18,18,18,0.9)] shadow-[1px_0_0_rgba(255,255,255,0.08)] flex flex-col items-center py-3! gap-3 z-[9999]">
        {(Object.keys(APPS) as AppId[]).map((id) => {
          const isOpen = wins.some((w) => w.id === id && !w.closing && !w.min)
          return (
            <button
              key={id}
              className={`${DOCK}${isOpen ? ` ${DOCK_ACTIVE}` : ''}`}
              title={APPS[id].title}
              aria-label={APPS[id].title}
              onClick={() => open(id)}
            >
              <Icon kind={APPS[id].icon} size={28} />
            </button>
          )
        })}
        <button
          className={`${DOCK} mt-auto! text-[#ddd]${launcher ? ` ${DOCK_ACTIVE}` : ''}`}
          title="Show Applications"
          aria-label="Show Applications"
          onClick={() => setLauncher((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            {[4, 12, 20].map((cx) =>
              [4, 12, 20].map((cy) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2" />),
            )}
          </svg>
        </button>
      </div>

      {/* Desktop App Icons */}
      <div className="absolute left-20 top-12 grid gap-6">
        {(Object.keys(APPS) as AppId[]).map((id, i) => (
          <button
            key={id}
            className="group grid justify-items-center gap-1.5 w-[86px] text-white transition-transform duration-200 ease-out-expo hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 [&>svg]:drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            onClick={() => open(id)}
            onDoubleClick={() => open(id)}
          >
            <Icon kind={APPS[id].icon} size={36} />
            <span className="px-1.5! py-0.5! text-center rounded text-[12px] [text-shadow:0_1px_3px_rgba(0,0,0,0.8)] group-focus:bg-ub-orange">{APPS[id].title.split(' - ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Windows */}
      {wins.map((w) => (
        <div
          key={w.id}
          className={`absolute ${w.min ? 'hidden' : 'flex'} flex-col rounded-[10px] overflow-hidden bg-ub-window text-[#f1f1f1] shadow-[0_18px_45px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.12)] ${WIN} transition-[opacity,scale] duration-200${w.closing ? ' opacity-0 scale-95' : ''}`}
          style={
            w.max
              ? { left: 60, top: 32, width: SCREEN_W - 60, height: SCREEN_H - 32, zIndex: w.z, borderRadius: 0 }
              : { left: w.x, top: w.y, width: APPS[w.id].w, height: APPS[w.id].h, zIndex: w.z }
          }
          onPointerDown={() => w.z !== front && focus(w.id)}
        >
          <div
            className={`h-[38px] bg-ub-header shadow-[inset_0_-1px_0_rgba(0,0,0,0.5)] flex items-center px-3! cursor-grab active:cursor-grabbing select-none${w.z === front ? '' : ' opacity-85'}`}
            onPointerDown={(e) => drag(w.id, e)}
            onDoubleClick={() => toggleMax(w.id)}
          >
            <div className="flex-1 text-center text-[13px] font-semibold text-[#e0e0e0] overflow-hidden text-ellipsis whitespace-nowrap">{APPS[w.id].title}</div>
            <div className="flex items-center gap-2">
              <button
                className={`${WBTN} hover:bg-[#dfab01]`}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => minimize(w.id)}
                aria-label="Minimize"
              >
                −
              </button>
              <button
                className={`${WBTN} hover:bg-[#2eb872]`}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => toggleMax(w.id)}
                aria-label="Maximize"
              >
                □
              </button>
              <button
                className={`${WBTN} hover:bg-[#e95420]`}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => close(w.id)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-ub-header">{CONTENT[w.id]}</div>
        </div>
      ))}

      {/* Ubuntu Activities / App Launcher Overlay */}
      {launcher && (
        <div className="absolute inset-[32px_0_0_60px] bg-[rgba(15,5,14,0.85)] z-[15000] flex items-center justify-center animate-[win-pop_0.2s_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none" onClick={() => setLauncher(false)}>
          <div className="text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[20px] mb-6! text-white">Applications</h3>
            <div className="flex gap-8">
              {(Object.keys(APPS) as AppId[]).map((id) => (
                <button key={id} className="flex flex-col items-center gap-2.5 px-6! py-4! rounded-xl transition-[background-color,translate] duration-150 hover:bg-white/12 hover:-translate-y-[3px] motion-reduce:hover:translate-y-0" onClick={() => open(id)}>
                  <Icon kind={APPS[id].icon} size={48} />
                  <span>{APPS[id].title.split(' - ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {!zoomed && <div className="absolute inset-0 z-[20000] cursor-pointer" onClick={onEnter} />}
    </div>
  )
}
