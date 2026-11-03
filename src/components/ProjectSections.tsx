import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  Building2,
  CalendarRange,
  Coins,
  GraduationCap,
  Home as HomeIcon,
  LandPlot,
  MapPin,
  Presentation,
  School,
  Store,
  Trophy,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { beneficiaries, capacity, costs, land, programs, quotes, timeline, waqf } from '../data/project'
import { img } from '../data/gallery'
import FundingClock from './FundingClock'

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { delay, duration: 0.55, ease: 'easeOut' as const },
})

function Heading({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <motion.div {...reveal()} className="mb-6 text-center">
      <div className="mx-auto mb-2 flex items-center justify-center gap-3 text-gold-500">
        <span className="h-px w-10 bg-gradient-to-l from-gold-300 to-transparent" />
        <span className="text-sm font-medium text-gold-600">{kicker}</span>
        <span className="h-px w-10 bg-gradient-to-r from-gold-300 to-transparent" />
      </div>
      <h2 className="font-kufi text-2xl font-bold text-brand-800 md:text-4xl">{title}</h2>
      {sub && <p className="mx-auto mt-2 max-w-2xl text-sm text-muted md:text-base">{sub}</p>}
    </motion.div>
  )
}

const stats: { icon: LucideIcon; value: string; unit: string; label: string }[] = [
  { icon: LandPlot, value: land.area.toLocaleString('en-US'), unit: 'م²', label: 'مساحة الأرض' },
  { icon: Building2, value: land.total.toLocaleString('en-US'), unit: 'م²', label: 'إجمالي مسطحات البناء' },
  { icon: School, value: String(capacity.classrooms), unit: 'قاعة', label: 'قاعات دراسية' },
  { icon: Users, value: capacity.perShift, unit: 'طالب', label: 'السعة في الفترة الواحدة' },
  { icon: CalendarRange, value: String(timeline.months), unit: 'شهراً', label: 'مدة التنفيذ' },
]

const programIcons: LucideIcon[] = [BookOpen, Presentation, School, GraduationCap, Trophy]

export default function ProjectSections() {
  const [tab, setTab] = useState(0)
  const program = programs[tab]

  return (
    <>
      {/* أرقام المشروع */}
      <section className="mt-12 md:mt-16">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
          {stats.map(({ icon: Icon, value, unit, label }, i) => (
            <motion.div
              key={label}
              {...reveal(i * 0.06)}
              className={`rounded-2xl border border-sand-200 bg-white p-4 text-center shadow-sm ${i === 4 ? 'col-span-2 md:col-span-1' : ''}`}
            >
              <Icon className="mx-auto h-7 w-7 text-gold-500" />
              <div className="mt-2 font-kufi text-2xl font-bold text-brand-800 md:text-3xl">
                {value} <span className="text-base text-gold-600">{unit}</span>
              </div>
              <div className="text-xs text-muted md:text-sm">{label}</div>
            </motion.div>
          ))}
        </div>
        <motion.p {...reveal(0.2)} className="mt-3 flex items-center justify-center gap-1.5 text-center text-sm text-muted">
          <MapPin className="h-4 w-4 text-gold-600" /> {land.plot} — {land.note}
        </motion.p>
      </section>

      {/* برامج المدرسة */}
      <section className="mt-14 md:mt-20">
        <Heading kicker="ما نقدّمه" title="برامج مدرسة نخل الوقفية للقرآن الكريم" />
        <div role="tablist" aria-label="برامج المدرسة" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:justify-center">
          {programs.map((p, i) => {
            const Icon = programIcons[i]
            const active = i === tab
            return (
              <button
                key={p.title}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(i)}
                className={`relative inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition ${
                  active ? 'text-white' : 'border border-sand-300 bg-white text-brand-800 hover:bg-sand-50'
                }`}
              >
                {active && <motion.span layoutId="program-tab" className="absolute inset-0 rounded-full bg-brand-700" />}
                <Icon className={`relative h-4 w-4 ${active ? 'text-gold-300' : 'text-gold-600'}`} />
                <span className="relative">{p.title}</span>
              </button>
            )
          })}
        </div>
        <motion.ol
          key={program.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {program.items.map((item, i) => (
            <li key={item} className="flex items-center gap-3 rounded-2xl border border-sand-200 bg-white p-4 shadow-sm">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-100 font-kufi font-bold text-gold-600">
                {i + 1}
              </span>
              <span className="font-medium text-brand-800">{item}</span>
            </li>
          ))}
        </motion.ol>
      </section>

      {/* الجهات المستفيدة */}
      <section className="mt-14 md:mt-20">
        <Heading kicker="لمن نبني؟" title="الجهات المستفيدة من إنشاء المدرسة" sub="تعليمٌ للقرآن... وبناءٌ للإنسان... وخدمةٌ للمجتمع" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {beneficiaries.map((b, i) => (
            <motion.div
              key={b.title}
              {...reveal((i % 4) * 0.06)}
              className="group rounded-2xl border border-sand-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-gold-300 hover:shadow-md md:p-5"
            >
              <span className="font-kufi text-3xl font-bold text-gold-300 transition group-hover:text-gold-500">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-1 font-semibold leading-snug text-brand-800">{b.title}</h3>
              <p className="mt-1 text-xs leading-6 text-muted md:text-sm">{b.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* الجدول الزمني */}
      <section className="mt-14 md:mt-20">
        <Heading kicker="تصور زمني مقترح" title="الجدول الزمني لبناء المشروع" sub={`${timeline.range} · ${timeline.months} شهراً`} />
        <div className="relative overflow-x-clip">
          <div className="absolute top-0 bottom-0 right-[19px] w-0.5 bg-gradient-to-b from-gold-300 via-brand-200 to-gold-500 md:right-1/2 md:translate-x-1/2" />
          <ol className="grid gap-4">
            {timeline.phases.map((p, i) => {
              const last = i === timeline.phases.length - 1
              return (
                <motion.li
                  key={p.title}
                  initial={{ opacity: 0, x: i % 2 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`relative flex items-center gap-4 md:w-1/2 ${i % 2 ? 'md:mr-auto' : ''}`}
                >
                  <span
                    className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full font-kufi font-bold shadow-md md:absolute ${
                      i % 2 ? 'md:-right-5' : 'md:-left-5'
                    } ${last ? 'bg-gold-500 text-brand-900' : 'bg-brand-700 text-gold-300'}`}
                  >
                    {i + 1}
                  </span>
                  <div
                    className={`flex-1 rounded-2xl border bg-white p-4 shadow-sm ${i % 2 ? 'md:mr-10' : 'md:ml-10'} ${
                      last ? 'border-gold-300' : 'border-sand-200'
                    }`}
                  >
                    <h3 className="font-semibold text-brand-800">{p.title}</h3>
                    <p className="mt-0.5 text-sm text-gold-600">{p.when}</p>
                    {last && <p className="mt-1 text-sm font-semibold text-brand-700">🎉 الافتتاح: {timeline.opening}</p>}
                  </div>
                </motion.li>
              )
            })}
          </ol>
        </div>
      </section>

      {/* التكلفة والساعة المالية */}
      <section className="mt-14 md:mt-20">
        <Heading kicker="الشفافية المالية" title="تقدير التكلفة المالية للمشروع" sub={costs.note} />
        <div className="grid gap-5 lg:grid-cols-2">
          <motion.div {...reveal()} className="grid content-start gap-3">
            {costs.items.map((c) => (
              <div key={c.title} className="flex items-center justify-between rounded-2xl border border-sand-200 bg-white p-4 shadow-sm">
                <span className="font-medium text-brand-800">{c.title}</span>
                <span className="font-kufi text-2xl font-bold text-gold-600">
                  {c.value} <span className="text-sm font-medium text-muted">ألف ر.ع</span>
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between rounded-2xl bg-brand-700 p-4 text-white shadow-md">
              <span className="flex items-center gap-2 font-semibold">
                <Coins className="h-5 w-5 text-gold-300" /> إجمالي الإنشاء والتأثيث
              </span>
              <span className="font-kufi text-3xl font-bold text-gold-300">
                {costs.build} <span className="text-sm font-medium text-sand-100/80">ألف ر.ع</span>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-gold-300/60 bg-gold-100/60 p-3 text-center">
                <div className="text-muted">التكلفة التشغيلية السنوية</div>
                <div className="font-kufi text-xl font-bold text-brand-800">{costs.annual} ألف ر.ع</div>
              </div>
              <div className="rounded-2xl border border-gold-300/60 bg-gold-100/60 p-3 text-center">
                <div className="text-muted">الإجمالي مع تشغيل السنة الأولى</div>
                <div className="font-kufi text-xl font-bold text-brand-800">{costs.firstYear} ألف ر.ع</div>
              </div>
            </div>
          </motion.div>
          <motion.div {...reveal(0.1)} className="rounded-3xl border border-sand-200 bg-sand-50 p-5 md:p-6">
            <h3 className="mb-4 font-kufi text-xl font-bold text-brand-800">الساعة المالية للمشروع</h3>
            <FundingClock compact />
          </motion.div>
        </div>
      </section>

      {/* المكونات الوقفية */}
      <section className="mt-14 md:mt-20">
        <Heading kicker="ريع الوقف يدعم استدامة برامج المدرسة" title="المكونات الوقفية" />
        <motion.div {...reveal()} className="overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-sm lg:grid lg:grid-cols-2">
          <img src={img('render-waqf')} alt="تصور ثلاثي الأبعاد للمبنى الوقفي" loading="lazy" className="h-64 w-full object-cover lg:h-full" />
          <div className="p-5 md:p-7">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-brand-50 p-4 text-center">
                <Store className="mx-auto h-7 w-7 text-brand-700" />
                <div className="mt-1 font-kufi text-3xl font-bold text-brand-800">{waqf.shops}</div>
                <div className="text-sm text-muted">محلات تجارية</div>
              </div>
              <div className="rounded-2xl bg-brand-50 p-4 text-center">
                <HomeIcon className="mx-auto h-7 w-7 text-brand-700" />
                <div className="mt-1 font-kufi text-3xl font-bold text-brand-800">{waqf.flats}</div>
                <div className="text-sm text-muted">شقق سكنية</div>
              </div>
            </div>
            <ul className="mt-4 grid gap-2 text-sm text-ink/80">
              {waqf.perks.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-gold-500">✦</span> {p}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      {/* قالوا عن فضل القرآن */}
      {quotes.map((q) => (
        <motion.section
          key={q.speaker}
          {...reveal()}
          className="mt-14 overflow-hidden rounded-3xl border border-gold-300/70 bg-sand-50 p-6 md:mt-20 md:flex md:items-center md:gap-8 md:p-10"
        >
          <img
            src={img(q.image)}
            alt={q.speaker}
            loading="lazy"
            className="mx-auto h-32 w-32 shrink-0 rounded-full border-4 border-gold-300 object-cover shadow-lg md:h-44 md:w-44"
          />
          <div className="mt-5 text-center md:mt-0 md:text-right">
            <p className="text-sm font-medium text-gold-600">قالوا عن فضل القرآن وفضل تعليمه</p>
            <blockquote className="mt-2 font-quran text-xl leading-10 text-brand-900 md:text-2xl md:leading-[2.8rem]">«{q.text}»</blockquote>
            <p className="mt-3 font-semibold text-brand-800">{q.speaker}</p>
            <p className="text-sm text-muted">{q.role}</p>
            <p className="mt-4 font-quran text-lg text-brand-700 md:text-xl">
              ﴿{q.verse.text}﴾ <span className="text-sm text-muted">[{q.verse.source}]</span>
            </p>
          </div>
        </motion.section>
      ))}

      <motion.div {...reveal()} className="mt-6 text-center">
        <Link to="/donate" className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-900">
          بسهمك نُكمل البناء .. ونفتح للأجيال أبواب القرآن <ArrowLeft className="h-4 w-4" />
        </Link>
      </motion.div>
    </>
  )
}
