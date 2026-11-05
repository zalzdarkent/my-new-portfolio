// Looping animations for the showcase, played with the Remotion Player.
import { Player } from '@remotion/player'
import { AbsoluteFill, useCurrentFrame } from 'remotion'

export type ThumbKind = 'cube' | 'bars' | 'map' | 'vision' | 'rfid' | 'cctv' | 'iot'
const THUMB_FRAMES = 120

function Thumb({ kind, hue }: { kind: ThumbKind; hue: number }) {
  const f = useCurrentFrame()
  const t = (f / THUMB_FRAMES) * Math.PI * 2
  const fg = `hsl(${hue} 90% 70%)`
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, hsl(${hue} 45% 16%), hsl(${hue + 40} 50% 9%))`, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
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
      {kind === 'vision' && (
        <svg width="100%" height="100%" viewBox="0 0 200 120">
          <rect x="40" y="25" width="120" height="70" rx="4" fill="none" stroke={fg} strokeWidth="2" strokeDasharray="6 4" />
          <path d="M35 35 V20 H50 M165 35 V20 H150 M35 85 V100 H50 M165 85 V100 H150" stroke={fg} strokeWidth="3" fill="none" />
          <line x1="40" y1={30 + ((f * 2) % 60)} x2="160" y2={30 + ((f * 2) % 60)} stroke="#4af626" strokeWidth="2" opacity="0.8" />
          <text x="45" y="42" fill="#4af626" fontSize="9" fontFamily="monospace" fontWeight="bold">YOLO APD 99.2%</text>
          <circle cx="100" cy="60" r={4 + Math.sin(t * 2) * 2} fill="#ff4a4a" />
        </svg>
      )}
      {kind === 'rfid' && (
        <svg width="100%" height="100%" viewBox="0 0 200 120">
          <rect x="75" y="45" width="50" height="32" rx="3" fill="none" stroke={fg} strokeWidth="2" />
          <circle cx="88" cy="61" r="5" fill={fg} opacity="0.5" />
          {[1, 2, 3].map((r) => (
            <path
              key={r}
              d={`M ${125 + r * 14} 45 A ${18 + r * 12} ${18 + r * 12} 0 0 1 ${125 + r * 14} 77`}
              fill="none"
              stroke={fg}
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity={0.3 + 0.7 * Math.sin(t * 2 - r * 0.8)}
            />
          ))}
          <text x="100" y="98" textAnchor="middle" fill={fg} fontSize="9" fontFamily="monospace">RFID ACTIVE</text>
        </svg>
      )}
      {kind === 'cctv' && (
        <svg width="100%" height="100%" viewBox="0 0 200 120">
          <rect x="25" y="15" width="150" height="90" rx="4" fill="none" stroke={`hsla(${hue} 50% 50% / 0.4)`} strokeWidth="1" />
          <circle cx="45" cy="30" r="4" fill={f % 30 < 15 ? '#ff3b30' : 'transparent'} />
          <text x="55" y="33" fill="#ff3b30" fontSize="9" fontFamily="monospace" fontWeight="bold">REC ● IP-CAM</text>
          <line x1="100" y1="40" x2="100" y2="80" stroke={fg} strokeWidth="1" strokeDasharray="3 3" />
          <line x1="70" y1="60" x2="130" y2="60" stroke={fg} strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="100" cy="60" r={16 + Math.sin(t) * 8} fill="none" stroke={fg} strokeWidth="1.5" opacity="0.6" />
          <text x="100" y="100" textAnchor="middle" fill="#aaa" fontSize="8" fontFamily="monospace">192.168.1.108:554</text>
        </svg>
      )}
      {kind === 'iot' && (
        <svg width="100%" height="100%" viewBox="0 0 200 120">
          <circle cx="100" cy="60" r="34" fill="none" stroke={`hsla(${hue} 60% 60% / 0.3)`} strokeWidth="6" strokeDasharray="6 4" transform={`rotate(${f * 1.5} 100 60)`} />
          <circle cx="100" cy="60" r="22" fill="none" stroke={fg} strokeWidth="3" />
          <line x1="100" y1="60" x2={100 + Math.cos(t) * 18} y2={60 + Math.sin(t) * 18} stroke="#ffcc00" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M30 100 Q 60 70 100 95 T 170 85" fill="none" stroke={fg} strokeWidth="2" strokeDasharray="140" strokeDashoffset={140 - ((f % THUMB_FRAMES) / THUMB_FRAMES) * 140} />
          <text x="100" y="32" textAnchor="middle" fill={fg} fontSize="8" fontFamily="monospace">RPM / TELEMETRY</text>
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
