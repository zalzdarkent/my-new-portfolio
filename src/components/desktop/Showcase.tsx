import { useState, type ReactNode } from "react"
import { ThumbPlayer } from "../../motion"
import { I18N, JOBS_DATA, NAME, PROJECTS_DATA, SKILLS_DATA, TESTIMONIALS_DATA } from "../../data/portfolioData"
import type { Lang, Page } from "../../types/portfolio"
import { NAV_KEYS } from "../../types/portfolio"
import ContactForm from "./ContactForm"

const EASE = 'ease-[ease]'
const TR = `transition-all duration-150 ${EASE}`
const PAGE_IN = 'motion-safe:[&>*]:animate-[pageIn_0.45s_cubic-bezier(0.16,1,0.3,1)_both]'
const CARD_IN = 'motion-safe:animate-[cardIn_0.5s_cubic-bezier(0.16,1,0.3,1)_both]'
const CARD_TR = 'transition-[transform,border-color,box-shadow] duration-250 ease-out-expo'
const HOVER_SOFT = 'hover:border-[rgba(233,84,32,0.18)]'
const P = 'mb-3.5! max-w-[72ch] text-[13.5px] leading-[1.6] text-[#ccc] text-pretty'
const P_FLAT = 'max-w-[72ch] text-[13.5px] leading-[1.6] text-[#ccc] text-pretty'
const H2 = 'mb-3! flex items-center gap-2.5 text-[22px] font-bold leading-[1.2] tracking-[-0.01em] text-white text-balance'
const H3 = 'mt-7! mb-2.5! border-b border-white/8 pb-1.5! text-[15px] font-semibold text-white text-balance'
const SUB = 'mb-5! max-w-[72ch] text-[13px] leading-[1.6] text-[#888] text-pretty'
const GRID = 'grid gap-4'
const CARD = 'rounded-lg border border-white/6'
const BADGE_BASE = 'rounded-[10px] px-[7px]! py-0.5! text-[10px] font-semibold tabular-nums'
const LEVEL_BADGE: Record<string, string> = {
  advanced: 'bg-[rgba(233,84,32,0.2)] text-[#ff9166]',
  intermediate: 'bg-[rgba(46,184,114,0.15)] text-[#4af626]',
  beginner: 'bg-[rgba(59,130,246,0.15)] text-[#60a5fa]',
}
const STAGGER = (n: number) => ({ animationDelay: `${n}s` })
const TL_H3 = 'mt-0.5! mb-1.5! text-[15px] font-semibold text-white text-balance'
const TL_UL = 'mt-1.5! ml-4! text-[12.5px] leading-normal text-[#bbb]'
const TL_LI = 'mb-1! max-w-[72ch] text-pretty'
const EDU_P = 'mt-1! mb-2! max-w-[72ch] text-[13px] leading-[1.6] font-semibold text-[#e0e0e0] text-pretty'
const COMP_T = 'mb-1! block text-[13px] text-white'
const CHANNEL = `flex items-center gap-3 ${CARD} px-3.5! py-3! bg-[#242424] text-inherit no-underline transition-[translate,border-color,box-shadow] duration-250 ease-out-expo ${HOVER_SOFT} hover:bg-[#282828] hover:shadow-[0_10px_24px_rgba(0,0,0,0.28)] motion-safe:hover:-translate-y-0.5`
const CH_T = 'block text-[13px] text-white'
const DOT = 'size-1.5 rounded-full bg-[#2eb872] shadow-[0_0_0_3px_rgba(80,220,120,0.18)]'
const HOME_BTN = `rounded-md px-[18px]! py-[9px]! text-[13px] font-medium text-white ${TR}`
const QUICK = `text-[#aaa] no-underline transition-colors duration-150 ${EASE} hover:text-ub-orange`
const LANG = `flex-1 rounded py-1! text-center text-[11px] font-semibold ${TR}`
const LANG_ON = 'bg-ub-orange text-white'
const LANG_OFF = 'text-[#888]'

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
        <h2 className={H2}>{t.aboutTitle}</h2>
        <p className={SUB}>{t.role}</p>
        <p className={P}>{t.aboutDesc}</p>

        {/* Stats Grid */}
        <div className={`${GRID} my-[18px]! grid-cols-4`}>
          {t.stats.map((s, i) => (
            <div
              key={i}
              className={`${CARD} border-white/8 bg-[#252525] p-3.5! text-center ${CARD_TR} ${HOVER_SOFT} ${CARD_IN}`}
              style={STAGGER(Math.min(i + 1, 5) * 0.045)}
            >
              <div className="text-[24px] font-extrabold text-ub-orange tabular-nums">{s.num}</div>
              <div className="mt-1! text-[11px] text-text-dim">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Work Habits */}
        <h3 className={H3}>{t.workHabitsTitle}</h3>
        <div className={`${GRID} my-4! grid-cols-3`}>
          {t.workHabits.map((h, i) => (
            <div key={i} className={`${CARD} bg-[#232323] px-3.5! py-3! ${CARD_IN}`}>
              <div className="mb-1.5! flex items-center gap-2">
                <span className="text-[16px]">{h.icon}</span>
                <span className="text-[13px] font-semibold text-white">{h.title}</span>
              </div>
              <p className={P_FLAT}>{h.desc}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <h3 className={H3}>{t.testimonialsTitle}</h3>
        <div className={`${GRID} mt-3.5! grid-cols-3`}>
          {TESTIMONIALS_DATA.map((tm, i) => (
            <div key={i} className={`${CARD} flex flex-col justify-between bg-[#232323] p-3.5!`}>
              <blockquote className="mb-2.5! max-w-[72ch] text-[12px] leading-normal text-[#bbb] italic text-pretty">"{tm.text}"</blockquote>
              <div className="flex flex-col border-t border-white/6 pt-2!">
                <strong className="text-[12.5px] text-white">{tm.name}</strong>
                <span className="text-[11px] text-[#888]">{tm.role}</span>
              </div>
            </div>
          ))}
        </div>
      </>
    ),

    Skills: (
      <>
        <h2 className={H2}>{t.skillsTitle}</h2>
        <p className={SUB}>{t.skillsSub}</p>
        <div className={`${GRID} mt-3.5! grid-cols-2`}>
          {SKILLS_DATA.map((s, i) => (
            <div
              key={s.name}
              className={`${CARD} flex flex-col gap-1.5 bg-[#242424] px-3.5! py-2.5! ${CARD_TR} ${HOVER_SOFT} ${CARD_IN}`}
              style={STAGGER(0.05 + i * 0.04)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-[9px] rounded-full" style={{ background: s.color }} />
                  <span className="text-[13px] font-semibold text-white">{s.name}</span>
                </div>
                <span className={`${BADGE_BASE} ${LEVEL_BADGE[s.level.toLowerCase()] ?? 'bg-white/8 text-[#ccc]'}`}>{s.level}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-[3px] bg-[#181818]">
                <i
                  className={`block h-full rounded-[3px] transition-[width] duration-[400ms] ${EASE}`}
                  style={{
                    width: `${s.pct}%`,
                    background: `linear-gradient(90deg, #77216F, ${s.color})`,
                  }}
                />
              </div>
              <span className="text-[11px] text-text-dim">{s.note}</span>
            </div>
          ))}
        </div>
      </>
    ),

    Experience: (
      <>
        <h2 className={H2}>{t.expTitle}</h2>
        <p className={SUB}>{t.expSub}</p>
        <div className="mt-4! grid gap-3.5">
          {JOBS_DATA.map((j, i) => (
            <div key={j.where} className={`${CARD} flex items-stretch overflow-hidden bg-[#242424] shadow-[0_4px_12px_rgba(0,0,0,0.2)] ${CARD_IN}`} style={STAGGER(0.1 + i * 0.1)}>
              <div className="w-1 shrink-0 bg-ub-orange" />
              <div className="flex-1 px-[18px]! py-3.5!">
                <div className="mb-1! flex items-baseline justify-between">
                  <span className="text-[11.5px] font-semibold text-[#ff7f4a] tabular-nums">{j.when}</span>
                  <span className="rounded bg-white/8 px-[7px]! py-0.5! text-[10.5px] text-[#ccc]">{j.place}</span>
                </div>
                <h3 className={TL_H3}>
                  {j.where} <small className="font-semibold text-ub-orange">— {j.role}</small>
                </h3>
                <ul className={TL_UL}>
                  {(lang === 'id' ? j.itemsId : j.itemsEn).map((it, idx) => (
                    <li key={idx} className={TL_LI}>{it}</li>
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
        <h2 className={H2}>{t.eduTitle}</h2>
        <p className={SUB}>{t.eduSub}</p>

        <div className="mt-4! grid gap-3.5">
          <div className={`${CARD} flex items-stretch overflow-hidden bg-[#242424] shadow-[0_4px_12px_rgba(0,0,0,0.2)] ${CARD_IN}`}>
            <div className="w-1 shrink-0" style={{ background: '#2eb872' }} />
            <div className="flex-1 px-[18px]! py-3.5!">
              <div className="mb-1! flex items-baseline justify-between">
                <span className="text-[11.5px] font-semibold text-[#ff7f4a] tabular-nums">2022 — 2026</span>
                <span className="mb-1.5! inline-block rounded bg-[rgba(46,184,114,0.12)] px-2! py-0.5! text-[11px] font-semibold text-[#2eb872]">Cum Laude Honor 🎓</span>
              </div>
              <h3 className={TL_H3}>Universitas Singaperbangsa Karawang (UNSIKA)</h3>
              <p className={EDU_P}>
                {lang === 'id' ? 'S1 Informatika — Fresh Graduate' : 'B.Sc. in Computer Science / Informatics'}
              </p>
              <ul className={TL_UL}>
                {lang === 'id' ? (
                  <>
                    <li className={TL_LI}>Lulusan Fresh Graduate dengan predikat Cum Laude (IPK Tinggi).</li>
                    <li className={TL_LI}>Fokus pada pengembangan aplikasi web end-to-end, arsitektur basis data, dan struktur data.</li>
                    <li className={TL_LI}>Membangun berbagai proyek dengan standar kode modern, performa tinggi, dan clean architecture.</li>
                    <li className={TL_LI}>Aktif dalam kegiatan kampus, asisten laboratorium, dan kepengurusan komunitas GDSC.</li>
                  </>
                ) : (
                  <>
                    <li className={TL_LI}>Graduated with high honors (Cum Laude).</li>
                    <li className={TL_LI}>Focused on end-to-end web engineering, database architecture, and data structures.</li>
                    <li className={TL_LI}>Built production-grade projects adhering to modern code standards and clean architecture.</li>
                    <li className={TL_LI}>Active campus involvement as a lab assistant and GDSC technical core team lead.</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <div className={`${CARD} flex items-stretch overflow-hidden bg-[#242424] shadow-[0_4px_12px_rgba(0,0,0,0.2)] ${CARD_IN}`}>
            <div className="w-1 shrink-0" style={{ background: '#3b82f6' }} />
            <div className="flex-1 px-[18px]! py-3.5!">
              <div className="mb-1! flex items-baseline justify-between">
                <span className="text-[11.5px] font-semibold text-[#ff7f4a] tabular-nums">2024</span>
                <span className="rounded bg-white/8 px-[7px]! py-0.5! text-[10.5px] text-[#ccc]">Kampus Merdeka</span>
              </div>
              <h3 className={TL_H3}>MSIB Studi Independen @ Vocasia</h3>
              <p className={EDU_P}>
                Fullstack Web MERN Development (MongoDB, Express.js, React, Node.js)
              </p>
              <ul className={TL_UL}>
                {lang === 'id' ? (
                  <>
                    <li className={TL_LI}>Membangun project fullstack menggunakan stack MERN secara end-to-end.</li>
                    <li className={TL_LI}>Memahami struktur ExpressJS untuk backend dan teknik menangani race condition pada aplikasi concurrent.</li>
                    <li className={TL_LI}>Mengembangkan soft skill public speaking, presentasi teknis, dan manajemen waktu tim.</li>
                  </>
                ) : (
                  <>
                    <li className={TL_LI}>Built end-to-end fullstack applications using the MERN stack.</li>
                    <li className={TL_LI}>Architected ExpressJS backends with techniques to prevent race conditions in concurrent requests.</li>
                    <li className={TL_LI}>Cultivated soft skills in public speaking, technical presentation, and timeline management.</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Competencies */}
        <h3 className={H3}>{lang === 'id' ? 'Kompetensi Utama' : 'Core Competencies'}</h3>
        <div className={`${GRID} my-3.5! grid-cols-3`}>
          <div className={`${CARD} bg-[#242424] p-3!`}>
            <strong className={COMP_T}>💻 {lang === 'id' ? 'Teknis' : 'Technical'}</strong>
            <p className={P_FLAT}>
              {lang === 'id'
                ? 'Web development, integrasi sistem, dan struktur kode yang modular serta scalable.'
                : 'Web development, system integration, and modular, scalable code structure.'}
            </p>
          </div>
          <div className={`${CARD} bg-[#242424] p-3!`}>
            <strong className={COMP_T}>📊 {lang === 'id' ? 'Analitik' : 'Analytical'}</strong>
            <p className={P_FLAT}>
              {lang === 'id'
                ? 'Pengolahan dan pipeline data yang rapi untuk hasil analisis yang terukur.'
                : 'Clean data processing and pipelines producing measurable insights.'}
            </p>
          </div>
          <div className={`${CARD} bg-[#242424] p-3!`}>
            <strong className={COMP_T}>🚀 {lang === 'id' ? 'Eksekusi' : 'Execution'}</strong>
            <p className={P_FLAT}>
              {lang === 'id'
                ? 'Membangun fitur end-to-end dengan target kualitas tinggi dan timeline disiplin.'
                : 'Delivering end-to-end features with high quality standards and disciplined timelines.'}
            </p>
          </div>
        </div>

        {/* Key Achievements */}
        <h3 className={H3}>{lang === 'id' ? 'Pencapaian & Sorotan' : 'Key Achievements'}</h3>
        <div className="my-3! grid grid-cols-2 gap-4">
          <div className={`${CARD} flex items-center gap-2 rounded-md bg-[#242424] px-3! py-2! text-[12px] text-[#ddd]`}>
            <span className="text-[14px] text-[#ffb830]">🌟</span>
            <span>Head of Technical Core Team @ GDSC UNSIKA</span>
          </div>
          <div className={`${CARD} flex items-center gap-2 rounded-md bg-[#242424] px-3! py-2! text-[12px] text-[#ddd]`}>
            <span className="text-[14px] text-[#ffb830]">📜</span>
            <span>Fresh Graduate with Cum Laude Honor</span>
          </div>
          <div className={`${CARD} flex items-center gap-2 rounded-md bg-[#242424] px-3! py-2! text-[12px] text-[#ddd]`}>
            <span className="text-[14px] text-[#ffb830]">⚙️</span>
            <span>Built Industrial E-Checksheet System @ PT CBI</span>
          </div>
          <div className={`${CARD} flex items-center gap-2 rounded-md bg-[#242424] px-3! py-2! text-[12px] text-[#ddd]`}>
            <span className="text-[14px] text-[#ffb830]">📈</span>
            <span>Preventive Maintenance Dashboard @ PT CBI</span>
          </div>
          <div className={`${CARD} flex items-center gap-2 rounded-md bg-[#242424] px-3! py-2! text-[12px] text-[#ddd]`}>
            <span className="text-[14px] text-[#ffb830]">👁️</span>
            <span>PPE Detection using YOLO Vision @ PT AT Indonesia</span>
          </div>
          <div className={`${CARD} flex items-center gap-2 rounded-md bg-[#242424] px-3! py-2! text-[12px] text-[#ddd]`}>
            <span className="text-[14px] text-[#ffb830]">🏷️</span>
            <span>RFID Attendance Integration @ Fasilkom Lab</span>
          </div>
        </div>
      </>
    ),

    Projects: (
      <>
        <h2 className={H2}>{t.projTitle}</h2>
        <p className={SUB}>{t.projSub}</p>

        {/* Filter Bar */}
        <div className="mb-4! flex gap-2">
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
              className={`rounded-md border px-3! py-[5px]! text-[12px] ${TR} ${
                projFilter === k
                  ? 'border-ub-orange bg-ub-orange font-semibold text-white shadow-[inset_0_-2px_0_var(--ub-orange)]'
                  : 'border-white/8 bg-white/6 text-[#aaa] hover:bg-white/12 hover:text-white'
              }`}
              onClick={() => setProjFilter(k)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className={`${GRID} grid-cols-2`}>
          {filteredProjects.map((p, i) => (
            <div key={p.id} className={`${CARD} flex flex-col overflow-hidden border-white/8 bg-[#242424] shadow-[0_4px_14px_rgba(0,0,0,0.25)] ${CARD_TR} ${HOVER_SOFT} hover:shadow-[0_10px_24px_rgba(0,0,0,0.28)] ${CARD_IN}`}
              style={STAGGER(0.1 + i * 0.08)}
            >
              <div className="relative h-[120px] w-full overflow-hidden bg-[#111]">
                <ThumbPlayer kind={p.kind} hue={p.hue} />
              </div>
              <div className="flex flex-1 flex-col p-3.5!">
                <div className="mb-1.5! flex items-baseline justify-between gap-2">
                  <span className="text-[14.5px] font-bold text-white">{p.name}</span>
                  <span className="rounded bg-[rgba(233,84,32,0.2)] px-1.5! py-0.5! text-[10px] font-semibold text-[#ff9166] uppercase">{p.cat}</span>
                </div>
                <p className={`${P} mb-2!`}>{lang === 'id' ? p.shortDescId : p.shortDescEn}</p>

                <div className="my-2! flex flex-wrap gap-[5px]">
                  {p.tags.map((tg) => (
                    <span key={tg} className="rounded-[3px] bg-white/6 px-1.5! py-0.5! text-[10px] text-[#aaa]">
                      {tg}
                    </span>
                  ))}
                </div>

                <ul className="mt-1.5! mb-2.5! ml-3.5! text-[11.5px] leading-[1.4] text-[#999]">
                  {(lang === 'id' ? p.featuresId : p.featuresEn).slice(0, 3).map((f, idx) => (
                    <li key={idx} className="mb-0.5!">✓ {f}</li>
                  ))}
                </ul>

                <div className="mt-auto! flex gap-2 border-t border-white/6 pt-2.5!">
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 rounded px-2.5! py-1! text-[11.5px] font-medium no-underline ${TR} bg-ub-orange text-white`}
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
                      className={`inline-flex items-center gap-1 rounded px-2.5! py-1! text-[11.5px] font-medium no-underline ${TR} bg-white/8 text-[#ddd] hover:bg-ub-orange hover:text-white`}
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
        <h2 className={H2}>{t.contactTitle}</h2>
        <p className={SUB}>{t.contactSub}</p>
        <div className="mt-3.5! grid grid-cols-[1fr_1.2fr] gap-5">
          <div className="flex flex-col gap-3">
            <a
              href="mailto:arszalzdarker@email.com"
              className={CHANNEL}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <span className="text-[20px]">✉️</span>
              <div>
                <strong className={CH_T}>Email</strong>
                <span className="text-[11.5px] text-[#999]">arszalzdarker@email.com</span>
              </div>
            </a>
            <a
              href="https://github.com/zalzdarkent"
              target="_blank"
              rel="noopener noreferrer"
              className={CHANNEL}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <span className="text-[20px]">🐙</span>
              <div>
                <strong className={CH_T}>GitHub</strong>
                <span className="text-[11.5px] text-[#999]">github.com/zalzdarkent</span>
              </div>
            </a>
            <a
              href="https://linkedin.com/in/alif-fadillah-ummar-07001224b/"
              target="_blank"
              rel="noopener noreferrer"
              className={CHANNEL}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <span className="text-[20px]">💼</span>
              <div>
                <strong className={CH_T}>LinkedIn</strong>
                <span className="text-[11.5px] text-[#999]">Alif Fadillah Ummar</span>
              </div>
            </a>
            <a
              href="https://alif-fadillah-portfolio.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className={CHANNEL}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <span className="text-[20px]">🌐</span>
              <div>
                <strong className={CH_T}>Live Portfolio</strong>
                <span className="text-[11.5px] text-[#999]">alif-fadillah-portfolio.vercel.app</span>
              </div>
            </a>
            <div className="rounded-md border-l-[3px] border-ub-orange bg-white/3 p-2.5! text-[11.5px] text-[#888]">
              ⏱️ {lang === 'id' ? 'Respon cepat — biasanya dalam 24 jam kerja.' : 'Fast response — usually within 24 business hours.'}
            </div>
          </div>
          <ContactForm lang={lang} />
        </div>
      </>
    ),
  }

  const links = (
    <nav className="flex flex-col gap-1">
      {NAV_KEYS.slice(1).map((k) => (
        <button
          key={k}
          className={`flex items-center justify-between rounded-md px-2.5! py-[7px]! text-left text-[12.5px] ${TR} ${
            k === page
              ? 'bg-ub-orange font-semibold text-white shadow-[inset_0_-2px_0_var(--ub-orange)]'
              : 'text-[#b0b0b0] hover:bg-white/8 hover:text-white'
          }`}
          onClick={() => setPage(k)}
        >
          <span>{t.nav[k]}</span>
          {k === page && <span>›</span>}
        </button>
      ))}
    </nav>
  )

  if (page === 'Home')
    return (
      <div className={`flex h-full w-full flex-col items-center justify-center overflow-y-auto bg-[#1e1e1e] px-12! py-9! text-center text-[#eaeaea]${mobile ? ' phone' : ''}`} onPointerDown={(e) => e.stopPropagation()}>
        <div className="mb-4! inline-flex items-center gap-2 rounded-[20px] border border-[rgba(233,84,32,0.35)] bg-[rgba(233,84,32,0.15)] px-3.5! py-1.5! text-[12px] font-semibold text-[#ff9166]">
          <span className={DOT} />
          <span>{t.status}</span>
        </div>
        <h1 className="mb-1.5! text-[38px] font-extrabold tracking-[-0.5px] text-white">{NAME}</h1>
        <p className="mb-3.5! text-[17px] font-semibold text-ub-orange">{t.role}</p>
        <p className="mb-6! max-w-[72ch] text-[13.5px] leading-[1.6] text-[#bbb] text-pretty">{t.heroDesc}</p>

        <div className="mb-6! flex flex-wrap justify-center gap-2.5">
          <button className={`${HOME_BTN} bg-ub-orange font-semibold`} onClick={() => setPage('Projects')}>
            {t.viewProjects}
          </button>
          <button className={`${HOME_BTN} bg-white/7 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] hover:bg-ub-orange hover:shadow-[inset_0_0_0_1px_var(--ub-orange)]`} onClick={() => setPage('About')}>{t.nav.About}</button>
          <button className={`${HOME_BTN} bg-white/7 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] hover:bg-ub-orange hover:shadow-[inset_0_0_0_1px_var(--ub-orange)]`} onClick={() => setPage('Skills')}>{t.nav.Skills}</button>
          <button className={`${HOME_BTN} bg-white/7 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] hover:bg-ub-orange hover:shadow-[inset_0_0_0_1px_var(--ub-orange)]`} onClick={() => setPage('Experience')}>{t.nav.Experience}</button>
          <button className={`${HOME_BTN} bg-white/7 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] hover:bg-ub-orange hover:shadow-[inset_0_0_0_1px_var(--ub-orange)]`} onClick={() => setPage('Education')}>{t.nav.Education}</button>
          <button className={`${HOME_BTN} bg-white/7 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] hover:bg-ub-orange hover:shadow-[inset_0_0_0_1px_var(--ub-orange)]`} onClick={() => setPage('Contact')}>{t.contactMe}</button>
        </div>

        <div className="flex gap-4 text-[12px] text-[#888]">
          <a className={QUICK} href="mailto:arszalzdarker@email.com" target="_blank" rel="noopener noreferrer">
            ✉️ arszalzdarker@email.com
          </a>
          <span>•</span>
          <a className={QUICK} href="https://github.com/zalzdarkent" target="_blank" rel="noopener noreferrer">
            🐙 zalzdarkent
          </a>
          <span>•</span>
          <a className={QUICK} href="https://alif-fadillah-portfolio.vercel.app" target="_blank" rel="noopener noreferrer">
            🌐 Live Web
          </a>
        </div>
      </div>
    )

  return (
    <div className={`flex h-full overflow-hidden bg-[#1e1e1e] text-[#eaeaea]${mobile ? ' phone' : ''}`} onPointerDown={(e) => e.stopPropagation()}>
      <aside className="flex w-[210px] shrink-0 flex-col overflow-y-auto bg-[#171717] px-3.5! py-5! shadow-[inset_-1px_0_0_rgba(255,255,255,0.08)]">
        <button className="mb-0.5! text-left text-[16px] font-bold text-white" onClick={() => setPage('Home')}>
          {NAME}
        </button>
        <p className="mb-4! text-[11px] font-medium text-ub-orange">Full Stack Developer</p>
        <div className="mb-4! inline-flex items-center gap-1.5 rounded bg-[rgba(46,184,114,0.12)] px-2! py-1! text-[11px] text-[#2eb872]">
          <span className={DOT} />
          <span>Open to Work</span>
        </div>
        {links}
        <div className="mt-auto! flex flex-col gap-2.5 border-t border-white/8 pt-4!">
          <div className="flex items-center justify-center gap-1 rounded-md bg-white/6 p-1!">
            <button
              className={`${LANG} ${lang === 'id' ? LANG_ON : LANG_OFF}`}
              onClick={() => setLang('id')}
              title="Bahasa Indonesia"
            >
              ID
            </button>
            <button
              className={`${LANG} ${lang === 'en' ? LANG_ON : LANG_OFF}`}
              onClick={() => setLang('en')}
              title="English"
            >
              EN
            </button>
          </div>
          <div className="flex justify-center gap-1.5">
            <a
              href="https://github.com/zalzdarkent"
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded bg-white/4 px-1.5! py-[3px]! text-[11px] text-[#999] no-underline transition-colors duration-150 ${EASE} hover:bg-white/10 hover:text-white`}
              title="GitHub"
            >
              GitHub
            </a>
            <a
              href="mailto:arszalzdarker@email.com"
              className={`rounded bg-white/4 px-1.5! py-[3px]! text-[11px] text-[#999] no-underline transition-colors duration-150 ${EASE} hover:bg-white/10 hover:text-white`}
              title="Email"
            >
              Email
            </a>
          </div>
        </div>
      </aside>
      <article
        key={page}
        className={`flex-1 scroll-smooth overflow-y-auto px-9! pt-7! pb-10! [scrollbar-color:rgba(255,255,255,0.22)_transparent] [scrollbar-width:thin] motion-reduce:scroll-auto ${PAGE_IN}`}
      >
        {body[page]}
      </article>
    </div>
  )
}
