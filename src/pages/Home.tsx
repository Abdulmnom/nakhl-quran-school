import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, HandHeart, MapPin, Phone } from 'lucide-react'
import { site } from '../data/site'
import { gallery, img } from '../data/gallery'
import { navItems } from '../components/nav'

const quick = navItems.filter((n) => n.to !== '/home')

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 md:pt-8">
      {/* البطل */}
      <section className="relative overflow-hidden rounded-3xl shadow-xl shadow-brand-900/10">
        <img
          src={img('hero')}
          alt="مبنى مدرسة نخل للقرآن الكريم"
          className="h-[300px] w-full object-cover sm:h-[380px] md:h-[460px]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-gold-300"
          >
            {site.tagline}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-1 text-3xl font-bold leading-tight md:text-5xl"
          >
            {site.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-2 max-w-xl text-sand-100/90 md:text-lg"
          >
            تعليم القرآن الكريم ... بناء للأجيال
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Link
              to="/donate"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 font-semibold text-brand-900 shadow-lg transition hover:bg-gold-300"
            >
              <HandHeart className="h-5 w-5" />
              ساهم بالتبرع
            </Link>
          </motion.div>
        </div>
      </section>

      {/* وصول سريع */}
      <section className="mt-6 grid grid-cols-3 gap-3 md:mt-8 md:gap-5">
        {quick.map(({ to, label, desc, icon: Icon }, i) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.07 }}
          >
            <Link
              to={to}
              className="group flex h-full flex-col items-center gap-2 rounded-2xl border border-sand-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-md md:flex-row md:gap-4 md:p-6 md:text-right"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-700 group-hover:text-white md:h-14 md:w-14">
                <Icon className="h-6 w-6" />
              </span>
              <span>
                <span className="block font-semibold text-brand-800 md:text-lg">
                  {label === 'الصور' ? 'معرض الصور' : label === 'الخريطة' ? 'خريطة المدرسة' : label}
                </span>
                <span className="mt-0.5 hidden text-xs text-muted sm:block md:text-sm">{desc}</span>
              </span>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* عن المدرسة */}
      <section className="mt-8 grid gap-6 md:mt-12 md:grid-cols-5 md:gap-10">
        <div className="md:col-span-3">
          <div className="flex items-center gap-2 text-gold-600">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm font-medium">تعريف بالمدرسة</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold text-brand-800 md:text-3xl">{site.about.title}</h2>
          <p className="mt-3 text-[15px] leading-8 text-ink/85 md:text-lg md:leading-9">{site.about.short}</p>
          {site.about.long.map((p) => (
            <p key={p} className="mt-3 text-[15px] leading-8 text-muted">
              {p}
            </p>
          ))}

          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <a
              href={site.contact.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-sand-300 bg-white px-3.5 py-2 text-brand-800 hover:bg-sand-50"
            >
              <MapPin className="h-4 w-4 text-gold-600" />
              {site.contact.location}
            </a>
            <a
              href={`tel:${site.contact.phone.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-sand-300 bg-white px-3.5 py-2 text-brand-800 hover:bg-sand-50"
            >
              <Phone className="h-4 w-4 text-gold-600" />
              <span dir="ltr">{site.contact.phone}</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:col-span-2">
          {site.programs.map((p) => (
            <div key={p.title} className="rounded-2xl border border-sand-200 bg-white p-4 shadow-sm">
              <div className="mb-2 h-1 w-8 rounded-full bg-gold-500" />
              <h3 className="font-semibold text-brand-800">{p.title}</h3>
              <p className="mt-1 text-sm leading-6 text-muted">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* لمحة من الصور */}
      <section className="mt-10 md:mt-14">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-bold text-brand-800 md:text-2xl">لمحة من المدرسة</h2>
          <Link to="/gallery" className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-900">
            عرض الكل <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        <div className="no-scrollbar -mx-4 mt-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
          {gallery.slice(3, 7).map((g) => (
            <Link
              key={g.id}
              to="/gallery"
              className="group relative w-56 shrink-0 snap-start overflow-hidden rounded-2xl md:w-auto"
            >
              <img src={img(g.image, 'sm')} alt={g.title} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-900/80 to-transparent p-3 pt-8 text-sm font-medium text-white">
                {g.title}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* دعوة للتبرع */}
      <section className="my-10 overflow-hidden rounded-3xl bg-brand-700 p-6 text-white md:my-14 md:flex md:items-center md:justify-between md:p-10">
        <div>
          <h2 className="text-2xl font-bold md:text-3xl">كن شريكاً في الأجر</h2>
          <p className="mt-2 max-w-lg text-sand-100/85">
            مساهمتك تدعم استمرار حلقات التحفيظ وصيانة المرافق وتجهيز الفصول — صدقة جارية بإذن الله.
          </p>
        </div>
        <Link
          to="/donate"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 font-semibold text-brand-900 transition hover:bg-gold-300 md:mt-0"
        >
          <HandHeart className="h-5 w-5" /> تبرّع الآن
        </Link>
      </section>
    </div>
  )
}
