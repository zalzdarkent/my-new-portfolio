import { useEffect, useRef, useState, type FormEvent, type PointerEvent as RPE, type ReactNode } from 'react'
import { ThumbPlayer } from './motion'
import { playKeyClick, playMouseDown, playMouseUp } from './sound'
import './desktop.css'

export const SCREEN_W = 1280
export const SCREEN_H = 720

type AppId = 'showcase' | 'notes' | 'credits'
type Win = { id: AppId; x: number; y: number; z: number; min: boolean; max?: boolean; closing?: boolean }

const APPS: Record<AppId, { title: string; icon: IconKind; w: number; h: number }> = {
  showcase: { title: 'Showcase 2022 - Alif Fadillah Ummar', icon: 'terminal', w: 940, h: 590 },
  notes: { title: 'Text Editor - readme.txt', icon: 'note', w: 480, h: 360 },
  credits: { title: 'Credits', icon: 'folder', w: 400, h: 280 },
}

type IconKind = 'terminal' | 'note' | 'folder' | 'browser'
function Icon({ kind, size = 32 }: { kind: IconKind; size?: number }) {
  if (kind === 'terminal') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="10" fill="#2d0922" />
        <rect x="2" y="2" width="44" height="44" rx="8" stroke="#E95420" strokeWidth="2" />
        <path d="M12 16L22 24L12 32" stroke="#4af626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 32H36" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }
  if (kind === 'note') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="10" fill="#333333" />
        <path d="M14 10H34L38 14V38H14V10Z" fill="#fff" />
        <path d="M18 18H30M18 24H30M18 30H26" stroke="#555" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M6 12C6 9.79086 7.79086 8 10 8H20L24 12H38C40.2091 12 42 13.7909 42 16V36C42 38.2091 40.2091 40 38 40H10C7.79086 40 6 38.2091 6 36V12Z" fill="#E95420" />
      <path d="M6 18H42V36C42 38.2091 40.2091 40 38 40H10C7.79086 40 6 38.2091 6 36V18Z" fill="#FF7F4A" />
    </svg>
  )
}

const SKILLS = [
  ['TypeScript', 92],
  ['React', 88],
  ['three.js / WebGL', 76],
  ['Node.js', 70],
  ['UI design', 64],
] as const

const JOBS = [
  ['2022 — now', 'Studio One', 'Engineer', 'Built and shipped customer-facing web apps with a small team.'],
  ['2021', 'Lab Two', 'Intern', 'Prototyped 3D visualisations and internal tooling.'],
  ['2019', 'Freelance', 'Developer', 'Websites and small games for local clients.'],
] as const

const PROJECTS = [
  { name: 'This website', text: 'A 3D desk with a working computer inside.', kind: 'cube', hue: 190 },
  { name: 'Pocket synth', text: 'A browser music toy you can play with the keyboard.', kind: 'bars', hue: 300 },
  { name: 'Trail map', text: 'Offline maps for hikers, with live tracking.', kind: 'map', hue: 140 },
] as const

const NAME = 'Alif Fadillah Ummar'
const NAV = ['Home', 'About', 'Experience', 'Projects', 'Contact'] as const
type Page = (typeof NAV)[number]

function Contact() {
  const [sent, setSent] = useState(false)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }
  if (sent)
    return (
      <div className="sent">
        <div className="check">✓</div>
        <h3>Thanks! Your message is on its way.</h3>
        <button className="btn" onClick={() => setSent(false)}>Send another</button>
      </div>
    )
  return (
    <form className="form" onSubmit={submit}>
      <label>Name<input required placeholder="Your name" /></label>
      <label>Email<input required type="email" placeholder="you@example.com" /></label>
      <label>Message<textarea required rows={4} placeholder="Say hello…" /></label>
      <button className="btn" type="submit">Send message</button>
    </form>
  )
}

function Showcase() {
  const [page, setPage] = useState<Page>('Home')
  const body: Record<Exclude<Page, 'Home'>, ReactNode> & { Home: null } = {
    Home: null,
    About: (
      <>
        <h2>About me</h2>
        <p>I build interactive things for the web: tools, games and the occasional strange experiment.</p>
        <p>When I'm not at the keyboard I'm probably outside, cooking, or taking something apart.</p>
        <h3>Skills</h3>
        <div className="skills">
          {SKILLS.map(([name, pct], i) => (
            <div key={name} className="skill">
              <span>{name}</span>
              <div className="bar"><i style={{ width: `${pct}%`, animationDelay: `${0.25 + i * 0.1}s` }} /></div>
            </div>
          ))}
        </div>
      </>
    ),
    Experience: (
      <>
        <h2>Experience</h2>
        <div className="timeline">
          {JOBS.map(([when, where, role, text], i) => (
            <div key={where} className="timeline-card" style={{ animationDelay: `${0.15 + i * 0.12}s` }}>
              <div className="timeline-bar" />
              <div className="timeline-content">
                <span className="when">{when}</span>
                <h3>{where} <small>— {role}</small></h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    ),
    Projects: (
      <>
        <h2>Projects</h2>
        <div className="projects">
          {PROJECTS.map((p, i) => (
            <div key={p.name} className="project" style={{ animationDelay: `${0.12 + i * 0.1}s` }}>
              <ThumbPlayer kind={p.kind} hue={p.hue} />
              <div className="project-text">
                <b>{p.name}</b>
                <p>{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    ),
    Contact: (
      <>
        <h2>Contact</h2>
        <p>Have a project in mind or just want to say hi? Drop me a line.</p>
        <Contact />
      </>
    ),
  }
  const links = (
    <nav className="links">
      {NAV.slice(1).map((p) => (
        <button key={p} className={p === page ? 'on' : ''} onClick={() => setPage(p)}>
          {p.toUpperCase()}
        </button>
      ))}
    </nav>
  )

  if (page === 'Home')
    return (
      <div className="showcase home">
        <h1 className="name" aria-label={NAME}>
          {NAME.split('').map((ch, i) => (
            <span key={i} style={{ animationDelay: `${0.1 + i * 0.04}s` }}>{ch}</span>
          ))}
        </h1>
        <p className="role">Software Engineer</p>
        {links}
      </div>
    )

  return (
    <div className="showcase">
      <aside>
        <button className="mini-name" onClick={() => setPage('Home')}>{NAME}</button>
        <p className="mini-role">Software Engineer</p>
        {links}
      </aside>
      <article key={page} className="page">
        {body[page]}
      </article>
    </div>
  )
}

const CONTENT: Record<AppId, ReactNode> = {
  showcase: <Showcase />,
  notes: (
    <textarea
      className="notepad"
      defaultValue={'Ubuntu 24.04 LTS (Noble Numbat)\n\nWelcome to my interactive desktop!\nClick any app on the desktop or dock on the left.\nPress Esc or click outside the monitor to step back to the desk.'}
    />
  ),
  credits: (
    <div className="pad">
      <p><b>Design & build</b><br />Alif Fadillah Ummar</p>
      <p style={{ marginTop: 12 }}><b>Theme & Environment</b><br />Ubuntu Linux (Yaru Dark) with Three.js & React</p>
    </div>
  ),
}

function Clock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const dateStr = now.toLocaleDateString([], { month: 'short', day: 'numeric' })
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return <div className="ub-clock">{dateStr} {timeStr}</div>
}

export default function Desktop({ zoomed, onEnter }: { zoomed: boolean; onEnter: () => void }) {
  const [wins, setWins] = useState<Win[]>([{ id: 'showcase', x: 185, y: 58, z: 1, min: false }])
  const [launcher, setLauncher] = useState(false)
  const top = useRef(1)
  const root = useRef<HTMLDivElement>(null)

  const focus = (id: AppId) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, z: ++top.current, min: false } : w)))
  const open = (id: AppId) => {
    setLauncher(false)
    setWins((ws) =>
      ws.some((w) => w.id === id && !w.closing)
        ? ws.map((w) => (w.id === id ? { ...w, z: ++top.current, min: false } : w))
        : [...ws.filter((w) => w.id !== id), { id, x: 200 + ws.length * 40, y: 70 + ws.length * 30, z: ++top.current, min: false }],
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
              <button className="win-btn min" onPointerDown={(e) => e.stopPropagation()} onClick={() => minimize(w.id)} aria-label="Minimize">−</button>
              <button className="win-btn max" onPointerDown={(e) => e.stopPropagation()} onClick={() => toggleMax(w.id)} aria-label="Maximize">□</button>
              <button className="win-btn close" onPointerDown={(e) => e.stopPropagation()} onClick={() => close(w.id)} aria-label="Close">✕</button>
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
