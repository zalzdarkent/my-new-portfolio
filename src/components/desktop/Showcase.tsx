import { useState, type ReactNode } from "react"
import { ThumbPlayer } from "../../motion"
import { I18N, JOBS_DATA, NAME, PROJECTS_DATA, SKILLS_DATA, TESTIMONIALS_DATA } from "../../data/portfolioData"
import type { Lang, Page } from "../../types/portfolio"
import { NAV_KEYS } from "../../types/portfolio"
import ContactForm from "./ContactForm"

export default function Showcase({ mobile = false }: { mobile?: boolean } = {}) {
  const [page, setPage] = useState<Page>('Home')
  const [lang, setLang] = useState<Lang>('id')
  const [projFilter, setProjFilter] = useState<'all' | 'fullstack' | 'ai' | 'iot'>('all')

  const t = I18N[lang]

  const filteredProjects = PROJECTS_DATA.filter((p) => {
    if (projFilter === 'all') return true
    if (projFilter === 'fullstack') return p.cat === 'fullstack' || p.cat === 'web'
    if (projFilter === 'ai') return p.cat === 'ai'
    if (projFilter === 'iot') return p.cat === 'iot'
    return true
  })

  const body: Record<Exclude<Page, 'Home'>, ReactNode> & { Home: null } = {
    Home: null,
    About: (
      <>
        <h2>{t.aboutTitle}</h2>
        <p className="page-sub">{t.role}</p>
        <p>{t.aboutDesc}</p>

        {/* Stats Grid */}
        <div className="stats-grid">
          {t.stats.map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Work Habits */}
        <h3>{t.workHabitsTitle}</h3>
        <div className="habits-grid">
          {t.workHabits.map((h, i) => (
            <div key={i} className="habit-card">
              <div className="habit-header">
                <span className="habit-icon">{h.icon}</span>
                <span className="habit-title">{h.title}</span>
              </div>
              <p className="habit-desc">{h.desc}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <h3>{t.testimonialsTitle}</h3>
        <div className="testimonials-grid">
          {TESTIMONIALS_DATA.map((tm, i) => (
            <div key={i} className="testimonial-card">
              <blockquote>"{tm.text}"</blockquote>
              <div className="testimonial-author">
                <strong>{tm.name}</strong>
                <span>{tm.role}</span>
              </div>
            </div>
          ))}
        </div>
      </>
    ),

    Skills: (
      <>
        <h2>{t.skillsTitle}</h2>
        <p className="page-sub">{t.skillsSub}</p>
        <div className="skills-grid">
          {SKILLS_DATA.map((s, i) => (
            <div key={s.name} className="skill-card" style={{ animationDelay: `${0.05 + i * 0.04}s` }}>
              <div className="skill-top">
                <div className="skill-name-wrap">
                  <span className="skill-color-dot" style={{ background: s.color }} />
                  <span className="skill-name">{s.name}</span>
                </div>
                <span className={`skill-level-badge ${s.level.toLowerCase()}`}>{s.level}</span>
              </div>
              <div className="skill-bar">
                <i
                  className="skill-bar-fill"
                  style={{
                    width: `${s.pct}%`,
                    background: `linear-gradient(90deg, #77216F, ${s.color})`,
                  }}
                />
              </div>
              <span className="skill-note">{s.note}</span>
            </div>
          ))}
        </div>
      </>
    ),

    Experience: (
      <>
        <h2>{t.expTitle}</h2>
        <p className="page-sub">{t.expSub}</p>
        <div className="timeline">
          {JOBS_DATA.map((j, i) => (
            <div key={j.where} className="timeline-card" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
              <div className="timeline-bar" />
              <div className="timeline-content">
                <div className="timeline-header">
                  <span className="when">{j.when}</span>
                  <span className="role-badge">{j.place}</span>
                </div>
                <h3>
                  {j.where} <small style={{ color: 'var(--ub-orange)', fontWeight: 600 }}>— {j.role}</small>
                </h3>
                <ul>
                  {(lang === 'id' ? j.itemsId : j.itemsEn).map((it, idx) => (
                    <li key={idx}>{it}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </>
    ),

    Education: (
      <>
        <h2>{t.eduTitle}</h2>
        <p className="page-sub">{t.eduSub}</p>

        <div className="timeline">
          <div className="timeline-card">
            <div className="timeline-bar" style={{ background: '#2eb872' }} />
            <div className="timeline-content">
              <div className="timeline-header">
                <span className="when">2022 — 2026</span>
                <span className="edu-highlight">Cum Laude Honor 🎓</span>
              </div>
              <h3>Universitas Singaperbangsa Karawang (UNSIKA)</h3>
              <p style={{ margin: '4px 0 8px', fontSize: 13, color: '#e0e0e0', fontWeight: 600 }}>
                {lang === 'id' ? 'S1 Informatika — Fresh Graduate' : 'B.Sc. in Computer Science / Informatics'}
              </p>
              <ul>
                {lang === 'id' ? (
                  <>
                    <li>Lulusan Fresh Graduate dengan predikat Cum Laude (IPK Tinggi).</li>
                    <li>Fokus pada pengembangan aplikasi web end-to-end, arsitektur basis data, dan struktur data.</li>
                    <li>Membangun berbagai proyek dengan standar kode modern, performa tinggi, dan clean architecture.</li>
                    <li>Aktif dalam kegiatan kampus, asisten laboratorium, dan kepengurusan komunitas GDSC.</li>
                  </>
                ) : (
                  <>
                    <li>Graduated with high honors (Cum Laude).</li>
                    <li>Focused on end-to-end web engineering, database architecture, and data structures.</li>
                    <li>Built production-grade projects adhering to modern code standards and clean architecture.</li>
                    <li>Active campus involvement as a lab assistant and GDSC technical core team lead.</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <div className="timeline-card">
            <div className="timeline-bar" style={{ background: '#3b82f6' }} />
            <div className="timeline-content">
              <div className="timeline-header">
                <span className="when">2024</span>
                <span className="role-badge">Kampus Merdeka</span>
              </div>
              <h3>MSIB Studi Independen @ Vocasia</h3>
              <p style={{ margin: '4px 0 8px', fontSize: 13, color: '#e0e0e0', fontWeight: 600 }}>
                Fullstack Web MERN Development (MongoDB, Express.js, React, Node.js)
              </p>
              <ul>
                {lang === 'id' ? (
                  <>
                    <li>Membangun project fullstack menggunakan stack MERN secara end-to-end.</li>
                    <li>Memahami struktur ExpressJS untuk backend dan teknik menangani race condition pada aplikasi concurrent.</li>
                    <li>Mengembangkan soft skill public speaking, presentasi teknis, dan manajemen waktu tim.</li>
                  </>
                ) : (
                  <>
                    <li>Built end-to-end fullstack applications using the MERN stack.</li>
                    <li>Architected ExpressJS backends with techniques to prevent race conditions in concurrent requests.</li>
                    <li>Cultivated soft skills in public speaking, technical presentation, and timeline management.</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Competencies */}
        <h3>{lang === 'id' ? 'Kompetensi Utama' : 'Core Competencies'}</h3>
        <div className="competencies-grid">
          <div className="comp-card">
            <strong>💻 {lang === 'id' ? 'Teknis' : 'Technical'}</strong>
            <p>
              {lang === 'id'
                ? 'Web development, integrasi sistem, dan struktur kode yang modular serta scalable.'
                : 'Web development, system integration, and modular, scalable code structure.'}
            </p>
          </div>
          <div className="comp-card">
            <strong>📊 {lang === 'id' ? 'Analitik' : 'Analytical'}</strong>
            <p>
              {lang === 'id'
                ? 'Pengolahan dan pipeline data yang rapi untuk hasil analisis yang terukur.'
                : 'Clean data processing and pipelines producing measurable insights.'}
            </p>
          </div>
          <div className="comp-card">
            <strong>🚀 {lang === 'id' ? 'Eksekusi' : 'Execution'}</strong>
            <p>
              {lang === 'id'
                ? 'Membangun fitur end-to-end dengan target kualitas tinggi dan timeline disiplin.'
                : 'Delivering end-to-end features with high quality standards and disciplined timelines.'}
            </p>
          </div>
        </div>

        {/* Key Achievements */}
        <h3>{lang === 'id' ? 'Pencapaian & Sorotan' : 'Key Achievements'}</h3>
        <div className="achieve-grid">
          <div className="achieve-item">
            <span className="achieve-icon">🌟</span>
            <span>Head of Technical Core Team @ GDSC UNSIKA</span>
          </div>
          <div className="achieve-item">
            <span className="achieve-icon">📜</span>
            <span>Fresh Graduate with Cum Laude Honor</span>
          </div>
          <div className="achieve-item">
            <span className="achieve-icon">⚙️</span>
            <span>Built Industrial E-Checksheet System @ PT CBI</span>
          </div>
          <div className="achieve-item">
            <span className="achieve-icon">📈</span>
            <span>Preventive Maintenance Dashboard @ PT CBI</span>
          </div>
          <div className="achieve-item">
            <span className="achieve-icon">👁️</span>
            <span>PPE Detection using YOLO Vision @ PT AT Indonesia</span>
          </div>
          <div className="achieve-item">
            <span className="achieve-icon">🏷️</span>
            <span>RFID Attendance Integration @ Fasilkom Lab</span>
          </div>
        </div>
      </>
    ),

    Projects: (
      <>
        <h2>{t.projTitle}</h2>
        <p className="page-sub">{t.projSub}</p>

        {/* Filter Bar */}
        <div className="project-filters">
          {(
            [
              ['all', lang === 'id' ? 'Semua' : 'All'],
              ['fullstack', 'Web / Fullstack'],
              ['ai', 'AI / Vision'],
              ['iot', 'IoT / Systems'],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              className={`filter-btn ${projFilter === k ? 'active' : ''}`}
              onClick={() => setProjFilter(k)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((p, i) => (
            <div key={p.id} className="project-card" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
              <div className="project-thumb-wrap">
                <ThumbPlayer kind={p.kind} hue={p.hue} />
              </div>
              <div className="project-card-body">
                <div className="project-title-row">
                  <span className="project-title">{p.name}</span>
                  <span className="project-cat-badge">{p.cat}</span>
                </div>
                <p className="project-desc">{lang === 'id' ? p.shortDescId : p.shortDescEn}</p>

                <div className="project-tags">
                  {p.tags.map((tg) => (
                    <span key={tg} className="project-tag">
                      {tg}
                    </span>
                  ))}
                </div>

                <ul className="project-features">
                  {(lang === 'id' ? p.featuresId : p.featuresEn).slice(0, 3).map((f, idx) => (
                    <li key={idx}>✓ {f}</li>
                  ))}
                </ul>

                <div className="project-actions">
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link-btn primary"
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <span>🌐 Live</span>
                    </a>
                  )}
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link-btn"
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <span>💻 GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    ),

    Contact: (
      <>
        <h2>{t.contactTitle}</h2>
        <p className="page-sub">{t.contactSub}</p>
        <div className="contact-layout">
          <div className="contact-channels">
            <a
              href="mailto:arszalzdarker@email.com"
              className="channel-card"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <span className="channel-icon">✉️</span>
              <div className="channel-info">
                <strong>Email</strong>
                <span>arszalzdarker@email.com</span>
              </div>
            </a>
            <a
              href="https://github.com/zalzdarkent"
              target="_blank"
              rel="noopener noreferrer"
              className="channel-card"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <span className="channel-icon">🐙</span>
              <div className="channel-info">
                <strong>GitHub</strong>
                <span>github.com/zalzdarkent</span>
              </div>
            </a>
            <a
              href="https://linkedin.com/in/alif-fadillah-ummar-07001224b/"
              target="_blank"
              rel="noopener noreferrer"
              className="channel-card"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <span className="channel-icon">💼</span>
              <div className="channel-info">
                <strong>LinkedIn</strong>
                <span>Alif Fadillah Ummar</span>
              </div>
            </a>
            <a
              href="https://alif-fadillah-portfolio.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="channel-card"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <span className="channel-icon">🌐</span>
              <div className="channel-info">
                <strong>Live Portfolio</strong>
                <span>alif-fadillah-portfolio.vercel.app</span>
              </div>
            </a>
            <div className="contact-note">
              ⏱️ {lang === 'id' ? 'Respon cepat — biasanya dalam 24 jam kerja.' : 'Fast response — usually within 24 business hours.'}
            </div>
          </div>
          <ContactForm lang={lang} />
        </div>
      </>
    ),
  }

  const links = (
    <nav className="links">
      {NAV_KEYS.slice(1).map((k) => (
        <button key={k} className={k === page ? 'on' : ''} onClick={() => setPage(k)}>
          <span>{t.nav[k]}</span>
          {k === page && <span>›</span>}
        </button>
      ))}
    </nav>
  )

  if (page === 'Home')
    return (
      <div className={`showcase home${mobile ? ' phone' : ''}`} onPointerDown={(e) => e.stopPropagation()}>
        <div className="home-pill">
          <span className="status-dot" />
          <span>{t.status}</span>
        </div>
        <h1 className="name">{NAME}</h1>
        <p className="role">{t.role}</p>
        <p className="home-bio">{t.heroDesc}</p>

        <div className="home-nav">
          <button className="cta" onClick={() => setPage('Projects')}>
            {t.viewProjects}
          </button>
          <button onClick={() => setPage('About')}>{t.nav.About}</button>
          <button onClick={() => setPage('Skills')}>{t.nav.Skills}</button>
          <button onClick={() => setPage('Experience')}>{t.nav.Experience}</button>
          <button onClick={() => setPage('Education')}>{t.nav.Education}</button>
          <button onClick={() => setPage('Contact')}>{t.contactMe}</button>
        </div>

        <div className="home-quick-info">
          <a href="mailto:arszalzdarker@email.com" target="_blank" rel="noopener noreferrer">
            ✉️ arszalzdarker@email.com
          </a>
          <span>•</span>
          <a href="https://github.com/zalzdarkent" target="_blank" rel="noopener noreferrer">
            🐙 zalzdarkent
          </a>
          <span>•</span>
          <a href="https://alif-fadillah-portfolio.vercel.app" target="_blank" rel="noopener noreferrer">
            🌐 Live Web
          </a>
        </div>
      </div>
    )

  return (
    <div className={`showcase${mobile ? ' phone' : ''}`} onPointerDown={(e) => e.stopPropagation()}>
      <aside>
        <button className="mini-name" onClick={() => setPage('Home')}>
          {NAME}
        </button>
        <p className="mini-role">Full Stack Developer</p>
        <div className="aside-status">
          <span className="status-dot" />
          <span>Open to Work</span>
        </div>
        {links}
        <div className="aside-footer">
          <div className="lang-toggle">
            <button
              className={`lang-btn ${lang === 'id' ? 'active' : ''}`}
              onClick={() => setLang('id')}
              title="Bahasa Indonesia"
            >
              ID
            </button>
            <button
              className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => setLang('en')}
              title="English"
            >
              EN
            </button>
          </div>
          <div className="aside-socials">
            <a
              href="https://github.com/zalzdarkent"
              target="_blank"
              rel="noopener noreferrer"
              className="aside-social-link"
              title="GitHub"
            >
              GitHub
            </a>
            <a
              href="mailto:arszalzdarker@email.com"
              className="aside-social-link"
              title="Email"
            >
              Email
            </a>
          </div>
        </div>
      </aside>
      <article key={page} className="page">
        {body[page]}
      </article>
    </div>
  )
}
