type Props = { className?: string; mono?: boolean }

/** شعار المدرسة: قوس بقبة فوق مصحف مفتوح */
export default function Logo({ className = 'h-10 w-10', mono = false }: Props) {
  const green = mono ? 'currentColor' : '#1F5A45'
  const gold = mono ? 'currentColor' : '#C9A24A'
  return (
    <svg viewBox="8 10 104 96" className={className} aria-hidden="true">
      <path d="M60 14c3 6 9 9 9 9s-6 2-9 8c-3-6-9-8-9-8s6-3 9-9z" fill={gold} />
      <path d="M28 76V50c0-14 14-24 32-28 18 4 32 14 32 28v26" fill="none" stroke={green} strokeWidth="7" strokeLinejoin="round" />
      <path d="M42 76V56c0-8 8-14 18-17 10 3 18 9 18 17v20" fill="none" stroke={gold} strokeWidth="4.5" />
      <path d="M56 76V62c0-3 2-5 4-6 2 1 4 3 4 6v14z" fill={green} />
      <path d="M16 82c16-6 30-4 44 6 14-10 28-12 44-6v8c-16-5-30-3-44 7-14-10-28-12-44-7z" fill={green} />
      <path d="M22 92c13-3 26-1 38 8 12-9 25-11 38-8" fill="none" stroke={gold} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
