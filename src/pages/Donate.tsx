import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { AlertTriangle, ExternalLink, HandHeart, Landmark, Share2, Sprout } from 'lucide-react'
import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import CopyField from '../components/CopyField'
import { donation, qrPayload } from '../data/donation'
import { site } from '../data/site'
import { img } from '../data/gallery'

export default function Donate() {
  const [shared, setShared] = useState(false)

  const share = async () => {
    const data = { title: site.name, text: `${donation.headline} — ${site.tagline}`, url: window.location.href }
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
      <PageHeader title="التبرع" subtitle="ساهم في استمرار رسالة المدرسة في تعليم كتاب الله" />

      <div className="mx-auto max-w-6xl px-4 pb-12">
        {/* البانر */}
        <section className="relative overflow-hidden rounded-3xl bg-brand-800 text-white">
          <img src={img('garden')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-l from-brand-900/95 via-brand-800/80 to-brand-700/50" />
          <div className="relative p-6 md:p-10">
            <Sprout className="h-9 w-9 text-gold-300" />
            <h2 className="mt-3 max-w-md text-2xl font-bold leading-snug md:text-3xl">{donation.headline}</h2>
            <p className="mt-2 text-gold-300">{donation.subline}</p>
            <p className="mt-4 max-w-lg font-quran text-lg leading-8 text-sand-100/90">
              «إذا مات الإنسان انقطع عمله إلا من ثلاث: صدقة جارية، أو علم ينتفع به، أو ولد صالح يدعو له»
            </p>
          </div>
        </section>

        {donation.isPlaceholder && (
          <div className="mt-4 flex items-start gap-2 rounded-2xl border border-gold-300 bg-gold-100 p-3 text-sm text-gold-600">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            البيانات البنكية المعروضة تجريبية للعرض فقط، وستُستبدل بالبيانات الرسمية.
          </div>
        )}

        <div className="mt-6 grid gap-5 lg:grid-cols-5">
          {/* بيانات الحساب */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-sand-200 bg-white p-5 shadow-sm md:p-6 lg:col-span-3"
          >
            <div className="mb-2 flex items-center gap-2">
              <Landmark className="h-5 w-5 text-gold-600" />
              <h3 className="text-lg font-bold text-brand-800">بيانات الحساب البنكي</h3>
            </div>
            <CopyField label="اسم الحساب" value={donation.accountName} />
            <CopyField label="اسم البنك" value={donation.bankName} />
            <CopyField label="رقم الحساب" value={donation.accountNumber} ltr />
            <CopyField label="IBAN" value={donation.iban} ltr />
            <CopyField label="SWIFT" value={donation.swift} ltr />
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
          <h3 className="text-xl font-bold text-brand-800">أين تذهب مساهمتك؟</h3>
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
