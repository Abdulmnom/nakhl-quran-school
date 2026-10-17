import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { img, type GalleryItem } from '../data/gallery'

type Props = {
  items: GalleryItem[]
  index: number | null
  onChange: (i: number | null) => void
}

export default function Lightbox({ items, index, onChange }: Props) {
  const open = index !== null
  const item = open ? items[index] : null

  // RTL: «التالي» نحو اليسار
  const next = useCallback(() => {
    if (index === null) return
    onChange((index + 1) % items.length)
  }, [index, items.length, onChange])
  const prev = useCallback(() => {
    if (index === null) return
    onChange((index - 1 + items.length) % items.length)
  }, [index, items.length, onChange])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null)
      if (e.key === 'ArrowLeft') next()
      if (e.key === 'ArrowRight') prev()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, next, prev, onChange])

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col bg-brand-900/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          onClick={() => onChange(null)}
        >
          <div className="flex items-center justify-between px-4 py-4 text-white">
            <span className="text-sm text-sand-200">
              {index! + 1} / {items.length}
            </span>
            <button
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"
              aria-label="إغلاق"
              onClick={() => onChange(null)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-4" onClick={(e) => e.stopPropagation()}>
            <motion.img
              key={item.id}
              src={img(item.image)}
              alt={item.title}
              className="max-h-[70dvh] w-auto max-w-full rounded-2xl shadow-2xl"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) next()
                else if (info.offset.x > 60) prev()
              }}
            />
            <button
              onClick={prev}
              aria-label="السابق"
              className="absolute right-3 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25 md:right-8"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <button
              onClick={next}
              aria-label="التالي"
              className="absolute left-3 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25 md:left-8"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </div>

          <div className="px-4 pb-10 pt-4 text-center text-lg font-semibold text-white">{item.title}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
