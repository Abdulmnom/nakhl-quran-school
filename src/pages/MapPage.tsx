import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { CheckCircle2, ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import SchoolMap, { facilityIcons } from '../components/SchoolMap'
import { facilities, type FacilityKind } from '../data/facilities'
import { img } from '../data/gallery'

export default function MapPage() {
  const [selected, setSelected] = useState<FacilityKind | null>('classes')
  const idx = facilities.findIndex((f) => f.id === selected)
  const current = idx >= 0 ? facilities[idx] : null

  const step = (d: number) => {
    const n = (Math.max(idx, 0) + d + facilities.length) % facilities.length
    setSelected(facilities[n].id)
  }

  return (
    <>
      <PageHeader title="خريطة المدرسة" subtitle="خريطة تفاعلية توضح مرافق المدرسة — اضغط على أي مرفق لعرض تفاصيله" />

      <div className="mx-auto max-w-6xl px-4 pb-10">
        {/* قائمة المرافق */}
        <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
          {facilities.map((f) => {
            const Icon = facilityIcons[f.id]
            const active = f.id === selected
            return (
              <button
                key={f.id}
                onClick={() => setSelected(f.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-brand-700 text-white shadow'
                    : 'border border-sand-300 bg-white text-brand-800 hover:bg-sand-50'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-gold-300' : 'text-brand-600'}`} />
                {f.name}
              </button>
            )
          })}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SchoolMap selected={selected} onSelect={setSelected} />
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
              <MousePointerClick className="h-3.5 w-3.5" />
              استخدم أزرار التكبير ثم اسحب الخريطة للتنقل. الخريطة توضيحية.
            </p>
          </div>

          {/* بطاقة التفاصيل */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <AnimatePresence mode="wait">
              {current && (
                <motion.article
                  key={current.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-sm"
                >
                  <div className="relative">
                    <img src={img(current.image, 'sm')} alt={current.name} className="aspect-[16/9] w-full object-cover" />
                    <span className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-brand-800">
                      {idx + 1} / {facilities.length}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2.5">
                      {(() => {
                        const Icon = facilityIcons[current.id]
                        return (
                          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
                            <Icon className="h-5 w-5" />
                          </span>
                        )
                      })()}
                      <div>
                        <h2 className="text-xl font-bold text-brand-800">{current.name}</h2>
                        <p className="text-xs text-gold-600">{current.short}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-[15px] leading-7 text-ink/80">{current.description}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {current.features.map((ft) => (
                        <li key={ft} className="inline-flex items-center gap-1 rounded-full bg-sand-100 px-3 py-1 text-xs text-brand-800">
                          <CheckCircle2 className="h-3.5 w-3.5 text-brand-500" />
                          {ft}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 flex items-center justify-between border-t border-sand-200 pt-4">
                      <button onClick={() => step(-1)} className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-900">
                        <ChevronRight className="h-4 w-4" /> السابق
                      </button>
                      <button onClick={() => step(1)} className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-900">
                        التالي <ChevronLeft className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              )}
            </AnimatePresence>
          </aside>
        </div>
      </div>
    </>
  )
}
