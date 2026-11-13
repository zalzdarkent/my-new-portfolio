import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import type { AppId } from '../../types/portfolio'

interface Entry {
  cmd?: string
  out: string
}

const NEOFETCH = `            .-/+oossssoo+/-.               alif@ubuntu
        \`:+ssssssssssssssssss+:\`           -----------
      -+ssssssssssssssssssyyssss+-         OS: Ubuntu 24.04 LTS (Noble Numbat)
    .ossssssssssssssssssdMMMNysssso.       Host: Gigabyte Interactive Desk 3D
   /ssssssssssshdmmNNmmyNMMMMhssssss/      Kernel: 6.8.0-portfolio-generic
  +ssssssssshmydMMMMMMMNddddyssssssss+     Shell: bash 5.2.21
 /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/    DE: GNOME (Three.js Embedded)
.ssssssssdMMMNhsssssssssshNMMMdssssssss.   CPU: Full Stack Engine (Laravel / React)
+sssshhhyNMMNyssssssssssssyNMMMysssssss+   Memory: 16384 MiB
ossyNMMMNyMMhsssssssssssssshmmmhssssssso
ossyNMMMNyMMhsssssssssssssshmmmhssssssso   Role: Full Stack Developer
+sssshhhyNMMNyssssssssssssyNMMMysssssss+   GitHub: github.com/zalzdarkent`

const HELP_TEXT = `Perintah yang tersedia:
  help              Tampilkan daftar perintah
  neofetch          Tampilkan info sistem Ubuntu
  whoami            Info singkat pemilik portofolio
  ls                Daftar file & aplikasi
  cat readme.txt    Baca catatan portofolio
  skills            Daftar keahlian utama
  contact           Info kontak & tautan
  open <app>        Buka aplikasi (showcase, browser, notes, calculator, settings, credits)
  date              Tanggal & waktu saat ini
  uname -a          Info kernel
  echo <teks>       Cetak teks
  clear             Bersihkan terminal`

export default function TerminalApp({ onOpenApp }: { onOpenApp: (id: AppId) => void }) {
  const [entries, setEntries] = useState<Entry[]>([
    { out: 'Ubuntu 24.04 LTS — Alif Fadillah Ummar Terminal\nKetik "help" untuk melihat daftar perintah.\n' },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [entries])

  const runCommand = (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) {
      setEntries((prev) => [...prev, { cmd: '', out: '' }])
      return
    }
    setHistory((h) => [trimmed, ...h])
    setHistIdx(-1)

    const [cmd, ...args] = trimmed.split(/\s+/)
    const lower = cmd.toLowerCase()
    const argStr = args.join(' ')
    let out = ''

    switch (lower) {
      case 'clear':
        setEntries([])
        return
      case 'help':
        out = HELP_TEXT
        break
      case 'neofetch':
        out = NEOFETCH
        break
      case 'whoami':
        out = 'Alif Fadillah Ummar — Full Stack Developer & Junior Software Engineer (S1 Informatika UNSIKA, Cum Laude)'
        break
      case 'ls':
        out = 'Desktop/  Documents/  Projects/  readme.txt  showcase.app  browser.app  calculator.app  settings.app'
        break
      case 'cat':
        if (argStr.toLowerCase() === 'readme.txt') {
          out = 'Portofolio & Showcase Alif Fadillah Ummar\nSpesialis Laravel, React, Next.js, CodeIgniter, Node.js, Python (YOLO/OpenCV), dan IoT.'
        } else {
          out = `cat: ${argStr || '(kosong)'}: No such file or directory`
        }
        break
      case 'skills':
        out = 'Backend : Laravel, Node.js, Express, CodeIgniter, MySQL, PostgreSQL\nFrontend: React, Next.js, TypeScript, Tailwind CSS\nAI & IoT: Python, YOLO, OpenCV, Sensor Telemetry, E-Checksheet'
        break
      case 'contact':
        out = 'Email    : arszalzdarker@email.com\nGitHub   : https://github.com/zalzdarkent\nLinkedIn : https://linkedin.com/in/alif-fadillah-ummar-07001224b/\nWeb      : https://alif-fadillah-portfolio.vercel.app'
        break
      case 'date':
        out = new Date().toString()
        break
      case 'uname':
        out = 'Linux ubuntu 6.8.0-portfolio-generic #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux'
        break
      case 'echo':
        out = argStr
        break
      case 'open': {
        const target = argStr.toLowerCase() as AppId
        const valid: AppId[] = ['showcase', 'terminal', 'browser', 'notes', 'calculator', 'settings', 'credits']
        if (valid.includes(target)) {
          onOpenApp(target)
          out = `Membuka ${target}...`
        } else {
          out = `Aplikasi tidak ditemukan: "${argStr}". Coba: ${valid.join(', ')}`
        }
        break
      }
      default:
        out = `${cmd}: command not found. Ketik "help" untuk bantuan.`
    }

    setEntries((prev) => [...prev, { cmd: trimmed, out }])
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    runCommand(input)
    setInput('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(histIdx + 1, history.length - 1)
      if (history[next] !== undefined) {
        setHistIdx(next)
        setInput(history[next])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = histIdx - 1
      if (next < 0) {
        setHistIdx(-1)
        setInput('')
      } else {
        setHistIdx(next)
        setInput(history[next])
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-[#300a24] text-[#f2f2f2] font-[monospace] text-[13px] leading-[1.5] p-3! overflow-y-auto cursor-text"
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
    >
      {entries.map((entry, i) => (
        <div key={i} className="mb-1.5!">
          {entry.cmd !== undefined && (
            <div>
              <span className="text-[#8ae234] font-bold">alif@ubuntu</span>
              <span className="text-white">:</span>
              <span className="text-[#729fcf] font-bold">~</span>
              <span className="text-white">$ {entry.cmd}</span>
            </div>
          )}
          {entry.out && <pre className="whitespace-pre-wrap break-words m-0! text-[#e6e6e6]">{entry.out}</pre>}
        </div>
      ))}
      <form onSubmit={handleSubmit} className="flex items-center gap-1">
        <span className="text-[#8ae234] font-bold">alif@ubuntu</span>
        <span className="text-white">:</span>
        <span className="text-[#729fcf] font-bold">~</span>
        <span className="text-white">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-0 outline-none text-white font-[monospace] text-[13px] caret-[#E95420]"
          spellCheck={false}
          aria-label="Terminal command input"
        />
      </form>
    </div>
  )
}
