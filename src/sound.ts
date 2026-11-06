// Web Audio API Sound Engine: startup chime, mechanical typing, and mouse clicks.

let ctx: AudioContext | null = null
let masterGain: GainNode | null = null
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

let spidermanAudio: HTMLAudioElement | null = null
let isSpidermanModeActive = false

export function toggleSound(): boolean {
  const c = getCtx()
  muted = !muted
  if (masterGain && c) {
    masterGain.gain.setTargetAtTime(muted ? 0 : 1, c.currentTime, 0.03)
  }
  if (muted) {
    if (jokowiAudio) jokowiAudio.pause()
    if (spidermanAudio) spidermanAudio.pause()
  } else if (!muted && isSpidermanModeActive && spidermanAudio) {
    spidermanAudio.play().catch(() => {})
  }
  listeners.forEach((fn) => fn(!muted))
  return !muted
}

let jokowiAudio: HTMLAudioElement | null = null

export function playHidupJokowi() {
  if (muted) return
  try {
    if (!jokowiAudio) {
      jokowiAudio = new Audio('./hidup-jokowi.mp3')
    }
    jokowiAudio.currentTime = 0
    jokowiAudio.volume = 1.0
    jokowiAudio.play().catch((err) => {
      console.warn('Audio play failed:', err)
    })
  } catch (err) {
    console.warn('Audio error:', err)
  }
}

export function playSpidermanMemeSong() {
  isSpidermanModeActive = true
  if (muted) return
  try {
    if (!spidermanAudio) {
      spidermanAudio = new Audio('./spiderman-meme-song.mp3')
      spidermanAudio.loop = true
    }
    spidermanAudio.currentTime = 0
    spidermanAudio.volume = 0.75
    spidermanAudio.play().catch((err) => {
      console.warn('Spider-Man audio play failed:', err)
    })
  } catch (err) {
    console.warn('Spider-Man audio error:', err)
  }
}

export function stopSpidermanMemeSong() {
  isSpidermanModeActive = false
  if (spidermanAudio) {
    spidermanAudio.pause()
    spidermanAudio.currentTime = 0
  }
}

// Quick terminal hacker blip / floppy seek pulse during boot screen log
export function playBootBlip(high = false) {
  const c = getCtx()
  if (!c || !masterGain || muted) return
  if (c.state === 'suspended') {
    c.resume().catch(() => {})
    if (c.state === 'suspended') return
  }

  const osc = c.createOscillator()
  const gain = c.createGain()
  const filter = c.createBiquadFilter()

  osc.type = high ? 'sine' : 'square'
  const freq = high ? 1800 + Math.random() * 400 : 700 + Math.random() * 200
  osc.frequency.setValueAtTime(freq, c.currentTime)
  osc.frequency.exponentialRampToValueAtTime(freq * 0.5, c.currentTime + 0.025)

  filter.type = 'bandpass'
  filter.frequency.value = 1200
  filter.Q.value = 3

  gain.gain.setValueAtTime(0.045, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.03)

  osc.connect(filter)
  filter.connect(gain)
  gain.connect(masterGain)

  osc.start(c.currentTime)
  osc.stop(c.currentTime + 0.035)
}

// Retro computer POST success beep (classic IBM / Award BIOS single beep)
export function playBiosBeep() {
  const c = getCtx()
  if (!c || !masterGain || muted) return
  if (c.state === 'suspended') {
    c.resume().catch(() => {})
    if (c.state === 'suspended') return
  }

  const osc = c.createOscillator()
  const gain = c.createGain()

  osc.type = 'square'
  osc.frequency.setValueAtTime(987.77, c.currentTime) // B5 note

  gain.gain.setValueAtTime(0, c.currentTime)
  gain.gain.linearRampToValueAtTime(0.08, c.currentTime + 0.01)
  gain.gain.setValueAtTime(0.08, c.currentTime + 0.12)
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.18)

  osc.connect(gain)
  gain.connect(masterGain)

  osc.start(c.currentTime)
  osc.stop(c.currentTime + 0.2)
}

// Played when clicking START on the boot screen
export function playStartupSound() {
  const c = getCtx()
  if (!c || !masterGain) return

  muted = false
  masterGain.gain.setValueAtTime(1, c.currentTime)
  listeners.forEach((fn) => fn(true))

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

export function playViewTransition() {
  const c = getCtx()
  if (!c || !masterGain || muted) return

  const now = c.currentTime
  const osc = c.createOscillator()
  const bodyOsc = c.createOscillator()
  const filter = c.createBiquadFilter()
  const gain = c.createGain()
  const bodyGain = c.createGain()

  osc.type = 'triangle'
  osc.frequency.setValueAtTime(520, now)
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.26)

  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(1800, now)
  filter.frequency.exponentialRampToValueAtTime(650, now + 0.26)

  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.linearRampToValueAtTime(0.12, now + 0.035)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3)

  bodyOsc.type = 'sine'
  bodyOsc.frequency.setValueAtTime(160, now)
  bodyOsc.frequency.exponentialRampToValueAtTime(90, now + 0.26)
  bodyGain.gain.setValueAtTime(0.0001, now)
  bodyGain.gain.linearRampToValueAtTime(0.08, now + 0.025)
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3)

  osc.connect(filter)
  filter.connect(gain)
  gain.connect(masterGain)
  bodyOsc.connect(bodyGain)
  bodyGain.connect(masterGain)
  osc.start(now)
  bodyOsc.start(now)
  osc.stop(now + 0.31)
  bodyOsc.stop(now + 0.31)
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
