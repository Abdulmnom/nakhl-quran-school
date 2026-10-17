import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type Props = { title: string; subtitle?: string }

export default function PageHeader({ title, subtitle }: Props) {
  const navigate = useNavigate()
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 pb-4 md:pt-10">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-sand-200 bg-white text-brand-700 shadow-sm transition hover:bg-brand-50 md:hidden"
          aria-label="رجوع"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-brand-800 md:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted md:text-base">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}
