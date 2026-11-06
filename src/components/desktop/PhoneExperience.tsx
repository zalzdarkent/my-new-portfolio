import { useEffect, useState } from 'react'
import { NAME, PROJECTS_DATA } from '../../data/portfolioData'

export type PhonePage = 'lock' | 'home' | 'contact' | 'projects'

const formatTime = (date: Date) => new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(date)
const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }).format(date)

export default function PhoneExperience({
  page,
  onPageChange,
}: {
  page: PhonePage
  onPageChange: (page: PhonePage) => void
}) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div
      className="phone-ui"
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div className={`phone-status${page === 'contact' || page === 'projects' ? ' dark' : ''}`}>
        <span className="phone-status-time">{formatTime(now)}</span>
        
        {/* Apple iPhone 16 Dynamic Island */}
        <div className="phone-dynamic-island">
          <div className="dynamic-island-mic" />
          <div className="dynamic-island-camera" />
        </div>

        <div className="phone-status-icons" aria-label="Sinyal dan baterai">
          <svg className="phone-signal-bars" viewBox="0 0 17 12" width="17" height="12" fill="currentColor">
            <rect x="0" y="9" width="3" height="3" rx="0.8" />
            <rect x="4.5" y="6" width="3" height="6" rx="0.8" />
            <rect x="9" y="3" width="3" height="9" rx="0.8" />
            <rect x="13.5" y="0" width="3" height="12" rx="0.8" />
          </svg>
          <svg className="phone-wifi-icon" viewBox="0 0 16 12" width="16" height="12" fill="currentColor">
            <path d="M8 2.5C10.5 2.5 12.8 3.5 14.5 5.2L16 3.7C13.9 1.6 11.1 0.5 8 0.5C4.9 0.5 2.1 1.6 0 3.7L1.5 5.2C3.2 3.5 5.5 2.5 8 2.5ZM8 6.5C9.7 6.5 11.2 7.2 12.4 8.4L13.9 6.9C12.4 5.4 10.3 4.5 8 4.5C5.7 4.5 3.6 5.4 2.1 6.9L3.6 8.4C4.8 7.2 6.3 6.5 8 6.5ZM8 10C8.8 10 9.5 10.7 9.5 11.5C9.5 12.3 8.8 13 8 13C7.2 13 6.5 12.3 6.5 11.5C6.5 10.7 7.2 10 8 10Z" />
          </svg>
          <div className="phone-battery-icon">
            <div className="battery-shell">
              <div className="battery-fill" />
            </div>
            <div className="battery-terminal" />
          </div>
        </div>
      </div>

      {page === 'lock' && (
        <main className="phone-lock">
          <div className="phone-lock-title">
            <span>{formatDate(now).toUpperCase()}</span>
            <h1>{formatTime(now)}</h1>
            <p>{NAME}</p>
            <small>Full Stack Developer</small>
          </div>
          <div className="phone-notification">
            <span className="phone-notification-icon">✦</span>
            <div>
              <b>PORTOFOLIO</b>
              <p>Kenali proyek dan perjalanan Alif.</p>
            </div>
            <span className="phone-notification-time">now</span>
          </div>
          <button className="phone-unlock" onClick={() => onPageChange('home')}>
            <span className="phone-unlock-icon">⌃</span>
            Ketuk untuk membuka
          </button>
        </main>
      )}

      {page === 'home' && (
        <main className="phone-home">
          <div className="phone-home-greeting">
            <span>RUANG PRIBADI</span>
            <h1>Halo, saya Alif.</h1>
            <p>Full Stack Developer · Open to Work</p>
          </div>
          <div className="phone-app-grid">
            <button className="phone-app" onClick={() => onPageChange('contact')}>
              <span className="phone-app-icon contact">✉</span>
              Kontak
            </button>
            <button className="phone-app" onClick={() => onPageChange('projects')}>
              <span className="phone-app-icon projects">▦</span>
              Proyek
            </button>
          </div>
          <div className="phone-home-note">
            <span>3+</span>
            <p>tahun membangun produk digital</p>
          </div>
          <div className="phone-home-indicator" />
        </main>
      )}

      {(page === 'contact' || page === 'projects') && (
        <main className="phone-app-page">
          <header className="phone-app-header">
            <button onClick={() => onPageChange('home')} aria-label="Kembali ke home screen">
              ‹
            </button>
            <span>{page === 'contact' ? 'Kontak' : 'Proyek pilihan'}</span>
            <span className="phone-header-spacer" />
          </header>

          {page === 'contact' ? (
            <section className="phone-contact">
              <div className="phone-avatar">AF</div>
              <h1>{NAME}</h1>
              <p>Full Stack Developer & Junior Software Engineer</p>
              <a href="mailto:arszalzdarker@email.com">
                <span>✉</span>
                <span>
                  <small>Email</small>
                  arszalzdarker@email.com
                </span>
                <b>›</b>
              </a>
              <a href="https://github.com/zalzdarkent" target="_blank" rel="noopener noreferrer">
                <span>⌘</span>
                <span>
                  <small>GitHub</small>
                  zalzdarkent
                </span>
                <b>↗</b>
              </a>
              <a href="https://linkedin.com/in/alif-fadillah-ummar-07001224b/" target="_blank" rel="noopener noreferrer">
                <span>in</span>
                <span>
                  <small>LinkedIn</small>
                  Alif Fadillah Ummar
                </span>
                <b>↗</b>
              </a>
            </section>
          ) : (
            <section className="phone-projects">
              {PROJECTS_DATA.slice(0, 3).map((project) => (
                <article className="phone-project-card" key={project.id}>
                  <span className="phone-project-category">{project.cat}</span>
                  <h2>{project.name}</h2>
                  <p>{project.shortDescId}</p>
                  <div>
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      Lihat proyek <span>↗</span>
                    </a>
                  )}
                </article>
              ))}
            </section>
          )}
          <button
            className="phone-home-indicator"
            onClick={() => onPageChange('home')}
            aria-label="Kembali ke home screen"
          />
        </main>
      )}
    </div>
  )
}
