import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Logo from '../components/Logo'
import { site } from '../data/site'
import { img } from '../data/gallery'

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: 'easeOut' as const },
})

export default function Splash() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-sand-100 lg:grid lg:grid-cols-2">
      {/* الصورة (حاسوب) */}
      <div className="relative hidden lg:block">
        <img src={img('hero')} alt="مبنى مدرسة نخل الوقفية للقرآن الكريم" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-sand-100 via-brand-900/10 to-brand-900/40" />
        <div className="absolute bottom-10 right-10 left-10 text-white">
          <p className="font-quran text-4xl leading-relaxed drop-shadow">«{site.hadith.text}»</p>
          <p className="mt-1 text-sand-100/90">{site.hadith.source}</p>
        </div>
      </div>

      {/* البطاقة */}
      <div className="pattern-bg relative flex min-h-dvh items-center justify-center px-5 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-md"
        >
          {/* إطار القوس */}
          <div className="relative overflow-hidden rounded-t-[11rem] rounded-b-3xl border border-gold-300/70 bg-sand-50 px-7 pt-16 pb-9 text-center shadow-[0_30px_60px_-30px_rgba(16,50,42,0.35)]">
            <div className="pointer-events-none absolute inset-3 rounded-t-[10rem] rounded-b-2xl border border-gold-300/40" />

            <motion.div {...fade(0.15)} className="mx-auto mb-2">
              <Logo variant="full" className="mx-auto h-44 w-auto sm:h-52" />
            </motion.div>

            <motion.h1 {...fade(0.25)} className="sr-only">
              {site.name}
            </motion.h1>
            <motion.p {...fade(0.3)} className="mt-1 text-base font-medium text-gold-600">
              {site.subtitle}
            </motion.p>

            <motion.div {...fade(0.4)} className="mx-auto my-6 flex items-center gap-3 text-gold-500">
              <span className="h-px flex-1 bg-gradient-to-l from-gold-300 to-transparent" />
              <span>✦</span>
              <span className="h-px flex-1 bg-gradient-to-r from-gold-300 to-transparent" />
            </motion.div>

            <motion.div {...fade(0.5)} className="font-quran">
              <p className="text-lg text-muted">{site.basmala}</p>
              <p className="mt-2 text-sm text-muted">{site.hadith.intro}</p>
              <p className="mt-1 text-2xl font-bold text-brand-700">«{site.hadith.text}»</p>
              <p className="mt-1 text-xs text-muted">{site.hadith.source}</p>
            </motion.div>

            <motion.p {...fade(0.6)} className="mt-6 text-[15px] leading-8 text-ink/80">
              {site.welcome}
            </motion.p>

            <motion.div {...fade(0.75)}>
              <Link
                to="/home"
                className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-brand-900/20 transition hover:bg-brand-800"
              >
                الدخول إلى المنصة
                <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              </Link>
            </motion.div>
          </div>

          <motion.p {...fade(0.9)} className="mt-6 text-center font-ruqaa text-3xl leading-normal text-gold-600 sm:text-4xl">
            {site.tagline}
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
