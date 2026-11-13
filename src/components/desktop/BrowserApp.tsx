import { useState } from 'react'

interface Bookmark {
  id: string
  title: string
  url: string
  badge: string
  desc: string
  highlights: string[]
}

const BOOKMARKS: Bookmark[] = [
  {
    id: 'portfolio',
    title: 'Web Portofolio — Alif Fadillah Ummar',
    url: 'https://alif-fadillah-portfolio.vercel.app',
    badge: 'Live Web',
    desc: 'Portofolio resmi versi web dengan daftar proyek lengkap, pengalaman kerja, dan studi kasus.',
    highlights: ['Laravel & Node.js Backend', 'React, Next.js & TypeScript', 'AI Computer Vision (YOLO / OpenCV)', 'IoT & E-Checksheet Industri'],
  },
  {
    id: 'github',
    title: 'GitHub — @zalzdarkent',
    url: 'https://github.com/zalzdarkent',
    badge: 'Open Source',
    desc: 'Repositori kode sumber, eksperimen full-stack, skrip automasi, dan proyek 3D interaktif.',
    highlights: ['Full Stack Web Apps', 'Computer Vision Pipelines', 'REST APIs & Microservices'],
  },
  {
    id: 'linkedin',
    title: 'LinkedIn — Alif Fadillah Ummar',
    url: 'https://linkedin.com/in/alif-fadillah-ummar-07001224b/',
    badge: 'Professional',
    desc: 'Profil profesional, riwayat pendidikan S1 Informatika UNSIKA (Cum Laude), dan sertifikasi.',
    highlights: ['3+ Tahun Pengalaman Nyata', 'Full Stack Developer', 'Junior Software Engineer'],
  },
]

export default function BrowserApp() {
  const [activeId, setActiveId] = useState<string>('portfolio')
  const current = BOOKMARKS.find((b) => b.id === activeId) ?? BOOKMARKS[0]

  return (
    <div className="w-full h-full flex flex-col bg-[#1c1b22] text-[#f0f0f4]">
      {/* Address & Navigation Bar */}
      <div className="flex items-center gap-2 px-3! py-2! bg-[#2b2a33] border-b border-white/10">
        <div className="flex items-center gap-1 text-[#aaa] text-[13px]">
          <button
            className="w-7 h-7 rounded hover:bg-white/10 flex items-center justify-center"
            onClick={() => {
              const idx = BOOKMARKS.findIndex((b) => b.id === activeId)
              setActiveId(BOOKMARKS[(idx - 1 + BOOKMARKS.length) % BOOKMARKS.length].id)
            }}
            title="Previous bookmark"
          >
            ←
          </button>
          <button
            className="w-7 h-7 rounded hover:bg-white/10 flex items-center justify-center"
            onClick={() => {
              const idx = BOOKMARKS.findIndex((b) => b.id === activeId)
              setActiveId(BOOKMARKS[(idx + 1) % BOOKMARKS.length].id)
            }}
            title="Next bookmark"
          >
            →
          </button>
        </div>
        <div className="flex-1 flex items-center gap-2 bg-[#1c1b22] px-3! py-1.5! rounded-md text-[12px] text-[#d4d4d8] border border-white/10">
          <span className="text-[#2eb872]">🔒</span>
          <span className="truncate">{current.url}</span>
        </div>
        <a
          href={current.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3! py-1.5! rounded-md bg-ub-orange text-white text-[12px] font-medium hover:brightness-110 transition"
        >
          Buka Tab Baru ↗
        </a>
      </div>

      {/* Bookmarks Bar */}
      <div className="flex items-center gap-2 px-3! py-1.5! bg-[#23222b] border-b border-white/10 text-[12px]">
        {BOOKMARKS.map((bm) => (
          <button
            key={bm.id}
            onClick={() => setActiveId(bm.id)}
            className={`px-2.5! py-1! rounded transition cursor-pointer ${
              bm.id === activeId ? 'bg-white/15 text-white font-medium' : 'text-[#b8b8c2] hover:bg-white/8'
            }`}
          >
            {bm.badge}
          </button>
        ))}
      </div>

      {/* Page Content */}
      <div className="flex-1 p-6! overflow-y-auto flex flex-col justify-between gap-6 bg-[radial-gradient(circle_at_top_right,#2b213a_0%,#1c1b22_60%)]">
        <div>
          <span className="inline-block px-2.5! py-0.5! rounded-full text-[11px] font-semibold bg-ub-orange/20 text-[#ff8b5e] border border-ub-orange/40 mb-3!">
            {current.badge}
          </span>
          <h2 className="text-[22px] font-bold text-white mb-2!">{current.title}</h2>
          <p className="text-[14px] text-[#c7c7d1] leading-relaxed mb-5!">{current.desc}</p>

          <div className="grid grid-cols-2 gap-3">
            {current.highlights.map((item) => (
              <div key={item} className="p-3! rounded-lg bg-white/5 border border-white/10 text-[13px] text-[#e4e4e7]">
                <span className="text-ub-orange mr-2!">▸</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4! border-t border-white/10 text-[12px] text-[#9a9aa6]">
          <span>Firefox for Ubuntu — Sandbox Preview</span>
          <a
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ff8b5e] hover:underline"
          >
            {current.url} ↗
          </a>
        </div>
      </div>
    </div>
  )
}
