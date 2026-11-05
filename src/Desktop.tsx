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
  credits: { title: 'Credits', icon: 'folder', w: 420, h: 300 },
}

const CONTENT: Record<AppId, ReactNode> = {
  showcase: <Showcase />,
  notes: (
    <textarea
      className="notepad"
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
    <div className="pad">
      <p>
        <b>Design & Development</b>
        <br />
        Alif Fadillah Ummar
        <br />
        <small style={{ color: '#aaa' }}>Full Stack Developer & Junior Software Engineer</small>
      </p>
      <p style={{ marginTop: 14 }}>
        <b>Environment & Tech Stack</b>
        <br />
        Ubuntu Linux (Yaru Dark Theme)
        <br />
        Three.js 3D Interactive Room, CSS3DRenderer, React, TypeScript, Remotion.
      </p>
      <p style={{ marginTop: 14 }}>
        <b>Original Web Reference</b>
        <br />
        <a
          href="https://alif-fadillah-portfolio.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--ub-orange)' }}
        >
          alif-fadillah-portfolio.vercel.app
        </a>
      </p>
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
      className="os"
      ref={root}
      onPointerDownCapture={() => playMouseDown()}
      onPointerUpCapture={() => playMouseUp()}
      onKeyDownCapture={(e) => playKeyClick(e.key === ' ')}
    >
      {/* Top Status Bar */}
      <div className="ub-topbar">
        <button className={`ub-activities${launcher ? ' active' : ''}`} onClick={() => setLauncher((v) => !v)}>
          Activities
        </button>
        <Clock />
        <div className="ub-status">
          <span>🔊</span>
          <span>📶</span>
          <span>🔋 100%</span>
          <span>⏻</span>
        </div>
      </div>

      {/* Ubuntu Left Dock */}
      <div className="ub-dock">
        {(Object.keys(APPS) as AppId[]).map((id) => {
          const isOpen = wins.some((w) => w.id === id && !w.closing && !w.min)
          return (
            <button
              key={id}
              className={`dock-icon${isOpen ? ' active' : ''}`}
              title={APPS[id].title}
              onClick={() => open(id)}
            >
              <Icon kind={APPS[id].icon} size={28} />
            </button>
          )
        })}
        <button
          className={`dock-icon apps-grid${launcher ? ' active' : ''}`}
          title="Show Applications"
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
      <div className="icons">
        {(Object.keys(APPS) as AppId[]).map((id, i) => (
          <button
            key={id}
            className="icon"
            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            onClick={() => open(id)}
            onDoubleClick={() => open(id)}
          >
            <Icon kind={APPS[id].icon} size={36} />
            <span>{APPS[id].title.split(' - ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Windows */}
      {wins.map((w) => (
        <div
          key={w.id}
          className={`win${w.min ? ' min' : ''}${w.max ? ' max' : ''}${w.closing ? ' closing' : ''}`}
          style={
            w.max
              ? { left: 60, top: 32, width: SCREEN_W - 60, height: SCREEN_H - 32, zIndex: w.z, borderRadius: 0 }
              : { left: w.x, top: w.y, width: APPS[w.id].w, height: APPS[w.id].h, zIndex: w.z }
          }
          onPointerDown={() => w.z !== front && focus(w.id)}
        >
          <div
            className={`title${w.z === front ? '' : ' idle'}`}
            onPointerDown={(e) => drag(w.id, e)}
            onDoubleClick={() => toggleMax(w.id)}
          >
            <div className="win-title-text">{APPS[w.id].title}</div>
            <div className="win-controls">
              <button
                className="win-btn min"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => minimize(w.id)}
                aria-label="Minimize"
              >
                −
              </button>
              <button
                className="win-btn max"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => toggleMax(w.id)}
                aria-label="Maximize"
              >
                □
              </button>
              <button
                className="win-btn close"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => close(w.id)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="body">{CONTENT[w.id]}</div>
        </div>
      ))}

      {/* Ubuntu Activities / App Launcher Overlay */}
      {launcher && (
        <div className="ub-launcher" onClick={() => setLauncher(false)}>
          <div className="ub-launcher-box" onClick={(e) => e.stopPropagation()}>
            <h3>Applications</h3>
            <div className="ub-launcher-grid">
              {(Object.keys(APPS) as AppId[]).map((id) => (
                <button key={id} className="ub-launcher-item" onClick={() => open(id)}>
                  <Icon kind={APPS[id].icon} size={48} />
                  <span>{APPS[id].title.split(' - ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {!zoomed && <div className="shield" onClick={onEnter} />}
    </div>
  )
}
