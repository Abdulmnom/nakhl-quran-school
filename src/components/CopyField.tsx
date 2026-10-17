import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

type Props = { label: string; value: string; ltr?: boolean }

export default function CopyField({ label, value, ltr }: Props) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value.replace(/\s/g, ltr ? '' : ' '))
    } catch {
      const ta = document.createElement('textarea')
      ta.value = value
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="flex items-center justify-between gap-3 border-b border-sand-200 py-3 last:border-0">
      <div className="min-w-0">
        <div className="text-xs text-muted">{label}</div>
        <div
          className={`mt-0.5 truncate font-semibold text-ink ${ltr ? 'font-mono text-[15px] tracking-wide' : ''}`}
          dir={ltr ? 'ltr' : undefined}
          style={ltr ? { textAlign: 'right' } : undefined}
        >
          {value}
        </div>
      </div>
      <button
        onClick={copy}
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
          copied
            ? 'border-brand-500 bg-brand-50 text-brand-700'
            : 'border-sand-300 bg-white text-brand-800 hover:bg-sand-50'
        }`}
        aria-label={`نسخ ${label}`}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'تم النسخ' : 'نسخ'}
      </button>
    </div>
  )
}
