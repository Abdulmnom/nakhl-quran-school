import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { HandHeart } from 'lucide-react'
import { useEffect, useState } from 'react'
import Logo from './Logo'
import { navItems } from './nav'
import { OpeningModal, OpeningOverlay, SHEIKH_LAYOUT_ID, readActivated } from './OpeningWord'
import { site } from '../data/site'
import { opening } from '../data/project'
import { img } from '../data/gallery'

export default function Layout() {
  const location = useLocation()
  const [activated, setActivated] = useState(readActivated)
  const [quoteOpen, setQuoteOpen] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <div className="min-h-dvh pattern-bg flex flex-col">
      {/* الشريط العلوي */}
      <header className="sticky top-0 z-40 border-b border-sand-200/80 bg-sand-50/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link to="/home" className="flex items-center gap-2.5">
            <Logo className="h-11 w-auto" />
            <div className="leading-tight">
              <div className="text-[15px] font-bold text-brand-800 sm:text-base">{site.name}</div>
              <div className="hidden text-xs text-muted sm:block">{site.subtitle}</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="التنقل الرئيسي">
            {navItems.slice(0, 3).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-brand-700 text-white' : 'text-brand-800 hover:bg-brand-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/donate"
              className="hidden items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-brand-900 shadow-sm transition hover:bg-gold-300 md:inline-flex"
            >
              <HandHeart className="h-4 w-4" />
              ساهم في سهم وقفي
            </Link>

            {/* صورة سماحة الشيخ — تستقر هنا بعد تفعيل الموقع */}
            {activated && (
              <button
                onClick={() => setQuoteOpen(true)}
                className="relative grid h-12 w-12 shrink-0 place-items-center"
                aria-label={`كلمة ${opening.speaker}`}
                title={`كلمة ${opening.speaker}`}
              >
                <motion.span
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'conic-gradient(var(--color-gold-300), var(--color-brand-500), var(--color-gold-500), var(--color-gold-300))' }}
                  initial={{ opacity: 0, rotate: 0 }}
                  animate={{ opacity: 1, rotate: 360 }}
                  transition={{ opacity: { delay: 0.9 }, rotate: { duration: 6, repeat: Infinity, ease: 'linear' } }}
                />
                <motion.img
                  layoutId={SHEIKH_LAYOUT_ID}
                  src={img(opening.image)}
                  alt=""
                  className="relative h-11 w-11 rounded-full border-2 border-sand-50 object-cover"
                  transition={{ type: 'spring', stiffness: 70, damping: 15, mass: 1.1 }}
                  style={{ borderRadius: '9999px' }}
                />
                <motion.span
                  className="absolute -bottom-0.5 -left-0.5 h-3.5 w-3.5 rounded-full border-2 border-sand-50 bg-gold-500"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.4, 1] }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="hidden border-t border-sand-200 bg-brand-800 text-sand-100 md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 text-sm">
          <div className="flex items-center gap-2">
            <Logo className="h-7 w-auto" variant="white" />
            <span>{site.name} — منصة رقمية لخدمة كتاب الله</span>
          </div>
        </div>
      </footer>

      <AnimatePresence>{!activated && <OpeningOverlay key="opening" onActivate={() => setActivated(true)} />}</AnimatePresence>
      <OpeningModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />

      {/* شريط التنقل السفلي للجوال */}
      <nav
        className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-sand-200 bg-white/95 backdrop-blur-md md:hidden"
        aria-label="التنقل السفلي"
      >
        <ul className="mx-auto grid max-w-md grid-cols-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                    isActive ? 'text-brand-700' : 'text-muted'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute top-0 h-[3px] w-10 rounded-b-full bg-gold-500"
                      />
                    )}
                    <Icon className="h-[22px] w-[22px]" strokeWidth={isActive ? 2.3 : 1.8} />
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
