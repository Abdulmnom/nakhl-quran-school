import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Expand } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Lightbox from '../components/Lightbox'
import { gallery, galleryCategories, img, type GalleryCategory } from '../data/gallery'

export default function Gallery() {
  const [cat, setCat] = useState<'all' | GalleryCategory>('all')
  const [open, setOpen] = useState<number | null>(null)

  const items = useMemo(() => (cat === 'all' ? gallery : gallery.filter((g) => g.category === cat)), [cat])

  return (
    <>
      <PageHeader title="معرض الصور" subtitle="استعرض صور المدرسة ومرافقها وأنشطتها" />

      <div className="mx-auto max-w-6xl px-4">
        <div role="tablist" aria-label="تصنيفات الصور" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {galleryCategories.map((c) => {
            const active = c.id === cat
            const count = c.id === 'all' ? gallery.length : gallery.filter((g) => g.category === c.id).length
            return (
              <button
                key={c.id}
                role="tab"
                aria-selected={active}
                onClick={() => setCat(c.id)}
                className={`relative shrink-0 rounded-full px-5 py-2 text-sm font-medium transition ${
                  active ? 'text-white' : 'border border-sand-300 bg-white text-brand-800 hover:bg-sand-50'
                }`}
              >
                {active && <motion.span layoutId="tab-bg" className="absolute inset-0 rounded-full bg-brand-700" />}
                <span className="relative">
                  {c.label} <span className={active ? 'text-gold-300' : 'text-muted'}>({count})</span>
                </span>
              </button>
            )
          })}
        </div>

        <motion.div layout className="mt-5 grid grid-cols-2 gap-3 pb-10 md:grid-flow-dense md:grid-cols-3 md:gap-4">
          <AnimatePresence mode="popLayout">
            {items.map((g, i) => (
              <motion.button
                layout
                key={g.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.22 }}
                onClick={() => setOpen(i)}
                className={`group relative overflow-hidden rounded-2xl bg-sand-200 text-right shadow-sm ${
                  i % 6 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
                aria-label={`عرض صورة: ${g.title}`}
              >
                <img
                  src={img(g.image, i % 6 === 0 ? 'lg' : 'sm')}
                  alt={g.title}
                  loading="lazy"
                  className="aspect-[4/3] h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/75 via-transparent to-transparent opacity-90" />
                <span className="absolute top-2 left-2 grid h-8 w-8 place-items-center rounded-full bg-white/80 text-brand-800 opacity-0 transition group-hover:opacity-100">
                  <Expand className="h-4 w-4" />
                </span>
                <span className="absolute inset-x-0 bottom-0 p-3 text-sm font-medium text-white">{g.title}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <Lightbox items={items} index={open} onChange={setOpen} />
    </>
  )
}
