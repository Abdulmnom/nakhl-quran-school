import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Power, X } from 'lucide-react'
import Logo from './Logo'
import { opening } from '../data/project'
import { site } from '../data/site'
import { img } from '../data/gallery'

/** معرّف مشترك تنتقل به صورة الشيخ من الشاشة الافتتاحية إلى الشريط العلوي */
export const SHEIKH_LAYOUT_ID = 'opening-sheikh-photo'

const STORAGE_KEY = 'nakhl-site-activated'

export function readActivated() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function saveActivated() {
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* التخزين غير متاح */
  }
}

const words = opening.text.split(' ')

/** الشاشة الافتتاحية: كلمة سماحة الشيخ مع زر تفعيل الموقع */
export function OpeningOverlay({ onActivate }: { onActivate: () => void }) {
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const activate = () => {
    if (pressed) return
    setPressed(true)
    saveActivated()
    // نترك المفتاح ينزلق ويطلق الموجة الذهبية قبل أن تطير الصورة
    setTimeout(onActivate, 650)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto bg-brand-900 text-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, delay: 0.15 } }}
      role="dialog"
      aria-modal="true"
      aria-label={opening.title}
    >
      {/* خلفية متحركة */}
      <div className="pointer-events-none fixed inset-0">
        <img src={img('render-aerial')} alt="" className="h-full w-full object-cover opacity-15 blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900/80 via-brand-900/90 to-brand-900" />
        <motion.div
          className="absolute top-1/3 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/15 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-gold-300"
            style={{ left: `${(i * 53) % 100}%`, top: `${(i * 37) % 100}%` }}
            animate={{ y: [0, -40, 0], opacity: [0, 0.9, 0] }}
            transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-center gap-8 px-5 pt-10 pb-32 md:flex-row md:gap-14">
        {/* الصورة */}
        <motion.div
          className="relative shrink-0"
          initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.2 }}
        >
          {/* الإطار الذهبي ينفجر للخارج لحظة انطلاق الصورة */}
          <motion.div
            className="absolute -inset-3"
            animate={pressed ? { opacity: 0, scale: 1.6 } : { opacity: 1, scale: 1 }}
            transition={{ delay: pressed ? 0.5 : 0, duration: 0.45, ease: 'easeOut' }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: 'conic-gradient(from 0deg, transparent, var(--color-gold-300), transparent 40%, var(--color-gold-500), transparent 75%)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-2 rounded-full bg-brand-900" />
          </motion.div>
          <AnimatePresence>
            {!pressed && (
              <motion.span
                className="absolute -inset-6 rounded-full border border-gold-300/40"
                animate={{ scale: [1, 1.12, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2.4, repeat: Infinity }}
                exit={{ opacity: 0 }}
              />
            )}
          </AnimatePresence>
          <motion.img
            layoutId={SHEIKH_LAYOUT_ID}
            src={img(opening.image)}
            alt={opening.speaker}
            className="relative h-48 w-48 rounded-full border-4 border-gold-300 object-cover shadow-2xl shadow-black/40 sm:h-60 sm:w-60 md:h-72 md:w-72"
            transition={{ type: 'spring', stiffness: 70, damping: 15, mass: 1.1 }}
            style={{ borderRadius: '9999px' }}
          />
        </motion.div>

        {/* الكلمة */}
        <motion.div
          className="max-w-xl text-center md:text-right"
          animate={pressed ? { opacity: 0, y: -20, filter: 'blur(8px)' } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5 }}
        >
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center justify-center gap-3 md:justify-start">
            <Logo variant="white" className="h-10 w-auto" />
            <span className="text-sm text-sand-100/80">{site.name}</span>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-5 font-quran text-lg text-gold-300">
            {site.basmala}
          </motion.p>
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="mt-1 font-kufi text-2xl font-bold md:text-3xl">
            {opening.title}
          </motion.h1>

          <p className="mt-4 font-quran text-xl leading-10 text-sand-50 md:text-2xl md:leading-[2.9rem]">
            «
            {words.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.7 + i * 0.045, duration: 0.4 }}
                className="inline-block"
              >
                {w}&nbsp;
              </motion.span>
            ))}
            »
          </p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 + words.length * 0.045 }}>
            <p className="mt-4 font-semibold text-gold-300">{opening.speaker}</p>
            <p className="text-sm text-sand-100/70">{opening.role}</p>
          </motion.div>
        </motion.div>
      </div>

      {/* زر التفعيل */}
      <motion.div
        className="fixed inset-x-0 bottom-6 z-10 flex justify-center px-5 md:bottom-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 120, damping: 14 }}
      >
        <div className="relative">
          {!pressed && (
            <motion.span
              className="absolute inset-0 rounded-full bg-gold-500/40"
              animate={{ scale: [1, 1.25], opacity: [0.6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          )}
          {pressed && (
            <motion.span
              className="pointer-events-none absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold-300"
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 30, opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            />
          )}
          <button
            onClick={activate}
            aria-pressed={pressed}
            className={`relative flex w-72 items-center rounded-full border border-gold-300/60 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-md transition-colors duration-500 sm:w-80 ${
              pressed ? 'justify-end bg-brand-700/95' : 'justify-start bg-brand-800/90'
            }`}
          >
            <motion.span
              layout
              className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-300 to-gold-500 text-brand-900 shadow-lg"
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            >
              <Power className="h-6 w-6" strokeWidth={2.6} />
            </motion.span>
            <span className="absolute inset-0 grid place-items-center px-16 font-semibold">
              {pressed ? (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gold-300">
                  تم التفعيل ✦
                </motion.span>
              ) : (
                'اضغط لتفعيل الموقع'
              )}
            </span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/** نافذة تعرض الكلمة مرة أخرى عند الضغط على صورة الشيخ في الشريط العلوي */
export function OpeningModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-brand-900/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={opening.title}
        >
          <motion.div
            className="relative w-full max-w-lg rounded-3xl border border-gold-300/70 bg-sand-50 p-6 pt-20 text-center shadow-2xl"
            initial={{ y: 40, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={img(opening.image)}
              alt={opening.speaker}
              className="absolute -top-14 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full border-4 border-gold-300 object-cover shadow-lg"
            />
            <button onClick={onClose} className="absolute top-3 left-3 grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-sand-200" aria-label="إغلاق">
              <X className="h-5 w-5" />
            </button>
            <p className="text-sm font-medium text-gold-600">{opening.title}</p>
            <blockquote className="mt-3 font-quran text-xl leading-10 text-brand-900">«{opening.text}»</blockquote>
            <p className="mt-4 font-semibold text-brand-800">{opening.speaker}</p>
            <p className="text-sm text-muted">{opening.role}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
