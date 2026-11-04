// Looping animations for the showcase, played with the Remotion Player.
import { Player } from '@remotion/player'
import { AbsoluteFill, useCurrentFrame } from 'remotion'

type ThumbKind = 'cube' | 'bars' | 'map'
const THUMB_FRAMES = 120

function Thumb({ kind, hue }: { kind: ThumbKind; hue: number }) {
  const f = useCurrentFrame()
  const t = (f / THUMB_FRAMES) * Math.PI * 2
  const fg = `hsl(${hue} 90% 70%)`
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, hsl(${hue} 45% 18%), hsl(${hue + 40} 50% 10%))`, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {kind === 'cube' && (
        <div style={{ width: 70, height: 70, position: 'relative', transformStyle: 'preserve-3d', transform: `perspective(300px) rotateX(${-20 + Math.sin(t) * 10}deg) rotateY(${f * 3}deg)` }}>
          {['rotateY(0deg)', 'rotateY(90deg)', 'rotateY(180deg)', 'rotateY(-90deg)', 'rotateX(90deg)', 'rotateX(-90deg)'].map((r) => (
            <div key={r} style={{ position: 'absolute', inset: 0, border: `2px solid ${fg}`, background: `hsla(${hue} 90% 60% / 0.12)`, transform: `${r} translateZ(35px)` }} />
          ))}
        </div>
      )}
      {kind === 'bars' && (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} style={{ width: 9, borderRadius: 2, background: fg, height: 14 + (Math.sin(t * 3 + i * 0.7) * 0.5 + 0.5) * 62 * (0.5 + 0.5 * Math.sin(t + i)) }} />
          ))}
        </div>
      )}
      {kind === 'map' && (
        <svg width="100%" height="100%" viewBox="0 0 200 120">
          {[20, 40, 60, 80, 100].map((y) => <path key={y} d={`M0 ${y} Q50 ${y - 14} 100 ${y} T200 ${y}`} stroke={`hsla(${hue} 60% 60% / 0.25)`} fill="none" />)}
          <path d="M20 100 C60 20 100 110 180 25" stroke={fg} strokeWidth="3" fill="none" strokeDasharray="260" strokeDashoffset={260 - ((f % THUMB_FRAMES) / THUMB_FRAMES) * 260} strokeLinecap="round" />
          <circle cx="180" cy={25 - Math.abs(Math.sin(t * 2)) * 8} r="6" fill="#ff7a59" />
        </svg>
      )}
    </AbsoluteFill>
  )
}

const playerStyle = { width: '100%', display: 'block' }

export function ThumbPlayer(props: { kind: ThumbKind; hue: number }) {
  return (
    <Player component={Thumb} inputProps={props} durationInFrames={THUMB_FRAMES} fps={30} compositionWidth={200} compositionHeight={120}
      autoPlay loop controls={false} acknowledgeRemotionLicense style={playerStyle} />
  )
}
