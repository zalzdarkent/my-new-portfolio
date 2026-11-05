import { useEffect, useRef, useState, type FormEvent, type PointerEvent as RPE, type ReactNode } from 'react'
import { ThumbPlayer, type ThumbKind } from './motion'
import { playKeyClick, playMouseDown, playMouseUp } from './sound'
import './desktop.css'

export const SCREEN_W = 1280
export const SCREEN_H = 720

type AppId = 'showcase' | 'notes' | 'credits'
type Win = { id: AppId; x: number; y: number; z: number; min: boolean; max?: boolean; closing?: boolean }

const APPS: Record<AppId, { title: string; icon: IconKind; w: number; h: number }> = {
  showcase: { title: 'Showcase - Alif Fadillah Ummar', icon: 'terminal', w: 960, h: 600 },
  notes: { title: 'Text Editor - readme.txt', icon: 'note', w: 520, h: 400 },
  credits: { title: 'Credits', icon: 'folder', w: 420, h: 300 },
}

type IconKind = 'terminal' | 'note' | 'folder' | 'browser'
function Icon({ kind, size = 32 }: { kind: IconKind; size?: number }) {
  if (kind === 'terminal') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="10" fill="#2d0922" />
        <rect x="2" y="2" width="44" height="44" rx="8" stroke="#E95420" strokeWidth="2" />
        <path d="M12 16L22 24L12 32" stroke="#4af626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 32H36" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }
  if (kind === 'note') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="10" fill="#333333" />
        <path d="M14 10H34L38 14V38H14V10Z" fill="#fff" />
        <path d="M18 18H30M18 24H30M18 30H26" stroke="#555" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M6 12C6 9.79086 7.79086 8 10 8H20L24 12H38C40.2091 12 42 13.7909 42 16V36C42 38.2091 40.2091 40 38 40H10C7.79086 40 6 38.2091 6 36V12Z" fill="#E95420" />
      <path d="M6 18H42V36C42 38.2091 40.2091 40 38 40H10C7.79086 40 6 38.2091 6 36V18Z" fill="#FF7F4A" />
    </svg>
  )
}

const NAME = 'Alif Fadillah Ummar'
const NAV_KEYS = ['Home', 'About', 'Skills', 'Experience', 'Education', 'Projects', 'Contact'] as const
type Page = (typeof NAV_KEYS)[number]
type Lang = 'id' | 'en'

const I18N = {
  id: {
    nav: {
      Home: 'Beranda',
      About: 'Tentang',
      Skills: 'Keahlian',
      Experience: 'Pengalaman',
      Education: 'Pendidikan',
      Projects: 'Proyek',
      Contact: 'Kontak',
    },
    role: 'Full Stack Developer & Junior Software Engineer',
    status: 'Tersedia untuk Proyek / Open to Work',
    greeting: 'HALO!! SAYA',
    heroDesc:
      'Full Stack Developer dengan semangat membangun produk digital yang berdampak. Spesialis Laravel, React, Next.js, CodeIgniter, dan Node.js dengan 3+ tahun pengalaman nyata.',
    viewProjects: 'Lihat Proyek →',
    contactMe: 'Hubungi Saya',
    aboutTitle: 'Tentang Saya',
    aboutDesc:
      'Saya adalah seorang Full Stack Developer dengan pengalaman lebih dari 3 tahun dalam membangun aplikasi web yang inovatif dan efisien. Keahlian saya meliputi Laravel, React, Next.js, CodeIgniter, dan Node.js. Saya memiliki rekam jejak yang terbukti dalam mengembangkan solusi digital yang berdampak, bekerja sama dengan tim lintas fungsi untuk mencapai hasil yang luar biasa.',
    stats: [
      { num: '3+', label: 'Tahun Pengalaman' },
      { num: '6+', label: 'Proyek Selesai' },
      { num: '5+', label: 'Klien & Instansi Puas' },
      { num: '15+', label: 'Tech Skills & Tools' },
    ],
    workHabitsTitle: 'Kebiasaan Kerja',
    workHabits: [
      { icon: '⚡', title: 'Cepat adaptasi', desc: 'Belajar teknologi baru + penerapan langsung di proyek' },
      { icon: '📐', title: 'Rapi & scalable', desc: 'Struktur kode & alur pengerjaan yang bersih dan jelas' },
      { icon: '🤝', title: 'Kolaboratif', desc: 'Komunikasi tim aktif untuk mencapai target bersama' },
    ],
    testimonialsTitle: 'Kata Mereka',
    skillsTitle: 'Keahlian Teknis',
    skillsSub: 'Teknologi, framework, dan tools yang saya gunakan dalam pengembangan software.',
    expTitle: 'Pengalaman Kerja & Organisasi',
    expSub: 'Dari mentoring lab sampai proyek industri manufaktur.',
    eduTitle: 'Pendidikan & Kompetensi',
    eduSub: 'Latar belakang akademis dan pencapaian profesional.',
    projTitle: 'Proyek Pilihan',
    projSub: 'Portofolio aplikasi web, computer vision AI, dan IoT yang pernah saya bangun.',
    contactTitle: 'Hubungi Saya',
    contactSub: 'Punya ide proyek yang keren? Atau sekadar ingin ngobrol soal teknologi? Saya selalu terbuka untuk kolaborasi baru dan kesempatan menarik. Biasanya saya membalas dalam 24 jam kerja.',
  },
  en: {
    nav: {
      Home: 'Home',
      About: 'About',
      Skills: 'Skills',
      Experience: 'Experience',
      Education: 'Education',
      Projects: 'Projects',
      Contact: 'Contact',
    },
    role: 'Full Stack Developer & Junior Software Engineer',
    status: 'Available for Projects / Open to Work',
    greeting: "HELLO!! I'M",
    heroDesc:
      'Full Stack Developer passionate about building impactful digital products. Specialist in Laravel, React, Next.js, CodeIgniter, and Node.js with 3+ years of real experience.',
    viewProjects: 'View Projects →',
    contactMe: 'Contact Me',
    aboutTitle: 'About Me',
    aboutDesc:
      'I am a Full Stack Developer with over 3 years of experience in building innovative and efficient web applications. My expertise includes Laravel, React, Next.js, CodeIgniter, and Node.js. I have a proven track record of developing impactful digital solutions and working with cross-functional teams to achieve outstanding results.',
    stats: [
      { num: '3+', label: 'Years Experience' },
      { num: '6+', label: 'Completed Projects' },
      { num: '5+', label: 'Satisfied Clients' },
      { num: '15+', label: 'Tech Skills & Tools' },
    ],
    workHabitsTitle: 'Work Habits',
    workHabits: [
      { icon: '⚡', title: 'Fast adapter', desc: 'Quick to learn and implement modern technologies' },
      { icon: '📐', title: 'Clean & scalable', desc: 'Modular code structure & solid engineering workflow' },
      { icon: '🤝', title: 'Collaborative', desc: 'Clear communication to meet team goals and deadlines' },
    ],
    testimonialsTitle: 'What They Say',
    skillsTitle: 'Technical Skills',
    skillsSub: 'Technologies, frameworks, and tools I use for software engineering.',
    expTitle: 'Experience & Leadership',
    expSub: 'From university lab mentoring to manufacturing industrial software.',
    eduTitle: 'Education & Competencies',
    eduSub: 'Academic background, formal degree, and key achievements.',
    projTitle: 'Featured Projects',
    projSub: 'Web applications, AI computer vision, and IoT systems I have built.',
    contactTitle: 'Contact Me',
    contactSub: "Have a cool project idea or want to chat about tech? I am always open to new collaborations and exciting opportunities. I usually reply within 24 business hours.",
  },
}

type SkillLevel = 'Advanced' | 'Intermediate' | 'Beginner'
interface SkillItem {
  name: string
  level: SkillLevel
  pct: number
  color: string
  note: string
}

const SKILLS_DATA: SkillItem[] = [
  { name: 'Laravel', level: 'Advanced', pct: 95, color: '#FF2D20', note: 'Backend MVC, Eloquent ORM, REST API' },
  { name: 'MySQL', level: 'Advanced', pct: 90, color: '#00758F', note: 'Relational DB, Schema Design, Queries' },
  { name: 'React', level: 'Intermediate', pct: 88, color: '#4FB7FD', note: 'Hooks, SPA, Component Architecture' },
  { name: 'Next.js', level: 'Intermediate', pct: 85, color: '#E0E0E0', note: 'App Router, SSR, Server Components' },
  { name: 'Tailwind CSS', level: 'Intermediate', pct: 88, color: '#38BDF8', note: 'Modern UI/UX, Responsive Layouts' },
  { name: 'TypeScript', level: 'Intermediate', pct: 82, color: '#3178C6', note: 'Type Safety, Interfaces, Generics' },
  { name: 'Node.js', level: 'Intermediate', pct: 80, color: '#83CD29', note: 'Express.js, REST APIs, Microservices' },
  { name: 'CodeIgniter', level: 'Intermediate', pct: 82, color: '#EE4326', note: 'Enterprise PHP Applications' },
  { name: 'Git', level: 'Intermediate', pct: 85, color: '#F05032', note: 'Version Control, Branching, CI/CD' },
  { name: 'Python', level: 'Intermediate', pct: 78, color: '#3776AB', note: 'Scripting, Automation, AI Integration' },
  { name: 'PostgreSQL', level: 'Beginner', pct: 65, color: '#336791', note: 'Relational DB, Complex Joins, JSONB' },
  { name: 'Docker', level: 'Beginner', pct: 62, color: '#2496ED', note: 'Containerization, Multi-container Setup' },
  { name: 'Redis', level: 'Beginner', pct: 60, color: '#DC382D', note: 'In-Memory Cache, Session Storage' },
  { name: 'YOLO (Computer Vision)', level: 'Beginner', pct: 66, color: '#00F0FF', note: 'Real-time Object Detection, PPE Vision' },
  { name: 'Flutter', level: 'Beginner', pct: 55, color: '#02569B', note: 'Cross-platform Mobile Development' },
]

interface JobItem {
  when: string
  where: string
  role: string
  place: string
  itemsId: string[]
  itemsEn: string[]
}

const JOBS_DATA: JobItem[] = [
  {
    when: 'Januari 2026 — Sekarang',
    where: 'PT AT Indonesia',
    role: 'Magang (Industrial Internship)',
    place: 'Karawang, Jawa Barat',
    itemsId: [
      'Membangun sistem deteksi APD berbasis Camera Vision menggunakan YOLO.',
      'Mengoptimalkan proses data input dan pengolahan pipeline hasil deteksi secara real-time.',
      'Menerapkan evaluasi sederhana untuk memastikan performa akurasi di area kerja pabrik.',
    ],
    itemsEn: [
      'Built AI-based PPE detection system using Camera Vision and YOLO.',
      'Optimized data input pipeline and real-time detection inference.',
      'Implemented performance evaluation to ensure high detection accuracy on the shop floor.',
    ],
  },
  {
    when: 'Maret 2025 — Juni 2025',
    where: 'PT Century Batteries Indonesia',
    role: 'Magang (Industrial Internship)',
    place: 'Karawang, Jawa Barat',
    itemsId: [
      'Membangun sistem E-Checksheet Pre-Use untuk pemantauan mesin oleh departemen maintenance.',
      'Mengembangkan sistem dashboard Preventive Maintenance untuk departemen maintenance.',
    ],
    itemsEn: [
      'Developed Pre-Use E-Checksheet system for plant machinery monitoring by maintenance dept.',
      'Built Preventive Maintenance dashboard system for scheduled equipment servicing.',
    ],
  },
  {
    when: 'Januari 2024 — Januari 2026',
    where: 'Laboratorium Komputer Fasilkom UNSIKA',
    role: 'Asisten Laboratorium & Operasional',
    place: 'Universitas Singaperbangsa Karawang',
    itemsId: [
      'Membimbing praktikum mahasiswa dan membantu operasional kegiatan harian lab.',
      'Menyusun materi dan alur pembelajaran praktikum yang terstruktur.',
      'Berkoordinasi dengan tim asisten dan dosen untuk memastikan kelancaran praktikum & event.',
    ],
    itemsEn: [
      'Guided student lab practicums and assisted daily computer laboratory operations.',
      'Structured course materials and organized hands-on learning workflows.',
      'Coordinated with team assistants and faculty to ensure smooth practicums and exams.',
    ],
  },
  {
    when: 'Agustus 2023 — September 2024',
    where: 'Google Developer Student Club (GDSC)',
    role: 'Head of Technical Core Team',
    place: 'Chapter UNSIKA',
    itemsId: [
      'Memimpin Technical Core Team GDSC dalam menyelenggarakan workshop dan mentoring.',
      'Membangun project kolaboratif dan mengikuti kegiatan berbasis teknologi Google.',
      'Melatih kemampuan kolaborasi, kepemimpinan tim, dan komunikasi teknis.',
    ],
    itemsEn: [
      'Led the Technical Core Team for GDSC campus chapter, organizing workshops and mentoring.',
      'Built collaborative projects and participated in Google developer ecosystem initiatives.',
      'Cultivated team collaboration, technical leadership, and presentation skills.',
    ],
  },
]

interface ProjectItem {
  id: number
  name: string
  cat: 'web' | 'ai' | 'iot' | 'fullstack'
  kind: ThumbKind
  hue: number
  tags: string[]
  shortDescId: string
  shortDescEn: string
  featuresId: string[]
  featuresEn: string[]
  liveUrl?: string
  githubUrl?: string
}

const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 1,
    name: 'Tes SEP-T UNSIKA',
    cat: 'fullstack',
    kind: 'cube',
    hue: 205,
    tags: ['Laravel', 'React', 'Inertia.js', 'Tailwind CSS', 'MySQL', 'Docker'],
    shortDescId: 'Platform tes SEP-T (Singaperbangsa English Proficiency Test) berbasis web untuk mahasiswa UNSIKA.',
    shortDescEn: 'Web-based SEP-T (Singaperbangsa English Proficiency Test) examination platform for UNSIKA students.',
    featuresId: [
      'Keamanan Ujian Anti-Cheating (Deteksi Pindah Tab & Sesi Terkunci)',
      'Sistem Soal Canggih (Pilihan Ganda, Esai, Rumus LaTeX & Audio)',
      'Sistem Auto-Save Jawaban & Timer Real-time Terenkripsi',
      'Dashboard Analytics & Auto-Scoring Hasil Ujian Objektif',
    ],
    featuresEn: [
      'Anti-Cheating Exam Security (Tab Switch Detection & Locked Session)',
      'Advanced Question Engine (Multiple Choice, Essay, LaTeX Formulas & Audio)',
      'Encrypted Auto-Save Answer System & Real-time Countdown Timer',
      'Analytics Dashboard with Automated Scoring for Objective Tests',
    ],
    liveUrl: 'https://onlinetest.unsika.ac.id',
    githubUrl: 'https://github.com/zalzdarkent/tes_online_unsika',
  },
  {
    id: 2,
    name: 'Absen Asisten Lab RFID',
    cat: 'fullstack',
    kind: 'rfid',
    hue: 275,
    tags: ['Laravel', 'React', 'Inertia.js', 'Tailwind CSS', 'MySQL', 'RFID'],
    shortDescId: 'Platform asisten lab berbasis web terintegrasi sensor RFID untuk Fakultas Ilmu Komputer UNSIKA.',
    shortDescEn: 'RFID-integrated web-based laboratory assistant platform for Faculty of Computer Science UNSIKA.',
    featuresId: [
      'Absensi Piket Otomatis Terintegrasi Sensor RFID',
      'Manajemen Jadwal Piket & Notifikasi Pengingat Otomatis',
      'Manajemen Data Asisten & Inventaris Perangkat Laboratorium',
      'Rekapitulasi dan Laporan Kehadiran Asisten Lab',
    ],
    featuresEn: [
      'Automated Attendance Log via RFID Hardware Scanner',
      'Duty Schedule Management with Auto Reminder Notifications',
      'Lab Assistant Directory & Hardware Equipment Inventory',
      'Real-time Attendance Auditing and Summary Reports',
    ],
    liveUrl: 'https://onlinetest.unsika.ac.id',
    githubUrl: 'https://github.com/zalzdarkent/tes_online_unsika',
  },
  {
    id: 3,
    name: 'Deteksi APD Karyawan',
    cat: 'ai',
    kind: 'vision',
    hue: 145,
    tags: ['Python', 'YOLO', 'OpenCV', 'PyTorch', 'Flask', 'Computer Vision'],
    shortDescId: 'Sistem deteksi APD karyawan berbasis AI Camera Vision untuk kepatuhan protokol K3 di PT AT Indonesia.',
    shortDescEn: 'AI Computer Vision employee PPE detection system ensuring workplace safety compliance at PT AT Indonesia.',
    featuresId: [
      'Deteksi APD Real-time via Computer Vision (Helm, Rompi, Kacamata)',
      'Peringatan & Notifikasi Otomatis Pelanggaran Keselamatan K3',
      'Optimasi Pipeline Pengolahan Video & Inferensi Model Cepat',
      'Integrasi Data dengan Dashboard Monitoring Keselamatan Pabrik',
    ],
    featuresEn: [
      'Real-time PPE Detection via Computer Vision (Helmet, Vest, Goggles)',
      'Instant Alerts & Notifications on Safety Protocol Violations',
      'Optimized Camera Video Pipeline for Fast Model Inference',
      'Data Integration with Factory Safety Monitoring Dashboard',
    ],
  },
  {
    id: 4,
    name: 'SpicyPlay Music Player',
    cat: 'web',
    kind: 'bars',
    hue: 330,
    tags: ['React', 'Vite', 'Tailwind CSS', 'TypeScript', 'Web Audio API'],
    shortDescId: 'Aplikasi web pemutar musik modern dan responsif dilengkapi synth groovebox untuk eksplorasi suara kreatif.',
    shortDescEn: 'Modern interactive web music player featuring a built-in synth groovebox for creative audio exploration.',
    featuresId: [
      'Pemutar Musik dengan Visualizer & Kontrol Audio Lengkap',
      'Built-in Synth Groovebox untuk Eksplorasi Suara Interaktif',
      'Daftar Putar & Manajemen Antrean Musik Dinamis',
      'Performa Ultra Cepat dengan Vite dan Desain Responsif Modern',
    ],
    featuresEn: [
      'Music Player with Interactive Audio Visualizer & Full Playback Controls',
      'Integrated Synth Groovebox for Creative Sound Design',
      'Dynamic Playlist & Music Queue Management',
      'Lightning-fast Performance with Vite & Modern Responsive UI',
    ],
  },
  {
    id: 5,
    name: 'Monitoring IP Address CCTV',
    cat: 'web',
    kind: 'cctv',
    hue: 195,
    tags: ['PHP', 'SQLSRV', 'Networking', 'Bootstrap'],
    shortDescId: 'Sistem monitoring IP Address CCTV berbasis web untuk mencegah duplikasi IP dan kesalahan data perangkat.',
    shortDescEn: 'Web-based CCTV IP address management and monitoring system preventing network IP duplication.',
    featuresId: [
      'Manajemen & Pemantauan IP Address CCTV Terpusat',
      'Deteksi Cepat & Pencegahan Duplikasi Alamat IP Jaringan',
      'Pelacakan Status Kamera CCTV (Online / Offline / Rusak)',
      'Pencarian Fleksibel & Export Laporan Audit ke Excel/PDF',
    ],
    featuresEn: [
      'Centralized CCTV IP Address Allocation and Monitoring',
      'Early Detection & Prevention of Network IP Conflicts',
      'Live Camera Status Tracking (Active / Inactive / Faulty)',
      'Fast Search Filters & Comprehensive Excel/PDF Audit Reporting',
    ],
  },
  {
    id: 6,
    name: 'Monitoring Mesin Grinding',
    cat: 'iot',
    kind: 'iot',
    hue: 38,
    tags: ['PHP', 'SQLSRV', 'Web-IoT', 'Sensors', 'Telemetry'],
    shortDescId: 'Sistem monitoring status mesin grinding berbasis Web-IoT untuk mencegah downtime peralatan pabrik.',
    shortDescEn: 'Web-IoT-based grinding machine monitoring system designed to eliminate production downtime.',
    featuresId: [
      'Telemetri & Pemantauan Operasional Mesin Secara Real-time',
      'Pelacakan Kinerja Mesin & Indikator Preventive Maintenance',
      'Sistem Peringatan Dini untuk Menghindari Kerusakan Mesin',
      'Filter Data Berdasarkan Lini Produksi dan Rentang Waktu Audit',
    ],
    featuresEn: [
      'Real-time Operational Telemetry and Machine Health Tracking',
      'Performance Analytics & Preventive Maintenance Indicators',
      'Early Warning Alert System to Mitigate Equipment Breakdown',
      'Production Line Filtering and Historical Audit Ranges',
    ],
  },
]

const TESTIMONIALS_DATA = [
  {
    name: 'Gilbert Gamas',
    role: 'Junior Fullstack Developer',
    text: 'Fadal adalah partner yang sangat baik untuk diajak bekerja sama. Kami mengerjakan banyak proyek bersama selama kuliah. Dedikasi dan skill coding-nya luar biasa, selalu memberikan hasil yang bersih dan fungsional.',
  },
  {
    name: 'Annisa Dewi',
    role: 'Koordinator Asisten Lab',
    text: 'Bekerja dengan Fadil pada sistem lab sangat menyenangkan. Dia punya pemahaman yang kuat tentang arsitektur sistem dan selalu menemukan solusi efisien untuk masalah yang kompleks.',
  },
  {
    name: 'Rizky Pratama',
    role: 'UI/UX Designer',
    text: 'Alif adalah salah satu developer paling berdedikasi yang saya kenal. Dia sangat memperhatikan detail dan selalu memastikan produk akhir sesuai dengan desain dengan sempurna.',
  },
]

function ContactForm({ lang }: { lang: Lang }) {
  const [sent, setSent] = useState(false)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }
  if (sent)
    return (
      <div className="sent">
        <div className="check">✓</div>
        <h3>{lang === 'id' ? '✦ Pesan berhasil dikirim!' : '✦ Message sent successfully!'}</h3>
        <p style={{ margin: 0, fontSize: 13, color: '#bbb' }}>
          {lang === 'id'
            ? 'Terima kasih telah menghubungi saya. Saya akan membalas secepatnya!'
            : 'Thanks for reaching out! I will get back to you as soon as possible.'}
        </p>
        <button className="btn" style={{ marginTop: 8 }} onClick={() => setSent(false)}>
          {lang === 'id' ? 'Kirim Pesan Lain' : 'Send Another'}
        </button>
      </div>
    )
  return (
    <form className="form" onSubmit={submit}>
      <label>
        {lang === 'id' ? 'Nama Lengkap' : 'Full Name'}
        <input required placeholder={lang === 'id' ? 'Nama kamu' : 'Your name'} />
      </label>
      <label>
        Email
        <input required type="email" placeholder="you@example.com" />
      </label>
      <label>
        {lang === 'id' ? 'Pesan' : 'Message'}
        <textarea
          required
          rows={4}
          placeholder={lang === 'id' ? 'Ceritakan proyek impian kamu…' : 'Tell me about your project…'}
        />
      </label>
      <button className="btn" type="submit">
        {lang === 'id' ? 'Kirim Pesan ✦' : 'Send Message ✦'}
      </button>
    </form>
  )
}

function Showcase() {
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
      <div className="showcase home" onPointerDown={(e) => e.stopPropagation()}>
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
    <div className="showcase" onPointerDown={(e) => e.stopPropagation()}>
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

const CONTENT: Record<AppId, ReactNode> = {
  showcase: <Showcase />,
  notes: (
    <textarea
      className="notepad"
      defaultValue={`Ubuntu 24.04 LTS (Noble Numbat)
=====================================
Portofolio & Showcase Alif Fadillah Ummar
Full Stack Developer & Junior Software Engineer
Lulusan S1 Informatika UNSIKA (Cum Laude)

Spesialisasi Teknologi:
- Backend: Laravel, Node.js, Express, CodeIgniter, MySQL, PostgreSQL
- Frontend: React, Next.js, TypeScript, Tailwind CSS
- AI & Computer Vision: Python, YOLO, OpenCV
- IoT & Industri: Sensor telemetry, E-Checksheet, PM Dashboard

Tautan & Kontak:
- Email: arszalzdarker@email.com
- GitHub: https://github.com/zalzdarkent
- LinkedIn: https://linkedin.com/in/alif-fadillah-ummar-07001224b/
- Web Portofolio: https://alif-fadillah-portfolio.vercel.app

Tips Navigasi:
- Klik aplikasi di dock kiri untuk beralih antar aplikasi.
- Tekan 'Free look' di kanan atas atau klik di luar layar untuk kembali melihat meja kerja 3D!`}
    />
  ),
  credits: (
    <div className="pad">
      <p>
        <b>Design & Development</b>
        <br />
        Alif Fadillah Ummar
        <br />
        <small style={{ color: '#aaa' }}>Full Stack Developer & Junior Software Engineer</small>
      </p>
      <p style={{ marginTop: 14 }}>
        <b>Environment & Tech Stack</b>
        <br />
        Ubuntu Linux (Yaru Dark Theme)
        <br />
        Three.js 3D Interactive Room, CSS3DRenderer, React, TypeScript, Remotion.
      </p>
      <p style={{ marginTop: 14 }}>
        <b>Original Web Reference</b>
        <br />
        <a
          href="https://alif-fadillah-portfolio.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--ub-orange)' }}
        >
          alif-fadillah-portfolio.vercel.app
        </a>
      </p>
    </div>
  ),
}

function Clock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const dateStr = now.toLocaleDateString([], { month: 'short', day: 'numeric' })
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return <div className="ub-clock">{dateStr} {timeStr}</div>
}

export default function Desktop({ zoomed, onEnter }: { zoomed: boolean; onEnter: () => void }) {
  const [wins, setWins] = useState<Win[]>([{ id: 'showcase', x: 175, y: 55, z: 1, min: false }])
  const [launcher, setLauncher] = useState(false)
  const top = useRef(1)
  const root = useRef<HTMLDivElement>(null)

  const focus = (id: AppId) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, z: ++top.current, min: false } : w)))
  const open = (id: AppId) => {
    setLauncher(false)
    setWins((ws) =>
      ws.some((w) => w.id === id && !w.closing)
        ? ws.map((w) => (w.id === id ? { ...w, z: ++top.current, min: false } : w))
        : [...ws.filter((w) => w.id !== id), { id, x: 190 + ws.length * 35, y: 65 + ws.length * 25, z: ++top.current, min: false }],
    )
  }
  const close = (id: AppId) => {
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, closing: true } : w)))
    setTimeout(() => setWins((ws) => ws.filter((w) => !(w.id === id && w.closing))), 200)
  }
  const minimize = (id: AppId) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, min: true } : w)))
  const toggleMax = (id: AppId) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, max: !w.max, z: ++top.current } : w)))

  const drag = (id: AppId, e: RPE) => {
    focus(id)
    const w0 = wins.find((w) => w.id === id)!
    if (w0.max) return
    const scale = root.current!.getBoundingClientRect().width / SCREEN_W || 1
    const sx = e.clientX
    const sy = e.clientY
    let raf = 0
    const move = (ev: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() =>
        setWins((ws) =>
          ws.map((w) =>
            w.id === id
              ? {
                ...w,
                x: Math.min(SCREEN_W - 80, Math.max(60, w0.x + (ev.clientX - sx) / scale)),
                y: Math.min(SCREEN_H - 60, Math.max(32, w0.y + (ev.clientY - sy) / scale)),
              }
              : w,
          ),
        ),
      )
    }
    const up = () => {
      removeEventListener('pointermove', move)
      removeEventListener('pointerup', up)
    }
    addEventListener('pointermove', move)
    addEventListener('pointerup', up)
  }

  const live = wins.filter((w) => !w.min && !w.closing)
  const front = Math.max(0, ...live.map((w) => w.z))

  return (
    <div
      className="os"
      ref={root}
      onPointerDownCapture={() => playMouseDown()}
      onPointerUpCapture={() => playMouseUp()}
      onKeyDownCapture={(e) => playKeyClick(e.key === ' ')}
    >
      {/* Top Status Bar */}
      <div className="ub-topbar">
        <button className={`ub-activities${launcher ? ' active' : ''}`} onClick={() => setLauncher((v) => !v)}>
          Activities
        </button>
        <Clock />
        <div className="ub-status">
          <span>🔊</span>
          <span>📶</span>
          <span>🔋 100%</span>
          <span>⏻</span>
        </div>
      </div>

      {/* Ubuntu Left Dock */}
      <div className="ub-dock">
        {(Object.keys(APPS) as AppId[]).map((id) => {
          const isOpen = wins.some((w) => w.id === id && !w.closing && !w.min)
          return (
            <button
              key={id}
              className={`dock-icon${isOpen ? ' active' : ''}`}
              title={APPS[id].title}
              onClick={() => open(id)}
            >
              <Icon kind={APPS[id].icon} size={28} />
            </button>
          )
        })}
        <button
          className={`dock-icon apps-grid${launcher ? ' active' : ''}`}
          title="Show Applications"
          onClick={() => setLauncher((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            {[4, 12, 20].map((cx) =>
              [4, 12, 20].map((cy) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2" />),
            )}
          </svg>
        </button>
      </div>

      {/* Desktop App Icons */}
      <div className="icons">
        {(Object.keys(APPS) as AppId[]).map((id, i) => (
          <button
            key={id}
            className="icon"
            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            onClick={() => open(id)}
            onDoubleClick={() => open(id)}
          >
            <Icon kind={APPS[id].icon} size={36} />
            <span>{APPS[id].title.split(' - ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Windows */}
      {wins.map((w) => (
        <div
          key={w.id}
          className={`win${w.min ? ' min' : ''}${w.max ? ' max' : ''}${w.closing ? ' closing' : ''}`}
          style={
            w.max
              ? { left: 60, top: 32, width: SCREEN_W - 60, height: SCREEN_H - 32, zIndex: w.z, borderRadius: 0 }
              : { left: w.x, top: w.y, width: APPS[w.id].w, height: APPS[w.id].h, zIndex: w.z }
          }
          onPointerDown={() => w.z !== front && focus(w.id)}
        >
          <div
            className={`title${w.z === front ? '' : ' idle'}`}
            onPointerDown={(e) => drag(w.id, e)}
            onDoubleClick={() => toggleMax(w.id)}
          >
            <div className="win-title-text">{APPS[w.id].title}</div>
            <div className="win-controls">
              <button
                className="win-btn min"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => minimize(w.id)}
                aria-label="Minimize"
              >
                −
              </button>
              <button
                className="win-btn max"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => toggleMax(w.id)}
                aria-label="Maximize"
              >
                □
              </button>
              <button
                className="win-btn close"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => close(w.id)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="body">{CONTENT[w.id]}</div>
        </div>
      ))}

      {/* Ubuntu Activities / App Launcher Overlay */}
      {launcher && (
        <div className="ub-launcher" onClick={() => setLauncher(false)}>
          <div className="ub-launcher-box" onClick={(e) => e.stopPropagation()}>
            <h3>Applications</h3>
            <div className="ub-launcher-grid">
              {(Object.keys(APPS) as AppId[]).map((id) => (
                <button key={id} className="ub-launcher-item" onClick={() => open(id)}>
                  <Icon kind={APPS[id].icon} size={48} />
                  <span>{APPS[id].title.split(' - ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {!zoomed && <div className="shield" onClick={onEnter} />}
    </div>
  )
}
