import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { ExternalLink, HandHeart, Landmark, Phone, Share2, Sprout } from 'lucide-react'
import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import CopyField from '../components/CopyField'
import FundingClock from '../components/FundingClock'
import { donation, qrPayload } from '../data/donation'
import { site } from '../data/site'
import { img } from '../data/gallery'

export default function Donate() {
  const [shared, setShared] = useState(false)

  const share = async () => {
    const data = { title: site.name, text: `${donation.headline} — ${donation.subline}`, url: window.location.href }
    try {
      if (navigator.share) await navigator.share(data)
      else {
        await navigator.clipboard.writeText(data.url)
        setShared(true)
        setTimeout(() => setShared(false), 1800)
      }
    } catch {
      /* أُلغيت المشاركة */
    }
  }

  return (
    <>
      <PageHeader title="السهم الوقفي" subtitle="بسهمك نُكمل البناء .. ونفتح للأجيال أبواب القرآن" />

      <div className="mx-auto max-w-6xl px-4 pb-12">
        {/* البانر */}
        <section className="relative overflow-hidden rounded-3xl bg-brand-800 text-white">
          <img src={img('render-aerial')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-l from-brand-900/95 via-brand-800/80 to-brand-700/50" />
          <div className="relative p-6 md:p-10">
            <Sprout className="h-9 w-9 text-gold-300" />
            <h2 className="mt-3 max-w-lg font-kufi text-2xl font-bold leading-snug md:text-4xl">{donation.headline}</h2>
            <p className="mt-2 font-ruqaa text-3xl text-gold-300 md:text-4xl">{donation.subline}</p>
            <div className="mt-5 grid max-w-2xl gap-3 font-quran text-lg leading-8 text-sand-100/90 sm:grid-cols-2">
              <p>
                قال تعالى: ﴿{donation.verse.text}﴾ <span className="text-sm text-sand-100/60">[{donation.verse.source}]</span>
              </p>
              <p>
                قال رسول الله ﷺ: «{donation.hadith.text}» <span className="text-sm text-sand-100/60">{donation.hadith.source}</span>
              </p>
            </div>
          </div>
        </section>

        {/* قيمة السهم */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          {donation.shares.map((s, i) => (
            <motion.div
              key={s.who}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="relative overflow-hidden rounded-3xl border border-gold-300/70 bg-white p-6 text-center shadow-sm"
            >
              <div className="absolute inset-x-0 top-0 bg-brand-700 py-2 text-sm font-semibold text-white">{s.who}</div>
              <div className="mt-9 font-kufi text-7xl font-bold leading-none text-gold-500">{s.price}</div>
              <div className="mt-2 font-semibold text-brand-800">{s.unit}</div>
            </motion.div>
          ))}
        </section>

        {/* الساعة المالية */}
        <section className="mt-8 rounded-3xl border border-sand-200 bg-sand-50 p-5 md:p-8">
          <h3 className="font-kufi text-2xl font-bold text-brand-800 md:text-3xl">الساعة المالية للمشروع</h3>
          <p className="mb-6 mt-1 text-sm text-muted">بناء مدرسة نخل الوقفية للقرآن الكريم والوقف</p>
          <FundingClock />
        </section>

        <div className="mt-6 grid gap-5 lg:grid-cols-5">
          {/* بيانات الحساب */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-sand-200 bg-white p-5 shadow-sm md:p-6 lg:col-span-3"
          >
            <div className="mb-2 flex items-center gap-2">
              <Landmark className="h-5 w-5 text-gold-600" />
              <h3 className="text-lg font-bold text-brand-800">الحساب البنكي</h3>
            </div>
            <CopyField label="اسم الحساب" value={donation.accountName} />
            <CopyField label="اسم البنك" value={donation.bankName} />
            <CopyField label="رقم الحساب" value={donation.accountNumber} ltr />
            <a
              href={`tel:+968${donation.phone}`}
              className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-brand-700 p-4 text-white transition hover:bg-brand-800"
            >
              <span className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-gold-500 text-brand-900">
                  <Phone className="h-5 w-5" />
                </span>
                <span className="text-sm leading-6">للتواصل وشراء السهم الوقفي</span>
              </span>
              <span dir="ltr" className="font-kufi text-2xl font-bold tracking-wider text-gold-300">
                {donation.phone}
              </span>
            </a>
          </motion.section>

          {/* QR */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="flex flex-col items-center rounded-3xl border border-sand-200 bg-white p-5 text-center shadow-sm md:p-6 lg:col-span-2"
          >
            <h3 className="text-lg font-bold text-brand-800">امسح رمز QR</h3>
            <p className="mt-1 text-sm text-muted">للوصول السريع إلى بيانات الحساب</p>
            <div className="mt-4 rounded-2xl border-2 border-dashed border-gold-300 bg-sand-50 p-4">
              <QRCodeSVG value={qrPayload()} size={176} fgColor="#10322A" bgColor="transparent" level="M" />
            </div>

            <div className="mt-5 grid w-full gap-2">
              {donation.bankAppUrl && (
                <a
                  href={donation.bankAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-5 py-3 font-semibold text-white transition hover:bg-brand-800"
                >
                  <ExternalLink className="h-4 w-4" />
                  فتح تطبيق البنك
                </a>
              )}
              <button
                onClick={share}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-sand-300 bg-white px-5 py-3 font-medium text-brand-800 transition hover:bg-sand-50"
              >
                <Share2 className="h-4 w-4" />
                {shared ? 'تم نسخ الرابط' : 'شارك الأجر'}
              </button>
            </div>
          </motion.section>
        </div>

        {/* مجالات الدعم */}
        <section className="mt-8">
          <h3 className="text-xl font-bold text-brand-800">أين يذهب سهمك؟</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {donation.ways.map((w, i) => (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
                className="rounded-2xl border border-sand-200 bg-white p-5 shadow-sm"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-100 text-gold-600">
                  <HandHeart className="h-5 w-5" />
                </span>
                <h4 className="mt-3 font-semibold text-brand-800">{w.title}</h4>
                <p className="mt-1 text-sm leading-6 text-muted">{w.text}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
