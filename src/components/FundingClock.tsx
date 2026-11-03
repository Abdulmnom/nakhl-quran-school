import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { CalendarDays, Coins, TrendingUp } from 'lucide-react'
import { donation } from '../data/donation'

const fmt = (n: number) => Math.round(n).toLocaleString('en-US')
const R = 88
const C = 2 * Math.PI * R

/** «الساعة المالية» — حلقة تقدم متحركة تعرض المتوفر من المستهدف */
export default function FundingClock({ compact = false }: { compact?: boolean }) {
  const { target, raised, date } = donation.progress
  const pct = (raised / target) * 100
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const v = useMotionValue(0)
  const dash = useTransform(v, (p) => C - (C * p) / 100)
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!inView) return
    const ctl = animate(v, pct, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: setShown })
    return () => ctl.stop()
  }, [inView, pct, v])

  return (
    <div ref={ref} className={`grid items-center gap-6 ${compact ? 'sm:grid-cols-[auto_1fr]' : 'md:grid-cols-[auto_1fr] md:gap-10'}`}>
      <div className={`relative mx-auto ${compact ? 'h-52 w-52' : 'h-56 w-56 md:h-64 md:w-64'}`}>
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
          <circle cx="100" cy="100" r={R} fill="none" stroke="var(--color-sand-200)" strokeWidth="14" />
          <motion.circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke="url(#clock-grad)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={C}
            style={{ strokeDashoffset: dash }}
          />
          <defs>
            <linearGradient id="clock-grad" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--color-brand-500)" />
              <stop offset="100%" stopColor="var(--color-gold-500)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="text-sm text-muted">المستهدف</div>
            <div className="font-kufi text-4xl font-bold text-gold-600 md:text-5xl">{fmt(target / 1000)} ألف</div>
            <div className="text-sm text-muted">ريال عُماني</div>
            <div className="mt-1 inline-block rounded-full bg-brand-50 px-3 py-0.5 text-sm font-bold text-brand-700">
              {shown.toLocaleString('en-US', { maximumFractionDigits: 1 })}%
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gold-300 bg-gold-100 px-3 py-1 text-sm text-gold-600">
          <CalendarDays className="h-4 w-4" /> بتاريخ {date}
        </div>
        <Stat icon={Coins} label="المبلغ المتوفر" value={`${fmt(raised / 1000)} ألف`} tone="brand" />
        <Stat icon={Coins} label="المبلغ المتبقي" value={`${fmt((target - raised) / 1000)} ألف`} tone="gold" />
        <Stat icon={TrendingUp} label="نسبة الإنجاز المالي" value={`${pct.toLocaleString('en-US', { maximumFractionDigits: 1 })}%`} tone="brand" />
      </div>
    </div>
  )
}

function Stat({ icon: Icon, label, value, tone }: { icon: typeof Coins; label: string; value: string; tone: 'brand' | 'gold' }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-sand-200 bg-white p-4 shadow-sm">
      <span
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${
          tone === 'brand' ? 'bg-brand-700 text-gold-300' : 'bg-gold-500 text-brand-900'
        }`}
      >
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <div className="text-sm text-muted">{label}</div>
        <div className={`font-kufi text-2xl font-bold ${tone === 'brand' ? 'text-brand-800' : 'text-gold-600'}`}>
          {value} <span className="text-sm font-medium text-muted">{label.startsWith('نسبة') ? '' : 'ريال عُماني'}</span>
        </div>
      </div>
    </div>
  )
}
