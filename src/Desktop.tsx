import { useEffect, useRef, useState, type FormEvent, type PointerEvent as RPE, type ReactNode } from 'react'
import { ThumbPlayer } from './motion'
import './desktop.css'

export const SCREEN_W = 1024
export const SCREEN_H = 768

type AppId = 'showcase' | 'notes' | 'credits'
type Win = { id: AppId; x: number; y: number; z: number; min: boolean; closing?: boolean }

const APPS: Record<AppId, { title: string; icon: IconKind; w: number; h: number }> = {
  showcase: { title: 'Showcase 2022 - Jordan Westlake', icon: 'computer', w: 900, h: 690 },
  notes: { title: 'Notepad - readme.txt', icon: 'note', w: 420, h: 300 },
  credits: { title: 'Credits', icon: 'folder', w: 360, h: 240 },
}

type IconKind = 'computer' | 'note' | 'folder'
function Icon({ kind, size = 36 }: { kind: IconKind; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      {kind === 'computer' && (
        <>
          <rect x="4" y="4" width="24" height="18" fill="#c0c0c0" stroke="#000" />
          <rect x="7" y="7" width="18" height="12" fill="#1d6b70" />
          <rect x="10" y="24" width="12" height="4" fill="#c0c0c0" stroke="#000" />
        </>
      )}
      {kind === 'note' && (
        <>
          <rect x="7" y="3" width="18" height="26" fill="#fff" stroke="#000" />
          {[8, 12, 16, 20, 24].map((y) => <rect key={y} x="10" y={y} width="12" height="1.5" fill="#00007b" />)}
        </>
      )}
      {kind === 'folder' && <path d="M3 8h10l2 3h14v16H3z" fill="#f4d35e" stroke="#000" />}
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

const NAME = 'Jordan Westlake'
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
        <ol className="timeline">
          {JOBS.map(([when, where, role, text], i) => (
            <li key={where} style={{ animationDelay: `${0.15 + i * 0.12}s` }}>
              <span className="when">{when}</span>
              <h3>{where} <small>— {role}</small></h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
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
      defaultValue={'Thanks for stopping by!\n\nDouble-click the icons on the desktop to open programs.\nPress Esc or click outside the monitor to step back from the desk.'}
    />
  ),
  credits: (
    <div className="pad">
      <p><b>Design & build</b><br />Jordan Westlake</p>
      <p><b>Made with</b><br />React, three.js, Remotion and TypeScript</p>
    </div>
  ),
}

function Clock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 10000)
    return () => clearInterval(t)
  }, [])
  return <div className="clock">{now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</div>
}

export default function Desktop({ zoomed, onEnter }: { zoomed: boolean; onEnter: () => void }) {
  const [wins, setWins] = useState<Win[]>([{ id: 'showcase', x: 104, y: 14, z: 1, min: false }])
  const [menu, setMenu] = useState(false)
  const top = useRef(1)
  const root = useRef<HTMLDivElement>(null)

  const focus = (id: AppId) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, z: ++top.current, min: false } : w)))
  const open = (id: AppId) => {
    setMenu(false)
    setWins((ws) =>
      ws.some((w) => w.id === id && !w.closing)
        ? ws.map((w) => (w.id === id ? { ...w, z: ++top.current, min: false } : w))
        : [...ws.filter((w) => w.id !== id), { id, x: 110 + ws.length * 40, y: 40 + ws.length * 36, z: ++top.current, min: false }],
    )
  }
  // Play the close animation, then drop the window.
  const close = (id: AppId) => {
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, closing: true } : w)))
    setTimeout(() => setWins((ws) => ws.filter((w) => !(w.id === id && w.closing))), 200)
  }
  const minimize = (id: AppId) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, min: true } : w)))

  // Drag a window by its title bar; pointer deltas are in screen pixels, so undo the 3D scale.
  const drag = (id: AppId, e: RPE) => {
    focus(id)
    const scale = root.current!.getBoundingClientRect().width / SCREEN_W || 1
    const sx = e.clientX
    const sy = e.clientY
    const w0 = wins.find((w) => w.id === id)!
    let raf = 0
    const move = (ev: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() =>
        setWins((ws) =>
          ws.map((w) =>
            w.id === id
              ? {
                  ...w,
                  x: Math.min(SCREEN_W - 80, Math.max(-200, w0.x + (ev.clientX - sx) / scale)),
                  y: Math.min(SCREEN_H - 60, Math.max(0, w0.y + (ev.clientY - sy) / scale)),
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
    <div className="os" ref={root}>
      <div className="icons">
        {(Object.keys(APPS) as AppId[]).map((id, i) => (
          <button
            key={id}
            className="icon"
            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            onDoubleClick={() => open(id)}
            onPointerUp={(e) => e.pointerType === 'touch' && open(id)}
          >
            <Icon kind={APPS[id].icon} />
            <span>{APPS[id].title.split(' - ')[0]}</span>
          </button>
        ))}
      </div>

      {wins.map((w) => (
        <div
          key={w.id}
          className={`win${w.min ? ' min' : ''}${w.closing ? ' closing' : ''}`}
          style={{ left: w.x, top: w.y, width: APPS[w.id].w, height: APPS[w.id].h, zIndex: w.z }}
          onPointerDown={() => w.z !== front && focus(w.id)}
        >
          <div className={`title${w.z === front ? '' : ' idle'}`} onPointerDown={(e) => drag(w.id, e)}>
            <Icon kind={APPS[w.id].icon} size={16} />
            <span>{APPS[w.id].title}</span>
            <button onPointerDown={(e) => e.stopPropagation()} onClick={() => minimize(w.id)} aria-label="Minimize">_</button>
            <button onPointerDown={(e) => e.stopPropagation()} onClick={() => close(w.id)} aria-label="Close">×</button>
          </div>
          <div className="body">{CONTENT[w.id]}</div>
        </div>
      ))}

      <div className={`menu${menu ? ' open' : ''}`}>
        <div className="menu-band">Westlake 2000</div>
        <div>
          {(Object.keys(APPS) as AppId[]).map((id) => (
            <button key={id} onClick={() => open(id)}>
              <Icon kind={APPS[id].icon} size={24} /> {APPS[id].title.split(' - ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="taskbar">
        <button className={`startbtn${menu ? ' down' : ''}`} onClick={() => setMenu((m) => !m)}>
          <b>Start</b>
        </button>
        {wins.filter((w) => !w.closing).map((w) => (
          <button
            key={w.id}
            className={`task${w.z === front && !w.min ? ' down' : ''}`}
            onClick={() => (w.z === front && !w.min ? minimize(w.id) : focus(w.id))}
          >
            <Icon kind={APPS[w.id].icon} size={16} /> {APPS[w.id].title}
          </button>
        ))}
        <Clock />
      </div>

      <div className="crt" />
      {!zoomed && <div className="shield" onClick={onEnter} />}
    </div>
  )
}
