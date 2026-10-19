type Props = { className?: string; variant?: 'mark' | 'full' | 'white' }

const sources = {
  mark: '/logo-mark.png',
  full: '/logo-full.png',
  white: '/logo-mark-white.png',
}

/** شعار المدرسة القرآنية الوقفية بولاية نخل — mark: الرمز فقط، full: الشعار مع النص، white: الرمز بالأبيض */
export default function Logo({ className = 'h-10 w-auto', variant = 'mark' }: Props) {
  return (
    <img
      src={sources[variant]}
      alt={variant === 'full' ? 'شعار المدرسة القرآنية الوقفية بولاية نخل' : ''}
      aria-hidden={variant === 'full' ? undefined : true}
      className={`object-contain ${className}`}
      draggable={false}
    />
  )
}
