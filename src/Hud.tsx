import { useEffect, useRef, useState } from 'react'

// Soft office-fan hum made from filtered noise (no audio files needed).
function makeHum() {
  const ctx = new AudioContext()
  const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
  const data = buf.getChannelData(0)
  let last = 0
  for (let i = 0; i < data.length; i++) data[i] = last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02
  const src = ctx.createBufferSource()
  src.buffer = buf
  src.loop = true
  const lp = ctx.createBiquadFilter()
  lp.frequency.value = 500
  const gain = ctx.createGain()
  gain.gain.value = 0.6
  src.connect(lp).connect(gain).connect(ctx.destination)
  src.start()
  return ctx
}

export default function Hud({ show, onOverview }: { show: boolean; onOverview: () => void }) {
  const [now, setNow] = useState(new Date())
  const [sound, setSound] = useState(false)
  const ctx = useRef<AudioContext | null>(null)

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const toggleSound = () => {
    if (!ctx.current) ctx.current = makeHum()
    else if (sound) ctx.current.suspend()
    else ctx.current.resume()
    setSound(!sound)
  }

  return (
    <div className={`hud${show ? '' : ' off'}`}>
      <p className="tag">Jordan Westlake</p>
      <p className="tag">Software Engineer</p>
      <div className="hud-row">
        <p className="tag">{now.toLocaleTimeString('en-US')}</p>
        <button className="tag icon-btn" onClick={toggleSound} aria-label={sound ? 'Mute' : 'Sound on'}>
          <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden>
            <path d="M2 6h3l4-3v10l-4-3H2z" />
            {sound ? <path d="M11 5q2 3 0 6M12.5 3.5q3.5 4.5 0 9" stroke="currentColor" fill="none" /> : <path d="M11 6l4 4M15 6l-4 4" stroke="currentColor" />}
          </svg>
        </button>
        <button className="tag icon-btn" onClick={onOverview} aria-label="Free look">
          <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden>
            <path d="M1 4h9v8H1zM11 7l4-2v6l-4-2z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
