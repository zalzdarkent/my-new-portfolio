import { useState, type FormEvent } from 'react'
import type { Lang } from '../../types/portfolio'

export default function ContactForm({ lang }: { lang: Lang }) {
  const [sent, setSent] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  if (sent) {
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
  }

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

