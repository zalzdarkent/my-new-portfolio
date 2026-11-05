import { useEffect, useState } from 'react'
import { isSoundOn, playMouseDown, playMouseUp, subscribeSound, toggleSound as toggleMasterSound } from './sound'

export default function Hud({ show, onOverview }: { show: boolean; onOverview: () => void }) {
  const [now, setNow] = useState(new Date())
  const [sound, setSound] = useState(isSoundOn())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    const unsub = subscribeSound(setSound)
    return () => {
      clearInterval(t)
      unsub()
    }
  }, [])

  const handleToggleSound = () => {
    const next = toggleMasterSound()
    if (next) {
      playMouseDown()
      setTimeout(() => playMouseUp(), 60)
    }
  }

  return (
    <div className={`hud${show ? '' : ' off'}`}>
      <p className="tag">Alif Fadillah Ummar</p>
      <p className="tag">Full Stack Developer</p>
      <div className="hud-row">
        <p className="tag">{now.toLocaleTimeString('en-US')}</p>
        <button className="tag icon-btn" onClick={handleToggleSound} aria-label={sound ? 'Mute' : 'Sound on'}>
          <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden>
            <path d="M2 6h3l4-3v10l-4-3H2z" />
            {sound ? <path d="M11 5q2 3 0 6M12.5 3.5q3.5 4.5 0 9" stroke="currentColor" fill="none" /> : <path d="M11 6l4 4M15 6l-4 4" stroke="currentColor" />}
          </svg>
        </button>
        <button
          className="tag icon-btn"
          onPointerDown={() => playMouseDown()}
          onPointerUp={() => playMouseUp()}
          onClick={onOverview}
          aria-label="Free look"
        >
          <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden>
            <path d="M1 4h9v8H1zM11 7l4-2v6l-4-2z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
