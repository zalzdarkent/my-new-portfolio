// Web Audio API Sound Engine: startup chime, ambient PC hum, mechanical typing, and mouse clicks.

let ctx: AudioContext | null = null
let masterGain: GainNode | null = null
let humGain: GainNode | null = null
let muted = false
const listeners = new Set<(soundOn: boolean) => void>()

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return null
    ctx = new AudioCtx()
    masterGain = ctx.createGain()
    masterGain.gain.value = muted ? 0 : 1
    masterGain.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {})
  }
  return ctx
}

export function isSoundOn(): boolean {
  return !muted
}

export function subscribeSound(fn: (soundOn: boolean) => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function toggleSound(): boolean {
  const c = getCtx()
  muted = !muted
  if (masterGain && c) {
    masterGain.gain.setTargetAtTime(muted ? 0 : 1, c.currentTime, 0.03)
  }
  if (!muted && !humGain) {
    startAmbientHum()
  }
  listeners.forEach((fn) => fn(!muted))
  return !muted
}

function startAmbientHum() {
  const c = getCtx()
  if (!c || !masterGain || humGain) return

  // Soft filtered noise for subtle PC cooling fan / studio ambience
  const buf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate)
  const data = buf.getChannelData(0)
  let last = 0
  for (let i = 0; i < data.length; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02
    data[i] = last
  }
  const src = c.createBufferSource()
  src.buffer = buf
  src.loop = true

  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 420

  humGain = c.createGain()
  humGain.gain.setValueAtTime(0.01, c.currentTime)
  humGain.gain.exponentialRampToValueAtTime(0.28, c.currentTime + 1.2)

  src.connect(lp)
  lp.connect(humGain)
  humGain.connect(masterGain)
  src.start()
}

// Played when clicking START on the boot screen
export function playStartupSound() {
  const c = getCtx()
  if (!c || !masterGain) return

  muted = false
  masterGain.gain.setValueAtTime(1, c.currentTime)
  listeners.forEach((fn) => fn(true))

  startAmbientHum()
  playMouseDown()

  // Warm modern Ubuntu-inspired startup chord / arpeggio
  const notes = [293.66, 440.0, 587.33, 659.25, 880.0] // D4, A4, D5, E5, A5
  const now = c.currentTime + 0.08

  notes.forEach((freq, i) => {
    const t = now + i * 0.075
    const osc = c.createOscillator()
    const sub = c.createOscillator()
    const g = c.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, t)

    sub.type = 'triangle'
    sub.frequency.setValueAtTime(freq * 0.5, t)

    g.gain.setValueAtTime(0.0001, t)
    g.gain.linearRampToValueAtTime(0.065 / (1 + i * 0.15), t + 0.04)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6)

    osc.connect(g)
    sub.connect(g)
    g.connect(masterGain!)

    osc.start(t)
    sub.start(t)
    osc.stop(t + 1.65)
    sub.stop(t + 1.65)
  })
}

// Realistic mechanical keyboard keystroke sound (tactile click + keycap thock)
export function playKeyClick(isSpace = false) {
  const c = getCtx()
  if (!c || !masterGain || muted) return

  const now = c.currentTime
  const pitchVar = 0.92 + Math.random() * 0.16

  // 1. Keycap bottom-out "thock"
  const osc = c.createOscillator()
  const thockGain = c.createGain()
  osc.type = 'triangle'
  const startFreq = (isSpace ? 260 : 360) * pitchVar
  const endFreq = (isSpace ? 75 : 105) * pitchVar
  osc.frequency.setValueAtTime(startFreq, now)
  osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.026)

  thockGain.gain.setValueAtTime(0.14, now)
  thockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.028)

  osc.connect(thockGain)
  thockGain.connect(masterGain)
  osc.start(now)
  osc.stop(now + 0.03)

  // 2. Crisp mechanical switch transient click (filtered short noise burst)
  const len = Math.floor(c.sampleRate * 0.012)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.25))
  }
  const noise = c.createBufferSource()
  noise.buffer = buf

  const bp = c.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.setValueAtTime((isSpace ? 2100 : 2800) * pitchVar, now)
  bp.Q.setValueAtTime(2.2, now)

  const clickGain = c.createGain()
  clickGain.gain.setValueAtTime(0.18, now)
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012)

  noise.connect(bp)
  bp.connect(clickGain)
  clickGain.connect(masterGain)
  noise.start(now)
}

// Crisp tactile mouse switch press sound
export function playMouseDown() {
  const c = getCtx()
  if (!c || !masterGain || muted) return

  const now = c.currentTime
  const pitchVar = 0.96 + Math.random() * 0.08

  // Microswitch snap impulse
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(1650 * pitchVar, now)
  osc.frequency.exponentialRampToValueAtTime(320 * pitchVar, now + 0.009)

  g.gain.setValueAtTime(0.16, now)
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.01)

  osc.connect(g)
  g.connect(masterGain)
  osc.start(now)
  osc.stop(now + 0.011)

  // High-frequency switch contact click
  const len = Math.floor(c.sampleRate * 0.006)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.2))
  }
  const noise = c.createBufferSource()
  noise.buffer = buf

  const hp = c.createBiquadFilter()
  hp.type = 'bandpass'
  hp.frequency.setValueAtTime(3800 * pitchVar, now)
  hp.Q.setValueAtTime(1.8, now)

  const ng = c.createGain()
  ng.gain.setValueAtTime(0.2, now)
  ng.gain.exponentialRampToValueAtTime(0.001, now + 0.006)

  noise.connect(hp)
  hp.connect(ng)
  ng.connect(masterGain)
  noise.start(now)
}

// Subtle mouse switch release sound
export function playMouseUp() {
  const c = getCtx()
  if (!c || !masterGain || muted) return

  const now = c.currentTime
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(1100, now)
  osc.frequency.exponentialRampToValueAtTime(260, now + 0.007)

  g.gain.setValueAtTime(0.07, now)
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.008)

  osc.connect(g)
  g.connect(masterGain)
  osc.start(now)
  osc.stop(now + 0.009)
}

