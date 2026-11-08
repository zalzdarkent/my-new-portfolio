import React, { useEffect, useState } from 'react'

export interface SpideyScreenCoords {
  andrew: { x: number; y: number }
  tom: { x: number; y: number }
  tobey: { x: number; y: number }
}

interface SpidermanOverlayProps {
  active: boolean
  coords?: SpideyScreenCoords
  onClose?: () => void
}

const HEROES = [
  {
    key: 'andrew',
    variant: 'PETER-THREE',
    character: 'Peter Parker',
    actor: 'Andrew Garfield',
    universe: 'The Amazing Spider-Man',
    suit: 'Classic Web-Shooters • Oscorp Tech',
    quote: '“Is that a Band?”',
    accentColor: '#00f0ff',
    borderGlow: 'rgba(0, 240, 255, 0.65)',
    bgGradient: 'linear-gradient(135deg, rgba(8, 22, 38, 0.92) 0%, rgba(12, 14, 28, 0.96) 100%)',
    order: 1,
    delay: '0.1s',
  },
  {
    key: 'tom',
    variant: 'PETER-ONE',
    character: 'Peter Parker',
    actor: 'Tom Holland',
    universe: 'Marvel Cinematic Universe (MCU)',
    suit: 'Integrated Stark Tech',
    quote: '“You’re gonna forget who i am.”',
    accentColor: '#ffd700',
    borderGlow: 'rgba(255, 75, 75, 0.85)',
    bgGradient: 'linear-gradient(135deg, rgba(38, 12, 16, 0.92) 0%, rgba(20, 10, 18, 0.96) 100%)',
    order: 2,
    delay: '0.25s',
  },
  {
    key: 'tobey',
    variant: 'PETER-TWO',
    character: 'Peter Parker',
    actor: 'Tobey Maguire',
    universe: 'Spider-Man Trilogy (Sam Raimi)',
    suit: 'Raised Silver Webbing • Organic Webs',
    quote: '“The Avengers? That’s great! What is that?.”',
    accentColor: '#ffffff',
    borderGlow: 'rgba(225, 29, 36, 0.75)',
    bgGradient: 'linear-gradient(135deg, rgba(28, 14, 20, 0.92) 0%, rgba(14, 14, 20, 0.96) 100%)',
    order: 3,
    delay: '0.4s',
  },
] as const

export default function SpidermanOverlay({ active, coords, onClose }: SpidermanOverlayProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    if (active) {
      t = setTimeout(() => setVisible(true), 150)
    } else {
      setVisible(false)
    }
    return () => clearTimeout(t)
  }, [active])

  if (!active && !visible) return null

  return (
    <div className={`spidey-overlay-root ${visible ? 'active' : ''}`}>
      {/* Top Multiverse Header Banner */}
      {/* <div className="spidey-top-banner">
        <div className="spidey-banner-pill">
          <svg className="spidey-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
          <span className="spidey-banner-text">MULTIVERSE // SPIDER-MEN ARCHIVE</span>
          <span className="spidey-song-indicator">
            <span className="spidey-equalizer-bar" />
            <span className="spidey-equalizer-bar" />
            <span className="spidey-equalizer-bar" />
            ♫ Spiderman Meme Song Playing
          </span>
        </div>
      </div> */}

      {/* 3 Spider-Man Information Cards */}
      <div className="spidey-cards-container">
        {HEROES.map((hero) => {
          const heroCoords = coords ? coords[hero.key] : null
          const cardStyle: React.CSSProperties = {
            animationDelay: hero.delay,
            borderColor: hero.accentColor,
            boxShadow: `0 16px 40px rgba(0,0,0,0.6), 0 0 30px ${hero.borderGlow}`,
            background: hero.bgGradient,
          }

          if (heroCoords && heroCoords.x > 0 && heroCoords.y > 0) {
            // Position horizontally centered over the projected screen coordinate
            cardStyle.left = `${heroCoords.x}px`
            cardStyle.transform = 'translateX(-40%)'
          }

          return (
            <div
              key={hero.key}
              className={`spidey-card spidey-card-${hero.key}`}
              style={cardStyle}
            >
              {/* Card Corner Web Accent */}
              <div className="spidey-card-corner" style={{ color: hero.accentColor }}>
                🕷
              </div>

              {/* Variant Tag */}
              <div className="spidey-variant-badge" style={{ color: hero.accentColor, borderColor: hero.accentColor }}>
                {hero.variant}
              </div>

              {/* Character Name */}
              <h2 className="spidey-character-name">
                {hero.character}
              </h2>

              {/* Real Actor Name */}
              <div className="spidey-actor-row">
                <span className="spidey-actor-label">Pemeran:</span>
                <span className="spidey-actor-name" style={{ color: hero.accentColor }}>
                  {hero.actor}
                </span>
              </div>

              {/* Universe & Suit Info */}
              <div className="spidey-meta-box">
                <div className="spidey-meta-item">
                  <span className="spidey-meta-label">Universe:</span>
                  <span className="spidey-meta-val">{hero.universe}</span>
                </div>
                <div className="spidey-meta-item">
                  <span className="spidey-meta-label">Suit Specs:</span>
                  <span className="spidey-meta-val">{hero.suit}</span>
                </div>
              </div>

              {/* Iconic Quote */}
              <div className="spidey-quote">
                {hero.quote}
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Hint Banner */}
      <div className="spidey-bottom-hint">
        <button className="spidey-back-btn" onClick={onClose}>
          <span className="spidey-key-badge">ESC</span>
          <span>Klik di mana saja atau tekan ESC untuk kembali ke meja</span>
        </button>
      </div>
    </div>
  )
}

