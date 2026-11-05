import { useEffect, useState } from 'react'

const NAME = 'Alif Fadillah Ummar'

// Every resource "loaded" during boot; the BIOS list shows the latest eight.
const RESOURCES = [
  'audioAmbience', 'audioKeyboard', 'audioMouseDown', 'mouseDown', 'computerModel', 'deskModel',
  'chairModel', 'lampModel', 'keyboardModel', 'monitorModel', 'plantModel', 'decorModel', 'office',
  'monitorSmudgeTexture', 'decorTexture', 'computerSetupTexture', 'monitorShadowTexture',
  'environmentTexture', 'mouseUp',
]

function today() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getMonth() + 1)}/${p(d.getDate())}/${d.getFullYear()}`
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
  const [loaded, setLoaded] = useState(0)
  const done = loaded >= RESOURCES.length && modelsLoaded
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (loaded < RESOURCES.length) {
      const t = setTimeout(() => setLoaded((n) => n + 1), 45)
      return () => clearTimeout(t)
    }
    if (done) {
      const t = setTimeout(() => setReady(true), 200)
      return () => clearTimeout(t)
    }
  }, [loaded, done])

  const list = RESOURCES.slice(0, loaded).map((r, i) => ({
    name: r,
    pct: Math.round(((i + 1) / RESOURCES.length) * 100),
  }))

  return (
    <div className={`loader${leaving ? ' leaving' : ''}`}>
      <div className={`bios${ready ? ' hidden' : ''}`} aria-hidden={ready}>
        <div className="bios-head">
          <div className="bios-logo">
            <p>Fadillah,</p>
            <p>Alif Inc.</p>
          </div>
          <div>
            <p>Released: 01/01/2000</p>
            <p>AFBIOS (C)2000 Fadillah Alif Inc.,</p>
          </div>
        </div>
        <p className="mt48">JWP S13 2000-2022 Special UC131S</p>
        <p className="mt16">JWP Showcase(tm) XX 113</p>
        <p>Checking RAM : 14000 OK</p>
        {done && <p className="mt32">FINISHED LOADING RESOURCES</p>}
        <div className="bios-list">
          {list.slice(-8).map((r) => (
            <p key={r.name}>
              Loaded {r.name} ... {r.pct}%
            </p>
          ))}
        </div>
        {done && <p className="mt48">All Content Loaded, launching '{NAME} Portfolio Showcase' V1.0</p>}
        <div className="bios-foot">
          <p>Press DEL to enter SETUP , ESC to skip memory test</p>
          <p>{today()}</p>
        </div>
      </div>

      {ready && (
        <div className="popup-wrap">
          <div className="popup">
            <div className="popup-text">
              <p>{NAME} Portfolio Showcase</p>
              <p>
                Click start to begin <span className="blink">_</span>
              </p>
            </div>
            <button className="start" onClick={onStart} disabled={leaving}>
              <p>START</p>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
