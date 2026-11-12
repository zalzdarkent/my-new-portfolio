import { useState, type FormEvent } from 'react'
import type { Lang } from '../../types/portfolio'

const BTN = 'rounded-md bg-ub-orange! px-5! py-2.5! font-semibold text-white! transition-opacity duration-200 ease-[ease] hover:opacity-90'
const FIELD =
  'mt-1.5! w-full rounded-md border-0 bg-[#181818] px-3! py-2.5! text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)] outline-none [font:inherit] focus:shadow-[inset_0_0_0_2px_var(--ub-orange)]'
const LABEL = 'mb-3.5! block text-[13px] text-[#ddd]'

export default function ContactForm({ lang }: { lang: Lang }) {
  const [sent, setSent] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-lg bg-[#262626] p-5!">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#2eb872] text-[20px] font-bold text-white">✓</div>
        <h3 className="mt-[22px]! mb-2.5! border-b border-white/8 pb-1.5! text-[15px] font-semibold text-white text-balance">{lang === 'id' ? '✦ Pesan berhasil dikirim!' : '✦ Message sent successfully!'}</h3>
        <p className="max-w-[72ch] text-[13px] leading-[1.6] text-[#bbb] text-pretty">
          {lang === 'id'
            ? 'Terima kasih telah menghubungi saya. Saya akan membalas secepatnya!'
            : 'Thanks for reaching out! I will get back to you as soon as possible.'}
        </p>
        <button className={`${BTN} mt-2!`} onClick={() => setSent(false)}>
          {lang === 'id' ? 'Kirim Pesan Lain' : 'Send Another'}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit}>
      <label className={LABEL}>
        {lang === 'id' ? 'Nama Lengkap' : 'Full Name'}
        <input className={FIELD} required placeholder={lang === 'id' ? 'Nama kamu' : 'Your name'} />
      </label>
      <label className={LABEL}>
        Email
        <input className={FIELD} required type="email" placeholder="you@example.com" />
      </label>
      <label className={LABEL}>
        {lang === 'id' ? 'Pesan' : 'Message'}
        <textarea
          className={FIELD}
          required
          rows={4}
          placeholder={lang === 'id' ? 'Ceritakan proyek impian kamu…' : 'Tell me about your project…'}
        />
      </label>
      <button className={BTN} type="submit">
        {lang === 'id' ? 'Kirim Pesan ✦' : 'Send Message ✦'}
      </button>
    </form>
  )
}

